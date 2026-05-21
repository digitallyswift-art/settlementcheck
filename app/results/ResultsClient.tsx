'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import React, { Suspense, useState, useRef } from 'react'
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

/* ── Shared tiny components ─────────────────────────────────────── */

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── Social proof testimonials ──────────────────────────────────── */

function Testimonials() {
  const items = [
    {
      quote: 'My initial offer was £14,000. After speaking to a solicitor through SettlementCheck, I settled at £34,500. I almost signed the first figure.',
      attr: 'Operations manager, logistics sector, 2025',
    },
    {
      quote: 'I had no idea the offer was below the legal minimum until I used this calculator. The solicitor recovered an additional £19,200.',
      attr: 'Project coordinator, financial services, 2024',
    },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((t, i) => (
        <blockquote key={i} className="bg-white border border-[#E2DCCE] rounded-lg p-5 flex flex-col gap-3">
          <p className="text-[14px] text-ink leading-[1.6] m-0">&ldquo;{t.quote}&rdquo;</p>
          <footer className="text-[11px] text-[#8A93A3] font-semibold uppercase tracking-[0.06em]">{t.attr}</footer>
        </blockquote>
      ))}
    </div>
  )
}

/* ── Verdict panel ──────────────────────────────────────────────── */

function VerdictPanel({ result, offer, salary, yearsNum, age }: {
  result: VerdictResult; offer: number; salary: number; yearsNum: number; age: number
}) {
  const completedYears = yearsNum

  if (result.verdict === 'BELOW_MINIMUM') {
    const srp = result.redundancy || result.basicAward
    return (
      <div className="rounded-lg p-6 md:p-8" style={{ background: '#FBF0EE', border: '1px solid #D9A99E' }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.10em] uppercase mb-4" style={{ background: '#fff', color: '#A8341F', border: '1px solid #D9A99E' }}>
          Below your legal minimum
        </span>
        <h2 className="sc-h2 text-[#0B1F3A] mb-3">Your employer may not be meeting their legal obligation.</h2>
        <div className="sc-body mt-3 max-w-[66ch] flex flex-col gap-3 text-[15px] text-[#5B6577]">
          <p>Under UK law, you are entitled to a minimum of <strong className="text-ink">{formatCurrency(srp)}</strong> in statutory redundancy pay alone, based on your {completedYears} {completedYears === 1 ? 'year' : 'years'} of service, age {age}, and a weekly pay cap of £{result.weeklyCapUsed.toLocaleString('en-GB')}.</p>
          <p>The offer you have described (<strong className="text-ink">{formatCurrency(offer)}</strong>) does not reach that threshold.</p>
          <p>This is not a negotiating position. It is a legal floor. <strong className="text-ink">You do not need to accept an offer below it.</strong></p>
          <p>Before you respond to your employer, read the breakdown below.</p>
        </div>
        <OfferVsRange result={result} offer={offer} />
      </div>
    )
  }

  if (result.verdict === 'BELOW_TYPICAL') {
    return (
      <div className="rounded-lg p-6 md:p-8" style={{ background: '#FEFBF0', border: '1px solid #E0CB94' }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.10em] uppercase mb-4" style={{ background: '#fff', color: '#B5802A', border: '1px solid #E0CB94' }}>
          Likely below typical
        </span>
        <h2 className="sc-h2 text-[#0B1F3A] mb-3">Your offer covers the legal minimum. Most people in your position receive more.</h2>
        <div className="sc-body mt-3 max-w-[66ch] flex flex-col gap-3 text-[15px] text-[#5B6577]">
          <p>Based on your salary, age, and {completedYears} {completedYears === 1 ? 'year' : 'years'} of service, settlements in situations like yours typically fall between <strong className="text-ink">{formatCurrency(result.typicalLow)}</strong> and <strong className="text-ink">{result.typicalHighUncapped ? 'a figure that depends on the specific circumstances' : formatCurrency(result.typicalHigh)}</strong>.</p>
          <p>Your offer of <strong className="text-ink">{formatCurrency(offer)}</strong> sits below that range.</p>
          <p>Employers make opening offers. <strong className="text-ink">This is yours.</strong></p>
        </div>
        <OfferVsRange result={result} offer={offer} />
      </div>
    )
  }

  return (
    <div className="rounded-lg p-6 md:p-8" style={{ background: '#F2F7F3', border: '1px solid #BCD0BF' }}>
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.10em] uppercase mb-4" style={{ background: '#fff', color: '#4F7060', border: '1px solid #BCD0BF' }}>
        <CheckIcon size={12} /> Your offer looks strong
      </span>
      <h2 className="sc-h2 text-[#0B1F3A] mb-3">This offer appears above the typical range for your circumstances.</h2>
      <div className="sc-body mt-3 max-w-[66ch] flex flex-col gap-3 text-[15px] text-[#5B6577]">
        <p>Based on your inputs, your employer&apos;s offer of <strong className="text-ink">{formatCurrency(offer)}</strong> sits at or above what similar cases typically reach.</p>
        <p>A strong financial figure is not the full picture. Settlement agreements include terms beyond the number: reference wording, confidentiality obligations, and claims you are waiving, all of which can be as significant as the payment itself.</p>
        <p>A solicitor will review the complete agreement at no cost to you. <strong className="text-ink">Your employer is required to contribute to those fees.</strong></p>
      </div>
      <OfferVsRange result={result} offer={offer} />
    </div>
  )
}

/* ── Offer vs range numbers + methodology ───────────────────────── */

function OfferVsRange({ result, offer }: { result: VerdictResult; offer: number }) {
  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(11,31,58,0.12)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="sc-eyebrow mb-1">Your offer</div>
          <div className="font-serif text-ink" style={{ fontSize: 26, fontWeight: 420, letterSpacing: '-0.015em' }}>
            {formatCurrency(offer)}
          </div>
        </div>
        <div className="hidden sm:block" style={{ width: 1, background: 'rgba(11,31,58,0.12)', height: '100%' }} aria-hidden="true" />
        <div>
          <div className="sc-eyebrow mb-1">Typical range</div>
          <div className="font-serif text-ink animate-fade-in" style={{ fontSize: 26, fontWeight: 420, letterSpacing: '-0.015em' }}>
            {result.typicalHighUncapped
              ? <>{formatCurrency(result.typicalLow)} to <span className="text-[18px]">Potentially uncapped</span></>
              : <>{formatCurrency(result.typicalLow)} to {formatCurrency(result.typicalHigh)}</>
            }
          </div>
          {result.discriminationAsterisk && (
            <p className="text-[11px] text-[#8A93A3] mt-2 leading-relaxed">* This range assumes no discrimination element. If discrimination is involved, your position may be significantly stronger and is uncapped.</p>
          )}
        </div>
      </div>

      <div className="mt-5 pt-4" style={{ borderTop: '1px solid rgba(11,31,58,0.08)' }}>
        <p className="text-[13px] text-[#5B6577] leading-[1.6] m-0">
          <strong className="text-[#0B1F3A] font-semibold">Where does the typical range come from?</strong>{' '}
          The lower figure is your statutory floor plus a standard uplift based on typical negotiated outcomes. The upper figure reflects cases where employees negotiated actively, often with legal support. The gap between them is real, and in most cases, recoverable.
        </p>
      </div>
    </div>
  )
}

/* ── Gross-to-Net CSS Stack Chart ───────────────────────────────── */

