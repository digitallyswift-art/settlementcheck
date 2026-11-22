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
  title: 'Settlement Agreement Instead of a PIP 2026 | SettlementCheck',
  description:
    'Offered a settlement instead of a PIP? Check April 2026 rates (£751/wk), Section 111A limits, tax splits, and employer legal fee contributions.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-instead-of-pip/',
  },
  openGraph: {
    title: 'Settlement Agreement Instead of a PIP 2026 | SettlementCheck',
    description:
      'Offered a settlement instead of a PIP? Check April 2026 rates (£751/wk), Section 111A limits, tax splits, and employer legal fee contributions.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-instead-of-pip/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Instead of a PIP 2026 | SettlementCheck',
    description:
      'Offered a settlement instead of a PIP? Check April 2026 rates (£751/wk), Section 111A limits, tax splits, and employer legal fee contributions.',
  },
}

const FAQS = [
  {
    q: 'Can my employer dismiss me immediately if I reject the settlement agreement?',
    a: 'No. An employer cannot lawfully dismiss you on the spot simply because you decline a settlement offer. If you decline, your employment continues. Your employer must then follow a fair capability procedure under the ACAS Code of Practice 1 before considering dismissal.',
  },
  {
    q: 'What happens if I have less than two years of continuous service?',
    a: 'Under Section 108 of the Employment Rights Act 1996, you generally need two years of continuous service to bring an ordinary unfair dismissal claim. With under two years of service, your employer can dismiss you with notice without a full capability process. However, the two-year rule does not apply to unlawful discrimination under the Equality Act 2010 or whistleblowing.',
  },
  {
    q: 'What does a typical PIP settlement package include?',
    a: 'A typical package includes full contractual notice pay, accrued holiday pay, and one to three months of gross salary as tax-free ex-gratia compensation. This reflects the management time and expense your employer saves by avoiding a formal capability process. Where disability or discrimination is involved, solicitors often assess higher figures.',
  },
  {
    q: 'How are solicitor fees funded for a PIP settlement agreement?',
    a: 'Employers standardly offer a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion to satisfy Section 203(3) ERA 1996. There is no statutory obligation on an employer to fund legal advice. If the agreement does not complete or work exceeds the cap, additional fees depend on your solicitor\'s terms of engagement.',
  },
  {
    q: 'What happens to my job reference if I sign a settlement agreement?',
    a: 'Many settlement agreements include an agreed reference clause attached as a schedule. Once signed, your employer is contractually bound to provide that wording to future employers and must follow any agreed non-derogatory clauses.',
  },
  {
    q: 'Will signing a settlement agreement stop me from claiming benefits?',
    a: 'A settlement agreement does not prevent you from claiming statutory benefits such as Universal Credit or Jobseeker\'s Allowance. The Department for Work and Pensions treats a departure under a settlement agreement as a mutual exit rather than voluntary resignation, provided the agreement settled a workplace dispute.',
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
  headline: 'Settlement Agreement Instead of a PIP: The UK Employee Guide (2026 Rules)',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-instead-of-pip/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-03',
  dateModified: '2026-10-03',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-instead-of-pip/',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function PipSettlementGuide() {
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
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Performance Plans</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Capability, Section 111A &amp; Payout Rights</p>
            <h1 className="sc-h1 mb-4">
              Settlement Agreement Instead of a PIP: The UK Employee Guide
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 1 &amp; 4
            </p>
            <p className="sc-lead leading-relaxed">
              Offered a settlement agreement instead of a Performance Improvement Plan (PIP)? To your employer, it is a commercial trade to avoid months of capability reviews and tribunal risk. Check your statutory baseline in 60 seconds with no email required, see how the offer breaks down, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Micro-Tool (Immediately below Hero) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your PIP exit offer compare to the statutory baseline?"
              subtitle="Compare your employer's opening figure against your calculated statutory baseline and typical 1 to 3 months gross commercial ranges."
              disputeType="disciplinary_pip"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'ACAS Review Window', value: '10 Calendar Days', statute: 'ACAS Code 4' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={55000}
              initialYears={3}
              initialAge={39}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  Section 111A ERA 1996 Rules
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Why is a settlement agreement offered instead of a PIP?
              </h2>
              <p className="text-[14px] text-ink mb-4 leading-relaxed">
                Employers often propose exits under Section 111A of the Employment Rights Act 1996 to avoid prolonged capability management. A typical package includes contractual notice, accrued holiday, and ex-gratia pay, plus a capped fee contribution (£350 to £500+ plus VAT upon completion) toward independent legal advice under Section 203.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Typical Exit Package</span>
                  <span className="font-bold text-ink text-sm">Notice + 1 to 3 Months Pay</span>
                  <span className="text-muted text-[11px]">Commercial tax-free ex-gratia range</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Conversation Status</span>
                  <span className="font-bold text-ink text-sm">Protected under s.111A</span>
                  <span className="text-muted text-[11px]">Ordinary unfair dismissal only</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Consideration Window</span>
                  <span className="font-bold text-ink text-sm">10 Calendar Days</span>
                  <span className="text-muted text-[11px]">Guidance under ACAS Code 4</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Employer Legal Contribution</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[11px]">Capped fee paid upon completion</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.111A &amp; s.203</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Review my draft agreement →
                  </Link>
                  <Link href="/calculator/?reason=pip" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Check my offer now →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CORE FACTS CALLOUT */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-[14px] font-semibold text-ink mb-3">Core rules every employee should know</p>
              <ul className="flex flex-col gap-3">
                {[
                  'A PIP offer alongside a settlement proposal is usually a pre-termination negotiation under Section 111A ERA 1996.',
                  'Employers propose an exit to avoid months of management time, grievance delays, and tribunal exposure.',
                  'ACAS Code of Practice 4 recommends 10 calendar days as general guidance to consider written terms, though it is not a binding legal lock.',
                  'If performance dips relate to mental health, neurodiversity, or disability, employers have a duty to make reasonable adjustments under Equality Act 2010 s.20.',
                  'Genuine compensation for loss of employment is tax-free up to £30,000 under ITEPA 2003 s.403, while notice pay is taxed as wages.',
                  'Employers standardly provide a capped contribution (£350 to £500+ plus VAT) directly to your solicitor upon completion; excess or abortive costs depend on your solicitor\'s terms.',
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

        {/* SECTION 1: WHY EMPLOYERS OFFER AN EXIT */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. Why is your employer offering a settlement instead of a PIP?</h2>
            <p className="sc-body mb-4">
              Running a formal capability process takes significant management time and HR resource. To dismiss someone fairly for performance, an employer must follow a documented process.
            </p>
            <p className="sc-body mb-4">
              Under the{' '}
              <a
                href="https://www.acas.org.uk/code-of-practice-disciplinary-and-grievance-procedures"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                ACAS Code of Practice 1 on Disciplinary and Grievance Procedures
              </a>
              , your employer is expected to meet clear procedural standards:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'Set realistic, measurable targets with objective assessment criteria.',
                'Provide adequate training, resources, and regular review meetings.',
                'Give reasonable timescales to demonstrate sustained improvement.',
                'Issue formal written warnings before considering dismissal.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="text-coral font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              Employees placed on a PIP often raise formal grievances about workload or lack of support. Under ACAS standards, investigating a grievance usually pauses the capability process.
            </p>
            <p className="sc-body mb-4">
              Offering a settlement agreement under{' '}
              <a
                href="https://www.legislation.gov.uk/ukpga/1996/18/section/203"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Section 203 of the Employment Rights Act 1996
              </a>{' '}
              lets your employer buy commercial certainty. A signed agreement ends the process quickly and waives your right to bring an employment tribunal claim.
            </p>

            {/* Interactive Calculator Hook for PIP exits */}
            <div className="my-6 p-5 rounded-xl bg-white border border-rule shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-coral font-bold block mb-1">
                  April 2026 Statutory Check
                </span>
                <strong className="text-base text-ink block mb-1">
                  Compare your PIP exit offer against statutory baselines
                </strong>
                <p className="text-[14px] text-muted m-0">
                  Model contractual notice pay, statutory baselines, and tax-free ex-gratia ranges.
                </p>
              </div>
              <Link
                href="/pip-settlement-calculator/"
                className="px-4 py-2.5 bg-coral hover:bg-coral-ink text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm text-center cursor-pointer"
              >
                Check my offer now →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 2: PROTECTED TALKS VS WITHOUT PREJUDICE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. Is a PIP settlement talk really off the record?</h2>
            <p className="sc-body mb-6">
              When HR invites you to discuss an exit instead of a PIP, they usually rely on one of two confidentiality rules. Understanding the limits of each rule protects your position:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Legal Feature</th>
                    <th className="p-3 font-semibold">Section 111A Protected Conversation</th>
                    <th className="p-3 font-semibold">Common Law Without Prejudice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Legal source</td>
                    <td className="p-3">Section 111A ERA 1996</td>
                    <td className="p-3">Common law court decisions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Prior dispute required?</td>
                    <td className="p-3">No. Talks can start at any time.</td>
                    <td className="p-3">Yes. Requires an active legal dispute.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Protected claims</td>
                    <td className="p-3">Ordinary unfair dismissal only</td>
                    <td className="p-3">Most tribunal causes of action</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Unprotected claims</td>
                    <td className="p-3">Discrimination, whistleblowing, breach of contract</td>
                    <td className="p-3">Fraud, blackmail, unambiguous impropriety</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Loss of secrecy</td>
                    <td className="p-3">Improper behaviour (Section 111A(4))</td>
                    <td className="p-3">Severe abuse of privilege</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-coral">Improper behaviour lifts secrecy</p>
              <p className="text-[14px] text-muted leading-relaxed">
                Under Section 111A(4) ERA 1996, a tribunal can admit exit talks if your employer behaves improperly. Examples include threatening dismissal before any capability process starts, or setting an unreasonable ultimatum.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: ACAS 10-DAY RULE */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. How long do you have to consider a PIP settlement offer?</h2>
            <p className="sc-body mb-4">
              Employers sometimes attach short deadlines of 24 or 48 hours to an initial exit proposal. Knowing how ACAS guidance interacts with contract law helps you avoid rushed decisions.
            </p>

            <div className="rounded-xl border border-coral/30 bg-coral/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-coral">ACAS Code 4 Guidance vs Contract Law</span>
              </div>
              <h3 className="font-serif text-[18px] font-[460] text-ink mb-2">The 10 Calendar Day Consideration Period</h3>
              <p className="sc-body mb-3">
                Paragraph 12 of ACAS Code of Practice 4 recommends a minimum of <strong>10 calendar days</strong> as general guidance to consider formal written terms and take legal advice. This is guidance rather than a strict binding legal right.
              </p>
              <p className="text-[14px] text-muted leading-relaxed">
                Under English contract law (<em>Routledge v Grant</em>), an employer can withdraw an unaccepted offer at any time before it is signed. Making a counter-offer also legally rejects and extinguishes the original offer (<em>Hyde v Wrench</em>), so consult a solicitor before any deadline passes.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: EQUALITY ACT AND HEALTH */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">4. When does a PIP raise Equality Act 2010 disability risks?</h2>
            <p className="sc-body mb-6">
              Workplace performance dips often link to underlying health issues or neurodiversity. Under Section 6 of the Equality Act 2010, a disability is a physical or mental impairment with a substantial, long-term adverse effect on day-to-day activities:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">Duty to Make Adjustments (s.20)</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-2">
                  Employers must make reasonable adjustments for qualifying conditions such as ADHD, depression, anxiety, autism, or chronic fatigue.
                </p>
                <p className="text-[14px] text-muted leading-relaxed">
                  Starting a PIP without exploring adjustments or occupational health input can raise discrimination issues under Section 15.
                </p>
              </div>

              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-2">Uncapped Tribunal Exposure (s.124)</h3>
                <p className="text-[14px] text-muted leading-relaxed mb-2">
                  Unlike ordinary unfair dismissal, compensation for unlawful discrimination under Section 124 is uncapped and includes Vento injury to feelings awards.
                </p>
                <p className="text-[14px] text-muted leading-relaxed">
                  Where health or neurodiversity is a factor, solicitors assess this exposure when reviewing an exit package.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: STATUTORY RATES 2026 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">5. What are the 2026 statutory caps and baseline figures?</h2>
            <p className="sc-body mb-4">
              Solicitors benchmark settlement offers against tribunal award limits under the{' '}
              <a
                href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
              </a>
              . Note that statutory redundancy pay applies only in genuine redundancy and can be forfeited under s.141 ERA 1996 if suitable alternative employment is unreasonably refused:
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
                    <td className="p-3 font-medium text-ink">Max basic award / statutory redundancy (s.141 eligible)</td>
                    <td className="p-3">£22,530 (20 yrs × 1.5 × £751)</td>
                    <td className="p-3">£23,490 (20 yrs × 1.5 × £783)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Max unfair dismissal compensatory award</td>
                    <td className="p-3">£123,543 (or 52 weeks gross pay)</td>
                    <td className="p-3">£123,543 (or 52 weeks gross pay)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Discrimination claims</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                    <td className="p-3 font-semibold text-coral">Uncapped</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Tax-free termination exemption</td>
                    <td className="p-3">First £30,000 (ITEPA 2003 s.403)</td>
                    <td className="p-3">First £30,000 (ITEPA 2003 s.403)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-xl border border-coral/30 bg-paper-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-serif text-[17px] font-[460] text-ink">Check where your PIP offer stands</p>
                <p className="text-[14px] text-muted">Free, confidential estimate in 60 seconds. No email required.</p>
              </div>
              <Link href="/calculator/?reason=performance" className="btn-accent text-xs whitespace-nowrap">
                Check my offer now →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: FAIR PACKAGE COMPONENTS */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">6. What does a fair PIP settlement package usually include?</h2>
            <p className="sc-body mb-6">
              An opening offer made instead of a PIP often starts with contractual notice and a small ex-gratia sum. Solicitors typically review these eight components in a draft agreement:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  title: '1. Notice Pay in Full',
                  desc: 'Paid as PILON or served on garden leave. Notice pay is always taxed as wages under ITEPA 2003 s.402D (PENP).',
                },
                {
                  title: '2. Ex-Gratia Compensation',
                  desc: 'Commercial sum (often 1 to 3 months gross pay, not a statutory right) reflecting capability time saved. Tax-free up to £30,000 under s.403.',
                },
                {
                  title: '3. Accrued Holiday Pay',
                  desc: 'All accrued, untaken statutory and contractual holiday up to the exit date, taxed as wages.',
                },
                {
                  title: '4. Pro-Rata Bonus or Commission',
                  desc: 'Review whether pro-rata bonus or commission earned before termination can be included.',
                },
                {
                  title: '5. Pension Contributions',
                  desc: 'Employer pension contributions maintained during garden leave or paid as an equivalent sum.',
                },
                {
                  title: '6. Legal Fee Contribution',
                  desc: 'Customary employer contribution of £350 to £500+ plus VAT paid directly to your solicitor upon completion (tax-free under EIM13750).',
                },
                {
                  title: '7. Agreed Reference & Non-Disparagement',
                  desc: 'Binding reference wording attached as a schedule alongside mutual non-derogatory clauses.',
                },
                {
                  title: '8. Non-Compete & Restrictions',
                  desc: 'Check whether post-termination non-compete or non-solicitation covenants are restated, narrowed, or waived.',
                },
              ].map((comp) => (
                <div key={comp.title} className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <p className="font-serif text-[15px] font-[460] text-ink mb-1">{comp.title}</p>
                  <p className="text-[14px] text-muted leading-relaxed">{comp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: PIP VS SETTLEMENT COMPARISON */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">7. How does staying on a PIP compare with an agreed settlement?</h2>
            <p className="sc-body mb-6">
              Deciding whether to complete a PIP or agree a financial exit involves clear trade-offs. Compare both paths side by side:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Factor</th>
                    <th className="p-3 font-semibold">Continuing the PIP</th>
                    <th className="p-3 font-semibold">Accepting a Settlement Agreement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Financial Outcome</td>
                    <td className="p-3">Salary during PIP, with risk of dismissal on notice at the end.</td>
                    <td className="p-3">Notice pay (taxed under PENP) plus negotiated ex-gratia pay (tax-free up to £30,000 under s.403).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Day-to-Day Pressure</td>
                    <td className="p-3">Ongoing performance reviews, formal targets, and scrutiny.</td>
                    <td className="p-3">Defined exit date, possible garden leave, and space to look for a new role.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Job Reference</td>
                    <td className="p-3">Capability outcome recorded on your HR file.</td>
                    <td className="p-3">Agreed factual reference attached as a schedule.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Certainty</td>
                    <td className="p-3">Uncertain outcome; formal capability process continues to a review decision.</td>
                    <td className="p-3">Certainty over agreed exit terms, payment dates, and departure date.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[14px] text-muted leading-relaxed">
              Each route carries different financial, health, and career trade-offs to weigh up with an independent solicitor.
            </p>
          </div>
        </section>

        {/* SECTION 8: SOLICITOR INTAKE AGENDA */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">8. What should you prepare before speaking to a solicitor?</h2>
            <p className="sc-body mb-6">
              Channelling formal financial proposals through an independent SRA-regulated solicitor protects your legal privilege. Prepare these points before your review call:
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">1. Written Terms &amp; ACAS Timeline</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Keeping a clear written record</p>
                <p className="text-[14px] text-muted leading-relaxed m-0">
                  Request proposed terms in writing so an independent solicitor can review them. ACAS Code 4 para 12 recommends 10 calendar days as general guidance, though under English contract law (<em>Routledge v Grant</em>) an employer can withdraw an unaccepted offer before signature. Consult a solicitor before any stated deadline passes.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">2. Section 111A Scope Limits</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Checking what confidentiality covers</p>
                <p className="text-[14px] text-muted leading-relaxed m-0">
                  Section 111A ERA 1996 confidentiality applies strictly to ordinary unfair dismissal claims. It does not cover discrimination (Equality Act 2010), whistleblowing (s.43B ERA 1996), breach of contract, or improper behaviour under s.111A(4).
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">3. Key Figures &amp; Privilege Notice</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Points to review with your instructed solicitor</p>
                <div className="border-l-2 border-coral pl-4 py-2 text-xs text-ink/80 font-mono leading-relaxed bg-white p-3 rounded border border-rule">
                  SOLICITOR REVIEW CHECKLIST (SECTION 203(3) ERA 1996)<br /><br />
                  1. Contractual Notice (PILON / Garden Leave): Verify notice pay and taxation under s.402D ITEPA 2003.<br />
                  2. Ex-Gratia Sum: Review the offer against capability costs avoided, structured within the £30,000 limit under s.403.<br />
                  3. Accrued Holiday &amp; Covenants: Confirm untaken leave pay and any non-compete clauses.<br />
                  4. Agreed Reference: Check wording for the attached reference schedule.<br />
                  5. Legal Fee Contribution: Confirm the capped contribution (£350 to £500+ plus VAT upon completion; excess or abortive work depends on engagement terms).<br /><br />
                  Privilege Notice: Avoid sending unreviewed counter-proposals directly to HR; unreviewed emails can waive legal privilege or extinguish the original offer under Hyde v Wrench.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: STEP-BY-STEP CHECKLIST */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">9. What are the practical steps after receiving a PIP offer?</h2>
            <p className="sc-body mb-6">
              This sequence outlines how employees typically prepare for an independent solicitor consultation:
            </p>

            <ol className="space-y-3 mb-6 pl-1">
              {[
                'Take detailed notes during the meeting and wait to review written terms with an independent solicitor.',
                'Ask for the draft settlement agreement in writing to your personal email address.',
                'Note the ACAS Code 4 10-calendar-day guideline while speaking to a solicitor before any employer deadline expires.',
                'Gather your employment contract, recent appraisals, and relevant HR correspondence.',
                'Compare the opening figure against April 2026 statutory baselines.',
                'Instruct an independent SRA-regulated employment solicitor (employers standardly contribute £350 to £500+ plus VAT upon completion; excess or abortive work depends on engagement terms).',
                'Review notice pay, ex-gratia terms, non-compete clauses, and reference wording with your solicitor.',
                'Sign only once your solicitor completes the statutory adviser certificate under s.203(3) ERA 1996.',
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

        {/* SECTION 10: FAQS */}
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
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/calculator/',
                  title: 'Settlement Agreement Calculator',
                  description: 'Benchmark your offer against April 2026 statutory baselines and notice rules.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign a Settlement Agreement?',
                  description: 'How the ACAS 10-day guideline and Section 111A improper behaviour rules work.',
                  tag: 'Employee Rights',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How UK settlement talks work, tax splits, and legal fee contributions.',
                  tag: 'Negotiation',
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
            <h2 className="font-serif text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2 text-white">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-xl mx-auto mb-6">
              See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculator/?reason=performance" className="btn-accent">
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
        </section>
      </main>
      <Footer />
    </>
  )
}
