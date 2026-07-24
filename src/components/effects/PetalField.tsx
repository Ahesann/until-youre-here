"use client";

import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { createSeededPoints } from "@/lib/seededRandom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const PetalField = memo(function PetalField({
  count = 7,
}: {
  count?: number;
}) {
  const reduceMotion = useReducedMotion();
  const petals = useMemo(() => createSeededPoints(count, 92323), [count]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div aria-hidden="true" className="scene-layer petal-layer">
      {petals.map((petal) => (
        <motion.span
          key={petal.id}
          className="ambient-petal"
          style={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            opacity: petal.opacity * 0.65,
          }}
          animate={{
            x: [0, 18 + petal.size * 3, -10],
            y: [0, 36 + petal.size * 8, 8],
            rotate: [0, 12, -8],
          }}
          transition={{
            duration: petal.duration + 12,
            delay: petal.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});
