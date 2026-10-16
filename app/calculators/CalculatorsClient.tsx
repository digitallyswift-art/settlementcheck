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
    badge: 'Flagship Evaluation Tool',
    category: 'settlement',
    statutoryBasis: 'ERA 1996 s.203 · ITEPA 2003 s.403',
    description:
      'Evaluate your employer settlement offer against statutory baselines, notice entitlements, and typical UK payout multiples. Benchmark fairness and calculate net take-home in 60 seconds.',
    outputs: [
      'Fairness rating (Low, Fair, Strong)',
      'Statutory redundancy baseline (£751/wk cap)',
      'Contractual notice / PILON valuation',
      'Net take-home after £30k tax exemption',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Check My Offer Now →',
    guideHref: '/guides/settlement-agreement-how-much/',
    guideLabel: 'Read Payout Benchmark Guide',
    isPrimary: true,
  },
  {
    id: 'redundancy-pay',
    title: 'Redundancy Pay Calculator',
    href: '/redundancy-calculator/',
    badge: 'April 2026 Rates (£751 Cap)',
    category: 'redundancy',
    statutoryBasis: 'ERA 1996 ss.162–163 · SI 2026/310',
    description:
      'Calculate statutory redundancy pay under the April 2026 statutory rates. Applies age-based multipliers (0.5x, 1.0x, 1.5x) and compares your legal floor against enhanced company packages.',
    outputs: [
      'Statutory redundancy total (up to £22,530)',
      'Age-weighted qualifying service breakdown',
      'Enhanced redundancy comparison',
      'Statutory notice pay entitlement',
    ],
    timeToComplete: '45 secs',
    primaryCta: 'Calculate Redundancy Pay →',
    guideHref: '/guides/redundancy-pay-cap-2026/',
    guideLabel: 'Read Statutory Cap Guide',
  },
  {
    id: 'unfair-dismissal',
    title: 'Unfair Dismissal Calculator',
    href: '/unfair-dismissal-calculator/',
    badge: 'Up to £123,543 Statutory Cap',
    category: 'dismissal',
    statutoryBasis: 'ERA 1996 ss.118–124',
    description:
      'Estimate potential Employment Tribunal compensation for unfair or wrongful dismissal. Calculates both the basic award and the compensatory award for past and projected future wage loss.',
    outputs: [
      'Basic award calculation (capped at £751/wk)',
      'Compensatory award (capped at £123,543 or 52 wks)',
      'Loss of statutory rights valuation',
      'Polkey reduction & Acas uplift assessment',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Estimate Dismissal Compensation →',
    guideHref: '/guides/unfair-dismissal-settlement-agreements/',
    guideLabel: 'Read Unfair Dismissal Guide',
  },
  {
    id: 'constructive-dismissal',
    title: 'Constructive Dismissal Calculator',
    href: '/constructive-dismissal-calculator/',
    badge: 'Forced Resignation Baseline',
    category: 'dismissal',
    statutoryBasis: 'ERA 1996 s.95(1)(c) · Western Excavating',
    description:
      'Driven to resign by toxic treatment, unreasonable conduct, demotion, or unaddressed grievances? Calculate your legal exit baseline and potential claim value before handing in your notice.',
    outputs: [
      'Constructive dismissal exit baseline',
      'Breach of trust & confidence valuation',
      'Projected net earnings loss during job search',
      'Settlement negotiation counter-offer target',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Assess Constructive Claim →',
    guideHref: '/guides/constructive-dismissal-settlement-agreements/',
    guideLabel: 'Read Constructive Dismissal Guide',
  },
  {
    id: 'settlement-tax',
    title: 'Settlement Agreement Tax Calculator',
    href: '/settlement-agreement-tax-calculator/',
    badge: '£30,000 Tax-Free Check',
    category: 'tax',
    statutoryBasis: 'ITEPA 2003 ss.402D & 403',
    description:
      'Stop HR deducting tax they should not. Accurately separate taxable earnings (PILON, accrued holiday) from the £30,000 tax-free termination exemption under Section 403.',
    outputs: [
      'Exact £30,000 tax-free exemption allocation',
      'Post-Employment Notice Pay (PENP / PILON) tax',
      'Marginal income tax & employee NI deductions',
      'Guaranteed net take-home in your bank account',
    ],
    timeToComplete: '45 secs',
    primaryCta: 'Calculate Net Take-Home →',
    guideHref: '/guides/tax-free-settlement-30000/',
    guideLabel: 'Read £30,000 Exemption Guide',
  },
  {
    id: 'protective-award',
    title: 'Protective Award Calculator',
    href: '/protective-award-calculator/',
    badge: 'Up to 90 Days Gross Pay',
    category: 'redundancy',
    statutoryBasis: 'TULRCA 1992 s.189',
    description:
      'Were you made redundant alongside 20 or more colleagues without the mandatory 30-day or 45-day collective consultation? Calculate your protective award claim entitlement.',
    outputs: [
      'Up to 90 days gross uncapped remuneration',
      'Calculation based on actual salary (not capped at £751)',
      'Payable on top of statutory redundancy & notice',
      'Redundancy Payments Service (RPS) insolvency floor',
    ],
    timeToComplete: '45 secs',
    primaryCta: 'Calculate Protective Award →',
    guideHref: '/guides/protective-award/',
    guideLabel: 'Read Collective Consultation Guide',
  },
  {
    id: 'settlement-review',
    title: 'Settlement Agreement & Contract Review',
    href: '/settlement-agreement-review/',
    badge: 'Draft Contract & Clause Audit',
    category: 'settlement',
    statutoryBasis: 'ERA 1996 s.203 Mandatory Advice',
    description:
      'Got a written agreement in front of you? Check restrictive covenants, indemnity risks, confidentiality clauses, and verify that your employer is paying the required legal fee contribution.',
    outputs: [
      'Agreement risk & balance scoring',
      'Legal fee contribution check (£500–£1,500+VAT benchmark)',
      'Non-compete & gagging clause verification',
      'Actionable counter-proposal leverage checklist',
    ],
    timeToComplete: '90 secs',
    primaryCta: 'Review Draft Agreement →',
    guideHref: '/guides/what-is-a-fair-settlement-agreement/',
    guideLabel: 'Read Fairness Checklist Guide',
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
      'NHS Agenda for Change Section 16 redundancy',
      'Voluntary MARS severance tariff calculation',
      'Application of HM Treasury £100,000 severance cap',
      'Pension actuarial reduction guidance',
    ],
    timeToComplete: '60 secs',
    primaryCta: 'Launch NHS Calculator →',
    guideHref: '/guides/nhs-settlement-agreements/',
    guideLabel: 'Read NHS Settlement Guide',
  },
]

