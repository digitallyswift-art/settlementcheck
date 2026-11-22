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
  title: 'Declare Settlement on UK Tax Return | SettlementCheck',
  description:
    'Self Assessment guide for UK settlement agreements: box-by-box SA100 & SA102 breakdown for payouts over £30,000 and employer tax indemnity clauses.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/hmrc-tax-return-declaration/',
  },
  openGraph: {
    title: 'Declare Settlement on UK Tax Return | SettlementCheck',
    description:
      'Self Assessment guide for UK settlement agreements: box-by-box SA100 & SA102 breakdown for payouts over £30,000 and employer tax indemnity clauses.',
    url: 'https://settlementcheck.co.uk/guides/hmrc-tax-return-declaration/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Declare Settlement on UK Tax Return | SettlementCheck',
    description:
      'Self Assessment guide for UK settlement agreements: box-by-box SA100 & SA102 breakdown for payouts over £30,000 and employer tax indemnity clauses.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/hmrc-tax-return-declaration/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'Do I need to file a Self Assessment tax return if my settlement agreement was under £30,000?',
    a: 'If your termination compensation was entirely below the £30,000 threshold under Section 403 of ITEPA 2003 and notice pay was taxed via PAYE, you generally do not need to register for Self Assessment solely for the settlement. However, if you already file Self Assessment, HMRC requires termination awards to be reported on SA102.',
  },
  {
    q: 'Which boxes on the SA102 Self Assessment form do I use for a settlement agreement?',
    a: 'On supplementary page SA102 (or the "Additional information" section online), enter qualifying non-taxable termination payments up to £30,000 in Box 5. Enter any taxable compensation exceeding £30,000 in Box 9, and record the PAYE tax already deducted by your employer in Box 10.',
  },
  {
    q: 'Why does my employer include a tax indemnity clause in the settlement agreement?',
    a: 'Under UK tax rules, the employer is primarily responsible for operating PAYE correctly. If HMRC later challenges the tax-free status of any payment, HMRC can assess the employer. The tax indemnity clause lets the employer reclaim unpaid income tax and interest from you.',
  },
  {
    q: 'What do solicitors commonly check in a tax indemnity clause?',
    a: 'Independent solicitors commonly check that the indemnity covers only income tax (excluding employer Class 1A National Insurance), excludes penalties caused by employer payroll delays, requires written notice before settling with HMRC, and preserves your right to dispute an assessment.',
  },
  {
    q: 'Does an employer contribution to my legal fees count towards the £30,000 exemption limit?',
    a: 'No. Under ITEPA 2003 s.413A, contributions paid directly by an employer to your solicitor for advice under Section 203(3) ERA 1996 upon completion are tax-exempt and do not use up your £30,000 threshold.',
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
  headline: 'How to Declare a Settlement Agreement on Your UK Self Assessment Tax Return',
  url: 'https://settlementcheck.co.uk/guides/hmrc-tax-return-declaration/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-11-04',
  dateModified: '2026-11-04',
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
    '@id': 'https://settlementcheck.co.uk/guides/hmrc-tax-return-declaration/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
    },
    {
      '@type': 'Legislation',
      name: 'Taxes Management Act 1970, Section 29',
      url: 'https://www.legislation.gov.uk/ukpga/1970/9/section/29',
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

export default function HmrctaxReturnDeclarationGuide() {
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
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">HMRC Tax Return Declaration</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Self Assessment &amp; HMRC Reporting</p>
            <h1 className="sc-h1 mb-4">
              How to Declare a Settlement Agreement on Your UK Tax Return (SA100 / SA102)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for 2026/27 UK tax year · Checked against ITEPA 2003 &amp; HMRC EIM13750
            </p>
            <p className="sc-lead leading-relaxed">
              Received a settlement agreement over £30,000, or already file a Self Assessment tax return? Termination awards are reported separately from notice pay taxed as wages. Check your tax split in 60 seconds with no email required, see which SA102 boxes apply, and review indemnity terms with an independent solicitor.
            </p>
          </div>
        </section>

        {/* Embedded Reactive Calculator Micro-Tool (Immediately below Hero) */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How much of your settlement is tax-free versus taxable?"
              subtitle="Split your package into SA102 Box 5 (£30,000 exempt), Box 9 (taxable excess), and notice pay taxed as wages."
              disputeType="tax_split"
              statutoryPills={[
                { label: 'Exemption Limit', value: '£30,000 Shield', statute: 'ITEPA 2003 s.403' },
                { label: 'Notice Pay (PENP)', value: '100% Taxable', statute: 'ITEPA 2003 s.402D' },
                { label: 'Employee NI', value: '0% on Compensation', statute: 'SSCBA 1992' },
              ]}
              initialSalary={60000}
              initialYears={5}
              initialAge={40}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  HMRC Self Assessment Rules
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  ITEPA 2003 ss.401-416
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Where do I declare settlement agreement payments on my tax return?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Termination payments go on supplementary page <strong>SA102 (Employment)</strong> or the &quot;Additional Information&quot; page online. Enter the tax-free sum up to £30,000 in <strong>Box 5</strong>. Enter any taxable excess over £30,000 in <strong>Box 9</strong>, and record PAYE tax deducted in <strong>Box 10</strong>.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax-Free Limit</span>
                  <span className="font-bold text-ink text-sm">First £30,000</span>
                  <span className="text-muted text-[11px]">Reported in SA102 Box 5</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Taxable Excess</span>
                  <span className="font-bold text-ink text-sm">Amounts Over £30,000</span>
                  <span className="text-muted text-[11px]">Reported in SA102 Box 9</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">PAYE Tax Deducted</span>
                  <span className="font-bold text-ink text-sm">Recorded in Box 10</span>
                  <span className="text-muted text-[11px]">Credits against final tax bill</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Notice Pay (PENP)</span>
                  <span className="font-bold text-ink text-sm">Normal Salary Box</span>
                  <span className="text-muted text-[11px]">Taxed as wages (general earnings)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Box-by-Box Guide */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. Which SA100 and SA102 boxes cover a settlement agreement?</h2>
            <p className="sc-body mb-4">
              Termination payments must be kept separate from ordinary salary on your Self Assessment return. Entering compensation into Box 1 can trigger employee National Insurance charges that do not apply to genuine loss-of-office awards.
            </p>

            <div className="space-y-4 my-6">
              <div className="border border-rule rounded-xl p-5 bg-paper">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
                  Box 5: Lump sums or other benefits up to £30,000
                </h3>
                <p className="text-[14px] text-muted mt-1 leading-relaxed">
                  Enter the compensation qualifying for the £30,000 exemption under Section 403 of ITEPA 2003. This includes statutory redundancy pay and non-contractual ex-gratia sums. If your qualifying compensation was £25,000, enter £25,000 here.
                </p>
              </div>

              <div className="border border-rule rounded-xl p-5 bg-paper">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
                  Box 9: Compensation and lump sums exceeding £30,000
                </h3>
                <p className="text-[14px] text-muted mt-1 leading-relaxed">
                  If qualifying compensation was £50,000, the first £30,000 goes in Box 5 and the remaining £20,000 goes in Box 9. That excess is taxed at your marginal income tax rate (20%, 40%, or 45%) with 0% employee National Insurance.
                </p>
              </div>

              <div className="border border-rule rounded-xl p-5 bg-paper">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
                  Box 10: Tax taken off box 9
                </h3>
                <p className="text-[14px] text-muted mt-1 leading-relaxed">
                  Record the PAYE income tax already deducted by your employer on the Box 9 amount. Employers often apply an emergency or 0T tax code. Recording this figure prevents double taxation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Employer Tax Indemnity Clause */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. How does the employer tax indemnity clause work?</h2>
            <p className="sc-body mb-4">
              Most UK settlement agreements include a <strong>tax indemnity clause</strong>. It requires you to reimburse your employer if HMRC later decides extra tax or National Insurance is due on your payout.
            </p>
            <p className="sc-body mb-4">
              Employers include this clause because PAYE rules place primary liability on the employer for under-deducted tax. Standard drafts can be broad, so independent solicitors routinely review the wording to clarify where responsibility sits.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-4">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">Common Points Solicitors Review:</h3>
              <ul className="flex flex-col gap-2.5 text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Employer NICs:</strong> Clarifying that the indemnity covers income tax only, not employer Class 1A NICs (15.0%).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Payroll Penalties:</strong> Excluding interest or penalties caused by your employer&apos;s own payroll delay.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Written Notice:</strong> Requiring advance written notice before your employer responds to or settles with HMRC.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Worked Case Study */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. How does a £65,000 settlement look on a tax return?</h2>
            <p className="sc-body mb-6">
              Suppose an employee exits with £65,000 total compensation (excluding worked notice), with £30,000 tax-free and £35,000 taxed at the higher rate (40%):
            </p>

            <div className="rounded-xl border border-rule overflow-x-auto mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Reporting Field</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory Basis</th>
                    <th className="text-left px-4 py-3 font-medium">Declared Amount</th>
                    <th className="text-left px-4 py-3 font-medium">HMRC Tax Effect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule bg-white">
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">SA102 Box 5 (Exempt Sum)</td>
                    <td className="px-4 py-3 text-muted">ITEPA 2003 s.403</td>
                    <td className="px-4 py-3 font-semibold text-ink">£30,000.00</td>
                    <td className="px-4 py-3 text-ink">£0.00 (100% Tax-Free)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">SA102 Box 9 (Taxable Excess)</td>
                    <td className="px-4 py-3 text-muted">ITEPA 2003 s.403(1)</td>
                    <td className="px-4 py-3 font-semibold text-ink">£35,000.00</td>
                    <td className="px-4 py-3 text-muted">40% Income Tax = £14,000.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium text-ink">SA102 Box 10 (PAYE Deducted)</td>
                    <td className="px-4 py-3 text-muted">Employer Payroll Withholding</td>
                    <td className="px-4 py-3 font-semibold text-ink">£14,000.00</td>
                    <td className="px-4 py-3 text-muted">Tax Credit against liability</td>
                  </tr>
                  <tr className="bg-paper font-bold">
                    <td className="px-4 py-3 text-ink">NET CASH RETAINED</td>
                    <td className="px-4 py-3 text-muted">£65,000 &minus; £14,000 tax</td>
                    <td className="px-4 py-3 text-coral">£51,000.00</td>
                    <td className="px-4 py-3 text-ink">Effective Tax: 21.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Regulatory Disclaimers */}
        <section className="py-8 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5 text-xs text-muted leading-relaxed">
            <p className="mb-2">
              <strong>HMRC &amp; Regulatory Notice:</strong> SettlementCheck provides general guidance based on HMRC Employment Income Manual (EIM13750) and ITEPA 2003 statutory rules. We are an independent technology platform and introducer, not chartered tax advisers or a law firm. Under Section 203(3) ERA 1996, independent legal advice from an SRA-regulated solicitor is required to execute a valid settlement. Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion; abortive costs or work exceeding the agreed cap remain subject to your solicitor&apos;s engagement terms.
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
              See your statutory baseline, £30,000 tax-free split, and taxable excess before speaking to a solicitor.
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

        {/* FAQ Accordion */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-6">Frequently Asked Questions: Tax Return Reporting</h2>
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
                    href: '/guides/pilon-tax-treatment-2026/',
                    title: 'PILON Tax Treatment UK 2026',
                    description: 'Why notice pay is taxed as wages under ITEPA 2003 s.402D and how PENP works.',
                    tag: 'Tax Guide',
                  },
                  {
                    href: '/settlement-agreement-tax-calculator/',
                    title: 'Settlement Agreement Tax Calculator',
                    description: 'Split your settlement offer into taxable wages and tax-free compensation.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/penp-calculator/',
                    title: 'PENP Calculator UK',
                    description: 'Calculate your Post-Employment Notice Pay under ITEPA 2003 s.402D.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/guides/employer-recommended-solicitor/',
                    title: 'Do You Have to Use Their Solicitor?',
                    description: 'Your right to appoint your own independent solicitor with a standard employer fee contribution.',
                    tag: 'Legal Advice',
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

        <DynamicFaqSection pathname="/guides/hmrc-tax-return-declaration/" suppressSchema />
      </main>
      <Footer />
    </>
  )
}
