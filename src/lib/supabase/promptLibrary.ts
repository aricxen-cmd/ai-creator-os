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

export interface UpdatePromptLibraryInput {
  title?: string;
  category?: string;
  description?: string | null;
  prompt?: string;
  tags?: string[];
  favorite?: boolean;
}

/*
 * Normalize a row returned from Supabase.
 *
 * This protects the UI from nullable/default database values.
 */
function normalizePromptLibraryRow(
  row: Record<string, unknown>
): PromptLibraryRow {
  return {
    id: String(row.id ?? ""),

    title:
      typeof row.title === "string"
        ? row.title
        : "",

    category:
      typeof row.category === "string" &&
      row.category.trim()
        ? row.category
        : "General",

    description:
      typeof row.description === "string"
        ? row.description
        : null,

    prompt:
      typeof row.prompt === "string"
        ? row.prompt
        : "",

    tags:
      Array.isArray(row.tags)
        ? row.tags.filter(
            (tag): tag is string =>
              typeof tag === "string"
          )
        : [],

    favorite:
      typeof row.favorite === "boolean"
        ? row.favorite
        : false,

    use_count:
      typeof row.use_count === "number"
        ? row.use_count
        : 0,

    created_at:
      typeof row.created_at === "string"
        ? row.created_at
        : undefined,

    updated_at:
      typeof row.updated_at === "string"
        ? row.updated_at
        : undefined,
  };
}

/*
 * Get all Prompt Vault items.
 */
export async function getPromptLibrary(): Promise<
  PromptLibraryRow[]
> {
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
    console.error(
      "getPromptLibrary failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to load Prompt Library."
    );
  }

  if (!data) {
    return [];
  }

  return data.map((row) =>
    normalizePromptLibraryRow(
      row as Record<string, unknown>
    )
  );
}

/*
 * Get one Prompt Vault item.
 */
export async function getPromptLibraryItem(
  id: string
): Promise<PromptLibraryRow | null> {
  const cleanId = id.trim();

  if (!cleanId) {
    throw new Error(
      "Prompt ID is required."
    );
  }

  const { data, error } =
    await supabase
      .from("prompt_library")
      .select("*")
      .eq("id", cleanId)
      .maybeSingle();

  if (error) {
    console.error(
      "getPromptLibraryItem failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to load prompt."
    );
  }

  if (!data) {
    return null;
  }

  return normalizePromptLibraryRow(
    data as Record<string, unknown>
  );
}

/*
 * Look for an existing prompt with the
 * same title and category.
 */
export async function findPromptLibraryDuplicate(
  title: string,
  category: string
): Promise<PromptLibraryRow | null> {
  const cleanTitle =
    title.trim();

  const cleanCategory =
    category.trim() || "General";

  if (!cleanTitle) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("prompt_library")
      .select("*")
      .ilike(
        "title",
        cleanTitle
      )
      .eq(
        "category",
        cleanCategory
      )
      .maybeSingle();

  if (error) {
    console.error(
      "findPromptLibraryDuplicate failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to check for duplicate prompts."
    );
  }

  if (!data) {
    return null;
  }

  return normalizePromptLibraryRow(
    data as Record<string, unknown>
  );
}

/*
 * Create a Prompt Vault item.
 */
export async function createPromptLibraryItem(
  input: CreatePromptLibraryInput
) {
  const title =
    input.title.trim();

  const category =
    input.category.trim() ||
    "General";

  const description =
    input.description?.trim() ||
    null;

  const prompt =
    input.prompt.trim();

  const tags =
    normalizeTags(
      input.tags ?? []
    );

  if (!title) {
    throw new Error(
      "Prompt title is required."
    );
  }

  if (!prompt) {
    throw new Error(
      "Prompt content is required."
    );
  }

  const duplicate =
    await findPromptLibraryDuplicate(
      title,
      category
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
        title,
        category,
        description,
        prompt,
        tags,
      })
      .select()
      .single();

  if (error) {
    console.error(
      "createPromptLibraryItem failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to create prompt."
    );
  }

  return {
    created: true,
    duplicate: null,
    item:
      normalizePromptLibraryRow(
        data as Record<
          string,
          unknown
        >
      ),
  };
}

/*
 * Update a Prompt Vault item.
 */
export async function updatePromptLibraryItem(
  id: string,
  updates: UpdatePromptLibraryInput
): Promise<PromptLibraryRow> {
  const cleanId =
    id.trim();

  if (!cleanId) {
    throw new Error(
      "Prompt ID is required."
    );
  }

  const payload: Record<
    string,
    unknown
  > = {
    updated_at:
      new Date().toISOString(),
  };

  if (
    updates.title !== undefined
  ) {
    const title =
      updates.title.trim();

    if (!title) {
      throw new Error(
        "Prompt title is required."
      );
    }

    payload.title = title;
  }

  if (
    updates.category !== undefined
  ) {
    payload.category =
      updates.category.trim() ||
      "General";
  }

  if (
    updates.description !==
    undefined
  ) {
    payload.description =
      updates.description?.trim() ||
      null;
  }

  if (
    updates.prompt !== undefined
  ) {
    const prompt =
      updates.prompt.trim();

    if (!prompt) {
      throw new Error(
        "Prompt content is required."
      );
    }

    payload.prompt = prompt;
  }

  if (
    updates.tags !== undefined
  ) {
    payload.tags =
      normalizeTags(
        updates.tags
      );
  }

  if (
    updates.favorite !== undefined
  ) {
    payload.favorite =
      updates.favorite;
  }

  const { data, error } =
    await supabase
      .from("prompt_library")
      .update(payload)
      .eq("id", cleanId)
      .select()
      .single();

  if (error) {
    console.error(
      "updatePromptLibraryItem failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to update prompt."
    );
  }

  return normalizePromptLibraryRow(
    data as Record<string, unknown>
  );
}

/*
 * Delete a Prompt Vault item.
 */
export async function deletePromptLibraryItem(
  id: string
): Promise<void> {
  const cleanId =
    id.trim();

  if (!cleanId) {
    throw new Error(
      "Prompt ID is required."
    );
  }

  const { error } =
    await supabase
      .from("prompt_library")
      .delete()
      .eq("id", cleanId);

  if (error) {
    console.error(
      "deletePromptLibraryItem failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to delete prompt."
    );
  }
}

/*
 * Favorite / unfavorite.
 */
export async function togglePromptFavorite(
  id: string,
  favorite: boolean
): Promise<PromptLibraryRow> {
  return updatePromptLibraryItem(
    id,
    {
      favorite,
    }
  );
}

/*
 * Increase use count.
 */
export async function incrementPromptUse(
  id: string,
  currentCount: number
): Promise<void> {
  const cleanId =
    id.trim();

  if (!cleanId) {
    throw new Error(
      "Prompt ID is required."
    );
  }

  const safeCount =
    Number.isFinite(currentCount)
      ? Math.max(
          0,
          Math.floor(currentCount)
        )
      : 0;

  const { error } =
    await supabase
      .from("prompt_library")
      .update({
        use_count:
          safeCount + 1,

        updated_at:
          new Date().toISOString(),
      })
      .eq("id", cleanId);

  if (error) {
    console.error(
      "incrementPromptUse failed:",
      error
    );

    throw new Error(
      error.message ||
        "Failed to update prompt use count."
    );
  }
}

/*
 * Clean tags before saving them.
 */
function normalizeTags(
  tags: string[]
): string[] {
  return Array.from(
    new Set(
      tags
        .map((tag) =>
          tag
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    )
  );
}