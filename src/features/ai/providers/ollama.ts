import type {
  AIProviderAdapter,
  GenerateRequest,
  GenerateResponse,
} from "../types/ai";

interface OllamaGenerateResponse {
  response: string;
  done: boolean;
}

export class OllamaProvider implements AIProviderAdapter {
  async generate(
    request: GenerateRequest
  ): Promise<GenerateResponse> {
    const response = await fetch(
      "http://localhost:11434/api/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: request.model,
          prompt: request.prompt,
          stream: false,
        }),
      }
    );

    if (!response.ok) {
      const message = await response.text();

      throw new Error(
        `Ollama request failed (${response.status}): ${message}`
      );
    }

    const data =
      (await response.json()) as OllamaGenerateResponse;

    if (!data.response) {
      throw new Error(
        "Ollama returned an empty response."
      );
    }

    return {
      text: data.response,
    };
  }
}