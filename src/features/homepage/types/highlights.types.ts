import type { Article } from "@/shared/types/article.types";

export interface HomepageHighlightsData {
  primary: Article[];
  supporting: Article[];
}

export interface HomepageHighlightPackage {
  primary: Article;
  supporting: Article[];
}
