import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Settlement Agreement Calculator UK 2026 | SettlementCheck',
  description: 'Free settlement calculator. Is your offer fair? Uses 2026 rates (£751 cap). Redundancy, PILON, tax breakdown. No email. Instant result.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/',
  },
  openGraph: {
    title: 'Settlement Agreement Calculator UK 2026 | SettlementCheck',
    description: 'Most opening offers have room to move. Get your free estimate in under two minutes and find out where yours stands.',
    url: 'https://settlementcheck.co.uk/',
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
  description: 'Independent UK settlement agreement calculator and solicitor introduction service. Not owned by a law firm.',
}

const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'SettlementCheck',
  url: 'https://settlementcheck.co.uk',
}

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Settlement Agreement Calculator',
  url: 'https://settlementcheck.co.uk/',
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
  description: 'Free UK settlement agreement calculator. No email required. Instant result in 60 seconds. Based on 2025/26 statutory rates.',
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

// Static statutory rates table data — passed as prop so table renders server-side (not in client bundle)
const STATUTORY_ROWS = [
  { label: 'Weekly pay cap (England, Scotland, Wales)', y2425: '£643',     y2526: '£751'     },
  { label: 'Weekly pay cap (Northern Ireland)',          y2425: '£669',     y2526: '£783'     },
  { label: 'Maximum statutory redundancy pay',           y2425: '£19,290',  y2526: '£22,530'  },
  { label: 'Tax-free termination payment limit',         y2425: '£30,000',  y2526: '£30,000'  },
  { label: 'Maximum qualifying service years',           y2425: '20 years', y2526: '20 years' },
  { label: 'Maximum statutory notice period',            y2425: '12 weeks', y2526: '12 weeks' },
]


export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomeClient statutoryRows={STATUTORY_ROWS} />
    </>
  )
}
