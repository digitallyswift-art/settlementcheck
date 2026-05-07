import type { Metadata } from 'next'
import HomeClient from '../HomeClient'

export const metadata: Metadata = {
  title: 'Unfair Dismissal Settlement Calculator | SettlementCheck',
  description: 'Dismissed unfairly? Calculate your potential basic award and typical tribunal settlement range. Free, independent estimate in 60 seconds.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/unfair-dismissal-calculator',
  },
  openGraph: {
    title: 'Unfair Dismissal Settlement Calculator | SettlementCheck',
    description: 'Dismissed unfairly? Calculate your potential basic award and typical tribunal settlement range. Free, independent estimate in 60 seconds.',
    url: 'https://settlementcheck.co.uk/unfair-dismissal-calculator',
    type: 'website',
  },
}

export default function UnfairDismissalCalculatorPage() {
  return (
    <HomeClient
      title={<>Calculate your <em style={{ fontStyle: 'italic', color: '#D9603B' }}>unfair dismissal</em> settlement</>}
      lead="If you have been dismissed unfairly, you have the right to challenge it. Find out your statutory basic award and typical settlement range in 60 seconds. Get an honest estimate, then match with an employment specialist to discuss your case."
    />
  )
}
