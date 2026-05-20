import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Is My Settlement Offer Fair? UK Settlement Check Guide 2026',
  description:
    'Find out if your settlement offer is fair. Compare your offer against statutory minimums, typical UK ranges, and the red flags that signal an offer is too low.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
  },
  openGraph: {
    title: 'Is My Settlement Offer Fair? UK Settlement Check Guide 2026',
    description:
      'Find out if your settlement offer is fair. Compare your offer against statutory minimums, typical UK ranges, and the red flags that signal an offer is too low.',
    url: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'What is the average settlement agreement payout in the UK?',
    a: 'The average depends entirely on statutory entitlement and claim strength. A typical straightforward redundancy settles at 1.5x to 2.5x the statutory minimum. For someone with £8,000 in statutory entitlement, that is £12,000 to £20,000. If there is a discrimination or whistleblowing element, the range rises to 3x to 5x statutory. There is no single UK average because each case starts from a different statutory floor.',
  },
  {
    q: 'Should I accept the first offer?',
    a: 'No. The first offer is almost always below the employer\'s true maximum. If you have any claim strength at all — age, length of service, or disputed circumstances — counter with a higher figure. The employer expects negotiation. A fair counter is to ask the employer to explain the multiplier they have applied to your statutory entitlement. If they cannot justify it, you have room to push.',
  },
  {
    q: 'What happens if I reject a settlement offer?',
    a: 'If you reject a settlement offer, the employer can withdraw it and the negotiation ends. However, you can still pursue a tribunal claim for unfair dismissal, discrimination, or breach of contract. The tribunal route is slower (typically 6 to 9 months), uncertain, and costly in time. A settlement avoids all three — which is why employers prefer a certain, swift, private resolution over tribunal risk. That risk is your leverage.',
  },
  {
    q: 'How long do I have to decide?',
    a: 'UK employment law practice requires a minimum of 10 days to consider a settlement agreement once you have received the draft. If your employer is pushing for less, the agreement may not be legally binding. Use the full time available. A specialist solicitor can review the offer and advise on negotiation typically within 3 to 5 days.',
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
  headline: 'Is My Settlement Offer Fair? How to Tell If Your Offer Matches UK Statutory Rates',
  url: 'https://settlementcheck.co.uk/guides/is-my-settlement-offer-fair/',
  datePublished: '2026-05-20',
  dateModified: '2026-05-20',
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

export default function IsMyOfferFairGuide() {
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
              <span className="text-xs text-ink truncate">Is My Offer Fair?</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Settlement Agreement Guide</p>
            <h1 className="sc-h1 mb-5">
              Most settlement offers fall between 1.5x and 4x the statutory minimum. Here is how to spot if yours is genuinely fair.
            </h1>
            <p className="sc-lead">
              When you receive a settlement offer, your employer is paying to end your employment cleanly. The legal floor in 2026 is statutory redundancy and notice pay, calculated against a weekly pay cap of £751 (SI 2026/310). A fair offer goes beyond that floor and reflects the strength of your position. Use the free calculator below to compare your offer against the statutory baseline instantly.
            </p>
          </div>
        </section>

        {/* What makes it fair */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What makes a settlement offer fair</h2>
            <p className="sc-body mb-6">
              A fair settlement reflects three things: what the law guarantees you, what your specific claim is worth, and what you can realistically negotiate. Most people underestimate both the statutory floor and their claim's ceiling. Fairness is measured in pounds, not assurances.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Your statutory entitlements — redundancy, notice, and holiday pay — form the baseline any offer must meet.',
                'The strength of any discrimination, whistleblowing, or wrongful dismissal claim you hold directly increases the multiplier.',
                'Market comparison: what similar cases in your industry and region typically settle for.',
                'Your bargaining position: how much the employer fears tribunal proceedings relative to the cost of settling higher.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Statutory minimum vs fair offer</h2>
            <p className="sc-body mb-6">
              The statutory minimum is what you are entitled to by law if you take no action. A fair offer acknowledges the employer's settlement risk and gives you a genuine uplift above that floor.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left px-4 py-3 font-medium">Fairness level</th>
                    <th className="text-left px-4 py-3 font-medium">What it includes</th>
                    <th className="text-left px-4 py-3 font-medium">Typical multiplier</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Statutory minimum only', 'Redundancy, notice, holiday — no uplift', '1.0x'],
                    ['Typical fair range', 'Statutory plus settlement uplift', '1.5x to 4.0x'],
                    ['Strong bargaining position', 'Statutory, uplift, and risk premium for a live claim', '4.0x or higher'],
                  ].map(([level, includes, multiplier], i) => (
                    <tr key={level} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{level}</td>
                      <td className="px-4 py-3 text-ink">{includes}</td>
                      <td className="px-4 py-3 text-ink">{multiplier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sc-body text-sm text-muted">
              Example: if your statutory entitlement is £5,000, a 2x offer is £10,000. A credible discrimination or whistleblowing claim can push this to £20,000 or beyond. The compensatory cap for unfair dismissal is the lower of £123,543 or 52 weeks' pay (ERA 1996 s.124).
            </p>
          </div>
        </section>

        {/* Red flags */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Red flags that suggest your offer is too low</h2>
            <ul className="flex flex-col gap-4">
              {[
                'Your offer matches your statutory entitlement exactly. If the redundancy figure and the settlement figure are the same number, the employer has paid you nothing to settle.',
                'The offer is less than three months of your salary. For most earners, a fair range starts at 1.5x statutory — which typically equals at least three months of gross pay.',
                'You were told there is no negotiation room. Employers who say the offer is final are usually testing your response. There is almost always room to move.',
                'The offer contains no itemised breakdown. A fair offer separates redundancy, notice, holiday, and any uplift so you know exactly what each element is worth.',
                'You received the offer with a deadline shorter than 10 days. Rushed timelines signal the employer is managing risk. That urgency is leverage for you.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <WarningIcon />
                  <span className="sc-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Negotiation factors */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-6">What affects how much you can negotiate</h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Age and length of service',
                  body: 'Statutory redundancy scales with both. The formula applies 0.5 weeks per year under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over, capped at 20 years (ERA 1996). An older employee with 15 years\' service has a higher statutory baseline and more leverage in negotiation.',
                },
                {
                  title: 'Claim strength',
                  body: 'Written evidence of discrimination, breach of contract, or unpaid wages increases your claim\'s value. If the reason for your termination is unclear or disputed, your position is stronger. A credible legal claim raises the employer\'s tribunal risk and directly increases what they will pay to settle.',
                },
                {
                  title: 'Employer risk appetite',
                  body: 'Large employers with in-house legal teams often open lower, expecting negotiation. Smaller employers with limited legal budgets sometimes open higher to avoid the cost of a prolonged dispute. Knowing the employer\'s size and sector helps you judge how hard to push.',
                },
                {
                  title: 'Your financial position',
                  body: 'If you have another job lined up or financial runway, you have stronger leverage. If you need the payment quickly, the employer may sense it. Your walk-away point — the minimum you will accept — shapes every counter-offer you make.',
                },
              ].map(({ title, body }) => (
                <div key={title} className="flex gap-4">
                  <CheckIcon />
                  <div>
                    <p className="font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-navy">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Compare your offer against the statutory baseline</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              The free calculator applies April 2026 statutory rates and shows you where your offer sits against typical UK settlement ranges.
            </p>
            <Link
              href="/#calculator"
              className="inline-flex items-center gap-2 bg-coral text-white font-semibold px-7 py-3.5 rounded-full hover:bg-coral/90 transition-colors text-sm"
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
