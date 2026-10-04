export type ExplorePlatform =
  | "TikTok"
  | "YouTube Shorts"
  | "Instagram Reels";

export type ExploreCategory =
  | "Brainrot"
  | "Animals"
  | "Stories"
  | "Science"
  | "Transformations"
  | "Fitness"
  | "Cars"
  | "Factory"
  | "Motivation"
  | "Educational";

export interface ExploreItem {
  id: string;

  title: string;

  description: string;

  category: ExploreCategory;

  platforms: ExplorePlatform[];

  duration: string;

  style: string;

  trendFormatId: string;

  tags: string[];

  thumbnailUrl?: string;

  videoUrl?: string;

  prompt?: string;

  views?: number;

  likes?: number;

  featured?: boolean;

  trending?: boolean;

  new?: boolean;
}

export interface ExploreFilters {
  search: string;

  category:
    | ExploreCategory
    | "All";

  platform:
    | ExplorePlatform
    | "All";

  sort:
    | "Trending"
    | "Newest"
    | "Popular";
}