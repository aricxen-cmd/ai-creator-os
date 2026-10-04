"use client";

import {
  useState,
} from "react";

import type {
  Scene,
} from "@/features/scenes/types";

interface Props {
  scenes: Scene[];
}

export default function ScenePromptBulkActions({
  scenes,
}: Props) {
  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  async function copyImagePrompts() {
    const content =
      scenes
        .filter(
          (scene) =>
            scene.imagePrompt?.trim()
        )
        .map(
          (scene) => `
SCENE ${scene.id}
${scene.title}

${scene.imagePrompt}
`.trim()
        )
        .join(
          "\n\n--------------------\n\n"
        );

    await copyContent(
      content,
      "All image prompts copied."
    );
  }

  async function copyVideoPrompts() {
    const content =
      scenes
        .filter(
          (scene) =>
            scene.videoPrompt?.trim()
        )
        .map(
          (scene) => `
SCENE ${scene.id}
${scene.title}

${scene.videoPrompt}
`.trim()
        )
        .join(
          "\n\n--------------------\n\n"
        );

    await copyContent(
      content,
      "All video prompts copied."
    );
  }

  async function copyAudioPrompts() {
    const content =
      scenes
        .filter(
          (scene) =>
            scene.voicePrompt?.trim()
        )
        .map(
          (scene) => `
SCENE ${scene.id}
${scene.title}

${scene.voicePrompt}
`.trim()
        )
        .join(
          "\n\n--------------------\n\n"
        );

    await copyContent(
      content,
      "All voice/audio prompts copied."
    );
  }

  async function copyAllProduction() {
    const content =
      scenes
        .map(
          (scene) => `
====================
SCENE ${scene.id}
${scene.title}
====================

DURATION
${scene.duration || "—"}

NARRATION
${scene.narration || "—"}

VISUAL
${scene.visual || "—"}

CAMERA
${scene.camera || "—"}

MOTION
${scene.motion || "—"}

TRANSITION
${scene.transition || "—"}

IMAGE PROMPT
${scene.imagePrompt || "—"}

IMAGE-TO-VIDEO PROMPT
${scene.videoPrompt || "—"}

VOICE / NATIVE AUDIO
${scene.voicePrompt || "—"}
`.trim()
        )
        .join("\n\n");

    await copyContent(
      content,
      "Full production pack copied."
    );
  }

  async function copyContent(
    content: string,
    successMessage: string
  ) {
    setError("");
    setStatus("");

    if (!content.trim()) {
      setError(
        "There are no prompts available to copy."
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        content
      );

      setStatus(
        successMessage
      );
    } catch {
      setError(
        "Unable to copy prompts to the clipboard."
      );
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Export Tools
        </p>

        <h2 className="mt-2 text-xl font-bold">
          📦 Production Prompt Pack
        </h2>

        <p className="mt-2 text-sm leading-6 text-zinc-400">
          Copy all generated scene
          prompts for use in your
          image, video, and audio
          generation tools.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={
            copyImagePrompts
          }
          className="rounded-lg bg-emerald-600 px-4 py-3 text-sm font-semibold transition hover:bg-emerald-500"
        >
          🖼 Copy Image Prompts
        </button>

        <button
          type="button"
          onClick={
            copyVideoPrompts
          }
          className="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-500"
        >
          🎥 Copy Video Prompts
        </button>

        <button
          type="button"
          onClick={
            copyAudioPrompts
          }
          className="rounded-lg border border-zinc-700 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-500"
        >
          🔊 Copy Audio Prompts
        </button>

        <button
          type="button"
          onClick={
            copyAllProduction
          }
          className="rounded-lg border border-emerald-800 px-4 py-3 text-sm text-emerald-400 transition hover:border-emerald-600"
        >
          📋 Copy Full Production Pack
        </button>
      </div>

      {status && (
        <div className="mt-5 rounded-lg border border-emerald-900/60 bg-emerald-950/20 p-4 text-sm text-emerald-400">
          {status}
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-lg border border-red-900/60 bg-red-950/20 p-4 text-sm text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}