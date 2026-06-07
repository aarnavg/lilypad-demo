import type { ScreenObservation, ScriptedScenario } from "../agent/types";

export const openAIScenarios: ScriptedScenario[] = [
  {
    id: "quota-user-error",
    host: "openai",
    triggerEvent: "request.quota_exceeded",
    userMessage: "Why is this request failing? I just made the key.",
    agentMessage:
      "That is not a product bug. Your project has $0 in credits, so the API rejects the request. Add a payment method and you will be set.",
    knowledgeQuery: "429 quota billing credits payment",
    detection: {
      id: "quota-detection",
      classification: "user_error",
      title: "Billing is not configured",
      rationale:
        "The request and API key are valid, but the project has no available credits.",
      evidence: [
        "The test request returned 429 insufficient_quota.",
        "Project credit balance is $0.00.",
      ],
      action: {
        id: "openai.go-to-billing",
        label: "Take me there",
        kind: "host",
        payload: { highlight: "payment" },
      },
    },
  },
  {
    id: "key-create-bug",
    host: "openai",
    triggerEvent: "key.create.failed",
    userMessage: "I clicked create. Did I miss something?",
    agentMessage:
      "You did everything right. The key creation request is failing on the product side, which makes this a bug.",
    knowledgeQuery: "project key create 500",
    detection: {
      id: "key-bug-detection",
      classification: "product_bug",
      title: "Secret key creation is failing",
      rationale:
        "A valid key creation attempt reached the service and returned an internal server error.",
      evidence: [
        "Create new secret key returned HTTP 500.",
        "The key name and project permissions were valid.",
      ],
      action: {
        id: "openai.file-key-bug",
        label: "File this bug",
        kind: "github",
      },
    },
  },
  {
    id: "per-key-spend-gap",
    host: "openai",
    triggerEvent: "feature.spend_limit.searched",
    userMessage: "Where can I set a monthly budget for just this key?",
    agentMessage:
      "You are not missing it. Per-key spend limits are not supported yet. I can log this as a feature request with what you were trying to do.",
    knowledgeQuery: "per key monthly spend limit budget",
    detection: {
      id: "spend-gap-detection",
      classification: "product_gap",
      title: "Per-key budgets are not available",
      rationale:
        "The product supports project budgets, but there is no control for a monthly cap on one API key.",
      evidence: [
        "You searched Limits for a per-key monthly budget.",
        "Only project-level budget controls are present.",
      ],
      action: {
        id: "openai.log-spend-feedback",
        label: "Send as feedback",
        kind: "feedback",
      },
    },
  },
];

export function findOpenAIScenario(observation: ScreenObservation) {
  return openAIScenarios.find(
    (scenario) =>
      scenario.host === observation.host &&
      scenario.triggerEvent === observation.event,
  );
}
