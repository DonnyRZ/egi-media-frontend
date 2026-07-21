import type { Article } from "@/shared/types/article.types";

export interface SavedArticle extends Article {
  savedAt: string | null;
}

export interface SavedArticleListResult {
  items: SavedArticle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SavedArticleListParams {
  page?: number;
  limit?: number;
}
