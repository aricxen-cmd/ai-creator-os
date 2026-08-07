export interface AIJob {
  type:
    | "research"
    | "script"
    | "storyboard"
    | "scene-prompts"
    | "thumbnail"
    | "image"
    | "video"
    | "voice";

  prompt: string;

  provider: string;

  model: string;
}