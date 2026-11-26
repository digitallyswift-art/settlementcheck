import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import RelatedArticles from '@/components/RelatedArticles'
import FaqAccordion from '@/components/FaqAccordion'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Average Settlement Payout UK 2026 | SettlementCheck',
  description:
    'See official UK settlement agreement benchmarks and statutory redundancy caps (£751/wk). Free 2-minute valuation. SRA solicitor review guidance.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/average-settlement-agreement-payout-uk/',
  },
  openGraph: {
    title: 'Average Employment Settlement Payout UK | SettlementCheck',
    description:
      'Free UK settlement agreement payout guide. Illustrative ranges (£5,000 to £25,000) and April 2026 redundancy pay caps (£751/wk). No email required.',
    url: 'https://settlementcheck.co.uk/guides/average-settlement-agreement-payout-uk/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Average Employment Settlement Payout UK | SettlementCheck',
    description:
      'Free UK settlement agreement payout guide. Illustrative ranges (£5,000 to £25,000) and April 2026 redundancy pay caps (£751/wk). No email required.',
  },
}

const FAQS = [
  {
    q: 'What is the average settlement agreement payout in the UK?',
    a: 'Private settlement agreements have no official national average. Illustrative UK commercial ranges and Ministry of Justice tribunal statistics suggest standard disputes often settle between £5,000 and £25,000. The final figure depends on your salary, service length, notice period, and any potential legal claims.',
  },
  {
    q: 'Do I have to pay tax on my settlement agreement?',
    a: 'Under Section 403 of ITEPA 2003, the first £30,000 of genuine compensation for loss of employment is usually tax-free. Contractual notice pay (PILON), holiday pay, and garden leave salary are always taxed as wages under Section 402D.',
  },
  {
    q: 'Who pays my solicitor legal fees for a settlement agreement?',
    a: 'Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion to meet Section 203(3) ERA 1996 advice rules. That contribution usually covers reviewing and advising on the draft. Excess or abortive work is subject to your solicitor engagement terms.',
  },
  {
    q: 'Can my employer withdraw the offer if I ask for more?',
    a: 'Yes. Under UK contract law, making a counter-proposal rejects the original offer, so your employer can legally withdraw it before anything is signed. ACAS Code of Practice 4 recommends 10 calendar days to consider an offer, though this is guidance rather than a binding legal right.',
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
  headline: 'Average Settlement Agreement Payout UK 2026: What Is a Normal Offer?',
  url: 'https://settlementcheck.co.uk/guides/average-settlement-agreement-payout-uk/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-26',
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
    '@id': 'https://settlementcheck.co.uk/guides/average-settlement-agreement-payout-uk/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 162',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/162',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
    },
  ],
}

