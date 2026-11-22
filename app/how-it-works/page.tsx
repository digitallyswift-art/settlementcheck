import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const FAQS = [
  {
    q: 'Who pays for the independent solicitor?',
    a: 'Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion of the agreement. While Section 203(3) ERA 1996 requires independent advice for a waiver to be valid, it does not legally compel employers to pay. If negotiations abort before completion or exceed the agreed cap, fees remain subject to your solicitor\'s engagement terms.',
  },
  {
    q: 'Do I legally need an independent solicitor?',
    a: 'Yes. Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement waiving statutory employment rights is only legally binding once a qualified, insured independent adviser signs the adviser\'s certificate.',
  },
  {
    q: 'How quickly will a solicitor respond?',
    a: 'You are introduced to one independent SRA-regulated solicitor from our panel rather than a multi-firm call list. Your matched solicitor commits to responding within 24 hours, often the same business day.',
  },
  {
    q: 'How long do I have to review the agreement?',
    a: 'ACAS Code of Practice 4 recommends at least 10 calendar days to consider an initial written offer, though this is statutory guidance rather than a binding legal right. Under contract law (Routledge v Grant and Hyde v Wrench), an employer can set a shorter deadline or withdraw an unaccepted offer, and making a counter-proposal rejects the original terms.',
  },
  {
    q: 'Is my information shared with my employer?',
    a: 'No. Your details are shared only with the single SRA-regulated solicitor you choose to speak with. They are never shared with your employer, recruiters, or third-party marketers.',
  },
  {
    q: 'Why use an independent calculator before speaking to a solicitor?',
    a: 'Our calculator applies published April 2026 UK statutory rates (£751/week GB cap under SI 2026/310 and the £30,000 tax exemption under ITEPA 2003 s.403) with no law firm bias and no email required. It gives you a clear baseline before your solicitor conversation.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  publisher: SETTLEMENT_CHECK_PUBLISHER,
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export const metadata: Metadata = {
  title: 'How It Works: Step-by-Step Guide | SettlementCheck',
  description:
    'Check your offer against April 2026 UK statutory rates (£751/wk) in 60 seconds, then connect with one SRA-regulated solicitor. Capped employer fee contributions apply on completion.',
  alternates: { canonical: 'https://settlementcheck.co.uk/how-it-works/' },
  openGraph: {
    title: 'How SettlementCheck Works: Step-by-Step | SettlementCheck',
    description:
      'Check your offer against April 2026 UK statutory rates (£751/wk) in 60 seconds, then connect with one SRA-regulated solicitor. Capped employer fee contributions apply on completion.',
    url: 'https://settlementcheck.co.uk/how-it-works/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export default function HowItWorks() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-16 pb-12">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h1 className="sc-h1 mb-4">
              How SettlementCheck works
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 s.203 &amp; ACAS Code 4
            </p>
            <p className="sc-lead mb-7">
              Got a draft settlement agreement in your inbox? Check your calculated statutory baseline in 60 seconds with no email required, then choose whether to connect with one independent SRA-regulated solicitor.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Link href="/calculator/" className="btn-accent">
                Check my offer now →
              </Link>
              <span className="text-[13px] text-muted">
                Free, confidential, no email required
              </span>
            </div>
          </div>
        </section>

        {/* Steps detailed */}
        <section className="bg-paper-2 border-y border-rule py-16">
          <div className="max-w-3xl mx-auto px-4 space-y-10">
            {[
              {
                step: '01',
                title: 'How does your offer compare to the baseline?',
                summary: (
                  <>
                    Enter your salary, service length, age, and draft offer into our{' '}
                    <Link href="/calculator/" className="text-coral underline underline-offset-2 hover:text-ink font-semibold">
                      Settlement Agreement Calculator
                    </Link>{' '}
                    for an instant April 2026 check (£751/week GB cap under SI 2026/310).
                  </>
                ),
                bullets: [
                  'Calculated statutory baseline (subject to qualifying service, absence of gross misconduct, and ERA 1996 s.141 suitable alternative employment rules).',
                  'Tax split showing notice pay or garden leave taxed as wages versus the £30,000 exemption under ITEPA 2003 s.403.',
                  'Separate flag for discrimination or whistleblowing, which sit outside Section 111A ERA 1996 confidentiality and are uncapped under the Equality Act 2010.',
                ],
                footerNote: (
                  <>
                    Other tools:{' '}
                    <Link href="/redundancy-calculator/" className="text-ink underline underline-offset-2 hover:text-coral">
                      Redundancy Pay Calculator
                    </Link>
                    {' · '}
                    <Link href="/settlement-agreement-tax-calculator/" className="text-ink underline underline-offset-2 hover:text-coral">
                      Settlement Agreement Tax Calculator
                    </Link>
                  </>
                ),
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="2"/>
                    <line x1="8" y1="7" x2="16" y2="7"/>
                    <line x1="8" y1="11" x2="10" y2="11"/>
                    <line x1="13" y1="11" x2="16" y2="11"/>
                    <line x1="8" y1="15" x2="10" y2="15"/>
                    <line x1="13" y1="15" x2="16" y2="15"/>
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'What happens when you choose a solicitor?',
                summary: 'After viewing your baseline, you can request an introduction to one independent, SRA-regulated employment solicitor from our panel.',
                bullets: [
                  'Single-firm match only, with no multi-firm auction or cold-call list.',
                  'Your offer and baseline summary are shared only with the solicitor you choose, never with your employer.',
                  'Matched solicitors commit to responding within 24 hours, often the same business day.',
                  'Do not send unreviewed financial proposals directly to HR, as unreviewed correspondence can waive legal privilege or trigger offer revocation before signing.',
                ],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Who pays for the solicitor and what do they check?',
                summary: 'Under Section 203(3) ERA 1996, a settlement agreement is only legally binding once an independent solicitor advises you on it.',
                bullets: [
                  'Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion.',
                  'If the agreement does not complete or negotiations go beyond the cap, fees depend on your solicitor\'s engagement terms.',
                  'Your solicitor checks non-compete clauses that could block your next job, notice wording, tax indemnities, and any counter-proposal.',
                  'Full review and completion typically take days or weeks rather than hours, depending on your employer\'s deadline.',
                ],
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D9603B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                ),
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-8">
                <div
                  className="hidden md:block font-serif leading-none pt-1 select-none"
                  style={{ fontSize: 88, fontWeight: 420, color: '#E2DCCE' }}
                  aria-hidden="true"
                >
                  {step.step}
                </div>
                <div className="flex-1 bg-card rounded-2xl border border-rule p-7 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    {step.icon}
                    <span className="md:hidden text-[12px] font-mono font-semibold uppercase tracking-wider text-muted bg-paper-2 px-2.5 py-1 rounded border border-rule">
                      Step {step.step}
                    </span>
                  </div>
                  <h2 className="sc-h3 mb-3">{step.title}</h2>
                  <p className="sc-body mb-4">{step.summary}</p>
                  <ul className="space-y-2.5 text-[15.5px] text-muted leading-relaxed">
                    {step.bullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {step.footerNote && (
                    <p className="mt-4 pt-3 border-t border-rule text-[13.5px] text-muted">
                      {step.footerNote}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section id="about" className="bg-paper py-16">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">About SettlementCheck</h2>
            <div className="space-y-4 sc-body">
              <p>
                SettlementCheck helps UK employees check where they stand when handed a settlement agreement or redundancy offer, without sales pressure or hidden email gates.
              </p>
              <p>
                We are an independent introduction service, not a law firm, and we do not provide legal advice. Every solicitor on our panel is independently SRA-regulated and vetted for UK employment settlement work.
              </p>
              <p>
                Our calculator uses published April 2026 statutory rates (£751/week GB cap under SI 2026/310) to provide objective baselines. It does not replace a solicitor&apos;s review of your contract, notice wording, and personal circumstances.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="bg-paper-2 border-y border-rule py-16">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Common questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* CTA */}
        <section className="bg-ink py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="sc-section-h2 text-white mb-3">Ready to check your offer?</h2>
            <p className="sc-lead text-white/80 mb-6">
              See your April 2026 statutory baseline and tax split before speaking to a solicitor.
            </p>
            <Link href="/calculator/" className="btn-accent">
              Check my offer now →
            </Link>
            <p className="text-white/60 text-[12px] mt-4">
              Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
