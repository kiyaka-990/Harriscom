'use client'

import { OPEN_CONSENT_EVENT } from '@/components/chrome/CookieConsent'

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className="h-glass"
      style={{
        alignSelf: 'flex-start',
        padding: '0.7rem 1.3rem',
        borderRadius: 999,
        cursor: 'pointer',
        color: 'var(--neutral-on-background-strong)',
        fontWeight: 500,
        fontSize: '0.85rem',
      }}
    >
      Manage cookie preferences
    </button>
  )
}
