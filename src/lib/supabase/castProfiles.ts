import { supabase } from "./client";

export interface CastProfileRow {
  id: string;
  name: string;
  description: string;
  created_at?: string;
  updated_at?: string;
}

export async function getCastProfiles() {
  const { data, error } = await supabase
    .from("cast_profiles")
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createCastProfile(
  name: string,
  description: string
) {
  const { data, error } = await supabase
    .from("cast_profiles")
    .insert({
      name,
      description,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function updateCastProfile(
  id: string,
  updates: {
    name?: string;
    description?: string;
  }
) {
  const { data, error } = await supabase
    .from("cast_profiles")
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

export async function deleteCastProfile(
  id: string
) {
  const { error } = await supabase
    .from("cast_profiles")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
}