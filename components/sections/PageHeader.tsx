import { Background, Column, Row, Text } from '@once-ui-system/core'

interface PageHeaderProps {
  eyebrow: string
  title: string
  body?: string
  children?: React.ReactNode
}

/** Masthead for inner pages — the one ambient layer those pages are allowed. */
export default function PageHeader({ eyebrow, title, body, children }: PageHeaderProps) {
  return (
    <Column
      fillWidth
      horizontal="center"
      paddingX="24"
      style={{ paddingTop: 'calc(var(--h-nav-height) + 5rem)', paddingBottom: '3rem', position: 'relative' }}
    >
      <Background
        position="absolute"
        top="0"
        left="0"
        fill
        pointerEvents="none"
        gradient={{
          display: true,
          colorStart: 'brand-alpha-medium',
          colorEnd: 'static-transparent',
          x: 50,
          y: 0,
          width: 160,
          height: 90,
          opacity: 50,
        }}
        dots={{ display: true, color: 'neutral-alpha-weak', size: '2', opacity: 30 }}
      />

      <Column fillWidth maxWidth="xl" gap="20" zIndex={1}>
        <Row vertical="center" gap="12">
          <span
            aria-hidden="true"
            style={{ display: 'block', width: 28, height: 2, borderRadius: 2, background: 'var(--h-amber)' }}
          />
          <Text variant="label-default-s" onBackground="accent-medium" style={{ letterSpacing: '0.18em' }}>
            {eyebrow.toUpperCase()}
          </Text>
        </Row>

        <h1
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 600,
            lineHeight: 1.04,
            letterSpacing: '-0.03em',
            color: 'var(--neutral-on-background-strong)',
            margin: 0,
            maxWidth: '20ch',
          }}
        >
          {title}
        </h1>

        {body && (
          <Text
            variant="body-default-l"
            onBackground="neutral-weak"
            style={{ maxWidth: '44rem', lineHeight: 1.75 }}
          >
            {body}
          </Text>
        )}

        {children}
      </Column>
    </Column>
  )
}
