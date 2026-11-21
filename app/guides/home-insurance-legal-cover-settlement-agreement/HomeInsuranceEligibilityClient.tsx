'use client'

import React, { useState } from 'react'
import Link from 'next/link'

type SituationType =
  | 'voluntary_settlement'
  | 'redundancy_exit'
  | 'pip_exit'
  | 'unlawful_dismissal'
  | 'discrimination_dispute'

interface EligibilityResult {
  title: string
  leiStatus: 'Excluded by Standard LEI' | 'Potentially Eligible for LEI'
  badgeType: 'excluded' | 'eligible'
  explanation: string
  employerContribution: string
  recommendedPath: string
  actionUrl: string
  actionLabel: string
}

const SITUATION_DATA: Record<SituationType, EligibilityResult> = {
  voluntary_settlement: {
    title: 'Voluntary Settlement Agreement / Mutual Exit',
    leiStatus: 'Excluded by Standard LEI',
    badgeType: 'excluded',
    explanation:
      'Standard home insurance Legal Expenses Insurance (LEI) policies exclude pre-termination settlement discussions. Insurers require a contentious legal dispute with a greater than 51% chance of success at tribunal. Because a settlement agreement is a voluntary commercial exit, insurers do not fund routine contract sign-offs.',
    employerContribution:
      'Standardly covered: UK employers customarily provide a capped commercial contribution (typically £350 to £500+ plus VAT, or £750 to £1,500+ for executives) paid directly to your instructed SRA-regulated solicitor upon completion.',
    recommendedPath:
      'Instruct an independent SRA-regulated employment solicitor. Your employer pays the fee contribution directly under customary terms.',
    actionUrl: '/settlement-agreement-review/',
    actionLabel: 'Match with a Solicitor (Employer-Funded) →',
  },
  redundancy_exit: {
    title: 'Redundancy Settlement or Enhanced Redundancy Package',
    leiStatus: 'Excluded by Standard LEI',
    badgeType: 'excluded',
    explanation:
      'Where an employer offers an enhanced redundancy payment subject to signing a Section 203 settlement agreement, LEI policies standardly decline cover because no actionable breach of contract or wrongful dismissal has occurred.',
    employerContribution:
      'Standardly covered: Your employer standardly pays £350 to £500+ VAT directly to your solicitor upon completion to ensure the settlement waiver is legally binding under Section 203(3) ERA 1996.',
    recommendedPath:
      'Calculate your statutory redundancy baseline first, then instruct an SRA-regulated solicitor to verify the settlement terms under the employer contribution.',
    actionUrl: '/redundancy-calculator/',
    actionLabel: 'Check Redundancy Baseline First →',
  },
  pip_exit: {
    title: 'Protected Conversation During Performance (PIP)',
    leiStatus: 'Excluded by Standard LEI',
    badgeType: 'excluded',
    explanation:
      'Pre-termination negotiations held under Section 111A ERA 1996 during a Performance Improvement Plan (PIP) are consensual discussions. Insurers do not fund contract negotiations before formal dismissal takes place.',
    employerContribution:
      'Standardly covered: Employers providing an exit package during a PIP customarily pay £350 to £750+ VAT directly to your independent solicitor upon agreement completion.',
    recommendedPath:
      'Evaluate your settlement offer value against standard employer notice costs, then have an independent solicitor review the non-derogatory reference terms.',
    actionUrl: '/pip-settlement-calculator/',
    actionLabel: 'Evaluate PIP Settlement Value →',
  },
  unlawful_dismissal: {
    title: 'Dismissal Without Settlement / Gross Misconduct / Sacked',
    leiStatus: 'Potentially Eligible for LEI',
    badgeType: 'eligible',
    explanation:
      'If your employer has formally dismissed you without an agreed settlement, and you believe the dismissal was procedurally or substantively unfair, LEI policies standardly assess the claim under their "merits assessment" (requiring >51% prospects of success).',
    employerContribution:
      'No employer contribution: Because no settlement agreement is being offered, the employer will not fund your legal costs.',
    recommendedPath:
      'Notify your home insurer immediately to register a potential claim. Remember that under Regulation 6, you retain the right to select your own independent solicitor if legal proceedings are issued.',
    actionUrl: '/unfair-dismissal-calculator/',
    actionLabel: 'Calculate Unfair Dismissal Claim Value →',
  },
  discrimination_dispute: {
    title: 'Active Workplace Discrimination or Whistleblowing Detriment',
    leiStatus: 'Potentially Eligible for LEI',
    badgeType: 'eligible',
    explanation:
      'Claims under the Equality Act 2010 or whistleblowing detriment under Section 47B ERA 1996 are actionable civil claims. Insurers may provide legal funding if independent counsel confirms prospects of success exceed 51%.',
    employerContribution:
      'Variable: If the employer proposes a settlement agreement to resolve the dispute, they customarily contribute £500 to £1,500+ VAT to your legal costs upon completion.',
    recommendedPath:
      'Assess potential injury to feelings (Vento bands) and financial compensation baselines. Consider taking independent legal advice to evaluate both settlement and litigation routes.',
    actionUrl: '/calculator/',
    actionLabel: 'Calculate Potential Settlement Range →',
  },
}

