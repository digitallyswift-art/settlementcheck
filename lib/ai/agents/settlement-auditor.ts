import { callAI } from '../gateway';
import { evaluateSettlementOfferTool, getStatutoryRatesTool } from '../tools/statutory-tools';
import { getOfficialBenchmark, OfficialBenchmarkData } from '@/lib/statutory-rates';

export interface ExtractedAgreementTerms {
  exGratiaAmount?: number;
  noticePayPilon?: number;
  legalFeeContribution?: number;
  accruedHolidayPay?: number;
  salary?: number;
  yearsOfService?: number;
  age?: number;
  jurisdiction?: 'GB' | 'NI';
  hasWaiverOfAccruedPensions?: boolean;
  hasPersonalInjuryWaiver?: boolean;
  hasMutualConfidentiality?: boolean;
  agreedReferenceClause?: boolean;
  disputeReason?: string;
  isDiscrimination?: boolean;
}

export interface StatutoryAuditCheck {
  item: string;
  status: 'passed' | 'warning' | 'critical';
  detail: string;
  governingLegislation: string;
}

export interface AuditReport {
  extractedTerms: ExtractedAgreementTerms;
  statutoryChecks: StatutoryAuditCheck[];
  tacticalNegotiationPoints: string[];
  recommendedCounterOffer?: {
    suggestedExGratiaLow: number;
    suggestedExGratiaHigh: number;
    recommendedLegalFeeContribution: number;
    keyClauseAmendments: string[];
  };
  officialBenchmark?: OfficialBenchmarkData;
  disclaimer: string;
}

/**
 * Agent 1: Extraction & Clause Parser
 */
async function runParserAgent(rawAgreementText: string, userContext?: Partial<ExtractedAgreementTerms>): Promise<ExtractedAgreementTerms> {
  const prompt = `
You are a senior UK employment law legal document parser for SettlementCheck.
Extract the key financial, structural, and contractual terms from the provided settlement agreement text.
Be conservative and return exact numerical figures where possible.

User Context (if already provided):
${JSON.stringify(userContext || {}, null, 2)}

Agreement Text:
"""
${rawAgreementText}
"""

Return a valid JSON object matching:
{
  "exGratiaAmount": number or null,
  "noticePayPilon": number or null,
  "legalFeeContribution": number or null,
  "accruedHolidayPay": number or null,
  "salary": number or null,
  "yearsOfService": number or null,
  "age": number or null,
  "jurisdiction": "GB" or "NI",
  "hasWaiverOfAccruedPensions": boolean,
  "hasPersonalInjuryWaiver": boolean,
  "hasMutualConfidentiality": boolean,
  "agreedReferenceClause": boolean,
  "disputeReason": "redundancy" | "redundancy_collective" | "pip" | "constructive_dismissal" | "discrimination" | "unfair_dismissal",
  "isDiscrimination": boolean
}
`;

  const response = await callAI({
    tier: 'fast',
    systemPrompt: 'You extract structured settlement agreement clauses into JSON. You only output valid JSON.',
    messages: [{ role: 'user', content: prompt }],
    jsonMode: true,
  });

  const parsed = (response.structuredData as ExtractedAgreementTerms) || {};

  // Merge with user context fallback
  return {
    ...userContext,
    ...parsed,
    exGratiaAmount: parsed.exGratiaAmount ?? userContext?.exGratiaAmount,
    salary: parsed.salary ?? userContext?.salary,
    yearsOfService: parsed.yearsOfService ?? userContext?.yearsOfService,
    age: parsed.age ?? userContext?.age,
    jurisdiction: parsed.jurisdiction || userContext?.jurisdiction || 'GB',
    disputeReason: parsed.disputeReason || userContext?.disputeReason || 'unfair_dismissal',
    isDiscrimination: parsed.isDiscrimination ?? userContext?.isDiscrimination ?? false,
  };
}

/**
 * Agent 2: Statutory Rule & Legal Verifier (Deterministic Guardrail)
 */
