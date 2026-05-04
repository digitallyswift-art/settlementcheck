'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Calculator, { CalcPayload } from '@/components/Calculator'
import FaqAccordion from '@/components/FaqAccordion'

/* ── Data ────────────────────────────────────────────────────────── */
const STATS = [
  { n: '2,400+', l: 'Employees helped' },
  { n: '£0',     l: 'Your employer pays' },
  { n: '24 hrs', l: 'Solicitor response' },
  { n: 'SRA',    l: 'Regulated solicitors' },
]

const STEPS = [
  {
    n: '01',
    t: 'Check your offer',
    d: 'Enter six details and get an instant estimate of whether your offer is fair, below, or above the typical UK range. Based on statutory rates.',
  },
  {
    n: '02',
    t: 'Match with a solicitor',
    d: 'We match you to a vetted employment specialist within 24 hours. Every solicitor on our panel handles settlement agreements regularly and is SRA-regulated.',
  },
  {
    n: '03',
    t: 'Get honest advice',
    d: 'Your employer is required to cover your legal fees, typically £350 to £750. Your solicitor\'s job is to advise you honestly, not to push you to sign.',
  },
]

const TRUST = [
  {
    t: 'Genuinely independent',
    d: 'Every other settlement calculator online was built by a law firm that wants your case. Ours was not. We have no firm to push you towards. The result you get is honest.',
  },
  {
    t: 'Your employer pays',
    d: 'Under UK practice, employers contribute £350 to £750 toward your independent legal advice on a settlement.',
  },
  {
    t: 'Vetted specialists only',
    d: 'Every panel solicitor is SRA-regulated and demonstrably specialised in employment settlements.',
  },
  {
    t: '24-hour response',
    d: 'You have a deadline. All solicitors on our panel commit to responding within 24 hours. Most get back to you the same day.',
  },
]

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7.5L6 11L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function HomeClient() {
  const router = useRouter()

  function handleCalculate(payload: CalcPayload) {
    const p = new URLSearchParams({
      salary:             payload.inputs.salary,
      yearsNum:           payload.inputs.yearsNum,
      monthsNum:          payload.inputs.monthsNum,
      age:                payload.inputs.age,
      offer:              payload.inputs.offer,
      reason:             payload.inputs.reason,
      discrimination:     payload.inputs.discrimination,
      contractualNotice:  payload.inputs.contractualNotice,
    })
    router.push(`/results?${p.toString()}`)
  }

  return (
    <>
      <Nav />
      <main>
        <section
          className="relative overflow-hidden py-14 md:py-[72px]"
          style={{ background: '#F7F4EE' }}
        >
          <div className="sc-container relative">
            <div className="hero-grid grid gap-10 md:gap-12 items-center lg:grid-cols-[1.05fr_1fr]">
              <div className="flex flex-col gap-6 md:gap-7">
                {/* Hero Pill */}
                <div className="flex">
                  <span className="inline-flex items-center gap-2 border border-rule-strong rounded-full px-4 py-1.5 text-[12px] font-medium text-ink bg-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                    Independent · Not owned by a law firm · Free to use
                  </span>
                </div>

                <h1 className="sc-h1">
                  Is your settlement<br />
                  offer <em style={{ fontStyle: 'italic', color: '#D9603B' }}>fair</em>?
                </h1>

                <p className="sc-lead text-[17px] md:text-[19px] leading-[1.6]">
                  Most settlement calculators online are built by law firms trying to capture your case. Ours is not. Get an honest estimate of where your offer stands, then get matched with a vetted employment specialist within 24 hours. Your employer pays their legal fees.
                </p>

                {/* Inline Stats */}
                <div className="flex items-center gap-3 pt-2 text-[12px] text-muted whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/>
                    </svg>
                    <span>SRA-regulated</span>
                  </div>
                  <span className="text-rule-strong">|</span>
                  <span><strong className="text-ink">2,400+</strong> employees helped</span>
                  <span className="text-rule-strong">|</span>
                  <span>Employer <strong className="text-ink">pays fees</strong></span>
                </div>

                <p className="text-[14px] text-muted leading-[1.55]">
                  Most settlement agreements have a 10-day response window. We can have a specialist speaking with you within 24 hours.
                </p>
              </div>

              <div>
                <Calculator onCalculate={handleCalculate} />
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ─────────────────────────────────────────── */}
        <section className="bg-paper-2 border-y border-rule py-9">
          <div className="sc-container">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {STATS.map((s, i) => (
                <div
                  key={i}
                  className={`flex flex-col pl-6 py-4 md:py-2 border-rule ${
                    i % 2 !== 0 ? 'border-l' : ''
                  } md:border-l-0 ${i > 0 ? 'md:border-l' : ''}`}
                >
                  <span
                    className="font-serif text-ink"
                    style={{ fontSize: 40, fontWeight: 420, lineHeight: 1, letterSpacing: '-0.02em' }}
                  >
                    {s.n}
                  </span>
                  <span className="text-[13px] text-muted mt-2">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────────────── */}
        <section id="how" className="py-section bg-paper">
          <div className="sc-container">
            <div className="flex flex-col gap-3.5 max-w-[640px]">
              <span className="sc-eyebrow">How it works</span>
              <h2 className="sc-h2">Three steps. Sixty seconds. Zero cost.</h2>
              <p className="sc-lead">From a quick check to a vetted solicitor on the phone. No cost to you.</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-14 max-[900px]:grid-cols-1">
              {STEPS.map((s, i) => (
                <article
                  key={i}
                  className="bg-card border border-rule rounded-lg p-8 hover:border-rule-strong transition-colors duration-[160ms]"
                >
                  <div
                    className="font-serif text-coral"
                    style={{ fontSize: 56, fontWeight: 420, lineHeight: 1, letterSpacing: '-0.04em' }}
                  >
                    {s.n}
                  </div>
                  <h3 className="sc-h3 mt-7">{s.t}</h3>
                  <p className="text-[15px] text-muted mt-3 leading-[1.55]">{s.d}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ─────────────────────────────────────────────── */}
        <section id="about" className="py-section bg-paper-2 border-y border-rule">
          <div className="sc-container">
            <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-[1fr_1.05fr]">
              <div className="flex flex-col gap-3.5">
                <span className="sc-eyebrow">Why SettlementCheck</span>
                <h2 className="sc-h2">An introduction service built for the employee, not the employer.</h2>
                <p className="sc-lead">
                  Most settlement enquiries route to firms that pay for the lead. We don&apos;t take payment from firms. Solicitors pay a small monthly subscription for panel access. That keeps the introduction honest.
                </p>
              </div>

              <div className="flex flex-col">
                {TRUST.map((it, i) => (
                  <div
                    key={i}
                    className="grid gap-4 py-5 border-b border-rule items-start"
                    style={{ gridTemplateColumns: '28px 1fr' }}
                  >
                    <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-white flex-shrink-0 mt-0.5">
                      <Check />
                    </div>
                    <div>
                      <div className="font-serif text-[17px] md:text-[19px] font-460 text-ink tracking-[-0.008em] leading-[1.3]">{it.t}</div>
                      <div className="text-[15px] text-muted mt-1 leading-[1.55]">{it.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="py-section bg-paper">
          <div className="sc-container">
            <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-[1fr_1.4fr]">
              <div className="flex flex-col gap-3.5">
                <span className="sc-eyebrow">Common questions</span>
                <h2 className="sc-h2">What people ask before they start.</h2>
                <p className="sc-lead">Six things almost every employee wants to know before clicking &ldquo;calculate.&rdquo;</p>
              </div>
              <FaqAccordion />
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-16 px-5 md:py-[88px] md:px-8"
          style={{ background: '#0B1F3A' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 36% 80% at 90% 50%, rgba(217,96,59,0.18) 0%, transparent 70%)',
            }}
          />
          <div className="sc-container relative">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-10">
              <div>
                <h2 className="sc-h2 text-white" style={{ maxWidth: '18ch' }}>Not sure if your offer is fair?</h2>
                <p className="text-white/[0.78] text-[17px] md:text-[18px] mt-3" style={{ maxWidth: '46ch' }}>
                  Our calculator is not run by a law firm. Get an honest estimate, then speak to a specialist within 24 hours.
                </p>
              </div>
              <Link href="/#calculator" className="btn-accent whitespace-nowrap self-start md:self-auto">
                Check my offer now →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
