export const API_ENDPOINTS = {
  articles: "/api/v1/articles",
  articleById: (id: string) => `/api/v1/articles/${id}`,
  articleBySlug: (slug: string) =>
    `/api/v1/articles/slug/${encodeURIComponent(slug)}`,
  articleView: (id: string) => `/api/v1/articles/${id}/view`,
  articleShare: (id: string) => `/api/v1/articles/${id}/share`,
  categories: "/api/v1/categories",
  topics: "/api/v1/topics",
  series: "/api/v1/series",
  newsletters: "/api/v1/newsletters",
  youtubeVideos: "/api/v1/youtube-videos",
} as const;

export const API_TIMEOUT_MS = 15_000;
