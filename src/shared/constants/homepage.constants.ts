export const HOMEPAGE_LIMITS = {
  heroFeatured: 1,
  heroHeadlines: 3,
  breakingNews: 4,
  latestNews: 6,
  editorsPicks: 6,
  featuredSeries: 3,
  featuredVideos: 6,
  categoryGroups: 3,
  categoryArticles: 2,
  topicGroups: 3,
  topicArticles: 2,
  taxonomyCandidates: 16,
  taxonomyFetchLimit: 12,
  articlePool: 40,
} as const;

/** Placement tags used by the public homepage sections. */
export const HOMEPAGE_PLACEMENTS = {
  hero: "homepage_hero",
  headline: "headline",
  trending: "trending",
  latestNews: "latest_news",
} as const;

export const QUERY_STALE_TIME = {
  homepage: 5 * 60 * 1000,
} as const;

export const QUERY_GC_TIME = {
  homepage: 10 * 60 * 1000,
} as const;
