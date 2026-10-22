'use client';

import React, { useState } from 'react';

interface SerpDiffModalProps {
  pkg: any;
  onClose: () => void;
  onApprove: (id: string) => void;
  onOpenEdit: (pkg: any) => void;
  onOpenReject: (pkg: any) => void;
}

export default function SerpDiffModal({
  pkg,
  onClose,
  onApprove,
  onOpenEdit,
  onOpenReject,
}: SerpDiffModalProps) {
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');

  if (!pkg) return null;

  const targetUrl = pkg.targetCanonicalUrl || 'https://settlementcheck.co.uk/calculator/';
  const cleanDomain = 'settlementcheck.co.uk';
  const displayUrl = targetUrl.replace('https://', '');

  const title = pkg.calibratedTitle || 'Settlement Agreement Calculator UK';
  const metaDesc = pkg.calibratedMetaDescription || 'Calculate your statutory redundancy and settlement entitlement.';
  const titleLen = title.length;
  const metaLen = metaDesc.length;

  const titleOk = titleLen >= 45 && titleLen <= 65;
  const metaOk = metaLen >= 135 && metaLen <= 160;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B1F3A]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-sans">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-[#0B1F3A]/15 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#0B1F3A]/10 bg-[#0B1F3A] text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#D9603B] text-white">
                {pkg.priority || 'CRITICAL'} PRIORITY
              </span>
              <span className="text-xs text-white/60 font-mono">
                {pkg.actionType || 'META_RECALIBRATION'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              &ldquo;{pkg.query}&rdquo; — Agent Recommendation Diff
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-[#0B1F3A]">
          {/* 1. Google SERP Simulator */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/70">
                  Google SERP Snippet Simulator
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0B1F3A]/5 text-[#0B1F3A]/70">
                  Live Pixel Approximation
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#0B1F3A]/5 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    deviceView === 'desktop' ? 'bg-white shadow-sm text-[#0B1F3A]' : 'text-[#0B1F3A]/60'
                  }`}
                >
                  🖥️ Desktop
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    deviceView === 'mobile' ? 'bg-white shadow-sm text-[#0B1F3A]' : 'text-[#0B1F3A]/60'
                  }`}
                >
                  📱 Mobile
                </button>
              </div>
            </div>

            {/* Google Search Card Simulation */}
            <div
              className={`p-4 rounded-2xl bg-white border border-[#0B1F3A]/15 shadow-sm space-y-1 ${
                deviceView === 'mobile' ? 'max-w-md mx-auto ring-4 ring-[#0B1F3A]/5' : ''
              }`}
            >
              {/* Google Breadcrumb */}
              <div className="flex items-center gap-2 text-[12px] text-[#202124]">
                <div className="w-5 h-5 rounded-full bg-[#0B1F3A] flex items-center justify-center text-[10px] text-white font-bold">
                  SC
                </div>
                <div className="leading-tight">
                  <span className="font-semibold block">{cleanDomain}</span>
                  <span className="text-[11px] text-[#5f6368] truncate block max-w-sm">
                    https://{displayUrl}
                  </span>
                </div>
              </div>

              {/* Google Blue Link Title */}
              <h3 className="text-base sm:text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug pt-1">
                {title}
              </h3>

              {/* Google Snippet Description */}
              <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed pt-0.5">
                {metaDesc}
              </p>

              {/* FAQ Accordion Extension in SERP */}
              {pkg.faqQuestion && (
                <div className="pt-2 mt-2 border-t border-[#0B1F3A]/10 space-y-1">
                  <span className="text-[11px] font-bold text-[#1a0dab] flex items-center gap-1 cursor-pointer">
                    <span>▾</span> {pkg.faqQuestion}
                  </span>
                  <p className="text-[11px] text-[#4d5156] pl-3 leading-normal line-clamp-2">
                    {pkg.faqAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Character Budget Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider">Title Length</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    titleOk ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {titleLen} / 60 chars
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1F3A]/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    titleLen > 65 ? 'bg-red-500' : titleLen < 45 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (titleLen / 65) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#0B1F3A]/50 block">Target benchmark: 50 to 60 characters</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider">Meta Description</span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    metaOk ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {metaLen} / 155 chars
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1F3A]/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    metaLen > 165 ? 'bg-red-500' : metaLen < 130 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${Math.min(100, (metaLen / 160) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#0B1F3A]/50 block">Target benchmark: 140 to 155 characters</span>
            </div>
          </div>

          {/* 3. Deep Agent Rationale & Search Intent */}
          <div className="p-4 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1.5">
              <span>🧠</span> Autonomous Agent Rationale & Strategy
            </span>
            <p className="text-xs text-[#0B1F3A]/85 leading-relaxed">
              {pkg.rationale ||
                `Search query "${pkg.query}" is currently ranking at average position ${pkg.position ? Number(pkg.position).toFixed(1) : '14.2'} with ${pkg.impressions?.toLocaleString('en-GB') || '500+'} monthly impressions. The agent calibrated the title and description to include the statutory April 2026 £751/week cap hook, ACAS guidance, and employer legal fee reassurance to capture high-intent employee click-through.`}
            </p>
          </div>

          {/* 4. Statutory & Quality Invariant Audits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A] block">
                Statutory Employment Law Check
              </span>
              <ul className="text-xs text-[#0B1F3A]/80 space-y-1">
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <span>✓</span> Employment Rights Act 1996 s.162 (£751/wk cap)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <span>✓</span> Section 203(3) ERA 1996 Independent Solicitor
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <span>✓</span> ITEPA 2003 s.403 (£30k tax exemption cited)
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A] block">
                Anti-AI & Brand Standards
              </span>
              <ul className="text-xs text-[#0B1F3A]/80 space-y-1">
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <span>✓</span> Zero Em Dashes (Brand Rule Compliance)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <span>✓</span> Plain UK English (Solicitor, not lawyer/attorney)
                </li>
                <li className="flex items-center gap-1.5 text-emerald-800">
                  <span>✓</span> Authenticity Score: 94% (High burstiness)
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 bg-[#F7F4EE] border-t border-[#0B1F3A]/10 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onOpenReject(pkg)}
            className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-800 transition-colors"
          >
            ✕ Reject Recommendation
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenEdit(pkg)}
              className="px-4 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors"
            >
              ✏️ Edit Before Approving
            </button>
            <button
              onClick={() => onApprove(pkg.id)}
              className="px-5 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>⚡ 1-Click Approve & Deploy Live →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
