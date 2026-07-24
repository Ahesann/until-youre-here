"use client";

import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { createSeededPoints } from "@/lib/seededRandom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const StarField = memo(function StarField({
  expanded = false,
  warmth = 0,
}: {
  expanded?: boolean;
  warmth?: number;
}) {
  const reduceMotion = useReducedMotion();
  const stars = useMemo(() => createSeededPoints(46, 20260915), []);

  return (
    <div
      aria-hidden="true"
      className="scene-layer star-layer"
      style={{ opacity: Math.max(0.24, 1 - warmth * 0.55) }}
    >
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            opacity: star.opacity,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  x: expanded ? (star.x - 50) * 0.08 : 0,
                  y: expanded ? (star.y - 50) * 0.08 : 0,
                  opacity: [star.opacity * 0.6, star.opacity, star.opacity * 0.75],
                }
          }
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});
