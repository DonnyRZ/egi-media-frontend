import { fetchActiveSocialMediaLinks } from "@/shared/services/social-media.service";

export async function getActiveSocialMediaLinks() {
  return fetchActiveSocialMediaLinks();
}
