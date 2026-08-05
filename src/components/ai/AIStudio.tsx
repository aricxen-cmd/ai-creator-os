"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AIStudio() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt) return;

    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.success) {
  setResponse(data.response);
} else {
  console.error(data);
  setResponse(JSON.stringify(data, null, 2));
}
    } catch (error) {
  console.error(error);
  setResponse("Network or server error.");
}

    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl">

      <h1 className="text-4xl font-bold">
        AI Studio
      </h1>

      <p className="mt-2 text-zinc-500">
        Test prompts before using them in your projects.
      </p>

      <textarea
        className="mt-8 h-64 w-full rounded-lg border p-4"
        placeholder="Enter a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <Button
        className="mt-4"
        onClick={generate}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </Button>

      <div className="mt-8 rounded-lg border p-6">
        <h2 className="mb-4 text-2xl font-bold">
          Response
        </h2>

        <pre className="whitespace-pre-wrap">
          {response}
        </pre>
      </div>

    </div>
  );
}