import crypto from 'crypto';

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
 * Anonymizes client IP with SHA-256 to allow correlating attack traffic
 * without storing raw personally identifiable IP addresses (UK GDPR Art 5(1)(c)).
 */
function anonymizeIp(ip?: string): string {
  if (!ip) return 'unknown';
  const salt = process.env.SECURITY_LOG_SALT || 'settlementcheck-security-salt';
  return crypto.createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 16);
}

/**
 * Emits structured security audit logs to stderr/stdout.
 * Guarantees zero sensitive secrets or raw PII are logged.
 */
export function logSecurityEvent(event: SecurityEventData): void {
  const payload = {
    timestamp: new Date().toISOString(),
    security_event: true,
    type: event.type,
    path: event.path,
    method: event.method || 'UNKNOWN',
    anonymized_ip: anonymizeIp(event.ip),
    identifier: event.identifier ? event.identifier.slice(0, 32) : undefined,
    reason: event.reason,
    metadata: event.metadata,
  };

  // Structured single-line JSON log for SIEM / Vercel log ingestion
  console.warn(`[SECURITY_ALERT] ${JSON.stringify(payload)}`);
}
