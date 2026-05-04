export type Reason = 'redundancy' | 'dismissal' | 'resignation' | 'mutual' | 'other';
export type Discrimination = 'no' | 'yes' | 'not_sure';
export type Verdict = 'BELOW_MINIMUM' | 'BELOW_TYPICAL' | 'WITHIN_RANGE' | 'ABOVE_TYPICAL';

export interface VerdictResult {
  verdict: Verdict;
  minimum: number;
  typicalLow: number;
  typicalHigh: number;
  redundancy: number;
  notice: number;
  discriminationFlag: boolean;
}

const WEEKLY_PAY_CAP = 643; // UK 2024/25 statutory rate

export function calcRedundancy(salary: number, years: number, age: number): number {
  const weeklyPay = Math.min(salary / 52, WEEKLY_PAY_CAP);
  const cappedYears = Math.min(years, 20);
  const multiplier = age < 22 ? 0.5 : age <= 40 ? 1.0 : 1.5;
  return Math.round(weeklyPay * cappedYears * multiplier);
}

export function calcNotice(salary: number, years: number): number {
  const weeklyPay = Math.min(salary / 52, WEEKLY_PAY_CAP);
  const weeks =
    years < 0.083 ? 0
    : years < 2 ? 1
    : Math.min(Math.floor(years), 12);
  return Math.round(weeklyPay * weeks);
}

export function getVerdict(
  salary: number,
  years: number,
  age: number,
  offer: number,
  reason: string,
  discrimination: string,
): VerdictResult {
  const redundancy = reason === 'redundancy' ? calcRedundancy(salary, years, age) : 0;
  const notice = calcNotice(salary, years);
  const minimum = redundancy + notice;
  const monthSalary = salary / 12;
  const typicalLow = Math.max(minimum * 1.5, monthSalary * 2);
  const typicalHigh = Math.max(minimum * 4, monthSalary * 6);

  let verdict: Verdict;
  if (reason === 'redundancy' && offer < minimum) verdict = 'BELOW_MINIMUM';
  else if (offer < typicalLow) verdict = 'BELOW_TYPICAL';
  else if (offer <= typicalHigh) verdict = 'WITHIN_RANGE';
  else verdict = 'ABOVE_TYPICAL';

  return {
    verdict,
    minimum: Math.round(minimum),
    typicalLow: Math.round(typicalLow),
    typicalHigh: Math.round(typicalHigh),
    redundancy: Math.round(redundancy),
    notice: Math.round(notice),
    discriminationFlag: ['yes', 'not_sure'].includes(discrimination),
  };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return '£—';
  return '£' + Math.round(n).toLocaleString('en-GB');
}
