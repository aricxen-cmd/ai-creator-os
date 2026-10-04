import {
  createProject,
} from "@/lib/supabase/projects";

import {
  updateProject,
} from "@/lib/supabase/updateProject";

import type {
  ExploreItem,
  ExplorePlatform,
} from "../types";

export interface CreateExploreProjectInput {
  item: ExploreItem;

  title: string;

  topic: string;

  duration: string;

  platform: ExplorePlatform;
}

export async function createExploreProject({
  item,
  title,
  topic,
  duration,
  platform,
}: CreateExploreProjectInput) {
  const cleanTitle =
    title.trim() ||
    topic.trim() ||
    item.title;

  const cleanTopic =
    topic.trim() ||
    cleanTitle;

  const project =
    await createProject(
      cleanTitle,
      `Created from Explore format: ${item.title}`
    );

  const existingSettings =
    project.settings &&
    typeof project.settings ===
      "object" &&
    !Array.isArray(
      project.settings
    )
      ? project.settings
      : {};

  const productionRules = [
    `Use the ${item.title} Explore format.`,
    `Topic: ${cleanTopic}.`,
    `Target duration: ${duration}.`,
    `Primary platform: ${platform}.`,
    `Visual style: ${item.style}.`,
    `Content category: ${item.category}.`,
    ...(item.prompt
      ? [
          item.prompt,
        ]
      : []),
  ];

  const updatedProject =
    await updateProject(
      project.id,
      {
        title:
          cleanTitle,

        description:
          `Remix of ${item.title}: ${cleanTopic}`,

        niche:
          item.category,

        status:
          "Researching",

        settings: {
          ...existingSettings,

          source:
            "explore",

          exploreItemId:
            item.id,

          exploreItemTitle:
            item.title,

          trendFormatId:
            item.trendFormatId,

          trendFormatTitle:
            item.title,

          topic:
            cleanTopic,

          duration,

          style:
            item.style,

          platform,

          structureFamily:
            item.trendFormatId,

          productionRules,

          exploreTags:
            item.tags,
        },
      }
    );

  return (
    updatedProject ??
    project
  );
}