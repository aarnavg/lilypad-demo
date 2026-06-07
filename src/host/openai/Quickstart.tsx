import { ArrowUpRight, Check, Copy } from "lucide-react";
import { useState } from "react";

/**
 * Realistic read-only "quickstart" block, like the snippet a real API console
 * shows under the keys table. No run button or fabricated errors — a normal
 * product wouldn't ship a debug smoke-test for its customers.
 */
export function Quickstart() {
  const [copied, setCopied] = useState(false);

  return (
    <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1b1c1f]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-[#eeeeef]">Quickstart</p>
          <p className="mt-1 text-xs text-[#808289]">
            Send your first request with the Responses API.
          </p>
        </div>
        <span className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2.5 py-1 text-[10px] text-[#9b9da3]">
          closed-4.1-mini
        </span>
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
            '&#123;"model":"closed-4.1-mini","input":"Hello!"&#125;'
          </span>
        </p>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <span className="text-xs text-[#74767d]">
          Uses the project's selected key
        </span>
        <a
          href="#"
          onClick={(event) => event.preventDefault()}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#b9bac0] hover:text-white"
        >
          API reference
          <ArrowUpRight size={13} />
        </a>
      </div>
    </section>
  );
}
