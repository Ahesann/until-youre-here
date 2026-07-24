"use client";

import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function MeetingHearts({ progress }: { progress: number }) {
  const reduceMotion = useReducedMotion();
  const left = 16 + progress * 30;
  const right = 84 - progress * 30;

  return (
    <div className="meeting-hearts" aria-hidden="true">
      <motion.span
        className="heart-character left-heart"
        animate={{ left: `${left}%`, scale: progress > 0.98 ? 1.12 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <Heart size={20} fill="currentColor" />
      </motion.span>
      <motion.span
        className="heart-character right-heart"
        animate={{ left: `${right}%`, scale: progress > 0.98 ? 1.12 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <Heart size={20} fill="currentColor" />
      </motion.span>
    </div>
  );
}
