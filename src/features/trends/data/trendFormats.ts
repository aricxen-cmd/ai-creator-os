export type TrendAudioMode =
  | "voice-over"
  | "native-audio"
  | "either";

export type TrendStructureFamily =
  | "fixed-story"
  | "dynamic-scenes"
  | "a-b-transitions"
  | "educational"
  | "process-transformation"
  | "mystery";

export interface TrendFormat {
  id: string;
  title: string;
  icon: string;

  description: string;

  category: string;

  structureFamily:
    TrendStructureFamily;

  audioMode:
    TrendAudioMode;

  durations: string[];

  style: string;

  recommendedModel: string;

  tags: string[];

  isHot?: boolean;
  isNew?: boolean;

  productionRules: string[];

  prompt: string;
}

export const trendFormats: TrendFormat[] =
  [
    {
      id: "animal-haircut",

      title:
        "Animal Haircut",

      icon: "✂️",

      description:
        "Before/after animal grooming transformations using locked characters and A/B transitions.",

      category:
        "Animals",

      structureFamily:
        "a-b-transitions",

      audioMode:
        "native-audio",

      durations: [
        "10s",
        "20s",
      ],

      style:
        "Photorealistic",

      recommendedModel:
        "Nano Banana",

      tags: [
        "animals",
        "transformation",
        "asmr",
        "viral",
      ],

      isHot: true,

      productionRules: [
        "Lock the client animal identity across every image.",
        "Lock the barber animal identity across every image.",
        "Only the fur state and grooming tool should change.",
        "Use alternating Image A / Image B transition pairs.",
        "Use native grooming sounds only.",
        "No dialogue or narration.",
        "No text or watermarks.",
      ],

      prompt: `
Create a viral animal grooming transformation video.

TOPIC:
[TOPIC]

CLIENT ANIMAL:
[CLIENT_ANIMAL]

BARBER ANIMAL:
[BARBER_ANIMAL]

HAIRCUT STYLE:
[HAIRCUT_STYLE]

DURATION:
[DURATION]

STRUCTURE:

Use A/B image pairs.

Image A:
starting visual state.

Image B:
ending visual state of the same transition.

IDENTITY LOCK:

The client animal must be the exact same individual in every image:
- same face
- same eyes
- same markings
- same proportions

The barber animal must also remain identical:
- same species
- same face
- same grooming apron

Only change:
- fur state
- grooming tool
- physical grooming progress

CAMERA:

Photorealistic close-up.
Shallow depth of field.
Vertical 9:16.
Client face dominates the frame.
Barber appears partially at frame edge.

AUDIO:

Native audio only.

Use:
- brushing
- clippers
- scissors
- spray
- hairdryer
- comb sounds

No narrator.
No dialogue.
No music.

OUTPUT:

---SCENES---

Generate the exact A/B images needed for [DURATION].

---AUDIO---

Generate one matching ASMR audio instruction for every A/B transition.
`.trim(),
    },

    {
      id: "anatomy-fitness",

      title:
        "3D Anatomy Fitness",

      icon: "💪",

      description:
        "Biomechanical exercise and posture videos using porcelain, X-ray, and muscle layers.",

      category:
        "Science",

      structureFamily:
        "a-b-transitions",

      audioMode:
        "voice-over",

      durations: [
        "15s",
        "20s",
        "25s",
        "30s",
        "35s",
        "40s",
        "45s",
        "65s",
      ],

      style:
        "3D Anatomy",

      recommendedModel:
        "Nano Banana",

      tags: [
        "fitness",
        "anatomy",
        "science",
        "education",
      ],

      isHot: true,

      productionRules: [
        "Use alternating A/B image pairs.",
        "Maintain the same mannequin build.",
        "Use porcelain, X-ray and exposed-muscle visual layers.",
        "Always begin with a strong problem hook.",
        "Always finish with a hero/result shot.",
        "Use varied camera angles.",
        "No text inside generated images.",
      ],

      prompt: `
Create a viral biomechanical fitness video.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

EXERCISE OR PROBLEM:
[EXERCISE]

VISUAL SYSTEM:

Use the same athletic male anatomical mannequin across every image.

Three available layers:

1. PORCELAIN
External body posture.

2. X-RAY
Bone and joint alignment.

3. MUSCLE
Muscle fibers, activation and tension.

SCENE STRUCTURE:

Use alternating A/B image pairs.

Always include:

HOOK
Show the physical problem.

EXERCISE
Show the corrective movement.

HERO SHOT
Show the improved final result.

For longer videos add:

DIAGNOSIS
HOPE
SETUP
DETAIL
PROGRESS

CAMERA RULE:

Vary camera angles between pairs.

Use:
- frontal
- lateral
- 45 degree
- macro
- low angle
- close-up

Do not repeat the same angle three times consecutively.

NARRATION:

Confident.
Direct.
Educational.
Short punchy lines.

OUTPUT:

---SCENES---

Generate the exact number of image prompts required for [DURATION].

---NARRATION---

Generate one narration line per A/B pair.
`.trim(),
    },

    {
      id: "body-science",

      title:
        "Body Science",

      icon: "🫀",

      description:
        "Medical lifestyle videos showing what happens inside the human body.",

      category:
        "Science",

      structureFamily:
        "educational",

      audioMode:
        "voice-over",

      durations: [
        "30s",
        "45s",
        "60s",
      ],

      style:
        "Medical Documentary",

      recommendedModel:
        "Nano Banana",

      tags: [
        "body",
        "science",
        "medical",
        "education",
      ],

      isHot: true,

      productionRules: [
        "Start with a viral question.",
        "Use clear progression through time or stages.",
        "Show internal anatomy inside the same person.",
        "Keep the subject visually consistent.",
        "Make every scene visually understandable without captions.",
      ],

      prompt: `
Create a viral Body Science video.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

HOOK:

Begin with a viral question.

Examples:

"What would happen if you [ACTION] every day?"

"How long could you survive without [ACTION]?"

"What happens inside your body when [ACTION]?"

STRUCTURE:

Scene 1:
HOOK.

Middle scenes:
show progression.

Final scene:
show the final biological truth or consequence.

VISUAL STYLE:

Photorealistic medical documentary.

Real adult person in a realistic environment.

Use semi-transparent cutaway anatomy showing the person's own:

- organs
- bones
- muscles
- nervous system

Never place a separate skeleton beside the subject.

Each scene must contain a visible physical action.

No static portraits.

No text.
No labels.
No watermark.
`.trim(),
    },

    {
      id: "cat-story",

      title:
        "Viral Cat Story",

      icon: "🐱",

      description:
        "Emotional anthropomorphic cat stories built around conflict, suffering and payoff.",

      category:
        "Stories",

      structureFamily:
        "fixed-story",

      audioMode:
        "either",

      durations: [
        "30s",
        "45s",
        "60s",
      ],

      style:
        "3D Cat Story",

      recommendedModel:
        "GPT Image",

      tags: [
        "cats",
        "story",
        "emotion",
        "karma",
      ],

      isHot: true,

      productionRules: [
        "Maintain exact recurring cat identities.",
        "Keep outfits and fur colors consistent.",
        "Maximum two cats visible per frame.",
        "Every scene requires visible action and consequence.",
        "Build toward an emotional payoff.",
      ],

      prompt: `
Create a viral anthropomorphic cat story.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

PROTAGONIST:
[PROTAGONIST]

VILLAIN:
[VILLAIN]

STORY ARC:

HOOK

CONFLICT

HUMILIATION OR LOSS

SUFFERING

TURNING POINT

REVENGE / KARMA / EMOTIONAL PAYOFF

CHARACTER LOCK:

Every recurring cat keeps:

- same fur
- same face
- same eyes
- same hairstyle
- same outfit
- same proportions

Maximum two cats visible per frame.

Every scene must include:

1. emotional starting pose
2. clear physical action
3. visible consequence
4. final reaction hold

Do not generate static character portraits.
`.trim(),
    },

    {
      id: "car-evolution",

      title:
        "Car Evolution",

      icon: "🚗",

      description:
        "Mechanical transformation videos showing vehicle evolution through different eras.",

      category:
        "Transformation",

      structureFamily:
        "process-transformation",

      audioMode:
        "native-audio",

      durations: [
        "20s",
        "30s",
        "40s",
        "60s",
      ],

      style:
        "Automotive Cinematic",

      recommendedModel:
        "Nano Banana",

      tags: [
        "cars",
        "evolution",
        "transformation",
      ],

      productionRules: [
        "Keep camera geometry consistent.",
        "Car must continue driving forward.",
        "Transform mechanically rather than fading or dissolving.",
        "Use straight flat roads.",
        "Match duration to exact generations.",
      ],

      prompt: `
Create a cinematic car evolution sequence.

CAR:
[CAR]

START YEAR:
[START_YEAR]

END YEAR:
[END_YEAR]

DURATION:
[DURATION]

CAMERA LOCK:

3/4 front-quarter angle.

Camera height approximately car level.

Natural 50mm perspective.

Straight flat road.

Simple horizon.

TRANSFORMATION:

The vehicle continues driving forward.

Between stages:

- body panels shift
- grille evolves
- lights evolve
- proportions change
- wheels rotate realistically

No fades.

No dissolves.

No magical morphing.

Every transformation should feel mechanical.

Maintain consistent road geometry and camera position.
`.trim(),
    },

    {
      id: "restoration",

      title:
        "Restoration Timelapse",

      icon: "🏚️",

      description:
        "Before-to-after restoration and construction sequences with physically believable progression.",

      category:
        "Transformation",

      structureFamily:
        "process-transformation",

      audioMode:
        "native-audio",

      durations: [
        "20s",
        "30s",
        "40s",
      ],

      style:
        "Photorealistic",

      recommendedModel:
        "Nano Banana",

      tags: [
        "restoration",
        "construction",
        "transformation",
      ],

      productionRules: [
        "Use consistent geometry.",
        "Show human-driven construction steps.",
        "Avoid instant transformations.",
        "Keep camera position locked through process shots.",
        "Finish with cinematic hero reveal.",
      ],

      prompt: `
Create a realistic restoration timelapse.

SUBJECT:
[SUBJECT]

LOCATION:
[LOCATION]

FINAL STYLE:
[STYLE]

DURATION:
[DURATION]

SEQUENCE:

1. BEFORE
Show damaged or abandoned state.

2. STRUCTURAL PREP
Workers remove debris and damaged materials.

3. REPAIR
Show believable construction and repair steps.

4. FINISH
Install final surfaces and details.

5. STAGING
Workers manually bring furnishings or final elements.

6. HERO REVEAL
Show completed result.

RULES:

No instant transformations.

No objects magically appearing.

Workers must physically perform changes.

Maintain consistent building geometry.

Use the same locked camera for process stages.

Final reveal may use a subtle cinematic push-in.
`.trim(),
    },

    {
      id: "clay-story",

      title:
        "Claymation Story",

      icon: "🧱",

      description:
        "Short-form claymation episodes with fixed cast, causal story beats and strong cliffhangers.",

      category:
        "Stories",

      structureFamily:
        "fixed-story",

      audioMode:
        "native-audio",

      durations: [
        "42s",
        "54s",
        "60s",
      ],

      style:
        "Claymation",

      recommendedModel:
        "Nano Banana",

      tags: [
        "claymation",
        "story",
        "dialogue",
        "shorts",
      ],

      isNew: true,

      productionRules: [
        "Fixed 6-second scenes.",
        "Selected story engine controls beat order.",
        "Selected cast remains authoritative.",
        "Every scene must cause the next scene.",
        "Use short dialogue.",
        "End with payoff or Part 2 cliffhanger.",
      ],

      prompt: `
Create a short-form claymation mini-episode.

STORY:
[TOPIC]

DURATION:
[DURATION]

CAST:
[CAST_LOCK]

STYLE:
[STYLE_LOCK]

STRUCTURE:

Every scene is approximately 6 seconds.

Each scene needs:

- clear starting pose
- one important physical action
- short dialogue or reaction
- visible consequence
- final reaction hold

CONTINUITY:

The selected cast is authoritative.

Never switch:

- names
- faces
- wardrobe
- voice personality
- character role

STORY:

Keep every scene causally connected.

Do not create random jumps.

The final scene must deliver:

- reveal
- consequence
- escape
- confrontation
or
- Part 2 cliffhanger

Dialogue should be compact and natural.
`.trim(),
    },

    {
      id: "brainrot",

      title:
        "Brainrot Story",

      icon: "🧠",

      description:
        "Fast absurd 3D meme stories using fixed topics, native audio and strong action handoffs.",

      category:
        "Stories",

      structureFamily:
        "fixed-story",

      audioMode:
        "native-audio",

      durations: [
        "35s",
        "45s",
        "65s",
      ],

      style:
        "Italian Brainrot",

      recommendedModel:
        "GPT Image",

      tags: [
        "brainrot",
        "meme",
        "viral",
        "karma",
      ],

      isHot: true,

      productionRules: [
        "Use fixed topic story logic.",
        "Do not randomly invent another plot.",
        "Every scene is one complete beat.",
        "Use native sound effects and minimal dialogue.",
        "Each scene hands off visually to the next.",
      ],

      prompt: `
Create a viral absurd 3D meme story.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

STYLE:
[STYLE_LOCK]

AUDIO:

Native audio only.

Use:

- impact sounds
- prop sounds
- location ambience
- laughs
- whispers
- cries
- sirens
- work sounds

Dialogue should be minimal.

SCENE RULE:

Every scene must contain:

1. clear starting pose
2. physical action
3. visible consequence
4. reaction
5. final hold

Scene N must visibly connect to Scene N+1 through:

- prop
- money
- clue
- location
- injury
- expression
- character movement

No random scene jumps.
`.trim(),
    },

    {
      id: "conspiracy",

      title:
        "Mystery / Conspiracy",

      icon: "🛸",

      description:
        "Documentary-style mystery storytelling using evidence, escalation and unresolved endings.",

      category:
        "Mystery",

      structureFamily:
        "mystery",

      audioMode:
        "voice-over",

      durations: [
        "30s",
        "45s",
        "60s",
      ],

      style:
        "Dark Documentary",

      recommendedModel:
        "Nano Banana",

      tags: [
        "mystery",
        "documentary",
        "conspiracy",
      ],

      productionRules: [
        "Separate documented facts from speculation.",
        "Escalate tension scene by scene.",
        "Use different locations and camera angles.",
        "End unresolved when appropriate.",
      ],

      prompt: `
Create a cinematic mystery documentary video.

TOPIC:
[TOPIC]

DURATION:
[DURATION]

FACTUAL RULE:

Clearly distinguish:

DOCUMENTED:
verifiable information.

CLAIM:
reported allegation or testimony.

SPECULATION:
unverified interpretation.

STORY STRUCTURE:

HOOK

EVIDENCE

ESCALATION

COVER-UP OR CONTRADICTION

CONSEQUENCE

UNRESOLVED QUESTION

VISUAL RULES:

Use a different camera angle each scene.

Use locations specific to the topic.

Lighting should become progressively darker as tension rises.

Do not present speculation as established fact.
`.trim(),
    },
  ];

export function getTrendFormat(
  id: string
) {
  return (
    trendFormats.find(
      (format) =>
        format.id === id
    ) ?? null
  );
}