import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Instead of a PIP UK | 2026 Employee Guide',
  description:
    'Offered a settlement agreement instead of a PIP? Check 2026 statutory caps (£751/week), tax rules, negotiation scripts, and how to secure a fair exit.',
  alternates: {
    canonical: '/guides/settlement-agreement-instead-of-pip/',
  },
  openGraph: {
    title: 'Settlement Agreement Instead of a PIP UK | 2026 Employee Guide',
    description:
      'Offered a settlement agreement instead of a PIP? Check 2026 statutory caps (£751/week), tax rules, negotiation scripts, and how to secure a fair exit.',
    url: '/guides/settlement-agreement-instead-of-pip/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Instead of a PIP UK | 2026 Employee Guide',
    description:
      'Offered a settlement agreement instead of a PIP? Check 2026 statutory caps (£751/week), tax rules, negotiation scripts, and how to secure a fair exit.',
  },
}

const FAQS = [
  {
    q: 'Can my employer dismiss me immediately if I reject the settlement agreement?',
    a: 'No. An employer cannot lawfully dismiss you on the spot simply because you reject a settlement offer. If you decline the offer, your employment continues as normal. Your employer must then follow a fair capability procedure under the ACAS Code of Practice 1 before considering dismissal.',
  },
  {
    q: 'What happens if I have less than two years of continuous service?',
    a: 'Under Section 108 of the Employment Rights Act 1996, you generally need two years of continuous service to bring an ordinary unfair dismissal claim. If you have under two years of service, your employer can dismiss you with notice without full capability procedures. However, the two-year rule does not apply if your dismissal involves unlawful discrimination under the Equality Act 2010 or whistleblowing.',
  },
  {
    q: 'How much should I ask for when negotiating a PIP settlement?',
    a: 'A realistic counter-offer typically requests full contractual notice pay plus two to three months of gross salary as tax-free ex-gratia compensation. This figure mirrors the time and expense your employer saves by avoiding a formal capability process. If disability or discrimination is involved, counter-offers can be significantly higher.',
  },
  {
    q: 'Do I have to pay my solicitor anything out of my own pocket?',
    a: 'No. Your employer covers the fees for independent legal advice on the settlement agreement. The standard contribution is £350 to £750 plus VAT. If your solicitor requires a higher fee to negotiate improvements, they will ask your employer to increase the contribution.',
  },
  {
    q: 'What happens to my job reference if I sign a settlement agreement?',
    a: 'Your settlement agreement will include an agreed reference clause. The exact wording of the reference is attached as a schedule to the agreement. Your employer is contractually bound to provide that reference to future employers and cannot give a negative verbal reference.',
  },
  {
    q: 'Will signing a settlement agreement stop me from claiming benefits?',
    a: 'A settlement agreement does not prevent you from claiming statutory benefits such as Universal Credit or Jobseeker\'s Allowance. The Department for Work and Pensions treats a departure under a settlement agreement as a mutual exit rather than voluntary resignation, provided the agreement settled an employment dispute.',
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

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M10 3L2 17H18L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function PipSettlementGuide() {
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
              <span className="text-xs text-ink truncate">Performance Plans</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Capability, Section 111A &amp; Payout Rights</p>
            <h1 className="sc-h1 mb-5">
              Settlement Agreement Instead of a PIP: The UK Employee Guide
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; ACAS Code 1)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              Being offered a settlement agreement instead of a Performance Improvement Plan (PIP) is a frequent workplace scenario in the UK. Under the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310), statutory weekly pay is capped at £751 in Great Britain. When your employer proposes an agreed exit rather than a PIP, they want a clean departure without tribunal risk.
            </p>
          </div>
        </section>

        {/* CORE FACTS CALLOUT */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Core rules every employee must know</p>
              <ul className="flex flex-col gap-3">
                {[
                  'A PIP offer alongside a settlement proposal is usually a pre-termination negotiation under Section 111A ERA 1996.',
                  'Your employer offers an exit to avoid months of management time, grievance delays, and tribunal exposure.',
                  'Under the ACAS Code of Practice 4, you should receive a minimum of 10 calendar days to consider written terms.',
                  'If your performance dips relate to mental health, neurodiversity, or disability, your employer has a duty to make reasonable adjustments under Equality Act 2010 s.20.',
                  'Genuine compensation for loss of employment is tax-free up to £30,000 under ITEPA 2003 s.403.',
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

        {/* SECTION 1: WHY EMPLOYERS OFFER AN EXIT */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Why employers offer a settlement agreement instead of a PIP</h2>
            <p className="sc-body mb-4">
              In many UK workplaces, a Performance Improvement Plan is rarely about genuine professional development. HR professionals often treat a PIP as a formal process to manage an employee out of the business. Industry surveys indicate that fewer than one in five employees successfully complete a PIP and remain long-term.
            </p>
            <p className="sc-body mb-4">
              Running a lawful capability process requires significant time and commercial expense. Under the{' '}
              <a
                href="https://www.acas.org.uk/code-of-practice-disciplinary-and-grievance-procedures"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                ACAS Code of Practice 1 on Disciplinary and Grievance Procedures
              </a>
              , your employer must follow strict procedural standards before dismissing you for poor performance:
            </p>
            <ul className="space-y-2 mb-4 pl-1">
              {[
                'They must set realistic, measurable targets with objective assessment criteria.',
                'They must provide adequate training, resources, and regular review meetings.',
                'They must give you reasonable timescales to demonstrate sustained improvement.',
                'They must issue formal written warnings before considering dismissal.',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-ink/80">
                  <span className="text-coral font-bold">•</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              This capability pathway consumes months of management time and internal HR resources. It also creates operational disruption across the team.
            </p>
            <p className="sc-body mb-4">
              Employees placed on a PIP frequently submit formal grievances regarding unfair treatment, unreasonable workloads, or lack of management support. Under ACAS standards, your employer must investigate that grievance, which pauses the PIP process.
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
              allows your employer to avoid these delays. By agreeing a financial exit, your employer eliminates weeks of administrative work. Crucially, a signed agreement waives your right to bring an employment tribunal claim.
            </p>
          </div>
        </section>

        {/* SECTION 2: PROTECTED TALKS VS WITHOUT PREJUDICE */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Protected conversations vs Without Prejudice</h2>
            <p className="sc-body mb-6">
              When your manager or HR representative invited you to a meeting to discuss your performance, they likely initiated a confidential discussion. Understanding the legal rules governing this discussion protects your position:
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
                    <td className="p-3">No. Your employer can start talks at any time.</td>
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
                    <td className="p-3">Fraud, blackmail, extreme impropriety</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Loss of secrecy</td>
                    <td className="p-3">Improper behaviour (Section 111A(4))</td>
                    <td className="p-3">Severe abuse of privilege</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-rule bg-white p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-coral">Improper behaviour lifts secrecy</p>
              <p className="sc-body text-xs leading-relaxed text-muted">
                Under Section 111A(4) of the Employment Rights Act 1996, an employment tribunal will admit evidence of exit discussions if your employer behaves improperly. Examples include threatening dismissal before any formal capability process has taken place, demanding that you sign by the end of the day, or imposing penalties for seeking independent legal advice.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: ACAS 10-DAY RULE */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The ACAS 10-day consideration rule</h2>
            <p className="sc-body mb-4">
              Employers often create an artificial sense of urgency during exit discussions. Your employer may tell you that the settlement offer expires within 24 or 48 hours.
            </p>
            <p className="sc-body mb-4">
              This pressure is a common negotiation tactic designed to make you accept an offer before discovering your legal entitlements.
            </p>

            <div className="rounded-xl border border-coral/30 bg-coral/5 p-6 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-coral">ACAS Statutory Benchmark</span>
              </div>
              <h3 className="font-serif text-[18px] font-[460] text-ink mb-2">The 10 Calendar Day Consideration Period</h3>
              <p className="sc-body text-sm mb-3">
                Paragraph 12 of ACAS Code of Practice 4 states that parties should be allowed a reasonable period of time to consider an offer. As a general rule, a minimum period of <strong>10 calendar days</strong> should be provided to review the formal written terms and obtain independent legal advice.
              </p>
              <p className="sc-body text-xs text-muted">
                The 10-day window starts when you receive the formal written agreement, not during your verbal discussion. Refusing to allow reasonable time can be cited as improper behaviour.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: EQUALITY ACT AND HEALTH */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Equality Act 2010: When a PIP creates uncapped tribunal risk</h2>
            <p className="sc-body mb-6">
              Many workplace performance concerns arise from underlying health issues, life transitions, or neurodivergent conditions. Under Section 6 of the Equality Act 2010, a disability is defined as a physical or mental impairment that has a substantial and long-term adverse effect on normal day-to-day activities:
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">Duty to Make Reasonable Adjustments (s.20)</h3>
                <p className="sc-body text-sm mb-2">
                  Under Section 20 of the Equality Act 2010, your employer must make reasonable adjustments for employees with qualifying health conditions or neurodiversity (including ADHD, depression, anxiety, autism, or chronic fatigue).
                </p>
                <p className="sc-body text-xs text-muted">
                  Placing an employee on a PIP without first implementing reasonable adjustments or seeking occupational health input can amount to discrimination arising from disability under Section 15.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-card p-5">
                <h3 className="font-serif text-[17px] font-[460] text-ink mb-1.5">Uncapped Compensation Shifts the Balance (s.124)</h3>
                <p className="sc-body text-sm mb-2">
                  Unlike ordinary unfair dismissal awards, compensation for unlawful discrimination under Section 124 of the Equality Act 2010 is completely uncapped. Tribunals also award separate sums for injury to feelings under the Vento guidelines.
                </p>
                <p className="sc-body text-xs text-muted">
                  If your performance dipped due to health or neurodiversity, your employer faces substantial exposure. This legal exposure gives you strong standing to negotiate an enhanced financial package.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: STATUTORY RATES 2026 */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Current 2026 statutory rates and compensation caps</h2>
            <p className="sc-body mb-4">
              Evaluating whether a settlement offer is fair requires benchmarking it against what an employment tribunal could award under the{' '}
              <a
                href="https://www.legislation.gov.uk/uksi/2026/310/contents/made"
                target="_blank"
                rel="noopener noreferrer"
                className="text-coral underline hover:text-ink transition-colors"
              >
                Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)
              </a>
              :
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
                    <td className="p-3 font-medium text-ink">Max basic award / statutory redundancy</td>
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
                <p className="font-serif text-[17px] font-[460] text-ink">Check your settlement offer now</p>
                <p className="text-xs text-muted">Free, confidential estimate in under 2 minutes. No contact info needed.</p>
              </div>
              <Link href="/calculator/?reason=performance" className="btn-accent text-xs whitespace-nowrap">
                Calculate my estimate →
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION 6: FAIR PACKAGE COMPONENTS */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What a fair PIP settlement agreement package looks like</h2>
            <p className="sc-body mb-6">
              An initial settlement offer made instead of a PIP is frequently below the typical range. Employers often start by offering contractual notice pay plus a nominal sum. A fair settlement package should contain these eight components:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  title: '1. Notice Pay in Full',
                  desc: 'Contractual notice paid under PILON or served on garden leave. Subject to income tax and National Insurance under ITEPA 2003 s.402D.',
                },
                {
                  title: '2. Ex-Gratia Compensation',
                  desc: 'One to three months of gross pay to reflect capability procedure savings. Paid tax-free up to £30,000 under ITEPA 2003 s.403.',
                },
                {
                  title: '3. Accrued Holiday Pay',
                  desc: 'All accrued but untaken statutory and contractual holiday paid in full as standard taxable earnings.',
                },
                {
                  title: '4. Pro-Rata Bonus or Commission',
                  desc: 'Negotiate pro-rata bonus or commissions accrued up to your final termination date.',
                },
                {
                  title: '5. Pension Contributions',
                  desc: 'Employer pension contributions maintained across the notice period or paid as an equivalent lump sum.',
                },
                {
                  title: '6. Legal Fee Contribution',
                  desc: 'Employer pays £350 to £750 plus VAT directly to your solicitor. Free of tax under HMRC concession EIM13750.',
                },
                {
                  title: '7. Agreed Job Reference',
                  desc: 'Binding reference wording attached as a schedule to the agreement, preventing adverse verbal comments.',
                },
                {
                  title: '8. Mutual Non-Disparagement',
                  desc: 'Contractual clauses ensuring neither party makes derogatory statements following departure.',
                },
              ].map((comp) => (
                <div key={comp.title} className="rounded-xl border border-rule bg-card p-4">
                  <p className="font-serif text-[15px] font-[460] text-ink mb-1">{comp.title}</p>
                  <p className="text-xs text-muted leading-relaxed">{comp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: PIP VS SETTLEMENT COMPARISON */}
        <section className="py-12 border-b border-rule bg-paper-2">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Decision framework: Undergoing the PIP vs Settlement Agreement</h2>
            <p className="sc-body mb-6">
              Deciding whether to undergo a PIP or accept an agreed financial exit is a critical career choice. Compare both paths objectively:
            </p>

            <div className="overflow-x-auto rounded-xl border border-rule bg-white shadow-sm mb-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-rule text-ink">
                    <th className="p-3 font-semibold">Decision Factor</th>
                    <th className="p-3 font-semibold">Undergoing the PIP</th>
                    <th className="p-3 font-semibold">Accepting a Settlement Agreement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule text-ink/80">
                  <tr>
                    <td className="p-3 font-medium text-ink">Financial Security</td>
                    <td className="p-3">Salary during PIP, but sudden loss of income if dismissed at the end.</td>
                    <td className="p-3">Guaranteed tax-free compensation package and notice pay upfront.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Mental Health</td>
                    <td className="p-3">High sustained stress, intense scrutiny, and damaged relationships.</td>
                    <td className="p-3">Immediate closure, dignity, and headspace to secure your next role.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Career Reputation</td>
                    <td className="p-3">Dismissal for capability recorded on HR file. Potential poor reference.</td>
                    <td className="p-3">Agreed positive reference attached to contract. Clean narrative.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-ink">Pass Rate</td>
                    <td className="p-3">Statistically low. Fewer than 20% of employees pass formal PIPs.</td>
                    <td className="p-3">100% certainty over agreed exit terms and departure date.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="sc-body text-xs text-muted">
              For most employees, accepting a negotiated settlement agreement provides the safest outcome. It protects your mental health, preserves your professional reputation, and secures funds while you find your next role.
            </p>
          </div>
        </section>

        {/* SECTION 8: VERBATIM SCRIPTS */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Verbatim negotiation scripts for UK employees</h2>
            <p className="sc-body mb-6">
              During exit discussions, knowing exactly what to say prevents emotional reactions and protects your legal rights. Use these verbatim scripts:
            </p>

            <div className="space-y-4 mb-6">
              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">Script 1: In the initial meeting</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Request written terms and cite ACAS guidelines</p>
                <blockquote className="border-l-2 border-coral pl-4 py-1 text-sm text-ink/80 italic">
                  &quot;Thank you for explaining your perspective. Given that this is an unexpected discussion, I am not in a position to discuss terms or make decisions today. Please send the draft settlement agreement and complete financial proposal to me in writing by email. Under the ACAS Code of Practice 4, I will take the recommended 10 calendar days to review the terms and take independent legal advice.&quot;
                </blockquote>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">Script 2: If given an artificial deadline</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Push back against 24 or 48-hour pressure</p>
                <blockquote className="border-l-2 border-coral pl-4 py-1 text-sm text-ink/80 italic">
                  &quot;I recognise your wish to resolve this quickly. However, paragraph 12 of the ACAS Code of Practice 4 establishes that employees should receive a minimum of 10 calendar days to consider written settlement terms and obtain independent legal advice. Imposing an immediate deadline prevents me from taking proper legal advice. I am arranging an appointment with an independent employment solicitor and will respond within the standard ACAS timeframe.&quot;
                </blockquote>
              </div>

              <div className="rounded-xl border border-rule bg-paper p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-coral mb-1">Script 3: Written counter-proposal</p>
                <p className="font-serif text-[16px] text-ink font-[460] mb-2">Counter-offer email template</p>
                <blockquote className="border-l-2 border-coral pl-4 py-1 text-xs text-ink/80 font-mono leading-relaxed bg-white p-3 rounded border border-rule">
                  Subject: Strictly Private and Confidential: Without Prejudice / Section 111A ERA 1996<br /><br />
                  Dear [Manager / HR Name],<br /><br />
                  Thank you for forwarding the draft settlement agreement.<br /><br />
                  I have reviewed the initial proposal. The current offer of notice pay and [insert offer] does not adequately reflect my length of service or the time required to complete a formal capability process under the ACAS Code of Practice 1.<br /><br />
                  To achieve an amicable exit without proceeding to formal capability reviews or grievance procedures, I am prepared to sign on the following adjusted terms:<br />
                  1. Contractual notice pay in full under PILON ([number] months gross pay).<br />
                  2. Ex-gratia compensation payment of £[amount] tax-free under Section 403 of ITEPA 2003.<br />
                  3. Accrued untaken holiday pay up to the termination date.<br />
                  4. An agreed positive job reference annexed to the agreement.<br />
                  5. Employer legal fee contribution of £500 plus VAT to my independent solicitor.<br /><br />
                  If you agree to these terms, I will instruct my solicitor to sign off the agreement promptly.<br /><br />
                  Yours sincerely,<br />
                  [Your Name]
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 9: STEP-BY-STEP CHECKLIST */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Step-by-step checklist after receiving an offer</h2>
            <p className="sc-body mb-6">
              Follow this structured sequence to protect your rights from the moment an exit is suggested:
            </p>

            <ol className="space-y-3 mb-6 pl-1">
              {[
                'Remain composed in the meeting. Do not resign, do not admit fault, and do not accept verbal terms immediately.',
                'Request everything in writing. Ask for the formal draft agreement to be sent to your personal email.',
                'Assert your ACAS 10-day right to review the document and instruct an independent solicitor.',
                'Gather workplace records. Save contracts, positive appraisals, and medical notes to a personal device.',
                'Benchmark your entitlements using our free calculator against 2026 statutory rates.',
                'Instruct an independent employment solicitor. Your employer covers the cost of this advice.',
                'Submit a structured counter-proposal for notice pay, an ex-gratia sum, and an agreed reference.',
                'Sign the final agreement once agreed, with your solicitor signing the statutory adviser certificate.',
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
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] mb-3 text-white">
              Find out where your settlement offer stands
            </h2>
            <p className="sc-lead text-white/80 max-w-xl mx-auto mb-6 text-sm">
              Use our free calculator to see if your offer meets statutory standards. Your employer covers the cost of independent legal advice.
            </p>
            <Link href="/calculator/?reason=performance" className="btn-accent text-sm inline-block">
              Calculate my estimate →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
