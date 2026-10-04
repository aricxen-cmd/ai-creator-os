import type { TrendTemplate } from "@/features/trends/types";

/*
 * =========================================================
 * AI CREATOR OS — TREND REGISTRY
 * =========================================================
 *
 * Reusable short-form production formats.
 *
 * Public format concepts are based on currently documented
 * VidMakerPro formats. Production rules are normalized for
 * AI Creator OS rather than copied as page content.
 *
 * IMPORTANT:
 * - Production Contract remains authoritative.
 * - Trend templates define creative behavior.
 * - Storyboard / Scenes must obey resolved timing.
 */


/*
 * =========================================================
 * SHARED OPTIONS
 * =========================================================
 */

const SHORT_FORM_AUDIO = [
  {
    id: "voice-over" as const,
    label: "Voice Over",
    description:
      "Narrator-led production with nonverbal characters and synchronized captions.",
  },
  {
    id: "native-audio" as const,
    label: "Native Audio",
    description:
      "In-scene character dialogue, ambience, and sound effects.",
  },
];

const VOICE_OVER_AUDIO = [
  {
    id: "voice-over" as const,
    label: "Voice Over",
    description:
      "Narration drives the story while visuals communicate each beat.",
  },
];

const NATIVE_AUDIO = [
  {
    id: "native-audio" as const,
    label: "Native Audio",
    description:
      "Dialogue and sound occur naturally inside each generated scene.",
  },
];


/*
 * =========================================================
 * REGISTRY
 * =========================================================
 */

