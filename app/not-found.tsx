import Link from 'next/link'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import { contact, services } from '@/lib/site'

export const metadata = { title: 'Page not found' }

export default function NotFound() {
  return (
    <Column
      fillWidth
      horizontal="center"
      paddingX="24"
      style={{ paddingTop: 'calc(var(--h-nav-height) + 6rem)', paddingBottom: '8rem' }}
    >
      <Column fillWidth maxWidth="m" gap="24">
        <Text variant="label-default-s" onBackground="accent-medium" style={{ letterSpacing: '0.18em' }}>
          404
        </Text>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
            fontWeight: 600,
            lineHeight: 1.06,
            letterSpacing: '-0.03em',
            color: 'var(--neutral-on-background-strong)',
            margin: 0,
          }}
        >
          That page isn&rsquo;t here.
        </h1>

        <Text variant="body-default-l" onBackground="neutral-weak" style={{ lineHeight: 1.75 }}>
          The link may be old, or we may have moved it. Here is everything that does exist — or
          call {contact.phone} and we will point you at the right thing.
        </Text>

        <Column className="h-glass" radius="l" padding="24" gap="12" fillWidth>
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.14em' }}>
            SERVICES
          </Text>
          {services.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
                color: 'var(--neutral-on-background-medium)',
                fontSize: '0.92rem',
                textDecoration: 'none',
              }}
            >
              {service.title}
              <Icon name="chevronRight" size="xs" />
            </Link>
          ))}
        </Column>

        <Row gap="12" wrap>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.9rem 1.6rem',
              borderRadius: 999,
              background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
              color: '#0b1230',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Back to home
          </Link>
          <Link
            href="/contact"
            className="h-glass"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.9rem 1.6rem',
              borderRadius: 999,
              color: 'var(--neutral-on-background-strong)',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Contact us
          </Link>
        </Row>
      </Column>
    </Column>
  )
}
