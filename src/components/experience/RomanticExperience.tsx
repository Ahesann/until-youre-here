"use client";

/* eslint-disable react-hooks/set-state-in-effect -- storage and clock changes initialize the client-only experience state. */

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { siteConfig } from "@/config/site";
import { ClockProvider, useClock } from "@/context/ClockContext";
import { MotionPreferenceProvider } from "@/context/MotionPreferenceContext";
import { RomanticAccessScreen } from "@/components/access/RomanticAccessScreen";
import { ArrivalScene } from "@/components/experience/ArrivalScene";
import { CountdownScene } from "@/components/experience/CountdownScene";
import { OpeningScene } from "@/components/experience/OpeningScene";
import { PlayfulSurpriseGate } from "@/components/experience/PlayfulSurpriseGate";
import { LoveLetter } from "@/components/letter/LoveLetter";
import { MusicControl } from "@/components/controls/MusicControl";
import { BurstParticles } from "@/components/effects/BurstParticles";
import { Celebration } from "@/components/effects/Celebration";
import { FloatingMessage } from "@/components/effects/FloatingMessage";
import { TapParticles } from "@/components/effects/TapParticles";
import {
  calculateJourneyProgress,
  getTimeRemaining,
  hasReachedArrival,
  validateSiteConfig,
} from "@/lib/countdown";
import { selectMilestone } from "@/lib/milestones";
import {
  readLocalBoolean,
  readSessionBoolean,
  removeLocalKey,
  removeOwnedExperienceState,
  storageKeys,
  writeLocalBoolean,
  writeSessionBoolean,
} from "@/lib/storage";
import type {
  ConfigValidation,
  ExperienceState,
} from "@/types";

const DevelopmentPreviewPanel =
  process.env.NODE_ENV !== "production"
    ? dynamic(
        () =>
          import("@/components/development/ExperiencePreviewPanel").then(
            (module) => module.ExperiencePreviewPanel,
          ),
        { ssr: false },
      )
    : null;

export function RomanticExperience({ initialNow }: { initialNow: number }) {
  const validation = validateSiteConfig(siteConfig);

  if (!validation.ok) {
    return <ConfigurationFallback validation={validation} />;
  }

  return (
    <MotionPreferenceProvider>
      <ClockProvider initialNow={initialNow}>
        <ExperienceController
          initialNow={initialNow}
          arrivalTimestamp={validation.arrivalTimestamp}
          countdownStartTimestamp={validation.countdownStartTimestamp}
        />
      </ClockProvider>
    </MotionPreferenceProvider>
  );
}

