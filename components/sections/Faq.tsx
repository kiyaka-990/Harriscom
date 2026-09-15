'use client'

import { AccordionGroup, Column, Text } from '@once-ui-system/core'

import SectionHeading from '@/components/sections/SectionHeading'
import { faqs } from '@/lib/site'

export default function Faq() {
  return (
    <Column fillWidth horizontal="center" paddingX="24" id="faq">
      <Column fillWidth maxWidth="l" gap="40">
        <SectionHeading
          eyebrow="Questions"
          title="The things people ask before they call."
          body="If your question is not here, ask Harri in the chat — it answers from the same information."
        />

        <Column className="h-glass" radius="l" paddingX="24" paddingY="8" fillWidth>
          <AccordionGroup
            autoCollapse
            items={faqs.map((faq) => ({
              title: (
                <Text variant="label-strong-m" onBackground="neutral-strong">
                  {faq.q}
                </Text>
              ),
              content: (
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ lineHeight: 1.8 }}>
                  {faq.a}
                </Text>
              ),
            }))}
          />
        </Column>
      </Column>
    </Column>
  )
}
