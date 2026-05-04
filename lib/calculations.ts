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
  noticeWeeksUsed: number;
  noticeIsContractual: boolean;
  discriminationFlag: boolean;
}

// ERA 1996 s.227 — weekly pay cap. Updated 6 April 2025.
const WEEKLY_PAY_CAP = 719;

// ERA 1996 s.162 — statutory redundancy pay.
// Takes total service in whole months for precision. Counts completed years only.
// Multiplier applied per completed year based on employee's age DURING that year,
// counting back from the termination date.
export function calcRedundancy(salary: number, totalMonths: number, age: number): number {
  const weeklyPay = Math.min(salary / 52, WEEKLY_PAY_CAP);
  const completedYears = Math.min(Math.floor(totalMonths / 12), 20);
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
export function calcBasicAward(salary: number, totalMonths: number, age: number): number {
  return calcRedundancy(salary, totalMonths, age);
}

// ERA 1996 s.86 — statutory minimum notice weeks.
// < 1 month service → 0 weeks; 1 month to 2 years → 1 week;
// 2+ years → 1 week per completed year, capped at 12.
export function statutoryNoticeWeeks(totalMonths: number): number {
  if (totalMonths < 1) return 0;
  if (totalMonths < 24) return 1;
  return Math.min(Math.floor(totalMonths / 12), 12);
}

// Notice pay uses actual weekly pay (no cap) for salaried employees (ERA s.86 + s.221).
// Uses whichever is greater: statutory entitlement or contractual notice period.
export function calcNotice(
  salary: number,
  totalMonths: number,
  contractualNoticeWeeks: number,
): { pay: number; weeksUsed: number; isContractual: boolean } {
  const weeklyPay = salary / 52;
  const statWeeks = statutoryNoticeWeeks(totalMonths);
  const weeksUsed = Math.max(statWeeks, contractualNoticeWeeks);
  return {
    pay: Math.round(weeklyPay * weeksUsed),
    weeksUsed,
    isContractual: contractualNoticeWeeks > statWeeks,
  };
}

export function getVerdict(
  salary: number,
  totalMonths: number,
  age: number,
  offer: number,
  reason: string,
  discrimination: string,
  contractualNoticeWeeks: number,
): VerdictResult {
  const discriminationFlag = ['yes', 'not_sure'].includes(discrimination);

  const redundancy = reason === 'redundancy' ? calcRedundancy(salary, totalMonths, age) : 0;
  const basicAward = reason === 'dismissal' ? calcBasicAward(salary, totalMonths, age) : 0;
  const { pay: notice, weeksUsed: noticeWeeksUsed, isContractual: noticeIsContractual } =
    calcNotice(salary, totalMonths, contractualNoticeWeeks);

  const minimum = redundancy + basicAward + notice;

  const monthSalary = salary / 12;
  let typicalLow = Math.max(minimum * 1.5, monthSalary * 2);
  let typicalHigh = Math.max(minimum * 4, monthSalary * 6);

  // Discrimination awards are uncapped in tribunal — widen the typical high materially
  if (discriminationFlag) {
    typicalHigh = Math.max(typicalHigh, monthSalary * 18);
  }

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
    noticeWeeksUsed,
    noticeIsContractual,
    discriminationFlag,
  };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return '£—';
  return '£' + Math.round(n).toLocaleString('en-GB');
}
