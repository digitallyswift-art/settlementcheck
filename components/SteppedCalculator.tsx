'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getVerdict, VerdictResult } from '@/lib/calculations'
import { LegalFeeShieldBadge } from '@/components/LegalFeeShieldBadge'
import { Ga4TelemetryClient } from '@/components/telemetry/Ga4TelemetryClient'

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
  statutory: 0, '1m_or_less': 4, '2_3m': 10, '4_6m': 20, '6plus': 39, unsure: 0,
  '0': 0, '4': 4, '10': 10, '20': 20, '39': 39,
}

const WEEKS_TO_OPTION: Record<string, string> = {
  '0': 'statutory',
  '4': '1m_or_less',
  '10': '2_3m',
  '20': '4_6m',
  '39': '6plus',
}

// Step 6 reason → calculation engine reason type
const REASON_MAP: Record<string, string> = {
  redundancy_individual: 'redundancy',
  redundancy_collective: 'redundancy_collective', // triggers protective award in engine
  performance: 'dismissal',
  constructive: 'dismissal',
  mutual: 'mutual',
  unsure: 'other',
  redundancy: 'redundancy',
  dismissal: 'dismissal',
  other: 'other',
}

// ERA 1996 s.227 (GB) / ERO(NI) 1996 - April 2026 rates
const WEEKLY_CAP = { GB: 751, NI: 783 }

type Phase = 'steps' | 'loading'
type LoadState = 1 | 2 | 3

/* ── Sub-components ─────────────────────────────────────────────── */

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
    <svg width="10" height="10" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 7.5L6 11L12 3.5" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ── Main Component ─────────────────────────────────────────────── */

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

