import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow, StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Constructive Dismissal Calculator 2026 | Forced to Resign? | SettlementCheck',
  description:
    'Forced to resign by your employer\'s conduct? Estimate your constructive dismissal settlement using April 2026 UK rates. Compensatory cap £123,543. Free, no email. Independent, not a law firm.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/constructive-dismissal-calculator/',
  },
  openGraph: {
    title: 'Constructive Dismissal Calculator 2026 | Forced to Resign? | SettlementCheck',
    description:
      'Forced to resign by your employer\'s conduct? Estimate your constructive dismissal settlement using April 2026 UK rates. Compensatory cap £123,543. Free, no email.',
    url: 'https://settlementcheck.co.uk/constructive-dismissal-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constructive Dismissal Calculator 2026 | SettlementCheck',
    description:
      'Forced to resign? Estimate your constructive dismissal settlement using 2026 UK rates. Free, no email.',
  },
}

const STATUTORY_ROWS: StatutoryRow[] = [
  { label: 'Weekly pay cap (GB) — basic award', y2425: '£719', y2526: '£751' },
  { label: 'Maximum basic award (GB)', y2425: '£21,570', y2526: '£22,530' },
  { label: 'Compensatory award cap (GB)', y2425: '£118,223', y2526: '£123,543' },
  { label: 'Tax-free threshold (termination payments)', y2425: '£30,000', y2526: '£30,000' },
  { label: 'Qualifying service for constructive dismissal', y2425: '2 years', y2526: '2 years' },
]

const CONSTRUCTIVE_DISMISSAL_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Understand whether you have a claim',
    d: 'Constructive dismissal requires a fundamental breach of contract by your employer and a resignation in direct response to it. The calculator cannot assess the strength of your breach, but a solicitor can — and you should get that advice before you resign, not after.',
  },
  {
    n: '02',
    t: 'See your basic and compensatory award range',
    d: 'Enter your age, salary, and length of service. The calculator shows your basic award (using the £751 weekly cap and age multipliers) and where your total package sits against the compensatory cap of £123,543 or 52 weeks\' pay, whichever is lower.',
  },
  {
    n: '03',
    t: 'Know your net figure before you negotiate',
    d: 'The first £30,000 of a constructive dismissal settlement is tax-free. PILON is taxed separately as earnings. The calculator gives you an estimated net take-home figure — the number that actually matters when you are deciding whether to accept an offer.',
  },
]

const CONSTRUCTIVE_DISMISSAL_FAQS: FaqItem[] = [
  {
    q: 'What is constructive dismissal?',
    a: 'Constructive dismissal occurs when your employer\'s conduct is so serious that you are left with no reasonable alternative but to resign. Under ERA 1996 s.95(1)(c), you must show a fundamental breach of your employment contract and that you resigned in direct response to it, without delay that could be taken as accepting the breach. Common examples include: a significant and unilateral cut to your pay or hours, demotion or removal of responsibilities without consent, sustained bullying or harassment, and a breakdown in the trust and confidence that underpins every employment relationship.',
  },
  {
    q: 'Do I need two years of service to claim constructive dismissal?',
    a: 'For a standard constructive dismissal claim under ERA 1996 s.95(1)(c), yes — you need at least two years of continuous employment. However, if the conduct that forced you to resign was connected to a protected characteristic (such as your sex, race, disability, or age), a protected disclosure (whistleblowing under ERA 1996 s.103A), pregnancy or maternity leave, or trade union membership, you may have additional claims that carry no qualifying period. In those cases, your potential award can be significantly higher.',
  },
  {
    q: 'How much can I claim for constructive dismissal in 2026?',
    a: 'A constructive dismissal claim is treated as unfair dismissal and uses the same award structure. The basic award is calculated using the £751 weekly pay cap (from April 2026), up to 20 qualifying years of service, and an age multiplier (0.5 under 22, 1.0 aged 22-40, 1.5 aged 41 and over). The compensatory award covers your actual financial loss and is capped at £123,543 or 52 weeks\' gross pay, whichever is lower, under ERA 1996 s.124. If your employer failed to follow the ACAS Code of Practice on disciplinary and grievance procedures, a tribunal can increase the award by up to 25%.',
  },
  {
    q: 'Should I resign before getting legal advice?',
    a: 'No. This is the most important practical point about constructive dismissal: once you resign, your options narrow considerably. Before you resign, a solicitor can assess whether the breach is truly fundamental, advise on timing, and often open without prejudice negotiations with your employer that result in a negotiated settlement agreement — allowing you to leave on agreed terms with a financial package, without the uncertainty of a tribunal claim. If you resign first without advice, you still have a potential claim, but you lose the leverage that comes from still being employed.',
  },
  {
    q: 'What does "affirming the contract" mean and why does it matter?',
    a: 'Affirmation means that by continuing to work after a fundamental breach, you are treated as having accepted the breach and carried on under the contract. If you continue working for a significant period after the event that you say forced your resignation, a tribunal may find that you affirmed the contract and therefore cannot bring a constructive dismissal claim. There is no fixed period — it depends on the facts — but acting promptly and raising a grievance can help preserve your position.',
  },
  {
    q: 'Is a constructive dismissal settlement payment taxable?',
    a: 'The first £30,000 of a termination payment — including the basic award and compensatory element of a constructive dismissal settlement — is tax-free under ITEPA 2003 s.403. Amounts above £30,000 are taxable at your marginal rate. Payment in lieu of notice (PILON) is always taxed as earnings under ITEPA 2003 s.402D, regardless of what your agreement calls it. Your solicitor should ensure the settlement agreement correctly allocates each element of your payment.',
  },
  {
    q: 'Do I need a solicitor to sign a constructive dismissal settlement agreement?',
    a: 'Yes. Under ERA 1996 s.203, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured, SRA-regulated solicitor who is named in the agreement. You cannot validly waive your right to bring a constructive dismissal or unfair dismissal claim without that advice. Your employer is required to contribute to your legal fees — typically £350 to £750 — which in most cases covers the full cost.',
  },
  {
    q: 'What is a without prejudice conversation and does it affect my claim?',
    a: 'A without prejudice conversation is a discussion held with a genuine view to settling an existing or anticipated dispute. Anything said in a genuine without prejudice discussion cannot ordinarily be used as evidence in tribunal proceedings. Under ERA 1996 s.111A, pre-termination negotiations — where an employer makes a settlement offer even before any dispute has arisen — are also inadmissible in ordinary unfair dismissal cases, provided there has been no "improper behaviour." If your employer has approached you to discuss leaving, that conversation likely has some form of legal protection, but it does not prevent you from seeking legal advice or negotiating.',
  },
]

