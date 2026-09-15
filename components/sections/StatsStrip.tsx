'use client'

import { useEffect, useRef, useState } from 'react'
import { Column, Row, Text } from '@once-ui-system/core'

import { useReveal } from '@/hooks/useReveal'
import { stats } from '@/lib/site'

const DURATION = 1400

/**
 * Counts up to `value` once the strip is on screen.
 *
 * Deliberately not Once UI's CountFx: that drives itself from
 * requestAnimationFrame and will sit on its initial value if frames never come
 * (reduced motion, a background tab, a screenshot runner). A headline figure
 * reading "0+" is far worse than one that simply appears without animating, so
 * this always lands on the target even if the animation never runs.
 */
function Counter({ value, run }: { value: number; run: boolean }) {
  const [shown, setShown] = useState(0)
  const frame = useRef(0)

  useEffect(() => {
    if (!run) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(value)
      return
    }

    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min((now - start) / DURATION, 1)
      // Ease-out cubic: fast off the mark, settles gently on the final figure.
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))))
      if (progress < 1) frame.current = requestAnimationFrame(step)
    }
    frame.current = requestAnimationFrame(step)

    // Backstop: if frames never arrive, show the real number anyway.
    const settle = setTimeout(() => setShown(value), DURATION + 400)

    return () => {
      cancelAnimationFrame(frame.current)
      clearTimeout(settle)
    }
  }, [run, value])

  return <>{shown}</>
}

export default function StatsStrip() {
  const { ref, seen } = useReveal<HTMLDivElement>({ threshold: 0.4 })

  return (
    <Row fillWidth horizontal="center" paddingX="24">
      <Column
        ref={ref}
        fillWidth
        maxWidth="xl"
        className="h-glass"
        radius="l"
        paddingY="40"
        paddingX="32"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(11rem, 1fr))',
            gap: '2rem',
            width: '100%',
          }}
        >
          {stats.map((stat) => (
            <Column key={stat.label} gap="8" horizontal="center" style={{ textAlign: 'center' }}>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'clamp(2.4rem, 4vw, 3.4rem)',
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: '-0.03em',
                  color: 'var(--h-amber)',
                }}
              >
                <Counter value={stat.value} run={seen} />
                {stat.suffix}
              </span>
              <Text
                variant="label-default-s"
                onBackground="neutral-weak"
                style={{ letterSpacing: '0.1em' }}
              >
                {stat.label}
              </Text>
            </Column>
          ))}
        </div>
      </Column>
    </Row>
  )
}
