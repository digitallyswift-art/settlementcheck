import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'How to Declare a Settlement Agreement on Your UK Tax Return | SettlementCheck',
  description:
    'Self Assessment tax return guide for UK settlement agreements. Box-by-box SA100 & SA102 breakdown for payments over £30,000 and employer tax indemnity clauses.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/hmrc-tax-return-declaration/',
  },
  openGraph: {
    title: 'How to Declare a Settlement Agreement on Your UK Tax Return | SettlementCheck',
    description:
      'Self Assessment tax return guide for UK settlement agreements. Box-by-box SA100 & SA102 breakdown for payments over £30,000 and employer tax indemnity clauses.',
    url: 'https://settlementcheck.co.uk/guides/hmrc-tax-return-declaration/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Declare a Settlement Agreement on Your UK Tax Return | SettlementCheck',
    description:
      'Self Assessment tax return guide for UK settlement agreements. Box-by-box SA100 & SA102 breakdown for payments over £30,000 and employer tax indemnity clauses.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/hmrc-tax-return-declaration/', STATIC_METADATA)
}

const FAQS: FaqItem[] = [
  {
    q: 'Do I need to file a Self Assessment tax return if my settlement agreement was under £30,000?',
    a: 'If your total termination package was entirely below the £30,000 threshold under Section 403 of ITEPA 2003, and all notice pay was taxed via PAYE with no other untaxed income, you generally do not need to register for Self Assessment solely because of the settlement. However, if you are already registered for Self Assessment, HMRC requires you to report termination awards on your SA102 return.',
  },
  {
    q: 'Which boxes on the SA102 Self Assessment form do I use for a settlement agreement?',
    a: 'On supplementary page SA102 (or the "Additional information" section Ai 2 online), enter qualifying non-taxable termination payments up to £30,000 in Box 5. Enter any taxable compensation exceeding £30,000 in Box 9, and record the PAYE tax already deducted by your employer in Box 10.',
  },
  {
    q: 'Why does my employer insist on a tax indemnity clause in the settlement agreement?',
    a: 'Under UK tax rules, the employer is legally responsible for operating PAYE correctly. If HMRC subsequently challenges the tax-free status of any payment, HMRC can issue an assessment against the employer. The tax indemnity clause enables the employer to reclaim any unpaid income tax and interest directly from you.',
  },
  {
    q: 'How should my solicitor amend the employer tax indemnity clause?',
    a: 'Your solicitor should ensure the indemnity covers only income tax (not employer Class 1A National Insurance contributions), excludes penalties resulting from employer payroll delays, requires the employer to give you written notice before settling with HMRC, and gives you the right to dispute unreasonable HMRC assessments.',
  },
  {
    q: 'Does an employer contribution to my legal fees count towards the £30,000 exemption limit?',
    a: 'No. Under HMRC Extra-Statutory Concession A81 and Section 413A of ITEPA 2003, payments made directly by an employer to your solicitor for independent legal advice under Section 203(3) ERA 1996 upon agreement completion are completely tax-exempt and do not consume any part of your £30,000 threshold.',
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
            <h1 className="sc-h1 mb-5">
              How to Declare a Settlement Agreement on Your UK Tax Return (SA100 / SA102)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 Tax Year</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>HMRC Manual Guidance (EIM13750)</span>
            </div>
            <p className="sc-lead">
              If your employment settlement agreement includes compensation exceeding the £30,000 threshold under Section 403 of ITEPA 2003, or if you already file a UK Self Assessment tax return, you must declare your settlement correctly. This guide provides a box-by-box breakdown of forms SA100 and SA102, and explains how to handle the employer tax indemnity clause.
            </p>
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
                Termination payments are declared on supplementary page <strong>SA102 (Employment)</strong> or the "Additional Information" page online. The tax-free element up to £30,000 goes into <strong>Box 5</strong>. The taxable excess exceeding £30,000 goes into <strong>Box 9</strong>, and any PAYE tax deducted by your employer is recorded in <strong>Box 10</strong>.
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
                  <span className="text-muted text-[11px]">Taxed as general employment income</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Reactive Calculator Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="HMRC Tax Split Engine"
              title="Calculate Your Settlement Tax Split: Exemption vs Taxable Excess"
              subtitle="Determine your exact SA102 Box 5 (£30k exempt) and Box 9 (taxable excess) figures before submitting your return."
              disputeType="tax_split"
              statutoryPills={[
                { label: 'Exemption Limit', value: '£30,000 Shield', statute: 'ITEPA 2003 s.403' },
                { label: 'Notice Pay (PENP)', value: '100% Taxable', statute: 'ITEPA 2003 s.402D' },
                { label: 'Employee NI', value: '0% on Compensation', statute: 'SSCBA 1992' },
              ]}
              initialSalary={60000}
              initialYears={5}
              initialAge={40}
              ctaText="Calculate My SA102 Tax Split →"
            />
          </div>
        </section>

        {/* Section 1: Box-by-Box Guide */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">1. Box-by-Box SA100 / SA102 Breakdown</h2>
            <p className="sc-body mb-4">
              When filing your Self Assessment return online or on paper, termination payments must not be lumped into ordinary salary. Entering termination awards into Box 1 will result in HMRC calculating employee National Insurance contributions, which do not apply to genuine compensation for loss of office.
            </p>

            <div className="space-y-4 my-6">
              <div className="border border-rule rounded-xl p-5 bg-paper">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
                  Box 5: Lump sums or other benefits up to £30,000
                </h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Enter the genuine compensation amount that qualifies for the £30,000 exemption under Section 403 of ITEPA 2003. This includes statutory redundancy pay, enhanced severance, and non-contractual ex-gratia sums. If your total compensation was £25,000, enter £25,000 here.
                </p>
              </div>

              <div className="border border-rule rounded-xl p-5 bg-paper">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
                  Box 9: Compensation and lump sums exceeding £30,000
                </h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  If your total qualifying compensation was £50,000, the first £30,000 is exempt (Box 5) and the remaining £20,000 is entered in Box 9. This amount is subject to income tax at your marginal rate (20%, 40%, or 45%) but remains free of employee National Insurance.
                </p>
              </div>

              <div className="border border-rule rounded-xl p-5 bg-paper">
                <h3 className="font-sans text-sm font-bold text-ink uppercase tracking-wide">
                  Box 10: Tax taken off box 9
                </h3>
                <p className="text-sm text-muted mt-1 leading-relaxed">
                  Record the PAYE tax already deducted by your employer on the payment entered in Box 9. Employers typically apply an emergency tax code or 0T code. Recording this prevents double taxation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Employer Tax Indemnity Clause */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">2. The Employer Tax Indemnity Clause Explained</h2>
            <p className="sc-body mb-4">
              Virtually all UK settlement agreements contain a <strong>tax indemnity clause</strong>. This clause requires you to reimburse your employer if HMRC concludes that additional tax or National Insurance is due on your severance package.
            </p>
            <p className="sc-body mb-4">
              Employers insert this clause because PAYE regulations place primary liability on the employer for under-deducted tax. However, unrepresented employees often accept aggressive indemnity clauses that leave them exposed to unfair liabilities.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-4">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">Essential Solicitor Protective Amendments:</h3>
              <ul className="flex flex-col gap-2.5 text-sm text-ink">
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Exclude Employer NICs:</strong> Confirm you only indemnify standard income tax, never employer Class 1A NICs (15.0%).</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Exclude Employer Penalties:</strong> Ensure you are not liable for interest or penalties caused by your employer's payroll delay.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckIcon />
                  <span><strong>Advance Written Notice:</strong> Require the employer to give you at least 21 days notice before responding or settling with HMRC.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Worked Case Study */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked Case Study: £65,000 Settlement Tax Reconciliation</h2>
            <p className="sc-body mb-6">
              Employee exiting with £65,000 total compensation (excluding worked notice), with £30,000 tax-free and £35,000 subject to higher rate (40%) income tax:
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
              <strong>HMRC &amp; Regulatory Notice:</strong> SettlementCheck provides general guidance based on HMRC Employment Income Manual (EIM13750) and ITEPA 2003 statutory rules. We are an independent technology platform and introducer, not chartered tax advisers or a law firm. Under Section 203(3) ERA 1996, independent legal advice from an SRA-regulated solicitor is required to execute a valid settlement. Legal fee contributions are a commercial custom paid upon completion; abortive costs or work exceeding the agreed cap remain subject to your solicitor&apos;s engagement terms.
            </p>
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently Asked Questions: Tax Return Reporting</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        <DynamicFaqSection pathname="/guides/hmrc-tax-return-declaration/" suppressSchema />
      </main>
      <Footer />
    </>
  )
}
