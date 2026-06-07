import { Building2, Code2 } from "lucide-react";
import { useState } from "react";
import { AgentProvider } from "./agent/AgentProvider";
import { OpenAIHost } from "./host/openai/OpenAIHost";
import { SettingsApp } from "./host/settings-app/SettingsApp";
import { ReportExportButton } from "./widget/ReportExportButton";
import { SupportWidget } from "./widget/SupportWidget";
import { mockReports } from "./data/mockReports";

type DemoHost = "openai" | "settings";

function App() {
  const [host, setHost] = useState<DemoHost>("openai");

  const reportData = {
    id: mockReports[0].id,
    title: mockReports[0].title,
    data: mockReports[0].data,
    generatedAt: new Date()
  };

  return (
    <AgentProvider key={host}>
      <div className="relative min-h-screen">
        {host === "openai" ? <OpenAIHost /> : <SettingsApp />}

        <div className="fixed bottom-4 left-4 z-40 flex items-center gap-1 rounded-xl border border-black/10 bg-white/90 p-1 shadow-lg backdrop-blur-md md:bottom-auto md:left-1/2 md:top-3 md:-translate-x-1/2">
          <button
            type="button"
            onClick={() => setHost("openai")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
              host === "openai"
                ? "bg-[#171717] text-white"
                : "text-[#656565] hover:bg-black/5"
            }`}
          >
            <Code2 size={14} />
            Developer platform
          </button>
          <button
            type="button"
            onClick={() => setHost("settings")}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-[11px] font-semibold transition ${
              host === "settings"
                ? "bg-[#5963cf] text-white"
                : "text-[#656565] hover:bg-black/5"
            }`}
          >
            <Building2 size={14} />
            Account settings
          </button>
        </div>

        <ReportExportButton reportData={reportData} />
        <SupportWidget />
      </div>
    </AgentProvider>
  );
}

export default App;

