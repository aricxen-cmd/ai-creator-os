import {
  supabase,
} from "@/lib/supabase/client";

import type {
  AssetType,
} from "../types";

import {
  setSceneAsset,
} from "./setSceneAsset";

const STORAGE_BUCKET =
  "project-assets";

function sanitizeFileName(
  fileName: string
) {
  const extension =
    fileName.includes(".")
      ? fileName
          .split(".")
          .pop()
          ?.toLowerCase()
      : undefined;

  const baseName =
    fileName
      .replace(
        /\.[^/.]+$/,
        ""
      )
      .toLowerCase()
      .replace(
        /[^a-z0-9-_]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      )
      .slice(
        0,
        80
      ) || "asset";

  return extension
    ? `${baseName}.${extension}`
    : baseName;
}

function validateFileType(
  file: File,
  type: AssetType
) {
  const mime =
    file.type.toLowerCase();

  if (
    type === "image" &&
    !mime.startsWith(
      "image/"
    )
  ) {
    throw new Error(
      "Please select an image file."
    );
  }

  if (
    type === "video" &&
    !mime.startsWith(
      "video/"
    )
  ) {
    throw new Error(
      "Please select a video file."
    );
  }

  if (
    type === "audio" &&
    !mime.startsWith(
      "audio/"
    )
  ) {
    throw new Error(
      "Please select an audio file."
    );
  }
}

function createUniquePart() {
  if (
    typeof crypto !==
      "undefined" &&
    "randomUUID" in crypto
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export async function uploadSceneAsset({
  projectId,
  sceneId,
  type,
  file,
  prompt,
}: {
  projectId: string;
  sceneId: number;
  type: AssetType;
  file: File;
  prompt?: string;
}) {
  validateFileType(
    file,
    type
  );

  const safeFileName =
    sanitizeFileName(
      file.name
    );

  const uniquePart =
    createUniquePart();

  /*
   * Storage layout:
   *
   * project-assets/
   *   PROJECT_ID/
   *     scene-1/
   *       image/
   *       video/
   *       audio/
   */
  const storagePath =
    `${projectId}/scene-${sceneId}/${type}/${uniquePart}-${safeFileName}`;

  const {
    data: uploadData,
    error: uploadError,
  } =
    await supabase.storage
      .from(
        STORAGE_BUCKET
      )
      .upload(
        storagePath,
        file,
        {
          cacheControl:
            "3600",

          upsert:
            false,

          contentType:
            file.type ||
            undefined,
        }
      );

  if (uploadError) {
    throw new Error(
      uploadError.message
    );
  }

  const {
    data: publicUrlData,
  } =
    supabase.storage
      .from(
        STORAGE_BUCKET
      )
      .getPublicUrl(
        uploadData.path
      );

  const publicUrl =
    publicUrlData.publicUrl;

  if (!publicUrl) {
    throw new Error(
      "Upload completed but no public URL was returned."
    );
  }

  /*
   * Save the uploaded asset
   * into:
   *
   * project.scenes[].assets
   * project.assets[]
   */
  const saved =
    await setSceneAsset({
      projectId,

      sceneId,

      type,

      url:
        publicUrl,

      prompt,

      source:
        "uploaded",

      name:
        file.name,

      provider:
        "Supabase Storage",

      metadata: {
        storageBucket:
          STORAGE_BUCKET,

        storagePath:
          uploadData.path,

        mimeType:
          file.type,

        size:
          file.size,

        originalName:
          file.name,
      },
    });

  return {
    ...saved,

    publicUrl,

    storagePath:
      uploadData.path,

    bucket:
      STORAGE_BUCKET,
  };
}