export interface PromptVariable {
  key: string;
  label: string;
}

const variablePattern =
  /\[([A-Z0-9_ -]+)\]/g;

export function extractPromptVariables(
  prompt: string
): PromptVariable[] {
  if (!prompt.trim()) {
    return [];
  }

  const found =
    new Map<
      string,
      PromptVariable
    >();

  const matches =
    prompt.matchAll(
      variablePattern
    );

  for (const match of matches) {
    const raw =
      match[1]?.trim();

    if (!raw) {
      continue;
    }

    const key =
      normalizeVariableKey(
        raw
      );

    if (!key) {
      continue;
    }

    if (
      !found.has(key)
    ) {
      found.set(
        key,
        {
          key,

          label:
            variableKeyToLabel(
              key
            ),
        }
      );
    }
  }

  return Array.from(
    found.values()
  );
}

export function applyPromptVariables(
  prompt: string,
  values: Record<
    string,
    string
  >
) {
  return prompt.replace(
    variablePattern,
    (
      fullMatch,
      rawKey: string
    ) => {
      const key =
        normalizeVariableKey(
          rawKey
        );

      const value =
        values[key];

      if (
        typeof value !==
          "string" ||
        !value.trim()
      ) {
        return fullMatch;
      }

      return value.trim();
    }
  );
}

export function normalizeVariableKey(
  value: string
) {
  return value
    .trim()
    .toUpperCase()
    .replace(
      /[\s-]+/g,
      "_"
    )
    .replace(
      /[^A-Z0-9_]/g,
      ""
    );
}

export function variableKeyToLabel(
  key: string
) {
  return key
    .split("_")
    .filter(Boolean)
    .map((word) => {
      return (
        word.charAt(0) +
        word
          .slice(1)
          .toLowerCase()
      );
    })
    .join(" ");
}