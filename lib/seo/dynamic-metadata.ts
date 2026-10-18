/**
 * Dynamic SEO Metadata & Schema Resolver for Next.js App Router
 * Resolves active optimizations managed by the Autonomous SEO Actuator.
 * If an active optimization package is applied, it overrides title, meta, and JSON-LD schema seamlessly.
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
 * Resolves dynamic FAQPage Schema.org JSON-LD structured data for an applied SEO action package
 */
export async function resolveDynamicFaqSchema(pathname: string): Promise<Record<string, any> | null> {
  try {
    const active = await SeoActuatorService.getActiveOptimization(pathname);
    if (!active || !active.faqQuestion || !active.faqAnswer) {
      return null;
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: active.faqQuestion,
          acceptedAnswer: {
            '@type': 'Answer',
            text: active.faqAnswer,
          },
        },
      ],
    };
  } catch {
    return null;
  }
}
