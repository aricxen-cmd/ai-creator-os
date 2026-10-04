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
  buildProductionPack,
  productionPackToText,
} from "../engine/buildProductionPack";

interface Props {
  projectId: string;

  projectTitle: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;
}

export default function ScenePromptDownloadActions({
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

  function createPack() {
    return buildProductionPack({
      projectId,

      projectTitle,

      scenes,

      settings,
    });
  }

  function downloadJSON() {
    setError("");
    setStatus("");

    if (
      scenes.length === 0
    ) {
      setError(
        "There are no scenes to export."
      );

      return;
    }

    try {
      const pack =
        createPack();

      const content =
        JSON.stringify(
          pack,
          null,
          2
        );

      downloadFile(
        content,
        buildFilename(
          projectTitle,
          "production-pack.json"
        ),
        "application/json"
      );

      setStatus(
        "JSON production pack downloaded."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export JSON."
      );
    }
  }

  function downloadTXT() {
    setError("");
    setStatus("");

    if (
      scenes.length === 0
    ) {
      setError(
        "There are no scenes to export."
      );

      return;
    }

    try {
      const pack =
        createPack();

      const content =
        productionPackToText(
          pack
        );

      downloadFile(
        content,
        buildFilename(
          projectTitle,
          "production-pack.txt"
        ),
        "text/plain"
      );

      setStatus(
        "TXT production pack downloaded."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to export TXT."
      );
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          File Export
        </p>

        <h2 className="mt-2 text-xl font-bold">
          💾 Download Production Pack
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
          Export the complete project
          scene package for backup,
          external generators, editing,
          or later production.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={
            downloadJSON
          }
          disabled={
            scenes.length === 0
          }
          className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ⬇ Download JSON
        </button>

        <button
          type="button"
          onClick={
            downloadTXT
          }
          disabled={
            scenes.length === 0
          }
          className="rounded-lg border border-zinc-700 px-5 py-3 text-sm text-zinc-300 transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          📄 Download TXT
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

function downloadFile(
  content: string,
  filename: string,
  type: string
) {
  const blob =
    new Blob(
      [content],
      {
        type,
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

  anchor.href =
    url;

  anchor.download =
    filename;

  document.body.appendChild(
    anchor
  );

  anchor.click();

  anchor.remove();

  URL.revokeObjectURL(
    url
  );
}

function buildFilename(
  title: string,
  suffix: string
) {
  const safeTitle =
    title
      .trim()
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

  return `${safeTitle}-${suffix}`;
}