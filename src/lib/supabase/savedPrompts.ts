import { supabase } from "./client";

export interface SavedPromptRow {
  id: string;
  name: string;
  prompt_type: string;
  prompt: string;

  template_id: string | null;

  cast_ids: string[];

  project_id: string | null;
  scene_id: number | null;

  metadata: Record<string, unknown>;

  created_at?: string;
  updated_at?: string;
}

export async function getSavedPrompts() {
  const { data, error } = await supabase
    .from("saved_prompts")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createSavedPrompt(input: {
  name: string;
  promptType: string;
  prompt: string;

  templateId?: string | null;

  castIds?: string[];

  projectId?: string | null;
  sceneId?: number | null;

  metadata?: Record<string, unknown>;
}) {
  const { data, error } = await supabase
    .from("saved_prompts")
    .insert({
      name: input.name,

      prompt_type:
        input.promptType,

      prompt:
        input.prompt,

      template_id:
        input.templateId ?? null,

      cast_ids:
        input.castIds ?? [],

      project_id:
        input.projectId ?? null,

      scene_id:
        input.sceneId ?? null,

      metadata:
        input.metadata ?? {},
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateSavedPrompt(
  id: string,
  updates: {
    name?: string;
    prompt?: string;

    project_id?:
      | string
      | null;

    scene_id?:
      | number
      | null;

    metadata?: Record<
      string,
      unknown
    >;
  }
) {
  const { data, error } = await supabase
    .from("saved_prompts")
    .update({
      ...updates,

      updated_at:
        new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteSavedPrompt(
  id: string
) {
  const { error } = await supabase
    .from("saved_prompts")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getProjectPrompts(
  projectId: string
) {
  const { data, error } = await supabase
    .from("saved_prompts")
    .select("*")
    .eq(
      "project_id",
      projectId
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getScenePrompts(
  projectId: string,
  sceneId: number
) {
  const { data, error } = await supabase
    .from("saved_prompts")
    .select("*")
    .eq(
      "project_id",
      projectId
    )
    .eq(
      "scene_id",
      sceneId
    )
    .order(
      "created_at",
      {
        ascending: false,
      }
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}