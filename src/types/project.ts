export interface Project {
  id: string;

  title: string;

  description: string;

  status: string;

  created_at: string;

  research?: string;

  script?: string;

  storyboard?: string;

  scene_prompts?: string;

  thumbnail_prompt?: string;
}