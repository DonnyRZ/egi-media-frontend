import type {
  ColumnAuthor,
  ColumnDetail,
  ColumnListItem,
  ColumnListResult,
  ColumnStatus,
  ColumnTranslation,
  ColumnTranslationStatus,
} from "@/features/columns/types/column.types";
import { resolveImageUrl } from "@/shared/utils/image";

interface ColumnAuthorDto {
  id: string;
  full_name: string;
  role?: string | null;
  email?: string | null;
}

interface ColumnListItemDto {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featured_image?: string | null;
  status: ColumnStatus;
  translation_status?: ColumnTranslationStatus | null;
  rejection_reason?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at?: string;
  saved_at?: string | null;
  author: ColumnAuthorDto;
}

interface ColumnDetailDto extends ColumnListItemDto {
  content: string;
  translations?: Partial<
    Record<"id" | "en" | "uz", {
      title: string;
      slug?: string | null;
      summary?: string | null;
      content: string;
    }>
  >;
  view_count?: number;
  share_count?: number;
}

interface ColumnListResponseDto {
  items: ColumnListItemDto[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    total_pages?: number;
  };
}

function mapAuthor(dto: ColumnAuthorDto): ColumnAuthor {
  return {
    id: dto.id,
    fullName: dto.full_name,
    email: dto.email ?? null,
    role: dto.role ?? null,
  };
}

function mapTranslation(entry: {
  title: string;
  summary?: string | null;
  content: string;
}): ColumnTranslation {
  return {
    title: entry.title,
    summary: entry.summary ?? null,
    content: entry.content,
  };
}

export function mapColumnListItemDto(dto: ColumnListItemDto): ColumnListItem {
  return {
    id: dto.id,
    title: dto.title,
    slug: dto.slug,
    summary: dto.summary,
    featuredImage: resolveImageUrl(dto.featured_image ?? null, dto.id),
    status: dto.status,
    translationStatus: dto.translation_status ?? "none",
    rejectionReason: dto.rejection_reason ?? null,
    publishedAt: dto.published_at ?? null,
    createdAt: dto.created_at,
    author: mapAuthor(dto.author),
    savedAt: dto.saved_at ?? null,
  };
}

export function mapColumnDetailDto(dto: ColumnDetailDto): ColumnDetail {
  const translations: ColumnDetail["translations"] = {};
  if (dto.translations) {
    for (const locale of ["id", "en", "uz"] as const) {
      const entry = dto.translations[locale];
      if (entry?.title && entry.content) {
        translations[locale] = mapTranslation(entry);
      }
    }
  }

  return {
    ...mapColumnListItemDto(dto),
    content: dto.content,
    translations,
    viewCount: dto.view_count ?? 0,
    shareCount: dto.share_count ?? 0,
  };
}

export function mapColumnListDto(dto: ColumnListResponseDto): ColumnListResult {
  const items = Array.isArray(dto?.items) ? dto.items : [];
  const total = dto.meta?.total ?? 0;
  const limit = dto.meta?.limit ?? items.length;
  const page = dto.meta?.page ?? 1;

  return {
    items: items.map(mapColumnListItemDto),
    total,
    page,
    limit,
    totalPages:
      dto.meta?.total_pages ?? (limit > 0 ? Math.ceil(total / limit) : 0),
  };
}
