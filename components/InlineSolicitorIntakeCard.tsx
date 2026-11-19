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
  disputeReasonLabel?: string
  sourceUrl?: string
  className?: string
  saveParams?: Record<string, string | number>
  resultSummary?: {
    minimum: number
    typicalLow: number
    typicalHigh: number
    typicalHighUncapped: boolean
    estimatedNet: number
  }
}

function getVerdictFraming(
  verdict: string,
  offerNum: number,
  resultSummary?: Props['resultSummary']
) {
  if (offerNum <= 0) {
    return {
      heading: 'Expecting an offer? Know where you stand first',
      subtext:
        'Speak privately with an independent employment solicitor about your baseline and what to watch out for before anything is put in writing.',
      cta: 'Check my position with a solicitor →',
    }
  }
  if (verdict === 'BELOW_MINIMUM') {
    const shortfall = resultSummary ? Math.max(0, Math.round(resultSummary.minimum - offerNum)) : 0
    const formattedShortfall = shortfall > 0 ? `£${shortfall.toLocaleString('en-GB')}` : ''
    return {
      heading: formattedShortfall
        ? `Why is your offer ${formattedShortfall} below the legal minimum?`
        : 'Why is your offer below the legal minimum?',
      subtext:
        'An independent SRA-regulated employment solicitor can check your notice pay, statutory redundancy, and accrued holiday pay before you decide.',
      cta: formattedShortfall
        ? `Check this ${formattedShortfall} gap with a solicitor →`
        : 'Check this gap with a solicitor →',
    }
  }
  if (verdict === 'BELOW_TYPICAL') {
    return {
      heading: 'Could you be leaving money on the table?',
      subtext:
        'First offers are often a starting point. An independent solicitor can review your figures, tax-free split, and room to negotiate.',
      cta: 'Check my options with a solicitor →',
    }
  }
  return {
    heading: 'The numbers add up. What about the fine print?',
    subtext:
      'In the UK, a settlement agreement only becomes legally valid once an independent solicitor signs it, checking your tax-free split, reference, and job restrictions.',
    cta: 'Check my terms & sign off →',
  }
}

