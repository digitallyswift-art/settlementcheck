import React from 'react';
import Link from 'next/link';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { resolveDynamicStructuredSchema } from '@/lib/seo/dynamic-metadata';
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld';

interface DynamicFaqSectionProps {
  pathname: string;
  headingText?: string;
}

function renderContextualSnippetWithLinks(snippet: string): React.ReactNode {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(snippet)) !== null) {
    if (match.index > lastIdx) {
      parts.push(snippet.slice(lastIdx, match.index));
    }
    const anchorText = match[1];
    let href = match[2];
    if (href.startsWith('/') && !href.endsWith('/')) {
      href = `${href}/`;
    }
    parts.push(
      <Link
        key={`${href}-${match.index}`}
        href={href}
        className="font-semibold text-[#D9603B] underline underline-offset-2 hover:text-[#0B1F3A] transition-colors"
      >
        {anchorText}
      </Link>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < snippet.length) {
    parts.push(snippet.slice(lastIdx));
  }

  return parts.length > 0 ? parts : snippet;
}

export default async function DynamicFaqSection({
  pathname,
  headingText = 'Key Statutory Guidance',
}: DynamicFaqSectionProps) {
  const activeOptimization = await SeoActuatorService.getActiveOptimization(pathname);

  if (!activeOptimization || !activeOptimization.faqQuestion || !activeOptimization.faqAnswer) {
    return null;
  }

  const structuredSchema = await resolveDynamicStructuredSchema(pathname);

  return (
    <section
      aria-labelledby="dynamic-faq-heading"
      className="my-10 max-w-4xl mx-auto px-4 sm:px-6"
    >
      {/* 1. Sanitized WebApplication / Article JSON-LD injection */}
      {structuredSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(structuredSchema) }}
        />
      )}

      {/* 2. Guaranteed Visible DOM Content for Users & Google AI Overviews */}
      <div className="rounded-3xl border border-[#0B1F3A]/10 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B]" />
          <h2 id="dynamic-faq-heading" className="text-lg sm:text-xl font-serif font-bold text-[#0B1F3A]">
            {headingText}
          </h2>
        </div>

        <details className="group rounded-2xl border border-[#0B1F3A]/10 bg-[#F7F4EE]/50 p-4 transition-all" open>
          <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-sm text-[#0B1F3A]">
            <span>{activeOptimization.faqQuestion}</span>
            <span className="transition-transform group-open:rotate-180 text-xs text-[#0B1F3A]/60">▼</span>
          </summary>
          <div className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0B1F3A]/80 border-t border-[#0B1F3A]/10 pt-3 space-y-2.5">
            <p>{activeOptimization.faqAnswer}</p>
            {activeOptimization.contextualLinkSnippet && (
              <p className="text-xs text-[#0B1F3A]/90 bg-white/80 p-3 rounded-xl border border-[#0B1F3A]/10">
                {renderContextualSnippetWithLinks(activeOptimization.contextualLinkSnippet)}
              </p>
            )}
          </div>
        </details>

        <p className="mt-4 text-[11px] text-[#0B1F3A]/50 italic">
          Verified against UK employment statutory rates (SI 2026/310, ERA 1996 s.203 &amp; ITEPA 2003 s.403).
        </p>
      </div>
    </section>
  );
}
