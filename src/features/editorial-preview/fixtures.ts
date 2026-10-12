import type { ArticleDetail } from "@/shared/types/article.types";
export const previewArticles: ArticleDetail[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `preview-${i}`,
    title: [
      "Sentuhan Techno Craft dan Regenerasi Kriya: INACRAFT October 2026 Resmi Dibuka di JICC",
      "Pilihan Warna Hijab Timeless yang Bikin Penampilan Wanita Karir Tampak Makin Berkelas",
      "Teknologi membuka peluang baru bagi industri kreatif Indonesia",
    ][i % 3],
    slug: `preview-${i}`,
    summary:
      "Perkembangan industri kreatif menghubungkan tradisi, teknologi, dan generasi baru. Liputan editorial untuk membaca perubahan yang sedang terjadi.",
    featuredImage: "/images/editorial-preview.png",
    publishedAt: "2026-10-11T08:00:00Z",
    author: { id: "preview", fullName: "EGI Media" },
    category: { id: "preview", name: "Bisnis" },
    readingTimeMinutes: 3,
    locale: "id",
    availableLocales: ["id"],
    content: "",
    viewCount: 0,
    shareCount: 0,
    defaultLocale: "id",
    requestedLocale: "id",
    translations: {},
  }),
);
export const previewVideo = {
  id: "preview",
  title: "Cerita di balik perubahan industri kreatif",
  description: "Percakapan dengan para pelaku industri.",
  url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  thumbnailUrl: "/images/editorial-preview.png",
  durationLabel: "4:20",
  publishedAt: null,
};
