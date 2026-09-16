export interface SceneAssets {
  image?: string;
  video?: string;
  voice?: string;
}

export type SceneStatus =
  | "draft"
  | "ready"
  | "generating"
  | "complete"
  | "failed";

export interface SceneGenerationSettings {
  engineId?: string;
  mode?: "text-to-video" | "image-to-video";
  aspectRatio?: string;
  durationSeconds?: number;
}

export interface Scene {
  id: number;

  title: string;

  narration: string;

  visual: string;

  camera: string;

  motion: string;

  duration: string;

  transition: string;

  imagePrompt?: string;

  videoPrompt?: string;

  voicePrompt?: string;

  assets?: SceneAssets;

  castIds?: string[];

  status?: SceneStatus;

  generation?: SceneGenerationSettings;
}
