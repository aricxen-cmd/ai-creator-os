import { videoEngineRegistry } from "./data/registry";
import type { VideoGenerationMode } from "./types";

interface EngineRequirements {
  mode?: VideoGenerationMode;
  aspectRatio?: string;
  durationSeconds?: number;
  nativeAudio?: boolean;
  referenceImages?: boolean;
}

export function getCompatibleEngines(requirements: EngineRequirements) {
  return videoEngineRegistry.filter((engine) => {
    if (requirements.mode && !engine.modes.includes(requirements.mode)) return false;
    if (requirements.aspectRatio && !engine.aspectRatios.includes(requirements.aspectRatio)) return false;
    if (requirements.durationSeconds && !engine.durations.includes(requirements.durationSeconds)) return false;
    if (requirements.nativeAudio && !engine.supportsNativeAudio) return false;
    if (requirements.referenceImages && !engine.supportsReferenceImages) return false;
    return true;
  });
}
