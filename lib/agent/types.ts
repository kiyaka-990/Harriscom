export interface Lead {
  name?: string
  phone?: string
  email?: string
  /** Service slug from lib/site.ts. */
  service?: string
  location?: string
  /** Floor area in square metres, when the visitor gave one. */
  area?: number
  /** Budget in Kenyan shillings. */
  budget?: number
  timeline?: string
  notes: string[]
}

export type Stage = 'greet' | 'discover' | 'qualify' | 'propose' | 'capture' | 'booked'

export interface AgentState {
  stage: Stage
  lead: Lead
  /** Slots we have already asked about, so Harri never asks twice. */
  asked: string[]
  turns: number
  submitted: boolean
}

export type AgentAction =
  | { type: 'whatsapp'; label: string; message: string }
  | { type: 'call'; label: string }
  | { type: 'link'; label: string; href: string }

export interface AgentTurn {
  reply: string
  quickReplies: string[]
  actions: AgentAction[]
  state: AgentState
  /** Which path produced the answer, surfaced in the UI for transparency. */
  source: 'local' | 'model'
}

export interface AgentMessage {
  role: 'user' | 'assistant'
  content: string
}

export function emptyState(): AgentState {
  return {
    stage: 'greet',
    lead: { notes: [] },
    asked: [],
    turns: 0,
    submitted: false,
  }
}
