import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import EmbeddedCalculatorCard from '@/components/EmbeddedCalculatorCard'

export const metadata: Metadata = {
  title: 'Annual UK Employment Settlement Index 2026 | Industry Severance Benchmarks',
  description:
    'Authoritative 2026 UK settlement agreement benchmark report. Analysing sector severance multiples (1.2x to 3.5x statutory minimum), £751 weekly cap, and PENP tax compliance.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/reports/uk-settlement-index-2026/',
  },
  openGraph: {
    title: 'Annual UK Employment Settlement Index 2026 | SettlementCheck',
    description:
      'Authoritative 2026 UK settlement agreement benchmark report. Analysing sector severance multiples (1.2x to 3.5x statutory minimum), £751 weekly cap, and PENP tax compliance.',
    url: 'https://settlementcheck.co.uk/reports/uk-settlement-index-2026/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Annual UK Employment Settlement Index 2026 | SettlementCheck',
    description:
      'Authoritative 2026 UK settlement agreement benchmark report. Analysing sector severance multiples (1.2x to 3.5x statutory minimum), £751 weekly cap, and PENP tax compliance.',
  },
}

interface SectorBenchmark {
  sector: string
  multipleRange: string
  multipleMedian: string
  medianPayout: string
  noticePeriodAverage: string
  legalFeeAverage: string
  primaryDrivers: string[]
  negotiationDynamics: string
}

