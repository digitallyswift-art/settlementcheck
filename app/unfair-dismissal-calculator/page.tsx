import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow } from '../HomeClient'

export const metadata: Metadata = {
  title: 'Unfair Dismissal Calculator 2026 | Check Your Claim | SettlementCheck',
  description:
    'Estimate your unfair dismissal basic award using 2026 UK rates. Compensatory cap £118,223. See statutory minimum and typical settlement range in 60 seconds. Free, no email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/unfair-dismissal-calculator/',
  },
  openGraph: {
    title: 'Unfair Dismissal Calculator 2026 | Check Your Claim | SettlementCheck',
    description:
      'Estimate your unfair dismissal basic award using 2026 UK rates. Compensatory cap £118,223. See statutory minimum and typical settlement range in 60 seconds. Free, no email.',
    url: 'https://settlementcheck.co.uk/unfair-dismissal-calculator/',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfair Dismissal Calculator 2026 | Check Your Claim | SettlementCheck',
    description:
      'Estimate your unfair dismissal basic award using 2026 rates. Compensatory cap £118,223. Free, no email.',
  },
}

const STATUTORY_ROWS: StatutoryRow[] = [
  { label: 'Weekly pay cap (GB) — basic award', y2425: '£643', y2526: '£751' },
  { label: 'Maximum basic award (GB)', y2425: '£19,290', y2526: '£22,530' },
  { label: 'Compensatory award cap', y2425: '£115,115', y2526: '£118,223' },
  { label: 'Tax-free threshold (termination payments)', y2425: '£30,000', y2526: '£30,000' },
  { label: 'Qualifying service for unfair dismissal', y2425: '2 years', y2526: '2 years' },
]

const FAQ_SCHEMA_ITEMS = [
  {
    question: 'What is the unfair dismissal compensatory award cap in 2026?',
    answer:
      'From 6 April 2025, the unfair dismissal compensatory award cap is £118,223 or 52 weeks\' gross pay, whichever is lower — ERA 1996 s.124 as amended. The basic award uses the same weekly pay cap as statutory redundancy pay: £751 in Great Britain.',
  },
  {
    question: 'How long do I need to work to claim unfair dismissal?',
    answer:
      'You need at least two years of continuous employment with your employer before you can bring an unfair dismissal claim — ERA 1996 s.94. Some dismissals are automatically unfair (e.g., whistleblowing, pregnancy, trade union activity) and do not require any qualifying period.',
  },
  {
    question: 'What is the basic award for unfair dismissal?',
    answer:
      'The basic award is calculated in the same way as statutory redundancy pay: capped weekly pay (£751) multiplied by years of service and an age multiplier (0.5 under 22, 1.0 aged 22–40, 1.5 aged 41 and over), up to 20 qualifying years. The maximum basic award is £22,530 from April 2025.',
  },
  {
    question: 'Is an unfair dismissal settlement taxable?',
    answer:
      'The compensatory element of an unfair dismissal award (including settlement) is tax-free up to £30,000 under ITEPA 2003 s.403. Payment in lieu of notice (PILON) within the settlement is always taxable as earnings under ITEPA 2003 s.402D.',
  },
  {
    question: 'Should I settle or go to tribunal for unfair dismissal?',
    answer:
      'Settlement avoids the time, cost, and uncertainty of a tribunal claim. ACAS early conciliation is a required first step before any tribunal claim. Most unfair dismissal cases settle before or during the ACAS process. A solicitor reviewing your specific circumstances can advise whether your employer\'s offer is fair given the merits of your case.',
  },
]

const HOWTOCALCULATE_STEPS = [
  'Confirm you have at least two years of continuous employment — ERA 1996 s.94.',
  'Calculate the basic award: use capped weekly pay (£751), your years of service (up to 20), and your age multiplier.',
  'Assess the compensatory award: estimated loss of earnings, benefits, and future loss.',
  'Apply the compensatory cap: the lower of £118,223 or 52 weeks\' gross pay — ERA 1996 s.124.',
  'Consider any Polkey reduction if your employer follows some fair procedure.',
  'Factor in any ACAS uplift (up to 25%) if your employer failed to follow the ACAS Code of Practice.',
  'Add PILON if applicable — this is fully taxable as earnings.',
  'Apply the £30,000 tax-free threshold to the non-PILON termination elements under ITEPA 2003 s.403.',
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
      name: 'How to calculate an unfair dismissal award in 2026',
      description:
        'Step-by-step guide to estimating a UK unfair dismissal basic and compensatory award using April 2025 statutory rates.',
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
          name: 'Unfair Dismissal Calculator',
          item: 'https://settlementcheck.co.uk/unfair-dismissal-calculator/',
        },
      ],
    },
  ],
}

export default function UnfairDismissalCalculatorPage() {
  return (
    <>
      <Script
        id="unfair-dismissal-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeClient
        title={
          <>
            Calculate your{' '}
            <em style={{ fontStyle: 'italic', color: '#D9603B' }}>unfair dismissal</em> settlement
          </>
        }
        lead="If you have been dismissed and have at least two years of continuous employment, you may have an unfair dismissal claim under ERA 1996 s.94. From April 2025, the compensatory award cap is £118,223 (or 52 weeks' pay, whichever is lower). The first £30,000 of any settlement is tax-free. Enter your details to see your basic award and whether your offer is in the typical range."
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
            href: '/constructive-dismissal-calculator',
            label: 'Constructive dismissal calculator',
          },
        ]}
      />
    </>
  )
}
