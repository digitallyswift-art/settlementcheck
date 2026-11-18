import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const VALID_ACTIONS = ['accept_all', 'reject_non_essential', 'custom_save', 'withdraw'] as const
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function hashClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get('x-forwarded-for')
  const rawIp = forwarded ? forwarded.split(',')[0]?.trim() : req.headers.get('x-real-ip')?.trim()
  if (!rawIp) return null

  const salt =
    process.env.CONSENT_HASH_SALT ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 16) ||
    'sc-consent-audit-v1'

  return crypto.createHash('sha256').update(`${salt}:${rawIp}`).digest('hex')
}

function sanitizePath(rawPath: unknown): string | null {
  if (typeof rawPath !== 'string' || !rawPath.trim()) return null
  // Strip any query string or hash so no financial/Article 9 URL parameters are ever logged
  const clean = rawPath.split('?')[0]?.split('#')[0]?.trim() || '/'
  return clean.slice(0, 200)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      consent_id,
      action,
      policy_version = '2026-11',
      necessary = true,
      analytics = false,
      marketing = false,
      page_path,
    } = body ?? {}

    if (typeof consent_id !== 'string' || !UUID_REGEX.test(consent_id)) {
      return NextResponse.json({ success: false, error: 'Invalid consent_id' }, { status: 400 })
    }

    if (typeof action !== 'string' || !VALID_ACTIONS.includes(action as (typeof VALID_ACTIONS)[number])) {
      return NextResponse.json({ success: false, error: 'Invalid consent action' }, { status: 400 })
    }

    if (typeof policy_version !== 'string' || policy_version.length > 32) {
      return NextResponse.json({ success: false, error: 'Invalid policy_version' }, { status: 400 })
    }

    const ipHash = hashClientIp(req)
    const userAgent = req.headers.get('user-agent')?.slice(0, 255) || null
    const cleanPath = sanitizePath(page_path)
    const consentedAt = new Date().toISOString()

    const { error } = await supabase.from('cookie_consent_logs').insert({
      consent_id,
      action,
      policy_version,
      necessary: Boolean(necessary),
      analytics: Boolean(analytics),
      marketing: Boolean(marketing),
      page_path: cleanPath,
      ip_hash: ipHash,
      user_agent: userAgent,
      consented_at: consentedAt,
    })

    if (error) {
      console.warn('[consent-audit] Supabase insert warning:', error.message)
      return NextResponse.json(
        { success: false, logged: false, consent_id, consented_at: consentedAt },
        { status: 202 }
      )
    }

    return NextResponse.json(
      { success: true, logged: true, consent_id, consented_at: consentedAt },
      { status: 201 }
    )
  } catch (err: any) {
    console.warn('[consent-audit] Route error:', err?.message)
    return NextResponse.json({ success: false, error: 'Failed to record consent audit log' }, { status: 500 })
  }
}
