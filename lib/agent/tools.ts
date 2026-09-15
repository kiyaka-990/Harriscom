/**
 * Deterministic tools the agent can run.
 *
 * These are the only way Harri produces a number. Both the keyless brain and
 * the model-backed path call the same functions, so the two paths can never
 * quote different prices for the same question.
 */

import { counties, services } from '@/lib/site'
import { COVERAGE, PRICING, TIMELINES } from '@/lib/agent/knowledge'

const ksh = (value: number) => `Ksh ${Math.round(value).toLocaleString('en-KE')}`

export interface CostEstimate {
  ok: boolean
  summary: string
  low?: number
  high?: number
}

export function estimateCost(input: {
  service?: string
  area?: number
  finish?: 'basic' | 'standard' | 'premium'
}): CostEstimate {
  const band = PRICING.bands.find((entry) => entry.service === input.service)

  if (!band) {
    return {
      ok: false,
      summary:
        'That one is priced off drawings rather than a rate per square metre, so I would be guessing. A free site visit gets you a real number within a working day.',
    }
  }

  if (!band.from) {
    return { ok: false, summary: `${band.label}: ${band.detail}` }
  }

  if (!input.area || input.area <= 0) {
    return {
      ok: true,
      low: band.from,
      high: band.to,
      summary: `${band.label} runs about ${ksh(band.from)}–${ksh(band.to)} ${band.unit} in Nairobi. ${band.detail} Tell me the floor area and I will work out the range for your project.`,
    }
  }

  // Finish level narrows the band rather than replacing it — the spread exists
  // because site conditions vary, and a chat message cannot resolve that.
  const spread = band.to - band.from
  const shift =
    input.finish === 'basic' ? { low: 0, high: 0.45 }
      : input.finish === 'premium' ? { low: 0.55, high: 1 }
        : { low: 0.15, high: 0.8 }

  const rateLow = band.from + spread * shift.low
  const rateHigh = band.from + spread * shift.high
  const low = rateLow * input.area
  const high = rateHigh * input.area

  return {
    ok: true,
    low,
    high,
    summary: `For roughly ${input.area} sqm of ${band.label.toLowerCase()}, budget in the region of ${ksh(low)} to ${ksh(high)}. ${PRICING.note}`,
  }
}

export function estimateTimeline(input: { service?: string; area?: number }): string {
  if (input.service === 'general-supplies') {
    return 'Supply orders deliver within 3–7 days of a confirmed order, scheduled to land when your programme needs them.'
  }
  if (input.service === 'renovations-fit-out' || input.service === 'interior-design') {
    const weeks = input.area && input.area > 400 ? '8–14 weeks' : '4–10 weeks'
    return `Fit-out and refurbishment of this kind typically runs ${weeks}, phased around occupancy so you keep trading.`
  }
  if (input.service === 'building-construction') {
    if (input.area && input.area >= 1500) return 'A development at that scale typically runs 14–24 months from groundbreaking to handover.'
    if (input.area && input.area >= 400) return 'A building at that scale typically runs 8–14 months from groundbreaking to handover.'
    return 'A two to three bedroom home typically runs 6–10 months from groundbreaking to handover.'
  }
  return TIMELINES.map((entry) => `${entry.label}: ${entry.duration}`).join('. ')
}

export interface CoverageResult {
  covered: boolean
  tier: 'metro' | 'county' | 'national'
  summary: string
}

export function checkCoverage(location?: string): CoverageResult {
  if (!location) {
    return {
      covered: true,
      tier: 'national',
      summary: `We work across ${COVERAGE.core.join(', ')} as core territory and have projects in ${counties.length} counties. Where is the site?`,
    }
  }

  const needle = location.toLowerCase()
  const metro = COVERAGE.core.some((area) => needle.includes(area.toLowerCase())) || METRO_AREAS.some((area) => needle.includes(area))
  if (metro) {
    return {
      covered: true,
      tier: 'metro',
      summary: `${titleCase(location)} is inside our core area, so the site visit is free and we can usually get there within a couple of days.`,
    }
  }

  // People name the town, not the county — "Eldoret" has to resolve to Uasin
  // Gishu or we tell a client in a county we cover that we do not cover it.
  const county =
    counties.find((entry) => needle.includes(entry.toLowerCase())) ??
    counties.find((entry) => TOWN_COUNTY[findTown(needle) ?? ''] === entry)

  if (county) {
    return {
      covered: true,
      tier: 'county',
      summary: `We have active or completed work in ${county}. ${COVERAGE.freeVisitNote}`,
    }
  }

  return {
    covered: true,
    tier: 'national',
    summary: `${titleCase(location)} is outside the counties we work in regularly, but we do mobilise nationwide where the scope justifies it — tell me more about the job and I will say honestly whether we are the right contractor for it.`,
  }
}

const TOWN_COUNTY: Record<string, string> = {
  eldoret: 'Uasin Gishu',
  naivasha: 'Nakuru',
  diani: 'Kilifi',
  malindi: 'Kilifi',
  watamu: 'Kilifi',
  nyahururu: 'Nyeri',
  karatina: 'Nyeri',
  maua: 'Meru',
}

function findTown(needle: string) {
  return Object.keys(TOWN_COUNTY).find((town) => needle.includes(town))
}

