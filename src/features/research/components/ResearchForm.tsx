"use client";

import { useState } from "react";
import { generateResearch } from "../services/generateResearch";

interface Props {
  provider?: string;
  model?: string;
}

export default function ResearchForm({
  provider = "OpenAI",
  model = "gpt-5.5",
}: Props) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [research, setResearch] = useState("");
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setError("");
    setResearch("");

    try {
      const data = await generateResearch(
        topic,
        provider,
        model
      );

      if (!data.success) {
        throw new Error(data.error);
      }

      setResearch(data.response);
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
        <h2 className="text-2xl font-bold">
          🔬 AI Research Studio
        </h2>

        <p className="mt-2 text-zinc-400">
          Research any topic before writing your script.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Research Topic
        </label>

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Example: Ronaldo vs Kangaroo"
          className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none focus:border-emerald-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
      >
        {loading ? "Researching..." : "🔬 Generate Research"}
      </button>

      {error && (
        <div className="rounded-lg border border-red-600 bg-red-950 p-4 text-red-300">
          {error}
        </div>
      )}

      {research && (
        <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-6">
          <h3 className="mb-4 text-xl font-bold">
            Research Results
          </h3>

          <pre className="whitespace-pre-wrap text-zinc-300">
            {research}
          </pre>
        </div>
      )}
    </div>
  );
}