export interface TrendProjectSettings {
  source?: string;

  trendFormatId?: string;
  trendFormatTitle?: string;

  topic?: string;
  duration?: string;

  category?: string;

  structureFamily?: string;
  audioMode?: string;

  style?: string;
  recommendedModel?: string;

  tags?: string[];

  productionRules?: string[];

  masterPrompt?: string;
}

export function readTrendProjectSettings(
  value: unknown
): TrendProjectSettings | null {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return null;
  }

  const settings =
    value as TrendProjectSettings;

  if (
    settings.source !==
    "trends"
  ) {
    return null;
  }

  return settings;
}

export function buildTrendProductionContext(
  settings:
    TrendProjectSettings | null
) {
  if (!settings) {
    return "";
  }

  const rules =
    Array.isArray(
      settings.productionRules
    )
      ? settings.productionRules
      : [];

  return `
AI CREATOR OS TREND PRODUCTION CONTRACT

FORMAT:
${settings.trendFormatTitle ?? "Unknown"}

TOPIC:
${settings.topic ?? "Not specified"}

DURATION:
${settings.duration ?? "Not specified"}

CATEGORY:
${settings.category ?? "General"}

STRUCTURE:
${settings.structureFamily ?? "General"}

AUDIO MODE:
${settings.audioMode ?? "Either"}

VISUAL STYLE:
${settings.style ?? "Default"}

RECOMMENDED IMAGE / VIDEO MODEL:
${settings.recommendedModel ?? "Not specified"}

PRODUCTION RULES:
${
  rules.length
    ? rules
        .map(
          (rule, index) =>
            `${index + 1}. ${rule}`
        )
        .join("\n")
    : "No additional production rules."
}

MASTER FORMAT PROMPT:

${settings.masterPrompt ?? "No master format prompt saved."}

IMPORTANT:

Treat this production contract as authoritative.

Do not replace the selected format with a generic video structure.

Keep duration, audio mode, story structure, continuity requirements, visual style, scene-count logic, and production rules consistent throughout the project.
`.trim();
}

export function trendDurationToScriptLength(
  duration?: string
) {
  if (!duration) {
    return "30 Seconds";
  }

  const clean =
    duration.trim();

  const seconds =
    clean.match(
      /^(\d+)\s*s$/i
    );

  if (seconds) {
    return `${seconds[1]} Seconds`;
  }

  return clean;
}