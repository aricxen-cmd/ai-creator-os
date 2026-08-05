export type AIProvider =
  | "openai"
  | "openrouter"
  | "gemini"
  | "groq"
  | "ollama";

export interface GenerateRequest {
  provider: AIProvider;
  model: string;
  prompt: string;
}

export interface GenerateResponse {
  text: string;
}

export interface AIProviderAdapter {
  generate(
    request: GenerateRequest
  ): Promise<GenerateResponse>;
}