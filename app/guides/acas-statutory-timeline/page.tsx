import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import type { FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import AcasStatutoryTimelineClient from './AcasStatutoryTimelineClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER, SETTLEMENT_CHECK_LEGAL_DESK } from '@/lib/seo/schema-constants'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'ACAS Timeline & Limitation Calculator | SettlementCheck',
  description:
    'Check ACAS Code 4 10-day consideration windows and 3-month-less-one-day tribunal limits under s.111(2) ERA 1996 with our free timeline tool.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
  },
  openGraph: {
    title: 'ACAS Statutory Timeline & Limitation Calculator | SettlementCheck',
    description:
      'Interactive check of the ACAS Code of Practice 4 10-calendar-day guidance window and the Section 111(2) ERA 1996 employment tribunal limitation deadline.',
    url: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACAS Statutory Timeline & Limitation Calculator',
    description:
      'Check ACAS 10-day consideration periods, employer deadlines, and 3-month employment tribunal limitation dates. Free statutory tool.',
  },
}

const FAQS: FaqItem[] = [
  {
    q: 'What is the ACAS 10-calendar-day rule for settlement agreements?',
    a: 'Under Paragraph 12 of ACAS Code of Practice 4, an employer should generally allow at least 10 calendar days to consider formal written terms and take independent legal advice. This is statutory guidance on reasonableness rather than a strict legal right.',
  },
  {
    q: 'Can my employer withdraw the settlement offer before the 10 days expire?',
    a: 'Yes. Under English contract law (Routledge v Grant [1828]), an employer can withdraw an unaccepted offer at any time unless separate consideration keeps it open. Under Hyde v Wrench, making a counter-proposal also rejects the original offer. Taking independent legal advice before a deadline passes helps clarify your options.',
  },
  {
    q: 'What counts as improper behaviour under ACAS Code 4?',
    a: 'Under Paragraph 18 of ACAS Code 4, improper behaviour includes putting undue pressure on a party. Examples include setting an unreasonably short deadline (such as 24 or 48 hours), threatening dismissal before any formal process begins, or unlawful discrimination and harassment.',
  },
  {
    q: 'What happens to Section 111A confidentiality if the employer behaves improperly?',
    a: 'Under Section 111A(4) of the Employment Rights Act 1996, improper behaviour lifts pre-termination confidentiality to the extent an employment tribunal considers just. You may then refer to those discussions as evidence in an ordinary unfair dismissal claim.',
  },
  {
    q: 'How is the 3-month-less-one-day limitation deadline calculated?',
    a: 'Under Section 111(2) ERA 1996, the primary limitation period for unfair dismissal ends three months less one day from the Effective Date of Termination (EDT). For example, if employment ends on 14 June, the deadline is 13 September. If it ends on 1 February, the deadline is 30 April.',
  },
  {
    q: 'Do settlement agreement negotiations pause the 3-month tribunal deadline?',
    a: 'No. Ongoing settlement discussions, without-prejudice correspondence, or internal grievance appeals do not pause the statutory clock. Only submitting an ACAS Early Conciliation notification under Section 207B ERA 1996 pauses the limitation period.',
  },
  {
    q: 'How does the ACAS Early Conciliation clock-stop work?',
    a: 'When you notify ACAS, the limitation clock pauses from the day after notification (Day A) until ACAS issues the Early Conciliation certificate (Day B). Under Section 207B ERA 1996, you always have at least one full month from Day B to lodge an ET1 claim.',
  },
  {
    q: 'How much does an employer standardly contribute to legal fees?',
    a: 'Employers standardly provide a capped contribution of £350 to £500+ plus VAT paid directly to your SRA-regulated solicitor upon completion. This usually covers reviewing and advising on the draft agreement, while excess or abortive work is subject to your solicitor engagement terms.',
  },
]

