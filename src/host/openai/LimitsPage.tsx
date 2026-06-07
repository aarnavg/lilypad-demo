import {
  Check,
  CheckCircle2,
  FolderPlus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import clsx from "clsx";
import { motion } from "motion/react";
import { useState } from "react";

export function LimitsPage({
  onSearchGap,
  budgetLabel = "$120.00 per month",
  highlight = false,
  verificationSuccess = false,
  workaroundCreated = false,
}: {
  onSearchGap: (query: string) => void;
  budgetLabel?: string;
  highlight?: boolean;
  verificationSuccess?: boolean;
  workaroundCreated?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const raised = budgetLabel.includes("$500");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    onSearchGap(query);
  }

  return (
    <div className="mx-auto w-full max-w-[1040px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
        <span>Production</span>
        <span>/</span>
        <span className="text-[#aaaab0]">Limits</span>
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">
            Limits
          </h1>
          <p className="mt-2 text-sm text-[#8f9198]">
            Project budgets, alerts, and workload usage.
          </p>
        </div>
        <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[10px] text-[#94969d]">
          Organization credits $87.42
        </span>
      </div>

      <form onSubmit={submit} className="relative mt-7">
        <Search
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777980]"
          size={17}
        />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearched(false);
          }}
          placeholder="Search limits, for example: cap prod-support-worker at $75"
          className="w-full rounded-xl border border-white/[0.09] bg-[#1b1c1f] py-3 pl-11 pr-28 text-sm text-[#e8e8ea] outline-none placeholder:text-[#65676e] focus:border-[#777980] focus:ring-2 focus:ring-white/5"
        />
        <button
          type="submit"
          className="absolute right-1.5 top-1.5 rounded-lg bg-[#eeeeef] px-4 py-2 text-xs font-medium text-[#171719]"
        >
          Search
        </button>
      </form>

      {searched && (
        <div className="mt-4 rounded-xl border border-[#685a3b] bg-[#29251b] p-5">
          <p className="text-sm font-medium text-[#f1dfb5]">
            No per-key budget control exists
          </p>
          <p className="mt-1 text-sm text-[#b7a986]">
            Search found usage for prod-support-worker, but budgets can only be
            attached to a project.
          </p>
        </div>
      )}

      {verificationSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#376d51] bg-[#183226] p-5"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 text-[#78c99a]" size={18} />
            <div>
              <p className="text-sm font-semibold text-[#b9efca]">
                Production is serving requests again
              </p>
              <p className="mt-1 text-xs text-[#83ae91]">
                Budget raised and existing alerts preserved.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <section
        className={clsx(
          "mt-6 rounded-xl border bg-[#1b1c1f] transition",
          highlight
            ? "border-[#5e8a70] ring-2 ring-[#5e8a70]/40"
            : "border-white/[0.08]",
        )}
      >
        <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-[#eeeeef]">
              Production monthly budget
            </h2>
            {highlight && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#1f3a2c] px-2 py-0.5 text-[10px] font-medium text-[#86d2a4]">
                <Check size={11} />
                Updated by Lily
              </span>
            )}
          </div>
          <SlidersHorizontal size={18} className="text-[#85878e]" />
        </div>
        <div className="p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[#dedee0]">{budgetLabel}</p>
              <p className="mt-1 text-xs text-[#7c7e85]">
                $120.00 spent - alerts at 80% and 100%
              </p>
            </div>
            <button className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#c8c8cb] hover:bg-white/[0.07]">
              Edit
            </button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className={raised ? "h-full bg-[#4d8b70]" : "h-full bg-[#bd5a4a]"}
              animate={{ width: raised ? "24%" : "100%" }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            />
          </div>
          <p className="mt-2 text-right text-[10px] text-[#777980]">
            {raised ? "24% used" : "100% used - requests blocked"}
          </p>
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-xl border border-white/[0.08] bg-[#1b1c1f]">
        <div className="border-b border-white/[0.07] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#eeeeef]">
            Spend by API key
          </h2>
          <p className="mt-1 text-xs text-[#777980]">
            Usage is visible by key, but limits cannot be configured here.
          </p>
        </div>
        <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4">
          <div>
            <p className="text-sm font-medium text-[#d8d8da]">
              prod-support-worker
            </p>
            <p className="mt-1 text-[10px] text-[#777980]">
              31,204 requests - closed-4.1-mini
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-[#eeeeef]">$83.64</p>
            <p className="mt-1 text-[10px] text-[#bd8b82]">
              69.7% of project spend
            </p>
          </div>
        </div>
      </section>

      {workaroundCreated && (
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 rounded-xl border border-[#486d58] bg-[#192b22] p-5"
        >
          <div className="flex items-start gap-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#294736] text-[#91d0a7]">
              <FolderPlus size={17} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold text-[#c5ead1]">
                  Prod worker isolated
                </p>
                <span className="rounded-full bg-[#2e513d] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[.08em] text-[#9bd6af]">
                  Workaround active
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-[#86a993]">
                New project with a $75 monthly budget, matching alerts, and the
                prod-support-worker service-key configuration.
              </p>
            </div>
          </div>
        </motion.section>
      )}

      <button
        type="button"
        onClick={() => {
          const demoQuery = "cap prod-support-worker at $75 per month";
          setQuery(demoQuery);
          setSearched(true);
          onSearchGap(demoQuery);
        }}
        className="mt-4 text-xs font-medium text-[#92949b] underline decoration-white/20 underline-offset-4 hover:text-white"
      >
        Search "cap prod-support-worker at $75 per month"
      </button>
    </div>
  );
}
