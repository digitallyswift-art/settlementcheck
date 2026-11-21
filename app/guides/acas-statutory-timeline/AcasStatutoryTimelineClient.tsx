'use client'

import React, { useState, useId, useMemo } from 'react'
import Link from 'next/link'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'

export interface AcasTimelineState {
  offerDate: string
  employerDays: number
  edtDate: string
  employerContact: string
}

function calculatePrimaryLimitationDate(edtDateInput: Date): Date {
  const year = edtDateInput.getFullYear()
  const month = edtDateInput.getMonth() // 0-indexed
  const day = edtDateInput.getDate()

  const targetYear = month + 3 > 11 ? year + 1 : year
  const targetMonth = (month + 3) % 12

  if (day === 1) {
    return new Date(targetYear, targetMonth, 0)
  } else {
    const daysInTargetMonth = new Date(targetYear, targetMonth + 1, 0).getDate()
    const targetDay = Math.min(day - 1, daysInTargetMonth)
    return new Date(targetYear, targetMonth, targetDay)
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function AcasStatutoryTimelineClient() {
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], [])

  // Default offer date = today, default EDT = 30 days from today
  const defaultEdtStr = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  }, [])

  const [offerDate, setOfferDate] = useState<string>(todayStr)
  const [employerDays, setEmployerDays] = useState<string>('5')
  const [edtDate, setEdtDate] = useState<string>(defaultEdtStr)
  const [employerContact, setEmployerContact] = useState<string>('HR Director')
  const [copiedAgenda, setCopiedAgenda] = useState<boolean>(false)

  const offerDateId = useId()
  const employerDaysId = useId()
  const edtDateId = useId()
  const employerContactId = useId()

  const parsedEmployerDays = Math.max(1, parseInt(employerDays.replace(/[^0-9]/g, ''), 10) || 1)
  const parsedOfferDate = useMemo(() => new Date(offerDate), [offerDate])
  const parsedEdtDate = useMemo(() => new Date(edtDate), [edtDate])

  const isValidOfferDate = !isNaN(parsedOfferDate.getTime())
  const isValidEdtDate = !isNaN(parsedEdtDate.getTime())

  // ACAS Code 4 Paragraph 12 recommends a minimum of 10 calendar days
  const acasBenchmarkDate = useMemo(() => {
    if (!isValidOfferDate) return new Date()
    const d = new Date(parsedOfferDate)
    d.setDate(d.getDate() + 10)
    return d
  }, [parsedOfferDate, isValidOfferDate])

  // Employer deadline date
  const employerDeadlineDate = useMemo(() => {
    if (!isValidOfferDate) return new Date()
    const d = new Date(parsedOfferDate)
    d.setDate(d.getDate() + parsedEmployerDays)
    return d
  }, [parsedOfferDate, parsedEmployerDays, isValidOfferDate])

  // Primary limitation date under s.111(2) ERA 1996 (3 months less 1 day from EDT)
  const primaryLimitationDate = useMemo(() => {
    if (!isValidEdtDate) return new Date()
    return calculatePrimaryLimitationDate(parsedEdtDate)
  }, [parsedEdtDate, isValidEdtDate])

  // Days remaining calculations
  const today = useMemo(() => new Date(), [])
  const daysUntilEmployerDeadline = useMemo(() => {
    if (!isValidOfferDate) return 0
    return Math.ceil((employerDeadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [employerDeadlineDate, today, isValidOfferDate])

  const daysUntilAcasBenchmark = useMemo(() => {
    if (!isValidOfferDate) return 0
    return Math.ceil((acasBenchmarkDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [acasBenchmarkDate, today, isValidOfferDate])

  const daysUntilLimitation = useMemo(() => {
    if (!isValidEdtDate) return 0
    return Math.ceil((primaryLimitationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }, [primaryLimitationDate, today, isValidEdtDate])

  const isArtificialUltimatum = parsedEmployerDays < 10

  // Intake Agenda for Instructed Solicitor
  const solicitorAgendaText = useMemo(() => {
    return `INTAKE AGENDA FOR YOUR INSTRUCTED SOLICITOR: STATUTORY TIMELINE & LIMITATION BRIEFING

1. Case & Employer Details:
   - Employer / HR Contact: ${employerContact.trim() || 'HR Director'}
   - Date Settlement Offer Presented: ${isValidOfferDate ? formatDate(parsedOfferDate) : offerDate}
   - Employer Response Deadline: ${isValidOfferDate ? formatDate(employerDeadlineDate) : `${parsedEmployerDays} days`} (${parsedEmployerDays} calendar days given)
   - ACAS Code 4 (Para 12) Guidance Date: ${isValidOfferDate ? formatDate(acasBenchmarkDate) : '10 calendar days'}
   - Effective Date of Termination (EDT): ${isValidEdtDate ? formatDate(parsedEdtDate) : edtDate}
   - Primary Tribunal Limitation Date (s.111(2) ERA 1996): ${isValidEdtDate ? formatDate(primaryLimitationDate) : '3 months less 1 day'}

2. Matters for Solicitor Consultation:
   - Consideration Period: Review whether the ${parsedEmployerDays}-day employer deadline complies with ACAS Code 4 (minimum 10 calendar days guideline).
   - Contractual Revocation Risk (Routledge v Grant [1828]): Assess the risk of the employer setting an earlier binding deadline or revoking the offer prior to acceptance.
   - Improper Behaviour Assessment (s.111A(4) ERA 1996): Review whether an artificial deadline (<10 days) constitutes improper behaviour, potentially removing pre-termination confidentiality for unfair dismissal.
   - ACAS Early Conciliation Protection: Ensure ACAS notification is lodged prior to ${isValidEdtDate ? formatDate(primaryLimitationDate) : 'the primary limitation date'} if negotiations do not conclude.
   - Section 203(3) ERA 1996 Legal Fee Contribution: Confirm employer covers standard independent advisory fees upon completion.

Important Contract & Privilege Notice: Putting forward unreviewed counter-proposals directly to HR can extinguish existing offers under Hyde v Wrench and compromise legal privilege.`
  }, [
    employerContact,
    isValidOfferDate,
    parsedOfferDate,
    offerDate,
    employerDeadlineDate,
    parsedEmployerDays,
    acasBenchmarkDate,
    isValidEdtDate,
    parsedEdtDate,
    edtDate,
    primaryLimitationDate,
  ])

  const handleCopyAgenda = async () => {
    try {
      await navigator.clipboard.writeText(solicitorAgendaText)
      setCopiedAgenda(true)
      setTimeout(() => setCopiedAgenda(false), 3000)
    } catch {
      setCopiedAgenda(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Interactive Calculator Section */}
      <div className="bg-card border border-rule rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="border-b border-rule pb-5 mb-6">
          <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
            Deterministic Statutory Calculator
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink">
            ACAS Code 4 &amp; Section 111(2) Limitation Timeline Calculator
          </h2>
          <p className="text-body text-muted mt-1 leading-relaxed">
            Input the date you received your draft settlement agreement and your effective date of termination (EDT). The calculator deterministically models the 10-calendar-day ACAS consideration benchmark alongside your statutory tribunal limitation deadline.
          </p>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-paper rounded-xl border border-rule mb-6">
          <div>
            <label htmlFor={offerDateId} className="block text-xs font-semibold uppercase text-ink mb-1.5">
              1. Offer Presentation Date
            </label>
            <input
              id={offerDateId}
              type="date"
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
              className="w-full p-2.5 border border-rule rounded-lg text-xs font-mono bg-card text-ink focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
            <span className="text-[11px] text-muted block mt-1">Date letter or draft received</span>
          </div>

          <div>
            <label htmlFor={employerDaysId} className="block text-xs font-semibold uppercase text-ink mb-1.5">
              2. Days Given by Employer
            </label>
            <input
              id={employerDaysId}
              type="text"
              inputMode="numeric"
              maxLength={2}
              value={employerDays}
              placeholder="5"
              onChange={(e) => {
                const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                if (clean.length <= 2) setEmployerDays(clean)
              }}
              className="w-full p-2.5 border border-rule rounded-lg text-xs font-mono bg-card text-ink focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
            <span className="text-[11px] text-muted block mt-1">Calendar days to accept</span>
          </div>

          <div>
            <label htmlFor={edtDateId} className="block text-xs font-semibold uppercase text-ink mb-1.5">
              3. Effective Date of Termination (EDT)
            </label>
            <input
              id={edtDateId}
              type="date"
              value={edtDate}
              onChange={(e) => setEdtDate(e.target.value)}
              className="w-full p-2.5 border border-rule rounded-lg text-xs font-mono bg-card text-ink focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
            <span className="text-[11px] text-muted block mt-1">Last day of employment</span>
          </div>

          <div>
            <label htmlFor={employerContactId} className="block text-xs font-semibold uppercase text-ink mb-1.5">
              4. HR / Employer Contact
            </label>
            <input
              id={employerContactId}
              type="text"
              placeholder="e.g. HR Director / Jane Doe"
              value={employerContact}
              onChange={(e) => setEmployerContact(e.target.value)}
              className="w-full p-2.5 border border-rule rounded-lg text-xs bg-card text-ink focus:outline-none focus:ring-2 focus:ring-coral/50"
            />
            <span className="text-[11px] text-muted block mt-1">For your solicitor briefing</span>
          </div>
        </div>

        {/* Dynamic Status Callout */}
        {isArtificialUltimatum ? (
          <div className="bg-[#FEF5F3] border border-[#F3C4B8] rounded-xl p-5 mb-6 text-ink">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-coral text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                !
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-base text-coral">
                    Artificial Deadline Detected: {parsedEmployerDays} Calendar Days Allowed
                  </span>
                  <span className="text-xs font-mono bg-coral/10 text-coral px-2.5 py-0.5 rounded font-semibold">
                    ACAS Code 4 Benchmark: 10 Days
                  </span>
                </div>
                <p className="text-body sm:text-body text-ink/90 leading-relaxed">
                  Your employer has specified a <strong>{parsedEmployerDays}-day deadline</strong> (expiring on{' '}
                  <strong>{isValidOfferDate ? formatDate(employerDeadlineDate) : `${parsedEmployerDays} days`}</strong>).{' '}
                  <strong>ACAS Code of Practice 4 Paragraph 12</strong> establishes that a minimum of{' '}
                  <strong>10 calendar days</strong> should be allowed to consider written settlement agreement terms and receive independent legal advice.
                </p>
                <div className="bg-white/90 border border-[#F3C4B8] rounded-lg p-3 text-xs leading-relaxed text-ink space-y-1">
                  <p className="m-0">
                    <strong>Statutory Improper Behaviour Test (ERA 1996 s.111A(4)):</strong> Under Paragraph 18 of ACAS Code 4, setting an unreasonably short deadline can be treated as improper behaviour by an Employment Tribunal, stripping away Section 111A confidentiality for ordinary unfair dismissal claims.
                  </p>
                  <p className="m-0 text-muted">
                    <strong>Contract Law Notice (Routledge v Grant):</strong> However, under English contract law, an employer is entitled to set binding deadlines or revoke an unaccepted offer before acceptance. ACAS 10 days is guidance rather than an irrevocable legal entitlement. Do not let deadlines lapse without instructing a solicitor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#F0F5FA] border border-[#C4D8EC] rounded-xl p-5 mb-6 text-ink">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#0B1F3A] text-white flex items-center justify-center flex-shrink-0 font-bold text-sm">
                ✓
              </div>
              <div className="flex-1 space-y-1">
                <span className="font-bold text-base text-[#0B1F3A] block">
                  Compliant Consideration Window ({parsedEmployerDays} Calendar Days Given)
                </span>
                <p className="text-body sm:text-body text-ink/90 leading-relaxed m-0">
                  Your employer has provided a {parsedEmployerDays}-day response window, meeting or exceeding the 10-calendar-day ACAS Code 4 guideline. Your deadline expires on{' '}
                  <strong>{isValidOfferDate ? formatDate(employerDeadlineDate) : `${parsedEmployerDays} days`}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-paper p-4 rounded-xl border border-rule space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-muted font-medium block">
              1. Offer Presentation
            </span>
            <span className="text-lg font-serif font-bold text-ink block">
              {isValidOfferDate ? formatDate(parsedOfferDate) : offerDate}
            </span>
            <span className="text-xs text-muted block font-mono">Day 0 (Clock Starts)</span>
          </div>

          <div className="bg-paper p-4 rounded-xl border border-rule space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-coral font-medium block">
              2. Employer Deadline
            </span>
            <span className="text-lg font-serif font-bold text-coral block">
              {isValidOfferDate ? formatDate(employerDeadlineDate) : `${parsedEmployerDays} days`}
            </span>
            <span className="text-xs text-muted block font-mono">
              {daysUntilEmployerDeadline > 0
                ? `${daysUntilEmployerDeadline} days remaining`
                : daysUntilEmployerDeadline === 0
                ? 'Expires today'
                : 'Deadline expired'}
            </span>
          </div>

          <div className="bg-paper p-4 rounded-xl border border-rule space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-ink font-medium block">
              3. ACAS 10-Day Guideline
            </span>
            <span className="text-lg font-serif font-bold text-[#0B1F3A] block">
              {isValidOfferDate ? formatDate(acasBenchmarkDate) : '10 days'}
            </span>
            <span className="text-xs text-muted block font-mono">
              {daysUntilAcasBenchmark > 0
                ? `${daysUntilAcasBenchmark} days in guideline`
                : '10-day guideline passed'}
            </span>
          </div>

          <div className="bg-paper p-4 rounded-xl border border-rule space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-crimson font-medium block">
              4. Primary Limitation (s.111)
            </span>
            <span className="text-lg font-serif font-bold text-crimson block">
              {isValidEdtDate ? formatDate(primaryLimitationDate) : '3 months less 1 day'}
            </span>
            <span className="text-xs text-muted block font-mono">
              {daysUntilLimitation > 0
                ? `${daysUntilLimitation} days to ACAS notice`
                : 'Limitation date passed'}
            </span>
          </div>
        </div>

        {/* Chrono Visual Progress Bar */}
        <div className="p-5 bg-paper rounded-xl border border-rule space-y-4 mb-8">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-ink">Statutory Timeline Progression</span>
            <span className="font-mono text-muted text-[11px]">
              EDT: {isValidEdtDate ? formatDate(parsedEdtDate) : edtDate}
            </span>
          </div>

          <div className="relative pt-2 pb-6">
            <div className="h-2 w-full bg-paper-2 rounded-full border border-rule overflow-hidden">
              <div
                className="h-full bg-coral rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(10, (parsedEmployerDays / 14) * 100))}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-mono text-muted mt-2">
              <span>Day 0 (Received)</span>
              <span className="text-coral font-semibold">Day {parsedEmployerDays} (Employer)</span>
              <span className="text-[#0B1F3A] font-semibold">Day 10 (ACAS Guideline)</span>
              <span className="text-crimson font-semibold">3 Months - 1 Day (Tribunal Limit)</span>
            </div>
          </div>

          <div className="p-3 bg-card rounded-lg border border-rule text-xs text-muted leading-relaxed">
            <strong className="text-ink">Crucial Limitation Warning:</strong> Settlement negotiations or internal company grievances do not pause or stop the statutory 3-month-less-1-day limitation clock under Section 111(2) ERA 1996. You must contact ACAS to initiate Early Conciliation before the limitation date expires to prevent your claims from being permanently time-barred.
          </div>
        </div>

        {/* Solicitor Intake Agenda Box */}
        <div className="bg-paper p-5 sm:p-6 rounded-xl border border-rule space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-serif font-bold text-ink m-0">
                Intake Agenda for Your Instructed Solicitor
              </h3>
              <p className="text-body text-muted mt-0.5 m-0">
                A structured, non-prescriptive briefing ready to share with your chosen SRA-regulated employment solicitor.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyAgenda}
              className="px-4 py-2 bg-ink hover:bg-ink-2 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto shadow-sm"
            >
              {copiedAgenda ? (
                <>
                  <span>✓</span> Copied to Clipboard
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy Solicitor Agenda
                </>
              )}
            </button>
          </div>

          <pre className="p-4 bg-card border border-rule rounded-lg text-xs font-mono text-ink whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-64">
            {solicitorAgendaText}
          </pre>
        </div>
      </div>

      {/* Mandatory Legal Disclaimers */}
      <MandatoryLegalDisclaimers />

      {/* Next Step CTA */}
      <div className="bg-card p-6 sm:p-8 rounded-xl border border-rule flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-lg font-serif font-bold text-ink">
            Need Independent Legal Advice Before Your Deadline?
          </h3>
          <p className="text-body text-muted leading-relaxed">
            Connect with a specialist SRA-regulated employment solicitor to review your terms, protect your statutory deadlines, and handle discussions under customary employer fee contributions.
          </p>
        </div>
        <Link
          href="/settlement-agreement-review/"
          className="px-6 py-3 bg-coral hover:bg-coral-2 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm text-center"
        >
          Check My Offer Now →
        </Link>
      </div>
    </div>
  )
}