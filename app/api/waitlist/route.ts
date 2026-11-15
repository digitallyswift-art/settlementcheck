import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window IP Rate Limiter (10 signups / hr / IP) ────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'waitlist',
      limit: 10,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before joining the waitlist again.' },
        {
          status: 429,
          headers: getRateLimitHeaders(10, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body = await req.json()

    // ── 2. Honeypot Bot Trap ────────────────────────────────────────────────
    if (body.website_hp || body.hp_field || body.company_url_hp) {
      return NextResponse.json({ success: true, message: 'Joined waitlist' }, { status: 200 })
    }

    const { email } = body

    if (!email) {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Upsert to avoid duplicate errors - if already on list, update verified_at
    const { error } = await supabase.from('employee_waitlist').upsert(
      {
        email,
        verified_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    )

    if (error) {
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: 'Failed to add to waitlist' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
