'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', service: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    background: 'var(--off-white)',
    border: '1px solid rgba(27,43,107,0.15)',
    color: 'var(--text-dark)',
    padding: '.85rem 1rem',
    borderRadius: 3,
    fontFamily: 'var(--font-body)',
    fontSize: '.92rem',
    outline: 'none',
    width: '100%',
    transition: 'border-color .2s',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '.72rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '.1em',
    color: 'var(--mid-gray)',
    fontWeight: 600,
    marginBottom: '.4rem',
    display: 'block',
  }

  return (
    <section id="contact" style={{ background: 'white', padding: '7rem 5%' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'start' }} className="contact-grid">

        {/* Info */}
        <div>
          <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 600, marginBottom: '.75rem' }}>
            Get In Touch
          </div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3vw,2.8rem)', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>
            Let's Talk About Your Project
          </h2>
          <p className="reveal" style={{ color: 'var(--text-body)', lineHeight: 1.8, fontWeight: 300, marginBottom: '2.5rem' }}>
            Our team is available Monday–Saturday, 8am–6pm EAT. Reach out and we'll respond within 24 hours.
          </p>

          {[
            { icon: '📍', label: 'Address', val: '12th Floor, Bruce House\nStandard Street, Nairobi\nP.O Box 38631-00100', color: 'var(--navy)' },
            { icon: '📞', label: 'Phone', val: '+254 728 392 225', color: 'var(--emerald)' },
            { icon: '✉️', label: 'Email', val: 'mdjaafar2225@gmail.com', color: 'var(--crimson)' },
            { icon: '🌐', label: 'Website', val: 'www.harriscomcompany.co.ke', color: 'var(--teal)' },
          ].map((c, i) => (
            <div key={c.label} className={`reveal reveal-delay-${i + 1}`} style={{ display: 'flex', gap: '1.2rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
              <div style={{
                width: 44, height: 44, minWidth: 44,
                borderRadius: '50%',
                background: c.color + '14',
                border: `1px solid ${c.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>
                {c.icon}
              </div>
              <div>
                <div style={{ fontSize: '.7rem', textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--mid-gray)', fontWeight: 600, marginBottom: '.25rem' }}>
                  {c.label}
                </div>
                <div style={{ fontSize: '.92rem', color: 'var(--text-dark)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {c.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="reveal glass-card" style={{ padding: '2.5rem', borderRadius: 10 }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.75rem' }}>
                Message Sent!
              </h3>
              <p style={{ color: 'var(--text-body)', lineHeight: 1.7 }}>
                Thank you for reaching out. Our team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }} className="form-row">
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input name="name" value={form.name} onChange={handle} placeholder="John Kamau" required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input name="phone" value={form.phone} onChange={handle} placeholder="+254 7XX XXX XXX" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email Address *</label>
                <input type="email" name="email" value={form.email} onChange={handle} placeholder="john@company.co.ke" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Service Required</label>
                <select name="service" value={form.service} onChange={handle} style={inputStyle}>
                  <option value="">Select a service…</option>
                  {['Building Construction', 'Renovations & Fit-Out', 'General Supplies', 'Electrical & Plumbing', 'Interior Design', 'Project Management', 'Other'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Project Details *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handle}
                  rows={4}
                  required
                  placeholder="Describe your project, location, and timeline…"
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>
              {status === 'error' && (
                <p style={{ color: 'var(--crimson)', fontSize: '.85rem' }}>Something went wrong. Please try again.</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  background: status === 'loading' ? 'var(--mid-gray)' : 'var(--navy)',
                  color: 'white',
                  padding: '1rem',
                  border: 'none',
                  borderRadius: 3,
                  fontSize: '.9rem',
                  fontWeight: 600,
                  letterSpacing: '.06em',
                  textTransform: 'uppercase',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'background .2s',
                }}
              >
                {status === 'loading' ? 'Sending…' : 'Send Enquiry →'}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) { .contact-grid { grid-template-columns: 1fr !important; } .form-row { grid-template-columns: 1fr !important; } }
        input:focus, select:focus, textarea:focus { border-color: var(--navy) !important; box-shadow: 0 0 0 3px rgba(27,43,107,0.08); }
      `}</style>
    </section>
  )
}