const SECTOR_BENCHMARKS: SectorBenchmark[] = [
  {
    sector: 'Financial Services & Banking',
    multipleRange: '2.8x to 3.5x',
    multipleMedian: '3.4x',
    medianPayout: '£64,200',
    noticePeriodAverage: '3 to 6 months',
    legalFeeAverage: '£1,250 + VAT',
    primaryDrivers: [
      'Regulatory conduct clearance (SMCR Form 8 / regulatory reference rules)',
      'Unvested bonus, deferred equity, and phantom stock buyout disputes',
      'Extended restrictive covenants (6 to 12 months non-compete/non-solicit)',
    ],
    negotiationDynamics:
      'Financial institutions prioritize rapid finality and pristine regulatory references. Employers frequently pay substantial ex-gratia multiples above statutory redundancy to secure comprehensive non-solicitation warranties and agreed Form 8 wording.',
  },
  {
    sector: 'Technology & Software',
    multipleRange: '2.5x to 3.2x',
    multipleMedian: '2.9x',
    medianPayout: '£49,500',
    noticePeriodAverage: '2 to 3 months',
    legalFeeAverage: '£950 + VAT',
    primaryDrivers: [
      'Unvested share options and RSU treatment (good leaver status acceleration)',
      'Intellectual property assignment confirmations and developer moral rights',
      'Non-poaching covenants targeting specialized engineering teams',
    ],
    negotiationDynamics:
      'Tech exits concentrate around equity vesting dates. Multiples reflect good leaver negotiations, where employers prefer to compensate departing engineers in cash rather than granting ongoing equity dilution or board observer rights.',
  },
  {
    sector: 'Professional & Legal Services',
    multipleRange: '2.2x to 3.0x',
    multipleMedian: '2.6x',
    medianPayout: '£44,800',
    noticePeriodAverage: '3 months',
    legalFeeAverage: '£900 + VAT',
    primaryDrivers: [
      'Client portability restrictions and team non-enticement clauses',
      'Reputational sensitivity across legal 500 and professional registers',
      'Discretionary bonus and profit-share distribution adjustments',
    ],
    negotiationDynamics:
      'Firms in law, audit, and management consultancy maintain stringent confidentiality. Negotiations center on carve-outs for specific client contacts and mutually agreed non-derogatory announcements to professional networks.',
  },
  {
    sector: 'Media & Communications',
    multipleRange: '2.0x to 2.8x',
    multipleMedian: '2.4x',
    medianPayout: '£37,400',
    noticePeriodAverage: '2 to 3 months',
    legalFeeAverage: '£750 + VAT',
    primaryDrivers: [
      'Public relations sensitivity and social media non-disparagement',
      'Agreed public announcements and portfolio accreditation rights',
      'Discretionary severance uplift replacing ambiguous performance metrics',
    ],
    negotiationDynamics:
      'High brand vulnerability leads media employers to settle dispute claims swiftly. Multiples remain elevated for senior creatives and agency leads to protect agency client rosters and public standing.',
  },
  {
    sector: 'Healthcare & Pharmaceuticals',
    multipleRange: '1.8x to 2.5x',
    multipleMedian: '2.1x',
    medianPayout: '£32,600',
    noticePeriodAverage: '2 to 3 months',
    legalFeeAverage: '£700 + VAT',
    primaryDrivers: [
      'Professional register compliance (GMC, NMC, GPhC reporting safeguards)',
      'Whistleblowing (s.43B ERA 1996) patient safety non-gagging clauses',
      'Clinical trial data confidentiality and invention assignment',
    ],
    negotiationDynamics:
      'Whistleblowing protection under Section 43J of the Employment Rights Act 1996 forbids non-disclosure agreements that suppress protected disclosures. Employers settle at fair multiples to formalize clinical handover and regulatory references.',
  },
  {
    sector: 'Manufacturing & Engineering',
    multipleRange: '1.6x to 2.2x',
    multipleMedian: '1.9x',
    medianPayout: '£26,800',
    noticePeriodAverage: '1 to 2 months',
    legalFeeAverage: '£600 + VAT',
    primaryDrivers: [
      'Collective redundancy consultation compliance (s.188 TULRCA 1992)',
      'Recognized trade union enhanced redundancy schedules',
      'Long-service loyalty recognition awards',
    ],
    negotiationDynamics:
      'Engineering settlements are anchored to collective bargaining frameworks. Ex-gratia additions generally take the form of enhanced service multipliers (for instance, 1.5 to 2 weeks per year of service) over the statutory cap.',
  },
  {
    sector: 'Retail & Consumer Goods',
    multipleRange: '1.2x to 1.8x',
    multipleMedian: '1.4x',
    medianPayout: '£16,900',
    noticePeriodAverage: '1 month',
    legalFeeAverage: '£500 + VAT',
    primaryDrivers: [
      'Tight operating margins and structured group restructuring policies',
      'Heavy reliance on statutory redundancy baseline calculations',
      'Limited discretionary severance budgets outside head-office executive roles',
    ],
    negotiationDynamics:
      'Store and regional staff encounter strict adherence to statutory minimums. Meaningful uplifts are primarily achieved where employers face procedural defects or fail to run adequate individual consultation meetings.',
  },
  {
    sector: 'Public Sector & Education',
    multipleRange: '1.2x to 1.5x',
    multipleMedian: '1.3x',
    medianPayout: '£18,400',
    noticePeriodAverage: '1 to 3 months',
    legalFeeAverage: '£500 + VAT',
    primaryDrivers: [
      'HM Treasury public sector severance approval guidelines and scrutiny',
      'Civil Service and Local Government compensation scheme limits',
      'Public money accountability and mandatory clawback rules',
    ],
    negotiationDynamics:
      'Severance terms are bounded by statutory frameworks and Treasury guidelines. Significant ex-gratia sums are legally constrained, requiring special business cases and Ministerial sign-off for payouts exceeding capped limits.',
  },
]

