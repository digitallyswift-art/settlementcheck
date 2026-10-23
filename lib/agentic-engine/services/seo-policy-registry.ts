/**
 * Curated SEO Guardrail Policy Registry (Zero-Bloat Learning Loop)
 * Stores deterministic, administrator-verified and adversarial-promoted route/intent policies.
 * Prevents prompt bloat and superstitious SERP noise by maintaining a deduplicated registry of active rules.
 */

import path from 'path';
import { SeoGuardrailPolicyRule } from '../types';
import { SafeFs } from './safe-fs';
import { normalizeCanonicalPath } from '../guardrails/seo-blast-radius-guard';

const BASELINE_POLICIES: SeoGuardrailPolicyRule[] = [
  {
    id: 'policy_route_home_title_lock',
    scopeType: 'ROUTE',
    scopeValue: '/',
    ruleTitle: 'Protect Homepage Headline & Primary Cluster Anchor',
    constraintDescription:
      "Never overwrite the Homepage (/) <title> or <h1> for secondary or Page 2 queries. Keep actuationScope as ADDITIVE_CONTENT_AND_LINKS unless explicitly recalibrating the primary anchor 'settlement agreement calculator'.",
    lockTitleOverwrite: true,
    requiredTokens: ['settlement', 'agreement', 'calculator'],
    prohibitedPhrases: ['how to calculate your settlement'],
    source: 'BASELINE_INVARIANT',
    createdAt: '2026-10-23T19:50:00.000Z',
  },
  {
    id: 'policy_route_calculator_title_lock',
    scopeType: 'ROUTE',
    scopeValue: '/calculator/',
    ruleTitle: 'Protect Main Calculator Transactional Intent',
    constraintDescription:
      "Preserve transactional tool intent on /calculator/. Never replace the <title> with informational 'How to...' phrasing.",
    lockTitleOverwrite: true,
    requiredTokens: ['settlement', 'calculator', 'uk'],
    prohibitedPhrases: ['how to calculate'],
    source: 'BASELINE_INVARIANT',
    createdAt: '2026-10-23T19:50:00.000Z',
  },
  {
    id: 'policy_global_itepa_tax_precision',
    scopeType: 'GLOBAL',
    scopeValue: '*',
    ruleTitle: 'ITEPA 2003 s.403 & s.402D PENP Statutory Precision',
    constraintDescription:
      "Never use promissory phrasing like 'You can expect up to £30,000 tax-free'. Always state that genuine non-contractual compensation up to £30,000 can be paid tax-free under s.403 ITEPA 2003, whereas contractual PILON and Post-Employment Notice Pay (s.402D) remain subject to income tax and National Insurance.",
    lockTitleOverwrite: false,
    requiredTokens: [],
    prohibitedPhrases: ['you can expect up to', 'guaranteed £30,000'],
    source: 'BASELINE_INVARIANT',
    createdAt: '2026-10-23T19:50:00.000Z',
  },
];

export class SeoPolicyRegistry {
  private static readonly REGISTRY_PATH = path.resolve('data/serp-actions/seo-policy-registry.json');
  private static memoryRules: SeoGuardrailPolicyRule[] | null = null;

  public static getAllPolicies(): SeoGuardrailPolicyRule[] {
    if (this.memoryRules && this.memoryRules.length > 0) {
      return this.memoryRules;
    }

    const raw = SafeFs.readFileSyncSafe(this.REGISTRY_PATH, 'utf-8');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.memoryRules = parsed;
          return parsed;
        }
      } catch {}
    }

    this.memoryRules = [...BASELINE_POLICIES];
    return this.memoryRules;
  }

  /**
   * Returns matching policies for a specific canonical URL/route and search intent
   */
  public static getPoliciesForContext(targetUrlOrRoute: string, intent?: string): SeoGuardrailPolicyRule[] {
    const normRoute = normalizeCanonicalPath(targetUrlOrRoute);
    const all = this.getAllPolicies();

    return all.filter(rule => {
      if (rule.scopeType === 'GLOBAL') return true;
      if (rule.scopeType === 'ROUTE' && normalizeCanonicalPath(rule.scopeValue) === normRoute) return true;
      if (rule.scopeType === 'INTENT' && intent && rule.scopeValue === intent) return true;
      return false;
    });
  }

  /**
   * Checks if any active policy locks `<title>` overwrite for the given route
   */
  public static isRouteTitleLocked(targetUrlOrRoute: string, query?: string, primaryAnchor?: string): boolean {
    const normRoute = normalizeCanonicalPath(targetUrlOrRoute);
    const policies = this.getPoliciesForContext(normRoute);
    const hasLock = policies.some(p => Boolean(p.lockTitleOverwrite));
    if (!hasLock) return false;

    // Allow primary anchor recalibration only if query is the exact primary anchor
    if (query && primaryAnchor && query.toLowerCase().trim() === primaryAnchor.toLowerCase().trim()) {
      return false;
    }
    return true;
  }

  /**
   * Promotes and persists a verified rule into the curated registry (deduplicated by id or scope+title)
   */
  public static promotePolicyRule(rule: Omit<SeoGuardrailPolicyRule, 'id' | 'createdAt'> & { id?: string }): SeoGuardrailPolicyRule {
    const all = [...this.getAllPolicies()];
    const id = rule.id || `policy_${Date.now()}`;
    const newRule: SeoGuardrailPolicyRule = {
      ...rule,
      id,
      createdAt: new Date().toISOString(),
    };

    const existingIdx = all.findIndex(
      r => r.id === id || (r.scopeType === newRule.scopeType && r.scopeValue === newRule.scopeValue && r.ruleTitle === newRule.ruleTitle)
    );

    if (existingIdx >= 0) {
      all[existingIdx] = newRule;
    } else {
      // Cap total rules at 25 to guarantee zero prompt bloat
      if (all.length >= 25) {
        const removableIdx = all.findIndex(r => r.source !== 'BASELINE_INVARIANT');
        if (removableIdx >= 0) all.splice(removableIdx, 1);
      }
      all.push(newRule);
    }

    this.memoryRules = all;
    SafeFs.writeFileSyncSafe(this.REGISTRY_PATH, JSON.stringify(all, null, 2), 'utf-8');
    return newRule;
  }

  /**
   * Formats matching policies into a concise, contradiction-free prompt block for agents
   */
  public static formatPromptConstraints(targetUrlOrRoute: string, intent?: string): string {
    const matched = this.getPoliciesForContext(targetUrlOrRoute, intent).slice(0, 5);
    if (matched.length === 0) return '';

    return matched
      .map((r, i) => `${i + 1}. [${r.scopeType}: ${r.scopeValue}] ${r.ruleTitle}: ${r.constraintDescription}`)
      .join('\n');
  }
}
