import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  title: 'Employment Settlement Agreement: How Much Should You Get? UK 2026',
  description:
    'Find out how much a UK employment settlement agreement should be in 2026. Typical 1 to 3 months payout ranges, notice pay rules, £751 weekly cap, and tax calculations.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
  },
  openGraph: {
    title: 'Employment Settlement Agreement: How Much Should You Get? UK 2026',
    description:
      'Find out how much a UK employment settlement agreement should be in 2026. Typical 1 to 3 months payout ranges, notice pay rules, £751 weekly cap, and tax calculations.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'How much should an employee settlement agreement be?',
    a: 'A typical UK settlement agreement pays between one and three months of gross salary, plus notice pay and accrued holiday. Your total package should also include statutory redundancy pay, capped at £751 per week, with the first £30,000 paid tax-free.',
  },
  {
    q: 'What is the difference between statutory pay and an ex-gratia payment?',
    a: 'Statutory pay covers your legally protected redundancy entitlement, capped at £751 per week. An ex-gratia payment is additional compensation offered by your employer to settle all workplace claims. The first £30,000 of combined termination pay is free from tax.',
  },
  {
    q: 'How is notice pay taxed in a settlement agreement?',
    a: 'Payment in lieu of notice (PILON) is always taxed as ordinary earnings under Section 402D of ITEPA 2003. You pay income tax and National Insurance on your notice pay. It cannot be included inside the £30,000 tax-free exemption.',
  },
  {
    q: 'Can I negotiate a higher settlement amount?',
    a: 'Yes. Most opening settlement offers have room to move. Employers often increase their initial offer when you show objective statutory entitlements or point out procedural defects. A specialist solicitor can conduct these negotiations for you.',
  },
  {
    q: 'Who pays the solicitor legal fees for reviewing my agreement?',
    a: 'Your employer covers the legal fees for an independent solicitor to review your settlement agreement. This legal contribution usually ranges between £350 and £750 plus VAT. Your solicitor invoices your employer directly, so you pay nothing.',
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
  headline: 'Settlement Agreement: How Much Should You Get? UK 2026 Guide',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-how-much/',
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
      url: 'https://www.legislation.gov.uk/uksi/2026/index',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Nav />
      <main>
        {/* Hero Section */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-3xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Settlement Agreement Amount</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Employment Settlement Guide
            </p>
            <h1 className="sc-h1 mb-5">
              Employment Settlement Agreement: How Much Should You Get? (UK 2026 Guide)
            </h1>

            {/* Editorial attribution strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 tax year</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Statutory figures verified via legislation.gov.uk</span>
            </div>

            <p className="sc-lead">
              If your employer handed you an employment settlement agreement today, you are probably feeling shocked, suspicious, and uncertain. You need to know if the money on the table is fair before you sign. This guide explains what UK employers typically pay, how the numbers break down, and how tax applies in 2026.
            </p>
          </div>
        </section>

        {/* Answer-First Callout Box */}
        <section className="py-10 border-b border-rule bg-paper-2">
          <div className="max-w-3xl mx-auto px-5">
            <div
              itemScope
              itemType="https://schema.org/Question"
              className="p-6 rounded-xl border border-rule-strong bg-card shadow-sm"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-coral mb-2 block">
                Direct Answer
              </span>
              <h2 itemProp="name" className="text-[20px] font-semibold text-ink leading-snug mb-3">
                How much should an employee settlement agreement be?
              </h2>
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                <p itemProp="text" className="sc-body text-[16px] leading-relaxed text-ink font-medium">
                  A typical UK settlement agreement pays between one and three months of gross salary, plus notice pay and accrued holiday. Your total package should also include statutory redundancy pay, capped at £751 per week, with the first £30,000 paid tax-free.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-rule flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <span className="text-xs text-muted">Based on April 2026 statutory rates and UK market benchmarks.</span>
                <Link href="/calculator/" className="btn-accent text-sm py-2 px-4 no-underline">
                  Calculate my estimate →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: The Three Parts of Every Settlement */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="sc-h2 mb-4">The Three Separate Pots Inside Your Offer</h2>
            <p className="sc-body mb-6">
              HR often presents your settlement as one single lump sum. In reality, a legally valid agreement always divides your payout into three separate pots. Knowing which pot is which matters, because HM Revenue and Customs taxes each part differently.
            </p>

            <div className="space-y-5">
              <div className="p-5 rounded-lg border border-rule bg-card">
                <h3 className="font-semibold text-ink text-[17px] mb-2">1. Notice Pay (PILON)</h3>
                <p className="sc-body text-sm mb-2">
                  This is the salary you would have earned during your contractual notice period. Under Section 402D of ITEPA 2003 (PENP rules), notice pay is always treated as taxable earnings. It is subject to income tax and National Insurance deductions.
                </p>
                <p className="text-xs text-muted">
                  Statutory minimum notice is 1 week per year of service, up to 12 weeks. Read our complete guide to{' '}
                  <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-coral">
                    PILON tax rules in 2026
                  </Link>
                  .
                </p>
              </div>

              <div className="p-5 rounded-lg border border-rule bg-card">
                <h3 className="font-semibold text-ink text-[17px] mb-2">2. Statutory Redundancy Pay</h3>
                <p className="sc-body text-sm mb-2">
                  If your role is redundant and you have worked for two or more years, you have a legal right to statutory redundancy pay under the Employment Rights Act 1996. For 2026/27, weekly pay is capped at £751 by{' '}
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
                <p className="text-xs text-muted">
                  Statutory redundancy pay is completely tax-free under Section 403 of ITEPA 2003. Check the{' '}
                  <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-coral">
                    2026 statutory redundancy cap
                  </Link>{' '}
                  or estimate your entitlement with our{' '}
                  <Link href="/redundancy-calculator/" className="underline hover:text-coral">
                    redundancy pay calculator
                  </Link>
                  .
                </p>
              </div>

              <div className="p-5 rounded-lg border border-rule bg-card">
                <h3 className="font-semibold text-ink text-[17px] mb-2">3. Ex-Gratia Compensation Payment</h3>
                <p className="sc-body text-sm mb-2">
                  This is the discretionary compensation offered in exchange for signing away your right to take your employer to an employment tribunal. Typical packages range from one to three months of gross salary, although disputed dismissals can secure substantially more.
                </p>
                <p className="text-xs text-muted">
                  The first £30,000 of compensation is tax-free under Section 403 of ITEPA 2003. Learn how HMRC handles the{' '}
                  <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-coral">
                    tax-free £30,000 settlement exemption
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Typical Payout Benchmarks Table */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="sc-h2 mb-4">Typical Settlement Payout Benchmarks by Scenario</h2>
            <p className="sc-body mb-6">
              How much you receive depends heavily on the reason for your departure and your legal standing. Below are typical market benchmarks observed across UK employment settlements:
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm bg-card rounded-lg border border-rule overflow-hidden" style={{ minWidth: 500 }}>
                <thead>
                  <tr className="border-b border-rule bg-paper">
                    <th className="text-left py-3 px-4 font-semibold text-ink">Circumstance</th>
                    <th className="text-left py-3 px-4 font-semibold text-ink">Typical Additional Ex-Gratia</th>
                    <th className="text-left py-3 px-4 font-semibold text-ink">Notice & Redundancy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Standard Redundancy</td>
                    <td className="py-3 px-4 text-muted">1 to 2 months salary</td>
                    <td className="py-3 px-4 text-muted">Full notice + statutory redundancy</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">
                      <Link href="/guides/settlement-agreement-instead-of-pip/" className="hover:text-coral underline">
                        Performance / PIP Exit
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-muted">2 to 3 months salary</td>
                    <td className="py-3 px-4 text-muted">Full notice paid as PILON</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">
                      <Link href="/guides/protected-conversations-without-prejudice/" className="hover:text-coral underline">
                        Workplace Dispute / Grievance
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-muted">3 to 6 months salary</td>
                    <td className="py-3 px-4 text-muted">Full notice paid as PILON</td>
                  </tr>
                  <tr>
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

            <div className="mt-8 p-5 rounded-lg border border-rule bg-card">
              <h3 className="font-semibold text-ink text-[17px] mb-2">Why does an employer offer extra ex-gratia pay?</h3>
              <p className="sc-body text-sm mb-3">
                Employers offer ex-gratia money to buy certainty and finality. Defending an ordinary claim at an employment tribunal costs an employer between £8,500 and £15,000 in legal fees alone, regardless of the outcome.
              </p>
              <p className="sc-body text-sm">
                Tribunal proceedings also take 9 to 18 months and demand hours of management time. Offering one to three months of gross pay is often cheaper and faster for the company than a protracted workplace dispute.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Statutory Rules and Tax Caps */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="sc-h2 mb-4">Official Statutory Rates for 2026/27</h2>
            <p className="sc-body mb-6">
              When calculating whether an offer is fair, you must benchmark it against the latest statutory limits set by UK Parliament:
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckIcon />
                <div>
                  <strong className="text-ink font-semibold">Weekly Statutory Pay Cap (£751):</strong>
                  <p className="sc-body text-sm mt-0.5">
                    Under Section 227 of the Employment Rights Act 1996 and{' '}
                    <a
                      href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-coral"
                    >
                      SI 2026/310
                    </a>
                    , the statutory weekly cap increased to £751 on 6 April 2026.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <div>
                  <strong className="text-ink font-semibold">The £30,000 Tax Exemption:</strong>
                  <p className="sc-body text-sm mt-0.5">
                    Under{' '}
                    <a
                      href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-coral"
                    >
                      Section 403 of ITEPA 2003
                    </a>
                    , genuine termination payments are tax-free up to £30,000. Anything above this threshold is taxed at your marginal rate.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckIcon />
                <div>
                  <strong className="text-ink font-semibold">Unfair Dismissal Compensatory Award (£123,543):</strong>
                  <p className="sc-body text-sm mt-0.5">
                    The statutory compensatory award limit for ordinary unfair dismissal is £123,543 (or 52 weeks of gross pay, whichever is lower). Employers consider this financial risk when negotiating settlements. See our guide to{' '}
                    <Link href="/guides/unfair-dismissal-settlement-agreements/" className="underline hover:text-coral">
                      unfair dismissal settlements
                    </Link>{' '}
                    or check your potential award with our{' '}
                    <Link href="/unfair-dismissal-calculator/" className="underline hover:text-coral">
                      unfair dismissal calculator
                    </Link>
                    .
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Section 4: Legal Advice & Employer Fee Contribution */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-3xl mx-auto px-5">
            <h2 className="sc-h2 mb-4">Independent Legal Advice: Your Employer Covers the Fees</h2>
            <p className="sc-body mb-4">
              Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-coral"
              >
                Section 203 of the Employment Rights Act 1996
              </a>
              , a settlement agreement is not legally binding unless you receive advice from an independent, insured solicitor.
            </p>
            <p className="sc-body mb-4">
              Because this advice is mandatory, your employer covers the legal fees for this review. The typical employer contribution is between £350 and £750 plus VAT. This fee is paid directly to your solicitor, meaning specialist legal advice costs you nothing. You also have the right to choose your own adviser rather than an{' '}
              <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-coral">
                employer-recommended solicitor
              </Link>
              .
            </p>
            <p className="sc-body mb-6">
              Employers sometimes impose a tight deadline of 24 or 48 hours to create pressure. Under the official ACAS Code of Practice, you should receive a minimum of 10 calendar days to consider the terms and obtain independent advice. Learn your rights if you feel{' '}
              <Link href="/guides/pressured-to-sign/" className="underline hover:text-coral">
                pressured to sign quickly
              </Link>
              .
            </p>

            {/* Embedded CTA Banner */}
            <div className="p-8 rounded-2xl text-center" style={{ background: '#0B1F3A' }}>
              <h3 className="font-serif text-[24px] md:text-[28px] text-white font-normal mb-3">
                Find out how much your settlement offer is worth
              </h3>
              <p className="text-white/80 max-w-lg mx-auto mb-6 text-sm">
                Enter your salary, notice period, and service length. Get an instant, independent breakdown of your net take-home pay in 60 seconds.
              </p>
              <Link href="/calculator/" className="sc-btn-primary inline-block py-3 px-7 text-base font-semibold">
                Calculate my estimate →
              </Link>
              <p className="text-xs text-white/60 mt-3">Free and completely confidential. No email required to see results.</p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-14 border-b border-rule">
          <div className="max-w-3xl mx-auto px-5">
            <span className="sc-eyebrow mb-2 block">Common Questions</span>
            <h2 className="sc-h2 mb-6">Frequently Asked Questions About Settlement Amounts</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-12 bg-paper-2">
          <div className="max-w-3xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides & Tools"
              items={[
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Calculate your estimated settlement payout and tax split in 60 seconds.',
                  tag: 'Free Tool',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Seven tests to determine if your employer’s offer reflects your true legal entitlements.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Step-by-step negotiation strategies to increase financial compensation.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/settlement-agreement-acas-calculations/',
                  title: 'ACAS-Based Settlement Calculations',
                  description: 'How statutory rates and ACAS conciliation principles guide settlement values.',
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
