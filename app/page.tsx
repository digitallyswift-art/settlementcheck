import type { Metadata } from 'next'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Settlement Agreement Calculator UK | £751 Cap | Instant Result | SettlementCheck',
  description: 'Free UK settlement agreement calculator. No email required. Instant result in 60 seconds. Based on 2025/26 statutory rates (£751 weekly cap). Your employer pays the legal fees.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/',
  },
  openGraph: {
    title: 'Settlement Agreement Calculator UK | Is Your Offer Fair?',
    description: 'Find out if your settlement offer is fair in 60 seconds. Independent calculator, not owned by a law firm. Your employer pays the legal fees.',
    url: 'https://settlementcheck.co.uk/',
    type: 'website',
  },
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

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is a settlement agreement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A settlement agreement (formerly a compromise agreement) is a legally binding contract between an employer and employee that settles any employment claims the employee might have. In exchange for signing, the employee receives a financial payment and gives up the right to bring most tribunal claims.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my settlement offer fair?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A fair settlement typically covers your statutory redundancy pay or basic award, payment in lieu of notice, and an ex-gratia amount reflecting the strength of any unfair dismissal or discrimination claim. Use our calculator to see how your offer compares to the typical UK range based on your specific circumstances.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much is the tax-free allowance on a settlement agreement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under ITEPA 2003 section 403, genuine termination payments (including statutory redundancy pay and basic awards) benefit from a £30,000 tax-free threshold. Payment in lieu of notice (PILON) is always fully taxable under section 402D regardless of how it is structured.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need a solicitor to sign a settlement agreement?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. A settlement agreement is only legally binding if you have received independent legal advice from a qualified adviser. Your employer is required to make a contribution toward those fees, typically £350 to £750.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the weekly pay cap for redundancy in 2025/26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'From 6 April 2025, the weekly pay cap for statutory redundancy pay calculations is £751 in England, Scotland and Wales (ERA 1996 s.227), and £783 in Northern Ireland. This cap applies to both statutory redundancy pay and the basic award for unfair dismissal.',
      },
    },
  ],
}


export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient />
    </>
  )
}
