"use client";

import { formatUnit } from "@/lib/countdown";
import type { CountdownPart } from "@/types";

export function CountdownCard({
  part,
  asButton = false,
  onActivate,
}: {
  part: CountdownPart;
  asButton?: boolean;
  onActivate?: () => void;
}) {
  const value = String(part.value).padStart(part.key === "days" ? 2 : 2, "0");
  const content = (
    <>
      <span className="countdown-value" aria-hidden="true">
        <span>{value}</span>
      </span>
      <span className="countdown-label">{part.label}</span>
    </>
  );

  if (asButton) {
    return (
      <div className="countdown-card glass">
        <button
          type="button"
          className="seconds-button"
          onClick={onActivate}
          aria-label={`${formatUnit(part.value, "second")} remaining`}
        >
          {content}
        </button>
      </div>
    );
  }

  return (
    <div
      className="countdown-card glass"
      aria-label={`${formatUnit(part.value, part.label.slice(0, -1))} remaining`}
    >
      {content}
    </div>
  );
}
