import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'How to Negotiate a Settlement Agreement | The Complete UK Guide',
  description: 'Understand the facts of settlement agreement negotiation in the UK. Learn about Without Prejudice rules, leverage, and the step-by-step process.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/how-to-negotiate-a-settlement-agreement',
  },
}

const FAQS = [
  {
    q: 'Does an employee make the first offer?',
    a: 'Usually, the employer makes the initial offer. This establishes a baseline figure. Once the employer presents a number, the employee can evaluate it against their statutory entitlements and counter-offer.',
  },
  {
    q: 'Can an employer dismiss an employee for negotiating?',
    a: 'No. Negotiating a settlement is not a legal ground for dismissal. However, if the alternative to the settlement is a formal redundancy or performance process, refusing the settlement means that formal process will resume.',
  },
  {
    q: 'Does the employer pay the legal fees for negotiation?',
    a: 'Employers pay a set contribution (typically £350 to £750) for the employee to receive independent legal advice on the terms of the agreement. If the solicitor spends additional time negotiating new terms, those extra fees usually fall to the employee, unless the solicitor secures an agreement from the employer to cover them.',
  },
  {
    q: 'How long does the process take?',
    a: 'ACAS recommends employers provide a minimum of 10 calendar days for an employee to consider an initial offer. A standard negotiation involving counter-offers typically concludes within one to three weeks.',
  },
  {
    q: 'Can an employer withdraw the offer?',
    a: 'Yes. In contract law, a counter-offer acts as a rejection of the original offer. The employer can choose to remove the settlement entirely. In practice, employers usually reject the counter-offer and reiterate their original offer rather than withdrawing the agreement completely.',
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
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="14" r="1" fill="currentColor"/>
    </svg>
  )
}

