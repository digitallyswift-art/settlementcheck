import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateOtpSessionToken, timingSafeEqualStrings } from '@/lib/security/otp-tokens'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'
import { logSecurityEvent } from '@/lib/security/security-logger'

export async function POST(req: NextRequest) {
  try {
    // ── 1. IP Sliding-window rate limit (15 verify attempts / 15 mins / IP) ──
    const ipCheck = rateLimitRequest(req, {
      endpoint: 'otp-verify-ip',
      limit: 15,
      windowMs: 15 * 60 * 1000,
    })

    if (!ipCheck.allowed) {
      logSecurityEvent({
        type: 'RATE_LIMIT_EXCEEDED',
        path: '/api/otp/verify',
        method: 'POST',
        ip: ipCheck.ip,
        reason: 'Too many OTP verification attempts from IP address',
      })
      return NextResponse.json(
        { success: false, message: 'Too many verification attempts from your network. Please wait 15 minutes before retrying.' },
        {
          status: 429,
          headers: getRateLimitHeaders(15, ipCheck.remaining, ipCheck.resetMs),
        }
      )
    }

    const { email, code, form_type } = await req.json()

    if (!email || !code || !form_type) {
      return NextResponse.json({ success: false, message: 'Missing required fields' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // Find the most recent unused, unexpired code for this email+form_type
    let query = supabase
      .from('otp_codes')
      .select('id, code, expires_at, used, attempts')
      .eq('email', normalizedEmail)
      .eq('form_type', form_type)
      .eq('used', false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    let { data, error } = await query

    // Resilient fallback if attempts column has not been added yet
    if (error && error.message?.includes('attempts')) {
      const fallback = await supabase
        .from('otp_codes')
        .select('id, code, expires_at, used')
        .eq('email', normalizedEmail)
        .eq('form_type', form_type)
        .eq('used', false)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      data = fallback.data ? { ...fallback.data, attempts: 0 } : null
      error = fallback.error
    }

    if (error || !data) {
      return NextResponse.json({ success: false, message: 'Code not found or already used' }, { status: 200 })
    }

    const currentAttempts = typeof data.attempts === 'number' ? data.attempts : 0

    // Anti-Brute-Force Lockout Defense (SC-E-SEC-003):
    // Invalidate and reject if 5 or more failed attempts have already occurred
    if (currentAttempts >= 5) {
      await supabase.from('otp_codes').update({ used: true }).eq('id', data.id)
      return NextResponse.json(
        { success: false, message: 'Too many failed attempts. Please request a new verification code.' },
        { status: 200 }
      )
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ success: false, message: 'Code has expired. Please request a new one.' }, { status: 200 })
    }

    // Constant-time code verification
    const inputCode = String(code).trim()
    const storedCode = String(data.code).trim()
    const isCodeValid = timingSafeEqualStrings(storedCode, inputCode)

    if (!isCodeValid) {
      const nextAttempts = currentAttempts + 1
      const isLockedOut = nextAttempts >= 5

      // Increment attempt counter and permanently lock code if 5 failed attempts reached
      try {
        await supabase
          .from('otp_codes')
          .update({
            attempts: nextAttempts,
            ...(isLockedOut ? { used: true } : {}),
          })
          .eq('id', data.id)
      } catch {
        if (isLockedOut) {
          await supabase.from('otp_codes').update({ used: true }).eq('id', data.id)
        }
      }

      if (isLockedOut) {
        return NextResponse.json(
          { success: false, message: 'Too many failed attempts. Please request a new verification code.' },
          { status: 200 }
        )
      }

      const remainingAttempts = 5 - nextAttempts
      return NextResponse.json(
        {
          success: false,
          message: `Incorrect code. ${remainingAttempts} ${remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining.`,
        },
        { status: 200 }
      )
    }

    // Code is valid: mark as used
    await supabase.from('otp_codes').update({ used: true }).eq('id', data.id)

    // Issue signed HMAC-SHA256 session verification token (SC-E-SEC-005, 15-minute TTL)
    const verificationToken = generateOtpSessionToken(normalizedEmail, form_type)

    return NextResponse.json({
      success: true,
      verificationToken,
    })
  } catch (err) {
    console.error('OTP verify error:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}
