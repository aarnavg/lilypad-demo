import { createGitHubIssue, searchDocs, submitFeedback } from "../data/mockApi";
import { hostBus } from "../host/hostBus";
import { findOpenAIScenario } from "../scenarios/openai";
import { findSettingsScenario } from "../scenarios/settings";
import type {
  ActionResult,
  AgentState,
  ConversationMessage,
  ScreenObservation,
  ScriptedScenario,
  SupportAgentClient,
} from "./types";

const initialState: AgentState = {
  status: "idle",
  connected: true,
  attention: false,
  messages: [
    {
      id: "welcome",
      role: "agent",
      text: "Hi, I'm Lily. Just tell me what's going wrong — I can see your screen and I'll help.",
      createdAt: Date.now(),
    },
  ],
  observation: null,
  detection: null,
  actionResult: null,
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
      const issue = await createGitHubIssue();
      result = {
        ok: true,
        message: `Filed issue #${issue.number}`,
        artifact: { label: `Issue #${issue.number}`, url: issue.url },
      };
    } else {
      const feedback = await submitFeedback();
      result = {
        ok: true,
        message: `Logged ${feedback.id} to the ${feedback.route}.`,
        artifact: { label: feedback.id },
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

    this.patch({
      status: "thinking",
      attention: true,
      observation,
      detection: null,
      actionResult: null,
      messages: [
        ...this.state.messages,
        this.message("user", scenario.userMessage),
      ],
    });

    const knowledge = scenario.knowledgeQuery
      ? await searchDocs(scenario.knowledgeQuery)
      : undefined;

    this.schedule(() => {
      this.patch({
        status: "speaking",
        attention: true,
        messages: [
          ...this.state.messages,
          this.message("agent", scenario.agentMessage),
        ],
      });
    }, 450);

    this.schedule(() => {
      this.patch({
        status: "observing",
        attention: true,
        detection: { ...scenario.detection, knowledge },
      });
    }, 2200);
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
