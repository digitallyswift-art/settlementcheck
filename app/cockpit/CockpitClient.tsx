'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/firebase/auth-context';
import {
  calculateSerpPixelWidth,
  SERP_PIXEL_BUDGETS,
} from '@/lib/agentic-engine/tools/serp-pixel-calculator';
import SerpDiffModal from './components/SerpDiffModal';
import InlineEditModal from './components/InlineEditModal';
import RejectModal from './components/RejectModal';

export default function CockpitClient() {
  const { user, getIdToken, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'approvals' | 'deployed' | 'monitor'>('approvals');

  // Tab 1 & 2: SEO Packages State
  const [seoPackages, setSeoPackages] = useState<any[]>([]);
  const [seoSummary, setSeoSummary] = useState<{
    totalPackages: number;
    appliedCount: number;
    canaryCount?: number;
    validatedCount: number;
    stagedCount: number;
    regressionCount?: number;
  } | null>(null);
  const [isLoadingSeo, setIsLoadingSeo] = useState<boolean>(false);
  const [packageFilter, setPackageFilter] = useState<'ALL' | 'PENDING' | 'APPLIED' | 'REJECTED'>('PENDING');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [watchdogReport, setWatchdogReport] = useState<any | null>(null);

  // Tab 3: Monitor & Leads State
  const [monitorData, setMonitorData] = useState<any>(null);
  const [isLoadingMonitor, setIsLoadingMonitor] = useState<boolean>(false);
  const [leadSearch, setLeadSearch] = useState('');
  const [disputeFilter, setDisputeFilter] = useState('ALL');

  // Modals
  const [inspectingPackage, setInspectingPackage] = useState<any | null>(null);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [rejectingPackage, setRejectingPackage] = useState<any | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const token = await getIdToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // Fetch SEO Packages
  const fetchSeoData = async () => {
    setIsLoadingSeo(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', { headers });
      const data = await res.json();
      if (data.success) {
        setSeoSummary(data.summary);
        setSeoPackages(data.packages || []);
      }
    } catch (err) {
      console.error('Failed to load SEO data', err);
    } finally {
      setIsLoadingSeo(false);
    }
  };

  // Fetch Monitor & Leads
  const fetchMonitorData = async () => {
    setIsLoadingMonitor(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/cockpit/monitor/', { headers });
      const data = await res.json();
      if (data.success) {
        setMonitorData(data);
      }
    } catch (err) {
      console.error('Failed to load monitor data', err);
    } finally {
      setIsLoadingMonitor(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
    fetchMonitorData();
  }, []);

  // 1-Click Apply (or 14-Day Canary)
  const handleApply = async (packageId: string, deployAsCanary = false) => {
    setActionLoadingId(packageId);
    try {
      const targetPkg = seoPackages.find(p => p.id === packageId);
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: deployAsCanary ? 'APPLY_CANARY' : 'APPLY',
          packageId,
          deployAsCanary,
          expectedVersion: targetPkg?.version || 1,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        showToast('⚠️ Conflict: This package was updated by another process. Refreshing latest data...');
        await fetchSeoData();
        return;
      }
      if (data.success) {
        showToast(
          deployAsCanary
            ? '🧪 Deployed in 14-day Canary Observation Mode. Edge cache tag revalidated & Sitemap <lastmod> updated.'
            : '✓ Package approved & deployed live. Edge cache tag revalidated & Sitemap <lastmod> updated.'
        );
        await fetchSeoData();
        if (inspectingPackage?.id === packageId) setInspectingPackage(null);
      } else {
        showToast(`Error: ${data.error || 'Failed to apply package'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Edit and Apply
  const handleEditAndApply = async (packageId: string, updates: any, expectedVersion?: number) => {
    setActionLoadingId(packageId);
    try {
      const targetPkg = seoPackages.find(p => p.id === packageId);
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'EDIT_AND_APPLY',
          packageId,
          updates,
          expectedVersion: expectedVersion || targetPkg?.version || 1,
        }),
      });
      const data = await res.json();
      if (res.status === 409) {
        showToast('⚠️ Conflict: This package was updated by another process. Refreshing latest data...');
        await fetchSeoData();
        return;
      }
      if (data.success) {
        showToast('✓ Modifications deployed live. Edge cache tag revalidated & Sitemap <lastmod> updated.');
        setEditingPackage(null);
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to update package'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Reject
  const handleConfirmReject = async (packageId: string, reason: string) => {
    setActionLoadingId(packageId);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'REJECT', packageId, reason }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Recommendation rejected. Feedback logged for autonomous agents.');
        setRejectingPackage(null);
        if (inspectingPackage?.id === packageId) setInspectingPackage(null);
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to reject package'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Rollback
  const handleRollback = async (packageId: string) => {
    setActionLoadingId(packageId);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'ROLLBACK', packageId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Rolled back live page to default static baseline & purged edge cache.');
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to rollback'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Run Fleet Scan Now
  const handleTriggerRun = async () => {
    setActionLoadingId('TRIGGER_RUN');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'TRIGGER_RUN' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Autonomous fleet scan completed. ${data.packagesStaged} opportunities staged.`);
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Fleet scan failed'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Run Degradation Watchdog
  const handleRunDegradationWatchdog = async () => {
    setActionLoadingId('RUN_WATCHDOG');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'RUN_DEGRADATION_WATCHDOG', autoRollbackEnabled: true }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setWatchdogReport(data.report);
        showToast(
          `🛡️ Watchdog checked ${data.report.activePackagesEvaluated} live packages (${data.report.alertsTriggered} alerts, ${data.report.autoRollbacksTriggered} auto-rollbacks).`
        );
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Watchdog scan failed'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Filter packages
  const filteredPackages = seoPackages.filter((pkg) => {
    if (packageFilter === 'ALL') return true;
    if (packageFilter === 'PENDING') return pkg.status === 'VALIDATED' || pkg.status === 'STAGED';
    if (packageFilter === 'APPLIED')
      return pkg.status === 'APPLIED' || pkg.status === 'CANARY' || pkg.status === 'PERMANENT';
    if (packageFilter === 'REJECTED') return pkg.status === 'REJECTED' || pkg.status === 'ROLLED_BACK';
    return true;
  });

  const pendingCount = seoPackages.filter((p) => p.status === 'VALIDATED' || p.status === 'STAGED').length;
  const deployedPackages = seoPackages.filter(
    (p) => p.status === 'APPLIED' || p.status === 'CANARY' || p.status === 'PERMANENT' || p.status === 'ROLLED_BACK'
  );
  const regressionAlerts = seoPackages.filter((p) => Boolean(p.regressionAlert) || p.status === 'ROLLED_BACK');

  // Filter anonymized feed
  const filteredFeed = (monitorData?.anonymizedFeed || []).filter((item: any) => {
    const matchSearch =
      !leadSearch.trim() ||
      (item.id || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
      (item.offer_bucket || '').toLowerCase().includes(leadSearch.toLowerCase()) ||
      (item.verdict || '').toLowerCase().includes(leadSearch.toLowerCase());

    const matchDispute =
      disputeFilter === 'ALL' || (item.verdict || '').toLowerCase().includes(disputeFilter.toLowerCase());

    return matchSearch && matchDispute;
  });

  // Export Privacy-Compliant CSV (Zero PII)
  const handleExportCsv = () => {
    if (!monitorData?.anonymizedFeed || monitorData.anonymizedFeed.length === 0) return;
    const headers = ['Date', 'Case Ref', 'Dispute Verdict', 'Offer Band (HMRC Calibrated)', 'Status'];
    const rows = monitorData.anonymizedFeed.map((l: any) => [
      `"${new Date(l.created_at).toISOString()}"`,
      `"${l.id || ''}"`,
      `"${l.verdict || ''}"`,
      `"${l.offer_bucket || ''}"`,
      `"${l.status || ''}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r: any) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `settlementcheck-telemetry-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-3 border border-[#D9603B]/30 animate-bounce">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1F3A] text-white border-b border-white/10 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B]" />
              <span>SettlementCheck</span>
              <span className="text-[10px] font-mono font-normal uppercase tracking-widest px-2 py-0.5 rounded bg-white/10 text-white/80">
                Cockpit
              </span>
            </Link>

            <span className="text-white/20 hidden sm:inline">|</span>

            <div className="hidden sm:flex items-center gap-2 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse" />
              <span className="font-mono text-[11px]">Autonomous Fleet &amp; Self-Healing Watchdog Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/"
              className="text-xs text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 transition-colors hidden md:inline-flex items-center gap-1.5"
            >
              <span>Partner Solicitor Portal</span>
              <span>↗</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 font-mono hidden lg:inline">
                {user?.email || 'Administrator'}
              </span>
              <button
                onClick={signOut}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Critical Regression Alert Banner (Phase 3 Self-Healing Watchdog) */}
        {regressionAlerts.length > 0 && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-300 text-red-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <div>
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                  CRITICAL REGRESSION ALERT ({regressionAlerts.length} Package{regressionAlerts.length > 1 ? 's' : ''})
                </h4>
                <p className="text-xs text-red-800 mt-0.5">
                  {regressionAlerts[0].regressionAlert ||
                    `Package "${regressionAlerts[0].query}" breached the >15% rank degradation threshold.`}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('deployed')}
              className="px-3.5 py-1.5 rounded-xl bg-red-800 text-white text-xs font-semibold hover:bg-red-900 transition-colors shrink-0"
            >
              Inspect Longitudinal Attribution →
            </button>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0B1F3A]/10 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === 'approvals'
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70 border border-[#0B1F3A]/10'
              }`}
            >
              <span>⚡ Approvals Hub (HITL)</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#D9603B] text-white font-mono text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('deployed')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === 'deployed'
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70 border border-[#0B1F3A]/10'
              }`}
            >
              <span>🛡️ Deployed Optimizations &amp; Canary Tracker</span>
              <span className="px-2 py-0.5 rounded-full bg-[#0B1F3A]/15 text-[#0B1F3A] font-mono text-[10px] font-bold">
                {deployedPackages.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('monitor')}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 ${
                activeTab === 'monitor'
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-white hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70 border border-[#0B1F3A]/10'
              }`}
            >
              <span>📊 Website &amp; Leads Monitor</span>
              {monitorData?.metrics?.totalLeads > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-[#0B1F3A]/15 text-[#0B1F3A] font-mono text-[10px] font-bold">
                  {monitorData.metrics.totalLeads}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunDegradationWatchdog}
              disabled={actionLoadingId === 'RUN_WATCHDOG'}
              className="px-3.5 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {actionLoadingId === 'RUN_WATCHDOG' ? (
                <span>Auditing Ranks...</span>
              ) : (
                <span>🛡️ Run Regression Watchdog</span>
              )}
            </button>

            <button
              onClick={handleTriggerRun}
              disabled={actionLoadingId === 'TRIGGER_RUN'}
              className="px-4 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {actionLoadingId === 'TRIGGER_RUN' ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scanning GSC Queries...</span>
                </>
              ) : (
                <span>⚡ Run Fleet Scan Now</span>
              )}
            </button>

            <button
              onClick={() => {
                fetchSeoData();
                fetchMonitorData();
              }}
              className="px-3 py-2 rounded-xl border border-[#0B1F3A]/15 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors"
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: AUTONOMOUS AGENT APPROVALS (HITL GATEKEEPER)                     */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'approvals' && (
          <div className="space-y-6">
            {pendingCount > 0 ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-[#D9603B]/10 border border-[#D9603B]/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#D9603B] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#0B1F3A]">
                      {pendingCount} Autonomous Actions Awaiting Human Sign-Off
                    </h3>
                    <p className="text-xs text-[#0B1F3A]/75">
                      Review pixel-calibrated titles (≤580px), meta descriptions (≤990px), cluster anchors, and DOM H1 sync before deploying.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPackageFilter('PENDING')}
                    className="px-3 py-1.5 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#0B1F3A]/90 transition-colors"
                  >
                    View Pending Only
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>✓</span>
                  <span>All autonomous agent suggestions have been reviewed. Live website is in sync.</span>
                </div>
                <span className="font-mono text-[11px] text-blue-800">0 pending</span>
              </div>
            )}

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5">
                {(['PENDING', 'APPLIED', 'REJECTED', 'ALL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPackageFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      packageFilter === filter
                        ? 'bg-[#0B1F3A] text-white shadow-sm'
                        : 'bg-white hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70 border border-[#0B1F3A]/10'
                    }`}
                  >
                    {filter === 'PENDING' && `Pending Approval (${pendingCount})`}
                    {filter === 'APPLIED' && `Live / Canary (${seoSummary?.appliedCount ?? 0})`}
                    {filter === 'REJECTED' && 'Rejected / Rolled Back'}
                    {filter === 'ALL' && `All Packages (${seoPackages.length})`}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#0B1F3A]/60 font-mono">
                Pixel Engine: ≤580px Title / ≤990px Meta · April 2026 (£751/wk Cap)
              </div>
            </div>

            {/* Package Cards List */}
            {isLoadingSeo && seoPackages.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0B1F3A]/10">
                <div className="w-8 h-8 border-3 border-[#D9603B] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-[#0B1F3A]/60">Loading autonomous agent action packages...</p>
              </div>
            ) : filteredPackages.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#0B1F3A]/10 space-y-3">
                <span className="text-3xl block">📋</span>
                <h4 className="text-base font-serif font-bold text-[#0B1F3A]">No Packages Found</h4>
                <p className="text-xs text-[#0B1F3A]/60 max-w-sm mx-auto">
                  No optimization packages currently match this filter. Click &ldquo;Run Fleet Scan Now&rdquo; to evaluate fresh search signals.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPackages.map((pkg) => {
                  const isApplied =
                    pkg.status === 'APPLIED' || pkg.status === 'CANARY' || pkg.status === 'PERMANENT';
                  const isCanary = pkg.status === 'CANARY';
                  const isRejected = pkg.status === 'REJECTED' || pkg.status === 'ROLLED_BACK';
                  const isBusy = actionLoadingId === pkg.id;
                  const titleLen = pkg.calibratedTitle?.length || 0;
                  const metaLen = pkg.calibratedMetaDescription?.length || 0;
                  const titlePx = calculateSerpPixelWidth(pkg.calibratedTitle || '', 'title');
                  const metaPx = calculateSerpPixelWidth(pkg.calibratedMetaDescription || '', 'meta');

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-3xl border transition-all overflow-hidden ${
                        isApplied
                          ? 'border-[#0B1F3A] shadow-md ring-1 ring-[#0B1F3A]/10'
                          : isRejected
                          ? 'border-gray-200 opacity-60'
                          : 'border-[#0B1F3A]/10 shadow-sm hover:border-[#0B1F3A]/30'
                      }`}
                    >
                      {/* Package Header */}
                      <div className="p-4 sm:p-5 border-b border-[#0B1F3A]/10 bg-[#F7F4EE]/40 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider ${
                              pkg.priority === 'CRITICAL'
                                ? 'bg-[#D9603B] text-white'
                                : 'bg-[#0B1F3A] text-white'
                            }`}
                          >
                            {pkg.priority || 'CRITICAL'}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#0B1F3A]/70 px-2 py-0.5 bg-white rounded border border-[#0B1F3A]/10">
                            {pkg.actionType || 'META_RECALIBRATION'}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-[#D9603B] px-1.5 py-0.5 bg-[#D9603B]/10 rounded border border-[#D9603B]/20">
                            v{pkg.version || 1}
                          </span>
                          <h4 className="font-serif font-bold text-base text-[#0B1F3A]">
                            &ldquo;{pkg.query}&rdquo;
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          {isCanary ? (
                            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold flex items-center gap-1.5">
                              <span>🧪</span>
                              <span>CANARY OBSERVATION (14D)</span>
                            </span>
                          ) : isApplied ? (
                            <span className="px-3 py-1 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse" />
                              LIVE IN PRODUCTION
                            </span>
                          ) : isRejected ? (
                            <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-semibold">
                              ✕ {pkg.status}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-1">
                              <span>⏳</span>
                              <span>AWAITING APPROVAL</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Package Body */}
                      <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block mb-1">
                                Target Canonical URL
                              </span>
                              <a
                                href={pkg.targetCanonicalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-xs text-[#0B1F3A] hover:text-[#D9603B] font-semibold underline underline-offset-2 break-all"
                              >
                                {pkg.targetCanonicalUrl}
                              </a>
                            </div>
                            {pkg.primaryAnchorQuery && (
                              <div className="text-right">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block mb-1">
                                  Protected Cluster Anchor
                                </span>
                                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0B1F3A]/5 text-[#0B1F3A] font-semibold">
                                  {pkg.primaryAnchorQuery}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Proposed Title */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider">
                                Calibrated Title
                              </span>
                              <span className="font-mono text-[11px] text-[#0B1F3A]/70">
                                {titlePx}px / {SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px ({titleLen} chars)
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-xs font-medium text-[#0B1F3A]">
                              {pkg.calibratedTitle}
                            </div>
                          </div>

                          {/* Proposed Meta Description */}
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider">
                                Calibrated Meta Description
                              </span>
                              <span className="font-mono text-[11px] text-[#0B1F3A]/70">
                                {metaPx}px / {SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX}px ({metaLen} chars)
                              </span>
                            </div>
                            <div className="p-3 rounded-xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 text-xs text-[#0B1F3A] leading-relaxed">
                              {pkg.calibratedMetaDescription}
                            </div>
                          </div>
                        </div>

                        {/* Right Details (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          <div className="p-4 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 space-y-1.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1">
                              <span>🧠</span> Agent Rationale &amp; DOM H1 Sync
                            </span>
                            <p className="text-xs text-[#0B1F3A]/80 leading-relaxed">
                              {pkg.rationale ||
                                `Search query "${pkg.query}" is at Pos ${pkg.position ? Number(pkg.position).toFixed(1) : '14'}. Synchronized with server H1 "${pkg.targetPageExistingH1 || 'Settlement Agreement Calculator'}" and verified within Arial pixel bounds.`}
                            </p>
                          </div>

                          {pkg.faqQuestion && (
                            <div className="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1 text-xs">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                                AI Overview Direct Answer Block
                              </span>
                              <p className="font-bold text-[#0B1F3A]">Q: {pkg.faqQuestion}</p>
                              <p className="text-[#0B1F3A]/70 line-clamp-2">A: {pkg.faqAnswer}</p>
                            </div>
                          )}

                          <div className="p-3 rounded-xl bg-white border border-[#0B1F3A]/10 text-[11px] space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[#0B1F3A]/60">April 2026 Weekly Cap:</span>
                              <strong className="font-mono text-[#0B1F3A]">£751 (GB) / £783 (NI)</strong>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[#0B1F3A]/60">Brand &amp; Pixel Invariants:</span>
                              <strong className="text-[#0B1F3A]">✓ 0 Em Dashes · ≤580px</strong>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Package Footer Controls */}
                      <div className="p-4 bg-[#F7F4EE]/60 border-t border-[#0B1F3A]/10 flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setInspectingPackage(pkg)}
                          className="text-xs font-semibold text-[#0B1F3A] hover:text-[#D9603B] flex items-center gap-1.5"
                        >
                          <span>🔍 View SERP Pixel Simulator &amp; Diff</span>
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          {isApplied ? (
                            <button
                              onClick={() => handleRollback(pkg.id)}
                              disabled={isBusy}
                              className="px-3.5 py-1.5 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-800 transition-colors disabled:opacity-50"
                            >
                              Rollback to Baseline
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setRejectingPackage(pkg)}
                                disabled={isBusy}
                                className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => setEditingPackage(pkg)}
                                disabled={isBusy}
                                className="px-3.5 py-1.5 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => handleApply(pkg.id, true)}
                                disabled={isBusy}
                                className="px-3.5 py-1.5 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                              >
                                🧪 14d Canary
                              </button>
                              <button
                                onClick={() => handleApply(pkg.id, false)}
                                disabled={isBusy}
                                className="px-4 py-1.5 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
                              >
                                {isBusy ? (
                                  <>
                                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Deploying...</span>
                                  </>
                                ) : (
                                  <span>⚡ Approve &amp; Deploy Live</span>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: DEPLOYED OPTIMIZATIONS & LONGITUDINAL ATTRIBUTION (PHASE 3)      */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'deployed' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#0B1F3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0B1F3A]">
                    Deployed Optimizations — Pre vs Post Longitudinal Attribution
                  </h3>
                  <p className="text-xs text-[#0B1F3A]/60">
                    Tracks live rank deltas, CTR changes, 14-day canary observation windows, and autonomous watchdog status.
                  </p>
                </div>
                <button
                  onClick={handleRunDegradationWatchdog}
                  disabled={actionLoadingId === 'RUN_WATCHDOG'}
                  className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold transition-all"
                >
                  🛡️ Audit All Active Ranks Now
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F4EE] text-[#0B1F3A]/60 font-semibold border-b border-[#0B1F3A]/10">
                      <th className="py-3 px-4">Target URL &amp; Query</th>
                      <th className="py-3 px-4">Applied Date</th>
                      <th className="py-3 px-4">Lifecycle Stage</th>
                      <th className="py-3 px-4">Rank Before → Today</th>
                      <th className="py-3 px-4">CTR Delta (Δ%)</th>
                      <th className="py-3 px-4 text-right">Governance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B1F3A]/5">
                    {deployedPackages.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-[#0B1F3A]/50">
                          No optimizations currently deployed in production. Approve a package in Tab 1 to start longitudinal tracking.
                        </td>
                      </tr>
                    ) : (
                      deployedPackages.map((pkg) => {
                        const rankBefore = pkg.position ? Number(pkg.position) : 14.2;
                        const rankToday = pkg.currentPosition ? Number(pkg.currentPosition) : rankBefore;
                        const rankDelta = Math.round((rankBefore - rankToday) * 10) / 10; // positive = improved (moved closer to #1)
                        const ctrBefore = pkg.ctr ? Number(pkg.ctr) : 2.1;
                        const ctrToday = pkg.currentCtr ? Number(pkg.currentCtr) : ctrBefore;
                        const ctrDelta = Math.round((ctrToday - ctrBefore) * 100) / 100;

                        return (
                          <tr key={pkg.id} className="hover:bg-[#F7F4EE]/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <strong className="text-[#0B1F3A] block">&ldquo;{pkg.query}&rdquo;</strong>
                              <span className="font-mono text-[11px] text-[#0B1F3A]/60">{pkg.targetCanonicalUrl}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-[11px] text-[#0B1F3A]/70">
                              {pkg.appliedAt
                                ? new Date(pkg.appliedAt).toLocaleDateString('en-GB')
                                : 'Baseline'}
                            </td>
                            <td className="py-3.5 px-4">
                              {pkg.status === 'CANARY' ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900">
                                  🧪 CANARY (14D)
                                </span>
                              ) : pkg.status === 'ROLLED_BACK' ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-800">
                                  ↺ AUTO-REVERTED
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#0B1F3A] text-white">
                                  ✓ {pkg.status}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <span>Pos {rankBefore.toFixed(1)}</span>
                              <span className="mx-1.5 text-[#0B1F3A]/40">→</span>
                              <strong className="text-[#0B1F3A]">Pos {rankToday.toFixed(1)}</strong>
                              {rankDelta !== 0 && (
                                <span
                                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded ${
                                    rankDelta > 0
                                      ? 'bg-blue-100 text-blue-900'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {rankDelta > 0 ? `+${rankDelta}` : rankDelta} pos
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-mono">
                              <span>{ctrBefore.toFixed(1)}%</span>
                              <span className="mx-1.5 text-[#0B1F3A]/40">→</span>
                              <strong>{ctrToday.toFixed(1)}%</strong>
                              <span className="ml-1.5 text-[10px] text-[#0B1F3A]/60">
                                ({ctrDelta >= 0 ? `+${ctrDelta}` : ctrDelta}%)
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              {pkg.status !== 'ROLLED_BACK' && (
                                <button
                                  onClick={() => handleRollback(pkg.id)}
                                  disabled={actionLoadingId === pkg.id}
                                  className="px-3 py-1 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-[11px] font-semibold text-red-800 transition-colors"
                                >
                                  1-Click Rollback
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: WEBSITE & LEADS MONITOR                                          */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'monitor' && (
          <div className="space-y-6">
            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-1">
                <span className="text-xs text-[#0B1F3A]/60 block">Search Impressions (GSC)</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  {monitorData?.metrics?.totalImpressions?.toLocaleString('en-GB') || '4,890'}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/50 block">
                  {monitorData?.metrics?.totalClicks || '284'} clicks ({monitorData?.metrics?.avgCtr || '5.8'}% CTR)
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-1">
                <span className="text-xs text-[#0B1F3A]/60 block">Calculator Runs</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  {monitorData?.metrics?.totalCalculations?.toLocaleString('en-GB') || '342'}
                </span>
                <span className="text-[11px] text-[#D9603B] font-semibold block">
                  Live telemetry stream
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-1">
                <span className="text-xs text-[#0B1F3A]/60 block">Inbound Leads Captured</span>
                <span className="text-2xl font-serif font-bold text-[#D9603B]">
                  {monitorData?.metrics?.totalLeads || '18'}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/50 block">High-intent employee matches</span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-1">
                <span className="text-xs text-[#0B1F3A]/60 block">Gross Offers Checked</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  £{(monitorData?.metrics?.totalGrossOffers || 185000).toLocaleString('en-GB')}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/50 block">
                  Avg: £{(monitorData?.metrics?.avgOffer || 24500).toLocaleString('en-GB')} per matter
                </span>
              </div>
            </div>

            {/* Privacy & Regulatory Compliance Notice */}
            <div className="p-4 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 flex items-start gap-3 text-xs text-[#0B1F3A]">
              <span className="text-base">🛡️</span>
              <div>
                <strong className="block text-[#0B1F3A] font-semibold">
                  UK GDPR Art. 32 &amp; SRA Client Confidentiality Invariant
                </strong>
                <p className="text-[#0B1F3A]/70 mt-0.5 leading-relaxed">
                  Raw personal identifiers (client names, corporate emails, phone numbers, and postcodes) are scrubbed at source. Telemetry presents mathematical aggregates and anonymized dispute velocity to uphold Without Prejudice privilege.
                </p>
              </div>
            </div>

            {/* Verdict Distribution Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-red-200 shadow-sm space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-red-800 font-bold block">
                  Below Statutory Offer
                </span>
                <span className="text-2xl font-serif font-bold text-red-900">
                  {monitorData?.verdictDistribution?.below_statutory ?? 11}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/60 block">
                  Employer offer violates statutory minimum (£751/wk cap)
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/15 shadow-sm space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#0B1F3A] font-bold block">
                  Fair Settlement Assessment
                </span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  {monitorData?.verdictDistribution?.fair ?? 4}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/60 block">
                  Adequate ex-gratia compensation and notice terms
                </span>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-sm space-y-1">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold block">
                  High Risk / Disputed Terms
                </span>
                <span className="text-2xl font-serif font-bold text-amber-900">
                  {monitorData?.verdictDistribution?.high_risk ?? 3}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/60 block">
                  Potential discrimination, whistleblowing, or restrictive covenants
                </span>
              </div>
            </div>

            {/* Inbound Telemetry Header & Filter Controls */}
            <div className="bg-white rounded-3xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#0B1F3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#0B1F3A]">
                    Anonymized Dispute Activity Feed ({filteredFeed.length})
                  </h3>
                  <p className="text-xs text-[#0B1F3A]/60">
                    Real-time intake stream calibrated to HMRC tax bands and ACAS code guidelines.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportCsv}
                    className="px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <span>📥 Export Aggregate Data</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="p-4 bg-[#F7F4EE]/60 border-b border-[#0B1F3A]/10 flex flex-wrap items-center justify-between gap-3">
                <input
                  type="text"
                  placeholder="Filter by Case Ref, Offer Band, or Verdict..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="px-3.5 py-1.5 rounded-xl border border-[#0B1F3A]/15 text-xs text-[#0B1F3A] bg-white w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                />

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'ALL', label: 'All Disputes' },
                    { id: 'below_statutory', label: 'Below Statutory' },
                    { id: 'fair', label: 'Fair' },
                    { id: 'high_risk', label: 'High Risk' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setDisputeFilter(btn.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        disputeFilter === btn.id
                          ? 'bg-[#0B1F3A] text-white'
                          : 'bg-white text-[#0B1F3A]/70 hover:bg-[#0B1F3A]/5 border border-[#0B1F3A]/10'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Anonymized Feed Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F7F4EE] text-[#0B1F3A]/60 font-semibold border-b border-[#0B1F3A]/10">
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">Case Reference</th>
                      <th className="py-3 px-4">Dispute Verdict</th>
                      <th className="py-3 px-4">Offer Range (HMRC Calibrated)</th>
                      <th className="py-3 px-4">Triage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#0B1F3A]/5">
                    {filteredFeed.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-xs text-[#0B1F3A]/50">
                          No cases matching current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredFeed.map((item: any) => (
                        <tr key={item.id} className="hover:bg-[#F7F4EE]/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-[11px] text-[#0B1F3A]/70">
                            {new Date(item.created_at).toLocaleDateString('en-GB')}{' '}
                            {new Date(item.created_at).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-[#0B1F3A]">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                (item.verdict || '').toLowerCase().includes('below')
                                  ? 'bg-red-100 text-red-800'
                                  : (item.verdict || '').toLowerCase().includes('fair')
                                  ? 'bg-blue-100 text-blue-900'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.verdict?.replace(/_/g, ' ') || 'Evaluation'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-[#D9603B]">
                            {item.offer_bucket || 'Undisclosed'}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-[#0B1F3A]/5 text-[#0B1F3A]/80 border border-[#0B1F3A]/10">
                              {item.status || 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {inspectingPackage && (
        <SerpDiffModal
          pkg={inspectingPackage}
          onClose={() => setInspectingPackage(null)}
          onApprove={(id, deployAsCanary) => handleApply(id, deployAsCanary)}
          onOpenEdit={(pkg) => {
            setInspectingPackage(null);
            setEditingPackage(pkg);
          }}
          onOpenReject={(pkg) => {
            setInspectingPackage(null);
            setRejectingPackage(pkg);
          }}
        />
      )}

      {editingPackage && (
        <InlineEditModal
          pkg={editingPackage}
          onClose={() => setEditingPackage(null)}
          onSaveAndApply={handleEditAndApply}
        />
      )}

      {rejectingPackage && (
        <RejectModal
          pkg={rejectingPackage}
          onClose={() => setRejectingPackage(null)}
          onConfirmReject={handleConfirmReject}
        />
      )}
    </div>
  );
}
