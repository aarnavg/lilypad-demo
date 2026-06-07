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
}: {
  page: OpenAIPage;
  onNavigate: (page: OpenAIPage) => void;
}) {
  return (
    <aside className="hidden w-[235px] shrink-0 border-r border-[#ececec] bg-[#f9f9f8] md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2.5 px-5">
        <div className="grid size-7 place-items-center rounded-full bg-[#111] text-sm font-semibold text-white">
          O
        </div>
        <span className="text-sm font-semibold tracking-tight">OpenAI Platform</span>
      </div>

      <nav className="space-y-1 px-3 py-3" aria-label="Platform navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            disabled={!id}
            onClick={() => id && onNavigate(id)}
            className={clsx(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] transition",
              id === page
                ? "bg-[#e9e9e7] font-medium text-[#111]"
                : "text-[#626260] hover:bg-[#efefed] hover:text-[#111]",
              !id && "cursor-default",
            )}
          >
            <Icon size={16} strokeWidth={1.8} />
            {label}
          </button>
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-[#ececec] p-3">
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-[#626260]">
          <SlidersHorizontal size={16} />
          Fine-tuning
        </button>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[13px] text-[#626260]">
          <Settings size={16} />
          Settings
        </button>
      </div>
    </aside>
  );
}
