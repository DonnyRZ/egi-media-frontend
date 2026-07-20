import type { Article } from "@/shared/types/article.types";
import type { ContentLocale } from "@/shared/types/article.types";

export interface CategoryTranslation {
  name: string;
  slug: string | null;
  description: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CategoryDetail extends Category {
  locale: ContentLocale;
  availableLocales: ContentLocale[];
  translations: Partial<Record<ContentLocale, CategoryTranslation>>;
}

export interface CategoryListResult {
  items: Category[];
  total: number;
}

export interface CategoryNewsGroup {
  category: Category;
  articles: Article[];
}
