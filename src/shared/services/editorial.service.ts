import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { EDITORIAL_API } from "@/shared/constants/editorial-api.constants";
import { mapYoutubeVideoDto } from "@/shared/mappers/youtube.mapper";
import type {
  ApiSuccessResponse,
  PaginatedApiResponse,
} from "@/shared/types/api.types";
import type {
  CategoryEditorial,
  MediaResource,
  MediaResourceWrite,
} from "@/shared/types/editorial.types";

export async function fetchCategoryEditorial(id: string, lang: string) {
  return (
    await axiosClient.get<ApiSuccessResponse<CategoryEditorial>>(
      EDITORIAL_API.category(id),
      { params: { lang } },
    )
  ).data.data;
}
export async function saveCategoryEditorial(
  id: string,
  value: Pick<CategoryEditorial, "lead_id" | "supporting_ids" | "editor_ids">,
) {
  return (await axiosClient.put(EDITORIAL_API.category(id), value)).data;
}
export async function fetchMediaCatalog(
  kind: "programs" | "collections",
  lang: string,
  privateRead = false,
) {
  const url = privateRead
    ? kind === "programs"
      ? EDITORIAL_API.cmsPrograms
      : EDITORIAL_API.cmsCollections
    : EDITORIAL_API[kind];
  const items: MediaResource[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const response = await axiosClient.get<PaginatedApiResponse<MediaResource>>(
      url,
      { params: { lang, limit: 100, page } },
    );
    items.push(...(response.data.data ?? []));
    totalPages = response.data.meta?.total_pages ?? 1;
    page++;
  } while (page <= totalPages);
  return items;
}
export async function fetchMediaResource(
  kind: "programs" | "collections",
  id: string,
  lang: string,
  privateRead = false,
) {
  const base = privateRead
    ? kind === "programs"
      ? EDITORIAL_API.cmsPrograms
      : EDITORIAL_API.cmsCollections
    : EDITORIAL_API[kind];
  return (
    await axiosClient.get<ApiSuccessResponse<MediaResource>>(
      `${base}/${encodeURIComponent(id)}`,
      { params: { lang } },
    )
  ).data.data;
}
export async function saveMediaResource(
  kind: "programs" | "collections",
  id: string | null,
  payload: MediaResourceWrite,
) {
  const base = EDITORIAL_API[kind];
  return id
    ? axiosClient.put(`${base}/${id}`, payload)
    : axiosClient.post(base, payload);
}
export async function fetchVideoSettings() {
  return (
    await axiosClient.get<ApiSuccessResponse<{ hero_video_id: string | null }>>(
      EDITORIAL_API.settings,
    )
  ).data.data;
}
export async function saveVideoSettings(hero_video_id: string | null) {
  return axiosClient.put(EDITORIAL_API.settings, { hero_video_id });
}
export async function fetchVideoDetail(id: string, lang: string) {
  const response = await axiosClient.get<
    ApiSuccessResponse<Parameters<typeof mapYoutubeVideoDto>[0]>
  >(API_ENDPOINTS.youtubeVideoById(id), { params: { lang } });
  return mapYoutubeVideoDto(response.data.data);
}

export async function fetchCategoryEditorialSelection(
  categoryId: string,
  lang: import("@/shared/types/article.types").ContentLocale,
  articles: import("@/shared/types/article.types").Article[],
) {
  const config = await fetchCategoryEditorial(categoryId, lang);
  const ids = [
    ...new Set(
      [config.lead_id, ...config.supporting_ids, ...config.editor_ids].filter(
        (id): id is string => Boolean(id),
      ),
    ),
  ];
  const { fetchArticleById } = await import(
    "@/shared/services/article.service"
  );
  const result = await Promise.allSettled(
    ids.map(
      (id) => articles.find((a) => a.id === id) || fetchArticleById(id, lang),
    ),
  );
  const selected = result.flatMap((x) =>
    x.status === "fulfilled" && x.value.category?.id === categoryId
      ? [x.value]
      : [],
  );
  return { config, selected };
}
