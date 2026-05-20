import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'What Is a Fair Settlement Agreement UK 2026? | SettlementCheck',
  description:
    'A fair settlement agreement pays more than your statutory minimum. Understand the £751 weekly cap, multiplier ranges, and the red flags that signal an offer is too low.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/what-is-a-fair-settlement-agreement/',
  },
  openGraph: {
    title: 'What Is a Fair Settlement Agreement UK 2026? | SettlementCheck',
    description:
      'A fair settlement agreement pays more than your statutory minimum. Understand the £751 weekly cap, multiplier ranges, and the red flags that signal an offer is too low.',
    url: 'https://settlementcheck.co.uk/guides/what-is-a-fair-settlement-agreement/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'How long do I have to decide on a settlement agreement?',
    a: 'Once your employer provides the draft agreement, you have a minimum of 10 calendar days to review it and take independent legal advice. This is standard UK employment law practice and is required for the agreement to be legally binding under ERA 1996 s.203. Your employer cannot require you to sign before this period expires. A specialist solicitor can typically review and advise within 3 to 5 days, leaving time to negotiate if needed.',
  },
  {
    q: 'Does a settlement agreement stop me claiming discrimination?',
    a: 'It can, but only if the agreement specifically identifies the discrimination claim and you have received independent legal advice on it. A generic settlement that does not name the specific claim may not validly waive it. For example, if you were dismissed because of your age, a fair agreement must explicitly state that you are waiving any age discrimination claim. A vague reference to "all claims" may not be sufficient. Before signing, confirm with your solicitor that every claim being waived is clearly identified.',
  },
  {
    q: 'Can I negotiate after I have already been made redundant?',
    a: 'Yes. Redundancy is the starting point for negotiation, not the end. Once you have been made redundant, your statutory entitlement is fixed, but the employer may still offer a settlement agreement to avoid any claims arising from the process. If there were procedural flaws (inadequate consultation, no proper selection process, no warning) or if there are other claim elements, you have leverage. Counter with a specific figure and a brief explanation. Employers expect negotiation.',
  },
  {
    q: 'What happens to my tribunal claim if I sign?',
    a: 'Signing a valid settlement agreement permanently waives the specific claims named in it. You cannot later bring those claims to an employment tribunal, regardless of new evidence. This is why independent legal advice is a legal requirement under ERA 1996 s.203, not a formality. Before signing, your solicitor must confirm exactly which claims you are giving up and what you are receiving in return. The 10-day review period exists to protect you from hasty decisions under pressure.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <Nav />
      <main>
        {/* Hero */}
        <section className="bg-paper pt-14 pb-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="flex items-center gap-2 mb-6">
              <Link href="/guides" className="text-xs font-medium text-muted hover:text-ink transition-colors tracking-wide uppercase">
                Guides
              </Link>
              <span className="text-muted text-xs">/</span>
              <span className="text-xs text-ink truncate">What Is a Fair Settlement Agreement?</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Settlement Agreement Guide</p>
            <h1 className="sc-h1 mb-5">
              A fair settlement agreement in 2026 pays more than your statutory minimum. Here is what the law guarantees you and how to spot when your employer is offering less.
            </h1>
            <p className="sc-lead">
              When your employer offers a settlement agreement, they are paying you to end your employment cleanly and waive your right to bring a tribunal claim. The legal floor is calculated against a weekly pay cap of £751 (SI 2026/310, ERA 1996 s.227). A fair offer goes beyond that floor. This guide shows you how to calculate what the law guarantees you and how to judge whether the number on the table is genuinely fair.
            </p>
          </div>
        </section>

        {/* What a settlement agreement is */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What a settlement agreement actually is</h2>
            <p className="sc-body mb-4">
              A settlement agreement is a private contract between you and your employer. Your employer is not required by law to offer one. They offer it because they want certainty: once you sign, you give up your right to bring a claim to an employment tribunal for the specific matters named in the agreement.
            </p>
            <p className="sc-body mb-4">
              The agreement is only legally binding if it meets specific conditions set out in ERA 1996 s.203. One of those conditions is that you must receive independent legal advice before signing. This is not a courtesy or a formality. Without it, the agreement is likely unenforceable and you retain your right to bring tribunal claims.
            </p>
            <p className="sc-body mb-4">
              Your employer typically pays your legal fees. The standard contribution is £250 to £750, though you can negotiate this higher. Your solicitor reviews the agreement, explains what rights you are waiving, advises whether the figure is fair, and can flag unfair terms for negotiation.
            </p>
            <p className="sc-body">
              The first figure your employer offers is rarely their maximum. It is a starting point. Employers know that tribunal proceedings cost them far more in management time, legal fees, and uncertainty than a modest increase on the initial offer. You have leverage. Use it.
            </p>
          </div>
        </section>

        {/* Legal validity conditions */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What makes a settlement agreement legally valid</h2>
            <p className="sc-body mb-6">
              Your settlement agreement will only be enforceable if all five of these conditions are met (ERA 1996 s.203). If any one is missing, the agreement is vulnerable to challenge.
            </p>
            <ul className="flex flex-col gap-4">
              {[
                { title: 'It must be in writing', body: 'An oral agreement is not a valid settlement under UK employment law, regardless of how clearly it was agreed.' },
                { title: 'It must identify the specific claims being waived', body: 'A fair agreement names exactly what you are giving up. A generic clause covering "all claims arising from employment" may not validly waive a specific claim such as discrimination if that claim is not expressly named.' },
                { title: 'You must receive independent legal advice', body: 'A qualified, insured solicitor must advise you on the terms and the effect of the agreement before you sign. This is a legal requirement, not a suggestion.' },
                { title: 'The agreement must identify your legal adviser', body: 'The contract must name the solicitor or their firm and confirm that you have received independent legal advice.' },
                { title: 'The adviser must be qualified and insured', body: 'Your solicitor must hold professional indemnity insurance and be regulated by the Solicitors Regulation Authority. If they are not SRA-regulated, the agreement may not be binding.' },
              ].map(({ title, body }) => (
                <li key={title} className="flex items-start gap-3">
                  <CheckIcon />
                  <div>
                    <p className="text-sm font-semibold text-ink mb-0.5">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What counts as a fair amount */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What counts as a fair amount</h2>
            <p className="sc-body mb-6">
              The fairness of a settlement offer is measured in pounds, not in reassurances. It has three layers: the statutory floor, the uplift, and the claim multiplier.
            </p>

            {/* Statutory floor */}
            <h3 className="text-base font-semibold text-ink mb-3">The statutory floor: what the law guarantees you</h3>
            <p className="sc-body mb-4">
              By law, you are entitled to statutory redundancy pay (if applicable), notice pay, and accrued holiday pay. The statutory floor is not negotiable. It is yours by right. Here is a worked example:
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <p className="text-sm font-semibold text-ink mb-3">Example: Sarah, age 38, 8 years service, earning £32,000 per year (£615/week)</p>
              <div className="flex flex-col gap-2">
                {[
                  ['Statutory redundancy', '8 years x 1 week (age 22-40) x £615 = £4,920'],
                  ['Notice pay (4 weeks contracted)', '4 x £615 = £2,460'],
                  ['Holiday (5 weeks accrued)', '5 x £615 = £3,075'],
                  ['Statutory floor', '£10,455'],
                ].map(([label, value], i) => (
                  <div key={label} className={`flex justify-between text-sm ${i === 3 ? 'border-t border-rule pt-2 font-semibold text-ink' : 'text-muted'}`}>
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted mt-3">Sarah earns £615/week, below the £751 cap, so her actual salary is used in the redundancy calculation.</p>
            </div>

            {/* Multiplier table */}
            <h3 className="text-base font-semibold text-ink mb-3">The multiplier: from 1x to 4x and beyond</h3>
            <p className="sc-body mb-4">
              A settlement offer above the statutory floor is typically described as a multiplier of that floor. The multiplier reflects your bargaining position and the strength of any employment claims you hold.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Multiplier</th>
                    <th className="text-left px-4 py-3 font-medium">What it means</th>
                    <th className="text-left px-4 py-3 font-medium">For Sarah (£10,455 floor)</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['1.0x', 'Statutory minimum only. No uplift offered.', '£10,455'],
                    ['1.5x to 2.5x', 'Typical fair range. Employer paying to avoid risk.', '£15,682 to £26,137'],
                    ['2.5x to 4.0x', 'Strong position. Disputed process or claim element.', '£26,137 to £41,820'],
                    ['4.0x or higher', 'Very strong claim: discrimination, whistleblowing.', '£41,820+'],
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
            <h3 className="text-base font-semibold text-ink mb-3">What raises your multiplier</h3>
            <div className="flex flex-col gap-4">
              {[
                {
                  title: 'Discrimination claim',
                  body: 'If the dismissal involved age, sex, race, disability, pregnancy, or another protected characteristic, your claim value rises significantly. A credible discrimination claim typically supports a 3x to 5x multiplier or higher. Compensation is not subject to the unfair dismissal cap.',
                },
                {
                  title: 'Whistleblowing',
                  body: 'If you were dismissed or treated unfairly after raising a safety, legal, or public interest concern, the employer faces very high tribunal risk. Whistleblowing claims are not capped under ERA 1996 s.124. A credible whistleblowing claim supports a 4x to 6x multiplier or more.',
                },
                {
                  title: 'Unfair dismissal with procedural flaws',
                  body: 'If your employer failed to follow a fair process (no warning, no hearing, no proper investigation), your unfair dismissal claim is stronger. The compensatory cap is the lower of £123,543 or 52 weeks\' pay (ERA 1996 s.124). A clear procedural failure pushes your offer toward the upper range.',
                },
                {
                  title: 'Long service (10 or more years)',
                  body: 'Long-serving employees have higher statutory redundancy, raising the absolute pound value of the floor. They also have stronger leverage because their knowledge and institutional value is harder to replace. Employers are more risk-averse about tribunal claims from long-serving employees.',
                },
                {
                  title: 'Senior role or high earner',
                  body: 'The weekly cap of £751 means high earners hit the ceiling in the statutory formula. However, the compensatory cap of £123,543 applies to the total settlement. Senior employees with strong claims often negotiate offers well above the statutory formula.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-ink text-sm mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How to calculate the statutory minimum */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How to calculate the statutory minimum your employer must pay</h2>
            <p className="sc-body mb-6">
              Statutory redundancy is calculated in three steps. This is the figure your employer cannot legally fall below.
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Find your weekly pay (capped at £751)',
                  body: 'Divide your annual gross salary by 52. If the result exceeds £751, use £751. If it is below £751, use your actual weekly pay. This is the April 2026 cap under SI 2026/310 (ERA 1996 s.227).',
                },
                {
                  n: 2,
                  title: 'Apply the age multiplier to each year of service',
                  body: 'Under 22: 0.5 weeks per year. Age 22 to 40: 1 week per year. Age 41 and over: 1.5 weeks per year. The multiplier for each year of service depends on your age during that year.',
                },
                {
                  n: 3,
                  title: 'Multiply by your qualifying years of service (maximum 20)',
                  body: 'Count complete years only. The maximum is 20 years (ERA 1996 s.162). Years before the age-cutoffs count at the lower rate: if you are 42 with 8 years\' service, only the years served from age 41 onward count at 1.5x.',
                },
                {
                  n: 4,
                  title: 'Add notice pay and holiday pay',
                  body: 'The statutory redundancy figure is the starting component. Add your contractual notice pay (or PILON if you are not working notice) and any accrued but untaken holiday. These are separate entitlements, not part of redundancy.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Tax treatment */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How tax affects what you actually receive</h2>
            <p className="sc-body mb-4">
              Your settlement figure and your take-home figure are not the same. How the payment is structured determines how much tax you pay.
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
                    ['PILON (notice paid but not worked)', 'Always taxed as earnings', 'ITEPA 2003 s.402D'],
                    ['Holiday pay', 'Taxed as earnings', 'Standard employment income'],
                    ['Amount above £30,000 threshold', 'Taxed as earnings at your marginal rate', 'ITEPA 2003 s.403'],
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
            <p className="sc-body text-sm text-muted">
              PILON sits outside the £30,000 tax-free limit entirely. It is taxed as normal salary, with income tax and National Insurance deducted before payment. How a settlement is structured between PILON and other components directly affects your net take-home.
            </p>
          </div>
        </section>

        {/* Red flags */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Red flags that suggest your offer is unfair</h2>
            <ul className="flex flex-col gap-4">
              {[
                'The offer equals your statutory entitlement exactly. If redundancy, notice, and holiday add up to the same figure as the settlement, your employer has offered you nothing to settle. They have calculated what they owe you by law and added zero.',
                'You were given fewer than 10 days to decide. UK employment law practice requires a minimum of 10 calendar days from when the draft is presented. A shorter deadline is a pressure tactic, not a legal constraint. If you are being rushed, the employer is protecting themselves, not being fair.',
                'The offer contains no itemised breakdown. A fair offer lists redundancy, notice, holiday, and any uplift as separate figures. A single lump sum with no detail makes it impossible to verify that all components are present and correct.',
                'There is no mention of a potential claim, but the circumstances are unclear. If your dismissal involved disputed reasons, unexplained selection, or events shortly after you raised a concern, a fair agreement names those potential claims explicitly. Silence on a possible claim does not mean you have waived it.',
                'Your employer said the offer is final in the first communication. A "final offer" on day one is a negotiating position. In practice, employers almost always have room to move. The statement is designed to discourage you from pushing back, not to describe an actual ceiling.',
                'Legal fees are not being contributed. If your employer is offering a settlement but refusing to pay any contribution toward your independent legal advice, that is a red flag. Independent legal advice is a legal requirement for the agreement to be binding. Employers who resist contributing are making it harder for you to protect yourself.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <WarningIcon />
                  <span className="sc-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* What to do if low */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What to do if your offer feels too low</h2>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Calculate your statutory baseline',
                  body: 'Use the calculator on this site to confirm your statutory redundancy, notice, and holiday entitlement. This is your floor. Any settlement offer below this figure is unlawful.',
                },
                {
                  n: 2,
                  title: 'Identify any additional claim elements',
                  body: 'Ask yourself: was the dismissal process fair? Were there any protected characteristics involved? Did you raise a concern before dismissal? Are there unpaid wages or breached contractual promises? Each "yes" raises your position and supports a higher counter-offer.',
                },
                {
                  n: 3,
                  title: 'Make a specific, reasoned counter-offer in writing',
                  body: 'Do not respond emotionally. State your statutory entitlement, explain the multiplier you are applying and why, and give a specific pound figure. For example: "My statutory entitlement is £10,455. Your offer of £11,000 is 1.05x statutory and provides no uplift for the disputed dismissal circumstances. A fair offer is 2.5x statutory: £26,137. I am willing to discuss a figure between £18,000 and £26,137." This approach shows you know your numbers and you are serious.',
                },
                {
                  n: 4,
                  title: 'Instruct a solicitor before you sign',
                  body: 'Your solicitor confirms whether the final figure is fair, ensures the agreement protects your interests, and checks that all valid claims are correctly captured. Your employer typically pays their fees as part of the settlement. Do not sign without legal advice regardless of time pressure.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">See what your offer should be worth</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              The free calculator applies April 2026 statutory rates and shows your statutory floor, estimated net take-home, and a verdict on whether your offer is fair.
            </p>
            <Link
              href="/#calculator"
              className="btn-accent"
            >
              Check my offer now
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
