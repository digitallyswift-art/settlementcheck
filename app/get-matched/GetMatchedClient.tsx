'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostcodeInput from '@/components/PostcodeInput'

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

// ── Slide config ──────────────────────────────────────────────────────────────
type SlideId = 'firstName' | 'email' | 'otp' | 'postcode' | 'phone' | 'contactTime' | 'consent' | 'success'

// Full slide order when email not pre-verified, prefilled when it is
const SLIDES_FULL:    SlideId[] = ['firstName', 'email', 'otp', 'postcode', 'phone', 'contactTime', 'consent', 'success']
const SLIDES_PREFILL: SlideId[] = ['firstName', 'postcode', 'phone', 'contactTime', 'consent', 'success']
const TOTAL_STEPS = 7 // excludes success

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

// ── Motion variants ───────────────────────────────────────────────────────────
const variants = {
  enter: (dir: number) => ({ y: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit:  (dir: number) => ({ y: dir > 0 ? -40 : 40, opacity: 0 }),
}
const trans = { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      aria-label="SettlementCheck home"
    >
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.5" />
        <path d="M6 11.5L9.5 15L16 7.5" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1 }}>
        <span style={{ color: C.accent }}>Settlement</span>
        <span style={{ color: C.navy }}>Check</span>
      </span>
    </button>
  )
}

// ── Question heading ──────────────────────────────────────────────────────────
function Q({ children }: { children: React.ReactNode }) {
  return (
    <h1 style={{
      color: C.navy, fontFamily: SERIF,
      fontSize: 'clamp(26px, 5vw, 40px)',
      fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15,
      margin: '0 0 10px',
    }}>
      {children}
    </h1>
  )
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: C.muted, fontSize: 16, margin: '0 0 28px', lineHeight: 1.6, fontFamily: SANS }}>
      {children}
    </p>
  )
}

function FieldError({ msg }: { msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ color: C.error, fontSize: 13, margin: '8px 0 0', fontFamily: SANS }}
    >
      {msg}
    </motion.p>
  )
}

// ── Underline text input ──────────────────────────────────────────────────────
function LineInput({
  inputRef, value, type = 'text', placeholder, onChange, onEnter, autoComplete,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>
  value: string; type?: string; placeholder?: string
  onChange: (v: string) => void; onEnter: () => void; autoComplete?: string
}) {
  return (
    <input
      ref={inputRef}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onEnter() } }}
      autoComplete={autoComplete ?? 'off'}
      autoCorrect="off"
      spellCheck={false}
      style={{
        display: 'block', width: '100%', background: 'transparent', border: 'none',
        borderBottom: `2.5px solid ${value ? C.accent : C.borderStrong}`,
        padding: '10px 0 14px', fontSize: 'clamp(22px, 3.5vw, 32px)',
        color: C.navy, outline: 'none', caretColor: C.accent,
        letterSpacing: '-0.01em', boxSizing: 'border-box' as React.CSSProperties['boxSizing'],
        transition: 'border-color 0.18s ease', fontFamily: SANS,
      }}
      onFocus={e => { e.currentTarget.style.borderBottomColor = C.accent }}
      onBlur={e => { e.currentTarget.style.borderBottomColor = value ? C.accent : C.borderStrong }}
    />
  )
}

