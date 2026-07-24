import type { TaxonomyKind } from "@/features/cms/hooks/useCmsTaxonomy";

export const TAXONOMY_SINGULAR: Record<TaxonomyKind, string> = {
  category: "Category",
  topic: "Topic",
  series: "Series",
  tag: "Tag",
};

export const TAXONOMY_TABS: {
  kind: TaxonomyKind;
  title: string;
  description: string;
}[] = [
  {
    kind: "category",
    title: "Categories",
    description: "Top-level sections, e.g. Sport, Business, Politics.",
  },
  {
    kind: "topic",
    title: "Topics",
    description: "Themes within a category. Each topic must have a parent category.",
  },
  {
    kind: "series",
    title: "Series",
    description: "Multi-part story collections under a parent topic.",
  },
  {
    kind: "tag",
    title: "Tags",
    description: "Free-form keywords for granular discovery.",
  },
];
