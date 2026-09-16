export type VideoGenerationMode =
  | "text-to-video"
  | "image-to-video";

export interface VideoEngineCapability {
  id: string;
  name: string;
  provider: string;
  modes: VideoGenerationMode[];
  aspectRatios: string[];
  durations: number[];
  supportsNativeAudio: boolean;
  supportsReferenceImages: boolean;
  supportsFirstLastFrame: boolean;
  maxResolution?: string;
}