// ── OK button ─────────────────────────────────────────────────────────────────
function OkBtn({
  onClick, disabled = false, loading = false, label = 'OK', wide = false,
}: {
  onClick: () => void; disabled?: boolean; loading?: boolean; label?: string; wide?: boolean
}) {
  const inactive = disabled || loading
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' as React.CSSProperties['flexWrap'], marginTop: 28 }}>
      <button
        onClick={onClick}
        disabled={inactive}
        style={{
          background: inactive ? C.borderStrong : C.accent,
          border: 'none', borderRadius: 10,
          padding: wide ? '15px 32px' : '13px 28px',
          color: '#fff', fontSize: 16, fontWeight: 600,
          cursor: inactive ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', gap: 8, fontFamily: SANS,
          letterSpacing: '-0.01em',
          boxShadow: inactive ? 'none' : '0 3px 12px rgba(217,96,59,0.28)',
          transition: 'background 0.15s ease, box-shadow 0.15s ease',
          width: wide ? '100%' : undefined,
          justifyContent: wide ? 'center' : undefined,
        }}
        onMouseEnter={e => { if (!inactive) e.currentTarget.style.background = C.accentHover }}
        onMouseLeave={e => { e.currentTarget.style.background = inactive ? C.borderStrong : C.accent }}
      >
        {loading ? 'Sending…' : (
          <>
            {label}
            {label === 'OK' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </>
        )}
      </button>
      {!inactive && !wide && (
        <span style={{ color: C.borderStrong, fontSize: 12, fontFamily: SANS }}>
          press{' '}
          <kbd style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 6px', fontFamily: SANS, fontSize: 11, color: C.muted }}>
            Enter
          </kbd>
        </span>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function GetMatchedClient() {
  const router       = useRouter()
  const params       = useSearchParams()

  // Context passed from results page
  const verdict      = params.get('verdict')      ?? ''
  const offerAmount  = parseFloat(params.get('offer')   ?? '0')
  const salaryAmount = parseFloat(params.get('salary')  ?? '0')
  const totalMonths  = parseInt(params.get('months')    ?? '0')
  const prefillEmail = params.get('email')        ?? ''
  const emailVerifiedParam = params.get('ev')     === '1'

  const prefilled = emailVerifiedParam && !!prefillEmail
  const slides    = prefilled ? SLIDES_PREFILL : SLIDES_FULL

  const [slideIndex, setSlideIndex]       = useState(() => 0)
  const [dir, setDir]                     = useState(1)
  const [form, setForm]                   = useState<FormData>({
    firstName: '', email: prefillEmail,
    postcode: '', postcode_lat: null, postcode_lng: null, postcode_region: '',
    phone: '', contactTime: 'Morning',
  })
  const [postcodeValid, setPostcodeValid] = useState(false)
  const [fieldError, setFieldError]       = useState('')
  const [otpDigits, setOtpDigits]         = useState(['','','','','',''])
  const [otpError, setOtpError]           = useState('')
  const [otpSending, setOtpSending]       = useState(false)
  const [otpVerifying, setOtpVerifying]   = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [submitting, setSubmitting]       = useState(false)

  const inputRef    = useRef<HTMLInputElement>(null)
  const otpRefs     = useRef<(HTMLInputElement | null)[]>([null,null,null,null,null,null])
  const postcodeRef = useRef<HTMLInputElement>(null)

  const currentSlide = slides[slideIndex]
  const isSuccess    = currentSlide === 'success'
  const stepNum      = isSuccess ? TOTAL_STEPS : slideIndex + 1
  const progressPct  = isSuccess ? 100 : Math.round((slideIndex / (slides.length - 1)) * 100)
  const showBack     = slideIndex > 0 && !isSuccess
  const showProgress = !isSuccess

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Auto-focus
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentSlide === 'otp') otpRefs.current[0]?.focus()
      else if (currentSlide === 'postcode') postcodeRef.current?.focus()
      else if (!['contactTime', 'consent', 'success'].includes(currentSlide)) inputRef.current?.focus()
    }, 380)
    return () => clearTimeout(t)
  }, [slideIndex, currentSlide])

  // GA4 step tracking
  useEffect(() => {
    if (typeof window === 'undefined') return
    const w = window as any
    if (typeof w.gtag === 'function') {
      w.gtag('event', 'lead_form_step', {
        event_category: 'employee_lead',
        step_id: currentSlide,
        step_number: stepNum,
      })
    }
    if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event: 'lead_form_step', stepId: currentSlide, stepNumber: stepNum })
    }
  }, [currentSlide, stepNum])

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
      if (data.success) { advance() }
      else {
        setOtpError(data.message || 'Incorrect code. Please try again.')
        setOtpDigits(['','','','','',''])
        otpRefs.current[0]?.focus()
      }
    } catch { setOtpError('Verification failed. Please try again.') }
    finally { setOtpVerifying(false) }
  }, [otpDigits, form.email, advance])

  const resendOtp = useCallback(async () => {
    if (resendCooldown > 0) return
    setOtpError(''); setOtpDigits(['','','','','',''])
    await sendOtp(form.email)
    otpRefs.current[0]?.focus()
  }, [resendCooldown, form.email, sendOtp])

  const handleOtpChange = useCallback((i: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otpDigits]; next[i] = digit
    setOtpDigits(next); setOtpError('')
    if (digit && i < 5) otpRefs.current[i + 1]?.focus()
    if (digit && i === 5 && next.every(d => d)) setTimeout(() => verifyOtp(next), 80)
  }, [otpDigits, verifyOtp])

  const handleOtpKeyDown = useCallback((i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[i] && i > 0) otpRefs.current[i - 1]?.focus()
    if (e.key === 'Enter' && otpDigits.join('').length === 6) verifyOtp()
  }, [otpDigits, verifyOtp])

  const handleOtpPaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const next = ['','','','','','']
    pasted.split('').forEach((d, i) => { next[i] = d })
    setOtpDigits(next)
    otpRefs.current[Math.min(pasted.length, 5)]?.focus()
    if (pasted.length === 6) setTimeout(() => verifyOtp(next), 80)
  }, [verifyOtp])

  // ── Per-slide advance ─────────────────────────────────────────────────────────
  const handleNext = useCallback(async () => {
    setFieldError('')
    if (currentSlide === 'firstName') {
      if (!form.firstName.trim()) { setFieldError('Please enter your first name'); return }
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
        setFieldError('Please enter your phone number'); return
      }
      advance()
    }
  }, [currentSlide, form, postcodeValid, advance, sendOtp])

  // ── Submit ────────────────────────────────────────────────────────────────────
  const submitLead = useCallback(async () => {
    setSubmitting(true); setFieldError('')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name:      form.firstName.trim(),
          email:           form.email.trim(),
          phone:           form.phone.trim(),
          contact_time:    form.contactTime,
          verdict,
          offer_amount:    offerAmount,
          salary:          salaryAmount,
          months_service:  totalMonths,
          consent:         true,
          postcode:        form.postcode,
          postcode_region: form.postcode_region,
          postcode_lat:    form.postcode_lat,
          postcode_lng:    form.postcode_lng,
        }),
      })
      if (!res.ok) throw new Error()
      // Fire conversion event
      const w = window as any
      if (typeof w.gtag === 'function') w.gtag('event', 'lead_submitted', { event_category: 'employee_lead', verdict })
      if (Array.isArray(w.dataLayer)) w.dataLayer.push({ event: 'lead_submitted', verdict })
      advance()
    } catch {
      setFieldError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }, [form, verdict, offerAmount, salaryAmount, totalMonths, advance])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !['otp','contactTime','consent','success'].includes(currentSlide)) {
      e.preventDefault(); handleNext()
    }
  }, [currentSlide, handleNext])

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div
      onKeyDown={handleKeyDown}
      style={{
        background: C.bg, minHeight: '100vh',
        fontFamily: SANS, WebkitFontSmoothing: 'antialiased',
        overflowX: 'hidden', position: 'relative',
      }}
    >
      {/* ── Fixed header ────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        background: 'rgba(247,244,238,0.92)',
        backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', zIndex: 200,
      }}>
        <Logo onClick={() => router.push('/')} />

        {showBack ? (
          <button
            onClick={goBack}
            style={{
              background: 'none', border: `1px solid ${C.border}`, borderRadius: 6,
              padding: '6px 12px', color: C.muted, cursor: 'pointer',
              fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center',
              gap: 5, fontFamily: SANS,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          /* Back to results link — always visible on step 1 */
          <a
            href={typeof window !== 'undefined' ? document.referrer || '/calculator' : '/calculator'}
            onClick={e => { e.preventDefault(); router.back() }}
            style={{
              fontSize: 13, color: C.muted, fontFamily: SANS,
              display: 'flex', alignItems: 'center', gap: 4,
              textDecoration: 'none',
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to results
          </a>
        )}
      </div>

      {/* ── Fixed progress bar ───────────────────────────────────────────────── */}
      {showProgress && (
        <div style={{
          position: 'fixed', top: 64, left: 0, right: 0, zIndex: 100,
          background: C.white, borderBottom: `1px solid ${C.border}`,
          padding: '14px 24px',
        }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 500, color: C.muted }}>
                Step {stepNum} of {TOTAL_STEPS}
              </span>
              <span style={{ fontFamily: SANS, fontSize: 12, color: C.muted }}>{progressPct}%</span>
            </div>
            <div style={{ height: 3, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
              <motion.div
                animate={{ width: `${progressPct}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                style={{ height: '100%', background: C.accent, borderRadius: 999 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Slide container ─────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh',
        padding: showProgress ? '178px 24px 80px' : '100px 24px 80px',
      }}>
        <div style={{ width: '100%', maxWidth: 560 }}>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={currentSlide}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={trans}
            >

              {/* ── firstName ──────────────────────────────────────────────── */}
              {currentSlide === 'firstName' && (
                <div>
                  <Q>What is your first name?</Q>
                  <div style={{ height: 32 }} />
                  <LineInput
                    inputRef={inputRef} value={form.firstName} placeholder="Alex"
                    onChange={v => updateField('firstName', v)} onEnter={handleNext}
                  />
                  {fieldError && <FieldError msg={fieldError} />}
                  <OkBtn onClick={handleNext} />
                </div>
              )}

              {/* ── email ──────────────────────────────────────────────────── */}
              {currentSlide === 'email' && (
                <div>
                  <Q>What is your email address?</Q>
                  <Hint>We&apos;ll send a 6-digit code to verify it. Takes 30 seconds.</Hint>
                  <LineInput
                    inputRef={inputRef} value={form.email} type="email"
                    placeholder="alex@example.com" autoComplete="email"
                    onChange={v => updateField('email', v)} onEnter={handleNext}
                  />
                  {fieldError && <FieldError msg={fieldError} />}
                  <OkBtn onClick={handleNext} loading={otpSending} />
                </div>
              )}

              {/* ── OTP ────────────────────────────────────────────────────── */}
              {currentSlide === 'otp' && (
                <div>
                  <Q>Check your inbox</Q>
                  <Hint>
                    We sent a 6-digit code to{' '}
                    <strong style={{ color: C.navy, fontWeight: 600 }}>{form.email}</strong>
                  </Hint>
                  <div onPaste={handleOtpPaste} style={{ display: 'flex', gap: 10 }}>
                    {otpDigits.map((digit, i) => (
                      <input
                        key={i}
                        ref={el => { otpRefs.current[i] = el }}
                        type="text" inputMode="numeric" maxLength={1} value={digit}
                        onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(i, e)}
                        aria-label={`Digit ${i + 1}`}
                        style={{
                          width: 'clamp(44px, 13vw, 60px)', height: 'clamp(54px, 15vw, 70px)',
                          textAlign: 'center', fontSize: 'clamp(22px, 5vw, 30px)',
                          fontWeight: 700, color: C.navy,
                          background: digit ? C.accentLight : C.white,
                          border: `1.5px solid ${digit ? C.accent : C.border}`,
                          borderRadius: 10, outline: 'none', caretColor: C.accent,
                          transition: 'all 0.15s ease', fontFamily: SANS,
                          boxShadow: digit ? `0 0 0 3px ${C.accent}18` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  {otpError && <FieldError msg={otpError} />}
                  <div style={{ marginTop: 24 }}>
                    <button
                      onClick={() => verifyOtp()}
                      disabled={otpVerifying || !otpDigits.every(d => d)}
                      style={{
                        background: C.accent, border: 'none', borderRadius: 10,
                        padding: '13px 28px', color: '#fff', fontSize: 15,
                        fontWeight: 600, fontFamily: SANS,
                        cursor: otpVerifying || !otpDigits.every(d => d) ? 'not-allowed' : 'pointer',
                        opacity: otpVerifying || !otpDigits.every(d => d) ? 0.45 : 1,
                        boxShadow: '0 3px 12px rgba(217,96,59,0.28)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {otpVerifying ? 'Verifying…' : 'Verify code'}
                    </button>
                  </div>
                  <p style={{ color: C.muted, fontSize: 13, fontFamily: SANS, marginTop: 20 }}>
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

              {/* ── postcode ───────────────────────────────────────────────── */}
              {currentSlide === 'postcode' && (
                <div>
                  <Q>What is your postcode?</Q>
                  <Hint>We use this to match you with a solicitor who covers your area.</Hint>
                  <PostcodeInput
                    value={form.postcode}
                    onChange={v => { updateField('postcode', v); setPostcodeValid(false) }}
                    onValidated={lookup => {
                      if (lookup) {
                        setForm(f => ({
                          ...f,
                          postcode: lookup.postcode,
                          postcode_lat: lookup.latitude,
                          postcode_lng: lookup.longitude,
                          postcode_region: lookup.admin_district,
                        }))
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
                  <OkBtn onClick={handleNext} disabled={!postcodeValid} />
                </div>
              )}

              {/* ── phone ──────────────────────────────────────────────────── */}
              {currentSlide === 'phone' && (
                <div>
                  <Q>Best number to reach you?</Q>
                  <Hint>A solicitor — not an automated system — will call you directly.</Hint>
                  <LineInput
                    inputRef={inputRef} value={form.phone} type="tel"
                    placeholder="07700 900 000" autoComplete="tel"
                    onChange={v => updateField('phone', v)} onEnter={handleNext}
                  />
                  {fieldError && <FieldError msg={fieldError} />}
                  <OkBtn onClick={handleNext} />
                </div>
              )}

              {/* ── contactTime ────────────────────────────────────────────── */}
              {currentSlide === 'contactTime' && (
                <div>
                  <Q>When is the best time to call?</Q>
                  <Hint>The solicitor will call you during this window on a working day.</Hint>
                  <div style={{ display: 'flex', flexDirection: 'column' as React.CSSProperties['flexDirection'], gap: 12 }}>
                    {([
                      { value: 'Morning',   label: 'Morning',   sub: '9am – 12pm' },
                      { value: 'Afternoon', label: 'Afternoon', sub: '12pm – 5pm' },
                      { value: 'Evening',   label: 'Evening',   sub: '5pm – 7pm'  },
                    ] as const).map(opt => {
                      const sel = form.contactTime === opt.value
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            updateField('contactTime', opt.value)
                            setTimeout(() => { setDir(1); setFieldError(''); setSlideIndex(i => i + 1) }, 280)
                          }}
                          style={{
                            width: '100%', padding: '16px 20px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: `1.5px solid ${sel ? C.navy : C.border}`,
                            borderRadius: 12, cursor: 'pointer',
                            background: sel ? C.navy : C.white,
                            color: sel ? '#fff' : C.navy,
                            transition: 'all 120ms ease', textAlign: 'left' as React.CSSProperties['textAlign'],
                          }}
                        >
                          <span style={{ fontSize: 16, fontWeight: sel ? 600 : 400, fontFamily: SANS }}>{opt.label}</span>
                          <span style={{ fontSize: 13, opacity: 0.65, fontFamily: SANS }}>{opt.sub}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── consent ────────────────────────────────────────────────── */}
              {currentSlide === 'consent' && (
                <div>
                  <Q>Almost done.</Q>
                  <p style={{ color: C.muted, fontSize: 16, margin: '8px 0 24px', lineHeight: 1.6, fontFamily: SANS }}>
                    We&apos;ll share these details with one matched SRA-regulated solicitor — no one else.
                  </p>

                  {/* Summary card */}
                  <div style={{
                    border: `1px solid ${C.border}`, borderRadius: 12,
                    overflow: 'hidden', marginBottom: 28,
                    boxShadow: '0 1px 4px rgba(11,31,58,0.06)',
                  }}>
                    {[
                      { label: 'Name',      value: form.firstName },
                      { label: 'Email',     value: form.email },
                      { label: 'Phone',     value: form.phone },
                      { label: 'Postcode',  value: form.postcode },
                      { label: 'Call time', value: form.contactTime },
                    ].map(({ label, value }, i) => (
                      <div key={label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '13px 18px',
                        borderTop: i > 0 ? `1px solid ${C.border}` : 'none',
                        background: C.white,
                      }}>
                        <span style={{ fontFamily: SANS, fontSize: 14, color: C.muted }}>{label}</span>
                        <span style={{ fontFamily: SANS, fontSize: 14, color: C.navy, fontWeight: 500 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {fieldError && <FieldError msg={fieldError} />}

                  <button
                    onClick={submitLead}
                    disabled={submitting}
                    style={{
                      width: '100%', background: submitting ? C.borderStrong : C.accent,
                      border: 'none', borderRadius: 12, padding: '17px 24px',
                      color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 17,
                      letterSpacing: '-0.01em', cursor: submitting ? 'not-allowed' : 'pointer',
                      boxShadow: submitting ? 'none' : '0 4px 20px rgba(217,96,59,0.32)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = C.accentHover }}
                    onMouseLeave={e => { e.currentTarget.style.background = submitting ? C.borderStrong : C.accent }}
                  >
                    {submitting ? 'Submitting…' : 'Confirm — get my free specialist match'}
                  </button>

                  <p style={{ fontFamily: SANS, fontSize: 13, color: C.muted, margin: '16px 0 0', lineHeight: 1.65 }}>
                    Your details go to one SRA-regulated solicitor only. No obligation after the first call. Your employer is legally required to cover your independent legal advice fee.
                  </p>
                </div>
              )}

              {/* ── success ────────────────────────────────────────────────── */}
              {currentSlide === 'success' && (
                <div>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                    style={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: '#F0FDF4', border: '2px solid #86EFAC',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 28,
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <h1 style={{
                      fontFamily: SERIF, fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700,
                      color: C.navy, margin: '0 0 16px', letterSpacing: '-0.025em', lineHeight: 1.15,
                    }}>
                      You&apos;re matched.
                    </h1>
                    <p style={{ fontFamily: SANS, fontSize: 17, color: C.muted, lineHeight: 1.7, margin: '0 0 12px' }}>
                      A specialist employment solicitor will call you on{' '}
                      <strong style={{ color: C.navy }}>{form.phone}</strong>{' '}
                      during the {form.contactTime.toLowerCase()}.
                    </p>
                    <p style={{ fontFamily: SANS, fontSize: 15, color: C.muted, lineHeight: 1.65, margin: '0 0 32px' }}>
                      The advice is free. Your employer is legally required to fund your independent legal review of any settlement agreement.
                    </p>

                    {/* Trust signals */}
                    <div style={{
                      display: 'flex', flexDirection: 'column' as React.CSSProperties['flexDirection'],
                      gap: 10, marginBottom: 32,
                    }}>
                      {[
                        'SRA-regulated solicitor — not a general practice firm',
                        'Your details were shared with one solicitor only',
                        'No obligation after the first call',
                      ].map(text => (
                        <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <svg style={{ flexShrink: 0, marginTop: 2 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span style={{ fontFamily: SANS, fontSize: 15, color: C.muted, lineHeight: 1.5 }}>{text}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => router.push('/results' + (typeof window !== 'undefined' ? window.location.search.replace(/([?&])ev=1/, '$1').replace(/([?&])(offer|salary|months|verdict|email)[^&]*/g, '') : ''))}
                      style={{
                        background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
                        padding: '10px 18px', color: C.muted, cursor: 'pointer',
                        fontSize: 14, fontFamily: SANS,
                      }}
                    >
                      ← Back to your results
                    </button>
                  </motion.div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
