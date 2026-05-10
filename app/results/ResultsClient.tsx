'use client'

import { useSearchParams } from 'next/navigation'
import React, { Suspense, useState, useRef } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getVerdict, formatCurrency, VerdictResult, WEEKLY_CAP_GB, WEEKLY_CAP_NI } from '@/lib/calculations'

/* ── Shared tiny components ─────────────────────────────────────── */

function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

/* ── Social proof testimonials ──────────────────────────────────── */

function Testimonials() {
  const items = [
    {
      quote: 'My initial offer was £14,000. After speaking to a solicitor through SettlementCheck, I settled at £34,500. I almost signed the first figure.',
      attr: 'Operations manager, logistics sector, 2025',
    },
    {
      quote: 'I had no idea the offer was below the legal minimum until I used this calculator. The solicitor recovered an additional £19,200.',
      attr: 'Project coordinator, financial services, 2024',
    },
  ]
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((t, i) => (
        <blockquote key={i} className="bg-white border border-rule rounded-lg p-5 flex flex-col gap-3">
          <p className="text-[15px] text-ink leading-[1.6] m-0">&ldquo;{t.quote}&rdquo;</p>
          <footer className="text-[12px] text-muted-2 font-medium uppercase tracking-[0.06em]">{t.attr}</footer>
        </blockquote>
      ))}
    </div>
  )
}

/* ── Verdict panel ──────────────────────────────────────────────── */

function VerdictPanel({ result, offer, salary, yearsNum, age }: {
  result: VerdictResult; offer: number; salary: number; yearsNum: number; age: number
}) {
  const completedYears = yearsNum  // already whole years from input

  if (result.verdict === 'BELOW_MINIMUM') {
    const srp = result.redundancy || result.basicAward
    return (
      <div className="rounded-lg p-7 md:p-8" style={{ background: '#FBF0EE', border: '1px solid #D9A99E' }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.10em] uppercase mb-4" style={{ background: '#fff', color: '#A8341F', border: '1px solid #D9A99E' }}>
          Below your legal minimum
        </span>
        <h2 className="sc-h2">Your employer may not be meeting their legal obligation.</h2>
        <div className="sc-body mt-3 max-w-[66ch] flex flex-col gap-3">
          <p>Under UK law, you are entitled to a minimum of <strong className="text-ink">{formatCurrency(srp)}</strong> in statutory redundancy pay alone, based on your {completedYears} {completedYears === 1 ? 'year' : 'years'} of service, age {age}, and a weekly pay cap of £{result.weeklyCapUsed.toLocaleString('en-GB')}.</p>
          <p>The offer you have described (<strong className="text-ink">{formatCurrency(offer)}</strong>) does not reach that threshold.</p>
          <p>This is not a negotiating position. It is a legal floor. <strong className="text-ink">You do not need to accept an offer below it.</strong></p>
          <p>Before you respond to your employer, read the breakdown below.</p>
        </div>
        <OfferVsRange result={result} offer={offer} />
      </div>
    )
  }

  if (result.verdict === 'BELOW_TYPICAL') {
    return (
      <div className="rounded-lg p-7 md:p-8 bg-amber-tint" style={{ border: '1px solid #E0CB94' }}>
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.10em] uppercase mb-4" style={{ background: '#fff', color: '#B5802A', border: '1px solid #E0CB94' }}>
          Likely below typical
        </span>
        <h2 className="sc-h2">Your offer covers the legal minimum. Most people in your position receive more.</h2>
        <div className="sc-body mt-3 max-w-[66ch] flex flex-col gap-3">
          <p>Based on your salary, age, and {completedYears} {completedYears === 1 ? 'year' : 'years'} of service, settlements in situations like yours typically fall between <strong className="text-ink">{formatCurrency(result.typicalLow)}</strong> and <strong className="text-ink">{result.typicalHighUncapped ? 'a figure that depends on the specific circumstances' : formatCurrency(result.typicalHigh)}</strong>.</p>
          <p>Your offer of <strong className="text-ink">{formatCurrency(offer)}</strong> sits below that range.</p>
          <p>Employers make opening offers. <strong className="text-ink">This is yours.</strong></p>
        </div>
        <OfferVsRange result={result} offer={offer} />
      </div>
    )
  }

  // WITHIN_RANGE or ABOVE_TYPICAL → "Your offer looks strong"
  return (
    <div className="rounded-lg p-7 md:p-8 bg-sage-tint" style={{ border: '1px solid #BCD0BF' }}>
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.10em] uppercase mb-4" style={{ background: '#fff', color: '#4F7060', border: '1px solid #BCD0BF' }}>
        <CheckIcon size={12} /> Your offer looks strong
      </span>
      <h2 className="sc-h2">This offer appears above the typical range for your circumstances.</h2>
      <div className="sc-body mt-3 max-w-[66ch] flex flex-col gap-3">
        <p>Based on your inputs, your employer&apos;s offer of <strong className="text-ink">{formatCurrency(offer)}</strong> sits at or above what similar cases typically reach.</p>
        <p>A strong financial figure is not the full picture. Settlement agreements include terms beyond the number: reference wording, confidentiality obligations, and claims you are waiving, all of which can be as significant as the payment itself.</p>
        <p>A solicitor will review the complete agreement at no cost to you. <strong className="text-ink">Your employer is required to contribute to those fees.</strong></p>
      </div>
      <OfferVsRange result={result} offer={offer} />
    </div>
  )
}

