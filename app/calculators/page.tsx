import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion, { type FaqItem } from '@/components/FaqAccordion'
import CalculatorsClient from './CalculatorsClient'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Employment & Settlement Calculators UK | SettlementCheck',
  description:
    'Compare all free UK employment calculators: settlement agreements, statutory redundancy (£751 cap), unfair dismissal, tax, and protective awards.',
  alternates: {
    canonical: '/calculators/',
  },
  openGraph: {
    title: 'Employment & Settlement Calculators UK | SettlementCheck',
    description:
      'Compare all free UK employment calculators: settlement agreements, statutory redundancy (£751 cap), unfair dismissal, tax, and protective awards.',
    url: '/calculators/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Employment & Settlement Calculators UK | SettlementCheck',
    description:
      'Compare all free UK employment calculators: settlement agreements, statutory redundancy (£751 cap), unfair dismissal, tax, and protective awards.',
  },
}

const CALCULATORS_FAQS: FaqItem[] = [
  {
    q: 'Which calculator should I start with if I have just been given a settlement offer?',
    a: 'Start with the flagship Settlement Agreement Calculator (/calculator/). It evaluates your entire package—including statutory redundancy baseline, contractual notice pay, and ex-gratia compensation—giving you an instant fairness score and estimated net take-home figure. If you specifically need to verify contract clauses or check employer legal fee contributions, follow up with the Employment Settlement Checker.',
  },
  {
    q: 'How do I know these calculators are accurate for April 2026?',
    a: 'All calculators on SettlementCheck are strictly calibrated to the April 2026 statutory rates set out in SI 2026/310: the Great Britain statutory weekly pay cap is £751 (capped at 20 years of service), the maximum unfair dismissal compensatory award is £123,543, and the termination ex-gratia tax-free allowance is £30,000 under Section 403 of the Income Tax (Earnings and Pensions) Act 2003.',
  },
  {
    q: 'Do I have to pay to use any of these calculators, and is my data saved?',
    a: 'Every calculator on this hub is 100% free, confidential, and anonymous. We never ask for your email address, phone number, or employer name just to see your calculation results. Your inputs are evaluated purely in your browser session.',
  },
  {
    q: 'Can my employer withdraw their settlement offer if I use a calculator or negotiate?',
    a: 'While formal "without prejudice" or Section 111A settlement proposals can theoretically be withdrawn, statutory rights (such as statutory redundancy pay and accrued wages/notice) cannot be removed. Furthermore, employers propose settlement agreements because they want guaranteed legal finality. Walking into a conversation with accurate statutory figures allows you to negotiate calmly from objective facts rather than emotion.',
  },
  {
    q: 'Does my employer really have to pay for my solicitor to advise me?',
    a: 'Yes. Under Section 203 of the Employment Rights Act 1996, a settlement agreement is legally void and unenforceable unless you receive advice from an independent, qualified, and insured SRA-regulated solicitor. Because the employer requires a binding waiver, UK employers pay a legal fee contribution—typically £500 to £1,500 + VAT—which means the advice is usually completely free to you.',
  },
  {
    q: 'What is the difference between statutory redundancy pay and a settlement agreement?',
    a: 'Statutory redundancy pay is the legal minimum entitlement you receive if your job disappears and you have at least 2 years continuous service. A settlement agreement is a voluntary contract where you agree not to bring employment tribunal claims in exchange for an agreed financial package (which usually includes statutory redundancy, notice pay, and an enhanced ex-gratia payment).',
  },
  {
    q: 'What if 20 or more staff are being made redundant without proper consultation?',
    a: 'If an employer proposes to make 20 or more employees redundant at one establishment within 90 days, they are legally required under TULRCA 1992 s.188 to conduct collective consultation for at least 30 days (or 45 days for 100+ employees). If they fail to do so, an Employment Tribunal can award each employee up to 90 days gross actual pay as a protective award—uncapped by the £751 weekly statutory limit.',
  },
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['CollectionPage', 'WebPage'],
      '@id': 'https://settlementcheck.co.uk/calculators/#webpage',
      url: 'https://settlementcheck.co.uk/calculators/',
      name: 'UK Employment Calculators & Settlement Tools Hub (2026)',
      description:
        'Comprehensive directory of free UK employment calculators: settlement agreements, statutory redundancy, unfair dismissal, tax exemptions, and protective awards.',
      isPartOf: {
        '@type': 'WebSite',
        '@id': 'https://settlementcheck.co.uk/#website',
        name: 'SettlementCheck',
        url: 'https://settlementcheck.co.uk',
      },
      breadcrumb: {
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
            name: 'Calculators',
            item: 'https://settlementcheck.co.uk/calculators/',
          },
        ],
      },
      mainEntity: {
        '@type': 'ItemList',
        name: 'UK Employment Law Calculators & Statutory Tools',
        description: 'Complete directory of UK employment calculators for redundancy, settlement agreements, unfair dismissal, and termination tax.',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Settlement Agreement Calculator',
            url: 'https://settlementcheck.co.uk/calculator/',
            description: 'Evaluate UK settlement offers against April 2026 statutory rates and market benchmarks in 60 seconds.',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Redundancy Pay Calculator',
            url: 'https://settlementcheck.co.uk/redundancy-calculator/',
            description: 'Calculate statutory redundancy pay under the April 2026 cap (£751/week) with age-weighted multipliers.',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Unfair Dismissal Calculator',
            url: 'https://settlementcheck.co.uk/unfair-dismissal-calculator/',
            description: 'Estimate Employment Tribunal basic and compensatory awards up to the £123,543 statutory cap.',
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'Constructive Dismissal Calculator',
            url: 'https://settlementcheck.co.uk/constructive-dismissal-calculator/',
            description: 'Assess claim strength and financial loss when employer breach forces your resignation.',
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Settlement Agreement Tax Calculator',
            url: 'https://settlementcheck.co.uk/settlement-agreement-tax-calculator/',
            description: 'Calculate the £30,000 tax-free exemption under ITEPA 2003 s.403 and net take-home pay.',
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: 'Protective Award Calculator',
            url: 'https://settlementcheck.co.uk/protective-award-calculator/',
            description: 'Calculate entitlement of up to 90 days gross pay for collective redundancy consultation failure.',
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: 'Employment Settlement Checker',
            url: 'https://settlementcheck.co.uk/settlement-agreement-review/',
            description: 'Instant check verifying draft clauses, legal fee contributions, and negotiation counter-proposals.',
          },
        ],
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://settlementcheck.co.uk/calculators/#faq',
      mainEntity: CALCULATORS_FAQS.map((faq) => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a,
        },
      })),
    },
  ],
}

