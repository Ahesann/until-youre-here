"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type TapParticle = {
  id: number;
  x: number;
  y: number;
};

const PARTICLE_TTL = 900;

export function TapParticles() {
  const reduceMotion = useReducedMotion();
  const [particles, setParticles] = useState<TapParticle[]>([]);
  const idRef = useRef(0);
  const lastCreatedAtRef = useRef(0);

  const removeParticle = useCallback((id: number) => {
    setParticles((current) => current.filter((particle) => particle.id !== id));
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) {
        return;
      }

      if (target.closest("button, input, a, textarea, select, [role='dialog']")) {
        return;
      }

      const now = Date.now();
      if (now - lastCreatedAtRef.current < 520) {
        return;
      }

      lastCreatedAtRef.current = now;
      idRef.current += 1;

      const particle = {
        id: idRef.current,
        x: event.clientX,
        y: event.clientY,
      };

      setParticles((current) => [...current.slice(-14), particle]);
      window.setTimeout(() => removeParticle(particle.id), PARTICLE_TTL);
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [reduceMotion, removeParticle]);

  return (
    <div className="tap-particle-layer" aria-hidden="true">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="tap-particle"
            style={{ left: particle.x, top: particle.y }}
            initial={{ opacity: 0, y: 8, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 0.9, y: -22, scale: 1, rotate: 8 }}
            exit={{ opacity: 0, y: -34, scale: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Heart aria-hidden="true" size={14} fill="currentColor" />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
