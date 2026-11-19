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
      eyebrow: 'Step 1 of 2 · Confidential Solicitor Check',
      heading: 'Speak with an employment solicitor before terms are tabled',
      subtext: 'Get clear on your calculated statutory baseline and what to look out for when your employer puts an offer in writing.',
      step1Cta: 'Get my solicitor review →',
    }
  }
  if (verdict === 'BELOW_MINIMUM') {
    const shortfall = resultSummary ? Math.max(0, Math.round(resultSummary.minimum - offerNum)) : 0
    const shortfallText = shortfall > 0
      ? `Your offer sits £${shortfall.toLocaleString('en-GB')} below your calculated statutory baseline.`
      : 'Your offer sits below your calculated statutory baseline.'
    return {
      eyebrow: 'Step 1 of 2 · Confidential Solicitor Check',
      heading: 'Have an SRA solicitor check what is missing',
      subtext: `${shortfallText} A specialist solicitor can check your notice, redundancy, and tax position before you reply.`,
      step1Cta: 'Get my solicitor review →',
    }
  }
  if (verdict === 'BELOW_TYPICAL') {
    const gap = resultSummary ? Math.max(0, Math.round(resultSummary.typicalLow - offerNum)) : 0
    const gapText = gap > 0
      ? `Your offer sits £${gap.toLocaleString('en-GB')} below the illustrative range for your role.`
      : 'First offers are often a starting point.'
    return {
      eyebrow: 'Step 1 of 2 · Confidential Solicitor Check',
      heading: 'Review your tax split and ex-gratia terms',
      subtext: `${gapText} An independent solicitor can review your figures, tax split, and reference wording before you sign.`,
      step1Cta: 'Get my solicitor review →',
    }
  }
  const netText = resultSummary && resultSummary.estimatedNet > 0
    ? `Review your £${Math.round(resultSummary.estimatedNet).toLocaleString('en-GB')} estimated take-home before signing.`
    : 'Review your estimated take-home before signing.'
  return {
    eyebrow: 'Step 1 of 2 · Required s.203(3) Sign-Off',
    heading: 'Arrange your required solicitor sign-off',
    subtext: `${netText} Most s.203(3) reviews complete within 24 to 48 hours, checking the £30,000 tax split, reference wording, and any post-exit restrictions.`,
    step1Cta: 'Get my solicitor review →',
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
  saveParams,
  resultSummary,
}: Props) {
  const [mode, setMode] = useState<'match' | 'email_only'>('match')
  const [step, setStep] = useState<1 | 2>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [contactTime, setContactTime] = useState<'Morning' | 'Afternoon' | 'Evening'>('Morning')
  const [consent, setConsent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [triageId, setTriageId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [honeypot, setHoneypot] = useState('')

  const cardRef = useRef<HTMLDivElement>(null)
  const step1StartedRef = useRef(false)
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
      setError('Please tick the box so an independent solicitor can contact you.')
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
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please check your details and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEmailResultsOnly(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError('Please enter a valid personal email address.')
      trackClientEvent('intake_validation_error', { field: 'email', step: 'email_only' })
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/save-results/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          ...(saveParams || { salary, yearsNum: years, offer }),
          verdict,
          ...(resultSummary || {}),
        }),
      })
      if (!res.ok) throw new Error('Failed to send results.')
      trackClientEvent('results_emailed_self_serve', { verdict, has_offer: offerNum > 0 })
      setEmailSent(true)
    } catch {
      setError('Could not send your summary right now. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (emailSent) {
    return (
      <div
        id="solicitor-intake-card"
        className={`bg-white border border-[#E2DCCE] rounded-2xl p-5 sm:p-6 text-[#0B1F3A] shadow-sm ${className}`}
      >
        <span className="inline-block text-[11px] font-mono font-semibold uppercase tracking-wider text-[#D9603B] mb-1.5">
          Summary sent
        </span>
        <h3 className="font-serif text-[20px] font-bold text-[#0B1F3A] m-0 mb-2 leading-snug">
          We have emailed your figures to {email}
        </h3>
        <p className="text-[13px] text-[#5B6577] leading-relaxed m-0 mb-4">
          Sent from <strong>team@settlementcheck.co.uk</strong>. Check Junk or Spam if it does not arrive within a minute. When you are ready for an independent solicitor to check your terms, you can request a confidential call below.
        </p>
        <button
          type="button"
          onClick={() => {
            setEmailSent(false)
            setMode('match')
            setStep(1)
          }}
          className="w-full py-3 px-5 rounded-xl text-white font-bold text-[14px] bg-[#D9603B] hover:bg-[#B14A28] transition-all cursor-pointer border-0"
        >
          Request a confidential solicitor call →
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div
        id="solicitor-intake-card"
        className={`bg-white border-2 border-[#0B1F3A] rounded-2xl p-6 text-[#0B1F3A] shadow-md ${className}`}
      >
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center shrink-0 mt-0.5">
            <svg className="w-5 h-5 text-[#D9603B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="space-y-2 min-w-0">
            <div className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#5B6577]">
              Reference: {triageId}
            </div>
            <h3 className="font-serif text-[21px] font-bold text-[#0B1F3A] m-0 leading-snug">
              You are booked in, {name}.
            </h3>
            <p className="text-[13px] text-[#5B6577] leading-relaxed m-0">
              Your summary has been passed to <strong>one</strong> SRA-regulated employment solicitor. Expect a confidential call during your preferred <strong>{contactTime.toLowerCase()}</strong> window.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-[#E2DCCE] space-y-2 text-[12px] text-[#5B6577]">
          <div className="flex items-center gap-2">
            <span className="text-[#0B1F3A] font-bold">1.</span>
            <span>Confirmation sent to <strong className="text-[#0B1F3A]">{email}</strong>.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#0B1F3A] font-bold">2.</span>
            <span>Have your draft agreement or offer letter handy if you have one.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#0B1F3A] font-bold">3.</span>
            <span>Your employer is never notified of this enquiry.</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#E2DCCE] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="text-[12px] font-semibold text-[#0B1F3A] underline underline-offset-2 hover:text-[#D9603B] bg-transparent border-0 p-0 cursor-pointer"
          >
            Print or save PDF copy
          </button>
          <span className="text-[11px] text-[#8A93A3]">No obligation</span>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div
        ref={cardRef}
        id="solicitor-intake-card"
        className="bg-white border-2 border-[#0B1F3A] rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(11,31,58,0.08)] relative overflow-hidden"
      >
        {/* Top Progress Header */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[#EFEAE0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D9603B]" aria-hidden="true" />
            <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#0B1F3A]">
              {mode === 'email_only'
                ? 'Save Your Calculation'
                : step === 1
                ? framing.eyebrow
                : 'Step 2 of 2 · Callback Details'}
            </span>
          </div>
          {mode === 'email_only' && (
            <button
              type="button"
              onClick={() => {
                setError(null)
                setMode('match')
              }}
              className="text-[13px] font-semibold text-[#D9603B] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer"
            >
              ← Back to solicitor review
            </button>
          )}
        </div>

        <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0B1F3A] m-0 mb-2 leading-[1.25]">
          {mode === 'email_only'
            ? 'Email my figures & checklist'
            : step === 1
            ? framing.heading
            : 'Where should the solicitor call you?'}
        </h3>

        <p className="text-[15px] sm:text-[16px] text-[#5B6577] leading-[1.6] m-0 mb-5">
          {mode === 'email_only'
            ? 'We will send your full breakdown, a 3-point solicitor checklist, and a 1-click link to instruct a solicitor when you are ready. Sent once, no marketing.'
            : step === 1
            ? framing.subtext
            : 'Your details go to one SRA-regulated employment solicitor only. Never shared with your employer.'}
        </p>

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

        {mode === 'email_only' ? (
          <form onSubmit={handleEmailResultsOnly} noValidate className="space-y-4">
            <div>
              <label htmlFor="sc-email-only" className="block text-[14px] font-semibold text-[#0B1F3A] mb-1.5">
                Personal email <span className="text-[#D9603B]">*</span>
              </label>
              <input
                id="sc-email-only"
                type="email"
                required
                placeholder="e.g. sarah@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#D8D2C6] text-[16px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>
            {error && (
              <div className="p-3 bg-[#FBF0EE] border border-[#D9A99E] rounded-lg text-[14px] text-[#A8341F]">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-5 rounded-xl text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#0B1F3A] hover:bg-[#16345E] border-0"
            >
              <span>{submitting ? 'Sending...' : 'Send my figures & checklist →'}</span>
            </button>
          </form>
        ) : step === 1 ? (
          <form onSubmit={handleStep1Continue} noValidate className="space-y-4">
            <div className="space-y-3.5">
              <div>
                <label htmlFor="sc-first-name" className="block text-[14px] font-semibold text-[#0B1F3A] mb-1.5">
                  First name <span className="text-[#D9603B]">*</span>
                </label>
                <input
                  id="sc-first-name"
                  type="text"
                  required
                  autoComplete="given-name"
                  placeholder="e.g. Sarah"
                  value={name}
                  onFocus={handleStep1Focus}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D8D2C6] text-[16px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
                />
              </div>

              <div>
                <label htmlFor="sc-personal-email" className="block text-[14px] font-semibold text-[#0B1F3A] mb-1.5">
                  Personal email <span className="text-[#D9603B]">*</span>
                </label>
                <input
                  id="sc-personal-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="e.g. sarah@gmail.com (not work email)"
                  value={email}
                  onFocus={handleStep1Focus}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#D8D2C6] text-[16px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-[#FBF0EE] border border-[#D9A99E] rounded-lg text-[14px] text-[#A8341F]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-xl text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#D9603B] hover:bg-[#B14A28] shadow-[0_4px_16px_rgba(217,96,59,0.28)] border-0"
            >
              <span>{framing.step1Cta}</span>
            </button>

            {/* 3 Clean, Non-Repetitive Trust Anchors */}
            <ul className="m-0 pt-3 border-t border-[#EFEAE0] space-y-2 list-none p-0 text-[14px] text-[#5B6577] leading-[1.5]">
              <li className="flex items-start gap-2.5">
                <span className="text-[#0B1F3A] font-bold" aria-hidden="true">✓</span>
                <span>Strictly private. Your employer is never contacted.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0B1F3A] font-bold" aria-hidden="true">✓</span>
                <span>Employers typically contribute £350 to £500+ +VAT on completion.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#0B1F3A] font-bold" aria-hidden="true">✓</span>
                <span>Sent to one SRA-regulated employment solicitor only.</span>
              </li>
            </ul>
          </form>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="flex items-center justify-between bg-[#F7F4EE] border border-[#E2DCCE] rounded-lg px-3.5 py-2.5 text-[14px] text-[#0B1F3A]">
              <span className="truncate">
                <strong>{name}</strong> · {email}
              </span>
              <button
                type="button"
                onClick={() => {
                  setError(null)
                  setStep(1)
                }}
                className="text-[#D9603B] font-semibold hover:underline bg-transparent border-0 cursor-pointer flex-shrink-0 ml-2 p-0 text-[14px]"
              >
                Edit
              </button>
            </div>

            <div>
              <label htmlFor="sc-phone" className="block text-[14px] font-semibold text-[#0B1F3A] mb-1.5">
                UK mobile or telephone <span className="text-[#D9603B]">*</span>
              </label>
              <input
                id="sc-phone"
                type="tel"
                required
                autoFocus
                autoComplete="tel"
                placeholder="e.g. 07700 900123"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#D8D2C6] text-[16px] text-[#0B1F3A] placeholder-[#8A93A3] focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <span className="block text-[14px] font-semibold text-[#0B1F3A] mb-1.5">
                Best time to call
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['Morning', 'Afternoon', 'Evening'] as const).map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setContactTime(slot)}
                    className={`py-2.5 px-2 text-center text-[14px] font-semibold rounded-lg border transition cursor-pointer ${
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

            <div className="pt-0.5 space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#D8D2C6] text-[#D9603B] focus:ring-[#D9603B] cursor-pointer shrink-0"
                />
                <span className="text-[14px] text-[#0B1F3A] leading-[1.5]">
                  I agree to share my summary (including any dispute details entered) with one independent SRA-regulated employment solicitor for a confidential call.
                </span>
              </label>

              <p className="text-[13px] text-[#5B6577] leading-[1.55] m-0">
                Employer fee contributions (typically £350 to £500+ +VAT) are paid upon completion. Work above that cap or abortive fees if you do not complete remain subject to your solicitor&apos;s terms. SettlementCheck is an independent introducer, not a law firm.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-[#FBF0EE] border border-[#D9A99E] rounded-lg text-[14px] text-[#A8341F]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 px-5 rounded-xl text-white font-bold text-[16px] flex items-center justify-center gap-2 transition-all cursor-pointer border-0 ${
                submitting
                  ? 'bg-[#E2DCCE] text-[#5B6577] cursor-not-allowed'
                  : 'bg-[#D9603B] hover:bg-[#B14A28] shadow-[0_4px_16px_rgba(217,96,59,0.28)]'
              }`}
            >
              <span>{submitting ? 'Confirming...' : 'Confirm my solicitor review →'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Secondary Low-Friction Email CTA (clearly subordinate to primary Coral CTA) */}
      {mode === 'match' && (
        <div className="mt-3.5 space-y-2">
          <button
            type="button"
            onClick={() => {
              setError(null)
              setMode('email_only')
              trackClientEvent('intake_mode_switched', { to: 'email_only', verdict })
            }}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F7F4EE] text-[#0B1F3A] font-semibold text-[15px] border border-[#D8D2C6] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
            <span>Email my figures &amp; checklist</span>
          </button>
          <div className="px-1 flex items-center justify-between text-[13px] text-[#5B6577]">
            <span>Sent once to your inbox. No marketing.</span>
            <button
              type="button"
              onClick={() => window.print()}
              className="text-[#5B6577] hover:text-[#0B1F3A] underline underline-offset-2 bg-transparent border-0 p-0 cursor-pointer text-[13px]"
            >
              Print / PDF
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
