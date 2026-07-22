import type {
  ColumnComment,
  ColumnCommentListResult,
} from "@/features/columns/types/column-comment.types";

interface ColumnCommentUserDto {
  id: string;
  full_name: string;
  role?: string | null;
}

interface ColumnCommentDto {
  id: string;
  column_id: string;
  content: string;
  created_at: string;
  updated_at?: string;
  user: ColumnCommentUserDto;
}

interface ColumnCommentListResponseDto {
  items: ColumnCommentDto[];
  meta: {
    total: number;
    page?: number;
    limit?: number;
    total_pages?: number;
  };
}

export function mapColumnCommentDto(dto: ColumnCommentDto): ColumnComment {
  return {
    id: dto.id,
    columnId: dto.column_id,
    content: dto.content,
    createdAt: dto.created_at,
    user: {
      id: dto.user.id,
      fullName: dto.user.full_name,
      role: dto.user.role ?? null,
    },
  };
}

export function mapColumnCommentListDto(
  dto: ColumnCommentListResponseDto,
): ColumnCommentListResult {
  const items = Array.isArray(dto?.items) ? dto.items : [];
  const total = dto.meta?.total ?? 0;
  const limit = dto.meta?.limit ?? items.length;
  const page = dto.meta?.page ?? 1;

  return {
    items: items.map(mapColumnCommentDto),
    total,
    page,
    limit,
    totalPages:
      dto.meta?.total_pages ?? (limit > 0 ? Math.ceil(total / limit) : 0),
  };
}
