'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import { Logo } from '@/components/brand/Logo'
import { contact, services } from '@/lib/site'

type MenuId = 'services' | 'work' | 'company'

interface MenuItem {
  label: string
  href: string
  description: string
  badge?: string
}

const MENUS: Record<MenuId, { label: string; href: string; items: MenuItem[] }> = {
  services: {
    label: 'Services',
    href: '/services',
    items: services.map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
      description: service.short,
    })),
  },
  work: {
    label: 'Work',
    href: '/projects',
    items: [
      { label: 'All projects', href: '/projects', description: 'Every job we have handed over.' },
      { label: 'Construction', href: '/projects?filter=construction', description: 'Residential, commercial and industrial builds.' },
      { label: 'Interiors', href: '/projects?filter=interior', description: 'Fit-out, refurbishment and design.' },
      { label: 'Supply', href: '/projects?filter=supply', description: 'Materials and equipment contracts.' },
    ],
  },
  company: {
    label: 'Company',
    href: '/about',
    items: [
      { label: 'About Harriscom', href: '/about', description: 'Who we are and how we got here.' },
      { label: 'How we work', href: '/about#process', description: 'The six stages from enquiry to handover.' },
      { label: 'Why choose us', href: '/about#why', description: 'What actually makes us different.' },
      { label: 'FAQ', href: '/about#faq', description: 'Costs, timelines, payments and compliance.' },
    ],
  },
}

