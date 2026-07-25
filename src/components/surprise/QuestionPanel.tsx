"use client";

import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function QuestionPanel({
  question,
  id,
}: {
  question: string;
  id: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <div id={id} className="surprise-question-field" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={question}
          initial={reduceMotion ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -5 }}
          transition={{ duration: reduceMotion ? 0.05 : 0.28, ease: "easeOut" }}
        >
          {question}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
