import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Constructive Dismissal Settlements 2026 | SettlementCheck',
  description:
    'Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.',
  alternates: {
    canonical: '/guides/constructive-dismissal-settlement-agreements/',
  },
  openGraph: {
    title: 'Constructive Dismissal Settlements 2026 | SettlementCheck',
    description:
      'Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.',
    url: '/guides/constructive-dismissal-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constructive Dismissal Settlements 2026 | SettlementCheck',
    description:
      'Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.',
  },
}

const FAQS = [
  {
    q: 'Can I get a settlement if I have less than two years of service?',
    a: 'Yes, if your resignation was caused by discrimination, whistleblowing, or another automatically unfair reason. In these cases, there is no service requirement. For standard contract breaches, you need two years of continuous service.',
  },
  {
    q: 'How is the compensatory cap applied if I earn over £123,543?',
    a: 'The cap is the lower of £123,543 or 52 weeks of your gross pay. If your gross annual salary is £150,000, your compensatory award is capped at £123,543. If your salary is £50,000, your compensatory award is capped at £50,000.',
  },
  {
    q: 'Does my employer have to pay for my solicitor?',
    a: 'Yes. To make the agreement legally binding, you must receive independent legal advice. Your employer covers the fees for this advice as part of the agreement.',
  },
  {
    q: 'What happens if I reject the settlement offer?',
    a: 'If you reject the offer, your employment contract remains in effect, or your resignation stands. You can then raise a grievance or start early conciliation through ACAS to prepare for an employment tribunal case.',
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
  headline: 'Constructive Dismissal Settlement Agreements UK (2026 Rules)',
  url: 'https://settlementcheck.co.uk/guides/constructive-dismissal-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-06-25',
  dateModified: '2026-07-11',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck',
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
    '@id': 'https://settlementcheck.co.uk/guides/constructive-dismissal-settlement-agreements/',
  },
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

export default function ConstructiveDismissalGuide() {
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
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Constructive Dismissal</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Employment Law Guide</p>
            <h1 className="sc-h1 mb-5">
              Constructive Dismissal Settlement Agreements in the UK: Rules and Compensation Limits for 2026
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Figures in force from 6 April 2026 (SI 2026/310)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: July 2026</span>
            </div>
            <p className="sc-lead">
              If you resign because of your employer's conduct, you may have a constructive dismissal case. Rather than going through a private employment tribunal, many employees resolve these disputes through a settlement agreement. This guide explains how constructive dismissal settlement agreements work in the UK. It covers the legal requirements, the 2026 statutory compensation caps, and how the tax rules apply to your payment.
            </p>
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key constructive dismissal rules</p>
              <ul className="flex flex-col gap-3">
                {[
                  'You need two years of continuous service to pursue a standard constructive dismissal case.',
                  'Under the April 2026 rules, standard compensation is capped at the lower of £123,543 or 52 weeks\' gross pay.',
                  'Whistleblowing and discrimination cases have no service requirements and offer uncapped compensation.',
                  'The ex-gratia compensation element of your settlement is tax-free up to £30,000.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What is constructive dismissal? */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What is constructive dismissal?</h2>
            <p className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule">
              Constructive dismissal occurs when you resign from your job because your employer has committed a fundamental breach of your employment contract. To claim constructive dismissal, the employer&apos;s conduct must be serious enough to force you to leave, and you must resign promptly without accepting or waiving the breach.
            </p>
            <p className="sc-body mb-6">
              Common examples of a fundamental breach include:
            </p>
            <ul className="flex flex-col gap-3 mb-6">
              {[
                'A sudden reduction in your salary without your consent.',
                'Demoting you or stripping you of your core responsibilities without justification.',
                'Failing to address bullying, harassment, or a hostile work environment.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              You must resign in response to the breach. You must also resign without delay.
            </p>
            <p className="sc-body">
              If you stay in your job too long, the law treats you as accepting the breach.
            </p>
          </div>
        </section>

        {/* The two-year qualifying service rule */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The two-year qualifying service rule</h2>
            <p className="sc-body mb-4">
              To raise a constructive dismissal case or negotiate a settlement, you must meet the service requirement. Under Section 108(1) of the Employment Rights Act 1996, you need two years of continuous service <sup>1</sup>.
            </p>
            <p className="sc-body mb-4">
              If you have under two years of service, you generally cannot negotiate a settlement.
            </p>
            <p className="sc-body mb-4">
              However, there are exceptions. The two-year service requirement does not apply to automatically unfair dismissal.
            </p>
            <p className="sc-body mb-6">
              Automatically unfair constructive dismissal includes situations where you resigned because of:
            </p>
            <ul className="flex flex-col gap-3 mb-6">
              {[
                'Discrimination based on protected characteristics like age, race, sex, or disability.',
                'Whistleblowing, which is reporting illegal activities or safety breaches.',
                'Raising health and safety concerns.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              If you resign due to discrimination or whistleblowing, you have protection from day one.
            </p>
            <p className="sc-body">
              You can negotiate a settlement regardless of your length of service.
            </p>
          </div>
        </section>

        {/* Statutory compensation caps for 2026 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Statutory compensation caps for 2026</h2>
            <p className="sc-body mb-6">
              Compensation for constructive dismissal consists of a basic award and a compensatory award. Both awards are subject to statutory limits updated in April 2026.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">The Basic Award</h3>
            <p className="sc-body mb-4">
              The basic award is a statutory calculation based on your age, length of service, and weekly pay. For calculations after 6 April 2026, the statutory weekly pay cap is £751 (SI 2026/310) <sup>2</sup>.
            </p>
            <p className="sc-body mb-4">
              The basic award calculation is:
            </p>
            <ul className="list-disc pl-5 sc-body mb-4 space-y-1">
              <li>1.5 weeks of pay for each year of service completed over the age of 41.</li>
              <li>1 week of pay for each year of service completed between the ages of 22 and 40.</li>
              <li>0.5 weeks of pay for each year of service completed under the age of 21.</li>
            </ul>
            <p className="sc-body mb-6">
              The maximum service counted is 20 years. This means the maximum basic award in 2026 is £22,530 <sup>2</sup>.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">The Compensatory Award</h3>
            <p className="sc-body mb-4">
              The compensatory award is designed to cover your actual financial losses, such as lost salary and pension contributions.
            </p>
            <p className="sc-body mb-6">
              Under Section 124 of the Employment Rights Act 1996 and SI 2026/310, the compensatory award is capped at the lower of <sup>2</sup>:
            </p>
            <ul className="list-disc pl-5 sc-body mb-6 space-y-1">
              <li>£123,543.</li>
              <li>52 weeks of your gross pay.</li>
            </ul>
            <p className="sc-body mb-6">
              These statutory caps do not apply if your resignation relates to discrimination or whistleblowing. In those cases, the compensation you can receive is uncapped.
            </p>

            <div className="rounded-xl border border-rule overflow-hidden mt-8">
              <table className="w-full text-sm">
                <caption className="sr-only">Constructive dismissal compensation limits and statutory awards for 2026/27, sourced from the Employment Rights Act 1996 and SI 2026/310.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Award Type</th>
                    <th className="text-left px-4 py-3 font-medium">Limit for 2026/27</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Weekly Pay Cap', '£751', 'SI 2026/310'],
                    ['Maximum Basic Award', '£22,530', 'ERA 1996 s.227'],
                    ['Compensatory Award Cap', '£123,543 (or 52 weeks\' gross pay)', 'ERA 1996 s.124 / SI 2026/310'],
                    ['Discrimination / Whistleblowing', 'Uncapped', 'ERA 1996 s.124(1A)'],
                  ].map(([type, limit, authority], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{type}</td>
                      <td className="px-4 py-3 text-ink">{limit}</td>
                      <td className="px-4 py-3 text-ink font-serif text-xs">{authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tax rules for constructive dismissal settlements */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax rules for constructive dismissal settlements</h2>
            <p className="sc-body mb-6">
              Understanding the tax treatment of your settlement agreement ensures you know the exact amount you will receive.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">The £30,000 Tax-Free Exemption</h3>
            <p className="sc-body mb-4">
              Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first £30,000 is tax-free <sup>3</sup>. This exemption applies to genuine compensation for the loss of your employment, such as ex-gratia payments.
            </p>
            <p className="sc-body mb-4">
              If your compensation is under £30,000, you will pay no income tax on it. If it is over £30,000, you pay income tax only on the amount that exceeds the threshold. You pay no employee National Insurance contributions on this compensation, even if it is over £30,000. You can read more in our guide to <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">tax-free settlements</Link>.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">Pay in Lieu of Notice (PILON)</h3>
            <p className="sc-body mb-4">
              Pay in lieu of notice is fully taxable <sup>4</sup>. Under Section 402D of the Income Tax (Earnings and Pensions) Act 2003, notice pay is treated as earnings.
            </p>
            <p className="sc-body mb-4">
              Your employer must deduct income tax and National Insurance contributions from your notice pay. This is true even if the total settlement is under £30,000. You can read more about this in our <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax guide</Link>.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">Legal Fees Contribution</h3>
            <p className="sc-body mb-4">
              Your employer covers your legal fees for receiving advice on the agreement. This payment is made directly to your solicitor and is completely tax-free. It does not count towards your £30,000 tax-free exemption.
            </p>
          </div>
        </section>

        {/* Worked examples of settlement calculations */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked examples of settlement calculations</h2>
            <p className="sc-body mb-6">
              These examples show how these statutory rules apply to different scenarios.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Standard constructive dismissal (3 years\' service)',
                  points: [
                    'An employee resigns because their salary was cut. They have three years of continuous service. Their weekly gross pay is £800.',
                    'The basic award is calculated using the weekly cap of £751. Since they are 35, they receive 1 week\'s pay per year of service: 3 years x £751 = £2,253.',
                    'The compensatory award for lost earnings is negotiated at £20,000.',
                    'The total settlement is £22,253.',
                    'Because the entire sum is ex-gratia and under £30,000, the employee pays no tax on this settlement.',
                  ],
                },
                {
                  title: 'Example 2: Whistleblowing resignation (6 months\' service)',
                  points: [
                    'An employee resigns after reporting financial malpractice. They have six months of service. Because they resigned due to whistleblowing, the two-year service rule does not apply. Their annual salary is £50,000.',
                    'They negotiate a settlement of £55,000 to resolve the dispute.',
                    'The first £30,000 is tax-free.',
                    'The remaining £25,000 is subject to income tax.',
                    'No employee National Insurance is deducted from the £55,000.',
                  ],
                },
              ].map(({ title, points }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-sm font-medium">{title}</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    {points.map((point, index) => (
                      <p key={index} className="sc-body text-sm">{point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Receiving independent legal advice */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Receiving independent legal advice</h2>
            <p className="sc-body mb-4">
              You must receive independent legal advice to make a settlement agreement legally binding. This is a statutory requirement under Section 203 of the Employment Rights Act 1996 <sup>5</sup>. Before signing, you should check our advice on how to <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="underline hover:text-ink">negotiate a settlement agreement</Link>.
            </p>
            <p className="sc-body mb-4">
              The advice must come from a qualified solicitor or a certified adviser. They must be independent of your employer. They explain the terms of the agreement and their effect on your ability to bring future tribunal cases.
            </p>
            <p className="sc-body mb-4">
              Your employer covers the cost of this legal advice. The standard contribution is £350 to £750.
            </p>
            <p className="sc-body mb-6">
              Your solicitor will invoice your employer directly. You should not have to pay anything out of your own pocket.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                Your solicitor will verify that the agreement covers your needs and is structured correctly. They will check the tax indemnity terms to protect you from unexpected tax bills.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Check your settlement offer now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Verify your statutory redundancy entitlement and calculate how much of your settlement is tax-free.
            </p>
            <Link href="/constructive-dismissal-calculator" className="btn-accent">
              Check my offer now →
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/108" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 108(1) (qualifying period)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (tax-free limit)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (PILON tax)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 (requirements for validity)
                </a>
              </li>
            </ol>
          </div>
        </section>
        {/* Disclaimer */}
        <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent introduction service and calculator, not a law firm. The information on this page is for general guidance only and does not constitute formal legal counsel. Confirm your specific offer using our free calculator.
        </p>
      </main>
      <Footer />
    </>
  )
}
