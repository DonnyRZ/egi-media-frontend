"use client";

import { useTranslations } from "next-intl";

import { Container } from "@/shared/components/layout/Container";
import { cn } from "@/shared/lib/cn";
import { useClock } from "@/features/world-clock/hooks/useClock";
import { WORLD_CLOCK_CITIES } from "@/features/world-clock/constants/world-clock.constants";
import { formatClockTime } from "@/features/world-clock/utils/formatClockTime";

const PLACEHOLDER = "--:--";

interface ClockItemProps {
  label: string;
  time: string;
  accent?: boolean;
}

function ClockItem({ label, time, accent = false }: ClockItemProps) {
  return (
    <div className="flex shrink-0 items-baseline gap-1.5">
      {accent ? (
        <span
          aria-hidden="true"
          className="mr-0.5 inline-block h-1.5 w-1.5 animate-pulse self-center rounded-full bg-accent"
        />
      ) : null}
      <span
        className={cn(
          "text-[11px] font-bold uppercase tracking-[0.12em]",
          accent ? "text-accent" : "text-neutral-500",
        )}
      >
        {label}
      </span>
      <span className="font-serif text-sm font-semibold tabular-nums text-ink">
        {time}
      </span>
    </div>
  );
}

export function WorldClock() {
  const now = useClock();
  const t = useTranslations("worldClock");

  return (
    <section
      aria-label={t("ariaLabel")}
      className="border-b border-neutral-200 bg-neutral-50"
    >
      <Container>
        <div className="flex items-center gap-5 overflow-x-auto py-2.5 scrollbar-hide sm:gap-8">
          <ClockItem
            accent
            label={t("local")}
            time={now ? formatClockTime(now) : PLACEHOLDER}
          />
          <span aria-hidden="true" className="h-3.5 w-px shrink-0 bg-neutral-300" />
          {WORLD_CLOCK_CITIES.map((city) => (
            <ClockItem
              key={city.timeZone}
              label={city.label}
              time={now ? formatClockTime(now, city.timeZone) : PLACEHOLDER}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
