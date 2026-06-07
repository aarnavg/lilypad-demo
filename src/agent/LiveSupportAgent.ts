import type {
  ActionResult,
  AgentState,
  SupportAgentClient,
} from "./types";

/**
 * Production adapter seam.
 *
 * Replace the TODO blocks with the team's LiveKit/Minimax/voice/retrieval
 * implementation. The widget only consumes SupportAgentClient, so no UI code
 * needs to change when this client becomes real.
 */
export class LiveSupportAgent implements SupportAgentClient {
  private state: AgentState = {
    status: "idle",
    connected: false,
    attention: false,
    messages: [
      {
        id: "live-not-configured",
        role: "system",
        text: "Live agent mode is selected, but the backend adapter is not configured yet.",
        createdAt: Date.now(),
      },
    ],
    observation: null,
    detection: null,
    actionResult: null,
  };
  private listeners = new Set<(state: AgentState) => void>();

  getState() {
    return this.state;
  }

  subscribe(listener: (state: AgentState) => void) {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  start() {
    // TODO(livekit): connect to the support room and publish
    // window.lilypadSupportFeed.stream as the user's screen track.
    // TODO(minimax): turn sampled video frames into ScreenObservation values.
    // TODO(voice): stream ASR transcripts and TTS playback into messages/status.
    this.patch({ status: "idle", connected: false });
  }

  stop() {
    // TODO(livekit): disconnect room participants and release remote tracks.
    this.patch({ status: "idle", connected: false });
  }

  setListening(listening: boolean) {
    // TODO(voice): enable/disable the microphone track and ASR stream.
    this.patch({ status: listening ? "listening" : "idle" });
  }

  async executeAction(): Promise<ActionResult> {
    // TODO(actions): dispatch the active tool call or backend integration.
    return {
      ok: false,
      message: "Live action execution is not configured.",
    };
  }

  dismissDetection() {
    this.patch({ detection: null, actionResult: null, attention: false });
  }

  clearAttention() {
    this.patch({ attention: false });
  }

  sendManualPrompt(_text: string) {
    // TODO(voice): send text as a user turn to the live agent session.
  }

  private patch(patch: Partial<AgentState>) {
    this.state = { ...this.state, ...patch };
    this.listeners.forEach((listener) => listener(this.state));
  }
}
