import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Redundancy vs Settlement Agreement UK | 2026 Exit Guide',
  description:
    'Redundancy vs settlement agreement UK guide. Compare statutory redundancy pay (£751 cap) against settlement offers, notice pay, and severance premiums.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/redundancy-vs-settlement-agreement/',
  },
  openGraph: {
    title: 'Redundancy vs Settlement Agreement UK | 2026 Exit Guide',
    description:
      'Redundancy vs settlement agreement UK guide. Compare statutory redundancy pay (£751 cap) against settlement offers, notice pay, and severance premiums.',
    url: 'https://settlementcheck.co.uk/guides/redundancy-vs-settlement-agreement/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redundancy vs Settlement Agreement UK | 2026 Exit Guide',
    description:
      'Redundancy vs settlement agreement UK guide. Compare statutory redundancy pay (£751 cap) against settlement offers, notice pay, and severance premiums.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/redundancy-vs-settlement-agreement/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'Can an employer force me to sign a settlement agreement instead of redundancy?',
    a: 'No. An employer cannot compel you to sign a settlement agreement. If you decline, your employer must proceed through a fair statutory redundancy process under Section 135 of the Employment Rights Act 1996, including objective selection scoring and individual or collective consultation.',
  },
  {
    q: 'Why do employers propose settlement agreements during redundancy consultations?',
    a: 'Employers offer settlement agreements to eliminate legal risk and fast-track the exit. Redundancy processes require extensive consultation periods (up to 45 days for collective redundancies under TULRCA 1992 s.188) and expose employers to unfair dismissal or discrimination claims. A settlement agreement gives the employer certainty through a clean statutory waiver.',
  },
  {
    q: 'How much higher should a settlement offer be than statutory redundancy pay?',
    a: 'A fair settlement offer must never be less than your statutory redundancy pay plus your full contractual notice pay. Because signing a settlement agreement waives your right to claim unfair dismissal or challenge selection scoring, a customary settlement package includes an ex-gratia compensation premium of 1 to 3 months gross salary on top of statutory minimums.',
  },
  {
    q: 'How is statutory redundancy pay calculated in 2026?',
    a: 'Under Section 162 ERA 1996, statutory redundancy is based on completed years of service (capped at 20 years), subject to the April 2026 weekly pay cap of £751 under SI 2026/310 (£783 in Northern Ireland). Multipliers are: 0.5 week per year under age 22, 1.0 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over.',
  },
  {
    q: 'Who pays the legal fees when reviewing a redundancy settlement agreement?',
    a: 'To make the settlement agreement legally binding under Section 203(3) ERA 1996, you must receive independent legal advice from an SRA-regulated solicitor. Under UK commercial practice, your employer provides a capped fee contribution (typically £350 to £500+ VAT) paid directly to your solicitor upon completion.',
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

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
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
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Redundancy vs Settlement</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Severance Strategy &amp; Rights</p>
            <h1 className="sc-h1 mb-5">
              Redundancy vs Settlement Agreement in the UK: Differences, Multipliers &amp; Payout Rights
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for April 2026 Rates (SI 2026/310)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Statutory Reference: ERA 1996 s.162</span>
            </div>
            <p className="sc-lead">
              When a company restructures, employers often offer a settlement agreement instead of going through a formal redundancy process. Understanding the difference between your statutory redundancy rights and a negotiated settlement offer is critical to ensuring you do not accept an undervalued package.
            </p>
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  The Golden Rule
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Statutory Redundancy Floor
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                What is the minimum amount a redundancy settlement agreement should pay?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                A settlement agreement should always pay more than statutory redundancy. At minimum, the offer must cover your <strong>Statutory Redundancy Pay (capped at £751/week)</strong> plus <strong>contractual notice pay</strong>, plus an <strong>ex-gratia premium</strong> (typically 1 to 3 months salary) to compensate you for waiving your legal rights under Section 203 ERA 1996.
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
                  <span className="text-muted text-[11px]">100% Taxable under PENP rules</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Customary Premium</span>
                  <span className="font-bold text-ink text-sm">1 to 3 Months Salary</span>
                  <span className="text-muted text-[11px]">Tax-free ex-gratia compensation</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Reactive Calculator Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="Redundancy Arbitrage Engine"
              title="Compare Your Redundancy Baseline Against Settlement Offers"
              subtitle="Calculate your exact statutory redundancy entitlement (£751/wk cap) to ensure your employer's settlement offer provides a real premium."
              disputeType="redundancy"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Limit', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                { label: 'Independent Advice', value: 'Employer Pays', statute: 'ERA 1996 s.203' },
              ]}
              initialSalary={48000}
              initialYears={6}
              initialAge={42}
              ctaText="Check My Redundancy vs Settlement Offer →"
            />
          </div>
        </section>

        {/* Section 1: Why Employers Propose Settlements */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">1. Why Employers Offer Settlement Agreements During Redundancy</h2>
            <p className="sc-body mb-4">
              Carrying out a genuine redundancy consultation requires significant time, administrative overhead, and management resources. Under <strong>Section 188 of TULRCA 1992</strong>, collective redundancies involving 20 or more staff require a minimum 30-day consultation period (45 days for 100+ employees).
            </p>
            <p className="sc-body mb-4">
              Even in individual redundancies, employers face substantial legal exposure if selection scoring matrices are subjective or inadvertently discriminate against employees on maternity leave, disability, or part-time contracts. Offering a settlement agreement provides the employer with an instant, irrevocable release of all tribunal claims.
            </p>
          </div>
        </section>

        {/* Section 2: The Tactical Premium Equation */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">2. The Settlement Premium Equation</h2>
            <p className="sc-body mb-4">
              An employee should never sign a settlement agreement that merely pays statutory redundancy and contractual notice. You are legally entitled to those payments anyway under Section 135 of the Employment Rights Act 1996.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 my-6">
              <p className="text-sm font-bold text-coral uppercase tracking-wider mb-2">The Minimum Commercial Settlement Benchmark:</p>
              <p className="text-base font-semibold text-ink leading-snug">
                Settlement Target = Statutory Redundancy Pay + Full Notice Pay + Ex-Gratia Premium (1 to 3 Months Salary)
              </p>
              <p className="text-xs text-muted mt-2 leading-relaxed">
                If the employer does not offer an ex-gratia premium, you are waiving your right to challenge unfair selection scoring for zero financial benefit.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Worked Case Study */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Case Study: Redundancy vs Settlement Valuation</h2>
            <p className="sc-body mb-6">
              Comparison for an Operations Manager (Age 45, 8 completed years of service, £48,000 annual salary, 8 weeks notice):
            </p>

            <div className="rounded-xl border border-rule overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Element</th>
                    <th className="text-left px-4 py-3 font-medium">Standard Statutory Redundancy</th>
                    <th className="text-left px-4 py-3 font-medium">Fair Settlement Offer (Target)</th>
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
                    <td className="px-4 py-3 text-ink">£7,384.62 (taxable)</td>
                    <td className="px-4 py-3 text-ink">£7,384.62 (taxable)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Ex-Gratia Premium</td>
                    <td className="px-4 py-3 text-muted">£0.00 (No premium)</td>
                    <td className="px-4 py-3 font-semibold text-coral">£12,000.00 (3 months salary, tax-free)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Tribunal Waiver Required</td>
                    <td className="px-4 py-3 text-ink">No (Can claim unfair dismissal)</td>
                    <td className="px-4 py-3 text-ink">Yes (Full Section 203 waiver)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Legal Fees Contribution</td>
                    <td className="px-4 py-3 text-muted">£0.00</td>
                    <td className="px-4 py-3 font-semibold text-ink">£500.00 + VAT (Paid by employer)</td>
                  </tr>
                  <tr className="bg-paper font-bold">
                    <td className="px-4 py-3 text-ink">TOTAL GROSS PACKAGE</td>
                    <td className="px-4 py-3 text-ink">£14,894.62</td>
                    <td className="px-4 py-3 text-coral">£26,894.62 (+£12,000 Uplift)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Regulatory Disclaimers */}
        <section className="py-8 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5 text-xs text-muted leading-relaxed">
            <p className="mb-2">
              <strong>Statutory Rates &amp; Legal Advice Notice:</strong> Statutory redundancy limits reflect the official Employment Rights (Increase of Limits) Order 2026 (SI 2026/310). SettlementCheck is an independent technology platform and introducer, not a law firm. Independent legal advice under Section 203(3) ERA 1996 is mandatory to validate a settlement agreement, with legal fees covered by standard employer contributions.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently Asked Questions: Redundancy &amp; Settlements</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        <DynamicFaqSection pathname="/guides/redundancy-vs-settlement-agreement/" suppressSchema />
      </main>
      <Footer />
    </>
  )
}
