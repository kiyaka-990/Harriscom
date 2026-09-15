/**
 * Harri's keyless intelligence.
 *
 * This is not a FAQ lookup. Every turn does three things: pull structured facts
 * out of what was said, answer the question from the knowledge base, and then
 * advance a qualification state machine towards a booked site visit. That is
 * what makes it behave like a salesperson rather than a search box — and it all
 * runs with no API key, which is the point.
 */

import { company, contact, projects, services, whatsappLink } from '@/lib/site'
import {
  COMPLIANCE,
  COVERAGE,
  MATERIALS,
  OBJECTIONS,
  OFFERS,
  PAYMENT,
  PRICING,
  SUSTAINABILITY,
  TEAM,
  TIMELINES,
  WARRANTY,
} from '@/lib/agent/knowledge'
import { checkCoverage, estimateCost, estimateTimeline, recommendService } from '@/lib/agent/tools'
import type { AgentAction, AgentState, AgentTurn, Lead } from '@/lib/agent/types'

/* ────────────────────────────── normalisation ───────────────────────────── */

function normalise(text: string) {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^\w\s'+@.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/* ─────────────────────────────── extraction ─────────────────────────────── */

const LOCATION_WORDS = [
  'nairobi', 'westlands', 'kilimani', 'kileleshwa', 'lavington', 'karen', 'runda', 'muthaiga',
  'gigiri', 'parklands', 'upper hill', 'upperhill', 'cbd', 'south b', 'south c', 'langata',
  'ngong', 'rongai', 'kitengela', 'athi river', 'mlolongo', 'syokimau', 'ruiru', 'juja', 'thika',
  'kiambu', 'ruaka', 'kikuyu', 'limuru', 'kasarani', 'roysambu', 'kahawa', 'embakasi', 'donholm',
  'buruburu', 'utawala', 'machakos', 'kajiado', 'nakuru', 'mombasa', 'kisumu', 'eldoret', 'nyeri',
  'meru', 'naivasha', 'kilifi', 'diani', 'malindi', 'nanyuki', 'kericho', 'kakamega', 'kitui',
  'garissa', 'isiolo', 'narok', 'bungoma', 'kisii', 'embu', 'nyahururu',
]

function extractArea(text: string): number | undefined {
  // "450 sqm", "450 square metres", "450 m2"
  const metric = text.match(/(\d[\d,.]*)\s*(?:sq\.?\s?m|sqm|square\s?met(?:re|er)s?|m2|m²)/)
  if (metric) return toNumber(metric[1])

  const feet = text.match(/(\d[\d,.]*)\s*(?:sq\.?\s?ft|sqft|square\s?f(?:ee|oo)t)/)
  if (feet) {
    const value = toNumber(feet[1])
    return value ? Math.round(value * 0.0929) : undefined
  }

  const acres = text.match(/(\d[\d,.]*)\s*acres?/)
  if (acres) {
    const value = toNumber(acres[1])
    return value ? Math.round(value * 4047) : undefined
  }

  // Bedroom counts are the most common way Kenyan clients describe a house, so
  // convert them into a planning area rather than asking again in sqm.
  const bedrooms = text.match(/(\d+)\s*(?:bed\s?rooms?|br\b|bedroom)/)
  if (bedrooms) {
    const count = Number(bedrooms[1])
    if (count > 0 && count < 12) return count * 45
  }

  return undefined
}

function extractBudget(text: string): number | undefined {
  const match = text.match(
    /(?:ksh|kes|kshs|sh|shillings?)?\s*(\d[\d,.]*)\s*(m|million|mill|k|thousand)?\b/,
  )
  if (!match) return undefined

  // Only treat it as money when the sentence is actually about money, otherwise
  // "3 bedrooms" becomes a Ksh 3 budget.
  if (!/(budget|spend|afford|cost|price|have about|set aside|ksh|kes|shilling)/.test(text)) {
    return undefined
  }

  const value = toNumber(match[1])
  if (!value) return undefined
  const unit = match[2]
  if (unit?.startsWith('m')) return value * 1_000_000
  if (unit === 'k' || unit === 'thousand') return value * 1_000
  return value
}

function extractPhone(text: string): string | undefined {
  const match = text.match(/(?:\+?254|0)\s?7\d{2}\s?\d{3}\s?\d{3}|(?:\+?254|0)\s?1\d{2}\s?\d{3}\s?\d{3}/)
  return match ? match[0].replace(/\s+/g, '') : undefined
}

function extractEmail(text: string): string | undefined {
  const match = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/)
  return match?.[0]
}

