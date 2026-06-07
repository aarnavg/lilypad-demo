import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSupportAgent } from "../agent/AgentProvider";
import { LilyOrb } from "./LilyOrb";
import { LilyOverlay } from "./LilyOverlay";
import { useScreenShare } from "./useScreenShare";

export function SupportWidget() {
  const { client, state } = useSupportAgent();
  const screenShare = useScreenShare();
  const [open, setOpen] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const hasMounted = useRef(false);
  const prevMessageCount = useRef(state.messages.length);

  // Hands-free: surface Lily's caption the moment she reacts to the screen, so
  // the user never has to go looking for the widget. Stays closed on first load.
  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      prevMessageCount.current = state.messages.length;
      return;
    }
    const grewByAgent =
      state.messages.length > prevMessageCount.current &&
      state.messages[state.messages.length - 1]?.role === "agent";
    prevMessageCount.current = state.messages.length;
    if (state.attention || state.detection || grewByAgent) setOpen(true);
  }, [state.attention, state.detection, state.messages]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") end();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setMic(next: boolean) {
    setMicOn(next);
    client.setListening(next); // drives the demo orb animation; real ASR is teammates'
  }

  function onOrbClick() {
    client.clearAttention();
    if (!open) {
      setOpen(true);
      setMic(true);
      return;
    }
    setMic(!micOn);
  }

  function end() {
    setMic(false);
    screenShare.stop();
    client.dismissDetection();
    client.clearAttention();
    setOpen(false);
  }

  return (
    <aside className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <LilyOverlay
            key="overlay"
            state={state}
            micOn={micOn}
            screenShare={screenShare}
            onToggleMic={() => setMic(!micOn)}
            onToggleShare={() =>
              void (screenShare.isSharing
                ? screenShare.stop()
                : screenShare.start())
            }
            onEnd={end}
            onExecute={() => client.executeAction()}
            onDismiss={() => client.dismissDetection()}
          />
        )}
      </AnimatePresence>

      <LilyOrb
        status={state.status}
        attention={state.attention}
        listening={micOn}
        onClick={onOrbClick}
      />

      {/* Canonical hidden feed element — keeps window.lilypadSupportFeed wired
          for teammates' LiveKit pipeline regardless of the visible UI. */}
      <video
        ref={screenShare.videoRef}
        autoPlay
        muted
        playsInline
        className="pointer-events-none fixed h-px w-px opacity-0"
        aria-hidden
      />
    </aside>
  );
}
