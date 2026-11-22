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
  title: 'Constructive Dismissal Settlements 2026 | SettlementCheck',
  description:
    'Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/constructive-dismissal-settlement-agreements/',
  },
  openGraph: {
    title: 'Constructive Dismissal Settlements 2026 | SettlementCheck',
    description:
      'Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.',
    url: 'https://settlementcheck.co.uk/guides/constructive-dismissal-settlement-agreements/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constructive Dismissal Settlements 2026 | SettlementCheck',
    description:
      'Free UK constructive dismissal settlement guide. Check 2026 compensation caps (weekly cap £751, max £123,543). No email. Instant fair offer evaluation.',
  },
}

const FAQS = [
  {
    q: 'Can I get a settlement if I have less than two years of service?',
    a: 'Yes, if your resignation was caused by discrimination, whistleblowing, or another automatically unfair reason. In these cases, there is no service requirement. For standard contract breaches, you need two years of continuous service.',
  },
  {
    q: 'How is the compensatory cap applied if I earn over £123,543?',
    a: 'The cap is the lower of £123,543 or 52 weeks of your gross pay. If your gross annual salary is £150,000, your compensatory award is capped at £123,543. If your salary is £50,000, your compensatory award is capped at £50,000.',
  },
  {
    q: 'Does my employer contribute to my legal fees?',
    a: 'Under Section 203(3) ERA 1996, you must receive independent legal advice for the agreement to bind. Employers standardly provide a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. Any excess or abortive work is subject to your solicitor engagement terms.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can legally withdraw it before anything is signed. ACAS Code 4 also recommends 10 calendar days to consider an initial written offer, though this is guidance rather than a strict legal right.',
  },
  {
    q: 'What happens if I reject the settlement offer?',
    a: 'If you decline the offer, your employment contract continues or your resignation stands. You can raise a formal grievance or start ACAS Early Conciliation before the tribunal deadline of three months minus one day.',
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
  headline: 'Constructive Dismissal Settlement Agreements UK (2026 Rules)',
  url: 'https://settlementcheck.co.uk/guides/constructive-dismissal-settlement-agreements/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-06-25',
  dateModified: '2026-07-11',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck Editorial Team',
    url: 'https://settlementcheck.co.uk',
  },
  reviewedBy: {
    '@type': 'Organization',
    name: 'SettlementCheck Legal Research Desk',
    url: 'https://settlementcheck.co.uk/how-it-works/',
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
    '@id': 'https://settlementcheck.co.uk/guides/constructive-dismissal-settlement-agreements/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 95(1)(c)',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/95',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 119',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/119',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 123',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/123',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
  ],
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

export default function ConstructiveDismissalGuide() {
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
              <span className="text-xs text-ink truncate">Constructive Dismissal</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Employment Law Guide</p>
            <h1 className="sc-h1 mb-4">
              Constructive Dismissal Settlement Agreements in the UK (2026 Rules)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; SI 2026/310
            </p>
            <p className="sc-lead leading-relaxed">
              Resigning over a serious breach of contract? Before you sign a draft settlement agreement, check how your offer compares against the 2026 statutory caps. Calculate your baseline in 60 seconds with no email required, see what is taxed as wages, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Micro-Tool */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your exit terms against the statutory basic award (£751/wk cap) and unfair dismissal compensatory cap (£123,543)."
              disputeType="constructive_dismissal"
              statutoryPills={[
                { label: 'Weekly Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Compensatory Cap', value: '£123,543', statute: 'ERA 1996 s.124' },
                { label: 'Tax-Free Shield', value: 'First £30,000', statute: 'ITEPA 2003 s.403' },
              ]}
              initialSalary={52000}
              initialYears={5}
              initialAge={42}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-white p-5">
              <h2 className="font-serif text-[19px] font-[460] text-ink mb-4">Key constructive dismissal rules</h2>
              <ul className="flex flex-col gap-3">
                {[
                  'You need two years of continuous service to pursue a standard constructive dismissal case.',
                  'Under April 2026 rules, standard compensation is capped at the lower of £123,543 or 52 weeks of gross pay.',
                  'Whistleblowing and discrimination cases have no service requirements and offer uncapped compensation.',
                  'Genuine ex-gratia compensation is tax-free up to £30,000, while notice pay and holiday pay are taxed as wages.',
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

        {/* What is constructive dismissal? */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">1. What counts as constructive dismissal?</h2>
            <p className="sc-body mb-6 bg-paper p-5 rounded-xl border border-rule">
              Constructive dismissal occurs when you resign because your employer commits a fundamental breach of your employment contract. The breach must be serious enough to force your departure, and you must resign promptly without accepting it.
            </p>
            <p className="sc-body mb-6">
              Common examples of a fundamental breach include:
            </p>
            <ul className="flex flex-col gap-3 mb-6">
              {[
                'A sudden reduction in your salary without your consent.',
                'Demoting you or stripping core responsibilities without justification.',
                'Failing to address bullying, harassment, or a hostile workplace.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body mb-4">
              You must resign in direct response to the breach and without unreasonable delay.
            </p>
            <p className="sc-body">
              If you remain in your role too long, an employment tribunal may treat you as having accepted the breach.
            </p>
          </div>
        </section>

        {/* The two-year qualifying service rule */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">2. Do I need two years of service to claim?</h2>
            <p className="sc-body mb-4">
              Under Section 108(1) of the Employment Rights Act 1996, ordinary constructive dismissal requires two years of continuous service <sup>1</sup>.
            </p>
            <p className="sc-body mb-4">
              With under two years of service, you generally cannot bring a standard unfair dismissal claim. Exceptions apply if the resignation relates to an automatically unfair reason.
            </p>
            <p className="sc-body mb-6">
              Day-one protection applies where you resigned because of:
            </p>
            <ul className="flex flex-col gap-3 mb-6">
              {[
                'Discrimination based on protected characteristics such as age, race, sex, or disability.',
                'Whistleblowing, meaning reporting illegal activities or regulatory breaches.',
                'Raising workplace health and safety concerns.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
            <p className="sc-body">
              In those day-one cases, Section 111A protected conversation secrecy also does not shield your employer if talks relate to discrimination or whistleblowing.
            </p>
          </div>
        </section>

        {/* Statutory compensation caps for 2026 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">3. What are the 2026 statutory compensation caps?</h2>
            <p className="sc-body mb-6">
              Compensation for constructive dismissal consists of a basic award and a compensatory award. Both awards are subject to statutory limits updated in April 2026.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">The Basic Award</h3>
            <p className="sc-body mb-4">
              The basic award is a statutory calculation based on your age, length of service, and weekly pay. For calculations after 6 April 2026, the statutory weekly pay cap is £751 (SI 2026/310) <sup>2</sup>.
            </p>
            <p className="sc-body mb-4">
              The basic award calculation is:
            </p>
            <ul className="list-disc pl-5 sc-body mb-4 space-y-1">
              <li>1.5 weeks of pay for each year of service completed over the age of 41.</li>
              <li>1 week of pay for each year of service completed between the ages of 22 and 40.</li>
              <li>0.5 weeks of pay for each year of service completed under the age of 21.</li>
            </ul>
            <p className="sc-body mb-6">
              The maximum service counted is 20 years. This means the maximum basic award in 2026 is £22,530 <sup>2</sup>.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">The Compensatory Award</h3>
            <p className="sc-body mb-4">
              The compensatory award is designed to cover your actual financial losses, such as lost salary and pension contributions.
            </p>
            <p className="sc-body mb-6">
              Under Section 124 of the Employment Rights Act 1996 and SI 2026/310, the compensatory award is capped at the lower of <sup>2</sup>:
            </p>
            <ul className="list-disc pl-5 sc-body mb-6 space-y-1">
              <li>£123,543.</li>
              <li>52 weeks of your gross pay.</li>
            </ul>
            <p className="sc-body mb-6">
              These statutory caps do not apply if your resignation relates to discrimination or whistleblowing. In those cases, the compensation you can receive is uncapped.
            </p>

            <div className="rounded-xl border border-rule overflow-hidden mt-8">
              <table className="w-full text-sm">
                <caption className="sr-only">Constructive dismissal compensation limits and statutory awards for 2026/27, sourced from the Employment Rights Act 1996 and SI 2026/310.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Award Type</th>
                    <th className="text-left px-4 py-3 font-medium">Limit for 2026/27</th>
                    <th className="text-left px-4 py-3 font-medium">Statutory Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Weekly Pay Cap', '£751', 'SI 2026/310'],
                    ['Maximum Basic Award', '£22,530', 'ERA 1996 s.227'],
                    ['Compensatory Award Cap', '£123,543 (or 52 weeks\' gross pay)', 'ERA 1996 s.124 / SI 2026/310'],
                    ['Discrimination / Whistleblowing', 'Uncapped', 'ERA 1996 s.124(1A)'],
                  ].map(([type, limit, authority], i) => (
                    <tr key={type} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{type}</td>
                      <td className="px-4 py-3 text-ink">{limit}</td>
                      <td className="px-4 py-3 text-ink font-serif text-xs">{authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Tax rules for constructive dismissal settlements */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">4. How are constructive dismissal settlements taxed?</h2>
            <p className="sc-body mb-6">
              Knowing how HMRC splits your settlement helps you see what arrives in your bank account.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">The £30,000 Tax-Free Exemption</h3>
            <p className="sc-body mb-4">
              Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first £30,000 is tax-free <sup>3</sup>. This applies to genuine ex-gratia compensation for losing your job.
            </p>
            <p className="sc-body mb-4">
              Amounts over £30,000 are subject to income tax, with zero employee National Insurance. See our guide to <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">tax-free settlements</Link>.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">Pay in Lieu of Notice (PILON) and Garden Leave</h3>
            <p className="sc-body mb-4">
              Notice pay, accrued holiday pay, and salary paid during garden leave are always taxed as wages <sup>4</sup>. Under Section 402D of ITEPA 2003, Post-Employment Notice Pay (PENP) is subject to income tax and National Insurance.
            </p>
            <p className="sc-body mb-4">
              This applies even if your total settlement is under £30,000. Read more in our <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax guide</Link>.
            </p>
            <h3 className="text-sm font-semibold text-ink mt-6 mb-3">Legal Fees Contribution</h3>
            <p className="sc-body mb-4">
              Employers standardly provide a capped contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion. This payment does not count toward your £30,000 tax-free exemption.
            </p>
          </div>
        </section>

        {/* Worked examples of settlement calculations */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">5. How do these rules apply in practice?</h2>
            <p className="sc-body mb-6">
              These examples show how the April 2026 statutory caps and tax rules apply.
            </p>
            <div className="flex flex-col gap-6">
              {[
                {
                  title: 'Example 1: Standard constructive dismissal (3 years\' service)',
                  points: [
                    'An employee resigns after an unagreed salary cut. They are aged 35 with three years of service and £800 weekly gross pay.',
                    'Using the £751 weekly cap, the basic award is 3 × £751 = £2,253.',
                    'They agree an ex-gratia compensatory payment of £20,000, bringing the total to £22,253.',
                    'Because the entire sum is genuine termination compensation under £30,000, it is paid free of income tax.',
                  ],
                },
                {
                  title: 'Example 2: Whistleblowing resignation (6 months\' service)',
                  points: [
                    'An employee earning £50,000 resigns after reporting financial malpractice with six months of service. The two-year rule does not apply.',
                    'They agree a termination payment of £55,000 to resolve the dispute.',
                    'The first £30,000 is tax-free, and the remaining £25,000 is subject to income tax with zero employee National Insurance.',
                  ],
                },
              ].map(({ title, points }) => (
                <div key={title} className="rounded-xl border border-rule overflow-hidden">
                  <div className="bg-ink px-4 py-3">
                    <p className="text-white text-[15px] font-medium">{title}</p>
                  </div>
                  <div className="p-4 bg-paper flex flex-col gap-2">
                    {points.map((point, index) => (
                      <p key={index} className="sc-body">{point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Receiving independent legal advice */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">6. Why do I need an independent solicitor?</h2>
            <p className="sc-body mb-4">
              Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is not binding until an independent solicitor advises you <sup>5</sup>. You can also read how <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="underline hover:text-ink">settlement negotiations</Link> work in practice.
            </p>
            <p className="sc-body mb-4">
              Your solicitor checks the terms, including any non-compete restrictions, tax indemnities, and agreed reference wording. Under UK contract law, a counter-proposal rejects the opening offer, so your solicitor helps weigh any revocation risk before you respond.
            </p>
            <p className="sc-body mb-6">
              Employers standardly contribute £350 to £500+ plus VAT toward your legal fees upon completion. Any excess or abortive work is subject to your solicitor engagement terms.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-4 flex gap-3">
              <InfoIcon />
              <p className="sc-body">
                ACAS Code of Practice 4 recommends giving you at least 10 calendar days to consider an initial written offer, though this is guidance rather than a strict legal right.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
              See your statutory baseline, tax split, and commercial settlement range before speaking to a solicitor.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/constructive-dismissal-calculator/" className="btn-accent">
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

        {/* Related Articles */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/constructive-dismissal-calculator/',
                  title: 'Constructive Dismissal Calculator 2026',
                  description: 'Calculate your basic and compensatory award limits under April 2026 statutory rates.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Understand without prejudice rules, tax splits, and legal fee contributions.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/unfair-dismissal-settlement-agreements/',
                  title: 'Unfair Dismissal Settlement Agreements',
                  description: 'Compare statutory caps, Polkey reductions, and ACAS procedural uplifts.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'The £30,000 Tax-Free Exemption',
                  description: 'Check how HMRC treats ex-gratia compensation, PILON, and garden leave.',
                  tag: 'Tax Rules',
                },
                {
                  href: '/guides/can-an-employer-withdraw-a-settlement-agreement/',
                  title: 'Can an Employer Withdraw the Offer?',
                  description: 'Contract law rules on counter-offers, revocation, and ACAS 10-day guidance.',
                  tag: 'Offer Protection',
                },
                {
                  href: '/guides/what-happens-if-you-do-not-sign/',
                  title: 'What Happens if You Do Not Sign?',
                  description: 'Your options and tribunal deadlines if you decline the agreement.',
                  tag: 'Alternatives',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/108" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 108(1) (qualifying period)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (as amended by SI 2026/310)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 403 (tax-free limit)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Section 402D (PILON tax)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 (requirements for validity)
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent introduction service and calculator, not a law firm. The information on this page is for general guidance only and does not constitute formal legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
