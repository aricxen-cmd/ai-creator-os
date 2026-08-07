export function buildResearchPrompt(topic: string) {
  return `
You are an expert YouTube researcher.

Research this topic:

${topic}

Return:

1. Summary

2. 10 important facts

3. 10 surprising facts

4. 10 viral video ideas

Use bullet points.

Return plain text only.
`;
}