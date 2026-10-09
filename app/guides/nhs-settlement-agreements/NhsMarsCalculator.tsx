'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { calcNhsExit, type NhsExitResult } from '@/lib/calculations'

function formatCurrency(n: number): string {
  return '£' + Math.round(n).toLocaleString('en-GB')
}

export default function NhsMarsCalculator() {
  const [salaryInput, setSalaryInput] = useState<string>('37000')
  const [yearsInput, setYearsInput] = useState<number>(8)
  const [scheme, setScheme] = useState<'afc_redundancy' | 'mars'>('afc_redundancy')

  const salaryNum = useMemo(() => {
    const parsed = parseFloat(salaryInput.replace(/[^0-9.]/g, ''))
    return isNaN(parsed) || parsed < 0 ? 0 : parsed
  }, [salaryInput])

  const result: NhsExitResult = useMemo(() => {
    return calcNhsExit({
      salary: salaryNum,
      yearsOfService: yearsInput,
      exitType: scheme,
    })
  }, [salaryNum, yearsInput, scheme])

  return (
    <div className="rounded-2xl border-2 border-coral/30 bg-paper p-6 md:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b border-rule pb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FBF0EE] text-[#A8341F]">
          Interactive Calculator
        </span>
        <span className="text-xs font-semibold text-muted">
          Agenda for Change Section 16 &amp; 17
        </span>
      </div>

      <h3 className="text-xl font-bold text-ink mb-1">
        NHS Redundancy &amp; MARS Payout Calculator
      </h3>
      <p className="text-xs text-muted mb-6 leading-relaxed">
        Estimate your contractual redundancy or voluntary MARS payout under NHS Agenda for Change terms.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Controls */}
        <div className="flex flex-col gap-5">
          {/* Annual Salary */}
          <div>
            <label htmlFor="nhs-salary" className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Annual NHS Gross Salary (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold text-base">£</span>
              <input
                id="nhs-salary"
                type="text"
                inputMode="numeric"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value)}
                placeholder="e.g. 37000"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-rule bg-white text-ink text-sm font-semibold focus:outline-none focus:border-coral transition-colors"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { label: 'Band 5 (£30k)', val: '30000' },
                { label: 'Band 6 (£37k)', val: '37000' },
                { label: 'Band 7 (£46k)', val: '46000' },
                { label: 'Band 8a (£53k)', val: '53000' },
              ].map(({ label, val }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalaryInput(val)}
                  className={`text-[11px] px-2 py-1 rounded-md border transition-colors ${
                    salaryInput === val
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white text-muted border-rule hover:text-ink'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Scheme Selection */}
          <div>
            <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
              Exit Scheme Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScheme('afc_redundancy')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  scheme === 'afc_redundancy'
                    ? 'border-coral bg-[#FFF7F4] shadow-sm'
                    : 'border-rule bg-white hover:border-rule-strong'
                }`}
              >
                <span className="block font-bold text-xs text-ink mb-0.5">AfC Redundancy</span>
                <span className="block text-[11px] text-muted">Section 16 (Max 24 mos)</span>
              </button>
              <button
                type="button"
                onClick={() => setScheme('mars')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  scheme === 'mars'
                    ? 'border-coral bg-[#FFF7F4] shadow-sm'
                    : 'border-rule bg-white hover:border-rule-strong'
                }`}
              >
                <span className="block font-bold text-xs text-ink mb-0.5">MARS Voluntary</span>
                <span className="block text-[11px] text-muted">Section 17 (Max 21 mos)</span>
              </button>
            </div>
          </div>

          {/* Reckonable Service Years */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="service-years" className="text-xs font-bold text-ink uppercase tracking-wider">
                Reckonable NHS Service ({yearsInput} Years)
              </label>
              <span className="text-[11px] text-muted font-medium">
                {scheme === 'afc_redundancy' ? 'Capped at 24 months' : 'Capped at 21 months'}
              </span>
            </div>
            <input
              id="service-years"
              type="range"
              min="1"
              max="25"
              step="1"
              value={yearsInput}
              onChange={(e) => setYearsInput(parseInt(e.target.value, 10))}
              className="w-full accent-coral cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-muted mt-1">
              <span>1 year</span>
              <span>5 years</span>
              <span>10 years</span>
              <span>20+ years</span>
            </div>
            {yearsInput < 2 && scheme === 'afc_redundancy' && (
              <p className="text-[11px] text-[#A8341F] mt-1.5 leading-snug">
                Note: AfC Section 16 requires a minimum of 2 continuous years of NHS service to qualify for redundancy pay.
              </p>
            )}
          </div>
        </div>

        {/* Live Output Card */}
        <div className="bg-white rounded-xl border border-rule p-5 flex flex-col gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">
              Estimated Gross Exit Payout
            </span>
            <div className="text-3xl font-extrabold text-ink tracking-tight mb-0.5">
              {formatCurrency(result.grossAward)}
            </div>
            <span className="text-xs text-muted block">
              Equivalent to {result.monthsAwarded} months of basic pay ({formatCurrency(result.monthlyGrossPay)}/month).
            </span>
          </div>

          <div className="border-t border-rule pt-3 flex flex-col gap-2 text-xs">
            <div className="flex justify-between py-1 border-b border-rule/60">
              <span className="text-muted">AfC Contractual Entitlement</span>
              <span className="font-bold text-ink">{result.monthsAwarded} months</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule/60">
              <span className="text-muted">Statutory Redundancy Floor</span>
              <span className="font-bold text-muted">{formatCurrency(result.statutoryRedundancyEquivalent)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule/60">
              <span className="text-muted">AfC Contractual Uplift</span>
              <span className="font-bold text-coral">+{formatCurrency(result.afcEnhancement)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-rule/60">
              <span className="text-muted">Tax Exemption (s.403 ITEPA)</span>
              <span className="font-bold text-ink">
                {result.taxableAmount === 0 ? '100% Tax-Free' : `${formatCurrency(result.taxFreeAmount)} Tax-Free`}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted">Employee National Insurance</span>
              <span className="font-bold text-ink">0% NI Deductions</span>
            </div>
          </div>

          {/* HM Treasury Approval Indicator */}
          {result.requiresMinisterialApproval ? (
            <div className="p-3 rounded-lg bg-[#FFF2EE] border border-coral/30 text-xs text-[#A8341F] leading-relaxed">
              <strong>Treasury Threshold:</strong> This package equals or exceeds £100,000 (or salary exceeds £150,000). It requires formal approval from HM Treasury and DHSC Ministers before execution.
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-paper border border-rule text-xs text-muted leading-relaxed">
              <strong>Approval Status:</strong> Under £100,000 threshold. Standard NHS trust governance applies without requiring separate Ministerial approval.
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/settlement-agreement-review/"
              className="w-full py-2.5 px-3 rounded-lg bg-coral text-white font-bold text-xs text-center hover:bg-[#c24f2d] transition-colors"
            >
              Review my draft NHS agreement clauses →
            </Link>
            <Link
              href="/get-matched/"
              className="w-full py-2 px-3 rounded-lg border border-rule bg-white text-ink font-semibold text-xs text-center hover:bg-paper transition-colors"
            >
              Match with an NHS specialist solicitor →
            </Link>
            <p className="text-[11px] text-center text-muted leading-tight">
              Your NHS trust pays £350 to £750 + VAT directly to your solicitor. Free independent review to you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
