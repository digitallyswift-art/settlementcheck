import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Redundancy Pay Cap 2026: £751 Weekly Limit Explained | SettlementCheck',
  description:
    'The redundancy pay cap in 2026 is £751 per week in Great Britain (SI 2026/310). See how it affects your calculation, worked examples, and what to do if your employer gets it wrong.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
  },
  openGraph: {
    title: 'Redundancy Pay Cap 2026: £751 Weekly Limit Explained | SettlementCheck',
    description:
      'The redundancy pay cap in 2026 is £751 per week in Great Britain (SI 2026/310). See how it affects your calculation, worked examples, and what to do if your employer gets it wrong.',
    url: 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redundancy Pay Cap 2026: £751 Weekly Limit Explained | SettlementCheck',
    description:
      'The redundancy pay cap in 2026 is £751 per week in Great Britain (SI 2026/310). See how it affects your calculation, worked examples, and what to do if your employer gets it wrong.',
  },
}

const FAQS = [
  {
    q: 'Does the redundancy pay cap apply to everyone?',
    a: 'Yes, in Great Britain (England, Scotland, Wales), the £751 cap applies to all statutory redundancy calculations from 6 April 2026, regardless of your salary. Northern Ireland has a separate cap of £783 (SR 2026/57).',
  },
  {
    q: 'What is the maximum statutory redundancy pay in 2026?',
    a: 'The maximum is £22,530. This is reached with 20 qualifying years of service at the highest age multiplier (1.5 weeks per year, for ages 41 and above) and the full £751 weekly cap. Most employees will not reach this maximum.',
  },
  {
    q: 'Can I be paid more than the statutory cap?',
    a: 'Yes. The cap limits the statutory redundancy formula, not what your employer agrees to pay in a settlement agreement. Many employees negotiate ex-gratia payments significantly above the statutory amount.',
  },
  {
    q: 'Is statutory redundancy pay taxable?',
    a: 'Statutory redundancy pay is tax-free up to the £30,000 combined threshold under ITEPA 2003 s.403. If your total termination payment (redundancy plus other compensation, excluding PILON) exceeds £30,000, the excess is taxable.',
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
  headline: 'Redundancy Pay Cap 2026: How the £751 Weekly Limit Affects Your Statutory Entitlement',
  url: 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
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
    '@id': 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
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

export default function RedundancyPayCapGuide() {
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
              <span className="text-xs text-ink truncate">Redundancy Pay Cap 2026</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Statutory Redundancy Guide</p>
            <h1 className="sc-h1 mb-5">
              The redundancy weekly pay cap is £751 in 2026. Here is exactly how it limits your statutory entitlement and what to do if your employer gets it wrong.
            </h1>
            <p className="sc-lead">
              From 6 April 2026, statutory redundancy pay is calculated using a maximum weekly pay figure of £751 in Great Britain <sup>1</sup> (as set by SI 2026/310 <sup>1</sup> and ERA 1996 s.227 <sup>1</sup>). If your actual salary is higher, the formula uses £751 regardless. This guide explains how that cap works, shows worked examples with the numbers, and tells you how to check whether your employer has applied it correctly.
            </p>
          </div>
        </section>

        {/* Core facts callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key facts for 2026</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    The weekly pay cap is £751 (Great Britain) <sup>1</sup> and £783 (Northern Ireland) <sup>2</sup> from 6 April 2026.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    The maximum statutory redundancy pay is £22,530 <sup>3</sup>, reached only at 20 years service with the highest age multiplier.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    The cap limits the statutory formula only. It does not cap what your employer can offer in a settlement agreement.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* What the cap is */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What the redundancy pay cap is and why it exists</h2>
            <p className="sc-body mb-4">
              The redundancy pay cap is a statutory maximum. It limits the weekly pay figure used in the redundancy calculation, regardless of what you actually earn. If you earn £1,200 per week, the formula uses £751. If you earn £500 per week, the formula uses £500. The cap only bites when your pay exceeds it.
            </p>
            <p className="sc-body mb-4">
              The cap applies in England, Scotland, and Wales. Northern Ireland has its own separate cap, currently £783 per week <sup>2</sup>. The figures are set by the Employment Rights Act 1996 s.227 <sup>1</sup> and change every April by government order (Statutory Instrument). The 2026 cap is set by SI 2026/310 <sup>1</sup>, which came into force on 6 April 2026.
            </p>
            <p className="sc-body">
              The cap increases annually, typically in April, in line with average earnings growth. The 2026 increase of 4.4% (from £719 to £751) reflects wage growth since April 2025. Future changes are usually published in late March for the April implementation date.
            </p>
          </div>
        </section>

        {/* How the cap affects calculation */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How the redundancy pay cap affects your calculation</h2>
            <p className="sc-body mb-6">
              Statutory redundancy is calculated using a three-part formula. The cap applies to the weekly pay component. Your age and length of service determine the multiplier.
            </p>

            {/* Formula steps */}
            <div className="rounded-xl border border-rule bg-paper p-5 mb-8">
              <p className="text-sm font-semibold text-ink mb-4">The statutory redundancy formula</p>
              <ol className="flex flex-col gap-4">
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <span className="sc-body text-sm">Establish your weekly pay (annual salary divided by 52), capped at £751 from 6 April 2026 <sup>1</sup>.</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <span className="sc-body text-sm">Apply the age multiplier: 0.5 weeks per year (under 22), 1 week per year (22 to 40), 1.5 weeks per year (41 and over).</span>
                </li>
                <li className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <span className="sc-body text-sm">Multiply by your complete years of qualifying service, up to a maximum of 20 years <sup>3</sup>.</span>
                </li>
              </ol>
            </div>

            {/* Worked examples */}
            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Example 1: salary below the cap',
                  rows: [
                    ['Your details', 'Age 36, 8 years of service, earning £600 per week'],
                    ['Weekly pay used', '£600 (below the £751 cap, so actual pay is used)'],
                    ['Age multiplier', '1 week per year (age 22 to 40)'],
                    ['Calculation', '8 x £600 = £4,800 statutory redundancy'],
                  ],
                  note: 'The cap does not affect this calculation because your salary is already below it.',
                },
                {
                  title: 'Example 2: salary above the cap',
                  rows: [
                    ['Your details', 'Age 36, 8 years of service, earning £1,200 per week'],
                    ['Weekly pay used', '£751 (cap applies, reducing from £1,200)'],
                    ['Age multiplier', '1 week per year (age 22 to 40)'],
                    ['Calculation', '8 x £751 = £6,008 statutory redundancy'],
                  ],
                  note: 'The cap reduces your payment by £3,192 compared to an uncapped calculation.',
                },
                {
                  title: 'Example 3: longer service, higher age factor',
                  rows: [
                    ['Your details', 'Age 45, 15 years of service, earning £1,000 per week'],
                    ['Weekly pay used', '£751 (cap applies, reducing from £1,000)'],
                    ['Age multiplier', '1.5 weeks per year (age 41 and over)'],
                    ['Calculation', '15 x 1.5 x £751 = £16,897.50 statutory redundancy'],
                  ],
                  note: 'Even with the age multiplier working in your favour, the cap still reduces your payment compared to an uncapped figure of £22,500.',
                },
              ].map(({ title, rows, note }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-sm font-medium">{title}</p>
                  </div>
                  <div className="divide-y divide-rule">
                    {rows.map(([label, value]) => (
                      <div key={label} className="flex gap-4 px-4 py-3">
                        <span className="text-sm text-muted w-36 flex-shrink-0">{label}</span>
                        <span className="sc-body text-sm">{value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-paper px-4 py-3">
                    <p className="text-xs text-muted">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Year-by-year comparison */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The redundancy pay cap year by year</h2>
            <p className="sc-body mb-6">
              The cap increases most years in line with earnings growth. Here are the figures for the last three years in Great Britain.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Effective date</th>
                    <th className="text-left px-4 py-3 font-medium">Weekly cap</th>
                    <th className="text-left px-4 py-3 font-medium">Maximum redundancy</th>
                    <th className="text-left px-4 py-3 font-medium">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['6 April 2024', '£643', '£19,290', '+3.4%'],
                    ['6 April 2025', '£719', '£21,570', '+11.8%'],
                    ['6 April 2026', '£751', '£22,530', '+4.4%'],
                  ].map(([date, cap, max, change], i) => (
                    <tr key={date} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink">{date}</td>
                      <td className="px-4 py-3 text-ink font-medium">{cap}</td>
                      <td className="px-4 py-3 text-ink">{max}</td>
                      <td className="px-4 py-3 text-ink">{change}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sc-body text-xs text-muted mt-3">
              Great Britain figures. Northern Ireland caps: £661 (2024), £749 (2025), £783 (2026). Source: SI 2026/310 and preceding orders.
            </p>
          </div>
        </section>

        {/* What counts as a week's pay */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What counts as "a week's pay" under the cap</h2>
            <p className="sc-body mb-6">
              The cap limits the weekly pay figure, but what is included in "weekly pay" is frequently misunderstood. Employers sometimes get this wrong.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink mb-0.5">Gross weekly pay</p>
                  <p className="sc-body text-sm text-muted">Take your annual salary and divide by 52. Use gross pay before tax and National Insurance, not take-home.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink mb-0.5">Guaranteed overtime</p>
                  <p className="sc-body text-sm text-muted">Include overtime only if it is contractually guaranteed. Voluntary or occasional overtime is excluded.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink mb-0.5">Contractual bonuses and commission</p>
                  <p className="sc-body text-sm text-muted">Include if the bonus or commission is contractual and regular. A discretionary annual bonus is excluded; a guaranteed quarterly commission is included.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink mb-0.5">Variable hours</p>
                  <p className="sc-body text-sm text-muted">If your pay or hours fluctuate, use the average weekly pay over the 12 weeks before redundancy <sup>5</sup>.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-paper text-muted">
                  Excluded
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink mb-0.5">Employer pension contributions</p>
                  <p className="sc-body text-sm text-muted">What your employer pays into your pension does not count. Only salary is used.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-paper text-muted">
                  Excluded
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink mb-0.5">Benefits in kind</p>
                  <p className="sc-body text-sm text-muted">Company car, private health insurance, gym membership, and other non-cash benefits are excluded.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What the cap does not cover */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What the cap does not cover</h2>
            <p className="sc-body mb-4">
              The weekly pay cap applies only to the statutory redundancy formula. It does not limit what your employer can offer in a settlement agreement, and it does not affect notice pay or holiday pay.
            </p>
            <p className="sc-body mb-4">
              A settlement agreement typically has three financial components: statutory redundancy pay (capped by the formula), notice pay or PILON (always taxed as earnings under Section 402D of the Income Tax (Earnings and Pensions) Act 2003 <sup>6</sup>), and accrued holiday pay. These are separate. The cap touches only the first.
            </p>
            <p className="sc-body mb-4">
              Your employer may also offer an ex-gratia payment on top of the statutory entitlement to secure a settlement. If your statutory figure is £8,000, the employer might offer £14,000 total. The cap does not prevent this. Any ex-gratia amount combined with statutory redundancy is tax-free up to £30,000 under Section 403 of the Income Tax (Earnings and Pensions) Act 2003 <sup>4</sup> (PILON excluded).
            </p>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                If your employer's settlement offer is lower than your capped statutory entitlement, that offer is unlawful, not just unfair. The statutory minimum is not negotiable. Use the calculator below to confirm your baseline before evaluating any offer.
              </p>
            </div>
          </div>
        </section>

        {/* What to do if wrongly applied */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What to do if your employer has applied the cap incorrectly</h2>
            <p className="sc-body mb-6">
              Errors happen. Common mistakes include miscounting years of service, misapplying the age multiplier, or using net pay instead of gross pay. Here is what to do.
            </p>
            <ol className="flex flex-col gap-6">
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Calculate your correct figure</p>
                  <p className="sc-body text-sm">Apply the formula: (weekly pay capped at £751) x (age multiplier) x (years of service, max 20). Use your gross pay. Write it down.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Check your payslip</p>
                  <p className="sc-body text-sm">Verify the redundancy payment shown on your final payslip against your calculation. If the number is lower, proceed.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Raise it formally in writing</p>
                  <p className="sc-body text-sm">Email your employer's HR or payroll team with your calculation, the correct figure, and a citation to Section 227 of the Employment Rights Act 1996 <sup>1</sup>. Request correction within 7 days.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Bring a tribunal claim if they refuse</p>
                  <p className="sc-body text-sm">If the employer does not respond or refuses, you can bring a claim in the Employment Tribunal for unlawful deduction of wages. The time limit is 3 months from the date of underpayment. A tribunal can award the unpaid amount plus interest.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* How cap interacts with settlement */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How the cap interacts with your settlement offer</h2>
            <p className="sc-body mb-4">
              If your employer offers a settlement agreement rather than proceeding with statutory redundancy alone, the cap still sets your legal floor. A settlement that pays less than the capped statutory figure for redundancy is unlawful.
            </p>
            <p className="sc-body mb-4">
              For example: your statutory redundancy is £8,000 under the capped formula. A settlement totalling £6,000 is unlawful, even if it claims to include notice pay and holiday within that figure. The statutory redundancy component alone must reach £8,000.
            </p>
            <p className="sc-body">
              The cap protects you. Use it as your baseline. Any settlement negotiation starts from the capped statutory figure and works upward based on your bargaining position, length of service, and any additional employment claims you may have.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Calculate your redundancy entitlement now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Enter your age, salary, and years of service. The calculator applies the April 2026 statutory rates and shows your capped statutory figure instantly.
            </p>
            <Link href="/redundancy-calculator" className="btn-accent">
              Calculate my redundancy pay
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
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 162
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/221" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Sections 221-224 (Calculation of a week's pay)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D
                </a>
              </li>
            </ol>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
