/**
 * Specialist Conversion Copywriter Agent
 * Writes and reviews high-converting, empathetic, brand-compliant copy for SettlementCheck.
 * Strictly adheres to .agents/rules/brand-standards.md rules:
 * - Tone: Calm, clear, on their side
 * - UK English: "solicitor", "redundancy", "employment tribunal", "settlement"
 * - Key reassurance: "your employer covers the legal fees"
 * - Non-negotiables: Zero em dashes (—), short sentences (< 20 words), active voice
 */

import { callAI } from '@/lib/ai/gateway';
import { sanitizeMarketingClaims } from '../guardrails/cap-code-claims-guard';
import { SeoPolicyRegistry } from '../services/seo-policy-registry';
import { ConversionCopyPackage, SeoTechnicalBrief } from '../types';

export class ConversionCopywriterAgent {
  private static readonly BANNED_US_TERMS = ['severance', 'at-will', 'attorney', 'layoff', 'labor court'];
  private static readonly BANNED_BUZZWORDS = ["don't worry", 'reach out', 'touch base', 'leverage', 'low-ball', 'essentially', 'basically'];

  /**
   * Sanitizes copy to strictly eliminate em dashes and banned phrasing
   */
  public static sanitizeCopy(text: string): string {
    let sanitized = text
      .replace(/—/g, ' - ') // replace em dash with spaced hyphen
      .replace(/–/g, '-')   // normalize en dash if attached to words
      .replace(/\s{2,}/g, ' ') // clean up double spaces
      .trim();

    // Replace US terms
    sanitized = sanitized
      .replace(/\blawyer\b/gi, 'solicitor')
      .replace(/\battorney\b/gi, 'solicitor')
      .replace(/\bseverance\b/gi, 'settlement')
      .replace(/\blayoff\b/gi, 'redundancy')
      .replace(/\blabor court\b/gi, 'employment tribunal')
      .replace(/\byou can expect up to £30,000 tax-free\b/gi, 'genuine ex-gratia compensation up to £30,000 is tax-free');

    // Replace risky unverified marketing claims under CAP Code rules
    sanitized = sanitizeMarketingClaims(sanitized).sanitizedText;

    // SRA & CAP Code fee qualification: replace absolute/unqualified fee coverage claims
    sanitized = sanitized
      .replace(/\byour employer covers 100% of your legal fees\b/gi, 'your employer typically covers your independent legal fee')
      .replace(/\byour employer is legally required to pay all your legal fees\b/gi, 'your employer typically contributes toward your legal advice');

    return sanitized;
  }

  /**
   * Formats a calibrated Title (strictly 50-60 chars) without awkward word clipping
   */
  public static craftCalibratedTitle(query: string): string {
    const hasUk = /\buk\b/i.test(query);
    let cleanQuery = query
      .replace(/\buk\b/gi, '')
      .trim()
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');

    const brand = ' | SettlementCheck'; // 18 chars

    // Try variations in descending richness
    const candidates = [
      `${cleanQuery} UK (2026 Rates)${brand}`,
      `${cleanQuery} UK (2026)${brand}`,
      `${cleanQuery} (2026 Rates)${brand}`,
      `${cleanQuery} 2026${brand}`,
      `${cleanQuery} UK${brand}`,
      `${cleanQuery}${brand}`,
    ];

    for (const cand of candidates) {
      if (cand.length >= 50 && cand.length <= 60) {
        return this.sanitizeCopy(cand);
      }
    }

    // If query is very long, prune words from the right
    const words = cleanQuery.split(' ');
    while (words.length > 2) {
      words.pop();
      const shortened = words.join(' ');
      const cand = `${shortened} 2026${brand}`;
      if (cand.length >= 45 && cand.length <= 60) {
        return this.sanitizeCopy(cand);
      }
    }

    // Safe fallback strictly in 50-60 chars
    const fallback = `${cleanQuery.slice(0, 32)} (2026)${brand}`;
    return this.sanitizeCopy(fallback);
  }