const SITUATION_FAST_PATHS = [
  {
    label: 'I received a formal settlement agreement or protected conversation offer',
    recommendedId: 'settlement-agreement',
    toolName: 'Settlement Agreement Calculator',
    href: '/calculator/',
  },
  {
    label: 'My role is at risk of redundancy or undergoing restructuring',
    recommendedId: 'redundancy-pay',
    toolName: 'Redundancy Pay Calculator',
    href: '/redundancy-calculator/',
  },
  {
    label: 'I was dismissed, pushed out, or selected unfairly',
    recommendedId: 'unfair-dismissal',
    toolName: 'Unfair Dismissal Calculator',
    href: '/unfair-dismissal-calculator/',
  },
  {
    label: 'Work is hostile/toxic and I feel forced to resign',
    recommendedId: 'constructive-dismissal',
    toolName: 'Constructive Dismissal Calculator',
    href: '/constructive-dismissal-calculator/',
  },
  {
    label: 'I have a payout figure and need to check tax deductions',
    recommendedId: 'settlement-tax',
    toolName: 'Settlement Agreement Tax Calculator',
    href: '/settlement-agreement-tax-calculator/',
  },
  {
    label: '20+ colleagues were dismissed without proper collective consultation',
    recommendedId: 'protective-award',
    toolName: 'Protective Award Calculator',
    href: '/protective-award-calculator/',
  },
  {
    label: 'I have a written draft contract and need to check legal fees & clauses',
    recommendedId: 'settlement-review',
    toolName: 'Employment Settlement Checker',
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
      {/* Fast-Path Diagnostic: Eradicating Attention Friction */}
      <div className="rounded-2xl border-2 border-rule bg-card p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-coral animate-pulse" aria-hidden="true" />
          <span className="text-[12px] font-sans font-semibold tracking-wider text-coral uppercase">
            Fast-Path Navigator · Attention Economy Diagnostic
          </span>
        </div>
        <h2 className="text-[20px] md:text-[24px] font-serif font-460 text-ink tracking-tight mb-2">
          Which calculator matches your exact situation?
        </h2>
        <p className="text-[14px] md:text-[15px] text-muted leading-relaxed mb-6 max-w-[72ch]">
          When dealing with stressful workplace exits, you do not have time to browse through complex menus.
          Select the statement below that best describes your position to jump directly to the right statutory tool:
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
                    What this calculator calculates:
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
