import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow, StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'

export const metadata: Metadata = {
  title: 'Unfair Dismissal Calculator 2026 | Basic & Compensatory Award | SettlementCheck',
  description:
    'Estimate your unfair dismissal basic and compensatory award using April 2026 UK rates. Compensatory cap £123,543. See whether your settlement offer is fair in 60 seconds. Free, no email.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/unfair-dismissal-calculator/',
  },
  openGraph: {
    title: 'Unfair Dismissal Calculator 2026 | Basic & Compensatory Award | SettlementCheck',
    description:
      'Estimate your unfair dismissal basic and compensatory award using April 2026 UK rates. Compensatory cap £123,543. Free, no email.',
    url: 'https://settlementcheck.co.uk/unfair-dismissal-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unfair Dismissal Calculator 2026 | SettlementCheck',
    description:
      'Basic and compensatory award estimate using 2026 UK rates. Compensatory cap £123,543. Free, no email.',
  },
}

const STATUTORY_ROWS: StatutoryRow[] = [
  { label: 'Weekly pay cap (GB), basic award', y2425: '£719', y2526: '£751' },
  { label: 'Maximum basic award (GB)', y2425: '£21,570', y2526: '£22,530' },
  { label: 'Compensatory award cap (GB)', y2425: '£118,223', y2526: '£123,543' },
  { label: 'Tax-free threshold (termination payments)', y2425: '£30,000', y2526: '£30,000' },
  { label: 'Qualifying service for unfair dismissal', y2425: '2 years', y2526: '2 years' },
]

const UNFAIR_DISMISSAL_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Check your basic award entitlement',
    d: 'Enter your age, salary, and length of service. The calculator applies the April 2026 weekly pay cap of £751 and the correct age multiplier to show your basic award under ERA 1996 ss.162-163.',
  },
  {
    n: '02',
    t: 'Understand your compensatory award potential',
    d: 'The compensatory award covers your actual financial loss: lost earnings, lost benefits, and future loss of employment. The cap is £123,543 or 52 weeks\' gross pay, whichever is lower (ERA 1996 s.124). The calculator shows where your offer sits against that range.',
  },
  {
    n: '03',
    t: 'Know your net take-home before you sign',
    d: 'The first £30,000 of an unfair dismissal settlement is tax-free. PILON is taxed separately as earnings. The calculator separates both and gives you an estimated net figure, so you know exactly what you will receive.',
  },
]

const UNFAIR_DISMISSAL_FAQS: FaqItem[] = [
  {
    q: 'Do I qualify to bring an unfair dismissal claim?',
    a: 'You need at least two years of continuous employment with your employer to bring an ordinary unfair dismissal claim under ERA 1996 s.94. However, some dismissals are automatically unfair and carry no qualifying period. These include dismissals connected to whistleblowing (a protected disclosure under ERA 1996 s.103A), pregnancy or maternity leave, trade union membership or activity, and asserting a statutory right. If any of these apply to you, the two-year rule does not bar your claim.',
  },
  {
    q: 'What is the unfair dismissal compensatory award cap in 2026?',
    a: 'From 6 April 2026, the compensatory award cap is £123,543 or 52 weeks\' gross pay, whichever is lower, under ERA 1996 s.124 as updated by SI 2026/310. The basic award is calculated the same way as statutory redundancy pay and uses a weekly pay cap of £751, giving a maximum basic award of £22,530.',
  },
  {
    q: 'What is the basic award and how is it calculated?',
    a: 'The basic award is calculated using the same formula as statutory redundancy pay: your capped weekly pay (£751 from April 2026), your complete years of continuous service (up to 20), and an age multiplier. The multipliers are 0.5 weeks per year under age 22, 1 week per year aged 22 to 40, and 1.5 weeks per year aged 41 and over. ERA 1996 ss.162-163.',
  },
  {
    q: 'What does the compensatory award cover?',
    a: 'The compensatory award is intended to reflect your actual financial loss from being dismissed. A tribunal (or the parties settling) will consider: immediate loss of earnings from the dismissal date to the settlement or hearing, future loss of earnings if you have not yet found comparable employment, loss of statutory rights (a small conventional figure), and loss of pension contributions. If you contributed to your own dismissal in some way, a tribunal may apply a percentage reduction (called a Polkey reduction). If your employer failed to follow the ACAS Code of Practice on disciplinary procedures, a tribunal can increase the award by up to 25%.',
  },
  {
    q: 'Is an unfair dismissal settlement payment taxable?',
    a: 'The first £30,000 of a termination payment, including the basic award and compensatory element, is tax-free under ITEPA 2003 s.403. Amounts above £30,000 are taxable at your marginal rate. Payment in lieu of notice (PILON) is always taxed as earnings under ITEPA 2003 s.402D, regardless of what your settlement agreement calls it.',
  },
  {
    q: 'Should I settle or go to an Employment Tribunal?',
    a: 'Tribunal claims carry real uncertainty. Your employer may argue procedural fairness, contributory conduct, or a Polkey reduction, all of which can reduce the award significantly. Before filing a claim, ACAS early conciliation is a mandatory first step, and most cases settle during or shortly after that process. Settlement is faster, certain, and confidential. A solicitor reviewing your specific situation can tell you whether the offer on the table reflects the merits of your case or whether there is room to negotiate.',
  },
  {
    q: 'Do I need a solicitor to accept an unfair dismissal settlement?',
    a: 'If your employer is asking you to sign a settlement agreement to resolve an unfair dismissal claim, yes. Under ERA 1996 s.203, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured, SRA-regulated solicitor who is identified in the agreement. Your employer is required to contribute to your legal fees, typically £350 to £750, which in most cases covers the full cost.',
  },
  {
    q: 'What is ACAS early conciliation and is it mandatory?',
    a: 'ACAS early conciliation is a free, confidential dispute resolution service. Before you can submit a claim to an Employment Tribunal, you must notify ACAS and give them the opportunity to conciliate. This is a legal requirement under ERA 1996 s.18A. The process typically takes up to six weeks. If conciliation does not resolve the dispute, ACAS issues a certificate that allows you to proceed to tribunal. Many cases settle during this window without the need for a formal hearing.',
  },
]

