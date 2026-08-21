"use client";

import { useState } from "react";

export default function AIStudio() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function generate() {
    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("");

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "general",
          provider: "Ollama",
          model: "qwen3:4b",
          prompt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "AI request failed."
        );
      }

      if (!data.success) {
        throw new Error(
          data.error || "AI generation failed."
        );
      }

      if (
        typeof data.response !== "string" ||
        !data.response.trim()
      ) {
        throw new Error(
          "AI returned an empty response."
        );
      }

      setResponse(data.response.trim());
      setStatus("Response generated.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network or server error."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!response.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(response);
      setStatus("Response copied.");
    } catch {
      setError("Unable to copy response.");
    }
  }

  function handleClear() {
    setPrompt("");
    setResponse("");
    setError("");
    setStatus("");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
      <div className="space-y-6">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Prompt Input
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Test a Prompt
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Enter any prompt and test it with the current local AI provider.
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Prompt
            </label>

            <textarea
              value={prompt}
              onChange={(event) =>
                setPrompt(event.target.value)
              }
              rows={14}
              placeholder="Enter a prompt to test..."
              className="input resize-y leading-7"
            />
          </div>

          <div className="mt-5 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Current AI
            </p>

            <p className="mt-1 text-sm font-medium text-zinc-200">
              Ollama · qwen3:4b
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              Local AI generation on this computer.
            </p>
          </div>

          <button
            type="button"
            onClick={generate}
            disabled={loading}
            className="mt-6 w-full rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "✨ Generating..."
              : "✨ Generate"}
          </button>

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
      </div>

      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                Output
              </p>

              <h2 className="mt-2 text-2xl font-bold">
                AI Response
              </h2>
            </div>

            {response && (
              <span className="rounded-full border border-emerald-900 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-400">
                Ready
              </span>
            )}
          </div>

          {!response && !loading && (
            <div className="mt-6 flex min-h-130 items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
              <div>
                <div className="text-4xl">
                  🤖
                </div>

                <h3 className="mt-4 font-semibold">
                  AI response will appear here
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                  Enter a prompt on the left and generate a test response.
                </p>
              </div>
            </div>
          )}

          {loading && (
            <div className="mt-6 flex min-h-130 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">
              <div className="text-center">
                <div className="text-4xl">
                  🤖
                </div>

                <p className="mt-4 font-semibold text-emerald-400">
                  Generating response...
                </p>

                <p className="mt-2 text-sm text-zinc-500">
                  Qwen is processing your prompt.
                </p>
              </div>
            </div>
          )}

          {response && (
            <>
              <div className="mt-6 min-h-130 rounded-xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-300">
                  {response}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500"
                >
                  📋 Copy
                </button>

                <button
                  type="button"
                  onClick={handleClear}
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