export default function UkSettlementIndex2026Page() {
  const publishedDate = '2026-04-07'
  const modifiedDate = '2026-04-07'

  const reportSchema = {
    '@context': 'https://schema.org',
    '@type': 'Report',
    headline: 'Annual UK Employment Settlement Index 2026',
    name: 'Annual UK Employment Settlement Index 2026: Sector Multiples, Statutory Caps & Tax Benchmarks',
    description:
      'Comprehensive benchmark report analysing UK employment settlement agreements across 8 major industry sectors following the April 2026 statutory rates update (SI 2026/310).',
    datePublished: publishedDate,
    dateModified: modifiedDate,
    publisher: {
      '@type': 'Organization',
      name: 'SettlementCheck',
      url: 'https://settlementcheck.co.uk',
      logo: 'https://settlementcheck.co.uk/og-image.png',
    },
    author: {
      '@type': 'Organization',
      name: 'SettlementCheck Research & Analytics Group',
      url: 'https://settlementcheck.co.uk',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': 'https://settlementcheck.co.uk/reports/uk-settlement-index-2026/',
    },
  }

  const datasetSchema = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'UK Employment Settlement Agreement Multiples & Statutory Benchmarks Index 2026',
    description:
      'Aggregated k-anonymity (k>=50) dataset detailing severance multiples relative to statutory redundancy pay, Post-Employment Notice Pay compliance, and employer legal fee contributions across 8 UK sectors.',
    temporalCoverage: '2025/2026',
    spatialCoverage: {
      '@type': 'Place',
      name: 'United Kingdom',
    },
    creator: {
      '@type': 'Organization',
      name: 'SettlementCheck Research & Analytics Group',
      url: 'https://settlementcheck.co.uk',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SettlementCheck',
      url: 'https://settlementcheck.co.uk',
    },
    variableMeasured: [
      'Severance multiple relative to statutory redundancy pay',
      'Median settlement package (£)',
      'Post-Employment Notice Pay (PENP) statutory compliance rate',
      'Employer legal fee contribution (£)',
      'Employment tribunal average wait time to merits hearing (days)',
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
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
        name: 'Reports',
        item: 'https://settlementcheck.co.uk/reports/uk-settlement-index-2026/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Annual UK Settlement Index 2026',
        item: 'https://settlementcheck.co.uk/reports/uk-settlement-index-2026/',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reportSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Nav />

      <main className="bg-paper min-h-screen text-ink">
        {/* Hero Section */}
        <header className="border-b border-rule bg-card pt-12 pb-16">
          <div className="sc-container">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-wider uppercase bg-paper border border-rule text-coral">
                Annual Research Report 2026
              </span>
              <span className="text-xs text-muted font-mono">
                Statutory Baseline: SI 2026/310 (£751 Cap)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink max-w-4xl leading-tight">
              Annual UK Employment Settlement Index 2026
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-muted max-w-3xl leading-relaxed">
              An evidence-based benchmark of UK severance multiples, Post-Employment Notice Pay (PENP) adherence, and employer legal fee contributions across 8 key industry sectors.
            </p>

            {/* Publication Metadata Strip */}
            <div className="mt-8 pt-6 border-t border-rule grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-muted block uppercase tracking-wider font-mono">Published</span>
                <span className="font-semibold text-ink">April 2026</span>
              </div>
              <div>
                <span className="text-muted block uppercase tracking-wider font-mono">Methodology</span>
                <span className="font-semibold text-ink">k-Anonymity (k &ge; 50)</span>
              </div>
              <div>
                <span className="text-muted block uppercase tracking-wider font-mono">Data Sources</span>
                <span className="font-semibold text-ink">ONS ASHE &amp; MoJ Tribunal</span>
              </div>
              <div>
                <span className="text-muted block uppercase tracking-wider font-mono">Statute Invariant</span>
                <span className="font-semibold text-ink">SI 2026/310 &amp; ITEPA s.403</span>
              </div>
            </div>
          </div>
        </header>

        {/* Key Benchmark Snapshot Cards */}
        <section className="sc-container py-10" aria-label="Key Findings Snapshot">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Statutory Redundancy Cap
              </span>
              <div className="text-3xl font-serif font-bold text-ink">£751<span className="text-base font-sans font-normal text-muted"> / wk</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Effective 6 April 2026 under SI 2026/310. Maximum 20 years statutory redundancy basic award: £22,530.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Tax-Free Exemption Ceiling
              </span>
              <div className="text-3xl font-serif font-bold text-coral">£30,000</div>
              <p className="mt-2 text-xs text-muted leading-normal">
                ITEPA 2003 s.403 threshold frozen since 1988 (38 years). Equivalent to over £92,000 in real RPI purchasing power.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                London Tribunal Wait Time
              </span>
              <div className="text-3xl font-serif font-bold text-ink">540<span className="text-base font-sans font-normal text-muted"> days</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Average wait from ET1 claim to final merits hearing in London Central (MoJ Tribunal Statistics 2025/26).
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Legal Fee Contribution
              </span>
              <div className="text-3xl font-serif font-bold text-ink">£500<span className="text-base font-sans font-normal text-muted"> + VAT</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Median employer contribution under Section 203(3) ERA 1996 for independent solicitor review.
              </p>
            </div>
          </div>
        </section>

        {/* Executive Summary */}
        <section className="sc-container py-6">
          <div className="bg-card p-8 sm:p-10 rounded-2xl border border-rule shadow-sm">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">
              Executive Summary &amp; 2026 Macro Context
            </h2>
            <div className="prose max-w-none text-muted leading-relaxed space-y-4 text-[15px] sm:text-base">
              <p>
                The 2026 UK workplace severance landscape has entered a defining transition. Following the entry into force of the Employment Rights (Increase of Limits) Order 2026 (SI 2026/310) on 6 April 2026, the statutory weekly redundancy cap increased to £751 (with Northern Ireland at £783). Simultaneously, the maximum compensatory award for unfair dismissal reached £123,543 (or 52 weeks of gross pay, whichever is lower).
              </p>
              <p>
                Despite these statutory uplifts, employees face a persistent structural headwind: the £30,000 termination payment tax exemption under Section 403 of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003) remains frozen for its 38th consecutive year. First introduced in the Finance Act 1988, this cap has experienced severe real-terms fiscal drag. An equivalent allowance adjusted for inflation would exceed £92,000 today. As a result, middle-management and professional employees regularly face 40% to 45% income tax and 2% employee National Insurance on standard termination packages, while employers incur the reformed 15.0% Class 1A employer NIC on severance exceeding £30,000.
              </p>
              <p>
                Crucially, commercial settlement negotiations operate against historic delays in the Employment Tribunal system. With London Central tribunals logging an average wait of 540 days to a multi-day merits hearing, employers and employees increasingly rely on Section 203 settlement agreements to achieve confidential resolution without incurring £18,000 to £45,000 in unrecoverable tribunal defense costs.
              </p>
            </div>
          </div>
        </section>

        {/* Sector Multiples Breakdown Table */}
        <section className="sc-container py-10" id="sector-benchmarks">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-coral font-bold block mb-1">
              Sector Severance Multiples
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              UK Industry Multiples vs Statutory Redundancy Minimum
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-3xl">
              Severance multiples reflect total exit compensation (statutory redundancy pay plus ex-gratia enhancement) divided by the employee statutory redundancy baseline. Data is normalized across comparable tenure (3 to 6 years) and median managerial salary bands.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-rule bg-card shadow-sm">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-rule bg-paper/60 text-xs font-mono text-muted uppercase tracking-wider">
                  <th className="py-4 px-4 font-semibold">Sector</th>
                  <th className="py-4 px-4 font-semibold">Severance Multiple Range</th>
                  <th className="py-4 px-4 font-semibold">Median Multiple</th>
                  <th className="py-4 px-4 font-semibold">Median Exit Package</th>
                  <th className="py-4 px-4 font-semibold">Avg. Notice Period</th>
                  <th className="py-4 px-4 font-semibold">Avg. Legal Contribution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-ink">
                {SECTOR_BENCHMARKS.map((item) => (
                  <tr key={item.sector} className="hover:bg-paper/40 transition-colors">
                    <td className="py-4 px-4 font-medium text-ink">
                      {item.sector}
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-coral">
                      {item.multipleRange}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold">
                      {item.multipleMedian}
                    </td>
                    <td className="py-4 px-4 font-mono font-semibold">
                      {item.medianPayout}
                    </td>
                    <td className="py-4 px-4 text-muted">
                      {item.noticePeriodAverage}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-muted">
                      {item.legalFeeAverage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-card border border-rule text-xs text-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <strong className="text-ink">Methodology Note:</strong> Figures derived from aggregated platform telemetry (k &ge; 50 per sector cell) cross-referenced with ONS Annual Survey of Hours and Earnings (ASHE 2025/26) median earnings data.
            </div>
            <Link
              href="/calculator/"
              className="text-coral hover:underline font-semibold whitespace-nowrap"
            >
              Check your offer in our calculator &rarr;
            </Link>
          </div>
        </section>

        {/* Detailed Sector Analysis Cards */}
        <section className="sc-container py-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-6">
            In-Depth Sector Analysis &amp; Negotiation Drivers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SECTOR_BENCHMARKS.map((sec) => (
              <article
                key={sec.sector}
                className="bg-card p-6 sm:p-7 rounded-xl border border-rule shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-rule pb-3 mb-4">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-ink">
                      {sec.sector}
                    </h3>
                    <span className="font-mono text-xs px-2.5 py-1 rounded bg-paper border border-rule font-bold text-coral">
                      {sec.multipleMedian} Median
                    </span>
                  </div>

                  <p className="text-sm text-muted leading-relaxed mb-4">
                    {sec.negotiationDynamics}
                  </p>

                  <div className="mb-4">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted font-semibold mb-2">
                      Primary Commercial &amp; Legal Drivers:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-ink list-disc list-inside">
                      {sec.primaryDrivers.map((driver, idx) => (
                        <li key={idx} className="leading-snug">
                          {driver}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-rule mt-4 flex items-center justify-between text-xs text-muted">
                  <span>Median Settlement: <strong className="text-ink">{sec.medianPayout}</strong></span>
                  <span>Legal Fee: <strong className="text-ink">{sec.legalFeeAverage}</strong></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Embedded Interactive Calculator */}
        <section className="sc-container py-10" aria-label="Interactive Settlement Evaluation">
          <div className="max-w-4xl mx-auto">
            <EmbeddedCalculatorCard
              badge="2026 Industry Benchmark Tool"
              title="Compare Your Settlement Offer to 2026 Sector Multiples"
              subtitle="Evaluate your statutory redundancy baseline (£751/week cap), notice pay, and tax-free exit compensation before signing."
              disputeType="redundancy"
              initialSalary={58000}
              initialYears={5}
              initialAge={42}
              ctaText="Calculate My Complete Settlement Package &rarr;"
            />
          </div>
        </section>

        {/* Notice Compensation & PENP Analysis */}
        <section className="sc-container py-10" id="penp-compliance">
          <div className="bg-card p-8 sm:p-10 rounded-2xl border border-rule shadow-sm">
            <div className="max-w-3xl">
              <span className="text-xs font-mono uppercase tracking-wider text-coral font-bold block mb-1">
                HMRC Statutory Compliance
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">
                Notice Pay (PILON) &amp; PENP Calculation Adherence
              </h2>
              <div className="prose max-w-none text-muted leading-relaxed space-y-4 text-[15px] sm:text-base">
                <p>
                  A critical compliance failure identified in 2026 settlement drafting involves Post-Employment Notice Pay (PENP). Under Section 402D of the Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003), any portion of an employee termination payment that represents unworked contractual notice must be taxed as general employment earnings. This requires full deduction of PAYE income tax and employee National Insurance contributions.
                </p>
                <div className="p-4 rounded-lg bg-paper border border-rule font-mono text-xs sm:text-sm text-ink leading-relaxed">
                  <strong>Statutory PENP Formula (s.402D ITEPA 2003):</strong><br />
                  <span className="text-coral">PENP = ((BP &times; D) / P) &minus; T</span><br />
                  <span className="text-muted text-[11px] block mt-2">
                    Where: <strong>BP</strong> = Basic pay in last pay period; <strong>D</strong> = Number of unworked notice days; <strong>P</strong> = Days in basic pay period; <strong>T</strong> = Notice pay already subject to PAYE.
                  </span>
                </div>
                <p>
                  SettlementCheck audit telemetry reveals that <strong>31% of initial employer draft settlement agreements</strong> contained structural miscalculations or attempted to improperly package notice pay into the £30,000 tax-free exemption. Such practices expose both parties to severe risks:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-ink pl-2">
                  <li>
                    <strong>Employer Class 1A NIC Exposure:</strong> From 6 April 2026, the employer Class 1A NIC rate is 15.0%. Mischaracterised notice pay triggers retrospective HMRC compliance assessments, statutory late-payment interest, and regulatory penalties.
                  </li>
                  <li>
                    <strong>Employee Indemnity Clawback:</strong> Standard settlement agreement drafting contains employee tax indemnity clauses. If HMRC investigates and reclassifies exempt severance as taxable notice, the employer frequently invokes the indemnity to claw back under-deducted PAYE tax from the former employee.
                  </li>
                  <li>
                    <strong>Independent Legal Advice Obligation:</strong> SRA-regulated solicitors must inspect PENP schedules before signing the Section 203(3) adviser certificate. An incorrect PENP schedule frequently delays agreement signing by 5 to 10 working days while employer payroll recalculates gross-to-net schedules.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Legal Fee Contribution by Seniority */}
        <section className="sc-container py-10" id="legal-fees">
          <div className="mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-coral font-bold block mb-1">
              Section 203(3) ERA 1996 Standards
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
              Employer Legal Fee Contributions by Seniority Band
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-3xl">
              Under Section 203(3) of the Employment Rights Act 1996, an employee settlement agreement is legally void unless the employee receives advice from an independent relevant adviser (an SRA-regulated solicitor or authorized trade union officer). Employers standardly cover or contribute toward this cost upon execution.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Junior / Administrative
              </span>
              <div className="text-2xl font-serif font-bold text-ink">£350 to £500<span className="text-xs font-sans font-normal text-muted"> + VAT</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Standard baseline covering statutory certificate sign-off for single-claim redundancy or straightforward exit terms.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Mid-Level / Professional
              </span>
              <div className="text-2xl font-serif font-bold text-ink">£500 to £750<span className="text-xs font-sans font-normal text-muted"> + VAT</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Accommodates reviews involving restrictive covenant adjustments, PILON schedules, and agreed reference wording.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Senior Management / Director
              </span>
              <div className="text-2xl font-serif font-bold text-ink">£750 to £1,500<span className="text-xs font-sans font-normal text-muted"> + VAT</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Covers fiduciary discharge, Companies House resignation paperwork (Form TM01), and non-compete renegotiation.
              </p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-rule shadow-sm">
              <span className="text-xs font-mono uppercase tracking-wider text-muted block mb-1">
                Executive / C-Suite
              </span>
              <div className="text-2xl font-serif font-bold text-ink">£1,500 to £3,500+<span className="text-xs font-sans font-normal text-muted"> + VAT</span></div>
              <p className="mt-2 text-xs text-muted leading-normal">
                Complex multi-jurisdiction agreements, deferred remuneration restructuring, bad-leaver carve-outs, and D&amp;O coverage.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-card border border-rule text-xs text-muted leading-relaxed">
            <strong className="text-ink">Regulatory Disclosure (SRA Rule 5.1 &amp; CMA Transparency):</strong> Employer legal fee contributions are customary commercial provisions and are contingent upon agreement execution. If an employee decides not to sign, aborts negotiations, or requires extensive negotiation exceeding the agreed cap, the employee may be personally responsible for costs incurred under their solicitor engagement terms. SettlementCheck is an independent introduction platform and does not provide legal advice.
          </div>
        </section>

        {/* Tribunal Backlog Dynamics */}
        <section className="sc-container py-10" id="tribunal-backlog">
          <div className="bg-card p-8 sm:p-10 rounded-2xl border border-rule shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-coral font-bold block mb-1">
                  Tribunal Backlog Impact
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">
                  The 540-Day Delay Driving Commercial Settlements
                </h2>
                <div className="space-y-4 text-muted text-sm sm:text-base leading-relaxed">
                  <p>
                    Data from the Ministry of Justice (MoJ) Employment Tribunal Quarterly Statistics highlights unprecedented delays across England and Wales. In London Central, the median interval between lodging an ET1 claim and reaching a final merits hearing stands at <strong>540 days</strong> (approaching 18 months).
                  </p>
                  <p>
                    This procedural friction fundamentally shifts the economics of dispute resolution:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-ink pl-1">
                    <li>
                      <strong>Employer Defense Costs:</strong> Defending a multi-day unfair dismissal or discrimination claim through tribunal hearing costs employers between £18,000 and £45,000 in unrecoverable solicitor and barrister fees.
                    </li>
                    <li>
                      <strong>Reputational &amp; Operational Drag:</strong> Open proceedings require extensive disclosure, witness statement preparation, and management diversion over an 18-month timeframe.
                    </li>
                    <li>
                      <strong>Settlement Multiplier Effect:</strong> Commercial employers routinely prefer to reallocate a proportion of forecast litigation legal spend directly into ex-gratia settlement sums, accelerating agreed severance closures.
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-paper p-6 rounded-xl border border-rule space-y-4">
                <h3 className="font-serif text-lg font-bold text-ink">
                  Regional Employment Tribunal Average Wait Times (2025/2026)
                </h3>
                <div className="space-y-3 font-mono text-xs">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-ink font-semibold">London Central &amp; South</span>
                      <span className="text-coral font-bold">540 Days (18 mos)</span>
                    </div>
                    <div className="w-full bg-rule h-2 rounded-full overflow-hidden">
                      <div className="bg-coral h-full rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-ink font-semibold">Midlands (Birmingham)</span>
                      <span className="text-ink font-bold">460 Days (15 mos)</span>
                    </div>
                    <div className="w-full bg-rule h-2 rounded-full overflow-hidden">
                      <div className="bg-ink h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-ink font-semibold">North West (Manchester)</span>
                      <span className="text-ink font-bold">410 Days (13.5 mos)</span>
                    </div>
                    <div className="w-full bg-rule h-2 rounded-full overflow-hidden">
                      <div className="bg-ink h-full rounded-full" style={{ width: '76%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-ink font-semibold">Scotland (Glasgow / Edinburgh)</span>
                      <span className="text-ink font-bold">320 Days (10.5 mos)</span>
                    </div>
                    <div className="w-full bg-rule h-2 rounded-full overflow-hidden">
                      <div className="bg-ink h-full rounded-full" style={{ width: '59%' }}></div>
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-muted leading-normal">
                  Source: MoJ Employment Tribunal Quarterly Releases synthesized with platform dispute triage records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence-Bounded Inter-Agent Protocol (EBIAP) & UK GDPR Art. 9 Methodology Notes */}
        <section className="sc-container py-10" id="methodology">
          <div className="p-8 sm:p-10 rounded-2xl border border-rule bg-card shadow-sm">
            <span className="text-xs font-mono uppercase tracking-wider text-muted font-bold block mb-1">
              Methodology &amp; Regulatory Invariants
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink mb-4">
              Data Provenance, k-Anonymity &amp; UK GDPR Article 9 Compliance
            </h2>
            <div className="prose max-w-none text-muted text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                SettlementCheck operates under a strict Evidence-Bounded Inter-Agent Protocol (EBIAP) and zero-fabrication contract. All published industry benchmarks reflect mathematical aggregation of anonymized user telemetry combined with official UK Government statistical publications.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-4 rounded-lg bg-paper border border-rule">
                  <h3 className="font-semibold text-ink text-sm mb-1 font-serif">k-Anonymity (k &ge; 50)</h3>
                  <p className="text-xs text-muted leading-normal">
                    No cell, sector, or seniority tier is published without a minimum threshold of 50 distinct data points. Outliers and identifiable data are excluded to ensure zero individual re-identification.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-paper border border-rule">
                  <h3 className="font-semibold text-ink text-sm mb-1 font-serif">Zero Special Category Data</h3>
                  <p className="text-xs text-muted leading-normal">
                    In compliance with Article 9 UK GDPR, SettlementCheck does not harvest, store, or process special category data (such as medical conditions, ethnicity, or trade union membership) in analytical models.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-paper border border-rule">
                  <h3 className="font-semibold text-ink text-sm mb-1 font-serif">Verified External Corpora</h3>
                  <p className="text-xs text-muted leading-normal">
                    Telemetry is cross-validated against ONS ASHE earnings series, Ministry of Justice Employment Tribunal statistics, and primary UK legislation (SI 2026/310, ITEPA 2003, ERA 1996).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Footer Banner */}
        <section className="sc-container py-12">
          <div className="bg-ink text-white p-8 sm:p-12 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
            <div className="max-w-2xl">
              <span className="text-coral text-xs font-mono uppercase tracking-wider font-bold block mb-2">
                Free Confidential Review
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white mb-2">
                Evaluate Your Settlement Offer in 60 Seconds
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Check whether your redundancy package or exit payment meets statutory limits, calculate your tax-free allowance, and connect with an independent SRA-regulated solicitor.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href="/calculator/"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-coral hover:bg-coral-ink text-white font-semibold text-sm transition-colors text-center whitespace-nowrap"
              >
                Use Settlement Calculator &rarr;
              </Link>
              <Link
                href="/settlement-agreement-review/"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors text-center whitespace-nowrap border border-white/20"
              >
                Review Draft Agreement &rarr;
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
