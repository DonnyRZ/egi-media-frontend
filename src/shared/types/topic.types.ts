import type { Article } from "@/shared/types/article.types";

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface TopicListResult {
  items: Topic[];
  total: number;
}

export interface TopicNewsGroup {
  topic: Topic;
  articles: Article[];
}
