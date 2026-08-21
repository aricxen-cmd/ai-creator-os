export interface PromptPackItem {
  title: string;

  category: string;

  description: string;

  prompt: string;

  tags: string[];
}

export interface PromptPack {
  id: string;

  name: string;

  description: string;

  version: string;

  prompts: PromptPackItem[];
}