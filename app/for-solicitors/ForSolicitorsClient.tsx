'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PostcodeInput from '@/components/PostcodeInput'
import { lookupPostcode, isPlausibleUkPostcode, normalisePostcode, PostcodeLookup } from '@/lib/postcodes'

// ── Brand tokens (matches SettlementCheck design system) ─────────────────────
const C = {
  bg: '#F7F4EE',
  bgCard: '#FFFFFF',
  bgTint: '#EFEAE0',
  navy: '#0B1F3A',
  navyLight: '#162C4E',
  muted: '#5B6577',
  mutedLight: '#8A93A3',
  border: '#E2DCCE',
  borderStrong: '#C9C0AC',
  accent: '#D9603B',
  accentHover: '#B14A28',
  accentLight: '#FDF0EB',
  error: '#DC2626',
  success: '#16a34a',
  successLight: '#F0FDF4',
  amber: '#B5802A',
  amberLight: '#FDF8EC',
}

const SANS = "var(--font-sans, Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif)"
const SERIF = "var(--font-serif, 'Source Serif 4', Georgia, serif)"
const MONO = "var(--font-mono, 'JetBrains Mono', monospace)"

// ── GA4 / GTM funnel tracking ─────────────────────────────────────────────────
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

// ── Slide Types ───────────────────────────────────────────────────────────────
type SlideId =
  | 'welcome'
  | 'firmName'
  | 'contactName'
  | 'email'
  | 'otp'
  | 'phone'
  | 'officePostcode'
  | 'coverageRadius'
  | 'sra'
  | 'success'

interface FormData {
  firmName:              string
  contactName:           string
  email:                 string
  phone:                 string
  office_postcode:       string
  office_lat:            number | null
  office_lng:            number | null
  office_region:         string
  coverage_radius_miles: number | null
}

type StringFields = { [K in keyof FormData]: FormData[K] extends string ? K : never }[keyof FormData]

interface SlideConfig {
  id: SlideId
  inputField?: StringFields
  question?: string
  hint?: string
  placeholder?: string
  type?: string
  optional?: boolean
  stepNumber?: number
}

const SLIDES: SlideConfig[] = [
  { id: 'welcome' },
  {
    id: 'firmName',
    inputField: 'firmName',
    question: "What is your firm's name?",
    placeholder: 'e.g. Apex Employment Law LLP',
    hint: 'Must be an SRA-regulated practice in England & Wales',
    stepNumber: 1,
  },
  {
    id: 'contactName',
    inputField: 'contactName',
    question: 'And your name?',
    placeholder: 'e.g. Eleanor Vance',
    hint: 'Partner or designated fee earner managing settlement instructions',
    stepNumber: 2,
  },
  {
    id: 'email',
    inputField: 'email',
    question: "What is your work email?",
    hint: "We will send a 6-digit verification code to confirm your firm domain",
    placeholder: 'eleanor@apexlaw.co.uk',
    type: 'email',
    stepNumber: 3,
  },
  { id: 'otp', stepNumber: 4 },
  {
    id: 'phone',
    inputField: 'phone',
    question: 'Direct telephone number for introductions?',
    hint: 'Used exclusively for high-intent client callbacks within your agreed SLA',
    placeholder: '020 7946 0192',
    type: 'tel',
    optional: true,
    stepNumber: 5,
  },
  { id: 'officePostcode', stepNumber: 6 },
  { id: 'coverageRadius', stepNumber: 7 },
  { id: 'sra', stepNumber: 8 },
  { id: 'success' },
]

const TOTAL_STEPS = 8

