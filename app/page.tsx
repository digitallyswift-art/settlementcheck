import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import { getGeneralStatutoryRows } from '@/lib/statutory-rates'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'SettlementCheck™ | UK Settlement Agreement Review & Independent Solicitor Triage',
  description:
    'Independent UK employment settlement agreement review platform. Evaluate your severance against April 2026 statutory rates (£751/wk cap) and connect with SRA-regulated solicitors.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/',
  },
  openGraph: {
    title: 'SettlementCheck™ | UK Settlement Agreement Review & Independent Solicitor Triage',
    description:
      'Independent UK employment settlement agreement review platform. Evaluate your severance against April 2026 statutory rates (£751/wk cap) and connect with SRA-regulated solicitors.',
    url: 'https://settlementcheck.co.uk/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SettlementCheck™ | UK Settlement Agreement Review & Independent Solicitor Triage',
    description:
      'Independent UK employment settlement agreement review platform. Evaluate your severance against April 2026 statutory rates (£751/wk cap) and connect with SRA-regulated solicitors.',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SettlementCheck',
  url: 'https://settlementcheck.co.uk',
  logo: 'https://settlementcheck.co.uk/og-image.png',
  description: 'Independent UK settlement agreement calculator and solicitor introduction service. Not owned by a law firm.',
  parentOrganization: {
    '@type': 'Organization',
    name: 'Digitally Swift',
    url: 'https://digitallyswift.com',
  },
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

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Independent Settlement Agreement Review & Solicitor Triage',
  url: 'https://settlementcheck.co.uk/',
  provider: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  serviceType: 'Employment Settlement Agreement Guidance & Solicitor Introduction',
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'United Kingdom',
  },
  description:
    'Independent evaluation of UK employment settlement and compromise agreements against April 2026 statutory rates (£751/wk cap) and introduction to independent SRA-regulated solicitors.',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
    description: 'Free settlement agreement evaluation for UK employees, connecting you to independent SRA-regulated solicitors with standard employer legal fee contributions upon completion.',
  },
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
        text: 'For a settlement agreement to be legally binding, you must receive independent legal advice under Section 203(3) ERA 1996. To secure this binding waiver, employers standardly provide a capped fee contribution (typically £350 to £500+ plus VAT) directly to your solicitor upon completion of the agreement. For a standard review within this cap, the employer contribution covers the solicitor\'s fee, and your solicitor will confirm all terms before starting work.',
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
        text: 'No. Neither GOV.UK nor ACAS provides an interactive settlement agreement calculator. The government only provides a basic statutory redundancy calculator. SettlementCheck is an independent settlement calculator applying UK statutory rates and ACAS Code of Practice guidance that estimates your complete package, including non-statutory compensation, notice pay, and tax exemptions under ITEPA 2003.',
      },
    },
    {
      '@type': 'Question',
      name: 'How accurate is the calculator?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator gives a general estimate based on UK statutory rates and observed UK commercial negotiation benchmarks. It is not legal advice. Your circumstances may justify substantially more or less, and only a solicitor reviewing your contract and reason for leaving can tell you.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does the solicitor matching service work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The calculator and solicitor matching service are live and free to use today. When you submit your details and verify via SMS OTP, we introduce your enquiry to an independent SRA-regulated employment solicitor from our panel who acts solely in your best interest.',
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
        text: 'Only with the vetted SRA-regulated solicitor you explicitly opt in to be introduced to. Never with employers, recruiters, or unrelated third parties. You can withdraw consent at any point.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <HomeClient
        title={
          <>
            Independent UK Employment<br />
            <em style={{ fontStyle: 'italic', color: '#D9603B' }}>Settlement Agreement Review</em> &amp; Guidance
          </>
        }
        lead="Evaluate your employment settlement offer against April 2026 statutory rates (£751/wk cap), verify tax exemptions under ITEPA 2003, and connect with independent SRA-regulated employment solicitors."
        statutoryRows={statutoryRows}
        pageLinks={[
          { href: '/calculator/', label: 'Settlement Agreement Calculator' },
          { href: '/guides/compromise-agreement-calculator-uk/', label: 'Compromise Agreement Calculator UK' },
          { href: '/guides/settlement-agreement-how-much/', label: 'How Much Should a Settlement Agreement Be?' },
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