const FAQ_SCHEMA_ITEMS = CONSTRUCTIVE_DISMISSAL_FAQS.map(({ q, a }) => ({ question: q, answer: a }))

const HOWTOCALCULATE_STEPS = [
  'Identify the fundamental breach of contract — the specific act or omission by your employer that made your position untenable.',
  'Confirm you resigned in direct response to the breach and did not affirm the contract by continuing to work without raising the issue.',
  'Verify you have at least two years of continuous employment, or identify whether an automatically unfair reason applies — ERA 1996 s.94.',
  'Calculate the basic award: capped weekly pay (£751), years of service (up to 20), and age multiplier (0.5/1.0/1.5) — ERA 1996 ss.162-163.',
  'Estimate the compensatory award: loss of earnings from resignation date, future loss, lost benefits, and pension loss.',
  'Apply the compensatory cap: the lower of £123,543 or 52 weeks\' gross pay — ERA 1996 s.124.',
  'Consider an ACAS uplift of up to 25% if your employer failed to follow the ACAS Code of Practice on disciplinary and grievance procedures.',
  'Apply the £30,000 tax-free threshold to eligible termination elements under ITEPA 2003 s.403. PILON is always taxed as earnings under ITEPA 2003 s.402D.',
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_SCHEMA_ITEMS.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    {
      '@type': 'HowTo',
      name: 'How to assess a constructive dismissal claim in 2026',
      description:
        'Step-by-step guide to evaluating a UK constructive dismissal claim and estimating settlement value using April 2026 statutory rates.',
      step: HOWTOCALCULATE_STEPS.map((text, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text,
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Constructive Dismissal Calculator',
          item: 'https://settlementcheck.co.uk/constructive-dismissal-calculator/',
        },
      ],
    },
  ],
}

export default function ConstructiveDismissalCalculatorPage() {
  return (
    <>
      <Script
        id="constructive-dismissal-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeClient
        title={
          <>
            Calculate your{' '}
            <em style={{ fontStyle: 'italic', color: '#D9603B' }}>constructive dismissal</em>{' '}
            settlement
          </>
        }
        leadBullets={[
          {
            label: 'Do not resign before you read this',
            detail: 'Once you resign, your options narrow. A solicitor can often negotiate a settlement while you are still employed — giving you far more leverage.',
          },
          {
            label: 'See your basic and compensatory award range',
            detail: 'The basic award uses the £751 weekly cap and age multipliers. The compensatory cap is £123,543 or 52 weeks\' pay, whichever is lower (ERA 1996 s.124).',
          },
          {
            label: 'Understand your net take-home figure',
            detail: 'The first £30,000 is tax-free. PILON is taxed separately. The calculator shows what you will actually receive after tax.',
          },
          {
            label: 'Know the strength of your position',
            detail: 'Constructive dismissal requires a fundamental breach of contract. If discrimination or whistleblowing is involved, your potential claim is significantly higher with no qualifying period.',
          },
        ]}
        steps={CONSTRUCTIVE_DISMISSAL_STEPS}
        faqItems={CONSTRUCTIVE_DISMISSAL_FAQS}
        ctaLabel="Estimate my constructive dismissal settlement →"
        ctaHref="/calculator"
        howItWorksTitle="Three steps. Understand your constructive dismissal position."
        howItWorksLead="From award range to net take-home. Free, no email required — and no law firm behind this result."
        taxSectionTitle="How much tax will you pay on a constructive dismissal settlement?"
        statutoryRows={STATUTORY_ROWS}
        pageLinks={[
          {
            href: '/guides/what-is-a-fair-settlement-agreement',
            label: 'What is a fair settlement agreement?',
          },
          {
            href: '/guides/how-to-negotiate-a-settlement-agreement',
            label: 'How to negotiate your settlement',
          },
          {
            href: '/guides/pressured-to-sign',
            label: 'Being pressured to sign? Know your rights',
          },
          {
            href: '/unfair-dismissal-calculator',
            label: 'Unfair dismissal calculator',
          },
        ]}
      />
    </>
  )
}
