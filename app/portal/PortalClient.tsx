'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { trackClientEvent } from '@/lib/telemetry';
import { calcNotice, getVerdict } from '@/lib/calculations';
import { STATUTORY_RATES_2026_27, VENTO_BANDS_2026_27 } from '@/lib/statutory-rates';
import {
  SANDBOX_DOSSIERS,
  getSandboxMatterOverrides,
  setSandboxMatterOverride,
  MatterStage,
} from '@/lib/portal-sandbox';

interface PortalMatter {
  id: string;
  clientName: string;
  phone: string;
  postcode: string;
  cityArea: string;
  employerName?: string;
  employerNameSource?: 'draft_extracted' | 'employee_provided';
  signingDeadlineLabel: string;
  isUrgentDeadline: boolean;
  hasDraftAgreement: boolean;
  clientGoal: 'Negotiate Higher' | 'Fast s.203 Sign-Off';
  disputeReasonLabel: string;
  salary: number;
  yearsOfService: number;
  age: number;
  employerOffer: number;
  statutoryFloor: number;
  taxFreeAmount: number;
  taxableExcess: number;
  employerLegalFee: number;
  captiveSteering: boolean;
  status: 'locked' | 'claimed' | 'released' | 'completed';
  releaseReason?: string;
  stage?: MatterStage;
  timeRemainingSec?: number;
  receivedAt: string;
}

/**
 * Deterministically computes Portal matter financials directly from lib/calculations.ts
 * (exact same statutory engine as /calculator/, /results/, and /dossier/review/[id]/).
 * Zero hardcoded statutory floors or fabricated counter-targets.
 */
function buildInitialMatters(): PortalMatter[] {
  const configs: Array<{
    id: keyof typeof SANDBOX_DOSSIERS;
    cityArea: string;
    disputeReasonLabel: string;
    isUrgentDeadline: boolean;
    captiveSteering: boolean;
    initialStatus: 'locked' | 'claimed' | 'completed';
    stage?: MatterStage;
    timeRemainingSec?: number;
    receivedAt: string;
  }> = [
    {
      id: 'dossier_live_bristol_01',
      cityArea: 'Clifton, Bristol',
      disputeReasonLabel: 'Redundancy (Nominated Firm Steering)',
      isUrgentDeadline: true,
      captiveSteering: true,
      initialStatus: 'locked',
      timeRemainingSec: 742,
      receivedAt: '8 mins ago',
    },
    {
      id: 'dossier_live_london_02',
      cityArea: 'Harbourside, Bristol',
      disputeReasonLabel: 'Unfair Dismissal / PIP Exit',
      isUrgentDeadline: true,
      captiveSteering: false,
      initialStatus: 'claimed',
      stage: 'conflict_cleared',
      receivedAt: '2 hours ago',
    },
    {
      id: 'dossier_live_clifton_03',
      cityArea: 'Redland, Bristol',
      disputeReasonLabel: 'Senior Redundancy Compromise',
      isUrgentDeadline: false,
      captiveSteering: false,
      initialStatus: 'completed',
      stage: 'signed_billed',
      receivedAt: 'Yesterday',
    },
  ];

  return configs.map(cfg => {
    const fixture = SANDBOX_DOSSIERS[cfg.id];
    const ctx = fixture.matterContext;
    const months = Math.floor(ctx.yearsOfService * 12);
    const reason = ctx.disputeReason || 'redundancy';
    const notice = calcNotice(ctx.salary, months, ctx.noticeWeeks ?? 0);
    const verdict = getVerdict(
      ctx.salary,
      months,
      ctx.age,
      ctx.employerOffer,
      reason,
      ctx.isDiscrimination ? 'yes' : 'no',
      notice.weeksUsed,
      'GB'
    );

    const isRedundancy = reason === 'redundancy' || reason === 'redundancy_collective';
    const srp = isRedundancy && ctx.yearsOfService >= 2 ? verdict.redundancy : 0;
    const statutoryFloor = srp + (verdict.basicAward || 0) + verdict.pilon;

    return {
      id: fixture.dossierId,
      clientName: `${ctx.firstName || ''} ${ctx.lastName || ''}`.trim(),
      phone: ctx.phone || '',
      postcode: ctx.postcode || '',
      cityArea: cfg.cityArea,
      employerName: fixture.employerName,
      employerNameSource: fixture.employerNameSource,
      signingDeadlineLabel: fixture.signingDeadlineLabel,
      isUrgentDeadline: cfg.isUrgentDeadline,
      hasDraftAgreement: fixture.hasDraftAgreement,
      clientGoal: fixture.clientGoal,
      disputeReasonLabel: cfg.disputeReasonLabel,
      salary: ctx.salary,
      yearsOfService: ctx.yearsOfService,
      age: ctx.age,
      employerOffer: ctx.employerOffer,
      statutoryFloor,
      taxFreeAmount: verdict.taxFreeAmount,
      taxableExcess: verdict.taxableTermination,
      employerLegalFee: ctx.employerOfferedLegalFee || 500,
      captiveSteering: cfg.captiveSteering,
      status: cfg.initialStatus,
      stage: cfg.stage,
      timeRemainingSec: cfg.timeRemainingSec,
      receivedAt: cfg.receivedAt,
    };
  });
}

const INITIAL_MATTERS: PortalMatter[] = buildInitialMatters();

