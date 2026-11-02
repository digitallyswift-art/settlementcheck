'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getVerdict, VerdictResult } from '@/lib/calculations'
import { LegalFeeShieldBadge } from '@/components/LegalFeeShieldBadge'

export interface CalcPayload {
  inputs: {
    salary: string
    yearsNum: string
    monthsNum: string
    age: string
    offer: string
    offerIncludesNotice?: string
    reason: string
    discrimination: string
    contractualNotice: string
    jurisdiction?: 'GB' | 'NI'
  }
  result: VerdictResult
}

export interface InitialCalcValues {
  salary?: string
  yearsNum?: string
  monthsNum?: string
  age?: string
  offer?: string
  offerIncludesNotice?: string
  reason?: string
  discrimination?: string
  contractualNotice?: string
  jurisdiction?: 'GB' | 'NI'
}

interface Props {
  onCalculate: (payload: CalcPayload) => void
  initialValues?: InitialCalcValues
}

// Notice option → contractual notice weeks (ERA 1996 s.86)
const NOTICE_WEEKS: Record<string, number> = {
  statutory: 0,
  '1m_or_less': 4,
  '2_3m': 10,
  '4_6m': 20,
  '6plus': 39,
  unsure: 0,
  '0': 0,
  '4': 4,
  '10': 10,
  '20': 20,
  '39': 39,
}

const WEEKS_TO_OPTION: Record<string, string> = {
  '0': 'statutory',
  '4': '1m_or_less',
  '10': '2_3m',
  '20': '4_6m',
  '39': '6plus',
}

// Stage 3 reason → calculation engine reason type
const REASON_MAP: Record<string, string> = {
  redundancy_individual: 'redundancy',
  redundancy_collective: 'redundancy_collective',
  performance: 'dismissal',
  constructive: 'dismissal',
  mutual: 'mutual',
  unsure: 'other',
  redundancy: 'redundancy',
  dismissal: 'dismissal',
  other: 'other',
}

const WEEKLY_CAP = { GB: 751, NI: 783 }

