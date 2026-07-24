"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Celebration({ burstKey }: { burstKey: number }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (burstKey <= 0 || typeof window === "undefined") {
      return;
    }

    let cancelled = false;

    async function runCelebration() {
      const { default: confetti } = await import("canvas-confetti");

      if (cancelled) {
        return;
      }

      const particleCount = reduceMotion ? 12 : 42;
      const shared = {
        spread: reduceMotion ? 38 : 58,
        ticks: reduceMotion ? 80 : 140,
        scalar: reduceMotion ? 0.58 : 0.8,
        colors: ["#ead09a", "#f8f1e7", "#c98f9a", "#efb39b"],
        disableForReducedMotion: true,
      };

      confetti({
        ...shared,
        particleCount,
        origin: { x: 0.28, y: 0.72 },
        angle: 62,
      });

      confetti({
        ...shared,
        particleCount: Math.max(8, Math.floor(particleCount * 0.72)),
        origin: { x: 0.72, y: 0.72 },
        angle: 118,
      });
    }

    void runCelebration();

    return () => {
      cancelled = true;
    };
  }, [burstKey, reduceMotion]);

  return <div className="celebration-layer" aria-hidden="true" />;
}