export default function CalculatorsHubPage() {
  return (
    <>
      <Script
        id="schema-calculators-hub"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Nav />

      <main className="min-h-screen bg-paper pb-20">
        {/* Breadcrumb Bar */}
        <div className="border-b border-rule bg-card/60">
          <div className="sc-container py-3">
            <nav aria-label="Breadcrumb" className="text-[12px] text-muted flex items-center gap-2">
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
              <span className="text-muted/60" aria-hidden="true">/</span>
              <span className="text-ink font-medium" aria-current="page">
                Calculators
              </span>
            </nav>
          </div>
        </div>

        {/* Hero Section: Answer-First & Attention Economy Optimized */}
        <section className="sc-container pt-12 md:pt-16 pb-12 border-b border-rule">
          <div className="max-w-[840px]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FDF7F4] border border-coral/30 text-coral text-[12px] font-semibold tracking-wider uppercase mb-5">
              <span className="w-2 h-2 rounded-full bg-coral animate-ping" aria-hidden="true" />
              <span>Independent UK Employment Law Calculators · April 2026 Rates</span>
            </div>

            <h1 className="sc-h1 mb-6">
              Take control of your exit. Free statutory calculators.
            </h1>

            <p className="sc-lead mb-8">
              When your job or income is at risk, corporate HR language leaves you second-guessing everything.
              Our independent calculators remove the guesswork—giving you exact statutory calculations,
              tax breakdowns, and the financial clarity you need to negotiate from a position of strength.
            </p>

            {/* Reassurance & Attention Anchors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-card border border-rule/80 flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Statutory Weekly Cap</span>
                <span className="text-[18px] md:text-[20px] font-bold text-ink">£751 / wk</span>
                <span className="text-[11px] text-muted">ERA 1996 · SI 2026/310</span>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-rule/80 flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Unfair Dismissal Cap</span>
                <span className="text-[18px] md:text-[20px] font-bold text-ink">£123,543</span>
                <span className="text-[11px] text-muted">Or 52 wks actual gross pay</span>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-rule/80 flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Tax-Free Floor</span>
                <span className="text-[18px] md:text-[20px] font-bold text-ink">£30,000</span>
                <span className="text-[11px] text-muted">ITEPA 2003 s.403</span>
              </div>
              <div className="p-3.5 rounded-xl bg-card border border-rule/80 flex flex-col gap-1">
                <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">Legal Fee Cost</span>
                <span className="text-[18px] md:text-[20px] font-bold text-coral">£0 To You</span>
                <span className="text-[11px] text-muted">Employer covers advice</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Calculators Engine: Fast-Path Navigator & Cards */}
        <section className="sc-container py-12 md:py-16">
          <CalculatorsClient />
        </section>

        {/* Dismantling the Existential Vacuum: Restoring Agency & Clarity */}
        <section className="border-t border-rule bg-card py-16 md:py-20">
          <div className="sc-container">
            <div className="max-w-[760px] mb-12">
              <div className="text-[12px] font-sans font-semibold tracking-wider text-coral uppercase mb-3">
                Mindset &amp; Legal Leverage · Eradicating Helplessness
              </div>
              <h2 className="sc-h2 mb-4">
                Why you have far more leverage than HR wants you to believe
              </h2>
              <p className="sc-body text-[16px] md:text-[17px]">
                Facing job loss, redundancy, or an unexpected protected conversation is disorienting.
                Employers often rely on surprise, confusing terminology, and artificial urgency to rush employees into signing.
                Here is why you are not powerless:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              <div className="p-6 md:p-8 rounded-2xl bg-paper border border-rule flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-[14px]">
                  01
                </div>
                <h3 className="text-[18px] md:text-[20px] font-serif font-460 text-ink">
                  The employer needs your signature more than you need theirs
                </h3>
                <p className="text-[14px] md:text-[15px] text-muted leading-relaxed">
                  An unsigned settlement agreement gives your company zero protection. Under UK law, employers cannot buy legal finality
                  unless you voluntarily agree to sign. They are paying for risk mitigation and peace of mind. Recognizing that you hold
                  something they require immediately shifts the power dynamic back in your favour.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-2xl bg-paper border border-rule flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-[14px]">
                  02
                </div>
                <h3 className="text-[18px] md:text-[20px] font-serif font-460 text-ink">
                  Statutory caps are the legal floor, never the ceiling
                </h3>
                <p className="text-[14px] md:text-[15px] text-muted leading-relaxed">
                  HR managers often present statutory redundancy pay (£751/week cap) or standard contractual notice as a generous concession.
                  In reality, those are the absolute bare legal minimums you are entitled to by law. Any valid settlement agreement must provide
                  an ex-gratia premium to compensate you for forfeiting your rights to an Employment Tribunal.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-2xl bg-paper border border-rule flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-[14px]">
                  03
                </div>
                <h3 className="text-[18px] md:text-[20px] font-serif font-460 text-ink">
                  Independent legal advice is mandatory—and funded by your employer
                </h3>
                <p className="text-[14px] md:text-[15px] text-muted leading-relaxed">
                  Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is completely void unless you receive advice
                  from an independent SRA-regulated solicitor. Employers standardly contribute between £500 and £1,500 + VAT towards these fees.
                  You do not need to fight alone, and getting expert representation will not leave you out of pocket.
                </p>
              </div>

              <div className="p-6 md:p-8 rounded-2xl bg-paper border border-rule flex flex-col gap-3">
                <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center font-bold text-[14px]">
                  04
                </div>
                <h3 className="text-[18px] md:text-[20px] font-serif font-460 text-ink">
                  The 10-day consideration period defeats panic tactics
                </h3>
                <p className="text-[14px] md:text-[15px] text-muted leading-relaxed">
                  Employers often impose 24-hour or 48-hour deadlines to induce panic. However, paragraph 12 of the ACAS Code of Practice
                  on Settlement Agreements stipulates that employees should be given a minimum of 10 calendar days to consider proposed terms.
                  Rushing you can constitute improper behaviour, which forfeits the employer&apos;s &quot;without prejudice&quot; secrecy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statutory Reference Matrix Table */}
        <section className="sc-container py-16 md:py-20 border-t border-rule">
          <div className="max-w-[760px] mb-8">
            <div className="text-[12px] font-sans font-semibold tracking-wider text-coral uppercase mb-2">
              Statutory Benchmark Matrix · 2026/2027 Financial Year
            </div>
            <h2 className="sc-h2 mb-3">
              Key UK statutory figures applied across all calculators
            </h2>
            <p className="sc-body">
              Every calculator on this platform runs pure mathematical implementations of current UK statutory legislation:
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-rule bg-card shadow-sm">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-rule bg-paper text-ink font-serif font-460">
                  <th className="p-4 md:px-6">Statutory Metric</th>
                  <th className="p-4 md:px-6">Current Rate (2026)</th>
                  <th className="p-4 md:px-6">Governing Legislation</th>
                  <th className="p-4 md:px-6">Applicable Calculator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule text-muted">
                <tr>
                  <td className="p-4 md:px-6 font-medium text-ink">Statutory Weekly Pay Cap (GB)</td>
                  <td className="p-4 md:px-6 font-semibold text-ink">£751 / week</td>
                  <td className="p-4 md:px-6">ERA 1996 s.227 · SI 2026/310</td>
                  <td className="p-4 md:px-6">
                    <Link href="/redundancy-calculator/" className="text-coral hover:underline">
                      Redundancy Pay Calculator
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-medium text-ink">Maximum Statutory Redundancy Pay</td>
                  <td className="p-4 md:px-6 font-semibold text-ink">£22,530 (20 yrs × 1.5)</td>
                  <td className="p-4 md:px-6">ERA 1996 s.162</td>
                  <td className="p-4 md:px-6">
                    <Link href="/redundancy-calculator/" className="text-coral hover:underline">
                      Redundancy Pay Calculator
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-medium text-ink">Unfair Dismissal Compensatory Cap</td>
                  <td className="p-4 md:px-6 font-semibold text-ink">£123,543 (or 52 wks)</td>
                  <td className="p-4 md:px-6">ERA 1996 s.124 · SI 2026/310</td>
                  <td className="p-4 md:px-6">
                    <Link href="/unfair-dismissal-calculator/" className="text-coral hover:underline">
                      Unfair Dismissal Calculator
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-medium text-ink">Termination Tax Exemption Floor</td>
                  <td className="p-4 md:px-6 font-semibold text-ink">£30,000 tax-free</td>
                  <td className="p-4 md:px-6">ITEPA 2003 s.403</td>
                  <td className="p-4 md:px-6">
                    <Link href="/settlement-agreement-tax-calculator/" className="text-coral hover:underline">
                      Tax Calculator
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-medium text-ink">Protective Award Maximum</td>
                  <td className="p-4 md:px-6 font-semibold text-ink">Up to 90 days gross pay</td>
                  <td className="p-4 md:px-6">TULRCA 1992 s.189</td>
                  <td className="p-4 md:px-6">
                    <Link href="/protective-award-calculator/" className="text-coral hover:underline">
                      Protective Award Calculator
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td className="p-4 md:px-6 font-medium text-ink">Legal Advice Funding Benchmark</td>
                  <td className="p-4 md:px-6 font-semibold text-coral">£500 – £1,500 + VAT</td>
                  <td className="p-4 md:px-6">ERA 1996 s.203 Standard Practice</td>
                  <td className="p-4 md:px-6">
                    <Link href="/settlement-agreement-review/" className="text-coral hover:underline">
                      Settlement Checker
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="sc-container py-16 md:py-20 border-t border-rule">
          <div className="max-w-[760px] mb-10">
            <div className="text-[12px] font-sans font-semibold tracking-wider text-coral uppercase mb-2">
              Frequently Asked Questions
            </div>
            <h2 className="sc-h2 mb-4">
              Answers to common calculation and settlement questions
            </h2>
            <p className="sc-body">
              Everything you need to know about navigating your exit, statutory entitlements, and independent solicitor advice:
            </p>
          </div>

          <div className="max-w-[800px]">
            <FaqAccordion faqs={CALCULATORS_FAQS} />
          </div>
        </section>

        {/* Final Conversion Banner */}
        <section className="sc-container pt-8 pb-12">
          <div className="rounded-3xl bg-ink text-white p-8 md:p-14 text-center flex flex-col items-center gap-6 shadow-xl">
            <span className="text-[12px] font-sans font-semibold tracking-wider text-coral uppercase">
              Free · Instant · 100% Confidential
            </span>
            <h2 className="font-serif text-[28px] md:text-[40px] font-420 leading-tight max-w-[26ch]">
              Do not sign away your rights without knowing your true numbers
            </h2>
            <p className="text-white/70 text-[15px] md:text-[17px] max-w-[54ch] leading-relaxed">
              Whether you are facing redundancy, constructive dismissal, or have a draft agreement on your desk,
              get an exact baseline calculation before making your next move.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <Link href="/calculator/" className="btn-accent text-[15px] px-7 py-3.5">
                Check my settlement offer →
              </Link>
              <Link
                href="/settlement-agreement-review/"
                className="text-white/80 hover:text-white text-[14px] font-medium px-5 py-3 border border-white/20 rounded-lg hover:border-white/40 transition-colors"
              >
                Review draft agreement clauses →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
