"use client";

import { motion } from "motion/react";
import { Plane, Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AnimatedPlane({
  x,
  y,
  angle = 0,
  onActivate,
}: {
  x: number;
  y: number;
  angle?: number;
  onActivate: () => void;
}) {
  const reduceMotion = useReducedMotion();

  // Lucide Plane icon points top-right (45 deg) by default, adjust by -45 to align nose with path tangent angle
  const planeRotation = angle - 45;

  return (
    <motion.button
      type="button"
      className="plane-button"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -50%)",
      }}
      onClick={onActivate}
      aria-label="Tap the aeroplane on its way to London"
      animate={
        reduceMotion
          ? undefined
          : {
              scale: [1, 1.05, 1],
            }
      }
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="plane-heart" aria-hidden="true" size={14} fill="currentColor" />
      <Plane
        aria-hidden="true"
        size={28}
        style={{
          transform: `rotate(${planeRotation}deg)`,
          transition: "transform 0.3s ease-out",
        }}
      />
    </motion.button>
  );
}
