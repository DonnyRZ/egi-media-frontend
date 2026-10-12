export interface YoutubeVideo {
  format?: "horizontal" | "short";
  posterLandscape?: string | null;
  posterPortrait?: string | null;
  categoryId?: string | null;
  programId?: string | null;
  episodeNumber?: number | null;
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  durationLabel: string | null;
  publishedAt: string | null;
}

export interface YoutubeVideoListResult {
  items: YoutubeVideo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
