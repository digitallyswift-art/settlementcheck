/**
 * Dynamic SEO Metadata Resolver for Next.js App Router
 * Resolves active optimizations managed by the Autonomous SEO Actuator.
 * If an active optimization package is applied, it overrides title & meta seamlessly in real time.
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
      title,
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
  } catch (err) {
    // Fail safe to default static metadata on any resolution issue
    return defaultMetadata;
  }
}
