import { axiosClient } from "@/shared/lib/axios-client";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { mapNewsletterListDto } from "@/shared/mappers/newsletter.mapper";
import type { ApiSuccessResponse, NewsletterListParams } from "@/shared/types/api.types";
import type { NewsletterListResult } from "@/shared/types/newsletter.types";

interface NewsletterListResponseDto {
  items: Array<{
    id: string;
    title: string;
    description: string | null;
    frequency: "daily" | "weekly" | "monthly";
  }>;
  meta: { total: number };
}

export async function fetchNewsletters(
  params: NewsletterListParams,
): Promise<NewsletterListResult> {
  const response = await axiosClient.get<ApiSuccessResponse<NewsletterListResponseDto>>(
    API_ENDPOINTS.newsletters,
    { params },
  );

  return mapNewsletterListDto(response.data.data);
}
