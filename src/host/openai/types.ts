export type OpenAIPage = "api-keys" | "usage" | "billing" | "limits";

export interface ApiKeyRow {
  id: string;
  name: string;
  preview: string;
  created: string;
  lastUsed: string;
}
