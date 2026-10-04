export type AssetType =
  | "image"
  | "video"
  | "audio";

export type AssetSource =
  | "generated"
  | "uploaded"
  | "external";

export interface ProjectAsset {
  id: string;

  projectId: string;

  sceneId?: number;

  type: AssetType;

  source: AssetSource;

  name: string;

  url: string;

  prompt?: string;

  provider?: string;

  model?: string;

  createdAt: string;

  metadata?: Record<
    string,
    unknown
  >;
}

export interface SceneAssetState {
  image?: string;

  video?: string;

  voice?: string;
}