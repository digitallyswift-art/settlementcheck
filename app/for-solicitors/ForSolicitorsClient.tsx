'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Types ────────────────────────────────────────────────────────────────────

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
  stepLabel?: string
}

// ─── Slide definitions ────────────────────────────────────────────────────────

const SLIDES: SlideConfig[] = [
  { id: 'welcome' },
  {
    id: 'firmName',
    inputField: 'firmName',
    question: 'What is your firm’s name?',
    placeholder: 'Smith Employment Law',
    stepLabel: 'Step 1 of 7',
  },
  {
    id: 'contactName',
    inputField: 'contactName',
    question: 'And your name?',
    placeholder: 'Jane Smith',
    stepLabel: 'Step 2 of 7',
  },
  {
    id: 'email',
    inputField: 'email',
    question: 'What’s your work email address?',
    hint: 'We’ll send a 6-digit verification code',
    placeholder: 'jane@smithlaw.co.uk',
    type: 'email',
    stepLabel: 'Step 3 of 7',
  },
  { id: 'otp', stepLabel: 'Step 4 of 7' },
  {
    id: 'phone',
    inputField: 'phone',
    question: 'What’s the best phone number to reach you?',
    hint: 'Optional — we’ll use email to start',
    placeholder: '07700 900 000',
    type: 'tel',
    optional: true,
    stepLabel: 'Step 5 of 7',
  },
  {
    id: 'coverage',
    inputField: 'coverage',
    question: 'Which geographic areas do you cover?',
    placeholder: 'London, South East',
    hint: 'e.g. London, South East, Manchester',
    stepLabel: 'Step 6 of 7',
  },
  { id: 'sra', stepLabel: 'Step 7 of 7' },
  { id: 'success' },
]

// ─── Animation variants ────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({
    y: dir > 0 ? 56 : -56,
    opacity: 0,
  }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({
    y: dir > 0 ? -56 : 56,
    opacity: 0,
  }),
}

