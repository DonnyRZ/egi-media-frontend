import type {
  ColumnComment,
  ColumnCommentListResult,
  ColumnCommentNode,
} from "@/features/columns/types/column-comment.types";

interface ColumnCommentUserDto {
  id: string;
  full_name: string;
  role?: string | null;
}

interface ColumnCommentDto {
  id: string;
  column_id: string;
  parent_id?: string | null;
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
    parentId: dto.parent_id ?? null,
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

export function buildCommentTree(comments: ColumnComment[]): ColumnCommentNode[] {
  const nodes = new Map<string, ColumnCommentNode>();

  for (const comment of comments) {
    nodes.set(comment.id, { ...comment, replies: [] });
  }

  const roots: ColumnCommentNode[] = [];

  for (const comment of comments) {
    const node = nodes.get(comment.id);
    if (!node) continue;

    if (comment.parentId && nodes.has(comment.parentId)) {
      nodes.get(comment.parentId)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
}
