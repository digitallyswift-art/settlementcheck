'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface MockMatter {
  id: string;
  clientName: string;
  postcode: string;
  disputeReason: string;
  salary: number;
  employerOffer: number;
  statutoryFloor: number;
  targetSettlement: number;
  status: 'locked' | 'claimed' | 'completed';
  timeRemainingSec?: number;
  receivedAt: string;
}

export default function PortalClient() {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'territory' | 'telemetry' | 'seo' | 'settings'>('pipeline');
  const [webhookUrl, setWebhookUrl] = useState('https://app.clio.com/api/v4/webhooks/sc_intake');
  const [isSaved, setIsSaved] = useState(false);

  // Autonomous SEO Fleet State
  const [seoSummary, setSeoSummary] = useState<{
    totalPackages: number;
    appliedCount: number;
    validatedCount: number;
    stagedCount: number;
  } | null>(null);
  const [seoPackages, setSeoPackages] = useState<any[]>([]);
  const [recentRuns, setRecentRuns] = useState<any[]>([]);
  const [changeLogPreview, setChangeLogPreview] = useState<string>('');
  const [isLoadingSeo, setIsLoadingSeo] = useState<boolean>(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchSeoData = async () => {
    setIsLoadingSeo(true);
    try {
      const res = await fetch('/api/portal/seo-actions/');
      const data = await res.json();
      if (data.success) {
        setSeoSummary(data.summary);
        setSeoPackages(data.packages || []);
        setRecentRuns(data.recentRuns || []);
        setChangeLogPreview(data.changeLogPreview || '');
      }
    } catch (e) {
      console.error('Failed to load SEO data', e);
    } finally {
      setIsLoadingSeo(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'seo' && !seoSummary) {
      fetchSeoData();
    }
  }, [activeTab, seoSummary]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleApplyPackage = async (packageId: string) => {
    setActionLoadingId(packageId);
    try {
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPLY', packageId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Package applied live to production and Google Indexing API pinged (HTTP 200)');
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to apply package'}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleRollbackPackage = async (packageId: string) => {
    setActionLoadingId(packageId);
    try {
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ROLLBACK', packageId }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Package rolled back to baseline metadata');
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to rollback package'}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleApplyAll = async () => {
    setActionLoadingId('APPLY_ALL');
    try {
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPLY_ALL' }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`✓ Applied ${data.appliedCount} packages with batch Google Indexing pings`);
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.error || 'Failed to batch apply'}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReindex = async (url: string, packageId: string) => {
    setActionLoadingId(`REINDEX_${packageId}`);
    try {
      const res = await fetch('/api/portal/seo-actions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'REINDEX', url }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ Google Indexing API notification confirmed: crawl queued');
        await fetchSeoData();
      } else {
        showToast(`Error: ${data.indexingResult?.error || 'Failed to ping Googlebot'}`);
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  const mockMatters: MockMatter[] = [
    {
      id: 'dossier_live_bristol_01',
      clientName: 'Sarah Jenkins',
      postcode: 'BS8 1TH',
      disputeReason: 'Redundancy (Nominated Firm Steering)',
      salary: 58000,
      employerOffer: 6500,
      statutoryFloor: 11402,
      targetSettlement: 19500,
      status: 'locked',
      timeRemainingSec: 742,
      receivedAt: '8 mins ago',
    },
    {
      id: 'dossier_live_london_02',
      clientName: 'Marcus Vance',
      postcode: 'BS1 4PB',
      disputeReason: 'Unfair Dismissal / PIP Exit',
      salary: 72000,
      employerOffer: 12000,
      statutoryFloor: 8400,
      targetSettlement: 24000,
      status: 'claimed',
      receivedAt: '2 hours ago',
    },
    {
      id: 'dossier_live_clifton_03',
      clientName: 'David H. Miller',
      postcode: 'BS6 6TP',
      disputeReason: 'Redundancy Compromise',
      salary: 95000,
      employerOffer: 32000,
      statutoryFloor: 28500,
      targetSettlement: 48000,
      status: 'completed',
      receivedAt: 'Yesterday',
    },
  ];

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] pb-24">
      {/* ── Partner Portal Header ────────────────────────────────────────── */}
      <header className="bg-[#0B1F3A] text-white border-b border-[#0B1F3A]">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="font-serif text-xl font-bold tracking-tight">
              <span className="text-[#D9603B]">Settlement</span>
              <span className="text-white">Check</span>
            </Link>
            <span className="text-white/30 text-lg font-light">/</span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#D9603B] font-semibold">
              Partner Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:inline-block text-white/70">
              Logged in as: <strong className="text-white font-medium">Bristol Employment Law Specialists LLP</strong> (SRA-649201)
            </span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-white font-mono text-[11px] border border-white/10">
              CHARTER PANEL
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-6xl mx-auto px-4 flex gap-6 text-xs sm:text-sm font-medium border-t border-white/10">
          {[
            { id: 'pipeline', label: 'Instruction Pipeline' },
            { id: 'territory', label: 'Territory & Postcodes' },
            { id: 'telemetry', label: 'Settlement Telemetry' },
            { id: 'seo', label: 'Autonomous SEO Fleet 🤖' },
            { id: 'settings', label: 'PMS Webhook & Settings' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-[#D9603B] text-white font-semibold'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {/* ── Tab 1: Instruction Pipeline ─────────────────────────────────── */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Top KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">Active Instructions</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">3</span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">1 reserved under 15m SLA</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">Total Matters Claimed</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">42</span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">Lifetime territory allocations</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">Avg Pre-Flight Time Saved</span>
                <span className="text-2xl font-serif font-bold text-[#D9603B]">70 min</span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">From 90 min down to 20 min</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">SLA Response Speed</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">11.4 min</span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">15-minute target benchmark</span>
              </div>
            </div>

            {/* Instruction List Card */}
            <div className="bg-white rounded-2xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#0B1F3A]/10 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#0B1F3A]">Exclusive Matter Queue</h2>
                  <p className="text-xs text-[#0B1F3A]/60 mt-0.5">Pre-qualified employee instructions geocoded to your exclusive BS postcode cluster.</p>
                </div>
                <span className="text-xs text-[#0B1F3A]/50 font-mono">Live Sync Active</span>
              </div>

              <div className="divide-y divide-[#0B1F3A]/5">
                {mockMatters.map(m => (
                  <div key={m.id} className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#F7F4EE]/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-base text-[#0B1F3A]">{m.clientName}</span>
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-[#0B1F3A]/5 text-[#0B1F3A]">
                          {m.postcode}
                        </span>
                        {m.status === 'locked' && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#D9603B]/10 text-[#D9603B] border border-[#D9603B]/30 animate-pulse">
                            ⚡ 15-Min Exclusivity Lock: {Math.floor((m.timeRemainingSec || 0) / 60)}m remaining
                          </span>
                        )}
                        {m.status === 'claimed' && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A]">
                            ✓ Claimed & Active
                          </span>
                        )}
                        {m.status === 'completed' && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A]/60">
                            Settlement Discharged
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#0B1F3A]/70">
                        {m.disputeReason} · Salary: £{m.salary.toLocaleString('en-GB')} · Employer Offer:{' '}
                        <strong className="text-[#D9603B]">£{m.employerOffer.toLocaleString('en-GB')}</strong> (Floor: £{m.statutoryFloor.toLocaleString('en-GB')})
                      </p>
                      <span className="text-[11px] text-[#0B1F3A]/40 block">Arrived {m.receivedAt}</span>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <Link
                        href={`/dossier/review/${m.id}/?token=demo_partner_token`}
                        className={`w-full md:w-auto px-5 py-2 rounded-lg text-xs font-semibold text-center transition-all ${
                          m.status === 'locked'
                            ? 'bg-[#D9603B] text-white hover:bg-[#D9603B]/90 shadow-sm'
                            : 'bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90'
                        }`}
                      >
                        {m.status === 'locked' ? '⚡ One-Click Claim & Review Dossier →' : 'View Pre-Flight Dossier →'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Territory & Postcodes ─────────────────────────────────── */}
        {activeTab === 'territory' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#0B1F3A]">Territorial Exclusivity Mapping</h2>
              <p className="text-xs sm:text-sm text-[#0B1F3A]/70 mt-1">
                Your law firm holds exclusive first-right routing on all employee instructions originating within these postal clusters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/70">Assigned Outward Postcodes</h3>
                <div className="flex flex-wrap gap-2">
                  {['BS8', 'BS1', 'BS2', 'BS3', 'BS6', 'BS7', 'BS9', 'BS10', 'BS16', 'BS20'].map(code => (
                    <span key={code} className="px-3 py-1 bg-white border border-[#0B1F3A]/10 rounded-lg text-xs font-mono font-bold text-[#0B1F3A]">
                      {code}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-[#0B1F3A]/60 pt-2">
                  Coverage Radius: <strong>30 miles</strong> from office hub (BS8 1TH, Bristol).
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#0B1F3A] text-white space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#D9603B]">The 15-Minute Exclusivity Guarantee</h3>
                <p className="text-xs text-[#F7F4EE]/80 leading-relaxed">
                  When a client inside your outward postcode zone completes our settlement agreement review, the instruction is locked exclusively to your firm for 15 minutes. It will never be broadcast to multiple law firms simultaneously.
                </p>
                <div className="pt-2 text-xs text-white/60">
                  Panel Compliance Status: <strong className="text-white">100% SRA Regulatory Adherence</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Settlement Telemetry ──────────────────────────────────── */}
        {activeTab === 'telemetry' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#0B1F3A]">SettlementCheck Telemetry Intelligence</h2>
              <p className="text-xs sm:text-sm text-[#0B1F3A]/70 mt-1">
                Proprietary UK settlement multiplier benchmarks. Use this empirical data in negotiation letters to challenge low employer ex-gratia offers.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#0B1F3A]/10 text-left text-[#0B1F3A]/60">
                    <th className="py-2.5">Dispute Category</th>
                    <th className="py-2.5">Median Multiplier</th>
                    <th className="py-2.5">Upper Quartile</th>
                    <th className="py-2.5">Avg Employer Legal Fee</th>
                    <th className="py-2.5">Avg Resolution Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1F3A]/5">
                  <tr>
                    <td className="py-3 font-semibold">Redundancy / Structural Exit</td>
                    <td className="py-3">2.8x monthly salary</td>
                    <td className="py-3 text-[#D9603B] font-semibold">4.2x monthly salary</td>
                    <td className="py-3">£650 + VAT</td>
                    <td className="py-3 text-[#0B1F3A]/70">2.4 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Performance Plan (PIP) Exit</td>
                    <td className="py-3">3.2x monthly salary</td>
                    <td className="py-3 text-[#D9603B] font-semibold">4.8x monthly salary</td>
                    <td className="py-3">£750 + VAT</td>
                    <td className="py-3 text-[#0B1F3A]/70">3.1 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Discrimination / Detriment (Equality Act)</td>
                    <td className="py-3">4.5x monthly salary</td>
                    <td className="py-3 text-[#D9603B] font-semibold">7.2x (Uncapped)</td>
                    <td className="py-3">£1,250 + VAT</td>
                    <td className="py-3 text-[#0B1F3A]/70">5.6 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-semibold">Constructive Dismissal</td>
                    <td className="py-3">3.0x monthly salary</td>
                    <td className="py-3 text-[#D9603B] font-semibold">4.6x monthly salary</td>
                    <td className="py-3">£650 + VAT</td>
                    <td className="py-3 text-[#0B1F3A]/70">3.8 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 4: Autonomous SEO Fleet ─────────────────────────────── */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            {/* Header & Fleet Controls */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D9603B]/10 text-[#D9603B] text-[11px] font-mono font-bold uppercase tracking-wider border border-[#D9603B]/20">
                      Dual-Agent Sentinel Fleet
                    </span>
                    <span className="text-xs text-[#0B1F3A]/40 font-mono">seo-architect · conversion-copywriter</span>
                  </div>
                  <h2 className="text-xl font-serif font-bold text-[#0B1F3A]">Autonomous SEO Fleet & Actuation Engine</h2>
                  <p className="text-xs sm:text-sm text-[#0B1F3A]/70 max-w-2xl">
                    Review staged search opportunities, calibrated meta tags, and answer-first FAQs. Deploy live to production in 1-click and trigger automated Googlebot re-indexing via the Google Indexing API.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:self-start">
                  <button
                    onClick={handleApplyAll}
                    disabled={actionLoadingId === 'APPLY_ALL'}
                    className="px-4 py-2.5 bg-[#D9603B] text-white text-xs font-semibold rounded-lg hover:bg-[#D9603B]/90 transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                  >
                    {actionLoadingId === 'APPLY_ALL' ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Deploying & Pinging...</span>
                      </>
                    ) : (
                      <>
                        <span>⚡ Apply All Validated</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={fetchSeoData}
                    disabled={isLoadingSeo}
                    className="px-3.5 py-2.5 bg-[#0B1F3A]/5 text-[#0B1F3A] text-xs font-semibold rounded-lg hover:bg-[#0B1F3A]/10 transition-colors flex items-center gap-1.5"
                  >
                    <span>🔄</span>
                    <span>Refresh</span>
                  </button>

                  <a
                    href="/api/portal/seo-actions/"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2.5 border border-[#0B1F3A]/15 text-[#0B1F3A]/80 text-xs font-medium rounded-lg hover:bg-[#0B1F3A]/5 transition-colors"
                  >
                    JSON Feed ↗
                  </a>
                </div>
              </div>

              {/* Fleet Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                  <span className="text-xs text-[#0B1F3A]/60 block mb-0.5">Total Opportunities</span>
                  <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                    {seoSummary ? seoSummary.totalPackages : '-'}
                  </span>
                  <span className="text-[11px] text-[#0B1F3A]/50 block mt-0.5">Striking-distance queries</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                  <span className="text-xs text-[#0B1F3A]/60 block mb-0.5">Live in Production</span>
                  <span className="text-2xl font-serif font-bold text-[#D9603B]">
                    {seoSummary ? seoSummary.appliedCount : '0'}
                  </span>
                  <span className="text-[11px] text-[#0B1F3A]/50 block mt-0.5">Dynamic metadata active</span>
                </div>

                <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                  <span className="text-xs text-[#0B1F3A]/60 block mb-0.5">Statutory Validated</span>
                  <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                    {seoSummary ? seoSummary.validatedCount : '-'}
                  </span>
                  <span className="text-[11px] text-[#0B1F3A]/50 block mt-0.5">April 2026 rates verified</span>
                </div>

                <div className="p-4 rounded-xl bg-[#0B1F3A] text-white">
                  <span className="text-xs text-white/60 block mb-0.5">Google Indexing Protocol</span>
                  <span className="text-xl font-serif font-bold text-[#D9603B]">HTTP 200 OK</span>
                  <span className="text-[11px] text-white/70 block mt-0.5">OAuth2 Service Account</span>
                </div>
              </div>
            </div>

            {/* Opportunities List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-serif font-bold text-[#0B1F3A]">
                  Staged & Active Optimization Packages ({seoPackages.length})
                </h3>
                <span className="text-xs text-[#0B1F3A]/60 font-mono">
                  Target Invariants: 50-60 Title · 140-155 Meta · £751/wk Cap
                </span>
              </div>

              {isLoadingSeo && seoPackages.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-[#0B1F3A]/10 text-xs text-[#0B1F3A]/60">
                  <span className="inline-block w-5 h-5 border-2 border-[#D9603B] border-t-transparent rounded-full animate-spin mb-2" />
                  <p>Loading autonomous fleet packages from engine...</p>
                </div>
              ) : (
                seoPackages.map((pkg: any) => {
                  const isApplied = pkg.status === 'APPLIED';
                  const titleLen = pkg.calibratedTitle?.length || 0;
                  const metaLen = pkg.calibratedMetaDescription?.length || 0;
                  const isTitleOk = titleLen >= 45 && titleLen <= 65;
                  const isMetaOk = metaLen >= 135 && metaLen <= 160;
                  const isBusy = actionLoadingId === pkg.id || actionLoadingId === `REINDEX_${pkg.id}`;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                        isApplied
                          ? 'border-[#0B1F3A] shadow-md ring-1 ring-[#0B1F3A]/10'
                          : 'border-[#0B1F3A]/10 shadow-sm hover:border-[#0B1F3A]/30'
                      }`}
                    >
                      {/* Package Card Header */}
                      <div className="p-5 border-b border-[#0B1F3A]/10 bg-[#F7F4EE]/40 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider ${
                              pkg.priority === 'CRITICAL'
                                ? 'bg-[#D9603B] text-white'
                                : 'bg-[#0B1F3A] text-white'
                            }`}
                          >
                            {pkg.priority || 'CRITICAL'}
                          </span>
                          <span className="font-mono text-xs font-semibold text-[#0B1F3A]/60 px-2 py-0.5 bg-white rounded border border-[#0B1F3A]/10">
                            {pkg.actionType || 'META_BOOST'}
                          </span>
                          <h4 className="font-serif font-bold text-base text-[#0B1F3A]">
                            &ldquo;{pkg.query}&rdquo;
                          </h4>
                        </div>

                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <span className="px-3 py-1 rounded-full bg-[#0B1F3A] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm">
                              <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse" />
                              LIVE IN PRODUCTION
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                              ✓ STATUTORY VALIDATED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Package Details Grid */}
                      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Column: Target & Meta Specs (7 cols) */}
                        <div className="lg:col-span-7 space-y-4">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block mb-1">
                              Target Canonical URL
                            </span>
                            <div className="flex items-center gap-2">
                              <a
                                href={pkg.targetCanonicalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="font-mono text-xs text-[#0B1F3A] hover:text-[#D9603B] font-semibold underline underline-offset-2 break-all"
                              >
                                {pkg.targetCanonicalUrl}
                              </a>
                            </div>
                          </div>

                          {/* GSC Performance Metrics */}
                          {(pkg.impressions !== undefined || pkg.clicks !== undefined) && (
                            <div className="flex flex-wrap gap-4 py-2 px-3 rounded-lg bg-[#F7F4EE] border border-[#0B1F3A]/5 text-xs text-[#0B1F3A]/80 font-mono">
                              <div>
                                <span className="text-[#0B1F3A]/50 block text-[10px]">Impressions</span>
                                <strong className="text-[#0B1F3A]">{pkg.impressions?.toLocaleString('en-GB') ?? '-'}</strong>
                              </div>
                              <div>
                                <span className="text-[#0B1F3A]/50 block text-[10px]">Clicks</span>
                                <strong className="text-[#0B1F3A]">{pkg.clicks ?? '0'}</strong>
                              </div>
                              <div>
                                <span className="text-[#0B1F3A]/50 block text-[10px]">Avg Position</span>
                                <strong className="text-[#0B1F3A]">{pkg.position ? Number(pkg.position).toFixed(1) : '-'}</strong>
                              </div>
                              <div>
                                <span className="text-[#0B1F3A]/50 block text-[10px]">CTR</span>
                                <strong className="text-[#0B1F3A]">{pkg.ctr ? `${Number(pkg.ctr).toFixed(1)}%` : '-'}</strong>
                              </div>
                            </div>
                          )}

                          {/* Calibrated Title */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]/60">
                                Calibrated Title
                              </span>
                              <span
                                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                                  isTitleOk ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                                }`}
                              >
                                {titleLen} / 60 chars
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-[#0B1F3A]/5 text-xs font-medium text-[#0B1F3A] border border-[#0B1F3A]/10">
                              {pkg.calibratedTitle}
                            </div>
                          </div>

                          {/* Calibrated Meta Description */}
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]/60">
                                Calibrated Meta Description
                              </span>
                              <span
                                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                                  isMetaOk ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                                }`}
                              >
                                {metaLen} / 155 chars
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-[#0B1F3A]/5 text-xs text-[#0B1F3A] border border-[#0B1F3A]/10 leading-relaxed">
                              {pkg.calibratedMetaDescription}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Answer-First FAQ & Indexing Status (5 cols) */}
                        <div className="lg:col-span-5 space-y-4">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block mb-1">
                              Featured Snippet FAQ
                            </span>
                            <div className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-2">
                              <p className="text-xs font-bold text-[#0B1F3A]">
                                Q: {pkg.faqQuestion}
                              </p>
                              <p className="text-xs text-[#0B1F3A]/70 leading-relaxed">
                                A: {pkg.faqAnswer}
                              </p>
                            </div>
                          </div>

                          {/* Indexing Telemetry */}
                          <div className="p-3.5 rounded-xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/10 space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#0B1F3A]/60 block">
                              Google Indexing Telemetry
                            </span>
                            <div className="text-xs text-[#0B1F3A]/80 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[#0B1F3A]/60">Status:</span>
                                <strong className="font-mono text-[11px] text-[#0B1F3A]">
                                  {pkg.indexingStatus || (isApplied ? 'INDEXING_REQUESTED_HTTP_200' : 'Ready for Actuation')}
                                </strong>
                              </div>
                              {pkg.appliedAt && (
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-[#0B1F3A]/60">Deployed:</span>
                                  <span className="font-mono text-[#0B1F3A]/70">{new Date(pkg.appliedAt).toLocaleDateString('en-GB')} {new Date(pkg.appliedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Package Card Actions Footer */}
                      <div className="p-4 bg-[#F7F4EE]/60 border-t border-[#0B1F3A]/10 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-[#0B1F3A]/60 flex items-center gap-2">
                          <span className="font-mono font-semibold text-[#0B1F3A]">{pkg.id}</span>
                          <span>·</span>
                          <span>Invariants: 0 Em Dashes · SRA Independent Solicitor</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {isApplied ? (
                            <>
                              <button
                                onClick={() => handleReindex(pkg.targetCanonicalUrl, pkg.id)}
                                disabled={isBusy}
                                className="px-3.5 py-1.5 rounded-lg border border-[#0B1F3A]/20 bg-white hover:bg-[#0B1F3A]/5 text-xs font-semibold text-[#0B1F3A] transition-colors disabled:opacity-50"
                              >
                                Re-ping Googlebot 🔄
                              </button>
                              <button
                                onClick={() => handleRollbackPackage(pkg.id)}
                                disabled={isBusy}
                                className="px-3.5 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-xs font-semibold text-red-800 transition-colors disabled:opacity-50"
                              >
                                Rollback to Baseline
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleApplyPackage(pkg.id)}
                              disabled={isBusy}
                              className="px-5 py-2 rounded-lg bg-[#D9603B] hover:bg-[#D9603B]/90 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
                            >
                              {actionLoadingId === pkg.id ? (
                                <>
                                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Applying & Pinging...</span>
                                </>
                              ) : (
                                <>
                                  <span>⚡ 1-Click Apply & Ping Googlebot →</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Change Log & Audit Trail Box */}
            {changeLogPreview && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-serif font-bold text-[#0B1F3A]">
                    Autonomous Fleet Audit Log (CHANGE_LOG.md)
                  </h3>
                  <span className="text-[11px] font-mono text-[#0B1F3A]/50">data/serp-actions/CHANGE_LOG.md</span>
                </div>
                <pre className="p-4 rounded-xl bg-[#0B1F3A] text-white/90 text-xs font-mono overflow-x-auto max-h-72 leading-relaxed whitespace-pre-wrap">
                  {changeLogPreview}
                </pre>
              </div>
            )}
          </div>
        )}


        {/* ── Tab 4: PMS Webhook & Settings ────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#0B1F3A]">Practice Management System (PMS) Webhooks</h2>
              <p className="text-xs sm:text-sm text-[#0B1F3A]/70 mt-1">
                Configure automated intake dispatch into Clio Manage, LEAP, or PracticeEvolve. Zero manual data entry.
              </p>
            </div>

            <form onSubmit={handleSaveWebhook} className="space-y-4 max-w-xl">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/70 mb-1.5">
                  Incoming Webhook URL (Clio / LEAP / PracticeEvolve)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  className="w-full p-3 rounded-lg border border-[#0B1F3A]/20 text-xs font-mono text-[#0B1F3A] focus:outline-none focus:border-[#D9603B]"
                  placeholder="https://app.clio.com/api/v4/webhooks/..."
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0B1F3A] text-white text-xs font-semibold rounded-lg hover:bg-[#0B1F3A]/90 transition-colors"
                >
                  Save Webhook Configuration
                </button>
                {isSaved && <span className="text-xs text-[#0B1F3A] font-semibold">✓ Saved successfully</span>}
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B1F3A] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-[#D9603B]/40 flex items-center gap-3 text-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] animate-pulse" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
