import { supabase } from "./client";

export interface PromptTemplateRow {
  id: string;
  name: string;
  description: string | null;
  style_lock: string | null;
  created_at?: string;
  updated_at?: string;
}

export async function getPromptTemplates() {
  const { data, error } = await supabase
    .from("prompt_templates")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createPromptTemplate(
  name: string,
  description: string,
  styleLock: string
) {
  const { data, error } = await supabase
    .from("prompt_templates")
    .insert({
      name,
      description,
      style_lock: styleLock,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updatePromptTemplate(
  id: string,
  updates: {
    name?: string;
    description?: string;
    style_lock?: string;
  }
) {
  const { data, error } = await supabase
    .from("prompt_templates")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deletePromptTemplate(
  id: string
) {
  const { error } = await supabase
    .from("prompt_templates")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}