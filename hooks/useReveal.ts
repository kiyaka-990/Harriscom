'use client'

import { useEffect, useRef, useState } from 'react'
import { useInViewport } from '@once-ui-system/core'

/**
 * Latched viewport trigger for entrance animations.
 *
 * `useInViewport` flips back to false on the way out, which would replay every
 * reveal each time you scrolled past. Latching means a section animates once.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null)
  const inViewport = useInViewport(ref, options ?? { threshold: 0.15 })
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (inViewport) setSeen(true)
  }, [inViewport])

  // Safety net. RevealFx keeps un-triggered content masked and blurred, so a
  // missed intersection callback does not degrade the animation — it hides the
  // section outright. An entrance effect must never be why content is invisible.
  useEffect(() => {
    const timer = setTimeout(() => setSeen(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return { ref, seen }
}

/**
 * Feeds pointer position into the `.h-spotlight` radial gradient.
 *
 * Coordinates are written as CSS custom properties rather than React state so
 * a mousemove over a grid of cards never triggers a render.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(hover: none)').matches) return

    const onMove = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>('.h-spotlight')
      if (!target) return
      const rect = target.getBoundingClientRect()
      target.style.setProperty('--h-mx', `${event.clientX - rect.left}px`)
      target.style.setProperty('--h-my', `${event.clientY - rect.top}px`)
    }

    node.addEventListener('pointermove', onMove)
    return () => node.removeEventListener('pointermove', onMove)
  }, [])

  return ref
}
