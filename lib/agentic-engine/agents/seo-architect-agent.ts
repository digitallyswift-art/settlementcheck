/**
 * Specialist SEO Architect Agent
 * Specialises in technical SEO, intent classification, programmatic page architecture,
 * Schema.org JSON-LD generation, pixel-calibrated constraints, and statutory E-E-A-T compliance.
 */

import { callAI } from '@/lib/ai/gateway';
import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates';
import { classifyStatutoryRequirementCategory } from '../guardrails/sra-boundary-guard';
import { SERP_PIXEL_BUDGETS } from '../tools/serp-pixel-calculator';
import { QueryClusterProfile, SeoSearchIntent, SeoTechnicalBrief } from '../types';

export interface SeoAuditContext {
  query: string;
  impressions: number;
  clicks: number;
  position: number;
  ctr: number;
  targetUrl?: string;
  queryClusterProfile?: QueryClusterProfile;
  targetPageExistingH1?: string;
}

export class SeoArchitectAgent {
  public static readonly DOMAIN = 'https://settlementcheck.co.uk';

  /**
   * Canonical baseline H1 headings per route to enforce Title-to-H1 DOM alignment
   */
  public static readonly CANONICAL_ROUTE_H1_MAP: Record<string, string> = {
    '/': 'Settlement Agreement Calculator UK (2026 Rates)',
    '/calculator/': 'Free Employee Settlement Agreement Calculator UK (2026 Rates)',
    '/calculators/': 'UK Employment & Settlement Agreement Calculators (2026)',
    '/redundancy-calculator/': 'Statutory Redundancy Pay Calculator UK (2026 Rates)',
    '/unfair-dismissal-calculator/': 'Unfair Dismissal Compensation Calculator UK (2026)',
    '/constructive-dismissal-calculator/': 'Constructive Dismissal Payout Calculator UK (2026)',
    '/settlement-agreement-tax-calculator/': 'Settlement Agreement Tax Calculator (£30,000 Exemption)',
    '/protective-award-calculator/': 'Protective Award Calculator UK (90 Days Gross Pay)',
    '/pip-settlement-calculator/': 'PIP Settlement Agreement Calculator UK',
    '/settlement-agreement-review/': 'Settlement Agreement Checker UK (2026)',
    '/guides/compromise-agreement-calculator-uk/': 'Compromise Agreement Calculator UK (2026 Statutory Guide)',
    '/guides/how-to-negotiate-a-settlement-agreement/': 'How to Negotiate a Settlement Agreement in the UK',
    '/guides/redundancy-pay-cap-2026/': 'The Redundancy Pay Cap in 2026: What £751 Per Week Means for Your Settlement',
    '/guides/settlement-agreement-how-much/': 'How Much Should I Get in a Settlement Agreement? (2026 UK Guide)',
    '/guides/tax-free-settlement-30000/': 'Tax-Free Settlement Agreements: How the £30,000 Rule Works in 2026',
    '/guides/discrimination-settlement-agreements/': 'Discrimination Settlement Agreements UK: Compensation, Vento Bands & Tax Rules (2026)',
    '/guides/pressured-to-sign/': 'My employer is pressuring me to sign a settlement agreement quickly. What are my rights?',
    '/guides/protected-conversations-without-prejudice/': 'Protected Conversations and Without Prejudice: The UK Employee Guide',
    '/guides/average-settlement-agreement-payout-uk/': 'Average Settlement Agreement Payout UK (2026 Official Benchmarks)',
    '/guides/pilon-tax-treatment-2026/': 'PILON Tax Treatment 2026: Notice Pay & Post-Employment Notice Pay (PENP)',
    '/guides/what-happens-if-you-do-not-sign/': 'What Happens If You Refuse to Sign a Settlement Agreement? (UK Guide)',
    '/guides/can-an-employer-withdraw-a-settlement-agreement/': 'Can an Employer Withdraw a Settlement Agreement Offer? (UK Law)',
    '/guides/settlement-agreement-sick-leave/': 'Settlement Agreements on Sick Leave & Medical Capability (2026 UK Guide)',
    '/guides/settlement-agreement-instead-of-pip/': 'Settlement Agreement Instead of PIP: Your Legal Rights & Strategy',
    '/guides/settlement-agreement-acas-calculations/': 'ACAS Settlement Agreement Calculations & Early Conciliation (2026)',
  };

