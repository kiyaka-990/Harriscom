'use client'

import { useEffect, useState } from 'react'

import { contact, whatsappLink } from '@/lib/site'

const WHATSAPP_MESSAGE =
  "Hello Harriscom, I found you on your website and I'd like to discuss a project."

function WhatsAppGlyph() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.86 1.21 3.06c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.13-.27-.2-.57-.35ZM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.38 9.38 0 0 1-1.44-5.01c0-5.19 4.23-9.41 9.42-9.41 2.52 0 4.88.98 6.66 2.76a9.35 9.35 0 0 1 2.76 6.66c0 5.19-4.23 9.41-9.43 9.41ZM19.8 4.19A11.28 11.28 0 0 0 12.04 1C5.83 1 .78 6.05.78 12.26c0 1.99.52 3.93 1.5 5.64L.69 24l6.25-1.64a11.26 11.26 0 0 0 5.1 1.24h.01c6.2 0 11.25-5.05 11.25-11.26 0-3.01-1.17-5.84-3.3-7.97Z" />
    </svg>
  )
}

function ArrowUpGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  )
}

/**
 * Persistent quick actions, anchored bottom-left.
 *
 * Left, not right: the agent launcher owns the bottom-right corner, and stacking
 * controls under it buried the one that actually starts a conversation.
 * Accessibility settings live in the header instead — a visitor who needs them
 * should not have to find a floating button first.
 */
export default function FloatingDock() {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="h-dock">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Back to top"
        title="Back to top"
        className="h-fab h-glass"
        style={{
          opacity: showTop ? 1 : 0,
          pointerEvents: showTop ? 'auto' : 'none',
          transform: showTop ? 'none' : 'translateY(8px)',
          background: 'var(--h-fab-bg)',
        }}
      >
        <ArrowUpGlyph />
      </button>

      <a
        href={whatsappLink(WHATSAPP_MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with Harriscom on WhatsApp at ${contact.phone}`}
        title="Chat with us on WhatsApp"
        className="h-fab h-fab-pulse"
        style={{
          position: 'relative',
          background: 'linear-gradient(140deg, #25d366 0%, #1aa34a 100%)',
          borderColor: 'rgba(255,255,255,0.22)',
          color: '#fff',
        }}
      >
        <WhatsAppGlyph />
      </a>
    </div>
  )
}
