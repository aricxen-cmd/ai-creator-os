import { supabase } from "./client";

export async function updateProject(
  id: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("projects")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

setScript(data.response);

await updateProject(projectId, {
  script: data.response,
});

await updateProject(projectId, {
  research: data.response,
});