const FAQ_SCHEMA_ITEMS = UNFAIR_DISMISSAL_FAQS.map(({ q, a }) => ({ question: q, answer: a }))

const HOWTOCALCULATE_STEPS = [
  'Confirm you have at least two years of continuous employment, or identify whether an automatically unfair reason applies. ERA 1996 s.94.',
  'Calculate the basic award: capped weekly pay (£751), years of service (up to 20), and your age multiplier (0.5/1.0/1.5). ERA 1996 ss.162-163.',
  'Assess the compensatory award: immediate loss of earnings, future loss, lost benefits, and loss of pension.',
  'Apply the compensatory cap: the lower of £123,543 or 52 weeks\' gross pay. ERA 1996 s.124.',
  'Consider any Polkey reduction if your employer followed some (but not full) fair procedure.',
  'Consider an ACAS uplift of up to 25% if your employer failed to follow the ACAS Code of Practice on disciplinary and grievance procedures.',
  'Add PILON if included. PILON is always taxed as earnings under ITEPA 2003 s.402D.',
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
        'Step-by-step guide to estimating a UK unfair dismissal basic and compensatory award using April 2026 statutory rates.',
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
        leadBullets={[
          {
            label: 'Find out if you have a qualifying claim',
            detail: 'Two years of continuous employment is the usual threshold. Whistleblowing, pregnancy, and trade union dismissals carry no qualifying period.',
          },
          {
            label: 'See your basic award and compensatory award range',
            detail: 'The basic award uses the £751 weekly cap and age multipliers. The compensatory cap is £123,543 or 52 weeks\' pay, whichever is lower (ERA 1996 s.124).',
          },
          {
            label: 'Understand your net take-home figure',
            detail: 'The first £30,000 is tax-free. PILON is taxed separately. The calculator shows what you will actually receive after tax.',
          },
          {
            label: 'Know before you sign anything',
            detail: 'A settlement agreement waives your right to bring a tribunal claim. Independent legal advice is a legal requirement and your employer must cover the fee.',
          },
        ]}
        steps={UNFAIR_DISMISSAL_STEPS}
        faqItems={UNFAIR_DISMISSAL_FAQS}
        ctaLabel="Estimate my unfair dismissal award →"
        ctaHref="/calculator"
        howItWorksTitle="Three steps. Understand your unfair dismissal position."
        howItWorksLead="From basic award to compensatory range to net take-home. Free, no email required."
        taxSectionTitle="How much tax will you pay on an unfair dismissal settlement?"
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
            href: '/redundancy-calculator',
            label: 'Redundancy pay calculator',
          },
        ]}
      />
    </>
  )
}
