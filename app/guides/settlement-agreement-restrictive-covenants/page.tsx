import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import { RestrictiveCovenantScanner } from '@/components/RestrictiveCovenantScanner'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Restrictive Covenants | SettlementCheck',
  description:
    'Received a settlement agreement with restrictive covenants? Check non-compete rules, HMRC tax traps under s.225, and how solicitors negotiate terms.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-restrictive-covenants/',
  },
  openGraph: {
    title: 'Settlement Agreement Restrictive Covenants | SettlementCheck',
    description:
      'Received a settlement agreement with restrictive covenants? Check non-compete rules, HMRC tax traps under s.225, and how solicitors negotiate terms.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-restrictive-covenants/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Restrictive Covenants | SettlementCheck',
    description:
      'Received a settlement agreement with restrictive covenants? Check non-compete rules, HMRC tax traps under s.225, and how solicitors negotiate terms.',
  },
}

const FAQS = [
  {
    q: 'Can my employer add new restrictive covenants to a settlement agreement?',
    a: 'Yes, an employer can propose new restrictive covenants in a settlement agreement. Under English contract law, you do not have to accept them. Any new restriction requires separate, valuable consideration to be enforceable. An SRA-regulated solicitor can ask to remove the clause or seek higher compensation in return.',
  },
  {
    q: 'How does HMRC tax payments for restrictive covenants in a settlement agreement?',
    a: 'Under Section 225 of ITEPA 2003, any payment for a restrictive undertaking is taxed as wages. It is subject to PAYE income tax and Class 1 National Insurance. It does not qualify for the £30,000 tax-free exemption under Section 403. Agreements usually allocate a separate nominal sum, typically £100 to £500, to protect the tax-free status of the remaining compensation.',
  },
  {
    q: 'Are post-termination non-compete clauses enforceable under UK employment law?',
    a: 'In UK employment law, restrictive covenants are void by default under the restraint of trade doctrine. A clause is only enforceable if your employer proves it protects a legitimate business interest, such as trade secrets or client connections. It must also go no further than reasonably necessary in duration and scope, as confirmed in Tillman v Egon Zehnder Ltd [2019].',
  },
  {
    q: 'Can a settlement agreement prevent me from whistleblowing or speaking to regulators?',
    a: 'No. Under Section 43J of the Employment Rights Act 1996, any clause trying to stop a protected disclosure is void by law. You keep the right to report criminal acts, regulatory breaches, or safety risks to bodies like the FCA, SRA, CQC, HMRC, or the police.',
  },
  {
    q: 'Who pays the solicitor fee to review my restrictive covenants?',
    a: 'Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion. Under Section 203(3) of the Employment Rights Act 1996, independent advice is mandatory for a valid waiver. That contribution usually covers reviewing the draft. Extra negotiation time or abortive work is subject to your solicitor engagement terms unless your employer raises the cap.',
  },
  {
    q: 'Can my solicitor negotiate to remove or reduce restrictive covenants?',
    a: 'Yes. Reviewing post-termination restrictions is a standard part of an independent solicitor review. Common changes include shortening a 12-month non-compete to 3 or 6 months, deducting time spent on garden leave, or adding carve-outs for non-competing roles.',
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
  headline: 'Restrictive Covenants in Settlement Agreements: Non-Compete Rules UK (2026)',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-restrictive-covenants/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-22',
  dateModified: '2026-10-22',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-restrictive-covenants/',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SettlementAgreementRestrictiveCovenantsGuide() {
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Restrictive Covenants</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Restrictive Covenants in Settlement Agreements
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ITEPA 2003 s.225
            </p>
            <p className="sc-lead leading-relaxed">
              Got a draft settlement agreement with a non-compete or confidentiality clause? These terms can affect where you work next and how your payout is taxed. Check your statutory baseline in 60 seconds with no email required, see how UK law treats restrictive covenants, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* EMBEDDED CALCULATOR */}
        <section className="py-10 bg-card border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's offer against your calculated statutory baseline and check whether restrictive covenants are fairly priced."
              disputeType="negotiation"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Covenant Tax Rule', value: 'Taxed as Wages', statute: 'ITEPA 2003 s.225' },
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
                  Common Law &amp; ITEPA 2003 s.225
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Are restrictive covenants in a settlement agreement enforceable?
              </h2>
              <p className="text-[14px] text-ink mb-4 leading-relaxed">
                Under UK employment law, restrictive covenants are void by default under the restraint of trade doctrine. They only hold if your employer proves they protect a legitimate business interest and go no further than reasonably necessary. Under Section 225 of ITEPA 2003, payments for restrictive covenants are taxed as wages under PAYE and do not qualify for the £30,000 exemption.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Typical Duration</span>
                  <span className="font-bold text-ink text-sm">3 to 12 Months</span>
                  <span className="text-muted text-[11px]">Clauses over 12 months rarely hold</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legitimate Interests</span>
                  <span className="font-bold text-ink text-sm">Trade Secrets &amp; Clients</span>
                  <span className="text-muted text-[11px]">Cannot stop fair market competition</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">HMRC Tax Treatment</span>
                  <span className="font-bold text-ink text-sm">Taxed as Wages (PAYE)</span>
                  <span className="text-muted text-[11px]">Subject to tax and NI under s.225 ITEPA</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Fee Contribution</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[11px]">Paid on completion under s.203(3)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statutes: <strong>ERA 1996 s.203 &amp; ITEPA 2003 s.225</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Check my draft clauses →
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
              <p className="text-[15px] font-semibold text-ink mb-3">Six key rules on restrictive covenants</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Post-termination restrictions are void by default unless your employer proves a legitimate business interest.',
                  'Your employer cannot add new restrictive covenants without separate valuable consideration.',
                  'Payments for restrictive covenants are taxed as wages under Section 225 of ITEPA 2003, outside the £30,000 exemption.',
                  'Confidentiality clauses cannot stop you from whistleblowing under Section 43J of the Employment Rights Act 1996.',
                  'An SRA-regulated solicitor can negotiate to remove, shorten, or narrow broad restrictions.',
                  'Employers standardly contribute £350 to £500+ plus VAT toward independent legal advice upon completion under Section 203.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-[15px] text-ink leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 1: THE FOUR TYPES OF RESTRICTIVE COVENANTS */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What are the four types of restrictive covenants?</h2>
            <p className="guide-body mb-4">
              In a draft settlement agreement, restrictive covenants usually appear under &quot;Post-Termination Restrictions&quot; or &quot;Continuing Obligations&quot;. Employers use them to protect commercial interests after you leave.
            </p>
            <p className="guide-body mb-4">
              UK agreements typically include four types of restrictions:
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">1. Non-compete clauses</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  Non-compete clauses stop you from joining or starting a rival business. Courts scrutinise them closely because they restrict your right to earn a living. Restrictions over 6 to 12 months rarely hold.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">2. Non-solicitation clauses</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  These clauses stop you from contacting former clients, customers, or suppliers to win their business. Courts are more likely to uphold them if they only cover clients you personally worked with in your final 12 months.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">3. Non-dealing clauses</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  Non-dealing goes further than non-solicitation. It stops you from working with former clients even if they contact you first. Employers must show a strong commercial connection to justify this restriction.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">4. Non-poaching clauses</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  These clauses stop you from hiring or recruiting former colleagues. Enforceable non-poaching terms usually apply only to senior managers or key technical staff, not the whole workforce.
                </p>
              </div>
            </div>

            <p className="guide-body mb-4">
              Before agreeing to any terms, check whether the draft simply repeats your existing employment contract or adds broader restrictions.
            </p>
          </div>
        </section>

        {/* SECTION 2: ENFORCEABILITY AND THE RESTRAINT OF TRADE DOCTRINE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Are restrictive covenants enforceable in the UK?</h2>
            <p className="guide-body mb-4">
              Under English common law, any term that stops someone from freely working in their trade is void by default. This is the doctrine of restraint of trade.
            </p>
            <p className="guide-body mb-4">
              To enforce a restrictive covenant in court, your employer must pass two tests:
            </p>

            <div className="bg-white p-5 rounded-xl border border-rule mb-6 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Test 1: Legitimate Business Interest</strong>
                  <p className="text-muted text-[14px] leading-relaxed m-0">Your employer must prove they are protecting genuine trade secrets, confidential IP, client goodwill, or workforce stability. They cannot use a covenant simply to block ordinary market competition.</p>
                </div>
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Test 2: Reasonable Scope and Duration</strong>
                  <p className="text-muted text-[14px] leading-relaxed m-0">The restriction must go no further than reasonably necessary. A two-year UK-wide ban for a business that only operates in Manchester will almost certainly fail as unreasonable.</p>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">The Supreme Court ruling in Tillman v Egon Zehnder Ltd</h3>
            <p className="guide-body mb-4">
              In{' '}
              <a
                href="https://www.supremecourt.uk/cases/uksc-2017-0177.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Tillman v Egon Zehnder Ltd [2019] UKSC 32
              </a>
              , the UK Supreme Court clarified how courts handle overly wide clauses.
            </p>
            <p className="guide-body mb-4">
              Under the &quot;blue pencil&quot; rule, a judge can only delete unreasonable words if the remaining clause still makes sense without changing the contract&apos;s character. Courts will not rewrite a defective covenant. If a restriction is drafted too broadly, the whole clause can fail.
            </p>
          </div>
        </section>

        {/* SECTION 3: CAN AN EMPLOYER ADD NEW RESTRICTIONS? */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Can my employer add new restrictive covenants?</h2>
            <p className="guide-body mb-4">
              Some draft settlement agreements introduce new 6-month or 12-month non-compete clauses that were not in your original employment contract. This often happens during redundancy or restructuring.
            </p>
            <p className="guide-body mb-4">
              Your employer cannot force you to accept new restrictions. Under English contract law, a new obligation requires separate consideration.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Option A: Keep only your existing contract terms</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  Your independent solicitor can propose sticking strictly to the restrictions already in your employment contract. Employers often drop new covenants when challenged if their main aim is waiving employment tribunal claims.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Option B: Seek financial compensation for new restrictions</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  If your employer insists on a new non-compete, your solicitor can ask for higher compensation to reflect that restriction. Staying out of your sector for 6 months has a real financial cost.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Option C: Narrow the duration and scope</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  Your solicitor can propose targeted edits, such as reducing 12 months to 3 months, narrowing a nationwide restriction, or adding carve-outs for specific non-competing roles.
                </p>
              </div>
            </div>

            {/* Interactive Scanner */}
            <div className="mt-8 pt-8 border-t border-rule">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Interactive Tool
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Free &amp; Confidential
                </span>
              </div>
              <h3 className="font-semibold text-ink text-base mb-2">
                Check your restrictive covenants in 30 seconds
              </h3>
              <p className="text-[14px] text-muted leading-relaxed mb-4">
                Paste your draft post-termination restrictions below to check non-compete durations, spot missing garden leave offsets, and review against Tillman v Egon Zehnder.
              </p>
              <RestrictiveCovenantScanner />
            </div>
          </div>
        </section>

        {/* SECTION 4: THE HMRC SECTION 225 TAX TRAP */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does HMRC tax restrictive covenants under Section 225?</h2>
            <p className="guide-body mb-4">
              One common trap in a UK settlement agreement is how HMRC taxes restrictive covenants.
            </p>
            <p className="guide-body mb-4">
              Under Section 403 of ITEPA 2003, genuine compensation for loss of office is usually tax-free up to £30,000. However, restrictive covenants follow a separate tax rule.
            </p>

            <div className="bg-white p-5 rounded-xl border border-rule mb-6 shadow-sm">
              <h3 className="font-semibold text-ink text-base mb-2">Section 225 of ITEPA 2003 (Payments for restrictive undertakings)</h3>
              <p className="text-[14px] text-muted leading-relaxed mb-3">
                Under Sections 225 and 226 of ITEPA 2003, any payment made in return for a restrictive covenant is taxed as wages. It attracts PAYE income tax, employee Class 1 National Insurance, and employer Class 1A National Insurance (15.0% for 2026/27).
              </p>
              <div className="p-3 rounded bg-[#FBF0EE] border border-[#F3C4BC]">
                <strong className="text-[#A8341F] block mb-1">The Risk of Unallocated Payments</strong>
                <p className="text-[#A8341F] text-[14px] leading-relaxed m-0">
                  If an agreement adds or reaffirms restrictive covenants without allocating a specific sum to them, HMRC can challenge the split under EIM03600. HMRC may argue that some or all of your £30,000 tax-free sum was actually paid for the covenants, triggering an unexpected PAYE tax bill.
                </p>
              </div>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">How solicitors protect your £30,000 tax-free exemption</h3>
            <p className="guide-body mb-4">
              To avoid HMRC reclassification, employment solicitors check that the agreement allocates a separate nominal sum specifically for the restrictive covenants.
            </p>
            <p className="guide-body mb-4">
              This is typically £100 to £500, with PAYE income tax and National Insurance deducted on that nominal amount alone. That ring-fences the rest of your compensation under the £30,000 Section 403 exemption.
            </p>
          </div>
        </section>

        {/* SECTION 5: NDAS AND WHISTLEBLOWING RESTRICTIONS */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Can an NDA stop me from whistleblowing?</h2>
            <p className="guide-body mb-4">
              Settlement agreements usually include confidentiality and non-disparagement clauses. These stop you from sharing the settlement terms or making negative statements about your employer.
            </p>
            <p className="guide-body mb-4">
              Commercial confidentiality is lawful, but an employer cannot use an NDA to stop you from reporting illegal acts or regulatory breaches.
            </p>

            <div className="p-4 rounded-xl border border-rule bg-paper mb-6">
              <h3 className="font-semibold text-ink text-sm mb-2">Section 43J of the Employment Rights Act 1996</h3>
              <p className="text-[14px] text-muted leading-relaxed mb-2">
                Under{' '}
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/18/section/43J"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral underline hover:text-ink transition-colors"
                >
                  Section 43J of the Employment Rights Act 1996
                </a>{' '}
                and the Public Interest Disclosure Act 1998, any clause trying to prevent a protected disclosure is void by law.
              </p>
              <p className="text-[14px] text-muted leading-relaxed mb-0">
                You keep the legal right to report criminal acts, legal breaches, miscarriages of justice, or health and safety risks. You can also speak to regulators such as the FCA, SRA, CQC, or HMRC.
              </p>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">Standard permitted disclosures in settlement agreements</h3>
            <p className="guide-body mb-4">
              Your independent solicitor will check that the confidentiality clause lets you speak with:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'Your immediate family, such as your spouse or civil partner, provided they keep it confidential.',
                'Your professional advisers, including your solicitor, accountant, and tax adviser.',
                'HM Revenue and Customs (HMRC) for tax reporting.',
                'Medical professionals or registered counsellors for health support.',
                'Prospective employers, as far as needed to explain your departure within an agreed reference.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="text-coral font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 6: COMPARISON TABLE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How do contract covenants compare to settlement clauses?</h2>
            <p className="guide-body mb-6">
              This table shows the key differences between restrictions in your original contract and those in a draft settlement agreement:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Restriction Element</th>
                    <th className="p-3 font-semibold">Employment Contract</th>
                    <th className="p-3 font-semibold">Draft Settlement Agreement</th>
                    <th className="p-3 font-semibold">Solicitor Review Focus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Legal Status</td>
                    <td className="p-3">Agreed when joining</td>
                    <td className="p-3">Re-affirmed or newly proposed</td>
                    <td className="p-3">Keep existing terms or seek extra compensation</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Consideration</td>
                    <td className="p-3">Salary and benefits</td>
                    <td className="p-3">Requires separate taxable sum</td>
                    <td className="p-3">Allocate nominal sum under s.225</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Duration</td>
                    <td className="p-3">Fixed term (e.g. 6 months)</td>
                    <td className="p-3">Sometimes extended</td>
                    <td className="p-3">Shorten term or add garden leave offset</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Scope of Restraint</td>
                    <td className="p-3">Subject to Tillman test</td>
                    <td className="p-3">May list new sectors</td>
                    <td className="p-3">Add carve-outs for next role</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">HMRC Tax Rule</td>
                    <td className="p-3">Not triggered on exit</td>
                    <td className="p-3">Section 225 PAYE risk</td>
                    <td className="p-3">Ring-fence £30,000 s.403 exemption</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Independent Advice</td>
                    <td className="p-3">Not mandatory</td>
                    <td className="p-3">Mandatory under s.203 ERA 1996</td>
                    <td className="p-3">£350 to £500+ plus VAT contribution on completion</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 7: HOW SOLICITORS NEGOTIATE RESTRICTIVE COVENANTS */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How do solicitors negotiate restrictive covenants?</h2>
            <p className="guide-body mb-4">
              Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is not binding until an independent solicitor advises you on its terms.
            </p>
            <p className="guide-body mb-4">
              During that review, your solicitor will examine each restriction and discuss practical amendments with your employer:
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">1. Clause-by-clause contract comparison</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  Your solicitor compares the draft against your original employment contract. If the settlement adds new restrictions or widens their scope, your solicitor will flag the change.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">2. Garden leave offset</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  If you are placed on garden leave, your solicitor can ask for that time to be deducted from your non-compete period. A 6-month non-compete after 3 months on garden leave would leave 3 months remaining.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">3. Client and role carve-outs</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  If you already have a new role lined up, your solicitor can request wording confirming that specific role will not breach the agreement. This removes ambiguity about your next move.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">4. Mutual non-disparagement</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-0">
                  Agreements routinely bar you from criticising your employer. Your solicitor can ask for a matching clause stopping the company and its senior managers from making disparaging remarks about you.
                </p>
              </div>
            </div>

            <p className="guide-body mb-4">
              Employers standardly contribute £350 to £500+ plus VAT toward your independent legal advice upon completion. Any excess or abortive work is subject to your solicitor engagement terms.
            </p>
          </div>
        </section>

        {/* SECTION 8: STEP BY STEP CHECKLIST */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What should I check before signing restrictive covenants?</h2>
            <p className="guide-body mb-6">
              Work through these practical checks when reviewing post-termination restrictions in a draft agreement:
            </p>
            <ol className="space-y-4">
              {[
                'Find your original employment contract and check which restrictive covenants already apply.',
                'Compare your contract against the draft settlement agreement to spot any new or wider terms.',
                'Check whether the draft allocates a separate nominal sum for restrictive covenants under Section 225 of ITEPA 2003.',
                'Confirm the confidentiality clause allows disclosures to family, professional advisers, and regulators under Section 43J.',
                'Instruct an SRA-regulated employment solicitor to review the draft, using the standard employer fee contribution.',
                'Use the free calculator to check your statutory baseline alongside any post-termination restrictions.',
              ].map((step, idx) => (
                <li key={step} className="flex items-start gap-3 text-sm text-ink">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-coral/10 text-coral font-semibold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-[15px] text-ink leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* SECTION 9: FAQS */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-6">Frequently asked questions</h2>
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
                  href: '/settlement-agreement-review/',
                  title: 'Settlement Agreement Review',
                  description: 'Check your written clauses for improper terms, restrictive covenants, and tax traps.',
                  tag: 'Review Tool',
                },
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your offer against 2026 statutory redundancy and notice caps.',
                  tag: 'Calculator',
                },
                {
                  href: '/settlement-agreement-tax-calculator/',
                  title: 'Settlement Agreement Tax Calculator',
                  description: 'Calculate tax-free vs taxable breakdown, £30,000 exemption, and legal fees.',
                  tag: 'Tax Tool',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How settlement talks work, without prejudice rules, and legal fee contributions.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/settlement-agreement-reference/',
                  title: 'Settlement Agreement Reference Rules & Clauses',
                  description: 'Agreed reference rights, model clause wording, oral inquiry traps, and career protection.',
                  tag: 'Career Protection',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax-Free £30,000 Settlement Exemption',
                  description: 'HMRC rules governing tax exemptions on termination payments under s.403.',
                  tag: 'Tax Rules',
                },
              ]}
            />
          </div>
        </section>

        {/* BOTTOM CTA */}
        <section className="relative overflow-hidden py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Check where your settlement agreement clauses stand
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mx-auto mb-6">
              See your calculated statutory baseline, check your restrictive covenants, and prepare clear questions for an independent SRA-regulated solicitor.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/" className="btn-accent text-sm inline-block">
                Check my offer now →
              </Link>
              <Link href="/settlement-agreement-review/" className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition-colors">
                Check my draft clauses →
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
