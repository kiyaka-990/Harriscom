/**
 * Single source of truth for everything the site says about Harriscom.
 *
 * Contact details used to be duplicated across the footer, contact section and
 * the chatbot, which is how the old template Gmail address survived in the bot
 * long after the visible site had been corrected. Every surface reads from here.
 */

export const company = {
  name: 'Harriscom Company Limited',
  shortName: 'Harriscom',
  tagline: 'Build with certainty.',
  description:
    'Kenyan-owned construction and general supplies contractor delivering residential, commercial and industrial projects across the country — on time, on budget, and to specification.',
  registration: 'PVT-6LUK5LZD',
  registeredUnder: 'The Companies Act, 2015',
  founded: '21 October 2022',
  foundedYear: 2022,
  director: 'Abdi Jafaar Sheikh',
  url: 'https://www.harriscomcompany.co.ke',
} as const

export const contact = {
  phone: '+254 728 392 225',
  phoneHref: 'tel:+254728392225',
  whatsapp: '254728392225',
  email: 'info@harriscomcompany.co.ke',
  emailHref: 'mailto:info@harriscomcompany.co.ke',
  address: {
    line1: '12th Floor, Bruce House',
    line2: 'Standard Street, Nairobi CBD',
    postal: 'P.O. Box 38631-00100, Nairobi',
    registeredOffice: 'Yala Towers, Koinange Street, Nairobi',
    country: 'Kenya',
  },
  hours: {
    weekdays: 'Monday – Friday · 8:00 AM – 6:00 PM',
    saturday: 'Saturday · 8:00 AM – 2:00 PM',
    sunday: 'Sunday · Closed',
    timezone: 'EAT',
  },
  // Bruce House, Standard Street, Nairobi.
  geo: { lat: -1.284604, lng: 36.818794 },
} as const

