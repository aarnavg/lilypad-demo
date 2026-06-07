import {
  BarChart3,
  BookOpen,
  CreditCard,
  Gauge,
  KeyRound,
  LayoutGrid,
  Settings,
  SlidersHorizontal,
} from "lucide-react";
import clsx from "clsx";
import type { OpenAIPage } from "./types";

const navigation: Array<{
  id?: OpenAIPage;
  label: string;
  icon: typeof LayoutGrid;
}> = [
  { label: "Playground", icon: LayoutGrid },
  { id: "api-keys", label: "API keys", icon: KeyRound },
  { id: "usage", label: "Usage", icon: BarChart3 },
  { label: "Logs", icon: BookOpen },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "limits", label: "Limits", icon: Gauge },
];

export function Sidebar({
  page,
  onNavigate,
  mobile = false,
}: {
  page: OpenAIPage;
  onNavigate: (page: OpenAIPage) => void;
  mobile?: boolean;
}) {
  return (
    <aside
      className={clsx(
        "w-[244px] shrink-0 border-r border-white/[0.07] bg-[#111214]",
        mobile ? "flex h-screen flex-col" : "hidden md:flex md:flex-col",
      )}
    >
      <div className="flex h-16 items-center gap-2.5 px-4">
        <div className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.06] text-[13px] font-semibold text-white">
          C
        </div>
        <div>
          <span className="block text-sm font-semibold tracking-tight text-[#f4f4f5]">ClosedAI</span>
          <span className="block text-[10px] text-[#777980]">Developer Platform</span>
        </div>
      </div>

      <p className="px-5 pb-2 pt-4 text-[10px] font-medium uppercase tracking-[.12em] text-[#66686f]">
        Build
      </p>
      <nav className="space-y-0.5 px-2.5" aria-label="Platform navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            disabled={!id}
            onClick={() => id && onNavigate(id)}
            className={clsx(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition",
              id === page
                ? "bg-white/[0.09] font-medium text-white"
                : "text-[#999ba2] hover:bg-white/[0.05] hover:text-[#e5e5e7]",
              !id && "cursor-default",
            )}
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/[0.07] p-3 pb-20">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-[#8d8f96] hover:bg-white/[0.05] hover:text-white">
          <SlidersHorizontal size={16} />
          Fine-tuning
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] text-[#8d8f96] hover:bg-white/[0.05] hover:text-white">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  );
}
