import { Column, Row, Text } from '@once-ui-system/core'

/**
 * The Harriscom mark: two white columns bridged by an amber beam.
 *
 * It reads as an H at wordmark size and as a rising structure at favicon size,
 * which is why the crossbar is a chevron rather than a flat bar.
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
      style={{ display: 'block', flex: '0 0 auto' }}
    >
      <defs>
        <linearGradient id="hcBadge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#31469B" />
          <stop offset="0.52" stopColor="#1B2B6B" />
          <stop offset="1" stopColor="#0B1230" />
        </linearGradient>
        <linearGradient id="hcBeam" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#F5A623" />
          <stop offset="1" stopColor="#FFD37A" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#hcBadge)" />
      <path d="M0 42 64 4V0H0Z" fill="#FFFFFF" opacity="0.06" />
      <rect x="15" y="15" width="7.5" height="34" rx="2.5" fill="#FFFFFF" />
      <rect x="41.5" y="15" width="7.5" height="34" rx="2.5" fill="#FFFFFF" />
      <path
        d="M21 35.5 43 28.5"
        fill="none"
        stroke="url(#hcBeam)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ size = 40, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <Row vertical="center" gap="12">
      <LogoMark size={size} />
      {showWordmark && (
        <Column gap="2">
          <Text
            variant="heading-strong-s"
            onBackground="neutral-strong"
            style={{ letterSpacing: '0.16em', lineHeight: 1 }}
          >
            HARRISCOM
          </Text>
          <Text
            variant="label-default-xs"
            onBackground="neutral-weak"
            style={{ letterSpacing: '0.24em', lineHeight: 1 }}
          >
            COMPANY LIMITED
          </Text>
        </Column>
      )}
    </Row>
  )
}
