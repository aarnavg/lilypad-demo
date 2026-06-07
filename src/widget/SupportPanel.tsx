import {
  Eye,
  Mic,
  MicOff,
  Minus,
  MonitorUp,
  PhoneOff,
  Send,
  StopCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import type { AgentState, SupportAgentClient } from "../agent/types";
import { Conversation } from "./Conversation";
import { DetectionCard } from "./DetectionCard";
import { StatusPill } from "./StatusPill";
import type { useScreenShare } from "./useScreenShare";
import { VoiceWave } from "./VoiceWave";

type ScreenShareState = ReturnType<typeof useScreenShare>;

export function SupportPanel({
  state,
  client,
  screenShare,
  onMinimize,
  onClose,
}: {
  state: AgentState;
  client: SupportAgentClient;
  screenShare: ScreenShareState;
  onMinimize: () => void;
  onClose: () => void;
}) {
  const [listening, setListening] = useState(false);
  const [prompt, setPrompt] = useState("");

  function toggleListening() {
    const next = !listening;
    setListening(next);
    client.setListening(next);
  }

  function submitPrompt(event: React.FormEvent) {
    event.preventDefault();
    client.sendManualPrompt(prompt);
    setPrompt("");
  }

  return (
    <section
      role="dialog"
      aria-label="Lily support"
      className="flex h-[min(760px,calc(100vh-112px))] w-[min(420px,calc(100vw-24px))] flex-col overflow-hidden rounded-[24px] border border-[#d9d1c2] bg-[#fbf8f0] shadow-[0_28px_90px_rgba(23,45,33,.25)]"
    >
      <header className="flex shrink-0 items-center justify-between border-b border-[#dfd8ca] bg-[#f7f1e5] px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#24543e] font-['Newsreader'] text-lg font-semibold text-[#fff8e9]">
            L
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#f7f1e5] bg-[#59a47d]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-['Newsreader'] text-lg font-semibold leading-none text-[#24352c]">Lily</h2>
              {state.status === "speaking" && <VoiceWave />}
            </div>
            <div className="mt-1.5">
              <StatusPill status={state.status} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="mr-1 flex gap-1" aria-label={state.connected ? "Connected" : "Disconnected"}>
            {[0, 1, 2].map((dot) => (
              <span key={dot} className={`size-1.5 rounded-full ${state.connected ? "bg-[#5f9a78]" : "bg-[#c7a39a]"}`} />
            ))}
          </span>
          <button type="button" onClick={onMinimize} className="grid size-8 place-items-center rounded-full text-[#68726c] hover:bg-black/5" aria-label="Minimize">
            <Minus size={16} />
          </button>
          <button type="button" onClick={onClose} className="grid size-8 place-items-center rounded-full text-[#68726c] hover:bg-black/5" aria-label="Close">
            <X size={16} />
          </button>
        </div>
      </header>

      <div className="relative mx-4 mt-3 h-28 shrink-0 overflow-hidden rounded-2xl border border-[#cfc9bd] bg-[#1b2620]">
        <video
          ref={screenShare.videoRef}
          autoPlay
          muted
          playsInline
          className={`h-full w-full object-cover ${screenShare.isSharing ? "block" : "hidden"}`}
        />
        {!screenShare.isSharing && (
          <div className="lily-observation-grid absolute inset-0 flex items-center gap-3 px-4 text-[#edf2ed]">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/10">
              <Eye size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[.08em] text-[#9bb7a7]">Observed screen</p>
              <p className="mt-1 truncate text-xs font-medium">
                {state.observation?.title ?? "Lily is watching this app"}
              </p>
            </div>
            <span className="lily-scan absolute inset-x-0 h-px bg-[#80d2a4]/60 shadow-[0_0_12px_#80d2a4]" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-1 text-[9px] font-medium text-white backdrop-blur">
          {screenShare.isSharing ? "Live screen" : "Structured context"}
        </div>
      </div>
      {(screenShare.error || screenShare.isPending) && (
        <p className={`mx-5 mt-2 text-[10px] ${screenShare.error ? "text-[#a24639]" : "text-[#60756a]"}`}>
          {screenShare.error ?? screenShare.status}
        </p>
      )}

      <Conversation messages={state.messages} thinking={state.status === "thinking"} />

      {state.detection && (
        <DetectionCard
          detection={state.detection}
          result={state.actionResult}
          onExecute={() => client.executeAction()}
          onDismiss={() => client.dismissDetection()}
        />
      )}

      <div className="shrink-0 border-t border-[#ded7c9] bg-[#f7f2e8] p-3">
        <form onSubmit={submitPrompt} className="flex items-center gap-2 rounded-xl border border-[#d8d1c4] bg-white px-3 py-2 shadow-sm">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ask Lily what to do..."
            className="min-w-0 flex-1 bg-transparent text-[11px] text-[#35423b] outline-none placeholder:text-[#9ba09c]"
          />
          <button type="submit" disabled={!prompt.trim()} className="text-[#315f48] disabled:opacity-30" aria-label="Send message">
            <Send size={15} />
          </button>
        </form>
        <div className="mt-2.5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`grid size-9 place-items-center rounded-full ${listening ? "bg-[#ef765f] text-white" : "border border-[#d5cec1] bg-white text-[#536159]"}`}
            aria-label={listening ? "Mute microphone" : "Turn on microphone"}
          >
            {listening ? <Mic size={15} /> : <MicOff size={15} />}
          </button>
          <button
            type="button"
            onClick={() => void (screenShare.isSharing ? screenShare.stop() : screenShare.start())}
            className={`grid size-9 place-items-center rounded-full ${screenShare.isSharing ? "bg-[#345f4c] text-white" : "border border-[#d5cec1] bg-white text-[#536159]"}`}
            aria-label={screenShare.isSharing ? "Stop screen sharing" : "Share screen"}
          >
            {screenShare.isSharing ? <StopCircle size={16} /> : <MonitorUp size={16} />}
          </button>
          <button
            type="button"
            onClick={() => {
              screenShare.stop();
              client.dismissDetection();
              onClose();
            }}
            className="grid size-9 place-items-center rounded-full bg-[#c75246] text-white"
            aria-label="End support call"
          >
            <PhoneOff size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}
