"use client";

import {
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import type {
  Scene,
} from "@/features/scenes/types";

import type {
  TrendProjectSettings,
} from "../utils/projectTrendContract";

import {
  buildTrendProductionContext,
} from "../utils/projectTrendContract";

import {
  buildSceneContract,
} from "../engine/buildSceneContract";

import {
  validateScenePromptQuality,
} from "../engine/validateScenePromptQuality";

import {
  regenerateContractScene,
} from "../services/regenerateContractScene";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

interface Props {
  projectId: string;

  scenes: Scene[];

  settings:
    TrendProjectSettings | null;

  script?: string;

  storyboard?: string;
}

export default function RepairBadScenes({
  projectId,
  scenes,
  settings,
  script = "",
  storyboard = "",
}: Props) {
  const router =
    useRouter();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    progress,
    setProgress,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

const contract =
  buildSceneContract(
    settings
  );

const badScenes =
  scenes.filter(
    (scene) =>
      !validateScenePromptQuality(
        scene
      ).pass
  );

if (
  !settings ||
  !contract
) {
  return null;
}

const activeSettings =
  settings;

const activeContract =
  contract;

  async function handleRepairBadScenes() {
    if (
      badScenes.length === 0
    ) {
      setStatus(
        "All scenes already pass prompt quality checks."
      );

      return;
    }

    setLoading(true);

    setError("");

    setStatus("");

    let workingScenes =
      [...scenes];

    try {
      for (
        let index = 0;
        index <
        badScenes.length;
        index += 1
      ) {
        const badScene =
          badScenes[index];

        setProgress(
          `Repairing ${index + 1} of ${badScenes.length}: Scene ${badScene.id}`
        );

        const currentScene =
          workingScenes.find(
            (scene) =>
              scene.id ===
              badScene.id
          );

        if (!currentScene) {
          continue;
        }

        const repaired =
          await regenerateContractScene({
            scene:
              currentScene,

            allScenes:
              workingScenes,

            contract:
  activeContract,

            topic:
  activeSettings.topic ??
  "",

            script,

            storyboard,

            productionContext:
  buildTrendProductionContext(
    activeSettings
  ),

            provider:
              "Ollama",

            model:
              "qwen3:4b",
          });

        workingScenes =
          workingScenes.map(
            (scene) =>
              scene.id ===
              repaired.id
                ? repaired
                : scene
          );
      }

      setProgress(
        "Saving repaired scenes..."
      );

      await updateProject(
        projectId,
        {
          scenes:
            workingScenes,
        }
      );

      setStatus(
        `${badScenes.length} scene${
          badScenes.length === 1
            ? ""
            : "s"
        } repaired and saved.`
      );

      setProgress("");

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to repair bad scenes."
      );

      setProgress("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">
            Quality Repair
          </p>

          <h2 className="mt-2 text-xl font-bold">
            🔧 Repair Bad Scenes
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Regenerate only scenes
            missing required visual,
            image prompt, or video
            prompt data instead of
            rebuilding the entire
            production.
          </p>

          <p className="mt-3 text-sm font-medium text-zinc-300">
            {badScenes.length} of{" "}
            {scenes.length} scenes
            currently need repair.
          </p>
        </div>

        <button
          type="button"
          onClick={
            handleRepairBadScenes
          }
          disabled={
            loading ||
            badScenes.length ===
              0
          }
          className="shrink-0 rounded-lg bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Repairing..."
            : badScenes.length ===
                0
              ? "✓ All Scenes Ready"
              : `🔧 Repair ${badScenes.length} Bad Scene${
                  badScenes.length ===
                  1
                    ? ""
                    : "s"
                }`}
        </button>
      </div>

      {progress && (
        <div className="mt-5 rounded-lg border border-amber-900/60 bg-amber-950/10 p-4 text-sm text-amber-300">
          {progress}
        </div>
      )}

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