  /**
   * Deterministically classifies search query intent
   */
  public static classifyIntent(query: string): SeoSearchIntent {
    const q = query.toLowerCase();

    // 1. Compromise agreement legacy terminology
    if (q.includes('compromise agreement') || q.includes('compromise')) {
      return 'COMPROMISE_AGREEMENT_LEGACY';
    }

    // 2. Tax / Statutory Exemption (ITEPA s.403 / PENP s.402D / £30k exemption)
    if (
      q.includes('tax') ||
      q.includes('pilon') ||
      q.includes('30000') ||
      q.includes('30,000') ||
      q.includes('30k') ||
      q.includes('itepa') ||
      q.includes('penp')
    ) {
      return 'TAX_STATUTORY_EXEMPTION';
    }

    // 3. Government / ACAS official benchmark queries
    if (q.includes('gov') || q.includes('government') || q.includes('acas')) {
      return 'GOV_ACAS_BENCHMARK';
    }

    // 4. Emotional / Dispute / Tactics / Negotiation queries
    if (
      q.includes('constructive') ||
      q.includes('discrimination') ||
      q.includes('bullying') ||
      q.includes('harassment') ||
      q.includes('pressured') ||
      q.includes('pip') ||
      q.includes('sick leave') ||
      q.includes('protected conversation') ||
      q.includes('without prejudice') ||
      q.includes('negotiat') ||
      q.includes('not sign') ||
      q.includes('refuse') ||
      q.includes('withdraw')
    ) {
      return 'EMOTIONAL_DISPUTE';
    }

    // 5. Redundancy & dismissal disputes
    if (q.includes('redundancy') || q.includes('severance') || q.includes('unfair') || q.includes('tribunal') || q.includes('dismissal')) {
      return 'REDUNDANCY_DISPUTE';
    }

    // 6. Solicitor selection & legal representation
    if (q.includes('solicitor') || q.includes('lawyer') || q.includes('legal advice') || q.includes('near me')) {
      return 'SOLICITOR_SELECTION';
    }

    // 7. Strictly computational transactional calculator queries
    if (q.includes('calculator') || q.includes('calculate') || q.includes('calc')) {
      return 'TRANSACTIONAL_CALCULATOR';
    }

    return 'GENERAL_SETTLEMENT';
  }

