"use client";

import {
  useState,
} from "react";

import {
  generateStoryboard,
} from "../services/generateStoryboard";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

interface Props {
  provider?: string;

  model?: string;

  projectId?: string;

  initialScript?: string;

  initialStoryboard?: string;
}

export default function StoryboardForm({
  provider = "Ollama",

  model = "qwen3:4b",

  projectId,

  initialScript = "",

  initialStoryboard = "",
}: Props) {
  const [
    script,
    setScript,
  ] = useState(
    initialScript
  );

  const [
    storyboard,
    setStoryboard,
  ] = useState(
    initialStoryboard
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

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
  ] = useState(
    initialStoryboard
      ? "Saved storyboard loaded."
      : ""
  );

  async function handleGenerate() {
    if (!script.trim()) {
      setError(
        "A script is required before generating a storyboard."
      );

      return;
    }

    setLoading(true);

    setError("");

    setStatus("");

    try {
      const data =
        await generateStoryboard(
          script,
          provider,
          model
        );

      if (!data.success) {
        throw new Error(
          data.error ||
            "Storyboard generation failed."
        );
      }

      if (
        typeof data.response !==
          "string" ||
        !data.response.trim()
      ) {
        throw new Error(
          "AI returned an empty storyboard."
        );
      }

      const result =
        data.response.trim();

      setStoryboard(
        result
      );

      if (projectId) {
        await saveStoryboard(
          result
        );

        setStatus(
          "Storyboard generated and saved to project."
        );
      } else {
        setStatus(
          "Storyboard generated."
        );
      }
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Something went wrong."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveStoryboard(
    content: string
  ) {
    if (!projectId) {
      return;
    }

    setSaving(true);

    try {
      await updateProject(
        projectId,
        {
          storyboard:
            content,
        }
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleSave() {
    if (!projectId) {
      setError(
        "This storyboard is not attached to a project."
      );

      return;
    }

    if (!storyboard.trim()) {
      setError(
        "There is no storyboard to save."
      );

      return;
    }

    setError("");

    setStatus("");

    try {
      await saveStoryboard(
        storyboard
      );

      setStatus(
        "Storyboard saved."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to save storyboard."
        )
      );
    }
  }

  async function handleCopy() {
    if (!storyboard.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        storyboard
      );

      setStatus(
        "Storyboard copied."
      );
    } catch {
      setError(
        "Unable to copy storyboard."
      );
    }
  }

  function handleDownload() {
    if (!storyboard.trim()) {
      return;
    }

    const blob =
      new Blob(
        [storyboard],
        {
          type:
            "text/plain",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href =
      url;

    anchor.download =
      "storyboard.txt";

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(
      url
    );

    setStatus(
      "Storyboard downloaded."
    );
  }

  async function handleClear() {
    setStoryboard("");

    setError("");

    setStatus("");

    if (!projectId) {
      return;
    }

    try {
      await updateProject(
        projectId,
        {
          storyboard:
            null,
        }
      );

      setStatus(
        "Storyboard cleared."
      );
    } catch (err) {
      setError(
        getErrorMessage(
          err,
          "Failed to clear storyboard."
        )
      );
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
      {/* LEFT */}

      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Story Setup
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Script Input
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Use the project's
              script or paste a
              different script to
              convert it into
              visual production
              scenes.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Script
            </label>

            <textarea
              value={
                script
              }
              onChange={(
                event
              ) =>
                setScript(
                  event.target
                    .value
                )
              }
              rows={18}
              placeholder="Paste or write the script here..."
              className="input resize-y leading-7"
            />
          </div>

          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current AI
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-200">
              {provider} ·{" "}
              {model}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Local storyboard
              generation with
              Qwen through
              Ollama.
            </p>
          </div>

          {projectId && (
            <div className="mt-4 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-500">
                Project Mode
              </p>

              <p className="mt-1 text-sm text-emerald-300">
                Generated
                storyboard will
                be saved to this
                project.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={
              handleGenerate
            }
            disabled={
              loading
            }
            className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "🎬 Generating..."
              : "🎬 Generate Storyboard"}
          </button>

          {saving && (
            <p className="mt-3 text-sm text-amber-400">
              Saving...
            </p>
          )}

          {status && (
            <div className="mt-4 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
              {status}
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-semibold">
            Storyboard Output
          </h3>

          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <p>
              ✓ Scene breakdown
            </p>

            <p>
              ✓ Narration
            </p>

            <p>
              ✓ Visual action
            </p>

            <p>
              ✓ Camera framing
            </p>

            <p>
              ✓ Motion
            </p>

            <p>
              ✓ Transitions
            </p>

            <p>
              ✓ AI generation context
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Production
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Storyboard Output
              </h2>
            </div>

            {storyboard && (
              <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-400">
                Ready
              </span>
            )}
          </div>

          {!storyboard &&
            !loading && (
              <div className="mt-6 flex min-h-[560px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
                <div>
                  <div className="text-4xl">
                    🎬
                  </div>

                  <h3 className="mt-4 font-semibold">
                    Your storyboard will appear here
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                    Add a script and
                    generate the
                    production
                    storyboard.
                  </p>
                </div>
              </div>
            )}

          {loading && (
            <div className="mt-6 flex min-h-[560px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="text-center">
                <div className="text-4xl">
                  🎬
                </div>

                <p className="mt-4 font-semibold text-emerald-400">
                  Building storyboard...
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Qwen is converting
                  the script into
                  production scenes.
                </p>
              </div>
            </div>
          )}

          {storyboard && (
            <>
              <textarea
                value={
                  storyboard
                }
                onChange={(
                  event
                ) => {
                  setStoryboard(
                    event.target
                      .value
                  );

                  if (
                    projectId
                  ) {
                    setStatus(
                      "Unsaved changes."
                    );
                  }
                }}
                rows={30}
                className="input mt-6 resize-y leading-7"
              />

              <div className="mt-5 flex flex-wrap gap-3">
                {projectId && (
                  <button
                    type="button"
                    onClick={
                      handleSave
                    }
                    disabled={
                      saving
                    }
                    className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    💾 Save
                  </button>
                )}

                <button
                  type="button"
                  onClick={
                    handleCopy
                  }
                  className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
                >
                  📋 Copy
                </button>

                <button
                  type="button"
                  onClick={
                    handleDownload
                  }
                  className="rounded-lg border border-zinc-700 px-5 py-3 text-zinc-300 transition hover:border-zinc-500"
                >
                  ⬇ Download
                </button>

                <button
                  type="button"
                  onClick={
                    handleClear
                  }
                  className="rounded-lg border border-red-800 px-5 py-3 text-red-400 transition hover:border-red-600"
                >
                  🗑 Clear
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid
            rgb(63 63 70);
          background:
            rgb(9 9 11);
          padding:
            0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color:
            rgb(16 185 129);
        }

        .input::placeholder {
          color:
            rgb(113 113 122);
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