export function renderPromptTemplate(
  template: string,
  values: Record<
    string,
    string | number | boolean
  > = {}
): string {
  let result = template;

  for (const [key, value] of Object.entries(values)) {
    const cleanValue = String(value);

    const patterns = [
      new RegExp(`\\{\\{${escapeRegex(key)}\\}\\}`, "gi"),
      new RegExp(`\\[${escapeRegex(key)}\\]`, "gi"),
      new RegExp(
        `\\[WRITE ${escapeRegex(key)} HERE\\]`,
        "gi"
      ),
    ];

    for (const pattern of patterns) {
      result = result.replace(pattern, cleanValue);
    }
  }

  return result.trim();
}

function escapeRegex(value: string) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}