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
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Employment Tribunal Average Awards 2026 | SettlementCheck',
  description:
    'Official MoJ tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 cap, and how settlement offers compare.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/employment-tribunal-average-awards-uk/',
  },
  openGraph: {
    title: 'Employment Tribunal Average Awards 2026 | SettlementCheck',
    description:
      'Official MoJ tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 cap, and how settlement offers compare.',
    url: 'https://settlementcheck.co.uk/guides/employment-tribunal-average-awards-uk/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employment Tribunal Average Awards 2026 | SettlementCheck',
    description:
      'Official MoJ tribunal compensation tables 2026. Unfair dismissal (£7,564 median), discrimination, £123,543 cap, and how settlement offers compare.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/employment-tribunal-average-awards-uk/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'What is the average employment tribunal payout in the UK for unfair dismissal?',
    a: 'According to official Ministry of Justice tribunal statistics, the median unfair dismissal award in the UK is £7,564 and the mean award is £13,541. From 6 April 2026 under SI 2026/310, the statutory compensatory award is capped at £123,543 or 52 weeks of gross pay, whichever is lower.',
  },
  {
    q: 'Why can a settlement agreement differ from a tribunal award?',
    a: 'Tribunals only award proven financial loss after deducting earnings from a new job. In a settlement agreement, an employer pays an agreed ex-gratia sum to close off legal risk, management time, and public hearing costs. Notice pay and holiday pay remain taxed as wages, while up to £30,000 of genuine compensation is usually tax-free under ITEPA 2003 s.403.',
  },
  {
    q: 'What is the maximum compensation an employment tribunal can award in 2026?',
    a: 'For ordinary unfair dismissal, the compensatory cap is £123,543 alongside a basic award of up to £22,530 (20 years capped at £751 per week). Claims involving unlawful discrimination (Equality Act 2010) or whistleblowing (ERA 1996 s.103A) are uncapped. Statutory redundancy and basic award baselines still depend on qualifying service and not refusing suitable alternative work under ERA 1996 s.141.',
  },
  {
    q: 'How long does an employment tribunal claim take compared to a settlement?',
    a: 'HMCTS tribunal data shows full merit hearings typically take 12 to 18 months. For settlement agreements, Paragraph 12 of ACAS Code of Practice 4 recommends 10 calendar days as general guidance rather than a binding legal right. Under contract law (Hyde v Wrench), making a counter-proposal rejects the original offer, so speak to an independent solicitor before replying to HR to protect legal privilege.',
  },
  {
    q: 'Who pays the legal fees and how are awards taxed?',
    a: 'In a tribunal, legal costs are rarely recoverable. For a settlement agreement, employers standardly offer a capped fee contribution (typically £350 to £500+ plus VAT) upon completion, with excess or abortive work subject to your solicitor engagement terms. Tribunal awards for lost earnings are taxable, whereas up to £30,000 of genuine termination compensation under a settlement agreement is usually tax-free under ITEPA 2003 s.403.',
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
  dateModified: '2026-11-22',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
      <Nav />

      <main className="bg-paper-2 min-h-screen">
        {/* Hero Section */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Tribunal Compensation Tables</span>
            </div>

            <h1 className="sc-h1 mb-4">
              Average Employment Tribunal Awards UK 2026: Official Compensation Tables
            </h1>

            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Citing MoJ Tribunal Statistics &amp; SI 2026/310
            </p>

            <p className="sc-lead leading-relaxed">
              Comparing a draft settlement offer against what an employment tribunal might award? Headline tribunal figures rarely tell the full story once time, tax, and legal costs are factored in. Check your April 2026 statutory baseline in 60 seconds with no email required, and see how official Ministry of Justice medians compare.
            </p>
          </div>
        </section>

        {/* Embedded Calculator Card immediately below hero */}
        <section className="bg-card pt-10 pb-4">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to tribunal benchmarks?"
              subtitle="Compare your employer's offer against your calculated statutory baseline and official 2026 tribunal limits."
              disputeType="negotiation"
              statutoryPills={[
                { label: 'Unfair Dismissal Median', value: '£7,564', statute: 'MoJ Table E.1' },
                { label: 'Compensatory Cap', value: '£123,543', statute: 'SI 2026/310' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={50000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Answer-First Key Figures Callout */}
        <section className="bg-card py-8">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-paper-2 border border-rule rounded-xl p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold tracking-wider uppercase text-coral">
                  Statutory Quick Summary
                </span>
                <span className="text-xs font-mono text-muted">
                  MoJ Annual Returns &amp; ERA 1996
                </span>
              </div>
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-3">
                Key Employment Tribunal Figures at a Glance (2026/27)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-rule text-xs">
                <div className="p-3 rounded-lg bg-white border border-rule flex flex-col justify-between">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Unfair Dismissal Median</span>
                  <span className="font-bold text-ink text-lg font-serif mt-1">£7,564</span>
                  <span className="text-muted text-[11px] mt-0.5">Mean: £13,541 (MoJ Table E.1)</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-rule flex flex-col justify-between">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Unfair Dismissal Cap</span>
                  <span className="font-bold text-ink text-lg font-serif mt-1">£123,543</span>
                  <span className="text-muted text-[11px] mt-0.5">Or 52 wks&apos; pay (ERA 1996 s.124)</span>
                </div>
                <div className="p-3 rounded-lg bg-white border border-rule flex flex-col justify-between">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Cap</span>
                  <span className="font-bold text-ink text-lg font-serif mt-1">£751 / week</span>
                  <span className="text-muted text-[11px] mt-0.5">Max basic award: £22,530</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Body */}
        <section className="bg-card pb-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">
            {/* Table 1: Ministry of Justice Tribunal Award Statistics by Jurisdiction */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                1. What do UK employment tribunals actually award in 2026?
              </h2>
              <p className="guide-body">
                The table below shows official median and mean awards from the Ministry of Justice Employment Tribunal Annual Statistics. Statutory caps reflect April 2026 limits under the Employment Rights Act 1996 and Equality Act 2010.
              </p>

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
                      <td className="p-3.5 sm:p-4">90 days&apos; gross pay</td>
                      <td className="p-3.5 sm:p-4 text-xs font-mono text-muted">TULRCA 1992 s.189</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[14px] text-muted">
                Source: Ministry of Justice Employment Tribunal Statistics Table E.1 (Annual Series). Statutory limits reflect SI 2026/310 (effective 6 April 2026).
              </p>
            </div>

            {/* Vento Bands 2026/27 */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                2. What are the 2026/27 Vento bands for injury to feelings?
              </h2>
              <p className="guide-body">
                In discrimination, harassment, or whistleblowing detriment claims, tribunals can award an extra sum for injury to feelings. These Vento bands are uprated each April in line with the RPI index.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-xs font-mono uppercase font-bold text-muted block mb-1">Lower Band</span>
                  <span className="text-xl font-bold text-ink font-serif block mb-2">£1,300 to £12,600</span>
                  <p className="text-[14px] text-muted leading-relaxed m-0">
                    Used for isolated, one-off discriminatory remarks or minor unlawful detriments with limited impact.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-xs font-mono uppercase font-bold text-muted block mb-1">Middle Band</span>
                  <span className="text-xl font-bold text-ink font-serif block mb-2">£12,600 to £37,700</span>
                  <p className="text-[14px] text-muted leading-relaxed m-0">
                    Applied to serious, recurring discriminatory conduct, discriminatory dismissals, or failure to make adjustments.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-xs font-mono uppercase font-bold text-muted block mb-1">Upper Band</span>
                  <span className="text-xl font-bold text-ink font-serif block mb-2">£37,700 to £62,900+</span>
                  <p className="text-[14px] text-muted leading-relaxed m-0">
                    Reserved for prolonged campaigns of discriminatory bullying, harassment, or career-ending victimisation.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparison: Tribunal Hearing vs Negotiated Settlement */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                3. How does a tribunal claim compare to a settlement agreement?
              </h2>
              <p className="guide-body">
                Headline tribunal awards can look higher on paper than an opening settlement figure. Once you factor in timelines, legal fees, mitigation rules, and tax, the net outcome often looks very different.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">Employment Tribunal Hearing</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Typically takes 12 to 18+ months to reach a full hearing.</li>
                    <li>Legal costs (£5,000 to £15,000+) are rarely recoverable.</li>
                    <li>Lost earnings awards are reduced pound-for-pound by new job income.</li>
                    <li>Hearings are public and judgments are indexed online.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">Settlement Agreement</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Concluded in days or weeks; ACAS Code 4 suggests 10 calendar days as guidance.</li>
                    <li>Employers standardly contribute £350 to £500+ plus VAT upon completion.</li>
                    <li>First £30,000 of genuine compensation is usually tax-free (ITEPA 2003 s.403).</li>
                    <li>Can include an agreed job reference, garden leave terms, and shorter non-compete clauses.</li>
                  </ul>
                </div>
              </div>

              <div className="overflow-x-auto border border-rule rounded-xl bg-white shadow-sm mt-4">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-paper border-b border-rule text-ink font-semibold">
                    <tr>
                      <th className="p-3.5 sm:p-4">Factor</th>
                      <th className="p-3.5 sm:p-4 text-crimson">Employment Tribunal Hearing</th>
                      <th className="p-3.5 sm:p-4 text-ink font-semibold">Settlement Agreement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-ink">
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Resolution Timeline</td>
                      <td className="p-3.5 sm:p-4 text-muted">12 to 18+ months of litigation</td>
                      <td className="p-3.5 sm:p-4 font-semibold">Typically 10 to 21 days</td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Employee Legal Costs</td>
                      <td className="p-3.5 sm:p-4 text-crimson">£5,000 to £15,000+ (rarely recoverable)</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Capped contribution (£350 to £500+ plus VAT upon completion; extra or abortive work subject to solicitor terms)
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Tax Treatment</td>
                      <td className="p-3.5 sm:p-4 text-muted">Earnings awards taxed as wages</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        First £30,000 tax-free (ITEPA 2003 s.403); notice &amp; holiday taxed as wages
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Job Reference</td>
                      <td className="p-3.5 sm:p-4 text-muted">Tribunals cannot order references</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Agreed reference attached to the contract
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Public Disclosure</td>
                      <td className="p-3.5 sm:p-4 text-muted">Hearings are public; judgments indexed online</td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Mutual confidentiality and non-derogatory clauses
                      </td>
                    </tr>
                    <tr className="hover:bg-paper/50">
                      <td className="p-3.5 sm:p-4 font-medium">Mitigation Deduction</td>
                      <td className="p-3.5 sm:p-4 text-muted">
                        Awards reduced pound-for-pound by new earnings
                      </td>
                      <td className="p-3.5 sm:p-4 font-semibold">
                        Lump sum retained regardless of new employment
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Legal Rules & Adversarial Invariants */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                4. What should you check before comparing an offer to tribunal awards?
              </h2>
              <p className="guide-body">
                Before using tribunal medians in a discussion with HR, keep five legal rules in mind. Each affects what is protected and what you are entitled to receive.
              </p>

              <div className="space-y-3">
                <div className="border border-rule rounded-lg p-5 bg-white">
                  <h3 className="text-base font-semibold text-ink mb-1">1. Section 111A confidentiality has limits</h3>
                  <p className="guide-body">
                    Pre-termination discussions under Section 111A ERA 1996 are only confidential for ordinary unfair dismissal claims. They do not protect discrimination, whistleblowing, or breach of contract claims.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-white">
                  <h3 className="text-base font-semibold text-ink mb-1">2. ACAS 10-day guidance is not a binding right</h3>
                  <p className="guide-body">
                    Paragraph 12 of ACAS Code of Practice 4 recommends 10 calendar days to consider a written offer. This is guidance rather than a strict legal right, and employers can set shorter deadlines under contract law (Routledge v Grant).
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-white">
                  <h3 className="text-base font-semibold text-ink mb-1">3. Counter-offers can revoke the original offer</h3>
                  <p className="guide-body">
                    Under English contract law (Hyde v Wrench), making a counter-proposal legally rejects the original offer. An employer can withdraw an unaccepted offer before anything is signed.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-white">
                  <h3 className="text-base font-semibold text-ink mb-1">4. Protect legal privilege before replying</h3>
                  <p className="guide-body">
                    Sending written counter-proposals directly to HR can waive legal privilege. Speak with an independent SRA-regulated solicitor before sending any formal response.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-white">
                  <h3 className="text-base font-semibold text-ink mb-1">5. Statutory baselines require eligibility (ERA 1996 s.141)</h3>
                  <p className="guide-body">
                    A calculated statutory baseline applies only if you meet qualifying continuous service rules, have no gross misconduct finding, and have not refused suitable alternative work under Section 141 ERA 1996.
                  </p>
                </div>
              </div>
            </div>

            {/* High-Intent Conversion Card */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Compare your offer against April 2026 benchmarks
              </h2>
              <p className="text-white/75 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and how your exit offer compares to official 2026 tribunal limits.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/calculator/" className="btn-accent">
                  Check my offer now →
                </Link>
                <Link href="/redundancy-calculator/" className="btn-secondary">
                  Calculate my redundancy →
                </Link>
              </div>
              <p className="text-white/65 text-[12px] mt-4 max-w-lg mx-auto leading-relaxed">
                Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion (excess or abortive work subject to solicitor engagement terms)
              </p>
            </div>

            {/* FAQ Accordion Section */}
            <div className="space-y-4 pt-4">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/employment-tribunal-average-awards-uk/" />
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related Guides & Calculations"
              items={[
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Without prejudice rules, tax splits, and how to prepare figures for an independent solicitor.',
                  tag: 'Discussion',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Compare your settlement offer against commercial UK ranges and statutory baselines.',
                  tag: 'Valuation',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax on Settlements: The £30,000 Rule',
                  description: 'How the £30,000 tax exemption works under ITEPA 2003 Section 403.',
                  tag: 'Tax',
                },
                {
                  href: '/guides/redundancy-pay-cap-2026/',
                  title: 'Redundancy Pay Cap 2026',
                  description: 'The weekly pay cap is £751 from April 2026. Check your statutory baseline.',
                  tag: 'Redundancy',
                },
                {
                  href: '/guides/acas-statutory-timeline/',
                  title: 'ACAS Statutory Timeline & 10-Day Rule',
                  description: 'Check ACAS Code 4 10-calendar-day guidance and 3-month tribunal limitation deadlines.',
                  tag: 'Deadlines',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'Contract law rules under Hyde v Wrench, ACAS 10-day guidance, and offer revocation risks.',
                  tag: 'Offer Protection',
                },
              ]}
            />

            {/* Disclaimer & Statutory References */}
            <div className="border-t border-rule pt-6 text-xs text-muted space-y-3 leading-relaxed">
              <p className="m-0">
                <strong>Disclaimer:</strong> SettlementCheck is an independent introduction service and informational resource. We are not a law firm and do not provide legal advice. Under Section 203(3) ERA 1996, settlement agreements require independent advice from an insured adviser such as an SRA-regulated solicitor.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-xs font-mono pt-2">
                <Link href="/how-it-works/" className="text-ink hover:text-coral underline">
                  How Solicitor Matching Works
                </Link>
                <span>·</span>
                <Link href="/get-matched/" className="text-ink hover:text-coral underline">
                  Match with an SRA Solicitor
                </Link>
                <span>·</span>
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
