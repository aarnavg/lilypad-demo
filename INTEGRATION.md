# Lilypad Demo Integration

This repository is the customer-side demo. It defaults to a scripted adapter so
the full experience runs without backend services:

```bash
npm run dev
```

To select the production adapter stub:

```powershell
$env:VITE_AGENT_MODE = "live"
npm run dev
```

## User-Side Surface

The two embedded customer products are:

- **ClosedAI:** a realistic developer platform with API keys, usage, billing,
  project limits, and request testing.
- **Hearth:** a consumer membership and household-settings product.

Lilypad stays a small liquid-glass overlay rather than a chat panel.

- `src/widget/LilyOrb.tsx` is the persistent launcher and activity indicator.
- `src/widget/LilyOverlay.tsx` shows Lily's latest line, ranked private sources,
  mic/share controls, and at most one suggested action.
- `SupportWidget` opens automatically when Lily reacts to the current screen.

There is no real ASR or TTS in this repository. The mic button only drives the
mock listening state. The team's voice pipeline belongs in `LiveSupportAgent`.

## Integration Seams

### 1. Agent Runtime

`src/agent/AgentProvider.tsx` selects `MockSupportAgent` or
`LiveSupportAgent`. Both implement `SupportAgentClient` from
`src/agent/types.ts`.

Implement the TODO blocks in `LiveSupportAgent` for:

- LiveKit room and track lifecycle
- Minimax frame observations
- voice ASR/TTS messages and status
- Moss retrieval and tool dispatch

The UI does not need backend-specific changes.

### 2. Screen-Share Feed

`src/widget/useScreenShare.ts` owns `getDisplayMedia` and `MediaRecorder` and
preserves:

```ts
window.lilypadSupportFeed = {
  stream,
  recorder,
  chunks,
  blob,
  startedAt,
  endedAt,
};
```

Publish `window.lilypadSupportFeed.stream` as the LiveKit screen track.

### 3. GitHub and Feedback

Replace these mock implementations in `src/data/mockApi.ts`:

- `createGitHubIssue()`
- `submitFeedback()`

Keep their return shapes or adapt them inside the selected agent client.

### 4. Retrieval

`searchDocs()` currently ranks chunks from `src/data/mockKnowledge.ts` and
returns `KnowledgeEvidence[]`. Replace it with Moss over documents parsed by
Unsiloed.

The mock corpus intentionally contains private policies, runbooks, deployment
notes, incident templates, support rollups, and membership exceptions. These
make the correct answer impossible to derive from the public UI alone.

### 5. Screen Observations and Host Actions

`src/host/hostBus.ts` is the structured stand-in for Minimax visual context:

```ts
publishHostObservation({
  host: "openai",
  event: "request.quota_exceeded",
  title: "Production request returned insufficient quota",
  detail: "HTTP 429 despite positive organization credits.",
  metadata: {
    requestId: "req_7f3a91",
    organizationCredits: 87.42,
    projectSpend: 120,
    projectBudget: 120,
  },
});
```

Hosts also register reversible UI actions:

```ts
hostBus.registerAction("openai.raise-budget", async () => {
  navigateToLimits();
  raiseBudget();
  retryFailedRequest();
  return { ok: true, message: "Raised the budget and verified a 200 retry." };
});
```

In production, Minimax observations can replace or supplement host events. The
action registry can remain as an optional structured tool channel.

## Judge Demo

Start on the teammate-owned admin portal and show that private documentation is
linked and indexed. Then move to this user-side application — these are realistic
customer-facing products (a developer on ClosedAI, a member on Hearth). There are
no debug popups or test buttons; the customer just hits a confusing situation and
reaches for support, exactly like production.

1. **Ambiguous 429:** open **Usage**. A normal banner says production requests are
   being declined (`insufficient_quota`) even though the org has $87.42 in
   credits. Click **Get help**. Lily matches the private limits policy, correlates
   Production's $120/$120 spend, raises the cap, and preserves alerts.
2. **Rollout regression:** go to **API keys → Create new secret key** with the
   default *Restricted* permission. The product shows a normal "something went
   wrong, try again" message (no internal detail). Lily cross-checks the key
   runbook + same-day auth v2.3.1 deployment notes and files a sanitized GitHub
   issue — surfacing the deep cause the page never exposes.
3. **Product gap plus workaround:** open Limits and search
   `cap prod-support-worker at $75 per month`. Lily confirms per-key budgets are
   unsupported, finds 37 similar enterprise requests in the support rollup,
   logs `FEAT-284`, and creates the approved isolated-project workaround.
4. **Hearth policy exception:** search
   `pause while I move without losing household routines`. Lily sees 26 paid
   months, four household members, 18 routines, and 1,842 archive items. Private
   Policy 7B reveals a hidden 90-day pause, which Lily applies without deleting
   the household setup.

The point of the demo is not that Lily can explain an error. It is that Lily can
combine live visual context, private company knowledge, customer history, and
safe actions into a verified resolution.
