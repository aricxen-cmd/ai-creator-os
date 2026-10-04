"use client";

import {
  ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  Scene,
} from "@/features/scenes/types";

import type {
  AssetType,
} from "../types";

import {
  removeSceneAsset,
  setSceneAsset,
} from "../services/setSceneAsset";

import {
  uploadSceneAsset,
} from "../services/uploadSceneAsset";

interface Props {
  projectId: string;
  scene: Scene;
}

export default function SceneAssetPanel({
  projectId,
  scene,
}: Props) {
  const [
    imageUrl,
    setImageUrl,
  ] = useState(
    scene.assets?.image ??
      ""
  );

  const [
    videoUrl,
    setVideoUrl,
  ] = useState(
    scene.assets?.video ??
      ""
  );

  const [
    voiceUrl,
    setVoiceUrl,
  ] = useState(
    scene.assets?.voice ??
      ""
  );

  useEffect(() => {
    setImageUrl(
      scene.assets?.image ??
        ""
    );

    setVideoUrl(
      scene.assets?.video ??
        ""
    );

    setVoiceUrl(
      scene.assets?.voice ??
        ""
    );
  }, [
    scene.assets?.image,
    scene.assets?.video,
    scene.assets?.voice,
  ]);

  return (
    <section className="border-t border-zinc-800 pt-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
          Phase 6 Assets
        </p>

        <h3 className="mt-2 text-lg font-bold text-zinc-100">
          Scene Media
        </h3>

        <p className="mt-1 max-w-3xl text-sm leading-6 text-zinc-500">
          Upload media directly
          from your computer or
          attach an existing URL.
          Uploaded files are saved
          to Supabase Storage and
          automatically connected
          to this scene.
        </p>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-3">
        <AssetSlot
          projectId={
            projectId
          }
          sceneId={
            scene.id
          }
          type="image"
          label="Image"
          icon="🖼️"
          url={
            imageUrl
          }
          prompt={
            scene.imagePrompt
          }
          onChange={
            setImageUrl
          }
        />

        <AssetSlot
          projectId={
            projectId
          }
          sceneId={
            scene.id
          }
          type="video"
          label="Video"
          icon="🎬"
          url={
            videoUrl
          }
          prompt={
            scene.videoPrompt
          }
          onChange={
            setVideoUrl
          }
        />

        <AssetSlot
          projectId={
            projectId
          }
          sceneId={
            scene.id
          }
          type="audio"
          label="Voice / Audio"
          icon="🎙️"
          url={
            voiceUrl
          }
          prompt={
            scene.voicePrompt ??
            scene.narration
          }
          onChange={
            setVoiceUrl
          }
        />
      </div>
    </section>
  );
}

