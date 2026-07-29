export interface CrawledArticle {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  featuredImage: string | null;
  publishedAt: string | null;
  authorName: string | null;
  sourceUrl: string | null;
  category: string | null;
  tags: string[];
  language: string | null;
  sourceId: string;
  sourceLabel: string;
  collectedAt: string | null;
}

export interface CrawledArticlesResult {
  items: CrawledArticle[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface CrawledArticlesParams {
  page: number;
  limit: number;
  source?: string;
  search?: string;
}
