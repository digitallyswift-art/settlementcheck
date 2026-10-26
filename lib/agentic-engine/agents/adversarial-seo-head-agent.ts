/**
 * Specialist Adversarial Head of Legal SEO Agent
 * Critically audits autonomous SEO recommendations against:
 * 1. Site Architecture & Cannibalization (Protecting /, /calculator/, and primary cluster anchors)
 * 2. Google SERP Title-Link Rewrite & Navboost Mechanics (Title-to-H1 intent parity)
 * 3. AEO / AI Overview Information Gain (Worked statutory examples over generic 2-sentence fluff)
 * 4. UK Employment & Tax Law Precision (ERA 1996 s.203, ITEPA 2003 s.403 vs s.402D PENP)
 */

import { callAI } from '@/lib/ai/gateway';
import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates';
import {
  evaluateSeoBlastRadius,
  normalizeCanonicalPath,
} from '../guardrails/seo-blast-radius-guard';
import { SeoPolicyRegistry } from '../services/seo-policy-registry';
import {
  AdversarialSeoReviewResult,
  SeoActuationScope,
  SeoGuardrailPolicyRule,
} from '../types';
import { ConversionCopywriterAgent } from './conversion-copywriter-agent';
import { SeoArchitectAgent } from './seo-architect-agent';

export interface AdversarialReviewInput {
  id?: string;
  query: string;
  targetCanonicalUrl: string;
  actionType?: string;
  actuationScope?: SeoActuationScope;
  position?: number;
  impressions?: number;
  ctr?: number;
  primaryAnchorQuery?: string;
  targetPageExistingH1?: string;
  calibratedTitle: string;
  calibratedMetaDescription: string;
  faqQuestion?: string;
  faqAnswer?: string;
  contextualLinkSnippet?: string;
}

export class AdversarialSeoHeadAgent {
  /**
   * Crafts a high-Information-Gain AEO answer block with concrete statutory mechanics
   * (ERA 1996 s.162 / s.203 & ITEPA 2003 s.403 / s.402D PENP) so Google AI Overviews cite it.
   */
  public static craftHighAuthorityAeoFaq(
    query: string,
    normPath: string
  ): { question: string; answer: string } {
    const q = query.toLowerCase();
    const capGB = STATUTORY_RATES_2026_27.weeklyCapGB; // £751
    const taxFree = STATUTORY_RATES_2026_27.taxFreeLimit; // £30,000

    if (q.includes('tax') || q.includes('30,000') || q.includes('30000') || q.includes('pilon')) {
      return {
        question: `How are UK settlement agreement payments taxed under ITEPA 2003?`,
        answer: `Under Section 403 of ITEPA 2003, up to £${taxFree.toLocaleString('en-GB')} of genuine ex-gratia compensation (including statutory redundancy pay) can be paid free of income tax and National Insurance. However, contractual notice pay (PILON), unworked notice under the Post-Employment Notice Pay (PENP s.402D) formula, and accrued holiday pay are taxed as normal earnings. Under Section 203(3) ERA 1996, your employer typically covers the legal fee for your independent solicitor review.`,
      };
    }

    if (q.includes('redundancy') || normPath.includes('redundancy')) {
      return {
        question: `How is statutory redundancy vs settlement agreement pay calculated in 2026?`,
        answer: `Under Section 162 of the Employment Rights Act 1996, statutory redundancy pay is calculated using your age, length of service (capped at 20 years), and weekly gross pay capped at £${capGB} in Great Britain (£${STATUTORY_RATES_2026_27.weeklyCapNI} in Northern Ireland). Combined statutory and ex-gratia termination payments up to £${taxFree.toLocaleString('en-GB')} are tax-free under s.403 ITEPA 2003, while notice pay (PILON) remains taxable. Your employer typically covers your independent solicitor fee.`,
      };
    }

    return {
      question: `How do you calculate a fair UK settlement agreement payout in 2026?`,
      answer: `A UK settlement agreement payout combines three parts: (1) contractual notice pay (PILON) and accrued holiday (taxable under ITEPA 2003 s.402D), (2) statutory redundancy pay based on age and up to 20 years' service (capped at £${capGB}/week under ERA 1996 s.162), and (3) a negotiated ex-gratia compensation sum. Genuine termination compensation up to £${taxFree.toLocaleString('en-GB')} is tax-free under s.403 ITEPA 2003, and your employer typically covers your independent solicitor's fee.`,
    };
  }

  /**
   * Builds an anchor-safe, brand-compliant Title (50-60 chars, ≤580px) that never strips
   * the page's primary cluster anchor or commercial hook.
   */
  public static craftAnchorSafeTitle(
    query: string,
    normPath: string,
    primaryAnchor?: string
  ): string {
    if (normPath === '/') {
      return 'Settlement Agreement Calculator UK (2026) | SettlementCheck'; // 59 chars
    }
    if (normPath === '/calculator/') {
      return 'UK Settlement Agreement Calculator (2026) | SettlementCheck'; // 59 chars
    }

    const baseAnchor = primaryAnchor || query;
    return ConversionCopywriterAgent.craftCalibratedTitle(baseAnchor);
  }

