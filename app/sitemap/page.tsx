import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'HTML Sitemap | SettlementCheck',
  description: 'Complete directory of UK settlement agreement calculators, legal advice guides, redundancy tools, and resources on SettlementCheck.co.uk.',
  alternates: { canonical: 'https://settlementcheck.co.uk/sitemap/' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'HTML Sitemap | SettlementCheck',
    description: 'Explore all calculators, statutory rights guides, and legal resources on SettlementCheck.',
    url: 'https://settlementcheck.co.uk/sitemap/',
    type: 'website',
  },
}

interface SitemapCategory {
  title: string
  description: string
  items: {
    title: string
    href: string
    description?: string
    badge?: string
  }[]
}

const sitemapData: SitemapCategory[] = [
  {
    title: 'Core Tools & Calculators',
    description: 'Free, confidential compensation estimators tailored to UK employment law regulations.',
    items: [
      {
        title: 'Settlement Agreement Calculator',
        href: '/calculator/',
        description: 'Instant estimation of your settlement agreement value based on salary, service length, and statutory formula.',
        badge: 'Popular',
      },
      {
        title: 'Redundancy Pay Calculator',
        href: '/redundancy-calculator/',
        description: 'Calculate statutory redundancy pay and enhanced settlement compensation entitlements for 2026.',
      },
      {
        title: 'Unfair Dismissal Calculator',
        href: '/unfair-dismissal-calculator/',
        description: 'Estimate compensatory and basic awards under UK Employment Rights Act 1996 guidelines.',
      },
      {
        title: 'Constructive Dismissal Calculator',
        href: '/constructive-dismissal-calculator/',
        description: 'Assess claim strength and potential payout where employer breach forced your resignation.',
      },
    ],
  },
  {
    title: 'Services & Advisory',
    description: 'How we match employees with vetted SRA-regulated employment solicitors.',
    items: [
      {
        title: 'Home',
        href: '/',
        description: 'Free settlement agreement review and solicitor matching service.',
      },
      {
        title: 'How It Works',
        href: '/how-it-works/',
        description: 'Learn how employer-funded independent legal advice works in three simple steps.',
      },
      {
        title: 'Get Matched with a Solicitor',
        href: '/get-matched/',
        description: 'Connect with a specialist SRA-regulated employment solicitor within 24 hours.',
      },
      {
        title: 'For Solicitors / Law Firms',
        href: '/for-solicitors/',
        description: 'Join our independent panel of verified UK employment law specialists.',
      },
    ],
  },
  {
    title: 'Legal Guides & Knowledge Hub',
    description: 'Practical, lawyer-reviewed advice on negotiating settlements, ACAS rules, and statutory rights.',
    items: [
      {
        title: 'All Legal Guides',
        href: '/guides/',
        description: 'Browse all in-depth employment law and settlement agreement articles.',
      },
      {
        title: 'How to Negotiate a Settlement Agreement',
        href: '/guides/how-to-negotiate-a-settlement-agreement/',
        description: 'Strategies for negotiating higher financial payouts and favourable departure terms.',
      },
      {
        title: 'Average Settlement Agreement Payout in the UK',
        href: '/guides/average-settlement-agreement-payout-uk/',
        description: 'Realistic benchmarks, compensation brackets, and factors that increase offer size.',
      },
      {
        title: 'Constructive Dismissal Settlement Agreements',
        href: '/guides/constructive-dismissal-settlement-agreements/',
        description: 'Legal considerations when negotiating departure following fundamental employer breaches.',
      },
      {
        title: 'Tax-Free £30,000 Settlement Exemption',
        href: '/guides/tax-free-settlement-30000/',
        description: 'HMRC rules governing tax exemptions on termination payments and legal fees.',
      },
      {
        title: 'PILON (Pay in Lieu of Notice) Tax Treatment 2026',
        href: '/guides/pilon-tax-treatment-2026/',
        description: 'How notice pay, PENP calculations, and national insurance are handled on settlements.',
      },
      {
        title: 'Statutory Redundancy Pay Cap (2026 Update)',
        href: '/guides/redundancy-pay-cap-2026/',
        description: 'The latest statutory weekly pay caps and statutory maximum entitlements.',
      },
      {
        title: 'Settlement Agreement ACAS Calculations',
        href: '/guides/settlement-agreement-acas-calculations/',
        description: 'Understanding early conciliation benchmarks and ACAS Code of Practice uplift.',
      },
      {
        title: 'Do I Have to Use My Employer’s Recommended Solicitor?',
        href: '/guides/employer-recommended-solicitor/',
        description: 'Why you have the legal right to choose independent legal representation.',
      },
      {
        title: 'Pressured to Sign Quickly? Your 10-Day Right',
        href: '/guides/pressured-to-sign/',
        description: 'ACAS guidance on reasonable cooling-off periods and unlawful pressure tactics.',
      },
      {
        title: 'What Happens If You Do Not Sign?',
        href: '/guides/what-happens-if-you-do-not-sign/',
        description: 'Understanding your alternatives: negotiation, disciplinary procedures, or tribunal.',
      },
      {
        title: 'Is My Settlement Offer Fair?',
        href: '/guides/is-my-settlement-offer-fair/',
        description: 'Key questions and calculation checklist to evaluate your employer’s initial proposal.',
      },
      {
        title: 'What Is a Fair Settlement Agreement?',
        href: '/guides/what-is-a-fair-settlement-agreement/',
        description: 'Detailed analysis of non-financial clauses, reference terms, and compensation packages.',
      },
      {
        title: 'NHS Settlement Agreements & Section 203',
        href: '/guides/nhs-settlement-agreements/',
        description: 'Specific rules, Mutually Agreed Resignation Schemes (MARS), and treasury caps in the NHS.',
      },
      {
        title: 'Settlement Agreement vs Employment Tribunal',
        href: '/guides/settlement-agreement-vs-tribunal-claim/',
        description: 'Cost, speed, confidentiality, and stress comparison between settlement and litigation.',
      },
      {
        title: 'Protective Awards & Collective Consultation Failure',
        href: '/guides/protective-award/',
        description: 'How to claim up to 90 days gross pay when 20+ redundancies occur without consultation.',
      },
      {
        title: 'Fair Work Agency & Workers Rights Overview',
        href: '/guides/fair-work-agency/',
        description: 'New enforcement bodies and statutory employee protections under UK labour law.',
      },
    ],
  },
  {
    title: 'Legal, Compliance & Machine Sitemaps',
    description: 'Regulatory disclosures, terms of service, and search engine directives.',
    items: [
      {
        title: 'Privacy Policy',
        href: '/privacy/',
        description: 'UK GDPR data compliance, collection standards, and data retention policies.',
      },
      {
        title: 'Terms of Use',
        href: '/terms/',
        description: 'Conditions of use for SettlementCheck.co.uk and our introduction platform.',
      },
      {
        title: 'Legal Disclaimer',
        href: '/disclaimer/',
        description: 'Important details on our introduction status and non-solicitor regulatory distinction.',
      },
      {
        title: 'Raw XML Sitemap (For Search Engines)',
        href: '/sitemap.xml',
        description: 'Machine-readable schema index for Googlebot, Bingbot, and search crawlers.',
        badge: 'XML',
      },
    ],
  },
]

