import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'
import { escapeHtml, sanitizeString } from '@/lib/security/html-sanitizer'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SRA_NUMBER_REGEX = /^\d{5,7}$/
const VERIFICATION_TTL_MS = 48 * 60 * 60 * 1000

export async function POST(req: NextRequest) {
  try {
    // ── 1. Sliding-window IP Rate Limiter (10 applications / hr / IP) ───────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'solicitor-application',
      limit: 10,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait before submitting another application.' },
        {
          status: 429,
          headers: getRateLimitHeaders(10, rateCheck.remaining, rateCheck.resetMs),
        }
      )
    }

    const body = await req.json()

    // ── 2. Honeypot Bot Trap ────────────────────────────────────────────────
    if (body.website_hp || body.hp_field || body.company_url_hp) {
      return NextResponse.json({ success: true, message: 'Application submitted' }, { status: 200 })
    }

    const {
      firm_name,
      contact_name,
      email,
      phone,
      office_postcode,
      office_lat,
      office_lng,
      office_region,
      coverage_radius_miles,
      sra_number,
      sra_confirmed,
      fee_shield_agreed,
    } = body

    const cleanFirmName = sanitizeString(firm_name, 200)
    const cleanContactName = sanitizeString(contact_name, 200)
    const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : ''
    const cleanSraNumber = typeof sra_number === 'string' ? sra_number.trim() : ''
    const cleanPhone = typeof phone === 'string' ? sanitizeString(phone, 40) : ''

    if (!cleanFirmName || !cleanContactName || !normalizedEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (normalizedEmail.length > 254 || !EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid work email address.' }, { status: 400 })
    }

    if (!SRA_NUMBER_REGEX.test(cleanSraNumber)) {
      return NextResponse.json(
        { error: 'Please enter a valid 5 to 7 digit SRA firm number.' },
        { status: 400 }
      )
    }

    if (sra_confirmed !== true) {
      return NextResponse.json(
        { error: 'SRA authorisation confirmation is required.' },
        { status: 400 }
      )
    }

    if (fee_shield_agreed !== true) {
      return NextResponse.json(
        { error: 'Acceptance of the Fee Shield and SRA Rule 5.1 partner terms is required.' },
        { status: 400 }
      )
    }

    // ── 3. Duplicate Pending Application Guard ──────────────────────────────
    const { data: existingPending, error: lookupError } = await supabase
      .from('solicitor_applications')
      .select('id')
      .ilike('email', normalizedEmail)
      .eq('status', 'pending')
      .maybeSingle()

    if (lookupError) {
      console.error('Application lookup error:', JSON.stringify(lookupError))
    }

    if (existingPending) {
      return NextResponse.json(
        {
          error:
            'An application for this email address is already pending review. To update your details, please email team@settlementcheck.co.uk.',
        },
        { status: 409 }
      )
    }

    // ── 4. Generate CSPRNG Verification Token (SHA-256 stored, 48h TTL) ─────
    const verificationToken = crypto.randomBytes(32).toString('hex')
    const verificationTokenHash = crypto
      .createHash('sha256')
      .update(verificationToken)
      .digest('hex')
    const verificationTokenExpiresAt = new Date(Date.now() + VERIFICATION_TTL_MS).toISOString()

    const insertPayload: Record<string, unknown> = {
      firm_name:                     cleanFirmName,
      contact_name:                  cleanContactName,
      email:                         normalizedEmail,
      phone:                         cleanPhone || null,
      office_postcode:               typeof office_postcode === 'string' ? sanitizeString(office_postcode, 16) || null : null,
      office_lat:                    typeof office_lat === 'number' && Number.isFinite(office_lat) ? office_lat : null,
      office_lng:                    typeof office_lng === 'number' && Number.isFinite(office_lng) ? office_lng : null,
      office_region:                 typeof office_region === 'string' ? sanitizeString(office_region, 120) || null : null,
      coverage_radius_miles:         typeof coverage_radius_miles === 'number' && Number.isFinite(coverage_radius_miles) ? coverage_radius_miles : null,
      sra_number:                    cleanSraNumber,
      sra_regulated:                 true,
      fee_shield_agreed:             true,
      email_verified:                false,
      verification_token_hash:       verificationTokenHash,
      verification_token_expires_at: verificationTokenExpiresAt,
      status:                        'pending',
    }

    const { error: insertError } = await supabase.from('solicitor_applications').insert(insertPayload)

    if (insertError) {
      if (insertError.code === '23505') {
        return NextResponse.json(
          {
            error:
              'An application for this email address is already pending review. To update your details, please email team@settlementcheck.co.uk.',
          },
          { status: 409 }
        )
      }
      console.error('Application insert error:', JSON.stringify(insertError))
      return NextResponse.json(
        { error: 'Failed to save application. Please try again or contact team@settlementcheck.co.uk.' },
        { status: 500 }
      )
    }

    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://settlementcheck.co.uk').replace(/\/+$/, '')
    const verificationUrl = `${baseUrl}/api/solicitor-application/verify/?token=${verificationToken}`

    // Emails are fire-and-forget - never let email failures block the success response.
    // If an email fails, it is logged server-side but the applicant still gets a success.

    // Notification to owner
    const notificationEmail = process.env.NOTIFICATION_EMAIL
    if (notificationEmail) {
      resend.emails
        .send({
          from: 'SettlementCheck <team@settlementcheck.co.uk>',
          to: notificationEmail.includes(',') ? notificationEmail.split(',').map(e => e.trim()).filter(Boolean) : notificationEmail,
          subject: `New solicitor application: ${cleanFirmName}`,
          replyTo: normalizedEmail,
          text: `New Solicitor Application\n\nFirm: ${cleanFirmName}\nSRA Number: ${cleanSraNumber}\nContact: ${cleanContactName}\nEmail: ${normalizedEmail}\nPhone: ${cleanPhone || 'N/A'}\nOffice: ${office_postcode || 'N/A'}${office_region ? ` (${office_region})` : ''}\nRadius: ${coverage_radius_miles != null ? coverage_radius_miles + ' miles' : 'National'}\nSRA Confirmed: Yes\nFee Shield Agreed: Yes`,
          html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 24px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
            </div>
            <h1 style="font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 24px; letter-spacing: -0.02em;">New solicitor application</h1>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6; width: 140px;">Firm name</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(cleanFirmName)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">SRA number</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(cleanSraNumber)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Contact name</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(cleanContactName)}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Email</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${escapeHtml(normalizedEmail)}" style="color: #f97316;">${escapeHtml(normalizedEmail)}</a></td>
              </tr>
              ${cleanPhone ? `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Phone</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(cleanPhone)}</td>
              </tr>` : ''}
              ${office_postcode ? `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Office postcode</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(office_postcode)}${office_region ? ` (${escapeHtml(office_region)})` : ''}</td>
              </tr>` : ''}
              ${coverage_radius_miles != null ? `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Coverage radius</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">${escapeHtml(coverage_radius_miles)} miles</td>
              </tr>` : `<tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">Coverage radius</td>
                <td style="padding: 10px 0; color: #111827; font-weight: 500; border-bottom: 1px solid #f3f4f6;">National</td>
              </tr>`}
              <tr>
                <td style="padding: 10px 0; color: #6b7280; border-bottom: 1px solid #f3f4f6;">SRA confirmed</td>
                <td style="padding: 10px 0; color: #0B1F3A; font-weight: 600; border-bottom: 1px solid #f3f4f6;">&#10003; Yes</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280;">Fee Shield agreed</td>
                <td style="padding: 10px 0; color: #0B1F3A; font-weight: 600;">&#10003; Yes</td>
              </tr>
            </table>
            <div style="margin-top: 32px; padding: 16px; background: #f9fafb; border-radius: 8px;">
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Reply directly to this email to contact the applicant.</p>
            </div>
          </div>
        `,
        })
        .then((res: any) => {
          if (res?.error) console.error('Notification email error:', JSON.stringify(res.error))
        })
        .catch((e: unknown) => console.error('Notification email threw:', e))
    }

    // Confirmation to applicant (with Safe-Links-friendly verification link)
    resend.emails
      .send({
        from: 'SettlementCheck <team@settlementcheck.co.uk>',
        replyTo: 'team@settlementcheck.co.uk',
        to: normalizedEmail,
        subject: 'Confirm your work email - SettlementCheck Solicitor Panel',
        text: `Hi ${cleanContactName},\n\nThanks for applying to join the SettlementCheck solicitor panel. We have received your application for ${cleanFirmName} (SRA ${cleanSraNumber}) and will review it within 1 business day.\n\nPlease confirm your work email address using the link below (valid for 48 hours):\n${verificationUrl}\n\nQuestions? Email us at team@settlementcheck.co.uk\n\nSettlementCheck • United Kingdom`,
        html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
          <div style="margin-bottom: 32px;">
            <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; letter-spacing: -0.02em;">Application received</h1>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px;">Hi ${escapeHtml(cleanContactName)},</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Thanks for applying to join the SettlementCheck solicitor panel. We have received your application for <strong>${escapeHtml(cleanFirmName)}</strong> (SRA ${escapeHtml(cleanSraNumber)}) and will review it within 1 business day.</p>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">Please confirm your work email address to complete verification (this link expires in 48 hours):</p>
          <div style="margin: 0 0 28px;">
            ${'<a href="' + escapeHtml(verificationUrl) + '" style="display: inline-block; background-color: #D9603B; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 6px;">Confirm Work Email</a>'}
          </div>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">Questions? Email us at <a href="mailto:team@settlementcheck.co.uk" style="color: #D9603B;">team@settlementcheck.co.uk</a></p>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <p style="font-size: 11px; color: #9ca3af; margin: 0;">SettlementCheck &bull; United Kingdom &bull; team@settlementcheck.co.uk</p>
          </div>
        </div>
      `,
      })
      .then((res: any) => {
        if (res?.error) console.error('Confirmation email error:', JSON.stringify(res.error))
      })
      .catch((e: unknown) => console.error('Confirmation email threw:', e))

    // Return success as soon as DB row is saved - emails fire in background
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Application route error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
