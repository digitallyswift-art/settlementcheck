import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0B1F3A',
          borderRadius: 40,
          border: '8px solid #F7F4EE',
        }}
      >
        <svg width="104" height="104" viewBox="0 0 64 64" fill="none">
          <path
            d="M17 33.5 L26.5 43 L47 21"
            stroke="#D9603B"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  )
}
