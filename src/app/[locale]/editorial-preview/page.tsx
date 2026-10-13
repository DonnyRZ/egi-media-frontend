import { HighlightsPreview } from "@/features/editorial-preview/HighlightsPreview";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { EditorialLead } from "@/shared/components/common/EditorialLead";
import { ArticleTimeline } from "@/shared/components/common/ArticleTimeline";
import { ArticleHeader } from "@/features/article/components/ArticleHeader";
import { VideoEmbed } from "@/features/videos/components/VideoEmbed";
import { PageFrame } from "@/shared/components/layout/PageFrame";
import { FrameHeading } from "@/shared/components/layout/FrameHeading";
import { FrameModule } from "@/shared/components/layout/FrameModule";
import { LatestArticleGrid } from "@/shared/components/common/LatestArticleGrid";
import { TrendingArticleGrid } from "@/features/trending/components/TrendingArticleGrid";
import { HOMEPAGE_LIMITS } from "@/shared/constants/homepage.constants";
import { MobileReadingPreview } from "@/features/editorial-preview/MobileReadingPreview";
import { VideoHeroStage } from "@/features/videos/components/VideoHeroStage";
import { VideoPageFrame } from "@/features/videos/components/VideoPageFrame";
import { VideoThumbnailPreview } from "@/features/editorial-preview/VideoThumbnailPreview";
import { HorizontalCardsPreview } from "@/features/editorial-preview/HorizontalCardsPreview";
import {
  previewArticles,
  previewVideo,
} from "@/features/editorial-preview/fixtures";

export default async function Preview({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ template?: string; primaryCount?: string; supportingCount?: string; textScale?: string; spacing?: string; plain?: string; brokenImage?: string; longMeta?: string; short?: string; pasted?: string; defaultPoster?: string; baseline?: string; count?: string; video?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const { locale } = await params;
  const query = await searchParams;
  const requestedScale = Number(query.textScale || 1);
  const scale = [1, 1.25, 1.5, 2].includes(requestedScale) ? requestedScale : 1;
  const previewStyles = `html { font-size: ${16 * scale}px; }${query.spacing === "1" ? ".egi-public :is(h1,h2,h3,p,li,a,time,span,button,input,textarea,select) { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } .egi-public main p { margin-bottom: 2em !important; }" : ""}`;
  setRequestLocale(locale);
  if (query.template === "highlights") {
    const bounded = (value: string | undefined, max: number) => {
      const count = Number(value ?? max); return Number.isFinite(count) ? Math.max(0, Math.min(max, Math.floor(count))) : max;
    };
    return <><style>{previewStyles}</style><PageFrame className="homepage-frame">
      <HighlightsPreview primaryCount={bounded(query.primaryCount, 3)} supportingCount={bounded(query.supportingCount, 9)} brokenImage={query.brokenImage === "1"} longMeta={query.longMeta === "1"} />
    </PageFrame></>;
  }
  if (query.template === "horizontal") {
    return <><style>{previewStyles}</style><PageFrame><HorizontalCardsPreview baseline={query.baseline === "1"} /></PageFrame></>;
  }
  const articles = previewArticles;
  if (query.template === "homepage-composition") {
    const requestedCount = Number(query.count ?? 3);
    const count = Number.isFinite(requestedCount) ? Math.max(0, Math.min(6, Math.floor(requestedCount))) : 1;
    const trending = articles.slice(4, 4 + count);
    const breakingText = await getTranslations("breaking");
    const latestText = await getTranslations("latest");
    return <><style>{previewStyles}</style><PageFrame className="homepage-frame">
      <FrameModule className="homepage-lead">
        <EditorialLead lead={articles[0]} supporting={articles.slice(1, 4)}
          latest={trending} latestTitle={breakingText("title")} latestHeadingId="hero-trending-heading"
          latestHref={null} video={query.video === "0" ? undefined : previewVideo} />
      </FrameModule>
      {trending.length ? <FrameModule className="homepage-trending" ariaLabelledby="trending-heading">
        <FrameHeading id="trending-heading" title={breakingText("title")} subtitle={breakingText("subtitle")} />
        <TrendingArticleGrid articles={trending} />
      </FrameModule> : null}
      <FrameModule className="homepage-latest" ariaLabelledby="latest-heading">
        <FrameHeading id="latest-heading" title={latestText("title")} subtitle={latestText("subtitle")} actionHref="/latest" />
        <LatestArticleGrid articles={articles.slice(0, 6)} mobileLimit={HOMEPAGE_LIMITS.mobileLatestNews} />
      </FrameModule>
    </PageFrame></>;
  }
  if (query.template === "video-thumbnail") {
    return <VideoPageFrame><VideoThumbnailPreview /></VideoPageFrame>;
  }
  if (query.template === "video-hero") {
    return <><style>{previewStyles}</style><VideoPageFrame>
      <div className="editorial-gutter px-4 py-6 md:px-6 lg:px-8">
        <h1 className="editorial-page-title mb-6 text-3xl font-bold">Video</h1>
        <VideoHeroStage video={{ ...previewVideo, posterLandscape: query.defaultPoster === "1" ? null : previewVideo.thumbnailUrl }} />
      </div>
    </VideoPageFrame></>;
  }
  return (
    <><style>{previewStyles}</style><PageFrame>
      {query.template === "article" ? <MobileReadingPreview plain={query.plain === "1"} brokenImage={query.brokenImage === "1"} longMeta={query.longMeta === "1"} short={query.short === "1"} pasted={query.pasted === "1"} /> : <>
      <div className="editorial-gutter px-4 py-5 md:p-5">
        <p className="kicker">Preview lokal · data fixture</p>
        <h1 className="editorial-page-title mt-2 text-4xl font-bold">Bisnis</h1>
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
      <div className="editorial-gutter px-4 py-5 md:p-5">
        <ArticleTimeline articles={articles.slice(8)} />
      </div>
      <div className="editorial-gutter mx-auto max-w-[1040px] px-4 py-5 md:p-5">
        <ArticleHeader article={articles[0]} />
      </div>
      <PreviewVideoAndShorts />
      </>}
    </PageFrame></>
  );
}

function PreviewVideoAndShorts() {
  const articles = previewArticles,
    video = previewVideo;
  return (
    <div className="editorial-gutter bg-[#060b18] px-4 py-5 md:p-5 text-white">
      <div className="grid items-center gap-6 md:grid-cols-[1fr_2fr]">
        <h2 className="editorial-section-title text-3xl font-bold">{video.title}</h2>
        <div className="relative aspect-video">
          <VideoEmbed video={video} />
        </div>
      </div>
      <h2 className="editorial-section-title my-6 text-xl font-bold">Shorts</h2>
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
            <h3 className="editorial-card-title mt-3 font-bold">{a.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
