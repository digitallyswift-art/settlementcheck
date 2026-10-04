import { AIToolDefinition } from '../types';
import { getVerdict, calcRedundancy } from '@/lib/calculations';
import { STATUTORY_RATES, getRatesForDate } from '@/lib/statutory-rates';

/**
 * Deterministic Statutory Tools for SettlementCheck Agents
 * Ensures AI agents cannot hallucinate statutory caps or tax formulas.
 */

export const calculateStatutoryRedundancyTool: AIToolDefinition = {
  name: 'calculate_statutory_redundancy',
  description: 'Calculates the statutory redundancy pay entitlement under ERA 1996 s.162 based on age, service years, and annual gross pay.',
  parameters: {
    type: 'object',
    properties: {
      salary: { type: 'number', description: 'Gross annual salary in GBP' },
      yearsOfService: { type: 'number', description: 'Complete continuous service years (capped at 20)' },
      age: { type: 'number', description: 'Employee age at termination date' },
      jurisdiction: { type: 'string', description: 'GB (England/Scotland/Wales) or NI (Northern Ireland)', enum: ['GB', 'NI'] },
    },
    required: ['salary', 'yearsOfService', 'age'],
  },
  execute: (args) => {
    const salary = Number(args.salary);
    const months = Math.floor(Number(args.yearsOfService) * 12);
    const age = Number(args.age);
    const jurisdiction = (args.jurisdiction === 'NI' ? 'NI' : 'GB') as 'GB' | 'NI';
    const weeklyCap = jurisdiction === 'NI' ? STATUTORY_RATES.weeklyCapNI : STATUTORY_RATES.weeklyCapGB;

    const amount = calcRedundancy(salary, months, age, weeklyCap);

    return {
      statutoryRedundancyPay: amount,
      statutoryWeeklyCapUsed: weeklyCap,
      jurisdiction,
      governingLegislation: jurisdiction === 'NI' ? 'ERO (NI) 1996' : 'Employment Rights Act 1996 s.162',
      maxServiceYearsCap: 20,
    };
  },
};

export const evaluateSettlementOfferTool: AIToolDefinition = {
  name: 'evaluate_settlement_offer',
  description: 'Calculates the full statutory floor, benchmark payout ranges, and tax liability (ITEPA 2003 s.403) for a UK settlement offer.',
  parameters: {
    type: 'object',
    properties: {
      salary: { type: 'number', description: 'Annual gross salary in GBP' },
      yearsOfService: { type: 'number', description: 'Complete years of service' },
      age: { type: 'number', description: 'Current age of employee' },
      offer: { type: 'number', description: 'Current settlement offer in GBP from employer' },
      reason: { type: 'string', description: 'Dispute reason (redundancy, pip, dismissal, etc.)' },
      noticeWeeks: { type: 'number', description: 'Contractual notice period in weeks' },
      discrimination: { type: 'string', description: 'Discrimination present (yes / no / not_sure)', enum: ['yes', 'no', 'not_sure'] },
      jurisdiction: { type: 'string', description: 'GB or NI', enum: ['GB', 'NI'] },
    },
    required: ['salary', 'yearsOfService', 'age', 'offer'],
  },
  execute: (args) => {
    const salary = Number(args.salary);
    const months = Math.floor(Number(args.yearsOfService) * 12);
    const age = Number(args.age);
    const offer = Number(args.offer);
    const reason = String(args.reason || 'redundancy');
    const discrimination = String(args.discrimination || 'no');
    const noticeWeeks = Number(args.noticeWeeks ?? 4);
    const jurisdiction = (args.jurisdiction === 'NI' ? 'NI' : 'GB') as 'GB' | 'NI';

    const verdict = getVerdict(
      salary,
      months,
      age,
      offer,
      reason,
      discrimination,
      noticeWeeks,
      jurisdiction,
    );

    return {
      verdict: verdict.verdict,
      statutoryMinimum: verdict.minimum,
      typicalRange: {
        low: verdict.typicalLow,
        high: verdict.typicalHigh,
        uncapped: verdict.typicalHighUncapped,
      },
      redundancyBasicAward: verdict.redundancy,
      noticePilon: verdict.pilon,
      taxAnalysis: {
        taxFreePortion: verdict.taxFreeAmount,
        taxablePortion: verdict.taxableTermination,
        estimatedTax: verdict.estimatedTax,
        estimatedNetTakeHome: verdict.estimatedNet,
        legislation: 'ITEPA 2003 s.403 (£30,000 exemption limit)',
      },
      weeklyCapApplied: verdict.weeklyCapUsed,
      legalFeeStandard: 'Employer typically contributes £500-£1,500+VAT towards legal advice',
    };
  },
};
export const getStatutoryRatesTool: AIToolDefinition = {
  name: 'get_statutory_rates',
  description: 'Returns the official UK statutory employment law figures and caps for a specific tax year or termination date.',
  parameters: {
    type: 'object',
    properties: {
      terminationDate: { type: 'string', description: 'ISO date string or YYYY-MM-DD' },
    },
  },
  execute: (args) => {
    const rates = getRatesForDate(args?.terminationDate);
    return {
      weeklyCapGB: rates.weeklyCapGB,
      weeklyCapNI: rates.weeklyCapNI,
      compensatoryAwardLimitGB: rates.compensatoryAwardLimitGB,
      taxFreeTerminationThreshold: rates.taxFreeLimit,
      maxServiceYears: rates.maxServiceYears,
      maxBasicAwardGB: rates.maxBasicAwardGB,
    };
  },
};

export const ALL_STATUTORY_TOOLS: AIToolDefinition[] = [
  calculateStatutoryRedundancyTool,
  evaluateSettlementOfferTool,
  getStatutoryRatesTool,
];
