'use client'

import { useEffect, useRef, useState } from 'react'

const stats = [
  { num: 150, suffix: '+', label: 'Projects Completed' },
  { num: 30,  suffix: '+', label: 'Corporate Clients'  },
  { num: 12,  suffix: '',  label: 'Counties Served'    },
  { num: 3,   suffix: '+', label: 'Years of Excellence' },
]

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        let start = 0
        const step = target / 55
        const t = setInterval(() => {
          start += step
          if (start >= target) { setVal(target); clearInterval(t) }
          else setVal(Math.floor(start))
        }, 28)
      }
    }, { threshold: .5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target])

  return <span ref={ref}>{val}{suffix}</span>
}

export default function StatsBar() {
  return (
    <div style={{
      background: 'var(--navy)',
      padding: '3.5rem 5%',
      borderTop: '4px solid var(--amber)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: '2rem',
        maxWidth: 1100,
        margin: '0 auto',
      }}>
        {stats.map((s) => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '3.2rem',
              fontWeight: 700,
              color: 'var(--amber)',
              lineHeight: 1,
            }}>
              <Counter target={s.num} suffix={s.suffix} />
            </div>
            <div style={{
              fontSize: '.78rem',
              color: 'rgba(255,255,255,.6)',
              textTransform: 'uppercase',
              letterSpacing: '.14em',
              marginTop: '.5rem',
              fontWeight: 500,
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
