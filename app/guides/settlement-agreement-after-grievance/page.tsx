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
    a: 'Employers often propose settlement agreements to avoid lengthy, disruptive workplace investigations. Under the ACAS Code of Practice 1, handling a grievance requires significant management time, witness interviews, and formal hearings. An agreed exit under Section 203 of the Employment Rights Act 1996 provides both parties with a clean, legally binding conclusion.',
  },
  {
    q: 'Do I have to accept the settlement agreement or withdraw my grievance?',
    a: 'No. You are under no legal obligation to accept a settlement agreement or withdraw your grievance. Settlement agreements are voluntary contracts. If you decline the offer, your employment continues and your employer is expected to conclude your grievance in accordance with the ACAS Code of Practice 1 (an unreasonable failure to follow the Code can trigger a tribunal uplift of up to 25% under Section 207A TULRCA 1992).',
  },
  {
    q: 'What happens to my grievance investigation while settlement terms are discussed?',
    a: 'Parties typically agree to either pause the grievance investigation during negotiations or operate a twin-track approach. In a twin-track process, the formal grievance continues on an open basis while discussions proceed confidentially on a without prejudice basis. Withdrawing a grievance before an agreement is fully signed and certified by an independent solicitor can weaken your internal procedural position and affect potential ACAS Code 1 adjustments, so this is a key point to discuss with your instructed solicitor.',
  },
  {
    q: 'Is a settlement conversation confidential if my grievance involves discrimination or whistleblowing?',
    a: 'No. Section 111A(1) of the Employment Rights Act 1996 only protects pre-termination negotiations from being disclosed in ordinary unfair dismissal claims. Statutory confidentiality does not apply to discrimination claims under the Equality Act 2010, breach of contract claims, or automatic unfair dismissal claims (such as whistleblowing under ERA 1996 s.43B and s.103A, excluded under s.111A(3)). Protection is also lost under s.111A(4) if the employer engages in improper behaviour.',
  },
  {
    q: 'How is a grievance settlement payout calculated under 2026 rules?',
    a: 'A settlement package typically comprises contractual notice pay, accrued untaken holiday, and ex-gratia compensation. Genuine non-contractual termination compensation (including any statutory redundancy pay) is exempt from income tax up to a combined £30,000 limit under Section 403 ITEPA 2003. Where discrimination is alleged, compensation may reflect injury to feelings under the Ninth Addendum Vento bands (£1,300 to £62,900+). Unreasonable failure by either party to follow the ACAS Code of Practice 1 can result in a tribunal adjustment of up to 25% under Section 207A TULRCA 1992.',
  },
  {
    q: 'Does my employer contribute to my independent legal fees?',
    a: 'In standard UK practice, employers customarily provide a capped fee contribution (typically £350 to £500+ plus VAT) paid directly to your solicitor upon completion of the agreement. While Section 203(3) of the Employment Rights Act 1996 requires independent legal advice for a waiver to be valid, there is no statutory obligation on an employer to fund it. If the agreement does not complete or your legal costs exceed the agreed cap, you may be liable for the balance under your solicitor\'s terms of engagement.',
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
            <h1 className="sc-h1 mb-5">
              Settlement Agreement After Raising a Grievance: UK Employee Rights &amp; Payouts (2026)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; ACAS Code 1)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: November 2026</span>
            </div>
            <p className="sc-lead">
              Raising a formal workplace grievance takes considerable courage. When your employer responds by proposing a settlement agreement or calling an off-the-record meeting, it can feel unsettling. This guide outlines your legal rights, statutory negotiation baselines, and how compensation is calculated under 2026 UK employment law.
            </p>
          </div>
        </section>

        {/* STATUTORY QUICK ANSWER (GEO / AI OVERVIEW OPTIMISED) */}
        <section className="py-8 bg-paper-2 border-b border-rule">
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
              <p className="sc-body text-[14px] text-ink mb-4 leading-relaxed">
                When an employer proposes a settlement agreement after a grievance, they seek a binding commercial exit to avoid formal investigation, management disruption, and tribunal exposure. You are under no legal obligation to accept or withdraw your grievance. Typical settlements include contractual notice, accrued holiday, and tax-free ex-gratia compensation reflecting potential tribunal liabilities.
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
                    Check my draft terms →
                  </Link>
                  <Link href="/calculator/" className="text-xs font-bold text-coral hover:text-ink transition-colors flex items-center gap-1">
                    Calculate my settlement baseline →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CALCULATOR CARD */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="Grievance Exit Baseline Calculator"
              title="Calculate Your Grievance Settlement Negotiation Baseline"
              subtitle="Estimate contractual notice pay, statutory baselines, and potential ex-gratia compensation before responding to an agreed exit proposal."
              disputeType="grievance"
              statutoryPills={[
                { label: 'Weekly Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Shield', value: '£30,000', statute: 'ITEPA 2003 s.403' },
                { label: 'ACAS Code 1 Uplift', value: 'Up to 25%', statute: 'TULRCA 1992 s.207A' },
              ]}
              initialSalary={48000}
              initialYears={4}
              initialAge={36}
              ctaText="Check My Grievance Settlement Baseline →"
            />
          </div>
        </section>

        {/* CORE FACTS CALLOUT */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Core rules every employee must know</p>
              <ul className="flex flex-col gap-3">
                {[
                  'Proposing a settlement agreement does not automatically pause or cancel your formal grievance unless mutually agreed, and neither a grievance nor settlement talks pause the strict 3-month-less-1-day tribunal time limit.',
                  'Section 111A confidentiality applies strictly to ordinary unfair dismissal and does not cover discrimination, harassment, victimisation, breach of contract, or automatic unfair dismissal (including whistleblowing).',
                  'Raising a grievance concerning discrimination is a protected act under Section 27 of the Equality Act 2010, shielding you against unlawful victimisation from day one of employment.',
                  'ACAS Code 4 recommends 10 calendar days to consider a written offer, but under English contract law an employer can withdraw an unaccepted offer at any time prior to execution, and a counter-offer can extinguish the original offer.',
                  'An unreasonable failure by either party to follow the ACAS Code of Practice 1 can result in a tribunal adjusting compensation by up to 25% under Section 207A TULRCA 1992.',
                  'Genuine compensatory termination payments (combined with any statutory redundancy pay) are tax-free up to £30,000 under Section 403 ITEPA 2003, whereas notice pay is fully taxable under Section 402D.',
                  'There is no statutory obligation on an employer to fund your legal advice, though employers customarily provide a capped fee contribution (typically £350 to £500+ plus VAT) upon completion; abortive or excess costs remain subject to your solicitor\'s terms.',
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
              <h2 className="sc-h2 mb-4">
                Why employers propose settlement agreements after a grievance
              </h2>
              <p className="sc-body mb-4">
                When you lodge a formal grievance, you trigger procedural expectations under the ACAS Code of Practice 1 on Disciplinary and Grievance Procedures. While failure to follow the Code is not a standalone cause of action under Section 207 TULRCA 1992, tribunals take compliance into account and employers are expected to appoint an impartial investigator, gather witness statements, hold formal meetings, and produce a written outcome.
              </p>
              <p className="sc-body mb-4">
                This internal process carries substantial operational friction. Managers must dedicate working hours to investigations, internal correspondence becomes subject to Data Protection Act subject access requests, and team relationships frequently deteriorate.
              </p>
              <p className="sc-body mb-4">
                Moreover, grievances rarely restore harmonious working dynamics. If your employer upholds your grievance, they formally admit internal failings or manager misconduct. If they dismiss your grievance, an employee may consider whether a fundamental breach of contract has occurred supporting a constructive unfair dismissal claim under Section 95(1)(c) of the Employment Rights Act 1996 (generally requiring two years of continuous service under s.108 ERA 1996, unless a day-one claim such as discrimination or whistleblowing applies). Proposing an agreed exit under Section 203 ERA 1996 allows an employer to seek commercial finality.
              </p>
            </div>

            {/* SECTION 2 */}
            <div>
              <h2 className="sc-h2 mb-4">
                Do you have to accept the offer or drop your grievance?
              </h2>
              <p className="sc-body mb-4">
                You are under zero legal obligation to accept a settlement agreement. Nor are you required to withdraw your grievance simply because settlement discussions have begun.
              </p>
              <p className="sc-body mb-4">
                A settlement agreement is a voluntary contract. An employer cannot lawfully dismiss you on the spot simply for declining an offer. If negotiations do not reach an agreement, your employment continues and your employer remains expected to conclude your grievance investigation in accordance with ACAS Code 1 standards.
              </p>
              <div className="rounded-xl border border-rule bg-paper p-5 my-4">
                <div className="flex items-start gap-3">
                  <AlertIcon />
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-bold text-ink">
                      Procedural safeguards: grievance withdrawal, deadlines &amp; offer revocation
                    </h3>
                    <p className="text-xs text-muted leading-relaxed">
                      <strong>Grievance withdrawal:</strong> Withdrawing a formal grievance before a binding settlement agreement is fully executed and certified by an instructed solicitor can weaken your internal procedural position and affect potential ACAS Code 1 adjustments. (Statutory protection against victimisation under s.27 Equality Act 2010 or whistleblowing detriment under s.47B ERA 1996 still attaches to a protected act already done, even if a grievance is later withdrawn.)
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      <strong>Offer deadlines and revocation:</strong> ACAS Code of Practice 4 recommends a minimum of 10 calendar days to consider a written settlement offer as statutory guidance. However, under English contract law (<em>Routledge v Grant</em> (1828)), an employer can lawfully set a shorter deadline or withdraw an unaccepted offer at any time prior to execution, and making a counter-offer can extinguish the original offer (<em>Hyde v Wrench</em> (1840)). Consider consulting an independent solicitor before letting a stated deadline pass.
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      <strong>Tribunal time limits:</strong> Raising a grievance or negotiating a settlement agreement does <strong>not</strong> pause the strict statutory deadline of 3 months less 1 day to commence ACAS Early Conciliation and bring an employment tribunal claim.
                    </p>
                  </div>
                </div>
              </div>
              <p className="sc-body mb-4">
                When settlement discussions begin, employees and their instructed solicitors typically consider one of two recognised procedural pathways:
              </p>
              <ul className="list-disc pl-5 sc-body text-sm flex flex-col gap-2 mb-4">
                <li>
                  <strong>Agreed temporary pause:</strong> Both parties agree in writing to pause the grievance timetable for a defined period (such as 10 to 14 days) to focus on settlement terms. If discussions stall, the grievance timetable resumes immediately.
                </li>
                <li>
                  <strong>Twin-track process:</strong> The formal grievance investigation proceeds on an open basis, while negotiations progress concurrently on a confidential without prejudice track. This maintains procedural pressure on your employer to resolve the dispute.
                </li>
              </ul>
            </div>

            {/* SECTION 3 */}
            <div>
              <h2 className="sc-h2 mb-4">
                The confidentiality trap: Section 111A vs Without Prejudice
              </h2>
              <p className="sc-body mb-4">
                Employers often invite employees to off-the-record meetings to discuss settlement terms. However, UK employment law governs confidential discussions under two very different legal frameworks.
              </p>
              <p className="sc-body mb-4">
                The distinction between statutory protected conversations under Section 111A ERA 1996 and common law Without Prejudice privilege is critical when a grievance has been raised.
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
                Why Section 111A fails to protect employers in grievance disputes
              </h3>
              <p className="sc-body mb-4">
                Section 111A of the Employment Rights Act 1996 was created to allow employers to hold confidential pre-termination negotiations. However, under Section 111A(1), statutory protection applies strictly to ordinary unfair dismissal claims.
              </p>
              <p className="sc-body mb-4">
                Section 111A provides zero confidentiality where a dispute involves unlawful discrimination or harassment under the Equality Act 2010, breach of contract, or automatic unfair dismissal claims excluded under Section 111A(3) (such as whistleblowing under s.43B and s.103A ERA 1996, pregnancy or maternity dismissal under s.99, or health and safety grounds under s.100). In those claims, what is said in a pre-termination meeting can be disclosed directly to an employment tribunal unless common law Without Prejudice privilege separately applies.
              </p>
              <p className="sc-body mb-4">
                Furthermore, under Section 111A(4), confidentiality is waived if either party engages in improper behaviour. Setting unworkably tight deadlines, threatening immediate dismissal if an offer is declined, or applying undue pressure can forfeit statutory protection under ACAS Code of Practice 4.
              </p>

              <h3 className="sc-h3 mb-3">
                How Without Prejudice applies after a grievance
              </h3>
              <p className="sc-body mb-4">
                Common law Without Prejudice privilege (<em>Rush &amp; Tompkins Ltd v Greater London Council</em> [1989]) prevents statements made in a genuine attempt to settle an existing dispute from being put before a tribunal. Unlike Section 111A, Without Prejudice can cover discrimination and breach of contract claims.
              </p>
              <p className="sc-body mb-4">
                However, submitting a formal grievance does not automatically establish an existing legal dispute for Without Prejudice purposes (<em>BNP Paribas v Mezzotero</em> [2004]), particularly before the employer has investigated or rejected the complaint. A genuine dispute is more likely to exist once positions are clearly opposed or litigation is contemplated (<em>Framlington Group Ltd v Barnetson</em> [2007]). Simply labelling correspondence &ldquo;Without Prejudice&rdquo; when no genuine legal dispute exists does not create privilege, and privilege never protects unambiguous impropriety such as discriminatory threats or fraud.
              </p>
              <div className="rounded-xl border border-coral/30 bg-[#FBF0EE] p-4 my-4">
                <p className="text-xs text-ink leading-relaxed m-0">
                  <strong>Important Privilege Notice:</strong> Do not send unreviewed financial proposals directly to HR; unreviewed correspondence can inadvertently waive legal privilege or compromise your position.
                </p>
              </div>
            </div>

            {/* SECTION 4 */}
            <div>
              <h2 className="sc-h2 mb-4">
                Section 27 Equality Act 2010: Protection against victimisation
              </h2>
              <p className="sc-body mb-4">
                If your grievance concerns discrimination, harassment, or a failure to make reasonable adjustments for a disability, you receive immediate protection under Section 27 of the Equality Act 2010.
              </p>
              <p className="sc-body mb-4">
                Submitting a grievance that alleges unlawful discrimination is a protected act under Section 27(2). It is unlawful for your employer to subject you to any detriment because you did a protected act.
              </p>
              <p className="sc-body mb-4">
                Unlawful detriments include disciplinary threats, ostracisation, adverse performance ratings, or threats of dismissal following your grievance. Protection against victimisation applies from day one of employment, without requiring two years of continuous service.
              </p>
              <p className="sc-body mb-4">
                Victimisation claims in an employment tribunal carry uncapped financial compensation. This statutory protection provides vital context when reviewing any settlement offer with an instructed solicitor.
              </p>
            </div>

            {/* SECTION 5 */}
            <div>
              <h2 className="sc-h2 mb-4">
                How grievance settlements are calculated under 2026 rules
              </h2>
              <p className="sc-body mb-4">
                A grievance settlement calculation reflects contractual entitlements, calculated statutory baselines (subject to eligibility), and the commercial exposure an employer seeks to resolve by settling.
              </p>
              <p className="sc-body mb-4">
                Under the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310), in force from 6 April 2026, the statutory weekly pay cap is £751 in Great Britain (£783 in Northern Ireland). Under Section 124(1ZA) ERA 1996, the statutory ordinary unfair dismissal compensatory award is capped at £123,543 or 52 weeks&apos; actual gross pay, whichever is lower.
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
                      <td className="p-3 font-medium text-ink">Contractual Notice Pay (PILON)</td>
                      <td className="p-3">Contract / ERA 1996 s.86 (subject to eligibility; can be lost in gross misconduct)</td>
                      <td className="p-3">Taxable as earnings (s.402D PENP)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Accrued Untaken Holiday</td>
                      <td className="p-3">Working Time Regulations 1998 reg.14</td>
                      <td className="p-3">Taxable as earnings</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Calculated Statutory Redundancy Baseline (Subject to Eligibility)</td>
                      <td className="p-3">£751/week (max £22,530 GB / £23,490 NI); applies only in genuine redundancy (forfeited under s.141 ERA 1996 if suitable alternative employment is unreasonably refused)</td>
                      <td className="p-3 text-ink font-semibold">Counts toward combined £30,000 limit (s.309 &amp; s.403 ITEPA)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium text-ink">Ex-Gratia Compensation</td>
                      <td className="p-3">Commercial negotiation (ordinary unfair dismissal capped at lower of £123,543 or 52 weeks&apos; gross pay; discrimination and whistleblowing uncapped)</td>
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
                Under Section 207A of the Trade Union and Labour Relations (Consolidation) Act 1992, an employment tribunal has statutory power in Schedule A2 claims (including unfair dismissal and discrimination) to adjust compensation by up to 25% if either party unreasonably fails to comply with the ACAS Code of Practice 1. This operates in both directions: an employer&apos;s unreasonable failure can trigger an uplift of up to 25% (applied before the statutory unfair dismissal cap), while an employee&apos;s unreasonable failure to engage with the grievance procedure or appeal can result in a reduction of up to 25%.
              </p>
              <p className="sc-body mb-4">
                Common employer failures include unreasonable delays in scheduling grievance meetings, refusing to allow a trade union representative or colleague to accompany the employee, or failing to offer an independent appeal. Instructed solicitors factor potential s.207A adjustments into negotiation assessments.
              </p>

              <h3 className="sc-h3 mb-3">
                Injury to feelings and the Ninth Addendum Vento bands
              </h3>
              <p className="sc-body mb-4">
                If your grievance involves unlawful discrimination, harassment, or victimisation, compensation is not capped by the unfair dismissal limits. Tribunals award injury to feelings compensation assessed under the Presidential Guidance Ninth Addendum:
              </p>
              <ul className="list-disc pl-5 sc-body text-sm flex flex-col gap-2 mb-4">
                <li>
                  <strong>Lower Band (£1,300 to £12,600):</strong> Applies to isolated or less serious incidents of unlawful discrimination.
                </li>
                <li>
                  <strong>Middle Band (£12,600 to £37,700):</strong> Applies to serious cases that do not merit an award in the highest bracket, such as persistent bullying or repeated discriminatory remarks.
                </li>
                <li>
                  <strong>Upper Band (£37,700 to £62,900):</strong> Reserved for the most serious cases, including lengthy campaigns of discriminatory harassment. Exceptional cases can exceed £62,900.
                </li>
              </ul>
            </div>

            {/* SECTION 6 */}
            <div>
              <h2 className="sc-h2 mb-4">
                Tax rules: The £30,000 exemption vs Post-Employment Notice Pay
              </h2>
              <p className="sc-body mb-4">
                Understanding how your settlement payment is taxed helps you review the true net take-home figure with your solicitor.
              </p>
              <p className="sc-body mb-4">
                Under Sections 309 and 403 of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003), genuine non-contractual termination compensation (combined with any statutory redundancy pay) is exempt from income tax and National Insurance contributions up to a single combined threshold of £30,000. Amounts exceeding £30,000 are subject to Income Tax and Employer Class 1A National Insurance (15.0% in 2026/27), while remaining exempt from Employee Class 1 National Insurance.
              </p>
              <p className="sc-body mb-4">
                However, notice pay cannot be disguised as tax-free compensation. Under Section 402D ITEPA 2003, Post-Employment Notice Pay (PENP) rules require that any unworked portion of your contractual notice period must be taxed in full as earnings and subject to Class 1 National Insurance.
              </p>
              <p className="sc-body mb-4">
                Where a grievance involves discrimination, compensation paid solely for injury to feelings that occurred prior to and wholly unconnected with the termination of employment falls outside Section 401 ITEPA 2003 (and is not earnings under Section 62), so it can be paid free of tax without using the £30,000 threshold. By contrast, injury to feelings connected with the termination itself counts toward the £30,000 limit. Under Section 406(2) ITEPA 2003, the statutory disability and injury exemption does not cover injury to feelings unless it amounts to a clinically recognised psychiatric injury.
              </p>
            </div>

            {/* SECTION 7 */}
            <div>
              <h2 className="sc-h2 mb-4">
                Independent legal advice and solicitor fee contributions
              </h2>
              <p className="sc-body mb-4">
                Under Section 203(3) of the Employment Rights Act 1996, an employee cannot contract out of their statutory rights unless six mandatory legal conditions are satisfied:
              </p>
              <ol className="list-decimal pl-5 sc-body text-sm flex flex-col gap-2 mb-4">
                <li>The agreement must be in writing.</li>
                <li>The agreement must relate to particular proceedings or complaints.</li>
                <li>The employee must have received advice from an independent, qualified adviser.</li>
                <li>The adviser must hold a valid contract of insurance covering professional liability.</li>
                <li>The adviser must be identified in the agreement.</li>
                <li>The agreement must state that the statutory conditions regulating settlement agreements are met.</li>
              </ol>
              <p className="sc-body mb-4">
                While there is no statutory obligation on an employer to fund your legal advice, independent advice is a mandatory legal condition for your employer to obtain a valid waiver. As a result, employers standardly provide a capped commercial fee contribution paid directly to your solicitor upon completion of the agreement.
              </p>
              <p className="sc-body mb-4">
                In standard UK practice, this contribution typically ranges from £350 to £500+ plus VAT. For a straightforward review and sign-off within this cap, the employer&apos;s contribution usually covers the solicitor&apos;s fee upon completion. If extensive negotiations are required, your solicitor can request an increased contribution from your employer. If you decline the agreement, negotiations abort without completion, or legal costs exceed the agreed cap, you may be personally liable for the balance under your solicitor&apos;s terms of engagement.
              </p>
            </div>

            {/* SECTION 8 */}
            <div>
              <h2 className="sc-h2 mb-4">
                Intake agenda items to consider with your instructed solicitor
              </h2>
              <p className="sc-body mb-4">
                When consulting an SRA-regulated employment solicitor to review your proposed settlement agreement, here are key topics you may wish to discuss:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Valuation &amp; ACAS Uplift</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Whether the proposed ex-gratia sum reflects potential statutory baselines, any 25% ACAS Code 1 adjustment, or applicable Vento band brackets.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Agreed Reference Wording</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Whether an agreed reference can be attached as a binding schedule alongside mutual non-derogatory statements clauses.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Tax Apportionment &amp; PENP</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    How unworked notice pay is calculated under s.402D PENP rules, how the combined £30,000 exemption applies, and whether any pre-termination discrimination compensation should be separately apportioned.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-rule bg-paper">
                  <h3 className="font-semibold text-ink text-sm mb-1">Waiver Exclusions</h3>
                  <p className="text-xs text-muted leading-relaxed">
                    Whether the waiver explicitly excludes accrued pension rights, personal injury claims of which you are currently unaware, and claims to enforce the settlement agreement itself.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-4 mt-6">
                <p className="text-xs text-muted leading-relaxed m-0">
                  <strong className="text-ink">Regulatory &amp; Informational Notice:</strong> SettlementCheck is an independent statutory information platform and solicitor-matching introducer, not an authorised law firm, and does not provide legal or tax advice. All figures and summaries on this page are strictly informational and descriptive. Any SRA-regulated employment solicitor you instruct acts independently and solely in your best interests under Section 203(3) of the Employment Rights Act 1996.
                </p>
              </div>
            </div>

            {/* SECTION 9: FAQS */}
            <div className="pt-6 border-t border-rule">
              <h2 className="sc-h2 mb-6">Frequently asked questions</h2>
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
                  description: 'A structured breakdown of commercial negotiation tactics and statutory baselines.',
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
                  description: 'See how regional tribunal delays and defence costs increase employer settlement incentives.',
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
