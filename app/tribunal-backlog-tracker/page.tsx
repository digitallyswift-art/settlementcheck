import type { Metadata } from 'next'
import Script from 'next/script'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import TribunalBacklogClient from './TribunalBacklogClient'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

export const metadata: Metadata = {
  metadataBase: new URL('https://settlementcheck.co.uk'),
  title: 'UK Employment Tribunal Backlog Tracker & Regional Wait Times (2026) | SettlementCheck',
  description:
    'Track UK Employment Tribunal backlogs and hearing delays by region. Explore MoJ statistics on 50,000+ open single claims, employer defence costs, and settlement negotiation dynamics.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/tribunal-backlog-tracker/',
  },
  openGraph: {
    title: 'UK Employment Tribunal Backlog Tracker & Regional Wait Times (2026) | SettlementCheck',
    description:
      'Interactive tracker of 50,000+ open UK Employment Tribunal single claims. See regional listing wait times (up to 540 days in London) and employer legal cost exposure.',
    url: 'https://settlementcheck.co.uk/tribunal-backlog-tracker/',
    type: 'article',
    locale: 'en_GB',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UK Employment Tribunal Backlog Tracker & Regional Wait Times (2026)',
    description:
      'Official MoJ tribunal wait times: London 540 days, Watford 490 days, Midlands 420 days. Discover why delays increase employer settlement incentives.',
  },
}

export default function TribunalBacklogTrackerPage() {
  const jsonLdData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://settlementcheck.co.uk/tribunal-backlog-tracker/#webpage',
        url: 'https://settlementcheck.co.uk/tribunal-backlog-tracker/',
        name: 'UK Employment Tribunal Backlog Tracker & Regional Wait Times',
        description:
          'Interactive intelligence tracker analyzing Ministry of Justice Employment Tribunal backlogs, regional wait times to preliminary and merits hearings, and employer legal cost exposure.',
        breadcrumb: {
          '@id': 'https://settlementcheck.co.uk/tribunal-backlog-tracker/#breadcrumb',
        },
        inLanguage: 'en-GB',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': 'https://settlementcheck.co.uk/tribunal-backlog-tracker/#breadcrumb',
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
            name: 'Tribunal Backlog Tracker',
            item: 'https://settlementcheck.co.uk/tribunal-backlog-tracker/',
          },
        ],
      },
      {
        '@type': 'Dataset',
        '@id': 'https://settlementcheck.co.uk/tribunal-backlog-tracker/#dataset',
        name: 'UK Employment Tribunal Regional Hearing Delays and Case Backlog Statistics',
        description:
          'Quarterly dataset monitoring open single claims, listing wait times to preliminary and merits hearings across Great Britain hearing centres (London Central, London South, Watford, Midlands West, Manchester, Leeds, Bristol, Newcastle, Wales, and Scotland), including estimated employer defence cost exposures.',
        url: 'https://settlementcheck.co.uk/tribunal-backlog-tracker/',
        license: 'https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
        creator: {
          '@type': 'Organization',
          name: 'SettlementCheck',
          url: 'https://settlementcheck.co.uk/',
        },
        temporalCoverage: '2025/2026',
        spatialCoverage: {
          '@type': 'Place',
          name: 'Great Britain (England, Wales, Scotland)',
        },
        variableMeasured: [
          'Active Open Single Employment Tribunal Claims',
          'Average Days to Preliminary Hearing by Tribunal Hearing Centre',
          'Average Days to Final Merits Hearing by Tribunal Hearing Centre',
          'Estimated Employer Legal Defence Costs to Final Merits Hearing',
          'Settlement Negotiation Strategic Pressure Rating',
        ],
      },
    ],
  }

  return (
    <>
      <Script
        id="tribunal-backlog-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(jsonLdData) }}
      />
      <Nav />
      <main className="min-h-screen bg-paper text-ink pt-8 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <TribunalBacklogClient />
        </div>
      </main>
      <Footer />
    </>
  )
}
