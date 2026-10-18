'use client'

import React, { useState, useId } from 'react'
import Link from 'next/link'

interface CalculatorCardData {
  id: string
  title: string
  href: string
  badge: string
  category: 'settlement' | 'redundancy' | 'dismissal' | 'tax'
  statutoryBasis: string
  description: string
  outputs: string[]
  timeToComplete: string
  primaryCta: string
  guideHref?: string
  guideLabel?: string
  isPrimary?: boolean
}

const CALCULATORS: CalculatorCardData[] = [
  {
    id: 'settlement-agreement',
    title: 'Settlement Agreement Calculator',
    href: '/calculator/',
    badge: 'Most Popular · 60-Second Check',
    category: 'settlement',
    statutoryBasis: 'ERA 1996 s.203 · ITEPA 2003 s.403',
    description:
      'Evaluate your employer settlement offer against statutory baselines, notice entitlements, and typical UK payout multiples. Benchmark fairness and calculate net take-home in 60 seconds.',
    outputs: [
      'Fairness rating (below, typical, or above range)',
      'Statutory redundancy baseline (£751/week cap)',
      'Contractual notice and PILON valuation',
      'Estimated net take-home after £30,000 tax exemption',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Check my offer now →',
    guideHref: '/guides/settlement-agreement-how-much/',
    guideLabel: 'Read payout benchmark guide',
    isPrimary: true,
  },
  {
    id: 'redundancy-pay',
    title: 'Redundancy Pay Calculator',
    href: '/redundancy-calculator/',
    badge: 'April 2026 Rates (£751 Cap)',
    category: 'redundancy',
    statutoryBasis: 'ERA 1996 ss.162-163 · SI 2026/310',
    description:
      'Calculate statutory redundancy pay under the April 2026 rates. Check your age-based multipliers (0.5x, 1.0x, 1.5x) and compare your statutory legal floor against any enhanced employer offer.',
    outputs: [
      'Statutory redundancy total (up to £22,530)',
      'Age-weighted qualifying service breakdown',
      'Enhanced redundancy package comparison',
      'Statutory notice pay entitlement',
    ],
    timeToComplete: '45 secs',
    primaryCta: 'Calculate redundancy pay →',
    guideHref: '/guides/redundancy-pay-cap-2026/',
    guideLabel: 'Read statutory cap guide',
  },
  {
    id: 'unfair-dismissal',
    title: 'Unfair Dismissal Calculator',
    href: '/unfair-dismissal-calculator/',
    badge: 'Up to £123,543 Statutory Cap',
    category: 'dismissal',
    statutoryBasis: 'ERA 1996 ss.118-124',
    description:
      'Estimate potential compensation if you have been dismissed or selected unfairly. Calculates your basic award and compensatory award for past and projected loss of earnings.',
    outputs: [
      'Basic award calculation (capped at £751/week)',
      'Compensatory award (capped at £123,543 or 52 weeks)',
      'Loss of statutory rights valuation',
      'ACAS uplift and Polkey deduction assessment',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Estimate dismissal compensation →',
    guideHref: '/guides/unfair-dismissal-settlement-agreements/',
    guideLabel: 'Read unfair dismissal guide',
  },
  {
    id: 'constructive-dismissal',
    title: 'Constructive Dismissal Calculator',
    href: '/constructive-dismissal-calculator/',
    badge: 'Forced Resignation Baseline',
    category: 'dismissal',
    statutoryBasis: 'ERA 1996 s.95(1)(c) · Western Excavating',
    description:
      'Driven to resign by unreasonable conduct, demotion, pay cuts, or unaddressed grievances? Calculate your statutory exit baseline and potential settlement value before handing in your notice.',
    outputs: [
      'Constructive dismissal exit baseline',
      'Breach of trust and confidence assessment',
      'Projected net earnings loss during job search',
      'Settlement negotiation counter-offer target',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Check constructive dismissal →',
    guideHref: '/guides/constructive-dismissal-settlement-agreements/',
    guideLabel: 'Read constructive dismissal guide',
  },
  {
    id: 'settlement-tax',
    title: 'Settlement Agreement Tax Calculator',
    href: '/settlement-agreement-tax-calculator/',
    badge: '£30,000 Tax-Free Check',
    category: 'tax',
    statutoryBasis: 'ITEPA 2003 ss.402D & 403',
    description:
      'Separate taxable notice pay (PILON) and accrued holiday from your £30,000 tax-free termination exemption under Section 403. Check your true take-home pay.',
    outputs: [
      'Exact £30,000 tax-free exemption allocation',
      'Post-Employment Notice Pay (PENP / PILON) tax breakdown',
      'Income tax and employee National Insurance deductions',
      'Estimated net take-home in your bank account',
    ],
    timeToComplete: '45 secs',
    primaryCta: 'Calculate net take-home →',
    guideHref: '/guides/tax-free-settlement-30000/',
    guideLabel: 'Read £30,000 exemption guide',
  },
  {
    id: 'protective-award',
    title: 'Protective Award Calculator',
    href: '/protective-award-calculator/',
    badge: 'Up to 90 Days Gross Pay',
    category: 'redundancy',
    statutoryBasis: 'TULRCA 1992 s.189',
    description:
      'Were you made redundant alongside 20 or more colleagues without the mandatory 30-day or 45-day collective consultation? Calculate your statutory protective award entitlement.',
    outputs: [
      'Up to 90 days gross actual pay',
      'Uncapped salary calculation (not limited to £751/week)',
      'Payable on top of statutory redundancy and notice',
      'Redundancy Payments Service (RPS) insolvency floor',
    ],
    timeToComplete: '45 secs',
    primaryCta: 'Calculate protective award →',
    guideHref: '/guides/protective-award/',
    guideLabel: 'Read collective consultation guide',
  },
  {
    id: 'settlement-review',
    title: 'Settlement Agreement & Contract Review',
    href: '/settlement-agreement-review/',
    badge: 'Draft Agreement & Clause Check',
    category: 'settlement',
    statutoryBasis: 'ERA 1996 s.203 Mandatory Advice',
    description:
      'Have you received a written settlement agreement? Check restrictive covenants, indemnity risks, confidentiality terms, and verify that your employer is paying the required legal fee contribution.',
    outputs: [
      'Agreement risk and balance score',
      'Legal fee contribution check (£500 to £1,500 + VAT benchmark)',
      'Non-compete and confidentiality clause verification',
      'Actionable counter-proposal negotiation checklist',
    ],
    timeToComplete: '90 secs',
    primaryCta: 'Review draft agreement →',
    guideHref: '/guides/what-is-a-fair-settlement-agreement/',
    guideLabel: 'Read fairness checklist guide',
  },
  {
    id: 'nhs-mars',
    title: 'NHS Redundancy & MARS Calculator',
    href: '/guides/nhs-settlement-agreements/#mars-calculator',
    badge: 'Specialist NHS Agenda for Change',
    category: 'redundancy',
    statutoryBasis: 'AfC Section 16 · HM Treasury Guidance',
    description:
      'Working in the NHS? Calculate your contractual redundancy or Mutually Agreed Resignation Scheme (MARS) payout under Agenda for Change terms, subject to the £100,000 HM Treasury cap.',
    outputs: [
      'NHS Agenda for Change Section 16 redundancy calculation',
      'Voluntary MARS severance tariff calculation',
      'Application of the HM Treasury £100,000 severance cap',
      'Pension actuarial reduction guidance',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Check NHS redundancy pay →',
    guideHref: '/guides/nhs-settlement-agreements/',
    guideLabel: 'Read NHS settlement guide',
  },
]

const SITUATION_FAST_PATHS = [
  {
    label: 'I received a settlement agreement or my employer requested a protected conversation',
    recommendedId: 'settlement-agreement',
    toolName: 'Settlement Agreement Calculator',
    href: '/calculator/',
  },
  {
    label: 'My role is at risk of redundancy or my team is being restructured',
    recommendedId: 'redundancy-pay',
    toolName: 'Redundancy Pay Calculator',
    href: '/redundancy-calculator/',
  },
  {
    label: 'I was dismissed, pushed out, or selected unfairly for redundancy',
    recommendedId: 'unfair-dismissal',
    toolName: 'Unfair Dismissal Calculator',
    href: '/unfair-dismissal-calculator/',
  },
  {
    label: 'Work has become intolerable and I feel forced to resign',
    recommendedId: 'constructive-dismissal',
    toolName: 'Constructive Dismissal Calculator',
    href: '/constructive-dismissal-calculator/',
  },
  {
    label: 'I have an offer amount and need to check tax and net take-home pay',
    recommendedId: 'settlement-tax',
    toolName: 'Settlement Agreement Tax Calculator',
    href: '/settlement-agreement-tax-calculator/',
  },
  {
    label: 'My employer is making 20 or more staff redundant without proper consultation',
    recommendedId: 'protective-award',
    toolName: 'Protective Award Calculator',
    href: '/protective-award-calculator/',
  },
  {
    label: 'I have a draft settlement contract and want to check clauses and legal fees',
    recommendedId: 'settlement-review',
    toolName: 'Settlement Agreement Review',
    href: '/settlement-agreement-review/',
  },
]

type FilterTab = 'all' | 'settlement' | 'redundancy' | 'dismissal' | 'tax'

export default function CalculatorsClient() {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const situationSelectId = useId()

  const filteredCalculators = CALCULATORS.filter((c) => {
    if (activeTab === 'all') return true
    return c.category === activeTab
  })

  const handleSituationSelect = (calcId: string) => {
    setHighlightedId(calcId)
    const targetEl = document.getElementById(`calculator-${calcId}`)
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  return (
    <div className="flex flex-col gap-12">
      {/* Quick Match: Find Your Calculator */}
      <div className="rounded-2xl border-2 border-rule bg-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" aria-hidden="true" />
          <span className="text-[12px] font-sans font-semibold tracking-wider text-coral uppercase">
            Quick Match · Find Your Calculator
          </span>
        </div>
        <h2 className="text-[20px] md:text-[24px] font-serif font-460 text-ink tracking-tight mb-2">
          Which calculator matches your exact situation?
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted leading-relaxed mb-6 max-w-[72ch]">
          When dealing with a stressful workplace situation, you need clear answers without digging through legal jargon.
          Select the statement below that best describes your position to jump straight to the right statutory tool:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {SITUATION_FAST_PATHS.map((item, idx) => {
            const isSelected = highlightedId === item.recommendedId
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSituationSelect(item.recommendedId)}
                className={`text-left p-4 rounded-xl border text-[13px] md:text-[14px] leading-snug transition-all duration-200 flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'border-coral bg-[#FDF7F4] shadow-md ring-2 ring-coral/20'
                    : 'border-rule/80 bg-paper hover:bg-paper/80 hover:border-ink/30'
                }`}
              >
                <span className="text-ink font-normal">{item.label}</span>
                <span className="flex items-center gap-1 text-[12px] font-semibold text-coral mt-auto">
                  <span>Use {item.toolName}</span>
                  <span aria-hidden="true">↓</span>
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rule pb-4">
        <div className="flex items-center gap-1.5 flex-wrap" role="tablist" aria-label="Filter calculators by category">
          {[
            { id: 'all', label: 'All Tools', count: CALCULATORS.length },
            { id: 'settlement', label: 'Settlement Offers', count: CALCULATORS.filter(c => c.category === 'settlement').length },
            { id: 'redundancy', label: 'Redundancy', count: CALCULATORS.filter(c => c.category === 'redundancy').length },
            { id: 'dismissal', label: 'Dismissal & Exit', count: CALCULATORS.filter(c => c.category === 'dismissal').length },
            { id: 'tax', label: 'Tax & Net Pay', count: CALCULATORS.filter(c => c.category === 'tax').length },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-ink text-white shadow-sm'
                    : 'bg-card text-muted hover:text-ink hover:bg-paper border border-rule/70'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-rule/60 text-muted'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>
        <div className="text-[12px] text-muted font-medium">
          Showing <span className="font-semibold text-ink">{filteredCalculators.length}</span> tools · All free &amp; anonymous
        </div>
      </div>

      {/* The Calculator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {filteredCalculators.map((calc) => {
          const isHighlighted = highlightedId === calc.id
          return (
            <article
              key={calc.id}
              id={`calculator-${calc.id}`}
              className={`relative flex flex-col justify-between rounded-2xl bg-card p-6 md:p-8 transition-all duration-200 border ${
                isHighlighted
                  ? 'border-coral ring-4 ring-coral/15 shadow-xl scale-[1.01]'
                  : calc.isPrimary
                  ? 'border-coral/50 shadow-md'
                  : 'border-rule shadow-sm hover:border-ink/30 hover:shadow-md'
              }`}
            >
              {/* Header Badges */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <span
                    className={`inline-block text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-md ${
                      calc.isPrimary
                        ? 'bg-[#FDF7F4] text-coral border border-coral/30'
                        : 'bg-paper text-muted border border-rule'
                    }`}
                  >
                    {calc.badge}
                  </span>
                  <span className="text-[11px] font-medium text-muted/80 flex items-center gap-1">
                    <span aria-hidden="true">⏱</span> {calc.timeToComplete}
                  </span>
                </div>

                {/* Statutory Basis Tag */}
                <div className="text-[12px] font-mono text-muted mb-2 font-medium">
                  {calc.statutoryBasis}
                </div>

                {/* Title */}
                <h3 className="text-[22px] md:text-[24px] font-serif font-460 text-ink tracking-tight mb-3">
                  <Link href={calc.href} className="hover:text-coral transition-colors duration-150">
                    {calc.title}
                  </Link>
                </h3>

                {/* Description */}
                <p className="text-[14px] md:text-[15px] text-muted leading-relaxed mb-5">
                  {calc.description}
                </p>

                {/* Key Outputs List */}
                <div className="mb-6 pt-4 border-t border-rule/70">
                  <div className="text-[12px] font-semibold text-ink uppercase tracking-wider mb-2.5">
                    What this calculator shows:
                  </div>
                  <ul className="grid grid-cols-1 gap-1.5 text-[13px] text-muted">
                    {calc.outputs.map((out, oIdx) => (
                      <li key={oIdx} className="flex items-start gap-2">
                        <span className="text-coral font-bold leading-none mt-1" aria-hidden="true">✓</span>
                        <span className="leading-snug">{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-auto">
                <Link
                  href={calc.href}
                  className={`text-[14px] font-medium px-5 py-2.5 rounded-lg text-center transition-all duration-150 ${
                    calc.isPrimary
                      ? 'btn-accent'
                      : 'bg-ink text-white hover:bg-[#1A2F4E]'
                  }`}
                >
                  {calc.primaryCta}
                </Link>

                {calc.guideHref && (
                  <Link
                    href={calc.guideHref}
                    className="text-[13px] text-coral font-medium hover:underline underline-offset-2 flex items-center justify-center sm:justify-start gap-1 py-1"
                  >
                    <span>{calc.guideLabel || 'Read guide'}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
