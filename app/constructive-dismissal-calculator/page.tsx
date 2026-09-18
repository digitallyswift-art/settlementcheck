import type { Metadata } from 'next'
import Script from 'next/script'
import HomeClient from '../HomeClient'
import type { StatutoryRow, StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'
import { getConstructiveDismissalStatutoryRows } from '@/lib/statutory-rates'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Constructive Dismissal Calculator 2026 | Forced to Resign? | SettlementCheck (Employment)',
  description:
    'Forced to resign by your employer\'s conduct? Estimate your constructive dismissal settlement using April 2026 UK rates. Compensatory cap £123,543. Free, no email. (Not an immigration or visa status service).',
  alternates: {
    canonical: '/constructive-dismissal-calculator/',
  },
  openGraph: {
    title: 'Constructive Dismissal Calculator 2026 | Forced to Resign? | SettlementCheck (Employment)',
    description:
      'Forced to resign by your employer\'s conduct? Estimate your constructive dismissal settlement using April 2026 UK rates. Compensatory cap £123,543. Free, no email. (Not an immigration or visa status service).',
    url: '/constructive-dismissal-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Constructive Dismissal Calculator 2026 | SettlementCheck (Employment)',
    description:
      'Forced to resign? Estimate your constructive dismissal settlement using 2026 UK rates. Free, no email. (Not an immigration or visa status service).',
  },
}

const CONSTRUCTIVE_DISMISSAL_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Get advice before you resign, not after',
    d: 'This is the most important step. Once you resign, your options change significantly. A solicitor can assess whether what you are experiencing amounts to a fundamental breach of contract and, in many cases, can open negotiations with your employer while you are still employed, often achieving a better outcome than resigning and claiming.',
  },
  {
    n: '02',
    t: 'See what a constructive dismissal settlement could look like',
    d: 'A constructive dismissal claim is valued the same way as unfair dismissal. Enter your age, salary, and length of service and the calculator shows your basic award and where your total package could sit against the compensatory cap of £123,543 or 52 weeks\' pay, whichever is lower.',
  },
  {
    n: '03',
    t: 'Know the net figure before you make any decisions',
    d: 'The first £30,000 of a constructive dismissal settlement is tax-free. PILON is taxed separately as earnings. The calculator gives you the estimated net take-home figure, because that is the number that actually matters when you are weighing your options.',
  },
]

const CONSTRUCTIVE_DISMISSAL_FAQS: FaqItem[] = [
  {
    q: 'My employer is making my life at work unbearable. Do I have a claim?',
    a: 'Possibly, but the legal test is specific. Constructive dismissal requires a fundamental breach of your employment contract by your employer, and you must resign in direct response to it. Common examples include a unilateral cut to your pay or hours, demotion without your consent, sustained bullying or harassment, or serious damage to the trust and confidence that underpins the employment relationship. The key word is fundamental. Not every difficult working situation meets the legal threshold. Getting advice before you resign is the most important step, because a solicitor can assess whether what you are experiencing is likely to qualify.',
  },
  {
    q: 'Why does it matter so much that I get advice before resigning?',
    a: 'Because your position is strongest while you are still employed. Before you resign, a solicitor can assess whether the breach is serious enough to support a claim, advise you on how to document what is happening, and in many cases open without prejudice discussions with your employer. That can result in a negotiated settlement where you leave on agreed terms with a financial package, without the risk and delay of a tribunal claim. If you resign first, without that preparation, you have fewer options and less leverage.',
  },
  {
    q: 'What does it mean to "affirm" the breach?',
    a: 'If you continue working for a significant period after the event you say forced your resignation, a tribunal may find that you accepted the breach and carried on under the contract, which would undermine your constructive dismissal claim. There is no fixed time limit and it depends on the circumstances, but it is one reason acting promptly matters. Raising a formal grievance is often an important step to show you have not accepted the situation.',
  },
  {
    q: 'Do I need two years of service to claim?',
    a: 'For a standard constructive dismissal claim under ERA 1996 s.95(1)(c), you need at least two years of continuous employment. However, if the conduct that forced you to resign was connected to a protected characteristic (such as your sex, race, disability, or age), a protected disclosure, pregnancy or maternity leave, or trade union membership, you may have additional claims that carry no qualifying period and can be worth significantly more. A solicitor will look at all potential heads of claim, not just the constructive dismissal route.',
  },
  {
    q: 'How much is a constructive dismissal settlement worth?',
    a: 'A constructive dismissal claim is valued on the same basis as unfair dismissal. The basic award is calculated using your age, weekly pay (capped at £751 from April 2026), and years of service. The compensatory award covers your actual financial loss and is capped at £123,543 or 52 weeks\' gross pay, whichever is lower, under ERA 1996 s.124. If your employer failed to follow a fair grievance or disciplinary process, a tribunal can increase the award by up to 25%.',
  },
  {
    q: 'My employer has asked to have a "without prejudice" conversation. What does that mean?',
    a: 'A without prejudice conversation is one held with a genuine view to settling a dispute. What is said in that meeting generally cannot be used as evidence in tribunal proceedings. Under ERA 1996 s.111A, pre-termination negotiations (including settlement offers made before any formal dispute exists) are also protected from disclosure in ordinary unfair dismissal claims. If your employer has approached you about leaving, that conversation may have legal protection, but it does not stop you from seeking independent advice before responding or agreeing to anything.',
  },
  {
    q: 'How is a constructive dismissal settlement taxed?',
    a: 'The first £30,000 of a termination payment, including the basic award and compensatory element, is tax-free under ITEPA 2003 s.403. Amounts above £30,000 are taxable at your marginal rate. Payment in lieu of notice (PILON) is always taxed as earnings under ITEPA 2003 s.402D, regardless of what the agreement calls it. How the settlement is structured and allocated in the agreement affects your net take-home, which is one reason having a solicitor review and draft the document matters.',
  },
  {
    q: 'Do I need a solicitor to sign a settlement agreement?',
    a: 'Yes. Under ERA 1996 s.203, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured, SRA-regulated solicitor who is named in the agreement. Without that, the agreement cannot validly waive your right to bring a claim. Your employer is required to contribute to the legal fees, typically between £350 and £750, which in most cases covers the full cost. The advice is effectively free to you, and it is the only way the agreement is legally valid.',
  },
]

