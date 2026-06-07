const bars = [18, 28, 22, 34, 31, 48, 44, 58, 51, 63, 70, 66, 79, 74];

export function UsagePage() {
  return (
    <div className="mx-auto w-full max-w-[1160px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
        <span>Project</span><span>/</span><span className="text-[#aaaab0]">Usage</span>
      </div>
      <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">Usage</h1>
      <p className="mt-2 text-sm text-[#8f9198]">Monitor API activity and project spend.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Total cost", "$0.00"],
          ["Requests", "0"],
          ["Monthly budget", "$120.00"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-5">
            <p className="text-xs text-[#797b82]">{label}</p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-[#f0f0f1]">{value}</p>
          </div>
        ))}
      </div>
      <section className="mt-5 rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#eeeeef]">Daily API requests</h2>
            <p className="mt-1 text-xs text-[#797b82]">May 24 to June 6</p>
          </div>
          <button className="rounded-lg border border-white/[0.09] bg-white/[0.03] px-3 py-2 text-xs text-[#b9bac0]">All models</button>
        </div>
        <div className="mt-10 flex h-52 items-end gap-3 border-b border-white/[0.08] px-2">
          {bars.map((height, index) => (
            <div key={index} className="flex-1 rounded-t bg-[#4d8b70]" style={{ height: `${height}%`, opacity: 0.58 + index * 0.025 }} />
          ))}
        </div>
      </section>
    </div>
  );
}
