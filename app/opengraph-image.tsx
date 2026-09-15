import { ImageResponse } from 'next/og'

import { company, contact } from '@/lib/site'

export const alt = `${company.name} — ${company.tagline}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Generated rather than a checked-in PNG so the share card can never drift out
 * of step with the company details in lib/site.ts.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0B1230 0%, #131C4A 55%, #060912 100%)',
          color: '#F3F5FA',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="16" fill="#1B2B6B" />
            <rect x="15" y="15" width="7.5" height="34" rx="2.5" fill="#FFFFFF" />
            <rect x="41.5" y="15" width="7.5" height="34" rx="2.5" fill="#FFFFFF" />
            <path
              d="M21 35.5 43 28.5"
              fill="none"
              stroke="#F5A623"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 6 }}>HARRISCOM</div>
            <div style={{ fontSize: 17, letterSpacing: 8, color: '#96A0BE' }}>COMPANY LIMITED</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Satori needs an explicit display on any element with more than one
              child, so the two-tone headline is a flex row rather than inline. */}
          <div
            style={{
              display: 'flex',
              gap: 20,
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -2,
            }}
          >
            <span>Build with</span>
            <span style={{ color: '#F5A623' }}>certainty.</span>
          </div>
          <div style={{ fontSize: 28, color: '#96A0BE', maxWidth: 880, lineHeight: 1.4 }}>
            Construction &amp; general supplies across Kenya — fixed-price quotations, weekly
            reporting, on-time handover.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 24, color: '#F3F5FA' }}>{contact.phone}</div>
          <div style={{ fontSize: 24, color: '#96A0BE' }}>
            {company.url.replace('https://', '')}
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 10,
            display: 'flex',
            background:
              'linear-gradient(90deg, #2D8C4E 0%, #1A7A9A 18%, #1B2B6B 35%, #6B3FA0 52%, #D42B2B 68%, #F5A623 85%, #2D8C4E 100%)',
          }}
        />
      </div>
    ),
    size,
  )
}
