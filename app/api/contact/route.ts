import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Mail runs on the cPanel host (41.80.37.8), not on Vercel — see the zone's
// webmail/cpanel A records. SMTP_USER is a real mailbox on that host, so mail
// sent through it is already covered by the domain's SPF and DKIM records.
//
// Deliberately defaulting to webmail.* rather than mail.*: mail.harriscomcompany.co.ke
// is a CNAME to the apex, which now resolves to Vercel, so it does not reach the
// mail server. webmail.* has its own A record to 41.80.37.8 and is covered by the
// same *.harriscomcompany.co.ke certificate, so TLS verifies either way.
const SMTP_HOST = process.env.SMTP_HOST || 'webmail.harriscomcompany.co.ke'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    if (!SMTP_USER || !SMTP_PASS) {
      // Fail loudly. Returning success without sending is what made enquiries
      // disappear silently before.
      console.error('Contact form: SMTP_USER/SMTP_PASS are not set')
      return NextResponse.json({ error: 'Mail is not configured. Please call us instead.' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    const lines = [
      `Name:    ${name}`,
      `Email:   ${email}`,
      `Phone:   ${phone || '-'}`,
      `Service: ${service || '-'}`,
      '',
      message,
    ].join('\n')

    await transporter.sendMail({
      from: `"Harriscom Website" <${SMTP_USER}>`,
      to: CONTACT_TO,
      replyTo: `"${name}" <${email}>`,
      subject: `Website enquiry from ${name}${service ? ` — ${service}` : ''}`,
      text: lines,
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