/* ── Offer vs range numbers + methodology ───────────────────────── */

function OfferVsRange({ result, offer }: { result: VerdictResult; offer: number }) {
  return (
    <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(11,31,58,0.12)' }}>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1px 1fr', gap: 0 }}>
        <div className="pr-6">
          <div className="sc-eyebrow mb-2">Your offer</div>
          <div className="font-serif text-ink" style={{ fontSize: 28, fontWeight: 420, letterSpacing: '-0.015em' }}>
            {formatCurrency(offer)}
          </div>
        </div>
        <div style={{ background: 'rgba(11,31,58,0.12)' }} aria-hidden="true" />
        <div className="pl-6">
          <div className="sc-eyebrow mb-2">Typical range</div>
          <div className="font-serif text-ink" style={{ fontSize: 28, fontWeight: 420, letterSpacing: '-0.015em' }}>
            {result.typicalHighUncapped
              ? <>{formatCurrency(result.typicalLow)} to <span style={{ fontSize: 20 }}>Potentially uncapped</span></>
              : <>{formatCurrency(result.typicalLow)} to {formatCurrency(result.typicalHigh)}</>
            }
          </div>
          {result.discriminationAsterisk && (
            <p className="text-[12px] text-muted mt-2">* This range assumes no discrimination element. If discrimination is involved, your position may be significantly stronger and is uncapped.</p>
          )}
        </div>
      </div>

      {/* Methodology transparency — M8 */}
      <div className="mt-5 pt-5" style={{ borderTop: '1px solid rgba(11,31,58,0.10)' }}>
        <p className="text-[13px] text-muted leading-[1.6]">
          <strong className="text-ink font-medium">Where does the typical range come from?</strong>{' '}
          The lower figure is your statutory floor plus a standard uplift based on typical negotiated outcomes. The upper figure reflects cases where employees negotiated actively, often with legal support. The gap between them is real, and in most cases, recoverable.
        </p>
      </div>
    </div>
  )
}

/* ── Discrimination flag ────────────────────────────────────────── */

function DiscriminationFlag() {
  return (
    <div className="rounded-lg p-6" style={{ background: 'rgba(60,100,180,0.06)', border: '1px solid #B9CADD' }}>
      <div className="flex gap-3 items-start">
        <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.2 }}>⚡</span>
        <div>
          <h3 className="sc-h3 mb-2">Your situation may involve an uncapped claim.</h3>
          <div className="sc-body flex flex-col gap-2">
            <p>You have indicated that discrimination may be a factor.</p>
            <p>Where dismissal or mistreatment is connected to age, gender, race, disability, pregnancy, or another protected characteristic, Employment Tribunal compensation is uncapped. The typical range shown above does not reflect this. Your actual position may be significantly stronger.</p>
            <p>If you are not certain whether what happened qualifies, that uncertainty is itself worth raising with a solicitor. <strong className="text-ink">Most people in this situation underestimate their position.</strong></p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Signing deadline callout ───────────────────────────────────── */

function SigningDeadline() {
  return (
    <div className="rounded-lg p-5 flex gap-4 items-start" style={{ background: '#F5F1E9', border: '1px solid #D8D2C6' }}>
      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.3 }}>🗓</span>
      <div className="sc-body">
        <p className="text-ink font-medium mb-1">Settlement agreements typically have a 7 to 10 day signing window.</p>
        <p>Independent legal review takes 24 to 48 hours. Starting now leaves you time to negotiate if needed, without deciding alone under pressure.</p>
      </div>
    </div>
  )
}

/* ── Breakdown table ────────────────────────────────────────────── */

