'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { calcRedundancy, formatCurrency, WEEKLY_CAP_GB } from '@/lib/calculations'

export interface StatutoryPill {
  label: string
  value: string
  statute: string
}

export interface EmbeddedCalculatorCardProps {
  badge?: string
  title?: string
  subtitle?: string
  disputeType?: string
  statutoryPills?: StatutoryPill[]
  initialSalary?: number
  initialYears?: number
  initialAge?: number
  ctaText?: string
}

const DEFAULT_PILLS: StatutoryPill[] = [
  { label: 'Weekly Cap', value: '£751/week', statute: 'SI 2026/310' },
  { label: 'Tax-Free Shield', value: '£30,000', statute: 'ITEPA 2003 s.403' },
  { label: 'Independent Legal Advice', value: 'Capped Fee Contribution', statute: 'Commercial Standard' },
]

export default function EmbeddedCalculatorCard({
  badge = 'Interactive Statutory Check',
  title = 'Check Your Settlement Offer Against April 2026 Statutory Limits',
  subtitle = 'Evaluate statutory redundancy, notice pay, and tax-free exit compensation before signing.',
  disputeType = 'general',
  statutoryPills = DEFAULT_PILLS,
  initialSalary = 45000,
  initialYears = 4,
  initialAge = 38,
  ctaText = 'Calculate My Complete Settlement Package →',
}: EmbeddedCalculatorCardProps) {
  const [salary, setSalary] = useState<number>(initialSalary)
  const [years, setYears] = useState<number>(initialYears)
  const [age, setAge] = useState<number>(initialAge)

  const srp = useMemo(() => {
    return calcRedundancy(salary, years * 12, age, WEEKLY_CAP_GB)
  }, [salary, years, age])

  const typicalLow = useMemo(() => {
    // 1 month gross + SRP
    const monthlyGross = Math.round(salary / 12)
    return Math.max(srp, monthlyGross + srp)
  }, [salary, srp])

  const typicalHigh = useMemo(() => {
    // 3 months gross + SRP
    const threeMonthsGross = Math.round((salary / 12) * 3)
    return Math.max(typicalLow, threeMonthsGross + srp)
  }, [salary, srp, typicalLow])

  const calculatorQuery = useMemo(() => {
    const params = new URLSearchParams()
    if (salary > 0) params.set('salary', String(salary))
    if (years > 0) params.set('tenure', String(years))
    if (age > 0) params.set('age', String(age))
    if (disputeType) params.set('dispute', disputeType)
    return `/calculator/?${params.toString()}`
  }, [salary, years, age, disputeType])

  return (
    <aside
      aria-label="Embedded Settlement Calculator"
      className="my-8 rounded-2xl border border-rule-strong bg-[#FDFBF7] p-5 sm:p-7 shadow-sm transition-all"
      style={{
        boxShadow: '0 4px 20px -4px rgba(11,31,58,0.06)',
      }}
    >
      <div className="flex flex-col gap-5">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rule pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-[0.12em] font-bold text-coral">
              {badge}
            </span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted bg-white/70 px-2.5 py-1 rounded-full border border-rule">
            Updated for April 2026 Statutory Rates (£751 Cap)
          </span>
        </div>

        {/* Title and Subtitle */}
        <div>
          <h3 className="font-serif text-[20px] sm:text-[23px] font-bold text-ink leading-tight m-0">
            {title}
          </h3>
          <p className="text-[13px] sm:text-[14px] text-muted leading-relaxed mt-1.5 mb-0">
            {subtitle}
          </p>
        </div>

        {/* Statutory Invariant Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {statutoryPills.map((pill, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg p-2.5 border border-rule/80 flex flex-col gap-0.5"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                {pill.label}
              </span>
              <span className="text-[13px] font-bold text-ink">{pill.value}</span>
              <span className="text-[10px] text-muted/70 font-mono">{pill.statute}</span>
            </div>
          ))}
        </div>

        {/* Interactive Controls */}
        <div className="bg-white/80 rounded-xl p-4 sm:p-5 border border-rule">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="card-salary" className="block text-[12px] font-medium text-muted mb-1">
                Gross Annual Salary
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">£</span>
                <input
                  id="card-salary"
                  type="number"
                  step="1000"
                  min="0"
                  value={salary}
                  onChange={(e) => setSalary(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full pl-7 pr-3 py-2 text-sm font-semibold text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-coral transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="card-years" className="block text-[12px] font-medium text-muted mb-1">
                Complete Years of Service
              </label>
              <input
                id="card-years"
                type="number"
                min="0"
                max="40"
                value={years}
                onChange={(e) => setYears(Math.min(40, Math.max(0, parseInt(e.target.value, 10) || 0)))}
                className="w-full px-3 py-2 text-sm font-semibold text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-coral transition-colors"
              />
            </div>

            <div>
              <label htmlFor="card-age" className="block text-[12px] font-medium text-muted mb-1">
                Age
              </label>
              <input
                id="card-age"
                type="number"
                min="18"
                max="75"
                value={age}
                onChange={(e) => setAge(Math.min(75, Math.max(18, parseInt(e.target.value, 10) || 18)))}
                className="w-full px-3 py-2 text-sm font-semibold text-ink bg-white border border-rule rounded-lg focus:outline-none focus:border-coral transition-colors"
              />
            </div>
          </div>

          {/* Real-time Baseline Readout */}
          <div className="mt-4 pt-4 border-t border-rule/80 grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
            <div>
              <span className="block text-[11px] text-muted font-medium">
                Statutory Redundancy Baseline
              </span>
              <span className="text-[15px] sm:text-[17px] font-bold text-ink">
                {formatCurrency(srp)}
              </span>
              <span className="block text-[10px] text-muted">ERA 1996 s.162 (capped)</span>
            </div>

            <div>
              <span className="block text-[11px] text-muted font-medium">
                Commercial Benchmark Range
              </span>
              <span className="text-[15px] sm:text-[17px] font-bold text-coral">
                {formatCurrency(typicalLow)} – {formatCurrency(typicalHigh)}
              </span>
              <span className="block text-[10px] text-muted">Statutory + 1–3 mo commercial range</span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="block text-[11px] text-muted font-medium">
                Tax-Free Portion
              </span>
              <span className="text-[15px] sm:text-[17px] font-bold text-ink">
                {formatCurrency(Math.min(30000, typicalHigh))}
              </span>
              <span className="block text-[10px] text-muted">ITEPA 2003 s.403 (up to £30k)</span>
            </div>
          </div>
        </div>

        {/* CTA and Legal Fee Reminder */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p className="text-[12px] text-muted m-0 leading-normal max-w-[42ch]">
            Under Section 203(3) ERA 1996, independent legal advice is required for a binding waiver. Employers standardly provide a capped fee contribution (£350–£500+ VAT) directly to your solicitor upon completion.
          </p>

          <Link
            href={calculatorQuery}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg bg-coral px-5 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 transition-all text-center"
          >
            {ctaText}
          </Link>
        </div>
      </div>
    </aside>
  )
}
