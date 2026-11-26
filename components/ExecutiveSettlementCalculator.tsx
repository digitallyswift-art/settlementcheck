'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates'
import { calculateTotalIncomeTax, calcPensionSacrifice } from '@/lib/calculations'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'

function formatGBP(n: number): string {
  return `£${Math.round(n).toLocaleString('en-GB')}`
}

const EXEC_CLAUSES = [
  { id: 'bonus', label: 'Deferred Bonus / Commission / LTIPs' },
  { id: 'equity', label: 'Unvested RSUs / Good Leaver Equity' },
  { id: 'garden', label: 'Garden Leave & Notice Acceleration' },
  { id: 'covenants', label: 'Non-Compete & Restrictive Covenants' },
  { id: 'fca', label: 'FCA / SMCR Regulatory Reference' },
  { id: 'director', label: 'Companies Act s.217 / D&O Run-Off' },
]

export function ExecutiveSettlementCalculator() {
  const [salaryInput, setSalaryInput] = useState<string>('140000')
  const [exGratiaInput, setExGratiaInput] = useState<string>('75000')
  const [pilonInput, setPilonInput] = useState<string>('35000')
  const [pensionSacrificeInput, setPensionSacrificeInput] = useState<string>('20000')
  const [selectedClauses, setSelectedClauses] = useState<string[]>(['bonus', 'covenants', 'fca'])

  const salary = Math.max(0, parseFloat(salaryInput.replace(/[^0-9.]/g, '')) || 0)
  const exGratia = Math.max(0, parseFloat(exGratiaInput.replace(/[^0-9.]/g, '')) || 0)
  const pilon = Math.max(0, parseFloat(pilonInput.replace(/[^0-9.]/g, '')) || 0)
  const rawPension = Math.max(0, parseFloat(pensionSacrificeInput.replace(/[^0-9.]/g, '')) || 0)

  const calc = useMemo(() => {
    const taxFreeLimit = STATUTORY_RATES_2026_27.taxFreeLimit
    const taxFreePortion = Math.min(exGratia, taxFreeLimit)
    const grossExcess = Math.max(0, exGratia - taxFreeLimit)
    const pensionContribution = Math.min(rawPension, grossExcess)
    const taxableExcess = Math.max(0, grossExcess - pensionContribution)

    // Progressive income tax using lib/calculations.ts (handles £12,570 PA, £100k-£125,140 60% taper, and 45% additional rate)
    const baseSalaryTax = calculateTotalIncomeTax(salary)
    const taxWithExGratia = calculateTotalIncomeTax(salary + taxableExcess)
    const excessIncomeTax = Math.max(0, Math.round(taxWithExGratia - baseSalaryTax))

    const taxWithPilon = calculateTotalIncomeTax(salary + taxableExcess + pilon)
    const pilonIncomeTax = Math.max(0, Math.round(taxWithPilon - taxWithExGratia))
    const empNicRate = salary > 50270 ? 0.02 : 0.08
    const pilonTaxEstimate = pilonIncomeTax + Math.round(pilon * empNicRate)

    const pensionTaxSaved = calcPensionSacrifice(grossExcess, pensionContribution, salary + pilon).taxSaved
    const employerClass1ANic = taxableExcess * STATUTORY_RATES_2026_27.employerClass1ANICRate

    const totalCashGross = exGratia + pilon
    const netCashTakeHome = Math.max(0, totalCashGross - pensionContribution - excessIncomeTax - pilonTaxEstimate)

    return {
      taxFreePortion,
      grossExcess,
      pensionContribution,
      taxableExcess,
      excessIncomeTax,
      pilonTaxEstimate,
      pensionTaxSaved,
      employerClass1ANic,
      totalCashGross,
      netCashTakeHome,
    }
  }, [salary, exGratia, pilon, rawPension])

  const toggleClause = (id: string) => {
    setSelectedClauses((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCCE] pb-3 mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold">
          Senior &amp; City Exit Tax Modeller • ITEPA 2003 s.403 &amp; s.408
        </span>
        <span className="text-xs text-[#0B1F3A]/70 font-mono">
          2026/27 Marginal &amp; Class 1A NIC (15.0%)
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A] mb-2">
        Executive &amp; Financial Services Settlement Calculator
      </h3>
      <p className="text-body text-[#0B1F3A]/80 mb-6 leading-relaxed">
        Model settlement packages above the £30,000 tax-free threshold, including PILON/PENP notice pay, pension contribution savings (s.408), and City/Canary Wharf exit clauses.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="exec-salary" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Base Annual Salary (£)
            </label>
            <input
              id="exec-salary"
              type="text"
              inputMode="numeric"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label htmlFor="exec-exgratia" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Ex-Gratia &amp; Redundancy Compensation (£)
            </label>
            <input
              id="exec-exgratia"
              type="text"
              inputMode="numeric"
              value={exGratiaInput}
              onChange={(e) => setExGratiaInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label htmlFor="exec-pilon" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Contractual Notice / PILON / PENP (£)
            </label>
            <input
              id="exec-pilon"
              type="text"
              inputMode="numeric"
              value={pilonInput}
              onChange={(e) => setPilonInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label htmlFor="exec-pension" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Taxable Excess Redirected to Pension (s.408 ITEPA) (£)
            </label>
            <input
              id="exec-pension"
              type="text"
              inputMode="numeric"
              value={pensionSacrificeInput}
              onChange={(e) => setPensionSacrificeInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
            <p className="text-[11px] text-[#0B1F3A]/65 mt-1">
              Subject to UK annual pension allowance (£60,000 standard, tapered down to £10,000 above £260,000 adjusted income) and carry-forward rules. Personal-allowance tapering (£100k–£125,140) and Scottish tax bands may also affect marginal rates.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="bg-[#0B1F3A] text-white rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
              Illustrative Executive Breakdown
            </span>
            <div className="flex justify-between items-baseline border-b border-white/15 pb-2">
              <span className="text-sm text-white/80">Estimated Net Cash Take-Home</span>
              <span className="text-2xl font-serif font-bold text-white">{formatGBP(calc.netCashTakeHome)}</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/75">Tax-Free Exemption (s.403)</span>
                <span className="font-mono font-semibold">{formatGBP(calc.taxFreePortion)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Taxable Excess Above £30k</span>
                <span className="font-mono font-semibold">{formatGBP(calc.taxableExcess)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Progressive Income Tax on Excess (0% Emp NIC)</span>
                <span className="font-mono text-[#F7B29B]">-{formatGBP(calc.excessIncomeTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Est. Tax &amp; NIC on PILON/PENP</span>
                <span className="font-mono text-[#F7B29B]">-{formatGBP(calc.pilonTaxEstimate)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/15">
                <span className="text-white/85">Directed to Pension (s.408)</span>
                <span className="font-mono font-semibold">{formatGBP(calc.pensionContribution)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Illustrative Income Tax Saved</span>
                <span className="font-mono font-semibold text-[#F7B29B]">{formatGBP(calc.pensionTaxSaved)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/65">Employer Class 1A NIC Cost (15.0%)</span>
                <span className="font-mono text-white/80">{formatGBP(calc.employerClass1ANic)}</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 space-y-2">
            <Link
              href={`/get-matched/?salary=${salary}&offer=${exGratia + pilon}&reason=executive`}
              className="btn-accent w-full text-center block"
            >
              Speak with a senior exit solicitor →
            </Link>
            <p className="text-[11px] text-white/65 leading-relaxed m-0">
              Employers standardly contribute £750 to £2,500+ plus VAT for executive reviews upon completion; excess or abortive work depends on solicitor terms.
            </p>
          </div>
        </div>
      </div>

      {/* City & Executive Clause Checklist */}
      <div className="mt-6 pt-6 border-t border-[#E2DCCE]">
        <h4 className="text-sm font-bold text-[#0B1F3A] uppercase tracking-wider mb-3">
          High-Value Executive &amp; Financial Services Clauses to Flag for Review
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {EXEC_CLAUSES.map((clause) => {
            const active = selectedClauses.includes(clause.id)
            return (
              <button
                key={clause.id}
                type="button"
                onClick={() => toggleClause(clause.id)}
                className={`text-left px-3.5 py-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]/40'
                }`}
              >
                {active ? '✓ ' : '+ '}
                {clause.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <MandatoryLegalDisclaimers />
      </div>
    </div>
  )
}