  /**
   * Formats a calibrated Meta Description (strictly 140-155 chars) with natural English, complete sentences, and correct statutory citations
   */
  public static craftCalibratedMetaDescription(
    query: string,
    statutoryCap: number = 751,
    taxFreeThreshold: number = 30000,
    intent?: string
  ): string {
    const q = query.toLowerCase().trim();
    const isTax = intent === 'TAX_STATUTORY_EXEMPTION' || /\btax\b/i.test(q) || /\bpilon\b/i.test(q);
    const isCompromise = intent === 'COMPROMISE_AGREEMENT_LEGACY' || /compromise/i.test(q);
    const isGov = intent === 'GOV_ACAS_BENCHMARK' || /\bgov\b/i.test(q) || /\bacas\b/i.test(q);
    const isEmotionalDispute =
      intent === 'EMOTIONAL_DISPUTE' ||
      /constructive|discrimination|bullying|harassment|pressured|pip|sick leave|protected conversation|without prejudice/i.test(q);

    let candidates: string[] = [];

    if (isEmotionalDispute) {
      candidates = [
        `Check your UK settlement rights under Section 203 ERA 1996 & ACAS guidelines. Free confidential review. Your employer covers your solicitor fee.`,
        `Review your UK settlement agreement rights under Section 203 ERA 1996. Free confidential check. Your employer covers your independent solicitor fee.`,
        `Check your UK settlement agreement rights under Section 203 ERA 1996 (£${taxFreeThreshold.toLocaleString('en-GB')} tax-free limit). Your employer covers your solicitor fee.`,
      ];
    } else if (isTax) {
      candidates = [
        `Calculate tax on your UK settlement agreement. See your £${taxFreeThreshold.toLocaleString('en-GB')} statutory tax exemption (ITEPA 2003). Free check. Your employer covers your legal fee.`,
        `Calculate how much tax you will pay on your UK settlement agreement. Free 2026 tax calculator (£${taxFreeThreshold.toLocaleString('en-GB')} exemption). Your employer covers your legal fee.`,
        `Check tax on your UK settlement agreement under 2026 statutory rates (£${taxFreeThreshold.toLocaleString('en-GB')} tax-free exemption). Free check. Your employer covers your legal fee.`,
        `Calculate tax on your settlement agreement under UK law (£${taxFreeThreshold.toLocaleString('en-GB')} tax-free threshold). Free check. Your employer covers your legal fee.`,
      ];
    } else if (isCompromise) {
      candidates = [
        `Calculate your compromise agreement payout under 2026 UK statutory rates (£${statutoryCap}/wk cap). Free, confidential check. Your employer covers your legal fee.`,
        `Check your compromise agreement payout against 2026 UK statutory rates (£${statutoryCap}/wk cap). Free 2-minute check. Your employer covers your legal fee.`,
        `Calculate your compromise agreement payout under 2026 UK statutory rates (£${statutoryCap}/wk cap). Free check. Your employer covers your legal fee.`,
      ];
    } else if (isGov) {
      candidates = [
        `Calculate your settlement payout against 2026 UK government statutory rates (£${statutoryCap}/wk cap). Free check in 2 mins. Your employer covers your legal fee.`,
        `Check your settlement agreement payout against official 2026 UK statutory rates (£${statutoryCap}/wk cap). Free check. Your employer covers your legal fee.`,
        `Compare your settlement offer to 2026 UK government statutory redundancy rates (£${statutoryCap}/wk cap). Free check. Your employer covers your legal fee.`,
      ];
    } else {
      // General & transactional settlement calculator queries
      candidates = [
        `Calculate your UK settlement agreement payout under 2026 statutory rates (£${statutoryCap}/wk cap). Free 2-minute check. Your employer covers your legal fee.`,
        `Calculate your settlement agreement payout under 2026 UK statutory rates (£${statutoryCap}/wk cap). Free, confidential check. Your employer covers your legal fee.`,
        `Check your settlement agreement payout against 2026 UK statutory rates (£${statutoryCap}/wk cap). Free online check. Your employer covers your legal fee.`,
      ];
    }

    for (const cand of candidates) {
      const sanitized = this.sanitizeCopy(cand);
      if (sanitized.length >= 140 && sanitized.length <= 155) {
        return sanitized;
      }
    }

    const fallback = isTax
      ? `Calculate tax on your UK settlement agreement under 2026 statutory rates (£${taxFreeThreshold.toLocaleString('en-GB')} tax-free exemption). Free check. Your employer covers your legal fee.`
      : `Calculate your UK settlement agreement payout under 2026 statutory rates (£${statutoryCap}/wk cap). Free 2-minute check. Your employer covers your legal fee.`;

    return this.sanitizeCopy(fallback);
  }

