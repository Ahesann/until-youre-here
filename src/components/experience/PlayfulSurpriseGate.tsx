"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { Moon } from "lucide-react";
import { siteConfig } from "@/config/site";
import { PetalField } from "@/components/effects/PetalField";
import { StarField } from "@/components/effects/StarField";
import { HeartBurst } from "@/components/effects/HeartBurst";
import { PetalBurst } from "@/components/effects/PetalBurst";
import { HiddenHeart } from "@/components/surprise/HiddenHeart";
import { QuestionPanel } from "@/components/surprise/QuestionPanel";
import { QuestionProgress } from "@/components/surprise/QuestionProgress";
import { RunawayNoButton } from "@/components/surprise/RunawayNoButton";
import { SurpriseTitleBar } from "@/components/surprise/SurpriseTitleBar";
import { useElementRect } from "@/hooks/useElementRect";
import { usePlayfulGate } from "@/hooks/usePlayfulGate";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  clampPosition,
  findSafeRunawayPosition,
  type Point,
  type PositionConstraints,
  type Rect,
} from "@/lib/runaway-position";
import type { GateCompletionMethod } from "@/types";

const COMPLETION_DELAY_MS = 1_120;
const HIDDEN_HEART_DELAY_MS = 1_360;
const SKIP_DELAY_MS = 360;

