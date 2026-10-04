export const PRODUCTION_STATUS = {
  draft:
    "Draft",

  researching:
    "Researching",

  scripting:
    "Scripting",

  storyboarding:
    "Storyboarding",

  scenes:
    "Scene Production",

  ready:
    "Production Ready",
} as const;

export type ProductionStatus =
  (typeof PRODUCTION_STATUS)[keyof typeof PRODUCTION_STATUS];

export function isProductionReady(
  value:
    | string
    | null
    | undefined
) {
  return (
    value ===
    PRODUCTION_STATUS.ready
  );
}