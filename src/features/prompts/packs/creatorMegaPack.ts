import type { PromptPack } from "./types";

export const creatorMegaPack: PromptPack = {
  id: "ai-creator-os-mega-pack",

  name: "AI Creator OS Creator Mega Pack",

  description:
    "Expanded production prompt pack for research, scripts, storyboards, motivation, Animal POV, children's stories, sports hypotheticals, characters, images, videos, thumbnails, Google Flow, and viral short-form content.",

  version: "1.0.0",

  prompts: [
    {
      title: "Long-Form Motivation Script",
      category: "Motivation",
      description:
        "Creates a grounded 6–9 minute faceless self-improvement video.",
      tags: [
        "motivation",
        "self-improvement",
        "long-form",
        "faceless",
      ],
      prompt: `
Act as a professional writer for a faceless inspirational and self-improvement YouTube channel.

TOPIC:
[TOPIC]

TARGET LENGTH:
6–9 minutes

TONE:
- conversational
- honest
- confident
- grounded
- emotionally engaging
- simple language
- practical rather than preachy

STRUCTURE:

1. OPENING HOOK
Open with a strong 20–30 second hook that immediately names the viewer's struggle.

2. RELATABLE STRUGGLE
Use real situations such as:
- procrastination
- self-doubt
- burnout
- inconsistency
- feeling behind
- fear of failure
- loss of confidence

3. SURPRISING TRUTH
Challenge a common belief about the problem.

4. CORE EXPLANATION
Explain what is actually happening in clear language.

5. PRACTICAL STEPS
Give useful actions the viewer can apply immediately.

6. EMOTIONAL SHIFT
Move from frustration or pain toward clarity and possibility.

7. CLOSE
Finish with a memorable motivating conclusion.

RETENTION RULES:
- short sentences
- curiosity loops every 30–40 seconds
- emotional shifts throughout
- avoid repetitive advice
- use specific relatable examples

Return only the finished script.
`.trim(),
    },

    {
      title: "Motivational Topic Generator",
      category: "Motivation",
      description:
        "Generates emotionally strong self-improvement video topics.",
      tags: [
        "motivation",
        "topics",
        "ideas",
        "self-improvement",
      ],
      prompt: `
Generate [NUMBER] original YouTube video ideas for a faceless inspirational and self-improvement channel.

Focus on themes such as:
- discipline and mindset
- relatable emotional motivation
- confidence and self-worth
- comeback stories
- procrastination
- burnout
- consistency
- feeling behind
- fear
- rebuilding trust in yourself

Use idea frameworks such as:

Relatable struggle → breakthrough

Pain point → solution

Common belief → surprising truth

Before → after transformation

For every idea include:

- Title
- Core struggle
- Surprising angle
- Emotional payoff
- Why the viewer would click

Keep titles short, emotionally engaging, and curiosity-driven without misleading clickbait.
`.trim(),
    },

    {
      title: "Stick-Figure Motivation Storyboard",
      category: "Storyboard",
      description:
        "Turns motivational scripts into simple stick-figure visual scenes.",
      tags: [
        "storyboard",
        "stick-figure",
        "motivation",
        "faceless",
      ],
      prompt: `
Act as an AI visual prompt engineer specializing in simple stick-figure storyboard scenes for faceless inspirational and self-improvement videos.

FULL SCRIPT:
[SCRIPT]

Convert the script into clear storyboard scenes.

For each scene include:

- Scene number
- Narration covered
- Stick-figure action
- Environment
- Main prop if needed
- Character emotion
- Camera framing
- Visual metaphor if useful

STYLE RULES:

- simple stick figures
- minimal backgrounds
- clean visual storytelling
- easy-to-read poses
- strong emotional body language
- clear symbolic visuals
- no unnecessary detail

Make every scene visually different enough to maintain viewer attention.

Return a numbered storyboard.
`.trim(),
    },

    {
      title: "Google Flow Motivation Clips",
      category: "Google Flow",
      description:
        "Converts motivational storyboard scenes into 6-second Flow motion clips.",
      tags: [
        "google-flow",
        "motivation",
        "motion",
        "storyboard",
      ],
      prompt: `
Act as a professional motion director for Google Flow.

INPUT STORYBOARD:
[STORYBOARD]

Convert the storyboard into groups of 6 production-ready motion prompts.

Each prompt must create one approximately 6-second clip.

For every clip use this structure:

0–1s:
Describe the starting action or visual focus.

1–2s:
Continue the physical or emotional movement.

2–3s:
Introduce a visible change.

3–4s:
Advance the action.

4–5s:
Show the emotional or visual consequence.

5–6s:
End on a clear state that can transition into the next scene.

RULES:
- maintain visual continuity
- use readable movement
- avoid too many simultaneous actions
- include camera movement only when useful
- make character emotion visible through posture and movement
- preserve style consistency across clips

Return the prompts grouped in sets of 6.
`.trim(),
    },

    {
      title: "Animal POV Viral Concept Generator",
      category: "Animal POV",
      description:
        "Generates cinematic animal POV mystery concepts in famous global locations.",
      tags: [
        "animal",
        "pov",
        "gopro",
        "mystery",
        "viral",
      ],
      prompt: `
Generate [NUMBER] highly clickable YouTube video concepts for an Animal POV GoPro-style channel.

FORMAT:

An animal experiences the story through a first-person action-camera perspective in a globally recognizable real-world location or historic mystery.

Every concept must use a different animal.

The animal must uncover something that feels:

- dangerous
- ancient
- hidden
- abandoned
- secretive
- unexplained
- massive
- forbidden

Use globally recognized:
- cities
- rivers
- oceans
- landmarks
- ruins
- historic sites
- famous mysteries

Avoid:
- Titanic themes
- submarine repetition
- repeated animals
- repeated discoveries

For every concept include:

- Title under 100 characters
- Animal
- Location
- Discovery
- Short cinematic summary
- Three hashtags

Overall style:
cinematic, mysterious, documentary-like, high-curiosity, viral.
`.trim(),
    },

    {
      title: "Animal POV Full Story",
      category: "Animal POV",
      description:
        "Expands an Animal POV concept into a cinematic short story.",
      tags: [
        "animal",
        "pov",
        "story",
        "cinematic",
      ],
      prompt: `
Act as a cinematic documentary storyteller.

CONCEPT:
[CONCEPT]

Write a complete short-form Animal POV story from the animal's first-person action-camera perspective.

Include:

1. Opening movement
2. Exploration
3. Discovery clue
4. Escalating mystery
5. Dangerous or surprising reveal
6. Escape, resolution, or unanswered mystery

VISUAL RULES:
- every beat must be visually producible
- emphasize first-person movement
- use environmental clues
- avoid excessive dialogue
- maintain documentary realism
- build curiosity continuously

Return the full story broken into scenes.
`.trim(),
    },

    {
      title: "Animal POV Image Prompt",
      category: "Image",
      description:
        "Creates first-person GoPro-style animal POV imagery.",
      tags: [
        "animal",
        "pov",
        "image",
        "gopro",
      ],
      prompt: `
Create a production-ready first-person Animal POV image prompt.

ANIMAL:
[ANIMAL]

LOCATION:
[LOCATION]

SCENE:
[SCENE]

DISCOVERY:
[DISCOVERY]

Requirements:
- clear first-person action-camera perspective
- visible clues that establish the animal viewpoint
- realistic environment
- cinematic documentary lighting
- believable scale
- strong depth
- immediate focal point
- mystery and exploration
- no visible human camera operator
- no text or watermark

Return only the final image prompt.
`.trim(),
    },

    {
      title: "Children's Story Idea Generator",
      category: "Children",
      description:
        "Generates original animated story concepts for ages 4–8.",
      tags: [
        "children",
        "story",
        "ideas",
        "animation",
      ],
      prompt: `
You are a creative children's storyteller and animated short-film concept writer.

Generate [NUMBER] original and visually exciting story ideas for children ages 4–8.

Each story should feature:
- one clear main hero
- optional supporting characters
- strong visual action
- simple emotional stakes
- a satisfying resolution

Each idea must include:

TITLE

STORY SUMMARY:
Approximately 1000–1200 characters.

Use this structure:

BEGINNING
Introduce the hero while actively moving, exploring, building, searching, traveling, or playing.

MIDDLE
Introduce an exciting event, challenge, magical discovery, funny problem, secret world, creature, sci-fi gadget, or adventure.

ENDING
Resolve the story with a satisfying and cinematic conclusion.

Use simple child-friendly language and highly visual storytelling.
`.trim(),
    },

    {
      title: "Children's Character Sheet Builder",
      category: "Character",
      description:
        "Creates repeatable animated character reference descriptions.",
      tags: [
        "children",
        "character",
        "reference",
        "animation",
      ],
      prompt: `
Create a professional character reference sheet prompt for a children's animated character.

CHARACTER:
[CHARACTER]

Include:

- full-body front view
- full-body side view
- head-and-shoulders portrait
- happy expression
- surprised expression
- worried expression
- clear clothing
- clear color palette
- distinct silhouette
- animation-friendly proportions

STYLE:
[STYLE]

Keep the same face, body proportions, hairstyle, clothing, colors, accessories, and distinguishing features across all views.

Use a simple neutral background.

Return only the final reference-sheet prompt.
`.trim(),
    },

    {
      title: "Sports Science What-If Ideas",
      category: "Sports",
      description:
        "Generates viral sports and science hypothetical video ideas.",
      tags: [
        "sports",
        "science",
        "what-if",
        "viral",
      ],
      prompt: `
Generate [NUMBER] viral short-form sports/science video ideas.

Use categories such as:

- athlete vs athlete
- human vs animal
- sports under unusual physics
- extreme strength or speed
- sport played on another planet
- extraordinary human ability
- impossible competitions
- animal battles
- physics hypotheticals

For each idea include:

- Title
- Hook
- Main comparison
- Science or physical principle
- Visual climax
- Likely result

Make every concept easy to visualize with AI-generated animation.
`.trim(),
    },

    {
      title: "Athlete vs Animal Script",
      category: "Sports",
      description:
        "Creates fast-paced athlete-versus-animal comparison scripts.",
      tags: [
        "sports",
        "animal",
        "comparison",
        "script",
      ],
      prompt: `
Write a short-form video script about:

[ATHLETE] vs [ANIMAL]

Structure:

1. Immediate matchup hook
2. Athlete's strongest advantage
3. Animal's strongest advantage
4. Speed or strength comparison
5. Reaction-time or movement comparison
6. Environment advantage
7. Most likely outcome
8. Memorable ending line

Use simple visual comparisons.

Avoid pretending uncertain claims are established facts.

Return only the finished script.
`.trim(),
    },

    {
      title: "What If Sports Physics Script",
      category: "Sports",
      description:
        "Creates sports scripts around unusual environments or physics.",
      tags: [
        "sports",
        "physics",
        "what-if",
        "script",
      ],
      prompt: `
Create a viral short-form script about:

WHAT IF:
[SCENARIO]

SPORT:
[SPORT]

Explain how the scenario changes:

- gravity
- speed
- jumping
- ball movement
- balance
- endurance
- impact force
- strategy

Use clear comparisons and highly visual examples.

Open with a strong hook and end with the most surprising consequence.

Return only the finished script.
`.trim(),
    },

    {
      title: "Research-to-Script Workflow",
      category: "Research",
      description:
        "Researches a topic specifically for downstream script generation.",
      tags: [
        "research",
        "script",
        "workflow",
        "facts",
      ],
      prompt: `
Act as a research agent for an AI video production system.

TOPIC:
[TOPIC]

Research and organize the information specifically so another AI can write a compelling video script from it.

Return:

1. Topic overview
2. Core facts
3. Surprising facts
4. Useful comparisons
5. Statistics worth using
6. Common misconceptions
7. Strong story angles
8. Potential hooks
9. Visual opportunities
10. Claims requiring extra verification

Keep the output concise enough to be useful as script context.

Do not write the final script.
`.trim(),
    },

    {
      title: "Script Retention Optimizer",
      category: "Script",
      description:
        "Rewrites an existing script to improve retention without changing the topic.",
      tags: [
        "script",
        "retention",
        "rewrite",
        "youtube",
      ],
      prompt: `
Act as a professional YouTube retention editor.

SCRIPT:
[SCRIPT]

Improve the script while preserving the core message.

Focus on:

- stronger opening hook
- shorter sentences
- less filler
- clearer curiosity loops
- stronger scene changes
- emotional shifts
- better pacing
- more visual language
- stronger payoff

Do not add fake claims or misleading drama.

Return only the improved script.
`.trim(),
    },

    {
      title: "Short-Form Hook Generator",
      category: "Viral Shorts",
      description:
        "Generates hook variations for short-form videos.",
      tags: [
        "hooks",
        "shorts",
        "viral",
        "retention",
      ],
      prompt: `
Generate 20 short-form video hooks for:

[TOPIC]

Create a mix of:

- curiosity hooks
- surprising-truth hooks
- challenge hooks
- comparison hooks
- emotional hooks
- mystery hooks
- direct problem hooks

Requirements:
- short
- natural
- easy to say aloud
- no fake claims
- immediately understandable

Return only the hooks.
`.trim(),
    },

    {
      title: "Storyboard Continuity Director",
      category: "Storyboard",
      description:
        "Creates scene sequences with better visual continuity.",
      tags: [
        "storyboard",
        "continuity",
        "scenes",
        "director",
      ],
      prompt: `
Act as a professional storyboard and continuity director.

SCRIPT:
[SCRIPT]

Create a complete storyboard.

For each scene include:

- Scene number
- Narration/dialogue
- Visual
- Characters present
- Character action
- Character emotion
- Environment
- Camera framing
- Camera movement
- Duration
- Transition
- Continuity note

CONTINUITY RULES:
- preserve character appearance
- preserve clothing
- preserve important props
- maintain spatial logic
- avoid unexplained location changes
- create visual motivation for each transition
- avoid repeating the same camera composition too often

Return a numbered production storyboard.
`.trim(),
    },

    {
      title: "Scene Image Prompt Director",
      category: "Image",
      description:
        "Creates detailed scene-specific text-to-image prompts with locks.",
      tags: [
        "scene",
        "image",
        "prompt",
        "consistency",
      ],
      prompt: `
Act as a professional AI image prompt director.

SCENE:
[SCENE]

CAST LOCK:
[CAST_LOCK]

STYLE LOCK:
[STYLE_LOCK]

Create one exact production frame.

Include:
- subjects
- positions
- poses
- expressions
- clothing
- environment
- foreground
- background
- framing
- camera angle
- lens feel
- lighting
- shadows
- atmosphere
- textures
- important colors
- depth

Preserve all locked character and style details.

Do not add unnecessary people, objects, logos, text, or watermarks.

Return only the final image prompt.
`.trim(),
    },

    {
      title: "Scene Motion Director",
      category: "Video",
      description:
        "Creates detailed image-to-video motion instructions.",
      tags: [
        "scene",
        "motion",
        "video",
        "animation",
      ],
      prompt: `
Act as a professional motion director specializing in image-to-video generation.

SCENE:
[SCENE]

DURATION:
[DURATION]

CAST LOCK:
[CAST_LOCK]

STYLE LOCK:
[STYLE_LOCK]

Create motion instructions describing:

- starting pose
- subject movement
- facial movement
- hand movement
- body movement
- prop movement
- environmental movement
- camera movement
- camera speed
- final pose
- continuity into the next shot

Keep motion controlled and physically readable.

Do not redesign the character or environment.

Return only the final video prompt.
`.trim(),
    },

    {
      title: "Character Cast Lock Enhancer",
      category: "Character",
      description:
        "Turns a rough character description into a production-grade Cast Lock.",
      tags: [
        "character",
        "cast-lock",
        "consistency",
        "design",
      ],
      prompt: `
Turn this rough character concept into a production-ready CAST LOCK:

[CHARACTER_DESCRIPTION]

Include:
- age appearance
- skin tone
- face structure
- eyes
- eyebrows
- nose
- mouth
- hairstyle
- hair color
- facial hair
- body build
- proportions
- clothing
- footwear
- accessories
- color palette
- distinguishing features

Keep the design simple enough for consistent AI generation.

End with a strict consistency instruction requiring identical appearance in every scene.

Return only the final Cast Lock.
`.trim(),
    },

    {
      title: "Visual Style Lock Builder",
      category: "Image",
      description:
        "Creates reusable production-wide style locks.",
      tags: [
        "style",
        "style-lock",
        "visual",
        "consistency",
      ],
      prompt: `
Create a reusable visual STYLE LOCK for:

STYLE:
[STYLE]

PROJECT TYPE:
[PROJECT_TYPE]

Define:

- realism level
- rendering approach
- materials
- textures
- character rendering
- environment rendering
- lighting style
- shadow treatment
- color palette
- contrast
- lens/composition language
- depth of field
- animation appearance if relevant

Require the same visual treatment across all scenes.

Prevent:
- random style changes
- inconsistent materials
- inconsistent lighting
- unwanted text
- watermarks
- logos unless requested

Return only the final Style Lock.
`.trim(),
    },

    {
      title: "Thumbnail Concept Variations",
      category: "Thumbnail",
      description:
        "Generates multiple thumbnail compositions before image generation.",
      tags: [
        "thumbnail",
        "concept",
        "ctr",
        "youtube",
      ],
      prompt: `
Generate 5 distinct YouTube thumbnail concepts for:

VIDEO:
[VIDEO_TOPIC]

For every concept include:

- focal subject
- expression/action
- composition
- background
- visual contrast
- curiosity element
- optional text concept
- why it could earn a click

Rules:
- simple composition
- mobile-readable
- one primary focal point
- avoid clutter
- avoid misleading imagery

Return 5 clearly different concepts.
`.trim(),
    },

    {
      title: "Cinematic Documentary Prompt",
      category: "Video",
      description:
        "Creates documentary-style cinematic scene prompts.",
      tags: [
        "documentary",
        "cinematic",
        "video",
        "scene",
      ],
      prompt: `
Create a cinematic documentary-style video prompt.

SUBJECT:
[SUBJECT]

LOCATION:
[LOCATION]

ACTION:
[ACTION]

Use:
- realistic environmental detail
- natural human/animal movement
- subtle camera motion
- professional documentary composition
- believable lighting
- realistic depth
- restrained cinematic color grading

The scene should feel captured rather than staged.

Avoid exaggerated CGI appearance.

Return only the final video prompt.
`.trim(),
    },

    {
      title: "Premium Claymation Style Lock",
      category: "Image",
      description:
        "Reusable premium stop-motion claymation visual system.",
      tags: [
        "claymation",
        "style-lock",
        "stop-motion",
        "animation",
      ],
      prompt: `
Use premium stop-motion claymation throughout the entire production.

Everything should appear physically sculpted from high-quality clay.

Use:
- visible handmade clay texture
- subtle fingerprints
- sculpted facial features
- miniature practical sets
- soft cinematic studio lighting
- realistic clay deformation
- handcrafted props
- shallow cinematic depth of field where appropriate
- polished stop-motion framing

Maintain identical:
- character proportions
- facial construction
- hairstyle
- clothing
- colors
- props
- clay materials

Avoid:
- photoreal human skin
- flat illustration
- cheap plastic appearance
- random material changes
- text
- logos
- watermarks

Preserve this exact visual language across every scene.
`.trim(),
    },

    {
      title: "Clean 2D Animation Style Lock",
      category: "Image",
      description:
        "Reusable polished 2D animation production style.",
      tags: [
        "2d",
        "animation",
        "style-lock",
        "character",
      ],
      prompt: `
Use a polished professional 2D animated short-form style.

Use:
- clean silhouettes
- clear linework
- expressive poses
- readable facial expressions
- controlled shading
- consistent line weight
- clean color blocking
- animation-friendly shapes
- strong visual hierarchy

Maintain identical:
- character proportions
- face design
- hairstyle
- clothing
- colors
- accessories

Avoid:
- photorealism
- inconsistent anatomy
- random art-style changes
- text
- logos
- watermarks

Keep the same 2D production language across every scene.
`.trim(),
    },

    {
      title: "Stylized 3D Animation Style Lock",
      category: "Image",
      description:
        "Reusable high-quality stylized 3D production look.",
      tags: [
        "3d",
        "animation",
        "style-lock",
        "cinematic",
      ],
      prompt: `
Use premium stylized 3D animation throughout the production.

Use:
- polished character models
- clean geometry
- physically believable materials
- soft cinematic lighting
- expressive facial animation
- smooth surface treatment
- professional feature-animation composition
- controlled depth of field

Maintain identical:
- character models
- face structure
- proportions
- hair
- clothing
- colors
- accessories
- materials

Avoid:
- low-quality game-render appearance
- character redesign between scenes
- random realism changes
- text
- logos
- watermarks

Preserve the same 3D visual language throughout.
`.trim(),
    },

    {
      title: "Prompt Quality Enhancer",
      category: "General",
      description:
        "Improves rough prompts into clearer production-ready instructions.",
      tags: [
        "prompt",
        "enhancer",
        "quality",
        "general",
      ],
      prompt: `
Act as a professional AI prompt engineer.

ROUGH PROMPT:
[PROMPT]

Improve it by:

- removing ambiguity
- clarifying subject
- clarifying action
- clarifying environment
- improving spatial relationships
- improving composition
- improving lighting
- improving camera instructions
- removing contradictions
- preserving all important user requirements
- avoiding unnecessary filler

Do not change the core intent.

Return only the improved prompt.
`.trim(),
    },

    {
      title: "Prompt Variable Extractor",
      category: "General",
      description:
        "Turns a fixed prompt into a reusable template with placeholders.",
      tags: [
        "prompt",
        "template",
        "variables",
        "workflow",
      ],
      prompt: `
Convert the following fixed AI prompt into a reusable template:

[PROMPT]

Replace changeable information with clear placeholders such as:

[TOPIC]
[CHARACTER]
[LOCATION]
[STYLE]
[DURATION]
[SCENE]
[CAST_LOCK]
[STYLE_LOCK]

Preserve the useful structure and instructions.

Do not over-template details that should remain fixed.

Return only the reusable prompt template.
`.trim(),
    },
  ],
};