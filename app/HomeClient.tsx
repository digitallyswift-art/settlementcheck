'use client'

import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

/* ── Data ────────────────────────────────────────────────────────── */
const STATS = [
  { n: '£0',      l: 'No cost to you' },
  { n: '£751',    l: 'Weekly pay cap 2025/26' },
  { n: '10 days', l: 'Typical signing window' },
  { n: 'Net pay', l: 'PILON and £30k exemption split' },
]

const STEPS = [
  {
    n: '01',
    t: 'Know your position before you respond',
    d: 'Enter your salary, length of service, and the offer on the table. You will get an instant read on whether it sits below the typical range, within range, or above it. That is the information you need before you reply to anything.',
  },
  {
    n: '02',
    t: 'Match with a solicitor who negotiates',
    d: 'A solicitor who handles settlement agreements regularly knows what employers will move on and by how much. Matching launches shortly. Add your details and we will notify you the moment it goes live.',
  },
  {
    n: '03',
    t: 'Get advice and recover what you are owed',
    d: 'Your employer covers the cost of your legal advice. A solicitor reviews your offer, tells you what is negotiable, and handles the conversation with your employer\'s legal team. You do not pay.',
  },
]

const TRUST = [
  {
    t: 'Genuinely independent',
    d: 'Every other settlement calculator online was built by a firm that wants your case. This one was not. There is no firm behind this result. What you see is what the numbers say.',
  },
  {
    t: 'Your employer pays',
    d: 'Under UK practice, your employer pays £350 to £750 toward the cost of independent legal advice on a settlement. In most cases, that covers the full fee.',
  },
  {
    t: 'Built on UK statute',
    d: 'The calculator applies the Employment Rights Act 1996 sections on redundancy, notice, and unfair dismissal awards, plus the £30,000 tax-free rule under ITEPA 2003 section 403.',
  },
  {
    t: 'Solicitor matching launching soon',
    d: 'We are building a panel of vetted SRA-regulated employment specialists. The matching service launches shortly. The calculator is free to use today.',
  },
]

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7.5L6 11L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export interface StatutoryRow { label: string; y2425: string; y2526: string }

export interface HomeProps {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  statutoryRows?: StatutoryRow[];
}

