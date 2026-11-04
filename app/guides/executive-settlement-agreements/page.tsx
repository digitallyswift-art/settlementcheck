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
  title: 'Executive Settlement Agreements UK | Senior Severance Guide 2026',
  description:
    'UK senior executive settlement agreement guide. Equity vesting, bad leaver clauses, restrictive covenant buyouts, D&O run-off cover, and 2026 exit standards.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
  },
  openGraph: {
    title: 'Executive Settlement Agreements UK | Senior Severance Guide 2026',
    description:
      'UK senior executive settlement agreement guide. Equity vesting, bad leaver clauses, restrictive covenant buyouts, D&O run-off cover, and 2026 exit standards.',
    url: 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Settlement Agreements UK | Senior Severance Guide 2026',
    description:
      'UK senior executive settlement agreement guide. Equity vesting, bad leaver clauses, restrictive covenant buyouts, D&O run-off cover, and 2026 exit standards.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/executive-settlement-agreements/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'How do executive settlement agreements differ from standard employee agreements?',
    a: 'Executive settlement agreements involve substantially higher financial packages, complex equity arrangements (unvested share options, RSUs, carried interest), statutory shareholder approval rules for loss of office under Section 217 of the Companies Act 2006, and extensive post-termination restrictive covenants. Employers also provide enhanced legal fee contributions (typically £750 to £2,500+ VAT) for senior director exits.',
  },
  {
    q: 'What happens to unvested share options or RSUs upon signing a settlement agreement?',
    a: 'Treatment depends on the scheme rules and the definition of Good Leaver versus Bad Leaver. A standard executive settlement negotiation frequently negotiates Good Leaver status to accelerate vesting, extend option exercise windows (often 6 to 12 months post-termination), or secure a cash buyout for forfeited equity value.',
  },
  {
    q: 'Can an executive settlement agreement waive future unknown claims?',
    a: 'Following the landmark Scottish Court of Session decision in Bathgate v Technip Singapore PTE Ltd [2023] CSIH 48, a Section 203 ERA waiver can settle unknown future statutory claims only if the wording is clear and unambiguous. However, blanket waivers attempting to exclude statutory whistleblowing rights under Section 43K ERA 1996 or regulatory reporting to the FCA/PRA are void as a matter of public policy.',
  },
  {
    q: 'What is D&O run-off insurance cover and why is it essential for departing directors?',
    a: 'Directors and Officers (D&O) run-off insurance provides liability protection for decisions made during your directorship. Because director liability under the Limitation Act 1980 extends up to 6 years (or 12 years under deed), senior executives must ensure their settlement agreement guarantees continuing coverage under the company\'s policy or a standalone 6-year run-off endorsement.',
  },
  {
    q: 'How much should an employer contribute towards an executive\'s legal fees?',
    a: 'While standard employment settlement legal fee contributions range from £350 to £500+ VAT, executive agreements routinely require contributions between £750 and £2,500+ VAT. For highly complex board-level departures involving equity and tax indemnities, contributions can exceed £5,000+ VAT, paid directly to your chosen SRA-regulated solicitor.',
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
  headline: 'Executive Settlement Agreements UK: Senior Director Severance & Exit Strategy Guide',
  url: 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
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
    '@id': 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Companies Act 2006, Section 217',
      url: 'https://www.legislation.gov.uk/ukpga/2006/46/section/217',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 43K',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/43K',
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

export default function ExecutiveSettlementAgreementsGuide() {
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
              <span className="text-xs text-ink truncate">Executive Settlement Agreements</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Senior Severance &amp; Governance</p>
            <h1 className="sc-h1 mb-5">
              Executive Settlement Agreements in the UK: Director Severance, Equity &amp; Exit Terms
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 Governance Standards</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Legal Review: Senior Employment Desk</span>
            </div>
            <p className="sc-lead">
              Senior executive and director exits involve complex corporate governance rules, equity share vesting, shareholder approval thresholds under the Companies Act 2006, and post-termination restrictive covenants. This guide covers how to negotiate high-value executive settlement agreements, protect deferred compensation, and structure tax-efficient severance.
            </p>
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Executive Governance Baseline
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Companies Act 2006 &amp; ERA 1996
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                What are the key legal requirements for a UK executive settlement agreement?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Under Section 217 of the Companies Act 2006, payments for loss of office to company directors require shareholder approval unless paid under a pre-existing legal obligation. To be legally binding under Section 203(3) ERA 1996, the director must receive independent legal advice from an SRA-regulated solicitor. The first £30,000 of qualifying non-contractual compensation is tax-free under ITEPA 2003 s.403.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Fee Benchmark</span>
                  <span className="font-bold text-ink text-sm">£750 to £2,500+ VAT</span>
                  <span className="text-muted text-[11px]">Employer pays direct under s.203 ERA</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax-Free Exemption</span>
                  <span className="font-bold text-ink text-sm">First £30,000</span>
                  <span className="text-muted text-[11px]">ITEPA 2003 s.403 (Excess at marginal rate)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">D&amp;O Run-Off Cover</span>
                  <span className="font-bold text-ink text-sm">6 Years Mandatory</span>
                  <span className="text-muted text-[11px]">Limitation Act 1980 director protection</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Shareholder Approval</span>
                  <span className="font-bold text-ink text-sm">Companies Act s.217</span>
                  <span className="text-muted text-[11px]">Loss of office payments over contractual entitlement</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Reactive Calculator Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="Executive Severance Engine"
              title="Calculate Your Executive Exit Settlement Baseline"
              subtitle="Model contractual notice, statutory redundancy floors (£751/wk cap), and negotiated ex-gratia compensation."
              disputeType="executive_severance"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Shield', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                { label: 'Legal Fee Standard', value: '£750–£2,500+ VAT', statute: 'Employer Pays' },
              ]}
              initialSalary={125000}
              initialYears={6}
              initialAge={46}
              ctaText="Check My Executive Exit Package →"
            />
          </div>
        </section>

        {/* Section 1: Companies Act 2006 Governance */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">1. Corporate Governance &amp; Loss of Office Rules</h2>
            <p className="sc-body mb-4">
              When negotiating an agreed exit for a statutory director, employment law intersects directly with corporate governance. Under <strong>Section 217 of the Companies Act 2006</strong>, a company cannot make a payment for loss of office to a director without prior shareholder approval by ordinary resolution.
            </p>
            <p className="sc-body mb-4">
              There is a critical statutory exception: shareholder approval is not required if the payment represents a genuine settlement of an existing legal claim or contractual entitlement (such as damages for wrongful dismissal or redundancy). Ensuring the draft settlement agreement properly characterizes payments under this statutory gateway prevents the transaction from being rendered ultra vires.
            </p>
          </div>
        </section>

        {/* Section 2: Equity, RSUs & Carried Interest */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">2. Unvested Equity, Share Options &amp; Bad Leaver Traps</h2>
            <p className="sc-body mb-4">
              In senior executive contracts, salary is frequently a fraction of total compensation. Deferred equity, enterprise management incentives (EMI), restricted stock units (RSUs), and carried interest form the core commercial battleground.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-3">Key Equity Negotiation Targets:</h3>
              <ul className="flex flex-col gap-2.5 text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Good Leaver Classification:</strong> Securing express written confirmation that departure qualifies as a "Good Leaver" under the articles of association.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Accelerated Vesting:</strong> Negotiating pro-rata vesting for RSUs or share options scheduled to mature within 6 to 12 months.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Exercise Window Extension:</strong> Extending option exercise windows from 30 days to 12 months post-termination.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Restrictive Covenants & Non-Compete */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">3. Restrictive Covenant Buyouts &amp; Garden Leave</h2>
            <p className="sc-body mb-4">
              Employers often attempt to reaffirm onerous post-termination restrictive covenants (PTRs), such as 6- to 12-month non-compete, non-solicitation, and non-dealing clauses, inside the settlement agreement.
            </p>
            <p className="sc-body mb-4">
              Under English law, restrictive covenants are void as restraints of trade unless they protect legitimate business interests and are reasonable in scope. In settlement negotiations, executives can demand that garden leave periods offset post-termination restriction durations, or negotiate a separate commercial fee contribution for agreeing to enhanced non-compete covenants.
            </p>
          </div>
        </section>

        {/* Section 4: Worked Calculation Case Study */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Calculation: Senior Director Severance Package</h2>
            <p className="sc-body mb-6">
              The table below outlines a standard statutory and contractual breakdown for a departing Managing Director (Age 48, 7 completed years of service, £140,000 gross base salary, 3-month contractual notice):
            </p>

            <div className="rounded-xl border border-rule overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Component</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory / Contractual Basis</th>
                    <th className="text-left px-4 py-3 font-medium">Gross Figure</th>
                    <th className="text-left px-4 py-3 font-medium">Tax Status</th>
                    <th className="text-left px-4 py-3 font-medium">Net Estimate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Statutory Redundancy Floor</td>
                    <td className="px-4 py-3 text-muted">ERA 1996 s.162 (7 yrs &times; 1.5 &times; £751)</td>
                    <td className="px-4 py-3 font-semibold text-ink">£7,885.50</td>
                    <td className="px-4 py-3 text-ink">0% (s.403 exempt)</td>
                    <td className="px-4 py-3 font-semibold text-ink">£7,885.50</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">PILON Notice Pay (3 Months)</td>
                    <td className="px-4 py-3 text-muted">ITEPA 2003 s.402D (PENP rules)</td>
                    <td className="px-4 py-3 font-semibold text-ink">£35,000.00</td>
                    <td className="px-4 py-3 text-muted">45% PAYE + 2% NIC</td>
                    <td className="px-4 py-3 font-semibold text-ink">£18,550.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Ex-Gratia Termination Sum</td>
                    <td className="px-4 py-3 text-muted">Negotiated Exit (first £22,114.50 free)</td>
                    <td className="px-4 py-3 font-semibold text-ink">£60,000.00</td>
                    <td className="px-4 py-3 text-muted">Part Exempt / Excess at 45%</td>
                    <td className="px-4 py-3 font-semibold text-ink">£42,948.47</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Employer Legal Contribution</td>
                    <td className="px-4 py-3 text-muted">Section 203(3) ERA / ESC A81</td>
                    <td className="px-4 py-3 font-semibold text-ink">£1,500.00 + VAT</td>
                    <td className="px-4 py-3 text-ink">0% (Exempt benefit)</td>
                    <td className="px-4 py-3 font-semibold text-ink">Paid to Solicitor</td>
                  </tr>
                  <tr className="bg-paper font-bold">
                    <td className="px-4 py-3 text-ink">TOTAL PACKAGE</td>
                    <td className="px-4 py-3 text-muted">-</td>
                    <td className="px-4 py-3 text-coral">£102,885.50</td>
                    <td className="px-4 py-3 text-muted">Effective Tax: ~32.8%</td>
                    <td className="px-4 py-3 text-ink">£69,383.97</td>
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
              <strong>SRA Regulatory Boundary &amp; Legal Fee Disclosure:</strong> SettlementCheck is an independent technology platform and introducer, not a law firm. Under Section 203(3) of the Employment Rights Act 1996, executive settlement agreements are legally binding only if reviewed by an independent SRA-regulated solicitor. Under UK commercial practice, employers provide a capped contribution (typically £750 to £2,500+ VAT for executive agreements) paid directly to your chosen solicitor upon completion.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently Asked Questions: Executive Settlements</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        <DynamicFaqSection pathname="/guides/executive-settlement-agreements/" suppressSchema />
      </main>
      <Footer />
    </>
  )
}
