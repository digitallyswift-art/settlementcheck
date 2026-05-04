'use client'

import { useState } from 'react'
import { getVerdict, VerdictResult } from '@/lib/calculations'

export interface CalcPayload {
  inputs: {
    salary: string
    yearsNum: string
    monthsNum: string
    age: string
    offer: string
    reason: string
    discrimination: string
    contractualNotice: string
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

// Contractual notice options as weeks for calculation precision
const NOTICE_OPTIONS = [
  { value: '0',  label: 'Statutory only' },
  { value: '4',  label: '1 month' },
  { value: '8',  label: '2 months' },
  { value: '13', label: '3 months' },
  { value: '26', label: '6 months' },
  { value: '52', label: '12 months' },
]

interface Errors {
  salary?: string
  service?: string
  age?: string
  offer?: string
  reason?: string
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <span style={{ fontSize: 12, color: '#C0392B', marginTop: 4, display: 'block' }}>{msg}</span>
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  border: 'none',
  background: 'transparent',
  outline: 'none',
  fontFamily: 'var(--font-sans), Inter, sans-serif',
  fontSize: 15,
  color: '#0B1F3A',
  padding: '12px 14px',
  minWidth: 0,
  MozAppearance: 'textfield' as React.CSSProperties['MozAppearance'],
}

const inputWrapStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  background: 'rgba(255,255,255,0.82)',
  border: '1px solid rgba(11,31,58,0.14)',
  borderRadius: 10,
  backdropFilter: 'blur(2px)',
  transition: 'border-color 150ms ease, box-shadow 150ms ease',
  overflow: 'hidden',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans), Inter, sans-serif',
  fontSize: 13,
  fontWeight: 500,
  color: '#4A5568',
  letterSpacing: '-0.003em',
  marginBottom: 6,
  display: 'block',
}

const prefixStyle: React.CSSProperties = {
  padding: '0 2px 0 14px',
  fontSize: 15,
  fontWeight: 400,
  color: '#9AA3AE',
  flexShrink: 0,
  lineHeight: 1,
  fontFamily: 'var(--font-sans), Inter, sans-serif',
}

const suffixStyle: React.CSSProperties = {
  padding: '0 14px 0 4px',
  fontSize: 13,
  fontWeight: 400,
  color: '#9AA3AE',
  flexShrink: 0,
  lineHeight: 1,
  fontFamily: 'var(--font-sans), Inter, sans-serif',
}

const selectStyle = (hasValue: boolean): React.CSSProperties => ({
  ...inputStyle,
  paddingLeft: 14,
  width: '100%',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `linear-gradient(45deg, transparent 50%, #9AA3AE 50%), linear-gradient(135deg, #9AA3AE 50%, transparent 50%)`,
  backgroundPosition: 'calc(100% - 16px) 50%, calc(100% - 11px) 50%',
  backgroundSize: '5px 5px, 5px 5px',
  backgroundRepeat: 'no-repeat',
  paddingRight: 36,
  color: hasValue ? '#0B1F3A' : '#9AA3AE',
})

