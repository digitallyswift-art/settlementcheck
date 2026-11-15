import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import type { FaqItem } from '@/components/FaqAccordion'
import AcasStatutoryTimelineClient from './AcasStatutoryTimelineClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER, SETTLEMENT_CHECK_LEGAL_DESK } from '@/lib/seo/schema-constants'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'ACAS Statutory Timeline & Limitation Calculator | SettlementCheck',
  description:
    'Calculate ACAS Code 4 10-day consideration windows and statutory 3-month-less-one-day tribunal limitation dates under s.111(2) ERA 1996. Free interactive timeline tool.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
  },
  openGraph: {
    title: 'ACAS Statutory Timeline & Limitation Calculator | SettlementCheck',
    description:
      'Interactive calculation of the ACAS Code of Practice 4 10-calendar-day guidance window and the Section 111(2) ERA 1996 primary tribunal limitation deadline.',
    url: 'https://settlementcheck.co.uk/guides/acas-statutory-timeline/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACAS Statutory Timeline & Limitation Calculator',
    description:
      'Check ACAS 10-day consideration periods, artificial ultimatums, and 3-month tribunal limitation deadlines. Free interactive statutory tool.',
  },
}

const FAQS: FaqItem[] = [
  {
    q: 'What is the ACAS 10-calendar-day rule for settlement agreements?',
    a: 'Under Paragraph 12 of the ACAS Code of Practice 4 on Settlement Agreements, an employer should as a general guideline allow a minimum of 10 calendar days for the employee to consider the proposed formal written terms and to receive independent legal advice, unless the parties agree otherwise. This ensures the employee has adequate time to consult an SRA-regulated solicitor without undue commercial pressure.',
  },
  {
    q: 'Can my employer withdraw the settlement offer before the 10 days expire?',
    a: 'Yes. Under English contract law (Routledge v Grant [1828]), an offeror may revoke an offer at any time before it is formally accepted, unless separate consideration was given to keep it open. ACAS Code 4 provides statutory guidance for Employment Tribunals assessing reasonableness, but it does not create an irrevocable legal freeze. It is advisable not to let deadlines pass without taking independent legal advice.',
  },
  {
    q: 'What constitutes improper behaviour under ACAS Code 4?',
    a: 'Under Paragraph 18 of ACAS Code 4, improper behaviour includes putting undue pressure on a party. Specific statutory examples include setting an unreasonably short deadline (such as demanding a decision within 24 or 48 hours), threatening dismissal before any formal disciplinary process has commenced, or using unlawful discrimination, harassment, or physical assault.',
  },
  {
    q: 'What happens to Section 111A confidentiality if the employer behaves improperly?',
    a: 'Under Section 111A(4) of the Employment Rights Act 1996, if an employer engages in improper behaviour, the confidentiality of pre-termination negotiations is lost to the extent the Employment Tribunal considers just. The employee may then refer to the discussions as evidence in an ordinary unfair dismissal claim.',
  },
  {
    q: 'How is the 3-month-less-one-day limitation deadline calculated?',
    a: 'Under Section 111(2) ERA 1996, the primary limitation period for an unfair dismissal claim ends three months less one day from the Effective Date of Termination (EDT). For example, if your employment terminates on 14 June, the primary limitation deadline is 13 September. If employment terminates on 1 February, three months ends on 30 April.',
  },
  {
    q: 'Do settlement agreement negotiations pause the 3-month tribunal deadline?',
    a: 'No. Ongoing settlement discussions, without-prejudice correspondence, or internal grievance appeals do not pause or extend the statutory tribunal clock. The only formal statutory mechanism that pauses the limitation clock is submitting an ACAS Early Conciliation notification under Section 207B ERA 1996 before the primary limitation deadline expires.',
  },
  {
    q: 'How does the ACAS Early Conciliation clock-stop work?',
    a: 'When you submit an Early Conciliation notification to ACAS, the limitation clock pauses from the day after notification (Day A) until the date ACAS issues the Early Conciliation certificate (Day B). Furthermore, under Section 207B ERA 1996, you will always have at least one month from the date of the certificate (Day B) to lodge your ET1 claim at the Employment Tribunal.',
  },
  {
    q: 'How much does the employer customarily contribute to legal fees?',
    a: 'Employers standardly provide a capped commercial contribution, typically £350 to £500+ plus VAT (and £750 to £1,500+ for complex or senior exits), paid directly to your instructed SRA-regulated solicitor upon completion. This customary contribution usually covers independent advice on the terms and effect of the settlement.',
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
          'Interactive calculation utility and legal guide for ACAS Code of Practice 4 10-calendar-day consideration periods and Section 111(2) ERA 1996 tribunal limitation deadlines.',
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
          'Comprehensive legal guide analyzing ACAS Code 4 paragraph 12 consideration windows, improper behaviour tests under s.111A(4) ERA 1996, contract revocation rules under Routledge v Grant, and primary 3-month tribunal limitation calculations.',
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
      <main className="min-h-screen bg-paper text-ink pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted font-sans">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-coral transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/guides/" className="hover:text-coral transition-colors">
                  Guides
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink font-medium" aria-current="page">
                ACAS Statutory Timeline
              </li>
            </ol>
          </nav>

          {/* Editorial Header */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/20">
              <span>ACAS Code of Practice 4 &amp; ERA 1996 Compliance</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink tracking-tight leading-tight">
              ACAS Statutory Timeline: The 10-Day Rule &amp; 3-Month Limitation Dates
            </h1>
            <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-3xl">
              Understand the precise statutory mechanics of settlement agreement timelines in the UK. Calculate your 10-calendar-day ACAS consideration benchmark, evaluate artificial employer ultimatums, and safeguard your strict 3-month-less-one-day Employment Tribunal limitation date.
            </p>
          </header>

          {/* Interactive Calculator Component */}
          <AcasStatutoryTimelineClient />

          {/* Deep Editorial Legal Guide */}
          <article className="prose prose-slate max-w-none space-y-10 text-ink leading-relaxed">
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                1. The ACAS Code of Practice 4 Framework
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                The Advisory, Conciliation and Arbitration Service (ACAS) issued the statutory{' '}
                <em>Code of Practice on Settlement Agreements (Code 4)</em> under Section 199 of the Trade Union and Labour Relations (Consolidation) Act 1992. While a failure to observe the Code does not of itself render an employer liable to proceedings, Employment Tribunals are required by Section 207 of the 1992 Act to take its provisions into account when assessing whether parties acted reasonably.
              </p>
              <div className="p-4 bg-paper rounded-xl border border-rule text-xs space-y-2 text-muted">
                <p className="m-0 font-semibold text-ink">
                  Paragraph 12 Benchmark: The 10-Calendar-Day Guideline
                </p>
                <p className="m-0 leading-relaxed">
                  Paragraph 12 states: &quot;As a general rule, a reasonable time should be allowed. What is reasonable will depend on the circumstances of each case, but as a general guideline, a minimum period of 10 calendar days should be allowed to consider the proposed formal written terms of a settlement agreement and to receive independent legal advice, unless the parties agree otherwise.&quot;
                </p>
              </div>
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                2. Section 111A Pre-Termination Confidentiality vs Section 203 Waiver Validity
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                A common source of confusion in UK employment exits is the distinction between Section 111A confidentiality and Section 203 statutory waiver validity:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    Section 111A ERA 1996 (Protected Conversations)
                  </span>
                  <p className="text-muted leading-relaxed">
                    Provides statutory confidentiality to discussions held before termination regarding an agreed exit. Neither party can mention the discussions in an Employment Tribunal claim for <strong>ordinary unfair dismissal</strong>.
                  </p>
                  <p className="text-muted leading-relaxed font-mono text-[11px]">
                    * Limitation: Does not apply to discrimination (Equality Act 2010), whistleblowing (ERA 1996 s.103A), or breach of contract.
                  </p>
                </div>
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    Section 203(3) ERA 1996 (Valid Settlement Waiver)
                  </span>
                  <p className="text-muted leading-relaxed">
                    Specifies the 6 statutory conditions required to compromise employment claims. The agreement must be in writing, relate to specific proceedings, identify a qualified relevant adviser (solicitor), and confirm the adviser holds active professional indemnity insurance.
                  </p>
                  <p className="text-muted leading-relaxed font-mono text-[11px]">
                    * Requirement: The agreement is void unless signed off with independent legal advice.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                3. The 3-Month-Less-One-Day Limitation Formula (s.111(2) ERA 1996)
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Under Section 111(2) of the Employment Rights Act 1996, an Employment Tribunal cannot hear an unfair dismissal claim unless the claim (or ACAS Early Conciliation notification) is presented before the end of the period of three months beginning with the Effective Date of Termination (EDT).
              </p>
              <p className="text-sm text-muted leading-relaxed">
                Under English statutory case law (<em>Hammond v Haigh Castle &amp; Co Ltd</em>), &quot;three months beginning with the EDT&quot; means the limitation date expires on the day before the corresponding numerical date three months later:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-rule rounded-lg">
                  <thead className="bg-paper text-ink font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Effective Date of Termination (EDT)</th>
                      <th className="p-3">3 Months Later (Same Numerical Day)</th>
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
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                4. The ACAS Early Conciliation Clock-Stop Mechanism (s.207B ERA 1996)
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Before you can submit a formal ET1 claim to an Employment Tribunal, you must notify ACAS under Section 18A of the Employment Tribunals Act 1996. Lodging this notification triggers the statutory &quot;clock-stop&quot; rules set out in Section 207B of the ERA 1996:
              </p>
              <ul className="text-xs text-muted space-y-2 list-disc pl-5">
                <li>
                  <strong>Day A:</strong> The day ACAS receives your Early Conciliation notification.
                </li>
                <li>
                  <strong>Day B:</strong> The day ACAS issues the formal Early Conciliation certificate confirming conciliation has ended.
                </li>
                <li>
                  <strong>Pause Period:</strong> The time elapsed between Day A and Day B (which can last up to 6 weeks) does not count toward your primary 3-month limitation period.
                </li>
                <li>
                  <strong>The One-Month Extension Guarantee:</strong> Under Section 207B(4), if the primary limitation deadline would otherwise expire within one month of Day B, you are guaranteed at least one full calendar month from Day B to submit your ET1 tribunal claim.
                </li>
              </ul>
              <div className="p-4 bg-paper rounded-xl border border-rule text-xs text-muted leading-relaxed">
                <strong className="text-ink">Common Pitfall:</strong> Never assume that exchanging emails with HR or having an informal without-prejudice meeting pauses the clock. Only submitting the ACAS notification form legally stops the limitation clock.
              </div>
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                5. Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={FAQS} />
            </section>
          </article>

          {/* Related Tools Navigation */}
          <nav aria-label="Related tools" className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
            <h3 className="text-base font-serif font-bold text-ink">
              Related Statutory Calculators &amp; Legal Guides
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <Link
                href="/tribunal-backlog-tracker/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Tribunal Backlog Tracker</span>
                <span className="text-muted text-[11px]">Regional wait times &amp; employer defence costs</span>
              </Link>
              <Link
                href="/settlement-agreement-review/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Settlement Agreement Review</span>
                <span className="text-muted text-[11px]">Match with an SRA-regulated solicitor</span>
              </Link>
              <Link
                href="/guides/settlement-agreement-time-limits/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Settlement Time Limits</span>
                <span className="text-muted text-[11px]">Complete guide to statutory deadlines</span>
              </Link>
              <Link
                href="/calculator/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Settlement Calculator</span>
                <span className="text-muted text-[11px]">Calculate your full exit valuation</span>
              </Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}