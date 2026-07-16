export interface ArticleAuthor {
  id: string;
  fullName: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
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
}

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
