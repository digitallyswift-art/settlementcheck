import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Protective Award Calculator & Rules 2026 | SettlementCheck',
  description:
    'Calculate up to 90 days gross pay for collective redundancy consultation failure. Free calculator, solvent vs insolvent rules, and 2026 statutory caps.',
  alternates: {
    canonical: '/guides/protective-award/',
  },
  openGraph: {
    title: 'Protective Award Calculator & Rules 2026 | SettlementCheck',
    description:
      'Calculate up to 90 days gross pay for collective redundancy consultation failure. Free calculator, solvent vs insolvent rules, and 2026 statutory caps.',
    url: '/guides/protective-award/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protective Award Calculator & Rules 2026 | SettlementCheck',
    description:
      'Calculate up to 90 days gross pay for collective redundancy consultation failure. Free calculator, solvent vs insolvent rules, and 2026 statutory caps.',
  },
}

const FAQS = [
  {
    q: 'Can you claim a protective award if your employer is insolvent?',
    a: 'Yes, you can claim from the Insolvency Service. However, payments from the Insolvency Service are capped at a maximum of 8 weeks of pay, and the weekly pay is capped at the statutory limit of £751 in Great Britain (£783 in Northern Ireland).',
  },
  {
    q: 'What is the time limit for claiming a protective award?',
    a: 'You must start the ACAS early conciliation process within 3 months minus 1 day from the date of your dismissal. Missing this deadline means you will lose the right to claim.',
  },
  {
    q: 'Do you pay tax on a protective award?',
    a: 'Yes. A protective award is treated as part of your termination payment. It is tax-free if your total termination payments (including redundancy pay and ex-gratia payments) fall under the £30,000 threshold. Any amount over £30,000 is subject to income tax.',
  },
  {
    q: 'Can you claim a protective award if you sign a settlement agreement?',
    a: 'No. Settlement agreements contain a waiver where you agree to settle all tribunal claims. This waiver includes any potential protective award claims. If you are offered a settlement, you should check whether the amount compensates you fairly for any failure to consult.',
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
  headline: 'Protective Award Redundancy Claims: 90 Days Pay Calculator & 2026 Rules',
  url: 'https://settlementcheck.co.uk/guides/protective-award/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-23',
  dateModified: '2026-07-11',
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
      url: 'https://settlementcheck.co.uk/logo.png',
    },
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/protective-award/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Trade Union and Labour Relations (Consolidation) Act 1992, Section 188',
      url: 'https://www.legislation.gov.uk/ukpga/1992/52/section/188',
    },
    {
      '@type': 'Legislation',
      name: 'Trade Union and Labour Relations (Consolidation) Act 1992, Section 189',
      url: 'https://www.legislation.gov.uk/ukpga/1992/52/section/189',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 162',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/162',
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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
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

export default function ProtectiveAwardGuide() {
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
              <span className="text-xs text-ink truncate">Protective Award</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Statutory Redundancy Rights &amp; Calculator</p>
            <h1 className="sc-h1 mb-5">
              Protective Award Redundancy Claims: 90 Days Pay Calculator &amp; 2026 Rules
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>SettlementCheck Legal Analysis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Statutory baseline: SI 2026/310</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              A protective award is tribunal compensation of up to 90 days gross pay for collective redundancy consultation failures. Under Section 189 of the Trade Union and Labour Relations (Consolidation) Act 1992, you can claim this if your employer fails to consult before making 20 or more redundancies. This guide explains how the award is calculated and how you can claim.
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
                  TULRCA 1992 s.189 &amp; ERA 1996 s.184
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                What is a protective award and how much can you claim?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                A protective award is compensation of up to 90 days gross pay for failure to consult collectively. If your employer is trading, the award is based on your actual gross earnings with no statutory cap. If your employer is insolvent, payments from the Insolvency Service are capped at 8 weeks of pay (£751 per week in Great Britain). You must start ACAS Early Conciliation within 3 months minus 1 day from your dismissal.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Maximum Tribunal Award</span>
                  <span className="font-bold text-ink text-sm">Up to 90 Days Pay</span>
                  <span className="text-muted text-[11px]">TULRCA 1992 s.189 (~12.86 weeks)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Solvent Employer Cap</span>
                  <span className="font-bold text-ink text-sm">Uncapped Actual Gross Pay</span>
                  <span className="text-muted text-[11px]">Liable directly against trading company</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Insolvent Employer Cap</span>
                  <span className="font-bold text-ink text-sm">Max £6,008 (8 wks @ £751)</span>
                  <span className="text-muted text-[11px]">Paid by Insolvency Service (GB rate)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Limitation Period</span>
                  <span className="font-bold text-ink text-sm">3 Months Less 1 Day</span>
                  <span className="text-muted text-[11px]">Strict ACAS Early Conciliation deadline</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>TULRCA 1992 Section 189</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check draft agreement clauses →
                  </Link>
                  <Link href="/protective-award-calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my protective award →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key rules for protective awards</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Applies when your employer proposes 20 or more redundancies at one establishment within 90 days.',
                  'Tribunals can award up to 90 days of actual gross pay, which is uncapped for solvent employers.',
                  'If the employer goes bust, the Insolvency Service caps payments at 8 weeks of pay (£751 per week).',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What is a protective award? */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What Is a Protective Award?</h2>
            <div className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule font-medium">
              A protective award is compensation of up to 90 days&apos; actual gross pay ordered by an Employment Tribunal when an employer fails to consult collectively before making 20 or more employees redundant. It is claimed under Section 189 of the Trade Union and Labour Relations (Consolidation) Act 1992 <sup>1</sup> and is separate from statutory redundancy pay.
            </div>
            <p className="sc-body mb-4">
              When your employer proposes 20 or more redundancies at one establishment within a 90-day period, they have a statutory duty to consult collectively. Under Section 188 of the Act <sup>3</sup>, they must consult with recognized trade unions or elected employee representatives.
            </p>
            <p className="sc-body mb-4">
              This collective consultation must start at least 30 days before the first dismissal (if proposing 20 to 99 redundancies) or 45 days (if proposing 100 or more redundancies).
            </p>
            <p className="sc-body">
              If your employer fails to consult properly, or fails to consult at all, you can take them to an employment tribunal. If successful, the tribunal will issue a protective award under Section 189 <sup>1</sup>. This is a payment designed to penalize the employer for breaching their statutory duties.
            </p>
          </div>
        </section>

        {/* How much is it? */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How Much Can You Receive?</h2>
            <p className="sc-body mb-6">
              The maximum protective award is 90 days&apos; gross pay per affected employee. The exact award depends on whether your employer is solvent or insolvent, and the level of consultation failure.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Employer Status</th>
                    <th className="text-left px-4 py-3 font-medium">Calculation Rule</th>
                    <th className="text-left px-4 py-3 font-medium">2026 Statutory Limits</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Trading (Solvent)',
                      'Based on your actual gross weekly pay. No statutory cap applies.',
                      'Capped only by the tribunal discretion up to the 90-day maximum <sup>1</sup>.',
                    ],
                    [
                      'Insolvent (Bust)',
                      'Paid by the Insolvency Service. Subject to statutory limits.',
                      'Capped at a maximum of 8 weeks of pay <sup>4</sup> at <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">£751 per week</Link> in GB <sup>2</sup> (£783 in NI <sup>5</sup>).',
                    ],
                  ].map(([status, rule, limit], i) => (
                    <tr key={status} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{status}</td>
                      <td className="px-4 py-3 text-ink">{rule}</td>
                      <td className="px-4 py-3 text-ink" dangerouslySetInnerHTML={{ __html: limit }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sc-body">
              The tribunal starts by assuming the maximum 90 days is appropriate. It is up to the employer to prove why they could not consult, such as in sudden and unavoidable business closures. However, insolvency on its own is not a valid excuse for failing to consult.
            </p>
          </div>
        </section>

        {/* The Employment Rights Bill 2024-25 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The Employment Rights Bill: Proposed Changes</h2>
            <p className="sc-body mb-4">
              The UK Government has introduced the Employment Rights Bill 2024-25, which proposes significant changes to collective redundancy consultation rules <sup>6</sup>.
            </p>
            <p className="sc-body mb-4">
              These proposals include doubling the maximum protective award from 90 days to 180 days. They also propose removing the requirement that the 20 redundancies must occur at one establishment. Under these proposals, the redundancies would be calculated across the entire business, preventing employers from avoiding consultation by splitting layoffs across different offices.
            </p>
            <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
              <AlertIcon />
              <p className="text-sm text-ink leading-relaxed">
                <strong>These changes are not yet in force.</strong> The proposals under the Employment Rights Bill 2024-25 have not commenced. The current law remains active, meaning the maximum protective award is 90 days&apos; pay, and the requirement for redundancies to be at one establishment still applies.
              </p>
            </div>
          </div>
        </section>

        {/* Worked Examples */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Examples: Solvent vs Insolvent Awards</h2>
            <p className="sc-body mb-6">
              These two examples demonstrate how a protective award is calculated depending on your employer&apos;s financial situation.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Solvent Employer (Company is trading)',
                  points: [
                    'Your gross weekly pay is £1,000. Your employer makes 30 people redundant without consultation.',
                    'The tribunal awards the maximum 90 days (approximately 12.8 weeks) of gross pay.',
                    'Because the employer is solvent, the calculation uses your actual pay. You receive a payment of £12,800 gross.',
                  ],
                },
                {
                  title: 'Example 2: Insolvent Employer (Company has gone bust)',
                  points: [
                    'Your gross weekly pay is £1,000. Your employer goes bust and enters administration, failing to consult.',
                    'The tribunal awards a 90-day protective award. You must claim this from the Insolvency Service.',
                    'The Insolvency Service caps the payment at a maximum of 8 weeks of pay.',
                    'The calculation uses the statutory weekly cap of <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">£751</Link> (Great Britain rate).',
                    'You receive a payment of £6,008 (8 weeks × £751) from the Insolvency Service. The remaining balance of the award can be registered as an unsecured debt, though recovery is rare.',
                  ],
                },
              ].map(({ title, points }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-sm font-medium">{title}</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    {points.map((point, index) => (
                      <p key={index} className="sc-body text-sm">{point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-paper border border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold text-ink mb-1">Calculate your specific protective award</p>
                <p className="sc-body text-xs text-muted">
                  Input your exact salary to calculate your 90-day entitlement and compare solvent vs insolvent outcomes under 2026 rules.
                </p>
              </div>
              <Link href="/protective-award-calculator/" className="btn-accent flex-shrink-0 text-xs py-2.5 px-4 font-bold">
                Calculate my award →
              </Link>
            </div>
          </div>
        </section>

        {/* How to Claim */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">How to Claim a Protective Award</h2>
            <p className="sc-body mb-6">
              A protective award is not paid automatically. You must claim it through an employment tribunal.
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Confirm the threshold is met',
                  body: 'Verify that 20 or more employees at your establishment were made redundant, or proposed to be made redundant, within a 90-day period.',
                },
                {
                  n: 2,
                  title: 'Appoint representatives to lead the claim',
                  body: 'If a trade union is recognized, they must bring the claim. If there is no union, elected employee representatives must bring it. If your employer failed to set up elections for representatives, individual employees can submit their own claims.',
                },
                {
                  n: 3,
                  title: 'Start ACAS Early Conciliation',
                  body: 'You must start the ACAS early conciliation process. This is a mandatory step before filing a tribunal claim. You must start this within 3 months minus 1 day from the date of your dismissal.',
                },
                {
                  n: 4,
                  title: 'Submit your Employment Tribunal claim (ET1)',
                  body: 'If conciliation does not resolve the issue, you must submit a claim form (ET1) to the <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-ink">employment tribunal</Link> within the statutory time limit.',
                },
                {
                  n: 5,
                  title: 'Obtain tribunal judgment and request payment',
                  body: 'Once the tribunal rules in your favor, the employer must pay. If the employer is insolvent, you submit your tribunal judgment along with your claim details to the Insolvency Service Redundancy Payments team.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Settlement agreements and protective awards */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Settlement Agreements and Protective Awards</h2>
            <p className="sc-body mb-4">
              If your employer offers you a settlement agreement during a redundancy process, it will contain a waiver. By signing the agreement, you agree to drop all claims against your employer. This waiver includes any potential protective award claim.
            </p>
            <p className="sc-body mb-4">
              Before you sign, you should verify whether the settlement payment accounts for the fact that your employer failed to consult collectively. A fair settlement should compensate you for this failure.
            </p>
            <p className="sc-body mb-6">
              You can choose your own independent solicitor to review your settlement agreement. Your employer covers the fees for this review, and they pay these fees directly to your solicitor.
            </p>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                If you have been offered a redundancy settlement package, you can <Link href="/protective-award-calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">calculate your protective award</Link> or <Link href="/calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">check your settlement offer</Link> using our free tools.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Calculate your protective award entitlement</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Check your 90-day gross pay entitlement and compare solvent vs insolvent caps under 2026 statutory rates. Free, instant results, zero email required.
            </p>
            <Link href="/protective-award-calculator/" className="btn-accent">
              Calculate my protective award →
            </Link>
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/189" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Trade Union and Labour Relations (Consolidation) Act 1992, Section 189
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/188" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Trade Union and Labour Relations (Consolidation) Act 1992, Section 188
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/government/publications/insolvency-service-payments-for-redundancy-protective-awards" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Insolvency Service Guidance: Payments for Redundancy Protective Awards
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)
                </a>
              </li>
              <li>
                <a href="https://publications.parliament.uk/pa/bills/cbill/58-01/0011/250011.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Bill 2024-25 (House of Commons Bill 11)
                </a>
              </li>
            </ol>
          </div>
        </section>

        {/* Related Guides */}
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              items={[
                {
                  href: '/protective-award-calculator/',
                  title: 'Protective Award Calculator UK',
                  description: 'Calculate your entitlement of up to 90 days gross pay under TULRCA 1992 s.189.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/redundancy-pay-cap-2026/',
                  title: 'Redundancy Pay Cap 2026',
                  description: 'The weekly statutory pay cap is £751 from April 2026. Check your statutory floor.',
                  tag: 'Redundancy',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Assess whether your redundancy settlement offer matches typical UK market ranges.',
                  tag: 'Settlement',
                },
                {
                  href: '/guides/settlement-agreement-vs-tribunal-claim/',
                  title: 'Settlement Agreement vs Tribunal Claim',
                  description: 'Weigh up the pros, cons, costs, and timescales of settling versus taking your employer to tribunal.',
                  tag: 'Tribunal',
                },
              ]}
            />
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent introduction service and calculator, not a law firm. The information on this page is for general guidance only and does not constitute formal legal counsel. Confirm your specific offer using our free calculator.
        </p>
      </main>
      <Footer />
    </>
  )
}
