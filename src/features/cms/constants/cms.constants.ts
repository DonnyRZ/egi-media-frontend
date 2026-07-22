import type { ArticleStatus, CmsRole } from "@/features/cms/types/cms.types";

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
    archived: [],
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
    list: (params: object) =>
      ["cms", "audit-logs", params] as const,
  },
  dashboard: { all: ["cms", "dashboard"] as const },
  videos: {
    all: ["cms", "videos"] as const,
    list: (params: object) => ["cms", "videos", "list", params] as const,
  },
  account: { profile: ["cms", "account", "profile"] as const },
} as const;
