'use client'

import React, { useState } from 'react'
import Link from 'next/link'

export type SectorKey = 'nhs' | 'civil_service' | 'financial_services' | 'private_sector'

interface SectorData {
  name: string
  shortLabel: string
  governingFramework: string
  multiplierFormula: string
  weeklyPayCap: string
  maximumSeveranceCap: string
  taxTreatment: string
  pensionImpact: string
  legalFeeNorm: string
  keyStatutes: string
  overview: string
  calculatorUrl: string
  calculatorLabel: string
}

const SECTOR_DETAILS: Record<SectorKey, SectorData> = {
  nhs: {
    name: 'NHS (Agenda for Change)',
    shortLabel: 'NHS Restructuring',
    governingFramework: 'Agenda for Change Section 16 (Redundancy) & Section 17 (MARS)',
    multiplierFormula: '1 month of actual basic pay per complete year of reckonable NHS service',
    weeklyPayCap: 'No statutory weekly cap (calculated on full contractual basic monthly pay)',
    maximumSeveranceCap: 'Capped at 24 months of pay for redundancy; 21 months for MARS (HM Treasury rules apply)',
    taxTreatment: 'First £30,000 tax-free under ITEPA 2003 s.403; contractual notice / PILON fully taxable',
    pensionImpact: 'Eligible staff over minimum pension age can elect to buy out actuarial reduction for early retirement',
    legalFeeNorm: 'NHS trusts standardly contribute £350 to £750+ plus VAT upon agreement completion',
    keyStatutes: 'Agenda for Change Terms; ERA 1996 s.43J (protected disclosures void any gagging clause)',
    overview:
      'NHS restructures are governed by the Agenda for Change national framework. Unlike statutory minimum redundancy, payments are based on actual un-capped monthly pay. Any Special Severance Payment exceeding contractual entitlements requires Department of Health and Social Care and HM Treasury approval.',
    calculatorUrl: '/guides/nhs-settlement-agreements/',
    calculatorLabel: 'Explore NHS MARS & Redundancy Guide →',
  },
  civil_service: {
    name: 'Civil Service (CSCS)',
    shortLabel: 'Civil Service CSCS',
    governingFramework: 'Civil Service Compensation Scheme (CSCS)',
    multiplierFormula: 'Voluntary Redundancy (VR): 1 month per year of service; Compulsory: 1 month per year',
    weeklyPayCap: 'Scheme calculation salary cap applies (£149,829 maximum deemed salary)',
    maximumSeveranceCap: 'Voluntary Exit (VE) & VR: capped at 21 months of pay; Compulsory Redundancy (CR): capped at 12 months',
    taxTreatment: 'First £30,000 tax-free under ITEPA 2003 s.403; balance subject to marginal income tax & employer Class 1A NIC',
    pensionImpact: 'Staff at or above minimum pension age can exchange severance for an unreduced pension bridge',
    legalFeeNorm: 'Departments customarily contribute £400 to £750+ plus VAT directly to independent solicitors',
    keyStatutes: 'Superannuation Act 1972; Civil Service Compensation Scheme Rules 2010; ITEPA 2003 s.403',
    overview:
      'Civil Service departures follow the statutory CSCS rules. Voluntary Exit (VE) offers flexible terms, Voluntary Redundancy (VR) provides up to 21 months of pay, and Compulsory Redundancy (CR) is restricted to 12 months. Strict clawback rules apply if re-employed in the Civil Service within 6 months.',
    calculatorUrl: '/redundancy-calculator/',
    calculatorLabel: 'Calculate Statutory Redundancy Baseline →',
  },
  financial_services: {
    name: 'Regulated Financial Services',
    shortLabel: 'City & FinTech Exits',
    governingFramework: 'FCA / PRA Senior Managers and Certification Regime (SM&CR) & PRA Rulebook',
    multiplierFormula: 'Contractual enhanced terms (often 1 to 2 months per year) plus discretionary ex-gratia compensation',
    weeklyPayCap: 'Contractual pay is rarely capped; negotiated against total remuneration packages',
    maximumSeveranceCap: 'Commercial settlement negotiation; not bound by statutory formula caps',
    taxTreatment: 'First £30,000 tax-free under s.403; strict PENP rules under s.402D; deferred bonus tax partitioning',
    pensionImpact: 'Pension contributions protected; unvested share awards, LTIPs, and carry subject to good/bad leaver clauses',
    legalFeeNorm: 'Employers customarily contribute £1,000 to £2,500+ plus VAT due to regulatory complexity',
    keyStatutes: 'FCA SYSC 22 (Regulatory References); PRA Remuneration Rules; ERA 1996 s.43J & s.203',
    overview:
      'Exits in City banks, asset managers, and regulated financial firms involve delicate regulatory considerations. Regulatory references under FCA SYSC 22 cannot be bargained away. Negotiations frequently center on good leaver status for unvested equity, malus and clawback provisions, and garden leave.',
    calculatorUrl: '/calculator/',
    calculatorLabel: 'Evaluate Financial Services Package →',
  },
  private_sector: {
    name: 'Private Sector & SMEs',
    shortLabel: 'Private Sector / Statutory',
    governingFramework: 'Employment Rights Act 1996 Part XI & Contractual Redundancy Policies',
    multiplierFormula: 'Statutory: 0.5 week (<22), 1.0 week (22-40), 1.5 weeks (41+) per complete year of continuous service',
    weeklyPayCap: '£751 per week (April 2026 Great Britain statutory cap under ERA 1996 s.227)',
    maximumSeveranceCap: 'Statutory maximum £22,530 (20 qualifying years); enhanced schemes vary by employer policy',
    taxTreatment: 'First £30,000 tax-free under ITEPA 2003 s.403; PILON and notice pay taxed as earnings under s.402D',
    pensionImpact: 'No direct pension access; employee can negotiate employer pension sacrifice to mitigate income tax',
    legalFeeNorm: 'Employers standardly contribute £350 to £500+ plus VAT upon agreement completion',
    keyStatutes: 'ERA 1996 ss.135, 162-163; ITEPA 2003 s.403; TULRCA 1992 s.188 (collective consultation)',
    overview:
      'Private sector employers must meet the statutory baseline for employees with 2+ years of service. Many employers offer enhanced packages or negotiate settlement agreements under Section 203 ERA 1996 to obtain a clean waiver of tribunal claims.',
    calculatorUrl: '/redundancy-calculator/',
    calculatorLabel: 'Use Redundancy Pay Calculator →',
  },
}

