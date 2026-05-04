'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

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

export default function HomeClient() {
  const router = useRouter()

  return (
    <>
      <Nav />
      <main>
        {/* HERO */}
        <section
          className="relative overflow-hidden"
          style={{ background: '#F7F4EE', paddingTop: 56, paddingBottom: 40 }}
        >
          <div className="sc-container relative">
            <div className="flex flex-col gap-6 max-w-[560px]">
                <h1 className="sc-h1">Is your settlement offer fair?</h1>
                <p className="sc-lead">Find out in 60 seconds with our free calculator.</p>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="bg-paper-2 border-y border-rule py-9">
          <div className="sc-container">
            <div className="grid grid-cols-4 max-[720px]:grid-cols-2">
              {STATS.map((s, i) => (
                <div key={i} className="flex flex-col pl-6 border-l border-rule-strong first:border-l-0">
                  <span className="font-serif text-[40px] leading-none">{s.n}</span>
                  <span className="text-[13px] text-muted mt-2">{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
