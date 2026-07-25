"use client";

/* eslint-disable react-hooks/set-state-in-effect -- burst visibility is triggered by a numeric event key. */

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart } from "lucide-react";
import { createSeededRandom } from "@/lib/seededRandom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type BurstParticle = {
  id: number;
  x: number;
  y: number;
  rotate: number;
  size: number;
};

export function HeartBurst({
  burstKey,
  count = 4,
  large = false,
}: {
  burstKey: number;
  count?: number;
  large?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const particles = useMemo<BurstParticle[]>(() => {
    const random = createSeededRandom(9100 + burstKey * 53);
    const particleCount = reduceMotion ? Math.min(5, count) : count;

    return Array.from({ length: particleCount }, (_, index) => ({
      id: index,
      x: (random() - 0.5) * (large ? 190 : 88),
      y: -20 - random() * (large ? 150 : 70),
      rotate: (random() - 0.5) * 56,
      size: 9 + random() * (large ? 9 : 4),
    }));
  }, [burstKey, count, large, reduceMotion]);

  useEffect(() => {
    if (burstKey <= 0) {
      return undefined;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), large ? 1_250 : 820);
    return () => window.clearTimeout(timeoutId);
  }, [burstKey, large]);

  return (
    <span className="surprise-burst-layer" aria-hidden="true">
      <AnimatePresence>
        {visible
          ? particles.map((particle) => (
              <motion.span
                key={`${burstKey}-${particle.id}`}
                className="surprise-heart-particle"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.7, rotate: 0 }}
                animate={{
                  opacity: [0, 0.94, 0],
                  x: particle.x,
                  y: particle.y,
                  scale: [0.7, 1, 0.58],
                  rotate: particle.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0.22 : large ? 1.15 : 0.78,
                  ease: "easeOut",
                }}
              >
                <Heart size={particle.size} fill="currentColor" />
              </motion.span>
            ))
          : null}
      </AnimatePresence>
    </span>
  );
}
