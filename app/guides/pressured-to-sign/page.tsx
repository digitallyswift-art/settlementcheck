import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Pressured to Sign a Settlement Agreement? | 10-Day Rule | SettlementCheck',
  description: 'Understand your rights if your employer is pressuring you to sign a settlement agreement. Learn about the ACAS 10-day rule, improper behaviour, and your options.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/pressured-to-sign',
  },
}

const FAQS = [
  {
    q: 'Can my employer give me 24 hours to sign a settlement agreement?',
    a: 'No. ACAS guidelines state that employers should provide a minimum of 10 calendar days for you to consider the offer and seek independent legal advice. Unreasonable deadlines may invalidate the confidentiality of the offer.',
  },
  {
    q: 'What happens if I refuse to sign within their deadline?',
    a: 'If you refuse to sign, your employer must proceed with their standard formal processes (like a redundancy consultation or performance review). They cannot dismiss you legally just because you refused to sign the agreement.',
  },
  {
    q: 'Can they threaten to fire me if I don\'t sign?',
    a: 'No. Threatening immediate dismissal if you reject the settlement offer is classified as "improper behaviour" under Section 111A of the Employment Rights Act 1996. This means the conversation is no longer protected and can be used as evidence in an employment tribunal.',
  },
  {
    q: 'Should I tell the independent solicitor about the pressure?',
    a: 'Yes. Inform the independent solicitor immediately. They will use this information to assess your position and may advise that you have a stronger case to negotiate a higher offer or bring a tribunal claim.',
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

export default function PressuredToSignGuide() {
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
              My employer is pressuring me to sign a settlement agreement quickly. What are my rights?
            </h1>
            <p className="sc-lead text-[17px] leading-relaxed">
              Under ACAS guidelines, your employer should give you a minimum of 10 calendar days to consider a settlement agreement and receive independent legal advice¹. If you are being pressured to sign immediately or threatened with dismissal for not signing, this may constitute "improper behaviour" under Section 111A of the Employment Rights Act 1996², potentially invalidating the protections of the agreement.
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
                  <span className="text-[15px] text-ink leading-relaxed">You are entitled to a minimum of 10 calendar days to consider the offer.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Threatening immediate dismissal if you don't sign is legally classified as improper behaviour.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Artificial deadlines are often a sign that the employer wants to avoid a proper, legal consultation process.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">1. The 10-Day Rule</h2>
              <p className="guide-body">
                When an employer presents a settlement agreement, the clock does not stop instantly. The ACAS Code of Practice on Settlement Agreements expressly states that employers should allow a minimum of 10 calendar days for you to consider the terms and seek independent legal advice.
              </p>
              <p className="guide-body">
                If an employer demands a signature within 24 or 48 hours, they are in breach of these guidelines. While the ACAS code is not legally binding in itself, employment tribunals take it highly into account when assessing whether an employer acted reasonably or applied undue pressure.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">2. What Counts as "Improper Behaviour"?</h2>
              <p className="guide-body">
                Settlement discussions are usually protected by Section 111A of the Employment Rights Act 1996, meaning they cannot be used as evidence in a future unfair dismissal tribunal. However, this protection vanishes if the employer engages in "improper behaviour."
              </p>
              
              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-4 flex items-start gap-3">
                <AlertIcon />
                <div>
                  <strong className="text-ink block text-[15px] mb-1">Examples of improper behaviour include:</strong>
                  <ul className="list-disc pl-4 text-[14px] text-ink leading-relaxed space-y-1">
                    <li>Putting undue pressure on you to agree to the offer.</li>
                    <li>Not allowing a reasonable time to consider the agreement (such as ignoring the 10-day rule).</li>
                    <li>Threatening to dismiss you immediately if the agreement is rejected.</li>
                    <li>Bullying, harassment, or intimidation during the negotiation meeting.</li>
                  </ul>
                </div>
              </div>
              <p className="guide-body mt-4">
                If your employer crosses this line, the conversation is no longer "off the record." You can reference their threats and pressure in a future tribunal claim, which significantly strengthens your position.
              </p>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">3. Why Do Employers Apply Pressure?</h2>
              <p className="guide-body">
                Understanding why an employer is rushing you can help you assess your position. Usually, extreme urgency signals that the employer is trying to bypass a mandatory statutory process.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Avoiding Redundancy Protocols</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    If they are making 20 or more staff redundant, they must undergo collective consultation (up to 45 days)³. Rushing a settlement bypasses this costly and lengthy process.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Hiding Weak Disciplinary Cases</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    If they want to dismiss you for performance but haven't followed a formal Performance Improvement Plan (PIP), a rushed settlement covers up their failure to follow a fair procedure.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-6">
              <h2 className="guide-h2 text-[24px]">4. What to Do Next</h2>
              
              <div className="relative border-l border-rule ml-3 space-y-8 pb-4 mt-4">
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Do not sign anything on the spot</h3>
                  <p className="text-[15px] text-muted leading-relaxed">A settlement agreement is only legally binding once you have received independent legal advice. Acknowledge receipt of the document, but do not sign it.</p>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Respond in writing</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Send a professional email stating: "I have received the draft agreement. In line with ACAS guidelines, I will require a minimum of 10 calendar days to review the terms and seek independent legal advice."</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Assess the offer value</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Determine if the offer is fair. Calculate your statutory entitlements, including capped weekly pay (£751 in Great Britain)⁴ and your notice period, to understand your financial baseline.</p>
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
                  ¹ <a href="https://www.acas.org.uk/acas-code-of-practice-on-settlement-agreements" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">ACAS Code of Practice on Settlement Agreements (2013)</a>, paragraph 12.
                </li>
                <li className="text-[13px] text-muted-2">
                  ² <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.111A</a>.
                </li>
                <li className="text-[13px] text-muted-2">
                  ³ <a href="https://www.legislation.gov.uk/ukpga/1992/52/section/188" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Trade Union and Labour Relations (Consolidation) Act 1992, s.188</a>.
                </li>
                <li className="text-[13px] text-muted-2">
                  ⁴ <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="underline hover:text-coral transition-colors">Employment Rights Act 1996, s.227</a>, as amended by the Employment Rights (Increase of Limits) Order 2025.
                </li>
              </ul>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed">
              Figures on this page reflect the Employment Rights (Increase of Limits) Order 2025, in force from 6 April 2025. Last reviewed: May 2026. SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement process and does not constitute legal advice.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
