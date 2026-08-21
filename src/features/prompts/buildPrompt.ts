import type { PromptBuilderInput } from "./types";

export function buildProductionPrompt(input: PromptBuilderInput): string {
  const sections = [
    `PROMPT TYPE:
${input.type.toUpperCase()}`,

    input.castLock
      ? `CAST LOCK:
${input.castLock}`
      : "",

    input.styleLock
      ? `STYLE LOCK:
${input.styleLock}`
      : "",

    `SUBJECT:
${input.subject}`,

    input.action
      ? `ACTION:
${input.action}`
      : "",

    input.environment
      ? `ENVIRONMENT:
${input.environment}`
      : "",

    input.style
      ? `ADDITIONAL STYLE:
${input.style}`
      : "",

    input.camera
      ? `CAMERA:
${input.camera}`
      : "",

    input.lighting
      ? `LIGHTING:
${input.lighting}`
      : "",

    input.mood
      ? `MOOD:
${input.mood}`
      : "",

    input.duration
      ? `DURATION:
${input.duration}`
      : "",

    input.extraInstructions
      ? `ADDITIONAL INSTRUCTIONS:
${input.extraInstructions}`
      : "",
  ];

  return sections.filter(Boolean).join("\n\n").trim();
}
