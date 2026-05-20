import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow, StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Redundancy Pay Calculator 2026 | Statutory & Enhanced Pay | SettlementCheck',
  description:
    'Calculate your statutory redundancy pay using April 2026 rates. Weekly cap £751 (GB), age multipliers, PILON tax treatment, and £30,000 tax-free limit explained. Free, no email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/redundancy-calculator/',
  },
  openGraph: {
    title: 'Redundancy Pay Calculator 2026 | Statutory & Enhanced Pay | SettlementCheck',
    description:
      'Calculate your statutory redundancy pay using April 2026 rates. Weekly cap £751 (GB), age multipliers, PILON tax treatment, and £30,000 tax-free limit explained. Free, no email.',
    url: 'https://settlementcheck.co.uk/redundancy-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redundancy Pay Calculator 2026 | SettlementCheck',
    description:
      'Statutory redundancy pay using 2026 UK rates. Weekly cap £751. Free, no email required.',
  },
}

const STATUTORY_ROWS: StatutoryRow[] = [
  { label: 'Weekly pay cap (Great Britain)', y2425: '£719', y2526: '£751' },
  { label: 'Weekly pay cap (Northern Ireland)', y2425: '£749', y2526: '£783' },
  { label: 'Maximum qualifying years', y2425: '20', y2526: '20' },
  { label: 'Maximum statutory redundancy pay (GB)', y2425: '£21,570', y2526: '£22,530' },
  { label: 'Tax-free threshold (termination payments)', y2425: '£30,000', y2526: '£30,000' },
  { label: 'Unfair dismissal compensatory cap (GB)', y2425: '£118,223', y2526: '£123,543' },
]

const REDUNDANCY_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Know your statutory minimum',
    d: 'Enter your age, salary, and length of service. The calculator applies the April 2026 weekly pay cap of £751 and the correct age multiplier to show your legal minimum entitlement under ERA 1996 ss.162-163.',
  },
  {
    n: '02',
    t: 'See how your offer compares',
    d: 'Many employers offer enhanced redundancy pay above the statutory floor. The calculator shows whether the total offer you have received sits below, within, or above the typical range for your circumstances.',
  },
  {
    n: '03',
    t: 'Understand your take-home figure',
    d: 'Statutory redundancy pay is tax-free up to £30,000. If your package includes PILON, that is taxed separately as earnings. The calculator separates both and shows your estimated net figure.',
  },
]

const REDUNDANCY_FAQS: FaqItem[] = [
  {
    q: 'What is the redundancy pay cap in 2026?',
    a: 'From 6 April 2026, the weekly pay cap for statutory redundancy is £751 in England, Scotland and Wales, set by SI 2026/310 under ERA 1996 s.227. The cap in Northern Ireland is £783. The maximum statutory redundancy payment in Great Britain is £22,530 (20 years x 1.5 x £751).',
  },
  {
    q: 'How is statutory redundancy pay calculated?',
    a: 'Your statutory redundancy pay is based on three things: your weekly pay (capped at £751), your years of continuous service (up to 20 qualifying years), and your age. The multipliers are: 0.5 weeks for each year of service under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over. ERA 1996 ss.162-163.',
  },
  {
    q: 'Is statutory redundancy pay taxable?',
    a: 'Statutory redundancy pay is tax-free up to £30,000 under ITEPA 2003 s.403. If your total termination payment exceeds £30,000, the excess is taxable at your marginal rate. Payment in lieu of notice (PILON) is always taxed as normal earnings under ITEPA 2003 s.402D, regardless of what it is called in your agreement.',
  },
  {
    q: 'Can I get more than the statutory minimum?',
    a: 'Yes. Statutory redundancy pay is the legal floor, not the ceiling. Many employers offer enhanced redundancy pay, and where you are also signing a settlement agreement, the total package will typically include additional compensation for waiving tribunal claims. If your redundancy was connected to discrimination, a protected disclosure, or a pregnancy, your potential claim value is substantially higher and you should take independent legal advice before signing anything.',
  },
  {
    q: 'Do I need a solicitor to sign a redundancy settlement agreement?',
    a: 'If your employer is asking you to sign a settlement agreement as part of your redundancy, then yes. Under ERA 1996 s.203, a settlement agreement is only legally valid if you have received independent legal advice from a qualified, SRA-regulated solicitor. Your employer is required to contribute to that cost, typically £350 to £750.',
  },
  {
    q: 'What counts as a week\'s pay for redundancy purposes?',
    a: 'A week\'s pay is your gross contractual pay for a normal working week under ERA 1996 ss.221-224. For employees with fixed hours and salary, this is simply your weekly rate. If your hours or pay vary, a 12-week average is used. Overtime that is guaranteed in your contract counts. Discretionary bonuses, pension contributions, and benefits in kind are excluded.',
  },
  {
    q: 'What happens if my employer has applied the wrong weekly cap?',
    a: 'If your employer calculated your statutory redundancy pay using a figure below £751 (for example, using the 2025 cap of £719) and your redundancy date falls on or after 6 April 2026, they have underpaid you. You can raise this in writing citing ERA 1996 s.227 and SI 2026/310. If unresolved, you can bring an Employment Tribunal claim within three months of the payment date.',
  },
  {
    q: 'Is my information shared with anyone?',
    a: 'No. Your calculator inputs are used only to generate your estimate. They are not stored or shared with solicitors, employers, or third parties. If you choose to be matched with a solicitor when that service launches, you will opt in at that point.',
  },
]