function ExperienceController({
  initialNow,
  arrivalTimestamp,
  countdownStartTimestamp,
}: {
  initialNow: number;
  arrivalTimestamp: number;
  countdownStartTimestamp: number;
}) {
  const { now, overrideNow, setOverrideNow } = useClock();
  const initialArrival = hasReachedArrival(arrivalTimestamp, initialNow);
  const [mounted, setMounted] = useState(initialArrival);
  const [state, setState] = useState<ExperienceState>(
    initialArrival ? "arrival" : "opening",
  );
  const [hasInteracted, setHasInteracted] = useState(initialArrival);
  const [floatingMessage, setFloatingMessage] = useState<string | null>(null);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterOpened, setLetterOpened] = useState(false);
  const [letterTrigger, setLetterTrigger] = useState<HTMLElement | null>(null);
  const [focusPhotoOnOpen, setFocusPhotoOnOpen] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const [celebrationKey, setCelebrationKey] = useState(0);
  const introCompletionKey =
    siteConfig.playfulGate.completionStorageKey || storageKeys.introComplete;

  const remaining = useMemo(
    () => getTimeRemaining(arrivalTimestamp, now),
    [arrivalTimestamp, now],
  );
  const progress = useMemo(
    () => calculateJourneyProgress(countdownStartTimestamp, arrivalTimestamp, now),
    [arrivalTimestamp, countdownStartTimestamp, now],
  );
  const milestoneKey = selectMilestone(remaining.totalMilliseconds);
  const milestoneMessage = siteConfig.copy.milestones[milestoneKey];

  const showFloatingMessage = useCallback((message: string) => {
    setFloatingMessage(message);
    window.setTimeout(() => {
      setFloatingMessage((current) => (current === message ? null : current));
    }, 3_200);
  }, []);

  useEffect(() => {
    const previewNow = getDevelopmentPreviewTimestamp(arrivalTimestamp);
    if (previewNow !== null) {
      setOverrideNow(previewNow);
    }

    const currentNow = previewNow ?? Date.now();
    const replayIntro =
      process.env.NODE_ENV !== "production" &&
      new URLSearchParams(window.location.search).get("replayIntro") === "1";

    if (hasReachedArrival(arrivalTimestamp, currentNow)) {
      setState("arrival");
      setHasInteracted(true);
      setMounted(true);
      return;
    }

    if (replayIntro) {
      removeOwnedExperienceState([introCompletionKey]);
    }

    const accessGranted =
      !siteConfig.access.enabled || readSessionBoolean(storageKeys.accessGranted);

    if (!accessGranted) {
      setState("access");
      setMounted(true);
      return;
    }

    const introCompleted =
      siteConfig.playfulGate.rememberCompletion &&
      !siteConfig.playfulGate.repeatOnEveryVisit &&
      !replayIntro &&
      (readLocalBoolean(introCompletionKey) ||
        readLocalBoolean(storageKeys.legacyIntroComplete));

    if (introCompleted) {
      setState("countdown");
      setHasInteracted(true);
      setMounted(true);
      return;
    }

    setState("opening");
    setMounted(true);
  }, [arrivalTimestamp, introCompletionKey, setOverrideNow]);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const reachedArrival = hasReachedArrival(arrivalTimestamp, now);

    if (reachedArrival && state !== "arrival") {
      setState("arrival");
      setHasInteracted(true);
      setBurstKey((current) => current + 1);
      setCelebrationKey((current) => current + 1);
      return;
    }

    if (
      process.env.NODE_ENV !== "production" &&
      overrideNow !== null &&
      !reachedArrival &&
      state === "arrival"
    ) {
      setState("countdown");
    }
  }, [arrivalTimestamp, mounted, now, overrideNow, state]);

  const focusCountdownHeading = () => {
    window.setTimeout(() => {
      const heading = document.getElementById("countdown-heading");
      heading?.focus({ preventScroll: true });
    }, 180);
  };

  const completeOpening = () => {
    if (siteConfig.playfulGate.rememberCompletion) {
      writeLocalBoolean(introCompletionKey, true);
      removeLocalKey(storageKeys.legacyIntroComplete);
    }

    setHasInteracted(true);
    setState(remaining.hasArrived ? "arrival" : "countdown");

    if (!remaining.hasArrived) {
      focusCountdownHeading();
    }
  };

  const acceptAccess = () => {
    writeSessionBoolean(storageKeys.accessGranted, true);
    setHasInteracted(true);
    const introCompleted =
      siteConfig.playfulGate.rememberCompletion &&
      !siteConfig.playfulGate.repeatOnEveryVisit &&
      (readLocalBoolean(introCompletionKey) ||
        readLocalBoolean(storageKeys.legacyIntroComplete));

    setState(introCompleted ? "countdown" : "opening");
  };

  const openLetter = (trigger: HTMLButtonElement | null, focusPhoto = false) => {
    setLetterTrigger(trigger);
    setFocusPhotoOnOpen(focusPhoto);
    setLetterOpened(true);
    setLetterOpen(true);
  };

  const closeLetter = () => {
    setLetterOpen(false);
    setFocusPhotoOnOpen(false);
  };

  const replay = () => {
    removeOwnedExperienceState([introCompletionKey]);
    setLetterOpen(false);
    setFocusPhotoOnOpen(false);

    if (hasReachedArrival(arrivalTimestamp, now)) {
      setState("arrival");
      return;
    }

    if (siteConfig.access.enabled && !readSessionBoolean(storageKeys.accessGranted)) {
      setState("access");
      return;
    }

    setState("opening");
  };

  const triggerPlaneEgg = () => {
    showFloatingMessage(siteConfig.copy.easterEggs.plane);
    setBurstKey((current) => current + 1);
  };

  const triggerHeldHeart = () => {
    showFloatingMessage(siteConfig.copy.easterEggs.heldHeart);
    setBurstKey((current) => current + 1);
  };

  const openNextChapter = () => {
    setHasInteracted(true);
    setCelebrationKey((current) => current + 1);

    if (!letterOpened) {
      openLetter(null);
      return;
    }

    openLetter(null, true);
  };

  if (!mounted && !initialArrival) {
    return (
      <main className="experience-shell loading-scene" aria-busy="true">
        <HeartLoadingMark />
      </main>
    );
  }

  return (
    <main className={`experience-shell ${state === "arrival" ? "arrival" : ""}`}>
      <AnimatePresence mode="wait">
        {state === "access" ? (
          <motion.div
            key="access"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RomanticAccessScreen onAccepted={acceptAccess} />
          </motion.div>
        ) : null}

        {state === "opening" ? (
          <motion.div
            key="opening"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {siteConfig.playfulGate.enabled ? (
              <PlayfulSurpriseGate
                onComplete={completeOpening}
                onMoon={() => showFloatingMessage(siteConfig.copy.easterEggs.moon)}
              />
            ) : (
              <OpeningScene
                onComplete={completeOpening}
                onMoon={() => showFloatingMessage(siteConfig.copy.easterEggs.moon)}
              />
            )}
          </motion.div>
        ) : null}

        {state === "countdown" && !remaining.hasArrived ? (
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CountdownScene
              remaining={remaining}
              progress={progress}
              milestoneMessage={milestoneMessage}
              onMoon={() => showFloatingMessage(siteConfig.copy.easterEggs.moon)}
              onPlaneEasterEgg={triggerPlaneEgg}
              onSecondsEasterEgg={() =>
                showFloatingMessage(siteConfig.copy.easterEggs.seconds)
              }
              onHeldHeart={triggerHeldHeart}
              onOpenLetter={openLetter}
              onReplay={replay}
            />
          </motion.div>
        ) : null}

        {state === "arrival" || remaining.hasArrived ? (
          <motion.div
            key="arrival"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ArrivalScene
              onOpenNextChapter={openNextChapter}
              onReplay={replay}
              onPlaneEasterEgg={triggerPlaneEgg}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
      <TapParticles />
      <BurstParticles burstKey={burstKey} origin="heart" />
      <Celebration burstKey={celebrationKey} />
      <FloatingMessage message={floatingMessage} />
      <div className="floating-controls">
        <MusicControl visible={hasInteracted && state !== "access"} />
      </div>
      <LoveLetter
        open={letterOpen}
        onClose={closeLetter}
        restoreFocusTo={letterTrigger}
        focusPhotoOnOpen={focusPhotoOnOpen}
      />
      {DevelopmentPreviewPanel ? (
        <DevelopmentPreviewPanel arrivalTimestamp={arrivalTimestamp} />
      ) : null}
    </main>
  );
}

function ConfigurationFallback({
  validation,
}: {
  validation: Extract<ConfigValidation, { ok: false }>;
}) {
  useEffect(() => {
    console.error("Until You're Here configuration error", {
      field: validation.field,
      message: validation.message,
    });
  }, [validation.field, validation.message]);

  const isProduction = process.env.NODE_ENV === "production";

  return (
    <main className="experience-shell config-error">
      <section className="config-error-inner glass" aria-labelledby="config-error-title">
        <h1 id="config-error-title" className="section-heading">
          The stars are taking a moment to find their way.
        </h1>
        {isProduction ? (
          <p className="supporting-copy">
            Please check back soon; this little countdown needs one small
            adjustment.
          </p>
        ) : (
          <p className="supporting-copy">
            Configuration error in <code>{validation.field}</code>:{" "}
            {validation.message}
          </p>
        )}
      </section>
    </main>
  );
}

function HeartLoadingMark() {
  return (
    <svg className="loading-mark" viewBox="0 0 64 58" aria-hidden="true">
      <path
        d="M32 56S4 39.8 4 18.6C4 8.9 10.6 3 19 3c5.2 0 10 2.8 13 8.2C35 5.8 39.8 3 45 3c8.4 0 15 5.9 15 15.6C60 39.8 32 56 32 56Z"
        fill="currentColor"
      />
    </svg>
  );
}

function getDevelopmentPreviewTimestamp(arrivalTimestamp: number): number | null {
  if (process.env.NODE_ENV === "production" || typeof window === "undefined") {
    return null;
  }

  const params = new URLSearchParams(window.location.search);
  const preview = params.get("preview");
  const explicitNow = params.get("now");

  if (explicitNow) {
    const parsed = Date.parse(explicitNow);
    return Number.isFinite(parsed) ? parsed : null;
  }

  switch (preview) {
    case "arrival":
      return arrivalTimestamp;
    case "1h":
      return arrivalTimestamp - 60 * 60 * 1_000;
    case "24h":
      return arrivalTimestamp - 24 * 60 * 60 * 1_000;
    case "3d":
      return arrivalTimestamp - 3 * 24 * 60 * 60 * 1_000;
    case "7d":
      return arrivalTimestamp - 7 * 24 * 60 * 60 * 1_000;
    case "14d":
      return arrivalTimestamp - 14 * 24 * 60 * 60 * 1_000;
    case "30d":
      return arrivalTimestamp - 30 * 24 * 60 * 60 * 1_000;
    case "31d":
      return arrivalTimestamp - 31 * 24 * 60 * 60 * 1_000;
    default:
      return null;
  }
}
