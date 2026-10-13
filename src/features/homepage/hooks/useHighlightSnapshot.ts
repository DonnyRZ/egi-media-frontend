"use client";

import { useEffect, useRef, useState } from "react";
import type { HomepageHighlightsData } from "../types/highlights.types";

/** Query may refresh, but a focused reader or an ongoing gesture keeps its snapshot. */
export function useHighlightSnapshot(data: HomepageHighlightsData | undefined, version = 0) {
  const [snapshot, setSnapshot] = useState(data);
  const [focused, setFocused] = useState(false);
  const [gesturing, setGesturing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const frameRef = useRef<HTMLDivElement>(null);
  // First successful load has no previous reading context to interrupt.
  if ((!snapshot || (!focused && !gesturing)) && data !== snapshot) setSnapshot(data);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    // A successful retry can remove its focused button without emitting blur.
    if (focused && frameRef.current && !frameRef.current.contains(document.activeElement)) setFocused(false);
  }, [focused, version]);
  const gesture = () => {
    setGesturing(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setGesturing(false), 500);
  };
  return { snapshot, frameRef, setFocused, gesture, endGesture: () => setGesturing(false) };
}