const STAGE_OPTIONS: Array<{ id: MatterStage; label: string }> = [
  { id: 'conflict_cleared', label: '1. Conflict Cleared' },
  { id: 'client_called', label: '2. Client Spoken To' },
  { id: 'advice_issued', label: '3. Advice Issued' },
  { id: 'signed_billed', label: '4. Signed & Billed' },
];

const RELEASE_REASONS: Array<{ label: string; detail: string }> = [
  { label: 'SRA Conflict of Interest', detail: 'Counterparty is an existing or former firm client (0% SLA impact)' },
  { label: 'At Capacity Today', detail: 'Unable to meet the client signing deadline right now' },
  { label: 'Outside Specialism', detail: 'Matter requires a different employment sub-specialism' },
];

const STATUTORY_WP_CARDS = [
  {
    id: 'era_caps',
    title: 'ERA 1996 Statutory Caps (2026/27)',
    citation: 'Employment Rights Act 1996 ss.86, 162, 124',
    metrics: [
      { label: 'Weekly Pay Cap (GB)', value: `£${STATUTORY_RATES_2026_27.weeklyCapGB}/wk` },
      { label: 'Weekly Pay Cap (NI)', value: `£${STATUTORY_RATES_2026_27.weeklyCapNI}/wk` },
      { label: 'Max Basic Award / SRP', value: `£${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}` },
      { label: 'Compensatory Cap (GB)', value: `£${STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')}` },
    ],
    wpClause: `For the avoidance of doubt, under the Employment Rights (Increase of Limits) Order effective 6 April 2026, the statutory weekly pay cap is £${STATUTORY_RATES_2026_27.weeklyCapGB} (GB), the maximum basic award / statutory redundancy payment is £${STATUTORY_RATES_2026_27.maxBasicAwardGB.toLocaleString('en-GB')}, and the unfair dismissal compensatory award cap is £${STATUTORY_RATES_2026_27.compensatoryAwardLimitGB.toLocaleString('en-GB')}. Any settlement offer must reflect these statutory baselines alongside accrued contractual notice under ERA 1996 s.86.`,
  },
  {
    id: 'vento_bands',
    title: 'Equality Act 2010 Vento Bands (2026/27)',
    citation: 'Presidential Guidance (Ninth Addendum, 6 April 2026)',
    metrics: [
      { label: 'Lower Band', value: `£${VENTO_BANDS_2026_27.lowerMin.toLocaleString('en-GB')} - £${VENTO_BANDS_2026_27.lowerMax.toLocaleString('en-GB')}` },
      { label: 'Middle Band', value: `£${VENTO_BANDS_2026_27.middleMin.toLocaleString('en-GB')} - £${VENTO_BANDS_2026_27.middleMax.toLocaleString('en-GB')}` },
      { label: 'Upper Band', value: `£${VENTO_BANDS_2026_27.upperMin.toLocaleString('en-GB')} - £${VENTO_BANDS_2026_27.upperMax.toLocaleString('en-GB')}` },
      { label: 'Exceptional Cases', value: `£${VENTO_BANDS_2026_27.exceptionalMin.toLocaleString('en-GB')}+` },
    ],
    wpClause: `Should this matter proceed to the Employment Tribunal under the Equality Act 2010, compensation is uncapped and injury to feelings is assessed under the Presidential Guidance Ninth Addendum (applicable from 6 April 2026): Lower Band £${VENTO_BANDS_2026_27.lowerMin.toLocaleString('en-GB')} to £${VENTO_BANDS_2026_27.lowerMax.toLocaleString('en-GB')}, Middle Band £${VENTO_BANDS_2026_27.middleMin.toLocaleString('en-GB')} to £${VENTO_BANDS_2026_27.middleMax.toLocaleString('en-GB')}, and Upper Band £${VENTO_BANDS_2026_27.upperMin.toLocaleString('en-GB')} to £${VENTO_BANDS_2026_27.upperMax.toLocaleString('en-GB')}.`,
  },
  {
    id: 'itepa_tax',
    title: 'Termination Tax & Employer NIC (ITEPA 2003)',
    citation: 'ITEPA 2003 ss.402D (PENP) & 403',
    metrics: [
      { label: 'Tax-Free Exemption', value: `£${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')}` },
      { label: 'Employer Class 1A NIC', value: `${(STATUTORY_RATES_2026_27.employerClass1ANICRate * 100).toFixed(1)}% (>£30k)` },
      { label: 'Employee NIC (>£30k)', value: '0% (Exempt)' },
      { label: 'PILON / PENP Tax', value: '100% Taxable' },
    ],
    wpClause: `Under ITEPA 2003 s.403, genuinely ex-gratia termination compensation up to £${STATUTORY_RATES_2026_27.taxFreeLimit.toLocaleString('en-GB')} may be paid free of income tax and NIC, whereas Post-Employment Notice Pay (PENP) under s.402D must be separated and taxed as earnings. Termination payments above £30,000 attract Employer Class 1A NIC at ${(STATUTORY_RATES_2026_27.employerClass1ANICRate * 100).toFixed(1)}%, making employer pension contributions an efficient structuring option where agreed.`,
  },
  {
    id: 's203_fee_parity',
    title: 'Section 203(3) Advice & ACAS 10-Day Rule',
    citation: 'ERA 1996 s.203(3) & ACAS Code of Practice (Para 12)',
    metrics: [
      { label: 'Statutory Requirement', value: 'Independent Adviser' },
      { label: 'ACAS Guideline Window', value: '10 Calendar Days' },
      { label: 'ACAS Uplift Exposure', value: 'Up to 25% (TULRCA)' },
      { label: 'SRA Rule', value: 'Rule 2.1 Independence' },
    ],
    wpClause: `To satisfy Section 203(3) of the Employment Rights Act 1996, our client must receive advice from a relevant independent adviser of their own choosing. We also note paragraph 12 of the ACAS Code of Practice on Settlement Agreements, which recommends a minimum of 10 calendar days to consider formal written terms. Please confirm parity of the employer legal fee contribution and confirm a reasonable extension for review.`,
  },
];

