import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  title: 'ACAS Settlement Agreement Calculations | SettlementCheck',
  description:
    'How negotiation benchmarks work. Understand the £751 weekly cap (April 2026), £30k tax exemption, PILON rules, and statutory redundancy baselines.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
  },
  openGraph: {
    title: 'ACAS Settlement Agreement Calculations | SettlementCheck',
    description:
      'How negotiation benchmarks work. Understand the £751 weekly cap (April 2026), £30k tax exemption, PILON rules, and statutory redundancy baselines.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'Are these ACAS-based calculations official?',
    a: 'SettlementCheck is an independent tool, not affiliated with ACAS. Our calculations follow UK statutory rates set by SI 2026/310: the £751 weekly pay cap, the three-tier redundancy formula, and the £30,000 tax-free limit under ITEPA 2003 s.403.',
  },
  {
    q: 'Can I get more than the ACAS-based statutory figure?',
    a: 'Yes. The statutory framework sets the calculated statutory baseline, not the ceiling. Employers often add ex-gratia compensation on top of statutory redundancy to secure a waiver of claims. An independent solicitor can advise on what figure is reasonable for your circumstances.',
  },
  {
    q: 'How accurate are ACAS-based calculations?',
    a: 'The statutory rules are fixed by law: the weekly pay cap, the three-tier formula, and the £30,000 limit do not vary. Our calculator applies these rules directly. It cannot assess your individual bargaining position or legal claims, so discuss the result with an independent solicitor.',
  },
  {
    q: 'What does ACAS-based mean for settlement agreements?',
    a: 'ACAS-based refers to calculations using UK statutory rates and employment law rules. These include the £751 weekly pay cap (April 2026, SI 2026/310), the statutory redundancy formula under the Employment Rights Act 1996, and the £30,000 tax exemption under ITEPA 2003 s.403.',
  },
  {
    q: 'Does ACAS offer an official settlement agreement calculator?',
    a: 'No. ACAS provides free early conciliation and statutory guidance, but does not offer an online settlement agreement calculator. SettlementCheck applies the statutory formula from the Employment Rights Act 1996 alongside observed commercial ranges to estimate your package.',
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
  headline: 'How ACAS-Based Settlement Calculations Work: What the £751 Weekly Pay Cap Means for Your Offer',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
  datePublished: '2026-05-20',
  dateModified: '2026-05-20',
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
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 227',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/227',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 162',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/162',
    },
    {
      '@type': 'Legislation',
      name: 'Trade Union and Labour Relations (Consolidation) Act 1992, Section 288',
      url: 'https://www.legislation.gov.uk/ukpga/1992/52/section/288',
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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function AcasCalculationsGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">ACAS-Based Calculations</span>
            </div>
            <h1 className="sc-h1 mb-4">
              How ACAS-Based Settlement Calculations Work
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              ACAS-based settlement calculations use statutory rates set by UK employment law, including the £751 weekly pay cap (SI 2026/310). Check your calculated statutory baseline and £30,000 tax-free split in 60 seconds with no email required, then review your draft terms with an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Calculator immediately below Hero */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Calculate statutory redundancy under ERA 1996 s.162, contractual notice, and typical commercial compensation ranges."
                disputeType="acas"
                statutoryPills={[
                  { label: 'Weekly Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Tax-Free Cap', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                  { label: 'Max Redundancy', value: '£22,530', statute: 'ERA 1996 s.162' },
                ]}
                initialSalary={45000}
                initialYears={5}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. What do ACAS-based statutory calculations cover?</h2>
              <p className="guide-body">
                ACAS-based calculations set out the calculated statutory baseline across England, Scotland, and Wales. They show your minimum entitlement, not the ceiling.
              </p>
              <p className="guide-body">
                Learn how employers structure offers above this baseline in our guide on{' '}
                <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                  what is a fair settlement agreement
                </Link>
                . Four elements make up the baseline:
              </p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="guide-body">
                    Statutory redundancy pay is capped at £22,530, using age, service, and weekly pay capped at £751 (April 2026, SI 2026/310). Check yours in our{' '}
                    <Link href="/redundancy-calculator/" className="text-coral underline underline-offset-2 hover:text-ink">
                      redundancy pay calculator
                    </Link>{' '}
                    or read about the{' '}
                    <Link href="/guides/redundancy-pay-cap-2026/" className="text-coral underline underline-offset-2 hover:text-ink">
                      redundancy pay cap 2026
                    </Link>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="guide-body">Notice pay covers your contractual notice period, whether paid in lieu (PILON) or worked on garden leave.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="guide-body">Holiday pay covers accrued but untaken annual leave up to your leaving date, taxed as wages.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="guide-body">
                    The £30,000 tax-free limit applies to genuine compensation under ITEPA 2003 s.403 (see{' '}
                    <Link href="/guides/tax-free-settlement-30000/" className="text-coral underline underline-offset-2 hover:text-ink">
                      tax on settlements: £30k rule
                    </Link>), excluding PILON.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. How is statutory redundancy pay calculated in 2026?</h2>
              <p className="guide-body">
                Statutory redundancy pay uses a three-tier formula under Section 162 of the Employment Rights Act 1996. Each completed year of qualifying service counts as a fraction of a week&apos;s pay, capped at £751 from April 2026 (SI 2026/310).
              </p>
              <div className="rounded-xl border border-rule overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-4 py-3 font-medium">Age at redundancy</th>
                      <th className="text-left px-4 py-3 font-medium">Weeks per year of service</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['Under 22', '0.5 week'],
                      ['22 to 40', '1 week'],
                      ['41 and over', '1.5 weeks'],
                    ].map(([age, rate], i) => (
                      <tr key={age} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                        <td className="px-4 py-3 text-ink">{age}</td>
                        <td className="px-4 py-3 text-ink">{rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-[14px] font-semibold text-ink mb-2">Example calculation</p>
                <p className="guide-body mb-2">
                  An employee aged 38 has 9 completed years of service and earns £600 per week gross. Age 38 falls in the middle tier (1 week per year).
                </p>
                <p className="guide-body mb-2">
                  9 years &times; £600 = <strong>£5,400 statutory redundancy</strong>.
                </p>
                <p className="text-[14px] text-muted">
                  The £751 cap only applies if weekly pay exceeds £751. At £600/week, actual weekly pay is used.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How do the £30,000 tax-free limit and PILON work?</h2>
              <p className="guide-body">
                Up to £30,000 of genuine termination compensation can be paid tax-free under ITEPA 2003 s.403. This covers statutory redundancy and ex-gratia compensation.
              </p>
              <div className="rounded-xl border border-rule bg-paper p-5 flex gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  PILON (Payment in Lieu of Notice) is always taxed as wages under ITEPA 2003 s.402D. Your employer must deduct income tax and National Insurance from notice pay before paying it.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Taxed as Wages (PAYE &amp; NI)</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Contractual notice pay and PILON (under PENP rules).</li>
                    <li>Salary paid while on garden leave.</li>
                    <li>Accrued, untaken holiday pay.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Tax-Free Up to £30,000 (s.403)</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Statutory redundancy pay.</li>
                    <li>Genuine ex-gratia termination compensation.</li>
                    <li>Combined exemption capped at £30,000 total.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. Does the 10-day ACAS consideration period give you a strict right?</h2>
              <p className="guide-body">
                Paragraph 12 of the ACAS Code of Practice 4 recommends a minimum of 10 calendar days as general guidance to consider a written offer. Under English contract law (<em>Routledge v Grant</em> and <em>Hyde v Wrench</em>), this is guidance rather than a binding right.
              </p>
              <p className="guide-body">
                An employer can set a shorter deadline, withdraw an unaccepted offer, or treat a counter-offer as rejecting the original figure. If you face a tight deadline, read our guide on{' '}
                <Link href="/guides/pressured-to-sign/" className="text-coral underline underline-offset-2 hover:text-ink">
                  being pressured to sign quickly
                </Link>
                .
              </p>
              <p className="guide-body">
                Within the review window, you can instruct an independent solicitor (see{' '}
                <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink">
                  choosing your own solicitor
                </Link>
                ) to check the waiver, non-compete clauses, and tax split. Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion (excess or abortive work is subject to your solicitor engagement terms).
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                See your statutory figure now
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Enter your age, salary, and length of service. The calculator applies April 2026 statutory rates and separates PILON from the £30,000 tax-free limit.
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

            {/* FAQs */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/redundancy-calculator/',
                  title: 'Redundancy Pay Calculator',
                  description: 'Calculate your statutory redundancy using the £751 weekly cap and age tiers.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Understand how employers structure ex-gratia sums beyond the statutory baseline.',
                  tag: 'Valuation',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax on Settlement Agreements: £30,000 Rule',
                  description: 'Detailed guide to ITEPA 2003 s.403 exemptions and taxable notice pay.',
                  tag: 'Tax Rules',
                },
                {
                  href: '/guides/pilon-tax-treatment-2026/',
                  title: 'PILON Tax Treatment 2026',
                  description: 'Why Pay in Lieu of Notice is always taxed as wages under s.402D.',
                  tag: 'Notice & Tax',
                },
              ]}
            />

            {/* References & Disclaimer */}
            <div className="bg-paper border border-rule rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">Statutory Authorities &amp; Official References</h3>
              <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 162 (Statutory redundancy payment computation)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 227 (Statutory weekly pay limit)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                  </a>
                </li>
                <li>
                  <a href="https://www.acas.org.uk/code-of-practice-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Acas Code of Practice on Settlement Agreements (Code of Practice 4)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 threshold)
                  </a>
                </li>
              </ol>
              <p className="pt-4 border-t border-rule text-[14px] text-muted leading-relaxed">
                <strong>Disclaimer &amp; Legal Notice:</strong> SettlementCheck is an independent platform and is not affiliated with ACAS. Figures are estimates based on UK statutory formulas (ERA 1996 and SI 2026/310) and do not constitute formal legal advice. Always obtain independent advice from an SRA-regulated solicitor before signing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
