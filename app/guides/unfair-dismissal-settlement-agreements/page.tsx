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
  title: 'Unfair Dismissal Settlement Calculator | SettlementCheck',
  description:
    'Calculate fair unfair dismissal settlements in 2026. £751 weekly cap, £123,543 max compensatory award, tax rules, Polkey reductions, and legal steps.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/unfair-dismissal-settlement-agreements/',
  },
  openGraph: {
    title: 'Unfair Dismissal Settlement Calculator | SettlementCheck',
    description:
      'Calculate fair unfair dismissal settlements in 2026. £751 weekly cap, £123,543 max compensatory award, tax rules, Polkey reductions, and legal steps.',
    url: 'https://settlementcheck.co.uk/guides/unfair-dismissal-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfair Dismissal Settlement Calculator | SettlementCheck',
    description:
      'Calculate fair unfair dismissal settlements in 2026. £751 weekly cap, £123,543 max compensatory award, tax rules, Polkey reductions, and legal steps.',
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
    a: 'Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. Any excess or abortive work is subject to your solicitor engagement terms. Under ERA 1996 s.203(3), independent legal advice is mandatory for the waiver to bind.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can withdraw it before signature. ACAS Code 4 recommends 10 calendar days to consider an initial written offer, though this is guidance rather than a strict legal right.',
  },
  {
    q: 'Is my unfair dismissal settlement payment taxable?',
    a: 'The first £30,000 of compensation for loss of office is exempt from income tax and National Insurance under ITEPA 2003 s.403. Any contractual earnings, accrued holiday pay, garden leave salary, and Pay in Lieu of Notice (PILON) under ITEPA 2003 s.402D are taxed as wages.',
  },
  {
    q: 'What is a Polkey reduction and how does it affect my settlement value?',
    a: 'A Polkey reduction comes from Polkey v AE Dayton Services Ltd. If an employer dismissed you unfairly on procedural grounds, an employment tribunal can reduce your compensatory award by the percentage chance a fair procedure would still have led to dismissal.',
  },
  {
    q: 'What happens if I refuse to sign an unfair dismissal settlement agreement?',
    a: 'If you decline the offer, you keep your right to bring an employment tribunal claim. You must notify ACAS to begin Early Conciliation before the standard time limit of three months minus one day from your effective date of termination.',
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
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">Unfair Dismissal Settlement Agreements</span>
            </div>
            <h1 className="sc-h1 mb-4">
              Unfair Dismissal Settlement Agreements UK (2026 Rules)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; SI 2026/310
            </p>
            <p className="sc-lead leading-relaxed">
              Handed a settlement agreement after a dismissal or capability process? Check how your employer&apos;s offer compares against the April 2026 statutory caps. Calculate your baseline in 60 seconds with no email required, see what is taxed as wages, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Evaluate the statutory basic award (£751/wk cap) and compensatory award limit (£123,543 or 52 weeks salary)."
              disputeType="unfair_dismissal"
              statutoryPills={[
                { label: 'Basic Award Cap', value: '£22,530', statute: 'ERA 1996 s.119' },
                { label: 'Compensatory Cap', value: '£123,543', statute: 'ERA 1996 s.124' },
                { label: 'Tax-Free Shield', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
              ]}
              initialSalary={48000}
              initialYears={4}
              initialAge={41}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Answer-First Section */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How do unfair dismissal settlements work out of court?</h2>
            <p className="sc-body mb-4">
              Settling an unfair dismissal dispute out of court depends on statutory caps and realistic financial loss. Tribunals calculate awards in two parts: a basic award and a compensatory award.
            </p>
            <p className="sc-body mb-4">
              From 6 April 2026, the statutory weekly pay cap is £751 (SI 2026/310), giving a maximum basic award of £22,530. The compensatory award cap is £123,543 or 52 weeks of gross pay, whichever is lower.
            </p>
            <p className="sc-body">
              A commercial settlement reflects these caps alongside notice pay, job-search time, and avoided tribunal defence costs.
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
                    <strong>Tax exemption:</strong> The first £30,000 of genuine compensation is tax-free under ITEPA 2003 s.403. Notice pay and garden leave are taxed as wages.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">
                    <strong>Employer legal fee contribution:</strong> Independent legal advice is mandatory under ERA 1996 s.203(3). Employers standardly contribute £350 to £500+ plus VAT upon completion, with any excess or abortive work subject to your solicitor engagement terms.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 1: What is Unfair Dismissal */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. What is unfair dismissal under UK employment law?</h2>
            <p className="sc-body mb-4">
              Under Section 94 of the Employment Rights Act 1996, qualifying employees have the right not to be unfairly dismissed. For a dismissal to be fair, your employer must satisfy two tests under Section 98.
            </p>
            <p className="sc-body mb-4">
              First, the employer must show a potentially fair reason under Section 98(2): capability, conduct, redundancy, statutory restriction, or some other substantial reason (SOSR).
            </p>
            <p className="sc-body">
              Second, under Section 98(4), the employer must act reasonably and follow a fair procedure. When either test is in doubt, employers often propose a settlement agreement to avoid a public tribunal hearing.
            </p>
          </div>
        </section>

        {/* Section 2: Two-Year Rule & Day-One Exceptions */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. Do I need two years of service to claim?</h2>
            <p className="sc-body mb-4">
              Ordinary unfair dismissal requires at least two years of continuous service under ERA 1996 s.108(1). With less than two years, you generally cannot bring an ordinary unfair dismissal claim.
            </p>
            <p className="sc-body mb-4">
              Day-one protection applies to automatic unfair dismissal. You do not need two years of service if your dismissal falls into these statutory categories:
            </p>
            <div className="space-y-3 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-[15px] mb-1">Whistleblowing (ERA 1996 s.103A)</p>
                <p className="sc-body">
                  Dismissals caused by making a protected disclosure about wrongdoing or regulatory breaches. Compensation has no statutory cap. Read our guide on{' '}
                  <Link href="/guides/whistleblowing-settlement-agreements/" className="text-coral underline hover:text-ink">
                    whistleblowing settlement agreements
                  </Link>
                  .
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-[15px] mb-1">Pregnancy and Maternity (ERA 1996 s.99)</p>
                <p className="sc-body">
                  Dismissals linked to pregnancy, childbirth, maternity leave, or family leave rights. These claims often sit alongside sex discrimination under the Equality Act 2010.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-[15px] mb-1">Health and Safety Activities (ERA 1996 s.100)</p>
                <p className="sc-body">
                  Dismissals for raising workplace safety hazards, acting as a safety representative, or refusing work in serious and imminent danger.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <p className="font-semibold text-ink text-[15px] mb-1">Asserting Statutory Rights (ERA 1996 s.104)</p>
                <p className="sc-body">
                  Dismissals for claiming statutory entitlements such as the National Minimum Wage, statutory annual leave, or working time limits.
                </p>
              </div>
            </div>
            <p className="sc-body">
              Where automatic unfair dismissal or discrimination applies, Section 111A confidentiality does not shield pre-termination talks and compensation can be uncapped.
            </p>
          </div>
        </section>

        {/* Section 3: Compensation Caps Comparison Table */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. What are the 2026/27 statutory compensation caps?</h2>
            <p className="sc-body mb-4">
              Tribunals calculate unfair dismissal payouts using statutory limits updated each April. For dismissals on or after 6 April 2026, SI 2026/310 governs all caps.
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
              The basic award mirrors statutory redundancy pay. It uses your age, completed years of service (up to 20 years), and capped weekly gross pay of £751.
            </p>
            <p className="sc-body">
              The compensatory award covers net financial losses caused by the dismissal, including lost salary, pension contributions, and benefits while seeking new work.
            </p>
          </div>
        </section>

        {/* Section 4: How Employers Value Settlements */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">4. How do employers value an unfair dismissal settlement?</h2>
            <p className="sc-body mb-4">
              Employers and their legal advisers weigh four practical factors when setting an opening figure:
            </p>
            <div className="space-y-4 mb-6">
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">Actual Financial Loss and Mitigation</h3>
                <p className="sc-body">
                  Tribunals expect employees to mitigate loss by looking for new work. Employers model how many months it is likely to take to replace your salary in your sector.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">Notice Pay and Benefits</h3>
                <p className="sc-body">
                  You remain entitled to contractual or statutory notice, whichever is greater. A settlement offer sets out how notice or garden leave is handled alongside compensation.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">The Polkey Reduction Risk</h3>
                <p className="sc-body">
                  Under Polkey v AE Dayton Services Ltd, a tribunal can reduce compensatory awards if a fair procedure would still have led to dismissal. Employers often cite Polkey when pricing opening offers.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-white">
                <h3 className="text-sm font-semibold text-ink mb-1">ACAS Code 1 Procedural Uplift</h3>
                <p className="sc-body">
                  Under Section 207A of TULRCA 1992, tribunals can uplift awards by up to 25% for unreasonable breaches of the ACAS Code of Practice on disciplinary and grievance procedures.
                </p>
              </div>
            </div>
            <p className="sc-body">
              Employers also factor in their own legal defence costs and management time for a multi-day employment tribunal hearing.
            </p>
          </div>
        </section>

        {/* Section 5: Tax Treatment & PILON */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">5. How are unfair dismissal settlements taxed?</h2>
            <p className="sc-body mb-4">
              Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA), the first £30,000 of genuine termination compensation is free of income tax and employee National Insurance.
            </p>
            <p className="sc-body mb-4">
              Notice pay, garden leave salary, and Pay in Lieu of Notice (PILON) are taxed as wages under Section 402D of ITEPA 2003. Even without a PILON clause, the Post-Employment Notice Pay (PENP) formula taxes unworked notice as regular earnings.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-4 flex gap-3 my-6">
              <InfoIcon />
              <p className="sc-body">
                Holiday pay, contractual bonuses, and salary arrears are also taxed as wages. Only the genuine ex-gratia compensation element qualifies for the £30,000 exemption.
              </p>
            </div>
            <p className="sc-body">
              Your independent solicitor will check the tax indemnity wording before you sign.
            </p>
          </div>
        </section>

        {/* Section 6: Independent Legal Advice */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">6. Who pays for independent legal advice?</h2>
            <p className="sc-body mb-4">
              A settlement agreement is only legally binding if you receive advice from an independent legal adviser (ERA 1996 s.203(3)). Your adviser must be an SRA-regulated solicitor, a certified trade union official, or an insured advice centre worker.
            </p>
            <p className="sc-body mb-4">
              Your adviser explains the terms, including any non-compete clauses, confidentiality terms, and your waiver of tribunal claims. Without their formal adviser certificate, the agreement has no legal force.
            </p>
            <p className="sc-body">
              Employers standardly provide a capped contribution of £350 to £500+ plus VAT directly to your solicitor upon completion. Any excess or abortive work is subject to your solicitor engagement terms.
            </p>
          </div>
        </section>

        {/* Section 7: Step-by-Step Roadmap */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-6">7. How does the settlement process work step by step?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  1
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Compare the initial offer against statutory caps</h3>
                  <p className="sc-body">
                    Calculate your basic award using the 2026 cap of £751 per week. Estimate your realistic loss of earnings up to the £123,543 compensatory limit to benchmark the opening figure.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  2
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Review procedural steps and ACAS Code compliance</h3>
                  <p className="sc-body">
                    Review the procedure your employer followed. Note any missing investigation steps, unshared evidence, or denied accompaniment rights to discuss with your solicitor.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  3
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Check without prejudice status and timelines</h3>
                  <p className="sc-body">
                    Section 111A shields ordinary unfair dismissal talks, not discrimination, whistleblowing, or improper behaviour. Under contract law, a counter-proposal rejects the original offer, and ACAS Code 4 recommends 10 calendar days as guidance rather than a strict legal right.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  4
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Take independent legal advice</h3>
                  <p className="sc-body">
                    Share the draft with an independent solicitor. They review non-financial clauses such as agreed references, non-compete restrictions, and mutual non-derogatory wording.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-coral/10 text-coral font-bold flex items-center justify-center text-sm">
                  5
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink mb-1">Sign the agreement and receive payment</h3>
                  <p className="sc-body">
                    Both parties sign the agreement and your solicitor completes the adviser certificate. Settlement sums are typically paid within 14 to 28 days of completion.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator Callout Box */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              See your statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/unfair-dismissal-calculator/" className="btn-accent">
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
                  description: 'Compare financial outcomes, legal costs, and timelines between settling and filing a claim.',
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
