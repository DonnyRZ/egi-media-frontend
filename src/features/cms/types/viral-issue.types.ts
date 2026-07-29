export interface ViralIssueArticle {
  id: string;
  title: string;
  sourceLabel: string;
  publishedAt: string;
  url: string;
}

export interface ViralIssueTimelineEntry {
  id: string;
  label: string;
  at: string;
  detail: string;
}

export interface ViralIssue {
  id: string;
  title: string;
  mediaCount: number;
  articleCount: number;
  firstSeenAt: string;
  lastDevelopedAt: string;
  summary: string;
  timeline: ViralIssueTimelineEntry[];
  articles: ViralIssueArticle[];
}
