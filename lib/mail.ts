import nodemailer from 'nodemailer'

/**
 * Mail runs on the cPanel host (41.80.37.8), not on Vercel — see the zone's
 * webmail/cpanel A records. SMTP_USER is a real mailbox on that host, so mail
 * sent through it is already covered by the domain's SPF and DKIM records.
 *
 * Deliberately defaulting to webmail.* rather than mail.*:
 * mail.harriscomcompany.co.ke is a CNAME to the apex, which now resolves to
 * Vercel, so it does not reach the mail server. webmail.* has its own A record
 * to 41.80.37.8 and is covered by the same wildcard certificate.
 */
const SMTP_HOST = process.env.SMTP_HOST || 'webmail.harriscomcompany.co.ke'
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const CONTACT_TO = process.env.CONTACT_TO || SMTP_USER

export const mailConfigured = () => Boolean(SMTP_USER && SMTP_PASS)

export interface Enquiry {
  subject: string
  body: string
  replyTo?: { name: string; email: string }
}

export async function sendEnquiry({ subject, body, replyTo }: Enquiry) {
  if (!SMTP_USER || !SMTP_PASS) {
    // Fail loudly. Returning success without sending is what made enquiries
    // disappear silently before.
    throw new Error('SMTP_USER/SMTP_PASS are not set')
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  })

  await transporter.sendMail({
    from: `"Harriscom Website" <${SMTP_USER}>`,
    to: CONTACT_TO,
    replyTo: replyTo ? `"${replyTo.name}" <${replyTo.email}>` : undefined,
    subject,
    text: body,
  })
}
