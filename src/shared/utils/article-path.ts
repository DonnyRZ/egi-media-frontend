const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isArticleId(value: string): boolean {
  return UUID_PATTERN.test(value);
}

/** Decode once so we never double-encode path/query slugs. */
export function normalizeArticleSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function getArticleHref(article: { id: string }): string {
  return `/articles/${article.id}`;
}
