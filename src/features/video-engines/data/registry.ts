import type { VideoEngineCapability } from "../types";

export const videoEngineRegistry: VideoEngineCapability[] = [
  {
    id: "google-veo",
    name: "Veo",
    provider: "Google",
    modes: ["text-to-video", "image-to-video"],
    aspectRatios: ["16:9", "9:16"],
    durations: [4, 6, 8],
    supportsNativeAudio: true,
    supportsReferenceImages: true,
    supportsFirstLastFrame: true,
    maxResolution: "1080p",
  },
  {
    id: "openai-sora",
    name: "Sora",
    provider: "OpenAI",
    modes: ["text-to-video", "image-to-video"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    durations: [5, 10, 15, 20],
    supportsNativeAudio: false,
    supportsReferenceImages: true,
    supportsFirstLastFrame: false,
  },
  {
    id: "runway-gen4",
    name: "Gen-4",
    provider: "Runway",
    modes: ["image-to-video"],
    aspectRatios: ["16:9", "9:16", "1:1"],
    durations: [5, 10],
    supportsNativeAudio: false,
    supportsReferenceImages: true,
    supportsFirstLastFrame: true,
  },
];

export function getVideoEngine(engineId: string) {
  return videoEngineRegistry.find((engine) => engine.id === engineId) ?? null;
}
