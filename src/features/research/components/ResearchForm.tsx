"use client";

import {
  useState,
} from "react";

import {
  generateResearch,
} from "../services/generateResearch";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

interface Props {
  provider?: string;
  model?: string;

  projectId?: string;

  initialResearch?: string;
}

const researchModes = [
  {
    value: "general",
    label: "General Research",
  },
  {
    value: "video",
    label: "Video Research",
  },
  {
    value: "facts",
    label: "Facts & Comparisons",
  },
  {
    value: "hooks",
    label: "Hooks & Angles",
  },
];

export default function ResearchForm({
  provider = "Ollama",
  model = "qwen3:4b",

  projectId,

  initialResearch = "",
}: Props) {
  const [
    topic,
    setTopic,
  ] = useState("");

  const [
    researchMode,
    setResearchMode,
  ] = useState("video");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    research,
    setResearch,
  ] = useState(
    initialResearch
  );

  const [
    error,
    setError,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState(
    initialResearch
      ? "Saved research loaded."
      : ""
  );

  async function handleGenerate() {
    if (!topic.trim()) {
      setError(
        "Please enter a topic."
      );

      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const researchPrompt =
        buildResearchTopic(
          topic,
          researchMode
        );

      const data =
        await generateResearch(
          researchPrompt,
          provider,
          model
        );

      if (!data.success) {
        throw new Error(
          data.error ||
            "Research failed."
        );
      }

      if (
        typeof data.response !==
          "string" ||
        !data.response.trim()
      ) {
        throw new Error(
          "AI returned empty research."
        );
      }

      const result =
        data.response.trim();

      setResearch(
        result
      );

      if (projectId) {
        await saveResearch(
          result
        );

        setStatus(
          "Research generated and saved to project."
        );
      } else {
        setStatus(
          "Research completed."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveResearch(
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
          research:
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
        "This research is not attached to a project."
      );

      return;
    }

    if (!research.trim()) {
      setError(
        "There is no research to save."
      );

      return;
    }

    setError("");
    setStatus("");

    try {
      await saveResearch(
        research
      );

      setStatus(
        "Research saved."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save research."
      );
    }
  }

  async function handleCopy() {
    if (!research.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        research
      );

      setStatus(
        "Research copied."
      );
    } catch {
      setError(
        "Unable to copy research."
      );
    }
  }

  function handleDownload() {
    if (!research.trim()) {
      return;
    }

    const blob =
      new Blob(
        [research],
        {
          type: "text/plain",
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
      "research.txt";

    document.body.appendChild(
      anchor
    );

    anchor.click();

    anchor.remove();

    URL.revokeObjectURL(
      url
    );

    setStatus(
      "Research downloaded."
    );
  }

  async function handleClear() {
    setResearch("");
    setError("");
    setStatus("");

    if (!projectId) {
      return;
    }

    try {
      await updateProject(
        projectId,
        {
          research: null,
        }
      );

      setStatus(
        "Research cleared."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to clear research."
      );
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Research Setup
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Topic Research
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Enter a topic and choose what kind of research you want AI Creator OS to generate.
            </p>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Research Topic
            </label>

            <textarea
              value={topic}
              onChange={(
                event
              ) =>
                setTopic(
                  event.target.value
                )
              }
              rows={5}
              placeholder="Example: Ronaldo vs Kangaroo — speed, jumping ability, reaction time, and likely outcome"
              className="input resize-y leading-6"
            />
          </div>

          <div className="mt-5">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Research Mode
            </label>

            <select
              value={
                researchMode
              }
              onChange={(
                event
              ) =>
                setResearchMode(
                  event.target.value
                )
              }
              className="input"
            >
              {researchModes.map(
                (mode) => (
                  <option
                    key={
                      mode.value
                    }
                    value={
                      mode.value
                    }
                  >
                    {mode.label}
                  </option>
                )
              )}
            </select>
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
              Local Qwen research through Ollama.
            </p>
          </div>

          {projectId && (
            <div className="mt-4 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4">
              <p className="text-xs uppercase tracking-wide text-emerald-500">
                Project Mode
              </p>

              <p className="mt-1 text-sm text-emerald-300">
                Research will be saved to this project.
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
              ? "🔬 Researching..."
              : "🔬 Generate Research"}
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
            What Research Studio Finds
          </h3>

          <div className="mt-4 space-y-3 text-sm text-zinc-400">
            <p>✓ Core explanation</p>
            <p>✓ Interesting facts</p>
            <p>✓ Comparisons</p>
            <p>✓ Video hooks</p>
            <p>✓ Story angles</p>
            <p>✓ Visual opportunities</p>
            <p>✓ Claims worth verifying</p>
          </div>
        </div>
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Results
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                Research Output
              </h2>
            </div>

            {research && (
              <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-400">
                Ready
              </span>
            )}
          </div>

          {!research &&
          !loading && (
            <div className="mt-6 flex min-h-[520px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
              <div>
                <div className="text-4xl">
                  🔬
                </div>

                <h3 className="mt-4 font-semibold">
                  Research results will appear here
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Enter a topic, choose a research mode, and generate research.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex min-h-[520px] items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="text-center">
                <div className="text-4xl">
                  🔬
                </div>

                <p className="mt-4 font-semibold text-emerald-400">
                  Researching topic...
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Qwen is analyzing the topic.
                </p>
              </div>
            </div>
          )}

          {research && (
            <>
              <textarea
                value={
                  research
                }
                onChange={(
                  event
                ) => {
                  setResearch(
                    event.target.value
                  );

                  if (projectId) {
                    setStatus(
                      "Unsaved changes."
                    );
                  }
                }}
                rows={28}
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
          border: 1px solid rgb(63 63 70);
          background: rgb(9 9 11);
          padding: 0.75rem 1rem;
          color: white;
          outline: none;
        }

        .input:focus {
          border-color: rgb(16 185 129);
        }

        .input::placeholder {
          color: rgb(113 113 122);
        }
      `}</style>
    </div>
  );
}

function buildResearchTopic(
  topic: string,
  mode: string
) {
  switch (mode) {
    case "facts":
      return `
Research this topic with emphasis on useful facts, numbers, comparisons, surprising details, and claims worth verifying:

${topic}
`.trim();

    case "hooks":
      return `
Research this topic specifically for strong video hooks, curiosity angles, surprising story directions, emotional angles, and visual opportunities:

${topic}
`.trim();

    case "video":
      return `
Research this topic for an AI video production workflow.

Find:
- core explanation
- useful facts
- surprising details
- comparisons
- statistics when relevant
- misconceptions
- video hooks
- story angles
- visual opportunities
- claims that should be verified

Topic:

${topic}
`.trim();

    default:
      return topic;
  }
}