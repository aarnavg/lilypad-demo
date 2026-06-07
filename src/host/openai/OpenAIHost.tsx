import { AlertCircle, X } from "lucide-react";
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
    name: "Development key",
    preview: "sk-demo-••••••••3Qx",
    created: "May 18, 2026",
    lastUsed: "Never",
  },
];

export function OpenAIHost() {
  const [page, setPage] = useState<OpenAIPage>("api-keys");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [keys, setKeys] = useState(initialKeys);
  const [createAttempts, setCreateAttempts] = useState(0);
  const [toast, setToast] = useState<string>();
  const [highlightPayment, setHighlightPayment] = useState(false);

  useEffect(
    () =>
      hostBus.registerAction("openai.go-to-billing", async () => {
        setPage("billing");
        await new Promise((resolve) => window.setTimeout(resolve, 250));
        setHighlightPayment(true);
        window.setTimeout(() => setHighlightPayment(false), 3500);
        return { ok: true, message: "Took you to Billing and highlighted Add payment method." };
      }),
    [],
  );

  async function createKey(name: string) {
    await new Promise((resolve) => window.setTimeout(resolve, 850));
    const shouldFail = createAttempts > 0;
    setCreateAttempts((attempts) => attempts + 1);

    if (shouldFail) {
      setToast("Something went wrong while creating the key (500)");
      publishHostObservation({
        host: "openai",
        event: "key.create.failed",
        title: "Secret key creation failed",
        detail: "The create request returned HTTP 500 after valid input.",
        metadata: { status: 500, keyName: name },
      });
      window.setTimeout(() => setToast(undefined), 5000);
      return { ok: false };
    }

    const demoKey = "sk-demo-NOT-A-REAL-KEY-lily-7Qp";
    setKeys((current) => [
      ...current,
      {
        id: `key-${Date.now()}`,
        name,
        preview: "sk-demo-••••••••7Qp",
        created: "just now",
        lastUsed: "Never",
      },
    ]);
    return { ok: true, key: demoKey };
  }

  async function sendTestRequest() {
    await new Promise((resolve) => window.setTimeout(resolve, 750));
    publishHostObservation({
      host: "openai",
      event: "request.quota_exceeded",
      title: "Test request returned insufficient quota",
      detail: "HTTP 429: Project has a $0.00 credit balance.",
      metadata: { status: 429, balance: 0 },
    });
  }

  function searchLimits(query: string) {
    const normalized = query.toLowerCase();
    if (
      normalized.includes("key") &&
      ["limit", "budget", "spend", "monthly"].some((term) =>
        normalized.includes(term),
      )
    ) {
      publishHostObservation({
        host: "openai",
        event: "feature.spend_limit.searched",
        title: "Searched for a per-key spend limit",
        detail: `No control matched "${query}". Only project-level budgets are available.`,
        metadata: { query },
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
            <ApiKeysPage keys={keys} onCreate={createKey} onTestRequest={sendTestRequest} />
          )}
          {page === "usage" && <UsagePage />}
          {page === "billing" && <BillingPage highlightPayment={highlightPayment} />}
          {page === "limits" && <LimitsPage onSearchGap={searchLimits} />}
        </main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed right-5 top-20 z-30 flex max-w-sm items-start gap-3 rounded-xl border border-[#713e3a] bg-[#2a1b1a]/95 p-4 text-[#ffb4aa] shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, x: 20, y: -8 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <AlertCircle className="mt-0.5 shrink-0" size={18} />
            <div className="min-w-0">
              <p className="text-sm font-semibold">Could not create secret key</p>
              <p className="mt-1 text-xs leading-5 text-[#d99b94]">{toast}</p>
            </div>
            <button type="button" onClick={() => setToast(undefined)} aria-label="Dismiss error">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
