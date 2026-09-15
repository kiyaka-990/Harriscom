# Harriscom Company Limited — website

Next.js 15 marketing site for a Nairobi construction and general supplies contractor, built on
[Once UI](https://once-ui.com) with a self-contained sales agent that works with no API key.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## What is here

| Area | Where |
|---|---|
| Company facts, services, projects, FAQs | `lib/site.ts` — single source of truth for every surface |
| Design tokens, glass, hero, chrome | `app/globals.css` (Once UI tokens + a focused custom layer) |
| Page chrome (nav, footer, scroll bar, cookies, FABs) | `components/chrome/` |
| Page sections | `components/sections/` |
| Contact form + Google Map | `components/contact/` |
| The agent | `lib/agent/` + `app/api/agent/route.ts` + `components/agent/` |
| Hero video generation | `scripts/generate-videos.mjs` |

Routes: `/`, `/services`, `/services/[slug]`, `/projects`, `/about`, `/contact`, `/privacy`, plus a
generated `sitemap.xml`, `robots.txt` and Open Graph image.

## Harri, the agent

Harri is an **agentic sales assistant, not a FAQ widget**. Every turn does three things:

1. **Extract** — pulls service, location, floor area, budget, timeline, name, phone and email out of
   free text. It understands `3 bedrooms` (→ 135 sqm), `450 sqm`, `2 acres`, `Ksh 4.5m`, Kenyan
   phone formats, Nairobi estates and counties, and Swahili greetings.
2. **Answer** — from `lib/agent/knowledge.ts` only. Prices, durations and coverage always come from
   the deterministic tools in `lib/agent/tools.ts`, so the agent can never invent a number.
3. **Advance** — a qualification state machine (`greet → discover → qualify → propose → capture →
   booked`) picks the single next question, never repeats one, produces a costed range as soon as it
   has service + size, handles price/trust/timeline objections, and emails the finished lead through
   the same SMTP path as the contact form.

**No API key is required** — that path is the default and is fully self-contained. If
`ANTHROPIC_API_KEY` is set, the route additionally calls Claude (`claude-opus-5`) with the same
knowledge brief and the same tools, and uses its wording; the local brain still owns slot
extraction, lead capture and quick replies, and is the answer of record whenever the model call
fails or is refused. Both paths quote identical figures because both call `lib/agent/tools.ts`.

To extend what Harri knows, add to `lib/agent/knowledge.ts` and — if it is a question people ask —
`faqs` in `lib/site.ts`. To add an intent, add a `Pattern` and an `answerFor` case in
`lib/agent/brain.ts`.

## Accessibility

A panel behind the ♿ button (bottom-left) lets visitors set:

- **Appearance** — dark, light, or follow the OS
- **Contrast** — high contrast drops all translucency and promotes muted text to full strength
- **Text size** — 90% / 100% / 110%, via Once UI's `data-scaling`
- **Motion** — reduced stops every animation, matching `prefers-reduced-motion`
- **Underline links**
- **Read this page** — speaks the main content using the device's own voice (Web Speech API).
  Nothing leaves the browser.

Every preference is a `data-*` attribute on `<html>` (see `lib/a11y.ts`), applied by an inline script
before first paint so there is no flash, and persisted in localStorage. The theme reuses Once UI's
own `data-theme` key so its provider can never disagree with the toggle — which is also why
`ThemeProvider` is given `theme="system"` rather than a pinned theme. An explicit theme prop is
treated by Once UI as a forced mode and would override the toggle on every mount.

Text sitting on media (the hero scrim, project image overlays) uses fixed `--h-on-media` tokens
rather than theme tokens: those backgrounds stay dark in both themes, so theme-following text would
turn dark-on-dark in light mode.

## Hero videos

The carousel plays real footage — three establishing shots of Nairobi and two of live construction
work. Sources and licences are in [MEDIA-CREDITS.md](MEDIA-CREDITS.md). The large originals are not
committed; the script downloads them into `.media-cache/`, then trims, grades and size-caps them:

```bash
node scripts/generate-videos.mjs           # render anything missing
node scripts/generate-videos.mjs --force   # re-encode everything
```

Output lands in `public/video/` (committed, ~7.6MB total, bitrate-capped for mobile data). To use
Harriscom's own site footage instead — which would beat any stock library — drop files into
`.media-cache/` as `hero-<name>.src.mp4` and re-run with `--force`. Change the `CLIPS` array to swap sources
or moves. Only the first clip loads on page load; the rest attach as the carousel reaches them, the
active clip is the only one playing, and everything pauses when the hero leaves the viewport.

## Environment variables

None are required to run or build the site. All are optional:

| Variable | Effect if unset |
|---|---|
| `SMTP_USER`, `SMTP_PASS` | Contact form and chat leads fail loudly with a "call us instead" message rather than silently discarding enquiries. |
| `SMTP_HOST`, `SMTP_PORT` | Default to `webmail.harriscomcompany.co.ke:465` — see the comment in `lib/mail.ts` for why not `mail.*`. |
| `CONTACT_TO` | Enquiries go to `SMTP_USER`. |
| `ANTHROPIC_API_KEY` | Harri runs entirely on the local brain. |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | The contact map uses the keyless Google embed. |

## Design notes

- Dark by default, with a light theme the visitor can switch to from the accessibility panel.
- Brand colours (`--h-navy`, `--h-amber`, …) live in `app/globals.css`; Once UI's semantic tokens
  drive everything else. Brand is mapped to `indigo`, accent to `yellow`, neutral to `slate`.
- Custom classes are all prefixed `h-` (`h-glass`, `h-liquid`, `h-spotlight`, `h-stripe`). Every
  surface colour is a `--h-*` variable retuned per theme, so one glass recipe serves both.
- Every animation is disabled under `prefers-reduced-motion` **and** under the panel's reduced-motion
  setting, including hero video playback.
- The floating chrome is split deliberately: back-to-top, WhatsApp and accessibility sit bottom-left;
  the agent launcher owns bottom-right on its own so it is never buried in a stack.

## Company details

Harriscom Company Limited · PVT-6LUK5LZD · Director Abdi Jafaar Sheikh
+254 728 392 225 · info@harriscomcompany.co.ke
12th Floor, Bruce House, Standard Street, Nairobi · P.O. Box 38631-00100
