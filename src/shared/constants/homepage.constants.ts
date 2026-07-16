export const HOMEPAGE_LIMITS = {
  heroFeatured: 1,
  heroHeadlines: 4,
  breakingNews: 8,
  latestNews: 9,
  editorsPicks: 6,
  featuredSeries: 6,
  featuredVideos: 6,
} as const;

export const QUERY_STALE_TIME = {
  homepage: 5 * 60 * 1000,
} as const;

export const QUERY_GC_TIME = {
  homepage: 10 * 60 * 1000,
} as const;
