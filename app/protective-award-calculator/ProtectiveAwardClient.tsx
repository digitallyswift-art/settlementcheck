'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import { calcProtectiveAward, type ProtectiveAwardResult } from '@/lib/calculations'

function formatCurrency(n: number): string {
  return '£' + Math.round(n).toLocaleString('en-GB')
}

const FAQS = [
  {
    q: 'What is the maximum protective award an Employment Tribunal can make in 2026?',
    a: 'An Employment Tribunal can award up to 90 days of gross pay per employee under Section 189 of TULRCA 1992. The tribunal assesses the seriousness of the employer’s failure to consult before deciding the number of days.',
  },
  {
    q: 'How much will I receive if my employer is insolvent or enters administration?',
    a: 'If your employer is insolvent, you claim from the government Insolvency Service. By law, payments from the National Insurance Fund are capped at 8 weeks of pay. In 2026, the statutory weekly cap is £751 in Great Britain (£783 in Northern Ireland), making the maximum government payout £6,008 in Great Britain (£6,264 in Northern Ireland).',
  },
  {
    q: 'Do I have to belong to a trade union to claim a protective award?',
    a: 'No. If a recognised trade union exists, they must submit the claim. If there is no recognised union, elected employee representatives can claim. If your employer failed to organise elections for representatives, affected employees can submit individual or group claims directly to the tribunal.',
  },
  {
    q: 'What is the strict time limit for claiming a protective award?',
    a: 'You must initiate ACAS Early Conciliation within 3 months minus 1 day from the date your dismissal took effect. If you miss this statutory deadline, the Employment Tribunal will almost certainly reject your claim.',
  },
  {
    q: 'Can I claim a protective award if I sign a settlement agreement?',
    a: 'No. Standard settlement agreements include an express waiver of all statutory claims, including claims under Section 189 of TULRCA 1992. However, knowing your potential protective award entitlement gives you vital leverage to negotiate a higher compensation payment before signing.',
  },
  {
    q: 'Is a protective award taxable in the UK?',
    a: 'Yes, but it qualifies for the £30,000 tax exemption under Section 403 of ITEPA 2003 as compensation for loss of employment. If your total termination compensation (including redundancy and ex-gratia payments) is under £30,000, your protective award is 100% tax-free with zero employee National Insurance deductions.',
  },
]

