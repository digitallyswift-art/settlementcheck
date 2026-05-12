'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostcodeInput from '@/components/PostcodeInput'
import { PostcodeLookup } from '@/lib/postcodes'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const C = {
  bg:           '#F7F4EE',
  white:        '#FFFFFF',
  navy:         '#0B1F3A',
  muted:        '#5B6577',
  border:       '#E2DCCE',
  borderStrong: '#C9C0AC',
  accent:       '#D9603B',
  accentHover:  '#B14A28',
  accentLight:  '#FDF0EB',
  error:        '#DC2626',
}
const SANS  = "var(--font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"
const SERIF = "var(--font-serif, Georgia, 'Times New Roman', serif)"

const TOTAL_STEPS = 7

// ── Slide animation ───────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 48 : -48, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit:  (dir: number) => ({ y: dir > 0 ? -48 : 48, opacity: 0 }),
}
const slideTrans = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

// ── Types ─────────────────────────────────────────────────────────────────────
type SlideId = 'firstName' | 'email' | 'otp' | 'postcode' | 'phone' | 'contactTime' | 'consent' | 'success'

interface FormData {
  firstName:    string
  email:        string
  postcode:     string
  postcode_lat: number | null
  postcode_lng: number | null
  postcode_region: string
  phone:        string
  contactTime:  'Morning' | 'Afternoon' | 'Evening'
}

