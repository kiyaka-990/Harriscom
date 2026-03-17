'use client'

import React from 'react'

const services = [
  {
    num: '01', color: 'var(--navy)',
    title: 'Building Construction',
    desc: 'Residential, commercial, and industrial structures built to the highest standards of quality and safety compliance.',
    img: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
  },
  {
    num: '02', color: 'var(--crimson)',
    title: 'Renovations & Fit-Out',
    desc: 'Complete refurbishment, interior fit-out, and space transformation services for all property types.',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  },
  {
    num: '03', color: 'var(--emerald)',
    title: 'General Supplies',
    desc: 'Procurement and supply of construction materials, hardware, tools, and equipment across Kenya.',
    img: 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=600&q=80',
  },
  {
    num: '04', color: 'var(--teal)',
    title: 'Electrical & Plumbing',
    desc: 'Licensed MEP installations, maintenance and compliance inspections by certified engineers.',
    img: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&q=80',
  },
  {
    num: '05', color: 'var(--violet)',
    title: 'Interior Design',
    desc: 'Modern, functional interiors designed to match client vision, budget, and purpose.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  },
  {
    num: '06', color: 'var(--amber)',
    title: 'Project Management',
    desc: 'End-to-end supervision ensuring timely delivery, budget adherence, and quality assurance.',
    img: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=600&q=80',
  },
]

export default function Services() {
  return (
    <section id="services" style={{ background: 'var(--off-white)', padding: '7rem 5%' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: 1200, margin: '0 auto 4rem' }}>
        <div className="reveal" style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 600, marginBottom: '.75rem' }}>
          What We Do
        </div>
        <h2 className="reveal" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, color: 'var(--navy)', marginBottom: '1rem' }}>
          Comprehensive Services
        </h2>
        <p className="reveal" style={{ color: 'var(--text-body)', maxWidth: 560, margin: '0 auto', lineHeight: 1.75, fontWeight: 300 }}>
          From groundbreaking to finishing, and everything in between — Harriscom delivers integrated solutions tailored to every project scale.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem',
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`service-card reveal reveal-delay-${(i % 3) + 1}`}
            style={{
              background: 'white',
              borderRadius: 8,
              overflow: 'hidden',
              border: '1px solid rgba(27,43,107,0.07)',
            }}
          >
            <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.img}
                alt={s.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .5s ease' }}
                loading="lazy"
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(to top, ${s.color}cc 0%, transparent 60%)`,
              }} />
              <div style={{
                position: 'absolute', top: 14, left: 14,
                background: s.color,
                color: 'white',
                padding: '.25rem .7rem',
                borderRadius: 2,
                fontSize: '.68rem',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
                fontWeight: 700,
              }}>
                {s.num}
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 700,
                color: 'var(--navy)',
                marginBottom: '.65rem',
              }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '.88rem', color: 'var(--text-body)', lineHeight: 1.7, fontWeight: 300 }}>
                {s.desc}
              </p>
              <div style={{ marginTop: 1.2 + 'rem' }}>
                <a
                  href="#contact"
                  style={{
                    color: s.color,
                    fontSize: '.8rem',
                    fontWeight: 600,
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  Enquire Now
                  <span style={{ fontSize: '1rem' }}>→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
