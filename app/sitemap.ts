import type { MetadataRoute } from 'next'
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://settlementcheck.co.uk'
  const baselineDate = new Date('2026-04-06T00:00:00.000Z') // April 2026 Statutory Baseline

  // Resolve real last-actuated timestamps per URL from SeoActuatorService
  const lastModByUrl = new Map<string, Date>()
  try {
    const packages = await SeoActuatorService.getAllPackages()
    for (const pkg of packages) {
      if (
        (pkg.status === 'APPLIED' || pkg.status === 'CANARY' || pkg.status === 'PERMANENT') &&
        pkg.targetCanonicalUrl &&
        pkg.appliedAt
      ) {
        const appliedDate = new Date(pkg.appliedAt)
        if (!isNaN(appliedDate.getTime())) {
          const existing = lastModByUrl.get(pkg.targetCanonicalUrl)
          if (!existing || appliedDate > existing) {
            lastModByUrl.set(pkg.targetCanonicalUrl, appliedDate)
          }
        }
      }
    }
  } catch {
    // Fallback to baselineDate if actuator lookup fails
  }

  const getLastMod = (url: string): Date => lastModByUrl.get(url) || baselineDate

  return [
    // Tier 1: Conversion pillars
    { url: `${base}/`,                                                lastModified: getLastMod(`${base}/`), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculators/`,                                    lastModified: getLastMod(`${base}/calculators/`), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculator/`,                                     lastModified: getLastMod(`${base}/calculator/`), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/settlement-agreement-review/`,                    lastModified: getLastMod(`${base}/settlement-agreement-review/`), changeFrequency: 'weekly',  priority: 1.0 },

    // Tier 2: Programmatic SEO landing pages
    { url: `${base}/redundancy-calculator/`,                          lastModified: getLastMod(`${base}/redundancy-calculator/`), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/unfair-dismissal-calculator/`,                    lastModified: getLastMod(`${base}/unfair-dismissal-calculator/`), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/constructive-dismissal-calculator/`,              lastModified: getLastMod(`${base}/constructive-dismissal-calculator/`), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/settlement-agreement-tax-calculator/`,            lastModified: getLastMod(`${base}/settlement-agreement-tax-calculator/`), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/protective-award-calculator/`,                    lastModified: getLastMod(`${base}/protective-award-calculator/`), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/pip-settlement-calculator/`,                      lastModified: getLastMod(`${base}/pip-settlement-calculator/`), changeFrequency: 'monthly', priority: 0.9 },

    // Tier 3: Explainer + how-it-works
    { url: `${base}/how-it-works/`,                                   lastModified: getLastMod(`${base}/how-it-works/`), changeFrequency: 'monthly', priority: 0.8 },

    // Tier 4: Guides (hub + spokes)
    { url: `${base}/guides/`,                                         lastModified: getLastMod(`${base}/guides/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-reference/`,          lastModified: getLastMod(`${base}/guides/settlement-agreement-reference/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-restrictive-covenants/`, lastModified: getLastMod(`${base}/guides/settlement-agreement-restrictive-covenants/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-how-much/`,           lastModified: getLastMod(`${base}/guides/settlement-agreement-how-much/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/compromise-agreement-calculator-uk/`,      lastModified: getLastMod(`${base}/guides/compromise-agreement-calculator-uk/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/protected-conversations-without-prejudice/`, lastModified: getLastMod(`${base}/guides/protected-conversations-without-prejudice/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-sick-leave/`,          lastModified: getLastMod(`${base}/guides/settlement-agreement-sick-leave/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-instead-of-pip/`,     lastModified: getLastMod(`${base}/guides/settlement-agreement-instead-of-pip/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/unfair-dismissal-settlement-agreements/`,   lastModified: getLastMod(`${base}/guides/unfair-dismissal-settlement-agreements/`), changeFrequency: 'monthly', priority: 0.7 },
        { url: `${base}/guides/whistleblowing-settlement-agreements/`,    lastModified: getLastMod(`${base}/guides/whistleblowing-settlement-agreements/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/discrimination-settlement-agreements/`,    lastModified: getLastMod(`${base}/guides/discrimination-settlement-agreements/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/constructive-dismissal-settlement-agreements/`, lastModified: getLastMod(`${base}/guides/constructive-dismissal-settlement-agreements/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/nhs-settlement-agreements/`,               lastModified: getLastMod(`${base}/guides/nhs-settlement-agreements/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-vs-tribunal-claim/`, lastModified: getLastMod(`${base}/guides/settlement-agreement-vs-tribunal-claim/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/average-settlement-agreement-payout-uk/`, lastModified: getLastMod(`${base}/guides/average-settlement-agreement-payout-uk/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/how-to-negotiate-a-settlement-agreement/`, lastModified: getLastMod(`${base}/guides/how-to-negotiate-a-settlement-agreement/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/employer-recommended-solicitor/`,          lastModified: getLastMod(`${base}/guides/employer-recommended-solicitor/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/pressured-to-sign/`,                       lastModified: getLastMod(`${base}/guides/pressured-to-sign/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/what-happens-if-you-do-not-sign/`,         lastModified: getLastMod(`${base}/guides/what-happens-if-you-do-not-sign/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/can-an-employer-withdraw-a-settlement-agreement/`, lastModified: getLastMod(`${base}/guides/can-an-employer-withdraw-a-settlement-agreement/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/tax-free-settlement-30000/`,               lastModified: getLastMod(`${base}/guides/tax-free-settlement-30000/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/redundancy-pay-cap-2026/`,                 lastModified: getLastMod(`${base}/guides/redundancy-pay-cap-2026/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/pilon-tax-treatment-2026/`,                 lastModified: getLastMod(`${base}/guides/pilon-tax-treatment-2026/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/settlement-agreement-acas-calculations/`, lastModified: getLastMod(`${base}/guides/settlement-agreement-acas-calculations/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/fair-work-agency/`,                        lastModified: getLastMod(`${base}/guides/fair-work-agency/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/is-my-settlement-offer-fair/`,             lastModified: getLastMod(`${base}/guides/is-my-settlement-offer-fair/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/what-is-a-fair-settlement-agreement/`,     lastModified: getLastMod(`${base}/guides/what-is-a-fair-settlement-agreement/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/protective-award/`,                        lastModified: getLastMod(`${base}/guides/protective-award/`), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/employment-tribunal-average-awards-uk/`,  lastModified: getLastMod(`${base}/guides/employment-tribunal-average-awards-uk/`), changeFrequency: 'monthly', priority: 0.7 },

    // Tier 5: Supplier & B2B facing
    { url: `${base}/for-solicitors/`,                                 lastModified: getLastMod(`${base}/for-solicitors/`), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/for-employers/`,                                  lastModified: getLastMod(`${base}/for-employers/`), changeFrequency: 'monthly', priority: 0.6 },

    // Tier 6: Legal / footer pages
    { url: `${base}/privacy/`,                                        lastModified: getLastMod(`${base}/privacy/`), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terms/`,                                          lastModified: getLastMod(`${base}/terms/`), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/disclaimer/`,                                     lastModified: getLastMod(`${base}/disclaimer/`), changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/sitemap/`,                                        lastModified: getLastMod(`${base}/sitemap/`), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
