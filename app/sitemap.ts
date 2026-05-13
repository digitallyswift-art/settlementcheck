import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://settlementcheck.co.uk'
  const now = new Date()

  return [
    // Tier 1 — Conversion pillars
    { url: `${base}/`,                                                lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/calculator/`,                                     lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },

    // Tier 2 — Programmatic SEO landing pages
    { url: `${base}/redundancy-calculator/`,                          lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/unfair-dismissal-calculator/`,                    lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/constructive-dismissal-calculator/`,              lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Tier 3 — Funnel + how-it-works
    { url: `${base}/how-it-works/`,                                   lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/get-matched/`,                                    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

    // Tier 4 — Guides (hub + spokes)
    { url: `${base}/guides/`,                                         lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/how-to-negotiate-a-settlement-agreement/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/employer-recommended-solicitor/`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/guides/pressured-to-sign/`,                       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },

    // Tier 5 — Supplier-facing
    { url: `${base}/for-solicitors/`,                                 lastModified: now, changeFrequency: 'monthly', priority: 0.6 },

    // Tier 6 — Legal / footer pages
    { url: `${base}/privacy/`,                                        lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/terms/`,                                          lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
    { url: `${base}/disclaimer/`,                                     lastModified: now, changeFrequency: 'yearly',  priority: 0.2 },
  ]
}
