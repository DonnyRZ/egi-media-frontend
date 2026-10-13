"use client";

import { useLocale } from "next-intl";
import { HighlightsContent } from "@/features/homepage/components/HighlightsContent";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { previewArticles } from "./fixtures";

const titles: Record<string, string[]> = {
  id: ["Pemerintah Memperkuat Kerja Sama Strategis di Asia Tengah", "Arah Baru Kebijakan Nasional dan Perubahan Ekonomi Global", "Parlemen Membahas Prioritas Pembangunan Tahun Depan", "EGI Resources dan Dubes RI untuk Ukraina Bahas Proyek Strategis Pengolahan Mineral Langka, Perkuat Kerja Sama Teknologi"],
  en: ["Government Strengthens Strategic Cooperation in Central Asia", "A New Direction for National Policy and the Global Economy", "Parliament Reviews Development Priorities for Next Year", "EGI Resources and Indonesian Ambassador to Ukraine Discuss Strategic Rare Mineral Processing Project, Strengthen Technology Cooperation"],
  uz: ["Hukumat Markaziy Osiyoda strategik hamkorlikni kengaytirmoqda", "Milliy siyosat va jahon iqtisodiyotining yangi yo‘nalishlari", "Parlament kelgusi yil uchun rivojlanish ustuvorliklarini muhokama qildi", "EGI Resources va Indoneziyaning Ukrainadagi elchisi noyob minerallarni qayta ishlash bo‘yicha strategik loyiha va texnologik hamkorlikni rivojlantirish masalalarini muhokama qildi"],
};

export function HighlightsPreview({ primaryCount, supportingCount, brokenImage, longMeta }: {
  primaryCount: number; supportingCount: number; brokenImage: boolean; longMeta: boolean;
}) {
  const locale = useLocale();
  const stories = previewArticles.map((article, index) => ({ ...article,
    title: titles[locale][index < 3 ? index : 3],
    featuredImage: brokenImage ? "/images/missing-highlights-photo.png" : article.featuredImage,
    author: { ...article.author, fullName: longMeta ? "Muhammad Donny Santosa — Redaksi Internasional EGI Media" : "EGI Media" },
    category: { id: "preview", name: index < 3 ? { id: "Politik", en: "Politics", uz: "Siyosat" }[locale] ?? "Politik" : article.category!.name },
  }));
  const data = { primary: stories.slice(0, primaryCount), supporting: stories.slice(3, 3 + supportingCount) };
  if (!data.primary.length && !data.supporting.length) return null;
  return <FrameModule className="homepage-highlights">
    <HighlightsContent data={data} />
  </FrameModule>;
}
