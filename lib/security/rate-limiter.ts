export interface RequestLike {
  headers: {
    get(name: string): string | null
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
  ip: string
}

export interface RateLimitOptions {
  limit?: number
  windowMs?: number
  endpoint?: string
}

// In-memory sliding-window store: key -> array of request timestamps (in ms)
const requestStore = new Map<string, number[]>()

// Maximum keys in memory before triggering aggressive stale cleanup
const MAX_STORE_KEYS = 50000

/**
 * Extracts client IP from incoming request headers with cloud proxy support.
 */
export function getClientIp(req: RequestLike): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim()
    if (firstIp) return firstIp
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp?.trim()) return realIp.trim()

  const cfIp = req.headers.get('cf-connecting-ip')
  if (cfIp?.trim()) return cfIp.trim()

  const trueClientIp = req.headers.get('true-client-ip')
  if (trueClientIp?.trim()) return trueClientIp.trim()

  return '127.0.0.1'
}

/**
 * Periodically prunes expired timestamps and stale keys to ensure memory efficiency.
 */
function pruneStaleEntries(now: number, windowMs: number): void {
  if (requestStore.size < 100) return

  const cutoff = now - windowMs * 2
  for (const [key, timestamps] of requestStore.entries()) {
    const valid = timestamps.filter(ts => ts > cutoff)
    if (valid.length === 0) {
      requestStore.delete(key)
    } else {
      requestStore.set(key, valid)
    }
  }
}

/**
 * Checks sliding window rate limit for a specific bucket identifier.
 * Pure JavaScript, 100% compatible with Vercel Edge Runtime and Node.js.
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  const windowStart = now - windowMs

  let timestamps = requestStore.get(identifier) || []
  // Filter out timestamps outside the active window
  timestamps = timestamps.filter(ts => ts > windowStart)

  if (timestamps.length >= limit) {
    const oldestInWindow = timestamps[0] || now
    const resetMs = Math.max(0, oldestInWindow + windowMs - now)
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    }
  }

  timestamps.push(now)
  requestStore.set(identifier, timestamps)

  // Trigger memory safety cleanup if store grows large
  if (requestStore.size > MAX_STORE_KEYS) {
    pruneStaleEntries(now, windowMs)
  }

  const remaining = Math.max(0, limit - timestamps.length)
  const oldestInWindow = timestamps[0] || now
  const resetMs = Math.max(0, oldestInWindow + windowMs - now)

  return {
    allowed: true,
    remaining,
    resetMs,
  }
}

/**
 * Rate limits an incoming NextRequest / Request by IP and endpoint name.
 * Default: 10 requests per 1 hour (3,600,000 ms) window.
 */
export function rateLimitRequest(
  req: RequestLike,
  options?: RateLimitOptions
): RateLimitResult {
  const limit = options?.limit ?? 10
  const windowMs = options?.windowMs ?? 60 * 60 * 1000 // 1 hour default
  const endpoint = options?.endpoint ?? 'api'
  const ip = getClientIp(req)

  const bucketKey = `${endpoint}:${ip}`
  const { allowed, remaining, resetMs } = checkRateLimit(bucketKey, limit, windowMs)

  return {
    allowed,
    remaining,
    resetMs,
    ip,
  }
}

/**
 * Returns standard RFC rate limit response headers.
 */
export function getRateLimitHeaders(
  limit: number,
  remaining: number,
  resetMs: number
): Record<string, string> {
  return {
    'X-RateLimit-Limit': String(limit),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.ceil((Date.now() + resetMs) / 1000)),
    'Retry-After': String(Math.ceil(resetMs / 1000)),
  }
}

/**
 * Clears the rate limiter store (primarily for unit tests and local evals).
 */
export function _resetRateLimiterStore(): void {
  requestStore.clear()
}
