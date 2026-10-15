"use client";

import { useLocale } from "next-intl";
import { useState } from "react";

import { ColumnCard } from "@/features/columns/components/ColumnCard";
import { VideoPlaylistItem } from "@/features/videos/components/VideoPlaylistItem";
import { ArticleCard } from "@/shared/components/common/ArticleCard";
import { ArticleImage } from "@/shared/components/common/ArticleImage";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { ContentMetadata } from "@/shared/components/common/ContentMetadata";
import { PUBLIC_ARTICLE_AUTHOR_NAME } from "@/shared/constants/article.constants";
import type { Article } from "@/shared/types/article.types";
import type { YoutubeVideo } from "@/shared/types/youtube.types";
import { previewArticles, previewVideo } from "./fixtures";

const headlines: Record<string, string[]> = {
  id: [
    "Kerja sama baru EGI",
    "Dubes RI untuk Uzbekistan dan CEO EGI Resources Bahas Penguatan Kerja Sama Pariwisata",
    "EGI Resources dan Dubes RI untuk Ukraina Bahas Proyek Strategis Pengolahan Mineral Langka, Perkuat Kerja Sama Teknologi",
    "Kolaborasi jangka panjang: pemerintah, pelaku usaha, dan masyarakat memperluas kemitraan strategis untuk teknologi, pariwisata, dan industri kreatif di Indonesia serta Asia Tengah",
  ],
  en: [
    "EGI announces new partnership",
    "Indonesian Ambassador to Uzbekistan and EGI Resources CEO Discuss Strengthening Tourism Cooperation",
    "EGI Resources and Indonesian Ambassador to Ukraine Discuss Strategic Rare Mineral Processing Project, Strengthen Technology Cooperation",
    "A long-term partnership: governments, businesses and communities expand strategic cooperation in technology, tourism and creative industries across Indonesia and Central Asia",
  ],
  uz: [
    "EGI yangi hamkorlikni e’lon qildi",
    "Indoneziyaning O‘zbekistondagi elchisi va EGI Resources rahbari turizm sohasidagi hamkorlikni mustahkamlash masalalarini muhokama qildi",
    "EGI Resources va Indoneziyaning Ukrainadagi elchisi noyob minerallarni qayta ishlash bo‘yicha strategik loyiha va texnologik hamkorlikni rivojlantirish masalalarini muhokama qildi",
    "Uzoq muddatli hamkorlik: davlat, biznes va jamiyat Indoneziya hamda Markaziy Osiyoda texnologiya, turizm va ijodiy sanoat sohalarida strategik sheriklikni kengaytirmoqda",
  ],
};

function BaselineCard({ article }: { article: Article }) {
  return <article className="grid grid-cols-[96px_minmax(0,1fr)] items-start gap-3">
    <div className="relative aspect-video"><ArticleImage src={article.featuredImage} alt={article.title} /></div>
    <div className="min-w-0 break-words">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">{article.category?.name}</p>
      <h3 className="mt-1 text-[16px] font-semibold leading-[1.35]">{article.title}</h3>
      <ContentMetadata className="mt-2" author={PUBLIC_ARTICLE_AUTHOR_NAME} publishedAt={article.publishedAt} readingTimeMinutes={article.readingTimeMinutes} />
    </div>
  </article>;
}

function PreviewVariants({ articles, titles, active, onSelect }: { articles: Article[]; titles: string[]; active: string; onSelect: (video: YoutubeVideo) => void }) {
  return <>
    <h2 className="editorial-section-title mt-5 font-bold">Timeline / pencarian</h2>
    <ArticleTimeline articles={articles.slice(1, 3)} />
    <h2 className="editorial-section-title mt-5 font-bold">Kolom</h2>
    <ColumnCard variant="row" column={{ ...articles[2], status: "published", translationStatus: "ready", rejectionReason: null,
      publishedAt: articles[2].publishedAt, createdAt: "2026-10-11T08:00:00Z", author: { ...articles[2].author, role: "author" } }} />
    <h2 className="editorial-section-title mt-5 font-bold">Playlist video</h2>
    <ul className="max-w-[560px]">
      {titles.slice(1, 3).map((title, index) => <VideoPlaylistItem key={index}
        video={{ ...previewVideo, id: `preview-${index}`, title }} isActive={active === `preview-${index}`} onSelect={onSelect} />)}
    </ul>
  </>;
}

export function HorizontalCardsPreview({ baseline = false }: { baseline?: boolean }) {
  const locale = useLocale();
  const [active, setActive] = useState("preview");
  const titles = headlines[locale] ?? headlines.id;
  const articles = [...titles, `https://example.invalid/${"long-unbroken-title".repeat(8)}`, titles[1]].map((title, index) => ({
    ...previewArticles[index], title,
    category: { id: "preview", name: locale === "en" ? "EGI News" : locale === "uz" ? "EGI yangiliklari" : "Berita EGI" },
    featuredImage: index === 5 ? "/images/missing-preview-photo.png" : previewArticles[index].featuredImage,
    author: { id: "preview", fullName: index === 3 ? "Donny Santosa dan Tim Redaksi EGI Media Indonesia" : "Donny Santosa" },
    publishedAt: index === 4 ? null : previewArticles[index].publishedAt,
    readingTimeMinutes: index === 4 ? null : 2,
  }));
  return <div className="editorial-gutter px-4 py-5 md:p-5">
    <h1 className="editorial-page-title mb-4 text-2xl font-bold">Preview lokal · {baseline ? "Sebelum" : "Revisi"}</h1>
    <div className="horizontal-preview-list max-w-[560px] divide-y divide-neutral-200">
      {articles.map((article) => <div key={article.id} className="py-3">
        {baseline ? <BaselineCard article={article} /> : <ArticleCard article={article} variant="horizontal" />}
      </div>)}
    </div>
    {!baseline ? <PreviewVariants articles={articles} titles={titles} active={active} onSelect={(video) => setActive(video.id)} /> : null}
  </div>;
}
