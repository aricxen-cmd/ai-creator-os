import {
  getProject,
} from "@/lib/supabase/projects";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

import type {
  Scene,
} from "@/features/scenes/types";

import type {
  AssetSource,
  AssetType,
  ProjectAsset,
} from "../types";

function createAssetId() {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `asset-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function normalizeScenes(
  value: unknown
): Scene[] {
  return Array.isArray(value)
    ? (value as Scene[])
    : [];
}

function normalizeAssets(
  value: unknown
): ProjectAsset[] {
  return Array.isArray(value)
    ? (value as ProjectAsset[])
    : [];
}

function getAssetField(
  type: AssetType
): "image" | "video" | "voice" {
  switch (type) {
    case "image":
      return "image";

    case "video":
      return "video";

    case "audio":
      return "voice";
  }
}

export async function setSceneAsset({
  projectId,
  sceneId,
  type,
  url,
  prompt,
  source = "external",
  name,
  provider,
  model,
  metadata,
}: {
  projectId: string;
  sceneId: number;
  type: AssetType;
  url: string;
  prompt?: string;
  source?: AssetSource;
  name?: string;
  provider?: string;
  model?: string;
  metadata?: Record<
    string,
    unknown
  >;
}) {
  const project =
    await getProject(
      projectId
    );

  if (!project) {
    throw new Error(
      "Project not found."
    );
  }

  const scenes =
    normalizeScenes(
      project.scenes
    );

  const assets =
    normalizeAssets(
      project.assets
    );

  const field =
    getAssetField(
      type
    );

  const sceneExists =
    scenes.some(
      (scene) =>
        scene.id ===
        sceneId
    );

  if (!sceneExists) {
    throw new Error(
      `Scene ${sceneId} was not found.`
    );
  }

  const nextScenes =
    scenes.map(
      (scene) => {
        if (
          scene.id !==
          sceneId
        ) {
          return scene;
        }

        return {
          ...scene,

          assets: {
            ...scene.assets,

            [field]:
              url,
          },
        };
      }
    );

  const asset: ProjectAsset =
    {
      id:
        createAssetId(),

      projectId,

      sceneId,

      type,

      source,

      name:
        name ??
        `Scene ${sceneId} ${type}`,

      url,

      prompt,

      provider,

      model,

      createdAt:
        new Date().toISOString(),

      metadata,
    };

  /*
   * A scene should only have
   * one current asset for each
   * media type.
   *
   * Replace the previous
   * image/video/audio record
   * when a new one is attached.
   */
  const nextAssets = [
    ...assets.filter(
      (item) =>
        !(
          item.sceneId ===
            sceneId &&
          item.type ===
            type
        )
    ),

    asset,
  ];

  await updateProject(
    projectId,
    {
      scenes:
        nextScenes,

      assets:
        nextAssets,
    }
  );

  return {
    scene:
      nextScenes.find(
        (scene) =>
          scene.id ===
          sceneId
      ),

    asset,
  };
}

export async function removeSceneAsset({
  projectId,
  sceneId,
  type,
}: {
  projectId: string;
  sceneId: number;
  type: AssetType;
}) {
  const project =
    await getProject(
      projectId
    );

  if (!project) {
    throw new Error(
      "Project not found."
    );
  }

  const scenes =
    normalizeScenes(
      project.scenes
    );

  const assets =
    normalizeAssets(
      project.assets
    );

  const field =
    getAssetField(
      type
    );

  const nextScenes =
    scenes.map(
      (scene) => {
        if (
          scene.id !==
          sceneId
        ) {
          return scene;
        }

        const nextSceneAssets =
          {
            ...scene.assets,
          };

        delete nextSceneAssets[
          field
        ];

        return {
          ...scene,

          assets:
            nextSceneAssets,
        };
      }
    );

  const nextAssets =
    assets.filter(
      (item) =>
        !(
          item.sceneId ===
            sceneId &&
          item.type ===
            type
        )
    );

  await updateProject(
    projectId,
    {
      scenes:
        nextScenes,

      assets:
        nextAssets,
    }
  );

  return nextScenes.find(
    (scene) =>
      scene.id ===
      sceneId
  );
}