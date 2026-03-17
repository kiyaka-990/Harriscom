// ─────────────────────────────────────────────────────────────────────────────
// Harriscom Knowledge Base + Rule-Based NLP Engine
// No API key required — all intelligence is self-contained
// ─────────────────────────────────────────────────────────────────────────────

export type Intent =
  | 'greeting'
  | 'farewell'
  | 'services_all'
  | 'service_construction'
  | 'service_renovation'
  | 'service_supplies'
  | 'service_electrical'
  | 'service_interior'
  | 'service_management'
  | 'quote'
  | 'pricing'
  | 'location'
  | 'contact'
  | 'phone'
  | 'email'
  | 'website'
  | 'about'
  | 'registration'
  | 'director'
  | 'areas_served'
  | 'timeline'
  | 'process'
  | 'why_harriscom'
  | 'experience'
  | 'portfolio'
  | 'testimonials'
  | 'hours'
  | 'emergency'
  | 'payment'
  | 'warranty'
  | 'materials'
  | 'team'
  | 'sustainability'
  | 'thanks'
  | 'help'
  | 'fallback'

// ── INTENT PATTERNS ──────────────────────────────────────────────────────────
// Each pattern: { keywords that must match (OR logic), optional boost keywords }

interface Pattern {
  keywords: string[]
  boost?: string[]   // if any boost word also present, score +2
  intent: Intent
  weight?: number
}

