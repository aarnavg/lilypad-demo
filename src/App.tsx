import { Building2, Code2, Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { AgentProvider } from "./agent/AgentProvider";
import { OpenAIHost } from "./host/openai/OpenAIHost";
import { SettingsApp } from "./host/settings-app/SettingsApp";
import { SupportWidget } from "./widget/SupportWidget";

type DemoHost = "openai" | "settings";

function App() {
  const [host, setHost] = useState<DemoHost>("openai");
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
            aria-label="ClosedAI demo"
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-2 text-[11px] font-semibold transition sm:px-3 ${
              host === "openai"
                ? "bg-white text-[#111] shadow-sm"
                : "text-current opacity-55 hover:opacity-100"
            }`}
          >
            <Code2 size={14} />
            <span className="hidden sm:inline">ClosedAI</span>
          </button>
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-2 text-[11px] font-semibold transition sm:px-3 ${
              host === "openai"
                ? "bg-white text-[#111] shadow-sm"
                : "text-current opacity-55 hover:opacity-100"
            }`}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            type="button"
            onClick={() => setHost("settings")}
            aria-label="Hearth demo"
            className={`flex items-center gap-2 whitespace-nowrap rounded-full px-2.5 py-2 text-[11px] font-semibold transition sm:px-3 ${
              host === "settings"
                ? "bg-[#1e332b] text-white shadow-sm"
                : "text-current opacity-55 hover:opacity-100"
            }`}
          >
            <Building2 size={14} />
            <span className="hidden sm:inline">Hearth</span>
          </button>
        </div>

        <SupportWidget />
      </div>
    </AgentProvider>
  );
}

export default App;
