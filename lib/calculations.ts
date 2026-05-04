export type Reason = 'redundancy' | 'dismissal' | 'resignation' | 'mutual' | 'other';
export type Discrimination = 'no' | 'yes' | 'not_sure';
export type Verdict = 'BELOW_MINIMUM' | 'BELOW_TYPICAL' | 'WITHIN_RANGE' | 'ABOVE_TYPICAL';

export interface VerdictResult {
  verdict: Verdict;
  minimum: number;
  typicalLow: number;
  typicalHigh: number;
  redundancy: number;
  basicAward: number;
  notice: number;
  discriminationFlag: boolean;
}

// ERA 1996 s.227 — weekly pay cap. Updated 6 April 2025.
const WEEKLY_PAY_CAP = 719;

// ERA 1996 s.162 — statutory redundancy pay.
// Multiplier is applied per completed year of service, based on the employee's
// age DURING that year (counting back from termination), not their current age.
export function calcRedundancy(salary: number, years: number, age: number): number {
  const weeklyPay = Math.min(salary / 52, WEEKLY_PAY_CAP);
  const completedYears = Math.min(Math.floor(years), 20);
  let total = 0;
  for (let i = 0; i < completedYears; i++) {
    const ageInYear = age - i;
    const multiplier = ageInYear < 22 ? 0.5 : ageInYear <= 40 ? 1.0 : 1.5;
    total += weeklyPay * multiplier;
  }
  return Math.round(total);
}

// ERA 1996 s.118-119 — basic award for unfair dismissal.
// Identical formula to statutory redundancy pay.
export function calcBasicAward(salary: number, years: number, age: number): number {
  return calcRedundancy(salary, years, age);
}

// ERA 1996 s.86 — statutory minimum notice.
// Salaried employees: actual weekly pay (no cap) for the notice period.
export function calcNotice(salary: number, years: number): number {
  const weeklyPay = salary / 52; // no cap for salaried employees
  const weeks =
    years < (1 / 12) ? 0
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
  const discriminationFlag = ['yes', 'not_sure'].includes(discrimination);

  const redundancy = reason === 'redundancy' ? calcRedundancy(salary, years, age) : 0;
  // Unfair dismissal carries a basic award (same formula as redundancy pay) + notice
  const basicAward = reason === 'dismissal' ? calcBasicAward(salary, years, age) : 0;
  const notice = calcNotice(salary, years);
  const minimum = redundancy + basicAward + notice;

  const monthSalary = salary / 12;
  let typicalLow = Math.max(minimum * 1.5, monthSalary * 2);
  let typicalHigh = Math.max(minimum * 4, monthSalary * 6);

  // Discrimination awards are uncapped in tribunal — widen the typical high materially
  if (discriminationFlag) {
    typicalHigh = Math.max(typicalHigh, monthSalary * 18);
  }

  // BELOW_MINIMUM applies whenever there is a calculable statutory floor
  const hasStatutoryFloor = reason === 'redundancy' || reason === 'dismissal';

  let verdict: Verdict;
  if (hasStatutoryFloor && offer < minimum) verdict = 'BELOW_MINIMUM';
  else if (offer < typicalLow) verdict = 'BELOW_TYPICAL';
  else if (offer <= typicalHigh) verdict = 'WITHIN_RANGE';
  else verdict = 'ABOVE_TYPICAL';

  return {
    verdict,
    minimum: Math.round(minimum),
    typicalLow: Math.round(typicalLow),
    typicalHigh: Math.round(typicalHigh),
    redundancy: Math.round(redundancy),
    basicAward: Math.round(basicAward),
    notice: Math.round(notice),
    discriminationFlag,
  };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return '£—';
  return '£' + Math.round(n).toLocaleString('en-GB');
}