export default function AveragePayoutGuide() {
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
              Average Settlement Agreement Payout UK (2026)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; ITEPA 2003
            </p>
            <p className="sc-lead leading-relaxed">
              Looking at a draft settlement agreement and wondering if the number is normal? Private settlements have no official national average. Check your calculated statutory baseline in 60 seconds with no email required, compare illustrative UK ranges, and prepare clear questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Article Body */}
        <section className="bg-card py-14">
          <div className="max-w-2xl mx-auto px-5 space-y-12">

            {/* Interactive Calculator Immediately Below Hero */}
            <section className="my-2">
              <EmbeddedCalculatorCard
                badge="April 2026 Statutory Check"
                title="How does your offer compare to the statutory baseline?"
                subtitle="Compare your employer's offer against your calculated statutory baseline and illustrative 1 to 3 months gross commercial ranges."
                disputeType="average_payout"
                statutoryPills={[
                  { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                  { label: 'Commercial Range', value: '1 to 3 Months Gross', statute: 'Observed Norm' },
                  { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
                ]}
                initialSalary={50000}
                initialYears={4}
                initialAge={38}
                ctaText="Check my offer now →"
              />
            </section>

            {/* Quick Answer Callout */}
            <div className="bg-paper-2 border border-rule rounded-xl p-6 md:p-8">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-[#FBF0EE] text-[#A8341F]">
                  Statutory Quick Answer
                </span>
                <span className="text-[12px] font-medium text-muted">
                  April 2026 UK Rates
                </span>
              </div>
              <h2 className="guide-h2 mb-3">
                What is the average settlement agreement payout in the UK?
              </h2>
              <p className="guide-body mb-4">
                Private settlement agreements are confidential, so there is no official national average. Illustrative UK commercial ranges and Ministry of Justice employment tribunal statistics show standard disputes often settle between £5,000 and £25,000. That typically equals 1 to 3 months of gross salary on top of contractual notice pay.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-rule text-xs">
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Illustrative UK Range</span>
                  <span className="font-bold text-ink text-sm">£5,000 to £25,000</span>
                  <span className="text-muted text-[12px]">1 to 3 months gross ex-gratia</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Statutory Weekly Pay Cap</span>
                  <span className="font-bold text-ink text-sm">£751 (GB) / £783 (NI)</span>
                  <span className="text-muted text-[12px]">Under SI 2026/310</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Tax-Free Exemption</span>
                  <span className="font-bold text-ink text-sm">First £30,000 tax-free</span>
                  <span className="text-muted text-[12px]">ITEPA 2003 Section 403</span>
                </div>
                <div className="flex flex-col gap-0.5 p-3 rounded-lg border border-rule bg-card">
                  <span className="text-muted uppercase font-bold tracking-wider text-[10px]">Legal Fee Contribution</span>
                  <span className="font-bold text-ink text-sm">£350 to £500+ plus VAT</span>
                  <span className="text-muted text-[12px]">Paid on completion (ERA 1996 s.203)</span>
                </div>
              </div>
              <p className="text-[12px] text-muted mt-3">
                * Illustrative ranges draw on reported commercial terms and Ministry of Justice tribunal statistics. Actual figures depend on your contract and dispute merits.
              </p>
            </div>

            {/* Section 1: Scenario Benchmarks */}
            <div className="space-y-4">
              <h2 className="guide-h2">1. What do UK settlement payouts look like by scenario?</h2>
              <p className="guide-body">
                Settlement figures depend heavily on why you are leaving and whether you qualify for statutory claims. Employees generally need two years of continuous service to bring an ordinary unfair dismissal claim or receive statutory redundancy pay.
              </p>
              <p className="guide-body">
                For ordinary unfair dismissal, the statutory compensatory award is capped at £123,543 or 52 weeks of gross pay, whichever is lower. Employers factor that legal exposure into their opening offer.
              </p>

              <div className="rounded-xl border border-rule overflow-hidden mt-4">
                <table className="w-full text-sm">
                  <caption className="sr-only">Illustrative settlement agreement payout ranges by scenario UK 2026</caption>
                  <thead>
                    <tr className="bg-ink text-white">
                      <th className="text-left px-4 py-3 font-medium">Departure Scenario</th>
                      <th className="text-left px-4 py-3 font-medium">Illustrative Range</th>
                      <th className="text-left px-4 py-3 font-medium">Typical Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [
                        'Straightforward Redundancy',
                        '£5,000 to £15,000',
                        '1.5x to 2.5x calculated statutory baseline',
                      ],
                      [
                        'Procedural Unfair Dismissal',
                        '£8,000 to £25,000',
                        '2.0x to 3.5x calculated statutory baseline',
                      ],
                      [
                        'Whistleblowing or Discrimination',
                        '£20,000 to £75,000+',
                        'Uncapped claims; Vento injury to feelings',
                      ],
                    ].map(([scenario, range, multiplier], i) => (
                      <tr key={scenario} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                        <td className="px-4 py-3 text-ink font-medium">{scenario}</td>
                        <td className="px-4 py-3 text-ink">{range}</td>
                        <td className="px-4 py-3 text-muted">{multiplier}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 2: Components & Tax */}
            <div className="space-y-4">
              <h2 className="guide-h2">2. What makes up a settlement agreement payout?</h2>
              <p className="guide-body">
                A settlement figure is rarely one single payment. Drafts split the money into separate pots, and HMRC taxes each pot differently.
              </p>

              <div className="space-y-5 mt-4">
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Ex-Gratia Compensation (Tax-Free up to £30,000)</strong>
                  <span className="text-muted text-[15px] leading-relaxed">
                    This is the discretionary sum offered to settle potential claims. Under ITEPA 2003 s.403, the first £30,000 is usually{' '}
                    <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">paid tax-free</Link>.
                  </span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Notice Pay, PILON, and Garden Leave</strong>
                  <span className="text-muted text-[15px] leading-relaxed">
                    Whether you work your notice on garden leave or take Payment in Lieu of Notice (PILON), it is always taxed as wages under ITEPA 2003 s.402D. Read our{' '}
                    <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax guide</Link>.
                  </span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Statutory Redundancy Pay</strong>
                  <span className="text-muted text-[15px] leading-relaxed">
                    With two or more years of service, redundancy pay uses age multipliers capped at 20 years. Weekly pay is capped at{' '}
                    <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">£751 in Great Britain</Link> (£783 in Northern Ireland), giving a maximum award of £22,530.
                  </span>
                </div>
                <div className="border-l-2 border-coral pl-4 py-1">
                  <strong className="text-ink block text-[16px]">Solicitor Legal Fees Contribution</strong>
                  <span className="text-muted text-[15px] leading-relaxed">
                    Under Section 203(3) ERA 1996, an independent solicitor must advise you for the agreement to bind. Employers standardly contribute £350 to £500+ plus VAT upon completion, with any excess or abortive work subject to your solicitor engagement terms.
                  </span>
                </div>
              </div>

              {/* Unified 2-Column Comparison Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Taxed as Wages</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Salary earned while on garden leave.</li>
                    <li>Payment in Lieu of Notice (PILON).</li>
                    <li>Accrued, untaken holiday pay.</li>
                    <li>Separate payments for new non-compete clauses.</li>
                  </ul>
                </div>
                <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                  <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Tax-Free (Up to £30,000)</h3>
                  <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                    <li>Statutory redundancy pay (counts toward £30k).</li>
                    <li>Genuine ex-gratia termination compensation.</li>
                    <li>Employer legal fee contribution (ESC A81).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Section 3: Checking Your Offer & Legal Boundaries */}
            <div className="space-y-4">
              <h2 className="guide-h2">3. How can you check where your offer stands?</h2>
              <p className="guide-body">
                Before speaking to a solicitor, it helps to separate the statutory numbers from the negotiation rules.
              </p>

              <ol className="flex flex-col gap-5 mt-4">
                {[
                  {
                    n: 1,
                    title: 'Calculate your statutory baseline',
                    body: 'Work out your statutory redundancy pay, notice pay, and accrued holiday first. This calculated statutory baseline shows what you are owed before any ex-gratia uplift.',
                  },
                  {
                    n: 2,
                    title: 'Check non-financial clauses',
                    body: 'Look closely at garden leave dates, reference wording, and any non-compete restrictions that could affect your next role.',
                  },
                  {
                    n: 3,
                    title: 'Understand off-the-record rules and deadlines',
                    body: 'Section 111A ERA 1996 protects settlement talks only for ordinary unfair dismissal, not discrimination or whistleblowing. ACAS Code 4 recommends 10 calendar days to consider an offer as guidance, not a binding legal right.',
                  },
                  {
                    n: 4,
                    title: 'Weigh counter-proposal risk with a solicitor',
                    body: 'Under UK contract law, a counter-offer rejects the original offer and allows your employer to withdraw it. Conversations with an independent solicitor remain covered by legal privilege.',
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

            {/* CTA */}
            <div className="bg-ink rounded-2xl p-8 text-center mt-10">
              <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
                Check where your offer stands
              </h2>
              <p className="text-white/70 text-[15px] leading-relaxed mb-6">
                See your calculated statutory baseline, tax split, and illustrative settlement range before speaking to a solicitor.
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

            {/* FAQs */}
            <div className="space-y-4 pt-6">
              <h2 className="guide-h2">Frequently Asked Questions</h2>
              <div className="mt-4">
                <FaqAccordion faqs={FAQS} />
              </div>
            </div>

            {/* Related Articles */}
            <RelatedArticles
              title="Related Guides & Calculations"
              items={[
                {
                  href: '/guides/settlement-agreement-how-much/',
                  title: 'How Much Should a Settlement Agreement Be?',
                  description: 'See how notice pay, statutory redundancy, and ex-gratia pots are structured.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'Understand without prejudice rules, counter-offers, and legal fee caps.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/employment-tribunal-average-awards-uk/',
                  title: 'Average Employment Tribunal Awards UK (2026)',
                  description: 'Compare settlement ranges against official Ministry of Justice tribunal statistics.',
                  tag: 'MoJ Statistics',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'The £30,000 Tax-Free Settlement Exemption',
                  description: 'How ITEPA 2003 s.403 separates tax-free compensation from taxable wages.',
                  tag: 'Tax Guide',
                },
                {
                  href: '/statutory-rates-history/',
                  title: 'Statutory Rates & Compensation Caps History',
                  description: 'Archive of UK statutory weekly pay caps (£751 in April 2026) and limits.',
                  tag: 'Data Archive',
                },
              ]}
            />

            {/* References */}
            <div className="pt-6 border-t border-rule">
              <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
              <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/227" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 227 (as amended by SI 2026/310)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    The Employment Rights (Increase of Limits) Order (Northern Ireland) 2026 (SR 2026/57)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/403" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Income Tax (Earnings and Pensions) Act 2003, Section 403
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/2003/1/section/402D" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Income Tax (Earnings and Pensions) Act 2003, Section 402D
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 124 (as amended by SI 2026/310)
                  </a>
                </li>
                <li>
                  <a href="https://www.gov.uk/hmrc-internal-manuals/employment-income-manual/eim13740" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    HMRC Extra-Statutory Concession A81 (ESC A81)
                  </a>
                </li>
                <li>
                  <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/119" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                    Employment Rights Act 1996, Section 119
                  </a>
                </li>
              </ol>
              <p className="text-[13px] text-muted leading-relaxed mt-6">
                Disclaimer: SettlementCheck is an independent introduction service and calculator, not a law firm. The information on this page is for general guidance only and does not constitute formal legal or tax advice.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
