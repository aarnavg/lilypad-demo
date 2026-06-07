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
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#eeeeef]">Make your first request</p>
          <p className="mt-1 text-xs text-[#808289]">Test your key against the Responses API.</p>
        </div>
        <div className="grid size-9 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-[#a1a3aa]">
          <Terminal size={17} />
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
        <p><span className="text-[#d7a8ff]">curl</span> https://api.closedai.dev/v1/responses \</p>
        <p className="pl-3">-H <span className="text-[#96d7ad]">"Authorization: Bearer $CLOSEDAI_API_KEY"</span> \</p>
        <p className="pl-3">-d <span className="text-[#96d7ad]">'&#123;"model":"closed-4.1-mini"&#125;'</span></p>
        {hasRun && (
          <div className="mt-4 rounded-lg border border-[#713b3b] bg-[#2b1919] p-3 text-[#ffb8b3]">
            <p className="font-semibold">429 insufficient_quota</p>
            <p className="mt-1 text-[#d89591]">You exceeded your current quota. Check your plan and billing details.</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4 pr-20 lg:pr-5">
        <span className="text-xs text-[#74767d]">Uses your selected project key</span>
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