const slideTrans = {
  duration: 0.38,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

// ─── Main component ───────────────────────────────────────────────────────────

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
  const totalInputSlides = 7 // firm, contact, email, otp, phone, coverage, sra
  const progressPct =
    currentSlide.id === 'welcome' || currentSlide.id === 'success'
      ? currentSlide.id === 'success'
        ? 100
        : 0
      : ((slideIndex - 1) / totalInputSlides) * 100

  // Focus input when slide changes
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentSlide.id === 'otp') {
        otpRefs.current[0]?.focus()
      } else if (currentSlide.id !== 'welcome' && currentSlide.id !== 'sra' && currentSlide.id !== 'success') {
        inputRef.current?.focus()
      }
    }, 420)
    return () => clearTimeout(t)
  }, [slideIndex, currentSlide.id])

  // OTP resend countdown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // ─── Navigation ───────────────────────────────────────────────────────────

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

  // ─── OTP flow ─────────────────────────────────────────────────────────────

  const sendOtp = useCallback(async (emailAddr: string) => {
    setOtpSending(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailAddr, form_type: 'solicitor' }),
      })
      if (!res.ok) throw new Error('send_failed')
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

  // ─── OTP digit handlers ────────────────────────────────────────────────────

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1)
      const next = [...otpDigits]
      next[index] = digit
      setOtpDigits(next)
      setOtpError('')
      if (digit && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
      if (digit && index === 5) {
        const full = [...next]
        if (full.every((d) => d)) {
          setTimeout(() => verifyOtp(full), 80)
        }
      }
    },
    [otpDigits, verifyOtp]
  )

  const handleOtpKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
        otpRefs.current[index - 1]?.focus()
      }
      if (e.key === 'Enter' && otpDigits.join('').length === 6) {
        verifyOtp()
      }
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
      const focusIdx = Math.min(pasted.length, 5)
      otpRefs.current[focusIdx]?.focus()
      if (pasted.length === 6) {
        setTimeout(() => verifyOtp(next), 80)
      }
    },
    [verifyOtp]
  )

  // ─── Per-slide advance logic ────────────────────────────────────────────────

  const handleNext = useCallback(async () => {
    setFieldError('')
    const id = currentSlide.id

    if (id === 'firmName') {
      if (!form.firmName.trim()) {
        setFieldError('Please enter your firm name')
        return
      }
      advance()
      return
    }

    if (id === 'contactName') {
      if (!form.contactName.trim()) {
        setFieldError('Please enter your name')
        return
      }
      advance()
      return
    }

    if (id === 'email') {
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        setFieldError('Please enter a valid email address')
        return
      }
      const ok = await sendOtp(form.email)
      if (ok) advance()
      return
    }

    if (id === 'phone') {
      advance()
      return
    }

    if (id === 'coverage') {
      if (!form.coverage.trim()) {
        setFieldError('Please enter your geographic coverage')
        return
      }
      advance()
      return
    }
  }, [currentSlide.id, form, advance, sendOtp])

  // Submit the full application
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
      if (!res.ok) throw new Error('submit_failed')
      advance()
    } catch {
      setFieldError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [form, advance])

  const updateField = useCallback(
    (field: keyof FormData, value: string) => {
      setFieldError('')
      setForm((f) => ({ ...f, [field]: value }))
    },
    []
  )

  // ─── Keyboard handler ──────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const id = currentSlide.id
      if (
        e.key === 'Enter' &&
        id !== 'otp' &&
        id !== 'sra' &&
        id !== 'welcome' &&
        id !== 'success'
      ) {
        e.preventDefault()
        handleNext()
      }
    },
    [currentSlide.id, handleNext]
  )

  // ─── Render ────────────────────────────────────────────────────────────────

  const showBack = slideIndex > 0 && currentSlide.id !== 'success'
  const showProgress = currentSlide.id !== 'welcome' && currentSlide.id !== 'success'

  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        background: '#0f1117',
        minHeight: '100vh',
        position: 'relative',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden',
      }}
    >
      {/* Progress bar */}
      {showProgress && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: 'rgba(255,255,255,0.08)',
            zIndex: 100,
          }}
        >
          <motion.div
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: '#f97316',
              borderRadius: '0 2px 2px 0',
            }}
          />
        </div>
      )}

      {/* Back button */}
      {showBack && (
        <button
          onClick={goBack}
          aria-label="Go back"
          style={{
            position: 'fixed',
            top: 20,
            left: 20,
            zIndex: 100,
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '7px 14px',
            color: 'rgba(255,255,255,0.55)',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg
            width="14"
            height="14"
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
      )}

      {/* Wordmark */}
      <div
        style={{
          position: 'fixed',
          top: 20,
          right: 24,
          zIndex: 100,
        }}
      >
        <span
          style={{
            color: 'rgba(255,255,255,0.35)',
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: '-0.01em',
          }}
        >
          SettlementCheck
        </span>
      </div>

      {/* Slide container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '80px 24px 60px',
        }}
      >
        <div style={{ width: '100%', maxWidth: 640, position: 'relative' }}>
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
              {/* ── WELCOME ─────────────────────────────────────────────── */}
              {currentSlide.id === 'welcome' && (
                <WelcomeSlide onStart={() => { setDir(1); setSlideIndex(1) }} />
              )}

              {/* ── TEXT INPUT SLIDES ────────────────────────────────────── */}
              {currentSlide.inputField && (
                <TextInputSlide
                  stepLabel={currentSlide.stepLabel}
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

              {/* ── OTP ─────────────────────────────────────────────────── */}
              {currentSlide.id === 'otp' && (
                <OtpSlide
                  stepLabel={currentSlide.stepLabel!}
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

              {/* ── SRA CONFIRMATION ─────────────────────────────────────── */}
              {currentSlide.id === 'sra' && (
                <SraSlide
                  stepLabel={currentSlide.stepLabel!}
                  firmName={form.firmName}
                  submitting={submitting}
                  error={fieldError}
                  onConfirm={submitApplication}
                />
              )}

              {/* ── SUCCESS ──────────────────────────────────────────────── */}
              {currentSlide.id === 'success' && <SuccessSlide />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function WelcomeSlide({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(249,115,22,0.12)',
          border: '1px solid rgba(249,115,22,0.25)',
          borderRadius: 24,
          padding: '5px 14px',
          color: '#f97316',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: 32,
        }}
      >
        For solicitors
      </div>
      <h1
        style={{
          color: '#fff',
          fontSize: 'clamp(30px, 5.5vw, 52px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: '0 0 20px',
        }}
      >
        Join our solicitor panel
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 18,
          lineHeight: 1.65,
          maxWidth: 460,
          margin: '0 auto 48px',
        }}
      >
        Receive pre-qualified settlement agreement leads. Every enquiry includes
        offer amount, salary, and years of service. You only pay when we deliver.
      </p>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'center',
          marginBottom: 48,
        }}
      >
        {['Pre-qualified leads', 'Verified email', '£60 per introduction', 'No subscription'].map(
          (item) => (
            <span
              key={item}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 20,
                padding: '5px 12px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 13,
              }}
            >
              {item}
            </span>
          )
        )}
      </div>
      <button
        onClick={onStart}
        style={{
          background: '#f97316',
          border: 'none',
          borderRadius: 12,
          padding: '16px 40px',
          color: '#fff',
          fontSize: 17,
          fontWeight: 700,
          cursor: 'pointer',
          letterSpacing: '-0.01em',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
        }}
      >
        Apply now
        <svg
          width="18"
          height="18"
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
    </div>
  )
}