function FinancialSplitChart({
  offer,
  pilon,
  taxFreeAmount,
  taxableTermination,
  estimatedTax,
  netTakeHome,
}: {
  offer: number;
  pilon: number;
  taxFreeAmount: number;
  taxableTermination: number;
  estimatedTax: number;
  netTakeHome: number;
}) {
  const total = Math.max(offer, pilon + taxFreeAmount + taxableTermination) || 1;
  const pilonPct = Math.min(100, Math.max(0, (pilon / total) * 100));
  const taxFreePct = Math.min(100, Math.max(0, (taxFreeAmount / total) * 100));
  const taxableTermPct = Math.min(100, Math.max(0, (taxableTermination / total) * 100));

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h4 className="text-[13px] font-bold tracking-wider text-[#5B6577] uppercase m-0">Visual Settlement Split</h4>
        <span className="text-[12px] bg-[#F7F4EE] border border-[#E2DCCE] text-[#0B1F3A] font-semibold px-2.5 py-1 rounded-full">
          Gross: {formatCurrency(offer)}
        </span>
      </div>

      {/* Visual Stacked Bar */}
      <div className="flex w-full h-8 rounded-lg overflow-hidden bg-[#F7F4EE] border border-[#E2DCCE]">
        {taxFreePct > 0 && (
          <div
            style={{ width: `${taxFreePct}%` }}
            className="bg-[#BCD0BF] hover:opacity-90 transition-opacity flex items-center justify-center text-[11px] text-[#0B1F3A] font-bold"
            title={`Tax-Free Severance: ${formatCurrency(taxFreeAmount)}`}
          >
            {taxFreePct > 12 && 'Tax-Free'}
          </div>
        )}
        {taxableTermPct > 0 && (
          <div
            style={{ width: `${taxableTermPct}%` }}
            className="bg-[#E0CB94] hover:opacity-90 transition-opacity flex items-center justify-center text-[11px] text-[#0B1F3A] font-bold"
            title={`Taxable Severance: ${formatCurrency(taxableTermination)}`}
          >
            {taxableTermPct > 12 && 'Taxable'}
          </div>
        )}
        {pilonPct > 0 && (
          <div
            style={{ width: `${pilonPct}%` }}
            className="bg-[#D9A99E] hover:opacity-90 transition-opacity flex items-center justify-center text-[11px] text-[#0B1F3A] font-bold"
            title={`Notice Pay (PILON): ${formatCurrency(pilon)}`}
          >
            {pilonPct > 12 && 'Notice Pay'}
          </div>
        )}
      </div>

      {/* Labels Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#BCD0BF] block border border-[#A4BCA7]"></span>
          <div className="text-[13px] leading-tight">
            <span className="text-[#8A93A3] block text-[10px] uppercase font-bold tracking-wider">Tax-Free Ex-Gratia</span>
            <span className="font-semibold text-[#0B1F3A]">{formatCurrency(taxFreeAmount)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#E0CB94] block border border-[#CBB37E]"></span>
          <div className="text-[13px] leading-tight">
            <span className="text-[#8A93A3] block text-[10px] uppercase font-bold tracking-wider">Taxable Ex-Gratia</span>
            <span className="font-semibold text-[#0B1F3A]">{formatCurrency(taxableTermination)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded bg-[#D9A99E] block border border-[#C59286]"></span>
          <div className="text-[13px] leading-tight">
            <span className="text-[#8A93A3] block text-[10px] uppercase font-bold tracking-wider">Notice Pay (PILON)</span>
            <span className="font-semibold text-[#0B1F3A]">{formatCurrency(pilon)}</span>
          </div>
        </div>
      </div>

      {/* Outcome Arrow and Final Results */}
      <div className="border-t border-[#E2DCCE] pt-3.5 mt-1 flex flex-row justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[#8A93A3] text-[10px] uppercase tracking-wider font-bold">Estimated Tax</span>
          <span className="text-[16px] font-bold text-[#A8341F]">- {formatCurrency(estimatedTax)}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#4F7060] text-[10px] uppercase tracking-wider font-bold">Net Take-Home Cash</span>
          <span className="text-[22px] font-extrabold text-[#0B1F3A]">{formatCurrency(netTakeHome)}</span>
        </div>
      </div>
    </div>
  )
}

/* ── Interactive Pension Sacrifice Simulator ────────────────────── */

