import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Settlement Agreement Calculator UK | Is Your Offer Fair? | SettlementCheck',
    template: '%s | SettlementCheck',
  },
  description:
    'Free settlement agreement calculator. Find out if your offer is fair in 60 seconds. Get matched with a vetted employment solicitor — your employer pays the fees.',
  openGraph: {
    siteName: 'SettlementCheck',
    locale: 'en_GB',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>{children}</body>
    </html>
  )
}
