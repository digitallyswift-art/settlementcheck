import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { AgenticOrchestrator } from '@/lib/agentic-engine'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      first_name,
      email,
      phone,
      verdict,
      offer_amount,
      salary,
      months_service,
      consent,
      partner_id,
      source_url,
      benchmark_data
    } = body

    // ── Validation ──────────────────────────────────────────────────────────
    if (!first_name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required contact fields' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!consent) {
      return NextResponse.json({ error: 'Consent is required' }, { status: 400 })
    }

    // ── Insert into Supabase with Migration Fallback ────────────────────────
    const insertData: any = {
      first_name:      first_name.trim(),
      email:           email.trim().toLowerCase(),
      phone:           phone.trim(),
      contact_time:    'Morning', // default to morning for B2B widgets
      verdict:         verdict ?? 'unknown',
      offer_amount:    offer_amount ?? null,
      salary:          salary ?? null,
      months_service:  months_service ?? null,
      consent:         true,
      status:          'new',
      partner_id:      partner_id ?? null,
      source_url:      source_url ?? null,
      benchmark_data:  benchmark_data ?? null,
    }

    let insertError = null
    try {
      const { error } = await supabase.from('leads').insert(insertData)
      insertError = error
    } catch (dbErr) {
      insertError = dbErr
    }

    if (insertError) {
      console.warn('Primary insert failed (perhaps migration is pending), trying fallback...', insertError)
      // Strip fields that might not exist in older table structures
      const { partner_id: _, source_url: __, benchmark_data: ___, ...fallbackData } = insertData
      const { error: fallbackError } = await supabase.from('leads').insert(fallbackData)
      if (fallbackError) {
        console.error('Fallback database insert error:', fallbackError)
        return NextResponse.json({ error: 'Failed to save lead to database' }, { status: 500 })
      }
    }

    // ── Partner routing lookup ──────────────────────────────────────────────
    let targetEmail = process.env.NOTIFICATION_EMAIL
    let partnerFirmName = 'SettlementCheck'
    let isB2B = false

    if (partner_id) {
      try {
        const { data: partnerData } = await supabase
          .from('solicitor_applications')
          .select('email, firm_name')
          .eq('id', partner_id)
          .single()

        if (partnerData && partnerData.email) {
          targetEmail = partnerData.email
          partnerFirmName = partnerData.firm_name
          isB2B = true
        }
      } catch (e) {
        console.error('Partner lookup failed (non-fatal):', e)
      }
    }

    // ── Clio/LEAP-ready JSON intake schema (The CRM Moat) ───────────────────
    const nameParts = first_name.trim().split(/\s+/)
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || 'Client'

    const offerFormatted = offer_amount != null ? `£${Number(offer_amount).toLocaleString('en-GB')}` : 'Not provided'
    const salaryFormatted = salary != null ? `£${Number(salary).toLocaleString('en-GB')}` : 'Not provided'
    const serviceYears = months_service != null ? `${Math.floor(months_service / 12)}y ${months_service % 12}m` : 'Not provided'

    // ── Agentic Engine Pre-Flight Case Dossier Generation ────────────────────
    let preFlightDossier = null
    try {
      preFlightDossier = await AgenticOrchestrator.executeCaseDossier({
        firstName,
        lastName,
        email: email.trim(),
        phone: phone.trim(),
        salary: salary ? Number(salary) : 45000,
        yearsOfService: months_service ? Math.floor(months_service / 12) : 3,
        age: 38,
        employerOffer: offer_amount ? Number(offer_amount) : 0,
        disputeReason: 'redundancy',
        partnerId: partner_id || undefined,
        sourceUrl: source_url || undefined,
        consentVerified: true,
      })
    } catch (dErr) {
      console.warn('Agentic dossier generation non-fatal fallback:', dErr)
    }

    const crmIntakePayload = preFlightDossier?.crmPayload?.clioMatterPayload || {
      lead_source: 'SettlementCheck Widget',
      partner_id: partner_id || 'direct',
      source_url: source_url || 'direct',
      contact: {
        first_name: firstName,
        last_name: lastName,
        email_addresses: [
          {
            address: email.trim(),
            location: 'Work'
          }
        ],
        phone_numbers: [
          {
            number: phone.trim(),
            location: 'Mobile'
          }
        ]
      },
      matter: {
        name: `Settlement Agreement Review: ${lastName}`,
        description: `SettlementCheck Calculator Submission
---------------------------------------
Client Salary: ${salaryFormatted}
Completed Service: ${serviceYears}
Employer Offer: ${offerFormatted}
Calculated Verdict: ${verdict}
Source URL: ${source_url || 'N/A'}
Partner ID: ${partner_id || 'N/A'}
Consent Verified: Yes`,
        custom_fields: {
          salary: salary ?? null,
          months_service: months_service ?? null,
          offer_amount: offer_amount ?? null,
          verdict: verdict ?? 'unknown',
          estimated_minimum: benchmark_data?.minimum ?? null,
          typical_low: benchmark_data?.typicalLow ?? null,
          typical_high: benchmark_data?.typicalHigh ?? null,
          discrimination_element: benchmark_data?.discrimination ?? 'no'
        }
      }
    }

    // Log Clio/LEAP ready JSON payload for webhooks/integrations
    console.log('CRM Intake Payload Generated:', JSON.stringify(crmIntakePayload, null, 2))

    // ── Partner/Owner notification email ────────────────────────────────────
    if (targetEmail) {
      const verdictLabel: Record<string, string> = {
        BELOW_MINIMUM: 'Below legal minimum',
        BELOW_TYPICAL: 'Below typical range',
        WITHIN_RANGE:  'Within typical range',
        ABOVE_TYPICAL: 'Above typical range',
      }

      try {
        await resend.emails.send({
          from: 'SettlementCheck <team@settlementcheck.co.uk>',
          to: targetEmail,
          subject: `${isB2B ? '[' + partnerFirmName + ' Widget] ' : ''}New Lead: ${first_name.trim()} (${verdictLabel[verdict] ?? verdict})`,
          replyTo: email.trim(),
          text: `New Settlement Lead (${partnerFirmName})\n\nName: ${first_name.trim()}\nEmail: ${email.trim()}\nPhone: ${phone.trim()}\nVerdict: ${verdictLabel[verdict] ?? verdict}\nOffer: ${offerFormatted}\nSalary: ${salaryFormatted}\nService: ${serviceYears}${source_url ? `\nReferral: ${source_url}` : ''}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">${partnerFirmName}</span>
              </div>
              <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 8px; letter-spacing: -0.02em;">New Settlement Lead</h1>
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 28px;">A client has completed the Settlement Agreement Calculator on your embedded widget.</p>
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
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Calculator Verdict</td>
                  <td style="padding: 10px 0; font-weight: 600; border-bottom: 1px solid #f3f4f6; color: ${verdict === 'BELOW_MINIMUM' ? '#a8341f' : verdict === 'BELOW_TYPICAL' ? '#b5802a' : '#0B1F3A'};">${verdictLabel[verdict] ?? verdict}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Employer Offer</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${offerFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Annual Salary</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${salaryFormatted}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Service Length</td>
                  <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${serviceYears}</td>
                </tr>
                ${source_url ? `<tr>
                  <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Widget Referral</td>
                  <td style="padding: 10px 0; color: #111827; font-size: 13px; font-weight: 500; border-bottom: 1px solid #f3f4f6; word-break: break-all;">${source_url}</td>
                </tr>` : ''}
              </table>
              ${preFlightDossier ? `
              <div style="margin-top: 24px; padding: 20px; background: #0B1F3A; border-radius: 8px; color: #FFFFFF;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 10px;">
                  <span style="font-size: 13px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: #D9603B;">⚡ AI Pre-Flight Case Brief</span>
                  <span style="font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 4px; background: rgba(217, 96, 59, 0.25); color: #F7F4EE;">${preFlightDossier.matterSummary.strategicVerdict.replace(/_/g, ' ')}</span>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #F7F4EE;">
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Statutory Floor (ERA 1996):</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">£${preFlightDossier.statutoryAnalysis.statutoryMinimumTotal.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Target Counter-Offer:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">£${preFlightDossier.marketNegotiationBrief.recommendedCounterOffer.targetTotalPayout.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #94A3B8;">Employer Legal Fee Demand:</td>
                    <td style="padding: 6px 0; font-weight: 600; text-align: right;">£${preFlightDossier.marketNegotiationBrief.recommendedCounterOffer.recommendedLegalFeeContribution.toLocaleString('en-GB')} + VAT</td>
                  </tr>
                  ${preFlightDossier.threatAssessment.hasCaptiveSteering ? `
                  <tr>
                    <td colspan="2" style="padding: 8px 0 0; color: #D9603B; font-weight: 600; font-size: 12px;">⚠️ Captive steering detected: SRA Section 203 Parity Notice attached</td>
                  </tr>` : ''}
                </table>
                <div style="margin-top: 14px; text-align: center;">
                  <a href="https://settlementcheck.co.uk/dossier/review/${preFlightDossier.dossierId}/" style="display: inline-block; padding: 8px 16px; background: #D9603B; color: #FFFFFF; font-size: 12px; font-weight: 600; text-decoration: none; border-radius: 6px;">Open Complete Pre-Flight Dossier →</a>
                </div>
              </div>
              ` : ''}
              <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
                <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.55;">Reply directly to this email to contact the client. The client has given explicit consent to be contacted regarding their settlement agreement.</p>
              </div>
            </div>
          `,
        })
      } catch (emailErr) {
        console.error('B2B notification email failed (non-fatal):', emailErr)
      }
    }

    // ── Confirmation email to employee ──────────────────────────────────────
    try {
      const confirmationText = [
        `Hi ${first_name.trim()},`,
        '',
        'Thank you for using the settlement agreement calculator.',
        `Your inquiry has been sent to the specialist team at ${partnerFirmName}.`,
        'An employment solicitor will review your figures and contact you directly within 24 hours to discuss your options.',
        '',
        'The advice is free. Under UK employment law, your employer is required to contribute towards your legal fees for independent advice on a settlement agreement.',
        '',
        '---',
        'SettlementCheck • United Kingdom • team@settlementcheck.co.uk',
        'SettlementCheck widget handles routing to SRA-regulated solicitors. We do not provide legal advice directly.',
      ].join('\n')

      await resend.emails.send({
        from: 'SettlementCheck <team@settlementcheck.co.uk>',
        replyTo: 'team@settlementcheck.co.uk',
        to: email.trim(),
        subject: `Your settlement check request - ${partnerFirmName}`,
        text: confirmationText,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">${partnerFirmName}</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.02em;">We have received your details</h1>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Hi ${first_name.trim()},</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Thank you for using the settlement agreement calculator. Your inquiry has been sent to the specialist team at <strong>${partnerFirmName}</strong>.</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">An employment solicitor will review your figures and contact you directly within 24 hours to discuss your options.</p>
            <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">The advice is free. Under UK employment law, your employer is required to contribute towards your legal fees for independent advice on a settlement agreement.</p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0; line-height: 1.6;">SettlementCheck widget handles routing to SRA-regulated solicitors. We do not provide legal advice directly.</p>
            </div>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="font-size: 11px; color: #9ca3af; margin: 0;">SettlementCheck &bull; United Kingdom &bull; team@settlementcheck.co.uk</p>
            </div>
          </div>
        `,
      })
    } catch (emailErr) {
      console.error('Employee B2B confirmation email failed (non-fatal):', emailErr)
    }

    return NextResponse.json({
      success: true,
      crm_intake: crmIntakePayload,
      dossier: preFlightDossier,
    })
  } catch (err) {
    console.error('B2B lead intake error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
