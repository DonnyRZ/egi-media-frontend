import type { ContentLocale } from "@/shared/types/article.types";
export interface CategoryEditorial {
  curated?: {
    lead_id: string | null;
    supporting_ids: string[];
    editor_ids: string[];
  };
  category_id: string;
  lead_id: string | null;
  supporting_ids: string[];
  editor_ids: string[];
  topics: { id: string; name: string; slug: string }[];
}
export interface MediaResource {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  poster_url?: string | null;
  format?: "horizontal" | "short";
  is_active: boolean;
  sort_order: number;
  video_ids?: string[];
  translations?: Partial<
    Record<ContentLocale, { name: string; description?: string | null }>
  >;
}
export interface MediaResourceWrite {
  name: string;
  slug: string;
  description?: string;
  poster_url?: string | null;
  format?: "horizontal" | "short";
  is_active: boolean;
  sort_order: number;
  video_ids?: string[];
  translations?: Partial<
    Record<"en" | "uz", { name: string; description?: string }>
  >;
}
