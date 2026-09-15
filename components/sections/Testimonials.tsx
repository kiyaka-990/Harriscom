'use client'

import { Column, Row, Text } from '@once-ui-system/core'

import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/sections/SectionHeading'
import { useReveal } from '@/hooks/useReveal'
import { testimonials } from '@/lib/site'

export default function Testimonials() {
  const { ref, seen } = useReveal<HTMLDivElement>({ threshold: 0.15 })

  return (
    <Column fillWidth horizontal="center" paddingX="24">
      <Column fillWidth maxWidth="xl" gap="48">
        <SectionHeading
          eyebrow="Client feedback"
          title="What clients say once the scaffolding comes down."
        />

        <div
          ref={ref}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(19rem, 1fr))',
            gap: '1rem',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Reveal key={testimonial.author} show={seen} delay={index * 0.1}>
              <Column
                as="figure"
                fillWidth
                className="h-glass"
                radius="l"
                padding="24"
                gap="20"
                style={{ height: '100%', margin: 0 }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '3rem',
                    lineHeight: 0.6,
                    color: 'rgba(245,166,35,0.45)',
                  }}
                >
                  &ldquo;
                </span>
                <Text
                  variant="body-default-m"
                  onBackground="neutral-medium"
                  style={{ lineHeight: 1.8, flex: 1 }}
                >
                  {testimonial.quote}
                </Text>
                <Column gap="2" as="figcaption">
                  <Text variant="label-strong-s" onBackground="neutral-strong">
                    {testimonial.author}
                  </Text>
                  <Text variant="body-default-xs" onBackground="neutral-weak">
                    {testimonial.role}
                  </Text>
                </Column>
              </Column>
            </Reveal>
          ))}
        </div>

        {/* A quiet credibility strip rather than fake client logos. */}
        <Row
          fillWidth
          className="h-glass"
          radius="l"
          paddingY="20"
          paddingX="24"
          horizontal="between"
          vertical="center"
          wrap
          gap="24"
        >
          {[
            'Registered PVT-6LUK5LZD',
            'NCA compliant',
            "Contractor's all-risk cover",
            'Workmen’s compensation',
            'ETR invoicing',
          ].map((item) => (
            <Text key={item} variant="label-default-s" onBackground="neutral-weak" style={{ letterSpacing: '0.06em' }}>
              {item}
            </Text>
          ))}
        </Row>
      </Column>
    </Column>
  )
}
