import {
  Archive,
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Home,
  Lock,
  PauseCircle,
  Search,
  Sparkles,
  Users,
  WandSparkles,
  UserRound,
} from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { hostBus, publishHostObservation } from "../hostBus";

type SettingsSection = "account" | "security" | "notifications" | "billing";

const sections = [
  ["account", "Profile", UserRound],
  ["security", "Privacy", Lock],
  ["notifications", "Notifications", Bell],
  ["billing", "Membership", CreditCard],
] as const;

export function SettingsApp() {
  const [section, setSection] = useState<SettingsSection>("account");
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [membershipPaused, setMembershipPaused] = useState(false);
  const [automationActive, setAutomationActive] = useState(false);

  useEffect(
    () =>
      hostBus.registerAction("settings.pause-membership", async () => {
        setAutomationActive(true);
        setSection("billing");
        await new Promise((resolve) => window.setTimeout(resolve, 950));
        setMembershipPaused(true);
        setAutomationActive(false);
        return {
          ok: true,
          message:
            "Paused Hearth Plus through September 5. Four members, 18 routines, and the Home Archive stay intact.",
        };
      }),
    [],
  );

  function publishCancelSearch(searchQuery: string) {
    publishHostObservation({
      host: "settings",
      event: "subscription.cancel.searched",
      title: "Member wants to stop paying during a move",
      detail:
        "Self-serve search found no pause option, although cancelling would disable shared household features.",
      metadata: {
        query: searchQuery,
        paidMonths: 26,
        householdMembers: 4,
        savedRoutines: 18,
        archiveItems: 1842,
        renewalDate: "June 28, 2026",
      },
    });
  }

  function search(event: React.FormEvent) {
    event.preventDefault();
    if (!query.trim()) return;
    setSearched(true);
    if (/cancel|downgrade|stop|pause|move|membership/i.test(query)) {
      publishCancelSearch(query);
    }
  }

  return (
    <div className="hearth min-h-screen bg-[#edf0eb] font-['Instrument_Sans',sans-serif] text-[#1d2a24]">
      <header className="flex h-[72px] items-center justify-between border-b border-[#243b30]/10 bg-[#f8faf6]/80 px-5 backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-[#263f33] text-white shadow-sm">
            <Sparkles size={17} />
          </div>
          <div>
            <span className="block font-['Newsreader'] text-lg font-semibold leading-none">
              Hearth
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[.1em] text-[#7a877f]">
              Your home, simplified
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[#69766f]">
          <button
            className="grid size-9 place-items-center rounded-full hover:bg-[#243b30]/5"
            aria-label="Help"
          >
            <HelpCircle size={18} />
          </button>
          <div className="ml-1 grid size-9 place-items-center rounded-full bg-[#dbe7de] text-xs font-semibold text-[#3f5d4e]">
            DA
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-8 pb-24 md:grid-cols-[220px_1fr] md:px-8 md:py-12">
        <aside>
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[.12em] text-[#8b968f]">
            Settings
          </p>
          <nav className="grid grid-cols-2 gap-1 md:block md:space-y-1">
            {sections.map(([id, label, Icon]) => (
              <button
                type="button"
                key={id}
                onClick={() => setSection(id)}
                className={clsx(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  section === id
                    ? "bg-white font-medium text-[#263b31] shadow-[0_1px_0_rgba(38,59,49,.06),0_8px_22px_rgba(38,59,49,.06)]"
                    : "text-[#718078] hover:bg-white/50 hover:text-[#33483e]",
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-7 hidden rounded-2xl border border-[#2f493b]/10 bg-white/55 p-4 md:block">
            <div className="flex items-center gap-2 text-[#4c6758]">
              <Home size={15} />
              <p className="text-xs font-semibold">Juniper House</p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[#7b887f]">
              Four people share routines, devices, and the Home Archive.
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#829087]">
                Personal settings
              </p>
              <h1 className="mt-2 font-['Newsreader'] text-4xl font-semibold tracking-[-0.03em]">
                {sections.find(([id]) => id === section)?.[1]}
              </h1>
              <p className="mt-2 text-sm text-[#758179]">
                Manage Juniper House and your membership.
              </p>
            </div>
            <div className="rounded-full border border-[#375544]/10 bg-white/55 px-3 py-1.5 text-[11px] text-[#607068]">
              Home ID 3284
            </div>
          </div>

          <form onSubmit={search} className="relative mb-5">
            <label htmlFor="settings-search" className="sr-only">
              Search settings
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8c9891]"
              size={17}
            />
            <input
              id="settings-search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setSearched(false);
              }}
              placeholder="Search settings or describe what you need"
              className="w-full rounded-2xl border border-[#2e493a]/10 bg-white/75 py-3.5 pl-11 pr-24 text-sm shadow-[0_10px_30px_rgba(39,61,50,.05)] outline-none placeholder:text-[#9ba49f] focus:border-[#54715f]/30 focus:ring-4 focus:ring-[#54715f]/5"
            />
            <button className="absolute right-2 top-2 rounded-xl bg-[#263f33] px-4 py-2 text-xs font-medium text-white hover:bg-[#345443]">
              Search
            </button>
          </form>

          {searched && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[#d7c79e] bg-[#fff9e8] p-4 text-sm text-[#6f603b]">
              <Search size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">
                  No pause or moving option found for "{query}"
                </p>
                <p className="mt-1 text-xs text-[#8a7a52]">
                  Self-serve settings only expose downgrade and cancellation.
                </p>
              </div>
            </div>
          )}

          {section === "billing" ? (
            <div className="space-y-5">
              <section
                className={clsx(
                  "rounded-[24px] border bg-white/80 p-6 shadow-[0_18px_50px_rgba(38,59,49,.07)] backdrop-blur",
                  automationActive
                    ? "border-[#5e8a70] ring-4 ring-[#5e8a70]/10"
                    : "border-[#2f493b]/10",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#849088]">
                      Current membership
                    </p>
                    <p className="mt-3 font-['Newsreader'] text-3xl font-semibold">
                      Hearth Plus
                    </p>
                    <p className="mt-2 text-sm text-[#758179]">
                      $24 monthly - renews June 28
                    </p>
                  </div>
                  {membershipPaused ? (
                    <div className="flex items-center gap-2 rounded-full bg-[#e3f1e8] px-3 py-1.5 text-xs font-medium text-[#356247]">
                      <Check size={14} />
                      Paused until September 5
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 rounded-xl border border-[#304a3c]/12 bg-[#f8faf7] px-3 py-2 text-xs font-medium">
                      Manage membership
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {automationActive && (
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#eef5f0] p-4 text-sm text-[#456451]">
                    <span className="size-4 animate-spin rounded-full border-2 border-[#668b74] border-t-transparent" />
                    Lily is applying Policy 7B and preserving household data...
                  </div>
                )}

                {membershipPaused && (
                  <div className="mt-6 rounded-2xl bg-[#edf6f0] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#365f48]">
                      <PauseCircle size={17} />
                      90-day pause active
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#668071]">
                      Billing is stopped. Members, routines, and all 1,842
                      archive items remain available when service resumes.
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-[24px] border border-[#2f493b]/10 bg-white/65 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#849088]">
                  Account context
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      icon: Users,
                      value: "4 members",
                      label: "Shared household",
                    },
                    {
                      icon: WandSparkles,
                      value: "18 routines",
                      label: "Active automations",
                    },
                    {
                      icon: Archive,
                      value: "1,842 items",
                      label: "Home Archive",
                    },
                  ].map(({ icon: ContextIcon, value, label }) => {
                    return (
                      <div
                        key={String(value)}
                        className="rounded-2xl bg-[#f7f9f5] p-4"
                      >
                        <ContextIcon size={16} className="text-[#587061]" />
                        <p className="mt-3 text-sm font-semibold">{value}</p>
                        <p className="mt-1 text-[10px] text-[#829087]">
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-[#758179]">
                  Member since April 2024 - 26 consecutive paid months
                </p>
              </section>
            </div>
          ) : (
            <section className="overflow-hidden rounded-[24px] border border-[#2f493b]/10 bg-white/80 shadow-[0_18px_50px_rgba(38,59,49,.07)] backdrop-blur">
              {[
                ["Full name", "Demo Account"],
                ["Email address", "demo@hearth.test"],
                ["Home", "Juniper House"],
              ].map(([label, value]) => (
                <button
                  type="button"
                  key={label}
                  className="flex w-full items-center justify-between border-b border-[#304a3c]/8 p-5 text-left last:border-b-0 hover:bg-[#f7faf7]"
                >
                  <div>
                    <p className="text-xs text-[#859189]">{label}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                  <ChevronRight size={16} className="text-[#9ba59f]" />
                </button>
              ))}
            </section>
          )}

          <button
            type="button"
            onClick={() => {
              const searchQuery =
                "pause while I move without losing household routines";
              setQuery(searchQuery);
              setSearched(true);
              publishCancelSearch(searchQuery);
            }}
            className="mt-4 hidden text-xs font-medium text-[#60786b] underline decoration-[#60786b]/30 underline-offset-4 hover:text-[#304a3c] sm:inline-block"
          >
            Search "pause while I move without losing household routines"
          </button>
        </main>
      </div>
    </div>
  );
}
