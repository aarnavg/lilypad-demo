import { Bell, ChevronDown, CircleHelp, Menu } from "lucide-react";

export function TopBar({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#ececec] bg-white px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="grid size-9 place-items-center rounded-md text-[#666] md:hidden"
          onClick={onOpenMobile}
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-[#f5f5f4]">
          Personal
          <span className="text-[#aaa]">/</span>
          Default project
          <ChevronDown size={14} className="text-[#777]" />
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <button className="grid size-9 place-items-center rounded-md text-[#666] hover:bg-[#f5f5f4]" aria-label="Help">
          <CircleHelp size={18} />
        </button>
        <button className="grid size-9 place-items-center rounded-md text-[#666] hover:bg-[#f5f5f4]" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="ml-2 grid size-8 place-items-center rounded-full bg-[#d9d8ff] text-xs font-semibold text-[#4a4891]">
          DA
        </div>
      </div>
    </header>
  );
}
