'use client'

import { useState, useEffect } from 'react'

const slides = [
  {
    image: '/images/hero-5.jpg',
    headline: 'Building Excellence,',
    sub: 'Supplying the Future',
  },
  {
    image: '/images/hero-6.jpg',
    headline: 'Nairobi\'s Most',
    sub: 'Trusted Contractor',
  },
  {
    image: '/images/hero-2.jpg',
    headline: 'Quality Roads,',
    sub: 'Connecting Kenya',
  },
  {
    image: '/images/hero-7.jpg',
    headline: 'From Foundation',
    sub: 'To Finishing',
  },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = (n: number) => {
    setFading(true)
    setTimeout(() => {
      setCurrent(n)
      setFading(false)
    }, 400)
  }

  useEffect(() => {
    const t = setInterval(() => goTo((current + 1) % slides.length), 5500)
    return () => clearInterval(t)
  }, [current])

  const slide = slides[current]

  return (
    <section
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: 640,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${slide.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'opacity .4s ease',
          opacity: fading ? 0 : 1,
        }}
      />

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(135deg, rgba(15,26,68,.82) 0%, rgba(27,43,107,.65) 50%, rgba(10,10,10,.55) 100%)',
      }} />

      {/* Brand stripe at bottom of hero */}
      <div className="brand-stripe" style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, zIndex: 3 }} />

      {/* Content */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center',
          padding: '0 5%',
          maxWidth: 860,
          animation: 'fadeUp .8s ease both',
          opacity: fading ? 0 : 1,
          transition: 'opacity .4s ease',
        }}
      >
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          border: '1px solid rgba(245,166,35,.5)',
          padding: '.35rem 1.2rem',
          borderRadius: 2,
          marginBottom: '1.5rem',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--emerald)', display: 'inline-block' }} />
          <span style={{ color: 'var(--amber)', fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', fontWeight: 600 }}>
            Nairobi, Kenya · Est. 2022
          </span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(3rem,6.5vw,6rem)',
          fontWeight: 700,
          color: 'white',
          lineHeight: 1.05,
          marginBottom: '1.4rem',
          letterSpacing: '-.01em',
        }}>
          {slide.headline}<br />
          <span style={{ color: 'var(--amber)' }}>{slide.sub}</span>
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'rgba(255,255,255,.7)',
          maxWidth: 540,
          margin: '0 auto 2.5rem',
          fontWeight: 300,
          lineHeight: 1.75,
        }}>
          Harriscom Company Limited — delivering world-class construction and general supply solutions across Kenya, on time and on budget.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="#portfolio"
            style={{
              background: 'var(--crimson)',
              color: 'white',
              padding: '.9rem 2.4rem',
              borderRadius: 3,
              fontSize: '.88rem',
              fontWeight: 600,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all .25s',
            }}
          >
            View Our Projects
          </a>
          <a
            href="#contact"
            style={{
              background: 'transparent',
              color: 'white',
              padding: '.9rem 2.4rem',
              border: '1px solid rgba(255,255,255,.35)',
              borderRadius: 3,
              fontSize: '.88rem',
              fontWeight: 500,
              letterSpacing: '.06em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'all .25s',
            }}
          >
            Request a Quote
          </a>
        </div>
      </div>

      {/* Slide dots */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: '.6rem', zIndex: 3,
      }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: current === i ? 28 : 8,
              height: 8,
              borderRadius: 10,
              background: current === i ? 'var(--amber)' : 'rgba(255,255,255,.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all .35s',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Slide number */}
      <div style={{
        position: 'absolute', bottom: '2.5rem', right: '5%', zIndex: 3,
        color: 'rgba(255,255,255,.5)',
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
      }}>
        <span style={{ color: 'var(--amber)', fontSize: '1.3rem', fontWeight: 700 }}>0{current + 1}</span>
        {' '}/ 0{slides.length}
      </div>
    </section>
  )
}
