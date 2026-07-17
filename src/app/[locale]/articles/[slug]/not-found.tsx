import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/components/layout/Container";
import { SITE_NAME } from "@/shared/constants/site.constants";

export default function ArticleNotFound() {
  const t = useTranslations("article");

  return (
    <Container className="py-20 text-center">
      <p className="kicker">404</p>
      <h1 className="mt-4 font-serif text-3xl font-bold text-ink sm:text-4xl">
        {t("notFoundTitle")}
      </h1>
      <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-neutral-600">
        {t("notFoundMessage")}
      </p>
      <Link
        className="mt-8 inline-flex border-2 border-ink bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-accent hover:border-accent"
        href="/"
      >
        {SITE_NAME}
      </Link>
    </Container>
  );
}
