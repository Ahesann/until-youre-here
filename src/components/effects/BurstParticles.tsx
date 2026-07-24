"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { createSeededRandom } from "@/lib/seededRandom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type BurstParticle = {
  id: number;
  dx: number;
  dy: number;
  rotate: number;
};

export function BurstParticles({
  burstKey,
  origin = "center",
}: {
  burstKey: number;
  origin?: "center" | "plane" | "heart";
}) {
  const reduceMotion = useReducedMotion();
  const particles = useMemo<BurstParticle[]>(() => {
    const random = createSeededRandom(5000 + burstKey * 37);
    const count = reduceMotion ? 4 : 10;

    return Array.from({ length: count }, (_, index) => ({
      id: index,
      dx: (random() - 0.5) * 120,
      dy: -30 - random() * 90,
      rotate: (random() - 0.5) * 46,
    }));
  }, [burstKey, reduceMotion]);

  return (
    <div className={`burst-layer ${origin}`} aria-hidden="true">
      <AnimatePresence>
        {burstKey > 0
          ? particles.map((particle) => (
              <motion.span
                key={`${burstKey}-${particle.id}`}
                className="burst-particle"
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.7 }}
                animate={{
                  opacity: [0, 0.92, 0],
                  x: particle.dx,
                  y: particle.dy,
                  rotate: particle.rotate,
                  scale: [0.7, 1, 0.55],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.25 : 0.82, ease: "easeOut" }}
              >
                <Heart size={12} fill="currentColor" />
              </motion.span>
            ))
          : null}
      </AnimatePresence>
    </div>
  );
}
