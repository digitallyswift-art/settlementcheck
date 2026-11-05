'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { calculatePenp, type PenpCalculationResult } from '@/lib/penp-calculator'

function formatGBP(val: number): string {
  return `£${Math.round(val).toLocaleString('en-GB')}`
}

function InfoPill({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="my-2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 text-xs text-[#5B6577] hover:text-[#0B1F3A] font-medium underline underline-offset-2 cursor-pointer bg-transparent border-0 p-0 transition-colors"
      >
        <span>ℹ️</span> {label} {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-lg text-xs leading-relaxed text-[#4A5568]">
          {children}
        </div>
      )}
    </div>
  )
}

export function PenpCalculator() {
  const [salary, setSalary] = useState<string>('60000')
  const [noticeValue, setNoticeValue] = useState<string>('3')
  const [noticeUnit, setNoticeUnit] = useState<'months' | 'weeks'>('months')
  const [unworkedValue, setUnworkedValue] = useState<string>('3')
  const [contractualPilonTaxed, setContractualPilonTaxed] = useState<string>('0')
  const [totalOffer, setTotalOffer] = useState<string>('25000')

  const parsedSalary = Math.max(0, parseFloat(salary.replace(/[^0-9.]/g, '')) || 0)
  const parsedNoticeValue = Math.max(0, parseInt(noticeValue.replace(/[^0-9]/g, ''), 10) || 0)
  const parsedUnworkedValue = Math.max(0, parseInt(unworkedValue.replace(/[^0-9]/g, ''), 10) || 0)
  const parsedPilonTaxed = Math.max(0, parseFloat(contractualPilonTaxed.replace(/[^0-9.]/g, '')) || 0)
  const parsedTotalOffer = Math.max(0, parseFloat(totalOffer.replace(/[^0-9.]/g, '')) || 0)

  const result: PenpCalculationResult = useMemo(() => {
    return calculatePenp({
      salaryAnnual: parsedSalary,
      noticeMonthsOrWeeks: parsedNoticeValue,
      noticeUnit,
      unworkedNoticeMonthsOrWeeks: parsedUnworkedValue,
      taxableNoticeAlreadyPaid: parsedPilonTaxed,
      totalSettlementOffer: parsedTotalOffer,
    })
  }, [parsedSalary, parsedNoticeValue, noticeUnit, parsedUnworkedValue, parsedPilonTaxed, parsedTotalOffer])

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCCE] pb-3 mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold block">
          HMRC Statutory Tax Engine • ITEPA 2003 s.402D
        </span>
        <span className="text-xs text-[#0B1F3A]/70 font-mono">
          EIM12800 Statutory Formula
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A] mb-2">
        Post-Employment Notice Pay (PENP) Calculator
      </h3>
      <p className="text-xs sm:text-sm text-[#0B1F3A]/80 mb-2 leading-relaxed">
        Statutory partitioning of termination payments into 100% taxable notice earnings (PENP) versus genuine tax-exempt ex-gratia compensation under Section 403.
      </p>

      <InfoPill label="Statutory formula under Section 402D ITEPA 2003">
        Post-Employment Notice Pay (PENP) is calculated using the statutory formula: <code>((BP × D) / P) - T</code>. Basic Pay (BP) represents pre-termination contractual salary excluding bonuses, D represents unworked notice days, P represents the pay period days (30.42 days for monthly salaried staff), and T represents contractual notice already paid and taxed. PENP must be subjected to PAYE and Class 1 National Insurance before any remaining sums qualify for the £30,000 exemption under Section 403.
      </InfoPill>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="penp-salary" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Gross Annual Salary (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 font-bold">£</span>
              <input
                id="penp-salary"
                type="text"
                inputMode="numeric"
                value={salary}
                onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['35000', '55000', '75000', '100000'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalary(val)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                    salary === val
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                      : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
                  }`}
                >
                  £{parseInt(val).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="penp-notice" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Contractual Notice ({noticeUnit})
              </label>
              <input
                id="penp-notice"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={noticeValue}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                  if (clean.length <= 2) {
                    setNoticeValue(clean)
                    const numN = parseInt(clean, 10) || 0
                    const numU = parseInt(unworkedValue, 10) || 0
                    if (numN > 0 && numU > numN) setUnworkedValue(clean)
                  }


                }}
                className="w-full p-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label htmlFor="penp-unit" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Notice Unit
              </label>
              <select
                id="penp-unit"
                value={noticeUnit}
                onChange={(e) => setNoticeUnit(e.target.value as 'months' | 'weeks')}
                className="w-full p-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              >
                <option value="months">Months</option>
                <option value="weeks">Weeks</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="penp-unworked" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Notice Period Unworked ({noticeUnit})
            </label>
            <input
              id="penp-unworked"
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={unworkedValue}
              onChange={(e) => {
                const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                if (clean.length <= 2) setUnworkedValue(clean)
              }}
              className="w-full p-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
            <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
              {parsedUnworkedValue >= parsedNoticeValue ? 'Full notice unworked (standard PILON / immediate exit)' : `${Math.max(0, parsedNoticeValue - parsedUnworkedValue)} ${noticeUnit} worked; ${parsedUnworkedValue} unworked`}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="penp-offer" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Total Proposed Settlement Offer (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 font-bold">£</span>
              <input
                id="penp-offer"
                type="text"
                inputMode="numeric"
                value={totalOffer}
                onChange={(e) => setTotalOffer(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
              Gross total settlement sum offered by employer (including notice and compensation)
            </span>
          </div>

          <div>
            <label htmlFor="penp-taxed" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Contractual PILON Already Taxed (T) (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 font-bold">£</span>
              <input
                id="penp-taxed"
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={contractualPilonTaxed}
                onChange={(e) => setContractualPilonTaxed(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
              Enter any contractual notice pay already processed through payroll with PAYE deductions
            </span>
          </div>

          <InfoPill label="HMRC Basic Pay (BP) rules under EIM12830">
            Basic Pay excludes discretionary bonuses, performance commission, benefits in kind, and overtime. If salary sacrifice arrangements apply (e.g. pension contributions), the post-sacrifice basic salary is standardly used unless pre-sacrifice basic pay is contractually defined.
          </InfoPill>
        </div>
      </div>

      {/* Statutory Formula Explanation Box */}
      <div className="p-3.5 bg-[#F0F5FA] border border-[#C4D8EC] rounded-xl text-xs font-mono text-[#0B1F3A] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#0B1F3A]/70 block">
            Statutory Formula Execution:
          </span>
          <span className="font-bold">{result.formulaExplanation}</span>
        </div>
        <span className="text-[11px] text-[#0B1F3A]/70 font-sans">
          ITEPA 2003 s.402D
        </span>
      </div>

      {/* Primary Partitioning Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#FEFBF0] p-4 rounded-xl border border-[#E0CB94]">
          <span className="text-xs text-[#7A5B15] uppercase tracking-wider block mb-1">
            1. Taxable PENP (s.402D)
          </span>
          <span className="text-2xl font-serif font-bold text-[#0B1F3A] block">
            {formatGBP(result.statutoryPenp)}
          </span>
          <span className="text-[11px] text-[#7A5B15] mt-1 block">
            100% Taxable (PAYE &amp; NICs)
          </span>
        </div>

        <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
          <span className="text-xs text-[#0B1F3A]/70 uppercase tracking-wider block mb-1">
            2. Tax-Free Ex-Gratia (s.403)
          </span>
          <span className="text-2xl font-serif font-bold text-[#D9603B] block">
            {formatGBP(result.taxFreeExGratia)}
          </span>
          <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
            0% Income Tax &amp; 0% NICs
          </span>
        </div>

        <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
          <span className="text-xs text-[#0B1F3A]/70 uppercase tracking-wider block mb-1">
            3. Taxable Ex-Gratia Excess
          </span>
          <span className="text-2xl font-serif font-bold text-[#0B1F3A] block">
            {formatGBP(result.taxableExGratiaExcess)}
          </span>
          <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
            {result.taxableExGratiaExcess > 0 ? 'Taxable over £30k (no emp NIC)' : '£0 (Within £30k limit)'}
          </span>
        </div>

        <div className="bg-[#F0F5FA] p-4 rounded-xl border border-[#C4D8EC]">
          <span className="text-xs text-[#0B1F3A]/70 uppercase tracking-wider block mb-1">
            4. Est. Net Take-Home
          </span>
          <span className="text-2xl font-serif font-bold text-[#0B1F3A] block">
            {formatGBP(result.estimatedNetProceeds)}
          </span>
          <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
            Deductions: ~{formatGBP(result.estimatedTaxDeduction + result.estimatedEmployeeNic)}
          </span>
        </div>
      </div>

      {/* Tax Liability Breakdown Note */}
      <div className="bg-[#F7F4EE] border border-[#E2DCCE] rounded-xl p-4 sm:p-5 mb-6 text-xs text-[#0B1F3A]/85 leading-relaxed">
        <strong className="text-[#0B1F3A] block mb-1">National Insurance &amp; Tax Boundary Analysis:</strong>
        Under Section 402D ITEPA 2003, Post-Employment Notice Pay of <strong>{formatGBP(result.statutoryPenp)}</strong> is treated as general earnings. It attracts employee Class 1 National Insurance and employer Class 1 NICs (15.0% for 2026/27). In contrast, the ex-gratia compensation of <strong>{formatGBP(result.taxFreeExGratia)}</strong> is exempt under Section 403. Any ex-gratia sums exceeding £30,000 attract employer Class 1A NICs and employee income tax, but are exempt from employee Class 1 NICs.
      </div>

      {/* CTA Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1F3A] text-white p-5 rounded-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#D9603B] font-semibold block">
            Independent SRA Solicitor Review • Employer Fee Contribution
          </span>
          <h4 className="text-base sm:text-lg font-serif font-bold text-white m-0">
            Have an SRA Solicitor Review Your PENP Clause
          </h4>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Link
            href={`/calculator/?salary=${parsedSalary}&notice=${noticeValue}&offer=${parsedTotalOffer}`}
            className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap text-center border border-white/20"
          >
            Model full breakdown →
          </Link>
          <Link
            href={`/get-matched/?salary=${parsedSalary}&offer=${parsedTotalOffer}&reason=redundancy`}
            className="px-5 py-3 bg-[#D9603B] hover:bg-[#D9603B]/90 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm text-center"
          >
            Match with an SRA solicitor →
          </Link>
        </div>
      </div>
    </div>
  )
}
