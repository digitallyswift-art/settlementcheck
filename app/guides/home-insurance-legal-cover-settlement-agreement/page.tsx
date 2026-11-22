import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import type { FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'
import HomeInsuranceEligibilityClient from './HomeInsuranceEligibilityClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER, SETTLEMENT_CHECK_LEGAL_DESK } from '@/lib/seo/schema-constants'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Home Insurance Legal Cover & Settlements | SettlementCheck',
  description:
    'Why home insurance legal cover excludes voluntary settlement agreements and how standard employer fee contributions (£350 to £500+ plus VAT) fund independent advice.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/',
  },
  openGraph: {
    title: 'Home Insurance Legal Expenses Cover & Settlement Agreements | SettlementCheck',
    description:
      'Learn why Legal Expenses Insurance (LEI) policies decline settlement agreements and how employer contributions cover independent legal fees under Section 203(3) ERA 1996.',
    url: 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Home Insurance Legal Expenses Cover & Settlement Agreements',
    description:
      'Why insurers decline voluntary settlement reviews, and how standard employer fee contributions (£350 to £500+ plus VAT) fund independent legal advice.',
  },
}

const FAQS: FaqItem[] = [
  {
    q: 'Does home insurance legal expenses cover pay for a settlement agreement review?',
    a: 'In almost all cases, no. Standard Legal Expenses Insurance (LEI) policies exclude voluntary pre-termination negotiations and non-contentious settlement reviews. Insurers usually only fund active disputes with a reasonable prospect of success (over 51%) at an employment tribunal.',
  },
  {
    q: 'Why did my legal expenses insurer reject my settlement agreement claim?',
    a: 'Insurers require an actionable legal wrong, such as an unfair dismissal or breach of contract, where litigation is underway or contemplated. A settlement agreement under Section 111A or Section 203 ERA 1996 is a voluntary commercial discussion. Because no tribunal claim is being litigated, insurers categorise the review as routine contractual advice.',
  },
  {
    q: 'If insurance will not pay, how do I afford independent legal advice?',
    a: 'You do not need insurance to fund a settlement agreement review. Employers standardly contribute £350 to £500+ plus VAT directly to your SRA-regulated solicitor upon completion. Any excess or abortive work if the agreement does not complete is subject to your solicitor engagement terms.',
  },
  {
    q: 'Is the employer legally required to pay for my solicitor?',
    a: 'Section 203(3) of the Employment Rights Act 1996 makes independent legal advice mandatory for a valid waiver, though the employer fee contribution is a commercial norm rather than a statutory duty. Employers offer it because an unadvised agreement is legally void and leaves them open to employment tribunal claims.',
  },
  {
    q: 'Can my home insurer force me to use their panel solicitors if a claim does arise?',
    a: 'No. Under Regulation 6 of the Insurance Companies (Legal Expenses Insurance) Regulations 1990, you have the right to choose your own independent solicitor once formal legal proceedings begin or a conflict of interest arises.',
  },
  {
    q: 'What happens if my legal fees exceed the employer contribution?',
    a: 'For a straightforward review where terms are accepted, solicitors often cap fees within the employer contribution upon completion. If you instruct a solicitor to negotiate changes, any excess fees or abortive work costs are subject to your solicitor engagement terms unless the employer raises the cap.',
  },
  {
    q: 'Can I use home legal expenses insurance if settlement negotiations break down?',
    a: 'Yes. If talks collapse and your employer dismisses you unfairly or unlawfully, you can ask your insurer to assess a tribunal claim. If they confirm a 51% or higher prospect of success, they may grant indemnity funding.',
  },
  {
    q: 'Should I notify my legal expenses insurer anyway?',
    a: 'Many policies require prompt notification of circumstances that could lead to a dispute. Logging a potential employment issue early can help preserve your right to funding if negotiations fail and a tribunal claim becomes necessary.',
  },
]

