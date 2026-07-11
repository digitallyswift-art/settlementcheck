import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Tax on Settlement Agreements: The £30,000 Exemption Rule Explained',
  description:
    'The first £30,000 of a settlement agreement is tax-free under ITEPA 2003 s.403. Learn which payments qualify, how the excess is taxed, and what to check in 2026.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
  },
  openGraph: {
    title: 'Tax on Settlement Agreements: The £30,000 Exemption Rule Explained',
    description:
      'The first £30,000 of a settlement agreement is tax-free under ITEPA 2003 s.403. Learn which payments qualify, how the excess is taxed, and what to check in 2026.',
    url: 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'Is a settlement agreement always tax-free up to £30,000?',
    a: 'No. The £30,000 exemption only applies to genuine compensation for losing your job, such as redundancy pay or ex-gratia payments. Notice pay, holiday pay, and salary are always taxable.',
  },
  {
    q: 'Do I pay National Insurance on settlement payments over £30,000?',
    a: 'No. You do not pay employee National Insurance contributions on any part of your termination payment, even if it exceeds £30,000. You only pay income tax on the amount above £30,000. Your employer, however, must pay Class 1A National Insurance on the excess.',
  },
  {
    q: 'Is my employer\'s contribution to my legal fees tax-free?',
    a: 'Yes. Your employer can pay your legal fees directly to your solicitor tax-free under HMRC rules. This payment does not count towards your £30,000 exemption limit.',
  },
  {
    q: 'Can I pay my settlement into my pension to avoid tax?',
    a: 'Yes. You can request that your employer pays some or all of your settlement directly into your pension scheme. This payment is tax-free and does not use up your £30,000 exemption, provided it stays within your annual pension allowance.',
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
  headline: 'Tax on Settlement Agreements: The £30,000 Exemption Rule Explained',
  url: 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
  datePublished: '2026-05-24',
  dateModified: '2026-05-24',
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
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

export default function TaxFreeSettlementGuide() {
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
              <span className="text-xs text-ink truncate">Tax-Free Settlement 30000</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Tax Guide</p>
            <h1 className="sc-h1 mb-5">
              The first £30,000 of your settlement agreement is tax-free in 2026. Here is how the exemption works and what is taxable.
            </h1>
            <p className="sc-lead">
              From 6 April 2026, the first £30,000 of a settlement agreement is tax-free in the UK. This rule comes from Section 403 of the Income Tax (Earnings and Pensions) Act 2003 ¹. The exemption applies to statutory redundancy pay, ex-gratia compensation, and occupational redundancy. Notice pay, holiday pay, and salary are fully taxable. Use this guide to see how the limit applies to your offer.
            </p>
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key tax rules for settlement agreements</p>
              <ul className="flex flex-col gap-3">
                {[
                  'The £30,000 exemption only applies to genuine compensation for losing your job.',
                  'You pay no employee National Insurance contributions on any part of your termination payment.',
                  'Your employer covers your legal fees for this process, which is paid tax-free under HMRC rules.',
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

        {/* What the £30,000 rule is */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What is the £30,000 tax-free settlement rule?</h2>
            <p className="sc-body mb-4">
              The £30,000 rule is a statutory tax exemption. It allows employers to pay termination payments up to £30,000 without deducting income tax. This limit applies to all payments related to the loss of your employment.
            </p>
            <p className="sc-body mb-4">
              If your package is under £30,000, you will pay no income tax on qualifying components. If your package exceeds £30,000, you pay tax only on the portion above this limit.
            </p>
            <p className="sc-body">
              This exemption is a lifetime limit for one employment. It applies to the total of all termination payments from the same employer. It also applies to payments from connected employers.
            </p>
          </div>
        </section>

        {/* What qualifies */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What qualifies for the £30,000 tax-free exemption?</h2>
            <p className="sc-body mb-6">
              Only specific parts of your settlement agreement qualify for the £30,000 tax-free limit. Other components are always fully taxable.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-8">
              <p className="text-sm font-semibold text-ink mb-4">Qualifying tax-free payments</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Statutory redundancy pay (which is capped at £22,530 in Great Britain ²).',
                  'Ex-gratia payments, which are discretionary payments to compensate for losing your job.',
                  'Damages for unfair dismissal or breach of contract.',
                  'Injury to feelings payments, provided the discrimination occurred before your termination ³.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="sc-body mb-4">
              Payments that are not linked to losing your job do not qualify. Holiday pay, accrued salary, and contractual bonuses are fully taxable.
            </p>
          </div>
        </section>

        {/* Table of components */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax Treatment of Settlement Agreement Components</h2>
            <p className="sc-body mb-6">
              Each component of your settlement agreement has its own statutory tax rules. Below is how each payment type is treated.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Component</th>
                    <th className="text-left px-4 py-3 font-medium">Income Tax</th>
                    <th className="text-left px-4 py-3 font-medium">National Insurance</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory Basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Statutory Redundancy',
                      'Tax-free up to £30,000',
                      'No employee NICs. Employer Class 1A on excess over £30,000.',
                      'ITEPA 2003 s.403 ¹',
                    ],
                    [
                      'Ex-Gratia Payment',
                      'Tax-free up to £30,000',
                      'No employee NICs. Employer Class 1A on excess over £30,000.',
                      'ITEPA 2003 s.403 ¹',
                    ],
                    [
                      'PILON (Notice Pay)',
                      'Fully taxable as earnings',
                      'Fully taxable for both employee and employer.',
                      'ITEPA 2003 s.402D ⁴',
                    ],
                    [
                      'Holiday Pay',
                      'Fully taxable as salary',
                      'Fully taxable for both employee and employer.',
                      'Normal payroll rules',
                    ],
                    [
                      'Legal Fees Contribution',
                      'Fully tax-free',
                      'Tax-free (exempt from all taxes).',
                      'HMRC ESC A81 ⁵',
                    ],
                    [
                      'Pension Contribution',
                      'Fully tax-free',
                      'Tax-free (exempt from all taxes).',
                      'Registered pension rules',
                    ],
                    [
                      'Injury to Feelings (Pre-termination)',
                      'Fully tax-free',
                      'Tax-free (exempt from all taxes).',
                      'ITEPA 2003 s.406 ⁶',
                    ],
                  ].map(([component, tax, ni, basis], i) => (
                    <tr key={component} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{component}</td>
                      <td className="px-4 py-3 text-ink">{tax}</td>
                      <td className="px-4 py-3 text-ink">{ni}</td>
                      <td className="px-4 py-3 text-ink font-serif text-xs">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sc-body text-xs text-muted mt-3">
              Figures and rules reflect current UK employment tax legislation for the 2026/27 tax year.
            </p>
          </div>
        </section>

        {/* Worked Examples */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Examples: How the £30,000 Tax Limit Works</h2>
            <p className="sc-body mb-6">
              These three examples show how the tax-free limit applies to different settlement agreement values.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Redundancy package under £30,000',
                  points: [
                    'You receive a statutory redundancy payment of £6,000 and an ex-gratia payment of £15,000. You work your notice period.',
                    'The total termination package is £21,000. Because this is below the £30,000 limit, the entire £21,000 is paid tax-free.',
                    'You pay no income tax and no National Insurance on this amount.',
                  ],
                },
                {
                  title: 'Example 2: Redundancy package exceeding £30,000',
                  points: [
                    'You receive a statutory redundancy payment of £12,000 and an ex-gratia payment of £25,000. The total is £37,000.',
                    'The first £30,000 is paid tax-free. The remaining £7,000 is subject to income tax.',
                    'Your employer deducts income tax from the £7,000 excess. You pay no employee National Insurance on the £37,000.',
                    'Your employer must pay Class 1A National Insurance on the £7,000 excess ³.',
                  ],
                },
                {
                  title: 'Example 3: Settlement with notice pay (PILON)',
                  points: [
                    'You receive a £5,000 PILON payment and an ex-gratia payment of £28,000. The total package is £33,000.',
                    'The £5,000 PILON is fully taxable. Your employer deducts income tax and National Insurance from it.',
                    'The £28,000 ex-gratia payment is separate. It is below the £30,000 limit, so it is paid tax-free.',
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

        {/* The tax indemnity clause */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The tax indemnity clause: What you need to know</h2>
            <p className="sc-body mb-4">
              Every settlement agreement contains a tax indemnity clause. This clause is standard in UK employment law.
            </p>
            <p className="sc-body mb-4">
              The clause states that you are responsible for any unpaid tax on your settlement. If HMRC decides that more tax is due, you must pay it.
            </p>
            <p className="sc-body mb-4">
              This includes any interest or penalties. It also means you must refund your employer if HMRC bills them.
            </p>
            <p className="sc-body mb-4">
              This indemnity shows why correct tax structure is vital. If your employer gets the tax wrong, you carry the financial risk.
            </p>
            <p className="sc-body">
              Your solicitor will check the tax wording to ensure it is standard. They will make sure you only pay what you legally owe.
            </p>
          </div>
        </section>

        {/* What to do if wrong */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What to do if your employer structures the tax incorrectly</h2>
            <p className="sc-body mb-6">
              If your employer gets the tax structure wrong, you may pay too much tax. You might also face an HMRC bill later. Here is what to do:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Ask payroll for a detailed tax breakdown',
                  body: 'They must show how they calculated the tax on your payments.',
                },
                {
                  n: 2,
                  title: 'Verify the notice pay portion',
                  body: 'Ensure they did not lump notice pay and ex-gratia compensation together.',
                },
                {
                  n: 3,
                  title: 'Request amendments before you sign',
                  body: 'Ask your employer to separate the tax-free ex-gratia sum from the taxable notice pay.',
                },
                {
                  n: 4,
                  title: 'Have your solicitor review the tax indemnity',
                  body: 'Your solicitor will verify the tax structure before signing the agreement.',
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
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3 mt-8">
              <InfoIcon />
              <p className="sc-body text-sm">
                Your employer covers your solicitor fees for reviewing and signing the settlement agreement. This legal requirement protects you from making costly tax errors.
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
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 227 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/401" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 401
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim13740" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  HMRC Extra-Statutory Concession A81 (ESC A81)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/406" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 406 (exception for death or disability)
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
