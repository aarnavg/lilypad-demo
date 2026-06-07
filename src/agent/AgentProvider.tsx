import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LiveSupportAgent } from "./LiveSupportAgent";
import { MockSupportAgent } from "./MockSupportAgent";
import type { SupportAgentClient } from "./types";

const AgentContext = createContext<SupportAgentClient | null>(null);

export function AgentProvider({ children }: { children: ReactNode }) {
  const client = useMemo<SupportAgentClient>(
    () =>
      import.meta.env.VITE_AGENT_MODE === "live"
        ? new LiveSupportAgent()
        : new MockSupportAgent(),
    [],
  );

  useEffect(() => {
    client.start();
    return () => client.stop();
  }, [client]);

  return <AgentContext.Provider value={client}>{children}</AgentContext.Provider>;
}

export function useSupportAgent() {
  const client = useContext(AgentContext);
  if (!client) {
    throw new Error("useSupportAgent must be used within AgentProvider");
  }

  const state = useSyncExternalStore(
    (listener) => client.subscribe(listener),
    () => client.getState(),
    () => client.getState(),
  );

  return { client, state };
}
