export const QUERY_KEYS = {
  articles: {
    all: ["articles"] as const,
    list: (params: Record<string, unknown>) => ["articles", "list", params] as const,
  },
  categories: {
    all: ["categories"] as const,
    list: (params: Record<string, unknown>) => ["categories", "list", params] as const,
  },
  topics: {
    all: ["topics"] as const,
    list: (params: Record<string, unknown>) => ["topics", "list", params] as const,
  },
  series: {
    all: ["series"] as const,
    list: (params: Record<string, unknown>) => ["series", "list", params] as const,
  },
  youtubeVideos: {
    all: ["youtube-videos"] as const,
    list: (params: Record<string, unknown>) => ["youtube-videos", "list", params] as const,
  },
  newsletters: {
    all: ["newsletters"] as const,
    list: (params: Record<string, unknown>) => ["newsletters", "list", params] as const,
  },
  savedArticles: {
    all: ["saved-articles"] as const,
    list: (params: Record<string, unknown>) =>
      ["saved-articles", "list", params] as const,
  },
  savedColumns: {
    all: ["saved-columns"] as const,
    list: (params: Record<string, unknown>) =>
      ["saved-columns", "list", params] as const,
  },
  homepage: {
    all: ["homepage"] as const,
    news: (lang: string) => ["homepage", "news", lang] as const,
  },
  notifications: {
    all: ["notifications"] as const,
    list: (params: Record<string, unknown>) =>
      ["notifications", "list", params] as const,
  },
  columns: {
    all: ["columns"] as const,
    list: (params: Record<string, unknown>) =>
      ["columns", "list", params] as const,
    detail: (slug: string, lang: string) =>
      ["columns", "detail", slug, lang] as const,
    mine: (params: Record<string, unknown>) =>
      ["columns", "me", params] as const,
    mineDetail: (id: string, lang: string) =>
      ["columns", "me", "detail", id, lang] as const,
    comments: (columnId: string, params: Record<string, unknown>) =>
      ["columns", "comments", columnId, params] as const,
  },
} as const;
