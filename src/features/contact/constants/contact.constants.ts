export const CONTACT_PHONE_DISPLAY = "+62 813 1877 806";
export const CONTACT_PHONE_HREF = "tel:+628131877806";
export const CONTACT_EMAIL = "egi.egimedia@gmail.com";
export const CONTACT_EMAIL_HREF = "mailto:egi.egimedia@gmail.com";

export const CONTACT_IMAGE = "/images/kontak/Ica-cathy.webp";

export const CONTACT_INQUIRY_TYPES = [
  "general",
  "advertising",
  "editorial",
  "other",
] as const;

export type ContactInquiryType = (typeof CONTACT_INQUIRY_TYPES)[number];

export const CONTACT_INQUIRY_LABELS: Record<ContactInquiryType, string> = {
  general: "General Inquiry",
  advertising: "Advertising & Partnerships",
  editorial: "Editorial/Press",
  other: "Other",
};

export const CONTACT_MAP_QUERY =
  "Oscorp Building, Jl. Darmawangsa Raya No.16, RT.6/RW.1, Pulo, Kebayoran Baru, South Jakarta City, Jakarta 12160, Indonesia";

export const CONTACT_MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(CONTACT_MAP_QUERY)}&z=16&output=embed`;

export const CONTACT_MAP_OPEN_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT_MAP_QUERY)}`;
