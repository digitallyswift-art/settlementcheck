import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Protected Conversations & Without Prejudice UK | Section 111A Guide',
  description:
    'UK employee guide to Section 111A protected conversations and Without Prejudice rules. Learn your rights, improper behaviour limits, and 2026 statutory rates.',
  alternates: {
    canonical: '/guides/protected-conversations-without-prejudice/',
  },
  openGraph: {
    title: 'Protected Conversations & Without Prejudice UK | Section 111A Guide',
    description:
      'UK employee guide to Section 111A protected conversations and Without Prejudice rules. Learn your rights, improper behaviour limits, and 2026 statutory rates.',
    url: '/guides/protected-conversations-without-prejudice/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protected Conversations & Without Prejudice UK | Section 111A Guide',
    description:
      'UK employee guide to Section 111A protected conversations and Without Prejudice rules. Learn your rights, improper behaviour limits, and 2026 statutory rates.',
  },
}

const FAQS = [
  {
    q: 'Can my employer hold a protected conversation out of the blue?',
    a: 'Yes. Under Section 111A of the Employment Rights Act 1996, an employer can initiate confidential exit discussions without any pre-existing dispute, disciplinary issue, or performance process.',
  },
  {
    q: 'What is the difference between Section 111A and Without Prejudice?',
    a: 'Without Prejudice is a common law rule that requires an existing dispute and covers most claims, including discrimination. Section 111A is statutory, requires no dispute, but protects talks only against ordinary unfair dismissal.',
  },
  {
    q: 'Can a protected conversation be used as evidence in an employment tribunal?',
    a: 'Not in an ordinary unfair dismissal claim, provided both parties behave properly. However, discussions can be admitted if the employer acts improperly or if the claim involves discrimination, whistleblowing, or breach of contract.',
  },
  {
    q: 'How long do I have to consider a settlement agreement offer?',
    a: 'Under Paragraph 12 of the ACAS Code of Practice 4, employers must allow a reasonable period of time. ACAS recommends a minimum benchmark of 10 calendar days to review the written terms and take independent legal advice.',
  },
  {
    q: 'What counts as improper behaviour by an employer under Section 111A(4)?',
    a: 'Improper behaviour includes bullying, harassment, aggressive ultimatums, or stating you will be dismissed if you do not sign before any formal disciplinary process has taken place. If proven, the tribunal can admit the discussion.',
  },
  {
    q: 'Who pays for the independent legal advice on a settlement agreement?',
    a: 'Your employer pays. Under Section 203 of the Employment Rights Act 1996, independent advice is mandatory to make the agreement legally binding. Employers typically contribute £350 to £750 plus VAT directly to your solicitor.',
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
  headline: 'Protected Conversations and Without Prejudice: The UK Employee Guide (Section 111A)',
  url: 'https://settlementcheck.co.uk/guides/protected-conversations-without-prejudice/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-09-20',
  dateModified: '2026-09-20',
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
    '@id': 'https://settlementcheck.co.uk/guides/protected-conversations-without-prejudice/',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M10 3L2 17H18L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function ProtectedConversationsGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Nav />
      <main>
        {/* ── HERO ──────────────────────────────────────────────── */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Protected Conversations</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Section 111A ERA 1996 &amp; Employee Rights</p>
            <h1 className="sc-h1 mb-5">
              Protected Conversations and Without Prejudice: The UK Employee Guide
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; ACAS Code 4)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: September 2026</span>
            </div>
            <p className="sc-lead">
              A protected conversation under Section 111A of the Employment Rights Act 1996 allows an employer to propose a confidential exit package even when no legal dispute exists. This statutory confidentiality shields discussions strictly from ordinary unfair dismissal claims. It does not apply to discrimination, whistleblowing, or breach of contract, and fails entirely if the employer engages in improper behaviour.
            </p>
          </div>
        </section>

        {/* ── CORE FACTS CALLOUT ───────────────────────────────── */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Core rules every employee must know</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Section 111A allows employers to start exit talks without any prior disciplinary or capability process.',
                  'Confidentiality only covers ordinary unfair dismissal claims. It offers no protection against discrimination or whistleblowing.',
                  'Under the ACAS Code of Practice 4, employees should be allowed at least 10 calendar days to consider written terms.',
                  'Employers lose statutory protection if they engage in improper behaviour, such as ultimatums or threats of dismissal.',
                  'For 2026, the statutory weekly pay cap is £751 in Great Britain (£783 in Northern Ireland) under SI 2026/310.',
                  'Your employer covers your independent legal advice fees, usually paying £350 to £750 plus VAT directly to your solicitor.',
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

        {/* ── SECTION 1: WHAT IS A PROTECTED CONVERSATION ──────── */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What is a protected conversation under Section 111A?</h2>
            <p className="sc-body mb-4">
              A protected conversation is a statutory procedure under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 111A of the Employment Rights Act 1996
              </a>
              . The legislation terms these discussions &quot;pre-termination negotiations&quot;.
            </p>
            <p className="sc-body mb-4">
              The rule allows an employer to raise the topic of ending your employment under an agreed financial exit. They do not need to follow formal capability or disciplinary stages first.
            </p>
            <p className="sc-body mb-4">
              Before Section 111A came into force, employers could only discuss settlement terms off the record if a formal legal dispute already existed. Section 111A removed that requirement for ordinary unfair dismissal scenarios.
            </p>
            <p className="sc-body mb-4">
              If negotiations proceed in good faith, neither side can disclose the conversation during an employment tribunal claim for ordinary unfair dismissal under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/94"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 94 of the Employment Rights Act 1996
              </a>
              .
            </p>
          </div>
        </section>

        {/* ── SECTION 2: COMPARISON TABLE ─────────────────────── */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Section 111A vs Common Law Without Prejudice</h2>
            <p className="sc-body mb-6">
              Managers and HR teams frequently confuse Section 111A pre-termination talks with common law Without Prejudice. The two concepts have fundamental differences:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Key Feature</th>
                    <th className="p-3 font-semibold">Section 111A Protected Conversation</th>
                    <th className="p-3 font-semibold">Common Law Without Prejudice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Legal source</td>
                    <td className="p-3">Statute (Section 111A ERA 1996)</td>
                    <td className="p-3">Common law court decisions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Prior dispute required?</td>
                    <td className="p-3">No. Can be initiated at any point.</td>
                    <td className="p-3">Yes. Requires an active legal dispute.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Claims covered</td>
                    <td className="p-3">Ordinary unfair dismissal only</td>
                    <td className="p-3">Broad claims (discrimination, contract)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Unprotected claims</td>
                    <td className="p-3">Discrimination, whistleblowing, breach of contract</td>
                    <td className="p-3">Unambiguous impropriety (perjury, fraud)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Loss of secrecy</td>
                    <td className="p-3">Improper behaviour (Section 111A(4))</td>
                    <td className="p-3">Fraud, blackmail, extreme bad faith</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-rule bg-white p-4">
              <p className="sc-body text-xs leading-relaxed text-muted">
                <strong className="text-ink">Why this distinction matters:</strong> If your employer labels an unexpected meeting &quot;Without Prejudice&quot; without any ongoing grievance or disciplinary dispute, that label is legally invalid. The talk can only be protected under Section 111A, meaning it provides zero confidentiality for discrimination or whistleblowing issues.
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 3: WHERE SECTION 111A OFFERS NO PROTECTION ─ */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Where Section 111A offers NO protection</h2>
            <p className="sc-body mb-6">
              Section 111A provides narrow protection. If your dispute involves claims outside ordinary unfair dismissal, the conversation can be disclosed to an employment tribunal:
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">1. Unlawful Discrimination (Equality Act 2010)</h3>
                <p className="sc-body text-sm mb-2">
                  Section 111A does not apply to claims under the{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2010/15/contents"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Equality Act 2010
                  </a>
                  . If you experience mistreatment related to age, sex, disability, race, religion, sexual orientation, pregnancy, or maternity, the conversation is admissible as evidence.
                </p>
                <p className="sc-body text-xs text-muted">
                  Unlike unfair dismissal awards, compensation for unlawful discrimination under Section 124 of the Equality Act 2010 is completely uncapped. Tribunals also award separate sums for injury to feelings under the Vento guidelines.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">2. Whistleblowing (Protected Disclosures)</h3>
                <p className="sc-body text-sm mb-2">
                  Under Sections 43A to 43L of the Employment Rights Act 1996, workers who expose regulatory failures, safety risks, or illegal activity are protected whistleblowers.
                </p>
                <p className="sc-body text-xs text-muted">
                  If an employer opens exit negotiations after you disclose protected concerns, Section 111A confidentiality does not apply. Whistleblowing awards at tribunal are also uncapped.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">3. Automatically Unfair Dismissals</h3>
                <p className="sc-body text-sm mb-2">
                  The statute does not protect conversations where dismissal relates to trade union activities, family leave rights, statutory health and safety duties, or asserting statutory wage rights.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">4. Breach of Contract &amp; Wrongful Dismissal</h3>
                <p className="sc-body text-sm">
                  Section 111A does not cover disputes about unpaid contractual notice pay, outstanding bonuses, or contractual benefit violations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: IMPROPER BEHAVIOUR & ACAS 10-DAY RULE ── */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Improper behaviour and the ACAS 10-day rule</h2>
            <p className="sc-body mb-4">
              Even in ordinary unfair dismissal discussions, an employer loses statutory protection if they behave improperly. Under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 111A(4) of the Employment Rights Act 1996
              </a>
              , an employment tribunal can lift confidentiality if an employer acts improperly.
            </p>
            <p className="sc-body mb-4">
              The{' '}
              <a
                href="https://www.acas.org.uk/code-of-practice-settlement-agreements"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                ACAS Code of Practice 4 on Settlement Agreements
              </a>{' '}
              identifies clear examples of improper behaviour:
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6 space-y-3">
              {[
                'Bullying, aggressive pressure, or intimidation during discussions.',
                'Presenting unyielding ultimatums with short expiry windows.',
                'Threatening dismissal before any formal performance or disciplinary process has taken place.',
                'Refusing the employee reasonable time to take independent legal advice.',
              ].map((text) => (
                <div key={text} className="flex items-start gap-3">
                  <AlertIcon />
                  <span className="sc-body text-sm">{text}</span>
                </div>
              ))}
            </div>

            {/* ACAS 10-Day Callout */}
            <div className="rounded-xl border border-coral/30 bg-coral/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-coral">ACAS Statutory Benchmark</span>
              </div>
              <h3 className="font-serif text-[18px] font-[460] text-ink mb-2">The 10 Calendar Day Consideration Period</h3>
              <p className="sc-body text-sm mb-3">
                Paragraph 12 of ACAS Code of Practice 4 states that parties should be allowed a reasonable period of time to consider an offer. As a general rule, a minimum period of <strong>10 calendar days</strong> should be provided to review the formal written terms and obtain independent legal advice.
              </p>
              <p className="sc-body text-xs text-muted">
                If your employer gives you 24 or 48 hours to sign, you can write back citing Paragraph 12 of the ACAS Code of Practice. For practical guidance, read our guide on{' '}
                <Link href="/guides/pressured-to-sign/" className="text-coral underline hover:text-ink">
                  what to do when pressured to sign a settlement agreement
                </Link>
                .
              </p>
            </div>
          </div>
        </section>

        {/* ── SECTION 5: 2026 STATUTORY LIMITS TABLE ──────────── */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Current 2026 statutory rates and compensation caps</h2>
            <p className="sc-body mb-4">
              To judge whether a settlement offer is fair, you must benchmark it against the statutory compensation you would receive at an employment tribunal.
            </p>
            <p className="sc-body mb-6">
              Under the{' '}
              <a
                href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
              </a>
              , the following statutory limits apply:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-paper mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper-2 border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Statutory Award</th>
                    <th className="p-3 font-semibold">Great Britain (2026 Cap)</th>
                    <th className="p-3 font-semibold">Northern Ireland (2026 Cap)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Weekly pay cap</td>
                    <td className="p-3 font-semibold text-ink">£751</td>
                    <td className="p-3 font-semibold text-ink">£783</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Max statutory redundancy pay</td>
                    <td className="p-3">£22,530 (20 yrs × 1.5 × £751)</td>
                    <td className="p-3">£23,490 (20 yrs × 1.5 × £783)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Max unfair dismissal compensation</td>
                    <td className="p-3">£123,543 (or 52 weeks gross pay)</td>
                    <td className="p-3">£123,543 (or 52 weeks gross pay)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Discrimination claims</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Whistleblowing claims</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="sc-body text-sm mb-6">
              Use our interactive calculator to verify whether your offer meets or falls below these statutory standards:
            </p>

            <div className="p-5 rounded-xl border border-coral/30 bg-paper-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-serif text-[17px] font-[460] text-ink">Check your settlement offer now</p>
                <p className="text-xs text-muted">Free, confidential estimate in under 2 minutes. No contact info needed.</p>
              </div>
              <Link href="/calculator/" className="btn-accent text-xs whitespace-nowrap">
                Calculate my estimate →
              </Link>
            </div>
          </div>
        </section>

        {/* ── SECTION 6: TAX RULES & LEGAL FEES ───────────────── */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax rules: £30,000 exemption and legal fees</h2>
            <p className="sc-body mb-4">
              Understanding how your payment is taxed ensures you know your exact net take-home figure. Different payment elements have distinct tax treatments under UK law:
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">The £30,000 Tax-Free Limit (ITEPA 2003 s.403)</h3>
                <p className="sc-body text-sm">
                  Under{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2003/1/section/403"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Section 403 of ITEPA 2003
                  </a>
                  , the first £30,000 of genuine compensation for loss of employment is completely tax-free. This applies to statutory redundancy and ex-gratia payments. Sums above £30,000 are subject to Income Tax. Read our complete guide to the{' '}
                  <Link href="/guides/tax-free-settlement-30000/" className="text-coral underline hover:text-ink">
                    £30,000 tax-free settlement rule
                  </Link>
                  .
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">Notice Pay Is Always Taxable (ITEPA 2003 s.402D)</h3>
                <p className="sc-body text-sm">
                  Under{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Section 402D of ITEPA 2003
                  </a>
                  , Post-Employment Notice Pay (PILON) cannot be paid tax-free. Your employer must deduct Income Tax and Class 1 National Insurance contributions from your notice pay.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">Your Employer Covers Legal Fees (HMRC Concession)</h3>
                <p className="sc-body text-sm mb-2">
                  Under{' '}
                  <a
                    href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    Section 203(3) of the Employment Rights Act 1996
                  </a>
                  , you must receive independent legal advice for a settlement agreement to be binding.
                </p>
                <p className="sc-body text-sm">
                  Your employer will pay your solicitor directly, typically contributing £350 to £750 plus VAT. Under HMRC guidance{' '}
                  <a
                    href="https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim13750"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-coral underline hover:text-ink transition-colors"
                  >
                    EIM13750
                  </a>
                  , this contribution is tax-free and does not count toward your £30,000 allowance. You can appoint any qualified solicitor you choose. Learn more in our guide on{' '}
                  <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline hover:text-ink">
                    whether you must use the solicitor your employer recommends
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 7: WHAT TO SAY SCRIPT ────────────────────── */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What to say during a protected conversation</h2>
            <p className="sc-body mb-6">
              When an employer opens an unexpected exit discussion, you do not have to negotiate or make decisions in the room. Use these verbatim scripts:
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">Step 1: In the meeting</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Stay calm and request the written terms</p>
                <blockquote className="border-l-2 border-coral pl-4 py-1 text-sm text-ink/80 italic">
                  &quot;Thank you for setting out the company&apos;s position. I was not expecting this discussion today. Please provide the complete proposal and draft settlement agreement in writing so I can review it carefully.&quot;
                </blockquote>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">Step 2: If pressed for an immediate answer</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Cite the ACAS Code of Practice</p>
                <blockquote className="border-l-2 border-coral pl-4 py-1 text-sm text-ink/80 italic">
                  &quot;Under the ACAS Code of Practice 4, employees are entitled to a reasonable period of time to consider a settlement proposal. I will take the document home, review it, and take independent legal advice.&quot;
                </blockquote>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">Step 3: Clarify immediate working status</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Confirm duties while you consider</p>
                <blockquote className="border-l-2 border-coral pl-4 py-1 text-sm text-ink/80 italic">
                  &quot;Am I expected to carry on with my normal duties while considering this proposal, or is the company placing me on paid leave?&quot;
                </blockquote>
              </div>
            </div>

            <p className="sc-body text-xs text-muted">
              <strong>Tip:</strong> Keep comprehensive notes immediately after the discussion. Note the time, attendees, and any statements made. Save these notes to your personal phone or personal email, not your employer&apos;s IT system.
            </p>
          </div>
        </section>

        {/* ── SECTION 8: THREE PATHS FORWARD ──────────────────── */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Your options after the meeting</h2>
            <p className="sc-body mb-6">
              Once you have received the written settlement agreement, you have three primary courses of action:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="rounded-xl border border-rule bg-paper p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral block mb-1">Option 1</span>
                  <h3 className="font-serif text-[16px] font-[460] text-ink mb-2">Accept the Offer</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    If the financial sum is fair, notice is honoured, and an agreed reference is included, accepting provides a clean exit. Your employer covers the legal fees.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral block mb-1">Option 2</span>
                  <h3 className="font-serif text-[16px] font-[460] text-ink mb-2">Negotiate Terms</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    First offers are usually opening positions. You can negotiate for an increased ex-gratia payout or extended notice. Read our guide on{' '}
                    <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline hover:text-ink">
                      how to negotiate a settlement agreement
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-coral block mb-1">Option 3</span>
                  <h3 className="font-serif text-[16px] font-[460] text-ink mb-2">Reject the Offer</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    You can refuse to sign. Your employment continues, and your employer must follow a fair formal procedure if they wish to dismiss you. Read{' '}
                    <Link href="/guides/what-happens-if-you-do-not-sign/" className="text-coral underline hover:text-ink">
                      what happens if you do not sign
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 9: FAQS ─────────────────────────────────── */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* ── RELATED ARTICLES ────────────────────────────────── */}
        <section className="py-10 bg-white border-b border-rule">
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
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'How to handle short deadlines and identify Section 111A improper behaviour.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Tactics and counter-offer strategies to improve your financial exit terms.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax on Settlement Agreements: £30,000 Rule',
                  description: 'Learn which elements of your settlement qualify for tax-free status.',
                  tag: 'Tax Rules',
                },
              ]}
            />
          </div>
        </section>

        {/* ── BOTTOM CTA ──────────────────────────────────────── */}
        <section className="relative overflow-hidden py-14 bg-ink text-white">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Find out where your settlement offer stands
            </h2>
            <p className="sc-lead text-white/80 max-w-xl mx-auto mb-6 text-sm">
              Use our free calculator to see if your offer meets statutory standards. Your employer covers the cost of independent legal advice.
            </p>
            <Link href="/calculator/" className="btn-accent text-sm inline-block">
              Calculate my estimate →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
