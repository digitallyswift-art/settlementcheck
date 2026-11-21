'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { calcRedundancy, WEEKLY_CAP_GB, WEEKLY_CAP_NI } from '@/lib/calculations'
import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates'
import { trackSolicitorMatchClick } from '@/lib/telemetry'
import { AcasWatchdog } from '@/components/AcasWatchdog'
import { WithoutPrejudiceClarification } from '@/components/WithoutPrejudiceClarification'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'

type FeeStatus = 'standard' | 'under_350' | 'none_stated' | 'not_sure'
type NoticeStatus = 'separated' | 'bundled' | 'working_notice' | 'not_sure'
type TaxThresholdStatus = 'under_30k' | 'over_30k' | 'not_sure'
type TriState = 'yes' | 'no' | 'not_sure'
type Jurisdiction = 'GB' | 'NI'

interface ChecklistFlag {
  id: string
  status: 'action' | 'watch' | 'info'
  title: string
  detail: string
  legislation: string
}

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
        <span>i</span> {label} {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-lg text-xs leading-relaxed text-[#4A5568]">
          {children}
        </div>
      )}
    </div>
  )
}

export default function ReviewClient() {
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState<'checklist' | 'watchdog' | 'agenda'>('checklist')
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>('GB')

  // Structured zero-PII checklist state
  const [feeStatus, setFeeStatus] = useState<FeeStatus>('not_sure')
  const [noticeStatus, setNoticeStatus] = useState<NoticeStatus>('not_sure')
  const [taxStatus, setTaxStatus] = useState<TaxThresholdStatus>('not_sure')
  const [hasCovenants, setHasCovenants] = useState<TriState>('not_sure')
  const [hasPensionOrPiWaiver, setHasPensionOrPiWaiver] = useState<TriState>('not_sure')
  const [hasReferenceAndMutual, setHasReferenceAndMutual] = useState<TriState>('not_sure')

  // Optional numeric baseline fields (processed strictly in-browser)
  const [salary, setSalary] = useState('')
  const [yearsOfService, setYearsOfService] = useState('')
  const [age, setAge] = useState('')
  const [exGratiaOffer, setExGratiaOffer] = useState('')

  const [showSummary, setShowSummary] = useState(false)
  const [copiedAgenda, setCopiedAgenda] = useState(false)

  useEffect(() => {
    if (!searchParams) return
    const pSalary = searchParams.get('salary')
    const pYears = searchParams.get('years') || searchParams.get('yearsOfService')
    const pAge = searchParams.get('age')
    const pOffer = searchParams.get('offer')

    if (pSalary) setSalary(pSalary.replace(/[^0-9]/g, ''))
    if (pYears) setYearsOfService(pYears.replace(/[^0-9]/g, ''))
    if (pAge) setAge(pAge.replace(/[^0-9]/g, ''))
    if (pOffer) {
      const cleanOffer = pOffer.replace(/[^0-9]/g, '')
      setExGratiaOffer(cleanOffer)
      const num = Number(cleanOffer)
      if (num > 30000) setTaxStatus('over_30k')
      else if (num > 0) setTaxStatus('under_30k')
    }
  }, [searchParams])

  const weeklyCap = jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB
  const waiverActLabel =
    jurisdiction === 'NI'
      ? 'Employment Rights (Northern Ireland) Order 1996 art. 245'
      : 'Employment Rights Act 1996 s.203(3)'

  const numericSalary = Number(salary) || 0
  const numericYears = Number(yearsOfService) || 0
  const numericAge = Number(age) || 0
  const numericOffer = Number(exGratiaOffer) || 0

  const calculatedRedundancyBaseline = useMemo(() => {
    if (numericSalary > 0 && numericYears >= 2 && numericAge >= 18) {
      return calcRedundancy(numericSalary, numericYears * 12, numericAge, weeklyCap)
    }
    return null
  }, [numericSalary, numericYears, numericAge, weeklyCap])

  const flags = useMemo<ChecklistFlag[]>(() => {
    const items: ChecklistFlag[] = []

    // 1. Employer legal fee contribution (Trap 5 compliant)
    if (feeStatus === 'none_stated') {
      items.push({
        id: 'fee',
        status: 'action',
        title: 'Employer Legal Fee Contribution Not Recorded',
        detail:
          'While independent legal advice is required to validate a statutory waiver, employer fee contributions are a commercial convention rather than a legal obligation. Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) paid directly to your solicitor upon completion. Discuss with your solicitor whether to ask the employer to include a fee contribution and confirm engagement terms for any abortive or excess costs.',
        legislation: waiverActLabel,
      })
    } else if (feeStatus === 'under_350') {
      items.push({
        id: 'fee',
        status: 'watch',
        title: 'Employer Fee Contribution Below Typical Commercial Range',
        detail:
          'Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) upon completion. A lower cap may leave a balance payable under your solicitor’s terms if detailed negotiation is needed. Confirm fee scope and abortive-cost terms with your instructed solicitor before starting work.',
        legislation: waiverActLabel,
      })
    } else if (feeStatus === 'standard') {
      items.push({
        id: 'fee',
        status: 'info',
        title: 'Employer Legal Fee Contribution Recorded',
        detail:
          'A contribution in the standard commercial range (£350 to £500+ plus VAT upon completion) is noted. Your instructed solicitor will confirm whether this covers a standard review and outline their terms if negotiations extend beyond the cap or the agreement does not complete.',
        legislation: waiverActLabel,
      })
    } else {
      items.push({
        id: 'fee',
        status: 'watch',
        title: 'Check Employer Legal Fee Contribution Clause',
        detail:
          'Locate the legal fees clause in your draft agreement. Employers standardly provide a capped commercial contribution (typically £350 to £500+ plus VAT) payable upon completion. Confirm with your solicitor how fees exceeding the cap or abortive costs are handled.',
        legislation: waiverActLabel,
      })
    }

    // 2. Notice pay / PILON & PENP separation
    if (noticeStatus === 'bundled' || noticeStatus === 'not_sure') {
      items.push({
        id: 'pilon',
        status: 'action',
        title: 'Verify Notice Pay (PILON / PENP) Separation',
        detail:
          'Under ITEPA 2003 s.402D, any unworked notice period is treated as Post-Employment Notice Pay (PENP) and taxed as normal earnings (income tax and Class 1 NICs), even if bundled into an ex-gratia lump sum. Ask your solicitor to confirm contractual notice pay is clearly separated from the s.403 termination payment.',
        legislation: 'ITEPA 2003 s.402D',
      })
    } else if (noticeStatus === 'separated') {
      items.push({
        id: 'pilon',
        status: 'info',
        title: 'Notice Pay (PILON) Separated from Ex-Gratia Sum',
        detail:
          'Separating taxable PILON from genuine termination compensation helps align the draft with HMRC PENP rules. Your solicitor can verify that the notice calculation matches your contractual and statutory notice entitlement.',
        legislation: 'ITEPA 2003 s.402D',
      })
    } else {
      items.push({
        id: 'pilon',
        status: 'info',
        title: 'Working Notice Period Recorded',
        detail:
          'Working your full notice period avoids an unworked PENP deduction from the £30,000 exemption, as normal salary during notice is taxed through PAYE as usual.',
        legislation: 'ITEPA 2003 s.402D',
      })
    }

    // 3. £30,000 Tax-Free Cap & Employer Class 1A NIC
    const isOver30k = taxStatus === 'over_30k' || numericOffer > STATUTORY_RATES_2026_27.taxFreeLimit
    if (isOver30k) {
      items.push({
        id: 'tax',
        status: 'watch',
        title: 'Termination Payment Above £30,000 Tax-Free Cap',
        detail: `Under ITEPA 2003 s.403, the first £30,000 of genuine ex-gratia compensation and statutory redundancy pay is exempt from income tax and National Insurance (subject to PENP rules). Amounts above £30,000 are subject to income tax at your marginal rate and employer Class 1A NIC (${(STATUTORY_RATES_2026_27.employerClass1ANICRate * 100).toFixed(1)}% in 2026/27), while employee NIC remains 0%. Discuss tax allocation and any employer pension contribution options with your solicitor.`,
        legislation: 'ITEPA 2003 s.403',
      })
    } else {
      items.push({
        id: 'tax',
        status: 'info',
        title: '£30,000 Tax-Free Cap (ITEPA 2003 s.403)',
        detail:
          'Genuine termination compensation and statutory redundancy pay up to the £30,000 statutory cap are exempt from income tax and National Insurance, provided contractual earnings, accrued holiday pay, PENP (s.402D), and any separate restrictive covenant payments (s.225) are taxed separately.',
        legislation: 'ITEPA 2003 s.403',
      })
    }

    // 4. Restrictive Covenants & s.225 Tax Consideration
    if (hasCovenants === 'yes' || hasCovenants === 'not_sure') {
      items.push({
        id: 'covenants',
        status: hasCovenants === 'yes' ? 'action' : 'watch',
        title: 'Post-Termination Restrictions & ITEPA s.225 Review',
        detail:
          'Discuss any new or restated non-compete, non-solicitation, or non-dealing clauses with your independent solicitor. Key discussion points include scope and duration (Tillman v Egon Zehnder [2019] UKSC 32), garden leave set-off, and whether separate consideration is allocated to covenants (which is taxable under PAYE and Class 1 NICs under ITEPA 2003 s.225 rather than the £30,000 exemption).',
        legislation: 'ITEPA 2003 s.225 / Tillman [2019] UKSC 32',
      })
    }

    // 5. Accrued Pension Rights & Future Personal Injury Carve-Outs
    if (hasPensionOrPiWaiver === 'yes' || hasPensionOrPiWaiver === 'not_sure') {
      items.push({
        id: 'waivers',
        status: hasPensionOrPiWaiver === 'yes' ? 'action' : 'watch',
        title: 'Accrued Pension Rights & Personal Injury Carve-Outs',
        detail:
          'Independent solicitors routinely check that the general waiver expressly carves out accrued occupational pension rights (inalienable under Pensions Act 1995 s.91), unknown future personal injury claims (BCCI v Ali [2001] UKHL 8), and claims to enforce the settlement agreement itself.',
        legislation: 'Pensions Act 1995 s.91 / BCCI v Ali [2001]',
      })
    }

    // 6. Agreed Reference & Mutual Non-Derogatory Clauses
    if (hasReferenceAndMutual === 'no' || hasReferenceAndMutual === 'not_sure') {
      items.push({
        id: 'reference',
        status: 'watch',
        title: 'Agreed Reference Schedule & Mutual Non-Derogatory Wording',
        detail:
          'Draft agreements often bind the employee to confidentiality and non-derogatory obligations without equivalent employer obligations or an agreed factual reference attached as a schedule. Add these points to your solicitor discussion agenda.',
        legislation: 'Commercial Practice / ACAS Guidance',
      })
    }

    // 7. Calculated Statutory Redundancy Baseline (Trap 4 compliant)
    if (calculatedRedundancyBaseline !== null && numericOffer > 0) {
      if (numericOffer < calculatedRedundancyBaseline) {
        items.push({
          id: 'baseline',
          status: 'action',
          title: 'Recorded Offer Below Calculated Statutory Redundancy Baseline',
          detail: `Your recorded ex-gratia figure (${formatGBP(numericOffer)}) is below the calculated statutory redundancy baseline of ${formatGBP(calculatedRedundancyBaseline)} (using the April 2026 ${jurisdiction} weekly pay cap of £${weeklyCap}). Note that statutory redundancy is subject to eligibility (ERA 1996 s.141 on unreasonable refusal of suitable alternative employment) and does not apply in cases of lawful dismissal for gross misconduct.`,
          legislation: jurisdiction === 'NI' ? 'ERO(NI) 1996' : 'ERA 1996 s.141 & s.162',
        })
      } else {
        items.push({
          id: 'baseline',
          status: 'info',
          title: 'Calculated Statutory Redundancy Baseline (Subject to Eligibility)',
          detail: `Your calculated statutory redundancy baseline is ${formatGBP(calculatedRedundancyBaseline)} (using the April 2026 ${jurisdiction} weekly pay cap of £${weeklyCap}, subject to eligibility under ERA 1996 s.141 and absence of gross misconduct). Your recorded ex-gratia figure of ${formatGBP(numericOffer)} is at or above this statutory redundancy baseline.`,
          legislation: jurisdiction === 'NI' ? 'ERO(NI) 1996' : 'ERA 1996 s.141 & s.162',
        })
      }
    }

    return items
  }, [
    feeStatus,
    noticeStatus,
    taxStatus,
    hasCovenants,
    hasPensionOrPiWaiver,
    hasReferenceAndMutual,
    calculatedRedundancyBaseline,
    numericOffer,
    jurisdiction,
    weeklyCap,
    waiverActLabel,
  ])

  const solicitorAgendaText = useMemo(() => {
    const lines = [
      'INTAKE AGENDA FOR YOUR INSTRUCTED SOLICITOR: PRE-CONSULTATION CLAUSE CHECKLIST',
      '',
      `Jurisdiction: ${jurisdiction === 'NI' ? 'Northern Ireland (£783/wk cap)' : 'Great Britain (£751/wk cap)'}`,
      numericOffer > 0 ? `Recorded Ex-Gratia Offer: ${formatGBP(numericOffer)}` : 'Recorded Ex-Gratia Offer: Not entered',
      calculatedRedundancyBaseline !== null
        ? `Calculated Statutory Redundancy Baseline (Subject to Eligibility): ${formatGBP(calculatedRedundancyBaseline)}`
        : 'Calculated Statutory Redundancy Baseline: Not calculated (optional context not entered)',
      '',
      'POINTS TO DISCUSS WITH YOUR INDEPENDENT SRA-REGULATED SOLICITOR:',
      ...flags.map((f, idx) => `${idx + 1}. ${f.title} (${f.legislation}): ${f.detail}`),
      '',
      'Important Privilege Notice: Do not send unreviewed financial proposals directly to HR; unreviewed correspondence can inadvertently waive legal privilege or compromise your position.',
    ]
    return lines.join('\n')
  }, [jurisdiction, numericOffer, calculatedRedundancyBaseline, flags])

  const handleCopyAgenda = async () => {
    try {
      await navigator.clipboard.writeText(solicitorAgendaText)
      setCopiedAgenda(true)
      setTimeout(() => setCopiedAgenda(false), 3000)
    } catch {
      setCopiedAgenda(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Persistent SRA Rule 5.1 Independent Introducer & Non-Law-Firm Notice */}
      <div className="mb-6 p-4 bg-card border border-rule rounded-xl text-xs leading-relaxed text-muted">
        <strong className="text-ink font-semibold block mb-1">
          Independent Informational Checklist (Not Legal Advice, SRA Rule 5.1 Transparency)
        </strong>
        SettlementCheck is an independent statutory information platform and solicitor introducer, not an SRA-regulated law firm. This checklist runs entirely in your browser with zero document uploads or free-text data collection. Any SRA-regulated solicitor you choose to instruct acts solely in your independent best interest under {waiverActLabel}.
      </div>

      {/* Interactive Tool Suite Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'checklist'
              ? 'bg-[#0B1F3A] text-white shadow-sm'
              : 'bg-white text-[#0B1F3A] border border-[#E2DCCE] hover:border-[#0B1F3A]'
          }`}
        >
          1. Clause &amp; Offer Checklist
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('watchdog')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'watchdog'
              ? 'bg-[#0B1F3A] text-white shadow-sm'
              : 'bg-white text-[#0B1F3A] border border-[#E2DCCE] hover:border-[#0B1F3A]'
          }`}
        >
          2. ACAS 10-Day Timeline Checker
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('agenda')}
          className={`px-4 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'agenda'
              ? 'bg-[#0B1F3A] text-white shadow-sm'
              : 'bg-white text-[#0B1F3A] border border-[#E2DCCE] hover:border-[#0B1F3A]'
          }`}
        >
          3. Solicitor Intake Agenda
        </button>
      </div>

      {/* Tab 2: ACAS Watchdog */}
      {activeTab === 'watchdog' && (
        <div className="mb-8">
          <AcasWatchdog />
        </div>
      )}

      {/* Tab 3: Solicitor Intake Agenda */}
      {activeTab === 'agenda' && (
        <div className="mb-8">
          <WithoutPrejudiceClarification
            initialOfferAmount={numericOffer > 0 ? numericOffer : undefined}
          />
        </div>
      )}

      {/* Tab 1: Zero-PII Deterministic Clause & Offer Readiness Checklist */}
      {activeTab === 'checklist' && (
        <div className="space-y-6 mb-8">
          <div className="bg-card border border-rule rounded-xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rule pb-4 mb-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-coral font-semibold block mb-0.5">
                  Zero-Upload Browser Checklist
                </span>
                <h2 className="text-xl font-serif font-bold text-ink m-0">
                  Pre-Solicitor Clause Readiness Check
                </h2>
              </div>
              <span className="text-xs font-mono text-muted bg-paper px-2.5 py-1 rounded border border-rule self-start sm:self-auto">
                No document upload required
              </span>
            </div>

            <div className="space-y-6">
              {/* Jurisdiction */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-2">
                  Jurisdiction (Statutory Weekly Cap &amp; Waiver Act)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setJurisdiction('GB')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      jurisdiction === 'GB'
                        ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                        : 'bg-paper text-ink border-rule hover:border-ink'
                    }`}
                  >
                    <div className="font-semibold">Great Britain (England, Scotland, Wales)</div>
                    <div className={`text-[11px] mt-0.5 ${jurisdiction === 'GB' ? 'text-white/80' : 'text-muted'}`}>
                      April 2026 cap: £751/week · ERA 1996 s.203(3)
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setJurisdiction('NI')}
                    className={`p-3 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      jurisdiction === 'NI'
                        ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                        : 'bg-paper text-ink border-rule hover:border-ink'
                    }`}
                  >
                    <div className="font-semibold">Northern Ireland</div>
                    <div className={`text-[11px] mt-0.5 ${jurisdiction === 'NI' ? 'text-white/80' : 'text-muted'}`}>
                      April 2026 cap: £783/week · ERO(NI) 1996 art. 245
                    </div>
                  </button>
                </div>
              </div>

              {/* 6 Structured Clause Questions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-rule">
                {/* Q1 */}
                <div>
                  <label htmlFor="fee-select" className="block text-xs font-semibold text-ink mb-1.5">
                    1. Employer Legal Fee Contribution
                  </label>
                  <select
                    id="fee-select"
                    value={feeStatus}
                    onChange={(e) => setFeeStatus(e.target.value as FeeStatus)}
                    className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    <option value="not_sure">Not sure / need to check</option>
                    <option value="standard">£350 to £500+ plus VAT stated</option>
                    <option value="under_350">Under £350 plus VAT stated</option>
                    <option value="none_stated">No legal fee contribution stated</option>
                  </select>
                </div>

                {/* Q2 */}
                <div>
                  <label htmlFor="notice-select" className="block text-xs font-semibold text-ink mb-1.5">
                    2. Notice Pay / PILON Separation
                  </label>
                  <select
                    id="notice-select"
                    value={noticeStatus}
                    onChange={(e) => setNoticeStatus(e.target.value as NoticeStatus)}
                    className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    <option value="not_sure">Not sure / need to check</option>
                    <option value="separated">Separated clearly from ex-gratia sum</option>
                    <option value="bundled">Bundled into a single lump sum</option>
                    <option value="working_notice">Working full notice period</option>
                  </select>
                </div>

                {/* Q3 */}
                <div>
                  <label htmlFor="tax-select" className="block text-xs font-semibold text-ink mb-1.5">
                    3. Ex-Gratia Sum vs £30,000 Tax-Free Cap
                  </label>
                  <select
                    id="tax-select"
                    value={taxStatus}
                    onChange={(e) => setTaxStatus(e.target.value as TaxThresholdStatus)}
                    className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    <option value="not_sure">Not sure / no figure yet</option>
                    <option value="under_30k">£30,000 or less</option>
                    <option value="over_30k">Over £30,000</option>
                  </select>
                </div>

                {/* Q4 */}
                <div>
                  <label htmlFor="covenant-select" className="block text-xs font-semibold text-ink mb-1.5">
                    4. Post-Termination Restrictions (Non-Compete / Non-Solicit)
                  </label>
                  <select
                    id="covenant-select"
                    value={hasCovenants}
                    onChange={(e) => setHasCovenants(e.target.value as TriState)}
                    className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    <option value="not_sure">Not sure / need to check</option>
                    <option value="yes">Yes, new or restated restrictions included</option>
                    <option value="no">No post-termination restrictions</option>
                  </select>
                </div>

                {/* Q5 */}
                <div>
                  <label htmlFor="waiver-select" className="block text-xs font-semibold text-ink mb-1.5">
                    5. Pension or Future Personal Injury Waiver Wording
                  </label>
                  <select
                    id="waiver-select"
                    value={hasPensionOrPiWaiver}
                    onChange={(e) => setHasPensionOrPiWaiver(e.target.value as TriState)}
                    className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    <option value="not_sure">Not sure / need to check</option>
                    <option value="yes">Yes, broad waiver without clear carve-outs</option>
                    <option value="no">No, carve-outs explicitly included</option>
                  </select>
                </div>

                {/* Q6 */}
                <div>
                  <label htmlFor="reference-select" className="block text-xs font-semibold text-ink mb-1.5">
                    6. Agreed Reference &amp; Mutual Non-Derogatory Clause
                  </label>
                  <select
                    id="reference-select"
                    value={hasReferenceAndMutual}
                    onChange={(e) => setHasReferenceAndMutual(e.target.value as TriState)}
                    className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper text-ink focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                  >
                    <option value="not_sure">Not sure / need to check</option>
                    <option value="yes">Yes, both included in draft</option>
                    <option value="no">No, missing or one-sided</option>
                  </select>
                </div>
              </div>

              <InfoPill label="Six statutory conditions for a valid settlement agreement (ERA 1996 s.203(3))">
                Under Section 203(3) of the Employment Rights Act 1996 (and art. 245 ERO(NI) 1996 in Northern Ireland), a settlement agreement waiving statutory employment claims is only legally binding if all six conditions are met: (1) it is in writing; (2) it relates to the particular complaint or proceedings (see also <em>Bathgate v Technip Singapore PTE Ltd [2023] CSIH 48</em> on plain and unequivocal drafting); (3) the employee has received advice from a relevant independent adviser; (4) the adviser has professional indemnity insurance in force; (5) the agreement identifies the adviser; and (6) the agreement states that the statutory conditions regulating settlement agreements are satisfied.
              </InfoPill>

              {/* Optional Numeric Baseline Inputs */}
              <div className="pt-4 border-t border-rule">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                  Optional Figures (Calculates Statutory Redundancy Baseline, Subject to Eligibility)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label htmlFor="salary-input" className="block text-xs font-medium text-ink mb-1">
                      Gross Annual Salary (£)
                    </label>
                    <input
                      id="salary-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 55000"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                      className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="service-input" className="block text-xs font-medium text-ink mb-1">
                      Complete Years of Service
                    </label>
                    <input
                      id="service-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 4"
                      value={yearsOfService}
                      onChange={(e) => setYearsOfService(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                      className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="age-input" className="block text-xs font-medium text-ink mb-1">
                      Age
                    </label>
                    <input
                      id="age-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 38"
                      value={age}
                      onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                      className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                  </div>
                  <div>
                    <label htmlFor="offer-input" className="block text-xs font-medium text-ink mb-1">
                      Proposed Ex-Gratia Offer (£)
                    </label>
                    <input
                      id="offer-input"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 15000"
                      value={exGratiaOffer}
                      onChange={(e) => setExGratiaOffer(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                      className="w-full p-2.5 border border-rule rounded-lg text-sm bg-paper focus:bg-white focus:outline-none focus:ring-2 focus:ring-ink"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSummary(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-coral hover:bg-coral-ink text-white font-medium rounded-lg text-sm transition-colors shadow-sm cursor-pointer"
                >
                  Generate Solicitor Discussion Checklist →
                </button>
              </div>
            </div>
          </div>

          {/* Deterministic Checklist Output */}
          {showSummary && (
            <div className="bg-card border border-rule rounded-xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-coral font-semibold block mb-0.5">
                    Deterministic Statutory Briefing
                  </span>
                  <h2 className="text-xl font-serif font-bold text-ink m-0">
                    Your Pre-Solicitor Clause Checklist
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={handleCopyAgenda}
                  className="px-4 py-2 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {copiedAgenda ? '✓ Agenda Copied' : 'Copy Solicitor Agenda'}
                </button>
              </div>

              {/* Statutory Summary Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-paper p-3.5 rounded-lg border border-rule">
                  <span className="text-xs text-muted block mb-1">Weekly Pay Cap (2026/27)</span>
                  <span className="text-lg font-bold text-ink">£{weeklyCap}/wk ({jurisdiction})</span>
                </div>
                <div className="bg-paper p-3.5 rounded-lg border border-rule">
                  <span className="text-xs text-muted block mb-1">Tax-Free Cap (s.403)</span>
                  <span className="text-lg font-bold text-ink">£30,000</span>
                </div>
                <div className="bg-paper p-3.5 rounded-lg border border-rule">
                  <span className="text-xs text-muted block mb-1">Recorded Ex-Gratia Offer</span>
                  <span className="text-lg font-bold text-ink">
                    {numericOffer > 0 ? formatGBP(numericOffer) : 'Not recorded'}
                  </span>
                </div>
                <div className="bg-paper p-3.5 rounded-lg border border-rule">
                  <span className="text-xs text-muted block mb-1">Statutory Baseline (Est.)</span>
                  <span className="text-lg font-bold text-ink">
                    {calculatedRedundancyBaseline !== null
                      ? formatGBP(calculatedRedundancyBaseline)
                      : 'Enter context'}
                  </span>
                </div>
              </div>

              {/* Checklist Flags */}
              <div className="space-y-3">
                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className={`p-4 rounded-lg border text-sm flex flex-col sm:flex-row sm:items-start justify-between gap-3 ${
                      flag.status === 'action'
                        ? 'bg-[#FEF5F3] border-[#F3C4B8] text-ink'
                        : flag.status === 'watch'
                        ? 'bg-[#FEFBF0] border-[#E0CB94] text-ink'
                        : 'bg-paper border-rule text-ink'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded font-mono font-semibold uppercase ${
                            flag.status === 'action'
                              ? 'bg-[#D9603B] text-white'
                              : flag.status === 'watch'
                              ? 'bg-[#7A5B15] text-white'
                              : 'bg-[#0B1F3A] text-white'
                          }`}
                        >
                          {flag.status === 'action'
                            ? 'Priority Topic'
                            : flag.status === 'watch'
                            ? 'Check With Solicitor'
                            : 'Statutory Note'}
                        </span>
                        <span className="font-semibold text-ink">{flag.title}</span>
                      </div>
                      <p className="text-body sm:text-body text-ink/90 leading-relaxed m-0">{flag.detail}</p>
                    </div>
                    <span className="text-[11px] text-muted whitespace-nowrap self-end sm:self-auto font-mono">
                      {flag.legislation}
                    </span>
                  </div>
                ))}
              </div>

              {/* High-Intent Next Step Box */}
              <div className="bg-ink text-paper p-6 sm:p-8 rounded-xl space-y-4">
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-coral font-semibold block">
                    Independent Solicitor Review • {waiverActLabel}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white m-0">
                    Connect with an Independent SRA-Regulated Employment Solicitor
                  </h3>
                  <p className="text-body sm:text-body text-paper opacity-90 max-w-2xl leading-relaxed m-0">
                    For a settlement agreement to be legally binding, you must receive independent legal advice. Employers standardly provide a capped commercial contribution (typically £350 to £500+ plus VAT) paid directly to your solicitor upon completion. Your solicitor will confirm all fee terms, including any abortive or excess costs, before starting work.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/get-matched/?offer=${numericOffer}&salary=${numericSalary}&months=${numericYears * 12}`}
                    onClick={() =>
                      trackSolicitorMatchClick('review_checklist_cta', {
                        offer: numericOffer || undefined,
                        salary: numericSalary || undefined,
                      })
                    }
                    className="inline-flex justify-center items-center px-6 py-3.5 bg-coral hover:bg-coral-ink text-white font-semibold rounded-lg text-sm transition-colors text-center shadow-md"
                  >
                    Match with an SRA solicitor →
                  </Link>
                  <Link
                    href="/calculator/"
                    className="inline-flex justify-center items-center px-5 py-3.5 bg-transparent border border-paper text-white hover:bg-white hover:text-ink font-medium rounded-lg text-sm transition-colors text-center"
                  >
                    Open full settlement calculator
                  </Link>
                  <Link
                    href="/tribunal-backlog-tracker/"
                    className="inline-flex justify-center items-center px-5 py-3.5 bg-transparent border border-rule text-paper opacity-85 hover:opacity-100 hover:text-white font-medium rounded-lg text-sm transition-colors text-center"
                  >
                    Check Tribunal Wait Times
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Persistent Mandatory Regulatory Disclaimers across ALL tabs */}
      <MandatoryLegalDisclaimers className="mt-6" />
    </div>
  )
}
