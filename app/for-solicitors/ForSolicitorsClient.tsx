'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ── Brand tokens (matches settlementcheck.co.uk) ─────────────────────────────
const C = {
  bg: '#F7F4EE',
  white: '#FFFFFF',
  navy: '#0B1F3A',
  muted: '#5B6577',
  border: '#E2DCCE',
  borderStrong: '#C9C0AC',
  accent: '#D9603B',
  accentHover: '#B14A28',
  accentLight: '#FDF0EB',
  error: '#DC2626',
  success: '#16a34a',
}
const SANS = "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"
const SERIF = "var(--font-serif, Georgia, 'Times New Roman', serif)"

// ── GA4 / GTM funnel tracking ─────────────────────────────────────────────────
// Fires on every step change. Works with GA4 direct, GTM, or no analytics yet.
// Each step also updates the URL (?step=...) so GA auto-captures page_view events.
function trackFormStep(stepId: string, stepNumber: number) {
  if (typeof window === 'undefined') return
  try {
    const url = new URL(window.location.href)
    if (stepId === 'welcome' || stepId === 'success') {
      url.searchParams.delete('step')
    } else {
      url.searchParams.set('step', stepId)
    }
    window.history.replaceState(null, '', url.toString())
  } catch {}
  const w = window as any
  if (typeof w.gtag === 'function') {
    w.gtag('event', 'solicitor_form_step', {
      event_category: 'solicitor_application',
      step_id: stepId,
      step_number: stepNumber,
    })
  }
  if (Array.isArray(w.dataLayer)) {
    w.dataLayer.push({ event: 'solicitor_form_step', stepId, stepNumber })
  }
}

function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined') return
  const w = window as any
  if (typeof w.gtag === 'function') w.gtag('event', name, params)
  if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: name, ...params })
}

// ── Types ─────────────────────────────────────────────────────────────────────
type SlideId =
  | 'welcome'
  | 'firmName'
  | 'contactName'
  | 'email'
  | 'otp'
  | 'phone'
  | 'coverage'
  | 'sra'
  | 'success'

interface FormData {
  firmName: string
  contactName: string
  email: string
  phone: string
  coverage: string
}

interface SlideConfig {
  id: SlideId
  inputField?: keyof FormData
  question?: string
  hint?: string
  placeholder?: string
  type?: string
  optional?: boolean
  stepNumber?: number // 1–7 for GA tracking
}

const SLIDES: SlideConfig[] = [
  { id: 'welcome' },
  {
    id: 'firmName',
    inputField: 'firmName',
    question: "What is your firm's name?",
    placeholder: 'Smith Employment Law',
    stepNumber: 1,
  },
  {
    id: 'contactName',
    inputField: 'contactName',
    question: 'And your name?',
    placeholder: 'Jane Smith',
    stepNumber: 2,
  },
  {
    id: 'email',
    inputField: 'email',
    question: "What's your work email?",
    hint: "We'll send a 6-digit verification code",
    placeholder: 'jane@smithlaw.co.uk',
    type: 'email',
    stepNumber: 3,
  },
  { id: 'otp', stepNumber: 4 },
  {
    id: 'phone',
    inputField: 'phone',
    question: 'Best phone number to reach you?',
    hint: "Optional — we'll use email to start",
    placeholder: '07700 900 000',
    type: 'tel',
    optional: true,
    stepNumber: 5,
  },
  {
    id: 'coverage',
    inputField: 'coverage',
    question: 'Which areas do you cover?',
    placeholder: 'London, South East',
    hint: 'e.g. London, South East, Manchester',
    stepNumber: 6,
  },
  { id: 'sra', stepNumber: 7 },
  { id: 'success' },
]

const TOTAL_STEPS = 7

