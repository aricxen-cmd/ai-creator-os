import { supabase } from "./client";
import { Prompt } from "@/types/prompt";

export async function getPrompts(): Promise<Prompt[]> {
  const { data, error } = await supabase
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function createPrompt(
  title: string,
  category: string,
  prompt: string
) {
  const { data, error } = await supabase
    .from("prompts")
    .insert({
      title,
      category,
      prompt,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}