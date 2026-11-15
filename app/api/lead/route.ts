import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyOtpSessionToken } from '@/lib/security/otp-tokens'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'
import { ingestLead } from '@/lib/leads/lead-ingestion-service'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Edge-compatible sliding-window rate limit (10 / hr / IP) ─────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'lead-submit',
      limit: 10,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait before submitting another enquiry.' },
        {
          status: 429,
          headers: getRateLimitHeaders(10, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body = await req.json()

    // ── 2. Honeypot Bot Trap (Silent drop to prevent bot learning) ───────────
    if (body.website_hp || body.hp_field || body.company_url_hp) {
      return NextResponse.json(
        { success: true, triageId: 'SC-HP-BOT', message: 'Enquiry received' },
        { status: 200 }
      )
    }

    const {
      first_name,
      firstName,
      email,
      phone,
      contact_time,
      contactTime,
      verdict,
      offer_amount,
      offerAmount,
      salary,
      months_service,
      monthsService,
      consent,
      postcode,
      postcode_region,
      postcode_lat,
      postcode_lng,
      partner_id,
      partnerId,
      source_url,
      sourceUrl,
      benchmark_data,
      verification_token,
      verificationToken,
      token,
    } = body

    const leadFirstName = (firstName || first_name || '').trim()
    const leadEmail = (email || '').trim().toLowerCase()
    const leadPhone = (phone || '').trim()

    // ── 3. Input Validation ─────────────────────────────────────────────────
    if (!leadFirstName || !leadEmail || !leadPhone || !consent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(leadEmail)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // ── 4. Cryptographic OTP Verification with Graceful Fallback ────────────
    // Priority 1: Signed HMAC-SHA256 OTP session verification token (SC-E-SEC-005)
    const authHeader = req.headers.get('authorization')
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : null
    const candidateToken = verificationToken || verification_token || token || bearerToken

    let isOtpVerified = false

    if (candidateToken && typeof candidateToken === 'string') {
      isOtpVerified = verifyOtpSessionToken(candidateToken, leadEmail, 'employee')
    }

    // Priority 2: Database fallback to recent verified OTP record (within last 30 minutes)
    if (!isOtpVerified) {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString()
      const { data: verifiedOtp, error: otpCheckError } = await supabase
        .from('otp_codes')
        .select('id, used, created_at')
        .eq('email', leadEmail)
        .eq('form_type', 'employee')
        .eq('used', true)
        .gte('created_at', thirtyMinutesAgo)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (otpCheckError) {
        console.warn('Fallback OTP database check warning:', otpCheckError)
      }

      if (verifiedOtp) {
        isOtpVerified = true
      }
    }

    // Priority 3: Local dev bypass strictly for local testing environments
    if (!isOtpVerified && process.env.NODE_ENV === 'development' && leadEmail.includes('test')) {
      isOtpVerified = true
    }

    if (!isOtpVerified) {
      return NextResponse.json(
        { error: 'Email must be verified with OTP before submitting' },
        { status: 403 }
      )
    }

    // ── 5. Ingestion via Unified Lead Service ────────────────────────────────
    const result = await ingestLead({
      firstName: leadFirstName,
      email: leadEmail,
      phone: leadPhone,
      contactTime: contactTime || contact_time,
      verdict,
      offerAmount: offerAmount ?? offer_amount,
      salary,
      monthsService: monthsService ?? months_service,
      consent: true,
      postcode,
      postcodeRegion: postcode_region,
      postcodeLat: postcode_lat,
      postcodeLng: postcode_lng,
      partnerId: partnerId ?? partner_id,
      sourceUrl: sourceUrl ?? source_url,
      benchmarkData: benchmark_data,
      emailVerified: true,
    })

    return NextResponse.json({
      success: true,
      triageId: result.triageId,
      leadId: result.leadId,
      triage: {
        matterTier: result.triage.matterTier,
        tenureClassification: result.triage.employment.tenureClassification,
        legalFeeStatus: result.triage.commercialOffer.legalFeeStatus,
        limitationRisk: result.triage.regulatoryLimitation.limitationRisk,
      },
    })
  } catch (err: any) {
    console.error('Lead submission error:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
