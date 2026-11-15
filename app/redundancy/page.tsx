import type { Metadata } from 'next'
import Script from 'next/script'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import type { FaqItem } from '@/components/FaqAccordion'
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers'
import SectorRestructuringClient from './SectorRestructuringClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'
import { SETTLEMENT_CHECK_PUBLISHER, SETTLEMENT_CHECK_LEGAL_DESK } from '@/lib/seo/schema-constants'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'UK Redundancy & Sector Restructuring Directory (2026) | SettlementCheck',
  description:
    'Authoritative guide to UK workplace restructuring. Compare NHS Agenda for Change, Civil Service CSCS, City financial services SM&CR, and private sector statutory redundancy terms.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/redundancy/',
  },
  openGraph: {
    title: 'UK Redundancy & Sector Restructuring Directory (2026) | SettlementCheck',
    description:
      'Evergreen sectoral restructuring hub: NHS Agenda for Change, Civil Service CSCS terms, FCA/PRA financial services exits, and statutory redundancy baselines.',
    url: 'https://settlementcheck.co.uk/redundancy/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Redundancy & Sector Restructuring Directory (2026)',
    description:
      'Compare NHS Agenda for Change, Civil Service CSCS, City financial exits, and statutory redundancy baselines under April 2026 rates (£751/week cap).',
  },
}

const FAQS: FaqItem[] = [
  {
    q: 'How does NHS redundancy pay differ from statutory redundancy pay?',
    a: 'Under Agenda for Change Section 16, NHS redundancy pay is calculated as one month of actual basic pay for each complete year of reckonable NHS service, capped at 24 months. Crucially, the statutory weekly pay cap (£751 per week from April 2026) does not apply. Payments are based on your full contractual salary. You must have at least two continuous years of reckonable NHS service to qualify.',
  },
  {
    q: 'What is the Civil Service Compensation Scheme (CSCS) redundancy multiplier?',
    a: 'Under the Civil Service Compensation Scheme (CSCS), Voluntary Redundancy (VR) standardly provides one month of pay for each complete year of service, capped at 21 months. Compulsory Redundancy (CR) is capped at 12 months. Pay calculations are subject to a scheme maximum calculation salary (currently £149,829). Staff at or above minimum pension age can often choose to sacrifice severance payments to fund an unreduced early pension.',
  },
  {
    q: 'Can a financial services firm compromise my regulatory reference in a settlement agreement?',
    a: 'No. Under the FCA and PRA Senior Managers and Certification Regime (SM&CR) rules set out in SYSC 22, authorized financial services firms have a mandatory regulatory obligation to provide truthful, complete regulatory references covering the preceding six years. While an agreed character reference can be included, the mandatory regulatory disclosures regarding conduct breaches or fitness and propriety cannot be bargained away.',
  },
  {
    q: 'Is redundancy pay taxable in the UK?',
    a: 'Statutory redundancy pay and genuine ex-gratia compensation for loss of office are tax-free up to £30,000 under Section 403 of ITEPA 2003. Any termination payment exceeding £30,000 is subject to income tax at your marginal rate, and employer Class 1A National Insurance contributions (15.0% for 2026/27). However, payments in lieu of notice (PILON) and accrued holiday pay are always fully taxed as earnings under Section 402D ITEPA 2003.',
  },
  {
    q: 'What happens if I reject an offer of suitable alternative employment?',
    a: 'Under Section 141 of the Employment Rights Act 1996, if an employer offers suitable alternative employment before your employment ends, and you unreasonably refuse that offer, you forfeit your statutory right to redundancy pay. Whether a role is &quot;suitable&quot; depends on job content, pay, status, location, and your individual circumstances.',
  },
  {
    q: 'What is collective redundancy consultation under TULRCA 1992?',
    a: 'Under Section 188 of the Trade Union and Labour Relations (Consolidation) Act 1992, where an employer proposes to make 20 or more employees redundant at one establishment within a 90-day period, they must consult with recognized trade unions or elected employee representatives. Consultation must begin at least 30 days before the first dismissal takes effect (or 45 days if 100+ redundancies). Failure to consult properly can result in an Employment Tribunal protective award of up to 90 days gross pay per employee.',
  },
  {
    q: 'Can an employer include a gagging clause regarding whistleblowing?',
    a: 'No. Under Section 43J of the Employment Rights Act 1996, any agreement that attempts to preclude a worker from making a protected disclosure (whistleblowing) is legally void. This statutory protection applies across all sectors, including the NHS, Civil Service, banking, and private commerce.',
  },
  {
    q: 'Why do employers ask redundant staff to sign a settlement agreement?',
    a: 'While statutory redundancy pay does not require a settlement agreement, employers frequently offer enhanced redundancy terms or ex-gratia sums above the statutory minimum on the condition that the employee signs a Section 203 settlement agreement. This gives the employer legal certainty by extinguishing potential tribunal claims for unfair dismissal, procedural defects, or discrimination.',
  },
]

