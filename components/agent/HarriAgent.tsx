'use client'

import { Fragment, useCallback, useEffect, useRef, useState } from 'react'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import { greeting } from '@/lib/agent/brain'
import type { AgentAction, AgentState, AgentTurn } from '@/lib/agent/types'
import { company, contact, whatsappLink } from '@/lib/site'

interface Bubble {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'harriscom-harri-session'
const NUDGE_DELAY = 14000

/** Minimal markdown: **bold** and bullet lines. Model output is rendered as
 *  React nodes rather than HTML so nothing it emits can become markup. */
function RichText({ value }: { value: string }) {
  return (
    <>
      {value.split('\n').map((line, lineIndex) => {
        const bullet = /^\s*[•\-*]\s+/.test(line)
        const text = bullet ? line.replace(/^\s*[•\-*]\s+/, '') : line
        const parts = text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean)

        const rendered = parts.map((part, partIndex) =>
          part.startsWith('**') && part.endsWith('**') ? (
            <strong key={partIndex}>{part.slice(2, -2)}</strong>
          ) : (
            <Fragment key={partIndex}>{part}</Fragment>
          ),
        )

        if (bullet) {
          return (
            <span key={lineIndex} style={{ display: 'flex', gap: '0.5rem' }}>
              <span aria-hidden="true" style={{ color: 'var(--h-amber)' }}>
                •
              </span>
              <span>{rendered}</span>
            </span>
          )
        }

        return (
          <Fragment key={lineIndex}>
            {lineIndex > 0 && <br />}
            {rendered}
          </Fragment>
        )
      })}
    </>
  )
}

