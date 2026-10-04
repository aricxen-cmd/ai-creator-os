import {
  trendFormats,
  type TrendFormat,
} from "./trendFormats";

import {
  trendFormatAdditions,
} from "./trendFormatAdditions";

/*
 * Single source of truth
 * for every Trend format.
 *
 * Existing formats:
 * trendFormats
 *
 * New / experimental formats:
 * trendFormatAdditions
 */
export const trendCatalog: TrendFormat[] =
  [
    ...trendFormats,
    ...trendFormatAdditions,
  ];

/*
 * Find one trend by route ID.
 *
 * Example:
 *
 * getTrendFormat(
 *   "animal-haircut"
 * )
 */
export function getTrendFormat(
  id: string
) {
  return (
    trendCatalog.find(
      (
        trend
      ) =>
        trend.id === id
    ) ?? null
  );
}

/*
 * Categories are generated
 * automatically.
 *
 * This means adding a new
 * category to any Trend Format
 * automatically makes it
 * available to the Trends UI.
 */
export function getTrendCategories() {
  const categories =
    new Set<string>();

  trendCatalog.forEach(
    (
      trend
    ) => {
      categories.add(
        trend.category
      );
    }
  );

  return [
    "All",
    ...Array.from(
      categories
    ).sort(),
  ];
}

export function getHotTrends() {
  return trendCatalog.filter(
    (
      trend
    ) =>
      trend.isHot
  );
}

export function getNewTrends() {
  return trendCatalog.filter(
    (
      trend
    ) =>
      trend.isNew
  );
}

export function searchTrendCatalog(
  query: string
) {
  const search =
    query
      .trim()
      .toLowerCase();

  if (!search) {
    return trendCatalog;
  }

  return trendCatalog.filter(
    (
      trend
    ) => {
      const searchable =
        [
          trend.title,
          trend.description,
          trend.category,
          trend.style,
          trend.structureFamily,
          trend.audioMode,
          trend.recommendedModel,
          ...trend.tags,
        ]
          .join(" ")
          .toLowerCase();

      return searchable.includes(
        search
      );
    }
  );
}

export type {
  TrendFormat,
};