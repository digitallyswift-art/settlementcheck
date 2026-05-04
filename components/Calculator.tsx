'use client'

import { useState } from 'react'
import { getVerdict, VerdictResult } from '@/lib/calculations'

export interface CalcPayload {
  inputs: {
    salary: string
    years: string
    age: string
    offer: string
    reason: string
    discrimination: string
  }
  result: VerdictResult
}

interface Props {
  onCalculate: (payload: CalcPayload) => void
}

const REASONS = [
  { value: '', label: 'Select a reason…' },
  { value: 'redundancy', label: 'Redundancy' },
  { value: 'dismissal', label: 'Dismissal' },
  { value: 'resignation', label: 'Resignation' },
  { value: 'mutual', label: 'Mutual agreement' },
  { value: 'other', label: 'Other' },
]

interface Errors {
  salary?: string
  years?: string
  age?: string
  offer?: string
  reason?: string
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <span className="text-[12px] text-crimson mt-1">{msg}</span>
}

export default function Calculator({ onCalculate }: Props) {
  const [form, setForm] = useState({
    salary: '',
    years: '',
    age: '',
    offer: '',
    reason: '',
    discrimination: 'no',
  })
  const [errors, setErrors] = useState<Errors>({})

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k as keyof Errors]) setErrors(e => ({ ...e, [k]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.salary || +form.salary < 1000) e.salary = 'Enter your annual salary'
    if (form.years === '' || +form.years < 0) e.years = 'Enter years (0 if under a year)'
    if (!form.age || +form.age < 16 || +form.age > 100) e.age = 'Enter a valid age'
    if (!form.offer || +form.offer < 0) e.offer = 'Enter the offered amount'
    if (!form.reason) e.reason = 'Select a reason'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    const result = getVerdict(+form.salary, +form.years, +form.age, +form.offer, form.reason, form.discrimination)
    onCalculate({ inputs: form, result })
  }

  return (
    <form
      id="calculator-v2"
      onSubmit={submit}
      noValidate
      className="bg-card border border-rule rounded-[16px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)]"
    >
      {/* Header with deep vertical gradient */}
      <div
        className="px-8 py-8 border-b border-rule"
        style={{ background: 'linear-gradient(180deg, #F7F4EE 0%, #E6E0D3 100%)' }}
      >
        <span className="sc-eyebrow text-[11px] text-muted-2">FREE CALCULATOR</span>
        <h3 className="sc-h3 mt-2 text-[26px]">Check your offer</h3>
        <p className="text-[14px] text-muted mt-2">Six questions. Sixty seconds. No email required.</p>
      </div>

      {/* Body */}
      <div className="px-8 py-8 flex flex-col gap-[20px]">
        {/* 2-col grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-5 max-[520px]:grid-cols-1">
          {/* Salary */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink tracking-[-0.005em]">Annual salary</label>
            <div className="input-wrap bg-[#F7F4EE]/50 border-[#E2DCCE] rounded-[8px]">
              <span className="pl-4 pr-1 font-mono text-[14px] text-muted">£</span>
              <input
                type="number"
                inputMode="numeric"
                className="flex-1 border-0 bg-transparent outline-none py-3.5 px-3 text-[15px] text-ink placeholder-muted-2 pl-1.5"
                placeholder="42,000"
                value={form.salary}
                onChange={e => update('salary', e.target.value)}
              />
            </div>
            <FieldError msg={errors.salary} />
          </div>

          {/* Years */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink tracking-[-0.005em]">Years at employer</label>
            <div className="input-wrap bg-[#F7F4EE]/50 border-[#E2DCCE] rounded-[8px]">
              <input
                type="number"
                inputMode="numeric"
                step="0.5"
                className="flex-1 border-0 bg-transparent outline-none py-3.5 px-4 text-[15px] text-ink placeholder-muted-2"
                placeholder="6"
                value={form.years}
                onChange={e => update('years', e.target.value)}
              />
            </div>
            <FieldError msg={errors.years} />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink tracking-[-0.005em]">Your age when leaving</label>
            <div className="input-wrap bg-[#F7F4EE]/50 border-[#E2DCCE] rounded-[8px]">
              <input
                type="number"
                inputMode="numeric"
                className="flex-1 border-0 bg-transparent outline-none py-3.5 px-4 text-[15px] text-ink placeholder-muted-2"
                placeholder="38"
                value={form.age}
                onChange={e => update('age', e.target.value)}
              />
            </div>
            <FieldError msg={errors.age} />
          </div>

          {/* Offer */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink tracking-[-0.005em]">Settlement offered</label>
            <div className="input-wrap bg-[#F7F4EE]/50 border-[#E2DCCE] rounded-[8px]">
              <span className="pl-4 pr-1 font-mono text-[14px] text-muted">£</span>
              <input
                type="number"
                inputMode="numeric"
                className="flex-1 border-0 bg-transparent outline-none py-3.5 px-3 text-[15px] text-ink placeholder-muted-2 pl-1.5"
                placeholder="18,000"
                value={form.offer}
                onChange={e => update('offer', e.target.value)}
              />
            </div>
            <FieldError msg={errors.offer} />
          </div>
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink tracking-[-0.005em]">Reason for leaving</label>
          <div className="input-wrap bg-[#F7F4EE]/50 border-[#E2DCCE] rounded-[8px]">
            <select
              className="sc-select flex-1 border-0 bg-transparent outline-none py-3.5 px-4 text-[15px] text-ink"
              value={form.reason}
              onChange={e => update('reason', e.target.value)}
            >
              {REASONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <FieldError msg={errors.reason} />
        </div>

        {/* Discrimination */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink tracking-[-0.005em] flex items-center">
            Any discrimination involved?
            <span className="sc-tip" data-tip="e.g. age, gender, race, disability, pregnancy">?</span>
          </label>
          <div className="pill-radio" role="radiogroup" aria-label="Discrimination">
            {(['no', 'yes', 'not_sure'] as const).map(v => (
              <button
                key={v}
                type="button"
                className="pill-radio-btn"
                aria-pressed={form.discrimination === v}
                onClick={() => update('discrimination', v)}
              >
                {v === 'no' ? 'No' : v === 'yes' ? 'Yes' : 'Not sure'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 pb-8 flex flex-col gap-4">
        <button type="submit" className="btn-accent w-full py-4 text-[16px] font-semibold rounded-[8px]">
          Calculate my estimate →
        </button>
        <p className="text-[12px] text-muted-2 text-center leading-relaxed px-4">
          Estimate only. Not legal advice. Based on UK statutory rates 2024/25.
        </p>
      </div>
    </form>
  )
}
