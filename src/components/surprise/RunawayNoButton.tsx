"use client";

import { motion } from "motion/react";
import type { PointerEvent as ReactPointerEvent, MouseEvent } from "react";
import type { RefObject } from "react";
import type { Point } from "@/lib/runaway-position";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function RunawayNoButton({
  label,
  position,
  disabled,
  buttonRef,
  onRunAway,
  onKeyboardAttempt,
}: {
  label: string;
  position: Point | null;
  disabled: boolean;
  buttonRef: RefObject<HTMLButtonElement | null>;
  onRunAway: (event: ReactPointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>) => void;
  onKeyboardAttempt: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const positioned = position !== null;

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className={`surprise-button surprise-no ${positioned ? "is-positioned" : ""}`}
      style={positioned ? { left: 0, top: 0 } : undefined}
      disabled={disabled}
      onPointerEnter={onRunAway}
      onPointerDown={(event) => {
        event.preventDefault();
        onRunAway(event);
      }}
      onClick={(event) => {
        event.preventDefault();

        if (event.detail === 0) {
          onKeyboardAttempt();
          return;
        }

        onRunAway(event);
      }}
      animate={
        positioned
          ? {
              x: position.x,
              y: position.y,
              rotate: reduceMotion ? 0 : [-2, 2, 0],
            }
          : undefined
      }
      transition={{
        x: { duration: reduceMotion ? 0 : 0.22, ease: "easeOut" },
        y: { duration: reduceMotion ? 0 : 0.22, ease: "easeOut" },
        rotate: { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" },
      }}
      exit={{ opacity: 0, scale: 0.96 }}
      aria-label={`${label}. This playful button moves away from pointer input.`}
      data-testid="runaway-no-button"
    >
      {label}
    </motion.button>
  );
}
