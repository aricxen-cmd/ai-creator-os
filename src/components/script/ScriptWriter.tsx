"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ScriptWriter() {
  const [topic, setTopic] = useState("");
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateScript() {
    if (!topic.trim()) return;

    setLoading(true);

    // Placeholder until AI is connected
    setTimeout(() => {
      setScript(`# YouTube Script

## Hook
Did you know ${topic} could completely change the future?

## Intro
Today we're exploring ${topic}.

## Main Points

### Part 1

Explain the background.

### Part 2

Discuss the latest developments.

### Part 3

Why it matters.

## Call To Action

Subscribe for more AI content.
`);

      setLoading(false);
    }, 500);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-4xl font-bold">Script Writer</h1>

      <input
        className="mt-6 w-full rounded-lg border p-3"
        placeholder="Video topic..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      <Button
        className="mt-4"
        onClick={generateScript}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Script"}
      </Button>

      <div className="mt-8 rounded-lg border p-6">
        <pre className="whitespace-pre-wrap">
          {script}
        </pre>
      </div>
    </div>
  );
}