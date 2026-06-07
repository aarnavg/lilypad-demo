import { CheckCircle2, Clock, LifeBuoy, TrendingDown, TrendingUp, TriangleAlert, Zap, type LucideIcon } from "lucide-react";

const bars = [28, 33, 31, 42, 47, 55, 51, 62, 68, 73, 79, 86, 92, 100];
const dayLabels = ["25", "26", "27", "28", "29", "30", "31", "1", "2", "3", "4", "5", "6", "7"];

interface StatCard {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  isError?: boolean;
}

export function UsagePage({
  budgetLabel,
  onGetHelp,
}: {
  budgetLabel: string;
  onGetHelp: () => void;
}) {
  const raised = budgetLabel.includes("$500");
  const peakDay = 13;
  const avgLatency = "142ms";
  const errorRate = raised ? "0.02%" : "23.4%";

  const statCards: StatCard[] = [
    { label: "Project spend", value: "$120.00", change: "↑ 12% from last period", icon: TrendingUp },
    { label: "Total requests", value: "48,291", change: "↑ 8% from last period", icon: TrendingUp },
    { label: "Avg latency", value: avgLatency, change: "↓ 15% from last period", icon: TrendingDown },
    { label: "Error rate", value: errorRate, change: raised ? "↓ 0.1% from last period" : "↑ 18% from last period", icon: raised ? TrendingDown : TriangleAlert, isError: !raised },
  ];

  return (
    <div className="mx-auto w-full max-w-[1160px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
        <span>Production</span>
        <span>/</span>
        <span className="text-[#aaaab0]">Usage</span>
      </div>
      <div className="flex items-baseline gap-3">
        <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">
          Usage
        </h1>
        <span className="text-xs text-[#5a5b61]">May 25 – June 7, 2026</span>
      </div>
      <p className="mt-2 text-sm text-[#8f9198]">
        Live spend and request activity for the Production project.
      </p>

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

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, change, icon: Icon, isError }) => (
          <div
            key={label}
            className="group relative rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-5 hover:border-white/[0.12]"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-[#797b82]">{label}</p>
              <Icon size={14} className={isError ? "text-[#e0b063]" : "text-[#7a7b82]"} />
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#f0f0f1]">
              {value}
            </p>
            <p className={`mt-1.5 text-[10px] ${isError ? "text-[#e0b063]" : "text-[#5a5b61]"}`}>
              {change}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-5 rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#eeeeef]">
              Daily API spend
            </h2>
            <p className="mt-1 text-xs text-[#797b82]">
              <span className="inline-flex items-center gap-1">
                <Zap size={10} className="text-[#4d8b70]" />
                gpt-4o · gpt-4o-mini · chatgpt-4o-latest
              </span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#4d8b70]" />
              <span className="text-[10px] text-[#797b82]">Normal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#c05b4b]" />
              <span className="text-[10px] text-[#797b82]">Budget exceeded</span>
            </div>
            <button className="rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-[#b9bac0] hover:bg-white/[0.06]">
              All models
            </button>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex h-48 items-end gap-[5px] border-b border-white/[0.06] pb-3 pl-8 pr-4">
            {bars.map((height, index) => (
              <div key={index} className="group relative flex flex-1 flex-col items-center">
                <div
                  className="relative w-full rounded-t transition-all duration-300 hover:brightness-125"
                  style={{
                    height: `${height}%`,
                    background:
                      index === peakDay && !raised ? "#c05b4b" : "#4d8b70",
                    opacity: 0.58 + index * 0.025,
                  }}
                >
                  {index === peakDay && !raised && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-[#c05b4b] px-1.5 py-0.5 text-[9px] font-medium text-white">
                      Peak
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between px-8 pr-4">
            {dayLabels.map((label, i) => (
              <span
                key={i}
                className={`text-[9px] ${i === peakDay ? "font-semibold text-[#b9bac0]" : "text-[#5a5b61]"}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-white/[0.06] pt-5">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#5a5b61]">Peak day</p>
            <p className="mt-1 text-sm font-medium text-[#e5e5e7]">June 7</p>
            <p className="mt-0.5 text-xs text-[#797b82]">$18.40 spend</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#5a5b61]">Avg/day</p>
            <p className="mt-1 text-sm font-medium text-[#e5e5e7]">$8.57</p>
            <p className="mt-0.5 text-xs text-[#797b82]">14-day average</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#5a5b61]">Budget remaining</p>
            <p className="mt-1 text-sm font-medium text-[#e5e5e7]">{raised ? "$380.00" : "$0.00"}</p>
            <p className="mt-0.5 text-xs text-[#797b82]">
              <span className="inline-flex items-center gap-1">
                <Clock size={10} />
                Resets June 30
              </span>
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5 rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-6">
        <h2 className="text-sm font-semibold text-[#eeeeef]">Request breakdown</h2>
        <p className="mt-1 text-xs text-[#797b82]">By model and endpoint</p>

        <div className="mt-5 space-y-3">
          {[
            { model: "gpt-4o", requests: 18420, pct: 38, cost: "$62.40" },
            { model: "gpt-4o-mini", requests: 22150, pct: 46, cost: "$44.30" },
            { model: "chatgpt-4o-latest", requests: 7721, pct: 16, cost: "$13.30" },
          ].map(({ model, requests, pct, cost }) => (
            <div key={model} className="group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-[#c4c5c9]">{model}</span>
                  <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-[#7a7b82]">{pct}%</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-[#797b82]">{requests.toLocaleString()} req</span>
                  <span className="font-medium text-[#e5e5e7]">{cost}</span>
                </div>
              </div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                <div
                  className="h-full rounded-full bg-[#4d8b70] transition-all duration-500 group-hover:bg-[#5fa882]"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
