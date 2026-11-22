import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'ACAS Early Conciliation & Timeline | SettlementCheck',
  description:
    'ACAS Early Conciliation and settlement agreement timeline UK. How Section 18A ETA 1996 pauses the 3-month tribunal limitation clock and ACAS Code 4 rules.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/acas-early-conciliation-timeline/',
  },
  openGraph: {
    title: 'ACAS Early Conciliation & Timeline | SettlementCheck',
    description:
      'ACAS Early Conciliation and settlement agreement timeline UK. How Section 18A ETA 1996 pauses the 3-month tribunal limitation clock and ACAS Code 4 rules.',
    url: 'https://settlementcheck.co.uk/guides/acas-early-conciliation-timeline/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACAS Early Conciliation & Timeline | SettlementCheck',
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
    a: 'No. Discussions under Section 111A ERA 1996 or without prejudice rules do not pause the 3-month-less-one-day deadline. To freeze the clock, an employee must notify ACAS for Early Conciliation under Section 18A ETA 1996.',
  },
  {
    q: 'What is the ACAS 10 calendar day rule for settlement agreements?',
    a: 'ACAS Code of Practice 4 recommends allowing at least 10 calendar days to consider written terms and seek legal advice. This is guidance rather than a binding legal right. Under English contract law (Routledge v Grant, Hyde v Wrench), an employer can withdraw an unaccepted offer, and a counter-offer extinguishes the original offer. Undue pressure can amount to improper behaviour under Section 111A(4) ERA 1996.',
  },
  {
    q: 'How does ACAS Early Conciliation pause the tribunal limitation clock?',
    a: 'Under Section 18A ETA 1996, the clock pauses on Day A (notification date) and resumes on Day B (certificate date). If the deadline would expire during conciliation or within one month of Day B, you receive a full month from Day B to submit an ET1 claim.',
  },
  {
    q: 'Can a settlement agreement be reached through an ACAS COT3 instead of a standard agreement?',
    a: 'Yes. A dispute can settle via an ACAS COT3 facilitated by a conciliation officer under Section 18(1) ETA 1996, or via a private settlement agreement under Section 203(3) ERA 1996. Both are legally binding waivers.',
  },
  {
    q: 'What happens if negotiations continue close to the tribunal deadline?',
    a: 'Registering for ACAS Early Conciliation before the primary limitation period expires freezes the statutory clock. An SRA-regulated solicitor can confirm your exact deadline and advise on how to protect your position.',
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
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Tribunal deadlines</span>
            </div>
            <h1 className="sc-h1 mb-4">
              ACAS Early Conciliation &amp; Settlement Agreement Timeline
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ETA 1996 s.18A &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Holding a draft settlement agreement while a tribunal deadline approaches? Settlement talks do not pause the three-month-less-one-day clock. Check your statutory baseline in 60 seconds with no email required, see how ACAS Early Conciliation pauses the deadline, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Reactive Calculator Micro-Tool (Immediately below Hero) */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Check your calculated statutory baseline (£751/wk cap) and notice pay while ACAS Early Conciliation proceeds."
                disputeType="acas_timeline"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'ACAS Consideration', value: '10 Calendar Days', statute: 'Code 4 Guidance' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={46000}
                initialYears={4}
                initialAge={37}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Statutory Quick Answer Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Limitation Period Rule
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  ETA 1996 s.18A &amp; ERA 1996 s.111
                </span>
              </div>
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-3">
                How does ACAS Early Conciliation affect settlement deadlines?
              </h2>
              <p className="text-[15px] text-ink mb-4 leading-relaxed">
                Under Section 111(2) ERA 1996, the employment tribunal deadline is <strong>3 months less one day</strong> from termination. Entering settlement talks does not pause this clock. Contacting ACAS under Section 18A ETA 1996 stops the clock between Day A and Day B, and guarantees at least one month from Day B to file an ET1 claim.
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

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Why do settlement talks not pause the tribunal deadline?</h2>
              <p className="guide-body">
                Many employees assume that active settlement discussions freeze their employment tribunal time limit. Under UK law, they do not.
              </p>
              <p className="guide-body">
                While you review garden leave terms, non-compete clauses, or whether notice pay is taxed as wages, the three-month-less-one-day clock keeps running. If negotiations pass that date without an ACAS notification, you lose the right to bring a claim.
              </p>
              <p className="guide-body">
                Note also that Section 111A ERA 1996 confidentiality applies only to ordinary unfair dismissal claims, not discrimination or whistleblowing. Unreviewed correspondence can also waive common law privilege if no genuine dispute yet exists.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Informal Settlement Talks</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Do not pause the 3-month-less-1-day tribunal clock.</li>
                    <li>Offer remains revocable before acceptance (Routledge v Grant).</li>
                    <li>A counter-proposal extinguishes the opening offer (Hyde v Wrench).</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">ACAS Early Conciliation (s.18A)</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Freezes the statutory limitation clock from Day A to Day B.</li>
                    <li>Preserves your right to file an ET1 claim if talks fail.</li>
                    <li>Provides at least one calendar month from Day B.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. How does ACAS Early Conciliation pause the clock?</h2>
              <p className="guide-body">
                Parliament enacted Section 18A of the Employment Tribunals Act 1996 so employees are not timed out during negotiations. The pause works in three steps.
              </p>
              <div className="rounded-xl border border-rule bg-paper p-5 my-6 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-ink text-sm">Day A (Contact Date)</strong>
                    <p className="text-[14px] text-muted mt-0.5 leading-relaxed">The day you submit your online Early Conciliation form to ACAS. The limitation clock stops immediately.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-ink text-sm">Conciliation Window</strong>
                    <p className="text-[14px] text-muted mt-0.5 leading-relaxed">ACAS conciliation lasts up to 6 calendar weeks. Days spent in conciliation do not count toward your limitation limit.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-coral text-white text-xs font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-ink text-sm">Day B (Certificate Issued)</strong>
                    <p className="text-[14px] text-muted mt-0.5 leading-relaxed">The day ACAS issues your certificate. You receive at least one calendar month from Day B to submit your ET1 claim.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How is the Day A to Day B extension calculated?</h2>
              <p className="guide-body">
                The table below shows a step-by-step calendar breakdown for an employee dismissed on 15 May.
              </p>

              <div className="rounded-xl border border-rule overflow-x-auto my-6">
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

            {/* Section 4: Legal Safeguards & Fee Contribution */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. What should you check with an independent solicitor?</h2>
              <p className="guide-body">
                Under Section 203(3) ERA 1996, a settlement agreement is not binding until an independent solicitor advises you on its terms. Employers standardly contribute £350 to £500+ plus VAT toward that review upon completion.
              </p>
              <p className="guide-body">
                If your solicitor carries out extra negotiation or the agreement does not complete, excess or abortive work remains subject to your solicitor engagement terms. Always confirm your exact limitation dates with an SRA-regulated solicitor before letting statutory deadlines pass.
              </p>
            </div>

            {/* Bottom CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/calculator/" className="btn-accent">
                  Check my offer now →
                </Link>
                <Link href="/redundancy-calculator/" className="btn-secondary">
                  Calculate my redundancy →
                </Link>
              </div>
              <p className="text-white/60 text-[12px] mt-4">
                Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion
              </p>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/acas-early-conciliation-timeline/" suppressSchema />
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related ACAS & Tribunal Guides"
              items={[
                {
                  href: '/guides/acas-statutory-timeline/',
                  title: 'ACAS Code 4 10-Day & Limitation Date Calculator',
                  description: 'Use our interactive calculator to check 10-calendar-day consideration windows and 3-month-less-one-day deadlines.',
                  tag: 'Interactive Tool',
                },
                {
                  href: '/tribunal-backlog-tracker/',
                  title: 'UK Employment Tribunal Backlog Tracker',
                  description: 'Track MoJ regional hearing wait times (up to 540 days in London) and employer defence cost exposure.',
                  tag: 'MoJ Data Tracker',
                },
                {
                  href: '/guides/employment-tribunal-average-awards-uk/',
                  title: 'Average Employment Tribunal Awards UK (MoJ Tables)',
                  description: 'Compare median unfair dismissal and discrimination tribunal awards against settlement agreement offers.',
                  tag: 'MoJ Statistics',
                },
                {
                  href: '/guides/settlement-agreement-time-limits/',
                  title: 'Settlement Agreement Time Limits (3-Month Rule)',
                  description: 'Full breakdown of statutory tribunal deadlines, employer ultimatums, and independent solicitor advice.',
                  tag: 'Deadlines Guide',
                },
              ]}
            />
          </div>
        </section>

        {/* Regulatory Disclaimers */}
        <section className="py-8 bg-paper border-t border-rule">
          <div className="max-w-2xl mx-auto px-5 text-xs text-muted leading-relaxed">
            <p className="mb-0">
              <strong>Tribunal Limitation Notice:</strong> Limitation periods in UK Employment Tribunals are strictly enforced. SettlementCheck is an independent technology platform and introducer, not a law firm. Always confirm your exact limitation dates with an SRA-regulated solicitor before letting statutory deadlines elapse.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
