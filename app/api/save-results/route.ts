import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window IP Rate Limiter (15 saves / hr / IP) ──────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'save-results',
      limit: 15,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before saving results again.' },
        {
          status: 429,
          headers: getRateLimitHeaders(15, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body = await req.json()

    // ── 2. Honeypot Bot Trap ────────────────────────────────────────────────
    if (body.website_hp || body.hp_field || body.company_url_hp) {
      return NextResponse.json({ success: true, message: 'Results emailed' }, { status: 200 })
    }

    const {
      email,
      salary,
      yearsNum,
      monthsNum,
      age,
      offer,
      offerIncludesNotice,
      reason,
      discrimination,
      contractualNotice,
      verdict,
      minimum,
      typicalLow,
      typicalHigh,
      typicalHighUncapped,
      estimatedNet,
      jurisdiction,
    } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const safeEmail = email.trim().toLowerCase()

    // Save to Supabase
    const { error: insertError } = await supabase.from('email_captures').insert({
      email:               safeEmail,
      salary:              salary ?? null,
      years_service:       yearsNum ?? null,
      months_service:      monthsNum ?? null,
      age:                 age ?? null,
      offer_amount:        offer ?? null,
      reason:              reason ?? null,
      discrimination:      discrimination ?? null,
      contractual_notice:  contractualNotice ?? null,
      verdict:             verdict ?? null,
      minimum:             minimum ?? null,
      typical_low:         typicalLow ?? null,
      typical_high:        typicalHighUncapped ? null : (typicalHigh ?? null),
      estimated_net:       estimatedNet ?? null,
      jurisdiction:        jurisdiction ?? 'GB',
    })

    if (insertError) {
      console.error('Email capture insert error:', insertError)
      // Non-fatal — still send the email even if Supabase insert fails
    }

    // Format helpers
    const fmt = (n: number | null) => n != null ? `£${Math.round(n).toLocaleString('en-GB')}` : 'N/A'

    const verdictLabel: Record<string, string> = {
      BELOW_MINIMUM: 'Below the notice and redundancy figures calculated',
      BELOW_TYPICAL: 'Below the calculator reference range',
      WITHIN_RANGE:  'Within the calculator reference range',
      ABOVE_TYPICAL: 'Above the calculator reference range',
    }
    const verdictColor: Record<string, string> = {
      BELOW_MINIMUM: '#a8341f',
      BELOW_TYPICAL: '#b5802a',
      WITHIN_RANGE:  '#0B1F3A',
      ABOVE_TYPICAL: '#0B1F3A',
    }

    const vLabel = verdictLabel[verdict] ?? verdict
    const vColor = verdictColor[verdict] ?? '#0B1F3A'
    const rangeHigh = typicalHighUncapped ? 'Potentially uncapped' : fmt(typicalHigh)
    const jurisdictionLabel = jurisdiction === 'NI' ? 'Northern Ireland' : 'England, Scotland and Wales'

    // Build frictionless 1-click return URL straight to the single-screen solicitor card on /results/
    const returnParams = new URLSearchParams()
    if (salary != null) returnParams.set('salary', String(salary))
    if (yearsNum != null) returnParams.set('yearsNum', String(yearsNum))
    if (monthsNum != null) returnParams.set('monthsNum', String(monthsNum))
    if (age != null) returnParams.set('age', String(age))
    if (offer != null) returnParams.set('offer', String(offer))
    if (offerIncludesNotice != null) returnParams.set('offerIncludesNotice', String(offerIncludesNotice))
    if (reason) returnParams.set('reason', String(reason))
    if (discrimination) returnParams.set('discrimination', String(discrimination))
    if (contractualNotice != null) returnParams.set('contractualNotice', String(contractualNotice))
    if (jurisdiction) returnParams.set('jurisdiction', String(jurisdiction))
    returnParams.set('email', safeEmail)
    returnParams.set('focus', 'intake')
    const returnQuery = returnParams.toString()
    const oneClickMatchUrl = `https://settlementcheck.co.uk/results/?${returnQuery}#solicitor-intake-card`

    const textBody = [
      'SettlementCheck - Your Settlement Figures & Solicitor Checklist',
      '================================================================',
      '',
      `Verdict: ${vLabel}`,
      `Jurisdiction: ${jurisdictionLabel} (2026/27 rates)`,
      '',
      `Your offer:                    ${fmt(offer)}`,
      `Calculated statutory baseline: ${fmt(minimum)}`,
      `Typical negotiated range:      ${fmt(typicalLow)} to ${rangeHigh}`,
      `Estimated net take-home:       ${fmt(estimatedNet)}`,
      '',
      'Your 3-Point Solicitor Call Checklist:',
      '1. Tax split: Confirm the first £30,000 genuine termination payment is tax-free (ITEPA 2003 s.403) and notice pay (PILON) is separated correctly (s.402D).',
      '2. Non-financial terms: Check agreed reference wording, confidentiality clauses, accrued holiday pay, and any post-exit restrictions.',
      '3. Legal fee contribution: Check the employer fee contribution clause (typically £350 to £500+ +VAT paid upon completion).',
      '',
      'Ready to speak with an SRA-regulated employment solicitor? (1-click, details pre-filled):',
      oneClickMatchUrl,
      '',
      '----------------------------------------------------------------',
      'SettlementCheck • United Kingdom • team@settlementcheck.co.uk',
      'Estimate based on UK statutory rates (ERA 1996, ITEPA 2003). Not legal advice.',
      'SettlementCheck is an introduction service, not a law firm. Employer fee contributions are standard commercial practice upon completion; fees above the cap or abortive costs remain subject to your solicitor\'s terms. This email was sent once because you requested your calculation.',
    ].join('\n')

    await resend.emails.send({
      from:    'SettlementCheck <team@settlementcheck.co.uk>',
      replyTo: 'team@settlementcheck.co.uk',
      to:      safeEmail,
      subject: 'Your settlement figures & solicitor checklist - SettlementCheck',
      text:    textBody,
      html: `
        <!-- Hidden Preheader -->
        <div style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
          Your settlement figures &amp; 3-point solicitor checklist. Estimated net: ${fmt(estimatedNet)}.
        </div>

        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid #E2DCCE;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="vertical-align:middle;padding-right:10px;">
                  <img src="https://settlementcheck.co.uk/email-logo.png" width="28" height="28" alt="" style="display:block;width:28px;height:28px;border-radius:6px;border:0;" />
                </td>
                <td style="vertical-align:middle;">
                  <span style="font-size:17px;font-weight:700;color:#0B1F3A;letter-spacing:-0.015em;">SettlementCheck</span>
                </td>
              </tr>
            </table>
          </div>

          <h1 style="font-size:22px;font-weight:700;color:#0B1F3A;margin:0 0 8px;letter-spacing:-0.02em;">Your settlement figures &amp; checklist</h1>
          <p style="color:#5B6577;font-size:14px;margin:0 0 24px;">Here is a private copy of your calculation and a quick checklist to bring to your solicitor call when you are ready.</p>

          <div style="background:#F7F4EE;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8A93A3;margin:0 0 6px;">Summary</p>
            <p style="font-size:20px;font-weight:700;color:${vColor};margin:0 0 4px;">${vLabel}</p>
            <p style="font-size:13px;color:#5B6577;margin:0;">Based on ${jurisdictionLabel} rates (2026/27)</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
            <tr style="border-bottom:1px solid #E2DCCE;">
              <td style="padding:10px 0;color:#5B6577;width:55%;">Your offer</td>
              <td style="padding:10px 0;color:#0B1F3A;font-weight:600;text-align:right;">${fmt(offer)}</td>
            </tr>
            <tr style="border-bottom:1px solid #E2DCCE;">
              <td style="padding:10px 0;color:#5B6577;">Calculated statutory baseline</td>
              <td style="padding:10px 0;color:#0B1F3A;font-weight:600;text-align:right;">${fmt(minimum)}</td>
            </tr>
            <tr style="border-bottom:1px solid #E2DCCE;">
              <td style="padding:10px 0;color:#5B6577;">Typical negotiated range</td>
              <td style="padding:10px 0;color:#0B1F3A;font-weight:600;text-align:right;">${fmt(typicalLow)} to ${rangeHigh}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#5B6577;">Estimated net take-home</td>
              <td style="padding:10px 0;color:#0B1F3A;font-weight:600;text-align:right;">${fmt(estimatedNet)}</td>
            </tr>
          </table>

          <div style="background:#FAF8F5;border:1px solid #E2DCCE;border-radius:10px;padding:18px 20px;margin-bottom:24px;">
            <p style="font-size:14px;font-weight:700;color:#0B1F3A;margin:0 0 10px;">3-point solicitor call checklist</p>
            <ol style="margin:0;padding-left:18px;font-size:13px;color:#5B6577;line-height:1.6;">
              <li style="margin-bottom:6px;"><strong style="color:#0B1F3A;">Tax split:</strong> Check the £30,000 tax-free exemption (ITEPA 2003 s.403) and that notice pay (PILON) is separated correctly.</li>
              <li style="margin-bottom:6px;"><strong style="color:#0B1F3A;">Contract terms:</strong> Review your agreed reference wording, accrued holiday pay, and any post-exit restrictions.</li>
              <li><strong style="color:#0B1F3A;">Employer fee contribution:</strong> Confirm the employer legal fee contribution clause (typically £350 to £500+ +VAT paid upon completion).</li>
            </ol>
          </div>

          <a href="https://settlementcheck.co.uk/results/?${returnQuery}#solicitor-intake-card"
             style="display:inline-block;background:#D9603B;color:#fff;font-size:15px;font-weight:700;padding:14px 24px;border-radius:8px;text-decoration:none;letter-spacing:-0.01em;">
            Speak with an SRA solicitor (details pre-filled) &rarr;
          </a>

          <p style="font-size:12px;color:#5B6577;margin:12px 0 0;line-height:1.5;">
            1-click link: your email and calculation figures are already loaded on one screen. Most reviews complete within 24 to 48 hours.
          </p>

          <div style="margin-top:36px;padding-top:20px;border-top:1px solid #E2DCCE;">
            <p style="font-size:11px;color:#8A93A3;line-height:1.6;margin:0 0 6px;">
              SettlementCheck &bull; United Kingdom &bull; <a href="mailto:team@settlementcheck.co.uk" style="color:#8A93A3;">team@settlementcheck.co.uk</a>
            </p>
            <p style="font-size:11px;color:#8A93A3;line-height:1.6;margin:0;">
              Estimate based on UK statutory rates (ERA 1996, ITEPA 2003). Not legal advice. SettlementCheck is an independent introducer, not a law firm. Employer fee contributions are standard commercial practice paid upon completion; work exceeding the cap or abortive costs remain subject to your solicitor&apos;s terms. This email was sent once because you requested your calculation.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Save results error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
