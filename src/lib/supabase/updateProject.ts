import { supabase } from "./client";

export async function updateProject(
  id: string,
  updates: Record<string, unknown>
) {
  const { data, error } = await supabase
    .from("projects")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Failed to update project:", error);
    throw error;
  }

  return data;
}