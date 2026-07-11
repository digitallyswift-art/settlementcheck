import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Protective Award Redundancy Claims 2026 | SettlementCheck',
  description:
    'A protective award is tribunal compensation of up to 90 days\' gross pay for collective redundancy consultation failures. Learn how to claim in 2026.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/protective-award/',
  },
  openGraph: {
    title: 'Protective Award Redundancy Claims 2026 | SettlementCheck',
    description:
      'A protective award is tribunal compensation of up to 90 days\' gross pay for collective redundancy consultation failures. Learn how to claim in 2026.',
    url: 'https://settlementcheck.co.uk/guides/protective-award/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protective Award Redundancy Claims 2026 | SettlementCheck',
    description:
      'A protective award is tribunal compensation of up to 90 days\' gross pay for collective redundancy consultation failures. Learn how to claim in 2026.',
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
  headline: 'What Is a Protective Award and How Do You Claim It in 2026?',
  url: 'https://settlementcheck.co.uk/guides/protective-award/',
  datePublished: '2026-05-23',
  dateModified: '2026-05-23',
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
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
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Protective Award</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Redundancy Rights</p>
            <h1 className="sc-h1 mb-5">
              What Is a Protective Award and How Do You Claim It in 2026?
            </h1>
            <p className="sc-lead">
              A protective award is tribunal compensation of up to 90 days&apos; gross pay for collective redundancy consultation failures. Under Section 189 of the Trade Union and Labour Relations (Consolidation) Act 1992 <sup>1</sup>, you can claim this if your employer fails to consult you before making 20 or more redundancies. This guide explains how the award is calculated and how you can claim.
            </p>
            <div className="mt-6 rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="text-sm text-ink font-medium">
                Figures on this page reflect the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310) <sup>2</sup>, in force from 6 April 2026. Last reviewed: May 2026.
              </p>
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
            <p className="sc-body mb-4">
              When an employer plans to make 20 or more employees redundant at one location within a 90-day period, they have a statutory duty to consult collectively. Under Section 188 of the Trade Union and Labour Relations (Consolidation) Act 1992 <sup>3</sup>, they must consult with recognized trade unions or elected employee representatives.
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
                      'Capped at a maximum of 8 weeks of pay <sup>4</sup> at £751 per week in GB <sup>2</sup> (£783 in NI <sup>5</sup>).',
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
                    'The calculation uses the statutory weekly cap of £751 (Great Britain rate).',
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
                  body: 'If conciliation does not resolve the issue, you must submit a claim form (ET1) to the employment tribunal within the statutory time limit.',
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
                If you have been offered a redundancy package, you can <Link href="/calculator" className="text-coral underline hover:text-ink transition-colors font-semibold">check your offer</Link> using our free tool to find out where you stand.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Check if your redundancy settlement is fair</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Calculate your statutory baseline under 2026 rates. Free, instant results, and no email required.
            </p>
            <Link href="/calculator" className="btn-accent">
              Check my offer
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
      </main>
      <Footer />
    </>
  )
}