function extractName(raw: string): string | undefined {
  const match = raw.match(
    /(?:my name is|i am|i'm|this is|name'?s|naitwa|jina langu ni)\s+([a-z][a-z'-]+(?:\s+[a-z][a-z'-]+)?)/i,
  )
  if (!match) return undefined
  const candidate = match[1].trim()
  // "I am looking for a contractor" must not become a name.
  if (/^(looking|interested|trying|planning|building|from|in|at|the|a|an)\b/i.test(candidate)) return undefined
  return candidate.replace(/\b[a-z]/g, (character) => character.toUpperCase())
}

function extractLocation(text: string): string | undefined {
  const match = LOCATION_WORDS.find((place) => text.includes(place))
  return match ? titleCase(match) : undefined
}

function titleCase(value: string) {
  return value.replace(/\b[a-z]/g, (character) => character.toUpperCase())
}

function extractTimeline(text: string): string | undefined {
  if (/(asap|urgent|immediate|right away|as soon as|haraka)/.test(text)) return 'as soon as possible'
  if (/(next month|coming month)/.test(text)) return 'next month'
  if (/(next year)/.test(text)) return 'next year'
  const months = text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/)
  if (months) return months[1]
  const relative = text.match(/in\s+(\d+)\s*(week|month)s?/)
  if (relative) return `in ${relative[1]} ${relative[2]}${Number(relative[1]) > 1 ? 's' : ''}`
  if (/(this year|within the year)/.test(text)) return 'this year'
  if (/(just (?:looking|checking)|not sure yet|no rush|planning stage)/.test(text)) return 'still planning'
  return undefined
}

function toNumber(value: string) {
  const parsed = Number(value.replace(/,/g, ''))
  return Number.isFinite(parsed) ? parsed : undefined
}

function extractSlots(raw: string, lead: Lead): Lead {
  const text = normalise(raw)
  const next: Lead = { ...lead, notes: [...lead.notes] }

  const service = recommendService(text)
  if (service && !next.service) next.service = service.slug

  const area = extractArea(text)
  if (area && !next.area) next.area = area

  const budget = extractBudget(text)
  if (budget && !next.budget) next.budget = budget

  const location = extractLocation(text)
  if (location && !next.location) next.location = location

  const timeline = extractTimeline(text)
  if (timeline && !next.timeline) next.timeline = timeline

  const phone = extractPhone(raw)
  if (phone && !next.phone) next.phone = phone

  const email = extractEmail(raw)
  if (email && !next.email) next.email = email

  const name = extractName(raw)
  if (name && !next.name) next.name = name

  return next
}

/* ────────────────────────────── classification ──────────────────────────── */

type Intent =
  | 'greeting' | 'farewell' | 'thanks' | 'smalltalk' | 'agent_identity'
  | 'services_overview' | 'service_detail' | 'pricing' | 'quote' | 'timeline'
  | 'process' | 'location' | 'contact' | 'hours' | 'about' | 'compliance'
  | 'director' | 'coverage' | 'payment' | 'warranty' | 'materials' | 'team'
  | 'sustainability' | 'portfolio' | 'emergency' | 'careers' | 'tender'
  | 'book_visit' | 'human' | 'objection_price' | 'objection_trust'
  | 'objection_timeline' | 'objection_diy' | 'affirmative' | 'negative'
  | 'fallback'

interface Pattern {
  intent: Intent
  phrases?: string[]
  words?: string[]
}

