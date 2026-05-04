'use client'

import { useState } from 'react'

interface Props {
  verdict: string
  offer: string
  salary: string
  years: string
}

export default function LeadForm({ verdict, offer, salary, years }: Props) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contact, setContact] = useState('morning')
  const [form, setForm] = useState({ firstName: '', email: '', phone: '', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.firstName.trim()) e.firstName = 'Please enter your first name'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Please enter a valid email address'
    if (!form.consent) e.consent = 'You must agree to be matched before continuing'
    return e
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    try {
      await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          email: form.email,
          phone: form.phone,
          preferredContactTime: contact,
          verdict,
          offer_amount: offer,
          salary,
          years_service: years,
        }),
      })
      setSubmitted(true)
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'border border-rule rounded-xl px-4 py-3 w-full text-sm focus:ring-2 focus:ring-ink focus:border-transparent outline-none transition bg-white text-ink placeholder:text-muted-2'

  if (submitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-paper-2 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-ink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">
          You&apos;re matched. A solicitor will contact you within 24 hours.
        </h3>
        <p className="text-sm text-muted">
          Check your email — we&apos;ve sent you a confirmation with next steps.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* First name */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">First name</label>
        <input
          type="text"
          className={inputClass}
          placeholder="e.g. Sarah"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        {errors.firstName && <p className="text-xs text-crimson mt-1">{errors.firstName}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">Email address</label>
        <input
          type="email"
          className={inputClass}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && <p className="text-xs text-crimson mt-1">{errors.email}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">Phone number <span className="text-muted-2 font-normal">(optional)</span></label>
        <input
          type="tel"
          className={inputClass}
          placeholder="07700 900000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      {/* Contact time */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">Preferred contact time</label>
        <div className="flex gap-2">
          {(['morning', 'afternoon', 'evening'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setContact(t)}
              className={`px-4 py-2 rounded-full text-sm border capitalize transition-all ${
                contact === t
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-muted border-rule hover:border-ink hover:text-ink'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Consent */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-0.5 w-4 h-4 accent-coral flex-shrink-0"
            checked={form.consent}
            onChange={(e) => setForm({ ...form, consent: e.target.checked })}
          />
          <span className="text-sm text-muted leading-relaxed">
            I agree to be matched with an employment solicitor regarding my settlement agreement. I understand this
            service is free and my employer pays the legal fees.
          </span>
        </label>
        {errors.consent && <p className="text-xs text-crimson mt-1">{errors.consent}</p>}
      </div>

      {errors.form && <p className="text-sm text-crimson">{errors.form}</p>}

      <button
        type="submit"
        disabled={loading}
        className="btn-accent w-full py-4 px-6 text-base disabled:opacity-60"
      >
        {loading ? 'Submitting...' : 'Get my free solicitor match →'}
      </button>
    </form>
  )
}
