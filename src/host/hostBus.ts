import type { ActionResult, ScreenObservation } from "../agent/types";

type ObservationListener = (observation: ScreenObservation) => void;
type ActionHandler = (
  payload?: Record<string, unknown>,
) => ActionResult | Promise<ActionResult>;

export interface HostBus {
  publish(observation: ScreenObservation): void;
  subscribe(listener: ObservationListener): () => void;
  registerAction(actionId: string, handler: ActionHandler): () => void;
  runAction(
    actionId: string,
    payload?: Record<string, unknown>,
  ): Promise<ActionResult>;
}

export function createHostBus(): HostBus {
  const listeners = new Set<ObservationListener>();
  const actions = new Map<string, ActionHandler>();

  return {
    publish(observation) {
      listeners.forEach((listener) => listener(observation));
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    registerAction(actionId, handler) {
      actions.set(actionId, handler);
      return () => {
        if (actions.get(actionId) === handler) {
          actions.delete(actionId);
        }
      };
    },
    async runAction(actionId, payload) {
      const handler = actions.get(actionId);
      if (!handler) {
        return {
          ok: false,
          message: `The host has not registered action "${actionId}".`,
        };
      }

      try {
        return await handler(payload);
      } catch (error) {
        return {
          ok: false,
          message:
            error instanceof Error
              ? error.message
              : "The host action could not be completed.",
        };
      }
    },
  };
}

export const hostBus = createHostBus();

export function publishHostObservation(
  observation: Omit<ScreenObservation, "id" | "timestamp">,
) {
  hostBus.publish({
    ...observation,
    id: `${observation.host}-${observation.event}-${Date.now()}`,
    timestamp: Date.now(),
  });
}
