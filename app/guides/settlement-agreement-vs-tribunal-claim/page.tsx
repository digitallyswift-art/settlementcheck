import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement vs Tribunal 2026 | SettlementCheck',
  description:
    'Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.',
  alternates: {
    canonical: '/guides/settlement-agreement-vs-tribunal-claim/',
  },
  openGraph: {
    title: 'Settlement Agreement vs Tribunal 2026 | SettlementCheck',
    description:
      'Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.',
    url: '/guides/settlement-agreement-vs-tribunal-claim/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement vs Tribunal 2026 | SettlementCheck',
    description:
      'Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.',
  },
}

const FAQS = [
  {
    q: 'How much does it cost to go to an employment tribunal?',
    a: 'There is no court fee to submit an employment tribunal claim. However, if you hire a solicitor to represent you, legal costs typically range between £5,000 and £15,000 or more.',
  },
  {
    q: 'What is the average payout at a UK employment tribunal?',
    a: 'According to recent statistics, the average compensation for unfair dismissal claims is under £15,000. Most successful tribunal claims result in awards that are lower than typical negotiated settlements.',
  },
  {
    q: 'How long does an employment tribunal take?',
    a: 'A standard employment tribunal claim in the UK takes between 12 and 18 months to reach a final hearing. A settlement agreement is often completed in under three weeks.',
  },
  {
    q: 'Can I claim compensation for stress at an employment tribunal?',
    a: 'Generally, no. Tribunals do not award compensation for stress or hurt feelings in standard unfair dismissal claims. Stress awards, known as injury to feelings, are only available in discrimination or whistleblowing cases.',
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
  headline: 'Settlement Agreement vs Employment Tribunal UK 2026: Cost, Time, and Success Rates compared',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-vs-tribunal-claim/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-25',
  dateModified: '2026-07-11',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-vs-tribunal-claim/',
  },
}

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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function SettlementAgreementVsTribunalGuide() {
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
              <span className="text-xs text-ink truncate">Settlement vs Tribunal</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Legal Guide</p>
            <h1 className="sc-h1 mb-5">
              Settlement Agreement vs Employment Tribunal UK 2026: Cost, Time, and Success Rates compared
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Figures in force from 6 April 2026 (SI 2026/310)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: July 2026</span>
            </div>
            <p className="sc-lead">
              Under UK employment regulations, a settlement agreement is a private contract that resolves a dispute, whereas an employment tribunal is a public court. In 2026, the statutory cap on unfair dismissal compensatory awards is £123,543, or one year of your gross pay, whichever is lower <sup>1</sup>. The weekly pay cap for calculating statutory redundancy and basic awards is £751 in Great Britain <sup>2</sup> (£783 in Northern Ireland <sup>3</sup>). Rejecting a settlement offer to sue your employer carries risk. Most successful tribunal claims result in awards below these caps, and hearings typically take 12 to 18 months.
            </p>
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Core comparison facts</p>
              <ul className="flex flex-col gap-3">
                {[
                  'A settlement agreement is a guaranteed, tax-efficient payout completed in weeks.',
                  'An employment tribunal claim is a public dispute that takes over a year to resolve.',
                  'Your employer covers the fees for your solicitor to advise you on a settlement agreement.',
                  'Tribunals have no filing fees, but hiring a solicitor to represent you can cost £5,000 to £15,000.',
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

        {/* Comparison Table */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Direct Comparison: Settlement vs Tribunal</h2>
            <p className="sc-body mb-6">
              This table outlines the practical differences between settling your dispute privately and pursuing a formal case in court.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Settlement agreement vs employment tribunal UK 2026 comparison table</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Feature</th>
                    <th className="text-left px-4 py-3 font-medium">Settlement Agreement</th>
                    <th className="text-left px-4 py-3 font-medium">Employment Tribunal</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'Resolution Time',
                      '1 to 3 weeks',
                      '12 to 18 months',
                    ],
                    [
                      'Legal Costs',
                      'Free (your employer pays your solicitor\'s advice fees)',
                      'No court fees, but solicitor fees can reach £5,000 to £15,000',
                    ],
                    [
                      'Financial Caps',
                      'No statutory cap (negotiated freely)',
                      'Compensatory award capped at £123,543 <sup>1</sup> or one year of pay',
                    ],
                    [
                      'Privacy',
                      'Strictly confidential and private',
                      'Public record (judgments are published online)',
                    ],
                    [
                      'Stress Level',
                      'Low to moderate',
                      'Very high',
                    ],
                    [
                      'Guaranteed Payout',
                      'Yes, contractually binding once signed',
                      'No, dependent on winning the case and employer solvency',
                    ],
                  ].map(([feature, settlement, tribunal], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{feature}</td>
                      <td className="px-4 py-3 text-ink" dangerouslySetInnerHTML={{ __html: settlement }} />
                      <td className="px-4 py-3 text-ink" dangerouslySetInnerHTML={{ __html: tribunal }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Legal Caps */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Statutory Compensation Caps in 2026</h2>
            <p className="sc-body mb-4">
              If you reject a settlement offer and win an unfair dismissal claim, the tribunal cannot award unlimited compensation. The law enforces strict limits.
            </p>
            <p className="sc-body mb-6">
              Your maximum possible award is the sum of two separate awards:
            </p>
            <div className="space-y-4">
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">The Basic Award</strong>
                <span className="text-muted text-[15px]">
                  This is calculated using the same statutory formula as <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">statutory redundancy pay</Link>. It is based on your age, complete years of service (up to 20 years), and gross weekly salary. The gross weekly salary is capped at £751 in Great Britain <sup>2</sup> (£783 in Northern Ireland <sup>3</sup>). The maximum basic award you can receive is £22,530 <sup>4</sup> (£23,490 in Northern Ireland <sup>5</sup>).
                </span>
              </div>
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">The Compensatory Award</strong>
                <span className="text-muted text-[15px]">
                  This compensates you for your actual financial loss, such as lost wages, pension contributions, and benefits. It is capped at £123,543 in Great Britain <sup>1</sup>, or one year of your gross pay, whichever is lower. The cap does not apply if your dismissal relates to whistleblowing or health and safety.
                </span>
              </div>
            </div>
            <p className="sc-body mt-6">
              Tribunals do not award compensation for injury to feelings or stress in standard unfair dismissal claims. Those awards are restricted to discrimination and whistleblowing cases.
            </p>
          </div>
        </section>

        {/* Legal Costs and Fees */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Hired Solicitors: Who Pays the Legal Fees?</h2>
            <p className="sc-body mb-4">
              In a settlement agreement, the arrangement is straightforward. Your employer covers the fees for your solicitor to advise you on the terms. This contribution typically ranges from £350 to £750, and the employer pays your solicitor directly.
            </p>
            <p className="sc-body mb-4">
              For an employment tribunal, there are no court fees to submit a claim. However, you must cover your own legal representation. Hiring a solicitor to draft your claim, prepare evidence, and represent you at a hearing typically costs between £5,000 and £15,000.
            </p>
            <p className="sc-body">
              Unlike civil courts, employment tribunals operate on a no cost-shifting basis. The loser does not automatically pay the winner\'s legal fees. You must pay your solicitor regardless of whether you win or lose, unless your opponent behaves dishonestly or unreasonably during the proceedings.
            </p>
          </div>
        </section>

        {/* Success Rates and Payout Reality */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tribunal Success Rates and Realistic Payouts</h2>
            <p className="sc-body mb-4">
              Many employees assume that going to a tribunal will result in a larger payout. Official tribunal statistics indicate otherwise.
            </p>
            <p className="sc-body mb-6">
              Only a small percentage of cases that are submitted actually reach a final hearing and win. Most claims are either settled through ACAS conciliation, withdrawn by the claimant, or dismissed. For the few claimants who do win, the payouts are historically modest.
            </p>
            <div className="rounded-xl border border-rule bg-[#FFF8F6] p-5 flex gap-3">
              <AlertIcon />
              <div className="sc-body text-sm text-ink leading-relaxed">
                <strong>Statutory limit checklist:</strong> Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first £30,000 of redundancy or ex-gratia compensation is <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">paid tax-free up to £30,000</Link> <sup>6</sup>. This applies to both settlement agreements and tribunal awards. However, notice pay or PILON remains fully taxable as earnings under Section 402D of the same Act <sup>7</sup> (see our <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax guide</Link>).
              </div>
            </div>
          </div>
        </section>

        {/* The Decision Pathway */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How to Decide: Settlement vs Tribunal</h2>
            <p className="sc-body mb-6">
              If you have been offered a settlement agreement, evaluate your options by following these steps:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Verify your statutory minimum entitlement',
                  body: 'Compare the offer against your statutory redundancy and notice entitlement. The offer must meet or exceed these basic statutory values to be fair.',
                },
                {
                  n: 2,
                  title: 'Assess your legal leverage',
                  body: 'Consider whether your employer has followed a fair procedure. If you have evidence of discrimination, whistleblowing, or a clear breach of contract, your negotiating position is stronger.',
                },
                {
                  n: 3,
                  title: 'Factor in time, stress, and career impact',
                  body: 'Determine whether you can manage a dispute that lasts 12 to 18 months. Consider whether you prefer a private settlement or a public court case that future employers can read online.',
                },
                {
                  n: 4,
                  title: 'Check your offer with a calculator',
                  body: 'Use our independent tool to estimate your entitlements and see where your offer sits within typical UK settlement ranges.',
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
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3 mt-8">
              <InfoIcon />
              <p className="sc-body text-sm">
                You can <Link href="/calculator" className="text-coral underline hover:text-ink transition-colors font-semibold">check your offer</Link> to find out where you stand.
              </p>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Check your settlement offer now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Enter your details to calculate your statutory baseline and check if your settlement offer is fair.
            </p>
            <Link href="/calculator" className="btn-accent">
              Check my offer
            </Link>
          </div>
        </section>

        {/* FAQs */}
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
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 227 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/119" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 119
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Northern Ireland basic award statutory cap under SR 2026/57
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
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent calculator and guide, not a law firm. The information on this page is for educational purposes only and does not constitute legal advice. While we make every effort to ensure our calculations reflect current statutory limits (such as SI 2026/310), employment disputes are complex. You should consult a qualified solicitor before signing a settlement agreement or initiating tribunal proceedings.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
