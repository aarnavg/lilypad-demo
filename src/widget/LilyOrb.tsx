import { motion } from "motion/react";
import type { AgentStatus } from "../agent/types";

/**
 * Lily's persistent presence. This is the primary affordance: one click starts
 * (or stops) talking. Everything else about the agent is conveyed through the
 * orb's motion, so the footprint on the host app stays tiny.
 */
export function LilyOrb({
  status,
  attention,
  listening,
  onClick,
}: {
  status: AgentStatus;
  attention: boolean;
  listening: boolean;
  onClick: () => void;
}) {
  const active = listening || status === "speaking" || status === "thinking";
  const rippleColor =
    status === "speaking"
      ? "rgba(239,118,95,0.45)" // coral while Lily talks
      : "rgba(96,170,128,0.42)"; // moss while listening / thinking

  return (
    <div className="relative grid place-items-center">
      {/* reactive ripples — only while there is real activity */}
      {active &&
        [0, 1, 2].map((ring) => (
          <motion.span
            key={ring}
            className="pointer-events-none absolute rounded-full"
            style={{ width: 56, height: 56, border: `1.5px solid ${rippleColor}` }}
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
              delay: ring * 0.6,
            }}
          />
        ))}

      {/* attention nudge when Lily proactively reacts and is collapsed */}
      {attention && !active && (
        <motion.span
          className="pointer-events-none absolute rounded-full bg-[#ef765f]/30"
          style={{ width: 56, height: 56 }}
          animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
        />
      )}

      <motion.button
        type="button"
        onClick={onClick}
        title={listening ? "Stop talking to Lily" : "Talk to Lily"}
        aria-label={listening ? "Stop talking to Lily" : "Talk to Lily"}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.94 }}
        animate={
          status === "thinking"
            ? { scale: [1, 1.04, 1] }
            : { scale: [1, 1.025, 1] }
        }
        transition={{
          duration: status === "thinking" ? 1 : 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="lily-orb relative grid size-14 place-items-center overflow-hidden rounded-full text-[#f3fbf3]"
      >
        <LilyMark speaking={status === "speaking"} />
        {/* watching halo — Lily is always observing the screen */}
        <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
      </motion.button>
    </div>
  );
}

function LilyMark({ speaking }: { speaking: boolean }) {
  if (speaking) {
    return (
      <div className="lily-wave" aria-hidden>
        {[0, 1, 2, 3, 4].map((bar) => (
          <span key={bar} style={{ animationDelay: `${bar * 90}ms` }} />
        ))}
      </div>
    );
  }
  // simple lily-pad mark
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.2c4.86 0 8.8 3.94 8.8 8.8 0 4.86-3.94 8.8-8.8 8.8-4.86 0-8.8-3.94-8.8-8.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path d="M12 12 4 8.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
    </svg>
  );
}
