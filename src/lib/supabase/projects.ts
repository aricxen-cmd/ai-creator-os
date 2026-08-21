import {
  supabase,
} from "./client";

export async function getProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data ?? [];
}

export async function getProject(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}

export async function createProject(
  title: string,
  description: string
) {
  const { data, error } = await supabase
    .from("projects")
    .insert([
      {
        title,
        description,
        status: "Researching",
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}


export async function updateProjectResearch(
  id: string,
  research: string
) {
  const { data, error } = await supabase
    .from("projects")
    .update({
      research,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}