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
  title: 'Executive Settlement Agreements UK | SettlementCheck',
  description:
    'Understand UK senior executive settlement agreements: equity vesting, Good Leaver clauses, non-compete terms, D&O cover, and 2026 statutory baselines.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
  },
  openGraph: {
    title: 'Executive Settlement Agreements UK | SettlementCheck',
    description:
      'Understand UK senior executive settlement agreements: equity vesting, Good Leaver clauses, non-compete terms, D&O cover, and 2026 statutory baselines.',
    url: 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Executive Settlement Agreements UK | SettlementCheck',
    description:
      'Senior director settlement agreements: equity vesting, Companies Act s.217 approval, garden leave, and 2026 UK tax rules.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/executive-settlement-agreements/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'How do executive settlement agreements differ from standard employee agreements?',
    a: 'Executive packages often involve unvested share options, RSUs, carried interest, and post-termination non-compete clauses. For statutory directors, payments for loss of office may also require shareholder approval under Section 217 of the Companies Act 2006. Employers standardly contribute £350 to £500+ plus VAT for standard agreements, and often £750 to £2,500+ plus VAT for complex executive reviews upon completion, with excess or abortive work subject to solicitor engagement terms.',
  },
  {
    q: 'What happens to unvested share options or RSUs when leaving?',
    a: 'Treatment depends on the scheme rules and whether you are classed as a Good Leaver or Bad Leaver. During a review, solicitors often check whether Good Leaver status, accelerated vesting, an extended exercise window (such as 6 to 12 months), or a cash buyout is available under the plan.',
  },
  {
    q: 'Can an executive settlement agreement waive future unknown claims?',
    a: 'Following Bathgate v Technip Singapore PTE Ltd [2023] CSIH 48, a Section 203 ERA 1996 waiver can cover unknown future statutory claims if the wording is clear and unambiguous. However, clauses attempting to restrict statutory whistleblowing under Section 43J ERA 1996 or regulatory reporting to the FCA or PRA are void.',
  },
  {
    q: 'What is D&O run-off insurance cover for departing directors?',
    a: 'Directors and Officers (D&O) run-off insurance covers liability for decisions made during your directorship. Because claims under the Limitation Act 1980 can arise up to 6 years later (or 12 years under deed), departing directors often ask their solicitor to check for continuing policy cover or a 6-year run-off endorsement.',
  },
  {
    q: 'How much does an employer contribute towards executive legal fees?',
    a: 'Employers standardly contribute £350 to £500+ plus VAT for standard agreements upon completion. For senior executive exits involving equity, tax indemnities, and director resignations, employers often offer £750 to £2,500+ plus VAT directly to your SRA-regulated solicitor. Any excess or abortive fees depend on your solicitor engagement terms.',
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
  headline: 'Executive Settlement Agreements in the UK: Director Severance, Equity & Exit Terms',
  url: 'https://settlementcheck.co.uk/guides/executive-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-11-04',
  dateModified: '2026-11-22',
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
      name: 'Employment Rights Act 1996, Section 43J',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/43J',
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
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Executive settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Executive Settlement Agreements in the UK
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against Companies Act 2006 &amp; ERA 1996
            </p>
            <p className="sc-lead leading-relaxed">
              Reviewing a senior exit package or board settlement draft? Executive agreements combine statutory notice, unvested equity, non-compete clauses, and Companies Act governance. Check your calculated statutory baseline in 60 seconds with no email required, see how tax and equity rules apply, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Calculator Micro-Tool (Immediately after Hero) */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your executive offer compare to the statutory baseline?"
                subtitle="Compare your package against your calculated statutory baseline (£751/wk cap), notice pay, and tax-free thresholds."
                disputeType="executive_severance"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Tax-Free Exemption', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                  { label: 'Legal Fee Contribution', value: '£750 to £2,500+ VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={125000}
                initialYears={6}
                initialAge={46}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Key Governance & Statutory Baseline Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-3">
                What are the key legal requirements for a UK executive settlement?
              </h2>
              <p className="text-[15px] text-ink leading-relaxed mb-5">
                Under Section 217 of the Companies Act 2006, payments for loss of office to company directors require shareholder approval unless paid under an existing legal obligation. Under Section 203(3) ERA 1996, the agreement is only binding once an independent SRA-regulated solicitor advises you on its terms.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Legal Fee Benchmark</span>
                  <span className="font-bold text-ink text-sm block mb-1">£750 to £2,500+ plus VAT</span>
                  <span className="text-muted text-[12px]">Typical executive contribution upon completion</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Tax-Free Exemption</span>
                  <span className="font-bold text-ink text-sm block mb-1">First £30,000</span>
                  <span className="text-muted text-[12px]">ITEPA 2003 s.403 (excess taxed at marginal rate)</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">D&amp;O Run-Off Cover</span>
                  <span className="font-bold text-ink text-sm block mb-1">6 Years Standard</span>
                  <span className="text-muted text-[12px]">Limitation Act 1980 director protection</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Shareholder Approval</span>
                  <span className="font-bold text-ink text-sm block mb-1">Companies Act s.217</span>
                  <span className="text-muted text-[12px]">Loss of office sums beyond contractual rights</span>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Why do executive settlement agreements need shareholder approval?</h2>
              <p className="guide-body">
                When a statutory director leaves under an agreed exit, employment law meets corporate governance. Under <strong>Section 217 of the Companies Act 2006</strong>, a company cannot make a payment for loss of office to a director without prior shareholder approval by ordinary resolution.
              </p>
              <p className="guide-body">
                An important statutory exception applies if the payment settles an existing legal claim or contractual entitlement, such as wrongful dismissal damages or statutory redundancy. Solicitors check that the draft wording records this basis clearly so the payment remains valid.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. What happens to unvested equity, RSUs, and Good Leaver status?</h2>
              <p className="guide-body">
                For senior executives, base salary is often only part of total reward. Deferred shares, EMI options, restricted stock units (RSUs), and carried interest are governed by the scheme rules rather than the employment contract alone.
              </p>
              <div className="rounded-xl border border-rule bg-paper-2/40 p-5">
                <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-3">Equity points solicitors commonly review</h3>
                <ul className="flex flex-col gap-2.5 text-[15px] text-ink">
                  <li className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span><strong>Good Leaver classification:</strong> Confirming in writing how your departure is treated under the articles of association or plan rules.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span><strong>Accelerated or pro-rata vesting:</strong> Checking whether RSUs or options maturing within 6 to 12 months vest on exit or lapse.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span><strong>Exercise window length:</strong> Reviewing whether a short 30-day exercise window can be extended, often to 6 or 12 months.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How do garden leave and non-compete clauses work on exit?</h2>
              <p className="guide-body">
                Draft agreements often restate post-termination restrictions, such as 6- to 12-month non-compete, non-solicitation, and non-dealing clauses. Under English law, restrictive covenants are unenforceable unless they protect a legitimate business interest and go no further than reasonably necessary.
              </p>
              <p className="guide-body">
                During a review, employees often ask their solicitor whether time spent on <strong>garden leave</strong> offsets the post-termination non-compete period. Remember that any separate payment given specifically in return for new or extended covenants is normally taxed as earnings under ITEPA 2003 s.225, rather than falling within the £30,000 exemption.
              </p>
            </div>

            {/* Section 4: Worked Calculation */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. What does a senior director settlement breakdown look like?</h2>
              <p className="guide-body">
                The table below shows an illustrative statutory and contractual breakdown for a departing director (Age 48, 7 complete years of service, £140,000 base salary, 3-month notice). Contractual notice and holiday pay are always taxed as wages, while qualifying termination sums up to £30,000 are exempt under ITEPA 2003 s.403.
              </p>

              <div className="rounded-xl border border-rule overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-4 py-3 font-medium">Component</th>
                      <th className="text-left px-4 py-3 font-medium">Statutory / Contractual Basis</th>
                      <th className="text-left px-4 py-3 font-medium">Gross Figure</th>
                      <th className="text-left px-4 py-3 font-medium">Tax Status</th>
                      <th className="text-left px-4 py-3 font-medium">Illustrative Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule bg-white">
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Statutory Redundancy Baseline</td>
                      <td className="px-4 py-3 text-muted">ERA 1996 s.162 (7 yrs &times; 1.5 &times; £751)</td>
                      <td className="px-4 py-3 font-semibold text-ink">£7,885.50</td>
                      <td className="px-4 py-3 text-ink">0% (s.403 exempt)</td>
                      <td className="px-4 py-3 font-semibold text-ink">£7,885.50</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">PILON Notice Pay (3 Months)</td>
                      <td className="px-4 py-3 text-muted">ITEPA 2003 s.402D (taxed as wages)</td>
                      <td className="px-4 py-3 font-semibold text-ink">£35,000.00</td>
                      <td className="px-4 py-3 text-muted">45% PAYE + 2% NIC</td>
                      <td className="px-4 py-3 font-semibold text-ink">£18,550.00</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Ex-Gratia Termination Sum</td>
                      <td className="px-4 py-3 text-muted">First £22,114.50 exempt; £37,885.50 taxable</td>
                      <td className="px-4 py-3 font-semibold text-ink">£60,000.00</td>
                      <td className="px-4 py-3 text-muted">Part exempt / 45% excess</td>
                      <td className="px-4 py-3 font-semibold text-ink">£42,951.52</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Employer Legal Contribution</td>
                      <td className="px-4 py-3 text-muted">Commercial Contribution (ITEPA s.413A)</td>
                      <td className="px-4 py-3 font-semibold text-ink">£1,500.00 + VAT</td>
                      <td className="px-4 py-3 text-ink">0% (Exempt benefit)</td>
                      <td className="px-4 py-3 font-semibold text-ink">Paid to Solicitor</td>
                    </tr>
                    <tr className="bg-paper font-bold">
                      <td className="px-4 py-3 text-ink">TOTAL ILLUSTRATIVE PACKAGE</td>
                      <td className="px-4 py-3 text-muted">-</td>
                      <td className="px-4 py-3 text-coral">£102,885.50</td>
                      <td className="px-4 py-3 text-muted">Effective Tax: ~32.6%</td>
                      <td className="px-4 py-3 text-ink">£69,387.02</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[14px] text-muted">
                Illustrative figures only, assuming additional-rate income tax (45%) and employee NICs (2%) on notice pay, excluding personal tax code or pension adjustments.
              </p>
            </div>

            {/* Section 5: Procedural & Statutory Protections */}
            <div className="space-y-4">
              <h2 className="guide-h2">5. Which statutory rules apply during executive talks?</h2>
              <p className="guide-body">
                Senior exit discussions follow the same statutory framework as other UK settlements. Understanding these rules helps you avoid unexpected risks before instructing a solicitor.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Confidentiality &amp; Eligibility</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li><strong>Section 111A ERA 1996</strong> only shields pre-termination talks from ordinary unfair dismissal claims, not discrimination or whistleblowing.</li>
                    <li><strong>Without Prejudice</strong> applies only where a genuine existing dispute exists between you and your employer.</li>
                    <li><strong>Statutory redundancy</strong> requires at least 2 years&apos; continuous service (ERA 1996 s.155), and certain overseas or excluded categories do not qualify (s.141).</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Timelines &amp; Offer Withdrawal</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li><strong>ACAS Code 4</strong> recommends 10 calendar days to consider a written offer, though this is guidance rather than a binding legal right.</li>
                    <li><strong>Contract revocation:</strong> Under <em>Hyde v Wrench</em> and <em>Routledge v Grant</em>, a counter-offer rejects the original offer and an employer can withdraw before signing.</li>
                    <li><strong>Legal privilege:</strong> Discussions with an SRA-regulated solicitor are protected by legal professional privilege.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Regulatory Disclaimers */}
            <div className="bg-paper border border-rule rounded-xl p-5 text-[14px] text-muted leading-relaxed">
              <p>
                <strong>SRA Regulatory Boundary &amp; Legal Fee Disclosure:</strong> SettlementCheck is an independent technology platform and introduction service, not a law firm. Under Section 203(3) of the Employment Rights Act 1996, settlement agreements are binding only after advice from an independent SRA-regulated solicitor. Employers standardly contribute £350 to £500+ plus VAT for standard reviews, and often £750 to £2,500+ plus VAT for senior executive packages upon completion; any excess or abortive work is subject to your solicitor engagement terms.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your executive offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and notice pay breakdown before speaking to a solicitor.
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
                Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion (often higher for executive reviews)
              </p>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-4">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/executive-settlement-agreements/" suppressSchema />
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related Guides & Calculations"
              items={[
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your offer against 2026 statutory baselines and notice pay rules.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/settlement-agreement-restrictive-covenants/',
                  title: 'Restrictive Covenants & Non-Competes',
                  description: 'How non-compete clauses, garden leave, and s.225 tax rules work on exit.',
                  tag: 'Legal Guide',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'The £30,000 Tax-Free Settlement Rule',
                  description: 'Which exit payments qualify under ITEPA 2003 s.403 and what is taxed as wages.',
                  tag: 'Tax Guide',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Without prejudice rules, s.111A scope, and how offers are structured.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw a Settlement Offer?',
                  description: 'Contract revocation rules under Hyde v Wrench and ACAS 10-day guidance.',
                  tag: 'Legal Rights',
                },
                {
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Clause Review',
                  description: 'Check your draft agreement for restrictive covenants, tax indemnities, and fee terms.',
                  tag: 'Review Tool',
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
