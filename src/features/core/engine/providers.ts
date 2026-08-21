import {
  OpenAIProvider,
} from "@/features/ai/providers/openai";

import {
  OllamaProvider,
} from "@/features/ai/providers/ollama";

import type {
  AIProviderAdapter,
} from "@/features/ai/types/ai";

export const Providers: Record<
  string,
  AIProviderAdapter
> = {
  openai:
    new OpenAIProvider(),

  ollama:
    new OllamaProvider(),
};