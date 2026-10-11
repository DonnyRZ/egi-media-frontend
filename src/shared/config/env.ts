export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5002",
  crawlApiUrl: process.env.NEXT_PUBLIC_CRAWL_API_URL ?? "http://localhost:5050",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  aiAppUrl:
    process.env.NEXT_PUBLIC_AI_APP_URL ?? "/id/login",
} as const;