export default function HowToNegotiateGuide() {
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-6">
              How to Negotiate a Settlement Agreement
            </h1>
            <p className="sc-lead text-[17px] leading-relaxed">
              A settlement agreement is a commercial transaction. Employers offer a sum of money in exchange for an employee giving up their right to bring an employment tribunal claim. This guide breaks down the facts of the negotiation process, the rules of "Without Prejudice" conversations, and how settlement values are calculated.
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
                  <span className="text-[15px] text-ink leading-relaxed">The initial offer is rarely the employer's maximum budget.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Employees must receive independent legal advice for the agreement to be binding.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Up to £30,000 of a genuine compensation payment can often be paid tax-free.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">1. The Employer's Motivation</h2>
              <p className="guide-body">
                Employers use settlement agreements to secure certainty. Dismissing an employee carries legal risk and administrative costs. Even if an employer follows a fair procedure, the employee retains the right to bring a claim to an employment tribunal.
              </p>
              <p className="guide-body">
                Tribunal claims require expensive legal defence and consume management time. A settlement agreement completely eliminates this risk. 
              </p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Common Triggers</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Avoiding a long redundancy consultation.</li>
                    <li>Bypassing a lengthy performance management plan.</li>
                    <li>Resolving an employee grievance quickly.</li>
                    <li>Facilitating a change in business leadership.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">The Negotiation Window</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>The difference between the employer's current offer and their future legal costs.</li>
                    <li>The cost of management time required to manage the employee out.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">2. Protected and Without Prejudice Conversations</h2>
              <p className="guide-body">
                Settlement discussions occur under specific legal frameworks to prevent the conversation from being used as evidence in a future tribunal.
              </p>
              
              <ul className="space-y-4 mt-2">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">A</div>
                  <div>
                    <strong className="text-ink block text-[16px] mb-1">Without Prejudice</strong>
                    <span className="text-muted text-[15px] leading-relaxed">This rule applies when an active dispute already exists between the employer and employee. It allows both parties to propose settlement figures without admitting liability.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">B</div>
                  <div>
                    <strong className="text-ink block text-[16px] mb-1">Section 111A (Protected Conversations)</strong>
                    <span className="text-muted text-[15px] leading-relaxed">This applies even when no active dispute exists. Employers can propose a settlement agreement to end employment on agreed terms.</span>
                  </div>
                </li>
              </ul>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-6 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>Exceptions:</strong> These protections do not cover discriminatory remarks, whistleblowing claims, or cases of "improper behaviour" (such as bullying an employee into signing).
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">3. Assessing Leverage</h2>
              <p className="guide-body">
                Leverage dictates the potential value of a settlement. Strong leverage exists when the employer faces significant financial or reputational risk if the employee refuses to sign. Weak leverage exists when the employer has a watertight, legally sound case for dismissal.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-3 border-b border-rule pb-2">High Leverage</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Strong evidence of discrimination.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> A pending whistleblowing claim.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Failure by the employer to follow statutory procedures.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-3 border-b border-rule pb-2">Low Leverage</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> A genuine redundancy with full consultation completed.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Documented gross misconduct by the employee.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Employee has less than two years of service (with no discrimination claims).
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">4. Calculating the Value</h2>
              <p className="guide-body">
                A settlement offer comprises several financial components. Employees evaluate offers by breaking them down into statutory minimums and compensatory amounts.
              </p>
              
              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Notice Pay:</strong> Payment for the contractual notice period.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Holiday Pay:</strong> Payment for accrued but untaken annual leave.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Statutory Redundancy / Basic Award:</strong> The legal minimum calculation based on age, length of service, and weekly pay.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Ex-gratia Payment:</strong> The additional, discretionary compensation offered to secure the agreement.</span>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">5. Non-Financial Terms</h2>
              <p className="guide-body">
                Settlement agreements dictate the terms of the employee's departure. The non-financial clauses hold significant value and are standard points of negotiation.
              </p>
              
              <div className="space-y-4">
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Agreed Reference</strong>
                  <span className="text-muted text-[15px]">A clause attaching an exact, agreed-upon factual reference to the contract. The employer guarantees to provide this exact wording to future employers.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Internal Announcements</strong>
                  <span className="text-muted text-[15px]">Agreed wording regarding how the employee's departure will be communicated to the rest of the business and clients.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Restrictive Covenants</strong>
                  <span className="text-muted text-[15px]">The negotiation of any post-termination restrictions, such as non-compete clauses, to ensure they do not unfairly restrict future employment.</span>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-6">
              <h2 className="guide-h2 text-[24px]">6. The Step-by-Step Process</h2>
              
              <div className="relative border-l border-rule ml-3 space-y-8 pb-4">
                
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Receive the offer</h3>
                  <p className="text-[15px] text-muted leading-relaxed">The employer presents the settlement offer and the draft agreement. ACAS advises giving the employee 10 days to review it.</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Instruct a solicitor</h3>
                  <p className="text-[15px] text-muted leading-relaxed">The employee provides the draft to an independent solicitor. The solicitor reviews the terms and explains the legal rights being surrendered.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Submit a counter-offer</h3>
                  <p className="text-[15px] text-muted leading-relaxed">If the offer is insufficient, the employee (or their solicitor) submits a factual, commercial counter-offer outlining the financial justification.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">4</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Finalise terms and sign</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Once a figure is agreed, the solicitor ensures the final contract reflects the agreement. Both parties sign, and the employment ends.</p>
                </div>

              </div>
            </div>

            {/* Useful Resources */}
            <div className="space-y-4 pt-6 border-t border-rule">
              <h2 className="guide-h2 text-[20px]">Independent Resources</h2>
              <p className="guide-body">For statutory regulations and official guidance, refer to the following UK bodies:</p>
              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-5">
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.acas.org.uk/settlement-agreements" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">ACAS Guide to Settlement Agreements</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.gov.uk/dismissal/what-your-employer-must-do" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">GOV.UK: Dismissal Rights</a>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.citizensadvice.org.uk/work/problems-at-work/settlement-agreements/" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">Citizens Advice: Settlement Agreements</a>
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Evaluate an offer
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                Calculate statutory minimums and view typical UK settlement ranges based on specific circumstances.
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

            {/* Disclaimer */}
            <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed">
              SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement process and does not constitute legal counsel.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
