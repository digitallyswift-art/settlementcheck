import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'
import { RestrictiveCovenantScanner } from '@/components/RestrictiveCovenantScanner'

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
    a: 'Yes, an employer can propose new restrictive covenants in a settlement agreement. However, under English contract law, you are under no obligation to accept them. Any new restriction requires separate, valuable consideration to be enforceable. If your employer wants to prevent you from working in your industry, an SRA-regulated solicitor can negotiate to remove the clause or demand higher financial compensation for accepting it.',
  },
  {
    q: 'How does HMRC tax payments for restrictive covenants in a settlement agreement?',
    a: 'Under Section 225 of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003), any payment made in return for entering into a restrictive undertaking is taxable as employment earnings. This means it is subject to PAYE income tax and Class 1 National Insurance. It does not qualify for the £30,000 tax-free exemption under Section 403. Settlement agreements must allocate a separate nominal sum, typically £100 to £500, to ensure HMRC does not challenge the tax-free status of the remaining compensation.',
  },
  {
    q: 'Are post-termination non-compete clauses legally enforceable under UK employment law?',
    a: 'In UK employment law, all restrictive covenants are void by default under the doctrine of restraint of trade. A covenant is only enforceable if your employer can prove it protects a legitimate business interest, such as trade secrets or customer connections. The restriction must also go no further than reasonably necessary in duration and geographical reach, as established by the Supreme Court in Tillman v Egon Zehnder Ltd [2019].',
  },
  {
    q: 'Can a settlement agreement prevent me from whistleblowing or speaking to regulators?',
    a: 'No. Under Section 43J of the Employment Rights Act 1996 and the Public Interest Disclosure Act 1998, any clause attempting to prevent an employee from making a protected disclosure is void as a matter of law. You retain the absolute legal right to report criminal acts, regulatory wrongdoing, or health and safety risks to regulators such as the FCA, SRA, CQC, or HMRC, as well as to the police.',
  },
  {
    q: 'Who pays the solicitor fee to review and negotiate my restrictive covenants?',
    a: 'Your employer covers the legal fees for your independent solicitor advice under Section 203 of the Employment Rights Act 1996. Standard employer legal fee contributions typically range between £500 and £1,500 plus VAT. Your solicitor will review every restrictive covenant, ensure tax compliance under Section 225, and negotiate amendments directly with your employer.',
  },
  {
    q: 'Can my solicitor negotiate to remove or reduce restrictive covenants from my settlement agreement?',
    a: 'Yes. Negotiating post-termination restrictions is a standard part of an independent solicitor review. Common amendments include reducing a 12-month non-compete down to 3 or 6 months, ensuring time spent on garden leave is deducted from the restriction period, or agreeing specific carve-outs that allow you to work for non-competing divisions or named companies.',
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
              <span className="text-xs text-ink truncate">Restrictive Covenants</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Non-Compete Clauses, Restraint of Trade &amp; HMRC Section 225</p>
            <h1 className="sc-h1 mb-5">
              Restrictive Covenants in Settlement Agreements
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (ITEPA 2003 s.225 &amp; Supreme Court Precedent)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              When an employer hands you a settlement agreement, the headline payout often hides restrictive covenants in the fine print. These clauses can prevent you from working for competitors, speaking to clients, or hiring former colleagues for months. Understanding your statutory rights under UK employment law and the critical HMRC tax rules helps you protect your career and your money.
            </p>
          </div>
        </section>

        {/* STATUTORY QUICK ANSWER (AEO / FEATURED SNIPPET OPTIMISED) */}
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
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                Under UK employment law, all restrictive covenants are void by default under the doctrine of restraint of trade. They are only enforceable if your employer proves they protect a legitimate business interest and go no further than reasonably necessary. Furthermore, under Section 225 of ITEPA 2003, payments for restrictive covenants are fully taxable under PAYE. They do not qualify for the £30,000 tax-free exemption.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Typical Duration</span>
                  <span className="font-bold text-ink text-sm">3 to 12 Months</span>
                  <span className="text-muted text-[11px]">Clauses over 12 months rarely hold in tribunal</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legitimate Interests</span>
                  <span className="font-bold text-ink text-sm">Trade Secrets &amp; Clients</span>
                  <span className="text-muted text-[11px]">Cannot merely stop fair market competition</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">HMRC Tax Treatment</span>
                  <span className="font-bold text-ink text-sm">Taxable via PAYE</span>
                  <span className="text-muted text-[11px]">Subject to tax and NI under s.225 ITEPA</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Advice Fee</span>
                  <span className="font-bold text-ink text-sm">Employer Pays (£500+ VAT)</span>
                  <span className="text-muted text-[11px]">Mandatory condition under s.203(3)</span>
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
                  'Post-termination restrictions are legally void by default unless your employer proves they protect a legitimate business interest.',
                  'Your employer cannot unilaterally impose new restrictive covenants without giving you separate valuable consideration.',
                  'Payments for agreeing to restrictive covenants are taxable under Section 225 of ITEPA 2003 and do not qualify for the £30,000 tax-free exemption.',
                  'Non-disclosure clauses cannot lawfully gag you from reporting wrongdoing or whistleblowing under Section 43J of the Employment Rights Act 1996.',
                  'An SRA-regulated solicitor can often negotiate to delete, shorten, or narrow aggressive restrictions during settlement discussions.',
                  'Your employer covers the legal fees for your independent solicitor advice (typically £500 to £1,500 plus VAT) under Section 203.',
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

        {/* SECTION 1: THE FOUR TYPES OF RESTRICTIVE COVENANTS */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The four types of restrictive covenants in UK settlement agreements</h2>
            <p className="sc-body mb-4">
              When reviewing a draft settlement agreement, you will often find restrictive covenants placed under headings such as &quot;Post-Termination Restrictions&quot; or &quot;Continuing Obligations&quot;. Employers use these clauses to protect their commercial interests after you leave.
            </p>
            <p className="sc-body mb-4">
              UK employment contracts and settlement agreements typically feature four distinct types of restrictions:
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">1. Non-compete clauses</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  These clauses stop you from working for a competing business or setting up a rival company in direct competition with your former employer. Because non-competes restrict your fundamental right to earn a living, courts scrutinise them heavily. They are rarely upheld if they exceed 6 to 12 months.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">2. Non-solicitation clauses</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  A non-solicitation clause stops you from approaching or contacting former clients, customers, or suppliers to win their business. Courts are more willing to enforce these clauses than non-competes, provided they only cover clients with whom you had personal contact during your final 12 months.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">3. Non-dealing clauses</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Non-dealing clauses go further than non-solicitation. They prohibit you from doing business with former clients even if those clients contact you first without any encouragement. Employers must prove a very close connection to justify this level of restraint.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">4. Non-poaching clauses</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  These restrictions prevent you from hiring, enticing away, or employing former colleagues in your new venture or role. Enforceable non-poaching clauses are typically restricted to senior managers or key technical staff rather than all company personnel.
                </p>
              </div>
            </div>

            <p className="sc-body mb-4">
              Before signing, check whether your settlement agreement simply repeats the clauses in your employment contract, or whether your employer has slipped in broader restrictions.
            </p>
          </div>
        </section>

        {/* SECTION 2: ENFORCEABILITY AND THE RESTRAINT OF TRADE DOCTRINE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Are restrictive covenants enforceable? The restraint of trade doctrine</h2>
            <p className="sc-body mb-4">
              Under English common law, any agreement that restrains an individual from freely exercising their trade or profession is contrary to public policy and void. This is known as the doctrine of restraint of trade.
            </p>
            <p className="sc-body mb-4">
              To enforce a restrictive covenant against you in court, your employer must satisfy two strict legal tests:
            </p>

            <div className="bg-white p-5 rounded-xl border border-rule mb-6 shadow-sm">
              <div className="space-y-3 text-sm">
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Test 1: Legitimate Proprietary Business Interest</strong>
                  <p className="text-muted text-xs m-0">The employer must prove they are protecting genuine trade secrets, confidential intellectual property, customer goodwill, or workforce stability. An employer cannot enforce a clause simply to protect themselves against normal, healthy market competition.</p>
                </div>
                <div className="p-3 rounded bg-paper">
                  <strong className="text-ink block mb-1">Test 2: Reasonableness in Scope and Duration</strong>
                  <p className="text-muted text-xs m-0">The covenant must go no further than reasonably necessary to protect that interest. An agreement that restricts an employee for two years across the whole UK when the employer only operates in Manchester will almost certainly be struck down by a court as unreasonable.</p>
                </div>
              </div>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">The Supreme Court ruling in Tillman v Egon Zehnder Ltd</h3>
            <p className="sc-body mb-4">
              In the landmark authority{' '}
              <a
                href="https://www.supremecourt.uk/cases/uksc-2017-0177.html"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Tillman v Egon Zehnder Ltd [2019] UKSC 32
              </a>
              , the UK Supreme Court clarified how courts handle overly wide restrictive covenants.
            </p>
            <p className="sc-body mb-4">
              Under the &quot;blue pencil&quot; rule, a judge will only sever or delete unreasonable words if the remaining clause makes sense without altering the fundamental character of the contract. Courts will not rewrite a bad covenant for an employer. If a restriction is drafted too broadly, the entire clause fails and becomes unenforceable.
            </p>
          </div>
        </section>

        {/* SECTION 3: CAN AN EMPLOYER ADD NEW RESTRICTIONS? */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Can an employer add new restrictive covenants in a settlement agreement?</h2>
            <p className="sc-body mb-4">
              Many employees discover that their draft settlement agreement introduces new 6-month or 12-month non-compete clauses that never existed in their original employment contract. Employers often attempt to insert these terms during redundancy or workplace restructuring.
            </p>
            <p className="sc-body mb-4">
              Legally, your employer cannot force you to accept new restrictions. Under basic English contract law, a new promise requires new consideration.
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Option A: Reject the new restrictions entirely</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Your independent solicitor can inform the employer that you will only agree to affirm the existing terms of your employment contract. In many cases, employers drop new covenants when challenged because their primary goal is securing the waiver of tribunal claims.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Option B: Demand financial compensation for accepting them</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  If your employer insists on a new non-compete clause, your solicitor can use this demand to push for higher financial compensation. If staying out of your market for 6 months costs you valuable earnings, the settlement sum must compensate you for that commercial sacrifice.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">Option C: Narrow the duration and geographical scope</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Your solicitor can negotiate specific carve-outs. For example, amending a nationwide ban to a 5-mile radius, reducing the duration from 12 months down to 3 months, or exempting specific non-competing divisions or clients.
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
              <p className="sc-body text-xs text-muted mb-4">
                Paste your draft post-termination restrictions below to check non-compete durations, detect missing garden leave offsets, and audit compliance with Supreme Court rules in Tillman v Egon Zehnder.
              </p>
              <RestrictiveCovenantScanner />
            </div>
          </div>
        </section>

        {/* SECTION 4: THE HMRC SECTION 225 TAX TRAP */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The HMRC Section 225 tax trap: Why separate consideration matters</h2>
            <p className="sc-body mb-4">
              One of the most dangerous traps in a UK settlement agreement involves the tax treatment of restrictive covenants under HMRC rules.
            </p>
            <p className="sc-body mb-4">
              Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003), genuine compensation payments for loss of office are free of income tax up to £30,000. Many employees assume this £30,000 exemption covers the entire settlement package.
            </p>
            <p className="sc-body mb-4">
              However, restrictive covenants fall under a completely different statutory tax regime:
            </p>

            <div className="bg-white p-5 rounded-xl border border-rule mb-6 shadow-sm">
              <h3 className="font-semibold text-ink text-base mb-2">Section 225 of ITEPA 2003 (Payments for restrictive undertakings)</h3>
              <p className="sc-body text-xs text-muted mb-3">
                Under Section 225 and Section 226 of ITEPA 2003, any valuable consideration given for entering into or agreeing to a restrictive undertaking is treated as earnings from employment. It is subject to full PAYE income tax, employee Class 1 National Insurance, and employer National Insurance contributions (currently 15.0% for 2026/27).
              </p>
              <div className="p-3 rounded bg-[#FBF0EE] border border-[#F3C4BC]">
                <strong className="text-[#A8341F] block mb-1">The Danger of Commingling Compensation</strong>
                <p className="text-[#A8341F] text-xs m-0">
                  If your settlement agreement introduces or reaffirms restrictive covenants without allocating a specific sum to them, HMRC can challenge the agreement under Employment Income Manual guidance EIM03600. HMRC may claim that a portion - or even the entirety - of your tax-free £30,000 payment was actually consideration for the restrictive covenants. This creates an unexpected PAYE tax bill and penalties.
                </p>
              </div>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">How solicitors protect your £30,000 tax-free exemption</h3>
            <p className="sc-body mb-4">
              To prevent HMRC from reclassifying your tax-free redundancy compensation, experienced employment solicitors ensure that the settlement agreement includes a separate, nominal payment specifically allocated to the restrictive covenants.
            </p>
            <p className="sc-body mb-4">
              This clause typically allocates £100 to £500 as consideration for the post-termination restrictions, with full deduction of PAYE and National Insurance on that nominal sum alone. This creates a clean legal partition, ring-fencing the rest of your compensation under the £30,000 Section 403 tax exemption.
            </p>
          </div>
        </section>

        {/* SECTION 5: NDAS AND WHISTLEBLOWING RESTRICTIONS */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Non-disclosure agreements (NDAs) and whistleblowing limits</h2>
            <p className="sc-body mb-4">
              Settlement agreements routinely contain strict confidentiality clauses and non-disparagement provisions. These prevent employees from discussing the terms of the settlement, the surrounding negotiations, or making negative comments about the company and its directors.
            </p>
            <p className="sc-body mb-4">
              While genuine commercial confidentiality is lawful, employers cannot use a settlement agreement to silence employees regarding illegal acts or regulatory wrongdoing.
            </p>

            <div className="p-4 rounded-xl border border-rule bg-paper mb-6">
              <h3 className="font-semibold text-ink text-sm mb-2">Section 43J of the Employment Rights Act 1996</h3>
              <p className="sc-body text-xs text-muted mb-2">
                Under{' '}
                <a
                  href="https://www.legislation.gov.uk/ukpga/1996/18/section/43J"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-coral underline hover:text-ink transition-colors"
                >
                  Section 43J of the Employment Rights Act 1996
                </a>{' '}
                and the Public Interest Disclosure Act 1998, any contractual provision that attempts to prevent a worker from making a protected disclosure is void as a matter of law.
              </p>
              <p className="sc-body text-xs text-muted mb-0">
                You can never be gagged from reporting criminal acts, failures to comply with legal obligations, miscarriages of justice, or health and safety dangers. You retain the right to speak to statutory regulators such as the Financial Conduct Authority (FCA), Solicitors Regulation Authority (SRA), Care Quality Commission (CQC), or HM Revenue and Customs (HMRC).
              </p>
            </div>

            <h3 className="font-semibold text-ink text-base mb-2">Standard permitted disclosures in settlement agreements</h3>
            <p className="sc-body mb-4">
              Your independent solicitor will check that the confidentiality clause explicitly permits you to discuss the settlement agreement with:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'Your immediate family, such as your spouse or civil partner, provided they keep the details confidential.',
                'Your professional advisers, including your solicitor, accountant, and tax advisers.',
                'HM Revenue and Customs (HMRC) for statutory tax assessment purposes.',
                'Medical professionals or registered counsellors for health support.',
                'Prospective employers, solely to the extent permitted by an agreed reference schedule.',
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
            <h2 className="sc-section-h2 mb-4">Employment contract vs settlement agreement covenants compared</h2>
            <p className="sc-body mb-6">
              This comparison shows the key differences between restrictive covenants in your original contract and those in a proposed settlement agreement:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Restriction Element</th>
                    <th className="p-3 font-semibold">Employment Contract</th>
                    <th className="p-3 font-semibold">Draft Settlement Agreement</th>
                    <th className="p-3 font-semibold">Solicitor Negotiation Strategy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Legal Status</td>
                    <td className="p-3">Agreed upon joining company</td>
                    <td className="p-3">Re-affirmed or newly introduced</td>
                    <td className="p-3">Refuse new covenants or demand compensation</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Consideration</td>
                    <td className="p-3">Salary and benefits package</td>
                    <td className="p-3">Must have separate taxable consideration</td>
                    <td className="p-3">Allocate nominal taxable sum under s.225</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Duration</td>
                    <td className="p-3">Fixed contractual term (e.g. 6m)</td>
                    <td className="p-3">Often extended by employer</td>
                    <td className="p-3">Negotiate reduction or garden leave offset</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Scope of Restraint</td>
                    <td className="p-3">Subject to Tillman reasonableness</td>
                    <td className="p-3">Often adds new competitors or sectors</td>
                    <td className="p-3">Insert specific carve-outs for new roles</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">HMRC Tax Rule</td>
                    <td className="p-3">Not directly relevant on exit</td>
                    <td className="p-3">Section 225 ITEPA taxable risk</td>
                    <td className="p-3">Ring-fence £30,000 statutory tax exemption</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Independent Advice</td>
                    <td className="p-3">Not legally mandatory</td>
                    <td className="p-3">Mandatory under Section 203 ERA 1996</td>
                    <td className="p-3">Employer covers the legal fee (£500+ VAT)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 7: HOW SOLICITORS NEGOTIATE RESTRICTIVE COVENANTS */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How independent solicitors negotiate restrictive covenants</h2>
            <p className="sc-body mb-4">
              Under Section 203 of the Employment Rights Act 1996, you cannot sign a valid settlement agreement without independent legal advice from a qualified adviser, such as an SRA-regulated solicitor.
            </p>
            <p className="sc-body mb-4">
              Your solicitor will examine every post-termination clause and execute tactical negotiations to protect your career:
            </p>

            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">1. Clause-by-clause contract comparison</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  Your solicitor will compare the settlement agreement against your original employment contract. If your employer has added restrictions or widened their scope, your solicitor will flag this immediately and challenge the justification.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">2. Negotiating a garden leave offset</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  If your employer placed you on garden leave prior to departure, your solicitor will ensure that the garden leave period is deducted from any post-termination non-compete. For instance, if you have a 6-month non-compete and spent 3 months on garden leave, your remaining restriction should be reduced to 3 months.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">3. Securing client and geography carve-outs</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  If you have already identified a potential new job, your solicitor can negotiate specific wording confirming that taking that role will not breach the settlement agreement. This eliminates future legal threats and gives you complete peace of mind.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rule bg-paper">
                <h3 className="font-semibold text-ink text-sm mb-1">4. Enforcing reciprocal non-disparagement</h3>
                <p className="sc-body text-xs text-muted mb-0">
                  While employers always include clauses forbidding you from criticising the company, solicitors ensure these obligations are strictly mutual. Your solicitor will add clauses binding the company, its directors, and senior managers from making disparaging remarks about you to prospective employers.
                </p>
              </div>
            </div>

            <p className="sc-body mb-4">
              Remember that your employer covers the legal fees for your independent solicitor advice. Standard employer contributions range between £500 and £1,500 plus VAT, meaning you will not be out of pocket for standard advice.
            </p>
          </div>
        </section>

        {/* SECTION 8: STEP BY STEP CHECKLIST */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Step-by-step checklist if your settlement agreement has restrictive covenants</h2>
            <p className="sc-body mb-6">
              Follow these practical steps when reviewing post-termination restrictions in a draft settlement agreement:
            </p>
            <ol className="space-y-4">
              {[
                'Locate your original employment contract and check what restrictive covenants you originally signed up to.',
                'Compare the original restrictions against the clauses in the draft settlement agreement to identify any new or expanded terms.',
                'Check whether the settlement allocates a separate, nominal taxable payment for restrictive undertakings under Section 225 of ITEPA 2003.',
                'Ensure the confidentiality clause contains standard statutory exceptions for family, professional advisers, and whistleblowing under Section 43J.',
                'Instruct an SRA-regulated employment solicitor to review the agreement. Your employer covers the cost of independent legal advice.',
                'Use our free calculator to check that the overall settlement compensation adequately compensates you for any commercial restraints.',
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

        {/* SECTION 9: FAQS */}
        <section className="py-12 border-b border-rule bg-white">
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
                  description: 'Tactics and counter-offer strategies to improve your financial exit terms.',
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
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw a Settlement Offer?',
                  description: 'Contract rules, counter-offer risks under Hyde v Wrench, and ACAS 10-day limits.',
                  tag: 'Legal Rights',
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
            <p className="sc-lead text-white/80 max-w-xl mx-auto mb-6 text-sm">
              Calculate your statutory baseline, check your restrictive covenants, and get matched with an SRA-regulated solicitor. Your employer covers the cost of independent legal advice.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/" className="btn-accent text-sm inline-block">
                Calculate my estimate →
              </Link>
              <Link href="/settlement-agreement-review/" className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg border border-white/20 hover:bg-white/10 text-white font-semibold text-xs transition-colors">
                Check my draft clauses →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
