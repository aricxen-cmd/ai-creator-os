export const PROMPT_NICHES = [
  "All",
  "2D Football",
  "Animal POV",
  "Beginner English",
  "AI Toys",
  "Self-Improvement",
] as const;

export const PROMPT_STAGES = [
  "All",
  "Ideas",
  "Script",
  "Characters",
  "Storyboard",
  "Images",
  "Motion",
  "Voiceover",
  "Education",
  "Branding",
] as const;

export type PromptNiche = Exclude<
  (typeof PROMPT_NICHES)[number],
  "All"
>;

export type PromptStage = Exclude<
  (typeof PROMPT_STAGES)[number],
  "All"
>;

export interface VaultPrompt {
  id: string;
  title: string;
  description: string;
  niche: PromptNiche;
  stage: PromptStage;
  tags: string[];
  prompt: string;
}

const CORE_OUTPUT = `
OUTPUT RULES:
- Follow the requested section order.
- Make every production prompt self-contained.
- Keep the language clear and ready to copy.
- Do not add explanations outside the requested format.
`.trim();

const CHARACTER_LOCK = `
CHARACTER CONSISTENCY:
Use the approved character reference in every scene. Keep the face, body
proportions, hairstyle, clothing, accessories, colors, and distinguishing
features identical. Do not redesign, recolor, age, replace, or morph the
character between scenes.
`.trim();

const SCENE_RULES = `
SCENE RULES:
- Use one primary action or emotional beat per scene.
- Keep the composition readable at a glance.
- Avoid unnecessary characters, props, and background details.
- Preserve the requested visual style and aspect ratio.
`.trim();

const MOTION_RULES = `
MOTION RULES:
- Use the supplied scene image as the starting frame.
- Describe one clear primary action.
- Add only subtle secondary motion.
- Use one smooth, controlled camera movement.
- Preserve the source image's identity, proportions, colors, and style.
- Do not use facial morphing or introduce new objects.
`.trim();

