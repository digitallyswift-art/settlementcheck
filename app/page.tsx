import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Settlement Agreement Calculator UK | Is Your Offer Fair? | SettlementCheck',
  description:
    'Free settlement agreement calculator. Find out if your offer is fair in 60 seconds. Get matched with a vetted employment solicitor — your employer pays the fees.',
}

export default function HomePage() {
  return <HomeClient />
}
