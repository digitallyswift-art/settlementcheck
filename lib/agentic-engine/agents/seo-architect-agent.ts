/**
 * Specialist SEO Architect Agent
 * Specialises in technical SEO, intent classification, programmatic page architecture,
 * Schema.org JSON-LD generation, character-calibrated constraints, and statutory E-E-A-T compliance.
 */

import { callAI } from '@/lib/ai/gateway';
import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates';
import { SeoSearchIntent, SeoTechnicalBrief } from '../types';

export interface SeoAuditContext {
  query: string;
  impressions: number;
  clicks: number;
  position: number;
  ctr: number;
  targetUrl?: string;
}

export class SeoArchitectAgent {
  public static readonly DOMAIN = 'https://settlementcheck.co.uk';

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
   */
  public static resolveCanonicalRoute(query: string, intent: SeoSearchIntent, targetUrl?: string): string {
    if (targetUrl && targetUrl.startsWith('http')) {
      try {
        const urlObj = new URL(targetUrl);
        let path = urlObj.pathname;
        if (!path.endsWith('/')) path += '/';
        return path;
      } catch {
        // Fall back to intent routing
      }
    }

    switch (intent) {
      case 'COMPROMISE_AGREEMENT_LEGACY':
        return '/guides/compromise-agreement-calculator-uk/';
      case 'TRANSACTIONAL_CALCULATOR':
        return '/calculator/';
      case 'TAX_STATUTORY_EXEMPTION':
        return '/guides/settlement-agreement-tax-calculator-uk/';
      case 'GOV_ACAS_BENCHMARK':
        return '/calculator/';
      case 'REDUNDANCY_DISPUTE':
        return '/guides/settlement-agreement-redundancy-calculator/';
      case 'SOLICITOR_SELECTION':
        return '/for-solicitors/';
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
      '/guides/how-much-should-i-ask-for-in-a-settlement-agreement/',
      '/guides/without-prejudice-rules-uk-settlement-agreements/',
    ];

    // Filter out the destination itself
    return candidates.filter(r => r !== destinationRoute).slice(0, 3);
  }

  /**
   * Generates a complete SEO Technical Brief for the Conversion Copywriter Agent
   */
  public static async generateTechnicalBrief(context: SeoAuditContext): Promise<SeoTechnicalBrief> {
    const intent = this.classifyIntent(context.query);
    const destinationRoute = this.resolveCanonicalRoute(context.query, intent, context.targetUrl);
    const sourceRoutes = this.resolveInternalLinkSources(destinationRoute);

    const statutoryInvariants = {
      weeklyCapGB: STATUTORY_RATES_2026_27.weeklyCapGB, // £751
      weeklyCapNI: STATUTORY_RATES_2026_27.weeklyCapNI, // £783
      taxFreeThreshold: STATUTORY_RATES_2026_27.taxFreeLimit, // £30,000
      unfairDismissalCap: STATUTORY_RATES_2026_27.compensatoryAwardLimitGB, // £123,543
      protectiveAwardDays: 90, // TULRCA 1992 s.189
    };

    // Construct deterministic brief
    const brief: SeoTechnicalBrief = {
      query: context.query,
      currentMetrics: {
        impressions: context.impressions,
        clicks: context.clicks,
        position: context.position,
        ctr: context.ctr,
      },
      searchIntent: intent,
      targetCanonicalUrl: `${this.DOMAIN}${destinationRoute}`,
      characterBudgets: {
        titleMin: 50,
        titleMax: 60,
        metaMin: 140,
        metaMax: 155,
      },
      statutoryInvariants,
      schemaSpecification: {
        type: intent === 'TRANSACTIONAL_CALCULATOR' ? 'WebApplication' : 'FAQPage',
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
Confirm or refine the single most high-intent Schema FAQ question for UK employment law.
Search Intent: ${intent}
Statutory Caps to honor: £751/week cap (April 2026), £30,000 ITEPA tax-free exemption.

Return a JSON object:
{
  "refinedFaqQuestion": string,
  "schemaType": "FAQPage" | "WebApplication" | "HowTo"
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
        if (data.schemaType) {
          brief.schemaSpecification.type = data.schemaType;
        }
      }
    } catch {
      // Offline fallback: keep deterministic brief
    }

    return brief;
  }
}
