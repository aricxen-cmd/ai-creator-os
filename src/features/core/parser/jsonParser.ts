export function parseJSON<T>(input: string): T {
  try {
    return JSON.parse(input) as T;
  } catch {
    throw new Error("AI returned invalid JSON.");
  }
}