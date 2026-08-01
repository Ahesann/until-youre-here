"use client";

import { useState } from "react";
import type { CSSProperties } from "react";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CountdownDisplay } from "@/components/countdown/CountdownDisplay";
import { CountdownProgress } from "@/components/countdown/CountdownProgress";
import { RomanticMessages } from "@/components/countdown/RomanticMessages";
import { JourneyRoute } from "@/components/journey/JourneyRoute";
import { Envelope } from "@/components/letter/Envelope";
import { ResetExperienceButton } from "@/components/controls/ResetExperienceButton";
import { PetalField } from "@/components/effects/PetalField";
import { RealisticRose } from "@/components/effects/RealisticRose";
import { RoseBackgroundField } from "@/components/effects/RoseBackgroundField";
import { StarField } from "@/components/effects/StarField";
import { useLongPress } from "@/hooks/useLongPress";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import type { TimeRemaining } from "@/types";

export function CountdownScene({
  remaining,
  progress,
  milestoneMessage,
  onPlaneEasterEgg,
  onSecondsEasterEgg,
  onHeldHeart,
  onOpenLetter,
  onReplay,
}: {
  remaining: TimeRemaining;
  progress: number;
  milestoneMessage: string;
  onPlaneEasterEgg: () => void;
  onSecondsEasterEgg: () => void;
  onHeldHeart: () => void;
  onOpenLetter: (trigger: HTMLButtonElement | null) => void;
  onReplay: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const [holdProgress, setHoldProgress] = useState(0);
  const [keyboardHolding, setKeyboardHolding] = useState(false);
  const longPress = useLongPress({
    onProgress: setHoldProgress,
    onComplete: () => {
      setHoldProgress(0);
      onHeldHeart();
    },
    onCancel: () => setHoldProgress(0),
  });

  return (
    <section className="countdown-scene" aria-labelledby="countdown-heading">
      <RoseBackgroundField count={5} />
      <StarField warmth={Math.max(0, (progress - 0.62) / 0.38)} />
      <PetalField count={3} />
      <div className="container countdown-content">
        <header className="countdown-hero relative flex flex-col items-center">
          <div className="mb-2 transition-transform duration-500 hover:scale-105">
            <RealisticRose size={160} className="mx-auto" />
          </div>
          <p className="milestone">{milestoneMessage}</p>
          <h1 id="countdown-heading" className="section-heading" tabIndex={-1}>
            {siteConfig.copy.countdown.heading}
          </h1>
          <p className="supporting-copy">
            {siteConfig.copy.countdown.supportingLine}
          </p>
        </header>

        <CountdownDisplay
          remaining={remaining}
          onSecondsEasterEgg={onSecondsEasterEgg}
        />
        <RomanticMessages messages={siteConfig.copy.countdown.rotatingMessages} />
        <CountdownProgress progress={progress} />
        <JourneyRoute progress={progress} onPlaneEasterEgg={onPlaneEasterEgg} />

        <div className="central-heart-wrap">
          <motion.button
            type="button"
            className="central-heart-button"
            style={
              {
                "--hold-progress": holdProgress,
                "--hold-alpha": 0.22 + holdProgress * 0.5,
                "--hold-glow": `${18 + holdProgress * 28}px`,
                "--hold-scale": 0.88 + holdProgress * 0.28,
              } as CSSProperties
            }
            onPointerDown={(event) =>
              longPress.start({ x: event.clientX, y: event.clientY })
            }
            onPointerMove={(event) =>
              longPress.pointerMove({ x: event.clientX, y: event.clientY })
            }
            onPointerUp={longPress.cancel}
            onPointerCancel={longPress.cancel}
            onPointerLeave={longPress.cancel}
            onKeyDown={(event) => {
              if ((event.key === " " || event.key === "Enter") && !keyboardHolding) {
                event.preventDefault();
                setKeyboardHolding(true);
                longPress.start();
              }
            }}
            onKeyUp={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                setKeyboardHolding(false);
                longPress.cancel();
              }
            }}
            aria-label="Press and hold the central heart"
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          >
            <Heart aria-hidden="true" size={34} fill="currentColor" />
          </motion.button>
        </div>

        <div className="letter-section">
          <p className="letter-lead">{siteConfig.copy.letter.leadIn}</p>
          <Envelope onOpen={onOpenLetter} />
          <ResetExperienceButton onReplay={onReplay} />
        </div>
      </div>
    </section>
  );
}