export default function HomeInsuranceEligibilityClient() {
  const [selectedSituation, setSelectedSituation] = useState<SituationType>('voluntary_settlement')

  const currentResult = SITUATION_DATA[selectedSituation]

  return (
    <div className="bg-card border border-rule rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-rule pb-4">
        <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
          Interactive Diagnostic Widget
        </span>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-ink">
          Legal Expenses Insurance (LEI) Cover Diagnostic
        </h2>
        <p className="text-body sm:text-body text-muted mt-1 leading-relaxed">
          Select your current employment situation below to see whether home insurance Legal Expenses Insurance applies, and how independent legal advice is funded.
        </p>
      </div>

      {/* Situation Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setSelectedSituation('voluntary_settlement')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSituation === 'voluntary_settlement'
              ? 'border-coral bg-coral/5 font-semibold text-ink shadow-sm'
              : 'border-rule bg-paper text-muted hover:border-rule-2 hover:text-ink'
          }`}
        >
          <span className="text-xs block font-medium">Voluntary Settlement Offer</span>
          <span className="text-[11px] text-muted block mt-0.5">Offered an exit agreement</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSituation('redundancy_exit')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSituation === 'redundancy_exit'
              ? 'border-coral bg-coral/5 font-semibold text-ink shadow-sm'
              : 'border-rule bg-paper text-muted hover:border-rule-2 hover:text-ink'
          }`}
        >
          <span className="text-xs block font-medium">Redundancy Restructure</span>
          <span className="text-[11px] text-muted block mt-0.5">Statutory or enhanced exit</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSituation('pip_exit')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSituation === 'pip_exit'
              ? 'border-coral bg-coral/5 font-semibold text-ink shadow-sm'
              : 'border-rule bg-paper text-muted hover:border-rule-2 hover:text-ink'
          }`}
        >
          <span className="text-xs block font-medium">Performance / PIP Exit</span>
          <span className="text-[11px] text-muted block mt-0.5">Protected conversation</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSituation('unlawful_dismissal')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSituation === 'unlawful_dismissal'
              ? 'border-coral bg-coral/5 font-semibold text-ink shadow-sm'
              : 'border-rule bg-paper text-muted hover:border-rule-2 hover:text-ink'
          }`}
        >
          <span className="text-xs block font-medium">Unfair / Constructive Dismissal</span>
          <span className="text-[11px] text-muted block mt-0.5">Dismissed without settlement</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedSituation('discrimination_dispute')}
          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
            selectedSituation === 'discrimination_dispute'
              ? 'border-coral bg-coral/5 font-semibold text-ink shadow-sm'
              : 'border-rule bg-paper text-muted hover:border-rule-2 hover:text-ink'
          }`}
        >
          <span className="text-xs block font-medium">Discrimination / Detriment</span>
          <span className="text-[11px] text-muted block mt-0.5">Equality Act / whistleblowing</span>
        </button>
      </div>

      {/* Result Card */}
      <div className="bg-paper p-6 rounded-xl border border-rule space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-3">
          <div>
            <span className="text-[11px] font-mono text-muted uppercase">Assessment For</span>
            <h3 className="text-lg font-serif font-bold text-ink">{currentResult.title}</h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto ${
              currentResult.badgeType === 'excluded'
                ? 'bg-amber/15 text-amber border border-amber/30'
                : 'bg-info/15 text-info border border-info/30'
            }`}
          >
            {currentResult.leiStatus}
          </span>
        </div>

        <div className="space-y-3 text-xs leading-relaxed text-muted">
          <p className="text-ink text-body leading-relaxed">{currentResult.explanation}</p>
          <div className="p-3 bg-card rounded-lg border border-rule space-y-1">
            <span className="font-semibold text-ink block">How Independent Legal Advice Is Funded:</span>
            <p className="m-0 text-muted">{currentResult.employerContribution}</p>
          </div>
          <div className="p-3 bg-card rounded-lg border border-rule space-y-1">
            <span className="font-semibold text-ink block">Recommended Practical Next Step:</span>
            <p className="m-0 text-muted">{currentResult.recommendedPath}</p>
          </div>
        </div>

        <div className="pt-2">
          <Link
            href={currentResult.actionUrl}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-ink hover:bg-ink-2 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            {currentResult.actionLabel}
          </Link>
        </div>
      </div>
    </div>
  )
}