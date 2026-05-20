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
    t: 'Find out what you are legally owed',
    d: 'Statutory redundancy pay is your legal minimum. Many employers pay exactly that and no more. Enter your age, salary, and length of service and the calculator shows your entitlement under the April 2026 rates, so you know the floor before any negotiation starts.',
  },
  {
    n: '02',
    t: 'See whether your offer is fair or just the minimum',
    d: 'There is often a gap between what an employer first offers and what a reasonable settlement looks like. If you are also signing away the right to bring tribunal claims, the total package should reflect that. The calculator shows where your offer sits.',
  },
  {
    n: '03',
    t: 'Know what you will actually take home',
    d: 'Redundancy pay and PILON are taxed differently. Getting this wrong is one of the most common errors in settlement agreements. The calculator separates both and gives you an estimated net figure: the number that actually matters.',
  },
]

const REDUNDANCY_FAQS: FaqItem[] = [
  {
    q: 'My employer says I am being made redundant. What am I actually entitled to?',
    a: 'If you have at least two years of continuous service, you are entitled to statutory redundancy pay as a legal minimum. The amount is based on your age, weekly pay (capped at £751 from April 2026), and years of service, up to a maximum of 20 qualifying years. On top of that, you are entitled to your full notice period (or payment in lieu), any accrued holiday pay, and any other contractual entitlements. Statutory redundancy pay alone is rarely the whole picture. A solicitor can help you identify everything you are owed before you sign.',
  },
  {
    q: 'How is statutory redundancy pay calculated?',
    a: 'The calculation uses three factors: your weekly pay (capped at £751 in Great Britain from April 2026), your complete years of continuous service (up to 20), and your age at the time of redundancy. The multiplier is 0.5 weeks per year for service under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over. ERA 1996 ss.162-163. The calculator above applies these rates automatically.',
  },
  {
    q: 'Something feels off about my redundancy. Could it actually be unfair dismissal?',
    a: 'This is one of the most important questions to ask before you sign anything. Redundancy is a potentially fair reason for dismissal, but the process your employer follows must be fair too. If the selection process was not transparent, if you were not properly consulted, if the role is being advertised again shortly after, or if you suspect the real reason for your selection was something personal, a solicitor will look at whether a tribunal claim for unfair dismissal is available alongside your redundancy pay. Getting advice at this stage costs nothing and could make a significant difference to what you walk away with.',
  },
  {
    q: 'Can I negotiate a higher redundancy payment?',
    a: 'Statutory redundancy pay is the legal floor, not the final word. Many employers offer enhanced pay, and where you are signing a settlement agreement that includes waiving the right to bring tribunal claims, the total package should reflect that. If there are circumstances around your redundancy that give rise to other claims, that can affect the value of a negotiated settlement. A solicitor can advise you on whether the offer is reasonable before you commit to anything.',
  },
  {
    q: 'Is redundancy pay taxable?',
    a: 'Statutory redundancy pay is tax-free up to £30,000 under ITEPA 2003 s.403. If your total termination payment exceeds £30,000, the excess is taxable at your marginal rate. Payment in lieu of notice (PILON) is always taxed as earnings under ITEPA 2003 s.402D, regardless of what it is called in your agreement. This distinction matters when you are working out what you will actually receive, and it is one reason the way a settlement agreement is drafted can affect your net position.',
  },
  {
    q: 'Do I need a solicitor to sign a redundancy settlement agreement?',
    a: 'Yes, if your employer is asking you to sign a settlement agreement. Under ERA 1996 s.203, a settlement agreement is only legally valid if you have received independent legal advice from a qualified, SRA-regulated solicitor who is named in the agreement. Importantly, your employer is required to contribute to the cost of that advice, typically between £350 and £750, which in most cases covers the full fee. The advice is free to you in practice. There is no reason to sign without it.',
  },
  {
    q: 'What counts as a week\'s pay for redundancy purposes?',
    a: 'A week\'s pay is your gross contractual pay for a normal working week under ERA 1996 ss.221-224. For salaried employees with fixed hours, that is your weekly rate. If your hours or pay vary, a 12-week average is used. Contractually guaranteed overtime counts. Discretionary bonuses, pension contributions, and benefits in kind do not.',
  },
  {
    q: 'What if my employer has used the wrong weekly pay cap?',
    a: 'If your redundancy date falls on or after 6 April 2026 and your employer has calculated your statutory pay using the old 2025 cap of £719 rather than the current £751, they have underpaid you. You can raise this in writing. If it is not resolved, an Employment Tribunal claim is available, but it must be brought within three months of the date payment was due. A solicitor can help you draft the letter or advise on next steps.',
  },
]

const FAQ_SCHEMA_ITEMS = REDUNDANCY_FAQS.map(({ q, a }) => ({ question: q, answer: a }))

const HOWTOCALCULATE_STEPS = [
  'Find your gross weekly pay: divide your annual salary by 52.',
  'Apply the weekly cap: £751 in Great Britain (£783 in Northern Ireland). ERA 1996 s.227, SI 2026/310.',
  'Count your complete years of continuous service, up to a maximum of 20 qualifying years.',
  'Apply the age multiplier for each year: 0.5 for years under age 22, 1.0 for years aged 22-40, 1.5 for years aged 41 and over. ERA 1996 ss.162-163.',
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
            label: 'Find out what you are legally owed',
            detail: 'Statutory redundancy pay is the minimum your employer must pay. Based on your age, salary, and length of service at April 2026 rates, the calculator shows your entitlement before any negotiation starts.',
          },
          {
            label: 'Check whether your offer is fair',
            detail: 'Many employers offer exactly the statutory minimum and no more. If you are also signing away the right to bring a tribunal claim, the total package should reflect that.',
          },
          {
            label: 'Understand your actual take-home pay',
            detail: 'Redundancy pay and PILON are taxed differently. The calculator separates both and shows the net figure after tax, because that is the number that actually matters.',
          },
          {
            label: 'Do not sign until you have had independent advice',
            detail: 'A settlement agreement is legally binding and waives your right to claim. Your employer is required to pay for your legal advice. There is no good reason to sign without it.',
          },
        ]}
        steps={REDUNDANCY_STEPS}
        faqItems={REDUNDANCY_FAQS}
        ctaLabel="Calculate my redundancy pay →"
        ctaHref="/calculator"
        howItWorksTitle="Three steps to understand your redundancy position."
        howItWorksLead="From your statutory minimum to what you will actually take home. Free, no email required."
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
