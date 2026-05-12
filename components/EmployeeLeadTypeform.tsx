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

const TOTAL_SLIDES = 7 // excludes success

// ── Slide animation ───────────────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit:  (dir: number) => ({ y: dir > 0 ? -32 : 32, opacity: 0 }),
}
const slideTrans = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

// ── Types ─────────────────────────────────────────────────────────────────────
type SlideId = 'firstName' | 'email' | 'otp' | 'postcode' | 'phone' | 'contactTime' | 'consent' | 'success'

interface FormData {
  firstName:       string
  email:           string
  postcode:        string
  postcode_lat:    number | null
  postcode_lng:    number | null
  postcode_region: string
  phone:           string
  contactTime:     'Morning' | 'Afternoon' | 'Evening'
}

interface Props {
  verdict:       string
  offer:         number
  salary:        number
  totalMonths:   number
  prefillEmail?: string
  emailVerified?: boolean
}

// ── Thin progress bar matching the calculator's own style ─────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: C.muted, letterSpacing: '-0.005em' }}>
          Step {step} of {total}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{pct}%</span>
      </div>
      <div style={{ height: 3, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
          style={{ height: '100%', background: C.accent, borderRadius: 999 }}
        />
      </div>
    </div>
  )
}

// ── OK button + Enter hint ────────────────────────────────────────────────────
function OkButton({ onClick, disabled = false, loading = false, label = 'OK' }: { onClick: () => void; disabled?: boolean; loading?: boolean; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as React.CSSProperties['flexWrap'], marginTop: 24 }}>
      <button
        onClick={onClick}
        disabled={disabled || loading}
        style={{
          background: disabled || loading ? C.borderStrong : C.accent,
          border: 'none', borderRadius: 8, padding: '13px 28px',
          color: '#fff', fontSize: 15, fontWeight: 600, cursor: disabled || loading ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, fontFamily: SANS,
          letterSpacing: '-0.01em', transition: 'background 0.15s ease',
          boxShadow: disabled || loading ? 'none' : '0 2px 8px rgba(217,96,59,0.22)',
        }}
        onMouseEnter={e => { if (!disabled && !loading) e.currentTarget.style.background = C.accentHover }}
        onMouseLeave={e => { e.currentTarget.style.background = disabled || loading ? C.borderStrong : C.accent }}
      >
        {loading ? 'Sending…' : (
          <>
            {label}
            {label === 'OK' && (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </>
        )}
      </button>
      {!disabled && !loading && (
        <span style={{ color: C.borderStrong, fontSize: 12, fontFamily: SANS }}>
          press{' '}
          <kbd style={{
            background: '#fff', border: `1px solid ${C.border}`, borderRadius: 4,
            padding: '2px 6px', fontFamily: SANS, fontSize: 11, color: C.muted,
          }}>
            Enter
          </kbd>
        </span>
      )}
    </div>
  )
}

// ── Question heading ──────────────────────────────────────────────────────────
function Q({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      color: C.navy, fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 700,
      letterSpacing: '-0.025em', lineHeight: 1.2, margin: '0 0 8px', fontFamily: SERIF,
    }}>
      {children}
    </h2>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: C.muted, fontSize: 15, margin: '0 0 24px', lineHeight: 1.55, fontFamily: SANS }}>
      {children}
    </p>
  )
}

function FieldError({ msg }: { msg: string }) {
  return <p style={{ color: C.error, fontSize: 13, margin: '8px 0 0', fontFamily: SANS }}>{msg}</p>
}

