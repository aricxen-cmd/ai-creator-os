"use client";

import { useState } from "react";
import { generateStoryboard } from "../services/generateStoryboard";

interface Props {
  provider?: string;
  model?: string;
}

export default function StoryboardForm({
  provider = "OpenAI",
  model = "gpt-5.5",
}: Props) {
  const [script, setScript] = useState("");
  const [storyboard, setStoryboard] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!script.trim()) {
      setError("Please paste a script.");
      return;
    }

    setLoading(true);
    setError("");
    setStoryboard("");

    try {
      const data = await generateStoryboard(
        script,
        provider,
        model
      );

      if (!data.success) {
        throw new Error(data.error);
      }

      setStoryboard(data.response);
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

  return (
    <div className="space-y-6 rounded-xl border border-zinc-800 bg-zinc-900 p-6">

      <div>
        <h2 className="text-3xl font-bold">
          🎬 Storyboard Studio
        </h2>

        <p className="mt-2 text-zinc-400">
          Turn your script into production-ready scenes.
        </p>
      </div>

      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        rows={12}
        placeholder="Paste your generated script here..."
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 p-4 outline-none focus:border-emerald-500"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold hover:bg-emerald-500 disabled:opacity-50"
      >
        {loading
          ? "Generating..."
          : "🎬 Generate Storyboard"}
      </button>

      {error && (
        <div className="rounded-lg border border-red-700 bg-red-950 p-4 text-red-300">
          {error}
        </div>
      )}

      {storyboard && (
        <div className="rounded-xl border border-zinc-700 bg-zinc-950 p-6">
          <h3 className="mb-4 text-xl font-bold">
            Generated Storyboard
          </h3>

          <pre className="whitespace-pre-wrap text-zinc-300">
            {storyboard}
          </pre>
        </div>
      )}
    </div>
  );
}