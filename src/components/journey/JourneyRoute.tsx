"use client";

import { useCallback } from "react";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { Building2, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { useTapSequence } from "@/hooks/useTapSequence";
import { AnimatedPlane } from "@/components/journey/AnimatedPlane";
import { MeetingHearts } from "@/components/journey/MeetingHearts";
import { useReducedMotion } from "@/hooks/useReducedMotion";

function getPlanePosition(progress: number) {
  const t = Math.min(1, Math.max(0, progress));
  return {
    x: 8 + t * 84,
    y: 70 - Math.sin(t * Math.PI) * 38,
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
  const planePosition = getPlanePosition(clampedProgress);
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
      style={{
        "--destination-glow": destinationGlow,
        "--sky-warmth": skyWarmth,
      } as CSSProperties}
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
              <stop stopColor="#c98f9a" offset="0%" />
              <stop stopColor="#ead09a" offset="64%" />
              <stop stopColor="#f5c7ad" offset="100%" />
            </linearGradient>
          </defs>
          <motion.g
            animate={{ opacity: 0.48 + skyWarmth * 0.34 }}
            transition={{ duration: reduceMotion ? 0 : 0.45 }}
          >
            <path
              d="M575 191h130v11H575zM592 165h17v26h-17zM620 140h23v51h-23zM655 155h20v36h-20zM685 121h28v70h-28z"
              fill="#f5c7ad"
              opacity="0.32"
            />
            <Building2 x={650} y={86} width={36} height={36} color="#ead09a" opacity="0.42" />
          </motion.g>
          <path
            d="M70 188 C 205 76, 406 52, 690 171"
            fill="none"
            stroke="rgb(248 241 231 / 0.24)"
            strokeDasharray="8 12"
            strokeLinecap="round"
            strokeWidth="3"
          />
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
          <circle cx="70" cy="188" r="8" fill="#c98f9a" opacity="0.9" />
          <circle cx="690" cy="171" r="10" fill="#ead09a" opacity="0.95" />
          <Heart x={682} y={149} width={18} height={18} fill="#ead09a" color="#ead09a" />
        </svg>
        <AnimatedPlane
          x={planePosition.x}
          y={planePosition.y}
          onActivate={handlePlaneTap}
        />
        <div className="cloud cloud-one" aria-hidden="true" />
        <div className="cloud cloud-two" aria-hidden="true" />
        <div className="cloud cloud-three" aria-hidden="true" />
        <MeetingHearts progress={clampedProgress} />
      </div>
    </section>
  );
}
