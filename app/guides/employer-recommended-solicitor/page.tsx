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
  title: 'Can I Choose My Own Settlement Solicitor? | SettlementCheck',
  description:
    'You have the legal right to choose your own independent settlement solicitor. Employers standardly contribute towards legal advice fees under s.203.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/employer-recommended-solicitor/',
  },
  openGraph: {
    title: 'Can I Choose My Own Settlement Solicitor? | SettlementCheck',
    description:
      'You have the legal right to choose your own independent settlement solicitor. Your employer standardly funds the independent legal advice fee. Here is what the law says.',
    url: 'https://settlementcheck.co.uk/guides/employer-recommended-solicitor/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can I Choose My Own Settlement Solicitor? | SettlementCheck',
    description:
      'You have the legal right to choose your own independent settlement solicitor. Your employer standardly funds the independent legal advice fee. Free guide.',
  },
}

const FAQS = [
  {
    q: 'Can my employer refuse to pay fees if I choose my own solicitor?',
    a: 'In practice, no. To secure an enforceable waiver under Section 203(3) ERA 1996, the employer must ensure you receive independent advice. Withholding the agreed fee contribution simply because you choose an independent solicitor prevents the agreement from becoming binding.',
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
    a: "Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion of the agreement. For standard advice within that cap, you should not face personal fees. Any excess or abortive work if the agreement does not complete is subject to your solicitor's engagement terms.",
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Legal advice</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Do I have to use the solicitor my employer recommends?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 s.203 &amp; SRA Rules
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement with a solicitor name attached? You have the legal right to choose any independent SRA-regulated solicitor instead. Check your statutory baseline in 60 seconds with no email required, see how the £350 to £500+ plus VAT employer fee contribution works, and prepare clear questions before you instruct anyone.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Statutory Baseline Check */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Compare your settlement figure against your calculated statutory baseline and standard legal fee contributions before instructing a solicitor."
                disputeType="general"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Independent Advice', value: 'Mandatory', statute: 'ERA 1996 s.203(3)' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={45000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

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
                  <span className="text-[15px] text-ink leading-relaxed">Employers standardly contribute £350 to £500+ plus VAT upon completion, regardless of which independent SRA-regulated solicitor you choose. Excess or abortive work is subject to your solicitor engagement terms.</span>
                </li>
              </ul>
            </div>

            {/* Section 1: What the law says */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. What does the law actually require for independent advice?</h2>
              <p className="guide-body">
                Before a settlement agreement is legally binding, you must receive independent legal advice from a qualified solicitor or other relevant adviser. This is set out in Section 203(3) of the Employment Rights Act 1996.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-2 flex items-start gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>The key word is independent.</strong> The advice must come from someone not connected to your employer or acting in their interests. Your employer cannot tell you which solicitor to use.
                </p>
              </div>
            </div>

            <ReviewCallout
              title="Want an objective clause check first?"
              description="Before speaking to a solicitor, run your draft terms through our confidential review tool. Check your calculated statutory baseline, tax split, and legal fee contribution."
              ctaText="Check my offer now →"
              badge="April 2026 Statutory Check"
            />

            {/* Section 2: Why employers recommend */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. Why do employers recommend a specific solicitor?</h2>
              <p className="guide-body">
                Many employers suggest a solicitor as a practical convenience. In straightforward cases, the recommended solicitor may be competent and fair. However, their commercial relationship is with your employer, not with you.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
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
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">What that means for you</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> They have an incentive to complete the process smoothly
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> They may be less likely to challenge restrictive terms like a non-compete
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> They are not obligated to flag whether you could negotiate more
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: What independent means */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. What does &ldquo;independent&rdquo; actually mean?</h2>
              <p className="guide-body">
                Independent legal advice means the solicitor acts solely in your interests. They owe a strict duty of care and legal privilege to you, with no commercial tie to your employer&apos;s HR team.
              </p>

              <div className="space-y-4 mt-2">
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Honest assessment of the offer</strong>
                  <span className="text-muted text-[15px]">An independent solicitor checks your offer against your calculated statutory baseline, garden leave terms, and whether notice pay is taxed as wages.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Clear advice on negotiation risks</strong>
                  <span className="text-muted text-[15px]">They explain whether a counter-proposal is worth pursuing and warn you of contract law risks, such as the employer withdrawing the offer.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">No conflict of interest</strong>
                  <span className="text-muted text-[15px]">Their only obligation is to you. They are not weighing your case against future work from your employer.</span>
                </div>
              </div>
            </div>

            {/* Section 4: Fees */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. Who pays the solicitor&apos;s fees if you choose your own?</h2>
              <p className="guide-body">
                Employers standardly contribute £350 to £500+ plus VAT toward your independent legal advice upon completion of the agreement. This commercial contribution applies whichever SRA-regulated solicitor you choose.
              </p>

              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Same contribution applies:</strong> You are not penalised financially for choosing your own SRA-regulated solicitor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Standard review within the cap:</strong> For straightforward reviews upon completion, you should not face personal fee liability.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Excess or abortive work:</strong> If negotiations extend beyond the cap or the agreement does not complete, fees depend on your solicitor engagement terms.</span>
                </li>
              </ul>
            </div>

            {/* Section 5: When to choose your own */}
            <div className="space-y-4">
              <h2 className="guide-h2">5. When does choosing your own solicitor matter most?</h2>
              <p className="guide-body">
                Choosing your own solicitor is your legal right. While a recommended firm may be adequate in simple exits, certain situations make independent representation especially important.
              </p>

              <div className="space-y-3 mt-2">
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">A</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">Long-term employer relationship with the firm</strong>
                    <span className="text-muted text-[14px] leading-relaxed">If the recommended firm handles regular work for your employer, their priority may be a frictionless sign-off rather than challenging restrictive terms.</span>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">B</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">You feel rushed or under-advised</strong>
                    <span className="text-muted text-[14px] leading-relaxed">ACAS Code of Practice 4 recommends 10 calendar days to consider a written offer, though this is guidance rather than a strict legal right. Feeling rushed is a clear signal to seek your own adviser.</span>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">C</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">Discrimination, whistleblowing, or disputed facts</strong>
                    <span className="text-muted text-[14px] leading-relaxed">Section 111A confidentiality only covers ordinary unfair dismissal. It does not shield discrimination, whistleblowing, or improper behaviour, which an independent solicitor can assess.</span>
                  </div>
                </div>
                <div className="flex gap-4 p-4 border border-rule rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">D</div>
                  <div>
                    <strong className="text-ink block text-[15px] mb-1">You want to know if the offer could be higher</strong>
                    <span className="text-muted text-[14px] leading-relaxed">
                      An independent solicitor can explain whether negotiation is realistic, noting that under UK contract law a counter-proposal rejects the original offer. See{' '}
                      <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                        what a fair settlement looks like
                      </Link>.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 6: Communicating your choice */}
            <div className="space-y-4">
              <h2 className="guide-h2">6. How do you tell your employer you are using your own solicitor?</h2>
              <p className="guide-body">
                You do not need to explain or justify your choice of solicitor. A brief, factual reply is enough. Read more in our guide on{' '}
                <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                  how to negotiate a settlement agreement
                </Link>.
              </p>

              <div className="bg-paper-2 border border-rule rounded-xl p-6">
                <p className="text-[13px] font-medium text-muted uppercase tracking-wider mb-3">Example wording employees often use</p>
                <p className="text-[16px] text-ink leading-relaxed font-serif italic">
                  &ldquo;Thank you for the recommendation. I will be arranging my own independent legal advice.&rdquo;
                </p>
              </div>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>If your employer applies pressure</strong> to use their recommended firm, keep a written note of it. An independent solicitor can assess whether this amounts to improper behaviour under Section 111A. See our guide on{' '}
                  <Link href="/guides/pressured-to-sign/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                    your rights when pressured to sign quickly
                  </Link>.
                </p>
              </div>
            </div>

            {/* Section 7: How to find */}
            <div className="space-y-4">
              <h2 className="guide-h2">7. How do you find an independent SRA-regulated solicitor?</h2>
              <p className="guide-body">
                You can search for employment solicitors through the{' '}
                <a
                  href="https://www.sra.org.uk/consumers/register/"
                  className="text-ink underline underline-offset-2 hover:text-coral transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitors Regulation Authority&apos;s register
                </a>
                , which lists all authorised solicitors in England and Wales.
              </p>
              <p className="guide-body">
                Check two things before instructing anyone: whether they regularly handle settlement agreements, and whether they have any conflict of interest with your employer.
              </p>

              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-5 mt-2">
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.sra.org.uk/consumers/register/" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">SRA Solicitor Register</a>: verify any solicitor is currently authorised to practise
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.acas.org.uk/settlement-agreements" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">ACAS Guide to Settlement Agreements</a>: official guidance on your rights
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="guide-body">
                    <a href="https://www.citizensadvice.org.uk/work/problems-at-work/settlement-agreements/" target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:text-coral transition-colors">Citizens Advice: Settlement Agreements</a>: plain-English overview of the process
                  </span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
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
            <div className="space-y-4 pt-2">
              <h2 className="guide-h2">Frequently asked questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Resources"
              items={[
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'Understand ACAS Code 4 guidance and how to handle artificial employer deadlines.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'A step-by-step walkthrough of settlement talks, counter-proposals, and legal fees.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Compare your settlement offer against commercial UK ranges and statutory baselines.',
                  tag: 'Valuation',
                },
                {
                  href: '/guides/nhs-settlement-agreements/',
                  title: 'NHS Settlement Agreements & MARS Calculator 2026',
                  description: 'Why NHS trusts suggest panel solicitors and how independent advice protects pension rights.',
                  tag: 'Public Sector',
                },
                {
                  href: '/guides/home-insurance-legal-cover-settlement-agreement/',
                  title: 'Home Insurance Legal Cover & Settlement Agreements',
                  description: 'Why Legal Expenses Insurance excludes voluntary settlement reviews and how employer contributions fund your solicitor.',
                  tag: 'Legal Fees',
                },
                {
                  href: '/guides/executive-settlement-agreements/',
                  title: 'Executive Settlement Agreements UK (2026)',
                  description: 'Senior director exits, Companies Act s.217 rules, equity vesting, and employer legal fee contributions.',
                  tag: 'Executive Guide',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Regulatory Rules & Statutory References</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203(3) (Mandatory independent legal advice requirement)
                </a>
              </li>
              <li>
                <a href="https://www.sra.org.uk/solicitors/standards-regulations/code-conduct-solicitors/" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Solicitors Regulation Authority (SRA) Code of Conduct for Solicitors (Rules on conflicts of interest & independence)
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Guidance on Settlement Agreements and Legal Costs
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (Pre-termination negotiations & improper behaviour)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the choice of legal representative and does not constitute legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
