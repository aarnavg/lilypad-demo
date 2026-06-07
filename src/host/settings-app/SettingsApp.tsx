import {
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Lock,
  Search,
  UserRound,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { hostBus, publishHostObservation } from "../hostBus";

type SettingsSection = "account" | "security" | "notifications" | "billing";

const sections = [
  ["account", "Account", UserRound],
  ["security", "Security", Lock],
  ["notifications", "Notifications", Bell],
  ["billing", "Billing", CreditCard],
] as const;

export function SettingsApp() {
  const [section, setSection] = useState<SettingsSection>("account");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [plan, setPlan] = useState("Pro");
  const [automationActive, setAutomationActive] = useState(false);

  useEffect(
    () =>
      hostBus.registerAction("settings.downgrade-plan", async () => {
        setAutomationActive(true);
        setSection("billing");
        await new Promise((resolve) => window.setTimeout(resolve, 900));
        setPlan("Free");
        setAutomationActive(false);
        return { ok: true, message: "Your plan is now set to downgrade to Free at the end of the billing period." };
      }),
    [],
  );

  function search(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    if (/cancel|downgrade|stop|subscription/i.test(query)) {
      publishHostObservation({
        host: "settings",
        event: "subscription.cancel.searched",
        title: "Could not find subscription cancellation",
        detail: `The user searched Settings for "${query}" while the control remained under Billing.`,
        metadata: { query },
      });
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] font-[Inter,Arial,sans-serif] text-[#20242b]">
      <header className="flex h-16 items-center justify-between border-b border-[#e3e5e9] bg-white px-5 md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-xl bg-[#5b65d9] font-semibold text-white">N</div>
          <span className="text-sm font-semibold">Northstar</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-[#69707d]">
          <HelpCircle size={18} />
          <div className="grid size-8 place-items-center rounded-full bg-[#e8eafe] font-semibold text-[#555db5]">DA</div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1080px] gap-8 px-5 py-10 md:grid-cols-[220px_1fr] md:px-8">
        <aside>
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[.08em] text-[#969ca7]">Settings</p>
          <nav className="space-y-1">
            {sections.map(([id, label, Icon]) => (
              <button
                type="button"
                key={id}
                onClick={() => setSection(id)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                  section === id ? "bg-white font-medium text-[#303541] shadow-sm" : "text-[#737a86]",
                )}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main>
          <div className="mb-7">
            <h1 className="text-2xl font-semibold tracking-tight">{sections.find(([id]) => id === section)?.[1]}</h1>
            <p className="mt-1 text-sm text-[#767d88]">Manage your workspace and subscription preferences.</p>
          </div>

          <form onSubmit={search} className="relative mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9299a4]" size={17} />
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearched(false);
              }}
              placeholder="Search settings, e.g. cancel my subscription"
              className="w-full rounded-xl border border-[#dfe2e7] bg-white py-3 pl-11 pr-24 text-sm shadow-sm outline-none focus:border-[#8a91e7]"
            />
            <button className="absolute right-1.5 top-1.5 rounded-lg bg-[#5963cf] px-4 py-2 text-xs font-medium text-white">Search</button>
          </form>

          {searched && (
            <div className="mb-5 rounded-xl border border-[#f0dcae] bg-[#fffaf0] p-4 text-sm text-[#76613a]">
              No direct setting matched “{query}”. Try reviewing your account or billing details.
            </div>
          )}

          {section === "billing" ? (
            <section className={clsx("rounded-2xl border bg-white p-6 shadow-sm", automationActive ? "border-[#8b92ea] ring-4 ring-[#8b92ea]/15" : "border-[#e0e3e8]")}>
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[.08em] text-[#8a909b]">Current plan</p>
                  <p className="mt-2 text-2xl font-semibold">{plan}</p>
                  <p className="mt-2 text-sm text-[#747b86]">
                    {plan === "Free" ? "Downgrade scheduled for the end of this billing period." : "$24 per user, billed monthly."}
                  </p>
                </div>
                {plan === "Free" ? (
                  <div className="flex items-center gap-2 rounded-full bg-[#e9f6ee] px-3 py-1.5 text-xs font-medium text-[#31714c]">
                    <Check size={14} />
                    Change confirmed
                  </div>
                ) : (
                  <button className="flex items-center gap-2 rounded-lg border border-[#dce0e5] px-3 py-2 text-xs font-medium">
                    Manage plan
                    <ChevronRight size={14} />
                  </button>
                )}
              </div>
              {automationActive && (
                <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f0f1ff] p-4 text-sm text-[#535ba9]">
                  <span className="size-4 animate-spin rounded-full border-2 border-[#7d84de] border-t-transparent" />
                  Lily is opening plan controls and confirming the downgrade...
                </div>
              )}
            </section>
          ) : (
            <section className="overflow-hidden rounded-2xl border border-[#e0e3e8] bg-white shadow-sm">
              {[
                ["Full name", "Demo Account"],
                ["Email address", "demo@northstar.test"],
                ["Workspace", "Northstar Demo"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-[#eceef1] p-5 last:border-b-0">
                  <div>
                    <p className="text-xs text-[#888f9a]">{label}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#a1a7b1]" />
                </div>
              ))}
            </section>
          )}

          <button
            type="button"
            onClick={() => {
              setQuery("cancel my subscription");
              setSearched(true);
              publishHostObservation({
                host: "settings",
                event: "subscription.cancel.searched",
                title: "Could not find subscription cancellation",
                detail: "The user searched Settings for cancel my subscription.",
              });
            }}
            className="mt-4 text-xs font-medium text-[#666db8] underline underline-offset-4"
          >
            Try “cancel my subscription”
          </button>
        </main>
      </div>
    </div>
  );
}