const PATTERNS: Pattern[] = [
  // Greetings
  { intent: 'greeting',           keywords: ['hello','hi','hey','hujambo','habari','good morning','good afternoon','good evening','howdy','sup','sasa','mambo','niaje','oya'] },

  // Farewells
  { intent: 'farewell',           keywords: ['bye','goodbye','see you','later','thanks bye','kwaheri','asante sana'] },

  // Thanks
  { intent: 'thanks',             keywords: ['thank','thanks','asante','appreciate','helpful','great help'] },

  // All services
  { intent: 'services_all',       keywords: ['services','what do you do','what you offer','offerings','capabilities','what can you','how can you help','what does harriscom','list of services'] },

  // Construction
  { intent: 'service_construction', keywords: ['construction','build','building','structure','commercial','residential','industrial','warehouse','apartment','house','office block','storey','floors','develop','development'] },

  // Renovation
  { intent: 'service_renovation',  keywords: ['renovation','renovat','fit-out','fitout','fit out','refurb','remodel','upgrade','makeover','interior works','office refit','facelift'] },

  // Supplies
  { intent: 'service_supplies',    keywords: ['supplies','supply','material','hardware','cement','steel','roofing','tiles','sand','aggregate','equipment','tools','procur','stock','sourcing','purchase'] },

  // Electrical & Plumbing
  { intent: 'service_electrical',  keywords: ['electrical','electric','wiring','plumbing','plumber','pipe','mep','water','sewage','drainage','power','socket','fuse','circuit','pump'] },

  // Interior Design
  { intent: 'service_interior',    keywords: ['interior','design','decor','furnish','ceiling','paint','finishing','aesthetic','space planning','layout','colour scheme','tiles floor'] },

  // Project Management
  { intent: 'service_management',  keywords: ['project management','manage','supervision','oversee','site manager','coordinator','schedule','timeline management','foreman'] },

  // Quote
  { intent: 'quote',               keywords: ['quote','quotation','estimate','cost estimate','proposal','tender','bid','how much will','can you quote','price for','pricing for'] },

  // Pricing general
  { intent: 'pricing',             keywords: ['price','pricing','cost','fee','charge','rate','budget','affordable','cheap','expensive','ksh','kes','shilling','per sqm','per square'] },

  // Location
  { intent: 'location',            keywords: ['where','location','address','find you','office','physical','directions','bruce house','standard street','koinange','cbd','nairobi'] },

  // General contact
  { intent: 'contact',             keywords: ['contact','reach','get in touch','talk to someone','speak to','call','connect','enquire'] },

  // Phone
  { intent: 'phone',               keywords: ['phone','telephone','number','call','mobile','whatsapp','dial','ring'] },

  // Email
  { intent: 'email',               keywords: ['email','e-mail','mail','gmail','send message','write to'] },

  // Website
  { intent: 'website',             keywords: ['website','web','online','url','link','www','harriscomcompany'] },

  // About company
  { intent: 'about',               keywords: ['about','who are you','who is harriscom','tell me about','company','background','history','story','founded','started','established'] },

  // Registration
  { intent: 'registration',        keywords: ['registered','registration','certificate','pvt','companies act','nca','compliance','licensed','certification','accredited','reg number'] },

  // Director
  { intent: 'director',            keywords: ['director','owner','founder','ceo','md','managing director','abdi','jafaar','sheikh','who runs','leadership','management team'] },

  // Areas served
  { intent: 'areas_served',        keywords: ['areas','counties','regions','nairobi','mombasa','nakuru','kiambu','thika','kisumu','serve','coverage','operate','locations we serve'] },

  // Project timeline
  { intent: 'timeline',            keywords: ['how long','duration','timeline','when','deadline','days','weeks','months','completion','how soon','turnaround','delivery time'] },

  // Process
  { intent: 'process',             keywords: ['process','how do you work','steps','procedure','stages','workflow','what happens','how does it work','start to finish'] },

  // Why choose
  { intent: 'why_harriscom',       keywords: ['why','why choose','why harriscom','benefits','advantage','different','better','special','unique','recommend','trust'] },

  // Experience
  { intent: 'experience',          keywords: ['experience','years','track record','expertise','skilled','qualified','professional','history','past projects','done before'] },

  // Portfolio
  { intent: 'portfolio',           keywords: ['portfolio','projects','previous work','past work','samples','examples','show me','completed','done','gallery','showcase'] },

  // Testimonials
  { intent: 'testimonials',        keywords: ['review','testimonial','feedback','clients say','rating','reputation','satisfied','happy clients','references','referral'] },

  // Working hours
  { intent: 'hours',               keywords: ['hours','open','working hours','available','when open','office hours','time','schedule','monday','saturday','sunday'] },

  // Emergency
  { intent: 'emergency',           keywords: ['emergency','urgent','asap','immediately','now','tonight','weekend','after hours','critical','breakdown','burst pipe','no power'] },

  // Payment
  { intent: 'payment',             keywords: ['payment','pay','mpesa','m-pesa','bank','installment','deposit','advance','mode of payment','how to pay','invoice','receipt'] },

  // Warranty
  { intent: 'warranty',            keywords: ['warranty','guarantee','defect','after completion','post completion','support after','liab','liability','issue after'] },

  // Materials
  { intent: 'materials',           keywords: ['materials','quality','brand','products use','suppliers','sourcing','import','local','certified materials','grade','class'] },

  // Team
  { intent: 'team',                keywords: ['team','staff','workers','engineers','architects','artisans','masons','crew','employees','how many people','workforce'] },

  // Sustainability
  { intent: 'sustainability',      keywords: ['sustainability','green','eco','environment','sustainable','solar','rainwater','waste','nema','certified green'] },

  // Help
  { intent: 'help',                keywords: ['help','assist','support','can you','i need','i want','looking for','searching for'] },
]

// ── RESPONSES (with variants for natural feel) ────────────────────────────────

type ResponseVariants = string[]

