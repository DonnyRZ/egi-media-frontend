"use client";

import { useEffect, useRef, useState } from "react";

const TOP_REVEAL_PX = 64;
const DELTA_THRESHOLD_PX = 6;

/**
 * Visible at page top and while scrolling up; hidden while scrolling down.
 */
export function useScrollHeaderVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastYRef.current = window.scrollY;

    function update() {
      const y = window.scrollY;
      const lastY = lastYRef.current;
      const delta = y - lastY;

      if (y <= TOP_REVEAL_PX) {
        setIsVisible(true);
      } else if (delta > DELTA_THRESHOLD_PX) {
        setIsVisible(false);
      } else if (delta < -DELTA_THRESHOLD_PX) {
        setIsVisible(true);
      }

      lastYRef.current = y;
      tickingRef.current = false;
    }

    function onScroll() {
      if (tickingRef.current) return;
      tickingRef.current = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return isVisible;
}
