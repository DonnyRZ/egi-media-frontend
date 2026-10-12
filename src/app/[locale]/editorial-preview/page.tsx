import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { EditorialLead } from "@/shared/components/common/EditorialLead";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { ArticleHeader } from "@/features/article/components/ArticleHeader";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import {
  previewArticles,
  previewVideo,
} from "@/features/editorial-preview/fixtures";

export default async function Preview({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { locale } = await params;
  setRequestLocale(locale);
  const articles = previewArticles;
  return (
    <PageFrame>
      <div className="p-5">
        <p className="kicker">Preview lokal · data fixture</p>
        <h1 className="mt-2 text-4xl font-bold">Bisnis</h1>
        <nav className="mt-4 flex gap-6 border-t border-neutral-200 pt-4">
          Industri <span>Ekonomi kreatif</span>
          <span>Teknologi</span>
        </nav>
      </div>
      <EditorialLead
        lead={articles[0]}
        supporting={articles.slice(1, 4)}
        latest={articles.slice(4, 8)}
      />
      <div className="p-5">
        <ArticleTimeline articles={articles.slice(8)} />
      </div>
      <div className="mx-auto max-w-[1040px] p-5">
        <ArticleHeader article={articles[0]} />
      </div>
      <PreviewVideoAndShorts />
    </PageFrame>
  );
}

function PreviewVideoAndShorts() {
  const articles = previewArticles,
    video = previewVideo;
  return (
    <div className="bg-[#060b18] p-5 text-white">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_2fr]">
        <h2 className="text-3xl font-bold">{video.title}</h2>
        <div className="relative aspect-video">
          <VideoEmbed video={video} />
        </div>
      </div>
      <h2 className="my-6 text-xl font-bold">Shorts</h2>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {articles.slice(0, 4).map((a) => (
          <div key={a.id}>
            <div className="relative aspect-[9/16] bg-neutral-900">
              <VideoEmbed
                video={{
                  ...video,
                  id: a.id,
                  title: a.title,
                  format: "short",
                  thumbnailUrl: "/images/editorial-preview-short.svg",
                }}
              />
            </div>
            <h3 className="mt-3 font-bold">{a.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
