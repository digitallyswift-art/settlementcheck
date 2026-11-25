import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimitRequest, getRateLimitHeaders } from '@/lib/security/rate-limiter'
import { escapeHtml } from '@/lib/security/html-sanitizer'

const TOKEN_HEX_REGEX = /^[a-f0-9]{64}$/i

function renderPageHtml(opts: {
  title: string
  heading: string
  body: string
  formToken?: string
  ctaHref?: string
  ctaLabel?: string
  isError?: boolean
}): string {
  const { title, heading, body, formToken, ctaHref, ctaLabel, isError } = opts
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} - SettlementCheck</title>
</head>
<body style="margin:0;padding:0;background:#F7F4EE;color:#0B1F3A;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="min-height:100vh;display:flex;flex-direction:column;">
    <header style="height:64px;background:rgba(247,244,238,0.96);border-bottom:1px solid #E2DCCE;display:flex;align-items:center;padding:0 24px;">
      <a href="/" style="display:inline-flex;align-items:center;gap:8px;text-decoration:none;">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" stroke-width="1.6" />
          <path d="M6 11.5L9.5 15L16 7.5" stroke="#D9603B" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <span style="font-family:'Source Serif 4',Georgia,serif;font-size:20px;letter-spacing:-0.01em;line-height:1;">
          <span style="color:#D9603B;">Settlement</span><span style="color:#0B1F3A;">Check</span>
        </span>
      </a>
    </header>
    <main style="flex:1;display:flex;align-items:center;justify-content:center;padding:32px 20px;">
      <div style="width:100%;max-width:480px;background:#FFFFFF;border:1.5px solid ${isError ? '#FECACA' : '#E2DCCE'};border-radius:14px;padding:32px 28px;box-shadow:0 8px 24px rgba(11,31,58,0.06);text-align:center;">
        <h1 style="font-family:'Source Serif 4',Georgia,serif;font-size:26px;font-weight:700;line-height:1.2;margin:0 0 12px;color:#0B1F3A;">
          ${escapeHtml(heading)}
        </h1>
        <p style="font-size:15px;line-height:1.6;color:#5B6577;margin:0 0 24px;">
          ${body}
        </p>
        ${
          formToken
            ? `<form method="POST" action="/api/solicitor-application/verify/" style="margin:0;">
                <input type="hidden" name="token" value="${escapeHtml(formToken)}" />
                <button type="submit" style="width:100%;min-height:48px;background:#D9603B;color:#FFFFFF;border:none;border-radius:8px;padding:13px 24px;font-size:15px;font-weight:600;cursor:pointer;font-family:inherit;box-shadow:0 4px 14px rgba(217,96,59,0.25);">
                  Confirm Work Email
                </button>
              </form>
              <p style="font-size:12px;color:#8A93A3;margin:16px 0 0;line-height:1.5;">
                Clicking the button above completes verification for your firm&apos;s panel application.
              </p>`
            : ''
        }
        ${
          ctaHref && ctaLabel
            ? '<a href="' +
              escapeHtml(ctaHref) +
              '" style="display:inline-flex;align-items:center;justify-content:center;min-height:44px;background:#0B1F3A;color:#FFFFFF;border-radius:8px;padding:12px 24px;font-size:14px;font-weight:600;text-decoration:none;">' +
              escapeHtml(ctaLabel) +
              '</a>'
            : ''
        }
      </div>
    </main>
  </div>