const MENU_IDS = Object.keys(MENUS) as MenuId[]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileSection, setMobileSection] = useState<MenuId | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Route changes must close the menus, otherwise the panel stays open over the
  // page you just navigated to.
  useEffect(() => {
    setOpenMenu(null)
    setMobileOpen(false)
    setMobileSection(null)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpenMenu(null)
      setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // A short grace period, so crossing the gap between the trigger and the panel
  // doesn't snap the menu shut mid-movement.
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <>
      <Column
        as="header"
        fillWidth
        horizontal="center"
        position="fixed"
        top="0"
        zIndex={9}
        style={{
          background: scrolled ? 'rgba(8, 11, 26, 0.72)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'rgba(255,255,255,0.08)' : 'transparent'}`,
          transition: 'background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease',
        }}
        onMouseLeave={scheduleClose}
      >
        <Row
          fillWidth
          maxWidth="xl"
          paddingX="24"
          vertical="center"
          horizontal="between"
          style={{ height: 'var(--h-nav-height)' }}
        >
          <Link href="/" aria-label="Harriscom home" style={{ textDecoration: 'none' }}>
            <Logo size={38} />
          </Link>

          {/* Desktop navigation */}
          <Row as="nav" gap="4" vertical="center" m={{ hide: true }} aria-label="Primary">
            {MENU_IDS.map((id) => (
              <div
                key={id}
                onMouseEnter={() => {
                  cancelClose()
                  setOpenMenu(id)
                }}
                onFocus={() => setOpenMenu(id)}
              >
                <Link
                  href={MENUS[id].href}
                  className="h-navlink"
                  data-open={openMenu === id}
                  aria-expanded={openMenu === id}
                  aria-current={isActive(MENUS[id].href) ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '0.5rem 0.85rem',
                    textDecoration: 'none',
                    color: 'var(--neutral-on-background-medium)',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                  }}
                >
                  {MENUS[id].label}
                  <Icon
                    name="chevronDown"
                    size="xs"
                    style={{
                      transform: openMenu === id ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                      opacity: 0.6,
                    }}
                  />
                </Link>
              </div>
            ))}
            <Link
              href="/contact"
              className="h-navlink"
              aria-current={isActive('/contact') ? 'page' : undefined}
              onMouseEnter={() => setOpenMenu(null)}
              style={{
                padding: '0.5rem 0.85rem',
                textDecoration: 'none',
                color: 'var(--neutral-on-background-medium)',
                fontSize: '0.9rem',
                fontWeight: 500,
              }}
            >
              Contact
            </Link>
          </Row>

          <Row gap="12" vertical="center">
            <a
              href={contact.phoneHref}
              className="h-glass"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.5rem 0.9rem',
                borderRadius: 999,
                textDecoration: 'none',
                color: 'var(--neutral-on-background-strong)',
                fontSize: '0.84rem',
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--h-emerald)',
                  boxShadow: '0 0 0 3px rgba(45,140,78,0.25)',
                }}
              />
              {contact.phone}
            </a>

            <Link
              href="/contact"
              className="h-hide-s"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.62rem 1.15rem',
                borderRadius: 999,
                background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                color: '#0b1230',
                fontWeight: 600,
                fontSize: '0.85rem',
                textDecoration: 'none',
                boxShadow: '0 10px 28px -12px rgba(245,166,35,0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              Get a free quote
            </Link>

            <button
              type="button"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((open) => !open)}
              className="h-glass"
              style={{
                display: 'none',
                width: 42,
                height: 42,
                borderRadius: 12,
                cursor: 'pointer',
                placeItems: 'center',
              }}
              data-mobile-toggle
            >
              <span style={{ display: 'grid', gap: 5, justifyItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    style={{
                      display: 'block',
                      width: 18,
                      height: 1.6,
                      borderRadius: 2,
                      background: 'var(--neutral-on-background-strong)',
                      transition: 'transform 0.3s ease, opacity 0.2s ease',
                      transform: mobileOpen
                        ? i === 0
                          ? 'translateY(6.6px) rotate(45deg)'
                          : i === 2
                            ? 'translateY(-6.6px) rotate(-45deg)'
                            : 'none'
                        : 'none',
                      opacity: mobileOpen && i === 1 ? 0 : 1,
                    }}
                  />
                ))}
              </span>
            </button>
          </Row>
        </Row>

        {/* Desktop mega panel */}
        {openMenu && (
          <Row
            fillWidth
            horizontal="center"
            paddingX="24"
            paddingBottom="16"
            m={{ hide: true }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <Column
              fillWidth
              maxWidth="xl"
              className="h-glass h-liquid"
              radius="l"
              padding="20"
              style={{ animation: 'h-bubble-in 0.26s cubic-bezier(0.22,1,0.36,1) both' }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: openMenu === 'services' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
                  gap: '0.5rem',
                }}
              >
                {MENUS[openMenu].items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="h-spotlight"
                    style={{
                      display: 'block',
                      padding: '0.9rem 1rem',
                      borderRadius: 14,
                      textDecoration: 'none',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                      event.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.borderColor = 'transparent'
                      event.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <Row vertical="center" gap="8" marginBottom="4">
                      <Text variant="label-strong-m" onBackground="neutral-strong">
                        {item.label}
                      </Text>
                      <Icon name="arrowUpRight" size="xs" onBackground="accent-weak" />
                    </Row>
                    <Text variant="body-default-xs" onBackground="neutral-weak">
                      {item.description}
                    </Text>
                  </Link>
                ))}
              </div>

              <div className="h-hairline" style={{ margin: '0.85rem 0' }} />

              <Row horizontal="between" vertical="center" paddingX="12" wrap gap="12">
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Free site visits anywhere in the Nairobi metro · Quotes within 24 hours
                </Text>
                <Link
                  href="/contact"
                  style={{
                    color: 'var(--h-amber)',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Book a site visit →
                </Link>
              </Row>
            </Column>
          </Row>
        )}
      </Column>

      {/* Mobile sheet */}
      <div
        data-mobile-sheet
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8,
          background: 'rgba(6, 9, 22, 0.97)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          paddingTop: 'calc(var(--h-nav-height) + 1rem)',
          overflowY: 'auto',
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? 'auto' : 'none',
          // visibility, not just opacity: an aria-hidden panel whose links are
          // still focusable traps keyboard users in a menu they cannot see.
          visibility: mobileOpen ? 'visible' : 'hidden',
          transition: 'opacity 0.3s ease, visibility 0.3s',
        }}
      >
        <Column padding="24" gap="8" fillWidth>
          {MENU_IDS.map((id) => (
            <Column key={id} fillWidth>
              <Row
                as="button"
                fillWidth
                horizontal="between"
                vertical="center"
                paddingY="16"
                onClick={() => setMobileSection((current) => (current === id ? null : id))}
                style={{
                  background: 'none',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                aria-expanded={mobileSection === id}
              >
                <Text variant="heading-strong-m" onBackground="neutral-strong">
                  {MENUS[id].label}
                </Text>
                <Icon
                  name="chevronDown"
                  size="s"
                  style={{
                    transform: mobileSection === id ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.25s ease',
                  }}
                />
              </Row>
              {mobileSection === id && (
                <Column gap="2" paddingY="8" paddingLeft="8">
                  {MENUS[id].items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      style={{
                        padding: '0.7rem 0.25rem',
                        textDecoration: 'none',
                        color: 'var(--neutral-on-background-medium)',
                        fontSize: '0.95rem',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </Column>
              )}
            </Column>
          ))}

          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '1rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              textDecoration: 'none',
              color: 'var(--neutral-on-background-strong)',
              fontSize: '1.15rem',
              fontWeight: 600,
            }}
          >
            Contact
          </Link>

          <Column gap="12" paddingTop="24">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.95rem',
                borderRadius: 999,
                background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                color: '#0b1230',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Get a free quote
            </Link>
            <a
              href={contact.phoneHref}
              className="h-glass"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '0.95rem',
                borderRadius: 999,
                color: 'var(--neutral-on-background-strong)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Call {contact.phone}
            </a>
          </Column>
        </Column>
      </div>

      {/* The hamburger only exists below the desktop breakpoint; Once UI's hide
          props cover Flex children, but this is a plain button. */}
      <style>{`
        @media (max-width: 1024px) {
          [data-mobile-toggle] { display: grid !important; }
        }
      `}</style>
    </>
  )
}
