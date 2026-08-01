"use client";

import { useCallback } from "react";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { Building2, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTapSequence } from "@/hooks/useTapSequence";
import { MeetingHearts } from "@/components/journey/MeetingHearts";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// SVG Cubic Bezier Path: M70 188 C 205 76, 406 52, 690 171 in 760x270 viewBox
function getPlaneSvgCoordinates(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;

  // Exact Cubic Bezier point coordinates in SVG viewBox units (0..760, 0..270)
  const px = uuu * 70 + 3 * uu * t * 205 + 3 * u * tt * 406 + ttt * 690;
  const py = uuu * 188 + 3 * uu * t * 76 + 3 * u * tt * 52 + ttt * 171;

  // Tangent vector derivative (dx/dt, dy/dt) along curve
  const dx = 3 * uu * (205 - 70) + 6 * u * t * (406 - 205) + 3 * tt * (690 - 406);
  const dy = 3 * uu * (76 - 188) + 6 * u * t * (52 - 76) + 3 * tt * (171 - 52);

  const angleRad = Math.atan2(dy, dx);
  const angleDeg = (angleRad * 180) / Math.PI;

  return {
    px,
    py,
    angle: angleDeg,
  };
}

export function JourneyRoute({
  progress,
  onPlaneEasterEgg,
}: {
  progress: number;
  onPlaneEasterEgg: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const planeCoords = getPlaneSvgCoordinates(clampedProgress);
  const destinationGlow = 0.18 + clampedProgress * 0.45;
  const skyWarmth = Math.max(0, (clampedProgress - 0.62) / 0.38);

  const completePlaneSequence = useCallback(() => {
    onPlaneEasterEgg();
  }, [onPlaneEasterEgg]);

  const handlePlaneTap = useTapSequence({
    requiredTaps: 3,
    windowMs: 2_400,
    onComplete: completePlaneSequence,
  });

  return (
    <section
      className="journey-panel glass"
      aria-labelledby="journey-heading"
      style={
        {
          "--destination-glow": destinationGlow,
          "--sky-warmth": skyWarmth,
        } as CSSProperties
      }
      data-testid="journey-route"
    >
      <h2 id="journey-heading" className="sr-only">
        Journey from India to the United Kingdom
      </h2>
      <div className="journey-labels">
        <span>{siteConfig.journey.departureCity}</span>
        <span>
          {siteConfig.journey.arrivalCity}, {siteConfig.journey.arrivalCountry}
        </span>
      </div>
      <div className="journey-map">
        <svg
          className="journey-svg"
          viewBox="0 0 760 270"
          role="img"
          aria-label={`Symbolic route from ${siteConfig.journey.departureCity} to ${siteConfig.journey.arrivalCity}`}
        >
          <defs>
            <linearGradient id="routeGlow" x1="0%" x2="100%" y1="0%" y2="0%">
              <stop stopColor="var(--rose-accent)" offset="0%" />
              <stop stopColor="var(--gold-300)" offset="64%" />
              <stop stopColor="var(--dawn-200)" offset="100%" />
            </linearGradient>
          </defs>

          {/* Background Skyline */}
          <motion.g
            animate={{ opacity: 0.48 + skyWarmth * 0.34 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <path
              d="M575 191h130v11H575zM592 165h17v26h-17zM620 140h23v51h-23zM655 155h20v36h-20zM685 121h28v70h-28z"
              fill="var(--rose-light)"
              opacity="0.46"
            />
            <Building2
              x={650}
              y={86}
              width={36}
              height={36}
              color="var(--gold-400)"
              opacity="0.5"
            />
          </motion.g>

          {/* Dashed Full Track Curve */}
          <path
            d="M70 188 C 205 76, 406 52, 690 171"
            fill="none"
            stroke="var(--border-medium)"
            strokeDasharray="8 12"
            strokeLinecap="round"
            strokeWidth="3"
          />

          {/* Solid Red Progress Line Stroke */}
          <motion.path
            d="M70 188 C 205 76, 406 52, 690 171"
            fill="none"
            pathLength={1}
            stroke="url(#routeGlow)"
            strokeDasharray="1"
            strokeLinecap="round"
            strokeWidth="4"
            initial={false}
            animate={{ strokeDashoffset: 1 - clampedProgress }}
            transition={{ duration: reduceMotion ? 0 : 0.55, ease: "easeOut" }}
          />

          {/* Start and End Anchor Circles */}
          <circle cx="70" cy="188" r="8" fill="var(--rose-accent)" opacity="0.86" />
          <circle cx="690" cy="171" r="10" fill="var(--gold-300)" opacity="0.95" />
          <Heart
            x={682}
            y={149}
            width={18}
            height={18}
            fill="var(--gold-300)"
            color="var(--gold-300)"
          />

          {/* --- SVG-NATIVE PLANE BADGE (100% Locked on Path Coordinates) --- */}
          <g
            transform={`translate(${planeCoords.px}, ${planeCoords.py})`}
            onClick={handlePlaneTap}
            style={{ cursor: "pointer" }}
            tabIndex={0}
            role="button"
            aria-label="Tap the aeroplane on its way to London"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handlePlaneTap();
              }
            }}
          >
            {/* Soft Ambient Red Shadow Ring */}
            <circle r="26" fill="rgba(220, 38, 38, 0.12)" opacity="0.8" />
            
            {/* White/Cream Glass Badge Circle */}
            <circle
              r="22"
              fill="var(--surface-solid)"
              stroke="var(--rose-accent)"
              strokeWidth="2"
            />

            {/* Small Red Heart Accent */}
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="var(--rose-accent)"
              transform="translate(-23, 3) scale(0.5)"
            />

            {/* Airplane Icon rotated by exact path tangent angle (nose forward to London, tail backward) */}
            <g transform={`rotate(${planeCoords.angle + 45}) translate(-14, -14)`}>
              <path
                d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.7 5.2c.3.4.8.5 1.3.3l.5-.3c.4-.2.6-.6.5-1.1z"
                fill="none"
                stroke="var(--rose-accent-dark)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        </svg>

        <div className="cloud cloud-one" aria-hidden="true" />
        <div className="cloud cloud-two" aria-hidden="true" />
        <div className="cloud cloud-three" aria-hidden="true" />
        <MeetingHearts progress={clampedProgress} />
      </div>
    </section>
  );
}
