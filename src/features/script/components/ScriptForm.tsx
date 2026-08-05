"use client";

import { useState } from "react";

export default function ScriptForm() {
  const [topic, setTopic] = useState("");
const [loading, setLoading] = useState(false);
const [script, setScript] = useState("");
const [error, setError] = useState("");

async function generateScript() {
  if (!topic.trim()) {
    setError("Please enter a video topic.");
    return;
  }

  setLoading(true);
  setError("");
  setScript("");

  try {
    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Write a viral 30-second YouTube Shorts script about: ${topic}`,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    setScript(data.response);
  } catch (err) {
    setError(
      err instanceof Error ? err.message : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="mb-6 text-2xl font-bold">
        Create a New Script
      </h2>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Video Topic
          </label>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Example: Ronaldo vs Kangaroo"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <button
  onClick={generateScript}
  disabled={loading}
  className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold transition hover:bg-emerald-500 disabled:opacity-50"
>
  {loading ? "Generating..." : "✨ Generate Script"}
</button>

{error && (
  <div className="rounded-lg border border-red-600 bg-red-950 p-4 text-red-300">
    {error}
  </div>
)}

{script && (
  <div className="rounded-lg border border-zinc-700 bg-zinc-950 p-6">
    <h3 className="mb-4 text-xl font-bold">
      Generated Script
    </h3>

    <pre className="whitespace-pre-wrap text-zinc-300">
      {script}
    </pre>
  </div>
)}
      </div>
    </div>
  );
}