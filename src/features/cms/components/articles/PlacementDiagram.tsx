import type { ArticlePlacement } from "@/features/cms/types/cms.types";

export function PlacementDiagram({ value }: { value: ArticlePlacement[] }) {
  const areas: { placement: ArticlePlacement; label: string }[] = [
    { placement: "headline", label: "Left · Headline" },
    { placement: "homepage_hero", label: "Center · Hero" },
    { placement: "trending", label: "Right below Video · Trending" },
    { placement: "latest_news", label: "Below · Latest News" },
  ];
  return <figure className="mb-4">
    <figcaption className="mb-2 text-xs font-medium text-neutral-500">Homepage placement map · desktop</figcaption>
    <div className="grid grid-cols-[28fr_40fr_32fr] gap-1 text-center text-[11px]">
      {areas.map(({ placement, label }) => <div key={placement}
        className={`flex min-h-14 items-center justify-center border p-1 ${placement === "latest_news" ? "col-span-3 min-h-8" : ""} ${value.includes(placement) ? "border-primary-500 bg-primary-100 font-semibold text-primary-900" : "border-neutral-200 text-neutral-500 dark:border-neutral-700"}`}>
        {label}{value.includes(placement) ? " ✓" : ""}
      </div>)}
    </div>
    <p className="mt-2 text-xs leading-5 text-neutral-500">Trending only uses manually selected, published articles; empty Trending stays empty. Desktop repeats the latest Trending selections below Featured Video. Mobile: Hero → Featured Video → 3 Trending image cards → 3 Latest News rows → Utama + Pendamping → Latest Videos → For You. Politics automatically qualifies for Utama together with manually selected Trending articles; publication time decides their order.</p>
  </figure>;
}
