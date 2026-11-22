import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Redundancy & Settlement Agreements UK | SettlementCheck',
  },
  description:
    'Compare redundancy vs settlement agreements under April 2026 rates (£751/wk cap, £30k tax exemption). Check your legal rights and severance payout now.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/redundancy-vs-settlement-agreement/',
  },
  openGraph: {
    title: 'Redundancy & Settlement Agreements UK | SettlementCheck',
    description:
      'Compare redundancy vs settlement agreements under April 2026 rates (£751/wk cap, £30k tax exemption). Check your legal rights and severance payout now.',
    url: 'https://settlementcheck.co.uk/guides/redundancy-vs-settlement-agreement/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redundancy & Settlement Agreements UK | SettlementCheck',
    description:
      'Compare redundancy vs settlement agreements under April 2026 rates (£751/wk cap, £30k tax exemption). Check your legal rights and severance payout now.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/redundancy-vs-settlement-agreement/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'Can an employer force me to sign a settlement agreement instead of redundancy?',
    a: 'No. An employer cannot compel you to sign a settlement agreement. If you decline, your employer must follow a fair statutory redundancy process under Section 135 of the Employment Rights Act 1996, including objective selection scoring and consultation.',
  },
  {
    q: 'Why do employers propose settlement agreements during redundancy consultations?',
    a: 'Employers offer settlement agreements to reduce tribunal risk and speed up the exit. Formal redundancy processes require consultation periods (up to 45 days for collective redundancies under TULRCA 1992 s.188). A signed agreement gives the employer certainty through a binding statutory waiver.',
  },
  {
    q: 'How do settlement offers compare to statutory redundancy pay?',
    a: 'A commercial settlement offer typically exceeds calculated statutory redundancy pay and contractual notice pay (subject to eligibility). Because signing waives your right to bring employment tribunal claims, offers often include an ex-gratia sum. Observed commercial ranges sit around 1 to 3 months gross salary as an illustrative starting point, though this is not a statutory entitlement.',
  },
  {
    q: 'How is statutory redundancy pay calculated in 2026?',
    a: 'Under Section 162 ERA 1996, statutory redundancy is based on completed years of service (capped at 20 years) and the April 2026 weekly pay cap of £751 under SI 2026/310 (£783 in Northern Ireland). Multipliers are 0.5 week per year under age 22, 1.0 week aged 22 to 40, and 1.5 weeks aged 41 and over.',
  },
  {
    q: 'Who pays the legal fees when reviewing a redundancy settlement agreement?',
    a: 'To make a settlement agreement binding under Section 203(3) ERA 1996, you must receive independent legal advice from an SRA-regulated solicitor. Employers standardly offer a capped fee contribution (typically £350 to £500+ plus VAT) paid directly to your solicitor upon completion. Any excess or abortive work is subject to your solicitor engagement terms.',
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
  headline: 'Redundancy vs Settlement Agreement UK: Rules, Multipliers & Exit Rights for 2026',
  url: 'https://settlementcheck.co.uk/guides/redundancy-vs-settlement-agreement/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-11-04',
  dateModified: '2026-11-04',
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
      url: 'https://settlementcheck.co.uk/og-image.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/redundancy-vs-settlement-agreement/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 135',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/135',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 162',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/162',
    },
    {
      '@type': 'Legislation',
      name: 'Trade Union and Labour Relations (Consolidation) Act 1992, Section 188',
      url: 'https://www.legislation.gov.uk/ukpga/1992/52/section/188',
    },
  ],
}

