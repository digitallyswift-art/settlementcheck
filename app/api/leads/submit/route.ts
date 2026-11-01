import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { evaluateSraLeadTriage, SraLeadTriageInput } from '@/lib/leads/triage-contract'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body: SraLeadTriageInput = await req.json()
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

    // 1. Deterministic SRA Triage Evaluation
    const triage = evaluateSraLeadTriage(body)

    // 2. Persist to Supabase with schema resilience
    const normalizedEmail = email.trim().toLowerCase()
    const insertPayload: any = {
      first_name: firstName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      contact_time: triage.client.preferredContactTime,
      verdict: triage.commercialOffer.verdict,
      offer_amount: triage.commercialOffer.offerAmount || null,
      salary: triage.employment.salary || null,
      months_service: triage.employment.monthsService || null,
      consent: true,
      status: 'new',
      postcode: triage.client.postcode || null,
      postcode_region: triage.client.postcodeRegion || null,
    }

    let insertError = null
    try {
      const { error } = await supabase.from('leads').insert(insertPayload)
      insertError = error
    } catch (dbErr) {
      insertError = dbErr
    }

    if (insertError) {
      console.warn('Initial lead insert warning (attempting minimal schema fallback):', insertError)
      const { postcode: _, postcode_region: __, ...fallbackPayload } = insertPayload
      const { error: fallbackError } = await supabase.from('leads').insert(fallbackPayload)
      if (fallbackError) {
        console.error('Database lead insert error:', fallbackError)
      }
    }

    // 3. Dispatch SRA Triage Notification Email
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    if (notificationEmail && resend) {
      const recipients = notificationEmail.includes(',')
        ? notificationEmail.split(',').map(e => e.trim()).filter(Boolean)
        : [notificationEmail]

      const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #0B1F3A; padding: 20px;">
          <div style="padding: 12px 16px; background: #0B1F3A; border-radius: 8px 8px 0 0; color: #ffffff;">
            <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #D9603B; letter-spacing: 0.1em; font-weight: bold;">
              SRA Solicitor Qualified Intake • ${triage.triageId}
            </span>
            <h2 style="margin: 4px 0 0; color: #ffffff; font-size: 20px;">
              ${triage.matterTier}: ${triage.client.firstName}
            </h2>
          </div>

          <div style="border: 1px solid #E2DCCE; border-top: none; padding: 20px; border-radius: 0 0 8px 8px; background: #ffffff;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 20px;">
              <tbody>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Client Contact:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">${triage.client.firstName} (${triage.client.phone})</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Email:</td>
                  <td style="padding: 8px 0; text-align: right; color: #D9603B;"><a href="mailto:${triage.client.email}" style="color: #D9603B;">${triage.client.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Tenure Classification:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">${triage.employment.tenureYears} yrs (${triage.employment.tenureClassification})</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Gross Annual Salary:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">£${triage.employment.salary.toLocaleString('en-GB')}</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Employer Offer:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">£${triage.commercialOffer.offerAmount.toLocaleString('en-GB')} (${triage.commercialOffer.verdict})</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Legal Fee Status:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">£${triage.commercialOffer.employerLegalFeeOffered} + VAT (${triage.commercialOffer.legalFeeStatus})</td>
                </tr>
                <tr style="border-bottom: 1px solid #E2DCCE;">
                  <td style="padding: 8px 0; color: #5B6577;">Limitation Status:</td>
                  <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #0B1F3A;">${triage.regulatoryLimitation.limitationRisk}</td>
                </tr>
              </tbody>
            </table>

            <div style="background: #F7F4EE; padding: 14px; border-radius: 8px; border: 1px solid #E2DCCE; margin-bottom: 16px;">
              <strong style="font-size: 12px; color: #0B1F3A; display: block; margin-bottom: 6px;">SRA Compliance Notes:</strong>
              <ul style="margin: 0; padding-left: 18px; font-size: 12px; color: #5B6577; line-height: 1.5;">
                ${triage.sraComplianceNotes.map(n => `<li>${n}</li>`).join('')}
              </ul>
            </div>

            <p style="font-size: 11px; color: #8A93A3; margin: 0; text-align: center;">
              SettlementCheck SRA Triage Protocol • Generated at ${triage.timestamp}
            </p>
          </div>
        </div>
      `

      try {
        await resend.emails.send({
          from: 'SettlementCheck Triage <intake@settlementcheck.co.uk>',
          to: recipients,
          replyTo: triage.client.email,
          subject: `[SRA Triage] ${triage.matterTier}: ${triage.client.firstName} (£${triage.employment.salary.toLocaleString('en-GB')} / ${triage.employment.tenureClassification})`,
          html: emailHtml,
        })
      } catch (emailErr) {
        console.warn('SRA triage notification email non-fatal error:', emailErr)
      }
    }

    return NextResponse.json({
      success: true,
      triageId: triage.triageId,
      triage,
      clioPayload: triage.clioMatterPayload,
      leapPayload: triage.leapMatterPayload,
    })
  } catch (error: any) {
    console.error('SRA lead triage submission error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error during SRA lead triage' },
      { status: 500 }
    )
  }
}
