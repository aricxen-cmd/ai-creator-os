import type { AIJob } from "./types";

const queue: AIJob[] = [];

export function enqueue(job: AIJob) {
  queue.push(job);

  return job;
}

export function dequeue(): AIJob | undefined {
  return queue.shift();
}

export function getQueue(): AIJob[] {
  return [...queue];
}

export function clearQueue() {
  queue.length = 0;
}