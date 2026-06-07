import { describe, expect, it, vi } from "vitest";
import { createHostBus } from "./hostBus";

describe("hostBus", () => {
  it("publishes structured observations to subscribers", () => {
    const bus = createHostBus();
    const listener = vi.fn();
    const observation = {
      id: "obs-1",
      host: "openai" as const,
      event: "request.quota_exceeded",
      title: "Test request failed",
      detail: "429 insufficient_quota",
      timestamp: 1,
    };

    const unsubscribe = bus.subscribe(listener);
    bus.publish(observation);

    expect(listener).toHaveBeenCalledWith(observation);
    unsubscribe();
  });

  it("runs registered host actions and cleans them up", async () => {
    const bus = createHostBus();
    const handler = vi.fn().mockResolvedValue({
      ok: true,
      message: "Took you to Billing",
    });
    const unregister = bus.registerAction("openai.go-to-billing", handler);

    await expect(
      bus.runAction("openai.go-to-billing", { highlight: "payment" }),
    ).resolves.toEqual({
      ok: true,
      message: "Took you to Billing",
    });
    expect(handler).toHaveBeenCalledWith({ highlight: "payment" });

    unregister();
    await expect(bus.runAction("openai.go-to-billing")).resolves.toMatchObject({
      ok: false,
    });
  });
});
