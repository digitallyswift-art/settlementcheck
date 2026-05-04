'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { getVerdict, formatCurrency, VerdictResult, Verdict } from '@/lib/calculations'

/* ── Verdict config ─────────────────────────────────────────────── */
const VERDICT_CONFIG: Record<Verdict, {
  cardCls: string
  borderColor: string
  tagCls: string
  tagBorder: string
  tagColor: string
  tagText: string
  icon: string
  heading: string
  body: (r: VerdictResult, offer: number) => string
}> = {
  BELOW_MINIMUM: {
    cardCls: 'bg-crimson-tint',
    borderColor: '#D9A99E',
    tagCls: 'bg-white text-crimson',
    tagBorder: '#D9A99E',
    tagColor: '#A8341F',
    tagText: 'Action recommended',
    icon: '⚠',
    heading: 'Your offer appears below the legal minimum',
    body: (r, offer) =>
      `Based on your inputs, your statutory minimum entitlement is approximately ${formatCurrency(r.minimum)}. Your offer of ${formatCurrency(offer)} appears to fall short of this floor. A solicitor should review immediately.`,
  },
  BELOW_TYPICAL: {
    cardCls: 'bg-amber-tint',
    borderColor: '#E0CB94',
    tagCls: 'bg-white text-amber',
    tagBorder: '#E0CB94',
    tagColor: '#B5802A',
    tagText: 'Likely below typical',
    icon: '↓',
    heading: 'Your offer may be below the typical range',
    body: (r) =>
      `For circumstances similar to yours, settlements typically fall between ${formatCurrency(r.typicalLow)} and ${formatCurrency(r.typicalHigh)}. Many employees successfully negotiate higher with legal support.`,
  },
  WITHIN_RANGE: {
    cardCls: 'bg-sage-tint',
    borderColor: '#BCD0BF',
    tagCls: 'bg-white text-sage',
    tagBorder: '#BCD0BF',
    tagColor: '#4F7060',
    tagText: 'Within range',
    icon: '✓',
    heading: 'Your offer appears within the typical range',
    body: (r) =>
      `For circumstances similar to yours, settlements typically fall between ${formatCurrency(r.typicalLow)} and ${formatCurrency(r.typicalHigh)}. A solicitor can confirm whether the structure (tax-free portion, references, restrictive covenants) is favourable.`,
  },
  ABOVE_TYPICAL: {
    cardCls: 'bg-sage-tint',
    borderColor: '#BCD0BF',
    tagCls: 'bg-white text-sage',
    tagBorder: '#BCD0BF',
    tagColor: '#4F7060',
    tagText: 'Above typical',
    icon: '↑',
    heading: 'Your offer appears above the typical range',
    body: (r, offer) =>
      `Your offer of ${formatCurrency(offer)} sits above the typical band of ${formatCurrency(r.typicalLow)} to ${formatCurrency(r.typicalHigh)}. A solicitor should still review the structure and any waivers before you sign.`,
  },
}

/* ── Lead Form ──────────────────────────────────────────────────── */
interface LeadPayload {
  verdict: string
  offer: number
  salary: number
  totalMonths: number
}

