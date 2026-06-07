export type OpenAIPage = "api-keys" | "usage" | "billing" | "limits";

export interface ApiKeyRow {
  id: string;
  name: string;
  preview: string;
  type: string;
  scopes: string;
  created: string;
  lastUsed: string;
}
