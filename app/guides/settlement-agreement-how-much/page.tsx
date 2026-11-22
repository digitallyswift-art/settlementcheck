import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  title: 'How Much Is a Settlement Agreement Worth? | SettlementCheck',
  description:
    'See how UK settlement agreement amounts are structured in 2026. Illustrative ranges, notice pay, £751 weekly cap, and £30,000 tax-free rules.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
  },
  openGraph: {
    title: 'How Much Is a Settlement Agreement Worth? | SettlementCheck',
    description:
      'See how UK settlement agreement amounts are structured in 2026. Illustrative ranges, notice pay, £751 weekly cap, and £30,000 tax-free rules.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/settlement-agreement-how-much/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'How much is a typical UK settlement agreement?',
    a: 'In straightforward commercial exits, opening offers often include one to three months of gross salary as an ex-gratia payment, plus notice pay and accrued holiday. Statutory redundancy pay (for 2+ years of service) is capped at £751 per week in Great Britain, and the first £30,000 of genuine compensation is usually tax-free.',
  },
  {
    q: 'What is the difference between statutory pay and an ex-gratia payment?',
    a: 'Statutory redundancy pay is your legal entitlement if you have at least two years of continuous service, capped at £751 per week. An ex-gratia payment is discretionary compensation offered to waive potential employment tribunal claims. Together, the first £30,000 is usually tax-free under Section 403 of ITEPA 2003.',
  },
  {
    q: 'How is notice pay taxed in a settlement agreement?',
    a: 'Payment in lieu of notice (PILON) and garden leave salary are always taxed as wages under Section 402D of ITEPA 2003. Both are subject to income tax and National Insurance, so they do not fall inside the £30,000 tax-free exemption.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can legally withdraw it before anything is signed. Section 111A ERA 1996 keeps pre-termination talks off the record for ordinary unfair dismissal, though not for discrimination or whistleblowing.',
  },
  {
    q: 'Who pays the solicitor legal fees for reviewing my agreement?',
    a: 'Under Section 203(3) ERA 1996, independent legal advice is required for the waiver to bind. Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion. Excess or abortive work is subject to your solicitor engagement terms.',
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
  headline: 'Settlement Agreement: How Much Is Your Offer Worth? (UK 2026 Guide)',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
  datePublished: '2026-05-20',
  dateModified: '2026-07-11',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
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
    {
      '@type': 'Legislation',
      name: 'The Employment Rights (Increase of Limits) Order 2026',
      url: 'https://www.legislation.gov.uk/uksi/2026/310/contents/made',
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://settlementcheck.co.uk/guides/' },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Settlement Agreement How Much',
      item: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
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

export default function HowMuchGuidePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(breadcrumbSchema) }} />
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
              Settlement Agreement: How Much Is Your Offer Worth?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ITEPA 2003
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement in your inbox and wondering how much it is worth? Check your calculated statutory baseline in 60 seconds with no email required, see how notice pay and tax rules split your package, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Calculator Immediately Below Hero */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Enter your salary and service length to see your calculated statutory baseline and illustrative 1 to 3 months gross commercial ranges."
                disputeType="how_much"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Commercial Range', value: '1 to 3 Months Gross', statute: 'Observed Norm' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={50000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Answer-First Callout Box */}
            <div
              itemScope
              itemType="https://schema.org/Question"
              className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-coral mb-2 block">
                Direct Answer
              </span>
              <h2 itemProp="name" className="guide-h2 mb-3">
                How much is a typical UK settlement agreement?
              </h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="guide-body mb-4">
                  In straightforward redundancy or capability exits, employers often propose an ex-gratia sum of one to three months of gross salary on top of notice and holiday pay. Statutory redundancy is capped at £751 per week under SI 2026/310. The first £30,000 of genuine compensation is usually tax-free under Section 403 of ITEPA 2003.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Ex-Gratia Range</span>
                  <span className="font-bold text-ink text-sm">1 to 3 Months&apos; Gross Pay</span>
                  <span className="text-muted text-[12px]">Illustrative commercial starting point</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Cap</span>
                  <span className="font-bold text-ink text-sm">£751 / week (GB 2026)</span>
                  <span className="text-muted text-[12px]">ERA 1996 s.227 (SI 2026/310)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax-Free Limit</span>
                  <span className="font-bold text-ink text-sm">First £30,000 Free of Tax</span>
                  <span className="text-muted text-[12px]">ITEPA 2003 s.403 (excludes PILON)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Fee Contribution</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[12px]">Paid on completion (ERA 1996 s.203)</span>
                </div>
              </div>
            </div>

            {/* Section 1: The Three Separate Pots */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. How is a settlement payout split into three pots?</h2>
              <p className="guide-body">
                HR often presents your settlement as a single headline figure. In practice, a draft agreement splits the payout into three separate pots, and HMRC taxes each one differently.
              </p>

              <div className="space-y-4 mt-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-[16px] mb-2">1. Notice Pay, PILON, and Garden Leave</h3>
                  <p className="guide-body mb-2">
                    Whether you serve your notice on garden leave or receive Payment in Lieu of Notice (PILON), it is always taxed as wages under Section 402D of ITEPA 2003. Income tax and National Insurance apply in full.
                  </p>
                  <p className="text-[14px] text-muted">
                    Statutory minimum notice is 1 week per year of service, up to 12 weeks. Read our{' '}
                    <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-coral">
                      PILON tax rules guide
                    </Link>
                    .
                  </p>
                </div>

                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-[16px] mb-2">2. Statutory Redundancy Pay</h3>
                  <p className="guide-body mb-2">
                    If your role is redundant and you have two or more years of continuous service, you qualify for statutory redundancy pay under the Employment Rights Act 1996. For 2026/27, weekly pay is capped at £751 in Great Britain under{' '}
                    <a
                      href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-coral"
                    >
                      SI 2026/310
                    </a>
                    .
                  </p>
                  <p className="text-[14px] text-muted">
                    Statutory redundancy pay counts toward the £30,000 tax-free threshold. Check the{' '}
                    <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-coral">
                      2026 statutory redundancy cap
                    </Link>
                    .
                  </p>
                </div>

                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-[16px] mb-2">3. Ex-Gratia Compensation Payment</h3>
                  <p className="guide-body mb-2">
                    This is the discretionary sum offered in exchange for waiving employment tribunal claims. In straightforward exits, opening figures often sit around one to three months of gross salary.
                  </p>
                  <p className="text-[14px] text-muted">
                    The first £30,000 of combined redundancy and ex-gratia compensation is usually tax-free under Section 403 of ITEPA 2003. See how the{' '}
                    <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-coral">
                      £30,000 tax-free exemption
                    </Link>{' '}
                    works.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Benchmarks by Scenario */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. How do settlement amounts vary by situation?</h2>
              <p className="guide-body">
                The figures below are illustrative commercial ranges observed across UK settlement discussions. They are not statutory guarantees and depend on your service length, notice period, and any potential legal claims.
              </p>

              <div className="rounded-xl border border-rule overflow-hidden mt-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Illustrative settlement agreement ranges by circumstance</caption>
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left py-3 px-4 font-medium">Circumstance</th>
                      <th className="text-left py-3 px-4 font-medium">Illustrative Ex-Gratia</th>
                      <th className="text-left py-3 px-4 font-medium">Notice &amp; Redundancy</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-paper">
                      <td className="py-3 px-4 text-ink font-medium">Standard Redundancy</td>
                      <td className="py-3 px-4 text-muted">1 to 2 months&apos; salary</td>
                      <td className="py-3 px-4 text-muted">Full notice + statutory redundancy</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-ink font-medium">
                        <Link href="/guides/settlement-agreement-instead-of-pip/" className="hover:text-coral underline">
                          Performance / PIP Exit
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted">2 to 3 months&apos; salary</td>
                      <td className="py-3 px-4 text-muted">Full notice paid as PILON</td>
                    </tr>
                    <tr className="bg-paper">
                      <td className="py-3 px-4 text-ink font-medium">
                        <Link href="/guides/protected-conversations-without-prejudice/" className="hover:text-coral underline">
                          Workplace Dispute / Grievance
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted">3 to 6 months&apos; salary</td>
                      <td className="py-3 px-4 text-muted">Full notice paid as PILON</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="py-3 px-4 text-ink font-medium">
                        <Link href="/guides/discrimination-settlement-agreements/" className="hover:text-coral underline">
                          Discrimination or Whistleblowing
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted">6+ months (or Vento bands)</td>
                      <td className="py-3 px-4 text-muted">Full notice plus injury to feelings</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Why Employers Pay Ex-Gratia</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Avoiding employment tribunal defence costs and management hours.</li>
                    <li>Achieving certainty and a clean exit without a drawn-out process.</li>
                    <li>Securing confidentiality and post-termination non-compete terms.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">What Affects the Figure</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Whether you have 2+ years&apos; service for unfair dismissal rights.</li>
                    <li>Notice length, bonus terms, and any garden leave period.</li>
                    <li>Any discrimination or whistleblowing claims (uncapped at tribunal).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Statutory Limits for 2026/27 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. Which April 2026 statutory limits apply to your offer?</h2>
              <p className="guide-body">
                Checking your draft against current statutory rates gives you a clear calculated statutory baseline before speaking to a solicitor.
              </p>

              <ul className="space-y-4 mt-4">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <strong className="text-ink font-semibold">Weekly Statutory Pay Cap (£751):</strong>
                    <p className="guide-body mt-0.5">
                      Under Section 227 ERA 1996 and{' '}
                      <a
                        href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-coral"
                      >
                        SI 2026/310
                      </a>
                      , the weekly cap is £751 from 6 April 2026 (£783 in Northern Ireland). See past limits in our{' '}
                      <Link href="/statutory-rates-history/" className="underline hover:text-coral">
                        statutory rates history archive
                      </Link>
                      .
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <strong className="text-ink font-semibold">The £30,000 Tax Exemption:</strong>
                    <p className="guide-body mt-0.5">
                      Under{' '}
                      <a
                        href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-coral"
                      >
                        Section 403 of ITEPA 2003
                      </a>
                      , genuine termination payments are tax-free up to £30,000. Amounts above £30,000 are taxed at your marginal rate.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <strong className="text-ink font-semibold">Unfair Dismissal Compensatory Cap (£123,543):</strong>
                    <p className="guide-body mt-0.5">
                      The statutory compensatory award cap for ordinary unfair dismissal is £123,543 or 52 weeks of gross pay, whichever is lower. Read more on{' '}
                      <Link href="/guides/unfair-dismissal-settlement-agreements/" className="underline hover:text-coral">
                        unfair dismissal settlements
                      </Link>
                      .
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Section 4: Legal Advice, Privilege & Deadlines */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. Who pays for legal advice and how long do you have?</h2>
              <p className="guide-body">
                Under{' '}
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-coral"
                >
                  Section 203(3) of the Employment Rights Act 1996
                </a>
                , a settlement agreement is only legally binding once an independent, insured solicitor advises you on its terms.
              </p>
              <p className="guide-body">
                Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion. That usually covers reviewing the draft, while excess or abortive work is subject to your solicitor engagement terms. You can choose your own adviser rather than an{' '}
                <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-coral">
                  employer-recommended solicitor
                </Link>
                , and your discussions remain covered by legal privilege.
              </p>
              <p className="guide-body">
                ACAS Code of Practice 4 recommends 10 calendar days to consider an initial written offer, though this is guidance rather than a strict legal right. Also note that under Section 111A ERA 1996, pre-termination talks are only off the record for ordinary unfair dismissal, and a counter-offer rejects the original offer so an employer can legally withdraw it. Read more if you feel{' '}
                <Link href="/guides/pressured-to-sign/" className="underline hover:text-coral">
                  pressured to sign quickly
                </Link>
                .
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and illustrative settlement range before speaking to a solicitor.
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
            <div className="space-y-4 pt-6">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/settlement-agreement-how-much/" />
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related Guides & Tools"
              items={[
                {
                  href: '/guides/average-settlement-agreement-payout-uk/',
                  title: 'Average Settlement Agreement Payout UK (2026)',
                  description: 'Illustrative UK payout ranges and statutory caps explained.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Understand without prejudice rules, counter-offers, and legal fee caps.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Key checks to review how your employer’s offer compares to your entitlements.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/compromise-agreement-calculator-uk/',
                  title: 'Compromise Agreement Calculator UK',
                  description: 'Calculate your statutory redundancy and tax-free payout under April 2026 rates.',
                  tag: 'Calculator Guide',
                },
                {
                  href: '/guides/settlement-agreement-acas-calculations/',
                  title: 'ACAS-Based Settlement Calculations',
                  description: 'How statutory rates and ACAS principles guide settlement figures.',
                  tag: 'Guide',
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
