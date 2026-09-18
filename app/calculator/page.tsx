import type { Metadata } from 'next'
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

export default function CalculatorPage() {
  return <CalculatorClient />
}
