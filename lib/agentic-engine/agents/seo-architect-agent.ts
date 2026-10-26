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
  };

  /**
   * Deterministically classifies search query intent
   */
  public static classifyIntent(query: string): SeoSearchIntent {
    const q = query.toLowerCase();

    if (q.includes('compromise agreement')) {
      return 'COMPROMISE_AGREEMENT_LEGACY';
    }
    if (q.includes('tax') || q.includes('pilon') || q.includes('30000') || q.includes('£30,000') || q.includes('£30000')) {
      return 'TAX_STATUTORY_EXEMPTION';
    }
    if (q.includes('gov') || q.includes('acas')) {
      return 'GOV_ACAS_BENCHMARK';
    }
    if (
      q.includes('constructive') ||
      q.includes('discrimination') ||
      q.includes('bullying') ||
      q.includes('harassment') ||
      q.includes('pressured') ||
      q.includes('pip') ||
      q.includes('sick leave') ||
      q.includes('protected conversation') ||
      q.includes('without prejudice')
    ) {
      return 'EMOTIONAL_DISPUTE';
    }
    if (q.includes('redundancy') || q.includes('severance') || q.includes('unfair') || q.includes('tribunal') || q.includes('dismissal')) {
      return 'REDUNDANCY_DISPUTE';
    }
    if (q.includes('solicitor') || q.includes('lawyer') || q.includes('legal advice') || q.includes('near me')) {
      return 'SOLICITOR_SELECTION';
    }
    if (q.includes('calculator') || q.includes('calculate') || q.includes('calc') || q.includes('estimate') || q.includes('payout')) {
      return 'TRANSACTIONAL_CALCULATOR';
    }

    return 'GENERAL_SETTLEMENT';
  }

  /**
   * Maps query intent to canonical site route enforcing trailing slash invariant
   * and preventing cannibalization of dedicated tools by the root homepage.
   */
  public static resolveCanonicalRoute(query: string, intent: SeoSearchIntent, targetUrl?: string): string {
    const q = query.toLowerCase();

    // Priority 1: Prevent keyword cannibalization of dedicated calculator tools
    // Computational and calculator queries MUST route to /calculator/ or specialized tool, NEVER root homepage /
    if (q.includes('constructive')) return '/constructive-dismissal-calculator/';
    if (q.includes('pip')) return '/pip-settlement-calculator/';
    if (q.includes('discrimination')) return '/guides/discrimination-settlement-agreements/';
    if (q.includes('pressured')) return '/guides/pressured-to-sign/';
    if (q.includes('redundancy') && (q.includes('calc') || q.includes('pay') || q.includes('statutory'))) {
      return '/redundancy-calculator/';
    }
    if ((q.includes('tax') || q.includes('30000') || q.includes('30,000') || q.includes('pilon')) && (q.includes('calc') || intent === 'TAX_STATUTORY_EXEMPTION')) {
      return '/settlement-agreement-tax-calculator/';
    }
    if (intent === 'TRANSACTIONAL_CALCULATOR' || q.includes('calculate') || q.includes('calculator') || q.includes('payout')) {
      return '/calculator/';
    }

    // Priority 2: If a specific sub-route was provided in targetUrl (and is not root homepage), honor it
    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        const urlObj = new URL(targetUrl);
        let path = urlObj.pathname;
        if (!path.endsWith('/')) path += '/';
        if (path !== '/') {
          return path;
        }
      } catch {
        // Fall back to intent routing
      }
    }

    switch (intent) {
      case 'COMPROMISE_AGREEMENT_LEGACY':
        return '/guides/compromise-agreement-calculator-uk/';
      case 'TAX_STATUTORY_EXEMPTION':
        return '/settlement-agreement-tax-calculator/';
      case 'GOV_ACAS_BENCHMARK':
        return '/calculator/';
      case 'REDUNDANCY_DISPUTE':
        return '/redundancy-calculator/';
      case 'EMOTIONAL_DISPUTE':
        return '/guides/how-to-negotiate-a-settlement-agreement/';
      case 'SOLICITOR_SELECTION':
        return q.includes('employer') || q.includes('own')
          ? '/guides/employer-recommended-solicitor/'
          : '/get-matched/';
      case 'GENERAL_SETTLEMENT':
      default:
        return '/guides/how-to-negotiate-a-settlement-agreement/';
    }
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
