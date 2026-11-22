import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import RelatedArticles from '@/components/RelatedArticles'
import ReviewCallout from '@/components/ReviewCallout'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  title: 'What Is a Fair Settlement Agreement? | SettlementCheck',
  description:
    "Is your employer's settlement agreement fair? Understand the £751 weekly cap, tax rules, and warning signs for low settlement offers. Free UK check.",
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/what-is-a-fair-settlement-agreement/',
  },
  openGraph: {
    title: 'What Is a Fair Settlement Agreement? | SettlementCheck',
    description:
      "Is your employer's settlement agreement fair? Understand the £751 weekly cap, tax rules, and warning signs for low settlement offers. Free UK check.",
    url: 'https://settlementcheck.co.uk/guides/what-is-a-fair-settlement-agreement/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'How long do I have to decide on a settlement agreement?',
    a: 'Paragraph 12 of ACAS Code of Practice 4 recommends at least 10 calendar days as general guidance to consider a written agreement. However, 10 days is not a binding statutory condition under ERA 1996 s.203(3). Under English contract law (Routledge v Grant), an employer can withdraw an unaccepted offer before acceptance, so seek independent legal advice before any deadline passes.',
  },
  {
    q: 'Does a settlement agreement stop me claiming discrimination?',
    a: 'It can, provided the agreement specifically identifies the discrimination claim and you receive independent legal advice on it. A generic clause referring to "all claims" may not validly waive a specific statutory claim. Confirm with your solicitor which claims are named before signing.',
  },
  {
    q: 'Can I negotiate after I have already been made redundant?',
    a: 'Yes. Statutory redundancy pay is a starting baseline rather than the final limit. If there were procedural flaws in consultation or selection, an independent solicitor can help you assess whether to propose a higher ex-gratia figure.',
  },
  {
    q: 'What happens to my tribunal claim if I sign?',
    a: 'Signing a valid settlement agreement permanently waives the specific claims named in the contract. You cannot later bring those claims to an employment tribunal. That is why independent advice from an SRA-regulated solicitor is a legal requirement under ERA 1996 s.203.',
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
  headline: 'What Is a Fair Settlement Agreement in the UK? How to Know Whether Your Offer Is Genuinely Fair',
  url: 'https://settlementcheck.co.uk/guides/what-is-a-fair-settlement-agreement/',
  datePublished: '2026-05-21',
  dateModified: '2026-05-21',
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M10 2L18 17H2L10 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
    </svg>
  )
}

export default function WhatIsAFairSettlementAgreementGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleSchema) }} />
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Settlement agreements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              What Is a Fair Settlement Agreement in the UK?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 4
            </p>
            <p className="sc-lead leading-relaxed">
              Reading a draft settlement agreement for the first time? In 2026, your calculated statutory baseline includes notice pay, accrued holiday, and redundancy capped at £751 per week (SI 2026/310). Check your baseline in 60 seconds with no email required, then review the terms with an independent solicitor.
            </p>
          </div>
        </section>

        {/* Embedded Calculator Immediately Below Hero */}
        <section className="bg-card pt-10 pb-4">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's figure against your calculated statutory baseline and typical 1 to 3 months gross commercial ranges."
              disputeType="redundancy"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Exemption', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={45000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Statutory Quick Answer Callout */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  April 2026 Benchmarks
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                What makes a settlement agreement offer fair in the UK?
              </h2>
              <p className="text-[14px] text-ink mb-4 leading-relaxed">
                A fair settlement agreement exceeds your calculated statutory baseline. In 2026, that baseline covers statutory redundancy capped at £751 per week (SI 2026/310), contractual notice pay, and accrued holiday. Employers also standardly add an ex-gratia payment and contribute £350 to £500+ plus VAT toward your legal advice upon completion under ERA 1996 s.203(3).
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Calculated Statutory Baseline</span>
                  <span className="font-bold text-ink text-sm">Redundancy + Notice Pay</span>
                  <span className="text-muted text-[11px]">Protected by ERA 1996 ss.86 &amp; 162</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Commercial Ex-Gratia Uplift</span>
                  <span className="font-bold text-ink text-sm">1 to 3 Months Gross</span>
                  <span className="text-muted text-[11px]">Compensates for waiving claims</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax-Free Exemption</span>
                  <span className="font-bold text-ink text-sm">First £30,000 Tax-Free</span>
                  <span className="text-muted text-[11px]">ITEPA 2003 Section 403</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Fee Contribution</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[11px]">Paid on completion (excess subject to terms)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statute: <strong>Employment Rights Act 1996 s.203 &amp; SI 2026/310</strong>
                </span>
                <Link href="/calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                  Check my offer now →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* What a settlement agreement is */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What is a settlement agreement and why is it offered?</h2>
            <p className="guide-body mb-4">
              A settlement agreement is a private contract between you and your employer. In exchange for an agreed payment, you waive your right to bring named claims to an employment tribunal.
            </p>
            <p className="guide-body mb-4">
              Pre-termination discussions are often protected under s.111A ERA 1996 or without prejudice legal privilege. However, s.111A only shields ordinary unfair dismissal talks and does not cover discrimination, whistleblowing, or improper behaviour.
            </p>
            <p className="guide-body mb-6">
              Employers standardly contribute £350 to £500+ plus VAT toward your independent legal advice upon completion. Any excess or abortive work is subject to your solicitor&apos;s engagement terms.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">What You Typically Receive</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Statutory redundancy, notice pay (or garden leave), and untaken holiday.</li>
                  <li>An ex-gratia termination payment and an agreed job reference.</li>
                  <li>Employer contribution toward independent SRA-regulated legal advice.</li>
                </ul>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">What You Typically Agree To</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Waiving named statutory and contractual employment claims.</li>
                  <li>Confidentiality over the agreement terms and exit circumstances.</li>
                  <li>Reaffirming or updating post-termination non-compete restrictions.</li>
                </ul>
              </div>
            </div>

            <ReviewCallout
              title="Already holding a draft agreement?"
              description="Compare your draft terms against April 2026 statutory rates, £30,000 tax exemption rules, and legal fee standards before speaking to a solicitor."
              ctaText="Check my offer now →"
              badge="April 2026 Statutory Check"
            />
          </div>
        </section>

        {/* Legal validity conditions */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What makes a settlement agreement legally valid?</h2>
            <p className="guide-body mb-6">
              A settlement agreement is only binding if all five statutory conditions under ERA 1996 s.203(3) are met:
            </p>
            <ul className="flex flex-col gap-4">
              {[
                { title: 'It must be in writing', body: 'An oral agreement cannot validly waive statutory employment tribunal claims.' },
                { title: 'It must identify the specific claims being waived', body: 'A generic phrase covering "all claims" is not enough to waive specific statutory rights such as discrimination.' },
                { title: 'You must receive independent legal advice', body: 'A qualified, insured adviser must explain the terms and effect of the agreement before you sign.' },
                { title: 'The agreement must identify your legal adviser', body: 'The contract must name your solicitor or adviser and confirm that independent advice was given.' },
                { title: 'The adviser must be qualified and insured', body: 'Your adviser must hold professional indemnity insurance and be authorised, such as an SRA-regulated solicitor.' },
              ].map(({ title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-0.5">{title}</p>
                    <p className="guide-body">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What counts as a fair amount */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What counts as a fair settlement amount?</h2>
            <p className="guide-body mb-6">
              Fairness is measured in pounds, not verbal assurances. Most packages have two parts: your calculated statutory baseline and any commercial ex-gratia uplift.
            </p>

            {/* Calculated statutory baseline */}
            <h3 className="text-base font-semibold text-ink mb-3">Calculated statutory baseline (subject to eligibility)</h3>
            <p className="guide-body mb-4">
              Your baseline covers statutory redundancy pay (subject to 2 years&apos; service and s.141 ERA 1996 suitable alternative employment rules), notice pay (absent summary dismissal for gross misconduct under <em>Boston Deep Sea Fishing v Ansell</em>), and accrued holiday pay.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <p className="text-[14px] font-semibold text-ink mb-3">Example: Sarah, age 38, 8 years service, earning £32,000 per year (£615/week)</p>
              <div className="flex flex-col gap-2">
                {[
                  ['Statutory redundancy', '8 years x 1 week (age 22-40) x £615 = £4,920'],
                  ['Notice pay (4 weeks contracted)', '4 x £615 = £2,460'],
                  ['Holiday (5 weeks accrued)', '5 x £615 = £3,075'],
                  ['Calculated statutory baseline', '£10,455'],
                ].map(([label, value], i) => (
                  <div key={label} className={`flex justify-between text-sm ${i === 3 ? 'border-t border-rule pt-2 font-semibold text-ink' : 'text-muted'}`}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[14px] text-muted mt-3">Sarah earns £615/week, below the £751 cap, so her actual weekly pay is used.</p>
            </div>

            {/* Multiplier table */}
            <h3 className="text-base font-semibold text-ink mb-3">Illustrative commercial ranges above the baseline</h3>
            <p className="guide-body mb-4">
              Offers above your calculated statutory baseline depend on your bargaining position and the strength of any potential legal claims.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Illustrative range</th>
                    <th className="text-left px-4 py-3 font-medium">Typical context</th>
                    <th className="text-left px-4 py-3 font-medium">For Sarah (£10,455 baseline)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1.0x baseline', 'Statutory entitlements only, with no ex-gratia uplift.', '£10,455'],
                    ['1.5x to 2.5x', 'Standard commercial range to resolve exit cleanly.', '£15,682 to £26,137'],
                    ['2.5x to 4.0x', 'Disputed dismissal process or procedural flaws.', '£26,137 to £41,820'],
                    ['4.0x or higher', 'Credible discrimination or whistleblowing element.', '£41,820+'],
                  ].map(([mult, meaning, example], i) => (
                    <tr key={mult} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{mult}</td>
                      <td className="px-4 py-3 text-ink">{meaning}</td>
                      <td className="px-4 py-3 text-ink">{example}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* What raises the multiplier */}
            <h3 className="text-base font-semibold text-ink mb-3">What factors can increase an offer?</h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Discrimination claims',
                  body: 'If your exit involves age, sex, race, disability, or pregnancy, tribunal compensation is not subject to the statutory unfair dismissal cap.',
                },
                {
                  title: 'Whistleblowing',
                  body: 'Dismissal linked to a protected public interest disclosure carries uncapped compensation under ERA 1996 and sits outside s.111A confidentiality.',
                },
                {
                  title: 'Procedural flaws in dismissal or redundancy',
                  body: 'Where an employer skips consultation or fair selection, unfair dismissal exposure rises up to the lower of £123,543 or 52 weeks\' pay (ERA 1996 s.124).',
                },
                {
                  title: 'Long service (10 or more years)',
                  body: 'Long-serving staff carry a higher statutory redundancy baseline and longer notice periods, which raises the starting figure.',
                },
                {
                  title: 'Senior roles and non-compete restrictions',
                  body: 'Because statutory redundancy is capped at £751/week, senior earners often look to ex-gratia notice, bonus, or non-compete terms.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-ink text-[15px] mb-1">{title}</p>
                    <p className="guide-body">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to calculate the statutory minimum */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How do you calculate your statutory redundancy baseline?</h2>
            <p className="guide-body mb-6">
              Statutory redundancy is calculated in four steps, subject to 2 years&apos; continuous service and eligibility under s.141 ERA 1996:
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Find your weekly pay (capped at £751)',
                  body: 'Divide your gross annual salary by 52 and cap it at £751 per week under April 2026 limits (SI 2026/310, ERA 1996 s.227).',
                },
                {
                  n: 2,
                  title: 'Apply the age multiplier to each year of service',
                  body: 'Count 0.5 weeks per year under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over.',
                },
                {
                  n: 3,
                  title: 'Cap qualifying service at 20 years',
                  body: 'Count complete years of service only, up to a maximum of 20 years under ERA 1996 s.162.',
                },
                {
                  n: 4,
                  title: 'Add notice pay and accrued holiday pay',
                  body: 'Add your contractual notice pay (or garden leave) and any untaken holiday. These sit separately from statutory redundancy.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">{title}</p>
                    <p className="guide-body">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tax treatment */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does tax affect what you actually receive?</h2>
            <p className="guide-body mb-4">
              Your headline settlement figure and your net take-home pay are different. How each component is labelled determines whether it is taxed as wages.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Payment type</th>
                    <th className="text-left px-4 py-3 font-medium">Tax treatment</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory source</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Statutory redundancy pay', 'Tax-free within £30,000 combined limit', 'ITEPA 2003 s.403'],
                    ['Ex-gratia compensation', 'Tax-free within £30,000 combined limit', 'ITEPA 2003 s.403'],
                    ['PILON & garden leave pay', 'Always taxed as wages (PAYE & NIC)', 'ITEPA 2003 s.402D'],
                    ['Accrued holiday pay', 'Taxed as wages (PAYE & NIC)', 'Standard employment income'],
                    ['Amount above £30,000 limit', 'Taxed as earnings at your marginal rate', 'ITEPA 2003 s.403'],
                  ].map(([type, treatment, source], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{type}</td>
                      <td className="px-4 py-3 text-ink">{treatment}</td>
                      <td className="px-4 py-3 text-muted text-xs">{source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[14px] text-muted">
              Payment in lieu of notice (PILON) and garden leave are always taxed as wages under ITEPA 2003 s.402D. They sit outside the £30,000 exemption.
            </p>
          </div>
        </section>

        {/* Red flags */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What warning signs suggest an offer needs closer review?</h2>
            <ul className="flex flex-col gap-4">
              {[
                'The offer matches your statutory baseline with zero ex-gratia uplift. You would be waiving tribunal rights without receiving anything above statutory entitlements.',
                'You were given fewer than 10 calendar days to decide. ACAS Code of Practice 4 recommends at least 10 days as guidance, though an employer can revoke an unaccepted offer at common law (Routledge v Grant).',
                'The draft gives a single lump sum with no itemised breakdown. Without separate figures for notice, holiday, and compensation, you cannot verify tax or statutory totals.',
                'Potential claims are omitted from the waiver schedule. If disputed events occurred, a generic waiver may leave both sides uncertain about what is settled.',
                'New non-compete restrictions are added without separate consideration. Extending restrictive covenants can limit your next role unless compensated.',
                'The legal fee contribution is missing or below market norms. Employers standardly contribute £350 to £500+ plus VAT upon completion, with excess or abortive work subject to solicitor engagement terms.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <WarningIcon />
                  <span className="guide-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What to do if low */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What can you do if an offer feels too low?</h2>
            <ol className="flex flex-col gap-6">
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Calculate your statutory baseline</p>
                  <p className="guide-body">
                    Use our free{' '}
                    <Link href="/calculator/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      Settlement Agreement Calculator
                    </Link>{' '}
                    or check statutory limits in our{' '}
                    <Link href="/redundancy-calculator/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      Redundancy Calculator
                    </Link>{' '}
                    and{' '}
                    <Link href="/guides/settlement-agreement-acas-calculations/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      ACAS-based calculations guide
                    </Link>.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Note any relevant workplace context</p>
                  <p className="guide-body">
                    Gather dates, emails, and notes on consultation steps, notice periods, unpaid bonuses, or protected characteristics. Clear facts help your solicitor assess your position.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Weigh up counter-proposal risks first</p>
                  <p className="guide-body">
                    Under contract law (<em>Hyde v Wrench</em>), making a counter-offer rejects the opening offer. Review{' '}
                    <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      how settlement negotiations work
                    </Link>{' '}
                    before replying.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">4</span>
                <div>
                  <p className="text-[15px] font-semibold text-ink mb-1">Instruct an independent SRA-regulated solicitor</p>
                  <p className="guide-body">
                    You have the right to choose your own adviser rather than your employer&apos;s suggestion. Read{' '}
                    <Link href="/guides/employer-recommended-solicitor/" className="text-coral underline underline-offset-2 hover:text-ink font-medium">
                      do you have to use your employer&apos;s solicitor?
                    </Link>
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-3">
              Check where your offer stands
            </h2>
            <p className="text-white/75 text-[15px] leading-relaxed mb-6">
              See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/calculator/" className="btn-accent">
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

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Calculations"
              items={[
                {
                  href: '/guides/is-my-settlement-offer-fair/',
                  title: 'Is My Settlement Agreement Offer Fair?',
                  description: 'Compare your payout against April 2026 statutory caps and commercial ranges.',
                  tag: 'Fairness',
                },
                {
                  href: '/guides/settlement-agreement-acas-calculations/',
                  title: 'ACAS-Based Settlement Calculations',
                  description: 'Learn the statutory formulas behind the £751 weekly cap, service tiers, and PILON.',
                  tag: 'Calculations',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Understand without prejudice rules, tax splits, and how to prepare for talks.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/pressured-to-sign/',
                  title: 'Pressured to Sign Quickly? Your Rights',
                  description: 'How the ACAS 10-day guidance and common law deadlines work in practice.',
                  tag: 'Rights',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens If You Do Not Sign?',
                  description: 'Workplace processes and tribunal alternatives if an agreement is not signed.',
                  tag: 'Your Options',
                },
                {
                  href: '/guides/average-settlement-agreement-payout-uk/',
                  title: 'Average Settlement Agreement Payouts UK (2026)',
                  description: 'Typical UK settlement payout ranges and how statutory baselines are calculated.',
                  tag: 'Benchmarks',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities &amp; Official References</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/162" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 162 (Statutory redundancy formula &amp; multipliers based on age and service)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 227 (Statutory maximum weekly pay limit)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (Compensatory award statutory cap for unfair dismissal)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 termination payment exemption)
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/code-of-practice-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Code of Practice on Settlement Agreements (Code of Practice 4)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent educational tool and calculation service, not a law firm. The information provided in this guide is for general informational purposes only and does not constitute legal advice. Always obtain independent advice from an SRA-regulated solicitor before signing.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
