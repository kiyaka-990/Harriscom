'use client'

import { useState, useEffect } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#portfolio' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(27,43,107,0.08)' : 'none',
          padding: scrolled ? '0' : '0',
        }}
      >
        {/* Brand stripe at very top */}
        <div className="brand-stripe" style={{ height: '3px' }} />

        <div
          className="flex items-center justify-between"
          style={{ maxWidth: 1240, margin: '0 auto', padding: '0 5%', height: scrolled ? 64 : 72 }}
        >
          {/* Logo */}
          <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div
              style={{
                width: 38, height: 38,
                background: 'var(--navy)',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>H</span>
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: scrolled ? 'var(--navy)' : 'white',
                letterSpacing: '.04em',
                lineHeight: 1,
              }}>
                HARRISCOM
              </div>
              <div style={{ fontSize: '.62rem', color: scrolled ? 'var(--mid-gray)' : 'rgba(255,255,255,.7)', letterSpacing: '.12em', textTransform: 'uppercase', lineHeight: 1.2 }}>
                Company Limited
              </div>
            </div>
          </a>

          {/* Desktop links */}
          <ul style={{ display: 'flex', alignItems: 'center', gap: '2rem', listStyle: 'none', margin: 0 }} className="hidden md:flex">
            {links.slice(0, 4).map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="nav-link"
                  style={{
                    color: scrolled ? 'var(--text-body)' : 'rgba(255,255,255,.88)',
                    textDecoration: 'none',
                    fontSize: '.85rem',
                    fontWeight: 500,
                    letterSpacing: '.06em',
                    textTransform: 'uppercase',
                    transition: 'color .2s',
                  }}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                style={{
                  background: 'var(--crimson)',
                  color: 'white',
                  padding: '.5rem 1.4rem',
                  borderRadius: '3px',
                  fontSize: '.82rem',
                  fontWeight: 600,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background .2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--crimson-light)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'var(--crimson)')}
              >
                Get a Quote
              </a>
            </li>
          </ul>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 24, height: 1.5,
                  background: scrolled ? 'var(--navy)' : 'white',
                  transition: '.3s',
                  transformOrigin: 'center',
                  transform: mobileOpen
                    ? i === 0 ? 'rotate(45deg) translate(4px,4px)'
                      : i === 2 ? 'rotate(-45deg) translate(4px,-4px)'
                      : 'scaleX(0)'
                    : 'none',
                }} />
              ))}
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(15,26,68,0.98)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '2.5rem',
          }}
          onClick={() => setMobileOpen(false)}
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                color: 'white',
                textDecoration: 'none',
                fontWeight: 600,
              }}
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </>
  )
}
