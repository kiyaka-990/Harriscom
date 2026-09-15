import { NextRequest, NextResponse } from 'next/server'

import { mailConfigured, sendEnquiry } from '@/lib/mail'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    if (!mailConfigured()) {
      console.error('Contact form: SMTP_USER/SMTP_PASS are not set')
      return NextResponse.json({ error: 'Mail is not configured. Please call us instead.' }, { status: 500 })
    }

    await sendEnquiry({
      subject: `Website enquiry from ${name}${service ? ` — ${service}` : ''}`,
      replyTo: { name, email },
      body: [
        `Name:    ${name}`,
        `Email:   ${email}`,
        `Phone:   ${phone || '-'}`,
        `Service: ${service || '-'}`,
        '',
        message,
      ].join('\n'),
    })

    return NextResponse.json({
      success: true,
      message: 'Thank you! We will get back to you within 24 hours.',
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to submit. Please try again.' }, { status: 500 })
  }
}
