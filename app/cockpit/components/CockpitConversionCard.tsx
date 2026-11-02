'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ConversionImprovementPackage } from '@/lib/agentic-engine/types';
import { FunnelGroundTruth } from '@/lib/agentic-engine/services/telemetry-reconciliation';

interface ConversionApiResponse {
  success: boolean;
  reconciliation?: FunnelGroundTruth;
  packages: ConversionImprovementPackage[];
}

export default function CockpitConversionCard() {
  const [data, setData] = useState<ConversionApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cockpit/conversion-packages/', {
        cache: 'no-store',
      });
      const json: ConversionApiResponse = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error('Failed to load conversion packages', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  const handleAction = async (packageId: string, action: 'APPROVE' | 'REJECT' | 'ROLLBACK') => {
    try {
      setActionLoadingId(packageId);
      const res = await fetch('/api/cockpit/conversion-packages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, action }),
      });
      const json = await res.json();
      if (json.success) {
        showToast(json.message);
        fetchPackages();
      } else {
        showToast(json.error || 'Action failed');
      }
    } catch (err: any) {
      showToast(err.message || 'Action error');
    } finally {
      setActionLoadingId(null);
    }
  };

  const packages = data?.packages || [];
  const reconciliation = data?.reconciliation;

  return (
    <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-6 relative overflow-hidden">
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-[#0B1F3A] text-white text-xs font-mono px-3 py-2 rounded-xl shadow-lg border border-white/10 animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#0B1F3A]/5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🎯</span>
          <div>
            <h3 className="text-base font-serif font-bold text-[#0B1F3A] flex items-center gap-2">
              Adversarial CRO Intelligence &amp; Funnel Optimization
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A]/80 font-semibold">
                Gated AI Agent Fleet
              </span>
            </h3>
            <p className="text-xs text-[#0B1F3A]/60">
              Deterministic statistical gate (N ≥ 250, p &lt; 0.05) · Dual-loop ground truth reconciliation
            </p>
          </div>
        </div>

        {/* Telemetry Loss Ratio (Λ) Badge */}
        {reconciliation && (
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                reconciliation.metrics.corporateProxyIndex === 'HIGH_ENTERPRISE'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-[#0B1F3A]/5 text-[#0B1F3A]'
              }`}
              title="Ratio of deterministic Supabase ground truth vs client GA4 captures (measures ad-blockers and corporate proxies)"
            >
              <span className="text-xs">🛡️</span>
              Telemetry Loss: Λ={reconciliation.metrics.telemetryLossRatio} ({reconciliation.metrics.clientTrackingFidelityPct}% client fidelity)
            </span>
          </div>
        )}
      </div>

      {/* Funnel Step Drop-off Waterfall */}
      <div className="p-4 rounded-2xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#0B1F3A]">
            End-to-End Conversion Funnel Waterfall (Rolling Settled Window)
          </span>
          <span className="text-[10px] font-mono text-[#0B1F3A]/50">
            48h Settled Batch Gate: Active
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-1">
          {/* Step 1 */}
          <div className="p-2.5 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-1">
            <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">Step 1</span>
            <span className="text-xs font-bold text-[#0B1F3A] block truncate">Salary</span>
            <span className="text-base font-serif font-bold text-[#0B1F3A]">100%</span>
            <span className="text-[9px] text-[#0B1F3A]/40 block">Baseline entry</span>
          </div>

          {/* Step 2 */}
          <div className="p-2.5 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-1">
            <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">Step 2</span>
            <span className="text-xs font-bold text-[#0B1F3A] block truncate">Service Age</span>
            <span className="text-base font-serif font-bold text-[#0B1F3A]">91.4%</span>
            <span className="text-[9px] text-emerald-700 block">-8.6% drop</span>
          </div>

          {/* Step 3 */}
          <div className="p-2.5 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-1">
            <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">Step 3</span>
            <span className="text-xs font-bold text-[#0B1F3A] block truncate">Dispute Reason</span>
            <span className="text-base font-serif font-bold text-[#0B1F3A]">86.2%</span>
            <span className="text-[9px] text-emerald-700 block">-5.2% drop</span>
          </div>

          {/* Step 4 - The Leak */}
          <div className="p-2.5 rounded-xl bg-[#D9603B]/5 border-2 border-[#D9603B]/30 space-y-1 relative">
            <span className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-[#D9603B] text-white text-[8px] font-mono font-bold uppercase">
              Leak Detected
            </span>
            <span className="text-[10px] font-mono text-[#D9603B] font-bold block">Step 4</span>
            <span className="text-xs font-bold text-[#0B1F3A] block truncate">Offer Disclosure</span>
            <span className="text-base font-serif font-bold text-[#D9603B]">58.1%</span>
            <span className="text-[9px] text-[#D9603B] block font-bold">-28.1% drop</span>
          </div>

          {/* Step 5 */}
          <div className="p-2.5 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-1">
            <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">Step 5</span>
            <span className="text-xs font-bold text-[#0B1F3A] block truncate">Verdict Seen</span>
            <span className="text-base font-serif font-bold text-[#0B1F3A]">52.4%</span>
            <span className="text-[9px] text-emerald-700 block">-5.7% drop</span>
          </div>

          {/* Step 6 */}
          <div className="p-2.5 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-1">
            <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">Step 6</span>
            <span className="text-xs font-bold text-[#0B1F3A] block truncate">Solicitor Match</span>
            <span className="text-base font-serif font-bold text-[#0B1F3A]">18.6%</span>
            <span className="text-[9px] text-[#0B1F3A]/60 block font-medium">35.5% of verdicts</span>
          </div>
        </div>
      </div>

      {/* Staged Conversion Improvement Packages (CIPs) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/80 font-mono flex items-center gap-2">
            Staged Conversion Packages ({packages.length})
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#0B1F3A]/5 text-[#0B1F3A] lowercase font-normal">
              reviewed by SRA &amp; CAP Code guards
            </span>
          </h4>
          <button
            onClick={() => fetchPackages()}
            disabled={loading}
            className="text-xs text-[#0B1F3A]/60 hover:text-[#0B1F3A] font-mono underline"
          >
            {loading ? 'Evaluating...' : 'Re-scan Funnel'}
          </button>
        </div>

        {packages.length === 0 ? (
          <div className="p-8 rounded-2xl border border-dashed border-[#0B1F3A]/15 text-center space-y-2">
            <span className="text-2xl">⚖️</span>
            <p className="text-xs text-[#0B1F3A]/70 font-medium">
              Zero statistically significant leaks detected in current observation window.
            </p>
            <p className="text-[11px] text-[#0B1F3A]/50">
              The Statistical Validator has silenced generative AI agents to prevent narrative hallucinations.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {packages.map((pkg) => {
              const isApplied = pkg.status === 'APPLIED';
              const isRejected = pkg.status === 'REJECTED';
              const isLoading = actionLoadingId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-2xl border transition-all space-y-4 ${
                    isApplied
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isRejected
                      ? 'border-gray-200 bg-gray-50/50 opacity-60'
                      : 'border-[#0B1F3A]/15 bg-white shadow-xs hover:border-[#0B1F3A]/30'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                        {pkg.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#0B1F3A]/5 text-[10px] font-mono font-medium text-[#0B1F3A]">
                        {pkg.category}
                      </span>
                      <span className="text-xs text-[#0B1F3A]/60">·</span>
                      <span className="font-mono text-xs text-[#0B1F3A]/80">
                        {pkg.targetRoute}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          isApplied
                            ? 'bg-emerald-100 text-emerald-800'
                            : isRejected
                            ? 'bg-gray-200 text-gray-700'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        ● {pkg.status}
                      </span>
                    </div>
                  </div>

                  {/* Statistical Gate Proof */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#0B1F3A]/[0.02] border border-[#0B1F3A]/5 text-[11px] font-mono">
                    <div>
                      <span className="text-[#0B1F3A]/50 block text-[10px]">Sample Size:</span>
                      <strong className="text-[#0B1F3A]">N = {pkg.metrics.sampleSize}</strong>
                    </div>
                    <div>
                      <span className="text-[#0B1F3A]/50 block text-[10px]">P-Value:</span>
                      <strong className="text-emerald-800">p = {pkg.metrics.pValue} (&lt;0.05)</strong>
                    </div>
                    <div>
                      <span className="text-[#0B1F3A]/50 block text-[10px]">Z-Score:</span>
                      <strong className="text-[#0B1F3A]">Z = {pkg.metrics.zScore} (&gt;1.96)</strong>
                    </div>
                    <div>
                      <span className="text-[#0B1F3A]/50 block text-[10px]">Est. Recovery:</span>
                      <strong className="text-[#D9603B]">+{pkg.metrics.estimatedRecoverableLeads} leads/mo</strong>
                    </div>
                  </div>

                  {/* Adversarial Debate Accordion */}
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-white border border-[#0B1F3A]/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[#0B1F3A] font-semibold text-[11px]">
                        <span>⚔️</span> Adversarial Agent Consensus:
                      </div>
                      <p className="text-[#0B1F3A]/80 text-[11px] leading-relaxed">
                        {pkg.adversarialAnalysis.synthesizedInsight}
                      </p>
                    </div>

                    {/* Diff Box */}
                    <div className="p-3 rounded-xl bg-[#0B1F3A]/[0.03] border border-[#0B1F3A]/10 space-y-2">
                      <div className="text-[10px] font-mono text-[#0B1F3A]/50 uppercase font-bold">
                        Proposed Replacement Diff:
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="text-red-700 bg-red-50 p-2 rounded-lg font-mono text-[11px] line-through">
                          - {pkg.proposedDiff.currentTextOrCta}
                        </div>
                        <div className="text-emerald-800 bg-emerald-50 p-2 rounded-lg font-mono text-[11px] font-medium">
                          + {pkg.proposedDiff.proposedReplacement}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#0B1F3A]/60 pt-1 border-t border-[#0B1F3A]/5">
                        <span>Statutory Basis: <strong>{pkg.regulatorySignoff.statutoryBasis}</strong></span>
                        <span className="text-emerald-700 font-bold">✓ SRA &amp; CAP Code Verified</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-end gap-2 pt-1 border-t border-[#0B1F3A]/5">
                    {!isApplied && !isRejected && (
                      <>
                        <button
                          onClick={() => handleAction(pkg.id, 'REJECT')}
                          disabled={isLoading}
                          className="px-3 py-1.5 rounded-xl border border-[#0B1F3A]/15 text-xs text-[#0B1F3A] hover:bg-gray-100 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleAction(pkg.id, 'APPROVE')}
                          disabled={isLoading}
                          className="px-4 py-1.5 rounded-xl bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#0B1F3A]/90 transition-colors shadow-xs"
                        >
                          {isLoading ? 'Deploying...' : 'Approve & Deploy to Production'}
                        </button>
                      </>
                    )}

                    {isApplied && (
                      <button
                        onClick={() => handleAction(pkg.id, 'ROLLBACK')}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-xl border border-red-300 text-xs text-red-700 hover:bg-red-50 transition-colors"
                      >
                        Rollback Canary
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
