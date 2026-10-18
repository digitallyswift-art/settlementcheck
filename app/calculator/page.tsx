import type { Metadata } from 'next'
import Script from 'next/script'
import CalculatorClient from './CalculatorClient'
import { resolveDynamicSeoMetadata } from '@/lib/seo/dynamic-metadata'

const STATIC_METADATA: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: {
    absolute: 'Settlement Agreement Calculator UK (2026) | SettlementCheck',
  },
  description:
    'Calculate your UK settlement payout in 60s. Evaluates your offer against April 2026 statutory rates (£751/wk cap) and the £30,000 tax-free exemption. Free.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/calculator/',
  },
  openGraph: {
    title: 'Settlement Agreement Calculator UK (2026) | SettlementCheck',
    description:
      'Calculate your UK settlement payout in 60s. Evaluates your offer against April 2026 statutory rates (£751/wk cap) and the £30,000 tax-free exemption. Free.',
    url: 'https://settlementcheck.co.uk/calculator/',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Settlement Agreement Calculator UK (2026) | SettlementCheck',
    description:
      'Calculate your UK settlement payout in 60s. Evaluates your offer against April 2026 statutory rates (£751/wk cap) and the £30,000 tax-free exemption. Free.',
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return resolveDynamicSeoMetadata('/calculator/', STATIC_METADATA)
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['WebApplication', 'SoftwareApplication'],
      name: 'Free Employee Settlement Agreement Calculator UK (2026 Rates)',
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
        'Interactive UK employee settlement agreement calculation engine. Evaluates employer settlement offers against April 2026 statutory rates, calculating statutory redundancy pay, notice pay, and net take-home after tax.',
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
      reviewedBy: {
        '@type': 'Organization',
        name: 'SettlementCheck Legal Research Desk',
        url: 'https://settlementcheck.co.uk/how-it-works/',
      },
      about: [
        {
          '@type': 'Thing',
          name: 'United Kingdom Employment Law',
          sameAs: 'https://en.wikipedia.org/wiki/United_Kingdom_labour_law',
        },
        {
          '@type': 'Thing',
          name: 'Settlement Agreement',
          sameAs: 'https://en.wikipedia.org/wiki/Settlement_agreement',
        },
      ],
      audience: {
        '@type': 'Audience',
        audienceType: 'UK Employees',
      },
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
        {
          '@type': 'Legislation',
          name: 'Income Tax (Earnings and Pensions) Act 2003, Section 402D',
          url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/402D',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Does GOV.UK or ACAS offer an official settlement agreement calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Neither GOV.UK nor ACAS provides an interactive settlement agreement calculator. The UK Government provides a basic statutory redundancy calculator, and ACAS provides early conciliation codes of practice. SettlementCheck is an independent ACAS-aligned calculator that estimates your complete package, including non-statutory compensation, notice pay, and tax exemptions under 2026 statutory rates.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is a compromise agreement calculator the same as a settlement agreement calculator?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Under Section 111A of the Employment Rights Act 1996, the Enterprise and Regulatory Reform Act officially renamed compromise agreements to settlement agreements in July 2013. The statutory calculation principles (notice pay, statutory redundancy capped at £751 per week, and the £30,000 tax-free threshold under ITEPA 2003 s.403) apply identically to both.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much tax will I pay on my settlement agreement payout?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Under Section 403 of ITEPA 2003, genuine termination payments (such as ex-gratia compensation and statutory redundancy) up to £30,000 are 100% tax-free. Any amount above £30,000 is subject to income tax. Payment in lieu of notice (PILON) is always taxed as ordinary employment income under s.402D.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is an average settlement agreement payout in the UK?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A typical UK employee settlement agreement pays between 1 and 3 months of gross salary as ex-gratia compensation, in addition to contractual notice pay (PILON), accrued holiday pay, and statutory redundancy if applicable. The first £30,000 of compensation is tax-free, and employers typically contribute £500 to £1,500 plus VAT toward your mandatory independent legal advice from an SRA-regulated solicitor.',
          },
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Calculate Settlement Agreement UK',
          item: 'https://settlementcheck.co.uk/calculator/',
        },
      ],
    },
  ],
}

export default function CalculatorPage() {
  return (
    <>
      <h1 className="sr-only">Free Employee Settlement Agreement Calculator UK (2026 Rates)</h1>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <div className="sr-only" aria-hidden="false">
        <h2>Independent Settlement Agreement Calculations for UK Employees</h2>
        <p>
          Neither GOV.UK nor ACAS provides an interactive settlement agreement calculator. SettlementCheck calculates your complete settlement package under April 2026 statutory rates, including the statutory weekly redundancy cap of £751 (SI 2026/310), statutory notice pay, and the £30,000 tax-free exemption under Section 403 of ITEPA 2003.
        </p>
        <h2>Related Settlement Agreement Calculators &amp; Legal Guides</h2>
        <ul>
          <li><a href="/guides/compromise-agreement-calculator-uk/">Compromise Agreement Calculator UK Guide</a></li>
          <li><a href="/settlement-agreement-tax-calculator/">Settlement Agreement Tax Calculator (£30,000 Exemption Rule)</a></li>
          <li><a href="/guides/settlement-agreement-how-much/">Average Settlement Agreement Amount UK (How Much Should You Get?)</a></li>
          <li><a href="/redundancy-calculator/">Statutory Redundancy Pay Calculator (2026 Rates)</a></li>
          <li><a href="/unfair-dismissal-calculator/">Unfair Dismissal Compensation Calculator</a></li>
          <li><a href="/guides/how-to-negotiate-a-settlement-agreement/">How to Negotiate a Higher Settlement Agreement Payout</a></li>
        </ul>
      </div>
      <CalculatorClient />
    </>
  )
}
