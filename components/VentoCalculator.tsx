'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { VENTO_BANDS_2026_27, STATUTORY_RATES_2026_27 } from '@/lib/statutory-rates'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'

function formatGBP(n: number): string {
  return `£${Math.round(n).toLocaleString('en-GB')}`
}

type BandKey = 'lower' | 'middle' | 'upper'

const BAND_INFO: Record<BandKey, { title: string; subtitle: string; min: number; max: number }> = {
  lower: {
    title: 'Lower Band',
    subtitle: 'Isolated or one-off incidents with limited impact',
    min: VENTO_BANDS_2026_27.lowerMin,
    max: VENTO_BANDS_2026_27.lowerMax,
  },
  middle: {
    title: 'Middle Band',
    subtitle: 'Serious, recurring harassment or discriminatory dismissal',
    min: VENTO_BANDS_2026_27.middleMin,
    max: VENTO_BANDS_2026_27.middleMax,
  },
  upper: {
    title: 'Upper Band',
    subtitle: 'Prolonged campaigns or career-ending victimisation',
    min: VENTO_BANDS_2026_27.upperMin,
    max: VENTO_BANDS_2026_27.upperMax,
  },
}

export function VentoCalculator() {
  const [salaryInput, setSalaryInput] = useState<string>('42000')
  const [lossMonths, setLossMonths] = useState<number>(4)
  const [band, setBand] = useState<BandKey>('middle')

  const salary = Math.max(0, parseFloat(salaryInput.replace(/[^0-9.]/g, '')) || 0)

  const calc = useMemo(() => {
    const selected = BAND_INFO[band]
    const monthlyGross = salary / 12
    const financialLoss = Math.round(monthlyGross * lossMonths)
    const lowTotal = selected.min + financialLoss
    const highTotal = selected.max + financialLoss
    const taxFreeLimit = STATUTORY_RATES_2026_27.taxFreeLimit
    const taxFreeMid = Math.min(Math.round((lowTotal + highTotal) / 2), taxFreeLimit)

    return {
      selected,
      financialLoss,
      lowTotal,
      highTotal,
      taxFreeMid,
    }
  }, [salary, lossMonths, band])

  return (
    <div className="bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2DCCE] pb-3 mb-5">
        <span className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#D9603B] font-semibold">
          Equality Act 2010 s.124 • April 2026 Vento Bands
        </span>
        <span className="text-xs text-[#0B1F3A]/70 font-mono">
          Uncapped Statutory Jurisdiction
        </span>
      </div>

      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A] mb-2">
        Harassment &amp; Discrimination Compensation Calculator
      </h3>
      <p className="text-body text-[#0B1F3A]/80 mb-6 leading-relaxed">
        Model illustrative Equality Act 2010 compensation combining April 2026 Vento injury-to-feelings bands and estimated financial loss.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-2">
              Select Injury-to-Feelings Vento Band
            </label>
            <div className="space-y-2">
              {(['lower', 'middle', 'upper'] as BandKey[]).map((key) => {
                const info = BAND_INFO[key]
                const active = band === key
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setBand(key)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                        : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE] hover:border-[#0B1F3A]/40'
                    }`}
                  >
                    <div className="flex justify-between items-center font-semibold text-xs">
                      <span>{info.title}</span>
                      <span className="font-mono">
                        {formatGBP(info.min)} – {formatGBP(info.max)}
                        {key === 'upper' ? '+' : ''}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 mb-0 ${active ? 'text-white/75' : 'text-[#0B1F3A]/70'}`}>
                      {info.subtitle}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label htmlFor="vento-salary" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Annual Gross Salary (£)
            </label>
            <input
              id="vento-salary"
              type="text"
              inputMode="numeric"
              value={salaryInput}
              onChange={(e) => setSalaryInput(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full px-3.5 py-2.5 border border-[#E2DCCE] rounded-lg text-sm font-semibold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
            />
          </div>

          <div>
            <label htmlFor="vento-months" className="block text-xs font-semibold text-[#0B1F3A] uppercase tracking-wider mb-1.5">
              Estimated Uncompensated Loss Period: {lossMonths} months
            </label>
            <input
              id="vento-months"
              type="range"
              min={0}
              max={12}
              value={lossMonths}
              onChange={(e) => setLossMonths(Number(e.target.value))}
              className="w-full accent-[#D9603B]"
            />
          </div>
        </div>

        <div className="bg-[#0B1F3A] text-white rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-white/70 block">
              Illustrative Statutory &amp; Vento Range
            </span>
            <div className="border-b border-white/15 pb-3">
              <div className="text-xs text-white/75 mb-1">Combined Illustrative Range</div>
              <div className="text-2xl font-serif font-bold text-white">
                {formatGBP(calc.lowTotal)} – {formatGBP(calc.highTotal)}
                {band === 'upper' ? '+' : ''}
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-white/75">Selected Vento Band ({calc.selected.title})</span>
                <span className="font-mono font-semibold">
                  {formatGBP(calc.selected.min)} – {formatGBP(calc.selected.max)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/75">Illustrative Earnings Loss ({lossMonths} mo)</span>
                <span className="font-mono font-semibold">{formatGBP(calc.financialLoss)}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/15">
                <span className="text-white/75">Up to £30,000 Settlement Exemption</span>
                <span className="font-mono font-semibold text-[#F7B29B]">{formatGBP(calc.taxFreeMid)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/65">Typical Tribunal Wait (HMCTS)</span>
                <span className="font-mono text-white/80">~10–18 months</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 space-y-2">
            <Link
              href={`/get-matched/?salary=${salary}&reason=discrimination`}
              className="btn-accent w-full text-center block"
            >
              Speak with a discrimination solicitor →
            </Link>
            <p className="text-[11px] text-white/65 leading-relaxed m-0">
              Informational Vento &amp; statutory arithmetic only. Employers standardly contribute £350 to £500+ plus VAT upon completion; excess or abortive work depends on solicitor terms.
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
