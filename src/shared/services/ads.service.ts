import type { AdPlacement } from "@/shared/types/ads.types";
import { API_ENDPOINTS } from "@/shared/constants/api.constants";
import { axiosClient } from "@/shared/lib/axios-client";

export interface PublicAd {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  placement: AdPlacement;
  imageWidth?: number | null;
  imageHeight?: number | null;
}

interface PublicAdDto {
  id: string;
  title: string;
  image_url: string;
  target_url: string;
  placement: string;
  image_width?: number | null;
  image_height?: number | null;
}

function mapAd(dto: PublicAdDto): PublicAd {
  return {
    id: dto.id,
    title: dto.title,
    imageUrl: dto.image_url,
    targetUrl: dto.target_url,
    placement: dto.placement as AdPlacement,
    imageWidth: dto.image_width ?? null,
    imageHeight: dto.image_height ?? null,
  };
}

export async function fetchActiveAdsByPlacement(
  placement: AdPlacement,
): Promise<PublicAd[]> {
  const response = await axiosClient.get<{ data: PublicAdDto[] }>(
    API_ENDPOINTS.adsActive,
    { params: { placement } },
  );
  return (response.data?.data ?? []).map(mapAd);
}

export async function trackAdImpression(id: string): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.adImpression(id));
}

export async function trackAdClick(id: string): Promise<void> {
  await axiosClient.post(API_ENDPOINTS.adClick(id));
}
