import { useTranslations } from "next-intl";

import {
  CONTACT_MAP_EMBED_URL,
  CONTACT_MAP_OPEN_URL,
} from "@/features/contact/constants/contact.constants";
import { SectionHeading } from "@/shared/components/common/SectionHeading";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";

function ExternalLinkIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" viewBox="0 0 24 24">
      <path
        d="M14 4h6v6M20 4l-9 9M10 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function ContactMap() {
  const t = useTranslations("contact");

  return (
    <Section ariaLabelledby="contact-map-heading">
      <Container>
        <SectionHeading
          id="contact-map-heading"
          subtitle={t("mapSubtitle")}
          title={t("mapTitle")}
        />

        <div className="overflow-hidden border border-neutral-300 bg-white">
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
            <iframe
              allowFullScreen
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={CONTACT_MAP_EMBED_URL}
              title={t("mapPlaceName")}
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-neutral-200 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-serif text-lg font-bold text-ink">{t("mapPlaceName")}</p>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
                {t("mapFullAddress")}
              </p>
            </div>
            <a
              className="inline-flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
              href={CONTACT_MAP_OPEN_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              {t("openMaps")}
              <ExternalLinkIcon />
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
