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
  title: 'Can an Employer Withdraw a Settlement Offer? UK (2026)',
  description:
    'Can an employer withdraw a settlement agreement? Learn UK contract rules, counter-offer risks, ACAS 10-day guidance, and how to protect your offer.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/can-an-employer-withdraw-a-settlement-agreement/',
  },
  openGraph: {
    title: 'Can an Employer Withdraw a Settlement Offer? UK (2026)',
    description:
      'Can an employer withdraw a settlement agreement? Learn UK contract rules, counter-offer risks, ACAS 10-day guidance, and how to protect your offer.',
    url: 'https://settlementcheck.co.uk/guides/can-an-employer-withdraw-a-settlement-agreement/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Can an Employer Withdraw a Settlement Offer? UK (2026)',
    description:
      'Can an employer withdraw a settlement agreement? Learn UK contract rules, counter-offer risks, ACAS 10-day guidance, and how to protect your offer.',
  },
}

const FAQS = [
  {
    q: 'Can my employer withdraw a settlement agreement offer if I ask for more money?',
    a: 'Under English contract law (Hyde v Wrench), a formal counter-offer rejects and extinguishes the original offer. Your employer can choose not to renew their opening figure. In practice, employers often reply with a compromise or confirm their original figure is final. An SRA-regulated solicitor can raise queries without formally rejecting the opening offer.',
  },
  {
    q: 'Can an employer withdraw a settlement agreement after I have signed it?',
    a: 'Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is not binding until both parties sign and your independent solicitor signs the adviser certificate. If your employer has not yet countersigned, they retain the legal right to withdraw under contract law (Routledge v Grant). Once both sides execute the agreement, neither party can withdraw.',
  },
  {
    q: 'How long do I have to accept a settlement agreement offer?',
    a: 'Paragraph 12 of ACAS Code of Practice 4 recommends a minimum of 10 calendar days as general guidance to consider written terms and take legal advice. This is guidance rather than a strict legal right. However, an unreasonable 24-hour or 48-hour deadline may count as improper behaviour under Section 111A(4) ERA 1996 for ordinary unfair dismissal claims.',
  },
  {
    q: 'What happens if my employer withdraws the settlement offer completely?',
    a: 'If an offer is withdrawn, your employment contract continues as normal. Your employer must decide whether to drop the matter or follow formal procedures, such as redundancy consultation or a capability process. If they dismiss you, you may have unfair dismissal rights if you meet the two-year qualifying period under Section 108 ERA 1996.',
  },
  {
    q: 'Who pays my solicitor fees if the settlement agreement is withdrawn?',
    a: 'Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion of the agreement. If the agreement is withdrawn before completion, any excess or abortive work is subject to your solicitor engagement terms.',
  },
  {
    q: 'Is an agreement reached through ACAS binding without a signed settlement agreement?',
    a: 'Yes. A settlement agreed verbally through an ACAS conciliation officer forms a binding COT3 agreement immediately upon confirmation. Unlike a Section 203 settlement agreement, an ACAS COT3 does not require physical signatures, and neither party can withdraw afterwards.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
      <Nav />
      <main>
        {/* HERO SECTION */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Offer withdrawal rules</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Can an Employer Withdraw a Settlement Agreement Offer?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Holding a draft settlement agreement and worried your employer might pull it? Under UK contract law, an unaccepted offer can be withdrawn before both sides sign. Check your calculated statutory baseline in 60 seconds with no email required, then review the terms with an independent solicitor.
            </p>
          </div>
        </section>

        {/* EMBEDDED CALCULATOR CARD (IMMEDIATELY BELOW HERO) */}
        <section className="py-10 bg-card border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's draft figure against your calculated statutory baseline before responding."
              disputeType="negotiation"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'ACAS Review Window', value: '10 Calendar Days', statute: 'Code 4 Guidance' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={50000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* STATUTORY QUICK ANSWER */}
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
                Yes. Under UK common law (<em>Routledge v Grant</em>), an offer is not binding until both parties sign and an independent solicitor certifies it under Section 203 of the Employment Rights Act 1996. An employer can withdraw an unaccepted offer before final execution. However, sudden ultimatums may breach ACAS Code 4 guidance and remove Section 111A confidentiality for ordinary unfair dismissal claims.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-rule text-xs">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Pre-Signing Status</span>
                  <span className="font-bold text-ink text-sm">Subject to Contract</span>
                  <span className="text-muted text-[11px]">Revocable by either party before completion</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Counter-Offer Legal Effect</span>
                  <span className="font-bold text-ink text-sm">Operates as a Rejection</span>
                  <span className="text-muted text-[11px]">Extinguishes original offer (Hyde v Wrench)</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">ACAS Consideration Window</span>
                  <span className="font-bold text-ink text-sm">10 Calendar Days</span>
                  <span className="text-muted text-[11px]">General guidance under ACAS Code 4</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40 flex flex-col gap-0.5">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Independent Legal Advice</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[11px]">Standard employer contribution on completion</span>
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
                    Check my offer now →
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
              <p className="text-[15px] font-semibold text-ink mb-3">Six core legal rules to know</p>
              <ul className="flex flex-col gap-3">
                {[
                  'A settlement offer is not binding until both parties sign and an independent solicitor signs the statutory certificate.',
                  'Making a formal counter-offer extinguishes the initial offer under English contract law (Hyde v Wrench).',
                  'ACAS Code 4 (para 12) recommends 10 calendar days as general guidance, though an unaccepted offer can carry a deadline (Routledge v Grant).',
                  'Threatening immediate dismissal if you do not sign counts as improper behaviour under Section 111A(4) ERA 1996 for ordinary unfair dismissal claims.',
                  'Withdrawing an offer returns you to your normal employment contract rather than ending your employment automatically.',
                  'Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion, with excess or abortive work subject to solicitor engagement terms.',
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

        {/* SECTION 1 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. Why is a settlement offer not binding before signing?</h2>
            <p className="sc-body mb-4">
              An opening settlement proposal is an invitation to agree a contract. Under English contract law (<em>Routledge v Grant</em>), an unaccepted offer can be withdrawn at any time before acceptance.
            </p>
            <p className="sc-body mb-4">
              Employment law adds a stricter safeguard. Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 203 of the Employment Rights Act 1996
              </a>
              , you cannot waive statutory employment rights through an informal or verbal deal.
            </p>
            <p className="sc-body mb-4">
              Six statutory conditions must be met for a settlement agreement to bind both sides:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'The agreement must be in writing.',
                'The agreement must relate to particular proceedings or complaints.',
                'The employee must receive advice from an independent legal adviser, such as an SRA-regulated solicitor.',
                'The legal adviser must hold professional indemnity insurance covering the advice.',
                'The agreement must identify the adviser.',
                'The agreement must state that the statutory conditions regulating settlement agreements are met.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="text-coral font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              Until your solicitor signs the statutory certificate and both sides sign the contract, the draft remains &quot;Subject to Contract&quot;. Either party can withdraw up to that point.
            </p>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. Can asking for more money cancel the original offer?</h2>
            <p className="sc-body mb-4">
              Many employees worry that asking for higher compensation will erase what is already on the table. That risk comes from the contract law rule in <em>Hyde v Wrench (1840)</em>.
            </p>
            <p className="sc-body mb-4">
              When one party makes a formal counter-offer, it operates as a legal rejection of the original offer. The original offer is extinguished and cannot be accepted later unless the employer puts it back on the table.
            </p>
            <div className="bg-white p-5 rounded-xl border border-rule mb-6 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Step 1: The Initial Offer</strong>
                  <p className="text-muted text-[14px] m-0">Your employer offers two months of gross salary (£8,000) as an ex-gratia payment.</p>
                </div>
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Step 2: The Direct Counter-Offer</strong>
                  <p className="text-muted text-[14px] m-0">You reply in writing: &quot;I reject £8,000. I require £16,000 to sign the agreement.&quot;</p>
                </div>
                <div className="p-3 rounded bg-[#FBF0EE] border border-[#F3C4BC]">
                  <strong className="text-[#A8341F] block mb-1">Step 3: The Legal Consequence</strong>
                  <p className="text-[#A8341F] text-[14px] m-0">Your counter-proposal legally rejected the £8,000 offer. If your employer declines £16,000, you cannot demand the £8,000 back unless they renew it.</p>
                </div>
              </div>
            </div>
            <p className="sc-body mb-4">
              Employers often respond with a compromise rather than walking away. Even so, an unreviewed written counter-offer creates real contract risk.
            </p>
          </div>
        </section>

        {/* SECTION 3 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. How can you ask for better terms without losing the offer?</h2>
            <p className="sc-body mb-4">
              Employment solicitors use established approaches to explore higher figures or fairer clauses - such as garden leave or non-compete terms - without rejecting the opening offer.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">1. Ask for clarification rather than rejecting</h3>
                <p className="sc-body text-muted mb-0">
                  Under <em>Stevenson v McLean</em>, asking a question or requesting a breakdown does not reject the original offer. Asking how notice pay, holiday pay, and sums taxed as wages were calculated keeps the offer open.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">2. Check legal privilege before replying directly</h3>
                <p className="sc-body text-muted mb-0">
                  Sending unreviewed financial proposals directly to HR can waive legal privilege or weaken your position. Under <em>Framlington Group v Barnetson</em>, common law Without Prejudice privilege applies only where a genuine dispute exists, and Section 111A ERA 1996 applies solely to ordinary unfair dismissal claims.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">3. Channel proposals through an independent solicitor</h3>
                <p className="sc-body text-muted mb-0">
                  When an SRA-regulated solicitor contacts HR, they can note the baseline offer while setting out objective statutory grounds for an adjustment. That provides a clear professional buffer.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-2">4. Ground figures in April 2026 statutory rates</h3>
                <p className="sc-body text-muted mb-0">
                  Under SI 2026/310, the statutory redundancy weekly pay cap is £751 in Great Britain (£783 in Northern Ireland). Comparing the offer against your calculated statutory baseline, notice pay, and garden leave gives your solicitor objective figures to review.
                </p>
              </div>
            </div>

            <p className="sc-body mb-4">
              Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) toward independent legal advice upon completion, with any excess or abortive work subject to your solicitor&apos;s engagement terms.
            </p>

            {/* In-content tool CTA */}
            <div className="my-6 p-5 rounded-xl bg-paper-2 border border-rule shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
                  April 2026 Statutory Check
                </span>
                <strong className="text-base text-ink block mb-1">
                  Compare your offer against statutory rates
                </strong>
                <p className="text-[14px] text-muted m-0">
                  Check your calculated statutory baseline, notice pay, and commercial ranges in 60 seconds.
                </p>
              </div>
              <Link
                href="/calculator/"
                className="px-4 py-2.5 bg-coral hover:bg-coral-ink text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm text-center cursor-pointer"
              >
                Check my offer now →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 4 */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">4. Can an employer give you 48 hours to sign?</h2>
            <p className="sc-body mb-4">
              Some employers set tight deadlines, such as 24 or 48 hours, before a proposed exit figure expires. Under paragraph 12 of the{' '}
              <a
                href="https://www.acas.org.uk/acas-code-of-practice-settlement-agreements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                ACAS Code of Practice on Settlement Agreements (Code 4)
              </a>
              , parties should be allowed reasonable time to consider written terms:
            </p>
            <div className="p-4 rounded-xl border border-rule bg-white mb-6">
              <blockquote className="text-sm italic text-ink/80 border-l-2 border-coral pl-3 my-0">
                &quot;As a general rule, a minimum period of 10 calendar days should be allowed to consider the proposed written terms of a settlement agreement and to receive independent legal advice, unless the parties agree otherwise.&quot;
              </blockquote>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">The Section 111A improper behaviour rule</h3>
            <p className="sc-body mb-4">
              Pre-termination discussions are normally confidential for ordinary unfair dismissal claims under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 111A of the Employment Rights Act 1996
              </a>
              . Section 111A does not shield discrimination, whistleblowing, automatic unfair dismissal, or breach of contract claims.
            </p>
            <p className="sc-body mb-4">
              Under Section 111A(4), confidentiality is also lost for ordinary unfair dismissal if the employer uses improper behaviour. ACAS examples include:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'Putting undue pressure on an employee, such as setting 24-hour or 48-hour ultimatums.',
                'Stating that you will be dismissed if you decline the settlement agreement.',
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
              When improper behaviour occurs, an employment tribunal can hear evidence about how the offer was presented.
            </p>
          </div>
        </section>

        {/* SECTION 5 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">5. What happens if your employer withdraws the offer?</h2>
            <p className="sc-body mb-4">
              If an employer withdraws a settlement offer, your employment does not end automatically. You remain on your existing employment contract while your employer decides on next steps.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Scenario A: Normal employment continues</h3>
                <p className="sc-body text-muted mb-0">
                  If there was no active redundancy or disciplinary process, you remain employed on your normal terms. Your employer must continue paying your contractual salary and benefits.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Scenario B: Formal workplace procedures resume</h3>
                <p className="sc-body text-muted mb-0">
                  If the offer arose during a redundancy consultation, disciplinary matter, or PIP, formal procedures usually resume. Under ACAS Code 1, employers must hold formal hearings, allow accompaniment, and offer a right of appeal.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Scenario C: Dismissal</h3>
                <p className="sc-body text-muted mb-0">
                  If dismissal follows, your employer must pay contractual or statutory notice pay, whichever is greater (usually taxed as wages). Employees with at least two years of continuous service under Section 108 ERA 1996 (or statutory redundancy eligibility under Section 141/155 where applicable) may challenge an unfair dismissal at an employment tribunal.
                </p>
              </div>
            </div>

            <div className="bg-[#FBF0EE] border border-[#F3C4BC] rounded-xl p-4 text-xs text-[#A8341F] mb-6">
              <strong>Critical Tribunal Deadline:</strong> In UK employment law, you have <strong>3 months minus 1 day</strong> from dismissal or the last discriminatory act to start ACAS Early Conciliation. Missing this deadline can prevent a tribunal from hearing your claim.
            </div>
          </div>
        </section>

        {/* SECTION 6 */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">6. When can an employer withdraw at each stage?</h2>
            <p className="sc-body mb-6">
              Your legal position changes at each stage of a settlement discussion:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Negotiation Stage</th>
                    <th className="p-3 font-semibold">Can Employer Withdraw?</th>
                    <th className="p-3 font-semibold">Governing Rule</th>
                    <th className="p-3 font-semibold">Practical Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Initial verbal offer</td>
                    <td className="p-3 text-[#A8341F] font-semibold">Yes</td>
                    <td className="p-3">Section 111A ERA 1996 (ordinary unfair dismissal only)</td>
                    <td className="p-3">Written terms allow you to check the ACAS 10-day guidance window.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Written draft received</td>
                    <td className="p-3 text-[#A8341F] font-semibold">Yes</td>
                    <td className="p-3">Subject to Contract (<em>Routledge v Grant</em>)</td>
                    <td className="p-3">An independent solicitor reviews clauses, notice pay, and non-compete terms.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Counter-offer submitted</td>
                    <td className="p-3 text-[#A8341F] font-semibold">Yes (<em>Hyde v Wrench</em>)</td>
                    <td className="p-3">Formal counter-offer rejects original offer</td>
                    <td className="p-3">Solicitors often frame points as clarification to keep the baseline open.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Signed by employee only</td>
                    <td className="p-3 text-amber-700 font-semibold">Technically yes, rare</td>
                    <td className="p-3">Section 203(3) ERA 1996 (requires both signatures)</td>
                    <td className="p-3">Solicitor normally holds release conditional on employer countersignature.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Signed by both parties</td>
                    <td className="p-3 text-ink font-semibold">No</td>
                    <td className="p-3">Binding contract executed under s.203</td>
                    <td className="p-3">Payment terms and agreed exit obligations become enforceable.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">ACAS COT3 verbal agreement</td>
                    <td className="p-3 text-ink font-semibold">No</td>
                    <td className="p-3">Section 18A Employment Tribunals Act 1996</td>
                    <td className="p-3">Binding immediately upon verbal confirmation via ACAS conciliator.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 7 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">7. What steps protect your position if an employer threatens withdrawal?</h2>
            <p className="sc-body mb-6">
              If HR or your manager threatens to pull the agreement, these practical steps help keep your position clear:
            </p>
            <ol className="space-y-4">
              {[
                'Take independent legal advice before signing. Signing waives your right to bring tribunal claims listed in the agreement.',
                'Note paragraph 12 of ACAS Code of Practice 4 in writing, which recommends 10 calendar days as general guidance to consider terms.',
                'Confirm in writing that you are arranging independent legal advice, which is mandatory under Section 203 ERA 1996.',
                'Instruct an SRA-regulated employment solicitor promptly. Employers standardly contribute £350 to £500+ plus VAT upon completion, with excess or abortive work subject to solicitor engagement terms.',
                'Keep dated records of all meetings, emails, and deadlines in case Section 111A(4) improper behaviour becomes relevant.',
                'Compare the draft figures against your calculated statutory baseline, including notice pay, statutory redundancy (£751/week GB cap), and accrued holiday pay.',
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
            <h2 className="guide-h2 mb-6">Frequently Asked Questions</h2>
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
                  description: 'Compare your offer against April 2026 statutory redundancy and notice caps.',
                  tag: 'Calculator',
                },
                {
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Review',
                  description: 'Check your written clauses for notice pay, non-compete terms, and tax splits.',
                  tag: 'Review Tool',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How to respond to an opening offer and structure a commercial counter-proposal.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'How to handle short deadlines and Section 111A improper behaviour rules.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens If You Do Not Sign?',
                  description: 'Understand alternative workplace procedures, notice pay rights, and tribunal timelines.',
                  tag: 'Legal Rights',
                },
                {
                  href: '/guides/protected-conversations-without-prejudice/',
                  title: 'Protected Conversations and Without Prejudice',
                  description: 'Learn how Section 111A pre-termination talks work in UK employment law.',
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
            <p className="sc-lead text-white/80 max-w-xl mx-auto mb-6">
              See your calculated statutory baseline, tax split, and commercial range before speaking to an independent solicitor.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/" className="btn-accent text-sm inline-block">
                Check my offer now →
              </Link>
              <Link href="/redundancy-calculator/" className="btn-secondary text-sm inline-block">
                Calculate my redundancy →
              </Link>
            </div>
            <p className="text-white/60 text-[12px] mt-4">
              Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
