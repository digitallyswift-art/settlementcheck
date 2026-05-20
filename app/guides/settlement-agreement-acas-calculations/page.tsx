import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Settlement Agreement ACAS-Based Calculations | SettlementCheck',
  description:
    'How ACAS-based settlement calculations work. Understand the £751 weekly pay cap (April 2026), tax-free limits, PILON tax rules, and the statutory redundancy formula.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
  },
  openGraph: {
    title: 'Settlement Agreement ACAS-Based Calculations | SettlementCheck',
    description:
      'How ACAS-based settlement calculations work. Understand the £751 weekly pay cap (April 2026), tax-free limits, PILON tax rules, and the statutory redundancy formula.',
    url: 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const FAQS = [
  {
    q: 'Are these ACAS-based calculations official?',
    a: 'SettlementCheck is an independent tool, not affiliated with any legal body. Our ACAS-based calculations follow UK statutory rates set by SI 2026/310: the £751 weekly pay cap, the three-tier redundancy formula, and the £30,000 tax-free limit under ITEPA 2003 s.403. The figures are fixed by law and do not vary.',
  },
  {
    q: 'Can I get more than the ACAS-based statutory figure?',
    a: 'Yes. The statutory framework sets the minimum entitlement, not the ceiling. Employers routinely add ex-gratia compensation on top of statutory redundancy to secure a settlement. The additional amount depends on your bargaining position, length of service, and whether there are potential employment claims in the background. An independent solicitor can advise on what figure is reasonable for your circumstances.',
  },
  {
    q: 'How accurate are ACAS-based calculations?',
    a: 'The statutory framework is fixed by law: the weekly pay cap, the three-tier formula, and the £30,000 limit do not vary. Our calculator applies these exactly. What the calculator cannot do is assess your individual bargaining position or the strength of any legal claim you may have. Use it to understand your statutory baseline, then discuss the result with a solicitor.',
  },
  {
    q: 'What does ACAS-based mean for settlement agreements?',
    a: 'ACAS-based refers to calculations that use the UK statutory rates and employment law framework governing settlement agreements. These include the weekly pay cap (£751 from April 2026, SI 2026/310), the statutory redundancy formula under the Employment Rights Act 1996, and the £30,000 tax-free termination limit under ITEPA 2003 s.403. These figures apply to all settlement agreements in England, Scotland, and Wales.',
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
  headline: 'How ACAS-Based Settlement Calculations Work — What the £751 Weekly Pay Cap Means for Your Offer',
  url: 'https://settlementcheck.co.uk/guides/settlement-agreement-acas-calculations/',
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

export default function AcasCalculationsGuide() {
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
              <span className="text-xs text-ink truncate">ACAS-Based Settlement Calculations</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>Settlement Agreement Guide</p>
            <h1 className="sc-h1 mb-5">
              How ACAS-Based Settlement Calculations Work: What the £751 Weekly Pay Cap Means for Your Offer
            </h1>
            <p className="sc-lead">
              ACAS-based settlement calculations use statutory rates set by UK employment law. In April 2026, the weekly pay cap is £751 (SI 2026/310). This figure limits statutory redundancy pay and affects what your employer must offer before discussing additional compensation. This guide explains how ACAS-based entitlements are calculated and what the law says about tax.
            </p>
          </div>
        </section>

        {/* What the framework covers */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">What ACAS-based statutory calculations cover</h2>
            <p className="sc-body mb-6">
              ACAS-based statutory calculations provide minimum entitlements that apply across England, Scotland, and Wales. These figures are the legal floor, not the ceiling. Your employer may offer more. Four key elements make up the statutory baseline.
            </p>
            <ul className="flex flex-col gap-3">
              {[
                'Statutory redundancy pay is capped at £22,530, calculated using age, length of service, and weekly salary capped at £751 (April 2026, SI 2026/310).',
                'Notice pay is compensation for the contractual notice period owed but not worked.',
                'Holiday pay is payment for accrued but untaken annual leave at the point of leaving.',
                'The £30,000 tax-free limit applies to genuine compensation payments under ITEPA 2003 s.403, excluding PILON.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Redundancy formula */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How ACAS-based redundancy pay is calculated</h2>
            <p className="sc-body mb-6">
              ACAS-based redundancy pay uses a three-tier formula set out in the Employment Rights Act 1996. Each full year of qualifying service counts as a fraction of a week's pay, capped at £751 from April 2026 (SI 2026/310).
            </p>
            <div className="rounded-xl border border-rule overflow-hidden mb-8">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-left px-4 py-3 font-medium">Age at redundancy</th>
                    <th className="text-left px-4 py-3 font-medium">Weeks per year of service</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Under 22', '0.5 week'],
                    ['22 to 40', '1 week'],
                    ['41 and over', '1.5 weeks'],
                  ].map(([age, rate], i) => (
                    <tr key={age} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink">{age}</td>
                      <td className="px-4 py-3 text-ink">{rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="rounded-xl border border-rule bg-paper p-5">
              <p className="text-sm font-semibold text-ink mb-3">Example calculation</p>
              <p className="sc-body text-sm mb-2">
                Employee aged 38, 9 years of service, £600 per week gross salary.
              </p>
              <p className="sc-body text-sm mb-2">
                Age 38 falls in the middle tier (22 to 40): 1 week per year of service.
              </p>
              <p className="sc-body text-sm mb-2">
                9 years x £600 = <strong>£5,400 statutory redundancy</strong>
              </p>
              <p className="sc-body text-sm text-muted">
                The £751 cap only applies if weekly salary exceeds £751. At £600/week, the actual salary is used.
              </p>
            </div>
          </div>
        </section>

        {/* £30k and PILON */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The £30,000 tax-free limit and how PILON changes it</h2>
            <p className="sc-body mb-6">
              Up to £30,000 of genuine compensation can be paid tax-free under ITEPA 2003 s.403. This applies to statutory redundancy and ex-gratia compensation. PILON is different.
            </p>
            <div className="rounded-xl border border-rule bg-paper p-5 mb-6 flex gap-3">
              <InfoIcon />
              <p className="sc-body text-sm">
                PILON (Payment in Lieu of Notice) is always taxed as earnings under ITEPA 2003 s.402D, regardless of the £30,000 limit. Your employer must deduct income tax and National Insurance from PILON before paying it.
              </p>
            </div>
            <ul className="flex flex-col gap-3">
              {[
                'Statutory redundancy pay: typically tax-free within the £30,000 limit.',
                'Holiday pay: typically tax-free within the £30,000 limit.',
                'PILON (notice period paid but not worked): always taxed as earnings, separate from the £30,000 limit.',
                'Ex-gratia compensation: tax-free up to the £30,000 combined limit.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon />
                  <span className="sc-body text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 10-day period */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The 10-day consideration period in ACAS-based practice</h2>
            <p className="sc-body mb-4">
              UK employment law practice requires employers to allow a minimum of 10 calendar days for an employee to review a settlement offer before signing. This standard is reflected in ACAS-based guidance and is widely applied across settlement negotiations.
            </p>
            <p className="sc-body mb-4">
              The 10 days begins from the date the employer presents the draft agreement. Within this window you should appoint a solicitor, obtain independent legal advice, and consider whether to counter-offer. The employer cannot require you to sign before this period ends.
            </p>
            <p className="sc-body">
              The employer can withdraw the offer at any time. A counter-offer in contract law acts as a rejection of the original offer, meaning the employer could remove the settlement entirely. In practice, most employers reiterate their original figure rather than withdrawing.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 border-b border-rule bg-navy">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">See your statutory figure now</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Enter your age, salary, and length of service. The calculator applies the April 2026 statutory rates and separates PILON from the £30,000 tax-free limit.
            </p>
            <Link
              href="/#calculator"
              className="inline-flex items-center gap-2 bg-coral text-white font-semibold px-7 py-3.5 rounded-full hover:bg-coral/90 transition-colors text-sm"
            >
              Calculate my entitlement
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
