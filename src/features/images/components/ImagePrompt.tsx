export function buildImagePrompt(
  narration: string,
  visual: string
) {
  return `
You are an award-winning cinematic concept artist.

Create an AI image prompt.

Narration:

${narration}

Visual:

${visual}

Requirements:

Ultra detailed

Cinematic

Professional lighting

8K

Highly realistic

Return ONLY the prompt.
`;
}