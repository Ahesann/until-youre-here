"use client";

import { memo, useMemo } from "react";
import { motion } from "motion/react";
import { RealisticRose } from "./RealisticRose";
import { createSeededPoints } from "@/lib/seededRandom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export const RoseBackgroundField = memo(function RoseBackgroundField({
  count = 18,
}: {
  count?: number;
}) {
  const reduceMotion = useReducedMotion();
  const roses = useMemo(() => createSeededPoints(count, 99231), [count]);

  if (reduceMotion) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-60"
    >
      {roses.map((rose) => (
        <motion.div
          key={rose.id}
          className="absolute"
          style={{
            left: `${rose.x}%`,
            top: `${rose.y}%`,
            opacity: 0.35 + rose.opacity * 0.45,
          }}
          animate={{
            y: [0, 18 + rose.size * 4, -12],
            rotate: [-10, 10, -10],
            scale: [0.94, 1.06, 0.94],
          }}
          transition={{
            duration: rose.duration + 7,
            delay: rose.delay,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        >
          <RealisticRose
            size={40 + Math.round(rose.size * 35)}
            growthProgress={1}
            showStem={true}
          />
        </motion.div>
      ))}
    </div>
  );
});
