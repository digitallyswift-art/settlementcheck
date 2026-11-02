import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { evaluateSraLeadTriage } from '@/lib/leads/triage-contract'

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

    // ── Deterministic SRA Solicitor Triage Evaluation ───────────────────────
    const triage = evaluateSraLeadTriage({
      firstName: first_name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      preferredContactTime: safeContactTime as 'Morning' | 'Afternoon' | 'Evening',
      postcode: postcode ?? undefined,
      postcodeRegion: postcode_region ?? undefined,
      salary: salary != null ? Number(salary) : null,
      monthsService: months_service != null ? Number(months_service) : null,
      offerAmount: offer_amount != null ? Number(offer_amount) : null,
      verdict: verdict ?? null,
    })

    // ── Owner notification - isolated so an email failure never blocks the success response
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    if (notificationEmail) {
      const verdictLabel: Record<string, string> = {
        BELOW_MINIMUM: 'Below notice + redundancy figures',
        BELOW_TYPICAL: 'Below typical range',
        WITHIN_RANGE:  'Within typical range',
        ABOVE_TYPICAL: 'Above typical range',
      }
      const offerFormatted   = offer_amount != null ? `£${Number(offer_amount).toLocaleString('en-GB')}` : 'Not provided'
      const salaryFormatted  = salary       != null ? `£${Number(salary).toLocaleString('en-GB')}` : 'Not provided'
      const serviceYears     = months_service != null ? `${Math.floor(months_service / 12)}y ${months_service % 12}m` : 'Not provided'

      const recipients = notificationEmail.includes(',')
        ? notificationEmail.split(',').map(e => e.trim()).filter(Boolean)
        : notificationEmail

      try {
        await resend.emails.send({
          from:    'SettlementCheck <team@settlementcheck.co.uk>',
          to:      recipients,
          subject: `[${triage.matterTier}] ${first_name.trim()} • SRA Triage (${triage.triageId})`,
          replyTo: email.trim(),
          text: `SRA QUALIFIED SOLICITOR INTAKE DOSSIER\nReference: ${triage.triageId}\nMatter Tier: ${triage.matterTier}\n\nCLIENT CONTACT:\nName: ${triage.client.firstName}\nEmail: ${triage.client.email}\nPhone: ${triage.client.phone}\nPreferred Time: ${triage.client.preferredContactTime}\nPostcode: ${postcode || 'Not provided'}${postcode_region ? ` (${postcode_region})` : ''}\n\nSTATUTORY QUALIFICATION:\nSalary: ${salaryFormatted}\nService: ${serviceYears} (${triage.employment.tenureYears} yrs)\nTenure Status: ${triage.employment.tenureClassification === 'QUALIFIED_2_PLUS_YEARS' ? 'Qualified (2+ yrs) - Full ERA 1996 s.94/98 rights' : 'Tactical (Under 2 yrs) - Section 108 threshold applies'}\nLimitation: ${triage.regulatoryLimitation.statutoryDeadlineNotice}\n\nCOMMERCIAL & FEES:\nOffer: ${offerFormatted}\nVerdict: ${verdictLabel[verdict] ?? verdict}\nS.203(3) Fee Contribution: ${triage.commercialOffer.standardFeeBenchmark}\n\nSRA COMPLIANCE NOTES:\n${triage.sraComplianceNotes.map(n => `- ${n}`).join('\n')}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px 16px; color: #0B1F3A;">
              <div style="background: #0B1F3A; padding: 16px 20px; border-radius: 8px 8px 0 0; color: #ffffff;">
                <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #D9603B; letter-spacing: 0.1em; font-weight: 700;">
                  SRA Qualified Solicitor Intake &bull; ${triage.triageId}
                </span>
                <h1 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 6px 0 0; letter-spacing: -0.015em;">
                  ${triage.matterTier}: ${first_name.trim()}
                </h1>
              </div>

              <div style="border: 1px solid #E2DCCE; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; background: #ffffff;">
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1; width: 150px;">Client Name</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-weight: 600; border-bottom: 1px solid #F0ECE1;">${first_name.trim()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Email</td>
                    <td style="padding: 9px 0; font-weight: 500; border-bottom: 1px solid #F0ECE1;"><a href="mailto:${email.trim()}" style="color: #D9603B;">${email.trim()}</a></td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Phone</td>
                    <td style="padding: 9px 0; font-weight: 500; border-bottom: 1px solid #F0ECE1;"><a href="tel:${phone.trim()}" style="color: #D9603B;">${phone.trim()}</a></td>
                  </tr>
                  ${postcode ? `<tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Postcode</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${postcode}${postcode_region ? ` (${postcode_region})` : ''}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Preferred Contact</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-weight: 600; border-bottom: 1px solid #F0ECE1;">${safeContactTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Tenure (ERA s.108)</td>
                    <td style="padding: 9px 0; font-weight: 600; border-bottom: 1px solid #F0ECE1; color: ${triage.employment.tenureClassification === 'QUALIFIED_2_PLUS_YEARS' ? '#1e7e34' : '#856404'};">
                      ${serviceYears} (${triage.employment.tenureYears} yrs) &bull; ${triage.employment.tenureClassification}
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Annual Salary</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${salaryFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Current Offer</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${offerFormatted}</td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Verdict</td>
                    <td style="padding: 9px 0; font-weight: 600; border-bottom: 1px solid #F0ECE1; color: ${verdict === 'BELOW_MINIMUM' ? '#a8341f' : verdict === 'BELOW_TYPICAL' ? '#b5802a' : '#0B1F3A'};">${verdictLabel[verdict] ?? verdict}</td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577; border-bottom: 1px solid #F0ECE1;">Fee Contribution (s.203)</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-weight: 500; border-bottom: 1px solid #F0ECE1;">${triage.commercialOffer.standardFeeBenchmark}</td>
                  </tr>
                  <tr>
                    <td style="padding: 9px 0; color: #5B6577;">Limitation Status</td>
                    <td style="padding: 9px 0; color: #0B1F3A; font-size: 12px;">${triage.regulatoryLimitation.statutoryDeadlineNotice}</td>
                  </tr>
                </table>

                <div style="background: #F7F4EE; border-radius: 6px; padding: 12px 16px; margin-bottom: 16px;">
                  <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #5B6577; letter-spacing: 0.05em; margin-bottom: 6px;">
                    SRA Triage Advisory Notes
                  </div>
                  <ul style="margin: 0; padding-left: 18px; color: #374151; font-size: 12px; line-height: 1.5;">
                    ${triage.sraComplianceNotes.map(n => `<li>${n}</li>`).join('')}
                  </ul>
                </div>

                <div style="padding: 12px; background: #f9fafb; border-radius: 6px; font-size: 12px; color: #6b7280;">
                  Reply directly to this email to contact the lead during their preferred time: <strong>${safeContactTime}</strong>.
                </div>
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
        'Under Section 203(3) ERA 1996, independent advice is required for your agreement to be binding. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. If you choose not to sign or instructions exceed the cap, fees remain subject to your solicitor\'s terms.',
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
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">Under Section 203(3) ERA 1996, independent advice is required for your agreement to be binding. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. If you choose not to sign or instructions exceed the cap, fees remain subject to your solicitor's terms.</p>
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

    return NextResponse.json({
      success: true,
      triageId: triage.triageId,
      triage: {
        matterTier: triage.matterTier,
        tenureClassification: triage.employment.tenureClassification,
        legalFeeStatus: triage.commercialOffer.legalFeeStatus,
        limitationRisk: triage.regulatoryLimitation.limitationRisk,
      },
    })
  } catch (err) {
    console.error('Lead submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