export default function Calculator({ onCalculate }: Props) {
  const [form, setForm] = useState({
    salary: '',
    yearsNum: '',
    monthsNum: '',
    age: '',
    offer: '',
    reason: '',
    discrimination: 'no',
    contractualNotice: '0',
  })
  const [errors, setErrors] = useState<Errors>({})
  const [focused, setFocused] = useState<string | null>(null)

  const update = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    // Clear service error when either years or months changes
    const serviceKey = (k === 'yearsNum' || k === 'monthsNum') ? 'service' : k
    if (errors[serviceKey as keyof Errors]) setErrors(e => ({ ...e, [serviceKey]: undefined }))
  }

  const validate = (): boolean => {
    const e: Errors = {}
    if (!form.salary || +form.salary < 1000) e.salary = 'Enter your annual salary'
    const y = form.yearsNum === '' ? NaN : +form.yearsNum
    const m = form.monthsNum === '' ? NaN : +form.monthsNum
    if ((isNaN(y) && isNaN(m)) || (!isNaN(y) && y < 0) || (!isNaN(m) && (m < 0 || m > 11))) {
      e.service = 'Enter years and/or months (0 years 0 months if under a month)'
    }
    if (!form.age || +form.age < 16 || +form.age > 100) e.age = 'Enter a valid age'
    if (!form.offer || +form.offer < 0) e.offer = 'Enter the offered amount'
    if (!form.reason) e.reason = 'Select a reason'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    const totalMonths = (+form.yearsNum || 0) * 12 + (+form.monthsNum || 0)
    const contractualNoticeWeeks = +form.contractualNotice
    const result = getVerdict(
      +form.salary,
      totalMonths,
      +form.age,
      +form.offer,
      form.reason,
      form.discrimination,
      contractualNoticeWeeks,
    )
    onCalculate({ inputs: form, result })
  }

  const wrapStyle = (field: string): React.CSSProperties => ({
    ...inputWrapStyle,
    borderColor: focused === field ? '#0B1F3A' : errors[field as keyof Errors] ? '#C0392B' : 'rgba(11,31,58,0.14)',
    boxShadow: focused === field ? '0 0 0 3px rgba(11,31,58,0.08)' : 'none',
  })

  // Service field gets error highlight when either sub-field is focused or errored
  const serviceWrap = (subField: string): React.CSSProperties => ({
    ...inputWrapStyle,
    borderColor: focused === subField ? '#0B1F3A' : errors.service ? '#C0392B' : 'rgba(11,31,58,0.14)',
    boxShadow: focused === subField ? '0 0 0 3px rgba(11,31,58,0.08)' : 'none',
  })

  return (
    <form
      id="calculator-v2"
      onSubmit={submit}
      noValidate
      style={{
        borderRadius: 20,
        border: '1px solid rgba(11,31,58,0.10)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px -12px rgba(11,31,58,0.22), 0 8px 24px -6px rgba(11,31,58,0.10)',
        background: 'linear-gradient(170deg, #F5F1E9 0%, #EDE8DF 30%, #E8E2D8 60%, #F0EDE6 100%)',
      }}
    >
      {/* Header */}
      <div style={{ padding: '28px 32px 22px' }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-sans), Inter, sans-serif',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#8A93A3',
            marginBottom: 8,
          }}
        >
          Free Calculator
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-serif), "Source Serif 4", Georgia, serif',
            fontWeight: 460,
            fontSize: 28,
            lineHeight: 1.2,
            letterSpacing: '-0.014em',
            color: '#0B1F3A',
            margin: '0 0 5px',
          }}
        >
          Check your offer
        </h3>
        <p style={{ fontSize: 14, color: '#6B7280', margin: 0, lineHeight: 1.45 }}>
          Seven questions. Sixty seconds. No email required.
        </p>
      </div>

      {/* Form body */}
      <div style={{ padding: '4px 32px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Row 1: Salary + Age */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }} className="calc-responsive-grid">

          {/* Salary */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Annual salary</label>
            <div style={wrapStyle('salary')}>
              <span style={prefixStyle}>£</span>
              <input
                type="text"
                inputMode="numeric"
                style={inputStyle}
                placeholder="42,000"
                value={form.salary}
                onChange={e => update('salary', e.target.value)}
                onFocus={() => setFocused('salary')}
                onBlur={() => setFocused(null)}
              />
            </div>
            <FieldError msg={errors.salary} />
          </div>

          {/* Age */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Your age when leaving</label>
            <div style={wrapStyle('age')}>
              <input
                type="text"
                inputMode="numeric"
                style={{ ...inputStyle, paddingLeft: 14 }}
                placeholder="38"
                value={form.age}
                onChange={e => update('age', e.target.value)}
                onFocus={() => setFocused('age')}
                onBlur={() => setFocused(null)}
              />
            </div>
            <FieldError msg={errors.age} />
          </div>
        </div>

        {/* Row 2: Length of service (years + months side by side) */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Length of service</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 10px' }}>
            <div style={serviceWrap('yearsNum')}>
              <input
                type="text"
                inputMode="numeric"
                style={{ ...inputStyle, paddingLeft: 14 }}
                placeholder="6"
                value={form.yearsNum}
                onChange={e => update('yearsNum', e.target.value)}
                onFocus={() => setFocused('yearsNum')}
                onBlur={() => setFocused(null)}
              />
              <span style={suffixStyle}>yrs</span>
            </div>
            <div style={serviceWrap('monthsNum')}>
              <input
                type="text"
                inputMode="numeric"
                style={{ ...inputStyle, paddingLeft: 14 }}
                placeholder="4"
                value={form.monthsNum}
                onChange={e => update('monthsNum', e.target.value)}
                onFocus={() => setFocused('monthsNum')}
                onBlur={() => setFocused(null)}
              />
              <span style={suffixStyle}>mths</span>
            </div>
          </div>
          <FieldError msg={errors.service} />
        </div>

        {/* Row 3: Offer + Contractual notice */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 16px' }} className="calc-responsive-grid">

          {/* Offer */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={labelStyle}>Settlement offered</label>
            <div style={wrapStyle('offer')}>
              <span style={prefixStyle}>£</span>
              <input
                type="text"
                inputMode="numeric"
                style={inputStyle}
                placeholder="18,000"
                value={form.offer}
                onChange={e => update('offer', e.target.value)}
                onFocus={() => setFocused('offer')}
                onBlur={() => setFocused(null)}
              />
            </div>
            <FieldError msg={errors.offer} />
          </div>

          {/* Contractual notice */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
              Notice period in your contract
              <span
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 16, height: 16, borderRadius: '50%',
                  border: '1px solid rgba(11,31,58,0.2)', color: '#6B7280',
                  fontSize: 10, fontWeight: 600, cursor: 'help',
                }}
                title="From your employment contract or offer letter. If unsure, choose Statutory only."
              >
                ?
              </span>
            </label>
            <div style={wrapStyle('contractualNotice')}>
              <select
                style={selectStyle(true)}
                value={form.contractualNotice}
                onChange={e => update('contractualNotice', e.target.value)}
                onFocus={() => setFocused('contractualNotice')}
                onBlur={() => setFocused(null)}
              >
                {NOTICE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={labelStyle}>Reason for leaving</label>
          <div style={wrapStyle('reason')}>
            <select
              style={selectStyle(!!form.reason)}
              value={form.reason}
              onChange={e => update('reason', e.target.value)}
              onFocus={() => setFocused('reason')}
              onBlur={() => setFocused(null)}
            >
              {REASONS.map(r => (
                <option key={r.value} value={r.value} style={{ color: r.value ? '#0B1F3A' : '#9AA3AE' }}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <FieldError msg={errors.reason} />
        </div>

        {/* Discrimination */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ ...labelStyle, display: 'flex', alignItems: 'center', gap: 6 }}>
            Any discrimination involved?
            <span
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 16, height: 16, borderRadius: '50%',
                border: '1px solid rgba(11,31,58,0.2)', color: '#6B7280',
                fontSize: 10, fontWeight: 600, cursor: 'help',
              }}
              title="Discrimination includes being treated unfairly because of age, gender, race, disability, pregnancy, religion, or sexual orientation. These claims are uncapped and can significantly increase your settlement value."
            >
              ?
            </span>
          </label>
          <p style={{ fontSize: 12, color: '#6B7280', marginTop: 4, marginBottom: 8, lineHeight: 1.5 }}>
            Were you treated unfairly because of age, gender, race, disability, pregnancy, or another protected characteristic? If you&apos;re unsure, choose &ldquo;Not sure&rdquo; and a solicitor will assess it.
          </p>
          <div
            role="radiogroup"
            aria-label="Discrimination"
            style={{
              display: 'flex',
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(11,31,58,0.14)',
              borderRadius: 999,
              padding: 4,
              gap: 2,
            }}
          >
            {(['no', 'yes', 'not_sure'] as const).map(v => {
              const selected = form.discrimination === v
              return (
                <button
                  key={v}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => update('discrimination', v)}
                  style={{
                    flex: 1,
                    border: 'none',
                    background: selected ? '#0B1F3A' : 'transparent',
                    color: selected ? '#ffffff' : '#6B7280',
                    borderRadius: 999,
                    fontFamily: 'var(--font-sans), Inter, sans-serif',
                    fontSize: 14,
                    fontWeight: selected ? 600 : 400,
                    padding: '9px 8px',
                    cursor: 'pointer',
                    transition: 'background 150ms ease, color 150ms ease',
                    textAlign: 'center',
                  }}
                >
                  {v === 'no' ? 'No' : v === 'yes' ? 'Yes' : 'Not sure'}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '0 32px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="submit"
          style={{
            width: '100%',
            background: '#D9603B',
            border: 'none',
            color: '#fff',
            fontFamily: 'var(--font-sans), Inter, sans-serif',
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: '-0.005em',
            padding: '15px 24px',
            borderRadius: 10,
            cursor: 'pointer',
            transition: 'background 160ms ease, box-shadow 160ms ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#B14A28'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(217,96,59,0.35)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#D9603B'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Calculate my estimate →
        </button>
        <p style={{ fontSize: 11, color: '#9AA3AE', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          Estimate only. Not legal advice. Based on UK statutory rates 2025/26.
        </p>
      </div>
    </form>
  )
}
