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
  title: 'Compromise Agreement Calculator UK (2026) | SettlementCheck',
  description:
    'Check your compromise agreement payout under April 2026 UK rules (£751 cap). See your redundancy baseline, notice pay, and tax split. Free instant check.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/compromise-agreement-calculator-uk/',
  },
  openGraph: {
    title: 'Compromise Agreement Calculator UK (2026) | SettlementCheck',
    description:
      'Check your compromise agreement payout under April 2026 UK rules (£751 cap). See your redundancy baseline, notice pay, and tax split. Free instant check.',
    url: 'https://settlementcheck.co.uk/guides/compromise-agreement-calculator-uk/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compromise Agreement Calculator UK 2026 | SettlementCheck',
    description:
      'Check your compromise agreement payout under 2026 statutory rules (£751 cap). Redundancy, notice pay, and tax-free split. Free check.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/compromise-agreement-calculator-uk/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Is a compromise agreement calculator the same as a settlement agreement calculator?',
    a: 'Yes. Compromise agreements were renamed settlement agreements on 29 July 2013 under Section 23 of the Enterprise and Regulatory Reform Act 2013. The calculation rules are identical. A 2026 calculation combines statutory redundancy pay (capped at £751/week under SI 2026/310), notice pay, untaken holiday pay, and any ex-gratia payment where the first £30,000 may be tax-free under ITEPA 2003 s.403.',
  },
  {
    q: 'What is the difference between a compromise agreement and a settlement agreement?',
    a: 'There is no legal difference today. Section 23 of the Enterprise and Regulatory Reform Act 2013 renamed them settlement agreements in July 2013. Both are governed by Section 203(3) of the Employment Rights Act 1996.',
  },
  {
    q: 'How is a compromise agreement payout calculated?',
    a: 'It combines four parts: statutory redundancy pay (if your role is redundant), notice pay, accrued untaken holiday pay, and any ex-gratia compensation. Each part follows different statutory and tax rules.',
  },
  {
    q: 'Do I have to pay tax on a compromise agreement payment?',
    a: 'Under Section 403 of ITEPA 2003, genuine termination compensation is usually tax-free up to £30,000. Contractual notice pay (PILON), unpaid wages, and untaken holiday pay are taxed as wages under Section 402D.',
  },
  {
    q: 'Who pays the legal fees for a compromise agreement?',
    a: 'Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) paid directly to your solicitor upon completion. Under Section 203(3) ERA 1996, independent legal advice is required for the waiver to be valid, though the statute does not force employers to pay. Work above the cap or abortive work remains subject to your solicitor engagement terms.',
  },
  {
    q: 'Can I reject a compromise agreement offer?',
    a: 'Yes. A compromise agreement is voluntary, and you do not have to sign it. If no agreement is reached, your employer would normally return to a formal workplace process such as redundancy consultation. Note that making a counter-offer can reject the original offer under contract law (Hyde v Wrench).',
  },
  {
    q: 'How long do I get to consider a compromise agreement?',
    a: 'Paragraph 12 of ACAS Code of Practice 4 recommends a minimum of 10 calendar days as general guidance. This is guidance rather than a binding legal right. Under English contract law (Routledge v Grant), an employer can set a shorter deadline or withdraw an offer before it is accepted.',
  },
  {
    q: 'What is the statutory weekly pay cap in 2026?',
    a: 'From 6 April 2026, the weekly pay cap is £751 in Great Britain under SI 2026/310. In Northern Ireland, the cap is £783 under SR 2026/57. The maximum statutory redundancy payment in Great Britain is £22,530.',
  },
  {
    q: 'Can my employer dismiss me for asking questions about the offer?',
    a: 'Discussing terms is normal, and pre-termination talks under Section 111A ERA 1996 are usually confidential for ordinary unfair dismissal claims. However, Section 111A does not protect discrimination, whistleblowing, or breach of contract claims. Speak to an independent solicitor before sending written counter-proposals to HR so you protect legal privilege.',
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
  headline: 'Compromise Agreement Calculator UK: 2026 Rules & Payout Guide',
  url: 'https://settlementcheck.co.uk/guides/compromise-agreement-calculator-uk/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-03',
  dateModified: '2026-11-22',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
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
    '@id': 'https://settlementcheck.co.uk/guides/compromise-agreement-calculator-uk/',
  },
}

