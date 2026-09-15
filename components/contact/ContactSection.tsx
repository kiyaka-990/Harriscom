'use client'

import { useState } from 'react'
import { Button, Column, Icon, Input, Row, Select, Text, Textarea } from '@once-ui-system/core'

import GoogleMap from '@/components/contact/GoogleMap'
import SectionHeading from '@/components/sections/SectionHeading'
import { contact, services, whatsappLink } from '@/lib/site'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const EMPTY = { name: '', email: '', phone: '', service: '', location: '', message: '' }

const CHANNELS = [
  {
    label: 'Call the office',
    value: contact.phone,
    href: contact.phoneHref,
    note: contact.hours.weekdays,
  },
  {
    label: 'Email',
    value: contact.email,
    href: contact.emailHref,
    note: 'Replies within one working day',
  },
  {
    label: 'WhatsApp',
    value: contact.phone,
    href: whatsappLink('Hello Harriscom, I have a project I would like to discuss.'),
    note: 'Send site photos directly',
  },
]

export default function ContactSection({ showHeading = true }: { showHeading?: boolean }) {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')

  const update = (field: keyof typeof EMPTY) => (value: string) =>
    setForm((current) => ({ ...current, [field]: value }))

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          // The API takes one free-text body; keeping location in the message
          // means it survives even if the mail template changes.
          message: form.location
            ? `Site location: ${form.location}\n\n${form.message}`
            : form.message,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}))
        throw new Error(payload.error || 'We could not send that. Please call us instead.')
      }

      setForm(EMPTY)
      setStatus('sent')
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <Column fillWidth horizontal="center" paddingX="24" id="contact">
      <Column fillWidth maxWidth="xl" gap="48">
        {showHeading && (
          <SectionHeading
            eyebrow="Get in touch"
            title="Start with a free site visit."
            body="Tell us where the site is and roughly what you want to do. We will confirm a visit time, walk the site with you and follow up with a costed proposal."
          />
        )}

        <Row fillWidth gap="24" wrap m={{ direction: 'column' }}>
          {/* Form */}
          <Column
            className="h-glass"
            radius="l"
            padding="32"
            gap="24"
            style={{ flex: '1 1 26rem', minWidth: 'min(100%, 20rem)' }}
          >
            {status === 'sent' ? (
              <Column gap="16" center style={{ textAlign: 'center', padding: '2.5rem 0' }}>
                <span
                  style={{
                    display: 'grid',
                    placeItems: 'center',
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    background: 'rgba(45,140,78,0.16)',
                    border: '1px solid rgba(45,140,78,0.4)',
                  }}
                >
                  <Icon name="check" size="m" onBackground="success-medium" />
                </span>
                <Text variant="heading-strong-m" onBackground="neutral-strong">
                  Enquiry received
                </Text>
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ maxWidth: '26rem', lineHeight: 1.75 }}>
                  It is in our inbox now. Expect a reply within one working day — sooner if you
                  called or messaged us on WhatsApp as well.
                </Text>
                <Button variant="secondary" size="s" onClick={() => setStatus('idle')}>
                  Send another enquiry
                </Button>
              </Column>
            ) : (
              <form onSubmit={submit} noValidate>
                <Column gap="20" fillWidth>
                  <Row gap="16" wrap s={{ direction: 'column' }}>
                    <Input
                      id="contact-name"
                      name="name"
                      label="Full name"
                      required
                      value={form.name}
                      onChange={(event) => update('name')(event.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Input
                      id="contact-phone"
                      name="phone"
                      label="Phone"
                      type="tel"
                      value={form.phone}
                      onChange={(event) => update('phone')(event.target.value)}
                      style={{ flex: 1 }}
                    />
                  </Row>

                  <Input
                    id="contact-email"
                    name="email"
                    label="Email address"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => update('email')(event.target.value)}
                  />

                  <Row gap="16" wrap s={{ direction: 'column' }}>
                    <Select
                      id="contact-service"
                      label="Service required"
                      value={form.service}
                      options={services.map((service) => ({
                        value: service.title,
                        label: service.title,
                      }))}
                      onSelect={(value) => update('service')(Array.isArray(value) ? value[0] : value)}
                      style={{ flex: 1 }}
                    />
                    <Input
                      id="contact-location"
                      name="location"
                      label="Site location"
                      placeholder="e.g. Westlands, Nairobi"
                      value={form.location}
                      onChange={(event) => update('location')(event.target.value)}
                      style={{ flex: 1 }}
                    />
                  </Row>

                  <Textarea
                    id="contact-message"
                    name="message"
                    label="What do you want to build?"
                    lines={5}
                    required
                    value={form.message}
                    onChange={(event) => update('message')(event.target.value)}
                  />

                  {status === 'error' && (
                    <Text variant="body-default-s" onBackground="danger-medium">
                      {error}
                    </Text>
                  )}

                  <Button
                    type="submit"
                    fillWidth
                    size="l"
                    arrowIcon
                    loading={status === 'sending'}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending' : 'Send enquiry'}
                  </Button>

                  <Text variant="body-default-xs" onBackground="neutral-weak" align="center">
                    We use your details only to answer this enquiry.
                  </Text>
                </Column>
              </form>
            )}
          </Column>

          {/* Channels and map */}
          <Column gap="16" style={{ flex: '1 1 20rem', minWidth: 'min(100%, 18rem)' }}>
            {CHANNELS.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="h-glass h-spotlight"
                style={{
                  display: 'block',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 16,
                  textDecoration: 'none',
                }}
              >
                <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.14em' }}>
                  {channel.label.toUpperCase()}
                </Text>
                <Text
                  variant="heading-strong-s"
                  onBackground="neutral-strong"
                  style={{ display: 'block', margin: '0.35rem 0 0.2rem' }}
                >
                  {channel.value}
                </Text>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {channel.note}
                </Text>
              </a>
            ))}

            <Column className="h-glass" radius="l" padding="24" gap="8">
              <Text variant="label-default-xs" onBackground="neutral-weak" style={{ letterSpacing: '0.14em' }}>
                OFFICE
              </Text>
              <Text variant="body-default-s" onBackground="neutral-medium" style={{ lineHeight: 1.75 }}>
                {contact.address.line1}
                <br />
                {contact.address.line2}
                <br />
                {contact.address.postal}
              </Text>
              <Text variant="body-default-xs" onBackground="neutral-weak" style={{ lineHeight: 1.8, marginTop: '0.5rem' }}>
                {contact.hours.weekdays}
                <br />
                {contact.hours.saturday}
                <br />
                {contact.hours.sunday}
              </Text>
            </Column>

            <GoogleMap />
          </Column>
        </Row>
      </Column>
    </Column>
  )
}