// ── Slide Animation Variants ──────────────────────────────────────────────────
const slideVariants = {
  enter: (dir: number) => ({ y: dir > 0 ? 32 : -32, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (dir: number) => ({ y: dir > 0 ? -32 : 32, opacity: 0 }),
}

const slideTrans = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
}

// ── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ pct, stepNumber }: { pct: number; stepNumber?: number }) {
  return (
    <div style={{ padding: '12px 24px', maxWidth: 640, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.navy, letterSpacing: '0.02em' }}>
          {stepNumber ? `Application Step ${stepNumber} of ${TOTAL_STEPS}` : ''}
        </span>
        <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: C.accent }}>{pct}% complete</span>
      </div>
      <div style={{ height: 4, background: C.border, borderRadius: 999, overflow: 'hidden' }}>
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
          style={{ height: '100%', background: C.accent, borderRadius: 999 }}
        />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ForSolicitorsClient() {
  const [slideIndex, setSlideIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState<FormData>({
    firmName:              '',
    contactName:           '',
    email:                 '',
    phone:                 '',
    office_postcode:       '',
    office_lat:            null,
    office_lng:            null,
    office_region:         '',
    coverage_radius_miles: null,
  })
  const [officePostcodeValid, setOfficePostcodeValid] = useState(false)
  const [fieldError, setFieldError] = useState('')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const inputRef     = useRef<HTMLInputElement>(null)
  const otpRefs      = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])
  const advancingRef = useRef(false)

  const currentSlide = SLIDES[slideIndex]

  const progressPct =
    currentSlide.id === 'welcome'
      ? 0
      : currentSlide.id === 'success'
      ? 100
      : Math.round(((currentSlide.stepNumber ?? 0) / (TOTAL_STEPS + 1)) * 100)

  const showProgress = !['welcome', 'success'].includes(currentSlide.id)
  const showBack = slideIndex > 0 && currentSlide.id !== 'success'

  // GA tracking on slide change
  useEffect(() => {
    trackFormStep(currentSlide.id, currentSlide.stepNumber ?? 0)
  }, [slideIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-focus logic
  useEffect(() => {
    const t = setTimeout(() => {
      if (currentSlide.id === 'otp') {
        otpRefs.current[0]?.focus()
      } else if (!['welcome', 'sra', 'success', 'coverageRadius'].includes(currentSlide.id)) {
        inputRef.current?.focus()
      }
    }, 320)
    return () => clearTimeout(t)
  }, [slideIndex, currentSlide.id])

  // Resend cooldown timer
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => { advancingRef.current = false }, 350)
  }, [])

  const goBack = useCallback(() => {
    if (slideIndex === 0) return
    setDir(-1)
    setFieldError('')
    setSlideIndex((i) => i - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slideIndex])

  const startApplicationFromHero = useCallback((initialPostcode?: string, lookup?: PostcodeLookup | null) => {
    if (initialPostcode && lookup) {
      setForm((f) => ({
        ...f,
        office_postcode: lookup.postcode,
        office_lat: lookup.latitude,
        office_lng: lookup.longitude,
        office_region: lookup.admin_district,
      }))
      setOfficePostcodeValid(true)
    }
    setDir(1)
    setSlideIndex(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── OTP Handlers ───────────────────────────────────────────────────────────
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
      setFieldError('Failed to send verification code. Please check the address and try again.')
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
        setOtpError('Verification failed. Please check your network and try again.')
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

  // ── Per-Slide Validation & Advancement ────────────────────────────────────
  const handleNext = useCallback(async () => {
    if (advancingRef.current) return
    advancingRef.current = true
    setFieldError('')
    const id = currentSlide.id
    if (id === 'firmName') {
      if (!form.firmName.trim()) { advancingRef.current = false; setFieldError('Please enter your firm name'); return }
      advance()
    } else if (id === 'contactName') {
      if (!form.contactName.trim()) { advancingRef.current = false; setFieldError('Please enter your name'); return }
      advance()
    } else if (id === 'email') {
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        advancingRef.current = false; setFieldError('Please enter a valid work email address'); return
      }
      const ok = await sendOtp(form.email)
      if (ok) advance()
      else advancingRef.current = false
    } else if (id === 'phone') {
      advance()
    } else if (id === 'officePostcode') {
      if (!officePostcodeValid || !form.office_postcode.trim()) {
        advancingRef.current = false; setFieldError('Please enter a valid UK postcode to continue')
        return
      }
      advance()
    } else {
      advancingRef.current = false
    }
  }, [currentSlide.id, form, advance, sendOtp, officePostcodeValid])

  const submitApplication = useCallback(async () => {
    setSubmitting(true)
    setFieldError('')
    try {
      const res = await fetch('/api/solicitor-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firm_name:             form.firmName,
          contact_name:          form.contactName,
          email:                 form.email,
          phone:                 form.phone || null,
          office_postcode:       form.office_postcode,
          office_lat:            form.office_lat,
          office_lng:            form.office_lng,
          office_region:         form.office_region,
          coverage_radius_miles: form.coverage_radius_miles,
          sra_confirmed:         true,
        }),
      })
      if (!res.ok) {
        let detail = ''
        try { const d = await res.json(); detail = d.detail || d.error || '' } catch {}
        throw new Error(detail)
      }
      trackEvent('solicitor_application_submitted', { firm: form.firmName })
      advance()
    } catch (err: unknown) {
      const detail = err instanceof Error && err.message ? ` (${err.message})` : ''
      setFieldError(
        `Something went wrong${detail}. Please try again or email us directly at team@settlementcheck.co.uk`
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
        !['otp', 'sra', 'welcome', 'success', 'officePostcode', 'coverageRadius'].includes(currentSlide.id)
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
        color: C.navy,
      }}
    >
      {/* ── Top Header Navigation ────────────────────────────────────────── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          height: 68,
          background: 'rgba(247, 244, 238, 0.94)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 200,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <a
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.6" />
              <path
                d="M6 11.5L9.5 15L16 7.5"
                stroke="#D9603B"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontFamily: SERIF, fontSize: 20, letterSpacing: '-0.01em', lineHeight: 1 }}>
              <span style={{ color: '#D9603B' }}>Settlement</span>
              <span style={{ color: '#0B1F3A' }}>Check</span>
            </span>
          </a>

          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: C.muted,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              background: C.bgTint,
              padding: '3px 9px',
              borderRadius: 4,
              border: `1px solid ${C.border}`,
            }}
          >
            Solicitor Panel Portal
          </span>
        </div>

        {/* Header Right Action */}
        {slideIndex === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => startApplicationFromHero()}
              style={{
                background: C.navy,
                color: '#fff',
                border: 'none',
                borderRadius: 7,
                padding: '9px 18px',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: SANS,
                cursor: 'pointer',
                letterSpacing: '-0.01em',
                boxShadow: '0 2px 6px rgba(11,31,58,0.15)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.navyLight }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.navy }}
            >
              Apply for Exclusivity →
            </button>
          </div>
        ) : showBack ? (
          <button
            onClick={goBack}
            aria-label="Go back"
            style={{
              background: C.bgCard,
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              padding: '7px 14px',
              color: C.navy,
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
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
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        ) : (
          <div />
        )}
      </header>

      {/* ── Fixed Progress Bar in Multi-Step Mode ────────────────────────── */}
      {showProgress && (
        <div
          style={{
            position: 'sticky',
            top: 68,
            left: 0,
            right: 0,
            background: C.bgCard,
            borderBottom: `1px solid ${C.border}`,
            zIndex: 100,
          }}
        >
          <ProgressBar pct={progressPct} stepNumber={currentSlide.stepNumber} />
        </div>
      )}

      {/* ── Main Canvas View ─────────────────────────────────────────────── */}
      {slideIndex === 0 ? (
        /* Full-Width Attention Economy Sales Page */
        <SolicitorSalesPage onStartApplication={startApplicationFromHero} />
      ) : (
        /* Multi-Step Application Wizard */
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'calc(100vh - 120px)',
            padding: '50px 24px 80px',
          }}
        >
          <div style={{ width: '100%', maxWidth: 580, position: 'relative' }}>
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
                {currentSlide.id === 'officePostcode' && (
                  <div>
                    <h2
                      style={{
                        color: C.navy,
                        fontSize: 'clamp(26px, 4.5vw, 36px)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        lineHeight: 1.2,
                        margin: '0 0 8px',
                        fontFamily: SERIF,
                      }}
                    >
                      What is your office postcode?
                    </h2>
                    <p
                      style={{
                        color: C.muted,
                        fontSize: 15,
                        margin: '0 0 28px',
                        lineHeight: 1.55,
                        fontFamily: SANS,
                      }}
                    >
                      We use your registered office location to route local employee instructions to your fee earners.
                    </p>
                    <PostcodeInput
                      value={form.office_postcode}
                      onChange={(v) => {
                        setFieldError('')
                        setOfficePostcodeValid(false)
                        setForm((f) => ({ ...f, office_postcode: v, office_lat: null, office_lng: null, office_region: '' }))
                      }}
                      onValidated={(lookup: PostcodeLookup | null) => {
                        if (lookup) {
                          setForm((f) => ({
                            ...f,
                            office_postcode: lookup.postcode,
                            office_lat:      lookup.latitude,
                            office_lng:      lookup.longitude,
                            office_region:   lookup.admin_district,
                          }))
                          setOfficePostcodeValid(true)
                        } else {
                          setOfficePostcodeValid(false)
                        }
                        setFieldError('')
                      }}
                      inputRef={inputRef}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') { e.preventDefault(); handleNext() }
                      }}
                    />
                    {fieldError && (
                      <p style={{ color: C.error, fontSize: 13, margin: '6px 0 0', fontFamily: SANS }}>{fieldError}</p>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 24 }}>
                      <button
                        onClick={handleNext}
                        disabled={!officePostcodeValid}
                        style={{
                          background: C.accent,
                          border: 'none',
                          borderRadius: 8,
                          padding: '13px 28px',
                          color: '#fff',
                          fontSize: 15,
                          fontWeight: 600,
                          cursor: officePostcodeValid ? 'pointer' : 'not-allowed',
                          opacity: officePostcodeValid ? 1 : 0.45,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          fontFamily: SANS,
                          boxShadow: officePostcodeValid ? '0 2px 8px rgba(217,96,59,0.25)' : 'none',
                        }}
                        onMouseEnter={(e) => { if (officePostcodeValid) e.currentTarget.style.background = C.accentHover }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
                      >
                        Continue
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </button>
                      <span style={{ color: C.borderStrong, fontSize: 12, fontFamily: SANS }}>
                        press{' '}
                        <kbd style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 4, padding: '2px 6px', fontFamily: SANS, fontSize: 11, color: C.muted }}>
                          Enter
                        </kbd>
                      </span>
                    </div>
                  </div>
                )}

                {currentSlide.id === 'coverageRadius' && (
                  <div>
                    <h2
                      style={{
                        color: C.navy,
                        fontSize: 'clamp(26px, 4.5vw, 36px)',
                        fontWeight: 700,
                        letterSpacing: '-0.025em',
                        lineHeight: 1.2,
                        margin: '0 0 8px',
                        fontFamily: SERIF,
                      }}
                    >
                      Select your exclusive coverage area
                    </h2>
                    <p style={{ color: C.muted, fontSize: 15, margin: '0 0 28px', lineHeight: 1.55, fontFamily: SANS }}>
                      Radius measured from {form.office_postcode}. You receive exclusive routing for matters originating within this territory.
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {[
                        { label: 'Within 25 miles (Local city / county)', value: 25 },
                        { label: 'Within 50 miles (Regional hub)', value: 50 },
                        { label: 'Within 100 miles (Multi-county practice)', value: 100 },
                        { label: 'National (England & Wales remote sign-off capability)', value: null },
                      ].map((opt) => {
                        const selected = form.coverage_radius_miles === opt.value && opt.value !== null
                        return (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => {
                              setForm((f) => ({ ...f, coverage_radius_miles: opt.value }))
                              setTimeout(() => advance(), 220)
                            }}
                            style={{
                              width: '100%',
                              minHeight: 52,
                              padding: '14px 20px',
                              textAlign: 'left',
                              border: `1.5px solid ${selected ? C.navy : C.border}`,
                              borderRadius: 10,
                              fontSize: 15,
                              fontFamily: SANS,
                              fontWeight: selected ? 600 : 400,
                              cursor: 'pointer',
                              background: selected ? C.navy : C.bgCard,
                              color: selected ? '#fff' : C.navy,
                              transition: 'all 120ms ease',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>{opt.label}</span>
                            <span style={{ fontSize: 18, color: selected ? '#fff' : C.muted }}>→</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
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
      )}
    </div>
  )
}

// ── B2B Sales Page (Attention Economy Framework) ──────────────────────────────
interface SalesPageProps {
  onStartApplication: (postcode?: string, lookup?: PostcodeLookup | null) => void
}

function SolicitorSalesPage({ onStartApplication }: SalesPageProps) {
  const [postcodeCheck, setPostcodeCheck] = useState('')
  const [lookupResult, setLookupResult] = useState<PostcodeLookup | null>(null)
  const [checkingPostcode, setCheckingPostcode] = useState(false)
  const [postcodeStatus, setPostcodeStatus] = useState<'idle' | 'available' | 'invalid'>('idle')

  // Lead Dossier interactive inspector state
  const [activeDossierTab, setActiveDossierTab] = useState<'director' | 'manager' | 'redundancy'>('director')

  // Unit Economics slider state
  const [monthlyIntros, setMonthlyIntros] = useState<number>(10)

  const handleQuickPostcodeCheck = async () => {
    if (!isPlausibleUkPostcode(postcodeCheck)) {
      setPostcodeStatus('invalid')
      return
    }
    setCheckingPostcode(true)
    const res = await lookupPostcode(postcodeCheck)
    setCheckingPostcode(false)
    if (res) {
      setLookupResult(res)
      setPostcodeStatus('available')
    } else {
      setPostcodeStatus('invalid')
    }
  }

  // Pre-calculated dossier mock records
  const dossiers = {
    director: {
      title: 'Commercial Director Reorganisation',
      tenure: '7 years 4 months',
      age: 44,
      salary: '£78,000 / year (£1,500/week)',
      statutoryRedundancy: '£5,257',
      statutoryRedundancyCapNote: 'Calculated under April 2026 statutory cap of £751/week (ERA 1996 s.162)',
      pilon: '£19,500 (3 months gross contractual notice)',
      employerExGratia: '£29,000',
      totalOffer: '£48,500',
      taxFreeAmount: '£30,000 (ITEPA 2003 s.403 exempt threshold)',
      taxableAmount: '£18,500 (subject to PAYE/NICs)',
      employerLegalFeeContribution: '£750 + VAT',
      urgency: 'Employer signing deadline: 10 business days',
      readiness: 'High · Has draft settlement agreement PDF ready',
    },
    manager: {
      title: 'Protected Conversation Exit',
      tenure: '3 years 8 months',
      age: 38,
      salary: '£46,000 / year (£884/week)',
      statutoryRedundancy: '£2,253',
      statutoryRedundancyCapNote: 'Calculated at £751/week cap (3 years × 1.0 multiplier)',
      pilon: '£3,833 (1 month gross contractual notice)',
      employerExGratia: '£16,000',
      totalOffer: '£19,833',
      taxFreeAmount: '£16,000 (within £30,000 tax-free boundary)',
      taxableAmount: '£3,833 (PILON taxed as earnings)',
      employerLegalFeeContribution: '£600 + VAT',
      urgency: 'Formal offer letter issued yesterday',
      readiness: 'Awaiting independent legal advice certificate',
    },
    redundancy: {
      title: 'Compulsory Redundancy Restructure',
      tenure: '11 years 2 months',
      age: 52,
      salary: '£54,000 / year (£1,038/week)',
      statutoryRedundancy: '£11,265',
      statutoryRedundancyCapNote: 'Calculated using 1.5x factor for service over age 41 (ERA 1996 s.162)',
      pilon: '£9,000 (2 months contractual notice)',
      employerExGratia: '£22,000',
      totalOffer: '£31,000',
      taxFreeAmount: '£30,000 (maximum statutory termination exemption)',
      taxableAmount: '£1,000',
      employerLegalFeeContribution: '£650 + VAT',
      urgency: 'Consultation ended; agreement issued for sign-off',
      readiness: 'Employee checked offer against statutory entitlement',
    },
  }

  const currentDossier = dossiers[activeDossierTab]

  // Economics calculations (based on standard £500 statutory benchmark employer contribution)
  const introCost = monthlyIntros * 60
  const baselineEmployerFee = monthlyIntros * 500
  const netFirmRevenue = baselineEmployerFee - introCost

  return (
    <div style={{ maxWidth: 1160, margin: '0 auto', padding: '40px 24px 100px' }}>

      {/* ── 1. ATTENTION HOOK HERO SECTION ───────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '36px 0 56px', borderBottom: `1px solid ${C.border}` }}>
        {/* Eyebrow */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: C.bgTint,
            border: `1px solid ${C.borderStrong}`,
            borderRadius: 30,
            padding: '6px 16px',
            marginBottom: 24,
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: C.accent,
              display: 'inline-block',
              boxShadow: '0 0 8px rgba(217,96,59,0.8)',
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.navy,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            SRA-Regulated Employment Solicitors · England &amp; Wales
          </span>
        </div>

        {/* Master Headline */}
        <h1
          style={{
            fontFamily: SERIF,
            fontSize: 'clamp(32px, 5.5vw, 56px)',
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: C.navy,
            maxWidth: 920,
            margin: '0 auto 22px',
          }}
        >
          Stop losing billable hours to unqualified redundancy enquiries.
        </h1>

        {/* Lead Subheading */}
        <p
          style={{
            fontFamily: SANS,
            fontSize: 'clamp(16px, 2.2vw, 19px)',
            lineHeight: 1.6,
            color: C.muted,
            maxWidth: 760,
            margin: '0 auto 36px',
          }}
        >
          Receive exclusive, mathematically pre-calculated settlement agreement instructions from UK employees. Every lead includes verified statutory redundancy figures, PILON breakdowns, and confirmed employer legal fee contributions before you dial.
        </p>

        {/* Interactive Postcode Availability Checker (Attention Anchor) */}
        <div
          style={{
            maxWidth: 580,
            margin: '0 auto 28px',
            background: C.bgCard,
            border: `1.5px solid ${postcodeStatus === 'available' ? C.success : C.borderStrong}`,
            borderRadius: 12,
            padding: 8,
            boxShadow: '0 8px 24px rgba(11,31,58,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={postcodeCheck}
              onChange={(e) => {
                setPostcodeCheck(e.target.value.toUpperCase())
                setPostcodeStatus('idle')
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleQuickPostcodeCheck()
                }
              }}
              placeholder="Enter your office postcode (e.g. M2 5PF, EC2M 4PL)"
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                padding: '12px 16px',
                fontSize: 15,
                fontFamily: SANS,
                color: C.navy,
                fontWeight: 500,
                background: 'transparent',
              }}
            />
            <button
              onClick={handleQuickPostcodeCheck}
              disabled={checkingPostcode || !postcodeCheck.trim()}
              style={{
                background: C.navy,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px 22px',
                fontSize: 14,
                fontWeight: 600,
                cursor: checkingPostcode || !postcodeCheck.trim() ? 'not-allowed' : 'pointer',
                fontFamily: SANS,
                whiteSpace: 'nowrap',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.navyLight }}
              onMouseLeave={(e) => { e.currentTarget.style.background = C.navy }}
            >
              {checkingPostcode ? 'Checking...' : 'Check Postcode →'}
            </button>
          </div>

          {postcodeStatus === 'available' && lookupResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: C.successLight,
                border: `1px solid ${C.success}40`,
                borderRadius: 8,
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 12,
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: C.success, fontSize: 13, fontWeight: 700, fontFamily: SANS }}>
                  ✓ Territory Open for {lookupResult.admin_district || lookupResult.postcode}
                </div>
                <div style={{ color: C.muted, fontSize: 12, fontFamily: SANS }}>
                  Exclusive panel allocation available for SRA-regulated employment solicitors in this sector.
                </div>
              </div>
              <button
                onClick={() => onStartApplication(lookupResult.postcode, lookupResult)}
                style={{
                  background: C.accent,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: SANS,
                }}
              >
                Claim Territory →
              </button>
            </motion.div>
          )}

          {postcodeStatus === 'invalid' && (
            <div style={{ color: C.error, fontSize: 12, textAlign: 'left', padding: '4px 16px' }}>
              Please enter a valid UK postcode format (e.g. SW1A 1AA or M1 1AE).
            </div>
          )}
        </div>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
          <button
            onClick={() => onStartApplication()}
            style={{
              background: C.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              fontFamily: SANS,
              boxShadow: '0 4px 18px rgba(217,96,59,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
          >
            Apply for Panel Exclusivity
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <a
            href="#lead-dossier"
            style={{
              background: C.bgCard,
              color: C.navy,
              border: `1.5px solid ${C.borderStrong}`,
              borderRadius: 8,
              padding: '16px 28px',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              fontFamily: SANS,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color 0.15s ease',
            }}
          >
            Inspect Sample Lead Payload ↓
          </a>
        </div>

        {/* 4 Trust Pillars Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: 14,
            maxWidth: 1020,
            margin: '0 auto',
            textAlign: 'left',
          }}
        >
          {[
            {
              title: '100% Exclusive Routing',
              desc: 'Never auctioned or sold to competing law firms. One instruction belongs to one firm.',
            },
            {
              title: 'Employer Pays Your Fee',
              desc: 'Section 203 ERA 1996 legal fee contributions (£500–£1,500+ VAT) paid direct to you.',
            },
            {
              title: 'Complete Statutory Dossier',
              desc: 'Calculated statutory redundancy floor, PILON, and tax split before you pick up the phone.',
            },
            {
              title: '£0 Monthly Retainer',
              desc: 'Zero software subscriptions or lock-in. Pay only on verified client introductions.',
            },
          ].map((pillar) => (
            <div
              key={pillar.title}
              style={{
                background: C.bgCard,
                border: `1px solid ${C.border}`,
                borderRadius: 10,
                padding: '16px 18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ color: C.accent, fontWeight: 700, fontSize: 14 }}>✓</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: SANS }}>
                  {pillar.title}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: C.muted, lineHeight: 1.45, fontFamily: SANS }}>
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 2. PAIN POINT MATRIX: NON-BILLABLE FRICTION ─────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            The Intake Problem
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.navy,
              margin: '8px 0 16px',
            }}
          >
            Why standard legal marketing wastes your fee earners’ billable hours
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            Acquiring employment clients through digital advertising or generic lead brokers creates substantial non-billable overhead. SettlementCheck solves each bottleneck deterministically.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {[
            {
              num: '01',
              painTitle: 'Unqualified Initial Enquiries',
              painText: '30 to 45-minute unbillable calls with callers who do not have an active settlement offer, lack qualifying employment service, or have no funding for private fees.',
              solTitle: 'Pre-Filtered Statutory Floor',
              solText: 'Every SettlementCheck instruction holds an active settlement offer with continuous service and statutory floor verified under the Employment Rights Act 1996.',
            },
            {
              num: '02',
              painTitle: 'The Time-Consuming Intake Interview',
              painText: 'Fee earners spending valuable billable time extracting baseline figures: gross salary, notice pay, accrued holiday, and statutory redundancy caps.',
              solTitle: 'Full Data Payload on Arrival',
              solText: 'Your team receives a completed statutory dossier, separating contractual PILON from tax-exempt termination compensation before picking up the phone.',
            },
            {
              num: '03',
              painTitle: 'High Client Acquisition Costs (CAC)',
              painText: 'Between digital advertising spend, agency retainers, and low conversion rates on cold web traffic, acquiring a signed settlement agreement matter often costs hundreds of pounds in marketing overhead.',
              solTitle: 'Fixed £60 Introduction Fee',
              solText: 'No marketing agency retainers, ad budget volatility, or wasted clicks. Pay strictly a flat £60 fee for genuine, OTP-verified instructions.',
            },
            {
              num: '04',
              painTitle: 'Shared Lead Brokers & Fast Sprints',
              painText: 'Lead brokers selling the identical enquiry to multiple local law firms simultaneously, creating an undignified race to contact the client first.',
              solTitle: '100% Territorial Exclusivity',
              solText: 'Strict 1:1 matching. Once an employee in your agreed coverage area requests independent advice, the mandate belongs solely to your firm.',
            },
          ].map((item) => (
            <div
              key={item.num}
              style={{
                background: C.bgCard,
                border: `1.5px solid ${C.border}`,
                borderRadius: 12,
                padding: '24px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.accent,
                    background: C.accentLight,
                    padding: '3px 8px',
                    borderRadius: 4,
                  }}
                >
                  PROBLEM {item.num}
                </span>

                <h3
                  style={{
                    fontFamily: SERIF,
                    fontSize: 19,
                    fontWeight: 700,
                    color: C.navy,
                    margin: '14px 0 8px',
                  }}
                >
                  {item.painTitle}
                </h3>
                <p style={{ fontSize: 13, color: C.muted, lineHeight: 1.55, margin: '0 0 20px', fontFamily: SANS }}>
                  {item.painText}
                </p>
              </div>

              <div
                style={{
                  background: C.bgTint,
                  border: `1px solid ${C.borderStrong}`,
                  borderRadius: 8,
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <span style={{ color: C.accent, fontWeight: 700, fontSize: 13 }}>✓</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, fontFamily: SANS }}>
                    {item.solTitle}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: 12, color: C.navy, lineHeight: 1.45, fontFamily: SANS }}>
                  {item.solText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. INTERACTIVE LEAD DOSSIER INSPECTOR ───────────────────────── */}
      <section id="lead-dossier" style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 36px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            The Data Advantage
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.navy,
              margin: '8px 0 16px',
            }}
          >
            Inspect the exact payload your fee earners receive
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            Your effort to extract numbers is reduced to zero. Every instruction arrives with calculated statutory minimums under the Employment Rights Act 1996 and tax treatment under ITEPA 2003.
          </p>
        </div>

        {/* Scenario Switcher Tabs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 10,
            marginBottom: 24,
            flexWrap: 'wrap',
          }}
        >
          {[
            { id: 'director', label: 'Senior Director (£48.5k Offer)' },
            { id: 'manager', label: 'Mid-Management Exit (£19.8k Offer)' },
            { id: 'redundancy', label: 'Long-Service Restructure (£31k Offer)' },
          ].map((tab) => {
            const isActive = activeDossierTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDossierTab(tab.id as any)}
                style={{
                  background: isActive ? C.navy : C.bgCard,
                  color: isActive ? '#fff' : C.navy,
                  border: `1.5px solid ${isActive ? C.navy : C.borderStrong}`,
                  borderRadius: 8,
                  padding: '10px 18px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: SANS,
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* The Live Mock Lead Dossier Card */}
        <div
          style={{
            background: C.bgCard,
            border: `2px solid ${C.navy}`,
            borderRadius: 14,
            overflow: 'hidden',
            boxShadow: '0 12px 32px rgba(11,31,58,0.08)',
            maxWidth: 880,
            margin: '0 auto',
          }}
        >
          {/* Dossier Header */}
          <div
            style={{
              background: C.navy,
              color: '#fff',
              padding: '18px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span
                  style={{
                    background: C.accent,
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 4,
                    textTransform: 'uppercase',
                    fontFamily: SANS,
                  }}
                >
                  CONFIRMED MANDATE
                </span>
                <span style={{ fontSize: 13, color: '#A5B4FC', fontFamily: MONO }}>
                  REF: SC-2026-{activeDossierTab.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: SERIF }}>
                {currentDossier.title}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: 12,
                  fontFamily: SANS,
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                ✓ OTP Verified Phone &amp; Email
              </span>
            </div>
          </div>

          {/* Dossier Body Payload Grid */}
          <div style={{ padding: '24px 28px' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 18,
                marginBottom: 24,
                paddingBottom: 20,
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div>
                <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: SANS }}>
                  Employee Tenure
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: SANS, marginTop: 2 }}>
                  {currentDossier.tenure} (Age: {currentDossier.age})
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: SANS }}>
                  Salary Base
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: SANS, marginTop: 2 }}>
                  {currentDossier.salary}
                </div>
              </div>

              <div>
                <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600, fontFamily: SANS }}>
                  Employer Legal Fee Contribution
                </span>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.success, fontFamily: SANS, marginTop: 2 }}>
                  {currentDossier.employerLegalFeeContribution} (ERA s.203)
                </div>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div style={{ background: C.bgTint, borderRadius: 10, padding: '18px 20px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12, fontFamily: SANS }}>
                STATUTORY REDUNDANCY &amp; TAX BREAKDOWN
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Statutory Redundancy Entitlement</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 2 }}>
                    {currentDossier.statutoryRedundancy}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>{currentDossier.statutoryRedundancyCapNote}</div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Contractual Notice Pay (PILON)</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 2 }}>
                    {currentDossier.pilon}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Taxed as employment earnings (ITEPA s.402D)</div>
                </div>

                <div>
                  <div style={{ fontSize: 12, color: C.muted }}>Total Employer Settlement Offer</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.accent, fontFamily: MONO, marginTop: 2 }}>
                    {currentDossier.totalOffer}
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>Tax-free: {currentDossier.taxFreeAmount}</div>
                </div>
              </div>
            </div>

            {/* Solicitor Action Strip */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 14,
                padding: '12px 16px',
                background: C.bg,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
              }}
            >
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, color: C.navy }}>Matter Status: </span>
                <span style={{ fontSize: 12, color: C.muted }}>{currentDossier.urgency} · {currentDossier.readiness}</span>
              </div>
              <button
                onClick={() => onStartApplication()}
                style={{
                  background: C.navy,
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '9px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: SANS,
                }}
              >
                Receive Mandates Like This →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. UNIT ECONOMICS & ROI CALCULATOR ───────────────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            Transparent Commercials
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: C.navy,
              margin: '8px 0 16px',
            }}
          >
            The Economics: Predictable margins on every matter
          </h2>
          <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.6, margin: 0, fontFamily: SANS }}>
            Under Section 203 of the Employment Rights Act 1996, the employer pays your legal fee. You pay only a fixed £60 introduction fee per verified instruction.
          </p>
        </div>

        <div
          style={{
            background: C.bgCard,
            border: `1.5px solid ${C.border}`,
            borderRadius: 14,
            padding: '36px 32px',
            maxWidth: 880,
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(11,31,58,0.04)',
          }}
        >
          {/* Slider input */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
              <label style={{ fontSize: 15, fontWeight: 700, color: C.navy, fontFamily: SANS }}>
                Desired Monthly Instructions:
              </label>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: C.accent,
                  fontFamily: SERIF,
                }}
              >
                {monthlyIntros} instructions / month
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={monthlyIntros}
              onChange={(e) => setMonthlyIntros(Number(e.target.value))}
              style={{
                width: '100%',
                height: 8,
                accentColor: C.accent,
                cursor: 'pointer',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginTop: 6 }}>
              <span>3 / month (Solo practitioner)</span>
              <span>15 / month (Boutique firm)</span>
              <span>30 / month (Departmental capacity)</span>
            </div>
          </div>

          {/* Economics Metrics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ background: C.bg, padding: '18px 20px', borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Introduction Cost</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 4 }}>
                £{introCost.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Fixed £60 per verified instruction</div>
            </div>

            <div style={{ background: C.bg, padding: '18px 20px', borderRadius: 8, border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 600 }}>Employer Legal Contributions (Baseline)</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.navy, fontFamily: MONO, marginTop: 4 }}>
                £{baselineEmployerFee.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>Based on £500 standard benchmark contribution</div>
            </div>

            <div style={{ background: C.successLight, padding: '18px 20px', borderRadius: 8, border: `1px solid ${C.success}40` }}>
              <div style={{ fontSize: 11, color: C.success, textTransform: 'uppercase', fontWeight: 700 }}>Net Fee Retained (Standard Reviews)</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: C.success, fontFamily: MONO, marginTop: 4 }}>
                £{netFirmRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: C.success, marginTop: 3 }}>£440 net margin per standard sign-off</div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5, margin: '0 0 28px', textAlign: 'center', fontFamily: SANS }}>
            * Models a standard Section 203 review and adviser certificate execution at the customary £500 + VAT employer contribution floor. Any fee uplift negotiated with the employer or extended representation agreed with the client represents additional billable income for your firm.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onStartApplication()}
              style={{
                background: C.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 32px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: SANS,
                boxShadow: '0 4px 14px rgba(217,96,59,0.25)',
              }}
            >
              Lock In Your Postcode Allocation →
            </button>
          </div>
        </div>
      </section>

      {/* ── 5. SPEED-TO-LEAD SLA & EXCLUSIVITY PROTOCOL ─────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                color: C.accent,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: SANS,
              }}
            >
              Response Protocol
            </span>
            <h2
              style={{
                fontFamily: SERIF,
                fontSize: 'clamp(28px, 3.8vw, 38px)',
                fontWeight: 700,
                lineHeight: 1.2,
                color: C.navy,
                margin: '8px 0 16px',
              }}
            >
              Prompt response standards that protect client momentum
            </h2>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: '0 0 18px', fontFamily: SANS }}>
              When an employee receives a settlement agreement, they often face a strict 7 to 14 day deadline to obtain independent legal advice under Section 203.
            </p>
            <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.6, margin: '0 0 24px', fontFamily: SANS }}>
              We route instructions to one partner firm at a time. Partner firms commit to initiating contact on the same business day (or within 24 hours), ensuring employees receive timely advice while their agreement window is open.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { title: 'Strict 1:1 Routing', desc: 'No shared leads. You are not competing against multiple other law firms for the same matter.' },
                { title: 'Pre-Informed Clients', desc: 'Clients arrive having calculated their statutory entitlement and reviewed standard employer fee contribution practices.' },
                { title: 'Direct CRM / Webhook Push', desc: 'Introductions delivered instantly via encrypted email or straight into your practice management CRM.' },
              ].map((point) => (
                <div key={point.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: C.accent, fontWeight: 700, fontSize: 14, marginTop: 2 }}>✓</span>
                  <div>
                    <strong style={{ fontSize: 14, color: C.navy, fontFamily: SANS }}>{point.title}: </strong>
                    <span style={{ fontSize: 13, color: C.muted, fontFamily: SANS }}>{point.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: C.navy,
              borderRadius: 14,
              padding: '36px 30px',
              color: '#fff',
            }}
          >
            <h3 style={{ fontFamily: SERIF, fontSize: 24, fontWeight: 700, margin: '0 0 14px' }}>
              Territory Allocation Protocol
            </h3>
            <p style={{ fontSize: 14, color: '#A5B4FC', lineHeight: 1.6, margin: '0 0 24px' }}>
              To ensure partner firms receive healthy matter volume and to prevent panel dilution, SettlementCheck manages regional capacity deliberately.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Managed Panel Density per Region</div>
                <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 3 }}>
                  Partner capacity is calibrated to regional employee instruction volume so each partner firm receives a consistent flow of matters.
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>SRA Roll Verification</div>
                <div style={{ fontSize: 12, color: '#CBD5E1', marginTop: 3 }}>
                  All applicant firms undergo active status verification against the Solicitors Regulation Authority register.
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartApplication()}
              style={{
                width: '100%',
                background: C.accent,
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '14px 20px',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: SANS,
                boxShadow: '0 4px 12px rgba(217,96,59,0.3)',
              }}
            >
              Verify Your Firm &amp; Apply Now →
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. SOLICITOR FAQS (ACCORDION) ────────────────────────────────── */}
      <section style={{ padding: '64px 0', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 40px' }}>
          <span
            style={{
              color: C.accent,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: SANS,
            }}
          >
            Clear Answers
          </span>
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 40px)',
              fontWeight: 700,
              color: C.navy,
              margin: '8px 0 14px',
            }}
          >
            Frequently Asked Questions by Partner Firms
          </h2>
          <p style={{ fontSize: 15, color: C.muted, margin: 0, fontFamily: SANS }}>
            Objective commercial and regulatory details for fee earners and managing partners.
          </p>
        </div>

        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          {[
            {
              q: 'How does legal fee settlement work under Section 203?',
              a: 'Under Section 203 of the Employment Rights Act 1996, an employee settlement agreement is only legally binding if the employee receives advice from an independent qualified adviser. UK employers universally cover this cost, typically contributing between £500 and £1,500 + VAT directly to your firm upon receipt of your adviser certificate and invoice.',
            },
            {
              q: 'Are introductions strictly exclusive to our firm?',
              a: 'Yes. We do not operate a shared lead broker model. When an employee in your agreed coverage area requests independent legal advice, their complete statutory file is dispatched exclusively to your firm. It is never sent to competing practices.',
            },
            {
              q: 'How are employee contact details and offers verified?',
              a: 'Every employee must pass two-factor OTP verification on their email and phone before requesting a solicitor match. Furthermore, they must enter their salary, tenure, reason for exit, and existing settlement offer into our calculator, ensuring you receive qualified matters rather than speculative enquiries.',
            },
            {
              q: 'What happens if a contact is unreachable?',
              a: 'Every employee contact is verified via two-factor OTP (email and phone). If an introduced employee has invalid contact details or does not respond within 48 hours of initial outreach, we credit that introduction back to your account immediately with zero dispute.',
            },
            {
              q: 'Are there monthly subscription fees or long-term commitments?',
              a: 'No. There are zero software fees, no monthly retainers, and no minimum term contracts. You pay solely for verified introductions and can pause or adjust your territory radius at any time.',
            },
            {
              q: 'What are the regulatory requirements to join the panel?',
              a: 'You must be an active law firm regulated by the Solicitors Regulation Authority (SRA) in England & Wales with specialist employment law practitioners and valid professional indemnity insurance.',
            },
          ].map((item, idx) => (
            <details
              key={idx}
              style={{
                borderBottom: `1px solid ${C.border}`,
                padding: '18px 0',
                cursor: 'pointer',
              }}
            >
              <summary
                style={{
                  fontFamily: SERIF,
                  fontSize: 18,
                  fontWeight: 700,
                  color: C.navy,
                  listStyle: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.q}</span>
                <span style={{ color: C.accent, fontSize: 20, fontWeight: 400 }}>+</span>
              </summary>
              <p
                style={{
                  margin: '12px 0 0',
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: C.muted,
                  fontFamily: SANS,
                }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 7. FINAL CONVERSION BANNER ───────────────────────────────────── */}
      <section style={{ textAlign: 'center', padding: '64px 0 20px' }}>
        <div
          style={{
            background: C.bgCard,
            border: `2px solid ${C.borderStrong}`,
            borderRadius: 16,
            padding: '48px 32px',
            maxWidth: 780,
            margin: '0 auto',
            boxShadow: '0 12px 36px rgba(11,31,58,0.06)',
          }}
        >
          <h2
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(28px, 4vw, 38px)',
              fontWeight: 700,
              color: C.navy,
              margin: '0 0 14px',
            }}
          >
            Ready to secure your practice area?
          </h2>
          <p
            style={{
              fontSize: 16,
              color: C.muted,
              lineHeight: 1.6,
              maxWidth: 580,
              margin: '0 auto 28px',
              fontFamily: SANS,
            }}
          >
            Application takes under 3 minutes. Zero setup fees, zero monthly retainers, and full SRA compliance verification.
          </p>

          <button
            onClick={() => onStartApplication()}
            style={{
              background: C.accent,
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '-0.01em',
              fontFamily: SANS,
              boxShadow: '0 4px 18px rgba(217,96,59,0.3)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.accentHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
          >
            Apply to Join Panel Now
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          <div style={{ marginTop: 16, fontSize: 12, color: C.mutedLight, fontFamily: SANS }}>
            Strictly reserved for SRA-regulated employment solicitors in England &amp; Wales.
          </div>
        </div>
      </section>

    </div>
  )
}

// ── Application Form Sub-Components ───────────────────────────────────────────
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
          fontSize: 'clamp(26px, 4.5vw, 36px)',
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
            lineHeight: 1.55,
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
          fontSize: 'clamp(20px, 3.5vw, 28px)',
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
            padding: '13px 28px',
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
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = C.accentHover }}
          onMouseLeave={(e) => { e.currentTarget.style.background = C.accent }}
        >
          {loading ? (
            'Sending code...'
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
          fontSize: 'clamp(26px, 4.5vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 10px',
          fontFamily: SERIF,
        }}
      >
        Check your work inbox
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
        We sent a 6-digit verification code to{' '}
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
              background: digit ? C.accentLight : C.bgCard,
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
        {verifying ? 'Verifying...' : 'Verify Email'}
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
            color: resendCooldown > 0 ? C.borderStrong : C.accent,
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
          background: C.successLight,
          border: '1px solid #BBF7D0',
          borderRadius: 20,
          padding: '4px 12px',
          color: C.success,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginBottom: 20,
          fontFamily: SANS,
        }}
      >
        Final Regulatory Confirmation
      </div>
      <h2
        style={{
          color: C.navy,
          fontSize: 'clamp(26px, 4.5vw, 36px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          lineHeight: 1.2,
          margin: '0 0 20px',
          fontFamily: SERIF,
        }}
      >
        SRA Regulation Declaration
      </h2>

      <div
        style={{
          background: C.bgCard,
          border: `1.5px solid ${C.border}`,
          borderRadius: 12,
          padding: '22px 24px',
          color: C.muted,
          fontSize: 15,
          lineHeight: 1.65,
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
            is regulated by the Solicitors Regulation Authority (SRA) in England &amp; Wales and authorised to advise on employment settlement agreements under Section 203 of the Employment Rights Act 1996.
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
          padding: '15px 34px',
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
          'Submitting Application...'
        ) : (
          <>
            Confirm &amp; Complete Application
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
          background: C.successLight,
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
          stroke={C.success}
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
          fontSize: 'clamp(26px, 4.5vw, 40px)',
          fontWeight: 700,
          letterSpacing: '-0.025em',
          margin: '0 0 14px',
          fontFamily: SERIF,
        }}
      >
        {name ? `Thank you, ${name.split(' ')[0]}!` : 'Application Received'}
      </h1>
      <p
        style={{
          color: C.muted,
          fontSize: 16,
          lineHeight: 1.65,
          maxWidth: 460,
          margin: '0 auto 32px',
          fontFamily: SANS,
        }}
      >
        We have received your firm&apos;s details. Our team will verify your SRA registration and configure your exclusive territorial routing within 1 business day.
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
        Return to Homepage
      </a>
    </div>
  )
}