export default function RedundancySectorHubPage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://settlementcheck.co.uk/redundancy/#webpage',
        url: 'https://settlementcheck.co.uk/redundancy/',
        name: 'UK Redundancy & Sector Restructuring Directory (2026)',
        publisher: SETTLEMENT_CHECK_PUBLISHER,
        description:
          'Comprehensive sectoral restructuring guide and statutory redundancy hub covering NHS Agenda for Change, Civil Service CSCS terms, FCA financial services, and statutory baselines.',
        breadcrumb: {
          '@id': 'https://settlementcheck.co.uk/redundancy/#breadcrumb',
        },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://settlementcheck.co.uk/redundancy/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://settlementcheck.co.uk/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Redundancy',
            item: 'https://settlementcheck.co.uk/redundancy/',
          },
        ],
      },
      {
        '@type': 'Article',
        '@id': 'https://settlementcheck.co.uk/redundancy/#article',
        headline: 'UK Sector Restructuring Directory: NHS, Civil Service, Financial Services & Statutory Redundancy',
        description:
          'Authoritative guide analyzing sectoral redundancy mechanisms across Great Britain, including Agenda for Change Section 16, Civil Service Compensation Scheme, FCA SM&CR exits, and April 2026 statutory caps.',
        url: 'https://settlementcheck.co.uk/redundancy/',
        datePublished: '2026-06-01',
        dateModified: '2026-11-15',
        publisher: SETTLEMENT_CHECK_PUBLISHER,
        author: SETTLEMENT_CHECK_LEGAL_DESK,
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://settlementcheck.co.uk/redundancy/#faq',
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: a,
          },
        })),
      },
    ],
  }

  return (
    <>
      <Script
        id="redundancy-sector-hub-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLdData) }}
      />
      <Nav />
      <main className="min-h-screen bg-paper text-ink pt-8 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="text-xs text-muted font-sans">
            <ol className="flex items-center gap-1.5 flex-wrap">
              <li>
                <Link href="/" className="hover:text-coral transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink font-medium" aria-current="page">
                Redundancy Hub
              </li>
            </ol>
          </nav>

          {/* Hub Header */}
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-coral/10 text-coral border border-coral/20">
              <span>National Restructuring Intelligence Portal (2026)</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink tracking-tight leading-tight">
              UK Sector Restructuring &amp; Redundancy Directory
            </h1>
            <p className="text-base sm:text-lg text-muted font-sans leading-relaxed max-w-3xl">
              Workplace restructuring rules vary significantly depending on whether you work in the NHS, Civil Service, regulated City finance, or the private sector. Explore statutory baselines, sectoral exit formulas, £30,000 tax exemptions, and independent legal advice rules.
            </p>
          </header>

          {/* Interactive Sector Comparator */}
          <SectorRestructuringClient />

          {/* Deep Editorial Sector Guides */}
          <article className="prose prose-slate max-w-none space-y-10 text-ink leading-relaxed">
            {/* Sector 1: NHS */}
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <div className="flex items-center justify-between border-b border-rule pb-3">
                <h2 className="text-2xl font-serif font-bold text-ink m-0">
                  1. NHS Agenda for Change: Redundancy &amp; MARS Schemes
                </h2>
                <Link
                  href="/guides/nhs-settlement-agreements/"
                  className="text-xs font-semibold text-coral hover:underline"
                >
                  Full NHS Guide →
                </Link>
              </div>
              <p className="text-sm text-muted leading-relaxed">
                Staff employed under NHS Agenda for Change (AfC) terms benefit from contractual redundancy arrangements that far exceed statutory minimums. Governed by <strong>Section 16 of the AfC Terms and Conditions Handbook</strong>, payments are calculated using actual basic monthly salary rather than the statutory weekly cap.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    Section 16 Compulsory Redundancy
                  </span>
                  <ul className="text-muted space-y-1.5 list-disc pl-4 m-0 leading-relaxed">
                    <li>1 month of actual basic pay per year of reckonable NHS service.</li>
                    <li>Capped at 24 months of pay.</li>
                    <li>No weekly pay cap (£751 cap does not apply).</li>
                    <li>Minimum 2 continuous years of reckonable NHS service required.</li>
                  </ul>
                </div>
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    Section 17 Mutually Agreed Resignation (MARS)
                  </span>
                  <ul className="text-muted space-y-1.5 list-disc pl-4 m-0 leading-relaxed">
                    <li>Voluntary severance scheme designed to avoid compulsory redundancies.</li>
                    <li>Standardly calculated as 1 month per year, capped at 21 months (or local trust cap).</li>
                    <li>Break-in-service clause: Cannot return to NHS employment within 6 months without repaying severance.</li>
                    <li>Special Severance Payments require DHSC and HM Treasury approval.</li>
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-paper rounded-xl border border-rule text-xs space-y-1 text-muted">
                <span className="font-semibold text-ink block">Whistleblowing Non-Derogation (ERA 1996 s.43J)</span>
                <p className="m-0 leading-relaxed">
                  Under Section 43J of the Employment Rights Act 1996, no NHS settlement agreement or compromise clause can prevent an employee from making a protected disclosure regarding patient safety, clinical standards, or financial irregularities. Any confidentiality clause attempting to do so is void as a matter of law.
                </p>
              </div>
            </section>

            {/* Sector 2: Civil Service */}
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                2. Civil Service Compensation Scheme (CSCS)
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Civil servants in ministerial departments, executive agencies, and non-departmental public bodies are covered by the statutory <strong>Civil Service Compensation Scheme (CSCS)</strong> made under the Superannuation Act 1972.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-1.5">
                  <span className="font-semibold text-ink block text-sm">Voluntary Exit (VE)</span>
                  <p className="text-muted leading-relaxed m-0">
                    Discretionary scheme allowing departments to offer flexible severance terms, typically up to 21 months of salary, to restructure teams before initiating formal redundancy.
                  </p>
                </div>
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-1.5">
                  <span className="font-semibold text-ink block text-sm">Voluntary Redundancy (VR)</span>
                  <p className="text-muted leading-relaxed m-0">
                    Standard scheme providing 1 month of pay per complete year of continuous service, capped at 21 months. A deemed salary calculation cap (£149,829) applies.
                  </p>
                </div>
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-1.5">
                  <span className="font-semibold text-ink block text-sm">Compulsory Redundancy (CR)</span>
                  <p className="text-muted leading-relaxed m-0">
                    Restricted statutory severance providing 1 month of pay per year of service, capped strictly at 12 months. Offered only when voluntary schemes fail to meet headcount reduction targets.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-paper rounded-xl border border-rule text-xs space-y-1.5 text-muted leading-relaxed">
                <strong className="text-ink">Pension Bridge &amp; Clawback Rules:</strong> Qualifying staff who have reached their scheme minimum pension age can elect to exchange part or all of their cash severance payment to buy out the actuarial reduction on their accrued Civil Service pension, enabling immediate early retirement. If an employee returns to Civil Service employment within 6 months of leaving, statutory clawback rules require repayment of the unexpired portion of the severance payment.
              </div>
            </section>

            {/* Sector 3: Regulated Financial Services */}
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                3. Regulated Financial Services &amp; City Restructuring (FCA / PRA SM&amp;CR)
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Departures in banking, wealth management, insurance, and fintech require careful legal navigation due to the overlay of statutory employment law and regulatory oversight from the Financial Conduct Authority (FCA) and Prudential Regulation Authority (PRA).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    FCA SYSC 22 Regulatory References
                  </span>
                  <p className="text-muted leading-relaxed">
                    Under FCA SYSC 22, authorized firms are legally required to provide comprehensive regulatory references covering the preceding 6 years. The reference must disclose confirmed breaches of the Individual Conduct Rules or Senior Manager Conduct Rules, and any ongoing disciplinary investigations.
                  </p>
                  <p className="text-muted leading-relaxed font-mono text-[11px]">
                    * Legal Reality: Unlike standard commercial references, regulatory references cannot be contractually waived or sanitized in a settlement agreement.
                  </p>
                </div>
                <div className="p-4 bg-paper rounded-xl border border-rule space-y-2">
                  <span className="font-semibold text-ink block text-sm">
                    Deferred Compensation, Malus &amp; Clawback
                  </span>
                  <p className="text-muted leading-relaxed">
                    For senior managers and material risk takers (MRTs), substantial portions of remuneration are deferred in unvested shares, LTIPs, or carried interest. Negotiations frequently center on securing &quot;good leaver&quot; status to protect unvested equity from automatic forfeiture.
                  </p>
                  <p className="text-muted leading-relaxed font-mono text-[11px]">
                    * PRA Rulebook: Remuneration rules mandate malus and clawback provisions for up to 7 to 10 years for severe conduct failures.
                  </p>
                </div>
              </div>
            </section>

            {/* Sector 4: Private Sector & Statutory Baseline */}
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                4. Private Sector &amp; SME Statutory Redundancy Baselines
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                In the broader commercial economy, redundant employees are entitled to statutory redundancy pay under Section 135 and Section 162 of the Employment Rights Act 1996 if they have at least 2 complete years of continuous service.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-rule rounded-lg">
                  <thead className="bg-paper text-ink font-semibold border-b border-rule">
                    <tr>
                      <th className="p-3">Statutory Element</th>
                      <th className="p-3">April 2026 Statutory Rate</th>
                      <th className="p-3">Statutory Authority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rule">
                    <tr>
                      <td className="p-3 font-semibold text-ink">Weekly Pay Cap (Great Britain)</td>
                      <td className="p-3 font-mono text-coral font-bold">£751 per week</td>
                      <td className="p-3 text-muted">ERA 1996 s.227; SI 2026/310</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Weekly Pay Cap (Northern Ireland)</td>
                      <td className="p-3 font-mono font-bold">£783 per week</td>
                      <td className="p-3 text-muted">DfE statutory uprating</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Maximum Statutory Redundancy Pay</td>
                      <td className="p-3 font-mono text-coral font-bold">£22,530 (£751 × 1.5 × 20)</td>
                      <td className="p-3 text-muted">ERA 1996 s.162 (20-year service cap)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Unfair Dismissal Compensatory Cap</td>
                      <td className="p-3 font-mono font-bold">£123,543 (or 52 weeks gross pay)</td>
                      <td className="p-3 text-muted">ERA 1996 s.124(1ZA)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-ink">Tax-Free Exemption Threshold</td>
                      <td className="p-3 font-mono text-coral font-bold">£30,000 threshold</td>
                      <td className="p-3 text-muted">ITEPA 2003 s.403</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Mandatory Regulatory Disclaimers */}
            <MandatoryLegalDisclaimers />

            {/* FAQs */}
            <section className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
              <h2 className="text-2xl font-serif font-bold text-ink">
                5. Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={FAQS} />
            </section>
          </article>

          {/* Related Tools Navigation */}
          <nav aria-label="Related redundancy tools" className="bg-card p-6 sm:p-8 rounded-2xl border border-rule space-y-4">
            <h3 className="text-base font-serif font-bold text-ink">
              Related Redundancy Calculators &amp; Exit Tools
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <Link
                href="/redundancy-calculator/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Redundancy Pay Calculator</span>
                <span className="text-muted text-[11px]">Calculate April 2026 statutory baseline</span>
              </Link>
              <Link
                href="/penp-calculator/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">PENP Notice Tax Calculator</span>
                <span className="text-muted text-[11px]">Execute statutory notice tax splits</span>
              </Link>
              <Link
                href="/protective-award-calculator/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Protective Award Calculator</span>
                <span className="text-muted text-[11px]">Up to 90 days pay for consultation breach</span>
              </Link>
              <Link
                href="/settlement-agreement-review/"
                className="p-3 bg-paper rounded-lg border border-rule text-ink hover:text-coral transition-colors"
              >
                <span className="font-semibold block">Settlement Agreement Review</span>
                <span className="text-muted text-[11px]">Employer-funded SRA legal review</span>
              </Link>
            </div>
          </nav>
        </div>
      </main>
      <Footer />
    </>
  )
}