const PATTERNS: Pattern[] = [
  { intent: 'greeting', words: ['hello', 'hi', 'hey', 'hujambo', 'habari', 'mambo', 'sasa', 'niaje', 'yo', 'howdy'], phrases: ['good morning', 'good afternoon', 'good evening'] },
  { intent: 'farewell', words: ['bye', 'goodbye', 'kwaheri', 'later'], phrases: ['see you', 'talk later', 'thats all', "that's all"] },
  { intent: 'thanks', words: ['thanks', 'thank', 'asante', 'appreciated'], phrases: ['thank you', 'asante sana'] },
  { intent: 'agent_identity', phrases: ['who are you', 'are you a bot', 'are you human', 'are you real', 'what are you', 'are you ai'] },
  { intent: 'smalltalk', phrases: ['how are you', 'how is it going', 'whats up'] },

  { intent: 'services_overview', words: ['services', 'offerings', 'capabilities'], phrases: ['what do you do', 'what do you offer', 'what can you do', 'list of services', 'what services'] },
  { intent: 'service_detail', words: ['construction', 'renovation', 'renovate', 'fitout', 'supplies', 'supply', 'electrical', 'plumbing', 'interior', 'design', 'management', 'build', 'building'], phrases: ['fit out', 'fit-out', 'project management'] },

  { intent: 'pricing', words: ['price', 'pricing', 'cost', 'costs', 'rate', 'rates', 'charge', 'charges', 'budget', 'afford', 'expensive', 'cheap', 'ksh', 'kes'], phrases: ['how much', 'per square', 'per sqm', 'what would it cost', 'ball park', 'ballpark'] },
  { intent: 'quote', words: ['quote', 'quotation', 'estimate', 'proposal', 'tender', 'bid', 'boq'], phrases: ['get a quote', 'send a quote', 'bill of quantities'] },
  { intent: 'timeline', words: ['duration', 'timeline', 'deadline', 'schedule'], phrases: ['how long', 'how soon', 'how fast', 'when can you', 'completion time', 'turnaround'] },
  { intent: 'process', words: ['process', 'procedure', 'steps', 'stages', 'workflow'], phrases: ['how do you work', 'how does it work', 'what happens after', 'what are the steps'] },

  { intent: 'location', words: ['address', 'office', 'located', 'location', 'directions'], phrases: ['where are you', 'where is your office', 'bruce house', 'standard street', 'how do i find you'] },
  { intent: 'contact', words: ['contact', 'reach', 'phone', 'number', 'email', 'whatsapp', 'call'], phrases: ['get in touch', 'talk to someone', 'speak to'] },
  { intent: 'hours', words: ['hours', 'open', 'closed', 'weekend', 'saturday', 'sunday'], phrases: ['what time', 'opening hours', 'working hours', 'are you open'] },

  { intent: 'about', words: ['about', 'company', 'history', 'background', 'founded', 'established'], phrases: ['who is harriscom', 'tell me about', 'your story'] },
  { intent: 'compliance', words: ['registered', 'registration', 'certificate', 'licence', 'license', 'licensed', 'nca', 'compliance', 'insured', 'insurance', 'pin', 'kra'], phrases: ['are you registered', 'company number', 'tax compliance'] },
  { intent: 'director', words: ['director', 'owner', 'founder', 'ceo', 'abdi', 'jafaar', 'sheikh'], phrases: ['who runs', 'who owns', 'managing director'] },
  { intent: 'coverage', words: ['areas', 'counties', 'coverage', 'nationwide'], phrases: ['do you work in', 'do you cover', 'can you come to', 'which areas', 'where do you work'] },

  { intent: 'payment', words: ['payment', 'pay', 'deposit', 'instalment', 'installment', 'mpesa', 'm-pesa', 'invoice', 'retention'], phrases: ['payment terms', 'how do i pay', 'payment plan'] },
  { intent: 'warranty', words: ['warranty', 'guarantee', 'defects', 'liability', 'snag', 'snagging'], phrases: ['what if something breaks', 'after handover'] },
  { intent: 'materials', words: ['materials', 'cement', 'steel', 'ballast', 'sand', 'aggregate', 'tiles', 'roofing', 'suppliers'], phrases: ['who supplies', 'can i buy my own'] },
  { intent: 'team', words: ['team', 'staff', 'engineers', 'workers', 'artisans', 'fundi', 'mafundi'], phrases: ['who will be on site', 'how many people'] },
  { intent: 'sustainability', words: ['sustainable', 'sustainability', 'green', 'environment', 'solar', 'recycl'], phrases: ['eco friendly'] },
  { intent: 'portfolio', words: ['portfolio', 'projects', 'work', 'examples', 'references', 'gallery'], phrases: ['what have you built', 'past projects', 'previous work', 'can i see'] },

  { intent: 'emergency', words: ['emergency', 'urgent', 'leak', 'burst', 'collapse', 'flood'], phrases: ['right now', 'came down', 'needs fixing today'] },
  { intent: 'careers', words: ['job', 'jobs', 'hiring', 'vacancy', 'vacancies', 'internship', 'attachment', 'cv', 'employment'], phrases: ['are you hiring', 'looking for work'] },
  { intent: 'tender', words: ['tender', 'prequalification', 'procurement', 'rfq', 'rfp', 'supplier'], phrases: ['pre qualification', 'supplier registration', 'vendor registration'] },

  { intent: 'book_visit', words: ['visit', 'appointment', 'meeting', 'consultation'], phrases: ['site visit', 'come and see', 'book a', 'schedule a', 'arrange a', 'come to my site'] },
  { intent: 'human', words: ['human', 'person', 'agent', 'someone'], phrases: ['talk to a human', 'real person', 'speak to someone', 'call me'] },

  { intent: 'objection_price', phrases: ['too expensive', 'too much', 'cheaper elsewhere', 'someone quoted', 'lower price', 'discount', 'beat that price', 'out of my budget'] },
  { intent: 'objection_trust', phrases: ['how do i know', 'can i trust', 'never heard of', 'are you legit', 'is this a scam', 'you are new', 'only since 2022'] },
  { intent: 'objection_timeline', phrases: ['contractors always', 'always late', 'took forever', 'delayed', 'never finish'] },
  { intent: 'objection_diy', phrases: ['do it myself', 'my own fundi', 'manage it myself', 'own contractor'] },

  { intent: 'affirmative', words: ['yes', 'yeah', 'yep', 'sure', 'ok', 'okay', 'ndio', 'sawa', 'please', 'proceed'], phrases: ['go ahead', 'sounds good', 'lets do it'] },
  { intent: 'negative', words: ['no', 'nope', 'hapana', 'nah'], phrases: ['not now', 'not yet', 'maybe later'] },
]

