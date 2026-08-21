import { supabase } from "./client";

export interface PromptLibraryRow {
  id: string;

  title: string;

  category: string;

  description: string | null;

  prompt: string;

  tags: string[];

  favorite: boolean;

  use_count: number;

  created_at?: string;

  updated_at?: string;
}

export interface CreatePromptLibraryInput {
  title: string;

  category: string;

  description?: string;

  prompt: string;

  tags?: string[];
}

export async function getPromptLibrary() {
  const { data, error } =
    await supabase
      .from("prompt_library")
      .select("*")
      .order("favorite", {
        ascending: false,
      })
      .order("created_at", {
        ascending: false,
      });

  if (error) {
    throw error;
  }

  return (
    (data as PromptLibraryRow[]) ??
    []
  );
}

export async function getPromptLibraryItem(
  id: string
) {
  const { data, error } =
    await supabase
      .from("prompt_library")
      .select("*")
      .eq("id", id)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data as PromptLibraryRow | null;
}

export async function findPromptLibraryDuplicate(
  title: string,
  category: string
) {
  const { data, error } =
    await supabase
      .from("prompt_library")
      .select("*")
      .ilike(
        "title",
        title.trim()
      )
      .eq(
        "category",
        category.trim()
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data as PromptLibraryRow | null;
}

export async function createPromptLibraryItem(
  input: CreatePromptLibraryInput
) {
  const duplicate =
    await findPromptLibraryDuplicate(
      input.title,
      input.category
    );

  if (duplicate) {
    return {
      created: false,
      duplicate,
      item: duplicate,
    };
  }

  const { data, error } =
    await supabase
      .from("prompt_library")
      .insert({
        title:
          input.title.trim(),

        category:
          input.category.trim() ||
          "General",

        description:
          input.description?.trim() ||
          null,

        prompt:
          input.prompt.trim(),

        tags:
          input.tags ?? [],
      })
      .select()
      .single();

  if (error) {
    throw error;
  }

  return {
    created: true,
    duplicate: null,
    item:
      data as PromptLibraryRow,
  };
}

export async function updatePromptLibraryItem(
  id: string,
  updates: Partial<{
    title: string;
    category: string;
    description: string | null;
    prompt: string;
    tags: string[];
    favorite: boolean;
  }>
) {
  const { data, error } =
    await supabase
      .from("prompt_library")
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

  return data as PromptLibraryRow;
}

export async function deletePromptLibraryItem(
  id: string
) {
  const { error } =
    await supabase
      .from("prompt_library")
      .delete()
      .eq("id", id);

  if (error) {
    throw error;
  }
}

export async function togglePromptFavorite(
  id: string,
  favorite: boolean
) {
  return updatePromptLibraryItem(
    id,
    {
      favorite,
    }
  );
}

export async function incrementPromptUse(
  id: string,
  currentCount: number
) {
  const { error } =
    await supabase
      .from("prompt_library")
      .update({
        use_count:
          currentCount + 1,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", id);

  if (error) {
    throw error;
  }
}