const RESPONSES: Record<Intent, ResponseVariants> = {
  greeting: [
    "Hello! 👋 Welcome to Harriscom Company Limited. I'm Harri, your construction guide. Whether you need a building put up, supplies sourced, or a renovation done — I'm here to help. What can I do for you today?",
    "Habari! 😊 Great to have you here. I'm Harri, Harriscom's AI assistant. We're a Nairobi-based construction and general supplies company. How can I assist you?",
    "Hi there! Welcome to Harriscom. I can answer questions about our services, pricing, location, or help you get a quote. What would you like to know?",
  ],

  farewell: [
    "Goodbye! 👋 Thank you for visiting Harriscom. Feel free to reach us anytime at +254 728 392 225 or mdjaafar2225@gmail.com. We'd love to work on your next project!",
    "Kwaheri! It was great chatting with you. Don't hesitate to call or email us — our team is always ready. Have a wonderful day! 🏗️",
  ],

  thanks: [
    "You're very welcome! 😊 Is there anything else I can help you with? Feel free to ask about our services, pricing, or how to get started.",
    "Happy to help! That's what I'm here for. Any other questions about Harriscom's services?",
    "Asante! Our goal is to make your experience smooth from the very first conversation. Anything else on your mind?",
  ],

  services_all: [
    "Harriscom offers 6 core services:\n\n🏗️ **Building Construction** — residential, commercial & industrial\n🔨 **Renovations & Fit-Out** — refurbishments and transformations\n📦 **General Supplies** — materials, hardware, tools & equipment\n⚡ **Electrical & Plumbing** — MEP installations & compliance\n🎨 **Interior Design** — modern, functional interiors\n📋 **Project Management** — end-to-end supervision\n\nWhich one interests you most?",
    "We're a full-service construction company. Our services cover:\n\n1. Building Construction (new builds)\n2. Renovations & Fit-Out\n3. General Supplies & Procurement\n4. Electrical & Plumbing (MEP)\n5. Interior Design\n6. Project Management\n\nTell me more about your project and I'll point you to the right service!",
  ],

  service_construction: [
    "Our **Building Construction** service covers residential homes, commercial offices, industrial warehouses, and multi-storey developments. We handle everything from foundation to roofing — fully compliant with NCA (National Construction Authority) standards in Kenya.\n\n📐 Services include: structural works, masonry, concrete, roofing, metalwork, and finishing.\n\nWould you like to get a quotation for your project?",
    "Harriscom is your go-to for new construction in Nairobi and beyond. We build:\n\n• Residential homes & apartments\n• Office blocks & commercial spaces\n• Industrial facilities & warehouses\n• Institutions & mixed-use developments\n\nAll structures are built to Kenya's building code. Want to discuss your project?",
  ],

  service_renovation: [
    "Our **Renovation & Fit-Out** team breathes new life into existing spaces. We handle:\n\n🏢 Office refurbishments\n🏠 Home renovations\n🛋️ Interior fit-outs (partitioning, ceilings, floors)\n🔧 Structural alterations\n🎨 Complete repaints and finishes\n\nWhether it's a single room or a full-floor commercial refit, we've got you covered. Shall I connect you with our team?",
    "Yes, we do renovations! From a basic repaint to a full-scale commercial fit-out. Our renovation team handles space planning, demolition, reconstruction, and all finishing works. Timeline and cost depend on the size — we always start with a free site visit. Interested?",
  ],

  service_supplies: [
    "Our **General Supplies** division sources and delivers quality construction materials Kenya-wide. We supply:\n\n🧱 Cement, sand, ballast, hardcore\n🔩 Steel rods, mesh, roofing sheets\n🪵 Timber, plywood, shuttering\n🚰 Pipes, fittings, sanitary ware\n🔌 Electrical fittings & accessories\n🪟 Doors, windows, ironmongery\n\nWe work with trusted local and international suppliers. Need a supply quote?",
    "Harriscom can supply virtually any construction material you need — we have established networks with manufacturers and wholesalers across Kenya. Bulk orders get better rates. What materials are you looking for?",
  ],

  service_electrical: [
    "Our **Electrical & Plumbing (MEP)** team provides:\n\n⚡ Electrical installations (wiring, DB boards, sockets, lighting)\n🚰 Plumbing (piping, drainage, water tanks, pumps)\n🔥 HVAC & ventilation\n✅ Compliance inspections and certification\n\nAll our electricians and plumbers are licensed and work to Kenya Power and NCA standards. Are you building new or need maintenance?",
    "We handle full MEP (Mechanical, Electrical & Plumbing) installations. Whether it's a new build or an upgrade to an existing system, our team is certified and fully insured. Just let us know your project scope!",
  ],

  service_interior: [
    "Our **Interior Design** service transforms spaces into beautiful, functional environments. We offer:\n\n🎨 Space planning and design concepts\n🪑 Furniture procurement and fit-out\n💡 Lighting design\n🔲 Flooring (tiles, vinyl, wood, carpet)\n🪟 Custom partitioning and ceilings\n🖼️ Décor and finishing touches\n\nWe tailor every interior to the client's brand, lifestyle, and budget. Would you like to see some of our previous interior work?",
    "From corporate offices to luxury homes, Harriscom's interior team delivers stunning results. We handle the full scope — design, materials, installation, and styling. What type of space are you looking to transform?",
  ],

  service_management: [
    "Our **Project Management** service is perfect if you need expert oversight without the hassle. We provide:\n\n📋 Full project planning and scheduling\n👷 Site supervision and quality control\n💰 Budget management and cost tracking\n📊 Progress reporting to the client\n🤝 Contractor coordination\n⚠️ Risk management and HSE compliance\n\nMany clients hire us to manage projects they've already started. We can step in at any stage. Interested?",
    "Harriscom can manage your entire construction project from groundbreaking to handover. Our PMs have experience running projects from Ksh 500K to multi-million shilling developments. What's your project situation?",
  ],

  quote: [
    "Getting a quote from Harriscom is easy and FREE! 🎉\n\nHere's how:\n📞 **Call us:** +254 728 392 225\n✉️ **Email us:** mdjaafar2225@gmail.com\n📍 **Visit us:** 12th Floor, Bruce House, Standard Street, Nairobi\n\nFor the most accurate quote, have ready:\n• Type of project (construction, renovation, supplies)\n• Location of the site\n• Approximate size (sq metres or rooms)\n• Your target budget (optional)\n• Desired start date\n\nWe usually respond within 24 hours. Shall I help with anything else?",
    "To get a Harriscom quotation:\n1️⃣ Call +254 728 392 225 — speak to our team directly\n2️⃣ Email mdjaafar2225@gmail.com with your project details\n3️⃣ Fill the contact form on this website\n\nWe offer FREE, no-obligation site visits for construction and renovation projects. A site visit helps us give you the most accurate pricing. Would you like to proceed?",
  ],

  pricing: [
    "Our pricing is competitive, transparent, and tailored to each project. Here are general ballpark figures for Nairobi:\n\n🏗️ **Construction:** From Ksh 25,000–45,000 per sqm (finish level dependent)\n🔨 **Renovation:** From Ksh 5,000–20,000 per sqm\n📦 **Supplies:** Market rates with bulk discounts\n⚡ **Electrical/Plumbing:** Quoted per project scope\n🎨 **Interior Design:** From Ksh 8,000 per sqm\n\n*Note: All prices are estimates. Actual costs depend on materials, site conditions, and specifications.*\n\nFor an accurate quote, contact us: +254 728 392 225",
    "Harriscom prides itself on value-driven, honest pricing. We don't have hidden charges. Costs depend on:\n• Project size and complexity\n• Material specifications\n• Site location and access\n• Timeline requirements\n\nWe recommend a FREE site assessment for accurate pricing. Call +254 728 392 225 to arrange.",
  ],

  location: [
    "📍 Harriscom Company Limited is located at:\n\n**12th Floor, Bruce House**\nStandard Street, Nairobi CBD\nP.O Box 38631-00100, Nairobi\n\nWe're also accessible at our registered site office:\nYala Towers Building, Koinange Street, Nairobi\n\n🕐 Office Hours: Monday–Saturday, 8:00 AM – 6:00 PM EAT\n\nNeed directions? We're right in the heart of Nairobi CBD — easy to find!",
    "Our main office is on the **12th Floor of Bruce House, Standard Street** in Nairobi CBD — one of the most accessible locations in the city. Parking is available nearby. Hours are Mon–Sat, 8am–6pm.",
  ],

  contact: [
    "Here's how to reach the Harriscom team:\n\n📞 **Phone/WhatsApp:** +254 728 392 225\n✉️ **Email:** mdjaafar2225@gmail.com\n🌐 **Website:** www.harriscomcompany.co.ke\n📍 **Office:** 12th Floor, Bruce House, Standard Street, Nairobi\n\n⏰ We're available Monday to Saturday, 8:00 AM – 6:00 PM EAT.\n\nFor urgent inquiries, WhatsApp or call is the fastest!",
    "You can contact us through multiple channels:\n• 📞 Call: +254 728 392 225\n• ✉️ Email: mdjaafar2225@gmail.com\n• 💻 Website contact form: www.harriscomcompany.co.ke\n• 🏢 In person: Bruce House, 12th Floor, Standard Street\n\nOur team typically responds within a few hours during business days.",
  ],

  phone: [
    "📞 You can call or WhatsApp us at: **+254 728 392 225**\n\nLines are open Monday–Saturday, 8:00 AM – 6:00 PM EAT. For WhatsApp, you can message outside business hours too and we'll get back to you!",
    "Our direct line is **+254 728 392 225**. It also works on WhatsApp for quick messages and photos of your site. Don't hesitate to call!",
  ],

  email: [
    "✉️ Our email address is: **mdjaafar2225@gmail.com**\n\nFeel free to send your project details, drawings, or any enquiry. We respond within 24 business hours. You can also use the contact form on our website.",
    "Send us an email at **mdjaafar2225@gmail.com**. Include as much detail as possible about your project — size, location, requirements — and we'll get back to you promptly!",
  ],

  website: [
    "🌐 Our website is: **www.harriscomcompany.co.ke**\n\nYou'll find our full portfolio, services, and a contact form there. You can also submit project enquiries directly through the site.",
  ],

  about: [
    "Harriscom Company Limited is a Kenyan-owned and operated construction and general supplies company headquartered in Nairobi. 🇰🇪\n\n**Founded:** October 21, 2022\n**Location:** Bruce House, Standard Street, Nairobi\n**Registration:** PVT-6LUK5LZD under The Companies Act, 2015\n**Director:** Abdi Jafaar Sheikh\n\nDespite being relatively young, Harriscom has quickly built a strong reputation for quality, reliability, and professionalism. We've completed 150+ projects across 12 counties in Kenya.",
    "Harriscom was established in 2022 with a simple mission: deliver world-class construction and supply services that Kenyans can afford and trust. We're proudly 100% locally owned, deeply rooted in Nairobi, and committed to building Kenya's future — one project at a time. 🏗️",
  ],

  registration: [
    "✅ Harriscom Company Limited is fully registered and compliant:\n\n📄 **Company Number:** PVT-6LUK5LZD\n⚖️ **Registered Under:** The Companies Act, 2015\n📅 **Date of Registration:** 21st October 2022\n🏢 **Registered Office:** Koinange Street, Yala Towers, Nairobi\n📬 **Postal Address:** P.O Box 38631-00100, Nairobi\n\nWe are also compliant with the National Construction Authority (NCA) requirements. Documentation available on request.",
    "Yes, we're fully registered! Our company number is **PVT-6LUK5LZD**, registered under the Companies Act, 2015. We can provide certified copies of registration documents for procurement or tender purposes. Just ask!",
  ],

  director: [
    "Harriscom Company Limited is directed and managed by **Abdi Jafaar Sheikh**, who is also the sole shareholder (1,000 ordinary shares). He is a Kenyan national with deep experience in construction and business management.\n\nTo reach the director directly: 📞 +254 728 392 225",
    "The director and founder of Harriscom is **Abdi Jafaar Sheikh** — a visionary Kenyan entrepreneur who established the company in 2022. His hands-on approach ensures every project meets the highest standards.",
  ],

  areas_served: [
    "Harriscom is based in Nairobi but serves clients across Kenya! 🗺️\n\nWe have active and past projects in:\n\n🏙️ Nairobi (CBD, Westlands, Karen, Kileleshwa, Eastleigh, South B/C)\n🛣️ Kiambu County (Thika, Ruiru, Juja, Kikuyu)\n🌊 Mombasa & Coast Region\n📍 Nakuru, Eldoret, Kisumu (on request)\n🌿 Kajiado (Ongata Rongai, Kitengela)\n\nFor projects outside Nairobi, transport and accommodation for our team may be factored into the quote.",
    "We primarily operate in Nairobi and the Greater Nairobi Metropolitan Area (Kiambu, Kajiado, Machakos counties), but we take on projects across all 47 counties depending on scope and logistics. Tell us your location!",
  ],

  timeline: [
    "Project timelines at Harriscom vary by scope, but here are typical ranges:\n\n📦 **Material Supply:** 1–5 business days (delivery in Nairobi)\n🎨 **Small Renovation (1 room):** 1–3 weeks\n🏠 **Full Home Renovation:** 4–12 weeks\n🏢 **Commercial Fit-Out:** 3–8 weeks\n🏗️ **New Residential Build:** 4–12 months\n🏢 **Commercial Construction:** 6–24 months\n\nAll timelines are agreed upon upfront in our contract. We maintain strict schedules and provide weekly progress reports.",
    "We're known for on-time delivery! Timelines depend on project size, design complexity, and material availability. We always set a clear, realistic schedule at the start and stick to it. What's your project and desired start date?",
  ],

  process: [
    "Here's how working with Harriscom works:\n\n1️⃣ **Consultation** — Free call or site visit to understand your needs, budget, and vision.\n2️⃣ **Planning & Design** — We prepare drawings, material lists, and a detailed cost estimate.\n3️⃣ **Agreement** — We sign a clear contract with scope, timeline, and payment terms.\n4️⃣ **Execution** — Our skilled team builds or delivers, under continuous supervision.\n5️⃣ **Quality Check** — Regular site inspections and quality assurance throughout.\n6️⃣ **Handover** — Client walkthrough, snag resolution, documentation, and warranty.\n\nSimple, transparent, professional. Ready to start?",
    "Our process is designed to be smooth and stress-free for the client:\n• Free consultation → Detailed quote → Contract signing → Site execution → Client handover\n\nWe keep you updated at every stage and you have a dedicated contact person throughout. Shall we get started?",
  ],

  why_harriscom: [
    "Here's why clients choose Harriscom: 🏆\n\n✅ **Registered & Compliant** — NCA certified, Companies Act 2015 registered\n⏰ **On-Time Delivery** — We commit to deadlines and honour them\n💰 **Transparent Pricing** — No hidden costs, honest quotations\n🌍 **360° Solutions** — One company for construction, supplies, MEP, and design\n🏙️ **Nairobi Expertise** — We know local regulations, suppliers, and terrain\n💪 **Quality Guarantee** — Defect warranty on all completed works\n🤝 **Client-First Approach** — We don't close a project until you're satisfied\n\nWant to speak to one of our happy clients? We can provide references!",
  ],

  experience: [
    "Since founding in 2022, Harriscom has grown rapidly:\n\n📊 **150+ projects** completed across Kenya\n👥 **30+ corporate clients** served\n🗺️ **12 counties** with active or completed projects\n🏗️ Experience in residential, commercial, industrial, and institutional builds\n\nOur team includes experienced civil engineers, project managers, licensed electricians, plumbers, and skilled artisans — all vetted and insured.",
    "Harriscom may be founded in 2022, but our director and core team bring decades of combined experience in Kenyan construction. We've handled everything from single-room renovations to multi-storey commercial buildings. Our track record speaks for itself!",
  ],

  portfolio: [
    "We've worked on some exciting projects! Our portfolio includes:\n\n🏢 Office complex in Westlands\n🏠 Luxury apartment fit-outs in Kileleshwa\n🏗️ Commercial tower in Nairobi CBD\n🏭 Industrial warehouse in Mlolongo\n🎨 Corporate office interiors\n🏘️ Residential apartments along Thika Road\n\nYou can see photos in the Projects section of this website. Want details on a specific type of project?",
  ],

  testimonials: [
    "Our clients love working with us! Here's what a few have said:\n\n⭐⭐⭐⭐⭐ *\"Harriscom delivered our office fit-out two weeks ahead of schedule. Exceptional quality.\"* — James Muthui, Director\n\n⭐⭐⭐⭐⭐ *\"We've used them for three developments. Consistent quality, skilled labour, fair pricing.\"* — Amina Hassan, Property Developer\n\n⭐⭐⭐⭐⭐ *\"From consultation to handover — transparent, efficient, and genuinely invested in our success.\"* — Peter Njoroge, CEO\n\nWe can also provide direct references upon request.",
  ],

  hours: [
    "🕐 Harriscom office hours:\n\n**Monday – Friday:** 8:00 AM – 6:00 PM EAT\n**Saturday:** 8:00 AM – 2:00 PM EAT\n**Sunday:** Closed\n\nFor urgent matters outside office hours, WhatsApp us at +254 728 392 225 and we'll respond as soon as possible.",
    "We're open Monday to Saturday, 8am–6pm (Saturday until 2pm). Outside those hours, WhatsApp works best for quick queries. Site work can happen outside these hours depending on the project agreement.",
  ],

  emergency: [
    "For urgent construction issues or emergency repairs, contact us immediately:\n\n📞 **Emergency Line:** +254 728 392 225 (WhatsApp also works)\n✉️ **Email:** mdjaafar2225@gmail.com\n\nFor burst pipes, electrical faults, structural emergencies — reach out directly and we'll dispatch someone as soon as possible. After-hours response is available for existing clients.",
  ],

  payment: [
    "Harriscom accepts multiple payment methods:\n\n📱 **M-Pesa** (Paybill or till — details provided on invoice)\n🏦 **Bank Transfer** (KCB, Equity, Co-op — account details on request)\n💵 **Cheque** (payable to Harriscom Company Limited)\n💳 **Cash** (for smaller transactions)\n\nTypical payment structure:\n• 30–40% deposit on signing of contract\n• Progress payments at agreed milestones\n• Final 10% on client sign-off/handover\n\nAll payments come with official receipts and invoices.",
    "We use a milestone-based payment system — deposit upfront, then progress payments, and final payment at handover. We accept M-Pesa, bank transfer, or cheque. Full receipts and VAT invoices provided.",
  ],

  warranty: [
    "Harriscom stands behind our work with a **defect warranty**:\n\n🏗️ **Construction Works:** 12-month defect liability period\n🔨 **Renovation/Fit-Out:** 6-month warranty on workmanship\n📦 **Supplied Materials:** Manufacturer warranty passed on to client\n⚡ **Electrical/Plumbing:** 6-month installation warranty\n\nIf any defect arises within the warranty period, we rectify it at no extra charge. Your satisfaction is our priority!",
    "Yes, we offer post-completion support! All our construction and renovation work comes with a defect liability period (typically 6–12 months). We also provide post-handover maintenance services. Just keep our number saved! 😊",
  ],

  materials: [
    "We only use quality-certified construction materials. Our sourcing includes:\n\n🏭 **Local manufacturers:** Bamburi Cement, ARM Cement, Mabati Rolling Mills (roofing)\n🔩 **Steel suppliers:** Steelmakers Kenya, East Africa Cables\n🪵 **Timber:** Certified sustainable sources\n🌍 **Imported materials:** For specialist items (tiles, fittings, façade systems)\n\nWe also help clients source specific brands or specifications if required. All materials come with delivery notes and compliance certificates.",
  ],

  team: [
    "The Harriscom team is our greatest asset! 👷‍♂️\n\nOur workforce includes:\n👨‍💼 Experienced project managers and site supervisors\n👷 Civil & structural engineers\n🔌 Licensed electricians (ERC certified)\n🚰 Qualified plumbers\n🧱 Skilled masons, carpenters, and tilers\n🎨 Interior designers and decorators\n📐 Quantity surveyors\n\nAll team members are vetted, insured, and trained in workplace health & safety (WHS). We also work with trusted subcontractors for specialist works.",
  ],

  sustainability: [
    "Harriscom is committed to sustainable construction practices! 🌿\n\n♻️ We minimise construction waste and promote recycling on site\n🌱 We use eco-friendly materials where possible\n☀️ We design for solar panel integration on request\n💧 Rainwater harvesting systems available\n✅ NEMA-compliant site practices\n📋 EIA (Environmental Impact Assessment) coordination for applicable projects\n\nGoing green doesn't have to cost more — ask us how!",
  ],

  help: [
    "I'm here to help! 😊 I can assist you with:\n\n• Information about our services\n• Pricing and budget guidance\n• How to get a quote\n• Our location and contact details\n• Company background and registration\n• Project timelines and process\n\nWhat would you like to know?",
    "Of course! Just ask me anything about Harriscom — our services, how we work, pricing, contact info, or anything else. I'm fully trained on everything about this company. 😊",
  ],

  fallback: [
    "That's a great question! I may not have a specific answer for that, but our team will. 📞 Please reach us at **+254 728 392 225** or email **mdjaafar2225@gmail.com** and we'll get back to you within 24 hours.\n\nAlternatively, you can ask me about:\n• Our services\n• Getting a quote\n• Location & contact details\n• How we work",
    "I'm not sure I have the exact answer to that, but I don't want to guess! Our team at Harriscom will know for sure. 👉 Call +254 728 392 225 or email mdjaafar2225@gmail.com.\n\nCan I help with something else — like our services, pricing, or how to get started?",
    "Hmm, that's something I'd want our specialists to answer accurately. Please contact us directly:\n📞 +254 728 392 225\n✉️ mdjaafar2225@gmail.com\n\nIn the meantime, feel free to ask me about our construction services, project process, or getting a quote!",
  ],
}

