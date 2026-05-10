export type Discrimination = 'no' | 'yes' | 'not_sure';
export type Verdict = 'BELOW_MINIMUM' | 'BELOW_TYPICAL' | 'WITHIN_RANGE' | 'ABOVE_TYPICAL';

export interface VerdictResult {
  verdict: Verdict;
  minimum: number;
  typicalLow: number;
  typicalHigh: number;
  typicalHighUncapped: boolean; // true when discrimination = 'yes' — ceiling not shown
  discriminationAsterisk: boolean; // true when discrimination = 'not_sure' — show range with note
  redundancy: number;           // statutory redundancy pay (ERA 1996 ss.162-163)
  basicAward: number;           // basic award for unfair dismissal (ERA 1996 ss.118-119)
  notice: number;               // kept for ResultsClient compat — same as pilon
  pilon: number;                // payment in lieu of notice (ITEPA 2003 s.402D — always taxable)
  noticeWeeksUsed: number;
  noticeIsContractual: boolean;
  discriminationFlag: boolean;  // true for 'yes' or 'not_sure'
  // Tax (ITEPA 2003 s.403)
  taxFreeAmount: number;        // SRP portion below £30,000 threshold
  taxableTermination: number;   // SRP portion above £30,000 threshold
  taxRate: number;              // 0.20 | 0.40 | 0.45 marginal rate from gross salary
  estimatedTax: number;         // tax on (taxableTermination + pilon)
  estimatedNet: number;         // offer minus estimated tax
  isScottishNote: boolean;      // flag to show Scottish income tax band note in UI
  // Collective redundancy (TULRCA 1992 s.189)
  collectiveRedundancy: boolean;
  protectiveAwardMax: number;   // max 90 days × effective weekly pay — shown separately, never in total
  // Jurisdiction
  weeklyCapUsed: number;        // ERA 1996 s.227 (GB £751) / ERO(NI) 1996 (NI £783)
  jurisdiction: 'GB' | 'NI';
}

// ERA 1996 s.227 — weekly pay cap, England/Scotland/Wales. Updated 6 April 2025.
export const WEEKLY_CAP_GB = 751;

// ERO(NI) 1996 — weekly pay cap, Northern Ireland. Updated 6 April 2025.
export const WEEKLY_CAP_NI = 783;

// ERA 1996 s.162 — maximum qualifying service years for SRP
const MAX_SERVICE_YEARS = 20;

// ITEPA 2003 s.403 — tax-free threshold for genuine termination payments
const TAX_FREE_FLOOR = 30_000;

// ERA 1996 s.227 — backward-compat alias used by internal helpers
const WEEKLY_PAY_CAP = WEEKLY_CAP_GB;

/* ── Helper functions ──────────────────────────────────────────── */

// ERA 1996 ss.162-163 — statutory redundancy pay.
// Counts completed years only (no rounding up). Multiplier per year
// based on the employee's age during that year, counting back from leaving date.
export function calcRedundancy(
  salary: number,
  totalMonths: number,
  age: number,
  weeklyPayCap: number = WEEKLY_PAY_CAP,
): number {
  const weeklyPay = Math.min(salary / 52, weeklyPayCap);
  const completedYears = Math.min(Math.floor(totalMonths / 12), MAX_SERVICE_YEARS);
  let total = 0;
  for (let i = 0; i < completedYears; i++) {
    const ageInYear = age - i;
    // ERA 1996 s.162: 0.5× for each year under 22, 1× for 22-40, 1.5× for 41+
    const multiplier = ageInYear < 22 ? 0.5 : ageInYear <= 40 ? 1.0 : 1.5;
    total += weeklyPay * multiplier;
  }
  return Math.round(total);
}

// ERA 1996 ss.118-119 — basic award for unfair dismissal (identical formula to SRP).
export function calcBasicAward(salary: number, totalMonths: number, age: number): number {
  return calcRedundancy(salary, totalMonths, age);
}

// ERA 1996 s.86 — statutory minimum notice.
// < 1 month: 0 weeks. 1 month to 2 years: 1 week. 2+ years: 1 week per year, capped at 12.
export function statutoryNoticeWeeks(totalMonths: number): number {
  if (totalMonths < 1) return 0;
  if (totalMonths < 24) return 1;
  return Math.min(Math.floor(totalMonths / 12), 12);
}

// ERA 1996 s.86 + s.221 — notice/PILON uses actual weekly pay (no cap) for salaried employees.
// Uses whichever is greater: statutory minimum or contractual notice period.
// PILON is always fully taxable under ITEPA 2003 s.402D (post-April 2018 rules).
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

// ITEPA 2003 — derive marginal income tax rate from gross annual salary.
// Uses England/Wales/NI bands as baseline (Scottish bands differ — flagged in UI).
function getTaxRate(grossAnnual: number): number {
  if (grossAnnual <= 50_270) return 0.20;  // basic rate
  if (grossAnnual <= 125_140) return 0.40; // higher rate
  return 0.45;                              // additional rate
}

/* ── Main calculation function ─────────────────────────────────── */

