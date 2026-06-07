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
}

export interface Detection {
  id: string;
  classification: Classification;
  title: string;
  rationale: string;
  evidence: string[];
  action: AgentAction;
  knowledge?: KnowledgeEvidence;
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
