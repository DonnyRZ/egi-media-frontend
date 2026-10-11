import type { Article, HeroNewsData } from "@/shared/types/article.types";

interface HomepageSelectionInput {
  heroes: Article[];
  headlines: Article[];
  latest: Article[];
  pool: Article[];
}

function newestFirst(a: Article, b: Article) {
  return Date.parse(b.publishedAt ?? "") - Date.parse(a.publishedAt ?? "") || a.id.localeCompare(b.id);
}

function published(items: Article[]) {
  return items.filter((article) => {
    const status = (article as Article & { status?: string }).status;
    const time = Date.parse(article.publishedAt ?? "");
    return (!status || status === "published") && Number.isFinite(time) && time <= Date.now();
  });
}

function take(items: Article[], limit: number, used: Set<string>) {
  const result: Article[] = [];
  for (const article of items) {
    if (result.length >= limit) break;
    if (used.has(article.id)) continue;
    used.add(article.id);
    result.push(article);
  }
  return result;
}

/** Read-only selection: editorial slots win; fallback never changes CMS tags. */
export function selectHomepageNews(input: HomepageSelectionInput): { hero: HeroNewsData; latest: Article[] } {
  const heroes = published(input.heroes).sort(newestFirst);
  const pool = published(input.pool).sort(newestFirst);
  const curatedLatest = published(input.latest).sort(newestFirst);
  const curatedHeadlines = published(input.headlines).sort((a, b) =>
    (a.headlinePosition ?? 99) - (b.headlinePosition ?? 99) || newestFirst(a, b));
  const featured = heroes[0] ?? pool[0] ?? curatedLatest[0] ?? curatedHeadlines[0] ?? null;
  const used = new Set<string>(featured ? [featured.id] : []);
  const candidates = take([...pool, ...curatedLatest], 40, new Set(used));
  const headlines = take(curatedHeadlines, 5, used);
  // Reserve one distinct Latest item on a small catalog, without displacing curated headlines.
  const available = candidates.filter((article) => !used.has(article.id));
  headlines.push(...take(available, Math.min(5 - headlines.length, Math.max(0, available.length - 1)), used));
  const sidebarLatest = take([...curatedLatest, ...pool], 6, used);
  const latest = take([...curatedLatest, ...pool], 6, used);
  return { hero: { featured, headlines, latest: sidebarLatest }, latest };
}