export const TREND_REGISTRY: TrendTemplate[] = [
  /*
   * -------------------------------------------------------
   * FOOD STORY
   * -------------------------------------------------------
   */

  {
    id: "food-story",

    name: "Food Story",

    description:
      "Anthropomorphic food characters perform a compact dramatic story with a hook, escalation, character reactions, and payoff.",

    category: "food",

    promptTemplateId: "food-story",

    tags: [
      "food",
      "story",
      "characters",
      "drama",
      "comedy",
      "native-audio",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "native-audio",

    defaultDurationSeconds: 42,

    durations: [
      {
        label: "42 Seconds",
        totalSeconds: 42,
        sceneCount: 7,
        sceneDurationSeconds: 6,
        exact: true,
      },
      {
        label: "54 Seconds",
        totalSeconds: 54,
        sceneCount: 9,
        sceneDurationSeconds: 6,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 10,
        sceneDurationSeconds: 6,
        exact: true,
      },
    ],

    audioModes: SHORT_FORM_AUDIO,

    storyOptions: [
      {
        id: "relationship-drama",
        label: "Relationship Drama",
      },
      {
        id: "mystery",
        label: "Mystery",
      },
      {
        id: "rivalry",
        label: "Rivalry",
      },
      {
        id: "family-drama",
        label: "Family Drama",
      },
      {
        id: "comedy",
        label: "Comedy",
      },
    ],

    allowCustomTopic: true,

    allowCustomInstructions: true,

    requireCast: false,

    requireStoryOption: false,

    instructions: [
      "Use a stable recurring cast throughout the complete story.",
      "Keep character identity, wardrobe, personality, and voice consistent.",
      "Prefer a clear lead, rival, and partner/supporting role structure.",
      "Every scene must contain a readable story beat.",
      "Use start pose, physical action, and final reaction.",
      "Scene N+1 inherits the physical and emotional result of Scene N.",
      "Do not reset props, relationships, discoveries, or conflict between scenes.",
      "Escalate toward a visible payoff instead of adding filler.",
      "Keep dialogue short enough to fit naturally inside each scene.",
    ],
  },


  /*
   * -------------------------------------------------------
   * BRAINROT STORY
   * -------------------------------------------------------
   */

  {
    id: "brainrot-story",

    name: "Brainrot Story",

    description:
      "Fast surreal short-form storytelling built around strange characters, rapid novelty, escalating situations, and an immediate hook.",

    category: "brainrot",

    promptTemplateId: "brainrot-story",

    tags: [
      "brainrot",
      "surreal",
      "gen-alpha",
      "comedy",
      "fast-paced",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "native-audio",

    defaultDurationSeconds: 35,

    durations: [
      {
        label: "35 Seconds",
        totalSeconds: 35,
        sceneCount: 7,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 9,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "65 Seconds",
        totalSeconds: 65,
        sceneCount: 13,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: SHORT_FORM_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Hook immediately with a strange but understandable situation.",
      "Maintain rapid visual novelty without losing story continuity.",
      "Give every scene one primary readable action.",
      "Escalate the situation instead of repeating the same joke.",
      "Keep recurring characters visually recognizable.",
      "Use short dialogue or narration appropriate to the selected audio mode.",
      "End with a memorable payoff, reversal, reveal, or cliffhanger.",
    ],
  },


  /*
   * -------------------------------------------------------
   * STREET CARTOON / CLAYMATION
   * -------------------------------------------------------
   */

  {
    id: "street-cartoon-story",

    name: "Street Cartoon / Claymation Story",

    description:
      "Character-driven street story using stylized cartoon or claymation visuals, physical acting, short dialogue, and strong continuity.",

    category: "story",

    promptTemplateId: "street-cartoon-story",

    tags: [
      "claymation",
      "cartoon",
      "street-story",
      "dialogue",
      "characters",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "native-audio",

    defaultDurationSeconds: 42,

    durations: [
      {
        label: "42 Seconds",
        totalSeconds: 42,
        sceneCount: 7,
        sceneDurationSeconds: 6,
        exact: true,
      },
      {
        label: "54 Seconds",
        totalSeconds: 54,
        sceneCount: 9,
        sceneDurationSeconds: 6,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 10,
        sceneDurationSeconds: 6,
        exact: true,
      },
    ],

    audioModes: NATIVE_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Treat the selected cast and story engine as authoritative.",
      "Maintain the same cast identities across the complete story.",
      "Prefer no more than two foreground characters in one frame.",
      "Keep the number of named characters small.",
      "Use short in-scene dialogue rather than long narration.",
      "Each scene should contain one strong physical story beat.",
      "Carry prop state and unresolved consequences into the next scene.",
      "Avoid reset scenes and unexplained location jumps.",
      "Allow occasional silent reaction beats when they improve pacing.",
      "Build toward a payoff or intentional cliffhanger.",
    ],
  },


  /*
   * -------------------------------------------------------
   * TALKING OBJECTS
   * -------------------------------------------------------
   */

  {
    id: "talking-objects",

    name: "Talking Objects",

    description:
      "Everyday objects become recurring characters with faces, personalities, voices, and short comedic or story-driven dialogue.",

    category: "comedy",

    promptTemplateId: "talking-objects",

    tags: [
      "objects",
      "talking",
      "comedy",
      "characters",
      "dialogue",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "native-audio",

    defaultDurationSeconds: 30,

    durations: [
      {
        label: "15 Seconds",
        totalSeconds: 15,
        sceneCount: 3,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 9,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 12,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: NATIVE_AUDIO,

    storyOptions: [
      {
        id: "funny",
        label: "Funny",
      },
      {
        id: "roast",
        label: "Roast",
      },
      {
        id: "advice",
        label: "Advice",
      },
      {
        id: "story",
        label: "Story",
      },
    ],

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Give the object an immediately recognizable personality.",
      "Preserve its face, material, proportions, colors, and voice across scenes.",
      "Keep dialogue short and conversational.",
      "Use physical object behavior to reinforce the joke or story.",
      "Do not redesign the character between scenes.",
      "Build toward a short visual or dialogue payoff.",
    ],
  },


  /*
   * -------------------------------------------------------
   * SKELETON SHORTS
   * -------------------------------------------------------
   */

  {
    id: "skeleton-shorts",

    name: "Skeleton Shorts",

    description:
      "Curiosity-led educational shorts explaining body, health, science, fitness, nutrition, sleep, or habit changes with anatomy visuals.",

    category: "education",

    promptTemplateId: "skeleton-shorts",

    tags: [
      "skeleton",
      "anatomy",
      "health",
      "science",
      "education",
      "curiosity",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "voice-over",

    defaultDurationSeconds: 45,

    durations: [
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 9,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 12,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: VOICE_OVER_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Open with a curiosity hook immediately.",
      "Use a recognizable anatomy or skeleton visual host.",
      "Progress logically through the body changes being explained.",
      "Use organ-level or skeletal visuals when relevant.",
      "Each scene should explain one understandable change.",
      "Keep characters nonverbal when voice-over mode is selected.",
      "Do not place dialogue or lip-sync instructions inside visual prompts.",
      "Finish with a clear takeaway.",
      "Do not present uncertain health claims as established facts.",
    ],
  },


  /*
   * -------------------------------------------------------
   * ANATOMY FITNESS
   * -------------------------------------------------------
   */

  {
    id: "anatomy-fitness",

    name: "Anatomy Fitness",

    description:
      "Visual fitness and anatomy explainer using paired before/action or A/B images with synchronized five-second animation beats.",

    category: "fitness",

    promptTemplateId: "anatomy-fitness",

    tags: [
      "fitness",
      "anatomy",
      "exercise",
      "education",
      "body",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "voice-over",

    defaultDurationSeconds: 30,

    durations: [
      {
        label: "15 Seconds",
        totalSeconds: 15,
        sceneCount: 3,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "20 Seconds",
        totalSeconds: 20,
        sceneCount: 4,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "25 Seconds",
        totalSeconds: 25,
        sceneCount: 5,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "35 Seconds",
        totalSeconds: 35,
        sceneCount: 7,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "40 Seconds",
        totalSeconds: 40,
        sceneCount: 8,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 9,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "65 Seconds",
        totalSeconds: 65,
        sceneCount: 13,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: VOICE_OVER_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Treat every animation beat as exactly five seconds.",
      "Build visuals as logical A-to-B transformations or demonstrations.",
      "Use one narration beat per animation pair.",
      "Keep visual prompts free from dialogue and lip-sync instructions.",
      "Show anatomy clearly enough for the educational point to be readable.",
      "Keep narration concise enough to fit the production runtime.",
    ],
  },


  /*
   * -------------------------------------------------------
   * WEIRDCORE
   * -------------------------------------------------------
   */

  {
    id: "weirdcore-story",

    name: "Weirdcore",

    description:
      "Surreal, nostalgic and unsettling storytelling using liminal environments, small mystery clues, strange narration, and an unresolved final twist.",

    category: "story",

    promptTemplateId: "weirdcore-story",

    tags: [
      "weirdcore",
      "liminal",
      "surreal",
      "nostalgia",
      "mystery",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "voice-over",

    defaultDurationSeconds: 40,

    durations: [
      {
        label: "20 Seconds",
        totalSeconds: 20,
        sceneCount: 4,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "40 Seconds",
        totalSeconds: 40,
        sceneCount: 8,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 12,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: VOICE_OVER_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Begin with an unsettling first sentence or immediately abnormal visual.",
      "Use liminal visual progression rather than random disconnected imagery.",
      "Introduce small recurring mystery clues.",
      "Maintain environmental continuity where the story remains in one location.",
      "Use dreamlike but readable visual composition.",
      "Avoid explaining every mystery.",
      "End with an open-ended twist, discovery, or disturbing implication.",
    ],
  },


  /*
   * -------------------------------------------------------
   * ANIMAL MICRO CAMERA / POV
   * -------------------------------------------------------
   */

  {
    id: "animal-micro-camera",

    name: "Animal POV / Micro Camera",

    description:
      "Immersive miniature-camera animal adventure with a POV hook, cinematic journey, obstacle, discovery, and cute or surprising payoff.",

    category: "pov",

    promptTemplateId: "animal-micro-camera",

    tags: [
      "animal",
      "pov",
      "micro-camera",
      "adventure",
      "cinematic",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "voice-over",

    defaultDurationSeconds: 40,

    durations: [
      {
        label: "20 Seconds",
        totalSeconds: 20,
        sceneCount: 4,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "40 Seconds",
        totalSeconds: 40,
        sceneCount: 8,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 12,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: VOICE_OVER_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Open from an immersive tiny-camera or animal-level viewpoint.",
      "Keep the featured animal recognizable throughout the journey.",
      "Maintain believable scale between the animal and environment.",
      "Progress through a physical journey rather than disconnected animal shots.",
      "Introduce at least one understandable obstacle, discovery, or danger.",
      "Keep camera motion grounded in the selected POV.",
      "Finish with a cute, surprising, mysterious, or satisfying discovery.",
    ],
  },


  /*
   * -------------------------------------------------------
   * REDDIT STORY
   * -------------------------------------------------------
   */

  {
    id: "reddit-story",

    name: "Reddit Story",

    description:
      "First-person confession-style short with a strong hook, rapid narration, suspense progression, supporting visuals, subtitles, and a twist or resolution.",

    category: "story",

    promptTemplateId: "reddit-story",

    tags: [
      "reddit",
      "confession",
      "story",
      "drama",
      "twist",
      "narration",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "voice-over",

    defaultDurationSeconds: 50,

    durations: [
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 9,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "50 Seconds",
        totalSeconds: 50,
        sceneCount: 10,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 12,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: VOICE_OVER_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Write from a clear first-person point of view.",
      "Open with the event, confession, or problem rather than background exposition.",
      "Reveal information progressively.",
      "Keep narration fast enough for short-form retention.",
      "Every scene must add new information or a visible consequence.",
      "Use visuals to support the narration rather than repeat generic filler shots.",
      "Build toward a twist, decision, reveal, or resolution.",
    ],
  },


  /*
   * -------------------------------------------------------
   * RESTORATION TIMELAPSE
   * -------------------------------------------------------
   */

  {
    id: "restoration-timelapse",

    name: "Restoration Timelapse",

    description:
      "Before-to-after transformation format that preserves the same object and environment while showing visible restoration progress.",

    category: "restoration",

    promptTemplateId: "restoration-timelapse",

    tags: [
      "restoration",
      "transformation",
      "before-after",
      "timelapse",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "none",

    defaultDurationSeconds: 45,

    durations: [
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 8,
        sceneDurationSeconds: 3.75,
        exact: false,
        description:
          "Eight transformation states at approximately 3.75 seconds each.",
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 11,
        sceneDurationSeconds: 4.1,
        exact: false,
        description:
          "Eleven transformation states at approximately 4.1 seconds each.",
      },
      {
        label: "65 Seconds",
        totalSeconds: 65,
        sceneCount: 13,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: [
      {
        id: "none",
        label: "Visual / Music",
        description:
          "Transformation-led production without spoken narration.",
      },
    ],

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Lock the identity and geometry of the object being restored.",
      "Keep the primary environment recognizable across the sequence.",
      "Begin with a clearly damaged, abandoned, dirty, or incomplete state.",
      "Each scene must show measurable physical progress.",
      "Do not reset the object to an earlier restoration state.",
      "Preserve completed work in every following scene.",
      "Use logical restoration order.",
      "End with a clean, unmistakable final reveal.",
    ],
  },


  /*
   * -------------------------------------------------------
   * CAR EVOLUTION
   * -------------------------------------------------------
   */

  {
    id: "car-evolution",

    name: "Car Evolution",

    description:
      "Vehicle evolution sequence with stable framing and clearly readable era-to-era transformations.",

    category: "automotive",

    promptTemplateId: "car-evolution",

    tags: [
      "cars",
      "evolution",
      "automotive",
      "transformation",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "none",

    defaultDurationSeconds: 40,

    durations: [
      {
        label: "20 Seconds",
        totalSeconds: 20,
        sceneCount: 2,
        sceneDurationSeconds: 10,
        exact: true,
      },
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 3,
        sceneDurationSeconds: 10,
        exact: true,
      },
      {
        label: "40 Seconds",
        totalSeconds: 40,
        sceneCount: 4,
        sceneDurationSeconds: 10,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 6,
        sceneDurationSeconds: 10,
        exact: true,
      },
    ],

    audioModes: [
      {
        id: "none",
        label: "Visual / Music",
      },
    ],

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Keep camera framing and vehicle orientation stable across transformations.",
      "Make every era or generation visually distinct.",
      "Preserve enough shared vehicle identity for the evolution to read clearly.",
      "Avoid unrelated camera changes that weaken the transformation.",
      "Use era-appropriate environmental and design details.",
      "Build toward the newest or final form.",
    ],
  },


  /*
   * -------------------------------------------------------
   * HISTORY SHORTS
   * -------------------------------------------------------
   */

  {
    id: "history-shorts",

    name: "History Shorts",

    description:
      "Hook-led short-form historical storytelling with chronological progression, cinematic visual reconstruction, narration, and a clear takeaway.",

    category: "education",

    promptTemplateId: "history-shorts",

    tags: [
      "history",
      "education",
      "documentary",
      "storytelling",
    ],

    defaultAspectRatio: "9:16",

    defaultAudioMode: "voice-over",

    defaultDurationSeconds: 45,

    durations: [
      {
        label: "30 Seconds",
        totalSeconds: 30,
        sceneCount: 6,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "45 Seconds",
        totalSeconds: 45,
        sceneCount: 9,
        sceneDurationSeconds: 5,
        exact: true,
      },
      {
        label: "60 Seconds",
        totalSeconds: 60,
        sceneCount: 12,
        sceneDurationSeconds: 5,
        exact: true,
      },
    ],

    audioModes: VOICE_OVER_AUDIO,

    allowCustomTopic: true,

    allowCustomInstructions: true,

    instructions: [
      "Open with the most curiosity-driving documented fact or question.",
      "Maintain understandable chronological or causal progression.",
      "Use historically appropriate visual details when known.",
      "Do not invent uncertain details as established historical facts.",
      "Separate documented fact from dramatized visual reconstruction.",
      "Each scene should advance the explanation.",
      "Finish with the historical consequence, reveal, or takeaway.",
    ],
  },
];


/*
 * =========================================================
 * REGISTRY HELPERS
 * =========================================================
 */

export function getTrendTemplate(
  trendId: string
): TrendTemplate | undefined {
  return TREND_REGISTRY.find(
    (trend) => trend.id === trendId
  );
}

export function getTrendTemplatesByCategory(
  category: string
): TrendTemplate[] {
  return TREND_REGISTRY.filter(
    (trend) => trend.category === category
  );
}

export function searchTrendTemplates(
  query: string
): TrendTemplate[] {
  const normalizedQuery = query
    .trim()
    .toLowerCase();

  if (!normalizedQuery) {
    return TREND_REGISTRY;
  }

  return TREND_REGISTRY.filter((trend) => {
    const searchableText = [
      trend.name,
      trend.description,
      trend.category,
      ...(trend.tags ?? []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(
      normalizedQuery
    );
  });
}

export function getDefaultTrendTemplate():
  | TrendTemplate
  | undefined {
  return TREND_REGISTRY[0];
}

export default TREND_REGISTRY;