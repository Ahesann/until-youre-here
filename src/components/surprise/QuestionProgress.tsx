"use client";

import { Heart } from "lucide-react";

export function QuestionProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const safeTotal = Math.max(1, total);

  return (
    <div
      className="surprise-progress"
      aria-label={`Question ${Math.min(current + 1, safeTotal)} of ${safeTotal}`}
    >
      {Array.from({ length: safeTotal }, (_, index) => (
        <Heart
          key={index}
          aria-hidden="true"
          size={14}
          fill={index <= current ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}
