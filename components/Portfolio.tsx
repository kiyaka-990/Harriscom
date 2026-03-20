'use client'

import { useState } from 'react'

const projects = [
  { id: 1, cat: 'construction', title: 'Office Complex – Westlands', img: '/images/service-1.jpeg', tall: false },
  { id: 2, cat: 'interior',     title: 'Luxury Apartment Fit-Out',  img: '/images/service-2.jpg', tall: true  },
  { id: 3, cat: 'construction', title: 'Commercial Tower – CBD',     img: '/images/hero-1.jpg', tall: false },
  { id: 4, cat: 'supply',       title: 'Materials Supply – Mombasa Road', img: '/images/service-3.jpg', tall: false },
  { id: 5, cat: 'interior',     title: 'Penthouse Renovation',       img: '/images/project-5.jpeg', tall: true  },
  { id: 6, cat: 'construction', title: 'Industrial Warehouse – Mlolongo', img: '/images/service-4.jpg', tall: false },
  { id: 7, cat: 'supply',       title: 'Hardware & Tools Supply',    img: '/images/project-7.jpg', tall: false },
  { id: 8, cat: 'interior',     title: 'Corporate Office Interior',  img: '/images/project-9.jpg', tall: false },
  { id: 9, cat: 'construction', title: 'Residential Apts – Thika Rd', img: '/images/service-5.jpeg', tall: true  },
]

const filters = ['All', 'Construction', 'Interior', 'Supply']
const catColors: Record<string, string> = {
  construction: 'var(--navy)',
  interior: 'var(--violet)',
  supply: 'var(--emerald)',
}

export default function Portfolio() {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? projects : projects.filter(p => p.cat === active.toLowerCase())

  return (
    <section id="portfolio" style={{ background: 'white', padding: '7rem 5%' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '.72rem', letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--crimson)', fontWeight: 600, marginBottom: '.75rem' }}>
              Our Work
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 700, color: 'var(--navy)' }}>
              Featured Projects
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActive(f)}
                style={{
                  background: active === f ? 'var(--navy)' : 'transparent',
                  color: active === f ? 'white' : 'var(--text-body)',
                  border: `1px solid ${active === f ? 'var(--navy)' : 'rgba(27,43,107,0.2)'}`,
                  padding: '.4rem 1.1rem',
                  borderRadius: 2,
                  fontSize: '.78rem',
                  letterSpacing: '.07em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  transition: 'all .2s',
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry grid */}
        <div style={{ columns: 3, columnGap: '1.2rem' }} className="portfolio-masonry">
          {filtered.map((p) => (
            <div
              key={p.id}
              style={{
                breakInside: 'avoid',
                marginBottom: '1.2rem',
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                cursor: 'pointer',
              }}
              className="portfolio-item"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.img}
                alt={p.title}
                style={{
                  width: '100%',
                  display: 'block',
                  aspectRatio: p.tall ? '3/4' : '4/3',
                  objectFit: 'cover',
                  transition: 'transform .5s ease',
                }}
                loading="lazy"
              />
              <div
                className="portfolio-overlay"
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(15,26,68,.88) 0%, transparent 55%)',
                  opacity: 0,
                  transition: 'opacity .3s',
                  display: 'flex', alignItems: 'flex-end',
                  padding: '1.2rem',
                }}
              >
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: catColors[p.cat] || 'var(--navy)',
                    color: 'white',
                    fontSize: '.65rem',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    padding: '.2rem .65rem',
                    borderRadius: 2,
                    marginBottom: '.4rem',
                    fontWeight: 600,
                  }}>
                    {p.cat}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'white',
                  }}>
                    {p.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .portfolio-item:hover img { transform: scale(1.06); }
        .portfolio-item:hover .portfolio-overlay { opacity: 1 !important; }
        @media (max-width: 768px) { .portfolio-masonry { columns: 2 !important; } }
        @media (max-width: 480px) { .portfolio-masonry { columns: 1 !important; } }
      `}</style>
    </section>
  )
}
