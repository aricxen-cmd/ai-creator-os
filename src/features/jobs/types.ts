export type GenerationJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type GenerationJobKind =
  | "research"
  | "script"
  | "storyboard"
  | "scene-plan"
  | "scene-prompts"
  | "image"
  | "video"
  | "export";

export interface GenerationJob {
  id: string;
  kind: GenerationJobKind;
  title: string;
  status: GenerationJobStatus;
  progress?: number;
  projectId?: string;
  href?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

export interface StartGenerationJob {
  kind: GenerationJobKind;
  title: string;
  projectId?: string;
  href?: string;
}
