import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Build your SaaS in record time'
  const description =
    searchParams.get('description') ||
    'Authentication, payments, database, email, and everything you need to launch.'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top bar with brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '24px',
              fontWeight: 700,
            }}
          >
            Y
          </div>
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#a1a1aa',
            }}
          >
            YourSaaS
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'white',
            marginBottom: '24px',
            display: 'flex',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '28px',
            color: '#a1a1aa',
            lineHeight: 1.4,
            maxWidth: '800px',
            display: 'flex',
          }}
        >
          {description}
        </div>

        {/* Bottom tech badges */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '48px',
          }}
        >
          {['Next.js', 'Stripe', 'PostgreSQL', 'Temps'].map((tech) => (
            <div
              key={tech}
              style={{
                padding: '8px 20px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#d4d4d8',
                fontSize: '18px',
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {tech}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
