import type { Metadata } from 'next'
import ProtectiveAwardClient from './ProtectiveAwardClient'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'Protective Award Calculator UK 2026 | SettlementCheck',
  description:
    'Calculate your protective award under TULRCA 1992 s.189. Up to 90 days gross pay for failure to consult on 20+ redundancies. Free instant UK calculator.',
  alternates: {
    canonical: '/protective-award-calculator/',
  },
  openGraph: {
    title: 'Protective Award Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate your protective award under TULRCA 1992 s.189. Up to 90 days gross pay for failure to consult on 20+ redundancies. Free instant UK calculator.',
    url: '/protective-award-calculator/',
    type: 'website',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Protective Award Calculator UK 2026 | SettlementCheck',
    description:
      'Calculate your protective award under TULRCA 1992 s.189. Up to 90 days gross pay for failure to consult on 20+ redundancies. Free instant UK calculator.',
  },
}

const FAQS = [
  {
    q: 'What is the maximum protective award an Employment Tribunal can make in 2026?',
    a: 'An Employment Tribunal can award up to 90 days of gross pay per employee under Section 189 of TULRCA 1992. The tribunal assesses the seriousness of the employer’s failure to consult before deciding the number of days.',
  },
  {
    q: 'How much will I receive if my employer is insolvent or enters administration?',
    a: 'If your employer is insolvent, you claim from the government Insolvency Service. By law, payments from the National Insurance Fund are capped at 8 weeks of pay. In 2026, the statutory weekly cap is £751 in Great Britain (£783 in Northern Ireland), making the maximum government payout £6,008 in Great Britain (£6,264 in Northern Ireland).',
  },
  {
    q: 'Do I have to belong to a trade union to claim a protective award?',
    a: 'No. If a recognised trade union exists, they must submit the claim. If there is no recognised union, elected employee representatives can claim. If your employer failed to organise elections for representatives, affected employees can submit individual or group claims directly to the tribunal.',
  },
  {
    q: 'What is the strict time limit for claiming a protective award?',
    a: 'You must initiate ACAS Early Conciliation within 3 months minus 1 day from the date your dismissal took effect. If you miss this statutory deadline, the Employment Tribunal will almost certainly reject your claim.',
  },
  {
    q: 'Can I claim a protective award if I sign a settlement agreement?',
    a: 'No. Standard settlement agreements include an express waiver of all statutory claims, including claims under Section 189 of TULRCA 1992. However, knowing your potential protective award entitlement gives you vital leverage to negotiate a higher compensation payment before signing.',
  },
  {
    q: 'Is a protective award taxable in the UK?',
    a: 'Yes, but it qualifies for the £30,000 tax exemption under Section 403 of ITEPA 2003 as compensation for loss of employment. If your total termination compensation (including redundancy and ex-gratia payments) is under £30,000, your protective award is 100% tax-free with zero employee National Insurance deductions.',
  },
]

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': ['WebApplication', 'SoftwareApplication'],
  name: 'UK Protective Award Calculator',
  url: 'https://settlementcheck.co.uk/protective-award-calculator/',
  applicationCategory: ['BusinessApplication', 'FinanceApplication'],
  operatingSystem: 'All modern web browsers',
  browserRequirements: 'Requires JavaScript. Requires HTML5.',
  softwareVersion: '2026.1 (TULRCA 1992 s.189)',
  isAccessibleForFree: true,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
    availability: 'https://schema.org/InStock',
  },
  description:
    'Free UK protective award calculator. Estimates up to 90 days gross pay compensation under TULRCA 1992 s.189 for collective redundancy consultation failures. Compares solvent employer uncapped liability vs Insolvency Service 8-week statutory caps (£751/week).',
  featureList: [
    'Instant protective award calculation up to 90 days gross pay',
    'Solvent employer uncapped liability vs Insolvency Service 8-week cap comparison',
    'Statutory weekly cap rates for Great Britain (£751) and Northern Ireland (£783)',
    'Tax treatment breakdown under Section 403 of ITEPA 2003 (£30,000 exemption)',
    'ACAS 3-month limitation window advisory and solicitor matching pathways',
  ],
  screenshot: 'https://settlementcheck.co.uk/og-image.png',
  creator: {
    '@type': 'Organization',
    name: 'SettlementCheck',
    url: 'https://settlementcheck.co.uk',
  },
  isBasedOn: [
    {
      '@type': 'Legislation',
      name: 'Trade Union and Labour Relations (Consolidation) Act 1992, Section 188',
      url: 'https://www.legislation.gov.uk/ukpga/1992/52/section/188',
    },
    {
      '@type': 'Legislation',
      name: 'Trade Union and Labour Relations (Consolidation) Act 1992, Section 189',
      url: 'https://www.legislation.gov.uk/ukpga/1992/52/section/189',
    },
    {
      '@type': 'Legislation',
      name: 'Employment Rights Act 1996, Section 184',
      url: 'https://www.legislation.gov.uk/ukpga/1996/18/section/184',
    },
    {
      '@type': 'Legislation',
      name: 'Income Tax (Earnings and Pensions) Act 2003, Section 403',
      url: 'https://www.legislation.gov.uk/ukpga/2003/1/section/403',
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://settlementcheck.co.uk/' },
    { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://settlementcheck.co.uk/guides/' },
    { '@type': 'ListItem', position: 3, name: 'Protective Award', item: 'https://settlementcheck.co.uk/guides/protective-award/' },
    { '@type': 'ListItem', position: 4, name: 'Protective Award Calculator', item: 'https://settlementcheck.co.uk/protective-award-calculator/' },
  ],
}

export default function ProtectiveAwardCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ProtectiveAwardClient />
    </>
  )
}
