import type { Article } from "@/shared/types/article.types";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CategoryListResult {
  items: Category[];
  total: number;
}

export interface CategoryNewsGroup {
  category: Category;
  articles: Article[];
}
