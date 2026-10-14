export interface ViralIssueArticle {
  id: string;
  title: string;
  sourceLabel: string;
  publishedAt: string;
  url: string;
  evidenceQuality?: string;
  angleId?: string;
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
  score?: number;
  components?: { breadth: number; momentum: number; freshness: number };
  groupCount?: number;
  trend?: string;
  confidence?: string;
  evidenceQuality?: string;
  recommendation?: string;
  reasons?: string[];
  angles?: { id: string; title: string; articleCount: number }[];
}

export interface RadarSource {
  id: string; label: string; group: string; active: boolean; reason: string;
  ownershipVerified?: boolean;
  channels: { id: string; desks: string[]; coverage?: string }[];
}
export interface RadarMeta {
  availability?: string; algorithmVersion?: string; cohortVersion?: string;
  asOf?: string | null; finishedAt?: string | null; runId?: string | null;
  eligibleCount?: number; processedCount?: number; inputComplete?: boolean;
  shadow?: boolean; enabled?: boolean; stale?: boolean; sources?: RadarSource[];
}
export interface RadarStatus extends RadarMeta {
  health?: { source_id: string; channel: string; state: string; reason?: string; complete: boolean; last_success_at?: string }[];
  message?: string;
  attempts?: {source_id: string; attempts: number; succeeded: number; blocked: number; retry_scheduled: number}[];
  pending?: {source_id: string; status: string; count: number}[];
}
