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
import CockpitDateFilter, { DateRangeMeta } from './components/CockpitDateFilter';
import CockpitPerformanceChart from './components/CockpitPerformanceChart';

export default function CockpitClient() {
  const { user, getIdToken, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'approvals' | 'deployed' | 'monitor'>('approvals');

  // Tab 1 & 2: SEO Packages & Curated Policy Registry State
  const [seoPackages, setSeoPackages] = useState<any[]>([]);
  const [seoPolicies, setSeoPolicies] = useState<any[]>([]);
  const [showPolicyDrawer, setShowPolicyDrawer] = useState<boolean>(false);
  const [seoSummary, setSeoSummary] = useState<{
    totalPackages: number;
    appliedCount: number;
    canaryCount?: number;
    validatedCount: number;
    stagedCount: number;
    regressionCount?: number;
    activePoliciesCount?: number;
  } | null>(null);
  const [isLoadingSeo, setIsLoadingSeo] = useState<boolean>(false);
  const [packageFilter, setPackageFilter] = useState<'ALL' | 'PENDING' | 'APPLIED' | 'REJECTED'>('PENDING');
  const [riskFilter, setRiskFilter] = useState<'ALL_RISK' | 'LOW_RISK' | 'MEDIUM_RISK' | 'HIGH_CRITICAL_RISK'>('ALL_RISK');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [adversarialLoadingId, setAdversarialLoadingId] = useState<string | null>(null);
  const [watchdogReport, setWatchdogReport] = useState<any | null>(null);
  const [highlightedPackageId, setHighlightedPackageId] = useState<string | null>(null);

  // Tab 3: Monitor & Leads State
  const [monitorData, setMonitorData] = useState<any>(null);
  const [isLoadingMonitor, setIsLoadingMonitor] = useState<boolean>(false);
  const [dateRangePreset, setDateRangePreset] = useState<string>('28d');
  const [customStartDate, setCustomStartDate] = useState<string | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<string | undefined>(undefined);
  const [leadSearch, setLeadSearch] = useState('');
  const [disputeFilter, setDisputeFilter] = useState('ALL');

  // Modals
  const [inspectingPackage, setInspectingPackage] = useState<any | null>(null);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [rejectingPackage, setRejectingPackage] = useState<any | null>(null);
  const [confirmDeployPackage, setConfirmDeployPackage] = useState<{ pkg: any; asCanary: boolean } | null>(null);
  const [showMobileActions, setShowMobileActions] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 5000);
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

  // Fetch SEO Packages & Policy Registry
  const fetchSeoData = async () => {
    setIsLoadingSeo(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', { headers });
      const data = await res.json();
      if (data.success) {
        setSeoSummary(data.summary);
        setSeoPackages(data.packages || []);
        setSeoPolicies(data.policies || []);
      }
    } catch (err) {
      console.error('Failed to load SEO data', err);
    } finally {
      setIsLoadingSeo(false);
    }
  };

  // Fetch Monitor & Leads with dynamic date horizon
  const fetchMonitorData = async (
    preset = dateRangePreset,
    startDate = customStartDate,
    endDate = customEndDate
  ) => {
    setIsLoadingMonitor(true);
    try {
      const headers = await getAuthHeaders();
      const params = new URLSearchParams();
      if (preset) params.set('preset', preset);
      if (startDate) params.set('startDate', startDate);
      if (endDate) params.set('endDate', endDate);

      const res = await fetch(`/api/cockpit/monitor/?${params.toString()}`, { headers });
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

  const handleSelectDateRange = (preset: string, start?: string, end?: string) => {
    setDateRangePreset(preset);
    setCustomStartDate(start);
    setCustomEndDate(end);
    fetchMonitorData(preset, start, end);
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
          packageSnapshot: targetPkg,
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

  // Batch Approve Low-Risk Pending Packages
  const handleBatchApproveLowRisk = async () => {
    setActionLoadingId('BATCH_LOW_RISK');
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'APPLY_LOW_RISK' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Batch-approved ${data.appliedCount} Low-Risk additive package(s). Live headlines untouched.`);
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to batch approve'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // On-Demand Adversarial Head of SEO Challenge
  const handleAdversarialChallenge = async (pkg: any) => {
    setAdversarialLoadingId(pkg.id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'ADVERSARIAL_REVIEW',
          packageId: pkg.id,
          packageSnapshot: pkg,
        }),
      });
      const data = await res.json();
      if (data.success && data.review) {
        setSeoPackages(prev =>
          prev.map(item =>
            item.id === pkg.id
              ? { ...item, ...(data.package || {}), adversarialReview: data.review }
              : item
          )
        );
        const v = data.review.verdict;
        showToast(
          v === 'VETO_DESTRUCTIVE'
            ? '⚔️ Head of SEO VETO: Destructive title overwrite flagged. Counter-Plan generated.'
            : v === 'COUNTER_PLAN_RECOMMENDED'
            ? '⚔️ Head of SEO found strategic improvements. Review the Counter-Plan below.'
            : '✓ Head of SEO verified this package is safe to deploy.'
        );
      } else {
        showToast(`Error: ${data.error || 'Adversarial review failed'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setAdversarialLoadingId(null);
    }
  };

  // Apply Adversarial Head of SEO Counter-Plan (and optionally promote policy rule)
  const handleApplyCounterPlan = async (pkg: any, deployAsCanary = true, savePolicyRule = true) => {
    const counter = pkg.adversarialReview?.counterProposal;
    if (!counter) return;

    setActionLoadingId(pkg.id);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'EDIT_AND_APPLY',
          packageId: pkg.id,
          expectedVersion: pkg.version || 1,
          packageSnapshot: pkg,
          updates: {
            calibratedTitle: counter.calibratedTitle,
            calibratedMetaDescription: counter.calibratedMetaDescription,
            faqQuestion: counter.faqQuestion,
            faqAnswer: counter.faqAnswer,
            contextualLinkSnippet: counter.contextualLinkSnippet,
            actuationScope: counter.actuationScope,
            deployAsCanary,
            promotePolicyRule: savePolicyRule ? pkg.adversarialReview?.candidatePolicyRule : undefined,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          savePolicyRule && data.promotedRule
            ? `⚔️ Counter-Plan deployed & Policy Rule "${data.promotedRule.ruleTitle}" saved to Guardrail Registry!`
            : '⚔️ Head of SEO Counter-Plan deployed live!'
        );
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to apply counter-plan'}`);
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
          packageSnapshot: targetPkg,
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
      const targetPkg = seoPackages.find(p => p.id === packageId);
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'REJECT',
          packageId,
          reason,
          packageSnapshot: targetPkg,
          policyRuleToPromote: targetPkg?.adversarialReview?.candidatePolicyRule,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          data.promotedRule
            ? `✓ Rejected & Guardrail Rule "${data.promotedRule.ruleTitle}" saved so agents never repeat this.`
            : '✓ Recommendation rejected & logged.'
        );
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

  // Dismiss Regression Alert
  const handleDismissAlert = async (packageId: string) => {
    setActionLoadingId(`DISMISS_${packageId}`);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'DISMISS_ALERT',
          packageId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Regression alert acknowledged and dismissed.');
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to dismiss alert'}`);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Inspect package in Tab 2 (switches tab, highlights row, and smooth-scrolls)
  const handleInspectPackage = (packageId?: string) => {
    setActiveTab('deployed');
    if (packageId) {
      setHighlightedPackageId(packageId);
    }
    setTimeout(() => {
      const el = packageId ? document.getElementById(`package-row-${packageId}`) : null;
      const target = el || document.getElementById('deployed-optimizations-table');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Rollback
  const handleRollback = async (packageId: string) => {
    setActionLoadingId(packageId);
    try {
      const targetPkg = seoPackages.find(p => p.id === packageId);
      const headers = await getAuthHeaders();
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'ROLLBACK',
          packageId,
          packageSnapshot: targetPkg,
        }),
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

  // Filter packages by lifecycle status + deploymentRisk
  const statusFilteredPackages = seoPackages.filter((pkg) => {
    if (packageFilter === 'ALL') return true;
    if (packageFilter === 'PENDING') return pkg.status === 'VALIDATED' || pkg.status === 'STAGED';
    if (packageFilter === 'APPLIED')
      return pkg.status === 'APPLIED' || pkg.status === 'CANARY' || pkg.status === 'PERMANENT';
    if (packageFilter === 'REJECTED') return pkg.status === 'REJECTED' || pkg.status === 'ROLLED_BACK';
    return true;
  });

  const filteredPackages = statusFilteredPackages.filter((pkg) => {
    const risk = pkg.deploymentRisk || 'MEDIUM_RISK';
    if (riskFilter === 'ALL_RISK') return true;
    if (riskFilter === 'LOW_RISK') return risk === 'LOW_RISK';
    if (riskFilter === 'MEDIUM_RISK') return risk === 'MEDIUM_RISK';
    if (riskFilter === 'HIGH_CRITICAL_RISK') return risk === 'HIGH_RISK' || risk === 'CRITICAL_RISK';
    return true;
  });

  const pendingPackages = seoPackages.filter((p) => p.status === 'VALIDATED' || p.status === 'STAGED');
  const pendingCount = pendingPackages.length;
  const pendingLowRiskCount = pendingPackages.filter((p) => p.deploymentRisk === 'LOW_RISK').length;
  const lowRiskCount = statusFilteredPackages.filter((p) => p.deploymentRisk === 'LOW_RISK').length;
  const mediumRiskCount = statusFilteredPackages.filter((p) => p.deploymentRisk === 'MEDIUM_RISK').length;
  const highCriticalRiskCount = statusFilteredPackages.filter(
    (p) => p.deploymentRisk === 'HIGH_RISK' || p.deploymentRisk === 'CRITICAL_RISK'
  ).length;

  const deployedPackages = seoPackages.filter(
    (p) => p.status === 'APPLIED' || p.status === 'CANARY' || p.status === 'PERMANENT' || p.status === 'ROLLED_BACK'
  );
  const regressionAlerts = seoPackages.filter((p) => Boolean(p.regressionAlert));

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

  const renderRiskBadge = (risk?: string, actuationScope?: string) => {
    const isAdditive = actuationScope === 'ADDITIVE_CONTENT_AND_LINKS';
    if (risk === 'LOW_RISK') {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider bg-[#0B1F3A]/10 text-[#0B1F3A] border border-[#0B1F3A]/20">
          🛡️ LOW RISK · {isAdditive ? 'SAFE ADDITIVE (HEADLINE LOCKED)' : 'SAFE UPDATE'}
        </span>
      );
    }
    if (risk === 'MEDIUM_RISK') {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
          ⚠️ MEDIUM RISK · SUB-PAGE HEADLINE UPDATE
        </span>
      );
    }
    if (risk === 'HIGH_RISK') {
      return (
        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider bg-[#D9603B]/15 text-[#D9603B] border border-[#D9603B]/30">
          🔥 HIGH RISK · PAGE 1 HEADLINE CHANGE
        </span>
      );
    }
    return (
      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider bg-red-100 text-red-900 border border-red-300">
        🚨 CRITICAL RISK · CORE PAGE HEADLINE OVERWRITE
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] font-sans pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] text-white px-5 py-3 rounded-2xl shadow-xl text-xs sm:text-sm font-semibold flex items-center gap-3 border border-[#D9603B]/30 animate-bounce max-w-lg">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#0B1F3A] text-white border-b border-white/10 px-3.5 sm:px-8 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="font-serif text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B]" />
              <span>SettlementCheck</span>
              <span className="text-[9px] sm:text-[10px] font-mono font-normal uppercase tracking-widest px-1.5 sm:px-2 py-0.5 rounded bg-white/10 text-white/80">
                Cockpit
              </span>
            </Link>

            <span className="text-white/20 hidden md:inline">|</span>

            <div className="hidden md:flex items-center gap-2 text-xs text-white/70">
              <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse" />
              <span className="font-mono text-[11px]">
                Adversarial SEO Head &amp; Blast-Radius Guardrails Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/portal/"
              className="text-xs text-white/80 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/15 hover:bg-white/5 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Solicitor Portal</span>
              <span>↗</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xs text-white/70 font-mono hidden xl:inline">
                {user?.email || 'Administrator'}
              </span>
              <button
                onClick={signOut}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-8 pt-5 sm:pt-6 space-y-6">
        {/* Critical Regression Alert Banner (Phase 3 Self-Healing Watchdog) */}
        {regressionAlerts.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-red-50 border border-red-300 text-red-900 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">🛡️</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-red-950">
                    Auto-Rollback Triggered ({regressionAlerts.length} Package{regressionAlerts.length > 1 ? 's' : ''})
                  </h4>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded-full border border-green-200">
                    Site Protected: Reverted to Baseline
                  </span>
                </div>
                <p className="text-xs text-red-800 mt-1 max-w-3xl leading-relaxed">
                  {regressionAlerts[0].regressionAlert ||
                    `Package "${regressionAlerts[0].query}" breached the rank degradation threshold. The automated watchdog immediately reverted your page back to the safe baseline.`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => handleInspectPackage(regressionAlerts[0].id)}
                className="px-3.5 py-2 rounded-xl bg-red-800 hover:bg-red-900 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>View Rollback Details</span>
                <span>↓</span>
              </button>
              <button
                onClick={() => handleDismissAlert(regressionAlerts[0].id)}
                disabled={actionLoadingId === `DISMISS_${regressionAlerts[0].id}`}
                className="px-3.5 py-2 rounded-xl border border-red-300 bg-white hover:bg-red-100 text-red-900 text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {actionLoadingId === `DISMISS_${regressionAlerts[0].id}` ? 'Dismissing...' : 'Acknowledge & Dismiss'}
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs Header */}
        <div className="space-y-3 border-b border-[#0B1F3A]/10 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Responsive Touch-Friendly Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar p-1 bg-[#0B1F3A]/5 rounded-2xl w-full md:w-auto">
              <button
                onClick={() => setActiveTab('approvals')}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  activeTab === 'approvals'
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70'
                }`}
              >
                <span>⚡ Approvals</span>
                {pendingCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#D9603B] text-white font-mono text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('deployed')}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  activeTab === 'deployed'
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70'
                }`}
              >
                <span>🛡️ Live &amp; Canary</span>
                <span className="px-1.5 py-0.5 rounded-full bg-[#0B1F3A]/15 text-[#0B1F3A] font-mono text-[10px] font-bold">
                  {deployedPackages.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('monitor')}
                className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  activeTab === 'monitor'
                    ? 'bg-[#0B1F3A] text-white shadow-sm'
                    : 'hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70'
                }`}
              >
                <span>📊 Leads &amp; Telemetry</span>
                {monitorData?.metrics?.totalLeads > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#0B1F3A]/15 text-[#0B1F3A] font-mono text-[10px] font-bold">
                    {monitorData.metrics.totalLeads}
                  </span>
                )}
              </button>
            </div>

            {/* Actions: Desktop Row + Mobile Compact Action Strip */}
            <div className="flex items-center gap-2 justify-between md:justify-end">
              {/* Desktop-only secondary buttons */}
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={() => setShowPolicyDrawer(!showPolicyDrawer)}
                  className="px-3 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-all flex items-center gap-1.5"
                >
                  <span>🧬 Guardrail Policies ({seoPolicies.length})</span>
                </button>

                <button
                  onClick={handleRunDegradationWatchdog}
                  disabled={actionLoadingId === 'RUN_WATCHDOG'}
                  className="px-3 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {actionLoadingId === 'RUN_WATCHDOG' ? (
                    <span>Auditing...</span>
                  ) : (
                    <span>🛡️ Watchdog Audit</span>
                  )}
                </button>
              </div>

              {/* Primary Run Scan button */}
              <button
                onClick={handleTriggerRun}
                disabled={actionLoadingId === 'TRIGGER_RUN'}
                className="px-3.5 sm:px-4 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                {actionLoadingId === 'TRIGGER_RUN' ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Scanning GSC...</span>
                  </>
                ) : (
                  <span>⚡ Run Fleet Scan</span>
                )}
              </button>

              {/* Refresh Button */}
              <button
                onClick={() => {
                  fetchSeoData();
                  fetchMonitorData();
                }}
                className="px-2.5 sm:px-3 py-2 rounded-xl border border-[#0B1F3A]/15 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors shrink-0"
                title="Refresh dashboard data"
              >
                🔄
              </button>

              {/* Mobile Overflow Menu (collapses policies & watchdog into clean dropdown) */}
              <div className="relative lg:hidden">
                <button
                  onClick={() => setShowMobileActions(!showMobileActions)}
                  className="px-3 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-all flex items-center gap-1"
                >
                  <span>••• Actions</span>
                </button>

                {showMobileActions && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#0B1F3A]/15 rounded-2xl shadow-xl z-30 p-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowPolicyDrawer(!showPolicyDrawer);
                        setShowMobileActions(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0B1F3A] hover:bg-[#0B1F3A]/5 flex items-center gap-2"
                    >
                      <span>🧬</span>
                      <span>Guardrail Policies ({seoPolicies.length})</span>
                    </button>
                    <button
                      onClick={() => {
                        handleRunDegradationWatchdog();
                        setShowMobileActions(false);
                      }}
                      disabled={actionLoadingId === 'RUN_WATCHDOG'}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[#0B1F3A] hover:bg-[#0B1F3A]/5 flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>🛡️</span>
                      <span>Run Watchdog Audit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Curated Guardrail Policy Registry Drawer (Phase 4 Learning Loop) */}
        {showPolicyDrawer && (
          <div className="p-5 rounded-3xl bg-white border border-[#0B1F3A]/15 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-serif font-bold text-[#0B1F3A] flex items-center gap-2">
                  <span>🧬</span>
                  <span>Curated SEO &amp; Statutory Guardrail Policy Registry ({seoPolicies.length} Active Rules)</span>
                </h4>
                <p className="text-xs text-[#0B1F3A]/65 mt-0.5">
                  Verified rules learned from Adversarial Head of SEO critiques and administrator decisions. Enforced deterministically before agents generate new packages.
                </p>
              </div>
              <button
                onClick={() => setShowPolicyDrawer(false)}
                className="text-xs font-semibold text-[#0B1F3A]/60 hover:text-[#0B1F3A]"
              >
                Close ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {seoPolicies.map((pol: any) => (
                <div
                  key={pol.id}
                  className="p-3.5 rounded-2xl bg-[#F7F4EE]/70 border border-[#0B1F3A]/10 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#0B1F3A] text-white font-mono text-[10px] font-bold">
                      {pol.scopeType}: {pol.scopeValue}
                    </span>
                    <span className="font-mono text-[10px] text-[#D9603B] font-semibold">
                      {pol.source === 'BASELINE_INVARIANT' ? 'Baseline Invariant' : 'Promoted Rule'}
                    </span>
                  </div>
                  <strong className="block text-[#0B1F3A] font-semibold">{pol.ruleTitle}</strong>
                  <p className="text-[#0B1F3A]/75 text-[11px] leading-relaxed">{pol.constraintDescription}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: AUTONOMOUS AGENT APPROVALS (HITL GATEKEEPER)                     */}
        {/* ═══════════════════════════════════════════════════════════════════════ */}
        {activeTab === 'approvals' && (
          <div className="space-y-5">
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
                      Categorised by Blast-Radius Risk Score. Use &ldquo;⚔️ Challenge with Head of SEO&rdquo; on any card for an adversarial critique &amp; counter-plan.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {pendingLowRiskCount > 0 && (
                    <button
                      onClick={handleBatchApproveLowRisk}
                      disabled={actionLoadingId === 'BATCH_LOW_RISK'}
                      className="px-3.5 py-1.5 rounded-lg bg-[#D9603B] text-white text-xs font-semibold hover:bg-[#D9603B]/90 transition-colors shadow-sm"
                    >
                      🛡️ Batch Approve {pendingLowRiskCount} Low-Risk Additive
                    </button>
                  )}
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

            {/* Status & Risk Filter Pills (Responsive Swipeable Rails) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-[#0B1F3A]/10">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0B1F3A]/50 mr-1 font-bold shrink-0">
                  Status:
                </span>
                {(['PENDING', 'APPLIED', 'REJECTED', 'ALL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setPackageFilter(filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      packageFilter === filter
                        ? 'bg-[#0B1F3A] text-white shadow-sm'
                        : 'bg-[#F7F4EE]/60 hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70 border border-[#0B1F3A]/10'
                    }`}
                  >
                    {filter === 'PENDING' && `Pending Approval (${pendingCount})`}
                    {filter === 'APPLIED' && `Live / Canary (${seoSummary?.appliedCount ?? 0})`}
                    {filter === 'REJECTED' && 'Rejected'}
                    {filter === 'ALL' && `All (${seoPackages.length})`}
                  </button>
                ))}
              </div>

              {/* Risk Score Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#0B1F3A]/50 mr-1 font-bold shrink-0">
                  Risk Score:
                </span>
                {[
                  { id: 'ALL_RISK', label: `All Risks (${statusFilteredPackages.length})` },
                  { id: 'LOW_RISK', label: `🛡️ Low / Safe (${lowRiskCount})` },
                  { id: 'MEDIUM_RISK', label: `⚠️ Medium (${mediumRiskCount})` },
                  { id: 'HIGH_CRITICAL_RISK', label: `🚨 High / Critical (${highCriticalRiskCount})` },
                ].map((rf) => (
                  <button
                    key={rf.id}
                    onClick={() => setRiskFilter(rf.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                      riskFilter === rf.id
                        ? 'bg-[#D9603B] text-white shadow-sm'
                        : 'bg-[#F7F4EE]/60 hover:bg-[#0B1F3A]/5 text-[#0B1F3A]/70 border border-[#0B1F3A]/10'
                    }`}
                  >
                    {rf.label}
                  </button>
                ))}
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
                <h4 className="text-base font-serif font-bold text-[#0B1F3A]">No Packages Match Filter</h4>
                <p className="text-xs text-[#0B1F3A]/60 max-w-sm mx-auto">
                  No optimization packages currently match the selected Status and Risk Score filter. Try switching to &ldquo;All Risks&rdquo; or run a fresh Fleet Scan.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredPackages.map((pkg) => {
                  const isApplied =
                    pkg.status === 'APPLIED' || pkg.status === 'CANARY' || pkg.status === 'PERMANENT';
                  const isCanary = pkg.status === 'CANARY';
                  const isRejected = pkg.status === 'REJECTED' || pkg.status === 'ROLLED_BACK';
                  const isBusy = actionLoadingId === pkg.id;
                  const isChallenging = adversarialLoadingId === pkg.id;
                  const isAdditive = pkg.actuationScope === 'ADDITIVE_CONTENT_AND_LINKS';
                  const titleLen = pkg.calibratedTitle?.length || 0;
                  const metaLen = pkg.calibratedMetaDescription?.length || 0;
                  const titlePx = calculateSerpPixelWidth(pkg.calibratedTitle || '', 'title');
                  const metaPx = calculateSerpPixelWidth(pkg.calibratedMetaDescription || '', 'meta');
                  const tradeOff = pkg.tradeOffSummary;
                  const advReview = pkg.adversarialReview;

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
                          {renderRiskBadge(pkg.deploymentRisk, pkg.actuationScope)}
                          <span className="font-mono text-[10px] font-semibold text-[#0B1F3A]/70 px-2 py-0.5 bg-white rounded border border-[#0B1F3A]/10">
                            {isAdditive ? 'ADDITIVE_FAQ_&_LINK' : 'FULL_HEADLINE_OVERWRITE'}
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

                      {/* The Ask Recommendation Hero Banner */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B1F3A] via-[#122B4D] to-[#0B1F3A] text-white border-b border-white/10">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#D9603B] text-white">
                                {isAdditive ? '💡 Additive Content Recommendation' : '⚠️ Live Headline Overwrite Recommendation'}
                              </span>
                              <span className="text-white/40 hidden sm:inline">•</span>
                              <span className="text-xs text-white/90 font-mono">
                                Target: <strong className="text-white underline">{pkg.targetCanonicalUrl}</strong>
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-serif font-bold text-white flex flex-wrap items-center gap-2">
                              {isAdditive ? (
                                <>
                                  <span>Add 1 Statutory FAQ Block &amp; Contextual Internal Link</span>
                                  <span className="text-[10px] font-sans font-medium text-emerald-300 bg-emerald-950/80 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                                    ✓ Live Headline Kept 100% Intact
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span>Update Live Google Headline (&lt;title&gt;) &amp; Add FAQ</span>
                                  <span className="text-[10px] font-sans font-medium text-amber-300 bg-amber-950/80 border border-amber-400/40 px-2 py-0.5 rounded-full">
                                    ⚠️ Modifies Live &lt;title&gt;
                                  </span>
                                </>
                              )}
                            </h3>
                            <p className="text-xs text-white/80 leading-relaxed max-w-2xl">
                              {tradeOff?.whyTriggered ||
                                `People searching Google for "${pkg.query}" currently find this page on Page 2 (Pos ${
                                  pkg.position ? Number(pkg.position).toFixed(1) : '15'
                                }). The agent recommends this update to capture Page 1 rankings.`}
                            </p>
                          </div>

                          {/* Metric Opportunity Card */}
                          <div className="shrink-0 bg-white/10 border border-white/15 rounded-2xl p-3 text-left sm:text-right">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-white/60 block font-semibold">
                              Search Opportunity
                            </span>
                            <div className="font-mono text-sm sm:text-base font-bold text-white flex items-center sm:justify-end gap-1.5">
                              <span>Pos {pkg.position ? Number(pkg.position).toFixed(1) : '15'}</span>
                              <span className="text-[#D9603B]">→</span>
                              <span className="text-emerald-400">Target Page 1</span>
                            </div>
                            <span className="text-[10px] text-white/70 block">
                              {pkg.impressions ? `${pkg.impressions.toLocaleString()} monthly searchers` : 'High commercial intent'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Package Body */}
                      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-7 space-y-4">
                          {isAdditive ? (
                            /* ADDITIVE SCOPE: Show the additions prominently */
                            <div className="space-y-4">
                              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                                    <span>✨</span> Content Proposed to be Added
                                  </span>
                                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                                    New Delta
                                  </span>
                                </div>

                                {/* Proposed FAQ Block */}
                                {pkg.faqQuestion && (
                                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1 text-xs shadow-xs">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                                      1. Direct-Answer FAQ Accordion (Targets AI Overviews)
                                    </span>
                                    <p className="font-bold text-[#0B1F3A] text-xs sm:text-sm">Q: {pkg.faqQuestion}</p>
                                    <p className="text-[#0B1F3A]/85 leading-relaxed text-xs">A: {pkg.faqAnswer}</p>
                                  </div>
                                )}

                                {/* Proposed Contextual Internal Link */}
                                {pkg.contextualLinkSnippet && (
                                  <div className="p-3.5 rounded-xl bg-white border border-emerald-200 space-y-1 text-xs shadow-xs">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                                        2. Contextual Internal Link Snippet
                                      </span>
                                      <span className="text-[10px] font-mono text-[#0B1F3A]/50">Body copy injection</span>
                                    </div>
                                    <p className="text-[#0B1F3A] text-xs leading-relaxed italic">
                                      &ldquo;{pkg.contextualLinkSnippet}&rdquo;
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Protected Elements Box */}
                              <div className="p-3.5 rounded-2xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 space-y-2 text-xs">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-[#0B1F3A] flex items-center gap-1.5">
                                    <span>🔒</span> Protected Elements (Zero Risk of Headline Drift)
                                  </span>
                                  <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                                    Kept 100% Intact
                                  </span>
                                </div>
                                <div className="space-y-1 text-[#0B1F3A]/75 text-[11px]">
                                  <div>
                                    <strong className="text-[#0B1F3A]">Live Page Headline:</strong> &ldquo;{pkg.targetPageExistingH1 || 'Settlement Agreement Calculator UK (2026 Rates)'}&rdquo; (Untouched)
                                  </div>
                                  <div>
                                    <strong className="text-[#0B1F3A]">Live Meta Description:</strong> Kept intact ({metaPx}px / 990px)
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            /* HEADLINE OVERWRITE SCOPE */
                            <div className="space-y-4">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-xs font-semibold">
                                  <span className="text-[#0B1F3A]/70 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                                    <span>⚠️ Proposed Headline Overwrite (&lt;title&gt; &amp; &lt;h1&gt;)</span>
                                  </span>
                                  <span className="font-mono text-[11px] text-[#0B1F3A]/70">
                                    {titlePx}px / {SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px ({titleLen} chars)
                                  </span>
                                </div>
                                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-medium text-amber-950">
                                  {pkg.calibratedTitle}
                                </div>
                              </div>

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

                              {pkg.faqQuestion && (
                                <div className="p-3.5 rounded-2xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1 text-xs">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                                    AI Overview Direct Answer Block
                                  </span>
                                  <p className="font-bold text-[#0B1F3A]">Q: {pkg.faqQuestion}</p>
                                  <p className="text-[#0B1F3A]/75 leading-relaxed">A: {pkg.faqAnswer}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Right Details: Plain-English Impact & Statutory Compliance (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          <div
                            className={`p-4 rounded-2xl border space-y-2.5 ${
                              pkg.deploymentRisk === 'CRITICAL_RISK'
                                ? 'bg-red-50/60 border-red-200'
                                : pkg.deploymentRisk === 'HIGH_RISK'
                                ? 'bg-[#D9603B]/10 border-[#D9603B]/25'
                                : 'bg-[#0B1F3A]/5 border-[#0B1F3A]/10'
                            }`}
                          >
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1.5">
                              <span>🧭</span> Plain-English Impact &amp; Trade-Off Summary
                            </span>

                            <div className="space-y-2 text-xs text-[#0B1F3A]/85 leading-relaxed">
                              <p>
                                <strong className="text-[#0B1F3A]">Why triggered: </strong>
                                {tradeOff?.whyTriggered ||
                                  `People searching Google for "${pkg.query}" see your page at Position ${
                                    pkg.position ? Number(pkg.position).toFixed(1) : '15'
                                  } (Page 2).`}
                              </p>
                              <p>
                                <strong className="text-[#0B1F3A]">What changes on your site: </strong>
                                {tradeOff?.whatChanges ||
                                  `Adds an FAQ section and internal link targeting "${pkg.query}".`}
                              </p>
                              <p>
                                <strong className="text-[#0B1F3A]">Risk check: </strong>
                                {tradeOff?.riskExplanation ||
                                  'Evaluated against route hierarchy and protected cluster anchor tokens.'}
                              </p>
                            </div>

                            {/* Statutory & SRA Compliance Audit Checklist */}
                            <div className="pt-2 border-t border-[#0B1F3A]/10 space-y-1 text-[11px] text-[#0B1F3A]/80">
                              <div className="font-bold text-[10px] uppercase tracking-wider text-[#0B1F3A]/60">
                                Invariant Safety Verification:
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-800">
                                <span>✓</span>
                                <span>April 2026 Caps Verified (£751/wk GB, £30k ITEPA s.403)</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-800">
                                <span>✓</span>
                                <span>Section 203(3) ERA 1996 SRA Boundary Qualified</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-emerald-800">
                                <span>✓</span>
                                <span>Zero Em Dashes &amp; Banned US Terminology</span>
                              </div>
                            </div>

                            {/* Collapsible Technical SERP Diagnostics */}
                            <details className="pt-1 border-t border-[#0B1F3A]/10 text-[11px] text-[#0B1F3A]/65">
                              <summary className="cursor-pointer font-semibold hover:text-[#0B1F3A]">
                                Technical SERP &amp; Statutory Diagnostics
                              </summary>
                              <div className="mt-2 space-y-1 font-mono text-[10px]">
                                <div>Server Baseline H1: &ldquo;{pkg.targetPageExistingH1 || 'N/A'}&rdquo;</div>
                                <div>
                                  Title Width: {titlePx}px / {SERP_PIXEL_BUDGETS.DESKTOP_TITLE_MAX_PX}px · Meta Width:{' '}
                                  {metaPx}px / {SERP_PIXEL_BUDGETS.DESKTOP_META_MAX_PX}px
                                </div>
                                <div>April 2026 Cap: £751/wk (GB) · £30,000 ITEPA s.403 · 0 Em Dashes</div>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>

                      {/* Adversarial Head of SEO Critique & Counter-Plan Drawer (Phase 3) */}
                      {advReview && (
                        <div className="mx-4 sm:mx-6 mb-5 p-4 sm:p-5 rounded-2xl bg-[#0B1F3A] text-white space-y-4 shadow-md">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-base">⚔️</span>
                              <h5 className="font-serif font-bold text-sm text-white">
                                Adversarial Head of Legal SEO Verdict
                              </h5>
                              <span
                                className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                  advReview.verdict === 'VETO_DESTRUCTIVE'
                                    ? 'bg-[#D9603B] text-white'
                                    : advReview.verdict === 'COUNTER_PLAN_RECOMMENDED'
                                    ? 'bg-amber-400 text-[#0B1F3A]'
                                    : 'bg-white/20 text-white'
                                }`}
                              >
                                {advReview.verdict.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-white/60">
                              Evaluated against Google Navboost, YMYL &amp; ITEPA 2003 s.403/s.402D
                            </span>
                          </div>

                          <p className="text-xs text-white/90 leading-relaxed font-medium">
                            {advReview.executiveSummary}
                          </p>

                          {advReview.critiquePoints && advReview.critiquePoints.length > 0 && (
                            <div className="space-y-1.5 bg-white/5 p-3.5 rounded-xl border border-white/10">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9603B] font-bold block">
                                Specific Flaws Caught in Agent Proposal:
                              </span>
                              <ul className="list-disc pl-4 space-y-1 text-xs text-white/85">
                                {advReview.critiquePoints.map((pt: string, idx: number) => (
                                  <li key={idx}>{pt}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {advReview.counterProposal && (
                            <div className="p-4 rounded-xl bg-white text-[#0B1F3A] space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A] flex items-center gap-1.5">
                                  <span>🛡️</span> Recommended Non-Destructive Counter-Plan
                                </span>
                                <span className="px-2 py-0.5 rounded bg-[#0B1F3A]/10 text-[#0B1F3A] font-mono text-[10px] font-bold">
                                  Scope: {advReview.counterProposal.actuationScope}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                <div className="p-2.5 rounded-lg bg-[#F7F4EE] border border-[#0B1F3A]/10">
                                  <span className="text-[10px] font-bold uppercase text-[#0B1F3A]/60 block">
                                    {advReview.counterProposal.actuationScope === 'ADDITIVE_CONTENT_AND_LINKS'
                                      ? 'Headline Strategy (Locked & Protected)'
                                      : 'Anchor-Safe Title'}
                                  </span>
                                  <p className="font-semibold text-[#0B1F3A] mt-0.5">
                                    {advReview.counterProposal.actuationScope === 'ADDITIVE_CONTENT_AND_LINKS'
                                      ? `Keep "${pkg.targetPageExistingH1}" untouched (Do not overwrite)`
                                      : advReview.counterProposal.calibratedTitle}
                                  </p>
                                </div>

                                <div className="p-2.5 rounded-lg bg-[#F7F4EE] border border-[#0B1F3A]/10">
                                  <span className="text-[10px] font-bold uppercase text-[#0B1F3A]/60 block">
                                    Upgraded AEO Statutory Answer (ITEPA s.403 + PENP)
                                  </span>
                                  <p className="font-bold text-[#0B1F3A] mt-0.5">
                                    Q: {advReview.counterProposal.faqQuestion}
                                  </p>
                                  <p className="text-[#0B1F3A]/80 mt-0.5 text-[11px] leading-relaxed">
                                    A: {advReview.counterProposal.faqAnswer}
                                  </p>
                                </div>
                              </div>

                              {advReview.candidatePolicyRule && (
                                <div className="p-2.5 rounded-lg bg-[#D9603B]/10 border border-[#D9603B]/25 text-[11px] flex items-start gap-2">
                                  <span>🧬</span>
                                  <div>
                                    <strong className="text-[#0B1F3A]">
                                      Permanent Guardrail Rule to Save ({advReview.candidatePolicyRule.ruleTitle}):
                                    </strong>{' '}
                                    <span className="text-[#0B1F3A]/80">
                                      {advReview.candidatePolicyRule.constraintDescription}
                                    </span>
                                  </div>
                                </div>
                              )}

                              <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
                                <button
                                  onClick={() => handleApplyCounterPlan(pkg, true, true)}
                                  disabled={isBusy}
                                  className="px-4 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold shadow-sm transition-all"
                                >
                                  ⚡ Apply Counter-Plan &amp; Save Guardrail Rule
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Package Footer Controls (Responsive & Touch-Safe) */}
                      <div className="p-4 bg-[#F7F4EE]/60 border-t border-[#0B1F3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setInspectingPackage(pkg)}
                            className="px-3 py-1.5 rounded-xl border border-[#0B1F3A]/15 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors flex items-center gap-1.5"
                          >
                            <span>🔍 Preview SERP Diff</span>
                          </button>

                          <button
                            onClick={() => handleAdversarialChallenge(pkg)}
                            disabled={isChallenging}
                            className="px-3 py-1.5 rounded-xl bg-[#0B1F3A]/10 hover:bg-[#0B1F3A] text-[#0B1F3A] hover:text-white text-xs font-semibold transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {isChallenging ? (
                              <>
                                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                <span>Auditing...</span>
                              </>
                            ) : (
                              <>
                                <span>⚔️</span>
                                <span>{advReview ? 'Re-Run Critique' : 'Challenge with Head of SEO'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {isApplied ? (
                            <button
                              onClick={() => handleRollback(pkg.id)}
                              disabled={isBusy}
                              className="w-full sm:w-auto px-4 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-800 transition-colors disabled:opacity-50"
                            >
                              Rollback to Baseline
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => setRejectingPackage(pkg)}
                                disabled={isBusy}
                                className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => setEditingPackage(pkg)}
                                disabled={isBusy}
                                className="px-3.5 py-2 rounded-xl border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors"
                              >
                                ✏️ Edit
                              </button>
                              <button
                                onClick={() => setConfirmDeployPackage({ pkg, asCanary: true })}
                                disabled={isBusy}
                                className="px-3.5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-xs font-semibold transition-all shadow-sm disabled:opacity-50"
                                title="Deploy with 14-day automated rank monitoring"
                              >
                                🧪 14d Canary
                              </button>
                              <button
                                onClick={() => setConfirmDeployPackage({ pkg, asCanary: false })}
                                disabled={isBusy}
                                className="px-4 py-2 rounded-xl bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50"
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
            <div id="deployed-optimizations-table" className="bg-white rounded-3xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
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
                      <th className="py-3 px-4">Risk &amp; Scope</th>
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
                        const rankDelta = Math.round((rankBefore - rankToday) * 10) / 10;
                        const ctrBefore = pkg.ctr ? Number(pkg.ctr) : 2.1;
                        const ctrToday = pkg.currentCtr ? Number(pkg.currentCtr) : ctrBefore;
                        const ctrDelta = Math.round((ctrToday - ctrBefore) * 100) / 100;

                        return (
                          <tr
                            key={pkg.id}
                            id={`package-row-${pkg.id}`}
                            className={`transition-all ${
                              highlightedPackageId === pkg.id
                                ? 'bg-amber-50/90 ring-2 ring-red-400 ring-inset'
                                : 'hover:bg-[#F7F4EE]/40'
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <strong className="text-[#0B1F3A] block">&ldquo;{pkg.query}&rdquo;</strong>
                              <span className="font-mono text-[11px] text-[#0B1F3A]/60">{pkg.targetCanonicalUrl}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              {renderRiskBadge(pkg.deploymentRisk, pkg.actuationScope)}
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
                            <td className="py-3.5 px-4 text-right space-x-2">
                              {pkg.status === 'ROLLED_BACK' ? (
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-[10px] text-gray-500 font-medium">Reverted to Baseline</span>
                                  {pkg.regressionAlert && (
                                    <button
                                      onClick={() => handleDismissAlert(pkg.id)}
                                      disabled={actionLoadingId === `DISMISS_${pkg.id}`}
                                      className="px-2.5 py-1 rounded-lg border border-red-200 bg-white hover:bg-red-50 text-[11px] font-semibold text-red-800 transition-colors"
                                    >
                                      {actionLoadingId === `DISMISS_${pkg.id}` ? 'Dismissing...' : 'Dismiss Alert'}
                                    </button>
                                  )}
                                </div>
                              ) : (
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
            {/* Monitor Header Toolbar: Title, Active Horizon & GSC Calendar Filter */}
            <div className="bg-white p-4 sm:p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-serif font-bold text-[#0B1F3A]">
                    Search Intelligence &amp; Inbound Telemetry
                  </h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      monitorData?.dateRange?.source === 'GSC_LIVE_API'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#0B1F3A]/10 text-[#0B1F3A]'
                    }`}
                  >
                    {monitorData?.dateRange?.source === 'GSC_LIVE_API'
                      ? '● Live GSC API'
                      : '📁 Archive Snapshot'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#0B1F3A]/70">
                  <span>
                    📅 Active Horizon: <strong className="text-[#0B1F3A]">{monitorData?.dateRange?.formatted || 'Last 28 days'}</strong> ({monitorData?.dateRange?.daysCount || 28} days)
                  </span>
                  <span>·</span>
                  <span className="text-[11px] text-[#0B1F3A]/60">
                    ⏱️ GSC verified to {monitorData?.dateRange?.endDate || 'Latest'} (~3d lag) · Leads stream in real-time
                  </span>
                </div>
              </div>

              {/* Date Filter Picker (GSC Style) */}
              <div className="flex items-center gap-2 shrink-0">
                <CockpitDateFilter
                  dateRangeMeta={monitorData?.dateRange}
                  isLoading={isLoadingMonitor}
                  onSelectRange={handleSelectDateRange}
                />
              </div>
            </div>

            {/* Top 4 KPI Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: GSC Search Impressions */}
              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-2 relative overflow-hidden">
                {isLoadingMonitor && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="w-5 h-5 border-2 border-[#D9603B] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0B1F3A]/60 font-semibold block">Search Impressions (GSC)</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#0B1F3A]/5 text-[#0B1F3A] text-[10px] font-mono font-bold">
                    {monitorData?.dateRange?.daysCount || 28}d Window
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] block">
                  {monitorData?.metrics?.totalImpressions !== undefined
                    ? monitorData.metrics.totalImpressions.toLocaleString('en-GB')
                    : '—'}
                </span>
                <div className="pt-1 border-t border-[#0B1F3A]/5 space-y-0.5">
                  <span className="text-[11px] text-[#0B1F3A]/70 block font-medium">
                    {monitorData?.metrics?.totalClicks ?? 0} clicks ({monitorData?.metrics?.avgCtr ?? 0}% CTR) · Pos {monitorData?.metrics?.avgPosition ?? '—'}
                  </span>
                  <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">
                    📅 GSC: {monitorData?.dateRange?.formatted || 'Last 28 days'}
                  </span>
                </div>
              </div>

              {/* Card 2: Calculator Runs */}
              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-2 relative overflow-hidden">
                {isLoadingMonitor && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="w-5 h-5 border-2 border-[#D9603B] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0B1F3A]/60 font-semibold block">Calculator Runs</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#D9603B]/10 text-[#D9603B] text-[10px] font-mono font-bold">
                    Real-Time
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] block">
                  {monitorData?.metrics?.totalCalculations !== undefined
                    ? monitorData.metrics.totalCalculations.toLocaleString('en-GB')
                    : '—'}
                </span>
                <div className="pt-1 border-t border-[#0B1F3A]/5 space-y-0.5">
                  <span className="text-[11px] text-[#D9603B] font-semibold block">
                    Live telemetry stream
                  </span>
                  <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">
                    📅 In selected {monitorData?.dateRange?.daysCount || 28}d period
                  </span>
                </div>
              </div>

              {/* Card 3: Inbound Leads */}
              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-2 relative overflow-hidden">
                {isLoadingMonitor && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="w-5 h-5 border-2 border-[#D9603B] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0B1F3A]/60 font-semibold block">Inbound Leads Captured</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#0B1F3A]/5 text-[#0B1F3A] text-[10px] font-mono font-bold">
                    {monitorData?.dateRange?.daysCount || 28}d Window
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D9603B] block">
                  {monitorData?.metrics?.totalLeads ?? '—'}
                </span>
                <div className="pt-1 border-t border-[#0B1F3A]/5 space-y-0.5">
                  <span className="text-[11px] text-[#0B1F3A]/70 block font-medium">
                    High-intent employee matches
                  </span>
                  <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">
                    📅 In selected {monitorData?.dateRange?.daysCount || 28}d period
                  </span>
                </div>
              </div>

              {/* Card 4: Gross Offers Checked */}
              <div className="bg-white p-5 rounded-3xl border border-[#0B1F3A]/10 shadow-sm space-y-2 relative overflow-hidden">
                {isLoadingMonitor && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center z-10">
                    <span className="w-5 h-5 border-2 border-[#D9603B] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#0B1F3A]/60 font-semibold block">Gross Offers Checked</span>
                  <span className="px-2 py-0.5 rounded-md bg-[#0B1F3A]/5 text-[#0B1F3A] text-[10px] font-mono font-bold">
                    {monitorData?.dateRange?.daysCount || 28}d Window
                  </span>
                </div>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] block">
                  £{(monitorData?.metrics?.totalGrossOffers || 0).toLocaleString('en-GB')}
                </span>
                <div className="pt-1 border-t border-[#0B1F3A]/5 space-y-0.5">
                  <span className="text-[11px] text-[#0B1F3A]/70 block font-medium">
                    Avg: £{(monitorData?.metrics?.avgOffer || 0).toLocaleString('en-GB')} per matter
                  </span>
                  <span className="text-[10px] font-mono text-[#0B1F3A]/50 block">
                    📅 In selected {monitorData?.dateRange?.daysCount || 28}d period
                  </span>
                </div>
              </div>
            </div>

            {/* Google Search Console Daily Performance Chart */}
            {monitorData?.timeseries && monitorData.timeseries.length > 0 && (
              <CockpitPerformanceChart
                timeseries={monitorData.timeseries}
                source={monitorData.dateRange?.source}
                formattedRange={monitorData.dateRange?.formatted}
                totalClicks={monitorData.metrics?.totalClicks}
                totalImpressions={monitorData.metrics?.totalImpressions}
              />
            )}

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

      {/* High-Confidence Touch-Safe Live Deployment Confirmation Modal */}
      {confirmDeployPackage && (
        <div className="fixed inset-0 z-50 bg-[#0B1F3A]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#0B1F3A]/15 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-[#0B1F3A]/10 pb-3">
              <h4 className="font-serif font-bold text-base text-[#0B1F3A] flex items-center gap-2">
                <span>{confirmDeployPackage.asCanary ? '🧪' : '⚡'}</span>
                <span>
                  {confirmDeployPackage.asCanary ? 'Confirm 14-Day Canary Observation' : 'Confirm Live Production Deployment'}
                </span>
              </h4>
              <button
                onClick={() => setConfirmDeployPackage(null)}
                className="text-xs text-[#0B1F3A]/50 hover:text-[#0B1F3A] font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#0B1F3A]/85">
              <div className="p-3 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#0B1F3A]/60 font-bold">
                  Target Live Route:
                </div>
                <div className="font-mono text-xs font-semibold text-[#0B1F3A] break-all">
                  {confirmDeployPackage.pkg.targetCanonicalUrl}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 text-blue-950 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <span>🚀</span>
                  <span>What happens upon confirmation:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-blue-900 leading-relaxed">
                  <li>
                    {confirmDeployPackage.pkg.actuationScope === 'ADDITIVE_CONTENT_AND_LINKS'
                      ? 'Statutory FAQ and contextual internal link will be published. Live page headline remains 100% untouched.'
                      : 'Live headline and meta description will be updated in production.'}
                  </li>
                  <li>Next.js Edge Cache tags will be automatically revalidated.</li>
                  <li>Google Indexing API will be notified to crawl the updated page immediately.</li>
                  {confirmDeployPackage.asCanary && (
                    <li>Automated 14-day degradation watchdog will monitor rank movement and alert if position drops.</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#0B1F3A]/10">
              <button
                onClick={() => setConfirmDeployPackage(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-xs font-semibold text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const { pkg, asCanary } = confirmDeployPackage;
                  setConfirmDeployPackage(null);
                  handleApply(pkg.id, asCanary);
                }}
                className={`px-4 py-2 rounded-xl text-white text-xs font-semibold transition-all shadow-sm ${
                  confirmDeployPackage.asCanary
                    ? 'bg-[#0B1F3A] hover:bg-[#0B1F3A]/90'
                    : 'bg-[#D9603B] hover:bg-[#D9603B]/90'
                }`}
              >
                {confirmDeployPackage.asCanary ? '🧪 Deploy in Canary Mode' : '⚡ Confirm & Deploy Live'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
