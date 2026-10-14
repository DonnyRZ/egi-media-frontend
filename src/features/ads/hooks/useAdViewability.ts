"use client";
import { useEffect, useRef } from "react";
import { recordAdImpression } from "@/shared/repositories/ads.repository";
export function useAdViewability(id: string | undefined, imageUrl: string | undefined, loaded: boolean) {
  const mediaRef = useRef<HTMLDivElement>(null);
  const recorded = useRef<string | null>(null);
  useEffect(() => {
    const element = mediaRef.current;
    if (!id || !imageUrl || !loaded || !element || typeof IntersectionObserver === "undefined") return;
    const key = `${id}:${imageUrl}`;
    if (recorded.current === key) return;
    let visible = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const update = () => {
      clearTimeout(timer);
      if (!visible || document.hidden || recorded.current === key) return;
      timer = setTimeout(() => {
        recorded.current = key;
        void recordAdImpression(id).catch(() => { recorded.current = null; });
      }, 1000);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting && entry.intersectionRatio >= 0.5; update();
    }, { threshold: [0, 0.5, 1] });
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    return () => { clearTimeout(timer); observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [id, imageUrl, loaded]);
  return mediaRef;
}
