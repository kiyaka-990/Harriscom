/**
 * Everything Harri is allowed to assert.
 *
 * The agent answers from this file and from lib/site.ts. Nothing else. If a
 * question is not covered here the agent says so and hands over to a human —
 * a construction quote invented by a chatbot is a liability, not a feature.
 */

import { company, contact, counties, faqs, process, services } from '@/lib/site'

export const PRICING = {
  note: 'Planning figures for Nairobi. A real number needs a site visit and a bill of quantities, which is free.',
  bands: [
    { service: 'building-construction', label: 'Construction', from: 25000, to: 45000, unit: 'per sqm', detail: 'Basic finish at the lower end, premium fittings and joinery at the upper end.' },
    { service: 'renovations-fit-out', label: 'Renovation & fit-out', from: 5000, to: 20000, unit: 'per sqm', detail: 'Depends on how much is stripped out and whether services are moved.' },
    { service: 'interior-design', label: 'Interior design & furnishing', from: 8000, to: 18000, unit: 'per sqm', detail: 'Design, joinery, lighting and styling as one package.' },
    { service: 'electrical-plumbing', label: 'Electrical & plumbing', from: 0, to: 0, unit: 'per project', detail: 'Priced off the load assessment and drawings — typically 8–14% of a build cost.' },
    { service: 'general-supplies', label: 'Materials supply', from: 0, to: 0, unit: 'market rate', detail: 'Market rates with bulk discounts passed through on contract volumes.' },
    { service: 'project-management', label: 'Project management', from: 0, to: 0, unit: '% of contract', detail: 'Typically 5–10% of contract value depending on scope and duration.' },
  ],
}

export const TIMELINES = [
  { label: 'Two to three bedroom home', duration: '6–10 months from groundbreaking' },
  { label: 'Apartment block (G+4 and above)', duration: '14–24 months depending on storeys' },
  { label: 'Office fit-out', duration: '4–10 weeks, phased around occupancy' },
  { label: 'Apartment or house renovation', duration: '3–8 weeks' },
  { label: 'Warehouse / industrial shed', duration: '4–8 months' },
  { label: 'Materials supply order', duration: '3–7 days from confirmed order' },
]

export const PAYMENT = {
  summary: 'Staged payments against measured progress, never a lump sum up front.',
  detail: [
    'Mobilisation deposit on signing, typically 20–30% depending on materials lead time.',
    'Milestone draws released against work actually measured on site.',
    'Retention of 5% held until the end of the defects liability period.',
    'M-Pesa and bank transfer both accepted; every payment gets an ETR invoice.',
  ],
}

export const WARRANTY = {
  summary: 'Twelve months structural and workmanship defects liability on construction, six months on fit-out and MEP.',
  detail: 'The defects liability period is written into the contract, not offered verbally. Anything that fails within it we come back and fix at our cost.',
}

export const COMPLIANCE = {
  registration: company.registration,
  act: company.registeredUnder,
  founded: company.founded,
  director: company.director,
  points: [
    `Registered ${company.registration} under ${company.registeredUnder}, incorporated ${company.founded}.`,
    'National Construction Authority compliant.',
    "Contractor's all-risk and workmen's compensation insurance in force.",
    'Certified copies of registration, tax compliance and insurance available for tender submissions on request.',
  ],
}

export const MATERIALS = {
  summary: 'Direct supplier accounts for cement, steel, aggregate, roofing, tiles and plumbing.',
  detail: [
    'Cement, reinforcement steel and aggregate bought on contract volume pricing.',
    'Materials scheduled against the build programme so deliveries do not sit on site getting damaged.',
    'Every delivery reconciled against the bill of quantities, with delivery notes shared in the weekly report.',
    'Clients are welcome to nominate their own suppliers — we will manage them.',
  ],
}

export const TEAM = {
  summary: 'Civil engineers, project managers, licensed electricians and plumbers, and vetted artisans.',
  detail: 'Every site has a resident supervisor and a named project manager. Trades are insured and inducted on site safety before they start.',
}

export const SUSTAINABILITY = {
  summary: 'Practical rather than performative: waste separation on site, local sourcing, and solar water heating fitted as standard where the client wants it.',
}

