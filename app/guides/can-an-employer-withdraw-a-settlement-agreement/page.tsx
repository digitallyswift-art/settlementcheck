import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Can an Employer Withdraw a Settlement Offer? UK (2026)',
  description:
    'Can an employer withdraw a settlement agreement? Learn UK contract rules, counter-offer risks, ACAS 10-day limits, and how to safely protect your offer.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/can-an-employer-withdraw-a-settlement-agreement/',
  },
  openGraph: {
    title: 'Can an Employer Withdraw a Settlement Offer? UK (2026)',
    description:
      'Can an employer withdraw a settlement agreement? Learn UK contract rules, counter-offer risks, ACAS 10-day limits, and how to safely protect your offer.',
    url: 'https://settlementcheck.co.uk/guides/can-an-employer-withdraw-a-settlement-agreement/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can an Employer Withdraw a Settlement Offer? UK (2026)',
    description:
      'Can an employer withdraw a settlement agreement? Learn UK contract rules, counter-offer risks, ACAS 10-day limits, and how to safely protect your offer.',
  },
}

const FAQS = [
  {
    q: 'Can my employer withdraw a settlement agreement offer if I ask for more money?',
    a: 'In UK contract law, a formal counter-offer technically rejects the original offer under the rule in Hyde v Wrench. This means your employer could legally choose not to renew their initial proposal. However, in practice, employers rarely withdraw an offer completely. Instead, they usually either accept your counter-proposal, suggest a compromise, or confirm that their original offer is their final position. You can avoid risking the offer by asking for clarification or having an SRA-regulated solicitor negotiate on your behalf without formally rejecting the baseline.',
  },
  {
    q: 'Can an employer withdraw a settlement agreement after I have signed it?',
    a: 'Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is not legally binding until both parties have signed the document and your independent solicitor has signed the statutory adviser certificate. If you have signed but your employer has not yet executed the agreement, they technically retain the legal right to withdraw. In practice, once formal drafts are agreed and signed by the employee, employer withdrawal is exceedingly rare and risks employment tribunal claims.',
  },
  {
    q: 'How long do I have to accept a settlement agreement offer?',
    a: 'Under paragraph 12 of the ACAS Code of Practice on Settlement Agreements (Code 4), employers should allow a minimum period of 10 calendar days for employees to consider written terms and seek independent legal advice. If your employer imposes an unreasonable deadline, such as 24 or 48 hours, this may constitute improper behaviour under Section 111A(4) of the Employment Rights Act 1996.',
  },
  {
    q: 'What happens if my employer withdraws the settlement offer completely?',
    a: 'If a settlement offer is withdrawn and negotiations collapse, you remain employed under your standard employment contract. Your employer must then decide whether to drop the matter or proceed with formal workplace procedures, such as redundancy consultation, a disciplinary process, or a performance improvement plan. They must follow the ACAS Code of Practice 1. If they dismiss you unfairly, you can pursue an employment tribunal claim.',
  },
  {
    q: 'Who pays my solicitor fees if the settlement agreement is withdrawn?',
    a: 'Most settlement agreement draft clauses state that the employer will only pay the legal fee contribution if the agreement is fully signed and completed. However, if your employer acts in bad faith by withdrawing the offer after you incurred legal advice costs, your solicitor can demand that the employer honour their fee commitment. Many SRA-regulated employment solicitors will agree not to bill you directly if an offer collapses through no fault of your own.',
  },
  {
    q: 'Is an agreement reached through ACAS binding without a signed settlement agreement?',
    a: 'Yes. If a settlement is agreed verbally through an ACAS conciliation officer during Early Conciliation, it becomes a legally binding contract known as a COT3 agreement at the exact moment verbal agreement is confirmed. Unlike a standard settlement agreement under Section 203, an ACAS COT3 does not require physical signatures to become immediately enforceable, and neither party can withdraw after verbal confirmation.',
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
  headline: 'Can an Employer Withdraw a Settlement Agreement Offer? UK (2026 Rules)',
  url: 'https://settlementcheck.co.uk/guides/can-an-employer-withdraw-a-settlement-agreement/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-20',
  dateModified: '2026-10-20',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
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
    '@id': 'https://settlementcheck.co.uk/guides/can-an-employer-withdraw-a-settlement-agreement/',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function CanEmployerWithdrawSettlementGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Offer Withdrawal Rules</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Contract Law, Section 111A &amp; Counter-Offer Protection</p>
            <h1 className="sc-h1 mb-5">
              Can an Employer Withdraw a Settlement Agreement Offer?
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; ACAS Code 4)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              When an employer hands you a settlement agreement, one fear often stops employees from asking for a fair sum: the fear that the company will suddenly withdraw the offer. In UK contract law, an offer can legally be revoked at any point before both parties have signed. However, understanding the statutory protections under the Employment Rights Act 1996 and ACAS Code 4 allows you to negotiate safely without losing your baseline compensation.
            </p>
          </div>
        </section>

        {/* STATUTORY QUICK ANSWER (GEO / AI OVERVIEW OPTIMISED) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Contract Law &amp; ERA 1996 s.203
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Can an employer revoke a settlement agreement before signing?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Yes. Under UK common law, a settlement agreement offer is not legally binding until both parties sign the contract and an independent solicitor certifies it under Section 203 of the Employment Rights Act 1996. An employer can legally withdraw or change an offer prior to final execution. However, sudden withdrawals or artificial 24-hour ultimatums may violate ACAS Code 4, stripping the employer of confidentiality protections.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Pre-Signing Status</span>
                  <span className="font-bold text-ink text-sm">Subject to Contract</span>
                  <span className="text-muted text-[11px]">Revocable by either party anytime</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Counter-Offer Legal Effect</span>
                  <span className="font-bold text-ink text-sm">Operates as a Rejection</span>
                  <span className="text-muted text-[11px]">Extinguishes original offer (Hyde v Wrench)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">ACAS Consideration Window</span>
                  <span className="font-bold text-ink text-sm">10 Calendar Days</span>
                  <span className="text-muted text-[11px]">Minimum time under ACAS Code 4</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Independent Legal Advice</span>
                  <span className="font-bold text-ink text-sm">Employer Pays (£500+ VAT)</span>
                  <span className="text-muted text-[11px]">Mandatory condition under s.203(3)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.111A &amp; s.203</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check my draft exit terms →
                  </Link>
                  <Link href="/calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my settlement baseline →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE RULES CALLOUT */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Six critical facts every employee must know</p>
              <ul className="flex flex-col gap-3">
                {[
                  'A settlement offer is not legally binding until both parties sign and an independent solicitor signs the statutory certificate.',
                  'Making a formal counter-offer legally extinguishes the initial offer under English contract law (Hyde v Wrench).',
                  'Employers should allow at least 10 calendar days to consider written terms under paragraph 12 of ACAS Code 4.',
                  'Threatening to dismiss you if you do not sign within 24 to 48 hours constitutes improper behaviour under Section 111A(4) ERA 1996.',
                  'In commercial practice, employers rarely withdraw an offer completely because resolving a dispute privately is faster and cheaper than an employment tribunal.',
                  'Your employer covers the legal fees for your independent solicitor advice (typically £500 to £1,500 plus VAT).',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 1: WHY A SETTLEMENT OFFER IS NOT BINDING BEFORE SIGNING */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Why a settlement offer is not legally binding until signed</h2>
            <p className="sc-body mb-4">
              To understand whether an employer can withdraw a settlement agreement, you must first understand how English contract law interacts with UK employment law. An offer to settle an employment dispute is an invitation to enter into a contract. Under general contract rules, an offer can be withdrawn at any time before it is accepted.
            </p>
            <p className="sc-body mb-4">
              In employment law, the threshold is even stricter. Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 203 of the Employment Rights Act 1996
              </a>
              , employees cannot contract out of their statutory employment rights through an informal deal or verbal agreement.
            </p>
            <p className="sc-body mb-4">
              For a settlement agreement to become legally binding and prevent you from bringing claims to an employment tribunal, six statutory conditions must be satisfied:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'The agreement must be in writing.',
                'The agreement must relate to particular proceedings or complaints.',
                'The employee must have received advice from an independent legal adviser, such as an SRA-regulated solicitor.',
                'The legal adviser must hold professional indemnity insurance covering the advice.',
                'The agreement must identify the adviser.',
                'The agreement must state that the statutory conditions regulating settlement agreements have been met.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="text-coral font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              Until your instructed independent solicitor signs the statutory certificate and both you and your employer sign the final agreement, the document remains &quot;Subject to Contract&quot;. Either party can technically withdraw from discussions at that stage.
            </p>
          </div>
        </section>

        {/* SECTION 2: THE COUNTER-OFFER TRAP (HYDE V WRENCH) */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The counter-offer trap: Hyde v Wrench explained</h2>
            <p className="sc-body mb-4">
              Many employees want to ask for higher compensation but hesitate because they fear losing what is already on the table. This fear stems from a real principle of English contract law known as the rule in <em>Hyde v Wrench (1840)</em>.
            </p>
            <p className="sc-body mb-4">
              Under this landmark legal doctrine, when someone makes an offer and the other party responds with a counter-offer, the counter-offer acts as a legal rejection of the original offer. The original offer is extinguished and can no longer be accepted unless the offering party renews it.
            </p>
            <p className="sc-body mb-4">
              Here is how that legal principle applies in a workplace settlement negotiation:
            </p>
            <div className="bg-white p-5 rounded-xl border border-rule mb-6 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Step 1: The Initial Offer</strong>
                  <p className="text-muted text-xs m-0">Your employer offers two months of gross salary (£8,000) as a tax-free ex-gratia payment.</p>
                </div>
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Step 2: The Direct Counter-Offer</strong>
                  <p className="text-muted text-xs m-0">You reply in writing: &quot;I reject your offer of £8,000. I require £16,000 to sign the agreement.&quot;</p>
                </div>
                <div className="p-3 rounded bg-[#FBF0EE] border border-[#F3C4BC]">
                  <strong className="text-[#A8341F] block mb-1">Step 3: The Legal Consequence</strong>
                  <p className="text-[#A8341F] text-xs m-0">Under contract law, your counter-proposal legally rejected the £8,000 offer. If your employer says no to £16,000, you cannot automatically demand the £8,000 back unless your employer agrees to put it back on the table.</p>
                </div>
              </div>
            </div>
            <p className="sc-body mb-4">
              While employers rarely walk away immediately in practice, submitting an aggressive written counter-offer without legal framing does create this legal risk. That is why professional framing is essential.
            </p>
          </div>
        </section>

        {/* SECTION 3: HOW TO SAFELY ASK FOR MORE WITHOUT LOSING THE OFFER */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How to negotiate higher pay without risking offer withdrawal</h2>
            <p className="sc-body mb-4">
              You do not have to accept an initial low settlement figure. Experienced employment solicitors use established negotiation tactics that allow you to explore higher payouts while keeping the original baseline offer open.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">1. Use a Request for Clarification instead of a formal rejection</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Under contract law (the rule in <em>Stevenson v McLean</em>), asking a question or requesting clarification does not reject the original offer. Instead of saying &quot;I will not accept £10,000&quot;, you ask: &quot;Could you clarify how the company calculated the compensation figure, given that statutory notice pay and accrued holiday total £6,500?&quot; This keeps the offer alive while opening the door for improvement.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">2. Mark all communications Without Prejudice and Subject to Contract</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Always head your written responses with &quot;Without Prejudice and Subject to Contract&quot;. This signals that negotiations are exploratory and prevents the employer from treating informal discussions as a final, binding position.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">3. Let your independent solicitor negotiate on your behalf</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Employers expect solicitors to negotiate. When an SRA-regulated solicitor contacts your employer, they explicitly state that the baseline offer is noted while setting out objective statutory arguments for an increase. This provides a professional buffer and protects you from personal friction.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">4. Build your case around statutory employment law facts</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Base your counter-proposal on objective facts. Under the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310), the statutory redundancy weekly pay cap is £751 in Great Britain (£783 in Northern Ireland). Pointing out statutory floors, notice pay entitlements, and unexpired bonus periods justifies higher compensation without sounding combative.
                </p>
              </div>
            </div>

            <p className="sc-body mb-4">
              Remember that your employer covers your independent legal advice fees under Section 203. Standard employer contributions range between £500 and £1,500 plus VAT.
            </p>

            {/* In-content tool CTA */}
            <div className="my-6 p-5 rounded-xl bg-paper-2 border border-rule shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
                  Settlement Agreement Audit
                </span>
                <strong className="text-base text-ink block mb-1">
                  Check if your settlement offer is fair
                </strong>
                <p className="text-xs text-muted m-0">
                  Calculate statutory redundancy floors, notice pay, and commercial negotiation benchmarks in 60 seconds.
                </p>
              </div>
              <Link
                href="/calculator/"
                className="px-4 py-2.5 bg-coral hover:bg-coral-ink text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm text-center cursor-pointer"
              >
                Calculate my offer →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4: ARTIFICIAL DEADLINES AND SECTION 111A IMPROPER BEHAVIOUR */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Artificial deadlines: Can an employer give you 48 hours to sign?</h2>
            <p className="sc-body mb-4">
              Employers often try to create urgency by imposing arbitrary deadlines. You might be told: &quot;Sign this by 5pm tomorrow or the settlement is withdrawn and you will face a formal disciplinary hearing.&quot;
            </p>
            <p className="sc-body mb-4">
              This high-pressure tactic breaches statutory guidance. Under paragraph 12 of the{' '}
              <a
                href="https://www.acas.org.uk/acas-code-of-practice-settlement-agreements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                ACAS Code of Practice on Settlement Agreements (Code 4)
              </a>
              , parties should be given a reasonable period of time to consider the proposed terms:
            </p>
            <div className="p-4 rounded-xl border border-rule bg-white mb-6">
              <blockquote className="text-sm italic text-ink/80 border-l-2 border-coral pl-3 my-0">
                &quot;As a general rule, a minimum period of 10 calendar days should be allowed to consider the proposed written terms of a settlement agreement and to receive independent legal advice, unless the parties agree otherwise.&quot;
              </blockquote>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">The Section 111A improper behaviour rule</h3>
            <p className="sc-body mb-4">
              Pre-termination settlement discussions are normally confidential under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 111A of the Employment Rights Act 1996
              </a>
              . This confidentiality means neither party can refer to the settlement offer in an ordinary unfair dismissal claim before an employment tribunal.
            </p>
            <p className="sc-body mb-4">
              However, under Section 111A(4), confidentiality is lost if the employer engages in &quot;improper behaviour&quot;. Examples of improper behaviour identified by ACAS include:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'Putting undue pressure on an employee, such as setting unrealistic deadlines of 24 or 48 hours.',
                'Stating that you will be dismissed if you do not accept the settlement agreement.',
                'Subjecting you to bullying, harassment, or intimidation.',
                'Refusing to let you seek independent legal advice.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="text-coral font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              If your employer acts improperly, the conversation loses secrecy. You can tell an employment tribunal about the employer&apos;s threats and pressure as evidence supporting an unfair dismissal claim. This gives you a clear legal advantage to insist on proper time to consider the agreement.
            </p>
          </div>
        </section>

        {/* SECTION 5: WHAT HAPPENS IF AN EMPLOYER WITHDRAWS THE OFFER? */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What happens if an employer actually withdraws the offer?</h2>
            <p className="sc-body mb-4">
              If an employer decides to withdraw a settlement offer, you do not simply lose your job on the spot. Because a settlement agreement is an alternative to standard employment processes, withdrawing the agreement returns you to the normal workplace status quo.
            </p>
            <p className="sc-body mb-4">
              Depending on your situation, one of three outcomes typically follows:
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Scenario A: Normal employment continues</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  If there was no underlying disciplinary or redundancy situation, you remain employed on your normal terms and conditions. Your employer must continue to pay your contractual salary and benefits. In reality, working together after a failed exit negotiation can be awkward, which is why employers usually prefer to re-engage in settlement talks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Scenario B: The employer resumes formal workplace procedures</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  If the settlement offer arose during a redundancy consultation, disciplinary investigation, or Performance Improvement Plan (PIP), the company must now follow full statutory procedures. Under ACAS Code 1, they must hold formal hearings, allow you to be accompanied by a trade union representative or colleague, and provide a right of appeal. Any procedural shortcut risks an unfair dismissal finding at an employment tribunal.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Scenario C: The employer dismisses you</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  If your employer proceeds to dismiss you, they must still pay your contractual notice pay or statutory notice pay, whichever is greater. If you have at least two years of continuous service under Section 108 of the Employment Rights Act 1996, you can challenge the fairness of that dismissal in an employment tribunal.
                </p>
              </div>
            </div>

            <div className="bg-[#FBF0EE] border border-[#F3C4BC] rounded-xl p-4 text-xs text-[#A8341F] mb-6">
              <strong>Critical Tribunal Deadline:</strong> In UK employment law, you have exactly <strong>3 months minus 1 day</strong> from the date of dismissal or last discriminatory act to initiate ACAS Early Conciliation. Never let an employer stall settlement discussions beyond this deadline.
            </div>
          </div>
        </section>

        {/* SECTION 6: COMPARISON TABLE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Settlement negotiation stages and withdrawal risks</h2>
            <p className="sc-body mb-6">
              This overview shows how your legal protection changes at each stage of a settlement agreement discussion:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Negotiation Stage</th>
                    <th className="p-3 font-semibold">Can Employer Withdraw?</th>
                    <th className="p-3 font-semibold">Legal Governing Rule</th>
                    <th className="p-3 font-semibold">Best Action for Employee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Initial verbal offer</td>
                    <td className="p-3 text-[#A8341F] font-semibold">Yes</td>
                    <td className="p-3">Section 111A ERA 1996 (Pre-termination negotiation)</td>
                    <td className="p-3">Request written terms and note the ACAS 10-day review period.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Written draft received</td>
                    <td className="p-3 text-[#A8341F] font-semibold">Yes</td>
                    <td className="p-3">Subject to Contract (Common law contract rules)</td>
                    <td className="p-3">Instruct an SRA-regulated solicitor. Your employer pays the fee.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Counter-offer submitted</td>
                    <td className="p-3 text-[#A8341F] font-semibold">Yes (Hyde v Wrench)</td>
                    <td className="p-3">Counter-offer operates as legal rejection of original offer</td>
                    <td className="p-3">Frame points as clarification or have your solicitor negotiate.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Signed by employee only</td>
                    <td className="p-3 text-amber-700 font-semibold">Technically yes, but rare</td>
                    <td className="p-3">Section 203(3) ERA 1996 (Requires both signatures)</td>
                    <td className="p-3">Ensure solicitor sends executed copy conditional on counter-signature.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Signed by both parties</td>
                    <td className="p-3 text-emerald-700 font-semibold">No</td>
                    <td className="p-3">Legally binding contract executed under s.203</td>
                    <td className="p-3">Agreement is legally enforceable. Payment must be made as drafted.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">ACAS COT3 verbal agreement</td>
                    <td className="p-3 text-emerald-700 font-semibold">No</td>
                    <td className="p-3">Section 18A Employment Tribunals Act 1996</td>
                    <td className="p-3">Binding immediately upon verbal agreement through ACAS conciliator.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 7: STEP BY STEP CHECKLIST */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Step-by-step checklist if your employer threatens to withdraw</h2>
            <p className="sc-body mb-6">
              If your manager or HR representative threatens to withdraw a settlement agreement, follow these practical steps to protect your position:
            </p>
            <ol className="space-y-4">
              {[
                'Do not panic and do not sign immediately under pressure. Remember that signing waives your right to claim unfair dismissal or discrimination.',
                'Remind your employer in writing of paragraph 12 of the ACAS Code of Practice 4, which recommends at least 10 calendar days to consider terms.',
                'Clarify in writing that you are actively seeking independent legal advice, which is a mandatory requirement under Section 203 of the Employment Rights Act 1996.',
                'Instruct an SRA-regulated employment solicitor immediately. Your employer pays the legal fee contribution, so you will not be out of pocket for standard advice.',
                'Keep contemporaneous records of all meetings, emails, and conversations, noting any aggressive ultimatums or threats of immediate dismissal.',
                'Check your statutory baseline entitlements using our free calculator, including notice pay, statutory redundancy (£751/week cap), and accrued holiday pay.',
              ].map((step, idx) => (
                <li key={step} className="flex items-start gap-3 text-sm text-ink">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-coral/10 text-coral font-semibold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="sc-body text-sm pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SECTION 8: FAQS */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* RELATED GUIDES */}
        <section className="py-10 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides & Tools"
              items={[
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your offer against 2026 statutory redundancy and notice caps.',
                  tag: 'Calculator',
                },
                {
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Review',
                  description: 'Check your written clauses for improper terms, restrictive covenants, and tax traps.',
                  tag: 'Review Tool',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Tactics and counter-offer strategies to improve your financial exit terms.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'How to handle short deadlines and identify Section 111A improper behaviour.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens If You Do Not Sign?',
                  description: 'Understand alternative workplace procedures, notice pay rights, and tribunal risks.',
                  tag: 'Legal Rights',
                },
                {
                  href: '/guides/protected-conversations-without-prejudice/',
                  title: 'Protected Conversations and Without Prejudice',
                  description: 'Learn how Section 111A pre-termination talks function in UK employment law.',
                  tag: 'Legal Rules',
                },
              ]}
            />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="relative overflow-hidden py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Check where your settlement agreement offer stands
            </h2>
            <p className="sc-lead text-white/80 max-w-xl mx-auto mb-6 text-sm">
              Calculate your statutory baseline, check your notice entitlements, and get matched with an SRA-regulated solicitor. Your employer covers the cost of independent legal advice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/" className="btn-accent text-sm inline-block">
                Calculate my estimate →
              </Link>
              <Link href="/settlement-agreement-review/" className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition-colors">
                Check my draft agreement →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
