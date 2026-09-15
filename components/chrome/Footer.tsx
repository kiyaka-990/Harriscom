import Link from 'next/link'
import { Column, Row, Text } from '@once-ui-system/core'

import { Logo } from '@/components/brand/Logo'
import { company, contact, counties, services } from '@/lib/site'

const columns = [
  {
    heading: 'Services',
    links: services.map((service) => ({ label: service.title, href: `/services/${service.slug}` })),
  },
  {
    heading: 'Company',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'How we work', href: '/about#process' },
      { label: 'Why Harriscom', href: '/about#why' },
      { label: 'Projects', href: '/projects' },
      { label: 'FAQ', href: '/about#faq' },
      { label: 'Contact', href: '/contact' },
    ],
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <Column as="footer" fillWidth horizontal="center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <Column fillWidth maxWidth="xl" paddingX="24" paddingTop="64" paddingBottom="32" gap="48">
        <Row fillWidth gap="48" wrap m={{ direction: 'column' }}>
          <Column gap="20" style={{ flex: '1 1 20rem', minWidth: '16rem' }}>
            <Logo size={42} />
            <Text variant="body-default-s" onBackground="neutral-weak" style={{ maxWidth: '26rem' }}>
              {company.description}
            </Text>
            <Column gap="8">
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
                REGISTERED
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium">
                {company.registration} · {company.registeredUnder}
              </Text>
            </Column>
          </Column>

          {columns.map((column) => (
            <Column key={column.heading} gap="12" style={{ flex: '0 1 12rem' }}>
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
                {column.heading.toUpperCase()}
              </Text>
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: 'var(--neutral-on-background-medium)',
                    fontSize: '0.88rem',
                    textDecoration: 'none',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Column>
          ))}

          <Column gap="12" style={{ flex: '0 1 16rem' }}>
            <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
              CONTACT
            </Text>
            <a href={contact.phoneHref} style={{ color: 'var(--neutral-on-background-strong)', fontSize: '1rem', fontWeight: 600, textDecoration: 'none' }}>
              {contact.phone}
            </a>
            <a href={contact.emailHref} style={{ color: 'var(--neutral-on-background-medium)', fontSize: '0.88rem', textDecoration: 'none' }}>
              {contact.email}
            </a>
            <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.7 }}>
              {contact.address.line1}
              <br />
              {contact.address.line2}
              <br />
              {contact.address.postal}
            </Text>
            <Text variant="body-default-xs" onBackground="neutral-weak" style={{ lineHeight: 1.7 }}>
              {contact.hours.weekdays}
              <br />
              {contact.hours.saturday}
            </Text>
          </Column>
        </Row>

        <div className="h-hairline" />

        <Column gap="12">
          <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.16em' }}>
            COUNTIES SERVED
          </Text>
          <Row wrap gap="8">
            {counties.map((county) => (
              <Text
                key={county}
                variant="body-default-xs"
                onBackground="neutral-weak"
                style={{
                  padding: '0.3rem 0.7rem',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {county}
              </Text>
            ))}
          </Row>
        </Column>

        <Row fillWidth horizontal="between" vertical="center" wrap gap="12" paddingTop="8">
          <Text variant="body-default-xs" onBackground="neutral-weak">
            © {year} {company.name}. All rights reserved.
          </Text>
          <Row gap="20" wrap>
            <Link href="/privacy" style={{ color: 'var(--neutral-on-background-weak)', fontSize: '0.78rem', textDecoration: 'none' }}>
              Privacy &amp; cookies
            </Link>
            <a href={company.url} style={{ color: 'var(--neutral-on-background-weak)', fontSize: '0.78rem', textDecoration: 'none' }}>
              {company.url.replace('https://', '')}
            </a>
          </Row>
        </Row>
      </Column>

      <div className="h-stripe" />
    </Column>
  )
}
