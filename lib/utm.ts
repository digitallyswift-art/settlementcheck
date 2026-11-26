/**
 * Canonical Outbound UTM Builder for SettlementCheck (settlementcheck.co.uk)
 *
 * Rules:
 * - Strictly for EXTERNAL / OUTBOUND links (emails, social, paid ads, partner referrals).
 * - NEVER use on internal website navigation (<Link> / <a> inside the app).
 * - All UTM values must be lowercase snake_case: ^[a-z0-9_]+$
 * - Always normalises to https://settlementcheck.co.uk with a trailing slash before '?'.
 */

export interface UtmParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term?: string;
}

const CANONICAL_ORIGIN = 'https://settlementcheck.co.uk';
const SNAKE_CASE_RE = /^[a-z0-9_]+$/;

/**
 * Normalises an arbitrary string (e.g. a guide slug like "/guides/tax-free-settlement-30000/")
 * into a valid lowercase snake_case UTM token.
 */
export function toUtmToken(value: string): string {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return cleaned || 'unknown';
}

function assertValidUtmValue(key: string, value: string): string {
  const trimmed = value.trim();
  if (!SNAKE_CASE_RE.test(trimmed)) {
    throw new Error(
      `Invalid ${key}="${value}": must be lowercase snake_case (^[a-z0-9_]+$).`
    );
  }
  return trimmed;
}

/**
 * Builds a canonical SettlementCheck URL with validated lowercase snake_case UTM parameters.
 * Preserves existing query parameters (e.g. calculator figures) and URL hash fragments.
 */
export function buildTrackedUrl(pathOrUrl: string, utms: UtmParams): string {
  const raw = pathOrUrl.trim();
  const base = raw.startsWith('http://') || raw.startsWith('https://')
    ? raw
    : `${CANONICAL_ORIGIN}${raw.startsWith('/') ? '' : '/'}${raw}`;

  const url = new URL(base);
  url.protocol = 'https:';
  url.host = 'settlementcheck.co.uk';

  // Enforce trailing slash on page routes (ignore files with extensions)
  if (!url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) {
    url.pathname = `${url.pathname}/`;
  }

  url.searchParams.set('utm_source', assertValidUtmValue('utm_source', utms.utm_source));
  url.searchParams.set('utm_medium', assertValidUtmValue('utm_medium', utms.utm_medium));
  url.searchParams.set('utm_campaign', assertValidUtmValue('utm_campaign', utms.utm_campaign));
  url.searchParams.set('utm_content', assertValidUtmValue('utm_content', utms.utm_content));
  if (utms.utm_term) {
    url.searchParams.set('utm_term', assertValidUtmValue('utm_term', utms.utm_term));
  }

  return url.toString();
}

/**
 * Builds a validated lowercase snake_case UTM query string (without leading '?').
 */
export function buildUtmQuery(utms: UtmParams): string {
  const params = new URLSearchParams();
  params.set('utm_source', assertValidUtmValue('utm_source', utms.utm_source));
  params.set('utm_medium', assertValidUtmValue('utm_medium', utms.utm_medium));
  params.set('utm_campaign', assertValidUtmValue('utm_campaign', utms.utm_campaign));
  params.set('utm_content', assertValidUtmValue('utm_content', utms.utm_content));
  if (utms.utm_term) {
    params.set('utm_term', assertValidUtmValue('utm_term', utms.utm_term));
  }
  return params.toString();
}

/**
 * Converts a guide path (e.g. "/guides/tax-free-settlement-30000/") into "guide_tax_free_settlement_30000".
 */
export function guideUtmContent(guidePath: string): string {
  const slug = guidePath
    .replace(/^\/?guides\//i, '')
    .replace(/\/+$/, '');
  return `guide_${toUtmToken(slug)}`;
}
