'use client'

import { useEffect, useRef } from 'react'

/**
 * The reading-progress bar pinned above the header.
 *
 * Written straight to the DOM node from a rAF-throttled scroll listener rather
 * than through React state — this fires on every scroll frame and re-rendering
 * the tree that often would show up as jank on mid-range Android.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const el = barRef.current
      if (!el) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0
      el.style.transform = `scaleX(${progress})`
      el.parentElement?.style.setProperty('opacity', progress > 0.005 ? '1' : '0')
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 120,
        opacity: 0,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      <div
        ref={barRef}
        className="h-stripe"
        style={{
          height: '100%',
          transform: 'scaleX(0)',
          transformOrigin: 'left center',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
