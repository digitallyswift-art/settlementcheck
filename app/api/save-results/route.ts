import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      salary,
      yearsNum,
      monthsNum,
      age,
      offer,
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
    } = await req.json()

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
      BELOW_MINIMUM: 'Below your legal minimum',
      BELOW_TYPICAL: 'Below the typical range',
      WITHIN_RANGE:  'Within the typical range',
      ABOVE_TYPICAL: 'Above the typical range',
    }
    const verdictColor: Record<string, string> = {
      BELOW_MINIMUM: '#a8341f',
      BELOW_TYPICAL: '#b5802a',
      WITHIN_RANGE:  '#4f7060',
      ABOVE_TYPICAL: '#4f7060',
    }

    const vLabel = verdictLabel[verdict] ?? verdict
    const vColor = verdictColor[verdict] ?? '#0B1F3A'
    const rangeHigh = typicalHighUncapped ? 'Potentially uncapped' : fmt(typicalHigh)
    const jurisdictionLabel = jurisdiction === 'NI' ? 'Northern Ireland' : 'England, Scotland and Wales'

    await resend.emails.send({
      from:    'SettlementCheck <noreply@settlementcheck.co.uk>',
      to:      safeEmail,
      subject: 'Your settlement calculation results - SettlementCheck',
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:40px 24px;background:#fff;">
          <div style="margin-bottom:28px;">
            <span style="font-size:18px;font-weight:700;color:#0B1F3A;letter-spacing:-0.015em;">SettlementCheck</span>
          </div>

          <h1 style="font-size:22px;font-weight:700;color:#0B1F3A;margin:0 0 8px;letter-spacing:-0.02em;">Your settlement calculation</h1>
          <p style="color:#5B6577;font-size:14px;margin:0 0 28px;">Here are the results from your calculation, based on the details you provided. Keep this for reference.</p>

          <div style="background:#F7F4EE;border-radius:10px;padding:20px 24px;margin-bottom:24px;">
            <p style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:#8A93A3;margin:0 0 6px;">Verdict</p>
            <p style="font-size:20px;font-weight:700;color:${vColor};margin:0 0 4px;">${vLabel}</p>
            <p style="font-size:13px;color:#5B6577;margin:0;">Based on ${jurisdictionLabel} rates (2025/26)</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:24px;">
            <tr style="border-bottom:1px solid #E2DCCE;">
              <td style="padding:10px 0;color:#5B6577;width:55%;">Your offer</td>
              <td style="padding:10px 0;color:#0B1F3A;font-weight:600;text-align:right;">${fmt(offer)}</td>
            </tr>
            <tr style="border-bottom:1px solid #E2DCCE;">
              <td style="padding:10px 0;color:#5B6577;">Legal minimum</td>
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

          <div style="background:#FBF0EE;border-radius:10px;padding:18px 20px;margin-bottom:28px;">
            <p style="font-size:14px;font-weight:600;color:#0B1F3A;margin:0 0 6px;">What happens next?</p>
            <p style="font-size:13px;color:#5B6577;line-height:1.6;margin:0;">Your employer is legally required to contribute to the cost of your independent legal advice on any settlement agreement. A solicitor review is free to you and takes 24 to 48 hours. You are under no obligation after the first call.</p>
          </div>

          <a href="https://settlementcheck.co.uk/calculator"
             style="display:inline-block;background:#D9603B;color:#fff;font-size:15px;font-weight:600;padding:13px 24px;border-radius:6px;text-decoration:none;letter-spacing:-0.01em;">
            Get matched with a solicitor
          </a>

          <div style="margin-top:40px;padding-top:20px;border-top:1px solid #E2DCCE;">
            <p style="font-size:11px;color:#8A93A3;line-height:1.6;margin:0;">
              Estimate based on UK statutory rates (ERA 1996, ITEPA 2003). Not legal advice. SettlementCheck is an introduction service, not a law firm. This email was sent once because you requested it and will not be used for marketing.
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
