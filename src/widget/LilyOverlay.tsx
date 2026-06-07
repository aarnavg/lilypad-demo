import {
  ArrowUpRight,
  Check,
  LoaderCircle,
  Mic,
  MicOff,
  MonitorUp,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ActionResult, AgentState, Classification } from "../agent/types";
import type { useScreenShare } from "./useScreenShare";

type ScreenShareState = ReturnType<typeof useScreenShare>;

const accent: Record<Classification, string> = {
  user_error: "#2e7151",
  product_bug: "#c0553f",
  product_gap: "#6e4fae",
};

const classificationLabel: Record<Classification, string> = {
  user_error: "Guidance",
  product_bug: "Product bug",
  product_gap: "Product gap",
};

/**
 * Liquid-glass, near-invisible support overlay. Even when open it shows almost
 * nothing: Lily's latest line, an optional one-tap action, and controls that
 * only fade in on hover. No headers, badges, or transcripts.
 */
export function LilyOverlay({
  state,
  micOn,
  screenShare,
  onToggleMic,
  onToggleShare,
  onEnd,
  onExecute,
  onDismiss,
}: {
  state: AgentState;
  micOn: boolean;
  screenShare: ScreenShareState;
  onToggleMic: () => void;
  onToggleShare: () => void;
  onEnd: () => void;
  onExecute: () => Promise<ActionResult>;
  onDismiss: () => void;
}) {
  const latest = [...state.messages].reverse().find((m) => m.role !== "system");
  const detection = state.detection;
  const result = state.actionResult;
  const dotColor = detection ? accent[detection.classification] : "#5aa17e";
  const [executing, setExecuting] = useState(false);

  async function execute() {
    setExecuting(true);
    await onExecute();
    setExecuting(false);
  }

  return (
    <motion.div
      role="dialog"
      aria-label="Lily"
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 460, damping: 34 }}
      style={{ transformOrigin: "bottom right" }}
      className="lily-glass group relative w-[310px] max-w-[calc(100vw-32px)] rounded-[20px] px-3.5 py-3"
    >
      <div className="mb-2 flex items-center justify-between pl-[18px]">
        <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#617168]">
          {detection
            ? classificationLabel[detection.classification]
            : state.status === "listening"
              ? "Listening"
              : state.status === "thinking"
                ? "Looking at your screen"
                : "Lily"}
        </span>
        <div className="flex items-center gap-1">
          <GhostIcon
            active={micOn}
            label={micOn ? "Mute" : "Talk"}
            onClick={onToggleMic}
          >
            {micOn ? <Mic size={12} /> : <MicOff size={12} />}
          </GhostIcon>
          <GhostIcon
            active={screenShare.isSharing}
            label={screenShare.isSharing ? "Stop sharing" : "Share screen"}
            onClick={onToggleShare}
          >
            <MonitorUp size={12} />
          </GhostIcon>
          <GhostIcon label="Close" onClick={onEnd}>
            <X size={12} />
          </GhostIcon>
        </div>
      </div>

      {/* live state indicator + caption */}
      <div className="flex gap-2.5">
        <StateDot status={state.status} color={dotColor} />
        <p className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#1f2c25]">
          {latest?.text ?? "Hi, I'm Lily."}
        </p>
      </div>

      {/* one-tap action / result */}
      <AnimatePresence>
        {detection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {result ? (
              <div className="mt-2.5 flex items-center gap-1.5 pl-[26px] text-[12px] font-medium text-[#34684d]">
                <Check size={13} />
                {result.artifact?.url ? (
                  <a
                    href={result.artifact.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-2"
                  >
                    {result.artifact.label}
                    <ArrowUpRight size={11} />
                  </a>
                ) : (
                  <span>{result.artifact?.label ?? "Done"}</span>
                )}
              </div>
            ) : (
              <div className="mt-2.5 flex items-center gap-2 pl-[26px]">
                <ActionButton
                  color={accent[detection.classification]}
                  label={executing ? "Working…" : detection.action.label}
                  loading={executing}
                  onClick={() => void execute()}
                />
                <button
                  type="button"
                  onClick={onDismiss}
                  className="whitespace-nowrap text-[11px] font-medium text-[#8a918b] hover:text-[#5a625c]"
                >
                  No thanks
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}

function StateDot({
  status,
  color,
}: {
  status: AgentState["status"];
  color: string;
}) {
  if (status === "speaking") {
    return (
      <div className="lily-wave mt-1 shrink-0" aria-hidden>
        {[0, 1, 2, 3, 4].map((bar) => (
          <span key={bar} style={{ animationDelay: `${bar * 90}ms` }} />
        ))}
      </div>
    );
  }
  const animate =
    status === "listening" || status === "thinking"
      ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }
      : { scale: 1, opacity: 1 };
  return (
    <motion.span
      className="mt-[7px] size-2 shrink-0 rounded-full"
      style={{ background: color }}
      animate={animate}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    />
  );
}

function ActionButton({
  color,
  label,
  loading,
  onClick,
}: {
  color: string;
  label: string;
  loading: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.97 }}
      style={{ background: color }}
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm disabled:opacity-70"
    >
      {loading && <LoaderCircle size={12} className="animate-spin" />}
      {label}
    </motion.button>
  );
}

function GhostIcon({
  active = false,
  label,
  onClick,
  children,
}: {
  active?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid size-6 place-items-center rounded-full border transition ${
        active ? "text-[#c0553f]" : "text-[#46544c]"
      } border-[#486052]/10 bg-white/30 hover:bg-white/60`}
    >
      {children}
    </button>
  );
}
