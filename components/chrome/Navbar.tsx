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
}

interface Menu {
  label: string
  href: string
  /** Two columns for the six services, one for the shorter menus. */
  columns: 1 | 2
  items: MenuItem[]
}

const MENUS: Record<MenuId, Menu> = {
  services: {
    label: 'Services',
    href: '/services',
    columns: 2,
    items: services.map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
      description: service.short,
    })),
  },
  work: {
    label: 'Work',
    href: '/projects',
    columns: 1,
    items: [
      { label: 'All projects', href: '/projects', description: 'Every job we have handed over.' },
      { label: 'Construction', href: '/projects?filter=construction', description: 'Residential, commercial, industrial.' },
      { label: 'Interiors', href: '/projects?filter=interior', description: 'Fit-out and refurbishment.' },
      { label: 'Supply', href: '/projects?filter=supply', description: 'Materials and equipment.' },
    ],
  },
  company: {
    label: 'Company',
    href: '/about',
    columns: 1,
    items: [
      { label: 'About Harriscom', href: '/about', description: 'Who we are and how we got here.' },
      { label: 'How we work', href: '/about#process', description: 'Enquiry to handover in six stages.' },
      { label: 'Why choose us', href: '/about#why', description: 'What actually makes us different.' },
      { label: 'FAQ', href: '/about#faq', description: 'Costs, timelines and compliance.' },
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

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  const linkStyle = (active: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '0.5rem 0.8rem',
    textDecoration: 'none',
    color: active ? 'var(--neutral-on-background-strong)' : 'var(--neutral-on-background-medium)',
    fontSize: '0.9rem',
    fontWeight: 500,
    whiteSpace: 'nowrap' as const,
  })

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
          background: scrolled ? 'var(--h-header-bg)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px) saturate(160%)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--h-hairline-color)' : 'transparent'}`,
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
          <Row as="nav" gap="2" vertical="center" m={{ hide: true }} aria-label="Primary">
            <Link
              href="/"
              className="h-navlink"
              aria-current={isActive('/') ? 'page' : undefined}
              onMouseEnter={() => setOpenMenu(null)}
              style={linkStyle(isActive('/'))}
            >
              Home
            </Link>

            {MENU_IDS.map((id) => {
              const menu = MENUS[id]
              const open = openMenu === id
              return (
                <div
                  key={id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => {
                    cancelClose()
                    setOpenMenu(id)
                  }}
                  onFocus={() => setOpenMenu(id)}
                >
                  <Link
                    href={menu.href}
                    className="h-navlink"
                    data-open={open}
                    aria-expanded={open}
                    aria-current={isActive(menu.href) ? 'page' : undefined}
                    style={linkStyle(isActive(menu.href))}
                  >
                    {menu.label}
                    <Icon
                      name="chevronDown"
                      size="xs"
                      style={{
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.25s ease',
                        opacity: 0.6,
                      }}
                    />
                  </Link>

                  {/* Anchored dropdown, sized to its contents rather than the
                      full page width. */}
                  {open && (
                    <div
                      className="h-glass h-dropdown"
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 0.6rem)',
                        left: 0,
                        width: menu.columns === 2 ? '34rem' : '19.5rem',
                        maxWidth: 'calc(100vw - 3rem)',
                        borderRadius: 16,
                        padding: '0.6rem',
                        zIndex: 20,
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: menu.columns === 2 ? '1fr 1fr' : '1fr',
                          gap: '0.2rem',
                        }}
                      >
                        {menu.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="h-dropdown-item"
                            style={{
                              display: 'block',
                              padding: '0.6rem 0.7rem',
                              borderRadius: 10,
                              textDecoration: 'none',
                            }}
                          >
                            <Row vertical="center" gap="4">
                              <Text variant="label-strong-s" onBackground="neutral-strong">
                                {item.label}
                              </Text>
                            </Row>
                            <Text
                              variant="body-default-xs"
                              onBackground="neutral-weak"
                              style={{ display: 'block', marginTop: 2, lineHeight: 1.45 }}
                            >
                              {item.description}
                            </Text>
                          </Link>
                        ))}
                      </div>

                      <div className="h-hairline" style={{ margin: '0.5rem 0.2rem' }} />

                      <Row horizontal="between" vertical="center" paddingX="8" paddingBottom="4" gap="8">
                        <Text variant="body-default-xs" onBackground="neutral-weak">
                          Free site visits in the Nairobi metro
                        </Text>
                        <Link
                          href="/contact"
                          style={{
                            color: 'var(--h-amber)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Book one →
                        </Link>
                      </Row>
                    </div>
                  )}
                </div>
              )
            })}

            <Link
              href="/contact"
              className="h-navlink"
              aria-current={isActive('/contact') ? 'page' : undefined}
              onMouseEnter={() => setOpenMenu(null)}
              style={linkStyle(isActive('/contact'))}
            >
              Contact
            </Link>
          </Row>

          <Row gap="12" vertical="center">
            <a
              href={contact.phoneHref}
              className="h-glass h-hide-m"
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
      </Column>

      {/* Mobile sheet */}
      <div
        data-mobile-sheet
        aria-hidden={!mobileOpen}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 8,
          background: 'var(--h-sheet-bg)',
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
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            style={{
              padding: '1rem 0',
              borderBottom: '1px solid var(--h-hairline-color)',
              textDecoration: 'none',
              color: 'var(--neutral-on-background-strong)',
              fontSize: '1.15rem',
              fontWeight: 600,
            }}
          >
            Home
          </Link>

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
                  borderBottom: '1px solid var(--h-hairline-color)',
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
              borderBottom: '1px solid var(--h-hairline-color)',
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
