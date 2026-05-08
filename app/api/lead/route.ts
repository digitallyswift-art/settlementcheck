import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const {
      first_name,
      email,
      phone,
      contact_time,
      verdict,
      offer_amount,
      salary,
      months_service,
      consent,
    } = await req.json()

    // ── Validation ──────────────────────────────────────────────────────────
    if (!first_name || !email || !phone || !consent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 })
    }

    const validContactTimes = ['Morning', 'Afternoon', 'Evening']
    const safeContactTime = validContactTimes.includes(contact_time) ? contact_time : 'Morning'

    // ── Insert into Supabase ────────────────────────────────────────────────
    const { error: insertError } = await supabase.from('leads').insert({
      first_name:     first_name.trim(),
      email:          email.trim().toLowerCase(),
      phone:          phone.trim(),
      contact_time:   safeContactTime,
      verdict:        verdict ?? 'unknown',
      offer_amount:   offer_amount ?? null,
      salary:         salary ?? null,
      months_service: months_service ?? null,
      consent:        true,
      status:         'new',
    })

    if (insertError) {
      console.error('Lead insert error:', insertError)
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
    }

    // ── Owner notification - isolated so an email failure never blocks the success response
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    if (notificationEmail) {
      const verdictLabel: Record<string, string> = {
        BELOW_MINIMUM: 'Below legal minimum',
        BELOW_TYPICAL: 'Below typical range',
        WITHIN_RANGE:  'Within typical range',
        ABOVE_TYPICAL: 'Above typical range',
      }
      const offerFormatted   = offer_amount != null ? `£${Number(offer_amount).toLocaleString('en-GB')}` : 'Not provided'
      const salaryFormatted  = salary       != null ? `£${Number(salary).toLocaleString('en-GB')}` : 'Not provided'
      const serviceYears     = months_service != null ? `${Math.floor(months_service / 12)}y ${months_service % 12}m` : 'Not provided'

      try {
      await resend.emails.send({
        from:    'SettlementCheck <noreply@settlementcheck.co.uk>',
        to:      notificationEmail,
        subject: `New lead: ${first_name.trim()} (${verdictLabel[verdict] ?? verdict})`,
        replyTo: email.trim(),
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 8px; letter-spacing: -0.02em;">New lead</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 28px;">A user has completed the calculator and requested a solicitor match.</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6; width: 160px;">Name</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${first_name.trim()}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Email</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email.trim()}" style="color: #d9603b;">${email.trim()}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Phone</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;"><a href="tel:${phone.trim()}" style="color: #d9603b;">${phone.trim()}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Preferred contact</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${safeContactTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Verdict</td>
                <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f3f4f6; color: ${verdict === 'BELOW_MINIMUM' ? '#a8341f' : verdict === 'BELOW_TYPICAL' ? '#b5802a' : '#4f7060'};">${verdictLabel[verdict] ?? verdict}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Offer amount</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${offerFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Annual salary</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${salaryFormatted}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Length of service</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500;">${serviceYears}</td>
              </tr>
            </table>
            <div style="margin-top: 32px; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Reply directly to this email to contact the lead. Their preferred time is <strong>${safeContactTime}</strong>.</p>
            </div>
          </div>
        `,
      })
      } catch (emailErr) {
        console.error('Owner notification email failed (non-fatal):', emailErr)
      }
    }

    // ── Confirmation to employee - isolated so an email failure never blocks the success response
    try {
      await resend.emails.send({
        from:    'SettlementCheck <noreply@settlementcheck.co.uk>',
        to:      email.trim(),
        subject: 'We have received your details - SettlementCheck',
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.02em;">Your details are with us</h1>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Hi ${first_name.trim()},</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">We have received your request and are matching you with a vetted employment solicitor. You should expect a call within 24 hours during your preferred time (${safeContactTime.toLowerCase()}).</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">The advice is free. Your employer is required to cover the legal fees for your independent advice on a settlement agreement.</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.6;">SettlementCheck is an introduction service, not a law firm. We connect you with SRA-regulated solicitors. We do not provide legal advice.</p>
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Employee confirmation email failed (non-fatal):', emailErr)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Lead submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
