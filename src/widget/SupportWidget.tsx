import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSupportAgent } from "../agent/AgentProvider";
import { SupportBubble } from "./SupportBubble";
import { SupportPanel } from "./SupportPanel";
import { useScreenShare } from "./useScreenShare";

export function SupportWidget() {
  const { client, state } = useSupportAgent();
  const screenShare = useScreenShare();
  const [open, setOpen] = useState(false);
  const lastSpokenId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (state.status !== "speaking") return;
    const latest = [...state.messages].reverse().find((message) => message.role === "agent");
    if (!latest || latest.id === lastSpokenId.current || !window.speechSynthesis) return;
    lastSpokenId.current = latest.id;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(latest.text);
    utterance.rate = 1.03;
    utterance.pitch = 1.06;
    window.speechSynthesis.speak(utterance);
  }, [state.messages, state.status]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function toggle() {
    setOpen((current) => {
      const next = !current;
      if (next) client.clearAttention();
      return next;
    });
  }

  return (
    <aside className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 md:bottom-6 md:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            style={{ transformOrigin: "bottom right" }}
          >
            <SupportPanel
              state={state}
              client={client}
              screenShare={screenShare}
              onMinimize={() => setOpen(false)}
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <SupportBubble open={open} attention={state.attention} onClick={toggle} />
    </aside>
  );
}
