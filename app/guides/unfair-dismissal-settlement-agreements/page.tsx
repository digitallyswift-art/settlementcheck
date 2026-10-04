import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Unfair Dismissal Settlement Agreements UK 2026',
  description:
    'Calculate fair unfair dismissal settlements in 2026. Weekly cap £751, max compensatory award £123,543, tax-free limits, Polkey rules, and negotiation steps.',
  alternates: {
    canonical: '/guides/unfair-dismissal-settlement-agreements/',
  },
  openGraph: {
    title: 'Unfair Dismissal Settlement Agreements UK 2026',
    description:
      'Calculate fair unfair dismissal settlements in 2026. Weekly cap £751, max compensatory award £123,543, tax-free limits, Polkey rules, and negotiation steps.',
    url: '/guides/unfair-dismissal-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfair Dismissal Settlement Agreements UK 2026',
    description:
      'Calculate fair unfair dismissal settlements in 2026. Weekly cap £751, max compensatory award £123,543, tax-free limits, Polkey rules, and negotiation steps.',
  },
}

const FAQS = [
  {
    q: 'Can I negotiate an unfair dismissal settlement if I have less than two years of service?',
    a: 'You can negotiate if your dismissal was automatically unfair under statutory exceptions. These include whistleblowing (ERA 1996 s.103A), pregnancy or maternity (s.99), health and safety activities (s.100), or asserting a statutory employment right (s.104). These exceptions give you day-one protection with no minimum qualifying service requirement.',
  },
  {
    q: 'How does the tribunal compensatory cap apply if I earn a high salary?',
    a: 'Under ERA 1996 s.124 as updated by SI 2026/310, the compensatory award is capped at the lower of £123,543 or 52 weeks of your actual gross pay. If your annual salary is £60,000, your compensatory award cannot exceed £60,000. If your annual salary is £150,000, the statutory cap limits your compensatory award to £123,543.',
  },
  {
    q: 'Who pays for my legal advice on the settlement agreement?',
    a: 'Your employer pays or makes a contribution towards your legal fees. Under ERA 1996 s.203(3), you must receive advice from an independent solicitor or certified adviser for the agreement to become binding. Employers typically contribute between £350 and £750 plus VAT directly to your solicitor.',
  },
  {
    q: 'Is my unfair dismissal settlement payment taxable?',
    a: 'The first £30,000 of compensation for loss of office is exempt from income tax and National Insurance under ITEPA 2003 s.403. Any contractual earnings, accrued holiday pay, and Pay in Lieu of Notice (PILON) under ITEPA 2003 s.402D remain fully subject to income tax and National Insurance.',
  },
  {
    q: 'What is a Polkey reduction and how does it affect my settlement value?',
    a: 'A Polkey reduction comes from the case of Polkey v AE Dayton Services Ltd. If an employer dismissed you unfairly on procedural grounds, an employment tribunal can reduce your compensatory award. The reduction reflects the percentage chance that a fair procedure would still have resulted in your dismissal. Employers use this principle during negotiations to lower their opening settlement figures.',
  },
  {
    q: 'What happens if I refuse to sign an unfair dismissal settlement agreement?',
    a: 'If you refuse the offer, you keep your right to bring an employment tribunal claim. You must notify ACAS to begin Early Conciliation before your tribunal deadline expires. The standard time limit to lodge a claim is three months minus one day from your effective date of termination.',
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
  headline: 'Unfair Dismissal Settlement Agreements UK 2026: Compensation Caps & Negotiation Guide',
  url: 'https://settlementcheck.co.uk/guides/unfair-dismissal-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-06-15',
  dateModified: '2026-10-01',
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
    '@id': 'https://settlementcheck.co.uk/guides/unfair-dismissal-settlement-agreements/',
  },
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M4 10.5L8 14.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function UnfairDismissalSettlementAgreementGuide() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides/" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Unfair Dismissal Settlement Agreements</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Employment Law Guide</p>
            <h1 className="sc-h1 mb-5">
              Unfair Dismissal Settlement Agreements UK (2026 Rules)
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>SettlementCheck Legal Analysis</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Statutory baseline: SI 2026/310</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated October 2026</span>
            </div>
            <p className="sc-lead">
              An unfair dismissal settlement agreement is a legally binding contract that resolves an employment dispute out of court. Your employer pays you a financial settlement. In exchange, you agree not to take your unfair dismissal claim to an employment tribunal.
            </p>
          </div>
        </section>

        {/* Answer-First Section */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How unfair dismissal settlements work out of court</h2>
            <p className="sc-body mb-4">
              Under UK employment law, settling an unfair dismissal case out of court depends on statutory caps and realistic financial loss. Tribunals calculate awards in two parts: a basic award and a compensatory award.
            </p>
            <p className="sc-body mb-4">
              From 6 April 2026, the statutory weekly pay cap is £751 (SI 2026/310). The maximum basic award is £22,530. The statutory compensatory award cap is £123,543 or 52 weeks of gross pay, whichever is lower.
            </p>
            <p className="sc-body">
              A fair settlement offer reflects these caps. It also factors in notice pay, realistic time to secure a new job, and the legal costs both sides avoid by not going to a hearing.
            </p>
          </div>
        </section>

        {/* Key Takeaways */}
        <section className="py-10 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-ink uppercase tracking-wider mb-4">Key Takeaways for 2026</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Statutory baseline:</strong> Weekly pay is capped at £751. The maximum basic award is £22,530 under ERA 1996 s.119.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Compensatory award limit:</strong> Statutory cap is £123,543 or 52 weeks of gross pay, whichever is lower (ERA 1996 s.124).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Service requirements:</strong> Ordinary unfair dismissal requires 2 continuous years of service. Automatic unfair dismissal claims apply from day one.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Tax exemption:</strong> The first £30,000 of compensation for loss of employment is tax-free under ITEPA 2003 s.403. Notice pay remains fully taxable.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Employer covers legal costs:</strong> Independent legal advice is mandatory under ERA 1996 s.203(3). Employers pay a legal fee contribution, typically £350 to £750 plus VAT.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 1: What is Unfair Dismissal */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">1. What is unfair dismissal under UK employment law?</h2>
            <p className="sc-body mb-4">
              Under Section 94 of the Employment Rights Act 1996, every qualifying employee has the right not to be unfairly dismissed. For a dismissal to be fair, your employer must satisfy two distinct tests under Section 98.
            </p>
            <p className="sc-body mb-4">
              First, the employer must establish a potentially fair statutory reason. Section 98(2) specifies five valid grounds: capability or qualifications, conduct, redundancy, statutory restriction, or some other substantial reason (SOSR).
            </p>
            <p className="sc-body mb-4">
              Second, the employer must act reasonably in treating that reason as sufficient to dismiss you (Section 98(4)). The employer must follow a fair, balanced procedure before making the decision.
            </p>
            <p className="sc-body">
              If your employer fails to follow fair procedures or lacks genuine grounds, the dismissal is legally unfair. Employers often propose a settlement agreement to resolve the dispute quietly without a public tribunal hearing.
            </p>
          </div>
        </section>

        {/* Section 2: Two-Year Rule & Day-One Exceptions */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">2. The two-year service rule and day-one exceptions</h2>
            <p className="sc-body mb-4">
              To bring a claim for ordinary unfair dismissal, you must have at least two years of continuous service under ERA 1996 s.108(1). If you have less than two years, you generally cannot claim ordinary unfair dismissal.
            </p>
            <p className="sc-body mb-4">
              However, the law grants day-one protection for automatic unfair dismissal. You do not need two years of continuous service if your dismissal falls into any of these statutory categories:
            </p>
            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-sm mb-1">Whistleblowing (ERA 1996 s.103A)</p>
                <p className="sc-body text-sm">
                  Dismissals caused by making a protected disclosure about wrongdoing, legal breaches, or regulatory failures. Compensation for whistleblowing dismissal has no statutory financial cap.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-sm mb-1">Pregnancy and Maternity (ERA 1996 s.99)</p>
                <p className="sc-body text-sm">
                  Dismissals linked to pregnancy, childbirth, maternity leave, or related family leave rights. These claims often include unlawful sex discrimination under the Equality Act 2010.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-sm mb-1">Health and Safety Activities (ERA 1996 s.100)</p>
                <p className="sc-body text-sm">
                  Dismissals for raising workplace safety hazards, acting as a safety representative, or refusing to work in conditions of serious and imminent danger.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-sm mb-1">Asserting Statutory Rights (ERA 1996 s.104)</p>
                <p className="sc-body text-sm">
                  Dismissals for claiming statutory entitlements, such as the National Minimum Wage, statutory annual leave, or correct working time limits.
                </p>
              </div>
            </div>
            <p className="sc-body">
              When an employer faces an automatic unfair dismissal risk, your settlement bargaining position improves significantly. In uncapped claims, settlement figures often exceed standard statutory formulas.
            </p>
          </div>
        </section>

        {/* Section 3: Compensation Caps Comparison Table */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">3. Statutory compensation caps for 2026/27</h2>
            <p className="sc-body mb-4">
              Tribunals calculate unfair dismissal payouts using statutory limits set by the annual Employment Rights (Increase of Limits) Order. For dismissals taking place on or after 6 April 2026, SI 2026/310 governs all caps.
            </p>
            <div className="overflow-x-auto my-6">
              <table className="w-full text-left text-sm border-collapse border border-rule rounded-xl">
                <thead>
                  <tr className="bg-paper border-b border-rule">
                    <th className="py-3 px-4 font-semibold text-ink">Statutory Element</th>
                    <th className="py-3 px-4 font-semibold text-ink">2025/26 Limit</th>
                    <th className="py-3 px-4 font-semibold text-ink">2026/27 Limit (SI 2026/310)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rule">
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Statutory Weekly Pay Cap</td>
                    <td className="py-3 px-4 text-muted">£700</td>
                    <td className="py-3 px-4 text-ink font-semibold">£751</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Maximum Basic Award (20 years)</td>
                    <td className="py-3 px-4 text-muted">£21,000</td>
                    <td className="py-3 px-4 text-ink font-semibold">£22,530</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Compensatory Award Cap</td>
                    <td className="py-3 px-4 text-muted">£115,115 (or 52 wks gross)</td>
                    <td className="py-3 px-4 text-ink font-semibold">£123,543 (or 52 wks gross)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 text-ink font-medium">Whistleblowing Dismissal</td>
                    <td className="py-3 px-4 text-muted">Uncapped</td>
                    <td className="py-3 px-4 text-ink font-semibold">Uncapped</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="sc-body mb-4">
              The basic award mirrors statutory redundancy pay. It uses a formula based on your age, completed years of service (up to 20 years), and your capped weekly gross pay of £751.
            </p>
            <p className="sc-body">
              The compensatory award covers net financial losses resulting directly from the dismissal. This includes lost salary, lost pension contributions, and lost employment benefits while searching for equivalent work.
            </p>
          </div>
        </section>

        {/* Section 4: How Employers Value Settlements */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">4. How employers value an unfair dismissal settlement</h2>
            <p className="sc-body mb-4">
              Employers do not choose settlement numbers at random. Their legal advisers evaluate four key financial and procedural factors before deciding what to offer:
            </p>
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">Actual Financial Loss and Mitigation</h3>
                <p className="sc-body text-sm">
                  Tribunals require employees to mitigate their loss by looking for work. If your industry has high vacancies, employers argue you will find work within three months. If your sector has few openings, your realistic loss may span six to twelve months.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">Notice Pay and Benefits</h3>
                <p className="sc-body text-sm">
                  You are legally entitled to your contractual notice period or statutory notice, whichever is greater. A settlement offer must provide for your notice alongside additional compensation.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">The Polkey Reduction Risk</h3>
                <p className="sc-body text-sm">
                  Under the legal principle from Polkey v AE Dayton Services Ltd, an employer may argue that a fair procedure would have led to your dismissal anyway. If a tribunal agrees, it reduces compensatory awards by a percentage. Employers cite Polkey arguments to justify opening offers below your full claim value.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">ACAS Code 1 Procedural Uplift</h3>
                <p className="sc-body text-sm">
                  Under Section 207A of the Trade Union and Labour Relations (Consolidation) Act 1992, tribunals can increase awards by up to 25% if an employer unreasonably failed to follow the ACAS Code of Practice on disciplinary and grievance procedures. This potential 25% uplift increases your negotiation settlement figure.
                </p>
              </div>
            </div>
            <p className="sc-body">
              An employer also factors in their own legal defence costs. Defending a multi-day unfair dismissal tribunal hearing typically costs an organisation £10,000 to £25,000 plus VAT in legal representation.
            </p>
          </div>
        </section>

        {/* Section 5: Tax Treatment & PILON */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">5. The £30,000 tax-free exemption and PILON rules</h2>
            <p className="sc-body mb-4">
              Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA), the first £30,000 of compensation for termination of employment is free of income tax and employee National Insurance contributions.
            </p>
            <p className="sc-body mb-4">
              However, tax rules strictly separate genuine termination compensation from contractual earnings. Pay in Lieu of Notice (PILON) is treated as taxable earnings under Section 402D of ITEPA 2003. Even if your contract has no PILON clause, the Post-Employment Notice Pay (PENP) statutory formula taxes notice pay as general income.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-4 flex gap-3 my-6">
              <InfoIcon />
              <p className="sc-body text-sm">
                Holiday pay, contractual bonuses, and salary arrears are also subject to ordinary deductions for income tax and National Insurance. Only the ex-gratia compensation element qualifies for the £30,000 exemption.
              </p>
            </div>
            <p className="sc-body">
              Structuring your settlement agreement correctly ensures you receive the full tax benefit permitted by law. Your independent legal adviser will check the tax indemnity clauses before you sign.
            </p>
          </div>
        </section>

        {/* Section 6: Independent Legal Advice */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">6. Independent legal advice and employer fee contributions</h2>
            <p className="sc-body mb-4">
              A settlement agreement is only legally valid if you receive advice from an independent legal adviser (ERA 1996 s.203(3)). The adviser must be an SRA-regulated solicitor, a trade union official, or an advice centre worker holding valid professional indemnity insurance.
            </p>
            <p className="sc-body mb-4">
              Your adviser explains the terms of the agreement and their effect on your ability to pursue employment rights in a tribunal. Without their formal sign-off certificate, the agreement has no legal force.
            </p>
            <p className="sc-body mb-4">
              Because legal advice is a statutory condition, employers contribute towards your legal costs. Standard employer fee contributions range from £350 to £750 plus VAT. For complex negotiations, solicitors often ask the employer to increase this contribution.
            </p>
            <p className="sc-body">
              Your solicitor invoices your employer directly for this agreed sum. You should not have to pay these legal fees yourself when the adviser works within the employer fee allowance.
            </p>
          </div>
        </section>

        {/* Section 7: Step-by-Step Roadmap */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">7. Step-by-step roadmap to settle an unfair dismissal</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Evaluate the initial offer against statutory caps</h3>
                  <p className="sc-body text-sm">
                    Calculate your basic award using the 2026 cap of £751 per week. Estimate your realistic loss of earnings up to the compensatory limit of £123,543. Compare this total to your employer opening figure.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Assess procedural flaws and ACAS Code breaches</h3>
                  <p className="sc-body text-sm">
                    Identify where your employer cut corners. Did they fail to provide evidence? Did they deny you the right to be accompanied? Document these points to support a request for an uplift.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Conduct without prejudice discussions</h3>
                  <p className="sc-body text-sm">
                    Negotiate under Section 111A of ERA 1996 or common-law without prejudice rules. Propose a realistic counter-offer supported by evidence of your ongoing losses and job market realities.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  4
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Instruct an independent solicitor</h3>
                  <p className="sc-body text-sm">
                    Send the draft agreement to your chosen legal adviser. They will review non-financial clauses, including agreed job references, confidentiality wording, and mutual non-derogatory covenants.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  5
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Sign the agreement and receive payment</h3>
                  <p className="sc-body text-sm">
                    Both parties execute the agreement, and your solicitor signs the adviser certificate. Settlement payments are usually transferred to your bank account within 14 to 28 days of completion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Callout Box */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Calculate your unfair dismissal settlement value</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Use our free calculator to model your statutory basic award, compensatory award limits, and tax-free sums in 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/unfair-dismissal-calculator/" className="btn-accent">
                Unfair Dismissal Calculator →
              </Link>
              <Link href="/calculator/?reason=performance" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-rule text-white hover:bg-white/10 transition-colors font-medium text-sm">
                Standard Settlement Calculator
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>

        {/* Related Guides & Calculators */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/unfair-dismissal-calculator/',
                  title: 'Unfair Dismissal Calculator 2026',
                  description: 'Calculate your basic and compensatory award limits under April 2026 employment rates.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Learn how to identify whether your settlement package matches typical UK settlement values.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/settlement-agreement-vs-tribunal-claim/',
                  title: 'Settlement Agreement vs Tribunal Claim',
                  description: 'Compare financial outcomes, legal costs, and stress levels between settling and filing a claim.',
                  tag: 'Comparison',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'The £30,000 Tax-Free Settlement Exemption',
                  description: 'Understand how HMRC treats termination payments, PILON rules, and statutory exemptions.',
                  tag: 'Tax Rules',
                },
              ]}
            />
          </div>
        </section>

        {/* Legal Footnotes */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Authorities & References</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/94" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 94 (The right not to be unfairly dismissed)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/98" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 98 (General fairness criteria and fair reasons for dismissal)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/108" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 108(1) (Qualifying period of two years)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310: weekly cap £751, compensatory cap £123,543)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/119" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 119 (Calculation of basic award)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (Compensatory award limit)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (£30,000 threshold for termination payments)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (Tax treatment of post-employment notice pay / PILON)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 (Restrictions on contracting out and conditions for valid settlement agreements)
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/code-of-practice-on-disciplinary-and-grievance-procedures" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Code of Practice 1 on Disciplinary and Grievance Procedures (Section 207A TULRCA 1992 25% uplift)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent calculation service, not a law firm. The information provided in this guide is for educational purposes only and does not constitute formal legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
