"use client";

import { AnimatePresence, motion } from "motion/react";
import { formatUnit } from "@/lib/countdown";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { CountdownPart } from "@/types";

export function CountdownCard({
  part,
  asButton = false,
  onActivate,
}: {
  part: CountdownPart;
  asButton?: boolean;
  onActivate?: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const value = String(part.value).padStart(part.key === "days" ? 2 : 2, "0");
  const content = (
    <>
      <span className="countdown-value" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="countdown-label">{part.label}</span>
    </>
  );

  if (asButton) {
    return (
      <div className="countdown-card glass">
        <button
          type="button"
          className="seconds-button"
          onClick={onActivate}
          aria-label={`${formatUnit(part.value, "second")} remaining`}
        >
          {content}
        </button>
      </div>
    );
  }

  return (
    <div
      className="countdown-card glass"
      aria-label={`${formatUnit(part.value, part.label.slice(0, -1))} remaining`}
    >
      {content}
    </div>
  );
}
