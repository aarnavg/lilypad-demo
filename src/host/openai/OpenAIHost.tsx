import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { hostBus, publishHostObservation } from "../hostBus";
import { ApiKeysPage } from "./ApiKeysPage";
import { BillingPage } from "./BillingPage";
import { LimitsPage } from "./LimitsPage";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import type { ApiKeyRow, OpenAIPage } from "./types";
import { UsagePage } from "./UsagePage";

const initialKeys: ApiKeyRow[] = [
  {
    id: "default-key",
    name: "prod-support-worker",
    preview: "sk-demo-********3Qx",
    type: "Service account",
    scopes: "Restricted",
    created: "May 18, 2026",
    lastUsed: "2 min ago",
  },
];

export function OpenAIHost() {
  const [page, setPage] = useState<OpenAIPage>("api-keys");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [keys, setKeys] = useState(initialKeys);
  const [budgetLabel, setBudgetLabel] = useState("$120.00 per month");
  const [highlightBudget, setHighlightBudget] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [workaroundCreated, setWorkaroundCreated] = useState(false);

  useEffect(
    () =>
      hostBus.registerAction("openai.raise-budget", async () => {
        setPage("limits");
        await new Promise((resolve) => window.setTimeout(resolve, 300));
        setHighlightBudget(true);
        setBudgetLabel("$500.00 per month");
        await new Promise((resolve) => window.setTimeout(resolve, 650));
        setVerificationSuccess(true);
        window.setTimeout(() => setHighlightBudget(false), 4000);
        return {
          ok: true,
          message:
            "Raised Production to $500, preserved both alerts, and verified req_retry_8b12 returned 200.",
        };
      }),
    [],
  );

  useEffect(
    () =>
      hostBus.registerAction("openai.create-budget-workaround", async () => {
        setPage("limits");
        await new Promise((resolve) => window.setTimeout(resolve, 850));
        setWorkaroundCreated(true);
        return {
          ok: true,
          message:
            "Created project Prod worker isolated with a $75 monthly budget and moved the service-key configuration.",
        };
      }),
    [],
  );

  async function createKey(
    name: string,
    options: { type: string; scopes: string[] },
  ) {
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    const restricted = !options.scopes.includes("all");

    // Restricted service keys are failing today (an auth regression on
    // ClosedAI's side). The page shows a normal, human error — the deep cause is
    // what Lily uncovers from the company's deploy notes.
    if (restricted) {
      publishHostObservation({
        host: "openai",
        event: "key.create.failed",
        title: "Restricted service-key creation failed",
        detail:
          "Restricted service-key creation returned HTTP 500 after client validation.",
        metadata: {
          status: 500,
          keyName: name,
          keyType: options.type,
          scopes: options.scopes.join(", "),
          requestId: "req_91c2e8",
          region: "us-west",
          deployment: "auth-v2.3.1",
        },
      });
      return {
        ok: false,
        error:
          "Something went wrong creating this key. Your details look right — please try again in a moment.",
      };
    }

    const demoKey = "sk-demo-NOT-A-REAL-KEY-lily-7Qp";
    setKeys((current) => [
      ...current,
      {
        id: `key-${Date.now()}`,
        name,
        preview: "sk-demo-********7Qp",
        type: options.type,
        scopes: options.scopes.length > 1 ? "Restricted" : options.scopes[0],
        created: "just now",
        lastUsed: "Never",
      },
    ]);
    return { ok: true, key: demoKey };
  }

  // The customer's production traffic is being declined. They notice it on the
  // Usage dashboard (a real product surface) and reach for support from there.
  function reportBlockedRequests() {
    publishHostObservation({
      host: "openai",
      event: "request.quota_exceeded",
      title: "Production requests are being declined",
      detail:
        "HTTP 429 insufficient_quota despite $87.42 organization credits.",
      metadata: {
        status: 429,
        requestId: "req_7f3a91",
        organizationCredits: 87.42,
        projectSpend: 120,
        projectBudget: 120,
        project: "Production",
      },
    });
  }

  function searchLimits(query: string) {
    const normalized = query.toLowerCase();
    if (
      (normalized.includes("key") ||
        normalized.includes("prod-support-worker")) &&
      ["limit", "budget", "spend", "monthly", "cap"].some((term) =>
        normalized.includes(term),
      )
    ) {
      publishHostObservation({
        host: "openai",
        event: "feature.spend_limit.searched",
        title: "Searched for a per-key spend limit",
        detail: `No control matched "${query}". Only project-level budgets are available.`,
        metadata: {
          query,
          key: "prod-support-worker",
          keySpend: 83.64,
          similarRequests: 37,
        },
      });
    }
  }

  return (
    <div className="closedai flex min-h-screen bg-[#151619] text-[#f2f2f3]">
      <Sidebar page={page} onNavigate={setPage} />
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileNavOpen(false)}
          >
            <motion.div
              className="h-full w-[244px] bg-[#111214] shadow-[20px_0_60px_rgba(0,0,0,0.45)]"
              initial={{ x: -24, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -24, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
            >
              <Sidebar
                mobile
                page={page}
                onNavigate={(nextPage) => {
                  setPage(nextPage);
                  setMobileNavOpen(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onOpenMobile={() => setMobileNavOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto pb-20">
          {page === "api-keys" && (
            <ApiKeysPage keys={keys} onCreate={createKey} />
          )}
          {page === "usage" && (
            <UsagePage
              budgetLabel={budgetLabel}
              onGetHelp={reportBlockedRequests}
            />
          )}
          {page === "billing" && <BillingPage highlightPayment={false} />}
          {page === "limits" && (
            <LimitsPage
              onSearchGap={searchLimits}
              budgetLabel={budgetLabel}
              highlight={highlightBudget}
              verificationSuccess={verificationSuccess}
              workaroundCreated={workaroundCreated}
            />
          )}
        </main>
      </div>
    </div>
  );
}