function HarriAvatar({ size = 34 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        display: 'grid',
        placeItems: 'center',
        width: size,
        height: size,
        flex: '0 0 auto',
        borderRadius: '30%',
        background: 'linear-gradient(140deg, #31469B 0%, #1B2B6B 55%, #0B1230 100%)',
        border: '1px solid rgba(255,255,255,0.14)',
      }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="15" y="15" width="7.5" height="34" rx="2.5" fill="#fff" />
        <rect x="41.5" y="15" width="7.5" height="34" rx="2.5" fill="#fff" />
        <path d="M21 35.5 43 28.5" fill="none" stroke="#F5A623" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function HarriAgent() {
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [busy, setBusy] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Bubble[]>([])
  const [quickReplies, setQuickReplies] = useState<string[]>([])
  const [actions, setActions] = useState<AgentAction[]>([])
  const [state, setState] = useState<AgentState | null>(null)

  const transcriptRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Restore the session so a visitor who navigates between pages does not have
  // to re-answer everything they already told Harri.
  useEffect(() => {
    const opener = greeting()
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as {
          messages: Bubble[]
          state: AgentState
          quickReplies: string[]
        }
        if (saved.messages?.length) {
          setMessages(saved.messages)
          setState(saved.state)
          setQuickReplies(saved.quickReplies ?? [])
          return
        }
      }
    } catch {
      // Corrupt session storage just means a fresh conversation.
    }

    setMessages([{ id: 'greeting', role: 'assistant', content: opener.reply }])
    setState(opener.state)
    setQuickReplies(opener.quickReplies)
    setActions(opener.actions)
  }, [])

  useEffect(() => {
    if (!state || messages.length === 0) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, state, quickReplies }))
    } catch {
      // Storage full or disabled — the conversation still works in memory.
    }
  }, [messages, state, quickReplies])

  // One unobtrusive nudge per session, and only if they never opened the panel.
  useEffect(() => {
    if (open) return
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(`${STORAGE_KEY}-nudged`)) {
        setNudge(true)
        sessionStorage.setItem(`${STORAGE_KEY}-nudged`, '1')
      }
    }, NUDGE_DELAY)
    return () => clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!open) return
    transcriptRef.current?.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy, open])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || busy) return

      const outgoing: Bubble = { id: `u-${Date.now()}`, role: 'user', content: trimmed }
      const history = messages.slice(-10).map(({ role, content }) => ({ role, content }))

      setMessages((current) => [...current, outgoing])
      setDraft('')
      setQuickReplies([])
      setBusy(true)

      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: trimmed, state, history }),
        })
        if (!response.ok) throw new Error(`Agent responded ${response.status}`)

        const turn = (await response.json()) as AgentTurn
        setMessages((current) => [
          ...current,
          { id: `a-${Date.now()}`, role: 'assistant', content: turn.reply },
        ])
        setState(turn.state)
        setQuickReplies(turn.quickReplies ?? [])
        setActions(turn.actions ?? [])
      } catch {
        setMessages((current) => [
          ...current,
          {
            id: `a-err-${Date.now()}`,
            role: 'assistant',
            content: `Sorry — I lost the connection there. Call ${contact.phone} or message the same number on WhatsApp and the team will pick it up straight away.`,
          },
        ])
      } finally {
        setBusy(false)
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    },
    [busy, messages, state],
  )

  // The agent builds a WhatsApp message pre-filled with everything it has
  // learned, so handing over to a human does not restart the conversation.
  const whatsappAction = actions.find((action) => action.type === 'whatsapp')
  const handoffMessage =
    whatsappAction?.type === 'whatsapp'
      ? whatsappAction.message
      : 'Hello Harriscom, I have a project I would like to discuss.'

  const openPanel = () => {
    setOpen(true)
    setNudge(false)
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  return (
    <>
      {/* Launcher */}
      <div
        style={{
          position: 'fixed',
          right: '1.5rem',
          bottom: '1.5rem',
          zIndex: 11,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        {nudge && !open && (
          <button
            type="button"
            onClick={openPanel}
            className="h-glass"
            style={{
              maxWidth: '15rem',
              padding: '0.7rem 1rem',
              borderRadius: 14,
              textAlign: 'left',
              cursor: 'pointer',
              color: 'var(--neutral-on-background-medium)',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              animation: 'h-bubble-in 0.4s ease both',
            }}
          >
            Want a ballpark price for your project? Ask me — it takes a minute.
          </button>
        )}

        <button
          type="button"
          onClick={() => (open ? setOpen(false) : openPanel())}
          aria-label={open ? 'Close the Harriscom assistant' : 'Chat with Harri, the Harriscom assistant'}
          aria-expanded={open}
          className="h-fab"
          style={{
            position: 'relative',
            width: '3.75rem',
            height: '3.75rem',
            background: 'linear-gradient(140deg, #31469B 0%, #1B2B6B 55%, #0B1230 100%)',
            borderColor: 'rgba(255,255,255,0.18)',
          }}
        >
          {open ? <Icon name="close" size="s" /> : <HarriAvatar size={30} />}
          {!open && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: 4,
                right: 4,
                width: 11,
                height: 11,
                borderRadius: '50%',
                background: '#3DAF64',
                border: '2px solid #0b1230',
              }}
            />
          )}
        </button>
      </div>

      {/* Panel */}
      {open && (
        <Column
          role="dialog"
          aria-label={`Chat with Harri, the ${company.shortName} assistant`}
          className="h-glass"
          radius="l"
          style={{
            position: 'fixed',
            right: '1.5rem',
            bottom: 'calc(1.5rem + 4.5rem)',
            zIndex: 11,
            width: 'min(24rem, calc(100vw - 3rem))',
            height: 'min(34rem, calc(100dvh - 9rem))',
            overflow: 'hidden',
            animation: 'h-bubble-in 0.34s cubic-bezier(0.22,1,0.36,1) both',
          }}
        >
          {/* Header */}
          <Row
            vertical="center"
            gap="12"
            padding="16"
            fillWidth
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', flex: '0 0 auto' }}
          >
            <HarriAvatar />
            <Column gap="2" style={{ flex: 1 }}>
              <Text variant="label-strong-s" onBackground="neutral-strong">
                Harri · {company.shortName} assistant
              </Text>
              <Row vertical="center" gap="4">
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#3DAF64',
                    boxShadow: '0 0 0 3px rgba(61,175,100,0.22)',
                  }}
                />
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  Online · answers instantly
                </Text>
              </Row>
            </Column>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
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

          {/* Transcript */}
          <Column
            ref={transcriptRef}
            gap="12"
            padding="16"
            fillWidth
            style={{ flex: 1, overflowY: 'auto' }}
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((bubble) => (
              <Row
                key={bubble.id}
                fillWidth
                horizontal={bubble.role === 'user' ? 'end' : 'start'}
              >
                <div
                  className="h-bubble"
                  style={{
                    padding: '0.7rem 0.9rem',
                    borderRadius: bubble.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:
                      bubble.role === 'user'
                        ? 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)'
                        : 'rgba(255,255,255,0.055)',
                    border: bubble.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: bubble.role === 'user' ? '#0b1230' : 'var(--neutral-on-background-medium)',
                    fontSize: '0.86rem',
                    lineHeight: 1.65,
                  }}
                >
                  <RichText value={bubble.content} />
                </div>
              </Row>
            ))}

            {busy && (
              <Row
                className="h-typing"
                gap="4"
                vertical="center"
                style={{
                  padding: '0.75rem 0.9rem',
                  borderRadius: '14px 14px 14px 4px',
                  background: 'rgba(255,255,255,0.055)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  width: 'fit-content',
                  color: 'var(--neutral-on-background-weak)',
                }}
                aria-label="Harri is typing"
              >
                <span />
                <span />
                <span />
              </Row>
            )}
          </Column>

          {/* Quick replies */}
          {quickReplies.length > 0 && !busy && (
            <Row gap="8" wrap paddingX="16" paddingBottom="8" style={{ flex: '0 0 auto' }}>
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => send(reply)}
                  style={{
                    padding: '0.4rem 0.8rem',
                    borderRadius: 999,
                    border: '1px solid rgba(245,166,35,0.35)',
                    background: 'rgba(245,166,35,0.08)',
                    color: 'var(--h-amber)',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    transition: 'background 0.2s ease',
                  }}
                >
                  {reply}
                </button>
              ))}
            </Row>
          )}

          {/* Composer */}
          <Column
            as="form"
            gap="8"
            padding="12"
            fillWidth
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)', flex: '0 0 auto' }}
            onSubmit={(event: React.FormEvent) => {
              event.preventDefault()
              void send(draft)
            }}
          >
            <Row gap="8" vertical="center" fillWidth>
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Ask about cost, timing or coverage…"
                aria-label="Message Harri"
                maxLength={1000}
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: '0.7rem 0.9rem',
                  borderRadius: 999,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.04)',
                  color: 'var(--neutral-on-background-strong)',
                  fontSize: '0.86rem',
                  fontFamily: 'var(--font-body)',
                  outline: 'none',
                }}
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label="Send message"
                style={{
                  display: 'grid',
                  placeItems: 'center',
                  width: '2.5rem',
                  height: '2.5rem',
                  flex: '0 0 auto',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: busy || !draft.trim() ? 'not-allowed' : 'pointer',
                  opacity: busy || !draft.trim() ? 0.45 : 1,
                  background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                  color: '#0b1230',
                  transition: 'opacity 0.2s ease',
                }}
              >
                <Icon name="arrowUpRight" size="xs" />
              </button>
            </Row>

            <Row gap="12" horizontal="between" vertical="center" fillWidth paddingX="4">
              <a
                href={whatsappLink(handoffMessage)}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#3DAF64', fontSize: '0.74rem', textDecoration: 'none', fontWeight: 500 }}
              >
                Continue on WhatsApp
              </a>
              <a
                href={contact.phoneHref}
                style={{ color: 'var(--neutral-on-background-weak)', fontSize: '0.74rem', textDecoration: 'none' }}
              >
                Call {contact.phone}
              </a>
            </Row>
          </Column>
        </Column>
      )}
    </>
  )
}
