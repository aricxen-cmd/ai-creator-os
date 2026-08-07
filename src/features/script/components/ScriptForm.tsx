"use client";

import { useState } from "react";
import ScriptOptions from "./ScriptOptions";
import ScriptEditor from "./ScriptEditor";
import GenerateButton from "./GenerateButton";
import ActionBar from "./ActionBar";

export default function ScriptForm() {
  type FormState = {
    topic: string;
    platform: string;
    length: string;
    style: string;
    audience: string;
    provider: string;
    model: string;
  };

  const [form, setForm] = useState<FormState>({
    topic: "",
    platform: "",
    length: "",
    style: "",
    audience: "",
    provider: "",
    model: "",
  });

  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState("");
  const [error, setError] = useState("");

function updateField(field: string, value: string) {
  setForm((prev) => ({
    ...prev,
    [field]: value,
  }));
}

async function generateScript() {
  if (!form.topic.trim()) {
    setError("Please enter a video topic.");
    return;
  }

  setLoading(true);
  setError("");
  setScript("");

  try {
    const prompt = `Create a ${form.length} script.

Platform:
${form.platform}

Style:
${form.style}

Audience:
${form.audience}

Topic:
${form.topic}`;

    const response = await fetch("/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        provider: form.provider,
        model: form.model,
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
            value={form.topic}
            onChange={(e) => updateField("topic", e.target.value)}
            placeholder="Example: Ronaldo vs Kangaroo"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
          />
        </div>

        <GenerateButton
  loading={loading}
  onClick={generateScript}
/>

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