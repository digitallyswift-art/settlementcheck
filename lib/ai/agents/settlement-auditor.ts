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
      detail: 'No employer legal fee contribution is specified. For a settlement agreement to be legally binding, you must receive advice from an independent qualified solicitor (ERA 1996 s.203). Employers customarily contribute £350 to £750 + VAT as a commercial term of the agreement.',
      governingLegislation: 'Employment Rights Act 1996 s.203(3)',
    });
  } else if (legalFee < 350) {
    checks.push({
      item: 'Employer Legal Fee Contribution Below Customary Range',
      status: 'warning',
      detail: `The recorded employer contribution of £${legalFee} towards legal fees is below the customary UK commercial contribution range of £350 to £750 + VAT. This can be discussed with your instructed solicitor.`,
      governingLegislation: 'Employment Rights Act 1996 s.203(3)',
    });
  } else {
    checks.push({
      item: 'Employer Legal Fee Contribution',
      status: 'passed',
      detail: `The employer contribution of £${legalFee} + VAT aligns with customary UK commercial practice for independent solicitor review.`,
      governingLegislation: 'Employment Rights Act 1996 s.203(3)',
    });
  }

  // 3. Unlawful or Overreaching Waivers
  if (terms.hasWaiverOfAccruedPensions) {
    checks.push({
      item: 'Accrued Pension Rights Waiver',
      status: 'critical',
      detail: 'The agreement appears to reference a waiver of accrued pension rights. Independent solicitors customarily review pension clauses carefully to ensure accrued statutory and contractual pension entitlements are preserved.',
      governingLegislation: 'Pensions Act 1995 / ERA 1996',
    });
  }

  if (terms.hasPersonalInjuryWaiver) {
    checks.push({
      item: 'Future Personal Injury Waiver',
      status: 'warning',
      detail: 'Waivers of unknown future personal injury claims (or latent occupational diseases) are commonly flagged for review with an independent solicitor so appropriate carve-outs can be considered.',
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
        item: 'Calculated Statutory Baseline (Subject to Eligibility)',
        status: 'critical',
        detail: `The recorded offer is below the calculated statutory baseline of £${calculationSummary.statutoryMinimum.toLocaleString('en-GB')} (subject to eligibility under ERA 1996 s.141 and absence of gross misconduct).`,
        governingLegislation: 'Employment Rights Act 1996 s.141 & s.162',
      });
    }
  }

  return { checks, calculationSummary };
}

/**
 * Agent 3: Solicitor Discussion Agenda & Clause Briefing Analyst
 */
async function runStrategyAgent(
  terms: ExtractedAgreementTerms,
  checks: StatutoryAuditCheck[],
  calculationSummary?: any,
): Promise<{ tacticalNegotiationPoints: string[]; recommendedCounterOffer: AuditReport['recommendedCounterOffer'] }> {
  const prompt = `
You are a UK Employment Statutory & Clause Information Analyst for SettlementCheck.
Review the extracted terms and statutory verification checks for an employee's draft settlement agreement.

Extracted Terms:
${JSON.stringify(terms, null, 2)}

Statutory Verification Checks:
${JSON.stringify(checks, null, 2)}

Calculation Floor / Range:
${JSON.stringify(calculationSummary || {}, null, 2)}

Provide objective, strictly descriptive points for the employee to discuss with their independent SRA-regulated solicitor in plain UK English.
NEVER give prescriptive legal advice or use phrases like "You should ask for", "Do not sign", or "Demand".
NEVER use US legal terminology like "severance", "at-will", "lawyer", or "attorney". Always reference an SRA-regulated solicitor.
Note that employers customarily contribute £350 to £750 + VAT toward legal fees as a commercial term under s.203(3) ERA 1996.

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
    "keyClauseAmendments": ["clause topic 1", "clause topic 2"]
  }
}
`;

  const response = await callAI({
    tier: 'reasoning',
    systemPrompt: 'You are an objective UK employment statutory and clause information analyst. You strictly follow UK legal terminology, never provide prescriptive legal advice, and output valid JSON.',
    messages: [{ role: 'user', content: prompt }],
    jsonMode: true,
  });

  const data = (response.structuredData as any) || {};

  return {
    tacticalNegotiationPoints: data.tacticalNegotiationPoints || [
      'Discuss with your instructed solicitor whether the employer will align the legal fee contribution with the customary £350 to £750 + VAT commercial range under s.203(3) ERA 1996.',
      'Ask your solicitor to review whether an agreed factual reference schedule and mutual non-derogatory obligations are included.',
      'Verify with your solicitor that Notice Pay (PILON / PENP under s.402D ITEPA 2003) is clearly separated from the ex-gratia termination sum under s.403 ITEPA 2003.',
    ],
    recommendedCounterOffer: data.recommendedCounterOffer || {
      suggestedExGratiaLow: calculationSummary?.typicalRange?.low || (terms.exGratiaAmount ? Math.round(terms.exGratiaAmount * 1.25) : 5000),
      suggestedExGratiaHigh: calculationSummary?.typicalRange?.high || (terms.exGratiaAmount ? Math.round(terms.exGratiaAmount * 1.6) : 12000),
      recommendedLegalFeeContribution: Math.max(500, (terms.legalFeeContribution || 0)),
      keyClauseAmendments: [
        'Explore mutual non-derogatory undertakings with your independent solicitor.',
        'Confirm with your solicitor that unknown future personal injury and accrued statutory pension rights are excluded from the general waiver.',
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
    disclaimer: 'This audit provides statutory verification checks and objective negotiation preparation information. Under Section 203(3) Employment Rights Act 1996, a settlement agreement is only legally binding once certified by an independent qualified SRA-regulated solicitor.',
  };
}
