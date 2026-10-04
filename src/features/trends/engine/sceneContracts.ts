export type SceneContractMode =
  | "fixed-scenes"
  | "a-b-pairs"
  | "dynamic";

export interface SceneContract {
  formatId: string;

  duration: string;

  mode: SceneContractMode;

  expectedScenes: number;

  secondsPerScene?: number;

  expectedPairs?: number;

  expectedImages?: number;

  narrationRequired: boolean;

  nativeAudioRequired: boolean;

  continuityRequired: boolean;

  requiredRoles: string[];

  rules: string[];
}

export interface SceneContractValidation {
  pass: boolean;

  expectedScenes: number;

  actualScenes: number;

  errors: string[];

  warnings: string[];
}