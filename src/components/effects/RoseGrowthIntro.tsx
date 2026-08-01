"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { RealisticRose } from "./RealisticRose";
import { PetalField } from "./PetalField";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function RoseGrowthIntro({ onComplete }: { onComplete: () => void }) {
  const reduceMotion = useReducedMotion();
  const [growth, setGrowth] = useState(reduceMotion ? 1 : 0);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      onComplete();
      return;
    }

    // Growth animation from root (0) to full bloom (1) over 3.4 seconds
    const startTime = performance.now();
    const duration = 3400;

    let frameId: number;
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      setGrowth(progress);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        // Hold bloom for 700ms then transition out smoothly
        window.setTimeout(() => {
          setFadingOut(true);
          window.setTimeout(onComplete, 800);
        }, 700);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [reduceMotion, onComplete]);

  const handleSkip = () => {
    setFadingOut(true);
    window.setTimeout(onComplete, 200);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 bg-[#faf4ec] text-[#3b1219] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: fadingOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
      onClick={handleSkip}
    >
      <PetalField count={12} />

      {/* Top Header Message */}
      <div className="pt-8 text-center z-10">
        <motion.h2
          className="text-2xl md:text-3xl font-serif italic text-[#881337] tracking-wide"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: growth > 0.15 ? 1 : 0, y: growth > 0.15 ? 0 : -15 }}
          transition={{ duration: 0.8 }}
        >
          {growth < 0.55
            ? "Rooted in love..."
            : "My heart blooms for you..."}
        </motion.h2>
        <p className="text-xs text-[#9f495d] mt-2 underline underline-offset-4 cursor-pointer">
          Tap anywhere to skip intro
        </p>
      </div>

      {/* Root-to-Flower Growth Container (Anchored at the Bottom of Screen) */}
      <div className="relative flex flex-col items-center justify-end w-full flex-1 mb-0 pb-0">
        <motion.div
          className="transform origin-bottom"
          initial={{ y: 50, opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <RealisticRose size={260} growthProgress={growth} showStem={true} />
        </motion.div>

        {/* Root Ground Glow Base */}
        <div className="w-48 h-3 bg-gradient-to-r from-transparent via-[#881337]/20 to-transparent blur-sm rounded-full mb-2" />
      </div>
    </motion.div>
  );
}
