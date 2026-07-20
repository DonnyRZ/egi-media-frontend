export const HEADER_TOPIC_SLUGS = {
  business: "business",
  technology: "technology",
  politics: "politics",
  egiNews: "egi-news",
} as const;

export type HeaderTopicKey = keyof typeof HEADER_TOPIC_SLUGS;

export const HEADER_TOPIC_I18N_KEYS: Record<string, HeaderTopicKey> = {
  business: "business",
  technology: "technology",
  politics: "politics",
  "egi-news": "egiNews",
};
