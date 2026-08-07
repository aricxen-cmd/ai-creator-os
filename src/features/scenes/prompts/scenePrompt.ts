export function buildScenePrompt(
  storyboard: string
) {
  return `
You are an AI film director.

Convert this storyboard into production-ready scenes.

For every scene generate:

Title

Narration

Visual

Camera

Motion

Duration

Transition

Image Prompt

Video Prompt

Voice Prompt

Return VALID JSON only.

Storyboard:

${storyboard}
`;
}