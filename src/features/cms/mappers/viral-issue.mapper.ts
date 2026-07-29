import type {
  ViralIssue,
  ViralIssueArticle,
  ViralIssueTimelineEntry,
} from "@/features/cms/types/viral-issue.types";

interface ViralIssueArticleDto {
  id?: string;
  title?: string;
  source?: string;
  sourceLabel?: string;
  source_id?: string;
  publishedAt?: string | null;
  url?: string | null;
}

interface ViralIssueTimelineEntryDto {
  id?: string;
  label?: string;
  at?: string | null;
  detail?: string;
}

export interface ViralIssueDto {
  id?: string;
  title?: string;
  issueTitle?: string;
  mediaCount?: number;
  channelCount?: number;
  articleCount?: number;
  firstSeenAt?: string | null;
  lastDevelopedAt?: string | null;
  summary?: string;
  timeline?: ViralIssueTimelineEntryDto[];
  articles?: ViralIssueArticleDto[];
}

function mapArticle(
  article: ViralIssueArticleDto,
  index: number,
): ViralIssueArticle {
  const sourceLabel =
    article.sourceLabel ?? article.source ?? article.source_id ?? "Unknown";

  return {
    id: article.id ?? `article-${index}`,
    title: article.title ?? "Untitled",
    sourceLabel,
    publishedAt: article.publishedAt ?? "",
    url: article.url ?? "#",
  };
}

function mapTimelineEntry(
  entry: ViralIssueTimelineEntryDto,
  index: number,
): ViralIssueTimelineEntry {
  return {
    id: entry.id ?? `timeline-${index}`,
    label: entry.label ?? "Development",
    at: entry.at ?? "",
    detail: entry.detail ?? "",
  };
}

export function mapViralIssue(dto: ViralIssueDto, index: number): ViralIssue {
  const title = dto.title ?? dto.issueTitle ?? "Untitled issue";
  const articles = (dto.articles ?? []).map(mapArticle);

  return {
    id: dto.id ?? `viral-issue-${index}`,
    title,
    mediaCount: dto.mediaCount ?? dto.channelCount ?? 0,
    articleCount: dto.articleCount ?? articles.length,
    firstSeenAt: dto.firstSeenAt ?? "",
    lastDevelopedAt: dto.lastDevelopedAt ?? "",
    summary: dto.summary ?? "",
    timeline: (dto.timeline ?? []).map(mapTimelineEntry),
    articles,
  };
}