interface TextInputSlideProps {
  stepLabel?: string
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
  stepLabel,
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
      {stepLabel && (
        <div
          style={{
            color: 'rgba(255,255,255,0.3)',
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          {stepLabel}
        </div>
      )}
      <h2
        style={{
          color: '#fff',
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 8px',
        }}
      >
        {question}
      </h2>
      {hint && (
        <p
          style={{
            color: 'rgba(255,255,255,0.38)',
            fontSize: 15,
            margin: '0 0 32px',
            lineHeight: 1.5,
          }}
        >
          {hint}
        </p>
      )}
      {!hint && <div style={{ height: 32 }} />}

      <input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
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
          borderBottom: `2px solid ${value ? '#f97316' : 'rgba(255,255,255,0.18)'}`,
          padding: '10px 0 14px',
          fontSize: 'clamp(20px, 3.5vw, 28px)',
          color: '#fff',
          outline: 'none',
          caretColor: '#f97316',
          letterSpacing: '-0.01em',
          marginBottom: 8,
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease',
        }}
      />

      {error && (
        <p
          style={{
            color: '#f87171',
            fontSize: 13,
            margin: '0 0 16px',
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
            background: '#f97316',
            border: 'none',
            borderRadius: 10,
            padding: '13px 28px',
            color: '#fff',
            fontSize: 15,
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.65 : 1,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            letterSpacing: '-0.01em',
          }}
        >
          {loading ? (
            'Sending…'
          ) : showSkip ? (
            'Skip'
          ) : (
            <>
              OK
              <svg
                width="14"
                height="14"
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
        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
          press{' '}
          <kbd
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 4,
              padding: '2px 7px',
              fontFamily: 'inherit',
              fontSize: 11,
              color: 'rgba(255,255,255,0.45)',
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
  stepLabel: string
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
  stepLabel,
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
      <div
        style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        {stepLabel}
      </div>
      <h2
        style={{
          color: '#fff',
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 10px',
        }}
      >
        Check your inbox
      </h2>
      <p
        style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: 15,
          margin: '0 0 36px',
          lineHeight: 1.55,
        }}
      >
        We sent a 6-digit code to{' '}
        <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{email}</span>
      </p>

      {/* Digit boxes */}
      <div
        onPaste={onPaste}
        style={{ display: 'flex', gap: 10, marginBottom: 20 }}
      >
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              otpRefs.current[i] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => onDigitChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            aria-label={`Digit ${i + 1}`}
            style={{
              width: 'clamp(42px, 10vw, 54px)',
              height: 'clamp(52px, 12vw, 64px)',
              textAlign: 'center',
              fontSize: 'clamp(22px, 5vw, 30px)',
              fontWeight: 700,
              color: '#fff',
              background: digit ? 'rgba(249,115,22,0.12)' : 'rgba(255,255,255,0.05)',
              border: `2px solid ${digit ? '#f97316' : 'rgba(255,255,255,0.12)'}`,
              borderRadius: 10,
              outline: 'none',
              caretColor: '#f97316',
              transition: 'all 0.15s ease',
              fontVariantNumeric: 'tabular-nums',
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 16px' }}>{error}</p>
      )}

      <button
        onClick={onVerify}
        disabled={verifying || !filled}
        style={{
          background: '#f97316',
          border: 'none',
          borderRadius: 10,
          padding: '13px 28px',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: verifying || !filled ? 'not-allowed' : 'pointer',
          opacity: verifying || !filled ? 0.5 : 1,
          marginBottom: 20,
          letterSpacing: '-0.01em',
        }}
      >
        {verifying ? 'Verifying…' : 'Verify email'}
      </button>

      <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: 13 }}>
        Didn&apos;t receive it?{' '}
        <button
          onClick={onResend}
          disabled={resendCooldown > 0 || resending}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            color:
              resendCooldown > 0
                ? 'rgba(255,255,255,0.2)'
                : 'rgba(255,255,255,0.55)',
            cursor: resendCooldown > 0 ? 'default' : 'pointer',
            fontSize: 13,
            textDecoration: 'underline',
            letterSpacing: '-0.01em',
          }}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
        </button>
      </div>
    </div>
  )
}