export default function AcasStatutoryTimelinePage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/#webpage',
        url: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
        name: 'ACAS Statutory Timeline & Limitation Calculator',
        publisher: SETTLEMENT_CHECK_PUBLISHER,
        description:
          'Interactive check and legal guide for ACAS Code of Practice 4 10-calendar-day consideration periods and Section 111(2) ERA 1996 tribunal limitation deadlines.',
        breadcrumb: {
          '@id': 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/#breadcrumb',
        },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://settlementcheck.co.uk/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: 'https://settlementcheck.co.uk/guides/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'ACAS Statutory Timeline',
            item: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/#article',
        headline: 'ACAS Code of Practice 4: Statutory Timelines, 10-Day Windows & Tribunal Limitation Dates',
        description:
          'Legal guide covering ACAS Code 4 paragraph 12 consideration windows, improper behaviour under s.111A(4) ERA 1996, contract revocation under Routledge v Grant, and primary 3-month tribunal limitation dates.',
        url: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
        datePublished: '2026-05-15',
        dateModified: '2026-11-15',
        publisher: SETTLEMENT_CHECK_PUBLISHER,
        author: SETTLEMENT_CHECK_LEGAL_DESK,
      },
      {
        '@type': 'WebApplication',
        '@id': 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/#webapp',
        name: 'ACAS Statutory Timeline Calculator',
        applicationCategory: 'LegalService',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript',
        url: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
        offers: {
          '@type': 'Offer',
          price: '0.00',
          priceCurrency: 'GBP',
        },
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/#faq',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: a,
          },
        })),
      },
    ],
  }

  return (
    <>
      <Script
        id="acas-timeline-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLdData) }}
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Deadlines &amp; ACAS Code 4</span>
            </div>
            <h1 className="sc-h1 mb-4">
              ACAS Statutory Timeline: The 10-Day Rule &amp; 3-Month Limitation Dates
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Been given a short deadline to sign a settlement agreement? Check your ACAS 10-calendar-day benchmark and 3-month employment tribunal limitation date in 60 seconds with no email required. See how statutory time limits work under ACAS Code 4 and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Statutory Check */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Check your calculated statutory baseline, notice pay, and tax-free exit limits before your deadline passes."
                disputeType="negotiation"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'ACAS Guidance', value: '10 Calendar Days', statute: 'ACAS Code 4' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={45000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Interactive Timeline Calculator Component */}
            <AcasStatutoryTimelineClient />

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Does the ACAS 10-day rule give you a strict legal right?</h2>
              <p className="guide-body">
                No. ACAS issued the statutory <em>Code of Practice on Settlement Agreements (Code 4)</em> under Section 199 of the Trade Union and Labour Relations (Consolidation) Act 1992. It sets out guidance on reasonableness rather than a binding legal freeze.
              </p>
              <p className="guide-body">
                Employment tribunals must take Code 4 into account under Section 207 when assessing whether parties acted reasonably. However, under common law (<em>Routledge v Grant</em>), an employer can still revoke an unaccepted offer before it is signed.
              </p>
              <div className="p-4 bg-paper-2 rounded-xl border border-rule text-[14px] space-y-2 text-muted">
                <p className="m-0 font-semibold text-ink">
                  Paragraph 12 Benchmark: The 10-Calendar-Day Guideline
                </p>
                <p className="m-0 leading-relaxed">
                  Paragraph 12 states: &quot;As a general rule, a reasonable time should be allowed. What is reasonable will depend on the circumstances of each case, but as a general guideline, a minimum period of 10 calendar days should be allowed to consider the proposed formal written terms of a settlement agreement and to receive independent legal advice, unless the parties agree otherwise.&quot;
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. How do Section 111A talks differ from a Section 203 agreement?</h2>
              <p className="guide-body">
                UK employment law separates the rules on confidential exit discussions from the rules that make a final waiver legally binding. Both provisions sit in the Employment Rights Act 1996.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 space-y-2">
                  <span className="font-semibold text-ink block text-[15px]">
                    Section 111A ERA 1996 (Protected Conversations)
                  </span>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Keeps pre-termination exit talks confidential in an employment tribunal claim for <strong>ordinary unfair dismissal</strong>.
                  </p>
                  <p className="text-[13px] text-muted leading-relaxed">
                    Scope limit: Does not apply to discrimination (Equality Act 2010), whistleblowing (ERA 1996 s.103A), breach of contract, or improper behaviour.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 space-y-2">
                  <span className="font-semibold text-ink block text-[15px]">
                    Section 203(3) ERA 1996 (Valid Settlement Waiver)
                  </span>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Sets six statutory conditions for a binding waiver, including written terms, specific proceedings, and independent legal advice from an insured solicitor.
                  </p>
                  <p className="text-[13px] text-muted leading-relaxed">
                    Fee transparency: Employers standardly contribute £350 to £500+ plus VAT upon completion; excess or abortive work depends on your solicitor engagement terms.
                  </p>
                </div>
              </div>
              <p className="guide-body">
                When reviewing draft terms, check how notice pay, garden leave, and non-compete clauses are treated. Contractual notice, holiday pay, and garden leave are always taxed as wages, while up to £30,000 of genuine ex-gratia compensation may qualify for tax-free treatment under ITEPA 2003 s.403.
              </p>
              <p className="guide-body">
                If redundancy applies and you have two years&apos; continuous service under Section 141 ERA 1996, verify your calculated statutory baseline before accepting or making a counter-proposal (which rejects the original offer under <em>Hyde v Wrench</em>).
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How is the 3-month-less-one-day tribunal deadline calculated?</h2>
              <p className="guide-body">
                Under Section 111(2) ERA 1996, an employment tribunal claim or ACAS Early Conciliation notification must be lodged within three months less one day of the Effective Date of Termination (EDT).
              </p>
              <p className="guide-body">
                Under English case law (<em>Hammond v Haigh Castle &amp; Co Ltd</em>), the deadline expires on the day before the matching numerical date three months later:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border border-rule rounded-lg">
                  <thead className="bg-paper text-ink font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Effective Date of Termination (EDT)</th>
                      <th className="p-3">3 Months Later</th>
                      <th className="p-3">Primary Limitation Deadline (Less One Day)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule font-mono">
                    <tr>
                      <td className="p-3">14 June</td>
                      <td className="p-3">14 September</td>
                      <td className="p-3 text-coral font-bold">13 September</td>
                    </tr>
                    <tr>
                      <td className="p-3">31 August</td>
                      <td className="p-3">30 November (30 days in Nov)</td>
                      <td className="p-3 text-coral font-bold">29 November</td>
                    </tr>
                    <tr>
                      <td className="p-3">1 February</td>
                      <td className="p-3">1 May</td>
                      <td className="p-3 text-coral font-bold">30 April</td>
                    </tr>
                    <tr>
                      <td className="p-3">30 November</td>
                      <td className="p-3">28 February (non-leap year)</td>
                      <td className="p-3 text-coral font-bold">27 February</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. Does ACAS Early Conciliation pause the tribunal clock?</h2>
              <p className="guide-body">
                Yes. Before submitting an ET1 claim to an employment tribunal, you must notify ACAS under Section 18A of the Employment Tribunals Act 1996. Lodging that notification triggers the clock-stop rules in Section 207B ERA 1996:
              </p>
              <ul className="text-[15px] text-muted space-y-2 list-disc pl-5 leading-relaxed">
                <li>
                  <strong className="text-ink">Day A:</strong> The day ACAS receives your Early Conciliation notification.
                </li>
                <li>
                  <strong className="text-ink">Day B:</strong> The day ACAS issues the Early Conciliation certificate confirming conciliation has ended.
                </li>
                <li>
                  <strong className="text-ink">Pause Period:</strong> Days between Day A and Day B (up to six weeks) do not count toward your primary 3-month limitation period.
                </li>
                <li>
                  <strong className="text-ink">One-Month Extension:</strong> Under Section 207B(4), if the deadline would expire within one month of Day B, you have at least one full calendar month from Day B to submit your ET1 claim.
                </li>
              </ul>
              <div className="p-4 bg-paper-2 rounded-xl border border-rule text-[14px] text-muted leading-relaxed">
                <strong className="text-ink">Key Distinction:</strong> Exchanging emails with HR or holding informal without-prejudice meetings does not pause the statutory clock. Only submitting an ACAS Early Conciliation notification stops the limitation clock.
              </div>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and notice pay before your consideration window ends.
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
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'ACAS Code 4 10-day guidance and how to handle employer deadlines.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/acas-early-conciliation-timeline/',
                  title: 'ACAS Early Conciliation Clock Pause',
                  description: 'Section 18A Day A and Day B limitation freeze and COT3 agreements.',
                  tag: 'Deadlines',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'UK contract rules under Hyde v Wrench and Routledge v Grant.',
                  tag: 'Offer Protection',
                },
                {
                  href: '/guides/settlement-agreement-time-limits/',
                  title: 'Settlement Agreement Time Limits',
                  description: 'Overview of consideration windows, tax dates, and tribunal deadlines.',
                  tag: 'Deadlines',
                },
                {
                  href: '/guides/employment-tribunal-average-awards-uk/',
                  title: 'Average Tribunal Awards UK',
                  description: 'Official MoJ median awards and the £123,543 compensatory cap.',
                  tag: 'Tribunal Data',
                },
                {
                  href: '/tribunal-backlog-tracker/',
                  title: 'Tribunal Backlog Tracker',
                  description: 'Regional employment tribunal wait times and hearing delays.',
                  tag: 'Tool',
                },
              ]}
            />

            {/* Disclaimer */}
            <p className="text-[14px] text-muted border-t border-rule pt-6 leading-relaxed">
              Figures on this page reflect the Employment Rights (Increase of Limits) Order 2026, in force from 6 April 2026. Last reviewed: May 2026. SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding statutory timelines and does not constitute legal advice.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
