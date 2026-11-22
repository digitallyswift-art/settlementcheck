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
  title: 'Settlement Agreement After a Grievance (2026 Rules)',
  description:
    'Offered a settlement agreement after a grievance? Learn s.111A vs Without Prejudice rules, s.27 victimisation rights, and 2026 payout calculations.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-after-grievance/',
  },
  openGraph: {
    title: 'Settlement Agreement After a Grievance (2026 Rules)',
    description:
      'Offered a settlement agreement after a grievance? Learn s.111A vs Without Prejudice rules, s.27 victimisation rights, and 2026 payout calculations.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-after-grievance/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement After a Grievance (2026 Rules)',
    description:
      'Offered a settlement agreement after a grievance? Learn s.111A vs Without Prejudice rules, s.27 victimisation rights, and 2026 payout calculations.',
  },
}

const FAQS = [
  {
    q: 'Why did my employer propose a settlement agreement after I submitted a formal grievance?',
    a: 'Employers often propose settlement agreements to avoid lengthy workplace investigations. Under ACAS Code of Practice 1, handling a grievance requires management time, witness interviews, and formal hearings. An agreed exit under Section 203 ERA 1996 provides both parties with a binding conclusion.',
  },
  {
    q: 'Do I have to accept the settlement agreement or withdraw my grievance?',
    a: 'No. Settlement agreements are voluntary contracts, so you have no legal obligation to accept or withdraw your grievance. If you decline, your employment continues and your employer is expected to conclude your grievance under ACAS Code 1. An unreasonable failure to follow the Code can trigger a tribunal uplift of up to 25% under Section 207A TULRCA 1992.',
  },
  {
    q: 'What happens to my grievance investigation while settlement terms are discussed?',
    a: 'Parties usually agree to pause the grievance timetable or run a twin-track process. In a twin-track process, the formal grievance continues openly while talks proceed confidentially without prejudice. Withdrawing a grievance before an agreement is signed and certified can weaken your procedural position, so discuss timing with your solicitor.',
  },
  {
    q: 'Is a settlement conversation confidential if my grievance involves discrimination or whistleblowing?',
    a: 'No. Section 111A(1) ERA 1996 only protects pre-termination talks in ordinary unfair dismissal claims. It does not cover Equality Act 2010 discrimination, breach of contract, or whistleblowing (s.43B and s.103A ERA 1996). Protection is also lost under s.111A(4) if the employer engages in improper behaviour.',
  },
  {
    q: 'How is a grievance settlement payout calculated under 2026 rules?',
    a: 'A package typically includes contractual notice pay, accrued holiday, and ex-gratia compensation. Genuine non-contractual termination pay (combined with any statutory redundancy pay) is tax-free up to £30,000 under s.403 ITEPA 2003. Discrimination cases may also reflect Ninth Addendum Vento bands (£1,300 to £62,900+) and potential ACAS Code 1 adjustments of up to 25%.',
  },
  {
    q: 'Does my employer contribute to my independent legal fees?',
    a: 'Employers standardly offer a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. While Section 203(3) ERA 1996 requires independent legal advice, there is no statutory duty on an employer to fund it. If the agreement does not complete or costs exceed the cap, any balance depends on your solicitor\'s engagement terms.',
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
  headline: 'Settlement Agreement After Raising a Grievance: UK Employee Rights & Payouts (2026)',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-after-grievance/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-11-08',
  dateModified: '2026-11-08',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-after-grievance/',
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

export default function GrievanceSettlementGuide() {
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
              <span className="text-xs text-ink truncate">Grievance Settlements</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              ACAS Code 1, Section 111A &amp; Payout Rights
            </p>
            <h1 className="sc-h1 mb-4">
              Settlement Agreement After Raising a Grievance: UK Employee Rights &amp; Payouts (2026)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ACAS Code 1 &amp; 4
            </p>
            <p className="sc-lead leading-relaxed">
              Proposed a settlement agreement after raising a formal grievance? To your employer, it is a commercial route to close an internal investigation and limit tribunal risk. Check your statutory baseline in 60 seconds with no email required, see how the offer breaks down, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* INTERACTIVE CALCULATOR CARD (Immediately below Hero) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your grievance offer compare to the statutory baseline?"
              subtitle="Compare your employer's opening figure against your calculated statutory baseline, notice pay, and tax-free ex-gratia ranges."
              disputeType="grievance"
              statutoryPills={[
                { label: 'Weekly Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Shield', value: '£30,000', statute: 'ITEPA 2003 s.403' },
                { label: 'ACAS Code 1 Uplift', value: 'Up to 25%', statute: 'TULRCA 1992 s.207A' },
              ]}
              initialSalary={48000}
              initialYears={4}
              initialAge={36}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* STATUTORY QUICK ANSWER */}
        <section className="py-8 bg-paper border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="bg-white border-2 border-coral/30 rounded-xl p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[11px] font-semibold text-muted">
                  ACAS Code 1 &amp; ERA 1996 Rules
                </span>
              </div>
              <h2 className="text-base font-bold text-ink mb-2">
                Why has my employer proposed a settlement agreement after my grievance?
              </h2>
              <p className="text-[14px] text-ink mb-4 leading-relaxed">
                Employers propose settlements after a grievance to avoid formal investigations, management disruption, and tribunal exposure. You have no legal obligation to accept or withdraw your grievance. Typical packages include contractual notice, accrued holiday, and tax-free ex-gratia compensation.
              </p>

              {/* Structured Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Framework</span>
                  <span className="font-bold text-ink text-sm">ERA 1996 s.203 &amp; s.111A</span>
                  <span className="text-muted text-[11px]">Binding exit waiver rules</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Retaliation Protection</span>
                  <span className="font-bold text-ink text-sm">Equality Act 2010 s.27</span>
                  <span className="text-muted text-[11px]">Victimisation protection</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">ACAS Consideration Window</span>
                  <span className="font-bold text-ink text-sm">10 Calendar Days</span>
                  <span className="text-muted text-[11px]">ACAS Code 4 guidance (not a binding lock)</span>
                </div>
                <div className="flex flex-col gap-0.5 p-2.5 rounded bg-paper">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Employer Legal Contribution</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[11px]">Customary cap upon completion</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rule flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <span className="text-xs text-muted">
                  Primary statutes: <strong>ERA 1996 s.111A &amp; Equality Act 2010 s.27</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  <Link href="/settlement-agreement-review/" className="inline-flex items-center text-xs font-semibold px-2.5 py-1.5 rounded border border-rule hover:bg-paper text-ink transition-colors">
                    Review my draft agreement →
                  </Link>
                  <Link href="/calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
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
                  'Settlement talks do not automatically pause your grievance, and neither process pauses the strict 3-month-less-1-day tribunal time limit.',
                  'Section 111A confidentiality applies strictly to ordinary unfair dismissal. It excludes discrimination, breach of contract, and whistleblowing.',
                  'Raising a discrimination grievance is a protected act under Section 27 Equality Act 2010, shielding you from victimisation from day one.',
                  'ACAS Code 4 recommends 10 calendar days as guidance, but an employer can withdraw an unaccepted offer before signature and a counter-offer can extinguish it.',
                  'An unreasonable failure to follow ACAS Code 1 can trigger a tribunal adjustment of up to 25% under Section 207A TULRCA 1992.',
                  'Ex-gratia termination pay (combined with any statutory redundancy pay) is tax-free up to £30,000 under s.403 ITEPA 2003, while notice pay is taxed as wages.',
                  'Employers customarily contribute £350 to £500+ plus VAT toward legal fees upon completion; excess or abortive costs remain subject to your solicitor\'s terms.',
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

        {/* ARTICLE BODY */}
        <article className="py-12">
          <div className="max-w-2xl mx-auto px-5 flex flex-col gap-10">

            {/* SECTION 1 */}
            <div>
              <h2 className="guide-h2 mb-4">
                1. Why do employers propose settlement agreements after a grievance?
              </h2>
              <p className="sc-body mb-4">
                Lodging a formal grievance triggers procedural expectations under ACAS Code of Practice 1. While breaching the Code is not a standalone claim under Section 207 TULRCA 1992, tribunals take compliance seriously. Employers are expected to appoint an impartial investigator, gather witness evidence, and issue a written outcome.
              </p>
              <p className="sc-body mb-4">
                This process creates real operational friction. Managers spend hours on investigations, internal emails become subject to Data Protection Act requests, and working relationships often strain.
              </p>
              <p className="sc-body mb-4">
                Grievances also rarely restore day-to-day trust. Upholding a grievance means admitting internal failings, while dismissing it can prompt constructive dismissal claims under Section 95(1)(c) ERA 1996 (usually requiring two years&apos; service under s.108, unless a day-one claim applies). Proposing an exit under Section 203 ERA 1996 offers commercial finality.
              </p>
            </div>

            {/* SECTION 2 */}
            <div>
              <h2 className="guide-h2 mb-4">
                2. Do you have to accept the offer or drop your grievance?
              </h2>
              <p className="sc-body mb-4">
                You have no legal obligation to accept a settlement agreement. Nor are you required to withdraw your grievance simply because talks have started.
              </p>
              <p className="sc-body mb-4">
                A settlement agreement is a voluntary contract. Your employer cannot lawfully dismiss you on the spot for declining an offer. If talks end without agreement, your employment continues and your employer is expected to finish the grievance process under ACAS Code 1.
              </p>
              <div className="rounded-xl border border-rule bg-paper p-5 my-4">
                <div className="flex items-start gap-3">
                  <AlertIcon />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-ink">
                      Procedural safeguards: grievance withdrawal, deadlines &amp; offer revocation
                    </h3>
                    <p className="text-[14px] text-muted leading-relaxed">
                      <strong>Grievance withdrawal:</strong> Dropping a grievance before an agreement is signed and certified can weaken your procedural position and affect potential ACAS Code 1 adjustments. Statutory protection against victimisation (s.27 Equality Act 2010) or whistleblowing detriment (s.47B ERA 1996) still covers a protected act already done.
                    </p>
                    <p className="text-[14px] text-muted leading-relaxed">
                      <strong>Offer deadlines and revocation:</strong> ACAS Code 4 recommends 10 calendar days as general guidance. Under English contract law (<em>Routledge v Grant</em>), an employer can withdraw an unaccepted offer before signature, and a counter-offer can extinguish the original offer (<em>Hyde v Wrench</em>). Consult an independent solicitor before a stated deadline passes.
                    </p>
                    <p className="text-[14px] text-muted leading-relaxed">
                      <strong>Tribunal time limits:</strong> Raising a grievance or discussing settlement terms does <strong>not</strong> pause the strict deadline of 3 months less 1 day to start ACAS Early Conciliation.
                    </p>
                  </div>
                </div>
              </div>
              <p className="sc-body mb-4">
                During talks, employees and their solicitors usually consider one of two recognised pathways:
              </p>
              <ul className="list-disc pl-5 sc-body text-sm flex flex-col gap-2 mb-4">
                <li>
                  <strong>Agreed temporary pause:</strong> Both sides agree in writing to pause the grievance timetable for a set period, such as 10 to 14 days. If talks stall, the grievance resumes immediately.
                </li>
                <li>
                  <strong>Twin-track process:</strong> The formal grievance continues openly while settlement talks run on a confidential without prejudice track. This keeps procedural momentum moving.
                </li>
              </ul>
            </div>

            {/* SECTION 3 */}
            <div>
              <h2 className="guide-h2 mb-4">
                3. Is a grievance settlement talk really off the record?
              </h2>
              <p className="sc-body mb-4">
                Employers often invite employees to off-the-record meetings to discuss exit terms. UK law governs these talks under two very different rules, and the difference matters when a grievance is live.
              </p>

              {/* COMPARATIVE TABLE */}
              <div className="overflow-x-auto my-6 border border-rule rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-paper border-b border-rule text-ink font-semibold">
                      <th className="p-3">Legal Dimension</th>
                      <th className="p-3">Section 111A Protected Conversation</th>
                      <th className="p-3">Common Law Without Prejudice</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-muted">
                    <tr>
                      <td className="p-3 font-medium text-ink">Statutory Basis</td>
                      <td className="p-3">Employment Rights Act 1996 s.111A</td>
                      <td className="p-3">Court precedent (Rush &amp; Tompkins)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Existing Dispute Needed?</td>
                      <td className="p-3">No prior dispute needed</td>
                      <td className="p-3">Yes, requires an active legal dispute</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Claims Protected</td>
                      <td className="p-3">Ordinary unfair dismissal only (s.111A(1))</td>
                      <td className="p-3">Wide civil &amp; tribunal causes of action</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Discrimination Protection</td>
                      <td className="p-3 font-semibold text-coral">Excluded (Admissible in tribunal)</td>
                      <td className="p-3">Covered, if genuine settlement effort</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Loss of Protection</td>
                      <td className="p-3">Improper behaviour (s.111A(4))</td>
                      <td className="p-3">Unambiguous impropriety (fraud/abuse)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="sc-h3 mb-3">
                Why Section 111A has strict limits in grievance disputes
              </h3>
              <p className="sc-body mb-4">
                Under Section 111A(1) ERA 1996, statutory confidentiality applies strictly to ordinary unfair dismissal claims. It gives zero protection where a dispute involves Equality Act 2010 discrimination, breach of contract, or automatic unfair dismissal under Section 111A(3) (including whistleblowing under s.43B/s.103A, maternity dismissal under s.99, or health and safety under s.100).
              </p>
              <p className="sc-body mb-4">
                In those claims, statements made in a pre-termination meeting can be shown to a tribunal unless Without Prejudice privilege separately applies. Under Section 111A(4), confidentiality is also lost if either party engages in improper behaviour, such as threatening immediate dismissal or applying undue pressure.
              </p>

              <h3 className="sc-h3 mb-3">
                How Without Prejudice applies after a grievance
              </h3>
              <p className="sc-body mb-4">
                Common law Without Prejudice privilege (<em>Rush &amp; Tompkins Ltd v Greater London Council</em> [1989]) shields genuine attempts to settle an existing dispute, including discrimination and contract claims.
              </p>
              <p className="sc-body mb-4">
                However, raising a grievance does not automatically create an existing legal dispute (<em>BNP Paribas v Mezzotero</em> [2004]), especially before the employer investigates or rejects it. A dispute is more likely once positions are clearly opposed or litigation is contemplated (<em>Framlington Group Ltd v Barnetson</em> [2007]). Simply marking an email &ldquo;Without Prejudice&rdquo; creates no privilege if no real dispute exists, and never protects unambiguous impropriety.
              </p>
              <div className="rounded-xl border border-coral/30 bg-[#FBF0EE] p-4 my-4">
                <p className="text-[14px] text-ink leading-relaxed m-0">
                  <strong>Important Privilege Notice:</strong> Avoid sending unreviewed financial proposals directly to HR. Unreviewed correspondence can waive legal privilege or compromise your negotiating position.
                </p>
              </div>
            </div>

            {/* SECTION 4 */}
            <div>
              <h2 className="guide-h2 mb-4">
                4. How does Section 27 Equality Act 2010 protect against victimisation?
              </h2>
              <p className="sc-body mb-4">
                If your grievance alleges discrimination, harassment, or a failure to make reasonable adjustments, Section 27 of the Equality Act 2010 protects you immediately. Submitting a discrimination grievance is a protected act under Section 27(2).
              </p>
              <p className="sc-body mb-4">
                Your employer cannot lawfully subject you to any detriment because you did a protected act. Unlawful detriments include disciplinary threats, ostracisation, or dismissal threats after your grievance.
              </p>
              <p className="sc-body mb-4">
                Victimisation protection applies from day one of employment with no two-year service requirement. Because tribunal awards for victimisation are uncapped, solicitors factor this carefully when reviewing an offer.
              </p>
            </div>

            {/* SECTION 5 */}
            <div>
              <h2 className="guide-h2 mb-4">
                5. How are grievance settlements calculated under 2026 rules?
              </h2>
              <p className="sc-body mb-4">
                A grievance settlement reflects your contractual entitlements, calculated statutory baselines (subject to eligibility), and the commercial risk your employer wants to resolve.
              </p>
              <p className="sc-body mb-4">
                Under SI 2026/310 (in force from 6 April 2026), the statutory weekly pay cap is £751 in Great Britain (£783 in Northern Ireland). Under Section 124(1ZA) ERA 1996, the ordinary unfair dismissal compensatory award is capped at £123,543 or 52 weeks&apos; gross pay, whichever is lower.
              </p>

              {/* COMPONENTS TABLE */}
              <div className="overflow-x-auto my-6 border border-rule rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-paper border-b border-rule text-ink font-semibold">
                      <th className="p-3">Payment Component</th>
                      <th className="p-3">Statutory Basis / Eligibility &amp; Cap</th>
                      <th className="p-3">Tax Treatment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule text-muted">
                    <tr>
                      <td className="p-3 font-medium text-ink">Contractual Notice Pay (PILON / Garden Leave)</td>
                      <td className="p-3">Contract / ERA 1996 s.86 (can be lost in gross misconduct)</td>
                      <td className="p-3">Taxed as wages (s.402D PENP)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Accrued Untaken Holiday</td>
                      <td className="p-3">Working Time Regulations 1998 reg.14</td>
                      <td className="p-3">Taxed as wages</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Calculated Statutory Redundancy Baseline (Subject to Eligibility)</td>
                      <td className="p-3">£751/week (max £22,530 GB / £23,490 NI); genuine redundancy only (forfeited under s.141 ERA 1996 if suitable alternative work is unreasonably refused)</td>
                      <td className="p-3 text-ink font-semibold">Counts toward combined £30,000 limit (s.309 &amp; s.403 ITEPA)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Ex-Gratia Compensation</td>
                      <td className="p-3">Commercial negotiation (unfair dismissal capped at lower of £123,543 or 52 weeks&apos; pay; discrimination and whistleblowing uncapped)</td>
                      <td className="p-3 text-ink font-semibold">Tax-free up to combined £30,000 limit (s.403)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">ACAS Code 1 Adjustment</td>
                      <td className="p-3">Up to 25% uplift or reduction under s.207A TULRCA 1992 (Schedule A2 claims)</td>
                      <td className="p-3">Included in compensatory sum</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Injury to Feelings (Vento)</td>
                      <td className="p-3">Ninth Addendum (£1,300 to £62,900+)</td>
                      <td className="p-3">Outside s.401 if pre-termination and unconnected with exit; termination-related counts toward £30,000 limit (s.406(2) excludes non-psychiatric injury)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="sc-h3 mb-3">
                The ACAS Code 1 adjustment of up to 25% (s.207A TULRCA 1992)
              </h3>
              <p className="sc-body mb-4">
                Under Section 207A TULRCA 1992, a tribunal can adjust Schedule A2 awards (including unfair dismissal and discrimination) by up to 25% if either side unreasonably fails to follow ACAS Code 1. An employer&apos;s unreasonable failure can trigger a 25% uplift, while an employee&apos;s unreasonable refusal to engage or appeal can trigger a 25% reduction.
              </p>
              <p className="sc-body mb-4">
                Common employer failings include long delays in scheduling hearings, refusing the right to be accompanied, or failing to offer an independent appeal. Solicitors factor potential s.207A adjustments into settlement assessments.
              </p>

              <h3 className="sc-h3 mb-3">
                Injury to feelings and the Ninth Addendum Vento bands
              </h3>
              <p className="sc-body mb-4">
                Where a grievance involves unlawful discrimination, harassment, or victimisation, tribunals assess injury to feelings using the Ninth Addendum Vento bands:
              </p>
              <ul className="list-disc pl-5 sc-body text-sm flex flex-col gap-2 mb-4">
                <li>
                  <strong>Lower Band (£1,300 to £12,600):</strong> Isolated or less serious incidents of unlawful discrimination.
                </li>
                <li>
                  <strong>Middle Band (£12,600 to £37,700):</strong> Serious cases that do not merit the highest bracket, such as persistent bullying or repeated discriminatory remarks.
                </li>
                <li>
                  <strong>Upper Band (£37,700 to £62,900):</strong> The most serious cases, including lengthy campaigns of harassment. Exceptional cases can exceed £62,900.
                </li>
              </ul>
            </div>

            {/* SECTION 6 */}
            <div>
              <h2 className="guide-h2 mb-4">
                6. How are notice pay and ex-gratia sums taxed?
              </h2>
              <p className="sc-body mb-4">
                Checking how each part of your settlement is taxed shows your true net take-home figure.
              </p>
              <p className="sc-body mb-4">
                Under Sections 309 and 403 ITEPA 2003, genuine non-contractual termination compensation (combined with any statutory redundancy pay) is tax-free up to £30,000. Amounts over £30,000 attract Income Tax and Employer Class 1A NIC (15.0% in 2026/27), though they remain exempt from Employee Class 1 NIC.
              </p>
              <p className="sc-body mb-4">
                Notice pay cannot be wrapped into the £30,000 exemption. Under Section 402D ITEPA 2003 (PENP), any unworked contractual notice pay is always taxed as wages with Income Tax and Class 1 NIC deducted, whether paid as PILON or served on garden leave.
              </p>
              <p className="sc-body mb-4">
                Compensation paid solely for pre-termination discrimination injury to feelings (wholly unconnected with the exit) falls outside s.401 ITEPA 2003 and can be paid tax-free without using the £30,000 limit. Termination-related injury to feelings counts toward the £30,000 threshold, and s.406(2) excludes non-psychiatric injury from the statutory disability exemption.
              </p>
            </div>

            {/* SECTION 7 */}
            <div>
              <h2 className="guide-h2 mb-4">
                7. Who pays for independent legal advice?
              </h2>
              <p className="sc-body mb-4">
                Under Section 203(3) ERA 1996, a settlement agreement is not legally binding unless six statutory conditions are met:
              </p>
              <ol className="list-decimal pl-5 sc-body text-sm flex flex-col gap-2 mb-4">
                <li>The agreement must be in writing.</li>
                <li>The agreement must relate to particular proceedings or complaints.</li>
                <li>The employee must receive advice from an independent, qualified adviser.</li>
                <li>The adviser must hold professional indemnity insurance.</li>
                <li>The adviser must be named in the agreement.</li>
                <li>The agreement must state that the statutory conditions are met.</li>
              </ol>
              <p className="sc-body mb-4">
                There is no statutory duty on an employer to fund your legal advice. However, because independent advice is required for a valid waiver, employers standardly offer a capped fee contribution (£350 to £500+ plus VAT) paid directly to your solicitor upon completion.
              </p>
              <p className="sc-body mb-4">
                For a straightforward review within the cap, this contribution usually covers the fee upon completion. If extensive negotiations are needed or the agreement does not complete, excess or abortive fees remain subject to your solicitor&apos;s engagement terms.
              </p>
            </div>

            {/* SECTION 8 */}
            <div>
              <h2 className="guide-h2 mb-4">
                8. What should you discuss with your instructed solicitor?
              </h2>
              <p className="sc-body mb-4">
                When speaking to an SRA-regulated employment solicitor about your draft agreement, these four areas are worth reviewing:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Valuation &amp; ACAS Uplift</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Whether the ex-gratia sum reflects calculated statutory baselines, any 25% ACAS Code 1 adjustment, or Vento band brackets.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Agreed Reference &amp; Non-Compete</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Whether an agreed reference schedule, mutual non-derogatory clauses, and any non-compete restrictions are clearly worded.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Tax Apportionment &amp; PENP</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    How unworked notice pay is calculated under s.402D PENP rules, how the £30,000 limit applies, and how discrimination sums are apportioned.
                  </p>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-semibold text-ink text-sm mb-1">Waiver Exclusions</h3>
                  <p className="text-[14px] text-muted leading-relaxed">
                    Whether the waiver excludes accrued pension rights, latent personal injury claims, and claims to enforce the agreement itself.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-4 mt-6">
                <p className="text-[14px] text-muted leading-relaxed m-0">
                  <strong className="text-ink">Regulatory &amp; Informational Notice:</strong> SettlementCheck is an independent statutory information platform and solicitor-matching introducer, not an authorised law firm, and does not provide legal or tax advice. All figures and summaries on this page are informational only. Any SRA-regulated employment solicitor you instruct acts independently in your best interests under Section 203(3) ERA 1996.
                </p>
              </div>
            </div>

            {/* BOTTOM CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/calculator/?reason=grievance" className="btn-accent">
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

            {/* SECTION 9: FAQS */}
            <div className="pt-6 border-t border-rule">
              <h2 className="guide-h2 mb-6">Frequently asked questions</h2>
              <FaqAccordion faqs={FAQS} />
            </div>

            {/* SECTION 10: RELATED ARTICLES */}
            <RelatedArticles
              title="Related Guides &amp; Statutory Resources"
              items={[
                {
                  href: '/guides/protected-conversations-without-prejudice/',
                  title: 'Protected Conversations & Without Prejudice UK',
                  description: 'Understand the legal distinctions between Section 111A and Without Prejudice privilege.',
                  tag: 'Statutory Rules',
                },
                {
                  href: '/guides/discrimination-settlement-agreements/',
                  title: 'Discrimination Settlement Agreements UK 2026',
                  description: 'Learn about uncapped awards, the Ninth Addendum Vento bands, and tax rules.',
                  tag: 'Equality Act 2010',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement UK',
                  description: 'How UK settlement talks work, tax splits, and legal fee contributions.',
                  tag: 'Negotiation',
                },
                {
                  href: '/guides/settlement-agreement-time-limits/',
                  title: 'Settlement Agreement Time Limits: 3-Month Tribunal Rule',
                  description: 'Why settlement negotiations do not pause your strict employment tribunal deadlines.',
                  tag: 'Time Limits',
                },
                {
                  href: '/pip-settlement-calculator/',
                  title: 'PIP & Performance Exit Settlement Calculator',
                  description: 'Calculate a benchmark exit package where capability procedures or grievances overlap with a Section 111A offer.',
                  tag: 'Calculator',
                },
                {
                  href: '/tribunal-backlog-tracker/',
                  title: 'UK Employment Tribunal Backlog Tracker',
                  description: 'See how regional tribunal delays and defence costs affect employer settlement incentives.',
                  tag: 'Data Tracker',
                },
              ]}
            />
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
