import type { HomepageHighlightsData, HomepageHighlightPackage } from "../types/highlights.types";

/** Allocate consecutive stories evenly, at most three per available lead. */
export function buildHighlightPackages(data: HomepageHighlightsData) {
  const primary = data.primary.slice(0, 3);
  const supporting = data.supporting.slice(0, 9);
  const allocated = Math.min(supporting.length, primary.length * 3);
  let offset = 0;
  const packages: HomepageHighlightPackage[] = primary.map((article, index) => {
    const count = Math.floor(allocated / primary.length) + (index < allocated % primary.length ? 1 : 0);
    const stories = supporting.slice(offset, offset + count);
    offset += count;
    return { primary: article, supporting: stories };
  });
  return { packages, remaining: supporting.slice(offset) };
}
