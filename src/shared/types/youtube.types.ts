export interface YoutubeVideo {
  id: string;
  title: string;
  description: string | null;
  url: string;
  thumbnailUrl: string | null;
  durationLabel: string | null;
}

export interface YoutubeVideoListResult {
  items: YoutubeVideo[];
  total: number;
}
