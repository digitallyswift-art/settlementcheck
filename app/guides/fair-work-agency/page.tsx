import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import RelatedArticles from '@/components/RelatedArticles'

export const metadata: Metadata = {
  title: 'What Is the Fair Work Agency? UK Employment Guide 2026',
  description:
    'The Fair Work Agency is a new UK enforcement body established by the Employment Rights Act 2025. Not yet operational. Learn what it will do and whether it affects your settlement.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/fair-work-agency/',
  },
  openGraph: {
    title: 'What Is the Fair Work Agency? UK Employment Guide 2026',
    description:
      'The Fair Work Agency is a new UK enforcement body established by the Employment Rights Act 2025. Not yet operational. Learn what it will do and whether it affects your settlement.',
    url: 'https://settlementcheck.co.uk/guides/fair-work-agency/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'Is the Fair Work Agency the same as ACAS-based enforcement?',
    a: 'No. ACAS-based enforcement refers to statutory dispute resolution and employment rights guidance used in settlement negotiations. The Fair Work Agency is a separate law enforcement body that will investigate breaches of statutory minimum rights (minimum wage, holiday pay, statutory sick pay) and can impose penalties on employers. The two serve different functions.',
  },
  {
    q: 'Can the Fair Work Agency help me if my employer underpays my settlement?',
    a: 'The Fair Work Agency cannot enforce the terms of your settlement agreement directly. However, if your settlement fails to include statutory entitlements owed to you (such as holiday pay or minimum wage arrears), the FWA can investigate the employer for the underlying statutory breach. Disputes purely about settlement terms require legal action or an employment tribunal claim.',
  },
  {
    q: 'What rights will the Fair Work Agency enforce?',
    a: 'The FWA will enforce National Minimum Wage and National Living Wage, statutory holiday pay, statutory sick pay, notice period wages, and protections against modern slavery and labour trafficking. The full scope of powers will be confirmed when the commencement order is issued.',
  },
  {
    q: 'Does the Fair Work Agency apply to Scotland and Wales?',
    a: 'The Fair Work Agency is established as a UK-wide body under the Employment Rights Act 2025. Employment law is partly devolved in Scotland and Wales, so some variation in how FWA powers apply may exist. If you are employed outside England, confirm the position with a solicitor once the FWA has launched.',
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
              <span className="text-xs text-ink truncate">Fair Work Agency</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>UK Employment Law Guide</p>
            <h1 className="sc-h1 mb-5">
              What is the Fair Work Agency and does it affect my settlement agreement?
            </h1>
            <p className="sc-lead">
              The Fair Work Agency (FWA) is a new UK government body established by the Employment Rights Act 2025 to enforce workers' rights including minimum wage, holiday pay, and statutory sick pay. It is not yet operational as of May 2026. The FWA will consolidate enforcement functions currently held by several separate bodies into a single point of accountability.
            </p>
            <div className="mt-6 rounded-xl border border-rule bg-white p-4 flex gap-3">
              <InfoIcon />
              <p className="text-sm text-ink">
                The Fair Work Agency has been established in law under the Employment Rights Act 2025 but has not yet commenced operations. No launch date has been confirmed. Do not rely on FWA enforcement until the commencement order is issued.
              </p>
            </div>
          </div>
        </section>

        {/* What it will do */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What the Fair Work Agency will do</h2>
            <p className="sc-body mb-6">
              The Fair Work Agency is designed to enforce statutory minimum working standards across all sectors. It will carry out workplace inspections, investigate complaints, issue enforcement notices, and take legal action against employers who breach workers' rights.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Enforce National Minimum Wage and National Living Wage compliance across all sectors.',
                'Investigate breaches of holiday pay and statutory sick pay entitlements.',
                'Conduct workplace inspections and require employers to produce evidence of compliance.',
                'Issue financial penalties, enforcement notices, and prosecute serious breaches.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Which bodies it replaces */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Which bodies the Fair Work Agency replaces</h2>
            <p className="sc-body mb-6">
              The FWA consolidates enforcement responsibilities currently held by separate bodies. This removes the fragmented system where different agencies covered different areas of statutory compliance.
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
            <h2 className="sc-section-h2 mb-4">Does the Fair Work Agency affect my settlement agreement?</h2>
            <p className="sc-body mb-4">
              The Fair Work Agency enforces statutory minimum standards, not settlement agreement terms. Your settlement is a private contract between you and your employer. The FWA cannot intervene in disputes about settlement payment amounts or negotiated terms.
            </p>
            <p className="sc-body mb-4">
              However, if your settlement includes amounts below statutory minimums (for example, if holiday pay owed is excluded from the settlement), the FWA can take action against your employer for the underlying statutory breach. A settlement agreement cannot remove your statutory rights.
            </p>
            <p className="sc-body">
              For disputes about whether your offer meets standard benchmarks, see our guide on{' '}
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
            <h2 className="sc-section-h2 mb-4">When will the Fair Work Agency launch?</h2>
            <p className="sc-body mb-4">
              The Employment Rights Act 2025 received Royal Assent but no commencement order for the Fair Work Agency has been issued as of May 2026. The Government must issue a separate commencement order setting the launch date. Until that order is published, the FWA has no operational powers.
            </p>
            <p className="sc-body">
              Announcements about the FWA launch date are expected as 2026 progresses. If you are currently negotiating an exit or facing dismissal, you should read our guide on{' '}
              <Link href="/guides/how-to-negotiate-a-settlement-agreement/" className="text-coral underline underline-offset-2 hover:text-ink">
                how to negotiate a settlement agreement
              </Link>{' '}
              rather than waiting for regulatory agency changes.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Not sure what your settlement is worth?</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              The free calculator applies April 2026 statutory rates and shows your estimated net take-home in under two minutes.
            </p>
            <Link
              href="/calculator/"
              className="btn-accent"
            >
              Calculate my settlement
            </Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
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
                  description: 'Leverage, Without Prejudice rules, and practical steps to submit a counter-offer.',
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
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Statutory Framework & Government Sources</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://bills.parliament.uk/bills/3737" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  UK Parliament: Employment Rights Bill (Establishing the Fair Work Agency & enforcement powers)
                </a>
              </li>
              <li>
                <a href="https://www.gov.uk/government/organisations/department-for-business-and-trade" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Department for Business and Trade (DBT) – Labour Market Enforcement Directives
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
              <strong>Disclaimer:</strong> SettlementCheck is an independent information service and calculation tool. We are not affiliated with the UK Government or any public enforcement agency. This guide provides factual analysis on labor market enforcement reforms and does not constitute formal legal counsel.
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
