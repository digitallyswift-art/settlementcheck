import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Not Signing a Settlement Agreement | 2026 Rights | SettlementCheck',
  description: 'Understand what happens if you reject a settlement agreement in the UK. Learn about alternative workplace procedures, notice pay, and tribunal risks.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/what-happens-if-you-do-not-sign',
  },
}

const FAQS = [
  {
    q: 'Can my employer dismiss me for refusing to sign?',
    a: 'No. Your employer cannot dismiss you simply for refusing to sign a settlement agreement. Refusal is not a lawful reason for dismissal. However, if you do not sign, your employer can proceed with their alternative workplace procedures. If they follow a fair process, they can legally dismiss you at the end of it.',
  },
  {
    q: 'Can I ask for more money if I reject their initial offer?',
    a: 'Yes. You are entitled to negotiate. Rejecting the initial offer allows you to submit a counter-offer with a higher settlement amount. Your employer is not obliged to accept your counter-proposal. They can negotiate, reiterate their original offer, or withdraw the settlement entirely. You should present a clear, fact-based business case to justify why a higher figure is appropriate.',
  },
  {
    q: 'What happens to the deadline if I need more time?',
    a: 'Your employer sets the deadline, but they must give you reasonable time to consider the offer. Under the ACAS Code of Practice, you should have at least 10 calendar days to review the terms. If you need more time, you should ask your employer for an extension. Inform them that you are arranging independent legal advice as required by law.',
  },
  {
    q: 'Do I still get my notice pay if I do not sign?',
    a: 'Yes. You are always entitled to your contractual or statutory notice pay if your employment is terminated. Notice pay is a legal right. If you do not sign the agreement and your employment continues, you receive your normal pay. If you are subsequently dismissed, your employer must pay your notice period. Your employer cannot withhold your notice pay as a penalty for refusing to sign the settlement agreement.',
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
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function RejectSettlementAgreementGuide() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Employee rights</span>
            </div>
            <h1 className="sc-h1 mb-6">
              What happens if you do not sign a settlement agreement
            </h1>
            <p className="sc-lead text-[17px] leading-relaxed">
              If you do not sign a settlement agreement, your employment continues under your existing contract. Your employer cannot force you to sign, but they can resume alternative workplace procedures. In 2026, the statutory redundancy weekly pay cap is £751 in Great Britain⁷ (£783 in Northern Ireland).¹¹ You can reject the offer to negotiate for a higher settlement or start employment tribunal proceedings.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Key Takeaways Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">Core Facts</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Refusing to sign means your employment status does not change.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Your employer can resume formal procedures, including redundancy or performance reviews.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">You must receive independent legal advice from a qualified solicitor for an agreement to be binding.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">1. Your employment status remains unchanged</h2>
              <p className="guide-body">
                If you do not sign a settlement agreement, your contract of employment remains active. You continue to perform your job, receive your normal pay, and accumulate annual leave. Rejecting the offer does not end your employment.
              </p>
              <p className="guide-body">
                Negotiations can continue after you reject an initial offer. Many employers expect a counter-offer. You can suggest a higher figure, request a different notice period, or negotiate non-financial terms.
              </p>
              <p className="guide-body">
                To make a binding agreement, you must receive independent legal advice from a qualified solicitor.¹ Your employer usually pays a contribution to cover this cost.²
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">2. Alternative workplace procedures</h2>
              <p className="guide-body">
                Employers offer settlement agreements to resolve situations quickly and avoid formal processes. If you do not sign, your employer will likely start or resume a formal workplace procedure.
              </p>
              <p className="guide-body">
                The specific procedure depends on the reasons your employer offered the settlement. These formal routes can lead to dismissal if they are completed.
              </p>
              <p className="guide-body">
                Common procedures include:
              </p>
              <ul className="list-disc pl-5 text-[15px] text-muted leading-relaxed space-y-2">
                <li>
                  <strong className="text-ink">Redundancy consultation:</strong> Your employer must follow statutory consultation rules if they are reducing staff numbers.³ If they do not, you can bring a case for unfair dismissal.⁴
                </li>
                <li>
                  <strong className="text-ink">Performance improvement plans:</strong> Your employer sets targets to monitor your work over several weeks or months. Failure to meet these targets can lead to dismissal for capability.
                </li>
                <li>
                  <strong className="text-ink">Disciplinary procedures:</strong> Your employer investigates allegations of misconduct. They must follow the ACAS Code of Practice on disciplinary and grievance procedures.⁵
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">3. Risk vs. reward</h2>
              <p className="guide-body">
                Rejecting a settlement agreement to pursue an employment tribunal case involves substantial risk and reward. You must weigh the guaranteed value of the offer against the uncertainty of tribunal proceedings.
              </p>
              <p className="guide-body">
                Tribunal cases are time-consuming and public. In the UK, hearing dates are often scheduled several months in advance. The process can cause significant personal stress.
              </p>
              <p className="guide-body">
                If you lose at a tribunal, you receive nothing. If you win, the tribunal awards compensation based on your actual financial loss and statutory caps.
              </p>
              <p className="guide-body">
                In 2026, the maximum unfair dismissal compensation is £123,543, or one year of gross pay, whichever is lower.⁶ The basic award is calculated using your age and length of service, capped at a maximum of £22,530.⁷
              </p>
              <p className="guide-body">
                Contrast these limits with the immediate payment offered in your settlement agreement. Up to £30,000 of a compensation payment can be paid tax-free under UK tax rules.⁸
              </p>

              {/* Comparison table */}
              <div className="overflow-x-auto pt-4">
                <table className="w-full text-left border-collapse border border-rule rounded-lg">
                  <thead>
                    <tr className="bg-paper border-b border-rule">
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Action</th>
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Financial Certainty</th>
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Timeline</th>
                      <th className="p-3 text-[13px] font-semibold text-ink uppercase tracking-wider">Privacy & Reference</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-[14px]">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Accepting the Offer</td>
                      <td className="p-3 text-muted">Guaranteed payment, including tax-free sums up to £30,000.⁸</td>
                      <td className="p-3 text-muted">Typically resolved within 10 to 21 days.</td>
                      <td className="p-3 text-muted">Private contract, with an agreed factual reference.</td>
                    </tr>
                    <tr className="bg-paper-2/20">
                      <td className="p-3 font-semibold text-ink">Refusing the Offer</td>
                      <td className="p-3 text-muted">No guarantee of payment, capped by statutory limits.⁶</td>
                      <td className="p-3 text-muted">Tribunal cases can take several months.</td>
                      <td className="p-3 text-muted">Public hearings, with no guaranteed reference.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-6">
              <h2 className="guide-h2 text-[24px]">4. What to do next if you are rejecting the offer</h2>
              
              <div className="relative border-l border-rule ml-3 space-y-8 pb-4">
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Gather your evidence</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Collect copies of emails, performance reviews, and contract documents. Keep a diary of relevant events, conversations, and dates.</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Calculate your entitlements</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Use the SettlementCheck calculator to verify your statutory redundancy minimums and notice pay. This establishes your baseline.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Write down your reasoning</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Draft a clear statement explaining why the offer is insufficient. Use facts and figures to support your case.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">4</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Submit a counter-proposal</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Present your response to your employer in writing. Suggest a specific settlement amount, outline non-financial terms, and state your reasons.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">5</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Instruct a solicitor</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Engage an SRA-regulated solicitor to review your draft counter-proposal. They will advise on whether your expectations are realistic.</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Find out where you stand
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Calculate your statutory minimums instantly using 2026/2027 legal rates. No email required.
              </p>
              <Link href="/redundancy-calculator" className="btn-accent">
                Check offer ranges →
              </Link>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2 text-[24px]">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Footnotes and Citations */}
            <div className="space-y-4 pt-8 border-t border-rule">
              <h2 className="text-[16px] font-semibold text-ink">Statutory Citations</h2>
              <ul className="space-y-2">
                <li className="text-[13px] text-muted-2">
                  ¹ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.203(3)</a> outlines the statutory requirements for a settlement agreement to be legally binding, including the requirement for independent legal advice.
                </li>
                <li className="text-[13px] text-muted-2">
                  ² Employer contributions to legal fees are a standard industry practice to ensure compliance with s.203 of the Employment Rights Act 1996.
                </li>
                <li className="text-[13px] text-muted-2">
                  ³ <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/188" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Trade Union and Labour Relations (Consolidation) Act 1992, s.188</a> governs the duty of an employer to consult representatives on collective redundancies.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁴ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/94" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.94</a> establishes the right of an employee not to be unfairly dismissed.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁵ <a href="https://www.acas.org.uk/code-of-practice-on-disciplinary-and-grievance-procedures" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">ACAS Code of Practice on Disciplinary and Grievance Procedures</a> provides the statutory standard for fair workplace procedures.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁶ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.124</a>, as amended by the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310), caps the compensatory award for unfair dismissal at £123,543.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁷ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.162</a>, as amended by SI 2026/310, caps the weekly pay for statutory redundancy calculations at £751.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁸ <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003), s.403</a> exempts the first £30,000 of a termination payment from income tax.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁹ <a href="https://www.acas.org.uk/code-of-practice-on-settlement-agreements" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">ACAS Code of Practice on Settlement Agreements</a> recommends a minimum of 10 calendar days for employees to consider an offer.
                </li>
                <li className="text-[13px] text-muted-2">
                  ¹⁰ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/86" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.86</a> establishes the statutory minimum notice periods based on length of service.
                </li>
                <li className="text-[13px] text-muted-2">
                  ¹¹ <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)</a> sets the weekly pay cap for statutory redundancy in Northern Ireland at £783.
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed">
              Figures on this page reflect the Employment Rights (Increase of Limits) Order 2026, in force from 6 April 2026. Last reviewed: May 2026. SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement process and does not constitute legal advice.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
