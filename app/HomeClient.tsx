import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'

/* ── Data ────────────────────────────────────────────────────────── */
const STATS = [
  { n: '10 days', l: 'ACAS recommended review window (guidance)' },
  { n: '£751',    l: 'Weekly pay cap 2026/27' },
  { n: '£0',      l: 'To check your rights (no email required)' },
  { n: 'Net pay', l: 'PILON and £30k exemption split' },
]

const STEPS = [
  {
    n: '01',
    t: 'How does the offer compare?',
    d: 'Enter your salary, service, and offer. See your calculated statutory redundancy baseline, notice pay, and how your offer compares against UK benchmarks.',
  },
  {
    n: '02',
    t: 'How much will HMRC take?',
    d: 'See what HMRC taxes under ITEPA 2003 and what sits inside the £30,000 tax-free limit. Spot non-competes or reference clauses that could affect your next job.',
  },
  {
    n: '03',
    t: 'Who pays for the solicitor?',
    d: (
      <>
        Under s.203(3) ERA 1996, a settlement is only binding once you take independent legal advice. Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) upon completion, though extra or abortive work depends on your solicitor&apos;s terms.{' '}
        <Link href="/get-matched/" className="underline hover:text-coral transition-colors font-medium">
          Connect with an SRA-regulated specialist
        </Link>{' '}
        to review your terms.
      </>
    ),
  },
]

