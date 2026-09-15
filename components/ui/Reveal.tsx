'use client'

/**
 * Entrance animation for a set of cards.
 *
 * Deliberately not Once UI's RevealFx. That hides content behind a
 * `mask-image` plus `filter: blur(1rem)`, so if the transition never completes
 * — a missed intersection callback, a throttled background tab, a screenshot
 * runner — the card is left permanently blurred and unreadable. Here the
 * un-animated end state is simply "visible", which is the only acceptable way
 * for a decorative effect to fail on a page that has to sell work.
 *
 * A plain block element rather than a flex wrapper, so it fills its grid cell.
 */
export default function Reveal({
  show,
  delay = 0,
  children,
}: {
  show: boolean
  delay?: number
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        height: '100%',
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(14px)',
        transition: `opacity 0.55s ease ${delay}s, transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
