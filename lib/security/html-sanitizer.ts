/**
 * Utility for sanitizing untrusted user inputs before rendering into
 * HTML email templates or downstream text bodies to prevent HTML injection / XSS.
 */
export function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  const s = String(str);
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitizes and bounds arbitrary string inputs.
 */
export function sanitizeString(val: unknown, maxLen = 255): string {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
}

/**
 * Validates alphanumeric identifiers with hyphens/underscores (safe for partner IDs, UUIDs, tokens).
 */
export function isSafeIdentifier(val: unknown): boolean {
  if (typeof val !== 'string') return false;
  return /^[a-zA-Z0-9_-]{1,128}$/.test(val.trim());
}
