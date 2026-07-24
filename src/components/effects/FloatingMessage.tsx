"use client";

import { AnimatePresence, motion } from "motion/react";

export function FloatingMessage({ message }: { message: string | null }) {
  return (
    <>
      <div className="sr-only" role="status" aria-live="polite">
        {message ?? ""}
      </div>
      <AnimatePresence>
        {message ? (
          <motion.div
            className="floating-message"
            initial={{ opacity: 0, y: 14, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 8, x: "-50%" }}
            transition={{ duration: 0.24 }}
          >
            {message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
