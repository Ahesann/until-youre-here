"use client";

import { useMemo } from "react";
import { getTimeRemaining } from "@/lib/countdown";
import { useClock } from "@/context/ClockContext";

export function useCountdown(arrivalTimestamp: number) {
  const { now } = useClock();

  return useMemo(
    () => getTimeRemaining(arrivalTimestamp, now),
    [arrivalTimestamp, now],
  );
}