function BreakdownTable({ result, offer, salary }: { result: VerdictResult; offer: number; salary: number }) {
  const [sourcesOpen, setSourcesOpen] = useState(false)
  const taxRatePct = Math.round(result.taxRate * 100)
  const netDisplay = result.estimatedNet < 0 ? 0 : result.estimatedNet

  const srpLabel = result.redundancy > 0 ? 'Statutory redundancy pay' : 'Basic award (unfair dismissal)'
  const srpValue = result.redundancy > 0 ? result.redundancy : result.basicAward
  const pilonLabel = `Notice pay (PILON) ${result.noticeWeeksUsed} week${result.noticeWeeksUsed !== 1 ? 's' : ''}`

  const thStyle: React.CSSProperties = { padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#8A93A3', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid #E2DCCE', background: '#F7F4EE' }
  const thRStyle: React.CSSProperties = { ...thStyle, textAlign: 'right' }

  function Row({ label, value, taxTag, highlight, dimmed, isNegative }: {
    label: React.ReactNode; value: React.ReactNode; taxTag?: React.ReactNode; highlight?: boolean; dimmed?: boolean; isNegative?: boolean
  }) {
    return (
      <tr style={{ borderBottom: '1px solid #E2DCCE', background: highlight ? '#F0EDE6' : undefined }}>
        <td style={{ padding: '11px 20px', fontSize: 14, color: dimmed ? '#8A93A3' : '#0B1F3A', fontWeight: highlight ? 600 : 400 }}>{label}</td>
        <td style={{ padding: '11px 20px', fontSize: 14, textAlign: 'right', fontFamily: 'var(--font-mono)', color: isNegative ? '#A8341F' : '#0B1F3A', fontWeight: highlight ? 600 : 400 }}>{value}</td>
        <td style={{ padding: '11px 20px', fontSize: 12, textAlign: 'right' }}>{taxTag}</td>
      </tr>
    )
  }

  function Tag({ text, color }: { text: string; color: string }) {
    return <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, background: color === 'green' ? 'rgba(79,112,96,0.12)' : 'rgba(168,52,31,0.10)', color: color === 'green' ? '#4F7060' : '#A8341F', whiteSpace: 'nowrap' }}>{text}</span>
  }

  const dividerRow = (
    <tr><td colSpan={3} style={{ height: 1, background: '#D8D2C6', padding: 0 }} /></tr>
  )

  return (
    <div className="bg-card border border-rule rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-rule">
        <h3 className="sc-h3">How we calculated this</h3>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 480 }}>
          <thead>
            <tr>
              <th style={thStyle}>Item</th>
              <th style={thRStyle}>Amount</th>
              <th style={thRStyle}>Tax status</th>
            </tr>
          </thead>
          <tbody>
            {srpValue > 0 && (
              <Row
                label={<>{srpLabel} <sup>¹</sup></>}
                value={formatCurrency(srpValue)}
                taxTag={<Tag text="Tax-free *" color="green" />}
              />
            )}
            <Row
              label={<>{pilonLabel} <sup>²</sup></>}
              value={formatCurrency(result.pilon)}
              taxTag={<Tag text="Fully taxable" color="red" />}
            />
            {dividerRow}
            <Row label="Estimated legal minimum" value={formatCurrency(result.minimum)} highlight />
            <Row label="Typical negotiated low" value={formatCurrency(result.typicalLow)} dimmed />
            <Row
              label="Typical negotiated high"
              value={result.typicalHighUncapped ? 'Potentially uncapped' : formatCurrency(result.typicalHigh)}
              dimmed
            />
            <Row label="Your offer" value={formatCurrency(offer)} highlight />
            {dividerRow}
            <Row
              label={`Estimated tax on settlement`}
              value={`−${formatCurrency(result.estimatedTax)}`}
              taxTag={<span style={{ fontSize: 12, color: '#8A93A3' }}>At {taxRatePct}% rate</span>}
              isNegative
            />
            <Row label={<strong>Estimated net take-home</strong>} value={<strong>{formatCurrency(netDisplay)}</strong>} highlight />
          </tbody>
        </table>
      </div>

      {/* Protective award — separate callout, NEVER in total */}
      {result.collectiveRedundancy && result.protectiveAwardMax > 0 && (
        <div className="mx-5 my-4 p-4 rounded-md" style={{ background: 'rgba(217,96,59,0.07)', border: '1px solid rgba(217,96,59,0.2)' }}>
          <p className="text-[13px] text-ink font-medium mb-1">Potential separate Employment Tribunal claim</p>
          <p className="text-[13px] text-muted leading-[1.55]">
            Because 20 or more employees were affected, you may have a Protective Award claim of up to <strong className="text-ink">{formatCurrency(result.protectiveAwardMax)}</strong> (90 days pay) if your employer failed to consult properly. This is claimed separately under TULRCA 1992 s.189 and is not included in the figures above.
          </p>
        </div>
      )}

      {/* Tax footnote */}
      <div className="px-5 py-4 border-t border-rule">
        <p className="text-[12px] text-muted leading-[1.65]">
          * The first £30,000 of genuine termination payments is tax-free under ITEPA 2003 s.403. Payment in lieu of notice (PILON, a lump sum paid instead of working your notice period) is always fully taxable regardless of how it is described in your agreement, under ITEPA 2003 s.402D.
        </p>
        <p className="text-[12px] text-muted mt-2 leading-[1.65]">
          Tax estimate uses {taxRatePct}% based on your salary. Your actual liability depends on your total income in this tax year.
          {result.isScottishNote && ' Scottish taxpayers have different income tax bands. This estimate uses UK standard rates as a baseline.'}
        </p>
      </div>

      {/* View legal sources toggle */}
      <div className="border-t border-rule">
        <button
          type="button"
          onClick={() => setSourcesOpen(o => !o)}
          className="w-full px-5 py-3.5 text-left flex items-center justify-between text-[13px] text-muted hover:text-ink transition-colors"
        >
          <span>View legal sources</span>
          <span style={{ transform: sourcesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }}>▾</span>
        </button>
        {sourcesOpen && (
          <div className="px-5 pb-5 text-[12px] text-muted leading-[1.8] flex flex-col gap-1">
            <p><sup>¹</sup> Statutory redundancy pay: <a href="https://www.legislation.gov.uk/ukpga/1996/18/sections/162-163" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ERA 1996 ss.162-163</a></p>
            <p><sup>²</sup> Notice entitlement: <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/86" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ERA 1996 s.86</a></p>
            <p>Weekly pay cap £{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI: <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ERA 1996 s.227</a></p>
            <p>Tax-free threshold: <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ITEPA 2003 s.403</a></p>
            <p>PILON taxation: <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">ITEPA 2003 s.402D</a></p>
            {result.collectiveRedundancy && (
              <p>Protective award: <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/189" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-ink">TULRCA 1992 s.189</a></p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Save and share (Section 6) ─────────────────────────────────── */

function SaveCard({ resultRef, result, offer, onEmailCapture, params }: {
  resultRef: React.RefObject<HTMLDivElement | null>
  result: VerdictResult
  offer: number
  onEmailCapture: (email: string) => void
  params: Record<string, string | number>
}) {
  const [emailOpen, setEmailOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    setStatus('sending')
    try {
      const res = await fetch('/api/save-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          ...params,
          verdict:            result.verdict,
          minimum:            result.minimum,
          typicalLow:         result.typicalLow,
          typicalHigh:        result.typicalHigh,
          typicalHighUncapped: result.typicalHighUncapped,
          estimatedNet:       result.estimatedNet,
        }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      onEmailCapture(email)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div ref={resultRef} className="bg-card border border-rule rounded-lg p-6 flex flex-col gap-4">
      <div>
        <span className="sc-eyebrow">Save your results</span>
        <h3 className="sc-h3 mt-1">Keep a record of your calculation.</h3>
        <p className="sc-body mt-1.5">Your figures are based on the details you entered today. Settlement negotiations can take time. Save a copy now so you have something to refer back to, share with a partner, or bring to your first solicitor call.</p>
      </div>

      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-ghost text-[14px] px-4 py-2.5"
        >
          Download PDF summary
        </button>

        {!emailOpen && status !== 'sent' && (
          <button
            type="button"
            data-email-trigger
            onClick={() => setEmailOpen(true)}
            className="btn-accent text-[14px] px-4 py-2.5"
          >
            Email me my results
          </button>
        )}
      </div>

      {emailOpen && status !== 'sent' && (
        <form onSubmit={sendEmail} className="flex flex-col gap-3 pt-2">
          <label className="text-[13px] font-medium text-ink">Your email address</label>
          <div className="input-wrap">
            <input
              type="email"
              className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoFocus
              required
            />
          </div>
          <p className="text-[12px] text-muted leading-[1.55]">
            We will send your results once. Your email will not be added to any marketing list unless you choose Step 2 below.
          </p>
          {status === 'error' && (
            <p className="text-[12px] text-crimson">Something went wrong. Please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-accent text-[14px] self-start px-4 py-2.5 disabled:opacity-60"
          >
            {status === 'sending' ? 'Sending...' : 'Send my results'}
          </button>
        </form>
      )}
      {status === 'sent' && (
        <p className="text-[13px] text-muted">Sent. Check your inbox, including your spam folder.</p>
      )}
    </div>
  )
}

/* ── Lead form / Step 2 (Section 7) ────────────────────────────── */

function LeadForm({ verdict, offer, salary, totalMonths, prefillEmail }: {
  verdict: string; offer: number; salary: number; totalMonths: number; prefillEmail: string
}) {
  const [form, setForm] = useState({ first_name: '', email: prefillEmail, phone: '', contact_time: 'Morning', consent: false })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle')

  const update = (k: string, v: string | boolean) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }))
  }

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const e: Record<string, string> = {}
    if (!form.first_name.trim()) e.first_name = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.phone || form.phone.length < 7) e.phone = 'Enter a phone number'
    if (!form.consent) e.consent = 'Required'
    setErrors(e)
    if (Object.keys(e).length) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: form.first_name, email: form.email, phone: form.phone, contact_time: form.contact_time, verdict, offer_amount: offer, salary, months_service: totalMonths, consent: form.consent }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-sage-tint border border-[#BCD0BF] rounded-lg p-7 flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: '#4F7060' }}>
          <CheckIcon size={20} />
        </div>
        <h3 className="sc-h3">Matched. A solicitor will call within 24 hours.</h3>
        <p className="sc-body max-w-[48ch]">
          On <strong className="text-ink">{form.phone}</strong>, {form.contact_time.toLowerCase()} preferred. The advice is free. Your employer covers the cost.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-card border border-rule rounded-lg p-6 md:p-7 flex flex-col gap-5">
      <div>
        <span className="sc-eyebrow">Step 2 of 2</span>
        <h3 className="sc-h3 mt-1.5">Now you know where your offer stands.</h3>
        <p className="sc-body mt-1 font-medium text-ink">The next step costs you nothing.</p>
        <p className="sc-body mt-2 max-w-[56ch]">
          Your employer is legally required to contribute to the cost of your independent legal advice on any settlement agreement.
        </p>
        <p className="sc-body mt-2 max-w-[56ch]">
          We match you to a solicitor who handles settlement agreements exclusively, not a general practice firm taking employment cases alongside conveyancing and wills. You should expect contact within 24 hours.
        </p>
        <p className="sc-body mt-2 max-w-[56ch]">
          They will tell you whether your offer is moveable, handle any negotiation on your behalf, and review every term in the agreement, not just the financial figure.
        </p>
        <p className="sc-body mt-2"><strong className="text-ink">You are under no obligation after the first call.</strong></p>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink">First name</label>
            <div className="input-wrap">
              <input type="text" className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2" placeholder="Alex" value={form.first_name} onChange={e => update('first_name', e.target.value)} />
            </div>
            {errors.first_name && <span className="text-[12px] text-crimson">{errors.first_name}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink">Email</label>
            <div className="input-wrap">
              <input type="email" className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2" placeholder="alex@example.com" value={form.email} onChange={e => update('email', e.target.value)} />
            </div>
            {errors.email && <span className="text-[12px] text-crimson">{errors.email}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink">Phone</label>
            <div className="input-wrap">
              <input type="tel" className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2" placeholder="07…" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
            {errors.phone && <span className="text-[12px] text-crimson">{errors.phone}</span>}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-ink">Preferred contact time</label>
            <div className="pill-radio" role="radiogroup">
              {(['Morning', 'Afternoon', 'Evening'] as const).map(t => (
                <button key={t} type="button" className="pill-radio-btn" aria-pressed={form.contact_time === t} onClick={() => update('contact_time', t)}>{t}</button>
              ))}
            </div>
          </div>
        </div>

        <label className="grid gap-3 cursor-pointer items-start" style={{ gridTemplateColumns: '18px 1fr' }}>
          <input type="checkbox" className="mt-0.5 w-4 h-4 accent-ink" checked={form.consent} onChange={e => update('consent', e.target.checked)} />
          <span className="text-[13px] text-muted leading-[1.55]">
            I consent to SettlementCheck sharing my details with one matched SRA-regulated solicitor so they may contact me about my settlement.
          </span>
        </label>
        {errors.consent && <span className="text-[12px] text-crimson -mt-2">{errors.consent}</span>}
        {errors.form && <span className="text-[13px] text-crimson">{errors.form}</span>}

        <button type="submit" disabled={status === 'submitting'} className="btn-accent w-full py-4 text-[16px] disabled:opacity-60">
          {status === 'submitting' ? 'Submitting…' : 'Get my free specialist match'}
        </button>

        {/* Trust signals below the CTA */}
        <div className="flex flex-col gap-2 pt-1">
          {[
            'Your employer covers the fee, not you',
            'Your details go to one matched solicitor only',
            'No obligation after the first call',
          ].map(s => (
            <div key={s} className="flex items-center gap-2 text-[13px] text-muted">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: '#4F7060' }}>
                <CheckIcon size={9} />
              </div>
              {s}
            </div>
          ))}
        </div>
      </form>

      {/* FAQ / Objection handler */}
      <div className="pt-4 border-t border-rule flex flex-col gap-3">
        <h4 className="sc-h3" style={{ fontSize: 18 }}>Questions people ask before they fill this in</h4>
        {[
          {
            q: 'Is this genuinely free for me?',
            a: 'Yes. Employment law requires your employer to contribute to the cost of your independent legal advice when you are presented with a settlement agreement. In practice, you pay nothing for the initial review. The solicitor\'s fee comes from your employer. That is a legal requirement, not a commercial arrangement.',
          },
          {
            q: 'Will I be contacted by multiple firms?',
            a: 'No. Your details are shared with one matched solicitor only. You will not be added to any marketing list or called by anyone else.',
          },
          {
            q: 'What if I have already signed?',
            a: 'In most cases a signed agreement is binding. If you signed recently under pressure, without fully understanding the terms, or without independent legal advice, speak to a solicitor before assuming nothing can change.',
          },
          {
            q: 'I am not sure I have a strong position. Should I still proceed?',
            a: 'Yes. Not being sure is the most common starting point. A solicitor will tell you in the first call whether there is anything worth pursuing. That assessment costs you nothing and commits you to nothing.',
          },
          {
            q: 'What if my situation does not fit the calculator?',
            a: 'The calculator gives a statutory and typical benchmark. It cannot capture every variable: seniority, contractual benefits, the specific reason for your departure. That is exactly what the solicitor review is for.',
          },
        ].map(({ q, a }) => (
          <details key={q} className="faq-item group">
            <summary className="flex justify-between items-center py-3.5 cursor-pointer list-none gap-4 text-[15px] font-medium text-ink">
              {q}
              <span className="faq-icon flex-shrink-0">+</span>
            </summary>
            <p className="sc-body pb-4 pr-4 leading-[1.65]">{a}</p>
          </details>
        ))}
      </div>
    </div>
  )
}

/* ── Non-converter fallback (Section 8) ─────────────────────────── */

function NonConverterFallback({ onScrollToSave }: { onScrollToSave: () => void }) {
  return (
    <div className="text-center py-6">
      <p className="text-[15px] text-ink font-medium mb-1">Not ready yet?</p>
      <p className="sc-body mb-3">Save your results and come back when you are. Most people take a few days to decide.</p>
      <button
        type="button"
        onClick={onScrollToSave}
        className="text-[14px] text-muted underline underline-offset-4 hover:text-ink transition-colors bg-transparent border-0 cursor-pointer"
      >
        Email me my results
      </button>
    </div>
  )
}

/* ── Inputs summary + inline edit panel ────────────────────────── */

const REASON_LABELS: Record<string, string> = {
  redundancy:            'Redundancy',
  redundancy_collective: 'Collective redundancy (20+ people)',
  dismissal:             'Unfair dismissal',
  constructive:          'Constructive dismissal',
  resignation:           'Resignation / mutual agreement',
}
const DISCRIMINATION_LABELS: Record<string, string> = {
  no:       'No',
  yes:      'Yes',
  not_sure: 'Not sure',
}

interface EditableInputs {
  salary: string
  yearsNum: string
  monthsNum: string
  age: string
  offer: string
  reason: string
  discrimination: string
  contractualNotice: string
}

function InputsSummaryPanel({
  inputs,
  onUpdate,
}: {
  inputs: EditableInputs
  onUpdate: (next: EditableInputs) => void
}) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<EditableInputs>(inputs)
  const [editingField, setEditingField] = useState<string | null>(null)

  function togglePanel() {
    if (!open) setDraft(inputs)
    setOpen(o => !o)
    setEditingField(null)
  }

  function set(k: keyof EditableInputs, v: string) {
    setDraft(d => ({ ...d, [k]: v }))
  }

  function apply() {
    onUpdate(draft)
    setOpen(false)
    setEditingField(null)
  }

  const fields: { key: keyof EditableInputs; label: string; display: (v: string) => string; type: 'number' | 'select' | 'pill'; options?: { value: string; label: string }[] }[] = [
    { key: 'salary',            label: 'Annual salary',         display: v => v ? `£${Number(v).toLocaleString('en-GB')}` : 'Not set', type: 'number' },
    { key: 'yearsNum',          label: 'Years of service',      display: v => v ? `${v} year${v === '1' ? '' : 's'}` : '0 years', type: 'number' },
    { key: 'monthsNum',         label: 'Additional months',     display: v => v ? `${v} month${v === '1' ? '' : 's'}` : '0 months', type: 'number' },
    { key: 'age',               label: 'Age',                   display: v => v || 'Not set', type: 'number' },
    { key: 'offer',             label: 'Settlement offer',      display: v => v ? `£${Number(v).toLocaleString('en-GB')}` : '£0', type: 'number' },
    { key: 'reason',            label: 'Reason for leaving',    display: v => REASON_LABELS[v] ?? v, type: 'select', options: Object.entries(REASON_LABELS).map(([value, label]) => ({ value, label })) },
    { key: 'discrimination',    label: 'Discrimination element',display: v => DISCRIMINATION_LABELS[v] ?? v, type: 'pill',   options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }, { value: 'not_sure', label: 'Not sure' }] },
    { key: 'contractualNotice', label: 'Contractual notice (weeks)', display: v => v ? `${v} week${v === '1' ? '' : 's'}` : '0 weeks', type: 'number' },
  ]

  return (
    <div>
      <button
        type="button"
        onClick={togglePanel}
        className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink transition-colors mb-8 bg-transparent border-0 cursor-pointer p-0"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Adjust calculator
      </button>

      {open && (
        <div className="bg-card border border-rule rounded-lg p-5 mb-8 flex flex-col gap-4" style={{ animation: 'sc-fade-in 200ms ease forwards' }}>
          <div className="flex items-center justify-between">
            <h3 className="sc-h3" style={{ fontSize: 17 }}>Your inputs</h3>
            <button type="button" onClick={() => setOpen(false)} className="text-[20px] text-muted hover:text-ink leading-none bg-transparent border-0 cursor-pointer">&times;</button>
          </div>

          <div className="flex flex-col divide-y divide-rule">
            {fields.map(f => (
              <div key={f.key} className="py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-muted mb-0.5">{f.label}</div>

                  {editingField === f.key ? (
                    <div className="mt-1.5">
                      {f.type === 'number' && (
                        <div className="input-wrap" style={{ maxWidth: 200 }}>
                          <input
                            type="number"
                            className="flex-1 border-0 bg-transparent outline-none py-2 px-3 text-[15px] text-ink"
                            value={draft[f.key]}
                            onChange={e => set(f.key, e.target.value)}
                            autoFocus
                          />
                        </div>
                      )}
                      {f.type === 'select' && f.options && (
                        <select
                          className="input-wrap py-2 px-3 text-[14px] text-ink bg-white border border-rule rounded-md outline-none"
                          value={draft[f.key]}
                          onChange={e => set(f.key, e.target.value)}
                          autoFocus
                        >
                          {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      )}
                      {f.type === 'pill' && f.options && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {f.options.map(o => (
                            <button
                              key={o.value}
                              type="button"
                              onClick={() => set(f.key, o.value)}
                              className="px-3 py-1.5 rounded-full text-[13px] font-medium border transition-colors"
                              style={{
                                background: draft[f.key] === o.value ? '#0B1F3A' : '#fff',
                                color: draft[f.key] === o.value ? '#fff' : '#0B1F3A',
                                borderColor: draft[f.key] === o.value ? '#0B1F3A' : '#E2DCCE',
                              }}
                            >
                              {o.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-[15px] text-ink font-medium">{f.display(inputs[f.key])}</div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setEditingField(editingField === f.key ? null : f.key)}
                  className="text-[12px] font-medium text-coral hover:underline bg-transparent border-0 cursor-pointer flex-shrink-0 mt-4"
                >
                  {editingField === f.key ? 'Done' : 'Edit'}
                </button>
              </div>
            ))}
          </div>

          <button type="button" onClick={apply} className="btn-primary self-start">
            Recalculate
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Main results content ───────────────────────────────────────── */

function ResultsContent() {
  const searchParams = useSearchParams()

  const [inputs, setInputs] = useState<EditableInputs>({
    salary:            searchParams.get('salary')            ?? '0',
    yearsNum:          searchParams.get('yearsNum')          ?? '0',
    monthsNum:         searchParams.get('monthsNum')         ?? '0',
    age:               searchParams.get('age')               ?? '0',
    offer:             searchParams.get('offer')             ?? '0',
    reason:            searchParams.get('reason')            ?? '',
    discrimination:    searchParams.get('discrimination')    ?? 'no',
    contractualNotice: searchParams.get('contractualNotice') ?? '0',
  })

  const salary            = parseFloat(inputs.salary)
  const yearsNum          = parseFloat(inputs.yearsNum)
  const monthsNum         = parseFloat(inputs.monthsNum)
  const totalMonths       = yearsNum * 12 + monthsNum
  const age               = parseInt(inputs.age)
  const offer             = parseFloat(inputs.offer)
  const reason            = inputs.reason
  const discrimination    = inputs.discrimination
  const contractualNotice = parseInt(inputs.contractualNotice)

  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>('GB')
  const [showJurisdictionToggle, setShowJurisdictionToggle] = useState(false)
  const [prefillEmail, setPrefillEmail] = useState('')
  const saveCardRef = useRef<HTMLDivElement>(null)

  const valid = salary > 0 && age > 0 && offer >= 0 && reason !== ''
  const result: VerdictResult | null = valid
    ? getVerdict(salary, totalMonths, age, offer, reason, discrimination, contractualNotice, jurisdiction)
    : null

  const saveParams = {
    salary, yearsNum, monthsNum, age, offer, reason, discrimination,
    contractualNotice, jurisdiction,
  }

  function scrollToSave() {
    saveCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => saveCardRef.current?.querySelector<HTMLButtonElement>('[data-email-trigger]')?.click(), 400)
  }

  return (
    <>
      <Nav />
      <main className="bg-paper-2 min-h-screen pb-24" style={{ animation: 'sc-fade-in 400ms ease forwards' }}>
        <div className="sc-container pt-12" style={{ maxWidth: 860 }}>

          <InputsSummaryPanel inputs={inputs} onUpdate={setInputs} />

          {!valid && (
            <div className="bg-amber-tint border border-[#E0CB94] rounded-lg p-6 mb-6">
              <p className="text-amber font-medium">Missing details. Please go back and complete the calculator.</p>
              <Link href="/" className="mt-3 inline-block text-[14px] text-ink underline underline-offset-4">Return to calculator</Link>
            </div>
          )}

          {result && (
            <div className="flex flex-col gap-6">

              {/* 1. Bridge line */}
              <p className="sc-body text-muted">Based on your inputs, here is where your offer stands.</p>

              {/* 2. Jurisdiction indicator */}
              <div className="text-[13px] text-muted flex flex-wrap items-center gap-2">
                <span>Results calculated for {jurisdiction === 'NI' ? 'Northern Ireland' : 'England, Scotland and Wales'} (£{jurisdiction === 'NI' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB} per week cap).</span>
                {!showJurisdictionToggle && (
                  <button type="button" onClick={() => setShowJurisdictionToggle(true)} className="underline underline-offset-2 hover:text-ink transition-colors bg-transparent border-0 cursor-pointer text-[13px] text-muted">Change</button>
                )}
                {showJurisdictionToggle && (
                  <div className="flex gap-2">
                    {(['GB', 'NI'] as const).map(j => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => { setJurisdiction(j); setShowJurisdictionToggle(false) }}
                        className="px-3 py-1 rounded-full text-[12px] font-medium border transition-colors"
                        style={{ background: jurisdiction === j ? '#0B1F3A' : '#fff', color: jurisdiction === j ? '#fff' : '#0B1F3A', borderColor: jurisdiction === j ? '#0B1F3A' : '#E2DCCE' }}
                      >
                        {j === 'GB' ? 'England, Scotland or Wales' : 'Northern Ireland'}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Social proof */}
              <Testimonials />

              {/* 4. Verdict panel */}
              <VerdictPanel result={result} offer={offer} salary={salary} yearsNum={Math.floor(yearsNum)} age={age} />

              {/* 5. Discrimination flag (conditional) */}
              {result.discriminationFlag && <DiscriminationFlag />}

              {/* 6. Signing deadline */}
              <SigningDeadline />

              {/* 7. Breakdown table */}
              <BreakdownTable result={result} offer={offer} salary={salary} />

              {/* 8. Save and share */}
              <SaveCard
                resultRef={saveCardRef}
                result={result}
                offer={offer}
                onEmailCapture={em => setPrefillEmail(em)}
                params={saveParams}
              />

              {/* 9. Lead capture */}
              <LeadForm verdict={result.verdict} offer={offer} salary={salary} totalMonths={totalMonths} prefillEmail={prefillEmail} />

              {/* 10. Non-converter fallback */}
              <NonConverterFallback onScrollToSave={scrollToSave} />

              <p className="text-[12px] text-muted-2 leading-[1.6] text-center px-4">
                Estimate based on published UK statutory rates (weekly pay cap £{WEEKLY_CAP_GB} GB / £{WEEKLY_CAP_NI} NI, 2025/26). Not legal advice. SettlementCheck connects you with SRA-regulated solicitors and is not a law firm.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function ResultsClient() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-paper-2 flex items-center justify-center">
        <p className="text-muted text-[15px]">Loading your results…</p>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
