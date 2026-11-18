/**
 * SettlementCheck First-Party Cookie Consent & Google Consent Mode v2 Utilities
 *
 * Enforces UK PECR Regulation 6 & UK GDPR Art. 6(1)(a) / Art. 7(1):
 * - Default-denied for all non-essential categories until explicit user opt-in
 * - First-party strictly-necessary preference cookie (180-day expiry)
 * - Active cleanup of GA4 cookies upon consent withdrawal
 * - URL query parameter sanitization to prevent Article 9 / financial data leaks
 */

export const CONSENT_COOKIE_NAME = 'sc_cookie_consent'
export const CONSENT_POLICY_VERSION = '2026-11'
export const CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60 // 180 days (ICO best practice)

export const OPEN_COOKIE_SETTINGS_EVENT = 'sc:open-cookie-settings'
export const CONSENT_CHANGED_EVENT = 'sc:consent-changed'

export type ConsentAction =
  | 'accept_all'
  | 'reject_non_essential'
  | 'custom_save'
  | 'withdraw'

export interface ConsentRecord {
  v: string
  id: string
  necessary: true
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

const SENSITIVE_QUERY_KEYS = [
  'salary',
  'offer',
  'age',
  'reason',
  'discrimination',
  'yearsNum',
  'monthsNum',
  'years',
  'contractualNotice',
  'offerIncludesNotice',
]

export function generateConsentId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  // RFC 4122 v4 fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function readConsentCookie(): ConsentRecord | null {
  if (typeof document === 'undefined') return null
  try {
    const match = document.cookie
      .split('; ')
      .find((row) => row.startsWith(`${CONSENT_COOKIE_NAME}=`))
    if (!match) return null

    const raw = decodeURIComponent(match.slice(CONSENT_COOKIE_NAME.length + 1))
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>
    if (
      parsed &&
      parsed.v === CONSENT_POLICY_VERSION &&
      typeof parsed.id === 'string' &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.marketing === 'boolean'
    ) {
      return {
        v: parsed.v,
        id: parsed.id,
        necessary: true,
        analytics: parsed.analytics,
        marketing: parsed.marketing,
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
      }
    }
    return null
  } catch {
    return null
  }
}

export function writeConsentCookie(record: ConsentRecord): void {
  if (typeof document === 'undefined') return
  const encoded = encodeURIComponent(JSON.stringify(record))
  const secureFlag =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secureFlag}`
}

export function hasAnalyticsConsent(): boolean {
  const record = readConsentCookie()
  return Boolean(record?.analytics)
}

export function sanitizePageLocation(rawUrl: string): string {
  try {
    const url = new URL(rawUrl)
    for (const key of SENSITIVE_QUERY_KEYS) {
      url.searchParams.delete(key)
    }
    return url.toString()
  } catch {
    return rawUrl.split('?')[0] || rawUrl
  }
}

export function applyGoogleConsentUpdate(analytics: boolean, marketing: boolean): void {
  if (typeof window === 'undefined') return

  const w = window as unknown as {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
  }

  w.dataLayer = w.dataLayer || []
  const gtagFn =
    typeof w.gtag === 'function'
      ? w.gtag
      : (...args: any[]) => {
          w.dataLayer!.push(args)
        }

  const cleanLocation = sanitizePageLocation(window.location.href)
  gtagFn('set', { page_location: cleanLocation })

  gtagFn('consent', 'update', {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: marketing ? 'granted' : 'denied',
    ad_user_data: marketing ? 'granted' : 'denied',
    ad_personalization: marketing ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  })

  w.dataLayer.push({
    event: 'sc_consent_update',
    consent_analytics: analytics ? 'granted' : 'denied',
    consent_marketing: marketing ? 'granted' : 'denied',
  })
}

/**
 * Actively expires known Google Analytics cookies when a user rejects or withdraws consent.
 */
export function clearGoogleAnalyticsCookies(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return

  const hostname = window.location.hostname
  const domainParts = hostname.split('.')
  const candidateDomains = ['', hostname]
  if (domainParts.length >= 2) {
    candidateDomains.push(`.${domainParts.slice(-2).join('.')}`)
    candidateDomains.push(domainParts.slice(-2).join('.'))
  }

  const cookieNames = document.cookie
    .split('; ')
    .map((c) => c.split('=')[0])
    .filter((name) => name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_'))

  for (const name of cookieNames) {
    for (const domain of candidateDomains) {
      const domainAttr = domain ? `; Domain=${domain}` : ''
      document.cookie = `${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${domainAttr}`
    }
  }
}

export function openCookieSettings(): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT))
}
