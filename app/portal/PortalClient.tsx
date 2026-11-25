'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { trackClientEvent } from '@/lib/telemetry';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'totp'>('credentials');
  const [workEmail, setWorkEmail] = useState('partner@bristolemploymentlaw.co.uk');
  const [password, setPassword] = useState('••••••••••••');
  const [totpCode, setTotpCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('demo') === 'true') {
        setIsDemoMode(true);
        setIsAuthenticated(true);
        return;
      }
      const auth = sessionStorage.getItem('sc_partner_mfa_auth');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleVerifyTotp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);
    setTimeout(() => {
      const cleanCode = totpCode.trim().replace(/\s/g, '');
      if (process.env.NODE_ENV === 'development' && (cleanCode === '568912' || cleanCode.length === 6)) {
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('sc_partner_mfa_auth', 'true');
        }
      } else if (process.env.NODE_ENV !== 'development') {
        setAuthError('Partner Portal direct web authentication is currently undergoing scheduled maintenance. Please access assigned instructions using your secure direct email claim links.');
      } else {
        setAuthError('Invalid 6-digit authenticator code. Enter the code from your authenticator app or use dev demo code: 568912.');
      }
      setIsVerifying(false);
    }, 350);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setIsDemoMode(false);
    setAuthStep('credentials');
    setTotpCode('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('sc_partner_mfa_auth');
    }
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
          {/* Brand Header */}
          <div className="text-center mb-6">
            <Link href="/" className="font-serif text-2xl sm:text-3xl font-bold tracking-tight inline-block mb-3">
              <span className="text-[#D9603B]">Settlement</span>
              <span className="text-[#0B1F3A]">Check</span>
            </Link>
            <div className="block mb-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1F3A]/5 border border-[#0B1F3A]/15 text-xs font-mono font-semibold text-[#0B1F3A]">
                <span className="w-2 h-2 rounded-full bg-[#D9603B] inline-block animate-pulse" />
                SRA Law Firm Partner Portal
              </span>
            </div>
            <h1 className="text-2xl font-serif font-bold text-[#0B1F3A] leading-tight">
              Solicitor Command Centre Login
            </h1>
            <p className="text-sm text-[#0B1F3A]/75 mt-2 leading-relaxed">
              Protected by mandatory Multi-Factor Authentication (MFA / TOTP)
            </p>
          </div>

          {authStep === 'credentials' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setAuthError(null);
                setAuthStep('totp');
              }}
              className="space-y-5"
            >
              <div>
                <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
                  Firm Work Email
                </label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 py-3 border border-[#E2DCCE] rounded-lg text-base text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">
                  Partner Password / Passkey
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 py-3 border border-[#E2DCCE] rounded-lg text-base text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div className="bg-[#F0F5FA] border border-[#C4D8EC] p-4 rounded-lg text-sm text-[#0B1F3A] leading-relaxed">
                <strong>SRA Cybersecurity Invariant:</strong> In compliance with SRA Code of Conduct and UK GDPR data protection rules for confidential settlement dossiers, an authenticator app (TOTP) is required.
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] px-4 py-3 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-semibold text-base rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Continue to Authenticator Verification →
              </button>

              <div className="pt-4 border-t border-[#E2DCCE] text-center space-y-3">
                <p className="text-sm text-[#0B1F3A]/75">
                  Considering joining the SettlementCheck panel?
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoMode(true);
                    setIsAuthenticated(true);
                  }}
                  className="w-full min-h-[48px] px-4 py-3 bg-[#F7F4EE] hover:bg-[#EFEAE0] text-[#0B1F3A] border border-[#C9C0AC] font-semibold text-base rounded-lg transition-colors cursor-pointer"
                >
                  Explore Interactive Partner Demo →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyTotp} className="space-y-5">
              <div className="text-center p-3.5 bg-[#F7F4EE] rounded-lg border border-[#E2DCCE]">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#0B1F3A]/70 block mb-1">Partner Account</span>
                <span className="text-sm font-mono font-bold text-[#0B1F3A] break-all">{workEmail}</span>
              </div>

              <div>
                <div className="flex flex-wrap justify-between items-center gap-2 mb-1.5">
                  <label className="block text-sm font-semibold text-[#0B1F3A]">
                    6-Digit Authenticator Code (TOTP)
                  </label>
                  <button
                    type="button"
                    onClick={() => setTotpCode('568912')}
                    className="text-sm font-medium text-[#D9603B] hover:underline cursor-pointer"
                  >
                    Use Demo Code (568912)
                  </button>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="000000"
                  autoFocus
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full min-h-[52px] p-3.5 border border-[#E2DCCE] rounded-lg text-center font-mono text-2xl tracking-[0.3em] font-bold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
                <p className="text-sm text-[#0B1F3A]/75 mt-2 text-center leading-relaxed">
                  Enter the 6-digit code from Google Authenticator, Microsoft Authenticator, or 1Password.
                </p>
              </div>

              {authError && (
                <div role="alert" className="p-3.5 bg-[#FEF5F3] border border-[#F3C4B8] rounded-lg text-sm text-[#D9603B] font-medium leading-relaxed">
                  {authError}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || totpCode.trim().length === 0}
                className="w-full min-h-[48px] px-4 py-3 bg-[#D9603B] hover:bg-[#D9603B]/90 text-white font-semibold text-base rounded-lg transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isVerifying ? 'Verifying TOTP Code...' : 'Verify & Launch Command Centre →'}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setAuthStep('credentials')}
                  className="min-h-[44px] px-3 text-sm font-medium text-[#0B1F3A]/80 hover:text-[#0B1F3A] underline cursor-pointer"
                >
                  ← Back to Credentials
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] pb-24">
      {isDemoMode && (
        <div className="bg-[#D9603B] text-white px-4 py-3">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 text-sm sm:text-base leading-snug">
              <span className="px-2.5 py-0.5 rounded bg-[#0B1F3A] text-white font-mono text-xs font-bold uppercase tracking-wider shrink-0">
                Demo Sandbox
              </span>
              <span className="font-medium">
                Sample Partner View: explore exclusive postcode routing, pre-flight dossiers, and PMS webhooks.
              </span>
            </div>
            <Link
              href="/for-solicitors/?from=portal-demo"
              onClick={() => trackClientEvent('solicitor_demo_to_apply', { source: 'portal_demo_banner' })}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white font-semibold text-sm transition-colors shrink-0 text-center"
            >
              Apply to Join the Panel →
            </Link>
          </div>
        </div>
      )}

      {/* ── Partner Portal Header ────────────────────────────────────────── */}
      <header className="bg-[#0B1F3A] text-white border-b border-[#0B1F3A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              <span className="text-[#D9603B]">Settlement</span>
              <span className="text-white">Check</span>
            </Link>
            <span className="text-white/30 text-lg font-light" aria-hidden="true">/</span>
            <span className="text-xs sm:text-sm uppercase font-mono tracking-widest text-[#D9603B] font-semibold">
              Partner Portal
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-sm">
            <span className="w-full sm:w-auto text-white/80">
              {isDemoMode ? 'Sample Firm: ' : 'Firm: '}
              <strong className="text-white font-semibold">Bristol Employment Law Specialists LLP</strong>{' '}
              <span className="text-white/70 font-mono text-xs">(SRA-649201)</span>
            </span>
            <span className="px-2.5 py-1 rounded bg-[#D9603B]/20 text-white font-mono text-xs border border-[#D9603B]/40 font-semibold inline-flex items-center gap-1.5">
              {isDemoMode ? 'DEMO SANDBOX' : <><span>🔒</span> MFA Active</>}
            </span>
            <span className="px-2.5 py-1 rounded bg-white/10 text-white font-mono text-xs border border-white/15">
              CHARTER PANEL
            </span>
            <button
              onClick={handleSignOut}
              className="min-h-[40px] px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors cursor-pointer"
            >
              {isDemoMode ? 'Exit Demo' : 'Sign Out'}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Tabs */}
        <nav aria-label="Partner portal sections" className="max-w-6xl mx-auto px-4 sm:px-6 border-t border-white/10 overflow-x-auto">
          <div className="flex gap-6 sm:gap-8 min-w-max">
            {[
              { id: 'pipeline', label: 'Instruction Pipeline' },
              { id: 'territory', label: 'Territory & Postcodes' },
              { id: 'telemetry', label: 'Settlement Telemetry' },
              { id: 'settings', label: 'PMS Webhook & Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`min-h-[48px] py-3.5 text-sm sm:text-base whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#D9603B] text-white font-semibold'
                    : 'border-transparent text-white/75 hover:text-white font-medium'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* ── Tab 1: Instruction Pipeline ─────────────────────────────────── */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            {/* Top KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-sm font-medium text-[#0B1F3A]/70 block mb-1">Active Instructions</span>
                <span className="text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">3</span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1">1 reserved under 15m SLA</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-sm font-medium text-[#0B1F3A]/70 block mb-1">Total Matters Claimed</span>
                <span className="text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">42</span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1">Lifetime territory allocations</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-sm font-medium text-[#0B1F3A]/70 block mb-1">Avg Pre-Flight Time Saved</span>
                <span className="text-3xl font-serif font-bold text-[#D9603B] tabular-nums">70 min</span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1">From 90 min down to 20 min</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-[#0B1F3A]/10 shadow-sm">
                <span className="text-sm font-medium text-[#0B1F3A]/70 block mb-1">SLA Response Speed</span>
                <span className="text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">11.4 min</span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1">15-minute target benchmark</span>
              </div>
            </div>

            {/* Instruction List Card */}
            <div className="bg-white rounded-2xl border border-[#0B1F3A]/10 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-[#0B1F3A]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A]">Exclusive Matter Queue</h1>
                  <p className="text-sm sm:text-base text-[#0B1F3A]/75 mt-1 leading-relaxed">
                    Pre-qualified employee instructions geocoded to your exclusive BS postcode cluster.
                  </p>
                </div>
                <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#0B1F3A]/75 bg-[#F7F4EE] px-3 py-1.5 rounded-full border border-[#0B1F3A]/10 self-start sm:self-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#D9603B]" />
                  Live Sync Active
                </span>
              </div>

              <div className="divide-y divide-[#0B1F3A]/10">
                {mockMatters.map(m => {
                  const isBelowFloor = m.employerOffer < m.statutoryFloor;
                  return (
                    <div
                      key={m.id}
                      className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-[#F7F4EE]/40 transition-colors"
                    >
                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Client Name + Status Badges */}
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="font-serif font-bold text-lg sm:text-xl text-[#0B1F3A]">{m.clientName}</h2>
                          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded bg-[#0B1F3A]/5 text-[#0B1F3A]">
                            {m.postcode}
                          </span>
                          {m.status === 'locked' && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D9603B]/10 text-[#D9603B] border border-[#D9603B]/30">
                              ⚡ 15-Min Exclusivity Lock: {Math.floor((m.timeRemainingSec || 0) / 60)}m left
                            </span>
                          )}
                          {m.status === 'claimed' && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0B1F3A]/10 text-[#0B1F3A]">
                              ✓ Claimed &amp; Active
                            </span>
                          )}
                          {m.status === 'completed' && (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#0B1F3A]/5 text-[#0B1F3A]/75">
                              Settlement Discharged
                            </span>
                          )}
                        </div>

                        {/* Dispute Summary */}
                        <p className="text-sm sm:text-base text-[#0B1F3A]/80 leading-snug">
                          {m.disputeReason} <span className="text-[#0B1F3A]/50">·</span>{' '}
                          <span className="text-sm text-[#0B1F3A]/70">Arrived {m.receivedAt}</span>
                        </p>

                        {/* Scannable Financial Strip */}
                        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 max-w-xl pt-1">
                          <div className="rounded-lg bg-[#F7F4EE] px-3 py-2 border border-[#0B1F3A]/5">
                            <span className="block text-xs font-medium text-[#0B1F3A]/70">Salary</span>
                            <span className="block text-base sm:text-lg font-serif font-bold text-[#0B1F3A] tabular-nums">
                              £{m.salary.toLocaleString('en-GB')}
                            </span>
                          </div>
                          <div className="rounded-lg bg-[#F7F4EE] px-3 py-2 border border-[#0B1F3A]/5">
                            <span className="block text-xs font-medium text-[#0B1F3A]/70">Offer</span>
                            <span className={`block text-base sm:text-lg font-serif font-bold tabular-nums ${isBelowFloor ? 'text-[#D9603B]' : 'text-[#0B1F3A]'}`}>
                              £{m.employerOffer.toLocaleString('en-GB')}
                            </span>
                          </div>
                          <div className="rounded-lg bg-[#F7F4EE] px-3 py-2 border border-[#0B1F3A]/5">
                            <span className="block text-xs font-medium text-[#0B1F3A]/70">Stat. Floor</span>
                            <span className="block text-base sm:text-lg font-serif font-bold text-[#0B1F3A] tabular-nums">
                              £{m.statutoryFloor.toLocaleString('en-GB')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Primary Action CTA */}
                      <div className="w-full lg:w-auto shrink-0">
                        <Link
                          href={`/dossier/review/${m.id}/?token=demo_partner_token`}
                          className={`inline-flex items-center justify-center w-full lg:w-auto min-h-[48px] px-5 py-3 rounded-xl text-sm sm:text-base font-semibold text-center transition-all ${
                            m.status === 'locked'
                              ? 'bg-[#D9603B] text-white hover:bg-[#D9603B]/90 shadow-sm'
                              : 'bg-[#0B1F3A] text-white hover:bg-[#0B1F3A]/90'
                          }`}
                        >
                          {m.status === 'locked' ? '⚡ Claim & Review Dossier →' : 'Open Pre-Flight Dossier →'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Territory & Postcodes ─────────────────────────────────── */}
        {activeTab === 'territory' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A]">Territorial Exclusivity Mapping</h1>
              <p className="text-base text-[#0B1F3A]/80 mt-2 max-w-prose leading-relaxed">
                Your law firm holds exclusive first-right routing on all employee instructions originating within these postal clusters.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 sm:p-6 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B1F3A]/75">Assigned Outward Postcodes</h2>
                <div className="flex flex-wrap gap-2">
                  {['BS8', 'BS1', 'BS2', 'BS3', 'BS6', 'BS7', 'BS9', 'BS10', 'BS16', 'BS20'].map(code => (
                    <span key={code} className="px-3.5 py-1.5 bg-white border border-[#0B1F3A]/15 rounded-lg text-sm font-mono font-bold text-[#0B1F3A]">
                      {code}
                    </span>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-[#0B1F3A]/80 pt-1">
                  Coverage Radius: <strong>30 miles</strong> from office hub (BS8 1TH, Bristol).
                </p>
              </div>

              <div className="p-5 sm:p-6 rounded-xl bg-[#0B1F3A] text-white space-y-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#D9603B]">The 15-Minute Exclusivity Lock</h2>
                <p className="text-base text-[#F7F4EE]/90 leading-relaxed">
                  When an employee inside your outward postcode zone completes our settlement agreement review, the instruction is locked exclusively to your firm for 15 minutes. It is never broadcast to multiple law firms simultaneously.
                </p>
                <div className="pt-2 text-sm text-white/80">
                  Panel Compliance Status: <strong className="text-white">SRA Regulatory Adherence</strong>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 3: Settlement Telemetry ──────────────────────────────────── */}
        {activeTab === 'telemetry' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A]">SettlementCheck Telemetry Intelligence</h1>
              <p className="text-base text-[#0B1F3A]/80 mt-2 max-w-prose leading-relaxed">
                Illustrative UK settlement multiplier benchmarks to support negotiation letters when challenging low employer ex-gratia offers.
              </p>
            </div>

            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
              <table className="w-full min-w-[640px] text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="border-b border-[#0B1F3A]/15 text-left text-xs uppercase tracking-wider text-[#0B1F3A]/70">
                    <th className="py-3 pr-4">Dispute Category</th>
                    <th className="py-3 pr-4">Median Multiplier</th>
                    <th className="py-3 pr-4">Upper Quartile</th>
                    <th className="py-3 pr-4">Employer Legal Fee</th>
                    <th className="py-3">Typical Resolution</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1F3A]/10">
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Redundancy / Structural Exit</td>
                    <td className="py-4 pr-4 tabular-nums">2.8x monthly salary</td>
                    <td className="py-4 pr-4 text-[#D9603B] font-semibold tabular-nums">4.2x monthly salary</td>
                    <td className="py-4 pr-4 tabular-nums">£650 + VAT</td>
                    <td className="py-4 text-[#0B1F3A]/80">2.4 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Performance Plan (PIP) Exit</td>
                    <td className="py-4 pr-4 tabular-nums">3.2x monthly salary</td>
                    <td className="py-4 pr-4 text-[#D9603B] font-semibold tabular-nums">4.8x monthly salary</td>
                    <td className="py-4 pr-4 tabular-nums">£750 + VAT</td>
                    <td className="py-4 text-[#0B1F3A]/80">3.1 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Discrimination / Detriment (Equality Act)</td>
                    <td className="py-4 pr-4 tabular-nums">4.5x monthly salary</td>
                    <td className="py-4 pr-4 text-[#D9603B] font-semibold tabular-nums">7.2x (Uncapped)</td>
                    <td className="py-4 pr-4 tabular-nums">£1,250 + VAT</td>
                    <td className="py-4 text-[#0B1F3A]/80">5.6 weeks</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Constructive Dismissal</td>
                    <td className="py-4 pr-4 tabular-nums">3.0x monthly salary</td>
                    <td className="py-4 pr-4 text-[#D9603B] font-semibold tabular-nums">4.6x monthly salary</td>
                    <td className="py-4 pr-4 tabular-nums">£650 + VAT</td>
                    <td className="py-4 text-[#0B1F3A]/80">3.8 weeks</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 4: PMS Webhook & Settings ────────────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A]">Practice Management System (PMS) Webhooks</h1>
              <p className="text-base text-[#0B1F3A]/80 mt-2 max-w-prose leading-relaxed">
                Configure automated intake dispatch into Clio Manage, LEAP, or PracticeEvolve with zero manual data entry.
              </p>
            </div>

            <form onSubmit={handleSaveWebhook} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                  Incoming Webhook URL (Clio / LEAP / PracticeEvolve)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={e => setWebhookUrl(e.target.value)}
                  className="w-full min-h-[48px] px-3.5 py-3 rounded-lg border border-[#0B1F3A]/20 text-base font-mono text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                  placeholder="https://app.clio.com/api/v4/webhooks/..."
                  required
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="min-h-[48px] px-6 py-3 bg-[#0B1F3A] text-white text-base font-semibold rounded-xl hover:bg-[#0B1F3A]/90 transition-colors cursor-pointer"
                >
                  Save Webhook Configuration
                </button>
                {isSaved && <span className="text-sm sm:text-base text-[#0B1F3A] font-semibold">✓ Saved successfully</span>}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
