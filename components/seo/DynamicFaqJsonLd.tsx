/**
 * Dynamic FAQ JSON-LD Structured Data Injector
 * Injects sanitized Schema.org FAQPage structured data when an autonomous SEO action package is active on the route.
 */

import { resolveDynamicFaqSchema } from '@/lib/seo/dynamic-metadata';
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld';

export default async function DynamicFaqJsonLd({ pathname }: { pathname: string }) {
  const schema = await resolveDynamicFaqSchema(pathname);
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(schema) }}
    />
  );
}
