export interface Project {
  id: string;

  title: string;

  description: string | null;

  niche: string | null;

  status: string;

  created_at: string;

  updated_at: string;

  research: string | null;

  script: string | null;

  storyboard: string | null;

  scene_prompts: string | null;

  thumbnail_prompt: string | null;

  scenes: unknown | null;

  assets: unknown | null;

  timeline: unknown | null;

  settings: unknown | null;

  history: unknown | null;
}