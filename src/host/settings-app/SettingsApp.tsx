import {
  Archive,
  Bell,
  Check,
  ChevronRight,
  CreditCard,
  HelpCircle,
  Home,
  Lock,
  Moon,
  PauseCircle,
  Search,
  Sparkles,
  Sun,
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
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

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
    <div className="hearth min-h-screen bg-[var(--bg)] font-['Instrument_Sans',sans-serif] text-[var(--text)]">
      <header className="flex h-[72px] items-center justify-between border-b border-[var(--border)] bg-[var(--bg-secondary)]/80 px-5 backdrop-blur-xl md:px-8">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-full bg-[var(--accent)] text-white shadow-sm">
            <Sparkles size={17} />
          </div>
          <div>
            <span className="block font-['Newsreader'] text-lg font-semibold leading-none">
              Hearth
            </span>
            <span className="mt-1 block text-[10px] uppercase tracking-[.1em] text-[var(--text-muted)]">
              Your home, simplified
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[var(--text-muted)]">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="grid size-9 place-items-center rounded-full hover:bg-[var(--border)]"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="grid size-9 place-items-center rounded-full hover:bg-[var(--border)]"
            aria-label="Help"
          >
            <HelpCircle size={18} />
          </button>
          <div className="ml-1 grid size-9 place-items-center rounded-full bg-[var(--bg-tertiary)] text-xs font-semibold text-[var(--accent)]">
            DA
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-8 pb-24 md:grid-cols-[220px_1fr] md:px-8 md:py-12">
        <aside>
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--text-subtle)]">
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
                    ? "bg-[var(--surface)] font-medium text-[var(--accent)] shadow-[0_1px_0_var(--border),0_8px_22px_var(--border)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--surface)]/50 hover:text-[var(--text)]",
                )}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-7 hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 md:block">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Home size={15} />
              <p className="text-xs font-semibold">Juniper House</p>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-[var(--text-subtle)]">
              Four people share routines, devices, and the Home Archive.
            </p>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[var(--text-subtle)]">
                Personal settings
              </p>
              <h1 className="mt-2 font-['Newsreader'] text-4xl font-semibold tracking-[-0.03em]">
                {sections.find(([id]) => id === section)?.[1]}
              </h1>
              <p className="mt-2 text-sm text-[var(--text-muted)]">
                Manage Juniper House and your membership.
              </p>
            </div>
            <div className="rounded-full border border-[var(--border)] bg-[var(--surface-elevated)] px-3 py-1.5 text-[11px] text-[var(--text-muted)]">
              Home ID 3284
            </div>
          </div>

          <form onSubmit={search} className="relative mb-5">
            <label htmlFor="settings-search" className="sr-only">
              Search settings
            </label>
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
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
              className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)]/75 py-3.5 pl-11 pr-24 text-sm shadow-[0_10px_30px_var(--border)] outline-none placeholder:text-[var(--text-subtle)] focus:border-[var(--accent)]/30 focus:ring-4 focus:ring-[var(--accent)]/5"
            />
            <button className="absolute right-2 top-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-xs font-medium text-white hover:bg-[var(--accent-hover)]">
              Search
            </button>
          </form>

          {searched && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-[var(--warning-bg)] bg-[var(--warning-bg)] p-4 text-sm text-[var(--warning-text)]">
              <Search size={16} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">
                  No pause or moving option found for "{query}"
                </p>
                <p className="mt-1 text-xs text-[var(--warning-text)]">
                  Self-serve settings only expose downgrade and cancellation.
                </p>
              </div>
            </div>
          )}

          {section === "billing" ? (
            <div className="space-y-5">
              <section
                className={clsx(
                  "rounded-[24px] border bg-[var(--surface)]/80 p-6 shadow-[0_18px_50px_var(--border)] backdrop-blur",
                  automationActive
                    ? "border-[var(--accent)] ring-4 ring-[var(--accent)]/10"
                    : "border-[var(--border)]",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--text-subtle)]">
                      Current membership
                    </p>
                    <p className="mt-3 font-['Newsreader'] text-3xl font-semibold">
                      Hearth Plus
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      $24 monthly - renews June 28
                    </p>
                  </div>
                  {membershipPaused ? (
                    <div className="flex items-center gap-2 rounded-full bg-[var(--success-bg)] px-3 py-1.5 text-xs font-medium text-[var(--success-text)]">
                      <Check size={14} />
                      Paused until September 5
                    </div>
                  ) : (
                    <button className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-xs font-medium">
                      Manage membership
                      <ChevronRight size={14} />
                    </button>
                  )}
                </div>

                {automationActive && (
                  <div className="mt-6 flex items-center gap-3 rounded-2xl bg-[var(--success-bg)] p-4 text-sm text-[var(--success-text)]">
                    <span className="size-4 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
                    Lily is applying Policy 7B and preserving household data...
                  </div>
                )}

                {membershipPaused && (
                  <div className="mt-6 rounded-2xl bg-[var(--success-bg)] p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--success-text)]">
                      <PauseCircle size={17} />
                      90-day pause active
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[var(--text-muted)]">
                      Billing is stopped. Members, routines, and all 1,842
                      archive items remain available when service resumes.
                    </p>
                  </div>
                )}
              </section>

              <section className="rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/65 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-[var(--text-subtle)]">
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
                        className="rounded-2xl bg-[var(--bg-secondary)] p-4"
                      >
                        <ContextIcon size={16} className="text-[var(--accent)]" />
                        <p className="mt-3 text-sm font-semibold">{value}</p>
                        <p className="mt-1 text-[10px] text-[var(--text-subtle)]">
                          {label}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <p className="mt-4 text-xs text-[var(--text-muted)]">
                  Member since April 2024 - 26 consecutive paid months
                </p>
              </section>
            </div>
          ) : (
            <section className="overflow-hidden rounded-[24px] border border-[var(--border)] bg-[var(--surface)]/80 shadow-[0_18px_50px_var(--border)] backdrop-blur">
              {[
                ["Full name", "Demo Account"],
                ["Email address", "demo@hearth.test"],
                ["Home", "Juniper House"],
              ].map(([label, value]) => (
                <button
                  type="button"
                  key={label}
                  className="flex w-full items-center justify-between border-b border-[var(--border)] p-5 text-left last:border-b-0 hover:bg-[var(--bg-secondary)]"
                >
                  <div>
                    <p className="text-xs text-[var(--text-subtle)]">{label}</p>
                    <p className="mt-1 text-sm font-medium">{value}</p>
                  </div>
                  <ChevronRight size={16} className="text-[var(--text-subtle)]" />
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
            className="mt-4 hidden text-xs font-medium text-[var(--text-muted)] underline decoration-[var(--text-muted)]/30 underline-offset-4 hover:text-[var(--accent)] sm:inline-block"
          >
            Search "pause while I move without losing household routines"
          </button>
        </main>
      </div>
    </div>
  );
}
