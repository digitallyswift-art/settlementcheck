'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { getVerdict, formatCurrency, WEEKLY_CAP_GB } from '@/lib/calculations'

interface InlineEstimatorProps {
  initialSalary?: number
  initialYears?: number
  reason?: string
  title?: string
  subtitle?: string
}

export default function InlineEstimator({
  initialSalary = 45000,
  initialYears = 4,
  reason = 'redundancy',
  title = 'Instant Settlement Payout Estimator',
  subtitle = 'See your statutory floor and typical UK negotiated settlement range in seconds.',
}: InlineEstimatorProps) {
  const router = useRouter()
  const [salaryInput, setSalaryInput] = useState<string>(String(initialSalary))
  const [yearsInput, setYearsInput] = useState<string>(String(initialYears))
  const [ageInput, setAgeInput] = useState<string>('38')

  const parsedSalary = Math.max(0, parseInt(salaryInput.replace(/[^0-9]/g, ''), 10) || 0)
  const parsedYears = Math.min(40, Math.max(0, parseInt(yearsInput.replace(/[^0-9]/g, ''), 10) || 0))
  const parsedAge = Math.min(75, Math.max(18, parseInt(ageInput.replace(/[^0-9]/g, ''), 10) || 38))

  const totalMonths = parsedYears * 12

  // Calculation output using central calculation engine
  const result = useMemo(() => {
    if (parsedSalary <= 0) return null
    return getVerdict(
      parsedSalary,
      totalMonths,
      parsedAge,
      0, // offer = 0 to get baseline & typical range
      reason,
      'no',
      0,
      'GB'
    )
  }, [parsedSalary, totalMonths, parsedAge, reason])

  const handleLaunchCalculator = () => {
    const params = new URLSearchParams({
      salary: String(parsedSalary || 45000),
      years: String(parsedYears),
      age: String(parsedAge),
      reason,
    })
    router.push(`/calculator/?${params.toString()}`)
  }

  const setSalaryPreset = (amount: number) => {
    setSalaryInput(String(amount))
  }

  const setYearsPreset = (years: number) => {
    setYearsInput(String(years))
  }

  return (
    <div
      className="bg-white border-2 border-[#E2DCCE] rounded-xl p-5 md:p-6 shadow-sm flex flex-col gap-5 my-8 transition-all"
      style={{ background: '#FAF9F6' }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2DCCE] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-[#0B1F3A] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Interactive Estimator
            </span>
            <span className="text-[#8A93A3] text-[11px] font-semibold">
              April 2026 Statutory Rates
            </span>
          </div>
          <h3 className="text-[18px] md:text-[20px] font-serif font-bold text-[#0B1F3A] m-0">
            {title}
          </h3>
          <p className="text-[13px] text-[#5B6577] m-0 mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Salary Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="estimator-salary" className="text-[12px] font-bold text-[#0B1F3A] uppercase tracking-wide">
            Annual Gross Salary
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-[15px] font-semibold text-[#8A93A3] pointer-events-none">
              £
            </span>
            <input
              id="estimator-salary"
              type="text"
              inputMode="numeric"
              value={salaryInput ? Number(salaryInput.replace(/[^0-9]/g, '')).toLocaleString('en-GB') : ''}
              onChange={(e) => setSalaryInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 50,000"
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-[#C8D3DF] rounded-lg text-[15px] font-bold text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A] focus:ring-1 focus:ring-[#0B1F3A]"
            />
          </div>
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-[#8A93A3]">Quick pick:</span>
            {[35000, 50000, 75000, 100000].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setSalaryPreset(amt)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  parsedSalary === amt
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-white text-[#5B6577] border-[#C8D3DF] hover:border-[#0B1F3A]'
                }`}
              >
                £{amt / 1000}k
              </button>
            ))}
          </div>
        </div>

        {/* Years of Service Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="estimator-years" className="text-[12px] font-bold text-[#0B1F3A] uppercase tracking-wide">
            Years of Continuous Service
          </label>
          <div className="relative flex items-center">
            <input
              id="estimator-years"
              type="number"
              min="0"
              max="40"
              value={yearsInput}
              onChange={(e) => setYearsInput(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 4"
              className="w-full px-3 py-2.5 bg-white border border-[#C8D3DF] rounded-lg text-[15px] font-bold text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A] focus:ring-1 focus:ring-[#0B1F3A]"
            />
            <span className="absolute right-3 text-[13px] font-medium text-[#8A93A3] pointer-events-none">
              {parsedYears === 1 ? 'year' : 'years'}
            </span>
          </div>
          {/* Quick Presets */}
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-[#8A93A3]">Quick pick:</span>
            {[2, 4, 7, 10].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setYearsPreset(yr)}
                className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                  parsedYears === yr
                    ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                    : 'bg-white text-[#5B6577] border-[#C8D3DF] hover:border-[#0B1F3A]'
                }`}
              >
                {yr} yrs
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Dynamic Results Display */}
      {result && parsedSalary > 0 && (
        <div className="bg-white border border-[#E2DCCE] rounded-xl p-4 md:p-5 flex flex-col gap-4 shadow-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Statutory Minimum Floor */}
            <div className="p-3.5 bg-[#F2F5F8] border border-[#C8D3DF] rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[#5B6577] text-[10px] uppercase font-bold tracking-wider block mb-0.5">
                  Statutory Floor (Minimum)
                </span>
                <span className="text-[20px] font-black text-[#0B1F3A]">
                  {formatCurrency(result.minimum)}
                </span>
              </div>
              <span className="text-[11px] text-[#5B6577] mt-1.5 leading-tight">
                Redundancy (capped at £{WEEKLY_CAP_GB}/wk) + notice pay
              </span>
            </div>

            {/* Typical Negotiated Range */}
            <div className="p-3.5 bg-[#FEFBF0] border border-[#E0CB94] rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[#B5802A] text-[10px] uppercase font-bold tracking-wider block mb-0.5">
                  Typical Negotiated Settlement
                </span>
                <span className="text-[20px] font-black text-[#0B1F3A]">
                  {formatCurrency(result.typicalLow)} – {formatCurrency(result.typicalHigh)}
                </span>
              </div>
              <span className="text-[11px] text-[#5B6577] mt-1.5 leading-tight">
                Typical 2 to 4 months pay + statutory redundancy
              </span>
            </div>

            {/* Tax Exemption Status */}
            <div className="p-3.5 bg-[#F0F5F1] border border-[#BCD0BF] rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-[#3E584B] text-[10px] uppercase font-bold tracking-wider block mb-0.5">
                  Tax Treatment
                </span>
                <span className="text-[18px] font-black text-[#4F7060]">
                  First £30,000 Tax-Free
                </span>
              </div>
              <span className="text-[11px] text-[#5B6577] mt-1.5 leading-tight">
                Under ITEPA 2003 s.403 (PILON taxed separately)
              </span>
            </div>

          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#E2DCCE]">
            <div className="flex items-center gap-2 text-[12px] text-[#5B6577]">
              <span className="text-[15px] flex-shrink-0">🛡️</span>
              <span>
                <strong>Your employer covers the legal fee:</strong> Standard £350 to £750 contribution under s.203.
              </span>
            </div>

            <button
              type="button"
              onClick={handleLaunchCalculator}
              className="px-5 py-2.5 rounded-lg text-[13px] font-bold text-white bg-[#D9603B] hover:bg-[#c25230] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm whitespace-nowrap"
            >
              <span>Calculate my full breakdown →</span>
            </button>
          </div>

        </div>
      )}

      {(!result || parsedSalary <= 0) && (
        <div className="p-4 bg-paper rounded-lg text-center text-[13px] text-[#5B6577]">
          Enter your gross salary above to model your statutory redundancy and typical settlement range.
        </div>
      )}
    </div>
  )
}
