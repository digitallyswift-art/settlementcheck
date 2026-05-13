import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Constructive Dismissal Calculator 2026 — Check your claim | SettlementCheck'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#0B1F3A',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px 96px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -80,
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(217,96,59,0.28) 0%, transparent 70%)',
          }}
        />

        {/* Wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <svg width="52" height="52" viewBox="0 0 22 22" fill="none">
            <rect x="1" y="1" width="20" height="20" rx="4" stroke="#D9603B" strokeWidth="1.5" />
            <path d="M6 11.5L9.5 15L16 7.5" stroke="#D9603B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div style={{ display: 'flex', fontSize: 38, fontWeight: 500, letterSpacing: '-0.02em' }}>
            <span style={{ color: '#D9603B' }}>Settlement</span>
            <span style={{ color: '#F7F4EE' }}>Check</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 58,
              fontWeight: 700,
              color: '#F7F4EE',
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: 860,
            }}
          >
            Constructive dismissal calculator{' '}
            <span style={{ color: '#D9603B', fontStyle: 'italic' }}>2026</span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: 'rgba(247,244,238,0.65)',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: '-0.01em',
            }}
          >
            Forced to resign? Compensatory cap £123,543 · Free, no email
          </div>
        </div>

        {/* Bottom badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '1px solid rgba(247,244,238,0.2)',
            borderRadius: 999,
            padding: '10px 22px',
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#D9603B' }} />
          <span style={{ color: 'rgba(247,244,238,0.7)', fontSize: 18, fontWeight: 500, letterSpacing: '0.04em' }}>
            INDEPENDENT · NOT A LAW FIRM · FREE TO USE
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
