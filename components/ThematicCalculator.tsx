'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getVerdict, VerdictResult } from '@/lib/calculations'
import { LegalFeeShieldBadge } from '@/components/LegalFeeShieldBadge'
import { hasAnalyticsConsent } from '@/lib/consent'

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
    <div style={{ margin: '6px 0 14px' }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        style={{
          background: 'none',
          border: 'none',
          padding: '10px 0',
          minHeight: 44,
          color: '#525D70',
          fontSize: 14,
          fontWeight: 500,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          cursor: 'pointer',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 7.2V11.2M8 5V5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span>{label}</span>
        <span aria-hidden="true" style={{ fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div
          style={{
            marginTop: 4,
            padding: '12px 14px',
            background: 'rgba(11, 31, 58, 0.04)',
            borderRadius: 8,
            fontSize: 14,
            lineHeight: 1.55,
            color: '#243247',
            border: '1px solid rgba(11, 31, 58, 0.1)',
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
  const intPart = noCurrency.includes('.') ? noCurrency.split('.')[0] : noCurrency
  return intPart.replace(/^0+(?=\d)/, '')
}

function formatCurrencyInput(val: string): string {
  if (!val) return ''
  const num = parseInt(val, 10)
  return isNaN(num) ? '' : num.toLocaleString('en-GB')
}

export default function ThematicCalculator({ onCalculate, initialValues }: Props) {
  const router = useRouter()
  const [stage, setStage] = useState(1)
  const [stageVisible, setStageVisible] = useState(true)
  const [shake, setShake] = useState(false)
  const [isCalculating, setIsCalculating] = useState(false)

  // Form State
  const [rawSalary, setRawSalary] = useState(initialValues?.salary || '')
  const [salaryError, setSalaryError] = useState('')
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
  const [offerError, setOfferError] = useState('')
  const [offerIncludesNotice, setOfferIncludesNotice] = useState<boolean>(() => {
    return initialValues?.offerIncludesNotice !== 'false'
  })

  const [noticeOption, setNoticeOption] = useState<string | null>(() => {
    if (!initialValues?.contractualNotice) return null
    return WEEKS_TO_OPTION[initialValues.contractualNotice] || initialValues.contractualNotice
  })
  const [noticeError, setNoticeError] = useState('')
  const [reason, setReason] = useState<string | null>(() => {
    if (!initialValues?.reason) return null
    if (initialValues.reason === 'redundancy') return 'redundancy_individual'
    if (initialValues.reason === 'dismissal') return 'performance'
    if (initialValues.reason === 'other') return 'unsure'
    return initialValues.reason
  })
  const [reasonError, setReasonError] = useState('')
  const [discrimination, setDiscrimination] = useState<string | null>(initialValues?.discrimination || null)
  const [discriminationError, setDiscriminationError] = useState('')
  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>(() => {
    if (initialValues?.jurisdiction === 'NI' || initialValues?.jurisdiction === 'GB') {
      return initialValues.jurisdiction
    }
    return 'GB'
  })

  const pendingPayload = useRef<CalcPayload | null>(null)
  const onCalculateRef = useRef(onCalculate)
  useEffect(() => { onCalculateRef.current = onCalculate }, [onCalculate])

  const scrollRef = useRef<HTMLDivElement>(null)
  const offerSectionRef = useRef<HTMLDivElement>(null)
  const offerInputRef = useRef<HTMLInputElement>(null)
  const pendingOfferScrollRef = useRef(false)
  const [vp, setVp] = useState<{ height: number | null; top: number; keyboardOpen: boolean }>({
    height: null,
    top: 0,
    keyboardOpen: false,
  })

  // Lock body scroll during calculator overlay
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Sync outer flex shell to actual visualViewport on iOS & Android
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return
    const vv = window.visualViewport
    const syncViewport = () => {
      const keyboardH = Math.max(0, window.innerHeight - vv.height)
      setVp({
        height: Math.round(vv.height),
        top: Math.max(0, Math.round(vv.offsetTop)),
        keyboardOpen: keyboardH > 120,
      })
    }
    syncViewport()
    vv.addEventListener('resize', syncViewport)
    vv.addEventListener('scroll', syncViewport)
    return () => {
      vv.removeEventListener('resize', syncViewport)
      vv.removeEventListener('scroll', syncViewport)
    }
  }, [])

  // Reset scroll to top on stage change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [stage])

  function scrollToOfferField(shouldFocus = true) {
    const container = scrollRef.current
    const target = offerSectionRef.current
    if (container && target) {
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      const nextTop = container.scrollTop + (targetRect.top - containerRect.top) - 16
      container.scrollTo({ top: Math.max(0, nextTop), behavior: 'smooth' })
    }
    if (shouldFocus && offerInputRef.current) {
      offerInputRef.current.focus({ preventScroll: true })
    }
  }

  function handleSelectFormalOffer() {
    if (hasOffer) {
      scrollToOfferField(true)
    } else {
      pendingOfferScrollRef.current = true
      setHasOffer(true)
    }
  }

  useEffect(() => {
    if (hasOffer && pendingOfferScrollRef.current) {
      pendingOfferScrollRef.current = false
      const rafId = requestAnimationFrame(() => {
        scrollToOfferField(true)
      })
      return () => cancelAnimationFrame(rafId)
    }
  }, [hasOffer])

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

  // Track enrollment & stage view telemetry (gated by UK PECR analytics consent)
  useEffect(() => {
    if (!hasAnalyticsConsent()) return
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
    if (!hasAnalyticsConsent()) return
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
        setSalaryError('Please enter your gross basic salary to continue.')
        triggerShake()
        return
      }
      setSalaryError('')
      goToStage(2)
    } else if (stage === 2) {
      const a = parseInt(age, 10)
      if (!age || isNaN(a) || a < 16 || a > 100) {
        setAgeError('Please verify your age (must be between 16 and 100).')
        triggerShake()
        return
      }
      setAgeError('')
      if (!noticeOption) {
        setNoticeError('Please select your contractual notice period.')
        triggerShake()
        return
      }
      setNoticeError('')
      goToStage(3)
    } else if (stage === 3) {
      if (!reason) {
        setReasonError('Please select the reason your employment is ending.')
        triggerShake()
        return
      }
      setReasonError('')
      if (hasOffer && (!offer || parseFloat(offer) <= 0)) {
        setOfferError('Please enter the proposed settlement sum, or select "No offer made yet".')
        triggerShake()
        scrollToOfferField(true)
        return
      }
      setOfferError('')
      goToStage(4)
    } else if (stage === 4) {
      if (!discrimination) {
        setDiscriminationError('Please select an option to calculate your estimate.')
        triggerShake()
        return
      }
      setDiscriminationError('')
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

    const payload: CalcPayload = {
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

    setIsCalculating(true)

    // Track completion telemetry (gated by UK PECR analytics consent)
    if (hasAnalyticsConsent()) {
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
    }

    onCalculateRef.current(payload)
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
    fontSize: 15,
    color: '#525D70',
    lineHeight: 1.55,
    margin: '0 0 16px',
  }

  const labelSt: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 600,
    color: '#0B1F3A',
    marginBottom: 6,
  }

  const errSt: React.CSSProperties = {
    display: 'block',
    fontSize: 14,
    fontWeight: 500,
    color: '#A8341F',
    marginTop: 6,
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
    fontVariantNumeric: 'tabular-nums',
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

  // ── THEMATIC STAGES PHASE ───────────────────────────────────────
  const milestones = {
    1: 'Role & Continuous Service',
    2: 'Age & Contractual Notice',
    3: 'Situation & Settlement Proposal',
    4: 'Dispute Head of Claim',
  }

  const isSubTwoYears = yearsNum === '0' || yearsNum === '1'

  return (
    <div
      style={{
        position: 'fixed',
        top: vp.top,
        left: 0,
        right: 0,
        height: vp.height ? `${vp.height}px` : '100dvh',
        zIndex: 50,
        background: '#F7F4EE',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          padding: vp.keyboardOpen ? '12px 18px' : '16px 20px',
          flexShrink: 0,
          borderBottom: '1px solid rgba(226, 220, 206, 0.55)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <LogoMark onClick={() => router.push('/')} />
          <button
            type="button"
            onClick={() => router.push('/')}
            style={{ background: 'none', border: 'none', padding: '10px 8px', minHeight: 44, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#525D70', display: 'inline-flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
          >
            <BackIcon /> Exit
          </button>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#525D70', marginBottom: 4 }}>
            Stage {stage} of 4
          </div>
          <div style={{ width: 96, height: 3, background: '#E2DCCE', borderRadius: 999, overflow: 'hidden', marginLeft: 'auto' }}>
            <div style={{ height: '100%', width: `${(stage / 4) * 100}%`, background: '#D9603B', transition: 'width 250ms ease' }} />
          </div>
        </div>
      </div>

      {/* Main Content Area — strictly bounded between header and docked footer */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          padding: vp.keyboardOpen ? '12px 18px 20px' : '18px 20px 32px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
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
                      aria-pressed={salaryPeriod === p}
                      onClick={() => setSalaryPeriod(p)}
                      style={{
                        flex: 1,
                        minHeight: 44,
                        padding: '10px',
                        fontSize: 14,
                        borderRadius: 8,
                        border: `1.5px solid ${salaryPeriod === p ? '#0B1F3A' : '#E2DCCE'}`,
                        background: salaryPeriod === p ? '#0B1F3A' : '#ffffff',
                        color: salaryPeriod === p ? '#ffffff' : '#525D70',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: 600,
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className={`step-input-wrap${shake && salaryError ? ' sc-shake' : ''}`}>
                  <span style={{ padding: '0 4px 0 14px', fontSize: 18, color: '#525D70', fontFamily: 'var(--font-mono)' }}>£</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder={salaryPeriod === 'annual' ? '45,000' : salaryPeriod === 'monthly' ? '3,750' : '865'}
                    value={formatCurrencyInput(rawSalary)}
                    onChange={e => { setRawSalary(cleanCurrencyInput(e.target.value)); setSalaryError('') }}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={numInputSt}
                  />
                </div>
                {salaryError && <span role="alert" style={errSt}>{salaryError}</span>}
                <InfoPill label="Legal basis for basic pay">
                  Section 221 of the Employment Rights Act 1996 defines &apos;a week&apos;s pay&apos; for statutory redundancy and notice calculations. Variable or discretionary bonuses are excluded from statutory baselines.
                </InfoPill>
                {/* Statutory Jurisdiction Toggle */}
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid #E2DCCE' }}>
                  <label style={{ ...labelSt, marginBottom: 8 }}>
                    Statutory Jurisdiction
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      type="button"
                      aria-pressed={jurisdiction === 'GB'}
                      onClick={() => setJurisdiction('GB')}
                      style={{
                        padding: '12px',
                        minHeight: 56,
                        fontSize: 14,
                        borderRadius: 8,
                        border: `1.5px solid ${jurisdiction === 'GB' ? '#0B1F3A' : '#E2DCCE'}`,
                        background: jurisdiction === 'GB' ? '#0B1F3A' : '#ffffff',
                        color: jurisdiction === 'GB' ? '#ffffff' : '#0B1F3A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 500,
                      }}
                    >
                      <div style={{ fontWeight: 600, lineHeight: 1.3 }}>England, Scotland &amp; Wales</div>
                      <div style={{ fontSize: 12, opacity: jurisdiction === 'GB' ? 0.9 : 0.78, marginTop: 2 }}>£751/wk cap</div>
                    </button>
                    <button
                      type="button"
                      aria-pressed={jurisdiction === 'NI'}
                      onClick={() => setJurisdiction('NI')}
                      style={{
                        padding: '12px',
                        minHeight: 56,
                        fontSize: 14,
                        borderRadius: 8,
                        border: `1.5px solid ${jurisdiction === 'NI' ? '#0B1F3A' : '#E2DCCE'}`,
                        background: jurisdiction === 'NI' ? '#0B1F3A' : '#ffffff',
                        color: jurisdiction === 'NI' ? '#ffffff' : '#0B1F3A',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontWeight: 500,
                      }}
                    >
                      <div style={{ fontWeight: 600, lineHeight: 1.3 }}>Northern Ireland</div>
                      <div style={{ fontSize: 12, opacity: jurisdiction === 'NI' ? 0.9 : 0.78, marginTop: 2 }}>£783/wk cap</div>
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
                    maxLength={2}
                    placeholder="5"
                    value={yearsNum}
                    onChange={e => setYearsNum(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={{ ...numInputSt, paddingLeft: 14 }}
                  />
                  <span style={{ paddingRight: 14, fontSize: 14, color: '#525D70' }}>years</span>
                </div>

                {/* Sub-2-year conditional disclosure */}
                {isSubTwoYears && (
                  <div style={{ marginTop: 12, padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px solid #E2DCCE' }}>
                    <label style={{ ...labelSt, fontSize: 14 }}>Additional completed months (if under 2 years)</label>
                    <div className="step-input-wrap" style={{ minHeight: 44 }}>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="8"
                        value={monthsNum}
                        onChange={e => setMonthsNum(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, ''))}
                        onKeyDown={e => e.key === 'Enter' && advance()}
                        style={{ ...numInputSt, fontSize: 16, padding: '10px 12px' }}
                      />
                      <span style={{ paddingRight: 12, fontSize: 14, color: '#525D70' }}>months</span>
                    </div>
                    <span style={{ display: 'block', fontSize: 13, color: '#525D70', marginTop: 6, lineHeight: 1.45 }}>
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
                    maxLength={3}
                    placeholder="38"
                    value={age}
                    onChange={e => { setAge(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')); setAgeError('') }}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={{ ...numInputSt, paddingLeft: 14 }}
                  />
                  <span style={{ paddingRight: 14, fontSize: 14, color: '#525D70' }}>years old</span>
                </div>
                {ageError && <span role="alert" style={errSt}>{ageError}</span>}
                <InfoPill label="Legal basis for age multiplier">
                  Under Section 162 ERA 1996, statutory redundancy rates apply age tiers: 0.5 week per year under 22; 1.0 week per year between 22 and 40; and 1.5 weeks per year from age 41.
                </InfoPill>
              </div>

              {/* Notice Period */}
              <div style={{ marginBottom: 20 }}>
                <label style={labelSt}>Contractual notice period</label>
                <div className={shake && noticeError ? 'sc-shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                      aria-pressed={noticeOption === opt.value}
                      onClick={() => { setNoticeOption(opt.value); setNoticeError('') }}
                      style={{ ...optionTileSt(noticeOption === opt.value), minHeight: 48 }}
                    >
                      <span>{opt.label}</span>
                      {noticeOption === opt.value && <Tick />}
                    </button>
                  ))}
                </div>
                {noticeError && <span role="alert" style={errSt}>{noticeError}</span>}
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
                <div className={shake && reasonError ? 'sc-shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                      aria-pressed={reason === opt.value}
                      onClick={() => { setReason(opt.value); setReasonError('') }}
                      style={{ ...optionTileSt(reason === opt.value), minHeight: 48 }}
                    >
                      <span>{opt.label}</span>
                      {reason === opt.value && <Tick />}
                    </button>
                  ))}
                </div>
                {reasonError && <span role="alert" style={errSt}>{reasonError}</span>}

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
                    aria-pressed={hasOffer}
                    onClick={() => { setOfferError(''); handleSelectFormalOffer() }}
                    style={{
                      flex: 1,
                      minHeight: 48,
                      padding: '12px',
                      borderRadius: 8,
                      border: `1.5px solid ${hasOffer ? '#0B1F3A' : '#E2DCCE'}`,
                      background: hasOffer ? '#0B1F3A' : '#ffffff',
                      color: hasOffer ? '#ffffff' : '#0B1F3A',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Formal offer received
                  </button>
                  <button
                    type="button"
                    aria-pressed={!hasOffer}
                    onClick={() => { setHasOffer(false); setOfferError('') }}
                    style={{
                      flex: 1,
                      minHeight: 48,
                      padding: '12px',
                      borderRadius: 8,
                      border: `1.5px solid ${!hasOffer ? '#0B1F3A' : '#E2DCCE'}`,
                      background: !hasOffer ? '#0B1F3A' : '#ffffff',
                      color: !hasOffer ? '#ffffff' : '#0B1F3A',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    No offer made yet
                  </button>
                </div>

                {hasOffer && (
                  <div ref={offerSectionRef}>
                    <label htmlFor="sc-offer-input" style={labelSt}>Proposed settlement sum</label>
                    <div
                      className={`step-input-wrap${shake && offerError ? ' sc-shake' : ''}`}
                      style={{ marginBottom: 10 }}
                    >
                      <span style={{ padding: '0 4px 0 14px', fontSize: 18, color: '#525D70', fontFamily: 'var(--font-mono)' }}>£</span>
                      <input
                        id="sc-offer-input"
                        ref={offerInputRef}
                        type="text"
                        inputMode="numeric"
                        placeholder="15,000"
                        value={formatCurrencyInput(offer)}
                        onChange={e => { setOffer(cleanCurrencyInput(e.target.value)); setOfferError('') }}
                        onKeyDown={e => e.key === 'Enter' && advance()}
                        style={numInputSt}
                      />
                    </div>
                    {offerError && <span role="alert" style={{ ...errSt, marginBottom: 10 }}>{offerError}</span>}

                    <div style={{ padding: '12px', background: '#ffffff', borderRadius: 8, border: '1px solid #E2DCCE', marginTop: 10 }}>
                      <span style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0B1F3A', marginBottom: 8 }}>
                        Notice pay allocation in this sum
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <button
                          type="button"
                          aria-pressed={offerIncludesNotice}
                          onClick={() => setOfferIncludesNotice(true)}
                          style={{
                            ...optionTileSt(offerIncludesNotice),
                            minHeight: 48,
                            padding: '10px 12px',
                            fontSize: 14,
                          }}
                        >
                          <span>Proposed sum includes notice pay (PILON)</span>
                          {offerIncludesNotice && <Tick />}
                        </button>
                        <button
                          type="button"
                          aria-pressed={!offerIncludesNotice}
                          onClick={() => setOfferIncludesNotice(false)}
                          style={{
                            ...optionTileSt(!offerIncludesNotice),
                            minHeight: 48,
                            padding: '10px 12px',
                            fontSize: 14,
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

              <div className={shake && discriminationError ? 'sc-shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                {[
                  { value: 'no', label: 'No protected characteristic involved' },
                  { value: 'not_sure', label: 'Uncertain / Potential differential treatment' },
                  { value: 'yes', label: 'Protected characteristic identified' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={discrimination === opt.value}
                    onClick={() => { setDiscrimination(opt.value); setDiscriminationError('') }}
                    style={{
                      ...optionTileSt(discrimination === opt.value),
                      minHeight: 56,
                      padding: '16px 14px',
                      fontSize: 15,
                    }}
                  >
                    <span>{opt.label}</span>
                    {discrimination === opt.value && <Tick />}
                  </button>
                ))}
              </div>
              {discriminationError && <span role="alert" style={errSt}>{discriminationError}</span>}

              <InfoPill label="Protected characteristics under Equality Act 2010">
                Equality Act 2010 characteristics: age, disability, gender reassignment, marriage/civil partnership, pregnancy/maternity, race, religion/belief, sex, sexual orientation. Discrimination claims carry uncapped compensation under Section 124 and incorporate Presidential Guidance Vento injury-to-feelings bands.
              </InfoPill>

              <div style={{ marginTop: 16 }}>
                <LegalFeeShieldBadge className="w-full" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Docked Bottom Advance Bar — in normal flex flow so it NEVER overlaps content */}
      <div
        style={{
          flexShrink: 0,
          borderTop: '1px solid #E2DCCE',
          background: '#F7F4EE',
          padding: vp.keyboardOpen
            ? '10px 18px 12px'
            : '12px 20px max(20px, env(safe-area-inset-bottom, 20px))',
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 460, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <button
            type="button"
            disabled={isCalculating}
            onClick={advance}
            style={{
              width: '100%',
              background: isCalculating ? '#525D70' : '#C24D29',
              border: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-sans)',
              fontWeight: 600,
              fontSize: 16,
              minHeight: 50,
              padding: vp.keyboardOpen ? '13px 20px' : '14px 20px',
              borderRadius: 10,
              cursor: isCalculating ? 'wait' : 'pointer',
              marginBottom: stage > 1 ? 4 : 0,
            }}
          >
            {isCalculating
              ? 'Calculating your estimate…'
              : stage === 1
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
                color: '#525D70',
                fontSize: 14,
                fontWeight: 500,
                minHeight: 44,
                padding: '10px 16px',
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
