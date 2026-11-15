import crypto from 'crypto'

export interface OtpSessionTokenPayload {
  email: string
  formType: string
  issuedAt: number
  expiresAt: number
}

export const OTP_SESSION_TOKEN_TTL_MS = 15 * 60 * 1000 // 15 minutes

function getOtpSecret(): string {
  return (
    process.env.OTP_TOKEN_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.CRON_SECRET ||
    'settlementcheck-otp-token-hmac-sha256-secret-fallback'
  )
}

/**
 * Constant-time string comparison using SHA-256 digests.
 * Guarantees fixed 32-byte buffers to avoid length-based RangeErrors or timing leaks in crypto.timingSafeEqual.
 */
export function timingSafeEqualStrings(a: string, b: string): boolean {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false
  }
  const hashA = crypto.createHash('sha256').update(a).digest()
  const hashB = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(hashA, hashB)
}

export const constantTimeStringEqual = timingSafeEqualStrings
export const constantTimeEqual = timingSafeEqualStrings

/**
 * Generates an HMAC-SHA256 signed OTP session verification token with a 15-minute expiration.
 * Format: `<base64url-payload>.<base64url-hmac-sha256-signature>`
 */
export function generateOtpSessionToken(email: string, formType: string): string {
  const normalizedEmail = email.trim().toLowerCase()
  const now = Date.now()
  const payload: OtpSessionTokenPayload = {
    email: normalizedEmail,
    formType: formType.trim(),
    issuedAt: now,
    expiresAt: now + OTP_SESSION_TOKEN_TTL_MS,
  }

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto
    .createHmac('sha256', getOtpSecret())
    .update(encodedPayload)
    .digest('base64url')

  return `${encodedPayload}.${signature}`
}

/**
 * Decodes and validates the signature and format of an OTP session verification token.
 * Returns null if the token is invalid, tampered with, or malformed.
 */
export function decodeOtpSessionToken(token: string): OtpSessionTokenPayload | null {
  if (!token || typeof token !== 'string') {
    return null
  }

  const parts = token.split('.')
  if (parts.length !== 2) {
    return null
  }

  const [encodedPayload, signature] = parts
  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = crypto
    .createHmac('sha256', getOtpSecret())
    .update(encodedPayload)
    .digest('base64url')

  if (!timingSafeEqualStrings(signature, expectedSignature)) {
    return null
  }

  try {
    const rawJson = Buffer.from(encodedPayload, 'base64url').toString('utf-8')
    const parsed = JSON.parse(rawJson) as OtpSessionTokenPayload

    if (
      !parsed ||
      typeof parsed.email !== 'string' ||
      typeof parsed.formType !== 'string' ||
      typeof parsed.issuedAt !== 'number' ||
      typeof parsed.expiresAt !== 'number'
    ) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

/**
 * Verifies that an OTP session token:
 * 1. Has a valid HMAC-SHA256 signature
 * 2. Has not expired (within 15-minute TTL)
 * 3. Matches expectedEmail and expectedFormType
 */
export function verifyOtpSessionToken(
  token: string,
  expectedEmail: string,
  expectedFormType: string
): boolean {
  const payload = decodeOtpSessionToken(token)
  if (!payload) {
    return false
  }

  const now = Date.now()
  if (now > payload.expiresAt) {
    return false
  }

  const normalizedExpectedEmail = expectedEmail.trim().toLowerCase()
  const emailMatches = timingSafeEqualStrings(payload.email.toLowerCase(), normalizedExpectedEmail)
  const formTypeMatches = timingSafeEqualStrings(payload.formType, expectedFormType.trim())

  return emailMatches && formTypeMatches
}