  /**
   * Maps query intent to canonical site route enforcing the 4-Pillar Authority Architecture
   * and trailing slash invariant, preventing keyword cannibalization.
   */
  public static resolveCanonicalRoute(query: string, intent: SeoSearchIntent, targetUrl?: string): string {
    const q = query.toLowerCase();

    // Priority 1: If a specific dedicated deep route was provided in targetUrl, honor it
    // (Explicitly exclude root '/' and generic '/calculator/' to eliminate legacy cannibalization)
    if (targetUrl && (targetUrl.startsWith('http://') || targetUrl.startsWith('https://'))) {
      try {
        const urlObj = new URL(targetUrl);
        let path = urlObj.pathname;
        if (!path.endsWith('/')) path += '/';
        if (path !== '/' && path !== '/calculator/' && path !== '') {
          return path;
        }
      } catch {
        // Fall back to intent routing
      }
    }

    // Priority 2: Pillar 2 — Tax & Exemption (ITEPA / PENP / £30k)
    if (
      q.includes('tax') ||
      q.includes('30000') ||
      q.includes('30,000') ||
      q.includes('30k') ||
      q.includes('itepa') ||
      q.includes('penp') ||
      q.includes('pilon') ||
      intent === 'TAX_STATUTORY_EXEMPTION'
    ) {
      if (q.includes('pilon') && !q.includes('calculator')) {
        return '/guides/pilon-tax-treatment-2026/';
      }
      if ((q.includes('30000') || q.includes('30,000') || q.includes('30k')) && !q.includes('calc') && !q.includes('calculator')) {
        return '/guides/tax-free-settlement-30000/';
      }
      return '/settlement-agreement-tax-calculator/';
    }

    // Priority 3: Pillar 3 — Valuation, Averages & How-Much Benchmarks
    if (
      q.includes('how much') ||
      q.includes('average') ||
      q.includes('typical') ||
      q.includes('worth') ||
      q.includes('benchmark') ||
      q.includes('payout amount') ||
      q.includes('settlement amount') ||
      q.includes('what should i ask') ||
      q.includes('how much should')
    ) {
      if (q.includes('average') && (q.includes('payout') || q.includes('award'))) {
        return '/guides/average-settlement-agreement-payout-uk/';
      }
      return '/guides/settlement-agreement-how-much/';
    }

    // Priority 4: Pillar 4 — Tactics, Dispute & Statutory Rights
    if (q.includes('pressured') || q.includes('pressure') || q.includes('rush') || q.includes('deadline')) {
      return '/guides/pressured-to-sign/';
    }
    if (q.includes('without prejudice') || q.includes('protected conversation')) {
      return '/guides/protected-conversations-without-prejudice/';
    }
    if (q.includes('not sign') || q.includes('refuse') || q.includes('refusing') || q.includes('decline')) {
      return '/guides/what-happens-if-you-do-not-sign/';
    }
    if (q.includes('withdraw') || q.includes('withdrawn') || q.includes('retract')) {
      return '/guides/can-an-employer-withdraw-a-settlement-agreement/';
    }
    if (q.includes('sick') || q.includes('illness') || q.includes('stress leave')) {
      return '/guides/settlement-agreement-sick-leave/';
    }
    if (q.includes('pip') || q.includes('performance improvement')) {
      return q.includes('calculator') || q.includes('calc')
        ? '/pip-settlement-calculator/'
        : '/guides/settlement-agreement-instead-of-pip/';
    }
    if (q.includes('constructive')) {
      return q.includes('guide') || q.includes('rights')
        ? '/guides/constructive-dismissal-settlement-agreements/'
        : '/constructive-dismissal-calculator/';
    }
    if (q.includes('discrimination') || q.includes('harassment') || q.includes('bullying') || q.includes('maternity')) {
      return '/guides/discrimination-settlement-agreements/';
    }
    if (q.includes('unfair dismissal')) {
      return q.includes('guide') || q.includes('rights')
        ? '/guides/unfair-dismissal-settlement-agreements/'
        : '/unfair-dismissal-calculator/';
    }
    if (q.includes('negotiat') || q.includes('counter offer') || q.includes('counter-offer')) {
      return '/guides/how-to-negotiate-a-settlement-agreement/';
    }
    if (q.includes('compromise agreement') || q.includes('compromise')) {
      return '/guides/compromise-agreement-calculator-uk/';
    }
    if (q.includes('solicitor') || q.includes('lawyer') || q.includes('legal fee') || q.includes('adviser')) {
      return q.includes('employer') || q.includes('own')
        ? '/guides/employer-recommended-solicitor/'
        : '/get-matched/';
    }

    // Priority 5: Pillar 1 — Transactional Calculators
    if (q.includes('redundancy')) {
      if (q.includes('cap') || q.includes('2026')) {
        return '/guides/redundancy-pay-cap-2026/';
      }
      return '/redundancy-calculator/';
    }
    if (q.includes('protective award')) {
      return '/protective-award-calculator/';
    }
    if (
      intent === 'TRANSACTIONAL_CALCULATOR' ||
      q.includes('calculator') ||
      q.includes('calculate') ||
      q.includes('calc')
    ) {
      return '/calculator/';
    }

    // Fallback based on categorized intent (TAX_STATUTORY_EXEMPTION & TRANSACTIONAL_CALCULATOR already handled above)
    switch (intent) {
      case 'COMPROMISE_AGREEMENT_LEGACY':
        return '/guides/compromise-agreement-calculator-uk/';
      case 'GOV_ACAS_BENCHMARK':
        return '/guides/settlement-agreement-acas-calculations/';
      case 'REDUNDANCY_DISPUTE':
        return '/redundancy-calculator/';
      case 'EMOTIONAL_DISPUTE':
        return '/guides/how-to-negotiate-a-settlement-agreement/';
      case 'SOLICITOR_SELECTION':
        return '/get-matched/';
      case 'GENERAL_SETTLEMENT':
      default:
        return '/guides/settlement-agreement-how-much/';
    }
  }

  /**
   * Detects whether a proposed route causes keyword cannibalization against dedicated authority pillars
   */
  public static detectCannibalizationRisk(query: string, proposedRoute: string): {
    hasRisk: boolean;
    preferredRoute?: string;
    reason?: string;
  } {
    const normProposed = proposedRoute.endsWith('/') ? proposedRoute : `${proposedRoute}/`;
    const canonicalRoute = this.resolveCanonicalRoute(query, this.classifyIntent(query));

    if (normProposed !== canonicalRoute) {
      // Flag if an informational/tax/benchmark query is targeting root homepage or root calculator
      if ((normProposed === '/' || normProposed === '/calculator/') && canonicalRoute !== '/calculator/' && canonicalRoute !== '/') {
        return {
          hasRisk: true,
          preferredRoute: canonicalRoute,
          reason: `Query "${query}" exhibits specific pillar intent for ${canonicalRoute}, but is targeted at generic ${normProposed}. This causes keyword cannibalization.`,
        };
      }
    }

    return { hasRisk: false };
  }

