export const PROFESIONAL_PATH = "/profesional";

export const PROFESIONAL_ANCHORS = {
  products: "produk",
  solutions: "solusi",
  leadership: "untuk-pimpinan",
  trust: "kepercayaan",
  support: "dukungan",
  demo: "request-demo",
} as const;

export const PROFESIONAL_NAV = [
  { key: "navProducts" as const, href: `#${PROFESIONAL_ANCHORS.products}` },
  { key: "navSolutions" as const, href: `#${PROFESIONAL_ANCHORS.solutions}` },
  { key: "navLeadership" as const, href: `#${PROFESIONAL_ANCHORS.leadership}` },
  { key: "navTrust" as const, href: `#${PROFESIONAL_ANCHORS.trust}` },
  { key: "navSupport" as const, href: `#${PROFESIONAL_ANCHORS.support}` },
];
