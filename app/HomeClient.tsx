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
  { n: '£0',     l: 'Cost to you' },
  { n: '24 hrs', l: 'Solicitor response' },
  { n: '4.9★',   l: 'Average rating' },
]

const STEPS = [
  {
    n: '01',
    t: 'Check your offer',
    d: 'Enter six details and get an instant estimate of whether your offer is fair, below, or above the typical UK range — based on statutory rates.',
  },
  {
    n: '02',
    t: 'Match with a solicitor',
    d: 'We introduce you to 2–3 vetted, SRA-regulated employment solicitors in your region within 24 hours. You decide who to speak with.',
  },
  {
    n: '03',
    t: 'Get advice — free to you',
    d: 'Your employer is legally required to cover your legal fees (typically £350–750). You pay absolutely nothing for the advice.',
  },
]

const TRUST = [
  {
    t: 'Genuinely independent',
    d: "We don't represent any single firm. The panel is curated, the introductions are unbiased.",
  },
  {
    t: 'Your employer pays',
    d: 'Under UK practice, employers contribute £350–750 toward your independent legal advice on a settlement.',
  },
  {
    t: 'Vetted specialists only',
    d: 'Every panel solicitor is SRA-regulated and demonstrably specialised in employment settlements.',
  },
  {
    t: '24-hour response',
    d: 'Every firm on the panel commits to making contact within 24 hours of an introduction.',
  },
]

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7.5L6 11L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Client component ────────────────────────────────────────────── */
export default function HomeClient() {
  const router = useRouter()

  function handleCalculate(payload: CalcPayload) {
    const p = new URLSearchParams({
      salary:         payload.inputs.salary,
      years:          payload.inputs.years,
      age:            payload.inputs.age,
      offer:          payload.inputs.offer,
      reason:         payload.inputs.reason,
      discrimination: payload.inputs.discrimination,
    })
    router.push(`/results?${p.toString()}`)
  }

  return (
    <>
      <Nav />
      <main>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: '#F7F4EE', paddingTop: 56, paddingBottom: 40 }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 50% at 90% 10%, rgba(217,96,59,0.06) 0%, transparent 70%), ' +
                'radial-gradient(ellipse 50% 60% at 5% 90%, rgba(11,31,58,0.05) 0%, transparent 70%)',
            }}
          />

          <div className="sc-container relative">
            <div
              className="grid items-center gap-16 max-[900px]:grid-cols-1"
              style={{ gridTemplateColumns: '1.05fr 1fr' }}
            >
              {/* Left */}
              <div className="flex flex-col gap-6 max-w-[560px]">
                <span className="inline-flex items-center gap-2 self-start border border-rule-strong rounded-pill px-3 py-1.5 text-[12px] font-medium text-ink tracking-[0.02em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral inline-block" aria-hidden="true" />
                  Free · Confidential · No obligation
                </span>

                <h1 className="sc-h1">
                  Is your settlement<br />
                  offer <em style={{ fontStyle: 'italic', color: '#D9603B' }}>truly fair</em>?
                </h1>

                <p className="sc-lead max-w-[56ch]">
                  Find out in 60 seconds. Our free calculator estimates whether your employer&apos;s offer falls below, within, or above the typical UK range — then connects you with a specialist solicitor. Your employer pays their legal fees.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-5 border-t border-rule text-[14px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="text-coral tracking-[0.05em]">★★★★★</span>{' '}
                    <strong className="text-ink">4.9</strong>/5
                  </span>
                  <span className="text-rule-strong" aria-hidden="true">·</span>
                  <span><strong className="text-ink">2,400+</strong> employees helped</span>
                  <span className="text-rule-strong" aria-hidden="true">·</span>
                  <span><strong className="text-ink">£0</strong> cost to you</span>
                </div>
              </div>

              {/* Right */}
              <div>
                {/* <Calculator onCalculate={handleCalculate} /> */}
                <div style={{ padding: '40px', background: '#fff', borderRadius: '12px', border: '1px solid #ddd' }}>
                  Calculator temporarily disabled for diagnostic
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ... other sections ... */}

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="py-section bg-paper">
          <div className="sc-container">
            <div
              className="grid gap-20 max-[900px]:grid-cols-1"
              style={{ gridTemplateColumns: '1fr 1.4fr' }}
            >
              <div className="flex flex-col gap-3.5 max-w-[480px]">
                <span className="sc-eyebrow">Common questions</span>
                <h2 className="sc-h2">What people ask before they start.</h2>
                <p className="sc-lead">Six things almost every employee wants to know before clicking &ldquo;calculate.&rdquo;</p>
              </div>
              {/* <FaqAccordion /> */}
              <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                FAQ temporarily disabled for diagnostic
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden"
          style={{ background: '#0B1F3A', padding: '88px 32px' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 36% 80% at 90% 50%, rgba(217,96,59,0.18) 0%, transparent 70%)',
            }}
          />
          <div className="sc-container relative">
            <div
              className="grid items-center gap-10 max-[720px]:grid-cols-1"
              style={{ gridTemplateColumns: '1.4fr auto' }}
            >
              <div>
                <h2 className="sc-h2 text-white" style={{ maxWidth: '18ch' }}>Not sure if your offer is fair?</h2>
                <p className="text-white/[0.78] text-[18px] mt-3" style={{ maxWidth: '46ch' }}>
                  Use the free calculator. It takes about a minute, and there&apos;s no obligation to proceed.
                </p>
              </div>
              <Link href="/#calculator" className="btn-accent whitespace-nowrap">
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
