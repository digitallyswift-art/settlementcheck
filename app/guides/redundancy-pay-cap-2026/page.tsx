import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Redundancy Pay Cap 2026 (£751/wk) | SettlementCheck',
  description:
    'Check the UK redundancy pay cap for 2026 (£751/week limit). Find calculations, worked examples, and what to check if your employer got it wrong. No email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
  },
  openGraph: {
    title: 'Redundancy Pay Cap 2026 (£751/wk) | SettlementCheck',
    description:
      'Check the UK redundancy pay cap for 2026 (£751/week limit). Find calculations, worked examples, and what to check if your employer got it wrong. No email.',
    url: 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redundancy Pay Cap 2026 (£751/wk) | SettlementCheck',
    description:
      'Check the UK redundancy pay cap for 2026 (£751/week limit). Find calculations, worked examples, and what to check if your employer got it wrong. No email.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/redundancy-pay-cap-2026/', STATIC_METADATA)
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
    a: 'Yes. The cap limits the statutory redundancy formula, not what your employer agrees to pay in a settlement agreement. Many employers offer ex-gratia payments above the statutory amount.',
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
    '@id': 'https://settlementcheck.co.uk/guides/redundancy-pay-cap-2026/',
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
      name: 'The Employment Rights (Increase of Limits) Order 2026',
      url: 'https://www.legislation.gov.uk/uksi/2026/index',
    },
  ],
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
              <span className="text-xs text-ink truncate">Redundancy Pay Cap 2026</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Statutory Redundancy Guide</p>
            <h1 className="sc-h1 mb-4">
              UK Statutory Redundancy Pay Cap 2026 (£751/Week)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 s.227 &amp; SI 2026/310
            </p>
            <p className="sc-lead leading-relaxed">
              Facing redundancy or checking a draft settlement offer? From 6 April 2026, statutory redundancy pay is capped at £751 per week in Great Britain. Check your calculated statutory baseline in 60 seconds with no email required, see how the cap works, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Micro-Tool (Immediately below Hero) */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does the £751 weekly cap affect your redundancy pay?"
              subtitle="Apply the April 2026 weekly cap (£751) and age multipliers to see your calculated statutory baseline and commercial range."
              disputeType="redundancy"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Max Redundancy', value: '£22,530', statute: 'ERA 1996 s.162' },
                { label: 'Tax-Free Shield', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
              ]}
              initialSalary={48000}
              initialYears={6}
              initialAge={42}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Statutory Quick Answer Callout (GEO / AI Overview Optimised) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  April 2026 Rates (SI 2026/310)
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                What is the UK statutory redundancy pay cap for 2026?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                From 6 April 2026, the statutory redundancy weekly pay cap is £751 in Great Britain under SI 2026/310 (£783 in Northern Ireland). The maximum statutory payment is £22,530, based on 20 qualifying years. Your statutory entitlement forms your calculated statutory baseline under Section 162 of the Employment Rights Act 1996.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Pay Cap</span>
                  <span className="font-bold text-ink text-sm">£751 (GB) / £783 (NI)</span>
                  <span className="text-muted text-[11px]">In force from 6 April 2026 (SI 2026/310)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Maximum Statutory Redundancy</span>
                  <span className="font-bold text-ink text-sm">£22,530</span>
                  <span className="text-muted text-[11px]">20 years service x 1.5 weekly cap</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Qualifying Service</span>
                  <span className="font-bold text-ink text-sm">2 continuous years</span>
                  <span className="text-muted text-[11px]">Employment Rights Act 1996 s.155</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax Status</span>
                  <span className="font-bold text-ink text-sm">100% Tax-Free</span>
                  <span className="text-muted text-[11px]">Covered by £30k exemption (ITEPA s.403)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.227 &amp; SI 2026/310</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check my draft terms →
                  </Link>
                  <Link href="/calculator/?reason=redundancy" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my redundancy →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What the cap is */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What is the redundancy pay cap for 2026?</h2>
            <div className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule">
              From 6 April 2026, the statutory redundancy weekly pay cap is <strong>£751</strong> in Great Britain (England, Scotland, and Wales) and <strong>£783</strong> in Northern Ireland. This cap limits the weekly pay figure used under Section 227 of the Employment Rights Act 1996 <sup>1</sup>.
            </div>
            <p className="sc-body mb-4">
              The redundancy pay cap is a statutory maximum. If you earn £1,200 per week, the statutory formula uses £751. If you earn £500 per week, the formula uses £500.
            </p>
            <p className="sc-body mb-4">
              The figures update every April by Statutory Instrument. In Great Britain, the 2026 cap is set by SI 2026/310 <sup>1</sup>, while Northern Ireland&apos;s limit is set by SR 2026/57 <sup>2</sup>.
            </p>
            <p className="sc-body">
              The 2026 increase of 4.4% (from £719 to £751) reflects average earnings growth since April 2025. Future updates are normally published each March for the April implementation date.
            </p>
          </div>
        </section>

        {/* How the cap affects calculation */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does the weekly pay cap affect your calculation?</h2>
            <p className="sc-body mb-6">
              Statutory redundancy uses a three-part formula. The cap applies to the weekly pay figure, while your age and service set the multiplier.
            </p>

            {/* Formula steps */}
            <div className="rounded-xl border border-rule bg-paper p-5 mb-8">
              <p className="text-[15px] font-semibold text-ink mb-4">The statutory redundancy formula</p>
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
                  note: 'Even with the age multiplier working in your favour, the cap reduces your payment compared to an uncapped figure of £22,500.',
                },
              ].map(({ title, rows, note }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-[15px] font-medium">{title}</p>
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
                    <p className="text-[14px] text-muted">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Year-by-year comparison */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How has the redundancy pay cap changed year by year?</h2>
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
            <p className="sc-body text-muted mt-3">
              Great Britain figures. Northern Ireland caps: £661 (2024), £749 (2025), £783 (2026). Source: SI 2026/310 and preceding orders.
            </p>
          </div>
        </section>

        {/* What counts as a week's pay */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What counts as a week&apos;s pay under the cap?</h2>
            <p className="sc-body mb-6">
              The cap limits the weekly pay figure, and what counts inside &quot;weekly pay&quot; is set by statute.
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-0.5">Gross weekly pay</p>
                  <p className="sc-body text-muted">Take your annual salary and divide by 52. Use gross pay before tax and National Insurance, not take-home.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-0.5">Guaranteed overtime</p>
                  <p className="sc-body text-muted">Include overtime only if it is contractually guaranteed. Voluntary or occasional overtime is excluded.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-0.5">Contractual bonuses and commission</p>
                  <p className="sc-body text-muted">Include if the bonus or commission is contractual and regular. A discretionary annual bonus is excluded; guaranteed commission is included.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-ink text-white">
                  Included
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-0.5">Variable hours</p>
                  <p className="sc-body text-muted">If your pay or hours fluctuate, use the average weekly pay over the 12 weeks before redundancy <sup>5</sup>.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-paper text-muted">
                  Excluded
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-0.5">Employer pension contributions</p>
                  <p className="sc-body text-muted">What your employer pays into your pension does not count. Only gross salary is used.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 rounded-xl border border-rule p-4">
                <div className="text-xs font-semibold px-2 py-1 rounded flex-shrink-0 mt-0.5 bg-paper text-muted">
                  Excluded
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-0.5">Benefits in kind</p>
                  <p className="sc-body text-muted">Company car, private health insurance, gym membership, and other non-cash benefits are excluded.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What the cap does not cover */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What does the weekly pay cap not cover?</h2>
            <p className="sc-body mb-4">
              The weekly pay cap applies only to the statutory redundancy formula. It does not limit what your employer can offer in a settlement agreement, and it does not affect notice pay or holiday pay.
            </p>
            <p className="sc-body mb-4">
              A settlement agreement normally separates statutory redundancy pay, notice pay or <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON</Link> (taxed as wages under ITEPA 2003 s.402D <sup>6</sup>), and accrued holiday pay. The weekly cap touches only the first element.
            </p>
            <p className="sc-body mb-4">
              Employers may also offer an ex-gratia payment above the statutory amount. Any genuine redundancy or ex-gratia sum is <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">tax-free up to £30,000</Link> under ITEPA 2003 s.403 <sup>4</sup>.
            </p>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body">
                A settlement agreement cannot lawfully pay less than your statutory redundancy entitlement. Use the calculator above to confirm your calculated statutory baseline before reviewing any offer with an independent solicitor.
              </p>
            </div>
          </div>
        </section>

        {/* What to do if wrongly applied */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What can you check if your employer applied the cap wrongly?</h2>
            <p className="sc-body mb-6">
              Calculation errors can happen through miscounted service years, the wrong age multiplier, or using net pay instead of gross pay. These steps help you and your solicitor verify the numbers:
            </p>
            <ol className="flex flex-col gap-6">
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Calculate your statutory figure</p>
                  <p className="sc-body">Apply the formula: (gross weekly pay capped at £751) x (age multiplier) x (years of service, max 20).</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Check your schedule or payslip</p>
                  <p className="sc-body">Compare the redundancy line on your settlement schedule or final payslip against your calculated baseline.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Request a written breakdown</p>
                  <p className="sc-body">You can share your calculation and a reference to Section 227 of the Employment Rights Act 1996 <sup>1</sup> with HR or payroll to ask for a written breakdown.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Understand employment tribunal time limits</p>
                  <p className="sc-body">If a shortfall remains unresolved, claims in the <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-ink">Employment Tribunal</Link> are subject to strict statutory deadlines (typically 3 months minus 1 day for unlawful deduction of wages, or 6 months for statutory redundancy pay).</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* How cap interacts with settlement */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does the cap interact with a settlement offer?</h2>
            <p className="sc-body mb-4">
              If your employer offers a settlement agreement instead of statutory redundancy alone, the cap still sets your calculated statutory baseline. A settlement that pays less than the capped statutory redundancy figure would fall below the statutory minimum.
            </p>
            <p className="sc-body mb-4">
              For example, if your statutory redundancy is £8,000 under the capped formula, the statutory redundancy element must reach £8,000. Notice pay and holiday pay sit separately on top of that baseline.
            </p>
            <p className="sc-body">
              Any settlement discussion starts from your calculated statutory baseline and moves upward based on notice terms, length of service, and any potential employment claims.
            </p>

            <div className="mt-6 rounded-xl border border-coral/30 bg-[#FFF8F6] p-5 flex items-start gap-3">
              <InfoIcon />
              <div className="text-sm">
                <p className="font-semibold text-ink mb-1">Are you an NHS or public sector employee?</p>
                <p className="text-muted leading-relaxed">
                  Under NHS Agenda for Change Section 16, contractual redundancy pay is calculated on your actual monthly salary (1 month of pay per year of service up to 24 months), bypassing the statutory £751 weekly cap. Check your entitlement using our dedicated <Link href="/guides/nhs-settlement-agreements/" className="underline font-semibold text-coral hover:text-ink">NHS Redundancy &amp; MARS Calculator</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check your redundancy entitlement now
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              Enter your age, salary, and years of service to apply the April 2026 statutory rates and see your calculated statutory baseline.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/redundancy-calculator/" className="btn-accent">
                Calculate my redundancy →
              </Link>
              <Link href="/calculator/" className="btn-secondary">
                Check my offer now →
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
            <DynamicFaqSection pathname="/guides/redundancy-pay-cap-2026/" />

            <div className="pt-8">
              <RelatedArticles
                title="Related Guides & Calculations"
                items={[
                  {
                    href: '/guides/nhs-settlement-agreements/',
                    title: 'NHS Redundancy & MARS Calculator 2026',
                    description: 'Agenda for Change Section 16 terms pay 1 month per year up to 24 months, uncapped by statutory weekly rates.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/protective-award-calculator/',
                    title: 'Protective Award Calculator UK',
                    description: 'Calculate your entitlement of up to 90 days gross pay under TULRCA 1992 s.189 for consultation failures.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/guides/tax-free-settlement-30000/',
                    title: 'The £30,000 Tax-Free Settlement Rule',
                    description: 'Learn how redundancy pay, PILON, and ex-gratia sums are taxed under ITEPA 2003 s.403.',
                    tag: 'Tax Guide',
                  },
                  {
                    href: '/guides/what-is-a-fair-settlement-agreement/',
                    title: 'What Is a Fair Settlement Agreement?',
                    description: 'Learn how settlement packages are structured and benchmarked across UK sectors.',
                    tag: 'Guide',
                  },
                  {
                    href: '/statutory-rates-history/',
                    title: '27-Year History of UK Statutory Redundancy Caps (2000-2026)',
                    description: 'Track how the statutory weekly cap rose from £230 to £751 and compare historical maximum payouts.',
                    tag: 'Data Archive',
                  },
                  {
                    href: '/guides/redundancy-vs-settlement-agreement/',
                    title: 'Redundancy vs Settlement Agreement UK',
                    description: 'Understand when an employer offers an enhanced settlement package above the calculated statutory baseline.',
                    tag: 'Comparison',
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
                  Employment Rights Act 1996, Sections 221-224 (Calculation of a week&apos;s pay)
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
