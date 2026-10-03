import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  title: 'Is My Settlement Offer Fair? UK Settlement Check Guide 2026',
  description:
    'Find out if your settlement offer is fair. Compare your offer against statutory minimums, typical UK ranges, and the red flags that signal an offer is too low.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
  },
  openGraph: {
    title: 'Is My Settlement Offer Fair? UK Settlement Check Guide 2026',
    description:
      'Find out if your settlement offer is fair. Compare your offer against statutory minimums, typical UK ranges, and the red flags that signal an offer is too low.',
    url: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'What is the average settlement agreement payout in the UK?',
    a: 'The average depends entirely on statutory entitlement and claim strength. A typical straightforward redundancy settles at 1.5x to 2.5x the statutory minimum. For someone with £8,000 in statutory entitlement, that is £12,000 to £20,000. If there is a discrimination or whistleblowing element, the range rises to 3x to 5x statutory. There is no single UK average because each case starts from a different statutory floor.',
  },
  {
    q: 'Should I accept the first offer?',
    a: 'No. The first offer is almost always below the employer\'s true maximum. If you have any claim strength at all (age, length of service, or disputed circumstances), counter with a higher figure. The employer expects negotiation. A fair counter is to ask the employer to explain the multiplier they have applied to your statutory entitlement. If they cannot justify it, you have room to push.',
  },
  {
    q: 'What happens if I reject a settlement offer?',
    a: 'If you reject a settlement offer, the employer can withdraw it and the negotiation ends. However, you can still pursue a tribunal claim for unfair dismissal, discrimination, or breach of contract. The tribunal route is slower (typically 6 to 9 months), uncertain, and costly in time. A settlement avoids all three, which is why employers prefer a certain, swift, private resolution over tribunal risk. That risk is your leverage.',
  },
  {
    q: 'How long do I have to decide?',
    a: 'UK employment law practice requires a minimum of 10 days to consider a settlement agreement once you have received the draft. If your employer is pushing for less, the agreement may not be legally binding. Use the full time available. A specialist solicitor can review the offer and advise on negotiation typically within 3 to 5 days.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
              <span className="text-xs text-ink truncate">Is My Offer Fair?</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Settlement Agreement Guide</p>
            <h1 className="sc-h1 mb-5">
              Most settlement offers fall between 1.5x and 4x the statutory minimum. Here is how to spot if yours is genuinely fair.
            </h1>
            <p className="sc-lead">
              When you receive a settlement offer, your employer is paying to end your employment cleanly. The legal floor in 2026 is statutory redundancy and notice pay, calculated against a weekly pay cap of £751 (SI 2026/310). A fair offer goes beyond that floor and reflects the strength of your position. Use the free <Link href="/calculator/" className="text-ink font-semibold underline underline-offset-2 hover:text-coral transition-colors">settlement calculator</Link> below to compare your offer against the statutory baseline instantly.
            </p>
          </div>
        </section>

        {/* What makes it fair */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What makes a settlement offer fair</h2>
            <p className="sc-body mb-6">
              A fair settlement reflects three things: what the law guarantees you, what your specific claim is worth, and what you can realistically negotiate. Most people underestimate both the statutory floor and their claim&apos;s ceiling. Fairness is measured in pounds, not assurances. Review our in-depth guides on <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">what is a fair settlement agreement</Link> and <Link href="/guides/settlement-agreement-acas-calculations/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">how Acas calculates settlement guidelines</Link>.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Your statutory entitlements (redundancy, notice, and holiday pay) form the baseline any offer must meet.',
                'The strength of any discrimination, whistleblowing, or wrongful dismissal claim you hold directly increases the multiplier.',
                'Market comparison: what similar cases in your industry and region typically settle for.',
                'Your bargaining position: how much the employer fears tribunal proceedings relative to the cost of settling higher.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Statutory minimum vs fair offer</h2>
            <p className="sc-body mb-6">
              Here is how statutory redundancy entitlement compares to what employees typically negotiate with specialist legal representation:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-rule text-left">
                    <th className="py-3 pr-4 font-semibold text-ink">Length of service</th>
                    <th className="py-3 px-4 font-semibold text-ink">Statutory redundancy</th>
                    <th className="py-3 pl-4 font-semibold text-ink">Typical fair offer</th>
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
                      <td className="py-3 pl-4 font-semibold text-emerald-800">{fair}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted mt-3">
              *Statutory redundancy capped at £22,530 based on 20 years maximum and £751 weekly pay cap (April 2026). See our full analysis on the <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">2026 redundancy pay cap</Link> and calculate your statutory figure with the <Link href="/redundancy-calculator/" className="underline hover:text-ink font-medium">redundancy calculator</Link>.
            </p>
          </div>
        </section>

        {/* Red flags */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Five red flags that mean your offer is too low</h2>
            <p className="sc-body mb-6">
              Employers often frame low offers as generous. Watch for these five patterns before you agree to sign:
            </p>
            <ul className="flex flex-col gap-4">
              {[
                {
                  title: 'The offer is statutory redundancy plus two weeks',
                  detail: 'If you have any potential claim, the employer is attempting to settle cheaply. Two weeks\' pay above statutory is the bare minimum employers offer when they know an employee might not push back.',
                },
                {
                  title: 'No contribution to legal fees',
                  detail: 'Standard practice in the UK is for the employer to contribute £500 to £1,500+ VAT towards your independent legal advice. If this is missing or very low, it signals the employer does not understand the standard practice or is trying to minimise cost at your expense.',
                },
                {
                  title: 'Pressure to sign within 48 to 72 hours',
                  detail: 'Employment law guidance recommends a minimum of 10 days. Rushing an employee to sign is a known tactic to prevent you taking proper legal advice. Learn what to do if you are being pressured to sign.',
                },
                {
                  title: 'Notice pay is not separately accounted for',
                  detail: 'Your settlement sum should be on top of your statutory or contractual notice pay. If the employer wraps notice into the settlement figure, you are being shortchanged.',
                },
                {
                  title: 'Post-termination restrictions with no consideration',
                  detail: 'If the agreement asks you to reaffirm restrictive covenants (non-compete, non-solicitation) without paying a separate fee for that restriction, the value is flowing entirely to the employer.',
                },
              ].map(({ title, detail }, i) => (
                <li key={title} className="flex items-start gap-3">
                  <WarningIcon />
                  <div>
                    <p className="font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">
                      {detail}
                      {i === 2 && (
                        <> See our guide on being <Link href="/guides/pressured-to-sign/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">pressured to sign a settlement agreement</Link>.</>
                      )}
                      {i === 1 && (
                        <> Check our advice regarding <Link href="/guides/employer-recommended-solicitor/" className="text-ink font-medium underline underline-offset-2 hover:text-coral transition-colors">employer-recommended solicitors and independent legal advice</Link>.</>
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
            <h2 className="sc-section-h2 mb-6">What affects how much you can negotiate</h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Age and length of service',
                  body: 'Statutory redundancy scales with both. The formula applies 0.5 weeks per year under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over, capped at 20 years (ERA 1996). An older employee with 15 years\' service has a higher statutory baseline and more leverage in negotiation.',
                },
                {
                  title: 'Claim strength',
                  body: 'Written evidence of discrimination, breach of contract, or unpaid wages increases your claim\'s value. If the reason for your termination is unclear or disputed, your position is stronger. A credible legal claim raises the employer\'s tribunal risk and directly increases what they will pay to settle.',
                },
                {
                  title: 'Employer risk appetite',
                  body: 'Large employers with in-house legal teams often open lower, expecting negotiation. Smaller employers with limited legal budgets sometimes open higher to avoid the cost of a prolonged dispute. Knowing the employer\'s size and sector helps you judge how hard to push.',
                },
                {
                  title: 'Your financial position',
                  body: 'If you have another job lined up or financial runway, you have stronger leverage. If you need the payment quickly, the employer may sense it. Your walk-away point (the minimum you will accept) shapes every counter-offer you make.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-paper rounded border border-rule">
              <p className="sc-body text-sm">
                Ready to take the next step? Read our step-by-step tutorial on <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-ink font-semibold underline underline-offset-2 hover:text-coral transition-colors">how to negotiate a settlement agreement</Link> or understand <Link href="/guides/what-happens-if-you-do-not-sign/" className="text-ink font-semibold underline underline-offset-2 hover:text-coral transition-colors">what happens if you do not sign</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Compare your offer against the statutory baseline</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              The free calculator applies April 2026 statutory rates and shows you where your offer sits against typical UK settlement ranges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculator/"
                className="btn-accent"
              >
                Check my settlement offer
              </Link>
              <Link
                href="/redundancy-calculator/"
                className="btn-outline text-white border-white/30 hover:bg-white/10"
              >
                Redundancy calculator
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
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
                  description: 'Understand the formula employers use to value exits and how to tell if you are being shortchanged.',
                  tag: 'Fairness',
                },
                {
                  href: '/guides/settlement-agreement-acas-calculations/',
                  title: 'Settlement Agreement Acas Calculations Explained',
                  description: 'How Acas calculates statutory figures and what employment tribunals award for compensation.',
                  tag: 'Calculations',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Proven counter-offer strategies and script templates from senior employment lawyers.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'What to do if your employer gives you an unreasonable deadline or threatens dismissal.',
                  tag: 'Rights',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities & Official References</h3>
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
                  Employment Rights Act 1996, Section 162 (Redundancy formula & calculation mechanics)
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
