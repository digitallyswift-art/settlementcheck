import type { Metadata } from 'next'
import HomeClient from '../HomeClient'
import type { StepItem } from '../HomeClient'
import type { FaqItem } from '@/components/FaqAccordion'
import { getTaxStatutoryRows } from '@/lib/statutory-rates'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Tax Calculator UK 2026 | SettlementCheck',
  description:
    'Calculate tax on your settlement agreement under April 2026 UK rates. Work out your £30,000 tax exemption, taxable PILON, and net take-home pay. Free check.',
  alternates: {
    canonical: '/settlement-agreement-tax-calculator/',
  },
  openGraph: {
    title: 'Settlement Agreement Tax Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate tax on your settlement agreement under April 2026 UK rates. Work out your £30,000 tax exemption, taxable PILON, and net take-home pay. Free check.',
    url: '/settlement-agreement-tax-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Tax Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate tax on your settlement agreement under 2026 UK rates. Work out your £30k tax-free limit, PILON, and net pay. Free instant calculator.',
  },
}

const TAX_STEPS: StepItem[] = [
  {
    n: '01',
    t: 'Separate compensation from notice pay',
    d: 'Under UK tax law, genuine compensation for loss of employment qualifies for the £30,000 exemption. In contrast, notice pay (PILON) is treated as earnings and taxed in full under PENP rules. The calculator splits them automatically.',
  },
  {
    n: '02',
    t: 'Apply the £30,000 statutory tax exemption',
    d: 'Under Section 403 of ITEPA 2003, the first £30,000 of qualifying termination compensation is completely free of income tax and employee National Insurance. Anything above £30,000 is taxed at your marginal rate.',
  },
  {
    n: '03',
    t: 'Explore pension sacrifice to reduce higher-rate tax',
    d: 'If your severance package pushes you into the 40% or 45% tax bracket, you can often negotiate to pay part of the taxable excess into your pension. This saves thousands in tax while keeping the full value of your offer.',
  },
]

const TAX_FAQS: FaqItem[] = [
  {
    q: 'How much of my settlement agreement payout is tax-free?',
    a: 'Under Section 403 of the Income Tax (Earnings and Pensions) Act 2003, the first £30,000 of compensation for loss of employment is tax-free. This applies to statutory redundancy pay, enhanced redundancy, and ex-gratia compensation. Notice pay, accrued holiday pay, and contractual bonuses do not qualify for this exemption.',
  },
  {
    q: 'How is PILON (Payment in Lieu of Notice) taxed?',
    a: 'Under Section 402D of ITEPA 2003 (the Post-Employment Notice Pay or PENP rules), all payments in lieu of notice are taxed as standard employment earnings. This means PILON is subject to income tax and employee Class 1 National Insurance, regardless of whether your contract contains a PILON clause.',
  },
  {
    q: 'Do I pay National Insurance on settlement agreement payments?',
    a: 'Employees do not pay National Insurance on genuine termination compensation, even on amounts exceeding £30,000. While income tax applies to any compensation above £30,000 at your marginal rate, employee National Insurance is zero. Employers, however, must pay Class 1A employer National Insurance (13.8%) on compensation over £30,000.',
  },
  {
    q: 'Can I put part of my settlement into a pension to avoid 40% tax?',
    a: 'Yes. Pension sacrifice (also known as a pension contribution or employer pension top-up) is one of the most effective ways to protect your settlement from higher-rate tax. You can request that your employer pays a portion of the taxable settlement directly into your registered pension scheme before tax is deducted.',
  },
  {
    q: 'Why does my settlement agreement include a tax indemnity clause?',
    a: 'Almost every settlement agreement contains a tax indemnity. This clause states that if HMRC determines that more tax is owed on your settlement payment than was deducted at source, you are personally liable to repay that tax to your employer. A specialist employment solicitor will review this clause to ensure it is drafted fairly and does not expose you to unexpected penalties.',
  },
  {
    q: 'Who pays the solicitor legal fees to check my settlement agreement?',
    a: 'Under Section 203 of the Employment Rights Act 1996, you must receive independent legal advice for the agreement to be binding. Your employer covers this cost, typically contributing between £350 and £750 plus VAT directly to your solicitor. The advice is free to you.',
  },
]

const FAQ_SCHEMA_ITEMS = TAX_FAQS.map(({ q, a }) => ({ question: q, answer: a }))

