import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  title: "Is My Employer's Settlement Offer Fair? | SettlementCheck",
  description:
    "Is your employer's settlement offer fair? Compare your payout against April 2026 statutory caps (£751/wk), notice pay, and commercial benchmarks. Free UK check.",
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
  },
  openGraph: {
    title: "Is My Employer's Settlement Offer Fair? | SettlementCheck",
    description:
      "Is your employer's settlement offer fair? Compare your payout against April 2026 statutory caps (£751/wk), notice pay, and commercial benchmarks. Free UK check.",
    url: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'What is the average settlement agreement payout in the UK?',
    a: 'There is no single UK average because every package starts from a different calculated statutory baseline. Your baseline depends on length of service, age, notice period, and accrued holiday. On top of statutory entitlements, commercial ex-gratia offers commonly range from 1 to 3 months of gross pay, rising where there is a credible legal claim.',
  },
  {
    q: 'Is an initial settlement offer usually final?',
    a: 'An initial settlement offer is often an opening proposal rather than an employer\'s maximum budget. Where relevant factors exist, such as procedural flaws, garden leave terms, or disputed circumstances, an independent solicitor can review whether there is room to propose adjustments.',
  },
  {
    q: 'What happens if I reject a settlement offer?',
    a: 'Under English contract law (Routledge v Grant and Hyde v Wrench), rejecting an offer or making an unreviewed counter-proposal ends the original offer. Your employer can legally withdraw it before anything is signed. Always discuss any proposed response with your solicitor before replying to HR.',
  },
  {
    q: 'How long do I have to decide?',
    a: 'ACAS Code of Practice 4 (para 12) recommends at least 10 calendar days as general guidance to consider a written agreement. However, 10 days is guidance rather than a binding statutory right under s.203(3) ERA 1996, and an employer can withdraw an unaccepted offer at common law (Routledge v Grant). Seek independent legal advice before any deadline expires.',
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
  headline: 'Is My Settlement Offer Fair? How to Tell If Your Offer Matches UK Statutory Rates',
  url: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
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
    '@id': 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 162',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/162',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
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

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

export default function IsMyOfferFairGuide() {
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Is My Settlement Agreement Offer Fair?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement in your inbox? In 2026, your calculated statutory baseline is anchored by notice pay, accrued holiday, and redundancy pay capped at £751 per week (SI 2026/310). Check your baseline in 60 seconds with no email required, then review the figures with an independent solicitor.
            </p>
          </div>
        </section>

        {/* Embedded Calculator Immediately Below Hero */}
        <section className="bg-card pt-10 pb-4">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's figure against your calculated statutory baseline and typical 1 to 3 months gross commercial ranges."
              disputeType="redundancy"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Unfair Dismissal Cap', value: '£123,543', statute: 'ERA 1996 s.124' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={52000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* What makes it fair */}
        <section className="py-12 border-b border-rule bg-card">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What makes a settlement offer fair?</h2>
            <p className="guide-body mb-4">
              A fair settlement reflects three elements: your statutory entitlements, the value of any legal claims you waive, and the commercial cost of a dispute. Fairness is measured in pounds, not verbal assurances.
            </p>
            <p className="guide-body mb-6">
              See our guides on{' '}
              <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">
                what is a fair settlement agreement
              </Link>{' '}
              and{' '}
              <Link href="/guides/settlement-agreement-acas-calculations/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">
                how ACAS-based settlement calculations work
              </Link>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Statutory Baseline</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Statutory redundancy pay (subject to 2 years&apos; service and s.141 ERA 1996 eligibility).</li>
                  <li>Contractual notice pay or garden leave, plus accrued untaken holiday.</li>
                  <li>Notice pay and holiday pay are always taxed as wages.</li>
                </ul>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Commercial Uplift</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Ex-gratia compensation for waiving potential employment tribunal claims.</li>
                  <li>First £30,000 of genuine termination compensation is usually tax-free (ITEPA 2003 s.403).</li>
                  <li>Separate consideration if new non-compete restrictions are added.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does statutory redundancy compare to a commercial offer?</h2>
            <p className="guide-body mb-6">
              The table below illustrates how a calculated statutory redundancy baseline compares with typical commercial settlement ranges:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-rule text-left">
                    <th className="py-3 pr-4 font-semibold text-ink">Length of service</th>
                    <th className="py-3 px-4 font-semibold text-ink">Statutory redundancy</th>
                    <th className="py-3 pl-4 font-semibold text-ink">Illustrative commercial range</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  {[
                    { service: '2 to 4 years', stat: '£2,000 to £4,500', fair: '£4,000 to £9,000' },
                    { service: '5 to 9 years', stat: '£5,000 to £10,000', fair: '£10,000 to £22,000' },
                    { service: '10 to 14 years', stat: '£10,000 to £18,000', fair: '£20,000 to £38,000' },
                    { service: '15+ years', stat: '£15,000 to £22,530*', fair: '£30,000 to £50,000+' },
                  ].map(({ service, stat, fair }) => (
                    <tr key={service}>
                      <td className="py-3 pr-4 font-medium text-ink">{service}</td>
                      <td className="py-3 px-4 text-muted">{stat}</td>
                      <td className="py-3 pl-4 font-semibold text-ink">{fair}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[14px] text-muted mt-3">
              *Statutory redundancy capped at £22,530 based on 20 years maximum and £751 weekly pay cap (April 2026). See our{' '}
              <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">2026 redundancy pay cap</Link>{' '}
              guide or check your figure in the{' '}
              <Link href="/redundancy-calculator/" className="underline hover:text-ink font-medium">redundancy calculator</Link>.
            </p>

            <ReviewCallout
              title="Want to check your specific written offer?"
              description="Compare your draft agreement terms against April 2026 statutory rates, tax splits, and commercial ranges before speaking with a solicitor."
              ctaText="Check my offer now →"
              badge="April 2026 Statutory Check"
            />
          </div>
        </section>

        {/* Red flags */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What warning signs suggest an offer needs closer review?</h2>
            <p className="guide-body mb-6">
              Before you agree to waive your employment rights, check your draft agreement for these five common issues:
            </p>
            <ul className="flex flex-col gap-4">
              {[
                {
                  title: 'The offer only covers statutory redundancy and notice',
                  detail: 'If the total matches what you would receive in a standard redundancy, there is no ex-gratia uplift for signing away your right to bring an employment tribunal claim.',
                },
                {
                  title: 'Missing or low legal fee contribution',
                  detail: 'Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion, with any excess or abortive work subject to your solicitor engagement terms.',
                },
                {
                  title: 'A deadline shorter than 10 calendar days',
                  detail: 'ACAS Code of Practice 4 recommends at least 10 calendar days as general guidance to consider a written offer, though this is not a binding statutory right.',
                },
                {
                  title: 'Notice pay or holiday is bundled into the tax-free sum',
                  detail: 'Contractual notice, garden leave, and accrued holiday pay are always taxed as wages. They should be listed separately from any tax-free ex-gratia compensation.',
                },
                {
                  title: 'New non-compete or confidentiality restrictions',
                  detail: 'If the draft introduces or extends post-termination non-compete clauses, a solicitor will normally check whether separate taxable consideration is offered.',
                },
              ].map(({ title, detail }, i) => (
                <li key={title} className="flex items-start gap-3">
                  <WarningIcon />
                  <div>
                    <p className="font-semibold text-ink mb-1">{title}</p>
                    <p className="guide-body">
                      {detail}
                      {i === 2 && (
                        <> Read more on{' '}
                          <Link href="/guides/pressured-to-sign/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">
                            short settlement deadlines
                          </Link>.
                        </>
                      )}
                      {i === 1 && (
                        <> See our guide on{' '}
                          <Link href="/guides/employer-recommended-solicitor/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">
                            independent legal advice and employer-recommended solicitors
                          </Link>.
                        </>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Negotiation factors */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-6">What factors affect how much you can negotiate?</h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Age, service, and s.141 eligibility',
                  body: 'Statutory redundancy scales by age (0.5, 1.0, or 1.5 weeks per year) up to 20 years, subject to 2 years of service and s.141 ERA 1996 rules on suitable alternative employment.',
                },
                {
                  title: 'Potential legal claims and s.111A scope',
                  body: 'Protected conversations under s.111A ERA 1996 only shield ordinary unfair dismissal talks. Written evidence of discrimination, whistleblowing, or improper behaviour sits outside s.111A and affects commercial risk.',
                },
                {
                  title: 'Legal privilege and without prejudice talks',
                  body: 'Genuine settlement correspondence attracts without prejudice privilege if a pre-existing dispute exists. Your solicitor can verify whether a letter is genuinely off the record before you respond.',
                },
                {
                  title: 'Common law revocation risk (Hyde v Wrench)',
                  body: 'Making a counter-proposal legally rejects the opening offer under English contract law. Discuss any counter-figure with an independent solicitor first so you weigh the risk of withdrawal.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-ink mb-1">{title}</p>
                    <p className="guide-body">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-paper rounded border border-rule">
              <p className="guide-body">
                Want to understand the negotiation process? Read our guide on{' '}
                <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-ink font-semibold underline underline-offset-2 hover:text-coral transition-colors">
                  how to negotiate a settlement agreement
                </Link>{' '}
                or check{' '}
                <Link href="/guides/what-happens-if-you-do-not-sign/" className="text-ink font-semibold underline underline-offset-2 hover:text-coral transition-colors">
                  what happens if you do not sign
                </Link>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-3">
              Check where your offer stands
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed mb-6">
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
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* Related Articles Component */}
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              items={[
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'How statutory baselines, tax exemptions, and legal validity rules work under UK law.',
                  tag: 'Fairness',
                },
                {
                  href: '/guides/settlement-agreement-acas-calculations/',
                  title: 'Settlement Agreement ACAS-Based Calculations Explained',
                  description: 'How ACAS-based statutory calculations work and how compensation is structured.',
                  tag: 'Calculations',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Without prejudice rules, tax splits, and how to prepare for talks with a solicitor.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'What the ACAS 10-day guidance means if you have been given a short deadline.',
                  tag: 'Rights',
                },
                {
                  href: '/guides/average-settlement-agreement-payout-uk/',
                  title: 'Average Settlement Agreement Payouts UK (2026)',
                  description: 'Compare your offer against typical UK payout ranges and statutory baselines.',
                  tag: 'Benchmarks',
                },
                {
                  href: '/reports/uk-settlement-index-2026/',
                  title: 'UK Employment Settlement Index 2026',
                  description: '2026 sector severance multiples across 8 major UK employment sectors.',
                  tag: '2026 Report',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities &amp; Official References</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 227 (Statutory weekly pay cap)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 162 (Redundancy formula &amp; calculation mechanics)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (Limit on compensatory award)
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/code-of-practice-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Code of Practice on Settlement Agreements (Code of Practice 4)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent educational tool and calculation service, not a law firm. The figures generated are estimates based on standard UK statutory formulas and do not constitute formal legal counsel. Always obtain independent advice from an SRA-regulated solicitor before signing.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
