# Harriscom Company Limited — Next.js Website

Production-ready Next.js 14 site with a **fully self-contained AI chatbot (Harri)** — zero API keys required.

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 — that's it! No .env file needed.

## Design Colors (from letterhead)

| Token | Hex | Usage |
|---|---|---|
| Navy | #1B2B6B | Primary, navbar |
| Crimson | #D42B2B | CTAs, accents |
| Emerald | #2D8C4E | Success, checks |
| Amber | #F5A623 | Stats, gold highlights |
| Violet | #6B3FA0 | Interior category |
| Teal | #1A7A9A | Process, info |

## Harri — The Local AI Chatbot

Harri lives entirely in `lib/harriBrain.ts`. No external API. It uses:
- **Tokenizer** — lowercases and splits input
- **Intent classifier** — 35+ intent patterns with fuzzy keyword matching
- **Response engine** — multi-variant responses to avoid repetition
- **Simulated delay** — 380–900ms for natural feel

### What Harri knows
Services, pricing (Ksh ranges), location, contact info, company registration (PVT-6LUK5LZD), director details, 12 counties served, 6-step process, payment methods (M-Pesa, bank), warranty periods, materials/suppliers, team composition, sustainability, and greetings in English + Swahili.

### Extend Harri (add to lib/harriBrain.ts)
```typescript
// Add new intent pattern
{ intent: 'new_topic', keywords: ['word1', 'word2'] }

// Add response
new_topic: ["Response variant 1", "Response variant 2"]
```

## Project Structure

```
harriscom-nextjs/
├── app/
│   ├── globals.css          # Brand tokens + animations
│   ├── layout.tsx           # Root layout + SEO
│   ├── page.tsx             # Main page
│   └── api/contact/         # Contact form API
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx             # Fade carousel
│   ├── StatsBar.tsx         # Animated counters
│   ├── Services.tsx
│   ├── Portfolio.tsx        # Filterable masonry
│   ├── Sections.tsx         # About, Process, WhyUs, Testimonials, CTA
│   ├── Contact.tsx
│   ├── ChatBot.tsx          # Harri widget (no API!)
│   └── Footer.tsx
├── lib/
│   └── harriBrain.ts        # Complete AI brain
└── hooks/useScrollReveal.ts
```

## Deploy to Vercel

```bash
npx vercel
```

No environment variables needed. Optionally add RESEND_API_KEY for email delivery.

## Company Details

- Harriscom Company Limited · PVT-6LUK5LZD
- Director: Abdi Jafaar Sheikh
- +254 728 392 225 · mdjaafar2225@gmail.com
- 12th Floor, Bruce House, Standard Street, Nairobi
