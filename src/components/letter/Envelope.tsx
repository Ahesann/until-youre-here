"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Envelope({
  onOpen,
}: {
  onOpen: (trigger: HTMLButtonElement | null) => void;
}) {
  const reduceMotion = useReducedMotion();
  const [opening, setOpening] = useState(false);

  const handleOpen = (button: HTMLButtonElement | null) => {
    if (opening) {
      return;
    }

    setOpening(true);
    window.setTimeout(() => onOpen(button), reduceMotion ? 80 : 620);
    window.setTimeout(() => setOpening(false), reduceMotion ? 120 : 900);
  };

  return (
    <motion.button
      type="button"
      className="envelope-button"
      onClick={(event) => handleOpen(event.currentTarget)}
      aria-label="Open the love letter"
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
    >
      <motion.span
        className="envelope-body"
        animate={opening && !reduceMotion ? { y: 4 } : { y: 0 }}
      />
      <motion.span
        className="envelope-flap"
        animate={opening && !reduceMotion ? { rotateX: -142 } : { rotateX: 0 }}
        transition={{ duration: 0.55, ease: "easeInOut" }}
      />
      <motion.span
        className="envelope-seal"
        animate={opening && !reduceMotion ? { opacity: 0, scale: 0.2 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
      >
        <Heart aria-hidden="true" size={22} fill="currentColor" />
      </motion.span>
    </motion.button>
  );
}
