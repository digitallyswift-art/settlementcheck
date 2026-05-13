import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow } from '../HomeClient'

export const metadata: Metadata = {
  title: 'Constructive Dismissal Calculator 2026 | Check Your Claim | SettlementCheck',
  description:
    'Forced to resign? Estimate your constructive dismissal settlement using 2026 UK rates. Compensatory cap £123,543. Free, no email. Independent, not a law firm.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/constructive-dismissal-calculator/',
  },
  openGraph: {
    title: 'Constructive Dismissal Calculator 2026 | Check Your Claim | SettlementCheck',
    description:
      'Forced to resign? Estimate your constructive dismissal settlement using 2026 UK rates. Compensatory cap £123,543. Free, no email. Independent, not a law firm.',
    url: 'https://settlementcheck.co.uk/constructive-dismissal-calculator/',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constructive Dismissal Calculator 2026 | Check Your Claim | SettlementCheck',
    description:
      'Forced to resign? Estimate your constructive dismissal settlement using 2026 rates. Free, no email.',
  },
}

const STATUTORY_ROWS: StatutoryRow[] = [
  { label: 'Weekly pay cap (GB) — basic award', y2425: '£719', y2526: '£751' },
  { label: 'Maximum basic award (GB)', y2425: '£21,570', y2526: '£22,530' },
  { label: 'Compensatory award cap (GB)', y2425: '£118,223', y2526: '£123,543' },
  { label: 'Tax-free threshold (termination payments)', y2425: '£30,000', y2526: '£30,000' },
  { label: 'Qualifying service for constructive dismissal', y2425: '2 years', y2526: '2 years' },
]

const FAQ_SCHEMA_ITEMS = [
  {
    question: 'What is constructive dismissal?',
    answer:
      'Constructive dismissal occurs when your employer\'s conduct is so serious that you are left with no reasonable option but to resign. To claim under ERA 1996 s.95(1)(c), you must show a fundamental breach of your employment contract — such as bullying, demotion without consent, or a significant reduction in pay — and that you resigned in direct response to it.',
  },
  {
    question: 'How much can I claim for constructive dismissal in 2026?',
    answer:
      'A constructive dismissal claim is treated as unfair dismissal and carries the same award structure. The basic award uses the £751 weekly pay cap (from April 2026) over up to 20 qualifying years. The compensatory award is capped at £123,543 or 52 weeks\' gross pay, whichever is lower, under ERA 1996 s.124.',
  },
  {
    question: 'Do I need to resign immediately to claim constructive dismissal?',
    answer:
      'Not necessarily, but delay can be used against you. If you continue to work for a significant period after the breach, a tribunal may find you have "affirmed" the contract and waived your right to claim. Taking legal advice before you resign is strongly recommended.',
  },
  {
    question: 'Is a constructive dismissal settlement tax-free?',
    answer:
      'The compensatory element of a constructive dismissal settlement is tax-free up to £30,000 under ITEPA 2003 s.403. Payment in lieu of notice is always fully taxable as earnings under ITEPA 2003 s.402D. Your solicitor should ensure the agreement correctly allocates each payment type.',
  },
  {
    question: 'Should I resign before getting legal advice?',
    answer:
      'No. You should seek independent legal advice before resigning if you are considering a constructive dismissal claim. Once you resign, your options narrow. A solicitor can assess whether the breach is fundamental, advise on timing, and often negotiate a settlement agreement before you leave — preserving your financial position.',
  },
]

const HOWTOCALCULATE_STEPS = [
  'Identify the fundamental breach of contract — the specific act or omission by your employer.',
  'Confirm you resigned in direct response to the breach, without affirming the contract.',
  'Verify you have at least two years of continuous employment — ERA 1996 s.94.',
  'Calculate the basic award using capped weekly pay (£751), years of service (up to 20), and age multiplier.',
  'Estimate the compensatory award: loss of earnings, loss of benefits, and future loss.',
  'Apply the compensatory cap: the lower of £123,543 or 52 weeks\' gross pay — ERA 1996 s.124.',
  'Consider an ACAS uplift of up to 25% if your employer failed to follow the ACAS Code.',
  'Apply the £30,000 tax-free threshold to eligible termination payments under ITEPA 2003 s.403.',
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
        lead="Constructive dismissal occurs when your employer's conduct forces you to resign, a fundamental breach of contract under ERA 1996 s.95(1)(c). If you have at least two years of service, you can bring a claim. From April 2026, the compensatory award cap is £123,543. The first £30,000 of a settlement is tax-free. Do not resign before taking advice. Enter your details to see what your claim may be worth."
        statutoryRows={STATUTORY_ROWS}
        pageLinks={[
          {
            href: '/guides/how-to-negotiate-a-settlement-agreement',
            label: 'How to negotiate a settlement agreement',
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
