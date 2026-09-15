'use client'

import Link from 'next/link'
import { BlobFx, Column, Icon, Row, Text } from '@once-ui-system/core'

import { contact, whatsappLink } from '@/lib/site'

export default function CtaBand() {
  return (
    <Column fillWidth horizontal="center" paddingX="24">
      <Column
        fillWidth
        maxWidth="xl"
        className="h-glass"
        radius="xl"
        padding="48"
        gap="32"
        horizontal="center"
        overflow="hidden"
        style={{ textAlign: 'center', position: 'relative' }}
      >
        <BlobFx position="absolute" top="0" left="0" fill opacity={50} seed={4} />

        <Column gap="16" zIndex={1} horizontal="center">
          <Text variant="label-default-s" onBackground="accent-medium" style={{ letterSpacing: '0.18em' }}>
            FREE SITE VISIT · QUOTE IN 24 HOURS
          </Text>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 600,
              lineHeight: 1.08,
              letterSpacing: '-0.025em',
              color: 'var(--neutral-on-background-strong)',
              margin: 0,
              maxWidth: '20ch',
            }}
          >
            Tell us what you want built.
          </h2>
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            style={{ maxWidth: '38rem', lineHeight: 1.75 }}
          >
            Send the location, the rough size and your target start date. We will come and look at
            the site at no cost, then put a costed proposal in your inbox within a working day.
          </Text>
        </Column>

        <Row gap="12" wrap horizontal="center" zIndex={1}>
          <Link
            href="/contact"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.95rem 1.8rem',
              borderRadius: 999,
              background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
              color: '#0b1230',
              fontWeight: 600,
              textDecoration: 'none',
              boxShadow: '0 16px 40px -16px rgba(245,166,35,0.85)',
            }}
          >
            Request a quote
            <Icon name="arrowUpRight" size="s" />
          </Link>
          <a
            href={whatsappLink('Hello Harriscom, I would like a quote for a project.')}
            target="_blank"
            rel="noopener noreferrer"
            className="h-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.95rem 1.8rem',
              borderRadius: 999,
              color: 'var(--neutral-on-background-strong)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Message on WhatsApp
          </a>
          <a
            href={contact.phoneHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.95rem 1.2rem',
              color: 'var(--neutral-on-background-medium)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            {contact.phone}
          </a>
        </Row>
      </Column>
    </Column>
  )
}
