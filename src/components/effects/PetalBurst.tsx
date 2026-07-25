"use client";

/* eslint-disable react-hooks/set-state-in-effect -- burst visibility is triggered by a numeric event key. */

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { createSeededRandom } from "@/lib/seededRandom";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type Petal = {
  id: number;
  x: number;
  y: number;
  rotate: number;
};

export function PetalBurst({
  burstKey,
  count = 16,
}: {
  burstKey: number;
  count?: number;
}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const petals = useMemo<Petal[]>(() => {
    const random = createSeededRandom(12000 + burstKey * 31);
    const particleCount = reduceMotion ? Math.min(6, count) : count;

    return Array.from({ length: particleCount }, (_, index) => ({
      id: index,
      x: (random() - 0.5) * 220,
      y: -28 - random() * 150,
      rotate: (random() - 0.5) * 120,
    }));
  }, [burstKey, count, reduceMotion]);

  useEffect(() => {
    if (burstKey <= 0) {
      return undefined;
    }

    setVisible(true);
    const timeoutId = window.setTimeout(() => setVisible(false), 1_250);
    return () => window.clearTimeout(timeoutId);
  }, [burstKey]);

  return (
    <span className="surprise-burst-layer petals" aria-hidden="true">
      <AnimatePresence>
        {visible
          ? petals.map((petal) => (
              <motion.span
                key={`${burstKey}-${petal.id}`}
                className="surprise-petal-particle"
                initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [0, 0.8, 0],
                  x: petal.x,
                  y: petal.y,
                  rotate: petal.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0.24 : 1.15, ease: "easeOut" }}
              />
            ))
          : null}
      </AnimatePresence>
    </span>
  );
}
