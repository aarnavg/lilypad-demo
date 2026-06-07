import type { ScreenObservation, ScriptedScenario } from "../agent/types";

export const settingsScenarios: ScriptedScenario[] = [
  {
    id: "buried-downgrade",
    host: "settings",
    triggerEvent: "subscription.cancel.searched",
    userMessage: "I just want to stop this subscription. Where is cancel?",
    agentMessage:
      "The control is tucked inside Billing under your current plan. I can open it and switch you to the Free plan for you.",
    knowledgeQuery: "cancel downgrade subscription billing plan",
    detection: {
      id: "cancel-ux-detection",
      classification: "product_gap",
      title: "Cancellation is hard to find",
      rationale:
        "The option exists, but the path and wording make a common account task unnecessarily difficult.",
      evidence: [
        "You searched account settings for cancel and downgrade.",
        "The control is nested under Billing, then Current plan.",
      ],
      action: {
        id: "settings.downgrade-plan",
        label: "Do it for me",
        kind: "host",
      },
    },
  },
];

export function findSettingsScenario(observation: ScreenObservation) {
  return settingsScenarios.find(
    (scenario) =>
      scenario.host === observation.host &&
      scenario.triggerEvent === observation.event,
  );
}
