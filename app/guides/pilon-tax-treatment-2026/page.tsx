import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'PILON Tax Treatment UK 2026: Is Notice Pay Tax Free?',
  description:
    'Pay in Lieu of Notice (PILON) is always fully taxable as earnings under ITEPA 2003 s.402D. It does not qualify for the £30,000 tax-free exemption in 2026.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
  },
  openGraph: {
    title: 'PILON Tax Treatment UK 2026: Is Notice Pay Tax Free?',
    description:
      'Pay in Lieu of Notice (PILON) is always fully taxable as earnings under ITEPA 2003 s.402D. It does not qualify for the £30,000 tax-free exemption in 2026.',
    url: 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'Is PILON always taxable?',
    a: 'Yes, PILON is always fully taxable. You must pay income tax and National Insurance contributions on any notice pay you receive.',
  },
  {
    q: 'Can I use the £30,000 tax-free limit for my notice pay?',
    a: 'No, you cannot. The £30,000 exemption only applies to redundancy and compensation payments, not to notice pay.',
  },
  {
    q: 'How is notice pay tax calculated?',
    a: 'Your employer calculates the tax using the Post-Employment Notice Pay formula. This formula determines the pay you would have received if you worked your notice.',
  },
  {
    q: 'What happens if my contract has no PILON clause?',
    a: 'The tax treatment is the same. HMRC taxes notice pay as general earnings even if your contract does not mention PILON.',
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
  headline: 'PILON Tax Treatment UK 2026: Is Notice Pay Tax Free?',
  url: 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
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

export default function PilonTaxTreatmentGuide() {
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
              <span className="text-xs text-ink truncate">PILON Tax Treatment 2026</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Tax Guide</p>
            <h1 className="sc-h1 mb-5">
              PILON Tax Treatment UK 2026: Is Pay in Lieu of Notice Tax Free?
            </h1>
            <p className="sc-lead">
              No, Pay in Lieu of Notice (PILON) is not tax-free. Under Section 402D of the Income Tax (Earnings and Pensions) Act 2003 <sup>1</sup>, all notice pay is fully taxable. It does not qualify for the £30,000 tax-free threshold <sup>2</sup>. This rule continues under the April 2026 statutory update <sup>3</sup>. Your employer must deduct tax and National Insurance from your PILON.
            </p>
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-sm font-semibold text-ink mb-3">Key tax rules for PILON</p>
              <ul className="flex flex-col gap-3">
                {[
                  'All notice pay is taxable as earnings, regardless of your contract terms.',
                  'The £30,000 tax-free exemption does not apply to notice payments.',
                  'Employers calculate tax using the Post-Employment Notice Pay formula.',
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

        {/* How PILON is taxed */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How PILON is Taxed: The Basics</h2>
            <p className="sc-body mb-4">
              Your notice period is the time between being told your job will end and your final day. Sometimes, your employer does not want you to work this period. They can choose to pay you instead. This payment is called Pay in Lieu of Notice, or PILON.
            </p>
            <p className="sc-body mb-4">
              All notice pay is taxed as normal salary. You must pay income tax and National Insurance on the full amount. This applies whether your contract allows PILON or not.
            </p>
            <p className="sc-body">
              This tax rule comes from Section 402D of the Income Tax (Earnings and Pensions) Act 2003 <sup>1</sup>. HMRC calls this Post-Employment Notice Pay. It ensures that employees pay the same tax on notice whether they work it or not.
            </p>
          </div>
        </section>

        {/* The £30,000 threshold */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The £30,000 Tax-Free Exemption: What Qualifies?</h2>
            <p className="sc-body mb-6">
              UK law allows you to receive up to £30,000 of your termination payment tax-free <sup>2</sup>. However, you cannot apply this exemption to PILON.
            </p>
            <p className="sc-body mb-4">
              Only certain parts of a settlement agreement qualify for the £30,000 tax-free limit. These include:
            </p>
            <ul className="list-disc pl-5 mb-6 flex flex-col gap-2">
              <li className="sc-body text-sm">
                Statutory redundancy pay, which is capped at £22,530 in Great Britain <sup>4</sup>.
              </li>
              <li className="sc-body text-sm">
                Ex-gratia payments, which are discretionary compensation payments.
              </li>
            </ul>
            <p className="sc-body">
              Other payments are always taxed as earnings. These include notice pay, holiday pay, and bonuses. Your employer must deduct tax from these before paying you.
            </p>
          </div>
        </section>

        {/* Table of components */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax Treatment of Settlement Agreement Components</h2>
            <p className="sc-body mb-6">
              A settlement agreement often breaks down your payments into different categories. Each category has its own statutory tax rules.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Component</th>
                    <th className="text-left px-4 py-3 font-medium">Tax Treatment</th>
                    <th className="text-left px-4 py-3 font-medium">2026 Statutory Limit</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      'PILON (Notice Pay)',
                      'Fully taxable (Income Tax & NI)',
                      'Taxed as general earnings under Section 402D <sup>1</sup>',
                    ],
                    [
                      'Statutory Redundancy',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Capped at £22,530 in GB <sup>4, 6</sup> and £23,490 in NI <sup>5</sup>',
                    ],
                    [
                      'Ex-Gratia Payment',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Subject to the combined £30,000 limit <sup>2</sup>',
                    ],
                    [
                      'Holiday Pay',
                      'Fully taxable (Income Tax & NI)',
                      'Taxed as normal salary at usual rate',
                    ],
                    [
                      'Protective Award',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Compensation capped at 90 days <sup>7</sup>',
                    ],
                    [
                      'Unfair Dismissal Basic Award',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Capped at £22,530 in GB <sup>4, 6</sup> (SI 2026/310 <sup>3</sup>)',
                    ],
                    [
                      'Compensatory Award',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Capped at £123,543 in GB <sup>6</sup> (SI 2026/310 <sup>3</sup>)',
                    ],
                  ].map(([component, treatment, limit], i) => (
                    <tr key={component} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{component}</td>
                      <td className="px-4 py-3 text-ink">{treatment}</td>
                      <td className="px-4 py-3 text-ink" dangerouslySetInnerHTML={{ __html: limit }} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Worked Examples */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Examples: How PILON Affects Your Take-Home Pay</h2>
            <p className="sc-body mb-6">
              These three examples show how notice pay and redundancy are taxed in a settlement agreement.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Redundancy with No PILON (Notice Worked)',
                  points: [
                    'You are redundant. You work your full notice period. You receive a statutory redundancy payment of £8,000.',
                    'Your notice pay is paid through payroll. You pay tax and National Insurance on it as usual.',
                    'Your £8,000 redundancy payment is paid tax-free. This is because it is below the £30,000 threshold.',
                  ],
                },
                {
                  title: 'Example 2: Redundancy with PILON (Notice Paid in Lieu)',
                  points: [
                    'You are redundant. Your employer asks you to leave immediately. They pay you £4,000 in lieu of notice.',
                    'They also pay you a £10,000 ex-gratia payment and £5,000 statutory redundancy pay.',
                    'Your £4,000 PILON is fully taxable. Your employer deducts tax and National Insurance from it.',
                    'The £10,000 ex-gratia payment and £5,000 redundancy pay are combined. This totals £15,000.',
                    'This £15,000 is paid tax-free. It falls below the £30,000 exemption limit.',
                  ],
                },
                {
                  title: 'Example 3: Settlement Agreement Exceeding the £30,000 Limit',
                  points: [
                    'You sign a settlement agreement. You receive £5,000 PILON.',
                    'You also receive £35,000 as ex-gratia compensation.',
                    'Your £5,000 PILON is fully taxable. Your employer deducts tax and National Insurance.',
                    'The £35,000 ex-gratia payment exceeds the £30,000 limit. The first £30,000 is tax-free.',
                    'The remaining £5,000 is taxable. Your employer deducts tax from this excess amount.',
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

        {/* PENP formula and checking offer */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How Employers Calculate Notice Pay Tax: What to Check</h2>
            <p className="sc-body mb-4">
              Your employer must use the Post-Employment Notice Pay (PENP) formula to calculate the tax <sup>1</sup>. This formula is complex.
            </p>
            <p className="sc-body mb-4">
              It calculates how much basic pay you would have earned if you worked your notice. This portion is taxed as earnings.
            </p>
            <p className="sc-body mb-4">
              Any remaining compensation can be paid tax-free under the £30,000 limit. You should check your settlement agreement terms.
            </p>
            <p className="sc-body mb-6">
              Make sure the agreement separates notice pay from compensation. This prevents HMRC from taxing the whole amount. If you are unsure of the numbers, you can check your offer.
            </p>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                You can <Link href="/calculator" className="text-coral underline hover:text-ink transition-colors font-semibold">check your offer</Link> to find out where you stand.
              </p>
            </div>
          </div>
        </section>

        {/* Solicitor's fees */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Who Pays the Legal Fees for Your Settlement Agreement?</h2>
            <p className="sc-body mb-4">
              Your employer covers the fees for your solicitor. Under UK law, a settlement agreement is only legally binding if an independent solicitor advises you.
            </p>
            <p className="sc-body">
              Your employer pays these fees directly to your solicitor. This ensures you receive independent advice without being out of pocket.
            </p>
          </div>
        </section>

        {/* Over-taxation steps */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What to Do if Your Employer Over-Taxes Your Notice Pay</h2>
            <p className="sc-body mb-6">
              Employers sometimes make mistakes. They might tax the entire settlement agreement by mistake. Here is what to do:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Ask for a detailed breakdown',
                  body: 'Your employer must show the PENP calculation. Request a written breakdown from payroll.',
                },
                {
                  n: 2,
                  title: 'Check the calculations against your contract',
                  body: 'Confirm your notice period and basic pay. Verify if they used the correct notice duration.',
                },
                {
                  n: 3,
                  title: 'Request a correction before signing',
                  body: 'If there is an error, request a correction before signing. A solicitor can help you resolve this.',
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
            <p className="sc-body mt-6">
              Remember, your employer covers the fees for your solicitor.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Check your settlement agreement tax now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Enter your details to calculate your statutory baseline and verify how your notice pay is taxed.
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
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 162
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 227 (as amended)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/189" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Trade Union and Labour Relations (Consolidation) Act 1992, Section 189
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