const HOWTOCALCULATE_STEPS = [
  'Identify all components of your settlement agreement package: redundancy, ex-gratia, notice pay (PILON), and holiday pay.',
  'Calculate the Post-Employment Notice Pay (PENP) element under ITEPA 2003 s.402D. PENP is always taxed as earnings with income tax and NIC.',
  'Deduct the PENP and contractual earnings from the total offer to isolate the genuine termination compensation.',
  'Apply the statutory £30,000 exemption under ITEPA 2003 s.403 to the remaining compensation.',
  'Assess marginal income tax on any compensation exceeding £30,000 (20%, 40%, or 45% based on your annual earnings).',
  'Confirm that employee National Insurance is 0% on termination compensation, even on sums above £30,000.',
  'Evaluate pension sacrifice options for any taxable excess to legally reduce your income tax liability.',
]

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'UK Settlement Agreement Tax Calculator 2026',
      url: 'https://settlementcheck.co.uk/settlement-agreement-tax-calculator/',
      applicationCategory: ['BusinessApplication', 'FinanceApplication'],
      operatingSystem: 'All modern web browsers',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      softwareVersion: '2026.1 (SI 2026/310)',
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'GBP',
        availability: 'https://schema.org/InStock',
      },
      description:
        'Free UK settlement agreement tax calculator. Calculates your £30,000 tax-free allowance, PENP notice pay taxation, National Insurance exemptions, and estimated net take-home pay under April 2026 rates.',
      featureList: [
        'Automatic separation of tax-free £30,000 compensation and taxable PILON',
        'PENP calculation compliant with ITEPA 2003 Section 402D',
        'Accurate income tax estimation at basic, higher, and additional rates',
        'Zero employee National Insurance calculation on termination compensation',
        'Interactive pension sacrifice modeling to optimize net settlement payout',
      ],
      screenshot: 'https://settlementcheck.co.uk/og-image.png',
      creator: {
        '@type': 'Organization',
        name: 'SettlementCheck',
        url: 'https://settlementcheck.co.uk',
      },
      reviewedBy: {
        '@type': 'Organization',
        name: 'SettlementCheck Legal Research Desk',
        url: 'https://settlementcheck.co.uk/how-it-works/',
      },
      isBasedOn: [
        {
          '@type': 'Legislation',
          name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
          url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
        },
        {
          '@type': 'Legislation',
          name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D',
          url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
        },
        {
          '@type': 'Legislation',
          name: 'Employment Rights Act 1996, Section 203',
          url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
        },
      ],
    },
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
      name: 'How to calculate tax on a settlement agreement in 2026',
      description:
        'Step-by-step method to calculate income tax, National Insurance, and the £30,000 exemption on UK settlement agreements.',
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
          name: 'Settlement Agreement Tax Calculator',
          item: 'https://settlementcheck.co.uk/settlement-agreement-tax-calculator/',
        },
      ],
    },
  ],
}

export default function SettlementTaxCalculatorPage() {
  const statutoryRows = getTaxStatutoryRows()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeClient
        title={
          <>
            Calculate tax on your{' '}
            <em style={{ fontStyle: 'italic', color: '#D9603B' }}>settlement agreement</em>
          </>
        }
        leadBullets={[
          {
            label: 'The first £30,000 is tax-free',
            detail: 'Under Section 403 of ITEPA 2003, genuine compensation for loss of employment is tax-free up to £30,000. Anything above that threshold is taxed at your marginal income tax rate.',
          },
          {
            label: 'Notice pay (PILON) is taxed separately',
            detail: 'Under statutory PENP rules, payment in lieu of notice is taxed as earnings, subject to both income tax and National Insurance. Getting this calculation wrong is the most common drafting error in agreements.',
          },
          {
            label: 'No employee National Insurance on compensation',
            detail: 'Even on settlement amounts exceeding £30,000, you pay zero employee National Insurance on genuine compensation. Only standard income tax applies to the excess.',
          },
          {
            label: 'Your employer covers your legal review fee',
            detail: 'Under UK law, independent legal advice is mandatory before you can sign. Your employer is required to cover the legal fee, paying your solicitor directly.',
          },
        ]}
        steps={TAX_STEPS}
        faqItems={TAX_FAQS}
        ctaLabel="Calculate my take-home pay →"
        ctaHref="/calculator/"
        howItWorksTitle="Three steps to calculate your net settlement pay."
        howItWorksLead="From your statutory tax-free allowance to your net take-home figure. Free, no email required."
        taxSectionTitle="Current UK tax rates on termination payments (2026/27)"
        statutoryRows={statutoryRows}
        pageLinks={[
          {
            href: '/calculator/',
            label: 'Settlement Agreement Calculator',
          },
          {
            href: '/redundancy-calculator/',
            label: 'Redundancy Pay Calculator',
          },
          {
            href: '/unfair-dismissal-calculator/',
            label: 'Unfair Dismissal Calculator',
          },
          {
            href: '/constructive-dismissal-calculator/',
            label: 'Constructive Dismissal Calculator',
          },
          {
            href: '/guides/tax-free-settlement-30000/',
            label: 'The £30,000 Tax-Free Exemption Explained',
          },
          {
            href: '/guides/pilon-tax-treatment-2026/',
            label: 'PILON Tax Treatment & PENP Rules',
          },
          {
            href: '/guides/average-settlement-agreement-payout-uk/',
            label: 'Average Settlement Agreement Payouts UK',
          },
          {
            href: '/guides/how-to-negotiate-a-settlement-agreement/',
            label: 'How to Negotiate Your Settlement Offer',
          },
        ]}
      />
    </>
  )
}
