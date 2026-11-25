'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SolicitorPreFlightDossier } from '@/lib/agentic-engine/types';
import { STATUTORY_RATES_2026_27, VENTO_BANDS_2026_27 } from '@/lib/statutory-rates';
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
  const [activeTab, setActiveTab] = useState<'overview' | 'statutory' | 'threat' | 'clauses' | 'caps' | 'pms'>('overview');
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
    if (isClaimed || isReleased) return;
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
  }, [isClaimed, isReleased]);

  // 3. Handle Matter Claim
  const handleClaim = async () => {
    if (isClaimed || isReleased) return;
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
          Evaluating ERA 1996 statutory baselines, ITEPA 2003 tax split, and Section 203(3) terms.
        </p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center p-6 text-[#0B1F3A]">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#E2DCCE] max-w-md w-full text-center">
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

  const isDeadlineUrgent =
    Boolean(conflictCheck?.signingDeadlineLabel) &&
    conflictCheck?.signingDeadlineLabel !== 'Completed' &&
    conflictCheck?.signingDeadlineLabel !== 'Signed';

  const offerHeadroom = matterSummary.keyFigures.employerOffer - matterSummary.keyFigures.statutoryMinimum;
  const employerClass1ANic = Math.round(
    statutoryAnalysis.taxableTerminationPortion * STATUTORY_RATES_2026_27.employerClass1ANICRate
  );

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] pb-24">
      {/* ── Compact Sticky Top Action Bar ──────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-[#0B1F3A] border-b border-white/10 text-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <Link
              href={portalHref}
              className="inline-flex items-center gap-1.5 min-h-[40px] text-sm font-medium text-white/85 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Portal
            </Link>
            <span className="text-white/25" aria-hidden="true">|</span>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse shrink-0" />
              <span className="font-medium text-white/90 truncate">
                {isReleased
                  ? 'Released (Zero Penalty)'
                  : isClaimed
                    ? isDemo
                      ? 'Sandbox · Claimed'
                      : 'Instruction Claimed'
                    : `15m Hold: ${timerFormatted}`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            {!isReleased && (
              <button
                type="button"
                onClick={handleReleaseConflict}
                className="min-h-[42px] px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              >
                Release (Conflict)
              </button>
            )}
            <button
              onClick={handleClaim}
              disabled={isClaimed || isReleased || claiming}
              className={`min-h-[42px] px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isReleased
                  ? 'col-span-2 bg-white/10 text-white/75 cursor-default border border-white/15'
                  : isClaimed
                    ? 'bg-white/10 text-white cursor-default border border-white/20'
                    : 'bg-[#D9603B] text-white hover:bg-[#D9603B]/90 shadow-sm'
              }`}
            >
              {isReleased
                ? 'Matter Released'
                : isClaimed
                  ? 'Instruction Claimed'
                  : claiming
                    ? 'Holding...'
                    : 'Hold & Confirm'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7">
        {claimError && (
          <div role="alert" className="mb-5 rounded-xl bg-[#FEF5F3] border border-[#D9603B]/40 p-4 text-sm text-[#D9603B] font-medium">
            {claimError}
          </div>
        )}

        {isDemo && (
          <div className="mb-5 rounded-xl bg-white border border-[#E2DCCE] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-sm text-[#0B1F3A]/80">
              <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1F3A]/10 text-[#0B1F3A] font-semibold shrink-0">
                Sandbox
              </span>
              <span>Synthetic sample dossier for partner evaluation. No live SRA matter is affected.</span>
            </div>
            <Link
              href="/for-solicitors/?from=dossier-demo"
              className="text-sm font-semibold text-[#D9603B] hover:underline whitespace-nowrap shrink-0"
            >
              Apply for panel access →
            </Link>
          </div>
        )}

        {/* ── Structured Legal Matter Sheet Card ────────────────────────────── */}
        <section className="bg-white rounded-2xl border border-[#E2DCCE] shadow-sm overflow-hidden mb-6">
          {/* Top Matter Identity Row */}
          <div className="p-5 sm:p-7 border-b border-[#E2DCCE] flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#0B1F3A]/65 font-semibold">
                  DOSSIER #{dossier.dossierId.slice(-8).toUpperCase()}
                </span>
                {threatAssessment.hasCaptiveSteering && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-[#D9603B]/10 text-[#D9603B] border border-[#D9603B]/25 inline-flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                      <path d="M12 9v4" />
                      <path d="M12 17h.01" />
                    </svg>
                    Captive Steering Flagged
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#0B1F3A] m-0">
                {matterSummary.clientName}
              </h1>
              <p className="text-sm text-[#0B1F3A]/70 m-0">
                Routed to <strong className="text-[#0B1F3A]">{dossier.territorialRouting?.matchedFirmName || 'SRA Designated Partner'}</strong>
                {dossier.territorialRouting?.adminDistrict ? ` · ${dossier.territorialRouting.adminDistrict}` : ''}
              </p>
            </div>

            {/* Uniform 2-Button Contact Action Bar */}
            <div className="grid grid-cols-2 gap-2.5 md:w-auto shrink-0">
              <a
                href={`tel:${matterSummary.clientContact.phone}`}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Client
              </a>
              <a
                href={`mailto:${matterSummary.clientContact.email}`}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl bg-[#F7F4EE] hover:bg-[#EFEAE0] border border-[#E2DCCE] text-[#0B1F3A] text-sm font-semibold transition-colors"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                Email Client
              </a>
            </div>
          </div>

          {/* Uniform 2x2 / 4-Col Structured Matter Metadata Grid (Replaces Pill Soup) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E2DCCE] bg-[#F7F4EE]/60 border-b border-[#E2DCCE]">
            <div className="p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                Counterparty (SRA 6.2)
              </span>
              <span className="block text-sm font-semibold text-[#0B1F3A] mt-1 leading-snug">
                {conflictCheck?.employerName || 'Confirm on first call'}
              </span>
              {conflictCheck?.employerNameSource && (
                <span className="block text-xs text-[#0B1F3A]/60 mt-0.5">
                  {conflictCheck.employerNameSource === 'draft_extracted' ? 'Extracted from draft' : 'Pre-disclosed by client'}
                </span>
              )}
            </div>

            <div className="p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                Signing Deadline
              </span>
              <span className={`block text-sm font-semibold mt-1 leading-snug ${isDeadlineUrgent ? 'text-[#D9603B]' : 'text-[#0B1F3A]'}`}>
                {conflictCheck?.signingDeadlineLabel || 'Not specified'}
              </span>
              <span className="block text-xs text-[#0B1F3A]/60 mt-0.5">
                {conflictCheck?.clientGoal || 'Standard review'}
              </span>
            </div>

            <div className="p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                Document Status
              </span>
              <span className="block text-sm font-semibold text-[#0B1F3A] mt-1 leading-snug">
                {conflictCheck?.hasDraftAgreement ? 'Draft Agreement Ready' : 'Offer Only (No Draft)'}
              </span>
              <span className="block text-xs text-[#0B1F3A]/60 mt-0.5">
                Section 203(3) ERA 1996
              </span>
            </div>

            <div className="p-4">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                Client Contact
              </span>
              <span className="block text-sm font-mono font-semibold text-[#0B1F3A] mt-1 leading-snug">
                {matterSummary.clientContact.postcode}
              </span>
              <span className="block text-xs text-[#0B1F3A]/65 mt-0.5 truncate">
                {matterSummary.clientContact.phone}
              </span>
            </div>
          </div>

          {/* Uniform 4-Pillar Financial Summary (100% Deterministic Statute & Tax) */}
          <div className="p-5 sm:p-7 grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">
                Gross Salary
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums mt-1.5">
                £{matterSummary.keyFigures.salary.toLocaleString('en-GB')}
              </span>
              <span className="text-xs sm:text-sm text-[#0B1F3A]/70 block mt-1.5">
                {matterSummary.keyFigures.tenureYears} yrs service · Age {matterSummary.keyFigures.age}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">
                Employer Offer
              </span>
              <span className={`text-2xl sm:text-3xl font-serif font-bold tabular-nums mt-1.5 ${statutoryAnalysis.isOfferBelowStatutoryMinimum ? 'text-[#D9603B]' : 'text-[#0B1F3A]'}`}>
                £{matterSummary.keyFigures.employerOffer.toLocaleString('en-GB')}
              </span>
              <span className="text-xs sm:text-sm text-[#0B1F3A]/70 block mt-1.5">
                Fee offered: £{matterSummary.keyFigures.employerLegalFeeOffered} + VAT
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">
                ERA 1996 Floor
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums mt-1.5">
                £{matterSummary.keyFigures.statutoryMinimum.toLocaleString('en-GB')}
              </span>
              <span className={`text-xs sm:text-sm font-semibold block mt-1.5 ${statutoryAnalysis.isOfferBelowStatutoryMinimum ? 'text-[#D9603B]' : 'text-[#0B1F3A]/75'}`}>
                {statutoryAnalysis.isOfferBelowStatutoryMinimum
                  ? `Shortfall: -£${statutoryAnalysis.statutoryShortfallDelta.toLocaleString('en-GB')}`
                  : `+£${offerHeadroom.toLocaleString('en-GB')} above floor`}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1F3A] text-white flex flex-col justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
                Tax-Free (s.403)
              </span>
              <span className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums mt-1.5">
                £{statutoryAnalysis.taxFreeTerminationPortion.toLocaleString('en-GB')}
              </span>
              <span className="text-xs sm:text-sm text-white/80 block mt-1.5">
                {statutoryAnalysis.taxableTerminationPortion > 0
                  ? `£${statutoryAnalysis.taxableTerminationPortion.toLocaleString('en-GB')} excess (15% Class 1A)`
                  : 'Within £30k s.403 limit'}
              </span>
            </div>
          </div>

          {/* Concise B2B Solicitor Triage Notice (Replaces B2C Employee Tips) */}
          <div className="px-5 sm:px-7 py-3 bg-[#F7F4EE] border-t border-[#E2DCCE] text-xs text-[#0B1F3A]/75 leading-relaxed">
            <strong>Solicitor Pre-Flight Triage Notice:</strong> Deterministic calculation based on client-supplied parameters and April 2026 UK statutory limits. Verify employment contract, termination date, notice entitlement, and ERA 1996 s.141 eligibility prior to advising.
          </div>
        </section>

        {/* ── Clean 2-Col Mobile / Inline Desktop Tab Grid (Zero Scrollbar) ── */}
        <div
          role="tablist"
          aria-label="Dossier analysis sections"
          className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap gap-2 mb-6"
        >
          {[
            { id: 'overview', label: '1. Executive Brief' },
            { id: 'statutory', label: '2. ERA 1996 Floor' },
            { id: 'threat', label: '3. Steering Check' },
            { id: 'clauses', label: '4. S.203 Clauses' },
            { id: 'caps', label: '5. Statutory Caps' },
            { id: 'pms', label: '6. PMS Export' },
          ].map(tab => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`min-h-[44px] px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left sm:text-center transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0B1F3A] text-white shadow-sm'
                  : 'bg-white text-[#0B1F3A]/80 hover:text-[#0B1F3A] border border-[#E2DCCE]'
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
              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E2DCCE] shadow-sm">
                <h2 className="font-serif font-bold text-xl sm:text-2xl mb-3 text-[#0B1F3A]">Matter Strategy &amp; Statutory Summary</h2>
                <p className="text-base text-[#0B1F3A]/85 leading-relaxed mb-5 max-w-prose">
                  The client has received a settlement offer of £{matterSummary.keyFigures.employerOffer.toLocaleString('en-GB')} with £{matterSummary.keyFigures.employerLegalFeeOffered} + VAT offered towards independent legal advice. Based on {matterSummary.keyFigures.tenureYears} completed years of service and gross annual salary of £{matterSummary.keyFigures.salary.toLocaleString('en-GB')}, the deterministic statutory floor is £{matterSummary.keyFigures.statutoryMinimum.toLocaleString('en-GB')} under ERA 1996 ss.86 &amp; 162.
                </p>

                {statutoryAnalysis.isOfferBelowStatutoryMinimum ? (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#D9603B]/10 border border-[#D9603B]/30 mb-5">
                    <h3 className="text-xs font-bold text-[#D9603B] uppercase tracking-wider mb-1.5">Statutory Shortfall Identified</h3>
                    <p className="text-sm sm:text-base text-[#0B1F3A] leading-relaxed m-0">
                      The employer offer sits <strong>£{statutoryAnalysis.statutoryShortfallDelta.toLocaleString('en-GB')}</strong> below the calculated statutory redundancy and notice baseline (subject to eligibility under ERA 1996 s.141 and absence of summary dismissal for gross misconduct).
                    </p>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] mb-5">
                    <h3 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1.5">Statutory &amp; Tax Structuring Summary</h3>
                    <p className="text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed m-0">
                      The offer clears the calculated ERA 1996 baseline by <strong>£{offerHeadroom.toLocaleString('en-GB')}</strong>. Under ITEPA 2003 s.403, £{statutoryAnalysis.taxFreeTerminationPortion.toLocaleString('en-GB')} falls within the £30,000 exemption
                      {statutoryAnalysis.taxableTerminationPortion > 0
                        ? ` and £${statutoryAnalysis.taxableTerminationPortion.toLocaleString('en-GB')} is taxable excess (attracting approx. £${employerClass1ANic.toLocaleString('en-GB')} Employer Class 1A NIC at 15.0% unless structured via pension).`
                        : '.'}
                    </p>
                  </div>
                )}

                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/70 mb-3">Statutory &amp; Contractual Review Points</h3>
                <ul className="space-y-3 text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed">
                  {marketNegotiationBrief.tacticalNegotiationPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-[#D9603B] font-bold mt-0.5">›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white rounded-xl p-5 border border-[#E2DCCE] text-sm text-[#0B1F3A]/80 leading-relaxed">
                <strong className="text-[#0B1F3A] block mb-1">SRA Independence Statement:</strong>
                {dossier.sraComplianceStatement}
              </div>
            </div>

            {/* Right Quick Actions Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2DCCE] shadow-sm">
                <h2 className="font-serif font-bold text-lg mb-4 text-[#0B1F3A]">Quick Adviser Actions</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(threatAssessment.counterNoticeDraft || '', 'parity-notice')}
                    className="w-full min-h-[48px] text-left px-4 py-3 rounded-xl border border-[#E2DCCE] hover:border-[#D9603B] transition-colors text-sm font-semibold text-[#0B1F3A] flex items-center justify-between gap-2"
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
                    className="w-full min-h-[48px] text-left px-4 py-3 rounded-xl border border-[#E2DCCE] hover:border-[#D9603B] transition-colors text-sm font-semibold text-[#0B1F3A] flex items-center justify-between gap-2"
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
                    className="w-full min-h-[48px] text-left px-4 py-3 rounded-xl border border-[#E2DCCE] hover:border-[#0B1F3A] transition-colors text-sm font-semibold text-[#0B1F3A] flex items-center justify-between gap-2"
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

              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2DCCE] shadow-sm">
                <h2 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/70 mb-3">Clause Flags Detected</h2>
                <div className="space-y-3">
                  {contractAudit.redFlags.length === 0 ? (
                    <span className="text-sm text-[#0B1F3A]/75">Zero high-risk contractual clauses identified.</span>
                  ) : (
                    contractAudit.redFlags.map((rf, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
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
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E2DCCE] shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">Statutory Entitlement Breakdown (ERA 1996)</h2>
              <p className="text-sm sm:text-base text-[#0B1F3A]/80 mt-2 leading-relaxed max-w-prose">
                Evaluated deterministically against {statutoryAnalysis.governingLegislation}. Weekly statutory cap applied: <strong>£{statutoryAnalysis.weeklyCapUsed}/wk</strong>. Maximum service years capped at: <strong>{statutoryAnalysis.maxServiceYearsApplied} years</strong>.
              </p>
            </div>

            <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
              <table className="w-full min-w-[540px] text-sm sm:text-base border-collapse">
                <thead>
                  <tr className="border-b border-[#E2DCCE] text-left text-xs uppercase tracking-wider text-[#0B1F3A]/70">
                    <th className="py-3 pr-4">Statutory Component</th>
                    <th className="py-3 pr-4">Governing Statute</th>
                    <th className="py-3 text-right">Statutory Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DCCE]">
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
                    <td className="py-4 pr-4 text-[#0B1F3A]/75 text-sm">Subject to marginal income tax &amp; 15.0% Employer Class 1A NIC</td>
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
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E2DCCE] shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">Captive Steering &amp; Independence Check</h2>
                <p className="text-sm sm:text-base text-[#0B1F3A]/75 mt-1">
                  Section 203(3) ERA 1996 &amp; SRA Code of Conduct Rule 2.1 compliance check.
                </p>
              </div>
              <span className={`text-xs font-bold px-3.5 py-1.5 rounded-full border ${threatAssessment.hasCaptiveSteering ? 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]/30' : 'bg-[#F7F4EE] text-[#0B1F3A] border-[#E2DCCE]'}`}>
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
                    className="min-h-[44px] px-4 py-2 text-sm font-semibold bg-[#D9603B] text-white rounded-xl hover:bg-[#D9603B]/90 transition-colors"
                  >
                    {copiedKey === 'notice-tab' ? 'Copied to Clipboard' : 'Copy Notice Text'}
                  </button>
                </div>

                <pre className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] text-sm font-mono whitespace-pre-wrap text-[#0B1F3A] leading-relaxed overflow-x-auto">
                  {threatAssessment.counterNoticeDraft}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: S.203 Contract Risk Audit ─────────────────────────────── */}
        {activeTab === 'clauses' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E2DCCE] shadow-sm space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">Section 203 ERA 1996 Contract Schedule &amp; Risk Register</h2>
              <p className="text-sm sm:text-base text-[#0B1F3A]/80 mt-1.5 leading-relaxed">
                Automated audit of draft settlement clauses against statutory requirements and overreaching waivers.
              </p>
            </div>

            <div className="space-y-4">
              {contractAudit.redFlags.map((flag, idx) => (
                <div key={idx} className="p-4 sm:p-5 rounded-xl border border-[#E2DCCE] bg-[#F7F4EE]/60 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-bold uppercase tracking-wide text-[#0B1F3A]">
                      {idx + 1}. {flag.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded ${flag.severity === 'high' ? 'bg-[#D9603B]/10 text-[#D9603B]' : 'bg-[#B5802A]/10 text-[#8A5D16]'}`}>
                      {flag.severity.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-sm sm:text-base text-[#0B1F3A]/85 leading-relaxed">{flag.issueDescription}</p>
                  <div className="p-3.5 sm:p-4 bg-white rounded-lg border border-[#E2DCCE]">
                    <span className="font-bold block text-xs text-[#0B1F3A]/70 uppercase tracking-wider mb-1.5">Recommended Amendment Clause</span>
                    <span className="font-mono text-sm text-[#0B1F3A] leading-relaxed block">{flag.recommendedAmendment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 5: Verified Statutory Caps & Vento Exposure (2026/27) ────── */}
        {activeTab === 'caps' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E2DCCE] shadow-sm space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#D9603B]">
                Effective 6 April 2026 · Legislation.gov.uk &amp; Presidential Guidance
              </span>
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A] mt-1">
                Statutory Tribunal Exposure &amp; Tax Limits
              </h2>
              <p className="text-sm sm:text-base text-[#0B1F3A]/80 mt-1.5 leading-relaxed max-w-prose">
                Verifiable statutory ceilings for Without Prejudice correspondence. Zero unattributed market multipliers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">Weekly Pay Cap (GB / NI)</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A] tabular-nums block mt-1">
                  £{STATUTORY_RATES_2026_27.weeklyCapGB} / £{STATUTORY_RATES_2026_27.weeklyCapNI}
                </span>
                <span className="text-xs text-[#0B1F3A]/70 block mt-1">ERA 1996 s.227 (2026/27 Order)</span>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">Unfair Dismissal Cap (GB)</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A] tabular-nums block mt-1">
                  £{STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')}
                </span>
                <span className="text-xs text-[#0B1F3A]/70 block mt-1">Or 52 weeks&apos; gross pay (ERA 1996 s.124)</span>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">Tax Exemption &amp; Class 1A NIC</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A] tabular-nums block mt-1">
                  £{STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')} / 15.0%
                </span>
                <span className="text-xs text-[#0B1F3A]/70 block mt-1">ITEPA 2003 s.403 (0% employee NIC)</span>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">Vento Lower Band</span>
                <span className="text-xl font-serif font-bold text-[#0B1F3A] tabular-nums block mt-1">
                  £{VENTO_BANDS_2026_27.lowerMin.toLocaleString('en-GB')} - £{VENTO_BANDS_2026_27.lowerMax.toLocaleString('en-GB')}
                </span>
                <span className="text-xs text-[#0B1F3A]/70 block mt-1">Ninth Addendum (Equality Act 2010)</span>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">Vento Middle Band</span>
                <span className="text-xl font-serif font-bold text-[#0B1F3A] tabular-nums block mt-1">
                  £{VENTO_BANDS_2026_27.middleMin.toLocaleString('en-GB')} - £{VENTO_BANDS_2026_27.middleMax.toLocaleString('en-GB')}
                </span>
                <span className="text-xs text-[#0B1F3A]/70 block mt-1">Serious non-upper cases</span>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/65 block">Vento Upper Band</span>
                <span className="text-xl font-serif font-bold text-[#D9603B] tabular-nums block mt-1">
                  £{VENTO_BANDS_2026_27.upperMin.toLocaleString('en-GB')} - £{VENTO_BANDS_2026_27.upperMax.toLocaleString('en-GB')}+
                </span>
                <span className="text-xs text-[#0B1F3A]/70 block mt-1">Most serious / exceptional cases</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 6: PMS Integration & Export (SC-B-027) ──────────────────────── */}
        {activeTab === 'pms' && (
          <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#E2DCCE] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2DCCE] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#D9603B] font-semibold block mb-1">
                  1-Click Practice Management Export (SC-B-027)
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F3A]">
                  Clio &amp; LEAP Legal Software Intake Integration
                </h2>
              </div>
              <span className="text-xs font-mono bg-[#F7F4EE] border border-[#E2DCCE] text-[#0B1F3A] px-3 py-1.5 rounded self-start sm:self-center">
                REST / Webhook / CSV
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#0B1F3A]/80 leading-relaxed max-w-prose">
              Export verified settlement dossier payloads directly into Clio Grow/Manage, LEAP, or PracticeEvolve to eliminate manual intake re-typing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Clio Intake (JSON)
              </button>

              <button
                type="button"
                onClick={() => {
                  const headers = [
                    'Matter ID', 'Lead Source', 'Client Name', 'Client Email', 'Client Phone', 'Client Postcode',
                    'Tenure Years', 'Age', 'Gross Salary', 'Employer Offer', 'Statutory Minimum Floor',
                    'Tax-Free s403 Portion', 'Employer Legal Fee Offered', 'SRA s203 Review Required'
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
                    statutoryAnalysis.taxFreeTerminationPortion,
                    matterSummary.keyFigures.employerLegalFeeOffered,
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export LEAP Intake (CSV)
              </button>

              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(crmPayload.clioMatterPayload, null, 2), 'pms-tab')}
                className="min-h-[48px] px-4 py-3 bg-white border border-[#E2DCCE] hover:border-[#0B1F3A] text-[#0B1F3A] rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {copiedKey === 'pms-tab' ? (
                  <>Copied JSON Payload</>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy REST Payload
                  </>
                )}
              </button>
            </div>

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