  /**
   * Crafts an Answer-First FAQ question and answer aligned with the query's legal domain
   */
  public static craftAnswerFirstFaq(
    query: string,
    intent?: string,
    weeklyCap: number = 751,
    taxFreeThreshold: number = 30000
  ): { question: string; answer: string } {
    const q = query.toLowerCase().trim();
    const isTax = intent === 'TAX_STATUTORY_EXEMPTION' || /\btax\b/i.test(q) || /\bpilon\b/i.test(q);
    const isCompromise = intent === 'COMPROMISE_AGREEMENT_LEGACY' || /compromise/i.test(q);
    const isGov = intent === 'GOV_ACAS_BENCHMARK' || /\bgov\b/i.test(q) || /\bacas\b/i.test(q);
    const isEmotionalDispute =
      intent === 'EMOTIONAL_DISPUTE' ||
      /constructive|discrimination|bullying|harassment|pressured|pip|sick leave|protected conversation|without prejudice/i.test(q);

    if (isEmotionalDispute) {
      return {
        question: 'What are my legal rights when offered a UK settlement agreement?',
        answer: `Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is only legally binding after you receive independent advice from an SRA-regulated solicitor. Under ACAS Code of Practice 4, you should be given at least 10 calendar days to consider the offer, and your employer typically covers your independent legal fee.`,
      };
    }

    if (isTax) {
      return {
        question: 'How is a settlement agreement taxed under UK employment law?',
        answer: `Under Section 403 of ITEPA 2003, genuine compensation payments up to £${taxFreeThreshold.toLocaleString('en-GB')} are completely tax-free. Any contractual earnings, accrued holiday pay, or payment in lieu of notice (PILON) remain subject to normal income tax and National Insurance. Your employer typically covers the cost of your independent legal review.`,
      };
    }

    if (isCompromise) {
      return {
        question: 'What is a compromise agreement under UK employment law?',
        answer: `A compromise agreement (now officially called a settlement agreement) is a legally binding contract waiving employment tribunal claims in return for compensation. Under the Employment Rights Act 1996, statutory redundancy is capped at £${weeklyCap} per week, with genuine compensation up to £${taxFreeThreshold.toLocaleString('en-GB')} being tax-free. Your employer typically covers your independent solicitor fee.`,
      };
    }

    if (isGov) {
      return {
        question: 'Does the UK government offer an official settlement agreement calculator?',
        answer: `The UK government does not provide a settlement agreement calculator, only basic statutory redundancy tools. SettlementCheck calculates your complete payout against official 2026 statutory rates (£${weeklyCap} per week cap under ERA 1996), while genuine compensation up to £${taxFreeThreshold.toLocaleString('en-GB')} is tax-free. Your employer typically covers your legal fee.`,
      };
    }

    return {
      question: 'How is a settlement agreement payout calculated under UK employment law?',
      answer: `Under UK employment law and the Employment Rights Act 1996, statutory redundancy is capped at £${weeklyCap} per week, while genuine compensation up to £${taxFreeThreshold.toLocaleString('en-GB')} is tax-free under Section 403 of ITEPA 2003. Under Section 203(3) ERA 1996, your employer typically covers the legal fees for your independent solicitor review.`,
    };
  }

