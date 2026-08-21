import type { AIProvider } from "@/features/ai/types/ai";
import type { AIJobType } from "../engine/types";

export type JobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export interface AIJob {
  id: string;

  type: AIJobType;

  provider: AIProvider;

  model: string;

  prompt: string;

  status: JobStatus;

  createdAt: number;

  error?: string;
}