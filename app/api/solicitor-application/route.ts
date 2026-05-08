import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

export async function POST(req: NextRequest) {
  try {
    const { firm_name, contact_name, email, phone, coverage, sra_confirmed } = await req.json()

    if (!firm_name || !contact_name || !email || !sra_confirmed) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build insert payload — only include optional fields when present
    const insertPayload: Record<string, unknown> = {
      firm_name,
      contact_name,
      email,
      phone: phone || null,
      sra_confirmed: Boolean(sra_confirmed),
      status: 'pending',
    }
    if (coverage) insertPayload.coverage = coverage

    let { error: insertError } = await supabase.from('solicitor_applications').insert(insertPayload)

    // Fallback: If Supabase complains about the schema cache (e.g. coverage column not added yet),
    // retry the insert without the problematic optional column.
    if (insertError && insertError.message.includes('schema cache') && insertPayload.coverage) {
      delete insertPayload.coverage
      const retry = await supabase.from('solicitor_applications').insert(insertPayload)
      insertError = retry.error
    }

    if (insertError) {
      console.error('Application insert error:', JSON.stringify(insertError))
      return NextResponse.json(
        { error: 'Failed to save application', detail: insertError.message },
        { status: 500 }
      )
    }

    // Emails are fire-and-forget - never let email failures block the success response.
    // If an email fails, it is logged server-side but the applicant still gets a success.

    // Notification to owner
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    if (notificationEmail) {
      resend.emails
        .send({
          from: 'SettlementCheck <noreply@settlementcheck.co.uk>',
          to: notificationEmail,
          subject: `New solicitor application: ${firm_name}`,
          html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 24px; letter-spacing: -0.02em;">New solicitor application</h1>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6; width: 140px;">Firm name</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${firm_name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Contact name</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${contact_name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Email</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${email}" style="color: #f97316;">${email}</a></td>
              </tr>
              ${phone ? `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Phone</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${phone}</td>
              </tr>` : ''}
              ${coverage ? `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Coverage</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${coverage}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">SRA confirmed</td>
                <td style="padding: 10px 0; color: #16a34a; font-weight: 600;">${sra_confirmed ? '&#10003; Yes' : '&#10007; No'}</td>
              </tr>
            </table>
            <div style="margin-top: 32px; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Reply directly to this email to contact the applicant.</p>
            </div>
          </div>
        `,
          replyTo: email,
        })
        .then(({ error }) => {
          if (error) console.error('Notification email error:', JSON.stringify(error))
        })
        .catch((e: unknown) => console.error('Notification email threw:', e))
    }

    // Confirmation to applicant
    resend.emails
      .send({
        from: 'SettlementCheck <noreply@settlementcheck.co.uk>',
        to: email,
        subject: 'Application received - SettlementCheck',
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.02em;">Application received</h1>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Hi ${contact_name},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">Thanks for applying to join the SettlementCheck solicitor panel. We have received your application for <strong>${firm_name}</strong> and will review it within 2 business days.</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">Questions? Reply to this email.</p>
        </div>
      `,
      })
      .then(({ error }) => {
        if (error) console.error('Confirmation email error:', JSON.stringify(error))
      })
      .catch((e: unknown) => console.error('Confirmation email threw:', e))

    // Return success as soon as DB row is saved - emails fire in background
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Application route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
