import { NextRequest, NextResponse } from 'next/server'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'
import { ingestLead, verifyPartnerId } from '@/lib/leads/lead-ingestion-service'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window rate limiter ──────────────────────────────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'b2b-widget-leads',
      limit: 20,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded for widget submissions. Please wait before retrying.' },
        {
          status: 429,
          headers: getRateLimitHeaders(20, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body = await req.json()

    // ── 2. Honeypot Bot Trap ────────────────────────────────────────────────
    if (body.website_hp || body.hp_field || body.company_url_hp) {
      return NextResponse.json(
        { success: true, lead_id: 'hp-bot-intercept', is_b2b: false },
        { status: 200 }
      )
    }

    const {
      first_name,
      firstName,
      email,
      phone,
      verdict,
      offer_amount,
      offerAmount,
      salary,
      months_service,
      monthsService,
      consent,
      partner_id,
      partnerId,
      source_url,
      sourceUrl,
      benchmark_data,
      benchmarkData,
      postcode,
      postcode_region,
    } = body

    const leadFirstName = (firstName || first_name || '').trim()
    const leadEmail = (email || '').trim().toLowerCase()
    const leadPhone = (phone || '').trim()

    if (!leadFirstName || !leadEmail || !leadPhone) {
      return NextResponse.json({ error: 'Missing required contact fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(leadEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── 3. Partner Verification against SRA Solicitor Panel ─────────────────
    const rawPartnerId = partnerId || partner_id
    const partnerCheck = await verifyPartnerId(rawPartnerId)

    // ── 4. Unified Ingestion ────────────────────────────────────────────────
    const result = await ingestLead({
      firstName: leadFirstName,
      email: leadEmail,
      phone: leadPhone,
      verdict,
      offerAmount: offerAmount ?? offer_amount,
      salary,
      monthsService: monthsService ?? months_service,
      consent: consent ?? true,
      partnerId: rawPartnerId,
      sourceUrl: sourceUrl || source_url,
      benchmarkData: benchmarkData || benchmark_data,
      postcode,
      postcodeRegion: postcode_region,
      emailVerified: false, // Widget leads enter standard triage pipeline
    })

    return NextResponse.json({
      success: true,
      lead_id: result.leadId,
      triage_id: result.triageId,
      target_email: partnerCheck.verified ? partnerCheck.targetEmail : 'settlementcheck',
      is_b2b: partnerCheck.verified,
      partner_firm: partnerCheck.firmName || 'SettlementCheck',
      clio_matter_payload: result.clioPayload,
      leap_matter_payload: result.leapPayload,
    })
  } catch (err: any) {
    console.error('B2B Widget lead error:', err)
    return NextResponse.json(
      { error: err?.message || 'Failed to process widget lead' },
      { status: 500 }
    )
  }
}