const TRUST: { t: string; d: React.ReactNode }[] = [
  {
    t: 'Genuinely independent',
    d: 'Every other settlement calculator online was built by a firm that wants your case. This one was not. There is no law firm behind this result. What you see is what the numbers say.',
  },
  {
    t: 'Built on UK statute',
    d: (
      <>
        The calculator applies the statutory weekly cap of £751 under{' '}
        <a
          href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-coral transition-colors"
        >
          SI 2026/310
        </a>
        , notice pay rules, and the £30,000 tax-free threshold under{' '}
        <a
          href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-coral transition-colors"
        >
          Section 403 of ITEPA 2003
        </a>
        .
      </>
    ),
  },
  {
    t: 'Clear tax separation',
    d: 'We separate statutory redundancy and ex-gratia compensation from Payment in Lieu of Notice (PILON), so you see your estimated net take-home figure after tax.',
  },
  {
    t: 'Employer legal fee contribution',
    d: 'While Section 203(3) requires independent advice, employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) upon completion. Fees beyond the cap, or if you do not sign, depend on your solicitor\u2019s terms.',
  },
  {
    t: 'SRA-regulated solicitor panel',
    d: 'We connect you with vetted employment law solicitors authorised and regulated by the Solicitors Regulation Authority who act exclusively in your best interest.',
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
export interface PageLink { href: string; label: string }
export interface StepItem { n: string; t: string; d: React.ReactNode }

export interface HomeProps {
  title?: React.ReactNode;
  lead?: React.ReactNode;
  leadBullets?: { label: string; detail: string }[];
  alertBanner?: React.ReactNode;
  statutoryRows?: StatutoryRow[];
  pageLinks?: PageLink[];
  faqItems?: FaqItem[];
  steps?: StepItem[];
  ctaLabel?: string;
  ctaHref?: string;
  howItWorksTitle?: string;
  howItWorksLead?: string;
  taxSectionTitle?: string;
}

export default function HomeClient({
  title,
  lead,
  leadBullets,
  alertBanner,
  statutoryRows = [],
  pageLinks = [],
  faqItems,
  steps,
  ctaLabel = 'Calculate my estimate →',
  ctaHref = '/calculator/',
  howItWorksTitle = 'Three steps. Sixty seconds. Free to check.',
  howItWorksLead = 'From an unread draft in your inbox to clear numbers. Free to calculate, with a standard capped employer fee contribution if a solicitor completes your agreement.',
  taxSectionTitle = 'How much tax will you pay on your employment settlement?',
}: HomeProps = {}) {
  return (
    <>
      <Nav />
      <main>
        <section
          id="calculator"
          className="relative overflow-hidden pt-5 pb-10 sm:pt-8 sm:pb-12 md:py-[72px]"
          style={{ background: '#F7F4EE' }}
        >
          <div className="sc-container relative">
            {alertBanner && (
              <div className="mb-5 md:mb-8">
                {alertBanner}
              </div>
            )}
            <div className="hero-grid grid gap-5 sm:gap-7 md:gap-12 items-center lg:grid-cols-[1.05fr_1fr]">
              <div className="flex flex-col min-w-0">
                {/* Hero Pill / Statutory Rates & SRA Network Badge */}
                <div className="flex flex-wrap items-center gap-2.5 mb-3.5 sm:mb-5">
                  <div className="inline-flex items-center gap-2 border border-coral/30 rounded-full px-3 py-1 sm:px-3.5 sm:py-1.5 text-[12px] font-medium text-ink bg-white/75 shadow-sm backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-coral"></span>
                    </span>
                    <span className="sm:hidden">
                      <strong className="text-ink font-semibold">April 2026</strong> UK rates · £751/wk cap
                    </span>
                    <span className="hidden sm:inline">
                      Updated for <strong className="text-ink font-semibold">April 2026</strong> UK statutory rates
                    </span>
                  </div>
                  <span className="hidden sm:inline-flex items-center gap-1.5 border border-rule-strong rounded-full px-3 py-1.5 text-[12px] font-medium text-muted bg-white/40">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B1F3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    SRA-Regulated Panel Network
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px] font-medium text-muted pl-1">
                    Independent · Free to use
                  </span>
                </div>

                {/* SEO keyword eyebrow: shown on desktop; hidden on mobile to eliminate pre-H1 vertical stack and early link leak */}
                <p className="hidden lg:block sc-eyebrow text-[12px] leading-snug mb-2.5" style={{ letterSpacing: '0.08em' }}>
                  Independent UK Employment Settlement &amp;{' '}
                  <Link
                    href="/guides/compromise-agreement-calculator-uk/"
                    className="hover:text-coral underline underline-offset-2 transition-colors"
                    title="Compromise Agreement Calculator UK"
                  >
                    Compromise Calculator
                  </Link>
                </p>

                <h1 className="sc-h1 max-sm:text-[31px] max-sm:leading-[1.08] mb-3 sm:mb-4 md:mb-5">
                  {title || (
                    <>
                      How much should your<br />
                      <em style={{ fontStyle: 'italic', color: '#D9603B' }}>employment settlement</em> be?
                    </>
                  )}
                </h1>

                {lead ? (
                  <p className="sc-lead max-sm:text-[16px] max-sm:leading-[1.48] m-0">{lead}</p>
                ) : leadBullets ? (
                  <ul className="flex flex-col gap-3 pt-1">
                    {leadBullets.map(({ label, detail }, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span
                          className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-coral"
                        />
                        <span className="flex flex-col gap-0.5">
                          <span className="sc-body font-semibold text-ink leading-snug tracking-[-0.01em]">{label}</span>
                          <span className="sc-body leading-snug">{detail}</span>
                        </span>
                      </li>
                    ))}
                  </ul>
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
                        detail: 'Compare your settlement against UK statutory rates for 2026/27.',
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
                <div
                  className="p-0 lg:p-9 flex flex-col lg:rounded-[20px] lg:border lg:border-[#0B1F3A]/10 lg:overflow-hidden lg:shadow-[0_24px_60px_-12px_rgba(11,31,58,0.22),0_8px_24px_-6px_rgba(11,31,58,0.10)] lg:bg-[linear-gradient(170deg,#F5F1E9_0%,#EDE8DF_30%,#E8E2D8_60%,#F0EDE6_100%)]"
                >
                  <span className="sc-eyebrow hidden lg:block mb-4">
                    Free calculator
                  </span>
                  <p className="hidden lg:block font-serif font-semibold text-[25px] leading-[1.2] tracking-[-0.015em] text-ink m-0 mb-2">
                    See how your offer compares.{' '}
                    <em className="italic text-coral-ink">Measure it against April 2026 UK statute.</em>
                  </p>
                  <p className="hidden lg:block text-[16.5px] leading-[1.52] text-[#243247] mt-0 mb-6">
                    For draft offers, active exit talks, or redundancy notices. Seven questions, 60 seconds, no email required.
                  </p>

                  {/* Desktop checklist (unchanged) */}
                  <div className="hidden lg:flex lg:order-1 flex-col gap-3 mb-7">
                    {[
                      'Check privately on any device with no email required',
                      'April 2026 statutory baselines (£751/wk cap) built in',
                      'No law firm behind the maths, and no calls unless you ask',
                    ].map(label => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(217,96,59,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check />
                        </div>
                        <span className="text-[15px] text-ink-2 leading-snug">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Primary CTA (thumb-zone on mobile, bottom of card on desktop) */}
                  <div id="hero-primary-cta" className="order-1 lg:order-2 mb-4 lg:mb-3">
                    <Link
                      href={ctaHref}
                      className="btn-accent w-full min-h-[52px] py-3.5 px-6 rounded-[10px] text-[16px] font-bold shadow-sm"
                    >
                      {ctaLabel}
                    </Link>
                  </div>

                  {/* Mobile compact single-line trust points (zero duplication of April 2026 pill) */}
                  <div className="order-2 lg:hidden flex flex-col gap-2 mb-4">
                    {[
                      'No email required · check privately in 60 seconds',
                      'Independent · no law firm behind the maths',
                      'No calls unless you ask · no data sold',
                    ].map(label => (
                      <div key={label} className="flex items-center gap-2">
                        <span
                          className="w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 text-coral-ink"
                          style={{ background: 'rgba(217,96,59,0.12)' }}
                        >
                          <Check />
                        </span>
                        <span className="text-[13.5px] text-ink-2 leading-snug">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Secondary path (now cleanly visible above the fold on mobile) */}
                  <div className="order-3 pt-3 border-t border-[#0B1F3A]/[0.08] lg:mb-3 text-center">
                    <span className="text-[13.5px] lg:text-[14px] text-muted lg:block lg:mb-1 mr-1.5 lg:mr-0">
                      Have a written draft?
                    </span>
                    <Link
                      href="/settlement-agreement-review/"
                      className="inline-flex items-center gap-1 whitespace-nowrap text-[13.5px] lg:text-[14px] font-semibold text-coral-ink hover:text-ink underline underline-offset-2 transition-colors"
                    >
                      60-second clause checklist →
                    </Link>
                  </div>

                  <p className="hidden lg:block order-3 text-[13.5px] text-muted text-center m-0 leading-[1.45]">
                    No data sold. No calls unless you ask.
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
                    style={{ fontSize: 40, fontWeight: 550, lineHeight: 1, letterSpacing: '-0.02em' }}
                  >
                    {s.n}
                  </span>
                  <span className="text-[14px] text-muted mt-2">{s.l}</span>
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
              <h2 className="sc-section-h2">{howItWorksTitle}</h2>
              <p className="sc-lead">{howItWorksLead}</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-14 max-[900px]:grid-cols-1">
              {(steps || STEPS).map((s, i) => (
                <article
                  key={i}
                  className="bg-card border border-rule rounded-lg p-8 hover:border-rule-strong transition-colors duration-[160ms]"
                >
                  <div
                    className="font-serif text-coral text-[30px] md:text-[40px] leading-none tracking-[-0.03em]"
                    style={{ fontWeight: 550 }}
                  >
                    {s.n}
                  </div>
                  <h3 className="sc-h3 mt-3">{s.t}</h3>
                  <p className="sc-body mt-3">{s.d}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <Link href={ctaHref} className="btn-accent">{ctaLabel}</Link>
            </div>
          </div>
        </section>

        {/* ── UK EMPLOYMENT TRIBUNAL BACKLOG TRACKER ─────────── */}
        <section className="py-section bg-card border-b border-rule">
          <div className="sc-container">
            <div className="max-w-[720px] mb-12">
              <span className="sc-eyebrow">MoJ &amp; HMCTS Regional Tribunal Data</span>
              <h2 className="sc-section-h2 mt-2">
                Track UK Employment Tribunal wait times across 10 Great Britain hearing centres.
              </h2>
              <p className="sc-lead mt-3">
                Take the offer on the table, or wait 270 to 540 days for a hearing? Check real MoJ wait times across 10 Great Britain centres before you decide with your solicitor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-paper border border-rule rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-base mb-4">
                    1
                  </div>
                  <h3 className="sc-h3 mb-2">46,510 open single claims</h3>
                  <p className="sc-body">
                    Inspect active open caseloads published by the Ministry of Justice and HMCTS across major hearing centres including London Central, Watford, Midlands West, Manchester, and Scotland.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rule text-[13.5px] font-sans font-medium text-muted">
                  Source: MoJ &amp; HMCTS Quarterly Statistics
                </div>
              </div>

              <div className="bg-paper border border-rule rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-base mb-4">
                    2
                  </div>
                  <h3 className="sc-h3 mb-2">Regional hearing wait times</h3>
                  <p className="sc-body">
                    Compare average days to preliminary and final merits hearings by region, from 270 days up to 540 days in London Central, to understand realistic tribunal timelines.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rule text-[13.5px] font-sans font-medium text-muted">
                  Coverage: 10 Great Britain Hearing Centres
                </div>
              </div>

              <div className="bg-paper border border-rule rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-coral/10 text-coral flex items-center justify-center font-bold text-base mb-4">
                    3
                  </div>
                  <h3 className="sc-h3 mb-2">Illustrative defence cost context</h3>
                  <p className="sc-body">
                    Review illustrative employer legal defence cost ranges alongside regional backlog pressure ratings to prepare informed questions for your independent SRA-regulated solicitor.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-rule text-[13.5px] font-sans font-medium text-muted">
                  Interactive Regional Pressure Map
                </div>
              </div>
            </div>

            <div className="bg-paper-2 border border-rule rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex flex-col gap-1.5 text-center sm:text-left">
                <span className="sc-h3">
                  Check wait times at your nearest Employment Tribunal centre
                </span>
                <span className="text-[14px] leading-relaxed text-muted">
                  Free interactive tracker built on MoJ &amp; HMCTS data. No login or email required.
                </span>
              </div>
              <Link
                href="/tribunal-backlog-tracker/"
                className="btn-accent whitespace-nowrap w-full sm:w-auto px-6 py-3"
              >
                Open Tribunal Backlog Tracker →
              </Link>
            </div>
          </div>
        </section>

        {/* ── TAX EXPLANATION ───────────────────────────────────── */}
        <section className="py-section bg-paper-2 border-y border-rule">
          <div className="sc-container">
            <div className="grid grid-cols-1 gap-10 md:gap-20 lg:grid-cols-[1fr_1.2fr]">
              <div className="flex flex-col gap-5">
                <span className="sc-eyebrow">Tax calculation</span>
                <h2 className="sc-section-h2">{taxSectionTitle}</h2>
                <p className="sc-lead">The headline figure on your draft is rarely what lands in your bank. Checking the tax split shows you what is actually yours.</p>
                <p className="sc-body">A £20,000 offer does not mean £20,000 in your bank if notice pay is bundled in. Split taxable PILON from your £30,000 tax-free allowance before payday.</p>
                <div className="border-l-2 border-coral pl-4 mt-1">
                  <p className="text-[16px] font-semibold text-ink mb-1">What is PILON?</p>
                  <p className="sc-body">PILON stands for <em>Payment in Lieu of Notice</em>. It is the lump sum your employer pays instead of letting you work out your notice period. Unlike redundancy pay, PILON is always taxed as normal income.</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="bg-card border border-rule rounded-lg p-6">
                  <div className="sc-h3 mb-2">PILON is always taxed like wages</div>
                  <p className="sc-body">Under ITEPA 2003 s.402D, notice pay is taxed as normal earnings with income tax and National Insurance, whatever your draft calls it.</p>
                </div>
                <div className="bg-card border border-rule rounded-lg p-6">
                  <div className="sc-h3 mb-2">The first £30,000 of termination pay is tax-free</div>
                  <p className="sc-body">Statutory redundancy and ex-gratia compensation up to £30,000 are tax-free under ITEPA 2003 s.403. Anything above £30,000 is taxed at your marginal rate.</p>
                </div>
                <div className="bg-card border border-rule rounded-lg p-6">
                  <div className="sc-h3 mb-2">See what actually lands in your bank</div>
                  <p className="sc-body">Most calculators show one gross figure. This one splits taxable notice pay from your £30,000 allowance so you see your estimated net take-home.</p>
                </div>
                <Link href={ctaHref} className="btn-accent self-start">See my net take-home →</Link>
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
                  Most settlement calculators online are built by one law firm trying to win your case. Ours is independent. Panel firms pay a fixed subscription or introducer fee to receive your case summary when you ask for a callback, in line with SRA Rule 5.1. Every panel solicitor acts independently in your best interest.
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
                      <div className="sc-h3">{it.t}</div>
                      <div className="sc-body mt-1">{it.d}</div>
                    </div>
                  </div>
                ))}
                <div className="pt-7">
                  <Link href={ctaHref} className="btn-accent self-start">{ctaLabel}</Link>
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
                <h2 className="sc-section-h2">What you may want to check first.</h2>
                <p className="sc-lead">Clear answers before you calculate your estimate.</p>

                <div className="mt-4 p-6 rounded-xl border border-rule bg-card flex flex-col gap-3">
                  <div className="sc-h3 text-[19px]">
                    Need guidance on your specific situation?
                  </div>
                  <p className="sc-body">
                    Every settlement agreement is unique. Explore our in-depth guides on negotiation, ACAS codes, and redundancy, or have your draft clauses reviewed by an independent specialist.
                  </p>
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/guides/"
                      className="text-[14px] font-semibold text-coral-ink hover:text-ink underline underline-offset-2 transition-colors"
                    >
                      Browse settlement agreement guides →
                    </Link>
                    <Link
                      href="/settlement-agreement-review/"
                      className="text-[14px] font-semibold text-coral-ink hover:text-ink underline underline-offset-2 transition-colors"
                    >
                      Review draft agreement clauses →
                    </Link>
                  </div>
                </div>
              </div>
              <FaqAccordion faqs={faqItems} />
            </div>
          </div>
        </section>

        {/* ── STATUTORY RATES TABLE ─────────────────────────────── */}
        {statutoryRows.length > 0 && (
          <section className="py-section bg-paper-2 border-y border-rule">
            <div className="sc-container">
              <div className="flex flex-col gap-3.5 max-w-[640px] mb-10">
                <span className="sc-eyebrow">Statutory rates</span>
                <h2 className="sc-section-h2">UK redundancy pay cap: 2025/26 vs 2026/27</h2>
                <p className="sc-lead">Updated every April. The calculator always uses the current rates.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-sm" style={{ minWidth: 420 }}>
                  <caption className="sr-only">UK statutory redundancy and settlement figures compared across 2025/26 and 2026/27 tax years</caption>
                  <thead>
                    <tr className="border-b border-rule">
                      <th className="text-left py-3 pr-6 font-medium text-ink" style={{ fontSize: 13 }}>Figure</th>
                      <th className="text-right py-3 px-4 font-medium text-muted" style={{ fontSize: 13 }}>2025/26</th>
                      <th className="text-right py-3 pl-4 font-medium text-ink" style={{ fontSize: 13 }}>2026/27</th>
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
              <p className="text-[14px] leading-[1.55] text-muted mt-5">
                Sources:{' '}
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/18/section/227"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-coral transition-colors"
                >
                  ERA 1996 s.227
                </a>{' '}
                (GB cap), ERO(NI) 1996 (NI cap),{' '}
                <a
                  href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-coral transition-colors"
                >
                  ITEPA 2003 s.403
                </a>{' '}
                (£30,000 threshold). Figures effective 6 April 2026.
              </p>
              <p className="text-[14px] leading-[1.55] text-muted-2 mt-1.5">
                Figures reflect the{' '}
                <a
                  href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-coral transition-colors"
                >
                  Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>{' '}
                and Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57), in force from 6 April 2026. Last reviewed: May 2026.
              </p>

              {/* Explore statutory tools strip */}
              <div className="mt-8 pt-6 border-t border-rule flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className="text-[14px] font-semibold text-ink uppercase tracking-wider">
                  Explore statutory compensation tools:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/redundancy-calculator/"
                    className="text-[14px] text-coral-ink hover:underline font-medium"
                  >
                    Redundancy Calculator →
                  </Link>
                  <span className="text-muted/40 hidden sm:inline">·</span>
                  <Link
                    href="/unfair-dismissal-calculator/"
                    className="text-[14px] text-coral-ink hover:underline font-medium"
                  >
                    Unfair Dismissal Calculator →
                  </Link>
                  <span className="text-muted/40 hidden sm:inline">·</span>
                  <Link
                    href="/tribunal-backlog-tracker/"
                    className="text-[14px] text-coral-ink hover:underline font-medium"
                  >
                    Tribunal Backlog Tracker →
                  </Link>
                  <span className="text-muted/40 hidden sm:inline">·</span>
                  <Link
                    href="/get-matched/"
                    className="text-[14px] text-coral-ink hover:underline font-medium"
                  >
                    Find a Solicitor →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── RELATED GUIDES (per-page contextual internal links) ── */}
        {pageLinks.length > 0 && (
          <section className="py-10 bg-paper border-y border-rule">
            <div className="sc-container">
              <span className="sc-eyebrow mb-4 block">Related guides</span>
              <ul className="flex flex-wrap gap-3">
                {pageLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 border border-rule rounded-full px-5 py-2.5 text-[14px] font-medium text-ink bg-card hover:border-coral hover:text-coral transition-colors duration-[160ms] no-underline"
                    >
                      {link.label} →
                    </Link>
                  </li>
                ))}
              </ul>
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
                <h2 className="sc-section-h2 text-white" style={{ maxWidth: '20ch' }}>Check where your opening offer stands.</h2>
                <p className="sc-lead mt-3" style={{ color: 'rgba(247,244,238,0.78)', maxWidth: '46ch' }}>
                  Compare your offer against UK statutory baselines and see your net take-home in 7 questions. No email required.
                </p>
              </div>
              <Link href={ctaHref} className="btn-accent whitespace-nowrap self-start md:self-auto">
                {ctaLabel}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
