import type { Article } from "@/shared/types/article.types";
import type { ContentLocale } from "@/shared/types/article.types";

export interface TopicTranslation {
  name: string;
  slug: string | null;
  description: string | null;
}

export interface TopicParentCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  categoryId: string | null;
  category: TopicParentCategory | null;
}

export interface TopicDetail extends Topic {
  locale: ContentLocale;
  availableLocales: ContentLocale[];
  translations: Partial<Record<ContentLocale, TopicTranslation>>;
}

export interface TopicListResult {
  items: Topic[];
  total: number;
}

export interface TopicNewsGroup {
  topic: Topic;
  articles: Article[];
}

export interface TopicCategoryGroup {
  category: TopicParentCategory | null;
  items: Topic[];
}
