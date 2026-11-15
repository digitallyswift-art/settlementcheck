import { NextRequest, NextResponse } from 'next/server'
import { randomInt } from 'crypto'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

function generateCode(): string {
  return randomInt(100000, 1000000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, form_type, website_hp } = body

    // ── Honeypot Bot Filtering ──────────────────────────────────────────────
    // Silently drop automated bot submissions without writing to database or calling Resend
    if (website_hp) {
      return NextResponse.json({ success: true })
    }

    if (!email || !form_type) {
      return NextResponse.json({ error: 'Missing email or form_type' }, { status: 400 })
    }

    if (!['solicitor', 'employee'].includes(form_type)) {
      return NextResponse.json({ error: 'Invalid form_type' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // ── Rate Limiting (Max 5 OTP requests per email per 15 minutes) ──────────
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
    const { count, error: countError } = await supabase
      .from('otp_codes')
      .select('id', { count: 'exact', head: true })
      .eq('email', normalizedEmail)
      .gte('created_at', fifteenMinutesAgo)

    if (!countError && typeof count === 'number' && count >= 5) {
      return NextResponse.json(
        { error: 'Too many verification requests. Please wait a few minutes before trying again.' },
        { status: 429 }
      )
    }

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate any previous unused codes for this email+form_type
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('email', normalizedEmail)
      .eq('form_type', form_type)
      .eq('used', false)

    // Insert new code with attempts initialized to 0
    let { error: insertError } = await supabase.from('otp_codes').insert({
      email: normalizedEmail,
      code,
      form_type,
      expires_at: expiresAt.toISOString(),
      attempts: 0,
    })

    // Graceful fallback if attempts column has not been migrated yet
    if (insertError && insertError.message?.includes('attempts')) {
      const fallback = await supabase.from('otp_codes').insert({
        email: normalizedEmail,
        code,
        form_type,
        expires_at: expiresAt.toISOString(),
      })
      insertError = fallback.error
    }

    if (insertError) {
      console.error('OTP insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create verification code' }, { status: 500 })
    }

    // Send email via Resend
    const subject =
      form_type === 'solicitor'
        ? 'Your SettlementCheck verification code'
        : 'Your SettlementCheck verification code'

    const bodyHtml =
      form_type === 'solicitor'
        ? `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 12px; letter-spacing: -0.02em;">Your verification code</h1>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">Use the code below to verify your email address for your solicitor panel application.</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px;">
              <span style="font-size: 40px; font-weight: 800; color: #111827; letter-spacing: 0.2em; font-variant-numeric: tabular-nums;">${code}</span>
            </div>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
          </div>
        `
        : `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
            <div style="margin-bottom: 32px;">
              <span style="font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.015em;">SettlementCheck</span>
            </div>
            <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 12px; letter-spacing: -0.02em;">Your verification code</h1>
            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin: 0 0 32px;">Use the code below to confirm your email address.</p>
            <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 28px; text-align: center; margin-bottom: 32px;">
              <span style="font-size: 40px; font-weight: 800; color: #111827; letter-spacing: 0.2em; font-variant-numeric: tabular-nums;">${code}</span>
            </div>
            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0;">This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
          </div>
        `

    const textBody =
      form_type === 'solicitor'
        ? `SettlementCheck\n\nYour verification code is: ${code}\n\nUse the code above to verify your email address for your solicitor panel application. This code expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`
        : `SettlementCheck\n\nYour verification code is: ${code}\n\nUse the code above to confirm your email address. This code expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`

    const { error: emailError } = await resend.emails.send({
      from: 'SettlementCheck <team@settlementcheck.co.uk>',
      replyTo: 'team@settlementcheck.co.uk',
      to: normalizedEmail,
      subject,
      text: textBody,
      html: bodyHtml,
    })

    if (emailError) {
      console.error('Resend error:', emailError)
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('OTP send error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
