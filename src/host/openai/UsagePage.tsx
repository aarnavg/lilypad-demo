import { CheckCircle2, LifeBuoy, TriangleAlert } from "lucide-react";

const bars = [28, 33, 31, 42, 47, 55, 51, 62, 68, 73, 79, 86, 92, 100];

export function UsagePage({
  budgetLabel,
  onGetHelp,
}: {
  budgetLabel: string;
  onGetHelp: () => void;
}) {
  const raised = budgetLabel.includes("$500");
  return (
    <div className="mx-auto w-full max-w-[1160px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
        <span>Production</span>
        <span>/</span>
        <span className="text-[#aaaab0]">Usage</span>
      </div>
      <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">
        Usage
      </h1>
      <p className="mt-2 text-sm text-[#8f9198]">
        Live spend and request activity for the Production project.
      </p>

      {/* Realistic status banner — the customer notices their traffic is being
          declined here, and reaches for support. Not a debug popup. */}
      {raised ? (
        <div className="mt-7 flex items-center gap-3 rounded-xl border border-[#2c5a43] bg-[#16271f] px-5 py-4">
          <CheckCircle2 size={18} className="shrink-0 text-[#79c99b]" />
          <p className="text-sm text-[#bfe6cc]">
            Production is serving requests again.
          </p>
        </div>
      ) : (
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#5a4a2e] bg-[#241f15] px-5 py-4">
          <div className="flex items-start gap-3">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-[#e0b063]" />
            <div>
              <p className="text-sm font-medium text-[#f1dcae]">
                Production requests are being declined
              </p>
              <p className="mt-1 text-xs text-[#b9a987]">
                Responses are returning insufficient_quota, even though your
                organization still has $87.42 in credits.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onGetHelp}
            className="inline-flex items-center gap-2 rounded-lg bg-[#eeeeef] px-4 py-2.5 text-xs font-medium text-[#171719] hover:bg-white"
          >
            <LifeBuoy size={14} />
            Get help
          </button>
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {[
          ["Project spend", "$120.00"],
          ["Requests", "48,291"],
          ["Monthly budget", raised ? "$500.00" : "$120.00"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-5"
          >
            <p className="text-xs text-[#797b82]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#f0f0f1]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#eeeeef]">
              Daily API spend
            </h2>
            <p className="mt-1 text-xs text-[#797b82]">May 25 to June 7</p>
          </div>
          <button className="rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-[#b9bac0]">
            All models
          </button>
        </div>
        <div className="mt-10 flex h-52 items-end gap-3 border-b border-white/[0.08] px-2">
          {bars.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t"
              style={{
                height: `${height}%`,
                background:
                  index === bars.length - 1 && !raised ? "#c05b4b" : "#4d8b70",
                opacity: 0.58 + index * 0.025,
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
