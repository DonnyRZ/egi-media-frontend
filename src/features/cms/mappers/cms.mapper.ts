import type {
  ArticleStatus,
  AuditLog,
  CmsArticleDetail,
  CmsArticleListItem,
  CmsProfile,
  CmsUser,
  Tag,
} from "@/features/cms/types/cms.types";

interface AuthorDto {
  id: string;
  full_name: string;
}

interface CategoryRefDto {
  id: string;
  name: string;
}

export interface CmsArticleListItemDto {
  id: string;
  title: string;
  slug: string | null;
  summary: string | null;
  featured_image: string | null;
  status: ArticleStatus;
  published_at: string | null;
  created_at: string;
  updated_at?: string | null;
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
  table_name: string | null;
  record_id: string | null;
  action: string | null;
  created_at: string | null;
  new_data?: Record<string, unknown> | null;
  old_data?: Record<string, unknown> | null;
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
    publishedAt: dto.published_at,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at ?? null,
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
    publishedAt: dto.published_at,
    categoryId: dto.category?.id ?? null,
    seriesId: dto.series?.id ?? null,
    topicIds: (dto.topics ?? []).map((topic) => topic.id),
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
  data: Record<string, unknown> | null | undefined,
): string | null {
  if (!data) return null;
  const candidate = data.title ?? data.name ?? data.full_name ?? data.email;
  return typeof candidate === "string" ? candidate : null;
}

export function mapAuditLog(dto: AuditLogDto): AuditLog {
  return {
    id: dto.id,
    userId: dto.user_id,
    actorName: dto.user_full_name ?? null,
    tableName: dto.table_name,
    recordId: dto.record_id,
    recordLabel: pickRecordLabel(dto.new_data) ?? pickRecordLabel(dto.old_data),
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
