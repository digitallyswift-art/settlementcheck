'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Ga4TelemetryClient } from '@/components/telemetry/Ga4TelemetryClient'
import { trackClientEvent } from '@/lib/telemetry'

interface Props {
  verdict?: string
  offer?: string | number
  salary?: string | number
  years?: string | number
  disputeReason?: string
  sourceUrl?: string
  className?: string
}

function getVerdictFraming(verdict: string, offerNum: number) {
  if (offerNum <= 0) {
    return {
      eyebrow: 'Pre-Offer Strategy Check · s.203(3) ERA 1996',
      heading: 'Get prepared before your employer tables an offer',
      subtext:
        'Speak confidentially with an SRA-regulated employment solicitor about your calculated baseline and exit options.',
      step1Cta: 'Check Solicitor Availability →',
    }
  }
  if (verdict === 'BELOW_MINIMUM') {
    return {
      eyebrow: 'Below Statutory Baseline · Priority Review',
      heading: 'Have an independent solicitor review this shortfall',
      subtext:
        'Your recorded offer sits below your calculated statutory baseline. A specialist SRA-regulated solicitor can review your entitlements before you sign.',
      step1Cta: 'Review This Shortfall With a Solicitor →',
    }
  }
  if (verdict === 'BELOW_TYPICAL') {
    return {
      eyebrow: 'Negotiable Range · Independent Review',
      heading: 'Explore your negotiation options before signing',
      subtext:
        'Your offer sits below typical illustrative ranges. An SRA-regulated solicitor can review your financial terms, notice, and reference wording.',
      step1Cta: 'Explore Options With a Solicitor →',
    }
  }
  return {
    eyebrow: 'Mandatory s.203(3) Certification · 24–48h Turnaround',
    heading: 'Arrange your required independent solicitor sign-off',
    subtext:
      'Under Section 203(3) ERA 1996, a settlement agreement is only legally binding once certified by an independent solicitor. Check tax & restrictive covenants before signing.',
    step1Cta: 'Arrange s.203(3) Solicitor Review →',
  }
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
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactTime, setContactTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [triageId, setTriageId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')

  const cardRef = useRef<HTMLDivElement>(null)
  const step1StartedRef = useRef(false)
  const inViewTrackedRef = useRef(false)

  const offerNum = Number(offer) || 0
  const framing = getVerdictFraming(verdict, offerNum)

  useEffect(() => {
    const el = cardRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !inViewTrackedRef.current) {
          inViewTrackedRef.current = true
          trackClientEvent('intake_card_in_view', { verdict, has_offer: offerNum > 0 })
          observer.disconnect()
        }
      },
      { threshold: 0.35 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [verdict, offerNum])

  function handleStep1Focus() {
    if (!step1StartedRef.current) {
      step1StartedRef.current = true
      Ga4TelemetryClient.trackLeadFunnelStarted('inline_intake_step1', verdict)
      trackClientEvent('intake_step1_started', { verdict, has_offer: offerNum > 0 })
    }
  }

  function handleStep1Continue(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (honeypot) {
      setSubmitted(true)
      return
    }

    if (!name.trim()) {
      setError('Please enter your first name.')
      trackClientEvent('intake_validation_error', { field: 'firstName', step: 1 })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid personal email address.')
      trackClientEvent('intake_validation_error', { field: 'email', step: 1 })
      return
    }

    trackClientEvent('intake_step1_completed', { verdict, has_offer: offerNum > 0 })
    setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (honeypot) {
      setSubmitted(true)
      return
    }

    const cleanedPhone = phone.trim().replace(/[\s\-\(\)]/g, '')
    if (cleanedPhone.length < 9) {
      setError('Please enter a valid UK mobile or telephone number.')
      trackClientEvent('intake_validation_error', { field: 'phone', step: 2 })
      return
    }

    if (!consent) {
      setError('Please tick the consent box to allow an independent solicitor to contact you.')
      trackClientEvent('intake_validation_error', { field: 'consent', step: 2 })
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

      Ga4TelemetryClient.trackLeadCompleted(true)
      trackClientEvent('generate_lead', {
        event_category: 'employee_lead',
        verdict,
        currency: 'GBP',
        value: 150,
      })
      trackClientEvent('lead_submitted', {
        event_category: 'employee_lead',
        verdict,
      })
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
              Thank you, <strong>{name}</strong>. An SRA-regulated employment solicitor is being assigned your calculation summary. You will receive a call during your preferred window (<strong>{contactTime.toLowerCase()}</strong>) to review your settlement agreement terms.
            </p>
            <div className="pt-3 border-t border-[#E2DCCE] mt-4 flex flex-wrap items-center gap-4 text-xs text-[#5B6577]">
              <span>✓ Confirmation sent to {email}</span>
              <span>✓ Strictly confidential</span>
              <span>✓ Standard employer fee contribution applies upon completion</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={cardRef}
      id="solicitor-intake-card"
      className={`bg-white border-2 border-[#0B1F3A] rounded-2xl p-5 sm:p-6 shadow-lg relative overflow-hidden ${className}`}
    >
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F0EBE0] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]">
            {framing.eyebrow}
          </span>
        </div>
        <span className="text-[11px] font-mono text-[#5B6577]">
          Step {step} of 2
        </span>
      </div>

      <div className="mb-4">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0B1F3A] m-0 mb-1.5">
          {framing.heading}
        </h3>
        <p className="text-xs sm:text-sm text-[#5B6577] leading-relaxed m-0">
          {framing.subtext}
        </p>
      </div>

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

      {step === 1 ? (
        <form onSubmit={handleStep1Continue} noValidate className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                First Name <span className="text-[#D9603B]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sarah"
                value={name}
                onFocus={handleStep1Focus}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DCCE] text-sm text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                Personal Email <span className="text-[#D9603B]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. sarah.personal@gmail.com"
                value={email}
                onFocus={handleStep1Focus}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DCCE] text-sm text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer bg-[#D9603B] hover:bg-[#B14A28] shadow-[0_4px_16px_rgba(217,96,59,0.28)]"
          >
            <span>{framing.step1Cta}</span>
          </button>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5B6577] pt-1">
            <span>🔒 Private &amp; never shared with your employer</span>
            <span>⚖️ Employers standardly contribute £350–£500+ +VAT upon completion</span>
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="flex items-center justify-between bg-[#F7F4EE] border border-[#E2DCCE] rounded-lg px-3.5 py-2 text-xs text-[#0B1F3A]">
            <span className="truncate">
              Matching dossier for <strong>{name}</strong> ({email})
            </span>
            <button
              type="button"
              onClick={() => { setError(null); setStep(1) }}
              className="text-[#D9603B] font-semibold hover:underline bg-transparent border-0 cursor-pointer flex-shrink-0 ml-2"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#0B1F3A] mb-1">
                Mobile Phone <span className="text-[#D9603B]">*</span>
              </label>
              <input
                type="tel"
                required
                autoFocus
                placeholder="e.g. 07700 900123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#E2DCCE] text-sm text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

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

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[#E2DCCE] text-[#D9603B] focus:ring-[#D9603B] cursor-pointer"
              />
              <span className="text-xs text-[#5B6577] leading-snug">
                I consent to SettlementCheck securely sharing my calculation summary with one independent SRA-regulated employment solicitor to contact me confidentially. I understand employers standardly provide a capped contribution (£350–£500+ +VAT) upon agreement completion, and work outside that cap or abortive fees remain subject to the solicitor&apos;s terms.
              </span>
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
              submitting
                ? 'bg-[#E2DCCE] text-[#5B6577] cursor-not-allowed'
                : 'bg-[#D9603B] hover:bg-[#B14A28] shadow-[0_4px_16px_rgba(217,96,59,0.28)]'
            }`}
          >
            <span>{submitting ? 'Submitting Case Details…' : 'Confirm Solicitor Match Request →'}</span>
          </button>

          <p className="text-[10px] leading-normal m-0 text-[#8A93A3]">
            SRA Rule 5.1 Notice: SettlementCheck is an independent calculation platform and introducer, not an authorised law firm. Instructed solicitors act independently in your sole interest.
          </p>
        </form>
      )}
    </div>
  )
}
