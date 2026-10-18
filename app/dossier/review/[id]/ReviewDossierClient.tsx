'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SolicitorPreFlightDossier } from '@/lib/agentic-engine/types';

interface ReviewDossierClientProps {
  dossierId: string;
}

export default function ReviewDossierClient({ dossierId }: ReviewDossierClientProps) {
  const [dossier, setDossier] = useState<SolicitorPreFlightDossier | null>(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(15 * 60);
  const [activeTab, setActiveTab] = useState<'overview' | 'statutory' | 'threat' | 'clauses' | 'telemetry' | 'pms'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [claimToken, setClaimToken] = useState<string | null>(null);

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
          if (data.claimStatus) {
            setIsClaimed(Boolean(data.claimStatus.isClaimed));
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
    if (isClaimed || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isClaimed, secondsRemaining]);

  // 3. Handle Matter Claim
  const handleClaim = async () => {
    if (isClaimed) return;
    setClaiming(true);
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
      } else {
        alert(data.message || 'Failed to claim instruction.');
      }
    } catch {
      alert('Network error while claiming instruction.');
    } finally {
      setClaiming(false);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center p-6 text-[#0B1F3A]">
        <div className="w-12 h-12 border-4 border-[#0B1F3A]/20 border-t-[#D9603B] rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold font-serif">Compiling Pre-Flight Legal Dossier...</h2>
        <p className="text-sm text-[#0B1F3A]/70 mt-1">Evaluating ERA 1996 statutory invariants and Section 203 compliance.</p>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col items-center justify-center p-6 text-[#0B1F3A]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-[#0B1F3A]/10 max-w-md text-center">
          <h2 className="text-xl font-bold font-serif mb-2">Dossier Unavailable</h2>
          <p className="text-sm text-[#0B1F3A]/70 mb-6">This matter may have expired or the claim token provided is invalid.</p>
          <Link href="/portal/" className="inline-block px-5 py-2.5 bg-[#0B1F3A] text-white rounded-lg font-medium text-sm hover:bg-[#0B1F3A]/90 transition-colors">
            Return to Solicitor Portal →
          </Link>
        </div>
      </div>
    );
  }

  const { matterSummary, statutoryAnalysis, threatAssessment, contractAudit, marketNegotiationBrief, crmPayload } = dossier;

  const verdictStyles: Record<string, { bg: string; text: string; label: string }> = {
    CRITICAL_STATUTORY_DEFICIT: { bg: 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]/30', text: 'text-[#D9603B]', label: 'Critical Statutory Deficit' },
    BELOW_MARKET_BENCHMARK: { bg: 'bg-[#B5802A]/10 text-[#B5802A] border-[#B5802A]/30', text: 'text-[#B5802A]', label: 'Below Market Benchmark' },
    FAIR_MARKET_RANGE: { bg: 'bg-[#0B1F3A]/10 text-[#0B1F3A] border-[#0B1F3A]/30', text: 'text-[#0B1F3A]', label: 'Fair Market Range' },
    ABOVE_MARKET_STANDARD: { bg: 'bg-[#0B1F3A]/10 text-[#0B1F3A] border-[#0B1F3A]/30', text: 'text-[#0B1F3A]', label: 'Above Market Standard' },
  };

  const activeVerdict = verdictStyles[matterSummary.strategicVerdict] || verdictStyles.BELOW_MARKET_BENCHMARK;

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] pb-24">
      {/* ── Top SLA Watchdog Sentinel Bar ──────────────────────────────────── */}
      <div className={`sticky top-0 z-50 transition-colors border-b shadow-sm ${isClaimed ? 'bg-[#0B1F3A] border-[#0B1F3A] text-white' : 'bg-[#0B1F3A] border-[#0B1F3A] text-white'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D9603B] animate-pulse" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold text-white">SRA Territorial Instruction:</span>{' '}
              <span className="text-[#F7F4EE]/80">
                {isClaimed
                  ? 'Instruction Claimed & Matter Locked to Your Firm'
                  : `15-Min Exclusivity Window: ${timerFormatted} remaining`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/portal/"
              className="text-xs text-white/80 hover:text-white underline underline-offset-4 mr-2 hidden sm:inline-block"
            >
              ← Portal Command Center
            </Link>
            <button
              onClick={handleClaim}
              disabled={isClaimed || claiming}
              className={`px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                isClaimed
                  ? 'bg-white/10 text-white cursor-default border border-white/20'
                  : 'bg-[#D9603B] text-white hover:bg-[#D9603B]/90 shadow-sm active:scale-95'
              }`}
            >
              {isClaimed ? '✓ Matter Claimed & Instruction Locked' : claiming ? 'Securing Matter...' : '⚡ One-Click Claim Instruction'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8">
        {/* ── Matter Header Card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[#0B1F3A]/10 mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6 pb-6 border-b border-[#0B1F3A]/10">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[#0B1F3A]/5 text-[#0B1F3A]/70 font-semibold">
                  DOSSIER #{dossier.dossierId.slice(-8).toUpperCase()}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${activeVerdict.bg}`}>
                  {activeVerdict.label}
                </span>
                {threatAssessment.hasCaptiveSteering && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#D9603B]/10 text-[#D9603B] border border-[#D9603B]/30 flex items-center gap-1">
                    ⚠️ Captive Steering Flagged
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-[#0B1F3A]">
                {matterSummary.clientName}
              </h1>
              <p className="text-xs sm:text-sm text-[#0B1F3A]/60 mt-1">
                Postcode: <strong className="text-[#0B1F3A]">{matterSummary.clientContact.postcode}</strong> · Tel:{' '}
                <a href={`tel:${matterSummary.clientContact.phone}`} className="text-[#D9603B] hover:underline font-medium">
                  {matterSummary.clientContact.phone}
                </a>{' '}
                · Email:{' '}
                <a href={`mailto:${matterSummary.clientContact.email}`} className="text-[#D9603B] hover:underline font-medium">
                  {matterSummary.clientContact.email}
                </a>
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs text-[#0B1F3A]/50 block">Territory SLA Watchdog</span>
              <span className="text-xs font-semibold text-[#0B1F3A] block">
                {dossier.territorialRouting?.matchedFirmName || 'SRA Designated Partner'}
              </span>
              <span className="text-[11px] text-[#0B1F3A]/60 block mt-0.5">
                {dossier.territorialRouting?.adminDistrict || 'United Kingdom'} {dossier.territorialRouting?.distanceMiles ? `(${dossier.territorialRouting.distanceMiles} mi)` : ''}
              </span>
            </div>
          </div>

          {/* ── Key Figures 4-Pillar Grid ─────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/5">
              <span className="text-xs text-[#0B1F3A]/60 block mb-1">Gross Annual Salary</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A]">
                £{matterSummary.keyFigures.salary.toLocaleString('en-GB')}
              </span>
              <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">
                {matterSummary.keyFigures.tenureYears} yrs service ({matterSummary.keyFigures.age} yrs old)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/5">
              <span className="text-xs text-[#0B1F3A]/60 block mb-1">Current Employer Offer</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#D9603B]">
                £{matterSummary.keyFigures.employerOffer.toLocaleString('en-GB')}
              </span>
              <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">
                Employer Legal Fee: £{matterSummary.keyFigures.employerLegalFeeOffered} + VAT
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/5">
              <span className="text-xs text-[#0B1F3A]/60 block mb-1">ERA 1996 Statutory Floor</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-[#0B1F3A]">
                £{matterSummary.keyFigures.statutoryMinimum.toLocaleString('en-GB')}
              </span>
              <span className={`text-[11px] font-semibold block mt-1 ${statutoryAnalysis.isOfferBelowStatutoryMinimum ? 'text-[#D9603B]' : 'text-[#0B1F3A]/70'}`}>
                {statutoryAnalysis.isOfferBelowStatutoryMinimum ? `Deficit: -£${statutoryAnalysis.statutoryShortfallDelta.toLocaleString('en-GB')}` : 'Offer clears statutory floor'}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#0B1F3A] text-white">
              <span className="text-xs text-[#F7F4EE]/70 block mb-1">Market Counter Target</span>
              <span className="text-xl sm:text-2xl font-serif font-bold text-white">
                £{matterSummary.keyFigures.targetSettlement.toLocaleString('en-GB')}
              </span>
              <span className="text-[11px] text-[#D9603B] font-semibold block mt-1">
                Legal Fee Demand: £{matterSummary.keyFigures.recommendedLegalFeeDemand} + VAT
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation Tabs ──────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-[#0B1F3A]/10 text-xs sm:text-sm font-medium">
          {[
            { id: 'overview', label: '1. Executive Brief' },
            { id: 'statutory', label: '2. Statutory Floor (ERA 1996)' },
            { id: 'threat', label: '3. Captive Threat Sentinel' },
            { id: 'clauses', label: '4. S.203 Contract Audit' },
            { id: 'telemetry', label: '5. Market Telemetry' },
            { id: 'pms', label: '6. PMS Integration & Export' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#0B1F3A] text-white font-semibold'
                  : 'bg-white text-[#0B1F3A]/70 hover:text-[#0B1F3A] border border-[#0B1F3A]/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab 1: Executive Brief ───────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[#0B1F3A]/10 shadow-sm">
                <h3 className="font-serif font-bold text-lg mb-3">Matter Strategy & Case Overview</h3>
                <p className="text-sm text-[#0B1F3A]/80 leading-relaxed mb-4">
                  The client has received a formal settlement agreement offer of £{matterSummary.keyFigures.employerOffer.toLocaleString('en-GB')}. Based on continuous employment tenure of {matterSummary.keyFigures.tenureYears} years and gross annual remuneration of £{matterSummary.keyFigures.salary.toLocaleString('en-GB')}, the statutory minimum floor is calculated at £{matterSummary.keyFigures.statutoryMinimum.toLocaleString('en-GB')} under ERA 1996 ss.86 & 162.
                </p>

                {statutoryAnalysis.isOfferBelowStatutoryMinimum ? (
                  <div className="p-4 rounded-lg bg-[#D9603B]/10 border border-[#D9603B]/30 mb-4">
                    <h4 className="text-xs font-bold text-[#D9603B] uppercase tracking-wider mb-1">Critical Negotiation Flaw</h4>
                    <p className="text-xs text-[#0B1F3A]">
                      The employer offer sits £{statutoryAnalysis.statutoryShortfallDelta.toLocaleString('en-GB')} below the statutory redundancy and notice floor. The employee would be financially better off rejecting the settlement compromise and claiming statutory redundancy directly.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-lg bg-[#0B1F3A]/5 border border-[#0B1F3A]/15 mb-4">
                    <h4 className="text-xs font-bold text-[#0B1F3A] uppercase tracking-wider mb-1">Commercial Negotiation Opportunity</h4>
                    <p className="text-xs text-[#0B1F3A]/80">
                      While the offer satisfies the statutory floor, empirical telemetry indicates that comparable matters in this category typically settle for between £{marketNegotiationBrief.typicalSettlementRange.low.toLocaleString('en-GB')} and £{marketNegotiationBrief.typicalSettlementRange.high.toLocaleString('en-GB')}.
                    </p>
                  </div>
                )}

                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/60 mb-2">Key Tactical Action Items:</h4>
                <ul className="space-y-2 text-xs text-[#0B1F3A]/80">
                  {marketNegotiationBrief.tacticalNegotiationPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[#D9603B] font-bold">›</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SRA Compliance & Disclaimer */}
              <div className="bg-[#0B1F3A]/5 rounded-xl p-5 border border-[#0B1F3A]/10 text-xs text-[#0B1F3A]/70 leading-relaxed">
                <strong className="text-[#0B1F3A] block mb-1">SRA Independence Statement:</strong>
                {dossier.sraComplianceStatement}
              </div>
            </div>

            {/* Right Quick Actions Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-[#0B1F3A]/10 shadow-sm">
                <h3 className="font-serif font-bold text-base mb-4">Quick Adviser Actions</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => copyToClipboard(threatAssessment.counterNoticeDraft || '', 'parity-notice')}
                    className="w-full text-left p-3 rounded-lg border border-[#0B1F3A]/10 hover:border-[#D9603B] transition-colors text-xs font-semibold text-[#0B1F3A] flex items-center justify-between"
                  >
                    <span>📋 Copy Fee Parity Counter-Notice</span>
                    <span className="text-[10px] text-[#D9603B]">{copiedKey === 'parity-notice' ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(JSON.stringify(crmPayload.clioMatterPayload, null, 2), 'clio-json')}
                    className="w-full text-left p-3 rounded-lg border border-[#0B1F3A]/10 hover:border-[#D9603B] transition-colors text-xs font-semibold text-[#0B1F3A] flex items-center justify-between"
                  >
                    <span>📁 Export Clio / LEAP Intake JSON</span>
                    <span className="text-[10px] text-[#D9603B]">{copiedKey === 'clio-json' ? 'Copied!' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => window.print()}
                    className="w-full text-left p-3 rounded-lg border border-[#0B1F3A]/10 hover:border-[#0B1F3A] transition-colors text-xs font-semibold text-[#0B1F3A] flex items-center justify-between"
                  >
                    <span>🖨️ Print Pre-Flight Dossier PDF</span>
                    <span className="text-[10px] text-[#0B1F3A]/60">Print</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#0B1F3A]/10 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/60 mb-3">Red Flags Detected</h4>
                <div className="space-y-2">
                  {contractAudit.redFlags.length === 0 ? (
                    <span className="text-xs text-[#0B1F3A]/60">Zero high-risk contractual clauses identified.</span>
                  ) : (
                    contractAudit.redFlags.map((rf, idx) => (
                      <div key={idx} className="text-xs p-2 rounded bg-[#F7F4EE] border border-[#0B1F3A]/5">
                        <span className={`font-semibold block ${rf.severity === 'high' ? 'text-[#D9603B]' : 'text-[#B5802A]'}`}>
                          {rf.category.replace(/_/g, ' ').toUpperCase()} ({rf.severity})
                        </span>
                        <span className="text-[#0B1F3A]/70 text-[11px] block mt-0.5">{rf.issueDescription}</span>
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
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl">Statutory Entitlement Breakdown (ERA 1996)</h3>
            <p className="text-xs sm:text-sm text-[#0B1F3A]/70">
              Evaluated deterministically against {statutoryAnalysis.governingLegislation}. Weekly statutory cap applied: <strong>£{statutoryAnalysis.weeklyCapUsed}/wk</strong>. Maximum service years capped at: <strong>{statutoryAnalysis.maxServiceYearsApplied} years</strong>.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-[#0B1F3A]/10 text-left text-[#0B1F3A]/60">
                    <th className="py-2.5">Statutory Invariant Component</th>
                    <th className="py-2.5">Governing Statute</th>
                    <th className="py-2.5 text-right">Statutory Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#0B1F3A]/5">
                  <tr>
                    <td className="py-3 font-medium">Statutory Redundancy Pay (SRP)</td>
                    <td className="py-3 text-[#0B1F3A]/60 text-xs">ERA 1996 s.162 (Age-weighted multiplier)</td>
                    <td className="py-3 text-right font-semibold">£{statutoryAnalysis.statutoryRedundancyPay.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Statutory Notice Pay (PILON)</td>
                    <td className="py-3 text-[#0B1F3A]/60 text-xs">ERA 1996 s.86 (1 wk/yr, uncapped weekly pay)</td>
                    <td className="py-3 text-right font-semibold">£{statutoryAnalysis.noticePayPilon.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr className="bg-[#F7F4EE]/60 font-bold">
                    <td className="py-3 text-[#0B1F3A]">Total Non-Negotiable Statutory Floor</td>
                    <td className="py-3 text-[#0B1F3A]/60 text-xs">ERA 1996 Minimum Threshold</td>
                    <td className="py-3 text-right text-base text-[#0B1F3A]">£{statutoryAnalysis.statutoryMinimumTotal.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Tax-Free Termination Exemption</td>
                    <td className="py-3 text-[#0B1F3A]/60 text-xs">ITEPA 2003 s.403 (£30,000 threshold)</td>
                    <td className="py-3 text-right font-semibold text-[#0B1F3A]">£{statutoryAnalysis.taxFreeTerminationPortion.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Taxable Termination Portion</td>
                    <td className="py-3 text-[#0B1F3A]/60 text-xs">Subject to marginal income tax & employer Class 1A NIC</td>
                    <td className="py-3 text-right font-semibold">£{statutoryAnalysis.taxableTerminationPortion.toLocaleString('en-GB')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">Estimated Net Client Take-Home</td>
                    <td className="py-3 text-[#0B1F3A]/60 text-xs">After deduction of PAYE income tax on notice & excess</td>
                    <td className="py-3 text-right font-bold text-[#D9603B]">£{statutoryAnalysis.estimatedNetTakeHome.toLocaleString('en-GB')}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Tab 3: Captive Threat Sentinel ────────────────────────────────── */}
        {activeTab === 'threat' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif font-bold text-xl">Captive Steering & Independence Sentinel</h3>
                <p className="text-xs text-[#0B1F3A]/60 mt-1">Section 203(3) ERA 1996 & SRA Code of Conduct Rule 2.1 compliance check.</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${threatAssessment.hasCaptiveSteering ? 'bg-[#D9603B]/10 text-[#D9603B] border-[#D9603B]/30' : 'bg-[#0B1F3A]/5 text-[#0B1F3A] border-[#0B1F3A]/20'}`}>
                {threatAssessment.hasCaptiveSteering ? 'CAPTIVE STEERING DETECTED' : 'CLEAR: INDEPENDENT SELECTION PERMITTED'}
              </span>
            </div>

            {threatAssessment.hasCaptiveSteering && (
              <div className="p-4 rounded-xl bg-[#D9603B]/10 border border-[#D9603B]/20 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#D9603B] block">Steering Audit Excerpt</span>
                <p className="text-xs text-[#0B1F3A] font-medium">{threatAssessment.captiveClauseExcerpt}</p>
                {threatAssessment.feePenaltyAmount ? (
                  <p className="text-xs text-[#D9603B] font-semibold">
                    Employer imposes a £{threatAssessment.feePenaltyAmount} penalty on independent legal advice.
                  </p>
                ) : null}
              </div>
            )}

            {threatAssessment.counterNoticeDraft && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]/70">
                    SRA Legal Fee Parity Counter-Notice (Ready for Signature)
                  </h4>
                  <button
                    onClick={() => copyToClipboard(threatAssessment.counterNoticeDraft || '', 'notice-tab')}
                    className="px-3 py-1 text-xs font-semibold bg-[#D9603B] text-white rounded hover:bg-[#D9603B]/90 transition-colors"
                  >
                    {copiedKey === 'notice-tab' ? '✓ Copied to Clipboard' : 'Copy Notice Text'}
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10 text-xs font-mono whitespace-pre-wrap text-[#0B1F3A] leading-relaxed">
                  {threatAssessment.counterNoticeDraft}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 4: S.203 Contract Risk Audit ─────────────────────────────── */}
        {activeTab === 'clauses' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl">Section 203 ERA 1996 Contract Schedule & Risk Register</h3>
            <p className="text-xs sm:text-sm text-[#0B1F3A]/70">
              Automated audit of draft settlement clauses against statutory requirements and overreaching waivers.
            </p>

            <div className="space-y-4">
              {contractAudit.redFlags.map((flag, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-[#0B1F3A]/10 bg-[#F7F4EE]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                      {idx + 1}. {flag.category.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${flag.severity === 'high' ? 'bg-[#D9603B]/10 text-[#D9603B]' : 'bg-[#B5802A]/10 text-[#B5802A]'}`}>
                      {flag.severity.toUpperCase()} RISK
                    </span>
                  </div>
                  <p className="text-xs text-[#0B1F3A]/80">{flag.issueDescription}</p>
                  <div className="p-3 bg-white rounded-lg border border-[#0B1F3A]/10 text-xs text-[#0B1F3A]">
                    <span className="font-bold block text-[11px] text-[#0B1F3A]/60 uppercase mb-1">Recommended Amendment Clause:</span>
                    <span className="font-mono text-[11px] text-[#0B1F3A]">{flag.recommendedAmendment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Tab 5: Market Telemetry ──────────────────────────────────────── */}
        {activeTab === 'telemetry' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl">SettlementCheck Telemetry Intelligence</h3>
            <p className="text-xs sm:text-sm text-[#0B1F3A]/70">
              Aggregated settlement multiplier benchmarks based on {marketNegotiationBrief.sampleSize} UK matters in this category.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">Median Settlement Multiplier</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  {marketNegotiationBrief.medianSettlementMultiplier}x
                </span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">Monthly gross salary equivalent</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">Upper Quartile Multiplier</span>
                <span className="text-2xl font-serif font-bold text-[#D9603B]">
                  {marketNegotiationBrief.upperQuartileMultiplier}x
                </span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">75th percentile negotiated exit</span>
              </div>

              <div className="p-4 rounded-xl bg-[#F7F4EE] border border-[#0B1F3A]/10">
                <span className="text-xs text-[#0B1F3A]/60 block mb-1">Typical Negotiated Settlement</span>
                <span className="text-2xl font-serif font-bold text-[#0B1F3A]">
                  £{marketNegotiationBrief.typicalSettlementRange.low.toLocaleString('en-GB')} – £{marketNegotiationBrief.typicalSettlementRange.high.toLocaleString('en-GB')}
                </span>
                <span className="text-[11px] text-[#0B1F3A]/50 block mt-1">
                  {marketNegotiationBrief.typicalSettlementRange.uncapped ? 'Uncapped statutory compensation' : 'Standard compensatory bounds'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab 6: PMS Integration & Export ──────────────────────────────── */}
        {activeTab === 'pms' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#0B1F3A]/10 shadow-sm space-y-6">
            <h3 className="font-serif font-bold text-xl">Practice Management System (PMS) Bi-Directional Sync</h3>
            <p className="text-xs sm:text-sm text-[#0B1F3A]/70">
              Zero-data-entry integration schema ready for Clio Grow/Manage, LEAP, and PracticeEvolve intake webhooks.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-[#0B1F3A]/70">clio_matter_intake_payload.json</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(crmPayload.clioMatterPayload, null, 2), 'pms-tab')}
                  className="px-3 py-1 text-xs font-semibold bg-[#0B1F3A] text-white rounded hover:bg-[#0B1F3A]/90 transition-colors"
                >
                  {copiedKey === 'pms-tab' ? '✓ Copied' : 'Copy JSON Payload'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-[#0B1F3A] text-[#F7F4EE] text-xs font-mono overflow-x-auto leading-relaxed max-h-96">
                {JSON.stringify(crmPayload.clioMatterPayload, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
