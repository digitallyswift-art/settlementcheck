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
  title: 'Protective Award UK: 90-Day Rules & Guide | SettlementCheck',
  description:
    'Claim up to 90 days gross pay for collective redundancy consultation failure under TULRCA 1992 s.189. Solvent vs insolvent rules and 2026 statutory caps.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/protective-award/',
  },
  openGraph: {
    title: 'Protective Award UK: 90-Day Rules & Guide | SettlementCheck',
    description:
      'Claim up to 90 days gross pay for collective redundancy consultation failure under TULRCA 1992 s.189. Solvent vs insolvent rules and 2026 statutory caps.',
    url: 'https://settlementcheck.co.uk/guides/protective-award/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protective Award UK: 90-Day Rules & Guide | SettlementCheck',
    description:
      'Claim up to 90 days gross pay for collective redundancy consultation failure under TULRCA 1992 s.189. Solvent vs insolvent rules and 2026 statutory caps.',
  },
}

const FAQS = [
  {
    q: 'Can you claim a protective award if your employer is insolvent?',
    a: 'Yes, you can claim from the Insolvency Service. Payments from the Insolvency Service are capped at 8 weeks of pay, with weekly pay capped at £751 in Great Britain (£783 in Northern Ireland).',
  },
  {
    q: 'What is the time limit for claiming a protective award?',
    a: 'You must start ACAS Early Conciliation within 3 months minus 1 day from the date of dismissal. Missing this deadline normally prevents you from bringing a tribunal claim.',
  },
  {
    q: 'Do you pay tax on a protective award?',
    a: 'Yes. Under HMRC guidance (EIM02550 and NIM02310) and Section 62 of ITEPA 2003, a protective award under Section 189 TULRCA 1992 is taxed as wages rather than termination compensation. The £30,000 exemption under Section 403 does not apply, so standard PAYE income tax and Class 1 National Insurance are deducted.',
  },
  {
    q: 'Can you claim a protective award if you sign a settlement agreement?',
    a: 'No. Settlement agreements contain a waiver settling employment tribunal claims, including potential protective award claims. An independent solicitor can help you assess whether an offered sum accounts for any failure to consult.',
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
  headline: 'Protective Award Redundancy Claims: 90 Days Pay & 2026 Rules',
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
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Protective Award</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Protective Award Redundancy Claims: 90-Day Rules
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against TULRCA 1992 s.189 &amp; SI 2026/310
            </p>
            <p className="sc-lead leading-relaxed">
              Facing a collective redundancy of 20 or more staff without proper consultation? A protective award can be up to 90 days gross pay under TULRCA 1992 s.189. Check your calculated statutory baseline in 60 seconds with no email required, and see how solvent and insolvent caps compare.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Calculator immediately below Hero */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Check your statutory redundancy baseline (£751/week cap) and typical commercial settlement ranges before signing a waiver."
                disputeType="redundancy"
                statutoryPills={[
                  { label: 'Protective Award', value: 'Up to 90 Days', statute: 'TULRCA 1992 s.189' },
                  { label: 'Insolvency Cap', value: '8 Wks @ £751', statute: 'SI 2026/310' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={45000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Statutory Quick Answer Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  TULRCA 1992 s.189 &amp; ERA 1996 s.184
                </span>
              </div>
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-2">
                What is a protective award and how much can you claim?
              </h2>
              <p className="text-[14px] text-ink mb-4 leading-relaxed">
                A protective award is employment tribunal compensation of up to 90 days gross pay for failure to consult collectively. If your employer is trading, the award uses actual gross pay with no statutory cap. If your employer is insolvent, Insolvency Service payments are capped at 8 weeks of pay (£751 per week in Great Britain).
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
                  <span className="text-muted text-[11px]">Paid directly by trading company</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Insolvent Employer Cap</span>
                  <span className="font-bold text-ink text-sm">Max £6,008 (8 wks @ £751)</span>
                  <span className="text-muted text-[11px]">Paid by Insolvency Service (GB rate)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Limitation Period</span>
                  <span className="font-bold text-ink text-sm">3 Months Less 1 Day</span>
                  <span className="text-muted text-[11px]">ACAS Early Conciliation deadline</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>TULRCA 1992 Section 189</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Review draft clauses →
                  </Link>
                  <Link href="/protective-award-calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my protective award →
                  </Link>
                </div>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. What is a protective award and who qualifies?</h2>
              <p className="guide-body">
                When an employer proposes 20 or more redundancies at one establishment within 90 days, they have a statutory duty to consult collectively. Under Section 188 of TULRCA 1992, they must consult recognised trade unions or elected employee representatives.
              </p>
              <p className="guide-body">
                Consultation must begin at least 30 days before the first dismissal (for 20 to 99 redundancies) or 45 days (for 100 or more). If the employer fails to consult properly, an employment tribunal can make a protective award under Section 189 to penalise the breach.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. How much can you receive if your employer is trading or insolvent?</h2>
              <p className="guide-body">
                The maximum protective award is 90 days gross pay per affected employee. The amount recovered depends on whether your employer is solvent or insolvent.
              </p>
              <div className="rounded-xl border border-rule overflow-x-auto mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-4 py-3 font-medium">Employer Status</th>
                      <th className="text-left px-4 py-3 font-medium">Calculation Rule</th>
                      <th className="text-left px-4 py-3 font-medium">2026 Statutory Limits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule">
                    <tr className="bg-paper">
                      <td className="px-4 py-3 text-ink font-medium">Trading (Solvent)</td>
                      <td className="px-4 py-3 text-ink">Based on actual gross weekly pay. No statutory weekly cap applies.</td>
                      <td className="px-4 py-3 text-ink">Up to the 90-day tribunal maximum (TULRCA s.189).</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-ink font-medium">Insolvent (Bust)</td>
                      <td className="px-4 py-3 text-ink">Paid by the Insolvency Service. Subject to statutory limits.</td>
                      <td className="px-4 py-3 text-ink">
                        Max 8 weeks at{' '}
                        <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-coral">
                          £751 per week
                        </Link>{' '}
                        in GB (£783 in NI).
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Tribunal Starting Point</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Tribunals start from the 90-day maximum where there is no consultation.</li>
                    <li>The employer must prove any special circumstances preventing consultation.</li>
                    <li>Insolvency alone is not a valid legal excuse for failing to consult.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Tax Treatment (PAYE)</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Protective awards are taxed as wages under ITEPA 2003 s.62.</li>
                    <li>The £30,000 termination exemption (s.403) does not apply.</li>
                    <li>Income tax and Class 1 National Insurance are deducted at source.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. Are the Employment Rights Bill 180-day proposals in force yet?</h2>
              <p className="guide-body">
                The Employment Rights Bill 2024-25 proposes increasing the maximum protective award from 90 days to 180 days. It also proposes counting 20 redundancies across the entire business rather than at a single establishment.
              </p>
              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>These changes are not yet in force.</strong> Current law remains active: the maximum protective award is 90 days gross pay, and the 20-redundancy threshold still applies per establishment.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. How do solvent and insolvent protective awards compare?</h2>
              <p className="guide-body">
                These two worked examples show how a protective award is calculated based on your employer&apos;s financial status.
              </p>
              <div className="flex flex-col gap-6">
                <div className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-[14px] font-medium">Example 1: Solvent Employer (Company is trading)</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    <p className="guide-body">Your gross weekly pay is £1,000, and your employer makes 30 staff redundant without consultation.</p>
                    <p className="guide-body">The tribunal awards the maximum 90 days (roughly 12.86 weeks) of actual gross pay.</p>
                    <p className="guide-body">Because the company is trading, no weekly cap applies. The gross award is £12,857 (taxed as wages).</p>
                  </div>
                </div>

                <div className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-[14px] font-medium">Example 2: Insolvent Employer (Company has entered administration)</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    <p className="guide-body">Your gross weekly pay is £1,000, and your employer enters administration without consulting staff.</p>
                    <p className="guide-body">
                      The tribunal awards 90 days, which you claim from the Insolvency Service. Payments are capped at 8 weeks at{' '}
                      <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-coral">
                        £751 per week
                      </Link>{' '}
                      (GB rate).
                    </p>
                    <p className="guide-body">You receive £6,008 gross (8 weeks &times; £751). Any remaining balance becomes an unsecured debt.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 rounded-2xl bg-paper border border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-[14px] font-bold text-ink mb-1">Calculate your protective award estimate</p>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Enter your salary to compare solvent and insolvent caps under April 2026 rates.
                  </p>
                </div>
                <Link href="/protective-award-calculator/" className="btn-accent flex-shrink-0 text-xs py-2.5 px-4 font-bold">
                  Calculate my protective award →
                </Link>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="guide-h2">5. How do you claim a protective award?</h2>
              <p className="guide-body">
                A protective award is not paid automatically. It must be claimed through an employment tribunal.
              </p>
              <ol className="flex flex-col gap-6">
                <li className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">Confirm the 20-employee threshold</p>
                    <p className="guide-body">Check that 20 or more staff at your establishment were proposed for redundancy within 90 days.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">Check who brings the claim</p>
                    <p className="guide-body">If a trade union is recognised, the union brings the claim. Otherwise, elected representatives or affected individuals (where no elections took place) can claim.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">Start ACAS Early Conciliation</p>
                    <p className="guide-body">You must start ACAS Early Conciliation within 3 months minus 1 day from your dismissal date.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">Submit your ET1 claim form</p>
                    <p className="guide-body">
                      If conciliation does not resolve the dispute, submit an ET1 form to the{' '}
                      <Link href="/guides/settlement-agreement-vs-tribunal-claim/" className="underline hover:text-coral">
                        employment tribunal
                      </Link>{' '}
                      within the statutory time limit.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">5</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">Enforce the tribunal judgment</p>
                    <p className="guide-body">If the tribunal rules in your favour, the trading employer pays. If insolvent, submit the judgment to the Insolvency Service.</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h2 className="guide-h2">6. How does a settlement agreement affect a protective award claim?</h2>
              <p className="guide-body">
                If your employer offers a settlement agreement during redundancy, it will include a waiver of employment tribunal claims. Signing that waiver settles any potential protective award claim alongside unfair dismissal.
              </p>
              <p className="guide-body">
                Before signing, an independent solicitor can help you check whether the ex-gratia sum accounts for any consultation failure, as well as any non-compete clauses or garden leave terms. Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion (excess or abortive work is subject to your solicitor engagement terms). You can{' '}
                <Link href="/get-matched/" className="text-coral underline hover:text-ink transition-colors font-semibold">
                  get matched with an SRA-regulated solicitor
                </Link>{' '}
                to review your draft.
              </p>
              <div className="rounded-xl border border-rule bg-paper p-4 flex gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  Offered a redundancy settlement package? You can{' '}
                  <Link href="/protective-award-calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">
                    calculate your protective award
                  </Link>
                  , check your{' '}
                  <Link href="/redundancy-calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">
                    statutory redundancy baseline
                  </Link>
                  , or{' '}
                  <Link href="/calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">
                    check your complete settlement offer
                  </Link>
                  .
                </p>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Calculate your protective award entitlement
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Check your 90-day gross pay entitlement and compare solvent vs insolvent caps under April 2026 statutory rates.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/protective-award-calculator/" className="btn-accent">
                  Calculate my protective award →
                </Link>
                <Link href="/calculator/" className="btn-secondary">
                  Check my offer now →
                </Link>
              </div>
              <p className="text-white/60 text-[12px] mt-4">
                Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion
              </p>
            </div>

            {/* FAQs Section */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Related Guides */}
            <RelatedArticles
              title="Related Guides & Calculators"
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
                  description: 'The weekly statutory pay cap is £751 from April 2026. Check your calculated statutory baseline.',
                  tag: 'Redundancy',
                },
                {
                  href: '/guides/redundancy-vs-settlement-agreement/',
                  title: 'Redundancy vs Settlement Agreement',
                  description: 'Compare formal redundancy against a negotiated settlement package under 2026 rules.',
                  tag: 'Settlement',
                },
                {
                  href: '/guides/settlement-agreement-vs-tribunal-claim/',
                  title: 'Settlement Agreement vs Tribunal Claim',
                  description: 'Weigh up the timescales, costs, and risks of settling versus an employment tribunal claim.',
                  tag: 'Tribunal',
                },
              ]}
            />

            {/* References & Disclaimer */}
            <div className="bg-paper border border-rule rounded-xl p-6 space-y-4">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider">References and Legislation</h3>
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
              <p className="pt-4 border-t border-rule text-[14px] text-muted leading-relaxed">
                <strong>Disclaimer:</strong> SettlementCheck is an independent introduction service and calculator, not a law firm. The information on this page is for general guidance only and does not constitute formal legal advice. Confirm your specific offer using our free calculator.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
