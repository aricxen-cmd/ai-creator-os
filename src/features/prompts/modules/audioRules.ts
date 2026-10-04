import type {
  PromptAudioMode,
  PromptAudioRules,
} from "@/features/prompts/types";

export const VOICE_OVER_AUDIO_RULES: PromptAudioRules = {
  mode: "voice-over",

  narration: true,
  dialogue: false,
  nativeAudio: false,
  music: true,
  soundEffects: true,
  ambient: true,

  requireSpeakerLabels: false,
  requireVoiceContinuity: true,

  allowSilentScenes: true,

  notes: [
    "Narration carries the spoken story.",
    "Visible characters remain nonverbal unless the template explicitly enables dialogue.",
    "Do not add lip-sync instructions when characters are not speaking.",
    "Ambient sound and sound effects should support visible actions.",
    "Music should support pacing and emotion without overpowering narration.",
    "Narration must fit naturally inside the available production runtime.",
  ],
};

export const NATIVE_AUDIO_RULES: PromptAudioRules = {
  mode: "native-audio",

  narration: false,
  dialogue: true,
  nativeAudio: true,
  music: true,
  soundEffects: true,
  ambient: true,

  requireSpeakerLabels: true,
  requireVoiceContinuity: true,

  allowSilentScenes: true,
  minimumSilentScenes: 0,

  notes: [
    "Clearly assign every spoken line to the correct character.",

    "Keep recurring character voices stable across scenes.",

    "Do not silently transfer dialogue between characters.",

    "Dialogue must fit naturally within the scene duration.",

    "Physical acting and facial expression must support the spoken performance.",

    "Sound effects should correspond to visible physical events.",

    "Ambient sound should match the environment.",

    "Avoid unnecessary narration when the story is designed for native character dialogue.",
  ],
};

export const SILENT_VISUAL_AUDIO_RULES: PromptAudioRules = {
  mode: "none",

  narration: false,
  dialogue: false,
  nativeAudio: false,
  music: false,
  soundEffects: false,
  ambient: false,

  requireSpeakerLabels: false,
  requireVoiceContinuity: false,

  allowSilentScenes: true,

  notes: [
    "Do not generate dialogue.",
    "Do not generate narration.",
    "Do not add lip-sync instructions.",
    "The visual sequence must communicate the story without spoken audio.",
  ],
};

export const MUSIC_DRIVEN_AUDIO_RULES: PromptAudioRules = {
  mode: "none",

  narration: false,
  dialogue: false,
  nativeAudio: false,
  music: true,
  soundEffects: true,
  ambient: true,

  requireSpeakerLabels: false,
  requireVoiceContinuity: false,

  allowSilentScenes: true,

  notes: [
    "Do not generate spoken dialogue or narration.",
    "Use visual storytelling as the primary communication method.",
    "Music direction should describe mood, pacing, instrumentation, and energy rather than naming copyrighted songs or artists.",
    "Sound effects may emphasize important visible actions and transitions.",
  ],
};

export function getAudioRules(
  mode: PromptAudioMode
): PromptAudioRules {
  switch (mode) {
    case "native-audio":
      return NATIVE_AUDIO_RULES;

    case "voice-over":
      return VOICE_OVER_AUDIO_RULES;

    case "none":
    default:
      return SILENT_VISUAL_AUDIO_RULES;
  }
}

export function createAudioRules(
  base: PromptAudioRules,
  overrides: Partial<PromptAudioRules> = {}
): PromptAudioRules {
  return {
    ...base,
    ...overrides,

    notes: [
      ...(base.notes ?? []),
      ...(overrides.notes ?? []),
    ],
  };
}