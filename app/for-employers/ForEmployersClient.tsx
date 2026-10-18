'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import { STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates'

export default function ForEmployersClient() {
  const [activeTab, setActiveTab] = useState<'calculator' | 's111a' | 'dispatch'>('calculator')

  // Redundancy & Exit Modeler State
  const [headcount, setHeadcount] = useState<number>(5)
  const [avgSalary, setAvgSalary] = useState<number>(42000)
  const [avgTenure, setAvgTenure] = useState<number>(4)
  const [ageBand, setAgeBand] = useState<'under22' | '22to40' | '41plus'>('22to40')
  const [packageType, setPackageType] = useState<'statutory' | '1.5x' | '2.0x' | 'custom'>('1.5x')
  const [customLumpSum, setCustomLumpSum] = useState<number>(5000)
  const [noticeWeeks, setNoticeWeeks] = useState<number>(4)
  const [pilonIncluded, setPilonIncluded] = useState<boolean>(true)
  const [legalFeeContribution, setLegalFeeContribution] = useState<number>(500)

  // s.111A Template State
  const [companyName, setCompanyName] = useState<string>('Acme Enterprises Ltd')
  const [employeeName, setEmployeeName] = useState<string>('[Employee Name]')
  const [proposalDate, setProposalDate] = useState<string>('2026-10-20')
  const [copiedTemplate, setCopiedTemplate] = useState<boolean>(false)

  // Dispatch Intake Form State
  const [dispatchOrg, setDispatchOrg] = useState<string>('')
  const [dispatchName, setDispatchName] = useState<string>('')
  const [dispatchEmail, setDispatchEmail] = useState<string>('')
  const [dispatchPhone, setDispatchPhone] = useState<string>('')
  const [dispatchHeadcount, setDispatchHeadcount] = useState<string>('5-10')
  const [dispatchTimeline, setDispatchTimeline] = useState<string>('1-2 weeks')
  const [dispatchNotes, setDispatchNotes] = useState<string>('')
  const [dispatchSubmitted, setDispatchSubmitted] = useState<boolean>(false)

  // Deterministic Mathematical Modeling
  const ageMultiplier = ageBand === 'under22' ? 0.5 : ageBand === '41plus' ? 1.5 : 1.0
  const weeklyPay = avgSalary / 52
  const cappedWeeklyPay = Math.min(weeklyPay, STATUTORY_RATES_2026_27.weeklyCapGB)
  const cappedTenure = Math.min(avgTenure, STATUTORY_RATES_2026_27.maxServiceYears)
  const statRedundancyPerHead = Math.round(cappedWeeklyPay * cappedTenure * ageMultiplier)

  let exGratiaPerHead = 0
  if (packageType === '1.5x') {
    exGratiaPerHead = Math.round(statRedundancyPerHead * 0.5)
  } else if (packageType === '2.0x') {
    exGratiaPerHead = Math.round(statRedundancyPerHead * 1.0)
  } else if (packageType === 'custom') {
    exGratiaPerHead = customLumpSum
  }

  const totalSeverancePerHead = statRedundancyPerHead + exGratiaPerHead
  const taxExemptSeverancePerHead = Math.min(totalSeverancePerHead, STATUTORY_RATES_2026_27.taxFreeLimit)
  const taxableSeverancePerHead = Math.max(0, totalSeverancePerHead - STATUTORY_RATES_2026_27.taxFreeLimit)

  // Employer Class 1A NIC (15.0% for 2026/27 on ex-gratia sums in excess of £30k)
  const class1aNicPerHead = Math.round(taxableSeverancePerHead * STATUTORY_RATES_2026_27.employerClass1ANICRate)
  const totalClass1aNic = class1aNicPerHead * headcount

  // Notice pay (PILON)
  const pilonPerHead = pilonIncluded ? Math.round(weeklyPay * noticeWeeks) : 0
  const totalPilon = pilonPerHead * headcount

  // Aggregated pools
  const totalStatutoryPool = statRedundancyPerHead * headcount
  const totalExGratiaPool = exGratiaPerHead * headcount
  const totalLegalFeePool = legalFeeContribution * headcount
  const grandTotalCost = totalStatutoryPool + totalExGratiaPool + totalPilon + totalClass1aNic + totalLegalFeePool

  // Collective Redundancy Consultation Timetable (TULRCA 1992 s.188)
  const isCollective100Plus = headcount >= 100
  const isCollective20Plus = headcount >= 20 && headcount < 100
  const consultationDays = isCollective100Plus ? 45 : isCollective20Plus ? 30 : 14
  const hr1Required = headcount >= 20

  const handleCopyTemplate = () => {
    const templateText = `STRICTLY PRIVATE & CONFIDENTIAL / WITHOUT PREJUDICE & SUBJECT TO CONTRACT
UNDER SECTION 111A OF THE EMPLOYMENT RIGHTS ACT 1996

Date: ${proposalDate}

To: ${employeeName}
From: Human Resources, ${companyName}

Dear ${employeeName},

RE: SETTLEMENT PROPOSAL AND SECTION 111A PRE-TERMINATION DISCUSSIONS

We write to confirm our recent confidential discussions regarding your employment with ${companyName}. As previously outlined, this letter and any associated discussions are held pursuant to Section 111A of the Employment Rights Act 1996. They cannot be referred to in subsequent ordinary unfair dismissal proceedings before an Employment Tribunal.

1. PROPOSED EXIT TERMS
Subject to entering into a formal Section 203 Settlement Agreement:
- Termination Date: By mutual agreement.
- Statutory Redundancy Payment: £${statRedundancyPerHead.toLocaleString()} (tax-free under ITEPA 2003 s.403).
- Ex-Gratia Compensatory Payment: £${exGratiaPerHead.toLocaleString()} (tax-exempt up to the £30,000 threshold).
${pilonIncluded ? `- Payment in Lieu of Notice (PILON): £${pilonPerHead.toLocaleString()} (${noticeWeeks} weeks gross, subject to PAYE and Class 1 NICs under s.402D).` : '- Notice: To be worked as contractual notice.'}
- Standard Agreed Reference: Factual dates and job title provided upon request.

2. EMPLOYER LEGAL FEE CONTRIBUTION
In accordance with standard UK employment practice and Section 203(3) of the Employment Rights Act 1996, ${companyName} will pay up to £${legalFeeContribution.toLocaleString()} + VAT directly to your chosen independent SRA-regulated solicitor for reviewing and signing the agreement.

3. ACAS CODE 4 CONSIDERATION PERIOD
In strict accordance with ACAS Code of Practice 4 Paragraph 18, you are afforded a minimum of 10 calendar days from receipt of this proposal to consider these terms and obtain independent legal advice. There is no obligation to accept this offer, and your existing contractual rights remain unaffected during this period.

Please confirm whether you wish to proceed to the formal drafting stage by contacting Human Resources.

Yours sincerely,

Human Resources Director
${companyName}`

    navigator.clipboard.writeText(templateText)
    setCopiedTemplate(true)
    setTimeout(() => setCopiedTemplate(false), 3000)
  }

  const EMPLOYER_FAQS: FaqItem[] = [
    {
      q: 'Can an employer propose a settlement agreement without triggering an unfair dismissal claim?',
      a: 'Yes. Under Section 111A of the Employment Rights Act 1996, employers can initiate confidential pre-termination discussions without an existing dispute. Provided there is no "improper behaviour" (such as ultimatums or unworkable deadlines under ACAS Code 4), these discussions are inadmissible in ordinary unfair dismissal tribunal proceedings.',
    },
    {
      q: 'Why is an employer required to pay for the employee’s independent solicitor?',
      a: 'Under Section 203(3) of the Employment Rights Act 1996, an employee cannot legally waive statutory employment tribunal claims unless they receive advice from a qualified, insured independent adviser (an SRA-regulated solicitor). To make the waiver legally binding, employers cover this fee as standard practice, typically contributing £350 to £750 + VAT.',
    },
    {
      q: 'What are the statutory collective redundancy thresholds under TULRCA 1992?',
      a: 'Under Section 188 of the Trade Union and Labour Relations (Consolidation) Act 1992, employers proposing 20 to 99 redundancies at one establishment must consult employee representatives for at least 30 days and file Form HR1. For 100 or more redundancies, the minimum consultation period is 45 days. Failure to comply exposes the employer to protective awards of up to 90 days gross pay per employee.',
    },
    {
      q: 'What employer National Insurance applies to settlement termination payments?',
      a: 'Under the Autumn Budget rules effective April 2026, employer Class 1A National Insurance Contributions are charged at 15.0% on ex-gratia termination payments that exceed the £30,000 Section 403 ITEPA exemption. Notice pay (PILON) is treated as general earnings under s.402D and is subject to standard Class 1 secondary NICs.',
    },
    {
      q: 'How does SettlementCheck streamline the Section 203 sign-off process for employers?',
      a: 'Rather than coordinating with dozens of disparate law firms, SettlementCheck enables employers to dispatch standard Section 203 review instructions directly to our nationwide network of verified SRA-regulated employment solicitors. Employees receive independent advice within 48 hours, and employers benefit from fixed-fee billing and unified compliance tracking.',
    },
  ]

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col font-sans">
      <Nav />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-paper border-b border-rule py-12 md:py-16">
          <div className="sc-container">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#0B1F3A]/5 text-[#0B1F3A] border border-[#0B1F3A]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                  B2B Workforce Solutions · Section 203 &amp; Collective Exits
                </span>
                <span className="text-[12px] text-muted font-medium">
                  Updated for April 2026 Statutory Rates (£751/week cap)
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0B1F3A] font-semibold tracking-tight leading-[1.15] mb-4">
                SettlementCheck for Employers &amp; HR Directors
              </h1>

              <p className="text-base md:text-lg text-muted leading-relaxed mb-8">
                Model collective redundancy severance budgets, generate statutory Section 111A protected conversation packs, and dispatch employee independent legal advice to our vetted SRA solicitor panel with rapid 48-hour panel turnaround standards.
              </p>

              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 p-1 bg-white rounded-xl border border-rule shadow-sm max-w-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('calculator')}
                  className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === 'calculator'
                      ? 'bg-[#0B1F3A] text-white shadow-sm'
                      : 'text-muted hover:text-ink hover:bg-paper'
                  }`}
                >
                  1. Exit &amp; Redundancy Modeler
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('s111a')}
                  className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === 's111a'
                      ? 'bg-[#0B1F3A] text-white shadow-sm'
                      : 'text-muted hover:text-ink hover:bg-paper'
                  }`}
                >
                  2. s.111A Letter Generator
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('dispatch')}
                  className={`flex-1 min-w-[150px] py-2.5 px-3 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === 'dispatch'
                      ? 'bg-[#0B1F3A] text-white shadow-sm'
                      : 'text-muted hover:text-ink hover:bg-paper'
                  }`}
                >
                  3. SRA Solicitor Dispatch
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tab 1: Interactive Redundancy & Exit Budget Modeler */}
        {activeTab === 'calculator' && (
          <section className="py-12 bg-canvas">
            <div className="sc-container">
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                {/* Inputs Column */}
                <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 border border-rule shadow-sm">
                  <div className="flex items-center justify-between border-b border-rule pb-4 mb-6">
                    <div>
                      <h2 className="text-xl font-serif font-semibold text-[#0B1F3A]">
                        Workforce Exit Budget Parameters
                      </h2>
                      <p className="text-xs text-muted mt-0.5">
                        Adjust variables to calculate statutory redundancy, ex-gratia packages, and tax liabilities.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-coral/10 text-coral rounded-md">
                      2026/27 Rates
                    </span>
                  </div>

                  <div className="space-y-6">
                    {/* Headcount */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label htmlFor="input-headcount" className="text-sm font-semibold text-ink">
                          Number of Affected Employees
                        </label>
                        <span className="text-sm font-bold text-coral">{headcount} staff</span>
                      </div>
                      <input
                        id="input-headcount"
                        type="range"
                        min="1"
                        max="150"
                        value={headcount}
                        onChange={(e) => setHeadcount(Number(e.target.value))}
                        className="w-full accent-[#D9603B] cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] text-muted mt-1">
                        <span>1 (Individual)</span>
                        <span>20 (Collective 30-day)</span>
                        <span>100+ (Collective 45-day)</span>
                      </div>
                    </div>

                    {/* Average Salary */}
                    <div>
                      <label htmlFor="input-avg-salary" className="block text-sm font-semibold text-ink mb-1.5">
                        Average Gross Annual Salary (£)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-medium">£</span>
                        <input
                          id="input-avg-salary"
                          type="number"
                          step="1000"
                          min="15000"
                          max="250000"
                          value={avgSalary}
                          onChange={(e) => setAvgSalary(Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral"
                        />
                      </div>
                      <p className="text-[11px] text-muted mt-1">
                        Statutory redundancy weekly pay cap: £{STATUTORY_RATES_2026_27.weeklyCapGB}/week (SI 2026/310).
                      </p>
                    </div>

                    {/* Average Continuous Service */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="input-avg-tenure" className="block text-sm font-semibold text-ink mb-1.5">
                          Average Length of Service (Years)
                        </label>
                        <input
                          id="input-avg-tenure"
                          type="number"
                          min="0"
                          max="20"
                          value={avgTenure}
                          onChange={(e) => setAvgTenure(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral"
                        />
                        <p className="text-[11px] text-muted mt-1">
                          Statutory cap is 20 continuous years.
                        </p>
                      </div>

                      {/* Age Band Distribution */}
                      <div>
                        <label htmlFor="select-age-band" className="block text-sm font-semibold text-ink mb-1.5">
                          Average Employee Age Band
                        </label>
                        <select
                          id="select-age-band"
                          value={ageBand}
                          onChange={(e) => setAgeBand(e.target.value as any)}
                          className="w-full px-3 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral bg-white"
                        >
                          <option value="under22">Under 22 years (0.5 wk per year)</option>
                          <option value="22to40">Aged 22 to 40 (1.0 wk per year)</option>
                          <option value="41plus">Aged 41 and older (1.5 wks per year)</option>
                        </select>
                        <p className="text-[11px] text-muted mt-1">
                          Employment Rights Act 1996 s.162 statutory multipliers.
                        </p>
                      </div>
                    </div>

                    {/* Ex-Gratia Package Scheme */}
                    <div>
                      <label htmlFor="select-package-scheme" className="block text-sm font-semibold text-ink mb-1.5">
                        Severance Package Multiplier
                      </label>
                      <select
                        id="select-package-scheme"
                        value={packageType}
                        onChange={(e) => setPackageType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral bg-white"
                      >
                        <option value="statutory">Statutory Redundancy Only (1.0x)</option>
                        <option value="1.5x">Enhanced: 1.5x Statutory Package (Standard)</option>
                        <option value="2.0x">Enhanced: 2.0x Statutory Package (Generous)</option>
                        <option value="custom">Custom Lump Sum per Employee</option>
                      </select>
                    </div>

                    {packageType === 'custom' && (
                      <div>
                        <label htmlFor="input-custom-lump-sum" className="block text-sm font-semibold text-ink mb-1.5">
                          Custom Ex-Gratia Lump Sum (£ per employee)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-medium">£</span>
                          <input
                            id="input-custom-lump-sum"
                            type="number"
                            step="500"
                            min="0"
                            value={customLumpSum}
                            onChange={(e) => setCustomLumpSum(Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral"
                          />
                        </div>
                      </div>
                    )}

                    {/* Notice Pay & Legal Fees */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-rule">
                      <div>
                        <label htmlFor="input-notice-weeks" className="block text-sm font-semibold text-ink mb-1.5">
                          Notice Period (Weeks)
                        </label>
                        <input
                          id="input-notice-weeks"
                          type="number"
                          min="0"
                          max="12"
                          value={noticeWeeks}
                          onChange={(e) => setNoticeWeeks(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral"
                        />
                        <div className="flex items-center gap-2 mt-2">
                          <input
                            type="checkbox"
                            id="pilonIncluded"
                            checked={pilonIncluded}
                            onChange={(e) => setPilonIncluded(e.target.checked)}
                            className="rounded border-rule text-coral focus:ring-coral accent-[#D9603B]"
                          />
                          <label htmlFor="pilonIncluded" className="text-xs text-muted">
                            Pay in lieu of notice (PILON)
                          </label>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="input-legal-fee" className="block text-sm font-semibold text-ink mb-1.5">
                          Employer Legal Fee Contribution (£/head)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted font-medium">£</span>
                          <input
                            id="input-legal-fee"
                            type="number"
                            step="50"
                            min="350"
                            max="1500"
                            value={legalFeeContribution}
                            onChange={(e) => setLegalFeeContribution(Number(e.target.value))}
                            className="w-full pl-8 pr-4 py-2 border border-rule rounded-lg text-sm text-ink focus:outline-none focus:border-coral"
                          />
                        </div>
                        <p className="text-[11px] text-muted mt-1">
                          UK standard is £500 + VAT for Section 203 advice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Summary & Compliance Column */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Budget Card */}
                  <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 md:p-8 shadow-md">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-white/60 block mb-1">
                      Projected Restructure Budget
                    </span>
                    <div className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
                      £{grandTotalCost.toLocaleString()}
                    </div>
                    <p className="text-xs text-white/70 border-b border-white/10 pb-4 mb-4">
                      Estimated all-inclusive commercial liability across {headcount} exiting {headcount === 1 ? 'employee' : 'employees'}, including statutory severance, tax liabilities, and legal sign-off.
                    </p>

                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between items-center text-white/80">
                        <span>Statutory Redundancy Pool:</span>
                        <span className="font-semibold text-white">£{totalStatutoryPool.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-white/80">
                        <span>Ex-Gratia Severance Pool:</span>
                        <span className="font-semibold text-white">£{totalExGratiaPool.toLocaleString()}</span>
                      </div>
                      {pilonIncluded && (
                        <div className="flex justify-between items-center text-white/80">
                          <span>Notice Pay (PILON):</span>
                          <span className="font-semibold text-white">£{totalPilon.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-white/80">
                        <span>Employer Class 1A NIC (15.0% on &gt;£30k):</span>
                        <span className="font-semibold text-white">£{totalClass1aNic.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-white/80">
                        <span>S.203 Solicitor Legal Fee Pool:</span>
                        <span className="font-semibold text-white">£{totalLegalFeePool.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-xs text-white/70">Average Cost Per Employee:</span>
                      <span className="text-sm font-bold text-coral">
                        £{Math.round(grandTotalCost / headcount).toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('dispatch')}
                      className="w-full mt-6 py-3 px-4 bg-coral hover:bg-coral-ink text-white font-semibold text-xs rounded-lg transition-colors text-center"
                    >
                      Dispatch {headcount} Exits to Solicitor Network →
                    </button>
                  </div>

                  {/* Statutory Consultation Watchdog Card */}
                  <div className={`p-6 rounded-2xl border ${
                    isCollective100Plus
                      ? 'bg-amber-500/10 border-amber-500/30 text-ink'
                      : isCollective20Plus
                      ? 'bg-blue-50 border-blue-200 text-ink'
                      : 'bg-white border-rule text-ink'
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <h3 className="text-sm font-bold text-[#0B1F3A]">
                        {isCollective100Plus
                          ? 'TULRCA 1992 s.188: 100+ Collective Redundancy Notice'
                          : isCollective20Plus
                          ? 'TULRCA 1992 s.188: 20–99 Collective Redundancy Notice'
                          : 'Individual Consultation Process (Under 20 Staff)'}
                      </h3>
                    </div>

                    <p className="text-xs text-muted leading-relaxed mb-3">
                      {isCollective100Plus
                        ? 'Because you are proposing 100 or more redundancies within 90 days, you are legally required to consult with employee representatives for a minimum of 45 days before the first dismissal takes effect, and file Form HR1 with the Redundancy Payments Service.'
                        : isCollective20Plus
                        ? 'Because you are proposing between 20 and 99 redundancies within 90 days, you must conduct a minimum 30-day collective consultation before any dismissals take effect, and submit Form HR1.'
                        : 'For fewer than 20 redundancies, individual consultations apply (typically 1 to 2 weeks). No Form HR1 submission is required, though fair selection criteria and consultation meetings are strictly required under ERA 1996 s.98.'}
                    </p>

                    <div className="p-3 bg-white/80 rounded-lg border border-rule text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted">Minimum Consultation:</span>
                        <strong className="text-ink">{consultationDays} calendar days</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">BEIS Form HR1 Filing:</span>
                        <strong className="text-ink">{hr1Required ? 'Mandatory' : 'Not Required'}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Non-compliance Risk:</span>
                        <strong className="text-coral">Up to 90 days gross pay protective award</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Section 111A Protected Conversation Generator */}
        {activeTab === 's111a' && (
          <section className="py-12 bg-canvas">
            <div className="sc-container">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Guidelines Banner */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-rule shadow-sm">
                  <h2 className="text-xl font-serif font-semibold text-[#0B1F3A] mb-2">
                    Section 111A ERA 1996 Statutory Protected Conversation Guide
                  </h2>
                  <p className="text-xs text-muted leading-relaxed mb-6">
                    Section 111A of the Employment Rights Act 1996 allows employers to propose confidential exit terms without an existing dispute. To ensure discussions remain strictly inadmissible in ordinary unfair dismissal claims, your organisation must respect the following statutory boundaries:
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 bg-paper rounded-xl border border-rule">
                      <div className="font-semibold text-ink mb-1">1. Minimum 10 Days Window</div>
                      <p className="text-muted leading-relaxed">
                        ACAS Code 4 Paragraph 18 stipulates employees must be given at least 10 calendar days to consider settlement proposals and seek legal advice.
                      </p>
                    </div>
                    <div className="p-4 bg-paper rounded-xl border border-rule">
                      <div className="font-semibold text-ink mb-1">2. No Improper Behaviour</div>
                      <p className="text-muted leading-relaxed">
                        Avoid threatening language or ultimatums (e.g. "sign by 5pm or be dismissed"). Doing so strips Section 111A protection entirely.
                      </p>
                    </div>
                    <div className="p-4 bg-paper rounded-xl border border-rule">
                      <div className="font-semibold text-ink mb-1">3. s.111A Scope Limitations</div>
                      <p className="text-muted leading-relaxed">
                        Section 111A only shields ordinary unfair dismissal claims. It does not cover claims for discrimination, whistleblowing, or breach of contract.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Template Generator */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-rule shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-rule pb-4 mb-6">
                    <div>
                      <h3 className="text-lg font-serif font-semibold text-[#0B1F3A]">
                        Formal Section 111A Offer Letter Generator
                      </h3>
                      <p className="text-xs text-muted">
                        Generate a standard, legally robust invitation letter citing Section 111A and ACAS Code 4.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyTemplate}
                      className="px-4 py-2 bg-coral hover:bg-coral-ink text-white font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {copiedTemplate ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          Copied to Clipboard!
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                          </svg>
                          Copy Letter Template
                        </>
                      )}
                    </button>
                  </div>

                  {/* Template Variable Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label htmlFor="tpl-company" className="block text-xs font-semibold text-ink mb-1">
                        Company Name
                      </label>
                      <input
                        id="tpl-company"
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-rule rounded-md text-xs text-ink focus:outline-none focus:border-coral"
                      />
                    </div>
                    <div>
                      <label htmlFor="tpl-employee" className="block text-xs font-semibold text-ink mb-1">
                        Employee Name
                      </label>
                      <input
                        id="tpl-employee"
                        type="text"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        className="w-full px-3 py-1.5 border border-rule rounded-md text-xs text-ink focus:outline-none focus:border-coral"
                      />
                    </div>
                    <div>
                      <label htmlFor="tpl-date" className="block text-xs font-semibold text-ink mb-1">
                        Date of Proposal
                      </label>
                      <input
                        id="tpl-date"
                        type="date"
                        value={proposalDate}
                        onChange={(e) => setProposalDate(e.target.value)}
                        className="w-full px-3 py-1.5 border border-rule rounded-md text-xs text-ink focus:outline-none focus:border-coral"
                      />
                    </div>
                  </div>

                  {/* Letter Preview Box */}
                  <div className="bg-paper p-5 rounded-xl border border-rule font-mono text-[11px] text-ink whitespace-pre-wrap leading-relaxed max-h-[420px] overflow-y-auto">
{`STRICTLY PRIVATE & CONFIDENTIAL / WITHOUT PREJUDICE & SUBJECT TO CONTRACT
UNDER SECTION 111A OF THE EMPLOYMENT RIGHTS ACT 1996

Date: ${proposalDate}

To: ${employeeName}
From: Human Resources, ${companyName}

Dear ${employeeName},

RE: SETTLEMENT PROPOSAL AND SECTION 111A PRE-TERMINATION DISCUSSIONS

We write to confirm our recent confidential discussions regarding your employment with ${companyName}. As previously outlined, this letter and any associated discussions are held pursuant to Section 111A of the Employment Rights Act 1996. They cannot be referred to in subsequent ordinary unfair dismissal proceedings before an Employment Tribunal.

1. PROPOSED EXIT TERMS
Subject to entering into a formal Section 203 Settlement Agreement:
- Termination Date: By mutual agreement.
- Statutory Redundancy Payment: £${statRedundancyPerHead.toLocaleString()} (tax-free under ITEPA 2003 s.403).
- Ex-Gratia Compensatory Payment: £${exGratiaPerHead.toLocaleString()} (tax-exempt up to the £30,000 threshold).
${pilonIncluded ? `- Payment in Lieu of Notice (PILON): £${pilonPerHead.toLocaleString()} (${noticeWeeks} weeks gross, subject to PAYE and Class 1 NICs under s.402D).` : '- Notice: To be worked as contractual notice.'}
- Standard Agreed Reference: Factual dates and job title provided upon request.

2. EMPLOYER LEGAL FEE CONTRIBUTION
In accordance with standard UK employment practice and Section 203(3) of the Employment Rights Act 1996, ${companyName} will pay up to £${legalFeeContribution.toLocaleString()} + VAT directly to your chosen independent SRA-regulated solicitor for reviewing and signing the agreement.

3. ACAS CODE 4 CONSIDERATION PERIOD
In strict accordance with ACAS Code of Practice 4 Paragraph 18, you are afforded a minimum of 10 calendar days from receipt of this proposal to consider these terms and obtain independent legal advice. There is no obligation to accept this offer, and your existing contractual rights remain unaffected during this period.

Please confirm whether you wish to proceed to the formal drafting stage by contacting Human Resources.

Yours sincerely,

Human Resources Director
${companyName}`}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Tab 3: Section 203 SRA Solicitor Dispatch Pipeline */}
        {activeTab === 'dispatch' && (
          <section className="py-12 bg-canvas">
            <div className="sc-container">
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Value Proposition Header */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-rule shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-coral/10 text-coral rounded-xl hidden sm:block">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-semibold text-[#0B1F3A] mb-2">
                        Centralised Section 203 Solicitor Dispatch for Corporate Exits
                      </h2>
                      <p className="text-xs text-muted leading-relaxed">
                        Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is legally void unless the employee receives independent advice from an SRA-regulated solicitor. SettlementCheck manages this entire pipeline for UK employers:
                      </p>

                      <div className="grid sm:grid-cols-3 gap-4 mt-6 text-xs">
                        <div className="p-3.5 bg-paper rounded-xl border border-rule">
                          <strong className="block text-ink mb-1">Fixed Fee Predictability</strong>
                          <span className="text-muted">Standard £500 + VAT contribution per employee with zero hidden charges.</span>
                        </div>
                        <div className="p-3.5 bg-paper rounded-xl border border-rule">
                          <strong className="block text-ink mb-1">Target 48-Hour SLA</strong>
                          <span className="text-muted">Specialist employment solicitors assigned and consultation scheduled within 48 hours.</span>
                        </div>
                        <div className="p-3.5 bg-paper rounded-xl border border-rule">
                          <strong className="block text-ink mb-1">Single Consolidated Invoicing</strong>
                          <span className="text-muted">Eliminate 50 separate solicitor invoices; pay through a single audited disbursement account.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dispatch Intake Form */}
                <div className="bg-white rounded-2xl p-6 md:p-8 border border-rule shadow-sm">
                  {dispatchSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-[#0B1F3A] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-serif font-semibold text-[#0B1F3A] mb-2">
                        Dispatch Request Received
                      </h3>
                      <p className="text-xs text-muted max-w-md mx-auto mb-6">
                        Thank you, {dispatchName}. Our enterprise legal operations team will contact you within 2 business hours at {dispatchEmail} to finalise your case intake schedule. Reference ID: <code className="font-mono font-bold text-coral">EMP-2026-{Math.floor(100000 + Math.random() * 900000)}</code>.
                      </p>
                      <button
                        type="button"
                        onClick={() => setDispatchSubmitted(false)}
                        className="px-6 py-2 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1F3A]/90 transition-colors"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault()
                        if (dispatchOrg && dispatchName && dispatchEmail) {
                          setDispatchSubmitted(true)
                        }
                      }}
                      className="space-y-6"
                    >
                      <div className="border-b border-rule pb-4 mb-4">
                        <h3 className="text-lg font-serif font-semibold text-[#0B1F3A]">
                          Request Enterprise Panel Allocation
                        </h3>
                        <p className="text-xs text-muted">
                          Connect your HR team with dedicated panel capacity for planned or ongoing redundancies.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="dispatch-org" className="block text-xs font-semibold text-ink mb-1">
                            Organisation / Company Name *
                          </label>
                          <input
                            id="dispatch-org"
                            type="text"
                            required
                            placeholder="e.g. Acme Holdings UK Ltd"
                            value={dispatchOrg}
                            onChange={(e) => setDispatchOrg(e.target.value)}
                            className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral"
                          />
                        </div>

                        <div>
                          <label htmlFor="dispatch-contact" className="block text-xs font-semibold text-ink mb-1">
                            HR Director / Counsel Name *
                          </label>
                          <input
                            id="dispatch-contact"
                            type="text"
                            required
                            placeholder="e.g. Sarah Jenkins"
                            value={dispatchName}
                            onChange={(e) => setDispatchName(e.target.value)}
                            className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="dispatch-email" className="block text-xs font-semibold text-ink mb-1">
                            Work Email Address *
                          </label>
                          <input
                            id="dispatch-email"
                            type="email"
                            required
                            placeholder="s.jenkins@company.co.uk"
                            value={dispatchEmail}
                            onChange={(e) => setDispatchEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral"
                          />
                        </div>

                        <div>
                          <label htmlFor="dispatch-phone" className="block text-xs font-semibold text-ink mb-1">
                            Telephone Number
                          </label>
                          <input
                            id="dispatch-phone"
                            type="tel"
                            placeholder="+44 20 7946 0991"
                            value={dispatchPhone}
                            onChange={(e) => setDispatchPhone(e.target.value)}
                            className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="dispatch-count" className="block text-xs font-semibold text-ink mb-1">
                            Estimated Exits / Redundancies
                          </label>
                          <select
                            id="dispatch-count"
                            value={dispatchHeadcount}
                            onChange={(e) => setDispatchHeadcount(e.target.value)}
                            className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral bg-white"
                          >
                            <option value="1-4">1 to 4 employees (Individual)</option>
                            <option value="5-19">5 to 19 employees (Small group)</option>
                            <option value="20-49">20 to 49 employees (30-day collective)</option>
                            <option value="50-99">50 to 99 employees (30-day collective)</option>
                            <option value="100+">100+ employees (45-day collective)</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="dispatch-time" className="block text-xs font-semibold text-ink mb-1">
                            Target Completion Timeline
                          </label>
                          <select
                            id="dispatch-time"
                            value={dispatchTimeline}
                            onChange={(e) => setDispatchTimeline(e.target.value)}
                            className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral bg-white"
                          >
                            <option value="immediate">Immediate (under 1 week)</option>
                            <option value="1-2 weeks">1 to 2 weeks</option>
                            <option value="3-4 weeks">3 to 4 weeks</option>
                            <option value="next-quarter">Planning for next quarter</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="dispatch-notes" className="block text-xs font-semibold text-ink mb-1">
                          Special Requirements or Restructure Notes (Optional)
                        </label>
                        <textarea
                          id="dispatch-notes"
                          rows={3}
                          placeholder="e.g. Remote workforce across UK, standard £500 contribution, requiring execution by end of month..."
                          value={dispatchNotes}
                          onChange={(e) => setDispatchNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-rule rounded-lg text-xs text-ink focus:outline-none focus:border-coral"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 px-4 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-semibold text-xs rounded-lg transition-colors"
                      >
                        Request Dedicated Employer Dispatch Allocation →
                      </button>

                      <p className="text-[11px] text-muted text-center">
                        Strict confidentiality maintained under standard NDA protocols. We do not share corporate restructure data with external parties.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Corporate Trust & Compliance Safeguards */}
        <section className="py-12 bg-paper border-y border-rule">
          <div className="sc-container">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl font-serif font-bold text-[#0B1F3A] mb-1">100%</div>
                <div className="text-xs font-semibold text-ink mb-1">SRA Regulated Panels</div>
                <div className="text-[11px] text-muted">All partner solicitors are independently regulated in England &amp; Wales.</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-serif font-bold text-[#0B1F3A] mb-1">£751/wk</div>
                <div className="text-xs font-semibold text-ink mb-1">April 2026 Rates</div>
                <div className="text-[11px] text-muted">Statutory redundancy pay cap applied under SI 2026/310.</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-serif font-bold text-[#0B1F3A] mb-1">48 Hours</div>
                <div className="text-xs font-semibold text-ink mb-1">Turnaround SLA</div>
                <div className="text-[11px] text-muted">Fast employee onboarding to maintain tight project schedules.</div>
              </div>
              <div className="p-4">
                <div className="text-2xl font-serif font-bold text-[#0B1F3A] mb-1">UK GDPR</div>
                <div className="text-xs font-semibold text-ink mb-1">Enterprise Security</div>
                <div className="text-[11px] text-muted">Client-side redaction and tenant-isolated database architecture.</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Accordion Section */}
        <section className="py-16 bg-canvas">
          <div className="sc-container max-w-3xl">
            <div className="text-center mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-coral block mb-2">
                Employer FAQ
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0B1F3A]">
                Frequently Asked Questions for HR Leaders
              </h2>
            </div>

            <FaqAccordion faqs={EMPLOYER_FAQS} />

            <div className="mt-12 text-center p-6 bg-paper rounded-xl border border-rule">
              <p className="text-xs text-muted mb-3">
                Need to discuss custom enterprise requirements or multi-site redundancy programs?
              </p>
              <Link
                href="/for-solicitors/#contact"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-coral hover:text-coral-ink underline underline-offset-2"
              >
                Contact our Corporate Partnerships Team →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