function runVerifierAgent(terms: ExtractedAgreementTerms): { checks: StatutoryAuditCheck[]; calculationSummary?: any } {
  const checks: StatutoryAuditCheck[] = [];
  const rates = getStatutoryRatesTool.execute({ terminationDate: new Date().toISOString() });

  // 1. Tax check: ITEPA 2003 s.403 (£30,000 threshold)
  const exGratia = terms.exGratiaAmount || 0;
  if (exGratia > 30000) {
    const taxableOver = exGratia - 30000;
    checks.push({
      item: 'Ex-Gratia Tax Treatment',
      status: 'warning',
      detail: `Your ex-gratia compensation is £${exGratia.toLocaleString('en-GB')}. The first £30,000 is tax-free under section 403 ITEPA 2003, but the remaining £${taxableOver.toLocaleString('en-GB')} is subject to income tax and employer National Insurance.`,
      governingLegislation: 'Income Tax (Earnings and Pensions) Act 2003 s.403',
    });
  } else if (exGratia > 0) {
    checks.push({
      item: 'Ex-Gratia Tax Exemption',
      status: 'passed',
      detail: `Your ex-gratia payment of £${exGratia.toLocaleString('en-GB')} is within the £30,000 statutory tax-free exemption limit.`,
      governingLegislation: 'Income Tax (Earnings and Pensions) Act 2003 s.403',
    });
  }

  // 2. Legal fee contribution check
  const legalFee = terms.legalFeeContribution ?? 0;
  if (legalFee === 0) {
    checks.push({
      item: 'Employer Legal Fee Contribution',
      status: 'critical',
      detail: 'No employer legal fee contribution is specified. For a settlement agreement to be legally binding, you MUST receive advice from an independent qualified solicitor (ERA 1996 s.203). Employers standardly contribute £500 to £1,500 + VAT.',
      governingLegislation: 'Employment Rights Act 1996 s.203(3)',
    });
  } else if (legalFee < 500) {
    checks.push({
      item: 'Employer Legal Fee Contribution Below Standard',
      status: 'warning',
      detail: `The employer offer of £${legalFee} towards legal fees is below the standard market contribution of £500 + VAT. You should negotiate this up to avoid out-of-pocket costs.`,
      governingLegislation: 'SRA Standard Settlement Practice',
    });
  } else {
    checks.push({
      item: 'Employer Legal Fee Contribution',
      status: 'passed',
      detail: `The employer contribution of £${legalFee} + VAT meets standard UK benchmark levels for independent solicitor review.`,
      governingLegislation: 'Employment Rights Act 1996 s.203(3)',
    });
  }

  // 3. Unlawful or Overreaching Waivers
  if (terms.hasWaiverOfAccruedPensions) {
    checks.push({
      item: 'Accrued Pension Rights Waiver',
      status: 'critical',
      detail: 'The agreement appears to include a waiver of accrued pension rights. Accrued statutory and contractual pension entitlements should never be signed away in standard settlement compromises.',
      governingLegislation: 'Pensions Act 1995 / ERA 1996',
    });
  }

  if (terms.hasPersonalInjuryWaiver) {
    checks.push({
      item: 'Future Personal Injury Waiver',
      status: 'warning',
      detail: 'Waivers of unknown future personal injury claims (or latent occupational diseases) should be expressly excluded from the settlement scope.',
      governingLegislation: 'BCCI v Ali [2001] UKHL 8',
    });
  }

  // 4. Statutory Floor Comparison (if salary & service known)
  let calculationSummary: any = undefined;
  if (terms.salary && terms.yearsOfService && terms.age) {
    calculationSummary = evaluateSettlementOfferTool.execute({
      salary: terms.salary,
      yearsOfService: terms.yearsOfService,
      age: terms.age,
      offer: (terms.exGratiaAmount || 0) + (terms.noticePayPilon || 0),
      jurisdiction: terms.jurisdiction || 'GB',
    }) as any;

    if (calculationSummary.statutoryMinimum > (terms.exGratiaAmount || 0)) {
      checks.push({
        item: 'Statutory Minimum Floor',
        status: 'critical',
        detail: `The offer appears below your statutory redundancy / basic award minimum floor of £${calculationSummary.statutoryMinimum.toLocaleString('en-GB')}.`,
        governingLegislation: 'Employment Rights Act 1996 s.162',
      });
    }
  }

  return { checks, calculationSummary };
}

/**
 * Agent 3: Tactical Strategy & Negotiation Coach
 */