export function PlayfulSurpriseGate({
  onComplete,
  onMoon,
}: {
  onComplete: (method: GateCompletionMethod) => void;
  onMoon: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const { state, dispatch, questions, currentQuestion, escapeMessage } =
    usePlayfulGate();
  const titleId = useId();
  const questionId = useId();
  const descriptionId = useId();
  const [playAreaRef, playAreaRect] = useElementRect<HTMLDivElement>();
  const yesRef = useRef<HTMLButtonElement | null>(null);
  const noRef = useRef<HTMLButtonElement | null>(null);
  const hiddenHeartRef = useRef<HTMLButtonElement | null>(null);
  const lastEscapeAtRef = useRef(0);
  const completionTimerRef = useRef<number | null>(null);
  const [noPosition, setNoPosition] = useState<Point | null>(null);
  const [heartPulseKey, setHeartPulseKey] = useState(0);
  const [smallBurstKey, setSmallBurstKey] = useState(0);
  const [largeBurstKey, setLargeBurstKey] = useState(0);

  const gateConfig = siteConfig.playfulGate;
  const disabled = state.phase !== "questions";
  const finalQuestion = state.questionIndex >= questions.length - 1;
  const heartProminent =
    state.noEscapeCount >=
    Math.max(
      gateConfig.hiddenHeartAfterNoEscapes,
      gateConfig.autoRevealHeartAfterNoEscapes,
    );

  const getConstraints = useCallback((): PositionConstraints | null => {
    const playArea = playAreaRef.current;
    const yesButton = yesRef.current;

    if (!playArea || !yesButton) {
      return null;
    }

    const containerRect = playArea.getBoundingClientRect();
    const yesRect = toLocalRect(yesButton.getBoundingClientRect(), containerRect);
    const noRect = noRef.current?.getBoundingClientRect();
    const obstacleRects = [yesRect];

    if (state.hiddenHeartVisible && hiddenHeartRef.current) {
      obstacleRects.push(
        toLocalRect(hiddenHeartRef.current.getBoundingClientRect(), containerRect),
      );
    }

    return {
      containerWidth: containerRect.width,
      containerHeight: containerRect.height,
      buttonWidth: Math.max(68, noRect?.width ?? 68),
      buttonHeight: Math.max(44, noRect?.height ?? 44),
      padding: containerRect.width <= 340 ? 12 : 16,
      minimumTravelDistance: containerRect.width <= 340 ? 60 : 80,
      obstacleRects,
      obstacleGap: 12,
    };
  }, [playAreaRef, state.hiddenHeartVisible]);

  const getInitialNoPosition = useCallback((constraints: PositionConstraints) => {
    return clampPosition(
      {
        x:
          constraints.containerWidth -
          constraints.buttonWidth -
          Math.max(18, constraints.padding),
        y:
          constraints.containerHeight -
          constraints.buttonHeight -
          Math.max(18, constraints.padding),
      },
      constraints,
    );
  }, []);

  const scheduleComplete = useCallback(
    (method: GateCompletionMethod, delay: number) => {
      if (completionTimerRef.current !== null) {
        window.clearTimeout(completionTimerRef.current);
      }

      completionTimerRef.current = window.setTimeout(() => {
        dispatch({ type: "completed" });
        onComplete(method);
      }, reduceMotion ? Math.min(delay, 420) : delay);
    },
    [dispatch, onComplete, reduceMotion],
  );

  useEffect(() => {
    return () => {
      if (completionTimerRef.current !== null) {
        window.clearTimeout(completionTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!playAreaRect) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      const constraints = getConstraints();

      if (!constraints) {
        return;
      }

      setNoPosition((current) =>
        clampPosition(current ?? getInitialNoPosition(constraints), constraints),
      );
    });

    return () => window.cancelAnimationFrame(frameId);
  }, [
    getConstraints,
    getInitialNoPosition,
    playAreaRect,
    state.hiddenHeartVisible,
    currentQuestion,
  ]);

  const complete = useCallback(
    (method: GateCompletionMethod) => {
      if (disabled) {
        return;
      }

      dispatch({ type: "complete", method });
      setHeartPulseKey((current) => current + 1);
      setLargeBurstKey((current) => current + 1);

      if ("vibrate" in navigator) {
        try {
          navigator.vibrate(method === "skip" ? 12 : 20);
        } catch {
          // Vibration is a small enhancement only.
        }
      }

      scheduleComplete(method, method === "skip" ? SKIP_DELAY_MS : COMPLETION_DELAY_MS);
    },
    [disabled, dispatch, scheduleComplete],
  );

  const handleYes = () => {
    if (disabled) {
      return;
    }

    setHeartPulseKey((current) => current + 1);
    setSmallBurstKey((current) => current + 1);

    if ("vibrate" in navigator) {
      try {
        navigator.vibrate(15);
      } catch {
        // Vibration is a small enhancement only.
      }
    }

    if (finalQuestion) {
      complete("yes");
      return;
    }

    dispatch({ type: "advance-question", questionCount: questions.length });
  };

  const handleRunaway = (
    event: ReactPointerEvent<HTMLButtonElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const now = Date.now();
    if (now - lastEscapeAtRef.current < 150) {
      return;
    }
    lastEscapeAtRef.current = now;

    const constraints = getConstraints();
    const playArea = playAreaRef.current;

    if (!constraints || !playArea) {
      dispatch({
        type: "no-escaped",
        revealThreshold: gateConfig.hiddenHeartAfterNoEscapes,
      });
      return;
    }

    const containerRect = playArea.getBoundingClientRect();
    const pointerPosition = {
      x: "clientX" in event ? event.clientX - containerRect.left : constraints.containerWidth / 2,
      y: "clientY" in event ? event.clientY - containerRect.top : constraints.containerHeight / 2,
    };
    const currentPosition = noPosition ?? getInitialNoPosition(constraints);

    setNoPosition(
      findSafeRunawayPosition({
        currentPosition,
        pointerPosition,
        constraints,
      }),
    );
    dispatch({
      type: "no-escaped",
      revealThreshold: gateConfig.hiddenHeartAfterNoEscapes,
    });
    setHeartPulseKey((current) => current + 1);

    if (state.noEscapeCount % 2 === 0) {
      setSmallBurstKey((current) => current + 1);
    }
  };

  const handleKeyboardNo = () => {
    if (disabled) {
      return;
    }

    dispatch({
      type: "keyboard-no",
      revealThreshold: gateConfig.hiddenHeartAfterNoEscapes,
    });
    setHeartPulseKey((current) => current + 1);
    setSmallBurstKey((current) => current + 1);
  };

  const handleHiddenHeart = () => {
    if (disabled || !state.hiddenHeartVisible) {
      return;
    }

    dispatch({ type: "hidden-heart-found" });
    setHeartPulseKey((current) => current + 1);
    setLargeBurstKey((current) => current + 1);

    if ("vibrate" in navigator) {
      try {
        navigator.vibrate([20, 40, 20]);
      } catch {
        // Vibration is a small enhancement only.
      }
    }

    scheduleComplete("hidden-heart", HIDDEN_HEART_DELAY_MS);
  };

  return (
    <section
      className={`playful-gate ${
        state.phase === "hidden-heart-message" || state.phase === "completing"
          ? "is-warming"
          : ""
      }`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-testid="playful-surprise-gate"
    >
      <StarField expanded={state.phase !== "questions"} />
      <PetalField count={7} />
      <button
        type="button"
        className="moon-button"
        onClick={onMoon}
        aria-label="Send a thought to the moon"
      >
        <Moon aria-hidden="true" size={36} />
      </button>
      <div className="playful-background-dim" aria-hidden="true" />
      <motion.div
        className="surprise-window"
        role="dialog"
        aria-modal="false"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
        transition={{ duration: reduceMotion ? 0.08 : 0.34, ease: "easeOut" }}
      >
        <SurpriseTitleBar
          title={gateConfig.windowTitle}
          pulseKey={heartPulseKey}
        />
        <div className="surprise-window-body">
          <h1 id={titleId} className="sr-only">
            {gateConfig.windowTitle}
          </h1>
          <p id={descriptionId} className="sr-only">
            A playful romantic question game before the countdown.
          </p>
          <QuestionPanel question={currentQuestion} id={questionId} />
          <div
            ref={playAreaRef}
            className="surprise-play-area"
            data-testid="surprise-play-area"
          >
            <AnimatePresence>
              {state.phase === "questions" ? (
                <motion.button
                  ref={yesRef}
                  type="button"
                  className="surprise-button surprise-yes"
                  onClick={handleYes}
                  disabled={disabled}
                  aria-describedby={questionId}
                  data-testid="surprise-yes-button"
                  whileTap={reduceMotion ? undefined : { scale: 0.98, y: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                >
                  {gateConfig.yesLabel || "Yes"}
                </motion.button>
              ) : null}
              {state.phase === "questions" ? (
                <RunawayNoButton
                  label={gateConfig.noLabel || "No"}
                  position={noPosition}
                  disabled={disabled}
                  buttonRef={noRef}
                  onRunAway={handleRunaway}
                  onKeyboardAttempt={handleKeyboardNo}
                />
              ) : null}
            </AnimatePresence>
            <HiddenHeart
              visible={state.hiddenHeartVisible}
              prominent={heartProminent}
              found={state.phase === "hidden-heart-message"}
              disabled={disabled}
              buttonRef={hiddenHeartRef}
              onFound={handleHiddenHeart}
            />
            <HeartBurst burstKey={smallBurstKey} count={3} />
            <HeartBurst burstKey={largeBurstKey} count={28} large />
            <PetalBurst burstKey={largeBurstKey} count={16} />
          </div>
          <AnimatePresence mode="wait">
            {escapeMessage && state.phase === "questions" ? (
              <motion.p
                key={escapeMessage}
                className="surprise-escape-caption"
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: reduceMotion ? 0.05 : 0.24 }}
              >
                {escapeMessage}
              </motion.p>
            ) : (
              <motion.p
                key="quiet"
                className="surprise-escape-caption is-empty"
                aria-hidden="true"
              >
                Keep the little window close.
              </motion.p>
            )}
          </AnimatePresence>
          <QuestionProgress current={state.questionIndex} total={questions.length} />
          <button
            type="button"
            className="surprise-skip"
            onClick={() => complete("skip")}
            disabled={disabled}
          >
            {gateConfig.skipLabel || "Skip the little game"}
          </button>
        </div>
      </motion.div>
    </section>
  );
}

function toLocalRect(rect: DOMRect, containerRect: DOMRect): Rect {
  return {
    x: rect.left - containerRect.left,
    y: rect.top - containerRect.top,
    width: rect.width,
    height: rect.height,
  };
}
