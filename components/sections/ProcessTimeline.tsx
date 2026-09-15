'use client'

import { Column, Row, Text } from '@once-ui-system/core'

import Reveal from '@/components/ui/Reveal'
import SectionHeading from '@/components/sections/SectionHeading'
import { useReveal } from '@/hooks/useReveal'
import { process } from '@/lib/site'

export default function ProcessTimeline() {
  const { ref, seen } = useReveal<HTMLDivElement>({ threshold: 0.08 })

  return (
    <Column fillWidth horizontal="center" paddingX="24" id="process">
      <Column fillWidth maxWidth="xl" gap="48">
        <SectionHeading
          eyebrow="How we work"
          title="Six stages from first call to handover."
          body="You always know which stage you are in, what it costs, and what happens next. Nothing starts until the previous stage is signed off."
        />

        <div ref={ref} style={{ position: 'relative', width: '100%' }}>
          {/* The spine the numbered nodes hang from. */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: '1.45rem',
              top: '1.5rem',
              bottom: '1.5rem',
              width: 1,
              background:
                'linear-gradient(to bottom, transparent, rgba(245,166,35,0.45) 12%, rgba(255,255,255,0.1) 70%, transparent)',
            }}
          />

          <Column gap="16">
            {process.map((step, index) => (
              <Reveal key={step.num} show={seen} delay={index * 0.07}>
                <Row gap="24" vertical="start" fillWidth>
                  <span
                    style={{
                      display: 'grid',
                      placeItems: 'center',
                      flex: '0 0 auto',
                      width: '3rem',
                      height: '3rem',
                      borderRadius: '50%',
                      background: 'rgba(8,11,26,0.9)',
                      border: '1px solid rgba(245,166,35,0.35)',
                      color: 'var(--h-amber)',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                    }}
                  >
                    {step.num}
                  </span>
                  <Column
                    className="h-glass"
                    radius="l"
                    padding="24"
                    gap="8"
                    fillWidth
                    style={{ marginTop: '0.1rem' }}
                  >
                    <Text variant="heading-strong-s" onBackground="neutral-strong">
                      {step.title}
                    </Text>
                    <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.75 }}>
                      {step.body}
                    </Text>
                  </Column>
                </Row>
              </Reveal>
            ))}
          </Column>
        </div>
      </Column>
    </Column>
  )
}
