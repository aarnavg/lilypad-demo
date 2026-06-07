export interface MockKnowledgeChunk {
  id: string;
  title: string;
  content: string;
  source: string;
  locator: string;
  keywords: string[];
}

/**
 * Company-private material linked in the Lilypad admin portal, parsed by
 * Unsiloed, and retrieved by Moss. The scenarios are deliberately ambiguous
 * without these sources.
 */
export const mockKnowledge: MockKnowledgeChunk[] = [
  {
    id: "budget-429",
    title: "The same 429 is used for two different limits",
    content:
      "ClosedAI returns `429 insufficient_quota` when an organization has no credits or when a project reaches its monthly budget. The public error text is identical. If organization credits remain, compare project spend with its budget before changing billing.",
    source: "ClosedAI Billing & Limits Policy.pdf",
    locator: "Section 4.2",
    keywords: [
      "429",
      "quota",
      "insufficient_quota",
      "budget",
      "cap",
      "credits",
      "billing",
      "limit",
      "project",
    ],
  },
  {
    id: "budget-change-runbook",
    title: "Safely restoring a budget-blocked project",
    content:
      "For a project blocked at 100%, increase the monthly budget, preserve the existing 80% and 100% alerts, then retry the failed request. A 200 response is required before the support case is considered resolved.",
    source: "ClosedAI Support Resolution Runbook.pdf",
    locator: "Page 11",
    keywords: [
      "budget",
      "cap",
      "429",
      "retry",
      "200",
      "alerts",
      "resolved",
      "project",
      "raise",
    ],
  },
  {
    id: "keys-runbook",
    title: "Valid restricted-key requests must not return 5xx",
    content:
      "Project owners can create restricted service keys when at least one scope is selected. Validation failures return 4xx. A 5xx after validation is a platform incident and must be escalated with the request ID, project, scopes, and sanitized payload.",
    source: "ClosedAI API Keys Runbook.pdf",
    locator: "Section 2.1",
    keywords: [
      "key",
      "secret",
      "create",
      "500",
      "5xx",
      "restricted",
      "scopes",
      "owner",
      "platform",
      "incident",
      "request",
    ],
  },
  {
    id: "auth-rollout",
    title: "Auth service v2.3.1 changed restricted-key writes",
    content:
      "Auth service v2.3.1 began rolling out to us-west at 10:42 PT on June 7. The migration touched the restricted-key serializer and should be rolled back if create_key 5xx rates rise above baseline.",
    source: "ClosedAI Deployment Notes - June 7.pdf",
    locator: "10:42 PT",
    keywords: [
      "auth",
      "rollout",
      "migration",
      "restricted",
      "key",
      "serializer",
      "500",
      "5xx",
      "us-west",
      "regression",
    ],
  },
  {
    id: "incident-template",
    title: "What a useful auth incident report contains",
    content:
      "Include the x-request-id, region, key type, selected scopes, deployment version, and a sanitized reproduction. Never include the generated secret or authorization header.",
    source: "Engineering Incident Intake.md",
    locator: "Auth services",
    keywords: [
      "incident",
      "request",
      "id",
      "region",
      "scope",
      "deployment",
      "version",
      "sanitized",
      "key",
      "bug",
    ],
  },
  {
    id: "limits-scope",
    title: "Budgets are project-scoped; per-key caps are not supported",
    content:
      "Spend budgets and alert thresholds are project-scoped. Individual API keys cannot have monthly caps. The approved workaround is an isolated project for the workload, with one service key and a project budget.",
    source: "ClosedAI Usage Limits Reference.pdf",
    locator: "Section 3.0",
    keywords: [
      "per-key",
      "key",
      "budget",
      "spend",
      "limit",
      "monthly",
      "cap",
      "project",
      "scope",
      "workaround",
    ],
  },
  {
    id: "limits-feedback",
    title: "Per-key controls are a repeated enterprise request",
    content:
      "The June support rollup contains 37 requests for per-key or per-workload budgets. The most common need is preventing one production integration from consuming a shared project budget.",
    source: "Voice of Customer - June.pdf",
    locator: "Theme 6",
    keywords: [
      "per-key",
      "key",
      "budget",
      "feedback",
      "enterprise",
      "requests",
      "workload",
      "production",
      "shared",
    ],
  },
  {
    id: "hearth-cancel",
    title: "Cancellation and downgrade path",
    content:
      "Plan changes live under Settings > Membership > current plan > Manage. The path is not surfaced in global search. A downgrade removes shared household automations when the paid term ends.",
    source: "Hearth Membership Help.pdf",
    locator: "Page 3",
    keywords: [
      "cancel",
      "downgrade",
      "membership",
      "subscription",
      "plan",
      "billing",
      "free",
      "stop",
    ],
  },
  {
    id: "hearth-pause",
    title: "Long-term members can pause without losing their setup",
    content:
      "Members with at least 12 months of paid history may pause for up to 90 days. A pause preserves household members, routines, and the Home Archive. This option is available to support but is not shown in self-serve settings.",
    source: "Hearth Membership Exceptions.pdf",
    locator: "Policy 7B",
    keywords: [
      "cancel",
      "pause",
      "membership",
      "90",
      "days",
      "history",
      "household",
      "routines",
      "archive",
      "move",
      "preserve",
    ],
  },
  {
    id: "hearth-data",
    title: "What happens to household data after downgrade",
    content:
      "Free accounts retain the primary profile but disable shared household routines and archive search after the paid period. Paused accounts preserve both features until service resumes.",
    source: "Hearth Data Retention Guide.pdf",
    locator: "Table 2",
    keywords: [
      "downgrade",
      "free",
      "pause",
      "household",
      "routines",
      "archive",
      "data",
      "preserve",
      "cancel",
    ],
  },
];
