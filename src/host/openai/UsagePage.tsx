const bars = [18, 28, 22, 34, 31, 48, 44, 58, 51, 63, 70, 66, 79, 74];

export function UsagePage() {
  return (
    <div className="mx-auto w-full max-w-[1120px] px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-[28px] font-semibold tracking-[-0.025em]">Usage</h1>
      <p className="mt-2 text-sm text-[#676765]">Monitor API activity and project spend.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Total cost", "$0.00"],
          ["Requests", "0"],
          ["Monthly budget", "$120.00"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#dededb] bg-white p-5">
            <p className="text-xs text-[#777]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-5 rounded-xl border border-[#dededb] bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Daily API requests</h2>
            <p className="mt-1 text-xs text-[#777]">May 24 to June 6</p>
          </div>
          <button className="rounded-lg border border-[#dededb] px-3 py-2 text-xs">All models</button>
        </div>
        <div className="mt-10 flex h-52 items-end gap-3 border-b border-[#e6e6e3] px-2">
          {bars.map((height, index) => (
            <div key={index} className="flex-1 rounded-t bg-[#b9d5ca]" style={{ height: `${height}%` }} />
          ))}
        </div>
      </section>
    </div>
  );
}
