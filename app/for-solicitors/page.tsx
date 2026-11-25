import type { Metadata } from 'next'
import ForSolicitorsClient from './ForSolicitorsClient'
import { SETTLEMENT_CHECK_PUBLISHER } from '@/lib/seo/schema-constants'
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld'

const SOLICITOR_FAQS = [
  {
    q: 'How do employer legal fee contributions work under Section 203(3)?',
    a: 'While Section 203(3) ERA 1996 requires independent legal advice for a valid waiver, UK employers standardly provide a capped commercial contribution (typically £350 to £750+ + VAT, and higher for senior exits) paid directly to your firm upon completion of the agreement. For completed standard Section 203(3) statutory reviews where the employer contribution is £500 + VAT or higher, partner firms covenant not to bill the employee for any shortfall; abortive costs (if an employee declines to sign) or extended negotiation work remain governed by your firm\u2019s engagement terms.',
  },
  {
    q: 'Are introductions strictly exclusive to our firm?',
    a: 'Yes. We do not operate a shared lead broker model. When an employee in your agreed coverage area requests independent legal advice, their complete statutory file is dispatched exclusively to your firm. It is never sent to competing practices.',
  },
  {
    q: 'How are employee contact details and offers verified?',
    a: 'Every employee must pass two-factor OTP verification on their email and phone before requesting a solicitor match. Furthermore, they must enter their salary, tenure, reason for exit, and existing settlement offer into our calculator, ensuring you receive qualified matters rather than speculative enquiries.',
  },
  {
    q: 'What happens if a contact is unreachable?',
    a: 'Every employee contact is verified via two-factor OTP (email and phone). If an introduced employee has invalid contact details or does not respond within 48 hours of initial outreach, we credit that introduction back to your account immediately with zero dispute.',
  },
  {
    q: 'Are there monthly subscription fees or long-term commitments?',
    a: 'No. There are zero software fees, no monthly retainers, and no minimum term contracts. Bespoke commercial terms and territorial allocation are agreed during onboarding, and you can pause or adjust your territory radius at any time.',
  },
  {
    q: 'What are the regulatory requirements to join the panel?',
    a: 'You must be an active law firm regulated by the Solicitors Regulation Authority (SRA) in England & Wales with specialist employment law practitioners and valid professional indemnity insurance.',
  },
]

const webPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Settlement Agreement Leads for Solicitors | SettlementCheck',
  description:
    'Receive exclusive UK settlement agreement enquiries from verified employees. SRA-regulated firms only, zero monthly retainers. Apply for your territory.',
  url: 'https://settlementcheck.co.uk/for-solicitors/',
  inLanguage: 'en-GB',
  publisher: SETTLEMENT_CHECK_PUBLISHER,
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  publisher: SETTLEMENT_CHECK_PUBLISHER,
  mainEntity: SOLICITOR_FAQS.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

export const metadata: Metadata = {
  title: {
    absolute: 'Settlement Agreement Leads for Solicitors | SettlementCheck',
  },
  description:
    'Receive exclusive UK settlement agreement enquiries from verified employees. SRA-regulated firms only, zero monthly retainers. Apply for your territory.',
  alternates: {
    canonical: 'https://settlementcheck.co.uk/for-solicitors/',
  },
  openGraph: {
    title: 'Settlement Agreement Leads for Solicitors | SettlementCheck',
    description:
      'Receive exclusive UK settlement agreement enquiries from verified employees. SRA-regulated firms only, zero monthly retainers. Apply for your territory.',
    url: 'https://settlementcheck.co.uk/for-solicitors/',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  robots: { index: true, follow: true },
}

export default function ForSolicitorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />
      <ForSolicitorsClient />
    </>
  )
}
