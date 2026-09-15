'use client'

import { Column, Icon, Row, Text } from '@once-ui-system/core'

import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/sections/SectionHeading'
import { useReveal, useSpotlight } from '@/hooks/useReveal'
import { differentiators } from '@/lib/site'

export default function WhyUs() {
  const { ref, seen } = useReveal<HTMLDivElement>({ threshold: 0.08 })
  const spotlightRef = useSpotlight<HTMLDivElement>()

  return (
    <Column fillWidth horizontal="center" paddingX="24" id="why">
      <Column fillWidth maxWidth="xl" gap="48">
        <SectionHeading
          eyebrow="Why Harriscom"
          title="The things clients actually complain about, fixed."
          body="Every point below exists because a client somewhere was burned by a contractor who did the opposite."
        />

        <div ref={spotlightRef} style={{ width: '100%' }}>
          <div
            ref={ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(18rem, 1fr))',
              gap: '1rem',
            }}
          >
            {differentiators.map((item, index) => (
              <Reveal key={item.title} show={seen} delay={index * 0.06}>
                <Column
                  className="h-spotlight h-glass h-liquid"
                  fillWidth
                  radius="l"
                  padding="24"
                  gap="12"
                  style={{ height: '100%' }}
                >
                  <Row vertical="center" gap="12">
                    <span
                      style={{
                        display: 'grid',
                        placeItems: 'center',
                        width: '2.25rem',
                        height: '2.25rem',
                        borderRadius: 10,
                        background: 'rgba(245,166,35,0.12)',
                        border: '1px solid rgba(245,166,35,0.28)',
                      }}
                    >
                      <Icon name="check" size="xs" style={{ color: 'var(--h-amber)' }} />
                    </span>
                    <Text variant="heading-strong-xs" onBackground="neutral-strong">
                      {item.title}
                    </Text>
                  </Row>
                  <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.75 }}>
                    {item.body}
                  </Text>
                </Column>
              </Reveal>
            ))}
          </div>
        </div>
      </Column>
    </Column>
  )
}