export default function SteppedCalculator({ onCalculate, initialValues }: Props) {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('steps')
  const [step, setStep] = useState(1)
  const [stepVisible, setStepVisible] = useState(true)
  const [shake, setShake] = useState(false)

  // Form values
  const [salary, setSalary] = useState(initialValues?.salary || '')
  const [salaryError, setSalaryError] = useState('')
  const [age, setAge] = useState(initialValues?.age || '')
  const [ageError, setAgeError] = useState('')
  const [yearsNum, setYearsNum] = useState(initialValues?.yearsNum || '')
  const [monthsNum, setMonthsNum] = useState(initialValues?.monthsNum || '')
  const [serviceError, setServiceError] = useState('')
  const [offer, setOffer] = useState(initialValues?.offer || '')
  const [offerIncludesNotice, setOfferIncludesNotice] = useState<boolean>(() => {
    if (initialValues?.offerIncludesNotice !== undefined) {
      return initialValues.offerIncludesNotice !== 'false'
    }
    return true
  })
  const [showConstructiveModal, setShowConstructiveModal] = useState(false)
  const [offerWarning, setOfferWarning] = useState('')
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
  const [collectiveVisible, setCollectiveVisible] = useState(false)
  const [discrimination, setDiscrimination] = useState<string | null>(initialValues?.discrimination || null)
  const [discriminationError, setDiscriminationError] = useState('')
  // Jurisdiction: default to GB (~96% of users) with explicit Northern Ireland toggle
  const [jurisdiction, setJurisdiction] = useState<'GB' | 'NI'>(() => {
    if (initialValues?.jurisdiction === 'NI' || initialValues?.jurisdiction === 'GB') {
      return initialValues.jurisdiction
    }
    return 'GB'
  })
  const weeklyCapAmount = WEEKLY_CAP[jurisdiction]


  // Smart session storage persistence
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? sessionStorage.getItem('sc_saved_calc') : null
      if (saved) {
        const parsed = JSON.parse(saved)
        if (!initialValues?.salary && parsed.salary && !salary) setSalary(parsed.salary)
        if (!initialValues?.age && parsed.age && !age) setAge(parsed.age)
        if (!initialValues?.yearsNum && parsed.yearsNum && !yearsNum) setYearsNum(parsed.yearsNum)
        if (!initialValues?.monthsNum && parsed.monthsNum && !monthsNum) setMonthsNum(parsed.monthsNum)
        if (!initialValues?.offer && parsed.offer && !offer) setOffer(parsed.offer)
        if (initialValues?.offerIncludesNotice === undefined && parsed.offerIncludesNotice !== undefined) {
          setOfferIncludesNotice(parsed.offerIncludesNotice !== false)
        }
        if (!initialValues?.contractualNotice && parsed.contractualNotice && !noticeOption) setNoticeOption(parsed.contractualNotice)
        if (!initialValues?.reason && parsed.reason && !reason) setReason(parsed.reason)
        if (!initialValues?.discrimination && parsed.discrimination && !discrimination) setDiscrimination(parsed.discrimination)
        if (!initialValues?.jurisdiction && (parsed.jurisdiction === 'GB' || parsed.jurisdiction === 'NI')) setJurisdiction(parsed.jurisdiction)
      }
    } catch {
      // Safe fallback for restricted or private browsing
    }
  }, [])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('sc_saved_calc', JSON.stringify({
          salary, age, yearsNum, monthsNum, offer, offerIncludesNotice, contractualNotice: noticeOption, reason, discrimination, jurisdiction
        }))
      }
    } catch {
      // Safe fallback
    }
  }, [salary, age, yearsNum, monthsNum, offer, offerIncludesNotice, noticeOption, reason, discrimination, jurisdiction])

  useEffect(() => {
    if (!initialValues) return
    if (initialValues.salary && !salary) setSalary(initialValues.salary)
    if (initialValues.age && !age) setAge(initialValues.age)
    if (initialValues.yearsNum && !yearsNum) setYearsNum(initialValues.yearsNum)
    if (initialValues.monthsNum && !monthsNum) setMonthsNum(initialValues.monthsNum)
    if (initialValues.offer && !offer) setOffer(initialValues.offer)
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

  // Submitting state (avoids jarring 150ms full-screen loading flash)
  const [isCalculating, setIsCalculating] = useState(false)
  const onCalculateRef = useRef(onCalculate)
  useEffect(() => { onCalculateRef.current = onCalculate }, [onCalculate])

  // Close Constructive Dismissal safeguard modal on Escape
  useEffect(() => {
    if (!showConstructiveModal) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConstructiveModal(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showConstructiveModal])



  // Refs for auto-focus
  const salaryRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const yearsRef = useRef<HTMLInputElement>(null)
  const monthsRef = useRef<HTMLInputElement>(null)
  const offerRef = useRef<HTMLInputElement>(null)

  // Scrollable content container ref (reset scrollTop on step change)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Visual viewport sync — keeps shell sized & anchored to actual visible area
  // when iOS/Android virtual keyboard opens, so header is never clipped and
  // footer CTA bar sits cleanly below scrollable content (zero overlap).
  const [vp, setVp] = useState<{ height: number | null; top: number; keyboardOpen: boolean }>({
    height: null,
    top: 0,
    keyboardOpen: false,
  })

  // Lock body scroll during step/loading overlay
  useEffect(() => {
    if (phase === 'steps' || phase === 'loading') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [phase])

  // visualViewport API — sync outer flex shell to exact visible viewport on iOS & Android
  useEffect(() => {
    if (phase !== 'steps') return
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
  }, [phase])

  // Reset scroll position when step changes
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0
  }, [step])

  // Auto-focus inputs on steps 2–4 on desktop viewports only.
  // Never auto-focus on initial mount (step 1) or on mobile viewports (< 768px)
  // so the mobile OS keyboard does not collide with bottom-docked bars (z-50).
  useEffect(() => {
    if (phase !== 'steps') return
    if (step === 1) return
    if (typeof window !== 'undefined' && window.innerWidth < 768) return
    const map: Record<number, React.RefObject<HTMLInputElement | null>> = {
      2: ageRef, 3: yearsRef, 4: offerRef,
    }
    const ref = map[step]
    if (!ref) return
    const t = setTimeout(() => {
      ref.current?.focus({ preventScroll: true })
    }, 100)
    return () => clearTimeout(t)
  }, [step, phase])

  /* ── Helpers ──────────────────────────────────────────────────── */

  function goToStep(next: number) {
    Ga4TelemetryClient.trackCalcStep(next, reason, yearsNum)
    setStepVisible(false)
    setShake(false)
    setTimeout(() => { setStep(next); setStepVisible(true) }, 150)
  }

  function triggerShake() {
    setShake(true)
    setTimeout(() => setShake(false), 600)
  }

  function getAdvanceCopy(): string {
    if (step === 1) return 'That is my salary'
    if (step === 2) return 'That is my age'
    if (step === 3) return 'Confirm length of service'
    if (step === 4) {
      const o = parseFloat(offer)
      return (!offer || isNaN(o) || o === 0) ? 'No offer made yet' : 'That is what they have offered'
    }
    if (step === 5) return 'That is my notice period'
    if (step === 6) return 'That is my situation'
    if (step === 7) return 'Review calculations'
    return 'Continue'
  }

  function advance() {
    if (step === 1) {
      const s = parseFloat(salary)
      if (!salary || isNaN(s) || s <= 0) {
        setSalaryError('Please enter your annual basic salary to continue.')
        triggerShake()
        return
      }
      setSalaryError('')
      goToStep(2)
    } else if (step === 2) {
      const a = parseInt(age, 10)
      if (!age || isNaN(a) || a < 16 || a > 100) {
        setAgeError('Please verify your age (must be between 16 and 100).')
        triggerShake()
        return
      }
      setAgeError('')
      goToStep(3)
    } else if (step === 3) {
      const hasAny = yearsNum !== '' || monthsNum !== ''
      const y = yearsNum === '' ? 0 : parseInt(yearsNum, 10)
      const m = monthsNum === '' ? 0 : parseInt(monthsNum, 10)
      if (!hasAny || isNaN(y) || isNaN(m) || y < 0 || y > 60 || m < 0 || m > 11) {
        setServiceError('Please enter valid years (0 to 60) and additional months (0 to 11).')
        triggerShake()
        return
      }
      setServiceError('')
      goToStep(4)
    } else if (step === 4) {
      // Monthly salary detection warning
      const o = parseFloat(offer)
      const s = parseFloat(salary)
      if (!isNaN(o) && !isNaN(s) && s > 0 && o > 0) {
        const monthly = s / 12
        if (Math.abs(o - monthly) / monthly < 0.05 && !offerWarning) {
          setOfferWarning('Just to confirm: is this the total settlement figure, not a monthly amount?')
          triggerShake()
          return
        }
      }
      setOfferWarning('')
      goToStep(5)
    } else if (step === 5) {
      if (!noticeOption) {
        setNoticeError('Please select the option that best matches your notice period.')
        triggerShake()
        return
      }
      setNoticeError('')
      goToStep(6)
    } else if (step === 6) {
      if (!reason) {
        setReasonError('Please select why your employment is ending.')
        triggerShake()
        return
      }
      setReasonError('')
      goToStep(7)
    } else if (step === 7) {
      if (!discrimination) {
        setDiscriminationError('Please select an option (choose "Not sure" if uncertain).')
        triggerShake()
        return
      }
      setDiscriminationError('')
      startLoading()
    }
  }

  // Step 5: notice selection (user confirms with docked CTA for control & zero mis-tap skips)
  function handleNoticeSelect(val: string) {
    setNoticeOption(val)
    setNoticeError('')
  }

  // Step 6: reason selection (preserves readable Collective Redundancy note and Constructive safeguard modal)
  function handleReasonSelect(val: string) {
    setReason(val)
    setReasonError('')
    if (val === 'constructive') {
      setCollectiveVisible(false)
      setShowConstructiveModal(true)
    } else if (val === 'redundancy_collective') {
      setCollectiveVisible(true)
    } else {
      setCollectiveVisible(false)
    }
  }

  function startLoading() {
    const s = parseFloat(salary)
    const a = parseInt(age, 10)
    const y = parseInt(yearsNum || '0', 10)
    const m = parseInt(monthsNum || '0', 10)
    const o = parseFloat(offer) || 0
    const totalMonths = y * 12 + m
    const calcReason = REASON_MAP[reason || 'mutual'] || 'other'
    const disc = discrimination || 'no'
    const noticeWeeks = NOTICE_WEEKS[noticeOption || 'statutory'] || 0

    const result = getVerdict(s, totalMonths, a, o, calcReason, disc, noticeWeeks, jurisdiction, offerIncludesNotice)

    Ga4TelemetryClient.trackCalcCompleted(String(o), result.verdict === 'BELOW_MINIMUM', calcReason)
    Ga4TelemetryClient.trackVerdictViewed(result.verdict, String(o))
    setIsCalculating(true)
    onCalculateRef.current({
      inputs: {
        salary: String(s),
        yearsNum: String(y),
        monthsNum: String(m),
        age: String(a),
        offer: String(o),
        offerIncludesNotice: String(offerIncludesNotice),
        reason: calcReason,
        discrimination: disc,
        contractualNotice: String(noticeWeeks),
        jurisdiction,
      },
      result,
    })
  }

  /* ── Shared inline styles ─────────────────────────────────────── */

  const qSt: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontWeight: 420,
    fontSize: vp.keyboardOpen ? 'clamp(22px, 4.5vw, 28px)' : 'clamp(24px, 4.5vw, 30px)',
    lineHeight: 1.2,
    letterSpacing: '-0.014em',
    color: '#0B1F3A',
    margin: vp.keyboardOpen ? '0 0 8px' : '0 0 14px',
  }

  const helperSt: React.CSSProperties = {
    fontSize: vp.keyboardOpen ? 14 : 16,
    color: '#525D70',
    lineHeight: 1.55,
    margin: vp.keyboardOpen ? '0 0 12px' : '0 0 16px',
  }

  const numInputSt: React.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: 22,
    color: '#0B1F3A',
    padding: vp.keyboardOpen ? '13px 12px' : '16px 14px',
    minWidth: 0,
    fontVariantNumeric: 'tabular-nums',
    MozAppearance: 'textfield' as React.CSSProperties['MozAppearance'],
    WebkitAppearance: 'none',
  }

  const prefixSt: React.CSSProperties = {
    padding: '0 2px 0 16px',
    fontSize: 22,
    fontWeight: 500,
    color: '#525D70',
    flexShrink: 0,
    fontFamily: 'var(--font-mono)',
  }

  const suffixSt: React.CSSProperties = {
    padding: '0 16px 0 4px',
    fontSize: 16,
    color: '#525D70',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }

  const errSt: React.CSSProperties = {
    fontSize: 14,
    fontWeight: 500,
    color: '#A8341F',
    margin: '8px 0 0',
    display: 'block',
  }

  function optionSt(selected: boolean): React.CSSProperties {
    return {
      width: '100%',
      minHeight: 52,
      padding: '14px 16px',
      textAlign: 'left',
      border: `1.5px solid ${selected ? '#0B1F3A' : '#E2DCCE'}`,
      borderRadius: 10,
      fontSize: 16,
      fontFamily: 'var(--font-sans)',
      fontWeight: selected ? 500 : 400,
      cursor: 'pointer',
      background: selected ? '#0B1F3A' : '#fff',
      color: selected ? '#fff' : '#0B1F3A',
      transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
    }
  }

  const progressPct = (step / 7) * 100

  /* ── STEPS PHASE ─────────────────────────────────────────────── */

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

      {/* Header: logo (links home) + exit link + progress indicator */}
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
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', padding: '10px 8px', minHeight: 44, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#525D70', fontFamily: 'var(--font-sans)', letterSpacing: '-0.005em', flexShrink: 0 }}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 13L5 8L10 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Exit
          </button>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#525D70', letterSpacing: '-0.005em', marginBottom: 5 }}>
            Question {step} of 7
          </div>
          <div style={{ width: 96, height: 3, background: '#E2DCCE', borderRadius: 999, overflow: 'hidden', marginLeft: 'auto' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: '#D9603B', borderRadius: 999, transition: 'width 300ms ease' }} />
          </div>
        </div>
      </div>

      {/* Scrollable step content — strictly bounded between header and docked footer CTA */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          padding: vp.keyboardOpen ? '12px 18px 20px' : '20px 20px 32px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: 480, opacity: stepVisible ? 1 : 0, transition: 'opacity 150ms ease' }}>

          {/* ── STEP 1: Annual salary ── */}
          {step === 1 && (
            <div>
              <h2 id="step-heading-1" style={qSt}>What is your annual salary?</h2>
              <p style={helperSt}>
                Use your basic salary before tax. Bonus and commission are not included in the statutory calculation.
              </p>
              <div className={`step-input-wrap${shake && salaryError ? ' sc-shake' : ''}`}>
                <span style={prefixSt}>£</span>
                <input
                  ref={salaryRef}
                  id="step-input-1"
                  aria-labelledby="step-heading-1"
                  aria-invalid={!!salaryError}
                  aria-describedby={salaryError ? 'step-error-1' : undefined}
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="done"
                  placeholder="42,000"
                  value={formatCurrencyInput(salary)}
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={e => { setSalary(cleanCurrencyInput(e.target.value)); setSalaryError('') }}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                  style={numInputSt}
                />
              </div>
              {salaryError && (
                <span id="step-error-1" role="alert" style={errSt}>{salaryError}</span>
              )}
              <div style={{ marginTop: vp.keyboardOpen ? 14 : 22, paddingTop: vp.keyboardOpen ? 12 : 16, borderTop: '1px solid #E2DCCE' }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0B1F3A', marginBottom: 8 }}>
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
                      borderRadius: 8,
                      border: `1.5px solid ${jurisdiction === 'GB' ? '#0B1F3A' : '#E2DCCE'}`,
                      background: jurisdiction === 'GB' ? '#0B1F3A' : '#ffffff',
                      color: jurisdiction === 'GB' ? '#ffffff' : '#0B1F3A',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>England, Scotland &amp; Wales</div>
                    <div style={{ fontSize: 12, opacity: jurisdiction === 'GB' ? 0.9 : 0.78, marginTop: 3 }}>
                      £751/wk statutory cap
                    </div>
                  </button>
                  <button
                    type="button"
                    aria-pressed={jurisdiction === 'NI'}
                    onClick={() => setJurisdiction('NI')}
                    style={{
                      padding: '12px',
                      minHeight: 56,
                      borderRadius: 8,
                      border: `1.5px solid ${jurisdiction === 'NI' ? '#0B1F3A' : '#E2DCCE'}`,
                      background: jurisdiction === 'NI' ? '#0B1F3A' : '#ffffff',
                      color: jurisdiction === 'NI' ? '#ffffff' : '#0B1F3A',
                      fontSize: 14,
                      fontWeight: 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.3 }}>Northern Ireland</div>
                    <div style={{ fontSize: 12, opacity: jurisdiction === 'NI' ? 0.9 : 0.78, marginTop: 3 }}>
                      £783/wk statutory cap
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2: Age ── */}
          {step === 2 && (
            <div>
              <h2 id="step-heading-2" style={qSt}>How old are you?</h2>
              <p style={helperSt}>
                Your age determines which statutory multiplier applies to your calculation.
              </p>
              <div className={`step-input-wrap${shake && ageError ? ' sc-shake' : ''}`}>
                <input
                  ref={ageRef}
                  id="step-input-2"
                  aria-labelledby="step-heading-2"
                  aria-invalid={!!ageError}
                  aria-describedby={ageError ? 'step-error-2' : undefined}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={3}
                  enterKeyHint="done"
                  placeholder="38"
                  value={age}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={e => { setAge(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')); setAgeError('') }}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                  style={{ ...numInputSt, paddingLeft: 16 }}
                />
                <span style={suffixSt}>years old</span>
              </div>
              {ageError && <span id="step-error-2" role="alert" style={errSt}>{ageError}</span>}
            </div>
          )}

          {/* ── STEP 3: Length of service ── */}
          {step === 3 && (
            <div>
              <h2 id="step-heading-3" style={qSt}>How long have you worked there?</h2>
              <p style={helperSt}>
                Count from your contract start date. Complete years and months both factor into your estimate.
              </p>
              <div className={shake && serviceError ? 'sc-shake' : ''} style={{ display: 'flex', gap: 12 }}>
                <div className="step-input-wrap" style={{ flex: 1 }}>
                  <input
                    ref={yearsRef}
                    id="step-input-3"
                    aria-label="Years of service"
                    aria-invalid={!!serviceError}
                    aria-describedby={serviceError ? 'step-error-3' : undefined}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    enterKeyHint="next"
                    placeholder="6"
                    value={yearsNum}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={e => { setYearsNum(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')); setServiceError('') }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') { e.preventDefault(); monthsRef.current?.focus() }
                    }}
                    style={{ ...numInputSt, paddingLeft: 16 }}
                  />
                  <span style={suffixSt}>years</span>
                </div>
                <div className="step-input-wrap" style={{ flex: 1 }}>
                  <input
                    ref={monthsRef}
                    id="step-input-3b"
                    aria-label="Additional months of service"
                    aria-invalid={!!serviceError}
                    aria-describedby={serviceError ? 'step-error-3' : undefined}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={2}
                    enterKeyHint="done"
                    placeholder="4"
                    value={monthsNum}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={e => { setMonthsNum(e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')); setServiceError('') }}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={{ ...numInputSt, paddingLeft: 16 }}
                  />
                  <span style={suffixSt}>months</span>
                </div>
              </div>
              {serviceError && <span id="step-error-3" role="alert" style={errSt}>{serviceError}</span>}
            </div>
          )}

          {/* ── STEP 4: Settlement offered ── */}
          {step === 4 && (
            <div>
              <h2 id="step-heading-4" style={qSt}>What has your employer offered?</h2>
              <p style={helperSt}>
                Enter the total figure from your letter or email.
              </p>
              <div className="step-input-wrap">
                <span style={prefixSt}>£</span>
                <input
                  ref={offerRef}
                  id="step-input-4"
                  aria-labelledby="step-heading-4"
                  type="text"
                  inputMode="numeric"
                  enterKeyHint="done"
                  placeholder="18,000"
                  value={formatCurrencyInput(offer)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={e => { setOffer(cleanCurrencyInput(e.target.value)); setOfferWarning('') }}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                  style={numInputSt}
                />
              </div>
              {offerWarning && (
                <span role="alert" style={{ ...errSt, color: '#9A6B16' }}>{offerWarning}</span>
              )}

              <button
                type="button"
                onClick={() => {
                  setOffer('0')
                  setOfferWarning('')
                  goToStep(5)
                }}
                style={{
                  marginTop: 12,
                  width: '100%',
                  minHeight: 48,
                  padding: '13px 16px',
                  background: '#ffffff',
                  border: '1.5px solid #E2DCCE',
                  borderRadius: 10,
                  color: '#0B1F3A',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span>I haven&apos;t received an offer yet</span>
                <span style={{ color: '#C24D29', fontSize: 16 }} aria-hidden="true">→</span>
              </button>

              {/* SC-B-020: Notice pay inclusion toggle */}
              {parseFloat(offer) > 0 && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: '#fff', border: '1px solid #E2DCCE', borderRadius: 12 }}>
                  <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: '#0B1F3A', marginBottom: 4 }}>
                    Does this £{Number(offer).toLocaleString('en-GB')} include your notice pay?
                  </label>
                  <p style={{ fontSize: 14, color: '#525D70', margin: '0 0 12px', lineHeight: 1.5 }}>
                    Notice pay is taxed differently from compensation, so this helps us estimate your take-home pay.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <button
                      type="button"
                      aria-pressed={offerIncludesNotice}
                      onClick={() => setOfferIncludesNotice(true)}
                      style={{
                        ...optionSt(offerIncludesNotice),
                        minHeight: 48,
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>Yes, included</span>
                      {offerIncludesNotice && <Tick />}
                    </button>
                    <button
                      type="button"
                      aria-pressed={!offerIncludesNotice}
                      onClick={() => setOfferIncludesNotice(false)}
                      style={{
                        ...optionSt(!offerIncludesNotice),
                        minHeight: 48,
                        padding: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 14, fontWeight: 600 }}>No, paid on top</span>
                      {!offerIncludesNotice && <Tick />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* -- STEP 5: Notice period (tappable list: NO keyboard) -- */}
          {step === 5 && (
            <div>
              <h2 style={qSt}>What does your contract say about your notice period?</h2>
              <p style={helperSt}>
                Check your written employment contract if you have it to hand.
              </p>
              <div className={shake && !noticeOption ? 'sc-shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {([
                  { value: 'statutory', label: 'Statutory only (1 week per year of service, max 12)' },
                  { value: '1m_or_less', label: '1 month or less' },
                  { value: '2_3m',      label: '2 to 3 months' },
                  { value: '4_6m',      label: '4 to 6 months' },
                  { value: '6plus',     label: 'More than 6 months' },
                  { value: 'unsure',    label: 'I am not sure' },
                ] as const).map(opt => (
                  <button key={opt.value} type="button" aria-pressed={noticeOption === opt.value} onClick={() => handleNoticeSelect(opt.value)} style={optionSt(noticeOption === opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {noticeError && <span role="alert" style={errSt}>{noticeError}</span>}
            </div>
          )}

          {/* -- STEP 6: Reason for leaving (tappable list: NO keyboard) -- */}
          {step === 6 && (
            <div>
              <h2 style={qSt}>Why is your employment ending?</h2>
              <p style={helperSt}>This helps us show which statutory rules apply to your situation.</p>
              <div className={shake && !reason ? 'sc-shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {([
                  { value: 'redundancy_individual', label: 'Redundancy' },
                  { value: 'redundancy_collective', label: 'Redundancy: part of a larger group (20 or more people)' },
                  { value: 'performance', label: 'Performance or disciplinary process' },
                  { value: 'constructive', label: 'Constructive dismissal' },
                  { value: 'mutual', label: 'Mutual agreement' },
                  { value: 'unsure', label: 'I am not sure' },
                ] as const).map(opt => (
                  <button key={opt.value} type="button" aria-pressed={reason === opt.value} onClick={() => handleReasonSelect(opt.value)} style={optionSt(reason === opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {reasonError && <span role="alert" style={errSt}>{reasonError}</span>}
              {/* Collective redundancy note: stays visible until user taps Continue */}
              <div style={{
                maxHeight: collectiveVisible ? 140 : 0,
                overflow: 'hidden',
                opacity: collectiveVisible ? 1 : 0,
                transition: 'max-height 300ms ease, opacity 250ms ease',
              }}>
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(217,96,59,0.08)', borderRadius: 8, border: '1px solid rgba(217,96,59,0.25)' }}>
                  <p style={{ fontSize: 14, color: '#0B1F3A', margin: 0, lineHeight: 1.5 }}>
                    You may be entitled to a Protective Award of up to 90 days pay if your employer failed to consult properly. We will show this in your results.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: Discrimination (NO auto-advance) ── */}
          {step === 7 && (
            <div>
              <h2 style={qSt}>Was discrimination involved?</h2>
              <p style={helperSt}>
                For example, being treated differently due to age, gender, race, disability, pregnancy, or another protected characteristic. Choose &ldquo;Not sure&rdquo; if you are uncertain.
              </p>
              {/* 56px minimum tap targets: higher than standard 48px due to consequence of mis-tap */}
              <div className={shake && !discrimination ? 'sc-shake' : ''} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {([
                  { value: 'no', label: 'No' },
                  { value: 'not_sure', label: 'Not sure' },
                  { value: 'yes', label: 'Yes' },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={discrimination === opt.value}
                    onClick={() => { setDiscrimination(opt.value); setDiscriminationError('') }}
                    style={{ ...optionSt(discrimination === opt.value), minHeight: 56 }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {discriminationError && <span role="alert" style={errSt}>{discriminationError}</span>}
            </div>
          )}

          {/* Fee contribution note shown only on final step so it never clips behind sticky CTA on mid-flow steps */}
          {step === 7 && (
            <div style={{ marginTop: 24 }}>
              <LegalFeeShieldBadge className="w-full" />
            </div>
          )}

        </div>
      </div>

      {/* Docked footer advance bar — in normal flex flow so it NEVER overlaps content */}
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
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
          <button
            type="button"
            disabled={isCalculating}
            onClick={advance}
            style={{
              width: '100%', background: isCalculating ? '#525D70' : '#C24D29', border: 'none', color: '#fff',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
              letterSpacing: '-0.005em', minHeight: 50, padding: vp.keyboardOpen ? '13px 20px' : '15px 24px', borderRadius: 10,
              cursor: isCalculating ? 'wait' : 'pointer', marginBottom: step === 4 ? 4 : (step > 1 ? 2 : 0),
            }}
          >
            {isCalculating ? 'Calculating your estimate…' : getAdvanceCopy()}
          </button>

          {/* Step 4 midpoint copy: position below advance button */}
          {step === 4 && !vp.keyboardOpen && (
            <p style={{ fontSize: 14, color: '#525D70', textAlign: 'center', margin: '0 0 2px' }}>
              You are nearly there. Three more questions.
            </p>
          )}

          {/* Back link: 44px minimum mobile tap target from Step 2 onwards */}
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                setCollectiveVisible(false)
                goToStep(step - 1)
              }}
              style={{
                background: 'none', border: 'none', color: '#525D70',
                fontSize: 14, fontWeight: 500, cursor: 'pointer', padding: '10px 16px',
                minHeight: 44, fontFamily: 'var(--font-sans)', display: 'inline-flex',
                alignItems: 'center', gap: 4,
              }}
            >
              <BackIcon /> Back
            </button>
          )}
        </div>
      </div>

      {/* SC-B-009: Constructive Dismissal Safeguard Modal */}
      {showConstructiveModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="constructive-modal-title"
          style={{
          position: 'fixed',
          inset: 0,
          zIndex: 100,
          background: 'rgba(11, 31, 58, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 16,
            maxWidth: 480,
            width: '100%',
            maxHeight: '90dvh',
            overflowY: 'auto',
            padding: '24px 20px 20px',
            boxShadow: '0 20px 40px rgba(11,31,58,0.25)',
            border: '2px solid #D9603B',
            animation: 'sc-fade-in 200ms ease forwards',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{
                background: 'rgba(217, 96, 59, 0.12)',
                color: '#A8341F',
                fontSize: 12,
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '4px 10px',
                borderRadius: 999,
              }}>
                Critical Legal Safeguard
              </span>
            </div>

            <h3 id="constructive-modal-title" style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 22,
              fontWeight: 600,
              color: '#0B1F3A',
              margin: '0 0 12px',
              lineHeight: 1.25,
            }}>
              Important statutory context before resigning
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#525D70', lineHeight: 1.55, marginBottom: 20 }}>
              <p style={{ margin: 0 }}>
                Ministry of Justice employment tribunal data shows <strong style={{ color: '#0B1F3A' }}>over 95% of constructive dismissal claims fail</strong> when employees resign prematurely without specialist legal advice.
              </p>
              <p style={{ margin: 0 }}>
                Once you resign, your employer no longer faces ongoing payroll liabilities, which significantly weakens your standing.
              </p>
              <p style={{ margin: 0, padding: '10px 12px', background: '#F7F4EE', borderRadius: 8, border: '1px solid #E2DCCE' }}>
                <strong style={{ color: '#0B1F3A' }}>Your position is strongest while still employed.</strong> In most cases, an SRA-regulated solicitor can negotiate an exit package on your behalf while protecting your salary.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => {
                  setShowConstructiveModal(false)
                  goToStep(7)
                }}
                style={{
                  width: '100%',
                  background: '#C24D29',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  minHeight: 48,
                  padding: '14px 18px',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'center',
                }}
              >
                I understand: continue calculation →
              </button>

              <a
                href="/guides/constructive-dismissal-settlement-agreements/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  minHeight: 44,
                  background: 'transparent',
                  color: '#0B1F3A',
                  border: '1.5px solid #E2DCCE',
                  borderRadius: 10,
                  padding: '12px 18px',
                  fontSize: 14,
                  fontWeight: 500,
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-sans)',
                  boxSizing: 'border-box',
                }}
              >
                Read constructive dismissal advice guide ↗
              </a>

              <button
                type="button"
                onClick={() => {
                  setShowConstructiveModal(false)
                  setReason(null)
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#525D70',
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: 44,
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                Choose a different reason
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
