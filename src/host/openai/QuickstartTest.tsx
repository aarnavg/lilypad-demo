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
    <section className="overflow-hidden rounded-xl border border-[#dededb] bg-white shadow-[0_1px_2px_rgba(0,0,0,.03)]">
      <div className="flex items-center justify-between border-b border-[#ececea] px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Make your first request</p>
          <p className="mt-1 text-xs text-[#747472]">Test your key against the Responses API.</p>
        </div>
        <div className="grid size-9 place-items-center rounded-lg bg-[#f1f1ef] text-[#555]">
          <Terminal size={17} />
        </div>
      </div>
      <div className="bg-[#151515] p-4 font-mono text-[11px] leading-5 text-[#ddd]">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[#8d8d8d]">cURL</span>
          <button
            type="button"
            onClick={() => {
              setCopied(true);
              window.setTimeout(() => setCopied(false), 1200);
            }}
            className="text-[#aaa] hover:text-white"
            aria-label="Copy request"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>
        <p><span className="text-[#bc9cff]">curl</span> https://api.openai.com/v1/responses \</p>
        <p className="pl-3">-H <span className="text-[#a8d59b]">"Authorization: Bearer $OPENAI_API_KEY"</span> \</p>
        <p className="pl-3">-d <span className="text-[#a8d59b]">'&#123;"model":"gpt-4.1-mini"&#125;'</span></p>
        {hasRun && (
          <div className="mt-4 rounded-md border border-[#713b3b] bg-[#2b1919] p-3 text-[#ffb8b3]">
            <p className="font-semibold">429 insufficient_quota</p>
            <p className="mt-1 text-[#d89591]">You exceeded your current quota. Check your plan and billing details.</p>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <span className="text-xs text-[#777]">Uses your selected project key</span>
        <button
          type="button"
          onClick={() => void runRequest()}
          disabled={running}
          className="inline-flex min-w-36 items-center justify-center gap-2 rounded-lg bg-[#111] px-4 py-2.5 text-xs font-medium text-white hover:bg-[#333] disabled:opacity-60"
        >
          <Play size={13} fill="currentColor" />
          {running ? "Sending request..." : "Send test request"}
        </button>
      </div>
    </section>
  );
}
