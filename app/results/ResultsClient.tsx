'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { Suspense, useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import {
  getVerdict,
  formatCurrency,
  VerdictResult,
  WEEKLY_CAP_GB,
  WEEKLY_CAP_NI,
  calcPensionSacrifice,
} from '@/lib/calculations'
import { getOfficialBenchmark } from '@/lib/statutory-rates'
import { trackClientEvent, trackOutboundCitation, trackSolicitorMatchClick } from '@/lib/telemetry'
import InlineSolicitorIntakeCard from '@/components/InlineSolicitorIntakeCard'

/* ── Types ──────────────────────────────────────────────────────── */

interface EditableInputs {
  salary: string
  yearsNum: string
  monthsNum: string
  age: string
  offer: string
  offerIncludesNotice: string
  reason: string
  discrimination: string
  contractualNotice: string
}

type DeepDiveTab = 'deadlines' | 'benchmarks' | 'pension' | 'vento'

const REASON_LABELS: Record<string, string> = {
  redundancy: 'Redundancy',
  redundancy_collective: 'Collective redundancy (20+ people)',
  dismissal: 'Unfair dismissal',
  constructive: 'Constructive dismissal',
  resignation: 'Resignation / mutual agreement',
  mutual: 'Mutual agreement',
  other: 'Other / Unspecified',
}

const DISCRIMINATION_LABELS: Record<string, string> = {
  no: 'No',
  yes: 'Yes',
  not_sure: 'Not sure',
}

/* ── Compact Edit Inputs Drawer ─────────────────────────────────── */

