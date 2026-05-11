import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Do I Have to Use the Solicitor My Employer Recommends? | SettlementCheck',
  description: 'No. You are entitled to choose your own solicitor for independent legal advice on a settlement agreement. Here is what the law says.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/employer-recommended-solicitor',
  },
}

const FAQS = [
  {
    q: 'Can my employer refuse to pay fees if I choose my own solicitor?',
    a: 'No. The legal fees contribution is part of the settlement process. Your employer cannot withhold it because you chose a different solicitor.',
  },
  {
    q: 'Does it take longer if I use a different solicitor?',
    a: 'Not usually. A solicitor who specialises in settlement agreements can typically review the agreement and provide advice within one to two days. Speed depends on the solicitor, not on which one your employer preferred.',
  },
  {
    q: 'What if the recommended solicitor has already started reviewing my agreement?',
    a: 'You can still change solicitor at any point before you sign. Nothing is binding until you have received independent legal advice and signed the agreement. If you want a second opinion, you are entitled to get one.',
  },
  {
    q: 'Is the solicitor my employer recommends likely to be biased?',
    a: 'Not necessarily biased, but their professional relationship is with your employer rather than with you. That does not guarantee poor advice. It does mean your interests and their interests are not perfectly aligned.',
  },
  {
    q: 'How much will a solicitor cost me?',
    a: "Your employer covers the solicitor's fees for reviewing a settlement agreement. The standard contribution is £350 to £750. You should not have to pay anything out of your own pocket for the initial advice.",
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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="10" cy="6.5" r="1" fill="currentColor"/>
    </svg>
  )
}

