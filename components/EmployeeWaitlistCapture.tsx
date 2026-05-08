'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Step = 'email' | 'otp' | 'success'

export default function EmployeeWaitlistCapture() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [sending, setSending] = useState(false)

  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const emailRef = useRef<HTMLInputElement>(null)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null, null, null])

  // Countdown timer for resend
  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const sendOtp = useCallback(async (addr: string) => {
    setSending(true)
    setEmailError('')
    try {
      const res = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: addr, form_type: 'employee' }),
      })
      if (!res.ok) throw new Error()
      setCooldown(30)
      return true
    } catch {
      setEmailError('Failed to send code. Please try again.')
      return false
    } finally {
      setSending(false)
    }
  }, [])

  const handleEmailSubmit = useCallback(async () => {
    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError('Please enter a valid email address')
      return
    }
    const ok = await sendOtp(trimmed)
    if (ok) setStep('otp')
  }, [email, sendOtp])

  const verifyAndSave = useCallback(
    async (ds?: string[]) => {
      const d = ds ?? digits
      const code = d.join('')
      if (code.length < 6) {
        setOtpError('Please enter all 6 digits')
        return
      }
      setVerifying(true)
      setOtpError('')
      try {
        // Verify OTP
        const verifyRes = await fetch('/api/otp/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), code, form_type: 'employee' }),
        })
        const verifyData = await verifyRes.json()
        if (!verifyData.success) {
          setOtpError(verifyData.message || 'Incorrect code. Please try again.')
          setDigits(['', '', '', '', '', ''])
          otpRefs.current[0]?.focus()
          return
        }

        // Save to waitlist
        await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim() }),
        })

        setStep('success')
      } catch {
        setOtpError('Something went wrong. Please try again.')
      } finally {
        setVerifying(false)
      }
    },
    [digits, email]
  )

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      const digit = value.replace(/\D/g, '').slice(-1)
      const next = [...digits]
      next[index] = digit
      setDigits(next)
      setOtpError('')
      if (digit && index < 5) {
        otpRefs.current[index + 1]?.focus()
      }
      if (digit && index === 5 && next.every((d) => d)) {
        setTimeout(() => verifyAndSave(next), 80)
      }
    },
    [digits, verifyAndSave]
  )

  const handleDigitKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        otpRefs.current[index - 1]?.focus()
      }
      if (e.key === 'Enter' && digits.join('').length === 6) {
        verifyAndSave()
      }
    },
    [digits, verifyAndSave]
  )

  const handleOtpPaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
      const next = ['', '', '', '', '', '']
      pasted.split('').forEach((d, i) => { next[i] = d })
      setDigits(next)
      const fi = Math.min(pasted.length, 5)
      otpRefs.current[fi]?.focus()
      if (pasted.length === 6) setTimeout(() => verifyAndSave(next), 80)
    },
    [verifyAndSave]
  )

  const resend = useCallback(async () => {
    if (cooldown > 0) return
    setDigits(['', '', '', '', '', ''])
    setOtpError('')
    await sendOtp(email.trim())
    otpRefs.current[0]?.focus()
  }, [cooldown, email, sendOtp])

  const slideVariants = {
    enter: { x: 24, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -24, opacity: 0 },
  }

  const slideTrans = { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }

  return (
    <div
      style={{
        background: '#f8f6f2',
        border: '1px solid #e2ddd6',
        borderRadius: 16,
        padding: 'clamp(20px, 4vw, 32px)',
        overflow: 'hidden',
      }}
    >
      <AnimatePresence mode="wait">
        {/* ── EMAIL STEP ─────────────────────────────────────────────────────── */}
        {step === 'email' && (
          <motion.div
            key="email"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#fff7ed',
                  border: '1px solid #fed7aa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
              </div>
              <div>
                <h3
                  style={{
                    color: '#111827',
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: '-0.015em',
                    margin: '0 0 4px',
                  }}
                >
                  Get notified when solicitors join
                </h3>
                <p
                  style={{
                    color: '#6b7280',
                    fontSize: 14,
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  Not ready to connect yet? We&apos;ll email you when more
                  specialist solicitors join our panel.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px', minWidth: 0 }}>
                <input
                  ref={emailRef}
                  type="email"
                  placeholder="your@email.co.uk"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setEmailError('')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleEmailSubmit()
                  }}
                  style={{
                    width: '100%',
                    background: '#fff',
                    border: `1.5px solid ${emailError ? '#f87171' : '#e5e7eb'}`,
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontSize: 14,
                    color: '#111827',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.15s ease',
                  }}
                  onFocus={(e) => {
                    if (!emailError) e.currentTarget.style.borderColor = '#f97316'
                  }}
                  onBlur={(e) => {
                    if (!emailError) e.currentTarget.style.borderColor = '#e5e7eb'
                  }}
                />
                {emailError && (
                  <p style={{ color: '#f87171', fontSize: 12, margin: '4px 0 0' }}>
                    {emailError}
                  </p>
                )}
              </div>
              <button
                onClick={handleEmailSubmit}
                disabled={sending}
                style={{
                  background: '#111827',
                  border: 'none',
                  borderRadius: 8,
                  padding: '10px 18px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: sending ? 'not-allowed' : 'pointer',
                  opacity: sending ? 0.65 : 1,
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                  flexShrink: 0,
                }}
              >
                {sending ? 'Sending…' : 'Notify me'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── OTP STEP ─────────────────────────────────────────────────────── */}
        {step === 'otp' && (
          <motion.div
            key="otp"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
          >
            <p
              style={{
                color: '#374151',
                fontSize: 14,
                marginBottom: 16,
                lineHeight: 1.5,
              }}
            >
              Enter the 6-digit code sent to{' '}
              <strong style={{ color: '#111827' }}>{email}</strong>
            </p>

            <div
              onPaste={handleOtpPaste}
              style={{ display: 'flex', gap: 8, marginBottom: 12 }}
            >
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { otpRefs.current[i] = el }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleDigitKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  style={{
                    width: 'clamp(36px, 9vw, 44px)',
                    height: 'clamp(44px, 11vw, 52px)',
                    textAlign: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#111827',
                    background: digit ? '#fff7ed' : '#fff',
                    border: `1.5px solid ${digit ? '#f97316' : '#e5e7eb'}`,
                    borderRadius: 8,
                    outline: 'none',
                    caretColor: '#f97316',
                    transition: 'all 0.12s ease',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                />
              ))}
            </div>

            {otpError && (
              <p style={{ color: '#f87171', fontSize: 12, margin: '0 0 8px' }}>
                {otpError}
              </p>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <button
                onClick={() => verifyAndSave()}
                disabled={verifying || !digits.every((d) => d)}
                style={{
                  background: '#111827',
                  border: 'none',
                  borderRadius: 8,
                  padding: '9px 20px',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor:
                    verifying || !digits.every((d) => d) ? 'not-allowed' : 'pointer',
                  opacity: verifying || !digits.every((d) => d) ? 0.5 : 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {verifying ? 'Verifying…' : 'Confirm'}
              </button>
              <button
                onClick={resend}
                disabled={cooldown > 0}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  color: cooldown > 0 ? '#d1d5db' : '#6b7280',
                  fontSize: 12,
                  cursor: cooldown > 0 ? 'default' : 'pointer',
                  textDecoration: 'underline',
                }}
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── SUCCESS STEP ──────────────────────────────────────────────────── */}
        {step === 'success' && (
          <motion.div
            key="success"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTrans}
            style={{ display: 'flex', alignItems: 'center', gap: 14 }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#16a34a"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <p
                style={{
                  color: '#111827',
                  fontWeight: 700,
                  fontSize: 15,
                  margin: '0 0 2px',
                  letterSpacing: '-0.01em',
                }}
              >
                You&apos;re on the list
              </p>
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                We&apos;ll notify you at{' '}
                <strong style={{ color: '#374151' }}>{email}</strong> when
                new solicitors join.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
