"use client";

import { RotateCcw } from "lucide-react";
import { siteConfig } from "@/config/site";

export function ResetExperienceButton({ onReplay }: { onReplay: () => void }) {
  return (
    <button
      type="button"
      className="quiet-button"
      onClick={onReplay}
      aria-label={siteConfig.copy.controls.replay}
    >
      <RotateCcw aria-hidden="true" size={16} />
      <span>{siteConfig.copy.controls.replay}</span>
    </button>
  );
}
