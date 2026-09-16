import type { Scene } from "@/features/scenes/types";
import { updateProject } from "./updateProject";

export function normalizeScenes(value: unknown): Scene[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item, index) => {
    if (!item || typeof item !== "object") {
      return [];
    }

    const candidate = item as Partial<Scene>;

    return [{
      id: typeof candidate.id === "number" ? candidate.id : index + 1,
      title: typeof candidate.title === "string" ? candidate.title : `Scene ${index + 1}`,
      narration: typeof candidate.narration === "string" ? candidate.narration : "",
      visual: typeof candidate.visual === "string" ? candidate.visual : "",
      camera: typeof candidate.camera === "string" ? candidate.camera : "",
      motion: typeof candidate.motion === "string" ? candidate.motion : "",
      duration: typeof candidate.duration === "string" ? candidate.duration : "6s",
      transition: typeof candidate.transition === "string" ? candidate.transition : "Cut",
      imagePrompt: candidate.imagePrompt,
      videoPrompt: candidate.videoPrompt,
      voicePrompt: candidate.voicePrompt,
      assets: candidate.assets,
      castIds: Array.isArray(candidate.castIds) ? candidate.castIds : [],
      status: candidate.status ?? "draft",
      generation: candidate.generation,
    } satisfies Scene];
  });
}

export async function saveScenes(projectId: string, scenes: Scene[]) {
  return updateProject(projectId, {
    scenes: normalizeScenes(scenes),
  });
}
