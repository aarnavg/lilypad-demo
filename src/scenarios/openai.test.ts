import { describe, expect, it } from "vitest";
import { findOpenAIScenario } from "./openai";

describe("OpenAI scenarios", () => {
  it.each([
    ["request.quota_exceeded", "user_error"],
    ["key.create.failed", "product_bug"],
    ["feature.spend_limit.searched", "product_gap"],
  ] as const)("maps %s to %s", (event, classification) => {
    const scenario = findOpenAIScenario({
      id: event,
      host: "openai",
      event,
      title: "Observed event",
      detail: "Evidence",
      timestamp: 1,
    });

    expect(scenario?.detection.classification).toBe(classification);
  });

  it("ignores unrelated observations", () => {
    expect(
      findOpenAIScenario({
        id: "other",
        host: "openai",
        event: "page.viewed",
        title: "Page viewed",
        detail: "No support issue",
        timestamp: 1,
      }),
    ).toBeUndefined();
  });
});