function LogoMark({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Go to SettlementCheck home"
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.5" />
        <path d="M6 11.5L9.5 15L16 7.5" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 420, letterSpacing: '-0.01em', lineHeight: 1 }}>
        <span style={{ color: '#D9603B' }}>Settlement</span><span style={{ color: '#0B1F3A' }}>Check</span>
      </span>
    </button>
  )
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Tick() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7.5L6 11L12 3.5" stroke="#D9603B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoPill({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ margin: '8px 0 16px' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          color: '#5B6577',
          fontSize: 12,
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 5,
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        <span>ℹ️</span> {label} {open ? '▲' : '▼'}
      </button>
      {open && (
        <div
          style={{
            marginTop: 8,
            padding: '10px 14px',
            background: 'rgba(11, 31, 58, 0.04)',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.55,
            color: '#4A5568',
            border: '1px solid rgba(11, 31, 58, 0.08)',
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

function cleanCurrencyInput(val: string): string {
  const noCurrency = val.replace(/[^0-9.]/g, '')
  if (noCurrency.includes('.')) {
    return noCurrency.split('.')[0]
  }
  return noCurrency
}

export default function ThematicCalculator({ onCalculate, initialValues }: Props) {
  const router = useRouter()
  const [stage, setStage] = useState(1)
  const [stageVisible, setStageVisible] = useState(true)
  const [shake, setShake] = useState(false)
  const [phase, setPhase] = useState<'stages' | 'loading'>('stages')
  const [loadStep, setLoadStep] = useState(1)

  // Form State
  const [rawSalary, setRawSalary] = useState(initialValues?.salary || '')
  const [salaryPeriod, setSalaryPeriod] = useState<'annual' | 'monthly' | 'weekly'>('annual')
  const [age, setAge] = useState(initialValues?.age || '')
  const [ageError, setAgeError] = useState('')
  const [yearsNum, setYearsNum] = useState(initialValues?.yearsNum || '')
  const [monthsNum, setMonthsNum] = useState(initialValues?.monthsNum || '')

  const [hasOffer, setHasOffer] = useState<boolean>(() => {
    if (initialValues?.offer !== undefined) {
      return parseFloat(initialValues.offer) > 0
    }
    return true
  })
  const [offer, setOffer] = useState(initialValues?.offer || '')
  const [offerIncludesNotice, setOfferIncludesNotice] = useState<boolean>(() => {
    return initialValues?.offerIncludesNotice !== 'false'
  })

  const [noticeOption, setNoticeOption] = useState<string | null>(() => {
    if (!initialValues?.contractualNotice) return null
    return WEEKS_TO_OPTION[initialValues.contractualNotice] || initialValues.contractualNotice
  })
  const [reason, setReason] = useState<string | null>(() => {
    if (!initialValues?.reason) return null
    if (initialValues.reason === 'redundancy') return 'redundancy_individual'
    if (initialValues.reason === 'dismissal') return 'performance'
    if (initialValues.reason === 'other') return 'unsure'
    return initialValues.reason
  })
  const [discrimination, setDiscrimination] = useState<string | null>(initialValues?.discrimination || null)
  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>(() => {
    if (initialValues?.jurisdiction === 'NI' || initialValues?.jurisdiction === 'GB') {
      return initialValues.jurisdiction
    }
    return 'GB'
  })

  const pendingPayload = useRef<CalcPayload | null>(null)
  const onCalculateRef = useRef(onCalculate)
  useEffect(() => { onCalculateRef.current = onCalculate }, [onCalculate])

  const loadingTimers = useRef<NodeJS.Timeout[]>([])
  useEffect(() => {
    return () => {
      loadingTimers.current.forEach(clearTimeout)
    }
  }, [])

  // Smart session storage persistence
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('sc_saved_calc') : null
      if (saved) {
        const parsed = JSON.parse(saved)
        if (!initialValues?.salary && parsed.salary && !rawSalary) setRawSalary(parsed.salary)
        if (!initialValues?.age && parsed.age && !age) setAge(parsed.age)
        if (!initialValues?.yearsNum && parsed.yearsNum && !yearsNum) setYearsNum(parsed.yearsNum)
        if (!initialValues?.monthsNum && parsed.monthsNum && !monthsNum) setMonthsNum(parsed.monthsNum)
        if (!initialValues?.offer && parsed.offer && !offer) {
          setOffer(parsed.offer)
          setHasOffer(parseFloat(parsed.offer) > 0)
        }
        if (initialValues?.offerIncludesNotice === undefined && parsed.offerIncludesNotice !== undefined) {
          setOfferIncludesNotice(parsed.offerIncludesNotice !== false)
        }
        if (!initialValues?.contractualNotice && parsed.contractualNotice && !noticeOption) {
          setNoticeOption(WEEKS_TO_OPTION[parsed.contractualNotice] || parsed.contractualNotice)
        }
        if (!initialValues?.reason && parsed.reason && !reason) setReason(parsed.reason)
        if (!initialValues?.discrimination && parsed.discrimination && !discrimination) setDiscrimination(parsed.discrimination)
        if (!initialValues?.jurisdiction && (parsed.jurisdiction === 'GB' || parsed.jurisdiction === 'NI')) setJurisdiction(parsed.jurisdiction)
      }
    } catch {
      // Safe fallback
    }
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sc_saved_calc', JSON.stringify({
          salary: rawSalary, age, yearsNum, monthsNum, offer, offerIncludesNotice, contractualNotice: noticeOption, reason, discrimination, jurisdiction
        }))
      }
    } catch {
      // Safe fallback
    }
  }, [rawSalary, age, yearsNum, monthsNum, offer, offerIncludesNotice, noticeOption, reason, discrimination, jurisdiction])

  useEffect(() => {
    if (!initialValues) return
    if (initialValues.salary && !rawSalary) setRawSalary(initialValues.salary)
    if (initialValues.age && !age) setAge(initialValues.age)
    if (initialValues.yearsNum && !yearsNum) setYearsNum(initialValues.yearsNum)
    if (initialValues.monthsNum && !monthsNum) setMonthsNum(initialValues.monthsNum)
    if (initialValues.offer && !offer) {
      setOffer(initialValues.offer)
      setHasOffer(parseFloat(initialValues.offer) > 0)
    }
    if (initialValues.offerIncludesNotice !== undefined) {
      setOfferIncludesNotice(initialValues.offerIncludesNotice !== 'false')
    }
    if (initialValues.contractualNotice && !noticeOption) {
      setNoticeOption(WEEKS_TO_OPTION[initialValues.contractualNotice] || initialValues.contractualNotice)
    }
    if (initialValues.reason && !reason) {
      let r = initialValues.reason
      if (r === 'redundancy') r = 'redundancy_individual'
      else if (r === 'dismissal') r = 'performance'
      else if (r === 'other') r = 'unsure'
      setReason(r)
    }
    if (initialValues.discrimination && !discrimination) setDiscrimination(initialValues.discrimination)
    if (initialValues.jurisdiction && (initialValues.jurisdiction === 'GB' || initialValues.jurisdiction === 'NI')) setJurisdiction(initialValues.jurisdiction)
  }, [initialValues])

  // Track enrollment & stage view telemetry
  useEffect(() => {
    fetch('/api/telemetry/experiment-event/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        experiment_id: 'calc_ux_v2',
        variant: 'thematic',
        event_type: 'enrolled',
        stage_number: 1,
      }),
    }).catch(() => {})
  }, [])

  function trackStage(stageNum: number) {
    fetch('/api/telemetry/experiment-event/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        experiment_id: 'calc_ux_v2',
        variant: 'thematic',
        event_type: 'stage_viewed',
        stage_number: stageNum,
      }),
    }).catch(() => {})
  }

  // Calculate normalized annual salary
  function getAnnualizedSalary(): number {
    const s = parseFloat(rawSalary) || 0
    if (salaryPeriod === 'monthly') return Math.round(s * 12)
    if (salaryPeriod === 'weekly') return Math.round(s * 52)
    return s
  }

  function goToStage(next: number) {
    setStageVisible(false)
    setShake(false)
    setTimeout(() => {
      setStage(next)
      setStageVisible(true)
      trackStage(next)
    }, 150)
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  // Advance validation logic
  function advance() {
    if (stage === 1) {
      const s = getAnnualizedSalary()
      if (!rawSalary || isNaN(s) || s <= 0) {
        triggerShake()
        return
      }
      goToStage(2)
    } else if (stage === 2) {
      const a = parseInt(age, 10)
      if (!age || isNaN(a) || a < 16 || a > 100) {
        setAgeError('Please verify the age entered (must be 16 or older).')
        triggerShake()
        return
      }
      if (!noticeOption) {
        triggerShake()
        return
      }
      setAgeError('')
      goToStage(3)
    } else if (stage === 3) {
      if (!reason) {
        triggerShake()
        return
      }
      if (hasOffer && (!offer || parseFloat(offer) <= 0)) {
        triggerShake()
        return
      }
      goToStage(4)
    } else if (stage === 4) {
      if (!discrimination) {
        triggerShake()
        return
      }
      startLoading()
    }
  }

  function startLoading() {
    const s = getAnnualizedSalary()
    const a = parseInt(age, 10)
    const y = parseInt(yearsNum || '0', 10)
    const m = parseInt(monthsNum || '0', 10)
    const o = hasOffer ? parseFloat(offer) || 0 : 0
    const totalMonths = y * 12 + m
    const calcReason = REASON_MAP[reason || 'mutual'] || 'other'
    const disc = discrimination || 'no'
    const noticeWeeks = NOTICE_WEEKS[noticeOption || 'statutory'] || 0

    // Guard against phantom PILON offer when hasOffer is false
    const effectiveIncludesNotice = hasOffer ? offerIncludesNotice : true
    const result = getVerdict(s, totalMonths, a, o, calcReason, disc, noticeWeeks, jurisdiction, effectiveIncludesNotice)

    pendingPayload.current = {
      inputs: {
        salary: String(s),
        yearsNum: String(y),
        monthsNum: String(m),
        age: String(a),
        offer: String(o),
        offerIncludesNotice: String(effectiveIncludesNotice),
        reason: calcReason,
        discrimination: disc,
        contractualNotice: String(noticeWeeks),
        jurisdiction,
      },
      result,
    }

    setPhase('loading')

    // Track completion telemetry
    fetch('/api/telemetry/experiment-event/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        experiment_id: 'calc_ux_v2',
        variant: 'thematic',
        event_type: 'completed',
        stage_number: 4,
      }),
    }).catch(() => {})

    loadingTimers.current.forEach(clearTimeout)
    loadingTimers.current = [
      setTimeout(() => setLoadStep(2), 800),
      setTimeout(() => setLoadStep(3), 1600),
      setTimeout(() => {
        if (pendingPayload.current) {
          onCalculateRef.current(pendingPayload.current)
        }
      }, 2400),
    ]
  }

  // Inline styling tokens
  const qSt: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontWeight: 420,
    fontSize: 'clamp(22px, 3.8vw, 26px)',
    lineHeight: 1.25,
    letterSpacing: '-0.014em',
    color: '#0B1F3A',
    margin: '0 0 10px',
  }

  const helperSt: React.CSSProperties = {
    fontSize: 13.5,
    color: '#5B6577',
    lineHeight: 1.5,
    margin: '0 0 16px',
  }

  const labelSt: React.CSSProperties = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#0B1F3A',
    marginBottom: 6,
  }

  const numInputSt: React.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: 18,
    color: '#0B1F3A',
    padding: '12px 14px',
    minWidth: 0,
  }

  function optionTileSt(selected: boolean): React.CSSProperties {
    return {
      width: '100%',
      padding: '12px 14px',
      textAlign: 'left',
      border: `1.5px solid ${selected ? '#0B1F3A' : '#E2DCCE'}`,
      borderRadius: 10,
      fontSize: 14,
      fontFamily: 'var(--font-sans)',
      fontWeight: selected ? 600 : 400,
      cursor: 'pointer',
      background: selected ? '#0B1F3A' : '#ffffff',
      color: selected ? '#ffffff' : '#0B1F3A',
      transition: 'all 120ms ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
  }

  // ── LOADING TRANSITION PHASE (2.4s) ─────────────────────────────
  if (phase === 'loading') {
    const statusMessages = {
      1: 'Checking statutory rates (£751/week cap under ERA 1996 s.227)…',
      2: 'Partitioning Post-Employment Notice Pay (PENP) under ITEPA 2003 s.402D…',
      3: 'Auditing compensation against April 2026 statutory limits…',
    }

    return (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: '#F7F4EE',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          padding: '24px',
        }}
      >
        <LogoMark onClick={() => router.push('/')} />
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 20,
            color: '#0B1F3A',
            textAlign: 'center',
            maxWidth: 360,
            margin: 0,
            minHeight: '2.4em',
          }}
        >
          {statusMessages[loadStep as 1 | 2 | 3]}
        </p>
        <div style={{ width: 220, height: 3, background: '#E2DCCE', borderRadius: 999, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              background: '#D9603B',
              borderRadius: 999,
              transition: 'width 800ms ease',
              width: loadStep === 1 ? '35%' : loadStep === 2 ? '75%' : '100%',
            }}
          />
        </div>
        <p style={{ fontSize: 13, color: '#8A93A3', margin: 0 }}>
          Calculating verified 2026 statutory baseline…
        </p>
      </div>
    )
  }

  // ── THEMATIC STAGES PHASE ───────────────────────────────────────
  const milestones = {
    1: 'Role & Continuous Service',
    2: 'Age & Contractual Notice',
    3: 'Situation & Settlement Proposal',
    4: 'Dispute Head of Claim',
  }

  const isSubTwoYears = yearsNum === '0' || yearsNum === '1'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F7F4EE', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <LogoMark onClick={() => router.push('/')} />
          <button
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, color: '#8A93A3', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <BackIcon /> Exit
          </button>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#5B6577', marginBottom: 4 }}>
            Stage {stage} of 4: {milestones[stage as 1 | 2 | 3 | 4]}
          </div>
          <div style={{ width: 130, height: 3, background: '#E2DCCE', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(stage / 4) * 100}%`, background: '#D9603B', transition: 'width 250ms ease' }} />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 220px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 460, opacity: stageVisible ? 1 : 0, transition: 'opacity 150ms ease' }}>
          
          {/* ── STAGE 1: Role & Earnings (Salary + Service) ── */}
          {stage === 1 && (
            <div>
              <h2 style={qSt}>Your Role & Earnings</h2>
              <p style={helperSt}>Basic earnings and continuous service establish your statutory baseline.</p>

              {/* Salary Section */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>Gross basic salary</label>
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  {(['annual', 'monthly', 'weekly'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSalaryPeriod(p)}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: '1px solid #E2DCCE',
                        background: salaryPeriod === p ? '#0B1F3A' : '#ffffff',
                        color: salaryPeriod === p ? '#ffffff' : '#5B6577',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: 500,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className={`step-input-wrap${shake && !rawSalary ? ' sc-shake' : ''}`}>
                  <span style={{ padding: '0 4px 0 14px', fontSize: 18, color: '#9AA3AE', fontFamily: 'var(--font-mono)' }}>£</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={salaryPeriod === 'annual' ? '45,000' : salaryPeriod === 'monthly' ? '3,750' : '865'}
                    value={rawSalary}
                    onChange={e => setRawSalary(cleanCurrencyInput(e.target.value))}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={numInputSt}
                  />
                </div>
                <InfoPill label="Legal basis for basic pay">
                  Section 221 of the Employment Rights Act 1996 defines 'a week's pay' for statutory redundancy and notice calculations. Variable or discretionary bonuses are excluded from statutory baselines.
                </InfoPill>
                {/* Statutory Jurisdiction Toggle */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #E2DCCE' }}>
                  <label style={{ ...labelSt, fontSize: 12, marginBottom: 6 }}>
                    Statutory Jurisdiction
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => setJurisdiction('GB')}
                      style={{
                        padding: '8px 10px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: `1.5px solid ${jurisdiction === 'GB' ? '#0B1F3A' : '#E2DCCE'}`,
                        background: jurisdiction === 'GB' ? '#0B1F3A' : '#ffffff',
                        color: jurisdiction === 'GB' ? '#ffffff' : '#0B1F3A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 500,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>England, Wales &amp; Scot</div>
                      <div style={{ fontSize: 10, opacity: jurisdiction === 'GB' ? 0.85 : 0.65, marginTop: 1 }}>£751/wk cap</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setJurisdiction('NI')}
                      style={{
                        padding: '8px 10px',
                        fontSize: 12,
                        borderRadius: 6,
                        border: `1.5px solid ${jurisdiction === 'NI' ? '#0B1F3A' : '#E2DCCE'}`,
                        background: jurisdiction === 'NI' ? '#0B1F3A' : '#ffffff',
                        color: jurisdiction === 'NI' ? '#ffffff' : '#0B1F3A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 500,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>Northern Ireland</div>
                      <div style={{ fontSize: 10, opacity: jurisdiction === 'NI' ? 0.85 : 0.65, marginTop: 1 }}>£783/wk cap</div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Service Section */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>Completed years of continuous service</label>
                <div className="step-input-wrap">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="5"
                    value={yearsNum}
                    onChange={e => setYearsNum(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={{ ...numInputSt, paddingLeft: 14 }}
                  />
                  <span style={{ paddingRight: 14, fontSize: 14, color: '#9AA3AE' }}>years</span>
                </div>

                {/* Sub-2-year conditional disclosure */}
                {isSubTwoYears && (
                  <div style={{ marginTop: 12, padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px solid #E2DCCE' }}>
                    <label style={{ ...labelSt, fontSize: 12 }}>Additional completed months (if under 2 years)</label>
                    <div className="step-input-wrap" style={{ height: 42 }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="8"
                        value={monthsNum}
                        onChange={e => setMonthsNum(e.target.value.replace(/[^0-9]/g, ''))}
                        onKeyDown={e => e.key === 'Enter' && advance()}
                        style={{ ...numInputSt, fontSize: 15, padding: '8px 12px' }}
                      />
                      <span style={{ paddingRight: 12, fontSize: 13, color: '#9AA3AE' }}>months</span>
                    </div>
                    <span style={{ display: 'block', fontSize: 11.5, color: '#5B6577', marginTop: 6, lineHeight: 1.4 }}>
                      Continuous service near the two-year mark determines ordinary unfair dismissal rights under Section 108 ERA 1996 via Section 97(2) statutory notice extensions.
                    </span>
                  </div>
                )}

                <InfoPill label="Legal basis for continuous service">
                  Continuous service is calculated from the contract start date under Section 211 ERA 1996. Completed full years govern statutory redundancy (capped at 20 years).
                </InfoPill>
              </div>
            </div>
          )}

          {/* ── STAGE 2: Age & Contractual Notice ── */}
          {stage === 2 && (
            <div>
              <h2 style={qSt}>Age & Contractual Notice</h2>
              <p style={helperSt}>Your age and notice period dictate statutory multipliers and notice pay rights.</p>

              {/* Age */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>Age at calculation date</label>
                <div className={`step-input-wrap${shake && ageError ? ' sc-shake' : ''}`}>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="38"
                    value={age}
                    onChange={e => { setAge(e.target.value.replace(/[^0-9]/g, '')); setAgeError('') }}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={{ ...numInputSt, paddingLeft: 14 }}
                  />
                  <span style={{ paddingRight: 14, fontSize: 14, color: '#9AA3AE' }}>years old</span>
                </div>
                {ageError && <span style={{ fontSize: 12, color: '#C0392B', marginTop: 4, display: 'block' }}>{ageError}</span>}
                <InfoPill label="Legal basis for age multiplier">
                  Under Section 162 ERA 1996, statutory redundancy rates apply age tiers: 0.5 week per year under 22; 1.0 week per year between 22 and 40; and 1.5 weeks per year from age 41.
                </InfoPill>
              </div>

              {/* Notice Period */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>Contractual notice period</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { value: 'statutory', label: 'Statutory minimum (1 wk per year, max 12)' },
                    { value: '1m_or_less', label: '1 month' },
                    { value: '2_3m', label: '2 to 3 months' },
                    { value: '4_6m', label: '4 to 6 months' },
                    { value: '6plus', label: 'Over 6 months' },
                    { value: 'unsure', label: 'Terms unverified / Not sure' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setNoticeOption(opt.value)}
                      style={optionTileSt(noticeOption === opt.value)}
                    >
                      <span>{opt.label}</span>
                      {noticeOption === opt.value && <Tick />}
                    </button>
                  ))}
                </div>
                <InfoPill label="Legal basis for notice pay (PENP)">
                  Section 86 ERA 1996 sets statutory minimum notice. Where contract terms specify a longer period, contractual notice determines Post-Employment Notice Pay (PENP) calculations under ITEPA 2003 s.402D.
                </InfoPill>
              </div>
            </div>
          )}

          {/* ── STAGE 3: Situation & Current Proposal ── */}
          {stage === 3 && (
            <div>
              <h2 style={qSt}>Situation & Current Proposal</h2>
              <p style={helperSt}>The dispute category and proposed sum determine statutory standing and tax exemptions.</p>

              {/* Reason */}
              <div style={{ marginBottom: 22 }}>
                <label style={labelSt}>Reason for departure or dispute</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { value: 'redundancy_individual', label: 'Redundancy (Individual)' },
                    { value: 'redundancy_collective', label: 'Group Redundancy (20+ roles)' },
                    { value: 'performance', label: 'Performance or Disciplinary' },
                    { value: 'constructive', label: 'Constructive Dismissal (Resignation)' },
                    { value: 'mutual', label: 'Mutual Agreement / Exit Negotiation' },
                    { value: 'unsure', label: 'Uncertain / Other' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setReason(opt.value)}
                      style={optionTileSt(reason === opt.value)}
                    >
                      <span>{opt.label}</span>
                      {reason === opt.value && <Tick />}
                    </button>
                  ))}
                </div>

                {/* In-flow Constructive Dismissal Safeguard (Zero Outbound Links) */}
                {reason === 'constructive' && (
                  <div style={{ marginTop: 12, padding: '12px 14px', background: 'rgba(217,96,59,0.08)', border: '1px solid rgba(217,96,59,0.25)', borderRadius: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#D9603B', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
                      Statutory Safeguard
                    </span>
                    <span style={{ fontSize: 12.5, color: '#0B1F3A', lineHeight: 1.5, display: 'block' }}>
                      Resigning before taking independent legal advice significantly weakens your statutory standing. Tribunal data shows over 90% of constructive dismissal claims fail when unadvised. Completing this calculation shows your legal baseline while still employed.
                    </span>
                  </div>
                )}

                {/* In-flow Collective Redundancy Notice */}
                {reason === 'redundancy_collective' && (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: 'rgba(11,31,58,0.04)', borderRadius: 8, fontSize: 12, color: '#5B6577' }}>
                    Protective Award Notice: Up to 90 days gross pay applies under Section 188 TULRCA 1992 if group consultation was omitted.
                  </div>
                )}
              </div>

              {/* Offer Section */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>Settlement proposal status</label>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <button
                    type="button"
                    onClick={() => setHasOffer(true)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: `1.5px solid ${hasOffer ? '#0B1F3A' : '#E2DCCE'}`,
                      background: hasOffer ? '#0B1F3A' : '#ffffff',
                      color: hasOffer ? '#ffffff' : '#0B1F3A',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    Formal offer received
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasOffer(false)}
                    style={{
                      flex: 1,
                      padding: '10px 12px',
                      borderRadius: 8,
                      border: `1.5px solid ${!hasOffer ? '#0B1F3A' : '#E2DCCE'}`,
                      background: !hasOffer ? '#0B1F3A' : '#ffffff',
                      color: !hasOffer ? '#ffffff' : '#0B1F3A',
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    No offer made yet
                  </button>
                </div>

                {hasOffer && (
                  <div>
                    <label style={{ ...labelSt, fontSize: 12 }}>Proposed settlement sum</label>
                    <div className="step-input-wrap" style={{ marginBottom: 10 }}>
                      <span style={{ padding: '0 4px 0 14px', fontSize: 18, color: '#9AA3AE', fontFamily: 'var(--font-mono)' }}>£</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="15,000"
                        value={offer}
                        onChange={e => setOffer(cleanCurrencyInput(e.target.value))}
                        onKeyDown={e => e.key === 'Enter' && advance()}
                        style={numInputSt}
                      />
                    </div>

                    <div style={{ padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px solid #E2DCCE', marginTop: 10 }}>
                      <span style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#0B1F3A', marginBottom: 6 }}>
                        Notice pay allocation in this sum
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => setOfferIncludesNotice(true)}
                          style={{
                            ...optionTileSt(offerIncludesNotice),
                            padding: '8px 12px',
                            fontSize: 12.5,
                          }}
                        >
                          <span>Proposed sum includes notice pay (PILON)</span>
                          {offerIncludesNotice && <Tick />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setOfferIncludesNotice(false)}
                          style={{
                            ...optionTileSt(!offerIncludesNotice),
                            padding: '8px 12px',
                            fontSize: 12.5,
                          }}
                        >
                          <span>Notice pay is payable in addition (on top)</span>
                          {!offerIncludesNotice && <Tick />}
                        </button>
                      </div>
                      <InfoPill label="How tax applies to notice pay">
                        Under Section 402D ITEPA 2003, Post-Employment Notice Pay (PENP) is taxed as standard earnings, while genuine termination compensation qualifies for the £30,000 exemption under Section 403.
                      </InfoPill>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── STAGE 4: Dispute Head of Claim (Discrimination) ── */}
          {stage === 4 && (
            <div>
              <h2 style={qSt}>Unfair Treatment or Discrimination</h2>
              <p style={helperSt}>
                Treatment connected to race, gender, disability, age, pregnancy, or another protected factor.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {[
                  { value: 'no', label: 'No protected characteristic involved' },
                  { value: 'not_sure', label: 'Uncertain / Potential differential treatment' },
                  { value: 'yes', label: 'Protected characteristic identified' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDiscrimination(opt.value)}
                    style={{
                      ...optionTileSt(discrimination === opt.value),
                      padding: '16px 14px',
                      fontSize: 15,
                    }}
                  >
                    <span>{opt.label}</span>
                    {discrimination === opt.value && <Tick />}
                  </button>
                ))}
              </div>

              <InfoPill label="Protected characteristics under Equality Act 2010">
                Equality Act 2010 characteristics: age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion/belief, sex, sexual orientation. Discrimination claims carry uncapped compensation under Section 124 and incorporate Presidential Guidance Vento injury-to-feelings bands.
              </InfoPill>
            </div>
          )}

        </div>
      </div>

      {/* Persistent Bottom Advance Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px max(32px, env(safe-area-inset-bottom, 32px))',
          background: 'linear-gradient(to top, #F7F4EE 85%, rgba(247,244,238,0))',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ marginBottom: 8, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <LegalFeeShieldBadge />
          </div>
          <button
            onClick={advance}
            style={{
              width: '100%',
              background: '#D9603B',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 16,
              padding: '14px 20px',
              borderRadius: 10,
              cursor: 'pointer',
              marginBottom: 10,
            }}
          >
            {stage === 1
              ? 'Continue to statutory multipliers →'
              : stage === 2
              ? 'Continue to settlement proposal →'
              : stage === 3
              ? reason === 'constructive'
                ? 'Acknowledge context & check estimate →'
                : 'Continue to final assessment →'
              : 'Calculate settlement verdict →'}
          </button>

          {stage > 1 && (
            <button
              type="button"
              onClick={() => goToStage(stage - 1)}
              style={{
                background: 'none',
                border: 'none',
                color: '#8A93A3',
                fontSize: 13,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <BackIcon /> Back to previous stage
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