</body>
</html>`
}

/**
 * GET /api/solicitor-application/verify/?token=...
 *
 * Corporate Safe-Links protection: email security scanners (Mimecast, Microsoft
 * Defender Safe Links) auto-prefetch GET URLs. Therefore GET MUST NOT mutate
 * database state; it renders a confirmation button that submits POST.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')?.trim() || ''

  if (!TOKEN_HEX_REGEX.test(token)) {
    return new NextResponse(
      renderPageHtml({
        title: 'Invalid Verification Link',
        heading: 'Invalid verification link',
        body: 'This verification link is incomplete or malformed. If you need help, please contact <a href="mailto:team@settlementcheck.co.uk" style="color:#D9603B;">team@settlementcheck.co.uk</a>.',
        ctaHref: '/for-solicitors/',
        ctaLabel: 'Return to Solicitor Panel',
        isError: true,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    )
  }

  return new NextResponse(
    renderPageHtml({
      title: 'Confirm Your Work Email',
      heading: 'Confirm your work email',
      body: 'Click below to verify your firm email address for your SettlementCheck Solicitor Panel application.',
      formToken: token,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    }
  )
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  const expectsJson = contentType.includes('application/json')

  const respondError = (message: string, status: number, extraHeaders?: Record<string, string>) => {
    if (expectsJson) {
      return NextResponse.json({ error: message }, { status, headers: extraHeaders })
    }
    return new NextResponse(
      renderPageHtml({
        title: 'Verification Issue',
        heading: 'Unable to verify email',
        body: escapeHtml(message),
        ctaHref: '/for-solicitors/',
        ctaLabel: 'Return to Solicitor Panel',
        isError: true,
      }),
      {
        status,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          ...extraHeaders,
        },
      }
    )
  }

  try {
    // ── 1. Rate Limit (20 attempts / hr / IP) ───────────────────────────────
    const rateCheck = rateLimitRequest(req, {
      endpoint: 'solicitor-verify',
      limit: 20,
      windowMs: 60 * 60 * 1000,
    })

    if (!rateCheck.allowed) {
      return respondError(
        'Too many verification attempts. Please wait before trying again.',
        429,
        getRateLimitHeaders(20, rateCheck.remaining, rateCheck.resetMs)
      )
    }

    // ── 2. Extract Token ────────────────────────────────────────────────────
    let token = ''
    if (expectsJson) {
      const body = await req.json()
      token = typeof body?.token === 'string' ? body.token.trim() : ''
    } else {
      const formData = await req.formData()
      const raw = formData.get('token')
      token = typeof raw === 'string' ? raw.trim() : ''
    }

    if (!TOKEN_HEX_REGEX.test(token)) {
      return respondError('This verification link is invalid or malformed.', 400)
    }

    // ── 3. Verify SHA-256 Hash & 48h TTL ────────────────────────────────────
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')

    const { data: app, error: lookupError } = await supabase
      .from('solicitor_applications')
      .select('id, firm_name, email_verified, verification_token_expires_at')
      .eq('verification_token_hash', tokenHash)
      .maybeSingle()

    if (lookupError) {
      console.error('Verification lookup error:', JSON.stringify(lookupError))
      return respondError('Verification failed. Please try again or email team@settlementcheck.co.uk.', 500)
    }

    if (!app) {
      return respondError(
        'This verification link is invalid or has already been used.',
        404
      )
    }

    const expiresAtMs = app.verification_token_expires_at
      ? new Date(app.verification_token_expires_at).getTime()
      : 0

    if (!expiresAtMs || Number.isNaN(expiresAtMs) || expiresAtMs < Date.now()) {
      return respondError(
        'This verification link has expired (48-hour limit). Please email team@settlementcheck.co.uk to request a new link.',
        410
      )
    }

    // ── 4. Mark Verified & Clear Single-Use Token Hash ──────────────────────
    const { data: updated, error: updateError } = await supabase
      .from('solicitor_applications')
      .update({
        email_verified: true,
        verification_token_hash: null,
        verification_token_expires_at: null,
      })
      .eq('id', app.id)
      .eq('verification_token_hash', tokenHash)
      .select('id')
      .maybeSingle()

    if (updateError || !updated) {
      console.error('Verification update error:', JSON.stringify(updateError))
      return respondError(
        'This verification link has already been used or could not be processed.',
        409
      )
    }

    if (expectsJson) {
      return NextResponse.json({
        success: true,
        firm_name: app.firm_name,
      })
    }

    return new NextResponse(
      renderPageHtml({
        title: 'Work Email Confirmed',
        heading: 'Work email confirmed',
        body: `Thank you. Your email for <strong>${escapeHtml(app.firm_name)}</strong> is now verified. Our onboarding team will complete SRA Digital Register verification within 1 business day.`,
        ctaHref: '/portal/?demo=true',
        ctaLabel: 'Explore Partner Portal Demo →',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (err) {
    console.error('Solicitor verification route error:', err)
    return respondError('Internal server error. Please try again.', 500)
  }
}
