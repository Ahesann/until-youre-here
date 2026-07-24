"use client";

import { useCallback, useRef } from "react";

export function useTapSequence({
  requiredTaps,
  windowMs,
  onComplete,
}: {
  requiredTaps: number;
  windowMs: number;
  onComplete: () => void;
}) {
  const tapsRef = useRef<number[]>([]);

  return useCallback(() => {
    const now = Date.now();
    tapsRef.current = [...tapsRef.current, now].filter(
      (timestamp) => now - timestamp <= windowMs,
    );

    if (tapsRef.current.length >= requiredTaps) {
      tapsRef.current = [];
      onComplete();
    }
  }, [onComplete, requiredTaps, windowMs]);
}
