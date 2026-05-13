import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow } from '../HomeClient'

export const metadata: Metadata = {
  title: 'Redundancy Calculator 2026 | Check Your Statutory Pay | SettlementCheck',
  description:
    'Calculate statutory redundancy pay using 2026 UK rates (£751/week cap). See your minimum entitlement, PILON tax treatment, and £30,000 exemption in 60 seconds. Free, no email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/redundancy-calculator/',
  },
  openGraph: {
    title: 'Redundancy Calculator 2026 | Check Your Statutory Pay | SettlementCheck',
    description:
      'Calculate statutory redundancy pay using 2026 UK rates (£751/week cap). See your minimum entitlement, PILON tax treatment, and £30,000 exemption in 60 seconds. Free, no email.',
    url: 'https://settlementcheck.co.uk/redundancy-calculator/',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redundancy Calculator 2026 | Check Your Statutory Pay | SettlementCheck',
    description:
      'Calculate statutory redundancy pay using 2026 UK rates (£751/week cap). Free, no email required.',
  },
}

const STATUTORY_ROWS: StatutoryRow[] = [
  { label: 'Weekly pay cap (GB)', y2425: '£719', y2526: '£751' },
  { label: 'Weekly pay cap (Northern Ireland)', y2425: '£749', y2526: '£783' },
  { label: 'Maximum qualifying weeks', y2425: '20', y2526: '20' },
  { label: 'Maximum statutory redundancy pay (GB)', y2425: '£21,570', y2526: '£22,530' },
  { label: 'Tax-free threshold (termination payments)', y2425: '£30,000', y2526: '£30,000' },
  { label: 'Unfair dismissal compensatory cap (GB)', y2425: '£118,223', y2526: '£123,543' },
]

const FAQ_SCHEMA_ITEMS = [
  {
    question: 'What is the redundancy pay cap in 2026?',
    answer:
      'From 6 April 2026, the weekly pay cap for statutory redundancy pay is £751 in England, Scotland and Wales, and £783 in Northern Ireland, under the Employment Rights (Increase of Limits) Order 2026. The maximum statutory redundancy payment is £22,530.',
  },
  {
    question: 'How is statutory redundancy pay calculated?',
    answer:
      'Statutory redundancy pay is calculated using three factors: your weekly pay (capped at £751), your years of continuous service (up to 20 qualifying years), and your age. The multipliers are: 0.5 weeks\' pay per year under age 22, 1 week\'s pay per year aged 22 to 40, and 1.5 weeks\' pay per year aged 41 and over. ERA 1996 ss.162–163.',
  },
  {
    question: 'Is redundancy pay taxable in the UK?',
    answer:
      'Statutory redundancy pay is tax-free up to £30,000 under ITEPA 2003 s.403. Amounts above £30,000 are taxable at your marginal rate. Payment in lieu of notice (PILON) is always fully taxable as earnings under ITEPA 2003 s.402D, regardless of what it is called in your agreement.',
  },
  {
    question: 'Can I negotiate more than statutory redundancy pay?',
    answer:
      'Yes. Statutory redundancy pay is the legal minimum your employer must pay. Many employers offer enhanced redundancy pay or include a settlement agreement with additional compensation. Your solicitor reviews your agreement and advises whether the total offer is fair given your circumstances.',
  },
  {
    question: 'Do I need a solicitor to sign a redundancy settlement agreement?',
    answer:
      'Yes. Under ERA 1996 s.203, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, SRA-regulated solicitor. Your employer is required to contribute to your legal fees — typically £350 to £750.',
  },
]

const HOWTOCALCULATE_STEPS = [
  'Find your weekly pay: divide your gross annual salary by 52.',
  'Apply the weekly cap: £751 in Great Britain (£783 in Northern Ireland) — ERA 1996 s.227.',
  'Count your complete years of continuous service, up to a maximum of 20.',
  'Apply the age multiplier: 0.5 for each year under 22, 1.0 for each year aged 22–40, 1.5 for each year aged 41 and over.',
  'Multiply the capped weekly pay by the multiplier for each year of service.',
  'Total all years. This is your statutory redundancy pay figure.',
  'Check whether any PILON (Payment in Lieu of Notice) is included and apply the correct tax treatment.',
  'Subtract income tax and National Insurance from the taxable portion to find your net take-home.',
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
      name: 'How to calculate redundancy pay in 2026',
      description:
        'Step-by-step calculation of UK statutory redundancy pay using April 2026 rates (£751 weekly cap in Great Britain).',
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
          name: 'Redundancy Calculator',
          item: 'https://settlementcheck.co.uk/redundancy-calculator/',
        },
      ],
    },
  ],
}

export default function RedundancyCalculatorPage() {
  return (
    <>
      <Script
        id="redundancy-calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeClient
        title={
          <>
            Calculate your{' '}
            <em style={{ fontStyle: 'italic', color: '#D9603B' }}>redundancy</em> settlement
          </>
        }
        lead="From 6 April 2026, the UK weekly pay cap for statutory redundancy is £751 in Great Britain and £783 in Northern Ireland (ERA 1996 s.227, updated by SI 2026/310). Your redundancy pay is calculated by age, length of service, and capped weekly pay across up to 20 qualifying years. The first £30,000 of your termination payment is tax-free, and PILON is always taxable. Enter your details to see whether your offer meets the legal minimum."
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
