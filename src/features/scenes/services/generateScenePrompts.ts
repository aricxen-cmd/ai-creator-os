import { runAIJob } from "@/features/core";
import type { Scene } from "../types";

interface GenerateScenePromptsInput {
  scene: Scene;
  castLock?: string;
  styleLock?: string;
}

export async function generateScenePrompts({
  scene,
  castLock = "",
  styleLock = "",
}: GenerateScenePromptsInput) {
  const imagePromptInstruction = `
You are a professional AI image prompt engineer.

Create one production-ready IMAGE prompt for this scene.

SCENE:
Title: ${scene.title || `Scene ${scene.id}`}
Narration: ${scene.narration || ""}
Visual: ${scene.visual || ""}
Camera: ${scene.camera || ""}
Motion: ${scene.motion || ""}
Transition: ${scene.transition || ""}
Duration: ${scene.duration || ""}

CAST LOCK:
${castLock || "No cast lock provided."}

STYLE LOCK:
${styleLock || "No style lock provided."}

IMAGE PROMPT RULES:
- Describe one exact still frame.
- Preserve all locked character details exactly.
- Preserve the locked visual style.
- Clearly describe subject, pose, expression, environment, composition, lighting, depth, materials, and atmosphere.
- Do not describe temporal camera movement.
- Do not add random characters or objects.
- Avoid contradictions.
- Return ONLY the final image prompt.
`.trim();

  const videoPromptInstruction = `
You are a professional image-to-video prompt engineer.

Create one production-ready VIDEO prompt for this scene.

SCENE:
Title: ${scene.title || `Scene ${scene.id}`}
Narration: ${scene.narration || ""}
Visual: ${scene.visual || ""}
Camera: ${scene.camera || ""}
Motion: ${scene.motion || ""}
Transition: ${scene.transition || ""}
Duration: ${scene.duration || ""}

CAST LOCK:
${castLock || "No cast lock provided."}

STYLE LOCK:
${styleLock || "No style lock provided."}

VIDEO PROMPT RULES:
- Preserve all locked character details exactly.
- Preserve the locked visual style.
- Clearly describe subject movement.
- Clearly describe camera movement.
- Clearly describe environmental movement.
- Respect the requested duration.
- Keep movement physically readable.
- Do not add random characters or objects.
- Avoid contradictory motion instructions.
- Return ONLY the final video prompt.
`.trim();

  const imageResult = await runAIJob({
    type: "image-prompt",
    provider: "ollama",
    model: "qwen3:4b",
    prompt: imagePromptInstruction,
  });

  const videoResult = await runAIJob({
    type: "video-prompt",
    provider: "ollama",
    model: "qwen3:4b",
    prompt: videoPromptInstruction,
  });

  return {
    imagePrompt: imageResult.output,
    videoPrompt: videoResult.output,
  };
}