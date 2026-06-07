import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

export function LimitsPage({ onSearchGap }: { onSearchGap: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    onSearchGap(query);
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
        <span>Project</span><span>/</span><span className="text-[#aaaab0]">Limits</span>
      </div>
      <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">Limits</h1>
      <p className="mt-2 text-sm text-[#8f9198]">Set project budgets, alerts, and rate limits.</p>
      <form onSubmit={submit} className="relative mt-7">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777980]" size={17} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearched(false);
          }}
          placeholder="Search limits, for example: monthly budget per key"
          className="w-full rounded-xl border border-white/[0.09] bg-[#1b1c1f] py-3 pl-11 pr-28 text-sm text-[#e8e8ea] outline-none placeholder:text-[#65676e] focus:border-[#777980] focus:ring-2 focus:ring-white/5"
        />
        <button type="submit" className="absolute right-1.5 top-1.5 rounded-lg bg-[#eeeeef] px-4 py-2 text-xs font-medium text-[#171719]">
          Search
        </button>
      </form>

      {searched && (
        <div className="mt-4 rounded-xl border border-[#685a3b] bg-[#29251b] p-5">
          <p className="text-sm font-medium text-[#f1dfb5]">No matching control found</p>
          <p className="mt-1 text-sm text-[#b7a986]">
            Budgets can be configured for this project, but not for an individual API key.
          </p>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-white/[0.08] bg-[#1b1c1f]">
        <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
          <div>
            <h2 className="text-sm font-semibold text-[#eeeeef]">Monthly budget</h2>
            <p className="mt-1 text-xs text-[#7c7e85]">Applies to the Default project</p>
          </div>
          <SlidersHorizontal size={18} className="text-[#85878e]" />
        </div>
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium text-[#dedee0]">$120.00 per month</p>
            <p className="mt-1 text-xs text-[#7c7e85]">Email alerts at 80% and 100%</p>
          </div>
          <button className="rounded-lg border border-white/[0.1] bg-white/[0.03] px-3 py-2 text-xs font-medium text-[#c8c8cb] hover:bg-white/[0.07]">Edit</button>
        </div>
      </section>
      <button
        type="button"
        onClick={() => {
          setQuery("monthly budget per key");
          setSearched(true);
          onSearchGap("monthly budget per key");
        }}
        className="mt-4 text-xs font-medium text-[#92949b] underline decoration-white/20 underline-offset-4 hover:text-white"
      >
        Search “monthly budget per key”
      </button>
    </div>
  );
}
