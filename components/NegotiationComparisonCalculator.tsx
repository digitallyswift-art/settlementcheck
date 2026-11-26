'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { calcRedundancy, calcBasicAward, calcNotice, WEEKLY_CAP_GB } from '@/lib/calculations'
import { getOfficialBenchmark } from '@/lib/statutory-rates'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'

function formatGBP(n: number): string {
  return `£${Math.round(n).toLocaleString('en-GB')}`
}

export function NegotiationComparisonCalculator() {
  const [salaryInput, setSalaryInput] = useState<string>('48000')
  const [yearsInput, setYearsInput] = useState<number>(5)
  const [ageInput, setAgeInput] = useState<number>(38)
  const [offerInput, setOfferInput] = useState<string>('18000')
  const [reason, setReason] = useState<'redundancy' | 'pip' | 'constructive' | 'unfair_dismissal'>('redundancy')

  const salary = Math.max(0, parseFloat(salaryInput.replace(/[^0-9.]/g, '')) || 0)
  const offer = Math.max(0, parseFloat(offerInput.replace(/[^0-9.]/g, '')) || 0)

  const calc = useMemo(() => {
    const totalMonths = yearsInput * 12
    const redundancyPay = reason === 'redundancy' ? calcRedundancy(salary, totalMonths, ageInput, WEEKLY_CAP_GB) : 0
    const basicAward = reason === 'redundancy' ? 0 : calcBasicAward(salary, totalMonths, ageInput, WEEKLY_CAP_GB)
    const noticePay = calcNotice(salary, totalMonths, 0).pay
    const statutoryBaseline = redundancyPay + noticePay

    const benchmark = getOfficialBenchmark(reason, false)
    const monthlyGross = salary / 12
    const illustrativeLow = Math.round(statutoryBaseline + basicAward + monthlyGross * benchmark.typicalAcasExGratiaMonths.min)
    const illustrativeHigh = Math.round(statutoryBaseline + basicAward + monthlyGross * benchmark.typicalAcasExGratiaMonths.max)
    const gapToMid = Math.max(0, Math.round((illustrativeLow + illustrativeHigh) / 2) - offer)

    return {
      statutoryBaseline,
      redundancyPay,
      noticePay,
      benchmark,
      illustrativeLow,
      illustrativeHigh,
      gapToMid,
    }
  }, [salary, yearsInput, ageInput, offer, reason])

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCCE] pb-3 mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold">
          Intake Agenda Builder • ERA 1996 &amp; ACAS Code 4
        </span>
        <span className="text-xs text-[#0B1F3A]/70 font-mono">
          April 2026 Rates (£{WEEKLY_CAP_GB}/wk GB Cap)
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A] mb-2">
        Compare Your Offer Against Statutory &amp; Tribunal Baselines
      </h3>
      <p className="text-body text-[#0B1F3A]/80 mb-6 leading-relaxed">
        Prepare an objective Intake Agenda for your instructed solicitor comparing your employer&apos;s offer, your calculated statutory baseline (subject to eligibility), and Ministry of Justice tribunal benchmarks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="neg-reason" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Exit Situation
            </label>
            <select
              id="neg-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            >
              <option value="redundancy">Redundancy / Restructuring</option>
              <option value="pip">PIP / Performance Exit</option>
              <option value="constructive">Constructive Dismissal Dispute</option>
              <option value="unfair_dismissal">Capability / Unfair Dismissal</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="neg-salary" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Annual Salary (£)
              </label>
              <input
                id="neg-salary"
                type="text"
                inputMode="numeric"
                value={salaryInput}
                onChange={(e) => setSalaryInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-3 py-2 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE]"
              />
            </div>
            <div>
              <label htmlFor="neg-offer" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Current Offer (£)
              </label>
              <input
                id="neg-offer"
                type="text"
                inputMode="numeric"
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full px-3 py-2 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="neg-years" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Service Years: {yearsInput}
              </label>
              <input
                id="neg-years"
                type="range"
                min={0}
                max={25}
                value={yearsInput}
                onChange={(e) => setYearsInput(Number(e.target.value))}
                className="w-full accent-[#D9603B]"
              />
            </div>
            <div>
              <label htmlFor="neg-age" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Age: {ageInput}
              </label>
              <input
                id="neg-age"
                type="range"
                min={18}
                max={70}
                value={ageInput}
                onChange={(e) => setAgeInput(Number(e.target.value))}
                className="w-full accent-[#D9603B]"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#F7F4EE] border border-[#E2DCCE] text-xs text-[#0B1F3A]/85 leading-relaxed">
            <strong>Home Insurance Legal Cover vs. Employer Contribution:</strong> Standard home insurance Legal Expenses Insurance (LEI) policies typically exclude voluntary settlement reviews. Instead, employers standardly provide a capped contribution (£350 to £500+ plus VAT) directly to your SRA-regulated solicitor upon completion.{' '}
            <Link href="/guides/home-insurance-legal-cover-settlement-agreement/" className="text-[#D9603B] underline font-medium">
              Check home insurance rules →
            </Link>
          </div>
        </div>

        <div className="bg-[#0B1F3A] text-white rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
              Intake Agenda for Your Instructed Solicitor
            </span>
            <div className="border-b border-white/15 pb-3">
              <div className="text-xs text-white/75 mb-1">Calculated Illustrative Negotiation Range</div>
              <div className="text-2xl font-serif font-bold text-white">
                {formatGBP(calc.illustrativeLow)} – {formatGBP(calc.illustrativeHigh)}
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/75">Calculated Statutory Baseline (Subject to Eligibility)</span>
                <span className="font-mono font-semibold">{formatGBP(calc.statutoryBaseline)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Recorded Employer Offer</span>
                <span className="font-mono font-semibold">{formatGBP(offer)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">MoJ Tribunal Median ({calc.benchmark.jurisdictionCategory})</span>
                <span className="font-mono font-semibold">{formatGBP(calc.benchmark.medianTribunalAward)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/65">Typical Tribunal Hearing Wait (HMCTS)</span>
                <span className="font-mono text-white/80">~10–18 months</span>
              </div>
            </div>
            <p className="text-[11px] text-white/65 m-0">
              Note: Illustrative negotiation ranges use published Acas &amp; MoJ benchmarks and are not a guaranteed or statutory entitlement.
            </p>
            <div className="p-3 rounded-lg bg-white/10 text-[11px] text-white/90 leading-relaxed">
              <strong>Important Privilege Notice:</strong> Do not send unreviewed financial proposals directly to HR; unreviewed correspondence can inadvertently waive legal privilege or compromise your position. Under English contract law (<em>Hyde v Wrench</em>), a counter-offer can extinguish the original offer, and ACAS Code 4&apos;s 10-day period is guidance rather than a binding right.
            </div>
          </div>

          <div className="pt-2 border-t border-white/15 space-y-2">
            <Link
              href={`/get-matched/?salary=${salary}&offer=${offer}&tenure=${yearsInput}&age=${ageInput}&reason=${reason}`}
              className="btn-accent w-full text-center block"
            >
              Discuss figures with an SRA solicitor →
            </Link>
            <p className="text-[11px] text-white/65 leading-relaxed m-0">
              Employers standardly provide a capped contribution (£350 to £500+ plus VAT) upon completion; excess or abortive work remains subject to solicitor engagement terms.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <MandatoryLegalDisclaimers />
      </div>
    </div>
  )
}
