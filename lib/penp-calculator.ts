/**
 * Deterministic Post-Employment Notice Pay (PENP) Engine
 * Implements ITEPA 2003 s.402D and HMRC Employment Income Manual (EIM12800–EIM14000).
 *
 * Statutory Formula:
 *   PENP = ((BP * D) / P) - T
 *
 * Where:
 *   BP = Basic Pay in the pay period immediately prior to the trigger date
 *   D  = Days in the post-employment notice period (unworked notice days)
 *   P  = Number of days in the calculation pay period (e.g. 30.42 for monthly, 7 for weekly)
 *   T  = Amounts paid on termination already subject to income tax and NICs (e.g. contractual PILON)
 */

export interface PenpCalculationInput {
  salaryAnnual: number
  basicPayMonthly?: number
  noticeMonthsOrWeeks: number
  noticeUnit: 'months' | 'weeks'
  unworkedNoticeMonthsOrWeeks?: number
  taxableNoticeAlreadyPaid?: number // T
  totalSettlementOffer?: number
}

export interface PenpCalculationResult {
  basicPay: number // BP
  unworkedDays: number // D
  periodDays: number // P
  taxableDeductions: number // T
  rawPenp: number
  statutoryPenp: number // max(0, round(rawPenp))
  totalSettlementOffer: number
  taxFreeExGratia: number // up to £30k under s.403
  taxableExGratiaExcess: number // amounts > £30k
  totalTaxablePortion: number // statutoryPenp + taxableExGratiaExcess
  totalTaxFreePortion: number // taxFreeExGratia
  estimatedTaxDeduction: number
  estimatedEmployeeNic: number
  estimatedNetProceeds: number
  formulaExplanation: string
  statutoryCitations: string[]
}

/**
 * Calculates Post-Employment Notice Pay (PENP) under Section 402D ITEPA 2003.
 */
export function calculatePenp(input: PenpCalculationInput): PenpCalculationResult {
  const salary = Math.max(0, input.salaryAnnual || 0)
  const basicPayMonthly = input.basicPayMonthly && input.basicPayMonthly > 0
    ? input.basicPayMonthly
    : salary > 0 ? salary / 12 : 0

  const noticeUnit = input.noticeUnit || 'months'
  const totalNoticeUnits = Math.max(0, input.noticeMonthsOrWeeks || 0)

  // Unworked notice units default to full notice if unworked notice is not specified
  const unworkedUnits = input.unworkedNoticeMonthsOrWeeks !== undefined
    ? Math.max(0, input.unworkedNoticeMonthsOrWeeks)
    : totalNoticeUnits

  // Convert notice to days (D)
  // Monthly uses 30.42 days per month; weekly uses 7 days per week
  const unworkedDays = noticeUnit === 'months'
    ? Math.round(unworkedUnits * 30.42)
    : Math.round(unworkedUnits * 7)

  // Pay period days (P)
  const periodDays = noticeUnit === 'months' ? 30.42 : 7
  const basicPayPeriod = noticeUnit === 'months' ? basicPayMonthly : salary / 52

  // Deductions (T) - amounts already paid and taxed as earnings on termination
  const taxableDeductions = Math.max(0, input.taxableNoticeAlreadyPaid || 0)

  // Statutory formula: ((BP * D) / P) - T
  const rawPenp = periodDays > 0
    ? ((basicPayPeriod * unworkedDays) / periodDays) - taxableDeductions
    : 0

  const statutoryPenp = Math.max(0, Math.round(rawPenp))

  // Settlement Offer Partitioning
  const totalOffer = input.totalSettlementOffer !== undefined && input.totalSettlementOffer > 0
    ? input.totalSettlementOffer
    : statutoryPenp + Math.round((salary / 12) * 2) // default illustrative ex-gratia

  // Ex-gratia balance after carving out taxable PENP
  const exGratiaBalance = Math.max(0, totalOffer - statutoryPenp)
  const taxFreeExGratia = Math.min(30000, exGratiaBalance)
  const taxableExGratiaExcess = Math.max(0, exGratiaBalance - 30000)

  const totalTaxablePortion = statutoryPenp + taxableExGratiaExcess
  const totalTaxFreePortion = taxFreeExGratia

  // Estimated Tax deductions (using 2026/27 England & Wales tax bands)
  // Higher earners standardly face 40% marginal rate, basic rate 20%
  const marginalTaxRate = salary > 50270 ? 0.40 : 0.20
  const estimatedTaxDeduction = Math.round(totalTaxablePortion * marginalTaxRate)

  // Employee Class 1 NICs (only applies to earnings / PENP, NOT to s.403 ex-gratia excess)
  const nicRate = salary > 50270 ? 0.02 : 0.08
  const estimatedEmployeeNic = Math.round(statutoryPenp * nicRate)

  const estimatedNetProceeds = Math.max(0, totalOffer - estimatedTaxDeduction - estimatedEmployeeNic)

  const formulaExplanation = `((£${Math.round(basicPayPeriod).toLocaleString('en-GB')} BP × ${unworkedDays} D) / ${periodDays} P) - £${Math.round(taxableDeductions).toLocaleString('en-GB')} T = £${statutoryPenp.toLocaleString('en-GB')}`

  const statutoryCitations = [
    'Income Tax (Earnings and Pensions) Act 2003, Section 402D (Statutory PENP formula)',
    'Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 termination exemption)',
    'HMRC Employment Income Manual, Sections EIM12800 to EIM14000',
    'Employment Rights Act 1996, Section 86 (Statutory notice minimums)',
  ]

  return {
    basicPay: Math.round(basicPayPeriod),
    unworkedDays,
    periodDays,
    taxableDeductions,
    rawPenp,
    statutoryPenp,
    totalSettlementOffer: totalOffer,
    taxFreeExGratia,
    taxableExGratiaExcess,
    totalTaxablePortion,
    totalTaxFreePortion,
    estimatedTaxDeduction,
    estimatedEmployeeNic,
    estimatedNetProceeds,
    formulaExplanation,
    statutoryCitations,
  }
}
