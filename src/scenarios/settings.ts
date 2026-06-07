import type { ScreenObservation, ScriptedScenario } from "../agent/types";

export const settingsScenarios: ScriptedScenario[] = [
  {
    id: "hidden-pause",
    host: "settings",
    triggerEvent: "subscription.cancel.searched",
    userMessage:
      "I'm moving for a couple months. Can I stop paying without losing our setup?",
    agentMessage:
      "I would not cancel: it would disable your shared routines. With 26 paid months, private Policy 7B makes you eligible for a hidden 90-day pause that preserves all four members, 18 routines, and your archive. I can apply it now.",
    knowledgeQuery:
      "cancel pause 90 days membership history household routines archive preserve move downgrade data",
    detection: {
      id: "pause-ux-detection",
      classification: "product_gap",
      title: "A safer option is hidden",
      rationale:
        "The visible UI only offers downgrade, while a private policy makes this member eligible for a setup-preserving pause.",
      observed:
        "Search returned no pause option; account history shows 26 paid months, 4 household members, and 18 routines.",
      evidence: [
        "A normal downgrade would disable shared routines and archive search.",
        "Policy 7B grants long-term members a hidden 90-day pause.",
        "This account exceeds the 12-month eligibility requirement.",
      ],
      action: {
        id: "settings.pause-membership",
        label: "Pause for 90 days",
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
