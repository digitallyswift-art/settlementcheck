import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import type { FaqItem } from '@/components/FaqAccordion'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'
import HomeInsuranceEligibilityClient from './HomeInsuranceEligibilityClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER, SETTLEMENT_CHECK_LEGAL_DESK } from '@/lib/seo/schema-constants'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Home Insurance Legal Cover & Settlements | SettlementCheck',
  description:
    'Why home insurance legal cover excludes voluntary settlement agreements and how the employer customary contribution funds independent SRA solicitor advice.',
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
      'Examine why insurers decline voluntary settlement reviews, and how customary employer contributions ensure independent legal advice at £0 employee cost.',
  },
}

const FAQS: FaqItem[] = [
  {
    q: 'Does home insurance legal expenses cover pay for a settlement agreement review?',
    a: 'In almost all cases, no. Standard home insurance Legal Expenses Insurance (LEI) policies - administered by underwriters such as DAS, ARAG, Arc Legal, or Legal Protection Group - explicitly exclude voluntary pre-termination negotiations and non-contentious commercial settlement reviews. Insurers only fund active disputes with a reasonable prospect of success (greater than 51%) at an Employment Tribunal.',
  },
  {
    q: 'Why did my legal expenses insurer reject my settlement agreement claim?',
    a: 'Insurers require an actionable legal wrong (such as an actual unfair dismissal, unlawful deduction of wages, or breach of the Equality Act 2010) where litigation is contemplated or underway. A settlement agreement under Section 111A or Section 203 ERA 1996 is a consensual commercial negotiation. Because no formal tribunal claim is being litigated, insurers categorize the review as routine contractual advice, which is excluded from standard policy terms.',
  },
  {
    q: 'If insurance will not pay, how do I afford independent legal advice?',
    a: 'You do not need insurance to pay for independent legal advice on a settlement agreement. Under standard UK commercial practice, the employer offering the settlement agreement customarily provides a capped legal fee contribution (typically £350 to £500+ plus VAT for standard agreements, and £750 to £1,500+ for complex or senior exits). This sum is paid directly to your chosen SRA-regulated solicitor upon completion.',
  },
  {
    q: 'Is the employer legally required to pay for my solicitor?',
    a: 'While Section 203(3) of the Employment Rights Act 1996 makes independent legal advice a mandatory condition for a valid waiver, the employer payment itself is a commercial convention rather than a direct statutory obligation. Employers pay this contribution because without an independent solicitor signing the adviser certificate, the agreement is legally void and the employer remains vulnerable to tribunal claims.',
  },
  {
    q: 'Can my home insurer force me to use their panel solicitors if a claim does arise?',
    a: 'No. Under Regulation 6 of the Insurance Companies (Legal Expenses Insurance) Regulations 1990, an insured person has the legal right to choose their own independent solicitor once formal legal proceedings have commenced or where a conflict of interest arises. You are never obligated to accept an insurer volume claims handler.',
  },
  {
    q: 'What happens if my legal fees exceed the employer contribution?',
    a: 'For a standard settlement agreement review where the financial terms are accepted, specialist employment solicitors frequently agree to cap their fees to match the employer contribution, resulting in no out-of-pocket expense for you. If you instruct the solicitor to conduct detailed negotiations or draft complex counter-proposals, solicitors will discuss whether to ask the employer to increase their contribution or agree on additional fees in advance.',
  },
  {
    q: 'Can I use home legal expenses insurance if settlement negotiations break down?',
    a: 'Yes. If settlement negotiations collapse and your employer subsequently dismisses you unfairly or unlawfully, you can reactivate your legal expenses policy. The insurer will assess the merits of the case, and if they determine there is a 51% or higher chance of success at tribunal, they may grant indemnity funding for your tribunal claim.',
  },
  {
    q: 'Should I notify my legal expenses insurer anyway?',
    a: 'It is often sensible to notify your insurer of circumstances that could give rise to a dispute, particularly if your employment is at imminent risk. Most policies require prompt notification. Logging the potential dispute preserves your rights to legal funding if talks break down and you are forced to bring an Employment Tribunal claim.',
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
        headline: 'Why Home Insurance Legal Expenses Cover Excludes Settlement Agreements (And Why It Does Not Matter)',
        description:
          'Detailed guide examining why home insurance legal expenses policies reject settlement agreement reviews, the reasonable prospects test, customary employer fee contributions, and Freedom of Choice regulations.',
        url: 'https://settlementcheck.co.uk/guides/home-insurance-legal-cover-settlement-agreement/',
        datePublished: '2026-06-20',
        dateModified: '2026-11-15',
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
      <main className="min-h-screen bg-paper text-ink pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted font-sans">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-coral transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/guides/" className="hover:text-coral transition-colors">
                  Guides
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink font-medium" aria-current="page">
                Home Insurance Legal Cover
              </li>
            </ol>
          </nav>

          {/* Editorial Header */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/20">
              <span>Legal Expenses Insurance (LEI) &amp; Fee Funding Guide</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink tracking-tight leading-tight">
              Home Insurance Legal Cover &amp; Settlement Agreements: Why Insurers Reject Claims
            </h1>
            <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-3xl">
              Has your home insurer rejected your settlement agreement claim? Discover why standard Legal Expenses Insurance policies decline pre-termination negotiations, and why customary employer fee contributions mean you still receive specialist independent legal advice.
            </p>
          </header>

          {/* Interactive Diagnostic Component */}
          <HomeInsuranceEligibilityClient />

          {/* Detailed Editorial Guide */}
          <article className="prose prose-slate max-w-none space-y-10 text-ink leading-relaxed">
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                1. The Shock of the Insurer Rejection
              </h2>
              <p className="text-body text-muted leading-relaxed">
                When presented with a formal settlement agreement, many UK employees remember that their home contents or buildings insurance policy includes an add-on called &quot;Family Legal Protection&quot; or &quot;Legal Expenses Insurance&quot; (LEI).
              </p>
              <p className="text-body text-muted leading-relaxed">
                Employees contact their insurer (such as DAS, ARAG, Arc Legal, Aviva, Direct Line, or Churchill) expecting them to appoint a solicitor to sign off the agreement. Within 48 hours, they receive a formal rejection letter stating that the policy does not cover the matter because there is no &quot;dispute with reasonable prospects of success.&quot;
              </p>
              <div className="p-4 bg-paper rounded-xl border border-rule text-xs space-y-1.5 text-muted">
                <span className="font-semibold text-ink block">
                  The Reassurance: Rejection Is Normal and Completely Harmless
                </span>
                <p className="m-0 leading-relaxed">
                  An insurer rejection does not mean you have done anything wrong, nor does it mean you have a weak negotiating position. It is simply a reflection of how standard insurance contracts are drafted. You do not need insurance because your employer customarily funds your legal advice.
                </p>
              </div>
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                2. Why LEI Policies Exclude Pre-Termination Settlement Agreements
              </h2>
              <p className="text-body text-muted leading-relaxed">
                Legal Expenses Insurance is an indemnity product engineered to fund contentious courtroom or tribunal litigation. Understanding why it excludes voluntary settlement agreements comes down to two legal concepts:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    The &quot;Contentious Dispute&quot; Requirement
                  </span>
                  <p className="text-muted leading-relaxed">
                    LEI policies only activate when an insured person has suffered an unlawful legal wrong - such as an actual breach of contract, constructive dismissal, or unfair dismissal. Pre-termination negotiations conducted under Section 111A ERA 1996 are consensual commercial discussions. At this stage, you have not been unlawfully dismissed, and no formal legal cause of action exists.
                  </p>
                </div>
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    The &quot;Reasonable Prospects of Success&quot; Barrier (&gt;51%)
                  </span>
                  <p className="text-muted leading-relaxed">
                    Under standard policy terms, an insurer will only authorize funding if a qualified barrister or panel solicitor confirms that the claim has at least a 51% chance of winning at an Employment Tribunal. Because a settlement agreement is a commercial compromise rather than a contested trial, there is no &quot;win or loss&quot; verdict for an insurer to evaluate.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                3. The Employer Legal Fee Contribution Explained
              </h2>
              <p className="text-body text-muted leading-relaxed">
                Under Section 203(3) of the Employment Rights Act 1996, an employee cannot legally waive their statutory employment rights without first receiving advice from an independent relevant adviser - specifically, an SRA-regulated solicitor.
              </p>
              <p className="text-body text-muted leading-relaxed">
                Because an unadvised agreement is legally void and leaves the employer vulnerable to immediate Employment Tribunal claims, UK employers standardly include a dedicated legal fee clause in the settlement agreement:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-rule rounded-lg">
                  <thead className="bg-paper text-ink font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Exit Level &amp; Circumstances</th>
                      <th className="p-3">Customary Fee Contribution</th>
                      <th className="p-3">What the Contribution Typically Covers</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Standard Redundancy / Mutual Exit</td>
                      <td className="p-3 font-mono text-coral font-bold">£350 to £500 + VAT</td>
                      <td className="p-3 text-muted">Statutory review of clauses, tax status, and adviser certificate sign-off.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Complex Grievance / PIP Exit</td>
                      <td className="p-3 font-mono text-coral font-bold">£500 to £850 + VAT</td>
                      <td className="p-3 text-muted">Review of dispute history, restrictive covenants, and negotiation of reference.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Senior Executive / City Director</td>
                      <td className="p-3 font-mono text-coral font-bold">£1,000 to £2,500+ + VAT</td>
                      <td className="p-3 text-muted">Deferred compensation, share options, bad leaver clauses, and non-competes.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mandatory Regulatory Disclaimers */}
            <MandatoryLegalDisclaimers />

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                4. Freedom of Solicitor Choice (Regulation 6)
              </h2>
              <p className="text-body text-muted leading-relaxed">
                If your negotiations do collapse and you find yourself in an active tribunal dispute where your home insurance LEI policy does grant indemnity funding, remember your statutory rights regarding solicitor representation:
              </p>
              <div className="p-4 bg-paper rounded-xl border border-rule text-xs space-y-2 text-muted leading-relaxed">
                <p className="m-0 font-semibold text-ink">
                  The Insurance Companies (Legal Expenses Insurance) Regulations 1990 (Regulation 6)
                </p>
                <p className="m-0">
                  Under Regulation 6, an insured individual has the right to instruct an independent solicitor of their own choice whenever formal legal proceedings are commenced. Insurers frequently attempt to route claims to volume panel firms with high case loads. You are legally entitled to nominate your own qualified specialist employment solicitor.
                </p>
                <p className="m-0 font-semibold text-ink pt-1">
                  SRA Standards &amp; Regulations Rule 5.1
                </p>
                <p className="m-0">
                  Whether funded by an employer contribution or insurance indemnity, your instructed solicitor owes their duty of care exclusively to you. They are prohibited by the Solicitors Regulation Authority from having any conflict of interest with your employer.
                </p>
              </div>
            </section>

            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                5. Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={FAQS} />
            </section>
          </article>

          {/* Related Tools Navigation */}
          <nav aria-label="Related guides and tools" className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
            <h3 className="text-base font-serif font-bold text-ink">
              Related Settlement Agreement Resources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <Link
                href="/settlement-agreement-review/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Solicitor Matching Service</span>
                <span className="text-muted text-[11px]">Employer-funded SRA legal advice</span>
              </Link>
              <Link
                href="/guides/employer-recommended-solicitor/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Employer Recommended Solicitor</span>
                <span className="text-muted text-[11px]">Why you should choose your own solicitor</span>
              </Link>
              <Link
                href="/calculator/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Settlement Calculator</span>
                <span className="text-muted text-[11px]">Instant compensation estimation</span>
              </Link>
              <Link
                href="/guides/settlement-agreement-how-much/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Settlement Payout Averages</span>
                <span className="text-muted text-[11px]">Realistic UK exit compensation brackets</span>
              </Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}