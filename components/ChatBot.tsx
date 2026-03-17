'use client'

import { useState, useRef, useEffect } from 'react'
import { harriRespond } from '@/lib/harriBrain'

type Message = { role: 'user' | 'assistant'; content: string; time: string }

const QUICK_QUESTIONS = [
  'What services do you offer?',
  'How do I get a quote?',
  'Where are you located?',
  'How long do projects take?',
]

function getTime() {
  return new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

function renderMessage(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    if (!line.trim()) return <br key={i} />
    const parts = line.split(/(\*\*[^*]+\*\*)/)
    const rendered = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j}>{part.slice(2, -2)}</strong>
      }
      return <span key={j}>{part}</span>
    })
    return <div key={i} style={{ lineHeight: 1.65 }}>{rendered}</div>
  })
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [badgeVisible, setBadgeVisible] = useState(true)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! 👋 I'm **Harri**, your Harriscom AI assistant — fully trained on everything about our company.\n\nAsk me about services, pricing, location, or how to get started. No question is too big or small!",
      time: getTime(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setBadgeVisible(false)
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [messages, open])

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared! 🧹 How can I help you today? Ask me about our services, pricing, location, or anything Harriscom.",
      time: getTime(),
    }])
  }

  const send = (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return
    setMessages(prev => [...prev, { role: 'user', content, time: getTime() }])
    setInput('')
    setLoading(true)
    const delay = 380 + Math.random() * 520
    setTimeout(() => {
      const reply = harriRespond(content)
      setMessages(prev => [...prev, { role: 'assistant', content: reply, time: getTime() }])
      setLoading(false)
    }, delay)
  }

  return (
    <div className="chat-widget">

      {open && (
        <div className="chat-window" style={{ animation: 'slideInRight .3s ease' }}>

          {/* ── Header ── */}
          <div style={{
            background: 'linear-gradient(135deg, var(--navy-dark), var(--navy))',
            padding: '1rem 1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: 'var(--amber)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem',
                  color: 'var(--navy)', border: '2px solid rgba(255,255,255,.2)',
                }}>
                  H
                </div>
                <span style={{
                  position: 'absolute', bottom: 1, right: 1,
                  width: 10, height: 10, borderRadius: '50%',
                  background: '#22C55E', border: '2px solid var(--navy)',
                }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: 'white', lineHeight: 1.2 }}>
                  Harri
                </div>
                <div style={{ fontSize: '.66rem', color: 'rgba(255,255,255,.6)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', display: 'inline-block' }} />
                  Harriscom AI · Always Online
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={clearChat} title="Clear chat"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.5)', fontSize: '.85rem', padding: '4px 6px', borderRadius: 4, transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'white'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.5)'}
              >🗑️</button>
              <button onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,.6)', fontSize: '1rem', padding: '4px 6px', borderRadius: 4 }}>
                ✕
              </button>
            </div>
          </div>

          {/* Brand stripe */}
          <div className="brand-stripe" style={{ height: 3, flexShrink: 0 }} />

          {/* ── Messages ── */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            display: 'flex', flexDirection: 'column', gap: '.85rem',
            background: 'var(--off-white)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{
                background: 'rgba(27,43,107,0.07)', color: 'var(--mid-gray)',
                fontSize: '.62rem', padding: '.2rem .75rem', borderRadius: 12,
                letterSpacing: '.06em', textTransform: 'uppercase',
              }}>Today</span>
            </div>

            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end', gap: 7,
                animation: 'fadeUp .3s ease',
              }}>
                {m.role === 'assistant' && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: 'var(--navy)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700, fontSize: '.78rem', color: 'var(--amber)',
                    flexShrink: 0,
                  }}>H</div>
                )}
                <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: 3 }}>
                  <div
                    className={m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}
                    style={{ padding: '.65rem 1rem', fontSize: '.86rem' }}
                  >
                    {renderMessage(m.content)}
                  </div>
                  <span style={{ fontSize: '.6rem', color: 'var(--mid-gray)', paddingLeft: 4 }}>{m.time}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 7, animation: 'fadeIn .25s ease' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', background: 'var(--navy)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.78rem', color: 'var(--amber)',
                  flexShrink: 0,
                }}>H</div>
                <div className="chat-bubble-bot" style={{ padding: '.6rem .9rem', display: 'flex', gap: 5, alignItems: 'center' }}>
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Quick questions (start only) ── */}
          {messages.length <= 1 && (
            <div style={{
              padding: '.7rem 1rem', borderTop: '1px solid rgba(27,43,107,0.07)',
              background: 'white', display: 'flex', gap: '.4rem', flexWrap: 'wrap', flexShrink: 0,
            }}>
              <div style={{ width: '100%', fontSize: '.62rem', textTransform: 'uppercase', letterSpacing: '.1em', color: 'var(--mid-gray)', marginBottom: 2, fontWeight: 600 }}>
                Quick questions
              </div>
              {QUICK_QUESTIONS.map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: 'var(--light-gray)', border: '1px solid rgba(27,43,107,0.1)',
                  color: 'var(--navy)', padding: '.28rem .75rem', borderRadius: 20,
                  fontSize: '.74rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontWeight: 500, transition: 'all .2s', lineHeight: 1.5,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--navy)'; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--light-gray)'; e.currentTarget.style.color = 'var(--navy)' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Suggested follow-ups ── */}
          {messages.length > 2 && messages[messages.length - 1].role === 'assistant' && !loading && (
            <div style={{
              padding: '.5rem 1rem', borderTop: '1px solid rgba(27,43,107,0.06)',
              background: 'white', display: 'flex', gap: '.4rem', flexWrap: 'wrap', flexShrink: 0,
            }}>
              {['Get a quote', 'Contact team', 'Our process', 'Why Harriscom?'].map(q => (
                <button key={q} onClick={() => send(q)} style={{
                  background: 'transparent', border: '1px solid rgba(27,43,107,0.18)',
                  color: 'var(--text-body)', padding: '.22rem .65rem', borderRadius: 20,
                  fontSize: '.71rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  fontWeight: 500, transition: 'all .2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy)'; e.currentTarget.style.color = 'var(--navy)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(27,43,107,0.18)'; e.currentTarget.style.color = 'var(--text-body)' }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Input ── */}
          <div style={{
            padding: '.75rem 1rem', borderTop: '1px solid rgba(27,43,107,0.08)',
            display: 'flex', gap: '.6rem', background: 'white', flexShrink: 0, alignItems: 'center',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
              placeholder="Ask Harri anything…"
              disabled={loading}
              style={{
                flex: 1, background: 'var(--off-white)',
                border: '1px solid rgba(27,43,107,0.15)', borderRadius: 24,
                padding: '.55rem 1rem', fontFamily: 'var(--font-body)',
                fontSize: '.88rem', outline: 'none', color: 'var(--text-dark)', transition: 'border-color .2s',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--navy)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(27,43,107,0.15)'}
            />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              style={{
                width: 38, height: 38, borderRadius: '50%',
                background: input.trim() && !loading ? 'var(--navy)' : 'var(--light-gray)',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all .2s',
              }}
              onMouseEnter={e => { if (input.trim()) e.currentTarget.style.transform = 'scale(1.1)' }}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke={input.trim() && !loading ? 'white' : 'var(--mid-gray)'} strokeWidth="2" strokeLinecap="round" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" stroke={input.trim() && !loading ? 'white' : 'var(--mid-gray)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center', padding: '.32rem', background: 'var(--off-white)',
            fontSize: '.6rem', color: 'var(--mid-gray)',
            borderTop: '1px solid rgba(27,43,107,0.05)', flexShrink: 0,
          }}>
            Harri is locally trained · Harriscom Company Limited · No data shared externally
          </div>
        </div>
      )}

      {/* ── Toggle button ── */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: 60, height: 60, borderRadius: '50%',
          background: open ? 'var(--crimson)' : 'linear-gradient(135deg, var(--navy-dark), var(--navy-light))',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(27,43,107,0.4)',
          transition: 'all .3s', position: 'relative',
        }}
        aria-label={open ? 'Close chat' : 'Chat with Harri'}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {!open && (
          <>
            <span style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: '2px solid rgba(27,43,107,0.35)', animation: 'pulse-ring 2s ease-out infinite' }} />
            <span style={{ position: 'absolute', inset: -11, borderRadius: '50%', border: '2px solid rgba(27,43,107,0.15)', animation: 'pulse-ring 2s ease-out .6s infinite' }} />
          </>
        )}
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 10h8M8 13h5" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Badge */}
      {!open && badgeVisible && (
        <span style={{
          position: 'absolute', top: -5, right: -5,
          minWidth: 22, height: 22, borderRadius: 11,
          background: 'var(--crimson)', border: '2.5px solid white',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '.62rem', fontWeight: 700, color: 'white', padding: '0 4px',
          animation: 'chatBounce 2s ease-in-out infinite',
        }}>Hi!</span>
      )}
    </div>
  )
}
