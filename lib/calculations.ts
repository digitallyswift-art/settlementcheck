export type Discrimination = 'no' | 'yes' | 'not_sure';
export type Verdict = 'BELOW_MINIMUM' | 'BELOW_TYPICAL' | 'WITHIN_RANGE' | 'ABOVE_TYPICAL';

export interface VerdictResult {
  verdict: Verdict;
  minimum: number;
  typicalLow: number;
  typicalHigh: number;
  typicalHighUncapped: boolean; // true when discrimination = 'yes' - ceiling not shown
  discriminationAsterisk: boolean; // true when discrimination = 'not_sure' - show range with note
  redundancy: number;           // statutory redundancy pay (ERA 1996 ss.162-163)
  basicAward: number;           // basic award for unfair dismissal (ERA 1996 ss.118-119)
  notice: number;               // kept for ResultsClient compat - same as pilon
  pilon: number;                // payment in lieu of notice (ITEPA 2003 s.402D - always taxable)
  noticeWeeksUsed: number;
  noticeIsContractual: boolean;
  discriminationFlag: boolean;  // true for 'yes' or 'not_sure'
  // Tax (ITEPA 2003 s.403)
  taxFreeAmount: number;        // SRP portion below £30,000 threshold
  taxableTermination: number;   // SRP portion above £30,000 threshold
  taxRate: number;              // effective marginal rate on settlement package
  estimatedTax: number;         // progressive tiered tax on (taxableTermination + pilon)
  estimatedNet: number;         // effective offer minus estimated tax
  isScottishNote: boolean;      // flag to show Scottish income tax band note in UI
  // Notice inclusion handling (SC-B-020)
  offerIncludesNotice: boolean; // true if offer includes notice pay, false if notice is paid on top
  effectiveOffer: number;      // total offer package evaluated
  // Collective redundancy (TULRCA 1992 s.189)
  collectiveRedundancy: boolean;
  protectiveAwardMax: number;   // max 90 days × effective weekly pay - shown separately, never in total
  // Jurisdiction
  weeklyCapUsed: number;        // ERA 1996 s.227 (GB £751) / ERO(NI) 1996 (NI £783)
  jurisdiction: 'GB' | 'NI';
  // Statutory limits and Vento bands for platform features
  compensatoryCap?: number;
  ventoBands?: {
    lowerMin: number;
    lowerMax: number;
    middleMin: number;
    middleMax: number;
    upperMin: number;
    upperMax: number;
    exceptionalMin: number;
  };
}

import { STATUTORY_RATES, getRatesForDate } from './statutory-rates';

// ERA 1996 s.227 — weekly pay cap, England/Scotland/Wales.
export const WEEKLY_CAP_GB = STATUTORY_RATES.weeklyCapGB;

// ERO(NI) 1996 — weekly pay cap, Northern Ireland.
export const WEEKLY_CAP_NI = STATUTORY_RATES.weeklyCapNI;

// ERA 1996 s.162 — maximum qualifying service years for SRP
const MAX_SERVICE_YEARS = STATUTORY_RATES.maxServiceYears;

// ITEPA 2003 s.403 — tax-free threshold for genuine termination payments
const TAX_FREE_FLOOR = STATUTORY_RATES.taxFreeLimit;

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
  if (totalMonths < 24) return 0; // ERA 1996 s.155: statutory redundancy requires 2 complete years continuous service
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
// Only payable if an unfair dismissal claim succeeds. Uses the jurisdiction's weekly pay cap.
// The 2-year threshold mirrors ERA 1996 s.108 (ordinary unfair dismissal).
export function calcBasicAward(
  salary: number,
  totalMonths: number,
  age: number,
  weeklyPayCap: number = WEEKLY_PAY_CAP,
): number {
  return calcRedundancy(salary, totalMonths, age, weeklyPayCap);
}

