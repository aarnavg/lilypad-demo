import clsx from "clsx";
import type { AgentStatus } from "../agent/types";

const labels: Record<AgentStatus, string> = {
  idle: "Idle",
  observing: "Observing your screen",
  listening: "Listening",
  speaking: "Speaking",
  thinking: "Thinking",
};

export function StatusPill({ status }: { status: AgentStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        status === "speaking" && "border-[#e7a493] bg-[#fff0eb] text-[#9c4b3b]",
        status === "listening" && "border-[#91bea9] bg-[#edf7f1] text-[#2b6c51]",
        status === "thinking" && "border-[#d5b987] bg-[#fff8e8] text-[#806127]",
        (status === "idle" || status === "observing") &&
          "border-[#c9d8cf] bg-[#f2f7f3] text-[#42604f]",
      )}
    >
      <span
        className={clsx(
          "size-1.5 rounded-full",
          status === "speaking" ? "bg-[#ef765f]" : "bg-[#4f9272]",
          ["speaking", "listening", "thinking"].includes(status) && "animate-pulse",
        )}
      />
      {labels[status]}
    </span>
  );
}