export function getVerdict(
  salary: number,
  totalMonths: number,
  age: number,
  offer: number,
  reason: string,
  discrimination: string,
  contractualNoticeWeeks: number,
  jurisdiction: 'GB' | 'NI' = 'GB',
): VerdictResult {
  const weeklyCapUsed = jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB;
  const isCollectiveRedundancy = reason === 'redundancy_collective';
  const hasStatutoryFloor = reason === 'redundancy' || reason === 'redundancy_collective' || reason === 'dismissal';

  // ERA 1996 ss.162-163 — statutory redundancy pay
  const redundancy =
    reason === 'redundancy' || reason === 'redundancy_collective'
      ? calcRedundancy(salary, totalMonths, age, weeklyCapUsed)
      : 0;

  // ERA 1996 ss.118-119 — basic award (unfair dismissal)
  const basicAward = reason === 'dismissal' ? calcBasicAward(salary, totalMonths, age) : 0;

  // ERA 1996 s.86 + ITEPA 2003 s.402D — PILON (always fully taxable)
  const { pay: pilon, weeksUsed: noticeWeeksUsed, isContractual: noticeIsContractual } =
    calcNotice(salary, totalMonths, contractualNoticeWeeks);

  const minimum = redundancy + basicAward + pilon;

  // ── Tax calculation (ITEPA 2003 s.403 + s.402D) ──────────────
  // Only SRP (and ex-gratia) count toward the £30,000 threshold. PILON does not.
  const srp = redundancy || basicAward; // whichever applies
  const taxableTermination = Math.max(0, srp - TAX_FREE_FLOOR);
  const taxFreeAmount = srp - taxableTermination;
  const taxRate = getTaxRate(salary);
  // Tax = tax on SRP above floor + tax on all PILON
  const estimatedTax = Math.round((taxableTermination + pilon) * taxRate);
  const estimatedNet = Math.round(offer - estimatedTax);
  const isScottishNote = false; // set to true in UI layer via jurisdiction/locale detection

  // ── Protective award (TULRCA 1992 s.189(4)) ──────────────────
  // Triggered only for collective redundancy (20+ employees).
  // Maximum is 90 days × effective weekly pay. NEVER add to settlement total.
  // NOTE: Employment Rights Bill 2024-25 proposes an increase to 180 days
  // but no commencement order has been published as of May 2026 — 90 days is current law.
  const effectiveWeekly = Math.min(salary / 52, weeklyCapUsed);
  const protectiveAwardMax = isCollectiveRedundancy
    ? Math.round(effectiveWeekly * 90)
    : 0;

  // ── Typical range ─────────────────────────────────────────────
  // Per spec: typical_low = SRP + PILON + (monthly salary × 1.5)
  const monthSalary = salary / 12;
  const typicalLowCalc = minimum + monthSalary * 1.5;

  // typical_high = salary × 0.5, adjusted for service length
  const completedYears = Math.floor(totalMonths / 12);
  let typicalHighCalc = salary * 0.5;
  if (completedYears > 15) typicalHighCalc *= 1.25;
  else if (completedYears > 10) typicalHighCalc *= 1.15;
  typicalHighCalc = Math.min(typicalHighCalc, salary * 2); // cap at 2× salary

  // Ensure typical_high is always above typical_low
  typicalHighCalc = Math.max(typicalHighCalc, typicalLowCalc * 1.5);

  // ── Discrimination handling ───────────────────────────────────
  const discriminationFlag = discrimination === 'yes' || discrimination === 'not_sure';
  // 'yes': ceiling is not shown — tribunal awards uncapped
  const typicalHighUncapped = discrimination === 'yes';
  // 'not_sure': show range with asterisk + explanatory note
  const discriminationAsterisk = discrimination === 'not_sure';

  // ── Verdict ───────────────────────────────────────────────────
  let verdict: Verdict;
  if (hasStatutoryFloor && offer < minimum) {
    verdict = 'BELOW_MINIMUM';
  } else if (offer < typicalLowCalc) {
    verdict = 'BELOW_TYPICAL';
  } else if (typicalHighUncapped || offer <= typicalHighCalc) {
    verdict = 'WITHIN_RANGE';
  } else {
    verdict = 'ABOVE_TYPICAL';
  }

  return {
    verdict,
    minimum: Math.round(minimum),
    typicalLow: Math.round(typicalLowCalc),
    typicalHigh: Math.round(typicalHighCalc),
    typicalHighUncapped,
    discriminationAsterisk,
    redundancy: Math.round(redundancy),
    basicAward: Math.round(basicAward),
    notice: Math.round(pilon), // backward-compat alias
    pilon: Math.round(pilon),
    noticeWeeksUsed,
    noticeIsContractual,
    discriminationFlag,
    taxFreeAmount: Math.round(taxFreeAmount),
    taxableTermination: Math.round(taxableTermination),
    taxRate,
    estimatedTax,
    estimatedNet,
    isScottishNote,
    collectiveRedundancy: isCollectiveRedundancy,
    protectiveAwardMax,
    weeklyCapUsed,
    jurisdiction,
  };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return '£-';
  return '£' + Math.round(n).toLocaleString('en-GB');
}
