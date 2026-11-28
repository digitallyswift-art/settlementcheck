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
    'Understand how UK settlement talks work under April 2026 rates (£751/wk cap). Without prejudice rules, tax splits, and legal fee contributions.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/how-to-negotiate-a-settlement-agreement/',
  },
  openGraph: {
    title: 'Negotiate a Settlement With Your Employer | SettlementCheck',
    description:
      'Understand how UK settlement talks work under April 2026 rates (£751/wk cap). Without prejudice rules, tax splits, and legal fee contributions.',
    url: 'https://settlementcheck.co.uk/guides/how-to-negotiate-a-settlement-agreement/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Negotiate a Settlement With Your Employer | SettlementCheck',
    description:
      'Without prejudice rules, how offers are broken down, and what to check with an independent solicitor under 2026 UK rates.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/how-to-negotiate-a-settlement-agreement/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Do you have to make the first offer?',
    a: 'Usually your employer puts forward the opening figure. That gives you a baseline to check against your notice pay, holiday pay, and statutory entitlements. Once you have the draft in writing, you and your solicitor can review whether there is room to ask for more.',
  },
  {
    q: 'Can my employer dismiss me just for trying to negotiate?',
    a: 'Asking questions or proposing higher terms is not a fair reason for dismissal on its own. However, if talks break down during an existing redundancy or capability process, that formal process will normally continue.',
  },
  {
    q: 'Does my employer pay the legal fees if we negotiate?',
    a: 'Employers standardly offer a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion of the agreement. That contribution usually covers reviewing and advising on the draft. If your solicitor spends extra time negotiating new terms, additional costs depend on your engagement terms unless your employer raises the cap.',
  },
  {
    q: 'How long do settlement negotiations usually take?',
    a: 'ACAS Code of Practice 4 recommends giving you at least 10 calendar days to consider an initial written offer. This is guidance rather than a strict legal right. Straightforward talks with one or two counter-proposals usually conclude within one to three weeks.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can legally withdraw it before anything is signed. Most employers simply decline or meet partway, but it is a real risk to weigh up with your solicitor first.',
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
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement in your inbox? To your employer, it is a commercial trade to avoid tribunal risk and management time. Check your statutory baseline in 60 seconds with no email required, see what moves the figure, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Negotiation Micro-Tool (Immediately after Answer-First Hero) */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Compare your employer's opening figure against your calculated statutory baseline and typical 1 to 3 months gross commercial ranges."
                disputeType="negotiation"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Commercial Range', value: '1 to 3 Months Gross', statute: 'Observed Norm' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={50000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Key Takeaways Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">What to Know Before You Respond</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">The first figure on the page is rarely your employer&apos;s final ceiling. Notice pay, bonuses, or dismissal risk often leave room to move.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Under Section 203(3) of the Employment Rights Act 1996, the agreement is not binding until an independent solicitor advises you on it.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Up to £30,000 of genuine ex-gratia compensation is usually tax-free under ITEPA 2003 s.403. Contractual notice and holiday pay are always taxed as wages.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. Why is your employer offering a settlement?</h2>
              <p className="guide-body">
                Employers rarely offer a settlement agreement out of generosity. They use it to buy certainty and avoid legal fees, management time, and employment tribunal defence costs.
              </p>
              <p className="guide-body">
                Seeing the offer as a risk-management trade helps you spot where the budget comes from. It is a commercial calculation, not a judgement on your work.
              </p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Common Triggers</h3>
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
                    <li>Legal fees and management hours saved by avoiding a tribunal defence.</li>
                    <li>Salary your employer would otherwise pay during a long consultation or PIP.</li>
                  </ul>
                </div>
              </div>

              <p className="guide-body">
                If you have been offered an exit package instead of a performance improvement plan, our guide on{' '}
                <Link href="/guides/settlement-agreement-instead-of-pip/" className="text-coral underline underline-offset-2 hover:text-ink">
                  PIP settlement
                </Link>{' '}
                agreements explains what room you have to negotiate before a formal capability process begins.
              </p>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. Is this conversation really off the record?</h2>
              <p className="guide-body">
                You may have received an email marked &quot;Without Prejudice&quot; or been invited to an unexpected HR meeting. UK law uses two separate rules to keep settlement talks off the record, and the difference matters if talks fail.
              </p>

              <ul className="space-y-4 mt-2">
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">A</div>
                  <div>
                    <strong className="text-ink block text-[16px] mb-1">Without Prejudice</strong>
                    <span className="text-muted text-[15px] leading-relaxed">Applies only when a genuine dispute already exists between you and your employer. Neither side can quote those figures in a later tribunal as an admission of fault.</span>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-paper-2 border border-rule flex items-center justify-center font-sans text-[13px] font-semibold text-ink flex-shrink-0">B</div>
                  <div>
                    <strong className="text-ink block text-[16px] mb-1">Section 111A (Protected Conversations)</strong>
                    <span className="text-muted text-[15px] leading-relaxed">Lets your employer propose a settlement even when no dispute exists yet. However, Section 111A shields standard unfair dismissal claims only. It does not protect discrimination, whistleblowing, automatic unfair dismissal, or breach of contract claims.</span>
                  </div>
                </li>
              </ul>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-6 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>Watch for improper behaviour:</strong> Neither rule protects an employer who bullies you, threatens automatic dismissal if you refuse, or sets an unreasonable deadline. If you feel rushed, read our guide on{' '}
                  <Link href="/guides/pressured-to-sign/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                    your rights when pressured to sign quickly
                  </Link>.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. What gives you room to negotiate?</h2>
              <p className="guide-body">
                Your position depends on what happens if you walk away without signing. If your employer faces a credible legal claim or months of formal process, the opening offer is more likely to move.
              </p>
              <p className="guide-body">
                If they have followed a clean process and your statutory entitlements are already covered, there is usually tighter room on the cash figure.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
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
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
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
              title="Holding a draft settlement agreement?"
              description="Check your draft clauses in 60 seconds. Compare your notice pay, legal fee contribution, and statutory baseline against April 2026 UK rules before speaking to a solicitor."
              ctaText="Check draft agreement clauses →"
              badge="Draft Agreement Check"
            />

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. How is the offer broken down and taxed?</h2>
              <p className="guide-body">
                Employers often present one headline number that looks generous until you realise it bundles in your notice pay and unused holiday. Splitting the offer into four parts shows what you are actually being paid for waiving your rights.
              </p>
              <p className="guide-body">
                Statutory redundancy baselines depend on qualifying service, absence of gross misconduct, and suitable alternative employment rules under Section 141 ERA 1996.
              </p>

              <ul className="space-y-3 bg-paper-2 border border-rule rounded-xl p-6">
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink">
                    <strong>Notice Pay (PILON, Garden Leave, or PENP):</strong> Pay for your contractual notice period, whether worked on garden leave or paid as a lump sum. Contractual PILON and Post-Employment Notice Pay (PENP) under ITEPA 2003 s.402D are taxed as wages (see our guide on{' '}
                    <Link href="/guides/pilon-tax-treatment-2026/" className="text-coral underline underline-offset-2 hover:text-ink">
                      PILON tax treatment
                    </Link>).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink">
                    <strong>Accrued Holiday Pay:</strong> Wages owed for annual leave built up but not taken by your leaving date. This is always subject to income tax and National Insurance. Omitting statutory holiday pay is also the type of baseline breach the planned{' '}
                    <Link href="/guides/fair-work-agency/" className="text-coral underline underline-offset-2 hover:text-ink">
                      Fair Work Agency
                    </Link>{' '}
                    is intended to enforce once operational.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0" />
                  <span className="text-[15px] text-ink">
                    <strong>Statutory Redundancy or Basic Award:</strong> Your calculated statutory baseline based on age, complete years of service (capped at 20), and the April 2026 weekly cap of £751. Check your figure with our{' '}
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
                    <strong>Ex-Gratia Compensation:</strong> The extra sum paid for waiving your right to bring claims. Up to £30,000 can usually be paid tax-free (see the{' '}
                    <Link href="/guides/tax-free-settlement-30000/" className="text-coral underline underline-offset-2 hover:text-ink">
                      £30,000 tax exemption rule
                    </Link>). For typical UK multiples, see{' '}
                    <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                      What Is a Fair Settlement Agreement?
                    </Link>
                  </span>
                </li>
              </ul>

              <p className="guide-body">
                Before responding to HR, run your figures through our{' '}
                <Link href="/" className="text-coral underline underline-offset-2 hover:text-ink">
                  settlement agreement calculator
                </Link>{' '}
                or read our guide on the{' '}
                <Link href="/guides/average-settlement-agreement-payout-uk/" className="text-coral underline underline-offset-2 hover:text-ink">
                  average settlement agreement amount UK
                </Link>{' '}
                employees see when comparing statutory baselines and notice pay. If you work in the health service, scheme caps may apply instead of open-ended negotiation. See our{' '}
                <Link href="/guides/nhs-settlement-agreements/" className="text-coral underline underline-offset-2 hover:text-ink">
                  NHS MARS calculator
                </Link>{' '}
                and settlement guide for how Mutually Agreed Resignation Scheme rules work.
              </p>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="guide-h2">5. What else can change besides the cash figure?</h2>
              <p className="guide-body">
                Even when an employer will not raise the headline sum, they often agree to practical wording changes. These protect your next career move and usually cost the employer nothing.
              </p>

              <div className="space-y-4">
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">An Agreed Reference</strong>
                  <span className="text-muted text-[15px]">Employees commonly request exact reference wording attached as a schedule to the agreement, so future employers receive a clean, consistent statement.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Internal &amp; Client Announcements</strong>
                  <span className="text-muted text-[15px]">Agreeing the wording of your departure email protects your professional reputation, especially in a small industry.</span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Restrictive Covenants, Garden Leave &amp; Bonuses</strong>
                  <span className="text-muted text-[15px]">Your solicitor can spot non-compete clauses that could block your next job, check garden leave terms, and confirm how earned bonuses, shares, or commission are treated.</span>
                </div>
              </div>
            </div>

            {/* Section 6 */}
            <div className="space-y-6">
              <h2 className="guide-h2">6. How do settlement talks usually play out?</h2>

              <div className="relative border-l border-rule ml-3 space-y-8 pb-4">

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">1</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Receive the written draft and breakdown</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Having the draft agreement and a breakdown of the numbers lets you check every figure before responding. ACAS Code 4 recommends at least 10 calendar days to consider it, though employers can set shorter deadlines or withdraw an unaccepted offer.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">2</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Speak to an independent solicitor early</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    You can choose your own SRA-regulated solicitor rather than using one suggested by HR (read{' '}
                    <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink">
                      do you have to use your employer&apos;s solicitor?
                    </Link>). Employers standardly offer a capped contribution of £350 to £500+ plus VAT upon completion, with extra or abortive work governed by your solicitor&apos;s terms.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">3</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Review a discussion agenda with your solicitor</h3>
                  <p className="text-[15px] text-muted leading-relaxed">
                    Sending emotional emails directly to HR can risk waiving legal privilege. Instead, prepare a clear list of figures and clauses to explore with your solicitor. They can advise on timing, put forward any counter-proposal, or explain{' '}
                    <Link href="/guides/what-happens-if-you-do-not-sign/" className="text-coral underline underline-offset-2 hover:text-ink">
                      what happens if you do not sign
                    </Link>.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-6 h-6 bg-ink rounded-full text-white text-[12px] font-bold flex items-center justify-center -left-[12px] top-0 border-[3px] border-card">4</div>
                  <h3 className="text-[17px] font-serif font-[460] text-ink mb-1">Finalise the wording and sign</h3>
                  <p className="text-[15px] text-muted leading-relaxed">Once both sides agree on the numbers and non-financial terms, your solicitor signs the adviser&apos;s certificate so the agreement becomes legally binding.</p>
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
                See your statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
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
              <DynamicFaqSection pathname="/guides/how-to-negotiate-a-settlement-agreement/" />
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Calculations"
              items={[
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'ACAS Code 4 guidance and how to handle employer deadlines and pressure.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'Contract law rules under Hyde v Wrench, ACAS 10-day guidance, and offer revocation risks.',
                  tag: 'Offer Protection',
                },
                {
                  href: '/guides/employer-recommended-solicitor/',
                  title: 'Do You Have to Use Their Solicitor?',
                  description: 'Your right to appoint your own independent solicitor with a standard employer fee contribution.',
                  tag: 'Legal Advice',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens if You Do Not Sign?',
                  description: 'Your options and risks if you decline the agreement or talks end without a deal.',
                  tag: 'Risks & Alternatives',
                },
                {
                  href: '/guides/acas-statutory-timeline/',
                  title: 'ACAS Statutory Timeline & 10-Day Rule',
                  description: 'Check ACAS Code 4 10-calendar-day guidance and 3-month tribunal limitation deadlines.',
                  tag: 'Deadlines',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Compare your settlement offer against commercial UK ranges and statutory baselines.',
                  tag: 'Valuation',
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
