# Lilypad Demo Integration

The demo defaults to a fully scripted client so the user-side experience runs
without backend services:

```bash
npm run dev
```

To select the production adapter stub:

```bash
VITE_AGENT_MODE=live npm run dev
```

On PowerShell:

```powershell
$env:VITE_AGENT_MODE = "live"
npm run dev
```

## Widget UI (this is the user-side surface I own)

This repo is the **customer-side demo**: two realistic host sites (`src/host/*`)
with the Lilypad widget embedded. ClosedAI is the developer-platform demo and
Hearth is the consumer account-settings demo. The widget is intentionally a
tiny **liquid-glass overlay**, never a chat panel, so it barely covers either host.
The real intelligence (LiveKit, Minimax vision, voice ASR/TTS, Truefoundry,
Unsiloed retrieval) is the team's and plugs in through the seams below; the UI
does not change.

- `src/widget/LilyOrb.tsx` - the persistent glass presence (~56px). One click
  starts/stops talking; status is shown through motion.
- `src/widget/LilyOverlay.tsx` - the only chrome shown when open: a translucent
  `.lily-glass` bubble with Lily's latest line, a small state dot, and at most
  **one** action button. Compact mic, screen-share, and close controls remain
  visible and touch-friendly. There is no large header, evidence panel,
  confidence meter, or transcript.
- `SupportWidget` auto-opens the overlay hands-free whenever the agent reacts
  (`state.attention`), so users never hunt for controls.

There is **no voice/TTS in this repo** - that's the team's pipeline. The mic
button is a UI affordance that flips `client.setListening(...)` (drives the orb
animation only). Wire real ASR/TTS inside `LiveSupportAgent`.

## Integration seams

### 1. Agent runtime

`src/agent/AgentProvider.tsx` selects either `MockSupportAgent` or
`LiveSupportAgent`. Both implement `SupportAgentClient` from
`src/agent/types.ts`.

Implement the TODO blocks in `LiveSupportAgent` for:

- LiveKit room connection and track lifecycle
- Minimax frame observations
- voice ASR/TTS messages and status changes
- retrieval and tool/action dispatch

The widget only consumes `SupportAgentClient`; it does not need backend-specific
changes.

### 2. Screen-share feed

`src/widget/useScreenShare.ts` owns `getDisplayMedia` and `MediaRecorder`. It
keeps the existing global feed:

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

Publish `window.lilypadSupportFeed.stream` as the LiveKit screen track. The
stream is `null` until the user grants browser screen-sharing permission.

### 3. GitHub and feedback APIs

Replace the implementations in `src/data/mockApi.ts`:

- `createGitHubIssue()`
- `submitFeedback()`

Keep their return shapes or adapt the results inside the selected agent client.

### 4. Retrieval

`searchDocs()` in `src/data/mockApi.ts` currently searches the chunks in
`src/data/mockKnowledge.ts`. Replace it with the document upload/retrieval
service and return a `KnowledgeEvidence` object.

### 5. Screen observations and host actions

`src/host/hostBus.ts` is the structured stand-in for visual understanding.
Hosts publish observations:

```ts
publishHostObservation({
  host: "openai",
  event: "request.quota_exceeded",
  title: "Test request returned insufficient quota",
  detail: "HTTP 429: Project has a $0.00 credit balance.",
});
```

Hosts can also register safe UI actions:

```ts
hostBus.registerAction("openai.go-to-billing", async () => {
  navigateToBilling();
  return { ok: true, message: "Took you to Billing." };
});
```

In production, Minimax observations can replace or supplement host events. The
action registry can remain as an optional structured tool channel.

## Demo order

1. Create a secret key. The first attempt succeeds.
2. Send the quickstart test request to trigger `429 insufficient_quota`.
3. Create another secret key to trigger the scripted HTTP 500 bug.
4. Open Limits and search for `monthly budget per key`.
5. Switch to Hearth and search for `cancel my membership`.

Switching host apps remounts the mock client and resets the scripted
conversation for a clean presentation.