interface SraSlideProps {
  stepLabel: string
  firmName: string
  submitting: boolean
  error: string
  onConfirm: () => void
}

function SraSlide({ stepLabel, firmName, submitting, error, onConfirm }: SraSlideProps) {
  return (
    <div>
      <div
        style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}
      >
        {stepLabel}
      </div>
      <h2
        style={{
          color: '#fff',
          fontSize: 'clamp(22px, 4vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 20px',
        }}
      >
        One last thing
      </h2>
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 12,
          padding: '20px 24px',
          color: 'rgba(255,255,255,0.75)',
          fontSize: 16,
          lineHeight: 1.65,
          marginBottom: 36,
        }}
      >
        I confirm that{' '}
        <strong style={{ color: '#fff', fontWeight: 600 }}>
          {firmName || 'this firm'}
        </strong>{' '}
        is regulated by the Solicitors Regulation Authority (SRA) and authorised to
        advise on settlement agreements.
      </div>

      {error && (
        <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 16px' }}>{error}</p>
      )}

      <button
        onClick={onConfirm}
        disabled={submitting}
        style={{
          background: '#f97316',
          border: 'none',
          borderRadius: 12,
          padding: '15px 36px',
          color: '#fff',
          fontSize: 16,
          fontWeight: 700,
          cursor: submitting ? 'not-allowed' : 'pointer',
          opacity: submitting ? 0.65 : 1,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          letterSpacing: '-0.01em',
          boxShadow: submitting ? 'none' : '0 4px 20px rgba(249,115,22,0.3)',
        }}
      >
        {submitting ? (
          'Submitting…'
        ) : (
          <>
            Yes, confirm &amp; apply
            <svg
              width="17"
              height="17"
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

function SuccessSlide() {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 220, damping: 18 }}
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(34,197,94,0.12)',
          border: '2px solid rgba(34,197,94,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 32px',
        }}
      >
        <svg
          width="34"
          height="34"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </motion.div>
      <h1
        style={{
          color: '#fff',
          fontSize: 'clamp(26px, 4.5vw, 44px)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: '0 0 16px',
        }}
      >
        Application received
      </h1>
      <p
        style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 18,
          lineHeight: 1.6,
          maxWidth: 400,
          margin: '0 auto',
        }}
      >
        We&apos;ll review your application and be in touch within 2 business days.
        Welcome to SettlementCheck.
      </p>
    </div>
  )
}
