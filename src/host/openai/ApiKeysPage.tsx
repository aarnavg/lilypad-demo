import { Check, Copy, MoreHorizontal, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { ApiKeyRow } from "./types";
import { QuickstartTest } from "./QuickstartTest";

export function ApiKeysPage({
  keys,
  onCreate,
  onTestRequest,
}: {
  keys: ApiKeyRow[];
  onCreate: (name: string) => Promise<{ ok: boolean; key?: string }>;
  onTestRequest: () => Promise<void>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string>();
  const [copied, setCopied] = useState(false);

  async function createKey() {
    setCreating(true);
    const result = await onCreate(name || "Demo key");
    setCreating(false);
    if (result.ok && result.key) {
      setGeneratedKey(result.key);
    } else {
      setModalOpen(false);
      setName("");
    }
  }

  function closeModal() {
    setModalOpen(false);
    setGeneratedKey(undefined);
    setName("");
  }

  return (
    <div className="mx-auto w-full max-w-[1160px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-9 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
            <span>Project</span><span>/</span><span className="text-[#aaaab0]">API keys</span>
          </div>
          <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">API keys</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#8f9198]">
            Manage secret keys for the Default project. Keep keys private and rotate them if exposed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-[#ececed] px-4 py-2.5 text-sm font-medium text-[#171719] shadow-sm hover:bg-white"
        >
          <Plus size={16} />
          Create new secret key
        </button>
      </div>

      <section className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#1b1c1f]">
        <div className="grid grid-cols-[1.5fr_1fr_.8fr_38px] border-b border-white/[0.07] bg-white/[0.025] px-5 py-3 text-[10px] font-medium uppercase tracking-[.09em] text-[#73757c]">
          <span>Name</span>
          <span>Secret key</span>
          <span>Last used</span>
          <span />
        </div>
        {keys.map((key) => (
          <div
            key={key.id}
            className="grid grid-cols-[1.5fr_1fr_.8fr_38px] items-center border-b border-white/[0.06] px-5 py-4 text-sm last:border-b-0 hover:bg-white/[0.025]"
          >
            <div>
              <p className="font-medium text-[#e9e9eb]">{key.name}</p>
              <p className="mt-1 text-xs text-[#707279]">Created {key.created}</p>
            </div>
            <code className="text-xs text-[#a3a5ac]">{key.preview}</code>
            <span className="text-xs text-[#797b82]">{key.lastUsed}</span>
            <button className="grid size-8 place-items-center rounded-md text-[#777980] hover:bg-white/[0.06] hover:text-white" aria-label={`Actions for ${key.name}`}>
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </section>

      <div className="mt-8">
        <QuickstartTest onSend={onTestRequest} />
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="fixed inset-0 z-40 grid place-items-center bg-black/65 p-4 backdrop-blur-[4px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-key-title"
              className="w-full max-w-md rounded-2xl border border-white/[0.1] bg-[#202125] p-6 text-[#f0f0f1] shadow-2xl"
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 id="create-key-title" className="text-lg font-semibold">
                    {generatedKey ? "Save your secret key" : "Create new secret key"}
                  </h2>
                  <p className="mt-1 text-sm text-[#909299]">
                    {generatedKey
                      ? "You will not be able to view this key again."
                      : "This key will belong to the Default project."}
                  </p>
                </div>
                <button type="button" onClick={closeModal} className="text-[#8a8c93] hover:text-white" aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              {generatedKey ? (
                <div className="mt-6">
                  <div className="flex items-center gap-2 rounded-lg border border-white/[0.09] bg-black/20 p-3">
                    <code className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-xs">
                      {generatedKey}
                    </code>
                    <button
                      type="button"
                      onClick={() => {
                        void navigator.clipboard?.writeText(generatedKey);
                        setCopied(true);
                      }}
                      className="grid size-8 place-items-center rounded-md bg-white/[0.08] text-[#d9d9db]"
                      aria-label="Copy key"
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </div>
                  <p className="mt-3 text-xs text-[#7f8188]">
                    Demo-only credential. It is not accepted by any API.
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-6 w-full rounded-lg bg-[#f0f0f1] px-4 py-2.5 text-sm font-medium text-[#171719]"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <label className="text-xs font-medium text-[#c9c9cc]" htmlFor="key-name">
                    Name
                  </label>
                  <input
                    id="key-name"
                    autoFocus
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="My test key"
                    className="mt-2 w-full rounded-lg border border-white/[0.1] bg-[#17181b] px-3 py-2.5 text-sm text-white outline-none placeholder:text-[#686a71] focus:border-[#777980] focus:ring-2 focus:ring-white/5"
                  />
                  <div className="mt-6 flex justify-end gap-2">
                    <button type="button" onClick={closeModal} className="rounded-lg px-4 py-2.5 text-sm font-medium text-[#aaaab0]">
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => void createKey()}
                      disabled={creating}
                      className="min-w-28 rounded-lg bg-[#f0f0f1] px-4 py-2.5 text-sm font-medium text-[#171719] disabled:opacity-60"
                    >
                      {creating ? "Creating..." : "Create key"}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