function LeadForm({ payload }: { payload: LeadPayload }) {
  const [form, setForm] = useState({
    first_name: '',
    email: '',
    phone: '',
    contact_time: 'Morning',
    consent: false,
  })
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
    if (!form.consent) e.consent = 'Please consent to be contacted'
    setErrors(e)
    if (Object.keys(e).length) return

    setStatus('submitting')
    try {
      await fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          first_name: form.first_name,
          email: form.email,
          phone: form.phone,
          contact_time: form.contact_time,
          verdict: payload.verdict,
          offer_amount: payload.offer,
          salary: payload.salary,
          months_service: payload.totalMonths,
        }),
      })
      setStatus('success')
    } catch {
      setErrors({ form: 'Something went wrong. Please try again.' })
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-sage-tint border border-[#BCD0BF] rounded-lg p-7 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-sage flex items-center justify-center text-white text-2xl">✓</div>
        <h3 className="sc-h3">Thank you, {form.first_name}.</h3>
        <p className="text-muted text-[15px] max-w-[52ch]">
          We&apos;ve received your details. A vetted employment solicitor will call you on{' '}
          <strong className="text-ink">{form.phone}</strong> within{' '}
          <strong className="text-ink">24 hours</strong> ({form.contact_time.toLowerCase()} preferred).
          The advice is free. Your employer covers the cost.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="bg-card border border-rule rounded-lg p-7 flex flex-col gap-5">
      <div>
        <span className="sc-eyebrow">Step 2 of 2</span>
        <h3 className="sc-h3 mt-1.5">Get matched with the right specialist</h3>
        <p className="text-muted text-[15px] mt-1.5 max-w-[54ch]">
          Your employer is required to cover your legal fees. We will match you to a vetted employment solicitor within 24 hours. They handle settlement agreements regularly, not a general practice firm.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 max-[520px]:grid-cols-1">
        {/* First name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink">First name</label>
          <div className="input-wrap">
            <input
              type="text"
              className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2"
              placeholder="Alex"
              value={form.first_name}
              onChange={e => update('first_name', e.target.value)}
            />
          </div>
          {errors.first_name && <span className="text-[12px] text-crimson">{errors.first_name}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink">Email</label>
          <div className="input-wrap">
            <input
              type="email"
              className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2"
              placeholder="alex@example.com"
              value={form.email}
              onChange={e => update('email', e.target.value)}
            />
          </div>
          {errors.email && <span className="text-[12px] text-crimson">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink">Phone</label>
          <div className="input-wrap">
            <input
              type="tel"
              className="flex-1 border-0 bg-transparent outline-none py-3 px-3.5 text-[15px] text-ink placeholder-muted-2"
              placeholder="07…"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
            />
          </div>
          {errors.phone && <span className="text-[12px] text-crimson">{errors.phone}</span>}
        </div>

        {/* Contact time */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-ink">Preferred contact time</label>
          <div className="pill-radio" role="radiogroup">
            {(['Morning', 'Afternoon', 'Evening'] as const).map(t => (
              <button
                key={t}
                type="button"
                className="pill-radio-btn"
                aria-pressed={form.contact_time === t}
                onClick={() => update('contact_time', t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consent */}
      <label
        className="grid gap-3 cursor-pointer items-start"
        style={{ gridTemplateColumns: '18px 1fr' }}
      >
        <input
          type="checkbox"
          className="mt-0.5 w-4 h-4 accent-ink"
          checked={form.consent}
          onChange={e => update('consent', e.target.checked)}
        />
        <span className="text-[13px] text-muted leading-[1.55]">
          I consent to SettlementCheck sharing my details with up to 3 vetted SRA-regulated solicitors so they may contact me about my settlement.
        </span>
      </label>
      {errors.consent && <span className="text-[12px] text-crimson -mt-3">{errors.consent}</span>}
      {errors.form && <span className="text-[13px] text-crimson">{errors.form}</span>}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="btn-accent w-full py-4 text-[16px] disabled:opacity-60"
      >
        {status === 'submitting' ? 'Submitting…' : 'Get my free solicitor match →'}
      </button>
    </form>
  )
}

/* ── Results Content ─────────────────────────────────────────────── */
function ResultsContent() {
  const searchParams = useSearchParams()
  const salary   = parseFloat(searchParams.get('salary')   ?? '0')
  const yearsNum = parseFloat(searchParams.get('yearsNum') ?? '0')
  const monthsNum = parseFloat(searchParams.get('monthsNum') ?? '0')
  const totalMonths = (yearsNum * 12) + monthsNum
  const age    = parseInt(searchParams.get('age')   ?? '0')
  const offer  = parseFloat(searchParams.get('offer') ?? '0')
  const reason             = searchParams.get('reason')             ?? ''
  const discrimination     = searchParams.get('discrimination')     ?? 'no'
  const contractualNoticeWeeks = parseInt(searchParams.get('contractualNotice') ?? '0')

  const valid = salary > 0 && age > 0 && offer >= 0 && reason !== ''

  const result: VerdictResult | null = valid
    ? getVerdict(salary, totalMonths, age, offer, reason, discrimination, contractualNoticeWeeks)
    : null

  const cfg = result ? VERDICT_CONFIG[result.verdict] : null

  return (
    <>
      <Nav />
      <main className="bg-paper-2 min-h-screen pb-24">
        <div className="sc-container pt-14" style={{ maxWidth: 900 }}>
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-ink transition-colors mb-8"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Adjust calculator
          </Link>

          {!valid && (
            <div className="bg-amber-tint border border-[#E0CB94] rounded-lg p-6 mb-6">
              <p className="text-amber font-medium">Missing details. Please go back and complete the calculator.</p>
              <Link href="/" className="mt-3 inline-block text-[14px] text-ink underline underline-offset-4">
                ← Return to calculator
              </Link>
            </div>
          )}

          {result && cfg && (
            <div className="flex flex-col gap-6">
              {/* ── Verdict card ── */}
              <div
                className={`${cfg.cardCls} rounded-lg p-8`}
                style={{ border: `1px solid ${cfg.borderColor}` }}
              >
                {/* Tag */}
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-pill text-[11px] font-semibold tracking-[0.10em] uppercase mb-4"
                  style={{ background: '#fff', color: cfg.tagColor, border: `1px solid ${cfg.tagBorder}` }}
                >
                  {cfg.icon} {cfg.tagText}
                </span>

                <h2 className="sc-h2">{cfg.heading}</h2>
                <p className="text-[15px] text-muted mt-3 leading-[1.55] max-w-[66ch]">
                  {cfg.body(result, offer)}
                </p>

                {/* Numbers */}
                <div
                  className="grid mt-6 pt-6"
                  style={{ borderTop: '1px solid rgba(11,31,58,0.12)', gridTemplateColumns: '1fr 1px 1fr', gap: 0 }}
                >
                  <div className="pr-8">
                    <div className="sc-eyebrow mb-2">Your offer</div>
                    <div
                      className="font-serif text-ink"
                      style={{ fontSize: 28, fontWeight: 420, letterSpacing: '-0.015em' }}
                    >
                      {formatCurrency(offer)}
                    </div>
                  </div>
                  <div style={{ background: 'rgba(11,31,58,0.12)' }} aria-hidden="true" />
                  <div className="pl-8">
                    <div className="sc-eyebrow mb-2">Typical range</div>
                    <div
                      className="font-serif text-ink"
                      style={{ fontSize: 28, fontWeight: 420, letterSpacing: '-0.015em' }}
                    >
                      {formatCurrency(result.typicalLow)} to {formatCurrency(result.typicalHigh)}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Discrimination flag ── */}
              {result.discriminationFlag && (
                <div className="bg-info-tint border border-[#B9CADD] rounded-md p-4 text-[14px] text-info leading-[1.55]">
                  <strong>⚡ Potential discrimination flagged.</strong>{' '}
                  Discrimination claims are <em>uncapped</em> in UK employment tribunals and can substantially increase settlement value. A specialist solicitor must assess this with you.
                </div>
              )}

              {/* ── Breakdown table ── */}
              <div className="bg-card border border-rule rounded-lg overflow-hidden">
                <div className="px-7 py-5 border-b border-rule">
                  <h3 className="sc-h3">How we calculated this</h3>
                </div>
                <table className="w-full text-[14px] border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left px-7 py-3.5 text-[12px] font-medium text-muted uppercase tracking-[0.06em] border-b border-rule">Item</th>
                      <th className="text-right px-7 py-3.5 text-[12px] font-medium text-muted uppercase tracking-[0.06em] border-b border-rule">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      result.redundancy > 0 && { label: 'Statutory redundancy pay', value: result.redundancy, highlight: false },
                      result.basicAward > 0  && { label: 'Basic award (unfair dismissal)', value: result.basicAward, highlight: false },
                      {
                        label: result.noticeIsContractual
                          ? `Notice pay (contractual, ${result.noticeWeeksUsed} weeks)`
                          : `Notice pay (statutory, ${result.noticeWeeksUsed} week${result.noticeWeeksUsed !== 1 ? 's' : ''})`,
                        value: result.notice,
                        highlight: false,
                      },
                      { label: 'Estimated minimum',     value: result.minimum,    highlight: true  },
                      { label: 'Typical low',           value: result.typicalLow, highlight: false },
                      { label: 'Typical high',          value: result.typicalHigh,highlight: false },
                      { label: 'Your offer',            value: offer,             highlight: true  },
                    ].filter((r): r is { label: string; value: number; highlight: boolean } => Boolean(r)).map((row, i, arr) => (
                      <tr
                        key={row.label}
                        className={row.highlight ? 'bg-paper' : ''}
                        style={{ borderBottom: i < arr.length - 1 ? '1px solid #E2DCCE' : undefined }}
                      >
                        <td className={`px-7 py-3.5 ${row.highlight ? 'font-medium text-ink' : 'text-muted'}`}>
                          {row.label}
                        </td>
                        <td className={`px-7 py-3.5 text-right font-mono tabular-nums ${row.highlight ? 'font-medium text-ink' : 'text-ink'}`}>
                          {formatCurrency(row.value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Lead form ── */}
              <LeadForm payload={{ verdict: result.verdict, offer, salary, totalMonths }} />

              {/* Disclaimer */}
              <p className="text-[12px] text-muted-2 leading-[1.6] text-center px-4">
                Estimate based on published UK statutory rates (weekly pay cap £719, 2025/26). Not legal advice.
                SettlementCheck connects you with SRA-regulated solicitors and is not a law firm.
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
