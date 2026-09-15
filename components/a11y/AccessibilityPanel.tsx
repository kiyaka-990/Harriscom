'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import {
  applyPrefs,
  readPrefs,
  type A11yPrefs,
  type ContrastChoice,
  type MotionChoice,
  type TextSize,
  type ThemeChoice,
} from '@/lib/a11y'

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  return (
    <Column gap="8" fillWidth>
      <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.12em' }}>
        {label.toUpperCase()}
      </Text>
      <Row gap="4" fillWidth role="radiogroup" aria-label={label}>
        {options.map((option) => {
          const active = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.value)}
              style={{
                flex: 1,
                padding: '0.5rem 0.4rem',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: active ? 600 : 500,
                border: `1px solid ${active ? 'var(--h-amber)' : 'var(--h-hairline-color)'}`,
                background: active ? 'rgba(245,166,35,0.14)' : 'transparent',
                color: active ? 'var(--h-amber)' : 'var(--neutral-on-background-medium)',
                transition: 'all 0.2s ease',
              }}
            >
              {option.label}
            </button>
          )
        })}
      </Row>
    </Column>
  )
}

export default function AccessibilityPanel() {
  const [open, setOpen] = useState(false)
  const [prefs, setPrefs] = useState<A11yPrefs | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPrefs(readPrefs())
    setCanSpeak(typeof window !== 'undefined' && 'speechSynthesis' in window)
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const update = useCallback((patch: Partial<A11yPrefs>) => {
    setPrefs((current) => {
      if (!current) return current
      const next = { ...current, ...patch }
      applyPrefs(next)
      return next
    })
  }, [])

  /**
   * Reads the page's main content aloud. Text is pulled from the DOM rather
   * than a prepared string so it always matches what is actually on screen,
   * and the nav/footer chrome is skipped.
   */
  const toggleSpeech = useCallback(() => {
    if (!('speechSynthesis' in window)) return

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }

    const main = document.getElementById('main') ?? document.body
    const nodes = main.querySelectorAll('h1, h2, h3, p, li')
    const text = Array.from(nodes)
      .map((node) => (node.textContent ?? '').trim())
      .filter((line) => line.length > 1)
      .join('. ')
      // Browsers truncate very long utterances; a page's worth of copy is
      // plenty without reading the entire footer.
      .slice(0, 6000)

    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.98
    utterance.pitch = 1
    utterance.lang = 'en-GB'
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    setSpeaking(true)
  }, [])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="Accessibility settings"
        title="Accessibility settings"
        className="h-fab h-glass"
        style={{ background: 'var(--h-fab-bg)' }}
      >
        {/* The universal access mark reads faster than any label at this size. */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="12" cy="4.2" r="2" />
          <path d="M20 7.4a1 1 0 0 0-1.2-.75l-4.3 1a10.6 10.6 0 0 1-5 0l-4.3-1A1 1 0 0 0 4.7 8.6l4.4 1v3.1l-2 6.7a1 1 0 0 0 1.9.6l1.9-6.2h.2l1.9 6.2a1 1 0 0 0 1.9-.6l-2-6.7V9.6l4.4-1A1 1 0 0 0 20 7.4Z" />
        </svg>
      </button>

      {open && prefs && (
        <Column
          ref={panelRef}
          role="dialog"
          aria-label="Accessibility settings"
          className="h-glass"
          radius="l"
          padding="20"
          gap="20"
          style={{
            position: 'fixed',
            left: '1.5rem',
            bottom: 'calc(1.5rem + 4rem)',
            zIndex: 12,
            width: 'min(20rem, calc(100vw - 3rem))',
            maxHeight: 'calc(100dvh - 8rem)',
            overflowY: 'auto',
            animation: 'h-bubble-in 0.3s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          <Row horizontal="between" vertical="center">
            <Text variant="label-strong-m" onBackground="neutral-strong">
              Accessibility
            </Text>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close accessibility settings"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--neutral-on-background-weak)',
                padding: 4,
              }}
            >
              <Icon name="close" size="xs" />
            </button>
          </Row>

          <Segmented<ThemeChoice>
            label="Appearance"
            value={prefs.theme}
            onChange={(theme) => update({ theme })}
            options={[
              { value: 'dark', label: 'Dark' },
              { value: 'light', label: 'Light' },
              { value: 'system', label: 'Auto' },
            ]}
          />

          <Segmented<ContrastChoice>
            label="Contrast"
            value={prefs.contrast}
            onChange={(contrast) => update({ contrast })}
            options={[
              { value: 'normal', label: 'Normal' },
              { value: 'high', label: 'High' },
            ]}
          />

          <Segmented<TextSize>
            label="Text size"
            value={prefs.textSize}
            onChange={(textSize) => update({ textSize })}
            options={[
              { value: '90', label: 'Small' },
              { value: '100', label: 'Default' },
              { value: '110', label: 'Large' },
            ]}
          />

          <Segmented<MotionChoice>
            label="Motion"
            value={prefs.motion}
            onChange={(motion) => update({ motion })}
            options={[
              { value: 'full', label: 'Full' },
              { value: 'reduced', label: 'Reduced' },
            ]}
          />

          <Row horizontal="between" vertical="center" gap="12">
            <Column gap="2" style={{ flex: 1 }}>
              <Text variant="label-default-s" onBackground="neutral-medium">
                Underline links
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Easier to spot without relying on colour.
              </Text>
            </Column>
            <button
              type="button"
              role="switch"
              aria-checked={prefs.underlineLinks}
              aria-label="Underline links"
              onClick={() => update({ underlineLinks: !prefs.underlineLinks })}
              style={{
                width: 44,
                height: 24,
                flex: '0 0 auto',
                borderRadius: 999,
                cursor: 'pointer',
                border: `1px solid ${prefs.underlineLinks ? 'var(--h-amber)' : 'var(--h-hairline-color)'}`,
                background: prefs.underlineLinks ? 'rgba(245,166,35,0.25)' : 'transparent',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: 2,
                  left: prefs.underlineLinks ? 22 : 2,
                  width: 18,
                  height: 18,
                  borderRadius: '50%',
                  background: prefs.underlineLinks ? 'var(--h-amber)' : 'var(--neutral-on-background-weak)',
                  transition: 'left 0.2s ease, background 0.2s ease',
                }}
              />
            </button>
          </Row>

          {canSpeak && (
            <Column gap="8">
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.12em' }}>
                READ ALOUD
              </Text>
              <button
                type="button"
                onClick={toggleSpeech}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '0.7rem 1rem',
                  borderRadius: 999,
                  cursor: 'pointer',
                  border: 'none',
                  background: speaking
                    ? 'rgba(212,43,43,0.16)'
                    : 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                  color: speaking ? '#ff8f8f' : '#0b1230',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                }}
              >
                <Icon name={speaking ? 'pause' : 'play'} size="xs" />
                {speaking ? 'Stop reading' : 'Read this page'}
              </button>
              <Text variant="body-default-xs" onBackground="neutral-weak">
                Uses your device&rsquo;s own voice. Nothing is sent anywhere.
              </Text>
            </Column>
          )}

          <div className="h-hairline" />

          <button
            type="button"
            onClick={() =>
              update({
                theme: 'dark',
                contrast: 'normal',
                textSize: '100',
                motion: 'full',
                underlineLinks: false,
              })
            }
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              color: 'var(--neutral-on-background-weak)',
              fontSize: '0.78rem',
              textDecoration: 'underline',
              alignSelf: 'flex-start',
            }}
          >
            Reset to defaults
          </button>
        </Column>
      )}
    </>
  )
}
