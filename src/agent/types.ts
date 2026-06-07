export type Classification = "user_error" | "product_bug" | "product_gap";

export type AgentStatus =
  | "idle"
  | "observing"
  | "listening"
  | "speaking"
  | "thinking";

export type HostId = "openai" | "settings";

export interface ConversationMessage {
  id: string;
  role: "agent" | "user" | "system";
  text: string;
  createdAt: number;
}

export interface ScreenObservation {
  id: string;
  host: HostId;
  event: string;
  title: string;
  detail: string;
  timestamp: number;
  metadata?: Record<string, string | number | boolean>;
}

export interface AgentAction {
  id: string;
  label: string;
  kind: "host" | "github" | "feedback";
  payload?: Record<string, unknown>;
}

export interface KnowledgeEvidence {
  title: string;
  excerpt: string;
  source: string;
  /** Page/section locator for the citation, e.g. "§4.2". */
  locator?: string;
}

/**
 * A single step in the agent's working pipeline, surfaced live in the UI so the
 * user (and demo judges) can see *how* Lily reaches an answer:
 *   Minimax reads the screen → Moss retrieves the company's docs → grounded answer.
 * In production `LiveSupportAgent` sets these as it calls each tool.
 */
export interface AgentActivity {
  tool: "minimax" | "moss" | "unsiloed" | string;
  label: string;
}

export interface Detection {
  id: string;
  classification: Classification;
  title: string;
  rationale: string;
  evidence: string[];
  action: AgentAction;
  /** Private sources retrieved for this conclusion, ranked by relevance. */
  knowledge?: KnowledgeEvidence[];
  /** Exact thing Lily saw on screen (Minimax), used to ground the answer. */
  observed?: string;
}

export interface ActionResult {
  ok: boolean;
  message: string;
  artifact?: {
    label: string;
    url?: string;
  };
}

export interface AgentState {
  status: AgentStatus;
  connected: boolean;
  attention: boolean;
  messages: ConversationMessage[];
  observation: ScreenObservation | null;
  detection: Detection | null;
  actionResult: ActionResult | null;
  /** Current working step (screen read / doc retrieval) shown while thinking. */
  activity: AgentActivity | null;
}

export interface SupportAgentClient {
  getState(): AgentState;
  subscribe(listener: (state: AgentState) => void): () => void;
  start(): void;
  stop(): void;
  setListening(listening: boolean): void;
  executeAction(): Promise<ActionResult>;
  dismissDetection(): void;
  clearAttention(): void;
  sendManualPrompt(text: string): void;
}

export interface ScriptedScenario {
  id: string;
  host: HostId;
  triggerEvent: string;
  userMessage: string;
  agentMessage: string;
  knowledgeQuery?: string;
  detection: Detection;
}

export const LILY_GREETING =
  "Hi, I'm Lily. Just tell me what's going wrong — I can see your screen and I've read your team's docs.";
