import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Eye,
  FileText,
  LoaderCircle,
  Mic,
  MicOff,
  MonitorUp,
  Search,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import type {
  ActionResult,
  AgentActivity,
  AgentState,
  Classification,
} from "../agent/types";
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

const toolLabel: Record<string, string> = {
  minimax: "Minimax",
  moss: "Moss",
  unsiloed: "Unsiloed",
};

/**
 * Liquid-glass, near-invisible support overlay. It shows just enough to prove
 * Lily is doing something a plain chatbot can't: a live pipeline (Minimax reads
 * the screen → Moss retrieves the company's docs), her grounded answer, the doc
 * she cited, and one action. Everything else stays out of the way.
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
  const knowledge = detection?.knowledge ?? [];
  const dotColor = detection ? accent[detection.classification] : "#5aa17e";
  const showActivity = !!state.activity && state.status === "thinking";
  const [executing, setExecuting] = useState(false);
  const [showSource, setShowSource] = useState(false);

  // Collapse the citation by default each time Lily reaches a new conclusion,
  // keeping the overlay minimal — the chip's doc name already signals grounding.
  useEffect(() => setShowSource(false), [detection?.id]);

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
      className="lily-glass group relative w-[314px] max-w-[calc(100vw-32px)] rounded-[20px] px-3.5 py-3"
    >
      <div className="mb-2 flex items-center justify-between pl-[18px]">
        <span className="text-[9px] font-bold uppercase tracking-[.12em] text-[#617168]">
          {detection
            ? classificationLabel[detection.classification]
            : state.status === "listening"
              ? "Listening"
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

      {/* working pipeline (Minimax → Moss) OR Lily's caption */}
      {showActivity ? (
        <ActivityRow activity={state.activity as AgentActivity} />
      ) : (
        <div className="flex gap-2.5">
          <StateDot status={state.status} color={dotColor} />
          <p className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#1f2c25]">
            {latest?.text ?? "Hi, I'm Lily."}
          </p>
        </div>
      )}

      {/* the doc Lily grounded her answer in */}
      <AnimatePresence>
        {knowledge.length > 0 && !result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pl-[26px]"
          >
            <button
              type="button"
              onClick={() => setShowSource((v) => !v)}
              className="mt-2 inline-flex max-w-full items-center gap-1.5 rounded-full border border-[#486052]/15 bg-white/45 px-2.5 py-1 text-[10.5px] font-medium text-[#3d5648] hover:bg-white/70"
            >
              <FileText size={11} className="shrink-0" />
              <span className="truncate">
                {knowledge.length} private {knowledge.length === 1 ? "source" : "sources"}
              </span>
              <ChevronDown
                size={11}
                className={`shrink-0 transition-transform ${showSource ? "rotate-180" : ""}`}
              />
            </button>
            <AnimatePresence>
              {showSource && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-1.5 space-y-2 border-l-2 border-[#84a591] pl-2.5">
                    {knowledge.map((source) => (
                      <div key={`${source.source}-${source.locator ?? ""}`}>
                        <p className="text-[10px] font-semibold text-[#3f5549]">
                          {source.source}
                          {source.locator ? ` - ${source.locator}` : ""}
                        </p>
                        <p className="mt-0.5 text-[10.5px] leading-[1.45] text-[#65746c]">
                          {source.excerpt}
                        </p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[9px] font-semibold uppercase tracking-[.08em] text-[#9aa59f]">
                    Parsed by Unsiloed · Retrieved by Moss
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

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

function ActivityRow({ activity }: { activity: AgentActivity }) {
  const Icon = activity.tool === "minimax" ? Eye : Search;
  return (
    <motion.div
      key={activity.label}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2.5"
    >
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-[#2e6f54]/12 text-[#2e6f54]">
        <Icon size={12} />
      </span>
      <span className="min-w-0 flex-1 text-[13px] leading-[1.5] text-[#27332c]">
        {activity.label}
        <LoaderCircle size={12} className="ml-1.5 inline animate-spin text-[#7a978a]" />
      </span>
      <span className="shrink-0 text-[9px] font-bold uppercase tracking-[.1em] text-[#93a39a]">
        {toolLabel[activity.tool] ?? activity.tool}
      </span>
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
