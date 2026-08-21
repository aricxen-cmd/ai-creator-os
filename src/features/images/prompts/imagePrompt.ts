export function buildImagePrompt(
  narration: string,
  visual: string
): string {
  return `
You are a professional cinematic concept artist and AI image prompt engineer.

Create one production-ready image generation prompt for this scene.

Narration:
${narration}

Visual Description:
${visual}

Requirements:
- Clearly describe the main subject
- Describe the environment and background
- Include composition and framing
- Include lighting
- Include mood and atmosphere
- Include important colors and textures
- Use cinematic visual language
- Keep character appearance consistent with the provided scene
- Do not include camera motion because this is a still image
- Do not include explanations or headings

Return ONLY the final image prompt.
`.trim();
}