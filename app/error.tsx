'use client'

import { useEffect } from 'react'
import { Column, Row, Text } from '@once-ui-system/core'

import { contact } from '@/lib/site'

/**
 * A construction client who hits an error should still be able to reach a human
 * on the same screen — hence the phone number rather than a bare "try again".
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled page error:', error)
  }, [error])

  return (
    <Column
      fillWidth
      horizontal="center"
      paddingX="24"
      style={{ paddingTop: 'calc(var(--h-nav-height) + 6rem)', paddingBottom: '8rem' }}
    >
      <Column fillWidth maxWidth="s" gap="20">
        <Text variant="label-default-s" onBackground="danger-medium" style={{ letterSpacing: '0.18em' }}>
          SOMETHING BROKE
        </Text>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: 'var(--neutral-on-background-strong)',
            margin: 0,
          }}
        >
          This page failed to load.
        </h1>

        <Text variant="body-default-m" onBackground="neutral-weak" style={{ lineHeight: 1.75 }}>
          That is our fault, not yours. Try again — and if it keeps happening, call{' '}
          {contact.phone} or email {contact.email} and we will pick it up directly.
        </Text>

        {error.digest && (
          <Text variant="body-default-xs" onBackground="neutral-weak">
            Reference: {error.digest}
          </Text>
        )}

        <Row gap="12" wrap paddingTop="8">
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '0.9rem 1.6rem',
              borderRadius: 999,
              border: 'none',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
              color: '#0b1230',
              fontWeight: 600,
            }}
          >
            Try again
          </button>
          <a
            href={contact.phoneHref}
            className="h-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.9rem 1.6rem',
              borderRadius: 999,
              color: 'var(--neutral-on-background-strong)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Call {contact.phone}
          </a>
        </Row>
      </Column>
    </Column>
  )
}
