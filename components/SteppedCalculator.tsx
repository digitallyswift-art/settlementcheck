'use client'

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react'
import Link from 'next/link'
import { getVerdict, VerdictResult } from '@/lib/calculations'

export interface CalcPayload {
  inputs: {
    salary: string
    yearsNum: string
    monthsNum: string
    age: string
    offer: string
    reason: string
    discrimination: string
    contractualNotice: string
  }
  result: VerdictResult
}

interface Props {
  onCalculate: (payload: CalcPayload) => void
}

export interface SteppedCalculatorHandle {
  start: () => void
}

// Notice option → contractual notice weeks (ERA 1996 s.86)
const NOTICE_WEEKS: Record<string, number> = {
  statutory: 0, '4w': 4, '6w': 6, '8w': 8, '3m': 13, '6m': 26, '12m': 52, unsure: 0,
}

// Step 6 reason → calculation engine reason type
const REASON_MAP: Record<string, string> = {
  redundancy_individual: 'redundancy',
  redundancy_collective: 'redundancy_collective', // triggers protective award in engine
  performance: 'dismissal',
  constructive: 'dismissal',
  mutual: 'mutual',
  unsure: 'other',
}

// ERA 1996 s.227 (GB) / ERO(NI) 1996 — April 2025 rates
const WEEKLY_CAP = { GB: 751, NI: 783 }

type Phase = 'entry' | 'steps' | 'loading'
type LoadState = 1 | 2 | 3

/* ── Sub-components ─────────────────────────────────────────────── */

function LogoMark() {
  return (
    <Link href="/" aria-label="SettlementCheck home" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.5" />
        <path d="M6 11.5L9.5 15L16 7.5" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 420, letterSpacing: '-0.01em', lineHeight: 1 }}>
        <span style={{ color: '#D9603B' }}>Settlement</span><span style={{ color: '#0B1F3A' }}>Check</span>
      </span>
    </Link>
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

