export interface ScriptPromptOptions {
  topic: string;
  platform: string;
  length: string;
  style: string;
  audience: string;
}

export function buildScriptPrompt({
  topic,
  platform,
  length,
  style,
  audience,
}: ScriptPromptOptions): string {
  return `
You are an award-winning viral content writer.

Your task is to write an engaging, high-retention script for ${platform}.

VIDEO DETAILS

Topic:
${topic}

Platform:
${platform}

Length:
${length}

Style:
${style}

Target Audience:
${audience}

WRITING REQUIREMENTS

• Start with an irresistible hook in the first 3 seconds.
• Keep the pacing fast and engaging.
• Build curiosity throughout the video.
• Use short, conversational sentences.
• Avoid unnecessary filler.
• Include one surprising fact or statistic.
• Finish with a memorable ending.
• End with a strong call-to-action.

Return ONLY the final script.

Do not include notes, headings, explanations, or markdown.
`.trim();
}