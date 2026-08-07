interface PromptOptions {
  role: string;
  task: string;
  output: string;
  context: string;
}

export function buildPrompt({
  role,
  task,
  output,
  context,
}: PromptOptions) {
  return `
You are ${role}.

Task:

${task}

Context:

${context}

Return:

${output}

Return ONLY the requested output.
`.trim();
}