const SteppedCalculator = forwardRef<SteppedCalculatorHandle, Props>(function SteppedCalculator({ onCalculate }, ref) {
  const [phase, setPhase] = useState<Phase>('entry')
  const [step, setStep] = useState(1)
  const [stepVisible, setStepVisible] = useState(true)
  const [shake, setShake] = useState(false)

  // Form values
  const [salary, setSalary] = useState('')
  const [age, setAge] = useState('')
  const [ageError, setAgeError] = useState('')
  const [yearsNum, setYearsNum] = useState('')
  const [monthsNum, setMonthsNum] = useState('')
  const [offer, setOffer] = useState('')
  const [offerWarning, setOfferWarning] = useState('')
  const [noticeOption, setNoticeOption] = useState<string | null>(null)
  const [reason, setReason] = useState<string | null>(null)
  const [collectiveVisible, setCollectiveVisible] = useState(false)
  const [discrimination, setDiscrimination] = useState<string | null>(null)

  // Loading animation state
  const [loadState, setLoadState] = useState<LoadState>(1)
  const [progressComplete, setProgressComplete] = useState(false) // bar has reached 100%
  const [readyToReveal, setReadyToReveal] = useState(false)       // "Your results are ready."
  const [fadeOut, setFadeOut] = useState(false)                    // crossfade to results
  const pendingPayload = useRef<CalcPayload | null>(null)
  const onCalculateRef = useRef(onCalculate)
  useEffect(() => { onCalculateRef.current = onCalculate }, [onCalculate])

  useImperativeHandle(ref, () => ({
    start() {
      setPhase('steps')
    },
  }))

  // Jurisdiction — best-effort default to GB (~96% of users)
  const jurisdiction: 'GB' | 'NI' = 'GB'
  const weeklyCapAmount = WEEKLY_CAP[jurisdiction]

  // Refs for auto-focus
  const salaryRef = useRef<HTMLInputElement>(null)
  const ageRef = useRef<HTMLInputElement>(null)
  const yearsRef = useRef<HTMLInputElement>(null)
  const monthsRef = useRef<HTMLInputElement>(null)
  const offerRef = useRef<HTMLInputElement>(null)

  // Advance button container ref for keyboard avoidance
  const advanceBtnRef = useRef<HTMLDivElement>(null)

  // Lock body scroll during step/loading overlay
  useEffect(() => {
    if (phase === 'steps' || phase === 'loading') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [phase])

  // visualViewport API — keep advance button above keyboard on iOS and Android
  // Per spec: translateY(-keyboardHeight) moves button above keyboard
  useEffect(() => {
    if (phase !== 'steps') return
    if (typeof window === 'undefined' || !window.visualViewport) return
    const btn = advanceBtnRef.current

    const handleResize = () => {
      if (!window.visualViewport || !btn) return
      const keyboardH = Math.max(0, window.innerHeight - window.visualViewport.height)
      btn.style.transform = `translateY(-${keyboardH}px)`
    }

    window.visualViewport.addEventListener('resize', handleResize)
    return () => window.visualViewport?.removeEventListener('resize', handleResize)
  }, [phase])

  // Reset keyboard transform when step changes (keyboard dismisses between steps)
  useEffect(() => {
    if (advanceBtnRef.current) advanceBtnRef.current.style.transform = 'translateY(0px)'
  }, [step])

  // Auto-focus inputs on steps 1–4 (per spec: setTimeout(..., 100))
  // Steps 5, 6, 7 have no inputs — no auto-focus, no keyboard appears
  useEffect(() => {
    if (phase !== 'steps') return
    const map: Record<number, React.RefObject<HTMLInputElement | null>> = {
      1: salaryRef, 2: ageRef, 3: yearsRef, 4: offerRef,
    }
    const ref = map[step]
    if (!ref) return
    const t = setTimeout(() => {
      ref.current?.focus()
      // Bring input into view in case scroll container moved
      ref.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    }, 100)
    return () => clearTimeout(t)
  }, [step, phase])

  // Loading animation — full sequence per spec Section 4
  // t=0:    Copy state 1 visible, progress bar CSS animation begins (0→100% over 4s)
  // t=1.4s: Copy cycles to state 2 (200ms opacity fade via React key)
  // t=2.8s: Copy cycles to state 3
  // t=4.0s: Progress bar reaches 100%, hold 300ms
  // t=4.3s: "Your results are ready." holdframe begins
  // t=4.9s: Crossfade starts (opacity 1→0 over 400ms)
  // t=5.3s: Navigate — minimum total duration: 5.3s (well above 3s spec minimum)
  useEffect(() => {
    if (phase !== 'loading') return
    setLoadState(1)
    setProgressComplete(false)
    setReadyToReveal(false)
    setFadeOut(false)

    const timers = [
      setTimeout(() => setLoadState(2), 1400),
      setTimeout(() => setLoadState(3), 2800),
      setTimeout(() => setProgressComplete(true), 4000),
      setTimeout(() => setReadyToReveal(true), 4300),
      setTimeout(() => setFadeOut(true), 4900),
      setTimeout(() => {
        if (pendingPayload.current) onCalculateRef.current(pendingPayload.current)
      }, 5300),
    ]

    return () => timers.forEach(clearTimeout)
  }, [phase])

  /* ── Helpers ──────────────────────────────────────────────────── */

  function goToStep(next: number) {
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
    if (step === 3) return 'That is how long I have worked there'
    if (step === 4) {
      const o = parseFloat(offer)
      return (!offer || isNaN(o) || o === 0) ? 'No offer made yet' : 'That is what they have offered'
    }
    if (step === 5) return noticeOption === 'unsure' ? 'I am not sure' : 'That is my notice period'
    if (step === 6) return 'That is my situation'
    // Step 7
    if (discrimination === 'not_sure') return 'I am not sure'
    if (discrimination === 'yes') return 'Yes, this may apply'
    return 'That is my situation'
  }

  function advance() {
    if (step === 1) {
      const s = parseFloat(salary)
      if (!salary || isNaN(s) || s <= 0) { triggerShake(); return }
      goToStep(2)
    } else if (step === 2) {
      const a = parseInt(age, 10)
      if (!age || isNaN(a) || a < 16 || a > 80) {
        setAgeError('Please check the age you have entered.')
        triggerShake()
        return
      }
      setAgeError('')
      goToStep(3)
    } else if (step === 3) {
      goToStep(4)
    } else if (step === 4) {
      // Monthly salary detection warning
      const o = parseFloat(offer)
      const s = parseFloat(salary)
      if (!isNaN(o) && !isNaN(s) && s > 0 && o > 0) {
        const monthly = s / 12
        if (Math.abs(o - monthly) / monthly < 0.05) {
          setOfferWarning('Just to confirm: is this the total settlement figure, not a monthly amount?')
        }
      }
      goToStep(5)
    } else if (step === 5) {
      goToStep(6)
    } else if (step === 6) {
      goToStep(7)
    } else if (step === 7) {
      startLoading()
    }
  }

  // Step 5: notice selection with 300ms auto-advance
  function handleNoticeSelect(val: string) {
    setNoticeOption(val)
    setTimeout(() => goToStep(6), 300)
  }

  // Step 6: reason selection with 300ms auto-advance
  function handleReasonSelect(val: string) {
    setReason(val)
    if (val === 'redundancy_collective') {
      setTimeout(() => setCollectiveVisible(true), 50)
    } else {
      setCollectiveVisible(false)
    }
    setTimeout(() => goToStep(7), 300)
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

    const result = getVerdict(s, totalMonths, a, o, calcReason, disc, noticeWeeks, jurisdiction)

    pendingPayload.current = {
      inputs: {
        salary: String(s),
        yearsNum: String(y),
        monthsNum: String(m),
        age: String(a),
        offer: String(o),
        reason: calcReason,
        discrimination: disc,
        contractualNotice: String(noticeWeeks),
      },
      result,
    }
    setPhase('loading')
  }

  /* ── Shared inline styles ─────────────────────────────────────── */

  const qSt: React.CSSProperties = {
    fontFamily: 'var(--font-serif)',
    fontWeight: 420,
    fontSize: 'clamp(22px, 4vw, 28px)',
    lineHeight: 1.2,
    letterSpacing: '-0.014em',
    color: '#0B1F3A',
    margin: '0 0 16px',
  }

  const helperSt: React.CSSProperties = {
    fontSize: 14,
    color: '#5B6577',
    lineHeight: 1.6,
    margin: '0 0 14px',
  }

  const numInputSt: React.CSSProperties = {
    flex: 1,
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontFamily: 'var(--font-sans)',
    fontSize: 22,
    color: '#0B1F3A',
    padding: '16px 14px',
    minWidth: 0,
    MozAppearance: 'textfield' as React.CSSProperties['MozAppearance'],
    WebkitAppearance: 'none',
  }

  const prefixSt: React.CSSProperties = {
    padding: '0 2px 0 16px',
    fontSize: 22,
    fontWeight: 400,
    color: '#9AA3AE',
    flexShrink: 0,
    fontFamily: 'var(--font-mono)',
  }

  const suffixSt: React.CSSProperties = {
    padding: '0 16px 0 4px',
    fontSize: 15,
    color: '#9AA3AE',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  }

  const errSt: React.CSSProperties = {
    fontSize: 13,
    color: '#C0392B',
    margin: '8px 0 0',
    display: 'block',
  }

  function optionSt(selected: boolean): React.CSSProperties {
    return {
      width: '100%',
      minHeight: 48,
      padding: '14px 16px',
      textAlign: 'left',
      border: `1.5px solid ${selected ? '#0B1F3A' : '#E2DCCE'}`,
      borderRadius: 10,
      fontSize: 15,
      fontFamily: 'var(--font-sans)',
      fontWeight: selected ? 500 : 400,
      cursor: 'pointer',
      background: selected ? '#0B1F3A' : '#fff',
      color: selected ? '#fff' : '#0B1F3A',
      transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
    }
  }

  const progressPct = (step / 7) * 100
  const yearsDisplay = parseInt(yearsNum || '0', 10)
  const offerNum = parseFloat(offer) || 0

  /* ── ENTRY PHASE ─────────────────────────────────────────────── */

  if (phase === 'entry') {
    return (
      <div style={{
        borderRadius: 20,
        border: '1px solid rgba(11,31,58,0.10)',
        overflow: 'hidden',
        boxShadow: '0 24px 60px -12px rgba(11,31,58,0.22), 0 8px 24px -6px rgba(11,31,58,0.10)',
        background: 'linear-gradient(170deg, #F5F1E9 0%, #EDE8DF 30%, #E8E2D8 60%, #F0EDE6 100%)',
        padding: '36px 36px 32px',
      }}>
        <span style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A93A3', marginBottom: 20 }}>
          Free calculator
        </span>

        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 420, lineHeight: 1.3, color: '#0B1F3A', margin: '0 0 8px', letterSpacing: '-0.012em' }}>
          Most people do not know if their offer is fair.{' '}
          <em style={{ fontStyle: 'italic', color: '#D9603B' }}>This tells you.</em>
        </p>

        <p style={{ fontSize: 15, color: '#5B6577', margin: '0 0 24px', lineHeight: 1.55 }}>
          Seven questions. Sixty seconds. No email required.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {['Private and secure', 'Built on UK statute', 'No email needed to see your result'].map(label => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(217,96,59,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Tick />
              </div>
              <span style={{ fontSize: 14, color: '#4A5568' }}>{label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase('steps')}
          style={{
            width: '100%', background: '#D9603B', border: 'none', color: '#fff',
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
            letterSpacing: '-0.005em', padding: '15px 24px', borderRadius: 10,
            cursor: 'pointer', marginBottom: 14,
          }}
        >
          Check my offer →
        </button>

        <p style={{ fontSize: 12, color: '#9AA3AE', textAlign: 'center', margin: 0, lineHeight: 1.55 }}>
          No data is sold. No solicitor will call unless you ask.
        </p>
      </div>
    )
  }


  /* ── LOADING PHASE ───────────────────────────────────────────── */

  if (phase === 'loading') {
    const copyCycles: Record<LoadState, string> = {
      1: `Checking your ${yearsDisplay} ${yearsDisplay === 1 ? 'year' : 'years'} of service against 2026 statutory rates…`,
      2: `Calculating your redundancy entitlement at £${weeklyCapAmount.toLocaleString('en-GB')} per week…`,
      3: offerNum > 0
        ? `Comparing your offer of £${offerNum.toLocaleString('en-GB')} against typical outcomes…`
        : 'Establishing your minimum entitlement…',
    }

    // aria-valuenow steps with each visible milestone
    const progressNow = progressComplete ? 100 : loadState === 3 ? 70 : loadState === 2 ? 35 : 5

    return (
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 100, background: '#F7F4EE',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 28, padding: '24px',
          // Crossfade: fade to 0 over 400ms when fadeOut triggers (t=4.9s)
          opacity: fadeOut ? 0 : 1,
          transition: 'opacity 400ms ease',
        }}
        aria-label="Calculating your settlement results"
      >
        {/* Static logo mark — no animation */}
        <LogoMark />

        {/* Cycling text — React key causes remount → sc-fade-in animation fires on each change */}
        <p
          key={readyToReveal ? 'ready' : loadState}
          aria-live="polite"
          style={{
            fontFamily: 'var(--font-serif)',
            // "Your results are ready." is larger/bolder — headline style per spec
            fontSize: readyToReveal ? 22 : 18,
            fontWeight: readyToReveal ? 460 : 420,
            lineHeight: 1.45,
            color: '#0B1F3A',
            textAlign: 'center',
            maxWidth: 340,
            margin: 0,
            minHeight: '2.8em',
            animation: 'sc-fade-in 200ms ease forwards',
          }}
        >
          {readyToReveal ? 'Your results are ready.' : copyCycles[loadState]}
        </p>

        {/* Progress line: 200px mobile, 280px desktop (CSS override in globals.css)
            Fills left to right over 4 seconds, ease-in-out — CSS animation only, no JS library */}
        <div
          style={{ height: 3, background: '#E2DCCE', borderRadius: 999, overflow: 'hidden', width: 200 }}
          className="sc-progress-wrap"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressNow}
        >
          <div style={{
            height: '100%',
            background: '#D9603B',
            borderRadius: 999,
            animation: 'sc-loading-bar 4s ease-in-out forwards',
          }} />
        </div>

        {/* Static trust line — always visible, never animated */}
        <p style={{ fontSize: 13, color: '#8A93A3', textAlign: 'center', margin: 0 }}>
          Your result is calculated using verified 2026 UK statutory rates.
        </p>
      </div>
    )
  }

  /* ── STEPS PHASE ─────────────────────────────────────────────── */

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: '#F7F4EE', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Header: logo (static, top left) + progress indicator (top right) */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '20px 24px', flexShrink: 0 }}>
        <LogoMark />
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#5B6577', letterSpacing: '-0.005em', marginBottom: 6 }}>
            Question {step} of 7
          </div>
          <div style={{ width: 120, height: 3, background: '#E2DCCE', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: '#D9603B', borderRadius: 999, transition: 'width 300ms ease' }} />
          </div>
        </div>
      </div>

      {/* Scrollable step content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px 160px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 480, opacity: stepVisible ? 1 : 0, transition: 'opacity 150ms ease' }}>

          {/* ── STEP 1: Annual salary ── */}
          {step === 1 && (
            <div>
              <h2 style={qSt}>What is your annual salary?</h2>
              <p style={helperSt}>
                Use your basic salary before tax. Bonus and commission are not included in the statutory calculation.
              </p>
              <div className={`step-input-wrap${shake ? ' sc-shake' : ''}`}>
                <span style={prefixSt}>£</span>
                <input
                  ref={salaryRef}
                  id="step-input-1"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  enterKeyHint="done"
                  placeholder="42,000"
                  value={salary}
                  autoComplete="off"
                  autoCorrect="off"
                  onChange={e => setSalary(e.target.value.replace(/[^0-9]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                  style={numInputSt}
                />
              </div>
              {shake && (!salary || parseFloat(salary) <= 0) && (
                <span style={errSt}>Please enter your salary to continue.</span>
              )}
            </div>
          )}

          {/* ── STEP 2: Age ── */}
          {step === 2 && (
            <div>
              <p style={helperSt}>
                UK law applies different redundancy multipliers at ages 22 and 41. Your age directly affects your statutory entitlement.
              </p>
              <h2 style={qSt}>How old are you?</h2>
              <div className={`step-input-wrap${shake && ageError ? ' sc-shake' : ''}`}>
                <input
                  ref={ageRef}
                  id="step-input-2"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  enterKeyHint="done"
                  placeholder="38"
                  value={age}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={e => { setAge(e.target.value.replace(/[^0-9]/g, '')); setAgeError('') }}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                  style={{ ...numInputSt, paddingLeft: 16 }}
                />
                <span style={suffixSt}>years old</span>
              </div>
              {ageError && <span style={errSt}>{ageError}</span>}
            </div>
          )}

          {/* ── STEP 3: Length of service ── */}
          {step === 3 && (
            <div>
              <p style={helperSt}>
                Count from your contract start date. Only complete years count toward statutory redundancy pay, but months affect other parts of your calculation.
              </p>
              <h2 style={qSt}>How long have you worked there?</h2>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="step-input-wrap" style={{ flex: 1 }}>
                  <input
                    ref={yearsRef}
                    id="step-input-3"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="next"
                    placeholder="6"
                    value={yearsNum}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={e => setYearsNum(e.target.value.replace(/[^0-9]/g, ''))}
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
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    enterKeyHint="done"
                    placeholder="4"
                    value={monthsNum}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="none"
                    spellCheck={false}
                    onChange={e => setMonthsNum(e.target.value.replace(/[^0-9]/g, ''))}
                    onKeyDown={e => e.key === 'Enter' && advance()}
                    style={{ ...numInputSt, paddingLeft: 16 }}
                  />
                  <span style={suffixSt}>months</span>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Settlement offered ── */}
          {step === 4 && (
            <div>
              <p style={helperSt}>
                Enter the total figure as presented. If no offer has been made yet, enter 0 and we will show you what to expect.
              </p>
              <h2 style={qSt}>What has your employer offered?</h2>
              <div className="step-input-wrap">
                <span style={prefixSt}>£</span>
                <input
                  ref={offerRef}
                  id="step-input-4"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  enterKeyHint="done"
                  placeholder="18,000"
                  value={offer}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  onChange={e => { setOffer(e.target.value.replace(/[^0-9]/g, '')); setOfferWarning('') }}
                  onKeyDown={e => e.key === 'Enter' && advance()}
                  style={numInputSt}
                />
              </div>
              {offerWarning && (
                <span style={{ ...errSt, color: '#B5802A' }}>{offerWarning}</span>
              )}
            </div>
          )}

          {/* ── STEP 5: Notice period (tappable list — NO keyboard) ── */}
          {step === 5 && (
            <div>
              <p style={helperSt}>
                Check your written contract, not what your manager said. The written term governs what you are owed.
              </p>
              <h2 style={qSt}>What does your contract say about your notice period?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {([
                  { value: 'statutory', label: 'Statutory only (1 week per year, max 12)' },
                  { value: '4w', label: '4 weeks' },
                  { value: '6w', label: '6 weeks' },
                  { value: '8w', label: '8 weeks' },
                  { value: '3m', label: '3 months' },
                  { value: '6m', label: '6 months' },
                  { value: '12m', label: '12 months' },
                  { value: 'unsure', label: 'I am not sure' },
                ] as const).map(opt => (
                  <button key={opt.value} type="button" onClick={() => handleNoticeSelect(opt.value)} style={optionSt(noticeOption === opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 6: Reason for leaving (tappable list — NO keyboard) ── */}
          {step === 6 && (
            <div>
              <p style={helperSt}>This affects which entitlements apply to your situation.</p>
              <h2 style={qSt}>Why is your employment ending?</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {([
                  { value: 'redundancy_individual', label: 'Redundancy' },
                  { value: 'redundancy_collective', label: 'Redundancy: part of a larger group (20 or more people)' },
                  { value: 'performance', label: 'Performance or disciplinary process' },
                  { value: 'constructive', label: 'Constructive dismissal' },
                  { value: 'mutual', label: 'Mutual agreement' },
                  { value: 'unsure', label: 'I am not sure' },
                ] as const).map(opt => (
                  <button key={opt.value} type="button" onClick={() => handleReasonSelect(opt.value)} style={optionSt(reason === opt.value)}>
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Collective redundancy note — fades in before advancing */}
              <div style={{
                maxHeight: collectiveVisible ? 100 : 0,
                overflow: 'hidden',
                opacity: collectiveVisible ? 1 : 0,
                transition: 'max-height 400ms ease, opacity 300ms ease',
              }}>
                <div style={{ marginTop: 12, padding: '12px 16px', background: 'rgba(217,96,59,0.07)', borderRadius: 8, border: '1px solid rgba(217,96,59,0.2)' }}>
                  <p style={{ fontSize: 13, color: '#5B6577', margin: 0, lineHeight: 1.55 }}>
                    You may be entitled to a Protective Award of up to 90 days pay if your employer failed to consult properly. We will show this in your results.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 7: Discrimination (NO auto-advance) ── */}
          {step === 7 && (
            <div>
              {/* CRITICAL: helper text ABOVE the options */}
              <p style={helperSt}>
                Were you treated differently because of age, gender, race, disability, pregnancy, or another protected characteristic?
              </p>
              <p style={{ ...helperSt, marginTop: -6 }}>
                If you are not certain, choose Not sure. Many people underestimate whether what happened to them qualifies. You do not need to be certain to flag it.
              </p>
              <h2 style={qSt}>Was discrimination involved?</h2>
              {/* 56px minimum tap targets — higher than standard 48px due to consequence of mis-tap */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
                {([
                  { value: 'no', label: 'No' },
                  { value: 'not_sure', label: 'Not sure' },
                  { value: 'yes', label: 'Yes' },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDiscrimination(opt.value)}
                    style={{ ...optionSt(discrimination === opt.value), minHeight: 56 }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Fixed advance button — keyboard-aware via visualViewport */}
      <div
        ref={advanceBtnRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px 24px 32px',
          background: 'linear-gradient(to top, #F7F4EE 75%, rgba(247,244,238,0))',
          zIndex: 10,
          transition: 'transform 150ms ease',
        }}
      >
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center' }}>
          <button
            onClick={advance}
            style={{
              width: '100%', background: '#D9603B', border: 'none', color: '#fff',
              fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16,
              letterSpacing: '-0.005em', padding: '15px 24px', borderRadius: 10,
              cursor: 'pointer', marginBottom: step === 4 ? 10 : 12,
            }}
          >
            {getAdvanceCopy()}
          </button>

          {/* Step 4 midpoint copy — position: below advance button */}
          {step === 4 && (
            <p style={{ fontSize: 13, color: '#8A93A3', textAlign: 'center', margin: '0 0 12px' }}>
              You are nearly there. Three more questions.
            </p>
          )}

          {/* Back link — text link (not a button visually), from Step 2 onwards */}
          {step > 1 && (
            <button
              type="button"
              onClick={() => {
                setCollectiveVisible(false)
                goToStep(step - 1)
              }}
              style={{
                background: 'none', border: 'none', color: '#8A93A3',
                fontSize: 14, cursor: 'pointer', padding: '4px 8px',
                fontFamily: 'var(--font-sans)', display: 'inline-flex',
                alignItems: 'center', gap: 4,
              }}
            >
              <BackIcon /> Back
            </button>
          )}
        </div>
      </div>

    </div>
  )
})

export default SteppedCalculator
