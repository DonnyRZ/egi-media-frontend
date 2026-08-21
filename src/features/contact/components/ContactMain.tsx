import Image from "next/image";
import { useTranslations } from "next-intl";

import { ContactForm } from "@/features/contact/components/ContactForm";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_IMAGE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "@/features/contact/constants/contact.constants";
import { Container } from "@/shared/components/layout/Container";
import { Section } from "@/shared/components/layout/Section";

export function ContactMain() {
  const t = useTranslations("contact");

  return (
    <Section ariaLabelledby="contact-form-heading">
      <Container>
        <div className="max-w-3xl">
          <p className="kicker">{t("formKicker")}</p>
          <h1
            className="mt-3 font-serif text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-5xl"
            id="contact-form-heading"
          >
            {t("formHeadline")}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 lg:text-lg">
            {t("formLede")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-12 md:grid-cols-2 lg:mt-12 lg:gap-16">
          <div>
            <ContactForm />
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
            <Image
              alt={t("imageAlt")}
              className="h-full w-full object-cover"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              src={CONTACT_IMAGE}
            />
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 lg:mt-16 lg:pt-10">
          <h2 className="sr-only" id="contact-details-heading">
            {t("kicker")}
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                {t("studioTitle")}
              </h3>
              <p className="mt-3 font-serif text-xl font-bold text-ink sm:text-2xl">
                {t("building")}
              </p>
              <p className="mt-2 text-sm leading-6 text-neutral-700 lg:text-base lg:leading-7">
                {t("addressLine")}
              </p>
              <p className="text-sm leading-6 text-neutral-700 lg:text-base lg:leading-7">
                {t("addressCity")}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                {t("callTitle")}
              </h3>
              <a
                className="mt-3 inline-block font-serif text-xl font-semibold text-ink transition-colors hover:text-accent"
                href={CONTACT_PHONE_HREF}
              >
                {CONTACT_PHONE_DISPLAY}
              </a>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-accent">
                {t("mailTitle")}
              </h3>
              <a
                className="mt-3 inline-block font-serif text-xl font-semibold text-ink transition-colors hover:text-accent"
                href={CONTACT_EMAIL_HREF}
              >
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
