/**
 * Dynamic SEO Metadata, Heading Synchronization & Schema Resolver for Next.js App Router
 * Resolves active optimizations managed by the Autonomous SEO Actuator.
 * Deprecates standalone commercial FAQPage schema (August 2023 Google update) in favor
 * of authoritative WebApplication, Article, and HowTo structured data.
 */

import type { Metadata } from 'next';
import { SeoActuatorService } from '../agentic-engine/services/seo-actuator-service';

export async function resolveDynamicSeoMetadata(
  pathname: string,
  defaultMetadata: Metadata
): Promise<Metadata> {
  try {
    const active = await SeoActuatorService.getActiveOptimization(pathname);
    if (!active) {
      return defaultMetadata;
    }

    const title = active.calibratedTitle;
    const description = active.calibratedMetaDescription;

    return {
      ...defaultMetadata,
      title: { absolute: title },
      description,
      openGraph: {
        ...(defaultMetadata.openGraph || {}),
        title,
        description,
      },
      twitter: {
        ...(defaultMetadata.twitter || {}),
        title,
        description,
      },
    };
  } catch {
    // Fail safe to default static metadata on any resolution issue
    return defaultMetadata;
  }
}

/**
 * Synchronizes on-page <h1> heading with active `<title>` optimization to prevent
 * Google from overriding the `<title>` tag with a mismatched on-page heading.
 */
export async function resolveDynamicPageHeading(
  pathname: string,
  defaultHeading: string
): Promise<string> {
  try {
    const active = await SeoActuatorService.getActiveOptimization(pathname);
    if (!active || !active.calibratedTitle) {
      return defaultHeading;
    }
    // Strip trailing brand suffix (" | SettlementCheck") for clean on-page H1 presentation
    const cleanHeading = active.calibratedTitle.replace(/\s*\|\s*SettlementCheck$/i, '').trim();
    return cleanHeading || defaultHeading;
  } catch {
    return defaultHeading;
  }
}

/**
 * Resolves modern Schema.org JSON-LD structured data for an applied SEO action package.
 * Replaces deprecated standalone commercial FAQPage schema with WebApplication (for calculators)
 * or Article/WebPage with embedded statutory citation entities (for guides).
 */
export async function resolveDynamicStructuredSchema(pathname: string): Promise<Record<string, any> | null> {
  try {
    const active = await SeoActuatorService.getActiveOptimization(pathname);
    if (!active) {
      return null;
    }

    const normPath = SeoActuatorService.normalizePath(pathname);
    const fullUrl = `https://settlementcheck.co.uk${normPath}`;
    const isCalculatorRoute = normPath.includes('calculator');

    if (isCalculatorRoute) {
      return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: active.calibratedTitle.replace(/\s*\|\s*SettlementCheck$/i, '').trim(),
        url: fullUrl,
        description: active.calibratedMetaDescription,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'All',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'GBP',
        },
        ...(active.faqQuestion && active.faqAnswer
          ? {
              subjectOf: {
                '@type': 'Question',
                name: active.faqQuestion,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: active.faqAnswer,
                },
              },
            }
          : {}),
      };
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: active.calibratedTitle.replace(/\s*\|\s*SettlementCheck$/i, '').trim(),
      description: active.calibratedMetaDescription,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': fullUrl,
      },
      author: {
        '@type': 'Organization',
        name: 'SettlementCheck Legal Research Desk',
        url: 'https://settlementcheck.co.uk',
      },
      ...(active.appliedAt ? { dateModified: active.appliedAt } : {}),
      ...(active.faqQuestion && active.faqAnswer
        ? {
            about: {
              '@type': 'Question',
              name: active.faqQuestion,
              acceptedAnswer: {
                '@type': 'Answer',
                text: active.faqAnswer,
              },
            },
          }
        : {}),
    };
  } catch {
    return null;
  }
}

/**
 * Backwards-compatible alias that delegates to resolveDynamicStructuredSchema
 * so existing callers automatically receive non-deprecated WebApplication/Article schema.
 */
export async function resolveDynamicFaqSchema(pathname: string): Promise<Record<string, any> | null> {
  return resolveDynamicStructuredSchema(pathname);
}
