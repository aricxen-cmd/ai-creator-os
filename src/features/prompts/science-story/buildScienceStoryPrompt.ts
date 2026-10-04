import { ScienceStoryInput } from "./types";
import { SCIENCE_STORY_SYSTEM_PROMPT } from "./scienceStoryPrompt";

export function buildScienceStoryPrompt(
  input: ScienceStoryInput
): string {
  const {
    topic,
    platform,
    length,
    visualStyle,
    sceneCount,
    characterStyle,
    customCharacter,
    audience,
    additionalInstructions,
  } = input;

  return `
${SCIENCE_STORY_SYSTEM_PROMPT}

CREATE THE FOLLOWING VIDEO:

VIDEO IDEA:
${topic}

PLATFORM:
${platform}

VIDEO LENGTH:
${length}

NUMBER OF SCENES:
${sceneCount}

VISUAL STYLE:
${visualStyle}

CHARACTER STYLE:
${characterStyle}

${
  customCharacter
    ? `
CUSTOM CHARACTER DESCRIPTION:
${customCharacter}
`
    : ""
}

TARGET AUDIENCE:
${audience || "General audience interested in entertaining science"}

${
  additionalInstructions
    ? `
ADDITIONAL CREATOR INSTRUCTIONS:
${additionalInstructions}
`
    : ""
}

STORY STRUCTURE

Create the story using this structure:

1. HOOK

Open with the strongest visual moment or question.

The viewer should understand the premise within approximately
two seconds.

2. SETUP

Quickly explain the situation.

Do not slow the story with unnecessary background.

3. ESCALATION

Show increasingly dramatic consequences.

Each scene must reveal something new.

4. MAJOR TURN

Introduce the consequence most viewers probably did not expect.

5. FINAL PAYOFF

Deliver the largest visual or scientific revelation.

6. ENDING

Finish with a memorable final image.

End with one short question that can encourage comments.

CHARACTER DESIGN

If the story requires a recurring character, create a locked
character design.

The character should remain visually consistent across every scene.

Create a reusable character generation prompt.

SCENE REQUIREMENTS

Create exactly ${sceneCount} scenes.

Every scene must include:

- sceneNumber
- title
- duration
- narration
- onScreenText
- textToImagePrompt
- imageToVideoPrompt
- soundEffects
- transition

TEXT-TO-IMAGE REQUIREMENTS

Every prompt must include:

- recurring character description when applicable
- character action
- environment
- important objects
- camera shot
- camera angle
- lighting
- atmosphere
- composition
- scale
- ${visualStyle} visual style
- vertical 9:16 framing when appropriate for the platform

IMAGE-TO-VIDEO REQUIREMENTS

Every prompt must specify:

- exact character movement
- exact object movement
- environmental motion
- camera movement
- speed of movement
- lighting changes
- physical reactions
- beginning state
- ending state

Do not simply say "animate this image."

THUMBNAILS

Create 3 thumbnail concepts.

Each thumbnail must include:

- title
- concept
- image generation prompt
- optional text overlay

METADATA

Generate:

- 5 clickable video titles
- SEO-friendly description
- 10 keywords
- 5 hashtags

AUDIO

Recommend:

- background music direction
- sound effects for every scene

RETURN THIS EXACT JSON STRUCTURE:

{
  "title": "",
  "concept": "",
  "hook": "",
  "researchSummary": "",
  "script": "",
  "characters": [
    {
      "name": "",
      "role": "",
      "description": "",
      "appearance": "",
      "clothing": "",
      "characterPrompt": "",
      "continuityPrompt": ""
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "",
      "duration": "",
      "narration": "",
      "onScreenText": "",
      "textToImagePrompt": "",
      "imageToVideoPrompt": "",
      "soundEffects": [],
      "transition": ""
    }
  ],
  "thumbnails": [
    {
      "title": "",
      "concept": "",
      "prompt": "",
      "textOverlay": ""
    }
  ],
  "metadata": {
    "titles": [],
    "description": "",
    "keywords": [],
    "hashtags": []
  },
  "musicDirection": "",
  "visualDirection": ""
}

IMPORTANT:

Return valid JSON only.

Create exactly ${sceneCount} scenes.

Keep recurring characters visually consistent.

Optimize the production package for AI image and video generation.
`;
}