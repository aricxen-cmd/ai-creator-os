import { generateAIResponse } from "@/features/ai/manager";
import { AIJob } from "../types";

export async function runAIJob(job: AIJob) {
  return generateAIResponse(
    job.prompt,
    job.provider,
    job.model
  );
}