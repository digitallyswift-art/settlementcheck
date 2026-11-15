import { NextRequest, NextResponse } from 'next/server'
import { SraLeadTriageInput } from '@/lib/leads/triage-contract'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'
import { ingestLead } from '@/lib/leads/lead-ingestion-service'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window rate limiter ──────────────────────────────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'leads-submit-api',
      limit: 20,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded. Please try again later.' },
        {
          status: 429,
          headers: getRateLimitHeaders(20, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body: SraLeadTriageInput & { website_hp?: string; hp_field?: string } = await req.json()

    // ── 2. Honeypot check ───────────────────────────────────────────────────
    if (body.website_hp || body.hp_field) {
      return NextResponse.json(
        { success: true, triageId: 'SC-HP-BOT', message: 'Triage received' },
        { status: 200 }
      )
    }

    const { firstName, email, phone } = body

    if (!firstName || !email || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required contact fields: firstName, email, and phone are mandatory.' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address provided.' },
        { status: 400 }
      )
    }

    // ── 3. Unified Ingestion ────────────────────────────────────────────────
    const result = await ingestLead({
      firstName: body.firstName,
      email: body.email,
      phone: body.phone,
      contactTime: body.preferredContactTime,
      salary: body.salary,
      monthsService: body.monthsService,
      offerAmount: body.offerAmount,
      verdict: body.verdict,
      disputeReason: body.disputeReason,
      hasDiscrimination: body.hasDiscrimination,
      documentReadiness: body.documentReadiness,
      postcode: body.postcode,
      postcodeRegion: body.postcodeRegion,
      sourceUrl: body.sourceUrl,
      consent: true,
    })

    return NextResponse.json({
      success: true,
      triageId: result.triageId,
      triage: result.triage,
      clioPayload: result.clioPayload,
      leapPayload: result.leapPayload,
    })
  } catch (err: any) {
    console.error('SRA Lead submission error:', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
