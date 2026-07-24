"use client";

import { useMemo } from "react";
import { calculateJourneyProgress } from "@/lib/countdown";
import { useClock } from "@/context/ClockContext";

export function useCountdownProgress(
  countdownStartTimestamp: number,
  arrivalTimestamp: number,
) {
  const { now } = useClock();

  return useMemo(
    () => calculateJourneyProgress(countdownStartTimestamp, arrivalTimestamp, now),
    [arrivalTimestamp, countdownStartTimestamp, now],
  );
}
