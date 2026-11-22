import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  title: 'Refusing a Settlement Agreement: Rights | SettlementCheck',
  description:
    'Understand what happens if you decline a settlement agreement in the UK. Learn about workplace procedures, notice pay, and tribunal time limits.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/what-happens-if-you-do-not-sign/',
  },
  openGraph: {
    title: 'Refusing a Settlement Agreement: Rights | SettlementCheck',
    description:
      'Understand what happens if you decline a settlement agreement in the UK. Learn about workplace procedures, notice pay, and tribunal time limits.',
    url: 'https://settlementcheck.co.uk/guides/what-happens-if-you-do-not-sign/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Refusing a Settlement Agreement: Rights | SettlementCheck',
    description: 'Notice pay rights, tribunal options, and what happens if you decline an offer. Free guide.',
  },
}

const FAQS = [
  {
    q: 'Can my employer dismiss me for refusing to sign?',
    a: 'No. Refusing to sign a settlement agreement is not a lawful reason for dismissal on its own. However, your employer can proceed with formal workplace procedures such as redundancy or capability reviews. If they follow a fair process, they can legally dismiss you at the end of it.',
  },
  {
    q: 'Can I ask for more money if I decline the initial offer?',
    a: 'Yes. You can put forward a counter-proposal for a higher sum or revised terms. Under UK contract law (Hyde v Wrench), making a counter-offer legally rejects the original offer. Your employer can accept, negotiate, or withdraw the offer entirely, so employees often review objective figures like unpaid bonuses or notice pay with an independent solicitor first.',
  },
  {
    q: 'What happens to the deadline if I need more time?',
    a: 'Your employer sets the deadline, though ACAS Code of Practice 4 (para 12) recommends at least 10 calendar days as general guidance. This is guidance rather than a strict legal right. Because an employer can withdraw an unaccepted offer at common law (Routledge v Grant), taking independent legal advice before a deadline passes helps clarify your options.',
  },
  {
    q: 'Do I still get my notice pay if I do not sign?',
    a: 'If your employment ends by redundancy or ordinary dismissal, you remain entitled to contractual or statutory notice pay unless summarily dismissed for gross misconduct (Boston Deep Sea Fishing v Ansell). If you do not sign and your employment continues, you receive your normal salary while employed.',
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

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function RejectSettlementAgreementGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
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
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Employee rights</span>
            </div>
            <h1 className="sc-h1 mb-4">
              What happens if you do not sign a settlement agreement
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Holding an unsigned settlement agreement? If you decline to sign, your employment contract stays active and your employer cannot force you to accept. Check your calculated statutory baseline in 60 seconds with no email required, see what procedures may follow, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Statutory Check */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Check your calculated statutory baseline, notice pay, and tax-free exit limits before deciding your next step."
                disputeType="negotiation"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Tax-Free Threshold', value: '£30,000', statute: 'ITEPA 2003 s.403' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={45000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Key Takeaways Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">Core Facts</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Declining to sign leaves your existing employment contract in place.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Your employer can resume formal procedures, such as redundancy or capability reviews.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Under Section 203(3) ERA 1996, an agreement is only binding after independent legal advice from a qualified solicitor.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Does refusing to sign end your employment?</h2>
              <p className="guide-body">
                No. If you do not sign a settlement agreement, your contract of employment stays active. You continue in your role, receive your normal salary, and accrue annual leave.
              </p>
              <p className="guide-body">
                Your existing contract terms also remain in force, including any notice period, garden leave provisions, or non-compete clauses.
              </p>
              <p className="guide-body">
                For an agreement to be legally valid, you must receive independent legal advice from a qualified adviser.¹ Employers standardly contribute £350 to £500+ plus VAT upon completion.² You have the right to choose your own solicitor (see our guide on{' '}
                <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink">
                  do you have to use your employer&apos;s solicitor?
                </Link>).
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. What workplace procedures can your employer start next?</h2>
              <p className="guide-body">
                Employers use settlement agreements to resolve exits quickly and avoid formal processes. If you do not sign, your employer will usually start or resume a formal workplace procedure.
              </p>
              <p className="guide-body">
                Under Section 111A ERA 1996, pre-termination settlement talks are generally inadmissible in ordinary unfair dismissal claims. However, Section 111A does not protect claims involving discrimination, whistleblowing, or improper behaviour.
              </p>
              <p className="guide-body">
                Common procedures include:
              </p>
              <ul className="list-disc pl-5 text-[15px] text-muted leading-relaxed space-y-2">
                <li>
                  <strong className="text-ink">Redundancy consultation:</strong> Your employer must follow statutory consultation rules if reducing headcount.³ Employees with two years&apos; continuous service qualify for statutory redundancy pay under Section 141 ERA 1996, subject to the 2026 weekly cap of £751 in Great Britain⁷ (£783 in Northern Ireland).¹¹ You can{' '}
                  <Link href="/redundancy-calculator/" className="text-coral underline underline-offset-2 hover:text-ink">
                    calculate your redundancy
                  </Link>{' '}
                  to check this figure.
                </li>
                <li>
                  <strong className="text-ink">Performance improvement plans:</strong> Your employer sets targets to monitor your work over several weeks or months. Unmet targets can lead to dismissal for capability.
                </li>
                <li>
                  <strong className="text-ink">Disciplinary procedures:</strong> Your employer investigates allegations of misconduct under the ACAS Code of Practice.⁵ Failure to follow a fair process may support an unfair dismissal claim.⁴
                </li>
              </ul>
            </div>

            <ReviewCallout
              title="Weighing up whether to sign your agreement?"
              description="Compare your draft terms against April 2026 statutory limits, notice pay rules, and official employment tribunal payout data."
              ctaText="Check my offer now →"
              badge="April 2026 Statutory Check"
            />

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How does a settlement offer compare to an employment tribunal?</h2>
              <p className="guide-body">
                Declining an offer to pursue an employment tribunal claim involves clear trade-offs. You weigh a guaranteed payment now against the time, cost, and uncertainty of a hearing.
              </p>
              <p className="guide-body">
                Tribunal claims are public and hearings often take many months to reach a conclusion. If a claim fails, you receive nothing.
              </p>
              <p className="guide-body">
                If a claim succeeds, compensation is based on actual financial loss and statutory caps. In 2026, the unfair dismissal compensatory award is capped at £123,543 or one year&apos;s gross pay, whichever is lower.⁶ You can estimate potential awards using our{' '}
                <Link href="/unfair-dismissal-calculator/" className="text-coral underline underline-offset-2 hover:text-ink">
                  Unfair Dismissal Calculator
                </Link>. The basic award is capped at £22,530.⁷
              </p>
              <p className="guide-body">
                By contrast, up to £30,000 of genuine ex-gratia compensation in a settlement agreement can be paid tax-free under ITEPA 2003 s.403.⁸ Contractual notice, holiday pay, and garden leave are always taxed as wages.
              </p>

              {/* Comparison table */}
              <div className="overflow-x-auto pt-4">
                <table className="w-full text-left border-collapse border border-rule rounded-lg">
                  <thead>
                    <tr className="bg-paper border-b border-rule">
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Action</th>
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Financial Certainty</th>
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Timeline</th>
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Privacy &amp; Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-[14px]">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Accepting the Offer</td>
                      <td className="p-3 text-muted">Binding contractual payment, with qualifying ex-gratia sums tax-free up to £30,000 under ITEPA s.403.⁸</td>
                      <td className="p-3 text-muted">Typically concluded within 10 to 21 days.</td>
                      <td className="p-3 text-muted">Private agreement, often with an agreed factual reference.</td>
                    </tr>
                    <tr className="bg-paper-2/20">
                      <td className="p-3 font-semibold text-ink">Declining the Offer</td>
                      <td className="p-3 text-muted">No guaranteed payout; tribunal awards are subject to statutory caps.⁶</td>
                      <td className="p-3 text-muted">Employment tribunal claims can take several months.</td>
                      <td className="p-3 text-muted">Public tribunal judgments, with no agreed reference.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-6">
              <h2 className="guide-h2">4. What steps follow if you decline the offer?</h2>

              <div className="relative border-l border-rule ml-3 space-y-8 pb-4">
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Gather your key documents</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Keep copies of your employment contract, bonus terms, and recent performance reviews. Note down key dates and written communications.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Check your calculated statutory baseline</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Use the{' '}
                    <Link href="/calculator/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      SettlementCheck calculator
                    </Link>{' '}
                    to verify your statutory redundancy entitlement, notice pay, and tax split.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Identify any missing entitlements</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Check whether accrued holiday pay, commission, or contractual notice are accurately listed. Review non-compete restrictions and garden leave terms.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">4</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Understand counter-proposal risks</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Under UK contract law (Hyde v Wrench), a counter-offer rejects the original offer. Read how talks typically progress in our guide on{' '}
                    <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                      how to negotiate a settlement agreement
                    </Link>.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">5</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Speak with an independent solicitor</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    An SRA-regulated solicitor can advise on your draft terms and legal options. Employers standardly contribute £350 to £500+ plus VAT upon completion, though excess or abortive work is subject to your solicitor engagement terms (read{' '}
                    <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink">
                      do you have to use your employer&apos;s solicitor?
                    </Link>).
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and notice pay using April 2026 rates.
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

            {/* FAQ */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'ACAS Code 4 10-day guidance and how to handle employer deadlines.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'UK contract rules under Hyde v Wrench and offer revocation risks.',
                  tag: 'Offer Protection',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How settlement talks work, tax splits, and legal fee contributions.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Compare your offer against calculated statutory baselines and UK ranges.',
                  tag: 'Valuation',
                },
                {
                  href: '/guides/acas-statutory-timeline/',
                  title: 'ACAS Statutory Timeline & 10-Day Rule',
                  description: 'Check ACAS 10-calendar-day guidance and 3-month tribunal limitation dates.',
                  tag: 'Deadlines',
                },
                {
                  href: '/unfair-dismissal-calculator/',
                  title: 'Unfair Dismissal Calculator',
                  description: 'Estimate basic and compensatory awards under 2026 statutory limits.',
                  tag: 'Calculator',
                },
              ]}
            />

            {/* Footnotes and Citations */}
            <div className="space-y-4 pt-8 border-t border-rule">
              <h2 className="text-[16px] font-semibold text-ink">Statutory Citations</h2>
              <ul className="space-y-2">
                <li className="text-[13px] text-muted-2">
                  ¹ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.203(3)</a> outlines the statutory requirements for a settlement agreement to be legally binding, including independent legal advice.
                </li>
                <li className="text-[13px] text-muted-2">
                  ² Employer contributions to legal fees are standard UK practice to satisfy s.203 of the Employment Rights Act 1996 upon completion.
                </li>
                <li className="text-[13px] text-muted-2">
                  ³ <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/188" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Trade Union and Labour Relations (Consolidation) Act 1992, s.188</a> governs collective redundancy consultation duties.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁴ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/94" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.94</a> establishes the right not to be unfairly dismissed.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁵ <a href="https://www.acas.org.uk/acas-code-of-practice-on-disciplinary-and-grievance-procedures" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">ACAS Code of Practice on Disciplinary and Grievance Procedures</a> sets the statutory standard for fair workplace procedures.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁶ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.124</a>, as amended by the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310), caps the unfair dismissal compensatory award at £123,543.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁷ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.162</a>, as amended by SI 2026/310, caps weekly pay for statutory redundancy calculations at £751.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁸ <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003), s.403</a> exempts the first £30,000 of qualifying termination payments from income tax.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁹ <a href="https://www.acas.org.uk/acas-code-of-practice-on-settlement-agreements" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">ACAS Code of Practice on Settlement Agreements (Code 4)</a> recommends a minimum of 10 calendar days as general guidance to consider an offer.
                </li>
                <li className="text-[13px] text-muted-2">
                  ¹⁰ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/86" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.86</a> sets statutory minimum notice periods based on length of service.
                </li>
                <li className="text-[13px] text-muted-2">
                  ¹¹ <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)</a> sets the Northern Ireland weekly pay cap at £783.
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="text-[14px] text-muted border-t border-rule pt-6 leading-relaxed">
              Figures on this page reflect the Employment Rights (Increase of Limits) Order 2026, in force from 6 April 2026. Last reviewed: May 2026. SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement process and does not constitute legal advice.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
