import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { resend } from '@/lib/resend'

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email, form_type } = await req.json()

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

    const code = generateCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Invalidate any previous unused codes for this email+form_type
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('email', email)
      .eq('form_type', form_type)
      .eq('used', false)

    // Insert new code
    const { error: insertError } = await supabase.from('otp_codes').insert({
      email,
      code,
      form_type,
      expires_at: expiresAt.toISOString(),
    })

    if (insertError) {
      console.error('OTP insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create verification code' }, { status: 500 })
    }

    // Send email via Resend
    const subject =
      form_type === 'solicitor'
        ? 'Your SettlementCheck verification code'
        : 'Your SettlementCheck verification code'

    const body =
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

    const { error: emailError } = await resend.emails.send({
      from: 'SettlementCheck <noreply@settlementcheck.co.uk>',
      to: email,
      subject,
      html: body,
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