export default function EmployerRecommendedSolicitor() {
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Legal advice</span>
            </div>
            <h1 className="sc-h1 mb-6">
              Do I have to use the solicitor my employer recommends?
            </h1>
            <p className="sc-lead">
              No. You are not required to use the solicitor your employer suggests. You have the right to choose any solicitor you want for independent legal advice. This is not a courtesy. It is built into the legal process.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Key Takeaways */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">The short answer</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Your employer can suggest a solicitor. They cannot insist you use one.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">The legal requirement is for <em>independent</em> advice. Any qualified, SRA-regulated solicitor satisfies this.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Your employer must still pay the legal fees contribution, regardless of which solicitor you choose.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 — What the law says */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">1. What the law actually requires</h2>
              <p className="guide-body">
                Before a settlement agreement is legally binding, you must receive independent legal advice from a qualified solicitor or other relevant adviser. This is set out in Section 203 of the Employment Rights Act 1996.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-2 flex items-start gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>The key word is independent.</strong> The advice must come from someone who is not connected to your employer or acting in their interests. It must be advice given on your behalf, about your situation. Your employer cannot tell you which solicitor to use.
                </p>
              </div>
            </div>

            {/* Section 2 — Why employers recommend */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">2. Why employers recommend a specific solicitor</h2>
              <p className="guide-body">
                Most employers suggest a solicitor as a practical convenience. In straightforward cases, the recommended solicitor may be competent and fair. But the relationship they have is with your employer, not with you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">What they may have done before</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Handled previous settlement agreements for that employer
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Built a working relationship with the HR team
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Developed a commercial relationship with the business
                    </li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">What that means for you</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> They have an incentive to complete the process smoothly
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> They may be less likely to push back on unfair terms
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> They are not obligated to flag whether you could negotiate more
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3 — What independent means */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">3. What "independent" actually means</h2>
              <p className="guide-body">
                Independent legal advice means the solicitor is acting solely in your interests. They have no connection to your employer and are not looking to maintain a relationship with their HR department for future work.
              </p>

              <div className="space-y-4 mt-2">
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Honest assessment of the offer</strong>
                  <span className="text-muted text-[15px]">A genuinely independent solicitor will tell you whether your offer is fair against the statutory minimums and typical market rates for your circumstances.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Willingness to negotiate</strong>
                  <span className="text-muted text-[15px]">They will advise on whether a counter-offer is worth pursuing and, if so, how to frame it. An independent solicitor has no reason to rush you towards signing.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">No conflict of interest</strong>
                  <span className="text-muted text-[15px]">Their only obligation is to you. They are not weighing your case against their future commercial relationship with your employer.</span>
                </div>
              </div>
            </div>

            {/* Section 4 — Fees */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">4. Your employer still pays the fees</h2>
              <p className="guide-body">
                Whichever solicitor you choose, your employer is required to cover the cost of your legal advice. The standard contribution is £350 to £750 for a straightforward case.
              </p>

              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>You are not penalised financially</strong> for choosing your own solicitor. The contribution stays the same.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>You should not pay anything out of pocket</strong> for the initial advice and review of the agreement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>If negotiation extends the scope</strong>, some solicitors will seek to recover additional fees from your employer as part of the settlement.</span>
                </li>
              </ul>
            </div>

            {/* Section 5 — When to choose your own */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">5. When to choose your own solicitor</h2>
              <p className="guide-body">
                Choosing your own solicitor is a right, not an obligation. The recommended solicitor may be perfectly adequate in many situations. But certain circumstances make independent advice more important.
              </p>

              <div className="space-y-3 mt-2">
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">A</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">Long-term employer relationship with the firm</strong>
                    <span className="text-muted text-[14px] leading-relaxed">If the recommended firm has handled multiple agreements for your employer, their incentive is to keep the process frictionless, not to maximise your outcome.</span>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">B</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">You feel rushed or under-advised</strong>
                    <span className="text-muted text-[14px] leading-relaxed">If the solicitor seems reluctant to discuss negotiation, dismisses your questions, or is pushing you to sign quickly, those are signs the advice may not be fully independent.</span>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">C</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">Discrimination, whistleblowing, or disputed facts</strong>
                    <span className="text-muted text-[14px] leading-relaxed">If your case involves potential discrimination claims or protected disclosures, you need a solicitor with no reason to downplay those claims.</span>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">D</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">You want to know if the offer could be higher</strong>
                    <span className="text-muted text-[14px] leading-relaxed">An independent solicitor will give you an honest assessment of whether negotiation is realistic in your situation, and what a reasonable counter-offer might look like.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6 — What to say */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">6. What to say to your employer</h2>
              <p className="guide-body">
                You do not need to explain or justify your choice of solicitor. A brief, factual response is all that is needed.
              </p>

              <div className="bg-paper-2 border border-rule rounded-xl p-6">
                <p className="text-[13px] font-medium text-muted uppercase tracking-wider mb-3">Example wording</p>
                <p className="text-[16px] text-ink leading-relaxed font-serif italic">
                  &ldquo;Thank you for the recommendation. I will be arranging my own independent legal advice.&rdquo;
                </p>
              </div>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>If your employer objects or applies pressure</strong> to use their recommended solicitor, make a note of it. An independent solicitor can advise on whether that constitutes undue pressure and whether it affects your position.
                </p>
              </div>
            </div>

            {/* Section 7 — How to find */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">7. How to find an independent solicitor</h2>
              <p className="guide-body">
                You can search for employment solicitors in your area through the{' '}
                <a
                  href="https://www.sra.org.uk/consumers/register/"
                  className="text-ink underline underline-offset-2 hover:text-coral transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitors Regulation Authority&apos;s website
                </a>
                , which lists all SRA-regulated solicitors in England and Wales.
              </p>
              <p className="guide-body">
                When you contact a solicitor, ask two questions directly: do they specialise in settlement agreements, and do they have any existing relationship with your employer or their legal team? A good solicitor will answer both without hesitation.
              </p>

              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-5 mt-2">
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.sra.org.uk/consumers/register/" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">SRA Solicitor Register</a> — verify any solicitor is currently authorised to practise
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.acas.org.uk/settlement-agreements" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">ACAS Guide to Settlement Agreements</a> — official guidance on your rights
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.citizensadvice.org.uk/work/problems-at-work/settlement-agreements/" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">Citizens Advice: Settlement Agreements</a> — plain-English overview of the process
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Find out where your offer stands
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Free calculator. Vetted solicitor matched within 24 hours. Your employer pays the fees.
              </p>
              <Link href="/calculator" className="btn-accent">
                Check my offer →
              </Link>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-2">
              <h2 className="guide-h2 text-[24px]">Frequently asked questions</h2>
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
