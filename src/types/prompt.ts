export interface Prompt {
  id: string;
  title: string;
  description: string | null;
  category: string;
  prompt: string;
  tags: string[];
  favorite: boolean;

  ai_provider: string;
  model: string;

  variables: string[];

  created_at: string;
}