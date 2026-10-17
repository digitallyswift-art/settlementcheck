/**
 * Tool 1: Statutory Invariant Verifier
 * Deterministically enforces Employment Rights Act 1996, ITEPA 2003, and TULRCA 1992.
 */

import { AIToolDefinition } from '@/lib/ai/types';
import { calcNotice, getVerdict } from '@/lib/calculations';
import { getRatesForDate } from '@/lib/statutory-rates';
import { StatutoryFloorReport } from '../types';

export const verifyStatutoryInvariantsTool: AIToolDefinition = {
  name: 'verify_statutory_invariants',
  description: 'Deterministically evaluates statutory redundancy (ERA 1996 s.162), contractual notice/PILON (ERA 1996 s.86), and ITEPA 2003 s.403 tax liability without AI hallucination.',
  parameters: {
    type: 'object',
    properties: {
      salary: { type: 'number', description: 'Gross annual salary in GBP' },
      yearsOfService: { type: 'number', description: 'Completed years of service (max 20)' },
      age: { type: 'number', description: 'Age at termination date' },
      employerOffer: { type: 'number', description: 'Current settlement offer from employer' },
      noticeWeeks: { type: 'number', description: 'Contractual notice weeks (defaults to statutory minimum)' },
      disputeReason: { type: 'string', description: 'Dispute reason: redundancy, pip, dismissal, discrimination, etc.' },
      isDiscrimination: { type: 'boolean', description: 'Whether discrimination (protected characteristics under Equality Act 2010) is present' },
      jurisdiction: { type: 'string', description: 'GB (England/Scotland/Wales) or NI (Northern Ireland)', enum: ['GB', 'NI'] },
    },
    required: ['salary', 'yearsOfService', 'age', 'employerOffer'],
  },
  execute: (args) => {
    const salary = Number(args.salary);
    const years = Math.min(Math.max(0, Number(args.yearsOfService)), 20);
    const months = Math.floor(years * 12);
    const age = Number(args.age);
    const offer = Number(args.employerOffer);
    const jurisdiction = (args.jurisdiction === 'NI' ? 'NI' : 'GB') as 'GB' | 'NI';
    const disputeReason = String(args.disputeReason || 'redundancy');
    const isDiscrimination = Boolean(args.isDiscrimination || disputeReason === 'discrimination');
    const discriminationParam = isDiscrimination ? 'yes' : 'no';

    const rates = getRatesForDate();
    const weeklyCap = jurisdiction === 'NI' ? rates.weeklyCapNI : rates.weeklyCapGB;

    const notice = calcNotice(salary, months, Number(args.noticeWeeks ?? 0));

    const verdict = getVerdict(
      salary,
      months,
      age,
      offer,
      disputeReason,
      discriminationParam,
      notice.weeksUsed,
      jurisdiction,
    );

    // Statutory redundancy pay applies strictly to redundancy exits with >= 2 years' service (ERA 1996 s.135/s.155)
    const isRedundancy = disputeReason === 'redundancy' || disputeReason === 'redundancy_collective';
    const statutoryRedundancyPay = isRedundancy && years >= 2 ? verdict.redundancy : 0;
    const statutoryNoticePay = verdict.pilon;
    const basicAward = verdict.basicAward || 0;
    const statutoryFloor = statutoryRedundancyPay + basicAward + statutoryNoticePay;

    const isBelow = offer < statutoryFloor;
    const delta = isBelow ? statutoryFloor - offer : 0;

    const report: StatutoryFloorReport = {
      statutoryRedundancyPay,
      noticePayPilon: statutoryNoticePay,
      statutoryMinimumTotal: statutoryFloor,
      weeklyCapUsed: weeklyCap,
      maxServiceYearsApplied: years,
      taxFreeTerminationPortion: verdict.taxFreeAmount,
      taxableTerminationPortion: verdict.taxableTermination,
      estimatedTaxLiability: verdict.estimatedTax,
      estimatedNetTakeHome: verdict.estimatedNet,
      isOfferBelowStatutoryMinimum: isBelow,
      statutoryShortfallDelta: delta,
      governingLegislation: jurisdiction === 'NI'
        ? 'Employment Relations (Northern Ireland) Order 1999 & ITEPA 2003 s.403'
        : 'Employment Rights Act 1996 ss.86, 162, 227 & ITEPA 2003 s.403 (April 2026 Rate: £751/wk)',
    };

    return report as unknown as Record<string, unknown>;
  },
};