async function runStrategyAgent(
  terms: ExtractedAgreementTerms,
  checks: StatutoryAuditCheck[],
  calculationSummary?: any,
): Promise<{ tacticalNegotiationPoints: string[]; recommendedCounterOffer: AuditReport['recommendedCounterOffer'] }> {
  const prompt = `
You are the lead UK Employment Negotiation Strategist for SettlementCheck.
Review the extracted terms and statutory verification checks for an employee's settlement agreement.

Extracted Terms:
${JSON.stringify(terms, null, 2)}

Statutory Verification Checks:
${JSON.stringify(checks, null, 2)}

Calculation Floor / Range:
${JSON.stringify(calculationSummary || {}, null, 2)}

Provide actionable, assertive, yet professional negotiation tactics in plain UK English.
NEVER use US legal terminology like "severance", "at-will", "lawyer", or "attorney". Always reference an SRA-regulated solicitor.
Emphasize that the employer pays the legal fees.

Return a valid JSON object matching:
{
  "tacticalNegotiationPoints": [
    "point 1",
    "point 2",
    "point 3"
  ],
  "recommendedCounterOffer": {
    "suggestedExGratiaLow": number,
    "suggestedExGratiaHigh": number,
    "recommendedLegalFeeContribution": number,
    "keyClauseAmendments": ["amendment 1", "amendment 2"]
  }
}
`;

  const response = await callAI({
    tier: 'reasoning',
    systemPrompt: 'You are an elite UK employment law negotiation coach. You strictly follow UK legal terminology and output valid JSON.',
    messages: [{ role: 'user', content: prompt }],
    jsonMode: true,
  });

  const data = (response.structuredData as any) || {};

  return {
    tacticalNegotiationPoints: data.tacticalNegotiationPoints || [
      'Request that the employer raise the legal fee contribution to at least £750 + VAT to ensure complete coverage by an independent SRA-regulated solicitor.',
      'Ensure the reference clause provides an agreed standard reference with explicit non-derogatory confidentiality obligations on both parties.',
      'Separate Notice Pay (PILON) from the tax-free ex-gratia compensation to protect the £30,000 exemption under ITEPA 2003 s.403.',
    ],
    recommendedCounterOffer: data.recommendedCounterOffer || {
      suggestedExGratiaLow: calculationSummary?.typicalRange?.low || (terms.exGratiaAmount ? Math.round(terms.exGratiaAmount * 1.25) : 5000),
      suggestedExGratiaHigh: calculationSummary?.typicalRange?.high || (terms.exGratiaAmount ? Math.round(terms.exGratiaAmount * 1.6) : 12000),
      recommendedLegalFeeContribution: Math.max(750, (terms.legalFeeContribution || 0) + 250),
      keyClauseAmendments: [
        'Add mutual non-derogatory undertaking preventing senior management from disparaging the employee.',
        'Exclude unknown personal injury and accrued statutory pension claims from general waiver.',
      ],
    },
  };
}

/**
 * Main Compound Multi-Agent Auditor Function
 */
export async function auditSettlementAgreement(
  rawAgreementText: string,
  userContext?: Partial<ExtractedAgreementTerms>,
): Promise<AuditReport> {
  // Step 1: Ingest & Parse clauses
  const extractedTerms = await runParserAgent(rawAgreementText, userContext);

  // Step 2: Deterministic Statutory Verification (Guardrail)
  const { checks: statutoryChecks, calculationSummary } = runVerifierAgent(extractedTerms);

  // Step 3: Tactical Strategy & Negotiation Formulation
  const { tacticalNegotiationPoints, recommendedCounterOffer } = await runStrategyAgent(
    extractedTerms,
    statutoryChecks,
    calculationSummary,
  );

  // Step 4: Official Statutory & Ministry of Justice Benchmark Precedents
  const officialBenchmark = getOfficialBenchmark(
    extractedTerms.disputeReason || 'unfair_dismissal',
    Boolean(extractedTerms.isDiscrimination),
  );

  return {
    extractedTerms,
    statutoryChecks,
    tacticalNegotiationPoints,
    recommendedCounterOffer,
    officialBenchmark,
    disclaimer: 'This audit provides guidance and statutory calculation checks for negotiation preparation. By law (ERA 1996 s.203), you must have your final settlement agreement reviewed and signed off by an independent qualified solicitor or legal adviser before it becomes binding.',
  };
}
