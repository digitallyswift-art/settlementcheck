export interface StatutoryRates {
  weeklyCapGB: number;
  weeklyCapNI: number;
  maxServiceYears: number;
  taxFreeLimit: number;
  compensatoryAwardLimitGB: number;
  maxNoticeWeeks: number;
  maxBasicAwardGB: number;
}

export const STATUTORY_RATES_2025_26: StatutoryRates = {
  weeklyCapGB: 719,
  weeklyCapNI: 749,
  maxServiceYears: 20,
  taxFreeLimit: 30000,
  compensatoryAwardLimitGB: 118223,
  maxNoticeWeeks: 12,
  maxBasicAwardGB: 21570, // 20 * 1.5 * 719
};

export const STATUTORY_RATES_2026_27: StatutoryRates = {
  weeklyCapGB: 751,
  weeklyCapNI: 783,
  maxServiceYears: 20,
  taxFreeLimit: 30000,
  compensatoryAwardLimitGB: 123543,
  maxNoticeWeeks: 12,
  maxBasicAwardGB: 22530, // 20 * 1.5 * 751
};

/**
 * Returns the statutory rates applicable for a given termination date.
 * Default is the 2026/27 active rates (since the current date is after 6 April 2026).
 */
export function getRatesForDate(dateInput?: Date | string | null): StatutoryRates {
  if (!dateInput) {
    return STATUTORY_RATES_2026_27;
  }
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  // If date is invalid, default to 2026/27
  if (isNaN(date.getTime())) {
    return STATUTORY_RATES_2026_27;
  }
  // 6 April 2026 threshold
  const threshold2026 = new Date('2026-04-06T00:00:00');
  if (date >= threshold2026) {
    return STATUTORY_RATES_2026_27;
  }
  return STATUTORY_RATES_2025_26;
}

// Current default active rates
export const STATUTORY_RATES = STATUTORY_RATES_2026_27;

export interface StatutoryRow {
  label: string;
  y2425: string; // 2025/26 (stored as legacy y2425 key)
  y2526: string; // 2026/27 (stored as legacy y2526 key)
}

export function getGeneralStatutoryRows(): StatutoryRow[] {
  return [
    { label: 'Weekly pay cap (England, Scotland, Wales)', y2425: `£${STATUTORY_RATES_2025_26.weeklyCapGB}`, y2526: `£${STATUTORY_RATES_2026_27.weeklyCapGB}` },
    { label: 'Weekly pay cap (Northern Ireland)', y2425: `£${STATUTORY_RATES_2025_26.weeklyCapNI}`, y2526: `£${STATUTORY_RATES_2026_27.weeklyCapNI}` },
    { label: 'Maximum statutory redundancy pay (GB)', y2425: `£${STATUTORY_RATES_2025_26.maxBasicAwardGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}` },
    { label: 'Tax-free termination payment limit', y2425: `£${STATUTORY_RATES_2025_26.taxFreeLimit.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')}` },
    { label: 'Maximum qualifying service years', y2425: `${STATUTORY_RATES_2025_26.maxServiceYears} years`, y2526: `${STATUTORY_RATES_2026_27.maxServiceYears} years` },
    { label: 'Maximum statutory notice period', y2425: `${STATUTORY_RATES_2025_26.maxNoticeWeeks} weeks`, y2526: `${STATUTORY_RATES_2026_27.maxNoticeWeeks} weeks` },
  ];
}

export function getConstructiveDismissalStatutoryRows(): StatutoryRow[] {
  return [
    { label: 'Weekly pay cap (GB), basic award', y2425: `£${STATUTORY_RATES_2025_26.weeklyCapGB}`, y2526: `£${STATUTORY_RATES_2026_27.weeklyCapGB}` },
    { label: 'Maximum basic award (GB)', y2425: `£${STATUTORY_RATES_2025_26.maxBasicAwardGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}` },
    { label: 'Compensatory award cap (GB)', y2425: `£${STATUTORY_RATES_2025_26.compensatoryAwardLimitGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')}` },
    { label: 'Tax-free threshold (termination payments)', y2425: `£${STATUTORY_RATES_2025_26.taxFreeLimit.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')}` },
    { label: 'Qualifying service for constructive dismissal', y2425: '2 years', y2526: '2 years' },
  ];
}

export function getUnfairDismissalStatutoryRows(): StatutoryRow[] {
  return [
    { label: 'Weekly pay cap (GB), basic award', y2425: `£${STATUTORY_RATES_2025_26.weeklyCapGB}`, y2526: `£${STATUTORY_RATES_2026_27.weeklyCapGB}` },
    { label: 'Maximum basic award (GB)', y2425: `£${STATUTORY_RATES_2025_26.maxBasicAwardGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}` },
    { label: 'Compensatory award cap (GB)', y2425: `£${STATUTORY_RATES_2025_26.compensatoryAwardLimitGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')}` },
    { label: 'Tax-free threshold (termination payments)', y2425: `£${STATUTORY_RATES_2025_26.taxFreeLimit.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')}` },
    { label: 'Qualifying service for unfair dismissal', y2425: '2 years', y2526: '2 years' },
  ];
}

export function getRedundancyStatutoryRows(): StatutoryRow[] {
  return [
    { label: 'Weekly pay cap (Great Britain)', y2425: `£${STATUTORY_RATES_2025_26.weeklyCapGB}`, y2526: `£${STATUTORY_RATES_2026_27.weeklyCapGB}` },
    { label: 'Weekly pay cap (Northern Ireland)', y2425: `£${STATUTORY_RATES_2025_26.weeklyCapNI}`, y2526: `£${STATUTORY_RATES_2026_27.weeklyCapNI}` },
    { label: 'Maximum qualifying service years', y2425: `${STATUTORY_RATES_2025_26.maxServiceYears}`, y2526: `${STATUTORY_RATES_2026_27.maxServiceYears}` },
    { label: 'Maximum statutory redundancy pay (GB)', y2425: `£${STATUTORY_RATES_2025_26.maxBasicAwardGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}` },
    { label: 'Tax-free redundancy payment threshold', y2425: `£${STATUTORY_RATES_2025_26.taxFreeLimit.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')}` },
    { label: 'Unfair dismissal compensatory cap (GB)', y2425: `£${STATUTORY_RATES_2025_26.compensatoryAwardLimitGB.toLocaleString('en-GB')}`, y2526: `£${STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')}` },
  ];
}
