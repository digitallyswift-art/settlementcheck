import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import NhsMarsCalculator from './NhsMarsCalculator'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'NHS Settlement & MARS Calculator 2026 | SettlementCheck',
  },
  description:
    'Calculate NHS settlement and MARS redundancy payouts under Agenda for Change. HM Treasury rules, £100k cap, pension terms, and £30,000 tax exemptions.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/nhs-settlement-agreements/',
  },
  openGraph: {
    title: 'NHS Settlement & MARS Calculator 2026 | SettlementCheck',
    description:
      'Calculate NHS settlement and MARS redundancy payouts under Agenda for Change. HM Treasury rules, £100k cap, pension terms, and £30,000 tax exemptions.',
    url: 'https://settlementcheck.co.uk/guides/nhs-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHS Settlement & MARS Calculator 2026 | SettlementCheck',
    description:
      'Calculate NHS settlement and MARS redundancy payouts under Agenda for Change. HM Treasury rules, £100k cap, pension terms, and £30,000 tax exemptions.',
  },
}

const FAQS = [
  {
    q: 'How is NHS redundancy pay calculated under Agenda for Change?',
    a: 'Under Agenda for Change Section 16, redundancy pay is 1 month of basic pay for each complete year of reckonable NHS service, capped at 24 months. You need at least 2 continuous years of service. Unlike statutory redundancy, it uses your actual basic monthly salary without the weekly statutory cap.',
  },
  {
    q: 'What is MARS in the NHS and how is the exit payment capped?',
    a: 'The Mutually Agreed Resignation Scheme (MARS) is a voluntary departure scheme under Agenda for Change Section 17. Payments are typically 1 month of pay per year of service, capped at 21 months or a local trust cap. The first £30,000 is usually tax-free under ITEPA 2003 Section 403.',
  },
  {
    q: 'How does an NHS settlement agreement affect my NHS pension?',
    a: 'Your accrued pension rights are protected by law. Under Agenda for Change Section 16, eligible staff who have reached minimum pension age can choose to use their redundancy payment to buy out the actuarial reduction for early retirement, or take the redundancy payment as a lump sum.',
  },
  {
    q: 'Can I return to work in the NHS after taking a MARS voluntary severance package?',
    a: 'Yes, though there is usually a mandatory break-in-service period. Under standard MARS rules, returning to NHS employment within 6 months of leaving normally requires repaying a proportionate share of your severance payment.',
  },
  {
    q: 'What is a Special Severance Payment in the NHS?',
    a: 'A Special Severance Payment is any sum paid to a departing employee that exceeds their statutory or contractual entitlements. This includes ex-gratia payments and discretionary notice pay, which require HM Treasury approval.',
  },
  {
    q: 'Does my NHS settlement agreement need HM Treasury approval?',
    a: 'Yes, if it includes a Special Severance Payment. NHS organisations have no delegated authority to approve Special Severance Payments, so every such payment requires Department of Health and Social Care and HM Treasury sign-off.',
  },
  {
    q: 'Can an NHS settlement agreement stop me from whistleblowing?',
    a: 'No. Any clause attempting to restrict your right to make a protected disclosure is legally void under Section 43J of the Employment Rights Act 1996. You retain the right to report patient safety or whistleblowing concerns.',
  },
  {
    q: 'How much will my NHS employer contribute to legal fees?',
    a: 'NHS employers standardly contribute £350 to £500+ plus VAT (and sometimes up to £750 plus VAT) directly to your independent solicitor upon completion. Any excess or abortive work is subject to your solicitor engagement terms.',
  },
  {
    q: 'Can I use my own solicitor for an NHS settlement?',
    a: 'Yes. You have the statutory right to choose any independent, qualified SRA-regulated solicitor. You are not obliged to use a panel firm suggested by your NHS trust.',
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
  headline: 'NHS Settlement Agreements & MARS Calculator: 2026 Rules & Payouts',
  url: 'https://settlementcheck.co.uk/guides/nhs-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-07-11',
  dateModified: '2026-11-22',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
  },
  reviewedBy: {
    '@type': 'Organization',
    name: 'SettlementCheck Legal Research Desk',
    url: 'https://settlementcheck.co.uk/how-it-works/',
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
    '@id': 'https://settlementcheck.co.uk/guides/nhs-settlement-agreements/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 43J',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/43J',
    },
    {
      '@type': 'Legislation',
      name: 'National Health Service Act 2006',
      url: 'https://www.legislation.gov.uk/ukpga/2006/41/contents',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
  ],
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

export default function NhsSettlementAgreements() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }}
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">NHS &amp; Public Sector</span>
            </div>
            <h1 className="sc-h1 mb-4">
              NHS Settlement Agreements &amp; MARS Rules
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against Agenda for Change &amp; HMT Guidance
            </p>
            <p className="sc-lead leading-relaxed">
              Reviewing an NHS redundancy offer, MARS exit, or draft settlement agreement? Agenda for Change Section 16 and 17 set your contractual pay rules, alongside HM Treasury approval thresholds. Check your calculated statutory baseline in 60 seconds with no email required, understand your pension and whistleblowing protections, and prepare for an independent solicitor review.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Embedded Calculator (Immediately after Hero) */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your NHS offer compare to the statutory baseline?"
                subtitle="Check your calculated statutory baseline (£751/wk cap), notice pay, and tax-free allowances alongside Agenda for Change rules."
                disputeType="nhs_settlement"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Tax-Free Exemption', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={42000}
                initialYears={6}
                initialAge={42}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Statutory Quick Answer Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-3">
                How are NHS redundancy and MARS payments calculated?
              </h2>
              <p className="text-[15px] text-ink leading-relaxed mb-5">
                Under Agenda for Change Section 16, contractual redundancy pay is 1 month of basic pay per complete year of reckonable service (capped at 24 months, minimum 2 years&apos; service). MARS voluntary exits under Section 17 provide 1 month of pay per year up to 21 months. Special Severance Payments require HM Treasury sign-off, with packages at or above £100,000 needing Ministerial clearance.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">AfC Compulsory Redundancy</span>
                  <span className="font-bold text-ink text-sm block mb-1">1 Month Pay Per Year (Max 24 Mos)</span>
                  <span className="text-muted text-[12px]">Agenda for Change s.16 (min 2 yrs service)</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">MARS Voluntary Exit</span>
                  <span className="font-bold text-ink text-sm block mb-1">1 Month Pay Per Year (Max 21 Mos)</span>
                  <span className="text-muted text-[12px]">Agenda for Change s.17 scheme framework</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Treasury / Ministerial Sign-Off</span>
                  <span className="font-bold text-ink text-sm block mb-1">£100,000 Exit / £150,000 Salary</span>
                  <span className="text-muted text-[12px]">DHSC &amp; HM Treasury approval mandatory</span>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px] block mb-1">Tax-Free Exemption</span>
                  <span className="font-bold text-ink text-sm block mb-1">First £30,000 Tax-Free</span>
                  <span className="text-muted text-[12px]">ITEPA 2003 s.403 (notice pay taxed as wages)</span>
                </div>
              </div>
            </div>

            {/* Interactive NHS / MARS Calculator */}
            <div id="mars-calculator" className="my-2 scroll-mt-24">
              <NhsMarsCalculator />
              <p className="text-xs text-muted mt-3">
                Prefer the standalone tool? Open our dedicated{' '}
                <Link href="/nhs-mars-calculator/" className="text-coral underline hover:text-ink font-medium">
                  NHS MARS &amp; Redundancy Calculator 2026 →
                </Link>
              </p>
            </div>

            {/* Emotional Grounding & Reassurance Card */}
            <div className="bg-[#FAF7F2] border-l-4 border-coral rounded-r-xl p-6 shadow-sm">
              <h2 className="font-serif text-[18px] font-[460] text-ink mb-2">
                Understanding your position as an NHS employee
              </h2>
              <p className="text-[14px] text-ink mb-3 leading-relaxed">
                Leaving the NHS after years of public service can feel overwhelming. When trust management presents a draft settlement agreement or MARS proposal, you may feel under pressure to decide quickly.
              </p>
              <p className="text-[14px] text-muted leading-relaxed">
                You hold clear contractual rights under Agenda for Change, and ACAS Code 4 recommends at least 10 calendar days to consider a written offer (as guidance rather than a strict legal right). Under Section 203(3) ERA 1996, independent legal advice is required to validate an employment waiver. NHS employers standardly contribute £350 to £500+ plus VAT toward this review upon completion, with any excess or abortive work subject to your solicitor engagement terms.
              </p>
            </div>

            {/* Key Takeaways */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">Key rules at a glance</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Contractual redundancy under Agenda for Change Section 16 pays 1 month of basic pay per year of service (max 24 months).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">MARS voluntary severance under Section 17 provides up to 21 months of basic salary, with the first £30,000 paid tax-free under <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">ITEPA 2003 s.403</Link>.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Any payment exceeding your contractual or statutory entitlement is a Special Severance Payment requiring HM Treasury approval.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Exit packages of £100,000 or more, or for staff earning over £150,000, require Ministerial clearance from the DHSC.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Under Section 43J of the Employment Rights Act 1996, clauses attempting to prevent whistleblowing or patient safety disclosures are void.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. What is a Special Severance Payment in the NHS?</h2>
              <div className="guide-body bg-paper p-5 rounded-xl border border-rule">
                A <strong>Special Severance Payment (SSP)</strong> is any payment made to a departing public sector employee that exceeds their statutory or contractual entitlements. In the NHS, this includes ex-gratia sums and discretionary notice pay, all of which require HM Treasury approval.
              </div>
              <p className="guide-body">
                These payments are scrutinised because they involve public funds. Common examples include ex-gratia sums and discretionary notice pay (<Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON</Link>, which is taxed as wages under ITEPA 2003 s.402D). They also include voluntary exit payments exceeding standard Agenda for Change limits.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-2 flex items-start gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>What is excluded:</strong> <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">Statutory redundancy pay</Link>, contractual Agenda for Change redundancy pay, and employment tribunal awards are not Special Severance Payments. They do not require the same Treasury approval.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. Why do NHS settlement agreements need HM Treasury approval?</h2>
              <p className="guide-body">
                NHS organisations operate under strict financial controls and have no delegated authority to approve Special Severance Payments on their own.
              </p>
              <p className="guide-body">
                Every proposed Special Severance Payment must go through external review. The trust prepares a business case for NHS England and the Department of Health and Social Care, followed by HM Treasury sign-off.
              </p>
              <p className="guide-body">
                Because of this process, NHS settlement agreements can take several weeks or months to finalise. You can compare your package against wider UK outcomes in our guide to <Link href="/guides/what-is-a-fair-settlement-agreement/" className="underline hover:text-ink">fair settlement agreements</Link>.
              </p>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-2">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">The £100,000 threshold</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    If the total exit package includes a Special Severance Payment of £100,000 or more, Ministerial approval is required. The employer must count all elements of redundancy and notice pay in the total.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">The £150,000 salary cap</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Ministerial approval is also required if you earn £150,000 or more, or hold a senior management role. This ensures high-value public sector exits receive direct ministerial authorisation.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: NHS Pension Impact */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How does NHS redundancy affect your NHS Pension?</h2>
              <p className="guide-body">
                For most NHS staff, the NHS Pension (1995, 2008, or 2015 Scheme) is a major financial asset. Leaving the service raises immediate questions about accrued benefits.
              </p>
              <div className="bg-paper border border-rule rounded-xl p-5 space-y-3">
                <h3 className="text-base font-semibold text-ink">Two key pension choices on compulsory redundancy</h3>
                <p className="text-[14px] text-muted leading-relaxed">
                  Under Agenda for Change Section 16, if you have reached minimum pension age (age 50 for the 1995 section, age 55 for the 2008/2015 sections) and are made redundant, you may be eligible to choose:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                    <strong className="text-ink text-sm block mb-1">Option A: Lump Sum Cash Payout</strong>
                    <span className="text-[14px] text-muted leading-relaxed">Take your contractual redundancy lump sum. Your accrued pension remains preserved in the scheme until normal pension age.</span>
                  </div>
                  <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                    <strong className="text-ink text-sm block mb-1">Option B: Unreduced Early Retirement</strong>
                    <span className="text-[14px] text-muted leading-relaxed">Use the redundancy capital sum to buy out the actuarial reduction. You receive an immediate, unreduced annual pension.</span>
                  </div>
                </div>
              </div>
              <p className="guide-body">
                Your accrued pension benefits are protected by statute and cannot be forfeited by a settlement agreement. Under MARS, early retirement buyout is not automatic unless agreed separately. You can check your baseline statutory entitlement with our <Link href="/redundancy-calculator/" className="underline hover:text-ink font-medium">redundancy pay calculator</Link>.
              </p>
            </div>

            {/* Section 4: MARS Break-in-Service & Clawback Rules */}
            <div className="space-y-4">
              <h2 className="guide-h2">4. Can you return to the NHS after a MARS exit?</h2>
              <p className="guide-body">
                Accepting a MARS package does not permanently bar you from working in the NHS. However, standard Agenda for Change Section 17 rules impose a <strong>mandatory break-in-service period</strong>, typically 6 months.
              </p>
              <div className="bg-paper border border-rule rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold text-coral uppercase tracking-wider">Clawback Mechanism</span>
                <p className="text-[14px] text-muted leading-relaxed">
                  Returning to NHS employment (including bank or agency shifts in an NHS trust) within the break period may trigger repayment of a proportion of your severance. Your independent solicitor can check whether any re-employment or non-compete terms in the draft are reasonable.
                </p>
              </div>
            </div>

            {/* Section 5: Whistleblowing & Patient Safety */}
            <div className="space-y-4">
              <h2 className="guide-h2">5. Do confidentiality clauses stop NHS whistleblowing?</h2>
              <p className="guide-body">
                NHS settlement agreements commonly include confidentiality clauses covering the terms and circumstances of your departure. However, they cannot prevent you from making a protected disclosure under Section 43J of the Employment Rights Act 1996.
              </p>
              <p className="guide-body">
                You always retain the right to report patient safety or regulatory concerns to the Care Quality Commission (CQC), the General Medical Council (GMC), or the Nursing and Midwifery Council (NMC).
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>Protected disclosures cannot be waived:</strong> Any clause attempting to stop you from whistleblowing or raising patient safety concerns is void by law.
                </p>
              </div>
            </div>

            {/* Section 6: The 5-Stage NHS Settlement Timeline */}
            <div className="space-y-4">
              <h2 className="guide-h2">6. What happens at each stage of an NHS settlement?</h2>
              <p className="guide-body">
                Here is the standard progression for an NHS settlement or MARS exit, alongside key statutory negotiation rules.
              </p>

              <div className="space-y-3 mt-4">
                {[
                  {
                    step: '1',
                    title: 'Receive draft terms and verify calculations',
                    desc: 'Check your basic monthly pay and reckonable years against Agenda for Change Section 16 or 17. Remember that statutory redundancy requires 2 years of service (ERA 1996 s.155; certain excluded categories apply under s.141).',
                  },
                  {
                    step: '2',
                    title: 'Trust prepares business case',
                    desc: 'Pre-termination talks under Section 111A ERA 1996 apply only to ordinary unfair dismissal, while Without Prejudice applies only to genuine existing disputes. The trust submits a value-for-money case to NHS England and DHSC.',
                  },
                  {
                    step: '3',
                    title: 'External approvals (Treasury / Ministerial)',
                    desc: 'Any Special Severance Payment or package of £100,000 or more undergoes HM Treasury review, which can take 6 to 12 weeks. Under contract law (Hyde v Wrench / Routledge v Grant), a counter-offer rejects the original offer and an employer can withdraw before signing.',
                  },
                  {
                    step: '4',
                    title: 'Independent legal review',
                    desc: 'You instruct an independent SRA-regulated solicitor, whose advice is protected by legal professional privilege. NHS employers standardly contribute £350 to £500+ plus VAT upon completion, with excess or abortive work subject to solicitor engagement terms.',
                  },
                  {
                    step: '5',
                    title: 'Agreement execution and payout',
                    desc: 'Once signed and approved, your exit payment is processed. The first £30,000 of qualifying compensation is exempt under ITEPA 2003 s.403, while notice pay and garden leave remain taxed as wages.',
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4 p-4 rounded-xl border border-rule bg-white">
                    <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
                      <p className="text-[14px] text-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 7: Legal Fees & Independent Solicitor */}
            <div className="space-y-4">
              <h2 className="guide-h2">7. Who pays legal fees for an NHS settlement agreement?</h2>
              <p className="guide-body">
                Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is legally binding only once you receive advice from an independent legal adviser.
              </p>
              <p className="guide-body">
                NHS employers standardly contribute £350 to £500+ plus VAT (and sometimes up to £750 plus VAT) toward your legal fees upon completion. Any excess or abortive costs depend on your solicitor engagement terms.
              </p>
              <p className="guide-body">
                You have the right to choose your own SRA-regulated solicitor rather than using a trust-suggested firm. Read more in our guide to <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-ink">employer-recommended solicitors</Link>.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your NHS settlement offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and notice pay breakdown before speaking to an independent solicitor.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/calculator/" className="btn-accent w-full sm:w-auto">
                  Check my offer now →
                </Link>
                <Link href="/redundancy-calculator/" className="btn-secondary w-full sm:w-auto">
                  Calculate my redundancy →
                </Link>
              </div>
              <p className="text-white/60 text-[12px] mt-4">
                Free, confidential, no email required · Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion (excess or abortive work subject to solicitor engagement terms)
              </p>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-2">
              <h2 className="guide-h2">Frequently asked questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* References */}
            <section className="border-t border-rule pt-6 bg-paper px-5 py-4 rounded-xl mt-8">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
              <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
                <li>
                  <a href="https://www.gov.uk/government/publications/public-sector-exit-payments-guidance" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    HM Treasury: Guidance on Public Sector Exit Payments (including Special Severance Payments)
                  </a>
                </li>
                <li>
                  <a href="https://www.gov.uk/government/publications/managing-public-money" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    HM Treasury: Managing Public Money, Annex 4.13 (Special Payments)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/43J" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 43J (Protected disclosures)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 203 (Restrictions on contracting out)
                  </a>
                </li>
                <li>
                  <a href="https://www.nhsemployers.org/publications/tchandbook" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    NHS Terms and Conditions of Service Handbook, Section 16 (Redundancy Pay) and Section 17 (MARS)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Income Tax (Earnings and Pensions) Act 2003, Section 403 (Tax-free exemption)
                  </a>
                </li>
              </ol>
            </section>

            {/* Related Guides & Mesh Links */}
            <div className="pt-6">
              <RelatedArticles
                items={[
                  {
                    href: '/protective-award-calculator/',
                    title: 'Protective Award Calculator UK',
                    description: 'Calculate compensation up to 90 days gross pay for failure to consult in collective redundancies.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/redundancy-calculator/',
                    title: 'Statutory Redundancy Calculator',
                    description: 'Calculate your statutory redundancy baseline under the April 2026 weekly cap of £751.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/guides/tax-free-settlement-30000/',
                    title: 'The £30,000 Tax-Free Settlement Rule',
                    description: 'Learn which elements of your NHS settlement qualify for the tax-free exemption under s.403.',
                    tag: 'Tax Guide',
                  },
                  {
                    href: '/guides/employer-recommended-solicitor/',
                    title: 'Employer-Recommended Solicitors',
                    description: 'Understand your statutory right to choose your own independent employment solicitor.',
                    tag: 'Guide',
                  },
                  {
                    href: '/redundancy/',
                    title: 'UK Redundancy & Sector Restructuring Hub',
                    description: 'Compare NHS Agenda for Change Section 16 redundancy rules alongside Civil Service CSCS and private sector baselines.',
                    tag: 'Sector Hub',
                  },
                  {
                    href: '/guides/redundancy-vs-settlement-agreement/',
                    title: 'Redundancy Pay vs Settlement Agreement UK',
                    description: 'Key differences between statutory redundancy entitlements and negotiated Section 203 exit packages.',
                    tag: 'Comparison',
                  },
                ]}
              />
            </div>

            {/* Disclaimer */}
            <p className="text-[14px] text-muted border-t border-rule pt-6 leading-relaxed">
              SettlementCheck is an independent introduction service. We are not a law firm and we do not provide legal advice. All solicitors on our panel are independently SRA-regulated. This guide provides factual information regarding the settlement process and does not constitute legal counsel.
            </p>

          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
