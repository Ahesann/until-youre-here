"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function NeoTraditionalRose({
  className = "",
  size = 180,
  growthProgress = 1, // 0 = root only, 0.3 = stem+leaves, 1 = full bloom
  showStem = true,
}: {
  className?: string;
  size?: number;
  growthProgress?: number;
  showStem?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  // Calculate dynamic scale & path progress
  const stemLength = Math.min(1, Math.max(0, growthProgress * 2));
  const bloomProgress = Math.min(1, Math.max(0, (growthProgress - 0.55) * 2.2));

  return (
    <div
      className={`neo-traditional-rose-wrap inline-block relative ${className}`}
      style={{
        width: size,
        height: size * (showStem ? 1.6 : 1),
        filter: "drop-shadow(0 10px 20px rgba(0, 0, 0, 0.15))",
      }}
    >
      <svg
        viewBox="0 0 320 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Neo-Traditional Crimson Red Gradients with Sharp Dark Shadows */}
          <linearGradient id="neoRedPetalLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="40%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <linearGradient id="neoRedPetalMid" x1="0%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="60%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="neoRedPetalDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="70%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          {/* Leaf Dark Ink Shading Gradient (Matching reference image: Dark charcoal/black to grey) */}
          <linearGradient id="neoLeafShade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="40%" stopColor="#334155" />
            <stop offset="85%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id="neoLeafShadeDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>

        {/* --- STEM & THORNS --- */}
        {showStem && (
          <g className="neo-stem-group">
            {/* Main Curving Stem Contour */}
            <motion.path
              d="M 160 210 Q 150 310 170 410 T 155 490"
              stroke="#0F172A"
              strokeWidth="5"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: stemLength }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <motion.path
              d="M 160 210 Q 150 310 170 410 T 155 490"
              stroke="#1E293B"
              strokeWidth="3"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: stemLength }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Thorns */}
            {stemLength > 0.4 && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <path d="M 154 310 Q 138 305 135 316 Q 148 318 155 312 Z" fill="#0F172A" stroke="#0F172A" strokeWidth="1.5" />
                <path d="M 166 370 Q 182 365 185 376 Q 172 378 165 372 Z" fill="#0F172A" stroke="#0F172A" strokeWidth="1.5" />
              </motion.g>
            )}
          </g>
        )}



        {/* --- ROSE BLOOM WITH SHARP ANGULAR CRIMSON PETALS --- */}
        {bloomProgress > 0 && (
          <motion.g
            className="neo-bloom-group"
            transform-origin="160px 150px"
            initial={reduceMotion ? false : { scale: 0.2, opacity: 0 }}
            animate={{ scale: bloomProgress, opacity: bloomProgress }}
            transition={{ duration: 0.6, ease: "backOut" }}
          >
            {/* Sepal Base / Calyx */}
            <path
              d="M 125 180 C 135 210 120 230 115 240 C 140 215 155 195 160 190 C 165 195 180 215 205 240 C 200 230 185 210 195 180 Z"
              fill="#0F172A"
              stroke="#0F172A"
              strokeWidth="2"
            />

            {/* Back Sepal Tips */}
            <path d="M 115 175 L 85 200 L 120 185 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
            <path d="M 205 175 L 235 200 L 200 185 Z" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />

            {/* Outer Deep Red Petal Shadow Backing */}
            <path
              d="M 60 130 C 45 75 80 25 160 30 C 240 25 275 75 260 130 C 230 180 90 180 60 130 Z"
              fill="url(#neoRedPetalDark)"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Sharp Pointed Petal - Top Left Flared Horn */}
            <path
              d="M 100 65 L 75 25 L 125 45 C 110 52 102 58 100 65 Z"
              fill="url(#neoRedPetalMid)"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Sharp Pointed Petal - Top Right Flared Horn */}
            <path
              d="M 220 65 L 245 25 L 195 45 C 210 52 218 58 220 65 Z"
              fill="url(#neoRedPetalMid)"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Main Outer Left Petal (Sharp Angular Crown) */}
            <path
              d="M 50 120 C 35 85 70 50 115 60 C 100 95 90 140 75 165 C 55 150 45 130 50 120 Z"
              fill="url(#neoRedPetalMid)"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Main Outer Right Petal (Sharp Angular Crown) */}
            <path
              d="M 270 120 C 285 85 250 50 205 60 C 220 95 230 140 245 165 C 265 150 275 130 270 120 Z"
              fill="url(#neoRedPetalMid)"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Bottom Front Curving Petal Base */}
            <path
              d="M 75 155 C 65 185 105 210 160 210 C 215 210 255 185 245 155 C 215 175 105 175 75 155 Z"
              fill="url(#neoRedPetalDark)"
              stroke="#0F172A"
              strokeWidth="4"
              strokeLinejoin="round"
            />

            {/* Mid Layer Left Petal */}
            <path
              d="M 85 110 C 70 80 110 55 145 68 C 130 100 115 140 95 155 C 85 140 82 125 85 110 Z"
              fill="url(#neoRedPetalLight)"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Mid Layer Right Petal */}
            <path
              d="M 235 110 C 250 80 210 55 175 68 C 190 100 205 140 225 155 C 235 140 238 125 235 110 Z"
              fill="url(#neoRedPetalLight)"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Front Center Petal Lip */}
            <path
              d="M 95 145 C 115 170 205 170 225 145 C 190 135 130 135 95 145 Z"
              fill="url(#neoRedPetalLight)"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Center Rose Spiral / Inner Heart */}
            <path
              d="M 115 95 C 105 75 130 65 160 72 C 190 65 215 75 205 95 C 190 120 130 120 115 95 Z"
              fill="url(#neoRedPetalMid)"
              stroke="#0F172A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            <path
              d="M 130 90 C 125 78 142 72 160 76 C 178 72 195 78 190 90 C 180 108 140 108 130 90 Z"
              fill="url(#neoRedPetalDark)"
              stroke="#0F172A"
              strokeWidth="3"
              strokeLinejoin="round"
            />

            <path
              d="M 142 85 C 138 78 150 74 160 76 C 170 74 182 78 178 85 C 172 98 148 98 142 85 Z"
              fill="#7F1D1D"
              stroke="#0F172A"
              strokeWidth="2.5"
            />

            {/* Inner Spiral Ink Line Accent */}
            <path
              d="M 152 82 C 150 78 165 76 168 82 C 166 88 154 88 152 82 Z"
              fill="#450A0A"
              stroke="#0F172A"
              strokeWidth="2"
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
