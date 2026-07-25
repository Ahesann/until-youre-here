"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type { Rect } from "@/lib/runaway-position";

export function useElementRect<T extends HTMLElement>(): [
  RefObject<T | null>,
  Rect | null,
] {
  const ref = useRef<T | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    let frameId: number | null = null;

    const update = () => {
      const bounds = element.getBoundingClientRect();
      setRect({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      });
    };

    const scheduleUpdate = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(update);
    };

    scheduleUpdate();

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(element);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      observer.disconnect();
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
    };
  }, []);

  return [ref, rect];
}