export default function SitemapPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper min-h-screen">
        {/* Header / Hero */}
        <section className="pt-16 pb-12 border-b border-rule bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-2 text-xs font-medium text-ink/60 uppercase tracking-wider mb-3">
              <Link href="/" className="hover:text-coral transition-colors">Home</Link>
              <span>/</span>
              <span className="text-ink">Sitemap</span>
            </div>
            <h1 className="sc-h1 mb-4">Website Sitemap &amp; Directory</h1>
            <p className="sc-lead max-w-3xl">
              An overview of all calculators, compensation tools, statutory rights guides, and legal resources available on SettlementCheck.co.uk.
            </p>
          </div>
        </section>

        {/* Directory Content */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-16">
            {sitemapData.map((category) => (
              <div key={category.title} className="space-y-6">
                <div className="border-b border-rule pb-3">
                  <h2 className="text-2xl font-serif font-semibold text-ink tracking-tight">{category.title}</h2>
                  <p className="text-sm text-ink/70 mt-1">{category.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group bg-white rounded-xl border border-rule p-5 hover:border-coral/50 hover:shadow-sm transition-all duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <h3 className="text-[16px] font-semibold text-ink group-hover:text-coral transition-colors">
                            {item.title}
                          </h3>
                          {item.badge && (
                            <span className="text-[11px] font-medium bg-coral/10 text-coral px-2 py-0.5 rounded-full whitespace-nowrap">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p className="text-[13px] text-ink/70 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="mt-3 text-[12px] font-medium text-coral flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>Visit page</span>
                        <span>&rarr;</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="bg-ink text-white py-14 border-t border-rule">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-serif font-medium mb-3">Received a Settlement Agreement?</h2>
            <p className="text-white/70 text-sm mb-6 max-w-xl mx-auto">
              Check your offer in under 60 seconds with our free statutory calculator and get matched with an independent SRA-regulated solicitor. Your employer pays the legal fees.
            </p>
            <Link href="/calculator/" className="btn-accent inline-block">
              Calculate Your Settlement &rarr;
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