export const COVERAGE = {
  core: ['Nairobi', 'Kiambu', 'Kajiado', 'Machakos'],
  counties,
  freeVisitNote: 'Site visits are free anywhere in the Nairobi metropolitan area. Outside it we recover travel only, agreed in advance.',
  nationalNote: 'We take work nationwide where the scope justifies mobilisation — tell us the county and we will tell you honestly whether we are the right contractor for it.',
}

/**
 * Objection handling. Sales work, but honest sales work: each response answers
 * the concern with something checkable rather than deflecting it.
 */
export const OBJECTIONS = {
  price: [
    'Fair — price is the right thing to push on. Our quotations come off a measured bill of quantities, so you can see the rate against every line and compare it with anyone else\'s. Where we are more expensive we will show you why; where a spec can come down without hurting the building, we will say so.',
    'We are not the cheapest quote you will get, and the cheapest quote is usually the one that grows. What we will do is fix the price against a measured bill of quantities, so the number you sign is the number you pay unless you approve a change in writing.',
  ],
  trust: [
    `Reasonable — you are handing money to people you have not met. ${COMPLIANCE.points[0]} We are NCA compliant and insured, we will give you the contacts of recent clients to call, and the first site visit costs you nothing.`,
    'The best answer is a site visit: come and see a job in progress, talk to the client, then decide. We will also send registration, tax compliance and insurance certificates before you commit to anything.',
  ],
  timeline: [
    'Programme slippage is the industry\'s worst habit. Ours is fixed in the proposal before work starts, reported weekly against actual progress, and if something slips you hear about it the week it happens, not at handover.',
    '98% of our handovers land on the contract date. The 2% that do not were reported early enough for the client to plan around.',
  ],
  diy: [
    'Running it yourself is genuinely cheaper on paper. What it costs is your time and the risk of managing eight trades who each blame the last one. If you want to keep control, take our project management service instead — you stay the client, we hold the programme and the cost plan.',
  ],
}

export const OFFERS = [
  'Free site visit anywhere in the Nairobi metro, with no obligation to proceed.',
  'Costed proposal in your inbox within one working day of the visit.',
  'Bulk material pricing passed through at cost on contract work.',
]

/** Compact, token-efficient brief for the model-backed path. */
export function knowledgeBrief() {
  return [
    `COMPANY: ${company.name} (${company.shortName}). ${company.description}`,
    `Registered ${company.registration} under ${company.registeredUnder}, incorporated ${company.founded}. Director: ${company.director}.`,
    `CONTACT: phone/WhatsApp ${contact.phone}; email ${contact.email}; office ${contact.address.line1}, ${contact.address.line2}, ${contact.address.postal}.`,
    `HOURS: ${contact.hours.weekdays}; ${contact.hours.saturday}; ${contact.hours.sunday} (${contact.hours.timezone}).`,
    '',
    'SERVICES:',
    ...services.map((s) => `- ${s.title} (${s.slug}): ${s.description}`),
    '',
    `PRICING (${PRICING.note})`,
    ...PRICING.bands.map((b) =>
      b.from ? `- ${b.label}: Ksh ${b.from.toLocaleString()}–${b.to.toLocaleString()} ${b.unit}. ${b.detail}` : `- ${b.label}: ${b.unit}. ${b.detail}`,
    ),
    '',
    'TYPICAL DURATIONS:',
    ...TIMELINES.map((t) => `- ${t.label}: ${t.duration}`),
    '',
    `PAYMENT: ${PAYMENT.summary} ${PAYMENT.detail.join(' ')}`,
    `WARRANTY: ${WARRANTY.summary} ${WARRANTY.detail}`,
    `MATERIALS: ${MATERIALS.summary} ${MATERIALS.detail.join(' ')}`,
    `TEAM: ${TEAM.summary} ${TEAM.detail}`,
    `SUSTAINABILITY: ${SUSTAINABILITY.summary}`,
    `COVERAGE: core ${COVERAGE.core.join(', ')}; active in ${counties.join(', ')}. ${COVERAGE.freeVisitNote} ${COVERAGE.nationalNote}`,
    '',
    'COMPLIANCE: ' + COMPLIANCE.points.join(' '),
    '',
    'PROCESS: ' + process.map((p) => `${p.num} ${p.title} — ${p.body}`).join(' '),
    '',
    'FAQ:',
    ...faqs.map((f) => `Q: ${f.q} A: ${f.a}`),
  ].join('\n')
}
