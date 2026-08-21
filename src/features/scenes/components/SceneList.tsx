"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import SceneCard from "./SceneCard";

import type {
  Scene,
} from "../types";

import {
  generateAllScenePrompts,
} from "../services/generateAllScenePrompts";

import {
  detectAllSceneCast,
} from "../services/detectAllSceneCast";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

import {
  getCastProfiles,
  type CastProfileRow,
} from "@/lib/supabase/castProfiles";

import {
  getPromptTemplates,
  type PromptTemplateRow,
} from "@/lib/supabase/promptTemplates";

interface Props {
  projectId: string;

  scenes: Scene[];
}

type SceneCastSelection =
  Record<
    number,
    string[]
  >;

export default function SceneList({
  projectId,
  scenes: initialScenes,
}: Props) {
  /*
   * SCENES
   */

  const [
    scenes,
    setScenes,
  ] =
    useState<Scene[]>(
      initialScenes
    );

  /*
   * CAST LIBRARY
   */

  const [
    castProfiles,
    setCastProfiles,
  ] =
    useState<
      CastProfileRow[]
    >([]);

  /*
   * PER-SCENE CAST
   */

  const [
    sceneCastSelection,
    setSceneCastSelection,
  ] =
    useState<
      SceneCastSelection
    >({});

  /*
   * STYLE LIBRARY
   */

  const [
    templates,
    setTemplates,
  ] =
    useState<
      PromptTemplateRow[]
    >([]);

  const [
    selectedTemplateId,
    setSelectedTemplateId,
  ] =
    useState("");

  /*
   * LIBRARY STATE
   */

  const [
    loadingLibraries,
    setLoadingLibraries,
  ] =
    useState(true);

  /*
   * AUTO CAST STATE
   */

  const [
    detectingCast,
    setDetectingCast,
  ] =
    useState(false);

  const [
    castProgressCurrent,
    setCastProgressCurrent,
  ] =
    useState(0);

  const [
    castProgressTotal,
    setCastProgressTotal,
  ] =
    useState(0);

  const [
    detectingSceneId,
    setDetectingSceneId,
  ] =
    useState<
      number | null
    >(null);

  /*
   * PROMPT GENERATION STATE
   */

  const [
    generating,
    setGenerating,
  ] =
    useState(false);

  const [
    progressCurrent,
    setProgressCurrent,
  ] =
    useState(0);

  const [
    progressTotal,
    setProgressTotal,
  ] =
    useState(0);

  const [
    currentSceneId,
    setCurrentSceneId,
  ] =
    useState<
      number | null
    >(null);

  /*
   * MESSAGES
   */

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    status,
    setStatus,
  ] =
    useState("");

  /*
   * LOAD LIBRARIES
   */

  useEffect(() => {
    loadLibraries();
  }, []);

  async function loadLibraries() {
    setLoadingLibraries(
      true
    );

    setError("");

    try {
      const [
        castData,
        templateData,
      ] =
        await Promise.all([
          getCastProfiles(),
          getPromptTemplates(),
        ]);

      setCastProfiles(
        castData
      );

      setTemplates(
        templateData
      );

      /*
       * Automatically select
       * the style when only
       * one template exists.
       */

      if (
        templateData.length ===
        1
      ) {
        setSelectedTemplateId(
          templateData[0].id
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load cast and style libraries."
      );
    } finally {
      setLoadingLibraries(
        false
      );
    }
  }

  /*
   * SELECTED TEMPLATE
   */

  const selectedTemplate =
    useMemo(
      () =>
        templates.find(
          (template) =>
            template.id ===
            selectedTemplateId
        ),
      [
        templates,
        selectedTemplateId,
      ]
    );

  /*
   * STYLE LOCK
   */

  const styleLock =
    selectedTemplate
      ?.style_lock ??
    "";

  /*
   * AUTO-DETECT CAST
   */

  async function handleAutoDetectCast() {
    if (
      scenes.length === 0
    ) {
      setError(
        "There are no scenes to analyze."
      );

      return;
    }

    if (
      castProfiles.length ===
      0
    ) {
      setError(
        "Create at least one Cast Profile before using automatic cast detection."
      );

      return;
    }

    setDetectingCast(
      true
    );

    setError("");

    setStatus("");

    setCastProgressCurrent(
      0
    );

    setCastProgressTotal(
      scenes.length
    );

    setDetectingSceneId(
      null
    );

    try {
      const selections =
        await detectAllSceneCast(
          {
            scenes,

            castProfiles,

            onProgress: (
              completed,
              total,
              sceneId
            ) => {
              setCastProgressCurrent(
                completed
              );

              setCastProgressTotal(
                total
              );

              setDetectingSceneId(
                sceneId
              );
            },
          }
        );

      setSceneCastSelection(
        selections
      );

      /*
       * Save selections so
       * they can later become
       * persistent project
       * generation settings.
       */

      await updateProject(
        projectId,
        {
          settings: {
            scenePromptGeneration:
              {
                templateId:
                  selectedTemplateId,

                sceneCastSelection:
                  selections,
              },
          },
        }
      );

      setStatus(
        `Automatic cast detection completed for ${scenes.length} scenes. Review the selections before generating prompts.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Automatic cast detection failed."
      );
    } finally {
      setDetectingCast(
        false
      );

      setDetectingSceneId(
        null
      );
    }
  }

  /*
   * TOGGLE CAST
   */

  function toggleSceneCast(
    sceneId: number,
    castId: string
  ) {
    setSceneCastSelection(
      (previous) => {
        const current =
          previous[
            sceneId
          ] ?? [];

        const next =
          current.includes(
            castId
          )
            ? current.filter(
                (id) =>
                  id !==
                  castId
              )
            : [
                ...current,
                castId,
              ];

        return {
          ...previous,

          [sceneId]:
            next,
        };
      }
    );
  }

  /*
   * SELECT ALL CAST
   * FOR ONE SCENE
   */

  function selectAllCastForScene(
    sceneId: number
  ) {
    setSceneCastSelection(
      (previous) => ({
        ...previous,

        [sceneId]:
          castProfiles.map(
            (profile) =>
              profile.id
          ),
      })
    );
  }

  /*
   * CLEAR ONE SCENE
   */

  function clearCastForScene(
    sceneId: number
  ) {
    setSceneCastSelection(
      (previous) => ({
        ...previous,

        [sceneId]: [],
      })
    );
  }

  /*
   * COPY PREVIOUS SCENE
   */

  function copyPreviousCast(
    sceneIndex: number
  ) {
    if (
      sceneIndex <= 0
    ) {
      return;
    }

    const previousScene =
      scenes[
        sceneIndex - 1
      ];

    const currentScene =
      scenes[
        sceneIndex
      ];

    const previousCast =
      sceneCastSelection[
        previousScene.id
      ] ?? [];

    setSceneCastSelection(
      (previous) => ({
        ...previous,

        [currentScene.id]:
          [
            ...previousCast,
          ],
      })
    );
  }

  /*
   * APPLY ONE CHARACTER
   * TO ALL SCENES
   */

  function applyCastToAll(
    castId: string
  ) {
    setSceneCastSelection(
      (previous) => {
        const next = {
          ...previous,
        };

        for (
          const scene of
          scenes
        ) {
          const current =
            next[
              scene.id
            ] ?? [];

          if (
            !current.includes(
              castId
            )
          ) {
            next[
              scene.id
            ] = [
              ...current,
              castId,
            ];
          }
        }

        return next;
      }
    );
  }

  /*
   * BUILD CAST LOCK
   * FOR ONE SCENE
   */

  function buildCastLock(
    sceneId: number
  ) {
    const selectedIds =
      sceneCastSelection[
        sceneId
      ] ?? [];

    return castProfiles
      .filter(
        (profile) =>
          selectedIds.includes(
            profile.id
          )
      )
      .map(
        (profile) =>
          `${profile.name.toUpperCase()}:\n${profile.description}`
      )
      .join("\n\n");
  }

  /*
   * BUILD ALL CAST LOCKS
   */

  function buildSceneCastLocks() {
    const locks:
      Record<
        number,
        string
      > = {};

    for (
      const scene of
      scenes
    ) {
      locks[
        scene.id
      ] =
        buildCastLock(
          scene.id
        );
    }

    return locks;
  }

  /*
   * READY COUNT
   */

  const scenesWithCast =
    useMemo(() => {
      return scenes.filter(
        (scene) =>
          (
            sceneCastSelection[
              scene.id
            ] ?? []
          ).length > 0
      ).length;
    }, [
      scenes,
      sceneCastSelection,
    ]);

  /*
   * GENERATE PROMPTS
   */

  async function handleGenerateAll() {
    if (
      scenes.length === 0
    ) {
      setError(
        "There are no scenes to generate prompts for."
      );

      return;
    }

    const scenesMissingCast =
      scenes.filter(
        (scene) =>
          (
            sceneCastSelection[
              scene.id
            ] ?? []
          ).length === 0
      );

    if (
      scenesMissingCast.length >
      0
    ) {
      const ids =
        scenesMissingCast
          .map(
            (scene) =>
              scene.id
          )
          .join(", ");

      setError(
        `Review the cast selections first. Scene(s) ${ids} currently have no cast selected.`
      );

      return;
    }

    if (
      !selectedTemplate
    ) {
      setError(
        "Select a style template before generating scene prompts."
      );

      return;
    }

    setGenerating(
      true
    );

    setError("");

    setStatus("");

    setProgressCurrent(
      0
    );

    setProgressTotal(
      scenes.length
    );

    setCurrentSceneId(
      null
    );

    try {
      const sceneCastLocks =
        buildSceneCastLocks();

      const updatedScenes =
        await generateAllScenePrompts(
          {
            scenes,

            sceneCastLocks,

            styleLock,

            onProgress: (
              completed,
              total,
              sceneId
            ) => {
              setProgressCurrent(
                completed
              );

              setProgressTotal(
                total
              );

              setCurrentSceneId(
                sceneId
              );
            },
          }
        );

      setScenes(
        updatedScenes
      );

      await updateProject(
        projectId,
        {
          scenes:
            updatedScenes,

          settings: {
            scenePromptGeneration:
              {
                templateId:
                  selectedTemplateId,

                sceneCastSelection,
              },
          },
        }
      );

      setStatus(
        `Generated and saved image + video prompts for ${updatedScenes.length} scenes.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate scene prompts."
      );
    } finally {
      setGenerating(
        false
      );

      setCurrentSceneId(
        null
      );
    }
  }

  /*
   * EMPTY STATE
   */

  if (
    scenes.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-900 p-10 text-center">
        <h2 className="text-2xl font-bold">
          No Scenes Yet
        </h2>

        <p className="mt-3 text-zinc-400">
          Generate a
          storyboard first
          to create scenes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AUTOMATION */}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
            Production
            Automation
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            ⚡ Automatic
            Scene Production
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-400">
            Automatically
            detect scene cast,
            review the AI
            selections, choose
            your production
            style, then generate
            image and video
            prompts.
          </p>
        </div>

        {loadingLibraries && (
          <div className="mt-6 rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm text-zinc-400">
            Loading Cast
            Library and Style
            Templates...
          </div>
        )}

        {!loadingLibraries && (
          <>
            {/* AUTO CAST */}

            <div className="mt-8 rounded-xl border border-emerald-900/60 bg-emerald-950/20 p-5">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-400">
                    AI Assistant
                  </p>

                  <h3 className="mt-2 text-lg font-semibold">
                    🤖 Automatic
                    Cast Detection
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                    Qwen will
                    analyze each
                    scene and
                    select the
                    saved cast
                    profiles that
                    appear in it.
                    You can edit
                    every selection
                    afterward.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleAutoDetectCast
                  }
                  disabled={
                    detectingCast ||
                    generating ||
                    castProfiles.length ===
                      0
                  }
                  className="rounded-lg bg-emerald-600 px-5 py-3 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {detectingCast
                    ? `🤖 Detecting ${castProgressCurrent}/${castProgressTotal}`
                    : "🤖 Auto-Detect Cast"}
                </button>
              </div>

              {detectingCast && (
                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full bg-emerald-500 transition-all"
                      style={{
                        width:
                          castProgressTotal >
                          0
                            ? `${Math.round(
                                (castProgressCurrent /
                                  castProgressTotal) *
                                  100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-amber-400">
                    {detectingSceneId
                      ? `Analyzing Scene ${detectingSceneId}...`
                      : "Starting cast analysis..."}
                  </p>
                </div>
              )}
            </div>

            {/* STYLE */}

            <div className="mt-8">
              <h3 className="text-lg font-semibold">
                🎨 Production
                Style
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                One Style Lock
                stays consistent
                across every
                scene.
              </p>

              {templates.length ===
              0 ? (
                <div className="mt-4 rounded-lg border border-dashed border-zinc-700 p-5 text-sm text-zinc-500">
                  No templates
                  found. Create
                  one in Prompt
                  Studio.
                </div>
              ) : (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {templates.map(
                    (
                      template
                    ) => {
                      const selected =
                        template.id ===
                        selectedTemplateId;

                      return (
                        <button
                          key={
                            template.id
                          }
                          type="button"
                          onClick={() =>
                            setSelectedTemplateId(
                              template.id
                            )
                          }
                          className={`rounded-lg border p-4 text-left transition ${
                            selected
                              ? "border-emerald-500 bg-emerald-950/30"
                              : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-semibold">
                              {
                                template.name
                              }
                            </span>

                            <span
                              className={
                                selected
                                  ? "text-emerald-400"
                                  : "text-zinc-600"
                              }
                            >
                              {selected
                                ? "✓"
                                : "○"}
                            </span>
                          </div>

                          {template.description && (
                            <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">
                              {
                                template.description
                              }
                            </p>
                          )}
                        </button>
                      );
                    }
                  )}
                </div>
              )}
            </div>

            {/* QUICK CAST */}

            {castProfiles.length >
              0 && (
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <h3 className="text-lg font-semibold">
                  ⚡ Quick Cast
                  Overrides
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Use these after
                  automatic
                  detection when
                  a character
                  belongs in every
                  scene.
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  {castProfiles.map(
                    (
                      profile
                    ) => (
                      <button
                        key={
                          profile.id
                        }
                        type="button"
                        onClick={() =>
                          applyCastToAll(
                            profile.id
                          )
                        }
                        className="rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm transition hover:border-emerald-500"
                      >
                        +{" "}
                        {
                          profile.name
                        }{" "}
                        to All
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* SUMMARY */}

            <div className="mt-8 grid gap-4 rounded-xl border border-zinc-800 bg-zinc-950 p-5 sm:grid-cols-3">
              <Summary
                label="Scenes"
                value={`${scenes.length}`}
              />

              <Summary
                label="Cast Ready"
                value={`${scenesWithCast}/${scenes.length}`}
              />

              <Summary
                label="Style"
                value={
                  selectedTemplate
                    ?.name ??
                  "Not selected"
                }
              />
            </div>

            {/* GENERATE */}

            <button
              type="button"
              onClick={
                handleGenerateAll
              }
              disabled={
                generating ||
                detectingCast ||
                templates.length ===
                  0 ||
                castProfiles.length ===
                  0
              }
              className="mt-6 rounded-lg bg-emerald-600 px-6 py-4 font-semibold transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generating
                ? `⚡ Generating ${progressCurrent}/${progressTotal}...`
                : `⚡ Generate Image + Video Prompts for ${scenes.length} Scenes`}
            </button>

            {generating && (
              <div className="mt-4">
                <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{
                      width:
                        progressTotal >
                        0
                          ? `${Math.round(
                              (progressCurrent /
                                progressTotal) *
                                100
                            )}%`
                          : "0%",
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-amber-400">
                  {currentSceneId
                    ? `Generating Scene ${currentSceneId}...`
                    : "Starting scene generation..."}
                </p>
              </div>
            )}

            {status && (
              <div className="mt-5 rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-400">
                {status}
              </div>
            )}

            {error && (
              <div className="mt-5 rounded-lg border border-red-700 bg-red-950/50 p-4 text-sm text-red-300">
                {error}
              </div>
            )}
          </>
        )}
      </div>

      {/* CAST REVIEW */}

      {!loadingLibraries &&
        castProfiles.length >
          0 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">
                🎭 Cast Review
              </h2>

              <p className="mt-2 text-zinc-400">
                Review Qwen's
                suggestions and
                correct anything
                before generating
                prompts.
              </p>
            </div>

            {scenes.map(
              (
                scene,
                sceneIndex
              ) => {
                const selected =
                  sceneCastSelection[
                    scene.id
                  ] ?? [];

                return (
                  <div
                    key={
                      scene.id
                    }
                    className="rounded-xl border border-zinc-800 bg-zinc-900 p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-zinc-500">
                          Scene{" "}
                          {
                            scene.id
                          }
                        </p>

                        <h3 className="mt-1 text-lg font-semibold">
                          {scene.title ||
                            `Scene ${scene.id}`}
                        </h3>

                        {scene.narration && (
                          <p className="mt-2 max-w-3xl text-sm text-zinc-500">
                            {
                              scene.narration
                            }
                          </p>
                        )}
                      </div>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${
                          selected.length >
                          0
                            ? "border-emerald-800 text-emerald-400"
                            : "border-amber-800 text-amber-400"
                        }`}
                      >
                        {
                          selected.length
                        }{" "}
                        cast
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() =>
                          selectAllCastForScene(
                            scene.id
                          )
                        }
                        className="text-emerald-400 hover:text-emerald-300"
                      >
                        Select All
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          clearCastForScene(
                            scene.id
                          )
                        }
                        className="text-zinc-500 hover:text-white"
                      >
                        Clear
                      </button>

                      {sceneIndex >
                        0 && (
                        <button
                          type="button"
                          onClick={() =>
                            copyPreviousCast(
                              sceneIndex
                            )
                          }
                          className="text-zinc-400 hover:text-white"
                        >
                          Copy Previous
                        </button>
                      )}
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {castProfiles.map(
                        (
                          profile
                        ) => {
                          const isSelected =
                            selected.includes(
                              profile.id
                            );

                          return (
                            <button
                              key={
                                profile.id
                              }
                              type="button"
                              onClick={() =>
                                toggleSceneCast(
                                  scene.id,
                                  profile.id
                                )
                              }
                              className={`rounded-lg border p-4 text-left transition ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-950/30"
                                  : "border-zinc-700 bg-zinc-950 hover:border-zinc-500"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <span className="font-semibold">
                                  {
                                    profile.name
                                  }
                                </span>

                                <span
                                  className={
                                    isSelected
                                      ? "text-emerald-400"
                                      : "text-zinc-600"
                                  }
                                >
                                  {isSelected
                                    ? "✓"
                                    : "+"}
                                </span>
                              </div>

                              <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-500">
                                {
                                  profile.description
                                }
                              </p>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

      {/* GENERATED SCENES */}

      <div className="space-y-6">
        {scenes.map(
          (scene) => (
            <SceneCard
              key={scene.id}
              projectId={
                projectId
              }
              scene={scene}
            />
          )
        )}
      </div>
    </div>
  );
}

function Summary({
  label,
  value,
}: {
  label: string;

  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-zinc-500">
        {label}
      </p>

      <p className="mt-1 font-semibold text-zinc-200">
        {value}
      </p>
    </div>
  );
}