export type NewsletterFrequency = "daily" | "weekly" | "monthly";

export interface Newsletter {
  id: string;
  title: string;
  description: string | null;
  frequency: NewsletterFrequency;
}

export interface NewsletterListResult {
  items: Newsletter[];
  total: number;
}
