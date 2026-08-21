"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  createCastProfile,
  deleteCastProfile,
  getCastProfiles,
  updateCastProfile,
  type CastProfileRow,
} from "@/lib/supabase/castProfiles";

export default function CastLibraryManager() {
  const [
    profiles,
    setProfiles,
  ] = useState<CastProfileRow[]>([]);

  const [
    name,
    setName,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    editingId,
    setEditingId,
  ] =
    useState<string | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    setLoading(true);
    setError("");

    try {
      const data =
        await getCastProfiles();

      setProfiles(data);
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to load Cast Library."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      setError(
        "Character name is required."
      );

      return;
    }

    if (!description.trim()) {
      setError(
        "Cast Lock description is required."
      );

      return;
    }

    setSaving(true);
    setError("");
    setStatus("");

    try {
      if (editingId) {
        await updateCastProfile(
          editingId,
          {
            name:
              name.trim(),

            description:
              description.trim(),
          }
        );

        setStatus(
          "Cast profile updated."
        );
      } else {
        await createCastProfile(
          name.trim(),
          description.trim()
        );

        setStatus(
          "Cast profile created."
        );
      }

      handleClearForm();

      await loadProfiles();
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save Cast Profile."
        )
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(
    profile: CastProfileRow
  ) {
    setEditingId(
      profile.id
    );

    setName(
      profile.name
    );

    setDescription(
      profile.description
    );

    setError("");
    setStatus("");
  }

  async function handleDelete(
    id: string
  ) {
    setError("");
    setStatus("");

    try {
      await deleteCastProfile(
        id
      );

      setProfiles(
        (previous) =>
          previous.filter(
            (profile) =>
              profile.id !== id
          )
      );

      if (
        editingId === id
      ) {
        handleClearForm();
      }

      setStatus(
        "Cast profile deleted."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to delete Cast Profile."
        )
      );
    }
  }

  function handleClearForm() {
    setEditingId(null);
    setName("");
    setDescription("");
  }

  return (
    <div className="space-y-6">
      {status && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-xl font-bold">
            {editingId
              ? "✏️ Edit Cast Profile"
              : "➕ Add Cast Profile"}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Create a reusable
            character identity
            lock for consistent
            image and video
            generation.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-zinc-400">
              Character Name
            </label>

            <input
              value={name}
              onChange={(
                event
              ) =>
                setName(
                  event.target.value
                )
              }
              placeholder="Tariq"
              className="input"
            />
          </div>

          <div className="mt-4">
            <label className="mb-2 block text-sm text-zinc-400">
              Cast Lock
            </label>

            <textarea
              value={
                description
              }
              onChange={(
                event
              ) =>
                setDescription(
                  event.target.value
                )
              }
              rows={14}
              placeholder="Face, hair, body proportions, clothing, colors, footwear, accessories, distinguishing features..."
              className="input resize-y leading-6"
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={
                handleSave
              }
              disabled={saving}
              className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "💾 Save Changes"
                  : "💾 Add Cast Profile"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={
                  handleClearForm
                }
                className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">
                🎭 Saved Cast
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                Shared across
                Prompt Builder
                and Scene Studio.
              </p>
            </div>

            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              {profiles.length}
            </span>
          </div>

          {loading ? (
            <p className="mt-6 text-sm text-zinc-500">
              Loading Cast
              Library...
            </p>
          ) : profiles.length ===
            0 ? (
            <div className="mt-6 rounded-lg border border-dashed border-zinc-700 p-8 text-center">
              <p className="text-sm text-zinc-500">
                No Cast Profiles
                yet.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {profiles.map(
                (profile) => (
                  <div
                    key={
                      profile.id
                    }
                    className={`rounded-xl border bg-zinc-950 p-5 ${
                      editingId ===
                      profile.id
                        ? "border-emerald-500"
                        : "border-zinc-800"
                    }`}
                  >
                    <h3 className="font-semibold">
                      {
                        profile.name
                      }
                    </h3>

                    <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-xs leading-5 text-zinc-500">
                      {
                        profile.description
                      }
                    </p>

                    <div className="mt-5 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(
                            profile
                          )
                        }
                        className="text-sm text-emerald-400"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            profile.id
                          )
                        }
                        className="text-sm text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background: rgb(9 9 11);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(
            16 185 129
          );
        }
      `}</style>
    </div>
  );
}

function getErrorMessage(
  error: unknown,
  fallback: string
) {
  if (
    error instanceof Error
  ) {
    return error.message;
  }

  if (
    typeof error ===
      "object" &&
    error !== null
  ) {
    const value =
      error as Record<
        string,
        unknown
      >;

    if (
      typeof value.message ===
      "string"
    ) {
      return value.message;
    }
  }

  return fallback;
}