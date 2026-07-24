"use client";

import { useMemo, useState } from "react";
import { CountdownCard } from "@/components/countdown/CountdownCard";
import { formatUnit } from "@/lib/countdown";
import { useTapSequence } from "@/hooks/useTapSequence";
import type { TimeRemaining } from "@/types";

export function CountdownDisplay({
  remaining,
  onSecondsEasterEgg,
}: {
  remaining: TimeRemaining;
  onSecondsEasterEgg: () => void;
}) {
  const [frozenSeconds, setFrozenSeconds] = useState<number | null>(null);
  const triggerSecondsEgg = useTapSequence({
    requiredTaps: 7,
    windowMs: 3_800,
    onComplete: () => {
      setFrozenSeconds(remaining.seconds);
      onSecondsEasterEgg();
      window.setTimeout(() => setFrozenSeconds(null), 1_000);
    },
  });

  const accessibleSummary = useMemo(() => {
    if (remaining.hasArrived) {
      return "The arrival moment has arrived.";
    }

    return [
      formatUnit(remaining.days, "day"),
      formatUnit(remaining.hours, "hour"),
      formatUnit(remaining.minutes, "minute"),
    ].join(", ");
  }, [remaining.days, remaining.hours, remaining.minutes, remaining.hasArrived]);

  const parts = useMemo(
    () => [
      { key: "days" as const, label: "days", value: remaining.days },
      { key: "hours" as const, label: "hours", value: remaining.hours },
      { key: "minutes" as const, label: "minutes", value: remaining.minutes },
      {
        key: "seconds" as const,
        label: "seconds",
        value: frozenSeconds ?? remaining.seconds,
      },
    ],
    [frozenSeconds, remaining.days, remaining.hours, remaining.minutes, remaining.seconds],
  );

  return (
    <>
      <div className="countdown-grid" aria-live="off" data-testid="countdown-grid">
        {parts.map((part) => (
          <CountdownCard
            key={part.key}
            part={part}
            asButton={part.key === "seconds"}
            onActivate={part.key === "seconds" ? triggerSecondsEgg : undefined}
          />
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {accessibleSummary}
      </p>
    </>
  );
}
