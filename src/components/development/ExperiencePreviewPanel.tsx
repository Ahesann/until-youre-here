"use client";

import { siteConfig } from "@/config/site";
import { MS_PER_DAY } from "@/lib/countdown";
import { useClock } from "@/context/ClockContext";
import { useMotionPreference } from "@/context/MotionPreferenceContext";

const MS_PER_HOUR = 60 * 60 * 1_000;

const previewStates = [
  { label: "> 30 days", offset: 31 * MS_PER_DAY },
  { label: "30 days", offset: 30 * MS_PER_DAY },
  { label: "14 days", offset: 14 * MS_PER_DAY },
  { label: "7 days", offset: 7 * MS_PER_DAY },
  { label: "3 days", offset: 3 * MS_PER_DAY },
  { label: "24 hours", offset: 24 * MS_PER_HOUR },
  { label: "1 hour", offset: MS_PER_HOUR },
  { label: "Arrival", offset: 0 },
] as const;

export function ExperiencePreviewPanel({
  arrivalTimestamp,
}: {
  arrivalTimestamp: number;
}) {
  const { overrideNow, setOverrideNow } = useClock();
  const { simulateReducedMotion, setSimulateReducedMotion } =
    useMotionPreference();

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <details className="dev-panel">
      <summary>Preview states</summary>
      <div className="dev-grid">
        {previewStates.map((state) => (
          <button
            type="button"
            key={state.label}
            onClick={() => setOverrideNow(arrivalTimestamp - state.offset)}
          >
            {state.label}
          </button>
        ))}
        <button type="button" onClick={() => setOverrideNow(null)}>
          Real time
        </button>
        <label>
          <input
            type="checkbox"
            checked={simulateReducedMotion}
            onChange={(event) => setSimulateReducedMotion(event.target.checked)}
          />
          Reduced motion
        </label>
      </div>
      <p className="sr-only" aria-live="polite">
        {overrideNow
          ? `Previewing ${new Date(overrideNow).toISOString()} for ${siteConfig.copy.metadata.title}.`
          : "Preview clock reset to real time."}
      </p>
    </details>
  );
}
