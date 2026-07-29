export interface ColumnCommentUser {
  id: string;
  fullName: string;
  role: string | null;
}

export interface ColumnComment {
  id: string;
  columnId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  user: ColumnCommentUser;
}

export interface ColumnCommentNode extends ColumnComment {
  replies: ColumnCommentNode[];
}

export interface ColumnCommentListResult {
  items: ColumnComment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateColumnCommentPayload {
  content: string;
  parentId?: string | null;
}
