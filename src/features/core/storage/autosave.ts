export async function autosaveProject(
  id: string,
  updates: Record<string, unknown>
) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error("Failed to autosave project.");
  }

  return response.json();
}