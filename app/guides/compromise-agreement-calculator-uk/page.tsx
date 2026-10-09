import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Compromise Agreement Calculator UK 2026 | SettlementCheck',
  description:
    'Calculate your compromise agreement payout under 2026 UK statutory rules (£751 cap). Redundancy, PILON, and tax-free breakdown. Free, no email required.',
  alternates: {
    canonical: '/guides/compromise-agreement-calculator-uk/',
  },
  openGraph: {
    title: 'Compromise Agreement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate your compromise agreement payout under 2026 UK statutory rules (£751 cap). Redundancy, PILON, and tax-free breakdown. Free, no email required.',
    url: '/guides/compromise-agreement-calculator-uk/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compromise Agreement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate your compromise agreement payout under 2026 UK statutory rules (£751 cap). Redundancy, PILON, and tax-free breakdown. Free, no email required.',
  },
}

const FAQS = [
  {
    q: 'What is the difference between a compromise agreement and a settlement agreement?',
    a: 'There is no legal difference today. Under Section 23 of the Enterprise and Regulatory Reform Act 2013, compromise agreements were legally renamed settlement agreements on 29 July 2013. The underlying legal mechanism remains identical under Section 203(3) of the Employment Rights Act 1996.',
  },
  {
    q: 'How is a compromise agreement payout calculated?',
    a: 'A compromise agreement calculation combines statutory redundancy pay, contractual notice pay, accrued untaken holiday pay, and an ex-gratia compensation payment. The ex-gratia amount reflects your length of service, your salary, and the potential legal risk to the employer.',
  },
  {
    q: 'Do I have to pay tax on a compromise agreement payment?',
    a: 'Under Section 403 of ITEPA 2003, genuine compensation payments for loss of employment are tax-free up to £30,000. Contractual earnings, accrued holiday pay, and Pay in Lieu of Notice (PILON) under Section 402D remain fully subject to income tax and National Insurance.',
  },
  {
    q: 'Who pays the legal fees for a compromise agreement?',
    a: 'Your employer covers the legal fees for your independent legal advice. Under Section 203(3) of the Employment Rights Act 1996, you must receive advice from a qualified solicitor before signing. Employers typically contribute between £350 and £750 plus VAT directly to your solicitor.',
  },
  {
    q: 'Can I reject a compromise agreement offer?',
    a: 'Yes. A compromise agreement is voluntary. You are under no legal obligation to sign. If you reject the offer, your employer must follow a standard formal process such as redundancy consultation or performance management.',
  },
  {
    q: 'How long do I get to consider a compromise agreement?',
    a: 'Under ACAS Code of Practice 1, employers should allow a minimum of 10 calendar days for employees to consider the formal written offer and obtain independent legal advice.',
  },
  {
    q: 'What is the statutory weekly pay cap in 2026?',
    a: 'From 6 April 2026, the statutory weekly pay cap is £751 in Great Britain under SI 2026/310. In Northern Ireland, the statutory cap is £783 under SR 2026/57. The maximum statutory redundancy payment is £22,530.',
  },
  {
    q: 'Can my employer dismiss me for asking for a higher payout?',
    a: 'Negotiating a compromise agreement is a standard discussion. An employer cannot legally dismiss you simply for proposing a counter-offer. If negotiations do not reach an agreement, the employer must resume a formal workplace process.',
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
  dateModified: '2026-10-03',
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
    description: 'Learn how to assess whether an employer offer matches typical UK market ranges.',
    tag: 'Valuation',
  },
  {
    href: '/guides/how-to-negotiate-a-settlement-agreement/',
    title: 'How to Negotiate a Settlement Agreement',
    description: 'Practical steps, counter-offer tactics, and negotiation rules for employees.',
    tag: 'Negotiation',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
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
              <span className="text-xs text-ink truncate">Compromise Agreement Calculator</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Statutory Agreement Calculator &amp; Guide</p>
            <h1 className="sc-h1 mb-5">
              Compromise Agreement Calculator UK: 2026 Rules &amp; Payout Guide
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>SettlementCheck Legal Analysis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Statutory baseline: SI 2026/310</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              A compromise agreement is the former legal name for a settlement agreement in the UK. Under Section 23 of the Enterprise and Regulatory Reform Act 2013, the document was officially renamed on 29 July 2013. The underlying legal framework remains identical under Section 203(3) of the Employment Rights Act 1996. It is a binding contract where an employee waives employment tribunal rights in return for a compensation payout.
            </p>
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
                  ERRA 2013 &amp; ERA 1996 s.203
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                How is a compromise agreement calculated in 2026?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                A compromise agreement calculation combines statutory redundancy, notice pay, untaken holiday, and an ex-gratia compensation payment. Under Section 403 of ITEPA 2003, the first £30,000 of compensation is tax-free. Your employer also covers your independent solicitor fees under Section 203(3) of the Employment Rights Act 1996.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Pay Cap</span>
                  <span className="font-bold text-ink text-sm">£751 Per Week</span>
                  <span className="text-muted text-[11px]">SI 2026/310 (Max statutory redundancy £22,530)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax-Free Exemption</span>
                  <span className="font-bold text-ink text-sm">First £30,000 Tax-Free</span>
                  <span className="text-muted text-[11px]">Section 403 of ITEPA 2003</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Notice Pay (PILON)</span>
                  <span className="font-bold text-ink text-sm">Fully Taxable as Earnings</span>
                  <span className="text-muted text-[11px]">Taxed under Post-Employment Notice rules</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Independent Legal Advice</span>
                  <span className="font-bold text-ink text-sm">Paid by Your Employer</span>
                  <span className="text-muted text-[11px]">Typically £350 to £750 + VAT direct contribution</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.203(3)</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check draft agreement clauses →
                  </Link>
                  <Link href="/calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my compromise payout →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core facts callout */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-6">
              <p className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">Key facts for 2026</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Identical legal status:</strong> Compromise agreements and settlement agreements are legally identical documents governed by Section 203(3) of the Employment Rights Act 1996.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Employer covers legal fees:</strong> Independent legal advice is mandatory. Your employer covers the legal fees, typically contributing £350 to £750 plus VAT directly to your solicitor.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>2026 statutory rates:</strong> From 6 April 2026, weekly pay is capped at £751 in Great Britain (SI 2026/310) and £783 in Northern Ireland (SR 2026/57). Maximum statutory redundancy pay is £22,530.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>£30,000 tax exemption:</strong> The first £30,000 of compensation for loss of employment is tax-free under ITEPA 2003 s.403. Notice pay remains fully taxable under Section 402D.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>10-day consideration period:</strong> Under the ACAS Code of Practice, employers must allow a minimum of 10 calendar days to consider the written proposal.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Definition Section */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What is a compromise agreement in the UK?</h2>
            <div className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule">
              A compromise agreement is a legally binding contract between an employer and an employee that settles workplace disputes and terminates employment. The employee agrees to waive their rights to bring claims before an employment tribunal. In return, the employer provides a compensation payment, an agreed reference, and pays for the employee's independent legal advice.
            </div>
            <p className="sc-body mb-4">
              The Enterprise and Regulatory Reform Act 2013 renamed these documents to settlement agreements on 29 July 2013. The change also introduced Section 111A of the Employment Rights Act 1996. This section allows employers and employees to hold confidential pre-termination negotiations before any formal workplace dispute arises.
            </p>
            <p className="sc-body mb-4">
              Many employers, HR departments, and employment contracts still use the phrase compromise agreement. This terminology persists through habit, legacy employee handbooks, and older contract templates.
            </p>
            <p className="sc-body">
              Regardless of the name printed on the document, the contract is governed by Section 203(3) of the Employment Rights Act 1996. Its legal power to settle employment claims remains exactly the same.
            </p>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Compromise agreement vs settlement agreement: What is the difference?</h2>
            <p className="sc-body mb-6">
              The table below compares the historical compromise agreement with the modern settlement agreement in force today.
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
                    <td className="py-3 px-4 text-ink font-medium">Pre-termination discussions</td>
                    <td className="py-3 px-4 text-muted">Required an existing dispute under Without Prejudice</td>
                    <td className="py-3 px-4 text-ink">Permitted under Section 111A without an existing dispute</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Independent legal advice</td>
                    <td className="py-3 px-4 text-muted">Mandatory by an insured qualified adviser</td>
                    <td className="py-3 px-4 text-ink">Mandatory by an insured qualified adviser</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Employer fee contribution</td>
                    <td className="py-3 px-4 text-muted">Covered by employer (£350 to £750 typical)</td>
                    <td className="py-3 px-4 text-ink">Covered by employer (£350 to £750 typical)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Tax exemption limit</td>
                    <td className="py-3 px-4 text-muted">First £30,000 tax-free (ITEPA 2003 s.403)</td>
                    <td className="py-3 px-4 text-ink">First £30,000 tax-free (ITEPA 2003 s.403)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Legal effect</td>
                    <td className="py-3 px-4 text-muted">Settles specified tribunal claims</td>
                    <td className="py-3 px-4 text-ink">Settles specified tribunal claims</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="sc-body text-sm text-muted">
              Source: Section 23 Enterprise and Regulatory Reform Act 2013. The change in terminology did not alter an employee's statutory rights.
            </p>
          </div>
        </section>

        {/* 5 Statutory Requirements */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The 5 statutory conditions for a valid agreement</h2>
            <p className="sc-body mb-6">
              Employees cannot contract out of their statutory employment rights through an informal chat. Under Section 203(3) of the Employment Rights Act 1996, five conditions must be met for an agreement to be binding:
            </p>
            <div className="space-y-4">
              <div className="p-5 rounded-xl border border-rule bg-paper">
                <p className="font-semibold text-ink text-sm mb-1">1. The agreement must be in writing</p>
                <p className="sc-body text-sm">
                  A verbal offer or exchange of text messages cannot waive employment rights. The agreement must exist as a full written contract detailing every term.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-rule bg-paper">
                <p className="font-semibold text-ink text-sm mb-1">2. Particular complaints must be specified</p>
                <p className="sc-body text-sm">
                  The document must list the specific employment tribunal claims being settled. Broad phrases like "all future claims whatsoever" are legally unenforceable.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-rule bg-paper">
                <p className="font-semibold text-ink text-sm mb-1">3. Advice from an independent, insured adviser</p>
                <p className="sc-body text-sm">
                  The employee must receive advice from a qualified, independent adviser, such as a solicitor. The adviser must hold current professional indemnity insurance covering the advice.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-rule bg-paper">
                <p className="font-semibold text-ink text-sm mb-1">4. The adviser must be identified</p>
                <p className="sc-body text-sm">
                  The agreement must name the specific solicitor and their legal practice. The adviser signs an adviser certificate attached to the final document.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-rule bg-paper">
                <p className="font-semibold text-ink text-sm mb-1">5. Statutory conditions must be stated as satisfied</p>
                <p className="sc-body text-sm">
                  The contract must contain an express clause confirming that all statutory conditions regulating settlement agreements under Section 203(3) have been met.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Calculation Framework */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How is a compromise agreement calculated?</h2>
            <p className="sc-body mb-6">
              A standard settlement payout consists of four separate components. Each component follows different legal formulas and tax rules.
            </p>
            <div className="space-y-4 mb-8">
              <div className="p-5 rounded-xl border border-rule bg-white shadow-sm">
                <h3 className="font-semibold text-ink text-base mb-2">Component 1: Statutory redundancy pay floor</h3>
                <p className="sc-body text-sm mb-2">
                  If your role is redundant, your statutory redundancy pay forms your legal baseline. The formula uses complete years of service (up to 20 years) and an age multiplier:
                </p>
                <ul className="list-disc pl-5 text-sm text-muted space-y-1">
                  <li>0.5 weeks of pay per year under age 22.</li>
                  <li>1.0 week of pay per year between ages 22 and 40.</li>
                  <li>1.5 weeks of pay per year aged 41 and over.</li>
                </ul>
                <p className="sc-body text-sm mt-2 text-ink">
                  Under SI 2026/310, weekly statutory pay is capped at £751 from 6 April 2026. The maximum statutory redundancy payout is £22,530.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rule bg-white shadow-sm">
                <h3 className="font-semibold text-ink text-base mb-2">Component 2: Notice pay (PILON)</h3>
                <p className="sc-body text-sm">
                  Your employer must pay for your contractual notice period or statutory notice period, whichever is longer. Under Post-Employment Notice Pay rules, notice pay is always fully subject to tax and National Insurance.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rule bg-white shadow-sm">
                <h3 className="font-semibold text-ink text-base mb-2">Component 3: Accrued holiday pay and unpaid salary</h3>
                <p className="sc-body text-sm">
                  You are legally entitled to compensation for all accrued, untaken statutory and contractual holiday up to your final termination date. This is taxed as standard earnings.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rule bg-white shadow-sm">
                <h3 className="font-semibold text-ink text-base mb-2">Component 4: Ex-gratia compensation payment</h3>
                <p className="sc-body text-sm">
                  This is the discretionary compensation amount negotiated on top of statutory minimums. It reflects the value of waiving your employment claims. For ordinary unfair dismissal, the statutory compensatory award cap is £123,543 or 52 weeks of gross salary under SI 2026/310.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Worked Example */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked example: 2026 compromise agreement calculation</h2>
            <p className="sc-body mb-6">
              Consider an employee aged 43 with 8 years of continuous service. Their annual salary is £62,400 (£1,200 gross per week). They have a 3-month notice period (13 weeks) and 5 days of untaken holiday.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6 shadow-sm">
              <div className="bg-ink px-4 py-3">
                <p className="text-white text-sm font-medium">Compromise agreement calculation breakdown</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-paper-2 border-b border-rule text-ink">
                    <th className="text-left px-4 py-3 font-semibold">Payment component</th>
                    <th className="text-left px-4 py-3 font-semibold">Calculation basis</th>
                    <th className="text-left px-4 py-3 font-semibold">Gross amount</th>
                    <th className="text-left px-4 py-3 font-semibold">Tax treatment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Statutory Redundancy Pay</td>
                    <td className="px-4 py-3 text-muted">8 yrs x 1.5 x £751 cap</td>
                    <td className="px-4 py-3 font-semibold text-ink">£9,012.00</td>
                    <td className="px-4 py-3 text-ink">Tax-free (ITEPA s.403)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Notice Pay (PILON)</td>
                    <td className="px-4 py-3 text-muted">13 weeks x £1,200 gross</td>
                    <td className="px-4 py-3 font-semibold text-ink">£15,600.00</td>
                    <td className="px-4 py-3 text-ink">Taxable (ITEPA s.402D)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Accrued Holiday Pay</td>
                    <td className="px-4 py-3 text-muted">1 week (5 days) untaken</td>
                    <td className="px-4 py-3 font-semibold text-ink">£1,200.00</td>
                    <td className="px-4 py-3 text-ink">Taxable as earnings</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">Ex-Gratia Compensation</td>
                    <td className="px-4 py-3 text-muted">Negotiated compensation sum</td>
                    <td className="px-4 py-3 font-semibold text-ink">£15,600.00</td>
                    <td className="px-4 py-3 text-ink">Tax-free (within £30k)</td>
                  </tr>
                  <tr className="bg-paper font-semibold text-ink">
                    <td className="px-4 py-3">Total Gross Settlement</td>
                    <td className="px-4 py-3 text-muted">Combined agreement sum</td>
                    <td className="px-4 py-3 text-coral font-bold text-base">£41,412.00</td>
                    <td className="px-4 py-3">£24,612 tax-free</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium text-ink">Legal fee contribution</td>
                    <td className="px-4 py-3 text-muted">Paid direct to solicitor</td>
                    <td className="px-4 py-3 font-semibold text-ink">£500.00 + VAT</td>
                    <td className="px-4 py-3 text-ink">Employer pays directly</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="sc-body text-sm text-muted">
              In this scenario, total termination compensation is £24,612 (£9,012 statutory redundancy plus £15,600 ex-gratia compensation). Because £24,612 is under the £30,000 threshold under Section 403 of ITEPA 2003, the full amount is exempt from income tax and National Insurance.
            </p>
          </div>
        </section>

        {/* Tax Rules */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax rules on compromise agreement payouts</h2>
            <p className="sc-body mb-4">
              Understanding which payments qualify for tax exemption helps you evaluate your net take-home figure.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-5 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-sm mb-2">Payments qualifying for £30,000 exemption</p>
                <ul className="text-sm text-muted space-y-2">
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
                    <span>Compensation for hurt feelings directly linked to termination.</span>
                  </li>
                </ul>
              </div>
              <div className="p-5 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-sm mb-2">Payments subject to income tax and NI</p>
                <ul className="text-sm text-muted space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertIcon />
                    <span>Pay in Lieu of Notice (PILON / PENP).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertIcon />
                    <span>Outstanding salary and overtime pay.</span>
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
            <p className="sc-body text-sm">
              Under Section 402D of ITEPA 2003, Post-Employment Notice Pay rules treat any payment representing notice as earnings. Employers must deduct income tax and employee National Insurance at source before releasing notice funds.
            </p>
          </div>
        </section>

        {/* 5 Steps to Negotiate */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How to negotiate a compromise agreement</h2>
            <p className="sc-body mb-6">
              Follow these practical steps to assess your position and negotiate a fair outcome.
            </p>
            <ol className="flex flex-col gap-5">
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Calculate your statutory floor</p>
                  <p className="sc-body text-sm">
                    Calculate your statutory redundancy entitlement, contractual notice pay, and untaken holiday. This total represents your absolute legal minimum. Any settlement must sit above this floor.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Take your 10-day consideration period</p>
                  <p className="sc-body text-sm">
                    Do not sign immediately. Under ACAS Code of Practice 1, you are entitled to at least 10 calendar days to review the proposal and take legal advice.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Instruct an independent solicitor</p>
                  <p className="sc-body text-sm">
                    Choose a specialist employment solicitor. Your employer covers the legal fees for this advice under the agreement terms.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Submit a factual counter-proposal</p>
                  <p className="sc-body text-sm">
                    Identify procedural flaws, unexpired notice periods, or potential employment claims. Present a realistic counter-offer based on the time required to find new employment.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                <div>
                  <p className="text-sm font-semibold text-ink mb-1">Agree non-financial terms</p>
                  <p className="sc-body text-sm">
                    Negotiate non-financial clauses alongside the payout. Ensure you secure an agreed job reference, mutual confidentiality, non-derogatory covenants, and waiver of restrictive covenants where appropriate.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Calculate where your compromise agreement stands</h2>
            <p className="sc-lead mb-6 text-paper" style={{ color: 'rgba(247,244,238,0.85)' }}>
              Use our free UK settlement calculator to check your statutory entitlement, tax-free allowances, and typical payout range under 2026 rules.
            </p>
            <Link href="/calculator/" className="btn-accent">
              Calculate my settlement payout →
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
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
                  ACAS Code of Practice 1 on Settlement Agreements
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
