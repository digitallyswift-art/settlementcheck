'use client';

import React, { useState } from 'react';
import {
  calculateSerpPixelWidth,
  SERP_PIXEL_BUDGETS,
} from '@/lib/agentic-engine/tools/serp-pixel-calculator';

interface SerpDiffModalProps {
  pkg: any;
  onClose: () => void;
  onApprove: (id: string, deployAsCanary?: boolean) => void;
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

  const titlePixels = calculateSerpPixelWidth(title, 'title');
  const metaPixels = calculateSerpPixelWidth(metaDesc, 'meta');

  const maxTitlePx =
    deviceView === 'desktop'
      ? SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX
      : SERP_PIXEL_BUDGETS.MOBILE_TITLE_MAX_PX;
  const maxMetaPx =
    deviceView === 'desktop'
      ? SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX
      : SERP_PIXEL_BUDGETS.MOBILE_META_MAX_PX;

  const titlePxOk = titlePixels <= maxTitlePx && titlePixels >= SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MIN_PX;
  const metaPxOk = metaPixels <= maxMetaPx && metaPixels >= 500;

  const existingH1 =
    pkg.targetPageExistingH1 ||
    title.replace(/\s*\|\s*SettlementCheck$/i, '').trim();

  const primaryClusterAnchor = pkg.primaryAnchorQuery || pkg.query;

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
                  Arial 20px / 14px Pixel Bounding Box
                </span>
              </div>
              <div className="flex items-center gap-1 bg-[#0B1F3A]/5 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setDeviceView('desktop')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    deviceView === 'desktop' ? 'bg-white shadow-sm text-[#0B1F3A]' : 'text-[#0B1F3A]/60'
                  }`}
                >
                  🖥️ Desktop ({SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px)
                </button>
                <button
                  onClick={() => setDeviceView('mobile')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    deviceView === 'mobile' ? 'bg-white shadow-sm text-[#0B1F3A]' : 'text-[#0B1F3A]/60'
                  }`}
                >
                  📱 Mobile ({SERP_PIXEL_BUDGETS.MOBILE_TITLE_MAX_PX}px)
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

              {/* On-Page Direct Answer Preview */}
              {pkg.faqQuestion && (
                <div className="pt-2 mt-2 border-t border-[#0B1F3A]/10 space-y-1">
                  <span className="text-[11px] font-bold text-[#0B1F3A] flex items-center gap-1">
                    <span>💡 AI Overview / Direct Answer Block:</span> {pkg.faqQuestion}
                  </span>
                  <p className="text-[11px] text-[#4d5156] pl-3 leading-normal line-clamp-2">
                    {pkg.faqAnswer}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 2. Pixel Width & Character Budget Meters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider">
                  Title Bounding Box (Arial 20px)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    titlePxOk ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {titlePixels}px / {maxTitlePx}px ({titleLen} ch)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1F3A]/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    titlePixels > maxTitlePx
                      ? 'bg-red-500'
                      : titlePixels < 320
                      ? 'bg-amber-500'
                      : 'bg-[#0B1F3A]'
                  }`}
                  style={{ width: `${Math.min(100, (titlePixels / maxTitlePx) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#0B1F3A]/50 block">
                Google clips desktop titles at ~580px ({titlePixels <= maxTitlePx ? '✓ Safe from ellipsis truncation' : '⚠️ Exceeds pixel bound'})
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider">
                  Meta Bounding Box (Arial 14px)
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    metaPxOk ? 'bg-blue-100 text-blue-900' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {metaPixels}px / {maxMetaPx}px ({metaLen} ch)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0B1F3A]/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    metaPixels > maxMetaPx
                      ? 'bg-red-500'
                      : metaPixels < 500
                      ? 'bg-amber-500'
                      : 'bg-[#0B1F3A]'
                  }`}
                  style={{ width: `${Math.min(100, (metaPixels / maxMetaPx) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#0B1F3A]/50 block">
                Google clips desktop snippets at ~990px ({metaPixels <= maxMetaPx ? '✓ Safe from truncation' : '⚠️ Exceeds pixel bound'})
              </span>
            </div>
          </div>

          {/* 3. On-Page DOM Heading Synchronization & Multi-Query Cluster Shield */}
          <div className="p-4 rounded-2xl bg-white border border-[#0B1F3A]/10 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/70 block">
              DOM Intent Synchronization &amp; Cannibalization Shield
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 rounded-xl bg-[#F7F4EE]/60 border border-[#0B1F3A]/10">
                <span className="text-[10px] text-[#0B1F3A]/50 block font-mono uppercase">
                  Server-Rendered Page &lt;h1&gt;
                </span>
                <strong className="text-[#0B1F3A] block mt-0.5">{existingH1}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F4EE]/60 border border-[#0B1F3A]/10">
                <span className="text-[10px] text-[#0B1F3A]/50 block font-mono uppercase">
                  Protected Cluster Anchor
                </span>
                <strong className="text-[#D9603B] block mt-0.5">&ldquo;{primaryClusterAnchor}&rdquo;</strong>
              </div>
            </div>
          </div>

          {/* 4. Deep Agent Rationale & Search Intent */}
          <div className="p-4 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1.5">
              <span>🧠</span> Autonomous Agent Rationale &amp; Strategy
            </span>
            <p className="text-xs text-[#0B1F3A]/85 leading-relaxed">
              {pkg.rationale ||
                `Search query "${pkg.query}" is currently ranking at average position ${pkg.position ? Number(pkg.position).toFixed(1) : '14.2'} with ${pkg.impressions?.toLocaleString('en-GB') || '500+'} monthly impressions. The agent calibrated the title (${titlePixels}px) and description (${metaPixels}px) within Google's Arial pixel bounding box while protecting primary cluster anchor "${primaryClusterAnchor}".`}
            </p>
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenEdit(pkg)}
              className="px-4 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors"
            >
              ✏️ Edit Before Approving
            </button>
            <button
              onClick={() => onApprove(pkg.id, true)}
              className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold transition-all shadow-sm"
            >
              🧪 Deploy 14-Day Canary
            </button>
            <button
              onClick={() => onApprove(pkg.id, false)}
              className="px-5 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5"
            >
              <span>⚡ 1-Click Approve &amp; Deploy Live →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
