import type {
  PromptPack,
} from "./types";

export const starterPromptPack: PromptPack = {
  id: "ai-creator-os-starter",

  name: "AI Creator OS Starter Pack",

  description:
    "Starter prompts for scripts, research, storyboards, characters, images, videos, thumbnails, motivation, Animal POV, children's stories, and Google Flow.",

  version: "1.0.0",

  prompts: [
    {
      title:
        "Viral YouTube Shorts Script",

      category:
        "Script",

      description:
        "Creates a fast-paced short-form script with a strong hook and retention beats.",

      tags: [
        "youtube",
        "shorts",
        "viral",
        "script",
      ],

      prompt: `
You are a professional short-form YouTube scriptwriter.

Create a highly engaging YouTube Shorts script about:

[TOPIC]

Target length:
[LENGTH]

Audience:
[AUDIENCE]

Style:
[STYLE]

Requirements:

- Open with a strong curiosity-driven hook in the first 1–2 seconds.
- Use short, natural sentences.
- Keep the pacing fast.
- Build curiosity throughout the script.
- Avoid unnecessary introductions.
- Use clear visual moments that can easily become video scenes.
- Add a new information beat or emotional shift every few seconds.
- End with a memorable payoff, twist, question, or conclusion.

Return only the finished script.
`.trim(),
    },

    {
      title:
        "Deep Topic Research",

      category:
        "Research",

      description:
        "Creates structured research before scriptwriting.",

      tags: [
        "research",
        "youtube",
        "facts",
        "content",
      ],

      prompt: `
Act as a research assistant for an AI video production workflow.

Research the following topic:

[TOPIC]

Organize the research into:

1. Core explanation
2. Most interesting facts
3. Surprising or counterintuitive details
4. Useful statistics or comparisons
5. Common misconceptions
6. Potential story angles
7. Strong hooks for a video
8. Important claims that should be verified before publication

Focus on information that would make a compelling video.

Avoid filler.

Return structured production research.
`.trim(),
    },

    {
      title:
        "Production Storyboard Generator",

      category:
        "Storyboard",

      description:
        "Turns a completed script into production-ready scenes.",

      tags: [
        "storyboard",
        "scenes",
        "video",
        "production",
      ],

      prompt: `
You are a professional storyboard director.

Convert the following script into a scene-by-scene storyboard:

[SCRIPT]

For every scene provide:

- Scene number
- Duration
- Narration or dialogue
- Main visual
- Character action
- Camera framing
- Camera movement
- Environment
- Transition to the next scene

Rules:

- Every scene must visually support the narration.
- Avoid repetitive shots.
- Keep visual continuity between scenes.
- Keep recurring characters consistent.
- Make every scene practical for AI image and AI video generation.
- Break long narration into multiple visual beats when necessary.

Return a clean numbered storyboard.
`.trim(),
    },

    {
      title:
        "Character Consistency Builder",

      category:
        "Character",

      description:
        "Creates a reusable Cast Lock for consistent character generations.",

      tags: [
        "character",
        "cast",
        "consistency",
        "reference",
      ],

      prompt: `
Act as a professional AI character designer.

Create a reusable character consistency profile for:

[CHARACTER]

Include:

- Name
- Approximate age appearance
- Gender presentation
- Skin tone
- Face shape
- Eyes
- Eyebrows
- Nose
- Mouth
- Hair color
- Hairstyle
- Facial hair if applicable
- Height impression
- Body build
- Clothing
- Footwear
- Accessories
- Main colors
- Distinguishing features

End with a CAST LOCK instruction requiring the exact same face, hairstyle, body proportions, clothing, colors, accessories, age appearance, and distinguishing features in every scene.

Return only the character profile.
`.trim(),
    },

    {
      title:
        "Cinematic Image Prompt",

      category:
        "Image",

      description:
        "Turns a scene description into a production-ready image prompt.",

      tags: [
        "image",
        "cinematic",
        "visual",
        "generation",
      ],

      prompt: `
Act as a professional AI image prompt engineer.

Create one production-ready image prompt from:

[SCENE]

CAST LOCK:
[CAST_LOCK]

STYLE LOCK:
[STYLE_LOCK]

Include:

- Main subject
- Exact pose or action
- Facial expression
- Environment
- Background details
- Composition
- Camera framing
- Lens feel
- Lighting
- Mood
- Materials and textures
- Depth
- Important colors

Rules:

- Describe one exact frame.
- Preserve all Cast Lock details.
- Preserve the Style Lock.
- Do not introduce random characters.
- Do not add text, logos, or watermarks unless requested.
- Avoid contradictory visual instructions.

Return only the final image prompt.
`.trim(),
    },

    {
      title:
        "Image-to-Video Motion Prompt",

      category:
        "Video",

      description:
        "Creates controlled motion prompts for image-to-video generators.",

      tags: [
        "video",
        "motion",
        "image-to-video",
        "flow",
      ],

      prompt: `
Act as a professional image-to-video motion director.

Using the following scene:

[SCENE]

Create a production-ready motion prompt.

Describe:

- Subject movement
- Facial movement
- Hand or body movement
- Environmental motion
- Camera movement
- Camera speed
- Beginning state
- Mid-shot action
- Ending state

Duration:
[DURATION]

Rules:

- Preserve character identity and clothing.
- Do not redesign the scene.
- Keep motion physically readable.
- Avoid excessive simultaneous movement.
- Avoid contradictory camera directions.
- Do not introduce new subjects.

Return only the final motion prompt.
`.trim(),
    },

    {
      title:
        "High CTR Thumbnail Builder",

      category:
        "Thumbnail",

      description:
        "Creates a clean curiosity-driven YouTube thumbnail prompt.",

      tags: [
        "thumbnail",
        "youtube",
        "ctr",
        "viral",
      ],

      prompt: `
Act as a professional YouTube thumbnail art director.

Create a thumbnail generation prompt for:

[VIDEO_TOPIC]

Primary subject:
[SUBJECT]

Emotion:
[EMOTION]

Requirements:

- One instantly readable focal subject.
- Strong facial expression or action.
- Clear visual hierarchy.
- High contrast.
- Simple background.
- Minimal clutter.
- Large recognizable shapes.
- Strong curiosity.
- Composition that remains readable on a phone screen.

Avoid unnecessary text inside the generated image.

Return only the final thumbnail prompt.
`.trim(),
    },

    {
      title:
        "Faceless Motivation Script",

      category:
        "Motivation",

      description:
        "Creates grounded emotional self-improvement videos for faceless channels.",

      tags: [
        "motivation",
        "faceless",
        "self-improvement",
        "youtube",
      ],

      prompt: `
Act as a professional writer for a faceless inspirational and self-improvement YouTube channel.

Topic:

[TOPIC]

Create a motivational script using this structure:

Relatable struggle
→ emotional recognition
→ surprising truth
→ mindset shift
→ practical action
→ motivating close

Tone:

- conversational
- grounded
- confident
- emotionally honest
- simple language
- not overly dramatic

Use relatable situations such as procrastination, self-doubt, burnout, inconsistency, fear, feeling behind, or loss of confidence when relevant.

Use short sentences and frequent emotional shifts to maintain retention.

Return only the finished script.
`.trim(),
    },

    {
      title:
        "Animal POV GoPro Concept Generator",

      category:
        "Animal POV",

      description:
        "Generates cinematic animal POV mystery concepts in famous locations.",

      tags: [
        "animal",
        "pov",
        "gopro",
        "mystery",
        "viral",
      ],

      prompt: `
Generate highly clickable video concepts for an Animal POV GoPro-style channel.

Each concept must feature:

- A different animal
- First-person action-camera perspective
- A globally recognizable location
- Exploration or discovery
- A dangerous, ancient, hidden, abandoned, secretive, or unexplained discovery

The style should feel cinematic, mysterious, documentary-like, and optimized for viral curiosity.

Avoid repeating the same type of discovery.

For every concept include:

- Title under 100 characters
- Animal
- Location
- Discovery
- Short concept summary
- Three hashtags

Generate:

[NUMBER] concepts.
`.trim(),
    },

    {
      title:
        "Children's Animated Story Generator",

      category:
        "Children",

      description:
        "Creates simple visually driven animated stories for children ages 4–8.",

      tags: [
        "children",
        "story",
        "animation",
        "kids",
      ],

      prompt: `
Act as a creative children's storyteller and animated short-film concept writer.

Create an original story for children ages 4–8.

Main character:
[CHARACTER]

Theme:
[THEME]

The story should contain:

BEGINNING
Introduce the hero while they are actively exploring, playing, building, searching, or traveling.

MIDDLE
Introduce an exciting challenge, magical discovery, funny problem, secret world, creature, or adventure.

ENDING
Resolve the problem with a satisfying, visually cinematic conclusion.

Rules:

- Use simple child-friendly language.
- Keep the story highly visual.
- Favor physical action over long dialogue.
- Include clear locations and visual changes.
- Avoid frightening or disturbing material.

Return a title and complete story summary.
`.trim(),
    },

    {
      title:
        "Google Flow 6-Second Motion Scene",

      category:
        "Google Flow",

      description:
        "Creates precise six-second motion instructions for Google Flow clips.",

      tags: [
        "google-flow",
        "motion",
        "video",
        "6-second",
      ],

      prompt: `
Create a Google Flow-ready 6-second video prompt.

SCENE:
[SCENE]

CHARACTER LOCK:
[CAST_LOCK]

STYLE LOCK:
[STYLE_LOCK]

Break the motion into exact beats:

0–1s:
[BEAT]

1–2s:
[BEAT]

2–3s:
[BEAT]

3–4s:
[BEAT]

4–5s:
[BEAT]

5–6s:
[BEAT]

Include:

- character movement
- facial expression
- body movement
- environmental motion
- camera movement
- continuity into the next scene

Keep all character design and style details locked.

Do not introduce new characters or objects.

Return only the final Flow prompt.
`.trim(),
    },

    {
      title:
        "Sports What-If Viral Script",

      category:
        "Sports",

      description:
        "Creates viral science/sports hypothetical scripts.",

      tags: [
        "sports",
        "what-if",
        "science",
        "viral",
      ],

      prompt: `
Create a viral short-form video script about this sports hypothetical:

[TOPIC]

Examples of the desired format include:

- athlete vs animal
- athlete vs athlete
- extreme physics scenario
- sport played under unusual conditions
- extraordinary human ability
- science applied to sports

Structure:

1. Immediate hook
2. Explain the matchup or hypothetical
3. Introduce the key physical advantage
4. Introduce the opposing advantage
5. Escalate the comparison
6. Give the most likely result
7. Finish with a memorable final line

Use simple language and highly visual comparisons.

Return only the finished script.
`.trim(),
    },

    {
      title:
        "Viral Short Idea Generator",

      category:
        "Viral Shorts",

      description:
        "Generates short-form concepts optimized for curiosity and visual storytelling.",

      tags: [
        "viral",
        "ideas",
        "shorts",
        "youtube",
        "tiktok",
      ],

      prompt: `
Generate [NUMBER] highly clickable short-form video ideas about:

[NICHE]

Use concepts built around:

- curiosity
- surprising comparisons
- hidden information
- transformation
- challenge
- danger
- mystery
- unexpected outcomes
- visual spectacle

For each idea provide:

- Title
- Hook
- Core concept
- Visual payoff
- Why someone would keep watching

Keep every idea visually producible with AI-generated video.

Avoid repetitive concepts.
`.trim(),
    },
  ],
};