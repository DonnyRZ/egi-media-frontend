import type {
  SavedArticle,
  SavedArticleListResult,
} from "@/features/saved-articles/types/saved-article.types";
import {
  mapArticleDto,
  type ArticleListItemDto,
} from "@/shared/mappers/article.mapper";

export interface SavedArticleDto extends ArticleListItemDto {
  saved_at?: string | null;
}

interface SavedArticleListResponseDto {
  items: SavedArticleDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export function mapSavedArticle(dto: SavedArticleDto): SavedArticle {
  return {
    ...mapArticleDto(dto),
    savedAt: dto.saved_at ?? null,
  };
}

export function mapSavedArticleList(
  dto: SavedArticleListResponseDto,
): SavedArticleListResult {
  return {
    items: dto.items.map(mapSavedArticle),
    total: dto.meta.total,
    page: dto.meta.page,
    limit: dto.meta.limit,
    totalPages: dto.meta.total_pages,
  };
}
