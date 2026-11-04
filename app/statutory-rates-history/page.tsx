import type { Metadata } from 'next'
import Script from 'next/script'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import StatutoryRatesHistoryClient from './StatutoryRatesHistoryClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'UK Statutory Employment Rates & Compensation Caps History (2000-2026) | SettlementCheck',
  description:
    'Complete historical archive of UK statutory redundancy pay caps, unfair dismissal compensation limits, Vento bands, and the £30,000 tax exemption from 2000 to 2026.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/statutory-rates-history/',
  },
  openGraph: {
    title: 'UK Statutory Employment Rates & Compensation Caps History (2000-2026) | SettlementCheck',
    description:
      'Historical dataset of ERA 1996 s.162 redundancy weekly caps (£230 to £751), unfair dismissal limits (£50,000 to £123,543), and Vento bands from 2000 to 2026.',
    url: 'https://settlementcheck.co.uk/statutory-rates-history/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Statutory Employment Rates & Compensation Caps History (2000-2026)',
    description:
      'Explore UK employment tribunal statutory caps, redundancy weekly limits, and Vento band history from 2000 to 2026.',
  },
}

export default function StatutoryRatesHistoryPage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://settlementcheck.co.uk/statutory-rates-history/#webpage',
        url: 'https://settlementcheck.co.uk/statutory-rates-history/',
        name: 'UK Statutory Employment Rates & Compensation Caps History (2000-2026)',
        description:
          'Authoritative historical archive of statutory redundancy weekly pay caps, unfair dismissal compensatory awards, Vento injury to feelings bands, and the frozen £30,000 tax exemption.',
        breadcrumb: {
          '@id': 'https://settlementcheck.co.uk/statutory-rates-history/#breadcrumb',
        },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://settlementcheck.co.uk/statutory-rates-history/#breadcrumb',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://settlementcheck.co.uk/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Calculators',
            item: 'https://settlementcheck.co.uk/calculators/',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Statutory Rates History',
            item: 'https://settlementcheck.co.uk/statutory-rates-history/',
          },
        ],
      },
      {
        '@type': 'Dataset',
        '@id': 'https://settlementcheck.co.uk/statutory-rates-history/#dataset',
        name: 'UK Employment Statutory Limits and Compensation Ceilings Archive (2000-2026)',
        description:
          'Historical time series dataset tracking statutory redundancy pay weekly caps under ERA 1996 s.162, unfair dismissal compensatory limits under ERA 1996 s.124, maximum basic awards, Vento bands for injury to feelings, and ITEPA 2003 s.403 termination payment tax exemptions in Great Britain.',
        url: 'https://settlementcheck.co.uk/statutory-rates-history/',
        license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
        creator: {
          '@type': 'Organization',
          name: 'SettlementCheck',
          url: 'https://settlementcheck.co.uk/',
        },
        temporalCoverage: '2000-04-06/2027-04-05',
        spatialCoverage: {
          '@type': 'Place',
          name: 'Great Britain (England, Wales, Scotland)',
        },
        variableMeasured: [
          'Statutory Redundancy Pay Weekly Cap (ERA 1996 s.162)',
          'Maximum Statutory Redundancy Basic Award (30 weeks)',
          'Unfair Dismissal Compensatory Award Statutory Cap (ERA 1996 s.124)',
          'Vento Injury to Feelings Guidelines (Lower, Middle, Upper Bands)',
          'Termination Payment Tax-Free Threshold (ITEPA 2003 s.403)',
        ],
      },
    ],
  }

  return (
    <>
      <Script
        id="statutory-rates-history-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLdData) }}
      />
      <Nav />
      <main className="min-h-screen bg-paper text-ink pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <StatutoryRatesHistoryClient />
        </div>
      </main>
      <Footer />
    </>
  )
}