const RELATED_GUIDES = [
  {
    href: '/guides/what-is-a-fair-settlement-agreement/',
    title: 'What Is a Fair Settlement Agreement?',
    description: 'How an employer offer compares with statutory baselines and typical UK ranges.',
    tag: 'Valuation',
  },
  {
    href: '/guides/how-to-negotiate-a-settlement-agreement/',
    title: 'How to Negotiate a Settlement Agreement',
    description: 'How to prepare your figures and questions for an independent solicitor.',
    tag: 'Discussion',
  },
  {
    href: '/guides/redundancy-pay-cap-2026/',
    title: 'Redundancy Pay Cap 2026',
    description: 'The weekly pay cap is £751 from April 2026. Check your statutory baseline.',
    tag: 'Redundancy',
  },
  {
    href: '/guides/tax-free-settlement-30000/',
    title: 'Tax on Settlements: The £30,000 Rule',
    description: 'How the £30,000 tax exemption works under ITEPA 2003 Section 403.',
    tag: 'Tax',
  },
]

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

export default function CompromiseAgreementCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Compromise Agreement Calculator</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Compromise Agreement Calculator UK: 2026 Rules &amp; Payout Guide
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996, SI 2026/310 (£751/wk cap) &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft compromise or settlement agreement sitting in your inbox? Before payday or any deadline passes, check how the numbers stack up against April 2026 UK statutory rules. Answer 7 quick questions to see your redundancy baseline and tax split. Free to calculate, with no email required.
            </p>
          </div>
        </section>

        {/* Embedded Calculator Card immediately below hero */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="Check your offer against April 2026 UK limits"
              subtitle="Enter your salary, years of service, and age for an instant statutory baseline and tax-free estimate."
              disputeType="redundancy"
              initialSalary={50000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Quick Answer & Key Facts */}
        <section className="py-10 bg-white border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How is a compromise agreement calculated in 2026?</h2>
            <p className="sc-body mb-6">
              A compromise agreement (renamed a settlement agreement in 2013) combines four parts: statutory redundancy pay, notice pay, untaken holiday pay, and any ex-gratia sum. Under ITEPA 2003 s.403, the first £30,000 of genuine termination compensation is usually tax-free. Notice pay and holiday pay are taxed as wages.
            </p>

            {/* 2-Column Key Figures Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  Weekly Pay Cap
                </span>
                <p className="text-lg font-bold text-ink mb-1">£751 per week</p>
                <p className="text-sm text-muted">
                  SI 2026/310 (Great Britain). Max statutory redundancy is £22,530. NI cap is £783/week.
                </p>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  Tax-Free Exemption
                </span>
                <p className="text-lg font-bold text-ink mb-1">First £30,000</p>
                <p className="text-sm text-muted">
                  Section 403 of ITEPA 2003 covers genuine compensation for loss of employment.
                </p>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  Notice Pay (PILON)
                </span>
                <p className="text-lg font-bold text-ink mb-1">Taxed as wages</p>
                <p className="text-sm text-muted">
                  Post-Employment Notice Pay (ITEPA 2003 s.402D) is subject to income tax and NI.
                </p>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted mb-1">
                  Solicitor Fee Contribution
                </span>
                <p className="text-lg font-bold text-ink mb-1">£350 to £500+ plus VAT</p>
                <p className="text-sm text-muted">
                  Capped employer contribution upon completion. Extra or abortive work follows solicitor terms.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/calculator/" className="btn-accent">
                Check my offer now →
              </Link>
              <Link href="/redundancy-calculator/" className="btn-ghost">
                Calculate my redundancy →
              </Link>
            </div>
          </div>
        </section>

        {/* Definition Section */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What is a compromise agreement in the UK?</h2>
            <p className="sc-body mb-4">
              A compromise agreement is a legally binding contract between you and your employer that ends employment on agreed terms. You waive specific employment tribunal rights in return for a payout and agreed clauses, such as a reference or shorter non-compete terms.
            </p>
            <p className="sc-body mb-4">
              The Enterprise and Regulatory Reform Act 2013 renamed these contracts &ldquo;settlement agreements&rdquo; on 29 July 2013. It also added Section 111A of the Employment Rights Act 1996 for confidential pre-termination talks.
            </p>
            <p className="sc-body">
              Note that Section 111A only keeps discussions confidential for ordinary unfair dismissal claims. It does not protect discrimination, whistleblowing, or breach of contract claims. Many HR teams still use the older phrase &ldquo;compromise agreement&rdquo; in templates. The legal effect under Section 203(3) ERA 1996 is identical.
            </p>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Is a compromise agreement different from a settlement agreement?</h2>
            <p className="sc-body mb-6">
              The name changed in 2013, but the legal rules for signing and tax remain the same.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-sm border-collapse border border-rule rounded-xl bg-white shadow-sm">
                <thead>
                  <tr className="bg-paper-2 border-b border-rule">
                    <th className="py-3 px-4 font-semibold text-ink">Feature</th>
                    <th className="py-3 px-4 font-semibold text-ink">Compromise Agreement (Pre-2013)</th>
                    <th className="py-3 px-4 font-semibold text-ink">Settlement Agreement (Current)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Governing statute</td>
                    <td className="py-3 px-4 text-muted">ERA 1996 Section 203(3)</td>
                    <td className="py-3 px-4 text-ink">ERA 1996 s.203(3) as amended by ERRA 2013</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Pre-termination talks</td>
                    <td className="py-3 px-4 text-muted">Needed an existing dispute (Without Prejudice)</td>
                    <td className="py-3 px-4 text-ink">Section 111A (ordinary unfair dismissal only)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Independent legal advice</td>
                    <td className="py-3 px-4 text-muted">Mandatory from an insured adviser</td>
                    <td className="py-3 px-4 text-ink">Mandatory from an insured adviser</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Legal fee contribution</td>
                    <td className="py-3 px-4 text-muted">Capped contribution (£350 to £500+ plus VAT)</td>
                    <td className="py-3 px-4 text-ink">Capped contribution upon completion</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Tax exemption limit</td>
                    <td className="py-3 px-4 text-muted">First £30,000 tax-free (ITEPA 2003 s.403)</td>
                    <td className="py-3 px-4 text-ink">First £30,000 tax-free (ITEPA 2003 s.403)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted">
              Source: Section 23 Enterprise and Regulatory Reform Act 2013. The name change did not alter employee rights.
            </p>
          </div>
        </section>

        {/* 5 Statutory Requirements */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What makes a compromise agreement legally binding?</h2>
            <p className="sc-body mb-6">
              You cannot waive statutory employment rights in an informal chat. Under Section 203(3) of the Employment Rights Act 1996, all five conditions below must be met:
            </p>
            <div className="space-y-4">
              <div className="p-5 rounded-lg border border-rule bg-white">
                <h3 className="text-base font-semibold text-ink mb-1">1. The agreement must be in writing</h3>
                <p className="sc-body">
                  A verbal offer or text exchange cannot waive your rights. The full terms must be set out in a written contract.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-rule bg-white">
                <h3 className="text-base font-semibold text-ink mb-1">2. Specific complaints must be listed</h3>
                <p className="sc-body">
                  The contract must name the particular tribunal claims being settled. Broad wording like &ldquo;all future claims&rdquo; is not enforceable.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-rule bg-white">
                <h3 className="text-base font-semibold text-ink mb-1">3. Advice from an independent, insured solicitor</h3>
                <p className="sc-body">
                  You must take advice from a qualified, independent adviser (such as an SRA-regulated solicitor) who holds current indemnity insurance.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-rule bg-white">
                <h3 className="text-base font-semibold text-ink mb-1">4. The adviser must be named</h3>
                <p className="sc-body">
                  The agreement must identify your solicitor and their firm, and include a signed adviser certificate.
                </p>
              </div>
              <div className="p-5 rounded-lg border border-rule bg-white">
                <h3 className="text-base font-semibold text-ink mb-1">5. Statutory conditions must be confirmed</h3>
                <p className="sc-body">
                  The document must state that all Section 203(3) statutory conditions regulating settlement agreements have been satisfied.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Calculation Framework */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How much should my compromise agreement pay?</h2>
            <p className="sc-body mb-6">
              Every payout is built from four separate parts. Statutory baselines apply only if you meet qualifying continuous service rules, have no gross misconduct finding, and have not refused suitable alternative work under ERA 1996 s.141.
            </p>
            <div className="space-y-4">
              <div className="p-5 rounded-lg border border-rule bg-paper-2/40">
                <h3 className="text-base font-semibold text-ink mb-2">1. Statutory redundancy baseline</h3>
                <p className="sc-body mb-2">
                  If you have 2 or more complete years of service and your role is redundant, your baseline uses complete years (capped at 20) and your age:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>0.5 weeks of pay per year under age 22.</li>
                  <li>1.0 week of pay per year between ages 22 and 40.</li>
                  <li>1.5 weeks of pay per year aged 41 and over.</li>
                </ul>
                <p className="sc-body mt-3">
                  Under SI 2026/310, weekly pay is capped at £751 from 6 April 2026 (£783 in Northern Ireland). The maximum statutory redundancy sum in Great Britain is £22,530.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-rule bg-paper-2/40">
                <h3 className="text-base font-semibold text-ink mb-2">2. Notice pay or garden leave</h3>
                <p className="sc-body">
                  Your employer must account for your contractual or statutory notice period, whichever is longer. Whether you work your notice, take garden leave, or receive Pay in Lieu of Notice (PILON), notice pay is taxed as wages.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-rule bg-paper-2/40">
                <h3 className="text-base font-semibold text-ink mb-2">3. Accrued untaken holiday pay</h3>
                <p className="sc-body">
                  You are entitled to pay for accrued, untaken statutory and contractual holiday up to your leaving date. This is also taxed as wages.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-rule bg-paper-2/40">
                <h3 className="text-base font-semibold text-ink mb-2">4. Ex-gratia compensation payment</h3>
                <p className="sc-body">
                  This is any extra sum offered on top of statutory and contractual pay for waiving claims. For context, the April 2026 statutory compensatory cap for ordinary unfair dismissal is £123,543 or 52 weeks of gross pay under SI 2026/310.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Worked Example */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What does a real 2026 payout breakdown look like?</h2>
            <p className="sc-body mb-6">
              Take an employee aged 43 with 8 years of service, earning £62,400 (£1,200/week), a 3-month notice period (13 weeks), and 5 days of untaken holiday.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6 shadow-sm">
              <div className="bg-ink px-4 py-3">
                <p className="text-white text-sm font-semibold">Illustrative 2026 compromise agreement breakdown</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-paper-2 border-b border-rule text-ink">
                      <th className="text-left px-4 py-3 font-semibold">Component</th>
                      <th className="text-left px-4 py-3 font-semibold">Basis</th>
                      <th className="text-left px-4 py-3 font-semibold">Gross</th>
                      <th className="text-left px-4 py-3 font-semibold">Tax treatment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule bg-white">
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Statutory Redundancy</td>
                      <td className="px-4 py-3 text-muted">8 yrs x 1.5 x £751 cap</td>
                      <td className="px-4 py-3 font-semibold text-ink">£9,012.00</td>
                      <td className="px-4 py-3 text-ink">Tax-free (ITEPA s.403)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Notice Pay (PILON)</td>
                      <td className="px-4 py-3 text-muted">13 weeks x £1,200</td>
                      <td className="px-4 py-3 font-semibold text-ink">£15,600.00</td>
                      <td className="px-4 py-3 text-ink">Taxed as wages (s.402D)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Untaken Holiday</td>
                      <td className="px-4 py-3 text-muted">1 week (5 days)</td>
                      <td className="px-4 py-3 font-semibold text-ink">£1,200.00</td>
                      <td className="px-4 py-3 text-ink">Taxed as wages</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-medium text-ink">Ex-Gratia Sum</td>
                      <td className="px-4 py-3 text-muted">Agreed compensation</td>
                      <td className="px-4 py-3 font-semibold text-ink">£15,600.00</td>
                      <td className="px-4 py-3 text-ink">Tax-free (under £30k)</td>
                    </tr>
                    <tr className="bg-paper font-semibold text-ink">
                      <td className="px-4 py-3">Total Gross Sum</td>
                      <td className="px-4 py-3 text-muted">Combined payout</td>
                      <td className="px-4 py-3 text-coral font-bold text-base">£41,412.00</td>
                      <td className="px-4 py-3">£24,612 tax-free</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 font-medium text-ink">Legal fee contribution</td>
                      <td className="px-4 py-3 text-muted">Capped contribution</td>
                      <td className="px-4 py-3 font-semibold text-ink">£500.00 + VAT</td>
                      <td className="px-4 py-3 text-ink">Paid to solicitor on completion</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <p className="sc-body text-muted">
              Here, total termination compensation is £24,612 (£9,012 redundancy plus £15,600 ex-gratia). Because £24,612 sits under the £30,000 limit in ITEPA 2003 s.403, that part is free of income tax and National Insurance.
            </p>
          </div>
        </section>

        {/* Tax Rules */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How much will HMRC take from my payout?</h2>
            <p className="sc-body mb-6">
              Knowing which parts of your offer are taxed as wages helps you estimate your net take-home figure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="text-base font-semibold text-ink mb-3">Usually tax-free up to £30,000</h3>
                <ul className="text-sm text-muted space-y-2.5">
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    <span>Statutory redundancy payments.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    <span>Enhanced redundancy compensation.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    <span>Ex-gratia payments for loss of office.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckIcon />
                    <span>Injury to feelings directly tied to termination.</span>
                  </li>
                </ul>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="text-base font-semibold text-ink mb-3">Taxed as wages (Income Tax &amp; NI)</h3>
                <ul className="text-sm text-muted space-y-2.5">
                  <li className="flex items-start gap-2">
                    <AlertIcon />
                    <span>Pay in Lieu of Notice (PILON / PENP).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertIcon />
                    <span>Garden leave salary and overtime.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertIcon />
                    <span>Accrued but untaken holiday pay.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertIcon />
                    <span>Contractual bonuses or commission.</span>
                  </li>
                </ul>
              </div>
            </div>
            <p className="sc-body">
              Under Section 402D of ITEPA 2003, Post-Employment Notice Pay (PENP) rules treat unworked notice as earnings. Your employer must deduct income tax and employee National Insurance before paying notice sums.
            </p>
          </div>
        </section>

        {/* Descriptive Discussion Process */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What happens if you want to discuss a higher offer?</h2>
            <p className="sc-body mb-6">
              Before responding to HR, most employees check their statutory numbers and speak with an independent solicitor first. Here is how that process usually works:
            </p>
            <ol className="flex flex-col gap-5">
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Check your statutory baseline</h3>
                  <p className="sc-body">
                    Calculate your statutory redundancy (if eligible), notice pay, and untaken holiday. This gives you an objective baseline to compare against the draft offer.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Check the deadline and ACAS guidance</h3>
                  <p className="sc-body">
                    ACAS Code of Practice 4 recommends 10 calendar days as general guidance. However, it is not a binding legal right, and employers can withdraw an unaccepted offer or set shorter deadlines (Routledge v Grant).
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Speak to an SRA-regulated solicitor first</h3>
                  <p className="sc-body">
                    Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) upon completion. Work above the cap or abortive work remains subject to your solicitor&apos;s engagement terms.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Protect legal privilege before replying</h3>
                  <p className="sc-body">
                    Sending written counter-offers directly to HR can waive privilege or reject the original offer under Hyde v Wrench. Prepare a summary of figures to review with your solicitor before any reply goes out.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Review non-financial clauses</h3>
                  <p className="sc-body">
                    Questions to raise with your solicitor include agreed job references, garden leave dates, confidentiality wording, and whether any non-compete clauses affect your next role.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Want to check your own figures against 2026 rules?</h2>
            <p className="sc-lead mb-6 text-paper/85">
              See your statutory baseline, notice pay tax split, and illustrative UK range in under two minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculator/" className="btn-accent">
                Check my offer now →
              </Link>
              <Link href="/redundancy-calculator/" className="btn-secondary">
                Calculate my redundancy →
              </Link>
            </div>
            <p className="text-xs text-paper/75 max-w-lg mx-auto mt-4 leading-relaxed">
              Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion (extra or abortive work depends on your solicitor&apos;s engagement terms).
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">What else should you know about compromise agreements?</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
          <DynamicFaqSection pathname="/guides/compromise-agreement-calculator-uk/" />
        </section>

        {/* References */}
        <section className="py-12 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2013/24/section/23" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Enterprise and Regulatory Reform Act 2013, Section 23
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/141" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 141
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/acas-code-of-practice-on-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  ACAS Code of Practice 4 on Settlement Agreements
                </a>
              </li>
            </ol>
          </div>
        </section>

        {/* Related Articles */}
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles items={RELATED_GUIDES} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
