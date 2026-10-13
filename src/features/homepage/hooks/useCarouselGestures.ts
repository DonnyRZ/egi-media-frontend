"use client";

import { useRef } from "react";
import type { MouseEvent, PointerEvent, WheelEvent } from "react";

export function useCarouselGestures(move: (direction: number) => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const wheel = useRef({ distance: 0, time: 0, moved: 0 });
  const onWheel = (event: WheelEvent) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    const now = Date.now();
    if (now - wheel.current.time > 300) wheel.current.distance = 0;
    wheel.current.time = now;
    wheel.current.distance += event.deltaX;
    if (Math.abs(wheel.current.distance) >= 40 && now - wheel.current.moved > 500) {
      move(wheel.current.distance > 0 ? 1 : -1);
      wheel.current = { distance: 0, time: now, moved: now };
    }
  };
  const onPointerDown = (event: PointerEvent) => {
    start.current = { x: event.clientX, y: event.clientY }; swiped.current = false;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (start.current && Math.abs(event.clientX - start.current.x) > 50 && Math.abs(event.clientY - start.current.y) < 50) {
      swiped.current = true; move(event.clientX < start.current.x ? 1 : -1);
    }
    start.current = null;
  };
  const onClickCapture = (event: MouseEvent) => {
    if (swiped.current) { event.preventDefault(); event.stopPropagation(); swiped.current = false; }
  };
  return { onWheel, onPointerDown, onPointerUp, onClickCapture,
    onPointerCancel: () => { start.current = null; }, onDragStart: (event: MouseEvent) => event.preventDefault() };
}
