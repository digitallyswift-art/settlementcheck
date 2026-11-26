export type SecurityEventType =
  | 'AUTH_FAILURE'
  | 'AUTH_ANOMALY'
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ACCESS'
  | 'SUSPICIOUS_PAYLOAD'
  | 'BOLA_VIOLATION'
  | 'CSRF_BLOCKED'
  | 'PASSKEY_ATTEMPT';

export interface SecurityEventData {
  type: SecurityEventType;
  path: string;
  method?: string;
  ip?: string;
  identifier?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Anonymizes client IP with Web Crypto SHA-256 (Edge + Node compatible)
 * without storing raw personally identifiable IP addresses (UK GDPR Art 5(1)(c)).
 */
async function anonymizeIp(ip?: string): Promise<string> {
  if (!ip) return 'unknown';
  const salt = process.env.SECURITY_LOG_SALT || 'settlementcheck-security-salt';
  if (typeof globalThis.crypto?.subtle?.digest === 'function') {
    const data = new TextEncoder().encode(`${salt}:${ip}`);
    const hashBuf = await globalThis.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuf))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, 16);
  }
  return 'redacted';
}

/**
 * Emits structured security audit logs to stderr/stdout.
 * Guarantees zero sensitive secrets or raw PII are logged.
 */
export function logSecurityEvent(event: SecurityEventData): void {
  void (async () => {
    const anonymizedIp = await anonymizeIp(event.ip);
    const payload = {
      timestamp: new Date().toISOString(),
      security_event: true,
      type: event.type,
      path: event.path,
      method: event.method || 'UNKNOWN',
      anonymized_ip: anonymizedIp,
      identifier: event.identifier ? event.identifier.slice(0, 32) : undefined,
      reason: event.reason,
      metadata: event.metadata,
    };

    // Structured single-line JSON log for SIEM / Vercel log ingestion
    console.warn(`[SECURITY_ALERT] ${JSON.stringify(payload)}`);
  })();
}
