'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { Suspense, useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import {
  getVerdict,
  formatCurrency,
  VerdictResult,
  WEEKLY_CAP_GB,
  WEEKLY_CAP_NI,
} from '@/lib/calculations'
import { trackClientEvent, trackSolicitorMatchClick } from '@/lib/telemetry'
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
          className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#0B1F3A] hover:text-[#D9603B] transition-colors bg-transparent border-0 cursor-pointer p-0"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {open ? 'Close inputs' : 'Edit my numbers'}
        </button>

        <div className="flex flex-wrap items-center gap-2 text-[13px] text-[#5B6577]">
          <span>
            2026/27 rates · {jurisdiction === 'NI' ? 'Northern Ireland' : 'England, Scotland & Wales'} (£{jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB}/wk cap)
          </span>
          {!showJurisdiction ? (
            <button
              type="button"
              onClick={() => setShowJurisdiction(true)}
              className="underline underline-offset-2 text-[#0B1F3A] hover:text-[#D9603B] bg-transparent border-0 cursor-pointer p-0 text-[13px]"
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
                  className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold border cursor-pointer"
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
                          inputMode="numeric"
                          className="w-full max-w-[180px] border border-[#0B1F3A] rounded-md py-1.5 px-2.5 text-[16px] text-[#0B1F3A] bg-white outline-none"
                          value={draft[f.key]}
                          onChange={(e) => set(f.key, e.target.value.replace(/^0+(?=\d)/, ''))}
                          autoFocus
                        />
                      )}
                      {f.type === 'select' && f.options && (
                        <select
                          className="w-full py-1.5 px-2.5 text-[16px] text-[#0B1F3A] bg-white border border-[#0B1F3A] rounded-md outline-none"
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

/* ── Unified Estimate Report Card (Verdict + Take-Home + Breakdown) ── */

function EstimateReportCard({
  result,
  offer,
  yearsNum,
  onJumpToIntake,
}: {
  result: VerdictResult
  offer: number
  yearsNum: number
  onJumpToIntake: () => void
}) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  const taxRatePct = Math.round(result.taxRate * 100)
  const srpLabel = result.redundancy > 0 ? 'Statutory redundancy pay' : 'Basic award (unfair dismissal)'
  const srpValue = result.redundancy > 0 ? result.redundancy : result.basicAward

  const typicalRangeText = result.typicalHighUncapped
    ? `${formatCurrency(result.typicalLow)}+ (uncapped)`
    : `${formatCurrency(result.typicalLow)} to ${formatCurrency(result.typicalHigh)}`

  let pillText = 'Within Typical Range'
  let headerBg = '#F2F5F8'
  let headerBorder = '#C8D3DF'
  let pillColor = '#0B1F3A'
  let headline = `Your ${formatCurrency(offer)} offer sits within the typical range.`
  let summary = `Typical settlements for ${yearsNum} ${yearsNum === 1 ? 'year' : 'years'} of service sit around ${typicalRangeText}. Even an offer in this range needs an independent solicitor to sign it off and check the fine print.`

  if (offer === 0) {
    pillText = 'Pre-Offer Baseline'
    headerBg = '#F2F5F8'
    headerBorder = '#C8D3DF'
    pillColor = '#0B1F3A'
    headline = `Your legal minimum calculates to ${formatCurrency(result.minimum)}.`
    summary = `That covers ${
      result.redundancy > 0
        ? `${formatCurrency(result.pilon)} notice pay and ${formatCurrency(result.redundancy)} statutory redundancy`
        : `${formatCurrency(result.pilon)} statutory notice pay`
    } for ${yearsNum} ${yearsNum === 1 ? 'year' : 'years'} of service (subject to eligibility). Typical settlements in similar cases sit around ${typicalRangeText}.`
  } else if (result.verdict === 'BELOW_MINIMUM') {
    const shortfall = Math.max(0, result.minimum - result.effectiveOffer)
    pillText = 'Below Legal Minimum'
    headerBg = '#FBF0EE'
    headerBorder = '#D9A99E'
    pillColor = '#A8341F'
    headline = `Your ${formatCurrency(offer)} offer is ${formatCurrency(shortfall)} below your legal minimum.`
    summary = `Your calculated floor for notice and statutory redundancy is ${formatCurrency(result.minimum)} (subject to eligibility). An independent solicitor can check whether anything has been missed.`
  } else if (result.verdict === 'BELOW_TYPICAL') {
    pillText = 'Below Typical Range'
    headerBg = '#FEFBF0'
    headerBorder = '#E0CB94'
    pillColor = '#9A6B16'
    headline = `Your ${formatCurrency(offer)} offer covers the minimum, but sits below typical payouts.`
    summary = `Typical settlements for ${yearsNum} ${yearsNum === 1 ? 'year' : 'years'} of service sit around ${typicalRangeText}. First offers are often a starting point, and a solicitor can check if there is room to negotiate.`
  }

  const totalBar = Math.max(offer, result.pilon + result.taxFreeAmount + result.taxableTermination) || 1
  const taxFreePct = Math.min(100, Math.max(0, (result.taxFreeAmount / totalBar) * 100))
  const taxablePct = Math.min(100, Math.max(0, (result.taxableTermination / totalBar) * 100))
  const pilonPct = Math.min(100, Math.max(0, (result.pilon / totalBar) * 100))

  const hasAlerts =
    result.taxableTermination > 0 ||
    result.discriminationAsterisk ||
    (result.collectiveRedundancy && result.protectiveAwardMax > 0)

  return (
    <section
      aria-label="Your settlement estimate and breakdown"
      className="bg-white border border-[#E2DCCE] rounded-2xl overflow-hidden shadow-sm"
    >
      {/* Top Tinted Verdict Header */}
      <div
        className="p-5 sm:p-6"
        style={{ background: headerBg, borderBottom: `1px solid ${headerBorder}` }}
      >
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-bold tracking-[0.08em] uppercase bg-white"
            style={{ color: pillColor, border: `1px solid ${headerBorder}` }}
          >
            {pillText}
          </span>

          <button
            type="button"
            onClick={onJumpToIntake}
            className="lg:hidden text-[14px] font-semibold text-[#D9603B] hover:underline bg-transparent border-0 p-0 cursor-pointer no-print"
          >
            Solicitor review ↓
          </button>
        </div>

        <h1 className="font-serif text-[26px] sm:text-[31px] leading-[1.2] font-bold text-[#0B1F3A] m-0 mb-4">
          {headline}
        </h1>

        {/* 3 Concrete Numbers Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 py-3.5 border-y border-[#0B1F3A]/10 mb-3.5">
          {offer > 0 ? (
            <>
              <div>
                <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
                  Your offer
                </div>
                <div className="font-serif text-[24px] sm:text-[27px] font-bold text-[#0B1F3A] leading-tight">
                  {formatCurrency(offer)}
                </div>
              </div>

              <div className="border-l border-[#0B1F3A]/10 pl-3.5 sm:pl-4">
                <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
                  Legal minimum
                </div>
                <div className="font-serif text-[24px] sm:text-[27px] font-bold text-[#0B1F3A] leading-tight">
                  {formatCurrency(result.minimum)}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#0B1F3A]/10 sm:pl-4">
                <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
                  What you keep (est.)
                </div>
                <div className="font-serif text-[24px] sm:text-[27px] font-bold text-[#D9603B] leading-tight">
                  {formatCurrency(result.estimatedNet)}
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
                  Legal minimum
                </div>
                <div className="font-serif text-[24px] sm:text-[27px] font-bold text-[#0B1F3A] leading-tight">
                  {formatCurrency(result.minimum)}
                </div>
              </div>

              <div className="border-l border-[#0B1F3A]/10 pl-3.5 sm:pl-4">
                <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
                  Notice pay ({result.noticeWeeksUsed} wk{result.noticeWeeksUsed !== 1 ? 's' : ''})
                </div>
                <div className="font-serif text-[24px] sm:text-[27px] font-bold text-[#0B1F3A] leading-tight">
                  {formatCurrency(result.pilon)}
                </div>
              </div>

              <div className="col-span-2 sm:col-span-1 pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l border-[#0B1F3A]/10 sm:pl-4">
                <div className="text-[12px] font-mono uppercase tracking-wider text-[#5B6577] mb-1">
                  Typical range
                </div>
                <div className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0B1F3A] leading-tight">
                  {typicalRangeText}
                </div>
              </div>
            </>
          )}
        </div>

        <p className="text-[16px] text-[#2B3445] leading-[1.65] m-0">{summary}</p>
        {offer > 0 && (
          <p className="text-[14px] text-[#5B6577] leading-[1.55] m-0 mt-2">
            ACAS guidance recommends 10 calendar days to consider a written offer, though employers can set shorter deadlines.
          </p>
        )}

        {/* Above-the-fold Mobile Intake Jump CTA */}
        <div className="mt-4 lg:hidden no-print">
          <button
            type="button"
            onClick={onJumpToIntake}
            className="w-full py-3.5 px-4 rounded-xl bg-[#D9603B] hover:bg-[#B14A28] text-white font-bold text-base flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(217,96,59,0.26)] border-0 cursor-pointer transition-colors"
          >
            <span>
              {offer <= 0
                ? 'Check solicitor availability →'
                : result.verdict === 'BELOW_MINIMUM'
                ? 'Review this shortfall with a solicitor →'
                : result.verdict === 'BELOW_TYPICAL'
                ? 'Check my options with a solicitor →'
                : 'Check my terms & sign off →'}
            </span>
          </button>
          <p className="text-[12.5px] text-[#5B6577] text-center m-0 mt-1.5">
            Takes 20 seconds · Phone optional · 1 SRA firm match
          </p>
        </div>

        {/* Contextual 1-Line High-Value Flags (only when triggered) */}
        {hasAlerts && (
          <div className="mt-3.5 pt-3 border-t border-[#0B1F3A]/10 space-y-2 text-[14px] text-[#0B1F3A] leading-[1.55]">
            {result.taxableTermination > 0 && (
              <p className="m-0">
                <strong>Above £30,000 tax-free threshold:</strong> {formatCurrency(result.taxableTermination)} of your termination payment is taxable. Ask a solicitor whether redirecting part into a pension (ITEPA 2003 s.408) can reduce your tax bill before signing.
              </p>
            )}
            {result.discriminationAsterisk && (
              <p className="m-0">
                <strong>Discrimination element:</strong> Established Equality Act 2010 claims are uncapped and include Injury to Feelings awards (Vento bands).
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
      </div>

      {/* Seamless Breakdown Body */}
      <div>
        <div className="px-5 sm:px-6 py-3.5 border-b border-[#EFEAE0] flex items-center justify-between gap-2">
          <h2 className="font-serif text-[20px] font-bold text-[#0B1F3A] m-0">
            What these numbers mean
          </h2>
          {offer > 0 && (
            <span className="text-[13px] font-mono text-[#5B6577] shrink-0">
              Est. {taxRatePct}% tax band
            </span>
          )}
        </div>

        <div className="divide-y divide-[#EFEAE0] text-[16px]">
          {srpValue > 0 && (
            <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
              <div>
                <span className="text-[#0B1F3A] block">{srpLabel}</span>
                <span className="text-[13.5px] text-[#5B6577]">Usually tax-free up to £30,000</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#0B1F3A]/8 text-[#0B1F3A]">
                  Tax-free
                </span>
                <span className="font-mono font-semibold text-[#0B1F3A]">{formatCurrency(srpValue)}</span>
              </div>
            </div>
          )}

          <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            <div>
              <span className="text-[#0B1F3A] block">
                Notice pay ({result.noticeWeeksUsed} week{result.noticeWeeksUsed !== 1 ? 's' : ''})
              </span>
              <span className="text-[13.5px] text-[#5B6577]">Taxed like normal wages</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A8341F]/10 text-[#A8341F]">
                Taxable
              </span>
              <span className="font-mono font-semibold text-[#0B1F3A]">{formatCurrency(result.pilon)}</span>
            </div>
          </div>

          <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3 bg-[#FAF8F5]">
            <div>
              <span className="font-semibold text-[#0B1F3A] block">Your legal minimum</span>
              <span className="text-[13.5px] text-[#5B6577]">Notice pay plus statutory redundancy before any extra compensation</span>
            </div>
            <span className="font-mono font-bold text-[#0B1F3A] shrink-0">{formatCurrency(result.minimum)}</span>
          </div>

          {offer > 0 && (
            <>
              <div className="px-5 sm:px-6 py-3.5 flex items-center justify-between gap-3">
                <span className="text-[#5B6577]">Estimated income tax on offer ({taxRatePct}%)</span>
                <span className="font-mono font-semibold text-[#A8341F]">-{formatCurrency(result.estimatedTax)}</span>
              </div>

              <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-3 bg-[#F7F4EE]">
                <div>
                  <span className="font-bold text-[#0B1F3A] block">What you actually keep (estimated)</span>
                  <span className="text-[13.5px] text-[#5B6577]">Estimated take-home cash after income tax</span>
                </div>
                <span className="font-serif text-[24px] font-bold text-[#0B1F3A] shrink-0">{formatCurrency(result.estimatedNet)}</span>
              </div>
            </>
          )}
        </div>

        {/* Compact Visual Tax Split Bar */}
        {offer > 0 && (
          <div className="px-5 sm:px-6 py-4 border-t border-[#EFEAE0]">
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-[#EFEAE0] mb-2.5">
              {taxFreePct > 0 && (
                <div
                  style={{ width: `${taxFreePct}%` }}
                  className="bg-[#0B1F3A]"
                  title={`Tax-free termination payment: ${formatCurrency(result.taxFreeAmount)}`}
                />
              )}
              {taxablePct > 0 && (
                <div
                  style={{ width: `${taxablePct}%` }}
                  className="bg-[#E0CB94]"
                  title={`Amount over £30,000 (taxed): ${formatCurrency(result.taxableTermination)}`}
                />
              )}
              {pilonPct > 0 && (
                <div
                  style={{ width: `${pilonPct}%` }}
                  className="bg-[#D9603B]"
                  title={`Notice pay: ${formatCurrency(result.pilon)}`}
                />
              )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px] text-[#5B6577]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0B1F3A] inline-block" />
                Tax-free: <strong className="text-[#0B1F3A]">{formatCurrency(result.taxFreeAmount)}</strong>
              </span>
              {result.taxableTermination > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#E0CB94] inline-block" />
                  Over £30k (taxed): <strong className="text-[#0B1F3A]">{formatCurrency(result.taxableTermination)}</strong>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#D9603B] inline-block" />
                Notice pay: <strong className="text-[#0B1F3A]">{formatCurrency(result.pilon)}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Collapsible Method & Legislation Drawer */}
        <div className="border-t border-[#EFEAE0] no-print">
          <button
            type="button"
            onClick={() => setDetailsOpen((o) => !o)}
            className="w-full px-5 sm:px-6 py-3.5 text-left flex items-center justify-between text-[14px] font-medium text-[#5B6577] hover:text-[#0B1F3A] bg-[#FAF8F5] border-0 cursor-pointer"
          >
            <span>How this is calculated &amp; UK tax rules</span>
            <span style={{ transform: detailsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms' }}>▾</span>
          </button>

          {detailsOpen && (
            <div className="px-5 sm:px-6 py-4 bg-[#FAF8F5] border-t border-[#EFEAE0] text-[14px] text-[#5B6577] leading-[1.65] space-y-2.5">
              <p className="m-0">
                <strong>Method:</strong> The legal minimum combines statutory notice pay (ERA 1996 s.86) and statutory redundancy pay (s.162, subject to s.141 eligibility). Typical ranges add an illustrative negotiation allowance based on UK settlement practice. Actual outcomes depend on your contract and facts.
              </p>
              <p className="m-0">
                <strong>Tax treatment:</strong> The first £30,000 of genuine termination payments is exempt under{' '}
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
                <strong>2026/27 statutory caps:</strong>{' '}
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
      </div>
    </section>
  )
}

/* ── Compact 3-Step "What Happens Next" Strip ───────────────────── */

function WhatHappensNextStrip() {
  const steps = [
    {
      num: '1',
      title: '1 solicitor match',
      desc: 'Your figures go to one SRA-regulated employment solicitor.',
    },
    {
      num: '2',
      title: 'Plain-English check',
      desc: 'They check your pay, tax-free split, reference, and job restrictions.',
    },
    {
      num: '3',
      title: 'Sign off or negotiate',
      desc: 'Most reviews finish in 24 to 48 hours once you are happy.',
    },
  ]

  return (
    <section
      aria-label="What happens next"
      className="bg-white border border-[#E2DCCE] rounded-2xl p-5 no-print"
    >
      <h2 className="font-serif text-[20px] font-bold text-[#0B1F3A] m-0 mb-3.5">
        What happens next
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {steps.map((s) => (
          <div key={s.num} className="flex items-start gap-2.5 sm:block">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#0B1F3A] text-white text-[13px] font-mono font-bold shrink-0 sm:mb-2">
              {s.num}
            </span>
            <div>
              <div className="text-[15.5px] font-bold text-[#0B1F3A] mb-1">{s.title}</div>
              <p className="text-[14.5px] text-[#5B6577] leading-[1.55] m-0">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Smart Mobile Sticky Bar (Hides when Intake Card is visible) ── */

function SmartMobileStickyBar({
  onScrollToIntake,
  ctaLabel,
}: {
  onScrollToIntake: () => void
  ctaLabel: string
}) {
  const [show, setShow] = useState(false)
  const [overFooter, setOverFooter] = useState(false)
  const [keyboardOpen, setKeyboardOpen] = useState(false)

  useEffect(() => {
    const target = document.getElementById('solicitor-intake-card')
    if (!target || typeof IntersectionObserver === 'undefined') return

    let cardVisible = true
    const observer = new IntersectionObserver(
      (entries) => {
        cardVisible = !!entries[0]?.isIntersecting
        setShow(!cardVisible && window.scrollY > 120)
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
      setShow(!cardVisible && window.scrollY > 120)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const vv = window.visualViewport
    const onVpResize = () => {
      if (!vv) return
      setKeyboardOpen(window.innerHeight - vv.height > 150)
    }
    vv?.addEventListener('resize', onVpResize)

    return () => {
      observer.disconnect()
      footerObserver?.disconnect()
      window.removeEventListener('scroll', onScroll)
      vv?.removeEventListener('resize', onVpResize)
    }
  }, [])

  if (!show || keyboardOpen) return null

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
      <div className="flex items-center justify-between gap-2.5 max-w-lg mx-auto">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-[#0B1F3A] leading-snug m-0 truncate">
            Private Solicitor Review
          </p>
          <p className="text-[11px] text-[#5B6577] leading-tight m-0 mt-0.5 truncate">
            Employer pays fee contribution · 100% confidential
          </p>
        </div>
        <button
          type="button"
          onClick={onScrollToIntake}
          className="inline-flex items-center justify-center px-3.5 py-2.5 text-[13px] font-bold text-white bg-[#D9603B] hover:bg-[#B14A28] rounded-lg border-0 cursor-pointer flex-shrink-0 whitespace-nowrap shadow-sm"
        >
          {ctaLabel}
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
  const initialEmail = searchParams.get('email') ?? ''
  const focusIntake = searchParams.get('focus') === 'intake'

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

  useEffect(() => {
    if (!result) return
    if (focusIntake || window.location.hash === '#solicitor-intake-card') {
      const el = document.getElementById('solicitor-intake-card')
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          const firstNameInput = document.getElementById('sc-first-name') as HTMLInputElement | null
          firstNameInput?.focus({ preventScroll: true })
        }, 120)
      }
    }
  }, [result, focusIntake])

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
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setTimeout(() => {
        el.querySelector<HTMLInputElement>('input:not([type="hidden"])')?.focus({ preventScroll: true })
      }, 350)
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
              onUpdate={setInputs}
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
               - Mobile: Unified Estimate -> Solicitor Intake & Email -> What Happens Next -> Compliance Footer
               - Desktop (lg): Left 7 cols (Unified Estimate, What Happens Next, Compliance Footer) | Right 5 cols Sticky (Solicitor Intake & Email) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
              {/* 1. Unified Estimate Report (Top-Left on Desktop, 1st on Mobile) */}
              <div className="lg:col-span-7 lg:col-start-1">
                <EstimateReportCard
                  result={result}
                  offer={offer}
                  yearsNum={Math.floor(yearsNum)}
                  onJumpToIntake={handleScrollToIntake}
                />
              </div>

              {/* 2. Primary Solicitor Intake + Subordinate Email Action (Sticky Top-Right on Desktop, 2nd on Mobile) */}
              <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-3 lg:sticky lg:top-[96px] no-print">
                <InlineSolicitorIntakeCard
                  verdict={result.verdict}
                  offer={offer}
                  salary={salary}
                  years={yearsNum}
                  disputeReason={reason}
                  disputeReasonLabel={REASON_LABELS[reason] ?? ''}
                  sourceUrl="/results/"
                  initialEmail={initialEmail}
                  hideEmailCapture={focusIntake && !!initialEmail}
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

              {/* 3. What Happens Next (Left on Desktop, 3rd on Mobile) */}
              <div className="lg:col-span-7 lg:col-start-1">
                <WhatHappensNextStrip />
              </div>

              {/* 4. Quiet Compliance Disclosure */}
              <div className="lg:col-span-7 lg:col-start-1 pt-1 text-[13px] text-[#6B7485] leading-[1.55] no-print">
                <p className="m-0">
                  Estimates use 2026/27 UK statutory rates (£{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI weekly cap) as a general guide, not legal or tax advice. Employer legal fee contributions (£350 to £500+ +VAT) are standard practice paid on completion, not a statutory requirement.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <SmartMobileStickyBar
        onScrollToIntake={handleScrollToIntake}
        ctaLabel={
          offer <= 0
            ? 'Check my position →'
            : result?.verdict === 'BELOW_MINIMUM'
            ? 'Check this gap →'
            : result?.verdict === 'BELOW_TYPICAL'
            ? 'Check my options →'
            : 'Check & sign off →'
        }
      />
      <Footer />
    </>
  )
}

export default function ResultsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper-2 flex items-center justify-center">
          <p className="text-[#5B6577] text-[15px]">Calculating your estimate</p>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  )
}
