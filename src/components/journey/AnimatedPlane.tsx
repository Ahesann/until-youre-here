"use client";

import { motion } from "motion/react";
import { Plane, Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function AnimatedPlane({
  x,
  y,
  onActivate,
}: {
  x: number;
  y: number;
  onActivate: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className="plane-button"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      onClick={onActivate}
      aria-label="Tap the aeroplane on its way to London"
      animate={
        reduceMotion
          ? undefined
          : {
              y: ["-50%", "calc(-50% - 5px)", "-50%"],
            }
      }
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <Heart className="plane-heart" aria-hidden="true" size={14} fill="currentColor" />
      <Plane aria-hidden="true" size={28} />
    </motion.button>
  );
}
