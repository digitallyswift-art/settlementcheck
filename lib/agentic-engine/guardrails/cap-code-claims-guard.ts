/**
 * ASA / CAP Code Claims Guardrail
 * Corresponding to AGENTS.md Section 2.H and .agents/skills/claims-privacy-auditor/
 *
 * Enforces UK Advertising Standards Authority (ASA) CAP Code Rule 3.1 and 3.7 compliance:
 * - Marketers must hold documentary evidence to prove all objective claims before publishing.
 * - Prevents unverified market assertions ("average settlement", "most employers", "market data").
 * - Prohibits misleading certainty ("almost always", "guaranteed payout").
 */

export interface CapCodeClaimViolation {
  phrase: string;
  riskReason: string;
  capCodeRule: string;
  severity: 'P1' | 'P2';
}

export const CAP_CODE_RESTRICTED_PATTERNS: Array<{
  phrase: string;
  regex: RegExp;
  riskReason: string;
  capCodeRule: string;
  severity: 'P1' | 'P2';
  safeReplacement?: string;
}> = [
  {
    phrase: 'typical settlement',
    regex: /\btypical\s+settlement\b/i,
    riskReason: 'Suggests a standard settlement payout baseline without empirical verification.',
    capCodeRule: 'CAP Code 3.1 (Misleading Advertising)',
    severity: 'P1',
    safeReplacement: 'settlement offer',
  },
  {
    phrase: '1 to 3 months',
    regex: /\b(1\s*to\s*3\s*months?|one\s*to\s*three\s*months?)\b/i,
    riskReason: 'Informal HR rule-of-thumb presented as an authoritative legal benchmark.',
    capCodeRule: 'CAP Code 3.7 (Substantiation)',
    severity: 'P1',
  },
  {
    phrase: 'most employers',
    regex: /\bmost\s+employers\b/i,
    riskReason: 'Broad, unproven collective assertion about employer conduct or offer values.',
    capCodeRule: 'CAP Code 3.1 (Misleading Advertising)',
    severity: 'P2',
    safeReplacement: 'many employers',
  },
  {
    phrase: 'almost always',
    regex: /\balmost\s+always\b/i,
    riskReason: 'Overstated certainty in legal or negotiation outcomes.',
    capCodeRule: 'CAP Code 3.1 (Exaggeration)',
    severity: 'P2',
    safeReplacement: 'often',
  },
  {
    phrase: 'true maximum',
    regex: /\btrue\s+maximum\b/i,
    riskReason: 'Ambiguous claim overlooking uncapped discrimination awards vs statutory compensatory limits.',
    capCodeRule: 'CAP Code 3.1 (Misleading Advertising)',
    severity: 'P1',
    safeReplacement: 'statutory cap',
  },
  {
    phrase: 'average settlement',
    regex: /\baverage\s+settlement\b/i,
    riskReason: 'Implies statistically verified average across UK settlements without published sample data.',
    capCodeRule: 'CAP Code 3.7 (Substantiation)',
    severity: 'P1',
    safeReplacement: 'settlement estimate',
  },
  {
    phrase: 'market data',
    regex: /\bmarket\s+data\b/i,
    riskReason: 'Implies third-party representative market dataset exists unless qualified as internal platform telemetry.',
    capCodeRule: 'CAP Code 3.7 (Substantiation)',
    severity: 'P2',
    safeReplacement: 'platform benchmarks',
  },
  {
    phrase: 'most solicitors',
    regex: /\bmost\s+solicitors\b/i,
    riskReason: 'Unsubstantiated claim about solicitor pricing, acceptance rates, or negotiation practices.',
    capCodeRule: 'CAP Code 3.1 (Misleading Advertising)',
    severity: 'P2',
    safeReplacement: 'specialist solicitors',
  },
  {
    phrase: 'guaranteed payout',
    regex: /\bguaranteed\s+(payout|settlement|amount|sum)\b/i,
    riskReason: 'Impermissible certainty regarding settlement negotiation or tribunal awards.',
    capCodeRule: 'CAP Code 3.1 (Misleading Advertising)',
    severity: 'P1',
    safeReplacement: 'estimated entitlement',
  },
  {
    phrase: 'unverified aggregate volume counter',
    regex: /\b(over\s+)?£?\d+(\.\d+)?[mbk]\+?\s+(in\s+)?(uk\s+)?(settlement\s+offers?|settlement\s+agreements?|payouts?|claims?|compensation)?\s*(evaluated|reviewed|processed|calculated|secured)\b/i,
    riskReason: 'Unverified aggregate volume or financial sum claim prohibited under CAP Code 3.7 without documented telemetry.',
    capCodeRule: 'CAP Code 3.7 (Substantiation)',
    severity: 'P1',
    safeReplacement: 'Updated for April 2026 UK statutory rates',
  },
  {
    phrase: 'offers evaluated counter',
    regex: /\b(offers|settlements)\s+evaluated\b/i,
    riskReason: 'Unverified transaction counter implies empirical database volume without telemetry grounding.',
    capCodeRule: 'CAP Code 3.7 (Substantiation)',
    severity: 'P1',
    safeReplacement: 'statutory calculations',
  },
  {
    phrase: 'unsubstantiated user count',
    regex: /\b\d+([,.]\d+)?\+?\s*(uk\s+)?(employees|clients|users|cases|people)\s+(helped|served|evaluated|advised)\b/i,
    riskReason: 'Unsubstantiated client count violates CAP Code 3.7 objective claim substantiation requirement.',
    capCodeRule: 'CAP Code 3.7 (Substantiation)',
    severity: 'P1',
    safeReplacement: 'UK employees',
  },
  {
    phrase: 'unverified satisfaction rating',
    regex: /\b(\d+(\.\d+)?\s*\/\s*5(\s+stars?|\s+rating)?|\d{2,3}%\s+(satisfaction|success\s*rate))\b/i,
    riskReason: 'Star rating or satisfaction percentage prohibited without verified independent review platform integration.',
    capCodeRule: 'CAP Code 3.1 & 3.7 (Substantiation)',
    severity: 'P1',
  },
  {
    phrase: 'unverified market superlative',
    regex: /\b(uk's\s+leading|uk's\s+#1|the\s+number\s+one\s+settlement\s+calculator)\b/i,
    riskReason: 'Unsubstantiated market leadership claim prohibited under CAP Code Rule 3.1 & 3.3.',
    capCodeRule: 'CAP Code 3.3 (Comparative Advertising)',
    severity: 'P1',
    safeReplacement: 'independent UK settlement calculator',
  },
];

/**
 * Scans text for unsubstantiated marketing claims under CAP Code rules
 */
export function auditClaimsAndSubstantiation(text: string): {
  isCompliant: boolean;
  violations: CapCodeClaimViolation[];
} {
  const violations: CapCodeClaimViolation[] = [];

  for (const pattern of CAP_CODE_RESTRICTED_PATTERNS) {
    if (pattern.regex.test(text)) {
      violations.push({
        phrase: pattern.phrase,
        riskReason: pattern.riskReason,
        capCodeRule: pattern.capCodeRule,
        severity: pattern.severity,
      });
    }
  }

  return {
    isCompliant: violations.length === 0,
    violations,
  };
}

/**
 * Sanitizes marketing copy by replacing risky assertions with legally qualified terms
 */
export function sanitizeMarketingClaims(text: string): {
  sanitizedText: string;
  isModified: boolean;
  replacedPhrases: string[];
} {
  let sanitized = text;
  const replacedPhrases: string[] = [];

  for (const pattern of CAP_CODE_RESTRICTED_PATTERNS) {
    if (pattern.safeReplacement && pattern.regex.test(sanitized)) {
      sanitized = sanitized.replace(pattern.regex, pattern.safeReplacement);
      replacedPhrases.push(pattern.phrase);
    }
  }

  return {
    sanitizedText: sanitized,
    isModified: replacedPhrases.length > 0,
    replacedPhrases,
  };
}

/**
 * Validates inter-agent handoff contracts under the Evidence-Bounded Inter-Agent Protocol (EBIAP)
 */
import type { AgentHandoffContract, HandoffValidationResult } from '../types';

export function validateAgentHandoff(handoff: AgentHandoffContract): HandoffValidationResult {
  // 1. Audit text against CAP code restricted patterns
  const claimsAudit = auditClaimsAndSubstantiation(handoff.proposedCopyOrSpec);
  if (!claimsAudit.isCompliant) {
    return {
      isValid: false,
      rejectionReason: `Handoff rejected under CAP Code compliance: ${claimsAudit.violations.map(v => v.phrase).join(', ')}`,
      interceptedViolations: claimsAudit.violations.map(v => `${v.phrase}: ${v.riskReason}`),
    };
  }

  // 2. Telemetry and metric claims must carry valid substantiation proof
  if (handoff.claimClassification === 'SYSTEM_TELEMETRY') {
    if (!handoff.substantiationProof?.databaseQuery && !handoff.substantiationProof?.empiricalSourceUrl) {
      return {
        isValid: false,
        rejectionReason: `Handoff rejected: Claim classified as SYSTEM_TELEMETRY but lacks mandatory databaseQuery or empiricalSourceUrl substantiation proof.`,
      };
    }
  }

  // 3. Statutory claims must reference primary statute
  if (handoff.claimClassification === 'STATUTORY_INVARIANT') {
    if (!handoff.substantiationProof?.statuteReference) {
      return {
        isValid: false,
        rejectionReason: `Handoff rejected: Claim classified as STATUTORY_INVARIANT but lacks primary statuteReference (e.g. ERA 1996 s.162 or ITEPA 2003 s.403).`,
      };
    }
  }

  return { isValid: true };
}
