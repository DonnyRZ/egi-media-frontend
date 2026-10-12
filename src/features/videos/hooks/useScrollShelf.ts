"use client";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
function scrollControls(element: HTMLDivElement | null) {
  return element
    ? {
        previous: element.scrollLeft > 2,
        next:
          element.scrollLeft + element.clientWidth < element.scrollWidth - 2,
      }
    : { previous: false, next: false };
}
function moveShelf(element: HTMLDivElement | null, direction: number) {
  element?.scrollBy({
    left: direction * element.clientWidth,
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
  });
}
export function useScrollShelf(children: ReactNode) {
  const ref = useRef<HTMLDivElement>(null);
  const [controls, setControls] = useState({ previous: false, next: false });
  const update = useCallback(
    () => setControls(scrollControls(ref.current)),
    [],
  );
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [children, update]);
  return {
    ref,
    controls,
    update,
    move: (direction: number) => moveShelf(ref.current, direction),
  };
}