  /**
   * Resolves relevant source pages for contextual internal link equity channelling
   */
  public static resolveInternalLinkSources(destinationRoute: string): string[] {
    const candidates = [
      '/',
      '/calculator/',
      '/guides/how-to-negotiate-a-settlement-agreement/',
      '/guides/settlement-agreement-how-much/',
      '/guides/protected-conversations-without-prejudice/',
    ];

    // Filter out the destination itself
    return candidates.filter(r => r !== destinationRoute).slice(0, 3);
  }

  /**
   * Generates a complete SEO Technical Brief for the Conversion Copywriter Agent
   */
  public static async generateTechnicalBrief(context: SeoAuditContext): Promise<SeoTechnicalBrief> {
    const intent = this.classifyIntent(context.query);
    const statutoryCategory = classifyStatutoryRequirementCategory(context.query);
    const destinationRoute = this.resolveCanonicalRoute(context.query, intent, context.targetUrl);
    const sourceRoutes = this.resolveInternalLinkSources(destinationRoute);
    const isCalculatorRoute = destinationRoute.includes('calculator');

    const statutoryInvariants = {
      weeklyCapGB: STATUTORY_RATES_2026_27.weeklyCapGB, // £751
      weeklyCapNI: STATUTORY_RATES_2026_27.weeklyCapNI, // £783
      taxFreeThreshold: STATUTORY_RATES_2026_27.taxFreeLimit, // £30,000
      unfairDismissalCap: STATUTORY_RATES_2026_27.compensatoryAwardLimitGB, // £123,543
      protectiveAwardDays: 90, // TULRCA 1992 s.189
    };

    const existingH1 =
      context.targetPageExistingH1 ||
      this.CANONICAL_ROUTE_H1_MAP[destinationRoute] ||
      `${context.query.replace(/\b\w/g, c => c.toUpperCase())} UK (2026 Guide)`;

    // Construct deterministic brief (deprecating commercial FAQPage schema in favor of WebApplication / Article)
    const brief: SeoTechnicalBrief = {
      query: context.query,
      currentMetrics: {
        impressions: context.impressions,
        clicks: context.clicks,
        position: context.position,
        ctr: context.ctr,
      },
      searchIntent: intent,
      statutoryCategory,
      targetCanonicalUrl: `${this.DOMAIN}${destinationRoute}`,
      targetPageExistingH1: existingH1,
      queryClusterProfile: context.queryClusterProfile,
      characterBudgets: {
        titleMin: 50,
        titleMax: 60,
        metaMin: 140,
        metaMax: 155,
        titleMaxPixels: SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX,
        metaMaxPixels: SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX,
      },
      statutoryInvariants,
      schemaSpecification: {
        type: isCalculatorRoute ? 'WebApplication' : 'Article',
        primarySubject: context.query,
        targetFaqQuestion: `How does ${context.query} work under UK employment law?`,
      },
      internalLinkGraph: {
        sourceRoutes,
        destinationRoute,
        exactAnchorText: context.query,
      },
    };

    // Optionally refine schema questions or secondary keywords via AI if active
    try {
      const prompt = `
You are the senior SEO Architect for SettlementCheck (settlementcheck.co.uk).
Review this technical brief for query "${context.query}" (Rank: ${context.position}, Impressions: ${context.impressions}).
Confirm or refine the single most high-intent direct-answer question for UK employment law.
Search Intent: ${intent}
Statutory Category: ${statutoryCategory}
Statutory Caps to honor: £751/week cap (April 2026), £30,000 ITEPA tax-free exemption, Section 203 ERA 1996.
Note: Standalone commercial FAQPage schema is deprecated; use "WebApplication", "Article", or "HowTo".

Return a JSON object:
{
  "refinedFaqQuestion": string,
  "schemaType": "WebApplication" | "Article" | "HowTo"
}
`;

      const aiRes = await callAI({
        tier: 'fast',
        messages: [{ role: 'user', content: prompt }],
        jsonMode: true,
      });

      if (aiRes.structuredData && typeof aiRes.structuredData === 'object') {
        const data = aiRes.structuredData as Record<string, any>;
        if (data.refinedFaqQuestion) {
          brief.schemaSpecification.targetFaqQuestion = String(data.refinedFaqQuestion);
        }
        if (data.schemaType && data.schemaType !== 'FAQPage') {
          brief.schemaSpecification.type = data.schemaType;
        }
      }
    } catch {
      // Offline fallback: keep deterministic brief
    }

    return brief;
  }
}
