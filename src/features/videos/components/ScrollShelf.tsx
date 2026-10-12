"use client";
import { useId, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { useScrollShelf } from "@/features/videos/hooks/useScrollShelf";
interface ScrollShelfProps {
  title: string;
  children: ReactNode;
}
interface ShelfControlsProps {
  id: string;
  model: ReturnType<typeof useScrollShelf>;
}
function ShelfControls({ id, model }: ShelfControlsProps) {
  const t = useTranslations("editorial");
  if (!model.controls.previous && !model.controls.next) return null;
  return (
    <div className="flex gap-2">
      {([-1, 1] as const).map((direction) => (
        <button
          key={direction}
          type="button"
          className="h-11 w-11 rounded-full border border-white/40 disabled:opacity-30"
          aria-label={t(direction === 1 ? "next" : "previous")}
          aria-controls={id}
          disabled={
            direction === 1 ? !model.controls.next : !model.controls.previous
          }
          onClick={() => model.move(direction)}
        >
          {direction === 1 ? "→" : "←"}
        </button>
      ))}
    </div>
  );
}
export function ScrollShelf({ title, children }: ScrollShelfProps) {
  const id = useId();
  const model = useScrollShelf(children);
  return (
    <section className="border-t border-white/20 py-6" aria-label={title}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <ShelfControls id={id} model={model} />
      </div>
      <div
        id={id}
        ref={model.ref}
        className="scrollbar-hide flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3"
        tabIndex={0}
        aria-label={title}
        onScroll={model.update}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            e.preventDefault();
            model.move(e.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        {children}
      </div>
    </section>
  );
}
