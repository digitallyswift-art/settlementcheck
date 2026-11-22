import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'PILON Tax 2026 | Is Notice Pay Tax Free? | SettlementCheck',
  description:
    'Understand PILON tax treatment for 2026. All notice pay is taxable (no £30k exemption). Use our free tool to check your take-home pay. No email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
  },
  openGraph: {
    title: 'PILON Tax 2026 | Is Notice Pay Tax Free? | SettlementCheck',
    description:
      'Understand PILON tax treatment for 2026. All notice pay is taxable (no £30k exemption). Use our free tool to check your take-home pay. No email.',
    url: 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PILON Tax 2026 | Is Notice Pay Tax Free? | SettlementCheck',
    description:
      'Understand PILON tax treatment for 2026. All notice pay is taxable (no £30k exemption). Use our free tool to check your take-home pay. No email.',
  },
}

const FAQS = [
  {
    q: 'Is PILON always taxable?',
    a: 'Yes, PILON is always fully taxable. You pay income tax and National Insurance contributions on any notice pay you receive.',
  },
  {
    q: 'Can I use the £30,000 tax-free limit for my notice pay?',
    a: 'No. The £30,000 exemption under ITEPA 2003 s.403 applies to redundancy and ex-gratia compensation payments, not to notice pay.',
  },
  {
    q: 'How is notice pay tax calculated?',
    a: 'Employers calculate the tax using the Post-Employment Notice Pay (PENP) formula. This formula determines the basic pay you would have received if you had worked your notice.',
  },
  {
    q: 'What happens if my contract has no PILON clause?',
    a: 'The tax treatment is the same. HMRC taxes notice pay as general earnings under ITEPA 2003 s.402D even if your contract does not mention PILON.',
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
  headline: 'PILON Tax Treatment UK 2026: Pay in Lieu of Notice is Fully Taxable',
  url: 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
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
    '@id': 'https://settlementcheck.co.uk/guides/pilon-tax-treatment-2026/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 86',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/86',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
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

export default function PilonTaxTreatmentGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
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
              <span className="text-xs text-ink truncate">PILON Tax Treatment 2026</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Tax Guide</p>
            <h1 className="sc-h1 mb-4">
              PILON Tax Treatment UK 2026: Pay in Lieu of Notice is Fully Taxable
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ITEPA 2003 s.402D &amp; s.403
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement with a Pay in Lieu of Notice (PILON) clause? Unlike genuine redundancy or ex-gratia sums, notice pay is taxed as wages under ITEPA 2003 s.402D. Check your statutory baseline and tax split in 60 seconds with no email required, whether you are on garden leave or leaving immediately.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Micro-Tool (Immediately below Hero) */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How much of your settlement is taxable notice pay?"
              subtitle="Compare your PILON and garden leave pay against the £30,000 ex-gratia exemption under April 2026 UK rates."
              disputeType="pilon_tax"
              statutoryPills={[
                { label: 'Notice Tax Rule', value: '100% Taxable', statute: 'ITEPA 2003 s.402D' },
                { label: 'Ex-Gratia Shield', value: 'First £30,000 Free', statute: 'ITEPA 2003 s.403' },
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
              ]}
              initialSalary={50000}
              initialYears={4}
              initialAge={36}
              ctaText="Check my offer now →"
            />
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
                  HMRC &amp; ITEPA 2003 Rules
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Is PILON taxable in a UK settlement agreement?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Yes. Pay in Lieu of Notice (PILON) is always taxed as wages in the UK. HMRC treats all notice pay as general earnings under Section 402D of ITEPA 2003. It cannot be placed inside the £30,000 tax-free exemption.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Notice Pay Tax Status</span>
                  <span className="font-bold text-ink text-sm">100% Taxable as Earnings</span>
                  <span className="text-muted text-[11px]">Subject to Income Tax + National Insurance</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">£30,000 Tax-Free Limit</span>
                  <span className="font-bold text-ink text-sm">Does Not Apply to PILON</span>
                  <span className="text-muted text-[11px]">Exemption reserved for ex-gratia &amp; redundancy</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Governing Statute</span>
                  <span className="font-bold text-ink text-sm">ITEPA 2003 Section 402D</span>
                  <span className="text-muted text-[11px]">Post-Employment Notice Pay (PENP) rules</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Employer Legal Contribution</span>
                  <span className="font-bold text-ink text-sm">100% Tax-Exempt</span>
                  <span className="text-muted text-[11px]">£350 to £500+ plus VAT upon completion</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>ITEPA 2003 s.402D &amp; HMRC PENP formula</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/penp-calculator/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Calculate statutory PENP →
                  </Link>
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check my draft notice clauses →
                  </Link>
                  <Link href="/settlement-agreement-tax-calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my net take-home pay →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <p className="text-[15px] font-semibold text-ink mb-3">Key tax rules for PILON</p>
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
            <h2 className="guide-h2 mb-4">Is Pay in Lieu of Notice (PILON) taxable?</h2>
            <div className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule font-medium">
              Yes. Pay in Lieu of Notice (PILON) is fully taxable in the UK. Under Section 402D of ITEPA 2003, all notice pay is treated as general earnings. You pay income tax and National Insurance on the full amount.
            </div>
            <p className="sc-body mb-4">
              Your notice period is the time between being told your role will end and your final day. Sometimes an employer asks you to leave immediately or places you on garden leave instead. If they pay a lump sum rather than having you work, that payment is PILON.
            </p>
            <p className="sc-body mb-4">
              All notice pay is taxed as wages. You pay income tax and National Insurance on the full sum, whether your contract includes a PILON clause or not.
            </p>
            <p className="sc-body">
              This rule comes from Section 402D of the Income Tax (Earnings and Pensions) Act 2003 <sup>1</sup>. HMRC calls this Post-Employment Notice Pay (PENP). It ensures employees pay the same tax on notice whether they work it or not.
            </p>
          </div>
        </section>

        {/* The £30,000 threshold */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Which payments qualify for the £30,000 tax-free limit?</h2>
            <p className="sc-body mb-6">
              UK law allows you to receive up to £30,000 of genuine termination compensation tax-free <sup>2</sup>. However, you cannot apply this exemption to PILON.
            </p>
            <p className="sc-body mb-4">
              Only certain parts of a settlement agreement qualify for the £30,000 tax-free limit. These include:
            </p>
            <ul className="list-disc pl-5 mb-6 flex flex-col gap-2">
              <li className="sc-body text-sm">
                Statutory redundancy pay, which is capped at £22,530 in Great Britain <sup>4</sup> (see our <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">Redundancy Pay Cap Guide</Link>).
              </li>
              <li className="sc-body text-sm">
                Ex-gratia payments, which are discretionary compensation payments for loss of office.
              </li>
            </ul>
            <p className="sc-body">
              Other payments are always taxed as wages. These include notice pay, accrued holiday pay, and contractual bonuses. Your employer deducts tax from these before paying you.
            </p>
          </div>
        </section>

        {/* Table of components */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How is each settlement agreement component taxed?</h2>
            <p className="sc-body mb-6">
              A settlement agreement often breaks down your payments into separate categories. Each category has its own statutory tax rules.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Tax Treatment of Settlement Agreement Components 2026</caption>
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
                      <Link key="srp" href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">Statutory Redundancy</Link>,
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Capped at £22,530 in GB <sup>4, 6</sup> and £23,490 in NI <sup>5</sup>',
                    ],
                    [
                      'Ex-Gratia Payment',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Subject to the combined £30,000 limit <sup>2</sup> (see <a href="/guides/tax-free-settlement-30000/" class="underline hover:text-ink">Tax-Free Limit Guide</a>)',
                    ],
                    [
                      'Holiday Pay',
                      'Fully taxable (Income Tax & NI)',
                      'Taxed as normal salary at usual rate',
                    ],
                    [
                      'Protective Award',
                      'Tax-free up to £30,000 <sup>2</sup>',
                      'Compensation capped at 90 days <sup>7</sup> (see <a href="/guides/protective-award/" class="underline hover:text-ink">Protective Award Guide</a>)',
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
                    <tr key={i} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{component}</td>
                      <td className="px-4 py-3 text-ink">{treatment}</td>
                      <td className="px-4 py-3 text-ink" dangerouslySetInnerHTML={{ __html: String(limit) }} />
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
            <h2 className="guide-h2 mb-4">How does PILON affect your take-home pay in practice?</h2>
            <p className="sc-body mb-6">
              These three examples show how notice pay and redundancy are taxed in a settlement agreement.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Redundancy with No PILON (Notice Worked)',
                  points: [
                    'You are redundant and work your full notice period. You receive a statutory redundancy payment of £8,000.',
                    'Your notice pay is paid through payroll as normal salary. You pay tax and National Insurance on it as usual.',
                    'Your £8,000 redundancy payment is paid tax-free because it sits below the £30,000 threshold.',
                  ],
                },
                {
                  title: 'Example 2: Redundancy with PILON (Notice Paid in Lieu)',
                  points: [
                    'You are redundant and leave immediately. Your employer pays £4,000 in lieu of notice.',
                    'You also receive a £10,000 ex-gratia payment and £5,000 statutory redundancy pay.',
                    'Your £4,000 PILON is fully taxable. Your employer deducts tax and National Insurance from it.',
                    'The £10,000 ex-gratia sum and £5,000 redundancy pay total £15,000. This £15,000 is paid tax-free under the £30,000 limit.',
                  ],
                },
                {
                  title: 'Example 3: Settlement Agreement Exceeding the £30,000 Limit',
                  points: [
                    'You sign a settlement agreement with £5,000 PILON and £35,000 as ex-gratia compensation.',
                    'Your £5,000 PILON is fully taxable. Your employer deducts tax and National Insurance.',
                    'The first £30,000 of the ex-gratia payment is tax-free. The remaining £5,000 is subject to income tax.',
                  ],
                },
              ].map(({ title, points }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-[15px] font-medium">{title}</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    {points.map((point, index) => (
                      <p key={index} className="sc-body">{point}</p>
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
            <h2 className="guide-h2 mb-4">How do employers calculate notice pay tax (PENP)?</h2>
            <p className="sc-body mb-4">
              Employers must use the Post-Employment Notice Pay (PENP) formula to calculate tax on unworked notice <sup>1</sup>. It measures the basic pay you would have earned during your notice period.
            </p>
            <p className="sc-body mb-4">
              That PENP portion is taxed as wages. Any remaining genuine compensation can sit inside the £30,000 tax-free limit.
            </p>
            <p className="sc-body mb-6">
              Check how your draft agreement separates notice pay from ex-gratia compensation. Clear wording helps prevent payroll from taxing the full package.
            </p>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body">
                You can <Link href="/calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">check my offer now →</Link> to see your statutory baseline and tax split.
              </p>
            </div>
          </div>
        </section>

        {/* Solicitor's fees */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Who pays the legal fees for a settlement agreement?</h2>
            <p className="sc-body mb-4">
              Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. Under Section 203(3) of the Employment Rights Act 1996, the agreement is only binding once an independent solicitor advises you.
            </p>
            <p className="sc-body">
              This contribution is tax-exempt under ITEPA 2003 s.413A and does not use up your £30,000 limit. Abortive costs or work beyond the agreed cap remain subject to your solicitor&apos;s engagement terms.
            </p>
          </div>
        </section>

        {/* Over-taxation steps */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What can you check if your notice pay looks over-taxed?</h2>
            <p className="sc-body mb-6">
              Payroll errors sometimes treat an entire termination payment as taxable wages. These practical checks help you and your solicitor review the figures before completion:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Review the PENP breakdown',
                  body: 'Payroll calculations usually show how the PENP formula was applied. A written breakdown shows whether notice pay was separated from compensation.',
                },
                {
                  n: 2,
                  title: 'Check the notice period against your contract',
                  body: 'Confirm your contractual notice period, any garden leave already served, and your basic pay figure.',
                },
                {
                  n: 3,
                  title: 'Raise discrepancies with your solicitor',
                  body: 'An independent solicitor can review the tax split clauses and raise any calculation errors before the agreement is signed.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-[14px] text-muted mt-6 italic">
              Disclaimer: The information on this page is for general guidance only and does not constitute formal legal or tax advice. Legal and tax rules can vary depending on your contract and individual circumstances.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              Enter your details to check your statutory baseline and see how your notice pay is taxed.
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
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
            <div className="pt-8">
              <RelatedArticles
                title="Related Guides & Calculations"
                items={[
                  {
                    href: '/guides/tax-free-settlement-30000/',
                    title: 'The £30,000 Tax-Free Settlement Rule',
                    description: 'Learn how redundancy pay, PILON, and ex-gratia sums are taxed under ITEPA 2003 s.403.',
                    tag: 'Tax Guide',
                  },
                  {
                    href: '/penp-calculator/',
                    title: 'PENP Calculator UK',
                    description: 'Calculate your Post-Employment Notice Pay under ITEPA 2003 s.402D.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/settlement-agreement-tax-calculator/',
                    title: 'Settlement Agreement Tax Calculator',
                    description: 'Split your settlement offer into taxable wages and tax-free compensation.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/guides/hmrc-tax-return-declaration/',
                    title: 'Declare Settlement on UK Tax Return',
                    description: 'Box-by-box SA100 and SA102 reporting guide and tax indemnity checks.',
                    tag: 'Tax Reporting',
                  },
                  {
                    href: '/guides/redundancy-pay-cap-2026/',
                    title: 'UK Redundancy Pay Cap 2026 (£751/wk)',
                    description: 'Check the April 2026 weekly pay limit and maximum statutory redundancy.',
                    tag: 'Statutory Rates',
                  },
                  {
                    href: '/guides/how-to-negotiate-a-settlement-agreement/',
                    title: 'How to Negotiate a Settlement Agreement',
                    description: 'Without prejudice rules, tax splits, and what to check with an independent solicitor.',
                    tag: 'Guide',
                  },
                ]}
              />
            </div>
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