export default function InlineSolicitorIntakeCard({
  verdict = 'unknown',
  offer = '',
  salary = '',
  years = '',
  disputeReason = 'redundancy',
  disputeReasonLabel = '',
  sourceUrl = '/results/',
  className = '',
  saveParams,
  resultSummary,
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
  const [honeypot, setHoneypot] = useState('')

  // Secondary action: Email my breakdown (lives independently below the primary card)
  const [emailPanelOpen, setEmailPanelOpen] = useState(false)
  const [saveEmail, setSaveEmail] = useState('')
  const [emailSubmitting, setEmailSubmitting] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const cardRef = useRef<HTMLDivElement>(null)
  const formStartedRef = useRef(false)
  const inViewTrackedRef = useRef(false)

  const offerNum = Number(offer) || 0
  const framing = getVerdictFraming(verdict, offerNum, resultSummary)

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

  function handleFormFocus() {
    if (!formStartedRef.current) {
      formStartedRef.current = true
      Ga4TelemetryClient.trackLeadFunnelStarted('inline_intake_step1', verdict)
      trackClientEvent('intake_step1_started', { verdict, has_offer: offerNum > 0 })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
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

    const cleanedPhone = phone.trim().replace(/[\s\-\(\)]/g, '')
    if (cleanedPhone.length < 9) {
      setError('Please enter a valid UK mobile or telephone number.')
      trackClientEvent('intake_validation_error', { field: 'phone', step: 1 })
      return
    }

    if (!consent) {
      setError('Please tick the box so an independent solicitor can contact you.')
      trackClientEvent('intake_validation_error', { field: 'consent', step: 1 })
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
        throw new Error(data.error || 'Could not send your request. Please try again.')
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please check your details and try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEmailResultsOnly(e: React.FormEvent) {
    e.preventDefault()
    setEmailError(null)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!saveEmail.trim() || !emailRegex.test(saveEmail.trim())) {
      setEmailError('Please enter a valid personal email address.')
      trackClientEvent('intake_validation_error', { field: 'email', step: 'email_only' })
      return
    }
    setEmailSubmitting(true)
    try {
      const res = await fetch('/api/save-results/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: saveEmail.trim().toLowerCase(),
          ...(saveParams || { salary, yearsNum: years, offer }),
          verdict,
          ...(resultSummary || {}),
        }),
      })
      if (!res.ok) throw new Error('Failed to send results.')
      trackClientEvent('results_emailed_self_serve', { verdict, has_offer: offerNum > 0 })
      setEmailSent(true)
    } catch {
      setEmailError('Could not send your summary right now. Please try again.')
    } finally {
      setEmailSubmitting(false)
    }
  }

  // Attached calculation chip text
  const attachedSummaryParts: string[] = []
  if (offerNum > 0) {
    attachedSummaryParts.push(`£${Math.round(offerNum).toLocaleString('en-GB')} offer`)
    if (resultSummary && resultSummary.estimatedNet > 0) {
      attachedSummaryParts.push(`Est. £${Math.round(resultSummary.estimatedNet).toLocaleString('en-GB')} take-home`)
    }
  } else if (resultSummary && resultSummary.minimum > 0) {
    attachedSummaryParts.push(`£${Math.round(resultSummary.minimum).toLocaleString('en-GB')} legal minimum`)
  }
  if (disputeReasonLabel) {
    attachedSummaryParts.push(disputeReasonLabel)
  }

  if (submitted) {
    return (
      <div className={className}>
        <div
          id="solicitor-intake-card"
          className="bg-white border border-[#0B1F3A] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(11,31,58,0.08)] text-[#0B1F3A]"
        >
          <div className="h-1.5 bg-[#0B1F3A]" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-[#D9603B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#5B6577]">
                  Reference: {triageId}
                </div>
                <h3 className="font-serif text-[21px] font-bold text-[#0B1F3A] m-0 leading-snug">
                  Request received, {name}.
                </h3>
                <p className="text-[14px] text-[#5B6577] leading-[1.55] m-0">
                  Your summary has been passed to <strong>one</strong> SRA-regulated employment solicitor. Expect a confidential call during your preferred <strong>{contactTime.toLowerCase()}</strong> window.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-[#EFEAE0]">
              <h4 className="font-serif text-[16px] font-bold text-[#0B1F3A] m-0 mb-2.5">
                Helpful to have ready for your call
              </h4>
              <ul className="m-0 pl-4 space-y-2 text-[13px] text-[#5B6577] leading-[1.55]">
                <li>Your employment contract (to verify notice period, bonus, and any post-termination restrictions).</li>
                <li>
                  {offerNum > 0
                    ? 'Your draft settlement agreement or written offer, including any date your employer has mentioned.'
                    : 'Any notes from discussions so far, so your solicitor can advise on next steps.'}
                </li>
                <li>Confirmation sent to <strong className="text-[#0B1F3A]">{email}</strong>. Your employer is never contacted.</li>
              </ul>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#EFEAE0] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="text-[13px] font-semibold text-[#0B1F3A] underline underline-offset-2 hover:text-[#D9603B] bg-transparent border-0 p-0 cursor-pointer"
              >
                Print or save PDF copy
              </button>
              <span className="text-[12px] text-[#5B6577]">No obligation</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* PRIMARY ACTION CARD */}
      <div
        ref={cardRef}
        id="solicitor-intake-card"
        className="bg-white border border-[#D8D2C6] rounded-2xl overflow-hidden shadow-[0_12px_32px_rgba(11,31,58,0.08)]"
      >
        <div className="h-1.5 bg-[#0B1F3A]" />

        <div className="p-5 sm:p-6">
          <h2 className="font-serif text-[21px] sm:text-[22px] font-bold text-[#0B1F3A] m-0 mb-1.5 leading-[1.25]">
            {framing.heading}
          </h2>

          <p className="text-[14px] text-[#5B6577] leading-[1.55] m-0 mb-3.5">
            {framing.subtext}
          </p>

          {/* Attached Calculation Summary Chip */}
          {attachedSummaryParts.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F7F4EE] border border-[#E2DCCE] mb-4 text-[12px] text-[#0B1F3A]">
              <span className="font-semibold text-[#D9603B] shrink-0">Attached:</span>
              <span className="truncate font-medium">{attachedSummaryParts.join(' · ')}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-3">
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

            <div>
              <label htmlFor="sc-first-name" className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                First name <span className="text-[#D9603B]">*</span>
              </label>
              <input
                id="sc-first-name"
                type="text"
                required
                autoComplete="given-name"
                placeholder="e.g. Sarah"
                value={name}
                onFocus={handleFormFocus}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D2C6] text-[15px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="sc-personal-email" className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                Personal email <span className="text-[#D9603B]">*</span>
              </label>
              <input
                id="sc-personal-email"
                type="email"
                required
                autoComplete="email"
                placeholder="e.g. sarah@gmail.com (not work email)"
                value={email}
                onFocus={handleFormFocus}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D2C6] text-[15px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="sc-phone" className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                UK mobile or telephone <span className="text-[#D9603B]">*</span>
              </label>
              <input
                id="sc-phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="e.g. 07700 900123"
                value={phone}
                onFocus={handleFormFocus}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D8D2C6] text-[15px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <span className="block text-[13px] font-semibold text-[#0B1F3A] mb-1">
                Best time to call
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['Morning', 'Afternoon', 'Evening'] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setContactTime(slot)}
                    className={`py-2 px-2 text-center text-[13px] font-semibold rounded-lg border transition cursor-pointer ${
                      contactTime === slot
                        ? 'bg-[#0B1F3A] text-white border-[#0B1F3A]'
                        : 'bg-white text-[#0B1F3A] border-[#D8D2C6] hover:bg-[#F7F4EE]'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-[#D8D2C6] accent-[#D9603B] text-[#D9603B] focus:ring-[#D9603B] cursor-pointer shrink-0"
                />
                <span className="text-[13px] text-[#2B3445] leading-[1.45]">
                  I agree to share my summary with one independent SRA-regulated employment solicitor for a confidential call.
                </span>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-[#FBF0EE] border border-[#D9A99E] rounded-lg text-[13px] text-[#A8341F]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 px-5 rounded-xl text-white font-bold text-[15px] flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
                submitting
                  ? 'bg-[#E2DCCE] text-[#5B6577] cursor-not-allowed'
                  : 'bg-[#D9603B] hover:bg-[#B14A28] shadow-[0_4px_16px_rgba(217,96,59,0.28)]'
              }`}
            >
              <span>{submitting ? 'Sending your request' : framing.cta}</span>
            </button>

            <div className="pt-2.5 border-t border-[#EFEAE0] text-[12px] text-[#5B6577] leading-[1.5] space-y-1">
              <p className="m-0">
                <strong className="text-[#0B1F3A]">Total privacy:</strong> Sent to one SRA-regulated solicitor only. Your employer is never contacted.
              </p>
              <p className="m-0">
                <strong className="text-[#0B1F3A]">Legal fees:</strong> Employers usually contribute £350 to £500+ (+VAT) on completion.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* SECONDARY ACTION: SUBORDINATE INLINE EMAIL CAPTURE */}
      <div className="bg-white/90 border border-[#E2DCCE] rounded-xl p-4">
        {emailSent ? (
          <div className="space-y-1">
            <div className="text-[13px] font-bold text-[#0B1F3A]">
              Figures emailed to {saveEmail}
            </div>
            <p className="text-[12px] text-[#5B6577] leading-[1.5] m-0">
              Sent from <strong>team@settlementcheck.co.uk</strong>. Check Spam if it does not arrive within a minute.
            </p>
          </div>
        ) : !emailPanelOpen ? (
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#0B1F3A] m-0">
                Not ready to speak to anyone yet?
              </p>
              <p className="text-[12px] text-[#5B6577] m-0 mt-0.5">
                Send this breakdown to your inbox for later.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEmailPanelOpen(true)
                  trackClientEvent('intake_mode_switched', { to: 'email_only', verdict })
                }}
                className="px-3 py-2 rounded-lg bg-[#F7F4EE] hover:bg-[#EFEAE0] text-[#0B1F3A] text-[13px] font-semibold border border-[#D8D2C6] transition-colors cursor-pointer whitespace-nowrap"
              >
                Email my figures
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-[12px] text-[#5B6577] hover:text-[#0B1F3A] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer whitespace-nowrap"
              >
                Print
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailResultsOnly} noValidate className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="sc-email-only" className="text-[13px] font-semibold text-[#0B1F3A]">
                Email my figures to myself
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmailPanelOpen(false)
                  setEmailError(null)
                }}
                className="text-[12px] text-[#5B6577] hover:text-[#0B1F3A] bg-transparent border-0 p-0 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex gap-2">
              <input
                id="sc-email-only"
                type="email"
                required
                autoFocus
                placeholder="Personal email address"
                value={saveEmail}
                onChange={(e) => setSaveEmail(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-[#D8D2C6] text-[14px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] bg-white"
              />
              <button
                type="submit"
                disabled={emailSubmitting}
                className="px-4 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#16345E] text-white font-semibold text-[13px] border-0 cursor-pointer shrink-0 whitespace-nowrap"
              >
                {emailSubmitting ? 'Sending' : 'Send'}
              </button>
            </div>

            {emailError && (
              <p className="text-[12px] text-[#A8341F] m-0">{emailError}</p>
            )}

            <div className="flex items-center justify-between text-[12px] text-[#5B6577]">
              <span>Sent once. No marketing emails.</span>
              <button
                type="button"
                onClick={() => window.print()}
                className="text-[#5B6577] hover:text-[#0B1F3A] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer text-[12px]"
              >
                Print / PDF
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
