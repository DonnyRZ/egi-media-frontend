export interface ArticleAuthor {
  id: string;
  fullName: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
}

export type ContentLocale = "id" | "en" | "uz";

export interface ArticleTranslation {
  title: string;
  slug: string | null;
  summary: string | null;
  content: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  author: ArticleAuthor;
  category: ArticleCategory | null;
  readingTimeMinutes: number;
  locale: ContentLocale;
  availableLocales: ContentLocale[];
}

export interface ArticleDetail extends Article {
  content: string;
  viewCount: number;
  shareCount: number;
  defaultLocale: ContentLocale;
  requestedLocale: ContentLocale;
  translations: Partial<Record<ContentLocale, ArticleTranslation>>;
}

export type SharePlatform =
  | "twitter"
  | "facebook"
  | "whatsapp"
  | "telegram"
  | "copy_link";

export interface ArticleListResult {
  items: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HeroNewsData {
  featured: Article | null;
  headlines: Article[];
}