export function recommendService(text: string): { slug: string; title: string; why: string } | null {
  const needle = text.toLowerCase()

  const rules: { slug: string; words: string[]; why: string }[] = [
    { slug: 'building-construction', words: ['build', 'construct', 'house', 'home', 'apartment', 'block', 'storey', 'warehouse', 'godown', 'foundation', 'from scratch', 'ground up', 'perimeter wall', 'bungalow', 'maisonette'], why: 'this is a ground-up build' },
    { slug: 'renovations-fit-out', words: ['renovat', 'refurb', 'remodel', 'fit out', 'fit-out', 'fitout', 'makeover', 'facelift', 'partition', 'strip out', 'upgrade the', 'old house', 'repair'], why: 'you are working with an existing building' },
    { slug: 'general-supplies', words: ['supply', 'supplies', 'cement', 'steel', 'ballast', 'sand', 'aggregate', 'tiles', 'roofing', 'hardware', 'materials', 'procure', 'deliver'], why: 'this is a materials and procurement job' },
    { slug: 'electrical-plumbing', words: ['electric', 'wiring', 'socket', 'distribution board', 'plumb', 'pipe', 'drainage', 'sewer', 'borehole', 'pump', 'solar', 'water tank', 'mep'], why: 'this is mechanical and electrical work' },
    { slug: 'interior-design', words: ['interior', 'design', 'decor', 'furnish', 'furniture', 'joinery', 'ceiling', 'lighting', 'paint', 'curtain', 'cabinet', 'wardrobe'], why: 'this is interiors and finishes' },
    { slug: 'project-management', words: ['manage', 'supervis', 'oversee', 'contractor is', 'my own', 'coordinate', 'project manage', 'clerk of works'], why: 'you want someone holding the programme rather than swinging the hammer' },
  ]

  let best: { slug: string; score: number; why: string } | null = null
  for (const rule of rules) {
    const score = rule.words.reduce((total, word) => (needle.includes(word) ? total + 1 : total), 0)
    if (score > 0 && (!best || score > best.score)) best = { slug: rule.slug, score, why: rule.why }
  }

  if (!best) return null
  const service = services.find((entry) => entry.slug === best!.slug)
  if (!service) return null
  return { slug: service.slug, title: service.title, why: best.why }
}

const METRO_AREAS = [
  'nairobi', 'westlands', 'kilimani', 'kileleshwa', 'lavington', 'karen', 'runda', 'muthaiga',
  'gigiri', 'parklands', 'upper hill', 'upperhill', 'cbd', 'south b', 'south c', 'langata',
  'lang\'ata', 'ngong', 'rongai', 'kitengela', 'athi river', 'mlolongo', 'syokimau', 'ruiru',
  'juja', 'thika', 'kiambu', 'ruaka', 'kikuyu', 'limuru', 'kasarani', 'roysambu', 'kahawa',
  'embakasi', 'donholm', 'buruburu', 'utawala', 'kileleshwa', 'kahawa sukari', 'machakos',
  'kajiado', 'ongata rongai', 'kiserian', 'githunguri',
]

function titleCase(value: string) {
  return value.replace(/\b[a-z]/g, (character) => character.toUpperCase())
}

export const TOOL_DEFINITIONS = [
  {
    name: 'estimate_cost',
    description:
      'Indicative cost range for a Harriscom service. Use whenever the visitor asks what something costs. Never invent prices yourself.',
    input_schema: {
      type: 'object' as const,
      properties: {
        service: { type: 'string', enum: services.map((service) => service.slug), description: 'Harriscom service slug' },
        area: { type: 'number', description: 'Floor area in square metres, if known' },
        finish: { type: 'string', enum: ['basic', 'standard', 'premium'], description: 'Finish level, if the visitor indicated one' },
      },
      required: ['service'],
    },
  },
  {
    name: 'estimate_timeline',
    description: 'Typical duration for a Harriscom service at a given size.',
    input_schema: {
      type: 'object' as const,
      properties: {
        service: { type: 'string', enum: services.map((service) => service.slug) },
        area: { type: 'number', description: 'Floor area in square metres, if known' },
      },
      required: ['service'],
    },
  },
  {
    name: 'check_coverage',
    description: 'Whether Harriscom covers a location and whether the site visit is free there.',
    input_schema: {
      type: 'object' as const,
      properties: { location: { type: 'string', description: 'Town, estate or county' } },
      required: ['location'],
    },
  },
  {
    name: 'recommend_service',
    description: 'Map a free-text description of what the visitor needs onto a Harriscom service.',
    input_schema: {
      type: 'object' as const,
      properties: { description: { type: 'string' } },
      required: ['description'],
    },
  },
]

export function runTool(name: string, input: Record<string, unknown>): string {
  switch (name) {
    case 'estimate_cost':
      return estimateCost({
        service: input.service as string,
        area: typeof input.area === 'number' ? input.area : undefined,
        finish: input.finish as 'basic' | 'standard' | 'premium' | undefined,
      }).summary
    case 'estimate_timeline':
      return estimateTimeline({
        service: input.service as string,
        area: typeof input.area === 'number' ? input.area : undefined,
      })
    case 'check_coverage':
      return checkCoverage(input.location as string).summary
    case 'recommend_service': {
      const match = recommendService(String(input.description ?? ''))
      return match
        ? `${match.title} (${match.slug}) — ${match.why}.`
        : 'No clear match; ask the visitor what they want to do to the building.'
    }
    default:
      return `Unknown tool: ${name}`
  }
}