type PortalTab = 'pipeline' | 'territory' | 'telemetry' | 'settings';
type StatusFilter = 'all' | 'locked' | 'claimed' | 'completed';

// Unified button classes across the entire Portal (consistent height, radius, font weight)
const BTN_PRIMARY_CORAL =
  'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#D9603B] hover:bg-[#C24D29] text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer';
const BTN_PRIMARY_NAVY =
  'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-[#0B1F3A] hover:bg-[#0B1F3A]/90 text-white text-sm font-semibold shadow-sm transition-colors cursor-pointer';
const BTN_SECONDARY =
  'inline-flex items-center justify-center gap-2 h-11 px-4 rounded-lg bg-white hover:bg-[#F7F4EE] border border-[#0B1F3A]/20 text-[#0B1F3A] text-sm font-semibold shadow-sm transition-colors cursor-pointer';
const BTN_GHOST_RELEASE =
  'inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-lg bg-transparent hover:bg-[#D9603B]/10 text-[#0B1F3A]/75 hover:text-[#D9603B] text-sm font-medium transition-colors cursor-pointer';

export default function PortalClient() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'totp'>('credentials');
  const [workEmail, setWorkEmail] = useState('partner@bristolemploymentlaw.co.uk');
  const [password, setPassword] = useState('••••••••••••');
  const [totpCode, setTotpCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<PortalTab>('pipeline');
  const [matters, setMatters] = useState<PortalMatter[]>(INITIAL_MATTERS);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);

  const [webhookUrl, setWebhookUrl] = useState('https://app.clio.com/api/v4/webhooks/sc_intake');
  const [isSaved, setIsSaved] = useState(false);
  const [slaAlertsEnabled, setSlaAlertsEnabled] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('demo') === 'true') {
        setIsDemoMode(true);
        setIsAuthenticated(true);
      } else {
        const auth = sessionStorage.getItem('sc_partner_mfa_auth');
        if (auth === 'true') {
          setIsAuthenticated(true);
        }
      }

      const overrides = getSandboxMatterOverrides();
      if (Object.keys(overrides).length > 0) {
        setMatters(prev =>
          prev.map(m => {
            const ov = overrides[m.id];
            if (!ov) return m;
            return {
              ...m,
              status: ov.status ?? m.status,
              releaseReason: ov.releaseReason ?? m.releaseReason,
              stage: ov.stage ?? m.stage,
              timeRemainingSec: ov.status && ov.status !== 'locked' ? undefined : m.timeRemainingSec,
            };
          })
        );
      }
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      setMatters(prev =>
        prev.map(m =>
          m.status === 'locked' && typeof m.timeRemainingSec === 'number' && m.timeRemainingSec > 0
            ? { ...m, timeRemainingSec: m.timeRemainingSec - 1 }
            : m
        )
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

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
        setAuthError(
          'Live partner accounts sign in via direct encrypted dossier links sent to your firm email. To preview the full workspace now, use the Interactive Partner Sandbox below.'
        );
      } else {
        setAuthError(
          'Invalid 6-digit authenticator code. Enter the code from your authenticator app or use dev demo code: 568912.'
        );
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

  const handleQuickClaim = async (matterId: string) => {
    setClaimingId(matterId);
    try {
      const res = await fetch('/api/portal/claim/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierId: matterId,
          claimToken: 'demo_partner_token',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSandboxMatterOverride(matterId, { status: 'claimed', stage: 'conflict_cleared' });
        setMatters(prev =>
          prev.map(m =>
            m.id === matterId
              ? { ...m, status: 'claimed', stage: 'conflict_cleared', timeRemainingSec: undefined }
              : m
          )
        );
      }
    } catch {
      // Non-fatal in sandbox
    } finally {
      setClaimingId(null);
    }
  };

  const handleReleaseMatter = (matterId: string, reason: string) => {
    setSandboxMatterOverride(matterId, { status: 'released', releaseReason: reason });
    setMatters(prev =>
      prev.map(m =>
        m.id === matterId
          ? { ...m, status: 'released', releaseReason: reason, timeRemainingSec: undefined }
          : m
      )
    );
    setReleasingId(null);
    trackClientEvent('portal_matter_released', { matter_id: matterId, reason });
  };

  const handleStageChange = (matterId: string, stage: MatterStage) => {
    const nextStatus = stage === 'signed_billed' ? 'completed' : 'claimed';
    setSandboxMatterOverride(matterId, { status: nextStatus, stage });
    setMatters(prev =>
      prev.map(m => (m.id === matterId ? { ...m, stage, status: nextStatus } : m))
    );
  };

  const handleCopyClause = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(id);
    setTimeout(() => setCopiedClauseId(null), 2200);
  };

  const handleSaveWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const formatCountdown = (sec?: number) => {
    const safe = Math.max(0, sec ?? 0);
    const m = Math.floor(safe / 60);
    const s = safe % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const lockedCount = useMemo(() => matters.filter(m => m.status === 'locked').length, [matters]);
  const claimedCount = useMemo(() => matters.filter(m => m.status === 'claimed').length, [matters]);
  const completedCount = useMemo(() => matters.filter(m => m.status === 'completed').length, [matters]);
  const employerFeesOfferedTotal = useMemo(
    () =>
      matters
        .filter(m => m.status === 'locked' || m.status === 'claimed')
        .reduce((sum, m) => sum + m.employerLegalFee, 0),
    [matters]
  );
  const urgentDeadlineCount = useMemo(
    () => matters.filter(m => (m.status === 'locked' || m.status === 'claimed') && m.isUrgentDeadline).length,
    [matters]
  );

  const filteredMatters = useMemo(() => {
    return matters.filter(m => {
      if (statusFilter === 'all' && m.status === 'released') return true;
      if (statusFilter !== 'all' && m.status !== statusFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        m.clientName.toLowerCase().includes(q) ||
        (m.employerName || '').toLowerCase().includes(q) ||
        m.postcode.toLowerCase().includes(q) ||
        m.disputeReasonLabel.toLowerCase().includes(q) ||
        m.cityArea.toLowerCase().includes(q)
      );
    });
  }, [matters, statusFilter, searchQuery]);

  const navItems: Array<{ id: PortalTab; label: string; shortLabel: string; badge?: number; icon: React.ReactNode }> = [
    {
      id: 'pipeline',
      label: 'Instruction Queue',
      shortLabel: 'Queue',
      badge: lockedCount > 0 ? lockedCount : undefined,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-6l-2 3h-4l-2-3H2" />
          <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
        </svg>
      ),
    },
    {
      id: 'territory',
      label: 'Territory & SLA',
      shortLabel: 'Territory',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      id: 'telemetry',
      label: 'Statutory & Vento',
      shortLabel: 'Statutes',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'PMS & Alerts',
      shortLabel: 'Settings',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
  ];

  // ── Login Gate ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EE] flex flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-md bg-white border border-[#E2DCCE] rounded-2xl p-6 sm:p-8 shadow-sm">
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
              Solicitor Command Centre
            </h1>
            <p className="text-sm text-[#0B1F3A]/75 mt-2 leading-relaxed">
              Protected by mandatory Multi-Factor Authentication (MFA / TOTP)
            </p>
          </div>

          {authStep === 'credentials' ? (
            <form
              onSubmit={e => {
                e.preventDefault();
                setAuthError(null);
                setAuthStep('totp');
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">Firm Work Email</label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={e => setWorkEmail(e.target.value)}
                  className="w-full h-12 px-3.5 border border-[#E2DCCE] rounded-lg text-base text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0B1F3A] mb-1.5">Partner Password / Passkey</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full h-12 px-3.5 border border-[#E2DCCE] rounded-lg text-base text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              <button type="submit" className={`${BTN_PRIMARY_NAVY} w-full h-12 text-base`}>
                Continue to Authenticator →
              </button>

              <div className="pt-4 border-t border-[#E2DCCE] text-center space-y-3">
                <p className="text-sm text-[#0B1F3A]/75">Evaluating the panel for your employment team?</p>
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoMode(true);
                    setIsAuthenticated(true);
                  }}
                  className={`${BTN_PRIMARY_CORAL} w-full h-12 text-base`}
                >
                  Launch Interactive Partner Sandbox →
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
                  <label className="block text-sm font-semibold text-[#0B1F3A]">6-Digit Authenticator Code</label>
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
                  onChange={e => setTotpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full h-13 p-3.5 border border-[#E2DCCE] rounded-lg text-center font-mono text-2xl tracking-[0.3em] font-bold text-[#0B1F3A] bg-[#F7F4EE] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                />
              </div>

              {authError && (
                <div role="alert" className="p-3.5 bg-[#FEF5F3] border border-[#F3C4B8] rounded-lg text-sm text-[#D9603B] font-medium leading-relaxed space-y-2">
                  <p className="m-0">{authError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDemoMode(true);
                      setIsAuthenticated(true);
                    }}
                    className="inline-flex items-center font-semibold underline text-[#0B1F3A] cursor-pointer"
                  >
                    Open Interactive Partner Sandbox →
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || totpCode.trim().length === 0}
                className={`${BTN_PRIMARY_CORAL} w-full h-12 text-base disabled:opacity-50`}
              >
                {isVerifying ? 'Verifying TOTP Code...' : 'Verify & Open Command Centre →'}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setAuthStep('credentials')}
                  className="h-11 px-3 text-sm font-medium text-[#0B1F3A]/80 hover:text-[#0B1F3A] underline cursor-pointer"
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

  // ── Modern Mobile-First App Shell ──────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#0B1F3A] flex flex-col lg:flex-row">
      {/* ── Desktop Left Sidebar (lg+) ───────────────────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-[#0B1F3A] text-white border-r border-white/10 z-40">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight block">
            <span className="text-[#D9603B]">Settlement</span>
            <span className="text-white">Check</span>
          </Link>
          <span className="text-xs font-mono uppercase tracking-widest text-white/60 block mt-1">
            Solicitor Portal
          </span>
        </div>

        <div className="px-4 py-4 border-b border-white/10">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#D9603B] font-semibold">
                {isDemoMode ? 'Sandbox Firm' : 'Charter Panel'}
              </span>
              <span className="text-xs font-mono text-white/60">SRA-649201</span>
            </div>
            <p className="text-sm font-semibold text-white leading-snug">
              Bristol Employment Law Specialists LLP
            </p>
            <p className="text-xs text-white/65">Exclusive BS Cluster · 30 mi</p>
          </div>
        </div>

        <nav aria-label="Partner portal sections" className="flex-1 px-3 py-4 space-y-1.5">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full h-11 px-3.5 rounded-lg flex items-center justify-between text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className={isActive ? 'text-[#D9603B]' : 'text-white/60'}>{item.icon}</span>
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span className="px-2 py-0.5 rounded-full bg-[#D9603B] text-white text-xs font-bold tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2.5">
          {isDemoMode && (
            <Link
              href="/for-solicitors/?from=portal-demo"
              onClick={() => trackClientEvent('solicitor_demo_to_apply', { source: 'portal_sidebar_cta' })}
              className={`${BTN_PRIMARY_CORAL} w-full`}
            >
              Apply to Join Panel →
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="w-full h-10 px-3.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            {isDemoMode ? 'Exit Sandbox' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* ── Mobile Compact Top App Bar (< lg) ────────────────────────────── */}
      <header className="lg:hidden sticky top-0 z-40 bg-[#0B1F3A] text-white border-b border-white/10">
        <div className="px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Link href="/" className="font-serif text-lg font-bold tracking-tight shrink-0">
              <span className="text-[#D9603B]">Settlement</span>
              <span className="text-white">Check</span>
            </Link>
            {isDemoMode && (
              <span className="px-2 py-0.5 rounded bg-[#D9603B]/20 border border-[#D9603B]/40 text-white text-xs font-mono font-semibold shrink-0">
                Sandbox
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {isDemoMode && (
              <Link
                href="/for-solicitors/?from=portal-demo"
                onClick={() => trackClientEvent('solicitor_demo_to_apply', { source: 'portal_mobile_topbar' })}
                className="inline-flex items-center justify-center h-9 px-3 rounded-lg bg-[#D9603B] text-white text-xs font-semibold"
              >
                Join Panel
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center justify-center h-9 px-2.5 rounded-lg bg-white/10 text-white text-xs font-medium"
            >
              {isDemoMode ? 'Exit' : 'Lock'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace Content ───────────────────────────────────────── */}
      <main className="flex-1 lg:pl-64 pb-24 lg:pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
          {/* ── TAB 1: INSTRUCTION QUEUE ─────────────────────────────────── */}
          {activeTab === 'pipeline' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#0B1F3A]/70">
                    <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse" />
                    <span>BS Postcode Cluster · April 2026 Statutory Engine</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] mt-1">
                    Instruction Queue
                  </h1>
                </div>

                <div className="hidden sm:flex items-center gap-3 text-sm text-[#0B1F3A]/75">
                  <span>
                    Exclusivity Hold: <strong className="text-[#0B1F3A]">15m</strong>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    Conflict Release: <strong className="text-[#0B1F3A]">Zero SLA Penalty</strong>
                  </span>
                </div>
              </div>

              {/* 100% Verifiable Operational 4-Stat Strip */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white px-4 py-3.5 rounded-xl border border-[#E2DCCE] shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#D9603B] block">
                    Priority Hold
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                      {lockedCount}
                    </span>
                    <span className="text-xs text-[#0B1F3A]/70 font-medium">15m SLA</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-3.5 rounded-xl border border-[#E2DCCE] shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/70 block">
                    Active Files
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                      {claimedCount}
                    </span>
                    <span className="text-xs text-[#0B1F3A]/70 font-medium">In progress</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-3.5 rounded-xl border border-[#E2DCCE] shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/70 block">
                    Employer Fees Offered
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                      £{employerFeesOfferedTotal.toLocaleString('en-GB')}
                    </span>
                    <span className="text-xs text-[#0B1F3A]/70 font-medium">+ VAT</span>
                  </div>
                </div>

                <div className="bg-white px-4 py-3.5 rounded-xl border border-[#E2DCCE] shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/70 block">
                    Urgent Deadlines
                  </span>
                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] tabular-nums">
                      {urgentDeadlineCount}
                    </span>
                    <span className="text-xs text-[#0B1F3A]/70 font-medium">This week</span>
                  </div>
                </div>
              </div>

              {/* Filter Bar + Instant Search */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="grid grid-cols-2 sm:flex items-center gap-1.5">
                  {[
                    { id: 'all' as const, label: `All (${matters.length})` },
                    { id: 'locked' as const, label: `Urgent (${lockedCount})` },
                    { id: 'claimed' as const, label: `Claimed (${claimedCount})` },
                    { id: 'completed' as const, label: `Completed (${completedCount})` },
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setStatusFilter(f.id)}
                      className={`h-10 px-3.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                        statusFilter === f.id
                          ? 'bg-[#0B1F3A] text-white'
                          : 'bg-white text-[#0B1F3A]/80 border border-[#E2DCCE] hover:border-[#0B1F3A]/35'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="relative sm:w-64">
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Filter client, employer, postcode..."
                    aria-label="Filter matters by client, employer, or postcode"
                    className="w-full h-11 pl-3.5 pr-3 rounded-lg bg-white border border-[#E2DCCE] text-base sm:text-sm text-[#0B1F3A] placeholder:text-[#0B1F3A]/50 focus:outline-none focus:ring-2 focus:ring-[#0B1F3A]"
                  />
                </div>
              </div>

              {/* Structured Actionable Matter Cards */}
              <div className="space-y-4">
                {filteredMatters.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E2DCCE] p-8 text-center">
                    <p className="text-base font-semibold text-[#0B1F3A]">No matching instructions</p>
                    <p className="text-sm text-[#0B1F3A]/70 mt-1">Try clearing your search or switching status filters.</p>
                  </div>
                ) : (
                  filteredMatters.map(m => {
                    const isBelowFloor = m.employerOffer < m.statutoryFloor;
                    const delta = Math.abs(m.employerOffer - m.statutoryFloor);

                    return (
                      <article
                        key={m.id}
                        className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                          m.status === 'locked'
                            ? 'border-[#D9603B]/50 ring-1 ring-[#D9603B]/15'
                            : m.status === 'released'
                              ? 'border-[#E2DCCE] opacity-75'
                              : 'border-[#E2DCCE]'
                        }`}
                      >
                        {/* Live Urgency Strip for Locked Matters */}
                        {m.status === 'locked' && (
                          <div className="bg-[#D9603B]/10 border-b border-[#D9603B]/20 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#D9603B]">
                              <span className="w-2 h-2 rounded-full bg-[#D9603B] animate-pulse" />
                              15-Min Provisional Territorial Hold
                            </span>
                            <span className="font-mono text-sm sm:text-base font-bold text-[#D9603B] tabular-nums">
                              {formatCountdown(m.timeRemainingSec)} left
                            </span>
                          </div>
                        )}

                        {m.status === 'released' && (
                          <div className="bg-[#F7F4EE] border-b border-[#E2DCCE] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-2 text-xs sm:text-sm text-[#0B1F3A]/80">
                            <span>
                              Released back to panel pool ({m.releaseReason || 'Conflict / Capacity'}) · Zero SLA penalty
                            </span>
                          </div>
                        )}

                        {/* Card Header */}
                        <div className="p-4 sm:px-6 sm:pt-5 sm:pb-4 flex flex-wrap items-start justify-between gap-3 border-b border-[#E2DCCE]">
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="font-serif font-bold text-xl text-[#0B1F3A] m-0">{m.clientName}</h2>
                              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#F7F4EE] border border-[#E2DCCE] text-[#0B1F3A]">
                                {m.postcode}
                              </span>
                              {m.captiveSteering && (
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#D9603B]/10 text-[#D9603B] border border-[#D9603B]/25">
                                  Captive Steering
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-[#0B1F3A]/75 m-0">
                              {m.disputeReasonLabel} · {m.cityArea} · {m.yearsOfService} yrs service
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {m.status === 'claimed' && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#0B1F3A] text-white">
                                Claimed
                              </span>
                            )}
                            {m.status === 'completed' && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#F7F4EE] border border-[#E2DCCE] text-[#0B1F3A]/75">
                                Signed &amp; Billed
                              </span>
                            )}
                            <span className="text-xs text-[#0B1F3A]/65">{m.receivedAt}</span>
                          </div>
                        </div>

                        {/* Uniform 2x2 / 4-Col Structured Triage Grid (Matches Dossier Sheet) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-[#E2DCCE] bg-[#F7F4EE]/60 border-b border-[#E2DCCE]">
                          <div className="px-4 py-3">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                              Counterparty (SRA 6.2)
                            </span>
                            <span className="block text-sm font-semibold text-[#0B1F3A] mt-0.5 leading-snug">
                              {m.employerName || 'Confirm on first call'}
                            </span>
                          </div>
                          <div className="px-4 py-3">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                              Signing Deadline
                            </span>
                            <span className={`block text-sm font-semibold mt-0.5 leading-snug ${m.isUrgentDeadline && m.status !== 'completed' ? 'text-[#D9603B]' : 'text-[#0B1F3A]'}`}>
                              {m.signingDeadlineLabel}
                            </span>
                          </div>
                          <div className="px-4 py-3">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                              Document Status
                            </span>
                            <span className="block text-sm font-semibold text-[#0B1F3A] mt-0.5 leading-snug">
                              {m.hasDraftAgreement ? 'Draft Ready' : 'Offer Only'}
                            </span>
                          </div>
                          <div className="px-4 py-3">
                            <span className="block text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]/60">
                              Client Goal
                            </span>
                            <span className="block text-sm font-semibold text-[#0B1F3A] mt-0.5 leading-snug">
                              {m.clientGoal}
                            </span>
                          </div>
                        </div>

                        {/* Deterministic Statutory Financial Strip (Zero Fabricated Targets) */}
                        <div className="p-4 sm:px-6 sm:py-4 space-y-4">
                          <div className="grid grid-cols-3 gap-3 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE] p-3.5">
                            <div>
                              <span className="block text-xs font-medium text-[#0B1F3A]/65">Employer Offer</span>
                              <span className={`block text-lg sm:text-xl font-serif font-bold tabular-nums mt-0.5 ${isBelowFloor ? 'text-[#D9603B]' : 'text-[#0B1F3A]'}`}>
                                £{m.employerOffer.toLocaleString('en-GB')}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs font-medium text-[#0B1F3A]/65">ERA 1996 Floor</span>
                              <span className="block text-lg sm:text-xl font-serif font-bold text-[#0B1F3A] tabular-nums mt-0.5">
                                £{m.statutoryFloor.toLocaleString('en-GB')}
                              </span>
                            </div>
                            <div>
                              <span className="block text-xs font-medium text-[#0B1F3A]/65">Tax-Free (s.403)</span>
                              <span className="block text-lg sm:text-xl font-serif font-bold text-[#0B1F3A] tabular-nums mt-0.5">
                                £{m.taxFreeAmount.toLocaleString('en-GB')}
                              </span>
                            </div>

                            <div className="col-span-3 pt-2.5 border-t border-[#E2DCCE] flex flex-wrap items-center justify-between gap-2 text-xs text-[#0B1F3A]/75">
                              <span>
                                {isBelowFloor ? (
                                  <strong className="text-[#D9603B]">
                                    £{delta.toLocaleString('en-GB')} below ERA 1996 statutory baseline
                                  </strong>
                                ) : (
                                  <span>
                                    +£{delta.toLocaleString('en-GB')} above statutory baseline · Salary £{m.salary.toLocaleString('en-GB')}
                                  </span>
                                )}
                              </span>
                              <span className="font-medium text-[#0B1F3A]">
                                Employer Legal Fee Offered: <strong>£{m.employerLegalFee} + VAT</strong>
                              </span>
                            </div>
                          </div>

                          {/* Clear, Unmistakably Interactive Release Panel */}
                          {releasingId === m.id && (
                            <div className="rounded-xl bg-[#FEF5F3] border border-[#D9603B]/35 p-4 space-y-3">
                              <div className="flex items-center justify-between gap-2">
                                <div>
                                  <span className="text-sm font-bold text-[#0B1F3A] block">
                                    Select a reason to release back to the panel pool
                                  </span>
                                  <span className="text-xs text-[#0B1F3A]/70 block">
                                    SRA conflict releases carry zero SLA penalty.
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setReleasingId(null)}
                                  className="h-9 px-3 rounded-lg bg-white border border-[#E2DCCE] text-xs font-semibold text-[#0B1F3A] hover:bg-[#F7F4EE] cursor-pointer shrink-0"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div className="space-y-2">
                                {RELEASE_REASONS.map(reason => (
                                  <button
                                    key={reason.label}
                                    type="button"
                                    onClick={() => handleReleaseMatter(m.id, reason.label)}
                                    className="w-full text-left px-4 py-3 rounded-lg bg-white border border-[#E2DCCE] hover:border-[#D9603B] hover:bg-[#D9603B]/5 shadow-sm transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                                  >
                                    <div>
                                      <span className="block text-sm font-semibold text-[#0B1F3A] group-hover:text-[#D9603B]">
                                        {reason.label}
                                      </span>
                                      <span className="block text-xs text-[#0B1F3A]/65 mt-0.5">
                                        {reason.detail}
                                      </span>
                                    </div>
                                    <svg
                                      className="w-4 h-4 text-[#0B1F3A]/45 group-hover:text-[#D9603B] shrink-0 transition-colors"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <path d="M5 12h14" />
                                      <path d="m12 5 7 7-7 7" />
                                    </svg>
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Unified Action Bar (Consistent Height h-11, Consistent Radius rounded-lg) */}
                          {m.status !== 'released' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                              <div className="flex flex-wrap items-center gap-2">
                                {m.status === 'claimed' && (
                                  <div className="relative flex-1 sm:flex-none">
                                    <select
                                      aria-label={`Matter stage for ${m.clientName}`}
                                      value={m.stage || 'conflict_cleared'}
                                      onChange={e => handleStageChange(m.id, e.target.value as MatterStage)}
                                      className="w-full sm:w-auto appearance-none h-11 pl-3.5 pr-9 rounded-lg bg-white border border-[#0B1F3A]/20 hover:border-[#0B1F3A]/40 text-sm font-semibold text-[#0B1F3A] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0B1F3A] cursor-pointer"
                                    >
                                      {STAGE_OPTIONS.map(opt => (
                                        <option key={opt.id} value={opt.id}>
                                          Stage: {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                    <svg
                                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1F3A]/70"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      aria-hidden="true"
                                    >
                                      <path d="m6 9 6 6 6-6" />
                                    </svg>
                                  </div>
                                )}

                                {(m.status === 'locked' || m.status === 'claimed') && releasingId !== m.id && (
                                  <button
                                    type="button"
                                    onClick={() => setReleasingId(m.id)}
                                    className={BTN_GHOST_RELEASE}
                                  >
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M18 6 6 18" />
                                      <path d="m6 6 12 12" />
                                    </svg>
                                    Release Matter
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:flex items-center gap-2">
                                {m.status === 'claimed' && (
                                  <a href={`tel:${m.phone}`} className={BTN_SECONDARY}>
                                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    Call Client
                                  </a>
                                )}
                                {m.status === 'locked' && (
                                  <button
                                    type="button"
                                    onClick={() => handleQuickClaim(m.id)}
                                    disabled={claimingId === m.id}
                                    className={BTN_SECONDARY}
                                  >
                                    {claimingId === m.id ? 'Holding Matter...' : 'Hold & Conflict Check'}
                                  </button>
                                )}
                                <Link
                                  href={`/dossier/review/${m.id}/?token=demo_partner_token`}
                                  className={m.status === 'locked' ? BTN_PRIMARY_CORAL : BTN_PRIMARY_NAVY}
                                >
                                  {m.status === 'locked' ? 'Review Dossier →' : 'Open Dossier →'}
                                </Link>
                              </div>
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ── TAB 2: TERRITORY & SLA ───────────────────────────────────── */}
          {activeTab === 'territory' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A]">Territory &amp; Exclusivity</h1>
                <p className="text-base text-[#0B1F3A]/80 mt-1.5 max-w-prose leading-relaxed">
                  Your firm holds exclusive first-right routing on every verified settlement instruction originating inside these outward postcode zones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E2DCCE] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#0B1F3A]/75">Assigned Outward Postcodes</h2>
                    <span className="text-xs font-mono font-semibold text-[#D9603B]">10 Active Zones</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['BS8', 'BS1', 'BS2', 'BS3', 'BS6', 'BS7', 'BS9', 'BS10', 'BS16', 'BS20'].map(code => (
                      <span
                        key={code}
                        className="px-3.5 py-2 bg-[#F7F4EE] border border-[#E2DCCE] rounded-lg text-sm font-mono font-bold text-[#0B1F3A]"
                      >
                        {code}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-[#0B1F3A]/80 pt-1">
                    Coverage radius: <strong>30 miles</strong> from Bristol hub (BS8 1TH).
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-[#0B1F3A] text-white space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#D9603B]">SRA Conflict-Safe 15-Min Hold</h2>
                  <p className="text-base text-[#F7F4EE]/90 leading-relaxed">
                    Instructions in your postcode zone are held exclusively for your firm for 15 minutes and never broadcast simultaneously. If an SRA Code 6.2 conflict surfaces on review or first call, releasing the matter carries zero SLA penalty.
                  </p>
                  <div className="pt-2 border-t border-white/10 text-sm text-white/80 flex items-center justify-between">
                    <span>SRA Code of Conduct</span>
                    <strong className="text-white">Independent Panel</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 3: STATUTORY & VENTO QUICK-REFERENCE (2026/27) ───────── */}
          {activeTab === 'telemetry' && (
            <div className="space-y-5">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#D9603B]">
                  Effective 6 April 2026 · Verified UK Statutory Constants
                </span>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A] mt-1">
                  Statutory &amp; Vento Quick-Reference
                </h1>
                <p className="text-base text-[#0B1F3A]/80 mt-1.5 max-w-prose leading-relaxed">
                  Pocket reference for calls and Without Prejudice correspondence. Tap any card to copy a legally citable statutory paragraph straight into your negotiation letter.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STATUTORY_WP_CARDS.map(card => (
                  <div key={card.id} className="bg-white rounded-2xl border border-[#E2DCCE] p-5 shadow-sm flex flex-col justify-between gap-4">
                    <div className="space-y-3">
                      <div>
                        <h2 className="font-serif font-bold text-lg text-[#0B1F3A] m-0">{card.title}</h2>
                        <span className="text-xs font-mono text-[#0B1F3A]/65 block mt-0.5">{card.citation}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2.5">
                        {card.metrics.map(metric => (
                          <div key={metric.label} className="rounded-lg bg-[#F7F4EE] p-3">
                            <span className="text-xs text-[#0B1F3A]/70 block">{metric.label}</span>
                            <span className="text-sm sm:text-base font-bold text-[#0B1F3A] tabular-nums block mt-0.5">
                              {metric.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopyClause(card.id, card.wpClause)}
                      className={`${BTN_SECONDARY} w-full`}
                    >
                      {copiedClauseId === card.id ? 'Copied Statutory WP Clause' : 'Copy Without Prejudice Clause'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 4: PMS & ALERTS ──────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1F3A]">PMS Webhooks &amp; SLA Alerts</h1>
                <p className="text-base text-[#0B1F3A]/80 mt-1.5 max-w-prose leading-relaxed">
                  Push claimed dossiers directly into Clio Manage, LEAP, or PracticeEvolve and manage 15-minute SLA mobile notifications.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#E2DCCE] shadow-sm space-y-6 max-w-2xl">
                <form onSubmit={handleSaveWebhook} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-[#0B1F3A] mb-2">
                      Incoming Webhook URL (Clio / LEAP / PracticeEvolve)
                    </label>
                    <input
                      type="url"
                      value={webhookUrl}
                      onChange={e => setWebhookUrl(e.target.value)}
                      className="w-full h-12 px-3.5 rounded-lg border border-[#E2DCCE] bg-[#F7F4EE] focus:bg-white text-base font-mono text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#D9603B]"
                      placeholder="https://app.clio.com/api/v4/webhooks/..."
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#F7F4EE] border border-[#E2DCCE]">
                    <div>
                      <span className="text-sm sm:text-base font-semibold text-[#0B1F3A] block">
                        Instant SMS &amp; Email SLA Alerts
                      </span>
                      <span className="text-sm text-[#0B1F3A]/75 block">
                        Notify duty solicitor immediately when a BS postcode matter enters the 15-minute hold.
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={slaAlertsEnabled}
                      onClick={() => setSlaAlertsEnabled(v => !v)}
                      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                        slaAlertsEnabled ? 'bg-[#D9603B]' : 'bg-[#0B1F3A]/25'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                          slaAlertsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <button type="submit" className={BTN_PRIMARY_NAVY}>
                      Save Configuration
                    </button>
                    {isSaved && <span className="text-sm sm:text-base text-[#0B1F3A] font-semibold">Saved successfully</span>}
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Mobile Fixed Bottom Navigation Bar (< lg) ────────────────────── */}
      <nav
        aria-label="Mobile partner portal navigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#E2DCCE] shadow-[0_-4px_12px_rgba(11,31,58,0.06)]"
      >
        <div className="grid grid-cols-4 h-16">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors ${
                  isActive ? 'text-[#D9603B]' : 'text-[#0B1F3A]/70 hover:text-[#0B1F3A]'
                }`}
              >
                {isActive && <span className="absolute top-0 inset-x-3 h-0.5 bg-[#D9603B] rounded-b-full" />}
                <span className="relative">
                  {item.icon}
                  {item.badge !== undefined && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D9603B] text-white text-xs font-bold flex items-center justify-center tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </span>
                <span>{item.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
