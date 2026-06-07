import { Check, Copy, Play, Terminal } from "lucide-react";
import { useState } from "react";

export function QuickstartTest({ onSend }: { onSend: () => Promise<void> }) {
  const [running, setRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [copied, setCopied] = useState(false);

  async function runRequest() {
    setRunning(true);
    setHasRun(false);
    await onSend();
    setRunning(false);
    setHasRun(true);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1b1c1f]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#eeeeef]">
            Production smoke test
          </p>
          <p className="mt-1 text-xs text-[#808289]">
            Run a real-shaped request with prod-support-worker.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-[#85878e]">
          <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-1">
            us-west
          </span>
          <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-1">
            closed-4.1-mini
          </span>
          <div className="grid size-9 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-[#a1a3aa]">
            <Terminal size={17} />
          </div>
        </div>
      </div>
      <div className="bg-[#101114] p-5 font-mono text-[11px] leading-5 text-[#d1d1d4]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[#686a71]">cURL</span>
          <button
            type="button"
            onClick={() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="text-[#777980] hover:text-white"
            aria-label="Copy request"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <p>
          <span className="text-[#d7a8ff]">curl</span>{" "}
          https://api.closedai.dev/v1/responses \
        </p>
        <p className="pl-3">
          -H{" "}
          <span className="text-[#96d7ad]">
            "Authorization: Bearer $CLOSEDAI_API_KEY"
          </span>{" "}
          \
        </p>
        <p className="pl-3">
          -d{" "}
          <span className="text-[#96d7ad]">
            '&#123;"model":"closed-4.1-mini","input":"health check"&#125;'
          </span>
        </p>
        {hasRun && (
          <div className="mt-4 rounded-lg border border-[#713b3b] bg-[#2b1919] p-3 text-[#ffb8b3]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">429 insufficient_quota</p>
              <code className="text-[10px] text-[#b97e79]">req_7f3a91</code>
            </div>
            <p className="mt-1 text-[#d89591]">
              You exceeded your current quota. Check your plan and billing
              details.
            </p>
            <p className="mt-2 text-[10px] text-[#a96f6a]">
              The API does not disclose whether billing credits or a private
              project budget caused this response.
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 pr-20 lg:pr-5">
        <div className="flex items-center gap-3 text-xs text-[#74767d]">
          <span>Acme AI / Production</span>
          <span className="text-[#45474d]">|</span>
          <span>Organization credits: $87.42</span>
        </div>
        <button
          type="button"
          onClick={() => void runRequest()}
          disabled={running}
          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-[#eeeeef] px-4 py-2.5 text-xs font-medium text-[#171719] hover:bg-white disabled:opacity-60"
        >
          <Play size={13} fill="currentColor" />
          {running ? "Sending request..." : "Send test request"}
        </button>
      </div>
    </section>
  );
}
