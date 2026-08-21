import {
  getOpenAIClient,
} from "@/lib/openai/client";

import type {
  AIProviderAdapter,
  GenerateRequest,
  GenerateResponse,
} from "../types/ai";

export class OpenAIProvider
  implements AIProviderAdapter
{
  async generate(
    request: GenerateRequest
  ): Promise<GenerateResponse> {
    const openai =
      getOpenAIClient();

    const response =
      await openai.responses.create({
        model:
          request.model,

        input:
          request.prompt,
      });

    return {
      text:
        response.output_text,
    };
  }
}