'use client'

import React, { useState } from 'react'
import { Ga4TelemetryClient } from '@/components/telemetry/Ga4TelemetryClient'

interface Props {
  verdict?: string
  offer?: string | number
  salary?: string | number
  years?: string | number
  disputeReason?: string
  sourceUrl?: string
  className?: string
}

export default function InlineSolicitorIntakeCard({
  verdict = 'unknown',
  offer = '',
  salary = '',
  years = '',
  disputeReason = 'redundancy',
  sourceUrl = '/results/',
  className = '',
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactTime, setContactTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [triageId, setTriageId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Honeypot field for bot suppression
  const [honeypot, setHoneypot] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    // Bot trap
    if (honeypot) {
      setSubmitted(true)
      return
    }

    if (!name.trim()) {
      setError('Please provide your full name.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    const cleanedPhone = phone.trim().replace(/[\s\-\(\)]/g, '')
    if (cleanedPhone.length < 9) {
      setError('Please enter a valid UK mobile or telephone number.')
      return
    }

    if (!consent) {
      setError('Please tick the consent box to allow an independent solicitor to contact you.')
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          contactTime,
          verdict,
          offerAmount: offer ? Number(offer) : null,
          salary: salary ? Number(salary) : null,
          monthsService: years ? Number(years) * 12 : null,
          disputeReason,
          consent: true,
          gdpr_consent: true,
          sourceUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit enquiry. Please try again.')
      }

      const assignedTriageId = data.triageId || 'SC-TR-' + Math.floor(1000 + Math.random() * 9000)
      setTriageId(assignedTriageId)
      setSubmitted(true)

      // Fire standard GA4 and dataLayer conversion telemetry
      Ga4TelemetryClient.trackLeadCompleted(true)

      const w = window as any
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'generate_lead', {
          event_category: 'employee_lead',
          verdict,
          currency: 'GBP',
          value: 150,
        })
        w.gtag('event', 'lead_submitted', {
          event_category: 'employee_lead',
          verdict,
        })
      }
      if (Array.isArray(w.dataLayer)) {
        w.dataLayer.push({
          event: 'generate_lead',
          event_category: 'employee_lead',
          verdict,
          currency: 'GBP',
          value: 150,
        })
        w.dataLayer.push({
          event: 'lead_submitted',
          verdict,
        })
      }
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className={`bg-[#F7F4EE] border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 text-[#0B1F3A] ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <svg className="w-6 h-6 text-[#D9603B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2">
            <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-[#0B1F3A] text-white">
              Intake Reference: {triageId}
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B1F3A] m-0">
              Your Case Briefing Has Been Logged
            </h3>
            <p className="text-sm text-[#5B6577] leading-relaxed m-0">
              Thank you, <strong>{name}</strong>. An SRA-regulated employment solicitor is being assigned your calculation dossier. You will receive a call during your preferred window (<strong>{contactTime.toLowerCase()}</strong>) to review your settlement agreement terms and discuss any potential shortfall.
            </p>
            <div className="pt-3 border-t border-[#E2DCCE] mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5B6577]">
              <span>✓ Confirmation sent to {email}</span>
              <span>✓ 100% confidential</span>
              <span>✓ Standard employer fee contribution applies</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      id="solicitor-intake-card"
      className={`bg-white border-2 border-[#0B1F3A] rounded-2xl p-5 sm:p-7 shadow-lg relative overflow-hidden ${className}`}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EBE0] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]">
            Statutory Legal Advice · s.203(3) ERA 1996
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#5B6577]">
          SRA-Regulated Solicitors
        </span>
      </div>

      <div className="mb-5">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B1F3A] m-0 mb-1.5">
          Have an Independent Solicitor Review Your Offer
        </h3>
        <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed m-0">
          Under Section 203(3) of the Employment Rights Act 1996, your settlement agreement is only legally binding once certified by an independent solicitor. Employers standardly provide a capped fee contribution (typically <strong>£350 to £500+ +VAT</strong>) paid directly to your solicitor upon completion.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Honeypot */}
        <input
          type="text"
          name="website_hp"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
              Full Name <span className="text-[#D9603B]">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DCCE] text-sm text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
            />
          </div>

          {/* Personal Email */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
              Personal Email <span className="text-[#D9603B]">*</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. sarah.personal@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DCCE] text-sm text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
              Mobile Phone <span className="text-[#D9603B]">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. 07700 900123"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DCCE] text-sm text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
            />
          </div>

          {/* Preferred Call Time */}
          <div>
            <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
              Preferred Callback Time
            </label>
            <div className="grid grid-cols-3 gap-1.5 pt-0.5">
              {(['Morning', 'Afternoon', 'Evening'] as const).map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setContactTime(slot)}
                  className={`py-2 px-1 text-center text-xs font-medium rounded-lg border transition cursor-pointer ${
                    contactTime === slot
                      ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                      : 'bg-white text-[#0B1F3A] border-[#E2DCCE] hover:bg-[#F7F4EE]'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Confidentiality Reminder */}
        <p className="text-[11px] text-[#5B6577] m-0 italic">
          Tip: Always use your private personal email and phone so your current employer cannot monitor this communication.
        </p>

        {/* Consent Checkbox (UK GDPR Art. 6 & Art. 9) */}
        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[#E2DCCE] text-[#D9603B] focus:ring-[#D9603B] cursor-pointer"
            />
            <span className="text-xs text-[#5B6577] leading-snug">
              I consent to SettlementCheck securely sharing my calculation summary with an independent SRA-regulated employment solicitor to contact me for a confidential case review.
            </span>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Action Button */}
        <div>
          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              submitting
                ? 'bg-[#E2DCCE] text-[#5B6577] cursor-not-allowed'
                : 'bg-[#D9603B] hover:bg-[#B14A28] shadow-[0_4px_16px_rgba(217,96,59,0.28)] hover:shadow-[0_6px_20px_rgba(217,96,59,0.36)]'
            }`}
          >
            <span>{submitting ? 'Submitting Case Details…' : 'Request Independent Solicitor Match →'}</span>
          </button>
        </div>

        {/* Regulatory Disclosure (SRA Rule 5.1 & CAP Code) */}
        <div className="pt-2 border-t border-[#F0EBE0] text-[11px] text-[#8A93A3] space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>🔒 100% Confidential</span>
            <span>⚖️ Independent SRA-regulated solicitors</span>
            <span>💼 Standard employer fee convention applies</span>
          </div>
          <p className="text-[10px] leading-normal m-0 pt-1 text-[#8A93A3]">
            SettlementCheck is an independent calculation platform and introducer, not a law firm. We introduce you to SRA-regulated solicitors who act independently in your best interests.
          </p>
        </div>
      </form>
    </div>
  )
}