/**
 * Intents that carry no request of their own. "Hi" is a greeting; "hi, can you
 * supply cement to Kitengela?" is a supply enquiry with a greeting attached,
 * and answering only the greeting is the classic chatbot failure.
 */
const COURTESY_INTENTS: Intent[] = ['greeting', 'farewell', 'thanks', 'affirmative', 'negative', 'smalltalk']

function score(text: string, padded: string, pattern: Pattern) {
  let total = 0
  for (const phrase of pattern.phrases ?? []) {
    if (text.includes(phrase)) total += 3.5
  }
  for (const word of pattern.words ?? []) {
    if (padded.includes(` ${word} `)) total += 2
    else if (text.includes(word) && word.length > 4) total += 1
  }
  return total
}

function classify(text: string): { intent: Intent; score: number; courtesy?: Intent } {
  const padded = ` ${text} `
  const scored = PATTERNS.map((pattern) => ({ intent: pattern.intent, score: score(text, padded, pattern) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)

  const best = scored[0]
  if (!best || best.score < 2) return { intent: 'fallback', score: best?.score ?? 0 }

  if (COURTESY_INTENTS.includes(best.intent) && text.split(' ').length > 3) {
    const substantive = scored.find((entry) => !COURTESY_INTENTS.includes(entry.intent) && entry.score >= 2)
    if (substantive) return { ...substantive, courtesy: best.intent }
  }

  return best
}

/* ──────────────────────────────── answers ───────────────────────────────── */

const ksh = (value: number) => `Ksh ${Math.round(value).toLocaleString('en-KE')}`
const serviceTitle = (slug?: string) => services.find((entry) => entry.slug === slug)?.title

function pick<T>(options: T[], seed: number): T {
  return options[seed % options.length]
}

function answerFor(intent: Intent, text: string, lead: Lead, state: AgentState): string | null {
  const seed = state.turns

  switch (intent) {
    case 'greeting':
      return pick(
        [
          `Hello! I'm Harri, ${company.shortName}'s assistant. I can price up a job, check whether we cover your area, and book a free site visit.`,
          `Hi there — Harri here from ${company.shortName}. Ask me anything about a build, a renovation or a supply order.`,
          `Karibu! I'm Harri. I help people scope construction and supply work with ${company.shortName}.`,
        ],
        seed,
      )

    case 'agent_identity':
      return `I'm Harri, ${company.shortName}'s digital assistant — software, not a person. I answer from the company's own information on services, pricing, programme and compliance, and I can hand you to the team on ${contact.phone} the moment you want a human.`

    case 'smalltalk':
      return 'Doing well, thank you — and ready to be useful. What are you looking to build, renovate or supply?'

    case 'farewell':
      return `Thanks for stopping by. When you're ready we're on ${contact.phone} or ${contact.email}, and WhatsApp is usually the fastest.`

    case 'thanks':
      return pick(
        ['Happy to help.', 'Any time.', 'Glad that was useful.'],
        seed,
      )

    case 'services_overview':
      return [
        `${company.shortName} runs six lines of work:`,
        ...services.map((service) => `• **${service.title}** — ${service.short}`),
        '',
        'Which one is closest to what you need?',
      ].join('\n')

    case 'service_detail': {
      const match = recommendService(text)
      const service = services.find((entry) => entry.slug === (match?.slug ?? lead.service))
      if (!service) return null
      return [
        `**${service.title}**`,
        service.description,
        '',
        'What that includes:',
        ...service.deliverables.map((item) => `• ${item}`),
      ].join('\n')
    }

    case 'pricing': {
      const estimate = estimateCost({ service: lead.service, area: lead.area })
      if (lead.service && estimate.ok) return estimate.summary
      return [
        `${PRICING.note}`,
        '',
        ...PRICING.bands
          .filter((band) => band.from > 0)
          .map((band) => `• **${band.label}** — ${ksh(band.from)}–${ksh(band.to)} ${band.unit}`),
        '',
        'Tell me what you are building and roughly how big it is, and I will narrow that down.',
      ].join('\n')
    }

    case 'quote':
      return [
        'A quotation from us is free and comes off a measured bill of quantities, not a guess.',
        '',
        `1. Free site visit anywhere in the Nairobi metro.`,
        '2. Measured bill of quantities and a programme.',
        '3. Costed proposal in your inbox within one working day of the visit.',
        '',
        'I can start that now — I just need a few details.',
      ].join('\n')

    case 'timeline':
      return lead.service
        ? estimateTimeline({ service: lead.service, area: lead.area })
        : ['Typical durations:', ...TIMELINES.map((entry) => `• ${entry.label} — ${entry.duration}`)].join('\n')

    case 'process':
      return [
        'Six stages, and nothing starts until the previous one is signed off:',
        '',
        '**1 Consultation** — we listen, and tell you honestly if the budget fits the brief.',
        '**2 Site assessment** — free visit, measurements, access and services checked.',
        '**3 Costed proposal** — line-by-line quote, programme and payment schedule.',
        '**4 Mobilisation** — contract, site set-up, materials ordered to programme.',
        '**5 Build & report** — resident supervisor, weekly photos and spend against budget.',
        '**6 Handover** — joint snagging, certificates, as-built drawings, warranty.',
      ].join('\n')

    case 'location':
      return [
        `Our office is **${contact.address.line1}, ${contact.address.line2}** — right in the middle of the CBD.`,
        `Postal: ${contact.address.postal}`,
        `Registered office: ${contact.address.registeredOffice}`,
        '',
        `${contact.hours.weekdays}`,
        `${contact.hours.saturday}`,
      ].join('\n')

    case 'contact':
      return [
        `**Phone / WhatsApp:** ${contact.phone}`,
        `**Email:** ${contact.email}`,
        `**Office:** ${contact.address.line1}, ${contact.address.line2}`,
        '',
        'WhatsApp is the quickest if you want to send site photos.',
      ].join('\n')

    case 'hours':
      return [
        `${contact.hours.weekdays}`,
        `${contact.hours.saturday}`,
        `${contact.hours.sunday}`,
        '',
        `Outside those hours, WhatsApp ${contact.phone} and we pick it up first thing.`,
      ].join('\n')

    case 'about':
      return [
        `${company.name} is a Kenyan-owned construction and general supplies contractor based in Nairobi.`,
        '',
        `• Incorporated ${company.founded}, registration ${company.registration}`,
        `• Director: ${company.director}`,
        `• 150+ projects handed over across ${COVERAGE.counties.length} counties`,
        `• Office: ${contact.address.line1}, ${contact.address.line2}`,
      ].join('\n')

    case 'compliance':
      return ['Yes — and we will put the paperwork in front of you before you commit to anything:', '', ...COMPLIANCE.points.map((point) => `• ${point}`)].join('\n')

    case 'director':
      return `${company.name} is led by **${company.director}**, who founded the company in ${company.foundedYear} and is its sole shareholder. He is hands-on across live projects — if you want to speak to him directly, call ${contact.phone}.`

    case 'coverage': {
      const location = extractLocation(text) ?? lead.location
      return checkCoverage(location).summary
    }

    case 'payment':
      return [PAYMENT.summary, '', ...PAYMENT.detail.map((line) => `• ${line}`)].join('\n')

    case 'warranty':
      return `${WARRANTY.summary}\n\n${WARRANTY.detail}`

    case 'materials':
      return [MATERIALS.summary, '', ...MATERIALS.detail.map((line) => `• ${line}`)].join('\n')

    case 'team':
      return `${TEAM.summary}\n\n${TEAM.detail}`

    case 'sustainability':
      return SUSTAINABILITY.summary

    case 'portfolio':
      return [
        'A few recent ones:',
        '',
        ...projects.slice(0, 4).map((project) => `• **${project.title}** — ${project.location} (${project.year}). ${project.summary}`),
        '',
        'The full set is on the Projects page, and we will give you client contacts to call if you want references.',
      ].join('\n')

    case 'emergency':
      return `For anything urgent, call ${contact.phone} directly rather than waiting on this chat — burst pipes, electrical faults and structural problems get dispatched the same day where we can. WhatsApp a photo to the same number and it reaches the team immediately.`

    case 'careers':
      return `We take on engineers, site supervisors and skilled trades as projects come up. Send a CV to ${contact.email} with the trade in the subject line and it goes to the right person. We also run attachments for construction students.`

    case 'tender':
      return [
        'For procurement and prequalification we can supply:',
        '',
        `• Certificate of incorporation (${company.registration})`,
        '• NCA registration',
        '• Tax compliance certificate',
        "• Contractor's all-risk and workmen's compensation cover",
        '• CR12 and company profile with past-project references',
        '',
        `Email ${contact.email} with the tender number and closing date and we will turn the pack around quickly.`,
      ].join('\n')

    case 'objection_price':
      return pick(OBJECTIONS.price, seed)
    case 'objection_trust':
      return pick(OBJECTIONS.trust, seed)
    case 'objection_timeline':
      return pick(OBJECTIONS.timeline, seed)
    case 'objection_diy':
      return pick(OBJECTIONS.diy, seed)

    case 'human':
      return `Of course — ${contact.phone} reaches the team directly, and the same number is on WhatsApp. If you leave me your name and number I will pass it on and someone will call you back instead.`

    case 'book_visit':
      return 'Good — site visits are free in the Nairobi metro and there is no obligation to proceed afterwards. Let me take a few details and the team will confirm a time.'

    default:
      return null
  }
}

/* ────────────────────────── qualification policy ────────────────────────── */

interface Question {
  slot: string
  prompt: string
  quickReplies?: string[]
}

function nextQuestion(state: AgentState): Question | null {
  const { lead, asked } = state
  const unasked = (slot: string) => !asked.includes(slot)

  if (!lead.service && unasked('service')) {
    return {
      slot: 'service',
      prompt: 'What kind of work is it — a new build, a renovation or fit-out, or a materials supply order?',
      quickReplies: ['New build', 'Renovation / fit-out', 'Materials supply', 'Not sure yet'],
    }
  }

  if (!lead.location && unasked('location')) {
    return {
      slot: 'location',
      prompt: 'Whereabouts is the site? That tells me whether the visit is free and how fast we can get there.',
      quickReplies: ['Nairobi', 'Kiambu', 'Machakos', 'Elsewhere in Kenya'],
    }
  }

  if (!lead.area && unasked('area') && lead.service !== 'general-supplies') {
    return {
      slot: 'area',
      prompt: 'Roughly what size? Floor area in square metres is ideal, but number of bedrooms or rooms works too.',
      quickReplies: ['3 bedrooms', 'About 200 sqm', 'About 500 sqm', 'Not sure'],
    }
  }

  if (!lead.timeline && unasked('timeline')) {
    return {
      slot: 'timeline',
      prompt: 'When are you hoping to start?',
      quickReplies: ['As soon as possible', 'Next month', 'In 3 months', 'Still planning'],
    }
  }

  if (!lead.name && unasked('name')) {
    return { slot: 'name', prompt: 'Who am I speaking to?' }
  }

  if (!lead.phone && !lead.email && unasked('phone')) {
    return {
      slot: 'phone',
      prompt: 'And the best number or email to send the proposal to? I will pass it straight to the team.',
    }
  }

  return null
}

function readyToSubmit(lead: Lead) {
  return Boolean(lead.name && (lead.phone || lead.email) && (lead.service || lead.location))
}

/* ─────────────────────────────── quick replies ──────────────────────────── */

function quickRepliesFor(intent: Intent, state: AgentState, question: Question | null): string[] {
  if (question?.quickReplies) return question.quickReplies

  if (state.submitted) return ['Talk to a human', 'See your projects', 'What happens next?']

  switch (intent) {
    case 'greeting':
    case 'fallback':
      return ['What do you cost?', 'Book a site visit', 'What do you build?', 'Are you registered?']
    case 'pricing':
      return ['Book a free site visit', 'How long would it take?', 'How do payments work?']
    case 'services_overview':
      return ['Building construction', 'Renovation & fit-out', 'General supplies', 'Get a quote']
    case 'portfolio':
      return ['Book a site visit', 'What do you cost?', 'Can I get references?']
    case 'objection_price':
    case 'objection_trust':
    case 'objection_timeline':
      return ['Book a free site visit', 'Send me your certificates', 'Talk to a human']
    default:
      return ['Get a quote', 'Book a site visit', 'Talk to a human']
  }
}

function actionsFor(state: AgentState, intent: Intent): AgentAction[] {
  const actions: AgentAction[] = []

  if (intent === 'human' || intent === 'emergency' || state.submitted) {
    actions.push({ type: 'call', label: `Call ${contact.phone}` })
  }

  actions.push({
    type: 'whatsapp',
    label: 'Continue on WhatsApp',
    message: buildWhatsAppMessage(state),
  })

  if (intent === 'portfolio') {
    actions.push({ type: 'link', label: 'See all projects', href: '/projects' })
  }
  if (intent === 'services_overview' || intent === 'service_detail') {
    actions.push({ type: 'link', label: 'Browse services', href: '/services' })
  }

  return actions
}

export function buildWhatsAppMessage(state: AgentState) {
  const { lead } = state
  const parts = ['Hello Harriscom, I was chatting to Harri on your website.']
  if (lead.service) parts.push(`Service: ${serviceTitle(lead.service) ?? lead.service}.`)
  if (lead.location) parts.push(`Location: ${lead.location}.`)
  if (lead.area) parts.push(`Size: about ${lead.area} sqm.`)
  if (lead.timeline) parts.push(`Start: ${lead.timeline}.`)
  if (lead.name) parts.push(`My name is ${lead.name}.`)
  return parts.join(' ')
}

export function leadSummary(lead: Lead) {
  const rows = [
    ['Name', lead.name],
    ['Phone', lead.phone],
    ['Email', lead.email],
    ['Service', serviceTitle(lead.service) ?? lead.service],
    ['Location', lead.location],
    ['Size', lead.area ? `${lead.area} sqm` : undefined],
    ['Budget', lead.budget ? ksh(lead.budget) : undefined],
    ['Start', lead.timeline],
  ].filter(([, value]) => Boolean(value)) as [string, string][]

  return rows.map(([label, value]) => `${label}: ${value}`).join('\n')
}

/* ──────────────────────────────── the turn ──────────────────────────────── */

/**
 * Both the knowledge answers and the qualification policy like to end on a
 * question. Appending them raw asks two things at once, so the answer's own
 * closing question is dropped when the policy has one of its own.
 */
function dropTrailingQuestion(text: string) {
  const lines = text.split('\n')
  while (lines.length > 1 && !lines[lines.length - 1].trim()) lines.pop()

  const last = lines[lines.length - 1]?.trim()
  if (!last?.endsWith('?')) return text

  // A whole line that is just a question goes; a question tacked onto a longer
  // paragraph loses only its final sentence.
  const sentences = last.split(/(?<=[.!?])\s+/)
  if (sentences.length > 1) {
    sentences.pop()
    lines[lines.length - 1] = sentences.join(' ')
  } else {
    lines.pop()
  }

  return lines.join('\n').trimEnd()
}

/** Short acknowledgement for a message that answered a question rather than asking one. */
function acknowledge(filled: string[], lead: Lead, seed: number): string | null {
  if (filled.includes('name') && lead.name) return `Thanks, ${lead.name.split(' ')[0]}.`
  if (filled.includes('location') && lead.location) return checkCoverage(lead.location).summary
  if (filled.includes('phone') || filled.includes('email')) return null
  if (filled.includes('timeline')) {
    return pick(['Noted.', 'Good — that is enough notice to programme properly.', 'Understood.'], seed)
  }
  if (filled.includes('area')) return null
  return pick(['Got it.', 'Understood.', 'Noted.'], seed)
}

function filledSlots(before: Lead, after: Lead): string[] {
  const keys: (keyof Lead)[] = ['name', 'phone', 'email', 'service', 'location', 'area', 'budget', 'timeline']
  return keys.filter((key) => !before[key] && after[key]).map(String)
}

export function respond(message: string, previous: AgentState): AgentTurn {
  const text = normalise(message)
  const state: AgentState = {
    ...previous,
    turns: previous.turns + 1,
    lead: extractSlots(message, previous.lead),
    asked: [...previous.asked],
  }
  const filled = filledSlots(previous.lead, state.lead)

  const { intent, courtesy } = classify(text)

  // A bare "yes" right after we offered a site visit should book it, not
  // trigger the generic affirmative reply.
  const effectiveIntent: Intent =
    intent === 'affirmative' && (previous.stage === 'propose' || previous.stage === 'qualify')
      ? 'book_visit'
      : intent

  let answer = answerFor(effectiveIntent, text, state.lead, state)

  // A greeting wrapped around a real question still deserves a hello, just not
  // a whole paragraph of one. Kept as its own line so it cannot mangle an
  // answer that opens with markdown.
  const greetingLine =
    courtesy === 'greeting' && previous.turns === 0 ? 'Hello — happy to help.' : null

  if (effectiveIntent === 'book_visit' || effectiveIntent === 'quote') {
    state.stage = 'capture'
  } else if (state.stage === 'greet' && state.turns >= 1) {
    state.stage = 'discover'
  } else if (state.lead.service && state.stage === 'discover') {
    state.stage = 'qualify'
  }

  // A costed range as soon as we can produce one is the single most useful
  // thing we can give someone who is shopping around.
  let estimateLine: string | null = null
  if (
    state.lead.service &&
    state.lead.area &&
    !state.asked.includes('estimate-given') &&
    effectiveIntent !== 'pricing'
  ) {
    const estimate = estimateCost({ service: state.lead.service, area: state.lead.area })
    if (estimate.ok && estimate.low) {
      estimateLine = estimate.summary
      state.asked.push('estimate-given')
      state.stage = 'propose'
    }
  }

  const answered = Boolean(answer)
  if (!answer) {
    // Someone answering "next month" or giving their name is replying to us,
    // not asking an unanswerable question — an "I don't know" there reads as
    // if the bot lost the thread.
    answer = filled.length > 0 ? acknowledge(filled, state.lead, state.turns) : fallbackAnswer(state, effectiveIntent)
  }

  // Telling someone their site is inside the free-visit area is the cheapest
  // reason to book, so it gets said the moment we learn where they are.
  const coverageLine =
    answered && filled.includes('location') && state.lead.location && effectiveIntent !== 'coverage'
      ? checkCoverage(state.lead.location).summary
      : null

  const question = readyToSubmit(state.lead) ? null : nextQuestion(state)
  if (question) state.asked.push(question.slot)

  const segments = [greetingLine, question && answer ? dropTrailingQuestion(answer) : answer]
  if (coverageLine) segments.push(coverageLine)
  if (estimateLine) segments.push(estimateLine)

  if (readyToSubmit(state.lead) && !state.submitted) {
    state.submitted = true
    state.stage = 'booked'
    segments.push(
      [
        "Got it — I've passed this to the team:",
        '',
        leadSummary(state.lead),
        '',
        `Someone will be in touch within one working day. If you want it moving faster, call ${contact.phone} and mention you spoke to Harri.`,
      ].join('\n'),
    )
  } else if (question) {
    segments.push(question.prompt)
  } else if (state.submitted) {
    segments.push('Anything else you want to know while you wait?')
  }

  return {
    reply: segments.filter(Boolean).join('\n\n'),
    quickReplies: quickRepliesFor(effectiveIntent, state, question),
    actions: actionsFor(state, effectiveIntent),
    state,
    source: 'local',
  }
}

function fallbackAnswer(state: AgentState, intent: Intent): string {
  if (intent === 'negative') {
    return 'No problem. I can leave it there — or point you at pricing, past projects, or how we actually run a job.'
  }
  if (intent === 'affirmative') {
    return 'Great.'
  }

  // An honest "I don't know" beats a confident invention, but it should still
  // move the conversation forward.
  return pick(
    [
      `I don't want to guess at that one. The team will know — ${contact.phone} or ${contact.email}. In the meantime I can help with what we build, what it costs, how long it takes, or booking a free site visit.`,
      `That's outside what I can answer reliably, and a wrong answer about a building is worse than none. Call ${contact.phone} and you will get a straight answer. I can still help with pricing, programme, coverage or booking a visit.`,
      `I'm not sure about that specifically. What I can do is scope your project, give you an indicative cost, or set up a free site visit — and anything I can't answer goes to the team on ${contact.phone}.`,
    ],
    state.turns,
  )
}

export function greeting(): AgentTurn {
  const state = {
    stage: 'greet' as const,
    lead: { notes: [] },
    asked: [],
    turns: 0,
    submitted: false,
  }
  return {
    reply: [
      `Hello — I'm **Harri**, ${company.shortName}'s assistant. 👋`,
      '',
      'I can give you an indicative cost, check whether we cover your area, explain how we run a job, and book a free site visit.',
      '',
      `What are you looking to do?`,
    ].join('\n'),
    quickReplies: ['Get an indicative price', 'Book a free site visit', 'What do you build?', 'Are you registered?'],
    actions: [
      { type: 'whatsapp', label: 'Continue on WhatsApp', message: 'Hello Harriscom, I have a project I would like to discuss.' },
      { type: 'call', label: `Call ${contact.phone}` },
    ],
    state,
    source: 'local',
  }
}

export const AGENT_OFFERS = OFFERS
export { whatsappLink }
