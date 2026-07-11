import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Average Settlement Agreement Payout UK 2026 | SettlementCheck',
  description:
    'Free UK settlement agreement payout guide. Typical ranges (£5,000-£25,000) and 2026 redundancy pay caps (£751/wk). No email. See if your offer is fair.',
  alternates: {
    canonical: '/guides/average-settlement-agreement-payout-uk/',
  },
  openGraph: {
    title: 'Average Settlement Agreement Payout UK 2026 | SettlementCheck',
    description:
      'Free UK settlement agreement payout guide. Typical ranges (£5,000-£25,000) and 2026 redundancy pay caps (£751/wk). No email. See if your offer is fair.',
    url: '/guides/average-settlement-agreement-payout-uk/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Average Settlement Agreement Payout UK 2026 | SettlementCheck',
    description:
      'Free UK settlement agreement payout guide. Typical ranges (£5,000-£25,000) and 2026 redundancy pay caps (£751/wk). No email. See if your offer is fair.',
  },
}

const FAQS = [
  {
    q: 'What is the average settlement agreement payout in the UK?',
    a: 'Typical settlements in the UK range between £5,000 and £25,000. This represents 1.5x to 4x of your statutory minimum entitlement. The exact amount depends on your salary, length of service, notice period, and any live legal claims.',
  },
  {
    q: 'Do I have to pay tax on my settlement agreement?',
    a: 'Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first £30,000 of compensation for loss of employment is tax-free. Notice pay (PILON) is always fully taxable as earnings under Section 402D.',
  },
  {
    q: 'Who pays my solicitor\'s legal fees for a settlement agreement?',
    a: 'Your employer covers the fees for your solicitor to advise you on the agreement terms. This contribution usually ranges from £350 to £750, and your employer pays your solicitor directly under HMRC rules.',
  },
  {
    q: 'Can I negotiate for a higher settlement payout?',
    a: 'Yes. The initial settlement offer is rarely the employer\'s final offer. You can negotiate a higher payout if you have evidence of unfair procedures, discrimination, or if the statutory minimum entitlement provides a solid floor to build from.',
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
  headline: 'Average Settlement Agreement Payout UK 2026: What is a Normal Offer?',
  url: 'https://settlementcheck.co.uk/guides/average-settlement-agreement-payout-uk/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-26',
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
    '@id': 'https://settlementcheck.co.uk/guides/average-settlement-agreement-payout-uk/',
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

export default function AveragePayoutGuide() {
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
              <span className="text-xs text-ink truncate">Average Payout</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Settlement Agreements</p>
            <h1 className="sc-h1 mb-5">
              The average settlement agreement payout in the UK is £5,000 to £25,000. Here is how to check if your offer is fair in 2026.
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Figures in force from 6 April 2026 (SI 2026/310)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: July 2026</span>
            </div>
            <p className="sc-lead">
              In 2026, the average UK settlement agreement payout typically falls between £5,000 and £25,000. Under UK employment regulations, your statutory redundancy pay is calculated against a weekly pay cap of £751 in Great Britain <sup>1</sup> (£783 in Northern Ireland <sup>2</sup>). Most fair settlement offers represent 1.5x to 4x of your statutory minimum entitlement. If your employer offers only the statutory minimum, they are paying nothing extra to buy out your right to make a tribunal claim.
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key payout facts</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Typical settlement amounts range from 1.5x to 4x of your statutory minimum entitlement.',
                  'Your employer covers your solicitor fees to review and sign the agreement, which keeps it free for you.',
                  'Under s.403 of ITEPA 2003, the first £30,000 of redundancy or ex-gratia compensation is completely tax-free.',
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

        {/* Typical Payout Ranges by Scenario */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Typical Settlement Payouts by Scenario</h2>
            <p className="sc-body mb-6">
              Settlement payouts depend heavily on the reason for your departure and the strength of any potential legal claims. For unfair dismissal scenarios, the legal maximum compensation is capped at £123,543 <sup>5</sup> or one year&apos;s gross salary. The table below outlines typical ranges observed in 2026.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Average settlement agreement payouts by scenario UK 2026</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Departure Scenario</th>
                    <th className="text-left px-4 py-3 font-medium">Typical Range</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory Multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Straightforward Redundancy',
                      '£5,000 to £15,000',
                      '1.5x to 2.5x statutory minimum',
                    ],
                    [
                      'Procedural Unfair Dismissal',
                      '£8,000 to £25,000',
                      '2.0x to 3.5x statutory minimum',
                    ],
                    [
                      'Whistleblowing or Discrimination',
                      '£20,000 to £75,000+',
                      '4.0x statutory minimum or higher',
                    ],
                  ].map(([scenario, range, multiplier], i) => (
                    <tr key={scenario} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{scenario}</td>
                      <td className="px-4 py-3 text-ink">{range}</td>
                      <td className="px-4 py-3 text-ink">{multiplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Components of a Settlement Payout */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Key Components of Your Settlement Payout</h2>
            <p className="sc-body mb-6">
              Your final settlement figure is rarely a single lump sum. It is normally structured as a combination of different components, each with unique legal and tax properties.
            </p>
            <div className="space-y-6">
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">1. Ex-Gratia Payment (Tax-Free Uplift)</strong>
                <span className="text-muted text-[15px]">
                  This is the core negotiating component. It is a discretionary payment from your employer to compensate for the loss of your job. Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first £30,000 of redundancy or ex-gratia compensation is <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">paid tax-free up to £30,000</Link> <sup>3</sup>.
                </span>
              </div>
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">2. Pay in Lieu of Notice (PILON)</strong>
                <span className="text-muted text-[15px]">
                  Notice pay is subject to tax. Whether you work your notice period or receive it as a lump sum, it remains fully taxable as earnings under Section 402D of the Income Tax (Earnings and Pensions) Act 2003 <sup>4</sup> (see our <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax guide</Link>).
                </span>
              </div>
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">3. Statutory Redundancy Pay</strong>
                <span className="text-muted text-[15px]">
                  If your role is redundant, you are entitled to statutory redundancy pay under Section 119 of the Employment Rights Act 1996 <sup>7</sup>. The formula applies 0.5 weeks of pay per year under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over, capped at 20 years. The weekly pay is capped at <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">£751 in Great Britain</Link> <sup>1</sup> (£783 in Northern Ireland <sup>2</sup>), making the maximum statutory redundancy award £22,530.
                </span>
              </div>
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">4. Solicitor Legal Fees Contribution</strong>
                <span className="text-muted text-[15px]">
                  A settlement agreement is only legally binding if an independent, qualified adviser reviews it with you. Your employer pays your fees for this review. This contribution is paid directly to your solicitor and is tax-free under HMRC Extra-Statutory Concession A81 <sup>6</sup>.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* How to Value Your Offer */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How to Calculate if Your Offer matches the Average</h2>
            <p className="sc-body mb-6">
              To evaluate whether your settlement offer matches typical UK averages, you should follow this structured process:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Identify your statutory baseline',
                  body: 'Calculate your statutory redundancy and notice entitlements. This forms the absolute floor. Any signed agreement must pay at least this baseline.',
                },
                {
                  n: 2,
                  title: 'Determine the appropriate multiplier',
                  body: 'Assess your leverage. If your employer followed a poor procedure, apply a multiplier of 1.5x to 2.5x to your baseline. If you have evidence of discrimination, a higher multiplier applies.',
                },
                {
                  n: 3,
                  title: 'Verify the tax structure',
                  body: 'Ensure the ex-gratia component and PILON are separated correctly. Separating them protects you from unexpected tax bills under the tax indemnity clause.',
                },
                {
                  n: 4,
                  title: 'Calculate your estimated net settlement',
                  body: 'Use our independent calculator to check your figures and compare your package against typical ranges.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Check your settlement offer now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Enter your details to calculate your statutory baseline and check if your settlement offer is fair.
            </p>
            <Link href="/calculator" className="btn-accent">
              Check my offer
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
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 227 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim13740" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  HMRC Extra-Statutory Concession A81 (ESC A81)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/119" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 119
                </a>
              </li>
            </ol>
          </div>
        </section>
        {/* Disclaimer */}
        <section className="py-6 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <p className="sc-body text-xs text-muted leading-relaxed">
              Disclaimer: SettlementCheck is an independent introduction service and calculator, not a law firm. The information on this page is for general guidance only and does not constitute formal legal or tax advice. Confirm your specific offer using our free calculator.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
