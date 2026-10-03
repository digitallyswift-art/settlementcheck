import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { getGeneralStatutoryRows } from '@/lib/statutory-rates'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Settlement Agreement Calculator UK 2026 | SettlementCheck',
  description:
    'Calculate if your settlement agreement offer is fair in 60 seconds. Based on April 2026 UK statutory rates. Free calculator with zero email required.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Settlement Agreement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate if your settlement offer is fair in 60 seconds. See your statutory floor and true take-home pay after tax under April 2026 UK rates. Free, no email.',
    url: '/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SettlementCheck',
  url: 'https://settlementcheck.co.uk',
  logo: 'https://settlementcheck.co.uk/og-image.png',
  description: 'Independent UK settlement agreement calculator and solicitor introduction service. Not owned by a law firm.',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'United Kingdom',
  },
  knowsAbout: [
    'UK Employment Law',
    'Settlement Agreements',
    'Redundancy Pay',
    'Unfair Dismissal',
    'Constructive Dismissal',
    'Employment Rights Act 1996',
    'ITEPA 2003 Section 403',
  ],
}

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SettlementCheck',
  url: 'https://settlementcheck.co.uk',
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': ['WebApplication', 'SoftwareApplication'],
  name: 'Employment Settlement Agreement Calculator',
  url: 'https://settlementcheck.co.uk/',
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
  description: 'Free UK employment settlement agreement calculator. Calculates estimated net take-home pay after tax, splitting PILON from the £30,000 exemption under ITEPA 2003. No email required. Based on April 2026 statutory rates (£751 weekly cap).',
  featureList: [
    'Instant settlement agreement fairness verdict using April 2026 statutory rates',
    'Calculation of statutory redundancy and basic awards capped at £751 per week',
    'Automatic separation of taxable PILON and tax-free termination payments up to £30,000',
    'Unfair dismissal and constructive dismissal compensatory award estimates',
    'Free independent solicitor matching with employer fee contributions',
  ],
  screenshot: 'https://settlementcheck.co.uk/og-image.png',
  creator: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  about: [
    { '@type': 'Thing', name: 'Employment Law' },
    { '@type': 'Thing', name: 'Settlement Agreements' },
    { '@type': 'Thing', name: 'Redundancy Pay' },
    { '@type': 'Thing', name: 'Unfair Dismissal' },
  ],
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 203',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/203',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 162',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/162',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
  ],
}

// FAQ schema aligned exactly to FaqAccordion DEFAULT_FAQS (7 questions)
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Does it cost me anything?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Your employer is required by UK law to cover your legal fees for this process, typically £350 to £750. You pay nothing. This means you can choose a specialist who will genuinely advise you, not just whoever is cheapest.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I legally need a solicitor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Under Section 203 of the Employment Rights Act 1996, a settlement agreement is only legally binding if you have received independent legal advice from a qualified, insured solicitor. You cannot waive your rights without it.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much tax will I pay on my settlement agreement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'It depends on which part of your payment is being taxed. Statutory redundancy pay and other termination payments up to £30,000 are tax-free under ITEPA 2003 s.403. Payment in lieu of notice (PILON) is always fully taxable as earnings under s.402D, regardless of what it is called in your agreement. The calculator separates these two elements and shows your estimated net take-home figure after tax.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should an employee settlement agreement be?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A typical UK settlement agreement pays between one and three months of gross salary, plus notice pay and accrued holiday. Your total package should also include statutory redundancy pay, capped at £751 per week, with the first £30,000 paid tax-free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does GOV.UK or ACAS offer an official settlement calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Neither GOV.UK nor ACAS provides an interactive settlement agreement calculator. The government only provides a basic statutory redundancy calculator. SettlementCheck is an independent tool that calculates your full estimated package, including non-statutory compensation, notice pay, and tax exemptions under ITEPA 2003.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is the calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator gives a general estimate based on UK statutory rates and typical UK settlement market data. It is not legal advice. Your circumstances may justify substantially more or less, and only a solicitor reviewing your contract and reason for leaving can tell you.',
      },
    },
    {
      '@type': 'Question',
      name: 'When will the solicitor matching service be available?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator is live and free to use today. The solicitor matching service is launching shortly. When live, panel solicitors will commit to responding within 24 hours of an introduction, often the same business day.',
      },
    },
    {
      '@type': 'Question',
      name: 'What if I want to negotiate a higher amount?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many employees do successfully negotiate more once a solicitor reviews their circumstances. A specialist will assess whether factors like length of service, discrimination, whistleblowing, or contract breaches justify a higher offer.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my information shared?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only with vetted SRA-regulated solicitors you opt in to be introduced to once matching launches. Never with employers, recruiters, or third parties. You can withdraw consent at any point.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is your calculator independent when others are not?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most settlement calculators are built by law firms. The goal of those calculators is to capture your details so that firm can take on your case. Our calculator is run by an independent platform with no firm to promote. The estimate you get reflects your actual situation, not what a firm wants you to believe.',
      },
    },
  ],
}

export default function HomePage() {
  const statutoryRows = getGeneralStatutoryRows()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomeClient
        statutoryRows={statutoryRows}
        lead="Check whether your employer's employment settlement offer sits within the typical UK range before you reply. Our independent calculator checks statutory redundancy, notice pay, and tax-free compensation in 60 seconds. Whether your paperwork says employment settlement agreement or compromise agreement, find out where you stand for free."
        pageLinks={[
          { href: '/guides/settlement-agreement-how-much/', label: 'How Much Should a Settlement Agreement Be?' },
          { href: '/calculator/', label: 'Settlement Agreement Calculator' },
          { href: '/redundancy-calculator/', label: 'Redundancy Pay Calculator' },
          { href: '/unfair-dismissal-calculator/', label: 'Unfair Dismissal Calculator' },
          { href: '/constructive-dismissal-calculator/', label: 'Constructive Dismissal Calculator' },
          { href: '/guides/what-is-a-fair-settlement-agreement/', label: 'What Is a Fair Settlement Agreement?' },
          { href: '/guides/how-to-negotiate-a-settlement-agreement/', label: 'How to Negotiate a Settlement Agreement' },
          { href: '/guides/settlement-agreement-acas-calculations/', label: 'ACAS-Based Settlement Calculations' },
          { href: '/guides/employer-recommended-solicitor/', label: 'Using Employer Recommended Solicitor' },
          { href: '/guides/pressured-to-sign/', label: 'Pressured to Sign Quickly Rights' },
        ]}
      />
    </>
  )
}
