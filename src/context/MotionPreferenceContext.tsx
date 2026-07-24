"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion as useMotionReducedMotion } from "motion/react";

type MotionPreferenceContextValue = {
  reduceMotion: boolean;
  simulateReducedMotion: boolean;
  setSimulateReducedMotion: (value: boolean) => void;
};

const MotionPreferenceContext =
  createContext<MotionPreferenceContextValue | null>(null);

export function MotionPreferenceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const prefersReducedMotion = useMotionReducedMotion() ?? false;
  const [simulateReducedMotion, setSimulateReducedMotion] = useState(false);

  const value = useMemo(
    () => ({
      reduceMotion: prefersReducedMotion || simulateReducedMotion,
      simulateReducedMotion,
      setSimulateReducedMotion,
    }),
    [prefersReducedMotion, simulateReducedMotion],
  );

  return (
    <MotionPreferenceContext.Provider value={value}>
      {children}
    </MotionPreferenceContext.Provider>
  );
}

export function useMotionPreference(): MotionPreferenceContextValue {
  const context = useContext(MotionPreferenceContext);

  if (!context) {
    throw new Error(
      "useMotionPreference must be used inside MotionPreferenceProvider.",
    );
  }

  return context;
}
