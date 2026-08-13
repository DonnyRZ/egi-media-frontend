export const PROFESIONAL_PATH = "/profesional";
export const PROFESIONAL_LOCALE = "en" as const;

export const PROFESIONAL_ROUTES = {
  home: "/profesional",
  products: "/profesional/produk",
  solutions: "/profesional/solusi",
  leadership: "/profesional/untuk-pimpinan",
  insights: "/profesional/kepercayaan",
  support: "/profesional/dukungan",
} as const;

export const PROFESIONAL_NAV = [
  { key: "navProducts" as const, href: PROFESIONAL_ROUTES.products, mega: true },
  { key: "navSolutions" as const, href: PROFESIONAL_ROUTES.solutions, mega: false },
  { key: "navLeadership" as const, href: PROFESIONAL_ROUTES.leadership, mega: false },
  { key: "navInsights" as const, href: PROFESIONAL_ROUTES.insights, mega: false },
  { key: "navSupport" as const, href: PROFESIONAL_ROUTES.support, mega: false },
];

export const PROFESIONAL_IMAGES = {
  hero: "/images/profesional/hero.jpg",
  briefing: "/images/profesional/product-briefing.jpg",
  issues: "/images/profesional/product-issues.jpg",
  market: "/images/profesional/product-market.jpg",
  alerts: "/images/profesional/product-alerts.jpg",
  reports: "/images/profesional/product-reports.jpg",
  trust: "/images/profesional/product-trust.jpg",
  insightOne: "/images/profesional/insight-1.jpg",
  insightTwo: "/images/profesional/insight-2.jpg",
  insightThree: "/images/profesional/insight-3.jpg",
} as const;

export const PRODUCT_CARDS = [
  { key: "briefing" as const, id: "ringkasan", href: `${PROFESIONAL_ROUTES.products}#ringkasan`, image: PROFESIONAL_IMAGES.briefing },
  { key: "issues" as const, id: "isu", href: `${PROFESIONAL_ROUTES.products}#isu`, image: PROFESIONAL_IMAGES.issues },
  { key: "market" as const, id: "pasar", href: `${PROFESIONAL_ROUTES.products}#pasar`, image: PROFESIONAL_IMAGES.market },
  { key: "alerts" as const, id: "peringatan", href: `${PROFESIONAL_ROUTES.products}#peringatan`, image: PROFESIONAL_IMAGES.alerts },
  { key: "reports" as const, id: "laporan", href: `${PROFESIONAL_ROUTES.products}#laporan`, image: PROFESIONAL_IMAGES.reports },
  { key: "trust" as const, id: "sumber", href: PROFESIONAL_ROUTES.insights, image: PROFESIONAL_IMAGES.trust },
];

export const SOLUTION_LINKS = [
  { key: "audienceDirectors" as const, href: PROFESIONAL_ROUTES.leadership },
  { key: "audienceComms" as const, href: PROFESIONAL_ROUTES.solutions },
  { key: "audienceRisk" as const, href: PROFESIONAL_ROUTES.solutions },
  { key: "audienceGroup" as const, href: PROFESIONAL_ROUTES.solutions },
  { key: "directionSelf" as const, href: PROFESIONAL_ROUTES.products },
  { key: "directionCompetitor" as const, href: PROFESIONAL_ROUTES.products },
  { key: "directionMarket" as const, href: PROFESIONAL_ROUTES.products },
  { key: "productReports" as const, href: `${PROFESIONAL_ROUTES.products}#laporan` },
];

export const INSIGHT_CARDS = [
  { key: "one" as const, href: PROFESIONAL_ROUTES.leadership, image: PROFESIONAL_IMAGES.insightOne },
  { key: "two" as const, href: PROFESIONAL_ROUTES.products, image: PROFESIONAL_IMAGES.insightTwo },
  { key: "three" as const, href: PROFESIONAL_ROUTES.insights, image: PROFESIONAL_IMAGES.insightThree },
];

export const MEGA_FEATURES = [
  { key: "megaOverview" as const, href: PROFESIONAL_ROUTES.products },
  { key: "megaAi" as const, href: PROFESIONAL_ROUTES.leadership },
  { key: "megaCompany" as const, href: PROFESIONAL_ROUTES.products },
  { key: "megaWatch" as const, href: PROFESIONAL_ROUTES.leadership },
];

export const PAGE_BANNERS = {
  products: PROFESIONAL_IMAGES.briefing,
  solutions: PROFESIONAL_IMAGES.market,
  leadership: PROFESIONAL_IMAGES.reports,
  insights: PROFESIONAL_IMAGES.trust,
  support: PROFESIONAL_IMAGES.alerts,
} as const;

export function isProfesionalPath(pathname: string) {
  return pathname === PROFESIONAL_PATH || pathname.startsWith(`${PROFESIONAL_PATH}/`);
}

export function profesionalDefaultPath(pathname: string) {
  if (pathname === PROFESIONAL_PATH || pathname.startsWith(`${PROFESIONAL_PATH}/`)) {
    return `/${PROFESIONAL_LOCALE}${pathname}`;
  }

  return null;
}
