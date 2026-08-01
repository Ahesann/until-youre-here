"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function LongStemRose({
  className = "",
  size = "medium",
}: {
  className?: string;
  size?: "small" | "medium" | "large";
}) {
  const reduceMotion = useReducedMotion();

  const dimensions = {
    small: { width: 120, height: 260 },
    medium: { width: 180, height: 380 },
    large: { width: 240, height: 500 },
  }[size];

  return (
    <motion.div
      className={`long-stem-rose-wrap ${className}`}
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 15, scale: 0.96 }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{
        width: dimensions.width,
        height: dimensions.height,
        display: "inline-block",
        filter: "drop-shadow(0 12px 28px rgba(185, 28, 28, 0.18))",
      }}
    >
      <svg
        viewBox="0 0 200 450"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        <defs>
          {/* Crimson Red Petal Gradients */}
          <linearGradient id="roseRedMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="roseRedHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <linearGradient id="roseRedDeep" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </linearGradient>

          {/* Stem & Leaf Gradients */}
          <linearGradient id="stemGreen" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="50%" stopColor="#166534" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>

          <linearGradient id="leafGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="50%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>
        </defs>

        {/* Elegant S-Curve Stem */}
        <motion.path
          d="M 100 130 Q 92 240 108 340 T 96 440"
          stroke="url(#stemGreen)"
          strokeWidth="6"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Thorns */}
        <path d="M 96 220 Q 86 215 84 224 Q 93 226 97 222 Z" fill="#14532D" />
        <path d="M 104 280 Q 114 275 116 284 Q 107 286 103 282 Z" fill="#14532D" />
        <path d="M 99 350 Q 89 345 87 354 Q 96 356 100 352 Z" fill="#14532D" />

        {/* Left Leaf */}
        <g transform="translate(94, 250) rotate(-35)">
          <path
            d="M 0 0 C -35 -20 -50 10 -65 5 C -45 25 -20 20 0 0 Z"
            fill="url(#leafGreen)"
            stroke="#14532D"
            strokeWidth="1"
          />
          <path d="M 0 0 C -25 2 -45 5 -60 5" stroke="#86EFAC" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Right Leaf */}
        <g transform="translate(104, 310) rotate(30)">
          <path
            d="M 0 0 C 35 -20 50 10 65 5 C 45 25 20 20 0 0 Z"
            fill="url(#leafGreen)"
            stroke="#14532D"
            strokeWidth="1"
          />
          <path d="M 0 0 C 25 2 45 5 60 5" stroke="#86EFAC" strokeWidth="1" opacity="0.6" />
        </g>

        {/* Rose Sepals under Bloom */}
        <path d="M 85 135 C 75 145 65 130 60 145 C 80 140 90 135 95 135 Z" fill="#15803D" />
        <path d="M 115 135 C 125 145 135 130 140 145 C 120 140 110 135 105 135 Z" fill="#15803D" />
        <path d="M 100 138 C 100 160 96 165 100 170 C 104 165 100 160 100 138 Z" fill="#166534" />

        {/* Rose Bloom - Layers of Crimson Red Petals */}
        <g className="rose-bloom">
          {/* Outer Back Petals */}
          <path
            d="M 60 110 C 45 70 75 35 100 45 C 125 35 155 70 140 110 C 120 140 80 140 60 110 Z"
            fill="url(#roseRedDeep)"
          />

          {/* Outer Layer Left */}
          <path
            d="M 50 95 C 40 65 70 45 95 55 C 80 80 70 110 60 125 C 48 115 45 100 50 95 Z"
            fill="url(#roseRedMain)"
          />

          {/* Outer Layer Right */}
          <path
            d="M 150 95 C 160 65 130 45 105 55 C 120 80 130 110 140 125 C 152 115 155 100 150 95 Z"
            fill="url(#roseRedMain)"
          />

          {/* Middle Petals Curve */}
          <path
            d="M 65 80 C 60 55 85 40 100 50 C 115 40 140 55 135 80 C 130 105 110 120 100 122 C 90 120 70 105 65 80 Z"
            fill="url(#roseRedHighlight)"
          />

          {/* Inner Petal Swirl */}
          <path
            d="M 80 75 C 75 58 92 48 100 55 C 108 48 125 58 120 75 C 115 90 105 100 100 102 C 95 100 85 90 80 75 Z"
            fill="url(#roseRedMain)"
          />

          {/* Rose Heart / Core Velvet */}
          <path
            d="M 88 70 C 85 58 95 52 100 56 C 105 52 115 58 112 70 C 110 82 103 88 100 89 C 97 88 90 82 88 70 Z"
            fill="url(#roseRedDeep)"
          />

          <path
            d="M 94 65 C 92 58 98 55 100 57 C 102 55 108 58 106 65 C 105 72 102 75 100 76 C 98 75 95 72 94 65 Z"
            fill="#7F1D1D"
          />

          {/* Soft Highlight Edge */}
          <path
            d="M 75 48 C 88 40 112 40 125 48 C 115 44 85 44 75 48 Z"
            fill="#FECDD3"
            opacity="0.7"
          />
        </g>
      </svg>
    </motion.div>
  );
}