function AssetSlot({
  projectId,
  sceneId,
  type,
  label,
  icon,
  url,
  prompt,
  onChange,
}: {
  projectId: string;
  sceneId: number;
  type: AssetType;
  label: string;
  icon: string;
  url: string;
  prompt?: string;
  onChange:
    (
      value: string
    ) => void;
}) {
  const [
    draftUrl,
    setDraftUrl,
  ] =
    useState(
      url
    );

  const [
    selectedFile,
    setSelectedFile,
  ] =
    useState<
      File | null
    >(null);

  const [
    uploading,
    setUploading,
  ] =
    useState(false);

  const [
    saving,
    setSaving,
  ] =
    useState(false);

  const [
    status,
    setStatus,
  ] =
    useState("");

  const [
    error,
    setError,
  ] =
    useState("");

  const fileInputRef =
    useRef<
      HTMLInputElement | null
    >(null);

  useEffect(() => {
    setDraftUrl(
      url
    );
  }, [
    url,
  ]);

  function getAccept() {
    switch (type) {
      case "image":
        return "image/*";

      case "video":
        return "video/*";

      case "audio":
        return "audio/*";
    }
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target
        .files?.[0] ??
      null;

    setSelectedFile(
      file
    );

    setStatus("");
    setError("");
  }

  async function uploadFile() {
    if (!selectedFile) {
      setError(
        `Choose a ${label.toLowerCase()} file first.`
      );

      return;
    }

    setUploading(
      true
    );

    setStatus("");
    setError("");

    try {
      const result =
        await uploadSceneAsset({
          projectId,

          sceneId,

          type,

          file:
            selectedFile,

          prompt,
        });

      setDraftUrl(
        result.publicUrl
      );

      onChange(
        result.publicUrl
      );

      setSelectedFile(
        null
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

      setStatus(
        "Uploaded and attached"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to upload asset."
      );
    } finally {
      setUploading(
        false
      );
    }
  }

  async function saveUrl() {
    const cleanUrl =
      draftUrl.trim();

    if (!cleanUrl) {
      setError(
        `Enter a ${label.toLowerCase()} URL first.`
      );

      return;
    }

    setSaving(
      true
    );

    setStatus("");
    setError("");

    try {
      await setSceneAsset({
        projectId,

        sceneId,

        type,

        url:
          cleanUrl,

        prompt,

        source:
          "external",
      });

      onChange(
        cleanUrl
      );

      setStatus(
        "URL attached"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save asset."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function remove() {
    setSaving(
      true
    );

    setStatus("");
    setError("");

    try {
      await removeSceneAsset({
        projectId,

        sceneId,

        type,
      });

      setDraftUrl("");

      onChange("");

      setSelectedFile(
        null
      );

      if (
        fileInputRef.current
      ) {
        fileInputRef.current.value =
          "";
      }

      setStatus(
        "Removed"
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove asset."
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  const busy =
    saving ||
    uploading;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <div className="flex items-center justify-between gap-3">
        <h4 className="font-semibold text-zinc-200">
          <span className="mr-2">
            {
              icon
            }
          </span>

          {
            label
          }
        </h4>

        {url && (
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
            Attached
          </span>
        )}
      </div>

      <div className="mt-4">
        <AssetPreview
          type={
            type
          }
          url={
            url
          }
        />
      </div>

      {/* FILE UPLOAD */}

      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/70 p-3">
        <p className="text-xs font-semibold text-zinc-300">
          Upload from computer
        </p>

        <input
          ref={
            fileInputRef
          }
          type="file"
          accept={
            getAccept()
          }
          onChange={
            handleFileChange
          }
          disabled={
            busy
          }
          className="mt-3 block w-full text-xs text-zinc-400 file:mr-3 file:rounded-md file:border-0 file:bg-zinc-800 file:px-3 file:py-2 file:text-xs file:font-medium file:text-zinc-200 hover:file:bg-zinc-700 disabled:opacity-50"
        />

        {selectedFile && (
          <div className="mt-3 rounded-md bg-zinc-950 p-3">
            <p className="truncate text-xs font-medium text-zinc-300">
              {
                selectedFile.name
              }
            </p>

            <p className="mt-1 text-[11px] text-zinc-600">
              {
                formatFileSize(
                  selectedFile.size
                )
              }
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={
            uploadFile
          }
          disabled={
            !selectedFile ||
            busy
          }
          className="mt-3 w-full rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading
            ? "Uploading..."
            : `⬆ Upload ${label}`}
        </button>
      </div>

      {/* URL ATTACH */}

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-zinc-800" />

        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
          or
        </span>

        <div className="h-px flex-1 bg-zinc-800" />
      </div>

      <label className="block text-xs font-medium text-zinc-500">
        Attach by URL
      </label>

      <input
        type="url"
        value={
          draftUrl
        }
        onChange={(
          event
        ) => {
          setDraftUrl(
            event.target.value
          );

          setStatus("");
          setError("");
        }}
        disabled={
          busy
        }
        placeholder={
          type ===
          "image"
            ? "https://...image.png"
            : type ===
                "video"
              ? "https://...video.mp4"
              : "https://...audio.mp3"
        }
        className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-600 disabled:opacity-50"
      />

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={
            saveUrl
          }
          disabled={
            busy ||
            !draftUrl.trim()
          }
          className="flex-1 rounded-lg border border-emerald-800 bg-emerald-950/30 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-950/60 disabled:opacity-40"
        >
          {saving
            ? "Saving..."
            : url
              ? "Update URL"
              : "Attach URL"}
        </button>

        {url && (
          <button
            type="button"
            onClick={
              remove
            }
            disabled={
              busy
            }
            className="rounded-lg border border-red-900/60 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-950/40 disabled:opacity-50"
          >
            Remove
          </button>
        )}
      </div>

      {status && (
        <p className="mt-3 text-xs font-medium text-emerald-400">
          ✓ {
            status
          }
        </p>
      )}

      {error && (
        <div className="mt-3 rounded-lg border border-red-900/60 bg-red-950/30 p-3">
          <p className="text-xs leading-5 text-red-400">
            {
              error
            }
          </p>
        </div>
      )}
    </div>
  );
}

function AssetPreview({
  type,
  url,
}: {
  type: AssetType;
  url: string;
}) {
  if (!url) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900 text-xs text-zinc-600">
        No asset attached
      </div>
    );
  }

  if (
    type ===
    "image"
  ) {
    return (
      <div className="aspect-video overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            url
          }
          alt="Scene asset"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  if (
    type ===
    "video"
  ) {
    return (
      <video
        src={
          url
        }
        controls
        preload="metadata"
        className="aspect-video w-full rounded-lg border border-zinc-800 bg-black object-cover"
      />
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3">
      <audio
        src={
          url
        }
        controls
        preload="metadata"
        className="w-full"
      />
    </div>
  );
}

function formatFileSize(
  bytes: number
) {
  if (
    bytes < 1024
  ) {
    return `${bytes} B`;
  }

  const kb =
    bytes / 1024;

  if (
    kb < 1024
  ) {
    return `${kb.toFixed(
      1
    )} KB`;
  }

  const mb =
    kb / 1024;

  if (
    mb < 1024
  ) {
    return `${mb.toFixed(
      1
    )} MB`;
  }

  const gb =
    mb / 1024;

  return `${gb.toFixed(
    2
  )} GB`;
}