const FAQ_SCHEMA_ITEMS = REDUNDANCY_FAQS.map(({ q, a }) => ({ question: q, answer: a }))

const HOWTOCALCULATE_STEPS = [
  'Find your gross weekly pay: divide your annual salary by 52.',
  'Apply the weekly cap: £751 in Great Britain (£783 in Northern Ireland) — ERA 1996 s.227, SI 2026/310.',
  'Count your complete years of continuous service, up to a maximum of 20 qualifying years.',
  'Apply the age multiplier for each year: 0.5 for years under age 22, 1.0 for years aged 22-40, 1.5 for years aged 41 and over — ERA 1996 ss.162-163.',
  'Multiply the capped weekly pay by the multiplier for each year of service and total all years.',
  'Check whether a PILON (Payment in Lieu of Notice) is included. PILON is always taxed as earnings under ITEPA 2003 s.402D.',
  'Apply the £30,000 tax-free threshold to the non-PILON redundancy element under ITEPA 2003 s.403.',
  'Subtract income tax and National Insurance from any taxable element to find your estimated net take-home.',
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
      name: 'How to calculate statutory redundancy pay in 2026',
      description:
        'Step-by-step calculation of UK statutory redundancy pay using April 2026 rates: £751 weekly cap in Great Britain, age multipliers, and tax treatment.',
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
          name: 'Redundancy Pay Calculator',
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
            <em style={{ fontStyle: 'italic', color: '#D9603B' }}>redundancy pay</em>
          </>
        }
        leadBullets={[
          {
            label: 'Your statutory minimum in 60 seconds',
            detail: 'Based on your age, salary, and length of service at April 2026 rates (£751 weekly cap, ERA 1996 s.227).',
          },
          {
            label: 'See if your offer is enhanced or just statutory',
            detail: 'Many employers offer more than the legal minimum. Find out where your package sits.',
          },
          {
            label: 'Net take-home after tax',
            detail: 'PILON is taxed separately from redundancy pay. The calculator splits both and shows what you will actually receive.',
          },
          {
            label: 'Know before you sign',
            detail: 'If your employer is asking you to sign a settlement agreement, independent legal advice is legally required and your employer must cover the fee.',
          },
        ]}
        steps={REDUNDANCY_STEPS}
        faqItems={REDUNDANCY_FAQS}
        ctaLabel="Calculate my redundancy pay →"
        ctaHref="/calculator"
        howItWorksTitle="Three steps. See your redundancy entitlement now."
        howItWorksLead="From your statutory minimum to a net take-home figure. Free, no email required."
        taxSectionTitle="How much tax will you pay on your redundancy package?"
        statutoryRows={STATUTORY_ROWS}
        pageLinks={[
          {
            href: '/guides/redundancy-pay-cap-2026',
            label: 'Redundancy pay cap 2026 explained',
          },
          {
            href: '/guides/what-is-a-fair-settlement-agreement',
            label: 'What is a fair settlement agreement?',
          },
          {
            href: '/guides/how-to-negotiate-a-settlement-agreement',
            label: 'How to negotiate your settlement',
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
