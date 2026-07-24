"use client";

import { useCallback, useRef } from "react";

type Point = {
  x: number;
  y: number;
};

export function useLongPress({
  delay = 2_000,
  moveTolerance = 12,
  onProgress,
  onComplete,
  onCancel,
}: {
  delay?: number;
  moveTolerance?: number;
  onProgress?: (progress: number) => void;
  onComplete: () => void;
  onCancel?: () => void;
}) {
  const timerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const pointRef = useRef<Point | null>(null);
  const completedRef = useRef(false);

  const clear = useCallback(
    (didCancel: boolean) => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }

      timerRef.current = null;
      frameRef.current = null;
      pointRef.current = null;

      if (didCancel && !completedRef.current) {
        onProgress?.(0);
        onCancel?.();
      }

      completedRef.current = false;
    },
    [onCancel, onProgress],
  );

  const start = useCallback(
    (point?: Point) => {
      clear(false);
      completedRef.current = false;
      startRef.current = Date.now();
      pointRef.current = point ?? null;

      const tick = () => {
        const elapsed = Date.now() - startRef.current;
        onProgress?.(Math.min(1, elapsed / delay));

        if (elapsed < delay && timerRef.current) {
          frameRef.current = window.requestAnimationFrame(tick);
        }
      };

      frameRef.current = window.requestAnimationFrame(tick);
      timerRef.current = window.setTimeout(() => {
        completedRef.current = true;
        onProgress?.(1);
        onComplete();
        clear(false);
      }, delay);
    },
    [clear, delay, onComplete, onProgress],
  );

  const cancel = useCallback(() => clear(true), [clear]);

  const pointerMove = useCallback(
    (point: Point) => {
      if (!pointRef.current || !timerRef.current) {
        return;
      }

      const distance = Math.hypot(
        point.x - pointRef.current.x,
        point.y - pointRef.current.y,
      );

      if (distance > moveTolerance) {
        cancel();
      }
    },
    [cancel, moveTolerance],
  );

  return {
    start,
    cancel,
    pointerMove,
  };
}
