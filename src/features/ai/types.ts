export interface AIRequest {
  prompt: string;
  provider: string;
  model: string;
}

export interface AIProvider {
  chat(
    prompt: string,
    model: string
  ): Promise<string>;
}