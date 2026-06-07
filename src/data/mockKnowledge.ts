export interface MockKnowledgeChunk {
  id: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
}

export const mockKnowledge: MockKnowledgeChunk[] = [
  {
    id: "billing-quota",
    title: "Why API requests return insufficient_quota",
    content:
      "Projects with no prepaid balance or active billing method cannot make API requests. Add a payment method and purchase credits from Billing.",
    source: "Billing and usage guide",
    keywords: ["429", "quota", "billing", "credits", "payment"],
  },
  {
    id: "api-key-create",
    title: "Creating project API keys",
    content:
      "Project owners and members can create secret keys from the API keys page. A valid create request should return a key immediately.",
    source: "API keys guide",
    keywords: ["key", "secret", "create", "500", "project"],
  },
  {
    id: "spend-limits",
    title: "Project budgets and usage limits",
    content:
      "Budgets and notification thresholds are configured at the project level. Per-key monthly spend caps are not currently available.",
    source: "Usage limits reference",
    keywords: ["spend", "limit", "budget", "monthly", "key"],
  },
  {
    id: "subscription-cancel",
    title: "Manage or cancel a plan",
    content:
      "Plan controls live under Settings, then Billing. Customers can switch to the Free plan from the current plan menu.",
    source: "Account help center",
    keywords: ["cancel", "downgrade", "subscription", "billing", "plan"],
  },
];
