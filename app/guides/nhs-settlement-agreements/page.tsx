import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'NHS Settlement Agreements 2026 | Rules | SettlementCheck',
  description: 'NHS settlement agreements and Special Severance Payments in 2026. How HM Treasury approvals work, the £100,000 threshold, and your whistleblowing rights.',
  alternates: {
    canonical: '/guides/nhs-settlement-agreements/',
  },
  openGraph: {
    title: 'NHS Settlement Agreements 2026 | Rules | SettlementCheck',
    description: 'NHS settlement agreements and Special Severance Payments in 2026. How HM Treasury approvals work, the £100,000 threshold, and your whistleblowing rights.',
    url: '/guides/nhs-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NHS Settlement Agreements 2026 | Rules | SettlementCheck',
    description: 'NHS settlement agreements and Special Severance Payments in 2026. How HM Treasury approvals work, the £100,000 threshold, and your whistleblowing rights.',
  },
}

const FAQS = [
  {
    q: 'What is a Special Severance Payment in the NHS?',
    a: 'A Special Severance Payment is any sum paid to a departing employee that exceeds their statutory or contractual entitlements. This includes ex-gratia payments and discretionary notice pay.',
  },
  {
    q: 'Does my NHS settlement agreement need HM Treasury approval?',
    a: 'Yes. NHS organisations have no delegated authority to approve Special Severance Payments. Every such payment requires approval from the Department of Health and Social Care and HM Treasury.',
  },
  {
    q: 'Can an NHS settlement agreement stop me from whistleblowing?',
    a: 'No. Any clause that attempts to restrict your right to make a protected disclosure is legally void. You always retain the right to report patient safety or whistleblowing concerns.',
  },
  {
    q: 'How much will my NHS employer contribute to legal fees?',
    a: 'NHS employers typically contribute between £350 and £750 toward your legal fees. This is usually paid directly to your chosen solicitor once the agreement is signed.',
  },
  {
    q: 'Can I use my own solicitor for an NHS settlement?',
    a: 'Yes. You have the legal right to choose any independent, qualified solicitor. You are not obliged to use any firm recommended by your employer.',
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
  headline: 'NHS Settlement Agreements: Special Severance Payments',
  url: 'https://settlementcheck.co.uk/guides/nhs-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-07-11',
  dateModified: '2026-07-11',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck',
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
    '@id': 'https://settlementcheck.co.uk/guides/nhs-settlement-agreements/',
  },
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
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-rule-strong text-xs">/</span>
              <span className="text-xs font-medium text-muted tracking-wide uppercase">NHS &amp; Public Sector</span>
            </div>
            <h1 className="sc-h1 mb-6">
              NHS Settlement Agreements: Special Severance Payments
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Guidance active for 2026</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: July 2026</span>
            </div>
            <p className="sc-lead">
              In 2026, NHS settlement agreements containing Special Severance Payments <sup>1</sup>—amounts exceeding statutory or contractual entitlements—must be approved by HM Treasury. Exit packages of £100,000 or more, or for staff earning over £150,000, require Ministerial approval <sup>2</sup>. Under Section 43J of the Employment Rights Act 1996 <sup>3</sup>, these agreements cannot restrict your right to whistleblow or raise patient safety concerns.
            </p>
          </div>
        </section>

        {/* Article body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Key Takeaways */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">Key rules at a glance</h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Any payment exceeding your contractual or statutory entitlement is a Special Severance Payment.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">NHS employers do not have the authority to approve these payments themselves. They must get approval from HM Treasury.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Exit packages with severance payments of £100,000 or more, or for staff earning over £150,000, require Ministerial approval.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">Your settlement agreement cannot prevent you from whistleblowing, reporting a crime, or raising patient safety concerns.</span>
                </li>
              </ul>
            </div>

            {/* Section 1 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">What is a Special Severance Payment?</h2>
              <div className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule">
                A <strong>Special Severance Payment (SSP)</strong> is any payment made to a departing public sector employee that exceeds their statutory or contractual entitlements <sup>1</sup>. In the NHS, this includes ex-gratia sums, discretionary notice pay, and voluntary exits, all of which require HM Treasury approval.
              </div>
              <p className="guide-body">
                These payments are scrutinised because they involve public funds. Common examples include ex-gratia payments and compensation in lieu of notice (often referred to as <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON</Link>, which is taxable under Section 402D of ITEPA 2003) where no contractual clause exists. They also include voluntary exit payments that exceed standard guidelines.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 mt-2 flex items-start gap-3">
                <InfoIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>What is excluded:</strong> <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">Statutory redundancy pay</Link> and contractual redundancy pay are not Special Severance Payments. Payments ordered by an employment tribunal are also excluded. They do not require the same Treasury approval.
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
                Every Special Severance Payment proposed by an NHS trust or foundation trust must be submitted for external approval. The business case must be reviewed by the Department of Health and Social Care and NHS England. It is then sent to HM Treasury for final sign-off <sup>2</sup>.
              </p>
              <p className="guide-body">
                Because of this multi-stage review, NHS settlement agreements can take several weeks or even months to finalise. Your employer must demonstrate that the payment represents value for money. They must also show they explored other options to resolve the dispute before offering a settlement.
              </p>
            </div>

            {/* Section 3 */}
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

            {/* Section 4 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Confidentiality and whistleblowing rights in NHS exits</h2>
              <p className="guide-body">
                It is common for NHS settlement agreements to contain confidentiality clauses. These are sometimes called non-disclosure or compromise clauses. They usually prevent you from discussing the terms of the agreement or the circumstances of your departure.
              </p>
              <p className="guide-body">
                However, the law protects your right to speak out on certain matters. Your agreement cannot prevent you from making a protected disclosure, which is the legal term for whistleblowing. You retain the right to report patient safety issues, criminal activity, or breaches of legal obligations under Section 43J of the Employment Rights Act 1996 <sup>3</sup>.
              </p>

              <div className="bg-[#FFF8F6] border border-coral/20 rounded-lg p-5 flex items-start gap-3">
                <AlertIcon />
                <p className="text-[14px] text-ink leading-relaxed">
                  <strong>Silencing is unlawful:</strong> Any clause in a settlement agreement that attempts to stop you from whistleblowing is legally void <sup>3</sup>. NHS employers are instructed that confidentiality clauses must never silence staff who raise safety concerns.
                </p>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">Legal fees and choosing your own solicitor</h2>
              <p className="guide-body">
                To make a settlement agreement legally binding, you must receive independent legal advice <sup>4</sup>. The solicitor advising you must confirm their advice in writing.
              </p>
              <p className="guide-body">
                Your NHS employer will normally make a financial contribution toward your legal fees. The standard contribution is between £350 and £750. In most straightforward cases, this contribution covers the full cost of the legal review.
              </p>
              <p className="guide-body">
                You have the right to choose your own independent solicitor. Your employer may suggest a firm, but you are not required to use them. Choosing a specialist employment solicitor ensures your interests are fully protected. You can read more about how this works in our guide to <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-ink">employer-recommended solicitors</Link>.
              </p>
            </div>

            {/* Section 6 */}
            <div className="space-y-4">
              <h2 className="guide-h2 text-[24px]">How to proceed if offered an NHS settlement</h2>
              <p className="guide-body">
                If you receive a draft settlement agreement from an NHS employer, do not sign it immediately. Take the following steps to protect your position:
              </p>

              <ol className="list-decimal pl-5 space-y-4 mt-4">
                <li className="pl-1">
                  <strong className="text-ink text-[16px] block mb-0.5">Verify the figures</strong>
                  <span className="text-muted text-[15px] block leading-relaxed">
                    Check if the offer meets your contract and statutory redundancy entitlements using our <Link href="/redundancy-calculator" className="underline hover:text-ink">redundancy calculator</Link>.
                  </span>
                </li>
                <li className="pl-1">
                  <strong className="text-ink text-[16px] block mb-0.5">Ask about Treasury approval</strong>
                  <span className="text-muted text-[15px] block leading-relaxed">
                    Confirm whether your employer has submitted the exit case for HM Treasury approval and clarify the expected timeline.
                  </span>
                </li>
                <li className="pl-1">
                  <strong className="text-ink text-[16px] block mb-0.5">Instruct an independent solicitor</strong>
                  <span className="text-muted text-[15px] block leading-relaxed">
                    Choose a solicitor specialising in public sector exits to ensure your interests are represented.
                  </span>
                </li>
                <li className="pl-1">
                  <strong className="text-ink text-[16px] block mb-0.5">Do not sign prematurely</strong>
                  <span className="text-muted text-[15px] block leading-relaxed">
                    Wait for final HM Treasury approval before executing the agreement to prevent delays or invalidation.
                  </span>
                </li>
              </ol>
            </div>

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Find out where your offer stands
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-6">
                Free calculator. Vetted solicitor matched within 24 hours. Your employer pays the fees.
              </p>
              <Link href="/redundancy-calculator" className="btn-accent">
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
              </ol>
            </section>

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
