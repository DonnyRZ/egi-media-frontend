import type { Article, HeroNewsData } from "@/shared/types/article.types";
import type { CategoryNewsGroup } from "@/shared/types/category.types";
import type { TopicNewsGroup } from "@/shared/types/topic.types";

export interface HomepageNewsData {
  hero: HeroNewsData;
  breaking: Article[];
  latest: Article[];
  categories: CategoryNewsGroup[];
  topics: TopicNewsGroup[];
  editors: Article[];
  failedSections: string[];
}
