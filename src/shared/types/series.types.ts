export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  coverImage: string | null;
  publishedAt: string | null;
}

export interface SeriesListResult {
  items: Series[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SeriesDetail extends Series {
  articles: import("@/shared/types/article.types").Article[];
}
