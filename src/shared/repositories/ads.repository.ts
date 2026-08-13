import {
  fetchActiveAdsByPlacement,
  trackAdClick,
  trackAdImpression,
} from "@/shared/services/ads.service";
import type { AdPlacement } from "@/shared/types/ads.types";

export async function getActiveAdsByPlacement(placement: AdPlacement) {
  return fetchActiveAdsByPlacement(placement);
}

export async function recordAdImpression(id: string) {
  return trackAdImpression(id);
}

export async function recordAdClick(id: string) {
  return trackAdClick(id);
}
