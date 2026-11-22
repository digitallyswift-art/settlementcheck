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
  title: 'What Is the Fair Work Agency? Guide | SettlementCheck',
  description:
    'The Fair Work Agency is a new UK enforcement body under the Employment Rights Bill. Learn its remit, enforcement powers, and impact on settlement talks.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/fair-work-agency/',
  },
  openGraph: {
    title: 'What Is the Fair Work Agency? Guide | SettlementCheck',
    description:
      'The Fair Work Agency is a new UK enforcement body under the Employment Rights Bill. Learn its remit, enforcement powers, and impact on settlement talks.',
    url: 'https://settlementcheck.co.uk/guides/fair-work-agency/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'Is the Fair Work Agency the same as ACAS-based enforcement?',
    a: 'No. ACAS provides dispute resolution and statutory guidance for settlement talks. The Fair Work Agency is a separate enforcement body for statutory minimum rights like minimum wage, holiday pay, and sick pay. They serve different functions.',
  },
  {
    q: 'Can the Fair Work Agency help if my settlement payout is too low?',
    a: 'The Fair Work Agency cannot enforce the terms of a private settlement agreement. However, if your agreement omits unpaid statutory entitlements like holiday pay or minimum wage arrears, the FWA can investigate that statutory breach. Disputes about negotiated settlement terms require an employment tribunal claim or civil action.',
  },
  {
    q: 'What rights will the Fair Work Agency enforce?',
    a: 'The FWA will enforce National Minimum Wage, National Living Wage, statutory holiday pay, statutory sick pay, notice pay, and protections against labour trafficking. Its full scope will be confirmed in the statutory commencement order.',
  },
  {
    q: 'Does the Fair Work Agency apply to Scotland and Wales?',
    a: 'The Fair Work Agency is established as a UK-wide body under the Employment Rights Bill 2024-25. Because some employment matters vary across Scotland and Wales, check the position with an independent solicitor once the FWA launches.',
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
  headline: 'What Is the Fair Work Agency and Does It Affect My Settlement Agreement?',
  url: 'https://settlementcheck.co.uk/guides/fair-work-agency/',
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

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function FairWorkAgencyGuide() {
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
              <span className="text-xs font-medium text-muted tracking-wide uppercase">Fair Work Agency</span>
            </div>
            <h1 className="sc-h1 mb-4">
              What is the Fair Work Agency and does it affect my settlement agreement?
            </h1>
            <p className="text-[14px] text-muted mb-5">
              Updated for April 2026 UK statutory rates · Checked against Employment Rights Bill 2024-25
            </p>
            <p className="sc-lead leading-relaxed">
              Wondering if the new Fair Work Agency changes your settlement agreement? The FWA is a planned UK enforcement body under the Employment Rights Bill 2024-25, not yet operational in 2026. Check your statutory baseline in 60 seconds with no email required, see what the FWA will cover, and prepare clear questions for an independent solicitor.
            </p>
            <div className="mt-6 rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="text-[14px] text-ink leading-relaxed">
                The Fair Work Agency is set out in the Employment Rights Bill 2024-25, but no launch date is confirmed. FWA enforcement powers will only take effect once statutory commencement orders are issued.
              </p>
            </div>
          </div>
        </section>

        {/* Embedded Calculator */}
        <section className="py-10 bg-card border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <EmbeddedCalculatorCard
              badge="April 2026 Statutory Check"
              title="How does your offer compare to the statutory baseline?"
              subtitle="Check your calculated statutory baseline, notice pay, and tax-free split under current April 2026 UK limits."
              disputeType="general"
              statutoryPills={[
                { label: 'Weekly Pay Cap', value: '£751/week', statute: 'SI 2026/310' },
                { label: 'Tax-Free Exemption', value: '£30,000', statute: 'ITEPA 2003 s.403' },
                { label: 'Legal Fee Contribution', value: '£350 to £500+ plus VAT', statute: 'Paid on Completion' },
              ]}
              initialSalary={45000}
              initialYears={4}
              initialAge={38}
              ctaText="Check my offer now →"
            />
          </div>
        </section>

        {/* What it will do */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">What will the Fair Work Agency do?</h2>
            <p className="guide-body mb-6">
              The Fair Work Agency will enforce statutory minimum working standards across UK sectors. It will run workplace inspections, investigate complaints, issue notices, and take action against employers who breach minimum rights.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Enforce National Minimum Wage and National Living Wage compliance across all sectors.',
                'Investigate breaches of holiday pay and statutory sick pay entitlements.',
                'Conduct workplace inspections and require employers to produce compliance records.',
                'Issue financial penalties, enforcement notices, and prosecute serious breaches.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="text-[15px] text-ink leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Which bodies it replaces */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Which enforcement bodies does the Fair Work Agency replace?</h2>
            <p className="guide-body mb-6">
              The FWA brings together enforcement powers currently split across separate bodies. This replaces the older system where different agencies handled different statutory rights.
            </p>
            <div className="rounded-xl border border-rule overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Body</th>
                    <th className="text-left px-4 py-3 font-medium">What it enforced</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Gangmasters and Labour Abuse Authority (GLAA)', 'Labour trafficking, modern slavery, gangmaster licensing', 'Functions transfer to FWA'],
                    ['Employment Agency Standards Inspectorate (EASI)', 'Employment agency conduct, unlawful fees, record keeping', 'Functions transfer to FWA'],
                    ['HMRC National Minimum Wage Team', 'Minimum wage and Living Wage compliance', 'Functions transfer to FWA'],
                  ].map(([body, enforced, status], i) => (
                    <tr key={body} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{body}</td>
                      <td className="px-4 py-3 text-ink">{enforced}</td>
                      <td className="px-4 py-3 text-ink">{status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Settlement impact */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">Does the Fair Work Agency affect my settlement agreement?</h2>
            <p className="guide-body mb-4">
              The Fair Work Agency enforces statutory minimum standards, not private settlement terms. Your settlement agreement is a contract between you and your employer, so the FWA cannot settle disputes over negotiated amounts.
            </p>
            <p className="guide-body mb-4">
              However, if an agreement omits unpaid statutory entitlements like holiday pay or minimum wage arrears, the FWA can investigate the underlying statutory breach. Under Section 203(3) of the Employment Rights Act 1996, an independent solicitor must advise you before a waiver is valid, with employers standardly contributing £350 to £500+ plus VAT upon completion (excess or abortive work is subject to your solicitor engagement terms).
            </p>
            <p className="guide-body">
              To check how your offer compares to UK benchmarks, see our guide on{' '}
              <Link href="/guides/what-is-a-fair-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                what makes a settlement agreement fair
              </Link>{' '}
              or check how your baseline is calculated under{' '}
              <Link href="/guides/settlement-agreement-acas-calculations/" className="text-coral underline underline-offset-2 hover:text-ink">
                ACAS-based settlement calculations
              </Link>.
            </p>
          </div>
        </section>

        {/* Launch timeline */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="guide-h2 mb-4">When will the Fair Work Agency launch?</h2>
            <p className="guide-body mb-4">
              The Employment Rights Bill 2024-25 sets out the agency framework, but no statutory commencement order has been issued as of 2026. The Government must publish a commencement order before the FWA can use its powers.
            </p>
            <p className="guide-body">
              Updates on the launch date are expected as 2026 progresses. If you are currently negotiating an exit or facing redundancy, see our guide on{' '}
              <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                how to negotiate a settlement agreement
              </Link>{' '}
              rather than waiting for agency changes.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="font-serif text-white text-[22px] font-[460] tracking-[-0.012em] leading-snug mb-2">
              Check where your offer stands
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed mb-6">
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

            {/* Related Articles Component */}
            <RelatedArticles
              title="Related Guides & Calculators"
              items={[
                {
                  href: '/guides/settlement-agreement-acas-calculations/',
                  title: 'ACAS-Based Settlement Calculations',
                  description: 'Learn how statutory redundancy formulas, the £751 weekly cap, and notice pay interact.',
                  tag: 'Calculations',
                },
                {
                  href: '/guides/what-is-a-fair-settlement-agreement/',
                  title: 'What Is a Fair Settlement Agreement?',
                  description: 'Understand multiplier ranges, statutory baselines, and warning signs of a low offer.',
                  tag: 'Settlement Guides',
                },
                {
                  href: '/guides/how-to-negotiate-a-settlement-agreement/',
                  title: 'How to Negotiate a Settlement Agreement',
                  description: 'How settlement talks work, without prejudice rules, and legal fee contributions.',
                  tag: 'Negotiation',
                },
                {
                  href: '/redundancy-calculator/',
                  title: 'Redundancy Pay Calculator',
                  description: 'Free tool applying 2026/2027 statutory weekly caps and age multipliers.',
                  tag: 'Calculator',
                },
              ]}
            />
          </div>
        </section>

        {/* References */}
        <section className="py-12 bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Framework &amp; Government Sources</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://bills.parliament.uk/bills/3737" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  UK Parliament: Employment Rights Bill (Establishing the Fair Work Agency &amp; enforcement powers)
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/government/organisations/department-for-business-and-trade" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Department for Business and Trade (DBT) - Labour Market Enforcement Directives
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/contents" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996 (Primary UK workplace rights framework)
                </a>
              </li>
              <li>
                <a href="https://www.acas.org.uk/code-of-practice-settlement-agreements" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Acas Code of Practice on Settlement Agreements
                </a>
              </li>
            </ol>
            <div className="mt-8 pt-6 border-t border-rule text-xs text-muted leading-relaxed">
              <strong>Disclaimer:</strong> SettlementCheck is an independent information service and calculation tool. We are not affiliated with the UK Government or any public enforcement agency. This guide provides factual analysis on labour market enforcement reforms and does not constitute formal legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
