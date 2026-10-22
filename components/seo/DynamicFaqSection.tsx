import React from 'react';
import { SeoActuatorService } from '@/lib/agentic-engine/services/seo-actuator-service';
import { safeJsonLdStringify } from '@/lib/seo/safe-json-ld';

interface DynamicFaqSectionProps {
  pathname: string;
  headingText?: string;
}

export default async function DynamicFaqSection({
  pathname,
  headingText = 'Frequently Asked Questions',
}: DynamicFaqSectionProps) {
  const activeOptimization = await SeoActuatorService.getActiveOptimization(pathname);

  if (!activeOptimization || !activeOptimization.faqQuestion || !activeOptimization.faqAnswer) {
    return null;
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: activeOptimization.faqQuestion,
        acceptedAnswer: {
          '@type': 'Answer',
          text: activeOptimization.faqAnswer,
        },
      },
    ],
  };

  return (
    <section
      aria-labelledby="dynamic-faq-heading"
      className="my-10 max-w-4xl mx-auto px-4 sm:px-6"
    >
      {/* 1. Sanitized JSON-LD injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
      />

      {/* 2. Guaranteed Visible DOM Content for Users & Googlebot */}
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
          <div className="mt-3 text-xs sm:text-sm leading-relaxed text-[#0B1F3A]/80 border-t border-[#0B1F3A]/10 pt-3">
            {activeOptimization.faqAnswer}
          </div>
        </details>

        <p className="mt-4 text-[11px] text-[#0B1F3A]/50 italic">
          Verified against UK employment statutory rates (SI 2026/310 &amp; ITEPA 2003 s.403).
        </p>
      </div>
    </section>
  );
}
