'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SolicitorPreFlightDossier } from '@/lib/agentic-engine/types';
import MandatoryLegalDisclaimers from '@/components/MandatoryLegalDisclaimers';
import { getSandboxMatterOverrides, setSandboxMatterOverride } from '@/lib/portal-sandbox';

interface ConflictCheckMeta {
  employerName?: string | null;
  employerNameSource?: 'draft_extracted' | 'employee_provided' | null;
  signingDeadlineLabel?: string | null;
  hasDraftAgreement?: boolean;
  clientGoal?: string | null;
}

interface ReviewDossierClientProps {
  dossierId: string;
}

export default function ReviewDossierClient({ dossierId }: ReviewDossierClientProps) {
  const [dossier, setDossier] = useState<SolicitorPreFlightDossier | null>(null);
  const [conflictCheck, setConflictCheck] = useState<ConflictCheckMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [isReleased, setIsReleased] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [activeTab, setActiveTab] = useState<'overview' | 'statutory' | 'threat' | 'clauses' | 'telemetry' | 'pms'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [claimToken, setClaimToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // 1. Fetch dossier data on mount
  useEffect(() => {
    async function loadData() {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) setClaimToken(token);

        const res = await fetch(`/api/portal/dossier/${dossierId}/${token ? `?token=${encodeURIComponent(token)}` : ''}`);
        const data = await res.json();

        if (data.success && data.dossier) {
          setDossier(data.dossier);
          const demoFlag = Boolean(data.isDemo);
          setIsDemo(demoFlag);
          if (data.conflictCheck) {
            setConflictCheck(data.conflictCheck);
          }

          const sandboxOverride = demoFlag ? getSandboxMatterOverrides()[dossierId] : undefined;
          if (sandboxOverride?.status === 'released') {
            setIsReleased(true);
            setIsClaimed(false);
          } else if (sandboxOverride?.status === 'claimed' || sandboxOverride?.status === 'completed') {
            setIsClaimed(true);
          } else if (data.claimStatus) {
            setIsClaimed(Boolean(data.claimStatus.isClaimed));
          }

          if (data.claimStatus) {
            if (data.claimStatus.expiresAt) {
              const diffSec = Math.max(0, Math.floor((new Date(data.claimStatus.expiresAt).getTime() - Date.now()) / 1000));
              setSecondsRemaining(diffSec);
            }
            if (data.claimStatus.token) {
              setClaimToken(data.claimStatus.token);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching dossier:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [dossierId]);

  // 2. Countdown timer for 15-minute SLA watchdog
  useEffect(() => {
    if (isClaimed) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isClaimed]);

  // 3. Handle Matter Claim
  const handleClaim = async () => {
    if (isClaimed) return;
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await fetch('/api/portal/claim/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierId,
          claimToken,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsClaimed(true);
        setIsReleased(false);
        if (isDemo) {
          setSandboxMatterOverride(dossierId, { status: 'claimed', stage: 'conflict_cleared' });
        }
      } else {
        setClaimError(data.message || data.error || 'Failed to claim instruction. Please refresh and try again.');
      }
    } catch {
      setClaimError('Network error while claiming instruction. Please check your connection and retry.');
    } finally {
      setClaiming(false);
    }
  };

  const handleReleaseConflict = () => {
    setIsReleased(true);
    setIsClaimed(false);
    if (isDemo) {
      setSandboxMatterOverride(dossierId, {
        status: 'released',
        releaseReason: 'SRA Conflict of Interest',
      });
    }
  };

  // Clipboard helper
  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timerFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const portalHref = isDemo ? '/portal/?demo=true' : '/portal/';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center p-6 text-[#0B1F3A] text-center">
        <div className="w-12 h-12 border-4 border-[#0B1F3A]/20 border-t-[#D9603B] rounded-full animate-spin mb-5" />
        <h2 className="text-2xl font-bold font-serif">Compiling Pre-Flight Legal Dossier...</h2>
        <p className="text-base text-[#0B1F3A]/75 mt-2 max-w-md leading-relaxed">
          Evaluating ERA 1996 statutory invariants and Section 203 compliance.
        </p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center p-6 text-[#0B1F3A]">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#0B1F3A]/10 max-w-md w-full text-center">
          <h1 className="text-2xl font-bold font-serif mb-3">Dossier Unavailable</h1>
          <p className="text-base text-[#0B1F3A]/75 mb-6 leading-relaxed">
            This matter may have expired or the claim token provided is invalid.
          </p>
          <Link
            href="/portal/"
            className="inline-flex items-center justify-center min-h-[48px] w-full sm:w-auto px-6 py-3 bg-[#0B1F3A] text-white rounded-xl font-semibold text-base hover:bg-[#0B1F3A]/90 transition-colors"
          >
            Return to Solicitor Portal →
          </Link>
        </div>
      </div>
    );
  }

  const { matterSummary, statutoryAnalysis, threatAssessment, contractAudit, marketNegotiationBrief, crmPayload } = dossier;

  const verdictStyles: Record<string, { bg: string; text: string; label: string }> = {
    CRITICAL_STATUTORY_DEFICIT: { bg: 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]/30', text: 'text-[#D9603B]', label: 'Critical Statutory Deficit' },
    BELOW_MARKET_BENCHMARK: { bg: 'bg-[#B5802A]/10 text-[#8A5D16] border-[#B5802A]/30', text: 'text-[#8A5D16]', label: 'Below Market Benchmark' },
    FAIR_MARKET_RANGE: { bg: 'bg-[#0B1F3A]/10 text-[#0B1F3A] border-[#0B1F3A]/30', text: 'text-[#0B1F3A]', label: 'Fair Market Range' },
    ABOVE_MARKET_STANDARD: { bg: 'bg-[#0B1F3A]/10 text-[#0B1F3A] border-[#0B1F3A]/30', text: 'text-[#0B1F3A]', label: 'Above Market Standard' },
  };

  const activeVerdict = verdictStyles[matterSummary.strategicVerdict] || verdictStyles.BELOW_MARKET_BENCHMARK;

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] pb-24">
      {/* ── Top SLA Watchdog Sentinel Bar ──────────────────────────────────── */}
      <div className="sticky top-0 z-50 bg-[#0B1F3A] border-b border-white/10 text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] animate-pulse shrink-0 mt-1.5 sm:mt-0" />
            <div className="text-sm sm:text-base leading-snug">
              <span className="font-semibold text-white">
                {isDemo ? 'Interactive Sandbox Preview:' : 'SRA Territorial Instruction:'}
              </span>{' '}
              <span className="text-[#F7F4EE]/85">
                {isClaimed
                  ? isDemo
                    ? 'Synthetic Matter Claimed (Sandbox Only)'
                    : 'Instruction Claimed & Matter Locked to Your Firm'
                  : `15-Min Exclusivity Window: ${timerFormatted} remaining`}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href={portalHref}
              className="inline-flex items-center min-h-[44px] px-2 text-sm text-white/85 hover:text-white underline underline-offset-4"
            >
              ← Portal
            </Link>
            {!isReleased && (
              <button
                type="button"
                onClick={handleReleaseConflict}
                className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              >
                Release (Conflict)
              </button>
            )}
            <button
              onClick={handleClaim}
              disabled={isClaimed || isReleased || claiming}
              className={`flex-1 sm:flex-none min-h-[44px] px-5 py-2.5 rounded-xl text-sm sm:text-base font-semibold transition-all ${
                isReleased
                  ? 'bg-white/10 text-white/80 cursor-default border border-white/20'
                  : isClaimed
                    ? 'bg-white/10 text-white cursor-default border border-white/20'
                    : 'bg-[#D9603B] text-white hover:bg-[#D9603B]/90 shadow-sm active:scale-[0.99]'
              }`}
            >
              {isReleased
                ? 'Matter Released (Zero Penalty)'
                : isClaimed
                  ? 'Instruction Claimed'
                  : claiming
                    ? 'Securing Matter...'
                    : 'Hold & Confirm Instruction'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {claimError && (
          <div role="alert" className="mb-6 rounded-xl bg-[#FEF5F3] border border-[#D9603B]/40 p-4 text-sm sm:text-base text-[#D9603B] font-medium">
            {claimError}
          </div>
        )}

        {isDemo && (
          <div className="mb-6 rounded-xl bg-white border border-[#D9603B]/30 p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
              <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#D9603B]/10 text-[#D9603B] font-semibold self-start shrink-0">
                Sandbox Mode
              </span>
              <p className="text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed">
                This is a synthetic sample dossier for solicitor partner evaluation. No real client data is displayed, and claiming or exporting here does not affect live SRA instructions.
              </p>
            </div>
            <Link
              href="/for-solicitors/?from=dossier-demo"
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-[#0B1F3A] text-white text-sm font-semibold hover:bg-[#0B1F3A]/90 transition-colors whitespace-nowrap shrink-0"
            >
              Apply for live panel access →
            </Link>
          </div>
        )}

        {/* ── Matter Header Card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-[#0B1F3A]/10 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mb-6 pb-6 border-b border-[#0B1F3A]/10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded bg-[#0B1F3A]/5 text-[#0B1F3A]/80 font-semibold">
                  DOSSIER #{dossier.dossierId.slice(-8).toUpperCase()}
                </span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${activeVerdict.bg}`}>
                  {activeVerdict.label}
                </span>
                {threatAssessment.hasCaptiveSteering && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D9603B]/10 text-[#D9603B] border border-[#D9603B]/30 inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                    Captive Steering Flagged
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#0B1F3A]">
                {matterSummary.clientName}
              </h1>

              {/* SRA Conflict Check & Triage Context Strip */}
              {conflictCheck && (
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                  {conflictCheck.employerName ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F3A]/5 border border-[#0B1F3A]/15 text-[#0B1F3A] font-medium">
                      <span className="font-semibold">Counterparty:</span> {conflictCheck.employerName}
                      {conflictCheck.employerNameSource && (
                        <span className="text-xs font-mono text-[#0B1F3A]/65">
                          ({conflictCheck.employerNameSource === 'draft_extracted' ? 'Draft' : 'Pre-disclosed'})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#E2DCCE] text-[#0B1F3A]/85 font-medium">
                      <span className="font-semibold">SRA Conflict Check:</span> Confirm employer on first call
                    </span>
                  )}
                  {conflictCheck.signingDeadlineLabel && (
                    <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#D9603B]/10 border border-[#D9603B]/25 text-[#D9603B] font-medium">
                      Deadline: {conflictCheck.signingDeadlineLabel}
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#E2DCCE] text-[#0B1F3A]/85 font-medium">
                    {conflictCheck.hasDraftAgreement ? 'Draft Agreement Ready' : 'Offer Only (No Draft)'}
                  </span>
                </div>
              )}

              {/* Actionable Contact Strip for Mobile & Desktop */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 text-sm sm:text-base">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#0B1F3A]/10 text-[#0B1F3A] font-medium">
                  Postcode: <strong className="ml-1.5 font-mono">{matterSummary.clientContact.postcode}</strong>
                </span>
                <a
                  href={`tel:${matterSummary.clientContact.phone}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#D9603B]/30 text-[#D9603B] hover:bg-[#D9603B]/10 font-semibold transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {matterSummary.clientContact.phone}
                </a>
                <a
                  href={`mailto:${matterSummary.clientContact.email}`}
                  className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-1.5 rounded-lg bg-[#F7F4EE] border border-[#0B1F3A]/15 text-[#0B1F3A] hover:border-[#D9603B] hover:text-[#D9603B] font-medium transition-colors break-all"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  {matterSummary.clientContact.email}
                </a>
              </div>
            </div>

            <div className="lg:text-right bg-[#F7F4EE] lg:bg-transparent p-4 lg:p-0 rounded-xl border border-[#0B1F3A]/5 lg:border-0 shrink-0">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#0B1F3A]/65 block">Territory SLA Watchdog</span>
              <span className="text-base font-semibold text-[#0B1F3A] block mt-0.5">
                {dossier.territorialRouting?.matchedFirmName || 'SRA Designated Partner'}
              </span>
              <span className="text-sm text-[#0B1F3A]/75 block mt-0.5">
                {dossier.territorialRouting?.adminDistrict || 'United Kingdom'}{' '}
                {dossier.territorialRouting?.distanceMiles ? `(${dossier.territorialRouting.distanceMiles} mi)` : ''}
              </span>
            </div>
          </div>

          {/* ── Key Figures 4-Pillar Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
              <span className="text-sm font-medium text-[#0B1F3A]/75 block mb-1">Gross Annual Salary</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                £{matterSummary.keyFigures.salary.toLocaleString('en-GB')}
              </span>
              <span className="text-sm text-[#0B1F3A]/70 block mt-1.5">
                {matterSummary.keyFigures.tenureYears} yrs service ({matterSummary.keyFigures.age} yrs old)
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
              <span className="text-sm font-medium text-[#0B1F3A]/75 block mb-1">Current Employer Offer</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#D9603B] tabular-nums">
                £{matterSummary.keyFigures.employerOffer.toLocaleString('en-GB')}
              </span>
              <span className="text-sm text-[#0B1F3A]/70 block mt-1.5">
                Legal Fee Offered: £{matterSummary.keyFigures.employerLegalFeeOffered} + VAT
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
              <span className="text-sm font-medium text-[#0B1F3A]/75 block mb-1">ERA 1996 Statutory Floor</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                £{matterSummary.keyFigures.statutoryMinimum.toLocaleString('en-GB')}
              </span>
              <span className={`text-sm font-semibold block mt-1.5 ${statutoryAnalysis.isOfferBelowStatutoryMinimum ? 'text-[#D9603B]' : 'text-[#0B1F3A]/80'}`}>
                {statutoryAnalysis.isOfferBelowStatutoryMinimum
                  ? `Deficit: -£${statutoryAnalysis.statutoryShortfallDelta.toLocaleString('en-GB')}`
                  : 'Offer clears statutory floor'}
              </span>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#0B1F3A] text-white">
              <span className="text-sm font-medium text-[#F7F4EE]/80 block mb-1">Market Counter Target</span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">
                £{matterSummary.keyFigures.targetSettlement.toLocaleString('en-GB')}
              </span>
              <span className="text-sm text-[#F7F4EE]/90 font-medium block mt-1.5">
                Legal Fee Demand: <strong className="text-[#D9603B]">£{matterSummary.keyFigures.recommendedLegalFeeDemand} + VAT</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ── Mandatory Regulatory & Common Law Disclaimers ─────────────────── */}
        <MandatoryLegalDisclaimers className="mb-6" />

        {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Dossier analysis sections"
          className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 border-b border-[#0B1F3A]/10"
        >
          {[
            { id: 'overview', label: '1. Executive Brief' },
            { id: 'statutory', label: '2. Statutory Floor (ERA 1996)' },
            { id: 'threat', label: '3. Captive Threat Sentinel' },
            { id: 'clauses', label: '4. S.203 Contract Audit' },
            { id: 'telemetry', label: '5. Market Telemetry' },
            { id: 'pms', label: '6. PMS Export' },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[44px] px-4 py-2.5 rounded-xl text-sm sm:text-base whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0B1F3A] text-white font-semibold shadow-sm'
                  : 'bg-white text-[#0B1F3A]/80 hover:text-[#0B1F3A] border border-[#0B1F3A]/15 font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Executive Brief ───────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#0B1F3A]/10 shadow-sm">
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-3 text-[#0B1F3A]">Matter Strategy &amp; Case Overview</h2>
                <p className="text-base text-[#0B1F3A]/85 leading-relaxed mb-5 max-w-prose">
                  The client has received a formal settlement agreement offer of £{matterSummary.keyFigures.employerOffer.toLocaleString('en-GB')}. Based on continuous employment tenure of {matterSummary.keyFigures.tenureYears} years and gross annual remuneration of £{matterSummary.keyFigures.salary.toLocaleString('en-GB')}, the statutory minimum floor is calculated at £{matterSummary.keyFigures.statutoryMinimum.toLocaleString('en-GB')} under ERA 1996 ss.86 &amp; 162.
                </p>

                {statutoryAnalysis.isOfferBelowStatutoryMinimum ? (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#D9603B]/10 border border-[#D9603B]/30 mb-5">
                    <h3 className="text-xs font-bold text-[#D9603B] uppercase tracking-wider mb-1.5">Statutory Baseline Comparison</h3>
                    <p className="text-sm sm:text-base text-[#0B1F3A] leading-relaxed">
                      The recorded employer offer sits <strong>£{statutoryAnalysis.statutoryShortfallDelta.toLocaleString('en-GB')}</strong> below the calculated statutory redundancy and notice baseline (subject to eligibility under ERA 1996 s.141 and absence of summary dismissal for gross misconduct).
                    </p>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#0B1F3A]/5 border border-[#0B1F3A]/15 mb-5">
                    <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">Commercial Negotiation Opportunity</h3>
                    <p className="text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed">
                      While the offer satisfies the statutory floor, comparable matters in this category typically settle between £{marketNegotiationBrief.typicalSettlementRange.low.toLocaleString('en-GB')} and £{marketNegotiationBrief.typicalSettlementRange.high.toLocaleString('en-GB')}.
                    </p>
                  </div>
                )}

                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F3A]/75 mb-3">Key Tactical Action Items</h3>
                <ul className="space-y-3 text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed">
                  {marketNegotiationBrief.tacticalNegotiationPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#D9603B] font-bold mt-0.5">›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SRA Compliance & Disclaimer */}
              <div className="bg-[#0B1F3A]/5 rounded-xl p-5 border border-[#0B1F3A]/10 text-sm text-[#0B1F3A]/80 leading-relaxed">
                <strong className="text-[#0B1F3A] block mb-1">SRA Independence Statement:</strong>
                {dossier.sraComplianceStatement}
              </div>
            </div>

            {/* Right Quick Actions Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#0B1F3A]/10 shadow-sm">
                <h2 className="font-serif font-bold text-lg mb-4 text-[#0B1F3A]">Quick Adviser Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(threatAssessment.counterNoticeDraft || '', 'parity-notice')}
                    className="w-full min-h-[48px] text-left px-4 py-3 rounded-xl border border-[#0B1F3A]/15 hover:border-[#D9603B] transition-colors text-sm sm:text-base font-semibold text-[#0B1F3A] flex items-center justify-between gap-2"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-[#0B1F3A]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      </svg>
                      Copy Fee Parity Notice
                    </span>
                    <span className="text-xs font-bold text-[#D9603B] shrink-0">{copiedKey === 'parity-notice' ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(JSON.stringify(crmPayload.clioMatterPayload, null, 2), 'clio-json')}
                    className="w-full min-h-[48px] text-left px-4 py-3 rounded-xl border border-[#0B1F3A]/15 hover:border-[#D9603B] transition-colors text-sm sm:text-base font-semibold text-[#0B1F3A] flex items-center justify-between gap-2"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-[#0B1F3A]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Export Clio / LEAP JSON
                    </span>
                    <span className="text-xs font-bold text-[#D9603B] shrink-0">{copiedKey === 'clio-json' ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full min-h-[48px] text-left px-4 py-3 rounded-xl border border-[#0B1F3A]/15 hover:border-[#0B1F3A] transition-colors text-sm sm:text-base font-semibold text-[#0B1F3A] flex items-center justify-between gap-2"
                  >
                    <span className="inline-flex items-center gap-2.5">
                      <svg className="w-4 h-4 text-[#0B1F3A]/70 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="6 9 6 2 18 2 18 9" />
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                        <rect width="12" height="8" x="6" y="14" />
                      </svg>
                      Print Dossier PDF
                    </span>
                    <span className="text-xs font-semibold text-[#0B1F3A]/70 shrink-0">Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#0B1F3A]/10 shadow-sm">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B1F3A]/75 mb-3">Red Flags Detected</h2>
                <div className="space-y-3">
                  {contractAudit.redFlags.length === 0 ? (
                    <span className="text-sm text-[#0B1F3A]/75">Zero high-risk contractual clauses identified.</span>
                  ) : (
                    contractAudit.redFlags.map((rf, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                        <span className={`text-xs font-bold block uppercase tracking-wide ${rf.severity === 'high' ? 'text-[#D9603B]' : 'text-[#8A5D16]'}`}>
                          {rf.category.replace(/_/g, ' ')} ({rf.severity})
                        </span>
                        <span className="text-sm text-[#0B1F3A]/85 block mt-1 leading-relaxed">{rf.issueDescription}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 2: Statutory Floor (ERA 1996) ────────────────────────────── */}
        {activeTab === 'statutory' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">Statutory Entitlement Breakdown (ERA 1996)</h2>
              <p className="text-sm sm:text-base text-[#0B1F3A]/80 mt-2 leading-relaxed max-w-prose">
                Evaluated deterministically against {statutoryAnalysis.governingLegislation}. Weekly statutory cap applied: <strong>£{statutoryAnalysis.weeklyCapUsed}/wk</strong>. Maximum service years capped at: <strong>{statutoryAnalysis.maxServiceYearsApplied} years</strong>.
              </p>
            </div>

            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
              <table className="w-full min-w-[540px] text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="border-b border-[#0B1F3A]/15 text-left text-xs uppercase tracking-wider text-[#0B1F3A]/70">
                    <th className="py-3 pr-4">Statutory Component</th>
                    <th className="py-3 pr-4">Governing Statute</th>
                    <th className="py-3 text-right">Statutory Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1F3A]/10">
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Statutory Redundancy Pay (SRP)</td>
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm">ERA 1996 s.162 (Age-weighted multiplier)</td>
                    <td className="py-4 text-right font-semibold tabular-nums">£{statutoryAnalysis.statutoryRedundancyPay.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Statutory Notice Pay (PILON)</td>
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm">ERA 1996 s.86 (1 wk/yr, uncapped weekly pay)</td>
                    <td className="py-4 text-right font-semibold tabular-nums">£{statutoryAnalysis.noticePayPilon.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr className="bg-[#F7F4EE] font-bold">
                    <td className="py-4 px-2 text-[#0B1F3A]">Calculated Statutory Baseline</td>
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm font-normal">ERA 1996 Baseline (Subject to s.141 eligibility)</td>
                    <td className="py-4 px-2 text-right text-lg text-[#0B1F3A] tabular-nums">£{statutoryAnalysis.statutoryMinimumTotal.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Tax-Free Termination Exemption</td>
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm">ITEPA 2003 s.403 (£30,000 threshold)</td>
                    <td className="py-4 text-right font-semibold text-[#0B1F3A] tabular-nums">£{statutoryAnalysis.taxFreeTerminationPortion.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Taxable Termination Portion</td>
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm">Subject to marginal income tax &amp; employer Class 1A NIC</td>
                    <td className="py-4 text-right font-semibold tabular-nums">£{statutoryAnalysis.taxableTerminationPortion.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 pr-4 font-semibold text-[#0B1F3A]">Estimated Net Client Take-Home</td>
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm">After deduction of PAYE income tax on notice &amp; excess</td>
                    <td className="py-4 text-right text-lg font-bold text-[#D9603B] tabular-nums">£{statutoryAnalysis.estimatedNetTakeHome.toLocaleString('en-GB')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 3: Captive Threat Sentinel ────────────────────────────────── */}
        {activeTab === 'threat' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">Captive Steering &amp; Independence Sentinel</h2>
                <p className="text-sm sm:text-base text-[#0B1F3A]/75 mt-1">
                  Section 203(3) ERA 1996 &amp; SRA Code of Conduct Rule 2.1 compliance check.
                </p>
              </div>
              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${threatAssessment.hasCaptiveSteering ? 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]/30' : 'bg-[#0B1F3A]/5 text-[#0B1F3A] border-[#0B1F3A]/20'}`}>
                {threatAssessment.hasCaptiveSteering ? 'CAPTIVE STEERING DETECTED' : 'CLEAR: INDEPENDENT SELECTION PERMITTED'}
              </span>
            </div>

            {threatAssessment.hasCaptiveSteering && (
              <div className="p-4 sm:p-5 rounded-xl bg-[#D9603B]/10 border border-[#D9603B]/25 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9603B] block">Steering Audit Excerpt</span>
                <p className="text-sm sm:text-base text-[#0B1F3A] font-medium leading-relaxed">{threatAssessment.captiveClauseExcerpt}</p>
                {threatAssessment.feePenaltyAmount ? (
                  <p className="text-sm sm:text-base text-[#D9603B] font-semibold">
                    Employer imposes a £{threatAssessment.feePenaltyAmount} penalty on independent legal advice.
                  </p>
                ) : null}
              </div>
            )}

            {threatAssessment.counterNoticeDraft && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B1F3A]/80">
                    SRA Legal Fee Parity Counter-Notice (Ready for Signature)
                  </h3>
                  <button
                    onClick={() => copyToClipboard(threatAssessment.counterNoticeDraft || '', 'notice-tab')}
                    className="min-h-[44px] px-4 py-2 text-sm font-semibold bg-[#D9603B] text-white rounded-lg hover:bg-[#D9603B]/90 transition-colors"
                  >
                    {copiedKey === 'notice-tab' ? '✓ Copied to Clipboard' : 'Copy Notice Text'}
                  </button>
                </div>

                <pre className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 text-sm font-mono whitespace-pre-wrap text-[#0B1F3A] leading-relaxed overflow-x-auto">
                  {threatAssessment.counterNoticeDraft}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: S.203 Contract Risk Audit ─────────────────────────────── */}
        {activeTab === 'clauses' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">Section 203 ERA 1996 Contract Schedule &amp; Risk Register</h2>
              <p className="text-sm sm:text-base text-[#0B1F3A]/80 mt-1.5 leading-relaxed">
                Automated audit of draft settlement clauses against statutory requirements and overreaching waivers.
              </p>
            </div>

            <div className="space-y-4">
              {contractAudit.redFlags.map((flag, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl border border-[#0B1F3A]/10 bg-[#F7F4EE]/60 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-[#0B1F3A]">
                      {idx + 1}. {flag.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded ${flag.severity === 'high' ? 'bg-[#D9603B]/10 text-[#D9603B]' : 'bg-[#B5802A]/10 text-[#8A5D16]'}`}>
                      {flag.severity.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed">{flag.issueDescription}</p>
                  <div className="p-3.5 sm:p-4 bg-white rounded-lg border border-[#0B1F3A]/10">
                    <span className="font-bold block text-xs text-[#0B1F3A]/70 uppercase tracking-wider mb-1.5">Recommended Amendment Clause</span>
                    <span className="font-mono text-sm text-[#0B1F3A] leading-relaxed block">{flag.recommendedAmendment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 5: Market Telemetry ──────────────────────────────────────── */}
        {activeTab === 'telemetry' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">SettlementCheck Telemetry Intelligence</h2>
              <p className="text-sm sm:text-base text-[#0B1F3A]/80 mt-1.5 leading-relaxed">
                Aggregated settlement multiplier benchmarks based on {marketNegotiationBrief.sampleSize} UK matters in this category.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                <span className="text-sm font-medium text-[#0B1F3A]/75 block mb-1">Median Settlement Multiplier</span>
                <span className="text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                  {marketNegotiationBrief.medianSettlementMultiplier}x
                </span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1.5">Monthly gross salary equivalent</span>
              </div>

              <div className="p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                <span className="text-sm font-medium text-[#0B1F3A]/75 block mb-1">Upper Quartile Multiplier</span>
                <span className="text-3xl font-serif font-bold text-[#D9603B] tabular-nums">
                  {marketNegotiationBrief.upperQuartileMultiplier}x
                </span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1.5">75th percentile negotiated exit</span>
              </div>

              <div className="p-5 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                <span className="text-sm font-medium text-[#0B1F3A]/75 block mb-1">Typical Negotiated Settlement</span>
                <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                  £{marketNegotiationBrief.typicalSettlementRange.low.toLocaleString('en-GB')} – £{marketNegotiationBrief.typicalSettlementRange.high.toLocaleString('en-GB')}
                </span>
                <span className="text-sm text-[#0B1F3A]/70 block mt-1.5">
                  {marketNegotiationBrief.typicalSettlementRange.uncapped ? 'Uncapped statutory compensation' : 'Standard compensatory bounds'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 6: PMS Integration & Export (SC-B-027) ──────────────────────── */}
        {activeTab === 'pms' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#0B1F3A]/10 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D9603B] font-semibold block mb-1">
                  1-Click Practice Management Export (SC-B-027)
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">
                  Clio &amp; LEAP Legal Software Intake Integration
                </h2>
              </div>
              <span className="text-xs font-mono bg-[#0B1F3A]/5 text-[#0B1F3A] px-3 py-1.5 rounded self-start sm:self-center">
                REST / Webhook / CSV
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#0B1F3A]/80 leading-relaxed max-w-prose">
              Eliminate manual case re-typing. Export verified settlement dossier payloads directly into Clio Grow/Manage, LEAP, or PracticeEvolve to maintain 15-minute SLA intake compliance.
            </p>

            {/* 1-Click Action Buttons Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Clio 1-Click Download */}
              <button
                type="button"
                onClick={() => {
                  const blob = new Blob([JSON.stringify(crmPayload.clioMatterPayload, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `clio_matter_${dossierId}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="min-h-[48px] px-4 py-3 bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Clio Intake (JSON)
              </button>

              {/* LEAP CSV 1-Click Download */}
              <button
                type="button"
                onClick={() => {
                  const headers = [
                    'Matter ID', 'Lead Source', 'Client Name', 'Client Email', 'Client Phone', 'Client Postcode',
                    'Tenure Years', 'Age', 'Gross Salary', 'Employer Offer', 'Statutory Minimum Floor',
                    'Target Settlement', 'Employer Legal Fee Offered', 'Recommended Legal Fee Demand',
                    'Strategic Verdict', 'SRA s203 Review Required'
                  ];
                  const row = [
                    dossierId,
                    crmPayload.leadSource,
                    matterSummary.clientName,
                    matterSummary.clientContact.email,
                    matterSummary.clientContact.phone,
                    matterSummary.clientContact.postcode,
                    matterSummary.keyFigures.tenureYears,
                    matterSummary.keyFigures.age,
                    matterSummary.keyFigures.salary,
                    matterSummary.keyFigures.employerOffer,
                    matterSummary.keyFigures.statutoryMinimum,
                    matterSummary.keyFigures.targetSettlement,
                    matterSummary.keyFigures.employerLegalFeeOffered,
                    matterSummary.keyFigures.recommendedLegalFeeDemand,
                    matterSummary.strategicVerdict,
                    'YES'
                  ].map(v => `"${String(v).replace(/"/g, '""')}"`);
                  const csvContent = `${headers.map(h => `"${h}"`).join(',')}\n${row.join(',')}`;
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `leap_matter_${dossierId}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="min-h-[48px] px-4 py-3 bg-[#D9603B] hover:bg-[#D9603B]/90 text-white rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export LEAP Intake (CSV)
              </button>

              {/* Copy Full Webhook Payload */}
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(crmPayload.clioMatterPayload, null, 2), 'pms-tab')}
                className="min-h-[48px] px-4 py-3 bg-white border border-[#0B1F3A]/20 hover:border-[#0B1F3A] text-[#0B1F3A] rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedKey === 'pms-tab' ? (
                  <><span>✓</span> Copied JSON Payload</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy REST Payload
                  </>
                )}
              </button>
            </div>

            {/* Code Preview */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-mono font-semibold text-[#0B1F3A]/75">
                  Clio / LEAP Standard Intake Payload Preview
                </span>
                <span className="text-xs font-mono text-[#0B1F3A]/65">schema: settlementcheck.co.uk/v1</span>
              </div>
              <pre className="p-4 sm:p-5 rounded-xl bg-[#0B1F3A] text-[#F7F4EE] text-sm font-mono overflow-x-auto leading-relaxed max-h-80">
                {JSON.stringify(crmPayload.clioMatterPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
