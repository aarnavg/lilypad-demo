import type { ScreenObservation, ScriptedScenario } from "../agent/types";

/**
 * Each answer requires both live host state and company-private knowledge.
 * A generic model only sees an ambiguous symptom; Lily can prove the cause.
 */
export const openAIScenarios: ScriptedScenario[] = [
  {
    id: "quota-budget-cap",
    host: "openai",
    triggerEvent: "request.quota_exceeded",
    userMessage:
      "Why is production blocked? We still have credits in the organization.",
    agentMessage:
      "Billing is healthy: $87.42 remains. Your private policy says this generic 429 also fires at a project cap, and Production is exactly $120 of $120. I can raise it, keep both alerts, and verify a retry.",
    knowledgeQuery:
      "429 insufficient_quota project budget credits retry 200 alerts resolved raise",
    detection: {
      id: "quota-detection",
      classification: "user_error",
      title: "Production hit its project budget",
      rationale:
        "The public error is ambiguous, but private policy plus live account state isolates the project cap as the cause.",
      observed:
        "Request req_7f3a91 returned 429; organization credits are $87.42; Production spend is $120.00 / $120.00.",
      evidence: [
        "Organization credits remain, ruling out an empty balance.",
        "Production is exactly at 100% of its private project budget.",
        "The resolution runbook requires a successful retry.",
      ],
      action: {
        id: "openai.raise-budget",
        label: "Raise cap & retry",
        kind: "host",
      },
    },
  },
  {
    id: "key-create-bug",
    host: "openai",
    triggerEvent: "key.create.failed",
    userMessage: "This valid restricted service key keeps failing to create.",
    agentMessage:
      "Your request is valid; bad scopes would return 4xx, not 500. Today's private deployment notes show auth v2.3.1 changed this restricted-key serializer in us-west. This is likely a regression. I can file req_91c2e8 with a sanitized repro.",
    knowledgeQuery:
      "restricted key create 500 auth rollout serializer us-west incident request id scopes sanitized",
    detection: {
      id: "key-bug-detection",
      classification: "product_bug",
      title: "Likely auth rollout regression",
      rationale:
        "A valid restricted-key request failed on the same code path changed by today's us-west auth rollout.",
      observed:
        "Restricted service key with responses.write and files.read returned HTTP 500, request req_91c2e8.",
      evidence: [
        "The request passed client validation and used allowed scopes.",
        "Auth v2.3.1 changed the restricted-key serializer at 10:42 PT.",
        "The incident template requires the request ID and sanitized payload.",
      ],
      action: {
        id: "openai.file-key-bug",
        label: "File report",
        kind: "github",
        payload: {
          title:
            "Auth v2.3.1 regression: restricted service-key creation returns 500 in us-west",
        },
      },
    },
  },
  {
    id: "per-key-spend-gap",
    host: "openai",
    triggerEvent: "feature.spend_limit.searched",
    userMessage: "Where do I cap only the production worker key?",
    agentMessage:
      "You are not missing it: private docs confirm budgets are project-only. The June support rollup shows 37 teams asked for this exact safeguard. I can log the gap and isolate this worker in its own $75 project now.",
    knowledgeQuery:
      "per-key monthly spend cap budget project workaround enterprise requests production shared",
    detection: {
      id: "spend-gap-detection",
      classification: "product_gap",
      title: "Unsupported control, repeated demand",
      rationale:
        "Private docs confirm the capability is absent, while support history shows repeated enterprise demand.",
      observed:
        "Limits search for a monthly cap on prod-support-worker returned no control.",
      evidence: [
        "The product only supports project-scoped budgets.",
        "37 similar requests appear in the June support rollup.",
        "The approved workaround is an isolated project and service key.",
      ],
      action: {
        id: "openai.log-spend-feedback",
        label: "Create safe workaround",
        kind: "feedback",
        payload: { hostActionId: "openai.create-budget-workaround" },
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
