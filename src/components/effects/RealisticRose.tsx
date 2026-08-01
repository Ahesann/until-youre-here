"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function RealisticRose({
  className = "",
  size = 200,
  growthProgress = 1, // 0 = root only, 0.4 = stem+leaves, 1 = full bloom
  showStem = true,
}: {
  className?: string;
  size?: number;
  growthProgress?: number;
  showStem?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  // Normalized progress stages
  const stemLength = Math.min(1, Math.max(0, growthProgress * 2.2));
  const bloomProgress = Math.min(1, Math.max(0, (growthProgress - 0.5) * 2));

  return (
    <div
      className={`realistic-rose-wrap inline-block relative ${className}`}
      style={{
        width: size,
        height: size * (showStem ? 1.5 : 1),
        filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.12))",
      }}
    >
      <svg
        viewBox="0 0 360 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          {/* Realistic Red Rose Velvet Petal Gradients */}
          <linearGradient id="realRoseLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="40%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <linearGradient id="realRoseMid" x1="0%" y1="0%" x2="75%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>

          <linearGradient id="realRoseDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B91C1C" />
            <stop offset="65%" stopColor="#7F1D1D" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          {/* Realistic Leaf Gradients (Deep Forest Green to Muted Teal Green) */}
          <linearGradient id="realLeafMain" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#345E4E" />
            <stop offset="45%" stopColor="#224538" />
            <stop offset="100%" stopColor="#142B23" />
          </linearGradient>

          <linearGradient id="realLeafHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4D7F6B" />
            <stop offset="50%" stopColor="#345E4E" />
            <stop offset="100%" stopColor="#1E382E" />
          </linearGradient>

          {/* Stem Dark Red-Brown Gradient */}
          <linearGradient id="realStem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4A2020" />
            <stop offset="50%" stopColor="#361717" />
            <stop offset="100%" stopColor="#220D0D" />
          </linearGradient>
        </defs>

        {/* --- STEM & ROOT GROWTH --- */}
        {showStem && (
          <g className="real-stem-group">
            {/* Main Stem Line starting from Root (Bottom center) */}
            <motion.path
              d="M 180 200 Q 168 320 185 430 T 180 520"
              stroke="url(#realStem)"
              strokeWidth="7"
              strokeLinecap="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: stemLength }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />
            <motion.path
              d="M 180 200 Q 168 320 185 430 T 180 520"
              stroke="#5C2929"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: stemLength }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            />

            {/* Subtle Thorns & Nodes */}
            {stemLength > 0.45 && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <path d="M 174 340 Q 158 335 154 346 Q 168 348 175 342 Z" fill="#361717" />
                <path d="M 186 400 Q 202 395 206 406 Q 192 408 185 402 Z" fill="#361717" />
              </motion.g>
            )}
          </g>
        )}



        {/* --- REALISTIC CURVED VELVET ROSE BLOOM (Matching uploaded photo) --- */}
        {bloomProgress > 0 && (
          <motion.g
            className="real-bloom-group"
            transform-origin="180px 140px"
            initial={reduceMotion ? false : { scale: 0.15, opacity: 0 }}
            animate={{ scale: bloomProgress, opacity: bloomProgress }}
            transition={{ duration: 0.75, ease: "backOut" }}
          >
            {/* Sepal Base / Receptacle */}
            <path
              d="M 145 180 C 155 210 140 235 135 245 C 160 220 175 200 180 195 C 185 200 200 220 225 245 C 220 235 205 210 215 180 Z"
              fill="#224538"
              stroke="#142B23"
              strokeWidth="2"
            />

            {/* Back Outer Petal Depth */}
            <path
              d="M 65 125 C 45 65 90 15 180 20 C 270 15 315 65 295 125 C 260 185 100 185 65 125 Z"
              fill="url(#realRoseDark)"
              stroke="#450A0A"
              strokeWidth="2.5"
            />

            {/* Outer Left Curving Petal Flange */}
            <path
              d="M 50 115 C 35 75 75 35 125 45 C 105 85 95 135 75 160 C 55 145 45 125 50 115 Z"
              fill="url(#realRoseMid)"
              stroke="#7F1D1D"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* Outer Right Wide Blooming Petal (Matching prominent right wing in reference image) */}
            <path
              d="M 290 110 C 310 70 265 30 210 40 C 230 80 245 130 265 155 C 285 140 295 120 290 110 Z"
              fill="url(#realRoseLight)"
              stroke="#B91C1C"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Delicate Rim Highlight on Right Petal */}
            <path
              d="M 290 110 C 305 75 270 38 218 42"
              stroke="#FCA5A5"
              strokeWidth="2"
              opacity="0.8"
            />

            {/* Bottom Front Curving Petal Base Rim */}
            <path
              d="M 75 150 C 60 185 110 215 180 215 C 250 215 300 185 285 150 C 245 180 115 180 75 150 Z"
              fill="url(#realRoseMid)"
              stroke="#7F1D1D"
              strokeWidth="2.5"
            />
            <path
              d="M 75 150 C 60 185 110 215 180 215 C 250 215 300 185 285 150"
              stroke="#F87171"
              strokeWidth="1.8"
              opacity="0.75"
            />

            {/* Mid Layer Inner Petal Curve Left */}
            <path
              d="M 90 100 C 75 65 120 40 160 52 C 140 90 125 135 100 150 C 90 135 85 115 90 100 Z"
              fill="url(#realRoseLight)"
              stroke="#B91C1C"
              strokeWidth="2.5"
            />

            {/* Mid Layer Inner Petal Curve Right */}
            <path
              d="M 255 100 C 270 65 225 40 185 52 C 205 90 220 135 245 150 C 255 135 260 115 255 100 Z"
              fill="url(#realRoseLight)"
              stroke="#B91C1C"
              strokeWidth="2.5"
            />

            {/* Front Lip Velvet Bowl */}
            <path
              d="M 100 140 C 120 165 240 165 260 140 C 220 128 140 128 100 140 Z"
              fill="url(#realRoseLight)"
              stroke="#EF4444"
              strokeWidth="2.5"
            />

            {/* Center Rose Velvet Core Spiral (Layers of spiraling rounded petals) */}
            <path
              d="M 125 90 C 115 68 145 55 180 62 C 215 55 245 68 235 90 C 215 118 145 118 125 90 Z"
              fill="url(#realRoseMid)"
              stroke="#991B1B"
              strokeWidth="2.5"
            />

            <path
              d="M 140 85 C 132 72 155 64 180 68 C 205 64 228 72 220 85 C 208 105 152 105 140 85 Z"
              fill="url(#realRoseDark)"
              stroke="#7F1D1D"
              strokeWidth="2"
            />

            <path
              d="M 152 80 C 148 72 162 68 180 70 C 198 68 212 72 208 80 C 200 92 160 92 152 80 Z"
              fill="#450A0A"
              stroke="#7F1D1D"
              strokeWidth="1.8"
            />

            {/* Center Velvet Core Highlight Edge */}
            <path
              d="M 160 74 C 170 72 190 74 195 80"
              stroke="#FCA5A5"
              strokeWidth="1.8"
              opacity="0.85"
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
}
