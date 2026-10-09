import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'
import NhsMarsCalculator from './NhsMarsCalculator'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'NHS Settlement & MARS Calculator 2026 | SettlementCheck',
  description:
    'Calculate your NHS settlement and MARS redundancy payout under Agenda for Change. HM Treasury approval rules, £100k cap, pension rules, and tax-free limits.',
  alternates: {
    canonical: '/guides/nhs-settlement-agreements/',
  },
  openGraph: {
    title: 'NHS Settlement & MARS Calculator 2026 | SettlementCheck',
    description:
      'Calculate your NHS settlement and MARS redundancy payout under Agenda for Change. HM Treasury approval rules, £100k cap, pension rules, and tax-free limits.',
    url: '/guides/nhs-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHS Settlement & MARS Calculator 2026 | SettlementCheck',
    description:
      'Calculate your NHS settlement and MARS redundancy payout under Agenda for Change. HM Treasury approval rules, £100k cap, pension rules, and tax-free limits.',
  },
}

const FAQS = [
  {
    q: 'How is NHS redundancy pay calculated under Agenda for Change?',
    a: 'Under Agenda for Change Section 16, redundancy pay is calculated as 1 month of basic pay for each complete year of reckonable NHS service, capped at 24 months. You must have at least 2 continuous years of service. Unlike statutory redundancy, pay is calculated on your actual basic monthly salary with no weekly statutory cap.',
  },
  {
    q: 'What is MARS in the NHS and how is the exit payment capped?',
    a: 'The Mutually Agreed Resignation Scheme (MARS) is a voluntary departure scheme under Agenda for Change Section 17. Payments are typically calculated as 1 month of pay per year of service, capped at 21 months (or a local trust cap). The first £30,000 is tax-free under ITEPA 2003 Section 403.',
  },
  {
    q: 'How does an NHS settlement agreement affect my NHS pension?',
    a: 'Your accrued pension rights are protected by law. Under Agenda for Change Section 16, eligible staff who have reached minimum pension age can choose to use their redundancy payment to buy out the actuarial reduction for early retirement, or take the redundancy payment as a lump sum.',
  },
  {
    q: 'Can I return to work in the NHS after taking a MARS voluntary severance package?',
    a: 'Yes, but there is usually a mandatory break-in-service period. Under standard MARS rules, you cannot return to NHS employment within 6 months of your leaving date without having to repay a proportionate part of your severance payment.',
  },
  {
    q: 'What is a Special Severance Payment in the NHS?',
    a: 'A Special Severance Payment is any sum paid to a departing employee that exceeds their statutory or contractual entitlements. This includes ex-gratia payments and discretionary notice pay, all of which require HM Treasury approval.',
  },
  {
    q: 'Does my NHS settlement agreement need HM Treasury approval?',
    a: 'Yes. NHS organisations have no delegated authority to approve Special Severance Payments. Every such payment requires approval from the Department of Health and Social Care and HM Treasury.',
  },
  {
    q: 'Can an NHS settlement agreement stop me from whistleblowing?',
    a: 'No. Any clause that attempts to restrict your right to make a protected disclosure is legally void under Section 43J of the Employment Rights Act 1996. You always retain the right to report patient safety or whistleblowing concerns.',
  },
  {
    q: 'How much will my NHS employer contribute to legal fees?',
    a: 'NHS employers typically contribute between £350 and £750 plus VAT toward your legal fees. This is paid directly to your chosen independent solicitor once the agreement is signed.',
  },
  {
    q: 'Can I use my own solicitor for an NHS settlement?',
    a: 'Yes. You have the statutory right to choose any independent, qualified SRA-regulated solicitor. You are never obliged to use any panel firm suggested by your NHS trust.',
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
  dateModified: '2026-10-09',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Agenda for Change &amp; Redundancy Rights
            </p>
            <h1 className="sc-h1 mb-6">
              NHS Settlement Agreements &amp; MARS Calculator: 2026 Rules &amp; Payouts
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>SettlementCheck Legal Research Desk</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Guidance active for 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              In 2026, NHS settlement agreements with Special Severance Payments (amounts exceeding statutory or contractual entitlements) must be approved by HM Treasury. Exit packages of £100,000 or more, or for staff earning over £150,000, require Ministerial approval. Under Section 43J of the Employment Rights Act 1996, these agreements cannot restrict your right to whistleblow or report patient safety concerns.
            </p>
          </div>
        </section>

        {/* Statutory Quick Answer Callout (GEO / AI Overview Optimised) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  AfC Section 16 &amp; 17 | HMT Guidance
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                How are NHS redundancy and MARS settlement payments calculated?
              </h2>
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Under NHS Agenda for Change Section 16, contractual redundancy pay is 1 month of basic pay per complete year of reckonable service (capped at 24 months, minimum 2 years service). Mutually Agreed Resignation Scheme (MARS) voluntary exits under Section 17 provide 1 month of pay per year up to 21 months. Special Severance Payments require HM Treasury approval, with packages at or above £100,000 requiring Ministerial clearance. The first £30,000 is tax-free under ITEPA 2003 s.403.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">AfC Compulsory Redundancy</span>
                  <span className="font-bold text-ink text-sm">1 Month Pay Per Year (Max 24 Mos)</span>
                  <span className="text-muted text-[11px]">Agenda for Change s.16 (min 2 yrs service)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">MARS Voluntary Exit</span>
                  <span className="font-bold text-ink text-sm">1 Month Pay Per Year (Max 21 Mos)</span>
                  <span className="text-muted text-[11px]">Agenda for Change s.17 scheme framework</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Treasury / Ministerial Sign-Off</span>
                  <span className="font-bold text-ink text-sm">£100,000 Exit / £150,000 Salary</span>
                  <span className="text-muted text-[11px]">DHSC &amp; HM Treasury approval mandatory</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax Exemption Floor</span>
                  <span className="font-bold text-ink text-sm">First £30,000 Tax-Free</span>
                  <span className="text-muted text-[11px]">ITEPA 2003 s.403 (0% employee NI)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary framework: <strong>NHS Agenda for Change &amp; HMT Annex 4.13</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check NHS agreement clauses →
                  </Link>
                  <Link href="/get-matched/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Find NHS specialist solicitor →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive NHS / MARS Calculator */}
            <div className="my-2">
              <NhsMarsCalculator />
            </div>

            {/* Emotional Grounding & Reassurance Card (Preventing Existential Vacuum) */}
            <div className="bg-[#FAF7F2] border-l-4 border-coral rounded-r-xl p-6 shadow-sm">
              <h2 className="font-serif text-[18px] font-[460] text-ink mb-2">
                Understanding your position as an NHS employee
              </h2>
              <p className="sc-body text-[14px] text-ink mb-3 leading-relaxed">
                Leaving the NHS after years of dedicated public service is emotionally demanding. When trust management presents a draft settlement agreement or MARS proposal, you might feel pressured to agree quickly.
              </p>
              <p className="sc-body text-[14px] text-muted leading-relaxed">
                You hold strong contractual rights under Agenda for Change. You are entitled to take the time you need, verify every calculation, and instruct an independent solicitor of your choice. Your trust is legally required to fund your independent legal review.
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
                  <span className="text-[15px] text-ink leading-relaxed">Under Section 43J of the Employment Rights Act 1996, settlement clauses that attempt to prevent whistleblowing or patient safety disclosures are void.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">NHS employers typically provide a £350 to £750 + VAT contribution toward independent legal advice.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">What is a Special Severance Payment in the NHS?</h2>
              <div className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule">
                A <strong>Special Severance Payment (SSP)</strong> is any payment made to a departing public sector employee that exceeds their statutory or contractual entitlements. In the NHS, this includes ex-gratia sums, discretionary notice pay, and voluntary exits, all of which require HM Treasury approval.
              </div>
              <p className="guide-body">
                These payments are scrutinised because they involve public funds. Common examples include ex-gratia payments and compensation in lieu of notice (often referred to as <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON</Link>, which is taxable under Section 402D of ITEPA 2003) where no contractual clause exists. They also include voluntary exit payments that exceed standard Agenda for Change guidelines.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-2 flex items-start gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>What is excluded:</strong> <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">Statutory redundancy pay</Link> and contractual Agenda for Change redundancy pay are not Special Severance Payments. Payments ordered by an employment tribunal are also excluded. They do not require the same Treasury approval.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Why NHS settlement agreements require approval</h2>
              <p className="guide-body">
                NHS organisations operate under strict financial controls. Other public bodies can approve minor severance payments. NHS employers do not have this flexibility.
              </p>
              <p className="guide-body">
                Every Special Severance Payment proposed by an NHS trust or foundation trust must be submitted for external approval. The business case must be reviewed by the Department of Health and Social Care and NHS England. It is then sent to HM Treasury for final sign-off.
              </p>
              <p className="guide-body">
                Because of this multi-stage review, NHS settlement agreements can take several weeks or even months to finalise. Your employer must demonstrate that the payment represents value for money. They must also show they explored other options to resolve the dispute before offering a settlement. You can compare your package against typical private and public sector outcomes in our guide to <Link href="/guides/what-is-a-fair-settlement-agreement/" className="underline hover:text-ink">fair settlement agreements</Link>.
              </p>
            </div>

            {/* Section 3: High-Value Thresholds */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mt-2">
              <div className="border border-rule rounded-lg p-5">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">The £100,000 threshold</h3>
                <p className="text-[14px] text-muted leading-relaxed">
                  If the total exit package includes a Special Severance Payment of £100,000 or more, it requires Ministerial approval. When calculating the exit package value, your employer must include all elements of redundancy and notice pay. They cannot count only the severance element.
                </p>
              </div>
              <div className="border border-rule rounded-lg p-5">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-3">The £150,000 salary cap</h3>
                <p className="text-[14px] text-muted leading-relaxed">
                  Ministerial approval is also required if you earn £150,000 or more. The same applies if you hold a senior management role. This is a hard limit designed to ensure high-value public sector exits are personally authorised by a government minister.
                </p>
              </div>
            </div>

            {/* Section 4: NHS Pension Impact (New: Eradicating Existential Vacuum) */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">How NHS redundancy affects your NHS Pension</h2>
              <p className="guide-body">
                For most NHS staff, the NHS Pension (whether in the 1995, 2008, or 2015 Scheme) is their most significant financial asset. Departing the service raises immediate questions about accrued benefits.
              </p>
              <div className="bg-paper border border-rule rounded-xl p-5 space-y-3">
                <h3 className="text-base font-semibold text-ink">Two key pension choices on compulsory redundancy</h3>
                <p className="text-sm text-ink leading-relaxed">
                  Under Agenda for Change Section 16, if you have reached minimum pension age (age 50 for the 1995 section, age 55 for the 2008/2015 sections) and are made redundant, you may be eligible to choose:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-white rounded-lg border border-rule">
                    <strong className="text-ink block mb-1">Option A: Lump Sum Cash Payout</strong>
                    <span className="text-muted leading-relaxed">Take your contractual redundancy lump sum. Your accrued pension remains preserved in the scheme until normal pension age.</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-rule">
                    <strong className="text-ink block mb-1">Option B: Unreduced Early Retirement</strong>
                    <span className="text-muted leading-relaxed">Use the redundancy capital sum to buy out the actuarial reduction. You receive an immediate, unreduced annual pension.</span>
                  </div>
                </div>
              </div>
              <p className="guide-body">
                Your accrued pension benefits are protected by statute. A settlement agreement cannot forfeit the pension you have already built up. If you are offered a voluntary exit under MARS, early retirement buyout is generally not automatic unless explicitly negotiated.
              </p>
            </div>

            {/* Section 5: MARS Break-in-Service & Clawback Rules */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">MARS re-employment rules and clawback clauses</h2>
              <p className="guide-body">
                Many healthcare professionals worry that accepting a voluntary severance package or MARS exit will permanently bar them from working in the NHS.
              </p>
              <p className="guide-body">
                Under standard NHS Agenda for Change Section 17 guidelines, you are not permanently barred from NHS employment. However, schemes impose a <strong>mandatory break-in-service period</strong> (typically 6 months).
              </p>
              <div className="bg-paper border border-rule rounded-xl p-5 space-y-2">
                <span className="text-xs font-bold text-coral uppercase tracking-wider">Clawback Mechanism</span>
                <p className="text-sm text-ink leading-relaxed">
                  If you return to NHS employment (including bank or agency shifts within an NHS trust) within the specified break period, you may be required to repay a proportion of your severance payment. An independent solicitor will examine your draft agreement to verify whether re-employment restrictions are reasonable.
                </p>
              </div>
            </div>

            {/* Section 6: Whistleblowing & Patient Safety */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Confidentiality and whistleblowing rights in NHS exits</h2>
              <p className="guide-body">
                It is common for NHS settlement agreements to contain confidentiality clauses. These clauses usually prevent you from discussing the terms of the agreement or the circumstances of your departure.
              </p>
              <p className="guide-body">
                However, the law protects your right to speak out on patient safety and regulatory issues. Your agreement cannot prevent you from making a protected disclosure under Section 43J of the Employment Rights Act 1996. You always retain the right to report patient safety concerns to the Care Quality Commission (CQC), the General Medical Council (GMC), or the Nursing and Midwifery Council (NMC).
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>Silencing is unlawful:</strong> Any clause in a settlement agreement that attempts to stop you from whistleblowing or raising patient safety concerns is void by law.
                </p>
              </div>
            </div>

            {/* Section 7: The 5-Stage NHS Settlement Timeline */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">The 5-stage NHS settlement timeline: what happens next</h2>
              <p className="guide-body">
                Knowing what comes next reduces anxiety. Here is the standard progression for an NHS settlement or MARS exit:
              </p>

              <div className="space-y-3 mt-4">
                {[
                  {
                    step: '1',
                    title: 'Receive draft terms and verify calculations',
                    desc: 'Check your basic monthly pay and continuous reckonable years against Agenda for Change Section 16 or Section 17 using the calculator above.',
                  },
                  {
                    step: '2',
                    title: 'Trust prepares business case',
                    desc: 'Your NHS trust prepares an internal value-for-money justification to submit to NHS England and the DHSC.',
                  },
                  {
                    step: '3',
                    title: 'External approvals (Treasury / Ministerial)',
                    desc: 'Any Special Severance Payment or package equal to or exceeding £100,000 undergoes HM Treasury review. This stage can take 6 to 12 weeks.',
                  },
                  {
                    step: '4',
                    title: 'Independent legal review',
                    desc: 'You instruct an independent SRA-regulated solicitor. Your NHS employer pays the legal fee contribution (£350 to £750 + VAT) directly.',
                  },
                  {
                    step: '5',
                    title: 'Agreement execution and payout',
                    desc: 'Once signed and approved, your exit payment is processed. The first £30,000 is paid completely tax-free under ITEPA 2003 s.403.',
                  },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4 p-4 rounded-xl border border-rule bg-white">
                    <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {step}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
                      <p className="text-xs text-muted leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 8: Legal Fees & Independent Solicitor */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Legal fees and choosing your own independent solicitor</h2>
              <p className="guide-body">
                To make a settlement agreement legally binding under Section 203 of the Employment Rights Act 1996, you must receive independent legal advice. The solicitor advising you must confirm their advice in writing.
              </p>
              <p className="guide-body">
                Your NHS employer will normally make a financial contribution toward your legal fees. The standard contribution is between £350 and £750 plus VAT. In most straightforward cases, this contribution covers the full cost of the legal review.
              </p>
              <p className="guide-body">
                You have the statutory right to choose your own independent solicitor. Your trust HR department may suggest a panel firm, but you are not required to use them. Choosing a specialist employment solicitor ensures your pension, whistleblowing rights, and tax position are fully protected. You can read more about how this works in our guide to <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-ink">employer-recommended solicitors</Link>.
              </p>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Find out where your NHS settlement offer stands
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Free calculator. SRA-regulated solicitor matched within 24 hours. Your NHS employer covers the legal fees.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/settlement-agreement-review/" className="btn-accent w-full sm:w-auto">
                  Review my agreement clauses →
                </Link>
                <Link href="/get-matched/" className="w-full sm:w-auto px-5 py-3 rounded-lg border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                  Match with NHS solicitor →
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4 pt-2">
              <h2 className="guide-h2 text-[24px]">Frequently asked questions</h2>
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
                    description: 'Calculate your statutory redundancy pay floor under the 2026 weekly cap of £751.',
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
                ]}
              />
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