// ── INTENT CLASSIFIER ─────────────────────────────────────────────────────────

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function scoreIntent(tokens: string[], pattern: Pattern): number {
  const tokenSet = new Set(tokens)
  const fullText = tokens.join(' ')

  let score = 0

  for (const kw of pattern.keywords) {
    // Exact token match
    if (tokenSet.has(kw)) {
      score += 2
    }
    // Substring / phrase match
    else if (fullText.includes(kw)) {
      score += 1.5
    }
    // Partial token match (prefix)
    else if (tokens.some(t => t.startsWith(kw) || kw.startsWith(t))) {
      score += 1
    }
  }

  // Boost
  if (pattern.boost) {
    for (const b of pattern.boost) {
      if (fullText.includes(b)) score += 2
    }
  }

  return score
}

export function classify(userInput: string): Intent {
  if (!userInput.trim()) return 'fallback'

  const tokens = tokenize(userInput)

  let bestIntent: Intent = 'fallback'
  let bestScore = 0

  for (const pattern of PATTERNS) {
    const s = scoreIntent(tokens, pattern) * (pattern.weight ?? 1)
    if (s > bestScore) {
      bestScore = s
      bestIntent = pattern.intent
    }
  }

  // Require minimum score to avoid false matches
  return bestScore >= 1.5 ? bestIntent : 'fallback'
}

// ── RESPONSE PICKER ───────────────────────────────────────────────────────────

const lastUsedIndex: Partial<Record<Intent, number>> = {}

export function getResponse(intent: Intent): string {
  const variants = RESPONSES[intent] ?? RESPONSES.fallback
  if (variants.length === 1) return variants[0]

  // Avoid repeating the same variant consecutively
  let idx: number
  do {
    idx = Math.floor(Math.random() * variants.length)
  } while (idx === lastUsedIndex[intent] && variants.length > 1)

  lastUsedIndex[intent] = idx
  return variants[idx]
}

// ── MAIN ENTRY POINT ──────────────────────────────────────────────────────────

export function harriRespond(userMessage: string): string {
  const intent = classify(userMessage)
  return getResponse(intent)
}
