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
  featuredImageAlt?: string | null;
  featuredImageCaption?: string | null;
  featuredImageCredit?: string | null;

  publishedAt: string | null;
  author: ArticleAuthor;
  category: ArticleCategory | null;
  readingTimeMinutes: number | null;
  locale: ContentLocale;
  availableLocales: ContentLocale[];
  /** Curated Top Stories slot (1-5) when present. */
  headlinePosition?: number | null;
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
  latest?: Article[];
}
