'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { calcPipExit, type PipExitResult } from '@/lib/calculations'

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
        <span>ℹ️</span> {label} {open ? '▲' : '▼'}
      </button>
      {open && (
        <div className="mt-2 p-3 bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 rounded-lg text-xs leading-relaxed text-[#4A5568]">
          {children}
        </div>
      )}
    </div>
  )
}

export function PipExitCalculator() {
  const [salary, setSalary] = useState<string>('55000')
  const [years, setYears] = useState<string>('3')
  const [noticeWeeks, setNoticeWeeks] = useState<string>('4')
  const [pipStage, setPipStage] = useState<'pre_pip' | 'formal_pip' | 'final_warning'>('formal_pip')
  const [currentOffer, setCurrentOffer] = useState<string>('12000')

  const parsedSalary = Math.max(0, parseInt(salary.replace(/[^0-9]/g, ''), 10) || 0)
  const parsedYears = Math.max(0, parseInt(years.replace(/[^0-9]/g, ''), 10) || 0)
  const parsedNotice = Math.max(0, parseInt(noticeWeeks.replace(/[^0-9]/g, ''), 10) || 0)
  const parsedOffer = Math.max(0, parseFloat(currentOffer.replace(/[^0-9.]/g, '')) || 0)

  const result: PipExitResult = useMemo(() => {
    return calcPipExit({
      salary: parsedSalary,
      yearsOfService: parsedYears,
      noticeWeeks: parsedNotice,
      pipStage,
      currentOffer: parsedOffer,
    })
  }, [parsedSalary, parsedYears, parsedNotice, pipStage, parsedOffer])

  const offerVsTarget = parsedOffer > 0 ? parsedOffer - result.recommendedSettlementTarget : 0

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
      {/* Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCCE] pb-3 mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold block">
          PIP &amp; Capability Exit Engine
        </span>
        <span className="text-xs text-[#0B1F3A]/70 font-mono">
          ERA 1996 s.111A Protected Discussions
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A] mb-2">
        PIP Settlement &amp; Exit Valuation Calculator
      </h3>
      <p className="text-xs sm:text-sm text-[#0B1F3A]/80 mb-2 leading-relaxed">
        Commercial valuation of employer process costs versus an agreed settlement package under Section 111A.
      </p>
      <InfoPill label="Statutory framework for protected conversations (ERA 1996 s.111A)">
        Section 111A Employment Rights Act 1996 permits confidential pre-termination settlement negotiations that cannot be disclosed in standard unfair dismissal proceedings. Under Acas Code of Practice 4, it is recommended that employees receive a reasonable period (standardly a minimum of 10 calendar days) to consider written settlement proposals and obtain independent SRA legal advice. An employer&apos;s stated deadline remains contractually operative on their offer.
      </InfoPill>

      {/* Input Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="pip-salary" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Gross Annual Salary (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 font-bold">£</span>
              <input
                id="pip-salary"
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                className="w-full pl-8 pr-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {['35000', '55000', '75000', '100000'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSalary(val)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                    salary === val
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                      : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
                  }`}
                >
                  £{parseInt(val).toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="pip-years" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Completed Years Service
              </label>
              <input
                id="pip-years"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={years}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                  if (clean.length <= 2) setYears(clean)
                }}
                className="w-full p-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
            <div>
              <label htmlFor="pip-notice" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
                Contractual Notice (Weeks)
              </label>
              <input
                id="pip-notice"
                type="text"
                inputMode="numeric"
                maxLength={2}
                value={noticeWeeks}
                onChange={(e) => {
                  const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                  if (clean.length <= 2) setNoticeWeeks(clean)
                }}
                className="w-full p-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>
          <InfoPill label="Salary baseline & notice rights (ERA 1996 s.86)">
            Gross salary serves as the baseline for statutory notice calculations under Section 86 ERA 1996 and taxable notice pay (PENP) under ITEPA 2003 s.402D. Where contractual notice exceeds statutory minimums, the contractual entitlement applies.
          </InfoPill>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Current PIP / Capability Stage
            </label>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setPipStage('pre_pip')}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  pipStage === 'pre_pip'
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
                }`}
              >
                <span className="font-bold block">1. Informal Concerns / Pre-PIP</span>
                <span className={`text-[11px] ${pipStage === 'pre_pip' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
                  Manager mentioned performance before launching formal process
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPipStage('formal_pip')}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  pipStage === 'formal_pip'
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
                }`}
              >
                <span className="font-bold block">2. Formal 30-90 Day PIP</span>
                <span className={`text-[11px] ${pipStage === 'formal_pip' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
                  Formal objectives, weekly check-ins, HR involved
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPipStage('final_warning')}
                className={`p-2.5 text-left rounded-lg border text-xs transition-colors cursor-pointer ${
                  pipStage === 'final_warning'
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]'
                }`}
              >
                <span className="font-bold block">3. Final Hearing / Capability Dismissal Threat</span>
                <span className={`text-[11px] ${pipStage === 'final_warning' ? 'text-white/80' : 'text-[#0B1F3A]/70'}`}>
                  PIP failed or impending capability dismissal scheduled
                </span>
              </button>
            </div>
            <InfoPill label="Acas Code 1 capability requirements & procedure">
              Under Acas Code of Practice 1, employers must establish fair performance benchmarks, provide structured support, allow reasonable evaluation periods (commonly 30 to 90 days), and offer the statutory right to be accompanied at formal hearings under ERA 1996 s.10. Unreasonable failure to follow procedures exposes employers to tribunal uplifts of up to 25%.
            </InfoPill>
          </div>

          <div>
            <label htmlFor="pip-offer" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Current Employer Offer (Optional) (£)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B1F3A]/60 font-bold">£</span>
              <input
                id="pip-offer"
                type="text"
                inputMode="numeric"
                placeholder="e.g. 10000"
                value={currentOffer}
                onChange={(e) => setCurrentOffer(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                className="w-full pl-8 pr-3.5 py-2 border border-[#E2DCCE] rounded-lg text-xs font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statutory Protection Banner */}
      <div
        className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
          result.hasUnfairDismissalRights
            ? 'bg-[#F0F5FA] border-[#C4D8EC] text-[#0B1F3A]'
            : 'bg-[#FEFBF0] border-[#E0CB94] text-[#0B1F3A]'
        }`}
      >
        <div className="w-6 h-6 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
          §
        </div>
        <div className="text-xs leading-relaxed">
          {result.hasUnfairDismissalRights ? (
            <>
              <strong>Full Statutory Unfair Dismissal Protection (2+ Years Service):</strong> You have completed {parsedYears}{' '}
              years continuous service, qualifying under Section 108 Employment Rights Act 1996 for ordinary unfair dismissal protection.
              Your employer faces significant tribunal risk (£123,543 cap) if they engineer a sham capability dismissal.
            </>
          ) : (
            <>
              <strong>Under 2 Years Service (Tactical Negotiation Stance):</strong> You have {parsedYears} year(s) service and
              have not yet reached the 2-year ordinary unfair dismissal threshold. Your negotiation position relies on PIP
              process cost avoidance ({formatGBP(result.processCostAvoidanceMin)} - {formatGBP(result.processCostAvoidanceMax)}),
              contractual notice pay ({formatGBP(result.contractualNoticePay)}), and potential discrimination or whistleblowing claims.
            </>
          )}
        </div>
      </div>

      {/* Primary Settlement Valuation Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
          <span className="text-xs text-[#0B1F3A]/70 uppercase tracking-wider block mb-1">
            1. Contractual Notice (PILON)
          </span>
          <span className="text-2xl font-serif font-bold text-[#0B1F3A] block">
            {formatGBP(result.contractualNoticePay)}
          </span>
          <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
            100% Taxable (ITEPA s.402D)
          </span>
        </div>

        <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
          <span className="text-xs text-[#0B1F3A]/70 uppercase tracking-wider block mb-1">
            2. Benchmarked Ex-Gratia Target
          </span>
          <span className="text-2xl font-serif font-bold text-[#D9603B] block">
            {formatGBP(result.benchmarkedExGratiaMin)} – {formatGBP(result.benchmarkedExGratiaMax)}
          </span>
          <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
            Tax-Free under s.403 (£30,000 exemption)
          </span>
        </div>

        <div className="bg-[#F7F4EE] p-4 rounded-xl border border-[#E2DCCE]">
          <span className="text-xs text-[#0B1F3A]/70 uppercase tracking-wider block mb-1">
            3. Recommended Target Total
          </span>
          <span className="text-2xl font-serif font-bold text-[#0B1F3A] block">
            {formatGBP(result.recommendedSettlementTarget)}
          </span>
          <span className="text-[11px] text-[#0B1F3A]/60 mt-1 block">
            Est. Take-Home: {formatGBP(result.estimatedNet)}
          </span>
        </div>
      </div>

      {/* Employer Cost Avoidance Analysis */}
      <div className="bg-[#F7F4EE] border border-[#E2DCCE] rounded-xl p-4 sm:p-5 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-2">
          Employer Financial Balance Sheet: Why Settle Now?
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#0B1F3A]/80 leading-relaxed">
          <div>
            <strong className="text-[#0B1F3A] block mb-1">Cost to Run PIP to Conclusion:</strong>
            Running a compliant capability procedure costs the employer approximately{' '}
            <strong>{formatGBP(result.processCostAvoidanceMin)} to {formatGBP(result.processCostAvoidanceMax)}</strong> in
            salary, management overhead, and HR time, plus mandatory notice pay of{' '}
            <strong>{formatGBP(result.contractualNoticePay)}</strong> upon termination.
          </div>
          <div>
            <strong className="text-[#0B1F3A] block mb-1">Employer Legal Fee Contribution:</strong>
            In practice, employers standardly provide a capped contribution of{' '}
            <strong>{formatGBP(result.legalFeeTarget)} + VAT</strong> (typically £350 to £500+ plus VAT) directly to your solicitor upon completion to satisfy Section 203(3) ERA 1996 validity requirements.
          </div>
        </div>
      </div>

      {/* CTA Strip */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0B1F3A] text-white p-5 rounded-xl">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#D9603B] font-semibold block">
            Independent SRA Solicitor Review • Employer-Funded Sign-Off
          </span>
          <h4 className="text-base sm:text-lg font-serif font-bold text-white m-0">
            Connect with an SRA Settlement Specialist
          </h4>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <Link
            href={`/calculator/?salary=${parsedSalary}&years=${parsedYears}&notice=${parsedNotice}&reason=performance`}
            className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-medium text-xs rounded-lg transition-colors whitespace-nowrap text-center border border-white/20"
          >
            Model full breakdown →
          </Link>
          <Link
            href={`/get-matched/?salary=${parsedSalary}&reason=pip&offer=${parsedOffer || result.recommendedSettlementTarget}`}
            className="px-5 py-3 bg-[#D9603B] hover:bg-[#D9603B]/90 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap shadow-sm text-center"
          >
            Match with an SRA solicitor →
          </Link>
        </div>
      </div>
    </div>
  )
}
