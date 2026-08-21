"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Scene } from "../types";

import {
  deleteSavedPrompt,
  getScenePrompts,
  type SavedPromptRow,
} from "@/lib/supabase/savedPrompts";

interface SceneCardProps {
  projectId: string;
  scene: Scene;
}

export default function SceneCard({
  projectId,
  scene,
}: SceneCardProps) {
  const [savedPrompts, setSavedPrompts] =
    useState<SavedPromptRow[]>([]);

  const [loadingPrompts, setLoadingPrompts] =
    useState(true);

  const [error, setError] =
    useState("");

  const [status, setStatus] =
    useState("");

  useEffect(() => {
    loadScenePrompts();
  }, [projectId, scene.id]);

  async function loadScenePrompts() {
    setLoadingPrompts(true);
    setError("");

    try {
      const data =
        await getScenePrompts(
          projectId,
          scene.id
        );

      setSavedPrompts(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load scene prompts."
      );
    } finally {
      setLoadingPrompts(false);
    }
  }

  async function handleCopyPrompt(
    prompt: string
  ) {
    try {
      await navigator.clipboard.writeText(
        prompt
      );

      setStatus(
        "Prompt copied."
      );
    } catch {
      setError(
        "Unable to copy prompt."
      );
    }
  }

  async function handleDeletePrompt(
    id: string
  ) {
    setError("");

    try {
      await deleteSavedPrompt(id);

      setSavedPrompts(
        (previous) =>
          previous.filter(
            (item) =>
              item.id !== id
          )
      );

      setStatus(
        "Prompt removed from scene."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete prompt."
      );
    }
  }

  const promptStudioHref =
    `/prompts?projectId=${encodeURIComponent(
      projectId
    )}&sceneId=${scene.id}`;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">
            Scene {scene.id}
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {scene.title ||
              `Scene ${scene.id}`}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
            {scene.duration ||
              "No duration"}
          </span>

          <Link
            href={promptStudioHref}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold transition hover:bg-emerald-500"
          >
            🧠 Open in Prompt Studio
          </Link>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <section>
          <h3 className="text-sm font-semibold text-zinc-300">
            Narration
          </h3>

          <p className="mt-2 whitespace-pre-wrap text-zinc-400">
            {scene.narration ||
              "No narration yet."}
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-zinc-300">
            Visual
          </h3>

          <p className="mt-2 whitespace-pre-wrap text-zinc-400">
            {scene.visual ||
              "No visual description yet."}
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoBlock
            label="Camera"
            value={scene.camera}
          />

          <InfoBlock
            label="Motion"
            value={scene.motion}
          />

          <InfoBlock
            label="Transition"
            value={scene.transition}
          />

          <InfoBlock
            label="Project"
            value={projectId}
            truncate
          />
        </div>

        {scene.imagePrompt && (
          <section>
            <h3 className="text-sm font-semibold text-zinc-300">
              Image Prompt
            </h3>

            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 text-sm text-zinc-400">
              {scene.imagePrompt}
            </p>
          </section>
        )}

        {scene.videoPrompt && (
          <section>
            <h3 className="text-sm font-semibold text-zinc-300">
              Video Prompt
            </h3>

            <p className="mt-2 whitespace-pre-wrap rounded-lg bg-zinc-950 p-4 text-sm text-zinc-400">
              {scene.videoPrompt}
            </p>
          </section>
        )}

        <section className="border-t border-zinc-800 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-300">
                Attached Prompts
              </h3>

              <p className="mt-1 text-xs text-zinc-500">
                Saved from Prompt Studio for this scene.
              </p>
            </div>

            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
              {savedPrompts.length}
            </span>
          </div>

          {loadingPrompts && (
            <p className="mt-4 text-sm text-zinc-500">
              Loading prompts...
            </p>
          )}

          {!loadingPrompts &&
            savedPrompts.length === 0 && (
              <div className="mt-4 rounded-lg border border-dashed border-zinc-700 p-5 text-center">
                <p className="text-sm text-zinc-500">
                  No prompts attached to this scene yet.
                </p>
              </div>
            )}

          <div className="mt-4 space-y-3">
            {savedPrompts.map(
              (savedPrompt) => (
                <div
                  key={savedPrompt.id}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {savedPrompt.name}
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-wide text-zinc-500">
                        {
                          savedPrompt.prompt_type
                        }
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyPrompt(
                            savedPrompt.prompt
                          )
                        }
                        className="text-xs text-emerald-400 transition hover:text-emerald-300"
                      >
                        Copy
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDeletePrompt(
                            savedPrompt.id
                          )
                        }
                        className="text-xs text-red-400 transition hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-xs leading-5 text-zinc-500">
                    {savedPrompt.prompt}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {status && (
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
  );
}

function InfoBlock({
  label,
  value,
  truncate = false,
}: {
  label: string;
  value?: string | null;
  truncate?: boolean;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p
        className={`mt-1 text-sm text-zinc-300 ${
          truncate
            ? "truncate"
            : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}