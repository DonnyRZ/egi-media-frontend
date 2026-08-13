import type {
  ArticlePlacement,
  ArticleStatus,
  AuditLog,
  CmsArticleDetail,
  CmsArticleListItem,
  CmsProfile,
  CmsUser,
  Tag,
  TranslationStatus,
} from "@/features/cms/types/cms.types";
import { DEFAULT_ARTICLE_PLACEMENTS } from "@/features/cms/constants/cms.constants";
import { resolveResourceTypeLabel } from "@/features/cms/utils/audit-resource";

interface AuthorDto {
  id: string;
  full_name: string;
}

interface CategoryRefDto {
  id: string;
  name: string;
}

function mapPlacements(value: unknown): ArticlePlacement[] {
  if (!Array.isArray(value) || value.length === 0) {
    return [...DEFAULT_ARTICLE_PLACEMENTS];
  }
  return value as ArticlePlacement[];
}

export interface CmsArticleListItemDto {
  id: string;
  title: string;
  slug: string | null;
  summary: string | null;
  featured_image: string | null;
  status: ArticleStatus;
  translation_status?: TranslationStatus | null;
  placements?: ArticlePlacement[] | null;
  headline_position?: number | null;
  published_at: string | null;
  created_at: string;
  updated_at?: string | null;
  view_count?: number | null;
  author: AuthorDto;
  category: CategoryRefDto | null;
}

interface ArticleTranslationDto {
  title?: string | null;
  summary?: string | null;
  content?: string | null;
}

export interface CmsArticleDetailDto {
  id: string;
  title: string;
  summary: string | null;
  content: string;
  featured_image: string | null;
  status: ArticleStatus;
  placements?: ArticlePlacement[] | null;
  headline_position?: number | null;
  published_at: string | null;
  category: { id: string } | null;
  series: { id: string } | null;
  topics?: Array<{ id: string }>;
  tags?: Array<{ id: string }>;
  translations?: Partial<Record<"id" | "en" | "uz", ArticleTranslationDto>>;
}

export interface TagDto {
  id: string;
  name: string;
  slug: string;
}

export interface CmsUserDto {
  id: string;
  email: string;
  full_name: string;
  role: string;
  login_provider?: string | null;
  email_verified_at?: string | null;
  last_login_at?: string | null;
  created_at?: string | null;
}

export interface AuditLogDto {
  id: string;
  user_id: string | null;
  user_full_name?: string | null;
  user_role?: string | null;
  table_name: string | null;
  resource_type?: string | null;
  record_id: string | null;
  action: string | null;
  article_title?: string | null;
  created_at: string | null;
  new_data?: Record<string, unknown> | string | null;
  old_data?: Record<string, unknown> | string | null;
}

export interface CmsProfileDto {
  avatar_url?: string | null;
  bio?: string | null;
  industry?: string | null;
  job_title?: string | null;
  seniority?: string | null;
  company?: string | null;
  country?: string | null;
}

export function mapCmsArticleListItem(
  dto: CmsArticleListItemDto,
): CmsArticleListItem {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    summary: dto.summary,
    featuredImage: dto.featured_image,
    status: dto.status,
    translationStatus: dto.translation_status ?? "none",
    placements: mapPlacements(dto.placements),
    headlinePosition:
      typeof dto.headline_position === "number" ? dto.headline_position : null,
    publishedAt: dto.published_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at ?? null,
    viewCount: dto.view_count ?? 0,
    author: { id: dto.author.id, fullName: dto.author.full_name },
    category: dto.category
      ? { id: dto.category.id, name: dto.category.name }
      : null,
  };
}

function mapTranslation(
  dto: ArticleTranslationDto | undefined,
): { title: string; summary: string; content: string } | null {
  if (!dto) return null;
  const hasContent = Boolean(dto.title || dto.content);
  if (!hasContent) return null;
  return {
    title: dto.title ?? "",
    summary: dto.summary ?? "",
    content: dto.content ?? "",
  };
}

export function mapCmsArticleDetail(dto: CmsArticleDetailDto): CmsArticleDetail {
  return {
    id: dto.id,
    title: dto.title,
    summary: dto.summary,
    content: dto.content ?? "",
    featuredImage: dto.featured_image,
    status: dto.status,
    placements: mapPlacements(dto.placements),
    headlinePosition:
      typeof dto.headline_position === "number" ? dto.headline_position : null,
    publishedAt: dto.published_at,
    categoryId: dto.category?.id ?? null,
    seriesId: dto.series?.id ?? null,
    topicId: dto.topics?.[0]?.id ?? null,
    tagIds: (dto.tags ?? []).map((tag) => tag.id),
    translationEn: mapTranslation(dto.translations?.en),
    translationUz: mapTranslation(dto.translations?.uz),
  };
}

export function mapTag(dto: TagDto): Tag {
  return { id: dto.id, name: dto.name, slug: dto.slug };
}

export function mapCmsUser(dto: CmsUserDto): CmsUser {
  return {
    id: dto.id,
    email: dto.email,
    fullName: dto.full_name,
    role: dto.role,
    loginProvider: dto.login_provider ?? null,
    emailVerifiedAt: dto.email_verified_at ?? null,
    lastLoginAt: dto.last_login_at ?? null,
    createdAt: dto.created_at ?? null,
  };
}

function pickRecordLabel(
  data: Record<string, unknown> | string | null | undefined,
): string | null {
  if (!data) return null;

  let parsed: Record<string, unknown>;
  if (typeof data === "string") {
    try {
      parsed = JSON.parse(data) as Record<string, unknown>;
    } catch {
      return null;
    }
  } else {
    parsed = data;
  }

  if (!parsed || typeof parsed !== "object") return null;
  const candidate =
    parsed.article_title ??
    parsed.title ??
    parsed.name ??
    parsed.full_name ??
    parsed.email;
  return typeof candidate === "string" ? candidate : null;
}

export function mapAuditLog(dto: AuditLogDto): AuditLog {
  const titleFromColumn =
    typeof dto.article_title === "string" && dto.article_title.trim()
      ? dto.article_title.trim()
      : null;

  return {
    id: dto.id,
    userId: dto.user_id,
    actorName: dto.user_full_name ?? null,
    actorRole: dto.user_role ?? null,
    tableName: dto.table_name,
    resourceType: resolveResourceTypeLabel(dto.resource_type, dto.table_name),
    recordId: dto.record_id,
    recordLabel:
      titleFromColumn ??
      pickRecordLabel(dto.new_data) ??
      pickRecordLabel(dto.old_data),
    action: dto.action,
    createdAt: dto.created_at,
  };
}

export function mapCmsProfile(dto: CmsProfileDto | null): CmsProfile {
  return {
    avatarUrl: dto?.avatar_url ?? null,
    bio: dto?.bio ?? null,
    industry: dto?.industry ?? null,
    jobTitle: dto?.job_title ?? null,
    seniority: dto?.seniority ?? null,
    company: dto?.company ?? null,
    country: dto?.country ?? null,
  };
}