const FAQ_SCHEMA_ITEMS = CONSTRUCTIVE_DISMISSAL_FAQS.map(({ q, a }) => ({ question: q, answer: a }))

const HOWTOCALCULATE_STEPS = [
  'Identify the fundamental breach of contract: the specific act or omission by your employer that made your position untenable.',
  'Confirm you resigned in direct response to the breach and did not affirm the contract by continuing to work without raising the issue.',
  'Verify you have at least two years of continuous employment, or identify whether an automatically unfair reason applies. ERA 1996 s.94.',
  'Calculate the basic award: capped weekly pay (£751), years of service (up to 20), and age multiplier (0.5/1.0/1.5). ERA 1996 ss.162-163.',
  'Estimate the compensatory award: loss of earnings from resignation date, future loss, lost benefits, and pension loss.',
  'Apply the compensatory cap: the lower of £123,543 or 52 weeks\' gross pay. ERA 1996 s.124.',
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
  const statutoryRows = getConstructiveDismissalStatutoryRows()
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
            label: 'Get advice before you resign',
            detail: 'Your position is strongest while you are still employed. A solicitor can assess your situation and often negotiate a settlement without you needing to resign at all.',
          },
          {
            label: 'Understand what a settlement could look like',
            detail: 'A constructive dismissal claim is valued the same as unfair dismissal. The calculator shows your basic award, compensatory range, and where any offer sits against the April 2026 caps.',
          },
          {
            label: 'Know your actual take-home figure',
            detail: 'The first £30,000 is tax-free. PILON is always taxed as earnings. The calculator shows you the net figure after tax, not just the headline number.',
          },
          {
            label: 'Other claims may apply alongside constructive dismissal',
            detail: 'If the conduct involved discrimination or whistleblowing, there may be additional claims with no qualifying period and a higher potential value. A solicitor will look at all of them.',
          },
        ]}
        steps={CONSTRUCTIVE_DISMISSAL_STEPS}
        faqItems={CONSTRUCTIVE_DISMISSAL_FAQS}
        ctaLabel="Estimate my constructive dismissal settlement →"
        ctaHref="/calculator"
        howItWorksTitle="Three steps to understand your constructive dismissal position."
        howItWorksLead="From what you could be owed, to the net figure after tax. Free, no email required. Independent, not a law firm."
        taxSectionTitle="How much tax will you pay on a constructive dismissal settlement?"
        statutoryRows={statutoryRows}
        pageLinks={[
          {
            href: '/guides/constructive-dismissal-settlement-agreements',
            label: 'Constructive dismissal settlement agreements guide',
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