export function whatsappLink(message: string) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`
}

export interface Service {
  slug: string
  num: string
  title: string
  short: string
  description: string
  accent: string
  image: string
  deliverables: string[]
  /** Indicative Nairobi rates, used by the site and by the estimator tool. */
  rate?: { unit: string; from: number; to: number }
}

export const services: Service[] = [
  {
    slug: 'building-construction',
    num: '01',
    title: 'Building Construction',
    short: 'Residential, commercial and industrial structures.',
    description:
      'Full-scope construction from site clearance and foundations through structural works to handover. We build residential homes and apartments, commercial offices and retail, and industrial warehousing — all to NCA standards with a resident engineer on every site.',
    accent: 'navy',
    image: '/images/project-5.jpeg',
    deliverables: [
      'Site survey, setting out and excavation',
      'Reinforced concrete frame and masonry',
      'Roofing, glazing and external works',
      'Structural certification and handover pack',
    ],
    rate: { unit: 'sqm', from: 25000, to: 45000 },
  },
  {
    slug: 'renovations-fit-out',
    num: '02',
    title: 'Renovations & Fit-Out',
    short: 'Refurbishment and commercial fit-out.',
    description:
      'Bringing tired space back to life — office fit-out, retail refits, apartment refurbishment and full property makeovers. We work in occupied buildings with phased programmes and out-of-hours shifts so your business keeps running.',
    accent: 'crimson',
    image: '/images/project-1.jpeg',
    deliverables: [
      'Condition survey and phased programme',
      'Strip-out and structural alterations',
      'Partitions, ceilings, joinery and finishes',
      'Snagging and post-completion support',
    ],
    rate: { unit: 'sqm', from: 5000, to: 20000 },
  },
  {
    slug: 'general-supplies',
    num: '03',
    title: 'General Supplies',
    short: 'Materials, hardware and equipment procurement.',
    description:
      'Procurement and delivery of construction materials, hardware, tools and site equipment anywhere in Kenya. We hold supplier accounts for cement, steel, aggregate, roofing, tiles and plumbing, and pass bulk pricing through to contract clients.',
    accent: 'emerald',
    image: '/images/service-supplies.jpg',
    deliverables: [
      'Supplier sourcing and price comparison',
      'Bulk purchasing and consolidated delivery',
      'Materials scheduling against programme',
      'Delivery notes and reconciliation',
    ],
  },
  {
    slug: 'electrical-plumbing',
    num: '04',
    title: 'Electrical & Plumbing',
    short: 'Licensed MEP installation and maintenance.',
    description:
      'Certified electrical and plumbing installations, upgrades and planned maintenance. Distribution boards, wiring, lighting design, water reticulation, drainage, pumps and solar water heating — all signed off by licensed engineers.',
    accent: 'teal',
    image: '/images/service-electrical.jpg',
    deliverables: [
      'Load assessment and MEP drawings',
      'First and second fix installation',
      'Testing, commissioning and certification',
      'Planned preventive maintenance contracts',
    ],
  },
  {
    slug: 'interior-design',
    num: '05',
    title: 'Interior Design',
    short: 'Space planning, finishes and furnishing.',
    description:
      'Interiors designed around how the space will actually be used. Space planning, material and colour schemes, bespoke joinery, lighting and furnishing — delivered as a single package with the build so design intent survives to completion.',
    accent: 'violet',
    image: '/images/service-interior.jpg',
    deliverables: [
      'Space planning and 3D visualisation',
      'Material, finish and lighting schedules',
      'Bespoke joinery and furniture supply',
      'Styling and handover photography',
    ],
    rate: { unit: 'sqm', from: 8000, to: 18000 },
  },
  {
    slug: 'project-management',
    num: '06',
    title: 'Project Management',
    short: 'End-to-end programme, cost and quality control.',
    description:
      'Independent project management for clients running their own build. We hold the programme, control the cost plan, manage subcontractors and report to you weekly — so you get one accountable point of contact instead of a dozen trades.',
    accent: 'amber',
    image: '/images/hero-1.jpeg',
    deliverables: [
      'Programme and cost plan ownership',
      'Subcontractor procurement and management',
      'Weekly progress and spend reporting',
      'Quality inspections and handover',
    ],
  },
]

export interface Project {
  id: number
  title: string
  category: 'construction' | 'interior' | 'supply'
  location: string
  year: string
  image: string
  summary: string
  tall?: boolean
}

export const projects: Project[] = [
  { id: 1, title: 'Office Complex', category: 'construction', location: 'Westlands, Nairobi', year: '2025', image: '/images/service-1.jpeg', summary: 'Four-storey commercial block with basement parking and a full MEP package.' },
  { id: 2, title: 'Luxury Apartment Fit-Out', category: 'interior', location: 'Kilimani, Nairobi', year: '2025', image: '/images/service-2.jpg', summary: 'Complete interior fit-out of twelve units including joinery and lighting design.', tall: true },
  { id: 3, title: 'Commercial Tower Works', category: 'construction', location: 'Nairobi CBD', year: '2024', image: '/images/hero-1.jpeg', summary: 'Structural and finishing package delivered in an occupied building.' },
  { id: 4, title: 'Materials Supply Contract', category: 'supply', location: 'Mombasa Road', year: '2025', image: '/images/service-3.jpg', summary: 'Scheduled cement, steel and aggregate supply against a live build programme.' },
  { id: 5, title: 'Penthouse Renovation', category: 'interior', location: 'Lavington, Nairobi', year: '2024', image: '/images/project-5.jpeg', summary: 'Full strip-out and rebuild of a penthouse including structural alterations.', tall: true },
  { id: 6, title: 'Industrial Warehouse', category: 'construction', location: 'Mlolongo, Machakos', year: '2024', image: '/images/service-4.jpg', summary: 'Steel-portal warehouse with office block, hardstanding and drainage.' },
  { id: 7, title: 'Hardware & Tools Supply', category: 'supply', location: 'Nairobi & Kiambu', year: '2025', image: '/images/project-7.jpg', summary: 'Rolling supply of site tools and consumables across five active sites.' },
  { id: 8, title: 'Corporate Office Interior', category: 'interior', location: 'Upper Hill, Nairobi', year: '2025', image: '/images/project-9.jpg', summary: 'Open-plan workspace, meeting suites and reception for a 90-desk tenant.' },
  { id: 9, title: 'Residential Apartments', category: 'construction', location: 'Thika Road, Nairobi', year: '2023', image: '/images/service-5.jpeg', summary: 'Ground-plus-five residential block delivered from foundations to handover.', tall: true },
]

export const stats = [
  { value: 150, suffix: '+', label: 'Projects delivered' },
  { value: 30, suffix: '+', label: 'Corporate clients' },
  { value: 12, suffix: '', label: 'Counties served' },
  { value: 98, suffix: '%', label: 'On-time handover' },
]

export const process = [
  { num: '01', title: 'Consultation', body: 'We listen to what you want to build, where, and by when — then tell you honestly whether the budget matches the brief.' },
  { num: '02', title: 'Site assessment', body: 'A free site visit anywhere in the Nairobi metro. We measure, check access and services, and photograph existing conditions.' },
  { num: '03', title: 'Costed proposal', body: 'A line-by-line quotation against a bill of quantities, with the programme and payment schedule attached. No hidden charges.' },
  { num: '04', title: 'Mobilisation', body: 'Contract signed, site set up, materials ordered against the programme and the team briefed on method and safety.' },
  { num: '05', title: 'Build & report', body: 'Work proceeds under a resident supervisor with weekly progress photos, spend against budget and a look-ahead.' },
  { num: '06', title: 'Handover', body: 'Joint snagging inspection, certificates and as-built drawings, then a defects liability period backed in writing.' },
]

export const differentiators = [
  { title: 'Fixed-price certainty', body: 'Quotations are built from a measured bill of quantities, so the number you sign is the number you pay barring changes you approve in writing.' },
  { title: 'One accountable contact', body: 'A named project manager owns your job end to end. You never chase five subcontractors for one answer.' },
  { title: 'Compliance as standard', body: `Registered ${company.registration} under ${company.registeredUnder}, NCA compliant, with insured teams and certified MEP sign-off.` },
  { title: 'Weekly transparency', body: 'Progress photographs, spend against budget and next-week look-ahead land in your inbox every Friday.' },
  { title: 'Kenyan supply chain', body: 'Direct supplier accounts for cement, steel and aggregate mean bulk pricing and fewer programme-killing delays.' },
  { title: 'Written warranty', body: 'Twelve months structural and workmanship defects liability on construction, six months on fit-out and MEP.' },
]

export const testimonials = [
  { quote: 'They quoted from a proper bill of quantities, not a guess, and the final invoice matched it. That alone put them ahead of the last two contractors we used.', author: 'Procurement Lead', role: 'Commercial developer, Westlands' },
  { quote: 'Our office fit-out ran nights and weekends so trading was never interrupted. Ninety desks, six weeks, handed over snag-free.', author: 'Operations Director', role: 'Professional services firm, Upper Hill' },
  { quote: 'Weekly photo reports meant I could run the project from Mombasa without flying up. The supervisor answered the phone every single time.', author: 'Property Owner', role: 'Residential block, Thika Road' },
]

export const faqs = [
  { q: 'How much does construction cost per square metre in Nairobi?', a: 'Indicatively Ksh 25,000–45,000 per sqm depending on finish level, with renovation from Ksh 5,000–20,000 per sqm. Those are planning figures only — an accurate number needs a site visit and a bill of quantities, which we do free of charge.' },
  { q: 'Do you do free site visits?', a: 'Yes, anywhere in the Nairobi metropolitan area at no cost. Outside the metro we recover travel only, agreed with you in advance.' },
  { q: 'How long does a typical project take?', a: 'A residential home runs roughly 6–10 months, an office fit-out 4–10 weeks, and a supply contract delivers within 3–7 days of order. Your programme is fixed in the proposal before work starts.' },
  { q: 'How do payments work?', a: 'Staged payments against measured progress — typically a mobilisation deposit then milestone draws. We accept M-Pesa and bank transfer, and issue an ETR invoice for every payment.' },
  { q: 'Are you registered and insured?', a: `Yes. ${company.name} is registered ${company.registration} under ${company.registeredUnder}, is NCA compliant, and carries contractor's all-risk and workmen's compensation cover. Certificates are available for tender submissions.` },
  { q: 'Which areas do you cover?', a: 'Nairobi and the wider metro (Kiambu, Kajiado, Machakos) as core territory, with active or completed projects across 12 counties. We take work nationwide where the scope justifies mobilisation.' },
]

export const counties = [
  'Nairobi', 'Kiambu', 'Kajiado', 'Machakos', 'Nakuru', 'Mombasa',
  'Kisumu', 'Nyeri', 'Meru', 'Uasin Gishu', 'Kilifi', 'Murang’a',
]
