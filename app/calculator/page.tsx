import type { Metadata } from 'next'
import Script from 'next/script'
import CalculatorClient from './CalculatorClient'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Free Settlement Agreement Calculator UK 2026 | SettlementCheck',
  description:
    'Calculate your employment settlement agreement entitlement in 60 seconds. Instant calculation based on April 2026 UK statutory rates. Free, no email required.',
  alternates: {
    canonical: '/calculator/',
  },
  openGraph: {
    title: 'Free Settlement Agreement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate your employment settlement agreement entitlement in 60 seconds. Instant calculation based on April 2026 UK statutory rates. Free, no email required.',
    url: '/calculator/',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Settlement Agreement Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate your employment settlement agreement entitlement in 60 seconds. Free, no email required.',
  },
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'Settlement Agreement Calculator UK 2026',
      url: 'https://settlementcheck.co.uk/calculator/',
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
        'Interactive UK settlement agreement calculator. Evaluates employer settlement offers against April 2026 statutory rates, calculating redundancy pay, notice pay, and net take-home after tax.',
      featureList: [
        'Interactive 7-step evaluation of UK employment settlement offers',
        'April 2026 statutory rate baseline (£751 weekly pay cap)',
        'Net take-home pay calculation separating PILON from the £30,000 exemption',
        'Immediate fairness verdict without requiring an email address',
        'Optional matching with independent SRA-regulated employment solicitors',
      ],
      screenshot: 'https://settlementcheck.co.uk/og-image.png',
      creator: {
        '@type': 'Organization',
        name: 'SettlementCheck',
        url: 'https://settlementcheck.co.uk',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Settlement Agreement Calculator',
          item: 'https://settlementcheck.co.uk/calculator/',
        },
      ],
    },
  ],
}

export default function CalculatorPage() {
  return (
    <>
      <Script
        id="calculator-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <CalculatorClient />
    </>
  )
}
