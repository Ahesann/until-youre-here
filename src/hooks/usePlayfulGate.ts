"use client";

import { useMemo, useReducer } from "react";
import { siteConfig } from "@/config/site";
import { interpolateText } from "@/lib/text-interpolation";
import type { GateCompletionMethod } from "@/types";

export type GatePhase =
  | "questions"
  | "hidden-heart-message"
  | "completing"
  | "completed";

export type GateState = {
  phase: GatePhase;
  questionIndex: number;
  noEscapeCount: number;
  hiddenHeartVisible: boolean;
  completionMethod: GateCompletionMethod | null;
};

type GateAction =
  | { type: "advance-question"; questionCount: number }
  | { type: "no-escaped"; revealThreshold: number }
  | { type: "keyboard-no"; revealThreshold: number }
  | { type: "hidden-heart-found" }
  | { type: "complete"; method: GateCompletionMethod }
  | { type: "completed" }
  | { type: "reset" };

export const initialGateState: GateState = {
  phase: "questions",
  questionIndex: 0,
  noEscapeCount: 0,
  hiddenHeartVisible: false,
  completionMethod: null,
};

export function playfulGateReducer(
  state: GateState,
  action: GateAction,
): GateState {
  if (state.phase === "completed") {
    return action.type === "reset" ? initialGateState : state;
  }

  switch (action.type) {
    case "advance-question": {
      if (state.phase !== "questions") {
        return state;
      }

      const finalIndex = Math.max(0, action.questionCount - 1);

      if (state.questionIndex >= finalIndex) {
        return {
          ...state,
          phase: "completing",
          completionMethod: "yes",
        };
      }

      return {
        ...state,
        questionIndex: Math.min(finalIndex, state.questionIndex + 1),
      };
    }

    case "no-escaped": {
      if (state.phase !== "questions") {
        return state;
      }

      const noEscapeCount = state.noEscapeCount + 1;

      return {
        ...state,
        noEscapeCount,
        hiddenHeartVisible:
          state.hiddenHeartVisible || noEscapeCount >= action.revealThreshold,
      };
    }

    case "keyboard-no": {
      if (state.phase !== "questions") {
        return state;
      }

      return {
        ...state,
        noEscapeCount: state.noEscapeCount + 1,
        hiddenHeartVisible: true,
      };
    }

    case "hidden-heart-found":
      if (state.phase !== "questions") {
        return state;
      }

      return {
        ...state,
        phase: "hidden-heart-message",
        hiddenHeartVisible: true,
        completionMethod: "hidden-heart",
      };

    case "complete":
      if (state.phase !== "questions") {
        return state;
      }

      return {
        ...state,
        phase: "completing",
        completionMethod: action.method,
      };

    case "completed":
      return {
        ...state,
        phase: "completed",
      };

    case "reset":
      return initialGateState;

    default:
      return state;
  }
}

export function usePlayfulGate() {
  const [state, dispatch] = useReducer(playfulGateReducer, initialGateState);
  const gateConfig = siteConfig.playfulGate;
  const configuredQuestions: readonly string[] = gateConfig.questions;
  const noEscapeMessages: readonly string[] = gateConfig.noEscapeMessages;
  const questions = useMemo(
    () =>
      configuredQuestions.length > 0
        ? configuredQuestions
        : ["Are you ready for a little surprise, {wifeName}?"],
    [configuredQuestions],
  );

  const interpolationValues = useMemo(
    () => ({
      wifeName: siteConfig.people.wifeName,
      husbandName: siteConfig.people.husbandName,
    }),
    [],
  );

  const currentQuestion = useMemo(() => {
    if (state.phase === "hidden-heart-message") {
      return interpolateText(gateConfig.hiddenHeartMessage, interpolationValues);
    }

    if (state.phase === "completing" || state.phase === "completed") {
      return interpolateText(gateConfig.finalQuestionMessage, interpolationValues);
    }

    return interpolateText(
      questions[Math.min(state.questionIndex, questions.length - 1)],
      interpolationValues,
    );
  }, [
    gateConfig.finalQuestionMessage,
    gateConfig.hiddenHeartMessage,
    interpolationValues,
    questions,
    state.phase,
    state.questionIndex,
  ]);

  const escapeMessage = useMemo(() => {
    if (state.noEscapeCount <= 0 || noEscapeMessages.length === 0) {
      return "";
    }

    const index = Math.min(
      state.noEscapeCount - 1,
      noEscapeMessages.length - 1,
    );

    return interpolateText(noEscapeMessages[index], interpolationValues);
  }, [interpolationValues, noEscapeMessages, state.noEscapeCount]);

  return {
    state,
    dispatch,
    questions,
    currentQuestion,
    escapeMessage,
  };
}
