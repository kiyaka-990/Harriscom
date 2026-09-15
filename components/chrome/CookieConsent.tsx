'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Column, Row, Switch, Text } from '@once-ui-system/core'

const STORAGE_KEY = 'harriscom-cookie-consent'
const CONSENT_VERSION = 1

export interface ConsentState {
  version: number
  essential: true
  analytics: boolean
  marketing: boolean
  decidedAt: string
}

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentState
    // A bumped version means the categories changed, so the old answer no
    // longer covers what we are asking about — ask again.
    return parsed.version === CONSENT_VERSION ? parsed : null
  } catch {
    return null
  }
}

/** Lets the privacy page reopen the banner without a page reload. */
export const OPEN_CONSENT_EVENT = 'harriscom:open-cookie-settings'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    // Deferred so the banner never competes with the hero for first paint.
    const timer = setTimeout(() => {
      if (!readConsent()) setVisible(true)
    }, 1200)

    const onOpen = () => {
      const existing = readConsent()
      if (existing) {
        setAnalytics(existing.analytics)
        setMarketing(existing.marketing)
      }
      setShowDetail(true)
      setVisible(true)
    }

    window.addEventListener(OPEN_CONSENT_EVENT, onOpen)
    return () => {
      clearTimeout(timer)
      window.removeEventListener(OPEN_CONSENT_EVENT, onOpen)
    }
  }, [])

  const persist = useCallback((next: { analytics: boolean; marketing: boolean }) => {
    const state: ConsentState = {
      version: CONSENT_VERSION,
      essential: true,
      analytics: next.analytics,
      marketing: next.marketing,
      decidedAt: new Date().toISOString(),
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Private browsing with storage disabled — the banner will reappear next
      // visit, which is the correct failure mode for a consent prompt.
    }
    window.dispatchEvent(new CustomEvent('harriscom:consent', { detail: state }))
    setVisible(false)
    setShowDetail(false)
  }, [])

  if (!visible) return null

  return (
    <Column
      role="dialog"
      aria-label="Cookie preferences"
      aria-modal="false"
      className="h-glass h-liquid h-consent"
      radius="l"
      padding="20"
      gap="16"
    >
      <Column gap="8">
        <Text variant="label-strong-m" onBackground="neutral-strong">
          We use cookies
        </Text>
        <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.65 }}>
          Essential cookies keep this site working. With your permission we also measure which
          pages bring in enquiries so we can improve them. Nothing is shared with advertisers.
        </Text>
      </Column>

      {showDetail && (
        <Column gap="12" paddingY="4">
          <Row horizontal="between" vertical="center" gap="16">
            <Column gap="2" style={{ flex: 1 }}>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Strictly necessary
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Security, form submission and your cookie choice.
              </Text>
            </Column>
            <Switch isChecked disabled onToggle={() => {}} aria-label="Strictly necessary cookies, always on" />
          </Row>

          <Row horizontal="between" vertical="center" gap="16">
            <Column gap="2" style={{ flex: 1 }}>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Analytics
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Anonymous page and enquiry statistics.
              </Text>
            </Column>
            <Switch
              isChecked={analytics}
              onToggle={() => setAnalytics((value) => !value)}
              aria-label="Analytics cookies"
            />
          </Row>

          <Row horizontal="between" vertical="center" gap="16">
            <Column gap="2" style={{ flex: 1 }}>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Marketing
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Measuring which campaigns lead to a quote request.
              </Text>
            </Column>
            <Switch
              isChecked={marketing}
              onToggle={() => setMarketing((value) => !value)}
              aria-label="Marketing cookies"
            />
          </Row>
        </Column>
      )}

      <Row gap="8" wrap>
        <button
          type="button"
          onClick={() => persist({ analytics: true, marketing: true })}
          style={{
            flex: '1 1 8rem',
            padding: '0.7rem 1rem',
            borderRadius: 999,
            border: 'none',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
            color: '#0b1230',
            fontWeight: 600,
            fontSize: '0.85rem',
          }}
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() =>
            showDetail
              ? persist({ analytics, marketing })
              : persist({ analytics: false, marketing: false })
          }
          className="h-glass"
          style={{
            flex: '1 1 8rem',
            padding: '0.7rem 1rem',
            borderRadius: 999,
            cursor: 'pointer',
            color: 'var(--neutral-on-background-strong)',
            fontWeight: 500,
            fontSize: '0.85rem',
          }}
        >
          {showDetail ? 'Save choices' : 'Essential only'}
        </button>
      </Row>

      <Row horizontal="between" vertical="center" gap="12">
        {!showDetail && (
          <button
            type="button"
            onClick={() => setShowDetail(true)}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--neutral-on-background-weak)',
              fontSize: '0.78rem',
              textDecoration: 'underline',
            }}
          >
            Customise
          </button>
        )}
        <Link
          href="/privacy"
          style={{ color: 'var(--neutral-on-background-weak)', fontSize: '0.78rem', marginLeft: 'auto' }}
        >
          Privacy policy
        </Link>
      </Row>
    </Column>
  )
}