export default function HomeClient({ title, lead, statutoryRows = [] }: HomeProps = {}) {
  return (
    <>
      <Nav />
      <main>
        <section
          id="calculator"
          className="relative overflow-hidden py-14 md:py-[72px]"
          style={{ background: '#F7F4EE' }}
        >
          <div className="sc-container relative">
            <div className="hero-grid grid gap-10 md:gap-12 items-center lg:grid-cols-[1.05fr_1fr]">
              <div className="flex flex-col gap-6 md:gap-7 min-w-0">
                {/* Hero Pill */}
                <div className="flex">
                  <span className="inline-flex items-center gap-2 border border-rule-strong rounded-full px-4 py-1.5 text-[12px] font-medium text-ink bg-white/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                    Independent · Not a law firm · Free to use
                  </span>
                </div>

                {/* SEO keyword eyebrow — carries primary keyword as visible text, H1 carries the USP */}
                <p className="sc-eyebrow" style={{ letterSpacing: '0.10em' }}>
                  Employment Settlement Agreement Calculator UK
                </p>

                <h1 className="sc-h1">
                  {title || (
                    <>
                      Your opening offer is<br />
                      almost always <em style={{ fontStyle: 'italic', color: '#D9603B' }}>negotiable.</em>
                    </>
                  )}
                </h1>

                {lead ? (
                  <p className="sc-lead">{lead}</p>
                ) : (
                  <ul className="flex flex-col gap-3.5 pt-1">
                    {[
                      {
                        icon: (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <rect x="2" y="5" width="20" height="14" rx="2"/>
                            <path d="M2 10h20"/>
                            <circle cx="12" cy="15" r="1.5" fill="currentColor" stroke="none"/>
                          </svg>
                        ),
                        label: 'Your actual take-home figure',
                        detail: 'See net pay after tax, PILON, and the £30k exemption split.',
                      },
                      {
                        icon: (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <line x1="18" y1="20" x2="18" y2="10"/>
                            <line x1="12" y1="20" x2="12" y2="4"/>
                            <line x1="6" y1="20" x2="6" y2="14"/>
                            <path d="M3 20h18"/>
                          </svg>
                        ),
                        label: 'Is your offer in range',
                        detail: 'Compare your settlement against UK statutory rates for 2025/26.',
                      },
                      {
                        icon: (
                          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 5v14M5 12l7-7 7 7"/>
                          </svg>
                        ),
                        label: 'First offers are negotiable',
                        detail: 'Most employees don\'t realise their offer can be improved.',
                      },
                    ].map(({ icon, label, detail }, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-0.5 flex-shrink-0 flex items-center justify-center rounded-lg text-coral"
                          style={{ background: 'rgba(217,96,59,0.09)', width: 34, height: 34 }}
                        >
                          {icon}
                        </span>
                        <span className="flex flex-col gap-0.5 pt-0.5">
                          <span className="sc-body font-semibold text-ink leading-snug tracking-[-0.01em]">{label}</span>
                          <span className="sc-body leading-snug">{detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <div style={{
                  borderRadius: 20,
                  border: '1px solid rgba(11,31,58,0.10)',
                  overflow: 'hidden',
                  boxShadow: '0 24px 60px -12px rgba(11,31,58,0.22), 0 8px 24px -6px rgba(11,31,58,0.10)',
                  background: 'linear-gradient(170deg, #F5F1E9 0%, #EDE8DF 30%, #E8E2D8 60%, #F0EDE6 100%)',
                  padding: '36px 36px 32px',
                }}>
                  <span style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A93A3', marginBottom: 20 }}>
                    Free calculator
                  </span>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 420, lineHeight: 1.3, color: '#0B1F3A', margin: '0 0 8px', letterSpacing: '-0.012em' }}>
                    Most people do not know if their offer is fair.{' '}
                    <em style={{ fontStyle: 'italic', color: '#D9603B' }}>This tells you.</em>
                  </p>
                  <p style={{ fontSize: 15, color: '#5B6577', margin: '0 0 24px', lineHeight: 1.55 }}>
                    Seven questions. Sixty seconds. No email required.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {['Private and secure', 'Built on UK statute', 'No email needed to see your result'].map(label => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(217,96,59,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check />
                        </div>
                        <span style={{ fontSize: 14, color: '#4A5568' }}>{label}</span>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/calculator"
                    style={{
                      display: 'block', width: '100%', background: '#D9603B', textDecoration: 'none', color: '#fff',
                      fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
                      letterSpacing: '-0.005em', padding: '15px 24px', borderRadius: 10,
                      cursor: 'pointer', marginBottom: 14, textAlign: 'center', boxSizing: 'border-box',
                    }}
                  >
                    Check my offer →
                  </Link>
                  <p style={{ fontSize: 12, color: '#9AA3AE', textAlign: 'center', margin: 0, lineHeight: 1.55 }}>
                    No data is sold. No solicitor will call unless you ask.
                  </p>
                </div>
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
                  className={`flex flex-col px-5 py-4 md:py-2 border-rule ${
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
              <h2 className="sc-section-h2">Three steps. Sixty seconds. Zero cost.</h2>
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
                  <p className="sc-body mt-3">{s.d}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href="/calculator" className="btn-accent">Check my offer →</Link>
            </div>
          </div>
        </section>

        {/* ── TAX EXPLANATION ───────────────────────────────────── */}
        <section className="py-section bg-paper-2 border-y border-rule">
          <div className="sc-container">
            <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-5">
                <span className="sc-eyebrow">Tax calculation</span>
                <h2 className="sc-section-h2">How much tax will you pay on your employment settlement?</h2>
                <p className="sc-lead">Most employees sign the first number they receive without questioning it. That number is rarely the final one.</p>
                <p className="sc-body">Enter your salary, length of service, and your offer to see your estimated net take-home after tax. PILON and the £30,000 exemption are calculated separately.</p>
                <div className="border-l-2 border-coral pl-4 mt-1">
                  <p className="text-[13px] font-semibold text-ink mb-0.5">What is PILON?</p>
                  <p className="sc-body" style={{ fontSize: 13 }}>PILON stands for <em>Payment in Lieu of Notice</em>. It is the lump sum your employer pays instead of letting you work out your notice period. Unlike redundancy pay, PILON is always taxed as normal income.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="bg-card border border-rule rounded-lg p-6">
                  <div className="font-serif text-[17px] md:text-[19px] font-460 text-ink tracking-[-0.008em] leading-[1.3] mb-2">PILON is always taxable</div>
                  <p className="sc-body">Payment in lieu of notice is treated as earnings under ITEPA 2003 s.402D. It is subject to income tax and National Insurance at your normal rate, regardless of what your agreement calls it.</p>
                </div>
                <div className="bg-card border border-rule rounded-lg p-6">
                  <div className="font-serif text-[17px] md:text-[19px] font-460 text-ink tracking-[-0.008em] leading-[1.3] mb-2">Up to £30,000 is tax-free</div>
                  <p className="sc-body">Statutory redundancy pay and other termination payments up to £30,000 are exempt from income tax under ITEPA 2003 s.403. The portion above £30,000 is taxable at your marginal rate.</p>
                </div>
                <div className="bg-card border border-rule rounded-lg p-6">
                  <div className="font-serif text-[17px] md:text-[19px] font-460 text-ink tracking-[-0.008em] leading-[1.3] mb-2">The calculator separates both</div>
                  <p className="sc-body">Most calculators show a gross figure. This one calculates PILON and redundancy pay separately, applies the correct tax treatment to each, and shows your estimated net take-home figure.</p>
                </div>
                <Link href="/calculator" className="btn-accent self-start">See my net take-home →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST ─────────────────────────────────────────────── */}
        <section id="about" className="py-section bg-paper-2 border-y border-rule">
          <div className="sc-container">
            <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-[1fr_1.05fr]">
              <div className="flex flex-col gap-3.5">
                <span className="sc-eyebrow">Why SettlementCheck</span>
                <h2 className="sc-section-h2">Built for the employee. Not the employer.</h2>
                <p className="sc-lead">
                  Most settlement calculators online are built by law firms trying to capture your case. Ours is independent. Solicitors on our panel pay a small introduction fee per qualified lead. We have no single firm to push you towards, and we curate the panel for quality, not volume.
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
                      <div className="sc-body mt-1">{it.d}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-7">
                  <Link href="/calculator" className="btn-accent self-start">Check my offer, it&apos;s free →</Link>
                </div>
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
                <h2 className="sc-section-h2">What people ask before they start.</h2>
                <p className="sc-lead">Six things almost every employee wants to know before clicking &ldquo;calculate.&rdquo;</p>
              </div>
              <FaqAccordion />
            </div>
          </div>
        </section>

        {/* ── STATUTORY RATES TABLE ─────────────────────────────── */}
        {statutoryRows.length > 0 && (
          <section className="py-section bg-paper-2 border-y border-rule">
            <div className="sc-container">
              <div className="flex flex-col gap-3.5 max-w-[640px] mb-10">
                <span className="sc-eyebrow">Statutory rates</span>
                <h2 className="sc-section-h2">UK redundancy pay cap: 2024/25 vs 2025/26</h2>
                <p className="sc-lead">Updated every April. The calculator always uses the current rates.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" style={{ minWidth: 420 }}>
                  <caption className="sr-only">UK statutory redundancy and settlement figures compared across 2024/25 and 2025/26 tax years</caption>
                  <thead>
                    <tr className="border-b border-rule">
                      <th className="text-left py-3 pr-6 font-medium text-ink" style={{ fontSize: 13 }}>Figure</th>
                      <th className="text-right py-3 px-4 font-medium text-muted" style={{ fontSize: 13 }}>2024/25</th>
                      <th className="text-right py-3 pl-4 font-medium text-ink" style={{ fontSize: 13 }}>2025/26</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statutoryRows.map((row, i) => (
                      <tr key={i} className="border-b border-rule last:border-0">
                        <td className="py-3 pr-6 text-ink" style={{ fontSize: 14 }}>{row.label}</td>
                        <td className="py-3 px-4 text-right text-muted tabular-nums" style={{ fontSize: 14 }}>{row.y2425}</td>
                        <td className="py-3 pl-4 text-right font-medium text-ink tabular-nums" style={{ fontSize: 14 }}>{row.y2526}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="sc-body mt-5" style={{ fontSize: 13 }}>
                Sources: ERA 1996 s.227 (GB cap), ERO(NI) 1996 (NI cap), ITEPA 2003 s.403 (£30,000 threshold). Figures effective 6 April 2025.
              </p>
              <p className="sc-body mt-1" style={{ fontSize: 12, color: '#8A93A3' }}>
                Figures reflect the Employment Rights (Increase of Limits) Order 2025, in force from 6 April 2025. Last reviewed: May 2026.
              </p>
            </div>
          </section>
        )}

        {/* ── CTA BANNER ────────────────────────────────────────── */}
        <section
          className="relative overflow-hidden py-16 md:py-[88px]"
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
                <h2 className="sc-section-h2 text-white" style={{ maxWidth: '20ch' }}>Most opening offers have room to move.</h2>
                <p className="sc-lead mt-3" style={{ color: 'rgba(247,244,238,0.78)', maxWidth: '46ch' }}>
                  Get your free estimate in under two minutes and find out where yours stands.
                </p>
              </div>
              <Link href="/calculator" className="btn-accent whitespace-nowrap self-start md:self-auto">
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
