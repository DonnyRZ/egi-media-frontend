import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
} from "@/shared/types/api.types";
import { mapTag, type TagDto } from "@/features/cms/mappers/cms.mapper";
import type { Tag } from "@/features/cms/types/cms.types";

export interface TaxonomyWritePayload {
  name: string;
  description?: string | null;
}

export interface SeriesWritePayload {
  name: string;
  description?: string | null;
  image?: string | null;
}

export interface CmsTaxonomyItem {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  articleCount: number;
}

interface TaxonomyItemDto {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  article_count?: number | null;
}

async function fetchTaxonomyList(
  endpoint: string,
): Promise<CmsTaxonomyItem[]> {
  const response = await axiosClient.get<PaginatedApiResponse<TaxonomyItemDto>>(
    endpoint,
    { params: { limit: 100 } },
  );
  return (response.data.data ?? []).map((dto) => ({
    id: dto.id,
    name: dto.name,
    slug: dto.slug ?? null,
    description: dto.description ?? null,
    image: dto.image ?? null,
    articleCount: dto.article_count ?? 0,
  }));
}

export const fetchCmsCategories = () =>
  fetchTaxonomyList(API_ENDPOINTS.categories);
export const fetchCmsTopics = () => fetchTaxonomyList(API_ENDPOINTS.topics);
export const fetchCmsSeries = () => fetchTaxonomyList(API_ENDPOINTS.series);
export const fetchCmsTags = () => fetchTaxonomyList(API_ENDPOINTS.tags);

// ─── Categories ───────────────────────────────────────────────────────────────
export async function createCategory(
  payload: TaxonomyWritePayload,
): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.categories, {
    name: payload.name,
    description: payload.description ?? "",
  });
}

export async function updateCategory(
  id: string,
  payload: TaxonomyWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.categoryById(id), {
    name: payload.name,
    description: payload.description ?? "",
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.categoryById(id));
}

// ─── Topics ───────────────────────────────────────────────────────────────────
export async function createTopic(payload: TaxonomyWritePayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.topics, {
    name: payload.name,
    description: payload.description ?? "",
  });
}

export async function updateTopic(
  id: string,
  payload: TaxonomyWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.topicById(id), {
    name: payload.name,
    description: payload.description ?? "",
  });
}

export async function deleteTopic(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.topicById(id));
}

// ─── Tags ─────────────────────────────────────────────────────────────────────
export async function fetchTags(): Promise<Tag[]> {
  const response = await axiosClient.get<PaginatedApiResponse<TagDto>>(
    API_ENDPOINTS.tags,
    { params: { limit: 100 } },
  );
  return (response.data.data ?? []).map(mapTag);
}

export async function createTag(name: string): Promise<Tag> {
  const response = await axiosClient.post<ApiSuccessResponse<TagDto>>(
    API_ENDPOINTS.tags,
    { name },
  );
  return mapTag(response.data.data);
}

export async function updateTag(id: string, name: string): Promise<Tag> {
  const response = await axiosClient.put<ApiSuccessResponse<TagDto>>(
    API_ENDPOINTS.tagById(id),
    { name },
  );
  return mapTag(response.data.data);
}

export async function deleteTag(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.tagById(id));
}

// ─── Series ───────────────────────────────────────────────────────────────────
export async function createSeries(payload: SeriesWritePayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.series, {
    name: payload.name,
    description: payload.description ?? "",
    image: payload.image || undefined,
  });
}

export async function updateSeries(
  id: string,
  payload: SeriesWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.seriesById(id), {
    name: payload.name,
    description: payload.description ?? "",
    image: payload.image || undefined,
  });
}

export async function deleteSeries(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.seriesById(id));
}
