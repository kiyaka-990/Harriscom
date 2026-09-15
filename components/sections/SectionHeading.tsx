import { Column, Row, Text } from '@once-ui-system/core'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  body?: string
  align?: 'start' | 'center'
  id?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'start',
  id,
}: SectionHeadingProps) {
  return (
    <Column
      id={id}
      gap="16"
      horizontal={align}
      fillWidth
      style={{ textAlign: align === 'center' ? 'center' : 'left' }}
    >
      <Row vertical="center" gap="12">
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: 28,
            height: 2,
            borderRadius: 2,
            background: 'var(--h-amber)',
          }}
        />
        <Text variant="label-default-s" onBackground="accent-medium" style={{ letterSpacing: '0.18em' }}>
          {eyebrow.toUpperCase()}
        </Text>
      </Row>

      <h2
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2rem, 3.6vw, 3.1rem)',
          fontWeight: 600,
          lineHeight: 1.08,
          letterSpacing: '-0.025em',
          color: 'var(--neutral-on-background-strong)',
          margin: 0,
          maxWidth: '22ch',
        }}
      >
        {title}
      </h2>

      {body && (
        <Text
          variant="body-default-l"
          onBackground="neutral-weak"
          style={{ maxWidth: '44rem', lineHeight: 1.75 }}
        >
          {body}
        </Text>
      )}
    </Column>
  )
}
