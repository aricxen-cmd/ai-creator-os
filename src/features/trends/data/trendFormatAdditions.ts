import type {
  TrendFormat,
} from "./trendFormats";

export const trendFormatAdditions: TrendFormat[] =
  [
    {
      id: "talking-objects",

      title:
        "Talking Objects",

      icon:
        "🗣️",

      description:
        "Personality-driven object videos where everyday items speak, roast, advise, argue, or tell short stories.",

      category:
        "Stories",

      structureFamily:
        "fixed-story",

      audioMode:
        "voice-over",

      durations: [
        "15s",
        "30s",
        "45s",
      ],

      style:
        "Photorealistic Character Comedy",

      recommendedModel:
        "GPT Image",

      tags: [
        "talking objects",
        "comedy",
        "character",
        "viral",
        "shorts",
      ],

      isHot:
        true,

      productionRules: [
        "The same object identity must remain consistent across every scene.",
        "Give the object one clear personality and keep it consistent.",
        "Use short punchy dialogue designed for vertical short-form video.",
        "Every scene should have a visible reaction or physical action.",
        "Avoid long monologues.",
        "Use expressive framing without changing the object's core appearance.",
        "End with a strong punchline, reveal, comeback, or final reaction.",
      ],

      prompt: `
Create a viral talking-object short-form video.

TOPIC:
[TOPIC]

OBJECT:
[OBJECT]

PERSONALITY:
[PERSONALITY]

CONTENT MODE:
[MODE]

DURATION:
[DURATION]

STYLE:
Photorealistic character comedy.

FORMAT:
Vertical 9:16.

CHARACTER LOCK:

The object must remain visually identical across every scene.

Keep:
- same shape
- same color
- same material
- same facial design if anthropomorphized
- same proportions

PERSONALITY LOCK:

Choose one clear personality.

Examples:
- sarcastic
- dramatic
- anxious
- overly confident
- grumpy
- motivational
- confused
- savage

STORY STRUCTURE:

HOOK
Immediately establish the object's strange personality or complaint.

SETUP
Show what situation the object is dealing with.

ESCALATION
Increase the conflict, absurdity or emotional reaction.

PAYOFF
Finish with a punchline, comeback, reveal or memorable reaction.

DIALOGUE:

Use short natural dialogue.

Avoid long speeches.

Every line should:
- move the story
- reveal personality
- create humor or curiosity

VISUAL RULES:

Every scene needs:
- visible action
- expressive reaction
- clear camera framing
- strong continuity

No text inside generated images.
No watermark.

AUDIO:

Use one consistent character voice.

Add subtle environment and object sounds when useful.

OUTPUT:

---SCENES---

Generate scene-by-scene visual instructions.

---DIALOGUE---

Generate one short dialogue beat per scene.

---AUDIO---

Generate matching voice and sound direction.
`.trim(),
    },

    {
      id:
        "weirdcore-story",

      title:
        "Weirdcore Story",

      icon:
        "👽",

      description:
        "Surreal short stories set in empty, nostalgic, dreamlike, or unsettling environments with mystery-driven progression.",

      category:
        "Mystery",

      structureFamily:
        "mystery",

      audioMode:
        "either",

      durations: [
        "20s",
        "30s",
        "45s",
        "60s",
      ],

      style:
        "Dreamlike Weirdcore",

      recommendedModel:
        "GPT Image",

      tags: [
        "weirdcore",
        "liminal",
        "mystery",
        "dream",
        "surreal",
      ],

      isNew:
        true,

      productionRules: [
        "Begin with an immediately strange or impossible visual.",
        "Keep locations visually connected rather than randomly changing environments.",
        "Use recurring symbols or objects to create narrative continuity.",
        "Each scene should deepen the mystery.",
        "Avoid explaining everything too early.",
        "Use restrained dialogue or narration.",
        "Finish with an unsettling reveal, unanswered question, or loop-back ending.",
      ],

      prompt: `
Create a surreal weirdcore mystery video.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

LOCATION:
[LOCATION]

MYSTERY:
[MYSTERY]

STYLE:
Dreamlike weirdcore / liminal reality.

FORMAT:
Vertical 9:16.

HOOK:

Open with an impossible or deeply strange visual.

Examples:
- an empty mall with one moving escalator
- a classroom with no doors
- a playground inside a warehouse
- a hotel hallway that keeps repeating
- a suburban street with identical houses

CONTINUITY:

Keep visual geography believable.

Use recurring:
- symbols
- objects
- colors
- lights
- signs
- sounds

Each scene should feel like the viewer is moving deeper into the same mystery.

STORY STRUCTURE:

HOOK
Show the strange event immediately.

DISCOVERY
The subject notices something impossible.

ESCALATION
The environment becomes more unsettling.

CLUE
Reveal one meaningful visual clue.

REVEAL
Show the most disturbing or surprising discovery.

ENDING
Leave one unanswered question or create a visual loop.

CAMERA:

Use:
- slow push-ins
- handheld exploration
- long hallways
- empty wide shots
- close-ups of strange objects

AUDIO:

Use sparse ambient audio.

Examples:
- fluorescent buzzing
- distant footsteps
- air-conditioning hum
- distorted announcement
- playground sounds
- low drones

Narration should be minimal if used.

No watermark.
Avoid excessive text.

OUTPUT:

---SCENES---

Generate a connected mystery sequence.

---AUDIO---

Generate atmosphere for every scene.

---ENDING---

Generate one memorable final reveal.
`.trim(),
    },

    {
      id:
        "gen-z-story",

      title:
        "Gen Z Story",

      icon:
        "🧑‍🎤",

      description:
        "Fast relatable social stories about dating, work, friendships, money, social media, and everyday modern-life chaos.",

      category:
        "Stories",

      structureFamily:
        "fixed-story",

      audioMode:
        "voice-over",

      durations: [
        "20s",
        "30s",
        "45s",
        "60s",
      ],

      style:
        "Modern Social Comedy",

      recommendedModel:
        "GPT Image",

      tags: [
        "gen z",
        "relatable",
        "comedy",
        "storytime",
        "social",
      ],

      isNew:
        true,

      productionRules: [
        "Start with a relatable conflict viewers understand immediately.",
        "Keep dialogue modern, short, and conversational.",
        "Do not overload scenes with too many characters.",
        "Use clear reaction shots and social consequences.",
        "Escalate quickly.",
        "Include at least one reversal, awkward moment, or unexpected consequence.",
        "End with a punchline, karma moment, or cliffhanger.",
      ],

      prompt: `
Create a viral Gen Z relatable story.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

MAIN CHARACTER:
[MAIN_CHARACTER]

SETTING:
[SETTING]

STYLE:
Modern relatable social comedy.

FORMAT:
Vertical 9:16.

STORY TYPES:

Examples:
- dating disaster
- workplace drama
- roommate conflict
- friendship betrayal
- social media embarrassment
- money problem
- gym situation
- school or college drama
- awkward family moment
- texting misunderstanding

STORY STRUCTURE:

HOOK
Immediately reveal the problem.

SETUP
Show who caused it or why it matters.

ESCALATION
Make the situation worse.

REACTION
Show embarrassment, anger, shock or confusion.

REVERSAL
Introduce an unexpected consequence.

PAYOFF
Finish with humor, karma, comeback or cliffhanger.

DIALOGUE:

Keep dialogue:
- short
- casual
- natural
- fast

Avoid long explanations.

CHARACTER LOCK:

Recurring characters must keep:
- same face
- same hair
- same clothes unless story requires change
- same role
- same personality

VISUAL STYLE:

Modern apartments, cafes, gyms, cars, offices, campuses, stores, streets and social environments.

Use:
- reaction close-ups
- phone interactions
- over-the-shoulder shots
- quick visual handoffs

AUDIO:

Conversational voices.

Use subtle social environment sound.

OUTPUT:

---SCENES---

Generate one clear story beat per scene.

---DIALOGUE---

Generate short dialogue.

---REACTIONS---

Include visible emotional reactions.
`.trim(),
    },

    {
      id:
        "micro-camera-animals",

      title:
        "Micro-Camera Animals",

      icon:
        "🐜",

      description:
        "Macro documentary-style journeys that follow animals through nests, burrows, colonies, caves, reefs, and hidden ecosystems.",

      category:
        "Animals",

      structureFamily:
        "dynamic-scenes",

      audioMode:
        "either",

      durations: [
        "20s",
        "30s",
        "45s",
        "60s",
      ],

      style:
        "Macro Nature Documentary",

      recommendedModel:
        "Nano Banana",

      tags: [
        "animals",
        "macro",
        "micro camera",
        "documentary",
        "nature",
      ],

      isHot:
        true,

      productionRules: [
        "Maintain the same animal or colony identity when continuity matters.",
        "Use believable animal behavior.",
        "Make scale obvious using environmental reference points.",
        "Camera movement should feel like a tiny exploration camera.",
        "Progress through connected spaces rather than random locations.",
        "Use macro depth of field and natural lighting.",
        "End with a major discovery, nest chamber, predator encounter, food source, or hidden structure.",
      ],

      prompt: `
Create a viral micro-camera animal documentary.

ANIMAL:
[ANIMAL]

ENVIRONMENT:
[ENVIRONMENT]

DISCOVERY:
[DISCOVERY]

DURATION:
[DURATION]

STYLE:
Cinematic macro wildlife documentary.

FORMAT:
Vertical 9:16.

CAMERA:

The camera behaves like a tiny exploration camera moving at the animal's scale.

Use:
- ultra-low camera height
- macro lens
- shallow depth of field
- tiny forward tracking
- tunnel exploration
- close-follow movement
- environmental reveals

SCALE:

Always make the viewer understand the tiny scale.

Show:
- grains of dirt
- leaves
- roots
- rocks
- water droplets
- insect body details
- fur
- nest structures

STRUCTURE:

HOOK
Enter the hidden environment immediately.

ENTRY
Follow the animal into its world.

DISCOVERY
Reveal increasingly interesting details.

DANGER OR OBSTACLE
Introduce a predator, collapse, water, rival animal or environmental challenge when appropriate.

DEEPER CHAMBER
Move into the most hidden location.

FINAL DISCOVERY
Reveal the most impressive structure, animal, colony or mystery.

ANIMAL BEHAVIOR:

Keep movement species-appropriate.

Avoid human-like actions unless the concept specifically calls for stylization.

AUDIO:

Use natural environmental sound.

Optional documentary narration should be concise.

No text.
No watermark.

OUTPUT:

---SCENES---

Generate connected macro exploration scenes.

---CAMERA---

Give specific camera movement for every scene.

---AUDIO---

Generate matching nature audio.
`.trim(),
    },

    {
      id:
        "sports-star-reveal",

      title:
        "Sports Star Reveal",

      icon:
        "⚽",

      description:
        "Cinematic athlete and team reveal videos built around entrances, identity reveals, stadium energy, and hero presentation.",

      category:
        "Sports",

      structureFamily:
        "dynamic-scenes",

      audioMode:
        "native-audio",

      durations: [
        "15s",
        "30s",
        "45s",
      ],

      style:
        "Sports Cinematic",

      recommendedModel:
        "Nano Banana",

      tags: [
        "sports",
        "athlete",
        "football",
        "reveal",
        "cinematic",
      ],

      isHot:
        true,

      productionRules: [
        "Keep athlete identity and uniform consistent across all shots.",
        "Build suspense before the full reveal.",
        "Use stadium-scale lighting and crowd energy.",
        "Do not reveal the hero immediately in every scene.",
        "Use varied camera distances.",
        "End with the strongest hero shot.",
        "Use native stadium and crowd audio.",
      ],

      prompt: `
Create a cinematic sports star reveal video.

SPORT:
[SPORT]

ATHLETE OR TEAM:
[ATHLETE]

TEAM COLORS:
[TEAM_COLORS]

LOCATION:
[LOCATION]

DURATION:
[DURATION]

STYLE:
Premium sports commercial.

FORMAT:
Vertical 9:16.

STRUCTURE:

TEASE
Show details without fully revealing the athlete.

Examples:
- cleats
- gloves
- jersey detail
- silhouette
- tunnel
- locker room

ENTRANCE
Show the athlete moving toward the arena or field.

BUILDUP
Increase crowd noise and scale.

IDENTITY REVEAL
Clearly reveal the athlete.

HERO MOMENT
Finish with an iconic stadium or arena pose.

IDENTITY LOCK:

Keep:
- same face
- same body
- same uniform
- same number
- same hairstyle
- same accessories

CAMERA:

Use:
- macro equipment shots
- low-angle tracking
- tunnel follow shot
- stadium wide
- slow-motion hero shot

LIGHTING:

High contrast sports lighting.

Use stadium lights, tunnel light, smoke or atmosphere when appropriate.

AUDIO:

Native audio.

Use:
- crowd
- tunnel footsteps
- stadium ambience
- equipment sounds
- impact sounds

No narration unless specifically requested.

OUTPUT:

---SCENES---

Generate the complete athlete reveal sequence.

---AUDIO---

Generate matching native audio instructions.
`.trim(),
    },

    {
      id:
        "game-universe-premiere",

      title:
        "Game Universe Premiere",

      icon:
        "🎮",

      description:
        "Cinematic character-universe reveal videos with recurring cast, scenario presets, entrances, lineups, nightlife, garages, rooftops, and premiere-style scenes.",

      category:
        "Stories",

      structureFamily:
        "dynamic-scenes",

      audioMode:
        "either",

      durations: [
        "20s",
        "30s",
        "45s",
        "60s",
      ],

      style:
        "AAA Game Cinematic",

      recommendedModel:
        "GPT Image",

      tags: [
        "gaming",
        "characters",
        "premiere",
        "cinematic",
        "cast",
      ],

      isNew:
        true,

      productionRules: [
        "Lock all recurring character identities.",
        "Keep wardrobe consistent within the selected scenario.",
        "Use recognizable cinematic locations and purposeful entrances.",
        "Treat every character like part of one shared universe.",
        "Avoid random cast changes.",
        "Use premium game-trailer camera language.",
        "Finish with a group reveal, hero lineup, or cliffhanger.",
      ],

      prompt: `
Create a cinematic fictional game-universe premiere video.

UNIVERSE:
[TOPIC]

CAST:
[CAST]

SCENARIO:
[SCENARIO]

LOCATION:
[LOCATION]

DURATION:
[DURATION]

STYLE:
Premium AAA game cinematic.

FORMAT:
Vertical 9:16.

SCENARIO OPTIONS:

Examples:
- red carpet premiere
- nightclub arrival
- luxury garage
- police lineup
- rooftop meeting
- downtown arrival
- beach party
- street race
- mansion entrance
- airport arrival
- underground club

CAST LOCK:

Every recurring character must keep:
- same face
- same body
- same hairstyle
- same tattoos
- same accessories
- same identity

Wardrobe may only change if the scenario intentionally requires it.

STRUCTURE:

HOOK
Reveal the environment or one intriguing cast member.

ARRIVAL
Characters enter the scenario.

CAST REVEALS
Show important characters one at a time.

INTERACTION
Create tension, confidence, rivalry or status.

GROUP MOMENT
Bring the cast into one shared visual.

FINAL HERO SHOT
End with the strongest cinematic reveal.

CAMERA:

Use:
- low-angle walk-ins
- cinematic tracking
- luxury vehicle arrivals
- close-up character reveals
- group wides
- slow hero push-ins

AUDIO:

Use:
- city ambience
- vehicles
- footsteps
- crowd reactions
- club ambience
- cinematic impacts

Dialogue should remain minimal unless the story requires it.

OUTPUT:

---SCENES---

Generate a connected cast-reveal sequence.

---CAST---

Keep every character visually consistent.

---AUDIO---

Generate scenario-specific sound direction.
`.trim(),
    },
  ];