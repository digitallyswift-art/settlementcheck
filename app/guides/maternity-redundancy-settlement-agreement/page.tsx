import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import FaqAccordion from '@/components/FaqAccordion'
import DynamicFaqSection from '@/components/seo/DynamicFaqSection'
import ReviewCallout from '@/components/ReviewCallout'
import RelatedArticles from '@/components/RelatedArticles'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Maternity Redundancy Settlement Agreement UK 2026 | Rights & Payouts',
  description:
    'UK maternity redundancy settlement guide 2026. 18-month protection window, Regulation 10 priority, ring-fenced SMP, uncapped discrimination awards, and tax rules.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/guides/maternity-redundancy-settlement-agreement/',
  },
  openGraph: {
    title: 'Maternity Redundancy Settlement Agreement UK 2026 | Rights & Payouts',
    description:
      'UK maternity redundancy settlement guide 2026. 18-month protection window, Regulation 10 priority, ring-fenced SMP, uncapped discrimination awards, and tax rules.',
    url: 'https://settlementcheck.co.uk/guides/maternity-redundancy-settlement-agreement/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maternity Redundancy Settlement Agreement UK 2026 | Rights & Payouts',
    description:
      'UK maternity redundancy settlement guide 2026. 18-month protection window, Regulation 10 priority, ring-fenced SMP, uncapped discrimination awards, and tax rules.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/guides/maternity-redundancy-settlement-agreement/', STATIC_METADATA)
}

const FAQS = [
  {
    q: 'Can my employer make me redundant while I am on maternity leave?',
    a: 'Yes, but only if a genuine redundancy situation exists and your selection is completely free from discrimination. Under Regulation 10 of the MPLR 1999, you have absolute statutory priority for any suitable alternative vacancy without attending interviews. If a suitable vacancy exists and your employer fails to offer it, your dismissal is automatically unfair under Section 99 ERA 1996.',
  },
  {
    q: 'What is the 18-month redundancy protection window under the 2024 regulations?',
    a: 'Under the Protection from Redundancy (Pregnancy and Family Leave) Act 2023 and the 2024 regulations, your redundancy protection window lasts for 18 months. It starts when you inform your employer of your pregnancy. It continues through maternity leave until 18 months from the expected week of childbirth or your child\'s actual birth date.',
  },
  {
    q: 'Can my employer include my Statutory Maternity Pay (SMP) inside a settlement sum?',
    a: 'No. Under Section 164 of the Social Security Contributions and Benefits Act 1992 and Regulation 21 of the Statutory Maternity Pay Regulations 1986, contracting out of SMP is legally void. If you qualify for SMP, your employer must pay all remaining weeks of your 39-week entitlement in full on top of any settlement sum.',
  },
  {
    q: 'How much should I receive in a maternity redundancy settlement agreement in 2026?',
    a: 'A fair maternity settlement package includes your statutory redundancy pay (capped at £751 per week from 6 April 2026), full notice pay, all remaining statutory maternity pay, and an ex-gratia compensation sum. Because pregnancy dismissal is automatically unfair and tribunal awards are uncapped under the Equality Act 2010, ex-gratia sums often reflect injury to feelings under the 2026 Vento bands (£1,300 to £62,900+).',
  },
  {
    q: 'Is an employer protected conversation confidential if I am pregnant or on maternity leave?',
    a: 'No. Section 111A of the Employment Rights Act 1996 covers pre-termination discussions only for ordinary unfair dismissal. Under Section 111A(4), confidentiality does not apply to pregnancy and maternity discrimination or automatically unfair dismissal under Section 99. You can refer to these conversations in an employment tribunal claim.',
  },
  {
    q: 'Who pays the solicitor fees for reviewing my maternity settlement agreement?',
    a: 'Your employer covers the legal fees. Under Section 203(3) of the Employment Rights Act 1996, a settlement agreement is only legally valid if you receive advice from an independent, insured solicitor. Employers typically contribute between £500 and £1,500 plus VAT, and your solicitor bills your employer directly.',
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
  headline: 'Maternity Redundancy Settlement Agreement UK (2026): Rights, Rules & Payouts',
  url: 'https://settlementcheck.co.uk/guides/maternity-redundancy-settlement-agreement/',
  image: ['https://settlementcheck.co.uk/og-image.png'],
  datePublished: '2026-10-26',
  dateModified: '2026-10-26',
  author: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  publisher: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://settlementcheck.co.uk/guides/maternity-redundancy-settlement-agreement/',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Protection from Redundancy (Pregnancy and Family Leave) Act 2023',
      url: 'https://www.legislation.gov.uk/ukpga/2023/17/contents',
    },
    {
      '@type': 'Legislation',
      name: 'Maternity and Parental Leave etc. Regulations 1999 (SI 1999/3312), Regulation 10',
      url: 'https://www.legislation.gov.uk/uksi/1999/3312/regulation/10/made',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 99',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/99',
    },
    {
      '@type': 'Legislation',
      name: 'Equality Act 2010, Section 18',
      url: 'https://www.legislation.gov.uk/ukpga/2010/15/section/18',
    },
    {
      '@type': 'Legislation',
      name: 'Equality Act 2010, Section 124',
      url: 'https://www.legislation.gov.uk/ukpga/2010/15/section/124',
    },
    {
      '@type': 'Legislation',
      name: 'Social Security Contributions and Benefits Act 1992, Section 164',
      url: 'https://www.legislation.gov.uk/ukpga/1992/4/section/164',
    },
    {
      '@type': 'Legislation',
      name: 'Statutory Maternity Pay (General) Regulations 1986 (SI 1986/1960), Regulation 21',
      url: 'https://www.legislation.gov.uk/uksi/1986/1960/regulation/21/made',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 111A',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/111A',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Sections 401 to 403 & Section 406',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/part/6/chapter/3',
    },
    {
      '@type': 'Legislation',
      name: 'The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310)',
      url: 'https://www.legislation.gov.uk/uksi/2026/310/contents/made',
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

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-coral flex-shrink-0 mt-0.5">
      <path d="M10 3L2 17H18L10 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="10" cy="14.5" r="1" fill="currentColor" />
    </svg>
  )
}

