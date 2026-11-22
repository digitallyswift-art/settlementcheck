import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Tax-Free Settlement 2026 | £30k Rule | SettlementCheck',
  description:
    'Free UK settlement agreement tax guide. First £30,000 is tax-free. Learn which payments qualify, how the excess is taxed, and check your offer. No email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
  },
  openGraph: {
    title: 'Tax-Free Settlement 2026 | £30k Rule | SettlementCheck',
    description:
      'Free UK settlement agreement tax guide. First £30,000 is tax-free. Learn which payments qualify, how the excess is taxed, and check your offer. No email.',
    url: 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tax-Free Settlement 2026 | £30k Rule | SettlementCheck',
    description:
      'Free UK settlement agreement tax guide. First £30,000 is tax-free. Learn which payments qualify, how the excess is taxed, and check your offer. No email.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/tax-free-settlement-30000/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Is a settlement agreement always tax-free up to £30,000?',
    a: 'No. The £30,000 exemption only applies to genuine compensation for losing your job, such as statutory redundancy pay or ex-gratia payments. Notice pay, holiday pay, and garden leave are taxed as wages.',
  },
  {
    q: 'Do I pay National Insurance on settlement payments over £30,000?',
    a: 'No. You do not pay employee National Insurance contributions on termination compensation, even if it exceeds £30,000. You only pay Income Tax on the excess, while your employer pays Class 1A National Insurance on sums over £30,000.',
  },
  {
    q: 'Is my employer\'s contribution to my legal fees tax-free?',
    a: 'Yes. Under HMRC rules, an employer contribution paid directly to your solicitor upon completion (standardly £350 to £500+ plus VAT) is tax-free and does not count toward your £30,000 limit. Excess or abortive work is subject to solicitor engagement terms.',
  },
  {
    q: 'Can I pay my settlement into my pension to avoid tax?',
    a: 'Often yes, if your employer agrees to pay part of the ex-gratia sum directly into a registered pension scheme. This is normally tax-free within your annual pension allowance and does not use up your £30,000 exemption.',
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
  headline: 'The first £30,000 of your settlement agreement is tax-free in 2026',
  url: 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-24',
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
    logo: {
      '@type': 'ImageObject',
      url: 'https://settlementcheck.co.uk/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/tax-free-settlement-30000/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 401',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/401',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
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

export default function TaxFreeSettlementGuide() {
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
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Tax-Free Settlement £30,000</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Tax &amp; redundancy</p>
            <h1 className="sc-h1 mb-4">
              £30,000 Tax-Free Settlement Agreement Exemption (2026)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ITEPA 2003 &amp; HMRC EIM
            </p>
            <p className="sc-lead">
              Checking how much of your settlement agreement you will actually keep? Under Section 403 of ITEPA 2003, up to £30,000 of genuine termination compensation is tax-free, while notice pay and holiday pay are taxed as wages. Check your tax split in 60 seconds with no email required before speaking to a solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Check */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer split between tax-free and taxable pay?"
              subtitle="Separate tax-free ex-gratia compensation under ITEPA 2003 s.403 from taxable notice pay (PILON) and holiday pay."
              disputeType="tax_30000"
              statutoryPills={[
                { label: 'Ex-Gratia Shield', value: 'First £30,000 Free', statute: 'ITEPA 2003 s.403' },
                { label: 'Notice Pay (PENP)', value: '100% Taxable', statute: 'ITEPA 2003 s.402D' },
                { label: 'Employee NICs', value: '0% Exemption', statute: 'SSCBA 1992' },
              ]}
              initialSalary={55000}
              initialYears={5}
              initialAge={40}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  HMRC &amp; ITEPA 2003 Rules
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                How is a settlement agreement taxed in the UK?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Under Section 403 of ITEPA 2003, the first £30,000 of genuine compensation is tax-free with zero employee National Insurance. Notice pay (PILON), holiday pay, and garden leave are taxed as wages under Section 402D. Your employer&apos;s legal fee contribution is also tax-free under HMRC rules.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Ex-Gratia &amp; Redundancy</span>
                  <span className="font-bold text-ink text-sm">First £30,000 Tax-Free</span>
                  <span className="text-muted text-[11px]">Section 403 of ITEPA 2003</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Notice Pay (PILON)</span>
                  <span className="font-bold text-ink text-sm">Taxed as Wages</span>
                  <span className="text-muted text-[11px]">Subject to PENP formula (s.402D)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Employee National Insurance</span>
                  <span className="font-bold text-ink text-sm">0% NI on Compensation</span>
                  <span className="text-muted text-[11px]">No employee NI even above £30k</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Employer Legal Contribution</span>
                  <span className="font-bold text-ink text-sm">100% Tax-Exempt</span>
                  <span className="text-muted text-[11px]">£350 to £500+ plus VAT upon completion</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Income Tax (Earnings and Pensions) Act 2003 s.403</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check my draft tax split →
                  </Link>
                  <Link href="/settlement-agreement-tax-calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my take-home pay →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What the £30,000 rule is */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What is the £30,000 tax-free settlement rule?</h2>
            <p className="sc-body mb-4">
              The £30,000 rule is a statutory tax exemption under Section 403 of ITEPA 2003. It lets employers pay genuine termination compensation up to £30,000 without deducting Income Tax.
            </p>
            <p className="sc-body mb-4">
              If qualifying payments stay under £30,000, no Income Tax applies. If they exceed £30,000, Income Tax applies only to the excess above that limit.
            </p>
            <p className="sc-body">
              This is a single £30,000 limit per employment. It covers all termination payments from the same employer or connected employers.
            </p>
          </div>
        </section>

        {/* What qualifies */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What qualifies for the £30,000 tax-free exemption?</h2>
            <p className="sc-body mb-6">
              Only payments made strictly for losing your job qualify for the £30,000 shield. Contractual pay and benefits are always taxed as wages.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Tax-Free Up to £30,000</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Statutory redundancy pay (capped at £22,530 in GB).</li>
                  <li>Genuine ex-gratia termination payments.</li>
                  <li>Damages for unfair dismissal or wrongful dismissal.</li>
                </ul>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Taxed as Wages</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Notice pay (PILON) and garden leave salary.</li>
                  <li>Accrued holiday pay and contractual bonuses.</li>
                  <li>Payments tied to new non-compete restrictions.</li>
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="font-serif text-[19px] font-[460] text-ink mb-4">Qualifying statutory categories</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    Statutory redundancy pay (capped at £22,530 in Great Britain ², see our <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">2026 cap guide</Link>).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    Ex-gratia payments made as discretionary compensation for loss of employment.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    Damages for <Link href="/unfair-dismissal-calculator/" className="underline hover:text-ink">unfair dismissal</Link> or breach of contract.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    Pre-termination injury to feelings payments linked to unlawful discrimination ³.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Table of components */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How is each part of a settlement agreement taxed?</h2>
            <p className="sc-body mb-6">
              Each element of a settlement agreement follows its own statutory rule under UK tax law.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Tax Treatment of Settlement Agreement Components 2026</caption>
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
                      <Link key="srp" href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">Statutory Redundancy</Link>,
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
                      <Link key="pilon" href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON (Notice Pay)</Link>,
                      'Taxed as wages',
                      'Full employee and employer Class 1 NICs.',
                      'ITEPA 2003 s.402D ⁴',
                    ],
                    [
                      'Holiday Pay & Garden Leave',
                      'Taxed as wages',
                      'Full employee and employer Class 1 NICs.',
                      'Normal payroll rules',
                    ],
                    [
                      'Legal Fees Contribution',
                      'Tax-free',
                      'Exempt from NICs.',
                      'HMRC ESC A81 ⁵',
                    ],
                    [
                      'Pension Contribution',
                      'Tax-free (within allowance)',
                      'Exempt from NICs.',
                      'Registered pension rules',
                    ],
                    [
                      'Injury to Feelings (Pre-termination)',
                      'Tax-free up to £30,000',
                      'Exempt under s.406 rules.',
                      'ITEPA 2003 s.406 ⁶',
                    ],
                  ].map(([component, tax, ni, basis], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{component}</td>
                      <td className="px-4 py-3 text-ink">{tax}</td>
                      <td className="px-4 py-3 text-ink">{ni}</td>
                      <td className="px-4 py-3 text-ink font-serif text-xs">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sc-body text-muted mt-3">
              Figures reflect UK employment tax legislation for the 2026/27 tax year.
            </p>
          </div>
        </section>

        {/* Worked Examples */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does the £30,000 limit work in practice?</h2>
            <p className="sc-body mb-6">
              These three worked examples show how HMRC rules apply to different settlement totals.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Redundancy package under £30,000',
                  points: [
                    'You receive £6,000 statutory redundancy and a £15,000 ex-gratia sum, while working your notice period.',
                    'The £21,000 termination total sits below £30,000, so it is paid tax-free with zero employee National Insurance.',
                  ],
                },
                {
                  title: 'Example 2: Redundancy package exceeding £30,000',
                  points: [
                    'You receive £12,000 statutory redundancy and a £25,000 ex-gratia sum, totalling £37,000.',
                    'The first £30,000 is tax-free. Income Tax applies only to the £7,000 excess, with zero employee National Insurance.',
                    'Your employer pays Class 1A National Insurance on that £7,000 excess.',
                  ],
                },
                {
                  title: 'Example 3: Settlement with notice pay (PILON)',
                  points: [
                    'You receive £5,000 PILON and a £28,000 ex-gratia payment, totalling £33,000.',
                    'The £5,000 PILON is taxed as wages with Income Tax and National Insurance deducted.',
                    'The £28,000 ex-gratia sum is separate and sits below £30,000, so it is paid tax-free.',
                  ],
                },
              ].map(({ title, points }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-[15px] font-medium">{title}</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    {points.map((point, index) => (
                      <p key={index} className="sc-body">{point}</p>
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
            <h2 className="guide-h2 mb-4">What is a tax indemnity clause?</h2>
            <p className="sc-body mb-4">
              Almost every UK settlement agreement includes a tax indemnity clause. It states that you remain responsible for any extra Income Tax HMRC later decides is owed on the payment.
            </p>
            <p className="sc-body mb-4">
              That is why separating tax-free ex-gratia sums from notice pay, holiday pay, and non-compete payments matters before signature. An independent solicitor checks that the wording matches HMRC rules under Section 203(3) ERA 1996.
            </p>

            <ReviewCallout
              title="Want to check your tax split before speaking to a solicitor?"
              description="Compare your draft figures to see how ex-gratia compensation and PILON separate under ITEPA 2003 s.403 and s.402D."
              ctaText="Check my offer now →"
              badge="April 2026 Statutory Check"
            />
          </div>
        </section>

        {/* What if wrong */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What if your draft separates tax incorrectly?</h2>
            <p className="sc-body mb-6">
              If notice pay and compensation are lumped together, payroll may deduct too much tax or leave an HMRC liability later. These four checks help spot issues early:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Itemised payroll breakdown',
                  body: 'A clear breakdown shows how notice pay, holiday pay, and ex-gratia sums were calculated.',
                },
                {
                  n: 2,
                  title: 'Post-Employment Notice Pay (PENP) check',
                  body: 'Under ITEPA 2003 s.402D, any unworked notice period is calculated and taxed as wages before the £30,000 shield applies.',
                },
                {
                  n: 3,
                  title: 'Separate contractual and ex-gratia clauses',
                  body: 'Drafts normally list taxable notice, holiday, and non-compete payments in distinct clauses from tax-free termination compensation.',
                },
                {
                  n: 4,
                  title: 'Independent solicitor review',
                  body: 'Your solicitor reviews the tax indemnity and payment schedule before signing the adviser&apos;s certificate.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3 mt-8">
              <InfoIcon />
              <p className="sc-body">
                Employers standardly contribute £350 to £500+ plus VAT toward your independent legal advice upon completion. Excess or abortive work is subject to your solicitor&apos;s engagement terms.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] text-white mb-3">
              Check where your offer stands
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed mb-6">
              See your calculated statutory baseline, tax-free split, and commercial settlement range before speaking to a solicitor.
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
            <DynamicFaqSection pathname="/guides/tax-free-settlement-30000/" />

            <div className="pt-8">
              <RelatedArticles
                title="Related Guides &amp; Tools"
                items={[
                  {
                    href: '/guides/nhs-settlement-agreements/',
                    title: 'NHS Redundancy & MARS Calculator 2026',
                    description: 'Learn how Agenda for Change terms and MARS voluntary exit packages are taxed under s.403.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/guides/redundancy-pay-cap-2026/',
                    title: 'Redundancy Pay Cap 2026 Explained',
                    description: 'Understand the statutory weekly pay cap of £751 and your calculated statutory baseline.',
                    tag: 'Guide',
                  },
                  {
                    href: '/guides/pilon-tax-treatment-2026/',
                    title: 'PILON Tax Treatment 2026',
                    description: 'Notice pay is taxed as wages under Section 402D. Learn how PILON separates from redundancy.',
                    tag: 'Tax Guide',
                  },
                  {
                    href: '/redundancy-calculator/',
                    title: 'Statutory Redundancy Calculator',
                    description: 'Calculate your statutory redundancy entitlement under the 2026 weekly cap of £751.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/penp-calculator/',
                    title: 'Post-Employment Notice Pay (PENP) Calculator',
                    description: 'Run the statutory ITEPA 2003 s.402D formula ((BP x D) / P) - T to separate taxable notice pay.',
                    tag: 'Tax Calculator',
                  },
                  {
                    href: '/guides/hmrc-tax-return-declaration/',
                    title: 'How to Declare a Settlement Agreement on Your UK Tax Return',
                    description: 'Self Assessment guide for termination payments above £30,000.',
                    tag: 'HMRC Guide',
                  },
                ]}
              />
            </div>
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
        {/* Disclaimer */}
        <section className="py-6 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <p className="sc-body text-muted leading-relaxed">
              Disclaimer: Tax calculations on this page are statutory estimates based on 2026/27 HMRC rates. They do not constitute formal legal or tax advice. Confirm your specific offer using our free calculator.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
