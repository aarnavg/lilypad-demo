import { createGitHubIssue, searchDocs, submitFeedback } from "../data/mockApi";
import { hostBus } from "../host/hostBus";
import { findOpenAIScenario } from "../scenarios/openai";
import { findSettingsScenario } from "../scenarios/settings";
import {
  LILY_GREETING,
  type ActionResult,
  type AgentState,
  type ConversationMessage,
  type ScreenObservation,
  type ScriptedScenario,
  type SupportAgentClient,
} from "./types";

const initialState: AgentState = {
  status: "idle",
  connected: true,
  attention: false,
  messages: [
    {
      id: "welcome",
      role: "agent",
      text: LILY_GREETING,
      createdAt: Date.now(),
    },
  ],
  observation: null,
  detection: null,
  actionResult: null,
  activity: null,
};

export class MockSupportAgent implements SupportAgentClient {
  private state: AgentState = initialState;
  private listeners = new Set<(state: AgentState) => void>();
  private unsubscribeHost?: () => void;
  private timers = new Set<number>();
  private handledObservationId?: string;

  getState() {
    return this.state;
  }

  subscribe(listener: (state: AgentState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  start() {
    if (this.unsubscribeHost) return;
    this.unsubscribeHost = hostBus.subscribe((observation) => {
      void this.handleObservation(observation);
    });
    this.patch({ status: "observing", connected: true });
  }

  stop() {
    this.unsubscribeHost?.();
    this.unsubscribeHost = undefined;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();
    this.patch({ status: "idle" });
  }

  setListening(listening: boolean) {
    this.patch({ status: listening ? "listening" : "observing" });
  }

  async executeAction() {
    const action = this.state.detection?.action;
    if (!action) {
      return { ok: false, message: "There is no suggested action yet." };
    }

    this.patch({ status: "thinking", actionResult: null });
    let result: ActionResult;

    if (action.kind === "host") {
      result = await hostBus.runAction(action.id, action.payload);
    } else if (action.kind === "github") {
      const title =
        typeof action.payload?.title === "string"
          ? action.payload.title
          : undefined;
      const issue = await createGitHubIssue(title);
      result = {
        ok: true,
        message: `Filed issue #${issue.number} with req_91c2e8, sanitized scopes, us-west, and the auth v2.3.1 rollout evidence.`,
        artifact: { label: `Issue #${issue.number}`, url: issue.url },
      };
    } else {
      const feedback = await submitFeedback();
      const hostActionId =
        typeof action.payload?.hostActionId === "string"
          ? action.payload.hostActionId
          : undefined;
      const hostResult = hostActionId
        ? await hostBus.runAction(hostActionId, action.payload)
        : undefined;
      result = {
        ok: hostResult?.ok ?? true,
        message: hostResult
          ? `Logged ${feedback.id}. ${hostResult.message}`
          : `Logged ${feedback.id} to the ${feedback.route}.`,
        artifact: {
          label: hostResult
            ? `${feedback.id} + workaround`
            : `${feedback.id} logged`,
        },
      };
    }

    this.patch({
      status: "observing",
      actionResult: result,
      messages: [
        ...this.state.messages,
        this.message(
          "agent",
          result.ok ? result.message : `I could not finish that: ${result.message}`,
        ),
      ],
    });
    return result;
  }

  dismissDetection() {
    this.patch({ detection: null, actionResult: null, attention: false });
  }

  clearAttention() {
    if (this.state.attention) this.patch({ attention: false });
  }

  sendManualPrompt(text: string) {
    const cleanText = text.trim();
    if (!cleanText) return;

    this.patch({
      status: "speaking",
      messages: [
        ...this.state.messages,
        this.message("user", cleanText),
        this.message(
          "agent",
          "I am watching the current screen. Try the task in the app and I will classify what happens.",
        ),
      ],
    });
    this.schedule(() => this.patch({ status: "observing" }), 900);
  }

  private async handleObservation(observation: ScreenObservation) {
    if (observation.id === this.handledObservationId) return;
    const scenario = this.findScenario(observation);
    if (!scenario) return;
    this.handledObservationId = observation.id;
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers.clear();

    // Step 1 — Minimax reads the screen.
    this.patch({
      status: "thinking",
      attention: true,
      observation,
      detection: null,
      actionResult: null,
      activity: { tool: "minimax", label: "Reading your screen" },
      messages: [
        ...this.state.messages,
        this.message("user", scenario.userMessage),
      ],
    });

    const knowledge = scenario.knowledgeQuery
      ? await searchDocs(scenario.knowledgeQuery)
      : [];

    // Step 2 — Moss retrieves the company's docs.
    this.schedule(() => {
      this.patch({
        status: "thinking",
        activity: {
          tool: "moss",
          label: `Matching ${knowledge.length} private sources`,
        },
      });
    }, 850);

    // Step 3 — grounded answer.
    this.schedule(() => {
      this.patch({
        status: "speaking",
        attention: true,
        activity: null,
        messages: [
          ...this.state.messages,
          this.message("agent", scenario.agentMessage),
        ],
      });
    }, 1900);

    // Step 4 — classification + the one-tap action.
    this.schedule(() => {
      this.patch({
        status: "observing",
        attention: true,
        detection: { ...scenario.detection, knowledge },
      });
    }, 3000);
  }

  private findScenario(observation: ScreenObservation): ScriptedScenario | undefined {
    return observation.host === "openai"
      ? findOpenAIScenario(observation)
      : findSettingsScenario(observation);
  }

  private schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(() => {
      this.timers.delete(timer);
      callback();
    }, delay);
    this.timers.add(timer);
  }

  private message(
    role: ConversationMessage["role"],
    text: string,
  ): ConversationMessage {
    return {
      id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      role,
      text,
      createdAt: Date.now(),
    };
  }

  private patch(patch: Partial<AgentState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }
}
