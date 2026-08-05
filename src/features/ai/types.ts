export type AIProvider =
  | "openai"
  | "gemini"
  | "claude"
  | "openrouter";

export interface ChatRequest {
  provider: AIProvider;
  prompt: string;
  model?: string;
}

export interface ChatResponse {
  text: string;
}