import { Bell, ChevronDown, CircleHelp, Menu } from "lucide-react";

export function TopBar({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#151619]/95 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-md text-[#a1a1a8] md:hidden"
          onClick={onOpenMobile}
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <button className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-[13px] font-medium text-[#e7e7e9] hover:bg-white/[0.06]">
          <span className="hidden sm:inline">Acme AI</span>
          <span className="hidden text-[#6b6d73] sm:inline">/</span>
          <span>Production</span>
          <ChevronDown size={14} className="text-[#9a9c9f]" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="mr-2 hidden items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] text-[#b8b9bf] sm:flex">
          <span className="size-1.5 rounded-full bg-[#55b882]" />
          All systems operational
        </div>
        <button className="grid size-9 place-items-center rounded-md text-[#a8aaaf] hover:bg-white/[0.06] hover:text-white" aria-label="Help">
          <CircleHelp size={18} />
        </button>
        <button className="grid size-9 place-items-center rounded-md text-[#a8aaaf] hover:bg-white/[0.06] hover:text-white" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="ml-2 grid size-8 place-items-center rounded-full bg-[#d9d8ff] text-xs font-semibold text-[#4a4891]">
          DA
        </div>
      </div>
    </header>
  );
}
