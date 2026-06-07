import type { KnowledgeEvidence } from "../agent/types";
import { mockKnowledge } from "./mockKnowledge";

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

/**
 * Mock backend seams. Teammates replace these with the real GitHub app, the
 * feedback store, and the Moss/Unsiloed retrieval index — the return shapes are
 * what the UI renders, so keep them stable.
 */

export interface IssueResult {
  number: number;
  title: string;
  url: string;
}

export async function createGitHubIssue(title?: string): Promise<IssueResult> {
  await wait(850);
  return {
    number: 1042,
    title: title ?? "Platform bug filed by Lily",
    url: "https://github.com/closedai-demo/platform/issues/1042",
  };
}

export interface FeedbackResult {
  id: string;
  route: string;
}

export async function submitFeedback(): Promise<FeedbackResult> {
  await wait(700);
  return {
    id: "FEAT-284",
    route: "Product feedback inbox",
  };
}

/** Moss-style retrieval over the Unsiloed-parsed company docs. */
export async function searchDocs(
  query: string,
  limit = 3,
): Promise<KnowledgeEvidence[]> {
  await wait(180);
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const ranked = mockKnowledge
    .map((chunk) => ({
      chunk,
      score: terms.reduce(
        (score, term) =>
          score +
          (chunk.keywords.some((keyword) => keyword.includes(term)) ? 2 : 0) +
          (chunk.content.toLowerCase().includes(term) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);
  return ranked
    .filter((match) => match.score > 0)
    .slice(0, limit)
    .map(({ chunk }) => ({
      title: chunk.title,
      excerpt: chunk.content,
      source: chunk.source,
      locator: chunk.locator,
    }));
}
