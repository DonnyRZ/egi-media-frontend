import { fetchNewsletters } from "@/shared/services/newsletter.service";
import type { NewsletterListResult } from "@/shared/types/newsletter.types";

export async function getActiveNewsletters(): Promise<NewsletterListResult> {
  return fetchNewsletters({ page: 1, limit: 1 });
}
