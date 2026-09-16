import type { Scene } from "../types";
import { normalizeScenes } from "@/lib/supabase/scenes";

interface ScenePlanEnvelope {
  scenes?: unknown;
}

export function parseScenePlan(output: string): Scene[] {
  const cleaned = output
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("The scene planner returned invalid JSON. Try generating again.");
  }

  const rawScenes = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object"
      ? (parsed as ScenePlanEnvelope).scenes
      : null;

  const scenes = normalizeScenes(rawScenes);

  if (!scenes.length) {
    throw new Error("The scene planner did not return any usable scenes.");
  }

  return scenes;
}