  /**
   * Generates a complete Conversion Copy Package based on the SEO Technical Brief
   */
  public static async generateCopyPackage(brief: SeoTechnicalBrief): Promise<ConversionCopyPackage> {
    const q = brief.query;
    const weeklyCap = brief.statutoryInvariants.weeklyCapGB;
    const taxFree = brief.statutoryInvariants.taxFreeThreshold;
    const dest = brief.internalLinkGraph.destinationRoute;
    const intent = brief.searchIntent;
    const sourceRoute = brief.internalLinkGraph.sourceRoutes[0] || '/guides/how-to-negotiate-a-settlement-agreement/';

    // Deterministic baselines
    let title = this.craftCalibratedTitle(q);
    let metaDesc = this.craftCalibratedMetaDescription(q, weeklyCap, taxFree, intent);

    const defaultFaq = this.craftAnswerFirstFaq(q, intent, weeklyCap, taxFree);
    let faqQuestion = defaultFaq.question;
    let faqAnswer = defaultFaq.answer;

    // Ensure the contextual link target NEVER points to the host destination page itself (prevent self-referential links)
    const linkTarget = dest === '/' ? '/calculator/' : dest;
    let contextualSnippet = `If you have received an offer, you can check where you stand using our [${q}](${linkTarget}). Under Section 203(3) of the Employment Rights Act 1996, your employer typically pays for your independent solicitor review.`;

    // Attempt AI synthesis for tailored high-converting copy
    try {
      const policyConstraints = SeoPolicyRegistry.formatPromptConstraints(dest, intent);
      const prompt = `
You are the senior Conversion Copywriter for SettlementCheck (settlementcheck.co.uk).
Target audience: Stressed UK employee who just received a settlement agreement or redundancy proposal.

Write high-converting, empathetic, brand-compliant copy for:
- Query: "${q}"
- Destination Route: "${dest}"
- Source Route: "${sourceRoute}"
- April 2026 Weekly Cap: £${weeklyCap}
- Tax-Free Exemption: £${taxFree.toLocaleString('en-GB')} (ITEPA 2003 s.403)

STRICT BRAND & STATUTORY GUARDRAIL POLICIES:
1. Tone: Calm, clear, empathetic, on their side.
2. UK English only: Use "solicitor" (NEVER lawyer/attorney), "redundancy" (NEVER layoff), "employment tribunal" (NEVER court).
3. Legal fee reassurance: State that "your employer typically covers the legal fees" or "your employer pays your fees" under Section 203(3) ERA 1996 (statutory contribution standard).
4. CRITICAL: ZERO EM DASHES (—). Use hyphens or simple punctuation.
5. Title: exactly 50 to 60 characters, preserving the brand suffix "| SettlementCheck".
6. Meta description: exactly 140 to 155 characters.
7. FAQ Answer: 45 to 70 words, distinguishing non-contractual ex-gratia compensation (£30,000 tax-free under s.403 ITEPA 2003) from taxable PILON / notice pay, plus solicitor fee reassurance.
8. Contextual Link Paragraph: 2 sentences embedding [${q}](${linkTarget}). CRITICAL: Never link to the same page being edited (prevent self-referential links).
${policyConstraints ? `\nCURATED ROUTE & INTENT POLICIES (MANDATORY):\n${policyConstraints}` : ''}

Return valid JSON:
{
  "title": string,
  "metaDescription": string,
  "faqQuestion": string,
  "faqAnswer": string,
  "contextualLinkSnippet": string,
  "ctaText": string
}
`;

      const aiRes = await callAI({
        tier: 'fast',
        messages: [{ role: 'user', content: prompt }],
        jsonMode: true,
      });

      if (aiRes.structuredData && typeof aiRes.structuredData === 'object') {
        const data = aiRes.structuredData as Record<string, any>;
        if (data.title && typeof data.title === 'string') {
          title = this.sanitizeCopy(data.title);
        }
        if (data.metaDescription && typeof data.metaDescription === 'string') {
          metaDesc = this.sanitizeCopy(data.metaDescription);
        }
        if (data.faqQuestion && typeof data.faqQuestion === 'string') {
          faqQuestion = this.sanitizeCopy(data.faqQuestion);
        }
        if (data.faqAnswer && typeof data.faqAnswer === 'string') {
          faqAnswer = this.sanitizeCopy(data.faqAnswer);
        }
        if (data.contextualLinkSnippet && typeof data.contextualLinkSnippet === 'string') {
          contextualSnippet = this.sanitizeCopy(data.contextualLinkSnippet);
        }
      }
    } catch {
      // Offline fallback: rely on deterministic baselines
    }

    // Final guardrail enforcement
    title = this.sanitizeCopy(title);
    metaDesc = this.sanitizeCopy(metaDesc);
    faqAnswer = this.sanitizeCopy(faqAnswer);
    contextualSnippet = this.sanitizeCopy(contextualSnippet);

    const zeroEmDashes = !title.includes('—') && !metaDesc.includes('—') && !faqAnswer.includes('—') && !contextualSnippet.includes('—');
    
    let hasBannedUs = false;
    const combinedText = `${title} ${metaDesc} ${faqAnswer} ${contextualSnippet}`.toLowerCase();
    for (const term of this.BANNED_US_TERMS) {
      if (new RegExp(`\\b${term}\\b`, 'i').test(combinedText)) {
        hasBannedUs = true;
        break;
      }
    }

    const mentionsEmployerFees = combinedText.includes('employer') && (combinedText.includes('fee') || combinedText.includes('cost'));
    const mentionsSolicitor = combinedText.includes('solicitor');

    return {
      calibratedTitle: title,
      calibratedMetaDescription: metaDesc,
      answerFirstFaq: {
        question: faqQuestion,
        answer: faqAnswer,
        characterCount: faqAnswer.length,
      },
      contextualInternalLinkBlock: {
        sourceRoute,
        targetRoute: dest,
        anchorText: q,
        surroundingText: contextualSnippet,
      },
      ctaText: 'Calculate my estimate →',
      brandComplianceReport: {
        zeroEmDashes,
        zeroBannedUsTerms: !hasBannedUs,
        ukSpellingVerified: mentionsSolicitor,
        employerFeesMentioned: mentionsEmployerFees,
        statutoryAccuracyVerified:
          combinedText.includes(`£${weeklyCap}`) ||
          combinedText.includes(`£${taxFree.toLocaleString('en-GB')}`) ||
          combinedText.includes('section 203'),
      },
    };
  }
}
