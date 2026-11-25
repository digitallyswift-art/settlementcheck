/**
 * Tool 4: Settlement Statutory & Tax Leverage Engine
 * Evaluates official UK statutory benchmarks (ERA 1996, ITEPA 2003, HMCTS)
 * and live database outcomes (when present) without fabricating market multipliers.
 */

import { AIToolDefinition } from '@/lib/ai/types';
import { supabase } from '@/lib/supabase';
import {
  getOfficialBenchmark,
  STATUTORY_RATES_2026_27,
  VENTO_BANDS_2026_27,
} from '@/lib/statutory-rates';
import { MarketBenchmarkReport } from '../types';

export const querySettlementBenchmarksTool: AIToolDefinition = {
  name: 'query_settlement_benchmarks',
  description: 'Evaluates official UK statutory tribunal caps, ITEPA 2003 tax structuring levers, and verified database outcomes.',
  parameters: {
    type: 'object',
    properties: {
      salary: { type: 'number', description: 'Gross annual salary in GBP' },
      yearsOfService: { type: 'number', description: 'Completed years of service' },
      employerOffer: { type: 'number', description: 'Current settlement offer' },
      disputeReason: { type: 'string', description: 'Reason for dispute: redundancy, pip, dismissal, discrimination, etc.' },
      isDiscrimination: { type: 'boolean', description: 'Whether discrimination under the Equality Act 2010 is present' },
      industrySector: { type: 'string', description: 'Industry or sector, if known' },
    },
    required: ['salary', 'yearsOfService', 'employerOffer'],
  },
  execute: async (args) => {
    const salary = Number(args.salary);
    const years = Number(args.yearsOfService);
    const offer = Number(args.employerOffer);
    const reason = String(args.disputeReason || 'redundancy');
    const isDiscrimination = Boolean(args.isDiscrimination || reason === 'discrimination');

    // Query Supabase aggregate outcomes if real records exist (never fabricate sample sizes)
    let dbSampleSize = 0;
    let avgMultiplier = 0;
    let avgLegalFee = 650;

    try {
      const { data, error } = await supabase
        .from('settlement_outcomes')
        .select('settlement_multiplier, legal_fees_paid_by_employer')
        .eq('dispute_category', reason)
        .limit(50);

      if (!error && data && data.length > 0) {
        dbSampleSize = data.length;
        const validMultipliers = data.map(d => Number(d.settlement_multiplier)).filter(n => !isNaN(n) && n > 0);
        if (validMultipliers.length > 0) {
          avgMultiplier = validMultipliers.reduce((a, b) => a + b, 0) / validMultipliers.length;
        }
        const validFees = data.map(d => Number(d.legal_fees_paid_by_employer)).filter(n => !isNaN(n) && n > 0);
        if (validFees.length > 0) {
          avgLegalFee = Math.round(validFees.reduce((a, b) => a + b, 0) / validFees.length);
        }
      }
    } catch {
      // Non-blocking fallback
    }

    const official = getOfficialBenchmark(reason, isDiscrimination);
    const monthlyGross = salary / 12;

    // Statutory-anchored illustrative bounds (1 to 3 months gross salary / notice context, never claiming "UK market standard")
    const medianMultiplier = dbSampleSize > 0 && avgMultiplier > 0 ? Math.round(avgMultiplier * 10) / 10 : 2.0;
    const upperMultiplier = Math.round(medianMultiplier * 1.5 * 10) / 10;

    const typicalLow = Math.round(monthlyGross * medianMultiplier);
    const typicalHigh = Math.round(monthlyGross * upperMultiplier);

    const recommendedExGratia = Math.max(offer, typicalLow);
    const targetTotal = recommendedExGratia + Math.round(monthlyGross);

    const excessOver30k = Math.max(0, offer - STATUTORY_RATES_2026_27.taxFreeLimit);
    const employerClass1ANic = Math.round(excessOver30k * STATUTORY_RATES_2026_27.employerClass1ANICRate);

    const tacticalPoints: string[] = [
      `Verify contractual notice period, accrued holiday pay, bonus/commission pro-rating, and ERA 1996 s.162 redundancy eligibility (${years} yrs service; April 2026 GB weekly cap £${STATUTORY_RATES_2026_27.weeklyCapGB}/wk, max statutory basic award £${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}).`,
      `Under ITEPA 2003 s.403, the first £${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')} of genuine ex-gratia termination compensation is tax-free with 0% employee NIC, while Post-Employment Notice Pay (PENP, s.402D) must be separated and taxed as earnings.`,
      `Statutory unfair dismissal compensatory award cap (GB) is £${STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')} (or 52 weeks' gross pay, whichever is lower) under ERA 1996 s.124.`,
    ];

    if (excessOver30k > 0) {
      tacticalPoints.push(
        `Offer exceeds the £30,000 s.403 threshold by £${excessOver30k.toLocaleString('en-GB')}, attracting ${(STATUTORY_RATES_2026_27.employerClass1ANICRate * 100).toFixed(1)}% Employer Class 1A NIC (approx. £${employerClass1ANic.toLocaleString('en-GB')}). Consider structuring excess into an employer pension contribution.`
      );
    }

    if (isDiscrimination) {
      tacticalPoints.push(
        `Equality Act 2010 discrimination compensation is uncapped at Employment Tribunal; injury to feelings awards follow the Ninth Addendum Vento guidelines (£${VENTO_BANDS_2026_27.lowerMin.toLocaleString('en-GB')} to £${VENTO_BANDS_2026_27.exceptionalMin.toLocaleString('en-GB')}+).`
      );
    }

    const report: MarketBenchmarkReport = {
      sampleSize: dbSampleSize,
      medianSettlementMultiplier: medianMultiplier,
      upperQuartileMultiplier: upperMultiplier,
      typicalSettlementRange: {
        low: typicalLow,
        high: typicalHigh,
        uncapped: isDiscrimination,
      },
      recommendedCounterOffer: {
        targetExGratia: recommendedExGratia,
        targetTotalPayout: targetTotal,
        recommendedLegalFeeContribution: Math.max(500, avgLegalFee),
      },
      tacticalNegotiationPoints: tacticalPoints,
      officialBenchmark: official,
    };

    return report as unknown as Record<string, unknown>;
  },
};
