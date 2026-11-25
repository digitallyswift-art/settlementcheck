'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Ga4TelemetryClient } from '@/components/telemetry/Ga4TelemetryClient'
import { trackClientEvent } from '@/lib/telemetry'
import PostSubmitConflictCard from '@/components/PostSubmitConflictCard'

interface Props {
  verdict?: string
  offer?: string | number
  salary?: string | number
  years?: string | number
  disputeReason?: string
  disputeReasonLabel?: string
  sourceUrl?: string
  initialEmail?: string
  hideEmailCapture?: boolean
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
      subtext: 'Check your options with 1 available SRA-regulated employment solicitor before terms arrive.',
      benefit1: 'Check your statutory baseline & options early',
      ctaLabel: 'Check my options with a solicitor →',
    }
  }
  if (verdict === 'BELOW_MINIMUM') {
    const shortfall = resultSummary ? Math.max(0, Math.round(resultSummary.minimum - offerNum)) : 0
    const formattedShortfall = shortfall > 0 ? `£${shortfall.toLocaleString('en-GB')}` : ''
    return {
      heading: formattedShortfall
        ? `Why is your offer ${formattedShortfall} below the legal minimum?`
        : 'Why is your offer below the legal minimum?',
      subtext: 'Have 1 available SRA-regulated employment solicitor review your notice and calculated statutory baseline.',
      benefit1: 'Check notice pay, redundancy & accrued holiday',
      ctaLabel: formattedShortfall
        ? `Review this ${formattedShortfall} gap with a solicitor →`
        : 'Review this gap with a solicitor →',
    }
  }
  if (verdict === 'BELOW_TYPICAL') {
    return {
      heading: 'Below typical payouts. Want a solicitor to check why?',
      subtext: 'First offers are often a starting point. Get a confidential review from 1 SRA-regulated solicitor.',
      benefit1: 'Check your £30k tax-free split & room to negotiate',
      ctaLabel: 'Check my options with a solicitor →',
    }
  }
  return {
    heading: 'The numbers add up. What about the fine print?',
    subtext: 'A UK settlement agreement is only binding once signed off by an independent solicitor (ERA 1996 s.203).',
    benefit1: 'Check your tax-free split, reference & non-compete clauses',
    ctaLabel: 'Check my terms & sign off →',
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
  initialEmail = '',
  className = '',
  saveParams,
  resultSummary,
}: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState(initialEmail)
  const [phone, setPhone] = useState('')
  const [contactTime, setContactTime] = useState<'Morning' | 'Afternoon' | 'Evening' | null>(null)
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [triageId, setTriageId] = useState<string | null>(null)
  const [leadId, setLeadId] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')

  const cardRef = useRef<HTMLDivElement>(null)
  const formStartedRef = useRef(false)
  const inViewTrackedRef = useRef(false)

  const offerNum = Number(offer) || 0
  const salaryNum = Number(salary) || 0
  const yearsNum = Number(years) || 0
  const framing = getVerdictFraming(verdict, offerNum, resultSummary)

  const hasPhoneInput = phone.trim().length > 0

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
      Ga4TelemetryClient.trackLeadFunnelStarted('inline_intake_1step', verdict)
      trackClientEvent('intake_started', { verdict, has_offer: offerNum > 0 })
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(value)
    if (value.trim().length === 0) {
      setContactTime(null)
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
      trackClientEvent('intake_validation_error', { field: 'firstName' })
      document.getElementById('sc-first-name')?.focus()
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid personal email address.')
      trackClientEvent('intake_validation_error', { field: 'email' })
      document.getElementById('sc-personal-email')?.focus()
      return
    }

    const trimmedPhone = phone.trim()
    const cleanedPhone = trimmedPhone.replace(/[\s\-\(\)]/g, '')
    if (cleanedPhone.length > 0 && cleanedPhone.length < 7) {
      setError('Please enter a valid UK telephone number, or leave the phone field blank.')
      trackClientEvent('intake_validation_error', { field: 'phone' })
      document.getElementById('sc-phone')?.focus()
      return
    }

    if (!consent) {
      setError('Please tick the box so an available SRA-regulated solicitor can review your figures.')
      trackClientEvent('intake_validation_error', { field: 'consent' })
      document.getElementById('sc-consent')?.focus()
      return
    }

    setSubmitting(true)

    try {
      const effectiveSourceUrl = (() => {
        if (saveParams && Object.keys(saveParams).length > 0) {
          const qs = new URLSearchParams()
          for (const [key, val] of Object.entries(saveParams)) {
            if (val !== undefined && val !== null && String(val) !== '') {
              qs.set(key, String(val))
            }
          }
          const query = qs.toString()
          if (query) return `/results/?${query}`
        }
        return sourceUrl
      })()

      const payload: Record<string, unknown> = {
        firstName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: trimmedPhone,
        verdict,
        offerAmount: offerNum > 0 ? offerNum : null,
        salary: salaryNum > 0 ? salaryNum : null,
        monthsService: yearsNum > 0 ? yearsNum * 12 : null,
        disputeReason,
        consent: true,
        gdpr_consent: true,
        sourceUrl: effectiveSourceUrl,
      }

      if (trimmedPhone.length > 0 && contactTime) {
        payload.contactTime = contactTime
      }

      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Could not save your details. Please try again.')
      }

      const assignedTriageId = data.triageId || 'SC-TR-' + Math.floor(1000 + Math.random() * 9000)
      setTriageId(assignedTriageId)
      if (typeof data.leadId === 'string') setLeadId(data.leadId)
      setSubmitted(true)

      const contactMethod = trimmedPhone ? 'phone' : 'email_only'
      Ga4TelemetryClient.trackLeadCompleted(true, {
        event_category: 'employee_lead',
        verdict,
        contact_method: contactMethod,
      })
      trackClientEvent('lead_submitted', {
        event_category: 'employee_lead',
        verdict,
        contact_method: contactMethod,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please check your details and try again.'
      setError(message)
    } finally {
      setSubmitting(false)
    }
  }

  // Attached calculation chip text (concise 1-line summary)
  const attachedSummaryParts: string[] = []
  if (offerNum > 0) {
    attachedSummaryParts.push(`£${Math.round(offerNum).toLocaleString('en-GB')} offer`)
    if (resultSummary && resultSummary.estimatedNet > 0) {
      attachedSummaryParts.push(`£${Math.round(resultSummary.estimatedNet).toLocaleString('en-GB')} est. net`)
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
          className="bg-white border border-[#0B1F3A] rounded-xl overflow-hidden shadow-md text-[#0B1F3A]"
        >
          <div className="h-1.5 bg-[#0B1F3A]" />
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-[#D9603B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="space-y-2 min-w-0">
                <div className="text-[12px] font-mono font-bold tracking-wider uppercase text-[#5B6577]">
                  Reference: {triageId || 'SC-TR-CONFIRMED'}
                </div>
                <h3 className="font-serif text-[23px] font-bold text-[#0B1F3A] m-0 leading-snug">
                  Request received, {name}.
                </h3>
                <p className="text-[15.5px] text-[#5B6577] leading-[1.6] m-0">
                  {phone.trim() ? (
                    <>
                      Your summary has been passed to <strong>one</strong> SRA-regulated employment solicitor. Expect a confidential call on{' '}
                      <strong className="text-[#0B1F3A]">{phone.trim()}</strong>
                      {contactTime ? (
                        <>
                          {' '}during your preferred <strong>{contactTime.toLowerCase()}</strong> window.
                        </>
                      ) : (
                        '.'
                      )}
                    </>
                  ) : (
                    <>
                      Your summary has been passed to <strong>one</strong> SRA-regulated employment solicitor. They will review your figures and contact you confidentially at{' '}
                      <strong className="text-[#0B1F3A]">{email}</strong>.
                    </>
                  )}
                </p>
              </div>
            </div>

            <PostSubmitConflictCard
              leadId={leadId}
              email={email}
              source="inline_solicitor_intake_card"
            />

            <div className="mt-5 pt-4 border-t border-[#EFEAE0]">
              <h4 className="font-serif text-[17px] font-bold text-[#0B1F3A] m-0 mb-2.5">
                Helpful to have ready
              </h4>
              <ul className="m-0 pl-4 space-y-2 text-[14.5px] text-[#5B6577] leading-[1.6]">
                <li>Your employment contract (to verify notice period, bonus, and any non-compete or job restrictions).</li>
                <li>
                  {offerNum > 0
                    ? 'Your draft settlement agreement or written offer, including any signing date your employer has mentioned.'
                    : 'Any notes from discussions so far, so your solicitor can advise on next steps.'}
                </li>
                <li>Confirmation sent to <strong className="text-[#0B1F3A]">{email}</strong>. Your employer is never contacted.</li>
              </ul>
            </div>

            <div className="mt-4 pt-3.5 border-t border-[#EFEAE0] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[44px] inline-flex items-center text-[14px] font-semibold text-[#0B1F3A] underline underline-offset-2 hover:text-[#C24D29] bg-transparent border-0 p-0 cursor-pointer"
              >
                Print or save PDF copy
              </button>
              <span className="text-[14px] text-[#525D70]">No obligation</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        ref={cardRef}
        id="solicitor-intake-card"
        className="bg-white border border-[#E2DCCE] rounded-xl overflow-hidden shadow-md"
      >
        <div className="h-1.5 bg-[#0B1F3A]" />

        <div className="p-5 sm:p-6">
          <h2 className="font-serif text-[23px] sm:text-[25px] font-bold text-[#0B1F3A] m-0 mb-1.5 leading-[1.22]">
            {framing.heading}
          </h2>

          <p className="text-[15px] text-[#525D70] leading-[1.55] m-0 mb-3.5">
            {framing.subtext}
          </p>

          {/* 3 Scannable Single-Line Checkmark Bullets */}
          <ul className="m-0 mb-3.5 p-0 list-none space-y-2 text-[14px] text-[#0B1F3A] leading-[1.45]">
            <li className="flex items-start gap-2">
              <span className="text-[#C24D29] font-bold shrink-0" aria-hidden="true">✓</span>
              <span>{framing.benefit1}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C24D29] font-bold shrink-0" aria-hidden="true">✓</span>
              <span>100% private (your employer is never told)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#C24D29] font-bold shrink-0" aria-hidden="true">✓</span>
              <span>Employers standardly contribute £350 to £500+ plus VAT toward your solicitor&apos;s fee upon completion</span>
            </li>
          </ul>

          {/* Compact 1-Line Attached Summary Pill */}
          {attachedSummaryParts.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E2DCCE] mb-4 text-[14px] text-[#0B1F3A] tabular-nums">
              <span className="font-bold text-[#C24D29] shrink-0">Attached:</span>
              <span className="font-semibold">{attachedSummaryParts.join(' · ')}</span>
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
              <label htmlFor="sc-first-name" className="block text-[14px] font-semibold text-[#0B1F3A] mb-1">
                First name <span className="text-[#C24D29]">*</span>
              </label>
              <input
                id="sc-first-name"
                type="text"
                required
                autoComplete="given-name"
                enterKeyHint="next"
                placeholder="e.g. Sarah"
                value={name}
                onFocus={handleFormFocus}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#D8D2C6] text-base text-[#0B1F3A] placeholder-[#6B7485] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <label htmlFor="sc-personal-email" className="block text-[14px] font-semibold text-[#0B1F3A] mb-1">
                Personal email <span className="text-[#C24D29]">*</span>
              </label>
              <input
                id="sc-personal-email"
                type="email"
                inputMode="email"
                required
                autoComplete="email"
                enterKeyHint="next"
                placeholder="e.g. sarah@gmail.com (not work email)"
                value={email}
                onFocus={handleFormFocus}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#D8D2C6] text-base text-[#0B1F3A] placeholder-[#6B7485] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="sc-phone"
                className="flex items-baseline justify-between gap-2 text-[14px] font-semibold text-[#0B1F3A] mb-1"
              >
                <span>UK mobile or telephone</span>
                <span className="text-[13px] text-[#525D70] font-normal">Optional · faster callback</span>
              </label>
              <input
                id="sc-phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                enterKeyHint="done"
                placeholder="e.g. 07700 900123"
                value={phone}
                onFocus={handleFormFocus}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border border-[#D8D2C6] text-base text-[#0B1F3A] placeholder-[#6B7485] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
              <p className="m-0 mt-1 text-[13px] text-[#525D70] leading-[1.45]">
                Never shared with your employer. Used only by your 1 matched solicitor.
              </p>
            </div>

            {hasPhoneInput && (
              <div className="pt-0.5">
                <span className="block text-[14px] font-semibold text-[#0B1F3A] mb-1.5">
                  Best time to call <span className="text-[#525D70] font-normal">(optional)</span>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Morning', 'Afternoon', 'Evening'] as const).map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      aria-pressed={contactTime === slot}
                      onClick={() => setContactTime(contactTime === slot ? null : slot)}
                      className={`min-h-[44px] py-2.5 px-2 text-center text-[14px] font-semibold rounded-xl border transition cursor-pointer ${
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
            )}

            <div className="pt-0.5 space-y-2">
              <label
                htmlFor="sc-consent"
                className="flex items-start gap-2.5 cursor-pointer select-none py-1"
              >
                <input
                  id="sc-consent"
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-5 w-5 rounded border-[#D8D2C6] accent-[#C24D29] text-[#C24D29] focus:ring-[#C24D29] cursor-pointer shrink-0"
                />
                <span className="text-[14px] text-[#243247] leading-[1.5]">
                  Share my figures with <strong>one</strong> available SRA-regulated employment solicitor so they can review them and get in touch. Extra or abortive work depends on their terms. No obligation to instruct.
                </span>
              </label>
            </div>

            {error && (
              <div role="alert" className="p-3 bg-[#FBF0EE] border border-[#D9A99E] rounded-xl text-[14px] font-medium text-[#A8341F]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full min-h-[50px] py-3.5 px-5 rounded-xl text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
                submitting
                  ? 'bg-[#E2DCCE] text-[#525D70] cursor-not-allowed'
                  : 'bg-[#C24D29] hover:bg-[#A83E1E] shadow-[0_4px_16px_rgba(194,77,41,0.28)]'
              }`}
            >
              <span>{submitting ? 'Sending your figures...' : framing.ctaLabel}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
