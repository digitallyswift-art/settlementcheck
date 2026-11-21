import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'

import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const STATIC_METADATA: Metadata = {
  title: 'Negotiate a Settlement With Your Employer | SettlementCheck',
  description:
    'Negotiate a settlement with your employer under 2026 UK rates (£751/wk). Without prejudice rules, counter-offers, and legal fee contributions. Free guide.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/how-to-negotiate-a-settlement-agreement/',
  },
  openGraph: {
    title: 'Negotiate a Settlement With Your Employer | SettlementCheck',
    description:
      'Negotiate a settlement with your employer under 2026 UK rates (£751/wk). Without prejudice rules, counter-offers, and legal fee contributions. Free guide.',
    url: 'https://settlementcheck.co.uk/guides/how-to-negotiate-a-settlement-agreement/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How to Negotiate a Settlement Agreement 2026 | SettlementCheck',
    description: 'Without Prejudice rules, step-by-step negotiation process, and what a fair UK settlement looks like. Free guide.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/how-to-negotiate-a-settlement-agreement/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Do you have to make the first offer?',
    a: 'Usually your employer puts forward the opening figure, which gives you a baseline to check against your notice pay, holiday pay, and statutory entitlements. Once you have that draft in writing, you and your solicitor can decide whether there is room to ask for more.',
  },
  {
    q: 'Can my employer dismiss me just for trying to negotiate?',
    a: 'Asking questions or proposing higher terms is not a fair reason for dismissal on its own. That said, if talks break down and your employer was already running a genuine redundancy or capability process, that formal process will normally pick up where it left off.',
  },
  {
    q: 'Does my employer pay the legal fees if we negotiate?',
    a: 'Employers standardly offer a capped contribution (typically £350 to £500+ plus VAT) paid directly to your solicitor upon completion of the agreement. That contribution usually covers reviewing and advising on the draft. If your solicitor spends extra time negotiating new terms, the additional cost is governed by your engagement terms unless your employer agrees to raise the fee cap.',
  },
  {
    q: 'How long do settlement negotiations usually take?',
    a: 'ACAS Code of Practice 4 recommends giving you at least 10 calendar days to consider an initial written offer, though this is guidance rather than a strict legal right. In practice, straightforward talks with one or two counter-proposals usually wrap up within one to three weeks.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can legally walk away before anything is signed. Most employers will simply say no or meet partway rather than pulling the plug, but it is a real risk worth weighing up with your solicitor first.',
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              How to Negotiate a Settlement Agreement
            </h1>
            <p className="text-body text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead text-[17px] leading-relaxed">
              Being handed a settlement agreement can feel personal, but to your employer it is a commercial trade: they pay an agreed sum so both sides can part ways without the cost and uncertainty of an employment tribunal. Here is how UK settlement talks actually work in practice, what tends to move the figure, and how to protect yourself before you respond.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Key Takeaways Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">What to Know Before You Respond</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">The first figure on the page is rarely your employer&apos;s final ceiling, especially if notice, bonus, or dismissal risk is in play.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Under Section 203(3) of the Employment Rights Act 1996, the agreement is not legally binding until an independent solicitor advises you on it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Up to £30,000 of a genuine ex-gratia termination payment can normally be paid free of income tax, though contractual notice and holiday pay are always taxed.</span>
                </li>
              </ul>
            </div>

            {/* Interactive Negotiation Micro-Tool */}
        <section className="my-8">
          <EmbeddedCalculatorCard
            badge="Settlement Negotiation Engine"
            title="Calculate Your Settlement Negotiation Position & Counter-Offer Baseline"
            subtitle="Compare your employer's opening offer against the statutory redundancy floor and observed 1 to 3 months commercial negotiation benchmarks."
            disputeType="negotiation"
            statutoryPills={[
              { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
              { label: 'Negotiation Range', value: '1–3 Months Gross', statute: 'Commercial Benchmark' },
              { label: 'Legal Fees', value: '£350–£500+ VAT', statute: 'ERA 1996 s.203 Customary' },
            ]}
            initialSalary={50000}
            initialYears={4}
            initialAge={38}
            ctaText="Calculate My Negotiation Baseline →"
          />
        </section>

        {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">1. Why Your Employer Wants a Deal</h2>
              <p className="guide-body">
                Employers rarely offer a settlement agreement out of generosity. They use one to buy certainty, because dismissing someone carries legal risk, management distraction, and tribunal defence costs even when HR thinks their paperwork is tidy.
              </p>
              <p className="guide-body">
                Once you see the agreement as a risk-management exercise rather than a verdict on your work, it becomes much easier to spot where there is room to move.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Why Offers Happen</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Skipping a drawn-out redundancy consultation.</li>
                    <li>Avoiding months of formal performance management.</li>
                    <li>Closing down an unresolved grievance or dispute.</li>
                    <li>Making a quick leadership or restructure change.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Where the Budget Comes From</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>The legal fees and management hours saved by avoiding a tribunal defence.</li>
                    <li>The salary your employer would otherwise pay during a long consultation or PIP.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">2. Protected and Without Prejudice Conversations</h2>
              <p className="guide-body">
                Most settlement talks happen off the record so neither side can quote the figures in a future employment tribunal. In UK law, two different rules cover this, and the difference matters if talks break down.
              </p>

              <ul className="space-y-4 mt-2">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">A</div>
                  <div>
                    <strong className="text-ink block text-[16px] mb-1">Without Prejudice</strong>
                    <span className="text-muted text-[15px] leading-relaxed">Applies only when there is already a genuine dispute between you and your employer. It lets both sides discuss settlement figures openly without those offers being used as an admission of fault.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">B</div>
                  <div>
                    <strong className="text-ink block text-[16px] mb-1">Section 111A (Protected Conversations)</strong>
                    <span className="text-muted text-[15px] leading-relaxed">Lets your employer propose a settlement even when no dispute exists yet. Crucially, Section 111A only shields standard unfair dismissal claims. It does not protect discrimination, whistleblowing, automatic unfair dismissal, or breach of contract claims.</span>
                  </div>
                </li>
              </ul>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-6 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>Watch for improper behaviour:</strong> Neither rule protects an employer who bullies you, threatens automatic dismissal if you refuse, or gives you an unreasonable deadline to sign. If you are being rushed, read our guide on{' '}
                  <Link href="/guides/pressured-to-sign/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                    your rights when pressured to sign quickly
                  </Link>.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">3. Weighing Up Your Position</h2>
              <p className="guide-body">
                Negotiating power comes down to what happens if you do not sign. If walking away leaves your employer facing a credible legal claim or months of procedural work, your opening offer is more likely to move. If they have followed a clean process and your statutory entitlements are already covered, there is less room on the cash figure.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-3 border-b border-rule pb-2">Stronger Grounds to Negotiate</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Potential discrimination, maternity, or disability issues.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Concerns raised about whistleblowing or protected disclosures.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Procedural shortcuts, such as skipping redundancy consultation or a fair disciplinary process.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-serif text-[18px] text-ink mb-3 border-b border-rule pb-2">Tighter Room to Move</h3>
                  <ul className="space-y-2">
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> A genuine redundancy where fair consultation has already happened.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Clear, documented gross misconduct.
                    </li>
                    <li className="text-[14px] text-muted flex items-start gap-2">
                      <span className="text-coral mt-1">•</span> Under two years of continuous service, unless discrimination or automatic unfair dismissal applies.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <ReviewCallout
              title="Want to know what negotiation strength you have?"
              description="Paste your draft settlement agreement into our free checker. In 60 seconds, see where your employer has cut corners on legal fees, notice pay, and statutory compensation."
              ctaText="Check draft agreement clauses →"
              badge="Tactical Negotiation Tool"
            />

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">4. Breaking Down the Offer</h2>
              <p className="guide-body">
                Employers often present a single headline number that looks generous at first glance, until you realise it already includes your notice pay and unused holiday. Split the offer into four parts before you judge it, bearing in mind that statutory redundancy baselines depend on qualifying service, absence of gross misconduct, and any suitable alternative employment rules under Section 141 ERA 1996.
              </p>

              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink">
                    <strong>Notice Pay (PILON or PENP):</strong> Pay for your contractual notice period. Contractual payment in lieu of notice and Post-Employment Notice Pay (PENP) under ITEPA 2003 s.402D are always taxed as earnings (see our guide on{' '}
                    <Link href="/guides/pilon-tax-treatment-2026/" className="text-coral underline underline-offset-2 hover:text-ink">
                      PILON tax treatment
                    </Link>).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink"><strong>Accrued Holiday Pay:</strong> Wages owed for annual leave you have built up but not taken by your termination date, also subject to income tax and National Insurance.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink">
                    <strong>Statutory Redundancy or Basic Award:</strong> The legal floor based on your age, complete years of service (capped at 20), and the April 2026 weekly pay cap of £751. Check your baseline with our{' '}
                    <Link href="/redundancy-calculator/" className="text-coral underline underline-offset-2 hover:text-ink">
                      Redundancy Calculator
                    </Link>{' '}
                    or read{' '}
                    <Link href="/guides/settlement-agreement-acas-calculations/" className="text-coral underline underline-offset-2 hover:text-ink">
                      ACAS-based calculations
                    </Link>.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink">
                    <strong>Ex-Gratia Compensation:</strong> The extra sum paid specifically for waiving your right to bring claims. Up to £30,000 can usually be paid tax-free (see the{' '}
                    <Link href="/guides/tax-free-settlement-30000/" className="text-coral underline underline-offset-2 hover:text-ink">
                      £30,000 tax exemption rule
                    </Link>). For typical UK multiples, see{' '}
                    <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                      What Is a Fair Settlement Agreement?
                    </Link>
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">5. Non-Financial Terms Worth Checking</h2>
              <p className="guide-body">
                Even when an employer will not budge on the headline cash figure, they will often agree to practical changes that protect your next job move and cost them nothing.
              </p>

              <div className="space-y-4">
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">An Agreed Reference</strong>
                  <span className="text-muted text-[15px]">Ask for the exact reference wording to be attached as a schedule to the agreement, so future employers receive a clean, consistent statement.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Internal &amp; Client Announcements</strong>
                  <span className="text-muted text-[15px]">Agreeing the wording of your departure email or announcement protects your professional reputation in a small industry.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Restrictive Covenants &amp; Bonus / Commission</strong>
                  <span className="text-muted text-[15px]">Your solicitor can check whether non-compete clauses should be waived or narrowed, and confirm how earned bonuses, shares, or commission are treated.</span>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-6">
              <h2 className="guide-h2 text-[24px]">6. How the Negotiation Process Usually Runs</h2>

              <div className="relative border-l border-rule ml-3 space-y-8 pb-4">

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Get the offer in writing</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Ask for the draft agreement and a breakdown of the numbers. ACAS Code 4 recommends at least 10 calendar days to consider it, though employers can set shorter deadlines or withdraw an unaccepted offer.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Speak to an independent solicitor early</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    You have the right to choose your own SRA-regulated solicitor rather than using one suggested by HR (read{' '}
                    <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink">
                      do you have to use your employer&apos;s solicitor?
                    </Link>).
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Agree a counter-proposal agenda with your solicitor</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Rather than firing off an emotional email to HR and risking privilege, prepare a clear list of figures and clauses to discuss with your solicitor. They can advise on timing, put forward a measured counter-proposal, or walk through{' '}
                    <Link href="/guides/what-happens-if-you-do-not-sign/" className="text-coral underline underline-offset-2 hover:text-ink">
                      what happens if you do not sign
                    </Link>.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">4</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Finalise the wording and sign</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Once both sides agree on the numbers and non-financial clauses, your solicitor signs the adviser&apos;s certificate so the agreement becomes legally binding.</p>
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
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your statutory minimums, tax split, and typical UK settlement ranges before you speak to a solicitor.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/calculator/" className="btn-accent">
                  Settlement Calculator →
                </Link>
                <Link href="/redundancy-calculator/" className="btn-secondary">
                  Redundancy Calculator →
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2 text-[24px]">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/how-to-negotiate-a-settlement-agreement/" />
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Calculations"
              items={[
                {
                  href: '/guides/compromise-agreement-calculator-uk/',
                  title: 'Compromise Agreement Calculator UK',
                  description: 'Calculate your payout under April 2026 UK statutory rates and £30,000 tax exemptions.',
                  tag: 'Calculator Guide',
                },
                {
                  href: '/tribunal-backlog-tracker/',
                  title: 'UK Employment Tribunal Backlog Tracker',
                  description: 'Regional MoJ hearing delays (up to 540 days) and employer legal defence cost exposure.',
                  tag: 'Data Tracker',
                },
                {
                  href: '/pip-settlement-calculator/',
                  title: 'PIP Settlement Agreement Calculator',
                  description: 'Value a fair exit package during a Performance Improvement Plan or protected conversation.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/executive-settlement-agreements/',
                  title: 'Executive Settlement Agreements UK (2026)',
                  description: 'Senior director exits, Companies Act s.217 approval, equity vesting, and D&O run-off cover.',
                  tag: 'Executive Guide',
                },
                {
                  href: '/guides/home-insurance-legal-cover-settlement-agreement/',
                  title: 'Home Insurance Legal Cover & Settlements',
                  description: 'Why LEI policies exclude voluntary settlements and how employer fee contributions work.',
                  tag: 'Legal Fees',
                },
                {
                  href: '/guides/acas-statutory-timeline/',
                  title: 'ACAS Statutory Timeline & 10-Day Rule',
                  description: 'Check ACAS Code 4 10-calendar-day windows and 3-month tribunal limitation deadlines.',
                  tag: 'Deadlines',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Benchmark your settlement offer against industry standards and legal minimums.',
                  tag: 'Valuation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'The ACAS 10-day rule and how to handle employer deadlines and pressure.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'Contract law rules under Hyde v Wrench, ACAS 10-day limits, and safe counter-offer strategies.',
                  tag: 'Offer Protection',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens if You Do Not Sign?',
                  description: 'Your choices and risks if you reject the agreement or fail to reach an accord.',
                  tag: 'Risks & Alternatives',
                },
                {
                  href: '/guides/employer-recommended-solicitor/',
                  title: 'Do You Have to Use Their Solicitor?',
                  description: 'Your right to appoint your own independent solicitor with a standard employer fee contribution.',
                  tag: 'Legal Advice',
                },
                {
                  href: '/guides/fair-work-agency/',
                  title: 'Fair Work Agency & Workers Rights',
                  description: 'New enforcement powers and statutory protections under the Employment Rights Bill.',
                  tag: 'Statutory Reform',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities & Official References</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (Confidentiality of pre-termination negotiations)
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/code-of-practice-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Code of Practice on Settlement Agreements (Code of Practice 4)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 (Restrictions on contracting out & independent legal advice requirements)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 exemption threshold)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent introduction service and informational resource. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement negotiation process and does not constitute legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
