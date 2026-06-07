import type { KnowledgeEvidence } from "../agent/types";
import { mockKnowledge } from "./mockKnowledge";

const wait = (milliseconds: number) =>
  new Promise((resolve) => window.setTimeout(resolve, milliseconds));

export async function createGitHubIssue() {
  await wait(850);
  return {
    number: 1042,
    url: "https://github.com/lilypad-demo/platform/issues/1042",
  };
}

export async function submitFeedback() {
  await wait(700);
  return {
    id: "FEAT-284",
    route: "Product feedback inbox",
  };
}

export async function searchDocs(query: string): Promise<KnowledgeEvidence | undefined> {
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
  const match = ranked[0];

  if (!match || match.score === 0) {
    return undefined;
  }

  return {
    title: match.chunk.title,
    excerpt: match.chunk.content,
    source: match.chunk.source,
  };
}
