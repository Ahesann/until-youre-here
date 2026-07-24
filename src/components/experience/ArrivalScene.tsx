"use client";

import { motion } from "motion/react";
import { Heart, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { JourneyRoute } from "@/components/journey/JourneyRoute";
import { ResetExperienceButton } from "@/components/controls/ResetExperienceButton";
import { PetalField } from "@/components/effects/PetalField";
import { StarField } from "@/components/effects/StarField";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function ArrivalScene({
  onOpenNextChapter,
  onReplay,
  onPlaneEasterEgg,
}: {
  onOpenNextChapter: () => void;
  onReplay: () => void;
  onPlaneEasterEgg: () => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="arrival-card container" aria-labelledby="arrival-heading">
      <StarField warmth={1} />
      <PetalField count={4} />
      <motion.div
        aria-hidden="true"
        className="arrival-heart-glow"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.08 : 0.9, ease: "easeOut" }}
      >
        <Heart size={56} fill="currentColor" />
      </motion.div>
      <motion.h1
        id="arrival-heading"
        className="section-heading"
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: "easeOut" }}
      >
        {siteConfig.copy.arrival.heading}
      </motion.h1>
      <motion.p
        id="arrival-final-message"
        className="arrival-message"
        tabIndex={-1}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: reduceMotion ? 0 : 0.12, duration: 0.42 }}
      >
        {siteConfig.copy.arrival.message}
      </motion.p>
      <div className="arrival-actions">
        <button
          type="button"
          className="quiet-button"
          onClick={onOpenNextChapter}
          aria-label={siteConfig.copy.arrival.cta}
        >
          <Sparkles aria-hidden="true" size={17} />
          <span>{siteConfig.copy.arrival.cta}</span>
        </button>
        <ResetExperienceButton onReplay={onReplay} />
      </div>
      <JourneyRoute progress={1} onPlaneEasterEgg={onPlaneEasterEgg} />
    </section>
  );
}
