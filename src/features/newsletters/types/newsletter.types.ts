export type NewsletterFrequency = "daily" | "weekly" | "monthly";

export interface Newsletter {
  id: string;
  name: string;
  description: string | null;
  frequency: NewsletterFrequency;
  isActive: boolean;
  createdAt: string;
}

export interface NewsletterListResult {
  items: Newsletter[];
  total: number;
  page: number;
  totalPages: number;
}

export interface NewsletterListParams {
  page?: number;
  limit?: number;
}