export default function RedundancyVsSettlementGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Redundancy vs Settlement</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Redundancy vs Settlement Agreement in the UK
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 s.162 &amp; TULRCA 1992 s.188
            </p>
            <p className="sc-lead leading-relaxed">
              Facing a restructure or handed a draft settlement agreement instead of formal redundancy? Check your calculated statutory baseline in 60 seconds with no email required. See how statutory redundancy, notice pay, and ex-gratia compensation compare before you discuss the terms with an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Calculator immediately below Hero */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your settlement offer compare to statutory redundancy?"
                subtitle="Calculate your statutory redundancy baseline (£751/week cap) alongside typical 1 to 3 months gross commercial ranges."
                disputeType="redundancy"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Tax-Free Limit', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={48000}
                initialYears={6}
                initialAge={42}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Statutory Quick Answer Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Calculated Statutory Baseline
                </span>
              </div>
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-2">
                What is the minimum a redundancy settlement covers?
              </h2>
              <p className="text-[14px] text-ink mb-4 leading-relaxed">
                A commercial settlement agreement typically exceeds your <strong>Statutory Redundancy Pay (capped at £751/week, subject to eligibility under ERA 1996 s.141)</strong> and <strong>contractual notice pay</strong>. Signing waives your right to bring tribunal claims under Section 203(3) ERA 1996. Because of that waiver, offers often include an <strong>ex-gratia sum</strong> (observed commercially at 1 to 3 months gross salary as an illustrative starting point, not a statutory entitlement).
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Cap</span>
                  <span className="font-bold text-ink text-sm">£751 (GB) / £783 (NI)</span>
                  <span className="text-muted text-[11px]">April 2026 statutory rates</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Maximum Redundancy</span>
                  <span className="font-bold text-ink text-sm">£22,530</span>
                  <span className="text-muted text-[11px]">20 years &times; 1.5 weekly cap</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Notice Pay (PILON)</span>
                  <span className="font-bold text-ink text-sm">Contractual or Statutory</span>
                  <span className="text-muted text-[11px]">Taxed as wages under PENP rules</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Commercial Starting Range</span>
                  <span className="font-bold text-ink text-sm">1 to 3 Months Salary</span>
                  <span className="text-muted text-[11px]">Illustrative ex-gratia benchmark (tax-free under s.403)</span>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Why do employers offer settlement agreements during redundancy?</h2>
              <p className="guide-body">
                Running a genuine redundancy consultation takes time and management resource. Under <strong>Section 188 of TULRCA 1992</strong>, collective redundancies of 20 or more staff require at least 30 days of consultation (45 days for 100+ employees).
              </p>
              <p className="guide-body">
                Even in individual redundancies, employers face employment tribunal risk if selection scoring is subjective. Under April 2026 rates (SI 2026/310), the compensatory cap for ordinary unfair dismissal is £123,543 (or 52 weeks gross pay, whichever is lower). You can model that exposure in our{' '}
                <Link href="/unfair-dismissal-calculator/" className="text-coral underline hover:text-ink transition-colors font-medium">
                  unfair dismissal calculator
                </Link>
                .
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Formal Redundancy</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Employer must follow consultation and objective scoring.</li>
                    <li>You keep your right to bring an unfair dismissal claim.</li>
                    <li>Pays statutory redundancy and contractual notice or garden leave.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Settlement Agreement</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Ends employment by mutual agreement on an agreed date.</li>
                    <li>Includes a binding waiver of tribunal claims under s.203(3).</li>
                    <li>Often adds an ex-gratia sum, reference wording, and non-compete terms.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. How does a settlement offer compare to your statutory baseline?</h2>
              <p className="guide-body">
                Where qualifying criteria are met under Section 135 ERA 1996 (and no forfeiture applies under Section 141 for unreasonably refusing suitable alternative employment), statutory redundancy is your calculated statutory baseline. Contractual notice, holiday pay, and any period on garden leave are taxed as wages.
              </p>
              <p className="guide-body">
                Check your statutory figure first with our{' '}
                <Link href="/redundancy-calculator/" className="text-coral underline hover:text-ink transition-colors font-medium">
                  redundancy pay calculator
                </Link>
                , then review your full package on our{' '}
                <Link href="/calculator/" className="text-coral underline hover:text-ink transition-colors font-medium">
                  settlement agreement calculator
                </Link>
                . An independent solicitor can also check any non-compete or confidentiality clauses in the draft.
              </p>
              <div className="rounded-xl border border-rule bg-paper p-5 my-6">
                <p className="text-sm font-bold text-coral uppercase tracking-wider mb-2">Typical Commercial Package Structure:</p>
                <p className="text-base font-semibold text-ink leading-snug">
                  Total Package = Statutory Redundancy Pay + Notice Pay (or Garden Leave) + Ex-Gratia Sum (Illustrative 1 to 3 Months Gross)
                </p>
                <p className="text-[14px] text-muted mt-2 leading-relaxed">
                  Without an ex-gratia sum above your calculated statutory baseline, you are waiving tribunal rights for no additional financial compensation.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. Worked example: redundancy vs settlement package</h2>
              <p className="guide-body">
                Illustrative comparison for an Operations Manager (age 45, 8 completed years of service, £48,000 annual salary, 8 weeks notice):
              </p>

              <div className="rounded-xl border border-rule overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-4 py-3 font-medium">Element</th>
                      <th className="text-left px-4 py-3 font-medium">Standard Statutory Redundancy</th>
                      <th className="text-left px-4 py-3 font-medium">Illustrative Settlement Offer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule bg-white">
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Statutory Redundancy Pay</td>
                      <td className="px-4 py-3 text-ink">£7,510.00 (tax-free)</td>
                      <td className="px-4 py-3 text-ink">£7,510.00 (tax-free)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Notice Pay (8 Weeks)</td>
                      <td className="px-4 py-3 text-ink">£7,384.62 (taxed as wages)</td>
                      <td className="px-4 py-3 text-ink">£7,384.62 (taxed as wages)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Ex-Gratia Compensation</td>
                      <td className="px-4 py-3 text-muted">£0.00</td>
                      <td className="px-4 py-3 font-semibold text-coral">£12,000.00 (3 months salary, tax-free)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Tribunal Waiver Required</td>
                      <td className="px-4 py-3 text-ink">No (can claim unfair dismissal)</td>
                      <td className="px-4 py-3 text-ink">Yes (Section 203(3) waiver)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Legal Fees Contribution</td>
                      <td className="px-4 py-3 text-muted">£0.00</td>
                      <td className="px-4 py-3 font-semibold text-ink">£500.00 + VAT (capped contribution upon completion)</td>
                    </tr>
                    <tr className="bg-paper font-bold">
                      <td className="px-4 py-3 text-ink">TOTAL GROSS PACKAGE</td>
                      <td className="px-4 py-3 text-ink">£14,894.62</td>
                      <td className="px-4 py-3 text-coral">£26,894.62 (+£12,000 uplift)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Regulatory Disclaimers */}
            <div className="bg-paper border border-rule rounded-xl p-5 text-[14px] text-muted leading-relaxed">
              <p>
                <strong>Statutory Rates &amp; Legal Advice Notice:</strong> Statutory redundancy limits reflect the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310). SettlementCheck is an independent technology platform and introducer, not a law firm. Independent legal advice under Section 203(3) ERA 1996 is mandatory to validate a settlement agreement, with fees typically supported by a capped employer contribution (£350 to £500+ plus VAT) paid directly to your solicitor upon completion.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Compare your calculated statutory baseline against your employer&apos;s settlement offer before speaking to a solicitor.
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

            {/* FAQ */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/redundancy-vs-settlement-agreement/" suppressSchema />
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/redundancy-calculator/',
                  title: 'Redundancy Pay Calculator',
                  description: 'Calculate your statutory baseline using the April 2026 £751 weekly pay cap.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Without prejudice rules, tax splits, and what to check with an independent solicitor.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax on Settlement Agreements: £30,000 Rule',
                  description: 'How ITEPA 2003 s.403 separates tax-free compensation from taxable notice pay.',
                  tag: 'Tax Rules',
                },
                {
                  href: '/guides/protective-award/',
                  title: 'Protective Award Claims (90-Day Rules)',
                  description: 'Collective consultation rights when 20 or more redundancies are proposed.',
                  tag: 'Redundancy',
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
