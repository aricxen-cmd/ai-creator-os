"use client";

import { useState } from "react";

import ScriptOptions from "./ScriptOptions";
import ScriptEditor from "./ScriptEditor";
import GenerateButton from "./GenerateButton";

import { buildScriptPrompt } from "@/features/prompts/scriptPrompt";
import { updateProject } from "@/lib/supabase/updateProject";

interface ScriptFormProps {
  projectId: string;
  initialScript?: string;
  research?: string;
}

type FormState = {
  topic: string;
  platform: string;
  length: string;
  style: string;
  audience: string;
  provider: string;
  model: string;
};

export default function ScriptForm({
  projectId,
  initialScript = "",
  research = "",
}: ScriptFormProps) {
  const [form, setForm] = useState<FormState>({
    topic: "",
    platform: "YouTube Shorts",
    length: "30 Seconds",
    style: "Educational",
    audience: "General",
    provider: "Ollama",
    model: "qwen3:4b",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [script, setScript] = useState(initialScript);

  const [error, setError] = useState("");
  const [status, setStatus] = useState(
    initialScript ? "Saved script loaded." : ""
  );

  function updateField(
    field: string,
    value: string
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveScript(
    content: string
  ) {
    setSaving(true);
    setError("");

    try {
      await updateProject(projectId, {
        script: content,
      });

      setStatus("Saved.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save script."
      );

      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function generateScript() {
    if (!form.topic.trim()) {
      setError(
        "Please enter a video topic."
      );

      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const basePrompt =
        buildScriptPrompt({
          topic: form.topic,
          platform: form.platform,
          length: form.length,
          style: form.style,
          audience: form.audience,
        });

      const prompt = `
${basePrompt}

RESEARCH CONTEXT

Use the following saved project research when writing the script.

Use the research to improve factual grounding, hooks, comparisons, examples, and interesting details.

Do not blindly repeat the research.

If the research contains uncertain claims, avoid presenting them as confirmed facts.

${research || "No saved research is available for this project."}
`.trim();

      const response = await fetch(
        "/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            type: "script",
            prompt,
            provider: form.provider,
            model: form.model,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "AI request failed."
        );
      }

      if (!data.success) {
        throw new Error(
          data.error ||
            "Script generation failed."
        );
      }

      const generatedScript =
        data.response;

      if (
        typeof generatedScript !==
          "string" ||
        !generatedScript.trim()
      ) {
        throw new Error(
          "AI returned an empty script."
        );
      }

      setScript(generatedScript);

      await saveScript(
        generatedScript
      );

      setStatus(
        "Script generated and saved."
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
    if (!script.trim()) {
      setError(
        "There is no script to save."
      );

      return;
    }

    try {
      await saveScript(script);
    } catch {
      // saveScript already handles the error.
    }
  }

  async function handleCopy() {
    if (!script.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        script
      );

      setStatus(
        "Copied to clipboard."
      );
    } catch {
      setError(
        "Unable to copy the script."
      );
    }
  }

  function handleDownload() {
    if (!script.trim()) {
      return;
    }

    const blob = new Blob(
      [script],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download = "script.txt";

    document.body.appendChild(
      anchor
    );

    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setStatus(
      "Script downloaded."
    );
  }

  async function handleClear() {
    setScript("");
    setError("");
    setStatus("");

    try {
      await updateProject(projectId, {
        script: null,
      });

      setStatus(
        "Script cleared."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to clear script."
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold">
          Script Settings
        </h2>

        <p className="mt-2 text-sm text-zinc-400">
          Generate locally with Ollama
          using saved project research.
        </p>

        {research && (
          <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/30 p-4">
            <p className="text-sm font-medium text-emerald-400">
              ✓ Research context loaded
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              The generated script will
              use this project's saved
              research.
            </p>
          </div>
        )}

        {!research && (
          <div className="mt-4 rounded-lg border border-amber-900 bg-amber-950/30 p-4">
            <p className="text-sm font-medium text-amber-400">
              No research saved yet
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              You can still generate a
              script, but Research Studio
              can provide better context.
            </p>
          </div>
        )}

        <div className="mt-6 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Video Topic
            </label>

            <input
              type="text"
              value={form.topic}
              onChange={(event) =>
                updateField(
                  "topic",
                  event.target.value
                )
              }
              placeholder="Example: Ronaldo vs Kangaroo"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-3 outline-none transition focus:border-emerald-500"
            />
          </div>

          <ScriptOptions
            platform={form.platform}
            length={form.length}
            style={form.style}
            audience={form.audience}
            provider={form.provider}
            model={form.model}
            onChange={updateField}
          />

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current AI
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-200">
              {form.provider} ·{" "}
              {form.model}
            </p>
          </div>

          <GenerateButton
            loading={loading}
            onClick={generateScript}
          />

          {saving && (
            <p className="text-sm text-amber-400">
              Saving...
            </p>
          )}

          {status && !saving && (
            <p className="text-sm text-emerald-400">
              {status}
            </p>
          )}

          {error && (
            <div className="rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <ScriptEditor
          value={script}
          onChange={(value) => {
            setScript(value);

            setStatus(
              "Unsaved changes."
            );
          }}
        />

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={
              saving ||
              !script.trim()
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
            disabled={!script.trim()}
            className="rounded-lg border border-zinc-700 px-5 py-3 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            📋 Copy
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!script.trim()}
            className="rounded-lg border border-zinc-700 px-5 py-3 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ⬇ Download
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!script.trim()}
            className="rounded-lg border border-red-800 px-5 py-3 text-red-400 transition hover:border-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            🗑 Clear
          </button>
        </div>
      </div>
    </div>
  );
}