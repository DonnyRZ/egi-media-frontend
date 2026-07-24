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

export interface TopicWritePayload extends TaxonomyWritePayload {
  categoryId: string;
}

export interface SeriesWritePayload {
  name: string;
  description?: string | null;
  image?: string | null;
  topicId: string;
}

export interface CmsTaxonomyParent {
  id: string;
  name: string;
  slug: string | null;
}

export interface CmsTaxonomyItem {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image: string | null;
  articleCount: number;
  categoryId: string | null;
  category: CmsTaxonomyParent | null;
  topicId: string | null;
  topic: CmsTaxonomyParent | null;
}

interface TaxonomyParentDto {
  id: string;
  name: string;
  slug?: string | null;
}

interface TaxonomyItemDto {
  id: string;
  name: string;
  slug?: string | null;
  description?: string | null;
  image?: string | null;
  article_count?: number | null;
  category_id?: string | null;
  category?: TaxonomyParentDto | null;
  topic_id?: string | null;
  topic?: TaxonomyParentDto | null;
}

function mapParent(dto: TaxonomyParentDto | null | undefined): CmsTaxonomyParent | null {
  if (!dto?.id) return null;
  return { id: dto.id, name: dto.name, slug: dto.slug ?? null };
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
    categoryId: dto.category_id ?? dto.category?.id ?? null,
    category: mapParent(dto.category),
    topicId: dto.topic_id ?? dto.topic?.id ?? null,
    topic: mapParent(dto.topic),
  }));
}

export const fetchCmsCategories = () =>
  fetchTaxonomyList(API_ENDPOINTS.categories);
export const fetchCmsTopics = () => fetchTaxonomyList(API_ENDPOINTS.topics);
export const fetchCmsSeries = () => fetchTaxonomyList(API_ENDPOINTS.series);
export const fetchCmsTags = () => fetchTaxonomyList(API_ENDPOINTS.tags);

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

export async function createTopic(payload: TopicWritePayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.topics, {
    name: payload.name,
    description: payload.description ?? "",
    category_id: payload.categoryId,
  });
}

export async function updateTopic(
  id: string,
  payload: TopicWritePayload,
): Promise<void> {
  await axiosClient.put(API_ENDPOINTS.topicById(id), {
    name: payload.name,
    description: payload.description ?? "",
    category_id: payload.categoryId,
  });
}

export async function deleteTopic(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.topicById(id));
}

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

export async function createSeries(payload: SeriesWritePayload): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.series, {
    name: payload.name,
    description: payload.description ?? "",
    image: payload.image || undefined,
    topic_id: payload.topicId,
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
    topic_id: payload.topicId,
  });
}

export async function deleteSeries(id: string): Promise<void> {
  await axiosClient.delete(API_ENDPOINTS.seriesById(id));
}