interface Props {
  // Calculator context passed through for Supabase
  verdict:      string
  offer:        number
  salary:       number
  totalMonths:  number
  // If the user already verified email via "Email me my results", skip email+OTP
  prefillEmail?: string
  emailVerified?: boolean
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, stepNumber }: { pct: number; stepNumber?: number }) {
  const label =
    pct === 0   ? "Let's get started" :
    pct === 100 ? 'Done' :
    `${pct}% complete`

  return (
    <div style={{ padding: '20px 24px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        {stepNumber ? (
          <span style={{ fontFamily: SANS, color: C.muted, fontSize: 12, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const }}>
            Step {stepNumber} of {TOTAL_STEPS}
          </span>
        ) : <span />}
        <motion.span
          key={pct}
          initial={{ y: -6, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          style={{ fontFamily: SANS, color: C.accent, fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em' }}
        >
          {label}
        </motion.span>
      </div>
      <div style={{ height: 18, background: C.border, borderRadius: 999, overflow: 'visible', position: 'relative', boxShadow: 'inset 0 2px 4px rgba(11,31,58,0.08)' }}>
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
          {pct > 0 && pct < 100 && (
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)',
                width: 14, height: 14, borderRadius: '50%', background: '#fff',
                boxShadow: `0 0 0 3px ${C.accent}, 0 0 12px rgba(217,96,59,0.6)`, zIndex: 2,
              }}
            />
          )}
        </motion.div>
        {pct > 0 && pct < 100 && (
          <div style={{ position: 'absolute', inset: 0, borderRadius: 999, overflow: 'hidden', pointerEvents: 'none' }}>
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)', width: '40%' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// ── Text input slide ──────────────────────────────────────────────────────────
interface TextInputSlideProps {
  question: string
  hint?: string
  value: string
  type?: string
  placeholder?: string
  optional?: boolean
  onChange: (v: string) => void
  onNext: () => void
  error?: string
  inputRef: React.RefObject<HTMLInputElement | null>
  loading?: boolean
}

function TextInputSlide({ question, hint, value, type = 'text', placeholder, optional, onChange, onNext, error, inputRef, loading }: TextInputSlideProps) {
  const showSkip = optional && !value

  return (
    <div>
      <h2 style={{ color: C.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 8px', fontFamily: SERIF }}>
        {question}
      </h2>
      {hint
        ? <p style={{ color: C.muted, fontSize: 15, margin: '0 0 28px', lineHeight: 1.5, fontFamily: SANS }}>{hint}</p>
        : <div style={{ height: 28 }} />
      }
      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onNext() } }}
        autoComplete="off"
        spellCheck={false}
        style={{
          display: 'block', width: '100%', background: 'transparent', border: 'none',
          borderBottom: `2.5px solid ${value ? C.accent : C.borderStrong}`,
          padding: '10px 0 14px', fontSize: 'clamp(22px, 3.5vw, 30px)',
          color: C.navy, outline: 'none', caretColor: C.accent,
          letterSpacing: '-0.01em', marginBottom: 8, boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
          transition: 'border-color 0.2s ease', fontFamily: SANS,
        }}
        onFocus={e => { e.currentTarget.style.borderBottomColor = C.accent }}
        onBlur={e => { e.currentTarget.style.borderBottomColor = value ? C.accent : C.borderStrong }}
      />
      {error
        ? <p style={{ color: C.error, fontSize: 13, margin: '0 0 16px', fontFamily: SANS }}>{error}</p>
        : <div style={{ height: 20 }} />
      }
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as React.CSSProperties['flexWrap'] }}>
        <button
          onClick={onNext}
          disabled={loading}
          style={{
            background: C.accent, border: 'none', borderRadius: 8, padding: '12px 26px',
            color: '#fff', fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: SANS, letterSpacing: '-0.01em',
            boxShadow: loading ? 'none' : '0 2px 8px rgba(217,96,59,0.25)',
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.background = C.accentHover }}
          onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
        >
          {loading ? 'Sending…' : showSkip ? 'Skip' : (
            <>OK <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg></>
          )}
        </button>
        <span style={{ color: C.borderStrong, fontSize: 12, fontFamily: SANS }}>
          press <kbd style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 6px', fontFamily: SANS, fontSize: 11, color: C.muted }}>Enter</kbd>
        </span>
      </div>
    </div>
  )
}

// ── OTP slide ─────────────────────────────────────────────────────────────────
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

function OtpSlide({ email, digits, error, verifying, resendCooldown, resending, onDigitChange, onKeyDown, onPaste, onVerify, onResend, otpRefs }: OtpSlideProps) {
  const filled = digits.every(d => d !== '')
  return (
    <div>
      <h2 style={{ color: C.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 10px', fontFamily: SERIF }}>
        Check your inbox
      </h2>
      <p style={{ color: C.muted, fontSize: 15, margin: '0 0 32px', lineHeight: 1.55, fontFamily: SANS }}>
        We sent a 6-digit code to <strong style={{ color: C.navy, fontWeight: 600 }}>{email}</strong>
      </p>
      <div onPaste={onPaste} style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { otpRefs.current[i] = el }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => onDigitChange(i, e.target.value)}
            onKeyDown={e => onKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            style={{
              width: 'clamp(44px, 11vw, 56px)', height: 'clamp(54px, 13vw, 66px)',
              textAlign: 'center', fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 700,
              color: C.navy, background: digit ? C.accentLight : C.white,
              border: `2px solid ${digit ? C.accent : C.border}`,
              borderRadius: 10, outline: 'none', caretColor: C.accent,
              transition: 'all 0.15s ease', fontVariantNumeric: 'tabular-nums', fontFamily: SANS,
              boxShadow: digit ? `0 0 0 3px ${C.accent}20` : 'none',
            }}
          />
        ))}
      </div>
      {error && <p style={{ color: C.error, fontSize: 13, margin: '0 0 16px', fontFamily: SANS }}>{error}</p>}
      <button
        onClick={onVerify}
        disabled={verifying || !filled}
        style={{
          background: C.accent, border: 'none', borderRadius: 8, padding: '12px 26px',
          color: '#fff', fontSize: 15, fontWeight: 600,
          cursor: verifying || !filled ? 'not-allowed' : 'pointer',
          opacity: verifying || !filled ? 0.5 : 1, marginBottom: 20, fontFamily: SANS,
          letterSpacing: '-0.01em', boxShadow: verifying || !filled ? 'none' : '0 2px 8px rgba(217,96,59,0.25)',
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
            background: 'none', border: 'none', padding: 0,
            color: resendCooldown > 0 ? C.border : C.accent,
            cursor: resendCooldown > 0 ? 'default' : 'pointer',
            fontSize: 13, textDecoration: 'underline', fontFamily: SANS,
          }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EmployeeLeadTypeform({ verdict, offer, salary, totalMonths, prefillEmail = '', emailVerified = false }: Props) {
  // Determine starting slide: if email is already verified, skip email+OTP
  const startSlide: SlideId = emailVerified && prefillEmail ? 'postcode' : 'firstName'
  const startIndex = slideOrder(startSlide, emailVerified && !!prefillEmail)

  const [slideIndex, setSlideIndex] = useState(startIndex)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormData>({
    firstName:       '',
    email:           prefillEmail,
    postcode:        '',
    postcode_lat:    null,
    postcode_lng:    null,
    postcode_region: '',
    phone:           '',
    contactTime:     'Morning',
  })
  const [postcodeValid, setPostcodeValid] = useState(false)

  const [fieldError, setFieldError]         = useState('')
  const [otpDigits, setOtpDigits]           = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError]             = useState('')
  const [otpSending, setOtpSending]         = useState(false)
  const [otpVerifying, setOtpVerifying]     = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [submitting, setSubmitting]         = useState(false)

  const inputRef  = useRef<HTMLInputElement>(null)
  const otpRefs   = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])
  const postcodeRef = useRef<HTMLInputElement>(null)

  // Slide ordering — skip email+OTP when prefill is verified
  const SLIDES_FULL: SlideId[]    = ['firstName', 'email', 'otp', 'postcode', 'phone', 'contactTime', 'consent', 'success']
  const SLIDES_PREFILL: SlideId[] = ['firstName', 'postcode', 'phone', 'contactTime', 'consent', 'success']
  const slides = (emailVerified && !!prefillEmail) ? SLIDES_PREFILL : SLIDES_FULL
  const currentSlide = slides[slideIndex]

  // Step numbers for progress bar (success has no step number)
  const stepNumber = currentSlide === 'success' ? undefined : slideIndex + 1
  const progressPct = currentSlide === 'success'
    ? 100
    : Math.round((slideIndex / (slides.length - 1)) * 100)

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Auto-focus
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentSlide === 'otp') {
        otpRefs.current[0]?.focus()
      } else if (currentSlide === 'postcode') {
        postcodeRef.current?.focus()
      } else if (!['contactTime', 'consent', 'success'].includes(currentSlide)) {
        inputRef.current?.focus()
      }
    }, 420)
    return () => clearTimeout(t)
  }, [slideIndex, currentSlide])

  const advance = useCallback(() => {
    setDir(1)
    setFieldError('')
    setSlideIndex(i => i + 1)
  }, [])

  const goBack = useCallback(() => {
    if (slideIndex === 0) return
    setDir(-1)
    setFieldError('')
    setSlideIndex(i => i - 1)
  }, [slideIndex])

  // ── OTP ──────────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async (emailAddr: string) => {
    setOtpSending(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddr, form_type: 'employee' }),
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

  const verifyOtp = useCallback(async (digits?: string[]) => {
    const d = digits ?? otpDigits
    const code = d.join('')
    if (code.length < 6) { setOtpError('Please enter all 6 digits'); return }
    setOtpVerifying(true)
    setOtpError('')
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, code, form_type: 'employee' }),
      })
      const data = await res.json()
      if (data.success) {
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
  }, [otpDigits, form.email, advance])

  const resendOtp = useCallback(async () => {
    if (resendCooldown > 0) return
    setOtpError('')
    setOtpDigits(['', '', '', '', '', ''])
    await sendOtp(form.email)
    otpRefs.current[0]?.focus()
  }, [resendCooldown, form.email, sendOtp])

  const handleOtpChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]
    next[index] = digit
    setOtpDigits(next)
    setOtpError('')
    if (digit && index < 5) otpRefs.current[index + 1]?.focus()
    if (digit && index === 5 && next.every(d => d)) setTimeout(() => verifyOtp(next), 80)
  }, [otpDigits, verifyOtp])

  const handleOtpKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) otpRefs.current[index - 1]?.focus()
    if (e.key === 'Enter' && otpDigits.join('').length === 6) verifyOtp()
  }, [otpDigits, verifyOtp])

  const handleOtpPaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = ['', '', '', '', '', '']
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtpDigits(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
    if (pasted.length === 6) setTimeout(() => verifyOtp(next), 80)
  }, [verifyOtp])

  // ── Per-slide next ────────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    setFieldError('')
    if (currentSlide === 'firstName') {
      if (!form.firstName.trim()) { setFieldError('Please enter your name'); return }
      advance()
    } else if (currentSlide === 'email') {
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setFieldError('Please enter a valid email address'); return
      }
      const ok = await sendOtp(form.email)
      if (ok) advance()
    } else if (currentSlide === 'postcode') {
      if (!postcodeValid || !form.postcode.trim()) {
        setFieldError('Please enter a valid UK postcode to continue'); return
      }
      advance()
    } else if (currentSlide === 'phone') {
      if (!form.phone || form.phone.trim().length < 7) {
        setFieldError('Please enter a phone number'); return
      }
      advance()
    }
  }, [currentSlide, form, postcodeValid, advance, sendOtp])

  // ── Submission ────────────────────────────────────────────────────────────
  const submitLead = useCallback(async () => {
    if (!form.firstName.trim() || !form.email.trim() || !form.postcode || !form.phone || !form.contactTime) return
    setSubmitting(true)
    setFieldError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name:      form.firstName.trim(),
          email:           form.email.trim(),
          phone:           form.phone.trim(),
          contact_time:    form.contactTime,
          verdict,
          offer_amount:    offer,
          salary,
          months_service:  totalMonths,
          consent:         true,
          postcode:        form.postcode,
          postcode_region: form.postcode_region,
          postcode_lat:    form.postcode_lat,
          postcode_lng:    form.postcode_lng,
        }),
      })
      if (!res.ok) throw new Error()
      advance()
    } catch {
      setFieldError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }, [form, verdict, offer, salary, totalMonths, advance])

  const updateField = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setFieldError('')
    setForm(f => ({ ...f, [k]: v }))
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !['otp', 'contactTime', 'consent', 'success'].includes(currentSlide)) {
      e.preventDefault()
      handleNext()
    }
  }, [currentSlide, handleNext])

  const showBack = slideIndex > 0 && currentSlide !== 'success'
  const showProgress = currentSlide !== 'success'

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      onKeyDown={handleKeyDown}
      style={{ background: C.bg, fontFamily: SANS, WebkitFontSmoothing: 'antialiased' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0 0' }}>
        <div>
          <span style={{ fontFamily: SANS, fontSize: 13, fontWeight: 600, color: C.muted, letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
            Step 2 of 2
          </span>
          <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 700, color: C.navy, margin: '4px 0 0', letterSpacing: '-0.02em' }}>
            Get your free specialist match
          </h3>
        </div>
        {showBack && (
          <button
            onClick={goBack}
            aria-label="Go back"
            style={{
              background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
              padding: '6px 12px', color: C.muted, cursor: 'pointer', fontSize: 13,
              fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5, fontFamily: SANS,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div style={{ margin: '12px 0 0', background: C.white, border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden' }}>
          <ProgressBar pct={progressPct} stepNumber={stepNumber} />
        </div>
      )}

      {/* Slide container */}
      <div style={{ marginTop: 28, minHeight: 320, position: 'relative' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={currentSlide}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            style={{ width: '100%' }}
          >

            {/* firstName */}
            {currentSlide === 'firstName' && (
              <TextInputSlide
                question="What is your first name?"
                value={form.firstName}
                placeholder="Alex"
                onChange={v => updateField('firstName', v)}
                onNext={handleNext}
                error={fieldError}
                inputRef={inputRef}
              />
            )}

            {/* email */}
            {currentSlide === 'email' && (
              <TextInputSlide
                question="What is your email address?"
                hint="We'll send a 6-digit code to verify it"
                value={form.email}
                type="email"
                placeholder="alex@example.com"
                onChange={v => updateField('email', v)}
                onNext={handleNext}
                error={fieldError}
                inputRef={inputRef}
                loading={otpSending}
              />
            )}

            {/* OTP */}
            {currentSlide === 'otp' && (
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

            {/* postcode */}
            {currentSlide === 'postcode' && (
              <div>
                <h2 style={{ color: C.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 8px', fontFamily: SERIF }}>
                  What is your postcode?
                </h2>
                <p style={{ color: C.muted, fontSize: 15, margin: '0 0 28px', lineHeight: 1.5, fontFamily: SANS }}>
                  This helps us match you with a solicitor who covers your area.
                </p>
                <PostcodeInput
                  value={form.postcode}
                  onChange={v => { updateField('postcode', v); setPostcodeValid(false) }}
                  onValidated={lookup => {
                    if (lookup) {
                      setForm(f => ({ ...f, postcode: lookup.postcode, postcode_lat: lookup.latitude, postcode_lng: lookup.longitude, postcode_region: lookup.admin_district }))
                      setPostcodeValid(true)
                    } else {
                      setForm(f => ({ ...f, postcode_lat: null, postcode_lng: null, postcode_region: '' }))
                      setPostcodeValid(false)
                    }
                    setFieldError('')
                  }}
                  inputRef={postcodeRef}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleNext() } }}
                />
                {fieldError && <p style={{ color: C.error, fontSize: 13, margin: '4px 0 0', fontFamily: SANS }}>{fieldError}</p>}
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <button
                    onClick={handleNext}
                    disabled={!postcodeValid}
                    style={{
                      background: C.accent, border: 'none', borderRadius: 8, padding: '12px 26px',
                      color: '#fff', fontSize: 15, fontWeight: 600,
                      cursor: postcodeValid ? 'pointer' : 'not-allowed',
                      opacity: postcodeValid ? 1 : 0.45,
                      display: 'flex', alignItems: 'center', gap: 8, fontFamily: SANS,
                      boxShadow: postcodeValid ? '0 2px 8px rgba(217,96,59,0.25)' : 'none',
                    }}
                  >
                    OK <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </button>
                  <span style={{ color: C.borderStrong, fontSize: 12, fontFamily: SANS }}>
                    press <kbd style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 6px', fontSize: 11, color: C.muted }}>Enter</kbd>
                  </span>
                </div>
              </div>
            )}

            {/* phone */}
            {currentSlide === 'phone' && (
              <TextInputSlide
                question="Best number to reach you?"
                hint="A solicitor will call you — no automated systems"
                value={form.phone}
                type="tel"
                placeholder="07700 900 000"
                onChange={v => updateField('phone', v)}
                onNext={handleNext}
                error={fieldError}
                inputRef={inputRef}
              />
            )}

            {/* contactTime */}
            {currentSlide === 'contactTime' && (
              <div>
                <h2 style={{ color: C.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 8px', fontFamily: SERIF }}>
                  When is the best time to call?
                </h2>
                <p style={{ color: C.muted, fontSize: 15, margin: '0 0 28px', lineHeight: 1.5, fontFamily: SANS }}>
                  The solicitor will try to reach you at this time on a working day.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column' as React.CSSProperties['flexDirection'], gap: 10 }}>
                  {(['Morning', 'Afternoon', 'Evening'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        updateField('contactTime', t)
                        setTimeout(() => {
                          setDir(1)
                          setFieldError('')
                          setSlideIndex(i => i + 1)
                        }, 300)
                      }}
                      style={{
                        width: '100%', minHeight: 52, padding: '14px 20px', textAlign: 'left' as React.CSSProperties['textAlign'],
                        border: `1.5px solid ${form.contactTime === t ? C.navy : C.border}`,
                        borderRadius: 10, fontSize: 16, fontFamily: SANS,
                        fontWeight: form.contactTime === t ? 600 : 400,
                        cursor: 'pointer',
                        background: form.contactTime === t ? C.navy : C.white,
                        color: form.contactTime === t ? '#fff' : C.navy,
                        transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* consent */}
            {currentSlide === 'consent' && (
              <div>
                <h2 style={{ color: C.navy, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 24px', fontFamily: SERIF }}>
                  One last thing
                </h2>

                {/* Summary card */}
                <div style={{ background: C.white, border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24 }}>
                  <p style={{ fontFamily: SANS, fontSize: 14, color: C.muted, margin: '0 0 10px', lineHeight: 1.5 }}>
                    We will share these details with one matched SRA-regulated solicitor:
                  </p>
                  {[
                    ['Name',        form.firstName],
                    ['Email',       form.email],
                    ['Phone',       form.phone],
                    ['Postcode',    form.postcode],
                    ['Call time',   form.contactTime],
                  ].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: `1px solid ${C.border}` }}>
                      <span style={{ fontFamily: SANS, fontSize: 13, color: C.muted }}>{label}</span>
                      <span style={{ fontFamily: SANS, fontSize: 13, color: C.navy, fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}
                </div>

                {fieldError && <p style={{ color: C.error, fontSize: 13, margin: '0 0 16px', fontFamily: SANS }}>{fieldError}</p>}

                <button
                  onClick={submitLead}
                  disabled={submitting}
                  style={{
                    width: '100%', background: C.accent, border: 'none', borderRadius: 10,
                    padding: '15px 24px', color: '#fff', fontFamily: SANS, fontWeight: 600,
                    fontSize: 16, letterSpacing: '-0.005em', cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.65 : 1,
                    boxShadow: submitting ? 'none' : '0 4px 16px rgba(217,96,59,0.3)',
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentHover }}
                  onMouseLeave={e => { e.currentTarget.style.background = C.accent }}
                >
                  {submitting ? 'Submitting…' : 'Confirm and get my free match'}
                </button>

                <p style={{ fontFamily: SANS, fontSize: 12, color: C.muted, margin: '12px 0 0', lineHeight: 1.55 }}>
                  Your details go to one solicitor only. You are under no obligation after the first call. Your employer covers the legal advice fee.
                </p>
              </div>
            )}

            {/* success */}
            {currentSlide === 'success' && (
              <div style={{ textAlign: 'center' as React.CSSProperties['textAlign'] }}>
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 240, damping: 18 }}
                  style={{
                    width: 72, height: 72, borderRadius: '50%', background: '#F0FDF4',
                    border: '2px solid #86EFAC', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', margin: '0 auto 24px',
                  }}
                >
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
                <h3 style={{ fontFamily: SERIF, fontSize: 'clamp(22px, 4vw, 30px)', fontWeight: 700, color: C.navy, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                  Matched. A solicitor will call within 24 hours.
                </h3>
                <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, lineHeight: 1.65, maxWidth: 420, margin: '0 auto', textAlign: 'center' as React.CSSProperties['textAlign'] }}>
                  On <strong style={{ color: C.navy }}>{form.phone}</strong>, {form.contactTime.toLowerCase()} preferred. The advice is free. Your employer covers the cost.
                </p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Helper — find slide index given a slide id
function slideOrder(id: SlideId, prefilled: boolean): number {
  const slides: SlideId[] = prefilled
    ? ['firstName', 'postcode', 'phone', 'contactTime', 'consent', 'success']
    : ['firstName', 'email', 'otp', 'postcode', 'phone', 'contactTime', 'consent', 'success']
  return Math.max(slides.indexOf(id), 0)
}
