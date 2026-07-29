export interface SeriesParentTopic {
  id: string;
  name: string;
  slug: string;
}

export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  coverImage: string | null;
  publishedAt: string | null;
  topicId: string | null;
  topic: SeriesParentTopic | null;
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

export interface SeriesTopicGroup {
  topic: SeriesParentTopic | null;
  items: Series[];
}