export default function MaternityRedundancySettlementGuide() {
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
              <span className="text-xs text-ink truncate">Maternity Redundancy Settlements</span>
            </div>
            <p className="sc-eyebrow mb-4" style={{ letterSpacing: '0.10em' }}>
              Equality Act 2010 &amp; Family Leave Protection
            </p>
            <h1 className="sc-h1 mb-5">
              Maternity Redundancy Settlement Agreement UK (2026): Rights, Rules &amp; Payouts
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted mb-6 border-b border-rule pb-4">
              <span>Written by SettlementCheck Editorial Team</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Updated for 2026/27 (SI 2026/310 &amp; Ninth Addendum)</span>
              <span className="w-1.5 h-1.5 rounded-full bg-muted/40"></span>
              <span>Last reviewed: October 2026</span>
            </div>
            <p className="sc-lead">
              Facing redundancy during pregnancy or maternity leave is one of the most stressful experiences in professional life. UK employment law provides powerful protections that make maternity dismissals exceptionally risky for employers. If your employer proposes an agreed exit, you hold substantial statutory advantages to secure a fair settlement package.
            </p>
          </div>
        </section>

        {/* Answer-First Section & Quick Metrics */}
        <section className="py-10 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            {/* 40-60 word Answer-First callout box for Google Featured Snippets and AI Overviews */}
            <div className="rounded-xl border border-rule bg-paper p-5 sm:p-6 mb-6">
              <p className="text-xs font-mono uppercase tracking-wider font-semibold text-coral mb-2">
                Statutory Summary: Maternity Redundancy Rights 2026
              </p>
              <p className="sc-body text-ink font-medium leading-relaxed">
                In the UK, making an employee redundant during pregnancy or maternity leave is subject to strict statutory protections. Under the Protection from Redundancy Act 2023 and Regulation 10, employers must offer any suitable alternative vacancy without competition. Failure to do so makes dismissal automatically unfair. Settlement payouts must pay remaining Statutory Maternity Pay on top of uncapped compensation.
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Compensatory Cap</span>
                <span className="text-lg font-bold text-coral font-mono">Uncapped</span>
                <span className="text-[11px] text-muted block mt-1">Equality Act s.124</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Protected Window</span>
                <span className="text-lg font-bold text-coral font-mono">18 Months</span>
                <span className="text-[11px] text-muted block mt-1">2023 Act &amp; 2024 Regs</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">Vento Bands</span>
                <span className="text-lg font-bold text-coral font-mono">£1.3k - £62.9k+</span>
                <span className="text-[11px] text-muted block mt-1">Ninth Addendum 2026</span>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper">
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-1">SMP Protection</span>
                <span className="text-lg font-bold text-coral font-mono">Non-Waivable</span>
                <span className="text-[11px] text-muted block mt-1">SSCBA 1992 s.164</span>
              </div>
            </div>

            <ReviewCallout
              title="Offered a settlement agreement while on maternity leave?"
              description="Do not sign before checking your statutory protections. Verify your ring-fenced Statutory Maternity Pay, £751 weekly redundancy baseline, and legal fee coverage."
              ctaText="Check draft agreement terms →"
              badge="Maternity Clause Checker"
            />
          </div>
        </section>

        {/* Section 1: The 18-month redundancy protection window and Regulation 10 */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The 18-month redundancy protection window and Regulation 10</h2>
            <p className="sc-body mb-4">
              The Protection from Redundancy (Pregnancy and Family Leave) Act 2023 expanded maternity rights across the UK. Supported by the 2024 Amendment Regulations, the law establishes an extended 18-month protected window.
            </p>
            <p className="sc-body mb-4">
              Your protection begins the day you notify your employer in writing of your pregnancy. For statutory maternity leave, protection lasts 18 months from the expected childbirth week. It also applies for 18 months from the actual birth date.
            </p>
            <p className="sc-body mb-6">
              This statutory timeline covers your entire 52-week maternity leave period. It also extends for roughly 6 months after you return to work.
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6">
              <h3 className="text-base font-semibold text-ink mb-2">Regulation 10 Priority: Absolute Right to Alternative Vacancies</h3>
              <p className="sc-body text-sm mb-3">
                Under Regulation 10 of the Maternity and Parental Leave etc. Regulations 1999 (MPLR 1999), your employer has a strict duty. If your existing role is at risk of redundancy, your employer must offer you any suitable alternative vacancy.
              </p>
              <p className="sc-body text-sm mb-3">
                Your employer cannot require you to attend competitive interviews or complete selection assessments. You have first refusal over all other affected employees.
              </p>
              <p className="sc-body text-sm text-muted">
                Failing to offer an existing suitable vacancy makes your dismissal automatically unfair. This protection is enforced under Section 99 of the Employment Rights Act 1996.
              </p>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-paper border border-rule">
              <InfoIcon />
              <p className="sc-body text-sm">
                If you suffer a pregnancy loss before 24 weeks, your statutory redundancy protection continues for two weeks after the end of the pregnancy. For pregnancy loss after 24 weeks, you remain entitled to full maternity leave, SMP, and 18 months of redundancy protection.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Why pregnancy dismissals are automatically unfair */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Why pregnancy and maternity dismissals are automatically unfair</h2>
            <p className="sc-body mb-4">
              UK employment law treats pregnancy and maternity dismissals with absolute seriousness. Under Section 99 of the Employment Rights Act 1996, selecting an employee for redundancy because of pregnancy, childbirth, or maternity leave is automatically unfair.
            </p>
            <p className="sc-body mb-4">
              In addition, Section 18 of the Equality Act 2010 makes it unlawful to treat an employee unfavourably because of pregnancy or maternity. You do not need two years of continuous service to bring this claim. It is a Day-One statutory right.
            </p>
            <p className="sc-body mb-6">
              Unlike ordinary unfair dismissal, compensation for unlawful discrimination under Section 124 of the Equality Act 2010 is completely uncapped. The standard statutory compensatory award cap of £123,543 does not apply.
            </p>

            {/* Comparison Table */}
            <div className="rounded-xl border border-rule overflow-hidden mb-8">
              <table className="w-full text-sm">
                <caption className="sr-only">Comparison of standard redundancy versus maternity redundancy protections for 2026.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Statutory Feature</th>
                    <th className="text-left px-4 py-3 font-medium">Standard Redundancy</th>
                    <th className="text-left px-4 py-3 font-medium">Maternity Redundancy</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Tribunal Compensatory Cap', 'Capped at £123,543 or 52 weeks pay', 'Completely uncapped (Equality Act s.124)'],
                    ['Qualifying Service Required', '2 continuous years of service', '0 days (Day-one statutory protection)'],
                    ['Vacancy Priority', 'Competitive selection permitted', 'Absolute priority without interview (Reg 10)'],
                    ['Injury to Feelings Award', 'Not available in unfair dismissal', 'Available under Vento bands (£1,300 to £62,900+)'],
                    ['Protected Conversation Secrecy', 'Covered by Section 111A ERA 1996', 'Excluded (Section 111A does not apply)'],
                    ['Statutory Pay Protection', 'Redundancy pay only', 'Redundancy pay plus ring-fenced SMP'],
                  ].map(([feature, standard, maternity], i) => (
                    <tr key={feature} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{feature}</td>
                      <td className="px-4 py-3 text-muted">{standard}</td>
                      <td className="px-4 py-3 text-ink font-semibold">{maternity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-base font-semibold text-ink mb-3">Vento Bands for Injury to Feelings in 2026</h3>
            <p className="sc-body mb-4">
              In any pregnancy discrimination claim, you can claim compensation for emotional distress alongside financial loss. Tribunals calculate this using Vento bands, updated by the Ninth Addendum to Presidential Guidance effective 6 April 2026:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-4 rounded-xl border border-rule bg-paper border-l-4 border-sage">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-ink">Lower Band</span>
                  <span className="text-xs font-mono font-bold text-coral-ink">£1,300 to £12,600</span>
                </div>
                <p className="sc-body text-xs text-muted">Isolated comments or minor administrative oversights during pregnancy.</p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper border-l-4 border-amber">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-ink">Middle Band</span>
                  <span className="text-xs font-mono font-bold text-coral-ink">£12,600 to £37,700</span>
                </div>
                <p className="sc-body text-xs text-muted">Maternity redundancy dismissal, sham restructuring, or failure to offer vacancies.</p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper border-l-4 border-coral">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-ink">Upper Band</span>
                  <span className="text-xs font-mono font-bold text-coral-ink">£37,700 to £62,900</span>
                </div>
                <p className="sc-body text-xs text-muted">Sustained campaigns of exclusion, severe distress, or retaliatory victimisation.</p>
              </div>
              <div className="p-4 rounded-xl border border-rule bg-paper border-l-4 border-crimson">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm font-semibold text-ink">Exceptional Cases</span>
                  <span className="text-xs font-mono font-bold text-coral-ink">Over £62,900</span>
                </div>
                <p className="sc-body text-xs text-muted">Catastrophic career destruction or severe documented psychiatric injury.</p>
              </div>
            </div>
            <p className="sc-body text-xs text-muted">
              Most maternity redundancy settlement negotiations benchmark the injury to feelings element against the Middle Band (£12,600 to £37,700).
            </p>
          </div>
        </section>

        {/* Section 3: The SMP Ring-Fencing Rule */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">The Statutory Maternity Pay (SMP) ring-fencing rule</h2>
            <p className="sc-body mb-4">
              Employers often attempt to roll remaining SMP into a generic settlement figure. This practice is unlawful.
            </p>
            <p className="sc-body mb-4">
              Under Section 164 SSCBA 1992 and Regulation 21 SMP Regs 1986, contracting out of SMP is void. Any clause attempting to waive your statutory maternity pay is legally invalid.
            </p>
            <p className="sc-body mb-6">
              If you qualified for SMP, every remaining week must be paid in full. Your employer must pay this sum on top of any redundancy compensation.
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6">
              <h3 className="text-base font-semibold text-ink mb-2">How SMP Qualification Operates on Termination</h3>
              <p className="sc-body text-sm mb-3">
                You qualify for SMP by working in the 15th week before your expected week of childbirth. You must also meet standard statutory earnings thresholds.
              </p>
              <p className="sc-body text-sm mb-3">
                Once qualified, your right to all 39 weeks of SMP is locked in. Even if your employment terminates through redundancy or a settlement agreement, your employer must pay the remaining balance.
              </p>
              <ul className="flex flex-col gap-2 text-sm text-ink font-medium mt-3">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
                  <span>First 6 weeks: 90% of your average weekly earnings before tax.</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-coral"></span>
                  <span>Remaining 33 weeks: The statutory rate (£187.18 per week in 2026/27) or 90% of your earnings if lower.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-paper border border-rule flex items-start gap-3">
              <AlertIcon />
              <div>
                <p className="text-sm font-semibold text-ink mb-1">Employers Reclaim SMP from HMRC</p>
                <p className="sc-body text-xs text-muted">
                  Your employer can reclaim 92% of your SMP from HMRC, or 103% if they qualify for Small Employers Relief. Because the government reimburses this cost, there is no justification for an employer to deduct or offset SMP against your redundancy compensation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: How maternity settlement payouts are calculated */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">How maternity settlement payouts are calculated in 2026</h2>
            <p className="sc-body mb-4">
              A comprehensive maternity redundancy settlement agreement is made up of four distinct financial components. Understanding each part ensures you do not accept an offer below the typical range.
            </p>
            <p className="sc-body mb-6">
              Your instructed solicitor will ensure every element is calculated separately in the written agreement:
            </p>

            <div className="flex flex-col gap-4 mb-8">
              <div className="p-5 rounded-xl border border-rule bg-paper">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-semibold text-ink">1. Statutory Redundancy Pay Baseline</h3>
                  <span className="text-xs font-mono font-bold text-coral-ink">Capped at £751/week</span>
                </div>
                <p className="sc-body text-sm mb-2">
                  Calculated based on your age, length of service, and weekly pay up to the 2026 statutory cap of £751 per week (SI 2026/310). This amount forms the non-negotiable statutory floor.
                </p>
                <p className="sc-body text-xs text-muted">
                  Under Section 403 of ITEPA 2003, statutory redundancy pay is 100% tax-free.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rule bg-paper">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-semibold text-ink">2. Ring-Fenced Statutory Maternity Pay</h3>
                  <span className="text-xs font-mono font-bold text-coral-ink">All Remaining Weeks</span>
                </div>
                <p className="sc-body text-sm mb-2">
                  All remaining weeks of your 39-week SMP entitlement. This cannot be absorbed into severance pay. It must be paid as a distinct line item subject to PAYE and National Insurance.
                </p>
                <p className="sc-body text-xs text-muted">
                  Your employer must continue paying this via monthly payroll or as an upfront lump sum.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rule bg-paper">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-semibold text-ink">3. Notice Pay (PILON / PENP)</h3>
                  <span className="text-xs font-mono font-bold text-coral-ink">Contractual Notice</span>
                </div>
                <p className="sc-body text-sm mb-2">
                  Payment in Lieu of Notice (PILON) based on your full normal contractual salary, not reduced maternity pay. Under Section 402D of ITEPA 2003, notice pay is taxable under PAYE as Post-Employment Notice Pay.
                </p>
                <p className="sc-body text-xs text-muted">
                  You should also receive accrued, untaken annual leave paid in full.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-rule bg-paper">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="text-base font-semibold text-ink">4. Ex-Gratia Compensation &amp; Discrimination Premium</h3>
                  <span className="text-xs font-mono font-bold text-coral-ink">Negotiated Sum</span>
                </div>
                <p className="sc-body text-sm mb-2">
                  This represents the true incentive for signing the agreement. It compensates you for loss of office and waiving your uncapped discrimination and automatically unfair dismissal claims.
                </p>
                <p className="sc-body text-xs text-muted">
                  Often negotiated between 3 and 9 months of gross salary, plus an injury to feelings sum assessed under the Vento bands.
                </p>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-ink text-white">
              <h3 className="text-base font-semibold mb-2">Benchmark your settlement value</h3>
              <p className="sc-lead text-sm mb-4" style={{ color: 'rgba(247,244,238,0.85)' }}>
                Use our independent calculator to benchmark your statutory redundancy, remaining SMP, notice entitlement, and ex-gratia compensation range.
              </p>
              <Link href="/calculator/?maternity=yes" className="btn-accent inline-block text-xs py-2.5 px-4">
                Calculate my settlement estimate →
              </Link>
            </div>
          </div>
        </section>

        {/* Section 5: Worked case study */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Worked case study: Senior Product Manager on maternity leave</h2>
            <p className="sc-body mb-4">
              To understand how statutory protections translate into financial figures, consider this realistic 2026 example of an employee facing redundancy while on maternity leave.
            </p>
            <p className="sc-body mb-6">
              Sarah is a 34-year-old Senior Product Manager at a London technology firm. She has 4 continuous years of service and earns £52,000 per year (£1,000 gross per week).
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink uppercase tracking-wider mb-2">The Dispute Scenario</h3>
              <p className="sc-body text-sm mb-2">
                Four months into her 52-week maternity leave (week 17 of maternity leave), Sarah is informed of a departmental restructuring. Her employer claims her role is redundant.
              </p>
              <p className="sc-body text-sm mb-2">
                An open Product Owner vacancy exists in another division. Under Regulation 10, Sarah is entitled to be offered that role automatically without interview. Her employer ignores Regulation 10 and invites her to an off-the-record discussion.
              </p>
              <p className="sc-body text-sm">
                Her employer offers statutory redundancy pay plus 1 month notice, attempting to extinguish her remaining 22 weeks of Statutory Maternity Pay.
              </p>
            </div>

            {/* Case Study Comparison Table */}
            <div className="rounded-xl border border-rule overflow-hidden mb-6">
              <table className="w-full text-sm">
                <caption className="sr-only">Initial offer versus negotiated settlement package for Sarah.</caption>
                <thead>
                  <tr className="bg-ink text-white">
                    <th className="text-left px-4 py-3 font-medium">Payment Element</th>
                    <th className="text-left px-4 py-3 font-medium">Initial Employer Offer</th>
                    <th className="text-left px-4 py-3 font-medium">Negotiated Settlement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Statutory Redundancy Pay', '£3,004 (4 yrs × £751 cap)', '£3,004 (Tax-free under s.403)'],
                    ['Remaining SMP (22 weeks)', '£0 (Attempted waiver)', '£4,117.96 (Ring-fenced &amp; paid in full)'],
                    ['Contractual Notice Pay (PILON)', '£4,333 (1 month only)', '£13,000 (Full 3 months contractual notice)'],
                    ['Ex-Gratia Loss of Office', '£2,000 token offer', '£26,996 (Tax-free under s.403 cap)'],
                    ['Pre-Termination Injury to Feelings', '£0', '£15,000 (100% tax-free under s.406)'],
                    ['Legal Fee Contribution', '£0', '£1,000 + VAT (Paid by employer to solicitor)'],
                    ['Total Financial Package', '£9,337 gross', '£62,117.96 total settlement'],
                  ].map(([element, initial, negotiated], i) => (
                    <tr key={element} className={i % 2 === 0 ? 'bg-paper' : 'bg-white'}>
                      <td className="px-4 py-3 text-ink font-medium">{element}</td>
                      <td className="px-4 py-3 text-muted">{initial}</td>
                      <td className="px-4 py-3 text-ink font-semibold">{negotiated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-5 rounded-xl border border-rule bg-paper">
              <h3 className="text-sm font-semibold text-ink mb-2">Key Outcome &amp; Takeaways</h3>
              <p className="sc-body text-sm mb-3">
                By instructing an independent SRA-regulated solicitor, Sarah challenged her employer on the Regulation 10 breach, uncapped discrimination exposure, and invalid SMP waiver.
              </p>
              <p className="sc-body text-sm mb-3">
                Her final settlement increased from £9,337 to £62,117.96. Furthermore, £45,000 of the final settlement was structured completely tax-free (£30,000 under s.403 and £15,000 under s.406).
              </p>
              <p className="sc-body text-sm text-muted">
                Her employer paid the £1,000 legal fee contribution directly to her solicitor under Section 203(3). Sarah paid nothing out of pocket for her legal representation.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Tax treatment breakdown */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Tax treatment breakdown: Tax-free £30,000 vs taxable SMP</h2>
            <p className="sc-body mb-4">
              Structuring your settlement agreement correctly can save thousands of pounds in income tax. Under UK tax law, different elements of your package receive completely different tax treatments.
            </p>
            <p className="sc-body mb-6">
              HMRC applies strict rules under the Income Tax (Earnings and Pensions) Act 2003 (ITEPA 2003). Your agreement must separate each payment clearly:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-rule bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sage-tint text-sage">Tax-Free</span>
                  <h3 className="text-sm font-semibold text-ink">£30,000 Exemption (s.403)</h3>
                </div>
                <p className="sc-body text-sm mb-2">
                  Under Section 403 of ITEPA 2003, genuine compensation for loss of employment and statutory redundancy pay are tax-free up to £30,000.
                </p>
                <p className="sc-body text-xs text-muted">
                  Any ex-gratia compensation exceeding £30,000 is subject to income tax at your marginal rate.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-sage-tint text-sage">100% Tax-Free</span>
                  <h3 className="text-sm font-semibold text-ink">Injury to Feelings (s.406)</h3>
                </div>
                <p className="sc-body text-sm mb-2">
                  Under Section 406 of ITEPA 2003, compensation for injury to feelings related to discrimination occurring before termination is completely tax-free.
                </p>
                <p className="sc-body text-xs text-muted">
                  This sum sits outside the standard £30,000 limit with no ceiling on its tax exemption.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-tint text-amber">Taxable as Earnings</span>
                  <h3 className="text-sm font-semibold text-ink">Notice Pay (PENP s.402D)</h3>
                </div>
                <p className="sc-body text-sm mb-2">
                  Payment in Lieu of Notice is classified as Post-Employment Notice Pay. It must be taxed via PAYE with normal income tax and National Insurance deductions.
                </p>
                <p className="sc-body text-xs text-muted">
                  Notice pay cannot be disguised as tax-free compensation.
                </p>
              </div>

              <div className="rounded-xl border border-rule bg-white p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-tint text-amber">Taxable as Statutory Pay</span>
                  <h3 className="text-sm font-semibold text-ink">Statutory Maternity Pay</h3>
                </div>
                <p className="sc-body text-sm mb-2">
                  SMP is statutory remuneration, not compensation for loss of office. It is subject to income tax and National Insurance deductions as normal.
                </p>
                <p className="sc-body text-xs text-muted">
                  It must be paid through payroll alongside standard RTI reporting to HMRC.
                </p>
              </div>
            </div>

            <p className="sc-body text-sm">
              For an in-depth breakdown of tax calculations, explore our guide on the <Link href="/guides/tax-free-settlement-30000/" className="underline hover:text-ink">tax-free £30,000 settlement exemption</Link> and our review of <Link href="/guides/pilon-tax-treatment-2026/" className="underline hover:text-ink">PILON tax rules</Link>.
            </p>
          </div>
        </section>

        {/* Section 7: Negotiation strategy and Section 111A */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Negotiation strategy and Section 111A loss of confidentiality</h2>
            <p className="sc-body mb-4">
              Employers often attempt to shield settlement proposals by labelling letters as &quot;Section 111A protected conversations&quot; or &quot;without prejudice&quot;.
            </p>
            <p className="sc-body mb-4">
              Under UK law, this protection does not apply to maternity disputes. Section 111A(4) of the Employment Rights Act 1996 expressly states that protected conversation rules apply solely to ordinary unfair dismissal claims.
            </p>
            <p className="sc-body mb-6">
              Section 111A does not protect discussions involving pregnancy discrimination or automatically unfair dismissal under Section 99. If your employer tries to push you out during maternity leave, those communications can be cited in open tribunal proceedings.
            </p>

            <div className="rounded-xl border border-rule bg-paper p-5 mb-8">
              <h3 className="text-sm font-semibold text-ink mb-3">5 Practical Negotiation Steps</h3>
              <ol className="list-decimal pl-5 flex flex-col gap-2.5 text-sm sc-body">
                <li>
                  <strong>Request all terms in writing:</strong> Ask for any verbal proposal to be provided in a formal draft settlement agreement.
                </li>
                <li>
                  <strong>Take the 10-day consideration window:</strong> ACAS Code of Practice 4 gives you a minimum of 10 calendar days to consider a settlement proposal. Never feel rushed.
                </li>
                <li>
                  <strong>Audit internal vacancies:</strong> Check your employer&apos;s careers portal and LinkedIn listings for open roles to evidence Regulation 10 breaches.
                </li>
                <li>
                  <strong>Demand ring-fenced SMP:</strong> Ensure remaining SMP is explicitly added on top of your redundancy and severance compensation.
                </li>
                <li>
                  <strong>Secure an agreed reference:</strong> Agree on positive written reference wording and mutual non-derogatory clauses to protect your future career.
                </li>
              </ol>
            </div>

            <p className="sc-body">
              For a detailed guide on managing employer conversations, read our overview of <Link href="/guides/protected-conversations-without-prejudice/" className="underline hover:text-ink">protected conversations and without prejudice rules</Link>.
            </p>
          </div>
        </section>

        {/* Section 8: Independent legal advice and fee coverage */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Independent legal advice: Your employer covers the fees</h2>
            <p className="sc-body mb-4">
              Under Section 203(3) ERA 1996, waiving statutory rights requires independent legal advice. You must receive advice from an independent, insured solicitor.
            </p>
            <p className="sc-body mb-4">
              Your employer covers the legal fees. Employers typically contribute between £500 and £1,500 plus VAT towards your legal advice.
            </p>
            <p className="sc-body mb-6">
              Your solicitor invoices your employer directly. They can request higher fee contributions if negotiations are required to resolve Regulation 10 breaches or SMP disputes.
            </p>

            <div className="rounded-xl border border-rule bg-white p-5 mb-6">
              <h3 className="text-sm font-semibold text-ink mb-2">What Your Solicitor Protects</h3>
              <ul className="flex flex-col gap-2.5">
                {[
                  'Verifies that remaining Statutory Maternity Pay is paid in full on top of the settlement sum.',
                  'Checks that your redundancy calculation accurately reflects the £751 weekly statutory cap for 2026.',
                  'Ensures ex-gratia compensation and pre-termination injury to feelings are properly structured for tax relief.',
                  'Inserts comprehensive agreed reference clauses and mutual non-derogation commitments.',
                  'Protects you against aggressive warranties, clawback clauses, or unworkable restrictive covenants.',
                ].map((protection) => (
                  <li key={protection} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="sc-body text-sm">{protection}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="sc-body text-sm">
              Learn more about selecting the right legal representative in our guide to <Link href="/guides/employer-recommended-solicitor/" className="underline hover:text-ink">employer-recommended solicitors versus independent advisers</Link>.
            </p>
          </div>
        </section>

        {/* Section: Official independent resources */}
        <section className="py-12 border-b border-rule bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-4">Official independent resources</h2>
            <p className="sc-body mb-6">
              If you are facing redundancy during pregnancy or maternity leave, you can access free guidance from official UK statutory organisations and charities:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  name: 'ACAS (Advisory, Conciliation and Arbitration Service)',
                  desc: 'Free, impartial guidance on maternity rights, redundancy consultations, and early conciliation.',
                  url: 'https://www.acas.org.uk',
                },
                {
                  name: 'Maternity Action',
                  desc: 'The UK\'s leading charity dedicated to promoting and protecting the rights of pregnant women and new parents.',
                  url: 'https://maternityaction.org.uk',
                },
                {
                  name: 'Equality Advisory and Support Service (EASS)',
                  desc: 'Official government helpline advising individuals on discrimination under the Equality Act 2010.',
                  url: 'https://www.equalityadvisoryservice.com',
                },
                {
                  name: 'Legislation.gov.uk',
                  desc: 'Access original UK statutes including the Protection from Redundancy Act 2023 and SI 2026/310.',
                  url: 'https://www.legislation.gov.uk',
                },
              ].map(({ name, desc, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-rule bg-paper p-5 hover:border-ink transition-colors flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-1">{name}</h3>
                    <p className="sc-body text-xs text-muted mb-3">{desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-coral-ink">Visit official site &rarr;</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Section: CTA Banner */}
        <section className="py-12 border-b border-rule bg-ink">
          <div className="max-w-2xl mx-auto px-5 text-center">
            <h2 className="sc-section-h2 text-white mb-4">Check your maternity settlement offer today</h2>
            <p className="sc-lead mb-6" style={{ color: 'rgba(247,244,238,0.78)' }}>
              Calculate your statutory redundancy baseline, check your ring-fenced SMP, and connect with an SRA-regulated solicitor. Your employer covers the legal fees.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/calculator/?maternity=yes" className="btn-accent w-full sm:w-auto">
                Check my settlement offer →
              </Link>
              <Link href="/redundancy-calculator/" className="btn-secondary w-full sm:w-auto text-white border-white/20 hover:border-white">
                Calculate redundancy pay →
              </Link>
            </div>
          </div>
        </section>

        {/* Section: FAQs */}
        <section className="py-12 border-b border-rule">
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="sc-section-h2 mb-8">Frequently asked questions</h2>
            <FaqAccordion faqs={FAQS} />
            <DynamicFaqSection pathname="/guides/maternity-redundancy-settlement-agreement/" />
          </div>
        </section>

        {/* Section: Related Articles */}
        <section className="py-12 border-b border-rule bg-paper">
          <div className="max-w-2xl mx-auto px-5">
            <RelatedArticles
              title="Related Guides &amp; Calculators"
              items={[
                {
                  href: '/redundancy-calculator/',
                  title: 'Redundancy Pay Calculator UK 2026',
                  description: 'Calculate your statutory redundancy entitlement under the £751 weekly cap.',
                  tag: 'Calculator',
                },
                {
                  href: '/guides/discrimination-settlement-agreements/',
                  title: 'Discrimination Settlement Agreements UK 2026',
                  description: 'Learn how uncapped compensation, injury to feelings, and the 2026 Vento bands work.',
                  tag: 'Guide',
                },
                {
                  href: '/guides/tax-free-settlement-30000/',
                  title: 'Tax-Free Settlement Agreements: The £30,000 Rule',
                  description: 'Understand how Section 403 and Section 406 tax exemptions protect your severance.',
                  tag: 'Tax Guide',
                },
                {
                  href: '/guides/settlement-agreement-how-much/',
                  title: 'Settlement Agreement Payouts: How Much Should You Get?',
                  description: 'Explore commercial negotiation benchmarks, notice pay rules, and severance ranges.',
                  tag: 'Payout Guide',
                },
              ]}
            />
          </div>
        </section>

        {/* References and Legislation */}
        <section className="py-12 bg-white">
          <div className="max-w-2xl mx-auto px-5">
            <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">References and Legislation</h3>
            <ol className="list-decimal pl-4 text-xs text-muted flex flex-col gap-2">
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2023/17/contents" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Protection from Redundancy (Pregnancy and Family Leave) Act 2023
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2024/265/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Maternity Leave, Adoption Leave and Shared Parental Leave (Amendment) Regulations 2024 (SI 2024/265)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/1999/3312/regulation/10/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Maternity and Parental Leave etc. Regulations 1999 (SI 1999/3312), Regulation 10 (Redundancy during maternity leave)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/99" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 99 (Dismissal to which section applies - leave for family reasons)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2010/15/section/18" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Equality Act 2010, Section 18 (Pregnancy and maternity discrimination: work cases) &amp; Section 124 (Remedies)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1992/4/section/164" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Social Security Contributions and Benefits Act 1992, Section 164 (Statutory maternity pay - entitlement and liability to pay)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/1986/1960/regulation/21/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Statutory Maternity Pay (General) Regulations 1986 (SI 1986/1960), Regulation 21 (Contracting out and void agreements)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/111A" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 111A (Confidentiality of pre-termination negotiations and exceptions)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/1996/18/section/203" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Employment Rights Act 1996, Section 203 (Restrictions on contracting out &amp; valid settlement conditions)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/ukpga/2003/1/part/6/chapter/3" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  Income Tax (Earnings and Pensions) Act 2003, Sections 401-403 (Payments connected with termination) &amp; Section 406 (Exception for injury)
                </a>
              </li>
              <li>
                <a href="https://www.legislation.gov.uk/uksi/2026/310/contents/made" target="_blank" rel="noopener noreferrer" className="hover:text-ink underline">
                  The Employment Rights (Increase of Limits) Order 2026 (SI 2026/310) (£751 statutory weekly cap)
                </a>
              </li>
            </ol>
          </div>
        </section>

        {/* SRA Regulatory Boundary & Disclaimer */}
        <p className="text-xs text-muted-2 border-t border-rule pt-6 leading-relaxed max-w-2xl mx-auto px-5 mb-8">
          Disclaimer: SettlementCheck is an independent information service and calculator platform, not a law firm. The content on this page is for general information only and does not constitute formal legal advice. Independent legal advice on settlement agreements is reserved for instructed SRA-regulated solicitors. Use our free calculator to evaluate your settlement offer.
        </p>
      </main>
      <Footer />
    </>
  )
}
