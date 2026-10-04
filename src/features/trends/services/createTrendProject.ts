import {
  createProject,
} from "@/lib/supabase/projects";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

import type {
  TrendFormat,
} from "../data/trendCatalog";

export interface CreateTrendProjectInput {
  format: TrendFormat;

  topic: string;

  duration: string;

  options?: Record<
    string,
    string
  >;
}

export async function createTrendProject({
  format,
  topic,
  duration,
  options = {},
}: CreateTrendProjectInput) {
  const cleanTopic =
    topic.trim();

  if (!cleanTopic) {
    throw new Error(
      "Enter a video topic."
    );
  }

  if (
    !format.durations.includes(
      duration
    )
  ) {
    throw new Error(
      "Choose a valid duration."
    );
  }

  /*
   * Clean empty option values
   * before saving them.
   */
  const cleanOptions =
    Object.fromEntries(
      Object.entries(
        options
      )
        .map(
          ([
            key,
            value,
          ]) => [
            key,
            value.trim(),
          ]
        )
        .filter(
          ([
            ,
            value,
          ]) =>
            Boolean(
              value
            )
        )
    );

  /*
   * Create base project.
   */
  const project =
    await createProject(
      cleanTopic,
      `${format.title} production using the ${format.style} format.`
    );

  if (!project?.id) {
    throw new Error(
      "Project was created but no project ID was returned."
    );
  }

  /*
   * Complete Trend Production
   * Contract.
   */
  const trendSettings = {
    trendFormatId:
      format.id,

    trendFormatTitle:
      format.title,

    category:
      format.category,

    topic:
      cleanTopic,

    duration,

    structureFamily:
      format.structureFamily,

    audioMode:
      format.audioMode,

    style:
      format.style,

    recommendedModel:
      format.recommendedModel,

    productionRules:
      format.productionRules,

    tags:
      format.tags,

    /*
     * NEW:
     * Format-specific selections.
     */
    options:
      cleanOptions,

    source:
      "trend-engine",

    createdAt:
      new Date().toISOString(),
  };

  /*
   * Preserve any existing
   * settings object.
   */
  const currentSettings =
    project.settings &&
    typeof project.settings ===
      "object" &&
    !Array.isArray(
      project.settings
    )
      ? project.settings
      : {};

  const updatedProject =
    await updateProject(
      project.id,
      {
        niche:
          format.category,

        status:
          "Researching",

        settings: {
          ...currentSettings,

          /*
           * Preferred nested
           * Trend Contract.
           */
          trend:
            trendSettings,

          /*
           * Compatibility fields
           * used by existing Trend
           * Engine code.
           */
          trendFormatId:
            format.id,

          trendFormatTitle:
            format.title,

          topic:
            cleanTopic,

          duration,

          structureFamily:
            format.structureFamily,

          audioMode:
            format.audioMode,

          style:
            format.style,

          recommendedModel:
            format.recommendedModel,

          productionRules:
            format.productionRules,

          /*
           * NEW compatibility
           * value.
           */
          trendOptions:
            cleanOptions,
        },

        /*
         * Make sure a newly
         * created Trend project
         * starts clean.
         */
        research:
          "",

        script:
          "",

        storyboard:
          "",

        scenes:
          [],
      }
    );

  return updatedProject;
}