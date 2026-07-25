"use client";

import { motion } from "motion/react";

function SurpriseHeartIcon({ pulseKey }: { pulseKey: number }) {
  return (
    <motion.svg
      className="surprise-title-heart"
      viewBox="0 0 28 26"
      aria-hidden="true"
      animate={pulseKey > 0 ? { scale: [1, 1.18, 1] } : undefined}
      transition={{ duration: 0.38, ease: "easeOut" }}
    >
      <path
        d="M14 24S2.7 17.4 2.7 8.9C2.7 5 5.4 2.6 8.7 2.6c2.2 0 4.1 1.2 5.3 3.4 1.2-2.2 3.1-3.4 5.3-3.4 3.3 0 6 2.4 6 6.3C25.3 17.4 14 24 14 24Z"
        fill="currentColor"
      />
    </motion.svg>
  );
}

export function SurpriseTitleBar({
  title,
  pulseKey,
}: {
  title: string;
  pulseKey: number;
}) {
  return (
    <div className="surprise-titlebar">
      <SurpriseHeartIcon pulseKey={pulseKey} />
      <span>{title || "Surprise"}</span>
    </div>
  );
}
