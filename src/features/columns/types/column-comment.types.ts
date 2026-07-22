export interface ColumnCommentUser {
  id: string;
  fullName: string;
  role: string | null;
}

export interface ColumnComment {
  id: string;
  columnId: string;
  content: string;
  createdAt: string;
  user: ColumnCommentUser;
}

export interface ColumnCommentListResult {
  items: ColumnComment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
