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
  const [activeTab, setActiveTab] = useState<'pipeline' | 'territory' | 'telemetry' | 'settings'>('pipeline');
  const [webhookUrl, setWebhookUrl] = useState('https://app.clio.com/api/v4/webhooks/sc_intake');
  const [isSaved, setIsSaved] = useState(false);

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
                        href={`/dossier/review/${m.id}/`}
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
    </div>
  );
}
