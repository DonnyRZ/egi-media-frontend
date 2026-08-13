export type ColumnStatus =
  | "draft"
  | "pending_approval"
  | "rejected"
  | "published"
  | "archived";

export type ColumnTranslationStatus =
  | "none"
  | "pending"
  | "processing"
  | "ready"
  | "failed";

export interface ColumnAuthor {
  id: string;
  fullName: string;
  email?: string | null;
  role: string | null;
}

export interface ColumnTranslation {
  title: string;
  summary: string | null;
  content: string;
}

export interface ColumnListItem {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  featuredImage: string | null;
  status: ColumnStatus;
  translationStatus: ColumnTranslationStatus;
  rejectionReason: string | null;
  publishedAt: string | null;
  createdAt: string;
  author: ColumnAuthor;
  savedAt?: string | null;
}

export interface ColumnDetail extends ColumnListItem {
  content: string;
  translations: Partial<Record<"id" | "en" | "uz", ColumnTranslation>>;
  viewCount: number;
  shareCount: number;
}

export interface ColumnListResult {
  items: ColumnListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ColumnWritePayload {
  title: string;
  content: string;
  summary?: string | null;
  featured_image?: string | null;
  status?: "draft" | "pending_approval";
  translations?: Partial<Record<"en" | "uz", ColumnTranslation>>;
}

export interface ColumnListParams {
  page?: number;
  limit?: number;
  search?: string;
  author_id?: string;
  sort?: "latest" | "oldest";
  lang?: "id" | "en" | "uz";
}

export interface MyColumnsParams {
  page?: number;
  limit?: number;
  status?: ColumnStatus;
  lang?: "id" | "en" | "uz";
}
