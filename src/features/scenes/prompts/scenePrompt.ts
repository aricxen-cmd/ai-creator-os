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

Use exactly this structure:

{
  "scenes": [
    {
      "id": 1,
      "title": "Short scene title",
      "narration": "Spoken narration or dialogue",
      "visual": "Visible action and consequence",
      "camera": "Shot size, angle and framing",
      "motion": "Subject, camera and environmental motion",
      "duration": "6s",
      "transition": "Cut"
    }
  ]
}

Every scene must cause or motivate the next scene.
Keep each scene focused on one production beat.
Do not include markdown or code fences.

Storyboard:

${storyboard}
`.trim();
}
