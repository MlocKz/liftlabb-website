import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LiftLabb - Track your gains. Ditch the spreadsheet.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#050505',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(74,222,128,0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo */}
        <img
          src="https://liftlabb.ca/LiftLabb-Logo.png"
          width={120}
          height={120}
          style={{ borderRadius: 24, marginBottom: 32 }}
        />

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: '#f0f0f0',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: 16,
          }}
        >
          LiftLabb
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: '#4ade80',
            textAlign: 'center',
            marginBottom: 12,
          }}
        >
          Track your gains. Ditch the spreadsheet.
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 20,
            color: '#777777',
            textAlign: 'center',
            maxWidth: 600,
          }}
        >
          The workout tracker built for lifters who want to get stronger.
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(to right, transparent, #4ade80, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
