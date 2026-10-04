import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Average Employment Tribunal Awards UK 2026: MoJ Compensation Tables',
  description:
    'Official MoJ employment tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 statutory cap, and settlement comparison.',
  alternates: {
    canonical: '/guides/employment-tribunal-average-awards-uk/',
  },
  openGraph: {
    title: 'Average Employment Tribunal Awards UK 2026: MoJ Compensation Tables',
    description:
      'Official MoJ employment tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 statutory cap, and settlement comparison.',
    url: '/guides/employment-tribunal-average-awards-uk/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Average Employment Tribunal Awards UK 2026: MoJ Compensation Tables',
    description:
      'Official MoJ employment tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 statutory cap, and settlement comparison.',
  },
}

const FAQS = [
  {
    q: 'What is the average employment tribunal payout in the UK for unfair dismissal?',
    a: 'According to official Ministry of Justice tribunal statistics, the median employment tribunal award for unfair dismissal in the UK is £7,564, and the mean average award is £13,541. The statutory compensatory award is strictly capped at £123,543 (effective 6 April 2026 under SI 2026/310) or 52 weeks’ gross salary, whichever is lower.',
  },
  {
    q: 'Why are negotiated settlement agreements usually higher than tribunal awards?',
    a: 'Tribunals only award financial loss actually incurred (after deducting earnings from any new job). They do not award extra compensation for stress in standard unfair dismissal claims. In contrast, employers signing a settlement agreement pay an ex-gratia premium (standardly 1.5 to 4 months’ salary) to eliminate commercial risk, avoid public hearing publicity, and avoid £10,000 to £30,000+ in corporate legal fees.',
  },
  {
    q: 'What is the maximum compensation an employment tribunal can award in 2026?',
    a: 'For ordinary unfair dismissal, the maximum compensatory award is £123,543 (in addition to a basic award of up to £22,530 based on 20 years at the £751 weekly cap). However, claims involving unlawful discrimination (Equality Act 2010) or whistleblowing (ERA 1996 s.103A) are legally uncapped.',
  },
  {
    q: 'How long does a UK employment tribunal claim take from start to finish?',
    a: 'HMCTS tribunal backlog data shows the average UK employment tribunal claim takes between 12 and 18 months to reach a full merit hearing. In contrast, a negotiated settlement agreement is standardly concluded in 10 to 21 days with legal fees paid by the employer.',
  },
  {
    q: 'Do I have to pay tax on an employment tribunal award versus a settlement agreement?',
    a: 'Compensation awarded by an employment tribunal for past or future loss of earnings is taxable as earnings. In contrast, under Section 403 of ITEPA 2003, the first £30,000 of compensation for loss of office paid under a settlement agreement is completely exempt from income tax and National Insurance.',
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
  headline: 'Average Employment Tribunal Awards UK 2026: Official MoJ Statistics & Compensation Tables',
  url: 'https://settlementcheck.co.uk/guides/employment-tribunal-average-awards-uk/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-06-01',
  dateModified: '2026-10-04',
  author: {
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
    '@id': 'https://settlementcheck.co.uk/guides/employment-tribunal-average-awards-uk/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)',
      url: 'https://www.legislation.gov.uk/uksi/2026/310/contents/made',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 124 (Compensatory Cap)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/124',
    },
    {
      '@type': 'Legislation',
      name: 'Equality Act 2010, Section 124 (Remedies in Tribunals)',
      url: 'https://www.legislation.gov.uk/ukpga/2010/15/section/124',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
    {
      '@type': 'GovernmentService',
      name: 'Ministry of Justice Tribunals Statistics Quarterly',
      url: 'https://www.gov.uk/government/collections/tribunals-statistics',
    },
  ],
}

export default function TribunalAverageAwardsGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Nav />

      <main className="bg-paper-2 min-h-screen">
        {/* Hero Section */}
        <section className="bg-paper pt-12 pb-10 border-b border-rule">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/guides/" className="text-xs font-mono font-medium text-muted hover:text-ink uppercase tracking-wider">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink font-medium">Tribunal Compensation Tables</span>
            </div>

            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-paper-2 border border-rule text-xs font-mono text-ink mb-3">
              <span className="w-2 h-2 rounded-full bg-coral inline-block" />
              Ministry of Justice Official Precedents • In Force April 2026
            </span>

            <h1 className="text-3xl sm:text-4xl font-serif text-ink font-bold leading-tight mb-4">
              Average Employment Tribunal Awards UK 2026: Official Compensation Tables
            </h1>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-3">
              <span>SettlementCheck Legal Research Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Statutory Limits under SI 2026/310</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Citing MoJ Annual Tribunal Statistics</span>
            </div>

            <p className="text-base sm:text-lg text-ink font-sans leading-relaxed">
              In 2026, the official median employment tribunal award for unfair dismissal in the UK is <strong>£7,564</strong> (mean award: <strong>£13,541</strong>), according to annual Ministry of Justice statistics. The statutory compensatory award cap is <strong>£123,543</strong> under the Employment Rights (Increase of Limits) Order 2026. For discrimination and whistleblowing claims, compensation is uncapped, with medians ranging from <strong>£13,842 to £16,400</strong>, supplemented by the 2026 Vento bands for injury to feelings.
            </p>
          </div>
        </section>

        {/* Answer-First Key Figures Callout */}
        <section className="py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Summary
                </span>
                <span className="text-xs font-mono text-muted">
                  MoJ Annual Returns &amp; ERA 1996
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-ink mb-2">
                Key Employment Tribunal Figures at a Glance (2026/27)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-rule text-xs">
                <div className="p-3 rounded bg-paper flex flex-col justify-between">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Unfair Dismissal Median</span>
                  <span className="font-bold text-ink text-lg font-serif mt-1">£7,564</span>
                  <span className="text-muted text-[11px] mt-0.5">Mean: £13,541 (MoJ Table E.1)</span>
                </div>
                <div className="p-3 rounded bg-paper flex flex-col justify-between">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Unfair Dismissal Cap</span>
                  <span className="font-bold text-ink text-lg font-serif mt-1">£123,543</span>
                  <span className="text-muted text-[11px] mt-0.5">Or 52 wks’ pay (ERA 1996 s.124)</span>
                </div>
                <div className="p-3 rounded bg-paper flex flex-col justify-between">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Cap</span>
                  <span className="font-bold text-ink text-lg font-serif mt-1">£751 / week</span>
                  <span className="text-muted text-[11px] mt-0.5">Max basic award: £22,530</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
            {/* Table 1: Ministry of Justice Tribunal Award Statistics by Jurisdiction */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-coral font-semibold block mb-1">
                  Official HMCTS Precedents
                </span>
                <h2 className="text-2xl font-serif font-bold text-ink">
                  Employment Tribunal Compensation Tables (Ministry of Justice)
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  The table below presents the official median and mean compensatory awards across primary employment tribunal jurisdictions published in the Ministry of Justice Employment Tribunal Annual Statistics, alongside statutory caps under the Employment Rights Act 1996 and Equality Act 2010.
                </p>
              </div>

              <div className="overflow-x-auto border border-rule rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-paper border-b border-rule text-ink font-semibold">
                    <tr>
                      <th className="p-3.5 sm:p-4">Jurisdiction / Claim Type</th>
                      <th className="p-3.5 sm:p-4 font-mono">Median Award</th>
                      <th className="p-3.5 sm:p-4 font-mono">Mean Award</th>
                      <th className="p-3.5 sm:p-4">Statutory Cap</th>
                      <th className="p-3.5 sm:p-4">Governing Legislation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-ink">
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Unfair Dismissal (Standard)</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£7,564</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£13,541</td>
                      <td className="p-3.5 sm:p-4">£123,543 (or 52 wks)</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">ERA 1996 s.124</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Disability Discrimination</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£16,109</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£32,860</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-coral">Uncapped</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">EqA 2010 s.124</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Sex Discrimination / Harassment</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£15,833</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£29,450</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-coral">Uncapped</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">EqA 2010 s.124</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Sexual Orientation Discrimination</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£16,400</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£28,200</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-coral">Uncapped</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">EqA 2010 s.124</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Age Discrimination</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£14,642</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£25,120</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-coral">Uncapped</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">EqA 2010 s.124</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Race Discrimination</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£13,842</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£26,910</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-coral">Uncapped</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">EqA 2010 s.124</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Constructive Dismissal</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£8,940</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£15,820</td>
                      <td className="p-3.5 sm:p-4">£123,543 (or 52 wks)</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">ERA 1996 s.95(1)(c)</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Redundancy Consultation Failure</td>
                      <td className="p-3.5 sm:p-4 font-mono font-bold">£8,120</td>
                      <td className="p-3.5 sm:p-4 font-mono text-muted">£14,250</td>
                      <td className="p-3.5 sm:p-4">90 days’ gross pay</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">TULRCA 1992 s.189</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-2 mt-2 font-mono">
                Source: Ministry of Justice Employment Tribunal Statistics Table E.1 (Annual Series). Statutory limits reflect SI 2026/310 (effective 6 April 2026).
              </p>
            </div>

            {/* Vento Bands 2026/27 */}
            <div className="bg-white border border-rule rounded-xl p-6 sm:p-8 shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-coral font-semibold block mb-1">
                Presidential Guidance Rates
              </span>
              <h2 className="text-2xl font-serif font-bold text-ink mb-3">
                Vento Bands 2026/27: Compensation for Injury to Feelings
              </h2>
              <p className="text-sm text-muted leading-relaxed mb-6">
                In claims involving unlawful discrimination, harassment, victimisation, or whistleblowing detriment, tribunals award an additional sum for injury to feelings under the landmark <em>Vento v Chief Constable of West Yorkshire Police</em> guidelines. These bands are uprated annually in line with the RPI all items index.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-paper border border-rule">
                  <span className="text-xs font-mono uppercase font-bold text-muted block mb-1">Lower Band</span>
                  <span className="text-xl font-bold text-ink font-serif block mb-2">£1,200 to £12,000</span>
                  <p className="text-xs text-muted leading-relaxed m-0">
                    Appropriate for isolated, one-off discriminatory remarks or minor unlawful detriments with limited long-term impact on wellbeing.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-paper border border-rule">
                  <span className="text-xs font-mono uppercase font-bold text-muted block mb-1">Middle Band</span>
                  <span className="text-xl font-bold text-ink font-serif block mb-2">£12,000 to £36,000</span>
                  <p className="text-xs text-muted leading-relaxed m-0">
                    Applied to serious, recurring discriminatory conduct, discriminatory dismissals, or persistent failure to implement reasonable adjustments.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-paper border border-rule">
                  <span className="text-xs font-mono uppercase font-bold text-muted block mb-1">Upper Band</span>
                  <span className="text-xl font-bold text-ink font-serif block mb-2">£36,000 to £60,000+</span>
                  <p className="text-xs text-muted leading-relaxed m-0">
                    Reserved for the most egregious, prolonged campaigns of discriminatory bullying, sexual harassment, or career-ending victimisation. Exceptional cases exceed £60,000.
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Comparison: Tribunal Hearing vs Negotiated Settlement */}
            <div>
              <div className="mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-coral font-semibold block mb-1">
                  Tactical Decision Matrix
                </span>
                <h2 className="text-2xl font-serif font-bold text-ink">
                  Employment Tribunal vs Settlement Agreement: Key Differences
                </h2>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  While headline tribunal judgments can sound high, actual net returns from an employment tribunal hearing are frequently lower than a well-negotiated settlement agreement when factoring in time, legal costs, tax treatment, and mitigation rules.
                </p>
              </div>

              <div className="overflow-x-auto border border-rule rounded-xl bg-white shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-paper border-b border-rule text-ink font-semibold">
                    <tr>
                      <th className="p-3.5 sm:p-4">Factor</th>
                      <th className="p-3.5 sm:p-4 text-crimson">Employment Tribunal Hearing</th>
                      <th className="p-3.5 sm:p-4 text-ink font-semibold">Negotiated Settlement Agreement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-ink">
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Resolution Timeline</td>
                      <td className="p-3.5 sm:p-4 text-muted">12 to 18+ months of litigation</td>
                      <td className="p-3.5 sm:p-4 font-semibold">10 to 21 days standard</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Employee Legal Costs</td>
                      <td className="p-3.5 sm:p-4 text-crimson">£5,000 – £15,000+ (rarely recoverable)</td>
                      <td className="p-3.5 sm:p-4 font-semibold text-coral font-mono">
                        £0 (Employer pays £500–£1,000+ VAT under ERA s.203)
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Tax Exemption</td>
                      <td className="p-3.5 sm:p-4 text-muted">Earnings awards subject to income tax &amp; NIC</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        First £30,000 tax-free (ITEPA 2003 s.403)
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Job Reference</td>
                      <td className="p-3.5 sm:p-4 text-muted">Tribunals cannot order references</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Agreed standard or positive reference attached to contract
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Public Disclosure</td>
                      <td className="p-3.5 sm:p-4 text-muted">Hearings are public; judgments indexed online</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Strict mutual confidentiality and non-derogatory clauses
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Mitigation Deduction</td>
                      <td className="p-3.5 sm:p-4 text-muted">
                        Awards reduced pound-for-pound by new earnings
                      </td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Lump sum retained regardless of immediate re-employment
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* High-Intent Conversion Card */}
            <div className="bg-ink text-paper rounded-xl p-6 sm:p-8 shadow-md">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs font-mono uppercase tracking-wider text-coral font-semibold block">
                  Interactive Settlement Assessment • 100% Free
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  Compare Your Employer&apos;s Offer Against Official MoJ Benchmarks
                </h3>
                <p className="text-sm text-paper opacity-90 leading-relaxed">
                  Use our free UK settlement calculator to determine your statutory floor, view MoJ tribunal medians for your role, and check whether your exit offer is fair under 2026 employment rates.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-3">
                  <Link
                    href="/calculator/"
                    className="inline-flex justify-center items-center px-6 py-3.5 bg-coral hover:bg-coral-ink text-white font-semibold rounded-lg text-sm transition-colors text-center shadow-sm"
                  >
                    Calculate My Settlement Range →
                  </Link>
                  <Link
                    href="/settlement-agreement-review/"
                    className="inline-flex justify-center items-center px-5 py-3.5 bg-transparent border border-paper text-white hover:bg-white hover:text-ink font-medium rounded-lg text-sm transition-colors text-center"
                  >
                    Check Draft Agreement Clauses
                  </Link>
                </div>
              </div>
            </div>

            {/* FAQ Accordion Section */}
            <div className="bg-white border border-rule rounded-xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-serif font-bold text-ink mb-4">
                Frequently Asked Questions: Employment Tribunal Awards
              </h2>
              <FaqAccordion faqs={FAQS} />
            </div>

            {/* Solicitor Matching Reassurance Footer */}
            <div className="border-t border-rule pt-6 text-center text-xs text-muted space-y-2">
              <p className="m-0">
                SettlementCheck is an independent UK intake platform. By law (ERA 1996 s.203), settlement agreements require independent sign-off by an SRA-regulated solicitor. Your employer contributes towards these fees directly.
              </p>
              <div className="flex justify-center gap-4 text-xs font-mono">
                <Link href="/how-it-works/" className="text-ink hover:text-coral underline">
                  How Solicitor Matching Works
                </Link>
                <span>•</span>
                <Link href="/get-matched/" className="text-ink hover:text-coral underline">
                  Match with an SRA Solicitor
                </Link>
                <span>•</span>
                <Link href="/privacy/" className="text-ink hover:text-coral underline">
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
