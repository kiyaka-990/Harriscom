'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Column, Icon, Row, Text } from '@once-ui-system/core'

import { contact } from '@/lib/site'

interface Slide {
  clip: string
  eyebrow: string
  headline: string
  accent: string
  body: string
}

/**
 * Real footage, not moves over stills: three establishing shots of Nairobi and
 * two of live construction work. See scripts/generate-videos.mjs for sources.
 */
const SLIDES: Slide[] = [
  {
    clip: 'hero-build',
    eyebrow: 'Construction & general supplies',
    headline: 'Build with',
    accent: 'certainty.',
    body: 'Fixed-price quotations from a measured bill of quantities, a named project manager on every job, and weekly reporting until handover.',
  },
  {
    clip: 'hero-structure',
    eyebrow: 'Nairobi & 12 counties',
    headline: 'Structures that',
    accent: 'hold their line.',
    body: 'Residential, commercial and industrial builds delivered to NCA standards with a resident engineer on site.',
  },
  {
    clip: 'hero-ontime',
    eyebrow: 'Programme you can plan around',
    headline: 'On time is',
    accent: 'part of the spec.',
    body: '98% of our handovers land on the date agreed at contract. Slippage is reported the week it happens, not at the end.',
  },
  {
    clip: 'hero-finish',
    eyebrow: 'Fit-out & interiors',
    headline: 'Finished to the',
    accent: 'last millimetre.',
    body: 'Office fit-out and refurbishment in occupied buildings — phased, out of hours, and snag-free at handover.',
  },
  {
    clip: 'hero-supply',
    eyebrow: 'Materials & equipment',
    headline: 'Supplied before',
    accent: 'you need it.',
    body: 'Direct supplier accounts for cement, steel and aggregate, scheduled against your programme and delivered nationwide.',
  },
]

const SLIDE_DURATION = 7500

