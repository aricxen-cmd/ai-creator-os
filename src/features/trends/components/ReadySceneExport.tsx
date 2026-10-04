"use client";

import {
  useState,
} from "react";

import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  validateScenePromptQuality,
} from "../engine/validateScenePromptQuality";

import {
  buildExportManifest,
} from "../engine/buildExportManifest";

interface Props {
  projectId: string;

  projectTitle: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;
}

export default function ReadySceneExport({
  projectId,
  projectTitle,
  scenes,
  settings,
}: Props) {
  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const readyScenes =
    scenes.filter(
      (scene) =>
        validateScenePromptQuality(
          scene
        ).pass
    );

  function downloadReadyManifest() {
    setError("");
    setStatus("");

    if (
      readyScenes.length === 0
    ) {
      setError(
        "There are no production-ready scenes to export."
      );

      return;
    }

    try {
      const manifest =
        buildExportManifest({
          projectId,

          projectTitle,

          scenes,

          settings,
        });

      const blob =
        new Blob(
          [
            JSON.stringify(
              manifest,
              null,
              2
            ),
          ],
          {
            type:
              "application/json",
          }
        );

      const url =
        URL.createObjectURL(
          blob
        );

      const anchor =
        document.createElement(
          "a"
        );

      const safeTitle =
        projectTitle
          .toLowerCase()
          .replace(
            /[^a-z0-9]+/g,
            "-"
          )
          .replace(
            /^-+|-+$/g,
            ""
          ) ||
        "ai-creator-os";

      anchor.href =
        url;

      anchor.download =
        `${safeTitle}-ready-scenes.json`;

      document.body.appendChild(
        anchor
      );

      anchor.click();

      anchor.remove();

      URL.revokeObjectURL(
        url
      );

      setStatus(
        `${readyScenes.length} ready scene${
          readyScenes.length ===
          1
            ? ""
            : "s"
        } exported.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export ready scenes."
      );
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Ready-Only Export
          </p>

          <h2 className="mt-2 text-xl font-bold">
            🚀 Export Ready Scenes
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Export only scenes that already contain valid visual, image, and image-to-video production prompts.
          </p>

          <p className="mt-3 text-sm text-zinc-300">
            {readyScenes.length} of{" "}
            {scenes.length} scenes
            are ready.
          </p>
        </div>

        <button
          type="button"
          onClick={
            downloadReadyManifest
          }
          disabled={
            readyScenes.length ===
            0
          }
          className="shrink-0 rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ⬇ Export Ready Scenes
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