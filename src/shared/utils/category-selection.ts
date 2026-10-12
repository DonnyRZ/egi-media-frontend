import type { Article } from "@/shared/types/article.types";
import type { CategoryEditorial } from "@/shared/types/editorial.types";

function eligible(article: Article, categoryId: string) {
  const status = (article as Article & { status?: string }).status;
  const publishedAt = Date.parse(article.publishedAt ?? "");
  return (
    article.category?.id === categoryId &&
    (!status || status === "published") &&
    Number.isFinite(publishedAt) &&
    publishedAt <= Date.now()
  );
}

/** Category pins and fallback are composed without changing persisted curation. */
export function selectCategoryPackage(
  categoryId: string,
  pool: Article[],
  selected: Article[],
  config?: CategoryEditorial,
) {
  const latestPool = pool
    .filter((a) => eligible(a, categoryId))
    .sort(
      (a, b) =>
        Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!) ||
        b.id.localeCompare(a.id),
    );
  const byId = new Map(
    [...latestPool, ...selected.filter((a) => eligible(a, categoryId))].map(
      (a) => [a.id, a],
    ),
  );
  const lead = byId.get(config?.lead_id ?? "") ?? latestPool[0];
  const used = new Set(lead ? [lead.id] : []);
  const supporting: Article[] = [];
  for (const id of [
    ...(config?.supporting_ids ?? []),
    ...latestPool.map((a) => a.id),
  ]) {
    const article = byId.get(id);
    if (!article || used.has(id) || supporting.length >= 5) continue;
    supporting.push(article);
    used.add(id);
  }
  const latest = latestPool.slice(0, 6);
  const latestIds = new Set(latest.map((article) => article.id));
  const rest = latestPool.filter(
    (article) => !used.has(article.id) && !latestIds.has(article.id),
  );
  const editors = [...new Set(config?.editor_ids ?? [])].flatMap((id) =>
    byId.has(id) ? [byId.get(id)!] : [],
  );
  return { lead, supporting, rest, latest, editors };
}