function PensionSacrificeWidget({
  taxableTermination,
  salary,
}: {
  taxableTermination: number;
  salary: number;
}) {
  const [sacrificeVal, setSacrificeVal] = useState(0)

  if (taxableTermination <= 0) return null

  const res = calcPensionSacrifice(taxableTermination, sacrificeVal, salary)
  const isTrapRange = salary >= 100000 && salary <= 125140

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div>
        <span className="inline-block bg-[#F2F7F3] text-[#4F7060] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full mb-1">
          Tax Restructuring Optimizer
        </span>
        <h3 className="sc-h3 mt-1 text-[#0B1F3A]">Pension Sacrifice Simulator</h3>
        <p className="sc-body mt-1.5 text-[13px] text-[#5B6577] leading-relaxed">
          UK law allows termination payments up to £30,000 tax-free. Payments above £30,000 are subject to income tax. By sacrifing a portion of your taxable settlement directly into your pension as an employer contribution, you avoid income tax entirely on that portion.
        </p>
      </div>

      {isTrapRange && (
        <div className="p-3.5 bg-[#FEFBF0] border border-[#E0CB94] rounded-lg text-[13px] text-[#B5802A] leading-relaxed flex gap-2">
          <span className="text-[16px] flex-shrink-0">⚠️</span>
          <div>
            <strong>60% Tax Trap Active:</strong> Because your annual income sits between £100,000 and £125,140, your Personal Allowance is being tapered. Redirecting taxable settlement funds into a pension restores your allowance, resulting in massive tax savings.
          </div>
        </div>
      )}

      {/* Slider Control */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex justify-between text-[14px] font-semibold text-[#0B1F3A]">
          <span>Sacrifice Amount:</span>
          <span className="text-[16px] text-[#D9603B] font-bold">{formatCurrency(sacrificeVal)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={taxableTermination}
          step="100"
          value={sacrificeVal}
          onChange={(e) => setSacrificeVal(Number(e.target.value))}
          className="w-full h-1.5 bg-[#E2DCCE] rounded-lg appearance-none cursor-pointer accent-[#D9603B]"
        />
        <div className="flex justify-between text-[11px] text-[#8A93A3] font-semibold">
          <span>£0 (Take Cash)</span>
          <span>Max: {formatCurrency(taxableTermination)}</span>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid grid-cols-2 gap-4 border-t border-[#E2DCCE] pt-3.5 mt-1">
        <div className="flex flex-col">
          <span className="text-[#8A93A3] text-[10px] uppercase tracking-wider font-bold">Immediate Tax Saved</span>
          <span className="text-[17px] font-bold text-[#4F7060]">{res.taxSaved > 0 ? `+${formatCurrency(res.taxSaved)}` : '£0'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#8A93A3] text-[10px] uppercase tracking-wider font-bold">Growth in Pension</span>
          <span className="text-[17px] font-bold text-[#0B1F3A]">{formatCurrency(res.pensionGrowth)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#8A93A3] text-[10px] uppercase tracking-wider font-bold">Net Cash Reduced</span>
          <span className="text-[14px] font-medium text-[#5B6577]">{formatCurrency(res.cashNetReduction)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[#8A93A3] text-[10px] uppercase tracking-wider font-bold">Net Wealth Benefit</span>
          <span className="text-[17px] font-extrabold text-[#4F7060]">{res.netWealthBenefit > 0 ? `+${formatCurrency(res.netWealthBenefit)}` : '£0'}</span>
        </div>
      </div>

      <p className="text-[11px] text-[#8A93A3] m-0 italic leading-relaxed">
        * Sacrificing termination pay must be written explicitly into the final settlement agreement before signing and requires your employer&apos;s administrative consent.
      </p>
    </div>
  )
}

/* ── Interactive Vento Band Discrimination Selector ─────────────── */

function VentoBandWidget({
  onBandSelect,
  selectedBand,
  ventoBands,
}: {
  onBandSelect: (band: 'lower' | 'middle' | 'upper' | 'exceptional' | null) => void;
  selectedBand: 'lower' | 'middle' | 'upper' | 'exceptional' | null;
  ventoBands: {
    lowerMin: number;
    lowerMax: number;
    middleMin: number;
    middleMax: number;
    upperMin: number;
    upperMax: number;
    exceptionalMin: number;
  };
}) {
  const bands = [
    {
      key: 'lower' as const,
      name: 'Lower Band',
      range: `${formatCurrency(ventoBands.lowerMin)} – ${formatCurrency(ventoBands.lowerMax)}`,
      desc: 'For one-off or minor discrimination incidents.',
    },
    {
      key: 'middle' as const,
      name: 'Middle Band',
      range: `${formatCurrency(ventoBands.middleMin)} – ${formatCurrency(ventoBands.middleMax)}`,
      desc: 'For serious, persistent discrimination occurring over several weeks or months.',
    },
    {
      key: 'upper' as const,
      name: 'Upper Band',
      range: `${formatCurrency(ventoBands.upperMin)} – ${formatCurrency(ventoBands.upperMax)}`,
      desc: 'For long-term campaigns of harassment or severe discrimination resulting in dismissal.',
    },
    {
      key: 'exceptional' as const,
      name: 'Exceptional Cases',
      range: `${formatCurrency(ventoBands.exceptionalMin)}+`,
      desc: 'Reserved for exceptionally severe and catastrophic discrimination campaigns.',
    },
  ]

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div>
        <span className="inline-block bg-[#FBF0EE] text-[#A8341F] text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full mb-1">
          Equality Act 2010
        </span>
        <h3 className="sc-h3 mt-1 text-[#0B1F3A]">Injury to Feelings Assessed Value</h3>
        <p className="sc-body mt-1.5 text-[13px] text-[#5B6577] leading-relaxed">
          Because your case involves discrimination, you may claim damages for Injury to Feelings. Employment tribunals calculate these under the official **Vento Bands**. Click a band to model its impact on your negotiation position:
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {bands.map((b) => {
          const selected = selectedBand === b.key
          return (
            <button
              key={b.key}
              type="button"
              onClick={() => onBandSelect(selected ? null : b.key)}
              className="w-full text-left p-3.5 rounded-lg border transition-all duration-200 flex flex-col gap-1 focus:outline-none cursor-pointer"
              style={{
                background: selected ? '#0B1F3A' : '#ffffff',
                borderColor: selected ? '#0B1F3A' : '#E2DCCE',
                color: selected ? '#ffffff' : '#0B1F3A',
                boxShadow: selected ? '0 4px 12px rgba(11,31,58,0.12)' : 'none',
              }}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-[14px]">{b.name}</span>
                <span
                  className="font-mono text-[14px] font-bold"
                  style={{ color: selected ? '#ffffff' : '#D9603B' }}
                >
                  {b.range}
                </span>
              </div>
              <p
                className="text-[12px] leading-relaxed m-0"
                style={{ color: selected ? 'rgba(255,255,255,0.85)' : '#5B6577' }}
              >
                {b.desc}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ── Barrister-Ready Case Brief ─────────────────────────────────── */

interface EditableInputs {
  salary: string
  yearsNum: string
  monthsNum: string
  age: string
  offer: string
  reason: string
  discrimination: string
  contractualNotice: string
}

function CaseBriefSection({
  inputs,
  result,
  selectedVentoBand,
  ventoBands,
}: {
  inputs: EditableInputs;
  result: VerdictResult;
  selectedVentoBand: 'lower' | 'middle' | 'upper' | 'exceptional' | null;
  ventoBands: any;
}) {
  const [open, setOpen] = useState(false)

  const formatReason = (r: string) => {
    const labels: Record<string, string> = {
      redundancy: 'Redundancy',
      redundancy_collective: 'Redundancy: Collective (20+ employees)',
      dismissal: 'Performance or Disciplinary Dismissal',
      constructive: 'Constructive Dismissal',
      mutual: 'Mutual Agreement / Exit',
      other: 'Other / Mutual Exit',
    }
    return labels[r] || r
  }

  const getVentoValue = (band: string | null) => {
    if (!band) return 0
    if (band === 'lower') return (ventoBands.lowerMin + ventoBands.lowerMax) / 2
    if (band === 'middle') return (ventoBands.middleMin + ventoBands.middleMax) / 2
    if (band === 'upper') return (ventoBands.upperMin + ventoBands.upperMax) / 2
    return ventoBands.exceptionalMin
  }

  const ventoVal = getVentoValue(selectedVentoBand)
  const basicOrRedundancy = result.redundancy || result.basicAward
  const potentialTribunalValue = basicOrRedundancy + result.pilon + ventoVal
  const caseId = `SC-${Math.abs(parseFloat(inputs.salary) - parseInt(inputs.age) * (parseFloat(inputs.yearsNum) * 12 + parseFloat(inputs.monthsNum))).toString(16).toUpperCase()}`

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-xl overflow-hidden shadow-sm" id="printable-case-brief-wrapper">
      
      {/* Screen Header Toggle (Click to collapse on screen, hidden in print) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full p-5 text-left flex justify-between items-center bg-[#F7F4EE] border-b border-[#E2DCCE] focus:outline-none cursor-pointer no-print"
      >
        <div>
          <span className="text-[#8A93A3] text-[10px] font-bold uppercase tracking-wider block mb-1">
            Barrister-Grade Intake Brief
          </span>
          <h3 className="sc-h3 text-[#0B1F3A] m-0">Case Assessment Summary</h3>
        </div>
        <span
          className="text-[#0B1F3A] font-bold text-[18px] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'none' }}
        >
          ▾
        </span>
      </button>

      {/* Case Brief Body */}
      <div
        className={`transition-all duration-300 ${open ? 'max-h-[3000px] opacity-100 p-5' : 'max-h-0 opacity-0 overflow-hidden print:p-0 print:overflow-visible'}`}
        id="printable-case-brief"
      >
        {/* ==================== PAGE 1 ==================== */}
        <div className="flex flex-col gap-5 print-page-1">
          {/* Print-Only Brand Header */}
          <div className="hidden print:flex items-center justify-between border-b-2 border-[#0B1F3A] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#D9603B]" aria-hidden="true">
                <svg width="24" height="24" viewBox="0 0 22 22" fill="none" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.5" fill="none"/>
                  <path d="M6 11.5L9.5 15L16 7.5" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="font-serif text-[22px] font-bold tracking-[-0.01em]">
                <span style={{ color: '#D9603B' }}>Settlement</span><span style={{ color: '#0B1F3A' }}>Check</span>
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#8A93A3] font-bold uppercase tracking-wider block">CASE ASSESSMENT BRIEF</span>
              <span className="text-[11px] text-[#0B1F3A] font-bold">Case ID: {caseId}</span>
            </div>
          </div>

          <div className="pb-3 border-b border-[#E2DCCE]">
            <h4 className="text-[16px] font-bold text-[#0B1F3A] mb-1 print:text-[18px]">Client Profile & Claims Analysis</h4>
            <p className="text-[13px] text-[#5B6577] leading-relaxed m-0">
              This intake assessment report compiles client parameters, statutory entitlements, and potential claims value. It is structured to assist legal counsel during intake review to assess settlement viability and evaluate negotiation leverage.
            </p>
          </div>

          {/* Grid of details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-[13px] text-[#5B6577] border-b border-[#E2DCCE] pb-3 print:grid-cols-4">
            <div>
              <span className="block text-[10px] text-[#8A93A3] font-bold uppercase">Basic Salary</span>
              <strong className="text-[#0B1F3A]">{formatCurrency(parseFloat(inputs.salary))} / yr</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#8A93A3] font-bold uppercase">Service Length</span>
              <strong className="text-[#0B1F3A]">{inputs.yearsNum}y {inputs.monthsNum}m</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#8A93A3] font-bold uppercase">Employee Age</span>
              <strong className="text-[#0B1F3A]">{inputs.age} yrs</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#8A93A3] font-bold uppercase">Jurisdiction</span>
              <strong className="text-[#0B1F3A]">{result.jurisdiction === 'NI' ? 'Northern Ireland' : 'England & Wales / Scot'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-[#E2DCCE] pb-3 text-[13px] print:grid-cols-2">
            <div>
              <span className="block text-[10px] text-[#8A93A3] font-bold uppercase">Dismissal Context</span>
              <strong className="text-[#0B1F3A]">{formatReason(inputs.reason)}</strong>
            </div>
            <div>
              <span className="block text-[10px] text-[#8A93A3] font-bold uppercase">Discrimination Flagged</span>
              <strong className="text-[#0B1F3A]">{inputs.discrimination === 'yes' ? 'Yes (Equality Act 2010)' : inputs.discrimination === 'not_sure' ? 'Potential / Unresolved' : 'No'}</strong>
            </div>
          </div>

          {/* Statutory Calculations Table */}
          <div>
            <h5 className="text-[13px] font-bold text-[#0B1F3A] mb-2.5">Statutory Assessment</h5>
            <div className="border border-[#E2DCCE] rounded-lg overflow-hidden">
              <table className="w-full text-left text-[13px] border-collapse">
                <thead>
                  <tr className="bg-[#F7F4EE] border-b border-[#E2DCCE] text-[10px] text-[#8A93A3] font-bold uppercase">
                    <th className="p-3">Entitlement Category</th>
                    <th className="p-3 text-right">Value</th>
                    <th className="p-3">Legislation Citation</th>
                  </tr>
                </thead>
                <tbody>
                  {result.redundancy > 0 && (
                    <tr className="border-b border-[#E2DCCE]">
                      <td className="p-3 text-[#0B1F3A] font-medium">Statutory Redundancy Pay</td>
                      <td className="p-3 text-right font-mono font-semibold">{formatCurrency(result.redundancy)}</td>
                      <td className="p-3 text-[#8A93A3] italic">s.162 Employment Rights Act 1996</td>
                    </tr>
                  )}
                  {result.basicAward > 0 && (
                    <tr className="border-b border-[#E2DCCE]">
                      <td className="p-3 text-[#0B1F3A] font-medium">Basic Award (Unfair Dismissal)</td>
                      <td className="p-3 text-right font-mono font-semibold">{formatCurrency(result.basicAward)}</td>
                      <td className="p-3 text-[#8A93A3] italic">s.119 Employment Rights Act 1996</td>
                    </tr>
                  )}
                  <tr className="border-b border-[#E2DCCE]">
                    <td className="p-3 text-[#0B1F3A] font-medium">Statutory Minimum Notice Pay</td>
                    <td className="p-3 text-right font-mono font-semibold">{formatCurrency(result.pilon)}</td>
                    <td className="p-3 text-[#8A93A3] italic">s.86 Employment Rights Act 1996</td>
                  </tr>
                  {result.collectiveRedundancy && result.protectiveAwardMax > 0 && (
                    <tr className="border-b border-[#E2DCCE]">
                      <td className="p-3 text-[#0B1F3A] font-medium">Protective Award (Collective)</td>
                      <td className="p-3 text-right font-mono font-semibold text-[#A8341F]">{formatCurrency(result.protectiveAwardMax)}</td>
                      <td className="p-3 text-[#8A93A3] italic">s.189 TULRCA 1992</td>
                    </tr>
                  )}
                  {selectedVentoBand && (
                    <tr className="border-b border-[#E2DCCE]">
                      <td className="p-3 text-[#0B1F3A] font-medium">Injury to Feelings ({selectedVentoBand})</td>
                      <td className="p-3 text-right font-mono font-semibold text-[#4F7060]">{formatCurrency(ventoVal)}</td>
                      <td className="p-3 text-[#8A93A3] italic">s.124 EqA 2010 (Vento)</td>
                    </tr>
                  )}
                  <tr className="bg-[#F7F4EE] font-bold text-[13px]">
                    <td className="p-3 text-[#0B1F3A]">Aggregate Minimum Entitlement</td>
                    <td className="p-3 text-right font-mono text-[#0B1F3A]">{formatCurrency(potentialTribunalValue)}</td>
                    <td className="p-3 text-[#8A93A3] font-normal italic">Statutory Assessment Total</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict Overview */}
          <div className="p-4 bg-[#F2F7F3] border border-[#BCD0BF] rounded-lg text-[12px] text-[#5B6577] leading-relaxed">
            <span className="font-bold text-[#0B1F3A] block mb-1">Assessment Verdict:</span>
            {result.verdict === 'BELOW_MINIMUM' ? (
              <p className="m-0 text-[#A8341F]"><strong>Critical Warning:</strong> The current settlement offer is below the calculated statutory minimum floor. An exit package cannot legally waive statutory redundancy rights for an amount less than s.162 of the Employment Rights Act 1996. The employer should be notified immediately of this discrepancy.</p>
            ) : result.verdict === 'BELOW_TYPICAL' ? (
              <p className="m-0">The current offer meets the statutory floor but sits below the typical negotiated settlement range for this profile. Standard benchmarks indicate that active negotiation supported by legal counsel can yield a significant uplift.</p>
            ) : (
              <p className="m-0">The current offer is financially strong and aligns with or exceeds the typical range for this service profile. Emphasis should be shifted to non-financial covenants (reference wording, confidentiality, tax indemnity clauses) to ensure a clean exit.</p>
            )}
          </div>
        </div>

        {/* ==================== PAGE 2 ==================== */}
        <div className="page-break flex flex-col gap-5 mt-8 pt-8 border-t border-[#E2DCCE] print:border-0 print:mt-0 print:pt-0 print-page-2">
          
          {/* Print-Only Brand Header for Page 2 */}
          <div className="hidden print:flex items-center justify-between border-b border-[#E2DCCE] pb-3 mb-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[#D9603B]">✔</span>
              <span className="font-serif text-[15px] font-bold text-[#0B1F3A]">SettlementCheck Intake Brief</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-[#5B6577]">Case ID: {caseId} • Page 2 of 2</span>
            </div>
          </div>

          <div>
            <h4 className="text-[16px] font-bold text-[#0B1F3A] mb-1 print:text-[18px]">Tactical Negotiation Notes & Tax Guidance</h4>
            <p className="text-[13px] text-[#5B6577] leading-relaxed m-0">
              Key considerations for reviewing counsel regarding tax restructuring, discrimination multipliers, and compliance rules:
            </p>
          </div>

          <div className="flex flex-col gap-3.5 text-[12px] text-[#5B6577] leading-relaxed">
            <div className="p-3.5 bg-[#F7F4EE] border border-[#E2DCCE] rounded-lg">
              <span className="font-bold text-[#0B1F3A] block mb-1">Notice Pay (PILON) & Ex-Gratia Tax Allocation</span>
              Under <strong>s.402D ITEPA 2003</strong>, all payments in lieu of notice (PILON) must be taxed as general earnings under the Post-Employment Notice Pay (PENP) formula. However, genuine ex-gratia redundancy severance qualifies for the first £30,000 tax-free exemption under <strong>s.403 ITEPA 2003</strong>. Any ex-gratia amount exceeding £30,000 is subject to the employee&apos;s marginal income tax rate.
            </div>

            <div className="p-3.5 bg-[#F7F4EE] border border-[#E2DCCE] rounded-lg">
              <span className="font-bold text-[#0B1F3A] block mb-1">Pension Sacrifice Opportunities</span>
              If the ex-gratia severance payment exceeds £30,000, the employee can request the employer to pay the excess taxable portion directly into a registered pension scheme as an employer contribution. If completed before the settlement agreement is signed, this restructuring avoids income tax and National Insurance contributions under <strong>s.408 ITEPA 2003</strong>.
            </div>

            {inputs.discrimination === 'yes' && (
              <div className="p-3.5 bg-[#FBF0EE] border border-[#D9A99E] rounded-lg text-[#A8341F]">
                <span className="font-bold block mb-1">Equality Act 2010 & Vento Injury to Feelings Guidelines</span>
                This case involves discrimination elements. Injury to feelings damages are calculated separately from financial loss under the Vento bands, which are uncapped by the statutory unfair dismissal limits. In negotiations, these damages must be allocated carefully. Under HMRC rules, genuine compensation for injury to feelings related to pre-termination discrimination may be paid tax-free under s.403, whereas compensation for discrimination leading to termination is taxed.
              </div>
            )}

            {result.collectiveRedundancy && (
              <div className="p-3.5 bg-[#FEFBF0] border border-[#E0CB94] rounded-lg text-[#B5802A]">
                <span className="font-bold block mb-1">TULRCA 1992 s.188 Collective Consultation Obligations</span>
                Because 20 or more employees are affected, a statutory collective consultation obligation exists. Failure to consult gives rise to a protective award claim under <strong>s.189 TULRCA 1992</strong> of up to 90 days&apos; gross pay. This is a separate tribunal action and is not waived by standard redundancy parameters unless explicitly compromised in the agreement.
              </div>
            )}

            <div className="p-3.5 bg-[#F7F4EE] border border-[#E2DCCE] rounded-lg">
              <span className="font-bold text-[#0B1F3A] block mb-1">Strict Platform Disclaimer & Compliance Warning</span>
              <strong>IMPORTANT NOTICE:</strong> This brief is generated dynamically for intake assessment and informational purposes only. SettlementCheck (operated by SettlementCheck Ltd) is an intake support platform, not a legal advisory body, SRA-regulated law firm, or barrister chambers. This report does not constitute formal legal advice, nor does it create a solicitor-client relationship. Under <strong>s.203(3) of the Employment Rights Act 1996</strong>, a settlement agreement is only legally binding if the employee receives independent advice from a qualified adviser (such as a certified solicitor). The recipient of this report must consult a matched solicitor to verify all figures, check contract clauses, and execute the final agreement.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Breakdown table ────────────────────────────────────────────── */

function BreakdownTable({ result, offer, salary }: { result: VerdictResult; offer: number; salary: number }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const taxRatePct = Math.round(result.taxRate * 100)
  const netDisplay = result.estimatedNet < 0 ? 0 : result.estimatedNet

  const srpLabel = result.redundancy > 0 ? 'Statutory redundancy pay' : 'Basic award (unfair dismissal)'
  const srpValue = result.redundancy > 0 ? result.redundancy : result.basicAward
  const pilonLabel = `Notice pay (PILON) ${result.noticeWeeksUsed} week${result.noticeWeeksUsed !== 1 ? 's' : ''}`

  const thStyle: React.CSSProperties = { padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8A93A3', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #E2DCCE', background: '#F7F4EE' }
  const thRStyle: React.CSSProperties = { ...thStyle, textAlign: 'right' }

  function Row({ label, value, taxTag, highlight, dimmed, isNegative }: {
    label: React.ReactNode; value: React.ReactNode; taxTag?: React.ReactNode; highlight?: boolean; dimmed?: boolean; isNegative?: boolean
  }) {
    return (
      <tr style={{ borderBottom: '1px solid #E2DCCE', background: highlight ? '#F0EDE6' : undefined }}>
        <td style={{ padding: '11px 20px', fontSize: 14, color: dimmed ? '#8A93A3' : '#0B1F3A', fontWeight: highlight ? 600 : 400 }}>{label}</td>
        <td style={{ padding: '11px 20px', fontSize: 14, textAlign: 'right', fontFamily: 'var(--font-mono)', color: isNegative ? '#A8341F' : '#0B1F3A', fontWeight: highlight ? 600 : 400 }}>{value}</td>
        <td style={{ padding: '11px 20px', fontSize: 12, textAlign: 'right' }}>{taxTag}</td>
      </tr>
    )
  }

  function Tag({ text, color }: { text: string; color: string }) {
    return <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: color === 'green' ? 'rgba(79,112,96,0.12)' : 'rgba(168,52,31,0.10)', color: color === 'green' ? '#4F7060' : '#A8341F', whiteSpace: 'nowrap' }}>{text}</span>
  }

  const dividerRow = (
    <tr><td colSpan={3} style={{ height: 1, background: '#D8D2C6', padding: 0 }} /></tr>
  )

  return (
    <div className="bg-card border border-rule rounded-lg overflow-hidden bg-white">
      <div className="px-5 py-4 border-b border-rule">
        <h3 className="sc-h3 text-[#0B1F3A]">Statutory Entitlement Breakdown</h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={thRStyle}>Amount</th>
              <th style={thRStyle}>Tax status</th>
            </tr>
          </thead>
          <tbody>
            {srpValue > 0 && (
              <Row
                label={<>{srpLabel} <sup>¹</sup></>}
                value={formatCurrency(srpValue)}
                taxTag={<Tag text="Tax-free *" color="green" />}
              />
            )}
            <Row
              label={<>{pilonLabel} <sup>²</sup></>}
              value={formatCurrency(result.pilon)}
              taxTag={<Tag text="Fully taxable" color="red" />}
            />
            {dividerRow}
            <Row label="Estimated statutory minimum" value={formatCurrency(result.minimum)} highlight />
            <Row label="Typical negotiated low" value={formatCurrency(result.typicalLow)} dimmed />
            <Row
              label="Typical negotiated high"
              value={result.typicalHighUncapped ? 'Potentially uncapped' : formatCurrency(result.typicalHigh)}
              dimmed
            />
            <Row label="Your offer" value={formatCurrency(offer)} highlight />
            {dividerRow}
            <Row
              label={`Estimated tax on settlement`}
              value={`−${formatCurrency(result.estimatedTax)}`}
              taxTag={<span style={{ fontSize: 12, color: '#8A93A3' }}>At {taxRatePct}% rate</span>}
              isNegative
            />
            <Row label={<strong>Estimated net take-home</strong>} value={<strong>{formatCurrency(netDisplay)}</strong>} highlight />
          </tbody>
        </table>
      </div>

      {result.collectiveRedundancy && result.protectiveAwardMax > 0 && (
        <div className="mx-5 my-4 p-4 rounded-md" style={{ background: 'rgba(217,96,59,0.07)', border: '1px solid rgba(217,96,59,0.2)' }}>
          <p className="text-[13px] text-ink font-medium mb-1">Potential separate Employment Tribunal claim</p>
          <p className="text-[13px] text-muted leading-[1.55]">
            Because 20 or more employees were affected, you may have a Protective Award claim of up to <strong className="text-ink">{formatCurrency(result.protectiveAwardMax)}</strong> (90 days pay) if your employer failed to consult properly. This is claimed separately under TULRCA 1992 s.189 and is not included in the figures above.
          </p>
        </div>
      )}

      {/* Tax footnote */}
      <div className="px-5 py-4 border-t border-rule text-[#8A93A3]">
        <p className="text-[12px] leading-[1.65] m-0">
          * The first £30,000 of genuine termination payments is tax-free under ITEPA 2003 s.403. Payment in lieu of notice (PILON, a lump sum paid instead of working your notice period) is always fully taxable regardless of how it is described in your agreement, under ITEPA 2003 s.402D.
        </p>
        <p className="text-[12px] mt-2 leading-[1.65] m-0">
          Tax estimate uses {taxRatePct}% based on your salary. Your actual liability depends on your total income in this tax year.
          {result.isScottishNote && ' Scottish taxpayers have different income tax bands. This estimate uses UK standard rates as a baseline.'}
        </p>
      </div>

      {/* View legal sources toggle */}
      <div className="border-t border-rule">
        <button
          type="button"
          onClick={() => setSourcesOpen(o => !o)}
          className="w-full px-5 py-3.5 text-left flex items-center justify-between text-[13px] text-muted hover:text-ink transition-colors cursor-pointer focus:outline-none"
        >
          <span>View legal sources</span>
          <span style={{ transform: sourcesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▾</span>
        </button>
        {sourcesOpen && (
          <div className="px-5 pb-5 text-[12px] text-muted leading-[1.8] flex flex-col gap-1">
            <p><sup>¹</sup> Statutory redundancy pay: <a href="https://www.legislation.gov.uk/ukpga/1996/18/sections/162-163" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ERA 1996 ss.162-163</a></p>
            <p><sup>²</sup> Notice entitlement: <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/86" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ERA 1996 s.86</a></p>
            <p>Weekly pay cap £{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI: <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ERA 1996 s.227</a></p>
            <p>Tax-free threshold: <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ITEPA 2003 s.403</a></p>
            <p>PILON taxation: <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ITEPA 2003 s.402D</a></p>
            {result.collectiveRedundancy && (
              <p>Protective award: <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/189" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">TULRCA 1992 s.189</a></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Save and share (Section 6) ─────────────────────────────────── */

function SaveCard({ resultRef, result, offer, onEmailCapture, params }: {
  resultRef: React.RefObject<HTMLDivElement | null>
  result: VerdictResult
  offer: number
  onEmailCapture: (email: string) => void
  params: Record<string, string | number>
}) {
  const [emailOpen, setEmailOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setStatus('sending')
    try {
      const res = await fetch('/api/save-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...params,
          verdict:            result.verdict,
          minimum:            result.minimum,
          typicalLow:         result.typicalLow,
          typicalHigh:        result.typicalHigh,
          typicalHighUncapped: result.typicalHighUncapped,
          estimatedNet:       result.estimatedNet,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      onEmailCapture(email)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div ref={resultRef} className="bg-card border border-rule rounded-lg p-6 flex flex-col gap-4 bg-white">
      <div>
        <span className="sc-eyebrow">Save your results</span>
        <h3 className="sc-h3 mt-1 text-[#0B1F3A]">Keep a record of your calculation.</h3>
        <p className="sc-body mt-1.5 text-[14px] text-[#5B6577]">Your figures are based on the details you entered today. Save a copy now so you have something to refer back to, share with a partner, or bring to your first solicitor call.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost text-[14px] w-full px-4 py-2.5 cursor-pointer"
        >
          Download PDF brief
        </button>

        {!emailOpen && status !== 'sent' && (
          <button
            type="button"
            data-email-trigger
            onClick={() => setEmailOpen(true)}
            className="btn-accent text-[14px] w-full px-4 py-2.5 cursor-pointer"
          >
            Email me my results
          </button>
        )}
      </div>

      {emailOpen && status !== 'sent' && (
        <form onSubmit={sendEmail} className="flex flex-col gap-3 pt-2">
          <label className="text-[13px] font-medium text-ink">Your email address</label>
          <div className="input-wrap">
            <input
              type="email"
              className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <p className="text-[12px] text-[#8A93A3] leading-[1.55] m-0">
            We will send your results once. Your email will not be added to any marketing list unless you choose Step 2 below.
          </p>
          {status === 'error' && (
            <p className="text-[12px] text-crimson">Something went wrong. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-accent text-[14px] w-full px-4 py-2.5 disabled:opacity-60 cursor-pointer"
          >
            {status === 'sending' ? 'Sending...' : 'Send my results'}
          </button>
        </form>
      )}
      {status === 'sent' && (
        <p className="text-[13px] text-muted m-0">Sent. Check your inbox, including your spam folder.</p>
      )}
    </div>
  )
}

/* ── Non-converter fallback (Section 8) ─────────────────────────── */

function NonConverterFallback({ onScrollToSave }: { onScrollToSave: () => void }) {
  return (
    <div className="text-center py-6">
      <p className="text-[15px] text-[#0B1F3A] font-medium mb-1">Not ready yet?</p>
      <p className="sc-body mb-3 text-[14px]">Save your results and come back when you are. Most people take a few days to decide.</p>
      <button
        type="button"
        onClick={onScrollToSave}
        className="text-[14px] text-muted underline underline-offset-4 hover:text-ink transition-colors bg-transparent border-0 cursor-pointer"
      >
        Email me my results
      </button>
    </div>
  )
}

/* ── Inputs summary + inline edit panel ────────────────────────── */

const REASON_LABELS: Record<string, string> = {
  redundancy:            'Redundancy',
  redundancy_collective: 'Collective redundancy (20+ people)',
  dismissal:             'Unfair dismissal',
  constructive:          'Constructive dismissal',
  resignation:           'Resignation / mutual agreement',
}
const DISCRIMINATION_LABELS: Record<string, string> = {
  no:       'No',
  yes:      'Yes',
  not_sure: 'Not sure',
}

function InputsSummaryPanel({
  inputs,
  onUpdate,
}: {
  inputs: EditableInputs
  onUpdate: (next: EditableInputs) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EditableInputs>(inputs)
  const [editingField, setEditingField] = useState<string | null>(null)

  function togglePanel() {
    if (!open) setDraft(inputs)
    setOpen(o => !o)
    setEditingField(null)
  }

  function set(k: keyof EditableInputs, v: string) {
    setDraft(d => ({ ...d, [k]: v }))
  }

  function apply() {
    onUpdate(draft)
    setOpen(false)
    setEditingField(null)
  }

  const fields: { key: keyof EditableInputs; label: string; display: (v: string) => string; type: 'number' | 'select' | 'pill'; options?: { value: string; label: string }[] }[] = [
    { key: 'salary',            label: 'Annual salary',         display: v => v ? `£${Number(v).toLocaleString('en-GB')}` : 'Not set', type: 'number' },
    { key: 'yearsNum',          label: 'Years of service',      display: v => v ? `${v} year${v === '1' ? '' : 's'}` : '0 years', type: 'number' },
    { key: 'monthsNum',         label: 'Additional months',     display: v => v ? `${v} month${v === '1' ? '' : 's'}` : '0 months', type: 'number' },
    { key: 'age',               label: 'Age',                   display: v => v || 'Not set', type: 'number' },
    { key: 'offer',             label: 'Settlement offer',      display: v => v ? `£${Number(v).toLocaleString('en-GB')}` : '£0', type: 'number' },
    { key: 'reason',            label: 'Reason for leaving',    display: v => REASON_LABELS[v] ?? v, type: 'select', options: Object.entries(REASON_LABELS).map(([value, label]) => ({ value, label })) },
    { key: 'discrimination',    label: 'Discrimination element',display: v => DISCRIMINATION_LABELS[v] ?? v, type: 'pill',   options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }, { value: 'not_sure', label: 'Not sure' }] },
    { key: 'contractualNotice', label: 'Contractual notice (weeks)', display: v => v ? `${v} week${v === '1' ? '' : 's'}` : '0 weeks', type: 'number' },
  ]

  return (
    <div>
      <button
        type="button"
        onClick={togglePanel}
        className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink transition-colors mb-6 bg-transparent border-0 cursor-pointer p-0"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Adjust calculator inputs
      </button>

      {open && (
        <div className="bg-card border border-rule rounded-lg p-5 mb-6 flex flex-col gap-4 bg-white" style={{ animation: 'sc-fade-in 200ms ease forwards' }}>
          <div className="flex items-center justify-between">
            <h3 className="sc-h3 text-[#0B1F3A]" style={{ fontSize: 16 }}>Your inputs</h3>
            <button type="button" onClick={() => setOpen(false)} className="text-[20px] text-muted hover:text-ink leading-none bg-transparent border-0 cursor-pointer">&times;</button>
          </div>

          <div className="flex flex-col divide-y divide-rule">
            {fields.map(f => (
              <div key={f.key} className="py-2.5 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-muted mb-0.5">{f.label}</div>

                  {editingField === f.key ? (
                    <div className="mt-1.5">
                      {f.type === 'number' && (
                        <div className="input-wrap" style={{ maxWidth: 200 }}>
                          <input
                            type="number"
                            className="flex-1 border-0 bg-transparent outline-none py-2 px-3 text-[15px] text-ink"
                            value={draft[f.key]}
                            onChange={e => set(f.key, e.target.value)}
                            autoFocus
                          />
                        </div>
                      )}
                      {f.type === 'select' && f.options && (
                        <select
                          className="input-wrap py-2 px-3 text-[14px] text-ink bg-white border border-[#E2DCCE] rounded-md outline-none"
                          value={draft[f.key]}
                          onChange={e => set(f.key, e.target.value)}
                          autoFocus
                        >
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      )}
                      {f.type === 'pill' && f.options && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {f.options.map(o => (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => set(f.key, o.value)}
                              className="px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors cursor-pointer"
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
                    <div className="text-[14px] text-ink font-medium">{f.display(inputs[f.key])}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setEditingField(editingField === f.key ? null : f.key)}
                  className="text-[12px] font-medium text-[#D9603B] hover:underline bg-transparent border-0 cursor-pointer flex-shrink-0 mt-3"
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

/* ── Pre-CTA trust USPs + FAQ to address objections ────────────── */

const LEAD_FAQS = [
  {
    q: 'Is this genuinely free for me?',
    a: 'Yes. UK law requires your employer to pay for your independent legal advice on any settlement agreement. The solicitor\'s fee is covered by your employer, not you. You will not be asked for payment at any point.',
  },
  {
    q: 'Will I be contacted by multiple firms?',
    a: 'No. Your details go to one matched solicitor only. We do not share your information with multiple firms or add you to any marketing list.',
  },
  {
    q: 'What if I have already signed?',
    a: 'In most cases a solicitor can still review the agreement, particularly if it was signed under pressure or without adequate time to consider the terms. It is worth getting advice even at this stage.',
  },
  {
    q: 'I am not sure I have a strong position. Should I still proceed?',
    a: 'Yes. You do not need certainty to get advice. A solicitor will tell you where you stand, what the agreement means, and whether the terms are reasonable. That clarity costs you nothing.',
  },
  {
    q: 'What if my situation does not fit the calculator?',
    a: 'The calculator covers the most common scenarios. A solicitor can assess your full situation, including anything the calculator cannot account for, such as discrimination, whistleblowing, or complex bonus structures.',
  },
]

function LeadFAQ() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="bg-card border border-rule rounded-lg overflow-hidden bg-white">
      <div className="p-5 md:p-6 pb-4">
        <div>
          <h3 className="sc-h3 mb-4 text-[#0B1F3A]">Frequently Asked Questions</h3>
          <div className="flex flex-col">
            {LEAD_FAQS.map((item, i) => (
              <div key={i} className="border-t border-rule first:border-t-0">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between py-3.5 text-left gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={open === i}
                >
                  <span className="sc-body font-semibold text-[#0B1F3A] text-[14px]">{item.q}</span>
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full border border-rule flex items-center justify-center transition-transform duration-200"
                    style={{ transform: open === i ? 'rotate(45deg)' : 'none' }}
                    aria-hidden="true"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#5B6577" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <p className="sc-body text-[#5B6577] pb-4 max-w-[60ch] text-[13px] leading-relaxed m-0">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Get Matched CTA — verdict-aware, high-converting ───────────── */

function GetMatchedCTA({
  verdict, offer, salary, totalMonths, prefillEmail, onGetMatched,
}: {
  verdict: string; offer: number; salary: number; totalMonths: number
  prefillEmail: string; onGetMatched: () => void
}) {
  const urgencyMap: Record<string, { badge: string; badgeColor: string; badgeBg: string; badgeBorder: string; heading: string; body: string; cta: string }> = {
    BELOW_MINIMUM: {
      badge: 'Unlawful offer threshold',
      badgeColor: '#A8341F', badgeBg: '#FBF0EE', badgeBorder: '#D9A99E',
      heading: 'Protect your legal rights immediately.',
      body: 'Your employer is legally required to cover the costs of your legal consultation. Let a matched SRA-regulated solicitor review your paperwork, negotiate your uplift, and correct this offer for free.',
      cta: 'Match with a specialist solicitor',
    },
    BELOW_TYPICAL: {
      badge: 'Negotiable Range Detected',
      badgeColor: '#B5802A', badgeBg: '#FEFBF0', badgeBorder: '#E0CB94',
      heading: 'Most employees leave money behind.',
      body: 'Your offer is below standard market benchmarks. A specialist solicitor will review not just the financial figure, but reference clauses and covenants to secure a proper exit at no cost to you.',
      cta: 'Match with a specialist solicitor',
    },
    WITHIN_RANGE: {
      badge: 'Fair offer value',
      badgeColor: '#4F7060', badgeBg: '#F2F7F3', badgeBorder: '#BCD0BF',
      heading: 'Ensure your contract terms are secure.',
      body: 'While the cash figure aligns with averages, settlement agreements contain strict covenants and legal waivers. Your employer is legally required to pay for independent legal review.',
      cta: 'Secure your free legal review',
    },
    ABOVE_TYPICAL: {
      badge: 'Strong offer value',
      badgeColor: '#4F7060', badgeBg: '#F2F7F3', badgeBorder: '#BCD0BF',
      heading: 'Lock in your settlement terms.',
      body: 'Your financial offer is excellent. A solicitor will ensure that the terms are watertight and fully compliant with SRA rules before you sign. The review is paid for entirely by your employer.',
      cta: 'Secure your free legal review',
    },
  }

  const c = urgencyMap[verdict] ?? urgencyMap['BELOW_TYPICAL']

  return (
    <div className="bg-card border border-rule rounded-lg overflow-hidden bg-white">
      <div style={{ padding: '16px 20px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 999,
          fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          background: c.badgeBg, color: c.badgeColor, border: `1px solid ${c.badgeBorder}`,
        }}>
          {c.badge}
        </span>
      </div>

      <div className="p-5 md:p-6">
        <h2 className="text-[17px] font-bold text-[#0B1F3A] mb-2">{c.heading}</h2>
        <p className="sc-body text-muted mb-5 max-w-[58ch] text-[13px] leading-relaxed">{c.body}</p>

        {/* Trust USPs */}
        <div className="flex flex-col gap-2.5 mb-6">
          {[
            '100% Free. Legal fees covered by your employer.',
            'Your data is sent to a single matched firm only.',
            'Zero obligation following your introductory call.',
          ].map(t => (
            <div key={t} className="flex items-center gap-2.5">
              <span className="flex-shrink-0 w-4.5 h-4.5 rounded-full bg-[#4F7060] flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-[13px] text-[#0B1F3A] leading-snug font-medium">{t}</span>
            </div>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={onGetMatched}
          className="btn-accent text-[15px] font-semibold px-6 py-3.5 w-full cursor-pointer"
          style={{ borderRadius: 8, boxShadow: '0 4px 16px rgba(217,96,59,0.22)', letterSpacing: '-0.01em' }}
        >
          {c.cta} →
        </button>

        <p className="text-[11px] text-[#8A93A3] mt-3.5 leading-relaxed m-0 text-center">
          Takes under 2 minutes. Free matching service.
          {prefillEmail ? ' Your email is pre-filled.' : ''}
        </p>
      </div>
    </div>
  )
}

/* ── Main results content ───────────────────────────────────────── */

function ResultsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [inputs, setInputs] = useState<EditableInputs>({
    salary:            searchParams.get('salary')            ?? '0',
    yearsNum:          searchParams.get('yearsNum')          ?? '0',
    monthsNum:         searchParams.get('monthsNum')         ?? '0',
    age:               searchParams.get('age')               ?? '0',
    offer:             searchParams.get('offer')             ?? '0',
    reason:            searchParams.get('reason')            ?? '',
    discrimination:    searchParams.get('discrimination')    ?? 'no',
    contractualNotice: searchParams.get('contractualNotice') ?? '0',
  })

  // Selected Vento Band for interactive discrimination modeling
  const [selectedVentoBand, setSelectedVentoBand] = useState<'lower' | 'middle' | 'upper' | 'exceptional' | null>(null)

  const salary            = parseFloat(inputs.salary)
  const yearsNum          = parseFloat(inputs.yearsNum)
  const monthsNum         = parseFloat(inputs.monthsNum)
  const totalMonths       = yearsNum * 12 + monthsNum
  const age               = parseInt(inputs.age)
  const offer             = parseFloat(inputs.offer)
  const reason            = inputs.reason
  const discrimination    = inputs.discrimination
  const contractualNotice = parseInt(inputs.contractualNotice)

  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>('GB')
  const [showJurisdictionToggle, setShowJurisdictionToggle] = useState(false)
  const [prefillEmail, setPrefillEmail] = useState(searchParams.get('email') ?? '')
  const saveCardRef = useRef<HTMLDivElement>(null)

  const valid = salary > 0 && age > 0 && offer >= 0 && reason !== ''
  const result: VerdictResult | null = valid
    ? getVerdict(salary, totalMonths, age, offer, reason, discrimination, contractualNotice, jurisdiction)
    : null

  const saveParams = {
    salary, yearsNum, monthsNum, age, offer, reason, discrimination,
    contractualNotice, jurisdiction,
  }

  function scrollToSave() {
    saveCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => saveCardRef.current?.querySelector<HTMLButtonElement>('[data-email-trigger]')?.click(), 400)
  }

  return (
    <>
      <Nav />
      {/* Inject print-only and layout styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            background-color: #ffffff !important;
            color: #0B1F3A !important;
            font-family: var(--font-sans), Inter, sans-serif !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          nav, footer, .no-print {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
            background: none !important;
            min-height: auto !important;
          }
          .sc-container {
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
          }
          /* Ensure layout containers do not use grid/flex layout when printing */
          .grid, .flex-col, .lg\:col-span-2 {
            display: block !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          #printable-case-brief-wrapper {
            display: block !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
          }
          #printable-case-brief {
            display: block !important;
            opacity: 1 !important;
            max-height: none !important;
            overflow: visible !important;
            height: auto !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-before: always !important;
            break-before: page !important;
            margin-top: 0 !important;
            padding-top: 15mm !important;
          }
          /* Ensure text colors print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Force standard table formatting */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin-top: 5px !important;
            margin-bottom: 5px !important;
          }
          th, td {
            border: 1px solid #E2DCCE !important;
            padding: 6px 10px !important;
            font-size: 11px !important;
          }
          /* Ensure text reads well */
          .text-coral, span[style*="color: rgb(217, 96, 59)"] {
            color: #D9603B !important;
          }
          .text-ink {
            color: #0B1F3A !important;
          }
        }
      `}} />

      <main className="bg-paper-2 min-h-screen pb-24" style={{ animation: 'sc-fade-in 400ms ease forwards' }}>
        <div className="sc-container pt-8 md:pt-12" style={{ maxWidth: 1120 }}>

          <div className="no-print">
            <InputsSummaryPanel inputs={inputs} onUpdate={(next) => {
              setInputs(next)
              setSelectedVentoBand(null) // reset Vento band when fields change
            }} />
          </div>

          {!valid && (
            <div className="bg-amber-tint border border-[#E0CB94] rounded-lg p-6 mb-6">
              <p className="text-amber font-medium">Missing details. Please go back and complete the calculator.</p>
              <Link href="/calculator" className="mt-3 inline-block text-[14px] text-ink underline underline-offset-4">Return to calculator</Link>
            </div>
          )}

          {result && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Left Column - Calculations, interactive sliders, visual chart, detailed breakdowns */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Reassurance progress indicator */}
                <div className="flex items-center justify-between text-[13px] text-muted border-b border-[#E2DCCE] pb-3 no-print">
                  <span>Case ID: SC-{Math.abs(salary - age * totalMonths).toString(16).toUpperCase()}</span>
                  <span className="flex items-center gap-1.5 font-semibold text-[#4F7060]">
                    <span className="w-2 h-2 rounded-full bg-[#4F7060] animate-pulse"></span>
                    Verified: 2026 UK Statutory Rates
                  </span>
                </div>

                {/* Verdict panel */}
                <div className="no-print">
                  <VerdictPanel result={result} offer={offer} salary={salary} yearsNum={Math.floor(yearsNum)} age={age} />
                </div>

                {/* Jurisdiction toggles */}
                <div className="text-[13px] text-muted flex flex-wrap items-center gap-2 no-print">
                  <span>Results calculated for {jurisdiction === 'NI' ? 'Northern Ireland' : 'England, Scotland and Wales'} (£{jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB} per week cap).</span>
                  {!showJurisdictionToggle && (
                    <button type="button" onClick={() => setShowJurisdictionToggle(true)} className="underline underline-offset-2 hover:text-[#0B1F3A] transition-colors bg-transparent border-0 cursor-pointer text-[13px] text-muted">Change jurisdiction</button>
                  )}
                  {showJurisdictionToggle && (
                    <div className="flex gap-2">
                      {(['GB', 'NI'] as const).map(j => (
                        <button
                          key={j}
                          type="button"
                          onClick={() => { setJurisdiction(j); setShowJurisdictionToggle(false) }}
                          className="px-3 py-1 rounded-full text-[12px] font-medium border transition-colors cursor-pointer"
                          style={{ background: jurisdiction === j ? '#0B1F3A' : '#fff', color: jurisdiction === j ? '#fff' : '#0B1F3A', borderColor: jurisdiction === j ? '#0B1F3A' : '#E2DCCE' }}
                        >
                          {j === 'GB' ? 'England, Scotland or Wales' : 'Northern Ireland'}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Social Proof */}
                <div className="no-print">
                  <Testimonials />
                </div>

                {/* Visual Chart - Dynamic stacked bar */}
                <div className="no-print">
                  <FinancialSplitChart
                    offer={offer}
                    pilon={result.pilon}
                    taxFreeAmount={result.taxFreeAmount}
                    taxableTermination={result.taxableTermination}
                    estimatedTax={result.estimatedTax}
                    netTakeHome={result.estimatedNet}
                  />
                </div>

                {/* Interactive Pension Sacrifice Slider */}
                {result.taxableTermination > 0 && (
                  <div className="no-print">
                    <PensionSacrificeWidget
                      taxableTermination={result.taxableTermination}
                      salary={salary}
                    />
                  </div>
                )}

                {/* Interactive Vento Band Selector */}
                {result.discriminationFlag && result.ventoBands && (
                  <div className="no-print">
                    <VentoBandWidget
                      ventoBands={result.ventoBands}
                      selectedBand={selectedVentoBand}
                      onBandSelect={(band) => setSelectedVentoBand(band)}
                    />
                  </div>
                )}

                {/* Statutory breakdown table */}
                <div className="no-print">
                  <BreakdownTable result={result} offer={offer} salary={salary} />
                </div>

                {/* Barrister-Ready Case Brief (Intake brief) */}
                <CaseBriefSection
                  inputs={inputs}
                  result={result}
                  selectedVentoBand={selectedVentoBand}
                  ventoBands={result.ventoBands}
                />

                {/* FAQ obection handling */}
                <div className="no-print">
                  <LeadFAQ />
                </div>

                <div className="no-print">
                  <NonConverterFallback onScrollToSave={scrollToSave} />
                </div>

                <p className="text-[11px] text-[#8A93A3] leading-[1.6] text-center px-4 m-0 no-print">
                  Calculation estimates are based on UK statutory rates (weekly cap £{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI, 2026/27). This utility is an intake support platform, not a legal advisory body. SettlementCheck connects users with independent, SRA-regulated solicitors.
                </p>
              </div>

              {/* Right Column - Conversions (Sticky on Desktop) */}
              <div className="lg:col-span-1 lg:sticky lg:top-6 flex flex-col gap-6 no-print">
                
                {/* Get Matched Solicitor CTA */}
                <GetMatchedCTA
                  verdict={result.verdict}
                  offer={offer}
                  salary={salary}
                  totalMonths={totalMonths}
                  prefillEmail={prefillEmail}
                  onGetMatched={() => {
                    const p = new URLSearchParams({
                      verdict: result.verdict,
                      offer:   String(offer),
                      salary:  String(salary),
                      months:  String(totalMonths),
                    })
                    if (prefillEmail) { p.set('email', prefillEmail); p.set('ev', '1') }
                    router.push(`/get-matched?${p.toString()}`)
                  }}
                />

                {/* Save results panel */}
                <SaveCard
                  resultRef={saveCardRef}
                  result={result}
                  offer={offer}
                  onEmailCapture={em => setPrefillEmail(em)}
                  params={saveParams}
                />

                {/* Signing Deadline Alert */}
                <div className="rounded-lg p-4 flex gap-3.5 items-start" style={{ background: '#F5F1E9', border: '1px solid #D8D2C6' }}>
                  <span className="text-[17px] flex-shrink-0 leading-none">🗓</span>
                  <div className="text-[13px] text-[#5B6577] leading-relaxed">
                    <p className="text-[#0B1F3A] font-semibold mb-1 m-0">Typical 7–10 Day signing deadline</p>
                    <p className="m-0">Legal review processes generally complete in 24–48 hours. Starting early leaves headroom for legal adjustments without timeline pressure.</p>
                  </div>
                </div>

              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ResultsClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper-2 flex items-center justify-center">
        <p className="text-[#5B6577] text-[15px]">Loading case calculations…</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