// ── Underline text input (matches calculator input style) ─────────────────────
function LineInput({
  inputRef, value, type = 'text', placeholder, onChange, onNext, autoComplete,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string
  type?: string
  placeholder?: string
  onChange: (v: string) => void
  onNext: () => void
  autoComplete?: string
}) {
  return (
    <input
      ref={inputRef}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onNext() } }}
      autoComplete={autoComplete ?? 'off'}
      autoCorrect="off"
      spellCheck={false}
      style={{
        display: 'block', width: '100%', background: 'transparent', border: 'none',
        borderBottom: `2px solid ${value ? C.accent : C.borderStrong}`,
        padding: '8px 0 12px', fontSize: 'clamp(20px, 3.5vw, 28px)',
        color: C.navy, outline: 'none', caretColor: C.accent,
        letterSpacing: '-0.01em', boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
        transition: 'border-color 0.18s ease', fontFamily: SANS,
      }}
      onFocus={e => { e.currentTarget.style.borderBottomColor = C.accent }}
      onBlur={e => { e.currentTarget.style.borderBottomColor = value ? C.accent : C.borderStrong }}
    />
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function EmployeeLeadTypeform({
  verdict, offer, salary, totalMonths,
  prefillEmail = '', emailVerified = false,
}: Props) {
  const startSlide: SlideId = emailVerified && prefillEmail ? 'postcode' : 'firstName'

  const SLIDES_FULL: SlideId[]    = ['firstName', 'email', 'otp', 'postcode', 'phone', 'contactTime', 'consent', 'success']
  const SLIDES_PREFILL: SlideId[] = ['firstName', 'postcode', 'phone', 'contactTime', 'consent', 'success']
  const slides = (emailVerified && !!prefillEmail) ? SLIDES_PREFILL : SLIDES_FULL

  const [slideIndex, setSlideIndex] = useState(() => Math.max(slides.indexOf(startSlide), 0))
  const [dir, setDir]               = useState(1)
  const [form, setForm]             = useState<FormData>({
    firstName: '', email: prefillEmail,
    postcode: '', postcode_lat: null, postcode_lng: null, postcode_region: '',
    phone: '', contactTime: 'Morning',
  })
  const [postcodeValid, setPostcodeValid] = useState(false)
  const [fieldError, setFieldError]       = useState('')
  const [otpDigits, setOtpDigits]         = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError]           = useState('')
  const [otpSending, setOtpSending]       = useState(false)
  const [otpVerifying, setOtpVerifying]   = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [submitting, setSubmitting]       = useState(false)

  const inputRef    = useRef<HTMLInputElement>(null)
  const otpRefs     = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])
  const postcodeRef = useRef<HTMLInputElement>(null)

  const currentSlide = slides[slideIndex]
  const isSuccess    = currentSlide === 'success'
  // Step number for progress (1-indexed, not counting success)
  const progressStep = isSuccess ? TOTAL_SLIDES : slideIndex + 1

  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  useEffect(() => {
    const t = setTimeout(() => {
      if (currentSlide === 'otp') {
        otpRefs.current[0]?.focus()
      } else if (currentSlide === 'postcode') {
        postcodeRef.current?.focus()
      } else if (!['contactTime', 'consent', 'success'].includes(currentSlide)) {
        inputRef.current?.focus()
      }
    }, 380)
    return () => clearTimeout(t)
  }, [slideIndex, currentSlide])

  const advance = useCallback(() => {
    setDir(1); setFieldError('')
    setSlideIndex(i => i + 1)
  }, [])

  const goBack = useCallback(() => {
    if (slideIndex === 0) return
    setDir(-1); setFieldError('')
    setSlideIndex(i => i - 1)
  }, [slideIndex])

  const updateField = useCallback(<K extends keyof FormData>(k: K, v: FormData[K]) => {
    setFieldError('')
    setForm(f => ({ ...f, [k]: v }))
  }, [])

  // ── OTP ──────────────────────────────────────────────────────────────────────
  const sendOtp = useCallback(async (emailAddr: string) => {
    setOtpSending(true)
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    setOtpVerifying(true); setOtpError('')
    try {
      const res = await fetch('/api/otp/verify', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
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
    setOtpError(''); setOtpDigits(['', '', '', '', '', ''])
    await sendOtp(form.email)
    otpRefs.current[0]?.focus()
  }, [resendCooldown, form.email, sendOtp])

  const handleOtpChange = useCallback((index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]; next[index] = digit
    setOtpDigits(next); setOtpError('')
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

  // ── Per-slide advance ─────────────────────────────────────────────────────────
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

  // ── Submit ────────────────────────────────────────────────────────────────────
  const submitLead = useCallback(async () => {
    if (!form.firstName.trim() || !form.email.trim() || !form.postcode || !form.phone || !form.contactTime) return
    setSubmitting(true); setFieldError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name:      form.firstName.trim(),
          email:           form.email.trim(),
          phone:           form.phone.trim(),
          contact_time:    form.contactTime,
          verdict, offer_amount: offer, salary, months_service: totalMonths,
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !['otp', 'contactTime', 'consent', 'success'].includes(currentSlide)) {
      e.preventDefault(); handleNext()
    }
  }, [currentSlide, handleNext])

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div onKeyDown={handleKeyDown} style={{ fontFamily: SANS, WebkitFontSmoothing: 'antialiased' }}>

      {/* Progress — hidden on success */}
      {!isSuccess && (
        <ProgressBar step={progressStep} total={TOTAL_SLIDES} />
      )}

      {/* Slide */}
      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={currentSlide}
          custom={dir}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={slideTrans}
          style={{ width: '100%', minHeight: 200 }}
        >

          {/* ── firstName ── */}
          {currentSlide === 'firstName' && (
            <div>
              <Q>What is your first name?</Q>
              <div style={{ height: 28 }} />
              <LineInput
                inputRef={inputRef} value={form.firstName} placeholder="Alex"
                onChange={v => updateField('firstName', v)} onNext={handleNext}
              />
              {fieldError && <FieldError msg={fieldError} />}
              <OkButton onClick={handleNext} />
            </div>
          )}

          {/* ── email ── */}
          {currentSlide === 'email' && (
            <div>
              <Q>What is your email address?</Q>
              <Hint>We&apos;ll send a 6-digit code to verify it.</Hint>
              <LineInput
                inputRef={inputRef} value={form.email} type="email"
                placeholder="alex@example.com" autoComplete="email"
                onChange={v => updateField('email', v)} onNext={handleNext}
              />
              {fieldError && <FieldError msg={fieldError} />}
              <OkButton onClick={handleNext} loading={otpSending} />
            </div>
          )}

          {/* ── OTP ── */}
          {currentSlide === 'otp' && (
            <div>
              <Q>Check your inbox</Q>
              <Hint>
                We sent a 6-digit code to{' '}
                <strong style={{ color: C.navy, fontWeight: 600 }}>{form.email}</strong>
              </Hint>
              <div onPaste={handleOtpPaste} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el }}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    aria-label={`Digit ${i + 1}`}
                    style={{
                      width: 'clamp(40px, 12vw, 52px)', height: 'clamp(48px, 13vw, 60px)',
                      textAlign: 'center', fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 700,
                      color: C.navy, background: digit ? C.accentLight : C.white,
                      border: `1.5px solid ${digit ? C.accent : C.border}`,
                      borderRadius: 8, outline: 'none', caretColor: C.accent,
                      transition: 'all 0.15s ease', fontFamily: SANS,
                    }}
                  />
                ))}
              </div>
              {otpError && <FieldError msg={otpError} />}
              <div style={{ marginTop: 20 }}>
                <button
                  onClick={() => verifyOtp()}
                  disabled={otpVerifying || !otpDigits.every(d => d)}
                  style={{
                    background: C.accent, border: 'none', borderRadius: 8, padding: '13px 28px',
                    color: '#fff', fontSize: 15, fontWeight: 600, fontFamily: SANS,
                    cursor: otpVerifying || !otpDigits.every(d => d) ? 'not-allowed' : 'pointer',
                    opacity: otpVerifying || !otpDigits.every(d => d) ? 0.5 : 1,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {otpVerifying ? 'Verifying…' : 'Verify email'}
                </button>
              </div>
              <p style={{ color: C.muted, fontSize: 13, fontFamily: SANS, marginTop: 16 }}>
                Didn&apos;t receive it?{' '}
                <button
                  onClick={resendOtp}
                  disabled={resendCooldown > 0 || otpSending}
                  style={{
                    background: 'none', border: 'none', padding: 0,
                    color: resendCooldown > 0 ? C.borderStrong : C.accent,
                    cursor: resendCooldown > 0 ? 'default' : 'pointer',
                    fontSize: 13, textDecoration: 'underline', fontFamily: SANS,
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </p>
            </div>
          )}

          {/* ── postcode ── */}
          {currentSlide === 'postcode' && (
            <div>
              <Q>What is your postcode?</Q>
              <Hint>Helps us match you with a solicitor who covers your area.</Hint>
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
              {fieldError && <FieldError msg={fieldError} />}
              <OkButton onClick={handleNext} disabled={!postcodeValid} />
            </div>
          )}

          {/* ── phone ── */}
          {currentSlide === 'phone' && (
            <div>
              <Q>Best number to reach you?</Q>
              <Hint>A solicitor will call — no automated systems.</Hint>
              <LineInput
                inputRef={inputRef} value={form.phone} type="tel"
                placeholder="07700 900 000" autoComplete="tel"
                onChange={v => updateField('phone', v)} onNext={handleNext}
              />
              {fieldError && <FieldError msg={fieldError} />}
              <OkButton onClick={handleNext} />
            </div>
          )}

          {/* ── contactTime ── */}
          {currentSlide === 'contactTime' && (
            <div>
              <Q>When is the best time to call?</Q>
              <Hint>The solicitor will try to reach you during this window.</Hint>
              <div style={{ display: 'flex', flexDirection: 'column' as React.CSSProperties['flexDirection'], gap: 10 }}>
                {(['Morning', 'Afternoon', 'Evening'] as const).map(t => {
                  const selected = form.contactTime === t
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        updateField('contactTime', t)
                        setTimeout(() => { setDir(1); setFieldError(''); setSlideIndex(i => i + 1) }, 280)
                      }}
                      style={{
                        width: '100%', padding: '15px 20px', textAlign: 'left' as React.CSSProperties['textAlign'],
                        border: `1.5px solid ${selected ? C.navy : C.border}`,
                        borderRadius: 10, fontSize: 16, fontFamily: SANS, fontWeight: selected ? 600 : 400,
                        cursor: 'pointer',
                        background: selected ? C.navy : C.white,
                        color: selected ? '#fff' : C.navy,
                        transition: 'background 120ms ease, color 120ms ease, border-color 120ms ease',
                      }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── consent ── */}
          {currentSlide === 'consent' && (
            <div>
              <Q>Confirm and get your match</Q>
              <p style={{ color: C.muted, fontSize: 15, margin: '8px 0 24px', lineHeight: 1.55, fontFamily: SANS }}>
                We will share these details with one matched SRA-regulated solicitor:
              </p>

              {/* Summary */}
              <div style={{
                border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 24,
              }}>
                {[
                  ['Name',      form.firstName],
                  ['Email',     form.email],
                  ['Phone',     form.phone],
                  ['Postcode',  form.postcode],
                  ['Call time', form.contactTime],
                ].map(([label, val], i) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px',
                    borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                    background: C.white,
                  }}>
                    <span style={{ fontFamily: SANS, fontSize: 14, color: C.muted }}>{label}</span>
                    <span style={{ fontFamily: SANS, fontSize: 14, color: C.navy, fontWeight: 500 }}>{val}</span>
                  </div>
                ))}
              </div>

              {fieldError && <FieldError msg={fieldError} />}

              <button
                onClick={submitLead}
                disabled={submitting}
                style={{
                  width: '100%', background: submitting ? C.borderStrong : C.accent,
                  border: 'none', borderRadius: 10, padding: '16px 24px',
                  color: '#fff', fontFamily: SANS, fontWeight: 600, fontSize: 16,
                  letterSpacing: '-0.005em', cursor: submitting ? 'not-allowed' : 'pointer',
                  boxShadow: submitting ? 'none' : '0 4px 16px rgba(217,96,59,0.25)',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentHover }}
                onMouseLeave={e => { e.currentTarget.style.background = submitting ? C.borderStrong : C.accent }}
              >
                {submitting ? 'Submitting…' : 'Confirm and get my free match'}
              </button>

              <p style={{ fontFamily: SANS, fontSize: 12, color: C.muted, margin: '12px 0 0', lineHeight: 1.6 }}>
                Your details go to one solicitor only. No obligation after the first call. Your employer covers the legal fee.
              </p>
            </div>
          )}

          {/* ── success ── */}
          {currentSlide === 'success' && (
            <div style={{ paddingTop: 8 }}>
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                style={{
                  width: 52, height: 52, borderRadius: '50%',
                  background: '#F0FDF4', border: '1.5px solid #86EFAC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </motion.div>
              <h3 style={{
                fontFamily: SERIF, fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 700,
                color: C.navy, margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.2,
              }}>
                Matched. A solicitor will call within 24 hours.
              </h3>
              <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, lineHeight: 1.65, margin: 0 }}>
                On <strong style={{ color: C.navy }}>{form.phone}</strong>,{' '}
                {form.contactTime.toLowerCase()} preferred.{' '}
                The advice is free — your employer covers the cost.
              </p>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* Back link — below slide, not above */}
      {slideIndex > 0 && !isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{ marginTop: 32 }}
        >
          <button
            onClick={goBack}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: C.muted, cursor: 'pointer', fontSize: 14, fontFamily: SANS,
              display: 'inline-flex', alignItems: 'center', gap: 5,
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </motion.div>
      )}

    </div>
  )
}