export const vaultPrompts: VaultPrompt[] = [
  {
    id: "football-ideas",
    title: "Viral Football What-If Ideas",
    description:
      "Generates short sports comparisons, science questions, and athlete-versus-animal concepts.",
    niche: "2D Football",
    stage: "Ideas",
    tags: ["football", "shorts", "what-if", "viral"],
    prompt: `
Act as a viral content strategist for a faceless 2D animated YouTube Shorts
channel.

NICHE FOCUS:
[FOOTBALL + ANIMALS + PHYSICS]

Generate 10 original short-form video ideas using a mix of:
- Athlete versus athlete comparisons
- Athlete versus animal comparisons
- Sports physics hypotheticals
- Extraordinary abilities explained
- Sports under unusual conditions
- Combat or strength matchups

TITLE RULES:
- Maximum 10 words
- Use a question or "What happens if..." hook
- Create a strong curiosity gap
- Use simple global English
- Lead to a visually surprising answer

OUTPUT TABLE:
| # | Title | Content Format | Why It Hooks | Expected Answer or Twist |

After the table, select the top 3 ideas and explain why they have the highest
viral potential.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "football-script",
    title: "20–30 Second Football Script",
    description:
      "Turns a selected comparison or what-if idea into a concise scene-based script.",
    niche: "2D Football",
    stage: "Script",
    tags: ["script", "shorts", "comparison", "voiceover"],
    prompt: `
Act as a professional writer for viral faceless 2D sports animations.

TOPIC:
[INSERT SELECTED TITLE]

Create a vertical video script lasting 20–30 seconds.

STORY STRUCTURE:
Hook → Setup → Comparison → Final Reveal

REQUIREMENTS:
- Use calm documentary-style narration with subtle suspense
- Include one memorable statistic, fact, or surprising twist
- Keep narration between 55 and 90 spoken words
- Use 4–6 scenes
- Use no more than two characters per scene when possible
- Use one primary action per scene
- Keep backgrounds simple

FIRST, list every character with:
- Body type
- Hair
- Facial features
- Clothing
- Main colors

THEN, provide:
| Scene | Narration | On-Screen Text | Visual Description | Seconds |

AFTER THE TABLE:
1. Give three alternative two-second hooks
2. Give one concise ending line
3. Give the complete TTS voiceover as one paragraph

${SCENE_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "football-character-sheets",
    title: "2D Football Character Sheets",
    description:
      "Creates reference-sheet prompts for every character in a completed script.",
    niche: "2D Football",
    stage: "Characters",
    tags: ["character", "reference sheet", "2d", "consistency"],
    prompt: `
Act as the lead art director for a viral 2D animation.

SCRIPT:
[PASTE COMPLETE SCRIPT]

Create one stand-alone character-sheet prompt for every unique character.

EACH SHEET MUST INCLUDE:
- Character name
- Body build
- Hairstyle
- Facial appearance
- Clothing and accessories
- Main color palette
- Full-body front view
- Full-body side view
- Head-and-shoulders portrait
- Confident expression
- Shocked expression
- Plain off-white background
- No text, labels, logos, or watermarks

STYLE:
Flat 2D vector cartoon with a hand-drawn appearance, bold clean dark-brown
outlines, flat cel shading, expressive faces, exaggerated athletic proportions,
soft even lighting, consistent proportions, and no photorealism.

LABELS:
CHARACTER SHEET 1 — [CHARACTER]
CHARACTER SHEET 2 — [CHARACTER]

${CHARACTER_LOCK}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "football-scene-images",
    title: "2D Football Scene Images",
    description:
      "Produces consistent vertical image prompts for every scene in a sports script.",
    niche: "2D Football",
    stage: "Images",
    tags: ["image prompt", "2d", "vertical", "scenes"],
    prompt: `
Act as a 2D animation art director.

SCRIPT AND CHARACTER DESIGNS:
[PASTE SCRIPT AND CHARACTER DESCRIPTIONS]

Generate one stand-alone image prompt for every scene.

USE THIS FORMAT:

IMAGE — SCENE [NUMBER]

Character consistency:
Describe which approved character references must be used.

Frozen moment:
Describe the exact pose, expression, placement, and primary action.

Camera:
Specify framing, angle, subject position, and 9:16 composition.

Background:
Use a simple beige, sky-blue, or soft-grid backdrop.

Style:
Flat 2D vector cartoon, bold clean outlines, flat cel shading, expressive faces,
minimal background, soft even lighting, centered vertical composition, and no
photorealism.

${CHARACTER_LOCK}

${SCENE_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "football-motion",
    title: "Football Image-to-Video Prompts",
    description:
      "Creates five-second motion directions while avoiding public-figure names.",
    niche: "2D Football",
    stage: "Motion",
    tags: ["image-to-video", "motion", "camera", "5 seconds"],
    prompt: `
Act as a professional motion director for short-form 2D animation.

SCENES:
[PASTE SCENE IMAGE PROMPTS]

Create one five-second image-to-video prompt for every scene.

IMPORTANT:
Do not use celebrity, athlete, or public-figure names. Identify human characters
only by appearance, clothing, and screen position.

USE THIS FORMAT:

SCENE [NUMBER]
[Upload this scene's image as the starting frame.]

SUBJECTS:
[Appearance, clothing, and screen position]

PRIMARY ACTION:
[One clear movement]

SECONDARY MOTION:
[Breathing, clothing, hair, or environmental motion]

CAMERA:
Choose one: slow push-in, upward tilt, side-tracking pan, snap zoom,
gentle pull-back, or locked static camera.

PACING:
Use controlled limited-frame 2D animation. Hold the final pose for one second.

DURATION: 5 seconds
ASPECT RATIO: 9:16

${MOTION_RULES}

Validate that no public-figure name appears in the final output.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "animal-ideas",
    title: "Animal POV Mystery Ideas",
    description:
      "Combines animals, famous locations, hidden discoveries, and cinematic mysteries.",
    niche: "Animal POV",
    stage: "Ideas",
    tags: ["animal", "pov", "gopro", "mystery"],
    prompt: `
Act as a strategist for a cinematic Animal POV action-camera channel.

Generate 10 highly clickable video concepts using this formula:

Animal + famous location + hidden discovery + escalating danger + final twist

REQUIREMENTS:
- Use a different animal for every idea
- Use globally recognizable places or historical mysteries
- Make discoveries ancient, dangerous, abandoned, secret, or unexplained
- Do not use Titanic or submarine themes
- Keep every title under 100 characters
- Use an immersive documentary tone
- Include three relevant hashtags

OUTPUT:
| # | Title | Animal | Location | Discovery | Twist | Hashtags |

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "animal-five-scene",
    title: "Five-Scene Animal POV Adventure",
    description:
      "Turns one Animal POV idea into five escalating AI-video prompts.",
    niche: "Animal POV",
    stage: "Motion",
    tags: ["pov", "video prompts", "documentary", "suspense"],
    prompt: `
Act as a cinematic AI video prompt director.

VIDEO IDEA:
[PASTE SELECTED TITLE]

Identify the animal, location, discovery, and danger. Then create five connected
video prompts.

STORY ARC:
1. A handler attaches a small action camera and releases the animal
2. The animal enters the environment
3. It notices something unusual
4. The hidden discovery is revealed and closely explored
5. An unexpected twist or cliffhanger occurs

FOR EVERY SCENE INCLUDE:
- First-person animal action-camera perspective after Scene 1
- Believable animal movement
- Natural camera sway
- Wide-angle lens distortion
- Realistic environmental physics
- Volumetric light
- Dynamic shadows
- Environmental storytelling
- Increasing suspense
- Cinematic documentary realism

Do not change the animal, location, weather, or time of day without explaining
the transition.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "english-ideas",
    title: "A1–A2 English Story Ideas",
    description:
      "Creates emotional and useful beginner-English animated story concepts.",
    niche: "Beginner English",
    stage: "Ideas",
    tags: ["english", "a1", "a2", "learning"],
    prompt: `
Act as a YouTube strategist for a beginner English-learning channel that creates
simple 3D animated family stories.

Generate 20 story ideas suitable for A1–A2 learners and 1–2 minute videos.

MIX THESE CATEGORIES:
- Family problems
- Travel adventures
- School situations
- Funny misunderstandings
- Emotional stories
- English-learner struggles

FOR EACH IDEA PROVIDE:
- Emotional and specific title
- Two-to-three sentence summary
- English-learning focus
- Main emotional hook

Use short, clear language. Avoid generic titles.

After generating the ideas, stop and ask:
"Which idea would you like to develop? Reply with the number 1–20."

Do not generate the full story until an idea is selected.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "english-story-builder",
    title: "Beginner English Story Builder",
    description:
      "Develops one selected idea into a complete educational animated story.",
    niche: "Beginner English",
    stage: "Script",
    tags: ["story", "dialogue", "family", "education"],
    prompt: `
Act as a writer for A1–A2 English-learning animated stories.

SELECTED IDEA:
[PASTE SELECTED IDEA]

Create a complete 1–2 minute story.

LANGUAGE RULES:
- Use slow, clear English
- Use short sentences
- Use common everyday vocabulary
- Avoid advanced idioms
- Repeat important phrases naturally
- Keep dialogue easy to pronounce

PROVIDE:
1. Expanded story summary
2. Main characters
3. Setting
4. Beginning, middle, and ending
5. An 8–15 scene breakdown

SCENE TABLE:
| Scene | Narration or Dialogue | Key Action | Emotion | Seconds |

Use a clear emotional resolution and naturally teach useful English.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "english-images",
    title: "Beginner English Scene Images",
    description:
      "Generates family-friendly stylized 3D image prompts for each learning scene.",
    niche: "Beginner English",
    stage: "Images",
    tags: ["3d", "family", "image prompt", "consistent characters"],
    prompt: `
Act as an art director for a family-friendly 3D animated English-learning story.

STORY:
[PASTE COMPLETE STORY AND SCENES]

Create one stand-alone image prompt for every scene.

EACH PROMPT MUST INCLUDE:
- Complete character appearance
- Facial expression
- Clothing
- Main action
- Environment
- Lighting
- Camera angle
- Readable composition
- Consistent character descriptions

STYLE:
Polished, family-friendly stylized 3D animation with expressive characters,
rounded forms, cinematic lighting, clear emotions, and no logos or watermarks.

${CHARACTER_LOCK}

${SCENE_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "english-motion",
    title: "Beginner English Scene Motion",
    description:
      "Adds readable character acting and camera motion to English-learning scenes.",
    niche: "Beginner English",
    stage: "Motion",
    tags: ["animation", "movement", "camera", "3d"],
    prompt: `
Act as a motion director for a family-friendly 3D animated story.

SCENE IMAGES AND SCRIPT:
[PASTE SCENE MATERIAL]

Create one video-generation prompt for every scene.

INCLUDE:
- Character movement
- Facial expressions
- Body language
- Lip movement only when dialogue occurs
- One controlled camera movement
- Subtle environmental motion
- Mood and atmosphere
- Consistent family-friendly 3D style

Keep actions slow and readable so beginner learners can follow the story.

${MOTION_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "english-learning-pack",
    title: "English Learning Pack",
    description:
      "Extracts vocabulary, phrases, grammar, and comprehension activities.",
    niche: "Beginner English",
    stage: "Education",
    tags: ["vocabulary", "grammar", "questions", "a1-a2"],
    prompt: `
Act as an A1–A2 English teacher.

STORY SCRIPT:
[PASTE STORY]

Create a beginner-friendly learning pack containing:

1. Ten key vocabulary words
2. A simple definition for each word
3. Eight useful phrases from the story
4. One main grammar focus
5. Five fill-in-the-blank exercises
6. Five simple comprehension questions
7. A complete answer key
8. One short speaking practice activity

Use simple English and only test information taught by the story.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "toy-categories",
    title: "Toy Transformation Categories",
    description:
      "Generates selectable mechanical transformation themes.",
    niche: "AI Toys",
    stage: "Ideas",
    tags: ["toys", "categories", "mechanical", "viral"],
    prompt: `
Act as a short-form AI content strategist specializing in premium mechanical
transformation videos.

Generate 10 visually distinct transformation categories.

Examples of category direction:
- Dragon technology
- Tactical machinery
- Luxury engineering
- Galactic technology
- Deep-ocean machinery
- Hyper-speed racing

For each category provide:
- Category name
- Visual identity
- Main colors
- Recommended materials
- Three example objects

Finish with:
"Choose a category number, type a custom category, or say more."

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "toy-objects",
    title: "Transformation Object Selector",
    description:
      "Creates ten transformable objects matching a selected category.",
    niche: "AI Toys",
    stage: "Ideas",
    tags: ["objects", "selection", "category", "toy"],
    prompt: `
Act as a mechanical transformation concept designer.

SELECTED CATEGORY:
[INSERT CATEGORY]

Generate 10 objects that strongly match the category.

For each object include:
- Object name
- Compact starting shape
- Final transformed form
- Signature mechanical feature

Every object must support a physically believable connected transformation.

Finish with:
"Choose an item number to generate the full package, or type back."

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "toy-image-pair",
    title: "Toy Before-and-After Images",
    description:
      "Creates compact-form and final-result image prompts in one consistent setting.",
    niche: "AI Toys",
    stage: "Images",
    tags: ["before", "after", "product", "transformation"],
    prompt: `
Act as a cinematic product-visualization director.

CATEGORY:
[INSERT CATEGORY]

OBJECT:
[INSERT OBJECT]

Create two stand-alone image prompts.

IMAGE A — COMPACT FORM:
- First-person view looking at a clean white tabletop
- One realistic hand holding a compact premium device
- Brushed aluminum, titanium, anodized metal, or smoked glass
- Soft daylight
- Natural skin texture
- Slight motion blur
- Shallow depth of field
- No indication of the final transformed object

IMAGE B — FINAL FORM:
- Same table, lighting, camera direction, and visual identity
- Compact device no longer visible
- Fully formed object, 1.5–2 times larger
- Connected precision-engineered components
- Layered panels, joints, and premium materials
- No hand
- No clutter

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "toy-motion",
    title: "Eight-Second Toy Transformation",
    description:
      "Creates a connected, mechanically plausible transformation sequence.",
    niche: "AI Toys",
    stage: "Motion",
    tags: ["8 seconds", "mechanical", "asmr", "transformation"],
    prompt: `
Act as a director of premium mechanical transformation videos.

CATEGORY:
[INSERT CATEGORY]

OBJECT:
[INSERT OBJECT]

Create one continuous eight-second video prompt.

TIMELINE:
0–1 seconds: A hand holds the compact device.
1–2 seconds: The user activates it with a tactile click.
2–3 seconds: The device is placed on the white table.
3–7 seconds: Connected panels, hinges, joints, and structural sections transform.
7–8 seconds: The final form locks into place and settles.

PHYSICS:
- Every component stays physically connected
- No floating parts
- No magical morphing
- Show weight, resistance, and momentum
- Keep materials consistent
- Complete the transformation within eight seconds

AUDIO:
Use metallic clicks, servo hums, magnetic locks, and precision sliding sounds.
Do not use music, voiceover, explosions, or cinematic booms.

${MOTION_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "toy-three-models",
    title: "Three-Model Toy Package",
    description:
      "Produces base, advanced, and elite versions of one transformation concept.",
    niche: "AI Toys",
    stage: "Storyboard",
    tags: ["models", "variants", "elite", "package"],
    prompt: `
Act as a viral mechanical transformation content architect.

CATEGORY:
[INSERT CATEGORY]

OBJECT:
[INSERT OBJECT]

Create three complete versions:

MODEL 1 — Base version
MODEL 2 — Advanced upgraded version
MODEL 3 — Ultra-rare elite version

FOR EACH MODEL PROVIDE:
1. Three timed overlay captions
2. Compact-form image prompt
3. Final-form image prompt
4. Eight-second transformation prompt
5. ASMR sound design
6. Main colors and materials

Keep the three models recognizably related while making each upgrade visually
obvious.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "self-ideas",
    title: "Self-Improvement Video Ideas",
    description:
      "Creates relatable, emotionally grounded motivation topics.",
    niche: "Self-Improvement",
    stage: "Ideas",
    tags: ["motivation", "discipline", "mindset", "ideas"],
    prompt: `
Act as a YouTube strategist for a faceless inspirational and self-improvement
channel.

REFERENCE TOPICS:
[PASTE EXISTING TOPICS OR WRITE OPEN]

Generate 10 original video ideas using these frameworks:
- Relatable struggle → breakthrough
- Pain point → solution
- Common belief → surprising truth
- Before → after transformation
- Self-doubt → small action → regained trust

TITLE RULES:
- Short and emotionally engaging
- Curiosity-driven without dishonest clickbait
- Human and relatable
- Suitable for someone watching while overthinking or procrastinating

FOR EACH IDEA PROVIDE:
- Title
- Core idea
- Emotional hook
- Transformation promised

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "self-script",
    title: "6–9 Minute Self-Improvement Script",
    description:
      "Creates a grounded long-form motivational script with retention loops.",
    niche: "Self-Improvement",
    stage: "Script",
    tags: ["long-form", "retention", "motivation", "script"],
    prompt: `
Act as a professional writer for high-retention faceless self-improvement
videos.

TOPIC:
[INSERT TOPIC]

Write a script lasting approximately 6–9 minutes.

TONE:
- Conversational, honest, and confident
- Grounded instead of hype-driven
- Simple, natural language
- Sounds like real experience, not a lecture

STRUCTURE:
1. Relatable hook in the first 20–30 seconds
2. Introduce the main internal struggle
3. Use relatable examples
4. Create a curiosity or emotional shift every 30–40 seconds
5. Explain practical, achievable steps
6. Explain why every step matters
7. Recap the main lesson
8. End with a personal and doable call to action

Use natural paragraphs and varied pacing.

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "self-storyboard",
    title: "Stick-Figure Motivation Storyboard",
    description:
      "Converts a motivational script into minimalist visual prompts.",
    niche: "Self-Improvement",
    stage: "Storyboard",
    tags: ["stick figure", "storyboard", "minimal", "visuals"],
    prompt: `
Act as a visual prompt engineer for faceless self-improvement videos.

FULL SCRIPT:
[PASTE SCRIPT]

Create approximately one image prompt for every eight seconds of narration.

VISUAL ARC:
Struggle → Awareness → Action → Improvement → Result

STYLE:
- Minimalist 2D stick-figure illustration
- Clean lines and flat shapes
- Grayscale plus one accent color
- Same character throughout
- Everyday environments
- One action or emotion per frame
- No textures or heavy shading
- Immediately readable composition

FOR EACH OUTPUT PROVIDE:
Scene number, matching narration excerpt, emotional purpose, and one copy-ready
image prompt.

${CHARACTER_LOCK}

${SCENE_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "self-fitness-scenes",
    title: "Motivational Fitness Scene Pack",
    description:
      "Creates consistent fitness images, motion prompts, and voiceover lines.",
    niche: "Self-Improvement",
    stage: "Images",
    tags: ["fitness", "character", "image", "motivation"],
    prompt: `
Act as a visual director for motivational fitness short-form videos.

CHARACTER:
[DESCRIBE THE MASTER CHARACTER]

SCENE THEME:
[INSERT FITNESS OR DISCIPLINE THEME]

Create 10 connected scenes.

FOR EVERY SCENE PROVIDE:
1. Image-generation prompt
2. Five-second image-to-video prompt
3. Short motivational voiceover line

VISUAL DIRECTION:
Clean vector illustration, bold outlines, smooth shading, high-contrast
cinematic lighting, strong character focus, and minimal background.

MOOD:
Motivational, disciplined, powerful, and inspiring.

TARGET:
YouTube Shorts, TikTok, and Instagram Reels in 9:16.

${CHARACTER_LOCK}

${MOTION_RULES}

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "self-voiceover",
    title: "Motivational Voiceover Variants",
    description:
      "Generates short voiceover lines in grounded motivational tones.",
    niche: "Self-Improvement",
    stage: "Voiceover",
    tags: ["voiceover", "tts", "motivation", "shorts"],
    prompt: `
Act as a motivational voiceover writer.

TOPIC OR SCENE:
[INSERT TOPIC]

Generate 10 short voiceover options.

TONE:
Deep, calm, confident, grounded, and energetic without shouting.

RULES:
- One or two sentences each
- Simple spoken language
- No clichés unless given a fresh twist
- Focus on one emotional truth
- End with a memorable phrase
- Suitable for text-to-speech narration

Group the results into:
1. Calm
2. Powerful
3. Emotional
4. Direct challenge

${CORE_OUTPUT}
`.trim(),
  },
  {
    id: "self-banner",
    title: "Self-Improvement Channel Banner",
    description:
      "Creates a clean, safe-area-aware banner prompt for a motivation channel.",
    niche: "Self-Improvement",
    stage: "Branding",
    tags: ["banner", "youtube", "branding", "channel"],
    prompt: `
Act as an AI image-prompt specialist.

CHANNEL NAME:
[INSERT CHANNEL NAME]

Create one copy-ready image prompt for a modern, minimalist self-improvement
YouTube banner.

REQUIREMENTS:
- Canvas: 2560 × 1440
- Keep important content inside the 1546 × 423 center safe area
- Strong whitespace and balanced composition
- Bold modern sans-serif headline
- Optional short subtitle
- One or two primary brand colors
- Subtle symbols of growth, progress, time, or direction
- Clean creator-led appearance
- No clutter or busy textures
- Inspirational, focused, and timeless

Return one detailed paragraph only.

${CORE_OUTPUT}
`.trim(),
  },
];