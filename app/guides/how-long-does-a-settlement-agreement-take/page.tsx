import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import ReviewCallout from '@/components/ReviewCallout'
import RelatedArticles from '@/components/RelatedArticles'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'How Long Does a Settlement Agreement Take? UK 2026 Timeline',
  description:
    'UK settlement agreement timeline and payout dates 2026. Acas 10-day rule, solicitor certification speed, 14-28 day payout windows, and legal safeguards.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/how-long-does-a-settlement-agreement-take/',
  },
  openGraph: {
    title: 'How Long Does a Settlement Agreement Take? UK 2026 Timeline',
    description:
      'UK settlement agreement timeline and payout dates 2026. Acas 10-day rule, solicitor certification speed, 14-28 day payout windows, and legal safeguards.',
    url: 'https://settlementcheck.co.uk/guides/how-long-does-a-settlement-agreement-take/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How Long Does a Settlement Agreement Take? UK 2026 Timeline',
    description:
      'UK settlement agreement timeline and payout dates 2026. Acas 10-day rule, solicitor review speed, and payout dates explained.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/how-long-does-a-settlement-agreement-take/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'How long does a settlement agreement take from start to finish?',
    a: 'A standard settlement agreement takes between one and three weeks to complete. Simple exits with agreed terms can conclude in 5 to 10 days. If you negotiate higher compensation, dispute restrictive covenants, or seek bonus payments, discussions can take three to six weeks. The process ends once both parties sign and your solicitor issues the adviser certificate.',
  },
  {
    q: 'How long after signing a settlement agreement do I get paid?',
    a: 'Payout typically arrives within 14 to 28 calendar days after signing or your final day of employment. Your agreement will specify the exact payment date or payroll run. Compensation up to £30,000 is paid tax-free under Section 403 ITEPA 2003. Notice pay and accrued holiday are taxed as normal earnings.',
  },
  {
    q: 'What is the Acas 10-day rule for settlement agreements?',
    a: 'Under Acas Code of Practice 4, employers should allow you at least 10 calendar days to consider a settlement offer. This consideration period gives you reasonable time to appoint an independent solicitor and review your options. Employers who demand an immediate response risk losing Section 111A confidentiality protection in tribunal proceedings.',
  },
  {
    q: 'Can my employer give me a 48-hour deadline to sign?',
    a: 'Employers often set short deadlines, but 48-hour ultimata can constitute improper behaviour under Section 111A(4) of the Employment Rights Act 1996. The Acas Code recommends a minimum of 10 calendar days. If your employer imposes aggressive pressure, you can request a reasonable extension to obtain independent legal advice.',
  },
  {
    q: 'What happens if my employer pays my settlement agreement late?',
    a: 'A signed settlement agreement is a legally binding contract. If your employer misses the payment deadline stated in the agreement, they commit a breach of contract. You can enforce the debt through the County Court rather than an employment tribunal. You may also claim statutory interest under Section 69 of the County Courts Act 1984.',
  },
  {
    q: 'Does negotiating a settlement agreement pause my employment tribunal deadline?',
    a: 'No. Settlement discussions do not pause your employment tribunal limitation clock. Under Section 18A of the Employment Tribunals Act 1996, you have strictly three months minus one day from dismissal to contact Acas for Early Conciliation. If negotiations stall near the deadline, you must register with Acas to protect your legal claims.',
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
  headline: 'How Long Does a Settlement Agreement Take? UK 2026 Timeline & Payout Dates',
  url: 'https://settlementcheck.co.uk/guides/how-long-does-a-settlement-agreement-take/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-31',
  dateModified: '2026-10-31',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/how-long-does-a-settlement-agreement-take/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 111A (Confidentiality of pre-termination negotiations)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/111A',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203 (Restrictions on contracting out)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Tribunals Act 1996, Section 18A (Acas Early Conciliation requirement)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/17/section/18A',
    },
    {
      '@type': 'Legislation',
      name: 'Acas Code of Practice on Settlement Agreements (Code of Practice 4)',
      url: 'https://www.acas.org.uk/code-of-practice-settlement-agreements',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 exemption threshold)',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D (Post-Employment Notice Pay)',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
    },
    {
      '@type': 'Legislation',
      name: 'The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)',
      url: 'https://www.legislation.gov.uk/uksi/2026/310/contents/made',
    },
    {
      '@type': 'Legislation',
      name: 'County Courts Act 1984, Section 69 (Power to award interest on debts)',
      url: 'https://www.legislation.gov.uk/ukpga/1984/28/section/69',
    },
  ],
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 5V10L13.5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5" aria-hidden="true">
      <path d="M10 3L2 17H18L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function SettlementAgreementTimelineGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Settlement Agreement Timeline</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Statutory Timelines &amp; Payout Rules
            </p>
            <h1 className="sc-h1 mb-5">
              How Long Does a Settlement Agreement Take? UK 2026 Timeline &amp; Payout Dates
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Updated for 2026/27 (SI 2026/310 &amp; Acas Code 4)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40" />
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              Receiving a settlement agreement offer brings immediate questions about timing. You need to know how long discussions will take, when you must respond, and when the funds will reach your bank account.
            </p>
          </div>
        </section>

        {/* Answer-First Section & Quick Metrics */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            {/* 40-60 word Answer-First callout box for Google Featured Snippets and AI Overviews */}
            <div className="rounded-xl border border-rule bg-paper p-5 sm:p-6 mb-6">
              <p className="text-xs font-mono uppercase tracking-wider font-semibold text-coral mb-2">
                Answer-First Summary: Settlement Timeline 2026
              </p>
              <p className="sc-body text-ink font-medium leading-relaxed">
                A standard UK settlement agreement takes between one and three weeks from initial offer to completion. Under Acas Code of Practice 4, your employer must give you at least 10 calendar days to consider terms. Once both parties sign and your solicitor issues the adviser certificate, payout typically arrives within 14 to 28 days.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Standard Duration</span>
                <span className="text-lg font-bold text-coral font-mono">1 - 3 Weeks</span>
                <span className="text-[11px] text-muted block mt-1">From offer to signature</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Acas Consideration</span>
                <span className="text-lg font-bold text-coral font-mono">10 Days</span>
                <span className="text-[11px] text-muted block mt-1">Code of Practice 4</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Solicitor Review</span>
                <span className="text-lg font-bold text-coral font-mono">24 - 48 Hours</span>
                <span className="text-[11px] text-muted block mt-1">ERA 1996 s.203(3)</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Payout Window</span>
                <span className="text-lg font-bold text-coral font-mono">14 - 28 Days</span>
                <span className="text-[11px] text-muted block mt-1">Post-EDT or signature</span>
              </div>
            </div>

            <ReviewCallout
              title="Holding a draft settlement agreement?"
              description="Do not rush into signing under artificial deadlines. Check whether your offer meets 2026 statutory rates, verify your £30,000 tax exemption, and ensure your employer covers your legal fees."
              ctaText="Check draft agreement terms →"
              badge="Timeline & Clause Checker"
            />
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Section 1: Overview of the Settlement Agreement Timeline */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">How long does the settlement agreement process take?</h2>
              <p className="guide-body">
                Most UK settlement agreements conclude within one to three weeks. If both sides agree on terms quickly, an exit can be finalized within 5 to 10 working days.
              </p>
              <p className="guide-body">
                When you negotiate financial compensation, request changes to post-termination restrictions, or resolve workplace disputes, discussions can take three to six weeks.
              </p>
              <p className="guide-body">
                The speed of the process depends on several practical factors:
              </p>
              <ul className="space-y-2.5 my-4">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Complexity of the dispute:</strong> A straightforward mutual redundancy takes less time than a contested dismissal or grievance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Solicitor availability:</strong> Appointing an experienced employment solicitor ensures advice is completed within 24 to 48 hours.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Employer responsiveness:</strong> Delays often happen while HR secures executive approval for counter-proposals or revised wording.
                  </span>
                </li>
              </ul>
            </div>

            {/* Section 2: Step-by-Step Visual Timeline Stages */}
            <div className="space-y-6">
              <h2 className="guide-h2 text-[24px]">Step-by-step timeline stages from offer to payout</h2>
              <p className="guide-body">
                The settlement process follows six distinct stages. Understanding each stage helps you maintain control and plan your next professional steps.
              </p>

              {/* Stage Cards */}
              <div className="space-y-4">
                {/* Stage 1 */}
                <div className="p-6 rounded-xl border border-rule bg-paper">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-coral">
                      Stage 1 - Day 1
                    </span>
                    <span className="text-xs text-muted font-mono">Initial Meeting</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Protected conversation and initial proposal
                  </h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Your employer invites you to a confidential meeting. Under Section 111A of the Employment Rights Act 1996 or common law without prejudice rules, they outline an exit proposal. They provide a draft settlement agreement and an initial financial offer. Your employment contract remains fully active. You are not required to give an immediate answer.
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="p-6 rounded-xl border border-rule bg-paper">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-coral">
                      Stage 2 - Days 2 to 10
                    </span>
                    <span className="text-xs text-muted font-mono">Statutory Thinking Time</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Acas 10-day consideration and negotiation period
                  </h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Under Acas Code of Practice 4, you are entitled to at least 10 calendar days to consider the proposal. During this window, you compare the offer against statutory baselines. In 2026, the statutory redundancy pay cap is £751 per week (SI 2026/310), and the unfair dismissal compensatory cap is £123,543. You can prepare counter-proposals on compensation, references, bonuses, or notice pay.
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="p-6 rounded-xl border border-rule bg-paper">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-coral">
                      Stage 3 - Days 5 to 12
                    </span>
                    <span className="text-xs text-muted font-mono">Mandatory Legal Advice</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Independent solicitor advice and adviser certificate
                  </h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is void unless you receive advice from a qualified, independent solicitor. Your employer covers the legal fees (typically £500 to £1,500 + VAT under Section 203 ERA 1996). Your solicitor explains the claims you are waiving, requests necessary clause amendments, and signs the adviser certificate.
                  </p>
                </div>

                {/* Stage 4 */}
                <div className="p-6 rounded-xl border border-rule bg-paper">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-coral">
                      Stage 4 - Days 7 to 14
                    </span>
                    <span className="text-xs text-muted font-mono">Formal Execution</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Execution and exchange of signed counterparts
                  </h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Once all terms are agreed, you sign the agreement and your solicitor issues the signed adviser certificate. Your employer executes their copy. Once exchanged, the settlement agreement becomes an irrevocable, legally binding contract under English law. Neither side can unilaterally alter or withdraw the agreed terms.
                  </p>
                </div>

                {/* Stage 5 */}
                <div className="p-6 rounded-xl border border-rule bg-paper">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-coral">
                      Stage 5 - Agreed Date
                    </span>
                    <span className="text-xs text-muted font-mono">Effective Date</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Effective Date of Termination (EDT) and handover
                  </h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Your employment officially terminates on the Effective Date of Termination (EDT) stated in the document. You return company property, including computers, access passes, and credit cards. Any accrued untaken statutory and contractual holiday pay is calculated up to the EDT.
                  </p>
                </div>

                {/* Stage 6 */}
                <div className="p-6 rounded-xl border border-rule bg-paper">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-coral">
                      Stage 6 - 14 to 28 Days Post-EDT
                    </span>
                    <span className="text-xs text-muted font-mono">Funds Release</span>
                  </div>
                  <h3 className="font-serif text-[18px] font-bold text-ink mb-2">
                    Payout release and payroll schedule
                  </h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Your employer releases your settlement funds according to the payment clause (typically within 14 to 28 days of the EDT or signature). Compensation payments up to £30,000 are paid free of tax and National Insurance under Section 403 ITEPA 2003. Any payment in lieu of notice (PILON) is taxed as normal earnings under post-employment notice pay rules. Your P45 is issued.
                  </p>
                </div>
              </div>
            </div>

            {/* Visual Callout Box: Calculator CTA */}
            <div className="p-6 rounded-xl bg-paper-2 border border-rule">
              <h3 className="font-serif text-[19px] font-bold text-ink mb-2">
                Calculate your estimated settlement package
              </h3>
              <p className="text-[14px] text-muted leading-relaxed mb-4">
                Before agreeing to dates or sums, calculate what you are entitled to under 2026 statutory rates, notice rules, and tax exemptions.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/calculator/" className="btn-accent text-[13px] sm:text-[14px]">
                  Calculate settlement estimate →
                </Link>
                <Link href="/settlement-agreement-tax-calculator/" className="btn-secondary text-[13px] sm:text-[14px]">
                  Check tax breakdown →
                </Link>
              </div>
            </div>

            {/* Section 3: Critical Legal Traps & Safeguards */}
            <div className="space-y-6">
              <h2 className="guide-h2 text-[24px]">Critical legal traps and statutory safeguards</h2>
              <p className="guide-body">
                While settlement agreements provide a clean exit, misunderstandings about statutory deadlines can put your rights at risk. Keep these four legal protections in mind.
              </p>

              <div className="space-y-4">
                {/* Trap 1 */}
                <div className="p-5 rounded-xl border border-rule bg-white">
                  <div className="flex items-start gap-3">
                    <AlertIcon />
                    <div>
                      <h3 className="font-serif text-[17px] font-bold text-ink mb-1">
                        1. The 3-month minus 1 day tribunal limitation trap
                      </h3>
                      <p className="text-[14px] text-muted leading-relaxed">
                        Under Section 18A of the Employment Tribunals Act 1996, you have strictly three months minus one day from your dismissal date to initiate Acas Early Conciliation. Settlement negotiations DO NOT stop or pause this clock. If an employer prolongs discussions close to this date, you must notify Acas to protect your right to bring an employment tribunal claim.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trap 2 */}
                <div className="p-5 rounded-xl border border-rule bg-white">
                  <div className="flex items-start gap-3">
                    <AlertIcon />
                    <div>
                      <h3 className="font-serif text-[17px] font-bold text-ink mb-1">
                        2. Artificial deadline pressure (48-hour ultimata)
                      </h3>
                      <p className="text-[14px] text-muted leading-relaxed">
                        Some employers attempt to force quick signatures by giving 24-hour or 48-hour ultimatums. Under Section 111A(4) of the Employment Rights Act 1996, setting arbitrary deadlines and applying undue pressure constitutes improper behaviour. If an employer acts improperly, confidentiality protection is lost, meaning you can disclose the offer to an employment tribunal.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trap 3 */}
                <div className="p-5 rounded-xl border border-rule bg-white">
                  <div className="flex items-start gap-3">
                    <AlertIcon />
                    <div>
                      <h3 className="font-serif text-[17px] font-bold text-ink mb-1">
                        3. Late payment remedies and statutory interest
                      </h3>
                      <p className="text-[14px] text-muted leading-relaxed">
                        A signed settlement agreement is an enforceable contract. If your employer fails to pay on the agreed date, you do not need to start employment tribunal proceedings. You can enforce the debt directly in the County Court or High Court as a breach of contract debt claim. You can also claim 8% statutory interest per annum under Section 69 of the County Courts Act 1984.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trap 4 */}
                <div className="p-5 rounded-xl border border-rule bg-white">
                  <div className="flex items-start gap-3">
                    <AlertIcon />
                    <div>
                      <h3 className="font-serif text-[17px] font-bold text-ink mb-1">
                        4. HMRC payroll cutoff and P45 timing
                      </h3>
                      <p className="text-[14px] text-muted leading-relaxed">
                        Employers process settlement payments through their regular payroll software. If an agreement vaguely states payment in the "next normal payroll run", missing a monthly payroll cutoff can delay your money by several weeks. Ensure your agreement states payment within 14 or 21 days of receipt of the signed adviser certificate. Your P45 must also be issued promptly to avoid emergency tax at your next role.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Structured Worked Timeline Comparison Table */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Timeline comparison: simple agreed exit vs negotiated dispute</h2>
              <p className="guide-body">
                The total time to reach a settlement varies widely depending on whether the terms are accepted or contested. The table below illustrates the standard timeframes.
              </p>

              <div className="overflow-x-auto my-6 border border-rule rounded-xl">
                <table className="w-full text-left border-collapse text-[14px]">
                  <thead>
                    <tr className="bg-paper border-b border-rule">
                      <th className="p-3.5 font-semibold text-ink">Timeline Stage</th>
                      <th className="p-3.5 font-semibold text-ink">Simple Agreed Exit</th>
                      <th className="p-3.5 font-semibold text-ink">Contested Workplace Dispute</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule bg-white">
                    <tr>
                      <td className="p-3.5 font-medium text-ink">Initial proposal &amp; offer review</td>
                      <td className="p-3.5 text-muted">Days 1 to 3</td>
                      <td className="p-3.5 text-muted">Days 1 to 5</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-ink">Negotiation rounds &amp; counter-offers</td>
                      <td className="p-3.5 text-muted">Days 4 to 7 (1 minor round)</td>
                      <td className="p-3.5 text-muted">Days 6 to 21 (2 to 4 rounds)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-ink">Independent solicitor consultation</td>
                      <td className="p-3.5 text-muted">Days 8 to 10 (24-48 hr review)</td>
                      <td className="p-3.5 text-muted">Days 14 to 28 (clause redrafts)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-ink">Final execution &amp; certificate exchange</td>
                      <td className="p-3.5 text-muted">Days 10 to 14</td>
                      <td className="p-3.5 text-muted">Days 28 to 35</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-ink">Effective Date of Termination (EDT)</td>
                      <td className="p-3.5 text-muted">Immediate or short handover</td>
                      <td className="p-3.5 text-muted">Garden leave or extended notice</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-medium text-ink">Bank payout release window</td>
                      <td className="p-3.5 text-muted">14 to 21 days post-signing</td>
                      <td className="p-3.5 text-muted">14 to 28 days post-EDT</td>
                    </tr>
                    <tr className="bg-paper font-semibold">
                      <td className="p-3.5 text-ink">Total estimated duration</td>
                      <td className="p-3.5 text-coral">1 to 2 weeks</td>
                      <td className="p-3.5 text-coral">4 to 6 weeks</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 5: Tax Breakdown and Statutory Caps 2026 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Tax rules and statutory compensation limits for 2026/27</h2>
              <p className="guide-body">
                The settlement amount and payment structure must comply with statutory limits and HMRC tax rules. In 2026, the statutory caps set the baseline for negotiation:
              </p>
              <ul className="space-y-2.5 my-4">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Statutory weekly pay cap:</strong> £751 per week in Great Britain (SI 2026/310) and £783 in Northern Ireland. The maximum statutory redundancy pay is £22,530.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Unfair dismissal compensatory cap:</strong> Capped at £123,543 or 52 weeks of gross salary, whichever is lower.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>£30,000 tax exemption:</strong> Under Section 403 of ITEPA 2003, genuine termination compensation up to £30,000 is completely exempt from income tax and employee National Insurance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Class 1A employer National Insurance:</strong> Employers pay 15.0% Class 1A NIC on termination payments exceeding £30,000. Employees pay 0% National Insurance on termination payments.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">
                    <strong>Notice pay taxation (PILON):</strong> Under Section 402D ITEPA 2003 (PENP rules), payment in lieu of notice is treated as standard earnings and is subject to income tax and National Insurance.
                  </span>
                </li>
              </ul>
            </div>

            {/* FAQ Section */}
            <div className="space-y-4 pt-10">
              <h2 className="guide-h2 text-[24px]">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
              <DynamicFaqSection pathname="/guides/how-long-does-a-settlement-agreement-take/" />
            </div>

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Practical Resources"
              items={[
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Step-by-step negotiation guidance, without prejudice rules, and counter-offer strategies.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'The Acas 10-day rule, handling tight deadlines, and Section 111A improper behaviour.',
                  tag: 'Deadlines',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'The £30,000 Tax-Free Settlement Exemption',
                  description: 'How HMRC treats severance payments, PENP notice calculations, and Class 1A NIC rules.',
                  tag: 'Tax Rules',
                },
                {
                  href: '/guides/protected-conversations-without-prejudice/',
                  title: 'Protected Conversations & Without Prejudice',
                  description: 'Learn when settlement negotiations are confidential and when the veil can be lifted.',
                  tag: 'Confidentiality',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'Contract law rules under Hyde v Wrench and safe strategies for submitting counter-offers.',
                  tag: 'Offer Security',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens if You Do Not Sign?',
                  description: 'Understand what happens if you reject an offer or if discussions fail to reach agreement.',
                  tag: 'Options & Risks',
                },
              ]}
            />
          </div>
        </section>

        {/* References Section */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">
              Statutory Authorities &amp; Official References
            </h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Employment Rights Act 1996, Section 111A (Confidentiality of pre-termination negotiations)
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Employment Rights Act 1996, Section 203 (Restrictions on contracting out &amp; legal adviser certificate)
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/17/section/18A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Employment Tribunals Act 1996, Section 18A (Requirement to contact Acas before instituting proceedings)
                </a>
              </li>
              <li>
                <a
                  href="https://www.acas.org.uk/code-of-practice-settlement-agreements"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Acas Code of Practice on Settlement Agreements (Code of Practice 4)
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 exemption threshold)
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (Post-Employment Notice Pay)
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a
                  href="https://www.legislation.gov.uk/ukpga/1984/28/section/69"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink underline"
                >
                  County Courts Act 1984, Section 69 (Power of county courts to award interest on debts and damages)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent informational resource and solicitor matching platform. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently regulated by the Solicitors Regulation Authority (SRA). This guide provides factual legal and commercial information regarding UK settlement agreement timeframes and does not constitute formal legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
