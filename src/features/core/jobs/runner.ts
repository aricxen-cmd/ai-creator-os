import { dequeue } from "./queue";
import { runAIJob } from "../engine/aiEngine";

export async function processNextJob() {
  const job = dequeue();

  if (!job) {
    return null;
  }

  job.status = "running";

  try {
    const result = await runAIJob({
      type: job.type,
      provider: job.provider,
      model: job.model,
      prompt: job.prompt,
    });

    job.status = "completed";

    return result.output;
  } catch (error) {
    job.status = "failed";

    job.error =
      error instanceof Error
        ? error.message
        : "Unknown AI job error.";

    throw error;
  }
}