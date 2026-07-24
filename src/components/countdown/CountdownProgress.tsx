"use client";

import { motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { interpolateTemplate } from "@/lib/countdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function CountdownProgress({ progress }: { progress: number }) {
  const reduceMotion = useReducedMotion();
  const percentage = Math.round(Math.min(1, Math.max(0, progress)) * 100);
  const text = interpolateTemplate(siteConfig.copy.countdown.progressTemplate, {
    percentage,
  });

  return (
    <section className="progress-panel" aria-label="Waiting progress">
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        aria-label={text}
      >
        <motion.div
          className="progress-fill"
          animate={{ width: `${percentage}%` }}
          initial={false}
          transition={{ duration: reduceMotion ? 0 : 0.5, ease: "easeOut" }}
        />
      </div>
      <p className="progress-text">{text}</p>
    </section>
  );
}
