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
    t: 'Understand what the law says you could be owed',
    d: 'An unfair dismissal award has two parts: a basic award calculated from your age, pay, and service, and a compensatory award for your actual financial loss. Enter your details and the calculator shows both, based on April 2026 statutory rates.',
  },
  {
    n: '02',
    t: 'See whether your settlement offer reflects your claim',
    d: 'The compensatory award can cover lost earnings, lost benefits, future job loss, and pension. The cap is £123,543 or 52 weeks\' gross pay, whichever is lower. The calculator shows where the offer you have received sits against that range, so you can see whether it is reasonable before you decide anything.',
  },
  {
    n: '03',
    t: 'Know the net figure before you commit',
    d: 'The first £30,000 of an unfair dismissal settlement is tax-free. PILON is taxed separately as earnings. Getting the tax treatment wrong is one of the most common drafting errors in settlement agreements. The calculator separates both so you know what you will actually receive.',
  },
]

const UNFAIR_DISMISSAL_FAQS: FaqItem[] = [
  {
    q: 'I\'ve been dismissed. How do I know if it was unfair?',
    a: 'Dismissal is potentially unfair when your employer either had no valid reason, or had a reason but handled the process badly. A fair dismissal requires a potentially fair reason (such as conduct, capability, or redundancy) and a fair procedure. If you were not given a proper warning, not given a chance to respond, or feel the decision was made before any investigation took place, those are all things a solicitor will want to look at. You need two years of continuous service for an ordinary unfair dismissal claim, but some reasons for dismissal are automatically unfair with no qualifying period at all.',
  },
  {
    q: 'What if I have less than two years of service?',
    a: 'The two-year qualifying period does not apply to every type of claim. If your dismissal was connected to whistleblowing (a protected disclosure under ERA 1996 s.103A), pregnancy or maternity leave, trade union membership or activity, or asserting a statutory right, those are automatically unfair regardless of how long you have worked there. If any of these might apply to your situation, it is worth getting advice before assuming you have no claim.',
  },
  {
    q: 'How much could an unfair dismissal claim be worth?',
    a: 'An unfair dismissal award has two parts. The basic award is calculated on your age, weekly pay (capped at £751 from April 2026), and years of service, up to a maximum of £22,530. The compensatory award reflects your actual financial loss: immediate lost earnings, future job loss, lost benefits, and pension. From April 2026, the compensatory cap is £123,543 or 52 weeks\' gross pay, whichever is lower. The total award can also be increased by up to 25% if your employer failed to follow a fair disciplinary process.',
  },
  {
    q: 'What does the compensatory award actually cover?',
    a: 'A tribunal, or the parties when settling, will look at your financial loss from the date of dismissal. That includes immediate lost earnings up to settlement or hearing, future earnings if you have not yet found a comparable job, loss of pension contributions, and a small conventional sum for loss of statutory rights. If you contributed to the dismissal in any way, the award may be reduced. If your employer failed to follow the ACAS Code of Practice on disciplinary procedures, the award can be increased.',
  },
  {
    q: 'What is the difference between settling and going to tribunal?',
    a: 'A settlement is certain, private, and faster. A tribunal claim can take many months and the outcome is never guaranteed. Your employer may argue that the dismissal was procedurally fair, that you contributed to it, or seek a Polkey reduction for factors that reduce the award. That is not a reason to accept a low offer, but it is a reason to get proper advice on what the claim is realistically worth before deciding. Most cases settle before a hearing, often during ACAS early conciliation.',
  },
  {
    q: 'Is my settlement payment taxable?',
    a: 'The first £30,000 of a termination payment, including the basic award and compensatory element, is tax-free under ITEPA 2003 s.403. Amounts above £30,000 are taxable at your marginal rate. Payment in lieu of notice (PILON) is always taxed as earnings under ITEPA 2003 s.402D, regardless of what your settlement agreement calls it. How the payment is allocated in the agreement affects what you take home, which is one reason the drafting matters.',
  },
  {
    q: 'Do I need a solicitor to sign a settlement agreement?',
    a: 'Yes. Under ERA 1996 s.203, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured, SRA-regulated solicitor who is identified in the agreement. Your employer is required to contribute to that cost, typically between £350 and £750, which in most cases covers the full fee. The settlement agreement cannot validly waive your employment claims without that advice being in place.',
  },
  {
    q: 'What is ACAS early conciliation?',
    a: 'Before you can bring a claim to an Employment Tribunal, you must first notify ACAS and allow them the opportunity to help resolve the dispute. This is a legal requirement under ERA 1996 s.18A and is known as early conciliation. The process is free and confidential, usually takes up to six weeks, and many cases settle during this window. If it does not resolve the matter, ACAS issues a certificate that allows you to proceed to tribunal.',
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
            label: 'Understand what you may be owed',
            detail: 'An unfair dismissal award has two parts: a basic award based on your age, pay, and service, and a compensatory award for your actual financial loss. The calculator shows both.',
          },
          {
            label: 'See if the offer on the table is reasonable',
            detail: 'The compensatory cap from April 2026 is £123,543 or 52 weeks\' gross pay. The calculator shows where any offer you have received sits against that range.',
          },
          {
            label: 'Know your actual take-home figure',
            detail: 'The first £30,000 is tax-free. PILON is always taxed as earnings. The calculator separates both so you know what you will receive, not just what the headline figure says.',
          },
          {
            label: 'A settlement agreement needs independent legal advice',
            detail: 'It is a legal requirement, and your employer must cover the cost. Signing without advice means the agreement may not even be valid.',
          },
        ]}
        steps={UNFAIR_DISMISSAL_STEPS}
        faqItems={UNFAIR_DISMISSAL_FAQS}
        ctaLabel="Estimate my unfair dismissal award →"
        ctaHref="/calculator"
        howItWorksTitle="Three steps to understand your unfair dismissal position."
        howItWorksLead="From what the law says you could be owed, to the net figure after tax. Free, no email required."
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
