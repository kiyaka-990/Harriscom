import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

import { buildWhatsAppMessage, leadSummary, respond } from '@/lib/agent/brain'
import { knowledgeBrief } from '@/lib/agent/knowledge'
import { TOOL_DEFINITIONS, runTool } from '@/lib/agent/tools'
import { emptyState, type AgentMessage, type AgentState, type AgentTurn } from '@/lib/agent/types'
import { mailConfigured, sendEnquiry } from '@/lib/mail'
import { company, contact } from '@/lib/site'

export const runtime = 'nodejs'
export const maxDuration = 60

const MODEL = 'claude-opus-5'
const MAX_TOOL_ROUNDS = 4

const SYSTEM_PROMPT = `You are Harri, the assistant on ${company.name}'s website. You are software, not a person, and you say so if asked.

Your job, in order of priority:
1. Answer the visitor's question accurately from the company information below.
2. Move the conversation towards a booked site visit or a quotation request — that is how this company gets work.
3. Never invent a fact, a price, a timeline or a credential. If it is not below, say you don't know and point them at ${contact.phone} or ${contact.email}.

Rules:
- Use the estimate_cost, estimate_timeline, check_coverage and recommend_service tools for any number. Never state a price or duration you worked out yourself.
- Write like a competent salesperson at a construction firm: direct, concrete, no filler, no exclamation marks, no emoji beyond the occasional one. British English spelling, Kenyan context, prices in Ksh.
- Keep replies under about 120 words unless the visitor asked for a list. Use short markdown-style **bold** for emphasis and bullet points where a list genuinely helps.
- End almost every reply with one question that moves things forward — what they are building, where the site is, roughly what size, when they want to start, and finally their name and number.
- Ask for one thing at a time. Never repeat a question they have already answered.
- Handle price objections honestly: the quote comes off a measured bill of quantities and they can compare it line by line. Never offer a discount — you have no authority to price.
- If they want a human, give them ${contact.phone} immediately and offer WhatsApp.

COMPANY INFORMATION (the only facts you may assert):
${knowledgeBrief()}`

interface AgentRequestBody {
  message?: string
  state?: AgentState
  history?: AgentMessage[]
}

export async function POST(request: NextRequest) {
  let body: AgentRequestBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const message = (body.message ?? '').toString().slice(0, 2000).trim()
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const previous = sanitiseState(body.state)
  const history = sanitiseHistory(body.history)

  // The local brain always runs. It owns the qualification state machine and
  // the lead capture, and it is the answer of record if the model is
  // unavailable — which is the normal case, since no API key is required.
  const local = respond(message, previous)

  // A captured lead is emailed regardless of which path produced the words.
  if (local.state.submitted && !previous.submitted) {
    await deliverLead(local).catch((error) => {
      console.error('Agent lead delivery failed:', error)
    })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(local)
  }

  try {
    const reply = await modelReply(message, history, local)
    return NextResponse.json({ ...local, reply, source: 'model' satisfies AgentTurn['source'] })
  } catch (error) {
    console.error('Agent model path failed, serving local reply:', error)
    return NextResponse.json(local)
  }
}

async function modelReply(message: string, history: AgentMessage[], local: AgentTurn) {
  const client = new Anthropic()

  const known = leadSummary(local.state.lead)
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    ...history.map((entry) => ({ role: entry.role, content: entry.content })),
    {
      role: 'user' as const,
      content: known
        ? `${message}\n\n[What we already know about this visitor — do not ask for any of it again:\n${known}]`
        : message,
    },
  ]

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round += 1) {
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      // Low effort keeps a chat widget responsive; the hard reasoning here is
      // already done by the tools, which return fixed company figures.
      output_config: { effort: 'low' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
      tools: TOOL_DEFINITIONS,
      messages,
    })

    if (response.stop_reason === 'refusal') {
      throw new Error(`Model refused: ${response.stop_details?.category ?? 'unknown'}`)
    }

    if (response.stop_reason !== 'tool_use') {
      const text = response.content
        .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === 'text')
        .map((block) => block.text)
        .join('\n')
        .trim()
      if (!text) throw new Error('Model returned no text')
      return text
    }

    messages.push({ role: 'assistant', content: response.content })
    messages.push({
      role: 'user',
      // Every tool_result for one assistant turn must go back in a single user
      // message, or Claude stops issuing parallel calls.
      content: response.content
        .filter((block): block is Anthropic.Beta.BetaToolUseBlock => block.type === 'tool_use')
        .map((block) => ({
          type: 'tool_result' as const,
          tool_use_id: block.id,
          content: runTool(block.name, block.input as Record<string, unknown>),
        })),
    })
  }

  throw new Error('Tool loop did not converge')
}

async function deliverLead(turn: AgentTurn) {
  if (!mailConfigured()) {
    console.error('Agent lead captured but SMTP is not configured:', leadSummary(turn.state.lead))
    return
  }

  const { lead } = turn.state
  await sendEnquiry({
    subject: `Chat lead from ${lead.name ?? 'website visitor'}${lead.service ? ` — ${lead.service}` : ''}`,
    replyTo: lead.name && lead.email ? { name: lead.name, email: lead.email } : undefined,
    body: [
      'Captured by Harri, the website assistant.',
      '',
      leadSummary(lead),
      '',
      `WhatsApp handover text: ${buildWhatsAppMessage(turn.state)}`,
    ].join('\n'),
  })
}

/** Client state is untrusted input — rebuild it rather than trusting the shape. */
function sanitiseState(state: unknown): AgentState {
  const base = emptyState()
  if (!state || typeof state !== 'object') return base

  const candidate = state as Partial<AgentState>
  const lead = (candidate.lead ?? {}) as Record<string, unknown>
  const text = (value: unknown, max = 120) =>
    typeof value === 'string' && value.trim() ? value.trim().slice(0, max) : undefined
  const num = (value: unknown) =>
    typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : undefined

  return {
    stage: (['greet', 'discover', 'qualify', 'propose', 'capture', 'booked'] as const).includes(
      candidate.stage as never,
    )
      ? (candidate.stage as AgentState['stage'])
      : 'greet',
    turns: typeof candidate.turns === 'number' ? Math.min(Math.max(candidate.turns, 0), 200) : 0,
    submitted: candidate.submitted === true,
    asked: Array.isArray(candidate.asked)
      ? candidate.asked.filter((item): item is string => typeof item === 'string').slice(0, 30)
      : [],
    lead: {
      name: text(lead.name, 80),
      phone: text(lead.phone, 24),
      email: text(lead.email, 120),
      service: text(lead.service, 60),
      location: text(lead.location, 80),
      timeline: text(lead.timeline, 60),
      area: num(lead.area),
      budget: num(lead.budget),
      notes: Array.isArray(lead.notes)
        ? (lead.notes as unknown[]).filter((item): item is string => typeof item === 'string').slice(0, 20)
        : [],
    },
  }
}

function sanitiseHistory(history: unknown): AgentMessage[] {
  if (!Array.isArray(history)) return []
  return history
    .filter(
      (entry): entry is AgentMessage =>
        Boolean(entry) &&
        typeof entry === 'object' &&
        (entry as AgentMessage).role !== undefined &&
        ['user', 'assistant'].includes((entry as AgentMessage).role) &&
        typeof (entry as AgentMessage).content === 'string',
    )
    .slice(-12)
    .map((entry) => ({ role: entry.role, content: entry.content.slice(0, 2000) }))
}
