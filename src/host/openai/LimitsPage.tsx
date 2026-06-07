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
    <div className="mx-auto w-full max-w-[920px] px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-[28px] font-semibold tracking-[-0.025em]">Limits</h1>
      <p className="mt-2 text-sm text-[#676765]">Set project budgets, alerts, and rate limits.</p>
      <form onSubmit={submit} className="relative mt-7">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888]" size={17} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSearched(false);
          }}
          placeholder="Search limits, for example: monthly budget per key"
          className="w-full rounded-xl border border-[#d9d9d6] bg-white py-3 pl-11 pr-28 text-sm outline-none focus:border-[#777] focus:ring-2 focus:ring-black/5"
        />
        <button type="submit" className="absolute right-1.5 top-1.5 rounded-lg bg-[#111] px-4 py-2 text-xs font-medium text-white">
          Search
        </button>
      </form>

      {searched && (
        <div className="mt-4 rounded-xl border border-[#e0d8cb] bg-[#fffaf1] p-5">
          <p className="text-sm font-medium">No matching control found</p>
          <p className="mt-1 text-sm text-[#756f66]">
            Budgets can be configured for this project, but not for an individual API key.
          </p>
        </div>
      )}

      <section className="mt-6 rounded-xl border border-[#dededb] bg-white">
        <div className="flex items-center justify-between border-b border-[#ececea] p-5">
          <div>
            <h2 className="text-sm font-semibold">Monthly budget</h2>
            <p className="mt-1 text-xs text-[#777]">Applies to the Default project</p>
          </div>
          <SlidersHorizontal size={18} className="text-[#777]" />
        </div>
        <div className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm font-medium">$120.00 per month</p>
            <p className="mt-1 text-xs text-[#777]">Email alerts at 80% and 100%</p>
          </div>
          <button className="rounded-lg border border-[#dadad7] px-3 py-2 text-xs font-medium">Edit</button>
        </div>
      </section>
      <button
        type="button"
        onClick={() => {
          setQuery("monthly budget per key");
          setSearched(true);
          onSearchGap("monthly budget per key");
        }}
        className="mt-4 text-xs font-medium text-[#666] underline underline-offset-4"
      >
        Try “monthly budget per key”
      </button>
    </div>
  );
}
