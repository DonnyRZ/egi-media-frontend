export type CmsRole = "superadmin" | "author";

export type ArticleStatus =
  | "draft"
  | "review"
  | "scheduled"
  | "published"
  | "archived";

export interface CmsArticleListItem {
  id: string;
  title: string;
  slug: string | null;
  summary: string | null;
  featuredImage: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  author: { id: string; fullName: string };
  category: { id: string; name: string } | null;
}

export type ContentLocale = "id" | "en" | "uz";

export interface ArticleTranslation {
  title: string;
  summary: string;
  content: string;
}

export interface CmsArticleListResult {
  items: CmsArticleListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CmsArticleDetail {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  featuredImage: string | null;
  status: ArticleStatus;
  publishedAt: string | null;
  categoryId: string | null;
  seriesId: string | null;
  topicIds: string[];
  tagIds: string[];
  /** Optional en/uz translations (id lives in the base fields above). */
  translationEn: ArticleTranslation | null;
  translationUz: ArticleTranslation | null;
}

export interface ArticleWritePayload {
  title: string;
  content: string;
  summary?: string | null;
  featuredImage?: string | null;
  categoryId?: string | null;
  seriesId?: string | null;
  status?: ArticleStatus;
  publishedAt?: string | null;
  topicIds?: string[];
  tagIds?: string[];
  /** en/uz translations; each locale is only sent when it has content. */
  translations?: Partial<Record<"en" | "uz", ArticleTranslation>>;
}

export interface CmsMyArticlesParams {
  page?: number;
  limit?: number;
  status?: ArticleStatus | "";
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface CmsUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  loginProvider: string | null;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string | null;
}

export interface CmsUserListResult {
  items: CmsUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  actorName: string | null;
  tableName: string | null;
  recordId: string | null;
  /** Human-friendly label of the affected record (e.g. article title). */
  recordLabel: string | null;
  action: string | null;
  createdAt: string | null;
}

export interface CmsProfile {
  avatarUrl: string | null;
  bio: string | null;
  industry: string | null;
  jobTitle: string | null;
  seniority: string | null;
  company: string | null;
  country: string | null;
}

export interface DashboardStats {
  total: number;
  draft: number;
  review: number;
  scheduled: number;
  published: number;
  archived: number;
}