export default function HomeInsuranceLegalCoverPage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/#webpage',
        url: 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/',
        name: 'Home Insurance Legal Expenses Cover & Settlement Agreements',
        publisher: SETTLEMENT_CHECK_PUBLISHER,
        description:
          'Educational analysis of Legal Expenses Insurance (LEI) exclusions for voluntary settlement agreements and how employer contributions cover independent SRA solicitor costs.',
        breadcrumb: {
          '@id': 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/#breadcrumb',
        },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://settlementcheck.co.uk/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: 'https://settlementcheck.co.uk/guides/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Home Insurance Legal Cover',
            item: 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/',
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/#article',
        headline: 'Home Insurance Legal Cover & Settlement Agreements: Why Insurers Reject Claims',
        description:
          'Guide examining why home insurance legal expenses policies reject settlement agreement reviews, the reasonable prospects test, employer fee contributions, and Freedom of Choice regulations.',
        url: 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/',
        datePublished: '2026-06-20',
        dateModified: '2026-11-22',
        publisher: SETTLEMENT_CHECK_PUBLISHER,
        author: SETTLEMENT_CHECK_LEGAL_DESK,
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/#faq',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: a,
          },
        })),
      },
    ],
  }

  return (
    <>
      <Script
        id="home-insurance-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLdData) }}
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Legal fees</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Home Insurance Legal Cover &amp; Settlement Agreements
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 s.203 &amp; LEI Regulations 1990
            </p>
            <p className="sc-lead leading-relaxed">
              Got a settlement agreement and a rejection letter from your home insurer? Standard Legal Expenses Insurance excludes voluntary settlement reviews, and that is normal. Check your statutory baseline in 60 seconds with no email required, see how the £350 to £500+ plus VAT employer contribution works, and review your options.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Statutory Baseline Check */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Compare your settlement figure against your calculated statutory baseline and standard employer legal fee contributions before instructing a solicitor."
                disputeType="general"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Independent Advice', value: 'Mandatory', statute: 'ERA 1996 s.203(3)' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={45000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Interactive LEI Eligibility Diagnostic */}
            <HomeInsuranceEligibilityClient />

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                1. Why did your home insurer reject your settlement agreement claim?
              </h2>
              <p className="guide-body">
                Many UK employees check their home insurance &quot;Family Legal Protection&quot; or Legal Expenses Insurance (LEI) add-on when handed a settlement agreement. Insurers such as DAS, ARAG, or Arc Legal routinely decline these requests within 48 hours.
              </p>
              <p className="guide-body">
                A rejection letter simply reflects how insurance policies are written. It does not mean your case is weak, and you do not need insurance to fund independent legal advice on a settlement agreement.
              </p>
              <div className="p-5 bg-paper-2 border border-rule rounded-xl text-[14px] space-y-1.5 text-muted">
                <span className="font-semibold text-ink block">
                  Why this rejection is normal
                </span>
                <p className="m-0 leading-relaxed">
                  Insurers cover contested litigation. Employers standardly fund voluntary settlement reviews instead, typically contributing £350 to £500+ plus VAT upon completion.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                2. Why do Legal Expenses Insurance policies exclude voluntary agreements?
              </h2>
              <p className="guide-body">
                Legal Expenses Insurance is designed to fund contentious courtroom or employment tribunal litigation. Two standard policy rules exclude voluntary settlement reviews:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 space-y-2">
                  <span className="font-semibold text-ink block text-[14px]">
                    The &quot;Contentious Dispute&quot; Requirement
                  </span>
                  <p className="text-[14px] text-muted leading-relaxed">
                    LEI policies activate only when an unlawful wrong has occurred, such as unfair dismissal or breach of contract. Pre-termination talks under Section 111A ERA 1996 are consensual discussions, though Section 111A does not shield discrimination, whistleblowing, or improper behaviour.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 space-y-2">
                  <span className="font-semibold text-ink block text-[14px]">
                    The &quot;Reasonable Prospects&quot; Test (&gt;51%)
                  </span>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Insurers usually authorise funding only if a claim has at least a 51% chance of winning at an employment tribunal. A settlement agreement is a commercial compromise, so there is no trial verdict for an insurer to assess.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                3. Who pays for your solicitor if home insurance will not?
              </h2>
              <p className="guide-body">
                Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is not binding until an independent SRA-regulated solicitor advises you on it. Your adviser checks your calculated statutory baseline, garden leave, non-compete clauses, and whether notice pay is taxed as wages.
              </p>
              <p className="guide-body">
                Because an unadvised agreement is void, employers standardly contribute £350 to £500+ plus VAT toward your legal fees upon completion. Any excess or abortive work if the agreement does not complete is subject to your solicitor engagement terms.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-rule rounded-lg">
                  <thead className="bg-paper-2 text-ink font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Exit Level &amp; Circumstances</th>
                      <th className="p-3">Typical Employer Contribution</th>
                      <th className="p-3">What the Contribution Usually Covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Standard Redundancy / Mutual Exit</td>
                      <td className="p-3 font-mono text-coral font-bold">£350 to £500+ plus VAT</td>
                      <td className="p-3 text-muted">Review of draft clauses, tax split, and adviser certificate sign-off upon completion.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Complex Grievance / PIP Exit</td>
                      <td className="p-3 font-mono text-coral font-bold">£500 to £850+ plus VAT</td>
                      <td className="p-3 text-muted">Review of dispute history, restrictive covenants, and agreed reference wording.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Senior Executive / Director</td>
                      <td className="p-3 font-mono text-coral font-bold">£1,000 to £2,500+ plus VAT</td>
                      <td className="p-3 text-muted">Deferred pay, share options, bad leaver terms, and non-compete restrictions.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mandatory Regulatory Disclaimers */}
            <MandatoryLegalDisclaimers />

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2">
                4. What happens if settlement talks break down and a dispute begins?
              </h2>
              <p className="guide-body">
                ACAS Code of Practice 4 recommends giving you 10 calendar days to consider a written offer, though this is guidance rather than a strict legal right. Under UK contract law, making a counter-offer rejects the original offer, meaning the employer can withdraw it before acceptance.
              </p>
              <p className="guide-body">
                If talks collapse and you are dismissed, your home insurance LEI policy may become relevant for an employment tribunal claim. Keep these legal protections in mind:
              </p>
              <div className="p-5 bg-paper-2 border border-rule rounded-xl text-[14px] space-y-2 text-muted leading-relaxed">
                <p className="m-0 font-semibold text-ink">
                  Freedom of Solicitor Choice (Regulation 6, LEI Regulations 1990)
                </p>
                <p className="m-0">
                  Once formal legal proceedings begin, Regulation 6 gives you the right to choose your own independent solicitor rather than accepting an insurer&apos;s panel firm.
                </p>
                <p className="m-0 font-semibold text-ink pt-2">
                  SRA Duty of Care &amp; Legal Privilege
                </p>
                <p className="m-0">
                  Whether funded by an employer contribution or insurance indemnity, your solicitor owes their duty of care and legal privilege exclusively to you.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
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
            <div className="space-y-4 pt-2">
              <h2 className="guide-h2">Frequently asked questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Resources"
              items={[
                {
                  href: '/guides/employer-recommended-solicitor/',
                  title: 'Do You Have to Use Their Solicitor?',
                  description: 'Your right to appoint your own independent solicitor with a standard employer fee contribution.',
                  tag: 'Legal Advice',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Step-by-step guide to without prejudice talks, tax splits, and legal fee contributions.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Compare your settlement offer against commercial UK ranges and statutory baselines.',
                  tag: 'Valuation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'ACAS Code 4 guidance and how to handle artificial employer deadlines.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'Contract law rules under Hyde v Wrench and offer revocation risks.',
                  tag: 'Offer Protection',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens if You Do Not Sign?',
                  description: 'Your options and risks if you decline the agreement or talks end without a deal.',
                  tag: 'Risks & Alternatives',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities &amp; Official References</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203(3) (Mandatory independent legal advice requirement)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (Pre-termination negotiations &amp; improper behaviour)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/1990/1159/regulation/6/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Insurance Companies (Legal Expenses Insurance) Regulations 1990, Regulation 6
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/code-of-practice-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Code of Practice on Settlement Agreements (Code of Practice 4)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent introduction service and informational resource. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding Legal Expenses Insurance and settlement fee contributions and does not constitute legal or financial advice.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
