import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'ACAS Early Conciliation & Settlement Timeline UK | 2026 Guide',
  description:
    'ACAS Early Conciliation and settlement agreement timeline UK. How Section 18A ETA 1996 pauses the 3-month tribunal limitation clock and ACAS Code 4 rules.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/acas-early-conciliation-timeline/',
  },
  openGraph: {
    title: 'ACAS Early Conciliation & Settlement Timeline UK | 2026 Guide',
    description:
      'ACAS Early Conciliation and settlement agreement timeline UK. How Section 18A ETA 1996 pauses the 3-month tribunal limitation clock and ACAS Code 4 rules.',
    url: 'https://settlementcheck.co.uk/guides/acas-early-conciliation-timeline/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACAS Early Conciliation & Settlement Timeline UK | 2026 Guide',
    description:
      'ACAS Early Conciliation and settlement agreement timeline UK. How Section 18A ETA 1996 pauses the 3-month tribunal limitation clock and ACAS Code 4 rules.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/acas-early-conciliation-timeline/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'Does negotiating a settlement agreement pause the 3-month tribunal deadline?',
    a: 'No. Settlement negotiations under Section 111A of the Employment Rights Act 1996 or "without prejudice" discussions do not automatically pause the statutory 3-month-less-one-day tribunal limitation period. To freeze the clock, you must formally contact ACAS to initiate Early Conciliation under Section 18A of the Employment Tribunals Act 1996.',
  },
  {
    q: 'What is the ACAS 10 calendar day rule for settlement agreements?',
    a: 'Under ACAS Code of Practice 4, employers are advised as statutory guidance to allow a minimum of 10 calendar days for employees to consider written terms and seek independent legal advice. However, under English contract law (Routledge v Grant, Hyde v Wrench), an employer can technically withdraw an unaccepted offer before acceptance, and a counter-proposal can extinguish the original offer. If an employer applies undue pressure, an employment tribunal may determine this constitutes improper behaviour under Section 111A(4) ERA 1996, removing confidentiality protection.',
  },
  {
    q: 'How does ACAS Early Conciliation pause the tribunal limitation clock?',
    a: 'Under Section 18A of the Employment Tribunals Act 1996, the clock pauses on "Day A" (the day you contact ACAS) and resumes on "Day B" (the day you receive your Early Conciliation certificate). In addition, if the limitation period would have expired during conciliation or within one month of Day B, you receive a full month from Day B to submit your ET1 claim.',
  },
  {
    q: 'Can a settlement agreement be reached through an ACAS COT3 instead of a standard agreement?',
    a: 'Yes. An employment dispute can be settled either via an ACAS COT3 agreement (facilitated directly by an ACAS conciliation officer under Section 18(1) ETA 1996) or via a private settlement agreement under Section 203(3) ERA 1996. Both forms are legally binding waivers of tribunal claims.',
  },
  {
    q: 'What should I do if my employer is stalling negotiations as the tribunal deadline approaches?',
    a: 'Contact ACAS immediately to lodge an Early Conciliation notification before your primary limitation period expires. This freezes the legal deadline and prevents your employer from running down the clock to eliminate your statutory tribunal rights.',
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'ACAS Early Conciliation & Settlement Agreement Timeline UK: The Limitation Clock Guide',
  url: 'https://settlementcheck.co.uk/guides/acas-early-conciliation-timeline/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-11-04',
  dateModified: '2026-11-04',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
  },
  reviewedBy: {
    '@type': 'Organization',
    name: 'SettlementCheck Legal Research Desk',
    url: 'https://settlementcheck.co.uk/how-it-works/',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
    logo: {
      '@type': 'ImageObject',
      url: 'https://settlementcheck.co.uk/og-image.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/acas-early-conciliation-timeline/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 111',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/111',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 111A',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/111A',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Tribunals Act 1996, Section 18A',
      url: 'https://www.legislation.gov.uk/ukpga/1996/17/section/18A',
    },
  ],
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function AcasEarlyConciliationTimelineGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">ACAS Early Conciliation Timeline</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Tribunal Deadlines &amp; Negotiations</p>
            <h1 className="sc-h1 mb-5">
              ACAS Early Conciliation &amp; Settlement Agreement Timeline: How to Stop the Tribunal Clock
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 Limitation Rules</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Statute: ETA 1996 s.18A &amp; ERA 1996 s.111</span>
            </div>
            <p className="sc-lead">
              Negotiating an employment settlement agreement does not automatically pause your statutory deadline to bring an employment tribunal claim. Under UK law, you have exactly three months less one day from your dismissal or detriment to initiate legal action. This guide explains how ACAS Early Conciliation under Section 18A pauses the limitation clock and protects your legal position.
            </p>
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Limitation Period Rule
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Strict Statutory Deadline
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                How does ACAS Early Conciliation affect settlement agreement deadlines?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Under Section 111(2) ERA 1996, the tribunal deadline is <strong>3 months less one day</strong> from the effective date of termination. Entering settlement discussions does not pause this clock. Contacting ACAS under Section 18A ETA 1996 stops the clock between Day A (notification) and Day B (certificate issue), plus provides at least one additional month from Day B to submit an ET1 claim.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Primary Tribunal Clock</span>
                  <span className="font-bold text-ink text-sm">3 Months Less 1 Day</span>
                  <span className="text-muted text-[11px]">ERA 1996 s.111(2) strict deadline</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">ACAS Consideration Window</span>
                  <span className="font-bold text-ink text-sm">10 Calendar Days</span>
                  <span className="text-muted text-[11px]">Guidance under ACAS Code 4</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Clock Freeze Period</span>
                  <span className="font-bold text-ink text-sm">Day A to Day B</span>
                  <span className="text-muted text-[11px]">ETA 1996 s.18A statutory extension</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Extension Guarantee</span>
                  <span className="font-bold text-ink text-sm">At Least 1 Month</span>
                  <span className="text-muted text-[11px]">From certificate date if expiring</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Reactive Calculator Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="ACAS Timeline Engine"
              title="Calculate Your Statutory Entitlement While The Clock Is Paused"
              subtitle="Calculate your calculated statutory redundancy baseline (£751/wk cap) and notice pay to protect your financial position while ACAS conciliation proceeds."
              disputeType="acas_timeline"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Consideration Period', value: '10 Days Min', statute: 'ACAS Code 4' },
                { label: 'Independent Advice', value: 'Capped Contribution', statute: 'Commercial Standard' },
              ]}
              initialSalary={46000}
              initialYears={4}
              initialAge={37}
              ctaText="Check My ACAS Negotiation Baseline →"
            />
          </div>
        </section>

        {/* Section 1: The Employer Stalling Trap */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">1. The Employer Stalling Trap</h2>
            <p className="sc-body mb-4">
              One of the most dangerous traps for unrepresented UK employees is the "slow-walk" negotiation. An employer initiates protected conversations under Section 111A of the Employment Rights Act 1996, sends draft heads of terms, and then takes weeks to respond to counter-proposals.
            </p>
            <p className="sc-body mb-4">
              If negotiations drag on past the 3-month-less-one-day mark from your dismissal date without an ACAS notification having been filed, you lose the right to bring an employment tribunal claim. Once your tribunal deadline has expired, the employer holds all the negotiating power and can withdraw or reduce the settlement offer with complete impunity.
            </p>
          </div>
        </section>

        {/* Section 2: How Section 18A Pauses the Clock */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">2. The Section 18A Extension Mechanism (Day A to Day B)</h2>
            <p className="sc-body mb-4">
              To prevent employees from being timed out during negotiations, Parliament enacted Section 18A of the Employment Tribunals Act 1996. The extension mechanism works as follows:
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 my-6 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-ink text-sm">Day A (Contact Date):</strong>
                  <p className="text-xs text-muted mt-0.5">The calendar day you submit your online Early Conciliation form to ACAS. The limitation clock stops immediately.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-ink text-sm">Conciliation Window:</strong>
                  <p className="text-xs text-muted mt-0.5">ACAS conciliation lasts up to 6 calendar weeks. All calendar days spent in conciliation are added to your original limitation date.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-ink text-sm">Day B (Certificate Issued):</strong>
                  <p className="text-xs text-muted mt-0.5">The day ACAS issues your Early Conciliation certificate. You always receive at least one calendar month from Day B to submit your claim.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Worked Calendar Example */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Example: Limitation Clock Calculation</h2>
            <p className="sc-body mb-6">
              Step-by-step calendar breakdown for an employee dismissed on 15 May:
            </p>

            <div className="rounded-xl border border-rule overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Milestone</th>
                    <th className="text-left px-4 py-3 font-medium">Date</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Effective Date of Termination (EDT)</td>
                    <td className="px-4 py-3 text-ink">15 May</td>
                    <td className="px-4 py-3 text-muted">Clock starts ticking</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Primary Limitation Deadline</td>
                    <td className="px-4 py-3 text-ink">14 August</td>
                    <td className="px-4 py-3 text-muted">3 months less 1 day (ERA s.111)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Day A: Contact ACAS</td>
                    <td className="px-4 py-3 text-coral font-semibold">1 August</td>
                    <td className="px-4 py-3 text-muted">Clock pauses with 13 days remaining</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Day B: ACAS Certificate Issued</td>
                    <td className="px-4 py-3 text-coral font-semibold">22 August</td>
                    <td className="px-4 py-3 text-muted">Conciliation concludes (21 days paused)</td>
                  </tr>
                  <tr className="bg-paper font-bold">
                    <td className="px-4 py-3 text-ink">Final Tribunal ET1 Deadline</td>
                    <td className="px-4 py-3 text-coral font-bold">22 September</td>
                    <td className="px-4 py-3 text-ink">Full 1 month extension from Day B granted</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Regulatory Disclaimers */}
        <section className="py-8 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5 text-xs text-muted leading-relaxed">
            <p className="mb-2">
              <strong>Tribunal Limitation Notice:</strong> Limitation periods in UK Employment Tribunals are strictly enforced. SettlementCheck is an independent technology platform and introducer, not a law firm. Always confirm your exact limitation dates with an SRA-regulated solicitor before letting statutory deadlines elapse.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently Asked Questions: ACAS Timelines</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        <DynamicFaqSection pathname="/guides/acas-early-conciliation-timeline/" suppressSchema />
      </main>
      <Footer />
    </>
  )
}
