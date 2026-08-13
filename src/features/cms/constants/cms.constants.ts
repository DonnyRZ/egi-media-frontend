import type {
  ArticlePlacement,
  ArticleStatus,
  CmsRole,
} from "@/features/cms/types/cms.types";

export const CMS_BASE_PATH = "/cms";

export const CMS_THEME_STORAGE_KEY = "cms_theme";

export const CMS_ROLES = {
  superadmin: "superadmin",
  author: "author",
} as const;

/** Roles allowed to sign in to the Editorial CMS. */
export const CMS_ALLOWED_ROLES: CmsRole[] = ["superadmin", "author"];

export const ARTICLE_STATUSES: ArticleStatus[] = [
  "draft",
  "review",
  "scheduled",
  "published",
  "archived",
];

export const ARTICLE_PLACEMENTS: ArticlePlacement[] = [
  "latest_news",
  "homepage_hero",
  "headline",
  "trending",
];

export const DEFAULT_ARTICLE_PLACEMENTS: ArticlePlacement[] = ["latest_news"];

export const ARTICLE_PLACEMENT_META: Record<
  ArticlePlacement,
  { label: string; shortLabel: string; tone: "neutral" | "info" | "warning" | "success" }
> = {
  latest_news: { label: "Latest News", shortLabel: "Latest", tone: "neutral" },
  homepage_hero: { label: "Homepage Hero", shortLabel: "Hero", tone: "info" },
  headline: { label: "Headline", shortLabel: "Headline", tone: "warning" },
  trending: { label: "Trending", shortLabel: "Trending", tone: "success" },
};

/**
 * Status transitions allowed by the backend
 * (see article command domain `ALLOWED_TRANSITIONS`). Kept in sync so the UI
 * only offers actions the API will accept.
 */
export const ALLOWED_STATUS_TRANSITIONS: Record<ArticleStatus, ArticleStatus[]> =
  {
    draft: ["review", "scheduled", "published"],
    review: ["published", "draft"],
    scheduled: ["published", "draft"],
    published: ["archived"],
    archived: ["draft", "published"],
  };

export const ARTICLE_STATUS_META: Record<
  ArticleStatus,
  { label: string; tone: "neutral" | "info" | "warning" | "success" | "muted" }
> = {
  draft: { label: "Draft", tone: "neutral" },
  review: { label: "In Review", tone: "info" },
  scheduled: { label: "Scheduled", tone: "warning" },
  published: { label: "Published", tone: "success" },
  archived: { label: "Archived", tone: "muted" },
};

/**
 * Label + icon for the action of transitioning an article TO a given status.
 * Icon names map to `Icons` in the UI layer.
 */
export const STATUS_ACTION_META: Record<
  ArticleStatus,
  { label: string; icon: "undo" | "send" | "clock" | "check" | "archive" }
> = {
  draft: { label: "Move to Draft", icon: "undo" },
  review: { label: "Submit for Review", icon: "send" },
  scheduled: { label: "Schedule", icon: "clock" },
  published: { label: "Publish", icon: "check" },
  archived: { label: "Archive", icon: "archive" },
};

/** Transitions an author is allowed to trigger (submit for review / revert). */
export const AUTHOR_ALLOWED_TRANSITIONS: ArticleStatus[] = ["review", "draft"];

export const CMS_DEFAULT_PAGE_SIZE = 10;

export const CMS_QUERY_KEYS = {
  articles: {
    all: ["cms", "articles"] as const,
    list: (params: object) =>
      ["cms", "articles", "list", params] as const,
    detail: (id: string) => ["cms", "articles", "detail", id] as const,
  },
  categories: { all: ["cms", "categories"] as const },
  topics: { all: ["cms", "topics"] as const },
  tags: { all: ["cms", "tags"] as const },
  series: { all: ["cms", "series"] as const },
  taxonomy: {
    categories: ["cms", "taxonomy", "categories"] as const,
    topics: ["cms", "taxonomy", "topics"] as const,
    series: ["cms", "taxonomy", "series"] as const,
    tags: ["cms", "taxonomy", "tags"] as const,
    articles: (kind: string, id: string) =>
      ["cms", "taxonomy", "articles", kind, id] as const,
  },
  users: {
    all: ["cms", "users"] as const,
    list: (params: object) =>
      ["cms", "users", "list", params] as const,
  },
  auditLogs: {
    all: ["cms", "audit-logs"] as const,
    list: (params: object) =>
      ["cms", "audit-logs", "list", params] as const,
  },
  dashboard: { all: ["cms", "dashboard"] as const },
  videos: {
    all: ["cms", "videos"] as const,
    list: (params: object) => ["cms", "videos", "list", params] as const,
  },
  socialMediaLinks: {
    all: ["cms", "social-media-links"] as const,
    list: (params: object) =>
      ["cms", "social-media-links", "list", params] as const,
  },
  teamMembers: {
    all: ["cms", "team-members"] as const,
    list: (params: object) =>
      ["cms", "team-members", "list", params] as const,
  },
  ads: {
    all: ["cms", "ads"] as const,
    list: (params: object) => ["cms", "ads", "list", params] as const,
  },
  newsFeed: {
    all: ["cms", "news-feed"] as const,
    list: (params: object) => ["cms", "news-feed", "list", params] as const,
    viral: (windowHours: number) => ["cms", "news-feed", "viral", windowHours] as const,
  },
  topicSubscriptions: {
    stats: ["cms", "topic-subscriptions", "stats"] as const,
    subscribers: (topicId: string) =>
      ["cms", "topic-subscriptions", "subscribers", topicId] as const,
  },
  account: { profile: ["cms", "account", "profile"] as const },
  translationJobs: {
    all: ["cms", "translation-jobs"] as const,
    list: () => ["cms", "translation-jobs", "list"] as const,
  },
} as const;