export default function ProtectiveAwardClient() {
  const [salaryInput, setSalaryInput] = useState<string>('39000')
  const [employeesOption, setEmployeesOption] = useState<'under20' | '20to99' | '100plus'>('20to99')
  const [statusOption, setStatusOption] = useState<'solvent' | 'insolvent'>('solvent')
  const [daysAwarded, setDaysAwarded] = useState<number>(90)
  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>('GB')

  const salaryNum = useMemo(() => {
    const parsed = parseFloat(salaryInput.replace(/[^0-9.]/g, ''))
    return isNaN(parsed) || parsed < 0 ? 0 : parsed
  }, [salaryInput])

  const employeesCount = useMemo(() => {
    if (employeesOption === 'under20') return 10
    if (employeesOption === '100plus') return 100
    return 30
  }, [employeesOption])

  const result: ProtectiveAwardResult = useMemo(() => {
    return calcProtectiveAward({
      salary: salaryNum,
      daysAwarded,
      employerStatus: statusOption,
      jurisdiction,
      employeesProposed: employeesCount,
    })
  }, [salaryNum, daysAwarded, statusOption, jurisdiction, employeesCount])

  return (
    <>
      <Nav />
      <main className="bg-paper min-h-screen">
        {/* Hero Section */}
        <section className="pt-12 pb-10 border-b border-rule bg-paper">
          <div className="sc-container max-w-4xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors uppercase tracking-wider">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <Link href="/guides/protective-award/" className="text-xs font-medium text-muted hover:text-ink transition-colors uppercase tracking-wider">
                Protective Award
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate font-medium">Calculator</span>
            </div>

            <div className="inline-flex items-center gap-2 border border-rule-strong rounded-full px-3.5 py-1 text-xs font-semibold text-ink bg-white/70 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-coral" />
              TULRCA 1992 s.189 · 2026 UK Statutory Rates
            </div>

            <h1 className="sc-h1 mb-4 text-3xl md:text-4xl text-ink">
              Protective Award Calculator UK
            </h1>

            <p className="sc-lead text-muted max-w-2xl text-base md:text-lg mb-6 leading-relaxed">
              Calculate your potential compensation if your employer proposed 20 or more redundancies without collective consultation. Tribunals can award up to 90 days of gross pay.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted border-t border-rule pt-4">
              <span>Statutory baseline: SI 2026/310 (£751/week)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Independent &amp; confidential</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Zero email required</span>
            </div>
          </div>
        </section>

        {/* Interactive Calculator Section */}
        <section className="py-10 md:py-14 border-b border-rule bg-white">
          <div className="sc-container max-w-5xl mx-auto px-5">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 md:gap-12 items-start">
              {/* Form Controls Column */}
              <div className="bg-paper p-6 md:p-8 rounded-2xl border border-rule flex flex-col gap-6">
                <div className="border-b border-rule pb-4">
                  <h2 className="text-lg font-bold text-ink mb-1">Your Employment Details</h2>
                  <p className="text-xs text-muted">Enter your salary and redundancy circumstances below.</p>
                </div>

                {/* Gross Annual Salary */}
                <div>
                  <label htmlFor="salary" className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Gross Annual Salary (£)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted font-bold text-base">£</span>
                    <input
                      id="salary"
                      type="text"
                      inputMode="numeric"
                      value={salaryInput}
                      onChange={(e) => setSalaryInput(e.target.value)}
                      placeholder="e.g. 39000"
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-rule bg-white text-ink text-base font-semibold focus:outline-none focus:border-coral transition-colors"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {['25000', '35000', '50000', '75000'].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setSalaryInput(preset)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                          salaryInput === preset
                            ? 'bg-ink text-white border-ink'
                            : 'bg-white text-muted border-rule hover:text-ink'
                        }`}
                      >
                        £{parseInt(preset).toLocaleString('en-GB')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of redundancies proposed */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Redundancies Proposed at Your Workplace
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setEmployeesOption('under20')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        employeesOption === 'under20'
                          ? 'border-coral bg-[#FFF7F4] shadow-sm'
                          : 'border-rule bg-white hover:border-rule-strong'
                      }`}
                    >
                      <span className="block font-bold text-xs text-ink mb-0.5">Under 20</span>
                      <span className="block text-[11px] text-muted">Individual rules only</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmployeesOption('20to99')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        employeesOption === '20to99'
                          ? 'border-coral bg-[#FFF7F4] shadow-sm'
                          : 'border-rule bg-white hover:border-rule-strong'
                      }`}
                    >
                      <span className="block font-bold text-xs text-ink mb-0.5">20 to 99</span>
                      <span className="block text-[11px] text-muted">30 days consultation</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmployeesOption('100plus')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        employeesOption === '100plus'
                          ? 'border-coral bg-[#FFF7F4] shadow-sm'
                          : 'border-rule bg-white hover:border-rule-strong'
                      }`}
                    >
                      <span className="block font-bold text-xs text-ink mb-0.5">100 or more</span>
                      <span className="block text-[11px] text-muted">45 days consultation</span>
                    </button>
                  </div>
                  {employeesOption === 'under20' && (
                    <div className="mt-2.5 p-3 rounded-lg bg-[#FFF2EE] border border-coral/30 text-xs text-[#A8341F] leading-relaxed">
                      <strong>Statutory Threshold Note:</strong> Collective consultation rights apply only when an employer proposes 20 or more redundancies within 90 days. For fewer than 20 redundancies, standard unfair dismissal rules apply instead.
                    </div>
                  )}
                </div>

                {/* Employer Financial Status */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Employer Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setStatusOption('solvent')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        statusOption === 'solvent'
                          ? 'border-coral bg-[#FFF7F4] shadow-sm'
                          : 'border-rule bg-white hover:border-rule-strong'
                      }`}
                    >
                      <span className="block font-bold text-xs text-ink mb-0.5">Trading (Solvent)</span>
                      <span className="block text-[11px] text-muted">Actual gross pay, uncapped</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusOption('insolvent')}
                      className={`p-3 text-left rounded-xl border transition-all ${
                        statusOption === 'insolvent'
                          ? 'border-coral bg-[#FFF7F4] shadow-sm'
                          : 'border-rule bg-white hover:border-rule-strong'
                      }`}
                    >
                      <span className="block font-bold text-xs text-ink mb-0.5">Insolvent (Bust)</span>
                      <span className="block text-[11px] text-muted">Insolvency Service: capped at 8 wks</span>
                    </button>
                  </div>
                </div>

                {/* Award Days Selector */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="award-days" className="text-xs font-bold text-ink uppercase tracking-wider">
                      Days of Protective Award ({daysAwarded} Days)
                    </label>
                    <span className="text-xs text-muted font-medium">Max 90 Days (~12.86 weeks)</span>
                  </div>
                  <input
                    id="award-days"
                    type="range"
                    min="14"
                    max="90"
                    step="1"
                    value={daysAwarded}
                    onChange={(e) => setDaysAwarded(parseInt(e.target.value, 10))}
                    className="w-full accent-coral cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-muted mt-1">
                    <span>14 days</span>
                    <span>30 days</span>
                    <span>60 days</span>
                    <span className="font-bold text-ink">90 days (Full award)</span>
                  </div>
                </div>

                {/* Jurisdiction */}
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-2">
                    Jurisdiction
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setJurisdiction('GB')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                        jurisdiction === 'GB'
                          ? 'bg-ink text-white border-ink'
                          : 'bg-white text-muted border-rule hover:text-ink'
                      }`}
                    >
                      England, Wales &amp; Scotland (£751 cap)
                    </button>
                    <button
                      type="button"
                      onClick={() => setJurisdiction('NI')}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                        jurisdiction === 'NI'
                          ? 'bg-ink text-white border-ink'
                          : 'bg-white text-muted border-rule hover:text-ink'
                      }`}
                    >
                      Northern Ireland (£783 cap)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Output Card Column */}
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border-2 border-coral/30 bg-paper p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-[#FBF0EE] text-[#A8341F]">
                      Statutory Award Estimate
                    </span>
                    <span className="text-xs font-medium text-muted">
                      {statusOption === 'solvent' ? 'Solvent Employer' : 'Insolvent Employer'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-3xl md:text-4xl font-extrabold text-ink tracking-tight mb-1">
                      {statusOption === 'solvent'
                        ? formatCurrency(result.solventAward)
                        : formatCurrency(result.insolventAward)}
                    </div>
                    <p className="text-xs text-muted">
                      Estimated gross entitlement based on {daysAwarded} days ({result.weeksAwarded} weeks) of remuneration.
                    </p>
                  </div>

                  {/* Summary Metric Rows */}
                  <div className="border-t border-rule pt-4 flex flex-col gap-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-rule/60">
                      <span className="text-muted">Gross Weekly Pay</span>
                      <span className="font-bold text-ink">{formatCurrency(result.weeklyGrossPay)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-rule/60">
                      <span className="text-muted">Award Period</span>
                      <span className="font-bold text-ink">{daysAwarded} days ({result.weeksAwarded} weeks)</span>
                    </div>

                    {statusOption === 'solvent' ? (
                      <div className="flex justify-between py-1 border-b border-rule/60">
                        <span className="text-muted">Statutory Cap Status</span>
                        <span className="font-bold text-coral">Uncapped (Actual Earnings)</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between py-1 border-b border-rule/60">
                          <span className="text-muted">Insolvency Service Limit</span>
                          <span className="font-bold text-ink">8 weeks @ £{result.weeklyCapUsed}/wk</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-rule/60">
                          <span className="text-muted">Government Payment</span>
                          <span className="font-bold text-coral">{formatCurrency(result.insolventAward)}</span>
                        </div>
                        {result.insolventShortfall > 0 && (
                          <div className="flex justify-between py-1 border-b border-rule/60">
                            <span className="text-muted">Unsecured Debt Claim</span>
                            <span className="font-bold text-muted">{formatCurrency(result.insolventShortfall)}</span>
                          </div>
                        )}
                      </>
                    )}

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

                  {/* Tax Note */}
                  <div className="mt-4 p-3 rounded-lg bg-white border border-rule text-xs text-muted leading-relaxed">
                    Under Section 403 of ITEPA 2003, genuine termination compensation payments up to £30,000 are completely exempt from income tax and employee National Insurance.
                  </div>

                  {/* Next Step Primary CTA */}
                  <div className="mt-6 flex flex-col gap-2.5">
                    <Link
                      href="/get-matched/"
                      className="w-full py-3.5 px-4 rounded-xl bg-coral text-white font-bold text-sm text-center hover:bg-[#c24f2d] transition-colors shadow-sm"
                    >
                      Connect with an independent solicitor →
                    </Link>
                    <p className="text-[11px] text-center text-muted">
                      Your employer typically contributes £350 to £750 + VAT to independent legal advice.
                    </p>
                  </div>
                </div>

                {/* ACAS Limitation Alert Box */}
                <div className="rounded-xl border border-rule bg-white p-5 flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFF2EE] text-[#A8341F] flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-sm">
                    !
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-ink mb-1">Strict 3-Month Tribunal Deadline</h3>
                    <p className="text-xs text-muted leading-relaxed">
                      You must start ACAS Early Conciliation within <strong>3 months minus 1 day</strong> from your date of dismissal. Missing this window means you lose the right to claim a protective award.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Solvent vs Insolvent Comparison Guide */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="sc-container max-w-4xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4 text-center">Solvent vs Insolvent Employer Claims</h2>
            <p className="sc-lead text-center max-w-2xl mx-auto mb-8 text-sm md:text-base">
              The amount you actually recover depends heavily on whether your employer is actively trading or has entered liquidation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-rule shadow-sm">
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-paper text-ink mb-3">
                  Option 1: Trading Employer
                </span>
                <h3 className="text-base font-bold text-ink mb-2">Claim Against a Solvent Company</h3>
                <p className="sc-body text-xs text-muted mb-4 leading-relaxed">
                  When the company continues trading, the award is paid directly by your employer. The calculation uses your actual gross earnings without any statutory weekly cap.
                </p>
                <ul className="flex flex-col gap-2 text-xs text-ink">
                  <li className="flex items-center gap-2">
                    <span className="text-coral font-bold">✓</span>
                    <span>Uncapped gross weekly pay applies</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-coral font-bold">✓</span>
                    <span>Up to full 90 days awarded by the tribunal</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-coral font-bold">✓</span>
                    <span>Paid directly by the employer&apos;s funds</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-rule shadow-sm">
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#FFF2EE] text-[#A8341F] mb-3">
                  Option 2: Insolvent Employer
                </span>
                <h3 className="text-base font-bold text-ink mb-2">Claim from the Insolvency Service</h3>
                <p className="sc-body text-xs text-muted mb-4 leading-relaxed">
                  When a company enters liquidation or administration, payments come from the National Insurance Fund via the Redundancy Payments Service.
                </p>
                <ul className="flex flex-col gap-2 text-xs text-ink">
                  <li className="flex items-center gap-2">
                    <span className="text-coral font-bold">✓</span>
                    <span>Capped at 8 weeks maximum (ERA 1996 s.184)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-coral font-bold">✓</span>
                    <span>Capped at £751/week in GB (£783 in NI)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-coral font-bold">✓</span>
                    <span>Guaranteed government payout up to £6,008</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Settlement Agreement Warning Section */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="sc-container max-w-4xl mx-auto px-5">
            <div className="bg-paper p-6 md:p-8 rounded-2xl border border-rule flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="max-w-xl">
                <span className="text-xs font-bold text-coral uppercase tracking-wider mb-1 block">
                  Settlement Agreement Warning
                </span>
                <h2 className="text-xl font-bold text-ink mb-2">
                  Have you been offered a settlement agreement?
                </h2>
                <p className="sc-body text-xs text-muted leading-relaxed">
                  Signing a settlement agreement waives your right to claim a protective award. If your employer failed to consult collectively on 20+ redundancies, you should factor this entitlement into your settlement negotiations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-shrink-0">
                <Link
                  href="/calculator/"
                  className="px-5 py-3 rounded-xl bg-ink text-white font-bold text-xs text-center hover:bg-ink/90 transition-colors"
                >
                  Check my settlement offer →
                </Link>
                <Link
                  href="/guides/protective-award/"
                  className="px-5 py-3 rounded-xl border border-rule bg-white text-ink font-semibold text-xs text-center hover:bg-paper transition-colors"
                >
                  Read the protective guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="sc-container max-w-4xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto">
              <FaqAccordion faqs={FAQS} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
