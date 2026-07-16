export interface ApiSuccessResponse<T> {
  success: boolean;
  message: string;
  code: number;
  data: T;
}

export interface PaginatedMeta {
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginatedMeta;
}

export type ArticleSort = "latest" | "oldest" | "popular";

export interface ArticleListParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: string;
  topic_id?: string;
  tag_id?: string;
  author_id?: string;
  series_id?: string;
  sort?: ArticleSort;
}

export interface SeriesListParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface NewsletterListParams {
  page?: number;
  limit?: number;
}

export interface YoutubeVideoListParams {
  page?: number;
  limit?: number;
}