export default function SectorRestructuringClient() {
  const [activeSector, setActiveSector] = useState<SectorKey>('nhs')
  const current = SECTOR_DETAILS[activeSector]

  return (
    <div className="bg-card border border-rule rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
      <div className="border-b border-rule pb-5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
          Interactive Restructuring Comparator
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
          Sector Redundancy &amp; Exit Framework Comparison
        </h2>
        <p className="text-body text-muted mt-1 leading-relaxed">
          Select a sector to examine how exit packages, pay caps, tax treatment, and pension provisions operate across the UK economy.
        </p>
      </div>

      {/* Sector Tab Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {(Object.keys(SECTOR_DETAILS) as SectorKey[]).map((key) => {
          const item = SECTOR_DETAILS[key]
          const isSelected = activeSector === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveSector(key)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-coral bg-coral/5 font-semibold text-ink shadow-sm'
                  : 'border-rule bg-paper text-muted hover:border-rule-2 hover:text-ink'
              }`}
            >
              <span className="text-xs uppercase tracking-wider text-muted font-mono block mb-1">
                Sector Hub
              </span>
              <span className="text-sm font-serif font-bold block text-ink">{item.name}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Sector Deep-Dive Card */}
      <div className="bg-paper p-6 sm:p-8 rounded-xl border border-rule space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-4">
          <div>
            <span className="text-xs font-mono text-coral uppercase tracking-wider font-semibold block">
              Governance Profile
            </span>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink">{current.name}</h3>
            <p className="text-body text-muted mt-0.5">{current.governingFramework}</p>
          </div>
          <Link
            href={current.calculatorUrl}
            className="inline-flex items-center justify-center px-4 py-2 bg-ink hover:bg-ink-2 text-white font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
          >
            {current.calculatorLabel}
          </Link>
        </div>

        <p className="text-body text-ink leading-relaxed">{current.overview}</p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-card rounded-xl border border-rule space-y-1">
            <span className="text-muted uppercase text-[10px] tracking-wider font-semibold block">
              Redundancy Multiplier Formula
            </span>
            <span className="font-semibold text-ink text-sm block">{current.multiplierFormula}</span>
          </div>

          <div className="p-4 bg-card rounded-xl border border-rule space-y-1">
            <span className="text-muted uppercase text-[10px] tracking-wider font-semibold block">
              Weekly Pay Cap Rule
            </span>
            <span className="font-semibold text-coral text-sm block">{current.weeklyPayCap}</span>
          </div>

          <div className="p-4 bg-card rounded-xl border border-rule space-y-1">
            <span className="text-muted uppercase text-[10px] tracking-wider font-semibold block">
              Maximum Severance Cap
            </span>
            <span className="font-semibold text-ink text-sm block">{current.maximumSeveranceCap}</span>
          </div>

          <div className="p-4 bg-card rounded-xl border border-rule space-y-1">
            <span className="text-muted uppercase text-[10px] tracking-wider font-semibold block">
              Tax-Free Exemption (ITEPA 2003 s.403)
            </span>
            <span className="font-semibold text-ink text-sm block">{current.taxTreatment}</span>
          </div>

          <div className="p-4 bg-card rounded-xl border border-rule space-y-1">
            <span className="text-muted uppercase text-[10px] tracking-wider font-semibold block">
              Pension Protection &amp; Early Retirement
            </span>
            <span className="text-ink leading-relaxed block">{current.pensionImpact}</span>
          </div>

          <div className="p-4 bg-card rounded-xl border border-rule space-y-1">
            <span className="text-muted uppercase text-[10px] tracking-wider font-semibold block">
              Customary Employer Legal Fee Contribution
            </span>
            <span className="text-ink leading-relaxed block">{current.legalFeeNorm}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-rule flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-muted">
          <span>
            <strong>Primary Governing Authority:</strong> {current.keyStatutes}
          </span>
          <Link
            href="/settlement-agreement-review/"
            className="text-coral hover:underline font-semibold"
          >
            Review my exit agreement terms with a specialist solicitor →
          </Link>
        </div>
      </div>
    </div>
  )
}