  /**
   * Executes a comprehensive Adversarial Head of SEO audit on any staged or live package.
   */
  public static async evaluatePackage(
    input: AdversarialReviewInput
  ): Promise<AdversarialSeoReviewResult> {
    const normPath = normalizeCanonicalPath(input.targetCanonicalUrl);
    const pos = input.position ? Number(input.position) : 15.0;
    const baselineH1 =
      input.targetPageExistingH1 ||
      SeoArchitectAgent.CANONICAL_ROUTE_H1_MAP[normPath] ||
      'Settlement Agreement Calculator & Free Solicitor Check UK';

    const blast = evaluateSeoBlastRadius(input);
    const critiquePoints: string[] = [];

    const isCoreRoute = normPath === '/' || normPath === '/calculator/';
    const overwritesTitle = (input.actuationScope || 'FULL_META_AND_FAQ') === 'FULL_META_AND_FAQ';

    // 1. Check Title Overwrite on Page 2 / Secondary Queries
    if (overwritesTitle && pos > 10.0) {
      critiquePoints.push(
        `Page 2 Title-Churn Trap: "${input.query}" is at Position ${pos.toFixed(1)} (Page 2). Overwriting the live <title> of ${normPath} for a Page 2 query will not lift rankings (Navboost CTR weight applies on Page 1) and destabilizes existing Page 1 rankings.`
      );
    }

    // 2. Check Core Money Page & Protected Cluster Anchor Loss
    if (blast.tradeOffSummary.droppedAnchorTokens.length > 0) {
      critiquePoints.push(
        `Anchor Cannibalization: Proposed title ("${input.calibratedTitle}") strips key token(s) [${blast.tradeOffSummary.droppedAnchorTokens.join(', ')}] from the page's primary anchor ("${input.primaryAnchorQuery || input.query}").`
      );
    }

    if (!/settlementcheck/i.test(input.calibratedTitle || '')) {
      critiquePoints.push(
        `Brand & E-E-A-T Stripping: Proposed title removes "| SettlementCheck", weakening brand recognition and commercial authority on the SERP.`
      );
    }

    if (isCoreRoute && /^how to\b/i.test((input.calibratedTitle || '').trim())) {
      critiquePoints.push(
        `Intent Downgrade (Transactional → Informational): Turning ${normPath} into a "How to..." headline conflicts with the server H1 ("${baselineH1}"), triggering Google's Title-Link Rewrite algorithm (~68% override rate) and reducing commercial calculator conversions.`
      );
    }

    // 3. Check YMYL Legal & Tax Precision in FAQ
    const combinedFaq = `${input.faqQuestion || ''} ${input.faqAnswer || ''}`;
    if (/\byou can expect\b/i.test(combinedFaq)) {
      critiquePoints.push(
        `YMYL / HMRC Tax Precision Flaw: FAQ states "You can expect up to £30,000 tax-free" without distinguishing taxable PILON / Post-Employment Notice Pay (ITEPA 2003 s.402D) from non-contractual ex-gratia compensation (s.403).`
      );
    } else if ((input.faqAnswer || '').length < 180) {
      critiquePoints.push(
        `Low Information Gain for Google AI Overviews: The 2-sentence FAQ repeats generic statutory caps without explaining the 3-part settlement structure (PILON vs Statutory Redundancy vs Ex-Gratia), reducing AEO citation probability.`
      );
    }

    // Determine Verdict & Counter-Proposal
    const needsCounterPlan = critiquePoints.length > 0;
    const isDestructiveVeto =
      blast.deploymentRisk === 'CRITICAL_RISK' && overwritesTitle;

    const recommendedScope: SeoActuationScope =
      pos > 10.0 || (isCoreRoute && (input.query || '').toLowerCase() !== (input.primaryAnchorQuery || '').toLowerCase())
        ? 'ADDITIVE_CONTENT_AND_LINKS'
        : 'FULL_META_AND_FAQ';

    const safeTitle =
      recommendedScope === 'ADDITIVE_CONTENT_AND_LINKS'
        ? `${baselineH1.replace(/\s*\|\s*SettlementCheck$/i, '').slice(0, 38).trim()} | SettlementCheck`
        : this.craftAnchorSafeTitle(input.query, normPath, input.primaryAnchorQuery);

    const safeMeta = ConversionCopywriterAgent.craftCalibratedMetaDescription(
      input.primaryAnchorQuery || input.query,
      STATUTORY_RATES_2026_27.weeklyCapGB,
      STATUTORY_RATES_2026_27.taxFreeLimit
    );

    const highAuthFaq = this.craftHighAuthorityAeoFaq(input.query, normPath);
    const sourceGuide =
      normPath === '/guides/how-to-negotiate-a-settlement-agreement/'
        ? '/guides/settlement-agreement-how-much/'
        : '/guides/how-to-negotiate-a-settlement-agreement/';

    const counterLinkTarget = normPath === '/' ? '/calculator/' : normPath;
    const counterContextualLink = `Before signing, use our [${input.primaryAnchorQuery || input.query}](${counterLinkTarget}) to check your statutory redundancy floor (£${STATUTORY_RATES_2026_27.weeklyCapGB}/week cap) and £30,000 tax-free threshold under Section 403 ITEPA 2003. Under Section 203 ERA 1996, your employer typically covers your independent solicitor fee.`;

    let executiveSummary = needsCounterPlan
      ? `Hold on deploying this as-is. The original agent proposal ${
          isDestructiveVeto
            ? `overwrites the headline of ${normPath} for a Page 2 query (Pos ${pos.toFixed(1)}) and weakens your primary keyword anchor.`
            : `has ${critiquePoints.length} strategic SEO/YMYL weakness(es) that reduce ranking impact.`
        } I have prepared a safer Counter-Plan below that locks your live headline, upgrades the AI Overview answer with full ITEPA 2003 s.403 / PILON precision, and builds internal link equity instead.`
      : `Approved. This package preserves your route architecture, keeps your primary keyword anchor intact, and complies with April 2026 statutory rates (£751/wk cap) and SERP pixel bounds.`;

    // Optionally enrich executive summary via fast LLM with active policy constraints
    try {
      const policyContext = SeoPolicyRegistry.formatPromptConstraints(normPath);
      const prompt = `
You are the Adversarial Head of Legal SEO for SettlementCheck (settlementcheck.co.uk).
Explain in 2 crisp, plain-English sentences to the site owner why this autonomous SEO proposal for query "${input.query}" (Rank: Pos ${pos.toFixed(1)}, Target: ${normPath}) was flagged:
Critique points:
${critiquePoints.map((c, i) => `${i + 1}. ${c}`).join('\n')}
Active Guardrail Policies:
${policyContext}

Keep it direct, jargon-free, and focused on protecting rankings and legal accuracy. Zero em dashes.
Return JSON: { "plainEnglishVerdict": string }
`;
      if (needsCounterPlan) {
        const aiRes = await callAI({
          tier: 'fast',
          messages: [{ role: 'user', content: prompt }],
          jsonMode: true,
        });
        if (
          aiRes.structuredData &&
          typeof aiRes.structuredData === 'object' &&
          (aiRes.structuredData as any).plainEnglishVerdict
        ) {
          executiveSummary = ConversionCopywriterAgent.sanitizeCopy(
            String((aiRes.structuredData as any).plainEnglishVerdict)
          );
        }
      }
    } catch {
      // Deterministic executiveSummary already populated
    }

    const candidatePolicyRule: SeoGuardrailPolicyRule | undefined = needsCounterPlan
      ? {
          id: `policy_${normPath.replace(/\//g, '_') || 'home'}_${Date.now()}`,
          scopeType: isCoreRoute ? 'ROUTE' : 'GLOBAL',
          scopeValue: isCoreRoute ? normPath : '*',
          ruleTitle: isCoreRoute
            ? `Lock ${normPath} Headline Against Page 2 Query Overwrites`
            : `Enforce Additive Scope & ITEPA s.403 Precision on Pos > 10 Queries`,
          constraintDescription: isCoreRoute
            ? `On ${normPath}, never overwrite <title> or <h1> for secondary queries (like "${input.query}"). Enforce ADDITIVE_CONTENT_AND_LINKS scope and keep primary anchor "${input.primaryAnchorQuery || 'settlement agreement calculator'}" intact.`
            : `For striking-distance queries (Pos > 10), use ADDITIVE_CONTENT_AND_LINKS scope and qualify £30,000 tax-free compensation (ITEPA 2003 s.403) vs taxable PILON (s.402D) from ${sourceGuide}.`,
          lockTitleOverwrite: isCoreRoute,
          requiredTokens: isCoreRoute ? ['settlement', 'calculator'] : [],
          prohibitedPhrases: ['you can expect up to', 'how to calculate your settlement'],
          source: 'ADVERSARIAL_HEAD_PROMOTED',
          createdAt: new Date().toISOString(),
        }
      : undefined;

    return {
      verdict: isDestructiveVeto
        ? 'VETO_DESTRUCTIVE'
        : needsCounterPlan
        ? 'COUNTER_PLAN_RECOMMENDED'
        : 'APPROVED_AS_IS',
      deploymentRisk: blast.deploymentRisk,
      executiveSummary,
      critiquePoints,
      counterProposal: needsCounterPlan
        ? {
            calibratedTitle: safeTitle,
            calibratedMetaDescription: safeMeta,
            faqQuestion: highAuthFaq.question,
            faqAnswer: highAuthFaq.answer,
            contextualLinkSnippet: counterContextualLink,
            actuationScope: recommendedScope,
            targetCanonicalUrl: input.targetCanonicalUrl,
          }
        : undefined,
      candidatePolicyRule,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
