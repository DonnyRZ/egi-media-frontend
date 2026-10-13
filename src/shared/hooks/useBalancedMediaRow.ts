"use client";

import { useEffect, useRef, useState } from "react";

import { chooseMediaWidth, mediaWidthCandidates } from "@/shared/utils/media-row-layout";

function createMeasurement(frame: HTMLDivElement, copy: HTMLDivElement, layout: HTMLElement, update: (width: number | undefined) => void) {
  let previousKey = "";
  return (fontRevision = 0) => {
    if (!frame.getClientRects().length) return;
    const width = layout.getBoundingClientRect().width;
    const gap = Number.parseFloat(getComputedStyle(layout).columnGap) || 0;
    const scale = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
    const style = getComputedStyle(copy.querySelector(".media-row-heading") ?? copy);
    const key = [width, gap, scale, fontRevision, style.font, style.letterSpacing, style.wordSpacing, copy.textContent].join("|");
    if (key === previousKey) return;
    previousKey = key;
    const probe = copy.cloneNode(true) as HTMLDivElement;
    probe.setAttribute("aria-hidden", "true");
    probe.setAttribute("inert", "");
    probe.querySelectorAll("[id]").forEach((node) => node.removeAttribute("id"));
    Object.assign(probe.style, { position: "absolute", left: "-10000px", top: "0", visibility: "hidden", pointerEvents: "none", margin: "0" });
    layout.appendChild(probe);
    try {
      const candidates = mediaWidthCandidates(width, gap, scale).map((candidate) => {
        probe.style.width = `${width - gap - candidate}px`;
        return { width: candidate, textHeight: probe.getBoundingClientRect().height };
      });
      update(chooseMediaWidth(candidates, scale));
    } finally { probe.remove(); }
  };
}

export function useBalancedMediaRow() {
  const frameRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const [mediaWidth, setMediaWidth] = useState<number>();

  useEffect(() => {
    const frame = frameRef.current;
    const copy = copyRef.current;
    const layout = copy?.parentElement;
    if (!frame || !copy || !layout || typeof ResizeObserver === "undefined") return;
    let disposed = false;
    let animation = 0;
    let fontRevision = 0;
    const measureCopy = createMeasurement(frame, copy, layout, setMediaWidth);
    const measure = () => {
      animation = 0;
      if (!disposed) measureCopy(fontRevision);
    };
    const schedule = () => { if (!disposed && !animation) animation = requestAnimationFrame(measure); };
    const scheduleFonts = () => { fontRevision += 1; schedule(); };
    const resize = new ResizeObserver(schedule);
    resize.observe(frame);
    resize.observe(copy);
    const mutation = new MutationObserver(schedule);
    mutation.observe(copy, { childList: true, characterData: true, subtree: true });
    document.fonts.addEventListener("loadingdone", scheduleFonts);
    void document.fonts.ready.then(scheduleFonts);
    schedule();
    return () => {
      disposed = true;
      cancelAnimationFrame(animation);
      resize.disconnect();
      mutation.disconnect();
      document.fonts.removeEventListener("loadingdone", scheduleFonts);
    };
  }, []);

  return { frameRef, copyRef, mediaWidth };
}
