'use client'

import { useEffect, useRef, useState } from 'react'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import { company, contact } from '@/lib/site'

const QUERY = encodeURIComponent(
  `${contact.address.line1}, ${contact.address.line2}, ${contact.address.country}`,
)

/**
 * The embed works without an API key; the key path is only used when one is
 * configured, because the keyed Embed API gives a cleaner marker and a place
 * card for the office.
 */
function embedUrl() {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${key}&q=${QUERY}&zoom=17`
  }
  return `https://maps.google.com/maps?q=${contact.geo.lat},${contact.geo.lng}&z=17&hl=en&output=embed`
}

const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`

export default function GoogleMap() {
  const [loaded, setLoaded] = useState(false)
  const [nearViewport, setNearViewport] = useState(false)
  const holderRef = useRef<HTMLDivElement>(null)

  // Only start watching once the map is close to the viewport, so the third
  // party frame never costs anything on pages the visitor scrolls straight past.
  useEffect(() => {
    const node = holderRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true)
          observer.disconnect()
        }
      },
      { rootMargin: '300px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <Column
      ref={holderRef}
      fillWidth
      className="h-glass"
      radius="l"
      overflow="hidden"
      style={{ position: 'relative', minHeight: '22rem' }}
    >
      {loaded && nearViewport ? (
        <iframe
          title={`Map showing ${company.name} at ${contact.address.line1}`}
          src={embedUrl()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          style={{ border: 0, width: '100%', height: '100%', minHeight: '22rem', filter: 'saturate(0.85)' }}
        />
      ) : (
        <Column
          fill
          center
          gap="20"
          padding="32"
          style={{
            minHeight: '22rem',
            textAlign: 'center',
            backgroundImage:
              'radial-gradient(circle at 30% 20%, rgba(74,95,193,0.22), transparent 55%), radial-gradient(circle at 75% 70%, rgba(245,166,35,0.14), transparent 55%)',
          }}
        >
          <Column gap="8" horizontal="center">
            <Text variant="heading-strong-s" onBackground="neutral-strong">
              {contact.address.line1}
            </Text>
            <Text variant="body-default-s" onBackground="neutral-weak">
              {contact.address.line2} · {contact.address.postal}
            </Text>
          </Column>

          <Text variant="body-default-xs" onBackground="neutral-weak" style={{ maxWidth: '26rem', lineHeight: 1.7 }}>
            The map is loaded from Google, which sets its own cookies. Load it only if you are
            happy with that.
          </Text>

          <Row gap="12" wrap horizontal="center">
            <button
              type="button"
              onClick={() => {
                setNearViewport(true)
                setLoaded(true)
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.75rem 1.4rem',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                color: '#0b1230',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              Load Google Map
            </button>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="h-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.75rem 1.4rem',
                borderRadius: 999,
                color: 'var(--neutral-on-background-strong)',
                fontWeight: 500,
                fontSize: '0.85rem',
                textDecoration: 'none',
              }}
            >
              Get directions
              <Icon name="arrowUpRight" size="xs" />
            </a>
          </Row>
        </Column>
      )}
    </Column>
  )
}