// Working Time Regulations 1998 reg. 14 — payment for holiday accrued but not taken on termination.
// Daily rate = annual salary / 52 weeks / working days per week. Kept separate from the
// settlement figures because holiday pay is often paid outside the settlement sum.
export function calcAccruedHolidayPay(
  salary: number,
  untakenDays: number,
  workingDaysPerWeek: number = 5,
): { pay: number; dailyRate: number } {
  if (!(salary > 0) || !(untakenDays > 0) || !(workingDaysPerWeek > 0)) {
    return { pay: 0, dailyRate: salary > 0 && workingDaysPerWeek > 0 ? Math.round((salary / 52 / workingDaysPerWeek) * 100) / 100 : 0 };
  }
  const dailyRate = salary / 52 / workingDaysPerWeek;
  return { pay: Math.round(dailyRate * untakenDays), dailyRate: Math.round(dailyRate * 100) / 100 };
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

// ITEPA 2003 / Income Tax Act 2007: England/Wales/NI progressive tax bands
// Personal Allowance: £12,570 (tapered by £1 for every £2 of income above £100,000)
// Basic Rate: 20% on taxable income up to £37,700 (£12,571 to £50,270)
// Higher Rate: 40% on taxable income between £37,700 and £112,570 (£50,271 to £125,140)
// Personal Allowance Taper (60% effective marginal trap): £100,001 to £125,140
// Additional Rate: 45% on income above £125,140
export function calculateTotalIncomeTax(grossAnnual: number): number {
  if (grossAnnual <= 12570) return 0;
  if (grossAnnual <= 50270) {
    return (grossAnnual - 12570) * 0.20;
  }
  if (grossAnnual <= 100000) {
    const basicTax = (50270 - 12570) * 0.20; // £7,540
    return basicTax + (grossAnnual - 50270) * 0.40;
  }
  if (grossAnnual <= 125140) {
    const basicTax = (50270 - 12570) * 0.20; // £7,540
    const higherTax = (100000 - 50270) * 0.40; // £19,892
    // 60% effective marginal rate due to £1 allowance reduction per £2 earnings
    return basicTax + higherTax + (grossAnnual - 100000) * 0.60;
  }
  // Additional rate 45% (Personal allowance fully tapered to £0 at £125,140)
  const basicTax = (50270 - 12570) * 0.20; // £7,540
  const higherTax = (100000 - 50270) * 0.40; // £19,892
  const trapTax = (125140 - 100000) * 0.60; // £15,084
  return basicTax + higherTax + trapTax + (grossAnnual - 125140) * 0.45;
}

// ITEPA 2003: derive baseline marginal income tax rate from gross annual salary.
// Accounts for the UK Personal Allowance tapering (the 60% tax trap between £100,000 and £125,140).
// Uses England/Wales/NI bands as baseline (Scottish bands differ: flagged in UI).
export function getTaxRate(grossAnnual: number): number {
  if (grossAnnual <= 50_270) return 0.20;  // basic rate
  if (grossAnnual <= 100_000) return 0.40; // higher rate (before personal allowance tapering)
  if (grossAnnual <= 125_140) return 0.60; // 60% tax trap (tapering of personal allowance by £1 for every £2 earned)
  return 0.45;                              // additional rate (personal allowance is already £0)
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
  offerIncludesNotice: boolean = true,
): VerdictResult {
  const weeklyCapUsed = jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB;
  const isCollectiveRedundancy = reason === 'redundancy_collective';

  // Retrieve correct statutory rates for date
  const rates = getRatesForDate();

  // ERA 1996 ss.162-163: statutory redundancy pay
  const redundancy =
    reason === 'redundancy' || reason === 'redundancy_collective'
      ? calcRedundancy(salary, totalMonths, age, weeklyCapUsed)
      : 0;

  // ERA 1996 ss.118-119: basic award (unfair dismissal)
  // Claim-dependent: only payable if an unfair dismissal claim succeeds, so it is NOT part of `minimum`.
  const basicAward = reason === 'dismissal' ? calcBasicAward(salary, totalMonths, age, weeklyCapUsed) : 0;

  // ERA 1996 s.86 + ITEPA 2003 s.402D: PILON (always fully taxable)
  const { pay: pilon, weeksUsed: noticeWeeksUsed, isContractual: noticeIsContractual } =
    calcNotice(salary, totalMonths, contractualNoticeWeeks);

  // `minimum` = figures calculated from the answers given: notice pay + statutory redundancy pay.
  // Excludes the basic award (claim-dependent) and accrued holiday (calculated separately).
  const minimum = redundancy + pilon;

  // SC-B-020: Notice pay handling and effective offer
  // If offer includes notice pay, termination payment is offer minus notice pay.
  // If notice pay is paid on top, the full offer is termination payment, and effective package is offer + pilon.
  const effectiveOffer = offerIncludesNotice ? offer : (offer + pilon);
  const terminationPayment = offerIncludesNotice ? Math.max(0, offer - pilon) : offer;

  // ── Tax calculation (ITEPA 2003 s.403 + s.402D) ──────────────
  // Only the termination payment (redundancy + ex-gratia) counts toward the £30,000 threshold.
  const taxableTermination = Math.max(0, terminationPayment - TAX_FREE_FLOOR);
  const taxFreeAmount = terminationPayment - taxableTermination;

  // SC-B-019: Progressive tiered tax calculation
  // Total taxable income including taxable termination and PILON:
  const taxableSettlement = taxableTermination + pilon;
  const baseSalaryTax = calculateTotalIncomeTax(salary);
  const totalTaxWithSettlement = calculateTotalIncomeTax(salary + taxableSettlement);
  // Progressive marginal tax due on the settlement package:
  const estimatedTax = Math.max(0, Math.round(totalTaxWithSettlement - baseSalaryTax));
  const estimatedNet = Math.max(0, Math.round(effectiveOffer - estimatedTax));

  // Effective marginal tax rate for UI display:
  const taxRate = taxableSettlement > 0
    ? Number((estimatedTax / taxableSettlement).toFixed(2))
    : getTaxRate(salary);

  const isScottishNote = false; // set to true in UI layer via jurisdiction/locale detection

  // ── Protective award (TULRCA 1992 s.189(4)) ──────────────────
  // Triggered only for collective redundancy (20+ employees).
  // 90 calendar days = approx 12.86 weeks of actual weekly remuneration.
  const protectiveAwardMax = isCollectiveRedundancy
    ? Math.round((salary / 52) * (90 / 7))
    : 0;

  // ── Typical range ─────────────────────────────────────────────
  const monthSalary = salary / 12;
  // Reference range formula (not a record of actual settlements). The basic award is included
  // here so the reference range is unchanged for dismissal cases.
  const typicalLowCalc = minimum + basicAward + monthSalary * 1.5;

  const completedYears = Math.floor(totalMonths / 12);
  let typicalHighCalc = salary * 0.5;
  if (completedYears > 15) typicalHighCalc *= 1.25;
  else if (completedYears > 10) typicalHighCalc *= 1.15;
  typicalHighCalc = Math.min(typicalHighCalc, salary * 2); // cap at 2× salary
  typicalHighCalc = Math.max(typicalHighCalc, typicalLowCalc * 1.5);

  // ── Discrimination handling ───────────────────────────────────
  const discriminationFlag = discrimination === 'yes' || discrimination === 'not_sure';
  const typicalHighUncapped = discrimination === 'yes';
  const discriminationAsterisk = discrimination === 'not_sure';

  // Unfair dismissal compensatory cap: lower of gross salary or statutory limit
  const compensatoryCap = Math.round(Math.min(salary, rates.compensatoryAwardLimitGB));

  // Vento bands for 2026/27 (Presidential Guidance Ninth Addendum, applicable from 6 April 2026)
  const ventoBands = {
    lowerMin: 1300,
    lowerMax: 12600,
    middleMin: 12600,
    middleMax: 37700,
    upperMin: 37700,
    upperMax: 62900,
    exceptionalMin: 62900,
  };

  // ── Verdict ───────────────────────────────────────────────────
  let verdict: Verdict;
  // BELOW_MINIMUM = the offer is lower than the notice + redundancy figures calculated from the answers.
  // This is a comparison, not a finding that the offer is unlawful (ERA 1996 s.203(3) allows settlement for any sum).
  if (minimum > 0 && effectiveOffer < minimum) {
    verdict = 'BELOW_MINIMUM';
  } else if (effectiveOffer < typicalLowCalc) {
    verdict = 'BELOW_TYPICAL';
  } else if (typicalHighUncapped || effectiveOffer <= typicalHighCalc) {
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
    offerIncludesNotice,
    effectiveOffer: Math.round(effectiveOffer),
    collectiveRedundancy: isCollectiveRedundancy,
    protectiveAwardMax,
    weeklyCapUsed,
    jurisdiction,
    compensatoryCap,
    ventoBands,
  };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return '£-';
  return '£' + Math.round(n).toLocaleString('en-GB');
}

export interface PensionSacrificeResult {
  taxSaved: number;
  pensionGrowth: number;
  cashNetReduction: number;
  netWealthBenefit: number;
}

export function calcPensionSacrifice(
  taxableTermination: number,
  sacrificeAmount: number,
  salary: number,
): PensionSacrificeResult {
  const currentTaxable = salary + taxableTermination;
  const newTaxable = currentTaxable - sacrificeAmount;

  const currentTax = calculateTotalIncomeTax(currentTaxable);
  const newTax = calculateTotalIncomeTax(newTaxable);
  const taxSaved = Math.max(0, Math.round(currentTax - newTax));

  const pensionGrowth = sacrificeAmount;
  const cashNetReduction = Math.max(0, Math.round(sacrificeAmount - taxSaved));
  const netWealthBenefit = taxSaved;

  return {
    taxSaved,
    pensionGrowth,
    cashNetReduction,
    netWealthBenefit,
  };
}

/* ── Protective Award Engine (TULRCA 1992 s.189) ─────────────────── */

export interface ProtectiveAwardParams {
  salary: number; // gross annual salary
  daysAwarded?: number; // up to 90 days (TULRCA 1992 s.189)
  employerStatus?: 'solvent' | 'insolvent';
  jurisdiction?: 'GB' | 'NI';
  employeesProposed?: number; // 20-99 (30 days consultation) or 100+ (45 days)
}

export interface ProtectiveAwardResult {
  daysAwarded: number;
  weeksAwarded: number;
  weeklyGrossPay: number;
  solventAward: number;
  insolventAward: number;
  insolventShortfall: number;
  weeklyCapUsed: number;
  maxInsolvencyWeeks: number;
  isCollectiveThresholdMet: boolean;
  statutoryConsultationPeriod: number; // 30 days (20-99) or 45 days (100+)
  taxFreeAmount: number;
  taxableAmount: number;
  estimatedTax: number;
  estimatedNet: number;
}

export function calcProtectiveAward({
  salary,
  daysAwarded = 90,
  employerStatus = 'solvent',
  jurisdiction = 'GB',
  employeesProposed = 20,
}: ProtectiveAwardParams): ProtectiveAwardResult {
  const cappedDays = Math.min(Math.max(1, daysAwarded), 90);
  const weeksAwarded = Number((cappedDays / 7).toFixed(2));
  const weeklyGrossPay = Math.round(salary / 52);
  const weeklyCapUsed = jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB;

  // Solvent employer: uncapped actual gross pay for days awarded
  const solventAward = Math.round((salary / 52) * (cappedDays / 7));

  // Insolvent employer: paid by Insolvency Service, capped at 8 weeks and statutory weekly cap
  const maxInsolvencyWeeks = 8;
  const insolventWeeksUsed = Math.min(maxInsolvencyWeeks, cappedDays / 7);
  const insolventWeeklyPay = Math.min(weeklyGrossPay, weeklyCapUsed);
  const insolventAward = Math.round(insolventWeeklyPay * insolventWeeksUsed);
  const insolventShortfall = Math.max(0, solventAward - insolventAward);

  const isCollectiveThresholdMet = employeesProposed >= 20;
  const statutoryConsultationPeriod = employeesProposed >= 100 ? 45 : employeesProposed >= 20 ? 30 : 0;

  // Selected award based on employer status
  const effectiveGrossAward = employerStatus === 'insolvent' ? insolventAward : solventAward;

  // Tax treatment under HMRC EIM02550 and ITEPA 2003 s.62:
  // Protective awards under TULRCA 1992 s.189 are taxable as remuneration/earnings.
  // They are not termination compensation under s.401, so the s.403 £30,000 exemption does not apply.
  // Subject to standard PAYE income tax and Class 1 National Insurance.
  const taxFreeAmount = 0;
  const taxableAmount = effectiveGrossAward;
  const baseSalaryTax = calculateTotalIncomeTax(salary);
  const totalTaxWithAward = calculateTotalIncomeTax(salary + taxableAmount);
  const estimatedTax = Math.max(0, Math.round(totalTaxWithAward - baseSalaryTax));
  const estimatedNet = effectiveGrossAward - estimatedTax;

  return {
    daysAwarded: cappedDays,
    weeksAwarded,
    weeklyGrossPay,
    solventAward,
    insolventAward,
    insolventShortfall,
    weeklyCapUsed,
    maxInsolvencyWeeks,
    isCollectiveThresholdMet,
    statutoryConsultationPeriod,
    taxFreeAmount,
    taxableAmount,
    estimatedTax,
    estimatedNet,
  };
}

/* ── NHS Agenda for Change & MARS Engine (AfC s.16 / s.17) ────────── */

export interface NhsExitParams {
  salary: number; // gross annual salary
  yearsOfService: number; // reckonable NHS continuous service
  exitType?: 'afc_redundancy' | 'mars' | 'statutory_only';
  customExGratia?: number; // any additional special severance payment
}

export interface NhsExitResult {
  monthlyGrossPay: number;
  monthsAwarded: number;
  grossAward: number;
  statutoryRedundancyEquivalent: number;
  afcEnhancement: number; // difference between AfC and statutory floor
  treasuryApprovalRequired: boolean; // true if any ex-gratia or package >= £100k
  requiresMinisterialApproval: boolean; // true if package >= £100k or salary >= £150k
  taxFreeAmount: number;
  taxableAmount: number;
  estimatedTax: number;
  estimatedNet: number;
}

export function calcNhsExit({
  salary,
  yearsOfService,
  exitType = 'afc_redundancy',
  customExGratia = 0,
}: NhsExitParams): NhsExitResult {
  const monthlyGrossPay = Math.round(salary / 12);
  const years = Math.max(0, Math.floor(yearsOfService));

  let monthsAwarded = 0;
  let basePayout = 0;

  if (exitType === 'afc_redundancy') {
    // AfC Section 16: minimum 2 years service, 1 month per year, max 24 months
    monthsAwarded = years >= 2 ? Math.min(years, 24) : 0;
    basePayout = Math.round(monthlyGrossPay * monthsAwarded);
  } else if (exitType === 'mars') {
    // AfC Section 17 MARS: 1 month per year, typically max 21 months
    monthsAwarded = years >= 1 ? Math.min(years, 21) : 0;
    basePayout = Math.round(monthlyGrossPay * monthsAwarded);
  } else {
    // Statutory only
    monthsAwarded = 0;
    basePayout = 0;
  }

  // Statutory redundancy benchmark for comparison (assuming mid-age multiplier 1.0)
  const statYears = Math.min(years, 20);
  const statutoryRedundancyEquivalent = Math.round(Math.min(salary / 52, WEEKLY_CAP_GB) * statYears);

  const grossAward = basePayout + customExGratia;
  const afcEnhancement = Math.max(0, grossAward - statutoryRedundancyEquivalent);

  // Treasury thresholds:
  // Any Special Severance Payment (ex-gratia) requires DHSC & Treasury sign-off.
  // Exit packages >= £100,000 or salary >= £150,000 require Ministerial approval.
  const requiresMinisterialApproval = grossAward >= 100000 || salary >= 150000;
  const treasuryApprovalRequired = requiresMinisterialApproval || customExGratia > 0;

  // Tax treatment under ITEPA 2003 s.403 (first £30,000 tax-free)
  const taxFreeAmount = Math.min(grossAward, TAX_FREE_FLOOR);
  const taxableAmount = Math.max(0, grossAward - TAX_FREE_FLOOR);
  const baseSalaryTax = calculateTotalIncomeTax(salary);
  const totalTaxWithExit = calculateTotalIncomeTax(salary + taxableAmount);
  const estimatedTax = Math.max(0, Math.round(totalTaxWithExit - baseSalaryTax));
  const estimatedNet = grossAward - estimatedTax;

  return {
    monthlyGrossPay,
    monthsAwarded,
    grossAward,
    statutoryRedundancyEquivalent,
    afcEnhancement,
    treasuryApprovalRequired,
    requiresMinisterialApproval,
    taxFreeAmount,
    taxableAmount,
    estimatedTax,
    estimatedNet,
  };
}

export interface PipExitParams {
  salary: number;
  yearsOfService: number;
  noticeWeeks?: number;
  pipStage?: 'pre_pip' | 'formal_pip' | 'final_warning';
  currentOffer?: number;
}

export interface PipExitResult {
  monthlyGrossPay: number;
  weeklyGrossPay: number;
  contractualNoticePay: number;
  hasUnfairDismissalRights: boolean;
  processCostAvoidanceMin: number;
  processCostAvoidanceMax: number;
  benchmarkedExGratiaMin: number;
  benchmarkedExGratiaMax: number;
  recommendedSettlementTarget: number;
  taxFreeExGratia: number;
  taxableNotice: number;
  estimatedNet: number;
  legalFeeTarget: number;
}

export function calcPipExit({
  salary,
  yearsOfService,
  noticeWeeks,
  pipStage = 'formal_pip',
  currentOffer = 0,
}: PipExitParams): PipExitResult {
  const monthlyGrossPay = Math.round(salary / 12);
  const weeklyGrossPay = Math.round(salary / 52);
  const years = Math.max(0, Math.floor(yearsOfService));

  // Statutory notice (ERA 1996 s.86) vs contractual notice
  const statutoryNoticeWeeks = years < 1 ? 1 : Math.min(years, 12);
  const effectiveNoticeWeeks = noticeWeeks && noticeWeeks > 0 ? noticeWeeks : statutoryNoticeWeeks;
  const contractualNoticePay = Math.round(weeklyGrossPay * effectiveNoticeWeeks);

  // Unfair dismissal protection under ERA 1996 s.108 requires 2 complete years
  const hasUnfairDismissalRights = years >= 2;

  // PIP Process cost avoidance for employer:
  // Running a 60-90 day PIP involves management time, HR hours, and salary during the procedure.
  const stageMultiplier = pipStage === 'final_warning' ? 1.0 : pipStage === 'formal_pip' ? 2.0 : 2.5;
  const processCostAvoidanceMin = Math.round(monthlyGrossPay * (stageMultiplier * 0.75));
  const processCostAvoidanceMax = Math.round(monthlyGrossPay * (stageMultiplier * 1.25));

  // Commercial ex-gratia benchmark range:
  // With unfair dismissal rights: 2 to 3.5 months' pay. Without: 1 to 2 months' pay.
  const exGratiaMonthsMin = hasUnfairDismissalRights ? 2.0 : 1.0;
  const exGratiaMonthsMax = hasUnfairDismissalRights ? 3.5 : 2.0;

  const benchmarkedExGratiaMin = Math.round(monthlyGrossPay * exGratiaMonthsMin);
  const benchmarkedExGratiaMax = Math.round(monthlyGrossPay * exGratiaMonthsMax);

  // Recommended settlement package (Notice + Ex-Gratia median)
  const recommendedSettlementTarget = contractualNoticePay + Math.round((benchmarkedExGratiaMin + benchmarkedExGratiaMax) / 2);

  // Tax treatment: Notice is 100% taxable (ITEPA s.402D), ex-gratia is tax-free up to £30k (s.403)
  const targetExGratia = Math.max(0, recommendedSettlementTarget - contractualNoticePay);
  const taxFreeExGratia = Math.min(targetExGratia, TAX_FREE_FLOOR);
  const taxableExGratia = Math.max(0, targetExGratia - TAX_FREE_FLOOR);
  const totalTaxable = contractualNoticePay + taxableExGratia;

  const baseTax = calculateTotalIncomeTax(salary);
  const totalTax = calculateTotalIncomeTax(salary + totalTaxable);
  const estimatedTax = Math.max(0, Math.round(totalTax - baseTax));
  const estimatedNet = recommendedSettlementTarget - estimatedTax;

  const legalFeeTarget = hasUnfairDismissalRights ? 750 : 500;

  return {
    monthlyGrossPay,
    weeklyGrossPay,
    contractualNoticePay,
    hasUnfairDismissalRights,
    processCostAvoidanceMin,
    processCostAvoidanceMax,
    benchmarkedExGratiaMin,
    benchmarkedExGratiaMax,
    recommendedSettlementTarget,
    taxFreeExGratia,
    taxableNotice: contractualNoticePay,
    estimatedNet,
    legalFeeTarget,
  };
}

