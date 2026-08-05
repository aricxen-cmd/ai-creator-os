import {
  AIProviderAdapter,
  GenerateRequest,
  GenerateResponse,
} from "../types/ai";

import OpenAIProvider from "../providers/openai";

export class AIManager {
  constructor(
    private providers: Record<string, AIProviderAdapter>
  ) {}

  async generate(
    request: GenerateRequest
  ): Promise<GenerateResponse> {
    const provider = this.providers[request.provider];

    if (!provider) {
      throw new Error(
        `Provider "${request.provider}" is not registered.`
      );
    }

    return provider.generate(request);
  }
}

export const aiManager = new AIManager({
  openai: new OpenAIProvider(),
});