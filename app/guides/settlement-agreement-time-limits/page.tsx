import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import ReviewCallout from '@/components/ReviewCallout'
import RelatedArticles from '@/components/RelatedArticles'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Time Limits: 3-Month Tribunal Rule (2026)',
  description:
    'Understand settlement agreement time limits, the ACAS 10-day consideration rule, and why negotiations do not pause the 3-month tribunal deadline.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-time-limits/',
  },
  openGraph: {
    title: 'Settlement Agreement Time Limits: 3-Month Tribunal Rule (2026)',
    description:
      'Understand settlement agreement time limits, the ACAS 10-day consideration rule, and why negotiations do not pause the 3-month tribunal deadline.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-time-limits/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Time Limits: 3-Month Tribunal Rule (2026)',
    description:
      'Understand settlement agreement time limits, the ACAS 10-day consideration rule, and why negotiations do not pause the 3-month tribunal deadline.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/settlement-agreement-time-limits/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Does negotiating a settlement agreement pause the employment tribunal deadline?',
    a: 'No. Settlement discussions do not pause the employment tribunal deadline. Under Section 111(2) ERA 1996, you have three months minus one day to act. Only starting ACAS Early Conciliation pauses this statutory limitation clock.',
  },
  {
    q: 'How long do you have to consider a settlement agreement?',
    a: 'Under paragraph 12 of ACAS Code of Practice 4, employers should allow at least 10 calendar days. This gives you time to seek advice from an independent solicitor. However, this is statutory guidance rather than a binding legal guarantee.',
  },
  {
    q: 'Can your employer set a 24 or 48-hour deadline to sign?',
    a: 'Employers sometimes impose short deadlines. Setting unrealistic 24 or 48-hour deadlines can constitute improper behaviour under Section 111A(4) ERA 1996. If improper behaviour occurs, settlement negotiations lose statutory confidentiality in an employment tribunal.',
  },
  {
    q: 'How is the three-month minus one day tribunal time limit calculated?',
    a: 'The limitation period runs for three calendar months from your termination date, minus one day. For example, if employment ends on 15 June, your deadline is 14 September. You must start ACAS Early Conciliation on or before that date.',
  },
  {
    q: 'How does ACAS Early Conciliation pause the tribunal clock?',
    a: 'Under Section 18A of the Employment Tribunals Act 1996, lodging an ACAS notification halts the limitation clock. The clock pauses from Day A to Day B. You receive at least one calendar month after Day B to submit your claim.',
  },
  {
    q: 'How long after signing a settlement agreement do you receive payment?',
    a: 'Most settlement agreements state that your employer will pay within 14 to 28 calendar days. The agreement defines the exact payment date or payroll run. If your employer misses the deadline, you can enforce payment as a debt in the County Court.',
  },
  {
    q: 'Who pays for the solicitor review within the deadline?',
    a: "Under Section 203(3) ERA 1996, independent solicitor advice is mandatory for a settlement agreement to be legally valid. In UK commercial practice, employers standardly provide a capped contribution (typically £350 to £500+ plus VAT, and up to £1,500 in complex cases) directly to your solicitor upon completion of the agreement. If you choose not to sign or instructions exceed the cap, legal fees remain subject to the solicitor's terms.",
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

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
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
      name: 'Settlement Agreement Time Limits',
      item: 'https://settlementcheck.co.uk/guides/settlement-agreement-time-limits/',
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Settlement Agreement Time Limits & Deadlines | SettlementCheck',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-time-limits/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-11-02',
  dateModified: '2026-11-02',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
    logo: {
      '@type': 'ImageObject',
      url: 'https://settlementcheck.co.uk/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-time-limits/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 111 (Complaints to employment tribunal)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/111',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 111A (Confidentiality of pre-termination negotiations)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/111A',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203 (Restrictions on contracting out)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Tribunals Act 1996, Section 18A (Requirement to contact ACAS before instituting proceedings)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/17/section/18A',
    },
    {
      '@type': 'Legislation',
      name: 'Equality Act 2010, Section 123 (Time limits for discrimination complaints)',
      url: 'https://www.legislation.gov.uk/ukpga/2010/15/section/123',
    },
    {
      '@type': 'Legislation',
      name: 'ACAS Code of Practice on Settlement Agreements (Code of Practice 4)',
      url: 'https://www.acas.org.uk/code-of-practice-settlement-agreements',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 exemption threshold)',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
    {
      '@type': 'Legislation',
      name: 'The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)',
      url: 'https://www.legislation.gov.uk/uksi/2026/310/contents/made',
    },
  ],
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M10 3L2 17H18L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function SettlementAgreementTimeLimitsGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Settlement Agreement Time Limits</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Statutory Deadlines &amp; Tribunal Limitation Rules
            </p>
            <h1 className="sc-h1 mb-5">
              Settlement Agreement Time Limits: 3-Month Tribunal Rule (2026)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-4 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Updated for 2026/27 (SI 2026/310 &amp; ACAS Code 4)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Last reviewed: November 2026</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-paper-2 text-muted border border-rule">
                ⏱️ 7 min read
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-paper-2 text-muted border border-rule">
                ⚖️ UK Employment Rights Act 1996
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#FBF0EE] text-[#A8341F] border border-coral/20">
                🔒 Independent &amp; Free Check
              </span>
            </div>
            <p className="sc-lead">
              Receiving a settlement agreement triggers several overlapping legal deadlines. Knowing these time limits protects your statutory claims if negotiations stall.
            </p>
          </div>
        </section>

        {/* ANSWER-FIRST SECTION & QUICK METRICS */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  ERA 1996 s.111 &amp; ETA 1996 s.18A
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Do settlement agreement negotiations stop the employment tribunal clock?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed font-medium">
                A settlement agreement does not pause the strict three-month minus one day employment tribunal time limit. Under ACAS Code of Practice 4, employers should allow at least 10 calendar days to consider written terms. Only starting ACAS Early Conciliation halts the statutory limitation clock. Settlement payouts customarily arrive within 14 to 28 calendar days.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-paper border border-rule/60">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Consideration Window</span>
                  <span className="font-bold text-ink text-base">10 Calendar Days</span>
                  <span className="text-muted text-[11px]">Guidance under ACAS Code 4 para 12</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-paper border border-rule/60">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tribunal Limitation Deadline</span>
                  <span className="font-bold text-coral text-base">3 Months - 1 Day</span>
                  <span className="text-muted text-[11px]">Strict cut-off from termination date</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-paper border border-rule/60">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Limitation Clock Pause</span>
                  <span className="font-bold text-ink text-base">Day A to Day B</span>
                  <span className="text-muted text-[11px]">ETA 1996 s.18A via ACAS Conciliation</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg bg-paper border border-rule/60">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Employer Legal Contribution</span>
                  <span className="font-bold text-ink text-base">£350 - £750 + VAT</span>
                  <span className="text-muted text-[11px]">Capped fee contribution upon completion</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.111 &amp; s.203</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-3 py-1.5 rounded-lg border border-rule hover:bg-paper text-ink transition-colors">
                    Check my offer now →
                  </Link>
                  <Link href="/calculator/" className="inline-flex items-center text-xs font-bold text-coral hover:text-ink transition-colors gap-1">
                    Calculate my estimate →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SIX CORE FACTS CALLOUT */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-coral" />
                <p className="text-sm font-bold text-ink uppercase tracking-wider text-xs">
                  Key Takeaways for Employees
                </p>
              </div>
              <ul className="flex flex-col gap-3">
                {[
                  {
                    highlight: 'Tribunal Deadline:',
                    text: 'Settlement negotiations do not pause your three-month minus one day employment tribunal limitation clock.',
                  },
                  {
                    highlight: 'Statutory Clock Pause:',
                    text: 'Only notifying ACAS for Early Conciliation pauses the statutory limitation deadline under Section 18A ETA 1996.',
                  },
                  {
                    highlight: 'Consideration Period:',
                    text: 'Under ACAS Code 4, employers should allow at least 10 calendar days to review terms and obtain legal advice.',
                  },
                  {
                    highlight: 'Aggressive Deadlines:',
                    text: 'Artificial 24 or 48-hour ultimatums may constitute improper behaviour under Section 111A(4) ERA 1996.',
                  },
                  {
                    highlight: 'Independent Legal Fees:',
                    text: 'Employers standardly provide a capped fee contribution upon completion (typically £350 to £500+ plus VAT).',
                  },
                  {
                    highlight: 'Payment Execution:',
                    text: 'Agreed settlement payouts usually arrive within 14 to 28 calendar days of signing or your final payroll date.',
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-xs sm:text-sm leading-relaxed">
                      <strong className="text-ink font-semibold">{item.highlight}</strong> {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 1: THE STRICT 3-MONTH TRIBUNAL LIMITATION RULE */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-paper-2 text-muted border border-rule">
                Section 01
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Statutory Limitation
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">The strict 3-month employment tribunal limitation rule</h2>
            <p className="sc-body mb-4">
              UK employment law enforces strict deadlines to bring workplace claims. You must understand your limitation deadline before beginning settlement discussions.
            </p>
            <p className="sc-body mb-4">
              Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors font-medium"
              >
                Section 111(2) ERA 1996
              </a>
              , you must submit an unfair dismissal claim within three months minus one day. Discrimination claims follow the same rule under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/2010/15/section/123"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors font-medium"
              >
                Section 123 of the Equality Act 2010
              </a>
              .
            </p>
            <p className="sc-body mb-4">
              The limitation clock starts on your Effective Date of Termination (EDT). Your EDT is the exact date your employment contract ends.
            </p>

            <div className="p-4 rounded-xl border border-rule bg-paper mb-6">
              <h3 className="font-semibold text-ink text-sm mb-2">How the three-month minus one day rule works</h3>
              <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                To calculate your deadline, add three calendar months to your termination date. Then subtract one single calendar day. For example, if your contract terminates on 15 June, your statutory deadline expires on 14 September.
              </p>
            </div>

            {/* Calendar calculation table */}
            <div className="overflow-x-auto my-6 border border-rule rounded-xl bg-white shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule">
                    <th className="p-3 font-semibold text-ink">Effective Date of Termination</th>
                    <th className="p-3 font-semibold text-ink">Tribunal Limitation Deadline</th>
                    <th className="p-3 font-semibold text-ink">Required Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  <tr>
                    <td className="p-3 font-medium text-ink">15 January</td>
                    <td className="p-3 text-coral font-bold font-mono">14 April</td>
                    <td className="p-3 text-muted">Notify ACAS on or before 14 April</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">31 March</td>
                    <td className="p-3 text-coral font-bold font-mono">29 or 30 June</td>
                    <td className="p-3 text-muted">Notify ACAS before end of June</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">15 June</td>
                    <td className="p-3 text-coral font-bold font-mono">14 September</td>
                    <td className="p-3 text-muted">Notify ACAS on or before 14 September</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">31 August</td>
                    <td className="p-3 text-coral font-bold font-mono">30 November</td>
                    <td className="p-3 text-muted">Notify ACAS on or before 30 November</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">10 October</td>
                    <td className="p-3 text-coral font-bold font-mono">9 January</td>
                    <td className="p-3 text-muted">Notify ACAS on or before 9 January</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="sc-body mb-3">
              Employment tribunals rarely grant deadline extensions. For unfair dismissal, you must prove that filing on time was not reasonably practicable.
            </p>
            <p className="sc-body mb-0">
              In public tribunal precedents, continuing settlement negotiations is almost never accepted as a valid reason for missing the statutory deadline.
            </p>
          </div>
        </section>

        {/* SECTION 2: THE NEGOTIATION TRAP */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-muted border border-rule">
                Section 02
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Procedural Risk
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">The negotiation trap: Why discussions do not stop the clock</h2>
            <p className="sc-body mb-4">
              A dangerous misconception is that settlement negotiations freeze the limitation clock. Employees often assume discussions prevent deadlines from running.
            </p>
            <p className="sc-body mb-4">
              Without Prejudice talks under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors font-medium"
              >
                Section 111A ERA 1996
              </a>{' '}
              do not pause the statutory limitation clock.
            </p>
            <p className="sc-body mb-4">
              If negotiations drag on for 10 or 12 weeks, your limitation deadline approaches quickly. If talks break down after three months, you lose your right to claim.
            </p>

            <div className="bg-white p-5 rounded-xl border border-rule mb-5 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertIcon />
                <div>
                  <strong className="text-ink text-sm block mb-1">
                    Privilege Notice for Settlement Discussions
                  </strong>
                  <p className="text-xs text-muted leading-relaxed m-0">
                    Important Privilege Notice: Do not send unreviewed proposals to HR. Unreviewed correspondence can waive legal privilege or compromise your position. Common law Without Prejudice privilege applies only where a genuine dispute exists. Instruct an SRA-regulated solicitor to manage written negotiations securely.
                  </p>
                </div>
              </div>
            </div>

            <p className="sc-body mb-0">
              An independent solicitor will track your limitation date. They can protect your legal position while keeping commercial settlement discussions constructive.
            </p>
          </div>
        </section>

        {/* SECTION 3: THE 4 CRITICAL SETTLEMENT TIME LIMITS TABLE */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-paper-2 text-muted border border-rule">
                Section 03
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Timeline Comparison
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">The four critical settlement agreement time limits</h2>
            <p className="sc-body mb-4">
              Workplace dispute resolution involves four separate time limits. Each deadline serves a distinct legal and practical function.
            </p>

            <div className="overflow-x-auto my-6 border border-rule rounded-xl bg-paper shadow-sm">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper-2 border-b border-rule">
                    <th className="p-3 font-semibold text-ink">Time Limit</th>
                    <th className="p-3 font-semibold text-ink">Governing Law</th>
                    <th className="p-3 font-semibold text-ink">Duration</th>
                    <th className="p-3 font-semibold text-ink">Legal Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule bg-white">
                  <tr>
                    <td className="p-3 font-medium text-ink">1. Consideration Window</td>
                    <td className="p-3 text-muted">ACAS Code 4 para 12</td>
                    <td className="p-3 font-mono font-bold text-coral">10 calendar days</td>
                    <td className="p-3 text-muted">Statutory guidance to review terms and consult a solicitor.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">2. Tribunal Limitation Clock</td>
                    <td className="p-3 text-muted">ERA 1996 s.111(2)</td>
                    <td className="p-3 font-mono font-bold text-coral">3 months - 1 day</td>
                    <td className="p-3 text-muted">Strict statutory cut-off. Not paused by settlement talks.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">3. ACAS Conciliation Pause</td>
                    <td className="p-3 text-muted">ETA 1996 s.18A</td>
                    <td className="p-3 font-mono font-bold text-coral">Day A to Day B</td>
                    <td className="p-3 text-muted">Pauses limitation clock. Gives at least 1 month post-certificate.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">4. Payment Execution Window</td>
                    <td className="p-3 text-muted">Contractual terms</td>
                    <td className="p-3 font-mono font-bold text-coral">14 to 28 days</td>
                    <td className="p-3 text-muted">Legally binding payment term. Enforceable in County Court.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="sc-body mb-0">
              Understanding these four distinct limits prevents missed deadlines and helps you make informed choices during discussions.
            </p>
          </div>
        </section>

        {/* SECTION 4: ACAS 10-DAY CONSIDERATION RULE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-muted border border-rule">
                Section 04
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                ACAS Code 4
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">ACAS 10-day consideration rule: Guidance vs legal right</h2>
            <p className="sc-body mb-4">
              When an employer presents a settlement agreement, they often request a prompt reply. Understanding what ACAS requires provides practical clarity.
            </p>
            <p className="sc-body mb-4">
              Under paragraph 12 of the{' '}
              <a
                href="https://www.acas.org.uk/code-of-practice-settlement-agreements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors font-medium"
              >
                ACAS Code of Practice on Settlement Agreements (Code 4)
              </a>
              :
            </p>
            <div className="p-4 rounded-xl border border-rule bg-white mb-6 shadow-sm">
              <blockquote className="text-sm italic text-ink/80 border-l-2 border-coral pl-3 my-0">
                &quot;As a general rule, a minimum period of 10 calendar days should be allowed to consider the proposed written terms of a settlement agreement and to receive independent legal advice, unless the parties agree otherwise.&quot;
              </blockquote>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">Statutory guidance rather than an absolute right</h3>
            <p className="sc-body mb-4">
              Under English contract law, an offer remains revocable before acceptance unless separate consideration is paid. ACAS Code 4 provides statutory guidance rather than an irrevocable entitlement.
            </p>
            <p className="sc-body mb-4">
              An employer can set a specific deadline. However, setting an oppressive deadline carries substantial legal consequences for them.
            </p>

            <h3 className="font-semibold text-ink text-base mb-2">Section 111A improper behaviour and artificial deadlines</h3>
            <p className="sc-body mb-4">
              Settlement talks are normally protected from disclosure in ordinary unfair dismissal claims. But under Section 111A(4) ERA 1996, confidentiality is lost if an employer acts improperly.
            </p>
            <p className="sc-body mb-4">
              Imposing an unreasonable deadline of 24 or 48 hours constitutes improper behaviour under ACAS guidance. If your employer does this, the conversation loses statutory secrecy.
            </p>
            <p className="sc-body mb-4">
              You can then present the aggressive deadline to an employment tribunal as supporting evidence. This rule encourages employers to grant reasonable time extensions.
            </p>

            {/* In-content tool CTA */}
            <div className="my-6 p-5 rounded-xl bg-white border border-rule shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
                  Settlement Valuation Check
                </span>
                <strong className="text-base text-ink block mb-1">
                  Calculate your full settlement entitlement
                </strong>
                <p className="text-xs text-muted m-0">
                  Compare your offer against statutory redundancy caps, notice pay, and commercial benchmarks.
                </p>
              </div>
              <Link
                href="/calculator/"
                className="px-4 py-2.5 bg-coral hover:bg-coral-ink text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm text-center cursor-pointer"
              >
                Calculate my estimate →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 5: STOPPING THE CLOCK WITH ACAS EARLY CONCILIATION */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-paper-2 text-muted border border-rule">
                Section 05
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Statutory Clock Pause
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">Stopping the clock with ACAS Early Conciliation (ETA 1996 s.18A)</h2>
            <p className="sc-body mb-4">
              Only one formal step pauses your statutory limitation period: contacting ACAS. Understanding how Early Conciliation pauses the clock protects your position.
            </p>
            <p className="sc-body mb-4">
              Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/17/section/18A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors font-medium"
              >
                Section 18A ETA 1996
              </a>
              , starting ACAS Early Conciliation pauses the statutory limitation clock.
            </p>

            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">
                    A
                  </span>
                  <h3 className="font-semibold text-ink text-sm">Day A: The Notification Date</h3>
                </div>
                <p className="sc-body text-xs text-muted mb-0 pl-7 leading-relaxed">
                  Day A is the calendar day you submit your online Early Conciliation form to ACAS. The limitation clock stops on this day.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-navy text-white text-[10px] font-bold flex items-center justify-center">
                    B
                  </span>
                  <h3 className="font-semibold text-ink text-sm">Day B: The Certificate Date</h3>
                </div>
                <p className="sc-body text-xs text-muted mb-0 pl-7 leading-relaxed">
                  Day B is the date ACAS issues your Early Conciliation certificate. Conciliation can last up to six weeks. The days between Day A and Day B do not count toward your three-month limit.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
                    +
                  </span>
                  <h3 className="font-semibold text-ink text-sm">The Guaranteed One-Month Safety Buffer</h3>
                </div>
                <p className="sc-body text-xs text-muted mb-0 pl-7 leading-relaxed">
                  Under statutory rules, you always have at least one calendar month from Day B to submit an ET1 claim. This applies even if your original limitation deadline has passed.
                </p>
              </div>
            </div>

            <p className="sc-body mb-0">
              Starting ACAS Early Conciliation does not derail constructive discussions. Employers recognise this as a sensible step to protect statutory limitation dates.
            </p>
          </div>
        </section>

        {/* SECTION 6: PAYOUT TIMELINES AND LATE PAYMENT REMEDIES */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-muted border border-rule">
                Section 06
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Payout &amp; Enforcement
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">Settlement payout timelines and late payment remedies</h2>
            <p className="sc-body mb-4">
              Once both parties sign and your solicitor issues the adviser certificate, the settlement agreement becomes legally binding. You then await agreed funds.
            </p>
            <p className="sc-body mb-4">
              Standard commercial agreements specify payment within 14 to 28 calendar days. This timeframe usually matches the next regular company payroll run.
            </p>

            <h3 className="font-semibold text-ink text-base mb-2">Tax treatment of settlement payments</h3>
            <p className="sc-body mb-4">
              Under Section 403 ITEPA 2003, qualifying compensation up to £30,000 is tax-free. This includes redundancy and ex-gratia sums.
            </p>
            <p className="sc-body mb-4">
              Notice pay and Post-Employment Notice Pay (PENP) are taxable under Section 402D ITEPA 2003. Notice pay is subject to income tax and employee National Insurance.
            </p>
            <p className="sc-body mb-4">
              For payments over £30,000, your employer pays Class 1A employer NICs at 15.0%. Employees pay no employee National Insurance on amounts exceeding £30,000.
            </p>

            <div className="p-4 rounded-xl border border-rule bg-white mb-4 shadow-sm">
              <h3 className="font-semibold text-ink text-sm mb-1">What if your employer pays late?</h3>
              <p className="sc-body text-xs text-muted mb-2 leading-relaxed">
                A signed settlement agreement is a binding contract. If your employer misses the agreed date, they commit a breach of contract.
              </p>
              <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                You can enforce payment through the County Court rather than an employment tribunal. You may also claim statutory interest at 8% under Section 69 of the County Courts Act 1984.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 7: STATUTORY COMPENSATION BASELINES (2026/27) */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-paper-2 text-muted border border-rule">
                Section 07
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Statutory Baselines (2026/27)
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">UK statutory baselines and compensation limits (2026/27)</h2>
            <p className="sc-body mb-4">
              Before agreeing to any settlement deadline, compare the offer against your statutory entitlements. These statutory baselines establish your minimum position.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Weekly Pay Cap</span>
                <span className="text-xl font-bold text-coral font-mono">£751</span>
                <span className="text-[11px] text-muted block mt-1">SI 2026/310 (GB) / £783 (NI)</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Max Redundancy Pay</span>
                <span className="text-xl font-bold text-coral font-mono">£22,530</span>
                <span className="text-[11px] text-muted block mt-1">20 years service cap (GB)</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Compensatory Award Cap</span>
                <span className="text-xl font-bold text-coral font-mono">£123,543</span>
                <span className="text-[11px] text-muted block mt-1">Unfair dismissal limit</span>
              </div>
            </div>

            <h3 className="font-semibold text-ink text-sm mb-3">Vento Injury to Feelings Guidelines (April 2026 9th Addendum)</h3>
            <p className="sc-body text-xs text-muted mb-4">
              For discrimination complaints under the Equality Act 2010, tribunals award injury to feelings under the Vento bands:
            </p>

            {/* Vento Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl border border-rule bg-paper flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Lower Band</span>
                  <span className="text-base font-bold font-mono text-ink block mb-1">£1,300 to £12,600</span>
                </div>
                <p className="text-xs text-muted m-0 leading-relaxed">
                  For isolated or less serious incidents of unlawful discrimination.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-rule bg-paper flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Middle Band</span>
                  <span className="text-base font-bold font-mono text-ink block mb-1">£12,600 to £37,700</span>
                </div>
                <p className="text-xs text-muted m-0 leading-relaxed">
                  For serious cases that do not merit an award in the highest band.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-rule bg-paper flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Upper Band</span>
                  <span className="text-base font-bold font-mono text-coral block mb-1">£37,700 to £62,900</span>
                </div>
                <p className="text-xs text-muted m-0 leading-relaxed">
                  For the most serious and prolonged campaigns of unlawful discrimination.
                </p>
              </div>
              <div className="p-3.5 rounded-xl border border-rule bg-paper flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Exceptional Band</span>
                  <span className="text-base font-bold font-mono text-coral block mb-1">£62,900+</span>
                </div>
                <p className="text-xs text-muted m-0 leading-relaxed">
                  Reserved exclusively for the most egregious and severe discrimination cases.
                </p>
              </div>
            </div>

            <p className="sc-body mb-0 text-xs text-muted leading-relaxed">
              Independent legal advice is required under Section 203(3) ERA 1996 for any settlement waiver to be legally valid. In commercial practice, employers standardly provide a capped fee contribution upon completion. An SRA-regulated solicitor will evaluate whether the financial offer reflects these statutory ceilings.
            </p>
          </div>
        </section>

        {/* SECTION 8: PRACTICAL ACTION PLAN WHEN FACING A TIGHT DEADLINE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-muted border border-rule">
                Section 08
              </span>
              <span className="text-xs font-semibold text-coral uppercase tracking-wide">
                Action Protocol
              </span>
            </div>
            <h2 className="sc-section-h2 mb-4">Action plan when facing a tight settlement deadline</h2>
            <p className="sc-body mb-4">
              If your employer imposes a tight deadline, following a clear sequence of steps protects your statutory rights.
            </p>

            <div className="space-y-4 mb-6">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-rule bg-white shadow-sm flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-paper border border-rule text-ink text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-sm mb-1">Note your termination date and calculate your deadline</h3>
                  <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                    Identify your Effective Date of Termination. Calculate three calendar months minus one day. Record this date immediately in your calendar.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-rule bg-white shadow-sm flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-paper border border-rule text-ink text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-sm mb-1">Request 10 calendar days under ACAS Code 4</h3>
                  <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                    Reply calmly in writing. Reference paragraph 12 of ACAS Code of Practice 4. State that you need reasonable time to obtain independent legal advice.
                  </p>
                </div>
              </div>

              {/* SRA Precision Redline: Hyde v Wrench & Routledge v Grant Warning Box */}
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-xs text-amber-950 leading-relaxed shadow-sm flex items-start gap-3">
                <span className="text-base flex-shrink-0" aria-hidden="true">⚠️</span>
                <div>
                  <strong className="block font-bold text-amber-950 text-xs mb-1">
                    Critical Contract Rule (Hyde v Wrench &amp; Routledge v Grant):
                  </strong>
                  <p className="m-0 text-amber-900 leading-relaxed text-[12px]">
                    Under English contract law, proposing a counter-offer legally terminates your employer&apos;s existing offer. An employer is also entitled to withdraw an unaccepted offer at any time prior to execution. Never reject an offer or submit counter-demands without prior advice from your instructed solicitor.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-rule bg-white shadow-sm flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-paper border border-rule text-ink text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-sm mb-1">Check your figures using an independent calculator</h3>
                  <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                    Verify your statutory redundancy floor, accrued holiday pay, and notice pay. This clarifies whether the settlement sum meets commercial standards.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-rule bg-white shadow-sm flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-paper border border-rule text-ink text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  4
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-sm mb-1">Instruct an SRA-regulated solicitor</h3>
                  <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                    Employers standardly provide a capped fee contribution upon completion (typically £350 to £500+ plus VAT). A specialist solicitor will review the draft and certify the agreement.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="p-4 rounded-xl border border-rule bg-white shadow-sm flex items-start gap-3.5">
                <span className="w-7 h-7 rounded-full bg-paper border border-rule text-ink text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  5
                </span>
                <div className="flex-1">
                  <h3 className="font-semibold text-ink text-sm mb-1">Notify ACAS if your limitation deadline approaches</h3>
                  <p className="sc-body text-xs text-muted mb-0 leading-relaxed">
                    If discussions extend past week eight or nine, submit an ACAS Early Conciliation form. This stops the limitation clock while talks proceed.
                  </p>
                </div>
              </div>
            </div>

            {/* SRA Precision Redline: Solicitor Match CTA card with SRA Rule 5.1 Choice Notice */}
            <div className="p-6 rounded-xl bg-card border border-rule shadow-sm text-center">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F] mb-3">
                Independent Solicitor Matching
              </span>
              <h3 className="font-serif text-lg font-bold text-ink mb-2">
                Need an independent solicitor to review your agreement?
              </h3>
              <p className="text-xs text-muted max-w-md mx-auto mb-4 leading-relaxed">
                Connect with an SRA-regulated employment solicitor from our panel. Employers standardly provide a capped legal fee contribution upon completion.
              </p>
              <div className="mb-4">
                <Link
                  href="/get-matched/"
                  className="btn-accent inline-flex items-center justify-center text-xs font-semibold px-5 py-3 rounded-lg shadow-sm"
                >
                  Connect with specialist solicitor →
                </Link>
              </div>
              <p className="text-[11px] text-muted max-w-lg mx-auto m-0 leading-relaxed">
                SettlementCheck is an independent platform and not a law firm. You are under no obligation to use our panel and remain free to instruct any independent SRA-regulated solicitor of your choice.
              </p>
            </div>
          </div>
        </section>

        {/* REVIEW CALLOUT COMPONENT */}
        <div className="max-w-2xl mx-auto px-5">
          <ReviewCallout
            title="Holding a draft settlement agreement with a tight deadline?"
            description="Verify your statutory redundancy baselines, check tax calculations under Section 403 ITEPA 2003, and confirm employer fee contribution terms before signing."
            ctaText="Check my offer now →"
            badge="Confidential Deadline Review"
          />
        </div>

        {/* FAQS ACCORDION SECTION */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently asked questions about settlement time limits</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* RELATED ARTICLES */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Settlement Guides &amp; Calculators"
              items={[
                {
                  href: '/guides/how-long-does-a-settlement-agreement-take/',
                  title: 'How Long Does a Settlement Agreement Take?',
                  description: 'Detailed breakdown of the negotiation process, solicitor certification speeds, and bank payout windows.',
                  tag: 'Timeline Guide',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw a Settlement Offer?',
                  description: 'Learn UK contract rules, counter-offer risks, and how to negotiate safely without losing your baseline.',
                  tag: 'Contract Law',
                },
                {
                  href: '/guides/settlement-agreement-vs-tribunal-claim/',
                  title: 'Settlement Agreement vs Employment Tribunal',
                  description: 'Compare financial payouts, time frames, legal costs, and stress levels between settlement and tribunal.',
                  tag: 'Tribunal Comparison',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax-Free Settlement £30,000 Rule Explained',
                  description: 'Understand which exit payments qualify for tax-free treatment under Section 403 ITEPA 2003.',
                  tag: 'Tax Guide',
                },
              ]}
            />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
