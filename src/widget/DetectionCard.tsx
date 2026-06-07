import {
  ArrowUpRight,
  Bug,
  Check,
  CircleHelp,
  Lightbulb,
  LoaderCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ActionResult, Detection } from "../agent/types";

const classificationMeta = {
  user_error: {
    label: "User error",
    icon: CircleHelp,
    badge: "bg-[#e8f4ed] text-[#2e7151]",
    border: "border-[#bdd9c9]",
  },
  product_bug: {
    label: "Product bug",
    icon: Bug,
    badge: "bg-[#fdeae7] text-[#a24437]",
    border: "border-[#ebc0b9]",
  },
  product_gap: {
    label: "Product gap",
    icon: Lightbulb,
    badge: "bg-[#f0eafa] text-[#6946a1]",
    border: "border-[#d7c7ee]",
  },
};

export function DetectionCard({
  detection,
  result,
  onExecute,
  onDismiss,
}: {
  detection: Detection;
  result: ActionResult | null;
  onExecute: () => Promise<ActionResult>;
  onDismiss: () => void;
}) {
  const [executing, setExecuting] = useState(false);
  const meta = classificationMeta[detection.classification];
  const Icon = meta.icon;

  async function execute() {
    setExecuting(true);
    await onExecute();
    setExecuting(false);
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mx-4 mb-3 max-h-[330px] shrink-0 overflow-y-auto rounded-2xl border ${meta.border} bg-white p-4 shadow-[0_12px_35px_rgba(34,48,40,.09)]`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.04em] ${meta.badge}`}>
          <Icon size={12} />
          {meta.label}
        </span>
        <span className="text-[10px] font-medium text-[#8b918d]">94% confidence</span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-[#25322b]">{detection.title}</h3>
      <p className="mt-1.5 text-[11px] leading-[1.55] text-[#667069]">{detection.rationale}</p>

      <div className="mt-3 rounded-xl bg-[#f7f6f1] p-3">
        <p className="text-[9px] font-bold uppercase tracking-[.08em] text-[#828981]">What I observed</p>
        <ul className="mt-2 space-y-1.5">
          {detection.evidence.map((evidence) => (
            <li key={evidence} className="flex gap-2 text-[10px] leading-4 text-[#5e6861]">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-[#72877a]" />
              {evidence}
            </li>
          ))}
        </ul>
      </div>

      {detection.knowledge && (
        <div className="mt-2.5 border-l-2 border-[#84a591] pl-3">
          <p className="text-[9px] font-bold uppercase tracking-[.07em] text-[#668170]">Found in your docs</p>
          <p className="mt-1 text-[10px] font-semibold text-[#435249]">{detection.knowledge.title}</p>
          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-[#778078]">{detection.knowledge.excerpt}</p>
        </div>
      )}

      {result ? (
        <div className={`mt-4 rounded-xl p-3 text-[11px] ${result.ok ? "bg-[#eaf5ee] text-[#34684d]" : "bg-[#fdecea] text-[#963e34]"}`}>
          <div className="flex items-start gap-2">
            <Check size={14} className="mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">{result.message}</p>
              {result.artifact?.url && (
                <a href={result.artifact.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 underline">
                  {result.artifact.label}
                  <ArrowUpRight size={11} />
                </a>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-2">
          <button
            type="button"
            onClick={() => void execute()}
            disabled={executing}
            className="flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#224d39] px-4 text-[11px] font-semibold text-white hover:bg-[#2e694d] disabled:opacity-65"
          >
            {executing && <LoaderCircle size={14} className="animate-spin" />}
            {executing ? "Working on it..." : detection.action.label}
          </button>
          <button type="button" onClick={onDismiss} className="text-[10px] font-medium text-[#777f79]">
            I’ll do it myself
          </button>
        </div>
      )}
    </motion.section>
  );
}
