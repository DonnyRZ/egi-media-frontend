export const HEADER_CATEGORY_SLUGS = {
  business: "business",
  technology: "technology",
  politics: "politics",
  sports: "olahraga",
  entertainment: "hiburan",
  column: "kolom",
  egiNews: "egi-news",
} as const;

export type HeaderCategoryKey = keyof typeof HEADER_CATEGORY_SLUGS;

export const HEADER_CATEGORY_I18N_KEYS: Record<string, HeaderCategoryKey> = {
  business: "business",
  technology: "technology",
  politics: "politics",
  olahraga: "sports",
  hiburan: "entertainment",
  kolom: "column",
  "egi-news": "egiNews",
};
