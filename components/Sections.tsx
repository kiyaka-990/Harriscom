'use client'

import { useState, useEffect } from 'react'

// ─── ABOUT ──────────────────────────────────────────────────────────────────
export function About() {
  return (
    <section id="about" style={{ background: 'white', padding: '7rem 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="about-grid">
        {/* Image side */}
        <div className="reveal" style={{ position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
            alt="Harriscom construction project"
            style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', borderRadius: 6, display: 'block' }}
          />
          {/* Floating badge */}
          <div style={{
            position: 'absolute', bottom: -24, right: -24,
            background: 'var(--navy)',
            color: 'white',
            padding: '1.4rem 1.8rem',
            borderRadius: 4,
            borderLeft: '4px solid var(--amber)',
          }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--amber)', lineHeight: 1 }}>100%</div>
            <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.1em', marginTop: '.3rem', color: 'rgba(255,255,255,.8)' }}>KENYAN OWNED</div>
          </div>
          {/* Coloured accent block */}
          <div style={{
            position: 'absolute', top: -16, left: -16, width: 80, height: 80,
            background: 'var(--crimson)', borderRadius: 4, zIndex: -1, opacity: .15,
          }} />
        </div>

        {/* Text side */}
        <div>
          <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 600, marginBottom: '.75rem' }}>Our Story</div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3vw,2.8rem)', fontWeight: 700, color: 'var(--navy)', marginBottom: '1.2rem', lineHeight: 1.15 }}>
            Nairobi's Trusted Construction Partner
          </h2>
          <p className="reveal" style={{ color: 'var(--text-body)', lineHeight: 1.8, fontWeight: 300, marginBottom: '1.5rem' }}>
            Founded in October 2022, Harriscom Company Limited has grown rapidly into a leading name in construction and general supplies across Kenya. Headquartered at Bruce House on Standard Street, Nairobi, we combine local expertise with modern building standards to deliver exceptional results.
          </p>
          <ul className="reveal" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
            {[
              'Registered under The Companies Act, 2015 · No. PVT-6LUK5LZD',
              'End-to-end construction from design to handover',
              'Reliable procurement and supply chain management',
              'Committed to sustainable and compliant building practices',
            ].map((item) => (
              <li key={item} style={{ display: 'flex', gap: '.85rem', alignItems: 'flex-start', fontSize: '.92rem', color: 'var(--text-body)', lineHeight: 1.6 }}>
                <span style={{
                  width: 20, height: 20, minWidth: 20,
                  borderRadius: '50%',
                  background: 'var(--emerald)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 2,
                }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="reveal" style={{ marginTop: '2.5rem' }}>
            <a href="#contact" style={{
              display: 'inline-block',
              background: 'var(--navy)',
              color: 'white',
              padding: '.85rem 2.2rem',
              borderRadius: 3,
              fontSize: '.85rem',
              fontWeight: 600,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Work With Us →
            </a>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .about-grid { grid-template-columns: 1fr !important; gap: 4rem !important; } }
      `}</style>
    </section>
  )
}

// ─── PROCESS ─────────────────────────────────────────────────────────────────
const steps = [
  { num: '01', color: 'var(--navy)',    icon: '💬', title: 'Consultation',    desc: 'We meet to understand your vision, budget, timeline, and specific requirements.' },
  { num: '02', color: 'var(--teal)',    icon: '📐', title: 'Planning & Design', desc: 'Comprehensive plans, material schedules, and cost estimates developed for your approval.' },
  { num: '03', color: 'var(--crimson)', icon: '🏗️',  title: 'Execution',      desc: 'Skilled teams execute every phase with precision under continuous quality supervision.' },
  { num: '04', color: 'var(--emerald)', icon: '🎯', title: 'Handover',        desc: 'Final inspection, client walkthrough, documentation, and post-completion support.' },
]

export function Process() {
  return (
    <section id="process" style={{ background: 'var(--navy-dark)', padding: '7rem 5%' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--amber)', fontWeight: 600, marginBottom: '.75rem' }}>
            How We Work
          </div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, color: 'white' }}>
            Our Proven Process
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1.5rem' }} className="process-grid">
          {steps.map((s, i) => (
            <div key={s.num} className={`reveal reveal-delay-${i + 1}`} style={{ textAlign: 'center', position: 'relative' }}>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 30, left: '60%', width: '80%',
                  height: 1,
                  background: 'rgba(255,255,255,.12)',
                  zIndex: 0,
                }} className="connector-line" />
              )}
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem',
                position: 'relative', zIndex: 1,
                fontSize: '1.4rem',
              }}>
                {s.icon}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2rem', fontWeight: 700,
                color: s.color, opacity: .3,
                lineHeight: 1, marginBottom: '.5rem',
              }}>
                {s.num}
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'white', marginBottom: '.75rem' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.55)', lineHeight: 1.7, fontWeight: 300 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) { .process-grid { grid-template-columns: repeat(2,1fr) !important; } .connector-line { display: none; } }
        @media (max-width: 480px) { .process-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

// ─── WHY US ──────────────────────────────────────────────────────────────────
const whys = [
  { color: 'var(--navy)',   title: 'Certified & Compliant',  desc: "Fully registered under the Companies Act, 2015. All works comply with Kenya's NCA standards." },
  { color: 'var(--crimson)',title: 'On-Time Delivery',        desc: 'Strict schedule management ensures clients receive projects on or ahead of agreed timelines.' },
  { color: 'var(--emerald)',title: 'Value-Driven Pricing',    desc: 'Competitive, transparent quotes with no hidden costs — maximum value for every shilling.' },
  { color: 'var(--teal)',   title: '360° Solutions',          desc: 'From design and construction to procurement — one company, complete capability.' },
  { color: 'var(--violet)', title: 'Nairobi Expertise',       desc: 'Deep knowledge of local regulations, suppliers, and terrain gives Harriscom a decisive edge.' },
  { color: 'var(--amber)',  title: 'Client Satisfaction',     desc: "We don't consider a project complete until the client is fully satisfied — warranty included." },
]

export function WhyUs() {
  return (
    <section id="why" style={{ background: 'var(--off-white)', padding: '7rem 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 600, marginBottom: '.75rem' }}>
            Why Harriscom
          </div>
          <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, color: 'var(--navy)' }}>
            The Harriscom Advantage
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }} className="why-grid">
          {whys.map((w, i) => (
            <div
              key={w.title}
              className={`reveal reveal-delay-${(i % 3) + 1} glass-card`}
              style={{
                padding: '2rem',
                borderRadius: 8,
                transition: 'transform .3s, box-shadow .3s',
                cursor: 'default',
                borderTop: `3px solid ${w.color}`,
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: w.color + '18',
                border: `1px solid ${w.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.2rem',
              }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: w.color }} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy)', marginBottom: '.6rem' }}>
                {w.title}
              </h3>
              <p style={{ fontSize: '.86rem', color: 'var(--text-body)', lineHeight: 1.7, fontWeight: 300 }}>
                {w.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 580px) { .why-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  { quote: 'Harriscom delivered our office fit-out in Westlands two weeks ahead of schedule. The quality of work was exceptional and the team was professional throughout.', name: 'James Muthui', role: 'Director, Muthui & Associates' },
  { quote: 'We\'ve used Harriscom for three of our residential developments in Nairobi. They consistently deliver on their promises — quality materials, skilled labour, and fair pricing.', name: 'Amina Hassan', role: 'Property Developer, Amina Realty Ltd' },
  { quote: 'From the initial consultation to project handover, Harriscom was transparent, efficient, and genuinely invested in our success. Highly recommended.', name: 'Peter Njoroge', role: 'CEO, Njoroge Construction Group' },
]

export function Testimonials() {
  const [cur, setCur] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCur(c => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section style={{ background: 'white', padding: '7rem 5%', textAlign: 'center', overflow: 'hidden' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 600, marginBottom: '.75rem' }}>
          Client Words
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, color: 'var(--navy)', marginBottom: '3.5rem' }}>
          What Our Clients Say
        </h2>

        <div style={{ transition: 'opacity .4s ease', opacity: 1 }}>
          {/* Quote marks */}
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '5rem', lineHeight: .6, color: 'var(--amber)', marginBottom: '1rem', userSelect: 'none' }}>"</div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.05rem,1.8vw,1.35rem)',
            color: 'var(--text-dark)',
            lineHeight: 1.75,
            fontStyle: 'italic',
            fontWeight: 400,
            marginBottom: '2rem',
            minHeight: 100,
          }}>
            {testimonials[cur].quote}
          </p>
          <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--navy)', letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {testimonials[cur].name}
          </div>
          <div style={{ fontSize: '.8rem', color: 'var(--mid-gray)', marginTop: '.3rem' }}>
            {testimonials[cur].role}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem', marginTop: '2.5rem' }}>
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              style={{
                width: cur === i ? 28 : 8, height: 8,
                borderRadius: 10,
                background: cur === i ? 'var(--navy)' : 'var(--light-gray)',
                border: 'none', cursor: 'pointer', transition: 'all .35s', padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA BAND ────────────────────────────────────────────────────────────────
export function CTABand() {
  return (
    <section style={{
      position: 'relative',
      padding: '8rem 5%',
      textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1600&q=80"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', zIndex: 0,
        }}
      />
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: 'linear-gradient(135deg, rgba(15,26,68,.9), rgba(45,140,78,.7))',
      }} />
      <div className="brand-stripe" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3 }} />

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, margin: '0 auto' }}>
        <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--amber)', fontWeight: 600, marginBottom: '1rem' }}>
          Ready to Build?
        </div>
        <h2 className="reveal" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem,4vw,3.2rem)',
          fontWeight: 700,
          color: 'white',
          marginBottom: '1.2rem',
          lineHeight: 1.15,
        }}>
          Let's Create Something <span style={{ color: 'var(--amber)' }}>Extraordinary</span> Together
        </h2>
        <p className="reveal" style={{ color: 'rgba(255,255,255,.75)', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.75 }}>
          Contact Harriscom today for a free consultation and competitive quote. Our team in Nairobi is ready to bring your vision to life.
        </p>
        <a href="#contact" className="reveal" style={{
          display: 'inline-block',
          background: 'var(--crimson)',
          color: 'white',
          padding: '1rem 3rem',
          borderRadius: 3,
          fontSize: '.95rem',
          fontWeight: 600,
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Start Your Project →
        </a>
      </div>
    </section>
  )
}
