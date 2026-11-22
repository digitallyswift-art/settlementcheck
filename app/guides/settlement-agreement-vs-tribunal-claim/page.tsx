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
  title: 'Settlement Agreement vs Tribunal 2026 | SettlementCheck',
  description:
    'Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-vs-tribunal-claim/',
  },
  openGraph: {
    title: 'Settlement Agreement vs Tribunal 2026 | SettlementCheck',
    description:
      'Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-vs-tribunal-claim/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement vs Tribunal 2026 | SettlementCheck',
    description:
      'Compare a UK settlement agreement vs employment tribunal in 2026 (£123,543 cap). Learn about costs, timelines, and payouts. Free check, no email.',
  },
}

const FAQS = [
  {
    q: 'How much does it cost to go to an employment tribunal?',
    a: 'There is no court fee to submit an employment tribunal claim. However, if you instruct a solicitor to represent you, private legal fees can reach £5,000 to £15,000 or more, and tribunals rarely order the other side to pay your costs.',
  },
  {
    q: 'How much compensation can an employment tribunal award?',
    a: 'For ordinary unfair dismissal in 2026, the compensatory award is capped at £123,543 or 52 weeks of gross pay, whichever is lower, plus a basic award capped at £22,530 in Great Britain. Discrimination and whistleblowing awards have no statutory cap.',
  },
  {
    q: 'How long does an employment tribunal take?',
    a: 'A standard employment tribunal claim in the UK often takes 12 to 18 months to reach a final hearing. A settlement agreement is commonly completed in one to three weeks.',
  },
  {
    q: 'Can I claim compensation for stress at an employment tribunal?',
    a: 'Generally, no. Tribunals do not award compensation for stress or hurt feelings in standard unfair dismissal claims. Injury to feelings awards are available in discrimination or whistleblowing cases.',
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
  headline: 'Settlement Agreement vs Employment Tribunal UK 2026: Cost, Time, and Caps Compared',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-vs-tribunal-claim/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-05-25',
  dateModified: '2026-07-11',
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
    '@id': 'https://settlementcheck.co.uk/guides/settlement-agreement-vs-tribunal-claim/',
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
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 6V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1" fill="currentColor" />
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

export default function SettlementAgreementVsTribunalGuide() {
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
              <span className="text-xs text-ink truncate">Settlement vs Tribunal</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Settlement agreements</p>
            <h1 className="sc-h1 mb-4">
              Settlement Agreement vs Employment Tribunal UK (2026)
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against ERA 1996 &amp; SI 2026/310
            </p>
            <p className="sc-lead">
              Weighing up a settlement agreement against an employment tribunal claim? A settlement resolves matters privately in weeks, while a tribunal is public and takes 12 to 18 months. Check your statutory baseline in 60 seconds with no email required, compare April 2026 caps, and prepare questions for an independent solicitor.
            </p>
          </div>
        </section>

        {/* Interactive Statutory Check */}
        <section className="py-6 bg-paper-2 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Compare your employer's opening figure against your calculated statutory baseline and typical 1 to 3 months gross commercial ranges."
              disputeType="tribunal_comparison"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Compensatory Cap', value: '£123,543', statute: 'ERA 1996 s.124' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={48000}
              initialYears={4}
              initialAge={39}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* Key takeaways callout */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="font-serif text-[19px] font-[460] text-ink mb-3">Core comparison facts</p>
              <ul className="flex flex-col gap-3">
                {[
                  'A settlement agreement provides a binding, private resolution that is often completed within one to three weeks.',
                  'An employment tribunal claim is a public process that frequently takes 12 to 18 months to reach a final hearing.',
                  'Employers standardly contribute £350 to £500+ plus VAT toward your independent legal advice upon completion. Excess or abortive work is subject to solicitor engagement terms.',
                  'Tribunals charge no filing fee, but private legal representation can cost £5,000 to £15,000 or more.',
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

        {/* Comparison Table */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How does a settlement agreement compare to an employment tribunal?</h2>
            <p className="sc-body mb-6">
              Both routes resolve workplace disputes, yet they differ sharply in speed, cost, privacy, and certainty.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Settlement Agreement</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Private contract waiving claims under s.203(3) ERA 1996.</li>
                  <li>Typically concluded in 1 to 3 weeks.</li>
                  <li>Includes agreed reference, garden leave, and non-compete wording.</li>
                  <li>Discussions are confidential under s.111A or Without Prejudice rules.</li>
                </ul>
              </div>
              <div className="border border-rule rounded-lg p-5 bg-paper-2/40">
                <h3 className="font-sans text-[14px] font-semibold text-ink uppercase tracking-wider mb-2">Employment Tribunal</h3>
                <ul className="list-disc pl-4 text-[14px] text-muted space-y-2">
                  <li>Public judicial hearing with judgments published online.</li>
                  <li>Often takes 12 to 18 months after ACAS Early Conciliation.</li>
                  <li>Ordinary unfair dismissal requires 2 years&apos; service (s.108 ERA 1996).</li>
                  <li>Payout depends on liability, mitigation, and employer solvency.</li>
                </ul>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <caption className="sr-only">Settlement agreement vs employment tribunal UK 2026 comparison table</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Feature</th>
                    <th className="text-left px-4 py-3 font-medium">Settlement Agreement</th>
                    <th className="text-left px-4 py-3 font-medium">Employment Tribunal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-paper">
                    <td className="px-4 py-3 text-ink font-medium">Resolution Time</td>
                    <td className="px-4 py-3 text-ink">1 to 3 weeks</td>
                    <td className="px-4 py-3 text-ink">12 to 18 months</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 text-ink font-medium">Legal Costs</td>
                    <td className="px-4 py-3 text-ink">Employers standardly contribute £350 to £500+ plus VAT upon completion (excess subject to solicitor terms)</td>
                    <td className="px-4 py-3 text-ink">No court fee, but solicitor fees can reach £5,000 to £15,000+</td>
                  </tr>
                  <tr className="bg-paper">
                    <td className="px-4 py-3 text-ink font-medium">Financial Caps</td>
                    <td className="px-4 py-3 text-ink">No statutory cap (agreed commercially)</td>
                    <td className="px-4 py-3 text-ink">Compensatory award capped at £123,543 <sup>1</sup> or 52 weeks&apos; gross pay</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 text-ink font-medium">Privacy</td>
                    <td className="px-4 py-3 text-ink">Confidential and private</td>
                    <td className="px-4 py-3 text-ink">Public record (judgments published online)</td>
                  </tr>
                  <tr className="bg-paper">
                    <td className="px-4 py-3 text-ink font-medium">Payment Certainty</td>
                    <td className="px-4 py-3 text-ink">Legally binding contract once signed</td>
                    <td className="px-4 py-3 text-ink">Uncertain; subject to liability, Polkey deductions, and solvency</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Legal Caps */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What are the April 2026 tribunal compensation caps?</h2>
            <p className="sc-body mb-4">
              If you win an ordinary unfair dismissal claim, the tribunal cannot award unlimited compensation. Strict statutory limits apply from 6 April 2026 under SI 2026/310.
            </p>
            <p className="sc-body mb-6">
              Your maximum possible unfair dismissal award is the sum of two parts:
            </p>
            <div className="space-y-4">
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">The Basic Award</strong>
                <span className="text-muted text-[15px]">
                  This uses the same statutory formula as <Link href="/guides/redundancy-pay-cap-2026/" className="underline hover:text-ink">statutory redundancy pay</Link>. It depends on your age, complete years of service (up to 20 years), and gross weekly pay capped at £751 in Great Britain <sup>2</sup> (£783 in Northern Ireland <sup>3</sup>). The maximum basic award is £22,530 <sup>4</sup> (£23,490 in Northern Ireland <sup>5</sup>).
                </span>
              </div>
              <div className="border-l-2 border-coral pl-4 py-1">
                <strong className="text-ink block text-[16px]">The Compensatory Award</strong>
                <span className="text-muted text-[15px]">
                  This covers actual financial loss, such as lost wages and pension contributions. It is capped at £123,543 in Great Britain <sup>1</sup>, or 52 weeks of gross pay, whichever is lower. The cap does not apply to discrimination, whistleblowing, or certain health and safety claims.
                </span>
              </div>
            </div>
            <p className="sc-body mt-6">
              Ordinary unfair dismissal claims generally require two years of continuous service under Section 108 of the Employment Rights Act 1996. Tribunals do not award injury to feelings in standard unfair dismissal claims.
            </p>
          </div>
        </section>

        {/* Legal Costs and Fees */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Who pays the solicitor fees for each option?</h2>
            <p className="sc-body mb-4">
              Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is only binding once an independent solicitor advises you on its terms. Employers standardly contribute £350 to £500+ plus VAT directly to your solicitor upon completion.
            </p>
            <p className="sc-body mb-4">
              If your solicitor spends extra time negotiating amendments, or if talks end without a signed agreement, excess or abortive work is subject to your solicitor&apos;s engagement terms.
            </p>
            <p className="sc-body">
              For an employment tribunal, there is no court filing fee. However, tribunals operate on a no cost-shifting basis, meaning each side usually pays its own legal fees regardless of who wins.
            </p>
          </div>
        </section>

        {/* Tribunal Resolution */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">How do tribunal claims usually resolve?</h2>
            <p className="sc-body mb-4">
              Before issuing a tribunal claim, you must notify ACAS for Early Conciliation. Most claims are resolved through ACAS conciliation, settled privately, or withdrawn before a final hearing.
            </p>
            <p className="sc-body mb-6">
              Even when a claim succeeds at a hearing, tribunals reduce compensation if you find another job quickly or if a fair procedure would have led to dismissal anyway (known as a Polkey reduction).
            </p>
            <div className="rounded-xl border border-rule bg-[#FFF8F6] p-5 flex gap-3">
              <AlertIcon />
              <div className="sc-body text-sm text-ink leading-relaxed">
                <strong>Tax treatment check:</strong> Under Section 403 of ITEPA 2003, the first £30,000 of genuine termination compensation is <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">paid tax-free up to £30,000</Link> <sup>6</sup>. Notice pay (PILON), holiday pay, and garden leave are always taxed as wages under Section 402D <sup>7</sup> (see our <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax guide</Link>).
              </div>
            </div>
          </div>
        </section>

        {/* The Decision Pathway */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What should you check before deciding?</h2>
            <p className="sc-body mb-6">
              Before choosing between signing an agreement, proposing changes, or pursuing a claim, check four practical factors with an independent solicitor.
            </p>
            <ol className="flex flex-col gap-6">
              {[
                {
                  n: 1,
                  title: 'Check your calculated statutory baseline',
                  body: 'Compare the offer against your statutory redundancy, notice pay, and accrued holiday pay. Ensure contractual sums taxed as wages are separated from tax-free compensation.',
                },
                {
                  n: 2,
                  title: 'Review your timeline and counter-offer risk',
                  body: 'ACAS Code of Practice 4 recommends 10 calendar days to consider written terms as general guidance, not a strict legal right. Remember that under UK contract law, making a counter-proposal rejects the original offer, allowing your employer to withdraw it.',
                },
                {
                  n: 3,
                  title: 'Check post-termination restrictions',
                  body: 'Review confidentiality, agreed reference wording, and any non-compete clauses that could restrict your next role.',
                },
                {
                  n: 4,
                  title: 'Weigh privacy, time, and tribunal eligibility',
                  body: 'Consider whether a 1 to 3 week confidential exit suits you better than a 12 to 18 month public tribunal claim.',
                },
              ].map(({ n, title, body }) => (
                <li key={n} className="flex gap-4">
                  <span className="w-7 h-7 rounded-full bg-ink text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{n}</span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink mb-1">{title}</p>
                    <p className="sc-body">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="rounded-xl border border-rule bg-white p-4 flex gap-3 mt-8">
              <InfoIcon />
              <p className="sc-body">
                You can <Link href="/calculator/" className="text-coral underline hover:text-ink transition-colors font-semibold">check your offer now</Link>, inspect regional hearing delays in our{' '}
                <Link href="/tribunal-backlog-tracker/" className="text-coral underline hover:text-ink transition-colors font-semibold">UK Employment Tribunal backlog tracker</Link>, compare{' '}
                <Link href="/guides/employment-tribunal-average-awards-uk/" className="text-coral underline hover:text-ink transition-colors font-semibold">Employment Tribunal awards (MoJ tables)</Link>, or review how{' '}
                <Link href="/guides/acas-early-conciliation-timeline/" className="text-coral underline hover:text-ink transition-colors font-semibold">ACAS Early Conciliation pauses the 3-month limitation clock</Link>.
              </p>
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-[24px] sm:text-[28px] font-[460] text-white mb-3">
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

            <div className="pt-8">
              <RelatedArticles
                title="Related Guides &amp; Tools"
                items={[
                  {
                    href: '/calculator/',
                    title: 'Settlement Agreement Calculator',
                    description: 'Check your offer against April 2026 statutory caps and commercial ranges.',
                    tag: 'Calculator',
                  },
                  {
                    href: '/guides/employment-tribunal-average-awards-uk/',
                    title: 'Employment Tribunal Awards UK',
                    description: 'Review official Ministry of Justice award tables and statutory caps.',
                    tag: 'Tribunal Data',
                  },
                  {
                    href: '/guides/acas-early-conciliation-timeline/',
                    title: 'ACAS Early Conciliation Timeline',
                    description: 'See how Early Conciliation works and how it affects the 3-month clock.',
                    tag: 'Tribunal Process',
                  },
                  {
                    href: '/guides/how-to-negotiate-a-settlement-agreement/',
                    title: 'How to Negotiate a Settlement Agreement',
                    description: 'Understand without prejudice talks, counter-offer risks, and tax splits.',
                    tag: 'Negotiation',
                  },
                  {
                    href: '/guides/tax-free-settlement-30000/',
                    title: '£30,000 Tax-Free Settlement Rule',
                    description: 'Separate tax-free compensation from notice pay taxed as wages.',
                    tag: 'Tax Rules',
                  },
                  {
                    href: '/guides/what-happens-if-you-do-not-sign/',
                    title: 'What Happens If You Do Not Sign?',
                    description: 'Understand your options if you decline a draft settlement agreement.',
                    tag: 'Employee Rights',
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/124" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 124 (as amended by SI 2026/310)
                </a>
              </li>
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
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/119" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 119
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/nisr/2026/57/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Northern Ireland basic award statutory cap under SR 2026/57
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
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent calculator and guide, not a law firm. The information on this page is for educational purposes only and does not constitute legal advice. While we make every effort to ensure our calculations reflect current statutory limits (such as SI 2026/310), employment disputes are complex. You should consult a qualified solicitor before signing a settlement agreement or initiating tribunal proceedings.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
