"use client";

import { useState } from "react";
import { generateResearch } from "../services/generateResearch";
import { updateProject } from "@/lib/supabase/updateProject";

interface Props {
  projectId: string;
  initialResearch?: string;
}

export default function ResearchForm({
  projectId,
  initialResearch = "",
}: Props) {
  const [topic, setTopic] = useState("");

  const [provider] = useState("Ollama");
  const [model] = useState("qwen3:4b");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [research, setResearch] =
    useState(initialResearch);

  const [error, setError] = useState("");

  const [status, setStatus] = useState(
    initialResearch
      ? "Saved research loaded."
      : ""
  );

  async function saveResearch(
    content: string
  ) {
    setSaving(true);
    setError("");

    try {
      await updateProject(projectId, {
        research: content,
      });

      setStatus("Saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save research."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!topic.trim()) {
      setError(
        "Please enter a research topic."
      );

      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const data = await generateResearch(
        topic,
        provider,
        model
      );

      if (!data.success) {
        throw new Error(
          data.error ||
            "Research generation failed."
        );
      }

      const generatedResearch =
        data.response;

      if (
        typeof generatedResearch !==
          "string" ||
        !generatedResearch.trim()
      ) {
        throw new Error(
          "AI returned empty research."
        );
      }

      setResearch(
        generatedResearch
      );

      await saveResearch(
        generatedResearch
      );

      setStatus(
        "Research generated and saved."
      );
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

  async function handleSave() {
    if (!research.trim()) {
      setError(
        "There is no research to save."
      );

      return;
    }

    try {
      await saveResearch(research);
    } catch {
      // saveResearch already handles the error.
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
        "Copied to clipboard."
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

    const blob = new Blob(
      [research],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download =
      "research.txt";

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setStatus(
      "Research downloaded."
    );
  }

  async function handleClear() {
    setResearch("");
    setError("");
    setStatus("");

    try {
      await updateProject(projectId, {
        research: null,
      });

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
    <div className="space-y-6">
      {/* Research generator */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <h2 className="text-2xl font-bold">
            🔬 AI Research Studio
          </h2>

          <p className="mt-2 text-zinc-400">
            Research your topic before
            writing the script.
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-zinc-300">
            Research Topic
          </label>

          <input
            value={topic}
            onChange={(event) =>
              setTopic(
                event.target.value
              )
            }
            placeholder="Example: Ronaldo vs Kangaroo"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Current AI
          </p>

          <p className="mt-1 text-sm font-medium text-zinc-200">
            {provider} · {model}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Researching..."
            : "🔬 Generate Research"}
        </button>

        {saving && (
          <p className="mt-4 text-sm text-amber-400">
            Saving...
          </p>
        )}

        {status && !saving && (
          <p className="mt-4 text-sm text-emerald-400">
            {status}
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Research editor */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold">
              Research Results
            </h3>

            <p className="mt-1 text-sm text-zinc-400">
              Edit the research before
              using it in the next stage.
            </p>
          </div>

          {research.trim() && (
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              {
                research.trim().split(
                  /\s+/
                ).length
              }{" "}
              words
            </span>
          )}
        </div>

        <textarea
          value={research}
          onChange={(event) => {
            setResearch(
              event.target.value
            );

            setStatus(
              "Unsaved changes."
            );
          }}
          placeholder="Your research will appear here..."
          className="mt-6 min-h-[420px] w-full resize-y rounded-lg border border-zinc-700 bg-zinc-950 p-4 leading-7 text-zinc-300 outline-none transition focus:border-emerald-500"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              !research.trim()
            }
            className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "💾 Save"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={
              !research.trim()
            }
            className="rounded-lg border border-zinc-700 px-5 py-3 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            📋 Copy
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={
              !research.trim()
            }
            className="rounded-lg border border-zinc-700 px-5 py-3 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⬇ Download
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={
              !research.trim()
            }
            className="rounded-lg border border-red-800 px-5 py-3 text-red-400 transition hover:border-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🗑 Clear
          </button>
        </div>
      </div>
    </div>
  );
}