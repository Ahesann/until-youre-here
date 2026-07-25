"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import type { RefObject } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function HiddenHeart({
  visible,
  prominent,
  found,
  disabled,
  onFound,
  buttonRef,
}: {
  visible: boolean;
  prominent: boolean;
  found: boolean;
  disabled: boolean;
  onFound: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={`hidden-heart-button ${visible ? "is-visible" : ""} ${
        prominent ? "is-prominent" : ""
      }`}
      onClick={onFound}
      disabled={!visible || disabled}
      aria-label="Find the hidden heart"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      data-testid="hidden-heart-button"
      initial={false}
      animate={
        found && !reduceMotion
          ? { opacity: 1, scale: [1, 1.72, 1.28] }
          : found
            ? { opacity: 1, scale: 1.18 }
            : visible && !reduceMotion
              ? { opacity: prominent ? 1 : 0.66, scale: [1, 1.08, 1] }
              : { opacity: visible ? 0.86 : 0, scale: 1 }
      }
      transition={{
        opacity: { duration: 0.22 },
        scale: {
          duration: found ? 0.72 : 2.7,
          repeat: visible && !found && !reduceMotion ? Infinity : 0,
        },
      }}
    >
      <Heart aria-hidden="true" size={17} fill="currentColor" />
    </motion.button>
  );
}
