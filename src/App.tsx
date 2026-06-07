import { Building2, Code2 } from "lucide-react";
import clsx from "clsx";
import { useState } from "react";
import { AgentProvider } from "./agent/AgentProvider";
import { OpenAIHost } from "./host/openai/OpenAIHost";
import { SettingsApp } from "./host/settings-app/SettingsApp";
import { SupportWidget } from "./widget/SupportWidget";

type DemoHost = "openai" | "settings";

function App() {
  const [host, setHost] = useState<DemoHost>("openai");

  return (
    <AgentProvider key={host}>
      <div className="relative min-h-screen">
        {host === "openai" ? <OpenAIHost /> : <SettingsApp />}

        <div
          className={clsx(
            "demo-switcher fixed bottom-5 left-5 z-40 flex items-center gap-1 rounded-full p-1",
            host === "openai" ? "demo-switcher--dark" : "demo-switcher--light",
          )}
          aria-label="Demo client"
        >
          <button
            type="button"
            onClick={() => setHost("openai")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-semibold transition ${
              host === "openai"
                ? "bg-white text-[#111] shadow-sm"
                : "text-current opacity-55 hover:opacity-100"
            }`}
          >
            <Code2 size={14} />
            ClosedAI
          </button>
          <button
            type="button"
            onClick={() => setHost("settings")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-semibold transition ${
              host === "settings"
                ? "bg-[#1e332b] text-white shadow-sm"
                : "text-current opacity-55 hover:opacity-100"
            }`}
          >
            <Building2 size={14} />
            Hearth
          </button>
        </div>

        <SupportWidget />
      </div>
    </AgentProvider>
  );
}

export default App;
