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
  topicSubscriptions: {
    all: ["topic-subscriptions"] as const,
    catalog: (lang: string) => ["topic-subscriptions", "catalog", lang] as const,
    mine: (lang: string) => ["topic-subscriptions", "mine", lang] as const,
  },
  personalizedFeed: {
    all: ["personalized-feed"] as const,
    list: (params: Record<string, unknown>) =>
      ["personalized-feed", "list", params] as const,
  },
  series: {
    all: ["series"] as const,
    list: (params: Record<string, unknown>) => ["series", "list", params] as const,
  },
  youtubeVideos: {
    all: ["youtube-videos"] as const,
    list: (params: Record<string, unknown>) => ["youtube-videos", "list", params] as const,
  },
  socialMediaLinks: {
    all: ["social-media-links"] as const,
    active: () => ["social-media-links", "active"] as const,
  },
  teamMembers: {
    all: ["team-members"] as const,
    active: () => ["team-members", "active"] as const,
  },
  ads: {
    all: ["ads"] as const,
    byPlacement: (placement: string) => ["ads", "placement", placement] as const,
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
    highlights: (lang: string) => ["homepage", "highlights", lang] as const,
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
    manage: (params: Record<string, unknown>) =>
      ["columns", "manage", params] as const,
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
