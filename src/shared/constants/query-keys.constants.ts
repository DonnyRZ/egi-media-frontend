export const QUERY_KEYS = {
  articles: {
    all: ["articles"] as const,
    list: (params: Record<string, unknown>) => ["articles", "list", params] as const,
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
  homepage: {
    all: ["homepage"] as const,
  },
} as const;