// ── Slide animation ───────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? -48 : 48, opacity: 0 }),
}
const slideTrans = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, stepNumber }: { pct: number; stepNumber?: number }) {
  const emoji = pct === 100 ? '🎉' : pct >= 85 ? '🔥' : pct >= 57 ? '⚡' : pct >= 28 ? '✨' : '🚀'
  const label =
    pct === 0
      ? 'Let's get started!'
      : pct === 100
      ? '🎉 Complete!'
      : `${pct}% complete ${emoji}`

  return (
    <div style={{ padding: '20px 24px 20px', maxWidth: 640, margin: '0 auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
        }}
      >
        {stepNumber ? (
          <span
            style={{
              fontFamily: SANS,
              color: C.muted,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.07em',
              textTransform: 'uppercase',
            }}
          >
            Step {stepNumber} of {TOTAL_STEPS}
          </span>
        ) : (
          <span />
        )}
        <motion.span
          key={pct}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{
            fontFamily: SANS,
            color: C.accent,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </motion.span>
      </div>
      {/* Track */}
      <div
        style={{
          height: 18,
          background: C.border,
          borderRadius: 999,
          overflow: 'visible',
          position: 'relative',
          boxShadow: 'inset 0 2px 4px rgba(11,31,58,0.08)',
        }}
      >
        {/* Fill */}
        <motion.div
          animate={{ width: `${Math.max(pct, 0)}%` }}
          transition={{ type: 'spring', stiffness: 90, damping: 18 }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${C.accentHover} 0%, ${C.accent} 55%, #E8784A 100%)`,
            borderRadius: 999,
            position: 'relative',
            minWidth: pct > 3 ? 18 : 0,
            overflow: 'visible',
          }}
        >
          {/* Pulsing leading dot */}
          {pct > 0 && pct < 100 && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                right: -5,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#fff',
                boxShadow: `0 0 0 3px ${C.accent}, 0 0 12px rgba(217,96,59,0.6)`,
                zIndex: 2,
              }}
            />
          )}
        </motion.div>
        {/* Shimmer overlay */}
        {pct > 0 && pct < 100 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)',
                width: '40%',
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ForSolicitorsClient() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormData>({
    firmName: '',
    contactName: '',
    email: '',
    phone: '',
    coverage: '',
  })
  const [fieldError, setFieldError] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])

  const currentSlide = SLIDES[slideIndex]
  const progressPct =
    currentSlide.id === 'welcome'
      ? 0
      : currentSlide.id === 'success'
      ? 100
      : Math.round(((currentSlide.stepNumber ?? 0) / TOTAL_STEPS) * 100)

  const showProgress = !['welcome', 'success'].includes(currentSlide.id)
  const showBack = slideIndex > 0 && currentSlide.id !== 'success'

  // GA tracking on every slide change
  useEffect(() => {
    trackFormStep(currentSlide.id, currentSlide.stepNumber ?? 0)
  }, [slideIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentSlide.id === 'otp') {
        otpRefs.current[0]?.focus()
      } else if (!['welcome', 'sra', 'success'].includes(currentSlide.id)) {
        inputRef.current?.focus()
      }
    }, 420)
    return () => clearTimeout(t)
  }, [slideIndex, currentSlide.id])

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // ── Navigation ─────────────────────────────────────────────────────────────
  const advance = useCallback(() => {
    setDir(1)
    setFieldError('')
    setSlideIndex((i) => i + 1)
  }, [])

  const goBack = useCallback(() => {
    if (slideIndex === 0) return
    setDir(-1)
    setFieldError('')
    setSlideIndex((i) => i - 1)
  }, [slideIndex])

  // ── OTP ────────────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async (emailAddr: string) => {
    setOtpSending(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddr, form_type: 'solicitor' }),
      })
      if (!res.ok) throw new Error()
      setResendCooldown(30)
      return true
    } catch {
      setFieldError('Failed to send verification code. Please try again.')
      return false
    } finally {
      setOtpSending(false)
    }
  }, [])

  const verifyOtp = useCallback(
    async (digits?: string[]) => {
      const d = digits ?? otpDigits
      const code = d.join('')
      if (code.length < 6) {
        setOtpError('Please enter all 6 digits')
        return
      }
      setOtpVerifying(true)
      setOtpError('')
      try {
        const res = await fetch('/api/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, code, form_type: 'solicitor' }),
        })
        const data = await res.json()
        if (data.success) {
          trackEvent('solicitor_email_verified')
          advance()
        } else {
          setOtpError(data.message || 'Incorrect code. Please try again.')
          setOtpDigits(['', '', '', '', '', ''])
          otpRefs.current[0]?.focus()
        }
      } catch {
        setOtpError('Verification failed. Please try again.')
      } finally {
        setOtpVerifying(false)
      }
    },
    [otpDigits, form.email, advance]
  )

  const resendOtp = useCallback(async () => {
    if (resendCooldown > 0) return
    setOtpError('')
    setOtpDigits(['', '', '', '', '', ''])
    await sendOtp(form.email)
    otpRefs.current[0]?.focus()
  }, [resendCooldown, form.email, sendOtp])

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1)
      const next = [...otpDigits]
      next[index] = digit
      setOtpDigits(next)
      setOtpError('')
      if (digit && index < 5) otpRefs.current[index + 1]?.focus()
      if (digit && index === 5 && next.every((d) => d)) setTimeout(() => verifyOtp(next), 80)
    },
    [otpDigits, verifyOtp]
  )

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otpDigits[index] && index > 0)
        otpRefs.current[index - 1]?.focus()
      if (e.key === 'Enter' && otpDigits.join('').length === 6) verifyOtp()
    },
    [otpDigits, verifyOtp]
  )

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
      const next = ['', '', '', '', '', '']
      pasted.split('').forEach((d, i) => {
        next[i] = d
      })
      setOtpDigits(next)
      otpRefs.current[Math.min(pasted.length, 5)]?.focus()
      if (pasted.length === 6) setTimeout(() => verifyOtp(next), 80)
    },
    [verifyOtp]
  )

  // ── Per-slide next ─────────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    setFieldError('')
    const id = currentSlide.id
    if (id === 'firmName') {
      if (!form.firmName.trim()) { setFieldError('Please enter your firm name'); return }
      advance()
    } else if (id === 'contactName') {
      if (!form.contactName.trim()) { setFieldError('Please enter your name'); return }
      advance()
    } else if (id === 'email') {
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setFieldError('Please enter a valid email address'); return
      }
      const ok = await sendOtp(form.email)
      if (ok) advance()
    } else if (id === 'phone') {
      advance()
    } else if (id === 'coverage') {
      if (!form.coverage.trim()) { setFieldError('Please enter your geographic coverage'); return }
      advance()
    }
  }, [currentSlide.id, form, advance, sendOtp])

  const submitApplication = useCallback(async () => {
    setSubmitting(true)
    setFieldError('')
    try {
      const res = await fetch('/api/solicitor-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_name: form.firmName,
          contact_name: form.contactName,
          email: form.email,
          phone: form.phone || null,
          coverage: form.coverage,
          sra_confirmed: true,
        }),
      })
      if (!res.ok) throw new Error()
      trackEvent('solicitor_application_submitted', { firm: form.firmName })
      advance()
    } catch {
      setFieldError(
        'Something went wrong. Please try again or email us at hello@settlementcheck.co.uk'
      )
    } finally {
      setSubmitting(false)
    }
  }, [form, advance])

  const updateField = useCallback((field: keyof FormData, value: string) => {
    setFieldError('')
    setForm((f) => ({ ...f, [field]: value }))
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (
        e.key === 'Enter' &&
        !['otp', 'sra', 'welcome', 'success'].includes(currentSlide.id)
      ) {
        e.preventDefault()
        handleNext()
      }
    },
    [currentSlide.id, handleNext]
  )

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        background: C.bg,
        minHeight: '100vh',
        fontFamily: SANS,
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Sticky header ──────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
          background: C.white,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 200,
          boxShadow: '0 1px 6px rgba(11,31,58,0.06)',
        }}
      >
        {showBack ? (
          <button
            onClick={goBack}
            aria-label="Go back"
            style={{
              background: 'none',
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '6px 12px',
              color: C.muted,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: SANS,
              transition: 'border-color 0.15s ease',
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div style={{ width: 72 }} />
        )}

        <a
          href="/"
          style={{
            color: C.navy,
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.01em',
            fontFamily: SERIF,
            textDecoration: 'none',
          }}
        >
          SettlementCheck
        </a>

        <div style={{ width: 72 }} />
      </div>

      {/* ── Progress bar (fixed below header) ─────────────────────────────── */}
      {showProgress && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            left: 0,
            right: 0,
            background: C.white,
            borderBottom: `1px solid ${C.border}`,
            zIndex: 100,
          }}
        >
          <ProgressBar pct={progressPct} stepNumber={currentSlide.stepNumber} />
        </div>
      )}

      {/* ── Slide container ────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: showProgress ? '180px 24px 60px' : '80px 24px 60px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 600, position: 'relative' }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={currentSlide.id}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTrans}
              style={{ width: '100%' }}
            >
              {currentSlide.id === 'welcome' && (
                <WelcomeSlide onStart={() => { setDir(1); setSlideIndex(1) }} />
              )}
              {currentSlide.inputField && (
                <TextInputSlide
                  question={currentSlide.question!}
                  hint={currentSlide.hint}
                  value={form[currentSlide.inputField]}
                  type={currentSlide.type || 'text'}
                  placeholder={currentSlide.placeholder}
                  optional={currentSlide.optional}
                  onChange={(v) => updateField(currentSlide.inputField!, v)}
                  onNext={handleNext}
                  error={fieldError}
                  inputRef={inputRef}
                  loading={otpSending}
                />
              )}
              {currentSlide.id === 'otp' && (
                <OtpSlide
                  email={form.email}
                  digits={otpDigits}
                  error={otpError}
                  verifying={otpVerifying}
                  resendCooldown={resendCooldown}
                  resending={otpSending}
                  onDigitChange={handleOtpChange}
                  onKeyDown={handleOtpKeyDown}
                  onPaste={handleOtpPaste}
                  onVerify={() => verifyOtp()}
                  onResend={resendOtp}
                  otpRefs={otpRefs}
                />
              )}
              {currentSlide.id === 'sra' && (
                <SraSlide
                  firmName={form.firmName}
                  submitting={submitting}
                  error={fieldError}
                  onConfirm={submitApplication}
                />
              )}
              {currentSlide.id === 'success' && (
                <SuccessSlide name={form.contactName} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function WelcomeSlide({ onStart }: { onStart: () => void }) {
  const features = [
    { icon: '📋', label: 'Pre-qualified leads', desc: 'Every enquiry includes offer amount, salary & years served' },
    { icon: '✅', label: 'Verified email', desc: 'We verify every employee before passing the lead' },
    { icon: '💷', label: '£60 per introduction', desc: 'Founding panel rate — pay only when we deliver' },
    { icon: '🚫', label: 'No subscription', desc: 'No monthly fees, no commitment — pure pay-per-lead' },
    { icon: '📍', label: 'Geographic matching', desc: 'We match leads to solicitors in the right location' },
    { icon: '⚖️', label: 'SRA regulated only', desc: 'We only accept firms regulated to advise on settlement agreements' },
  ]

  return (
    <div>
      {/* Badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: C.accentLight,
          border: `1px solid ${C.accent}30`,
          borderRadius: 24,
          padding: '5px 14px',
          color: C.accent,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 24,
          fontFamily: SANS,
        }}
      >
        For solicitors
      </div>

      <h1
        style={{
          color: C.navy,
          fontSize: 'clamp(28px, 5vw, 46px)',
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.025em',
          margin: '0 0 16px',
          fontFamily: SERIF,
        }}
      >
        Join our solicitor panel
      </h1>
      <p
        style={{
          color: C.muted,
          fontSize: 17,
          lineHeight: 1.65,
          maxWidth: 480,
          margin: '0 0 40px',
          fontFamily: SANS,
        }}
      >
        Receive pre-qualified settlement agreement leads direct to your inbox. Takes
        less than 3 minutes to apply.
      </p>

      {/* Feature grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 12,
          marginBottom: 40,
        }}
      >
        {features.map((f) => (
          <div
            key={f.label}
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 10,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.3 }}>{f.icon}</span>
            <div>
              <div
                style={{
                  color: C.navy,
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: SANS,
                  marginBottom: 2,
                }}
              >
                {f.label}
              </div>
              <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.4, fontFamily: SANS }}>
                {f.desc}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onStart}
        style={{
          background: C.accent,
          border: 'none',
          borderRadius: 8,
          padding: '15px 36px',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: SANS,
          boxShadow: '0 4px 16px rgba(217,96,59,0.3)',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
      >
        Apply now — it's free
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      <p style={{ color: C.borderStrong, fontSize: 12, margin: '14px 0 0', fontFamily: SANS }}>
        No payment required · Takes under 3 minutes
      </p>
    </div>
  )
}

interface TextInputSlideProps {
  question: string
  hint?: string
  value: string
  type: string
  placeholder?: string
  optional?: boolean
  onChange: (v: string) => void
  onNext: () => void
  error?: string
  inputRef: React.RefObject<HTMLInputElement | null>
  loading?: boolean
}

function TextInputSlide({
  question,
  hint,
  value,
  type,
  placeholder,
  optional,
  onChange,
  onNext,
  error,
  inputRef,
  loading,
}: TextInputSlideProps) {
  const showSkip = optional && !value

  return (
    <div>
      <h2
        style={{
          color: C.navy,
          fontSize: 'clamp(24px, 4vw, 38px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 8px',
          fontFamily: SERIF,
        }}
      >
        {question}
      </h2>
      {hint && (
        <p
          style={{
            color: C.muted,
            fontSize: 15,
            margin: '0 0 28px',
            lineHeight: 1.5,
            fontFamily: SANS,
          }}
        >
          {hint}
        </p>
      )}
      {!hint && <div style={{ height: 28 }} />}

      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            onNext()
          }
        }}
        autoComplete="off"
        spellCheck={false}
        style={{
          display: 'block',
          width: '100%',
          background: 'transparent',
          border: 'none',
          borderBottom: `2.5px solid ${value ? C.accent : C.borderStrong}`,
          padding: '10px 0 14px',
          fontSize: 'clamp(22px, 3.5vw, 30px)',
          color: C.navy,
          outline: 'none',
          caretColor: C.accent,
          letterSpacing: '-0.01em',
          marginBottom: 8,
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease',
          fontFamily: SANS,
        }}
        onFocus={(e) => { e.currentTarget.style.borderBottomColor = C.accent }}
        onBlur={(e) => { e.currentTarget.style.borderBottomColor = value ? C.accent : C.borderStrong }}
      />

      {error && (
        <p
          style={{
            color: C.error,
            fontSize: 13,
            margin: '0 0 16px',
            fontFamily: SANS,
            letterSpacing: '-0.01em',
          }}
        >
          {error}
        </p>
      )}
      {!error && <div style={{ height: 20 }} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <button
          onClick={onNext}
          disabled={loading}
          style={{
            background: C.accent,
            border: 'none',
            borderRadius: 8,
            padding: '12px 26px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: SANS,
            letterSpacing: '-0.01em',
            boxShadow: loading ? 'none' : '0 2px 8px rgba(217,96,59,0.25)',
            transition: 'background 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = C.accentHover }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
        >
          {loading ? (
            'Sending…'
          ) : showSkip ? (
            'Skip'
          ) : (
            <>
              OK
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </>
          )}
        </button>
        <span style={{ color: C.borderStrong, fontSize: 12, fontFamily: SANS }}>
          press{' '}
          <kbd
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 4,
              padding: '2px 6px',
              fontFamily: SANS,
              fontSize: 11,
              color: C.muted,
            }}
          >
            Enter
          </kbd>
        </span>
      </div>
    </div>
  )
}

interface OtpSlideProps {
  email: string
  digits: string[]
  error: string
  verifying: boolean
  resendCooldown: number
  resending: boolean
  onDigitChange: (i: number, v: string) => void
  onKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste: (e: React.ClipboardEvent<HTMLDivElement>) => void
  onVerify: () => void
  onResend: () => void
  otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>
}

function OtpSlide({
  email,
  digits,
  error,
  verifying,
  resendCooldown,
  resending,
  onDigitChange,
  onKeyDown,
  onPaste,
  onVerify,
  onResend,
  otpRefs,
}: OtpSlideProps) {
  const filled = digits.every((d) => d !== '')

  return (
    <div>
      <h2
        style={{
          color: C.navy,
          fontSize: 'clamp(24px, 4vw, 38px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 10px',
          fontFamily: SERIF,
        }}
      >
        Check your inbox
      </h2>
      <p
        style={{
          color: C.muted,
          fontSize: 15,
          margin: '0 0 32px',
          lineHeight: 1.55,
          fontFamily: SANS,
        }}
      >
        We sent a 6-digit code to{' '}
        <strong style={{ color: C.navy, fontWeight: 600 }}>{email}</strong>
      </p>

      <div onPaste={onPaste} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { otpRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onDigitChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            style={{
              width: 'clamp(44px, 11vw, 56px)',
              height: 'clamp(54px, 13vw, 66px)',
              textAlign: 'center',
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: 700,
              color: C.navy,
              background: digit ? C.accentLight : C.white,
              border: `2px solid ${digit ? C.accent : C.border}`,
              borderRadius: 10,
              outline: 'none',
              caretColor: C.accent,
              transition: 'all 0.15s ease',
              fontVariantNumeric: 'tabular-nums',
              fontFamily: SANS,
              boxShadow: digit ? `0 0 0 3px ${C.accent}20` : 'none',
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ color: C.error, fontSize: 13, margin: '0 0 16px', fontFamily: SANS }}>
          {error}
        </p>
      )}

      <button
        onClick={onVerify}
        disabled={verifying || !filled}
        style={{
          background: C.accent,
          border: 'none',
          borderRadius: 8,
          padding: '12px 26px',
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: verifying || !filled ? 'not-allowed' : 'pointer',
          opacity: verifying || !filled ? 0.5 : 1,
          marginBottom: 20,
          fontFamily: SANS,
          letterSpacing: '-0.01em',
          boxShadow: verifying || !filled ? 'none' : '0 2px 8px rgba(217,96,59,0.25)',
        }}
      >
        {verifying ? 'Verifying…' : 'Verify email'}
      </button>

      <div style={{ color: C.muted, fontSize: 13, fontFamily: SANS }}>
        Didn&apos;t receive it?{' '}
        <button
          onClick={onResend}
          disabled={resendCooldown > 0 || resending}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color: resendCooldown > 0 ? C.border : C.accent,
            cursor: resendCooldown > 0 ? 'default' : 'pointer',
            fontSize: 13,
            textDecoration: 'underline',
            fontFamily: SANS,
          }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}

interface SraSlideProps {
  firmName: string
  submitting: boolean
  error: string
  onConfirm: () => void
}

function SraSlide({ firmName, submitting, error, onConfirm }: SraSlideProps) {
  return (
    <div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 20,
          padding: '4px 12px',
          color: '#16a34a',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 20,
          fontFamily: SANS,
        }}
      >
        Almost there!
      </div>
      <h2
        style={{
          color: C.navy,
          fontSize: 'clamp(24px, 4vw, 38px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 20px',
          fontFamily: SERIF,
        }}
      >
        One last confirmation
      </h2>

      {/* SRA declaration card */}
      <div
        style={{
          background: C.white,
          border: `1.5px solid ${C.border}`,
          borderRadius: 12,
          padding: '20px 24px',
          color: C.muted,
          fontSize: 16,
          lineHeight: 1.7,
          marginBottom: 28,
          fontFamily: SANS,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: C.accentLight,
              border: `1px solid ${C.accent}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              marginTop: 2,
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.accent}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <p style={{ margin: 0, color: C.muted, fontSize: 15, lineHeight: 1.65 }}>
            I confirm that{' '}
            <strong style={{ color: C.navy, fontWeight: 600 }}>
              {firmName || 'this firm'}
            </strong>{' '}
            is regulated by the Solicitors Regulation Authority (SRA) and authorised
            to advise on employment settlement agreements.
          </p>
        </div>
      </div>

      {error && (
        <div
          style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: 8,
            padding: '12px 16px',
            marginBottom: 20,
          }}
        >
          <p style={{ color: C.error, fontSize: 13, margin: 0, fontFamily: SANS }}>
            {error}
          </p>
        </div>
      )}

      <button
        onClick={onConfirm}
        disabled={submitting}
        style={{
          background: C.accent,
          border: 'none',
          borderRadius: 8,
          padding: '15px 32px',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.65 : 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          fontFamily: SANS,
          letterSpacing: '-0.01em',
          boxShadow: submitting ? 'none' : '0 4px 16px rgba(217,96,59,0.3)',
          transition: 'background 0.15s ease',
        }}
        onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = C.accentHover }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
      >
        {submitting ? (
          'Submitting…'
        ) : (
          <>
            Yes, confirm &amp; apply
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </>
        )}
      </button>
    </div>
  )
}

function SuccessSlide({ name }: { name: string }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 18 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: '#F0FDF4',
          border: '2px solid #86EFAC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 28px',
        }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>

      <h1
        style={{
          color: C.navy,
          fontSize: 'clamp(26px, 4.5vw, 42px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          margin: '0 0 14px',
          fontFamily: SERIF,
        }}
      >
        {name ? `Thanks, ${name.split(' ')[0]}!` : 'Application received'}
      </h1>
      <p
        style={{
          color: C.muted,
          fontSize: 17,
          lineHeight: 1.65,
          maxWidth: 420,
          margin: '0 auto 32px',
          fontFamily: SANS,
        }}
      >
        We&apos;ll review your application and be in touch within 2 business days.
        Welcome to SettlementCheck.
      </p>
      <a
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: C.navy,
          color: '#fff',
          borderRadius: 8,
          padding: '12px 24px',
          fontSize: 14,
          fontWeight: 600,
          textDecoration: 'none',
          fontFamily: SANS,
          letterSpacing: '-0.01em',
        }}
      >
        Back to home
      </a>
    </div>
  )
}
