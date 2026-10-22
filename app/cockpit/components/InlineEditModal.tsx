'use client';

import React, { useState } from 'react';
import {
  calculateSerpPixelWidth,
  SERP_PIXEL_BUDGETS,
} from '@/lib/agentic-engine/tools/serp-pixel-calculator';

interface InlineEditModalProps {
  pkg: any;
  onClose: () => void;
  onSaveAndApply: (packageId: string, updates: any, expectedVersion?: number) => Promise<void>;
}

export default function InlineEditModal({ pkg, onClose, onSaveAndApply }: InlineEditModalProps) {
  const [title, setTitle] = useState(pkg.calibratedTitle || '');
  const [metaDesc, setMetaDesc] = useState(pkg.calibratedMetaDescription || '');
  const [faqQ, setFaqQ] = useState(pkg.faqQuestion || '');
  const [faqA, setFaqA] = useState(pkg.faqAnswer || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const titleLen = title.length;
  const metaLen = metaDesc.length;
  const titlePixels = calculateSerpPixelWidth(title, 'title');
  const metaPixels = calculateSerpPixelWidth(metaDesc, 'meta');
  const hasEmDash = title.includes('—') || metaDesc.includes('—') || faqA.includes('—');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSaveAndApply(
      pkg.id,
      {
        calibratedTitle: title,
        calibratedMetaDescription: metaDesc,
        faqQuestion: faqQ,
        faqAnswer: faqA,
      },
      pkg.version || 1
    );
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#0B1F3A]/15 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#0B1F3A]/10 bg-[#0B1F3A] text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D9603B] block">
              Human-in-the-Loop Override • v{pkg.version || 1}
            </span>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              Edit &amp; Deploy Live Optimization
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-[#0B1F3A]">
          {hasEmDash && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <span>⚠️</span>
              <span>
                <strong>Brand Invariant Warning:</strong> Em dashes (—) detected. Replace with hyphens (-), colons (:), or parentheses to satisfy AGENTS.md rules.
              </span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="text-[#0B1F3A]">Calibrated Page Title</label>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                  titlePixels <= SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX && titleLen >= 45
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {titlePixels}px / {SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px ({titleLen} ch)
              </span>
            </div>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/20 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B] font-medium"
            />
          </div>

          {/* Meta Description */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <label className="text-[#0B1F3A]">Calibrated Meta Description</label>
              <span
                className={`font-mono text-[11px] px-2 py-0.5 rounded ${
                  metaPixels <= SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX && metaLen >= 130
                    ? 'bg-blue-100 text-blue-900'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {metaPixels}px / {SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX}px ({metaLen} ch)
              </span>
            </div>
            <textarea
              required
              rows={3}
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/20 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B] leading-relaxed"
            />
          </div>

          {/* FAQ Question */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0B1F3A] block">
              Featured Snippet / AI Overview Question
            </label>
            <input
              type="text"
              value={faqQ}
              onChange={(e) => setFaqQ(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/20 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
            />
          </div>

          {/* FAQ Answer */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#0B1F3A] block">
              Featured Snippet / AI Overview Answer
            </label>
            <textarea
              rows={3}
              value={faqA}
              onChange={(e) => setFaqA(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#0B1F3A]/20 text-xs text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B] leading-relaxed"
            />
          </div>

          <div className="p-4 bg-[#F7F4EE] border-t border-[#0B1F3A]/10 flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Deploying to Live...</span>
                </>
              ) : (
                <span>⚡ Save &amp; Deploy Live Now →</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
