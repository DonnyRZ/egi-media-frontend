export interface Series {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  articleCount: number;
  coverImage: string | null;
}

export interface SeriesListResult {
  items: Series[];
  total: number;
}
