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
  return <span className="text-[12px] text-crimson mt-1 block">{msg}</span>
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
      style={{
        background: '#fff',
        borderRadius: 20,
        border: '1px solid #E2DCCE',
        overflow: 'hidden',
        boxShadow: '0 8px 40px -8px rgba(11,31,58,0.14), 0 2px 8px -2px rgba(11,31,58,0.06)',
      }}
    >
      {/* Gradient header */}
      <div
        style={{
          background: 'linear-gradient(160deg, #F7F4EE 0%, #EDE8DE 55%, #E3DCD0 100%)',
          padding: '32px 36px 28px',
          borderBottom: '1px solid #E2DCCE',
        }}
      >
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-sans), Inter, sans-serif',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#8A93A3',
            marginBottom: 10,
          }}
        >
          Free Calculator
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif), "Source Serif 4", Georgia, serif',
            fontWeight: 460,
            fontSize: 26,
            lineHeight: 1.2,
            letterSpacing: '-0.012em',
            color: '#0B1F3A',
            margin: '0 0 6px',
          }}
        >
          Check your offer
        </h3>
        <p style={{ fontSize: 14, color: '#5B6577', margin: 0, lineHeight: 1.45 }}>
          Six questions. Sixty seconds. No email required.
        </p>
      </div>

      {/* Form body */}
      <div style={{ padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* 2-col grid */}
        <div className="calc-grid">
          {/* Salary */}
          <div className="calc-field">
            <label className="calc-label">Annual salary</label>
            <div className="calc-input-wrap">
              <span className="calc-prefix">£</span>
              <input
                type="text"
                inputMode="numeric"
                className="calc-input"
                placeholder="42,000"
                value={form.salary}
                onChange={e => update('salary', e.target.value)}
              />
            </div>
            <FieldError msg={errors.salary} />
          </div>

          {/* Years */}
          <div className="calc-field">
            <label className="calc-label">Years at employer</label>
            <div className="calc-input-wrap">
              <input
                type="text"
                inputMode="decimal"
                className="calc-input"
                placeholder="6"
                value={form.years}
                onChange={e => update('years', e.target.value)}
              />
            </div>
            <FieldError msg={errors.years} />
          </div>

          {/* Age */}
          <div className="calc-field">
            <label className="calc-label">Your age when leaving</label>
            <div className="calc-input-wrap">
              <input
                type="text"
                inputMode="numeric"
                className="calc-input"
                placeholder="38"
                value={form.age}
                onChange={e => update('age', e.target.value)}
              />
            </div>
            <FieldError msg={errors.age} />
          </div>

          {/* Offer */}
          <div className="calc-field">
            <label className="calc-label">Settlement offered</label>
            <div className="calc-input-wrap">
              <span className="calc-prefix">£</span>
              <input
                type="text"
                inputMode="numeric"
                className="calc-input"
                placeholder="18,000"
                value={form.offer}
                onChange={e => update('offer', e.target.value)}
              />
            </div>
            <FieldError msg={errors.offer} />
          </div>
        </div>

        {/* Reason */}
        <div className="calc-field">
          <label className="calc-label">Reason for leaving</label>
          <div className="calc-input-wrap">
            <select
              className="calc-input calc-select"
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
        <div className="calc-field">
          <label className="calc-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            Any discrimination involved?
            <span className="sc-tip" data-tip="e.g. age, gender, race, disability, pregnancy">?</span>
          </label>
          <div className="calc-pill-radio" role="radiogroup" aria-label="Discrimination">
            {(['no', 'yes', 'not_sure'] as const).map(v => (
              <button
                key={v}
                type="button"
                className="calc-pill-btn"
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
      <div style={{ padding: '0 36px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#D9603B',
            border: '1px solid #D9603B',
            color: '#fff',
            fontFamily: 'var(--font-sans), Inter, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: '-0.005em',
            padding: '16px 24px',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'background 160ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#B14A28')}
          onMouseLeave={e => (e.currentTarget.style.background = '#D9603B')}
        >
          Calculate my estimate →
        </button>
        <p
          style={{
            fontSize: 12,
            color: '#8A93A3',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.5,
            padding: '0 8px',
          }}
        >
          Estimate only. Not legal advice. Based on UK statutory rates 2024/25.
        </p>
      </div>
    </form>
  )
}