export default function VideoHero() {
  const [current, setCurrent] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  // Only the first clip is fetched on load; the rest are attached as the
  // carousel approaches them, so the hero costs one video on first paint.
  const [loaded, setLoaded] = useState<number[]>([0])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useRef(true)

  const slide = SLIDES[current]

  const go = useCallback((index: number) => {
    const next = (index + SLIDES.length) % SLIDES.length
    setCurrent(next)
    setLoaded((prev) => {
      const upcoming = (next + 1) % SLIDES.length
      const missing = [next, upcoming].filter((i) => !prev.includes(i))
      return missing.length ? [...prev, ...missing] : prev
    })
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(query.matches)
    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  // Preload the second clip once the page is idle rather than during the
  // critical first seconds.
  useEffect(() => {
    const timer = setTimeout(() => setLoaded((prev) => (prev.includes(1) ? prev : [...prev, 1])), 2500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const timer = setTimeout(() => go(current + 1), SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [current, go, reducedMotion])

  // Play the active clip, pause every other one. Decoding five 1080p videos at
  // once is what makes video heroes feel heavy on cheaper hardware.
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === current && inView.current && !reducedMotion) {
        video.currentTime = 0
        void video.play().catch(() => {
          /* Autoplay can still be refused; the poster remains visible. */
        })
      } else {
        video.pause()
      }
    })
  }, [current, loaded, reducedMotion])

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting
        const video = videoRefs.current[current]
        if (!video) return
        if (entry.isIntersecting && !reducedMotion) void video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.15 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [current, reducedMotion])

  const trustPoints = useMemo(
    () => ['NCA compliant', 'Free site visits', '24-hour quotations', '12-month warranty'],
    [],
  )

  return (
    <Column
      ref={sectionRef}
      as="section"
      fillWidth
      horizontal="center"
      position="relative"
      style={{ minHeight: 'min(100svh, 56rem)', overflow: 'hidden' }}
    >
      {/* Media layer */}
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0 }}>
        {SLIDES.map((item, index) => (
          <video
            key={item.clip}
            ref={(node) => {
              videoRefs.current[index] = node
            }}
            className="h-hero-video"
            data-active={index === current}
            poster={`/video/${item.clip}.jpg`}
            src={loaded.includes(index) ? `/video/${item.clip}.mp4` : undefined}
            preload={index === 0 ? 'auto' : 'none'}
            muted
            loop
            playsInline
            disablePictureInPicture
            tabIndex={-1}
          />
        ))}
        <div className="h-hero-scrim" />
        <div className="h-grain" style={{ position: 'absolute', inset: 0 }} />
      </div>

      {/* Content */}
      <Column
        fillWidth
        maxWidth="xl"
        paddingX="24"
        zIndex={1}
        vertical="center"
        style={{ minHeight: 'min(100svh, 56rem)', paddingTop: 'var(--h-nav-height)' }}
      >
        <Column gap="24" style={{ maxWidth: '46rem' }}>
          <Row
            key={`eyebrow-${current}`}
            vertical="center"
            gap="8"
            className="h-glass"
            radius="full"
            paddingX="16"
            paddingY="8"
            fitWidth
            style={{ animation: 'h-bubble-in 0.5s ease both' }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--h-emerald)',
                boxShadow: '0 0 0 4px rgba(45,140,78,0.22)',
              }}
            />
            <Text variant="label-default-s" style={{ letterSpacing: '0.08em', color: 'var(--h-on-media-dim)' }}>
              {slide.eyebrow}
            </Text>
          </Row>

          <h1
            key={`headline-${current}`}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.6rem, 6.4vw, 5.2rem)',
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: '-0.03em',
              color: 'var(--h-on-media)',
              margin: 0,
              animation: 'h-bubble-in 0.6s cubic-bezier(0.22,1,0.36,1) both',
            }}
          >
            {slide.headline}{' '}
            <span
              style={{
                background: 'linear-gradient(120deg, var(--h-amber) 0%, #ffd98a 55%, var(--h-amber) 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {slide.accent}
            </span>
          </h1>

          <Text
            key={`body-${current}`}
            variant="body-default-l"
            style={{ maxWidth: '34rem', lineHeight: 1.7, animation: 'h-bubble-in 0.7s ease both', color: 'var(--h-on-media-dim)' }}
          >
            {slide.body}
          </Text>

          <Row gap="12" wrap paddingTop="8">
            <Link
              href="/contact"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.95rem 1.7rem',
                borderRadius: 999,
                background: 'linear-gradient(135deg, var(--h-amber) 0%, #ffcf6b 100%)',
                color: '#0b1230',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 16px 40px -16px rgba(245,166,35,0.85)',
              }}
            >
              Get a free quote
              <Icon name="arrowUpRight" size="s" />
            </Link>
            <Link
              href="/projects"
              className="h-glass"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.95rem 1.7rem',
                borderRadius: 999,
                color: 'var(--h-on-media)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              See our work
            </Link>
            <a
              href={contact.phoneHref}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.95rem 1.2rem',
                color: 'var(--h-on-media-dim)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              or call {contact.phone}
            </a>
          </Row>

          <Row gap="20" wrap paddingTop="16">
            {trustPoints.map((point) => (
              <Row key={point} vertical="center" gap="8">
                <Icon name="check" size="xs" onBackground="success-medium" />
                <Text variant="body-default-xs" style={{ color: 'var(--h-on-media-faint)' }}>
                  {point}
                </Text>
              </Row>
            ))}
          </Row>
        </Column>
      </Column>

      {/* Carousel controls */}
      <Row
        fillWidth
        maxWidth="xl"
        paddingX="24"
        paddingBottom="32"
        horizontal="between"
        vertical="center"
        zIndex={1}
        gap="16"
        wrap
        style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)' }}
      >
        <Row gap="8" vertical="center" role="tablist" aria-label="Hero slides">
          {SLIDES.map((item, index) => (
            <button
              key={item.clip}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={`Slide ${index + 1}: ${item.headline} ${item.accent}`}
              onClick={() => go(index)}
              style={{
                position: 'relative',
                width: index === current ? 56 : 28,
                height: 4,
                borderRadius: 999,
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.22)',
                transition: 'width 0.4s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              {index === current && (
                <span
                  key={`fill-${current}`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'var(--h-amber)',
                    transformOrigin: 'left',
                    animation: reducedMotion
                      ? 'none'
                      : `h-slide-fill ${SLIDE_DURATION}ms linear both`,
                    transform: reducedMotion ? 'scaleX(1)' : undefined,
                  }}
                />
              )}
            </button>
          ))}
        </Row>

        <Row gap="8">
          <button
            type="button"
            aria-label="Previous slide"
            onClick={() => go(current - 1)}
            className="h-fab h-glass"
            style={{ width: '2.75rem', height: '2.75rem' }}
          >
            <Icon name="chevronLeft" size="s" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            onClick={() => go(current + 1)}
            className="h-fab h-glass"
            style={{ width: '2.75rem', height: '2.75rem' }}
          >
            <Icon name="chevronRight" size="s" />
          </button>
        </Row>
      </Row>

      <style>{`
        @keyframes h-slide-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </Column>
  )
}