function InputsSummaryPanel({
  inputs,
  jurisdiction,
  onJurisdictionChange,
  onUpdate,
}: {
  inputs: EditableInputs
  jurisdiction: 'GB' | 'NI'
  onJurisdictionChange: (j: 'GB' | 'NI') => void
  onUpdate: (next: EditableInputs) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EditableInputs>(inputs)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [showJurisdiction, setShowJurisdiction] = useState(false)

  function togglePanel() {
    if (!open) setDraft(inputs)
    setOpen((o) => !o)
    setEditingField(null)
  }

  function set(k: keyof EditableInputs, v: string) {
    setDraft((d) => ({ ...d, [k]: v }))
  }

  function apply() {
    onUpdate(draft)
    setOpen(false)
    setEditingField(null)
  }

  const fields: {
    key: keyof EditableInputs
    label: string
    display: (v: string) => string
    type: 'number' | 'select' | 'pill'
    options?: { value: string; label: string }[]
  }[] = [
    { key: 'salary', label: 'Annual salary', display: (v) => (v ? `£${Number(v).toLocaleString('en-GB')}` : 'Not set'), type: 'number' },
    { key: 'yearsNum', label: 'Years of service', display: (v) => (v ? `${v} year${v === '1' ? '' : 's'}` : '0 years'), type: 'number' },
    { key: 'monthsNum', label: 'Additional months', display: (v) => (v ? `${v} month${v === '1' ? '' : 's'}` : '0 months'), type: 'number' },
    { key: 'age', label: 'Age', display: (v) => v || 'Not set', type: 'number' },
    { key: 'offer', label: 'Settlement offer', display: (v) => (v ? `£${Number(v).toLocaleString('en-GB')}` : '£0'), type: 'number' },
    {
      key: 'offerIncludesNotice',
      label: 'Notice included in offer',
      display: (v) => (v === 'false' ? 'No (paid on top)' : 'Yes (included)'),
      type: 'pill',
      options: [
        { value: 'true', label: 'Yes (included)' },
        { value: 'false', label: 'No (paid on top)' },
      ],
    },
    {
      key: 'reason',
      label: 'Reason for leaving',
      display: (v) => REASON_LABELS[v] ?? v,
      type: 'select',
      options: Object.entries(REASON_LABELS).map(([value, label]) => ({ value, label })),
    },
    {
      key: 'discrimination',
      label: 'Discrimination element',
      display: (v) => DISCRIMINATION_LABELS[v] ?? v,
      type: 'pill',
      options: [
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
        { value: 'not_sure', label: 'Not sure' },
      ],
    },
    {
      key: 'contractualNotice',
      label: 'Contractual notice (weeks)',
      display: (v) => (v ? `${v} week${v === '1' ? '' : 's'}` : '0 weeks'),
      type: 'number',
    },
  ]

  return (
    <div className="mb-4 sm:mb-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E2DCCE]">
        <button
          type="button"
          onClick={togglePanel}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0B1F3A] hover:text-[#D9603B] transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {open ? 'Close inputs' : 'Edit my numbers'}
        </button>

        <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#5B6577]">
          <span>
            2026/27 rates · {jurisdiction === 'NI' ? 'Northern Ireland' : 'England, Scotland & Wales'} (£{jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB}/wk cap)
          </span>
          {!showJurisdiction ? (
            <button
              type="button"
              onClick={() => setShowJurisdiction(true)}
              className="underline underline-offset-2 text-[#0B1F3A] hover:text-[#D9603B] bg-transparent border-0 cursor-pointer p-0 text-[12px]"
            >
              Change
            </button>
          ) : (
            <div className="inline-flex gap-1.5">
              {(['GB', 'NI'] as const).map((j) => (
                <button
                  key={j}
                  type="button"
                  onClick={() => {
                    onJurisdictionChange(j)
                    setShowJurisdiction(false)
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold border cursor-pointer"
                  style={{
                    background: jurisdiction === j ? '#0B1F3A' : '#fff',
                    color: jurisdiction === j ? '#fff' : '#0B1F3A',
                    borderColor: jurisdiction === j ? '#0B1F3A' : '#E2DCCE',
                  }}
                >
                  {j === 'GB' ? 'GB' : 'NI'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {open && (
        <div className="bg-white border border-[#E2DCCE] rounded-xl p-5 mt-3 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-[17px] font-bold text-[#0B1F3A] m-0">Your details</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[20px] text-[#5B6577] hover:text-[#0B1F3A] leading-none bg-transparent border-0 cursor-pointer"
              aria-label="Close inputs"
            >
              &times;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 divide-y sm:divide-y-0 divide-[#EFEAE0]">
            {fields.map((f) => (
              <div key={f.key} className="py-2.5 flex items-start justify-between gap-2 border-b border-[#EFEAE0]">
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-[#5B6577] mb-0.5">{f.label}</div>
                  {editingField === f.key ? (
                    <div className="mt-1">
                      {f.type === 'number' && (
                        <input
                          type="number"
                          className="w-full max-w-[180px] border border-[#0B1F3A] rounded-md py-1.5 px-2.5 text-[14px] text-[#0B1F3A] bg-white outline-none"
                          value={draft[f.key]}
                          onChange={(e) => set(f.key, e.target.value.replace(/^0+(?=\d)/, ''))}
                          autoFocus
                        />
                      )}
                      {f.type === 'select' && f.options && (
                        <select
                          className="w-full py-1.5 px-2.5 text-[13px] text-[#0B1F3A] bg-white border border-[#0B1F3A] rounded-md outline-none"
                          value={draft[f.key]}
                          onChange={(e) => set(f.key, e.target.value)}
                          autoFocus
                        >
                          {f.options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      )}
                      {f.type === 'pill' && f.options && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {f.options.map((o) => (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => set(f.key, o.value)}
                              className="px-2.5 py-1 rounded-full text-[12px] font-medium border cursor-pointer"
                              style={{
                                background: draft[f.key] === o.value ? '#0B1F3A' : '#fff',
                                color: draft[f.key] === o.value ? '#fff' : '#0B1F3A',
                                borderColor: draft[f.key] === o.value ? '#0B1F3A' : '#E2DCCE',
                              }}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[14px] text-[#0B1F3A] font-semibold">{f.display(inputs[f.key])}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setEditingField(editingField === f.key ? null : f.key)}
                  className="text-[12px] font-semibold text-[#D9603B] hover:underline bg-transparent border-0 cursor-pointer flex-shrink-0 mt-2 p-0"
                >
                  {editingField === f.key ? 'Done' : 'Edit'}
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={apply} className="btn-primary self-start cursor-pointer">
            Recalculate
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Verdict Hero Card (Human, Scannable, Zero Jargon) ──────────── */

function VerdictHeroCard({
  result,
  offer,
  yearsNum,
}: {
  result: VerdictResult
  offer: number
  yearsNum: number
}) {
  const [showMethod, setShowMethod] = useState(false)

  let pillText = 'Within Typical Range'
  let cardBg = '#F2F5F8'
  let cardBorder = '#C8D3DF'
  let pillColor = '#0B1F3A'
  let headline = `Your ${formatCurrency(offer)} offer sits within the typical range.`
  let summary =
    'Under Section 203(3) ERA 1996, a settlement agreement only becomes legally binding once an independent solicitor reviews your £30,000 tax split, reference wording, and post-exit restrictions.'

  if (offer === 0) {
    pillText = 'Pre-Offer Baseline'
    cardBg = '#F2F5F8'
    cardBorder = '#C8D3DF'
    pillColor = '#0B1F3A'
    headline = `Your calculated statutory baseline is ${formatCurrency(result.minimum)}.`
    summary = `Based on ${yearsNum} ${yearsNum === 1 ? 'year' : 'years'} of service (${
      result.redundancy > 0
        ? `${formatCurrency(result.pilon)} notice + ${formatCurrency(result.redundancy)} statutory redundancy`
        : `${formatCurrency(result.pilon)} statutory notice`
    }, subject to eligibility). ACAS guidance recommends at least 10 calendar days to consider any formal proposal.`
  } else if (result.verdict === 'BELOW_MINIMUM') {
    const shortfall = Math.max(0, result.minimum - result.effectiveOffer)
    pillText = 'Below Statutory Baseline'
    cardBg = '#FBF0EE'
    cardBorder = '#D9A99E'
    pillColor = '#A8341F'
    headline = `Your ${formatCurrency(offer)} offer is ${formatCurrency(shortfall)} below your statutory baseline.`
    summary = `Your calculated notice and redundancy baseline is ${formatCurrency(result.minimum)} (subject to eligibility). An independent SRA solicitor can check what is missing before you reply to HR.`
  } else if (result.verdict === 'BELOW_TYPICAL') {
    pillText = 'Below Typical Range'
    cardBg = '#FEFBF0'
    cardBorder = '#E0CB94'
    pillColor = '#9A6B16'
    headline = `Your ${formatCurrency(offer)} offer covers the minimum, but sits below typical payouts.`
    summary = `First offers are often a starting point. For ${yearsNum} ${yearsNum === 1 ? 'year' : 'years'} of service, an SRA solicitor can review your financial terms, tax allocation, and reference wording.`
  }

  return (
    <section
      aria-label="Settlement estimate summary"
      className="rounded-2xl p-5 sm:p-6"
      style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
    >
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-[0.08em] uppercase mb-3.5 bg-white"
        style={{ color: pillColor, border: `1px solid ${cardBorder}` }}
      >
        {pillText}
      </span>

      <h1 className="font-serif text-[26px] sm:text-[30px] leading-[1.2] font-bold text-[#0B1F3A] m-0 mb-5">
        {headline}
      </h1>

      {/* 3-Number Scannable Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 py-4 border-y border-[#0B1F3A]/10 mb-4">
        <div>
          <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
            {offer > 0 ? 'Your offer' : 'Your offer'}
          </div>
          <div className="font-serif text-[23px] sm:text-[26px] font-bold text-[#0B1F3A] leading-tight">
            {offer > 0 ? formatCurrency(offer) : 'Not yet tabled'}
          </div>
        </div>

        <div className="border-l border-[#0B1F3A]/10 pl-3.5 sm:pl-4">
          <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
            Statutory baseline
          </div>
          <div className="font-serif text-[23px] sm:text-[26px] font-bold text-[#0B1F3A] leading-tight">
            {formatCurrency(result.minimum)}
          </div>
        </div>

        <div className="col-span-2 sm:col-span-1 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#0B1F3A]/10 sm:pl-4">
          <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
            Typical range
          </div>
          <div className="font-serif text-[23px] sm:text-[26px] font-bold text-[#0B1F3A] leading-tight">
            {result.typicalHighUncapped ? (
              <>
                {formatCurrency(result.typicalLow)}+{' '}
                <span className="text-[14px] font-sans font-normal text-[#5B6577]">(uncapped)</span>
              </>
            ) : (
              `${formatCurrency(result.typicalLow)} to ${formatCurrency(result.typicalHigh)}`
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowMethod((v) => !v)}
            className="text-[13px] text-[#5B6577] underline underline-offset-2 hover:text-[#0B1F3A] bg-transparent border-0 p-0 mt-1 cursor-pointer"
          >
            {showMethod ? 'Hide method' : 'How is this calculated?'}
          </button>
        </div>
      </div>

      {showMethod && (
        <p className="text-[14px] text-[#5B6577] leading-[1.6] bg-white/80 rounded-lg p-3.5 mb-4 border border-[#0B1F3A]/10">
          The statutory baseline combines calculated notice pay (ERA 1996 s.86) and statutory redundancy pay (s.162, subject to s.141 eligibility). The typical range adds an illustrative negotiation allowance based on UK settlement practice. Actual outcomes depend on your contract and facts.
        </p>
      )}

      <p className="text-[16px] text-[#2B3445] leading-[1.6] m-0">{summary}</p>

      {/* Contextual High-Value Flags (Concise, 1 line each) */}
      {(result.discriminationAsterisk || (result.collectiveRedundancy && result.protectiveAwardMax > 0)) && (
        <div className="mt-4 pt-3.5 border-t border-[#0B1F3A]/10 space-y-2 text-[14px] text-[#0B1F3A] leading-[1.55]">
          {result.discriminationAsterisk && (
            <p className="m-0">
              <strong>Discrimination flag:</strong> Established Equality Act 2010 claims are uncapped and include Injury to Feelings (Vento bands).
            </p>
          )}
          {result.collectiveRedundancy && result.protectiveAwardMax > 0 && (
            <p className="m-0">
              <strong>Collective redundancy (20+):</strong> Failure to consult can carry a separate Protective Award claim of up to{' '}
              <strong>{formatCurrency(result.protectiveAwardMax)}</strong> (TULRCA 1992 s.189).
            </p>
          )}
        </div>
      )}
    </section>
  )
}

/* ── Unified Breakdown & Take-Home Card (Replaces 2 Duplicate Boxes) ── */

function UnifiedBreakdownCard({
  result,
  offer,
  pensionSacrifice,
  taxSavedByPension,
}: {
  result: VerdictResult
  offer: number
  pensionSacrifice: number
  taxSavedByPension: number
}) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const taxRatePct = Math.round(result.taxRate * 100)
  const srpLabel = result.redundancy > 0 ? 'Statutory redundancy pay' : 'Basic award (unfair dismissal)'
  const srpValue = result.redundancy > 0 ? result.redundancy : result.basicAward

  const effectiveTax = Math.max(0, result.estimatedTax - taxSavedByPension)
  const effectiveNet = Math.max(0, result.estimatedNet - pensionSacrifice + taxSavedByPension)
  const adjustedTaxableTerm = Math.max(0, result.taxableTermination - pensionSacrifice)

  const totalBar = Math.max(offer, result.pilon + result.taxFreeAmount + result.taxableTermination) || 1
  const taxFreePct = Math.min(100, Math.max(0, (result.taxFreeAmount / totalBar) * 100))
  const taxablePct = Math.min(100, Math.max(0, (adjustedTaxableTerm / totalBar) * 100))
  const pensionPct = Math.min(100, Math.max(0, (pensionSacrifice / totalBar) * 100))
  const pilonPct = Math.min(100, Math.max(0, (result.pilon / totalBar) * 100))

  return (
    <section
      aria-label="Pay and tax breakdown"
      className="bg-white border border-[#E2DCCE] rounded-2xl overflow-hidden shadow-sm"
    >
      <div className="px-5 py-4 border-b border-[#EFEAE0] flex items-center justify-between gap-2">
        <h2 className="font-serif text-[20px] sm:text-[22px] font-bold text-[#0B1F3A] m-0">
          How your numbers break down
        </h2>
        <span className="text-[13px] font-mono text-[#5B6577]">
          {offer > 0 ? `Est. ${taxRatePct}% tax band` : 'Statutory baseline'}
        </span>
      </div>

      {/* Compact Rows */}
      <div className="divide-y divide-[#EFEAE0] text-[15px] sm:text-[16px]">
        {srpValue > 0 && (
          <div className="px-5 py-3.5 flex items-center justify-between gap-3">
            <span className="text-[#0B1F3A]">{srpLabel}</span>
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#0B1F3A]/8 text-[#0B1F3A]">
                Tax-free*
              </span>
              <span className="font-mono font-semibold text-[#0B1F3A]">{formatCurrency(srpValue)}</span>
            </div>
          </div>
        )}

        <div className="px-5 py-3.5 flex items-center justify-between gap-3">
          <span className="text-[#0B1F3A]">
            Notice pay (PILON · {result.noticeWeeksUsed} wk{result.noticeWeeksUsed !== 1 ? 's' : ''})
          </span>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A8341F]/10 text-[#A8341F]">
              Taxable
            </span>
            <span className="font-mono font-semibold text-[#0B1F3A]">{formatCurrency(result.pilon)}</span>
          </div>
        </div>

        <div className="px-5 py-3.5 flex items-center justify-between gap-3 bg-[#FAF8F5]">
          <span className="font-semibold text-[#0B1F3A]">Calculated statutory baseline</span>
          <span className="font-mono font-bold text-[#0B1F3A]">{formatCurrency(result.minimum)}</span>
        </div>

        {offer > 0 && (
          <>
            <div className="px-5 py-3.5 flex items-center justify-between gap-3">
              <span className="text-[#5B6577]">Estimated income tax on offer ({taxRatePct}%)</span>
              <span className="font-mono font-semibold text-[#A8341F]">-{formatCurrency(effectiveTax)}</span>
            </div>

            <div className="px-5 py-4 flex items-center justify-between gap-3 bg-[#F7F4EE]">
              <div>
                <span className="font-bold text-[#0B1F3A] block">Estimated net take-home cash</span>
                {pensionSacrifice > 0 && (
                  <span className="text-[13px] text-[#5B6577]">
                    Plus {formatCurrency(pensionSacrifice)} into pension (tax-free)
                  </span>
                )}
              </div>
              <span className="font-serif text-[24px] font-bold text-[#0B1F3A]">{formatCurrency(effectiveNet)}</span>
            </div>
          </>
        )}
      </div>

      {/* Integrated Visual Tax Split Bar (when offer > 0) */}
      {offer > 0 && (
        <div className="px-5 py-4 border-t border-[#EFEAE0]">
          <div className="flex w-full h-3.5 rounded-full overflow-hidden bg-[#EFEAE0] mb-3">
            {taxFreePct > 0 && (
              <div
                style={{ width: `${taxFreePct}%` }}
                className="bg-[#0B1F3A]"
                title={`Tax-free ex-gratia: ${formatCurrency(result.taxFreeAmount)}`}
              />
            )}
            {taxablePct > 0 && (
              <div
                style={{ width: `${taxablePct}%` }}
                className="bg-[#E0CB94]"
                title={`Taxable ex-gratia: ${formatCurrency(adjustedTaxableTerm)}`}
              />
            )}
            {pensionPct > 0 && (
              <div
                style={{ width: `${pensionPct}%` }}
                className="bg-[#5B6577]"
                title={`To pension: ${formatCurrency(pensionSacrifice)}`}
              />
            )}
            {pilonPct > 0 && (
              <div
                style={{ width: `${pilonPct}%` }}
                className="bg-[#D9603B]"
                title={`Notice pay (PILON): ${formatCurrency(result.pilon)}`}
              />
            )}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-[#5B6577]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#0B1F3A] inline-block" />
              Tax-free: <strong className="text-[#0B1F3A]">{formatCurrency(result.taxFreeAmount)}</strong>
            </span>
            {adjustedTaxableTerm > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#E0CB94] inline-block" />
                Taxable excess: <strong className="text-[#0B1F3A]">{formatCurrency(adjustedTaxableTerm)}</strong>
              </span>
            )}
            {pensionSacrifice > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#5B6577] inline-block" />
                Pension: <strong className="text-[#0B1F3A]">{formatCurrency(pensionSacrifice)}</strong>
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#D9603B] inline-block" />
              Notice (PILON): <strong className="text-[#0B1F3A]">{formatCurrency(result.pilon)}</strong>
            </span>
          </div>
        </div>
      )}

      {/* Collapsible Tax Rules & Legal Sources */}
      <div className="border-t border-[#EFEAE0] no-print">
        <button
          type="button"
          onClick={() => setSourcesOpen((o) => !o)}
          className="w-full px-5 py-3.5 text-left flex items-center justify-between text-[14px] font-medium text-[#5B6577] hover:text-[#0B1F3A] bg-[#FAF8F5] border-0 cursor-pointer"
        >
          <span>Tax rules, eligibility &amp; legislation sources</span>
          <span style={{ transform: sourcesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }}>▾</span>
        </button>

        {sourcesOpen && (
          <div className="px-5 py-4 bg-[#FAF8F5] border-t border-[#EFEAE0] text-[14px] text-[#5B6577] leading-[1.6] space-y-2.5">
            <p className="m-0">
              * <strong>Statutory eligibility:</strong> Statutory redundancy pay is subject to ERA 1996 s.141 (and may be forfeited if suitable alternative employment is unreasonably refused). Notice pay can be lost on summary dismissal for gross misconduct (<em>Boston Deep Sea Fishing v Ansell</em>).
            </p>
            <p className="m-0">
              * <strong>Tax treatment:</strong> The first £30,000 of genuine termination payments is exempt under{' '}
              <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="underline text-[#0B1F3A]">
                ITEPA 2003 s.403
              </a>
              . Notice pay (PILON) is always taxable under{' '}
              <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="underline text-[#0B1F3A]">
                ITEPA 2003 s.402D
              </a>
              . Accrued untaken holiday pay is paid separately under Working Time Regulations 1998 reg. 14.
              {result.isScottishNote ? ' Scottish taxpayers have different income tax bands.' : ''}
            </p>
            <p className="m-0">
              * <strong>2026/27 statutory caps:</strong>{' '}
              <a href="https://www.legislation.gov.uk/ukpga/1996/18/sections/162-163" target="_blank" rel="noopener noreferrer" className="underline text-[#0B1F3A]">
                ERA 1996 ss.162-163
              </a>{' '}
              (redundancy),{' '}
              <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/86" target="_blank" rel="noopener noreferrer" className="underline text-[#0B1F3A]">
                s.86
              </a>{' '}
              (notice),{' '}
              <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="underline text-[#0B1F3A]">
                s.227
              </a>{' '}
              (£{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI weekly cap).
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

/* ── On-Demand Tool: Deadlines & Solicitor Call Prep ────────────── */

function DeadlinesAndCallPrepPanel({ offer }: { offer: number }) {
  const [terminationDate, setTerminationDate] = useState<string>(() => new Date().toISOString().split('T')[0])

  const deadlineDate = useMemo(() => {
    if (!terminationDate) return null
    const [y, m, d] = terminationDate.split('-').map(Number)
    if (!y || !m || !d) return null
    const dt = new Date(y, m - 1 + 3, d)
    dt.setDate(dt.getDate() - 1)
    return dt
  }, [terminationDate])

  const daysRemaining = useMemo(() => {
    if (!deadlineDate) return 0
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    return Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  }, [deadlineDate])

  const formattedDeadline = useMemo(() => {
    if (!deadlineDate) return ''
    return deadlineDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  }, [deadlineDate])

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-5 shadow-sm space-y-5">
      {/* Privilege Tip */}
      <div className="p-4 rounded-xl bg-[#FEFBF0] border border-[#E0CB94] text-[15px] text-[#5A410D] leading-[1.6]">
        <strong>Important before emailing HR:</strong> Do not send an unreviewed counter-offer directly to your employer. Under English contract law (<em>Hyde v Wrench</em>), an unreviewed counter-offer can put your existing offer at risk. Speak with your solicitor first.
      </div>

      {/* 3-Month Tribunal Deadline Calculator */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <h3 className="font-serif text-[20px] font-bold text-[#0B1F3A] m-0">
            ACAS Tribunal Deadline (3 months minus 1 day)
          </h3>
          <span className="text-[12px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#F7F4EE] text-[#0B1F3A] border border-[#E2DCCE]">
            {daysRemaining > 0 ? `${daysRemaining} days left` : 'Window expired'}
          </span>
        </div>
        <p className="text-[15px] text-[#5B6577] leading-[1.6] m-0 mb-3.5">
          Settlement talks do not pause the statutory Employment Tribunal clock. Enter your leaving or incident date to see your ACAS Early Conciliation cut-off:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-[#F7F4EE] border border-[#E2DCCE] rounded-xl p-4">
          <div>
            <label htmlFor="termination-date-input" className="block text-[13px] font-semibold text-[#0B1F3A] mb-1.5">
              Leaving or incident date
            </label>
            <input
              id="termination-date-input"
              type="date"
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
              className="w-full bg-white border border-[#D8D2C6] rounded-lg px-3 py-2 text-[15px] text-[#0B1F3A] font-mono outline-none focus:border-[#0B1F3A]"
            />
          </div>
          <div className="sm:border-l sm:border-[#E2DCCE] sm:pl-4">
            <span className="block text-[12px] font-mono uppercase tracking-wider text-[#5B6577]">
              ACAS notification deadline
            </span>
            <span className="block font-serif text-[21px] font-bold text-[#0B1F3A]">{formattedDeadline}</span>
            <a
              href="https://www.acas.org.uk/early-conciliation"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackOutboundCitation('https://www.acas.org.uk/early-conciliation', 'ACAS Early Conciliation', {
                  component: 'deadlines_panel',
                })
              }
              className="text-[13px] text-[#0B1F3A] underline hover:text-[#D9603B]"
            >
              ACAS Early Conciliation guidance ↗
            </a>
          </div>
        </div>
      </div>

      {/* Concise Solicitor Call Checklist */}
      <div className="pt-3.5 border-t border-[#EFEAE0]">
        <h3 className="font-serif text-[19px] font-bold text-[#0B1F3A] m-0 mb-2.5">
          What to bring to your solicitor call
        </h3>
        <ul className="m-0 pl-5 space-y-2 text-[15px] text-[#5B6577] leading-[1.6]">
          <li>Your employment contract (to verify contractual notice, bonus, and restrictive covenants).</li>
          <li>
            {offer > 0
              ? 'Your draft settlement agreement or offer email, including any deadline HR has mentioned.'
              : 'Notes from any verbal exit discussions (ask HR to confirm any proposal in writing).'}
          </li>
          <li>Questions on tax allocation (the £30,000 exemption under s.403), agreed reference wording, and accrued holiday pay.</li>
        </ul>
      </div>
    </div>
  )
}

/* ── On-Demand Tool: Benchmarks & FAQs ──────────────────────────── */

const CONCISE_FAQS = [
  {
    q: 'Who pays the solicitor fees?',
    a: 'Employers standardly provide a capped contribution (typically £350 to £500+ +VAT) paid directly to your solicitor upon completion of the agreement. For standard reviews within that cap, the employer contribution covers the legal fee. Work outside the cap or abortive fees if you choose not to complete remain subject to your solicitor\'s terms.',
  },
  {
    q: 'Will my employer know I used SettlementCheck?',
    a: 'No. Your calculation and enquiry are completely private. Your details are sent to one SRA-regulated employment solicitor only, and your employer is never contacted unless you formally instruct the solicitor to do so.',
  },
  {
    q: 'How quickly can a solicitor sign off my agreement?',
    a: 'Standard settlement reviews normally complete within 24 to 48 hours once you instruct your solicitor. ACAS Code 4 recommends at least 10 calendar days to consider terms, though employers can set shorter deadlines.',
  },
  {
    q: 'What if I have not received a written offer yet?',
    a: 'You can still speak with a solicitor to understand your statutory baseline and how to handle protected conversations (s.111A ERA 1996 applies strictly to ordinary unfair dismissal and excludes discrimination or whistleblowing).',
  },
]

function BenchmarksAndFaqPanel({
  reason,
  salary,
  result,
  isDiscrimination,
  totalMonths,
}: {
  reason: string
  salary: number
  result: VerdictResult
  isDiscrimination: boolean
  totalMonths: number
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const benchmark = getOfficialBenchmark(reason, isDiscrimination)
  const monthlySalary = salary / 12
  const refLow = Math.round(result.minimum + monthlySalary * benchmark.typicalAcasExGratiaMonths.min)
  const refHigh = Math.round(result.minimum + monthlySalary * benchmark.typicalAcasExGratiaMonths.max)

  const isOrdinaryUnfairDismissal = !isDiscrimination && reason !== 'redundancy' && reason !== 'redundancy_collective'
  const showTribunalMedian = !(isOrdinaryUnfairDismissal && totalMonths < 24)

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E2DCCE] rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3.5 border-b border-[#EFEAE0]">
          <h3 className="font-serif text-[17px] font-bold text-[#0B1F3A] m-0">
            Published UK Tribunal Benchmarks
          </h3>
          <a
            href={benchmark.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackOutboundCitation(benchmark.sourceUrl, benchmark.sourceName, { component: 'benchmarks_panel' })
            }
            className="text-[11px] font-mono text-[#0B1F3A] underline hover:text-[#D9603B]"
          >
            Source: {benchmark.sourceName} ↗
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-[#FAF8F5] border border-[#E2DCCE] rounded-xl p-3.5">
            <span className="text-[11px] text-[#5B6577] block mb-0.5">MoJ Tribunal Median Award</span>
            <span className="font-serif text-[20px] font-bold text-[#0B1F3A] block">
              {showTribunalMedian ? formatCurrency(benchmark.medianTribunalAward) : 'N/A (< 2 yrs service)'}
            </span>
            <span className="text-[11px] text-[#8A93A3] block mt-1">
              {showTribunalMedian
                ? `Mean average: ${formatCurrency(benchmark.meanTribunalAward)}`
                : 'Ordinary unfair dismissal requires 2 years continuous service (ERA 1996 s.108)'}
            </span>
          </div>

          <div className="bg-[#FAF8F5] border border-[#E2DCCE] rounded-xl p-3.5">
            <span className="text-[11px] text-[#5B6577] block mb-0.5">Illustrative Negotiation Benchmark</span>
            <span className="font-serif text-[20px] font-bold text-[#0B1F3A] block">
              {formatCurrency(refLow)} to {formatCurrency(refHigh)}
            </span>
            <span className="text-[11px] text-[#8A93A3] block mt-1">
              Baseline + {benchmark.typicalAcasExGratiaMonths.min} to {benchmark.typicalAcasExGratiaMonths.max} months ex-gratia
            </span>
          </div>
        </div>
      </div>

      {/* Crisp 4-item FAQ */}
      <div className="bg-white border border-[#E2DCCE] rounded-2xl p-5 shadow-sm">
        <h3 className="font-serif text-[20px] font-bold text-[#0B1F3A] m-0 mb-3">Common questions</h3>
        <div className="divide-y divide-[#EFEAE0]">
          {CONCISE_FAQS.map((item, i) => (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                className="w-full py-3.5 text-left flex items-center justify-between gap-3 bg-transparent border-0 cursor-pointer"
              >
                <span className="text-[16px] font-semibold text-[#0B1F3A]">{item.q}</span>
                <span className="text-[#5B6577] font-bold text-[18px] shrink-0">{openFaq === i ? '−' : '+'}</span>
              </button>
              {openFaq === i && (
                <p className="text-[15px] text-[#5B6577] leading-[1.6] m-0 pb-4">{item.a}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── On-Demand Tool: Pension Sacrifice Optimiser ────────────────── */

function PensionSacrificePanel({
  taxableTermination,
  salary,
  sacrificeVal,
  setSacrificeVal,
}: {
  taxableTermination: number
  salary: number
  sacrificeVal: number
  setSacrificeVal: (val: number) => void
}) {
  const isDemoMode = taxableTermination <= 0 && salary >= 100000
  const [demoVal, setDemoVal] = useState(10000)
  const limit = isDemoMode ? 20000 : taxableTermination
  const currentVal = isDemoMode ? demoVal : sacrificeVal
  const setVal = isDemoMode ? setDemoVal : setSacrificeVal
  const res = calcPensionSacrifice(limit, currentVal, salary)

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-5 shadow-sm space-y-4">
      <div>
        <h3 className="font-serif text-[17px] font-bold text-[#0B1F3A] m-0 mb-1">
          Pension Sacrifice Tax Optimiser (s.408 ITEPA 2003)
        </h3>
        <p className="text-[13px] text-[#5B6577] leading-relaxed m-0">
          {isDemoMode
            ? 'Illustrative demo for a £50,000 package (£20,000 above the £30,000 tax-free threshold). Directing taxable ex-gratia pay into a registered pension avoids income tax on that slice.'
            : 'Termination payments above £30,000 are taxed at your marginal rate. Directing part of that excess into a pension as an employer contribution avoids income tax on that amount.'}
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[13px] font-semibold text-[#0B1F3A]">
          <span>Amount redirected to pension</span>
          <span className="text-[#D9603B] font-mono">{formatCurrency(currentVal)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={limit}
          step="100"
          value={currentVal}
          onChange={(e) => setVal(Number(e.target.value))}
          className="sc-slider w-full cursor-pointer"
          style={{
            background: `linear-gradient(to right, #D9603B 0%, #D9603B ${(currentVal / (limit || 1)) * 100}%, #E2DCCE ${(currentVal / (limit || 1)) * 100}%, #E2DCCE 100%)`,
          }}
        />
        <div className="flex justify-between text-[11px] text-[#8A93A3]">
          <span>£0 (take cash)</span>
          <span>Max: {formatCurrency(limit)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EFEAE0]">
        <div>
          <span className="text-[10px] font-mono uppercase text-[#8A93A3] block">Tax saved</span>
          <span className="text-[17px] font-bold text-[#0B1F3A]">{formatCurrency(res.taxSaved)}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-[#8A93A3] block">Into pension</span>
          <span className="text-[17px] font-bold text-[#0B1F3A]">{formatCurrency(res.pensionGrowth)}</span>
        </div>
        <div>
          <span className="text-[10px] font-mono uppercase text-[#8A93A3] block">Net wealth gain</span>
          <span className="text-[17px] font-bold text-[#D9603B]">+{formatCurrency(res.netWealthBenefit)}</span>
        </div>
      </div>

      <p className="text-[11px] text-[#8A93A3] m-0">
        Must be written into the settlement agreement before signing and requires employer agreement.
      </p>
    </div>
  )
}

/* ── On-Demand Tool: Vento Bands (Only if Discrimination Flagged) ─ */

function VentoBandPanel({
  selectedBand,
  onBandSelect,
  ventoBands,
}: {
  selectedBand: 'lower' | 'middle' | 'upper' | 'exceptional' | null
  onBandSelect: (b: 'lower' | 'middle' | 'upper' | 'exceptional' | null) => void
  ventoBands: {
    lowerMin: number
    lowerMax: number
    middleMin: number
    middleMax: number
    upperMin: number
    upperMax: number
    exceptionalMin: number
  }
}) {
  const bands = [
    { key: 'lower' as const, name: 'Lower Band', range: `${formatCurrency(ventoBands.lowerMin)} to ${formatCurrency(ventoBands.lowerMax)}`, desc: 'One-off or less serious incidents.' },
    { key: 'middle' as const, name: 'Middle Band', range: `${formatCurrency(ventoBands.middleMin)} to ${formatCurrency(ventoBands.middleMax)}`, desc: 'Serious or repeated discrimination over time.' },
    { key: 'upper' as const, name: 'Upper Band', range: `${formatCurrency(ventoBands.upperMin)} to ${formatCurrency(ventoBands.upperMax)}`, desc: 'Lengthy campaigns of harassment or severe dismissal.' },
    { key: 'exceptional' as const, name: 'Exceptional', range: `${formatCurrency(ventoBands.exceptionalMin)}+`, desc: 'Reserved for the most severe cases.' },
  ]

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-5 shadow-sm space-y-3">
      <div>
        <h3 className="font-serif text-[17px] font-bold text-[#0B1F3A] m-0 mb-1">
          Injury to Feelings Guidelines (Vento Bands)
        </h3>
        <p className="text-[13px] text-[#5B6577] m-0 leading-relaxed">
          Equality Act 2010 claims are uncapped. Tribunals assess Injury to Feelings separately from financial loss using these bands:
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {bands.map((b) => {
          const active = selectedBand === b.key
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => onBandSelect(active ? null : b.key)}
              className="text-left p-3 rounded-xl border transition cursor-pointer"
              style={{
                background: active ? '#0B1F3A' : '#FAF8F5',
                borderColor: active ? '#0B1F3A' : '#E2DCCE',
                color: active ? '#ffffff' : '#0B1F3A',
              }}
            >
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="font-bold text-[13px]">{b.name}</span>
                <span className="font-mono text-[12px] font-bold" style={{ color: active ? '#fff' : '#D9603B' }}>
                  {b.range}
                </span>
              </div>
              <p className="text-[11px] m-0 leading-snug" style={{ color: active ? 'rgba(255,255,255,0.85)' : '#5B6577' }}>
                {b.desc}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Smart Mobile Sticky Bar (Hides when Intake Card is visible) ── */

function SmartMobileStickyBar({ onScrollToIntake }: { onScrollToIntake: () => void }) {
  const [show, setShow] = useState(false)
  const [overFooter, setOverFooter] = useState(false)

  useEffect(() => {
    const target = document.getElementById('solicitor-intake-card')
    if (!target || typeof IntersectionObserver === 'undefined') return

    let cardVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        cardVisible = !!entries[0]?.isIntersecting
        setShow(!cardVisible && window.scrollY > 360)
      },
      { threshold: 0.1 }
    )
    observer.observe(target)

    const footerEl = document.querySelector('footer')
    let footerObserver: IntersectionObserver | null = null
    if (footerEl) {
      footerObserver = new IntersectionObserver(
        (entries) => {
          setOverFooter(!!entries[0]?.isIntersecting)
        },
        { threshold: 0.05 }
      )
      footerObserver.observe(footerEl)
    }

    const onScroll = () => {
      setShow(!cardVisible && window.scrollY > 360)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      footerObserver?.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (!show) return null

  return (
    <div
      role="region"
      aria-label="Request solicitor review"
      className={`lg:hidden fixed inset-x-0 bottom-0 z-40 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-colors duration-200 no-print ${
        overFooter
          ? 'bg-white border-t-2 border-[#D9603B] shadow-[0_-8px_24px_rgba(0,0,0,0.28)]'
          : 'bg-[#F7F4EE] border-t border-[#E2DCCE] shadow-[0_-4px_20px_rgba(11,31,58,0.12)]'
      }`}
    >
      <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-bold text-[#0B1F3A] leading-snug m-0">
            Confidential SRA Solicitor Check
          </p>
        </div>
        <button
          type="button"
          onClick={onScrollToIntake}
          className="inline-flex items-center justify-center px-3.5 py-2.5 text-[13px] font-bold text-white bg-[#D9603B] hover:bg-[#B14A28] rounded-lg border-0 cursor-pointer flex-shrink-0 whitespace-nowrap"
        >
          Get my solicitor review →
        </button>
      </div>
    </div>
  )
}

/* ── Main Results Page ──────────────────────────────────────────── */

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [inputs, setInputs] = useState<EditableInputs>({
    salary: searchParams.get('salary') ?? '0',
    yearsNum: searchParams.get('yearsNum') ?? '0',
    monthsNum: searchParams.get('monthsNum') ?? '0',
    age: searchParams.get('age') ?? '0',
    offer: searchParams.get('offer') ?? '0',
    offerIncludesNotice: searchParams.get('offerIncludesNotice') ?? 'true',
    reason: searchParams.get('reason') ?? '',
    discrimination: searchParams.get('discrimination') ?? 'no',
    contractualNotice: searchParams.get('contractualNotice') ?? '0',
  })

  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>(() =>
    searchParams.get('jurisdiction') === 'NI' ? 'NI' : 'GB'
  )
  const [selectedVentoBand, setSelectedVentoBand] = useState<'lower' | 'middle' | 'upper' | 'exceptional' | null>(null)
  const [sacrificeVal, setSacrificeVal] = useState(0)
  const [activeTab, setActiveTab] = useState<DeepDiveTab | null>(null)

  const salary = parseFloat(inputs.salary)
  const yearsNum = parseFloat(inputs.yearsNum)
  const monthsNum = parseFloat(inputs.monthsNum)
  const totalMonths = yearsNum * 12 + monthsNum
  const age = parseInt(inputs.age, 10)
  const offer = parseFloat(inputs.offer)
  const offerIncludesNotice = inputs.offerIncludesNotice !== 'false'
  const reason = inputs.reason
  const discrimination = inputs.discrimination
  const contractualNotice = isNaN(parseInt(inputs.contractualNotice, 10)) ? 0 : parseInt(inputs.contractualNotice, 10)

  const valid = salary > 0 && age > 0 && offer >= 0 && reason !== ''
  const result: VerdictResult | null = valid
    ? getVerdict(salary, totalMonths, age, offer, reason, discrimination, contractualNotice, jurisdiction, offerIncludesNotice)
    : null

  const resultsTrackedRef = React.useRef(false)
  useEffect(() => {
    if (result && !resultsTrackedRef.current) {
      resultsTrackedRef.current = true
      trackClientEvent('results_viewed', {
        verdict: result.verdict,
        has_offer: offer > 0,
      })
    }
  }, [result, offer])

  const maxSacrifice = result && result.taxableTermination > 0 ? result.taxableTermination : 0
  const adjustedSacrificeVal = Math.min(sacrificeVal, maxSacrifice)
  const pensionRes =
    result && maxSacrifice > 0 ? calcPensionSacrifice(maxSacrifice, adjustedSacrificeVal, salary) : null

  const showPensionTab = maxSacrifice > 0 || salary >= 100000
  const showVentoTab = !!(result?.discriminationFlag && result?.ventoBands)

  const availableTabs: { id: DeepDiveTab; label: string }[] = [
    { id: 'deadlines', label: 'Deadlines & Call Prep' },
    { id: 'benchmarks', label: 'Tribunal Benchmarks & FAQs' },
    ...(showPensionTab ? [{ id: 'pension' as const, label: 'Pension Tax Optimiser' }] : []),
    ...(showVentoTab ? [{ id: 'vento' as const, label: 'Discrimination (Vento)' }] : []),
  ]

  const saveParams = {
    salary,
    yearsNum,
    monthsNum,
    age,
    offer,
    offerIncludesNotice: String(offerIncludesNotice),
    reason,
    discrimination,
    contractualNotice,
    jurisdiction,
  }

  function handleScrollToIntake() {
    if (!result) return
    trackSolicitorMatchClick('results_mobile_sticky_cta', { verdict: result.verdict, offer, salary })
    const el = document.getElementById('solicitor-intake-card')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el.querySelector<HTMLInputElement>('input')?.focus()
      return
    }
    router.push(`/get-matched/?verdict=${result.verdict}&offer=${offer}&salary=${salary}&months=${totalMonths}`)
  }

  return (
    <>
      <Nav />
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          @page { size: A4 portrait; margin: 14mm; }
          nav, footer, .no-print { display: none !important; }
          body, main { background: #ffffff !important; padding: 0 !important; margin: 0 !important; }
        }
      `,
        }}
      />

      <main className="bg-paper-2 min-h-screen pb-20">
        <div className="sc-container pt-4 md:pt-8" style={{ maxWidth: 1120 }}>
          <div className="no-print">
            <InputsSummaryPanel
              inputs={inputs}
              jurisdiction={jurisdiction}
              onJurisdictionChange={setJurisdiction}
              onUpdate={(next) => {
                setInputs(next)
                setSelectedVentoBand(null)
              }}
            />
          </div>

          {!valid && (
            <div className="bg-[#FEFBF0] border border-[#E0CB94] rounded-xl p-6 mb-6">
              <p className="text-[#9A6B16] font-semibold m-0">
                Missing calculation details. Please complete the calculator to view your estimate.
              </p>
              <Link href="/calculator/" className="mt-3 inline-block text-[14px] font-semibold text-[#0B1F3A] underline underline-offset-4">
                Return to calculator →
              </Link>
            </div>
          )}

          {result && (
            /* Single-DOM CSS Grid:
               - Mobile: Verdict -> Intake Card -> Breakdown -> Deep-Dive Tabs -> Regulatory Footer
               - Desktop (lg): Left 7 cols (Verdict, Breakdown, Tabs, Footer) | Right 5 cols Sticky (Intake Card) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
              {/* 1. Verdict Hero (Top-Left on Desktop, 1st on Mobile) */}
              <div className="lg:col-span-7 lg:col-start-1">
                <VerdictHeroCard result={result} offer={offer} yearsNum={Math.floor(yearsNum)} />
              </div>

              {/* 2. THE ONE Conversion Card (Sticky Top-Right on Desktop, 2nd on Mobile) */}
              <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-4 lg:sticky lg:top-[104px] no-print">
                <InlineSolicitorIntakeCard
                  verdict={result.verdict}
                  offer={offer}
                  salary={salary}
                  years={yearsNum}
                  disputeReason={reason}
                  sourceUrl="/results/"
                  saveParams={saveParams}
                  resultSummary={{
                    minimum: result.minimum,
                    typicalLow: result.typicalLow,
                    typicalHigh: result.typicalHigh,
                    typicalHighUncapped: result.typicalHighUncapped,
                    estimatedNet: result.estimatedNet,
                  }}
                />
              </div>

              {/* 3. Unified Breakdown & Take-Home Card (Left on Desktop, 3rd on Mobile) */}
              <div className="lg:col-span-7 lg:col-start-1">
                <UnifiedBreakdownCard
                  result={result}
                  offer={offer}
                  pensionSacrifice={adjustedSacrificeVal}
                  taxSavedByPension={pensionRes?.taxSaved ?? 0}
                />
              </div>

              {/* 4. On-Demand Deep-Dive Tools (Closed by default, zero clutter) */}
              <div className="lg:col-span-7 lg:col-start-1 space-y-3 no-print">
                <div className="flex flex-wrap gap-2" role="tablist" aria-label="Additional tools">
                  {availableTabs.map((tab) => {
                    const isOpen = activeTab === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={isOpen}
                        onClick={() => {
                          const next = isOpen ? null : tab.id
                          setActiveTab(next)
                          if (next) trackClientEvent('results_secondary_tab_click', { tab: next })
                        }}
                        className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold border transition cursor-pointer flex items-center gap-2 ${
                          isOpen
                            ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                            : 'bg-white text-[#0B1F3A] border-[#E2DCCE] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span className="text-[10px] opacity-75">{isOpen ? '▲' : '▼'}</span>
                      </button>
                    )
                  })}
                </div>

                {activeTab === 'deadlines' && <DeadlinesAndCallPrepPanel offer={offer} />}

                {activeTab === 'benchmarks' && (
                  <BenchmarksAndFaqPanel
                    reason={reason}
                    salary={salary}
                    result={result}
                    isDiscrimination={discrimination === 'yes'}
                    totalMonths={totalMonths}
                  />
                )}

                {activeTab === 'pension' && showPensionTab && (
                  <PensionSacrificePanel
                    taxableTermination={maxSacrifice}
                    salary={salary}
                    sacrificeVal={adjustedSacrificeVal}
                    setSacrificeVal={setSacrificeVal}
                  />
                )}

                {activeTab === 'vento' && showVentoTab && result.ventoBands && (
                  <VentoBandPanel
                    ventoBands={result.ventoBands}
                    selectedBand={selectedVentoBand}
                    onBandSelect={setSelectedVentoBand}
                  />
                )}
              </div>

              {/* 5. Single, Calm Regulatory Disclosure (Replaces 7 repeated legal boxes) */}
              <div className="lg:col-span-7 lg:col-start-1 pt-2 text-[13px] text-[#5B6577] leading-[1.6] no-print">
                <p className="m-0">
                  Estimates use 2026/27 UK statutory rates (£{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI weekly cap) for general guidance only and do not constitute legal or tax advice. SettlementCheck is an independent introducer, not a law firm. Employer legal fee contributions (£350 to £500+ +VAT) are standard commercial practice paid upon completion, not a statutory requirement; fees above the cap or abortive costs remain subject to your solicitor&apos;s terms.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <SmartMobileStickyBar onScrollToIntake={handleScrollToIntake} />
      <Footer />
    </>
  )
}

export default function ResultsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-2 flex items-center justify-center">
          <p className="text-[#5B6577] text-[15px]">Calculating your estimate...</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
