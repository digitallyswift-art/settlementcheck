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
      postcode,
      postcode_region,
      postcode_lat,
      postcode_lng,
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
    const normalizedEmail = email.trim().toLowerCase()

    // ── OTP Verification Guard ──────────────────────────────────────────────
    // Enforce verified OTP prior to inserting lead into database
    const { data: verifiedOtp, error: otpCheckError } = await supabase
      .from('otp_codes')
      .select('id, used')
      .eq('email', normalizedEmail)
      .eq('form_type', 'employee')
      .eq('used', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (otpCheckError) {
      console.error('OTP check error:', otpCheckError)
    }

    if (!verifiedOtp) {
      return NextResponse.json({ error: 'Email must be verified with OTP before submitting' }, { status: 403 })
    }

    // ── Insert into Supabase ────────────────────────────────────────────────
    const insertPayload: any = {
      first_name:      first_name.trim(),
      email:           normalizedEmail,
      phone:           phone.trim(),
      contact_time:    safeContactTime,
      verdict:         verdict ?? 'unknown',
      offer_amount:    offer_amount ?? null,
      salary:          salary ?? null,
      months_service:  months_service ?? null,
      consent:         true,
      status:          'new',
      email_verified:  true,
      postcode:        postcode ?? null,
      postcode_region: postcode_region ?? null,
      postcode_lat:    postcode_lat ?? null,
      postcode_lng:    postcode_lng ?? null,
    }

    let { error: insertError } = await supabase.from('leads').insert(insertPayload)

    if (insertError) {
      // In case email_verified column does not exist in an older schema, retry without it
      console.warn('Initial lead insert failed, attempting fallback without email_verified column:', insertError)
      const { email_verified: _, ...fallbackPayload } = insertPayload
      const fallbackResult = await supabase.from('leads').insert(fallbackPayload)
      insertError = fallbackResult.error
    }

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
        from:    'SettlementCheck <team@settlementcheck.co.uk>',
        to:      notificationEmail,
        subject: `New lead: ${first_name.trim()} (${verdictLabel[verdict] ?? verdict})`,
        replyTo: email.trim(),
        text: `New Lead: ${first_name.trim()}\nEmail: ${email.trim()}\nPhone: ${phone.trim()}\nContact time: ${safeContactTime}\nVerdict: ${verdictLabel[verdict] ?? verdict}\nOffer: ${offerFormatted}\nSalary: ${salaryFormatted}\nService: ${serviceYears}${postcode ? `\nPostcode: ${postcode}` : ''}`,
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
              ${postcode ? `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Postcode</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${postcode}${postcode_region ? ` (${postcode_region})` : ''}</td>
              </tr>` : ''}
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
      const employeeText = [
        `Hi ${first_name.trim()},`,
        '',
        'Your details are with us.',
        `We have received your request and are matching you with a vetted employment solicitor. You should expect a call within 24 hours during your preferred time (${safeContactTime.toLowerCase()}).`,
        '',
        'The advice is free. Your employer is required to cover the legal fees for your independent advice on a settlement agreement.',
        '',
        '---',
        'SettlementCheck • United Kingdom • team@settlementcheck.co.uk',
        'SettlementCheck is an introduction service, not a law firm. We connect you with SRA-regulated solicitors. We do not provide legal advice.',
      ].join('\n')

      await resend.emails.send({
        from:    'SettlementCheck <team@settlementcheck.co.uk>',
        replyTo: 'team@settlementcheck.co.uk',
        to:      email.trim(),
        subject: 'We have received your details - SettlementCheck',
        text:    employeeText,
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
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 11px; color: #9ca3af; margin: 0;">SettlementCheck &bull; United Kingdom &bull; team@settlementcheck.co.uk</p>
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
