import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";
import type { SocialPlatform } from "@/features/footer/constants/social.constants";
import { isSocialPlatform } from "@/features/footer/constants/social.constants";

export interface SocialMediaLink {
  id: string;
  platformName: string;
  url: string;
  iconName: SocialPlatform;
  sortOrder: number;
}

interface SocialMediaLinkDto {
  id: string;
  platform_name: string;
  url: string;
  icon_name: string;
  sort_order?: number;
}

function mapLink(dto: SocialMediaLinkDto): SocialMediaLink {
  return {
    id: dto.id,
    platformName: dto.platform_name,
    url: dto.url,
    iconName: isSocialPlatform(dto.icon_name) ? dto.icon_name : "youtube",
    sortOrder: dto.sort_order ?? 0,
  };
}

/** Public active social links for the site footer. */
export async function fetchActiveSocialMediaLinks(): Promise<SocialMediaLink[]> {
  const response = await axiosClient.get<{ data: SocialMediaLinkDto[] }>(
    API_ENDPOINTS.socialMediaLinks,
    {
      params: {
        page: 1,
        limit: 50,
        active: true,
      },
    },
  );

  return (response.data?.data ?? []).map(mapLink);
}
