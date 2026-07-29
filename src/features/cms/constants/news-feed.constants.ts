export type NewsFeedSourceId =
  | ""
  | "detik"
  | "viva"
  | "cnn_indonesia"
  | "liputan6"
  | "suara"
  | "tempo"
  | "kumparan"
  | "tirto"
  | "okezone"
  | "sindonews"
  | "idn_times"
  | "republika"
  | "media_indonesia"
  | "merdeka"
  | "beritasatu"
  | "tribunnews"
  | "jawa_pos";

export interface NewsFeedTab {
  value: NewsFeedSourceId;
  label: string;
}

/** Media tabs for the CMS News Feed (EGI Media = all crawl sources). */
export const NEWS_FEED_TABS: NewsFeedTab[] = [
  { value: "", label: "EGI Media" },
  { value: "detik", label: "Detik" },
  { value: "viva", label: "VIVA" },
  { value: "cnn_indonesia", label: "CNN Indonesia" },
  { value: "liputan6", label: "Liputan6" },
  { value: "suara", label: "Suara" },
  { value: "tempo", label: "Tempo" },
  { value: "kumparan", label: "Kumparan" },
  { value: "tirto", label: "Tirto" },
  { value: "okezone", label: "Okezone" },
  { value: "sindonews", label: "SINDOnews" },
  { value: "idn_times", label: "IDN Times" },
  { value: "republika", label: "Republika" },
  { value: "media_indonesia", label: "Media Indonesia" },
  { value: "merdeka", label: "Merdeka" },
  { value: "beritasatu", label: "BeritaSatu" },
  { value: "tribunnews", label: "Tribunnews" },
  { value: "jawa_pos", label: "Jawa Pos" },
];

export const NEWS_FEED_PAGE_SIZE = 12;

export const NEWS_FEED_SOURCE_LABELS: Record<string, string> = Object.fromEntries(
  NEWS_FEED_TABS.filter((tab) => tab.value).map((tab) => [tab.value, tab.label]),
);
